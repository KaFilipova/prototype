// Мокові дані прототипу. У проді це приходить з CMS / LMS API.

export const SPECIALTIES = [
  { id: 'palliative', title: 'Паліативна медицина' },
  { id: 'oncology', title: 'Онкологія та кабінети болю' },
  { id: 'neurology', title: 'Неврологія' },
  { id: 'psychiatry', title: 'Психіатрія' },
  { id: 'family', title: 'Сімейна медицина' },
  { id: 'pharmacy', title: 'Фармація' },
]

export const MATERIAL_TYPES = [
  { id: 'article', title: 'Стаття' },
  { id: 'guide', title: 'Клінічна настанова' },
  { id: 'video', title: 'Відео' },
  { id: 'audio', title: 'Аудіо' },
  { id: 'pdf', title: 'PDF-конспект' },
  { id: 'qa', title: 'Запис Q&A' },
]

export const TOPICS = [
  { id: 'ecs', title: 'Ендоканабіноїдна система' },
  { id: 'pharm', title: 'Фармакологія ТГК і КБД' },
  { id: 'dosing', title: 'Дозування і титрування' },
  { id: 'safety', title: 'Безпека і взаємодії' },
  { id: 'pain', title: 'Хронічний біль' },
  { id: 'nausea', title: 'Нудота і блювання' },
  { id: 'legal', title: 'Правові аспекти і е-рецепт' },
  { id: 'communication', title: 'Комунікація з пацієнтом' },
]

export const FACULTIES = [
  {
    id: 'palliative',
    title: 'Паліативна медицина',
    kind: 'clinical',
    short: 'Контроль симптомів, якість життя пацієнта, робота з родиною.',
    description:
      'Факультет для лікарів паліативної допомоги та хоспісів. Розглядаємо місце медичного канабісу в контролі болю, нудоти, анорексії та порушень сну, взаємодії з опіоїдами й антиеметиками.',
    topics: ['ecs', 'pharm', 'dosing', 'safety', 'pain', 'communication'],
    modules: 8,
    qa: 2,
    students: 142,
    cover: '🫁',
  },
  {
    id: 'oncology',
    title: 'Онкологія + кабінети болю',
    kind: 'clinical',
    short: 'Супровідна терапія, нудота, біль, нутритивна підтримка.',
    description:
      'Факультет для онкологів та лікарів кабінетів болю. Супровідна терапія, керування побічними ефектами хіміотерапії, доказова база застосування канабіноїдів.',
    topics: ['ecs', 'pharm', 'dosing', 'nausea', 'pain', 'legal'],
    modules: 8,
    qa: 2,
    students: 97,
    cover: '🎗️',
  },
  {
    id: 'ukrfarm',
    title: 'Медпредставники Укрфарму',
    kind: 'internal',
    short: 'Внутрішній факультет. Доступ за запрошенням компанії.',
    description:
      'Внутрішня програма для медичних представників Укрфарму: продуктові знання, етика комунікації з лікарем, правові межі промоції, робота з запереченнями.',
    topics: ['pharm', 'legal', 'communication'],
    modules: 8,
    qa: 2,
    students: 38,
    cover: '🏢',
    internal: true,
  },
]

export const BASICS = [
  { id: 'ecs', title: 'Ендоканабіноїдна система', body: 'Рецептори CB1 і CB2, ендогенні ліганди, роль у ноцицепції, апетиті, імунній відповіді та нейропротекції. Чому ефекти залежать від локалізації рецепторів.' },
  { id: 'pharm', title: 'Фармакологія ТГК і КБД', body: 'Фармакокінетика і фармакодинаміка основних канабіноїдів, шляхи введення, біодоступність, метаболізм через CYP450, час настання й тривалість дії.' },
  { id: 'evidence', title: 'Показання і рівні доказовості', body: 'Систематизація за рівнями доказів: хронічний біль, спастичність при РС, хіміотерапія-індукована нудота, рефрактерна епілепсія. Де доказів недостатньо.' },
  { id: 'dosing', title: 'Дозування і титрування', body: 'Принцип "start low, go slow". Стартові дози, крок титрування, цільова доза, критерії припинення. Різниця для наївних і досвідчених пацієнтів.' },
  { id: 'safety', title: 'Безпека і взаємодії', body: 'Побічні ефекти, протипоказання, взаємодії з антикоагулянтами, бензодіазепінами, опіоїдами, протиепілептичними. Моніторинг пацієнта.' },
  { id: 'groups', title: 'Особливі групи пацієнтів', body: 'Літні пацієнти, пацієнти з печінковою і нирковою недостатністю, психіатричний анамнез, вагітність і лактація, педіатрія.' },
  { id: 'legal', title: 'Правові аспекти і е-рецепт', body: 'Чинне законодавство України, порядок призначення, е-рецепт, облік, відповідальність лікаря та закладу.' },
  { id: 'communication', title: 'Комунікація з пацієнтом', body: 'Як говорити про терапію без стигми, інформована згода, очікування пацієнта і родини, робота з міфами.' },
]

