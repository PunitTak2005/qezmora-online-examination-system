const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Exam = require('../models/Exam');
const Question = require('../models/Question');
const Category = require('../models/Category');

dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/onlineexam';

// Exam ObjectIds as specified
const GRAMMAR_EXAM_ID = "6a9804ed171a56dc1f6c5e7b";
const RC_EXAM_ID      = "6a9804ed171a56dc1f6c5e7c";
const BE_EXAM_ID      = "6a9804ed171a56dc1f6c5e7d";

// ─── 1. English Grammar (20 Questions) ───
const grammarQuestions = [
  {
    question: "By the time the manager arrived, the team _____ the quarterly presentation.",
    options: ["has finished", "had finished", "finishes", "was finishing"],
    correctAnswer: "had finished",
    explanation: "Past Perfect ('had finished') indicates an action completed prior to another past event ('arrived')."
  },
  {
    question: "She _____ for the logistics firm since 2018.",
    options: ["works", "is working", "has been working", "worked"],
    correctAnswer: "has been working",
    explanation: "Present Perfect Continuous ('has been working') describes an ongoing action starting in the past."
  },
  {
    question: "Tomorrow at 10 AM, the board _____ our annual expansion strategy.",
    options: ["will be discussing", "discussions", "discussed", "has discussed"],
    correctAnswer: "will be discussing",
    explanation: "Future Continuous ('will be discussing') refers to an action in progress at a specific future time."
  },
  {
    question: "Neither the supervisor nor the employees _____ aware of the policy revision.",
    options: ["was", "were", "is", "has been"],
    correctAnswer: "were",
    explanation: "In 'neither/nor' structures, the verb agrees with the subject closer to it ('employees' -> 'were')."
  },
  {
    question: "Every student and faculty member _____ required to complete safety compliance training.",
    options: ["are", "is", "were", "have been"],
    correctAnswer: "is",
    explanation: "Subjects preceded by 'every' take singular verbs ('is')."
  },
  {
    question: "Ten thousand dollars _____ a substantial allocation for this preliminary research.",
    options: ["are", "is", "were", "have been"],
    correctAnswer: "is",
    explanation: "Sums of money take singular verbs when considered as a single unit ('is')."
  },
  {
    question: "He is _____ European consultant specializing in global supply chain logistics.",
    options: ["a", "an", "the", "no article"],
    correctAnswer: "a",
    explanation: "'European' begins with a consonant sound ('yoo-'), taking the article 'a'."
  },
  {
    question: "She graduated from _____ Oxford University last summer with honors.",
    options: ["a", "an", "the", "no article"],
    correctAnswer: "no article",
    explanation: "Proper names of institutions with 'University' after the name generally take no article."
  },
  {
    question: "The agreement was executed _____ mutual consent of both commercial parties.",
    options: ["with", "by", "under", "in"],
    correctAnswer: "by",
    explanation: "'By mutual consent' is the standard legal and professional phrase."
  },
  {
    question: "Our management team is confident _____ achieving our annual performance targets.",
    options: ["of", "in", "for", "with"],
    correctAnswer: "in",
    explanation: "'Confident in [action]' or 'confident of [outcome]' are standard prepositions."
  },
  {
    question: "Each of the candidates brought _____ own portfolio to the technical evaluation.",
    options: ["their", "his or her", "its", "our"],
    correctAnswer: "his or her",
    explanation: "Formal singular distributive pronoun 'Each' takes singular possessive 'his or her'."
  },
  {
    question: "Between you and _____, the software proposal requires further financial scrutiny.",
    options: ["I", "me", "myself", "we"],
    correctAnswer: "me",
    explanation: "Prepositions like 'between' take objective pronouns ('me')."
  },
  {
    question: "Choose the correct passive voice: 'The committee approved the annual budget.'",
    options: [
      "The annual budget approved the committee.",
      "The annual budget was approved by the committee.",
      "The annual budget has been approved.",
      "The committee was approved by the budget."
    ],
    correctAnswer: "The annual budget was approved by the committee.",
    explanation: "Simple past passive formula: Object + was + past participle + by subject."
  },
  {
    question: "Choose the correct passive voice: 'The engineering team is testing the new application.'",
    options: [
      "The new application is tested by the engineering team.",
      "The new application is being tested by the engineering team.",
      "The new application was tested by the team.",
      "The new application has been tested."
    ],
    correctAnswer: "The new application is being tested by the engineering team.",
    explanation: "Present continuous passive formula: Object + is being + past participle."
  },
  {
    question: "Choose the correct indirect speech: She said, 'I can complete the analysis today.'",
    options: [
      "She said that she can complete the analysis today.",
      "She said that she could complete the analysis that day.",
      "She says that she could complete the analysis today.",
      "She said that I could complete the analysis that day."
    ],
    correctAnswer: "She said that she could complete the analysis that day.",
    explanation: "Modal 'can' shifts to 'could', and 'today' shifts to 'that day' in reported past."
  },
  {
    question: "Choose the correct indirect speech: He asked, 'Have you submitted the report?'",
    options: [
      "He asked if I had submitted the report.",
      "He asked that have I submitted the report.",
      "He asked whether I submit the report.",
      "He asked if I have submitted the report."
    ],
    correctAnswer: "He asked if I had submitted the report.",
    explanation: "Yes/No reported questions use 'if' or 'whether' with past perfect backshift."
  },
  {
    question: "All employees _____ submit their quarterly expense reports by Friday 5 PM.",
    options: ["might", "must", "could", "would"],
    correctAnswer: "must",
    explanation: "'Must' expresses formal organizational requirement and duty."
  },
  {
    question: "You _____ verify the calculations before publishing the audited figures.",
    options: ["ought to", "might", "may", "can"],
    correctAnswer: "ought to",
    explanation: "'Ought to' expresses strong moral or professional advisability."
  },
  {
    question: "Identify the grammatically correct sentence.",
    options: [
      "Hardly had the meeting started when the projector malfunctioned.",
      "Hardly the meeting had started than the projector malfunctioned.",
      "Hardly did the meeting start then the projector malfunctioned.",
      "Hardly had the meeting started than the projector malfunctioned."
    ],
    correctAnswer: "Hardly had the meeting started when the projector malfunctioned.",
    explanation: "Negative inversion 'Hardly had... when...' pairs auxiliary 'had' with 'when'."
  },
  {
    question: "Identify the grammatically correct sentence.",
    options: [
      "Not only did he complete the project, but he also presented it.",
      "Not only he completed the project, but also he presented it.",
      "Not only did he completed the project, but he presented it.",
      "Not only he did complete the project, but also presented it."
    ],
    correctAnswer: "Not only did he complete the project, but he also presented it.",
    explanation: "'Not only... but also...' requires subject-verb inversion after the initial negative conjunction."
  }
];

