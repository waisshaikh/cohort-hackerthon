import { useState } from 'react';
import { FiSearch, FiFilter, FiUserPlus, FiUsers, FiMail, FiLock, FiUser, FiCheckCircle } from "react-icons/fi";
import { IoShieldCheckmarkOutline } from "react-icons/io5";

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddMember, setShowAddMember] = useState(false);
  
  // --- FORM STATE ---
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Agent" // Team requirement: Role agent rahega
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  // Input change handle karne ke liye
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit handle karne ke liye
  const handleRegister = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Backend integration yahan hoga, abhi ke liye hum console pe data dekh rahe hain
    console.log("Team Member Registered:", formData);

    // Fake API Delay (Premium Feel)
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMsg(true);
      
      // 3 second baad message hatane ke liye
      setTimeout(() => {
        setSuccessMsg(false);
        setShowAddMember(false);
        setFormData({ name: "", email: "", password: "", role: "Agent" });
      }, 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-8 font-sans selection:bg-indigo-500/30">
      <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Header Section */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-slate-800/50 pb-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tighter text-white">Customer <span className="text-indigo-500">Directory</span></h1>
            <p className="text-slate-400 max-w-xl text-sm font-medium leading-relaxed">
              Manage your global tenant base and team agents in one unified workspace.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => setShowAddMember(!showAddMember)}
              className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white hover:bg-indigo-500 transition-all active:scale-95 shadow-lg shadow-indigo-600/20"
            >
              <FiUserPlus /> {showAddMember ? "Close Form" : "Add Team Member"}
            </button>
          </div>
        </div>

        {/* --- DYNAMIC FORM SECTION --- */}
        {showAddMember && (
          <div className="rounded-[2rem] border border-indigo-500/20 bg-[#0f172a] p-8 shadow-2xl animate-in zoom-in-95 duration-300 relative overflow-hidden">
            {successMsg && (
              <div className="absolute inset-0 z-50 bg-[#0f172a]/90 backdrop-blur-sm flex flex-col items-center justify-center text-center animate-in fade-in duration-300">
                <div className="bg-emerald-500/20 p-4 rounded-full mb-4">
                  <FiCheckCircle className="text-emerald-500" size={48} />
                </div>
                <h3 className="text-2xl font-bold text-white">Agent Registered!</h3>
                <p className="text-slate-400 mt-2">Data sent to backend console successfully.</p>
              </div>
            )}

            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400">
                <FiUserPlus size={24} />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">Onboard New Agent</h3>
            </div>

            <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input 
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    type="text" 
                    placeholder="Ganesh Rajput" 
                    className="w-full rounded-2xl border border-slate-800 bg-[#020617] py-3.5 pl-12 pr-4 text-sm outline-none focus:border-indigo-500/50" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input 
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email" 
                    placeholder="agent@tenantdesk.ai" 
                    className="w-full rounded-2xl border border-slate-800 bg-[#020617] py-3.5 pl-12 pr-4 text-sm outline-none focus:border-indigo-500/50" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Set Password</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input 
                    required
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    type="password" 
                    placeholder="••••••••" 
                    className="w-full rounded-2xl border border-slate-800 bg-[#020617] py-3.5 pl-12 pr-4 text-sm outline-none focus:border-indigo-500/50" 
                  />
                </div>
              </div>
              
              <div className="md:col-span-3 flex items-center justify-between pt-4">
                <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/5 px-3 py-1.5 rounded-xl border border-emerald-500/10">
                  <IoShieldCheckmarkOutline size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Role: {formData.role}</span>
                </div>
                <button 
                  disabled={isSubmitting}
                  className="bg-white text-black px-8 py-3.5 rounded-2xl font-bold hover:scale-105 transition-all shadow-xl disabled:opacity-50"
                >
                  {isSubmitting ? "Processing..." : "Confirm Registration"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Main Directory Area */}
        <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-800 bg-[#0f172a] p-1 shadow-2xl">
          <div className="p-10 relative z-10">
            <div className="rounded-[2rem] border border-dashed border-slate-800 bg-[#020617]/50 p-20 text-center space-y-6">
              <div className="p-6 bg-[#0f172a] rounded-full inline-block text-slate-700">
                <FiUsers size={48} />
              </div>
              <h3 className="text-lg font-bold text-slate-400">Database Connection Pending</h3>
              <p className="text-sm text-slate-600 max-w-sm mx-auto italic leading-relaxed">
                Connect your backend to see your registered agents and customers appearing here in real-time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}