export const MATERIALS = [
  { id: 'm1', type: 'guide', title: 'Титрування канабіноїдів у паліативних пацієнтів: покроковий алгоритм', specialties: ['palliative', 'oncology'], topics: ['dosing', 'pain'], excerpt: 'Практичний алгоритм підбору дози з контрольними точками та критеріями відміни.', author: 'д-р Олена Кравець', reviewer: 'проф. Ігор Соболь', reviewedAt: '2026-10-12', readTime: 9, files: [{ name: 'Алгоритм титрування A4.pdf', size: '1.2 МБ' }], sources: ['EAPC Guidelines 2024', 'Наказ МОЗ України №360'] },
  { id: 'm2', type: 'article', title: 'Ендоканабіноїдна система: що має знати практикуючий лікар', specialties: ['palliative', 'oncology', 'neurology'], topics: ['ecs'], excerpt: 'Оглядова стаття про фізіологію ЕКС та її клінічні проєкції.', author: 'д-р Марія Гриценко', reviewer: 'проф. Ігор Соболь', reviewedAt: '2026-09-28', readTime: 12, files: [], sources: ['Pertwee R., 2023'] },
  { id: 'm3', type: 'video', title: 'Взаємодії канабіноїдів з опіоїдами: розбір клінічних випадків', specialties: ['palliative'], topics: ['safety', 'pain'], excerpt: 'Відеолекція 14 хв з розбором трьох клінічних випадків.', author: 'д-р Андрій Лисенко', reviewer: 'д-р Олена Кравець', reviewedAt: '2026-11-02', readTime: 14, files: [], sources: [] },
  { id: 'm4', type: 'pdf', title: 'Конспект: фармакологія ТГК і КБД', specialties: ['oncology', 'pharmacy'], topics: ['pharm'], excerpt: 'Інтерактивний конспект A4 за матеріалами модуля 2.', author: 'Академія CannaMed', reviewer: 'проф. Ігор Соболь', reviewedAt: '2026-10-30', readTime: 6, files: [{ name: 'Модуль-2-конспект.pdf', size: '3.4 МБ' }], sources: [] },
  { id: 'm5', type: 'qa', title: 'Запис Q&A: питання лікарів про е-рецепт', specialties: ['palliative', 'oncology', 'family'], topics: ['legal'], excerpt: 'Сесія 58 хв з таймкодами за питаннями, доступна аудіоверсія.', author: 'Експертна рада', reviewer: 'д-р Марія Гриценко', reviewedAt: '2026-11-08', readTime: 58, files: [{ name: 'QA-2026-11-08.mp3', size: '42 МБ' }], sources: [] },
  { id: 'm6', type: 'article', title: 'Канабіноїди при хіміотерапія-індукованій нудоті: огляд доказів', specialties: ['oncology'], topics: ['nausea', 'pharm'], excerpt: 'Що кажуть мета-аналізи і де межі застосування.', author: 'д-р Сергій Поліщук', reviewer: 'проф. Ігор Соболь', reviewedAt: '2026-08-19', readTime: 11, files: [], sources: ['Cochrane Review 2023'] },
  { id: 'm7', type: 'audio', title: 'Аудіолекція: комунікація з пацієнтом без стигми', specialties: ['palliative', 'family'], topics: ['communication'], excerpt: 'Аудіоверсія лекції, 16 хв, доступна для завантаження.', author: 'д-р Ірина Мельник', reviewer: 'д-р Олена Кравець', reviewedAt: '2026-10-05', readTime: 16, files: [{ name: 'lecture-communication.mp3', size: '18 МБ' }], sources: [] },
  { id: 'm8', type: 'guide', title: 'Протипоказання і червоні прапорці перед призначенням', specialties: ['palliative', 'oncology', 'psychiatry'], topics: ['safety'], excerpt: 'Чек-лист оцінки пацієнта перед стартом терапії.', author: 'д-р Олена Кравець', reviewer: 'проф. Ігор Соболь', reviewedAt: '2026-11-11', readTime: 7, files: [{ name: 'Чек-лист.pdf', size: '0.8 МБ' }], sources: [] },
  { id: 'm9', type: 'article', title: 'Правове поле медичного канабісу в Україні: стан на 2026 рік', specialties: ['palliative', 'oncology', 'pharmacy', 'family'], topics: ['legal'], excerpt: 'Хронологія змін законодавства і що це означає для лікаря.', author: 'Юридична служба CannaMed', reviewer: 'д-р Марія Гриценко', reviewedAt: '2026-11-15', readTime: 10, files: [], sources: ['Закон України №2469-IX'] },
  { id: 'm10', type: 'video', title: 'Технічна відеоінструкція: виписка е-рецепта', specialties: ['palliative', 'oncology', 'family'], topics: ['legal'], excerpt: 'Покрокова інструкція 4 хв у системі е-рецепт.', author: 'Академія CannaMed', reviewer: 'д-р Андрій Лисенко', reviewedAt: '2026-11-01', readTime: 4, files: [], sources: [] },
  { id: 'm11', type: 'guide', title: 'Дозування у літніх пацієнтів з поліпрагмазією', specialties: ['palliative', 'family'], topics: ['dosing', 'safety'], excerpt: 'Корекція стартових доз і моніторинг взаємодій.', author: 'д-р Сергій Поліщук', reviewer: 'проф. Ігор Соболь', reviewedAt: '2026-09-14', readTime: 8, files: [], sources: [] },
  { id: 'm12', type: 'pdf', title: 'Флаєр А5: алгоритм для лікаря (настільна шпаргалка)', specialties: ['palliative', 'oncology'], topics: ['dosing'], excerpt: 'Друкована шпаргалка, доступна для завантаження і друку.', author: 'Академія CannaMed', reviewer: 'д-р Олена Кравець', reviewedAt: '2026-10-22', readTime: 2, files: [{ name: 'flyer-a5.pdf', size: '0.6 МБ' }], sources: [] },
]

