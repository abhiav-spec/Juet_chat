import { Link } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import { legalTranslations } from '../locales/legal'

function SupportPage() {
  const { language } = useLanguage()
  const t = legalTranslations[language] || legalTranslations['en']

  return (
    <div className="min-h-screen bg-[#060e20] text-[#dee5ff] [font-family:_'Inter',sans-serif]">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-[#a3a6ff]/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#49339d]/10 blur-[100px]" />
      </div>

      <Link to="/signup" className="absolute top-6 left-6 md:top-8 md:left-8 z-[100] flex items-center gap-2 text-[#a3aac4] hover:text-[#a3a6ff] transition-all group px-4 py-2 rounded-full border border-transparent hover:border-[#a3a6ff]/20 bg-[#141f38]/40 md:bg-transparent md:hover:bg-[#141f38]/40 backdrop-blur-sm">
        <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
        <span className="text-xs font-bold uppercase tracking-widest px-1">{t.back}</span>
      </Link>

      <main className="relative max-w-4xl mx-auto px-6 py-24 lg:py-32">
        <header className="mb-16">
          <h1 className="text-4xl lg:text-6xl font-black italic tracking-tighter text-[#a3a6ff] hover:scale-[1.01] transition-transform duration-500 [font-family:_'Plus_Jakarta_Sans',sans-serif] mb-6">
            {t.support.title.split(' ')[0]} <span className="text-[#dee5ff]">{t.support.title.split(' ')[1]}</span>
          </h1>
          <p className="text-[#a3aac4] text-lg max-w-2xl leading-relaxed">
            {t.support.subtitle}
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {/* FAQ 1 */}
          <div className="p-8 rounded-2xl bg-[#091328]/40 border border-[#40485d]/10 backdrop-blur-md hover:bg-[#141f38]/40 transition-all duration-300">
            <h3 className="text-lg font-bold text-[#dee5ff] mb-3 [font-family:_'Plus_Jakarta_Sans',sans-serif]">{t.support.faq1Title}</h3>
            <p className="text-sm text-[#a3aac4] leading-relaxed">
              {t.support.faq1Text}
            </p>
          </div>

          {/* FAQ 2 */}
          <div className="p-8 rounded-2xl bg-[#091328]/40 border border-[#40485d]/10 backdrop-blur-md hover:bg-[#141f38]/40 transition-all duration-300">
            <h3 className="text-lg font-bold text-[#dee5ff] mb-3 [font-family:_'Plus_Jakarta_Sans',sans-serif]">{t.support.faq2Title}</h3>
            <p className="text-sm text-[#a3aac4] leading-relaxed">
              {t.support.faq2Text}
            </p>
          </div>

          {/* FAQ 3 */}
          <div className="p-8 rounded-2xl bg-[#091328]/40 border border-[#40485d]/10 backdrop-blur-md hover:bg-[#141f38]/40 transition-all duration-300">
            <h3 className="text-lg font-bold text-[#dee5ff] mb-3 [font-family:_'Plus_Jakarta_Sans',sans-serif]">{t.support.faq3Title}</h3>
            <p className="text-sm text-[#a3aac4] leading-relaxed">
              {t.support.faq3Text}
            </p>
          </div>

          {/* FAQ 4 */}
          <div className="p-8 rounded-2xl bg-[#091328]/40 border border-[#40485d]/10 backdrop-blur-md hover:bg-[#141f38]/40 transition-all duration-300">
            <h3 className="text-lg font-bold text-[#dee5ff] mb-3 [font-family:_'Plus_Jakarta_Sans',sans-serif]">{t.support.faq4Title}</h3>
            <p className="text-sm text-[#a3aac4] leading-relaxed">
              {t.support.faq4Text}
            </p>
          </div>
        </section>

        <section className="relative p-10 rounded-3xl bg-gradient-to-br from-[#192540] to-[#091328] border border-[#a3a6ff]/20 overflow-hidden shadow-2xl shadow-black/40">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <span className="material-symbols-outlined text-[80px]">contact_support</span>
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl font-black italic text-[#dee5ff] mb-4 [font-family:_'Plus_Jakarta_Sans',sans-serif]">{t.support.stillNeedHelp}</h2>
            <p className="text-[#a3aac4] mb-8 max-w-xl">
              {t.support.stillNeedHelpText}
            </p>
            <a 
              href="mailto:kumarabhinav6649@gmail.com?subject=Support%20Request%20-%20BolChal"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#a3a6ff] text-[#0f00a4] rounded-full font-black uppercase tracking-widest text-xs hover:scale-[1.05] active:scale-95 transition-all shadow-lg shadow-[#a3a6ff]/20"
            >
              {t.support.contactButton}
              <span className="material-symbols-outlined">send</span>
            </a>
          </div>
        </section>

        <footer className="mt-24 pt-12 border-t border-[#40485d]/10 text-center">
          <p className="text-[#6d758c] text-sm">BolChal © 2026</p>
        </footer>
      </main>
    </div>
  )
}

export default SupportPage
