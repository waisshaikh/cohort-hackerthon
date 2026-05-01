import { Search, SlidersHorizontal } from "lucide-react";
import { useState, useEffect } from 'react';
import { FiFilter, FiRefreshCw } from "react-icons/fi";
import { AiOutlineUser } from "react-icons/ai";
import { IoSparklesOutline } from "react-icons/io5";
import { MdOutlineInsertDriveFile } from "react-icons/md";

const initialTickets = [
  { id: "TK-1001", title: "Payment gateway not working", user: "Michael Johnson", time: "2m ago", priority: "high", status: "open" },
  { id: "TK-1002", title: "Unable to login to account", user: "Sarah Williams", time: "15m ago", priority: "medium", status: "open" },
  { id: "TK-1003", title: "Invoice not generated", user: "David Brown", time: "1h ago", priority: "low", status: "pending" },
  { id: "TK-1004", title: "Feature request: Dark mode", user: "Emily Davis", time: "2h ago", priority: "low", status: "resolved" },
  { id: "TK-1005", title: "Bug in the reporting module", user: "James Wilson", time: "3h ago", priority: "high", status: "open" },
];

const priorityStyles = {
  high: "bg-red-500/20 text-red-400",
  medium: "bg-yellow-500/20 text-yellow-400",
  low: "bg-green-500/20 text-green-400",
};

const statusStyles = {
  open: "bg-blue-500/20 text-blue-400",
  pending: "bg-yellow-500/20 text-yellow-400",
  resolved: "bg-green-500/20 text-green-400",
};

