/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MinimalPair {
  wordA: string;
  ipaA: string;
  meaningArA: string;
  wordB: string;
  ipaB: string;
  meaningArB: string;
}

export interface PronunciationTopic {
  id: string;
  titleAr: string;
  titleEn: string;
  phonemePair: string;
  summaryAr: string;
  mouthPositionAr: string;
  arabicTransferWarningAr: string;
  minimalPairs: MinimalPair[];
}

export const PRONUNCIATION_TOPICS: PronunciationTopic[] = [
  {
    id: 'topic-p-vs-b',
    titleAr: 'تحدي P المهموس مقابل B المجهور',
    titleEn: 'Voiceless /p/ vs Voiced /b/',
    phonemePair: '/p/ vs /b/',
    summaryAr: 'الصوت الأكثر إحداثاً للخلط لدى متحدثي العربية لعدم وجود P الصريح في الأبجدية العربية.',
    mouthPositionAr: 'أطبق الشفتين بإحكام: مع حرف P احبس الهواء واطلقه باندفاع نفاث مفاجئ دون اهتزاز الحبال الصوتية. مع حرف B دع الحبال الصوتية تهتز وافتح شفتيك بنعومة.',
    arabicTransferWarningAr: 'الخلط بينهما يغير المعنى جذرياً: استبدال P بـ B يحول كلمة Park (حديقة) إلى Bark (نباح كلب)!',
    minimalPairs: [
      {
        wordA: 'Park',
        ipaA: '/pɑːrk/',
        meaningArA: 'حديقة عامة أو يوقف سيارة',
        wordB: 'Bark',
        ipaB: '/bɑːrk/',
        meaningArB: 'نباح كلب أو لحاء شجرة',
      },
      {
        wordA: 'Pen',
        ipaA: '/pen/',
        meaningArA: 'قلم حبر جاف',
        wordB: 'Ben',
        ipaB: '/ben/',
        meaningArB: 'اسم علم (بن)',
      },
      {
        wordA: 'Pig',
        ipaA: '/pɪɡ/',
        meaningArA: 'خنزير',
        wordB: 'Big',
        ipaB: '/bɪɡ/',
        meaningArB: 'كبير الحجم',
      },
      {
        wordA: 'Peach',
        ipaA: '/piːtʃ/',
        meaningArA: 'خوخ أو دراق',
        wordB: 'Beach',
        ipaB: '/biːtʃ/',
        meaningArB: 'شاطئ البحر',
      },
      {
        wordA: 'Pear',
        ipaA: '/per/',
        meaningArA: 'إجاص / كمثرى',
        wordB: 'Bear',
        ipaB: '/ber/',
        meaningArB: 'دب أو يتحمل',
      },
      {
        wordA: 'Pat',
        ipaA: '/pæt/',
        meaningArA: 'يربت بلطف',
        wordB: 'Bat',
        ipaB: '/bæt/',
        meaningArB: 'مضرب أو خفاش',
      },
    ],
  },
  {
    id: 'topic-v-vs-f',
    titleAr: 'صوت V المجهور مقابل F المهموس',
    titleEn: 'Voiced /v/ vs Voiceless /f/',
    phonemePair: '/v/ vs /f/',
    summaryAr: 'صوت V يتطلب اهتزازاً ملموساً في الحنجرة تماماً كطنين النحل مع ملامسة الأسنان العليا للشفة السفلى.',
    mouthPositionAr: 'ضع أسنانك الأمامية العلوية على باطن شفتك السفلية برفق. اخرج صوتاً رناناً يهز الحنجرة لـ V، وانفث هواءً صافياً دون اهتزاز لـ F.',
    arabicTransferWarningAr: 'في بعض اللهجات يُستبدل صوت V بصوت F، مما يجعل كلمات مثل Van (شاحنة) تبدو كـ Fan (مروحة أو معجب).',
    minimalPairs: [
      {
        wordA: 'Van',
        ipaA: '/væn/',
        meaningArA: 'شاحنة صغيرة أو عربة مغلقة',
        wordB: 'Fan',
        ipaB: '/fæn/',
        meaningArB: 'مروحة أو معجب متحمس',
      },
      {
        wordA: 'Vine',
        ipaA: '/vaɪn/',
        meaningArA: 'كرمة العنب أو نبتة متسلقة',
        wordB: 'Fine',
        ipaB: '/faɪn/',
        meaningArB: 'بخير أو غرامة مالية',
      },
      {
        wordA: 'Vast',
        ipaA: '/væst/',
        meaningArA: 'شاسع وهائل المساحة',
        wordB: 'Fast',
        ipaB: '/fæst/',
        meaningArB: 'سريع أو يصوم',
      },
      {
        wordA: 'Leave',
        ipaA: '/liːv/',
        meaningArA: 'يغادر أو يترك',
        wordB: 'Leaf',
        ipaB: '/liːf/',
        meaningArB: 'ورقة شجرة',
      },
      {
        wordA: 'Save',
        ipaA: '/seɪv/',
        meaningArA: 'ينقذ أو يوفر مالاً',
        wordB: 'Safe',
        ipaB: '/seɪf/',
        meaningArB: 'آمن أو خزنة حديدية',
      },
    ],
  },
  {
    id: 'topic-th-sounds',
    titleAr: 'صوتا TH: الثاء /θ/ والذال /ð/',
    titleEn: 'Voiceless /θ/ vs Voiced /ð/',
    phonemePair: '/θ/ vs /ð/',
    summaryAr: 'المفتاح السحري هو وضع طرف اللسان بين الأسنان الأمامية، وليس خلفها كحرف S أو Z.',
    mouthPositionAr: 'أبرز طرف لسانك قليلاً بين أسنانك العليا والسفلى. مع صوت الثاء /θ/ انفث هواء خفيفاً (Think)، ومع صوت الذال /ð/ أضف رنين الحبال الصوتية (This).',
    arabicTransferWarningAr: 'تجنب نطق Think كـ Sink أو Tink، وتجنب نطق This كـ Dis أو Zis.',
    minimalPairs: [
      {
        wordA: 'Three',
        ipaA: '/θriː/',
        meaningArA: 'رقم ثلاثة 3',
        wordB: 'Tree',
        ipaB: '/triː/',
        meaningArB: 'شجرة خضراء',
      },
      {
        wordA: 'Think',
        ipaA: '/θɪŋk/',
        meaningArA: 'يفكر أو يعتقد',
        wordB: 'Sink',
        ipaB: '/sɪŋk/',
        meaningArB: 'يغرق أو حوض الغسيل',
      },
      {
        wordA: 'Theme',
        ipaA: '/θiːm/',
        meaningArA: 'موضوع رئيسي أو نمط',
        wordB: 'Seem',
        ipaB: '/siːm/',
        meaningArB: 'يبدو في المظهر',
      },
      {
        wordA: 'Breathe',
        ipaA: '/briːð/',
        meaningArA: 'يتنفس (فعل بصوت الذال)',
        wordB: 'Breath',
        ipaB: '/breθ/',
        meaningArB: 'نَفَس (اسم بصوت الثاء)',
      },
    ],
  },
  {
    id: 'topic-short-i-vs-long-ee',
    titleAr: 'الكسرة الخفيفة /ɪ/ مقابل الياء الممدودة /iː/',
    titleEn: 'Short /ɪ/ vs Long /iː/',
    phonemePair: '/ɪ/ vs /iː/',
    summaryAr: 'التمييز بين صوت الحركة القصير المريح وصوت العلة الطويل المشدود.',
    mouthPositionAr: 'مع /ɪ/ (كما في Sit) دع فكك يسترخي قليلاً بحركة خاطفة وسريعة. مع /iː/ (كما في Seat) شد زوايا شفتيك كما في الابتسامة الواسعة.',
    arabicTransferWarningAr: 'الخلط بينهما قد يؤدي إلى إحراجات لغوية شائعة مثل الخلط بين Ship و Sheep أو Sit و Seat.',
    minimalPairs: [
      {
        wordA: 'Ship',
        ipaA: '/ʃɪp/',
        meaningArA: 'سفينة بحرية ضخمة',
        wordB: 'Sheep',
        ipaB: '/ʃiːp/',
        meaningArB: 'خروف أو غنم',
      },
      {
        wordA: 'Sit',
        ipaA: '/sɪt/',
        meaningArA: 'يجلس على كرسي',
        wordB: 'Seat',
        ipaB: '/siːt/',
        meaningArB: 'مقعد مخصص',
      },
      {
        wordA: 'Fit',
        ipaA: '/fɪt/',
        meaningArA: 'لائق بدنياً أو يناسب مقاسه',
        wordB: 'Feet',
        ipaB: '/fiːt/',
        meaningArB: 'أقدام (جمع قدم)',
      },
      {
        wordA: 'Hit',
        ipaA: '/hɪt/',
        meaningArA: 'يضرب أو يصيب الهدف',
        wordB: 'Heat',
        ipaB: '/hiːt/',
        meaningArB: 'حرارة أو تسخين',
      },
    ],
  },
];
