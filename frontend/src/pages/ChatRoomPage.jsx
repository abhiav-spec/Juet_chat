import { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { apiService } from '../services/api.service'
import { socketService } from '../services/socket.service'
import { useLanguage } from '../hooks/useLanguage'
import { dashboardTranslations } from '../locales/dashboard'

function ChatRoomPage() {
  const navigate = useNavigate()
  const { roomId } = useParams()
  
  const [messages, setMessages] = useState([])
  const [roomInfo, setRoomInfo] = useState(null)
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isHistoryLoading, setIsHistoryLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [currentUser, setCurrentUser] = useState(null)
  const [roomMembers, setRoomMembers] = useState([])
  const [onlineUsers, setOnlineUsers] = useState(new Set())
  const [isMembersOpen, setIsMembersOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  
  const { language } = useLanguage()
  const t = dashboardTranslations[language] || dashboardTranslations['en']
  
  const currentUserId = apiService.getCurrentUserId()
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleDeleteRoom = async (roomId, navigate) => {
    if (!window.confirm(language === 'hi' ? 'क्या आप वाकई इस रूम को हटाना चाहते हैं? यह क्रिया पूर्ववत नहीं की जा सकती।' : 'Are you sure you want to delete this room? This action cannot be undone.')) return;

    try {
        setIsDeleting(true)
        const response = await apiService.deleteRoom(roomId);
        if (response.error) {
            alert(response.error);
        } else {
            alert(t.profile.deleteSuccess);
            navigate('/dashboard');
        }
    } catch (err) {
        console.error('Delete error:', err);
        alert('Failed to delete room.');
    } finally {
        setIsDeleting(false)
    }
  }

  const handleLeaveRoom = async () => {
    if (!window.confirm(language === 'hi' ? 'क्या आप वाकई इस चैट रूम को छोड़ना चाहते हैं? दोबारा शामिल होने के लिए आपको फिर से पासकी दर्ज करनी होगी।' : 'Are you sure you want to leave this chat room? You will need to enter the passkey again to re-join.')) return;

    try {
        setIsDeleting(true)
        const response = await apiService.leaveRoom(roomId);
        if (response.error) {
            alert(response.error);
        } else {
            alert('You have left the room.');
            navigate('/dashboard');
        }
    } catch (err) {
        console.error('Leave error:', err);
        alert('Failed to leave room.');
    } finally {
        setIsDeleting(false)
    }
  }

  const handleDeleteMessage = (messageId) => {
    if (window.confirm(language === 'hi' ? 'इस संदेश को हटाएं?' : 'Delete this message?')) {
        socketService.deleteMessage(messageId);
    }
  }

  // 1. Initial Load & Socket Connection
  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        // 1. Fetch Room Info
        const data = await apiService.getRoom(roomId)
        if (!mounted) return
        setRoomInfo(data.room)

        // 2. Fetch Room Members
        const membersData = await apiService.getRoomMembers(roomId)
        if (mounted) setRoomMembers(membersData)

        const token = apiService.getToken()
        if (!token) {
          navigate('/login')
          return
        }

        // Connect but don't block history loading yet
        await socketService.connect(token)
        
        // Setup handlers
        socketService.on('history', (payload) => {
          if (!mounted) return;
          
          setMessages(prev => {
            const history = payload.messages.map(m => ({
              id: m.id || m._id,
              author: m.sender || 'Unknown',
              text: m.content || m.message,
              time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              createdAt: new Date(m.createdAt), // Store raw date for sorting
              sent: m.senderId?.toString() === currentUserId
            }))

            // Merge and deduplicate
            const combined = [...history, ...prev]
            const unique = Array.from(new Map(combined.map(m => [m.id, m])).values())
            
            // Re-sort chronologically just in case
            return unique.sort((a, b) => a.createdAt - b.createdAt)
          })

          setIsHistoryLoading(false)
          setShowPasswordPrompt(false)
          setError(null)
        })

        socketService.on('message', (payload) => {
          if (!mounted) return;
          
          setMessages((prev) => {
            const newMessage = {
              id: payload.id || Date.now(),
              author: payload.sender,
              text: payload.message,
              time: new Date(payload.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              createdAt: new Date(payload.createdAt),
              sent: payload.senderId?.toString() === currentUserId || payload.sender === 'You',
              isDeleted: payload.isDeleted || false
            };

            // Prevent duplicates
            if (prev.some(m => m.id === newMessage.id)) return prev;

            const combined = [...prev, newMessage];
            return combined.sort((a, b) => a.createdAt - b.createdAt);
          })
        })

        socketService.on('message_deleted', (payload) => {
          if (!mounted) return;
          setMessages((prev) => 
            prev.map((msg) => 
              msg.id === payload.messageId 
                ? { ...msg, text: language === 'hi' ? 'यह संदेश हटा दिया गया था' : 'This message was deleted', isDeleted: true } 
                : msg
            )
          );
        });

        socketService.on('presence', (payload) => {
          if (!mounted) return;
          setOnlineUsers(prev => {
            const next = new Set(prev);
            if (payload.status === 'online') {
              next.add(payload.userId);
            } else {
              next.delete(payload.userId);
            }
            return next;
          });
        });

        socketService.on('online_users', (payload) => {
          if (!mounted) return;
          setOnlineUsers(new Set(payload.users));
        });

        socketService.on('error', (payload) => {
          if (!mounted) return;
          if (payload.status === 401 || (payload.message && payload.message.toLowerCase().includes('password'))) {
            setShowPasswordPrompt(true)
          } else {
            setError(payload.message)
          }
          setIsLoading(false)
          setIsHistoryLoading(false)
        })

        // Fetch user profile for sidebar
        const profileData = await apiService.getProfile()
        if (mounted) setCurrentUser(profileData.user)

        // Initial join attempt
        socketService.joinRoom(roomId)
        setIsLoading(false) // Ready to chat even if history is in flight

      } catch (err) {
        if (mounted) {
          setError(err.message)
          setIsLoading(false)
          setIsHistoryLoading(false)
        }
      }
    }

    init()

    return () => {
      mounted = false;
      socketService.disconnect()
    }
  }, [roomId, navigate])

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (inputValue.trim() === '') return

    socketService.sendMessage(inputValue)
    setInputValue('')
  }

  const handleJoinWithPassword = (e) => {
    e.preventDefault()
    setError(null)
    socketService.joinRoom(roomId, passwordInput)
  }

  if (isLoading && !showPasswordPrompt) {
    return (
      <div className="min-h-screen bg-[#060e20] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#a3a6ff] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#a3aac4] text-sm font-medium uppercase tracking-widest">{language === 'hi' ? 'बोलचाल से जुड़ रहे हैं...' : 'Connecting to BolChal...'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#060e20] text-[#dee5ff] font-['Inter'] min-h-screen flex">
      {/* Password Modal */}
      {showPasswordPrompt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#000000]/90 backdrop-blur-md px-6">
          <div className="w-full max-w-sm bg-[#141f38] rounded-3xl p-8 border border-[#40485d]/20 shadow-2xl">
            <div className="w-16 h-16 bg-[#192540] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-[#a3a6ff] text-3xl">lock</span>
            </div>
            <h3 className="text-xl font-bold text-center mb-2">{language === 'hi' ? 'निजी रूम' : 'Private Room'}</h3>
            <p className="text-[#a3aac4] text-sm text-center mb-8">{language === 'hi' ? 'इस स्थान में प्रवेश करने के लिए एक्सेस कोड की आवश्यकता है।' : 'This space requires an access code to enter.'}</p>
            
            <form onSubmit={handleJoinWithPassword} className="space-y-4">
              <input 
                type="password"
                className="w-full bg-[#060e20] border border-[#40485d]/20 rounded-xl py-4 px-6 text-center text-[#dee5ff] focus:ring-2 focus:ring-[#a3a6ff]/40 outline-none transition-all font-mono tracking-widest"
                placeholder={language === 'hi' ? 'कोड दर्ज करें' : 'ENTER CODE'}
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                autoFocus
              />
              {error && <p className="text-red-400 text-xs text-center">{error}</p>}
              <button 
                type="submit"
                className="w-full bg-gradient-to-tr from-[#a3a6ff] to-[#6063ee] text-[#0f00a4] font-bold py-4 rounded-xl active:scale-95 transition-transform"
              >
                {language === 'hi' ? 'प्रवेश करें' : 'ACCESS ROOM'}
              </button>
              <button 
                type="button"
                onClick={() => navigate('/dashboard')}
                className="w-full text-[#a3aac4] text-xs font-bold uppercase tracking-widest pt-2"
              >
                {t.backHome || (language === 'hi' ? 'डैशबोर्ड पर वापस जाएं' : 'Back to Dashboard')}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full z-40 flex-col py-8 bg-[#091328] w-72 rounded-r-none shadow-[12px_0_32px_rgba(25,37,64,0.08)]">
        <div className="px-6 mb-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#a3a6ff] flex items-center justify-center text-[#0f00a4] font-black text-sm uppercase">
            {currentUser?.username?.substring(0, 2) || '...'}
          </div>
          <div>
            <p className="font-['Plus_Jakarta_Sans'] font-bold text-[#dee5ff] text-sm">{currentUser?.username || 'Loading...'}</p>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <p className="text-[#a3aac4] text-xs">{t.chatroom.online}</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 space-y-2 px-4">
          <button onClick={() => navigate('/dashboard')} className="w-full flex items-center gap-3 px-4 py-3 text-[#a3aac4] hover:text-white transition-all hover:bg-[#141f38] font-['Plus_Jakarta_Sans'] font-medium text-sm">
            <span className="material-symbols-outlined">explore</span>
            <span>{t.explore.allRooms}</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col md:ml-72 relative min-h-screen bg-[#000000] overflow-hidden">
        {/* Cinematic overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-50" style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.05) 0%, transparent 80%)'
        }}></div>

        {/* Top App Bar */}
        <header className="sticky top-0 z-30 flex justify-between items-center w-full px-4 md:px-6 h-20 bg-[#091328]/80 backdrop-blur-xl border-b border-[#40485d]/10 shadow-none">
          <div className="flex items-center gap-3 md:gap-4">
            <button onClick={() => navigate('/dashboard')} className="md:hidden w-10 h-10 rounded-xl bg-[#192540] flex items-center justify-center border border-[#40485d]/20">
               <span className="material-symbols-outlined text-[#a3a6ff]">arrow_back</span>
            </button>
            <div className="w-10 h-10 rounded-xl bg-[#141f38] overflow-hidden hidden sm:flex items-center justify-center">
              <span className="material-symbols-outlined text-[#a3a6ff]">
                {roomInfo?.type === 'private' ? 'lock' : 'forum'}
              </span>
            </div>
            <div className="overflow-hidden">
              <h1 className="text-[#6366F1] font-['Plus_Jakarta_Sans'] font-bold text-base md:text-lg tracking-tight truncate max-w-[150px] sm:max-w-none">
                {roomInfo?.name || 'Loading...'}
              </h1>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <p className="text-[#a3aac4] text-[10px] font-medium uppercase tracking-wider">{language === 'hi' ? 'लाइव' : 'Live'}</p>
                {roomInfo?.type === 'private' && roomInfo?.passkey && (
                    <div className="hidden xs:flex items-center gap-1 bg-[#141f38] px-2 py-0.5 rounded border border-[#a3a6ff]/20">
                        <span className="material-symbols-outlined text-[10px] text-[#a3a6ff]">key</span>
                        <span className="text-[10px] text-[#a3a6ff] font-mono tracking-tighter uppercase">{roomInfo.passkey}</span>
                    </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
             <button 
               onClick={() => setIsMembersOpen(!isMembersOpen)}
               className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all text-xs font-semibold ${isMembersOpen ? 'bg-[#a3a6ff] text-[#0f00a4]' : 'bg-[#141f38] text-[#a3aac4] hover:text-white'}`}
             >
               <span className="material-symbols-outlined text-sm">groups</span>
               <span>{roomMembers.length}</span>
             </button>

             {roomInfo?.creator?._id === currentUserId && (
                <button 
                  onClick={() => handleDeleteRoom(roomId, navigate)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 transition-colors text-xs font-semibold"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                  <span className="hidden sm:inline">{t.chatroom.deleteRoom}</span>
                </button>
             )}
             {roomInfo?.creator?._id !== currentUserId && roomInfo?.type === 'private' && (
                <button 
                  onClick={handleLeaveRoom}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-500 hover:bg-orange-500/20 transition-colors text-xs font-semibold"
                >
                  <span className="material-symbols-outlined text-sm">exit_to_app</span>
                  <span className="hidden sm:inline">{t.chatroom.leaveRoom}</span>
                </button>
             )}
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8 relative z-10" style={{
          scrollbarWidth: '4px',
          scrollbarColor: '#192540 transparent'
        }}>
          {/* Skeleton Loader for History */}
          {isHistoryLoading && (
            <div className="space-y-8 opacity-50 pointer-events-none">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`flex items-end gap-3 ${i % 2 === 0 ? 'flex-row-reverse ml-auto w-[60%]' : 'w-[60%]'}`}>
                  <div className="w-8 h-8 rounded-full bg-[#141f38] animate-pulse"></div>
                  <div className="flex flex-col gap-1.5 w-full">
                    <div className="h-3 w-20 bg-[#141f38] rounded-full animate-pulse"></div>
                    <div className="h-12 w-full bg-[#141f38] rounded-lg animate-pulse"></div>
                  </div>
                </div>
              ))}
              <div className="text-center py-4 text-[#a3aac4] text-[10px] uppercase tracking-widest animate-pulse">
                {t.chatroom.fetchingHistory}
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.length === 0 && !isLoading && !isHistoryLoading && (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                <span className="material-symbols-outlined text-6xl mb-4">chat_bubble_outline</span>
                <p className="text-sm">{t.chatroom.noMessages}</p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-end gap-3 group ${message.sent ? 'flex-row-reverse ml-auto max-w-[80%]' : 'max-w-[80%]'}`}
            >
              {!message.sent && (
                <div className="w-8 h-8 rounded-full bg-[#141f38] flex-shrink-0 flex items-center justify-center border border-[#40485d]/20 text-[10px] font-bold text-[#a3a6ff]">
                  {message.author.substring(0, 2).toUpperCase()}
                </div>
              )}
              <div className={`flex flex-col ${message.sent ? 'items-end' : 'items-start'} gap-1.5`}>
                <div className={`flex items-baseline gap-2 ${message.sent ? 'flex-row-reverse' : ''}`}>
                  <span className="text-[#dee5ff] font-semibold text-xs">{message.author}</span>
                  <span className="text-[#a3aac4] text-[10px]">{message.time}</span>
                </div>
                <div
                  className={`px-5 py-3 rounded-lg text-sm leading-relaxed shadow-sm ${
                    message.sent
                      ? 'bg-gradient-to-tr from-[#a3a6ff] to-[#6063ee] text-[#0f00a4] font-medium shadow-lg shadow-indigo-500/10'
                      : 'bg-[#141f38] text-[#dee5ff]'
                  }`}
                  style={{
                    borderBottomLeftRadius: !message.sent ? '2px' : '12px',
                    borderBottomRightRadius: message.sent ? '2px' : '12px'
                  }}
                >
                   <div className="flex items-start gap-3">
                    <span className={message.isDeleted ? 'italic opacity-60' : ''}>{message.text}</span>
                    {message.sent && !message.isDeleted && (
                        <button 
                            onClick={() => handleDeleteMessage(message.id)}
                            className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-black/10 rounded transition-all"
                            title={t.chatroom.deleteMessage}
                        >
                            <span className="material-symbols-outlined text-[16px] leading-none">delete</span>
                        </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6 bg-[#000000]/80 backdrop-blur-md relative z-20 border-t border-[#40485d]/10">
          <div className="max-w-5xl mx-auto flex items-center gap-3 md:gap-4">
            <form onSubmit={handleSendMessage} className="flex-1 flex items-center gap-3 md:gap-4">
              <div className="flex-1 relative">
                <input
                  className="w-full bg-[#192540] text-[#dee5ff] border border-[#40485d]/20 focus:ring-1 focus:ring-[#a3a6ff]/40 rounded-full py-3.5 md:py-4 px-6 text-sm placeholder:text-[#a3aac4] transition-all outline-none"
                  placeholder={t.chatroom.inputPlaceholder}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="bg-gradient-to-tr from-[#a3a6ff] to-[#6063ee] text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/20 active:scale-90 transition-transform flex-shrink-0 disabled:opacity-50"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  send
                </span>
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Right Sidebar: Member List */}
      <aside className={`${isMembersOpen ? 'flex' : 'hidden'} lg:flex fixed lg:relative right-0 top-0 h-full z-40 flex-col py-8 bg-[#091328] w-72 border-l border-[#40485d]/10 shadow-[-12px_0_32px_rgba(0,0,0,0.2)]`}>
        <div className="px-6 mb-6 flex items-center justify-between">
          <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-[#dee5ff] text-sm tracking-tight uppercase">{language === 'hi' ? 'सदस्य' : 'Members'} — {roomMembers.length}</h3>
          <button onClick={() => setIsMembersOpen(false)} className="lg:hidden text-[#a3aac4] hover:text-white">
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 space-y-1">
          {roomMembers.map(member => (
            <div 
              key={member.userId}
              className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#141f38] transition-colors group cursor-default"
            >
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-[#192540] border border-[#40485d]/20 flex items-center justify-center text-[10px] font-bold text-[#a3a6ff]">
                  {member.username.substring(0, 2).toUpperCase()}
                </div>
                {onlineUsers.has(member.userId) && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#091328] rounded-full animate-pulse"></span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${onlineUsers.has(member.userId) ? 'text-[#dee5ff]' : 'text-[#a3aac4]'}`}>
                  {member.username}
                </p>
                {member.isAdmin && (
                  <p className="text-[9px] font-black uppercase tracking-widest text-[#a3a6ff]/60">Admin</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  )
}

export default ChatRoomPage
