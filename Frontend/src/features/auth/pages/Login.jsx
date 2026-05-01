import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../AuthContext";
import { getErrorMessage } from "../../../lib/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const auth = useAuth();
  const navigate = useNavigate();

  const submitForm = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await auth.login({ email, password });
      navigate("/");
    } catch (err) {
      setError(getErrorMessage(err, "Unable to sign in"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#050509] px-4 py-10 text-zinc-100 sm:px-6 lg:px-8 font-sans antialiased">
      <div className="mx-auto flex min-h-[85vh] w-full max-w-5xl items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-10 shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-xl relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#06b6d4]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
              Welcome <span className="text-[#06b6d4]">Back</span>
            </h1>
            <p className="mt-2 text-base text-zinc-400">
              Securely sign in to your dashboard.
            </p>

            <form onSubmit={submitForm} className="mt-10 space-y-6">
              {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  className="w-full rounded-xl border border-zinc-700/50 bg-zinc-950/50 px-5 py-3.5 text-zinc-100 placeholder:text-zinc-600 outline-none transition duration-200 focus:border-[#06b6d4] focus:ring-2 focus:ring-[#06b6d4]/20"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-zinc-300">
                    Password
                  </label>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="w-full rounded-xl border border-zinc-700/50 bg-zinc-950/50 px-5 py-3.5 text-zinc-100 placeholder:text-zinc-600 outline-none transition duration-200 focus:border-[#06b6d4] focus:ring-2 focus:ring-[#06b6d4]/20"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full relative group rounded-xl bg-gradient-to-r from-[#06b6d4] to-[#0891b2] px-4 py-4 font-bold text-zinc-950 transition-all duration-300 hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {loading ? "Authenticating..." : "Sign In"}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-zinc-500">
              New here?{" "}
              <Link
                to="/register"
                className="font-semibold text-[#06b6d4] hover:text-[#22d3ee] transition duration-200"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