const Ticket = () => {
  // --- STATES ---
  // 1. Initial State ko LocalStorage se check kar rahe hain
  const [tickets, setTickets] = useState(() => {
    const saved = localStorage.getItem('tenantDesk_tickets');
    return saved ? JSON.parse(saved) : initialTickets;
  });

  const [filter, setFilter] = useState("all");
  const [tab, setTab] = useState("conversation");
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newTicket, setNewTicket] = useState({ title: "", priority: "low" });

  const [messages, setMessages] = useState([
    { id: 1, sender: "user", name: "Michael Johnson", text: "Hi, I'm trying to make a payment but the gateway is showing an error.", time: "2m ago" },
    { id: 2, sender: "ai", name: "AI Assistant", text: "Customer is facing payment gateway issue. Tried multiple cards.", time: "1m ago" },
    { id: 3, sender: "agent", name: "John Smith", text: "Hi Michael, let me check this for you.", time: "Just now" },
  ]);

  // 2. Jab bhi tickets change honge, storage update hogi
  useEffect(() => {
    localStorage.setItem('tenantDesk_tickets', JSON.stringify(tickets));
  }, [tickets]);

  // --- LOGIC ---
  const filtered = tickets.filter((t) => {
    const matchesFilter = filter === "all" ? true : t.status === filter;
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const counts = {
    all: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    pending: tickets.filter(t => t.status === 'pending').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
  };

  const handleAddTicket = (e) => {
    e.preventDefault();
    const ticketObj = {
      id: `TK-${1000 + tickets.length + 1}`,
      title: newTicket.title,
      user: "Ganesh Rajput", 
      time: "Just now",
      priority: newTicket.priority,
      status: "open",
    };

    // Direct update and save
    const updatedTickets = [ticketObj, ...tickets];
    setTickets(updatedTickets);
    localStorage.setItem('tenantDesk_tickets', JSON.stringify(updatedTickets));
    
    setShowForm(false);
    setNewTicket({ title: "", priority: "low" });
  };

  return (
    <div className='flex p-2 border-[#1E293B] relative'>
      
      {/* MODAL OVERLAY FOR NEW TICKET */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
          <form onSubmit={handleAddTicket} className="bg-[#0f172a] p-8 rounded-2xl border border-gray-800 w-[400px] shadow-2xl space-y-6">
            <h2 className="text-xl font-bold text-white">Raise New Ticket</h2>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Issue Title</label>
              <input 
                required
                type="text" 
                placeholder="e.g. Login page crashing"
                className="w-full p-3 bg-[#1E293B] text-white rounded-lg outline-none border border-transparent focus:border-indigo-500"
                value={newTicket.title}
                onChange={(e) => setNewTicket({...newTicket, title: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Priority</label>
              <select 
                className="w-full p-3 bg-[#1E293B] text-white rounded-lg outline-none border border-transparent focus:border-indigo-500"
                value={newTicket.priority}
                onChange={(e) => setNewTicket({...newTicket, priority: e.target.value})}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 py-3 rounded-xl font-medium transition">Create Ticket</button>
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-gray-700 hover:bg-gray-800 py-3 rounded-xl transition">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* First Div: All Ticket */}
      <div className='py-4 px-6 bg-gray-800 rounded-lg w-1/3'>
        <h1 className="text-xl font-semibold mb-4 text-white">
          All Tickets ({counts.all})
        </h1>

        <div className="flex justify-between gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#1E293B] text-white outline-none border border-gray-700 focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="p-2 bg-[#1E293B] text-gray-400 border border-gray-700 rounded-lg cursor-pointer hover:text-white">
            <SlidersHorizontal size={20}/>
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button onClick={() => setFilter("all")} className={`px-4 py-2 rounded-lg text-sm ${filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-[#1E293B] text-gray-400'}`}>
            All
          </button>
          <button onClick={() => setFilter("open")} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/20 text-blue-400 text-sm whitespace-nowrap">
            Open <span className="bg-blue-500/30 px-1.5 rounded text-xs">{counts.open}</span>
          </button>
          <button onClick={() => setFilter("pending")} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-500/20 text-yellow-400 text-sm whitespace-nowrap">
            Pending <span className="bg-yellow-500/30 px-1.5 rounded text-xs">{counts.pending}</span>
          </button>
          <button onClick={() => setFilter("resolved")} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/20 text-green-400 text-sm whitespace-nowrap">
            Resolved <span className="bg-green-500/30 px-1.5 rounded text-xs">{counts.resolved}</span>
          </button>
        </div>

        {/* Tickets List */}
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
          {filtered.map((t) => (
            <div key={t.id} className="p-4 rounded-xl bg-[#0F172A] border border-gray-800 flex justify-between items-start hover:border-indigo-500 transition cursor-pointer">
              <div>
                <h2 className="font-medium text-white text-sm line-clamp-1">{t.title}</h2>
                <p className="text-xs text-gray-400 mt-1">{t.user} • {t.time}</p>
                <p className="text-[10px] text-gray-500 mt-1">#{t.id}</p>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <span className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded ${priorityStyles[t.priority]}`}>{t.priority}</span>
                <span className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded ${statusStyles[t.status]}`}>{t.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Second Div: Integrated Middle Section */}
      <div className="bg-[#020617] text-white p-6 w-1/3 min-h-screen border-r border-gray-800 overflow-y-auto">
          <div className="mb-4">
              <h1 className="text-lg font-semibold">
                  Payment gateway not working
                  <span className="ml-3 px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded">
                      High Priority
                  </span>
              </h1>
              <p className="text-sm text-gray-400">
                  Ticket #TK-1001 • Created 2m ago • Via Web
              </p>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-[#0F172A] p-3 rounded-lg border border-gray-800">
                  <p className="text-xs text-gray-400">Status</p>
                  <p className="text-blue-400">Open</p>
              </div>
              <div className="bg-[#0F172A] p-3 rounded-lg border border-gray-800">
                  <p className="text-xs text-gray-400">Assigned</p>
                  <p className="text-sm">John Smith</p>
              </div>
              <div className="bg-[#0F172A] p-3 rounded-lg border border-gray-800">
                  <p className="text-xs text-gray-400">Team</p>
                  <p className="text-sm">Billing Team</p>
              </div>
              <div className="bg-[#0F172A] p-3 rounded-lg border border-gray-800">
                  <p className="text-xs text-gray-400">SLA</p>
                  <p className="text-green-400 text-sm">2h left</p>
              </div>
          </div>

          <div className="flex gap-6 border-b border-gray-700 mb-4">
              {["conversation", "details", "notes"].map((t) => (
                  <button
                      key={t}
                      onClick={() => setTab(t)}
                      className={`pb-2 capitalize text-sm transition ${
                          tab === t ? "border-b-2 border-indigo-500 text-indigo-400" : "text-gray-400 hover:text-white"
                      }`}
                  >
                      {t}
                  </button>
              ))}
          </div>

          <div className="space-y-4 mb-6 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
              {messages.map((msg) => (
                  <div
                      key={msg.id}
                      className={`p-4 rounded-xl max-w-full ${
                          msg.sender === "user" ? "bg-[#0F172A]" : msg.sender === "ai" ? "bg-indigo-500/20" : "bg-[#1E293B] ml-auto"
                      }`}
                  >
                      <p className="text-xs text-gray-400 mb-1">{msg.name} • {msg.time}</p>
                      <p className="text-sm">{msg.text}</p>
                  </div>
              ))}
          </div>

          <div className="bg-[#0F172A] p-4 rounded-xl border border-gray-800 flex items-center gap-3 sticky bottom-0">
              <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 bg-transparent outline-none text-sm"
              />
              <button className="bg-indigo-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition">
                  Send
              </button>
          </div>
      </div>

      {/* Third Div: AI Sidebar */}
      <div className="bg-[#0b1120] text-white p-6 w-1/3">
        <div className="flex gap-3 mb-6">
          <button className="border border-gray-800 px-4 py-2 rounded-lg flex items-center gap-2 text-xs text-gray-300 hover:bg-gray-800 transition"><FiFilter /> Filters</button>
          <button onClick={() => setShowForm(true)} className="ml-auto bg-gradient-to-r from-purple-500 to-indigo-500 px-4 py-2 rounded-lg text-xs font-bold hover:opacity-90 transition shadow-lg shadow-indigo-500/20">
            + NEW TICKET
          </button>
        </div>

        <div className="bg-[#0f172a] border border-gray-800 rounded-2xl p-5 space-y-6 shadow-xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
              <AiOutlineUser /> AI Assistant <span className="text-[10px] bg-indigo-500/20 px-2 py-0.5 rounded-full uppercase">Beta</span>
            </div>
            <button className="text-gray-600 hover:text-gray-400">✕</button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-purple-400 text-sm font-medium"><IoSparklesOutline /> Suggested Reply</div>
            <div className="bg-[#020617] border border-gray-800 rounded-xl p-4 text-sm text-gray-300 leading-relaxed">
              <p>Hi Michael,</p>
              <br />
              <p>I understand you are facing issues with the payment gateway.</p>
              <p>Our team is already looking into this. Could you please share a screenshot of the error you are seeing?</p>
              <br />
              <p>This will help us resolve it faster.</p>
              <br />
              <p>Thanks,</p>
              <p>Support Team</p>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 py-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 hover:bg-indigo-600/30 transition"><MdOutlineInsertDriveFile /> INSERT</button>
              <button className="flex-1 border border-gray-800 text-gray-400 py-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 hover:bg-gray-800 transition"><FiRefreshCw /> REGEN</button>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-800">
            <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Sentiment Analysis</h3>
            <div className="flex justify-between items-end mb-2">
               <span className="text-xs text-red-400 font-medium">Negative</span>
               <span className="text-xs text-gray-500">85%</span>
            </div>
            <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-red-500 h-full w-[85%] shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
            </div>
          </div>
          
          <button className="w-full bg-indigo-600 py-3 rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition">
            ESCALATE TO HUMAN AGENT
          </button>
        </div>
      </div>
    </div>
  );
}

export default Ticket;