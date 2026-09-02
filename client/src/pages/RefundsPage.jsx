import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Clock, AlertTriangle, CreditCard, RefreshCcw, CheckCircle, Mail, Facebook, Twitter, Instagram, Linkedin, Wallet } from 'lucide-react';
import PageTransition from '../components/PageTransition';

const RefundsPage = () => {
  const sections = [
    {
      title: "1. Overview",
      content: "At Qezmora, we strive to provide a fair and transparent refund process. This policy outlines the conditions under which refunds, cancellations, and exam rescheduling are permitted for our online examination and certification services."
    },
    {
      title: "2. Eligible Refunds",
      content: "You may be eligible for a full or partial refund in the following situations:",
      list: [
        "Duplicate payments or overcharges for the same exam registration.",
        "Technical platform failures or outages directly preventing you from accessing or completing your exam.",
        "Exams or assessments cancelled entirely by Qezmora.",
        "Incorrect charges applied to your billing account."
      ]
    },
    {
      title: "3. Non-Refundable Situations",
      content: "Please note that refunds will not be issued under the following circumstances:",
      list: [
        "You have already started or completed the examination.",
        "You missed the scheduled examination time due to personal reasons, technical issues on your end (e.g., poor internet), or failure to meet system requirements.",
        "Incorrect information was entered by the user during registration.",
        "The registration period or validity of the exam has expired.",
        "Violation of academic integrity resulting in disqualification."
      ]
    },
    {
      title: "4. Cancellation Policy",
      content: "You may cancel your exam registration up to 48 hours before the scheduled exam time to receive a full refund. Cancellations made within 48 hours of the exam start time are generally not eligible for a refund unless covered by exceptional circumstances."
    },
    {
      title: "5. Rescheduling Policy",
      content: "Eligible users may reschedule their exam up to 24 hours prior to the original start time without incurring any additional fees. Rescheduling requests within 24 hours of the exam are subject to a late-change fee and administrative approval."
    },
    {
      title: "6. Refund Processing Time",
      content: "Once a refund request is submitted and approved by our support team, the refund will be processed within 5–10 business days. You will receive an email confirmation once the transaction has been initiated."
    },
    {
      title: "7. Payment Methods",
      content: "All approved refunds will be returned through the original payment method used during the transaction. If the original payment method is no longer available (e.g., an expired credit card), please contact support to arrange an alternative refund method."
    },
    {
      title: "8. Contact Support",
      content: "To request a refund, cancellation, or rescheduling, please contact our support team. Include your transaction ID, registered email address, and a detailed explanation of your request to expedite the process."
    }
  ];

  const summaryCards = [
    { icon: RefreshCcw, title: "Eligible Refunds", desc: "Clear guidelines on when refunds are issued" },
    { icon: Shield, title: "Secure Payments", desc: "All transactions are fully encrypted and secure" },
    { icon: Clock, title: "Fast Processing", desc: "Approved refunds processed within 5-10 days" },
    { icon: AlertTriangle, title: "Support Assistance", desc: "Dedicated help for billing and technical issues" }
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
              <Wallet className="w-10 h-10 text-gold" />
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight"
            >
              Qezmora Refund Policy
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed mb-8"
            >
              Understand our refund, cancellation, and rescheduling policies for exams and premium services.
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
              <h2 className="text-3xl font-black mb-4">Need Help?</h2>
              <p className="text-white/80 mb-8 max-w-xl mx-auto">
                If you have any questions regarding your eligibility for a refund, please contact our billing department.
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

export default RefundsPage;
