import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const INTERESTS = [
  'Stargazing', 'Cooking together', 'Long walks', 'Movie nights',
  'Dancing', 'Reading', 'Traveling', 'Music', 'Art', 'Hiking',
]

export default function Dashboard() {
  const [name, setName] = useState('')
  const [interest, setInterest] = useState('')
  const [touched, setTouched] = useState({ name: false, interest: false })
  const navigate = useNavigate()

  const nameError = touched.name && !name.trim()
  const interestError = touched.interest && !interest

  function handleSubmit(e) {
    e.preventDefault()
    setTouched({ name: true, interest: true })
    if (!name.trim() || !interest) return
    navigate(`/match/${encodeURIComponent(name.trim())}/${encodeURIComponent(interest)}`)
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-rose-950 flex items-center justify-center px-4">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-pink-600/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-rose-500/20 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-600/10 blur-2xl" />

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <span className="text-5xl">💘</span>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Loverboy <span className="text-pink-400">AI</span>
          </h1>
          <p className="mt-2 text-rose-300/80 text-sm tracking-widest uppercase font-medium">
            Send ur perfect valentines card
          </p>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-rose-800/50 bg-white/5 backdrop-blur-md p-8 shadow-2xl shadow-rose-950/60"
        >
          <p className="mb-6 text-center text-rose-200/70 text-sm leading-relaxed">
            Tell us a little about yourself and we'll create your love profile ✨
          </p>

          {/* Name field */}
          <div className="mb-5">
            <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-rose-200">
              Your Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              onBlur={() => setTouched(t => ({ ...t, name: true }))}
              placeholder="e.g. Romeo"
              className={`w-full rounded-xl border px-4 py-3 text-white bg-white/10 placeholder-rose-300/40 outline-none transition focus:ring-2 ${
                nameError
                  ? 'border-red-400 focus:ring-red-400/40'
                  : 'border-rose-700/50 focus:border-pink-500 focus:ring-pink-500/30'
              }`}
            />
            {nameError && (
              <p className="mt-1.5 text-xs text-red-400">Please enter your name.</p>
            )}
          </div>

          {/* Interest selector */}
          <div className="mb-7">
            <label className="mb-2 block text-sm font-semibold text-rose-200">
              Your Favourite Interest
            </label>
            <div className="grid grid-cols-2 gap-2">
              {INTERESTS.map(item => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setInterest(item)
                    setTouched(t => ({ ...t, interest: true }))
                  }}
                  className={`rounded-xl border px-3 py-2 text-sm font-medium transition-all duration-150 ${
                    interest === item
                      ? 'border-pink-400 bg-pink-500/30 text-pink-200 shadow-lg shadow-pink-500/20'
                      : 'border-rose-800/40 bg-white/5 text-rose-300/70 hover:border-rose-600 hover:bg-white/10 hover:text-rose-200'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
            {interestError && (
              <p className="mt-2 text-xs text-red-400">Please pick an interest.</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-pink-600/30 transition-all hover:shadow-pink-600/50 hover:scale-[1.02] active:scale-100"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Create My Love Profile
              <span className="text-lg">💕</span>
            </span>
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-fuchsia-500 to-pink-500 transition-transform duration-300 group-hover:translate-x-0" />
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-rose-400/50">
          Made with love, just for you 🌹
        </p>
      </div>
    </main>
  )
}
