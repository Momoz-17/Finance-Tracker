import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Lock, ShieldCheck, Loader2, KeyRound, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();
  
  const user = JSON.parse(localStorage.getItem('user')) || { username: "User", email: "Email not found" };

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event("storage")); 
    navigate('/auth'); 
  };

  const requestOtp = async () => {
    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      // In Profile, we call send-otp which uses the current logged-in user session
      const { data } = await API.post('/auth/send-otp');
      setOtpSent(true);
      setMessage({ type: "success", text: data.message });
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to send OTP" });
    } finally {
      setLoading(false);
    }
  };

  const onChangePassword = async (data) => {
    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      const { data: resData } = await API.put('/auth/change-password', {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
        otp: data.otp 
      });
      setMessage({ type: "success", text: resData.message });
      reset(); 
      setOtpSent(false);
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to change password" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-xl font-bold hover:bg-rose-100 transition-all border border-rose-100"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 text-center sticky top-6">
            <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-xl font-bold text-slate-900">{user.username}</h2>
            <p className="text-slate-500 text-sm mb-6">{user.email}</p>
            
            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl text-slate-600 text-sm">
                <ShieldCheck size={18} className="text-indigo-500" /> <span>Account Verified</span>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <KeyRound className="text-indigo-600" /> Security Settings
            </h2>

            {message.text && (
              <div className={`mb-6 p-4 rounded-xl text-sm font-medium border ${
                message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'
              }`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit(onChangePassword)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Current Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input 
                    type="password"
                    {...register("oldPassword", { required: "Current password is required" })}
                    className="pl-10 w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
                {errors.oldPassword && <p className="text-rose-500 text-xs mt-1">{errors.oldPassword.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input 
                    type="password"
                    {...register("newPassword", { 
                      required: "New password is required",
                      minLength: { value: 6, message: "Minimum 6 characters" }
                    })}
                    className="pl-10 w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
                {errors.newPassword && <p className="text-rose-500 text-xs mt-1">{errors.newPassword.message}</p>}
              </div>

              {!otpSent ? (
                <button 
                  type="button"
                  onClick={requestOtp}
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : "Verify via Email OTP"}
                </button>
              ) : (
                <>
                  <div className="animate-in fade-in duration-500">
                    <label className="block text-sm font-medium text-slate-600 mb-2">Enter OTP</label>
                    <input 
                      type="text"
                      placeholder="6-digit OTP"
                      {...register("otp", { required: "OTP is required" })}
                      className="w-full p-3 bg-indigo-50 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-center tracking-widest"
                    />
                    {errors.otp && <p className="text-rose-500 text-xs mt-1">{errors.otp.message}</p>}
                  </div>

                  <button 
                    disabled={loading}
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : "Confirm Password Change"}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setOtpSent(false)} 
                    className="w-full text-slate-400 text-xs hover:underline"
                  >
                    Change details or re-send OTP
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;