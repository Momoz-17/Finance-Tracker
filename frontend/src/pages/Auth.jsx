import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Lock, User, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const Auth = () => {
  const [mode, setMode] = useState('signin'); 
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();
  const userEmail = watch("email");

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError("");
    setSuccessMessage("");

    try {
      if (mode === 'signup') {
        const { data: resData } = await API.post('/auth/signup', {
          username: data.username,
          email: data.email,
          password: data.password
        });
        setSuccessMessage(resData.message);
        setMode('otp'); 
      } 
      else if (mode === 'otp') {
        const { data: resData } = await API.post('/auth/verify-otp', {
          email: userEmail,
          otp: data.otp
        });
        setSuccessMessage(resData.message);
        setMode('signin');
      } 
      else if (mode === 'signin') {
        const { data: resData } = await API.post('/auth/signin', {
          email: data.email,
          password: data.password
        });
        localStorage.setItem('token', resData.token);
        localStorage.setItem('user', JSON.stringify(resData.user));
        window.dispatchEvent(new Event("storage")); 
        navigate('/');
      }
      else if (mode === 'forget') {
        await API.post('/auth/forget-password', { email: data.email });
        setSuccessMessage("OTP sent to your email!");
        setMode('reset');
      }
      else if (mode === 'reset') {
        await API.post('/auth/reset-password', {
          email: userEmail,
          otp: data.otp,
          newPassword: data.newPassword
        });
        alert("Password updated successfully!");
        setMode('signin');
        reset();
      }
    } catch (err) {
      setServerError(err.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">
            {mode === 'signin' && 'Welcome Back'}
            {mode === 'signup' && 'Create Account'}
            {mode === 'otp' && 'Verify Email'}
            {mode === 'forget' && 'Forgot Password'}
            {mode === 'reset' && 'Set New Password'}
          </h1>
          
          {serverError && (
            <div className="mt-4 p-3 bg-rose-50 text-rose-600 text-sm rounded-xl border border-rose-100 font-medium">
              {serverError}
            </div>
          )}

          {successMessage && !serverError && (
            <div className="mt-4 p-3 bg-emerald-50 text-emerald-600 text-sm rounded-xl border border-emerald-100 font-medium">
              {successMessage}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <div className="relative">
                <User className="absolute left-3 top-3.5 text-slate-400" size={18} />
                <input 
                  {...register("username", { required: "Name is required" })}
                  type="text" 
                  placeholder="Full Name" 
                  className={`w-full pl-10 pr-4 py-3 bg-slate-50 border ${errors.username ? 'border-rose-500' : 'border-slate-200'} rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all`} 
                />
              </div>
              {errors.username && <p className="text-rose-500 text-xs mt-1 ml-1">{errors.username.message}</p>}
            </div>
          )}

          {(mode !== 'otp' && mode !== 'reset') && (
            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
                <input 
                  {...register("email", { 
                    required: "Email is required", 
                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" } 
                  })}
                  type="email" 
                  placeholder="Email Address" 
                  className={`w-full pl-10 pr-4 py-3 bg-slate-50 border ${errors.email ? 'border-rose-500' : 'border-slate-200'} rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all`} 
                />
              </div>
              {errors.email && <p className="text-rose-500 text-xs mt-1 ml-1">{errors.email.message}</p>}
            </div>
          )}

          {(mode === 'otp' || mode === 'reset') && (
            <div>
               <p className="text-sm text-slate-500 mb-2 text-center">Enter the code sent to {userEmail}</p>
               <div className="relative">
                <ShieldCheck className="absolute left-3 top-3.5 text-slate-400" size={18} />
                <input 
                  {...register("otp", { required: "OTP is required", minLength: {value: 6, message: "Enter 6 digits"} })}
                  type="text" 
                  maxLength="6"
                  placeholder="6-Digit Code" 
                  className="w-full pl-10 pr-4 py-3 bg-indigo-50 border border-indigo-200 rounded-xl outline-none tracking-[0.5em] font-bold text-center focus:ring-2 focus:ring-indigo-500 transition-all" 
                />
              </div>
              {errors.otp && <p className="text-rose-500 text-xs mt-1 ml-1 text-center">{errors.otp.message}</p>}
            </div>
          )}

          {mode === 'reset' && (
            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
                <input 
                  {...register("newPassword", { 
                    required: "New password is required", 
                    minLength: { value: 6, message: "Minimum 6 characters" } 
                  })}
                  type="password" 
                  placeholder="New Password" 
                  className={`w-full pl-10 pr-4 py-3 bg-slate-50 border ${errors.newPassword ? 'border-rose-500' : 'border-slate-200'} rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all`} 
                />
              </div>
              {errors.newPassword && <p className="text-rose-500 text-xs mt-1 ml-1">{errors.newPassword.message}</p>}
            </div>
          )}

          {(mode === 'signin' || mode === 'signup') && (
            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
                <input 
                  {...register("password", { 
                    required: "Password is required", 
                    minLength: { value: 6, message: "Minimum 6 characters" } 
                  })}
                  type="password" 
                  placeholder="Password" 
                  className={`w-full pl-10 pr-4 py-3 bg-slate-50 border ${errors.password ? 'border-rose-500' : 'border-slate-200'} rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all`} 
                />
              </div>
              {errors.password && <p className="text-rose-500 text-xs mt-1 ml-1">{errors.password.message}</p>}
            </div>
          )}

          <button 
            disabled={loading}
            type="submit" 
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
              <>
                {mode === 'otp' && 'Verify Account'}
                {mode === 'reset' && 'Update Password'}
                {mode === 'forget' && 'Send Reset Code'}
                {(mode === 'signin' || mode === 'signup') && 'Continue'}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-50 text-center space-y-3">
          {mode === 'signin' && (
            <>
              <button onClick={() => { setMode('forget'); setServerError(""); setSuccessMessage(""); }} className="text-sm text-indigo-600 font-medium hover:underline">Forgot Password?</button>
              <p className="text-sm text-slate-500">Don't have an account? <button onClick={() => { setMode('signup'); setServerError(""); setSuccessMessage(""); }} className="text-indigo-600 font-semibold">Sign Up</button></p>
            </>
          )}
          {mode === 'signup' && (
            <p className="text-sm text-slate-500">Already have an account? <button onClick={() => { setMode('signin'); setServerError(""); setSuccessMessage(""); }} className="text-indigo-600 font-semibold">Sign In</button></p>
          )}
          {(mode === 'forget' || mode === 'otp' || mode === 'reset') && (
            <button onClick={() => { setMode('signin'); setServerError(""); setSuccessMessage(""); }} className="text-sm text-indigo-600 font-medium">Back to Login</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;