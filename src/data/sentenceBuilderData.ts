/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { CEFRLevel } from '../types/learning.ts';

export interface SentenceBuilderChallenge {
  id: string;
  level: CEFRLevel;
  promptAr: string;
  correctSentence: string;
  wordTiles: string[];
  explanationAr: string;
  grammarFocusAr: string;
  isAiGenerated?: boolean;
}

export const SENTENCE_BUILDER_CHALLENGES: SentenceBuilderChallenge[] = [
  {
    id: 'sb-a0-1',
    level: 'A0',
    promptAr: 'مرحباً، أنا اسمي فارس.',
    correctSentence: 'Hello, my name is Fares.',
    wordTiles: ['Hello,', 'my', 'name', 'is', 'Fares.'],
    explanationAr: 'في الإنجليزية نبدأ بالتحية، ثم صفة الملكية my واسم الفاعل متبوعاً بفعل الكينونة is.',
    grammarFocusAr: 'التحيات وفعل الكينونة مع ضمائر الملكية',
  },
  {
    id: 'sb-a0-2',
    level: 'A0',
    promptAr: 'هذا كتاب إنجليزي مفيد.',
    correctSentence: 'This is a useful English book.',
    wordTiles: ['This', 'is', 'a', 'useful', 'English', 'book.'],
    explanationAr: 'تأتي الصفات (useful ثم English) قبل الاسم الموصوف (book) مسبوقة بأداة النكرة a.',
    grammarFocusAr: 'ترتيب الصفات وأداة النكرة',
  },
  {
    id: 'sb-a1-1',
    level: 'A1',
    promptAr: 'أنا أستيقظ مبكراً كل صباح.',
    correctSentence: 'I wake up early every morning.',
    wordTiles: ['I', 'wake', 'up', 'early', 'every', 'morning.'],
    explanationAr: 'الفعل المركب wake up يعبر عن الاستيقاظ مع المضارع البسيط للروتين اليومي.',
    grammarFocusAr: 'المضارع البسيط والأفعال المركبة الشائعة',
  },
  {
    id: 'sb-a1-2',
    level: 'A1',
    promptAr: 'هل يمكنك التحدث ببطء أكثر من فضلك؟',
    correctSentence: 'Can you speak more slowly, please?',
    wordTiles: ['Can', 'you', 'speak', 'more', 'slowly,', 'please?'],
    explanationAr: 'صيغة طلب مهذب تبدأ بـ Can متبوعة بالفاعل والظرف more slowly.',
    grammarFocusAr: 'الطلب المهذب وظروف الطريقة المقارنة',
  },
  {
    id: 'sb-a2-1',
    level: 'A2',
    promptAr: 'لقد سافرنا إلى دبي الشهر الماضي.',
    correctSentence: 'We traveled to Dubai last month.',
    wordTiles: ['We', 'traveled', 'to', 'Dubai', 'last', 'month.'],
    explanationAr: 'الماضي البسيط للفعل المنتظم travel بإضافة ed مع الكلمة الدالة last month.',
    grammarFocusAr: 'الماضي البسيط وحروف جر المكان',
  },
  {
    id: 'sb-a2-2',
    level: 'A2',
    promptAr: 'أنا متفق تماماً مع فكرتك الممتازة.',
    correctSentence: 'I agree with your excellent idea.',
    wordTiles: ['I', 'agree', 'with', 'your', 'excellent', 'idea.'],
    explanationAr: 'تجنب خطأ الناطقين بالعربية الشائع: لا تقل I am agree، بل I agree مباشرة.',
    grammarFocusAr: 'حروف الجر المصاحبة للأفعال (agree with)',
  },
  {
    id: 'sb-b1-1',
    level: 'B1',
    promptAr: 'لقد انتهيت للتو من قراءة هذا التقرير.',
    correctSentence: 'I have just finished reading this report.',
    wordTiles: ['I', 'have', 'just', 'finished', 'reading', 'this', 'report.'],
    explanationAr: 'المضارع التام مع just لحدث اكتمل في اللحظة السابقة مباشرة، والفعل finish يتبعه اسم فاعل gerund.',
    grammarFocusAr: 'المضارع التام مع Just وصيغة Gerund',
  },
  {
    id: 'sb-b1-2',
    level: 'B1',
    promptAr: 'إذا غادرت الآن، ستصل في الموعد المحدد.',
    correctSentence: 'If you leave now, you will arrive on time.',
    wordTiles: ['If', 'you', 'leave', 'now,', 'you', 'will', 'arrive', 'on', 'time.'],
    explanationAr: 'الشرطية الأولى: فعل الشرط مضارع بسيط وجواب الشرط مستقبل مع will.',
    grammarFocusAr: 'الشرطية الأولى والعبارات الزمنية (on time)',
  },
  {
    id: 'sb-b2-1',
    level: 'B2',
    promptAr: 'لو كنت مكانك، لتحدثت مع المدير بصراحة.',
    correctSentence: 'If I were you, I would speak to the manager frankly.',
    wordTiles: ['If', 'I', 'were', 'you,', 'I', 'would', 'speak', 'to', 'the', 'manager', 'frankly.'],
    explanationAr: 'الشرطية الافتراضية الثانية لتقديم النصيحة مع صيغة were الافتراضية مع I.',
    grammarFocusAr: 'الشرطية الثانية وتقديم النصيحة الدبلوماسية',
  },
  {
    id: 'sb-b2-2',
    level: 'B2',
    promptAr: 'تم تحديث الموقع الإلكتروني بالكامل قبل إطلاق الحملة.',
    correctSentence: 'The website had been completely updated before the campaign launched.',
    wordTiles: ['The', 'website', 'had', 'been', 'completely', 'updated', 'before', 'the', 'campaign', 'launched.'],
    explanationAr: 'الماضي التام المبني للمجهول لبيان أسبقية اكتمال تحديث الموقع.',
    grammarFocusAr: 'المبني للمجهول في الماضي التام (Past Perfect Passive)',
  },
  {
    id: 'sb-c1-1',
    level: 'C1',
    promptAr: 'نادراً ما شهدنا مثل هذا التحول الاستراتيجي الملهم.',
    correctSentence: 'Rarely have we witnessed such an inspiring strategic transformation.',
    wordTiles: ['Rarely', 'have', 'we', 'witnessed', 'such', 'an', 'inspiring', 'strategic', 'transformation.'],
    explanationAr: 'القلب النحوي (Inversion) بعد ظرف النفي المشدد Rarely لتقديم نبرة بلاغية عالية الرفعة.',
    grammarFocusAr: 'القلب النحوي البلاغي (Negative Inversion)',
  },
  {
    id: 'sb-c2-1',
    level: 'C2',
    promptAr: 'لم يكن التوصل إلى وفاق دائم أمراً يسيراً بأي حال.',
    correctSentence: 'Achieving lasting harmony was by no means an effortless endeavor.',
    wordTiles: ['Achieving', 'lasting', 'harmony', 'was', 'by', 'no', 'means', 'an', 'effortless', 'endeavor.'],
    explanationAr: 'توظيف أسلوب Litotes البلاغي للتأكيد من خلال نفي النقيض بأسلوب دبلوماسي رفيع.',
    grammarFocusAr: 'البلاغة النثرية وأسلوب Litotes المتقدم',
  },
];
