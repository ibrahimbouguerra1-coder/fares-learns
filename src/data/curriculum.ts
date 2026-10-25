/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { Lesson } from '../types/learning.ts';
import { A0_LESSONS } from './curriculum/a0.ts';

const OTHER_LEVEL_LESSONS: Lesson[] = [
  // A1 Lessons
  {
    id: 'lesson-a1-1-verb-to-be-and-pronouns',
    level: 'A1',
    order: 0,
    chapterOrder: 1,
    chapterTitleAr: 'الوحدة 1: اللبنات الأولى للجملة الإنجليزية',
    chapterTitleEn: 'Unit 1: Foundations of the English Sentence',
    titleAr: 'الدرس 1: فعل الكينونة To Be والضمائر الفاعلة',
    titleEn: 'Lesson 1: Subject Pronouns and the Verb To Be',
    category: 'قواعد وتراكيب (A1)',
    iconName: 'BookOpen',
    estimatedMinutes: 12,
    objectivesAr: [
      'الاستخدام الدقيق لضمائر الفاعل (I, You, He, She, It, We, They).',
      'تصريف فعل To Be في الإثبات والنفي والسؤال (am / is / are).',
      'تجنب إسقاط فعل الكينونة (الخطأ العربي الشائع: He teacher -> He is a teacher).',
    ],
    explanationMarkdownAr: `### فعل الكينونة To Be: عمود الجملة الإنجليزية

في اللغة العربية الجملة الاسمية لا تحتاج إلى رابط (هو معلم، أنا سعيد). أما في الإنجليزية، فكل جملة اسمية لا بد لها من فعل كينونة:

1. **I am** (أنا أكون) -> *I am ready.*
2. **He / She / It is** (هو / هي يكون) -> *She is an engineer.*
3. **We / You / They are** (نحن / أنتم / هم يكونون) -> *They are friendly.*

#### صيغة النفي:
فقط أضف **not** بعد فعل الكينونة:
- I am not tired.
- He is not at home.

#### صيغة السؤال (Yes/No Questions):
اقلب الترتيب بين الفاعل وفعل الكينونة:
- **Are you** ready?
- **Is he** a doctor?`,
    rulesAndStructuresAr: 'I + am, He/She/It + is, We/You/They + are. لا جملة إنجليزية بدون فعل صريح!',
    summaryAr: 'كل جملة إنجليزية تحتاج فعلاً صريحاً. فعل To Be يربط الفاعل بصفته أو مهنته.',
    arabicContrastPoint: {
      titleAr: 'إسقاط فعل الكينونة To Be',
      descriptionAr: 'يميل المتحدث العربي لترجمة "هو طبيب" حرفياً إلى "He doctor" دون فعل.',
      badArabicHabit: 'He doctor in London.',
      correctEnglishWay: 'He is a doctor in London.',
    },
    examples: [
      { en: 'I am a student.', ar: 'أنا طالب.', phoneticAr: 'آي آم أَه سْتْيُودِنْت' },
      { en: 'They are very helpful.', ar: 'هم متعاونون ولطفاء جداً.', phoneticAr: 'ذَاي آر ڤِيرِي هِلْبْفُل' },
      { en: 'She is not afraid.', ar: 'هي ليست خائفة.', phoneticAr: 'شِي إِز نُوت أَفْرَيْد' },
    ],
    vocabulary: [
      { word: 'Student', ipa: '/ˈstuː.dənt/', partOfSpeech: 'noun', meaningAr: 'طالب / متعلم', exampleEn: 'I am an English student.', exampleAr: 'أنا طالب لغة إنجليزية.' },
      { word: 'Teacher', ipa: '/ˈtiː.tʃɚ/', partOfSpeech: 'noun', meaningAr: 'معلم / أستاذ', exampleEn: 'Our teacher is very patient.', exampleAr: 'معلمنا صبور للغاية.' },
      { word: 'Ready', ipa: '/ˈred.i/', partOfSpeech: 'adjective', meaningAr: 'جاهز ومستعد', exampleEn: 'Are you ready to practice?', exampleAr: 'هل أنت جاهز للتدرب؟' },
    ],
    commonMistakes: [
      { wrong: 'I student.', correct: 'I am a student.', reasonAr: 'لا بد من فعل الكينونة am وأداة النكرة a.' },
      { wrong: 'They is friends.', correct: 'They are friends.', reasonAr: 'ضمير الجمع They يأخذ are وليس is.' },
    ],
    realWorldChallengeAr: 'عرّف عن مهنتك وثلاث صفات لشخصيتك بالإنجليزية باستخدام I am ...',
    exercises: [
      {
        id: 'a1-1-ex-1',
        type: 'multiple_choice',
        instructionAr: 'اختر فعل الكينونة المناسب للضمير We:',
        instructionEn: 'Choose the correct form of "to be" for "We":',
        question: 'We ______ excited to start learning today.',
        options: ['are', 'is', 'am', 'be'],
        correctAnswer: 0,
        explanationAr: 'ضمير الجمع We يأخذ فعل الكينونة are.',
      },
      {
        id: 'a1-1-ex-2',
        type: 'fill_blank',
        instructionAr: 'أكمل الجملة بفعل الكينونة الصحيح:',
        instructionEn: 'Complete the sentence with the correct verb:',
        question: 'She ______ (تكون) a talented doctor.',
        correctAnswer: ['is', 'Is'],
        explanationAr: 'ضمير المفرد المؤنث الغائب She يأخذ is.',
      },
      {
        id: 'a1-1-ex-3',
        type: 'sentence_scramble',
        instructionAr: 'رتّب الكلمات لتكوين جملة صحيحة:',
        instructionEn: 'Unscramble the sentence:',
        question: 'am / not / I / tired',
        correctAnswer: 'I am not tired',
        explanationAr: 'ترتيب الجملة المنفية: الفاعل I ثم am ثم not ثم الصفة tired.',
      },
    ],
  },
  {
    id: 'lesson-a1-2-present-simple-routines',
    level: 'A1',
    order: 1,
    chapterOrder: 1,
    chapterTitleAr: 'الوحدة 1: اللبنات الأولى للجملة الإنجليزية',
    chapterTitleEn: 'Unit 1: Foundations of the English Sentence',
    titleAr: 'الدرس 2: المضارع البسيط والروتين اليومي',
    titleEn: 'Lesson 2: Present Simple and Daily Routines',
    category: 'قواعد ومحادثة (A1)',
    iconName: 'Sparkles',
    estimatedMinutes: 14,
    objectivesAr: [
      'التعبير عن العادات والحقائق الثابتة بالمضارع البسيط.',
      'إتقان قاعدة إضافة (s / es) مع ضمائر المفرد الغائب He / She / It.',
      'صياغة النفي والسؤال باستخدام Do و Does.',
    ],
    explanationMarkdownAr: `### المضارع البسيط: حديث الروتين والحقائق

نستخدم المضارع البسيط للتعبير عن حقائق عامة أو عادات يومية متكررة:

#### 1. القاعدة العامة:
- **I / You / We / They + الفعل في المصدر**:
  - *I drink coffee.*
  - *They work in Riyadh.*

#### 2. قاعدة المفرد الغائب (He / She / It):
نضيف **s** أو **es** إلى الفعل:
- *He drinks water.*
- *She watches TV.* (مع الأفعال المنتهية بـ ch, sh, ss, x, o نضيف es).

#### 3. النفي والسؤال:
- النفي: **don't** مع الجمع، و **doesn't** مع المفرد الغائب (ويعود الفعل لمصدره!).
  - *He doesn't eat meat.*`,
    rulesAndStructuresAr: 'He/She/It + Verb-s. في النفي: He doesn\'t + Verb (مصدر بدون s).',
    summaryAr: 'المضارع البسيط هو لغة الروتين اليومي. تذكر إضافة s المفرد الغائب مع He و She و It.',
    arabicContrastPoint: {
      titleAr: 'نسيان s المفرد الغائب',
      descriptionAr: 'يغفل الكثيرون عن إضافة s للفعل مع He و She مثل قول He play بدلاً من He plays.',
      badArabicHabit: 'My brother work in a bank.',
      correctEnglishWay: 'My brother works in a bank.',
    },
    examples: [
      { en: 'I live in Cairo.', ar: 'أنا أعيش في القاهرة.', phoneticAr: 'آي لِيڤ إِن كَايْرُو' },
      { en: 'He speaks three languages.', ar: 'هو يتحدث ثلاث لغات.', phoneticAr: 'هِي سْبِيكْس ثْرِي لَانْغْوِيجِز' },
      { en: 'Do you work on weekends?', ar: 'هل تعمل في عطلة نهاية الأسبوع؟', phoneticAr: 'دُو يُو وِيرْك أُون وِيكْإِنْدْز؟' },
    ],
    vocabulary: [
      { word: 'Routine', ipa: '/ruːˈtiːn/', partOfSpeech: 'noun', meaningAr: 'روتين يومي', exampleEn: 'My morning routine starts early.', exampleAr: 'روتيني الصباحي يبدأ مبكراً.' },
      { word: 'Wake up', ipa: '/weɪk ʌp/', partOfSpeech: 'phrasal verb', meaningAr: 'يستيقظ من النوم', exampleEn: 'I wake up at six every day.', exampleAr: 'أستيقظ في السادسة كل يوم.' },
    ],
    commonMistakes: [
      { wrong: 'He don\'t know.', correct: 'He doesn\'t know.', reasonAr: 'مع He نستخدم doesn\'t وليس don\'t.' },
      { wrong: 'She works doesn\'t.', correct: 'She doesn\'t work.', reasonAr: 'الفعل المساعد للنفي يسبق الفعل الأساسي.' },
    ],
    realWorldChallengeAr: 'اكتب ثلاث عادات تفعلها كل صباح بالإنجليزية.',
    exercises: [
      {
        id: 'a1-2-ex-1',
        type: 'multiple_choice',
        instructionAr: 'اختر التصريف الصحيح للفعل:',
        instructionEn: 'Choose the correct form of the verb:',
        question: 'Ahmed ______ his car every Sunday.',
        options: ['wash', 'washes', 'washing', 'is wash'],
        correctAnswer: 1,
        explanationAr: 'الفاعل مفرد غائب (Ahmed = He) والفعل ينتهي بـ sh فيأخذ washes.',
      },
      {
        id: 'a1-2-ex-2',
        type: 'sentence_scramble',
        instructionAr: 'رتّب الكلمات لتكوين سؤال صحيح:',
        instructionEn: 'Unscramble the question:',
        question: 'Do / you / coffee / drink / ?',
        correctAnswer: 'Do you drink coffee ?',
        explanationAr: 'ترتيب السؤال: أداة السؤال Do ثم الفاعل you ثم الفعل drink ثم المفعول coffee.',
      },
    ],
  },

  // A2 Lessons
  {
    id: 'lesson-a2-1-past-simple-and-time',
    level: 'A2',
    order: 0,
    chapterOrder: 1,
    chapterTitleAr: 'الوحدة 1: السرد وقصص الماضي',
    chapterTitleEn: 'Unit 1: Past Narratives and Storytelling',
    titleAr: 'الدرس 1: الماضي البسيط والأفعال الشاذة الشائعة',
    titleEn: 'Lesson 1: Past Simple and Irregular Verbs',
    category: 'قواعد وسرد (A2)',
    iconName: 'BookOpen',
    estimatedMinutes: 15,
    objectivesAr: [
      'التعبير عن أحداث بدأت وانتهت في الماضي.',
      'التمييز بين الأفعال المنتظمة (+ed) والأفعال الشاذة (Irregular Verbs).',
      'استخدام Did في السؤال و Didn\'t في النفي.',
    ],
    explanationMarkdownAr: `### الماضي البسيط: لغة السرد والحكايات

الماضي البسيط يصف حدثاً بدأ واكتمل تماماً في نقطة زمنية محددة في الماضي:

#### 1. الأفعال المنتظمة (Regular Verbs):
تأخذ **ed**:
- work -> worked
- play -> played
- live -> lived

#### 2. الأفعال الشاذة الشهيرة (Irregular Verbs):
تتغير صيغتها تماماً ويجب حفظها بالممارسة:
- go -> **went**
- see -> **saw**
- buy -> **bought**
- eat -> **ate**
- have -> **had**

#### 3. النفي والسؤال:
نستخدم **did** أو **didn't** ويعود الفعل لمصدره المجرد:
- *I didn't **go** to the market yesterday.* (وليس didn't went!).`,
    rulesAndStructuresAr: 'Subject + Past Verb (V2). في النفي: didn\'t + Verb1 (مصدر مجرد).',
    summaryAr: 'الماضي البسيط للحدث المنتهي. عند استخدام didn\'t أو did يرجع الفعل لمصدره الأصلي.',
    arabicContrastPoint: {
      titleAr: 'ازدواج صيغة الماضي مع didn\'t',
      descriptionAr: 'خطأ شائع هو وضع الفعل في الماضي بعد didn\'t مثل قول I didn\'t saw.',
      badArabicHabit: 'I didn\'t saw him yesterday.',
      correctEnglishWay: 'I didn\'t see him yesterday.',
    },
    examples: [
      { en: 'We visited Dubai last month.', ar: 'زرنا دبي الشهر الماضي.', phoneticAr: 'وِي ڤِيزِيتِد دُوبَاي لَاسْت مَانْث' },
      { en: 'I bought a new phone.', ar: 'اشتريت هاتفاً جديداً.', phoneticAr: 'آي بُوت أَه نْيُو فُون' },
    ],
    vocabulary: [
      { word: 'Yesterday', ipa: '/ˈjes.tɚ.deɪ/', partOfSpeech: 'adverb', meaningAr: 'بالأمس', exampleEn: 'I met him yesterday.', exampleAr: 'قابلته بالأمس.' },
      { word: 'Travel', ipa: '/ˈtræv.əl/', partOfSpeech: 'verb', meaningAr: 'يسافر', exampleEn: 'We traveled by train.', exampleAr: 'سافرنا بالقطار.' },
    ],
    commonMistakes: [
      { wrong: 'I didn\'t went.', correct: 'I didn\'t go.', reasonAr: 'بعد didn\'t يعود الفعل إلى صيغة المصدر go.' },
    ],
    realWorldChallengeAr: 'تحدث عن شيء ممتع قمت به في عطلة نهاية الأسبوع الماضية بثلاث جمل.',
    exercises: [
      {
        id: 'a2-1-ex-1',
        type: 'multiple_choice',
        instructionAr: 'اختر تصريف الفعل الماضي الصحيح من buy:',
        instructionEn: 'Choose the past form of buy:',
        question: 'She ______ a gift for her mother.',
        options: ['bought', 'buyed', 'buys', 'buying'],
        correctAnswer: 0,
        explanationAr: 'الفعل buy فعل شاذ ماضيه bought.',
      },
    ],
  },

  // B1 Lessons
  {
    id: 'lesson-b1-1-present-perfect-experience',
    level: 'B1',
    order: 0,
    chapterOrder: 1,
    chapterTitleAr: 'الوحدة 1: تجارب الحياة والزمن الممتد',
    chapterTitleEn: 'Unit 1: Life Experiences and Present Perfect',
    titleAr: 'الدرس 1: المضارع التام (Present Perfect) والخبرات',
    titleEn: 'Lesson 1: Present Perfect and Life Experiences',
    category: 'قواعد متقدمة (B1)',
    iconName: 'Award',
    estimatedMinutes: 16,
    objectivesAr: [
      'فهم الفارق الجوهري بين المضارع التام والماضي البسيط.',
      'استخدام have / has + التصريف الثالث (P.P).',
      'إتقان الكلمات المفتاحية: ever, never, already, yet, since, for.',
    ],
    explanationMarkdownAr: `### المضارع التام: الجسر بين الماضي والحاضر

نستخدم المضارع التام عندما يهمنا أثر الفعل أو خبرة الحياة، دون تحديد وقت حدوثه بدقة:

#### 1. الصياغة:
**Have / Has + Past Participle (التصريف الثالث للفعل)**:
- *I **have visited** London twice.* (خبرة في حياتي دون تحديد موعد).
- *She **has finished** her work.* (انتهت للتو وأثر العمل حاضر).

#### 2. الفارق مع الماضي البسيط:
- إذا ذكرت وقتاً محدداً (yesterday, in 2020) -> استخدم **الماضي البسيط**.
- إذا كنت تتحدث عن تجربة عامة في الحياة -> استخدم **المضارع التام**.

#### 3. الكلمات المميزة:
- **Ever**: في الأسئلة (*Have you ever visited Japan?*)
- **Never**: للنفي القاطع (*I have never tasted caviar.*)
- **Since**: نقطة البداية (*since 2018*)
- **For**: المدة الزمنية (*for five years*)`,
    rulesAndStructuresAr: 'Have/Has + Verb3 (Past Participle). Since + بداية الزمن، For + المدة الإجمالية.',
    summaryAr: 'المضارع التام يربط الماضي بالحاضر. استخدمه عند الحديث عن إنجازات وتجارب حياتك العامة.',
    arabicContrastPoint: {
      titleAr: 'تحديد الوقت مع المضارع التام',
      descriptionAr: 'لا تستخدم المضارع التام مع ظروف زمن الماضي المحدد كـ yesterday أو last year.',
      badArabicHabit: 'I have seen him yesterday.',
      correctEnglishWay: 'I saw him yesterday. (أو: I have seen him recently).',
    },
    examples: [
      { en: 'Have you ever tried sushi?', ar: 'هل جربت السوشي من قبل في حياتك؟', phoneticAr: 'هَاڤ يُو إِڤَر تْرَايْد سُوشِي؟' },
      { en: 'I have lived here for ten years.', ar: 'أعيش هنا منذ عشر سنوات.', phoneticAr: 'آي هَاڤ لِيڤْد هِير فُور تِين يِيرْز' },
    ],
    vocabulary: [
      { word: 'Experience', ipa: '/ɪkˈspɪr.i.əns/', partOfSpeech: 'noun', meaningAr: 'خبرة أو تجربة', exampleEn: 'Traveling is an enriching experience.', exampleAr: 'السفر تجربة مثرية.' },
      { word: 'Achievement', ipa: '/əˈtʃiːv.mənt/', partOfSpeech: 'noun', meaningAr: 'إنجاز باهر', exampleEn: 'Graduating was a proud achievement.', exampleAr: 'كان التخرج إنجازاً يدعو للفخر.' },
    ],
    commonMistakes: [
      { wrong: 'I have visited him last week.', correct: 'I visited him last week.', reasonAr: 'وجود last week يفرض الماضي البسيط.' },
    ],
    realWorldChallengeAr: 'شارك إنجازاً أو تجربة فريدة قمت بها في حياتك مستخدماً I have ...',
    exercises: [
      {
        id: 'b1-1-ex-1',
        type: 'multiple_choice',
        instructionAr: 'اختر التركيب الصحيح للمضارع التام:',
        instructionEn: 'Choose the correct sentence:',
        question: 'She ______ in this international company since 2021.',
        options: ['has worked', 'worked', 'is working', 'have worked'],
        correctAnswer: 0,
        explanationAr: 'مع She ونقطة بداية since 2021 نستخدم has worked.',
      },
    ],
  },

  // B2 Lessons
  {
    id: 'lesson-b2-1-passive-voice-and-formality',
    level: 'B2',
    order: 0,
    chapterOrder: 1,
    chapterTitleAr: 'الوحدة 1: الأسلوب المؤسسي والمبني للمجهول',
    chapterTitleEn: 'Unit 1: Institutional Discourse & Passive Voice',
    titleAr: 'الدرس 1: المبني للمجهول في السياق المهني والرسمي',
    titleEn: 'Lesson 1: Passive Voice in Professional Contexts',
    category: 'قواعد احترافية (B2)',
    iconName: 'Award',
    estimatedMinutes: 18,
    objectivesAr: [
      'استخدام المبني للمجهول للتركيز على الفعل والنتيجة بدلاً من الفاعل.',
      'صياغة المبني للمجهول عبر الأزمنة المختلفة (To Be + V3).',
      'تطبيق الأسلوب الإخباري والتقارير المهنية.',
    ],
    explanationMarkdownAr: `### المبني للمجهول (Passive Voice)

في التقارير الرسمية وإيميلات العمل، نفضل استخدام المبني للمجهول للتركيز على العمل المُنجز أو لتجنب لوم شخص معين:

#### القاعدة الجوهرية:
**Object + Verb To Be (في نفس زمن الجملة) + Past Participle (التصريف الثالث)**

1. **المضارع البسيط**:
   - Active: *We update the software weekly.*
   - Passive: *The software **is updated** weekly.*

2. **الماضي البسيط**:
   - Active: *They launched the platform yesterday.*
   - Passive: *The platform **was launched** yesterday.*

3. **المستقبل**:
   - Active: *The board will review the proposal.*
   - Passive: *The proposal **will be reviewed** by the board.*`,
    rulesAndStructuresAr: 'Subject + Be (المناسب للزمن) + Past Participle (V3).',
    summaryAr: 'المبني للمجهول يعطي كتابتك طابعاً موضوعياً واحترافياً رفيعاً.',
    arabicContrastPoint: {
      titleAr: 'الإفراط في المبني للمعلوم في التقارير',
      descriptionAr: 'في التقارير الإنجليزية، يفضل المبني للمجهول لتفادي الشخصنة والتركيز على النتائج.',
      badArabicHabit: 'I made a mistake in the invoice.',
      correctEnglishWay: 'An error was identified in the invoice.',
    },
    examples: [
      { en: 'The contract was signed this morning.', ar: 'تم توقيع العقد صباح اليوم.', phoneticAr: 'ذَا كُونْتْرَاكْت وَاز سَايْنْد ذِس مُورْنِنْغ' },
    ],
    vocabulary: [
      { word: 'Implement', ipa: '/ˈɪm.plə.ment/', partOfSpeech: 'verb', meaningAr: 'يطبق / ينفذ مشروعاً', exampleEn: 'The new policy was implemented.', exampleAr: 'تم تطبيق السياسة الجديدة.' },
    ],
    commonMistakes: [
      { wrong: 'The car was repair.', correct: 'The car was repaired.', reasonAr: 'المبني للمجهول يتطلب دائماً التصريف الثالث V3.' },
    ],
    realWorldChallengeAr: 'حوّل جملة عمل من صيغة الفاعل إلى صيغة المبني للمجهول الرسمية.',
    exercises: [
      {
        id: 'b2-1-ex-1',
        type: 'multiple_choice',
        instructionAr: 'اختر الصياغة المبنية للمجهول الصحيحة:',
        instructionEn: 'Choose the correct passive voice sentence:',
        question: 'All safety guidelines must ______ by everyone.',
        options: ['be followed', 'follow', 'are followed', 'following'],
        correctAnswer: 0,
        explanationAr: 'بعد الأفعال الناقصة (must) يأتي be + Past Participle: must be followed.',
      },
    ],
  },

  // C1 Lessons
  {
    id: 'lesson-c1-1-inversion-and-rhetoric',
    level: 'C1',
    order: 0,
    chapterOrder: 1,
    chapterTitleAr: 'الوحدة 1: البلاغة والقلب النحوي المتقدم',
    chapterTitleEn: 'Unit 1: Advanced Rhetoric & Inversion',
    titleAr: 'الدرس 1: القلب النحوي البلاغي (Negative Inversion)',
    titleEn: 'Lesson 1: Rhetorical Inversion for Emphasis',
    category: 'بلاغة وطلاقة عليا (C1)',
    iconName: 'Sparkles',
    estimatedMinutes: 20,
    objectivesAr: [
      'استخدام القلب النحوي بعد ظروف النفي المشددة (Rarely, Seldom, Never, Not only).',
      'إكساب الحديث والكتابة وزناً أدبياً وبلاغياً مشابهاً لنثر النخبة.',
      'ترتيب الجملة بصيغة السؤال التوكيدي دون أن تكون سؤالاً.',
    ],
    explanationMarkdownAr: `### القلب النحوي البلاغي (Inversion)

عندما تبدأ جملتك بظرف نفي مشدد لإحداث أثر خطابي درامي، فإنك "تقلب" ترتيب الفاعل والفعل المساعد كما في صيغة السؤال:

#### النمط الكلاسيكي:
- عادي: *We rarely see such commitment.*
- **بلاغي مقلوب**: ***Rarely do we see** such commitment.*

#### أشهر التراكيب:
1. **Never / Rarely / Seldom**:
   - *Seldom **have I encountered** such brilliant analytical insight.*
2. **Not only ... but also**:
   - *Not only **did they exceed** their quarterly projections, but they also pioneered an entire market segment.*
3. **Under no circumstances**:
   - *Under no circumstances **should sensitive passwords be shared**.*`,
    rulesAndStructuresAr: 'Negative Adverbial + Auxiliary Verb + Subject + Main Verb.',
    summaryAr: 'القلب النحوي يمنح كتابتك الخطابية هيبة وفصاحة استثنائية.',
    arabicContrastPoint: {
      titleAr: 'نسيان تقديم الفعل المساعد في القلب البلاغي',
      descriptionAr: 'لا يجوز البدء بظرف نفي مشدد مع الإبقاء على الترتيب العادي للجملة.',
      badArabicHabit: 'Rarely we have seen this.',
      correctEnglishWay: 'Rarely have we seen this.',
    },
    examples: [
      { en: 'Never in my life have I witnessed such elegance.', ar: 'لم أشهد في حياتي قط مثل هذه الأناقة والروعة.', phoneticAr: 'نِڤَر إِن ماي لايْف هَاڤ آي وِيتْنِسْد سَاتش إِلِيغَانْس' },
    ],
    vocabulary: [
      { word: 'Unprecedented', ipa: '/ʌnˈpres.ə.den.t̬ɪd/', partOfSpeech: 'adjective', meaningAr: 'غير مسبوق تاريخياً', exampleEn: 'The team achieved unprecedented milestones.', exampleAr: 'حقق الفريق إنجازات تاريخية غير مسبوقة.' },
    ],
    commonMistakes: [
      { wrong: 'Rarely I have seen.', correct: 'Rarely have I seen.', reasonAr: 'القلب النحوي يقتضي تقديم الفعل المساعد have قبل الفاعل I.' },
    ],
    realWorldChallengeAr: 'صغ جملة مديح رسمية لزميلك تبدأ بـ Rarely have I seen ...',
    exercises: [
      {
        id: 'c1-1-ex-1',
        type: 'multiple_choice',
        instructionAr: 'اختر الجملة البلاغية التي تتبع قواعد القلب النحوي بدقة:',
        instructionEn: 'Choose the correct inversion sentence:',
        question: 'Under no circumstances ______ the restricted server room without authorization.',
        options: [
          'should visitors enter',
          'visitors should enter',
          'visitors enter',
          'do visitors entered',
        ],
        correctAnswer: 0,
        explanationAr: 'بعد Under no circumstances يتقدم الفعل المساعد should على الفاعل visitors.',
      },
    ],
  },

  // C2 Lessons
  {
    id: 'lesson-c2-1-nuance-and-parallelism',
    level: 'C2',
    order: 0,
    chapterOrder: 1,
    chapterTitleAr: 'الوحدة 1: أسرار البيان النثري الأسمى',
    chapterTitleEn: 'Unit 1: Grandmaster Prose & Rhetorical Nuance',
    titleAr: 'الدرس 1: التوازي البلاغي وأسلوب نفي النقيض (Litotes)',
    titleEn: 'Lesson 1: Syntactic Parallelism & Understatement',
    category: 'نثر النخبة (C2)',
    iconName: 'Award',
    estimatedMinutes: 22,
    objectivesAr: [
      'بناء تراكيب متوازنة إيقاعياً (Syntactic Parallelism) تأسر القارئ والمستمع.',
      'توظيف أسلوب نفي النقيض (Litotes) في الخطاب الدبلوماسي الحكيم.',
      'إتقان الفروق الدلالية فائقة الدقة بين المترادفات الأكاديمية.',
    ],
    explanationMarkdownAr: `### ذروة الطلاقة: النثر الإنجليزي الرفيع

في المستوى C2 تنتقل من مجرد نقل المعنى بدقة إلى صناعة الأثر الوجداني والجمالي للغة:

#### 1. أسلوب نفي النقيض (Litotes):
بدلاً من المبالغة الفجة، يعتمد الخطاب الرفيع على تأكيد الفكرة بنفي نقيضها بلباقة استثنائية:
- بدلاً من: *That was a great accomplishment!*
- بأسلوب Litotes: *That was **no small accomplishment**.*
- بدلاً من: *I am happy.*
- بأسلوب Litotes: *I am **not a little pleased** with the outcome.*

#### 2. التوازي البلاغي (Parallelism):
تناسق الأشكال النحوية في العطف يعطي النص رنيناً موسيقياً وقوة إقناع هائلة:
- *We came **to reflect**, **to understand**, and **to reconcile**.*`,
    rulesAndStructuresAr: 'تطابق الصيغ في السرد التناظري؛ وتوظيف No / Not مع النقيض للتأكيد المتزن.',
    summaryAr: 'الطلاقة الأسمى لا تصرخ؛ بل تعبر باقتدار ودقة وعمق نثري متوازن.',
    arabicContrastPoint: {
      titleAr: 'المبالغة السطحية مقابل الاتزان البلاغي',
      descriptionAr: 'في الإنجليزية المتقدمة، التعبير الهادئ بنفي النقيض أكثر بلاغة وتأثيراً من صيغ المبالغة الصاخبة.',
      badArabicHabit: 'This is the most super amazing wonderful thing!',
      correctEnglishWay: 'This is an achievement of no modest significance.',
    },
    examples: [
      { en: 'Securing the unanimous agreement was no mean feat.', ar: 'لم يكن تأمين الاتفاق بالإجماع إنجازاً هيناً على الإطلاق.', phoneticAr: 'سِكْيُورِينْج ذِي يُونَانِيمَس أَغْرِيمَنْت وَاز نُو مِين فِيت' },
    ],
    vocabulary: [
      { word: 'Quintessential', ipa: '/ˌkwɪn.təˈsen.ʃəl/', partOfSpeech: 'adjective', meaningAr: 'النموذج الأمثل والمجسد للجوهر', exampleEn: 'He is the quintessential scholar.', exampleAr: 'إنه النموذج الأمثل للمفكر والباحث الأصيل.' },
    ],
    commonMistakes: [
      { wrong: 'He likes reading, to swim, and cycling.', correct: 'He likes reading, swimming, and cycling.', reasonAr: 'التوازي البلاغي يتطلب توحيد الصيغ النحوية عبر حروف العطف.' },
    ],
    realWorldChallengeAr: 'صغ عبارة تصف نجاح مشروعك بأسلوب Litotes الراقي (باستخدام no small ...)',
    exercises: [
      {
        id: 'c2-1-ex-1',
        type: 'multiple_choice',
        instructionAr: 'اختر الجملة التي تحقق التوازي البلاغي النحوي (Parallelism) التام:',
        instructionEn: 'Identify the syntactically balanced parallel sentence:',
        question: 'The committee aimed ______.',
        options: [
          'to evaluate the risks, to clarify the terms, and to finalize the deal',
          'evaluating risks, to clarify the terms, and finalize the deal',
          'to evaluate risks, clarifying terms, and finalization',
          'for evaluating risks, to clarify, and deal finalizing',
        ],
        correctAnswer: 0,
        explanationAr: 'التوازي البلاغي التام يتطلب تكرار نفس الصيغة النحوية (to + verb) عبر جميع المعطوفات.',
      },
    ],
  },
];

export const CURRICULUM_LESSONS: Lesson[] = [
  ...A0_LESSONS,
  ...OTHER_LEVEL_LESSONS,
];