export const EVENTS = [
  { id: 'e1', title: 'Q&A-сесія: питання після модуля 4 (Паліативна медицина)', format: 'online', faculty: 'palliative', date: '2026-11-27', time: '18:00', tz: 'Europe/Kyiv', duration: 60, place: 'Zoom', speakers: ['проф. Ігор Соболь', 'д-р Олена Кравець'], description: 'Жива сесія питань і відповідей за матеріалами модулів 1-4.', program: ['18:00 Вступ і огляд питань', '18:10 Відповіді експертів', '18:45 Питання наживо', '19:00 Завершення'] },
  { id: 'e2', title: 'Міждисциплінарний круглий стіл: біль в онкології', format: 'offline', faculty: 'oncology', date: '2026-12-04', time: '11:00', tz: 'Europe/Kyiv', duration: 180, place: 'Київ, вул. Бульварно-Кудрявська, 33', speakers: ['д-р Сергій Поліщук', 'д-р Андрій Лисенко'], description: 'Очна колегіальна дискусія для онкологів і лікарів кабінетів болю.', program: ['11:00 Реєстрація', '11:30 Доповіді', '13:00 Дискусія', '14:00 Нетворкінг'] },
  { id: 'e3', title: 'Вебінар: е-рецепт на практиці', format: 'online', faculty: 'palliative', date: '2026-12-11', time: '19:00', tz: 'Europe/Kyiv', duration: 45, place: 'Zoom', speakers: ['Юридична служба CannaMed'], description: 'Розбір типових помилок при виписці.', program: ['19:00 Вступ', '19:10 Демонстрація', '19:35 Питання'] },
  { id: 'e4', title: 'Науково-практична конференція CannaMed 2026', format: 'hybrid', faculty: 'oncology', date: '2026-12-18', time: '10:00', tz: 'Europe/Kyiv', duration: 420, place: 'Київ + онлайн-трансляція', speakers: ['Експертна рада Академії'], description: 'Щорічна конференція з доповідями й секційними засіданнями.', program: ['10:00 Пленарне засідання', '13:00 Секції', '16:00 Підсумки'] },
  { id: 'e5', title: 'Q&A-сесія: внутрішній факультет Укрфарму', format: 'online', faculty: 'ukrfarm', date: '2026-12-02', time: '16:00', tz: 'Europe/Kyiv', duration: 60, place: 'Zoom (закрита сесія)', speakers: ['Тренінг-команда Укрфарму'], description: 'Закрита сесія для медпредставників.', program: ['16:00 Вступ', '16:15 Питання'], internal: true },
  { id: 'e6', title: 'Архів: вступний вебінар Академії', format: 'online', faculty: 'palliative', date: '2026-09-18', time: '18:00', tz: 'Europe/Kyiv', duration: 60, place: 'Zoom', speakers: ['д-р Марія Гриценко'], description: 'Запис доступний у бібліотеці.', program: [], past: true },
]

