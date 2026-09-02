import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, EyeOff, Server, HardDrive, FileCheck, Mail, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import PageTransition from '../components/PageTransition';

const PrivacyPage = () => {
  const sections = [
    {
      title: "1. Introduction",
      content: "Welcome to Qezmora. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our platform and tell you about your privacy rights and how the law protects you."
    },
    {
      title: "2. Information We Collect",
      content: "We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:",
      list: [
        "Identity Data: includes first name, last name, username or similar identifier.",
        "Contact Data: includes email address and telephone numbers.",
        "Profile Data: includes your username and password, exam attempts, scores, and preferences.",
        "Technical Data: includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location."
      ]
    },
    {
      title: "3. How We Use Your Information",
      content: "We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances: to provide and maintain our Service, to manage your account and authenticate you, to process your exams and generate results, and to improve our platform's security and user experience."
    },
    {
      title: "4. Authentication & Security",
      content: "We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know."
    },
    {
      title: "5. Exam Data Storage",
      content: "All exam attempts, responses, and generated scores are securely stored in our encrypted databases. We maintain strict access controls to ensure that only authorized personnel (such as your designated instructors or administrators) can view your academic performance data."
    },
    {
      title: "6. Cookies & Session Management",
      content: "We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. We use these primarily to keep you authenticated during your exam sessions."
    },
    {
      title: "7. Third-Party Services",
      content: "We do not sell your data. We may share your personal data with internal third parties (such as cloud service providers) solely for the purpose of hosting and maintaining the Qezmora platform."
    },
    {
      title: "8. Data Retention",
      content: "We will only retain your personal data for as long as reasonably necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, regulatory, tax, accounting or reporting requirements."
    },
    {
      title: "9. User Rights",
      content: "Under certain circumstances, you have rights under data protection laws in relation to your personal data. These include the right to request access to your personal data, request correction of your personal data, request erasure of your personal data, and object to processing of your personal data."
    },
    {
      title: "10. Children's Privacy",
      content: "Our Service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from anyone under the age of 13. If you are a parent or guardian and you are aware that your child has provided us with Personal Data, please contact us."
    }
  ];

  const summaryCards = [
    { icon: Lock, title: "Secure Authentication", desc: "Industry-standard encryption for your credentials" },
    { icon: HardDrive, title: "Protected Exam Data", desc: "Your scores and attempts are securely stored" },
    { icon: EyeOff, title: "No Unauthorized Sharing", desc: "We never sell your data to third parties" },
    { icon: Shield, title: "User Privacy First", desc: "You maintain control over your personal information" }
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
              <Shield className="w-10 h-10 text-gold" />
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight"
            >
              Qezmora Privacy Policy
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed mb-8"
            >
              Your privacy matters. Learn how Qezmora collects, uses, stores, and protects your information while you use our online examination platform.
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

        {/* Policy Content */}
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
              <h2 className="text-3xl font-black mb-4">11. Contact Information</h2>
              <p className="text-white/80 mb-8 max-w-xl mx-auto">
                If you have any questions about this Privacy Policy, please contact us via email or our social media channels.
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

export default PrivacyPage;
