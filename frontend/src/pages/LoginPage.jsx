import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiService } from '../services/api.service'
import { authTranslations } from '../locales/auth'
import { useLanguage } from '../hooks/useLanguage'

function LoginPage() {
  const navigate = useNavigate()
  const { language } = useLanguage()
  const t = authTranslations[language] || authTranslations['en']
  const [showPassword, setShowPassword] = useState(false)
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'email') setIdentifier(value)
    if (name === 'password') setPassword(value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')

    if (!identifier.includes('@')) {
      setErrorMessage('Please enter your email address to login.')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: identifier,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      const token = data?.user?.accessToken || data?.accessToken || ''
      if (token) {
        localStorage.setItem('accessToken', token)
      }
      localStorage.removeItem('pendingVerificationEmail')

      navigate('/dashboard')
    } catch (error) {
      setErrorMessage(error.message || 'Unable to login right now.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#000000] p-6 overflow-hidden selection:bg-[#a3a6ff] selection:text-[#0a0081]">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-[#a3a6ff]/10 blur-[120px]" />
        <div className="absolute top-[60%] -right-[5%] w-[35%] h-[35%] rounded-full bg-[#49339d]/20 blur-[100px]" />
      </div>

      <Link to="/" className="fixed top-8 left-8 z-[100] flex items-center gap-2 text-[#a3aac4] hover:text-[#a3a6ff] transition-all group px-4 py-2 rounded-full border border-transparent hover:border-[#a3a6ff]/20 bg-transparent hover:bg-[#141f38]/40 backdrop-blur-sm">
        <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
        <span className="text-xs font-bold uppercase tracking-widest px-1">{t.backHome}</span>
      </Link>

      <main className="relative w-full max-w-[480px]">
        <header className="text-center mb-12">
          <img src="/logo.png" alt="BolChal Logo" className="mx-auto w-16 h-16 rounded-2xl object-cover shadow-xl shadow-[#a3a6ff]/20 mb-8" />
          <h1 className="font-extrabold text-4xl tracking-tight italic text-[#a3a6ff] mb-2 [font-family:_'Plus_Jakarta_Sans',sans-serif]">
            {t.bolChal}
          </h1>
          <h2 className="text-3xl font-bold text-[#dee5ff] mb-2 [font-family:_'Plus_Jakarta_Sans',sans-serif]">
            {t.login.title}
          </h2>
          <p className="text-[#a3aac4] text-sm font-medium">
            {t.login.subtitle}
          </p>
        </header>

        <div className="rounded-2xl p-8 md:p-12 shadow-[0px_12px_32px_rgba(25,37,64,0.08)] bg-[rgba(31,43,73,0.6)] backdrop-blur-md border border-[#40485d]/20">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="ml-4 block text-sm font-semibold text-[#a3aac4]" htmlFor="email">
                {t.login.emailLabel}
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-xl text-[#a3aac4]">
                  mail
                </span>
                <input
                  className="w-full rounded-full border border-[#40485d]/20 bg-[#192540] py-4 pl-14 pr-6 text-[#dee5ff] outline-none transition-all placeholder:text-[#6d758c] focus:ring-2 focus:ring-[#a3a6ff]/40 shadow-inner"
                  id="email"
                  name="email"
                  onChange={handleChange}
                  placeholder={t.login.emailPlaceholder}
                  type="text"
                  value={identifier}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="ml-4 block text-sm font-semibold text-[#a3aac4]" htmlFor="password">
                {t.login.passwordLabel}
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-xl text-[#a3aac4]">
                  lock
                </span>
                <input
                  className="w-full rounded-full border border-[#40485d]/20 bg-[#192540] py-4 pl-14 pr-12 text-[#dee5ff] outline-none transition-all placeholder:text-[#6d758c] focus:ring-2 focus:ring-[#a3a6ff]/40 shadow-inner"
                  id="password"
                  name="password"
                  onChange={handleChange}
                  placeholder={t.login.passwordPlaceholder}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                />
                <button
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-[#a3aac4] hover:text-[#dee5ff] transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {errorMessage && (
              <p className="rounded-xl border border-[#d73357]/40 bg-[#a70138]/20 px-4 py-3 text-sm text-[#ffb2b9]">
                {errorMessage}
              </p>
            )}

            <div className="pt-4">
              <button
                className="w-full rounded-full bg-gradient-to-r from-[#a3a6ff] to-[#6063ee] py-5 text-sm font-extrabold uppercase tracking-widest text-[#000000] shadow-[0_8px_32px_rgba(163,166,255,0.3)] transition-all hover:scale-[1.02] active:scale-95 hover:shadow-[0_12px_48px_rgba(163,166,255,0.4)] [font-family:_'Plus_Jakarta_Sans',sans-serif]"
                disabled={isLoading}
                type="submit"
              >
                {isLoading ? t.login.loading : t.login.button}
              </button>
            </div>

            <div className="mt-8 space-y-6 text-center">
              <div className="flex items-center gap-4 text-xs uppercase tracking-widest text-[#6d758c]">
                <div className="h-px w-full bg-[#40485d]/30" />
                <span>{t.login.or}</span>
                <div className="h-px w-full bg-[#40485d]/30" />
              </div>

              <button className="flex w-full items-center justify-center gap-3 rounded-full border border-[#40485d]/10 bg-[#141f38] py-4 transition-all hover:bg-[#1f2b49] hover:border-[#a3a6ff]/30 shadow-lg shadow-black/20" type="button">
                <img
                  alt="Google"
                  className="h-5 w-5"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhU15sdn7QO6dsExyXPm52kG8XXbXVSRMWv54pQWx16bv2dFIrgERWwYa46f7UherTrOJlpMlPv8YgcBLODSQYLmf9-mrAXDY9Mu-LOFRZvPN02fAKc_y4V9_TzeTHjwVRMsGwAw8JemLFw1aVplvsD2uf-FfzLguaQrjWTZ1XQ9P71V3slAum71bdQUXQseh3pKlUzm5U6BXGkO-zjLY7z-gEi0wvp9_UDC5g6h2YV-mpR9QoO6dpNS6G1EsO-u8OfbTxJKntsGs"
                />
                <span className="text-sm font-bold tracking-tight text-[#dee5ff]">{t.login.google}</span>
              </button>

              <p className="text-sm text-[#a3aac4]">
                {t.login.noAccount}
                <Link className="ml-1 font-bold text-[#a3a6ff] hover:underline" to="/signup">
                  {t.login.signUp}
                </Link>
              </p>
            </div>
          </form>

          <div className="mt-12 flex justify-center gap-6 text-[10px] uppercase tracking-[0.2em] text-[#40485d]">
            <Link className="transition-colors hover:text-[#dee5ff]" to="/privacy">
              {t.footer.privacy}
            </Link>
            <Link className="transition-colors hover:text-[#dee5ff]" to="/terms">
              {t.footer.terms}
            </Link>
            <Link className="transition-colors hover:text-[#dee5ff]" to="/support">
              {t.footer.support}
            </Link>
          </div>
        </div>
      </main>

      <div className="hidden lg:block fixed right-12 bottom-12 max-w-xs">
        <div className="relative p-6 rounded-2xl bg-[rgba(31,43,73,0.6)] backdrop-blur-md border border-[#40485d]/20 overflow-hidden">
          <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#a3a6ff]/20 rounded-full blur-2xl" />
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a3a6ff] mb-3 [font-family:_'Inter',sans-serif]">
            Live Status
          </p>
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                alt="User"
                className="w-10 h-10 rounded-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbbLoG3jtyo8B5vJ329Ccqwz7pW5qDvQlv6cNGR37ZwRJZIyW3ze5CG6z6WbwrIUqFzDjr5Lg8wJiqZoc_RUhRn0QnJRdIAtVNCPMRLINCtUWw0w3e226EalYdCOkstk8oum-Dw3dfMTWQfGA3Vhylhce4sJu8eJ7mWCkD_hDq-wOaHBox77wASXQ3ZUR2SWIOOP5kOYYX5khCRwmvD5U7x3yJWoeSZIrzUAcdinFyxYHpIJp3IQbVZpLcdi1_M9-i_23LpaAVkmY"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#141f38]" />
            </div>
            <div>
              <p className="font-bold text-sm [font-family:_'Plus_Jakarta_Sans',sans-serif]">Alex Rivera</p>
              <p className="text-[#a3aac4] text-[10px] uppercase">12.4k users online</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
