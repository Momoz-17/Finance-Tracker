import React, { useEffect, useState, useMemo } from 'react';
import API from '../api/axios'; 
import TransactionForm from '../components/TransactionForm';
import { 
  ArrowUpCircle, ArrowDownCircle, Wallet, Filter, 
  ChevronLeft, ChevronRight, Trash2, RefreshCw 
} from 'lucide-react';

const Home = () => {
  const [data, setData] = useState({
    transactions: [],
    stats: { balance: 0, income: 0, expense: 0 },
    totalPages: 1
  });
  
  const [page, setPage] = useState(1);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // For manual refreshes
  
  const initialFilters = useMemo(() => ({
    type: 'all',
    sortBy: 'date',
    order: 'desc',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: ''
  }), []);

  const [filters, setFilters] = useState(initialFilters);

  // logic moved inside useEffect to kill the cascading render warning
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const { type, sortBy, order, startDate, endDate, minAmount, maxAmount } = filters;
        
        let url = `/transactions?page=${page}&type=${type}&sortBy=${sortBy}&order=${order}`;
        if (startDate) url += `&startDate=${startDate}`;
        if (endDate) url += `&endDate=${endDate}`;
        if (minAmount) url += `&minAmount=${minAmount}`;
        if (maxAmount) url += `&maxAmount=${maxAmount}`;

        const res = await API.get(url); 
        
        let income = 0;
        let expense = 0;
        res.data.transactions.forEach(t => {
          const amt = Number(t.amount);
          if (t.type === 'income') income += amt;
          else expense += amt;
        });

        setData({
          transactions: res.data.transactions,
          totalPages: res.data.totalPages,
          stats: { income, expense, balance: income - expense }
        });
      } catch (err) {
        console.error("Error fetching transactions", err);
      }
    };

    loadTransactions();
  }, [page, filters, refreshTrigger]); // Only re-runs when these change

  const handleReset = () => {
    setFilters(initialFilters);
    setPage(1);
  };

  const handleTransactionAdded = () => {
    setRefreshTrigger(prev => prev + 1); // Triggers the useEffect
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await API.delete(`/transactions/${id}`); 
        setRefreshTrigger(prev => prev + 1); 
      } catch (err) {
        console.error("Error deleting transaction", err);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 bg-slate-50 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600"><Wallet size={24}/></div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Balance</p>
              <h3 className="text-2xl font-bold text-slate-900">₹{data.stats.balance.toLocaleString()}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-emerald-600">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 rounded-xl"><ArrowUpCircle size={24}/></div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Income</p>
              <h3 className="text-2xl font-bold">+₹{data.stats.income.toLocaleString()}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-rose-600">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-rose-50 rounded-xl"><ArrowDownCircle size={24}/></div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Expense</p>
              <h3 className="text-2xl font-bold">-₹{data.stats.expense.toLocaleString()}</h3>
            </div>
          </div>
        </div>
      </div>

      <TransactionForm onTransactionAdded={handleTransactionAdded} />

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 my-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold">
            <Filter size={20} className="text-indigo-600" />
            <span>Advanced Filters</span>
          </div>
          <button onClick={handleReset} className="flex items-center gap-1 text-xs text-indigo-600 font-medium hover:underline">
            <RefreshCw size={14} /> Reset Filters
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <select 
            value={filters.type}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none"
            onChange={(e) => { setFilters({...filters, type: e.target.value}); setPage(1); }}
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select 
            value={filters.sortBy}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none"
            onChange={(e) => { setFilters({...filters, sortBy: e.target.value}); setPage(1); }}
          >
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
          </select>

          <div className="flex items-center gap-2">
            <input 
              type="date" 
              value={filters.startDate}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-xs outline-none"
              onChange={(e) => { setFilters({...filters, startDate: e.target.value}); setPage(1); }}
            />
            <span className="text-slate-400">-</span>
            <input 
              type="date" 
              value={filters.endDate}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-xs outline-none"
              onChange={(e) => { setFilters({...filters, endDate: e.target.value}); setPage(1); }}
            />
          </div>

          <div className="flex items-center gap-2">
            <input 
              type="number" 
              value={filters.minAmount}
              placeholder="Min ₹"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none"
              onChange={(e) => { setFilters({...filters, minAmount: e.target.value}); setPage(1); }}
            />
            <input 
              type="number" 
              value={filters.maxAmount}
              placeholder="Max ₹"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none"
              onChange={(e) => { setFilters({...filters, maxAmount: e.target.value}); setPage(1); }}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-8">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-900">Recent Transactions</h2>
          <span className="text-xs text-slate-400">Showing {data.transactions.length} items</span>
        </div>
        <div className="divide-y divide-slate-50">
          {data.transactions.length === 0 ? (
            <div className="p-16 text-center text-slate-400">No transactions found.</div>
          ) : (
            data.transactions.map((t) => (
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
                  <button onClick={() => handleDelete(t._id)} className="text-slate-300 hover:text-rose-600 transition-colors p-2">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {data.totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-4 pb-12">
          <button 
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="p-2 bg-white border border-slate-200 rounded-lg disabled:opacity-30 hover:bg-slate-50"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="font-medium text-slate-600 text-sm">Page {page} of {data.totalPages}</span>
          <button 
            disabled={page === data.totalPages}
            onClick={() => setPage(p => p + 1)}
            className="p-2 bg-white border border-slate-200 rounded-lg disabled:opacity-30 hover:bg-slate-50"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;