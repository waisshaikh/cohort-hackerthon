import { useState, useMemo, useEffect } from "react";
import {
    Copy, Check, Zap, Code, MessageCircle, Globe, ShieldCheck,
} from "lucide-react";
import api, { getErrorMessage } from "../lib/api";
import { useAuth } from "../features/auth/AuthContext";

// --- Constants & Helpers ---
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getCodeTemplates = (url) => ({
    fetch: `fetch('${url}', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    title: 'Need Help',
    description: 'Customer support request',
    channel: 'web'
  })
})`,
    axios: `import axios from 'axios';

axios.post('${url}', {
  name: 'John Doe',
  email: 'john@example.com',
  title: 'Need Help',
  description: 'Customer support request',
  channel: 'web'
})`,
});

const Integrations = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("widget");
    const [copied, setCopied] = useState("");

    // DNS / Verification State
    const [domain, setDomain] = useState("");
    const [dnsData, setDnsData] = useState(null);
    const [status, setStatus] = useState({ loading: false, verifying: false });
    const [verified, setVerified] = useState(user?.tenant?.websiteIntegration?.isVerified || false);

    useEffect(() => {
        refreshIntegrationStatus();
    }, []);

    // Memoized derived values
    const [resolvedTenantSlug, setResolvedTenantSlug] = useState(
        user?.tenant?.slug || ""
    );

    const tenantSlug = resolvedTenantSlug || "your-tenant-slug";
    const integrationUrls = useMemo(() => {
        const root = API_BASE_URL.replace("/api", "");
        return {
            widget: `${root}/widget.js?tenant=${tenantSlug}`,
            api: `${API_BASE_URL}/public/${tenantSlug}/ticket`
        };
    }, [tenantSlug]);

    const widgetEmbed = `<script src="${integrationUrls.widget}"></script>`;
    const templates = getCodeTemplates(integrationUrls.api);

    // Handlers
    const copyToClipboard = (text, type) => {
        navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(""), 2000);
    };

    const handleSetupDns = async () => {
        if (!domain.trim()) return;
        setStatus(prev => ({ ...prev, loading: true }));
        try {
            const { data } = await api.post("/integrations/dns/setup", { domain });
            setDnsData({
                host: data?.verification?.host || `_tenantdesk-verify.${domain}`,
                value: data?.verification?.value || data?.verification?.verificationToken,
            });
        } catch (err) {
            alert(getErrorMessage(err));
        } finally {
            setStatus(prev => ({ ...prev, loading: false }));
        }
    };

    const refreshIntegrationStatus = async () => {
        try {
            const { data } = await api.get("/integrations/status");

            setVerified(data?.websiteIntegration?.isVerified || false);
            setDomain(data?.websiteIntegration?.domain || "");

            if (data?.tenantSlug) {
                setResolvedTenantSlug(data.tenantSlug);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleVerifyDns = async () => {
        setStatus(prev => ({ ...prev, verifying: true }));
        try {
            await api.post("/integrations/dns/verify");
            await refreshIntegrationStatus();
        } catch (err) {
            alert(getErrorMessage(err));
        } finally {
            setStatus(prev => ({ ...prev, verifying: false }));
        }
    };

    return (
        <div className="flex-1 min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1a1f3a] to-[#0f172a] p-6">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <header>
                    <div className="flex items-center gap-3 mb-2">
                        <Zap className="w-6 h-6 text-indigo-400" />
                        <h1 className="text-4xl font-bold text-white">Integrations</h1>
                    </div>
                    <p className="text-gray-400">Connect your website securely and enable support widget integration</p>
                </header>

                {/* Tabs Nav */}
                <div className="flex gap-2 border-b border-gray-800">
                    <TabButton
                        active={activeTab === "widget"}
                        onClick={() => setActiveTab("widget")}
                        icon={<MessageCircle size={16} />}
                        label="Widget"
                    />
                    <TabButton
                        active={activeTab === "api"}
                        onClick={() => setActiveTab("api")}
                        icon={<Code size={16} />}
                        label="API Integration"
                    />
                </div>

                {/* Widget Tab Content */}
                {activeTab === "widget" && (
                    <div className="space-y-6">
                        {!verified ? (
                            <div className="bg-indigo-900/10 border border-indigo-500/30 rounded-2xl p-8 space-y-8">
                                <SectionHeader
                                    icon={<Globe className="w-5 h-5 text-indigo-400" />}
                                    title="Domain Verification Required"
                                    description="Verify your domain before enabling widget embedding for secure domain-based protection."
                                />

                                <div className="space-y-3">
                                    <label className="text-sm text-gray-300">Step 1: Enter Your Website Domain</label>
                                    <div className="flex gap-3">
                                        <input
                                            value={domain}
                                            onChange={(e) => setDomain(e.target.value)}
                                            placeholder="example.com"
                                            className="flex-1 rounded-xl border border-gray-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-indigo-500"
                                        />
                                        <button
                                            onClick={handleSetupDns}
                                            disabled={status.loading}
                                            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition disabled:opacity-50"
                                        >
                                            {status.loading ? "Generating..." : "Generate DNS"}
                                        </button>
                                    </div>
                                </div>

                                {dnsData && (
                                    <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-6">
                                        <div className="space-y-5 rounded-xl bg-slate-900/60 border border-gray-700 p-6">
                                            <h3 className="text-lg font-semibold text-white">Step 2: Add TXT Records</h3>
                                            <div className="space-y-4">
                                                <DnsField label="Host / Name" value={dnsData.host} copied={copied} onCopy={copyToClipboard} id="host" />
                                                <DnsField label="TXT Value" value={dnsData.value} copied={copied} onCopy={copyToClipboard} id="value" />
                                            </div>
                                        </div>
                                        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
                                            Step 3: Add the record to your DNS provider, wait 10–15 mins, then verify.
                                        </div>
                                        <button
                                            onClick={handleVerifyDns}
                                            disabled={status.verifying}
                                            className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 py-4 font-semibold text-white transition"
                                        >
                                            {status.verifying ? "Verifying..." : "Verify Domain"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-xl p-5 flex items-center gap-3 text-emerald-200">
                                    <ShieldCheck />
                                    <div>
                                        <h3 className="font-semibold">Domain Verified Successfully</h3>
                                        <p className="text-sm opacity-80">Your widget is now secured to your verified domain.</p>
                                    </div>
                                </div>

                                <div className="bg-indigo-900/10 border border-indigo-500/30 rounded-2xl p-8 space-y-6">
                                    <SectionHeader
                                        title="Widget Script Tag"
                                        description="Paste this script before your closing body tag."
                                    />
                                    <CopyBlock text={widgetEmbed} onCopy={() => copyToClipboard(widgetEmbed, "script")} isCopied={copied === "script"} />
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* API Tab Content */}
                {activeTab === "api" && (
                    <div className="grid md:grid-cols-2 gap-6">
                        <CodeCard title="Fetch API" code={templates.fetch} isCopied={copied === "fetch"} onCopy={() => copyToClipboard(templates.fetch, "fetch")} />
                        <CodeCard title="Axios" code={templates.axios} isCopied={copied === "axios"} onCopy={() => copyToClipboard(templates.axios, "axios")} />
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Sub-components ---

const TabButton = ({ active, onClick, icon, label }) => (
    <button
        onClick={onClick}
        className={`px-4 py-3 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${active ? "border-indigo-500 text-white" : "border-transparent text-gray-400 hover:text-gray-200"
            }`}
    >
        {icon} {label}
    </button>
);

const SectionHeader = ({ icon, title, description }) => (
    <div className="space-y-2">
        <div className="flex items-center gap-2">
            {icon}
            <h2 className="text-2xl font-bold text-white">{title}</h2>
        </div>
        {description && <p className="text-gray-400">{description}</p>}
    </div>
);

const DnsField = ({ label, value, copied, onCopy, id }) => (
    <div>
        <label className="block text-sm text-gray-400 mb-2">{label}</label>
        <CopyBlock text={value} onCopy={() => onCopy(value, id)} isCopied={copied === id} />
    </div>
);

const CopyBlock = ({ text, onCopy, isCopied }) => (
    <div className="flex gap-2">
        <div className="flex-1 bg-slate-950 border border-gray-700 rounded-lg px-4 py-3 text-sm text-white font-mono break-all">
            {text}
        </div>
        <button onClick={onCopy} className="px-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white transition">
            {isCopied ? <Check size={18} /> : <Copy size={18} />}
        </button>
    </div>
);

const CodeCard = ({ title, code, isCopied, onCopy }) => (
    <div className="bg-slate-900 border border-gray-700 rounded-xl p-6 space-y-3">
        <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <button onClick={onCopy} className="p-2 hover:bg-gray-800 rounded transition">
                {isCopied ? <Check size={18} className="text-green-400" /> : <Copy size={18} className="text-gray-400" />}
            </button>
        </div>
        <pre className="bg-slate-950 rounded-lg p-4 overflow-x-auto text-xs text-gray-300 font-mono">
            <code>{code}</code>
        </pre>
    </div>
);

export default Integrations;