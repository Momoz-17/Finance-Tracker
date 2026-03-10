import React from 'react';
import { Filter, ArrowUpDown, Calendar } from 'lucide-react';

const TransactionList = ({ transactions }) => {
  // Check if transactions exist to avoid crashing
  const list = transactions || [];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Filter Bar */}
      <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
           <select className="text-xs border rounded-md p-1.5 outline-none bg-white"><option>All Types</option></select>
           <select className="text-xs border rounded-md p-1.5 outline-none bg-white"><option>Sort by Date</option></select>
        </div>
        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <Filter size={16} /> <span className="hidden sm:inline">Filters</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
              <th className="p-4 font-semibold">Description</th>
              <th className="p-4 font-semibold">Date</th>
              <th className="p-4 font-semibold text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {list.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4">
                  <div className="font-medium text-slate-900">{item.description}</div>
                  <div className={`text-xs font-medium ${item.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                  </div>
                </td>
                <td className="p-4 text-sm text-slate-500">{item.date}</td>
                <td className={`p-4 text-right font-bold ${item.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {item.type === 'income' ? '+' : '-'}${item.amount.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
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

// THIS IS THE LINE YOU ARE MISSING:
export default TransactionList;