import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { apiService } from '../services/api.service'

function LandingPage() {
  const [featuredRooms, setFeaturedRooms] = useState([])
  const [isLoading, setIsLoading] = useState(true)

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

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#060e20] text-[#dee5ff] [font-family:_'Inter',sans-serif]">
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
              Where Every Conversation is a Masterpiece
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-[#a3aac4] md:text-2xl [font-family:_'Inter',sans-serif]">
              Experience deep connection in a sanctuary of modern communication.
              A digital canvas designed for the art of dialogue.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                className="w-full rounded-full bg-gradient-to-r from-[#a3a6ff] to-[#6063ee] px-10 py-4 text-lg font-bold text-[#0f00a4] transition-opacity hover:opacity-90 sm:w-auto"
                to="/login"
              >
                Enter the Stream
              </Link>
              <a
                className="w-full rounded-full border border-[#40485d]/40 px-10 py-4 text-lg font-bold text-[#dee5ff] transition-colors hover:bg-white/5 sm:w-auto"
                href="#experience"
              >
                Learn More
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
              The Experience
            </span>
            <h2 className="mb-4 text-4xl font-bold text-[#dee5ff] md:text-5xl [font-family:_'Plus_Jakarta_Sans',sans-serif]">
              Crafted with Intention
            </h2>
            <div className="mx-auto h-1 w-24 rounded-full bg-[#6063ee]" />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
            <div className="group relative flex min-h-[400px] flex-col justify-between overflow-hidden rounded-2xl bg-[#091328] p-8 md:col-span-8">
              <div className="absolute right-0 top-0 h-full w-1/2 opacity-30 transition-opacity group-hover:opacity-50">
                <img
                  className="h-full w-full object-cover"
                  alt="minimalist dark abstract 3D shapes with soft blue glow and architectural shadows"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1AM22-1mnqatumYnbjcoZuSi-JGYFrzxuUcYbQVyVGVk1DfeaJTMUcVlQ8So5RAVLW6V_YzpMq5z_q86G08tW-djpfMOYGUbyQYfqLZFHDthK6rOdhv8DRT500Dw-n852nWguhzzxjF5Xv7kJHCqhU3ydOzjG9YI4ztz5ulGsxPI8tG3eaW5-gzfKKJOFoEmychOa5MGFkXHEWWaAk9nmwm728K6cmXyNvf2qJNIsbJfrttQDFUl0eUxOr7KZtcmLX0vOw4dl-vI"
                />
              </div>
              <div className="relative z-10">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(31,43,73,0.6)] backdrop-blur-md">
                  <span className="material-symbols-outlined text-[#a3a6ff]">
                    auto_awesome
                  </span>
                </div>
                <h3 className="mb-4 text-3xl font-bold [font-family:_'Plus_Jakarta_Sans',sans-serif]">
                  Luminous Depth
                </h3>
                <p className="max-w-md leading-relaxed text-[#a3aac4] [font-family:_'Inter',sans-serif]">
                  Treating the interface as high-end editorial. No rigid grid lines,
                  only tonal layering that makes every message feel essential and
                  visually distinct.
                </p>
              </div>
              <div className="relative z-10 mt-8 flex gap-2">
                <span className="rounded-sm bg-[#49339d]/40 px-4 py-1 text-xs font-semibold text-[#d4c9ff]">
                  Adaptive UI
                </span>
                <span className="rounded-sm bg-[#49339d]/40 px-4 py-1 text-xs font-semibold text-[#d4c9ff]">
                  Tonal Contrast
                </span>
              </div>
            </div>

            <div className="flex min-h-[400px] flex-col justify-between rounded-2xl bg-[#141f38] p-8 md:col-span-4">
              <div>
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(31,43,73,0.6)] backdrop-blur-md">
                  <span className="material-symbols-outlined text-[#a3a6ff]">
                    verified_user
                  </span>
                </div>
                <h3 className="mb-4 text-2xl font-bold [font-family:_'Plus_Jakarta_Sans',sans-serif]">
                  Encrypted Sanctuary
                </h3>
                <p className="leading-relaxed text-[#a3aac4] [font-family:_'Inter',sans-serif]">
                  Privacy isn't a feature; it's the foundation. Every stream is
                  end-to-end encrypted within our digital sanctuary.
                </p>
              </div>
              <div className="mt-8 flex h-32 w-full items-center justify-center overflow-hidden rounded-2xl bg-[#0f1930]">
                <div className="flex items-center gap-3 rounded-full bg-[rgba(31,43,73,0.6)] px-4 py-3 backdrop-blur-md">
                  <span className="material-symbols-outlined text-green-400" style={{ fontVariationSettings: "'FILL' 1" }}>
                    lock
                  </span>
                  <span className="font-mono text-xs opacity-60">AES-256 SECURED</span>
                </div>
              </div>
            </div>

            <div className="relative flex min-h-[350px] flex-col justify-center overflow-hidden rounded-2xl bg-[#0f1930] p-8 text-center md:col-span-5">
              <div className="absolute inset-0 opacity-10">
                <img
                  className="h-full w-full object-cover"
                  alt="abstract tech circuitry lines in bright neon blue on dark background"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9uXwXWxJan5ytNO5od9joGR598wg1i9vz6SBI_jhrDWDyXRSyBCHVvQcZIlf-ZGeJrCDcxvdYHUPQY4rN9BU9-AqFqbCxYboltU2lUt7HmT1LrB5iDLg90InE_y7S453Z9M3ZAeXsX_ztC6jsLuPxpmcGgpKIXw6zBn-M7g1h7wshEtutFfmqGoCMjxTwBJl379L-yHsJlfMAxNd1My2KsTPbfBidgB8mrQsrpCIWTR5bVXJh_mPuNzWUZ9WeC_u35UNWmN1Q1Z8"
                />
              </div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-[#a3a6ff] to-[#6063ee] shadow-lg shadow-[#a3a6ff]/20">
                  <span
                    className="material-symbols-outlined text-3xl text-[#0f00a4]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    bolt
                  </span>
                </div>
                <h3 className="mb-4 text-2xl font-bold [font-family:_'Plus_Jakarta_Sans',sans-serif]">
                  Real-time Pulse
                </h3>
                <p className="mx-auto max-w-xs text-[#a3aac4] [font-family:_'Inter',sans-serif]">
                  Experience zero-latency interactions. Our global stream keeps your
                  community in perfect sync, across every device.
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
                Live Communities
              </span>
              <h2 className="mb-4 text-4xl font-bold text-[#dee5ff] md:text-5xl [font-family:_'Plus_Jakarta_Sans',sans-serif]">
                Popular Rooms
              </h2>
              <div className="mx-auto h-1 w-24 rounded-full bg-[#6063ee]" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredRooms.map((room) => (
                <div key={room._id} className="relative group overflow-hidden bg-gradient-to-b from-[#091328] to-[#060e20] p-8 rounded-2xl border border-[#40485d]/10 hover:border-[#a3a6ff]/30 transition-all duration-300">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#141f38] flex items-center justify-center text-[#a3a6ff]">
                      <span className="material-symbols-outlined text-2xl">rocket_launch</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-[#dee5ff] group-hover:text-[#a3a6ff] transition-colors">{room.name}</h4>
                      <span className="text-[10px] text-[#a3aac4] uppercase tracking-widest">Public Space</span>
                    </div>
                  </div>
                  <p className="text-sm text-[#a3aac4] mb-8 line-clamp-2 min-h-[40px] leading-relaxed">
                    {room.description || "Join this community to start sharing moments and chatting with members."}
                  </p>
                  <Link to="/login" className="w-full flex items-center justify-center py-4 bg-[#192540] hover:bg-[#a3a6ff] hover:text-[#0a0081] text-[#dee5ff] rounded-xl text-xs font-bold uppercase tracking-widest transition-all">
                    Step Inside
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="px-6 py-24">
          <div className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl border border-[#40485d]/10 bg-[rgba(31,43,73,0.6)] p-12 text-center backdrop-blur-md">
            <div className="absolute left-0 top-0 h-32 w-32 bg-[#a3a6ff]/20 blur-[100px]" />
            <div className="absolute bottom-0 right-0 h-32 w-32 bg-[#a28efc]/20 blur-[100px]" />
            <h2 className="mb-8 text-3xl font-bold md:text-5xl [font-family:_'Plus_Jakarta_Sans',sans-serif]">
              Ready to evolve your conversation?
            </h2>
            <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-[#a3aac4] [font-family:_'Inter',sans-serif]">
              Join a community of modern thinkers and creators. Step into the stream today.
            </p>
            <Link
              className="rounded-full bg-gradient-to-r from-[#a3a6ff] to-[#6063ee] px-12 py-5 text-xl font-bold text-[#0f00a4] transition-transform active:scale-95"
              to="/login"
            >
              Enter the Stream
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}

export default LandingPage