// ─── 2. Reading Comprehension (5 Passages, 20 Questions) ───
const passages = {
  p1: "Passage 1 — Sustainable Technology:\nSustainable technology focuses on developing clean innovations that minimize environmental impact while maintaining economic growth. Renewable energy systems, energy-efficient data centers, and circular manufacturing processes are transforming traditional industries. Companies that adopt green tech not only lower carbon footprints but also gain a competitive edge as eco-conscious consumers favor responsible brands.",
  p2: "Passage 2 — Modern Entrepreneurship:\nModern entrepreneurship thrives on agility, customer feedback, and iterative design. Startup founders increasingly build Minimum Viable Products (MVPs) to test core assumptions before committing substantial capital. While high risk accompanies early-stage ventures, continuous learning and data-driven pivot strategies significantly increase survival rates in dynamic markets.",
  p3: "Passage 3 — Commercial Spaceflight:\nDeep space exploration has expanded beyond national space agencies into commercial spaceflight enterprises. Satellite constellations, reusable rocket boosters, and lunar base architectures are lowering orbital launch costs dramatically. These technological breakthroughs are opening new frontiers for scientific research, asteroid mining, and interplanetary communication networks.",
  p4: "Passage 4 — Digital Privacy Regulations:\nAs digital services accumulate vast amounts of user telemetry, privacy regulation has become a vital safeguard. Global frameworks like GDPR enforce strict standards on data collection, consent, and user autonomy. Organizations must implement robust encryption and transparent policies to earn public trust and avoid severe regulatory penalties.",
  p5: "Passage 5 — Climate Resilience:\nClimate resilience requires a dual strategy: reducing global emissions through clean energy and adapting infrastructure to withstand extreme weather. Urban planners are deploying green roofs, permeable pavements, and smart grids to build climate-resilient cities. Proactive investments today reduce long-term disaster recovery costs tenfold."
};

