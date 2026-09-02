const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Exam = require('../models/Exam');
const Question = require('../models/Question');
const Category = require('../models/Category');

dotenv.config({ path: './.env' });

const seedQuantumExam = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/onlineexam');
    console.log('🔗 Connected to MongoDB for Quantum Exam Seeding...');

    // 1. Find or create Category
    let category = await Category.findOne({ name: 'Quantum Computing' });
    if (!category) {
      category = await Category.create({
        name: 'Quantum Computing',
        slug: 'quantum-computing',
        description: 'Advanced Quantum Gates, Superposition, Entanglement, Qiskit, and Quantum Algorithms.',
        icon: 'Cpu',
        color: 'purple',
        status: 'Active'
      });
      console.log('✅ Created Category: Quantum Computing');
    }

    // 2. Find Teacher/Admin
    let teacher = await User.findOne({ role: 'teacher' }) || await User.findOne({ role: 'admin' });
    if (!teacher) {
      console.error('❌ No teacher or admin user found to assign the exam to.');
      process.exit(1);
    }

    // 3. Create or Update Exam
    const examData = {
      title: 'Advanced Quantum Computing & Algorithms',
      subject: 'Quantum Computing',
      description: 'Advanced 60-minute assessment covering Quantum Gates, Superposition, Entanglement, Qiskit, Shor\'s Algorithm, Grover\'s Algorithm, QFT, BB84 Quantum Cryptography, Quantum Teleportation, Quantum Error Correction, VQE, and HHL.',
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
        question: 'Which quantum gate creates an equal superposition from the state |0⟩?',
        type: 'mcq',
        options: ['A. Pauli-X', 'B. Hadamard', 'C. Phase', 'D. CNOT'],
        correctAnswer: 'B. Hadamard',
        marks: 5,
        difficulty: 'hard',
        category: category._id,
        topic: 'Quantum Gates',
        explanation: 'The Hadamard gate transforms |0⟩ into (|0⟩+|1⟩)/√2.'
      },
      {
        exam: exam._id,
        question: 'What is the primary purpose of the CNOT gate?',
        type: 'mcq',
        options: ['A. Measure a qubit', 'B. Rotate a qubit', 'C. Create entanglement', 'D. Reset a qubit'],
        correctAnswer: 'C. Create entanglement',
        marks: 5,
        difficulty: 'hard',
        category: category._id,
        topic: 'Quantum Gates',
        explanation: 'The CNOT gate flips the target qubit when the control is |1⟩, making it essential for entanglement.'
      },
      {
        exam: exam._id,
        question: 'Shor\'s Algorithm provides an exponential speedup for which problem?',
        type: 'mcq',
        options: ['A. Database searching', 'B. Matrix multiplication', 'C. Integer factorization', 'D. Sorting'],
        correctAnswer: 'C. Integer factorization',
        marks: 5,
        difficulty: 'hard',
        category: category._id,
        topic: 'Shor\'s Algorithm',
        explanation: 'Shor\'s Algorithm efficiently factors large integers, threatening RSA encryption.'
      },
      {
        exam: exam._id,
        question: 'Grover\'s Algorithm provides approximately what speedup for unstructured search?',
        type: 'mcq',
        options: ['A. Exponential', 'B. Logarithmic', 'C. Quadratic', 'D. Linear'],
        correctAnswer: 'C. Quadratic',
        marks: 5,
        difficulty: 'hard',
        category: category._id,
        topic: 'Grover\'s Algorithm',
        explanation: 'It reduces search complexity from O(N) to O(√N).'
      },
      {
        exam: exam._id,
        question: 'Which Qiskit component is primarily used to build quantum circuits?',
        type: 'mcq',
        options: ['A. QuantumCircuit', 'B. QuantumKernel', 'C. QuantumOptimizer', 'D. QuantumMemory'],
        correctAnswer: 'A. QuantumCircuit',
        marks: 5,
        difficulty: 'medium',
        category: category._id,
        topic: 'Qiskit Framework',
        explanation: 'QuantumCircuit defines gates and operations applied to qubits.'
      },
      {
        exam: exam._id,
        question: 'What happens when a qubit is measured?',
        type: 'mcq',
        options: ['A. It duplicates itself.', 'B. It enters another superposition.', 'C. It collapses to a classical state.', 'D. It disappears permanently.'],
        correctAnswer: 'C. It collapses to a classical state.',
        marks: 5,
        difficulty: 'medium',
        category: category._id,
        topic: 'Quantum Measurement',
        explanation: 'Measurement collapses the quantum state into either 0 or 1.'
      },
      {
        exam: exam._id,
        question: 'Which phenomenon enables correlations stronger than classical physics?',
        type: 'mcq',
        options: ['A. Interference', 'B. Entanglement', 'C. Decoherence', 'D. Tunneling'],
        correctAnswer: 'B. Entanglement',
        marks: 5,
        difficulty: 'hard',
        category: category._id,
        topic: 'Entanglement',
        explanation: 'Entangled particles exhibit correlations beyond classical expectations.'
      },
      {
        exam: exam._id,
        question: 'What is the purpose of the Quantum Fourier Transform (QFT) in Shor\'s Algorithm?',
        type: 'mcq',
        options: ['A. Encrypt data', 'B. Find periodicity', 'C. Generate random numbers', 'D. Reduce qubit count'],
        correctAnswer: 'B. Find periodicity',
        marks: 5,
        difficulty: 'hard',
        category: category._id,
        topic: 'Quantum Fourier Transform',
        explanation: 'QFT efficiently identifies periodic patterns required for factorization.'
      },
      {
        exam: exam._id,
        question: 'Which gate rotates a qubit around the Z-axis?',
        type: 'mcq',
        options: ['A. RX', 'B. RY', 'C. RZ', 'D. CNOT'],
        correctAnswer: 'C. RZ',
        marks: 5,
        difficulty: 'medium',
        category: category._id,
        topic: 'Quantum Gates',
        explanation: 'RZ performs rotations around the Bloch sphere\'s Z-axis.'
      },
      {
        exam: exam._id,
        question: 'In Qiskit, what does measure_all() accomplish?',
        type: 'mcq',
        options: ['A. Deletes qubits', 'B. Measures every qubit into classical bits', 'C. Applies Hadamard gates', 'D. Optimizes the circuit'],
        correctAnswer: 'B. Measures every qubit into classical bits',
        marks: 5,
        difficulty: 'medium',
        category: category._id,
        topic: 'Qiskit Framework',
        explanation: 'It automatically measures all quantum registers.'
      },
      {
        exam: exam._id,
        question: 'Which quantum cryptography protocol is most widely known for secure key distribution?',
        type: 'mcq',
        options: ['A. RSA', 'B. AES', 'C. BB84', 'D. SHA-256'],
        correctAnswer: 'C. BB84',
        marks: 5,
        difficulty: 'hard',
        category: category._id,
        topic: 'Quantum Cryptography',
        explanation: 'BB84 uses quantum mechanics to detect eavesdropping.'
      },
      {
        exam: exam._id,
        question: 'Why is the no-cloning theorem important in quantum cryptography?',
        type: 'mcq',
        options: ['A. It speeds up encryption.', 'B. It prevents copying unknown quantum states.', 'C. It compresses data.', 'D. It increases qubit storage.'],
        correctAnswer: 'B. It prevents copying unknown quantum states.',
        marks: 5,
        difficulty: 'hard',
        category: category._id,
        topic: 'Quantum Cryptography',
        explanation: 'Unknown quantum states cannot be perfectly copied.'
      },
      {
        exam: exam._id,
        question: 'What is decoherence?',
        type: 'mcq',
        options: ['A. Faster computation', 'B. Loss of quantum information due to environmental interaction', 'C. Error correction', 'D. Quantum teleportation'],
        correctAnswer: 'B. Loss of quantum information due to environmental interaction',
        marks: 5,
        difficulty: 'hard',
        category: category._id,
        topic: 'Quantum Physics',
        explanation: 'Environmental noise destroys fragile quantum states.'
      },
      {
        exam: exam._id,
        question: 'Which IBM framework is commonly used for executing circuits on real quantum hardware?',
        type: 'mcq',
        options: ['A. TensorFlow', 'B. Qiskit Runtime', 'C. PyTorch', 'D. NumPy'],
        correctAnswer: 'B. Qiskit Runtime',
        marks: 5,
        difficulty: 'medium',
        category: category._id,
        topic: 'IBM Quantum',
        explanation: 'Qiskit Runtime enables efficient execution on IBM Quantum systems.'
      },
      {
        exam: exam._id,
        question: 'Which gate swaps two qubits?',
        type: 'mcq',
        options: ['A. CZ', 'B. SWAP', 'C. X', 'D. T'],
        correctAnswer: 'B. SWAP',
        marks: 5,
        difficulty: 'easy',
        category: category._id,
        topic: 'Quantum Gates',
        explanation: 'The SWAP gate exchanges the states of two qubits.'
      },
      {
        exam: exam._id,
        question: 'What is the advantage of variational quantum algorithms like VQE?',
        type: 'mcq',
        options: ['A. They eliminate measurement.', 'B. They combine classical and quantum optimization.', 'C. They require no quantum gates.', 'D. They solve every NP-complete problem.'],
        correctAnswer: 'B. They combine classical and quantum optimization.',
        marks: 5,
        difficulty: 'hard',
        category: category._id,
        topic: 'VQE & Variational Algorithms',
        explanation: 'VQE uses hybrid optimization between quantum circuits and classical optimizers.'
      },
      {
        exam: exam._id,
        question: 'Which statement best describes quantum teleportation?',
        type: 'mcq',
        options: ['A. Physical movement of matter', 'B. Copying quantum states', 'C. Transfer of quantum state using entanglement and classical communication', 'D. Instantaneous communication'],
        correctAnswer: 'C. Transfer of quantum state using entanglement and classical communication',
        marks: 5,
        difficulty: 'hard',
        category: category._id,
        topic: 'Quantum Teleportation',
        explanation: 'Quantum teleportation transfers state information—not matter—using entanglement.'
      },
      {
        exam: exam._id,
        question: 'Which algorithm is designed specifically for solving linear systems of equations under certain conditions?',
        type: 'mcq',
        options: ['A. Grover', 'B. HHL', 'C. Shor', 'D. Simon'],
        correctAnswer: 'B. HHL',
        marks: 5,
        difficulty: 'hard',
        category: category._id,
        topic: 'HHL Algorithm',
        explanation: 'The Harrow-Hassidim-Lloyd (HHL) algorithm targets linear systems.'
      },
      {
        exam: exam._id,
        question: 'What is the role of quantum error correction?',
        type: 'mcq',
        options: ['A. Increase processor speed', 'B. Eliminate classical computers', 'C. Protect logical qubits from physical errors', 'D. Reduce algorithm complexity'],
        correctAnswer: 'C. Protect logical qubits from physical errors',
        marks: 5,
        difficulty: 'hard',
        category: category._id,
        topic: 'Quantum Error Correction',
        explanation: 'Multiple physical qubits encode one logical qubit to tolerate errors.'
      },
      {
        exam: exam._id,
        question: 'Why is Shor\'s Algorithm considered a major threat to RSA encryption?',
        type: 'mcq',
        options: ['A. It weakens AES.', 'B. It can efficiently factor large composite numbers.', 'C. It increases key length.', 'D. It replaces public-key cryptography.'],
        correctAnswer: 'B. It can efficiently factor large composite numbers.',
        marks: 5,
        difficulty: 'hard',
        category: category._id,
        topic: 'Shor\'s Algorithm & RSA',
        explanation: 'RSA security depends on the difficulty of integer factorization, which Shor\'s Algorithm solves efficiently on a sufficiently powerful quantum computer.'
      }
    ];

    await Question.insertMany(questions);
    console.log('🎉 Successfully seeded 20 questions for "Advanced Quantum Computing & Algorithms"!');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding Quantum Computing exam:', err);
    process.exit(1);
  }
};

seedQuantumExam();
