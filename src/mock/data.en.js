/**
 * Англійські версії записів контенту, ключ — id запису.
 * У проді це окремі локалізовані записи в CMS з фолбеком на основну мову.
 * Якщо для запису перекладу немає — інтерфейс показує український текст
 * і позначку «Переклад готується». Саме так це працюватиме з реальною CMS.
 */
export const EN = {
  /* --- довідники --- */
  palliative: { title: 'Palliative medicine' },
  oncology: { title: 'Oncology and pain clinics' },
  neurology: { title: 'Neurology' },
  psychiatry: { title: 'Psychiatry' },
  family: { title: 'Family medicine' },
  pharmacy: { title: 'Pharmacy' },

  article: { title: 'Article' },
  guide: { title: 'Clinical guideline' },
  video: { title: 'Video' },
  audio: { title: 'Audio' },
  pdf: { title: 'PDF summary' },
  qa: { title: 'Q&A recording' },

  ecs: { title: 'Endocannabinoid system' },
  pharm: { title: 'Pharmacology of THC and CBD' },
  dosing: { title: 'Dosing and titration' },
  safety: { title: 'Safety and interactions' },
  pain: { title: 'Chronic pain' },
  nausea: { title: 'Nausea and vomiting' },
  legal: { title: 'Legal aspects and e-prescription' },
  communication: { title: 'Patient communication' },

  /* --- факультети (id збігається з довідником спеціальностей, тому окремі ключі) --- */
  'fac-palliative': {
    title: 'Palliative medicine',
    short: 'Symptom control, patient quality of life, working with the family.',
    description:
      'A faculty for palliative care and hospice physicians. We cover the role of medical cannabis in managing pain, nausea, anorexia and sleep disturbance, and interactions with opioids and antiemetics.',
  },
  'fac-oncology': {
    title: 'Oncology + pain clinics',
    short: 'Supportive care, nausea, pain, nutritional support.',
    description:
      'A faculty for oncologists and pain clinic physicians. Supportive care, managing chemotherapy side effects, and the evidence base for cannabinoid use.',
  },
  'fac-ukrfarm': {
    title: 'Ukrfarm medical representatives',
    short: 'Internal faculty. Access by company invitation.',
    description:
      'An internal programme for Ukrfarm medical representatives: product knowledge, ethics of communicating with physicians, the legal limits of promotion, and handling objections.',
  },

  /* --- Основи --- */
  'b-ecs': {
    title: 'The endocannabinoid system',
    body: 'CB1 and CB2 receptors, endogenous ligands, and their role in nociception, appetite, immune response and neuroprotection. Why effects depend on receptor location.',
  },
  'b-pharm': {
    title: 'Pharmacology of THC and CBD',
    body: 'Pharmacokinetics and pharmacodynamics of the main cannabinoids, routes of administration, bioavailability, CYP450 metabolism, onset and duration of action.',
  },
  'b-evidence': {
    title: 'Indications and levels of evidence',
    body: 'Organised by evidence level: chronic pain, spasticity in MS, chemotherapy-induced nausea, refractory epilepsy. And where the evidence is insufficient.',
  },
  'b-dosing': {
    title: 'Dosing and titration',
    body: 'The “start low, go slow” principle. Starting doses, titration steps, target dose, and criteria for stopping. Differences between naive and experienced patients.',
  },
  'b-safety': {
    title: 'Safety and interactions',
    body: 'Adverse effects, contraindications, interactions with anticoagulants, benzodiazepines, opioids and antiepileptics. Patient monitoring.',
  },
  'b-groups': {
    title: 'Special patient groups',
    body: 'Older patients, patients with hepatic and renal impairment, psychiatric history, pregnancy and lactation, paediatrics.',
  },
  'b-legal': {
    title: 'Legal aspects and e-prescription',
    body: 'Current Ukrainian legislation, the prescribing procedure, e-prescription, record keeping, and the liability of the physician and the institution.',
  },
  'b-communication': {
    title: 'Patient communication',
    body: 'How to discuss therapy without stigma, informed consent, patient and family expectations, and addressing myths.',
  },

  /* --- матеріали --- */
  m1: {
    title: 'Titrating cannabinoids in palliative patients: a step-by-step algorithm',
    excerpt: 'A practical dose-selection algorithm with checkpoints and discontinuation criteria.',
  },
  m2: {
    title: 'The endocannabinoid system: what every practising physician should know',
    excerpt: 'A review of ECS physiology and its clinical implications.',
  },
  m3: {
    title: 'Cannabinoid–opioid interactions: a case-based review',
    excerpt: 'A 14-minute video lecture walking through three clinical cases.',
  },
  m4: {
    title: 'Summary: pharmacology of THC and CBD',
    excerpt: 'An interactive A4 summary based on module 2.',
  },
  m5: {
    title: 'Q&A recording: physicians’ questions on e-prescription',
    excerpt: 'A 58-minute session with per-question timecodes and an audio version.',
  },
  m6: {
    title: 'Cannabinoids in chemotherapy-induced nausea: an evidence review',
    excerpt: 'What the meta-analyses say and where the limits of use are.',
  },
  m7: {
    title: 'Audio lecture: communicating with patients without stigma',
    excerpt: 'Audio version of the lecture, 16 minutes, available to download.',
  },
  m8: {
    title: 'Contraindications and red flags before prescribing',
    excerpt: 'A patient assessment checklist to use before starting therapy.',
  },
  m9: {
    title: 'The legal landscape of medical cannabis in Ukraine as of 2026',
    excerpt: 'A timeline of legislative change and what it means for physicians.',
  },
  m10: {
    title: 'Technical walkthrough: issuing an e-prescription',
    excerpt: 'A 4-minute step-by-step guide inside the e-prescription system.',
  },
  m11: {
    title: 'Dosing in older patients with polypharmacy',
    excerpt: 'Adjusting starting doses and monitoring for interactions.',
  },
  m12: {
    title: 'A5 flyer: physician algorithm (desk reference)',
    excerpt: 'A printable desk reference, available to download.',
  },

  /* --- події --- */
  e1: {
    title: 'Q&A session: questions after module 4 (Palliative medicine)',
    description: 'A live question-and-answer session covering modules 1–4.',
    place: 'Zoom',
  },
  e2: {
    title: 'Interdisciplinary round table: pain in oncology',
    description: 'An in-person collegial discussion for oncologists and pain clinic physicians.',
    place: 'Kyiv, 33 Bulvarno-Kudriavska St.',
  },
  e3: {
    title: 'Webinar: e-prescription in practice',
    description: 'A walkthrough of the most common prescribing mistakes.',
    place: 'Zoom',
  },
  e4: {
    title: 'CannaMed Scientific and Practical Conference 2026',
    description: 'The annual conference with plenary talks and breakout sessions.',
    place: 'Kyiv + online stream',
  },
  e5: {
    title: 'Q&A session: Ukrfarm internal faculty',
    description: 'A closed session for medical representatives.',
    place: 'Zoom (closed session)',
  },
  e6: {
    title: 'Archive: Academy introductory webinar',
    description: 'The recording is available in the library.',
    place: 'Zoom',
  },

  /* --- новини --- */
  n1: {
    category: 'Regulation',
    title: 'The Ministry of Health has updated the prescribing procedure: what changes for physicians',
    excerpt: 'The key amendments and what they mean in day-to-day practice.',
    body: 'The Ministry of Health has published an updated procedure for prescribing medical cannabis products. For physicians, the key changes concern the e-prescription form, the validity period of a prescription, and the requirements for documenting clinical justification.',
  },
  n2: {
    category: 'Academy',
    title: 'Enrolment is open for the “Oncology + pain clinics” faculty',
    excerpt: 'The first wave of training starts in December.',
    body: 'The faculty comprises 8 modules and 2 Q&A sessions with experts. Registration is open to oncologists and pain clinic physicians once their credentials are verified.',
  },
  n3: {
    category: 'Research',
    title: 'New meta-analysis: cannabinoids in neuropathic pain',
    excerpt: 'A review of 28 RCTs and what applies in Ukraine.',
    body: 'A meta-analysis of 28 randomised controlled trials has been published. The authors report a moderate effect in the subgroup of patients with neuropathic pain refractory to first-line therapy.',
  },
  n4: {
    category: 'Events',
    title: 'CannaMed 2026 Conference: programme and registration',
    excerpt: 'The full programme of talks is now available.',
    body: 'The annual scientific and practical conference takes place on 18 December in a hybrid format.',
  },

  /* --- експерти --- */
  x1: {
    specialty: 'Palliative medicine',
    qualification: 'MD, PhD, Professor',
    org: 'Bogomolets National Medical University',
    role: 'Chair of the Advisory Board',
    bio: 'Over 20 years in palliative care, author of national guidelines on pain management.',
  },
  x2: {
    specialty: 'Algology',
    qualification: 'MD, PhD',
    org: 'Pain Treatment Centre',
    role: 'Medical reviewer',
    bio: 'Specialises in the pharmacotherapy of chronic pain and in titration.',
  },
  x3: {
    specialty: 'Oncology',
    qualification: 'MD, PhD',
    org: 'National Cancer Institute',
    role: 'Board member',
    bio: 'Supportive care for oncology patients, evidence-based medicine.',
  },
  x4: {
    specialty: 'Neurology',
    qualification: 'MD, PhD',
    org: 'Clinic of Neurosciences',
    role: 'Board member',
    bio: 'Endocannabinoid system, neuroprotection, epilepsy.',
  },
  x5: {
    specialty: 'Clinical pharmacology',
    qualification: 'MD, PhD',
    org: 'State Expert Centre, Ministry of Health of Ukraine',
    role: 'Board member',
    bio: 'Drug interactions and pharmacotherapy safety.',
  },
  x6: {
    specialty: 'Medical psychology',
    qualification: 'PhD in Psychology',
    org: '“Svitlo” Hospice',
    role: 'Board member',
    bio: 'Communication with patients and families, overcoming stigma.',
  },

  /* --- лічильники --- */
  'cnt-0': { label: 'physicians trained' },
  'cnt-1': { label: 'lectures listened to (thousands)' },
  'cnt-2': { label: 'certificates issued' },

  /* --- FAQ --- */
  'faq-0': {
    q: 'Who can register with the Academy?',
    a: 'Physicians and pharmacists who can confirm their credentials with a document. An administrator reviews each application within 1–2 business days.',
  },
  'faq-1': {
    q: 'Do I earn CPD credits?',
    a: 'Not at this stage. The Academy issues its own certificate with a unique number.',
  },
  'faq-2': {
    q: 'How long does a course take?',
    a: 'A faculty course is 8 modules of 10–15 minutes of video plus tests. Roughly 1–2 hours a week.',
  },
  'faq-3': {
    q: 'Can I study on a phone?',
    a: 'Yes, the platform is adapted for smartphones and tablets. Audio versions of lectures are available to download.',
  },
  'faq-4': {
    q: 'What if I fail a test?',
    a: 'Retakes are available after a 24-hour interval. After each attempt you see your mistakes with explanations.',
  },

  /* --- курс --- */
  'course-palliative': {
    title: 'Palliative medicine: medical cannabis in clinical practice',
    description:
      '8 modules and 2 Q&A sessions. The test pass mark is 80%. An Academy certificate is issued on completion.',
    completionRule: 'All 8 modules + passed tests (≥80%)',
  },
  'mod-1': { title: 'The endocannabinoid system' },
  'mod-2': { title: 'Pharmacology of THC and CBD' },
  'mod-3': { title: 'Indications and levels of evidence' },
  'mod-4': { title: 'Dosing and titration' },
  'mod-5': { title: 'Safety and interactions' },
  'mod-6': { title: 'Special patient groups' },
  'mod-7': { title: 'Legal aspects and e-prescription' },
  'mod-8': { title: 'Patient communication' },
  'mod-qa1': { title: 'Q&A session 1 (after module 4)' },
  'mod-qa2': { title: 'Q&A session 2 (after module 8)' },

  /* --- заняття --- */
  lesson: { title: 'Module 4. Dosing and titration' },
  'ch-0': { title: 'Introduction: the start low, go slow principle' },
  'ch-1': { title: 'Starting doses for naive patients' },
  'ch-2': { title: 'Titration step and checkpoints' },
  'ch-3': { title: 'Target dose and effect plateau' },
  'ch-4': { title: 'Discontinuation criteria and de-escalation' },

  /* --- тест --- */
  'q-1': {
    text: 'What is the fundamental principle when starting cannabinoid therapy in a naive patient?',
    options: [
      'Go straight to the target dose for a fast effect',
      'Start low, go slow — minimum starting dose with gradual increase',
      'The dose is calculated from body weight alone',
      'The starting dose does not matter',
    ],
    explanation:
      'The titration standard is a minimum starting dose increased every 2–3 days until clinical effect or the limit of tolerability.',
  },
  'q-2': {
    text: 'Which drug classes require extra caution because of interactions? (multiple answers)',
    options: ['Anticoagulants (warfarin)', 'Benzodiazepines', 'Topical antiseptics', 'Antiepileptic drugs'],
    explanation: 'Interactions are mediated mainly through CYP450 and by additive sedative effects.',
  },
  'q-3': {
    text: 'What is the minimum sensible interval before assessing effect after a dose increase?',
    options: ['2–3 days', '2–3 hours', '2–3 weeks', 'No assessment needed'],
    explanation: 'A 2–3 day interval allows a steady concentration to be reached and tolerability to be judged correctly.',
  },
}
