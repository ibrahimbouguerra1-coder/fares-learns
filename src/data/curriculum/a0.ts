import type { Lesson } from '../../types/learning.ts';

export const A0_LESSONS: Lesson[] = [
  {
    id: 'lesson-a0-0-alphabet-and-phonics',
    level: 'A0',
    order: 0,
    chapterOrder: 1,
    chapterTitleAr: 'الوحدة 1: الحروف والأصوات الإنجليزية',
    chapterTitleEn: 'Chapter 1: Alphabet & Phonics Foundations',
    titleAr: 'الدرس 0: الأبجدية الإنجليزية ومخارج الحروف',
    titleEn: 'Lesson 0: Comprehensive Alphabet & Phonics Foundations',
    category: 'التأسيس والصوتيات (A0)',
    iconName: 'Volume2',
    estimatedMinutes: 15,
    objectivesAr: [
      'التمييز الصوتي بين اسم الحرف (Letter Name) وصوت الحرف (Letter Sound).',
      'إتقان الحروف المتحركة الخمسة (A, E, I, O, U) ونطقها القصير والطويل.',
      'التحكم في الأزواج الصوتية الصعبة: (P مقابل B) و (V مقابل F).',
      'فهم أصوات الحروف المركبة: TH (المهموسة والمجهورة) ومقاطع (SH, CH, PH, -TION).',
      'تطبيق قاعدة السحر لحرف E الصامت (Magic E) والحروف الصامتة قبل N.',
    ],
    explanationMarkdownAr: `### التأسيس الصوتي الشامل: الحروف والأصوات

#### 1. الفارق بين اسم الحرف وصوته
- **اسم الحرف (Letter Name)**: هو ما نردده عند سرد الأبجدية (A, B, C, D...).
- **صوت الحرف (Letter Sound)**: هو الصوت الحقيقي الذي نخرجه عند قراءة الكلمة.
> **قاعدة ذهبية**: لا تقرأ الكلمات بأسمائها! فحرف **C** صوته غالباً /k/ كما في **Cat** وحرف **W** صوته /w/ كما في **Water**.

#### 2. الحروف المتحركة الخمسة (Vowels: A, E, I, O, U)
- **A a** (الفتحة): **Apple** (تفاحة) - **Cat** (قطة)
- **E e** (الكسرة المفتوحة): **Egg** (بيضة) - **Pen** (قلم)
- **I i** (الكسرة السريعة الخفيفة): **In** (في) - **Sit** (يجلس)
- **O o** (الضمة المستديرة): **Open** (مفتوح) - **Hot** (ساخن)
- **U u** (الفتحة المفخمة السريعة): **Sun** (شمس) - **Cup** (فنجان)

#### 3. أصوات التحدي الكبرى للناطقين بالعربية
1. **صوت P مقابل B**:
   - **B** (صوت مجهور يهتز في الحبال الصوتية): **Book** (كتاب) - **Baby** (طفل).
   - **P** (صوت مهموس يخرج باندفاع قوي للهواء): **Park** (حديقة) - **Pen** (قلم).
   > *تحذير خطير*: نطق P كـ B يغير المعنى تماماً، مثل **Bark** (نباح كلب) مقابل **Park** (حديقة عامة).
2. **صوت V مقابل F**:
   - **F**: هواء يتدفق بين الأسنان والشفة: **Fish** (سمكة) - **Fan** (مروحة).
   - **V**: اهتزاز أحبال صوتية ملموس مثل طنين النحلة: **Voice** (صوت) - **Van** (شاحنة).
3. **صوتا TH**:
   - مهموس مثل الثاء /θ/: **Three** (ثلاثة) - **Thanks** (شكراً) - **Think** (يفكر).
   - مجهور مثل الذال /ð/: **This** (هذا) - **That** (ذلك) - **Mother** (أم).

#### 4. الحروف السحرية والصامتة (Magic E)
عندما تنتهي الكلمة بحرف **e** صامت، فإنه يمدد الحرف المتحرك قبله لينطق باسمه الطويل:
- **Hat** (قبعة) -> **Hate** (يكره).
- **Kit** (حقيبة عدة) -> **Kite** (طائرة ورقية).
- **Hop** (يقفز) -> **Hope** (يأمل).
- **Tub** (حوض) -> **Tube** (أنبوب).`,
    rulesAndStructuresAr: `الحروف المتحركة 5 (A, E, I, O, U). حرف E في نهاية الكلمة يطيل حركة العلة السابقة (Magic E). حروف صامتة شائعة: K قبل N (Knee, Know)، و W قبل R (Write, Wrong).`,
    summaryAr: 'الأبجدية الإنجليزية 26 حرفاً تصدر 44 صوتاً. الحروف المتحركة هي نبض الكلمة، وحرف P يخرج بهواء نفاث، وحرف V يهتز كالنحلة.',
    arabicContrastPoint: {
      titleAr: 'تحدي P و B عند الناطقين بالعربية',
      descriptionAr: 'لا يوجد في العربية صوت P المهموس، مما يدفع المتعلم لنطقه كالباء (B) ويحدث تشويشاً هائلاً.',
      badArabicHabit: 'I want to bark my car in the bark.',
      correctEnglishWay: 'I want to park my car in the park.',
    },
    examples: [
      { en: 'Please open the book.', ar: 'من فضلك افتح الكتاب.', phoneticAr: 'بْلِيز أُوبِن ذَا بُوك', noteAr: 'انتبه لصوت P في Please وصوت B في book' },
      { en: 'This is a small park.', ar: 'هذه حديقة عامة صغيرة.', phoneticAr: 'ذِس إِز أَ سْمُول بَارك', noteAr: 'انتبه لصوت TH الذال في This وصوت P في park' },
      { en: 'She has five pens.', ar: 'هي لديها خمسة أقلام.', phoneticAr: 'شِي هَاز فَايْف پِينْز', noteAr: 'صوت SH في She وصوت P في Pens وصوت V في Five' },
      { en: 'Thank you very much.', ar: 'شكراً جزيلاً لك.', phoneticAr: 'ثَانْك يُو ڤِيرِي مَاتْش', noteAr: 'صوت TH الثاء وصوت V واختام CH في Much' },
    ],
    vocabulary: [
      { word: 'Alphabet', ipa: '/ˈæl.fə.bet/', partOfSpeech: 'noun', meaningAr: 'الأبجدية', exampleEn: 'The English alphabet has 26 letters.', exampleAr: 'الأبجدية الإنجليزية تحتوي على 26 حرفاً.' },
      { word: 'Vowel', ipa: '/ˈvaʊ.əl/', partOfSpeech: 'noun', meaningAr: 'حرف متحرك', exampleEn: 'A, E, I, O, and U are vowels.', exampleAr: 'A و E و I و O و U هي الحروف المتحركة.' },
      { word: 'Sound', ipa: '/saʊnd/', partOfSpeech: 'noun', meaningAr: 'صوت الحرف', exampleEn: 'Listen to the sound of each letter.', exampleAr: 'استمع لصوت كل حرف.' },
      { word: 'Park', ipa: '/pɑːrk/', partOfSpeech: 'noun', meaningAr: 'حديقة عامة', exampleEn: 'We walk in the park.', exampleAr: 'نمشي في الحديقة العامة.' },
      { word: 'Book', ipa: '/bʊk/', partOfSpeech: 'noun', meaningAr: 'كتاب', exampleEn: 'Read this English book.', exampleAr: 'اقرأ هذا الكتاب الإنجليزي.' },
      { word: 'Voice', ipa: '/vɔɪs/', partOfSpeech: 'noun', meaningAr: 'صوت بشري', exampleEn: 'Speak in a clear voice.', exampleAr: 'تحدث بصوت واضح.' },
    ],
    commonMistakes: [
      { wrong: 'I want to bark my car.', correct: 'I want to park my car.', reasonAr: 'كلمة Bark تعني نباح الكلب، و Park تعني يوقف السيارة أو حديقة.' },
      { wrong: 'I have tree brothers.', correct: 'I have three brothers.', reasonAr: 'كلمة Tree تعني شجرة، و Three تعني ثلاثة بصوت TH.' },
      { wrong: 'Open the bage.', correct: 'Open the page.', reasonAr: 'الصفحة هي Page بصوت P وليس Bage.' },
    ],
    realWorldChallengeAr: 'قف أمام المرآة وضع يدك أمام فمك، وانطق كلمتي Park و Bark حتى تشعر باندفاع الهواء مع حرف P وانعدامه مع حرف B.',
    exercises: [
      {
        id: 'a0-0-ex-1',
        type: 'multiple_choice',
        instructionAr: 'اختر الكلمة الصحيحة التي تعني "حديقة عامة":',
        instructionEn: 'Choose the correct word that means a public garden:',
        question: 'We like to play in the ______ on Friday.',
        options: ['park', 'bark', 'dark', 'pork'],
        correctAnswer: 0,
        explanationAr: 'كلمة park تعني حديقة عامة، أما bark فتعني نباح الكلب.',
      },
      {
        id: 'a0-0-ex-2',
        type: 'multiple_choice',
        instructionAr: 'ما هو الصوت الصحيح للحرفين SH في كلمة "Shop"؟',
        instructionEn: 'What is the correct sound of the digraph SH in "Shop"?',
        question: 'The sound of SH in "Shop" sounds like:',
        options: ['ش (صوت الشين الصافي)', 'تْش (صوت مركب مع تاء)', 'س (صوت السين)', 'ف (صوت الفاء)'],
        correctAnswer: 0,
        explanationAr: 'الحرفان SH يعطيان صوت الشين الصافي /ʃ/ مثل She و Shop و Fish.',
      },
      {
        id: 'a0-0-ex-3',
        type: 'fill_blank',
        instructionAr: 'اكتب الكلمة الإنجليزية للرقم 3:',
        instructionEn: 'Type the English word for the number 3:',
        question: 'I have ______ (ثلاثة) books.',
        correctAnswer: ['three', 'Three'],
        explanationAr: 'الرقم 3 يكتب Three ويبدأ بصوت TH المهموس.',
      },
      {
        id: 'a0-0-ex-4',
        type: 'multiple_choice',
        instructionAr: 'ما هو تأثير حرف E السحري في كلمة "Kite" مقارنة بـ "Kit"؟',
        instructionEn: 'What is the effect of the silent E in "Kite" compared to "Kit"?',
        question: 'In the word "Kite", the silent E makes the letter I sound:',
        options: ['طويلاً مثل اسمه /aɪ/ (آي)', 'قصيراً خافتاً /ɪ/', 'صامتاً لا ينطق', 'يتحول إلى حرف O'],
        correctAnswer: 0,
        explanationAr: 'حرف E السحري في نهاية الكلمة يجعل الحرف المتحرك (I) ينطق باسمه الطويل (آي).',
      },
      {
        id: 'a0-0-ex-5',
        type: 'sentence_scramble',
        instructionAr: 'رتب الكلمات لتكوين جملة إنجليزية صحيحة:',
        instructionEn: 'Put the words in order to form a correct English sentence:',
        question: 'book / Please / your / open',
        correctAnswer: 'Please open your book',
        explanationAr: 'الترتيب الصحيح: Please (من فضلك) ثم الفعل open ثم المفعول your book.',
      },
      {
        id: 'a0-0-ex-6',
        type: 'error_hunt',
        instructionAr: 'صحح الخطأ الإملائي في كلمة القلم (اكتب الكلمة المصححة فقط):',
        instructionEn: 'Correct the spelling mistake (type only the corrected word):',
        question: 'Write with this blue ben.',
        correctAnswer: ['pen', 'Pen'],
        explanationAr: 'القلم يكتب Pen بحرف P وليس ben.',
      },
      {
        id: 'a0-0-ex-7',
        type: 'multiple_choice',
        instructionAr: 'اختر الكلمة التي يُنطق فيها TH بصوت الذال (مجهور):',
        instructionEn: 'Which word has the voiced TH sound like the Arabic letter (ذ)?',
        question: 'Choose the word with the voiced TH sound (ذ):',
        options: ['This', 'Think', 'Three', 'Thanks'],
        correctAnswer: 0,
        explanationAr: 'كلمة This تنطق بصوت الذال /ð/، بينما Think و Three و Thanks تنطق ثاء /θ/.',
      },
      {
        id: 'a0-0-ex-8',
        type: 'arabic_to_english',
        instructionAr: 'ترجم العبارة المهذبة "شكراً لك":',
        instructionEn: 'Translate into English: "شكراً لك":',
        question: 'Translate: "شكراً لك"',
        correctAnswer: ['Thank you', 'thank you', 'Thanks', 'thanks'],
        explanationAr: 'الترجمة الصحيحة هي "Thank you" أو "Thanks" مع صوت TH الصافي.',
      },
    ],
  },
  {
    id: 'lesson-a0-1-reading-phonics-words',
    level: 'A0',
    order: 1,
    chapterOrder: 1,
    chapterTitleAr: 'الوحدة 1: الحروف والأصوات الإنجليزية',
    chapterTitleEn: 'Chapter 1: Alphabet & Phonics Foundations',
    titleAr: 'الدرس 1: دمج الأصوات وقراءة أولى الكلمات الإنجليزية',
    titleEn: 'Lesson 1: How to Blend Sounds and Read English Words',
    category: 'التأسيس والصوتيات (A0)',
    iconName: 'Sparkles',
    estimatedMinutes: 14,
    objectivesAr: [
      'فهم طريقة دمج الأصوات الساكنة والمتحركة (Blending: CVC Words).',
      'قراءة الكلمات الثلاثية الأساسية: cat, bed, pin, top, run.',
      'التمييز بين المقطع الصوتي المركب CH (تش) و SH (ش).',
      'قراءة المقطع الشهير TION كـ (شن).',
      'بناء الثقة في قراءة أي كلمة إنجليزية جديدة دون تردد.',
    ],
    explanationMarkdownAr: `### دمج الأصوات وقراءة الكلمات من الصفر

#### 1. دمج كلمات CVC (ساكن - متحرك - ساكن)
- **C + A + T** = /k/ + /æ/ + /t/ = **Cat** (قطة)
- **B + E + D** = /b/ + /e/ + /d/ = **Bed** (سرير)
- **P + I + N** = /p/ + /ɪ/ + /n/ = **Pin** (دبوس)
- **H + O + T** = /h/ + /ɑː/ + /t/ = **Hot** (ساخن)
- **S + U + N** = /s/ + /ʌ/ + /n/ = **Sun** (شمس)

#### 2. الفارق بين CH و SH
- **CH** تعطي صوت التاء المشبوكة مع الشين /tʃ/:
  - **Chair** (كرسي) - **Child** (طفل) - **Match** (مباراة) - **Watch** (ساعة/يشاهد).
- **SH** تعطي صوت الشين الصافي /ʃ/:
  - **Ship** (سفينة) - **Shoe** (حذاء) - **Fish** (سمكة) - **Wish** (أمنية).

#### 3. مقطع الختام السحري (-TION = شن)
حين ترى الأحرف الأربعة **-tion** في نهاية الكلمة، تنطق دائماً /ʃən/:
- **Action** (حركة / إجراء)
- **Station** (محطة)
- **Information** (معلومات).`,
    rulesAndStructuresAr: `طريقة القراءة: دمج الأصوات الساكنة مع أصوات العلة (S + U + N = Sun). تركيب CH = /tʃ/ وتركيب SH = /ʃ/. المقطع -TION ينطق دائماً /ʃən/ (شن).`,
    summaryAr: 'تتكون الكلمات من دمج الأصوات. تدرب على مقاطع CVC، وفرق بين صوت CH (تش) وصوت SH (ش)، وتذكر أن مقطع TION ينطق دائماً شن.',
    arabicContrastPoint: {
      titleAr: 'تجنب قراءة الحروف كما تكتب حرفياً',
      descriptionAr: 'لا تنطق كلمة Action كـ "أك-تي-أون" أو Ship كـ "س-هيب". في الإنجليزية الحروف المركبة تشكل صوتاً جديداً كلياً.',
      badArabicHabit: 'The bus is at the sta-tee-on.',
      correctEnglishWay: 'The bus is at the station (ستايشن).',
    },
    examples: [
      { en: 'The cat sleeps on the bed.', ar: 'القطة تنام على السرير.', phoneticAr: 'ذَا كَات سْلِيبْس أُون ذَا بِيد', noteAr: 'انتبه لكلمات CVC البسيطة: Cat و Bed' },
      { en: 'Go to the train station.', ar: 'اذهب إلى محطة القطار.', phoneticAr: 'جُو تُو ذَا تْرَيْن سْتَيْشَن', noteAr: 'المقطع -tion ينطق شن' },
      { en: 'Sit on this chair.', ar: 'اجلس على هذا الكرسي.', phoneticAr: 'سِت أُون ذِس تْشِير', noteAr: 'صوت CH في Chair يبدأ بتاء خفيفة' },
      { en: 'I see a big ship.', ar: 'أرى سفينة كبيرة.', phoneticAr: 'آيْ سِي أَ بِيج شِيب', noteAr: 'صوت SH في Ship شين صافية' },
    ],
    vocabulary: [
      { word: 'Cat', ipa: '/kæt/', partOfSpeech: 'noun', meaningAr: 'قطة', exampleEn: 'The black cat is cute.', exampleAr: 'القطة السوداء لطيفة.' },
      { word: 'Bed', ipa: '/bed/', partOfSpeech: 'noun', meaningAr: 'سرير', exampleEn: 'I go to bed at ten.', exampleAr: 'أذهب إلى السرير في العاشرة.' },
      { word: 'Chair', ipa: '/tʃer/', partOfSpeech: 'noun', meaningAr: 'كرسي', exampleEn: 'Please sit on the chair.', exampleAr: 'من فضلك اجلس على الكرسي.' },
      { word: 'Ship', ipa: '/ʃɪp/', partOfSpeech: 'noun', meaningAr: 'سفينة', exampleEn: 'The ship is in the sea.', exampleAr: 'السفينة في البحر.' },
      { word: 'Station', ipa: '/ˈsteɪ.ʃən/', partOfSpeech: 'noun', meaningAr: 'محطة', exampleEn: 'Wait for me at the station.', exampleAr: 'انتظرني عند المحطة.' },
      { word: 'Action', ipa: '/ˈæk.ʃən/', partOfSpeech: 'noun', meaningAr: 'إجراء / عمل', exampleEn: 'We need fast action.', exampleAr: 'نحتاج إلى إجراء سريع.' },
    ],
    commonMistakes: [
      { wrong: 'I wait at the bus stat-yon.', correct: 'I wait at the bus station.', reasonAr: 'المقطع -tion ينطق (شن/ʃən) وليس تيون.' },
      { wrong: 'Sit on the shair.', correct: 'Sit on the chair.', reasonAr: 'الكرسي يبدأ بـ Chair وصوت تش وليس SH.' },
      { wrong: 'Look at the chip in the sea.', correct: 'Look at the ship in the sea.', reasonAr: 'السفينة هي Ship أما Chip فتعني رقاقة بطاطس!' },
    ],
    realWorldChallengeAr: 'ابحث في غرفتك عن ثلاثة أشياء من كلمات CVC البسيطة وانطقها بصوت مسموع: Bed, Chair, Cup.',
    exercises: [
      {
        id: 'a0-1-ex-1',
        type: 'multiple_choice',
        instructionAr: 'كيف ينطق المقطع الختامي -tion في كلمة "Station"؟',
        instructionEn: 'How is the ending suffix -tion pronounced in "Station"?',
        question: 'The ending -tion in "Station" is pronounced as:',
        options: ['شن (/ʃən/)', 'تي-أون (/ti-on/)', 'سي-أون (/si-on/)', 'تين (/tɪn/)'],
        correctAnswer: 0,
        explanationAr: 'المقطع -tion ينطق دائماً كصوت (شن/ʃən).',
      },
      {
        id: 'a0-1-ex-2',
        type: 'multiple_choice',
        instructionAr: 'اختر الكلمة الصحيحة التي تعني "كرسي":',
        instructionEn: 'Choose the word that means a piece of furniture for sitting:',
        question: 'Please sit down on the ______.',
        options: ['chair', 'share', 'care', 'hair'],
        correctAnswer: 0,
        explanationAr: 'الكرسي هو Chair بصوت CH (تش)، بينما share تعني يشارك.',
      },
      {
        id: 'a0-1-ex-3',
        type: 'fill_blank',
        instructionAr: 'اكتب الكلمة الإنجليزية للشمس (3 حروف):',
        instructionEn: 'Type the 3-letter English word for "sun":',
        question: 'The ______ shines in the sky.',
        correctAnswer: ['sun', 'Sun'],
        explanationAr: 'الشمس هي Sun بصوت الفتحة المفخمة السريعة U.',
      },
      {
        id: 'a0-1-ex-4',
        type: 'multiple_choice',
        instructionAr: 'ما الفرق بين "Ship" و "Chip"؟',
        instructionEn: 'What is the difference between "Ship" and "Chip"?',
        question: 'Choose the correct pair of meanings:',
        options: [
          'Ship = سفينة ، Chip = رقاقة بطاطس',
          'Ship = رقاقة ، Chip = سفينة',
          'كلاهما يعني نفس الشيء تماماً',
          'Ship = كرسي ، Chip = سيارة',
        ],
        correctAnswer: 0,
        explanationAr: 'Ship تبدأ بصوت SH الصافي (سفينة)، و Chip تبدأ بصوت CH المركب (رقاقة).',
      },
      {
        id: 'a0-1-ex-5',
        type: 'sentence_scramble',
        instructionAr: 'رتب الكلمات لتكوين جملة صحيحة:',
        instructionEn: 'Reorder the words to form a correct sentence:',
        question: 'is / The / black / cat',
        correctAnswer: 'The cat is black',
        explanationAr: 'الترتيب الصحيح: الفاعل The cat ثم فعل الكينونة is ثم الصفة black.',
      },
      {
        id: 'a0-1-ex-6',
        type: 'error_hunt',
        instructionAr: 'صحح الكلمة الخاطئة للسرير (اكتب الكلمة المصححة فقط):',
        instructionEn: 'Correct the misspelled word (type only the corrected word):',
        question: 'I sleep on a soft bad.',
        correctAnswer: ['bed', 'Bed'],
        explanationAr: 'السرير هو Bed بحرف E، أما bad فتعني سيئ.',
      },
      {
        id: 'a0-1-ex-7',
        type: 'arabic_to_english',
        instructionAr: 'ترجم كلمة "معلومات" إلى الإنجليزية:',
        instructionEn: 'Translate the word "معلومات" into English:',
        question: 'Translate: "معلومات"',
        correctAnswer: ['information', 'Information'],
        explanationAr: 'كلمة معلومات هي Information وتنتهي بمقطع -tion (شن).',
      },
      {
        id: 'a0-1-ex-8',
        type: 'multiple_choice',
        instructionAr: 'أي كلمة تبدأ بصوت /tʃ/ (تش)؟',
        instructionEn: 'Choose the word that begins with the /tʃ/ sound:',
        question: 'Which word starts with the /tʃ/ sound?',
        options: ['Child', 'Shoes', 'Shop', 'Short'],
        correctAnswer: 0,
        explanationAr: 'كلمة Child تبدأ بـ CH وصوتها تش، بينما باقي الكلمات تبدأ بـ SH وصوتها ش.',
      },
    ],
  },
  {
    id: 'lesson-a0-2-greetings-numbers-basics',
    level: 'A0',
    order: 2,
    chapterOrder: 2,
    chapterTitleAr: 'الوحدة 2: التحيات والأرقام والمفردات اليومية',
    chapterTitleEn: 'Chapter 2: Greetings, Numbers & Everyday Vocabulary',
    titleAr: 'الدرس 2: التحيات، التعريف بالنفس، والعبارات اللبقة',
    titleEn: 'Lesson 2: Greetings, Introductions & Polite Expressions',
    category: 'التأسيس والمحادثة (A0)',
    iconName: 'MessageSquare',
    estimatedMinutes: 14,
    objectivesAr: [
      'استخدام تحيات اليوم حسب الوقت بدقة (Morning, Afternoon, Evening, Night).',
      'التعريف بالنفس والسؤال عن اسم الطرف الآخر بطريقة مهذبة.',
      'إتقان الكلمات السحرية الأربع في الإنجليزية: Please, Thank you, Excuse me, Sorry.',
      'توديع الآخرين بلباقة: Goodbye, See you later.',
      'إجراء أول محادثة تعارف إنجليزية كاملة بنجاح.',
    ],
    explanationMarkdownAr: `### التحيات والتعارف الأول بالإنجليزية

#### 1. التحيات بحسب الوقت من اليوم
- **Good morning** (صباح الخير): تُقال من الفجر حتى منتصف النهار (12:00 PM).
- **Good afternoon** (مساء الخير / نهارك سعيد): تُقال من بعد الظهر 12:00 حتى مغيب الشمس.
- **Good evening** (مساء الخير): تُقال للترحيب عند اللقاء في المساء.
- **Good night** (تصبح على خير): تُقال فقط عند المغادرة للنوم أو الانصراف ليلاً!

#### 2. كيف تعرف بنفسك؟
- **السؤال عن الاسم**: *What is your name?* (ما اسمك؟)
- **الإجابة**: *My name is Fares.* أو ببساطة: *I am Fares.*
- **التعبير عن السعادة باللقاء**: *Nice to meet you!* (سعدت بلقائك!)
- **الرد عليه**: *Nice to meet you too!* (سعدت بلقائك أيضاً!)

#### 3. كيف تسأل عن الحال؟
- **السؤال**: *How are you?* (كيف حالك؟)
- **الإجابات المهذبة الشائعة**:
  - *I am fine, thank you.* (أنا بخير، شكراً لك.)
  - *Very good, thanks!* (بأحسن حال، شكراً!)
  - *And you?* (وأنت؟)

#### 4. الكلمات السحرية الأربع (The 4 Polite Words)
\`\`\`
Please        = من فضلك (تضاف للطلب)
Thank you     = شكراً لك (للتقدير)
Excuse me     = معذرة / لو سمحت (للفت الانتباه أو المرور)
Sorry         = آسف / أعتذر (عند الخطأ أو عدم السماع)
\`\`\``,
    rulesAndStructuresAr: `صيغة الاسم: My name is + [الاسم] أو I am + [الاسم]. قاعدة Good night تقال عند الوداع والنوم فقط وليس عند اللقاء. رد Nice to meet you يكون بإضافة Too في النهاية: Nice to meet you too.`,
    summaryAr: 'ابدأ يومك بـ Good morning، ومساءك بـ Good evening، وعرف بنفسك بـ My name is، ورد على من يسألك بـ I am fine thank you.',
    arabicContrastPoint: {
      titleAr: 'الفرق القاتل بين Good evening و Good night',
      descriptionAr: 'في العربية نقول "تصبح على خير" أو "طابت ليلتك"، ولكن في الإنجليزية إذا قابلت صديقاً في الساعة 8 مساءً لا تقل Good night! لأنها تعني أنك راحل لتنام. قل Good evening للتحية و Good night للوداع فقط.',
      badArabicHabit: 'Meeting someone at 8 PM: "Good night, how are you?"',
      correctEnglishWay: 'Meeting someone at 8 PM: "Good evening, how are you?"',
    },
    examples: [
      { en: 'Good morning! My name is Omar.', ar: 'صباح الخير! اسمي عمر.', phoneticAr: 'جُود مُورْنِينْج! مَاي نَيْم إِز عُمَر' },
      { en: 'Nice to meet you, Sara.', ar: 'سعدت بلقائك يا سارة.', phoneticAr: 'نَايْس تُو مِيت يُو، سَارَة' },
      { en: 'How are you today? - I am fine, thanks.', ar: 'كيف حالك اليوم؟ - أنا بخير، شكراً.', phoneticAr: 'هَاوْ آر يُو تُودَاي؟ - آيْ آمْ فَايْن، ثَانْكْس' },
      { en: 'Excuse me, where is the hotel?', ar: 'معذرة، أين يقع الفندق؟', phoneticAr: 'إِكْسْكْيُوز مِي، وَيْر إِز ذَا هُوتِل؟' },
    ],
    vocabulary: [
      { word: 'Morning', ipa: '/ˈmɔːr.nɪŋ/', partOfSpeech: 'noun', meaningAr: 'صباح', exampleEn: 'Good morning, everyone.', exampleAr: 'صباح الخير جميعاً.' },
      { word: 'Evening', ipa: '/ˈiːv.nɪŋ/', partOfSpeech: 'noun', meaningAr: 'مساء', exampleEn: 'Good evening, sir.', exampleAr: 'مساء الخير يا سيدي.' },
      { word: 'Name', ipa: '/neɪm/', partOfSpeech: 'noun', meaningAr: 'اسم', exampleEn: 'My name is Ali.', exampleAr: 'اسمي علي.' },
      { word: 'Meet', ipa: '/miːt/', partOfSpeech: 'verb', meaningAr: 'يلتقي / يقابل', exampleEn: 'Nice to meet you.', exampleAr: 'سعدت بلقائك.' },
      { word: 'Fine', ipa: '/faɪn/', partOfSpeech: 'adjective', meaningAr: 'بخير وبصحة جيدة', exampleEn: 'I am fine, thank you.', exampleAr: 'أنا بخير، شكراً لك.' },
      { word: 'Excuse me', ipa: '/ɪkˈskjuːz miː/', partOfSpeech: 'phrase', meaningAr: 'معذرة / لو سمحت', exampleEn: 'Excuse me, can you help me?', exampleAr: 'معذرة، هل يمكنك مساعدتي؟' },
    ],
    commonMistakes: [
      { wrong: 'Meeting a friend at 7 PM: "Good night, Ali!"', correct: 'Meeting a friend at 7 PM: "Good evening, Ali!"', reasonAr: 'عبارة Good night للوداع والنوم فقط، والتحية المسائية هي Good evening.' },
      { wrong: 'Nice to meet you. - Nice to meet you also.', correct: 'Nice to meet you. - Nice to meet you too.', reasonAr: 'في ردود التحيات نستخدم كلمة too في نهاية الجملة.' },
      { wrong: 'I have good.', correct: 'I am fine. / I am good.', reasonAr: 'للإخبار عن الحال نستخدم فعل الكينونة am وليس have.' },
    ],
    realWorldChallengeAr: 'حاول اليوم أن تحيي شخصاً بالإنجليزية بـ "Good morning" أو "Thank you" أو "Excuse me" عندما تطلب شيئاً.',
    exercises: [
      {
        id: 'a0-2-ex-1',
        type: 'multiple_choice',
        instructionAr: 'ما هي التحية المناسبة في الساعة التاسعة صباحاً؟',
        instructionEn: 'What is the appropriate greeting at 9:00 AM?',
        question: 'At 9:00 AM, you say:',
        options: ['Good morning', 'Good night', 'Good evening', 'Goodbye'],
        correctAnswer: 0,
        explanationAr: 'في الصباح نقول Good morning.'
      },
      {
        id: 'a0-2-ex-2',
        type: 'multiple_choice',
        instructionAr: 'كيف ترد عندما يقول لك شخص: "Nice to meet you"؟',
        instructionEn: 'When someone says "Nice to meet you", how do you reply?',
        question: 'Nice to meet you! -> ______',
        options: ['Nice to meet you too!', 'Good night!', 'Excuse me!', 'I am not fine.'],
        correctAnswer: 0,
        explanationAr: 'الرد القياسي المهذب هو "Nice to meet you too!" (سعدت بلقائك أيضاً).'
      },
      {
        id: 'a0-2-ex-3',
        type: 'fill_blank',
        instructionAr: 'أكمل الفراغ: "My ______ is Sara."',
        instructionEn: 'Fill in the blank: "My ______ is Sara."',
        question: 'My ______ is Sara.',
        correctAnswer: ['name', 'Name'],
        explanationAr: 'الكلمة الصحيحة هي name (اسمي سارة).'
      },
      {
        id: 'a0-2-ex-4',
        type: 'sentence_scramble',
        instructionAr: 'رتب الكلمات للسؤال عن الحال:',
        instructionEn: 'Put the words in order to ask how someone is doing:',
        question: 'are / How / you / ?',
        correctAnswer: 'How are you?',
        explanationAr: 'صيغة السؤال الصحيحة: How ثم are ثم you.'
      },
      {
        id: 'a0-2-ex-5',
        type: 'multiple_choice',
        instructionAr: 'متى نستخدم عبارة "Good night" بشكل صحيح؟',
        instructionEn: 'When do you correctly use "Good night"?',
        question: 'You say "Good night" when you are:',
        options: ['تغادر في المساء للذهاب إلى النوم', 'تقابل شخصاً في بداية السهرة', 'تطلب وجبة في مطعم صباحاً', 'تتعرف على صديق جديد'],
        correctAnswer: 0,
        explanationAr: 'تستخدم Good night فقط عند الوداع أو النوم.'
      },
      {
        id: 'a0-2-ex-6',
        type: 'arabic_to_english',
        instructionAr: 'ترجم عبارة "معذرة / لو سمحت":',
        instructionEn: 'Translate "معذرة / لو سمحت" into English:',
        question: 'Translate: "معذرة / لو سمحت"',
        correctAnswer: ['Excuse me', 'excuse me', 'Excuse me,', 'excuse me,'],
        explanationAr: 'الترجمة الصحيحة هي Excuse me.'
      },
      {
        id: 'a0-2-ex-7',
        type: 'multiple_choice',
        instructionAr: 'اختر الجواب الصحيح لسؤال: "How are you?"',
        instructionEn: 'Choose the correct answer to: "How are you?"',
        question: 'How are you today?',
        options: ['I am fine, thank you.', 'My name is John.', 'Good morning.', 'Yes, it is.'],
        correctAnswer: 0,
        explanationAr: 'الرد على سؤال الحال هو "I am fine, thank you" (أنا بخير، شكراً لك).'
      },
      {
        id: 'a0-2-ex-8',
        type: 'error_hunt',
        instructionAr: 'صحح التحية المسائية الخاطئة عند اللقاء (اكتب التحية الصحيحة فقط):',
        instructionEn: 'Correct the error in this greeting:',
        question: 'Good night, Ali! Welcome to my party at 8 PM!',
        correctAnswer: ['Good evening', 'good evening', 'Evening', 'evening'],
        explanationAr: 'عند اللقاء مساءً نقول Good evening وليس Good night.'
      }
    ]
  },
  {
    id: 'lesson-a0-3-numbers-time-colors',
    level: 'A0',
    order: 3,
    chapterOrder: 2,
    chapterTitleAr: 'الوحدة 2: التحيات والأرقام والمفردات اليومية',
    chapterTitleEn: 'Chapter 2: Greetings, Numbers & Everyday Vocabulary',
    titleAr: 'الدرس 3: الأرقام (1-100)، أيام الأسبوع، والألوان الأساسية',
    titleEn: 'Lesson 3: Numbers (1-100), Days of the Week & Colors',
    category: 'التأسيس والمفردات (A0)',
    iconName: 'Hash',
    estimatedMinutes: 15,
    objectivesAr: [
      'العد والنطق الصوتي السليم للأرقام من 1 حتى 20 ومن ثم حتى 100.',
      'التمييز الصوتي الحاسم بين مقطع -teen (سن المراهقة 13: Thirteen) ومقطع -ty (العقود 30: Thirty).',
      'حفظ أيام الأسبوع السبعة مع حرف الجر الخاص بها (On).',
      'استخدام الألوان كصفات قبل الأسماء بطريقة إنجليزية طبيعية.',
      'التعبير عن الأسعار وأرقام الهواتف ومواعيد الأسبوع بثقة.',
    ],
    explanationMarkdownAr: `### الأرقام، أيام الأسبوع، والألوان

#### 1. الأرقام الأساسية حتى 12 (حفظ متقن)
\`\`\`
1 = One (وَان)        4 = Four (فُور)        7 = Seven (سِيڤِن)       10 = Ten (تِين)
2 = Two (تُو)         5 = Five (فَايْف)       8 = Eight (إِيْت)        11 = Eleven (إِلِيڤِن)
3 = Three (ثْرِي)      6 = Six (سِكْس)        9 = Nine (نَايْن)        12 = Twelve (تْوِلْڤ)
\`\`\`

#### 2. الفارق الصوتي الأكبر: (-teen) مقابل (-ty)
- **مقطع -TEEN (أرقام المراهقين من 13 إلى 19)**: يكون التشديد الصوتي في نهاية الكلمة مع مد الياء:
  - **13 = Thirteen** (ثِرْتِين)
  - **14 = Fourteen** (فُورْتِين)
  - **15 = Fifteen** (فِفْتِين)
- **مقطع -TY (العقود الكاملة)**: يكون التشديد في بداية الكلمة وتختم بياء قصيرة سريعة:
  - **30 = Thirty** (ثِرْتِي)
  - **40 = Forty** (فُورْتِي)
  - **50 = Fifty** (فِفْتِي)
> انتبه: الخلط بين **Fifteen** (15) و **Fifty** (50) يسبب أخطاء فادحة في الأسعار وحجز التذاكر!

#### 3. أيام الأسبوع السبعة (Days of the Week)
تكتب دائماً بحرف كبير (**Capital Letter**) وتأخذ دائماً حرف الجر **on**:
- **Sunday** (الأحد)
- **Monday** (الاثنين)
- **Tuesday** (الثلاثاء)
- **Wednesday** (الأربعاء - انتبه: حرف D صامت تماماً!)
- **Thursday** (الخميس - تبدأ بصوت TH الثاء)
- **Friday** (الجمعة)
- **Saturday** (السبت)
> **قاعدة حرف الجر**: نقول **on Monday** (يوم الاثنين) و **on Friday** (يوم الجمعة).

#### 4. الألوان الأساسية (Colors)
في الإنجليزية نضع اللون (الصفة) **قبل** الشيء الموصوف:
- **Red** (أحمر): **A red car** (سيارة حمراء).
- **Blue** (أزرق): **A blue pen** (قلم أزرق).
- **Green** (أخضر): **Green tea** (شاي أخضر).
- **Black** (أسود) - **White** (أبيض) - **Yellow** (أصفر).`,
    rulesAndStructuresAr: `حرف الجر مع أيام الأسبوع هو on دائماً: on Friday, on Sunday. الألوان تأتي قبل الأسماء: Red apple وليس Apple red. حرف d في Wednesday صامت (تنطق wenzdeɪ). موقع النبر (Stress): ThirTEEN (13) مشددة في الآخر، بينما THIRty (30) مشددة في الأول.`,
    summaryAr: 'الأرقام من 1 إلى 100 سهلة إذا ميزت بين teen و ty. أيام الأسبوع تأخذ حرف الجر on، والألوان تأتي دائماً قبل الاسم الذي تصفه.',
    arabicContrastPoint: {
      titleAr: 'ترتيب الصفة والاسم (اللون والشيء)',
      descriptionAr: 'في العربية نقول: "سيارة زرقاء" (الاسم أولاً ثم اللون). في الإنجليزية العكس تماماً: نذكر اللون أولاً ثم الاسم (A blue car). لا تقل: "Car blue".',
      badArabicHabit: 'I bought a car blue yesterday.',
      correctEnglishWay: 'I bought a blue car yesterday.',
    },
    examples: [
      { en: 'I have three red pens.', ar: 'لدي ثلاثة أقلام حمراء.', phoneticAr: 'آيْ هَاف ثْرِي رِيد پِينْز', noteAr: 'انتبه للترتيب: three red pens' },
      { en: 'We meet on Friday.', ar: 'نلتقي يوم الجمعة.', phoneticAr: 'وِي مِيت أُون فْرَايْدَاي', noteAr: 'استخدام حرف الجر on مع الأيام' },
      { en: 'The room costs fifteen dollars.', ar: 'تكلفة الغرفة 15 دولاراً.', phoneticAr: 'ذَا رُوم كُوسْتْس فِفْتِين دُولَارْز', noteAr: 'النطق المشدد على 15 بمقطع -teen' },
      { en: 'Today is Wednesday.', ar: 'اليوم هو الأربعاء.', phoneticAr: 'تُودَاي إِز وِينْزْدَاي', noteAr: 'حرف d صامت تماماً' },
    ],
    vocabulary: [
      { word: 'One', ipa: '/wʌn/', partOfSpeech: 'number', meaningAr: 'واحد (1)', exampleEn: 'I have one sister.', exampleAr: 'لدي أخت واحدة.' },
      { word: 'Ten', ipa: '/ten/', partOfSpeech: 'number', meaningAr: 'عشرة (10)', exampleEn: 'Count from one to ten.', exampleAr: 'عد من واحد إلى عشرة.' },
      { word: 'Friday', ipa: '/ˈfraɪ.deɪ/', partOfSpeech: 'noun', meaningAr: 'يوم الجمعة', exampleEn: 'See you on Friday.', exampleAr: 'أراك يوم الجمعة.' },
      { word: 'Wednesday', ipa: '/ˈwenz.deɪ/', partOfSpeech: 'noun', meaningAr: 'يوم الأربعاء', exampleEn: 'We have a class on Wednesday.', exampleAr: 'لدينا درس يوم الأربعاء.' },
      { word: 'Red', ipa: '/red/', partOfSpeech: 'adjective', meaningAr: 'أحمر', exampleEn: 'She likes the red dress.', exampleAr: 'هي تحب الفستان الأحمر.' },
      { word: 'Blue', ipa: '/bluː/', partOfSpeech: 'adjective', meaningAr: 'أزرق', exampleEn: 'The sky is blue today.', exampleAr: 'السماء زرقاء اليوم.' },
    ],
    commonMistakes: [
      { wrong: 'I have a car red.', correct: 'I have a red car.', reasonAr: 'الصفة (اللون) تسبق الاسم الموصوف: a red car.' },
      { wrong: 'I will see you in Friday.', correct: 'I will see you on Friday.', reasonAr: 'أيام الأسبوع تأخذ حرف الجر on وليس in.' },
      { wrong: 'The price is fourteen (40).', correct: 'The price is forty (40).', reasonAr: 'الرقم 40 هو Forty أما Fourteen فهو 14.' },
    ],
    realWorldChallengeAr: 'قل بالإنجليزية رقم هاتفك رقماً رقماً، واذكر اليوم والتاريخ الحالي بالإنجليزية بصوت واضح.',
    exercises: [
      {
        id: 'a0-3-ex-1',
        type: 'multiple_choice',
        instructionAr: 'ما هو الترتيب الصحيح لعبارة "حقيبة سوداء"؟',
        instructionEn: 'What is the correct English word order for "حقيبة سوداء"?',
        question: 'Choose the correct phrase:',
        options: ['A black bag', 'A bag black', 'Black a bag', 'Bag the black'],
        correctAnswer: 0,
        explanationAr: 'في الإنجليزية تأتي الصفة (black) قبل الاسم (bag).'
      },
      {
        id: 'a0-3-ex-2',
        type: 'multiple_choice',
        instructionAr: 'أي حرف جر نستخدمه مع يوم الجمعة (Friday)؟',
        instructionEn: 'What is the correct preposition with days of the week?',
        question: 'We don\'t work ______ Friday.',
        options: ['on', 'in', 'at', 'to'],
        correctAnswer: 0,
        explanationAr: 'نستخدم دائماً حرف الجر on مع أيام الأسبوع (on Friday).'
      },
      {
        id: 'a0-3-ex-3',
        type: 'fill_blank',
        instructionAr: 'اكتب الكلمة الإنجليزية للرقم 15:',
        instructionEn: 'Type the English word for the number 15:',
        question: 'Ten plus five equals ______ (15).',
        correctAnswer: ['fifteen', 'Fifteen'],
        explanationAr: 'الرقم 15 يكتب fifteen وينتهي بمقطع teen المشدد.'
      },
      {
        id: 'a0-3-ex-4',
        type: 'multiple_choice',
        instructionAr: 'أي حرف لا ينطق أبداً في كلمة "Wednesday"؟',
        instructionEn: 'Which letter is silent in the word "Wednesday"?',
        question: 'In the word "Wednesday", which letter is completely silent?',
        options: ['The letter d', 'The letter w', 'The letter s', 'The letter n'],
        correctAnswer: 0,
        explanationAr: 'حرف d صامت تماماً في كلمة Wednesday (وتنطق /ˈwenz.deɪ/).'
      },
      {
        id: 'a0-3-ex-5',
        type: 'sentence_scramble',
        instructionAr: 'رتب الكلمات التالية لتكوين جملة إنجليزية سليمة:',
        instructionEn: 'Put the words in order to form a correct sentence:',
        question: 'has / five / He / pens / blue',
        correctAnswer: 'He has five blue pens',
        explanationAr: 'الترتيب الصحيح: الفاعل He + الفعل has + العدد five + اللون blue + الاسم pens.'
      },
      {
        id: 'a0-3-ex-6',
        type: 'error_hunt',
        instructionAr: 'صحح حرف الجر الخاطئ مع اليوم (اكتب الحرف الصحيح فقط):',
        instructionEn: 'Correct the preposition error:',
        question: 'The school starts in Sunday.',
        correctAnswer: ['on', 'On'],
        explanationAr: 'نستخدم on مع أيام الأسبوع وليس in: on Sunday.'
      },
      {
        id: 'a0-3-ex-7',
        type: 'multiple_choice',
        instructionAr: 'ما هو الرقم الذي تعنيه كلمة "Thirty"؟',
        instructionEn: 'What is the number "Thirty" in digits?',
        question: '"Thirty" represents the number:',
        options: ['30', '13', '3', '300'],
        correctAnswer: 0,
        explanationAr: 'كلمة Thirty تعني 30، بينما 13 هي Thirteen.'
      },
      {
        id: 'a0-3-ex-8',
        type: 'arabic_to_english',
        instructionAr: 'ترجم العبارة: "شاي أخضر":',
        instructionEn: 'Translate: "شاي أخضر":',
        question: 'Translate: "شاي أخضر"',
        correctAnswer: ['Green tea', 'green tea'],
        explanationAr: 'نضع اللون أولاً: Green tea (وليس Tea green).'
      }
    ]
  },
  {
    id: 'lesson-a0-4-level-review-and-assessment',
    level: 'A0',
    order: 4,
    chapterOrder: 3,
    chapterTitleAr: 'الوحدة 3: مراجعة واختبار المستوى A0',
    chapterTitleEn: 'Chapter 3: Level A0 Comprehensive Assessment & Revision',
    titleAr: 'الدرس 4: المراجعة الشاملة واختبار إتقان المستوى A0',
    titleEn: 'Lesson 4: Level A0 Comprehensive Mastery Assessment',
    category: 'المراجعة والاختبار (A0)',
    iconName: 'Award',
    estimatedMinutes: 20,
    objectivesAr: [
      'مراجعة شاملة لجميع مخرجات المستوى A0 (الحروف، الأصوات، الأرقام، والتحيات).',
      'التأكد التام من القضاء على أخطاء النطق الشائعة (P مقابل B، و V مقابل F).',
      'تطبيق قواعد ترتيب الصفات والألوان قبل الأسماء بثبات.',
      'اجتياز أسئلة الاختبار التراكمي بنسبة نجاح تفوق 80%.',
      'الاستعداد التام للانتقال للمستوى A1.',
    ],
    explanationMarkdownAr: `### المراجعة الشاملة للمستوى A0 وتأكيد الجاهزية

#### ملخص ما تعلمته في هذا المستوى:
1. **الأبجدية ومخارج الحروف**:
   - الفارق بين اسم الحرف وصوته في الكلمة.
   - الحروف المتحركة الخمسة (A, E, I, O, U).
   - الفارق الحاسم بين P و B، وبين V و F، وصوتا TH.
2. **قواعد القراءة والصوتيات**:
   - حرف E السحري (Magic E): *Hat -> Hate*.
   - الحروف المركبة: *SH, CH, PH, -TION*.
3. **المفردات اليومية الأساسية**:
   - التحيات حسب فترات اليوم والفرق الحاسم بين Good evening و Good night.
   - الأرقام حتى 100 والفرق الصوتي بين مقاطع -teen و -ty.
   - أيام الأسبوع السبعة مع حرف الجر on.

> **تعليمات الاختبار الشامل**:
> - أجب عن الأسئلة العشرة التالية لتقييم فهمك التراكمي لمستوى A0.
> - راجع تفسير كل إجابة لتثبيت المعلومة.
> - بعد الانتهاء، ستفتح لك أبواب المستوى **A1** للانطلاق نحو بناء الجمل الكاملة!`,
    rulesAndStructuresAr: `خلاصة قواعد A0: الصفة قبل الموصوف: Blue car. أيام الأسبوع تأخذ on. التحية المسائية عند اللقاء Good evening والوداع والنوم Good night. صوت P هوائي مجهود وصوت B حبيس.`,
    summaryAr: 'أنت الآن تتقن أساسيات نطق وقراءة الإنجليزية وأهم عبارات التعارف والأرقام، وجاهز للانطلاق إلى مستوى A1.',
    arabicContrastPoint: {
      titleAr: 'التحول من التفكير بالعربية إلى الإنجليزية',
      descriptionAr: 'لقد تخلصت في هذا المستوى من أبرز الأفخاخ الصوتية والنحوية للترجمة الحرفية من العربية.',
      badArabicHabit: 'Speaking with Arabic letter transfers and word orders.',
      correctEnglishWay: 'Speaking with native English sounds and structures.',
    },
    examples: [
      { en: 'Good morning, please sit on this chair.', ar: 'صباح الخير، من فضلك اجلس على هذا الكرسي.', phoneticAr: 'جُود مُورْنِينْج، بْلِيز سِت أُون ذِس تْشِير' },
      { en: 'I have three blue pens in my bag.', ar: 'لدي ثلاثة أقلام زرقاء في حقيبتي.', phoneticAr: 'آيْ هَاف ثْرِي بلُو پِينْز إِن مَاي بَاج' },
      { en: 'We meet at the station on Monday.', ar: 'نلتقي عند المحطة يوم الاثنين.', phoneticAr: 'وِي مِيت أَت ذَا سْتَيْشَن أُون مَانْدَاي' },
    ],
    vocabulary: [
      { word: 'Ready', ipa: '/ˈred.i/', partOfSpeech: 'adjective', meaningAr: 'جاهز ومستعد', exampleEn: 'Are you ready for Level A1?', exampleAr: 'هل أنت مستعد للمستوى A1؟' },
      { word: 'Pass', ipa: '/pæs/', partOfSpeech: 'verb', meaningAr: 'يجتاز / ينجح', exampleEn: 'You can pass this test.', exampleAr: 'يمكنك اجتياز هذا الاختبار.' },
      { word: 'Level', ipa: '/ˈlev.əl/', partOfSpeech: 'noun', meaningAr: 'مستوى تعليمي', exampleEn: 'Welcome to the next level.', exampleAr: 'أهلاً بك في المستوى التالي.' },
    ],
    commonMistakes: [
      { wrong: 'I have car red on Friday.', correct: 'I have a red car on Friday.', reasonAr: 'الترتيب الصحيح هو a red car مع أداة التنكير والصفة قبل الاسم.' },
      { wrong: 'Nice to meet you in Sunday.', correct: 'Nice to meet you on Sunday.', reasonAr: 'أيام الأسبوع تأخذ on دائماً.' },
    ],
    realWorldChallengeAr: 'سجل لنفسك مقطعاً صوتياً مدته 30 ثانية تعرف فيه بنفسك وتقول يومك المفضل ورقمك المفضل بالإنجليزية.',
    exercises: [
      {
        id: 'a0-4-ex-1',
        type: 'multiple_choice',
        instructionAr: 'اختر الجملة الإنجليزية الخالية تماماً من الأخطاء:',
        instructionEn: 'Choose the completely correct English sentence:',
        question: 'Which sentence is completely correct?',
        options: [
          'Please open your blue book on Monday.',
          'Please open your book blue in Monday.',
          'Please open your blue book in Monday.',
          'Please open your book blue on Monday.'
        ],
        correctAnswer: 0,
        explanationAr: 'الجملة الصحيحة تجمع بين تقديم اللون blue على الاسم book واستخدام on مع Monday.'
      },
      {
        id: 'a0-4-ex-2',
        type: 'multiple_choice',
        instructionAr: 'أي كلمة تعني الرقم 14 بالإنجليزية؟',
        instructionEn: 'Which word means the number 14?',
        question: 'The number 14 in English is written as:',
        options: ['Fourteen', 'Forty', 'Four', 'Fourth'],
        correctAnswer: 0,
        explanationAr: 'الرقم 14 هو Fourteen، بينما Forty هو 40.'
      },
      {
        id: 'a0-4-ex-3',
        type: 'fill_blank',
        instructionAr: 'أكمل عبارة التعارف: "Nice to ______ you."',
        instructionEn: 'Fill in the missing greeting word:',
        question: 'Nice to ______ you.',
        correctAnswer: ['meet', 'Meet'],
        explanationAr: 'العبارة الصحيحة: Nice to meet you (سعدت بلقائك).'
      },
      {
        id: 'a0-4-ex-4',
        type: 'sentence_scramble',
        instructionAr: 'رتب الكلمات لتكوين تحية وتعريف صحيح بالاسم:',
        instructionEn: 'Put the words in order to make a proper greeting:',
        question: 'name / is / My / Fares / morning / Good',
        correctAnswer: 'Good morning My name is Fares',
        explanationAr: 'الترتيب: Good morning ثم My name is Fares.'
      },
      {
        id: 'a0-4-ex-5',
        type: 'multiple_choice',
        instructionAr: 'أي كلمة مما يلي ينطبق عليها قانون حرف E السحري (Magic E)؟',
        instructionEn: 'Which of the following words uses the Magic E rule?',
        question: 'Which word has a long vowel caused by a silent E?',
        options: ['Hope', 'Hop', 'Hat', 'Hot'],
        correctAnswer: 0,
        explanationAr: 'كلمة Hope تجعل حرف O ممتداً بفضل حرف E السحري الصامت في النهاية.'
      },
      {
        id: 'a0-4-ex-6',
        type: 'error_hunt',
        instructionAr: 'صحح الكلمة الخاطئة للحديقة العامة (اكتب الكلمة المصححة فقط):',
        instructionEn: 'Correct the misspelled word for "park":',
        question: 'Let us walk in the bark today.',
        correctAnswer: ['park', 'Park'],
        explanationAr: 'الحديقة تكتب Park بحرف P وليس bark.'
      },
      {
        id: 'a0-4-ex-7',
        type: 'multiple_choice',
        instructionAr: 'كيف ينطق مقطع -tion في كلمة "Action"؟',
        instructionEn: 'How is the suffix -tion pronounced in "Action"?',
        question: 'The pronunciation of -tion is:',
        options: ['شن (/ʃən/)', 'تيون', 'سيون', 'تون'],
        correctAnswer: 0,
        explanationAr: 'المقطع -tion ينطق دائماً شن.'
      },
      {
        id: 'a0-4-ex-8',
        type: 'arabic_to_english',
        instructionAr: 'ترجم العبارة: "تفاحة حمراء":',
        instructionEn: 'Translate into English: "تفاحة حمراء":',
        question: 'Translate: "تفاحة حمراء"',
        correctAnswer: ['A red apple', 'a red apple', 'Red apple', 'red apple'],
        explanationAr: 'الترجمة الصحيحة هي: A red apple.'
      },
      {
        id: 'a0-4-ex-9',
        type: 'multiple_choice',
        instructionAr: 'أي يوم يأتي مباشرة بعد يوم الخميس (Thursday)؟',
        instructionEn: 'Which day comes immediately after Thursday?',
        question: 'What day comes after Thursday?',
        options: ['Friday', 'Wednesday', 'Saturday', 'Tuesday'],
        correctAnswer: 0,
        explanationAr: 'اليوم الذي يلي الخميس هو الجمعة (Friday).'
      },
      {
        id: 'a0-4-ex-10',
        type: 'multiple_choice',
        instructionAr: 'تقابل مديرك في الساعة 8 مساءً، ما التحية السليمة؟',
        instructionEn: 'You meet your manager at 8:00 PM, what is the right greeting?',
        question: 'Meeting someone at 8:00 PM, you greet them with:',
        options: ['Good evening', 'Good night', 'Good morning', 'See you later'],
        correctAnswer: 0,
        explanationAr: 'التحية المسائية عند اللقاء هي Good evening، أما Good night فللوداع والنوم فقط.'
      }
    ]
  }
];
