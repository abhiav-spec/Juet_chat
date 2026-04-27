import { Link } from 'react-router-dom'

function SupportPage() {
  return (
    <div className="min-h-screen bg-[#060e20] text-[#dee5ff] [font-family:_'Inter',sans-serif]">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-[#a3a6ff]/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#49339d]/10 blur-[100px]" />
      </div>

      <Link to="/signup" className="fixed top-8 left-8 z-[100] flex items-center gap-2 text-[#a3aac4] hover:text-[#a3a6ff] transition-all group px-4 py-2 rounded-full border border-transparent hover:border-[#a3a6ff]/20 bg-transparent hover:bg-[#141f38]/40 backdrop-blur-sm">
        <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
        <span className="text-xs font-bold uppercase tracking-widest px-1">Back</span>
      </Link>

      <main className="relative max-w-4xl mx-auto px-6 py-24 lg:py-32">
        <header className="mb-16">
          <h1 className="text-4xl lg:text-6xl font-black italic tracking-tighter text-[#a3a6ff] hover:scale-[1.01] transition-transform duration-500 [font-family:_'Plus_Jakarta_Sans',sans-serif] mb-6">
            Stream <span className="text-[#dee5ff]">Support.</span>
          </h1>
          <p className="text-[#a3aac4] text-lg max-w-2xl leading-relaxed">
            Encountered a glitch in the stream? Our dedicated support unit is here to help you navigate back to perfect clarity.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {/* FAQ 1 */}
          <div className="p-8 rounded-2xl bg-[#091328]/40 border border-[#40485d]/10 backdrop-blur-md hover:bg-[#141f38]/40 transition-all duration-300">
            <h3 className="text-lg font-bold text-[#dee5ff] mb-3 [font-family:_'Plus_Jakarta_Sans',sans-serif]">Account Recovery</h3>
            <p className="text-sm text-[#a3aac4] leading-relaxed">
              If you lost access to your account, please use the password reset link on the login page or contact us with your registered email.
            </p>
          </div>

          {/* FAQ 2 */}
          <div className="p-8 rounded-2xl bg-[#091328]/40 border border-[#40485d]/10 backdrop-blur-md hover:bg-[#141f38]/40 transition-all duration-300">
            <h3 className="text-lg font-bold text-[#dee5ff] mb-3 [font-family:_'Plus_Jakarta_Sans',sans-serif]">Room Creation Errors</h3>
            <p className="text-sm text-[#a3aac4] leading-relaxed">
              Ensure your room name is unique and doesn't contain restricted characters. If issues persist, try refreshing your session.
            </p>
          </div>

          {/* FAQ 3 */}
          <div className="p-8 rounded-2xl bg-[#091328]/40 border border-[#40485d]/10 backdrop-blur-md hover:bg-[#141f38]/40 transition-all duration-300">
            <h3 className="text-lg font-bold text-[#dee5ff] mb-3 [font-family:_'Plus_Jakarta_Sans',sans-serif]">Real-time Connectivity</h3>
            <p className="text-sm text-[#a3aac4] leading-relaxed">
              Messages not sending? Check your internet connection. Our WebSocket stream requires a stable connection for real-time delivery.
            </p>
          </div>

          {/* FAQ 4 */}
          <div className="p-8 rounded-2xl bg-[#091328]/40 border border-[#40485d]/10 backdrop-blur-md hover:bg-[#141f38]/40 transition-all duration-300">
            <h3 className="text-lg font-bold text-[#dee5ff] mb-3 [font-family:_'Plus_Jakarta_Sans',sans-serif]">Identity Verification</h3>
            <p className="text-sm text-[#a3aac4] leading-relaxed">
              Did not receive your OTP? Check your spam folder or wait 5 minutes before requesting a resend from the verification page.
            </p>
          </div>
        </section>

        <section className="relative p-10 rounded-3xl bg-gradient-to-br from-[#192540] to-[#091328] border border-[#a3a6ff]/20 overflow-hidden shadow-2xl shadow-black/40">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <span className="material-symbols-outlined text-[80px]">contact_support</span>
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl font-black italic text-[#dee5ff] mb-4 [font-family:_'Plus_Jakarta_Sans',sans-serif]">Still need assistance?</h2>
            <p className="text-[#a3aac4] mb-8 max-w-xl">
              Our direct support team is active 24/7. Drop us a digital message and we'll get back to you within 4 cinematic hours.
            </p>
            <a 
              href="mailto:kumarabhinav6649@gmail.com" 
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#a3a6ff] text-[#0f00a4] rounded-full font-black uppercase tracking-widest text-xs hover:scale-[1.05] active:scale-95 transition-all shadow-lg shadow-[#a3a6ff]/20"
            >
              Contact Support
              <span className="material-symbols-outlined">send</span>
            </a>
          </div>
        </section>

        <footer className="mt-24 pt-12 border-t border-[#40485d]/10 text-center">
          <p className="text-[#6d758c] text-sm">Juet Chat © 2026 Cinematic Stream</p>
        </footer>
      </main>
    </div>
  )
}

export default SupportPage
