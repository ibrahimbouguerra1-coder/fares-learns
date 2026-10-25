/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export function getRandomScenario(topic?: string): string {
  const defaultScenarios = [
    'ordering coffee and breakfast in a busy London café',
    'asking for transit directions at an international airport terminal',
    'introducing yourself to team colleagues on the first day of work',
    'discussing weekend hobbies and family traditions with a friend',
    'handling a customer service request politely and efficiently',
    'planning an exciting summer road trip with friends',
    'describing favorite foods and Arabic cuisine to an international guest',
    'participating in a productive weekly remote meeting on Zoom',
  ];

  if (topic && topic.trim()) {
    return `Practical context: ${topic}`;
  }

  return defaultScenarios[Math.floor(Math.random() * defaultScenarios.length)];
}

export function getDiverseSentenceFallbacks(
  level: string,
  _recentPrompts: string[] = []
): Array<{ ar: string; en: string; tiles: string[]; exp: string; focus: string }> {
  const library: Record<
    string,
    Array<{ ar: string; en: string; tiles: string[]; exp: string; focus: string }>
  > = {
    A0: [
      {
        ar: 'مرحباً، أنا اسمي فارس.',
        en: 'Hello, my name is Fares.',
        tiles: ['Hello,', 'my', 'name', 'is', 'Fares.'],
        exp: 'التعريف بالنفس باستخدام ضمير الملكية my وفعل الكينونة is.',
        focus: 'ضمائر الملكية والتحية',
      },
      {
        ar: 'افتح كتابك من فضلك.',
        en: 'Please open your book.',
        tiles: ['Please', 'open', 'your', 'book.'],
        exp: 'صيغة الأمر المهذب تبدأ بـ Please متبوعة بالفعل بصيغة المصدر.',
        focus: 'أفعال الأمر المهذبة',
      },
      {
        ar: 'هذا قلم أزرق جميل.',
        en: 'This is a nice blue pen.',
        tiles: ['This', 'is', 'a', 'nice', 'blue', 'pen.'],
        exp: 'الصفة تسبق الموصوف دائماً في اللغة الإنجليزية: blue pen.',
        focus: 'ترتيب الصفات وأسماء الإشارة',
      },
    ],
    A1: [
      {
        ar: 'أنا أتناول الإفطار في الساعة السابعة صباحاً.',
        en: 'I eat breakfast at seven in the morning.',
        tiles: ['I', 'eat', 'breakfast', 'at', 'seven', 'in', 'the', 'morning.'],
        exp: 'نستخدم حرف الجر at مع الساعات وحرف الجر in مع أوقات اليوم.',
        focus: 'المضارع البسيط وحروف جر الزمان',
      },
      {
        ar: 'هل يمكنك مساعدتي في حمل هذه الحقيبة؟',
        en: 'Can you help me carry this bag?',
        tiles: ['Can', 'you', 'help', 'me', 'carry', 'this', 'bag?'],
        exp: 'استخدام الفعل المساعد Can لتقديم طلب مهذب.',
        focus: 'الطلب المهذب بواسطة Can',
      },
      {
        ar: 'هم يذهبون إلى العمل بالقطار كل يوم.',
        en: 'They go to work by train every day.',
        tiles: ['They', 'go', 'to', 'work', 'by', 'train', 'every', 'day.'],
        exp: 'نستخدم by مع وسائل النقل المباشرة مثل by train و by car.',
        focus: 'وسائل المواصلات والعادات اليومية',
      },
    ],
    A2: [
      {
        ar: 'لقد شاهدنا فيلماً وثائقياً رائعاً بالأمس.',
        en: 'We watched a great documentary yesterday.',
        tiles: ['We', 'watched', 'a', 'great', 'documentary', 'yesterday.'],
        exp: 'الماضي البسيط للأفعال المنتظمة بإضافة ed مع الكلمة الدالة yesterday.',
        focus: 'الماضي البسيط المنتظم',
      },
      {
        ar: 'هذا الكتاب أكثر فائدة من ذلك.',
        en: 'This book is more useful than that one.',
        tiles: ['This', 'book', 'is', 'more', 'useful', 'than', 'that', 'one.'],
        exp: 'الصفات الطويلة (useful) نصوغ مقارنتها باستخدام more ... than.',
        focus: 'المقارنة بين صفتين طويلتين',
      },
      {
        ar: 'ماذا كنت تفعل عندما اتصلت بك؟',
        en: 'What were you doing when I called you?',
        tiles: ['What', 'were', 'you', 'doing', 'when', 'I', 'called', 'you?'],
        exp: 'الماضي المستمر يتقاطع مع الماضي البسيط عند حدوث حدث مفاجئ بعد when.',
        focus: 'الماضي المستمر والماضي البسيط',
      },
    ],
    B1: [
      {
        ar: 'أنا أعمل في هذا المشروع منذ ثلاثة أشهر.',
        en: 'I have been working on this project for three months.',
        tiles: ['I', 'have', 'been', 'working', 'on', 'this', 'project', 'for', 'three', 'months.'],
        exp: 'المضارع التام المستمر يعبر عن حدث بدأ في الماضي وما زال مستمراً حتى الآن.',
        focus: 'المضارع التام المستمر (Present Perfect Continuous)',
      },
      {
        ar: 'إذا تدربت بانتظام، ستتحدث بطلاقة أكبر.',
        en: 'If you practice regularly, you will speak more fluently.',
        tiles: ['If', 'you', 'practice', 'regularly,', 'you', 'will', 'speak', 'more', 'fluently.'],
        exp: 'الشرطية الأولى: فعل الشرط مضارع بسيط وجواب الشرط will مع المصدر.',
        focus: 'الجمل الشرطية من النوع الأول',
      },
      {
        ar: 'هو لا يعلم أين وضع مفاتيح سيارته.',
        en: 'He does not know where he put his car keys.',
        tiles: ['He', 'does', 'not', 'know', 'where', 'he', 'put', 'his', 'car', 'keys.'],
        exp: 'الأسئلة غير المباشرة تعود فيها الجملة لترتيب الفاعل ثم الفعل دون فعل مساعد مقلوب.',
        focus: 'الأسئلة المضمنة (Embedded Questions)',
      },
    ],
    B2: [
      {
        ar: 'لو كنت مكانك، لتفاوضت على العرض الوظيفي فوراً.',
        en: 'If I were in your position, I would negotiate the job offer immediately.',
        tiles: ['If', 'I', 'were', 'in', 'your', 'position,', 'I', 'would', 'negotiate', 'the', 'job', 'offer', 'immediately.'],
        exp: 'صيغة الفرضية الثانية باستخدام were مع جميع الضمائر.',
        focus: 'الشرطية الثانية وتقديم النصيحة الاحترافية',
      },
      {
        ar: 'تم الانتهاء من جميع التقارير قبل بدء الاجتماع التنفيذي.',
        en: 'All reports had been finalized before the executive meeting started.',
        tiles: ['All', 'reports', 'had', 'been', 'finalized', 'before', 'the', 'executive', 'meeting', 'started.'],
        exp: 'الماضي التام المبني للمجهول لبيان أسبقية اكتمال الحدث الأول في الماضي.',
        focus: 'الماضي التام المبني للمجهول (Past Perfect Passive)',
      },
    ],
    C1: [
      {
        ar: 'نادراً ما أظهر فريقنا مثل هذا التفاني والابتكار.',
        en: 'Rarely has our team demonstrated such innovation and dedication.',
        tiles: ['Rarely', 'has', 'our', 'team', 'demonstrated', 'such', 'innovation', 'and', 'dedication.'],
        exp: 'القلب النحوي (Inversion) بعد ظروف النفي المشددة مثل Rarely أو Seldom.',
        focus: 'القلب النحوي للبلاغة والتوكيد (Negative Inversion)',
      },
    ],
    C2: [
      {
        ar: 'لم يكن التوصل إلى إجماع في الآراء إنجازاً يستهان به.',
        en: 'Reaching a consensus was by no means an insignificant milestone.',
        tiles: ['Reaching', 'a', 'consensus', 'was', 'by', 'no', 'means', 'an', 'insignificant', 'milestone.'],
        exp: 'أسلوب Litotes البلاغي للتأكيد من خلال نفي النقيض بأسلوب دبلوماسي رفيع.',
        focus: 'البلاغة المتقدمة وأسلوب Litotes المتميز',
      },
    ],
  };

  const pool = library[level] || library['A1'];
  return pool.slice(0, 3);
}

