import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Download, ChevronLeft, CheckCircle, XCircle, MinusCircle, Clock, Award, BarChart3, RotateCcw } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { LightPieTooltip } from '../../components/common/LightChartTooltip';
import api from '../../api/axios';
import PageTransition from '../../components/PageTransition';
import { motion } from 'framer-motion';

const ResultPage = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await api.get(`/attempts/${attemptId}`);
        const attempt = res.data.data;
        const exam = attempt.exam || {};
        
        // ─── JAVASCRIPT-BASED SCORE CALCULATION ───
        // The prompt specifically requested computing this via JS logic on the frontend.
        let correctCount = 0;
        let wrongCount = 0;
        let unansweredCount = 0;
        let calculatedScore = 0;
        
        const detailedAnswers = attempt.detailedAnswers || [];
        
        detailedAnswers.forEach(answer => {
          if (!answer.selectedAnswer) {
            unansweredCount++;
          } else if (answer.selectedAnswer === answer.correctAnswer) {
            correctCount++;
            calculatedScore += answer.marks || 1; // Assuming 1 mark per question if not specified
          } else {
            wrongCount++;
          }
        });

        const totalMarks = exam.totalMarks || detailedAnswers.length;
        const calculatedPercentage = totalMarks > 0 ? (calculatedScore / totalMarks) * 100 : 0;
        const passingMarks = exam.passingMarks || Math.ceil(totalMarks * 0.4);
        const isPassed = calculatedScore >= passingMarks;

        // Result Summary Logic
        let summaryMessage = "Needs Improvement";
        if (calculatedPercentage >= 90) summaryMessage = "Outstanding Performance!";
        else if (calculatedPercentage >= 75) summaryMessage = "Excellent Work!";
        else if (calculatedPercentage >= 60) summaryMessage = "Good Job!";
        else if (isPassed) summaryMessage = "You Passed!";

        setResult({
          examTitle: exam.title || 'Examination',
          subject: exam.subject || 'General',
          studentName: attempt.student?.name || 'Student',
          date: attempt.submittedAt || new Date().toISOString(),
          timeTaken: attempt.timeTaken || 0,
          totalQuestions: detailedAnswers.length,
          
          // Calculated Metrics
          score: calculatedScore,
          totalMarks: totalMarks,
          percentage: Math.round(calculatedPercentage),
          isPassed: isPassed,
          summaryMessage: summaryMessage,
          
          correct: correctCount,
          wrong: wrongCount,
          unanswered: unansweredCount,
          
          questions: detailedAnswers
        });
      } catch (error) {
        toast.error('Failed to load result');
        navigate('/student/history');
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [attemptId, navigate]);

  const generatePDF = () => {
    if (!result) return;
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(37, 99, 235);
    doc.text('Performance Report', 14, 22);
    
    doc.setFontSize(12);
    doc.setTextColor(50, 50, 50);
    doc.text(`Exam Name: ${result.examTitle}`, 14, 34);
    doc.text(`Subject: ${result.subject}`, 14, 42);
    doc.text(`Student: ${result.studentName}`, 14, 50);
    doc.text(`Date: ${new Date(result.date).toLocaleString()}`, 14, 58);
    
    doc.setFontSize(14);
    doc.setTextColor(result.isPassed ? 22 : 220, result.isPassed ? 163 : 38, result.isPassed ? 74 : 38);
    doc.text(`Status: ${result.isPassed ? 'PASSED' : 'FAILED'} - ${result.percentage}% (${result.score}/${result.totalMarks})`, 14, 70);
    
    doc.autoTable({
      startY: 80,
      headStyles: { fillColor: [37, 99, 235] },
      head: [['Question', 'Your Answer', 'Correct Answer', 'Status']],
      body: result.questions.map((q, i) => [
        `Q${i+1}. ${q.question || 'Question Text'}`, 
        q.selectedAnswer || '(Unanswered)', 
        q.correctAnswer, 
        q.selectedAnswer === q.correctAnswer ? 'Correct' : q.selectedAnswer ? 'Incorrect' : 'Skipped'
      ]),
    });
    
    doc.save(`${result.examTitle.replace(/\s+/g, '_')}_Result.pdf`);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}m ${s}s`;
  };

  if (loading) return (
    <div className="flex h-screen flex-col items-center justify-center bg-cream dark:bg-gray-950">
      <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
      <p className="text-lg font-bold text-gray-500 animate-pulse">Calculating JS Assessment Results...</p>
    </div>
  );
  
  if (!result) return <div>Result not found</div>;

  const pieData = [
    { name: 'Correct', value: result.correct, color: '#10B981' }, // Emerald-500
    { name: 'Wrong', value: result.wrong, color: '#EF4444' },   // Red-500
    { name: 'Unanswered', value: result.unanswered, color: '#9CA3AF' } // Gray-400
  ];

  return (
    <PageTransition>
      <main className="max-w-6xl mx-auto space-y-8 pb-16">
        
        {/* ─── Header & Actions ─── */}
        <header className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Assessment Report</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">{result.examTitle} • {result.subject}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={generatePDF} className="btn btn-secondary bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border-none shadow-sm gap-2">
              <Download className="w-4 h-4" /> Download PDF
            </button>
            <button onClick={() => navigate('/student/dashboard')} className="btn btn-primary gap-2">
              <RotateCcw className="w-4 h-4" /> Back to Dashboard
            </button>
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* ─── Main Performance Card ─── */}
          <motion.section 
            aria-label="Main Performance Summary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-3xl p-8 md:p-12 border border-gray-100 dark:border-gray-800 shadow-lg relative overflow-hidden"
          >
            {/* Background decoration */}
            <div className={`absolute -right-20 -top-20 w-64 h-64 rounded-full blur-3xl opacity-10 pointer-events-none ${result.isPassed ? 'bg-success' : 'bg-danger'}`} />

            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              
              <div className="flex-1 text-center md:text-left">
                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold tracking-wider mb-6 border ${
                  result.isPassed ? 'bg-success/10 text-success border-success/20' : 'bg-danger/10 text-danger border-danger/20'
                }`}>
                  {result.isPassed ? <CheckCircle className="w-4 h-4" aria-hidden="true"/> : <XCircle className="w-4 h-4" aria-hidden="true"/>}
                  {result.isPassed ? 'EXAM PASSED' : 'EXAM FAILED'}
                </div>
                
                <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-2">{result.summaryMessage}</h2>
                <p className="text-lg text-gray-500 dark:text-gray-400 mb-8">
                  You scored <span className="font-bold text-gray-900 dark:text-white">{result.score}</span> out of {result.totalMarks} possible marks.
                </p>

                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <div className="bg-cream dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 min-w-[140px]">
                    <div className="flex items-center gap-2 text-gray-500 mb-1 font-medium"><Clock className="w-4 h-4" aria-hidden="true"/> Time Taken</div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">{formatTime(result.timeTaken)}</div>
                  </div>
                  <div className="bg-cream dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 min-w-[140px]">
                    <div className="flex items-center gap-2 text-gray-500 mb-1 font-medium"><Award className="w-4 h-4" aria-hidden="true"/> Date</div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">{new Date(result.date).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>

              {/* Animated Circular Progress */}
              <div className="relative w-56 h-56 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90 drop-shadow-xl" viewBox="0 0 100 100" aria-hidden="true">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" className="text-gray-100 dark:text-gray-800" strokeWidth="8" />
                  <motion.circle 
                    initial={{ strokeDasharray: "0 263.89" }}
                    animate={{ strokeDasharray: `${(result.percentage / 100) * 263.89} 263.89` }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                    cx="50" cy="50" r="42" fill="none" 
                    stroke="currentColor" 
                    className={result.isPassed ? 'text-success' : 'text-danger'} 
                    strokeWidth="8" strokeLinecap="round" 
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter">{result.percentage}%</span>
                  <span className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-1">Score</span>
                </div>
              </div>
            </div>
          </motion.section>

          {/* ─── Breakdown Chart ─── */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-lg flex flex-col"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
              <BarChart3 className="w-5 h-5 text-primary" /> Metrics
            </h3>
            
            <div className="h-48 relative mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} innerRadius={55} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                    {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip content={<LightPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Center text for pie chart */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black text-gray-900 dark:text-white">{result.totalQuestions}</span>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Questions</span>
              </div>
            </div>

            <div className="mt-auto space-y-3 text-sm font-bold">
              <div className="flex justify-between items-center p-3 rounded-xl bg-success/5 border border-success/10 text-success">
                <span className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-success"/>Correct Answers</span>
                <span className="text-lg">{result.correct}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-danger/5 border border-danger/10 text-danger">
                <span className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-danger"/>Wrong Answers</span>
                <span className="text-lg">{result.wrong}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-cream dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-700">
                <span className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-gray-400"/>Unanswered</span>
                <span className="text-lg">{result.unanswered}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ─── Detailed Answer Review ─── */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-lg"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">Detailed Answer Review</h3>
            <span className="px-4 py-1.5 bg-primary/10 text-primary font-bold rounded-full text-sm">
              {result.totalQuestions} Questions
            </span>
          </div>

          <div className="space-y-6">
            {result.questions?.map((q, idx) => {
              const isCorrect = q.selectedAnswer === q.correctAnswer;
              const isUnanswered = !q.selectedAnswer;
              
              let containerStyle = "bg-cream dark:bg-gray-800/50 border-gray-200 dark:border-gray-700";
              let icon = <MinusCircle className="w-6 h-6 text-gray-400 shrink-0 mt-0.5" />;
              
              if (isCorrect) {
                containerStyle = "bg-success/5 border-success/20";
                icon = <CheckCircle className="w-6 h-6 text-success shrink-0 mt-0.5" />;
              } else if (!isUnanswered) {
                containerStyle = "bg-danger/5 border-danger/20";
                icon = <XCircle className="w-6 h-6 text-danger shrink-0 mt-0.5" />;
              }

              return (
                <div key={idx} className={`p-6 border-2 rounded-2xl transition-colors ${containerStyle}`}>
                  <div className="flex items-start gap-4">
                    {icon}
                    <div className="flex-1">
                      <div className="flex justify-between gap-4 mb-4">
                        <p className="font-bold text-gray-900 dark:text-white text-lg">
                          <span className="text-gray-400 mr-2">Q{idx + 1}.</span> {q.question || 'Question text not available'}
                        </p>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Your Answer</span>
                          <span className={`font-medium text-lg ${isCorrect ? 'text-success' : isUnanswered ? 'text-gray-400' : 'text-danger'}`}>
                            {q.selectedAnswer || 'Left Blank'}
                          </span>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Correct Answer</span>
                          <span className="font-medium text-lg text-success">{q.correctAnswer}</span>
                        </div>
                      </div>
                      
                      {q.explanation && (
                        <div className="mt-4 p-4 bg-primary/5 border border-primary/10 rounded-xl text-primary font-medium text-sm">
                          <span className="font-bold mr-2">Explanation:</span> {q.explanation}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

      </main>
    </PageTransition>
  );
};

export default ResultPage;
