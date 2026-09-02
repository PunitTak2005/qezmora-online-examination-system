import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import PageTransition from '../../components/PageTransition';
import { User, Mail, Camera, Lock } from 'lucide-react';

const StudentProfilePage = () => {
  const { user, updateUser } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { name: user?.name, college: user?.college, course: user?.course, phone: user?.phone }
  });
  const { register: registerPwd, handleSubmit: handlePwdSubmit, formState: { errors: pwdErrors }, reset: resetPwd } = useForm();
  
  const [loading, setLoading] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);
  const [avatar, setAvatar] = useState(user?.avatar || null);

  const onProfileSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await api.put('/auth/profile', data);
      updateUser(res.data.user);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const onPasswordSubmit = async (data) => {
    setPwdLoading(true);
    try {
      await api.put('/auth/change-password', data);
      toast.success('Password changed successfully');
      resetPwd();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPwdLoading(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const res = await api.post('/auth/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setAvatar(res.data.avatarUrl);
      updateUser({ avatar: res.data.avatarUrl });
      toast.success('Avatar updated');
    } catch (err) {
      toast.error('Failed to upload avatar');
    }
  };

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your account information.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-6">
            <div className="card card-p flex flex-col items-center">
              <div className="relative mb-4 group">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 border-4 border-white dark:border-gray-800 shadow-lg">
                  {avatar ? (
                    <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-300">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full cursor-pointer shadow-lg hover:bg-primary/90 transition">
                  <Camera className="w-4 h-4" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </label>
              </div>
              <h3 className="text-xl font-bold">{user?.name}</h3>
              <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
            </div>
            
            <div className="card card-p">
              <h4 className="font-semibold mb-4">Account Stats</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Joined</span><span className="font-medium">{new Date(user?.createdAt || Date.now()).toLocaleDateString()}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Status</span><span className="font-medium text-success">Active</span></div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="card card-p">
              <h3 className="text-lg font-bold mb-6">Personal Information</h3>
              <form onSubmit={handleSubmit(onProfileSubmit)} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="label-base">Full Name</label>
                    <input type="text" {...register('name', { required: 'Name is required' })} className="input-base" />
                    {errors.name && <p className="text-xs text-danger mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="label-base text-gray-500">Email Address (Read-only)</label>
                    <input type="email" value={user?.email} disabled className="input-base bg-cream dark:bg-gray-800 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="label-base">College/Institution</label>
                    <input type="text" {...register('college')} className="input-base" />
                  </div>
                  <div>
                    <label className="label-base">Course/Major</label>
                    <input type="text" {...register('course')} className="input-base" />
                  </div>
                  <div>
                    <label className="label-base">Phone Number</label>
                    <input type="text" {...register('phone')} className="input-base" />
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <button type="submit" disabled={loading} className="btn btn-primary">
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>

            <div className="card card-p">
              <h3 className="text-lg font-bold mb-6">Change Password</h3>
              <form onSubmit={handlePwdSubmit(onPasswordSubmit)} className="space-y-4 max-w-md">
                <div>
                  <label className="label-base">Current Password</label>
                  <input type="password" {...registerPwd('oldPassword', { required: 'Required' })} className="input-base" />
                </div>
                <div>
                  <label className="label-base">New Password</label>
                  <input type="password" {...registerPwd('newPassword', { required: 'Required', minLength: { value: 6, message: 'Min 6 chars' } })} className="input-base" />
                  {pwdErrors.newPassword && <p className="text-xs text-danger mt-1">{pwdErrors.newPassword.message}</p>}
                </div>
                <div className="flex justify-end pt-2">
                  <button type="submit" disabled={pwdLoading} className="btn btn-secondary">
                    {pwdLoading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default StudentProfilePage;