export const NEWS = [
  { id: 'n1', category: 'Законодавство', title: 'МОЗ оновило порядок призначення: що змінилось для лікаря', date: '2026-11-18', author: 'Редакція Академії', source: 'moz.gov.ua', excerpt: 'Ключові зміни в наказі та практичні наслідки для щоденної роботи.', body: 'Міністерство охорони здоровʼя оприлюднило оновлений порядок призначення препаратів на основі медичного канабісу. Для лікаря ключові зміни стосуються форми е-рецепта, строків дії призначення та вимог до документування обґрунтування.' },
  { id: 'n2', category: 'Академія', title: 'Відкрито набір на факультет «Онкологія + кабінети болю»', date: '2026-11-12', author: 'Редакція Академії', source: '', excerpt: 'Перша хвиля навчання стартує у грудні.', body: 'Факультет включає 8 модулів та 2 Q&A-сесії з експертами. Реєстрація відкрита для онкологів і лікарів кабінетів болю після підтвердження фаху.' },
  { id: 'n3', category: 'Дослідження', title: 'Новий мета-аналіз: канабіноїди при нейропатичному болю', date: '2026-11-04', author: 'д-р Сергій Поліщук', source: 'The Lancet', excerpt: 'Огляд 28 РКД і що з цього застосовне в Україні.', body: 'Опубліковано мета-аналіз 28 рандомізованих контрольованих досліджень. Автори відзначають помірний ефект у підгрупі пацієнтів з нейропатичним болем, стійким до першої лінії терапії.' },
  { id: 'n4', category: 'Події', title: 'Конференція CannaMed 2026: програма і реєстрація', date: '2026-10-29', author: 'Редакція Академії', source: '', excerpt: 'Повна програма доповідей уже доступна.', body: 'Щорічна науково-практична конференція відбудеться 18 грудня у гібридному форматі.' },
]

