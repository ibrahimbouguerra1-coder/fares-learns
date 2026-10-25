// Sentence diagnostic engine for bilingual English-Arabic linguistic analysis

export interface SentenceDiagnosis {
  original: string;
  isCorrect: boolean;
  corrected: string;
  naturalAlternative: string;
  errorTypeAr: string;
  explanationAr: string;
  arabicMotherTongueInfluence: string;
  miniQuiz: {
    questionAr: string;
    options: string[];
    correctIndex: number;
    explanationAr: string;
  } | null;
}

export function diagnoseSentenceLocally(rawText: string): SentenceDiagnosis {
  const original = rawText.trim();
  let working = original;
  const issues: string[] = [];
  const explanations: string[] = [];
  let motherTongue = '';
  let quiz: SentenceDiagnosis['miniQuiz'] = null;

  // 1. Typos: friens -> friends
  if (/\bfriens\b/i.test(working)) {
    working = working.replace(/\bfriens\b/gi, 'friends');
    issues.push('خطأ إملائي في كلمة friends');
    explanations.push("يوجد خطأ إملائي في كلمة 'friens'، والصواب هو 'friends' بإضافة حرف d في نهاية عنقود الصوامت.");
    if (!quiz) {
      quiz = {
        questionAr: 'اختر التهجئة الإنجليزية الصحيحة لكلمة "أصدقاء":',
        options: ['friens', 'friends', 'frends', 'freinds'],
        correctIndex: 1,
        explanationAr: "تُكتب كلمة أصدقاء بالإنجليزية: friends مع (ie) وحرف (d).",
      };
    }
  }

  // 2. Preposition / typo: et home -> at home
  if (/\bet\s+home\b/i.test(working)) {
    working = working.replace(/\bet\s+home\b/gi, 'at home');
    issues.push('حرف الجر مع المنزل (at home)');
    explanations.push("حرف الجر 'et' غير صحيح؛ والصواب في الإنجليزية هو استخدام 'at home' للدلالة على التواجد في المنزل.");
    motherTongue = "خطأ إملائي أو خلط صوتي بحرف الجر الفرنسي 'et' أو نطق حرف A كـ E.";
  }

  // 3. i am agree / i'm agree -> I agree
  if (/\b(i am agree|i'm agree|im agree)\b/i.test(working)) {
    working = working.replace(/\b(i am agree|i'm agree|im agree)\b/gi, 'I agree');
    issues.push('فعل الكينونة الزائد قبل agree');
    explanations.push("كلمة 'agree' في الإنجليزية هي فعل قائم بذاته وليست صفة، لذلك نقول 'I agree' مباشرة بدون (am).");
    motherTongue = "في العربية نقول 'أنا متفق' (اسم فاعل/صفة)، فينقلها المتعلم حرفياً بوضع فعل الكينونة am.";
    quiz = {
      questionAr: 'كيف تعبر عن موافقتك لشخص بالإنجليزية بشكل سليم؟',
      options: ['I am agree with you', 'I agree with you', 'I agreeing you'],
      correctIndex: 1,
      explanationAr: "لأن agree فعل، فلا نضع أمامه am في زمن المضارع البسيط.",
    };
  }

  // 4. didn't went / did not went -> didn't go
  if (/\bdidn't\s+went\b/i.test(working) || /\bdid\s+not\s+went\b/i.test(working)) {
    working = working.replace(/\bdidn't\s+went\b/gi, "didn't go").replace(/\bdid\s+not\s+went\b/gi, "did not go");
    issues.push('الفعل المجرد بعد أداة النفي did');
    explanations.push("بعد أداة النفي (didn't) يجب إعادة الفعل إلى صورته الأصلية المجردة (Infinitive)، فنقول 'didn't go' وليس 'didn't went'.");
    motherTongue = "يرغب المتعلم العربي في تأكيد وقوع الفعل في الماضي، فيقوم بتصريف كل من أداة النفي والفعل الرئيسي معاً.";
    quiz = {
      questionAr: 'اختر الجملة المنفية الصحيحة في الزمن الماضي:',
      options: ["She didn't went to school", "She didn't go to school", "She didn't goes to school"],
      correctIndex: 1,
      explanationAr: "بعد didn't نستخدم الفعل في المصدر المجرد (go).",
    };
  }

  // 5. didn't saw -> didn't see
  if (/\bdidn't\s+saw\b/i.test(working)) {
    working = working.replace(/\bdidn't\s+saw\b/gi, "didn't see");
    issues.push('قاعدة المصدر بعد didn\'t');
    explanations.push("بعد didn't نستخدم الفعل المجرد: didn't see بدلاً من didn't saw.");
  }

  // 6. I have X years -> I am X years old
  const ageMatch = working.match(/\bi\s+have\s+(\d+)\s+years(\s+old)?\b/i);
  if (ageMatch) {
    const age = ageMatch[1];
    working = working.replace(new RegExp(`\\bi\\s+have\\s+${age}\\s+years(\\s+old)?\\b`, 'gi'), `I am ${age} years old`);
    issues.push('التعبير عن العمر (I am وليس I have)');
    explanations.push("في اللغة الإنجليزية يُعبّر عن العمر بفعل الكينونة (To Be) وليس الملكية: 'I am 20 years old'.");
    motherTongue = "ترجمة حرفية من اللغة العربية 'عندي 20 سنة' باستخدام فعل الملكية have.";
  }

  // 7. married with -> married to
  if (/\bmarried\s+with\b/i.test(working)) {
    working = working.replace(/\bmarried\s+with\b/gi, 'married to');
    issues.push('حرف الجر مع كلمة married');
    explanations.push("حرف الجر الصحيح مع 'married' هو 'to' وليس 'with' (مثال: He is married to a doctor).");
    motherTongue = "ترجمة حرفية لحرف الجر العربي 'متزوج بـ / مع' فينقلها بـ with.";
  }

  // 8. listen music -> listen to music
  if (/\blisten\s+music\b/i.test(working)) {
    working = working.replace(/\blisten\s+music\b/gi, 'listen to music');
    issues.push('حرف الجر بعد فعل listen');
    explanations.push("الفعل listen يحتاج دائماً إلى حرف الجر 'to' عندما نحدد ما نستمع إليه.");
  }

  // 9. Subject verb agreement: he go / she go -> he goes / she goes
  if (/\b(he|she|it)\s+go\b/i.test(working)) {
    working = working.replace(/\b(he|she|it)\s+go\b/gi, '$1 goes');
    issues.push('إضافة es للمفرد الغائب (He/She/It)');
    explanations.push("مع ضمائر المفرد الغائب في المضارع البسيط يجب إضافة es للفعل: (goes).");
  }

  // 9b. Erroneous s/es with I/you/we/they + verb: I goes / they plays
  if (/\b(i|you|we|they)\s+goes\b/i.test(working)) {
    const isPast = /\b(yesterday|last\s+\w+|ago)\b/i.test(working);
    const replacement = isPast ? '$1 went' : '$1 go';
    working = working.replace(/\b(i|you|we|they)\s+goes\b/gi, replacement);
    issues.push(isPast ? 'تصريف الفعل الماضي (went مع yesterday)' : 'عدم إضافة s/es مع ضمائر المتكلم والجمع (I go)');
    explanations.push(
      isPast
        ? "لوجود دلالة زمنية ماضية (مثل yesterday)، يجب تصريف الفعل في الماضي البسيط: 'went' وليس 'goes'."
        : "مع ضمير المتكلم (I) وضمائر الجمع (we, they, you) في المضارع البسيط يبقى الفعل مجرداً بدون s: 'I go' وليس 'I goes'."
    );
    motherTongue = "الخلط بين تصاريف أزمنة الأفعال الإنجليزية وقواعد المفرد والجمع.";
  }

  // 9c. Missing verb to be (الجملة الاسمية العربية): I student / He doctor / She happy
  if (/\bi\s+(a\s+student|a\s+teacher|a\s+doctor|happy|sad|tired|ready)\b/i.test(working)) {
    working = working.replace(/\bi\s+(a\s+student|a\s+teacher|a\s+doctor|happy|sad|tired|ready)\b/gi, 'I am $1');
    issues.push('حذف فعل الكينونة To Be (I am)');
    explanations.push("في اللغة الإنجليزية لا توجد جملة اسمية بدون فعل، ويجب استخدام (am) بعد ضمير المتكلم I.");
    motherTongue = "ترجمة حرفية للجملة الاسمية في اللغة العربية (أنا طالب) بدون فعل ظاهر.";
  } else if (/\b(he|she|it)\s+(a\s+student|a\s+teacher|a\s+doctor|happy|sad|tired|ready)\b/i.test(working)) {
    working = working.replace(/\b(he|she|it)\s+(a\s+student|a\s+teacher|a\s+doctor|happy|sad|tired|ready)\b/gi, '$1 is $2');
    issues.push('حذف فعل الكينونة To Be (is)');
    explanations.push("في اللغة الإنجليزية لا توجد جملة اسمية بدون فعل، ويجب وضع فعل الكينونة (is) مع ضمائر المفرد الغائب.");
    motherTongue = "تأثير بنية الجملة الاسمية في العربية حيث لا تتطلب فعلاً في زمن الحاضر.";
  }

  // 10. he don't / she don't -> he doesn't / she doesn't
  if (/\b(he|she|it)\s+don't\b/i.test(working)) {
    working = working.replace(/\b(he|she|it)\s+don't\b/gi, "$1 doesn't");
    issues.push('نفي المفرد الغائب (doesn\'t)');
    explanations.push("المفرد الغائب (He, She, It) يُنفى بـ doesn't وليس don't.");
  }

  // 11. Lowercase standalone 'i' -> 'I'
  if (/\bi\b/.test(working)) {
    working = working.replace(/\bi\b/g, 'I');
    if (!issues.length) {
      issues.push('كتابة ضمير المتكلم I بحرف كبير');
      explanations.push("ضمير المتكلم (I) يُكتب دائماً بحرف كبير في كل مواضع الجملة.");
    }
  }

  // 12. Fix common general typos
  const typoPairs: [RegExp, string, string][] = [
    [/\bteh\b/gi, 'the', 'خطأ طباعي في كلمة the'],
    [/\brecieve\b/gi, 'receive', 'قاعدة i قبل e إلا بعد c (receive)'],
    [/\bdefinately\b/gi, 'definitely', 'تهجئة كلمة definitely'],
    [/\balot\b/gi, 'a lot', 'كلمة a lot تتكون من كلمتين منفصلتين'],
    [/\buntill\b/gi, 'until', 'كلمة until بحرف l واحد'],
  ];

  for (const [pattern, rep, label] of typoPairs) {
    if (pattern.test(working)) {
      working = working.replace(pattern, rep);
      issues.push(label);
    }
  }

  // Capitalize first character
  if (working.length > 0 && /^[a-z]/.test(working)) {
    working = working.charAt(0).toUpperCase() + working.slice(1);
  }

  // Ensure trailing punctuation
  let withPunctuation = working;
  if (withPunctuation.length > 0 && !/[.!?]$/.test(withPunctuation)) {
    withPunctuation += '.';
  }

  const isDifferent =
    working.toLowerCase().replace(/[^a-z0-9]/g, '') !==
    original.toLowerCase().replace(/[^a-z0-9]/g, '');

  if (isDifferent || issues.length > 0) {
    return {
      original,
      isCorrect: false,
      corrected: withPunctuation,
      naturalAlternative: withPunctuation,
      errorTypeAr: issues.join(' و ') || 'تدقيق لغوي وإملائي',
      explanationAr:
        explanations.join(' ') ||
        'تم تدقيق الجملة وتصحيح الأخطاء اللغوية والإملائية لتتوافق مع معايير الإنجليزية السليمة.',
      arabicMotherTongueInfluence:
        motherTongue ||
        'غالباً ما تنشأ هذه الأخطاء من الترجمة الحرفية من العربية أو التداخل الصوتي بين الأحرف الإنجليزية.',
      miniQuiz: quiz,
    };
  }

  return {
    original,
    isCorrect: true,
    corrected: withPunctuation,
    naturalAlternative: withPunctuation,
    errorTypeAr: 'صياغة ممتازة وسليمة',
    explanationAr: 'الجملة مكتوبة بصياغة إنجليزية صحيحة وخالية من الأخطاء النحوية أو الإملائية الواضحة.',
    arabicMotherTongueInfluence: '',
    miniQuiz: null,
  };
}
