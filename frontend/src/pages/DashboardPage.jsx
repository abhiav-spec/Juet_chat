import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiService } from '../services/api.service'

function DashboardPage() {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [rooms, setRooms] = useState([])
  const [featuredRooms, setFeaturedRooms] = useState([])
  const [activeView, setActiveView] = useState('explore')
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

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

  return (
    <div className="min-h-screen bg-[#060e20] text-[#dee5ff]">
      {/* Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full z-40 flex-col py-8 bg-[#091328] w-72 rounded-r-none shadow-[12px_0_32px_rgba(25,37,64,0.08)]">
        <div className="px-6 mb-8 flex items-center gap-3">
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
            <span>Dashboard</span>
          </button>
          <button 
            onClick={() => setActiveView('rooms')}
            className={`w-[calc(100%-1rem)] flex items-center gap-3 px-4 py-3 rounded-lg mx-2 duration-300 ease-in-out font-['Plus_Jakarta_Sans'] font-medium text-sm ${activeView === 'rooms' ? 'bg-[#49339d] text-white' : 'text-[#a3aac4] hover:text-white hover:bg-[#141f38]'}`}
          >
            <span className="material-symbols-outlined">meeting_room</span>
            <span>Rooms</span>
          </button>
          <button 
            onClick={() => setActiveView('my-rooms')}
            className={`w-[calc(100%-1rem)] flex items-center gap-3 px-4 py-3 rounded-lg mx-2 duration-300 ease-in-out font-['Plus_Jakarta_Sans'] font-medium text-sm ${activeView === 'my-rooms' ? 'bg-[#49339d] text-white' : 'text-[#a3aac4] hover:text-white hover:bg-[#141f38]'}`}
          >
            <span className="material-symbols-outlined">person_pin</span>
            <span>My Rooms</span>
          </button>
          <a className="flex items-center gap-3 px-4 py-3 text-[#a3aac4] hover:text-white mx-2 duration-300 ease-in-out hover:bg-[#141f38] transition-all font-['Plus_Jakarta_Sans'] font-medium text-sm" href="#">
            <span className="material-symbols-outlined">chat_bubble</span>
            <span>Direct Messages</span>
          </a>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-[#a3aac4] hover:text-white mx-2 duration-300 ease-in-out hover:bg-[#141f38] transition-all font-['Plus_Jakarta_Sans'] font-medium text-sm">
            <span className="material-symbols-outlined">logout</span>
            <span>Logout</span>
          </button>
        </nav>
        <div className="px-6 mt-auto">
          <div className="bg-gradient-to-br from-[#192540]/40 to-[#091328]/40 rounded-2xl p-5 border border-[#40485d]/20 backdrop-blur-sm group hover:border-[#a3a6ff]/30 transition-all duration-500">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] text-[#a3a6ff] font-bold uppercase tracking-widest">User Profile</span>
              <span className="material-symbols-outlined text-[14px] text-[#a3aac4] group-hover:rotate-45 transition-transform">verified_user</span>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-[9px] text-[#6d758c] uppercase tracking-[0.1em] mb-0.5">Email Reference</p>
                <p className="text-[11px] text-[#dee5ff] font-semibold truncate leading-tight">{currentUser?.email || 'Loading...'}</p>
              </div>
              <div>
                <p className="text-[9px] text-[#6d758c] uppercase tracking-[0.1em] mb-0.5">Account Status</p>
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${currentUser?.verified ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                  <p className="text-[10px] text-[#dee5ff] font-medium uppercase tracking-tighter">
                    {currentUser?.verified ? 'Verified Citizen' : 'Pending Verification'}
                  </p>
                </div>
              </div>
              <div className="pt-2 border-t border-[#40485d]/10">
                <p className="text-[9px] text-[#6d758c] uppercase tracking-[0.1em] mb-0.5">Member Since</p>
                <p className="text-[10px] text-[#a3aac4] font-medium italic">
                  {currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '...'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:ml-72 min-h-screen pb-32">
        {/* TopAppBar */}
        <header className="sticky top-0 z-30 flex justify-between items-center w-full px-6 h-16 bg-[#091328] border-none">
          <div className="flex items-center gap-3">
            <button className="md:hidden w-8 h-8 rounded-lg bg-[#192540] flex items-center justify-center" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <span className="material-symbols-outlined text-[#a3a6ff] text-sm">menu</span>
            </button>
            <h1 className="font-['Plus_Jakarta_Sans'] font-bold text-lg tracking-tight text-[#dee5ff]">Dashboard</h1>
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
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#a3a6ff] mb-2 block">Welcome Back</span>
                    <h2 className="text-4xl font-['Plus_Jakarta_Sans'] font-extrabold text-white mb-4 leading-tight">
                      Hey {currentUser?.username || 'there'}, <br />
                      Ready to chat?
                    </h2>
                    <div className="flex items-center gap-4">
                      <button onClick={() => setActiveView('rooms')} className="bg-gradient-to-tr from-[#a3a6ff] to-[#6063ee] text-[#0f00a4] px-6 py-2.5 rounded-full font-['Inter'] font-bold text-sm uppercase tracking-wider shadow-lg shadow-[#a3a6ff]/20 active:scale-95 transition-transform">
                        Explore Rooms
                      </button>
                    </div>
                  </div>
                </div>
                <div className="bg-[#0f1930] rounded-lg p-8 flex flex-col justify-center border border-[#40485d]/5">
                  <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-xl text-[#dee5ff] mb-2">Live Status</h3>
                  <p className="text-[#a3aac4] text-sm mb-6 leading-relaxed">There are currently {rooms.length} active rooms available to join right now.</p>
                  <button onClick={() => setActiveView('rooms')} className="w-full flex items-center justify-center gap-2 bg-[#1f2b49] text-[#dee5ff] px-6 py-4 rounded-xl font-['Inter'] font-bold text-xs uppercase tracking-widest border border-[#40485d]/20 hover:bg-[#192540] transition-colors group">
                    View All Rooms
                  </button>
                </div>
              </section>

              {/* Featured Highlight Section */}
              <section className="mb-12">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-2xl text-[#dee5ff]">Popular Rooms</h3>
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
                        Step Inside
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
              {/* Rooms Management Section */}
              <section className="mb-12">
                <div className="bg-[#0f1930] rounded-lg p-8 flex flex-col md:flex-row items-center justify-between border border-[#40485d]/5 gap-6">
                  <div>
                    <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-xl text-[#dee5ff] mb-2">Create your space</h3>
                    <p className="text-[#a3aac4] text-sm leading-relaxed">Design a custom room for your community with unique roles and permissions.</p>
                  </div>
                  <Link to="/create-room" className="whitespace-nowrap flex items-center justify-center gap-2 bg-gradient-to-tr from-[#a3a6ff] to-[#6063ee] text-[#0f00a4] px-8 py-4 rounded-xl font-['Inter'] font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-all group">
                    <span className="material-symbols-outlined text-[20px] group-hover:rotate-90 transition-transform">add</span>
                    Create New Room
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
          ) : (
            <>
              {/* My Rooms Section */}
              <section>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-2xl text-[#dee5ff]">My Rooms</h3>
                    <p className="text-[#a3aac4] text-sm">Rooms created and managed by you</p>
                  </div>
                  <Link to="/create-room" className="bg-[#1f2b49] text-[#a3a6ff] px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest border border-[#40485d]/20 hover:bg-[#192540] transition-colors">
                    New Room
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
                          <span className="text-[10px] text-[#a3aac4] flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">public</span>
                            {room.type.toUpperCase()}
                          </span>
                          <Link 
                            to={`/chat/${room._id}`}
                            className="bg-[#a3a6ff] text-[#0f00a4] px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest hover:scale-105 transition-transform"
                          >
                            Manage
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
      <nav className="md:hidden fixed bottom-px left-0 w-full z-50 flex justify-around items-end px-4 pb-6 bg-[#060e20]/80 backdrop-blur-xl shadow-[0_-8px_24px_rgba(0,0,0,0.5)] rounded-t-[2.5rem]">
        <Link className="flex flex-col items-center justify-center bg-gradient-to-tr from-[#a3a6ff] to-[#6063ee] text-white rounded-full p-3 mb-2 scale-110 shadow-lg shadow-indigo-500/20 active:scale-90 duration-200" to="/dashboard">
          <span className="material-symbols-outlined">forum</span>
        </Link>
        <button onClick={handleLogout} className="flex flex-col items-center justify-center text-[#a3aac4] p-3 hover:text-white transition-all active:scale-90 duration-200">
          <span className="material-symbols-outlined">logout</span>
        </button>
      </nav>
    </div>
  )
}

export default DashboardPage
