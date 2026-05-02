import { useState } from "react";
import { Copy, Check, ExternalLink, Zap } from "lucide-react";
import { useAuth } from "../features/auth/AuthContext";

const Integrations = () => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Generate the tenant slug from the tenant data
  const tenantSlug = user?.tenant?.slug || "your-tenant-slug";
  const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const integrationUrl = `${apiBaseUrl}/public/${tenantSlug}/ticket`;

  const copyToClipboard = (text, type = "url") => {
    navigator.clipboard.writeText(text);
    if (type === "url") {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const fetchExample = `fetch('${integrationUrl}', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    title: 'Account issue',
    description: 'I am unable to access my account',
    channel: 'web'
  })
})
.then(res => res.json())
.then(data => console.log('Ticket created:', data))
.catch(err => console.error('Error:', err));`;

  const axiosExample = `import axios from 'axios';

axios.post('${integrationUrl}', {
  name: 'John Doe',
  email: 'john@example.com',
  title: 'Account issue',
  description: 'I am unable to access my account',
  channel: 'web'
})
.then(res => console.log('Ticket created:', res.data))
.catch(err => console.error('Error:', err));`;

  return (
    <div className="flex-1 bg-gradient-to-br from-[#0f172a] via-[#1a1f3a] to-[#0f172a] min-h-screen p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-indigo-400" />
            <h1 className="text-4xl font-bold text-white">Integrations</h1>
          </div>
          <p className="text-gray-400 text-lg">
            Connect your website to TenantDesk AI and automatically create support tickets
          </p>
        </div>

        {/* Main Integration Card */}
        <div className="bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-transparent border border-indigo-500/30 rounded-2xl p-8 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Website Contact Form Integration</h2>
            <p className="text-gray-300">
              Use this public endpoint to submit contact form submissions as support tickets
            </p>
          </div>

          {/* Endpoint Section */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-200">Your Integration Endpoint</label>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-[#0f172a] border border-gray-700 rounded-lg px-4 py-3 font-mono text-sm text-gray-200 break-all">
                {integrationUrl}
              </div>
              <button
                onClick={() => copyToClipboard(integrationUrl, "url")}
                className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition flex items-center gap-2 whitespace-nowrap"
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <p className="text-xs text-gray-400">
              ✓ Public endpoint - No authentication required
            </p>
          </div>

          {/* Required Fields */}
          <div className="space-y-3 bg-slate-900/50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-200">Required Fields</h3>
            <div className="space-y-2 text-sm">
              <div className="flex gap-3">
                <span className="text-indigo-400 font-mono">name</span>
                <span className="text-gray-400">Contact person's name (string)</span>
              </div>
              <div className="flex gap-3">
                <span className="text-indigo-400 font-mono">email</span>
                <span className="text-gray-400">Contact person's email (string, required)</span>
              </div>
              <div className="flex gap-3">
                <span className="text-indigo-400 font-mono">title</span>
                <span className="text-gray-400">Ticket title (string)</span>
              </div>
              <div className="flex gap-3">
                <span className="text-indigo-400 font-mono">description</span>
                <span className="text-gray-400">Ticket description (string, max 5000 chars)</span>
              </div>
              <div className="flex gap-3">
                <span className="text-indigo-400 font-mono">channel</span>
                <span className="text-gray-400">Optional: 'web' (default), 'email', 'chat'</span>
              </div>
            </div>
          </div>
        </div>

        {/* Code Samples */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Fetch API */}
          <div className="bg-[#0f172a] border border-gray-700 rounded-xl p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">JavaScript (Fetch API)</h3>
              <button
                onClick={() => copyToClipboard(fetchExample, "code")}
                className="p-2 hover:bg-gray-700 rounded transition text-gray-400"
                title="Copy code"
              >
                {copiedCode && <Check size={18} className="text-green-400" />}
                {!copiedCode && <Copy size={18} />}
              </button>
            </div>
            <pre className="bg-slate-900 rounded-lg p-4 overflow-x-auto text-xs text-gray-300">
              <code>{fetchExample}</code>
            </pre>
          </div>

          {/* Axios */}
          <div className="bg-[#0f172a] border border-gray-700 rounded-xl p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">JavaScript (Axios)</h3>
              <button
                onClick={() => copyToClipboard(axiosExample, "code")}
                className="p-2 hover:bg-gray-700 rounded transition text-gray-400"
                title="Copy code"
              >
                {copiedCode && <Check size={18} className="text-green-400" />}
                {!copiedCode && <Copy size={18} />}
              </button>
            </div>
            <pre className="bg-slate-900 rounded-lg p-4 overflow-x-auto text-xs text-gray-300">
              <code>{axiosExample}</code>
            </pre>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-900/20 to-transparent border border-blue-500/30 rounded-lg p-4 space-y-2">
            <div className="text-blue-400 font-semibold">⚡ Auto Customer Creation</div>
            <p className="text-sm text-gray-400">
              Customers are automatically created and matched by email
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-900/20 to-transparent border border-purple-500/30 rounded-lg p-4 space-y-2">
            <div className="text-purple-400 font-semibold">🤖 AI Analysis</div>
            <p className="text-sm text-gray-400">
              Each ticket is automatically analyzed for priority and category
            </p>
          </div>
          <div className="bg-gradient-to-br from-emerald-900/20 to-transparent border border-emerald-500/30 rounded-lg p-4 space-y-2">
            <div className="text-emerald-400 font-semibold">📊 Real-time Dashboard</div>
            <p className="text-sm text-gray-400">
              View and manage tickets instantly in your dashboard
            </p>
          </div>
        </div>

        {/* Response Example */}
        <div className="bg-[#0f172a] border border-gray-700 rounded-xl p-6 space-y-3">
          <h3 className="text-lg font-semibold text-white">Success Response Example</h3>
          <pre className="bg-slate-900 rounded-lg p-4 overflow-x-auto text-xs text-gray-300">
            <code>
{`{
  "success": true,
  "message": "Ticket submitted successfully",
  "ticket": {
    "_id": "507f1f77bcf86cd799439011",
    "tenant": "507f1f77bcf86cd799439012",
    "title": "Account issue",
    "description": "I am unable to access my account",
    "customer": {
      "_id": "507f1f77bcf86cd799439013",
      "username": "john_1234567890",
      "email": "john@example.com",
      "role": "CUSTOMER"
    },
    "source": "WEBSITE",
    "status": "open",
    "priority": "Medium",
    "category": "Account",
    "department": "Customer Success",
    "createdAt": "2024-05-02T10:30:00Z"
  }
}`}
            </code>
          </pre>
        </div>

        {/* Status Indicator */}
        <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-4 flex items-start gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
          <div className="space-y-1">
            <p className="font-semibold text-emerald-200">Integration Active</p>
            <p className="text-sm text-gray-300">
              Your integration endpoint is ready to receive contact form submissions. Tickets will appear in your Tickets dashboard immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Integrations;
