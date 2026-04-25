import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiService } from '../services/api.service'

function DashboardPage() {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [rooms, setRooms] = useState([])
  const [users, setUsers] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function init() {
      try {
        const user = apiService.getCurrentUser()
        setCurrentUser(user)

        const [roomsData, usersData] = await Promise.all([
          apiService.getRooms(),
          apiService.getUsers()
        ])
        
        setRooms(roomsData.rooms || [])
        setUsers(usersData.users || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }
    init()
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
          <div className="w-10 h-10 rounded-full bg-[#a3a6ff] flex items-center justify-center text-[#0f00a4] font-black text-sm shadow-lg shadow-indigo-500/20">
            {currentUser?.username?.substring(0, 2).toUpperCase() || '??'}
          </div>
          <div>
            <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-[#dee5ff] text-sm">{currentUser?.username || 'Guest'}</h3>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              <span className="text-[10px] text-[#a3aac4] uppercase tracking-widest font-semibold">Online</span>
            </div>
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-4">
          <Link className="flex items-center gap-3 px-4 py-3 bg-[#49339d] text-white rounded-lg mx-2 duration-300 ease-in-out font-['Plus_Jakarta_Sans'] font-medium text-sm" to="/dashboard">
            <span className="material-symbols-outlined">explore</span>
            <span>Explore Rooms</span>
          </Link>
          <a className="flex items-center gap-3 px-4 py-3 text-[#a3aac4] hover:text-white mx-2 duration-300 ease-in-out hover:bg-[#141f38] transition-all font-['Plus_Jakarta_Sans'] font-medium text-sm" href="#">
            <span className="material-symbols-outlined">chat_bubble</span>
            <span>Direct Messages</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-[#a3aac4] hover:text-white mx-2 duration-300 ease-in-out hover:bg-[#141f38] transition-all font-['Plus_Jakarta_Sans'] font-medium text-sm" href="#">
            <span className="material-symbols-outlined">auto_awesome</span>
            <span>Saved Moments</span>
          </a>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-[#a3aac4] hover:text-[#d73357] mx-2 duration-300 ease-in-out hover:bg-[#a70138]/10 transition-all font-['Plus_Jakarta_Sans'] font-medium text-sm rounded-lg">
            <span className="material-symbols-outlined">logout</span>
            <span>Logout</span>
          </button>
        </nav>

        <div className="flex-1 overflow-y-auto px-4 mt-8 space-y-6">
          <div>
            <h4 className="px-4 text-[10px] text-[#a3aac4] font-bold uppercase tracking-[0.2em] mb-4">Active Transmissions</h4>
            <div className="space-y-1">
              {users.filter(u => u.id !== currentUser?.id).map(user => (
                <div key={user.id} className="flex items-center justify-between px-4 py-2 hover:bg-[#141f38] rounded-xl transition-all group cursor-default">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-[#192540] flex items-center justify-center text-[10px] font-bold text-[#a3a6ff] border border-[#40485d]/20 transition-transform group-hover:scale-110">
                        {user.username.substring(0, 2).toUpperCase()}
                      </div>
                      {user.isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#091328]"></div>
                      )}
                    </div>
                    <span className="text-xs font-medium text-[#dee5ff] group-hover:text-white transition-colors">{user.username}</span>
                  </div>
                  <span className="material-symbols-outlined text-[#a3aac4] text-xs opacity-0 group-hover:opacity-100 transition-opacity">more_vert</span>
                </div>
              ))}
              {users.length <= 1 && (
                <p className="px-4 text-[10px] text-[#a3aac4]/40 italic">Waiting for more connections...</p>
              )}
            </div>
          </div>
        </div>
        <div className="px-8 mt-auto">
          <div className="bg-[#192540]/30 rounded-xl p-4 border border-[#40485d]/10">
            <span className="text-[10px] text-[#a3a6ff] font-bold uppercase tracking-widest block mb-1">Premium</span>
            <p className="text-xs text-[#a3aac4]">Unlock crystal clear audio & 4K streaming.</p>
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
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            <div className="lg:col-span-2 relative overflow-hidden rounded-lg bg-gradient-to-br from-[#49339d] to-[#0f1930] h-64 flex flex-col justify-end p-8">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#a3a6ff]/20 blur-[100px] -mr-32 -mt-32"></div>
              <div className="relative z-10">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#a3a6ff] mb-2 block">Featured</span>
                <h2 className="text-4xl font-['Plus_Jakarta_Sans'] font-extrabold text-white mb-4 leading-tight">
                  Join the Live <br />
                  Conversation
                </h2>
                <div className="flex items-center gap-4">
                  <Link to="/create-room" className="bg-gradient-to-tr from-[#a3a6ff] to-[#6063ee] text-[#0f00a4] px-6 py-2.5 rounded-full font-['Inter'] font-bold text-sm uppercase tracking-wider shadow-lg shadow-[#a3a6ff]/20 active:scale-95 transition-transform">
                    Start Yours
                  </Link>
                </div>
              </div>
            </div>
            <div className="bg-[#0f1930] rounded-lg p-8 flex flex-col justify-center border border-[#40485d]/5">
              <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-xl text-[#dee5ff] mb-2">Create your space</h3>
              <p className="text-[#a3aac4] text-sm mb-6 leading-relaxed">Design a custom room for your community with unique roles and permissions.</p>
              <Link to="/create-room" className="w-full flex items-center justify-center gap-2 bg-[#1f2b49] text-[#dee5ff] px-6 py-4 rounded-xl font-['Inter'] font-bold text-xs uppercase tracking-widest border border-[#40485d]/20 hover:bg-[#192540] transition-colors group">
                <span className="material-symbols-outlined text-[#a3a6ff] group-hover:rotate-90 transition-transform">add</span>
                Create Room
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

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
