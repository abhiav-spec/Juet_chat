import { Link } from 'react-router-dom'

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#060e20] text-[#dee5ff] [font-family:_'Inter',sans-serif]">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#192540]/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] rounded-full bg-[#6063ee]/10 blur-[100px]" />
      </div>

      <Link to="/signup" className="fixed top-8 left-8 z-[100] flex items-center gap-2 text-[#a3aac4] hover:text-[#a3a6ff] transition-all group px-4 py-2 rounded-full border border-transparent hover:border-[#a3a6ff]/20 bg-transparent hover:bg-[#141f38]/40 backdrop-blur-sm">
        <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
        <span className="text-xs font-bold uppercase tracking-widest px-1">Back</span>
      </Link>

      <main className="relative max-w-4xl mx-auto px-6 py-24 lg:py-32">
        <header className="mb-16">
          <h1 className="text-4xl lg:text-6xl font-black italic tracking-tighter text-[#a3a6ff] hover:scale-[1.01] transition-transform duration-500 [font-family:_'Plus_Jakarta_Sans',sans-serif] mb-6">
            Privacy <span className="text-[#dee5ff]">Policy.</span>
          </h1>
          <p className="text-[#a3aac4] text-lg max-w-2xl leading-relaxed">
            Your privacy is the foundation of the Cinematic Stream. We protect your data as carefully as we curate our conversations.
          </p>
        </header>

        <section className="space-y-12">
          {/* Section 1 */}
          <div className="group p-8 rounded-2xl bg-[#091328]/40 border border-[#40485d]/10 backdrop-blur-md hover:border-[#a3a6ff]/30 transition-all duration-500">
            <div className="flex items-center gap-4 mb-4">
              <span className="material-symbols-outlined text-[#a3a6ff]">visibility</span>
              <h2 className="text-xl font-bold [font-family:_'Plus_Jakarta_Sans',sans-serif]">Data Collection</h2>
            </div>
            <p className="text-[#a3aac4] leading-relaxed ml-10">
              We collect minimal data necessary for identity and connectivity: your username, email, and elective profile details (gender, location, bio). We do not scrape your conversations for marketing purposes.
            </p>
          </div>

          {/* Section 2 */}
          <div className="group p-8 rounded-2xl bg-[#091328]/40 border border-[#40485d]/10 backdrop-blur-md hover:border-[#a3a6ff]/30 transition-all duration-500">
            <div className="flex items-center gap-4 mb-4">
              <span className="material-symbols-outlined text-[#a3a6ff]">security</span>
              <h2 className="text-xl font-bold [font-family:_'Plus_Jakarta_Sans',sans-serif]">Storage & Security</h2>
            </div>
            <p className="text-[#a3aac4] leading-relaxed ml-10">
              Passwords are encrypted using cryptographic hashes. Sessions and refresh tokens are managed through secure, HTTP-only cookies to prevent unauthorized digital intrusion.
            </p>
          </div>

          {/* Section 3 */}
          <div className="group p-8 rounded-2xl bg-[#091328]/40 border border-[#40485d]/10 backdrop-blur-md hover:border-[#a3a6ff]/30 transition-all duration-500">
            <div className="flex items-center gap-4 mb-4">
              <span className="material-symbols-outlined text-[#a3a6ff]">share</span>
              <h2 className="text-xl font-bold [font-family:_'Plus_Jakarta_Sans',sans-serif]">Zero Sharing Policy</h2>
            </div>
            <p className="text-[#a3aac4] leading-relaxed ml-10">
              The Cinematic Stream does not sell or lease your personal data to advertisers or third-party digital brokers. Your stream remains yours alone.
            </p>
          </div>

          {/* Section 4 */}
          <div className="group p-8 rounded-2xl bg-[#141f38]/40 border border-[#40485d]/20 backdrop-blur-md hover:border-[#a3a6ff]/30 transition-all duration-500">
            <div className="flex items-center gap-4 mb-4">
              <span className="material-symbols-outlined text-amber-500">delete_forever</span>
              <h2 className="text-xl font-bold [font-family:_'Plus_Jakarta_Sans',sans-serif]">The Right to Fade</h2>
            </div>
            <p className="text-[#a3aac4] leading-relaxed ml-10">
              You have the right to disappear. Deleting your account initiates a permanent purge of your identity and credentials from our system archives.
            </p>
          </div>
        </section>

        <footer className="mt-24 pt-12 border-t border-[#40485d]/10 text-center">
          <p className="text-[#6d758c] text-sm mb-6">Last Updated: April 2026</p>
          <Link to="/signup" className="inline-flex items-center gap-2 text-[#dee5ff] font-bold hover:text-[#a3a6ff] transition-colors group">
            Accept and Return
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </Link>
        </footer>
      </main>
    </div>
  )
}

export default PrivacyPage
