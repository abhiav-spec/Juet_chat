import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

function JoinRoomPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [roomCode, setRoomCode] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle room join logic here
    console.log('Joining room:', { username, roomCode })
  }

  const friends = [
    {
      src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPjUHmnxGaqpqLsp4r_hR8x91RDAYABfS54H-vFpyVcKlJkPUFTTOmb70RxRFta5ynuXrRkUzTDy821lwHD_24KagwA-QeufTT4t8erlIhyvtOo0yHSlPsjK7Thp4SgojKQm_qyuLuK2pSukGzLRYpt3YpPeQTfKYYJIZz0_Fm8jw-lFIDv9-64Snuan_eNJ3eyk6_94tsNGdolr2xieRN_2gsQP_jlMUnKlv9Bw6eWSpYdxx0gBSxEOM9yxRKQRbcDTpAKaIubjA'
    },
    {
      src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbQ3_ImhD1n83MV1rsqt4vwxz0qwoaxSiXMebY3mx1Qo3Zp5Zr208_jg1BlFZndngoXQn45J1ikf1s8XteEhdcc7k-pS2wF1-cuM17nRezeNjJ0n19hpnFtudPL_GAXMRNUXMeAxjJgSScuyi9PqnV5SR4uEOm3Q9glky6UHPKszMZHL-Ckj6sY7CKUjaLuZj_FkzkqW4F9No8uB9Nz4ceDL-gZeCmIDEwVtusoJ4yGjvfLrhBNP_R6bjhUC_fMhkeLPlQdmcOS6Y'
    },
    {
      src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzWvTVJur4ttTZwX4zqIcn1z-FtJCJFsR_KKiqFivBlYdzZv47Cmv0hJH-40LFqZvvtJH0at9YFjhgE8hDugOrsDBNj4JFLvgXuHcBlreOqzhJyNWlYD7NgAYptcJLiT2HrG75c_--fn9ghcxynfpSQ_daSrQWfQWEq0fRJfF9sVEJGyM6Fl4kazfSDezuOWMlcz2MQEnXuU309fJRH9kp2vXZQ5J8r-836yTCQCUPUY6Wpw3P56vXEu3DREet_BzeCRJrw5ozZg8'
    }
  ]

  return (
    <div className="bg-[#060e20] text-[#dee5ff] font-['Inter'] min-h-screen flex flex-col overflow-x-hidden">
      {/* TopAppBar */}
      <header className="bg-[#091328] border-none fixed w-full px-6 h-16 z-50 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="text-[#a3aac4] hover:bg-[#1f2b49]/50 transition-colors p-2 rounded-full scale-95 active:scale-90 transition-transform"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-['Plus_Jakarta_Sans'] font-bold text-lg tracking-tight text-[#dee5ff]">General Chat</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-[#a3aac4] hover:bg-[#1f2b49]/50 transition-colors p-2 rounded-full scale-95 active:scale-90 transition-transform">
            <span className="material-symbols-outlined">info</span>
          </button>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="flex-grow flex items-center justify-center relative p-6 mt-16 pb-24">
        {/* Ambient background glow elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#a3a6ff]/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#a28efc]/10 blur-[140px] rounded-full pointer-events-none"></div>

        {/* Join Room Form Container */}
        <div className="w-full max-w-md z-10">
          <div className="bg-[rgba(31,43,73,0.6)] backdrop-blur-[12px] rounded-lg p-8 md:p-10 shadow-[0_12px_32px_rgba(25,37,64,0.08)] border border-[rgba(64,72,93,0.2)]">
            <div className="mb-10 text-center">
              <h2 className="font-['Plus_Jakarta_Sans'] text-3xl font-extrabold tracking-tight mb-3 text-[#dee5ff]">Join a Stream</h2>
              <p className="text-[#a3aac4] text-sm font-medium">Enter your details to join the conversation.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Username Input */}
              <div className="space-y-2">
                <label className="block text-[10px] font-semibold text-[#a3aac4] px-4 tracking-wider uppercase" htmlFor="username">
                  Username
                </label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-[#a3aac4] group-focus-within:text-[#a3a6ff] transition-colors">
                    person
                  </span>
                  <input
                    className="w-full bg-[#192540] border-none rounded-full py-4 pl-14 pr-6 text-[#dee5ff] placeholder-[#a3aac4]/50 focus:ring-2 focus:ring-[#a3a6ff]/40 transition-all duration-300 font-medium"
                    id="username"
                    placeholder="e.g. CinematicExplorer"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              {/* Room ID Input */}
              <div className="space-y-2">
                <label className="block text-[10px] font-semibold text-[#a3aac4] px-4 tracking-wider uppercase" htmlFor="room-id">
                  Room Code
                </label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-[#a3aac4] group-focus-within:text-[#a3a6ff] transition-colors">
                    meeting_room
                  </span>
                  <input
                    className="w-full bg-[#192540] border-none rounded-full py-4 pl-14 pr-6 text-[#dee5ff] placeholder-[#a3aac4]/50 focus:ring-2 focus:ring-[#a3a6ff]/40 transition-all duration-300 font-medium"
                    id="room-id"
                    placeholder="Enter 6-digit code"
                    type="text"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value)}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  className="w-full bg-gradient-to-r from-[#a3a6ff] to-[#6063ee] text-[#0f00a4] font-['Plus_Jakarta_Sans'] font-extrabold text-sm uppercase tracking-widest py-4 rounded-full shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 active:scale-[0.98] transition-all duration-300"
                  type="submit"
                >
                  Join Room
                </button>
              </div>
            </form>

            <div className="mt-8 pt-8 border-t border-[#40485d]/20 flex flex-col items-center gap-4">
              <p className="text-[#a3aac4] text-xs">Don't have a code?</p>
              <button 
                onClick={() => navigate('/dashboard')}
                className="text-[#a3a6ff] font-bold text-sm hover:text-[#9396ff] transition-colors"
              >
                Explore Public Rooms
              </button>
            </div>
          </div>

          {/* Asymmetric visual accent */}
          <div className="mt-8 flex justify-between items-center px-4">
            <div className="flex -space-x-2">
              {friends.map((friend, idx) => (
                <img
                  key={idx}
                  className="w-8 h-8 rounded-full border-2 border-[#060e20]"
                  src={friend.src}
                  alt="Friend"
                />
              ))}
              <div className="w-8 h-8 rounded-full border-2 border-[#060e20] bg-[#141f38] flex items-center justify-center text-[10px] font-bold text-[#a3a6ff]">
                +12
              </div>
            </div>
            <span className="text-[#a3aac4] text-[11px] font-medium italic">12 friends are active right now</span>
          </div>
        </div>
      </main>

      {/* Bottom Navigation - Mobile */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-end px-4 pb-6 bg-[#060e20]/80 backdrop-blur-xl md:hidden">
        <button className="flex flex-col items-center justify-center text-[#a3aac4] p-3 hover:text-white transition-all active:scale-90 duration-200">
          <span className="material-symbols-outlined">forum</span>
          <span className="font-['Inter'] text-[10px] font-semibold tracking-wider uppercase mt-1">Rooms</span>
        </button>
        <button className="flex flex-col items-center justify-center text-[#a3aac4] p-3 hover:text-white transition-all active:scale-90 duration-200">
          <span className="material-symbols-outlined">search</span>
          <span className="font-['Inter'] text-[10px] font-semibold tracking-wider uppercase mt-1">Search</span>
        </button>
        <button className="flex flex-col items-center justify-center text-[#a3aac4] p-3 hover:text-white transition-all active:scale-90 duration-200">
          <span className="material-symbols-outlined">notifications</span>
          <span className="font-['Inter'] text-[10px] font-semibold tracking-wider uppercase mt-1">Activity</span>
        </button>
        <button className="flex flex-col items-center justify-center text-[#a3aac4] p-3 hover:text-white transition-all active:scale-90 duration-200">
          <span className="material-symbols-outlined">person</span>
          <span className="font-['Inter'] text-[10px] font-semibold tracking-wider uppercase mt-1">Profile</span>
        </button>
      </nav>
    </div>
  )
}

export default JoinRoomPage
