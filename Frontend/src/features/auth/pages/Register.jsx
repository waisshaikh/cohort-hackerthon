import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../AuthContext";
import { getErrorMessage } from "../../../lib/api";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tenantName, setTenantName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const auth = useAuth();
  const navigate = useNavigate();

  const submitForm = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await auth.register({
        username,
        email,
        password,
        tenantName,
        role: "admin",
      });
      setSuccess("Account created. You can sign in now.");
      setTimeout(() => navigate("/login"), 700);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to create account"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#050509] px-4 py-10 text-zinc-100 sm:px-6 lg:px-8 font-sans antialiased">
      <div className="mx-auto flex min-h-[85vh] w-full max-w-5xl items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-10 shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#06b6d4]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
              Get <span className="text-[#06b6d4]">Started</span>
            </h1>
            <p className="mt-2 text-base text-zinc-400">
              Create your support workspace in seconds.
            </p>

            <form onSubmit={submitForm} className="mt-10 space-y-6">
              {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}
              {success && (
                <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">
                  {success}
                </div>
              )}

              <FormInput
                label="Username"
                value={username}
                onChange={setUsername}
                placeholder="john_doe"
              />
              <FormInput
                label="Workspace Name"
                value={tenantName}
                onChange={setTenantName}
                placeholder="Acme Support"
              />
              <FormInput
                label="Email Address"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="name@company.com"
              />
              <FormInput
                label="Password"
                type="password"
                value={password}
                onChange={setPassword}
                placeholder="At least 6 characters"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full relative group rounded-xl bg-gradient-to-r from-[#06b6d4] to-[#0891b2] px-4 py-4 font-bold text-zinc-950 transition-all duration-300 hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] hover:-translate-y-0.5 disabled:opacity-60"
              >
                {loading ? "Creating..." : "Create Account"}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-zinc-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-[#06b6d4] hover:text-[#22d3ee] transition duration-200"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const FormInput = ({ label, value, onChange, placeholder, type = "text" }) => (
  <div>
    <label className="mb-2 block text-sm font-medium text-zinc-300">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required
      className="w-full rounded-xl border border-zinc-700/50 bg-zinc-950/50 px-5 py-3.5 text-zinc-100 placeholder:text-zinc-600 outline-none transition duration-200 focus:border-[#06b6d4] focus:ring-2 focus:ring-[#06b6d4]/20"
    />
  </div>
);

export default Register;
