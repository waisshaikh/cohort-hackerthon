import { useState, useEffect } from "react";
import {
  FiUser,
  FiMoon,
  FiShield,
  FiLogOut,
  FiEdit3,
  FiMail,
} from "react-icons/fi";
import { IoSparkles } from "react-icons/io5";
import api from "../lib/api";

export default function Setting() {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState("");

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get("/auth/get-me");
      setUser(data.user);
      setDisplayName(data.user.username);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    try {
      const { data } = await api.put("/auth/update-profile", {
        username: displayName,
      });

      setUser(data.user);
      localStorage.setItem("tenantDesk_user", JSON.stringify(data.user));

      alert("Profile Updated");
    } catch (err) {
      alert("Failed to update profile");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("tenantDesk_token");
    localStorage.removeItem("tenantDesk_user");
    window.location.href = "/login";
  };

  if (!user) return null;

  return (
    <div className={`min-h-screen transition-colors duration-700 flex justify-center p-4 md:p-10 
      ${darkMode ? "bg-[#020617] text-slate-100" : "bg-[#f8fafc] text-slate-900"}`}>

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
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
              System Settings
            </h1>
          </div>
        </header>

        <div className={`group relative rounded-[3rem] p-[1px] transition-all duration-500 overflow-hidden shadow-2xl
          ${darkMode ? "bg-gradient-to-br from-slate-700/50 to-slate-900/50" : "bg-gradient-to-br from-slate-200 to-white"}`}>

          <div className={`relative rounded-[3rem] p-8 md:p-12 backdrop-blur-3xl transition-all
            ${darkMode ? "bg-slate-950/80" : "bg-white/90"}`}>

            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 to-purple-500 rounded-[2.5rem] blur-md opacity-40"></div>

                <div className="relative w-32 h-32 rounded-[2.5rem] bg-[#020617] border-2 border-white/10 flex items-center justify-center">
                  <span className="text-5xl font-black bg-gradient-to-br from-white to-slate-500 bg-clip-text text-transparent">
                    {user.username?.charAt(0).toUpperCase()}
                  </span>
                </div>

                <button className="absolute -bottom-2 -right-2 p-3 bg-white text-black rounded-2xl shadow-xl">
                  <FiEdit3 size={18} />
                </button>
              </div>

              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-black mb-2 tracking-tight">
                  {user.username}
                </h2>

                <p className="text-slate-500 font-medium flex items-center justify-center md:justify-start gap-2 mb-6">
                  <FiMail className="text-indigo-500" />
                  {user.email}
                </p>

                <span className="px-4 py-1.5 rounded-xl bg-slate-500/10 border border-slate-500/10 text-[10px] font-black uppercase tracking-widest">
                  {user.role.replace("_", " ")}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          <section className={`lg:col-span-1 rounded-[2.5rem] p-8 border
            ${darkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"}`}>

            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                <FiMoon size={24}/>
              </div>
              <h3 className="text-xl font-bold">Theme</h3>
            </div>

            <Toggle label="Dark Interface" enabled={darkMode} setEnabled={setDarkMode} />
          </section>

          <section className={`lg:col-span-2 rounded-[2.5rem] p-8 border
            ${darkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"}`}>

            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                <FiUser size={24}/>
              </div>
              <h3 className="text-xl font-bold">Personal Details</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">

              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full rounded-2xl px-6 py-4 bg-slate-950 border border-slate-800"
              />

              <input
                value={user.email}
                readOnly
                className="w-full rounded-2xl px-6 py-4 bg-slate-950 border border-slate-800 opacity-70"
              />
            </div>

            <button
              onClick={handleSave}
              className="mt-8 bg-white text-black px-10 py-4 rounded-2xl text-xs font-black uppercase"
            >
              Save Preferences
            </button>
          </section>

          <section className={`lg:col-span-3 rounded-[2.5rem] p-8 border flex justify-between items-center
            ${darkMode ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"}`}>

            <div className="flex items-center gap-4">
              <FiShield size={24}/>
              <span>Security & Privacy</span>
            </div>

            <button
              onClick={handleLogout}
              className="px-8 py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-black uppercase"
            >
              Sign Out
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}

function Toggle({ label, enabled, setEnabled }) {
  return (
    <div className="flex justify-between items-center p-5 rounded-[2rem] border border-slate-700">
      <span className="font-bold text-sm">{label}</span>

      <button
        onClick={() => setEnabled(!enabled)}
        className={`w-14 h-7 flex items-center rounded-full p-1 ${
          enabled ? "bg-indigo-500" : "bg-slate-400"
        }`}
      >
        <div className={`bg-white w-5 h-5 rounded-full transition-all ${
          enabled ? "translate-x-7" : ""
        }`} />
      </button>
    </div>
  );
}