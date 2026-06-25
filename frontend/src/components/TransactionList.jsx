import React from 'react';
import { Filter, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import API from '../api/axios';

const TransactionList = ({ 
  transactions = [], 
  onRefresh, 
  filters, 
  setFilters, 
  page, 
  setPage, 
  totalPages 
}) => {

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        // Backend API call matching the router delete pattern
        await API.delete(`/transactions/${id}`);
        
        // Notify the parent view to instantly update state metrics and records
        if (onRefresh) {
          onRefresh();
        }
        
        alert("Transaction deleted successfully!");
      } catch (err) {
        console.error("Delete error:", err);
        alert("Failed to delete transaction. Please check your authentication state.");
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Filter Action Strip */}
      <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          <select 
            value={filters?.type || 'all'} 
            onChange={(e) => {
              setFilters(prev => ({ ...prev, type: e.target.value }));
              setPage(1);
            }}
            className="text-xs border rounded-md p-1.5 outline-none bg-white cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          
          <select 
            value={filters?.sortBy || 'date'} 
            onChange={(e) => {
              setFilters(prev => ({ ...prev, sortBy: e.target.value }));
              setPage(1);
            }}
            className="text-xs border rounded-md p-1.5 outline-none bg-white cursor-pointer"
          >
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
          </select>
        </div>
        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <Filter size={16} /> <span className="hidden sm:inline">Active Ledger Views</span>
        </div>
      </div>

      {/* Tabular Records Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
              <th className="p-4 font-semibold">Description</th>
              <th className="p-4 font-semibold">Date</th>
              <th className="p-4 font-semibold text-right">Amount</th>
              <th className="p-4 font-semibold text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {transactions.length > 0 ? (
              transactions.map((item) => (
                <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-slate-900">{item.description}</div>
                    <div className={`text-xs font-medium ${item.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {item.type.charAt(0).toUpperCase() + item.type.slice(1)} • <span className="text-slate-400 font-normal">{item.category || 'General'}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-500">
                    {new Date(item.date).toLocaleDateString()}
                  </td>
                  <td className={`p-4 text-right font-bold ${item.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {item.type === 'income' ? '+' : '-'}₹{Number(item.amount).toLocaleString()}
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => handleDelete(item._id)} 
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-full transition-colors border-none bg-transparent cursor-pointer"
                      title="Delete Transaction"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-12 text-center text-slate-400 text-sm font-medium">
                  No active transactional history entries match these options.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Dynamic Pagination Controls */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-slate-100 flex justify-between items-center text-sm text-slate-500">
          <span>Showing {transactions.length} records on Page {page}</span>
          <div className="flex gap-2">
            <button 
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              className="px-2 py-1 border rounded hover:bg-slate-50 transition-colors disabled:opacity-30 cursor-pointer flex items-center"
            >
              <ChevronLeft size={16} /> Prev
            </button>
            <button 
              disabled={page === totalPages}
              onClick={() => setPage(p => Math.min(p + 1, totalPages))}
              className="px-2 py-1 border rounded hover:bg-slate-50 transition-colors disabled:opacity-30 cursor-pointer flex items-center"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionList;