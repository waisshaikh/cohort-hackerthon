import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, Mail, Clock, Globe } from "lucide-react";
import Split from "react-split";
import { FiRefreshCw } from "react-icons/fi";
import { IoSparklesOutline } from "react-icons/io5";
import { MdOutlineInsertDriveFile } from "react-icons/md";

import api, { getErrorMessage } from "../lib/api";
import { useAuth } from "../features/auth/AuthContext";

const priorityStyles = {
  Critical: "bg-red-500/20 text-red-300",
  High: "bg-orange-500/20 text-orange-300",
  Medium: "bg-yellow-500/20 text-yellow-300",
  Low: "bg-green-500/20 text-green-300",
};

const statusStyles = {
  open: "bg-blue-500/20 text-blue-300",
  pending: "bg-yellow-500/20 text-yellow-300",
  resolved: "bg-green-500/20 text-green-300",
  closed: "bg-slate-500/20 text-slate-300",
};

const sourceStyles = {
  WEBSITE: "bg-blue-500/20 text-blue-300",
  WHATSAPP: "bg-green-500/20 text-green-300",
  EMAIL: "bg-purple-500/20 text-purple-300",
  LIVE_CHAT: "bg-indigo-500/20 text-indigo-300",
  INSTAGRAM: "bg-pink-500/20 text-pink-300",
  PHONE: "bg-orange-500/20 text-orange-300",
  WIDGET: "bg-indigo-500/20 text-indigo-300",
};

const emptyForm = {
  title: "",
  description: "",
  channel: "web",
};

