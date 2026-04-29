import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiService } from '../services/api.service'
import { useLanguage } from '../hooks/useLanguage'
import { dashboardTranslations } from '../locales/dashboard'

function randomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let part = ''
  for (let i = 0; i < 3; i += 1) {
    part += chars[Math.floor(Math.random() * chars.length)]
  }
  return `STREAM-${part}`
}

function CreateChatroomPage() {
  const navigate = useNavigate()
  const [roomName, setRoomName] = useState('')
  const [description, setDescription] = useState('')
  const [privacy, setPrivacy] = useState('public')
  const [roomCode, setRoomCode] = useState(() => randomCode())
  const [copied, setCopied] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const { language } = useLanguage()
  const t = dashboardTranslations[language] || dashboardTranslations['en']

  const canCreate = useMemo(() => 
    roomName.trim().length > 0 && 
    !isSubmitting, 
  [roomName, isSubmitting])

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {
      setCopied(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!canCreate) return
    
    setIsSubmitting(true)
    setError(null)

    try {
      const payload = {
        name: roomName,
        description: description,
        type: privacy,
      }

      if (privacy === 'private') {
        payload.password = roomCode // Use the generated code as the password
      }

      const data = await apiService.createRoom(payload)
      navigate(`/chat/${data.room.id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDiscard = () => {
    setRoomName('')
    setDescription('')
    setPrivacy('public')
    setRoomCode(randomCode())
    setError(null)
  }

  return (
    <div className="min-h-screen bg-[#060e20] text-[#dee5ff] [font-family:_'Inter',sans-serif] pb-32">
      <header className="sticky top-0 z-50 w-full bg-[#091328] border-none flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            className="text-[#a3a6ff] hover:bg-[#1f2b49]/60 transition-colors p-2 rounded-full active:scale-95 duration-150"
            onClick={() => navigate('/dashboard')}
            type="button"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <img src="/logo.png" alt="BolChal Logo" className="w-8 h-8 rounded-lg object-cover" />
          <h1 className="text-[#a3a6ff] [font-family:_'Plus_Jakarta_Sans',sans-serif] font-extrabold tracking-tighter text-lg">
            BolChal
          </h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 pt-12">
        <div className="mb-12">
          <h2 className="[font-family:_'Plus_Jakarta_Sans',sans-serif] font-bold text-4xl tracking-tight mb-2">{t.createRoom.title}</h2>
          <p className="text-[#a3aac4]">{t.createRoom.subtitle}</p>
        </div>

        {error && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">
                {error}
            </div>
        )}

        <form className="grid grid-cols-1 md:grid-cols-12 gap-8" onSubmit={handleSubmit}>
          <div className="md:col-span-8 space-y-8">
            <div className="space-y-3">
              <label className="[font-family:_'Plus_Jakarta_Sans',sans-serif] font-semibold text-sm uppercase tracking-wider text-[#a3a6ff] ml-1">
                {t.createRoom.roomName}
              </label>
              <div className="border border-[rgba(64,72,93,0.2)] bg-[#192540] rounded-full px-6 py-4 transition-all focus-within:ring-2 focus-within:ring-[#a3a6ff]/20 focus-within:border-[rgba(163,166,255,0.4)]">
                <input
                  className="bg-transparent border-none focus:ring-0 w-full text-[#dee5ff] placeholder:text-[#a3aac4]/50 text-lg"
                  placeholder={t.createRoom.roomNamePlaceholder}
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="[font-family:_'Plus_Jakarta_Sans',sans-serif] font-semibold text-sm uppercase tracking-wider text-[#a3a6ff] ml-1">
                {t.createRoom.description}
              </label>
              <div className="border border-[rgba(64,72,93,0.2)] bg-[#192540] rounded-xl px-6 py-4 transition-all focus-within:ring-2 focus-within:ring-[#a3a6ff]/20 focus-within:border-[rgba(163,166,255,0.4)]">
                <textarea
                  className="bg-transparent border-none focus:ring-0 w-full text-[#dee5ff] placeholder:text-[#a3aac4]/50 resize-none"
                  placeholder={t.createRoom.descriptionPlaceholder}
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          <div className="md:col-span-4 space-y-8">
            <div className="space-y-3">
              <label className="[font-family:_'Plus_Jakarta_Sans',sans-serif] font-semibold text-sm uppercase tracking-wider text-[#a3a6ff] ml-1">
                Privacy
              </label>
              <div className="rounded-2xl p-4 border border-[rgba(64,72,93,0.2)] flex flex-col gap-3 bg-[rgba(31,43,73,0.6)] backdrop-blur-[12px]">
                <label className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${privacy === 'public' ? 'bg-[#9396ff]/20 border border-[#a3a6ff]/30' : 'bg-[#0f1930] hover:bg-[#141f38]'}`}>
                  <div className="flex items-center gap-3">
                    <span className={`material-symbols-outlined ${privacy === 'public' ? 'text-[#a3a6ff]' : 'text-[#a3aac4]'}`}>public</span>
                    <span className="font-medium text-sm">Public</span>
                  </div>
                  <input
                    checked={privacy === 'public'}
                    className="text-[#a3a6ff] focus:ring-0 bg-[#192540] border-[#40485d]"
                    name="privacy"
                    type="radio"
                    onChange={() => setPrivacy('public')}
                    disabled={isSubmitting}
                  />
                </label>
                <label className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${privacy === 'private' ? 'bg-[#9396ff]/20 border border-[#a3a6ff]/30' : 'bg-[#0f1930] hover:bg-[#141f38]'}`}>
                  <div className="flex items-center gap-3">
                    <span className={`material-symbols-outlined ${privacy === 'private' ? 'text-[#a3a6ff]' : 'text-[#a3aac4]'}`}>lock</span>
                    <span className="font-medium text-sm">Private</span>
                  </div>
                  <input
                    checked={privacy === 'private'}
                    className="text-[#a3a6ff] focus:ring-0 bg-[#192540] border-[#40485d]"
                    name="privacy"
                    type="radio"
                    onChange={() => setPrivacy('private')}
                    disabled={isSubmitting}
                  />
                </label>
              </div>
            </div>

            {privacy === 'private' ? (
              <div className="space-y-3">
                <label className="[font-family:_'Plus_Jakarta_Sans',sans-serif] font-semibold text-sm uppercase tracking-wider text-[#a3a6ff] ml-1">
                  Access Code (Password)
                </label>
                <div className="rounded-2xl p-5 border border-[rgba(64,72,93,0.2)] space-y-4 bg-[rgba(31,43,73,0.6)] backdrop-blur-[12px]">
                  <div className="bg-[#000000]/50 rounded-lg py-3 px-4 flex items-center justify-between">
                    <span className="font-mono text-xl tracking-widest text-[#a28efc] font-bold">{roomCode}</span>
                    <button className="text-[#a3a6ff] hover:text-white transition-colors" type="button" onClick={handleCopyCode}>
                      <span className="material-symbols-outlined text-lg">{copied ? 'check' : 'content_copy'}</span>
                    </button>
                  </div>
                  <button
                    className="w-full text-xs [font-family:_'Plus_Jakarta_Sans',sans-serif] font-bold uppercase tracking-widest text-[#a3aac4] hover:text-[#a3a6ff] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    type="button"
                    onClick={() => setRoomCode(randomCode())}
                    disabled={isSubmitting}
                  >
                    <span className="material-symbols-outlined text-sm">refresh</span>
                    Generate New Code
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl p-6 border border-dashed border-[#40485d]/20 bg-[#141f38]/30 flex flex-col items-center text-center">
                <span className="material-symbols-outlined text-[#a3a6ff] mb-3 text-3xl">public</span>
                <p className="text-sm font-semibold text-[#dee5ff] mb-1">Open to Everyone</p>
                <p className="text-[11px] text-[#a3aac4] leading-relaxed">Public rooms do not require an access code. Anyone on the platform can join and participate.</p>
              </div>
            )}
          </div>

          <div className="md:col-span-12 mt-8 flex flex-col items-center">
            <button
              className="w-full max-w-md bg-gradient-to-br from-[#a3a6ff] to-[#6063ee] text-[#0a0081] [font-family:_'Plus_Jakarta_Sans',sans-serif] font-extrabold text-lg py-5 rounded-full shadow-[0px_12px_32px_rgba(163,166,255,0.25)] hover:shadow-[0px_12px_48px_rgba(163,166,255,0.4)] transition-all active:scale-95 flex items-center justify-center gap-3 tracking-tight disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={!canCreate}
            >
              {isSubmitting ? (language === 'hi' ? 'बना रहे हैं...' : 'CREATING...') : t.createRoom.button.toUpperCase()}
              <span className="material-symbols-outlined">rocket_launch</span>
            </button>
            <button
              className="mt-6 text-[#a3aac4] hover:text-[#dee5ff] transition-colors text-sm uppercase tracking-widest font-bold"
              type="button"
              onClick={handleDiscard}
              disabled={isSubmitting}
            >
              {language === 'hi' ? 'ड्राफ्ट छोड़ें' : 'Discard Draft'}
            </button>
          </div>
        </form>
      </main>

      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-end px-6 pb-6 bg-[#060e20]/80 backdrop-blur-xl shadow-[0px_-12px_32px_rgba(25,37,64,0.08)]">
        <Link to="/dashboard" className="flex flex-col items-center justify-center text-[#a3aac4] p-2 hover:text-[#dee5ff] transition-all cursor-pointer group">
          <span className="material-symbols-outlined">forum</span>
          <span className="[font-family:_'Inter',sans-serif] text-[11px] font-medium uppercase tracking-widest mt-1">Feed</span>
        </Link>
        <div className="flex flex-col items-center justify-center bg-gradient-to-br from-[#a3a6ff] to-[#6063ee] text-white rounded-full p-3 mb-2 transform -translate-y-2 shadow-lg cursor-pointer active:scale-90 transition-transform">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>add_circle</span>
        </div>
        <div className="flex flex-col items-center justify-center text-[#a3aac4] p-2 hover:text-[#dee5ff] transition-all cursor-pointer group">
          <span className="material-symbols-outlined">search</span>
          <span className="[font-family:_'Inter',sans-serif] text-[11px] font-medium uppercase tracking-widest mt-1">Search</span>
        </div>
        <div className="flex flex-col items-center justify-center text-[#a3aac4] p-2 hover:text-[#dee5ff] transition-all cursor-pointer group">
          <span className="material-symbols-outlined">person</span>
          <span className="[font-family:_'Inter',sans-serif] text-[11px] font-medium uppercase tracking-widest mt-1">Profile</span>
        </div>
      </nav>
    </div>
  )
}

export default CreateChatroomPage
