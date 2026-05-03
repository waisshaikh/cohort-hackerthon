import { useState, useEffect } from "react";
import { FiUser, FiMoon, FiShield, FiLogOut, FiEdit3, FiMail, FiGlobe, FiBell } from "react-icons/fi";
import { IoSparkles } from "react-icons/io5";

export default function Setting() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved === "dark";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div className={`min-h-screen transition-colors duration-700 flex justify-center p-4 md:p-10 
      ${darkMode ? "bg-[#020617] text-slate-100" : "bg-[#f8fafc] text-slate-900"}`}>
      
      {/* Background Ambient Glows (Only visible in Dark Mode) */}
      {darkMode && (
        <>
          <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none"></div>
          <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none"></div>
        </>
      )}

      <div className="w-full max-w-5xl space-y-10 relative z-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-500 font-bold text-xs uppercase tracking-[0.3em] mb-2">
              <IoSparkles /> Configuration
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter">System Settings</h1>
          </div>
          <div className="flex gap-2">
             <div className="px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-xs font-bold">
               V 2.0.4
             </div>
          </div>
        </header>

        {/* 1. ULTRA PREMIUM PROFILE CARD */}
        <div className={`group relative rounded-[3rem] p-[1px] transition-all duration-500 overflow-hidden shadow-2xl
          ${darkMode ? "bg-gradient-to-br from-slate-700/50 to-slate-900/50" : "bg-gradient-to-br from-slate-200 to-white"}`}>
          
          <div className={`relative rounded-[3rem] p-8 md:p-12 backdrop-blur-3xl transition-all
            ${darkMode ? "bg-slate-950/80" : "bg-white/90"}`}>
            
            <div className="flex flex-col md:flex-row items-center gap-10">
              {/* Avatar with Animated Ring */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 to-purple-500 rounded-[2.5rem] blur-md opacity-40 group-hover:opacity-80 transition-opacity"></div>
                <div className="relative w-32 h-32 rounded-[2.5rem] bg-[#020617] border-2 border-white/10 flex items-center justify-center overflow-hidden">
                  <span className="text-5xl font-black bg-gradient-to-br from-white to-slate-500 bg-clip-text text-transparent">G</span>
                </div>
                <button className="absolute -bottom-2 -right-2 p-3 bg-white text-black rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all">
                  <FiEdit3 size={18} />
                </button>
              </div>

              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-black mb-2 tracking-tight">Ganesh Rajput</h2>
                <p className="text-slate-500 font-medium flex items-center justify-center md:justify-start gap-2 mb-6">
                  <FiMail className="text-indigo-500" /> ganesh@example.com
                </p>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  {['Administrator', 'Pro Plan', 'Dev Team'].map((tag) => (
                    <span key={tag} className="px-4 py-1.5 rounded-xl bg-slate-500/10 border border-slate-500/10 text-[10px] font-black uppercase tracking-widest">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="hidden lg:grid grid-cols-2 gap-4">
                 <div className="p-6 rounded-[2rem] bg-indigo-600/5 border border-indigo-600/10 text-center">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-tighter mb-1">Activity</p>
                    <p className="text-2xl font-black">98%</p>
                 </div>
                 <div className="p-6 rounded-[2rem] bg-purple-600/5 border border-purple-600/10 text-center">
                    <p className="text-[10px] font-black text-purple-400 uppercase tracking-tighter mb-1">Rank</p>
                    <p className="text-2xl font-black">Top</p>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. GRID SECTIONS */}
        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Appearance (Theme) */}
          <section className={`lg:col-span-1 rounded-[2.5rem] p-8 border transition-all
            ${darkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200 shadow-xl shadow-slate-200/50"}`}>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500"><FiMoon size={24}/></div>
              <h3 className="text-xl font-bold">Theme</h3>
            </div>
            
            <div className="space-y-6">
              <Toggle label="Dark Interface" enabled={darkMode} setEnabled={setDarkMode} />
              <div className="p-4 rounded-2xl bg-slate-500/5 border border-slate-500/10">
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Switching to dark mode reduces eye strain and saves battery on OLED screens.
                </p>
              </div>
            </div>
          </section>

          {/* Account Details Form */}
          <section className={`lg:col-span-2 rounded-[2.5rem] p-8 border transition-all
            ${darkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200 shadow-xl shadow-slate-200/50"}`}>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500"><FiUser size={24}/></div>
              <h3 className="text-xl font-bold">Personal Details</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                { label: 'Display Name', val: 'Ganesh Rajput' },
                { label: 'Work Email', val: 'ganesh@example.com' }
              ].map((field) => (
                <div key={field.label} className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{field.label}</label>
                  <input 
                    type="text" defaultValue={field.val}
                    className={`w-full rounded-2xl px-6 py-4 outline-none border focus:ring-4 transition-all font-semibold
                    ${darkMode ? "bg-slate-950 border-slate-800 focus:ring-indigo-500/20 focus:border-indigo-500" : "bg-slate-50 border-slate-100 focus:ring-indigo-500/10"}`}
                  />
                </div>
              ))}
            </div>
            <button className="mt-8 w-full md:w-auto bg-slate-100 dark:bg-white text-black hover:bg-white dark:hover:bg-slate-200 px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-xl">
              Save Preferences
            </button>
          </section>

          {/* Security & System */}
          <section className={`lg:col-span-3 rounded-[2.5rem] p-8 border transition-all flex flex-col md:flex-row items-center justify-between gap-6
            ${darkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200 shadow-xl shadow-slate-200/50"}`}>
            
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-3xl bg-emerald-500/10 flex items-center justify-center text-emerald-500"><FiShield size={28}/></div>
              <div>
                <h3 className="text-xl font-bold">Security & Privacy</h3>
                <p className="text-slate-500 text-sm font-medium">Last password change: 12 days ago</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 w-full md:w-auto">
              <button className="flex-1 md:flex-none px-8 py-4 rounded-2xl bg-slate-500/10 border border-slate-500/10 text-xs font-black uppercase tracking-widest hover:bg-slate-500/20 transition-all">
                Update Password
              </button>
              <button className="flex-1 md:flex-none px-8 py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-black uppercase tracking-widest hover:bg-red-500/20 transition-all">
                Sign Out
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function Toggle({ label, enabled, setEnabled }) {
  return (
    <div className={`flex justify-between items-center p-5 rounded-[2rem] border transition-all
      ${enabled ? "bg-indigo-600/10 border-indigo-500/30" : "bg-slate-500/5 border-slate-500/10"}`}>
      <span className="font-bold text-sm tracking-tight">{label}</span>
      <button
        onClick={() => setEnabled(!enabled)}
        className={`w-14 h-7 flex items-center rounded-full p-1 transition-all duration-500 ${
          enabled ? "bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]" : "bg-slate-400"
        }`}
      >
        <div className={`bg-white w-5 h-5 rounded-full shadow-lg transform transition-all duration-500 ${
            enabled ? "translate-x-7" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}