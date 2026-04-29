import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiService } from '../services/api.service'
import { useLanguage } from '../hooks/useLanguage'
import { dashboardTranslations } from '../locales/dashboard'

function DashboardPage() {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [rooms, setRooms] = useState([])
  const [featuredRooms, setFeaturedRooms] = useState([])
  const [activeView, setActiveView] = useState('explore')
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [openSettingsId, setOpenSettingsId] = useState(null)
  
  // Profile edit states
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [editForm, setEditForm] = useState({ username: '', gender: '', location: '', about: '' })
  const [isSavingProfile, setIsSavingProfile] = useState(false)

  const { language, setLanguage } = useLanguage()
  const t = dashboardTranslations[language] || dashboardTranslations['en']

  useEffect(() => {
    async function loadData() {
      try {
        const [roomsData, profileData] = await Promise.all([
          apiService.getRooms(),
          apiService.getProfile()
        ])
        const allRooms = roomsData.rooms || []
        setRooms(allRooms)
        
        // Pick 3 random rooms for highlights
        const shuffled = [...allRooms].sort(() => 0.5 - Math.random())
        setFeaturedRooms(shuffled.slice(0, 3))
        
        setCurrentUser(profileData.user || null)
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    navigate('/login')
  }

  const handleDeleteAccount = async () => {
    const isConfirmed = window.confirm(t.profile.deleteConfirm)
    
    if (!isConfirmed) return

    try {
      await apiService.deleteAccount()
      alert(t.profile.deleteSuccess)
      localStorage.removeItem('accessToken')
      navigate('/')
    } catch (err) {
      alert(err.message || t.profile.deleteError)
    }
  }

  const startEditingProfile = () => {
    setEditForm({
        username: currentUser?.username || '',
        gender: currentUser?.gender || 'other',
        location: currentUser?.location || '',
        about: currentUser?.about || ''
    })
    setIsEditingProfile(true)
  }

  const handleSaveProfile = async () => {
    try {
        setIsSavingProfile(true)
        const updatedProfile = await apiService.updateProfile(editForm)
        setCurrentUser(updatedProfile.user)
        setIsEditingProfile(false)
        alert(t.profile.updateSuccess)
    } catch (err) {
        alert(err.message || t.profile.updateError)
    } finally {
        setIsSavingProfile(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#060e20] text-[#dee5ff]">
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <aside 
            className="h-full w-72 bg-[#091328] p-8 shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="BolChal Logo" className="w-10 h-10 rounded-xl" />
                <span className="font-black italic text-[#a3a6ff] text-2xl">BolChal.</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="text-[#a3aac4]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <nav className="flex-1 space-y-2">
              <button 
                onClick={() => { setActiveView('explore'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg duration-300 ${activeView === 'explore' ? 'bg-[#49339d] text-white' : 'text-[#a3aac4]'}`}
              >
                <span className="material-symbols-outlined">explore</span>
                <span>{t.sidebar.explore}</span>
              </button>
              <button 
                onClick={() => { setActiveView('rooms'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg duration-300 ${activeView === 'rooms' ? 'bg-[#49339d] text-white' : 'text-[#a3aac4]'}`}
              >
                <span className="material-symbols-outlined">meeting_room</span>
                <span>Rooms</span>
              </button>
              <button 
                onClick={() => { setActiveView('my-rooms'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg duration-300 ${activeView === 'my-rooms' ? 'bg-[#49339d] text-white' : 'text-[#a3aac4]'}`}
              >
                <span className="material-symbols-outlined">person_pin</span>
                <span>My Rooms</span>
              </button>
              <button onClick={() => navigate('/dms')} className="w-full flex items-center gap-3 px-4 py-3 text-[#a3aac4]">
                <span className="material-symbols-outlined">chat_bubble</span>
                <span>{t.sidebar.directMessages}</span>
              </button>
              <button 
                onClick={() => { setActiveView('settings'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg duration-300 ${activeView === 'settings' ? 'bg-[#49339d] text-white' : 'text-[#a3aac4]'}`}
              >
                <span className="material-symbols-outlined">settings</span>
                <span>Settings</span>
              </button>
            </nav>

            <button 
              onClick={handleLogout} 
              className="mt-auto flex items-center gap-3 px-4 py-3 text-[#ff7b7b]"
            >
              <span className="material-symbols-outlined">logout</span>
              <span>{t.sidebar.logout}</span>
            </button>
          </aside>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full z-40 flex-col py-8 bg-[#091328] w-72 rounded-r-none shadow-[12px_0_32px_rgba(25,37,64,0.08)]">
        <div className="px-6 mb-10 flex items-center gap-3 group cursor-pointer">
          <img src="/logo.png" alt="BolChal Logo" className="w-10 h-10 rounded-xl object-cover shadow-lg shadow-[#a3a6ff]/20 group-hover:rotate-[360deg] group-hover:scale-110 transition-all duration-700 ease-in-out" />
          <span className="font-black italic text-[#a3a6ff] tracking-tighter text-2xl [font-family:_'Plus_Jakarta_Sans',sans-serif] group-hover:text-white transition-colors duration-300">
            BolChal.
          </span>
        </div>
        <div className="px-6 mb-8 flex items-center gap-3 border-t border-[#40485d]/20 pt-6">
          <div className="w-10 h-10 rounded-full bg-[#192540] flex items-center justify-center border border-[#40485d]/20 text-[#a3a6ff] font-bold">
            {currentUser?.username?.substring(0, 2).toUpperCase() || '??'}
          </div>
          <div>
            <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-[#dee5ff] text-sm">{currentUser?.username || 'Loading...'}</h3>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              <span className="text-[10px] text-[#a3aac4] uppercase tracking-widest font-semibold">Online</span>
            </div>
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-4">
          <button 
            onClick={() => setActiveView('explore')}
            className={`w-[calc(100%-1rem)] flex items-center gap-3 px-4 py-3 rounded-lg mx-2 duration-300 ease-in-out font-['Plus_Jakarta_Sans'] font-medium text-sm ${activeView === 'explore' ? 'bg-[#49339d] text-white' : 'text-[#a3aac4] hover:text-white hover:bg-[#141f38]'}`}
          >
            <span className="material-symbols-outlined">explore</span>
            <span>{t.sidebar.explore}</span>
          </button>
          <button 
            onClick={() => setActiveView('rooms')}
            className={`w-[calc(100%-1rem)] flex items-center gap-3 px-4 py-3 rounded-lg mx-2 duration-300 ease-in-out font-['Plus_Jakarta_Sans'] font-medium text-sm ${activeView === 'rooms' ? 'bg-[#49339d] text-white' : 'text-[#a3aac4] hover:text-white hover:bg-[#141f38]'}`}
          >
            <span className="material-symbols-outlined">meeting_room</span>
            <span>{t.sidebar.rooms}</span>
          </button>
          <button 
            onClick={() => setActiveView('my-rooms')}
            className={`w-[calc(100%-1rem)] flex items-center gap-3 px-4 py-3 rounded-lg mx-2 duration-300 ease-in-out font-['Plus_Jakarta_Sans'] font-medium text-sm ${activeView === 'my-rooms' ? 'bg-[#49339d] text-white' : 'text-[#a3aac4] hover:text-white hover:bg-[#141f38]'}`}
          >
            <span className="material-symbols-outlined">person_pin</span>
            <span>{t.sidebar.myRooms}</span>
          </button>
          <button onClick={() => navigate('/dms')} className="w-[calc(100%-1rem)] flex items-center gap-3 px-4 py-3 rounded-lg mx-2 duration-300 ease-in-out font-['Plus_Jakarta_Sans'] font-medium text-sm text-[#a3aac4] hover:text-white hover:bg-[#141f38]">
            <span className="material-symbols-outlined">chat_bubble</span>
            <span>{t.sidebar.directMessages}</span>
          </button>
          <button 
            onClick={() => setActiveView('settings')}
            className={`w-[calc(100%-1rem)] flex items-center gap-3 px-4 py-3 rounded-lg mx-2 duration-300 ease-in-out font-['Plus_Jakarta_Sans'] font-medium text-sm ${activeView === 'settings' ? 'bg-[#49339d] text-white' : 'text-[#a3aac4] hover:text-white hover:bg-[#141f38]'}`}
          >
            <span className="material-symbols-outlined">settings</span>
            <span>{t.sidebar.settings}</span>
          </button>
        </nav>
        <div className="mt-auto px-4 pb-4">
          <button 
            onClick={handleLogout} 
            className="w-[calc(100%-1rem)] flex items-center gap-3 px-4 py-3 text-[#ff7b7b] hover:bg-red-500/10 rounded-lg mx-2 duration-300 ease-in-out font-['Plus_Jakarta_Sans'] font-medium text-sm group"
          >
            <span className="material-symbols-outlined text-[#ff7b7b] group-hover:rotate-180 transition-transform duration-500">logout</span>
            <span>{t.sidebar.logout}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:ml-72 min-h-screen pb-32">
        {/* TopAppBar */}
        <header className="sticky top-0 z-30 flex justify-between items-center w-full px-6 h-20 bg-[#060e20]/80 backdrop-blur-xl border-b border-[#40485d]/10">
          <div className="flex items-center gap-4">
            <button className="md:hidden w-10 h-10 rounded-xl bg-[#192540] flex items-center justify-center border border-[#40485d]/20" onClick={() => setMobileMenuOpen(true)}>
              <span className="material-symbols-outlined text-[#a3a6ff]">menu</span>
            </button>
            <div>
              <h1 className="font-['Plus_Jakarta_Sans'] font-bold text-xl tracking-tight text-[#dee5ff]">
                {activeView === 'explore' ? t.sidebar.explore : activeView === 'rooms' ? t.sidebar.rooms : activeView === 'my-rooms' ? t.sidebar.myRooms : t.sidebar.settings}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
             {/* Language Selector */}
             <div className="relative group">
               <button className="flex items-center gap-1 text-[11px] uppercase font-bold tracking-[0.2em] text-[#a3aac4] hover:text-[#dee5ff] transition-colors px-3 py-2 border border-[#40485d]/20 hover:border-[#a3a6ff]/20 rounded-full bg-[#141f38]/40 backdrop-blur-sm">
                 <span className="material-symbols-outlined text-[16px]">language</span>
                 {language === 'en' ? 'EN' : 'HI'}
                 <span className="material-symbols-outlined text-[14px]">arrow_drop_down</span>
               </button>
               <div className="absolute top-full right-0 mt-2 w-32 bg-[#091328] border border-[#40485d]/40 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden z-50">
                 <button 
                   className={`w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#141f38] transition-colors ${language === 'en' ? 'text-[#a3a6ff] bg-[#141f38]/50' : 'text-[#a3aac4]'}`}
                   onClick={() => setLanguage('en')}
                 >
                   English
                 </button>
                 <button 
                   className={`w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#141f38] transition-colors ${language === 'hi' ? 'text-[#a3a6ff] bg-[#141f38]/50' : 'text-[#a3aac4]'}`}
                   onClick={() => setLanguage('hi')}
                 >
                   हिंदी
                 </button>
               </div>
             </div>

             <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-[#141f38] rounded-full border border-[#40485d]/20">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#a3aac4]">Online</span>
             </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="px-6 py-8 max-w-7xl mx-auto">
          {error && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">
              Error loading rooms: {error}
            </div>
          )}

          {/* Hero Bento Header */}
          {activeView === 'explore' ? (
            <>
              <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                <div className="lg:col-span-2 relative overflow-hidden rounded-lg bg-gradient-to-br from-[#49339d] to-[#0f1930] h-64 flex flex-col justify-end p-8">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#a3a6ff]/20 blur-[100px] -mr-32 -mt-32"></div>
                  <div className="relative z-10">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#a3a6ff] mb-2 block">{t.explore.welcomeBack || 'Welcome Back'}</span>
                    <h2 className="text-4xl font-['Plus_Jakarta_Sans'] font-extrabold text-white mb-4 leading-tight">
                      {language === 'hi' ? `नमस्ते ${currentUser?.username || 'दोस्त'},` : `Hey ${currentUser?.username || 'there'},`} <br />
                      {language === 'hi' ? 'बातचीत के लिए तैयार हैं?' : 'Ready to chat?'}
                    </h2>
                    <div className="flex items-center gap-4">
                      <button onClick={() => setActiveView('rooms')} className="bg-gradient-to-tr from-[#a3a6ff] to-[#6063ee] text-[#0f00a4] px-6 py-2.5 rounded-full font-['Inter'] font-bold text-sm uppercase tracking-wider shadow-lg shadow-[#a3a6ff]/20 active:scale-95 transition-transform">
                        {t.explore.joinRoom}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="bg-[#0f1930] rounded-lg p-8 flex flex-col justify-center border border-[#40485d]/5">
                  <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-xl text-[#dee5ff] mb-2">{t.chatroom.online}</h3>
                  <p className="text-[#a3aac4] text-sm mb-6 leading-relaxed">
                    {language === 'hi' ? `अभी शामिल होने के लिए ${rooms.length} सक्रिय रूम उपलब्ध हैं।` : `There are currently ${rooms.length} active rooms available to join right now.`}
                  </p>
                  <button onClick={() => setActiveView('rooms')} className="w-full flex items-center justify-center gap-2 bg-[#1f2b49] text-[#dee5ff] px-6 py-4 rounded-xl font-['Inter'] font-bold text-xs uppercase tracking-widest border border-[#40485d]/20 hover:bg-[#192540] transition-colors group">
                    {t.explore.allRooms}
                  </button>
                </div>
              </section>

              {/* Featured Highlight Section */}
              <section className="mb-12">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-2xl text-[#dee5ff]">{t.explore.trending}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {featuredRooms.map((room) => (
                    <div key={room._id} className="relative group overflow-hidden bg-gradient-to-b from-[#091328] to-[#060e20] p-6 rounded-2xl border border-[#40485d]/10 hover:border-[#a3a6ff]/30 transition-all duration-300">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-[#192540] flex items-center justify-center text-[#a3a6ff]">
                          <span className="material-symbols-outlined">{room.type === 'private' ? 'lock' : 'rocket_launch'}</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-[#dee5ff] group-hover:text-[#a3a6ff] transition-colors line-clamp-1">{room.name}</h4>
                          <span className="text-[10px] text-[#a3aac4] uppercase tracking-tighter">{room.type} room</span>
                        </div>
                      </div>
                      <p className="text-sm text-[#a3aac4] mb-6 line-clamp-2 min-h-[40px]">
                        {room.description || `Welcome to ${room.name}! A great place to connect and share moments.`}
                      </p>
                      <Link to={`/chat/${room._id}`} className="w-full flex items-center justify-center py-3 bg-[#192540] hover:bg-[#a3a6ff] hover:text-[#0a0081] text-[#dee5ff] rounded-xl text-xs font-bold uppercase tracking-widest transition-all">
                        {t.explore.joinRoom}
                      </Link>
                    </div>
                  ))}
                  {rooms.length === 0 && (
                    <div className="md:col-span-3 py-12 text-center bg-[#091328]/30 rounded-2xl border border-dashed border-[#40485d]/20">
                      <p className="text-[#a3aac4] text-sm italic">No rooms populated yet. Create the first highlight!</p>
                    </div>
                  )}
                </div>
              </section>
            </>
          ) : activeView === 'rooms' ? (
            <>
              {/* ... existing rooms view ... */}
              <section className="mb-12">
                <div className="bg-[#0f1930] rounded-lg p-8 flex flex-col md:flex-row items-center justify-between border border-[#40485d]/5 gap-6">
                  <div>
                    <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-xl text-[#dee5ff] mb-2">{t.createRoom.title}</h3>
                    <p className="text-[#a3aac4] text-sm leading-relaxed">{t.createRoom.subtitle}</p>
                  </div>
                  <Link to="/create-room" className="whitespace-nowrap flex items-center justify-center gap-2 bg-gradient-to-tr from-[#a3a6ff] to-[#6063ee] text-[#0f00a4] px-8 py-4 rounded-xl font-['Inter'] font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-all group">
                    <span className="material-symbols-outlined text-[20px] group-hover:rotate-90 transition-transform">add</span>
                    {t.createRoom.button}
                  </Link>
                </div>
              </section>

              {/* Room List Grid */}
              <section>
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-2xl text-[#dee5ff]">Available Rooms</h3>
                  {isLoading && <span className="text-xs text-[#a3aac4] animate-pulse">Loading rooms...</span>}
                </div>
                
                {!isLoading && rooms.length === 0 && (
                  <div className="text-center py-20 bg-[#091328] rounded-2xl border border-dashed border-[#40485d]/20">
                    <p className="text-[#a3aac4] mb-4">No rooms found. Be the first to create one!</p>
                    <Link to="/create-room" className="text-[#a3a6ff] font-bold uppercase tracking-widest text-xs hover:underline">Create Room Now</Link>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 text-left">
                  {rooms.map((room) => (
                    <div key={room._id} className="group bg-[#091328] hover:bg-[#0f1930] transition-all duration-500 rounded-lg p-6 border border-[#40485d]/5">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-14 h-14 rounded-lg bg-[#192540] flex items-center justify-center">
                          <span className="material-symbols-outlined text-[#a3a6ff] text-3xl">
                            {room.type === 'private' ? 'lock' : 'public'}
                          </span>
                        </div>
                        <span className="text-[10px] font-black text-[#a3aac4] bg-[#141f38] px-2 py-1 rounded">
                          {room.type.toUpperCase()}
                        </span>
                      </div>
                      <h4 className="font-['Plus_Jakarta_Sans'] font-bold text-lg text-[#dee5ff] mb-2 group-hover:text-[#a3a6ff] transition-colors">
                        {room.name}
                      </h4>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-[#a3aac4]">By {room.creator?.username || 'User'}</span>
                        <Link 
                          to={`/chat/${room._id}`}
                          className="text-[#a3a6ff] font-bold text-xs uppercase tracking-widest group-hover:underline"
                        >
                          Enter Room
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          ) : activeView === 'my-rooms' ? (
            <>
              {/* My Rooms Section */}
              <section>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-2xl text-[#dee5ff]">My Rooms</h3>
                    <p className="text-[#a3aac4] text-sm">{language === 'hi' ? 'आपके द्वारा बनाए गए और प्रबंधित रूम्स' : 'Rooms created and managed by you'}</p>
                  </div>
                  <Link to="/create-room" className="bg-[#1f2b49] text-[#a3a6ff] px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest border border-[#40485d]/20 hover:bg-[#192540] transition-colors">
                    {t.sidebar.createRoom}
                  </Link>
                </div>
                
                {rooms.filter(r => r.creator?._id === currentUser?._id).length === 0 ? (
                  <div className="text-center py-20 bg-[#091328] rounded-2xl border border-dashed border-[#40485d]/20">
                    <div className="w-16 h-16 rounded-full bg-[#141f38] flex items-center justify-center mx-auto mb-4 text-[#a3aac4]">
                      <span className="material-symbols-outlined text-4xl">inventory_2</span>
                    </div>
                    <p className="text-[#a3aac4] mb-4">You haven't created any rooms yet.</p>
                    <Link to="/create-room" className="text-[#a3a6ff] font-bold uppercase tracking-widest text-xs hover:underline">Start Creating</Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 text-left">
                    {rooms.filter(r => r.creator?._id === currentUser?._id).map((room) => (
                      <div key={room._id} className="group bg-gradient-to-br from-[#141f38] to-[#091328] hover:from-[#192540] hover:to-[#0f1930] transition-all duration-500 rounded-lg p-6 border border-[#a3a6ff]/10">
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-14 h-14 rounded-lg bg-[#091328] flex items-center justify-center text-[#a3a6ff] border border-[#a3a6ff]/10">
                            <span className="material-symbols-outlined text-3xl">
                              {room.type === 'private' ? 'lock' : 'shield_person'}
                            </span>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className="text-[9px] font-black text-[#a3a6ff] bg-[#a3a6ff]/10 px-2 py-1 rounded-full uppercase">
                              Admin
                            </span>
                          </div>
                        </div>
                        <h4 className="font-['Plus_Jakarta_Sans'] font-bold text-lg text-[#dee5ff] mb-2 group-hover:text-[#a3a6ff] transition-colors">
                          {room.name}
                        </h4>
                        <p className="text-xs text-[#a3aac4] mb-6 line-clamp-2">
                          {room.description || "You haven't set a description for this room yet."}
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t border-[#40485d]/10">
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] text-[#a3aac4] flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">public</span>
                              {room.type.toUpperCase()}
                            </span>
                            {room.type === 'private' && room.passkey && (
                              <div className="flex items-center gap-1 bg-[#141f38] px-2 py-0.5 rounded border border-[#a3a6ff]/20">
                                <span className="material-symbols-outlined text-[10px] text-[#a3a6ff]">key</span>
                                <span className="text-[10px] text-[#a3a6ff] font-mono">{room.passkey}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2 relative">
                            {room.type === 'private' && (
                              <div className="relative">
                                <button 
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setOpenSettingsId(openSettingsId === room._id ? null : room._id);
                                  }}
                                  className="p-2 hover:bg-white/10 rounded-lg text-[#a3aac4] hover:text-[#a3a6ff] transition-colors"
                                >
                                  <span className="material-symbols-outlined text-sm">settings</span>
                                </button>
                                
                                {openSettingsId === room._id && (
                                  <div className="absolute bottom-full right-0 mb-2 w-40 bg-[#091328] border border-[#40485d]/40 rounded-xl shadow-2xl z-50 py-1 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
                                    <button 
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setOpenSettingsId(null);
                                        const newCode = window.prompt(language === 'hi' ? 'नया रूम कोड दर्ज करें:' : 'Enter new room code:', room.passkey);
                                        if (newCode && newCode !== room.passkey) {
                                          apiService.updateRoomCode(room._id, newCode).then(() => {
                                            setRooms(prev => prev.map(r => r._id === room._id ? { ...r, passkey: newCode } : r));
                                            alert(language === 'hi' ? 'कोड अपडेट किया गया!' : 'Code updated!');
                                          }).catch(err => alert(err.message));
                                        }
                                      }}
                                      className="w-full flex items-center gap-2 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-[#a3aac4] hover:text-white hover:bg-[#141f38] transition-colors"
                                    >
                                      <span className="material-symbols-outlined text-sm">edit</span>
                                      {language === 'hi' ? 'कोड बदलें' : 'Edit Code'}
                                    </button>
                                    <button 
                                      onClick={async (e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setOpenSettingsId(null);
                                        if (window.confirm(language === 'hi' ? 'क्या आप इस रूम को हटाना चाहते हैं?' : 'Are you sure you want to delete this room?')) {
                                          try {
                                            await apiService.deleteRoom(room._id);
                                            setRooms(prev => prev.filter(r => r._id !== room._id));
                                            alert(language === 'hi' ? 'रूम सफलतापूर्वक हटा दिया गया!' : 'Room deleted successfully!');
                                          } catch (err) {
                                            alert(err.message);
                                          }
                                        }
                                      }}
                                      className="w-full flex items-center gap-2 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-500/10 transition-colors"
                                    >
                                      <span className="material-symbols-outlined text-sm">delete</span>
                                      {language === 'hi' ? 'हटाएं' : 'Delete'}
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                            
                            <Link 
                              to={`/chat/${room._id}`}
                              className="bg-[#a3a6ff] text-[#0f00a4] px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest hover:scale-105 transition-transform"
                            >
                              {language === 'hi' ? 'प्रबंधित करें' : 'Manage'}
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          ) : (
            <>
              {/* Profile Settings View */}
              <section className="max-w-4xl mx-auto">
                <div className="mb-10">
                  <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-3xl text-[#dee5ff] mb-2">{t.sidebar.myProfile}</h3>
                  <p className="text-[#a3aac4]">{language === 'hi' ? 'बोलचाल प्लेटफॉर्म में अपनी डिजिटल पहचान प्रबंधित करें।' : 'Manage your digital identity in the BolChal platform.'}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Profile Overview Card */}
                  <div className="md:col-span-1">
                    <div className="bg-[#091328] rounded-2xl p-8 border border-[#40485d]/10 text-center">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#a3a6ff] to-[#6063ee] mx-auto mb-6 flex items-center justify-center text-[#0f00a4] text-4xl font-black">
                        {currentUser?.username?.substring(0, 2).toUpperCase() || '??'}
                      </div>
                      <h4 className="text-xl font-bold text-[#dee5ff] mb-1">{currentUser?.username}</h4>
                      <p className="text-xs text-[#a3aac4] uppercase tracking-widest mb-6">Verified User</p>
                      <div className="flex items-center justify-center gap-2 py-2 px-4 bg-[#141f38] rounded-full text-[10px] font-bold text-[#a3a6ff] border border-[#a3a6ff]/20">
                        <span className="material-symbols-outlined text-sm">verified</span>
                        Status: Active
                      </div>
                    </div>
                  </div>

                  {/* Details Form Area */}
                  <div className="md:col-span-2 space-y-6">
                    <div className="bg-[#091328] rounded-2xl p-8 border border-[#40485d]/10 relative">
                      <div className="flex items-center justify-between mb-6">
                          <h5 className="text-sm font-bold uppercase tracking-widest text-[#a3a6ff] flex items-center gap-2">
                            <span className="material-symbols-outlined text-[20px]">badge</span>
                            Account Details
                          </h5>
                          {!isEditingProfile ? (
                              <button onClick={startEditingProfile} className="text-xs font-bold uppercase tracking-widest bg-[#141f38] text-[#a3aac4] hover:text-[#dee5ff] hover:bg-[#192540] py-2 px-4 rounded-lg transition-colors border border-[#40485d]/20">
                                {t.profile.editProfile}
                              </button>
                          ) : (
                              <div className="flex gap-2">
                                  <button onClick={() => setIsEditingProfile(false)} className="text-[10px] font-bold uppercase tracking-widest bg-[#141f38] text-[#a3aac4] hover:text-white py-2 px-3 rounded-lg transition-colors" disabled={isSavingProfile}>
                                    {t.profile.cancel}
                                  </button>
                                  <button onClick={handleSaveProfile} className="text-[10px] font-bold uppercase tracking-widest bg-gradient-to-tr from-[#a3a6ff] to-[#6063ee] text-[#0f00a4] hover:opacity-90 py-2 px-4 rounded-lg transition-all" disabled={isSavingProfile}>
                                    {isSavingProfile ? (language === 'hi' ? 'सहेज रहे हैं...' : 'Saving...') : t.profile.saveChanges.split(' ')[0]}
                                  </button>
                              </div>
                          )}
                      </div>
                      
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase font-bold text-[#6d758c] ml-1">{t.profile.username}</label>
                          {isEditingProfile ? (
                              <input 
                                  className="w-full bg-[#141f38] px-5 py-4 rounded-xl border border-[#40485d]/30 text-[#dee5ff] font-medium outline-none focus:border-[#a3a6ff]/50" 
                                  value={editForm.username}
                                  onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                              />
                          ) : (
                              <div className="w-full bg-[#141f38] px-5 py-4 rounded-xl border border-[#40485d]/20 text-[#dee5ff] font-medium">
                                {currentUser?.username}
                              </div>
                          )}
                        </div>

                        <div className="space-y-2 relative">
                          <label className="text-[10px] uppercase font-bold text-[#6d758c] ml-1">{t.profile.email}</label>
                          <div className="w-full bg-[#141f38] px-5 py-4 rounded-xl border border-[#40485d]/20 text-[#dee5ff] font-medium opacity-70 cursor-not-allowed">
                            {currentUser?.email}
                          </div>
                          {isEditingProfile && <span className="absolute right-4 top-10 text-[10px] text-[#ff7b7b] bg-[#ff7b7b]/10 px-2 py-1 rounded font-bold uppercase">Locked</span>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold text-[#6d758c] ml-1">Identity Status</label>
                            <div className="w-full bg-[#141f38] px-5 py-4 rounded-xl border border-[#40485d]/20 text-[#dee5ff] font-medium flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${currentUser?.verified ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                              {currentUser?.verified ? 'Verified' : 'Unverified'}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold text-[#6d758c] ml-1">Member Since</label>
                            <div className="w-full bg-[#141f38] px-5 py-4 rounded-xl border border-[#40485d]/20 text-[#dee5ff] font-medium">
                              {currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'Loading...'}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold text-[#6d758c] ml-1">{t.profile.gender}</label>
                            {isEditingProfile ? (
                                <select 
                                    className="w-full bg-[#141f38] px-5 py-4 rounded-xl border border-[#40485d]/30 text-[#dee5ff] font-medium capitalize outline-none focus:border-[#a3a6ff]/50 appearance-none"
                                    value={editForm.gender}
                                    onChange={(e) => setEditForm({...editForm, gender: e.target.value})}
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            ) : (
                                <div className="w-full bg-[#141f38] px-5 py-4 rounded-xl border border-[#40485d]/20 text-[#dee5ff] font-medium capitalize">
                                  {currentUser?.gender || 'Not specified'}
                                </div>
                            )}
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] uppercase font-bold text-[#6d758c] ml-1">{t.profile.location}</label>
                            {isEditingProfile ? (
                                <input 
                                  className="w-full bg-[#141f38] px-5 py-4 rounded-xl border border-[#40485d]/30 text-[#dee5ff] font-medium outline-none focus:border-[#a3a6ff]/50" 
                                  value={editForm.location}
                                  placeholder="e.g. New York, USA"
                                  onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                                />
                            ) : (
                                <div className="w-full bg-[#141f38] px-5 py-4 rounded-xl border border-[#40485d]/20 text-[#dee5ff] font-medium">
                                  {currentUser?.location || 'Undisclosed'}
                                </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] uppercase font-bold text-[#6d758c] ml-1">{t.profile.bio}</label>
                          {isEditingProfile ? (
                              <textarea 
                                  className="w-full bg-[#141f38] px-5 py-4 rounded-xl border border-[#40485d]/30 text-[#dee5ff] font-medium min-h-[80px] outline-none focus:border-[#a3a6ff]/50 resize-y" 
                                  value={editForm.about}
                                  placeholder="Tell everyone a bit about yourself..."
                                  onChange={(e) => setEditForm({...editForm, about: e.target.value})}
                              />
                          ) : (
                              <div className="w-full bg-[#141f38] px-5 py-4 rounded-xl border border-[#40485d]/20 text-[#dee5ff] font-medium min-h-[80px]">
                                {currentUser?.about || 'No bio provided.'}
                              </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-6 flex gap-4">
                      <span className="material-symbols-outlined text-amber-500">info</span>
                      <p className="text-xs text-[#a3aac4] leading-relaxed">
                        To change your email address, please contact support. For security reasons, identity updates require manual verification.
                      </p>
                    </div>

                    <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-8 space-y-6">
                      <div className="flex items-center gap-3 text-red-500">
                        <span className="material-symbols-outlined">warning</span>
                        <h5 className="text-sm font-black uppercase tracking-widest">Danger Zone</h5>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                          <p className="text-[#dee5ff] font-bold text-sm mb-1">{t.profile.deleteAccount}</p>
                          <p className="text-[#a3aac4] text-xs">{language === 'hi' ? 'अपना खाता और डेटा स्थायी रूप से हटाएं। यह क्रिया अपरिवर्तनीय है।' : 'Permanently remove your account and data. This action is irreversible.'}</p>
                        </div>
                        <button 
                          onClick={handleDeleteAccount}
                          className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-red-500/20 whitespace-nowrap"
                        >
                          {t.profile.deleteAccount}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}
        </div>

        {/* Floating Action Button */}
        <div className="fixed bottom-32 right-8 z-40">
          <Link to="/create-room" className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#a3a6ff] to-[#6063ee] text-white flex items-center justify-center shadow-2xl shadow-[#a3a6ff]/40 active:scale-90 transition-transform duration-200">
            <span className="material-symbols-outlined text-3xl">add</span>
          </Link>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] z-50 flex justify-around items-center px-4 py-4 bg-[#091328]/90 backdrop-blur-xl shadow-2xl border border-[#40485d]/20 rounded-2xl">
        <button 
          onClick={() => setActiveView('explore')}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${activeView === 'explore' ? 'bg-[#a3a6ff] text-[#0f00a4]' : 'text-[#a3aac4]'}`}
        >
          <span className="material-symbols-outlined">explore</span>
        </button>
        <button 
          onClick={() => setActiveView('rooms')}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${activeView === 'rooms' ? 'bg-[#a3a6ff] text-[#0f00a4]' : 'text-[#a3aac4]'}`}
        >
          <span className="material-symbols-outlined">meeting_room</span>
        </button>
        <div className="relative -top-8">
           <Link to="/create-room" className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#a3a6ff] to-[#6063ee] text-white flex items-center justify-center shadow-xl shadow-indigo-500/40 active:scale-90 duration-200">
             <span className="material-symbols-outlined text-2xl">add</span>
           </Link>
        </div>
        <button 
          onClick={() => setActiveView('settings')}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${activeView === 'settings' ? 'bg-[#a3a6ff] text-[#0f00a4]' : 'text-[#a3aac4]'}`}
        >
          <span className="material-symbols-outlined">settings</span>
        </button>
        <button onClick={handleLogout} className="flex flex-col items-center justify-center text-[#ff7b7b] p-2 hover:bg-red-500/10 rounded-xl transition-all">
          <span className="material-symbols-outlined">logout</span>
        </button>
      </nav>
    </div>
  )
}

export default DashboardPage
