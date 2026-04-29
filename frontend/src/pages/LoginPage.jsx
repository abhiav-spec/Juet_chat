import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function LoginPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

  const handleLogin = async (event) => {
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
        <span className="text-xs font-bold uppercase tracking-widest px-1">Back to Home</span>
      </Link>

      <main className="relative w-full max-w-[480px]">
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#141f38] mb-6 shadow-xl shadow-[#000000]">
            <span className="material-symbols-outlined text-[#a3a6ff] text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              forum
            </span>
          </div>
          <h1 className="font-extrabold text-4xl tracking-tight italic text-[#a3a6ff] mb-2 [font-family:_'Plus_Jakarta_Sans',sans-serif]">
            BolChal
          </h1>
          <p className="text-[#a3aac4] font-medium text-lg">Your digital sanctuary for deep conversation.</p>
        </header>

        <div className="rounded-2xl p-8 md:p-12 shadow-[0px_12px_32px_rgba(25,37,64,0.08)] bg-[rgba(31,43,73,0.6)] backdrop-blur-md border border-[#40485d]/20">
          <form className="space-y-8" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label className="text-sm uppercase tracking-wider text-[#a3aac4] ml-4 font-semibold [font-family:_'Inter',sans-serif]" htmlFor="identifier">
                Username or Email
              </label>
              <div className="relative flex items-center border border-[#40485d]/20 bg-[#192540] rounded-full group transition-all duration-300">
                <span className="material-symbols-outlined absolute left-5 text-[#a3aac4] group-focus-within:text-[#a3a6ff] transition-colors">
                  person
                </span>
                <input
                  className="w-full bg-transparent border-none py-4 pl-14 pr-6 rounded-full text-[#dee5ff] placeholder:text-[#6d758c] focus:ring-0 transition-all [font-family:_'Inter',sans-serif]"
                  id="identifier"
                  name="identifier"
                  onChange={(event) => setIdentifier(event.target.value)}
                  placeholder="alex_rivera@stream.com"
                  type="text"
                  value={identifier}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-4 mr-1">
                <label className="text-sm uppercase tracking-wider text-[#a3aac4] font-semibold [font-family:_'Inter',sans-serif]" htmlFor="password">
                  Password
                </label>
                <Link className="text-xs text-[#a3a6ff] font-semibold hover:text-[#6063ee] transition-colors" to="#">
                  Forgot?
                </Link>
              </div>
              <div className="relative flex items-center border border-[#40485d]/20 bg-[#192540] rounded-full group transition-all duration-300">
                <span className="material-symbols-outlined absolute left-5 text-[#a3aac4] group-focus-within:text-[#a3a6ff] transition-colors">
                  lock
                </span>
                <input
                  className="w-full bg-transparent border-none py-4 pl-14 pr-12 rounded-full text-[#dee5ff] placeholder:text-[#6d758c] focus:ring-0 transition-all [font-family:_'Inter',sans-serif]"
                  id="password"
                  name="password"
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••••••"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                />
                <button
                  className="absolute right-5 text-[#a3aac4] hover:text-[#dee5ff] transition-colors"
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
                className="w-full bg-gradient-to-r from-[#a3a6ff] to-[#6063ee] text-[#0f00a4] font-bold py-4 rounded-full uppercase tracking-widest shadow-lg shadow-[#a3a6ff]/20 hover:scale-[1.02] active:scale-95 transition-all duration-300 font-semibold [font-family:_'Inter',sans-serif]"
                disabled={isLoading}
                type="submit"
              >
                {isLoading ? 'Logging In...' : 'Login to BolChal'}
              </button>
            </div>
          </form>

          <div className="mt-10 pt-10 border-t border-[#40485d]/10 text-center">
            <p className="text-[#a3aac4] text-sm mb-6">Or continue with</p>
              <button className="flex w-full items-center justify-center gap-3 rounded-full border border-[#40485d]/10 bg-[#141f38] py-3.5 transition-all hover:bg-[#1f2b49] hover:border-[#a3a6ff]/30 shadow-lg shadow-black/20" type="button">
                <img
                  alt="Google"
                  className="h-5 w-5"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhU15sdn7QO6dsExyXPm52kG8XXbXVSRMWv54pQWx16bv2dFIrgERWwYa46f7UherTrOJlpMlPv8YgcBLODSQYLmf9-mrAXDY9Mu-LOFRZvPN02fAKc_y4V9_TzeTHjwVRMsGwAw8JemLFw1aVplvsD2uf-FfzLguaQrjWTZ1XQ9P71V3slAum71bdQUXQseh3pKlUzm5U6BXGkO-zjLY7z-gEi0wvp9_UDC5g6h2YV-mpR9QoO6dpNS6G1EsO-u8OfbTxJKntsGs"
                />
                <span className="text-sm font-bold tracking-tight text-[#dee5ff]">Continue with Google</span>
              </button>
          </div>
        </div>

        <footer className="mt-8 text-center">
          <p className="text-[#a3aac4] font-medium">
            New to the stream?
            <Link className="text-[#a3a6ff] font-bold hover:underline underline-offset-4 ml-1 transition-all" to="/signup">
              Create an account
            </Link>
          </p>
          <div className="mt-8 flex justify-center gap-6 text-[10px] uppercase tracking-[0.2em] text-[#40485d]">
            <Link className="transition-colors hover:text-[#dee5ff]" to="/privacy">
              Privacy
            </Link>
            <Link className="transition-colors hover:text-[#dee5ff]" to="/terms">
              Terms
            </Link>
            <Link className="transition-colors hover:text-[#dee5ff]" to="/support">
              Support
            </Link>
          </div>
        </footer>
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
