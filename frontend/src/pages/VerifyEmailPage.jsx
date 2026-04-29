import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import { authTranslations } from '../locales/auth'

function VerifyEmailPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const otpLength = 6
  const [email, setEmail] = useState(location.state?.email || localStorage.getItem('pendingVerificationEmail') || '')
  const [code, setCode] = useState(Array.from({ length: otpLength }, () => ''))
  const [resendCountdown, setResendCountdown] = useState(30)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const inputRefs = useRef([])

  const { language } = useLanguage()
  const t = authTranslations[language] || authTranslations['en']

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

  useEffect(() => {
    if (resendCountdown === 0) {
      return undefined
    }

    const timerId = window.setInterval(() => {
      setResendCountdown((currentValue) => Math.max(currentValue - 1, 0))
    }, 1000)

    return () => window.clearInterval(timerId)
  }, [resendCountdown])

  const handleChange = (index, value) => {
    const nextValue = value.replace(/\D/g, '').slice(-1)

    setCode((currentCode) => {
      const nextCode = [...currentCode]
      nextCode[index] = nextValue
      return nextCode
    })

    if (nextValue && index < otpLength - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (event) => {
    event.preventDefault()
    const pastedValue = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, otpLength)

    if (!pastedValue) {
      return
    }

    const nextCode = Array.from({ length: otpLength }, (_, index) => pastedValue[index] ?? '')
    setCode(nextCode)

    const nextEmptyIndex = nextCode.findIndex((digit) => !digit)
    const targetIndex = nextEmptyIndex === -1 ? otpLength - 1 : nextEmptyIndex
    inputRefs.current[targetIndex]?.focus()
  }

  const handleSubmit = (event) => {
    event.preventDefault()
  }

  const submitVerification = async (event) => {
    event.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    const otp = code.join('')

    if (!email) {
      setErrorMessage('Please provide your email address first.')
      return
    }

    if (otp.length !== otpLength) {
      setErrorMessage('Please enter the complete 6-digit OTP.')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`${apiBaseUrl}/api/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, otp }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Verification failed')
      }

      setSuccessMessage('Email verified successfully. Redirecting to login...')
      localStorage.removeItem('pendingVerificationEmail')

      window.setTimeout(() => {
        navigate('/login')
      }, 1000)
    } catch (error) {
      setErrorMessage(error.message || 'Unable to verify email right now.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResend = async () => {
    if (!email) {
      setErrorMessage('Please add your email before resending OTP.')
      return
    }

    setErrorMessage('')
    setSuccessMessage('')
    setIsResending(true)

    try {
      const response = await fetch(`${apiBaseUrl}/api/auth/resend-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend OTP')
      }

      setResendCountdown(30)
      setSuccessMessage('A fresh OTP was sent to your email.')
    } catch (error) {
      setErrorMessage(error.message || 'Unable to resend OTP right now.')
    } finally {
      setIsResending(false)
    }
  }

  const isComplete = code.every(Boolean)

  return (
    <div className="min-h-screen bg-[#060e20] text-[#dee5ff] [font-family:_'Inter',sans-serif]">
      <header className="fixed top-0 z-50 flex w-full items-center justify-between bg-slate-900/50 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link className="rounded-full p-2 transition-all hover:bg-slate-800/50 active:opacity-80" to="/signup">
            <span className="material-symbols-outlined text-indigo-500">arrow_back</span>
          </Link>
          <h1 className="font-['Plus_Jakarta_Sans'] font-bold tracking-tight text-[#dee5ff]">{t.verify.title}</h1>
        </div>
        <div className="text-xl font-black tracking-tighter text-indigo-500 uppercase italic">BolChal</div>
      </header>

      <main className="cinematic-bg flex min-h-screen items-center justify-center px-6 pb-12 pt-20">
        <div className="w-full max-w-lg">
          <div className="relative mb-12 text-center">
            <div className="absolute left-1/2 -top-16 h-48 w-48 -translate-x-1/2 rounded-full bg-[#6063ee]/10 blur-[80px]" />
            <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-xl border border-[#40485d]/20 bg-[#192540] shadow-2xl">
              <span className="material-symbols-outlined text-4xl text-[#a3a6ff]" style={{ fontVariationSettings: "'FILL' 1" }}>
                mark_email_unread
              </span>
            </div>
            <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-[#dee5ff] [font-family:_'Plus_Jakarta_Sans',sans-serif]">
              {t.verify.title}
            </h2>
            <p className="mx-auto max-w-xs leading-relaxed text-[#a3aac4]">
              {t.verify.subtitle}
            </p>
            <p className="mt-3 text-sm text-[#a3a6ff]">{email || '...'}</p>
          </div>

          <div className="glass-card relative overflow-hidden rounded-2xl border border-[#40485d]/10 p-8 shadow-2xl md:p-12">
            <div className="absolute right-0 top-0 p-1">
              <div className="h-32 w-32 rounded-full bg-[#49339d]/10 blur-3xl" />
            </div>

            <form className="relative z-10 space-y-10" onSubmit={submitVerification}>
              <div className="space-y-2">
                <label className="ml-2 block text-xs uppercase tracking-[0.2em] text-[#a3aac4]" htmlFor="verify-email">
                  {t.signup.emailLabel}
                </label>
                <input
                  id="verify-email"
                  className="w-full rounded-xl border border-[#40485d]/20 bg-[#192540] px-4 py-3 text-[#dee5ff] outline-none focus:ring-2 focus:ring-[#a3a6ff]/40"
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="alex@stream.com"
                  type="email"
                  value={email}
                />
              </div>

              <div className="flex justify-between gap-2 md:gap-4" onPaste={handlePaste}>
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={(element) => {
                      inputRefs.current[index] = element
                    }}
                    className="otp-input h-16 w-12 rounded-md border border-[#40485d]/20 bg-[#192540] text-center text-3xl font-bold text-[#a3a6ff] transition-all placeholder:text-[#6d758c] focus:bg-[#1f2b49] md:h-20 md:w-16 [font-family:_'Plus_Jakarta_Sans',sans-serif]"
                    inputMode="numeric"
                    maxLength={1}
                    onChange={(event) => handleChange(index, event.target.value)}
                    onKeyDown={(event) => handleKeyDown(index, event)}
                    placeholder="·"
                    type="text"
                    value={digit}
                  />
                ))}
              </div>

              <button
                className="w-full rounded-full bg-gradient-to-r from-[#a3a6ff] to-[#6063ee] py-5 text-sm font-extrabold uppercase tracking-widest text-[#0f00a4] shadow-lg shadow-[#6063ee]/20 transition-all hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!isComplete || isSubmitting}
                type="submit"
              >
                {isSubmitting ? t.verify.loading : t.verify.button}
              </button>

              {errorMessage && (
                <p className="rounded-xl border border-[#d73357]/40 bg-[#a70138]/20 px-4 py-3 text-sm text-[#ffb2b9]">
                  {errorMessage}
                </p>
              )}

              {successMessage && (
                <p className="rounded-xl border border-[#49339d]/40 bg-[#141f38] px-4 py-3 text-sm text-[#d4c9ff]">
                  {successMessage}
                </p>
              )}
            </form>

            <div className="mt-10 flex flex-col items-center gap-6 border-t border-[#40485d]/10 pt-8">
              <div className="flex items-center gap-2 text-sm text-[#a3aac4]">
                <span>Didn&apos;t receive a code?</span>
                <button
                  className="font-semibold text-[#a3a6ff] underline-offset-4 transition-all hover:underline"
                  onClick={handleResend}
                  type="button"
                  disabled={resendCountdown > 0 || isResending}
                >
                  {isResending ? t.verify.loading : resendCountdown > 0 ? `${t.verify.resend} in ${resendCountdown}s` : t.verify.resend}
                </button>
              </div>

              <button className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-[#a3aac4]/60 transition-colors hover:text-[#dee5ff]" type="button">
                <span className="material-symbols-outlined text-sm">edit</span>
                Change Email
              </button>
            </div>
          </div>

          <div className="mt-12 flex justify-center gap-8 opacity-40">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">shield</span>
              <span className="text-xs">Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">timer</span>
              <span className="text-xs">Valid for 10m</span>
            </div>
          </div>
        </div>
      </main>

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[5%] top-[10%] h-[40%] w-[40%] rounded-full bg-[#a3a6ff]/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] h-[50%] w-[50%] rounded-full bg-[#49339d]/10 blur-[150px]" />
        <div className="absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 opacity-20">
          <img
            alt="abstract flowing mesh gradient texture with deep navy and indigo colors with subtle grain and cinematic lighting"
            className="h-full w-full object-cover mix-blend-overlay grayscale"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBE1bUnlJa7flHk35RG9tQi4o0FfilRvArb5PVaip2gomD6WCCX70paoxEdYWWmgl_u7FWzSctzobcGb5iwpH6urejB5IHQFdh6ev-xqp-mbR0wYNHrbuQJnXGTuo6TVCAA3LMRwqaE6WM2qaBSPMFEVdIaxZLQtGzCs63XyC7LVzgwSV2vagF9T3gjorvJuosWZkTQ5d4ye9UVWd5ObRRB1EbVipQrUl2wrQy3I9sbOuhEYc6OHB-fZp1vtMWPGi7G4cM0x8iDIA4"
          />
        </div>
      </div>
    </div>
  )
}

export default VerifyEmailPage