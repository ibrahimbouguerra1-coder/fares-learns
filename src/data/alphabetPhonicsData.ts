export interface AlphabetLetter {
  upper: string;
  lower: string;
  nameAr: string;
  soundAr: string;
  isVowel: boolean;
  exampleWord: string;
  examplePhoneticAr: string;
  exampleMeaningAr: string;
  arabicNote?: string;
}

export interface PhonicsRule {
  id: string;
  combination: string;
  soundAr: string;
  titleAr: string;
  explanationAr: string;
  examples: {
    word: string;
    phoneticAr: string;
    meaningAr: string;
  }[];
}

export interface SurvivalPhraseCategory {
  id: string;
  titleAr: string;
  phrases: {
    en: string;
    phoneticAr: string;
    ar: string;
    usageTipAr?: string;
  }[];
}

export const ENGLISH_ALPHABET: AlphabetLetter[] = [
  { upper: 'A', lower: 'a', nameAr: 'إيه', soundAr: 'آه / أ / إي (صوت متحرك)', isVowel: true, exampleWord: 'Apple', examplePhoneticAr: 'أَبَل', exampleMeaningAr: 'تفاحة' },
  { upper: 'B', lower: 'b', nameAr: 'بي (خفيفة)', soundAr: 'ب (مجهور بانحباس صوتي)', isVowel: false, exampleWord: 'Book', examplePhoneticAr: 'بُوك', exampleMeaningAr: 'كتاب' },
  { upper: 'C', lower: 'c', nameAr: 'سي', soundAr: 'ك (أو س قبل e, i, y)', isVowel: false, exampleWord: 'Cat / City', examplePhoneticAr: 'كَات / سِيتِي', exampleMeaningAr: 'قطة / مدينة', arabicNote: 'يُنطق س إذا جاء بعده e أو i أو y.' },
  { upper: 'D', lower: 'd', nameAr: 'دي', soundAr: 'د (مرققة في مقدمة الفم)', isVowel: false, exampleWord: 'Door', examplePhoneticAr: 'دُور', exampleMeaningAr: 'باب' },
  { upper: 'E', lower: 'e', nameAr: 'إي', soundAr: 'إِ / إي (متحرك)', isVowel: true, exampleWord: 'Egg', examplePhoneticAr: 'إِيج', exampleMeaningAr: 'بيضة' },
  { upper: 'F', lower: 'f', nameAr: 'إف', soundAr: 'ف (هواء بين الأسنان والشفة)', isVowel: false, exampleWord: 'Friend', examplePhoneticAr: 'فريند', exampleMeaningAr: 'صديق' },
  { upper: 'G', lower: 'g', nameAr: 'جي', soundAr: 'ج قاهرية / ج معطشة', isVowel: false, exampleWord: 'Good', examplePhoneticAr: 'جُود', exampleMeaningAr: 'جيد' },
  { upper: 'H', lower: 'h', nameAr: 'إيتش', soundAr: 'هـ (زفير لطيف من الحلق)', isVowel: false, exampleWord: 'House', examplePhoneticAr: 'هَاوْس', exampleMeaningAr: 'منزل', arabicNote: 'يشبه الهاء العربية الصافية مثل Hello.' },
  { upper: 'I', lower: 'i', nameAr: 'آي', soundAr: 'إِ قصيرة / آي ممتدة', isVowel: true, exampleWord: 'In / Ice', examplePhoneticAr: 'إِن / آيْس', exampleMeaningAr: 'في / ثلج' },
  { upper: 'J', lower: 'j', nameAr: 'جاي', soundAr: 'دجـ (معطشة بشدة)', isVowel: false, exampleWord: 'Job', examplePhoneticAr: 'دْجُوب', exampleMeaningAr: 'وظيفة' },
  { upper: 'K', lower: 'k', nameAr: 'كاي', soundAr: 'ك (صامت قبل N)', isVowel: false, exampleWord: 'Key', examplePhoneticAr: 'كِي', exampleMeaningAr: 'مفتاح' },
  { upper: 'L', lower: 'l', nameAr: 'إل', soundAr: 'ل (مرققة أو مفخمة Dark L)', isVowel: false, exampleWord: 'Life', examplePhoneticAr: 'لايْف', exampleMeaningAr: 'حياة' },
  { upper: 'M', lower: 'm', nameAr: 'إم', soundAr: 'م (إطباق الشفتين)', isVowel: false, exampleWord: 'Morning', examplePhoneticAr: 'مُورْنِينْج', exampleMeaningAr: 'صباح' },
  { upper: 'N', lower: 'n', nameAr: 'إن', soundAr: 'ن (طرف اللسان في سقف الحلق)', isVowel: false, exampleWord: 'Name', examplePhoneticAr: 'نَيْم', exampleMeaningAr: 'اسم' },
  { upper: 'O', lower: 'o', nameAr: 'أو', soundAr: 'أُو / أُ قصيرة', isVowel: true, exampleWord: 'Open', examplePhoneticAr: 'أُوبِن', exampleMeaningAr: 'يفتح / مفتوح' },
  { upper: 'P', lower: 'p', nameAr: 'پي (شديدة)', soundAr: 'پ (انفجار هوائي محسوس)', isVowel: false, exampleWord: 'Pen', examplePhoneticAr: 'پِين', exampleMeaningAr: 'قلم', arabicNote: 'احبس الهواء واطلقه باندفاع قوي لتمييزه عن الباء.' },
  { upper: 'Q', lower: 'q', nameAr: 'كيو', soundAr: 'كْو (دائماً يتبعه u)', isVowel: false, exampleWord: 'Question', examplePhoneticAr: 'كْوِيسْشَن', exampleMeaningAr: 'سؤال' },
  { upper: 'R', lower: 'r', nameAr: 'آر', soundAr: 'ر (بدون تكرار اللسان)', isVowel: false, exampleWord: 'Read', examplePhoneticAr: 'رِيد', exampleMeaningAr: 'يقرأ' },
  { upper: 'S', lower: 's', nameAr: 'إس', soundAr: 'س (صفير نقي)', isVowel: false, exampleWord: 'Sun', examplePhoneticAr: 'سَان', exampleMeaningAr: 'شمس' },
  { upper: 'T', lower: 't', nameAr: 'تي', soundAr: 'ت (مرققة مع همسة هواء)', isVowel: false, exampleWord: 'Time', examplePhoneticAr: 'تَايْم', exampleMeaningAr: 'وقت' },
  { upper: 'U', lower: 'u', nameAr: 'يو', soundAr: 'آ / يو (متحرك)', isVowel: true, exampleWord: 'Sun / Use', examplePhoneticAr: 'سَان / يُوز', exampleMeaningAr: 'شمس / يستخدم', arabicNote: 'يُنطق غالباً كفتحة مفخمة سريعة (Cup, Bus).' },
  { upper: 'V', lower: 'v', nameAr: 'ڤي', soundAr: 'ڤ (اهتزاز صوتي كالنحلة)', isVowel: false, exampleWord: 'Very', examplePhoneticAr: 'ڤِيرِي', exampleMeaningAr: 'جداً' },
  { upper: 'W', lower: 'w', nameAr: 'دبليو', soundAr: 'و (استدارة الشفتين)', isVowel: false, exampleWord: 'Water', examplePhoneticAr: 'وَاتَر', exampleMeaningAr: 'ماء' },
  { upper: 'X', lower: 'x', nameAr: 'إكس', soundAr: 'كْس (أو ز أحياناً)', isVowel: false, exampleWord: 'Box', examplePhoneticAr: 'بُوكس', exampleMeaningAr: 'صندوق' },
  { upper: 'Y', lower: 'y', nameAr: 'واي', soundAr: 'ي (شبه صامت)', isVowel: false, exampleWord: 'Yes', examplePhoneticAr: 'يِس', exampleMeaningAr: 'نعم' },
  { upper: 'Z', lower: 'z', nameAr: 'زِد / زي', soundAr: 'ز (طنين صوتي)', isVowel: false, exampleWord: 'Zero', examplePhoneticAr: 'زِيرُو', exampleMeaningAr: 'صفر' },
];

