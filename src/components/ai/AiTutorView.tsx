import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  RotateCcw,
  BookOpen,
  Mic,
  MicOff,
  Snail,
  Rabbit,
  Wand2,
  FileText,
  Phone,
  PhoneOff,
  Stethoscope,
  Plus,
  Check,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
} from 'lucide-react';
import { useLearning } from '../../context/LearningContext.tsx';
import { useAudioSpeaker } from '../../hooks/useAudioSpeaker.ts';
import { AudioButton } from '../common/AudioButton.tsx';
import { playSuccessChime, playWrongTone, playPopSound } from '../../utils/audioEffects.ts';
import { startUniversalVoiceCapture, type VoiceRecorderSession } from '../../utils/speech.ts';
import { CURRICULUM_LESSONS } from '../../data/curriculum.ts';
import { diagnoseSentenceLocally } from '../../server/sentenceDiagnostics.ts';

export type TutorActiveMode = 'conversation' | 'grammar' | 'writing' | 'pronunciation';
export type TutorViewTab = 'chat' | 'call' | 'doctor' | 'lesson_help';

interface ChatMessage {
  id: string;
  sender: 'user' | 'model';
  text: string;
  translationAr?: string;
  englishAudioText?: string;
  correction?: {
    original: string;
    corrected: string;
    explanationAr: string;
  } | null;
  vocabHighlight?: {
    word: string;
    ipa?: string;
    arabicPhonetic?: string;
    arabicMeaning: string;
    exampleEn?: string;
    exampleAr?: string;
  } | null;
}

const TUTOR_MODES: { id: TutorActiveMode; titleAr: string; descAr: string; icon: any; color: string }[] = [
  {
    id: 'conversation',
    titleAr: 'محادثة وتمثيل أدوار',
    descAr: 'محادثات واقعية في المقهى، المطار، مقابلات العمل، والمواقف اليومية',
    icon: MessageSquare,
    color: '#58cc02',
  },
  {
    id: 'grammar',
    titleAr: 'اشرح لي إجابتي وقواعدي',
    descAr: 'اسأل عن أي قاعدة غامضة، أو افحص لماذا جملتك صحيحة أو خاطئة',
    icon: BookOpen,
    color: '#1cb0f6',
  },
  {
    id: 'writing',
    titleAr: 'مدرب الصياغة والبريد المهني',
    descAr: 'ترقية صياغة رسائلك إلى الإنجليزية الطبيعية ومستوى النخبة C2',
    icon: FileText,
    color: '#ce82ff',
  },
  {
    id: 'pronunciation',
    titleAr: 'مدرب النطق والتحدث',
    descAr: 'تحليل نبرة الصوت، تشديد المقاطع، وتجاوز أخطاء النطق للمتحدث العربي',
    icon: Mic,
    color: '#ff9600',
  },
];

const SCENARIOS = [
  { id: 'free_chat', titleAr: 'محادثة حرة ومفتوحة', stepTitle: 'حوار مفتوح' },
  { id: 'coffee_shop', titleAr: 'طلب قهوة ومأكولات في مقهى', stepTitle: 'المرحلة 1: طلب المشروب والحجم' },
  { id: 'job_interview', titleAr: 'مقابلة عمل مهنية بالإنجليزية', stepTitle: 'المرحلة 1: التعريف بالنفس والخبرات' },
  { id: 'airport_travel', titleAr: 'في المطار وحجز الفندق', stepTitle: 'المرحلة 1: تسجيل الدخول وتسليم الحقائب' },
  { id: 'clinic_visit', titleAr: 'في عيادة الطبيب والصيدلية', stepTitle: 'المرحلة 1: شرح الأعراض والألم' },
];

const DOCTOR_PRESETS = [
  { label: 'my friens are et home', text: 'my friens are et home' },
  { label: 'I am agree with you', text: 'I am agree with you' },
  { label: "She didn't went yesterday", text: "She didn't went yesterday" },
  { label: 'I have 25 years old', text: 'I have 25 years old' },
  { label: 'He is married with Sarah', text: 'He is married with Sarah' },
];