const rcQuestions = [
  // Passage 1
  {
    question: `${passages.p1}\n\nQ1. What is the primary focus of sustainable technology according to the passage?`,
    options: [
      "Maximizing short-term corporate profits",
      "Developing clean innovations that reduce environmental damage",
      "Replacing all traditional manufacturing workers",
      "Eliminating the need for consumer marketing"
    ],
    correctAnswer: "Developing clean innovations that reduce environmental damage",
    explanation: "The text states that sustainable technology focuses on developing clean innovations that minimize environmental impact."
  },
  {
    question: `${passages.p1}\n\nQ2. What can be inferred about eco-conscious consumers from the passage?`,
    options: [
      "They avoid buying technology products altogether.",
      "They prefer purchasing from environmentally responsible companies.",
      "They care exclusively about product pricing.",
      "They prefer traditional manufacturing over green tech."
    ],
    correctAnswer: "They prefer purchasing from environmentally responsible companies.",
    explanation: "The passage notes that eco-conscious consumers favor responsible brands, granting green companies a market advantage."
  },
  {
    question: `${passages.p1}\n\nQ3. In the passage, the phrase 'competitive edge' closest means:`,
    options: ["A legal boundary", "A market advantage over rivals", "A financial deficit", "A technological failure"],
    correctAnswer: "A market advantage over rivals",
    explanation: "'Competitive edge' refers to a superior market position or advantage over business competitors."
  },
  {
    question: `${passages.p1}\n\nQ4. What is the author's tone toward green tech adoption?`,
    options: ["Skeptical", "Encouraging and objective", "Hostile", "Indifferent"],
    correctAnswer: "Encouraging and objective",
    explanation: "The author presents factual economic and environmental benefits in a supportive, professional tone."
  },

  // Passage 2
  {
    question: `${passages.p2}\n\nQ5. What is the primary message regarding modern startups in the passage?`,
    options: [
      "Startups should avoid testing products before launch.",
      "Iterative testing and customer feedback help mitigate startup risks.",
      "Capital investment is the only factor determining success.",
      "Founders should never pivot from their original business plan."
    ],
    correctAnswer: "Iterative testing and customer feedback help mitigate startup risks.",
    explanation: "The text emphasizes that MVPs, customer feedback, and pivot strategies improve survival rates."
  },
  {
    question: `${passages.p2}\n\nQ6. Why do founders create a Minimum Viable Product (MVP)?`,
    options: [
      "To maximize initial manufacturing scale",
      "To validate core business assumptions with minimal capital risk",
      "To eliminate the need for marketing",
      "To hire a larger workforce quickly"
    ],
    correctAnswer: "To validate core business assumptions with minimal capital risk",
    explanation: "Founders build MVPs to test core assumptions before committing substantial financial capital."
  },
  {
    question: `${passages.p2}\n\nQ7. The word 'iterative' as used in the passage implies:`,
    options: ["One-time final execution", "Repeated cycles of testing and refinement", "Random decision making", "Permanent stagnation"],
    correctAnswer: "Repeated cycles of testing and refinement",
    explanation: "'Iterative' refers to a process of continuous, incremental cycles of development and improvement."
  },
  {
    question: `${passages.p2}\n\nQ8. According to the passage, what increases a startup's survival rate?`,
    options: [
      "Ignoring customer reviews",
      "Continuous learning and data-driven pivot strategies",
      "Relying solely on traditional loans",
      "Avoiding digital technologies"
    ],
    correctAnswer: "Continuous learning and data-driven pivot strategies",
    explanation: "The final sentence explicitly highlights continuous learning and data-driven pivot strategies."
  },

  // Passage 3
  {
    question: `${passages.p3}\n\nQ9. Which trend in space exploration is highlighted in the text?`,
    options: [
      "Declining public interest in planetary science",
      "The growth of commercial spaceflight reducing launch costs",
      "Complete cessation of government space budgets",
      "A shift toward single-use rockets"
    ],
    correctAnswer: "The growth of commercial spaceflight reducing launch costs",
    explanation: "The text details how commercial space enterprises and reusable boosters lower launch costs dramatically."
  },
  {
    question: `${passages.p3}\n\nQ10. What is one direct consequence of reusable rocket technology?`,
    options: [
      "Increased space mission danger",
      "Dramatically lowered orbital launch costs",
      "Higher fuel consumption per launch",
      "Termination of satellite constellations"
    ],
    correctAnswer: "Dramatically lowered orbital launch costs",
    explanation: "The text directly connects reusable boosters and architectures to dramatically lower orbital costs."
  },
  {
    question: `${passages.p3}\n\nQ11. The word 'dramatically' in the passage closest means:`,
    options: ["Slightly", "Substantially and noticeably", "Temporarily", "Unimportantly"],
    correctAnswer: "Substantially and noticeably",
    explanation: "'Dramatically' signifies a major, striking, and noticeable reduction."
  },
  {
    question: `${passages.p3}\n\nQ12. What is the author's primary purpose in Passage 3?`,
    options: [
      "To criticize commercial space ventures",
      "To inform readers about advances in commercial space exploration",
      "To promote a specific aerospace stock",
      "To explain planetary geology"
    ],
    correctAnswer: "To inform readers about advances in commercial space exploration",
    explanation: "The author objective describes new frontiers opened by commercial space breakthroughs."
  },

  // Passage 4
  {
    question: `${passages.p4}\n\nQ13. What is the main topic of Passage 4?`,
    options: [
      "Software installation procedures",
      "The importance of data privacy regulations and transparency",
      "Social media marketing strategies",
      "Hardware manufacturing standards"
    ],
    correctAnswer: "The importance of data privacy regulations and transparency",
    explanation: "The passage discusses privacy regulations like GDPR, encryption, and earning public trust."
  },
  {
    question: `${passages.p4}\n\nQ14. Why are privacy frameworks like GDPR necessary?`,
    options: [
      "To prevent companies from using computers",
      "To protect consumer personal data and enforce strict consent standards",
      "To increase software subscription fees",
      "To eliminate digital services"
    ],
    correctAnswer: "To protect consumer personal data and enforce strict consent standards",
    explanation: "The passage notes GDPR enforces strict standards on data collection, consent, and user autonomy."
  },
  {
    question: `${passages.p4}\n\nQ15. The word 'telemetry' in the passage refers to:`,
    options: [
      "Hardware repair tools",
      "Automated user data and activity monitoring records",
      "Television broadcasting signals",
      "Financial audit reports"
    ],
    correctAnswer: "Automated user data and activity monitoring records",
    explanation: "Telemetry refers to automatic collection and measurement of user operational data."
  },
  {
    question: `${passages.p4}\n\nQ16. What tone does the author express regarding user privacy?`,
    options: ["Dismissive", "Serious and advocacy-oriented", "Amused", "Hostile toward consumers"],
    correctAnswer: "Serious and advocacy-oriented",
    explanation: "The author describes privacy as a 'vital safeguard' requiring robust corporate compliance."
  },

  // Passage 5
  {
    question: `${passages.p5}\n\nQ17. What dual strategy is necessary for climate resilience?`,
    options: [
      "Increasing fossil fuels while building dams",
      "Mitigating emissions while adapting urban infrastructure",
      "Stopping urban growth completely",
      "Focusing exclusively on weather forecasting"
    ],
    correctAnswer: "Mitigating emissions while adapting urban infrastructure",
    explanation: "The text specifies reducing global emissions and adapting infrastructure to withstand weather."
  },
  {
    question: `${passages.p5}\n\nQ18. What economic benefit of proactive climate investment is mentioned?`,
    options: [
      "It doubles annual city tax revenue instantly.",
      "It reduces long-term disaster recovery costs tenfold.",
      "It eliminates construction labor fees.",
      "It replaces electrical grids completely."
    ],
    correctAnswer: "It reduces long-term disaster recovery costs tenfold.",
    explanation: "The final sentence states proactive investments reduce long-term disaster recovery costs tenfold."
  },
  {
    question: `${passages.p5}\n\nQ19. The word 'permeable' most closely means:`,
    options: ["Impervious and solid", "Allowing liquids to pass through", "Extremely fragile", "Artificially colored"],
    correctAnswer: "Allowing liquids to pass through",
    explanation: "'Permeable' refers to materials that allow water or fluids to filter through."
  },
  {
    question: `${passages.p5}\n\nQ20. Which statement best summarizes Passage 5?`,
    options: [
      "Weather disasters cannot be mitigated.",
      "Proactive infrastructure adaptation is essential for long-term climate resilience.",
      "Green roofs are too expensive for modern cities.",
      "Urban planning should focus solely on energy sales."
    ],
    correctAnswer: "Proactive infrastructure adaptation is essential for long-term climate resilience.",
    explanation: "The central message advocates combining clean energy with climate-resilient urban infrastructure."
  }
];