export const EXPERTS = [
  { id: 'x1', name: 'проф. Ігор Соболь', specialty: 'Паліативна медицина', qualification: 'д.мед.н., професор', org: 'НМУ ім. О. О. Богомольця', role: 'Голова експертної ради', bio: 'Понад 20 років у паліативній допомозі, автор національних настанов з контролю болю.', avatar: '👨‍⚕️' },
  { id: 'x2', name: 'д-р Олена Кравець', specialty: 'Алгологія', qualification: 'к.мед.н.', org: 'Центр лікування болю', role: 'Медичний рецензент', bio: 'Спеціалізується на фармакотерапії хронічного болю та титруванні.', avatar: '👩‍⚕️' },
  { id: 'x3', name: 'д-р Сергій Поліщук', specialty: 'Онкологія', qualification: 'к.мед.н.', org: 'Національний інститут раку', role: 'Член ради', bio: 'Супровідна терапія онкологічних пацієнтів, доказова медицина.', avatar: '👨‍⚕️' },
  { id: 'x4', name: 'д-р Марія Гриценко', specialty: 'Неврологія', qualification: 'к.мед.н.', org: 'Клініка нейронаук', role: 'Член ради', bio: 'Ендоканабіноїдна система, нейропротекція, епілепсія.', avatar: '👩‍⚕️' },
  { id: 'x5', name: 'д-р Андрій Лисенко', specialty: 'Клінічна фармакологія', qualification: 'к.мед.н.', org: 'ДЕЦ МОЗ України', role: 'Член ради', bio: 'Лікарські взаємодії, безпека фармакотерапії.', avatar: '👨‍⚕️' },
  { id: 'x6', name: 'д-р Ірина Мельник', specialty: 'Медична психологія', qualification: 'к.психол.н.', org: 'Хоспіс «Світло»', role: 'Член ради', bio: 'Комунікація з пацієнтом і родиною, подолання стигми.', avatar: '👩‍⚕️' },
]

export const COURSE = {
  id: 'course-palliative',
  facultyId: 'palliative',
  title: 'Паліативна медицина: медичний канабіс у клінічній практиці',
  description: '8 модулів та 2 Q&A-сесії. Прохідний бал тесту — 80%. Після завершення курсу видається внутрішній сертифікат.',
  completionRule: 'Усі 8 модулів + успішно складені тести (≥80%)',
  modules: [
    { id: 1, title: 'Ендоканабіноїдна система', status: 'done', score: 90, video: 13, audio: true, pdf: true, test: 12 },
    { id: 2, title: 'Фармакологія ТГК і КБД', status: 'done', score: 85, video: 15, audio: true, pdf: true, test: 15 },
    { id: 3, title: 'Показання і рівні доказовості', status: 'done', score: 95, video: 12, audio: true, pdf: true, test: 10 },
    { id: 4, title: 'Дозування і титрування', status: 'current', score: null, video: 14, audio: true, pdf: true, test: 18 },
    { id: 'qa1', title: 'Q&A-сесія №1 (після модуля 4)', status: 'qa', date: '2026-11-27', kind: 'qa' },
    { id: 5, title: 'Безпека і взаємодії', status: 'locked', score: null, video: 15, audio: true, pdf: true, test: 20 },
    { id: 6, title: 'Особливі групи пацієнтів', status: 'locked', score: null, video: 13, audio: true, pdf: true, test: 14 },
    { id: 7, title: 'Правові аспекти і е-рецепт', status: 'locked', score: null, video: 11, audio: true, pdf: true, test: 12 },
    { id: 8, title: 'Комунікація з пацієнтом', status: 'locked', score: null, video: 12, audio: true, pdf: true, test: 10 },
    { id: 'qa2', title: 'Q&A-сесія №2 (після модуля 8)', status: 'locked', kind: 'qa' },
  ],
}

export const LESSON = {
  moduleId: 4,
  title: 'Модуль 4. Дозування і титрування',
  video: {
    duration: '14:20',
    chapters: [
      { t: '00:00', title: 'Вступ: принцип start low, go slow' },
      { t: '02:15', title: 'Стартові дози для наївних пацієнтів' },
      { t: '05:40', title: 'Крок титрування і контрольні точки' },
      { t: '09:05', title: 'Цільова доза і плато ефекту' },
      { t: '11:50', title: 'Критерії відміни та деескалація' },
    ],
  },
  audio: { duration: '14:20', size: '16 МБ' },
  pdf: { name: 'Модуль-4-конспект.pdf', size: '2.8 МБ', pages: 5 },
  test: { questions: 18, passScore: 80, attempts: 3, interval: '24 години' },
}

