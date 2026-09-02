const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Exam = require('../models/Exam');
const Question = require('../models/Question');
const Category = require('../models/Category');

dotenv.config({ path: './.env' });

const seedSystemArchExam = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/onlineexam');
    console.log('🔗 Connected to MongoDB for System Architecture Exam Seeding...');

    // 1. Find or create Category
    let category = await Category.findOne({ name: 'Programming' }) || await Category.findOne({ name: 'Advanced' });
    if (!category) {
      category = await Category.create({
        name: 'Programming',
        slug: 'programming',
        description: 'Advanced System Architecture, Distributed Systems, Microservices, and Cloud Computing.',
        icon: 'Award',
        color: 'purple',
        status: 'Active'
      });
      console.log('✅ Created/Verified Category: Programming');
    }

    // 2. Find Teacher/Admin
    let teacher = await User.findOne({ role: 'admin' }) || await User.findOne({ role: 'teacher' });
    if (!teacher) {
      console.error('❌ No teacher or admin user found to assign the exam to.');
      process.exit(1);
    }

    // 3. Create or Update Exam
    const examData = {
      title: 'Advanced System Architecture & Distributed Systems',
      subject: 'Advanced',
      description: 'Deep dive into microservices, consensus algorithms, event streaming, CAP theorem, load balancing, 2PC, and high-availability system design.',
      duration: 60,
      totalMarks: 100,
      passingMarks: 60,
      teacher: teacher._id,
      status: 'published',
      difficulty: 'hard',
      category: category._id,
      instructions: 'Answer all 20 multiple-choice questions within 60 minutes. Each question carries 5 marks. Auto-graded with instant explanations.'
    };

    let exam = await Exam.findOne({ title: examData.title });
    if (exam) {
      await Exam.updateOne({ _id: exam._id }, examData);
      console.log(`🔄 Updated existing Exam: ${examData.title}`);
    } else {
      exam = await Exam.create(examData);
      console.log(`✅ Created Exam: ${examData.title}`);
    }

    // Clear previous questions for this exam if any
    await Question.deleteMany({ exam: exam._id });

    // 4. Create 20 Questions
    const questions = [
      {
        exam: exam._id,
        question: 'Which CAP theorem property states that every request receives a response, even if it contains stale data?',
        type: 'mcq',
        options: ['A. Consistency', 'B. Availability', 'C. Partition Tolerance', 'D. Durability'],
        correctAnswer: 'B. Availability',
        marks: 5,
        difficulty: 'hard',
        category: category._id,
        topic: 'CAP Theorem',
        explanation: 'Availability ensures every request receives a response, regardless of whether the data is the latest.'
      },
      {
        exam: exam._id,
        question: 'In a microservices architecture, which communication pattern is best for decoupled asynchronous processing?',
        type: 'mcq',
        options: ['A. HTTP Polling', 'B. WebSocket', 'C. Message Queue', 'D. FTP'],
        correctAnswer: 'C. Message Queue',
        marks: 5,
        difficulty: 'hard',
        category: category._id,
        topic: 'Microservices',
        explanation: 'Message queues enable asynchronous communication and reduce service dependencies.'
      },
      {
        exam: exam._id,
        question: 'What is the primary purpose of a load balancer?',
        type: 'mcq',
        options: ['A. Encrypt traffic', 'B. Compress responses', 'C. Distribute incoming requests across servers', 'D. Store user sessions permanently'],
        correctAnswer: 'C. Distribute incoming requests across servers',
        marks: 5,
        difficulty: 'medium',
        category: category._id,
        topic: 'Load Balancing',
        explanation: 'Load balancers improve scalability and reliability by distributing traffic.'
      },
      {
        exam: exam._id,
        question: 'Which database consistency model guarantees that all replicas eventually reach the same state?',
        type: 'mcq',
        options: ['A. Strong Consistency', 'B. Linearizability', 'C. Eventual Consistency', 'D. Sequential Consistency'],
        correctAnswer: 'C. Eventual Consistency',
        marks: 5,
        difficulty: 'hard',
        category: category._id,
        topic: 'Database Systems',
        explanation: 'Eventual consistency allows temporary differences between replicas.'
      },
      {
        exam: exam._id,
        question: 'Which consensus algorithm is widely used in distributed systems like Kubernetes\' etcd?',
        type: 'mcq',
        options: ['A. Dijkstra', 'B. Prim', 'C. Raft', 'D. Floyd-Warshall'],
        correctAnswer: 'C. Raft',
        marks: 5,
        difficulty: 'hard',
        category: category._id,
        topic: 'Consensus Algorithms',
        explanation: 'Raft provides leader election and log replication.'
      },
      {
        exam: exam._id,
        question: 'What problem does the Two-Phase Commit (2PC) protocol solve?',
        type: 'mcq',
        options: ['A. Load balancing', 'B. Distributed transaction coordination', 'C. Caching', 'D. Data compression'],
        correctAnswer: 'B. Distributed transaction coordination',
        marks: 5,
        difficulty: 'hard',
        category: category._id,
        topic: 'Distributed Transactions',
        explanation: '2PC coordinates distributed transactions across multiple participants.'
      },
      {
        exam: exam._id,
        question: 'Which architecture pattern isolates failures using independently deployable services?',
        type: 'mcq',
        options: ['A. Monolithic', 'B. Client-Server', 'C. Microservices', 'D. Peer-to-Peer'],
        correctAnswer: 'C. Microservices',
        marks: 5,
        difficulty: 'medium',
        category: category._id,
        topic: 'System Design',
        explanation: 'Microservices reduce the blast radius of failures.'
      },
      {
        exam: exam._id,
        question: 'What is a "split-brain" scenario?',
        type: 'mcq',
        options: ['A. CPU overload', 'B. Network partition causing multiple leaders', 'C. Database corruption', 'D. Memory leak'],
        correctAnswer: 'B. Network partition causing multiple leaders',
        marks: 5,
        difficulty: 'hard',
        category: category._id,
        topic: 'Distributed Systems',
        explanation: 'Split-brain occurs when partitions independently elect leaders.'
      },
      {
        exam: exam._id,
        question: 'Which technique improves read performance by storing frequently accessed data in memory?',
        type: 'mcq',
        options: ['A. Sharding', 'B. Replication', 'C. Caching', 'D. Checkpointing'],
        correctAnswer: 'C. Caching',
        marks: 5,
        difficulty: 'easy',
        category: category._id,
        topic: 'Caching & Performance',
        explanation: 'Caching reduces latency by avoiding repeated database queries.'
      },
      {
        exam: exam._id,
        question: 'What is the primary advantage of horizontal scaling?',
        type: 'mcq',
        options: ['A. Faster CPU', 'B. More RAM', 'C. Adding more servers', 'D. Increasing clock speed'],
        correctAnswer: 'C. Adding more servers',
        marks: 5,
        difficulty: 'easy',
        category: category._id,
        topic: 'Scalability',
        explanation: 'Horizontal scaling increases capacity by adding additional machines.'
      },
      {
        exam: exam._id,
        question: 'Which distributed storage system follows Google\'s GFS design principles?',
        type: 'mcq',
        options: ['A. MySQL', 'B. HDFS', 'C. SQLite', 'D. PostgreSQL'],
        correctAnswer: 'B. HDFS',
        marks: 5,
        difficulty: 'hard',
        category: category._id,
        topic: 'Distributed Storage',
        explanation: 'HDFS was inspired by Google\'s distributed file system.'
      },
      {
        exam: exam._id,
        question: 'Which Kubernetes object ensures a specified number of pod replicas remain running?',
        type: 'mcq',
        options: ['A. Service', 'B. ConfigMap', 'C. Deployment', 'D. Namespace'],
        correctAnswer: 'C. Deployment',
        marks: 5,
        difficulty: 'medium',
        category: category._id,
        topic: 'Kubernetes',
        explanation: 'Deployments manage replicas and rolling updates.'
      },
      {
        exam: exam._id,
        question: 'What is sharding?',
        type: 'mcq',
        options: ['A. Encrypting data', 'B. Splitting data across multiple databases', 'C. Compressing files', 'D. Creating backups'],
        correctAnswer: 'B. Splitting data across multiple databases',
        marks: 5,
        difficulty: 'medium',
        category: category._id,
        topic: 'Database Sharding',
        explanation: 'Sharding distributes data across multiple database instances.'
      },
      {
        exam: exam._id,
        question: 'Which HTTP status code commonly indicates a gateway timeout between distributed services?',
        type: 'mcq',
        options: ['A. 200', 'B. 404', 'C. 500', 'D. 504'],
        correctAnswer: 'D. 504',
        marks: 5,
        difficulty: 'easy',
        category: category._id,
        topic: 'HTTP Protocol',
        explanation: '504 indicates an upstream server failed to respond in time.'
      },
      {
        exam: exam._id,
        question: 'Which design pattern prevents cascading failures in distributed systems?',
        type: 'mcq',
        options: ['A. Singleton', 'B. Factory', 'C. Circuit Breaker', 'D. Observer'],
        correctAnswer: 'C. Circuit Breaker',
        marks: 5,
        difficulty: 'hard',
        category: category._id,
        topic: 'Resilience Patterns',
        explanation: 'Circuit breakers stop repeated calls to failing services.'
      },
      {
        exam: exam._id,
        question: 'What is the purpose of service discovery?',
        type: 'mcq',
        options: ['A. Encrypt services', 'B. Automatically locate service instances', 'C. Compress network packets', 'D. Generate APIs'],
        correctAnswer: 'B. Automatically locate service instances',
        marks: 5,
        difficulty: 'medium',
        category: category._id,
        topic: 'Service Mesh & Discovery',
        explanation: 'Service discovery enables dynamic communication between services.'
      },
      {
        exam: exam._id,
        question: 'Which metric is most important when evaluating distributed system latency?',
        type: 'mcq',
        options: ['A. Average only', 'B. Median only', 'C. P99 latency', 'D. Minimum latency'],
        correctAnswer: 'C. P99 latency',
        marks: 5,
        difficulty: 'hard',
        category: category._id,
        topic: 'System Latency',
        explanation: 'P99 reveals tail latency experienced by users.'
      },
      {
        exam: exam._id,
        question: 'What is idempotency in distributed APIs?',
        type: 'mcq',
        options: ['A. Faster execution', 'B. Multiple identical requests produce the same result', 'C. Encryption of requests', 'D. Parallel execution'],
        correctAnswer: 'B. Multiple identical requests produce the same result',
        marks: 5,
        difficulty: 'medium',
        category: category._id,
        topic: 'API Design',
        explanation: 'Idempotent operations prevent duplicate side effects.'
      },
      {
        exam: exam._id,
        question: 'Which component typically stores distributed tracing information?',
        type: 'mcq',
        options: ['A. Redis', 'B. Jaeger', 'C. FTP Server', 'D. SMTP'],
        correctAnswer: 'B. Jaeger',
        marks: 5,
        difficulty: 'medium',
        category: category._id,
        topic: 'Observability & Tracing',
        explanation: 'Jaeger is commonly used for distributed tracing.'
      },
      {
        exam: exam._id,
        question: 'Why is observability critical in distributed systems?',
        type: 'mcq',
        options: ['A. It reduces storage costs.', 'B. It helps understand system behavior using logs, metrics, and traces.', 'C. It increases CPU speed.', 'D. It replaces monitoring.'],
        correctAnswer: 'B. It helps understand system behavior using logs, metrics, and traces.',
        marks: 5,
        difficulty: 'hard',
        category: category._id,
        topic: 'Observability',
        explanation: 'Observability enables effective debugging across multiple services.'
      }
    ];

    await Question.insertMany(questions);
    console.log('🎉 Successfully seeded 20 questions for "Advanced System Architecture & Distributed Systems"!');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding System Architecture exam:', err);
    process.exit(1);
  }
};

seedSystemArchExam();