// ─── 3. Business English (20 Questions) ───
const beQuestions = [
  {
    question: "Which email subject line is most appropriate for a formal quarterly client update?",
    options: [
      "hey check this out",
      "Project Update: Q3 Deliverables Timeline - Acme Corp",
      "URGENT!!!! READ NOW",
      "Meeting stuff"
    ],
    correctAnswer: "Project Update: Q3 Deliverables Timeline - Acme Corp",
    explanation: "A clear, specific subject line identifies the topic, timeline, and client context professionally."
  },
  {
    question: "What is the standard professional phrase when attaching a report to a business email?",
    options: [
      "Here is the report take a look.",
      "Please find attached the requested financial summary for your review.",
      "I put the file here.",
      "Attached is things."
    ],
    correctAnswer: "Please find attached the requested financial summary for your review.",
    explanation: "'Please find attached...' is the standard formal business phrasing."
  },
  {
    question: "Which closing is most suitable for a formal executive proposal email?",
    options: ["Cheers", "Sincerely yours", "Later", "Thx"],
    correctAnswer: "Sincerely yours",
    explanation: "'Sincerely yours' or 'Kind regards' maintain formal professional standards."
  },
  {
    question: "What should you communicate if you cannot immediately answer a complex client inquiry?",
    options: [
      "Ignore the message until you have the answer.",
      "Acknowledge receipt promptly and specify a realistic timeframe for a full response.",
      "Tell the client to ask someone else.",
      "Send a quick guess without verifying."
    ],
    correctAnswer: "Acknowledge receipt promptly and specify a realistic timeframe for a full response.",
    explanation: "Prompt acknowledgment with a clear follow-up commitment demonstrates professionalism."
  },
  {
    question: "What is the primary role of a meeting facilitator?",
    options: [
      "To take down attendance names only",
      "To guide discussion and keep attendees focused on agenda topics",
      "To make all operational decisions single-handedly",
      "To criticize participant opinions"
    ],
    correctAnswer: "To guide discussion and keep attendees focused on agenda topics",
    explanation: "Facilitators structure dialogue, manage time, and keep meetings focused on agenda objectives."
  },
  {
    question: "Which phrase politely interrupts a speaker during a remote executive meeting?",
    options: [
      "Stop talking for a second.",
      "May I briefly interject with a relevant point on this item?",
      "You're wrong about that.",
      "Be quiet now."
    ],
    correctAnswer: "May I briefly interject with a relevant point on this item?",
    explanation: "'May I interject...' uses polite modal phrasing suitable for formal meetings."
  },
  {
    question: "What are 'action items' in a meeting summary?",
    options: [
      "List of snacks provided",
      "Specific assigned tasks with designated owners and completion deadlines",
      "Transcripts of arguments",
      "Future company holiday dates"
    ],
    correctAnswer: "Specific assigned tasks with designated owners and completion deadlines",
    explanation: "Action items define accountable individuals, expected deliverables, and target completion dates."
  },
  {
    question: "What does the term 'benchmark' mean in corporate performance analysis?",
    options: [
      "A physical desk in an office",
      "A standard or reference point against which performance is measured",
      "A legal penalty",
      "A financial loss"
    ],
    correctAnswer: "A standard or reference point against which performance is measured",
    explanation: "Benchmarking evaluates processes or metrics against industry standards or best practices."
  },
  {
    question: "What does 'synergy' refer to in collaborative corporate teamwork?",
    options: [
      "Conflict between departments",
      "Combined efforts producing a total effect greater than individual efforts",
      "Individual working in isolation",
      "A reduction in staff headcount"
    ],
    correctAnswer: "Combined efforts producing a total effect greater than individual efforts",
    explanation: "Synergy describes cooperative interaction producing an enhanced aggregate result."
  },
  {
    question: "What does the corporate acronym 'ROI' stand for?",
    options: [
      "Rate of Interest",
      "Return on Investment",
      "Risk of Inflation",
      "Resource Allocation Index"
    ],
    correctAnswer: "Return on Investment",
    explanation: "ROI measures profitability by evaluating the ratio of net profit to initial capital invested."
  },
  {
    question: "What is the defining characteristic of a 'win-win' negotiation outcome?",
    options: [
      "One party dominates completely.",
      "Both negotiating parties reach a mutually beneficial agreement.",
      "Neither party accepts any terms.",
      "The contract is cancelled."
    ],
    correctAnswer: "Both negotiating parties reach a mutually beneficial agreement.",
    explanation: "A win-win outcome satisfies core interests of both participating sides."
  },
  {
    question: "Which phrase signals a constructive willingness to compromise during contract negotiations?",
    options: [
      "This is our final non-negotiable offer.",
      "We can consider your timeline request if we adjust the payment terms accordingly.",
      "We reject all your suggestions.",
      "Take it or leave it."
    ],
    correctAnswer: "We can consider your timeline request if we adjust the payment terms accordingly.",
    explanation: "Conditional flexibility ('if we adjust...') opens room for trade-offs."
  },
  {
    question: "What is proper professional etiquette when joining a virtual conference 5 minutes late?",
    options: [
      "Interrupt the speaker to announce your arrival loudly.",
      "Join quietly on mute and follow the ongoing presentation attentively.",
      "Demand the speaker restart from the beginning.",
      "Complain about technical difficulties immediately."
    ],
    correctAnswer: "Join quietly on mute and follow the ongoing presentation attentively.",
    explanation: "Muting upon entry avoids disturbing ongoing presentations."
  },
  {
    question: "How should confidential customer data be handled in external corporate correspondence?",
    options: [
      "Post it on public message boards.",
      "Redact sensitive fields and send via secure, encrypted channels.",
      "Share it freely via unencrypted personal emails.",
      "Include passwords in the email body."
    ],
    correctAnswer: "Redact sensitive fields and send via secure, encrypted channels.",
    explanation: "Data security protocols mandate redaction and encrypted transmission."
  },
  {
    question: "What is the primary purpose of an 'Executive Summary' in a formal business proposal?",
    options: [
      "To list employee contact numbers",
      "To provide a concise overview of key objectives, solutions, and recommendations",
      "To display detailed appendix data tables",
      "To publish legal disclaimers only"
    ],
    correctAnswer: "To provide a concise overview of key objectives, solutions, and recommendations",
    explanation: "Executive summaries synthesize key strategic points for high-level decision makers."
  },
  {
    question: "Which section of a technical proposal details how data was gathered and evaluated?",
    options: ["Conclusion", "Methodology", "Glossary", "Cover Page"],
    correctAnswer: "Methodology",
    explanation: "The Methodology section documents research design, procedures, and analytical frameworks."
  },
  {
    question: "What is the most professional way to place a caller on hold during a business call?",
    options: [
      "Hang up and call back later.",
      "May I place you on a brief hold while I retrieve your account records?",
      "Wait there.",
      "Be quiet while I look."
    ],
    correctAnswer: "May I place you on a brief hold while I retrieve your account records?",
    explanation: "Asking permission politely before placing someone on hold is standard call etiquette."
  },
  {
    question: "How should an administrative assistant record a telephone message for a manager?",
    options: [
      "Rely on memory without writing anything down.",
      "Accurately record caller name, organization, phone number, time, and key message topic.",
      "Ask the caller to call back repeatedly.",
      "Write down only the caller's first name."
    ],
    correctAnswer: "Accurately record caller name, organization, phone number, time, and key message topic.",
    explanation: "Comprehensive message logging ensures clear follow-up action."
  },
  {
    question: "What is the best initial response when handling a client's escalation complaint?",
    options: [
      "Argue that the client is wrong.",
      "Acknowledge the issue empathetically, apologize for the frustration, and propose a clear investigation path.",
      "Forward the email to spam.",
      "Blame another department."
    ],
    correctAnswer: "Acknowledge the issue empathetically, apologize for the frustration, and propose a clear investigation path.",
    explanation: "Empathetic acknowledgment combined with an action plan de-escalates complaints effectively."
  },
  {
    question: "Which phrase is most effective when scheduling an initial discovery call with a prospect?",
    options: [
      "You need to call me now.",
      "Would you be available for a brief 15-minute discovery call next Tuesday at 2 PM?",
      "Call whenever.",
      "I might talk to you next week."
    ],
    correctAnswer: "Would you be available for a brief 15-minute discovery call next Tuesday at 2 PM?",
    explanation: "Offering a specific duration, date, and time makes scheduling easy for prospects."
  }
];