export const TEST_QUESTIONS = [
  {
    id: 1,
    text: 'Який принцип є базовим при старті терапії канабіноїдами у наївного пацієнта?',
    multiple: false,
    options: [
      { id: 'a', text: 'Одразу цільова доза для швидкого ефекту' },
      { id: 'b', text: 'Start low, go slow — мінімальна стартова доза з поступовим підвищенням' },
      { id: 'c', text: 'Доза розраховується лише за масою тіла' },
      { id: 'd', text: 'Стартова доза не має значення' },
    ],
    correct: ['b'],
    explanation: 'Стандарт титрування — мінімальна стартова доза з кроком підвищення раз на 2-3 дні до досягнення клінічного ефекту або межі переносимості.',
  },
  {
    id: 2,
    text: 'Які групи препаратів потребують підвищеної уваги через взаємодії? (кілька варіантів)',
    multiple: true,
    options: [
      { id: 'a', text: 'Антикоагулянти (варфарин)' },
      { id: 'b', text: 'Бензодіазепіни' },
      { id: 'c', text: 'Топічні антисептики' },
      { id: 'd', text: 'Протиепілептичні засоби' },
    ],
    correct: ['a', 'b', 'd'],
    explanation: 'Взаємодії реалізуються переважно через систему CYP450 та адитивний седативний ефект.',
  },
  {
    id: 3,
    text: 'Через який мінімальний інтервал доцільно оцінювати ефект після підвищення дози?',
    multiple: false,
    options: [
      { id: 'a', text: '2-3 дні' },
      { id: 'b', text: '2-3 години' },
      { id: 'c', text: '2-3 тижні' },
      { id: 'd', text: 'Оцінка не потрібна' },
    ],
    correct: ['a'],
    explanation: 'Інтервал 2-3 дні дозволяє досягти стабільної концентрації і коректно оцінити переносимість.',
  },
]

export const COUNTERS = [
  { value: '1 240', label: 'лікарів пройшли навчання' },
  { value: '86', label: 'лекцій прослухано (тис.)' },
  { value: '910', label: 'сертифікатів отримано' },
]

export const FAQ = [
  { q: 'Хто може зареєструватися в Академії?', a: 'Лікарі та фармацевти, які можуть підтвердити свій фах документом. Заявку розглядає адміністратор протягом 1-2 робочих днів.' },
  { q: 'Чи нараховуються бали БПР?', a: 'Наразі ні. Академія видає внутрішній сертифікат з унікальним номером.' },
  { q: 'Скільки часу займає курс?', a: 'Курс факультету — 8 модулів по 10-15 хвилин відео плюс тести. Орієнтовно 1-2 години на тиждень.' },
  { q: 'Чи можна проходити навчання з телефона?', a: 'Так, платформа адаптована під смартфони і планшети. Аудіоверсії лекцій доступні для завантаження.' },
  { q: 'Що робити, якщо я не склав тест?', a: 'Доступні повторні спроби з інтервалом 24 години. Після спроби показуються помилки з поясненнями.' },
]

export const SAVED_IDS = ['m1', 'm8']
export const MY_EVENT_IDS = ['e1']

/* ==========================================================================
   Прикріплення англійських версій записів.
   У проді це робить CMS: окремий локалізований запис з фолбеком на основну мову.
   ========================================================================== */
import { EN } from './data.en.js'

const attach = (list, keyFn = (o) => o.id) =>
  list.forEach((o) => {
    const tr = EN[keyFn(o)]
    if (tr) o.en = tr
  })

attach(SPECIALTIES)
attach(MATERIAL_TYPES)
attach(TOPICS)
attach(MATERIALS)
attach(EVENTS)
attach(NEWS)
attach(EXPERTS)
attach(FACULTIES, (f) => `fac-${f.id}`)
attach(BASICS, (b) => `b-${b.id}`)

COUNTERS.forEach((c, i) => { c.en = EN[`cnt-${i}`] })
FAQ.forEach((f, i) => { f.en = EN[`faq-${i}`] })

COURSE.en = EN['course-palliative']
COURSE.modules.forEach((m) => { m.en = EN[`mod-${m.id}`] })

LESSON.en = EN.lesson
LESSON.video.chapters.forEach((c, i) => { c.en = EN[`ch-${i}`] })

TEST_QUESTIONS.forEach((q) => {
  const tr = EN[`q-${q.id}`]
  if (!tr) return
  q.en = { text: tr.text, explanation: tr.explanation }
  q.options.forEach((o, i) => { o.en = { text: tr.options[i] } })
})
