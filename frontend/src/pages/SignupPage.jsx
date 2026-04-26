import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

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

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
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
    <div className="min-h-screen overflow-x-hidden bg-[#060e20] text-[#dee5ff] [font-family:_'Inter',sans-serif]">
      <Link to="/" className="fixed top-8 left-8 z-[100] flex items-center gap-2 text-[#a3aac4] hover:text-[#a3a6ff] transition-all group px-4 py-2 rounded-full border border-transparent hover:border-[#a3a6ff]/20 bg-transparent hover:bg-[#141f38]/40 backdrop-blur-sm">
        <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
        <span className="text-xs font-bold uppercase tracking-widest px-1">Back to Home</span>
      </Link>
      <main className="grid min-h-screen grid-cols-1 lg:grid-cols-12">
        <section className="relative hidden overflow-hidden p-16 lg:col-span-7 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 z-0">
            <img
              alt="Cinematic Background"
              className="h-full w-full object-cover opacity-40 mix-blend-luminosity"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXN8scYnwVV-yMtuPhx9RZmCL8-Y8fyUdwPRs5jZuT85jrxIiGw5WuID0grPyNmdQRZ8afNms2bV7_80w2uTQp_n8zG_P0SZjQJ7qnn05LpzhF3GJvFk8DDn9Bfzceg5TBPsrvHiNnfm5UlXhg-Go-72342VKkQCrBm55jVtpLFc-TU3-eind3hYo6KAZ6ENi_1-mx3pprUl-zTgY8EVqnoNbOdV1nQ90Ntgirw1CbgcvPFagAhoUWP9n9W3AeaXFKtRhONEIGg2c"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#000000] via-transparent to-transparent" />
          </div>

          <div className="relative z-10">
            <h1 className="mb-4 text-4xl font-black italic tracking-tighter text-[#a3a6ff] [font-family:_'Plus_Jakarta_Sans',sans-serif]">
              The Cinematic Stream
            </h1>
            <p className="max-w-xl text-6xl font-bold leading-[1.1] tracking-tighter text-[#dee5ff] [font-family:_'Plus_Jakarta_Sans',sans-serif]">
              Where Every <span className="text-[#9396ff]">Conversation</span> is the Hero.
            </p>
          </div>

          <div className="relative z-10 flex gap-12">
            <div className="flex flex-col gap-2">
              <span className="text-3xl font-extrabold text-[#dee5ff] [font-family:_'Plus_Jakarta_Sans',sans-serif]">
                12M+
              </span>
              <span className="text-sm uppercase tracking-widest text-[#a3aac4] [font-family:_'Inter',sans-serif]">
                Active Users
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-3xl font-extrabold text-[#dee5ff] [font-family:_'Plus_Jakarta_Sans',sans-serif]">
                50k+
              </span>
              <span className="text-sm uppercase tracking-widest text-[#a3aac4] [font-family:_'Inter',sans-serif]">
                Luminous Rooms
              </span>
            </div>
          </div>
        </section>

        <section className="col-span-1 flex items-center justify-center bg-[#060e20] p-6 lg:col-span-5 lg:p-12">
          <div className="w-full max-w-md">
            <div className="mb-10 flex flex-col items-center text-center lg:items-start lg:text-left">
              <div className="mb-6 lg:hidden">
                <span className="text-2xl font-black italic text-[#a3a6ff] [font-family:_'Plus_Jakarta_Sans',sans-serif]">
                  CS
                </span>
              </div>
              <h2 className="mb-2 text-3xl font-extrabold tracking-tight text-[#dee5ff] [font-family:_'Plus_Jakarta_Sans',sans-serif]">
                Create Account
              </h2>
              <p className="text-[#a3aac4]">Step into the sanctuary of modern connection.</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="ml-4 block text-sm font-semibold text-[#a3aac4]" htmlFor="username">
                  Username
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-xl text-[#a3aac4]">
                    person
                  </span>
                  <input
                    className="w-full rounded-full border border-[#40485d]/20 bg-[#192540] py-4 pl-14 pr-6 text-[#dee5ff] outline-none transition-all placeholder:text-[#6d758c] focus:ring-2 focus:ring-[#a3a6ff]/40"
                    id="username"
                    name="username"
                    onChange={handleChange}
                    placeholder="alex_rivera"
                    type="text"
                    value={formData.username}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="ml-4 block text-sm font-semibold text-[#a3aac4]" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-xl text-[#a3aac4]">
                    mail
                  </span>
                  <input
                    className="w-full rounded-full border border-[#40485d]/20 bg-[#192540] py-4 pl-14 pr-6 text-[#dee5ff] outline-none transition-all placeholder:text-[#6d758c] focus:ring-2 focus:ring-[#a3a6ff]/40"
                    id="email"
                    name="email"
                    onChange={handleChange}
                    placeholder="alex@stream.com"
                    type="email"
                    value={formData.email}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="ml-4 block text-sm font-semibold text-[#a3aac4]" htmlFor="gender">
                    Gender
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
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-[#a3aac4] pointer-events-none">
                      expand_more
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="ml-4 block text-sm font-semibold text-[#a3aac4]" htmlFor="location">
                    Location
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
                      placeholder="City, Country"
                      type="text"
                      value={formData.location}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="ml-4 block text-sm font-semibold text-[#a3aac4]" htmlFor="about">
                  About Me
                </label>
                <div className="relative">
                  <textarea
                    className="w-full rounded-2xl border border-[#40485d]/20 bg-[#192540] py-4 px-6 text-[#dee5ff] outline-none transition-all placeholder:text-[#6d758c] focus:ring-2 focus:ring-[#a3a6ff]/40 min-h-[100px] resize-none"
                    id="about"
                    name="about"
                    onChange={handleChange}
                    placeholder="Tell us a bit about yourself..."
                    value={formData.about}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="ml-4 block text-sm font-semibold text-[#a3aac4]" htmlFor="password">
                    Password
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-xl text-[#a3aac4]">
                      lock
                    </span>
                    <input
                      className="w-full rounded-full border border-[#40485d]/20 bg-[#192540] py-4 pl-14 pr-12 text-[#dee5ff] outline-none transition-all placeholder:text-[#6d758c] focus:ring-2 focus:ring-[#a3a6ff]/40"
                      id="password"
                      name="password"
                      onChange={handleChange}
                      placeholder="••••••••"
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
                  <label className="ml-4 block text-sm font-semibold text-[#a3aac4]" htmlFor="confirm-password">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-xl text-[#a3aac4]">
                      verified_user
                    </span>
                    <input
                      className="w-full rounded-full border border-[#40485d]/20 bg-[#192540] py-4 pl-14 pr-12 text-[#dee5ff] outline-none transition-all placeholder:text-[#6d758c] focus:ring-2 focus:ring-[#a3a6ff]/40"
                      id="confirm-password"
                      name="confirmPassword"
                      onChange={handleChange}
                      placeholder="••••••••"
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
                  className="w-full rounded-full bg-gradient-to-r from-[#a3a6ff] to-[#6063ee] py-5 text-sm font-extrabold uppercase tracking-widest text-[#000000] shadow-lg shadow-[#6063ee]/20 transition-all hover:scale-[1.02] active:scale-95 [font-family:_'Plus_Jakarta_Sans',sans-serif]"
                  disabled={isLoading}
                  type="submit"
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>

              <div className="mt-8 space-y-6 text-center">
                <div className="flex items-center gap-4 text-xs uppercase tracking-widest text-[#6d758c]">
                  <div className="h-px w-full bg-[#40485d]/30" />
                  <span>Or</span>
                  <div className="h-px w-full bg-[#40485d]/30" />
                </div>

                <button className="flex w-full items-center justify-center gap-3 rounded-full border border-[#40485d]/10 bg-[#141f38] py-4 transition-all hover:bg-[#1f2b49] hover:border-[#a3a6ff]/30 shadow-lg shadow-black/20" type="button">
                  <img
                    alt="Google"
                    className="h-5 w-5"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhU15sdn7QO6dsExyXPm52kG8XXbXVSRMWv54pQWx16bv2dFIrgERWwYa46f7UherTrOJlpMlPv8YgcBLODSQYLmf9-mrAXDY9Mu-LOFRZvPN02fAKc_y4V9_TzeTHjwVRMsGwAw8JemLFw1aVplvsD2uf-FfzLguaQrjWTZ1XQ9P71V3slAum71bdQUXQseh3pKlUzm5U6BXGkO-zjLY7z-gEi0wvp9_UDC5g6h2YV-mpR9QoO6dpNS6G1EsO-u8OfbTxJKntsGs"
                  />
                  <span className="text-sm font-bold tracking-tight text-[#dee5ff]">Continue with Google</span>
                </button>

                <p className="text-sm text-[#a3aac4]">
                  Already part of the stream?
                  <Link className="ml-1 font-bold text-[#a3a6ff] hover:underline" to="/login">
                    Log In
                  </Link>
                </p>
              </div>
            </form>

            <div className="mt-12 flex justify-center gap-6 text-[10px] uppercase tracking-[0.2em] text-[#40485d]">
              <a className="transition-colors hover:text-[#dee5ff]" href="#">
                Privacy
              </a>
              <a className="transition-colors hover:text-[#dee5ff]" href="#">
                Terms
              </a>
              <a className="transition-colors hover:text-[#dee5ff]" href="#">
                Support
              </a>
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