const Ticket = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newTicket, setNewTicket] = useState(emptyForm);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [viewedTickets, setViewedTickets] = useState([]);
  const [activeTab, setActiveTab] = useState("conversation");

  const loadTickets = async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await api.get("/tickets");
      const nextTickets = data.tickets || [];
      setTickets(nextTickets);
      setSelectedId((current) => current || nextTickets[0]?._id || "");
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load tickets"));
    } finally {
      setLoading(false);
    }
  };

  const loadTicketDetails = async (ticketId) => {
    if (!ticketId) {
      setSelectedTicket(null);
      setMessages([]);
      return;
    }

    setDetailLoading(true);

    try {
      const { data } = await api.get(`/tickets/${ticketId}`);
      setSelectedTicket(data.ticket);
      setMessages(data.messages || []);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to load ticket details"));
    } finally {
      setDetailLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadTickets();
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadTicketDetails(selectedId);
  }, [selectedId]);

  

  const filtered = useMemo(
    () =>
      tickets.filter((ticket) => {
        const matchesFilter = filter === "all" || ticket.status === filter;
        const haystack = `${ticket.title} ${ticket.description}`.toLowerCase();
        return matchesFilter && haystack.includes(searchTerm.toLowerCase());
      }),
    [tickets, filter, searchTerm],
  );

  const counts = useMemo(
    () => ({
      all: tickets.length,
      open: tickets.filter((ticket) => ticket.status === "open").length,
      pending: tickets.filter((ticket) => ticket.status === "pending").length,
      resolved: tickets.filter((ticket) => ticket.status === "resolved").length,
    }),
    [tickets],
  );

  const handleAddTicket = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");

    try {
      const { data } = await api.post("/tickets", newTicket);
      setTickets((current) => [data.ticket, ...current]);
      setSelectedId(data.ticket._id);
      setShowForm(false);
      setNewTicket(emptyForm);
      setNotice("Ticket created and analyzed by AI.");
    } catch (err) {
      setError(getErrorMessage(err, "Unable to create ticket"));
    }
  };

  const updateStatus = async (status) => {
    if (!selectedTicket) return;

    try {
      const { data } = await api.patch(`/tickets/${selectedTicket._id}`, { status });
      setSelectedTicket((current) => ({ ...current, ...data.ticket }));
      setTickets((current) =>
        current.map((ticket) =>
          ticket._id === data.ticket._id ? { ...ticket, ...data.ticket } : ticket,
        ),
      );
    } catch (err) {
      setError(getErrorMessage(err, "Unable to update ticket"));
    }
  };

  const sendMessage = async () => {
    if (!replyText.trim() || !selectedTicket) return;

    try {
      await api.post(`/tickets/${selectedTicket._id}/messages`, { body: replyText });
      setReplyText("");
      await loadTicketDetails(selectedTicket._id);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to send message"));
    }
  };

  const refreshSuggestion = async () => {
    if (!selectedTicket) return;

    try {
      const { data } = await api.post(`/tickets/${selectedTicket._id}/suggest-reply`);
      setSelectedTicket((current) => ({
        ...current,
        ai: data.ai,
        priority: data.ai.priority,
        category: data.ai.category,
        department: data.ai.recommendedDepartment,
      }));
    } catch (err) {
      setError(getErrorMessage(err, "Unable to generate AI suggestion"));
    }
  };

  const selectedCustomer =
    selectedTicket?.customer?.username || selectedTicket?.customer?.email || "Customer";
  const suggestedReply = selectedTicket?.ai?.suggestedReply || "";

  useEffect(() => {
    if (suggestedReply) {
      setReplyText(suggestedReply);
    }
  }, [suggestedReply]);
  
  return (
    <>
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
          <form
            onSubmit={handleAddTicket}
            className="bg-[#0f172a] p-8 rounded-2xl border border-gray-800 w-full max-w-lg shadow-2xl space-y-5"
          >
            <h2 className="text-xl font-bold">Raise New Ticket</h2>
            <TextInput
              label="Issue Title"
              value={newTicket.title}
              onChange={(title) => setNewTicket({ ...newTicket, title })}
              placeholder="Payment gateway not working"
            />
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Description</label>
              <textarea
                required
                rows={5}
                value={newTicket.description}
                onChange={(event) =>
                  setNewTicket({ ...newTicket, description: event.target.value })
                }
                placeholder="Describe the issue so AI can classify it."
                className="w-full p-3 bg-[#1E293B] text-white rounded-lg outline-none border border-transparent focus:border-indigo-500"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 py-3 rounded-xl font-medium transition">
                Create Ticket
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-gray-700 hover:bg-gray-800 py-3 rounded-xl transition">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <Split
        className="h-[calc(100vh-90px)] flex w-full overflow-hidden bg-[#020617] text-white"
        sizes={[24, 46, 30]}
        minSize={[280, 500, 320]}
        gutterSize={8}
        gutterAlign="center"
        snapOffset={30}
      >
        <div className="overflow-auto min-w-[280px] ">
          <section className="h-full min-w-0 border-r border-gray-800 bg-gray-900/80 p-5 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-semibold">All Tickets ({counts.all})</h1>
              <button onClick={loadTickets} className="p-2 rounded-lg bg-[#1E293B] text-gray-300 hover:text-white">
                <FiRefreshCw />
              </button>
            </div>

            {error && <Alert tone="red">{error}</Alert>}
            {notice && <Alert tone="green">{notice}</Alert>}

            <div className="flex justify-between gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#1E293B] text-white outline-none border border-gray-700 focus:border-indigo-500"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </div>
              <div className="p-2 bg-[#1E293B] text-gray-400 border border-gray-700 rounded-lg">
                <SlidersHorizontal size={20} />
              </div>
            </div>

            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {["all", "open", "pending", "resolved"].map((item) => (
                <button
                  key={item}
                  onClick={() => setFilter(item)}
                  className={`px-3 py-2 rounded-lg text-sm capitalize whitespace-nowrap ${filter === item ? "bg-indigo-600 text-white" : "bg-[#1E293B] text-gray-400"
                    }`}
                >
                  {item} <span className="text-xs">{counts[item]}</span>
                </button>
              ))}
            </div>

            <div className="space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto pr-1">
              {loading && <p className="text-sm text-gray-400">Loading tickets...</p>}
              {!loading && filtered.length === 0 && (
                <p className="text-sm text-gray-400">No tickets found.</p>
              )}
              {filtered.map((ticket) => (
                <button
                  key={ticket._id}
                  onClick={() => {
                    setSelectedId(ticket._id);

                    setViewedTickets((prev) =>
                      prev.includes(ticket._id)
                        ? prev
                        : [...prev, ticket._id]
                    );
                  }}
                  className={`w-full text-left p-4 rounded-xl bg-[#0F172A] border flex justify-between items-start hover:border-indigo-500 transition ${selectedId === ticket._id ? "border-indigo-500 bg-indigo-500/10" : "border-gray-800"
                    }`}
                >
                  <div className="min-w-0 flex-1">
                    <h2 className="font-semibold text-sm truncate">{ticket.title}</h2>
                    <p className="text-xs text-gray-400 mt-1">
                      {ticket.customer?.username || user?.username || "Customer"}
                    </p>
                    <div className="flex gap-2 mt-2">
                      {ticket.source && (
                        <Badge className={`${sourceStyles[ticket.source] || "bg-gray-500/20 text-gray-300"} text-[9px]`}>
                          {ticket.source}
                        </Badge>
                      )}
                      <span className="text-[10px] text-gray-500">#{ticket._id.slice(-6).toUpperCase()}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-end ml-2 flex-shrink-0">
                    <Badge className={priorityStyles[ticket.priority]}>{ticket.priority}</Badge>
                    <Badge
                      className={
                        !viewedTickets.includes(ticket._id)
                          ? "bg-purple-500/20 text-purple-300"
                          : statusStyles[ticket.status]
                      }
                    >
                      {!viewedTickets.includes(ticket._id)
                        ? "NEW"
                        : ticket.status}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>





        <div className="overflow-auto min-w-[500px]">
          <section className="h-full min-w-0 p-6 border-r border-gray-800 overflow-y-auto">
            {!selectedTicket && (
              <div className="h-full grid place-items-center text-gray-400">
                Select a ticket to view details.
              </div>
            )}

            {selectedTicket && (
              <>
                <div className="mb-6 pb-6 border-b border-gray-800">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h1 className="text-xl font-bold text-white mb-2">
                        {selectedTicket.title}
                      </h1>
                      <p className="text-sm text-gray-400">
                        Ticket #{selectedTicket._id.slice(-6).toUpperCase()}
                      </p>
                    </div>
                    <Badge className={`${priorityStyles[selectedTicket.priority]}`}>
                      {selectedTicket.priority}
                    </Badge>
                  </div>

                  {/* Customer Info Card */}
                  <div className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border border-purple-500/20 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2 text-purple-300">
                      <Globe size={16} />
                      <span className="text-sm font-semibold">Contact Information</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 text-sm">Name:</span>
                        <span className="text-white font-medium">{selectedTicket.customer?.username || "Customer"}</span>
                      </div>
                      {selectedTicket.customer?.email && (
                        <div className="flex items-center gap-2">
                          <Mail size={14} className="text-gray-500" />
                          <span className="text-gray-300 text-sm break-all">{selectedTicket.customer.email}</span>
                        </div>
                      )}
                      {selectedTicket.source && (
                        <div className="flex items-center gap-2 mt-3">
                          <span className="text-gray-500 text-sm">Source:</span>
                          <Badge className={`${sourceStyles[selectedTicket.source] || "bg-gray-500/20 text-gray-300"} text-[10px]`}>
                            {selectedTicket.source}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <InfoCard label="Status" value={selectedTicket.status} />
                  <InfoCard label="Category" value={selectedTicket.category} />
                  <InfoCard label="Department" value={selectedTicket.department} />
                  <InfoCard
                    label="Created"
                    value={selectedTicket.createdAt ? new Date(selectedTicket.createdAt).toLocaleDateString() : "-"}
                  />
                </div>

                <div className="flex gap-3 mb-5">
                  {["open", "pending", "resolved", "closed"].map((status) => (
                    <button
                      key={status}
                      onClick={() => updateStatus(status)}
                      className={`px-3 py-2 rounded-lg text-xs capitalize ${selectedTicket.status === status ? "bg-indigo-600" : "bg-[#1E293B] text-gray-300"
                        }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>

<div className="flex gap-2 mb-4">
                  {["conversation", "notes", "activity"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 rounded-lg text-xs font-medium capitalize transition ${activeTab === tab
                        ? "bg-indigo-600 text-white"
                        : "bg-[#1E293B] text-gray-400 hover:text-white"
                        }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="mb-6 max-h-[45vh] overflow-y-auto pr-2">
                  {activeTab === "conversation" && (
                    <div className="space-y-4">
                      {detailLoading && (
                        <p className="text-sm text-gray-400">Loading conversation...</p>
                      )}

                      {messages.map((message) => (
                        <div
                          key={message._id}
                          className={`p-4 rounded-xl max-w-full ${message.author?._id === user?.id || message.author === user?.id
                            ? "bg-[#1E293B] ml-auto"
                            : "bg-[#0F172A]"
                            }`}
                        >
                          <p className="text-xs text-gray-400 mb-1">
                            {message.author?.username || selectedCustomer}
                          </p>
                          <p className="text-sm whitespace-pre-wrap">{message.body}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === "notes" && (
                    <div className="bg-[#0F172A] rounded-xl p-4 border border-gray-800 text-sm text-gray-400">
                      Internal notes coming soon...
                    </div>
                  )}

                  {activeTab === "activity" && (
                    <div className="bg-[#0F172A] rounded-xl p-4 border border-gray-800 text-sm text-gray-400">
                      Activity log coming soon...
                    </div>
                  )}
                </div>

              
              </>
            )}
          </section>
        </div>




        <div className="overflow-auto min-w-[320px]">
          <aside className="h-full min-w-0 bg-[#0b1120] p-6 overflow-y-auto">
            

            <div className="bg-[#0f172a] border border-gray-800 rounded-2xl p-5 space-y-6 shadow-xl">
              <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
                <IoSparklesOutline /> AI Assistant
                <span className="text-[10px] bg-indigo-500/20 px-2 py-0.5 rounded-full uppercase">Live</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-purple-400 text-sm font-medium">
                  <IoSparklesOutline /> Suggested Reply
                </div>

                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="AI suggestion will appear here..."
                  className="w-full min-h-40 bg-[#020617] border border-gray-800 rounded-xl p-4 text-sm text-gray-300 outline-none resize-none focus:border-indigo-500"
                />

                <div className="flex gap-2">
                  <button
                    onClick={refreshSuggestion}
                    disabled={!selectedTicket}
                    className="flex-1 border border-gray-800 text-gray-400 py-2 rounded-lg text-[10px] font-bold hover:bg-gray-800 transition disabled:opacity-40"
                  >
                    <FiRefreshCw className="inline mr-1" />
                    REGENERATE
                  </button>

                  <button
                    onClick={sendMessage}
                    disabled={!replyText.trim()}
                    className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-[10px] font-bold hover:bg-indigo-700 transition disabled:opacity-40"
                  >
                    SEND REPLY
                  </button>
                </div>

              </div>

              <div className="pt-4 border-t border-gray-800 space-y-3">
                <h3 className="text-xs font-bold text-gray-500 uppercase">AI Classification</h3>
                <InfoCard label="Sentiment" value={selectedTicket?.ai?.sentiment || "-"} />
                <InfoCard label="Summary" value={selectedTicket?.ai?.summary || "-"} />
              </div>
            </div>
          </aside>
        </div>

      </Split>

    </>
  );
};

const Alert = ({ children, tone }) => (
  <div className={`mb-4 rounded-lg border px-3 py-2 text-sm ${tone === "red"
    ? "border-red-500/30 bg-red-500/10 text-red-300"
    : "border-green-500/30 bg-green-500/10 text-green-300"
    }`}>
    {children}
  </div>
);

const Badge = ({ children, className = "" }) => (
  <span className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded ${className}`}>
    {children}
  </span>
);

const InfoCard = ({ label, value }) => (
  <div className="bg-[#0F172A] p-3 rounded-lg border border-gray-800 min-w-0">
    <p className="text-xs text-gray-400">{label}</p>
    <p className="text-sm truncate">{value}</p>
  </div>
);

const TextInput = ({ label, value, onChange, placeholder }) => (
  <div className="space-y-2">
    <label className="text-sm text-gray-400">{label}</label>
    <input
      required
      type="text"
      placeholder={placeholder}
      className="w-full p-3 bg-[#1E293B] text-white rounded-lg outline-none border border-transparent focus:border-indigo-500"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  </div>
);

export default Ticket;
