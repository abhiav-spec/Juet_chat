import { Link } from 'react-router-dom'

function TermsPage() {
  return (
    <div className="min-h-screen bg-[#060e20] text-[#dee5ff] [font-family:_'Inter',sans-serif]">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#a3a6ff]/10 blur-[120px]" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[35%] h-[35%] rounded-full bg-[#49339d]/20 blur-[100px]" />
      </div>

      <Link to="/signup" className="fixed top-8 left-8 z-[100] flex items-center gap-2 text-[#a3aac4] hover:text-[#a3a6ff] transition-all group px-4 py-2 rounded-full border border-transparent hover:border-[#a3a6ff]/20 bg-transparent hover:bg-[#141f38]/40 backdrop-blur-sm">
        <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
        <span className="text-xs font-bold uppercase tracking-widest px-1">Back</span>
      </Link>

      <main className="relative max-w-4xl mx-auto px-6 py-24 lg:py-32">
        <header className="mb-16">
          <h1 className="text-4xl lg:text-6xl font-black italic tracking-tighter text-[#a3a6ff] hover:scale-[1.01] transition-transform duration-500 [font-family:_'Plus_Jakarta_Sans',sans-serif] mb-6">
            Terms of <span className="text-[#dee5ff]">Service.</span>
          </h1>
          <p className="text-[#a3aac4] text-lg max-w-2xl leading-relaxed">
            Welcome to the Cinematic Stream. Your presence here signifies your agreement to these digital covenants.
          </p>
        </header>

        <section className="space-y-12">
          {/* Section 1 */}
          <div className="group p-8 rounded-2xl bg-[#091328]/40 border border-[#40485d]/10 backdrop-blur-md hover:border-[#a3a6ff]/30 transition-all duration-500">
            <div className="flex items-center gap-4 mb-4">
              <span className="w-10 h-10 rounded-full bg-[#141f38] flex items-center justify-center text-[#a3a6ff] font-bold border border-[#a3a6ff]/20">01</span>
              <h2 className="text-xl font-bold [font-family:_'Plus_Jakarta_Sans',sans-serif]">The Digital Identity</h2>
            </div>
            <p className="text-[#a3aac4] leading-relaxed ml-14">
              Users must provide accurate information during registration. Your identity in the stream is your signature; maintain it with honor and security. You are responsible for all activities conducted under your access token.
            </p>
          </div>

          {/* Section 2 */}
          <div className="group p-8 rounded-2xl bg-[#091328]/40 border border-[#40485d]/10 backdrop-blur-md hover:border-[#a3a6ff]/30 transition-all duration-500">
            <div className="flex items-center gap-4 mb-4">
              <span className="w-10 h-10 rounded-full bg-[#141f38] flex items-center justify-center text-[#a3a6ff] font-bold border border-[#a3a6ff]/20">02</span>
              <h2 className="text-xl font-bold [font-family:_'Plus_Jakarta_Sans',sans-serif]">Content Conduct</h2>
            </div>
            <p className="text-[#a3aac4] leading-relaxed ml-14">
              The stream is a sanctuary for modern conversation. We strictly prohibit harassment, illegal content, and digital toxicity. Every word shared should contribute to the cinematic quality of our community.
            </p>
          </div>

          {/* Section 3 */}
          <div className="group p-8 rounded-2xl bg-[#091328]/40 border border-[#40485d]/10 backdrop-blur-md hover:border-[#a3a6ff]/30 transition-all duration-500">
            <div className="flex items-center gap-4 mb-4">
              <span className="w-10 h-10 rounded-full bg-[#141f38] flex items-center justify-center text-[#a3a6ff] font-bold border border-[#a3a6ff]/20">03</span>
              <h2 className="text-xl font-bold [font-family:_'Plus_Jakarta_Sans',sans-serif]">Data Sovereignty</h2>
            </div>
            <p className="text-[#a3aac4] leading-relaxed ml-14">
              Your data is stored with cinematic precision. By using our service, you acknowledge our right to manage and secure this data to provide a seamless real-time experience across chat rooms.
            </p>
          </div>

          {/* Section 4 */}
          <div className="group p-8 rounded-2xl bg-[#a70138]/5 border border-red-500/10 backdrop-blur-md hover:border-red-500/30 transition-all duration-500">
            <div className="flex items-center gap-4 mb-4">
              <span className="material-symbols-outlined text-red-500">warning</span>
              <h2 className="text-xl font-bold [font-family:_'Plus_Jakarta_Sans',sans-serif] text-[#ffb2b9]">Termination</h2>
            </div>
            <p className="text-[#a3aac4] leading-relaxed ml-10">
              We reserve the right to suspend any stream that disrupts our harmony. Users may also choose to leave the stream by deleting their account, provided all created rooms are cleared first.
            </p>
          </div>
        </section>

        <footer className="mt-24 pt-12 border-t border-[#40485d]/10 text-center">
          <p className="text-[#6d758c] text-sm mb-6">Last Updated: April 2026</p>
          <Link to="/signup" className="inline-flex items-center gap-2 text-[#dee5ff] font-bold hover:text-[#a3a6ff] transition-colors group">
            Accept and Return to Signup
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </Link>
        </footer>
      </main>
    </div>
  )
}

export default TermsPage