export const AiTutorView: React.FC = () => {
  const { progress, recordPersonalMistake, addVocabularyItem } = useLearning();
  const { isPlaying, playSpeech } = useAudioSpeaker();

  // Primary view tabs: Chat | Voice Call | Sentence Doctor | Lesson Assistant
  const [viewTab, setViewTab] = useState<TutorViewTab>('chat');

  const [tutorMode, setTutorMode] = useState<TutorActiveMode>('conversation');
  const [selectedScenario, setSelectedScenario] = useState('free_chat');
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(0.9);
  const [isRecording, setIsRecording] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [savedVocabIds, setSavedVocabIds] = useState<Record<string, boolean>>({});

  // Sentence Doctor state
  const [doctorInput, setDoctorInput] = useState('');
  const [doctorLoading, setDoctorLoading] = useState(false);
  const [doctorResult, setDoctorResult] = useState<any>(null);
  const [doctorSavedMistake, setDoctorSavedMistake] = useState(false);
  const [doctorQuizAnswer, setDoctorQuizAnswer] = useState<number | null>(null);

  // Lesson Assistant state
  const [selectedLessonId, setSelectedLessonId] = useState<string>(
    CURRICULUM_LESSONS[0]?.id || ''
  );

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'model',
      text: `Hello ${progress.name && progress.name !== 'متعلم جديد' ? progress.name : 'my friend'}! I am your Fares AI tutor. What would you like to practice today?`,
      translationAr: `مرحباً ${progress.name && progress.name !== 'متعلم جديد' ? progress.name : 'يا صديقي'}! أنا معلّم فارس الذكي. ماذا تود أن نتدرب عليه اليوم؟`,
      englishAudioText: `Hello my friend! I am your Fares AI tutor. What would you like to practice today?`,
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, viewTab]);

  const [voiceError, setVoiceError] = useState<string | null>(null);
  const voiceSessionRef = useRef<VoiceRecorderSession | null>(null);

  useEffect(() => {
    return () => {
      if (voiceSessionRef.current) {
        voiceSessionRef.current.cancel();
      }
    };
  }, []);

  // Voice Microphone using Universal Voice Capture (Audio + Speech API fallback)
  const handleToggleVoiceInput = async () => {
    setVoiceError(null);
    if (isRecording) {
      if (voiceSessionRef.current) {
        voiceSessionRef.current.stop();
        voiceSessionRef.current = null;
      }
      setIsRecording(false);
      return;
    }

    try {
      playPopSound();
      setIsRecording(true);
      const preferredLang = 'en-US';
      const session = await startUniversalVoiceCapture(
        (transcript) => {
          if (transcript) {
            setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
            playSuccessChime();
            if (viewTab === 'call') {
              handleSendMessage(transcript);
            }
          }
          setIsRecording(false);
          voiceSessionRef.current = null;
        },
        (errorMsg) => {
          setVoiceError(errorMsg);
          setIsRecording(false);
          voiceSessionRef.current = null;
        },
        (state) => {
          setIsRecording(state === 'recording' || state === 'transcribing');
        },
        (liveText) => {
          if (viewTab === 'call') {
            setInputText(liveText);
          }
        },
        preferredLang
      );
      if (!session) {
        setIsRecording(false);
      } else {
        voiceSessionRef.current = session;
      }
    } catch (e) {
      setIsRecording(false);
      setVoiceError('تعذر بدء التسجيل الصوتي. يرجى التحقق من إذن الميكروفون.');
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    playPopSound();
    const userMsgId = `user-${Date.now()}`;
    const newHistory = [...messages, { id: userMsgId, sender: 'user' as const, text }];
    setMessages(newHistory);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          mode: tutorMode,
          history: newHistory.map((m) => ({ sender: m.sender, text: m.text })),
          learningLevel: progress.estimatedLevel || 'B1',
          dialect: progress.arabicDialect || 'fusha',
          roleplayScenario: selectedScenario,
          industryInterests: progress.industryInterests || ['daily'],
        }),
      });

      const data = await response.json();

      const modelMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        sender: 'model',
        text: data.reply || 'Great! Let us keep chatting.',
        translationAr: data.translationAr || '',
        englishAudioText: data.englishAudioText || data.reply || '',
        correction: data.correction || null,
        vocabHighlight: data.vocabHighlight || null,
      };

      setMessages((prev) => [...prev, modelMsg]);

      // Record mistake if model detected error
      if (data.correction && data.correction.original) {
        recordPersonalMistake({
          original: data.correction.original,
          corrected: data.correction.corrected,
          naturalAlternative: data.correction.corrected,
          errorTypeAr: `المعلم الذكي (${tutorMode})`,
          explanationAr: data.correction.explanationAr,
          source: 'المحادثة الذكية',
        });
      }

      // Automatically speak the response in call mode or if audio text exists
      if (modelMsg.englishAudioText) {
        playSpeech(modelMsg.englishAudioText, modelMsg.id, playbackSpeed);
      }
    } catch (err) {
      console.warn('Chat error:', err);
      const fallbackReply: ChatMessage = {
        id: `model-${Date.now()}`,
        sender: 'model',
        text: `I understood you! You said: "${text}". That is great English practice. What would you like to discuss next?`,
        translationAr: `فهمتك تماماً! لقد قلت: "${text}". هذا تمرين رائع. ماذا تود أن نناقش بعد ذلك؟`,
        englishAudioText: `I understood you! That is great English practice. What would you like to discuss next?`,
      };
      setMessages((prev) => [...prev, fallbackReply]);
      playSpeech(fallbackReply.englishAudioText!, fallbackReply.id, playbackSpeed);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddVocabToDeck = (vocab: NonNullable<ChatMessage['vocabHighlight']>) => {
    addVocabularyItem({
      word: vocab.word,
      arabicMeaning: vocab.arabicMeaning,
      ipa: vocab.ipa,
      exampleEn: vocab.exampleEn,
    });
    setSavedVocabIds((prev) => ({ ...prev, [vocab.word]: true }));
    playSuccessChime();
  };

  // Sentence Doctor Handler
  const handleCheckSentenceDoctor = async (presetText?: string) => {
    const textToCheck = (presetText || doctorInput).trim();
    if (!textToCheck || doctorLoading) return;
    if (presetText) setDoctorInput(presetText);
    playPopSound();
    setDoctorLoading(true);
    setDoctorSavedMistake(false);
    setDoctorQuizAnswer(null);
    try {
      const response = await fetch('/api/gemini/correct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToCheck,
          context: 'sentence_doctor',
        }),
      });
      const data = await response.json();
      setDoctorResult(data);
      if (data.isCorrect) {
        playSuccessChime();
      } else {
        playWrongTone();
      }
    } catch (err) {
      console.warn('Doctor error, using robust local diagnostics:', err);
      const fallbackResult = diagnoseSentenceLocally(textToCheck);
      setDoctorResult(fallbackResult);
      if (fallbackResult.isCorrect) {
        playSuccessChime();
      } else {
        playWrongTone();
      }
    } finally {
      setDoctorLoading(false);
    }
  };

  const handleSaveDoctorMistake = () => {
    if (!doctorResult) return;
    recordPersonalMistake({
      original: doctorResult.original,
      corrected: doctorResult.corrected,
      naturalAlternative: doctorResult.naturalAlternative,
      errorTypeAr: doctorResult.errorTypeAr || 'طبيب الجمل',
      explanationAr: doctorResult.explanationAr || 'تم تشخيصها بواسطة طبيب الجمل.',
      source: 'طبيب الجمل والتصحيح الفوري',
    });
    setDoctorSavedMistake(true);
    playSuccessChime();
  };

  // Reset chat session
  const handleResetChat = () => {
    playPopSound();
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'model',
        text: `Hello ${progress.name && progress.name !== 'متعلم جديد' ? progress.name : 'my friend'}! What would you like to explore or practice together now?`,
        translationAr: `مرحباً ${progress.name && progress.name !== 'متعلم جديد' ? progress.name : 'يا صديقي'}! ماذا تود أن نستكشفه أو نتدرب عليه معاً الآن؟`,
        englishAudioText: `Hello my friend! What would you like to explore or practice together now?`,
      },
    ]);
  };

  // Switch tutor mode with tailored greeting
  const handleSelectMode = (mode: TutorActiveMode) => {
    playPopSound();
    setTutorMode(mode);
    let welcomeText = '';
    let welcomeAr = '';
    if (mode === 'conversation') {
      welcomeText = "Great! Let's practice spoken English in everyday scenarios. Pick a scenario or just speak naturally!";
      welcomeAr = "رائع! دعنا نتدرب على المحادثة الإنجليزية في مواقف الحياة اليومية. اختر سيناريو أو تحدث بحرية!";
    } else if (mode === 'grammar') {
      welcomeText = "Grammar Coach ready! Ask me about any rule, tense, or preposition, and I will explain it with Arabic comparisons.";
      welcomeAr = "مدرب القواعد جاهز! اسألني عن أي قاعدة أو زمن أو حرف جر وسأشرحها لك بتفصيل ومقارنة ذكية.";
    } else if (mode === 'writing') {
      welcomeText = "Writing Coach ready! Paste any email or message, and I will elevate it to natural native C2 standard.";
      welcomeAr = "مدرب الصياغة جاهز! الصق أي بريد إلكتروني أو رسالة وسأقوم بترقيتها إلى مستوى النخبة C2.";
    } else if (mode === 'pronunciation') {
      welcomeText = "Pronunciation Coach ready! What sound, word, or sentence would you like to master today?";
      welcomeAr = "مدرب النطق جاهز! ما هي الكلمة أو الحرف أو الجملة التي تود إتقان نطقها ومخارج حروفها اليوم؟";
    }
    const modeMsg: ChatMessage = {
      id: `mode-${Date.now()}`,
      sender: 'model',
      text: welcomeText,
      translationAr: welcomeAr,
      englishAudioText: welcomeText,
    };
    setMessages((prev) => [...prev, modeMsg]);
  };

  // Switch roleplay scenario with in-character prompt
  const handleSelectScenario = (scId: string) => {
    playPopSound();
    setSelectedScenario(scId);
    let greeting = '';
    let translation = '';
    if (scId === 'coffee_shop') {
      greeting = "Welcome to Central Coffee! What can I get started for you today? A hot coffee or something to eat?";
      translation = "مرحباً بك في المقهى! ماذا تحب أن أبدأ في تحضيره لك اليوم؟ قهوة ساخنة أم شيئاً لتناوله؟";
    } else if (scId === 'job_interview') {
      greeting = "Welcome! Thank you for coming in today. Could you please start by introducing yourself and your background?";
      translation = "أهلاً بك! شكراً لحضورك هذه المقابلة اليوم. هل يمكنك البدء بالتعريف عن نفسك وخبراتك؟";
    } else if (scId === 'airport_travel') {
      greeting = "Good morning! Welcome to the airport check-in counter. Where are you flying today, and do you have baggage to check?";
      translation = "صباح الخير! مرحباً بك في مكتب تسجيل الرحلات بالمطار. إلى أين تسافر اليوم، وهل لديك حقائب لشحنها؟";
    } else if (scId === 'clinic_visit') {
      greeting = "Hello! Please have a seat. How can I help you today? What symptoms have you been feeling?";
      translation = "مرحباً! تفضل بالجلوس. كيف يمكنني مساعدتك اليوم؟ ما هي الأعراض التي تشعر بها؟";
    }
    if (greeting) {
      const introMsg: ChatMessage = {
        id: `scenario-${Date.now()}`,
        sender: 'model',
        text: greeting,
        translationAr: translation,
        englishAudioText: greeting,
      };
      setMessages((prev) => [...prev, introMsg]);
      playSpeech(greeting, introMsg.id, playbackSpeed);
    }
  };

  // Quick Lesson Assistant Prompts
  const currentTargetLesson =
    CURRICULUM_LESSONS.find((l) => l.id === selectedLessonId) || CURRICULUM_LESSONS[0];

  const handleAskAboutLesson = (actionType: 'explain' | 'quiz' | 'dialogue') => {
    let promptText = '';
    if (actionType === 'explain') {
      promptText = `Please explain the grammar rule and key concept of "${currentTargetLesson.titleEn}" (${currentTargetLesson.titleAr}) in simple English and clear Arabic.`;
    } else if (actionType === 'quiz') {
      promptText = `Can you quiz me with 2 quick questions to test my understanding of "${currentTargetLesson.titleEn}"?`;
    } else {
      promptText = `Let's have a short practical dialogue that uses the structures taught in "${currentTargetLesson.titleEn}". You start!`;
    }
    setViewTab('chat');
    handleSendMessage(promptText);
  };

  const lastModelMsg = [...messages].reverse().find((m) => m.sender === 'model');

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* 1. Main Feature Navigation Bar (Chat | Voice Call | Sentence Doctor | Lesson Assistant) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => {
            playPopSound();
            setViewTab('chat');
          }}
          className={`px-4 py-3 min-h-[48px] rounded-2xl border-2 border-b-4 text-xs font-black transition cursor-pointer select-none flex items-center gap-2 whitespace-nowrap ${
            viewTab === 'chat'
              ? 'bg-[#58cc02] border-[#58cc02] border-b-[#46a302] text-white shadow-sm translate-y-[-2px]'
              : 'bg-white dark:bg-slate-900 border-slate-200 border-b-slate-300 dark:border-slate-800 dark:border-b-slate-950 text-slate-700 dark:text-slate-300 hover:border-emerald-300 active:translate-y-0.5'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>محادثة وتدريب المعلم</span>
        </button>

        <button
          type="button"
          onClick={() => {
            playPopSound();
            setViewTab('call');
          }}
          className={`px-4 py-3 min-h-[48px] rounded-2xl border-2 border-b-4 text-xs font-black transition cursor-pointer select-none flex items-center gap-2 whitespace-nowrap ${
            viewTab === 'call'
              ? 'bg-[#1cb0f6] border-[#1cb0f6] border-b-[#1899d6] text-white shadow-sm translate-y-[-2px]'
              : 'bg-white dark:bg-slate-900 border-slate-200 border-b-slate-300 dark:border-slate-800 dark:border-b-slate-950 text-slate-700 dark:text-slate-300 hover:border-sky-300 active:translate-y-0.5'
          }`}
        >
          <Phone className="w-4 h-4" />
          <span>مكالمة صوتية وتحدث مباشر</span>
        </button>

        <button
          type="button"
          onClick={() => {
            playPopSound();
            setViewTab('doctor');
          }}
          className={`px-4 py-3 min-h-[48px] rounded-2xl border-2 border-b-4 text-xs font-black transition cursor-pointer select-none flex items-center gap-2 whitespace-nowrap ${
            viewTab === 'doctor'
              ? 'bg-[#ff9600] border-[#ff9600] border-b-[#e58700] text-white shadow-sm translate-y-[-2px]'
              : 'bg-white dark:bg-slate-900 border-slate-200 border-b-slate-300 dark:border-slate-800 dark:border-b-slate-950 text-slate-700 dark:text-slate-300 hover:border-amber-300 active:translate-y-0.5'
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          <span>طبيب الجمل وترقية الصياغة</span>
        </button>

        <button
          type="button"
          onClick={() => {
            playPopSound();
            setViewTab('lesson_help');
          }}
          className={`px-4 py-3 min-h-[48px] rounded-2xl border-2 border-b-4 text-xs font-black transition cursor-pointer select-none flex items-center gap-2 whitespace-nowrap ${
            viewTab === 'lesson_help'
              ? 'bg-[#ce82ff] border-[#ce82ff] border-b-[#b85eff] text-white shadow-sm translate-y-[-2px]'
              : 'bg-white dark:bg-slate-900 border-slate-200 border-b-slate-300 dark:border-slate-800 dark:border-b-slate-950 text-slate-700 dark:text-slate-300 hover:border-purple-300 active:translate-y-0.5'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>مساعد الدرس الحالي</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: LIVE VOICE CALL MODE                              */}
      {/* ======================================================== */}
      {viewTab === 'call' && (
        <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border-2 border-b-6 border-slate-200 border-b-slate-300 dark:border-slate-800 dark:border-b-slate-950 shadow-md text-center space-y-6 animate-in fade-in">
          {/* Call Status Header */}
          <div className="space-y-2">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-black text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              المكالمة متصلة مع معلم فارس الذكي
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              تحدث بالإنجليزية مباشرة واستمع للنطق الطبيعي
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              اضغط على الميكروفون وتكلم بجملة أو عبارة، وسيجيبك المعلم فوراً بالصوت مع التصحيح والترجمة.
            </p>
          </div>

          {/* Animated Avatar / Speaking Pulse */}
          <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
            <div
              className={`absolute inset-0 rounded-full transition-all duration-700 ${
                isLoading || isRecording
                  ? 'bg-sky-400/20 animate-ping'
                  : 'bg-slate-100 dark:bg-slate-800'
              }`}
            />
            <div
              className={`relative w-28 h-28 rounded-full border-4 flex items-center justify-center transition-all ${
                isLoading
                  ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/60 scale-105'
                  : isRecording
                  ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/60 scale-110'
                  : 'border-[#58cc02] bg-[#58cc02]/10'
              }`}
            >
              {isLoading ? (
                <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
              ) : isRecording ? (
                <Mic className="w-10 h-10 text-amber-500 animate-bounce" />
              ) : (
                <Volume2 className="w-10 h-10 text-[#58cc02]" />
              )}
            </div>
          </div>

          {/* Active Voice Transcript Bubble while speaking */}
          {(isRecording || inputText) && (
            <div className="max-w-md mx-auto p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/50 border-2 border-sky-300 dark:border-sky-700 text-center space-y-1 animate-in fade-in">
              <span className="text-[11px] font-black text-sky-700 dark:text-sky-300 block">
                {isRecording ? '🎤 جاري الاستماع إلى صوتك:' : 'آخر ما قلته:'}
              </span>
              <p className="font-en font-bold text-sm text-slate-900 dark:text-white" dir="ltr">
                "{inputText || 'تكلم الآن...'}"
              </p>
            </div>
          )}

          {/* Real-time Subtitles of Tutor */}
          {lastModelMsg && (
            <div className="max-w-xl mx-auto p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2 text-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                كلام المعلم الأخير:
              </span>
              <p className="font-en font-black text-base sm:text-lg text-slate-900 dark:text-white leading-relaxed" dir="ltr">
                "{lastModelMsg.text}"
              </p>
              {lastModelMsg.translationAr && (
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                  {lastModelMsg.translationAr}
                </p>
              )}
              {lastModelMsg.englishAudioText && (
                <div className="pt-2 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => playSpeech(lastModelMsg.englishAudioText!, lastModelMsg.id, 0.75)}
                    className="px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-black flex items-center gap-1 cursor-pointer"
                  >
                    <Snail className="w-3.5 h-3.5" />
                    <span>إعادة ببطء (0.75x)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => playSpeech(lastModelMsg.englishAudioText!, lastModelMsg.id, 1.0)}
                    className="px-3 py-1.5 rounded-xl bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 text-xs font-black flex items-center gap-1 cursor-pointer"
                  >
                    <Rabbit className="w-3.5 h-3.5" />
                    <span>إعادة طبيعية (1.0x)</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {voiceError && (
            <div className="p-3 max-w-md mx-auto rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-xs font-bold text-amber-800 dark:text-amber-200 flex items-center justify-between gap-2 text-right">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{voiceError}</span>
              </div>
              <button
                type="button"
                onClick={() => setVoiceError(null)}
                className="text-[11px] underline cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          )}

          {/* Push-to-Talk Big Button */}
          <div className="pt-2 flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={handleToggleVoiceInput}
              className={`w-20 h-20 rounded-full border-b-6 flex items-center justify-center text-white cursor-pointer select-none active:scale-95 transition-all shadow-xl ${
                isRecording
                  ? 'bg-rose-500 border-rose-700 animate-pulse'
                  : 'bg-[#1cb0f6] border-[#1899d6] hover:bg-[#1899d6]'
              }`}
            >
              <Mic className="w-9 h-9" />
            </button>
            <span className="text-xs font-black text-slate-600 dark:text-slate-300">
              {isRecording ? 'جاري الاستماع... اضغط ثانية لإنهاء التحدث' : 'اضغط على الميكروفون وتكلم بالإنجليزية'}
            </span>
          </div>


        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: SENTENCE DOCTOR & UPGRADE CLINIC                  */}
      {/* ======================================================== */}
      {viewTab === 'doctor' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-b-6 border-slate-200 border-b-slate-300 dark:border-slate-800 dark:border-b-slate-950 space-y-5 shadow-xs">
            <div className="space-y-1 text-right">
              <div className="flex items-center gap-2 text-xs font-black text-amber-600 dark:text-amber-400">
                <Stethoscope className="w-4 h-4 text-amber-500" />
                <span>طبيب الجمل والتشخيص اللغوي الفوري</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                افحص جملتك واكتشف الخطأ ورَقِّ صياغتها لمستوى النخبة
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                اكتب أي جملة تشك في صحتها وسيشرح لك المعلم سبب الخطأ بالتفصيل وتأثير التفكير بالعربية عليها مع تدريب تفاعلي.
              </p>
            </div>

            {/* Quick Test Presets */}
            <div className="space-y-1.5 text-right">
              <span className="text-[11px] font-black text-slate-500 dark:text-slate-400 block">
                أمثلة شائعة للاختبار السريع (اضغط للتجربة الفورية):
              </span>
              <div className="flex flex-wrap items-center gap-1.5" dir="ltr">
                {DOCTOR_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleCheckSentenceDoctor(preset.text)}
                    className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs font-en font-bold cursor-pointer transition active:scale-95"
                  >
                    "{preset.label}"
                  </button>
                ))}
              </div>
            </div>

            {/* Input Box */}
            <div className="space-y-2">
              <textarea
                value={doctorInput}
                onChange={(e) => setDoctorInput(e.target.value)}
                placeholder="اكتب الجملة هنا بالإنجليزية (مثال: my friens are et home)..."
                rows={3}
                dir="ltr"
                className="w-full p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-en font-bold text-sm text-slate-900 dark:text-white focus:outline-hidden focus:border-amber-500 transition-colors"
              />
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">
                  يدعم فحص الإملاء، تصريف الأفعال، حروف الجر، وفعل الكينونة
                </span>
                <button
                  type="button"
                  disabled={!doctorInput.trim() || doctorLoading}
                  onClick={() => handleCheckSentenceDoctor()}
                  className="px-6 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs border-b-4 border-amber-600 active:border-b-0 active:translate-y-1 disabled:opacity-50 cursor-pointer shadow-sm flex items-center gap-2"
                >
                  {doctorLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Wand2 className="w-4 h-4" />
                  )}
                  <span>تشخيص الجملة</span>
                </button>
              </div>
            </div>

            {/* Diagnostic Results */}
            {doctorResult && (
              <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 space-y-4 animate-in fade-in">
                {/* Status Bar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {doctorResult.isCorrect ? (
                      <span className="px-3.5 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-black text-xs flex items-center gap-1.5 shadow-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        صحيحة نحوياً وخالية من الأخطاء
                      </span>
                    ) : (
                      <span className="px-3.5 py-1.5 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-black text-xs flex items-center gap-1.5 shadow-xs">
                        <AlertCircle className="w-4 h-4 text-rose-500" />
                        تحتاج تصحيح: {doctorResult.errorTypeAr}
                      </span>
                    )}
                  </div>

                  {!doctorSavedMistake && !doctorResult.isCorrect ? (
                    <button
                      type="button"
                      onClick={handleSaveDoctorMistake}
                      className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 text-xs font-black flex items-center gap-1 cursor-pointer hover:bg-rose-50 dark:hover:bg-slate-600 shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5 text-rose-500" />
                      <span>حفظ في عيادة أخطائي</span>
                    </button>
                  ) : doctorSavedMistake ? (
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-black flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      تم الحفظ في عيادة الأخطاء
                    </span>
                  ) : null}
                </div>

                {/* 3-Tier Upgrades (Corrected -> Natural -> Elite) with Audio */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" dir="ltr">
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2 text-left shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider">
                        ✓ Corrected Version
                      </span>
                      {doctorResult.corrected && (
                        <AudioButton
                          size="sm"
                          isPlaying={isPlaying('doc-corr')}
                          onClick={() => playSpeech(doctorResult.corrected, 'doc-corr', playbackSpeed)}
                        />
                      )}
                    </div>
                    <p className="font-en font-black text-sm sm:text-base text-slate-900 dark:text-white">
                      {doctorResult.corrected}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2 text-left shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-sky-600 tracking-wider">
                        ✨ Natural Native Upgrade
                      </span>
                      {doctorResult.naturalAlternative && (
                        <AudioButton
                          size="sm"
                          isPlaying={isPlaying('doc-nat')}
                          onClick={() => playSpeech(doctorResult.naturalAlternative, 'doc-nat', playbackSpeed)}
                        />
                      )}
                    </div>
                    <p className="font-en font-black text-sm sm:text-base text-slate-900 dark:text-white">
                      {doctorResult.naturalAlternative}
                    </p>
                  </div>
                </div>

                {/* Arabic Explanation & Mother tongue influence */}
                <div className="space-y-2 text-right">
                  <div className="p-4 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-950 dark:text-amber-200 text-xs sm:text-sm space-y-1.5 shadow-2xs">
                    <span className="font-black flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
                      <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>شرح القاعدة اللغوية وتفصيل الخطأ:</span>
                    </span>
                    <p className="font-medium leading-relaxed">{doctorResult.explanationAr}</p>
                  </div>

                  {doctorResult.arabicMotherTongueInfluence && (
                    <div className="p-4 rounded-2xl bg-rose-50/90 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-950 dark:text-rose-200 text-xs sm:text-sm space-y-1.5 shadow-2xs">
                      <span className="font-black text-rose-800 dark:text-rose-300 block">
                        تأثير التفكير باللغة العربية (L1 Interference):
                      </span>
                      <p className="font-medium leading-relaxed">
                        {doctorResult.arabicMotherTongueInfluence}
                      </p>
                    </div>
                  )}

                  {/* Interactive Mini Quiz */}
                  {doctorResult.miniQuiz && (
                    <div className="p-4 rounded-2xl bg-purple-50/90 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 space-y-3 shadow-2xs text-right">
                      <div className="flex items-center gap-2 text-xs font-black text-purple-800 dark:text-purple-300">
                        <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
                        <span>سؤال تدريبي سريع لتثبيت القاعدة:</span>
                      </div>
                      <p className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100">
                        {doctorResult.miniQuiz.questionAr}
                      </p>
                      <div className="grid grid-cols-1 gap-2" dir="ltr">
                        {doctorResult.miniQuiz.options.map((opt: string, optIdx: number) => {
                          const isSelected = doctorQuizAnswer === optIdx;
                          const isCorrectOpt = optIdx === doctorResult.miniQuiz.correctIndex;
                          const hasAnswered = doctorQuizAnswer !== null;

                          let btnStyle =
                            'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-purple-300';
                          if (hasAnswered) {
                            if (isCorrectOpt) {
                              btnStyle = 'bg-emerald-500 border-emerald-600 text-white font-black';
                            } else if (isSelected) {
                              btnStyle = 'bg-rose-500 border-rose-600 text-white font-black';
                            } else {
                              btnStyle = 'bg-slate-100 dark:bg-slate-800 opacity-60 border-transparent';
                            }
                          }

                          return (
                            <button
                              key={optIdx}
                              type="button"
                              disabled={hasAnswered}
                              onClick={() => {
                                setDoctorQuizAnswer(optIdx);
                                if (isCorrectOpt) {
                                  playSuccessChime();
                                } else {
                                  playWrongTone();
                                }
                              }}
                              className={`p-3 rounded-xl border-2 text-xs sm:text-sm font-en font-bold transition text-left cursor-pointer ${btnStyle}`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                      {doctorQuizAnswer !== null && (
                        <p className="text-xs font-bold text-slate-600 dark:text-slate-300 pt-1">
                          {doctorResult.miniQuiz.explanationAr}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: LESSON ASSISTANT                                  */}
      {/* ======================================================== */}
      {viewTab === 'lesson_help' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-b-6 border-slate-200 border-b-slate-300 dark:border-slate-800 dark:border-b-slate-950 space-y-6 shadow-xs animate-in fade-in">
          <div className="space-y-1 text-right">
            <div className="flex items-center gap-2 text-xs font-black text-purple-600 dark:text-purple-400">
              <BookOpen className="w-4 h-4 text-purple-500" />
              <span>مساعد ومفسر دروس المنهج التفاعلي</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              اختر أي درس من المنهج واسأل المعلم عنه
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
              سيقوم المعلم بشرح القاعدة بأسلوب مبسط، أو تدريبك على جمل عملية تطبق نفس موضوع الدرس.
            </p>
          </div>

          {/* Lesson Selector */}
          <div className="space-y-2 text-right">
            <span className="text-xs font-black text-slate-700 dark:text-slate-300 block">
              اختر الدرس المستهدف:
            </span>
            <select
              value={selectedLessonId}
              onChange={(e) => setSelectedLessonId(e.target.value)}
              className="w-full p-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-hidden focus:border-purple-500"
            >
              {CURRICULUM_LESSONS.map((l) => (
                <option key={l.id} value={l.id}>
                  [{l.level}] {l.titleAr} ({l.titleEn})
                </option>
              ))}
            </select>
          </div>

          {/* Target Lesson Info Card */}
          <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-right space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-lg bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-200 font-black text-xs font-en">
                {currentTargetLesson.level}
              </span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                {currentTargetLesson.chapterTitleAr}
              </span>
            </div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              {currentTargetLesson.titleAr}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
              {currentTargetLesson.summaryAr}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => handleAskAboutLesson('explain')}
              className="p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-b-4 border-purple-200 border-b-purple-400 dark:border-slate-700 text-right space-y-1 hover:border-purple-400 active:translate-y-0.5 transition cursor-pointer"
            >
              <Lightbulb className="w-5 h-5 text-purple-600" />
              <span className="text-xs font-black block text-slate-900 dark:text-white">
                اشرح لي فكرة الدرس
              </span>
              <span className="text-[11px] text-slate-400 font-medium block">
                تفسير مبسط بالعربية والإنجليزية
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleAskAboutLesson('quiz')}
              className="p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-b-4 border-sky-200 border-b-sky-400 dark:border-slate-700 text-right space-y-1 hover:border-sky-400 active:translate-y-0.5 transition cursor-pointer"
            >
              <CheckCircle2 className="w-5 h-5 text-sky-600" />
              <span className="text-xs font-black block text-slate-900 dark:text-white">
                اختبرني في هذا الدرس
              </span>
              <span className="text-[11px] text-slate-400 font-medium block">
                سؤالان لاختبار فهمك السريع
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleAskAboutLesson('dialogue')}
              className="p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-b-4 border-emerald-200 border-b-emerald-400 dark:border-slate-700 text-right space-y-1 hover:border-emerald-400 active:translate-y-0.5 transition cursor-pointer"
            >
              <MessageSquare className="w-5 h-5 text-[#58cc02]" />
              <span className="text-xs font-black block text-slate-900 dark:text-white">
                محادثة تطبق الدرس
              </span>
              <span className="text-[11px] text-slate-400 font-medium block">
                حوار حي يوظف نفس القواعد
              </span>
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: INTERACTIVE CHAT STREAM                           */}
      {/* ======================================================== */}
      {viewTab === 'chat' && (
        <div className="space-y-4">
          {/* Tutor Modes Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {TUTOR_MODES.map((m) => {
              const isSelected = tutorMode === m.id;
              const Icon = m.icon;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => handleSelectMode(m.id)}
                  className={`p-3 rounded-2xl border-2 border-b-4 text-right transition cursor-pointer select-none space-y-1 ${
                    isSelected
                      ? 'border-b-[#368002] text-white shadow-sm translate-y-[-2px]'
                      : 'bg-white dark:bg-slate-900 border-slate-200 border-b-slate-300 dark:border-slate-800 dark:border-b-slate-950 text-slate-700 dark:text-slate-300 hover:border-slate-300 active:translate-y-0.5'
                  }`}
                  style={{
                    backgroundColor: isSelected ? m.color : undefined,
                    borderColor: isSelected ? m.color : undefined,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <Icon className="w-5 h-5 shrink-0" />
                    <span className="text-[10px] font-black uppercase opacity-90">
                      {m.id}
                    </span>
                  </div>
                  <span className="text-xs font-black block leading-tight">
                    {m.titleAr}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Scenarios, Playback Speed & Reset */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-2xs">
            {tutorMode === 'conversation' ? (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none flex-1">
                {SCENARIOS.map((sc) => (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => handleSelectScenario(sc.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                      selectedScenario === sc.id
                        ? 'bg-[#58cc02] text-white font-black shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {sc.titleAr}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
                {TUTOR_MODES.find((m) => m.id === tutorMode)?.descAr}
              </div>
            )}

            <div className="flex items-center gap-2 shrink-0">
              {/* Reset Chat Button */}
              <button
                type="button"
                onClick={handleResetChat}
                className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center gap-1 cursor-pointer transition"
                title="بدء جلسة محادثة جديدة وتصفير السجل"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>محادثة جديدة</span>
              </button>

              {/* Speed Toggle */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setPlaybackSpeed(0.9)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition ${
                    playbackSpeed >= 0.85
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-black'
                      : 'text-slate-500'
                  }`}
                  title="سرعة نطق طبيعية"
                >
                  <Rabbit className="w-3.5 h-3.5 text-sky-500" />
                  <span>عادي</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPlaybackSpeed(0.7)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition ${
                    playbackSpeed < 0.85
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-black'
                      : 'text-slate-500'
                  }`}
                  title="سرعة نطق متمهلة للمبتدئين"
                >
                  <Snail className="w-3.5 h-3.5 text-amber-500" />
                  <span>بطيء</span>
                </button>
              </div>
            </div>
          </div>

          {/* Messages Stream Box */}
          <div className="min-h-[440px] max-h-[62vh] overflow-y-auto p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-b-6 border-slate-200 border-b-slate-300 dark:border-slate-800 dark:border-b-slate-950 space-y-4 shadow-sm">
            {messages.map((m) => {
              const isUser = m.sender === 'user';
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
                >
                  <div
                    className={`max-w-[90%] sm:max-w-[80%] p-4 rounded-3xl space-y-2 text-xs sm:text-sm font-medium ${
                      isUser
                        ? 'bg-[#1cb0f6] text-white rounded-br-xs text-left shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-white rounded-bl-xs text-left border-2 border-slate-200/70 dark:border-slate-700'
                    }`}
                    dir="ltr"
                  >
                    {/* English Text with audio buttons */}
                    <div className="flex items-start justify-between gap-3">
                      <span className="font-en font-semibold leading-relaxed break-words flex-1">
                        {m.text}
                      </span>
                      {!isUser && m.englishAudioText && (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => playSpeech(m.englishAudioText!, `${m.id}-slow`, 0.7)}
                            className="p-1 rounded-lg bg-white/60 dark:bg-slate-700 hover:bg-white text-amber-600 cursor-pointer"
                            title="استمع ببطء"
                          >
                            <Snail className="w-3.5 h-3.5" />
                          </button>
                          <AudioButton
                            size="sm"
                            isPlaying={isPlaying(m.id)}
                            onClick={() => playSpeech(m.englishAudioText!, m.id, playbackSpeed)}
                          />
                        </div>
                      )}
                    </div>

                    {/* Arabic Translation */}
                    {!isUser && m.translationAr && (
                      <div
                        className="p-2.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs text-right font-sans"
                        dir="rtl"
                      >
                        {m.translationAr}
                      </div>
                    )}
                  </div>

                  {/* Grammar Correction Card */}
                  {m.correction && (
                    <div
                      className="max-w-[90%] sm:max-w-[80%] p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs space-y-1.5 text-right animate-in fade-in"
                      dir="rtl"
                    >
                      <div className="flex items-center gap-1.5 font-bold text-rose-700 dark:text-rose-400">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>تصحيح لغوي دقيق:</span>
                      </div>
                      <div className="flex items-center gap-2" dir="ltr">
                        <span className="font-en text-rose-600 line-through">{m.correction.original}</span>
                        <span>→</span>
                        <span className="font-en font-bold text-emerald-600">{m.correction.corrected}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                        {m.correction.explanationAr}
                      </p>
                    </div>
                  )}

                  {/* Vocabulary Highlight Card with Add to Deck Button */}
                  {m.vocabHighlight && (
                    <div
                      className="max-w-[90%] sm:max-w-[80%] p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs space-y-2 text-right animate-in fade-in"
                      dir="rtl"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-black text-amber-800 dark:text-amber-300">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span>مفردة مميزة: {m.vocabHighlight.word}</span>
                          {m.vocabHighlight.ipa && (
                            <span className="font-en text-[11px] text-slate-500" dir="ltr">
                              {m.vocabHighlight.ipa}
                            </span>
                          )}
                        </div>

                        {!savedVocabIds[m.vocabHighlight.word] ? (
                          <button
                            type="button"
                            onClick={() => handleAddVocabToDeck(m.vocabHighlight!)}
                            className="px-2.5 py-1 rounded-xl bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100 text-[10px] font-black flex items-center gap-1 cursor-pointer hover:bg-amber-300"
                          >
                            <Plus className="w-3 h-3" />
                            <span>أضف للمفردات (SRS)</span>
                          </button>
                        ) : (
                          <span className="text-[10px] text-emerald-600 font-black flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            محفوظة في حقيبتك
                          </span>
                        )}
                      </div>
                      <p className="text-slate-700 dark:text-slate-200 font-bold">
                        المعنى: {m.vocabHighlight.arabicMeaning}
                      </p>
                      {m.vocabHighlight.exampleEn && (
                        <div className="font-en text-[11px] text-slate-500" dir="ltr">
                          "{m.vocabHighlight.exampleEn}"
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-500 font-medium w-fit">
                <div className="w-3 h-3 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
                <span>المعلم يكتب رده الآن...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {voiceError && (
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-xs font-bold text-amber-800 dark:text-amber-200 flex items-center justify-between gap-2 text-right">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{voiceError}</span>
              </div>
              <button
                type="button"
                onClick={() => setVoiceError(null)}
                className="text-[11px] underline cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          )}



          {/* Input Box Footer */}
          <div className="p-2 sm:p-3 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 flex items-center gap-2 shadow-sm">
            <button
              type="button"
              onClick={handleToggleVoiceInput}
              className={`p-3 rounded-2xl transition cursor-pointer ${
                isRecording
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
              title="إدخال صوتي بالميكروفون"
            >
              <Mic className="w-5 h-5" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              placeholder="اكتب رسالتك بالإنجليزية أو بالعربية وسيرد عليك المعلم..."
              className="flex-1 px-3 py-2 bg-transparent text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:outline-hidden"
              dir="auto"
            />

            <button
              type="button"
              disabled={!inputText.trim() || isLoading}
              onClick={() => handleSendMessage()}
              className="p-3 rounded-2xl bg-[#58cc02] hover:bg-[#46a302] text-white disabled:opacity-50 disabled:pointer-events-none cursor-pointer transition shadow-xs"
            >
              <Send className="w-5 h-5 rtl:rotate-180" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
