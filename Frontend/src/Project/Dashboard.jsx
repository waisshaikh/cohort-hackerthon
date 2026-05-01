import React from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Users as UsersIcon, 
  Settings, 
  Zap, 
  TrendingUp, 
  Search 
} from 'lucide-react';

const Dashboard = () => {
  // Stat Cards Data
  const stats = [
    { label: "Total Queries", value: "45.2k", icon: MessageSquare, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Active Users", value: "1,284", icon: UsersIcon, color: "text-purple-600", bg: "bg-purple-100" },
    { label: "API Uptime", value: "99.9%", icon: Zap, color: "text-green-600", bg: "bg-green-100" },
    { label: "Avg Response", value: "0.4s", icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-100" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Admin Overview</h1>
            <p className="text-slate-500">Monitor your AI bot performance</p>
          </div>
          <div className="flex gap-4 items-center bg-white p-2 rounded-xl shadow-sm border border-slate-100">
             <Search size={18} className="text-slate-400 ml-2" />
             <input type="text" placeholder="Search data..." className="outline-none text-sm w-48" />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                <stat.icon size={24} />
              </div>
              <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* Users Table (Wahi grid jo humne fix ki thi) */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 text-lg">Recent Team Activity</h3>
            <button className="text-blue-600 text-sm font-semibold hover:underline">View All</button>
          </div>

          <div className="min-w-[800px]">
             {/* Header Grid */}
            <div className="grid grid-cols-[3fr_1fr_1.5fr_1fr] gap-4 font-semibold text-slate-500 text-sm border-b py-4 px-8 bg-slate-50/50">
              <p>USER</p>
              <p>ROLE</p>
              <p className="text-center">JOINED</p>
              <p className="text-right">ACTION</p>
            </div>

            {/* Row Grid */}
            <div className="divide-y divide-slate-100">
              <UserRow name="Akash" email="akash@showtime.com" role="Admin" date="27 Apr 2026" />
              <UserRow name="Rahul" email="rahul@dev.com" role="User" date="26 Apr 2026" />
              <UserRow name="Ritu" email="ritu@ai.com" role="Admin" date="24 Apr 2026" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Reusable Components
const NavItem = ({ icon, label, active = false }) => (
  <div className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
    active ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
  }`}>
    {icon}
    <span className="font-medium">{label}</span>
  </div>
);

const UserRow = ({ name, email, role, date }) => (
  <div className="grid grid-cols-[3fr_1fr_1.5fr_1fr] gap-4 items-center px-8 py-4 hover:bg-slate-50/50 transition-colors group">
    <div className="flex items-center gap-3 min-w-0">
      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-200 to-slate-100 flex-shrink-0" />
      <div className="truncate">
        <p className="font-bold text-slate-800 leading-tight">{name}</p>
        <p className="text-xs text-slate-400 truncate">{email}</p>
      </div>
    </div>
    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg w-fit ${
      role === 'Admin' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-600'
    }`}>{role}</span>
    <p className="text-sm text-slate-500 text-center">{date}</p>
    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
      <button className="text-blue-600 font-bold text-sm hover:underline">Edit</button>
      <button className="text-red-400 font-bold text-sm hover:underline">Remove</button>
    </div>
  </div>
);

export default Dashboard;