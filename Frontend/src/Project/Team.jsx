import { useState } from 'react';
import { FiUserPlus, FiShield, FiActivity, FiMail, FiLock, FiUser, FiCheckCircle, FiX } from "react-icons/fi";
import { IoRocketOutline, IoPeopleOutline } from "react-icons/io5";

export default function Team() {
  const [showInvite, setShowInvite] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "Agent" });
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInvite = (e) => {
    e.preventDefault();
    console.log("New Agent Data:", formData);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setShowInvite(false);
      setFormData({ name: "", email: "", password: "", role: "Agent" });
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-8 font-sans selection:bg-indigo-500/30">
      <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Header Section */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">
              <FiShield /> Access Control
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-white">Team <span className="text-indigo-500">Workspace</span></h1>
            <p className="text-slate-400 max-w-xl text-sm font-medium leading-relaxed">
              Scale your support operations by onboarding agents and defining neural access roles.
            </p>
          </div>

          <button 
            onClick={() => setShowInvite(true)}
            className="group relative inline-flex items-center gap-3 rounded-2xl bg-white px-8 py-4 text-sm font-bold text-black hover:bg-indigo-50 transition-all active:scale-95 shadow-2xl"
          >
            <FiUserPlus className="text-indigo-600" /> Invite Agent
          </button>
        </div>

        {/* Premium Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Active Agents", value: "04", icon: <IoPeopleOutline />, color: "text-blue-400" },
            { label: "Avg Response", value: "1.2m", icon: <FiActivity />, color: "text-emerald-400" },
            { label: "Open Slots", value: "Unlimited", icon: <IoRocketOutline />, color: "text-purple-400" },
          ].map((stat, i) => (
            <div key={i} className="p-6 rounded-[2rem] border border-slate-800 bg-[#0f172a]/40 backdrop-blur-xl flex items-center justify-between group hover:border-slate-700 transition-all">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
                <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
              </div>
              <div className={`p-4 rounded-2xl bg-slate-900/50 ${stat.color} text-xl group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Invite Modal Overlay */}
        {showInvite && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020617]/80 backdrop-blur-md">
            <div className="w-full max-w-lg rounded-[2.5rem] border border-white/10 bg-[#0f172a] p-1 shadow-3xl overflow-hidden relative animate-in zoom-in-95 duration-300">
              {isSuccess ? (
                <div className="p-12 text-center space-y-6 animate-in fade-in">
                   <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto text-emerald-500 border border-emerald-500/20">
                      <FiCheckCircle size={40} className="animate-bounce" />
                   </div>
                   <h2 className="text-2xl font-bold text-white">Agent Invitation Sent</h2>
                   <p className="text-slate-400 text-sm">Credentials have been generated for {formData.name}.</p>
                </div>
              ) : (
                <div className="p-8 space-y-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white">New Agent Onboarding</h3>
                    <button onClick={() => setShowInvite(false)} className="p-2 hover:bg-white/5 rounded-full text-slate-500"><FiX /></button>
                  </div>

                  <form onSubmit={handleInvite} className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Agent Name</label>
                      <div className="relative">
                        <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                        <input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} type="text" placeholder="Ganesh Rajput" className="w-full rounded-2xl border border-slate-800 bg-[#020617] py-4 pl-12 pr-4 text-sm outline-none focus:border-indigo-500/50 transition-all" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                      <div className="relative">
                        <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                        <input required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} type="email" placeholder="agent@tenantdesk.ai" className="w-full rounded-2xl border border-slate-800 bg-[#020617] py-4 pl-12 pr-4 text-sm outline-none focus:border-indigo-500/50 transition-all" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Initial Password</label>
                      <div className="relative">
                        <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                        <input required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} type="password" placeholder="••••••••" className="w-full rounded-2xl border border-slate-800 bg-[#020617] py-4 pl-12 pr-4 text-sm outline-none focus:border-indigo-500/50 transition-all" />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
                       <FiShield className="text-indigo-400" />
                       <span className="text-xs font-bold text-slate-400">Default Role: <span className="text-indigo-400">Support Agent</span></span>
                    </div>

                    <button type="submit" className="w-full bg-indigo-600 py-4 rounded-2xl font-bold text-white hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20">
                      Generate Access Link
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Empty State / Directory Placeholder */}
        <div className="rounded-[3rem] border border-slate-800 bg-[#0f172a] p-2 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="rounded-[2.8rem] border border-dashed border-slate-800 bg-[#020617]/50 p-24 text-center space-y-6 relative z-10">
            <div className="w-20 h-20 bg-[#0f172a] rounded-3xl mx-auto flex items-center justify-center text-slate-800 border border-slate-800 shadow-inner">
               <IoPeopleOutline size={40} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-400">Awaiting Team Integration</h3>
              <p className="max-w-md mx-auto text-sm text-slate-600 leading-relaxed italic">
                Once the backend exposes users and role APIs, you'll be able to manage agent assignments and track live performance metrics.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}