import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api.service';
import { socketService } from '../services/socket.service';

function DirectMessagePage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter states
  const [genderFilter, setGenderFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const currentUserId = apiService.getCurrentUserId();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 1. Initial Load: Fetch users & profile, connect WS
  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        const token = apiService.getToken();
        if (!token) {
          navigate('/login');
          return;
        }

        const [profileData, usersData, convData] = await Promise.all([
          apiService.getProfile(),
          apiService.getUsers({ gender: genderFilter, location: locationFilter }),
          apiService.getConversations()
        ]);

        if (!mounted) return;
        setCurrentUser(profileData.user);
        setUsers(usersData);
        setConversations(convData);
        setIsLoadingUsers(false);

        // Connect WebSocket
        await socketService.connect(token);

        socketService.on('direct_message', (payload) => {
          if (!mounted) return;
          
          setMessages((prev) => {
            // Only add if it belongs to the active conversation
            // But we don't have access to the latest activeConversation in this closure unless we use a ref or depend on it.
            // Let's just add it, and we will filter in the render, or we can use setState callback correctly.
            // We'll store conversationId on the message
            
            const newMessage = {
              id: payload.data._id,
              conversationId: payload.data.conversationId,
              senderId: payload.data.senderId,
              text: payload.data.content,
              createdAt: new Date(payload.data.createdAt),
              time: new Date(payload.data.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              sent: payload.data.senderId === currentUserId
            };

            // Prevent duplicates
            if (prev.some(m => m.id === newMessage.id)) return prev;
            return [...prev, newMessage].sort((a, b) => a.createdAt - b.createdAt);
          });
        });

      } catch (err) {
        console.error("Failed to init DMs", err);
        if (mounted) setIsLoadingUsers(false);
      }
    }

    init();

    return () => {
      mounted = false;
      socketService.disconnect();
    };
  }, [navigate, currentUserId]); // Removing genderFilter and locationFilter from deps to prevent reconnecting WS on filter change

  // Refetch users when filters change (without resetting WS or whole page)
  useEffect(() => {
    async function fetchFilteredUsers() {
      try {
        setIsLoadingUsers(true);
        const usersData = await apiService.getUsers({ gender: genderFilter, location: locationFilter });
        setUsers(usersData);
      } catch (err) {
        console.error("Failed to fetch filtered users", err);
      } finally {
        setIsLoadingUsers(false);
      }
    }
    
    // Skip initial render if currentUser is not set (handled by init)
    if (currentUser) {
        // debounce slightly for location typing
        const timeoutId = setTimeout(() => {
            fetchFilteredUsers();
        }, 300);
        return () => clearTimeout(timeoutId);
    }
  }, [genderFilter, locationFilter, currentUser]);

  // When a user is clicked, start/load conversation
  const handleUserClick = async (targetUserId) => {
    try {
      setIsHistoryLoading(true);
      const conv = await apiService.startConversation(targetUserId);
      setActiveConversation(conv);
      
      const history = await apiService.getDirectMessages(conv._id);
      
      const formattedHistory = history.map(m => ({
        id: m._id,
        conversationId: m.conversationId,
        senderId: m.senderId._id || m.senderId,
        text: m.content,
        time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        createdAt: new Date(m.createdAt),
        sent: (m.senderId._id || m.senderId) === currentUserId
      }));

      setMessages(formattedHistory.sort((a, b) => a.createdAt - b.createdAt));
      setIsHistoryLoading(false);
    } catch (err) {
      console.error("Failed to load conversation", err);
      setIsHistoryLoading(false);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputValue.trim() === '' || !activeConversation) return;

    socketService.sendDirectMessage(activeConversation._id, inputValue);
    setInputValue('');
  };

  const getOtherParticipant = (conv) => {
      return conv.participants.find(p => p._id !== currentUserId) || conv.participants[0];
  };

  const filteredUsers = users.filter(u => u.username.toLowerCase().includes(searchQuery.toLowerCase()));
  
  // Filter messages for active conversation
  const activeMessages = activeConversation 
    ? messages.filter(m => m.conversationId === activeConversation._id)
    : [];

  return (
    <div className="bg-[#060e20] text-[#dee5ff] font-['Inter'] min-h-screen flex">
      {/* Sidebar - Users List */}
      <aside className="w-80 border-r border-[#40485d]/20 bg-[#091328] flex flex-col shadow-2xl relative z-20">
        <div className="p-6 border-b border-[#40485d]/20">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold font-['Plus_Jakarta_Sans'] text-white">Messages</h2>
                <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className={`p-2 rounded-lg transition-colors ${showFilters ? 'bg-[#a3a6ff]/20 text-[#a3a6ff]' : 'bg-[#141f38] text-[#a3aac4] hover:text-white'}`}
                >
                    <span className="material-symbols-outlined text-[18px]">filter_list</span>
                </button>
            </div>
            
            <div className="relative mb-3">
                <input 
                    type="text" 
                    placeholder="Search users..." 
                    className="w-full bg-[#141f38] text-sm text-[#dee5ff] border border-transparent focus:border-[#a3a6ff]/40 focus:ring-1 focus:ring-[#a3a6ff]/40 rounded-xl py-3 px-4 pl-10 outline-none transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <span className="material-symbols-outlined absolute left-3 top-3 text-[#a3aac4] text-[18px]">search</span>
            </div>

            {/* Filter Dropdown/Panel */}
            {showFilters && (
                <div className="bg-[#141f38] rounded-xl p-3 space-y-3 border border-[#40485d]/30 mb-2 animate-in slide-in-from-top-2 duration-200">
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#a3aac4] mb-1 block pl-1">Gender</label>
                        <select 
                            value={genderFilter}
                            onChange={(e) => setGenderFilter(e.target.value)}
                            className="w-full bg-[#091328] text-xs text-[#dee5ff] border border-[#40485d]/30 rounded-lg py-2 px-3 outline-none focus:border-[#a3a6ff]/50"
                        >
                            <option value="all">All Genders</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-widest text-[#a3aac4] mb-1 block pl-1">Location</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="City or country..."
                                value={locationFilter}
                                onChange={(e) => setLocationFilter(e.target.value)}
                                className="w-full bg-[#091328] text-xs text-[#dee5ff] border border-[#40485d]/30 rounded-lg py-2 px-3 pl-8 outline-none focus:border-[#a3a6ff]/50"
                            />
                            <span className="material-symbols-outlined absolute left-2.5 top-2 text-[#a3aac4] text-[14px]">location_on</span>
                        </div>
                    </div>
                </div>
            )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-1" style={{ scrollbarWidth: 'none' }}>
            {isLoadingUsers && <div className="text-center text-[#a3aac4] text-sm p-4">Loading users...</div>}
            
            {!isLoadingUsers && filteredUsers.map(user => {
                const isActive = activeConversation && getOtherParticipant(activeConversation)?._id === user._id;
                return (
                    <button 
                        key={user._id}
                        onClick={() => handleUserClick(user._id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${isActive ? 'bg-[#141f38] border border-[#a3a6ff]/20' : 'hover:bg-[#141f38]/50 border border-transparent'}`}
                    >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#a3a6ff] to-[#6063ee] flex items-center justify-center text-[#0f00a4] font-bold text-sm">
                            {user.username.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <h3 className={`font-['Plus_Jakarta_Sans'] font-medium truncate ${isActive ? 'text-white' : 'text-[#a3aac4]'}`}>{user.username}</h3>
                            <div className="flex items-center gap-2 mt-0.5">
                                <p className="text-[10px] text-[#40485d] truncate capitalize">{user.gender || 'Unknown'}</p>
                                {user.location && (
                                    <>
                                        <span className="w-1 h-1 rounded-full bg-[#40485d]"></span>
                                        <p className="text-[10px] text-[#40485d] truncate flex items-center gap-0.5">
                                            <span className="material-symbols-outlined text-[10px]">location_on</span>
                                            {user.location}
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                    </button>
                )
            })}
        </div>
        
        <div className="p-4 border-t border-[#40485d]/20">
            <button onClick={() => navigate('/dashboard')} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#141f38] text-[#a3aac4] hover:text-white transition-all text-sm font-medium">
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                Back to Dashboard
            </button>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col relative bg-[#000000] overflow-hidden">
        {/* Cinematic overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-50" style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.05) 0%, transparent 80%)'
        }}></div>

        {activeConversation ? (
            <>
                <header className="sticky top-0 z-30 flex justify-between items-center w-full px-8 h-20 bg-[#091328]/80 backdrop-blur-md border-b border-[#40485d]/20 shadow-none">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#141f38] overflow-hidden flex items-center justify-center text-[#a3a6ff] border border-[#40485d]/30 font-bold">
                            {getOtherParticipant(activeConversation)?.username.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-white font-['Plus_Jakarta_Sans'] font-bold text-lg tracking-tight">
                                {getOtherParticipant(activeConversation)?.username}
                            </h1>
                            <p className="text-[#a3aac4] text-[11px] font-medium uppercase tracking-wider">Direct Message</p>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto px-8 py-8 space-y-6 relative z-10" style={{ scrollbarWidth: 'none' }}>
                    {isHistoryLoading && (
                        <div className="flex justify-center py-10">
                            <div className="w-8 h-8 border-2 border-[#a3a6ff] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}

                    {!isHistoryLoading && activeMessages.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                            <span className="material-symbols-outlined text-5xl mb-4">waving_hand</span>
                            <p className="text-sm">Say hello to {getOtherParticipant(activeConversation)?.username}!</p>
                        </div>
                    )}

                    {activeMessages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex items-end gap-3 group ${message.sent ? 'flex-row-reverse ml-auto max-w-[70%]' : 'max-w-[70%]'}`}
                        >
                            {!message.sent && (
                                <div className="w-8 h-8 rounded-full bg-[#141f38] flex-shrink-0 flex items-center justify-center border border-[#40485d]/20 text-[10px] font-bold text-[#a3a6ff]">
                                    {getOtherParticipant(activeConversation)?.username.substring(0, 2).toUpperCase()}
                                </div>
                            )}
                            <div className={`flex flex-col ${message.sent ? 'items-end' : 'items-start'} gap-1`}>
                                <div
                                className={`px-5 py-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                    message.sent
                                    ? 'bg-gradient-to-tr from-[#a3a6ff] to-[#6063ee] text-[#0f00a4] font-medium shadow-lg shadow-indigo-500/10'
                                    : 'bg-[#141f38] text-[#dee5ff] border border-[#40485d]/20'
                                }`}
                                style={{
                                    borderBottomLeftRadius: !message.sent ? '4px' : '16px',
                                    borderBottomRightRadius: message.sent ? '4px' : '16px'
                                }}
                                >
                                    {message.text}
                                </div>
                                <span className="text-[#40485d] text-[10px] font-medium px-1">{message.time}</span>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-6 bg-[#000000]/80 backdrop-blur-md relative z-20 border-t border-[#40485d]/20">
                    <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex items-center gap-4">
                        <div className="flex-1 relative">
                            <input
                                className="w-full bg-[#141f38] text-[#dee5ff] border border-[#40485d]/30 focus:border-[#a3a6ff]/50 focus:ring-1 focus:ring-[#a3a6ff]/30 rounded-2xl py-4 px-6 text-sm placeholder:text-[#a3aac4] transition-all outline-none"
                                placeholder="Type a message..."
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={!inputValue.trim()}
                            className="bg-gradient-to-tr from-[#a3a6ff] to-[#6063ee] text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 active:scale-90 transition-all flex-shrink-0 disabled:opacity-50 hover:shadow-indigo-500/40"
                        >
                            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                                send
                            </span>
                        </button>
                    </form>
                </div>
            </>
        ) : (
            <div className="flex-1 flex flex-col items-center justify-center">
                <div className="w-24 h-24 rounded-3xl bg-[#141f38] flex items-center justify-center mb-6 shadow-2xl border border-[#40485d]/20 rotate-12">
                    <span className="material-symbols-outlined text-[#a3a6ff] text-5xl -rotate-12">forum</span>
                </div>
                <h2 className="text-2xl font-bold text-white font-['Plus_Jakarta_Sans'] mb-2">Direct Messages</h2>
                <p className="text-[#a3aac4] text-sm text-center max-w-sm">Select a user from the sidebar to start a private, end-to-end encrypted conversation.</p>
            </div>
        )}
      </main>
    </div>
  );
}

export default DirectMessagePage;
