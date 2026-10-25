import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import type { IncomingMessage, ServerResponse } from 'http';
import {
  getRandomScenario,
  getDiverseSentenceFallbacks,
  getDiverseListeningFallbacks,
  getDiverseVocabularyFallbacks,
} from './challengeDiversity.ts';
import { diagnoseSentenceLocally } from './sentenceDiagnostics.ts';

let ttsQuotaExhaustedUntil = 0;
let primaryModelCooldownUntil = 0;
const serverTtsCache = new Map<string, { audioBase64: string; mimeType: string }>();

function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
      retryOptions: {
        attempts: 1,
      },
    },
  });
}

async function generateFastTextContent(
  ai: GoogleGenAI,
  params: {
    contents: any;
    config?: any;
    timeoutMs?: number;
  }
) {
  const timeoutMs = params.timeoutMs || 25000;
  // Always try gemini-3.1-flash-lite first for stability and speed, then gemini-3.8-flash
  const modelsToTry = ['gemini-3.1-flash-lite', 'gemini-3.8-flash'];

  let lastError: any = null;
  for (const model of modelsToTry) {
    try {
      const config: any = {
        ...params.config,
        abortSignal: AbortSignal.timeout(timeoutMs),
      };
      const response = await ai.models.generateContent({
        model,
        contents: params.contents,
        config,
      });
      if (response && response.text) {
        return response;
      }
    } catch (err: any) {
      lastError = err;
      const msg = String(err?.message || err || '');
      console.warn(`[AI Studio] Model ${model} returned error, falling back:`, msg.slice(0, 150));
      // Try next model immediately
      continue;
    }
  }
  throw lastError || new Error('All Gemini models timed out or failed');
}

export type TutorMode =
  | 'grammar'
  | 'conversation'
  | 'vocabulary'
  | 'sentence_builder'
  | 'pronunciation'
  | 'writing'
  | 'business'
  | 'ielts';

const TUTOR_SYSTEM_PROMPTS: Record<TutorMode, string> = {
  grammar: `أنت معلّم لغة إنجليزية محترف متخصص للناطقين باللغة العربية في منصة فارس (Fares English). اشرح القواعد بوضوح وقارن دائماً بين الفروق اللغوية بين العربية والإنجليزية (مثل حذف فعل الكينونة To Be، وترتيب الصفات، وحروف الجر in/on/at). قدم أمثلة واضحة وشجع المتعلم بحرارة.`,
  conversation: `You are "Fares Tutor", a warm, encouraging, native-level English conversation partner designed specifically for Arabic native speakers. Guidelines: 1. Conduct the main conversation in natural, clear English adapted to the learner's estimated level (A0 to C2). 2. If the user makes grammatical or phrasing errors, acknowledge their message first, keep the conversation flow going naturally, and provide the corrected version in the "correction" JSON field. 3. If the user speaks or writes in Arabic, understand it completely, help them express that exact idea in natural English, and ask a friendly follow-up question in simple English. 4. Keep turns concise and conversational (1-3 sentences per turn) so the user gets to speak frequently and feels confident. 5. MANDATORY: You MUST ALWAYS provide the complete, fluent, accurate Modern Standard Arabic translation of your entire response in the "translationAr" JSON field, and clean English-only text in "englishAudioText" for natural voice synthesis.`,
  vocabulary: `أنت خبير مفردات إنجليزية للناطقين بالعربية. اشرح الكلمات من خلال المتلازمات اللفظية (Collocations) وحذر دائماً من الأصدقاء المزيفين (False Friends) والترجمة الحرفية الخاطئة.`,
  sentence_builder: `أنت مدرب تركيب الجمل الإنجليزية للناطقين بالعربية. ركز على الترتيب الطبيعي للجملة الإنجليزية (SVO: Subject + Verb + Object) وروابط الجمل المناسبة.`,
  pronunciation: `أنت مدرب نطق صوتي متخصص للأصوات التي تشكل تحدياً للناطقين بالعربية، مثل التمييز بين /p/ و /b/، وبين /v/ و /f/، وصوت الشوا (Schwa) وعناقيد الصوامت.`,
  writing: `أنت مدرب كتابة احترافية للبريد الإلكتروني والمقالات. قدم الصياغة المصححة والصياغة الطبيعية الأرقى (Native Upgrade).`,
  business: `أنت مدرب إنجليزية مهنية للأعمال والمقابلات الوظيفية والاجتماعات الدولية.`,
  ielts: `أنت مقيّم ومدرب اختبارات آيلتس وتوفل، تساعد المتعلم على الوصول إلى درجات متقدمة Band 7.5+.`,
};

async function readBody(req: IncomingMessage): Promise<any> {
  if (req.readableEnded || (req as any)._readableState?.ended) {
    return (req as any).body || {};
  }
  return new Promise((resolve) => {
    let data = '';
    const timer = setTimeout(() => resolve((req as any).body || {}), 1500);
    req.on('data', (chunk) => {
      data += chunk;
      if (data.length > 10e6) {
        clearTimeout(timer);
        req.destroy();
        resolve({});
      }
    });
    req.on('end', () => {
      clearTimeout(timer);
      if (!data) return resolve((req as any).body || {});
      try {
        resolve(JSON.parse(data));
      } catch {
        resolve((req as any).body || {});
      }
    });
    req.on('error', () => {
      clearTimeout(timer);
      resolve((req as any).body || {});
    });
  });
}

function sendJson(res: ServerResponse, statusCode: number, data: any) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(data));
}

