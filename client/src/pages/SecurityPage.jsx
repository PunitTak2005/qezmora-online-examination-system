import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Activity, Server, FileCheck, EyeOff, AlertTriangle, CheckCircle, Mail, Facebook, Twitter, Instagram, Linkedin, ShieldCheck, Key } from 'lucide-react';
import PageTransition from '../components/PageTransition';

const SecurityPage = () => {
  const sections = [
    {
      title: "1. Our Security Commitment",
      content: "At Qezmora, we recognize that trust is the foundation of online education. We are deeply committed to protecting our users, securing assessment data, and maintaining the highest standards of exam integrity through continuous investment in our security infrastructure."
    },
    {
      title: "2. Secure Authentication",
      content: "We utilize robust authentication mechanisms to verify user identity and protect accounts from unauthorized access.",
      list: [
        "JWT-based (JSON Web Token) authentication for secure, stateless sessions.",
        "Industry-standard password hashing using bcrypt before storage.",
        "Secure session management with automatic timeouts for inactivity.",
        "Protection against brute-force login attempts."
      ]
    },
    {
      title: "3. Data Encryption",
      content: "All communication between your browser and Qezmora's servers is fully encrypted using HTTPS/TLS protocols. This ensures that sensitive data, including login credentials and exam responses, cannot be intercepted during transmission."
    },
    {
      title: "4. Exam Integrity",
      content: "Maintaining a fair testing environment is crucial. Our platform includes features designed to uphold the integrity of every assessment:",
      list: [
        "Strictly enforced timed exams with server-side validation.",
        "Auto-submission of responses when the allocated time expires.",
        "Randomized question generation and option shuffling to prevent cheating.",
        "Secure, tamper-proof result calculation processes."
      ]
    },
    {
      title: "5. Account Protection",
      content: "While we secure the backend, we also provide tools and guidelines for users to protect their own accounts. We enforce strong password policies, encourage secure login practices, and immediately terminate sessions upon logout to prevent unauthorized access on shared devices."
    },
    {
      title: "6. Platform Monitoring",
      content: "Our engineering team continuously monitors the Qezmora platform for potential vulnerabilities, unusual activity, and performance issues. We maintain comprehensive activity logs and conduct regular security reviews to implement continuous improvements."
    },
    {
      title: "7. Responsible Data Handling",
      content: "We adhere strictly to our Privacy Policy regarding the collection, storage, and processing of personal information. Access to sensitive data is restricted exclusively to authorized personnel who require it to perform their official duties."
    },
    {
      title: "8. Reporting Security Issues",
      content: "If you believe you have discovered a security vulnerability on the Qezmora platform, we encourage responsible disclosure. Please contact our security team immediately with a detailed report so we can investigate and address the issue promptly."
    }
  ];

  const summaryCards = [
    { icon: Server, title: "Encrypted Connections", desc: "End-to-end TLS encryption for all data transit" },
    { icon: Key, title: "Secure Authentication", desc: "Robust JWT and hashed password protection" },
    { icon: FileCheck, title: "Protected Exam Data", desc: "Tamper-proof assessment storage and processing" },
    { icon: Activity, title: "Continuous Monitoring", desc: "24/7 platform surveillance and error tracking" }
  ];

  const bestPractices = [
    "Use strong, unique passwords for your Qezmora account.",
    "Never share your login credentials with anyone.",
    "Always log out completely after using shared or public devices.",
    "Keep your web browser and operating system updated.",
    "Report any suspicious account activity immediately."
  ];

  return (
    <PageTransition>
      <div className="bg-cream dark:bg-[#0B1220] min-h-screen pb-24">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary to-[#0F5132]/80 pt-32 pb-20 px-4 relative overflow-hidden rounded-b-[40px] md:rounded-b-[80px]">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-50"></div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 mb-8 backdrop-blur-sm border border-white/20"
            >
              <ShieldCheck className="w-10 h-10 text-gold" />
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight"
            >
              Security Overview
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed mb-8"
            >
              Learn how Qezmora protects your account, exam data, and personal information through secure authentication, encrypted communication, and responsible data handling.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-block px-4 py-2 bg-white/10 rounded-full text-white/80 text-sm font-medium border border-white/10"
            >
              Last Updated: October 15, 2024
            </motion.div>
          </div>
        </section>

        {/* Summary Cards */}
        <section className="max-w-7xl mx-auto px-4 -mt-12 relative z-20 mb-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {summaryCards.map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + (idx * 0.1) }}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-[#162032] p-6 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 transition-colors"
              >
                <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center mb-4 text-gold">
                  <card.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-[#F8FAFC] mb-2">{card.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Security Best Practices Section */}
        <section className="max-w-4xl mx-auto px-4 mb-16">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="bg-gold/10 dark:bg-gold/5 border border-gold/20 rounded-3xl p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gold mb-6 flex items-center gap-3">
              <Shield className="w-6 h-6 text-gold" />
              Security Best Practices for Students
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {bestPractices.map((practice, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-white/50 dark:bg-[#162032]/50 p-4 rounded-xl border border-gold/10">
                  <CheckCircle className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{practice}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Policy Content */}
        <section className="max-w-4xl mx-auto px-4 mb-20">
          <div className="bg-white dark:bg-[#162032] rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 md:p-12 transition-colors">
            {sections.map((section, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                className="mb-12 last:mb-0"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-[#F8FAFC] mb-4 flex items-center gap-3">
                  {section.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  {section.content}
                </p>
                {section.list && (
                  <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-300">
                    {section.list.map((item, i) => (
                      <li key={i} className="leading-relaxed">{item}</li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="max-w-4xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-primary dark:bg-[#2E8B57] text-white rounded-3xl p-8 md:p-12 text-center relative overflow-hidden transition-colors"
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-20"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-black mb-4">Security Contact</h2>
              <p className="text-white/80 mb-8 max-w-xl mx-auto">
                Discovered a vulnerability or have a security concern? Please reach out to our team immediately.
              </p>
              
              <div className="flex flex-col items-center gap-6">
                <a 
                  href="mailto:punittak2005@gmail.com" 
                  className="inline-flex items-center gap-2 bg-white text-primary dark:text-[#2E8B57] px-8 py-4 rounded-xl font-bold hover:bg-gold hover:text-white transition-all transform hover:-translate-y-1 shadow-xl shadow-black/10"
                >
                  <Mail className="w-5 h-5" /> punittak2005@gmail.com
                </a>
                
                <div className="flex gap-4 mt-4">
                  <a href="https://www.facebook.com/punit.tak.2025" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold transition-all transform hover:-translate-y-1">
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a href="https://x.com/PunitTak005" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold transition-all transform hover:-translate-y-1">
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a href="https://www.instagram.com/punit.tak/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold transition-all transform hover:-translate-y-1">
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a href="https://www.linkedin.com/in/punit-tak-2005cse" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold transition-all transform hover:-translate-y-1">
                    <Linkedin className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </PageTransition>
  );
};

export default SecurityPage;
