/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { CEFRLevel } from '../types/learning.ts';

export interface CheckpointQuestion {
  id: string;
  question: string;
  questionEn?: string;
  questionAr?: string;
  options: string[];
  correctIndex: number;
  explanationAr: string;
}

export interface LevelCheckpoint {
  level: CEFRLevel;
  nextLevel: CEFRLevel;
  titleAr: string;
  titleEn: string;
  passingScore: number;
  questions: CheckpointQuestion[];
}

export const LEVEL_CHECKPOINTS: LevelCheckpoint[] = [
  {
    level: 'A0',
    nextLevel: 'A1',
    titleAr: 'اختبار كفاءة نهاية مستوى التأسيس (A0)',
    titleEn: 'A0 to A1 Milestone Proficiency Exam',
    passingScore: 4,
    questions: [
      {
        id: 'cp-a0-1',
        question: 'Which word contains the voiceless /p/ sound with a strong puff of air?',
        options: ['Bark', 'Park', 'Baby', 'Book'],
        correctIndex: 1,
        explanationAr: 'كلمة Park تبدأ بصوت P المهموس الذي يخرج باندفاع قوي للهواء.',
      },
      {
        id: 'cp-a0-2',
        question: 'Choose the correct greeting for 8:00 AM:',
        options: ['Good evening', 'Good morning', 'Good night', 'Good afternoon'],
        correctIndex: 1,
        explanationAr: 'في الصباح الباكر نقول Good morning.',
      },
      {
        id: 'cp-a0-3',
        question: 'Complete: "Hello, my name ___ Sarah."',
        options: ['is', 'are', 'am', 'be'],
        correctIndex: 0,
        explanationAr: 'اسم المفرد (my name) يأخذ فعل الكينونة is.',
      },
      {
        id: 'cp-a0-4',
        question: 'What is the correct English word for number 12?',
        options: ['Two', 'Twenty', 'Twelve', 'Twentieth'],
        correctIndex: 2,
        explanationAr: 'الرقم 12 بالإنجليزية هو Twelve.',
      },
      {
        id: 'cp-a0-5',
        question: 'Which word has the voiced /ð/ sound as in "Father"?',
        options: ['Think', 'This', 'Three', 'Thank'],
        correctIndex: 1,
        explanationAr: 'كلمة This تنطق بصوت الذال المجهور /ð/ مثل Father.',
      },
    ],
  },
  {
    level: 'A1',
    nextLevel: 'A2',
    titleAr: 'اختبار كفاءة الانتقال إلى المستوى الابتدائي (A1 إلى A2)',
    titleEn: 'A1 to A2 Breakthrough Assessment',
    passingScore: 4,
    questions: [
      {
        id: 'cp-a1-1',
        question: 'She ___ coffee every morning before work.',
        options: ['drink', 'drinks', 'is drink', 'drinking'],
        correctIndex: 1,
        explanationAr: 'مع الضمائر المفردة الغائبة (He/She/It) في المضارع البسيط نضيف s للفعل.',
      },
      {
        id: 'cp-a1-2',
        question: 'Identify the sentence with correct word order:',
        options: [
          'I live in a house big.',
          'I live in a big house.',
          'I live big house in.',
          'In big house I live.',
        ],
        correctIndex: 1,
        explanationAr: 'في الإنجليزية تسبق الصفة الاسم الموصوف دائماً: a big house.',
      },
      {
        id: 'cp-a1-3',
        question: 'Where ___ you go last weekend?',
        options: ['do', 'did', 'does', 'are'],
        correctIndex: 1,
        explanationAr: 'نسأل عن أحداث الماضي البسيط باستخدام الفعل المساعد Did.',
      },
      {
        id: 'cp-a1-4',
        question: 'Choose the correct preposition: "I was born ___ May 15th."',
        options: ['at', 'in', 'on', 'by'],
        correctIndex: 2,
        explanationAr: 'مع التواريخ والأيام المحددة نستخدم حرف الجر on.',
      },
      {
        id: 'cp-a1-5',
        question: 'Which sentence avoids the common Arabic speaker mistake?',
        options: [
          'I am agree with your proposal.',
          'I agree with your proposal.',
          'I agreeing with your proposal.',
          'I am agreed with your proposal.',
        ],
        correctIndex: 1,
        explanationAr: 'الفعل agree فعل صريح لا يحتاج إلى فعل الكينونة am.',
      },
    ],
  },
  {
    level: 'A2',
    nextLevel: 'B1',
    titleAr: 'اختبار اجتياز المستوى الابتدائي والوصول للمتوسط (A2 إلى B1)',
    titleEn: 'A2 to B1 Threshold Milestone Exam',
    passingScore: 4,
    questions: [
      {
        id: 'cp-a2-1',
        question: 'While I ___ to the radio, the power suddenly went out.',
        options: ['was listening', 'listened', 'am listening', 'listen'],
        correctIndex: 0,
        explanationAr: 'حدث مستمر في الماضي قطعته لحظة انقطاع الكهرباء: Past Continuous مع while.',
      },
      {
        id: 'cp-a2-2',
        question: 'Dubai is ___ than many European capitals in summer.',
        options: ['hot', 'hotter', 'more hot', 'hottest'],
        correctIndex: 1,
        explanationAr: 'الصفة القصيرة hot تضاعف حرف t وتأخذ er في المقارنة: hotter than.',
      },
      {
        id: 'cp-a2-3',
        question: 'I haven’t seen him ___ last December.',
        options: ['for', 'since', 'during', 'from'],
        correctIndex: 1,
        explanationAr: 'مع نقطة البداية المحددة في الزمن نستخدم since مع المضارع التام.',
      },
      {
        id: 'cp-a2-4',
        question: 'If it rains tomorrow, we ___ stay home.',
        options: ['would', 'will', 'did', 'are'],
        correctIndex: 1,
        explanationAr: 'الشرطية الأولى: مضارع بسيط في فعل الشرط و will في جواب الشرط.',
      },
      {
        id: 'cp-a2-5',
        question: 'Choose the sentence that correctly uses "used to":',
        options: [
          'I used to playing tennis when I was a child.',
          'I used to play tennis when I was a child.',
          'I am used to play tennis when I was a child.',
          'I use to play tennis when I was a child.',
        ],
        correctIndex: 1,
        explanationAr: 'التركيب used to للتعبير عن عادة في الماضي يتبعه الفعل بصيغة المصدر المجرد.',
      },
    ],
  },
  {
    level: 'B1',
    nextLevel: 'B2',
    titleAr: 'اختبار الارتقاء للمستوى فوق المتوسط (B1 إلى B2)',
    titleEn: 'B1 to B2 Vantage Mastery Exam',
    passingScore: 4,
    questions: [
      {
        id: 'cp-b1-1',
        question: 'By the time the rescue team arrived, the hikers ___ a shelter.',
        options: ['built', 'have built', 'had built', 'were building'],
        correctIndex: 2,
        explanationAr: 'الماضي التام (had built) يصف الحدث الذي اكتمل أولاً قبل حدث آخر في الماضي.',
      },
      {
        id: 'cp-b1-2',
        question: 'The new bridge ___ next month by the prime minister.',
        options: ['will inaugurate', 'will be inaugurated', 'inaugurates', 'has inaugurated'],
        correctIndex: 1,
        explanationAr: 'المبني للمجهول في المستقبل: will be + التصريف الثالث.',
      },
      {
        id: 'cp-b1-3',
        question: 'If I ___ more time, I would have joined your conference.',
        options: ['have', 'had', 'had had', 'would have'],
        correctIndex: 2,
        explanationAr: 'الشرطية الثالثة: had + Past Participle (had had).',
      },
      {
        id: 'cp-b1-4',
        question: 'Select the natural collocation with the word "decision":',
        options: ['Do a decision', 'Make a decision', 'Create a decision', 'Perform a decision'],
        correctIndex: 1,
        explanationAr: 'المتلازمة اللفظية الصحيحة هي make a decision.',
      },
      {
        id: 'cp-b1-5',
        question: 'She asked me where ___ during my visit to London.',
        options: ['did I stay', 'I had stayed', 'had I stayed', 'did I stayed'],
        correctIndex: 1,
        explanationAr: 'في الكلام المنقول والأسئلة غير المباشرة يعود الترتيب فاعل ثم فعل.',
      },
    ],
  },
  {
    level: 'B2',
    nextLevel: 'C1',
    titleAr: 'اختبار الكفاءة المتقدمة (B2 إلى C1)',
    titleEn: 'B2 to C1 Effective Operational Proficiency',
    passingScore: 4,
    questions: [
      {
        id: 'cp-b2-1',
        question: 'Rarely ___ such an extraordinary level of customer satisfaction.',
        options: [
          'we have witnessed',
          'have we witnessed',
          'did we witnessed',
          'we witnessed',
        ],
        correctIndex: 1,
        explanationAr: 'القلب النحوي (Inversion) بعد ظروف النفي المشددة: have we witnessed.',
      },
      {
        id: 'cp-b2-2',
        question: 'The committee recommended that the proposal ___ submitted in writing.',
        options: ['is', 'be', 'was', 'to be'],
        correctIndex: 1,
        explanationAr: 'صيغة الـ Subjunctive بعد أفعال التوصية والاقتراح تتطلب المصدر المجرد be.',
      },
      {
        id: 'cp-b2-3',
        question: '___ all her responsibilities, she still made time to volunteer.',
        options: ['Despite', 'Although', 'Even though', 'In spite'],
        correctIndex: 0,
        explanationAr: 'كلمة Despite يتبعها اسم أو عبارة اسمية مباشرة دون of.',
      },
      {
        id: 'cp-b2-4',
        question: 'Choose the word closest in meaning to "pragmatic":',
        options: ['Theoretical', 'Practical and realistic', 'Emotional', 'Idealistic'],
        correctIndex: 1,
        explanationAr: 'كلمة pragmatic تعني عملي وواقعي يركز على النتائج الملموسة.',
      },
      {
        id: 'cp-b2-5',
        question: 'Had I known about the flight cancellation, I ___ another ticket.',
        options: [
          'would book',
          'will book',
          'would have booked',
          'had booked',
        ],
        correctIndex: 2,
        explanationAr: 'قلب الشرطية الثالثة (Had I known) يقابله في جواب الشرط would have booked.',
      },
    ],
  },
  {
    level: 'C1',
    nextLevel: 'C2',
    titleAr: 'اختبار الإتقان الشامل والطلاقة البلاغية (C1 إلى C2)',
    titleEn: 'C1 to C2 Mastery and Rhetorical Polish',
    passingScore: 4,
    questions: [
      {
        id: 'cp-c1-1',
        question: 'Not only ___ the expectations, but they also pioneered an entirely new framework.',
        options: [
          'they exceeded',
          'did they exceed',
          'exceeded they',
          'had they exceeded',
        ],
        correctIndex: 1,
        explanationAr: 'القلب النحوي مع Not only في الماضي البسيط: did they exceed.',
      },
      {
        id: 'cp-c1-2',
        question: 'Choose the rhetorical term for expressing an affirmative by negating the opposite (e.g., "no mean feat"):',
        options: ['Metaphor', 'Litotes', 'Hyperbole', 'Oxymoron'],
        correctIndex: 1,
        explanationAr: 'أسلوب Litotes البلاغي هو نفي النقيض للتأكيد المتزن والراقي.',
      },
      {
        id: 'cp-c1-3',
        question: 'His arguments, ___ compelling, failed to sway the dissenting board members.',
        options: ['albeit', 'whereas', 'unless', 'nevertheless'],
        correctIndex: 0,
        explanationAr: 'كلمة albeit أداة ربط راقية تعني "وإن كان" أو "على الرغم من كونه".',
      },
      {
        id: 'cp-c1-4',
        question: 'Which word describes a person who is eloquent and expressive in communication?',
        options: ['Reticent', 'Articulate', 'Ambivalent', 'Taciturn'],
        correctIndex: 1,
        explanationAr: 'Articulate يعني فصيح وبليغ وقادر على التعبير بوضوح استثنائي.',
      },
      {
        id: 'cp-c1-5',
        question: 'Were they to reconsider the terms, we ___ open to resumed negotiations.',
        options: ['will remain', 'would remain', 'are remaining', 'had remained'],
        correctIndex: 1,
        explanationAr: 'صيغة الشرط الافتراضي الرفيع: Were they to... would remain.',
      },
    ],
  },
  {
    level: 'C2',
    nextLevel: 'C2',
    titleAr: 'وسام الإتقان والتميز الأكاديمي والبلاغي الأسمى (C2 Mastery)',
    titleEn: 'Grandmaster CEFR C2 Supreme Certification',
    passingScore: 4,
    questions: [
      {
        id: 'cp-c2-1',
        question: 'The treaty was signed under the ___ of international arbitration.',
        options: ['aegis', 'tenor', 'apex', 'parlance'],
        correctIndex: 0,
        explanationAr: 'عبارة under the aegis of تعني تحت رعاية وحماية جهة موثوقة.',
      },
      {
        id: 'cp-c2-2',
        question: 'Identify the syntactically balanced parallel structure:',
        options: [
          'He came to inspire, educate, and bringing hope.',
          'He came to inspire, to educate, and to bring hope.',
          'He came for inspiring, educate, and bring hope.',
          'He came inspiring, educated, and to bring hope.',
        ],
        correctIndex: 1,
        explanationAr: 'التوازي البلاغي (Parallelism) يقتضي تناسق الصيغ النحوية عبر المعطوفات.',
      },
      {
        id: 'cp-c2-3',
        question: 'What nuance distinguishes "meticulous" from "scrupulous"?',
        options: [
          'Scrupulous exclusively implies moral or ethical integrity, while meticulous emphasizes extreme attention to detail.',
          'Meticulous is negative, scrupulous is positive.',
          'They have identical meanings in all legal registers.',
          'Meticulous refers only to financial accounting.',
        ],
        correctIndex: 0,
        explanationAr: 'Scrupulous تحمل بعداً أخلاقياً وضميرياً بينما meticulous تعني شدة الدقة في التفاصيل.',
      },
      {
        id: 'cp-c2-4',
        question: 'Little did they realize the ___ consequences that would unravel.',
        options: ['felicitous', 'deleterious', 'ephemeral', 'sycophantic'],
        correctIndex: 1,
        explanationAr: 'Deleterious تعني ضار ومؤذٍ للغاية وذو عواقب سلبية متلاحقة.',
      },
      {
        id: 'cp-c2-5',
        question: 'Which literary device is exemplified in "The silence was deafening"?',
        options: ['Chiasmus', 'Oxymoron', 'Zeugma', 'Anaphora'],
        correctIndex: 1,
        explanationAr: 'الـ Oxymoron هو الجمع بين كلمتين متناقضتين ظاهرياً لإحداث أثر بلاغي عميق.',
      },
    ],
  },
];
