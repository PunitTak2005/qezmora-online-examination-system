import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, EyeOff, Server, HardDrive, FileCheck, Mail, Facebook, Twitter, Instagram, Linkedin, FileText, CheckCircle, AlertTriangle, Briefcase } from 'lucide-react';
import PageTransition from '../components/PageTransition';

const TermsPage = () => {
  const sections = [
    {
      title: "1. Agreement to Terms",
      content: "By accessing or using the Qezmora platform, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree to all of these terms, do not use our services. We reserve the right to modify these terms at any time, and we will notify you of any significant changes."
    },
    {
      title: "2. User Accounts and Responsibilities",
      content: "When you create an account with us, you must provide accurate and complete information. You are solely responsible for:",
      list: [
        "Maintaining the confidentiality of your account credentials.",
        "All activities that occur under your account.",
        "Notifying us immediately of any unauthorized use of your account.",
        "Ensuring your use of the platform complies with all applicable laws and regulations."
      ]
    },
    {
      title: "3. Academic Integrity",
      content: "Qezmora is committed to maintaining the highest standards of academic integrity. When using our platform to take examinations, you agree not to engage in any form of cheating, plagiarism, or unauthorized assistance. Violation of this rule may result in immediate account suspension and notification to your educational institution."
    },
    {
      title: "4. Intellectual Property",
      content: "The Qezmora platform, including its original content, features, and functionality, are owned by Qezmora and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws. You may not copy, modify, distribute, sell, or lease any part of our services or included software."
    },
    {
      title: "5. User Content",
      content: "You retain all of your ownership rights in your content, but you are required to grant us a limited license to use, store, and copy that content and to distribute and make it available to third parties solely for the purpose of operating the platform."
    },
    {
      title: "6. Limitation of Liability",
      content: "In no event shall Qezmora, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service."
    },
    {
      title: "7. Termination",
      content: "We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms."
    }
  ];

  const summaryCards = [
    { icon: FileText, title: "Clear Guidelines", desc: "Straightforward rules for using our platform" },
    { icon: CheckCircle, title: "Academic Integrity", desc: "Strict policies against cheating and plagiarism" },
    { icon: AlertTriangle, title: "Fair Usage", desc: "Protecting the rights of all platform users" },
    { icon: Briefcase, title: "Professional Standards", desc: "Maintaining high quality educational services" }
  ];

  return (
    <PageTransition>
      <div className="bg-cream dark:bg-[#0B1220] min-h-screen pb-24">
        {/* Hero Section */}
        <section className="bg-primary pt-32 pb-20 px-4 relative overflow-hidden rounded-b-[40px] md:rounded-b-[80px]">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-50"></div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 mb-8 backdrop-blur-sm border border-white/20"
            >
              <FileCheck className="w-10 h-10 text-gold" />
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight"
            >
              Terms & Conditions
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed mb-8"
            >
              Please read these terms and conditions carefully before using the Qezmora online examination platform.
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
        <section className="max-w-7xl mx-auto px-4 -mt-12 relative z-20 mb-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {summaryCards.map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + (idx * 0.1) }}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-[#162032] p-6 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800"
              >
                <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center mb-4 text-gold">
                  <card.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{card.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Terms Content */}
        <section className="max-w-4xl mx-auto px-4 mb-20">
          <div className="bg-white dark:bg-[#162032] rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 md:p-12">
            {sections.map((section, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                className="mb-12 last:mb-0"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
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
            className="bg-primary text-white rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-20"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-black mb-4">Questions About Our Terms?</h2>
              <p className="text-white/80 mb-8 max-w-xl mx-auto">
                If you have any questions about these Terms and Conditions, please contact us.
              </p>
              
              <div className="flex flex-col items-center gap-6">
                <a 
                  href="mailto:punittak2005@gmail.com" 
                  className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-xl font-bold hover:bg-gold hover:text-white transition-all transform hover:-translate-y-1 shadow-xl shadow-black/10"
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

export default TermsPage;
