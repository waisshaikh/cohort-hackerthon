import { useEffect, useState } from "react";
import {
  FiUserPlus,
  FiShield,
  FiActivity,
  FiMail,
  FiLock,
  FiUser,
  FiCheckCircle,
  FiX,
} from "react-icons/fi";
import { IoRocketOutline, IoPeopleOutline } from "react-icons/io5";

import api from "../lib/api";

export default function Team() {
  const [showInvite, setShowInvite] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Agent",
  });

  const [agents, setAgents] = useState([]);
  const [loadingAgents, setLoadingAgents] = useState(true);

  const [isSuccess, setIsSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadAgents = async () => {
    try {
      setLoadingAgents(true);

      const { data } = await api.get("/auth/agents");

      setAgents(data.agents || []);
    } catch (err) {
      console.error("Failed to load agents:", err);
    } finally {
      setLoadingAgents(false);
    }
  };

  useEffect(() => {
    loadAgents();
  }, []);

  const handleInvite = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      await api.post("/auth/invite-agent", {
        username: formData.name,
        email: formData.email,
        password: formData.password,
      });

      await loadAgents();

      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
        setShowInvite(false);

        setFormData({
          name: "",
          email: "",
          password: "",
          role: "Agent",
        });
      }, 2500);
    } catch (err) {
      console.error("Invite Agent Error:", err);

      alert(
        err?.response?.data?.message ||
          "Failed to invite agent. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const stats = [
    {
      label: "Active Agents",
      value: agents.length,
      icon: <IoPeopleOutline />,
      color: "text-blue-400",
    },
    {
      label: "Avg Response",
      value: "1.2m",
      icon: <FiActivity />,
      color: "text-emerald-400",
    },
    {
      label: "Open Slots",
      value: "Unlimited",
      icon: <IoRocketOutline />,
      color: "text-purple-400",
    },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-8 font-sans selection:bg-indigo-500/30">
      <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">
              <FiShield /> Access Control
            </div>

            <h1 className="text-4xl font-black tracking-tighter text-white">
              Team <span className="text-indigo-500">Workspace</span>
            </h1>

            <p className="text-slate-400 max-w-xl text-sm font-medium leading-relaxed">
              Scale your support operations by onboarding agents and defining
              neural access roles.
            </p>
          </div>

          <button
            onClick={() => setShowInvite(true)}
            className="group relative inline-flex items-center gap-3 rounded-2xl bg-white px-8 py-4 text-sm font-bold text-black hover:bg-indigo-50 transition-all active:scale-95 shadow-2xl"
          >
            <FiUserPlus className="text-indigo-600" />
            Invite Agent
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="p-6 rounded-[2rem] border border-slate-800 bg-[#0f172a]/40 backdrop-blur-xl flex items-center justify-between group hover:border-slate-700 transition-all"
            >
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  {stat.label}
                </p>

                <p className={`text-2xl font-black ${stat.color}`}>
                  {stat.value}
                </p>
              </div>

              <div
                className={`p-4 rounded-2xl bg-slate-900/50 ${stat.color} text-xl group-hover:scale-110 transition-transform`}
              >
                {stat.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Invite Modal */}
        {showInvite && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020617]/80 backdrop-blur-md">
            <div className="w-full max-w-lg rounded-[2.5rem] border border-white/10 bg-[#0f172a] p-1 shadow-3xl overflow-hidden relative">
              {isSuccess ? (
                <div className="p-12 text-center space-y-6">
                  <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto text-emerald-500 border border-emerald-500/20">
                    <FiCheckCircle size={40} />
                  </div>

                  <h2 className="text-2xl font-bold text-white">
                    Agent Invited Successfully
                  </h2>

                  <p className="text-slate-400 text-sm">
                    Credentials created for {formData.name}
                  </p>
                </div>
              ) : (
                <div className="p-8 space-y-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white">
                      New Agent Onboarding
                    </h3>

                    <button
                      onClick={() => setShowInvite(false)}
                      className="p-2 hover:bg-white/5 rounded-full text-slate-500"
                    >
                      <FiX />
                    </button>
                  </div>

                  <form onSubmit={handleInvite} className="space-y-5">
                    <InputField
                      label="Agent Name"
                      icon={<FiUser />}
                      type="text"
                      value={formData.name}
                      onChange={(v) =>
                        setFormData({ ...formData, name: v })
                      }
                      placeholder="Ganesh Rajput"
                    />

                    <InputField
                      label="Email Address"
                      icon={<FiMail />}
                      type="email"
                      value={formData.email}
                      onChange={(v) =>
                        setFormData({ ...formData, email: v })
                      }
                      placeholder="agent@tenantdesk.ai"
                    />

                    <InputField
                      label="Initial Password"
                      icon={<FiLock />}
                      type="password"
                      value={formData.password}
                      onChange={(v) =>
                        setFormData({ ...formData, password: v })
                      }
                      placeholder="••••••••"
                    />

                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
                      <FiShield className="text-indigo-400" />
                      <span className="text-xs font-bold text-slate-400">
                        Default Role:
                        <span className="text-indigo-400 ml-1">
                          Support Agent
                        </span>
                      </span>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-indigo-600 py-4 rounded-2xl font-bold text-white hover:bg-indigo-500 transition-all disabled:opacity-50"
                    >
                      {submitting ? "Inviting..." : "Invite Agent"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Agent Directory */}
        <div className="rounded-[3rem] border border-slate-800 bg-[#0f172a] p-6">
          {loadingAgents ? (
            <div className="text-center py-16 text-slate-500">
              Loading team members...
            </div>
          ) : agents.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              No agents invited yet.
            </div>
          ) : (
            <div className="space-y-4">
              {agents.map((agent) => (
                <div
                  key={agent._id}
                  className="rounded-2xl border border-slate-800 bg-[#020617] px-6 py-5 flex items-center justify-between hover:border-indigo-500/30 transition"
                >
                  <div>
                    <h3 className="text-white font-bold text-lg">
                      {agent.username}
                    </h3>
                    <p className="text-slate-400 text-sm">
                      {agent.email}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-indigo-400 font-bold">
                      {agent.role}
                    </p>
                    <p className="text-xs text-slate-500">
                      Joined{" "}
                      {new Date(agent.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* Reusable Input Field */
function InputField({
  label,
  icon,
  type,
  value,
  onChange,
  placeholder,
}) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
        {label}
      </label>

      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600">
          {icon}
        </div>

        <input
          required
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-slate-800 bg-[#020617] py-4 pl-12 pr-4 text-sm outline-none focus:border-indigo-500/50"
        />
      </div>
    </div>
  );
}