const seedEnglishExams = async () => {
  try {
    console.log('🚀 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✓ Connected to MongoDB\n');

    // Fetch English Category if present
    const englishCategory = await Category.findOne({ slug: 'english' });

    // ─── 1. English Grammar ───
    const grammarExam = await Exam.findById(GRAMMAR_EXAM_ID) || await Exam.findOne({ title: 'English Grammar' });
    if (!grammarExam) {
      console.log('❌ English Grammar Exam not found!');
    } else {
      console.log(`✓ English Grammar found (${grammarExam.title})`);
      await Question.deleteMany({ exam: grammarExam._id });
      const insertedGrammar = await Question.insertMany(grammarQuestions.map(q => ({
        exam: grammarExam._id,
        category: englishCategory ? englishCategory._id : null,
        question: q.question,
        type: 'mcq',
        options: q.options,
        correctAnswer: q.correctAnswer,
        marks: 5,
        difficulty: 'easy',
        explanation: q.explanation,
        status: 'active'
      })));
      grammarExam.questionCount = insertedGrammar.length;
      grammarExam.totalMarks = insertedGrammar.length * 5;
      await grammarExam.save();
      console.log(`✓ Inserted ${insertedGrammar.length} unique questions\n`);
    }

    // ─── 2. Reading Comprehension ───
    const rcExam = await Exam.findById(RC_EXAM_ID) || await Exam.findOne({ title: 'Reading Comprehension' });
    if (!rcExam) {
      console.log('❌ Reading Comprehension Exam not found!');
    } else {
      console.log(`✓ Reading Comprehension found (${rcExam.title})`);
      await Question.deleteMany({ exam: rcExam._id });
      const insertedRC = await Question.insertMany(rcQuestions.map(q => ({
        exam: rcExam._id,
        category: englishCategory ? englishCategory._id : null,
        question: q.question,
        type: 'mcq',
        options: q.options,
        correctAnswer: q.correctAnswer,
        marks: 5,
        difficulty: 'medium',
        explanation: q.explanation,
        status: 'active'
      })));
      rcExam.questionCount = insertedRC.length;
      rcExam.totalMarks = insertedRC.length * 5;
      await rcExam.save();
      console.log(`✓ Inserted ${insertedRC.length} unique questions\n`);
    }

    // ─── 3. Business English ───
    const beExam = await Exam.findById(BE_EXAM_ID) || await Exam.findOne({ title: 'Business English' });
    if (!beExam) {
      console.log('❌ Business English Exam not found!');
    } else {
      console.log(`✓ Business English found (${beExam.title})`);
      await Question.deleteMany({ exam: beExam._id });
      const insertedBE = await Question.insertMany(beQuestions.map(q => ({
        exam: beExam._id,
        category: englishCategory ? englishCategory._id : null,
        question: q.question,
        type: 'mcq',
        options: q.options,
        correctAnswer: q.correctAnswer,
        marks: 5,
        difficulty: 'medium',
        explanation: q.explanation,
        status: 'active'
      })));
      beExam.questionCount = insertedBE.length;
      beExam.totalMarks = insertedBE.length * 5;
      await beExam.save();
      console.log(`✓ Inserted ${insertedBE.length} unique questions\n`);
    }

    console.log('✓ Updated exam statistics\n');
    console.log('Total Questions Added: 60\n');
    console.log('Seed completed successfully.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error executing seedEnglishExams:', error);
    process.exit(1);
  }
};

seedEnglishExams();
