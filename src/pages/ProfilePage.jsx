import { useParams, Link } from 'react-router-dom'

export default function ProfilePage() {
  const { name, interest } = useParams()

  const decodedName = decodeURIComponent(name ?? '')
  const decodedInterest = decodeURIComponent(interest ?? '')

  return (
    <main className="relative min-h-screen overflow-hidden bg-rose-950 flex items-center justify-center px-4">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-pink-600/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-rose-500/20 blur-3xl" />

      <div className="relative z-10 w-full max-w-lg text-center">
        <span className="text-6xl">💝</span>

        <div className="mt-6 rounded-3xl border border-rose-800/50 bg-white/5 backdrop-blur-md p-10 shadow-2xl shadow-rose-950/60">
          <p className="mb-2 text-rose-300/60 text-xs tracking-widest uppercase font-medium">
            Love Profile
          </p>

          <h1 className="text-4xl font-bold text-white sm:text-5xl break-words">
            {decodedName}
          </h1>

          <div className="my-5 h-px w-16 mx-auto bg-gradient-to-r from-transparent via-pink-500 to-transparent" />

          <h1 className="text-3xl font-semibold text-pink-300 sm:text-4xl break-words">
            {decodedInterest}
          </h1>

          <p className="mt-6 text-rose-300/50 text-sm">
            Your love profile is ready ✨
          </p>
        </div>

        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-2xl border border-rose-800/50 bg-white/5 px-6 py-3 text-sm font-semibold text-rose-300 backdrop-blur-md transition hover:bg-white/10 hover:text-white"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </main>
  )
}
