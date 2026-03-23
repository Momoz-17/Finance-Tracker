import React from 'react';
import { Filter, Trash2 } from 'lucide-react';
import API from '../api/axios'; // This uses your interceptor to send the token

const TransactionList = ({ transactions, setTransactions }) => {
  const list = transactions || [];

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        // 1. Backend Call: The route matches router.route('/:id').delete(...)
        await API.delete(`/transactions/${id}`);
        
        // 2. UI Update: Filter the state so the item disappears immediately
        setTransactions(prev => prev.filter(item => item._id !== id));
        
        alert("Transaction deleted successfully!");
      } catch (err) {
        console.error("Delete error:", err);
        alert("Failed to delete transaction. Please check if you are logged in.");
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Filter Bar */}
      <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          <select className="text-xs border rounded-md p-1.5 outline-none bg-white">
            <option>All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select className="text-xs border rounded-md p-1.5 outline-none bg-white">
            <option>Sort by Date</option>
            <option>Sort by Amount</option>
          </select>
        </div>
        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <Filter size={16} /> <span className="hidden sm:inline">Filters</span>
        </div>
      </div>

      {/* Table Section */}
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
            {list.length > 0 ? (
              list.map((item) => (
                <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-slate-900">{item.description}</div>
                    <div className={`text-xs font-medium ${item.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-500">
                    {new Date(item.date).toLocaleDateString()}
                  </td>
                  <td className={`p-4 text-right font-bold ${item.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {item.type === 'income' ? '+' : '-'}₹{item.amount.toLocaleString()}
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => handleDelete(item._id)} 
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-full transition-colors"
                      title="Delete Transaction"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-8 text-center text-slate-400 text-sm">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Bar */}
      <div className="p-4 border-t border-slate-100 flex justify-between items-center text-sm text-slate-500">
        <span>Showing {list.length} transactions</span>
        <div className="flex gap-2">
          <button className="px-3 py-1 border rounded hover:bg-slate-50 transition-colors">Prev</button>
          <button className="px-3 py-1 border rounded hover:bg-slate-50 transition-colors">Next</button>
        </div>
      </div>
    </div>
  );
};

export default TransactionList;