function safeParseJson(rawText: string | undefined): any {
  if (!rawText) return {};
  const trimmed = rawText.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const cleaned = trimmed
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/, '')
      .trim();
    try {
      return JSON.parse(cleaned);
    } catch {
      const firstBrace = cleaned.indexOf('{');
      const lastBrace = cleaned.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace > firstBrace) {
        try {
          return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1));
        } catch {
          return {};
        }
      }
      return {};
    }
  }
}

function buildValidGeminiContents(
  history: Array<{ sender?: string; text?: string }>,
  currentMessage: string
): Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> {
  const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];
  if (Array.isArray(history)) {
    for (const item of history.slice(-8)) {
      const text = (item?.text || '').trim();
      if (!text) continue;
      const role: 'user' | 'model' = item.sender === 'user' ? 'user' : 'model';
      if (contents.length === 0 && role === 'model') {
        continue;
      }
      const prev = contents[contents.length - 1];
      if (prev && prev.role === role) {
        prev.parts[0].text += `\n${text}`;
      } else {
        contents.push({ role, parts: [{ text }] });
      }
    }
  }
  const cleanMsg = currentMessage.trim();
  const last = contents[contents.length - 1];
  if (last && last.role === 'user') {
    last.parts[0].text += `\n${cleanMsg}`;
  } else {
    contents.push({ role: 'user', parts: [{ text: cleanMsg }] });
  }
  return contents;
}

