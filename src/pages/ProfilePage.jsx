import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'

const HEARTS = ['💖', '💗', '💓', '💞', '💕', '❤️', '🩷', '💘']

const NO_LABELS = [
  'No 🙅', 'Are you sure?', 'Really??', 'Think again…', 'Pleeeease?',
  'Last chance!', 'You monster 😭', 'Fine… 💔',
]

export default function ProfilePage() {
  const { name, interest } = useParams()
  const decodedName = decodeURIComponent(name ?? '')
  const decodedInterest = decodeURIComponent(interest ?? '')

  const [noCount, setNoCount] = useState(0)
  const [accepted, setAccepted] = useState(false)
  const [hearts, setHearts] = useState([])

  const yesScale = 1 + noCount * 0.3
  const noScale = Math.max(1 - noCount * 0.15, 0.3)
  const noLabel = NO_LABELS[Math.min(noCount, NO_LABELS.length - 1)]

  function handleNo() {
    setNoCount(n => n + 1)
  }

  function handleYes() {
    setAccepted(true)
    const burst = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      emoji: HEARTS[i % HEARTS.length],
      x: 30 + Math.random() * 40,
      delay: Math.random() * 0.6,
      duration: 1.2 + Math.random() * 1,
    }))
    setHearts(burst)
  }

  if (accepted) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-rose-950 flex flex-col items-center justify-center px-4 text-center">
        <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-pink-600/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-rose-500/20 blur-3xl" />

        {hearts.map(h => (
          <span
            key={h.id}
            className="pointer-events-none fixed text-3xl"
            style={{
              left: `${h.x}%`,
              bottom: '-10%',
              animation: `floatUp ${h.duration}s ease-out ${h.delay}s forwards`,
            }}
          >
            {h.emoji}
          </span>
        ))}

        <style>{`
          @keyframes floatUp {
            0%   { transform: translateY(0) scale(1); opacity: 1; }
            100% { transform: translateY(-110vh) scale(1.4); opacity: 0; }
          }
          @keyframes popIn {
            0%   { transform: scale(0.5); opacity: 0; }
            70%  { transform: scale(1.1); }
            100% { transform: scale(1); opacity: 1; }
          }
        `}</style>

        <div style={{ animation: 'popIn 0.6s ease-out forwards' }} className="relative z-10 max-w-sm">
          <div className="text-7xl mb-4">🥰</div>
          <h1 className="text-4xl font-bold text-white sm:text-5xl leading-tight">
            Yesss! {decodedName} said yes!
          </h1>
          <p className="mt-4 text-pink-300 text-lg">
            You two are basically made for each other 💕
          </p>
          <p className="mt-1 text-rose-300/60 text-sm italic">
            especially over {decodedInterest} 🫶
          </p>
          <Link
            to="/"
            className="mt-10 inline-flex items-center gap-2 rounded-2xl bg-white/10 border border-rose-700/50 px-6 py-3 text-sm font-semibold text-rose-200 backdrop-blur-md transition hover:bg-white/20 hover:text-white"
          >
            ← Make another card
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-rose-950 flex flex-col items-center justify-center px-4 text-center">
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-pink-600/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-rose-500/20 blur-3xl" />

      <style>{`
        @keyframes pulse-heart {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.12); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div
        className="relative z-10 w-full max-w-sm"
        style={{ animation: 'fadeSlideUp 0.5s ease-out forwards' }}
      >
        <span
          className="inline-block text-7xl"
          style={{ animation: 'pulse-heart 1.6s ease-in-out infinite' }}
        >
          💝
        </span>

        <div className="mt-5 rounded-3xl border border-rose-800/50 bg-white/5 backdrop-blur-md p-8 shadow-2xl shadow-rose-950/60">
          <p className="text-rose-300/60 text-xs tracking-widest uppercase font-medium mb-3">
            A message for
          </p>

          <h1 className="text-4xl font-bold text-white sm:text-5xl break-words leading-tight">
            {decodedName}
          </h1>

          <p className="mt-2 text-rose-300/50 text-sm italic">
            who loves {decodedInterest}
          </p>

          <div className="my-6 h-px bg-gradient-to-r from-transparent via-pink-500/50 to-transparent" />

          <h1 className="text-2xl font-bold text-pink-200 sm:text-3xl leading-snug">
            Will you be my Valentine? 🫶
          </h1>

          <div className="mt-8 flex items-center justify-center gap-6">
            <button
              onClick={handleYes}
              className="rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 font-bold text-white shadow-lg shadow-pink-600/30 hover:brightness-110 whitespace-nowrap"
              style={{
                transform: `scale(${yesScale})`,
                transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                padding: '0.75rem 1.5rem',
                transformOrigin: 'center',
              }}
            >
              Yes! 💗
            </button>

            <button
              onClick={handleNo}
              className="rounded-2xl border border-rose-700/50 bg-white/5 font-semibold text-rose-300 backdrop-blur-md transition-colors hover:bg-white/10 whitespace-nowrap"
              style={{
                transform: `scale(${noScale})`,
                transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                padding: '0.75rem 1.5rem',
                transformOrigin: 'center',
                opacity: noScale <= 0.3 ? 0.3 : 1,
              }}
            >
              {noLabel}
            </button>
          </div>

          {noCount > 0 && (
            <p className="mt-6 text-rose-300/50 text-xs animate-pulse">
              {noCount >= 7
                ? 'ok fine 💔 (jk say yes!!)'
                : noCount >= 5
                ? 'Just say YES already!! 😭'
                : noCount >= 3
                ? 'The yes button keeps growing… hint hint 👀'
                : "Are you sure about that? 👀"}
            </p>
          )}
        </div>

        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 text-xs text-rose-400/50 hover:text-rose-300 transition"
        >
          ← go back
        </Link>
      </div>
    </main>
  )
}
