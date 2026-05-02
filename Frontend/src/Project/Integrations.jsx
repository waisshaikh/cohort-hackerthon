import { useState } from "react";
import { Copy, Check, Zap, Code, MessageCircle } from "lucide-react";
import { useAuth } from "../features/auth/AuthContext";

const Integrations = () => {
  const { user } = useAuth();
  const [copied, setCopied] = useState("");
  const [activeTab, setActiveTab] = useState("widget");

  // Generate the tenant slug from the tenant data
  const tenantSlug = user?.tenant?.slug || "your-tenant-slug";
  const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const widgetScriptUrl = `${apiBaseUrl.replace("/api", "")}/widget.js?tenant=${tenantSlug}`;
  const integrationUrl = `${apiBaseUrl}/public/${tenantSlug}/ticket`;

  const copyToClipboard = (text, type = "widget") => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(""), 2000);
  };

  const widgetEmbed = `<script src="${widgetScriptUrl}"><\/script>`;

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
    <div className="flex-1 bg-linear-to-br from-[#0f172a] via-[#1a1f3a] to-[#0f172a] min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-8">
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

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-gray-800">
          <button
            onClick={() => setActiveTab("widget")}
            className={`px-4 py-3 text-sm font-semibold border-b-2 transition ${
              activeTab === "widget"
                ? "border-indigo-500 text-white"
                : "border-transparent text-gray-400 hover:text-gray-300"
            }`}
          >
            <MessageCircle size={16} className="inline mr-2" />
            Widget (Recommended)
          </button>
          <button
            onClick={() => setActiveTab("api")}
            className={`px-4 py-3 text-sm font-semibold border-b-2 transition ${
              activeTab === "api"
                ? "border-indigo-500 text-white"
                : "border-transparent text-gray-400 hover:text-gray-300"
            }`}
          >
            <Code size={16} className="inline mr-2" />
            API Integration
          </button>
        </div>

        {/* Widget Tab */}
        {activeTab === "widget" && (
          <div className="space-y-6">
            {/* Widget Card */}
            <div className="bg-linear-to-br from-indigo-900/20 via-purple-900/20 to-transparent border border-indigo-500/30 rounded-2xl p-8 space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <MessageCircle size={24} />
                  Support Widget
                </h2>
                <p className="text-gray-300">
                  The easiest way to add support to your website. No coding required!
                </p>
              </div>

              {/* Embed Script */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-200">Embed Script</label>
                <p className="text-xs text-gray-400">Copy and paste this into your website before the closing &lt;/body&gt; tag</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-[#0f172a] border border-gray-700 rounded-lg px-4 py-3 font-mono text-xs text-gray-200 break-all max-h-20 overflow-y-auto">
                    {widgetEmbed}
                  </div>
                  <button
                    onClick={() => copyToClipboard(widgetEmbed, "widget")}
                    className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition flex items-center gap-2 whitespace-nowrap shrink-0"
                  >
                    {copied === "widget" ? <Check size={18} /> : <Copy size={18} />}
                    {copied === "widget" ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              {/* Widget Preview */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-200">Preview</label>
                <div className="bg-white rounded-lg p-6 min-h-64 flex items-center justify-center relative overflow-hidden">
                  {/* Widget preview */}
                  <div className="absolute bottom-6 right-6 w-16 h-16 rounded-full bg-linear-to-br from-purple-500 to-indigo-500 shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition transform">
                    <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8l-2 2V4h14v12z"/>
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500 text-sm">
                      👆 Click the widget button to see it in action
                    </p>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-gray-800">
                <div className="space-y-2">
                  <div className="font-semibold text-indigo-300">💬 No-Code</div>
                  <p className="text-sm text-gray-400">
                    Just copy and paste - no development required
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="font-semibold text-indigo-300">🎨 Beautiful</div>
                  <p className="text-sm text-gray-400">
                    Modern gradient design that looks great on any site
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="font-semibold text-indigo-300">⚡ Instant</div>
                  <p className="text-sm text-gray-400">
                    Tickets appear immediately in your dashboard
                  </p>
                </div>
              </div>
            </div>

            {/* Installation Steps */}
            <div className="bg-[#0f172a] border border-gray-700 rounded-xl p-6 space-y-4">
              <h3 className="text-lg font-semibold text-white">Installation Steps</h3>
              <ol className="space-y-3">
                <li className="flex gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-600 text-white text-sm font-bold flex-shrink-0">1</span>
                  <div>
                    <p className="font-medium text-white">Copy the embed script above</p>
                    <p className="text-sm text-gray-400">Use the copy button to get the exact code</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-600 text-white text-sm font-bold flex-shrink-0">2</span>
                  <div>
                    <p className="font-medium text-white">Open your website's HTML editor</p>
                    <p className="text-sm text-gray-400">This could be WordPress, Wix, Webflow, HTML file, etc.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-600 text-white text-sm font-bold flex-shrink-0">3</span>
                  <div>
                    <p className="font-medium text-white">Paste before closing &lt;/body&gt; tag</p>
                    <p className="text-sm text-gray-400">Usually at the very end of your page HTML</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-600 text-white text-sm font-bold flex-shrink-0">4</span>
                  <div>
                    <p className="font-medium text-white">Save and done!</p>
                    <p className="text-sm text-gray-400">The widget will appear in 2-3 seconds</p>
                  </div>
                </li>
              </ol>
            </div>

            {/* Success Indicator */}
            <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-4 flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              <div className="space-y-1">
                <p className="font-semibold text-emerald-200">Widget Ready</p>
                <p className="text-sm text-gray-300">
                  Your widget is ready to use. Any customer using your website can now send you messages directly.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* API Tab */}
        {activeTab === "api" && (
          <div className="space-y-6">
            {/* API Integration Card */}
            <div className="bg-linear-to-br from-indigo-900/20 via-purple-900/20 to-transparent border border-indigo-500/30 rounded-2xl p-8 space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">Website Contact Form Integration</h2>
                <p className="text-gray-300">
                  For developers who want to build custom integrations
                </p>
              </div>

              {/* Endpoint Section */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-200">API Endpoint</label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-[#0f172a] border border-gray-700 rounded-lg px-4 py-3 font-mono text-sm text-gray-200 break-all">
                    POST {integrationUrl}
                  </div>
                  <button
                    onClick={() => copyToClipboard(integrationUrl, "endpoint")}
                    className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition flex items-center gap-2 whitespace-nowrap shrink-0"
                  >
                    {copied === "endpoint" ? <Check size={18} /> : <Copy size={18} />}
                    {copied === "endpoint" ? "Copied!" : "Copy"}
                  </button>
                </div>
                <p className="text-xs text-gray-400">✓ Public endpoint - No authentication required</p>
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
                    <span className="text-gray-400">Contact person's email (string)</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-indigo-400 font-mono">title</span>
                    <span className="text-gray-400">Ticket title (string)</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-indigo-400 font-mono">description</span>
                    <span className="text-gray-400">Ticket description (string, max 5000 chars)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Code Samples */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Fetch API */}
              <div className="bg-[#0f172a] border border-gray-700 rounded-xl p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Fetch API</h3>
                  <button
                    onClick={() => copyToClipboard(fetchExample, "fetch")}
                    className="p-2 hover:bg-gray-700 rounded transition text-gray-400"
                    title="Copy code"
                  >
                    {copied === "fetch" ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
                  </button>
                </div>
                <pre className="bg-slate-900 rounded-lg p-4 overflow-x-auto text-xs text-gray-300">
                  <code>{fetchExample}</code>
                </pre>
              </div>

              {/* Axios */}
              <div className="bg-[#0f172a] border border-gray-700 rounded-xl p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Axios</h3>
                  <button
                    onClick={() => copyToClipboard(axiosExample, "axios")}
                    className="p-2 hover:bg-gray-700 rounded transition text-gray-400"
                    title="Copy code"
                  >
                    {copied === "axios" ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
                  </button>
                </div>
                <pre className="bg-slate-900 rounded-lg p-4 overflow-x-auto text-xs text-gray-300">
                  <code>{axiosExample}</code>
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Integrations;
