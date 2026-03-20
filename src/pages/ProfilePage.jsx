import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'

const HEARTS = ['💖', '💗', '💓', '💞', '💕', '❤️', '🩷', '💘']

const NO_LABELS = [
  'No 🙅', 'Are you sure?', 'Really??', 'Think again…', 'Pleeeease?',
  'Last chance!', 'You monster 😭', 'JUST SAY YES 😤',
]

const TOASTS = [
  '⚠️ WARNING: Wrong answer detected',
  '💔 Your heart is making a mistake',
  '🚨 ALERT: Feelings hurt',
  '❌ Error 404: Good decision not found',
  '📢 SAY YES RIGHT NOW',
  '🆘 HELP THIS PERSON NEEDS LOVE',
  '💀 This is NOT the right button',
  '😡 I CANNOT BELIEVE YOU',
  '🔴 CRITICAL: Valentine rejected',
  '📣 HEY. HEY. YES. CLICK YES.',
]

function playAnnoyingSound(ctx, noCount) {
  if (!ctx) return
  const now = ctx.currentTime

  if (noCount <= 2) {
    // sad descending beep
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.setValueAtTime(880, now)
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.4)
    gain.gain.setValueAtTime(0.3, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4)
    osc.start(now)
    osc.stop(now + 0.4)
  } else if (noCount <= 5) {
    // angry buzzer
    for (let i = 0; i < 3; i++) {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sawtooth'
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = 150 + i * 30
      gain.gain.setValueAtTime(0.25, now + i * 0.12)
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.1)
      osc.start(now + i * 0.12)
      osc.stop(now + i * 0.12 + 0.1)
    }
  } else {
    // absolute chaos — rapid fire alarm
    for (let i = 0; i < 6; i++) {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = i % 2 === 0 ? 'square' : 'sawtooth'
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = i % 2 === 0 ? 1200 : 600
      gain.gain.setValueAtTime(0.2, now + i * 0.08)
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.07)
      osc.start(now + i * 0.08)
      osc.stop(now + i * 0.08 + 0.07)
    }
  }
}

export default function ProfilePage() {
  const { name, interest } = useParams()
  const decodedName = decodeURIComponent(name ?? '')
  const decodedInterest = decodeURIComponent(interest ?? '')

  const [noCount, setNoCount] = useState(0)
  const [accepted, setAccepted] = useState(false)
  const [hearts, setHearts] = useState([])
  const [toasts, setToasts] = useState([])
  const [flashing, setFlashing] = useState(false)
  const [shaking, setShaking] = useState(false)
  const [bgColor, setBgColor] = useState(null)
  const audioCtxRef = useRef(null)

  const yesScale = 1 + noCount * 0.35
  const noScale = Math.max(1 - noCount * 0.12, 0.25)
  const noLabel = NO_LABELS[Math.min(noCount, NO_LABELS.length - 1)]

  const getAudioCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume()
    }
    return audioCtxRef.current
  }, [])

  function addToast(msg) {
    const id = Date.now() + Math.random()
    setToasts(t => [...t.slice(-4), { id, msg }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500)
  }

  function handleNo() {
    const next = noCount + 1
    setNoCount(next)

    // play sound
    playAnnoyingSound(getAudioCtx(), next)

    // flash screen
    setFlashing(true)
    setTimeout(() => setFlashing(false), 300)

    // shake
    setShaking(true)
    setTimeout(() => setShaking(false), 500)

    // toast
    addToast(TOASTS[Math.floor(Math.random() * TOASTS.length)])

    // extra chaos past 4
    if (next >= 4) {
      const colors = ['#ff006640', '#ff69b440', '#ff000030', '#ff45a140']
      setBgColor(colors[Math.floor(Math.random() * colors.length)])
      setTimeout(() => setBgColor(null), 400)
    }

    // double toast past 6
    if (next >= 6) {
      setTimeout(() => addToast(TOASTS[Math.floor(Math.random() * TOASTS.length)]), 200)
    }
  }

  function handleYes() {
    setAccepted(true)
    const burst = Array.from({ length: 24 }, (_, i) => ({
      id: i,
      emoji: HEARTS[i % HEARTS.length],
      x: 10 + Math.random() * 80,
      delay: Math.random() * 0.8,
      duration: 1.2 + Math.random() * 1.2,
    }))
    setHearts(burst)

    // happy chime
    const ctx = getAudioCtx()
    const notes = [523, 659, 784, 1047]
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = freq
      osc.type = 'sine'
      const t = ctx.currentTime + i * 0.15
      gain.gain.setValueAtTime(0.3, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4)
      osc.start(t)
      osc.stop(t + 0.4)
    })
  }

  // cleanup audio on unmount
  useEffect(() => {
    return () => audioCtxRef.current?.close()
  }, [])

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
    <main
      className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center px-4 text-center transition-colors duration-100"
      style={{ backgroundColor: bgColor ?? undefined, background: bgColor ? undefined : '' }}
    >
      {/* base bg */}
      <div className="absolute inset-0 bg-rose-950 -z-10" />

      {/* flash overlay */}
      {flashing && (
        <div className="pointer-events-none fixed inset-0 z-50 bg-pink-400/40 animate-ping" />
      )}

      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-pink-600/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-rose-500/20 blur-3xl" />

      {/* toasts */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 items-end pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className="rounded-2xl border border-pink-500/40 bg-rose-900/90 backdrop-blur px-4 py-2.5 text-sm font-semibold text-pink-200 shadow-xl shadow-pink-950/50 max-w-xs text-left"
            style={{ animation: 'toastIn 0.25s ease-out forwards' }}
          >
            {t.msg}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes pulse-heart {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.12); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          15%     { transform: translateX(-8px) rotate(-1deg); }
          30%     { transform: translateX(8px) rotate(1deg); }
          45%     { transform: translateX(-6px); }
          60%     { transform: translateX(6px); }
          75%     { transform: translateX(-3px); }
          90%     { transform: translateX(3px); }
        }
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(40px) scale(0.9); }
          to   { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes bgFlash {
          0%,100% { opacity: 0; }
          50%     { opacity: 1; }
        }
      `}</style>

      <div
        className="relative z-10 w-full max-w-sm"
        style={{
          animation: shaking
            ? 'shake 0.5s ease-in-out, fadeSlideUp 0.5s ease-out'
            : 'fadeSlideUp 0.5s ease-out forwards',
        }}
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

          <div className="mt-8 flex items-center justify-center gap-6 min-h-[80px]">
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
              className="rounded-2xl border border-rose-700/50 bg-white/5 font-semibold text-rose-300 backdrop-blur-md hover:bg-white/10 whitespace-nowrap"
              style={{
                transform: `scale(${noScale})`,
                transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                padding: '0.75rem 1.5rem',
                transformOrigin: 'center',
                opacity: Math.max(noScale, 0.25),
              }}
            >
              {noLabel}
            </button>
          </div>

          {noCount > 0 && (
            <p className="mt-6 text-rose-300/60 text-xs font-medium animate-pulse">
              {noCount >= 7
                ? '🚨 STOP CLICKING NO OMGGGG'
                : noCount >= 5
                ? '😭 Just say YES already!!'
                : noCount >= 3
                ? '👀 The yes button keeps growing… hint hint'
                : '🤨 Are you sure about that?'}
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
