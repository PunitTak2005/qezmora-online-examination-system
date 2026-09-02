import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import Navbar from './components/Navbar';
import LoadingSkeleton from './components/LoadingSkeleton';

// Public Pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const ExamsPage = lazy(() => import('./pages/ExamsPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const CategoryDetailPage = lazy(() => import('./pages/CategoryDetailPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const RefundsPage = lazy(() => import('./pages/RefundsPage'));
const SecurityPage = lazy(() => import('./pages/SecurityPage'));

// Student Pages
const StudentDashboard = lazy(() => import('./pages/student/StudentDashboard'));
const ExamListPage = lazy(() => import('./pages/student/ExamListPage'));
const ExamDetailPage = lazy(() => import('./pages/student/ExamDetailPage'));
const ExamPage = lazy(() => import('./pages/student/ExamPage'));
const ResultPage = lazy(() => import('./pages/student/ResultPage'));
const AttemptHistoryPage = lazy(() => import('./pages/student/AttemptHistoryPage'));
const LeaderboardPage = lazy(() => import('./pages/student/LeaderboardPage'));
const StudentProfilePage = lazy(() => import('./pages/student/StudentProfilePage'));

// Teacher Pages
const TeacherDashboard = lazy(() => import('./pages/teacher/TeacherDashboard'));
const ExamManagementPage = lazy(() => import('./pages/teacher/ExamManagementPage'));
const CreateExamPage = lazy(() => import('./pages/teacher/CreateExamPage'));
const QuestionBankPage = lazy(() => import('./pages/teacher/QuestionBankPage'));
const ExamResultsPage = lazy(() => import('./pages/teacher/ExamResultsPage'));

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const CategoryManagementPage = lazy(() => import('./pages/admin/CategoryManagementPage'));
const UserManagementPage = lazy(() => import('./pages/admin/UserManagementPage'));
const ExamManagementAdminPage = lazy(() => import('./pages/admin/ExamManagementAdminPage'));
const ContactMessagesPage = lazy(() => import('./pages/admin/ContactMessagesPage'));
const ExamIntegrityPage = lazy(() => import('./pages/admin/ExamIntegrityPage'));

// Profile Settings Page
const ProfileSettings = lazy(() => import('./pages/ProfileSettings'));

// 404 Page
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

import { useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

const PublicLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-grow">{children}</main>
    <Footer />
  </div>
);

function App() {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<div className="p-8"><LoadingSkeleton /></div>}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout><LandingPage /></PublicLayout>} />
          <Route path="/exams" element={<PublicLayout><ExamsPage /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
          <Route path="/privacy" element={<PublicLayout><PrivacyPage /></PublicLayout>} />
          <Route path="/terms" element={<PublicLayout><TermsPage /></PublicLayout>} />
          <Route path="/refunds" element={<PublicLayout><RefundsPage /></PublicLayout>} />
          <Route path="/security" element={<PublicLayout><SecurityPage /></PublicLayout>} />
          <Route path="/categories/:slug" element={<PublicLayout><CategoryDetailPage /></PublicLayout>} />
          <Route path="/login" element={<PublicLayout><LoginPage /></PublicLayout>} />
          <Route path="/register" element={<PublicLayout><RegisterPage /></PublicLayout>} />
          <Route path="/signup" element={<PublicLayout><RegisterPage /></PublicLayout>} />
          <Route path="/forgot-password" element={<PublicLayout><ForgotPasswordPage /></PublicLayout>} />
          <Route path="/reset-password/:token" element={<PublicLayout><ResetPasswordPage /></PublicLayout>} />

          {/* Student Routes */}
          <Route path="/student/exam/:id/take" element={<ProtectedRoute allowedRoles={['student']}><ExamPage /></ProtectedRoute>} />
          
          <Route path="/student" element={<ProtectedRoute allowedRoles={['student']}><DashboardLayout /></ProtectedRoute>}>
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="exams" element={<ExamListPage />} />
            <Route path="exams/:id" element={<ExamDetailPage />} />
            <Route path="results/:attemptId" element={<ResultPage />} />
            <Route path="history" element={<AttemptHistoryPage />} />
            <Route path="leaderboard" element={<LeaderboardPage />} />
            <Route path="profile" element={<ProfileSettings />} />
          </Route>

          {/* Teacher Routes */}
          <Route path="/teacher" element={<ProtectedRoute allowedRoles={['teacher']}><DashboardLayout /></ProtectedRoute>}>
            <Route path="dashboard" element={<TeacherDashboard />} />
            <Route path="exams" element={<ExamManagementPage />} />
            <Route path="exams/create" element={<CreateExamPage />} />
            <Route path="exams/:id/edit" element={<CreateExamPage />} />
            <Route path="exams/:id/questions" element={<QuestionBankPage />} />
            <Route path="exams/:id/results" element={<ExamResultsPage />} />
            <Route path="profile" element={<ProfileSettings />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout /></ProtectedRoute>}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="categories" element={<CategoryManagementPage />} />
            <Route path="users" element={<UserManagementPage />} />
            <Route path="exams" element={<ExamManagementAdminPage />} />
            <Route path="integrity" element={<ExamIntegrityPage />} />
            <Route path="contact-messages" element={<ContactMessagesPage />} />
            <Route path="profile" element={<ProfileSettings />} />
          </Route>

          {/* Standalone Shared Profile Route */}
          <Route path="/profile" element={<ProtectedRoute allowedRoles={['student', 'teacher', 'admin']}><DashboardLayout><ProfileSettings /></DashboardLayout></ProtectedRoute>} />

          {/* 404 Fallback Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
    </>
  );
}

export default App;
