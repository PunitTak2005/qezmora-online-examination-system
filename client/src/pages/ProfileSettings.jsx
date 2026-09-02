import React, { useState, useEffect } from 'react';
import { 
  User, Lock, Settings, Activity, Camera, Shield, Save, CheckCircle, 
  AlertCircle, Eye, EyeOff, Bell, Moon, Sun, Award, BookOpen, GraduationCap, 
  Briefcase, Users, FileText, Check, Clock, RefreshCcw, Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import PageTransition from '../components/PageTransition';
import StatCard from '../components/StatCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { getAvatarUrl } from '../utils/avatarUrl';

const ProfileSettings = () => {
  const { user: authUser, updateUser } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();

  const [activeTab, setActiveTab] = useState('personal'); // personal, security, preferences, activity
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Profile Form Data
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    course: '',
    address: '',
    bio: '',
    avatar: ''
  });

  // Password Form Data
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Preferences State
  const [preferences, setPreferences] = useState({
    darkMode: darkMode || false,
    emailNotifications: true,
    examReminders: true,
    resultNotifications: true
  });

  // Role Statistics & Activity
  const [roleStats, setRoleStats] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);

  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/users/profile');
      if (res.data.success) {
        const u = res.data.user || res.data.data?.user || res.data.data;
        setProfileData({
          name: u.name || '',
          email: u.email || '',
          phone: u.phone || '',
          college: u.college || '',
          course: u.course || '',
          address: u.address || '',
          bio: u.bio || '',
          avatar: u.avatar || ''
        });
        if (u.preferences) {
          setPreferences(u.preferences);
        }
        if (res.data.data?.roleStats) {
          setRoleStats(res.data.data.roleStats);
        }
        
        // Generate activity list based on user
        setRecentActivity([
          { id: 1, action: 'Profile settings retrieved', time: new Date().toISOString(), icon: User },
          { id: 2, action: 'Logged into Qezmora Examination System', time: new Date(Date.now() - 3600000).toISOString(), icon: Shield },
          { id: 3, action: 'Security credentials verified', time: new Date(Date.now() - 86400000).toISOString(), icon: Lock }
        ]);
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      setError(err.response?.data?.message || 'Failed to load profile data.');
      toast.error('Failed to load profile data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Update Personal Info
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profileData.name.trim()) return toast.error('Full Name is required');
    if (!profileData.email.trim()) return toast.error('Email is required');

    setSavingProfile(true);
    try {
      const res = await api.put('/users/profile', {
        ...profileData,
        preferences
      });
      if (res.data.success) {
        toast.success('Profile updated successfully!');
        if (updateUser) {
          updateUser(res.data.user || res.data.data);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  // Change Password
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwordData.oldPassword) return toast.error('Current password is required');
    if (!passwordData.newPassword) return toast.error('New password is required');
    if (passwordData.newPassword.length < 6) return toast.error('Password must be at least 6 characters');
    if (passwordData.newPassword !== passwordData.confirmPassword) return toast.error('New passwords do not match');

    setSavingPassword(true);
    try {
      const res = await api.patch('/users/change-password', {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });
      if (res.data.success) {
        toast.success('Password changed successfully!');
        setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setSavingPassword(false);
    }
  };

  // Instant Avatar Preview & Upload
  const [previewAvatar, setPreviewAvatar] = useState(null);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype || file.type)) {
      return toast.error('Unsupported file type. Please upload a JPG, JPEG, PNG, or WebP image.');
    }

    if (file.size > 5 * 1024 * 1024) {
      return toast.error('File size exceeds 5 MB. Please select a smaller image.');
    }

    // Instant Preview
    const localBlobUrl = URL.createObjectURL(file);
    setPreviewAvatar(localBlobUrl);

    const formData = new FormData();
    formData.append('avatar', file);

    setUploadingAvatar(true);
    try {
      const res = await api.patch('/users/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        const avatarUrl = res.data.avatar || res.data.data;
        const updatedUser = res.data.user || { ...authUser, avatar: avatarUrl };
        
        setProfileData(prev => ({ ...prev, avatar: avatarUrl }));
        setPreviewAvatar(null);
        toast.success('Profile photo updated successfully!');

        // Update global user state across Navbar, Sidebar, and App
        if (updateUser) {
          updateUser(updatedUser);
        }
      }
    } catch (err) {
      setPreviewAvatar(null);
      toast.error(err.response?.data?.message || 'Failed to upload profile photo.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!window.confirm('Are you sure you want to remove your profile photo?')) return;

    setUploadingAvatar(true);
    try {
      const res = await api.delete('/users/profile/avatar');
      if (res.data.success) {
        setProfileData(prev => ({ ...prev, avatar: '' }));
        setPreviewAvatar(null);
        toast.success('Profile photo removed!');

        const updatedUser = res.data.user || { ...authUser, avatar: '' };
        if (updateUser) {
          updateUser(updatedUser);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove profile photo.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Toggle Preference Switches
  const handlePreferenceToggle = async (key) => {
    const updated = { ...preferences, [key]: !preferences[key] };
    setPreferences(updated);
    if (key === 'darkMode' && toggleDarkMode) {
      toggleDarkMode();
    }
    try {
      await api.put('/users/profile', { preferences: updated });
      toast.success('Preference saved!');
    } catch (err) {
      toast.error('Failed to save preference.');
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'teacher':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'student':
      default:
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
    }
  };

  if (loading) return (
    <div className="max-w-6xl mx-auto space-y-6 p-4">
      <LoadingSkeleton height="200px" />
      <LoadingSkeleton height="400px" />
    </div>
  );

  if (error) return (
    <div className="text-center py-20 px-4 max-w-md mx-auto">
      <div className="w-16 h-16 bg-danger/10 text-danger rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Failed to Load Profile</h3>
      <p className="text-gray-500 text-sm mb-6">{error}</p>
      <button onClick={fetchProfile} className="btn bg-primary text-white font-bold px-6 py-2.5 rounded-xl gap-2 shadow-lg inline-flex items-center">
        <RefreshCcw className="w-4 h-4" /> Retry Connection
      </button>
    </div>
  );

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto space-y-8 font-sans pb-20 text-gray-900 dark:text-gray-50">
        
        {/* Header Profile Card */}
        <div className="bg-white dark:bg-gray-900 p-8 md:p-10 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center md:items-start gap-8">
          
          {/* Avatar Area */}
          <div className="flex flex-col items-center gap-3 shrink-0">
            <div className="relative group">
              {previewAvatar || profileData.avatar ? (
                <img 
                  src={getAvatarUrl(previewAvatar || profileData.avatar)} 
                  alt={profileData.name} 
                  className="w-28 h-28 rounded-full object-cover border-4 border-primary/20 shadow-lg transition-all"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    setProfileData(prev => ({ ...prev, avatar: '' }));
                  }}
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-primary text-white font-black text-3xl flex items-center justify-center border-4 border-primary/20 shadow-lg">
                  {getInitials(profileData.name)}
                </div>
              )}

              <label 
                className="absolute bottom-0 right-0 bg-gold hover:bg-gold-light text-primary p-2.5 rounded-full cursor-pointer shadow-md transition-transform group-hover:scale-110"
                title="Choose new photo"
              >
                {uploadingAvatar ? (
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Camera className="w-4 h-4 font-bold" />
                )}
                <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={handleAvatarUpload} className="hidden" />
              </label>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 text-xs font-bold">
              <label className="cursor-pointer text-primary dark:text-gold hover:underline flex items-center gap-1">
                <Camera className="w-3.5 h-3.5" />
                <span>Upload Photo</span>
                <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={handleAvatarUpload} className="hidden" />
              </label>

              {(profileData.avatar || previewAvatar) && (
                <>
                  <span className="text-gray-300 dark:text-gray-700">•</span>
                  <button 
                    type="button" 
                    onClick={handleRemoveAvatar} 
                    className="text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* User Details */}
          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
              <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                {profileData.name || authUser?.name}
              </h1>
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${getRoleBadgeStyle(authUser?.role)}`}>
                {authUser?.role || 'User'}
              </span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">
              {profileData.email || authUser?.email}
            </p>
            {profileData.bio && (
              <p className="text-gray-600 dark:text-gray-300 text-sm max-w-xl leading-relaxed italic">
                "{profileData.bio}"
              </p>
            )}
            <div className="pt-2 flex flex-wrap gap-4 text-xs font-bold text-gray-400 justify-center md:justify-start">
              <span>Joined {new Date(authUser?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
              {profileData.college && <span>• {profileData.college}</span>}
              {profileData.phone && <span>• {profileData.phone}</span>}
            </div>
          </div>

          {/* Refresh Action */}
          <button onClick={fetchProfile} className="btn bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 p-2.5 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" title="Reload Profile">
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Role Statistics Bar */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {authUser?.role === 'student' && (
            <>
              <StatCard title="Exams Attempted" value={roleStats.examsAttempted || 0} icon={BookOpen} colorClass="bg-primary/10 text-primary" />
              <StatCard title="Average Score" value={`${roleStats.avgScore || 0}%`} icon={Award} colorClass="bg-gold/10 text-gold" delay={0.1} />
              <StatCard title="Exams Passed" value={roleStats.passedExams || 0} icon={CheckCircle} colorClass="bg-emerald-100 text-emerald-600" delay={0.2} />
            </>
          )}

          {authUser?.role === 'teacher' && (
            <>
              <StatCard title="Exams Created" value={roleStats.examsCreated || 0} icon={FileText} colorClass="bg-primary/10 text-primary" />
              <StatCard title="Questions Added" value={roleStats.questionsAdded || 0} icon={CheckCircle} colorClass="bg-blue-100 text-blue-600" delay={0.1} />
              <StatCard title="Students Reached" value={roleStats.studentsReached || 0} icon={Users} colorClass="bg-gold/10 text-gold" delay={0.2} />
            </>
          )}

          {authUser?.role === 'admin' && (
            <>
              <StatCard title="Users Managed" value={roleStats.usersManaged || 0} icon={Users} colorClass="bg-purple-100 text-purple-600" />
              <StatCard title="Categories Managed" value={roleStats.categoriesManaged || 0} icon={Briefcase} colorClass="bg-gold/10 text-gold" delay={0.1} />
              <StatCard title="System Exams" value={roleStats.systemExams || 0} icon={FileText} colorClass="bg-emerald-100 text-emerald-600" delay={0.2} />
            </>
          )}
        </section>

        {/* Settings Navigation Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-800 gap-4 overflow-x-auto">
          {[
            { id: 'personal', label: 'Personal Information', icon: User },
            { id: 'security', label: 'Security & Password', icon: Lock },
            { id: 'preferences', label: 'Preferences', icon: Settings },
            { id: 'activity', label: 'Recent Activity', icon: Activity }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 px-2 font-bold text-sm flex items-center gap-2 border-b-2 transition-colors shrink-0 ${
                  activeTab === tab.id
                    ? 'border-primary text-primary dark:text-gold'
                    : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: Personal Information */}
        {activeTab === 'personal' && (
          <form onSubmit={handleProfileSubmit} className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-6">Personal Details</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="font-bold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Full Name *</label>
                <input 
                  type="text" 
                  value={profileData.name} 
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-800 dark:bg-gray-950 dark:text-white font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="Punit Tak"
                />
              </div>

              <div className="space-y-2">
                <label className="font-bold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Email Address *</label>
                <input 
                  type="email" 
                  value={profileData.email} 
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-800 dark:bg-gray-950 dark:text-white font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="punittak2005@gmail.com"
                />
              </div>

              <div className="space-y-2">
                <label className="font-bold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Phone Number</label>
                <input 
                  type="text" 
                  value={profileData.phone} 
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-800 dark:bg-gray-950 dark:text-white font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="+91 63676088841"
                />
              </div>

              <div className="space-y-2">
                <label className="font-bold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">College / Institution</label>
                <input 
                  type="text" 
                  value={profileData.college} 
                  onChange={(e) => setProfileData({ ...profileData, college: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-800 dark:bg-gray-950 dark:text-white font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="Techno India NJR Institute of Technology"
                />
              </div>

              <div className="space-y-2">
                <label className="font-bold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Course / Department</label>
                <input 
                  type="text" 
                  value={profileData.course} 
                  onChange={(e) => setProfileData({ ...profileData, course: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-800 dark:bg-gray-950 dark:text-white font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="Computer Science & Engineering"
                />
              </div>

              <div className="space-y-2">
                <label className="font-bold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Address / Location</label>
                <input 
                  type="text" 
                  value={profileData.address} 
                  onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-800 dark:bg-gray-950 dark:text-white font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="184 B Block, Sector 14, Udaipur, Rajasthan, India"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-bold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Short Bio</label>
              <textarea 
                rows="3"
                value={profileData.bio} 
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-800 dark:bg-gray-950 dark:text-white font-medium focus:ring-2 focus:ring-primary focus:outline-none resize-none"
                placeholder="Passionate learner and exam administrator..."
              />
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              <button type="button" onClick={fetchProfile} className="btn btn-outline">Cancel</button>
              <button type="submit" disabled={savingProfile} className="btn bg-primary hover:bg-primary-dark text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-primary/20 flex items-center gap-2">
                {savingProfile ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: Security & Password */}
        {activeTab === 'security' && (
          <form onSubmit={handlePasswordSubmit} className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-6 max-w-2xl">
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-6">Change Password</h2>

            <div className="space-y-2">
              <label className="font-bold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Current Password *</label>
              <div className="relative">
                <input 
                  type={showOldPassword ? 'text' : 'password'} 
                  value={passwordData.oldPassword} 
                  onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                  className="w-full px-4 py-3.5 pr-12 rounded-xl border border-gray-200 dark:border-gray-800 dark:bg-gray-950 dark:text-white font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowOldPassword(!showOldPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showOldPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-bold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">New Password *</label>
              <div className="relative">
                <input 
                  type={showNewPassword ? 'text' : 'password'} 
                  value={passwordData.newPassword} 
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-4 py-3.5 pr-12 rounded-xl border border-gray-200 dark:border-gray-800 dark:bg-gray-950 dark:text-white font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="At least 6 characters"
                />
                <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-bold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Confirm New Password *</label>
              <input 
                type="password" 
                value={passwordData.confirmPassword} 
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-800 dark:bg-gray-950 dark:text-white font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                placeholder="Re-type new password"
              />
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
              <button type="submit" disabled={savingPassword} className="btn bg-primary hover:bg-primary-dark text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-primary/20 flex items-center gap-2">
                {savingPassword ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    <span>Update Password</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: Preferences */}
        {activeTab === 'preferences' && (
          <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-6 max-w-3xl">
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-6">Account Preferences</h2>

            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              
              {/* Dark Mode */}
              <div className="py-4 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    {darkMode ? <Moon className="w-4 h-4 text-gold" /> : <Sun className="w-4 h-4 text-amber-500" />}
                    Dark Theme Mode
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Toggle between light and dark UI themes.</p>
                </div>
                <button 
                  onClick={() => handlePreferenceToggle('darkMode')}
                  className={`w-12 h-6 rounded-full transition-colors relative p-1 ${darkMode ? 'bg-primary' : 'bg-gray-300'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Email Notifications */}
              <div className="py-4 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Bell className="w-4 h-4 text-primary" /> Email Notifications
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Receive system updates and announcements via email.</p>
                </div>
                <button 
                  onClick={() => handlePreferenceToggle('emailNotifications')}
                  className={`w-12 h-6 rounded-full transition-colors relative p-1 ${preferences.emailNotifications ? 'bg-primary' : 'bg-gray-300'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${preferences.emailNotifications ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Exam Reminders */}
              <div className="py-4 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gold" /> Exam Reminders
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Get reminders prior to upcoming scheduled exams.</p>
                </div>
                <button 
                  onClick={() => handlePreferenceToggle('examReminders')}
                  className={`w-12 h-6 rounded-full transition-colors relative p-1 ${preferences.examReminders ? 'bg-primary' : 'bg-gray-300'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${preferences.examReminders ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Result Notifications */}
              <div className="py-4 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" /> Result Notifications
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Get instant score notifications after completing an assessment.</p>
                </div>
                <button 
                  onClick={() => handlePreferenceToggle('resultNotifications')}
                  className={`w-12 h-6 rounded-full transition-colors relative p-1 ${preferences.resultNotifications ? 'bg-primary' : 'bg-gray-300'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${preferences.resultNotifications ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

            </div>
          </div>
        )}

        {/* TAB 4: Recent Activity */}
        {activeTab === 'activity' && (
          <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-6">Recent Account Activity</h2>

            <div className="relative border-l-2 border-primary/20 ml-4 space-y-6">
              {recentActivity.map(item => {
                const ItemIcon = item.icon || Activity;
                return (
                  <div key={item.id} className="relative pl-6">
                    <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center">
                      <ItemIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white text-sm">{item.action}</p>
                      <p className="text-xs text-gray-400 mt-1">{new Date(item.time).toLocaleString()}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </PageTransition>
  );
};

export default ProfileSettings;