export const GOLDEN_PHONICS_RULES: PhonicsRule[] = [
  {
    id: 'ph-sh',
    combination: 'SH',
    soundAr: 'ش',
    titleAr: 'صوت الشين (SH)',
    explanationAr: 'حرفا S و H معاً ينتجان صوت الشين الصافي تماماً مثل شمس.',
    examples: [
      { word: 'She', phoneticAr: 'شِي', meaningAr: 'هي' },
      { word: 'Shop', phoneticAr: 'شُوب', meaningAr: 'محل / يتسوق' },
      { word: 'Wash', phoneticAr: 'وَاش', meaningAr: 'يغسل' },
    ],
  },
  {
    id: 'ph-ch',
    combination: 'CH',
    soundAr: 'تش',
    titleAr: 'صوت التش (CH)',
    explanationAr: 'حرفا C و H ينتجان صوت التاء المدموجة مع الشين (تْش).',
    examples: [
      { word: 'Chair', phoneticAr: 'تْشِير', meaningAr: 'كرسي' },
      { word: 'Teach', phoneticAr: 'تِيتْش', meaningAr: 'يُعلّم' },
      { word: 'Cheap', phoneticAr: 'تْشِيب', meaningAr: 'رخيص' },
    ],
  },
  {
    id: 'ph-th',
    combination: 'TH',
    soundAr: 'ث / ذ',
    titleAr: 'صوتا الثاء والذال (TH)',
    explanationAr: 'يُنطق إما مهموساً مثل الثاء (Three) أو مجهوراً مثل الذال (This).',
    examples: [
      { word: 'Three', phoneticAr: 'ثْرِي', meaningAr: 'ثلاثة (ث)' },
      { word: 'Thank you', phoneticAr: 'ثَانْك يُو', meaningAr: 'شكراً لك (ث)' },
      { word: 'This', phoneticAr: 'ذِس', meaningAr: 'هذا (ذ)' },
      { word: 'Father', phoneticAr: 'فَاذَر', meaningAr: 'أب (ذ)' },
    ],
  },
  {
    id: 'ph-ph',
    combination: 'PH',
    soundAr: 'ف',
    titleAr: 'صوت الفاء (PH)',
    explanationAr: 'التركيب PH يُنطق دائماً فاء صريحة (F).',
    examples: [
      { word: 'Phone', phoneticAr: 'فُون', meaningAr: 'هاتف' },
      { word: 'Photo', phoneticAr: 'فُوتُو', meaningAr: 'صورة' },
      { word: 'Pharmacy', phoneticAr: 'فَارْمَسِي', meaningAr: 'صيدلية' },
    ],
  },
  {
    id: 'ph-tion',
    combination: 'TION',
    soundAr: 'شَن',
    titleAr: 'المقطع الختامي (-tion)',
    explanationAr: 'أي كلمة تنتهي بـ tion تُنطق دائماً (شَن).',
    examples: [
      { word: 'Information', phoneticAr: 'إِنْفُورْمَيْشَن', meaningAr: 'معلومات' },
      { word: 'Station', phoneticAr: 'سْتَيْشَن', meaningAr: 'محطة' },
      { word: 'Education', phoneticAr: 'إِدْيُوكَيْشَن', meaningAr: 'تعليم' },
    ],
  },
  {
    id: 'ph-silent-e',
    combination: 'Magic E',
    soundAr: 'تمديد الحركة السابقة',
    titleAr: 'حرف E السحري الصامت',
    explanationAr: 'حرف E في نهاية الكلمة لا يُنطق، لكنه يجعل الحرف المتحرك قبله يُنطق باسمه الطويل.',
    examples: [
      { word: 'Hat -> Hate', phoneticAr: 'هَات -> هَيْت', meaningAr: 'قبعة -> يكره' },
      { word: 'Kit -> Kite', phoneticAr: 'كِت -> كَايْت', meaningAr: 'حقيبة عدة -> طائرة ورقية' },
      { word: 'Name', phoneticAr: 'نَيْم (الـ E صامتة)', meaningAr: 'اسم' },
    ],
  },
  {
    id: 'ph-silent-letters',
    combination: 'KN / WR / GH',
    soundAr: 'حروف صامتة شائعة',
    titleAr: 'الحروف الصامتة الشهيرة',
    explanationAr: 'حرف K صامت قبل N، وحرف W صامت قبل R، وتركيب GH صامت في وسط الكلمات.',
    examples: [
      { word: 'Know / Knife', phoneticAr: 'نُو / نَايْف (الـ K صامت)', meaningAr: 'يعرف / سكين' },
      { word: 'Write / Wrong', phoneticAr: 'رَايْت / رُونْج (الـ W صامت)', meaningAr: 'يكتب / خطأ' },
      { word: 'Night / Light', phoneticAr: 'نَايْت / لايْت (الـ GH صامت)', meaningAr: 'ليل / ضوء' },
    ],
  },
];