export function getDiverseListeningFallbacks(
  level: string,
  _recentPrompts: string[] = []
): Array<{ en: string; ar: string; ph: string; hint: string; bank: string[] }> {
  const library: Record<
    string,
    Array<{ en: string; ar: string; ph: string; hint: string; bank: string[] }>
  > = {
    A0: [
      {
        en: 'Good morning, how are you today?',
        ar: 'صباح الخير، كيف حالك اليوم؟',
        ph: 'جُود مُورْنِنْغ، هَاو آر يُو تُودَاي؟',
        hint: 'تحية صباحية متبوعة بسؤال عن الحال',
        bank: ['Good', 'morning,', 'how', 'are', 'you', 'today?', 'is', 'night', 'fine'],
      },
      {
        en: 'This is my favorite English teacher.',
        ar: 'هذا هو معلمي المفضل للغة الإنجليزية.',
        ph: 'ذِس إِز ماي فَيڤُورِت إِنْغْلِش تِيتْشَر',
        hint: 'انتبه لنطق حرف TH في This وصوت V في Favorite',
        bank: ['This', 'is', 'my', 'favorite', 'English', 'teacher.', 'a', 'school', 'your'],
      },
    ],
    A1: [
      {
        en: 'Could I please have a glass of water?',
        ar: 'هل يمكنني من فضلك الحصول على كوب من الماء؟',
        ph: 'كُود آي بْلِيز هَاڤ أَ غْلَاس أُوڤ وُوتَر؟',
        hint: 'طلب مهذب في مطعم أو مقهى',
        bank: ['Could', 'I', 'please', 'have', 'a', 'glass', 'of', 'water?', 'tea', 'can', 'cup'],
      },
      {
        en: 'We usually take a walk around sunset.',
        ar: 'نحن نتمشى عادةً عند وقت غروب الشمس.',
        ph: 'وِي يُوجُوالِي تَيْك أَ وُوك أَرَاوْنْد سَنْسِت',
        hint: 'ظرف التكرار usually يأتي قبل الفعل الأساسي take',
        bank: ['We', 'usually', 'take', 'a', 'walk', 'around', 'sunset.', 'never', 'runs', 'at'],
      },
    ],
    A2: [
      {
        en: 'I forgot to set my alarm clock last night.',
        ar: 'لقد نسيت أن أضبط منبهي الليلة الماضية.',
        ph: 'آي فُورْغُوت تُو سِت ماي أَلَارْم كْلُوك لَاسْت نَايْت',
        hint: 'الفعل forgot يتبعه مصدر مسبوق بـ to',
        bank: ['I', 'forgot', 'to', 'set', 'my', 'alarm', 'clock', 'last', 'night.', 'watch', 'forget'],
      },
    ],
    B1: [
      {
        en: 'I would appreciate it if you could send the files today.',
        ar: 'سأكون ممتناً للغاية لو أمكنك إرسال الملفات اليوم.',
        ph: 'آي وُود أَبْرِيشِيَيْت إِت إِف يُو كُود سِنْد ذَا فايْلْز تُودَاي',
        hint: 'أسلوب مراسلات العمل المهنية الرسمية',
        bank: ['I', 'would', 'appreciate', 'it', 'if', 'you', 'could', 'send', 'the', 'files', 'today.', 'will', 'thanks'],
      },
    ],
    B2: [
      {
        en: 'Despite the unexpected delays, the team met the deadline.',
        ar: 'على الرغم من التأخيرات غير المتوقعة، التزم الفريق بالموعد النهائي.',
        ph: 'دِسْبايْت ذِي أَنْإِكْسْبِكْتِد دِيلَايْز، ذَا تِيم مِت ذَا دِيدْلَايْن',
        hint: 'كلمة Despite يتبعها اسم أو عبارة اسمية دون of',
        bank: ['Despite', 'the', 'unexpected', 'delays,', 'the', 'team', 'met', 'the', 'deadline.', 'Although', 'finish'],
      },
    ],
    C1: [
      {
        en: 'Under no circumstances should confidential data be disclosed.',
        ar: 'تحت أي ظرف من الظروف لا يجوز إفشاء البيانات السرية.',
        ph: 'أَنْدَر نُو سِيرْكَمْسْتَانْسِز شُود كُونْفِيدِنْشَل دَيْتَا بِي دِسْكْلُوزْد',
        hint: 'تركيب بلاغي رسمي رفيع للسياسات القانونية والأمنية',
        bank: ['Under', 'no', 'circumstances', 'should', 'confidential', 'data', 'be', 'disclosed.', 'must', 'public'],
      },
    ],
    C2: [
      {
        en: 'The speaker eloquently articulated the prevailing sentiment.',
        ar: 'عبّر المتحدث ببلاغة فائقة عن الشعور والموقف السائد.',
        ph: 'ذَا سْبِيكَر إِلُوكْوِنْتْلِي آرْتِيكْيُولَيْتِد ذَا بْرِيڤَيْلِنْغ سِنْتِيمِنْت',
        hint: 'مفردات أكاديمية ودبلوماسية بالغة الدقة',
        bank: ['The', 'speaker', 'eloquently', 'articulated', 'the', 'prevailing', 'sentiment.', 'said', 'clear'],
      },
    ],
  };

  const pool = library[level] || library['A1'];
  return pool.slice(0, 3);
}

