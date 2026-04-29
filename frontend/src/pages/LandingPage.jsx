import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { apiService } from '../services/api.service'
import { translations } from '../locales/landing'
import { useLanguage } from '../hooks/useLanguage'

function LandingPage() {
  const [featuredRooms, setFeaturedRooms] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const { language, setLanguage } = useLanguage()

  useEffect(() => {
    async function loadFeatured() {
      try {
        const data = await apiService.getFeaturedRooms()
        setFeaturedRooms(data.rooms || [])
      } catch (err) {
        console.error('Error loading featured rooms:', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadFeatured()
  }, [])

  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const t = translations[language] || translations['en']

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const [heroDisplayText, setHeroDisplayText] = useState('')
  
  useEffect(() => {
    let index = 0
    const fullText = t.hero.subtitle
    setHeroDisplayText('')
    
    const interval = setInterval(() => {
      setHeroDisplayText(fullText.substring(0, index + 1))
      index++
      if (index >= fullText.length) {
        clearInterval(interval)
      }
    }, 40)
    
    return () => clearInterval(interval)
  }, [language, t.hero.subtitle])

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#060e20] text-[#dee5ff] [font-family:_'Inter',sans-serif]">
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        isScrolled || isMenuOpen
          ? 'py-4 bg-[rgba(6,14,32,0.95)] backdrop-blur-xl border-b border-[#40485d]/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)]' 
          : 'py-8 bg-transparent border-b border-transparent'
      }`}>
        <div className="mx-auto max-w-7xl px-6 flex items-center justify-between transition-all duration-500">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="BolChal Logo" className="w-9 h-9 rounded-xl object-cover shadow-lg shadow-[#a3a6ff]/20" />
            <span className="font-black italic text-[#a3a6ff] tracking-tighter text-xl [font-family:_'Plus_Jakarta_Sans',sans-serif]">
              BolChal.
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-10 text-[11px] uppercase font-bold tracking-[0.2em] text-[#a3aac4]">
            <a href="#hero" className="hover:text-[#dee5ff] transition-colors">{t.nav.home}</a>
            <a href="#experience" className="hover:text-[#dee5ff] transition-colors">{t.nav.experience}</a>
            <a href="#popular-rooms" className="hover:text-[#dee5ff] transition-colors">{t.nav.communities}</a>
            <Link to="/support" className="hover:text-[#dee5ff] transition-colors">{t.nav.support}</Link>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="relative group hidden sm:block">
              <button className="flex items-center gap-1 text-[11px] uppercase font-bold tracking-[0.2em] text-[#a3aac4] hover:text-[#dee5ff] transition-colors px-2 py-1 border border-transparent hover:border-[#40485d]/40 rounded-lg">
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

            <Link to="/login" className="hidden sm:block text-[11px] uppercase font-bold tracking-[0.2em] text-[#a3aac4] hover:text-[#dee5ff] transition-colors px-4">
              {t.nav.login}
            </Link>
            <Link to="/signup" className="px-5 py-2.5 bg-[#a3a6ff] text-[#0f00a4] rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-[1.05] active:scale-95 transition-all shadow-lg shadow-[#a3a6ff]/10">
              {t.nav.join}
            </Link>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-[#a3aac4] hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-[28px]">
                {isMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={`lg:hidden fixed inset-x-0 top-[72px] bg-[#091328] border-b border-[#40485d]/20 transition-all duration-500 overflow-hidden ${isMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="flex flex-col p-6 gap-6">
            <div className="flex flex-col gap-4 text-sm font-bold uppercase tracking-[0.1em] text-[#a3aac4]">
              <a href="#hero" onClick={() => setIsMenuOpen(false)} className="hover:text-[#a3a6ff] py-2 border-b border-[#40485d]/10 transition-colors">{t.nav.home}</a>
              <a href="#experience" onClick={() => setIsMenuOpen(false)} className="hover:text-[#a3a6ff] py-2 border-b border-[#40485d]/10 transition-colors">{t.nav.experience}</a>
              <a href="#popular-rooms" onClick={() => setIsMenuOpen(false)} className="hover:text-[#a3a6ff] py-2 border-b border-[#40485d]/10 transition-colors">{t.nav.communities}</a>
              <Link to="/support" onClick={() => setIsMenuOpen(false)} className="hover:text-[#a3a6ff] py-2 border-b border-[#40485d]/10 transition-colors">{t.nav.support}</Link>
              <Link to="/login" onClick={() => setIsMenuOpen(false)} className="sm:hidden hover:text-[#a3a6ff] py-2 border-b border-[#40485d]/10 transition-colors">{t.nav.login}</Link>
            </div>
            
            <div className="flex items-center justify-between sm:hidden pt-2">
              <span className="text-[11px] uppercase font-bold tracking-widest text-[#6d758c]">{language === 'en' ? 'Select Language' : 'भाषा चुनें'}</span>
              <div className="flex gap-4">
                <button 
                  onClick={() => { setLanguage('en'); setIsMenuOpen(false); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold ${language === 'en' ? 'bg-[#a3a6ff] text-[#0f00a4]' : 'bg-[#141f38] text-[#a3aac4]'}`}
                >
                  EN
                </button>
                <button 
                  onClick={() => { setLanguage('hi'); setIsMenuOpen(false); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold ${language === 'hi' ? 'bg-[#a3a6ff] text-[#0f00a4]' : 'bg-[#141f38] text-[#a3aac4]'}`}
                >
                  HI
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {/* ... existing hero section ... */}
        <section
          id="hero"
          className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#000000] pt-20"
        >
          <div className="absolute inset-0 opacity-40">
            <img
              className="h-full w-full object-cover"
              alt="abstract cosmic flowing silk textures in deep indigo and violet with subtle sparkles and dramatic cinematic lighting"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsXs125DYITsHx2ezax-C_7m5fBVhWMptD2A3A8_r4KaqgiqCWmkZR4zO6o-I371XbKlOvKo010rkVUJam0G-kso-1vAMhMU-6jfSUtleESsyNmm09HfQsHCul1Rge0EQGaZ3pubPqO6XUos2cBqBYBVhyBal6xbqk-5XKA_zS4iSHtVrmRzZ3oAtAT974e6GOlgOQk9Vxc4s94vjFBoDJAlK9SBzoP_3ZU9GeDfROdOc5RKlAq6lN17dRjItEgH-c6wbaoqpeEWY"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#060e20]/20 via-[#060e20] to-[#060e20]" />
          </div>

          <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
            <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tighter text-[#dee5ff] drop-shadow-[0_0_20px_rgba(163,166,255,0.3)] md:text-8xl [font-family:_'Plus_Jakarta_Sans',sans-serif]">
              {t.hero.title}
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-[#a3aac4] md:text-2xl [font-family:_'Inter',sans-serif] min-h-[80px]">
              {heroDisplayText}
              <span className="inline-block w-1 h-6 ml-1 bg-[#a3a6ff] animate-blink align-middle"></span>
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                className="w-full rounded-full bg-gradient-to-r from-[#a3a6ff] to-[#6063ee] px-10 py-4 text-lg font-bold text-[#0f00a4] transition-opacity hover:opacity-90 sm:w-auto"
                to="/login"
              >
                {t.hero.enter}
              </Link>
              <a
                className="w-full rounded-full border border-[#40485d]/40 px-10 py-4 text-lg font-bold text-[#dee5ff] transition-colors hover:bg-white/5 sm:w-auto"
                href="#experience"
              >
                {t.hero.learnMore}
              </a>
            </div>
          </div>

          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
            <span className="material-symbols-outlined text-3xl">
              keyboard_double_arrow_down
            </span>
          </div>
        </section>

        {/* ... existing experience section ... */}
        <section id="experience" className="mx-auto max-w-7xl px-6 py-24">
          <div className="mb-16 text-left md:text-center">
            <span className="mb-4 block text-sm font-semibold uppercase tracking-widest text-[#a3a6ff]">
              {t.experience.tag}
            </span>
            <h2 className="mb-4 text-4xl font-bold text-[#dee5ff] md:text-5xl [font-family:_'Plus_Jakarta_Sans',sans-serif]">
              {t.experience.title}
            </h2>
            <div className="mx-auto h-1 w-24 rounded-full bg-[#6063ee]" />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
            <div className="group relative flex min-h-[400px] flex-col justify-between overflow-hidden rounded-2xl bg-[#091328] p-6 md:p-8 md:col-span-8">
              <div className="absolute right-0 top-0 h-full w-full md:w-1/2 opacity-10 md:opacity-30 transition-opacity group-hover:opacity-50">
                <img
                  className="h-full w-full object-cover"
                  alt="minimalist dark abstract 3D shapes with soft blue glow"
                  src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=2064"
                />
              </div>
              <div className="relative z-10">
                <div className="mb-6 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-2xl bg-[rgba(31,43,73,0.6)] backdrop-blur-md">
                  <span className="material-symbols-outlined text-[#a3a6ff] text-xl md:text-2xl">
                    auto_awesome
                  </span>
                </div>
                <h3 className="mb-4 text-2xl md:text-3xl font-bold [font-family:_'Plus_Jakarta_Sans',sans-serif]">
                  {t.experience.feat1Title}
                </h3>
                <p className="max-w-md leading-relaxed text-[#a3aac4] [font-family:_'Inter',sans-serif]">
                  {t.experience.feat1Desc}
                </p>
              </div>
              <div className="relative z-10 mt-8 flex gap-2">
                <span className="rounded-sm bg-[#49339d]/40 px-4 py-1 text-xs font-semibold text-[#d4c9ff]">
                  {t.experience.feat1Tag1}
                </span>
                <span className="rounded-sm bg-[#49339d]/40 px-4 py-1 text-xs font-semibold text-[#d4c9ff]">
                  {t.experience.feat1Tag2}
                </span>
              </div>
            </div>

            <div className="flex min-h-[400px] flex-col justify-between rounded-2xl bg-[#141f38] p-6 md:p-8 md:col-span-4">
              <div>
                <div className="mb-6 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-2xl bg-[rgba(31,43,73,0.6)] backdrop-blur-md">
                  <span className="material-symbols-outlined text-[#a3a6ff] text-xl md:text-2xl">
                    verified_user
                  </span>
                </div>
                <h3 className="mb-4 text-xl md:text-2xl font-bold [font-family:_'Plus_Jakarta_Sans',sans-serif]">
                  {t.experience.feat2Title}
                </h3>
                <p className="text-sm md:text-base leading-relaxed text-[#a3aac4] [font-family:_'Inter',sans-serif]">
                  {t.experience.feat2Desc}
                </p>
              </div>
              <div className="mt-8 flex h-32 w-full items-center justify-center overflow-hidden rounded-2xl bg-[#0f1930]">
                <div className="flex items-center gap-3 rounded-full bg-[rgba(31,43,73,0.6)] px-4 py-3 backdrop-blur-md">
                  <span className="material-symbols-outlined text-green-400" style={{ fontVariationSettings: "'FILL' 1" }}>
                    lock
                  </span>
                  <span className="font-mono text-xs opacity-60">{t.experience.feat2Tag}</span>
                </div>
              </div>
            </div>

            <div className="relative flex min-h-[350px] flex-col justify-center overflow-hidden rounded-2xl bg-[#0f1930] p-6 md:p-8 text-center md:col-span-5">
              <div className="absolute inset-0 opacity-10">
                <img
                  className="h-full w-full object-cover"
                  alt="abstract tech circuitry lines in bright neon blue on dark background"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9uXwXWxJan5ytNO5od9joGR598wg1i9vz6SBI_jhrDWDyXRSyBCHVvQcZIlf-ZGeJrCDcxvdYHUPQY4rN9BU9-AqFqbCxYboltU2lUt7HmT1LrB5iDLg90InE_y7S453Z9M3ZAeXsX_ztC6jsLuPxpmcGgpKIXw6zBn-M7g1h7wshEtutFfmqGoCMjxTwBJl379L-yHsJlfMAxNd1My2KsTPbfBidgB8mrQsrpCIWTR5bVXJh_mPuNzWUZ9WeC_u35UNWmN1Q1Z8"
                />
              </div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="mb-6 flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-full bg-gradient-to-r from-[#a3a6ff] to-[#6063ee] shadow-lg shadow-[#a3a6ff]/20">
                  <span
                    className="material-symbols-outlined text-2xl md:text-3xl text-[#0f00a4]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    bolt
                  </span>
                </div>
                <h3 className="mb-4 text-xl md:text-2xl font-bold [font-family:_'Plus_Jakarta_Sans',sans-serif]">
                  {t.experience.feat3Title}
                </h3>
                <p className="mx-auto max-w-xs text-sm md:text-base text-[#a3aac4] [font-family:_'Inter',sans-serif]">
                  {t.experience.feat3Desc}
                </p>
              </div>
            </div>

            <div className="col-span-1 h-[350px] overflow-hidden rounded-2xl md:col-span-7">
              <img
                className="h-full w-full object-cover"
                alt="modern smartphone mockup displaying a beautiful dark mode chat application with vibrant message bubbles and glassmorphism elements"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSu9HkStgF24bdPp2UNah1Ecq9SGEWnCoWcSxd9s0KNr3H20kkRsxxlxxjOtNmiJQjK-tkggFJ6eq5BbPBfkTxhjt5ngnxALhM3VmRGYW1jbvLhRbsY6ut36Ds-vNtI7o-ieOsJ0tVUI6UcWc6qbFMdHDLyLgkyCe46pxTvpPzZ7vndPwK5BqrgqWtag1ubqeZRi9TK-PTxxuvsS8m0JTs8kUd8vgRQnIF7t-MrBuzw0gwrdEUDcXFx_emAdlGaaztZS5lXt2djG8"
              />
            </div>
          </div>
        </section>

        {/* Popular Rooms Section */}
        {!isLoading && featuredRooms.length > 0 && (
          <section id="popular-rooms" className="mx-auto max-w-7xl px-6 py-24 border-t border-[#40485d]/10">
            <div className="mb-16 text-center">
              <span className="mb-4 block text-sm font-semibold uppercase tracking-widest text-[#a3a6ff]">
                {t.communities.tag}
              </span>
              <h2 className="mb-4 text-4xl font-bold text-[#dee5ff] md:text-5xl [font-family:_'Plus_Jakarta_Sans',sans-serif]">
                {t.communities.title}
              </h2>
              <div className="mx-auto h-1 w-24 rounded-full bg-[#6063ee]" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredRooms.map((room) => (
                <div key={room._id} className="relative group overflow-hidden bg-gradient-to-b from-[#091328] to-[#060e20] p-6 md:p-8 rounded-2xl border border-[#40485d]/10 hover:border-[#a3a6ff]/30 transition-all duration-300">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#141f38] flex items-center justify-center text-[#a3a6ff]">
                      <span className="material-symbols-outlined text-xl md:text-2xl">rocket_launch</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-[#dee5ff] group-hover:text-[#a3a6ff] transition-colors">{room.name}</h4>
                      <span className="text-[10px] text-[#a3aac4] uppercase tracking-widest">{t.communities.publicSpace}</span>
                    </div>
                  </div>
                  <p className="text-sm text-[#a3aac4] mb-8 line-clamp-2 min-h-[40px] leading-relaxed">
                    {room.description || t.communities.defaultDesc}
                  </p>
                  <Link to="/login" className="w-full flex items-center justify-center py-4 bg-[#192540] hover:bg-[#a3a6ff] hover:text-[#0a0081] text-[#dee5ff] rounded-xl text-xs font-bold uppercase tracking-widest transition-all">
                    {t.communities.stepInside}
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="px-6 py-24">
          <div className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl border border-[#40485d]/10 bg-[rgba(31,43,73,0.6)] p-8 md:p-12 text-center backdrop-blur-md">
            <div className="absolute left-0 top-0 h-32 w-32 bg-[#a3a6ff]/20 blur-[100px]" />
            <div className="absolute bottom-0 right-0 h-32 w-32 bg-[#a28efc]/20 blur-[100px]" />
            <h2 className="mb-6 md:mb-8 text-2xl md:text-5xl font-bold [font-family:_'Plus_Jakarta_Sans',sans-serif]">
              {t.cta.title}
            </h2>
            <p className="mx-auto mb-10 max-w-xl text-base md:text-lg leading-relaxed text-[#a3aac4] [font-family:_'Inter',sans-serif]">
              {t.cta.desc}
            </p>
            <Link
              className="inline-block rounded-full bg-gradient-to-r from-[#a3a6ff] to-[#6063ee] px-8 md:px-12 py-4 md:py-5 text-lg md:text-xl font-bold text-[#0f00a4] transition-transform active:scale-95"
              to="/login"
            >
              {t.cta.enter}
            </Link>
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-7xl px-6 py-12 border-t border-[#40485d]/10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="BolChal Logo" className="w-8 h-8 rounded-lg object-cover border border-[#a3a6ff]/20" />
            <span className="font-black italic text-[#a3a6ff] tracking-tighter [font-family:_'Plus_Jakarta_Sans',sans-serif]">
              BolChal
            </span>
          </div>

          <div className="flex items-center gap-8 text-[10px] uppercase font-bold tracking-[0.2em] text-[#6d758c]">
            <Link className="hover:text-[#dee5ff] transition-colors" to="/privacy">{t.footer.privacy}</Link>
            <Link className="hover:text-[#dee5ff] transition-colors" to="/terms">{t.footer.terms}</Link>
            <Link className="hover:text-[#dee5ff] transition-colors" to="/support">{t.footer.support}</Link>
          </div>

          <div className="text-[10px] uppercase font-bold tracking-widest text-[#40485d]">
            BolChal © 2026
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage

