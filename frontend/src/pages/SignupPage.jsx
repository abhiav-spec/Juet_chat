import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authTranslations } from '../locales/auth'
import { useLanguage } from '../hooks/useLanguage'

function SignupPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: 'other',
    location: '',
    about: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { language, setLanguage } = useLanguage()
  const t = authTranslations[language] || authTranslations['en']

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSignup = async (event) => {
    event.preventDefault()
    setErrorMessage('')

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Password and confirm password must match.')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`${apiBaseUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          gender: formData.gender,
          location: formData.location,
          about: formData.about
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create account')
      }

      localStorage.setItem('pendingVerificationEmail', formData.email)

      navigate('/verify-email', {
        state: {
          email: formData.email,
          devOtp: data.devOtp || '',
        },
      })
    } catch (error) {
      setErrorMessage(error.message || 'Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#060e20] text-[#dee5ff] [font-family:_'Inter',sans-serif] relative">
      <Link to="/" className="absolute top-6 left-6 md:top-8 md:left-8 z-[100] flex items-center gap-2 text-[#a3aac4] hover:text-[#a3a6ff] transition-all group px-4 py-2 rounded-full border border-transparent hover:border-[#a3a6ff]/20 bg-[#141f38]/40 md:bg-transparent md:hover:bg-[#141f38]/40 backdrop-blur-sm">
        <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
        <span className="text-xs font-bold uppercase tracking-widest px-1">{t.backHome}</span>
      </Link>

      <div className="absolute top-6 right-6 md:top-8 md:right-8 z-[100]">
        <div className="relative group">
          <button className="flex items-center gap-1 text-[11px] uppercase font-bold tracking-[0.2em] text-[#a3aac4] hover:text-[#dee5ff] transition-colors px-3 py-2 border border-[#40485d]/20 hover:border-[#a3a6ff]/20 rounded-full bg-[#141f38]/40 backdrop-blur-sm">
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
      </div>
      <main className="grid min-h-screen grid-cols-1 lg:grid-cols-12">
        <section className="relative hidden overflow-hidden p-16 lg:col-span-7 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 z-0">
            <img
              alt="Cinematic Background"
              className="w-full h-full object-cover opacity-30 mix-blend-luminosity"
              src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=2070"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#000000] via-[#060e20]/80 to-[#060e20]" />
          </div>

          <div className="relative z-10">
            <h1 className="mb-4 text-4xl font-black italic tracking-tighter text-[#a3a6ff] [font-family:_'Plus_Jakarta_Sans',sans-serif]">
              {t.bolChal}
            </h1>
            <p className="max-w-xl text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tighter text-[#dee5ff] [font-family:_'Plus_Jakarta_Sans',sans-serif] mb-12">
              {t.heroSubtitle.split('Hero')[0]}<span className="text-[#9396ff]">Hero</span>{t.heroSubtitle.split('Hero')[1]}
            </p>
          </div>


        </section>

        <section className="col-span-1 flex items-center justify-center bg-[#060e20] p-6 lg:col-span-5 lg:p-12">
          <div className="w-full max-w-md">
            <header className="mb-10 text-center lg:text-left">
              <img src="/logo.png" alt="BolChal Logo" className="w-16 h-16 rounded-2xl object-cover shadow-xl shadow-[#a3a6ff]/20 mb-8 mx-auto lg:ml-0" />
              <h1 className="font-extrabold text-4xl tracking-tight italic text-[#a3a6ff] mb-2 [font-family:_'Plus_Jakarta_Sans',sans-serif]">
                {t.bolChal}
              </h1>
              <h2 className="text-3xl font-bold text-[#dee5ff] mb-2 [font-family:_'Plus_Jakarta_Sans',sans-serif]">
                {t.signup.title}
              </h2>
              <p className="text-[#a3aac4] text-sm font-medium">
                {t.signup.subtitle}
              </p>
            </header>

            <div className="rounded-2xl p-6 md:p-12 shadow-[0px_12px_32px_rgba(25,37,64,0.08)] bg-[rgba(31,43,73,0.6)] backdrop-blur-md border border-[#40485d]/20 h-auto max-h-[70vh] md:max-h-none overflow-y-auto no-scrollbar">
              <form className="space-y-6" onSubmit={handleSignup}>
                <div className="space-y-2">
                  <label className="ml-4 block text-sm font-semibold text-[#a3aac4]" htmlFor="username">
                    {t.signup.usernameLabel}
                  </label>
                  <div className="relative flex items-center border border-[#40485d]/20 bg-[#192540] rounded-full group transition-all duration-300">
                    <span className="material-symbols-outlined absolute left-5 text-[#a3aac4] group-focus-within:text-[#a3a6ff] transition-colors">
                      person
                    </span>
                    <input
                      className="w-full bg-transparent border-none py-4 pl-14 pr-6 rounded-full text-[#dee5ff] placeholder:text-[#6d758c] focus:ring-2 focus:ring-[#a3a6ff]/40 shadow-inner transition-all [font-family:_'Inter',sans-serif]"
                      id="username"
                      name="username"
                      onChange={handleChange}
                      placeholder={t.signup.usernamePlaceholder}
                      type="text"
                      value={formData.username}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="ml-4 block text-sm font-semibold text-[#a3aac4]" htmlFor="email">
                    {t.login.emailLabel}
                  </label>
                  <div className="relative flex items-center border border-[#40485d]/20 bg-[#192540] rounded-full group transition-all duration-300">
                    <span className="material-symbols-outlined absolute left-5 text-[#a3aac4] group-focus-within:text-[#a3a6ff] transition-colors">
                      mail
                    </span>
                    <input
                      className="w-full bg-transparent border-none py-4 pl-14 pr-6 rounded-full text-[#dee5ff] placeholder:text-[#6d758c] focus:ring-2 focus:ring-[#a3a6ff]/40 shadow-inner transition-all [font-family:_'Inter',sans-serif]"
                      id="email"
                      name="email"
                      onChange={handleChange}
                      placeholder={t.login.emailPlaceholder}
                      type="email"
                      value={formData.email}
                    />
                  </div>
                </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="ml-4 block text-sm font-semibold text-[#a3aac4]" htmlFor="gender">
                        {t.signup.genderLabel}
                      </label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-xl text-[#a3aac4]">
                          wc
                        </span>
                        <select
                          className="w-full appearance-none rounded-full border border-[#40485d]/20 bg-[#192540] py-4 pl-14 pr-10 text-[#dee5ff] outline-none transition-all focus:ring-2 focus:ring-[#a3a6ff]/40"
                          id="gender"
                          name="gender"
                          onChange={handleChange}
                          value={formData.gender}
                        >
                          <option value="male">{t.signup.genderMale}</option>
                          <option value="female">{t.signup.genderFemale}</option>
                          <option value="other">{t.signup.genderOther}</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-[#a3aac4] pointer-events-none">
                          expand_more
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="ml-4 block text-sm font-semibold text-[#a3aac4]" htmlFor="location">
                        {t.signup.locationLabel}
                      </label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-xl text-[#a3aac4]">
                          location_on
                        </span>
                        <input
                          className="w-full rounded-full border border-[#40485d]/20 bg-[#192540] py-4 pl-14 pr-6 text-[#dee5ff] outline-none transition-all placeholder:text-[#6d758c] focus:ring-2 focus:ring-[#a3a6ff]/40"
                          id="location"
                          name="location"
                          onChange={handleChange}
                          placeholder={t.signup.locationPlaceholder}
                          type="text"
                          value={formData.location}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="ml-4 block text-sm font-semibold text-[#a3aac4]" htmlFor="about">
                      {t.signup.aboutLabel}
                    </label>
                    <div className="relative">
                      <textarea
                        className="w-full rounded-2xl border border-[#40485d]/20 bg-[#192540] py-4 px-6 text-[#dee5ff] outline-none transition-all placeholder:text-[#6d758c] focus:ring-2 focus:ring-[#a3a6ff]/40 min-h-[100px] resize-none"
                        id="about"
                        name="about"
                        onChange={handleChange}
                        placeholder={t.signup.aboutPlaceholder}
                        value={formData.about}
                      />
                    </div>
                  </div>

                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="ml-4 block text-sm font-semibold text-[#a3aac4]" htmlFor="password">
                      {t.login.passwordLabel}
                    </label>
                    <div className="relative flex items-center border border-[#40485d]/20 bg-[#192540] rounded-full group transition-all duration-300">
                      <span className="material-symbols-outlined absolute left-5 text-[#a3aac4] group-focus-within:text-[#a3a6ff] transition-colors">
                        lock
                      </span>
                      <input
                        className="w-full bg-transparent border-none py-4 pl-14 pr-12 rounded-full text-[#dee5ff] placeholder:text-[#6d758c] focus:ring-2 focus:ring-[#a3a6ff]/40 shadow-inner transition-all [font-family:_'Inter',sans-serif]"
                        id="password"
                        name="password"
                        onChange={handleChange}
                        placeholder={t.login.passwordPlaceholder}
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
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

                  <div className="space-y-2">
                    <label className="ml-4 block text-sm font-semibold text-[#a3aac4]" htmlFor="confirmPassword">
                      {t.signup.confirmPasswordLabel}
                    </label>
                    <div className="relative flex items-center border border-[#40485d]/20 bg-[#192540] rounded-full group transition-all duration-300">
                      <span className="material-symbols-outlined absolute left-5 text-[#a3aac4] group-focus-within:text-[#a3a6ff] transition-colors">
                        lock
                      </span>
                      <input
                        className="w-full bg-transparent border-none py-4 pl-14 pr-12 rounded-full text-[#dee5ff] placeholder:text-[#6d758c] focus:ring-2 focus:ring-[#a3a6ff]/40 shadow-inner transition-all [font-family:_'Inter',sans-serif]"
                        id="confirmPassword"
                        name="confirmPassword"
                        onChange={handleChange}
                        placeholder={t.login.passwordPlaceholder}
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                      />
                      <button
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-[#a3aac4] hover:text-[#dee5ff] transition-colors"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {showConfirmPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
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
                    {isLoading ? t.signup.loading : t.signup.button}
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
                    {t.signup.hasAccount}
                    <Link className="ml-1 font-bold text-[#a3a6ff] hover:underline" to="/login">
                      {t.signup.logIn}
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
          </div>
        </section>
      </main>

      <div className="pointer-events-none fixed right-[-10%] top-[-10%] h-[40%] w-[40%] rounded-full bg-[#6063ee] opacity-5 blur-[120px]" />
      <div className="pointer-events-none fixed bottom-[-10%] left-[-5%] h-[30%] w-[30%] rounded-full bg-[#49339d] opacity-10 blur-[100px]" />
    </div>
  )
}

export default SignupPage
