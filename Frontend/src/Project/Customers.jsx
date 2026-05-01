import { useState } from 'react';
import { FiSearch, FiFilter, FiMoreHorizontal, FiMessageCircle, FiUser, FiActivity } from "react-icons/fi";
import { motion } from "framer-motion";

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Example Premium Data
  const customers = [
    { id: 1, name: "Akash Sharma", email: "akash@mail.com", status: "Active", plan: "Premium", lastActive: "2 hours ago", sentiment: "Happy" },
    { id: 2, name: "Rohit Verma", email: "rohit@mail.com", status: "Inactive", plan: "Free", lastActive: "1 day ago", sentiment: "Neutral" },
    { id: 3, name: "Priya Singh", email: "priya@mail.com", status: "Active", plan: "Returning", lastActive: "30 mins ago", sentiment: "Frustrated" },
  ];

  return (
    <div className="p-8 bg-[#020617] min-h-screen text-slate-200">
      {/* Header with Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Customer Directory
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage and monitor your enterprise clients.</p>
        </div>
        
        {/* Quick Stats Cards */}
        <div className="flex gap-4">
           <div className="bg-[#0f172a] border border-slate-800 p-3 px-6 rounded-2xl">
              <p className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Active Now</p>
              <p className="text-xl font-bold text-green-400">1,284</p>
           </div>
           <div className="bg-[#0f172a] border border-slate-800 p-3 px-6 rounded-2xl">
              <p className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Premium Rate</p>
              <p className="text-xl font-bold text-indigo-400">42%</p>
           </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex gap-3 mb-8">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search by name, email or company..."
            className="w-full bg-[#0f172a] border border-slate-800 rounded-xl py-3 pl-12 pr-4 focus:border-indigo-500 outline-none transition-all text-sm"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="bg-[#0f172a] border border-slate-800 p-3 rounded-xl hover:bg-slate-800 transition">
          <FiFilter />
        </button>
      </div>

      {/* Premium Customer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map((customer) => (
          <motion.div 
            whileHover={{ y: -5 }}
            key={customer.id} 
            className="bg-[#0f172a] border border-slate-800 rounded-[2rem] p-6 relative overflow-hidden group"
          >
            {/* Background Glow Effect */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-600/5 blur-[80px] group-hover:bg-indigo-600/10 transition-all" />

            <div className="flex justify-between items-start mb-6">
              <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                customer.status === 'Active' ? 'bg-green-500/10 text-green-400' : 'bg-rose-500/10 text-rose-400'
              }`}>
                {customer.status}
              </div>
              <button className="text-slate-600 hover:text-white transition">
                <FiMoreHorizontal size={20} />
              </button>
            </div>

            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-20 h-20 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl flex items-center justify-center border border-slate-700 shadow-inner group-hover:border-indigo-500/50 transition-colors">
                <FiUser size={32} className="text-slate-400 group-hover:text-indigo-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold">{customer.name}</h3>
                <p className="text-slate-500 text-sm">{customer.email}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-center gap-2">
               <span className="bg-indigo-500/10 text-indigo-400 text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-tighter">
                {customer.plan}
               </span>
               <span className={`text-[10px] font-black px-3 py-1 rounded-lg uppercase ${
                 customer.sentiment === 'Happy' ? 'bg-green-500/10 text-green-400' : 
                 customer.sentiment === 'Frustrated' ? 'bg-orange-500/10 text-orange-400' : 'bg-slate-700/30 text-slate-400'
               }`}>
                 {customer.sentiment}
               </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-8">
              <button className="flex items-center justify-center gap-2 bg-slate-800/50 hover:bg-slate-800 py-3 rounded-2xl text-xs font-bold transition">
                <FiActivity size={14}/> Profile
              </button>
              <button className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 py-3 rounded-2xl text-xs font-bold transition shadow-lg shadow-indigo-600/20">
                <FiMessageCircle size={14}/> Chat
              </button>
            </div>
            
            <p className="text-center text-[10px] text-slate-600 mt-4">Last interaction: {customer.lastActive}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}