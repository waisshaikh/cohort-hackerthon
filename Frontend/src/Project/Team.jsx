import { useState, useEffect } from 'react'; // 1. useEffect add kiya
import { FiMoreVertical, FiMessageSquare, FiEye, FiTrash2, FiX, FiCamera, FiSend } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function Team() {
  // --- STATES ---
  // 2. State ko localStorage se initialize kiya
  const [team, setTeam] = useState(() => {
    const savedData = localStorage.getItem('tenantDesk_team');
    return savedData ? JSON.parse(savedData) : [
      { id: 1, name: "Akash", role: "Admin", status: "Online", tasks: 80, email: "akash@tenantdesk.ai", image: null },
      { id: 2, name: "Rohit", role: "Support", status: "Offline", tasks: 45, email: "rohit@tenantdesk.ai", image: null },
      { id: 3, name: "Priya", role: "Developer", status: "Online", tasks: 65, email: "priya@tenantdesk.ai", image: null },
    ];
  });

  const [chatHistories, setChatHistories] = useState(() => {
    const savedChats = localStorage.getItem('tenantDesk_chats');
    return savedChats ? JSON.parse(savedChats) : {};
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [activeChat, setActiveChat] = useState(null); 
  const [messageInput, setMessageInput] = useState(""); 
  const [newMember, setNewMember] = useState({ name: "", role: "Developer", tasks: 0, image: null });

  // 3. Save to localStorage whenever 'team' changes
  useEffect(() => {
    localStorage.setItem('tenantDesk_team', JSON.stringify(team));
    localStorage.setItem('tenantDesk_chats', JSON.stringify(chatHistories));
  }, [team, chatHistories]);// 4. Message send karne ka function
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeChat) return;

    const newMessage = {
      id: Date.now(),
      text: messageInput,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistories(prev => ({
      ...prev,
      [activeChat.id]: [...(prev[activeChat.id] || []), newMessage]
    }));

    setMessageInput(""); // Send karne ke baad box khali kar do
  };



  // --- IMAGE UPLOAD HANDLER ---
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewMember({ ...newMember, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // --- HANDLERS ---
  const handleAddMember = (e) => {
    e.preventDefault();
    const member = {
      ...newMember,
      id: Date.now(),
      status: "Online",
      email: `${newMember.name.toLowerCase().replace(/\s/g, '')}@tenantdesk.ai`
    };
    setTeam([...team, member]);
    setShowAddModal(false);
    setNewMember({ name: "", role: "Developer", tasks: 0, image: null });
  };

  const removeMember = (id) => {
    setTeam(team.filter(m => m.id !== id));
    if (selectedMember?.id === id) setSelectedMember(null);
    if (activeChat?.id === id) setActiveChat(null);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8 relative">
      
      {/* HEADER */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Team Members</h1>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-2.5 rounded-xl font-bold shadow-lg hover:opacity-90 transition active:scale-95"
        >
          + Add Member
        </button>
      </div>

      {/* TEAM GRID */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
        {team.map((member) => (
          <motion.div 
            layout
            key={member.id}
            className="bg-[#0f172a] border border-gray-800 rounded-3xl p-6 relative group overflow-hidden"
          >
            <button 
              onClick={() => removeMember(member.id)}
              className="absolute top-4 right-4 text-gray-600 hover:text-red-500 transition z-10"
            >
              <FiTrash2 size={16} />
            </button>

            <div className="flex flex-col items-center gap-4 mb-6">
              <div className="relative">
                {member.image ? (
                  <img src={member.image} alt="profile" className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500/30" />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center font-bold text-2xl shadow-xl">
                    {member.name[0]}
                  </div>
                )}
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 border-[#0f172a] ${member.status === 'Online' ? 'bg-green-500' : 'bg-gray-500'}`} />
              </div>
              
              <div className="text-center">
                <h2 className="text-xl font-bold">{member.name}</h2>
                <span className="text-[10px] uppercase text-indigo-400 font-black tracking-widest">{member.role}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="w-full bg-gray-900 h-1.5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: `${member.tasks}%` }} 
                  className="bg-indigo-500 h-full" 
                />
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => setSelectedMember(member)}
                  className="flex-1 bg-[#1e293b] hover:bg-[#2d3748] py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition"
                >
                  <FiEye /> View
                </button>
                <button 
                  onClick={() => setActiveChat(member)}
                  className="flex-1 border border-indigo-500/20 bg-indigo-500/5 hover:bg-indigo-500/10 py-2.5 rounded-xl text-xs font-bold text-indigo-400 flex items-center justify-center gap-2 transition"
                >
                  <FiMessageSquare /> Message
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ADD MEMBER MODAL */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.form 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onSubmit={handleAddMember}
              className="bg-[#0f172a] border border-gray-800 p-8 rounded-[2.5rem] w-full max-w-md space-y-5 shadow-2xl"
            >
              <h2 className="text-2xl font-bold text-center">New Member Details</h2>
              
              <div className="flex justify-center">
                <label className="relative cursor-pointer group">
                  <div className="w-24 h-24 rounded-3xl bg-gray-800 border-2 border-dashed border-gray-600 flex items-center justify-center overflow-hidden group-hover:border-indigo-500 transition-all">
                    {newMember.image ? (
                      <img src={newMember.image} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center">
                        <FiCamera size={24} className="mx-auto text-gray-500" />
                        <span className="text-[10px] text-gray-500 block mt-1">Photo</span>
                      </div>
                    )}
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
              </div>

              <input 
                required
                className="w-full bg-gray-900 border border-gray-800 p-4 rounded-2xl outline-none focus:border-indigo-500 transition"
                placeholder="Full Name"
                onChange={(e) => setNewMember({...newMember, name: e.target.value})}
              />
              <select 
                className="w-full bg-gray-900 border border-gray-800 p-4 rounded-2xl outline-none"
                onChange={(e) => setNewMember({...newMember, role: e.target.value})}
              >
                <option value="Developer">Developer</option>
                <option value="Admin">Admin</option>
                <option value="Support">Support</option>
              </select>
              
              <div className="flex flex-col gap-3 pt-4">
                <button type="submit" className="bg-indigo-600 py-4 rounded-2xl font-bold hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] transition">Add Member</button>
                <button type="button" onClick={() => setShowAddModal(false)} className="text-gray-500 text-sm font-bold">Cancel</button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

      {/* MESSAGING MODAL */}
      <AnimatePresence>
        {activeChat && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="bg-[#0f172a] border border-gray-800 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold overflow-hidden">
                    {activeChat.image ? <img src={activeChat.image} className="w-full h-full object-cover" alt="" /> : activeChat.name[0]}
                  </div>
                  <h3 className="font-bold">Chat with {activeChat.name}</h3>
                </div>
                <button onClick={() => setActiveChat(null)} className="text-gray-400 hover:text-white"><FiX size={20} /></button>
              </div>
              
              {/* Chat Body */}
              <div className="h-80 p-6 overflow-y-auto space-y-4 bg-[#020617]/50 flex flex-col custom-scrollbar">
                <div className="bg-indigo-600/10 text-indigo-300 p-3 rounded-2xl rounded-tl-none self-start max-w-[80%] text-sm border border-indigo-500/10">
                  Hello! How is the dashboard progress going?
                </div>

                {/* Displaying Messages from State */}
                {(chatHistories[activeChat.id] || []).map((msg) => (
                  <div key={msg.id} className={`p-3 rounded-2xl max-w-[80%] text-sm ${msg.sender === 'me' ? 'bg-indigo-600 text-white self-end rounded-tr-none' : 'bg-gray-800 text-gray-300 self-start rounded-tl-none'}`}>
                    {msg.text}
                    <span className="block text-[8px] mt-1 opacity-60 text-right">{msg.time}</span>
                  </div>
                ))}
              </div>

              {/* Input Form (Fixed: added onSubmit) */}
              <form onSubmit={handleSendMessage} className="p-4 flex gap-2 bg-gray-900/50">
                <input 
                  autoFocus
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-4 py-2 outline-none focus:border-indigo-500 text-sm" 
                  placeholder="Type a message..." 
                />
                <button type="submit" className="bg-indigo-600 p-3 rounded-xl hover:scale-105 active:scale-95 transition text-white">
                  <FiSend size={18} />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* VIEW DETAILS SIDEBAR */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-[#0f172a] border-l border-gray-800 z-[60] p-8 shadow-2xl flex flex-col"
          >
            <button onClick={() => setSelectedMember(null)} className="mb-8 text-gray-400 hover:text-white self-start">
              <FiX size={24} />
            </button>
            
            <div className="text-center space-y-4">
              {selectedMember.image ? (
                <img src={selectedMember.image} alt="profile" className="w-24 h-24 rounded-[2rem] mx-auto object-cover border-4 border-indigo-500/20 shadow-2xl" />
              ) : (
                <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-indigo-500 to-purple-600 mx-auto flex items-center justify-center text-4xl font-bold shadow-xl">
                  {selectedMember.name[0]}
                </div>
              )}
              <h2 className="text-2xl font-bold">{selectedMember.name}</h2>
              <p className="text-indigo-400 font-black uppercase text-xs tracking-widest">{selectedMember.role}</p>
            </div>

            <div className="mt-12 space-y-6">
              <div className="bg-[#1e293b] p-4 rounded-2xl border border-gray-800">
                <p className="text-xs text-gray-500 font-bold uppercase mb-1 tracking-tighter">Email Address</p>
                <p className="text-sm font-medium">{selectedMember.email}</p>
              </div>
              <div className="bg-[#1e293b] p-4 rounded-2xl border border-gray-800">
                <p className="text-xs text-gray-500 font-bold uppercase mb-1 tracking-tighter">Task Performance</p>
                <div className="flex items-center gap-4">
                   <div className="flex-1 bg-gray-900 h-2 rounded-full overflow-hidden">
                      <div className="bg-green-500 h-full" style={{ width: `${selectedMember.tasks}%` }}></div>
                   </div>
                   <span className="font-bold text-sm">{selectedMember.tasks}%</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => removeMember(selectedMember.id)}
              className="mt-auto w-full border border-red-500/30 text-red-400 py-4 rounded-2xl font-bold hover:bg-red-500/10 transition"
            >
              Remove from Team
            </button>
            {/* Message Input Form */}
              
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}