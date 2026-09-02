import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Zap, BarChart2, Award, Server, Database, Code, Layout, Globe } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import Logo from '../components/common/Logo';
import useStats from '../hooks/useStats';
import { formatNumber } from '../utils/formatNumber';

const AboutPage = () => {
  const { stats } = useStats();

  return (
    <PageTransition>
      <div className="bg-cream dark:bg-gray-950 min-h-screen">
        {/* Hero Section */}
        <section className="pt-24 pb-20 px-4 bg-cream dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white overflow-hidden relative transition-colors duration-300">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-30"></div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center mb-8">
              <Logo variant="auto" className="h-16 md:h-20 w-auto" />
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-black mb-6 text-gray-900 dark:text-white">
              About Qezmora
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg md:text-xl text-gray-600 dark:text-white/80 leading-relaxed font-medium">
              We believe in making digital assessments seamless, secure, and insightful for everyone involved.
            </motion.p>
          </div>
        </section>

        {/* Story */}
        <section className="py-24 px-4 bg-white dark:bg-gray-900">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">Our Mission & Vision</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
              Qezmora was built to solve the complexities of modern education and corporate training. Traditional exams are prone to logistical nightmares, lack of insightful analytics, and security vulnerabilities. Our mission is to provide an accessible, enterprise-grade EdTech SaaS platform that bridges the gap between learning and accurate evaluation.
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="py-24 px-4 bg-cream dark:bg-gray-950">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Platform Capabilities</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Shield, title: 'Secure Exams', desc: 'Tab-tracking and anti-cheat mechanisms.' },
                { icon: Zap, title: 'Real-time Results', desc: 'Instant grading and immediate feedback.' },
                { icon: Award, title: 'Leaderboards', desc: 'Gamified ranking for competitive exams.' },
                { icon: BarChart2, title: 'Analytics', desc: 'Deep insights into student performance.' }
              ].map((feat, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 text-center">
                  <div className="w-16 h-16 mx-auto bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                    <feat.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feat.title}</h3>
                  <p className="text-gray-500">{feat.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-24 px-4 bg-primary text-white">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-black text-gold mb-2">99.9%</div>
              <div className="uppercase tracking-widest text-sm font-medium">Uptime</div>
            </div>
            <div>
              <div className="text-5xl font-black text-gold mb-2">{formatNumber(stats.questionBank || 530)}+</div>
              <div className="uppercase tracking-widest text-sm font-medium">Questions</div>
            </div>
            <div>
              <div className="text-5xl font-black text-gold mb-2">{formatNumber(stats.availableExams || 26)}</div>
              <div className="uppercase tracking-widest text-sm font-medium">Exams</div>
            </div>
            <div>
              <div className="text-5xl font-black text-gold mb-2">24/7</div>
              <div className="uppercase tracking-widest text-sm font-medium">Support</div>
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="py-24 px-4 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Powered By Modern Tech</h2>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              {[
                { name: 'React', icon: Layout },
                { name: 'Node.js', icon: Server },
                { name: 'Express', icon: Globe },
                { name: 'MongoDB', icon: Database },
                { name: 'Tailwind CSS', icon: Code }
              ].map((tech, i) => (
                <div key={i} className="flex items-center gap-3 px-6 py-4 bg-cream dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                  <tech.icon className="w-6 h-6 text-primary" />
                  <span className="font-bold text-gray-900 dark:text-white">{tech.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-4 bg-cream dark:bg-gray-950 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8">Ready to experience Qezmora?</h2>
          <Link to="/register" className="btn btn-primary px-10 py-5 rounded-2xl text-xl font-bold shadow-xl shadow-primary/20">
            Get Started Now
          </Link>
        </section>
      </div>
    </PageTransition>
  );
};

export default AboutPage;
