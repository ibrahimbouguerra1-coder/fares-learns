/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ReadingPassage } from '../types/learning.ts';

export const READING_PASSAGES: ReadingPassage[] = [
  {
    id: 'reading-a0-first-day',
    titleAr: 'اليوم الأول في لندن',
    titleEn: 'My First Day in London',
    level: 'A0',
    topic: 'السفر والتعريف بالنفس',
    textEn:
      'Hello! My name is Tariq. Today is my first day in London. The weather is cool and fresh. I see red buses and a big park. People are friendly. I am very happy to learn English here.',
    translationAr:
      'مرحباً! اسمي طارق. اليوم هو يومي الأول في لندن. الطقس بارد ومنعش. أرى حافلات حمراء وحديقة كبيرة. الناس ودودون. أنا سعيد جداً بتعلم الإنجليزية هنا.',
    sentencePairs: [
      { en: 'Hello! My name is Tariq.', ar: 'مرحباً! اسمي طارق.' },
      { en: 'Today is my first day in London.', ar: 'اليوم هو يومي الأول في لندن.' },
      { en: 'The weather is cool and fresh.', ar: 'الطقس بارد ومنعش.' },
      { en: 'I see red buses and a big park.', ar: 'أرى حافلات حمراء وحديقة كبيرة.' },
      { en: 'People are friendly.', ar: 'الناس ودودون ولطفاء.' },
      { en: 'I am very happy to learn English here.', ar: 'أنا سعيد جداً بتعلم الإنجليزية هنا.' },
    ],
    comprehensionQuestions: [
      {
        id: 'q-a0-1',
        question: 'Where is Tariq today?',
        options: ['In London', 'In Paris', 'In New York', 'In Cairo'],
        correctIndex: 0,
        explanationAr: 'يذكر النص بوضوح: "Today is my first day in London".',
      },
      {
        id: 'q-a0-2',
        question: 'What color are the buses Tariq sees?',
        options: ['Blue', 'Yellow', 'Red', 'Green'],
        correctIndex: 2,
        explanationAr: 'ورد في النص: "I see red buses".',
      },
      {
        id: 'q-a0-3',
        question: 'How does Tariq feel about learning English?',
        options: ['Tired', 'Very happy', 'Worried', 'Bored'],
        correctIndex: 1,
        explanationAr: 'الخاتمة تؤكد: "I am very happy to learn English here".',
      },
    ],
  },
  {
    id: 'reading-a1-coffee-shop',
    titleAr: 'صباح في المقهى الصغير',
    titleEn: 'Morning at the Corner Café',
    level: 'A1',
    topic: 'الروتين اليومي والطلب',
    textEn:
      'Sarah visits her favorite coffee shop every morning at seven. She usually orders a cup of black coffee and a warm croissant. She sits by the window and reads a book. The barista knows her name and always greets her with a bright smile.',
    translationAr:
      'تزور سارة مقهاها المفضل كل صباح في السابعة. تطلب عادةً فنجاناً من القهوة السوداء وكرواسون دافئاً. تجلس بجانب النافذة وتقرأ كتاباً. يعرف صانع القهوة اسمها ويحييها دائماً بابتسامة مشرقة.',
    sentencePairs: [
      { en: 'Sarah visits her favorite coffee shop every morning at seven.', ar: 'تزور سارة مقهاها المفضل كل صباح في السابعة.' },
      { en: 'She usually orders a cup of black coffee and a warm croissant.', ar: 'تطلب عادةً فنجاناً من القهوة السوداء وكرواسون دافئاً.' },
      { en: 'She sits by the window and reads a book.', ar: 'تجلس بجانب النافذة وتقرأ كتاباً.' },
      { en: 'The barista knows her name and always greets her with a bright smile.', ar: 'يعرف صانع القهوة اسمها ويحييها دائماً بابتسامة مشرقة.' },
    ],
    comprehensionQuestions: [
      {
        id: 'q-a1-1',
        question: 'What time does Sarah go to the café?',
        options: ['At 6:00 AM', 'At 7:00 AM', 'At 8:30 AM', 'At noon'],
        correctIndex: 1,
        explanationAr: 'تذهب سارة في السابعة صباحاً: "every morning at seven".',
      },
      {
        id: 'q-a1-2',
        question: 'Where does Sarah prefer to sit?',
        options: ['Outside on the patio', 'By the window', 'At the counter', 'In the back corner'],
        correctIndex: 1,
        explanationAr: 'النص يذكر: "She sits by the window".',
      },
    ],
  },
  {
    id: 'reading-b1-remote-work',
    titleAr: 'ثورة العمل عن بُعد',
    titleEn: 'The Evolution of Modern Remote Work',
    level: 'B1',
    topic: 'بيئة العمل والتكنولوجيا',
    textEn:
      'Over the past few years, remote work has fundamentally transformed how global teams collaborate. Employees now value flexibility and saved commuting hours. However, maintaining team cohesion and clear boundaries between work and personal life remains a crucial challenge that organizations must address.',
    translationAr:
      'على مدار السنوات القليلة الماضية، أحدث العمل عن بُعد تحولاً جوهرياً في كيفية تعاون فرق العمل العالمية. يثمّن الموظفون الآن المرونة وتوفير ساعات التنقل. ومع ذلك، يظل الحفاظ على تماسك الفريق ووضع حدود واضحة بين العمل والحياة الشخصية تحدياً حيوياً ينبغي على المؤسسات معالجته.',
    sentencePairs: [
      { en: 'Over the past few years, remote work has fundamentally transformed how global teams collaborate.', ar: 'على مدار السنوات الماضية، أحدث العمل عن بُعد تحولاً جوهرياً في كيفية تعاون فرق العمل العالمية.' },
      { en: 'Employees now value flexibility and saved commuting hours.', ar: 'يثمّن الموظفون الآن المرونة وتوفير ساعات التنقل اليومية.' },
      { en: 'However, maintaining team cohesion and clear boundaries between work and personal life remains a crucial challenge.', ar: 'ومع ذلك، يظل الحفاظ على التماسك والحدود بين العمل والحياة الشخصية تحدياً جوهرياً.' },
    ],
    comprehensionQuestions: [
      {
        id: 'q-b1-1',
        question: 'What is one major benefit of remote work mentioned in the passage?',
        options: [
          'Higher commute costs',
          'Flexibility and saved commuting time',
          'Fewer holidays',
          'Less access to technology',
        ],
        correctIndex: 1,
        explanationAr: 'يذكر النص صراحة تقدير الموظفين للمرونة وتوفير وقت التنقل.',
      },
      {
        id: 'q-b1-2',
        question: 'What is highlighted as an ongoing challenge of remote work?',
        options: [
          'Finding suitable coffee shops',
          'Maintaining team cohesion and work-life boundaries',
          'Buying laptops',
          'Working too few hours',
        ],
        correctIndex: 1,
        explanationAr: 'التحدي هو الحفاظ على تماسك الفريق والفصل بين العمل والحياة الخاصة.',
      },
    ],
  },
  {
    id: 'reading-c1-rhetoric-negotiation',
    titleAr: 'فنون البلاغة في التفاوض الدبلوماسي',
    titleEn: 'The Art of Nuance in Diplomatic Discourse',
    level: 'C1',
    topic: 'الدبلوماسية والبلاغة المتقدمة',
    textEn:
      'Effective diplomats master the subtle interplay between assertion and understatement. By employing rhetorical devices such as litotes and strategic ambiguity, negotiators can diffuse escalating tensions without conceding fundamental principles. Mastery of language is not merely decorative; it is the cornerstone of sustainable international accords.',
    translationAr:
      'يتقن الدبلوماسيون البارعون التفاعل الدقيق بين الجزم وتخفيف حدة القول. ومن خلال توظيف الأساليب البلاغية كنفي النقيض (litotes) والغموض الاستراتيجي، يستطيع المفاوضون نزع فتيل التوترات المتصاعدة دون التنازل عن المبادئ الجوهرية. إن إتقان اللغة ليس مجرد حلية تزيينية؛ بل هو حجر الزاوية للاتفاقيات الدولية المستدامة.',
    sentencePairs: [
      { en: 'Effective diplomats master the subtle interplay between assertion and understatement.', ar: 'يتقن الدبلوماسيون البارعون التفاعل الدقيق بين الجزم وتخفيف حدة القول.' },
      { en: 'By employing rhetorical devices such as litotes and strategic ambiguity, negotiators can diffuse escalating tensions without conceding fundamental principles.', ar: 'بتوظيف أساليب بلاغية كنفي النقيض والغموض الاستراتيجي، يستطيع المفاوضون نزع فتيل التوترات دون التفريط في المبادئ.' },
      { en: 'Mastery of language is not merely decorative; it is the cornerstone of sustainable international accords.', ar: 'إتقان اللغة ليس تزييناً فحسب، بل هو حجر الزاوية للاتفاقيات الدولية المستدامة.' },
    ],
    comprehensionQuestions: [
      {
        id: 'q-c1-1',
        question: 'According to the passage, how do rhetorical devices assist negotiators?',
        options: [
          'They force the opposing party to surrender immediately.',
          'They diffuse escalating tensions without conceding fundamental principles.',
          'They make official speeches unnecessarily lengthy.',
          'They eliminate the need for written treaties.',
        ],
        correctIndex: 1,
        explanationAr: 'الأساليب البلاغية تنزع فتيل التوتر دون التنازل عن المبادئ الأساسية.',
      },
      {
        id: 'q-c1-2',
        question: 'What is described as the "cornerstone of sustainable international accords"?',
        options: [
          'Military supremacy',
          'Financial incentives',
          'Mastery of language',
          'Brief press conferences',
        ],
        correctIndex: 2,
        explanationAr: 'يختم النص بأن إتقان اللغة هو حجر الزاوية للاتفاقيات الدولية المستدامة.',
      },
    ],
  },
];