export const SURVIVAL_PHRASE_CATEGORIES: SurvivalPhraseCategory[] = [
  {
    id: 'surv-greetings',
    titleAr: 'التحيات والتعارف الأول',
    phrases: [
      { en: 'Hello, how are you?', phoneticAr: 'هَلُو، هَاوْ آر يُو؟', ar: 'مرحباً، كيف حالك؟' },
      { en: 'I am fine, thank you.', phoneticAr: 'آيْ آمْ فَايْن، ثَانْك يُو.', ar: 'أنا بخير، شكراً لك.' },
      { en: 'My name is Ahmed.', phoneticAr: 'مَايْ نَيْم إِز أَحْمَد.', ar: 'اسمي أحمد.' },
      { en: 'Nice to meet you.', phoneticAr: 'نَايْس تُو مِيتْ يُو.', ar: 'سعدت بلقائك.' },
      { en: 'Where are you from?', phoneticAr: 'وَيْر آر يُو فْرُومْ؟', ar: 'من أين أنت؟' },
    ],
  },
  {
    id: 'surv-polite',
    titleAr: 'العبارات المهذبة السحرية',
    phrases: [
      { en: 'Excuse me, please.', phoneticAr: 'إِكْسْكْيُوزْ مِي، بْلِيزْ.', ar: 'معذرة، من فضلك.' },
      { en: 'Thank you very much.', phoneticAr: 'ثَانْك يُو ڤِيرِي مَاتْش.', ar: 'شكراً جزيلاً لك.' },
      { en: 'You are welcome.', phoneticAr: 'يُو آر وِلْكَام.', ar: 'عفواً (على الرحب والسعة).' },
      { en: 'I am sorry.', phoneticAr: 'آيْ آمْ سُورِي.', ar: 'أنا آسف.' },
      { en: 'No problem.', phoneticAr: 'نُو بْرُوبْلِيم.', ar: 'لا توجد مشكلة.' },
    ],
  },
  {
    id: 'surv-needs',
    titleAr: 'التعبير عن الاحتياجات الأساسية',
    phrases: [
      { en: 'I want water, please.', phoneticAr: 'آيْ وَانْت وَاتَر، بْلِيزْ.', ar: 'أريد ماءً، من فضلك.' },
      { en: 'I need urgent help.', phoneticAr: 'آيْ نِيدْ أُورْجَنْت هِلْب.', ar: 'أحتاج إلى مساعدة عاجلة.' },
      { en: 'Where is the nearest hospital?', phoneticAr: 'وَيْر إِز ذَا نِيرِسْت هُوسْبِيتَال؟', ar: 'أين تقع أقرب مستشفى؟' },
      { en: 'How much does this cost?', phoneticAr: 'هَاوْ مَاتْش دَازْ ذِس كُوسْت؟', ar: 'كم تكلفة هذا؟' },
      { en: 'Where is the bathroom, please?', phoneticAr: 'وَيْر إِز ذَا بَاثْرُوم، بْلِيزْ؟', ar: 'أين الحمام من فضلك؟' },
      { en: 'How do I get to the airport?', phoneticAr: 'هَاوْ دُو آيْ جِت تُو ذي إِيرْبُورْت؟', ar: 'كيف أصل إلى المطار؟' },
      { en: 'Can you speak slowly, please?', phoneticAr: 'كَانْ يُو سْبِيكْ سْلُولِي، بْلِيزْ؟', ar: 'هل يمكنك التحدث ببطء من فضلك؟' },
      { en: 'I do not understand.', phoneticAr: 'آيْ دُو نُوتْ أَنْدَرْسْتَانْد.', ar: 'أنا لا أفهم.' },
    ],
  },
  {
    id: 'surv-numbers-days',
    titleAr: 'الأرقام والأيام والأوقات',
    phrases: [
      { en: 'One, Two, Three, Four, Five', phoneticAr: 'وَانْ، تُو، ثْرِي، فُور، فَايْف', ar: 'واحد، اثنان، ثلاثة، أربعة، خمسة' },
      { en: 'Six, Seven, Eight, Nine, Ten', phoneticAr: 'سِكْس، سِيڤِن، إِيْت، نَايْن، تِين', ar: 'ستة، سبعة، ثمانية، تسعة، عشرة' },
      { en: 'Today / Tomorrow / Yesterday', phoneticAr: 'تُودَاي / تُمُورُو / يِسْتَرْدَاي', ar: 'اليوم / غداً / أمس' },
      { en: 'Morning / Evening / Night', phoneticAr: 'مُورْنِينْج / إِيڤْنِينْج / نَايْت', ar: 'الصباح / المساء / الليل' },
    ],
  },
];