export async function handleGeminiApiRoute(
  req: IncomingMessage,
  res: ServerResponse
): Promise<boolean> {
  const rawUrl = req.url || '';
  const url = rawUrl.split('?')[0];

  if (!url.startsWith('/api/gemini')) {
    return false;
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return true;
  }

  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method not allowed' });
    return true;
  }

  try {
    const body =
      (req as any).body && typeof (req as any).body === 'object'
        ? (req as any).body
        : req.readableEnded
        ? {}
        : await readBody(req);

    const ai = getAiClient();

    // 1. /api/gemini/chat
    if (url === '/api/gemini/chat') {
      const {
        message,
        mode = 'grammar',
        history = [],
        learningLevel = 'B1',
        dialect = 'fusha',
        roleplayScenario,
        industryInterests = [],
      } = body;

      if (!message || typeof message !== 'string') {
        sendJson(res, 400, { error: 'Message is required' });
        return true;
      }

      const tutorMode = (mode as TutorMode) in TUTOR_SYSTEM_PROMPTS ? (mode as TutorMode) : 'grammar';
      const baseSystemPrompt = TUTOR_SYSTEM_PROMPTS[tutorMode];

      let dialectNote = 'اللهجة المفضلة للتفسير: الفصحى الحديثة.';
      if (dialect === 'gulf') dialectNote = 'اللهجة المفضلة للتفسير: الخليجية.';
      else if (dialect === 'egyptian') dialectNote = 'اللهجة المفضلة للتفسير: المصرية.';
      else if (dialect === 'levantine') dialectNote = 'اللهجة المفضلة للتفسير: الشامية.';
      else if (dialect === 'maghrebi') dialectNote = 'اللهجة المفضلة للتفسير: المغاربية.';

      const scenarioNote =
        roleplayScenario && roleplayScenario !== 'free_chat'
          ? `سيناريو المحادثة المحدد: "${roleplayScenario}". تقمص دور الطرف الآخر في هذا الموقف بحرارة وواقعية.`
          : tutorMode === 'conversation'
          ? `المحادثة الحرة (Free Chat). تحدث في مواضيع الحياة اليومية والاهتمامات.`
          : '';

      const domainNote =
        Array.isArray(industryInterests) && industryInterests.length > 0
          ? `اهتمامات المتعلم المهنية: ${industryInterests.join(', ')}.`
          : '';

      let levelDifficultyRules = '';
      if (learningLevel === 'A0') {
        levelDifficultyRules = `المستوى الحالي للمتعلم هو A0 (مبتدئ تماماً). استخدم جملاً إنجليزية فائقة البساطة وقصيرة (3 إلى 5 كلمات فقط مثل: "Hello! I like coffee. Do you like tea?"). استخدم أفعالاً أساسية فقط مع بطاقة vocabHighlight عند الحاجة.`;
      } else if (learningLevel === 'A1') {
        levelDifficultyRules = `المستوى الحالي للمتعلم هو A1 (مبتدئ). استخدم جملاً بسيطة وواضحة (5 إلى 8 كلمات) وركز على المواقف اليومية.`;
      } else if (learningLevel === 'A2') {
        levelDifficultyRules = `المستوى الحالي للمتعلم هو A2. استخدم جملاً مركبة بسيطة وأدوات ربط مثل because, so, but.`;
      } else if (learningLevel === 'B1') {
        levelDifficultyRules = `المستوى الحالي للمتعلم هو B1. ناقش مواضيع العمل والأهداف اليومية بطلاقة.`;
      } else {
        levelDifficultyRules = `المستوى الحالي للمتعلم هو ${learningLevel}. استخدم تعابير اصطلاحية ومفردات غنية ومتنوعة.`;
      }

      const systemInstruction = `${baseSystemPrompt}
مستوى المتعلم المستهدف: ${learningLevel}.
${levelDifficultyRules}
${dialectNote}
${domainNote}
${scenarioNote}

أجب دائماً بصيغة JSON تطابق الحقول التالية بدقة:
- reply: ردك الإنجليزي الودود الواضح المشجع.
- translationAr: الترجمة العربية الدقيقة والكاملة لردك باللغة العربية الفصحى.
- englishAudioText: نص إنجليزي نظيف لردك بدون أي رموز أو عربية للنطق الصوتي.
- correction: في حال ارتكب المتعلم خطأً، قدم كائناً يحتوي على: { "original": "الخطأ", "corrected": "الصواب", "explanationAr": "شرح الخطأ بالعربية" } وإلا null.
- vocabHighlight: كلمة مميزة في ردك تفيد المتعلم: { "word": "الكلمة", "ipa": "/النطق/", "arabicPhonetic": "النطق بالعربية", "arabicMeaning": "المعنى بالعربية", "exampleEn": "مثال", "exampleAr": "ترجمة المثال" } وإلا null.`;

      if (!ai) {
        sendJson(res, 200, {
          reply: `You said: "${message}". Let's practice English together! How is your day going so far?`,
          translationAr: 'أنت قلت: "' + message + '". دعنا نتدرب على الإنجليزية معاً! كيف يسير يومك حتى الآن؟',
          englishAudioText: "Let's practice English together! How is your day going so far?",
          correction: null,
          vocabHighlight: {
            word: 'Practice',
            ipa: '/ˈpræk.tɪs/',
            arabicPhonetic: 'بْراكْتِيس',
            arabicMeaning: 'الممارسة والتمرين',
            exampleEn: 'Consistent practice builds confidence.',
            exampleAr: 'الممارسة المستمرة تبني الثقة.',
          },
        });
        return true;
      }

      const formattedContents = buildValidGeminiContents(history, message);
      let parsedChat: any = {};
      try {
        const response = await generateFastTextContent(ai, {
          contents: formattedContents,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            temperature: 0.6,
          },
        });
        parsedChat = safeParseJson(response.text);
        if (!parsedChat.reply && response.text) {
          parsedChat = {
            reply: response.text,
            translationAr: '',
            englishAudioText: response.text,
          };
        }
      } catch (chatErr) {
        console.warn('Chat generation error, using fallback response:', chatErr);
        parsedChat = {
          reply:
            tutorMode === 'conversation'
              ? `That sounds very interesting! Could you tell me a little more about that?`
              : `لقد طرحت سؤالاً حول "${message}". دعنا نتدرب على هذا المثال بوضوح.`,
          translationAr:
            tutorMode === 'conversation'
              ? 'يبدو ذلك ممتعاً جداً! هل يمكنك إخباري بالمزيد عن ذلك؟'
              : 'دعنا نستعرض مثالاً واضحاً معاً.',
          englishAudioText:
            tutorMode === 'conversation'
              ? 'That sounds very interesting! Could you tell me a little more about that?'
              : 'Let us look at a clear example together.',
          correction: null,
          vocabHighlight: null,
        };
      }

      sendJson(res, 200, {
        reply: parsedChat.reply || 'Welcome! Let us continue.',
        translationAr: parsedChat.translationAr || '',
        englishAudioText: parsedChat.englishAudioText || parsedChat.reply || '',
        correction: parsedChat.correction || null,
        vocabHighlight: parsedChat.vocabHighlight || null,
      });
      return true;
    }

    // 2. /api/gemini/correct (Sentence Doctor & Immediate Linguistic Diagnostics)
    if (url === '/api/gemini/correct') {
      const textParam = body.text || body.sentence || '';
      const { context = 'general' } = body;
      if (!textParam || typeof textParam !== 'string') {
        sendJson(res, 400, { error: 'Text to correct is required' });
        return true;
      }

      const trimmedText = textParam.trim();
      const localDiagnosis = diagnoseSentenceLocally(trimmedText);

      if (!ai) {
        sendJson(res, 200, localDiagnosis);
        return true;
      }

      const prompt = `You are an expert bilingual Arabic-English senior linguist and pedagogical evaluator in the Fares English platform.
Analyze the following English sentence written by an Arabic speaker:
"${trimmedText}"
Context: ${context}

CRITICAL RULES:
1. "isCorrect" MUST be false if there is ANY spelling mistake (e.g. 'friens' instead of 'friends', 'et' instead of 'at'), grammatical flaw, wrong preposition, wrong verb tense, or missing copula ('am/is/are').
2. Only return "isCorrect": true if the original text is completely free of any spelling, grammar, or word-choice errors.
3. "corrected": The standard, grammatically correct and correctly spelled English version.
4. "naturalAlternative": The most elegant, idiomatic, natural native phrasing.
5. "errorTypeAr": Specific error category in Arabic (e.g., "أخطاء إملائية وحروف الجر", "حذف فعل الكينونة To Be", "تصريف الفعل الماضي بعد did").
6. "explanationAr": Clear, engaging, comprehensive explanation in Arabic detailing what was wrong with each word and the grammatical rule to remember.
7. "arabicMotherTongueInfluence": Detailed explanation of how thinking in Arabic or Arabic phonetics caused this error (e.g., التفكير في الجملة الاسمية العربية، الترجمة الحرفية لحروف الجر، الخلط الصوتي بين الحروف).
8. "miniQuiz": An interactive multiple-choice question testing the rule with:
   {
     "questionAr": "السؤال بالعربية",
     "options": ["خيار 1", "خيار 2", "خيار 3"],
     "correctIndex": 0,
     "explanationAr": "شرح الإجابة الصحيحة"
   }`;

      try {
        const response = await generateFastTextContent(ai, {
          contents: prompt,
          config: {
            systemInstruction:
              'You are an authoritative bilingual Arabic-English linguist. You must strictly identify any spelling or grammatical flaw in English text. Return valid JSON only.',
            responseMimeType: 'application/json',
            temperature: 0.15,
          },
        });
        const parsed = safeParseJson(response.text);

        const parsedCorrected = (parsed.corrected || localDiagnosis.corrected || trimmedText).trim();
        const normOriginal = trimmedText.toLowerCase().replace(/[^a-z0-9]/g, '');
        const normCorrected = parsedCorrected.toLowerCase().replace(/[^a-z0-9]/g, '');
        const isIdentical = normOriginal === normCorrected;

        // If corrected differs from original, it is strictly NOT correct!
        const finalIsCorrect = isIdentical && (parsed.isCorrect === true || parsed.isCorrect === 'true');

        sendJson(res, 200, {
          original: trimmedText,
          isCorrect: finalIsCorrect,
          corrected: parsedCorrected,
          naturalAlternative: parsed.naturalAlternative || parsedCorrected,
          errorTypeAr: !finalIsCorrect
            ? parsed.errorTypeAr || localDiagnosis.errorTypeAr || 'تدقيق نحوي وإملائي'
            : 'صياغة ممتازة وسليمة',
          explanationAr: parsed.explanationAr || localDiagnosis.explanationAr,
          arabicMotherTongueInfluence:
            parsed.arabicMotherTongueInfluence || localDiagnosis.arabicMotherTongueInfluence,
          miniQuiz: parsed.miniQuiz || localDiagnosis.miniQuiz || null,
        });
      } catch (doctorErr) {
        console.warn('Sentence Doctor AI error, using local linguistic engine:', doctorErr);
        sendJson(res, 200, localDiagnosis);
      }
      return true;
    }

    // 3. /api/gemini/translate
    if (url === '/api/gemini/translate') {
      const { text, targetLang = 'ar' } = body;
      if (!text || typeof text !== 'string') {
        sendJson(res, 400, { error: 'Text is required' });
        return true;
      }
      const trimmedText = text.trim();
      const prompt = `Translate the following text accurately and idiomatically into ${
        targetLang === 'ar' ? 'Modern Standard Arabic for an Arabic learner of English' : 'natural English'
      }.
Original text: ${trimmedText}
Return JSON only:
{
  "translation": "Natural and precise translation in the target language",
  "phoneticAr": "Optional Arabic phonetic pronunciation",
  "notes": "Optional short note explaining any linguistic nuance"
}`;
      try {
        if (!ai) throw new Error('No client');
        const response = await generateFastTextContent(ai, {
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.3,
          },
        });
        const parsed = safeParseJson(response.text);
        sendJson(res, 200, {
          translation: parsed.translation || trimmedText,
          phoneticAr: parsed.phoneticAr || '',
          notes: parsed.notes || '',
          original: trimmedText,
        });
      } catch {
        sendJson(res, 200, {
          translation: trimmedText,
          phoneticAr: '',
          notes: '',
          original: trimmedText,
        });
      }
      return true;
    }

    // 4. /api/gemini/explain-word
    if (url === '/api/gemini/explain-word') {
      const { word, currentContext } = body;
      if (!word) {
        sendJson(res, 400, { error: 'Word is required' });
        return true;
      }
      const prompt = `اشرح هذه الكلمة الإنجليزية لمتعلم عربي: "${word}"
السياق: "${currentContext || ''}"
أرجع JSON بالصيغة:
1. word: الكلمة
2. ipa: الرمز الصوتي الدولي IPA
3. partOfSpeechAr: نوع الكلمة بالعربية
4. arabicMeaning: المعنى بالعربية
5. englishDefinition: تعريف إنجليزي بسيط
6. exampleSentence1: مثال إنجليزي
7. exampleSentence1Ar: ترجمة المثال بالعربية
8. commonCollocations: مصفوفة بمتلازمات شائعة
9. commonMistakeAr: خطأ شائع يقع فيه المتحدث العربي
10. level: مستوى CEFR المقدر (A1, A2, B1, B2, C1, C2)`;

      try {
        if (!ai) throw new Error('No client');
        const response = await generateFastTextContent(ai, {
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.2,
          },
        });
        const parsed = safeParseJson(response.text);
        sendJson(res, 200, {
          word: parsed.word || word,
          ipa: parsed.ipa || '',
          partOfSpeechAr: parsed.partOfSpeechAr || 'اسم/فعل',
          arabicMeaning: parsed.arabicMeaning || word,
          englishDefinition: parsed.englishDefinition || '',
          exampleSentence1: parsed.exampleSentence1 || currentContext || word,
          exampleSentence1Ar: parsed.exampleSentence1Ar || '',
          commonCollocations: Array.isArray(parsed.commonCollocations) ? parsed.commonCollocations : [],
          commonMistakeAr: parsed.commonMistakeAr || '',
          level: parsed.level || 'B1',
        });
      } catch {
        sendJson(res, 200, {
          word,
          ipa: '',
          partOfSpeechAr: 'كلمة',
          arabicMeaning: word,
          englishDefinition: `Definition of ${word}`,
          exampleSentence1: currentContext || `I use "${word}" in daily conversation.`,
          exampleSentence1Ar: `أستخدم "${word}" في محادثاتي اليومية.`,
          commonCollocations: [],
          commonMistakeAr: '',
          level: 'B1',
        });
      }
      return true;
    }

    // 5. /api/gemini/tts
    if (url === '/api/gemini/tts') {
      const { text, accent = 'US' } = body;
      if (!text || typeof text !== 'string') {
        sendJson(res, 400, { error: 'Text is required' });
        return true;
      }

      const cleanText = text.replace(/[#*`]/g, '').trim();
      const cacheKey = `${accent}:${cleanText}`;

      if (serverTtsCache.has(cacheKey)) {
        const cached = serverTtsCache.get(cacheKey)!;
        sendJson(res, 200, {
          audioBase64: cached.audioBase64,
          mimeType: cached.mimeType,
        });
        return true;
      }

      if (!ai || Date.now() < ttsQuotaExhaustedUntil) {
        sendJson(res, 200, { fallback: true, quotaCoolingDown: true });
        return true;
      }

      try {
        const ttsResponse = await ai.models.generateContent({
          model: 'gemini-3.8-flash-lite-tts',
          contents: cleanText,
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: {
                  voiceName: accent === 'UK' ? 'Puck' : 'Aoede',
                },
              },
            },
          },
        });

        const candidate = ttsResponse.candidates?.[0];
        const part = candidate?.content?.parts?.find((p: any) => p.inlineData);
        if (part?.inlineData?.data) {
          const mime = part.inlineData.mimeType || 'audio/wav';
          serverTtsCache.set(cacheKey, {
            audioBase64: part.inlineData.data,
            mimeType: mime,
          });
          sendJson(res, 200, {
            audioBase64: part.inlineData.data,
            mimeType: mime,
          });
          return true;
        }

        sendJson(res, 200, { fallback: true });
        return true;
      } catch {
        ttsQuotaExhaustedUntil = Date.now() + 5 * 60 * 1000;
        sendJson(res, 200, { fallback: true, quotaCoolingDown: true });
        return true;
      }
    }

    // 6. /api/gemini/transcribe
    if (url === '/api/gemini/transcribe') {
      const { audioBase64, mimeType = 'audio/webm' } = body;
      if (!audioBase64 || typeof audioBase64 !== 'string') {
        sendJson(res, 400, { error: 'audioBase64 is required' });
        return true;
      }

      const cleanBase64 = audioBase64.replace(/^data:[^;]+;base64,/, '').trim();
      if (!cleanBase64) {
        sendJson(res, 200, { transcript: '' });
        return true;
      }

      if (!ai) {
        sendJson(res, 200, { transcript: '' });
        return true;
      }

      try {
        let transcribeResponse: any = null;
        for (const model of ['gemini-3.5-transcribe', 'gemini-3.8-flash']) {
          try {
            transcribeResponse = await ai.models.generateContent({
              model,
              contents: [
                {
                  role: 'user',
                  parts: [
                    {
                      inlineData: {
                        data: cleanBase64,
                        mimeType: mimeType || 'audio/webm',
                      },
                    },
                    {
                      text: 'Transcribe the spoken English or Arabic audio verbatim in JSON format: {"transcript": "text"}. If silent, unintelligible, or no speech detected, return {"transcript": ""}.',
                    },
                  ],
                },
              ],
              config: {
                responseMimeType: 'application/json',
                temperature: 0.1,
              },
            });
            if (transcribeResponse?.text) break;
          } catch {
            // Try next model
          }
        }

        const parsed = transcribeResponse ? safeParseJson(transcribeResponse.text) : {};
        const transcript = (parsed.transcript || '').trim();
        sendJson(res, 200, { transcript });
      } catch (transcribeErr) {
        console.warn('Transcription error:', transcribeErr);
        sendJson(res, 200, { transcript: '' });
      }
      return true;
    }

    // 7. /api/gemini/generate-challenges (Adaptive AI Content for Sentence Builder, Listening, Reading, Vocabulary)
    if (url === '/api/gemini/generate-challenges') {
      const { activity = 'sentence_builder', level = 'A1', recentPrompts = [], topic = '' } = body;
      const validLevel = (['A0', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'].includes(level) ? level : 'A1');
      const dynamicScenario = getRandomScenario(topic);

      // 1. Sentence Builder Activity
      if (activity === 'sentence_builder') {
        const prompt = `Generate 3 completely unique, natural, highly engaging English sentence builder puzzle challenges for Arabic native speakers.
Target CEFR Level: ${validLevel}.
Context / Theme: "${dynamicScenario}".
Recent sentences already practiced (STRICTLY AVOID duplicating these ideas or patterns): ${JSON.stringify(recentPrompts.slice(-12))}.

CRITICAL VARIETY & DIVERSITY RULES:
1. DO NOT generate standard cliché textbook sentences (e.g. "I drink coffee", "He is a student", "She likes apples").
2. The 3 challenges MUST each use a DIFFERENT grammatical structure:
   - Challenge 1: A natural conversational question, polite request, or exclamation.
   - Challenge 2: A vivid descriptive sentence with real-world nouns/adjectives or time/place prepositions.
   - Challenge 3: A compound or complex sentence with a connector (because, although, when, while, if, so).
3. Tailor vocabulary strictly to CEFR ${validLevel}:
   - A0: 4-6 words, clear, essential everyday words.
   - A1: 5-8 words, present simple, basic modals (can), prepositions.
   - A2: 6-10 words, past simple, future plans, comparatives.
   - B1: 8-12 words, present perfect, conditionals, conversational idioms.
   - B2: 10-15 words, passive voice, modal perfects, reporting verbs.
   - C1: 12-18 words, rhetorical inversion, cleft sentences, advanced collocations.
   - C2: 14-22 words, sophisticated rhetoric, nuanced literary or professional elegance.

Return valid JSON strictly matching this schema:
{
  "challenges": [
    {
      "id": "gen-sb-1",
      "level": "${validLevel}",
      "promptAr": "الترجمة العربية الدقيقة والواضحة للجملة",
      "correctSentence": "The exact correct English sentence.",
      "wordTiles": ["Every", "word", "of", "sentence", "plus", "2-3", "clever", "distractor", "words", "shuffled"],
      "explanationAr": "شرح نحوي مبسط وواضح باللغة العربية يشرح ترتيب الجملة والسر اللغوي فيها",
      "grammarFocusAr": "عنوان القاعدة النحوية الأساسية"
    }
  ]
}
IMPORTANT: wordTiles must include every token in correctSentence plus 2 to 3 clever distractor words (e.g. wrong tense, wrong preposition, or confusing word) shuffled randomly.`;

        try {
          if (!ai) throw new Error('No AI client');
          const response = await generateFastTextContent(ai, {
            contents: prompt,
            config: {
              systemInstruction: 'You are an award-winning bilingual English curriculum designer specializing in lively, modern, non-repetitive learning challenges. Return valid JSON only.',
              responseMimeType: 'application/json',
              temperature: 0.95,
            },
          });
          const parsed = safeParseJson(response.text);
          if (Array.isArray(parsed.challenges) && parsed.challenges.length > 0) {
            const formatted = parsed.challenges.map((c: any, i: number) => ({
              id: `gen-sb-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
              level: validLevel,
              promptAr: c.promptAr || 'جملة تدريبية',
              correctSentence: c.correctSentence || 'I enjoy learning new expressions every day.',
              wordTiles: Array.isArray(c.wordTiles) && c.wordTiles.length > 0
                ? c.wordTiles
                : (c.correctSentence || '').split(' '),
              explanationAr: c.explanationAr || 'ترتيب الجملة الإنجليزية: فاعل + فعل + مفعول به.',
              grammarFocusAr: c.grammarFocusAr || `بناء الجمل (${validLevel})`,
              isAiGenerated: true,
            }));
            sendJson(res, 200, { challenges: formatted });
            return true;
          }
        } catch (e) {
          console.warn('AI sentence generation error, using dynamic fallback:', e);
        }

        // Dynamic non-repeating fallbacks
        const diverseFallbacks = getDiverseSentenceFallbacks(validLevel, recentPrompts);
        const formattedFallback = diverseFallbacks.map((item, i) => ({
          id: `gen-sb-fb-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
          level: validLevel,
          promptAr: item.ar,
          correctSentence: item.en,
          wordTiles: item.tiles,
          explanationAr: item.exp,
          grammarFocusAr: item.focus,
          isAiGenerated: true,
        }));
        sendJson(res, 200, { challenges: formattedFallback });
        return true;
      }

      // 2. Listening Studio Activity
      if (activity === 'listening') {
        const prompt = `Generate 3 completely unique, natural English listening & dictation challenges for Arabic native speakers.
Target CEFR Level: ${validLevel}.
Context / Theme: "${dynamicScenario}".
Recent sentences already practiced (AVOID duplicating): ${JSON.stringify(recentPrompts.slice(-10))}.

CRITICAL VARIETY INSTRUCTIONS:
- Ensure sentences are diverse in length and topic (one question or request, one daily observation, one past or future statement).
- Natural spoken rhythm and modern idioms appropriate for level ${validLevel}.
- Include clear Arabic translation.
- Include accurate Arabic phonetic transcription (phoneticAr).
- Include hintAr pointing out acoustic cues or grammar.
- Include wordsBank containing every word in sentence plus 2-3 plausible distractor words, shuffled.

Return JSON:
{
  "challenges": [
    {
      "id": "gen-list-1",
      "level": "${validLevel}",
      "sentenceEn": "English sentence.",
      "translationAr": "الترجمة العربية الواضحة",
      "phoneticAr": "النطق الصوتي التقريبي بالعربية",
      "hintAr": "تلميح صوتي أو نحوي ذكي",
      "wordsBank": ["words", "shuffled", "plus", "distractor1", "distractor2"]
    }
  ]
}`;
        try {
          if (!ai) throw new Error('No AI client');
          const response = await generateFastTextContent(ai, {
            contents: prompt,
            config: {
              systemInstruction: 'You are an expert bilingual phonetics and listening coach. Return valid JSON only.',
              responseMimeType: 'application/json',
              temperature: 0.95,
            },
          });
          const parsed = safeParseJson(response.text);
          if (Array.isArray(parsed.challenges) && parsed.challenges.length > 0) {
            const formatted = parsed.challenges.map((c: any, i: number) => ({
              id: `gen-list-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
              level: validLevel,
              sentenceEn: c.sentenceEn,
              translationAr: c.translationAr,
              phoneticAr: c.phoneticAr || '',
              hintAr: c.hintAr || '',
              wordsBank: Array.isArray(c.wordsBank) ? c.wordsBank : c.sentenceEn.split(' '),
              isAiGenerated: true,
            }));
            sendJson(res, 200, { challenges: formatted });
            return true;
          }
        } catch (e) {
          console.warn('AI listening generation fallback:', e);
        }

        const diverseListening = getDiverseListeningFallbacks(validLevel, recentPrompts);
        const formatted = diverseListening.map((item, i) => ({
          id: `gen-list-fb-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
          level: validLevel,
          sentenceEn: item.en,
          translationAr: item.ar,
          phoneticAr: item.ph,
          hintAr: item.hint,
          wordsBank: item.bank,
          isAiGenerated: true,
        }));
        sendJson(res, 200, { challenges: formatted });
        return true;
      }

      // 3. Reading Studio Activity
      if (activity === 'reading') {
        const readingGenres = [
          'an inspiring personal breakthrough or achievement story',
          'a captivating travel encounter in a distant city or mountain village',
          'a fascinating science or nature discovery that changed people perspective',
          'a humorous real-life misunderstanding with a happy resolution',
          'a cultural tradition or festival celebrated with warmth and food',
        ];
        const randomGenre = readingGenres[Math.floor(Math.random() * readingGenres.length)];

        const prompt = `Generate 1 completely fresh, original English reading comprehension passage with Arabic translation, sentence breakdown, and 3 comprehension questions for an Arabic speaker.
Target CEFR Level: ${validLevel}.
Genre: ${randomGenre}.
Context / Theme: "${dynamicScenario}".

Rules for CEFR levels:
- A0/A1: 4-6 simple, clear, engaging sentences with foundational vocabulary.
- A2/B1: 2 engaging paragraphs with varied grammar (past, future, reasons, comparisons).
- B2/C1/C2: Compelling, sophisticated article with rich vocabulary, metaphors, and rhetorical flow.

Return valid JSON:
{
  "passage": {
    "titleAr": "عنوان المقال أو القصة بالعربية",
    "titleEn": "Compelling English Title",
    "topic": "الموضوع العام",
    "textEn": "Full English passage text...",
    "translationAr": "الترجمة الكاملة للنص باللغة العربية الفصحى",
    "sentencePairs": [
      { "en": "Sentence in English.", "ar": "ترجمتها بالعربية." }
    ],
    "comprehensionQuestions": [
      {
        "questionAr": "سؤال الفهم بالعربية",
        "questionEn": "Comprehension question in English",
        "options": ["الخيار الصحيح", "خيار خاطئ 1", "خيار خاطئ 2", "خيار خاطئ 3"],
        "correctIndex": 0,
        "explanationAr": "شرح لماذا هذه الإجابة صحيحة بالرجوع للنص"
      }
    ]
  }
}`;
        try {
          if (!ai) throw new Error('No AI client');
          const response = await generateFastTextContent(ai, {
            contents: prompt,
            config: {
              systemInstruction: 'You are an expert bilingual reading comprehension author. Return valid JSON only.',
              responseMimeType: 'application/json',
              temperature: 0.95,
            },
          });
          const parsed = safeParseJson(response.text);
          if (parsed.passage && parsed.passage.textEn) {
            const p = parsed.passage;
            const newPassage = {
              id: `gen-read-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              level: validLevel,
              titleAr: p.titleAr || `قراءة تفاعلية (${validLevel})`,
              titleEn: p.titleEn || `Adaptive Reading (${validLevel})`,
              topic: p.topic || dynamicScenario,
              textEn: p.textEn,
              translationAr: p.translationAr,
              sentencePairs: Array.isArray(p.sentencePairs) ? p.sentencePairs : [],
              comprehensionQuestions: Array.isArray(p.comprehensionQuestions) ? p.comprehensionQuestions : [],
              isAiGenerated: true,
            };
            sendJson(res, 200, { passage: newPassage });
            return true;
          }
        } catch (e) {
          console.warn('AI reading generation fallback:', e);
        }

        // Varied fallback reading passage
        const fallbackPassagesByLevel: Record<string, any> = {
          A0: {
            titleAr: 'صباح في المزرعة الخضراء',
            titleEn: 'A Morning on the Green Farm',
            topic: 'الطبيعة والحيوانات',
            textEn: 'The sun rises over the green farm. The little birds sing in the tall trees. A friendly brown dog runs across the grass. Farmers start their work with warm smiles. It is a peaceful and beautiful morning.',
            translationAr: 'تشرق الشمس فوق المزرعة الخضراء. تغرد العصافير الصغيرة في الأشجار الشاهقة. يركض كلب بني ودود عبر العشب. يبدأ المزارعون عملهم بابتسامات دافئة. إنه صباح هادئ وجميل.',
            sentencePairs: [
              { en: 'The sun rises over the green farm.', ar: 'تشرق الشمس فوق المزرعة الخضراء.' },
              { en: 'The little birds sing in the tall trees.', ar: 'تغرد العصافير الصغيرة في الأشجار الشاهقة.' },
              { en: 'A friendly brown dog runs across the grass.', ar: 'يركض كلب بني ودود عبر العشب.' },
              { en: 'It is a peaceful and beautiful morning.', ar: 'إنه صباح هادئ وجميل.' },
            ],
            comprehensionQuestions: [
              {
                questionAr: 'أين تغرد العصافير الصغيرة؟',
                questionEn: 'Where do the little birds sing?',
                options: ['في الأشجار الشاهقة (In the tall trees)', 'داخل البيت', 'في السيارة', 'تحت النهر'],
                correctIndex: 0,
                explanationAr: 'ذكر النص: "The little birds sing in the tall trees".',
              },
            ],
          },
          default: {
            titleAr: 'رحلة القطار السريع عبر الجبال',
            titleEn: 'The Scenic Mountain Train Journey',
            topic: 'السفر والاستكشاف',
            textEn: 'Traveling by train offers a rare moment to pause and reflect. As the train glides past snow-capped peaks and pine forests, travelers disconnect from the rush of modern life. A hot cup of tea by the window turns simple travel into an unforgettable adventure. New horizons always inspire fresh ideas.',
            translationAr: 'يتيح السفر بالقطار فرصة نادرة للتوقف والتأمل. بينما ينساب القطار عبر القمم المكسوة بالثلوج وغابات الصنوبر، ينفصل المسافرون عن صخب الحياة الحديثة. كوب شاي ساخن بجوار النافذة يحول السفر البسيط إلى مغامرة لا تنسى. الآفاق الجديدة تلهم دائماً أفكاراً متجددة.',
            sentencePairs: [
              { en: 'Traveling by train offers a rare moment to pause and reflect.', ar: 'يتيح السفر بالقطار فرصة نادرة للتوقف والتأمل.' },
              { en: 'As the train glides past snow-capped peaks, travelers disconnect from the rush.', ar: 'بينما ينساب القطار عبر القمم المكسوة بالثلوج، ينفصل المسافرون عن الصخب.' },
              { en: 'New horizons always inspire fresh ideas.', ar: 'الآفاق الجديدة تلهم دائماً أفكاراً متجددة.' },
            ],
            comprehensionQuestions: [
              {
                questionAr: 'ما الميزة التي يمنحها السفر بالقطار وفقاً للنص؟',
                questionEn: 'What special benefit does train travel offer according to the text?',
                options: ['فرصة نادرة للتوقف والتأمل (A rare moment to pause and reflect)', 'السرعة الفائقة فقط', 'النوم طوال الوقت', 'التسوق المستمر'],
                correctIndex: 0,
                explanationAr: 'في الجملة الأولى: "Traveling by train offers a rare moment to pause and reflect".',
              },
            ],
          },
        };

        const chosenFallback = fallbackPassagesByLevel[validLevel] || fallbackPassagesByLevel.default;
        const fallbackPassage = {
          id: `gen-read-fb-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          level: validLevel,
          titleAr: chosenFallback.titleAr,
          titleEn: chosenFallback.titleEn,
          topic: chosenFallback.topic,
          textEn: chosenFallback.textEn,
          translationAr: chosenFallback.translationAr,
          sentencePairs: chosenFallback.sentencePairs,
          comprehensionQuestions: chosenFallback.comprehensionQuestions,
          isAiGenerated: true,
        };
        sendJson(res, 200, { passage: fallbackPassage });
        return true;
      }

      // 4. Vocabulary Studio Activity
      if (activity === 'vocabulary') {
        const prompt = `Generate 5 completely unique, high-yield English vocabulary items for an Arabic native speaker.
Target CEFR Level: ${validLevel}.
Context / Theme: "${dynamicScenario}".
Recent words already saved (STRICTLY AVOID duplicating these): ${JSON.stringify(recentPrompts.slice(-15))}.

CRITICAL REQUIREMENTS:
- Select modern, practical words, phrasal verbs, or idioms actually used in real English conversations.
- No repetitive beginner words unless level is A0.
- For level ${validLevel}, provide nuanced terms with natural collocations.

Return JSON:
{
  "items": [
    {
      "word": "word",
      "ipa": "/ipa/",
      "arabicPhonetic": "نطق تقريبي بالعربية",
      "partOfSpeech": "noun/verb/adjective/idiom",
      "arabicMeaning": "المعنى العربي الدقيق والواضح",
      "englishDefinition": "Clear simple definition",
      "exampleEn": "Natural realistic example sentence",
      "exampleAr": "ترجمة المثال بالعربية الفصحى",
      "collocations": ["collocation 1", "collocation 2"],
      "arabicMistakeWarning": "تنبيه لغوي مفيد لتجنب أخطاء الناطقين بالعربية",
      "category": "تصنيف الكلمة"
    }
  ]
}`;
        try {
          if (!ai) throw new Error('No AI client');
          const response = await generateFastTextContent(ai, {
            contents: prompt,
            config: {
              systemInstruction: 'You are an expert bilingual vocabulary lexicographer. Return valid JSON only.',
              responseMimeType: 'application/json',
              temperature: 0.95,
            },
          });
          const parsed = safeParseJson(response.text);
          if (Array.isArray(parsed.items) && parsed.items.length > 0) {
            const formatted = parsed.items.map((item: any, i: number) => ({
              id: `gen-vocab-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
              word: item.word,
              ipa: item.ipa || '',
              arabicPhonetic: item.arabicPhonetic || '',
              partOfSpeech: item.partOfSpeech || 'word',
              arabicMeaning: item.arabicMeaning || item.word,
              englishDefinition: item.englishDefinition || '',
              exampleEn: item.exampleEn || `I use "${item.word}" in daily English.`,
              exampleAr: item.exampleAr || '',
              collocations: Array.isArray(item.collocations) ? item.collocations : [],
              arabicMistakeWarning: item.arabicMistakeWarning || '',
              level: validLevel,
              category: item.category || dynamicScenario,
              repetitions: 0,
              intervalDays: 1,
              easeFactor: 2.5,
              nextReviewDate: new Date().toISOString().split('T')[0],
              mastered: false,
              isAiGenerated: true,
            }));
            sendJson(res, 200, { items: formatted });
            return true;
          }
        } catch (e) {
          console.warn('AI vocab generation fallback:', e);
        }

        // Varied fallback vocabulary
        const diverseVocab = getDiverseVocabularyFallbacks(validLevel, recentPrompts);
        const formattedItems = diverseVocab.map((item: any, i: number) => ({
          id: `gen-vocab-fb-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
          word: item.word,
          ipa: item.ipa,
          arabicPhonetic: item.arabicPhonetic,
          partOfSpeech: item.partOfSpeech,
          arabicMeaning: item.arabicMeaning,
          englishDefinition: item.englishDefinition,
          exampleEn: item.exampleEn,
          exampleAr: item.exampleAr,
          collocations: item.collocations,
          arabicMistakeWarning: item.arabicMistakeWarning,
          level: validLevel,
          category: 'مفردات ذكية متجددة',
          repetitions: 0,
          intervalDays: 1,
          easeFactor: 2.5,
          nextReviewDate: new Date().toISOString().split('T')[0],
          mastered: false,
          isAiGenerated: true,
        }));
        sendJson(res, 200, { items: formattedItems });
        return true;
      }

      sendJson(res, 400, { error: 'Unknown activity type' });
      return true;
    }

    sendJson(res, 404, { error: 'Gemini endpoint not found' });
    return true;
  } catch (error: any) {
    sendJson(res, 200, {
      reply: 'حدث خطأ في معالجة الطلب.',
      error: 'ServerError',
      details: error?.message || 'Internal error',
    });
    return true;
  }
}
