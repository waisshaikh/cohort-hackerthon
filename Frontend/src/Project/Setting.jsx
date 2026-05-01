import { useState } from "react";

export default function Setting() {
  const [emailNotif, setEmailNotif] = useState(true);
  const [autoAssign, setAutoAssign] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className="min-h-screen bg-[#0b1120] text-white p-6 flex justify-center">
      <div className="w-full max-w-3xl space-y-6">

        {/* Title */}
        <h1 className="text-2xl font-semibold">Settings</h1>

        {/* Profile Settings */}
        <div className="bg-[#0f172a] border border-gray-800 rounded-2xl p-5 space-y-4">
          <h2 className="text-lg font-medium">Profile</h2>

          <div className="space-y-3">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full bg-[#020617] border border-gray-700 rounded-lg px-3 py-2 outline-none"
            />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full bg-[#020617] border border-gray-700 rounded-lg px-3 py-2 outline-none"
            />
          </div>

          <button className="bg-gradient-to-r from-purple-500 to-indigo-500 px-4 py-2 rounded-lg text-sm">
            Save Changes
          </button>
        </div>

        {/* Notifications */}
        <div className="bg-[#0f172a] border border-gray-800 rounded-2xl p-5 space-y-4">
          <h2 className="text-lg font-medium">Notifications</h2>

          <Toggle
            label="Email Notifications"
            enabled={emailNotif}
            setEnabled={setEmailNotif}
          />

          <Toggle
            label="Auto Assign Tickets"
            enabled={autoAssign}
            setEnabled={setAutoAssign}
          />
        </div>

        {/* Appearance */}
        <div className="bg-[#0f172a] border border-gray-800 rounded-2xl p-5 space-y-4">
          <h2 className="text-lg font-medium">Appearance</h2>

          <Toggle
            label="Dark Mode"
            enabled={darkMode}
            setEnabled={setDarkMode}
          />
        </div>

        {/* Security */}
        <div className="bg-[#0f172a] border border-gray-800 rounded-2xl p-5 space-y-4">
          <h2 className="text-lg font-medium">Security</h2>

          <button className="border border-gray-700 px-4 py-2 rounded-lg w-full text-left">
            Change Password
          </button>

          <button className="border border-red-500 text-red-400 px-4 py-2 rounded-lg w-full text-left">
            Logout
          </button>
        </div>

      </div>
    </div>
  );
}

/* Toggle Component */
function Toggle({ label, enabled, setEnabled }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-300">{label}</span>

      <button
        onClick={() => setEnabled(!enabled)}
        className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
          enabled ? "bg-purple-500" : "bg-gray-600"
        }`}
      >
        <div
          className={`bg-white w-4 h-4 rounded-full transform transition ${
            enabled ? "translate-x-6" : ""
          }`}
        />
      </button>
    </div>
  );
}