export function getDiverseVocabularyFallbacks(
  level: string,
  _recentPrompts: string[] = []
): Array<{
  word: string;
  ipa: string;
  arabicPhonetic: string;
  partOfSpeech: string;
  arabicMeaning: string;
  englishDefinition: string;
  exampleEn: string;
  exampleAr: string;
  collocations: string[];
  arabicMistakeWarning: string;
}> {
  const library: Record<
    string,
    Array<{
      word: string;
      ipa: string;
      arabicPhonetic: string;
      partOfSpeech: string;
      arabicMeaning: string;
      englishDefinition: string;
      exampleEn: string;
      exampleAr: string;
      collocations: string[];
      arabicMistakeWarning: string;
    }>
  > = {
    A0: [
      {
        word: 'Passport',
        ipa: '/ˈpæs.pɔːrt/',
        arabicPhonetic: 'بَاسْبُورْت (صوت P مهموس بهواء قوي)',
        partOfSpeech: 'noun',
        arabicMeaning: 'جواز سفر',
        englishDefinition: 'An official document issued by a government certifying identity and citizenship.',
        exampleEn: 'Please show your passport at the gate.',
        exampleAr: 'يرجى إبراز جواز سفرك عند البوابة.',
        collocations: ['valid passport', 'passport control', 'renew a passport'],
        arabicMistakeWarning: 'لا تنطقها Bassport بالباء (B)، بل باندفاع هواء P الصافي.',
      },
      {
        word: 'Welcome',
        ipa: '/ˈwel.kəm/',
        arabicPhonetic: 'وِيلْكَم',
        partOfSpeech: 'verb / adjective',
        arabicMeaning: 'مرحباً / أهلاً وسهلاً',
        englishDefinition: 'To greet someone warmly upon arrival.',
        exampleEn: 'Welcome to our country!',
        exampleAr: 'أهلاً ومرحباً بك في بلادنا!',
        collocations: ['warm welcome', 'welcome home', 'you are welcome'],
        arabicMistakeWarning: 'عند الرد على شكراً، نقول You are welcome وليس welcome وحدها.',
      },
    ],
    A1: [
      {
        word: 'Schedule',
        ipa: '/ˈskedʒ.uːl/ (US) / /ˈʃedʒ.uːl/ (UK)',
        arabicPhonetic: 'سْكِيدْجُول (أمريكي) / شِيدْيُول (بريطاني)',
        partOfSpeech: 'noun / verb',
        arabicMeaning: 'جدول مواعيد / يجدول',
        englishDefinition: 'A plan that gives expected times for different events to happen.',
        exampleEn: 'I have a very busy schedule today.',
        exampleAr: 'لدي جدول مواعيد مزدحم للغاية اليوم.',
        collocations: ['tight schedule', 'ahead of schedule', 'behind schedule'],
        arabicMistakeWarning: 'تذكر الفارق في النطق بين اللهجة الأمريكية والبريطانية.',
      },
    ],
    A2: [
      {
        word: 'Opportunity',
        ipa: '/ˌɑː.pɚˈtuː.nə.t̬i/',
        arabicPhonetic: 'أُوبُورْتْيُونِتِي',
        partOfSpeech: 'noun',
        arabicMeaning: 'فرصة ثمينة أو سانحة',
        englishDefinition: 'A set of circumstances that makes it possible to do something.',
        exampleEn: 'Studying abroad is a great learning opportunity.',
        exampleAr: 'الدراسة في الخارج فرصة تعليمية عظيمة.',
        collocations: ['golden opportunity', 'career opportunity', 'seize an opportunity'],
        arabicMistakeWarning: 'الجمع فرص هو opportunities بحذف y وإضافة ies.',
      },
    ],
    B1: [
      {
        word: 'Accomplish',
        ipa: '/əˈkɑːm.plɪʃ/',
        arabicPhonetic: 'أَكُومْبْلِيش',
        partOfSpeech: 'verb',
        arabicMeaning: 'ينجز / يحقق بنجاح',
        englishDefinition: 'To achieve or complete something successfully.',
        exampleEn: 'With dedication, you can accomplish your goals.',
        exampleAr: 'بالتفاني والعزيمة، يمكنك إنجاز أهدافك.',
        collocations: ['accomplish a mission', 'accomplish a task', 'a sense of accomplishment'],
        arabicMistakeWarning: 'كلمة accomplish تشير للإنجاز التام، بينما do مجرد فعل الشيء.',
      },
    ],
    B2: [
      {
        word: 'Resilient',
        ipa: '/rɪˈzɪl.jənt/',
        arabicPhonetic: 'رِيزِيلْيَانْت',
        partOfSpeech: 'adjective',
        arabicMeaning: 'مرن، قادر على الصمود والتعافي السريع',
        englishDefinition: 'Able to withstand or recover quickly from difficult conditions.',
        exampleEn: 'Successful entrepreneurs remain resilient in the face of setbacks.',
        exampleAr: 'رواد الأعمال الناجحون يظلون صامدين ومَرنين في وجه العثرات.',
        collocations: ['resilient economy', 'resilient mindset', 'highly resilient'],
        arabicMistakeWarning: 'الاسم منها resilience وليس resiliency فقط.',
      },
    ],
    C1: [
      {
        word: 'Nuance',
        ipa: '/ˈnuː.ɑːns/',
        arabicPhonetic: 'نْيُووَانْس',
        partOfSpeech: 'noun',
        arabicMeaning: 'فارق دقيق وخفي في المعنى أو التعبير',
        englishDefinition: 'A subtle distinction or variation in tone, meaning, or expression.',
        exampleEn: 'Advanced fluency requires understanding cultural nuances.',
        exampleAr: 'الطلاقة المتقدمة تتطلب استيعاب الفروق الثقافية الدقيقة.',
        collocations: ['subtle nuance', 'linguistic nuance', 'grasp the nuances'],
        arabicMistakeWarning: 'تُستعمل غالباً بصيغة الجمع nuances للإشارة للظلال المتعددة للمعنى.',
      },
    ],
    C2: [
      {
        word: 'Quintessential',
        ipa: '/ˌkwɪn.təˈsen.ʃəl/',
        arabicPhonetic: 'كْوِينْتِسِنْشَل',
        partOfSpeech: 'adjective',
        arabicMeaning: 'النموذج الأمثل والمجسّد للجوهر الخالص',
        englishDefinition: 'Representing the most perfect or typical example of a quality or class.',
        exampleEn: 'A cup of afternoon tea is the quintessential British tradition.',
        exampleAr: 'كوب شاي الظهيرة هو النموذج والرمز الكلاسيكي الأسمى للتقاليد البريطانية.',
        collocations: ['quintessential example', 'quintessential experience'],
        arabicMistakeWarning: 'كلمة بلاغية عالية الرفعة تُستخدم في الخطاب الصحفي والأدبي المتقدم.',
      },
    ],
  };

  const pool = library[level] || library['A1'];
  return pool.slice(0, 3);
}
