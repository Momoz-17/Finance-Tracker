import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import TransactionForm from '../components/TransactionForm';
import { 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Wallet, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  Trash2,
  Calendar,
  IndianRupee
} from 'lucide-react';

const Home = () => {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({ balance: 0, income: 0, expense: 0 });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // 1. Updated Filter States to include Date and Amount ranges
  const [filters, setFilters] = useState({
    type: 'all',
    sortBy: 'date',
    order: 'desc',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: ''
  });

  const fetchTransactions = async () => {
    try {
      const { type, sortBy, order, startDate, endDate, minAmount, maxAmount } = filters;
      
      // 2. Build dynamic query string
      let url = `/transactions?page=${page}&type=${type}&sortBy=${sortBy}&order=${order}`;
      if (startDate) url += `&startDate=${startDate}`;
      if (endDate) url += `&endDate=${endDate}`;
      if (minAmount) url += `&minAmount=${minAmount}`;
      if (maxAmount) url += `&maxAmount=${maxAmount}`;

      const res = await API.get(url);
      
      setTransactions(res.data.transactions);
      setTotalPages(res.data.totalPages);
      calculateStats(res.data.transactions);
    } catch (err) {
      console.error("Error fetching transactions", err);
    }
  };

  const calculateStats = (data) => {
    let income = 0;
    let expense = 0;
    data.forEach(t => {
      const amt = Number(t.amount);
      if (t.type === 'income') income += amt;
      else expense += amt;
    });
    setStats({ income, expense, balance: income - expense });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await API.delete(`/transactions/${id}`);
        fetchTransactions();
      } catch (err) {
        console.error("Error deleting transaction", err);
      }
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchTransactions();
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filters]);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      {/* Stats Cards (Kept as per your code) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600"><Wallet size={24}/></div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Balance</p>
              <h3 className="text-2xl font-bold text-slate-900">₹{stats.balance.toLocaleString()}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600"><ArrowUpCircle size={24}/></div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Income</p>
              <h3 className="text-2xl font-bold text-emerald-600">+₹{stats.income.toLocaleString()}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-rose-50 rounded-xl text-rose-600"><ArrowDownCircle size={24}/></div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Expense</p>
              <h3 className="text-2xl font-bold text-rose-600">-₹{stats.expense.toLocaleString()}</h3>
            </div>
          </div>
        </div>
      </div>

      <TransactionForm onTransactionAdded={fetchTransactions} />

      {/* 3. NEW: Expanded Filter Toolbar */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 my-6">
        <div className="flex items-center gap-2 text-slate-900 font-bold mb-4">
          <Filter size={20} className="text-indigo-600" />
          <span>Advanced Filters</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Basic Type Select */}
          <select 
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none"
            onChange={(e) => { setFilters({...filters, type: e.target.value}); setPage(1); }}
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          {/* Sort Select */}
          <select 
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none"
            onChange={(e) => { setFilters({...filters, sortBy: e.target.value}); setPage(1); }}
          >
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
          </select>

          {/* Date Range Inputs */}
          <div className="flex items-center gap-2 lg:col-span-1">
            <input 
              type="date" 
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-xs outline-none"
              onChange={(e) => { setFilters({...filters, startDate: e.target.value}); setPage(1); }}
            />
            <span className="text-slate-400">-</span>
            <input 
              type="date" 
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-xs outline-none"
              onChange={(e) => { setFilters({...filters, endDate: e.target.value}); setPage(1); }}
            />
          </div>

          {/* Amount Range Inputs */}
          <div className="flex items-center gap-2">
            <input 
              type="number" 
              placeholder="Min ₹"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none"
              onChange={(e) => { setFilters({...filters, minAmount: e.target.value}); setPage(1); }}
            />
            <input 
              type="number" 
              placeholder="Max ₹"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none"
              onChange={(e) => { setFilters({...filters, maxAmount: e.target.value}); setPage(1); }}
            />
          </div>
        </div>
      </div>

      {/* Transaction List (Mapping) */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50">
          <h2 className="text-lg font-bold text-slate-900">Recent Transactions</h2>
        </div>
        <div className="divide-y divide-slate-50">
          {transactions.length === 0 ? (
            <p className="p-10 text-center text-slate-400">No transactions found.</p>
          ) : (
            transactions.map((t) => (
              <div key={t._id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className={`w-1.5 h-10 rounded-full ${t.type === 'income' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  <div>
                    <p className="font-semibold text-slate-900">{t.description}</p>
                    <p className="text-xs text-slate-400">{new Date(t.date).toLocaleDateString()} • {t.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <p className={`font-bold ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString()}
                  </p>
                  <button 
                    onClick={() => handleDelete(t._id)}
                    className="text-slate-300 hover:text-rose-600 transition-colors md:opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8 pb-8">
          <button 
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="p-2 bg-white border border-slate-200 rounded-lg disabled:opacity-30 hover:bg-slate-50 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="font-medium text-slate-600 text-sm">Page {page} of {totalPages}</span>
          <button 
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            className="p-2 bg-white border border-slate-200 rounded-lg disabled:opacity-30 hover:bg-slate-50 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;