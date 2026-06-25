import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  PlusCircle, 
  IndianRupee, 
  FileText, 
  AlertCircle, 
  Loader2, 
  Tag, 
  Calendar 
} from 'lucide-react';
import API from '../api/axios';

const TransactionForm = ({ onTransactionAdded }) => {
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  const defaultValues = {
    type: 'expense',
    description: '',
    category: 'General',
    amount: '',
    date: new Date().toISOString().split('T')[0]
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues });

  const onSubmit = async (data) => {
    setLoading(true);
    setStatusMsg({ type: '', text: '' });
    
    try {
      const response = await API.post('/transactions', {
        ...data,
        amount: parseFloat(data.amount)
      });

      if (response.status === 201) {
        reset(defaultValues);
        setStatusMsg({ type: 'success', text: 'Transaction added successfully!' });
        if (onTransactionAdded) onTransactionAdded(); 
        
        setTimeout(() => setStatusMsg({ type: '', text: '' }), 3000);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to add transaction.";
      setStatusMsg({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <PlusCircle className="text-indigo-600" size={20} /> Add New Transaction
        </h2>
        {statusMsg.text && (
          <span className={`text-xs font-medium px-3 py-1 rounded-full ${
            statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
          }`}>
            {statusMsg.text}
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start">
        {/* Type Selection */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500 uppercase ml-1">Type</label>
          <select 
            {...register("type", { required: "Required" })}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm transition-all cursor-pointer"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        {/* Description Input */}
        <div className="space-y-1 lg:col-span-2 xl:col-span-1">
          <label className="text-xs font-semibold text-slate-500 uppercase ml-1">Description</label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="e.g. Monthly Rent" 
              {...register("description", { required: "Required" })}
              className={`pl-10 w-full p-2.5 bg-slate-50 border ${errors.description ? 'border-rose-500' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm`} 
            />
          </div>
        </div>

        {/* Category Selection */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500 uppercase ml-1">Category</label>
          <div className="relative">
            <Tag className="absolute left-3 top-3 text-slate-400" size={18} />
            <select 
              {...register("category")}
              className="pl-10 w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm transition-all cursor-pointer"
            >
              <option value="General">General</option>
              <option value="Food">Food</option>
              <option value="Rent">Rent</option>
              <option value="Salary">Salary</option>
              <option value="Shopping">Shopping</option>
              <option value="Leisure">Leisure</option>
            </select>
          </div>
        </div>

        {/* Amount Input */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500 uppercase ml-1">Amount</label>
          <div className="relative">
            <IndianRupee className="absolute left-3 top-3 text-slate-400" size={18} />
            <input 
              type="number" 
              step="0.01"
              placeholder="0.00" 
              {...register("amount", { 
                required: "Required",
                min: { value: 0.01, message: "Min 0.01" }
              })}
              className={`pl-10 w-full p-2.5 bg-slate-50 border ${errors.amount ? 'border-rose-500' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm`} 
            />
          </div>
        </div>

        {/* Date Input */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500 uppercase ml-1">Date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 text-slate-400" size={18} />
            <input 
              type="date" 
              {...register("date", { required: "Required" })}
              className="pl-10 w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm transition-all cursor-pointer" 
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="xl:pt-5">
          <button 
            disabled={loading}
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold py-2.5 rounded-xl transition-all shadow-sm active:scale-95 flex items-center justify-center min-h-[44px] text-sm cursor-pointer"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Add Entry"}
          </button>
        </div>
      </form>
      
      {/* Error Helpers */}
      <div className="mt-3 flex gap-4 h-4">
         {errors.description && <p className="text-rose-500 text-[10px] flex items-center gap-1 font-medium"><AlertCircle size={10}/> Description is required</p>}
         {errors.amount && <p className="text-rose-500 text-[10px] flex items-center gap-1 font-medium"><AlertCircle size={10}/> {errors.amount.message}</p>}
      </div>
    </div>
  );
};

export default TransactionForm;