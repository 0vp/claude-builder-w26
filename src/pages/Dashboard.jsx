import { useState } from 'react'
import { generatePersonalizedPage } from '../backboardClient'

export default function Dashboard() {
  const [name, setName] = useState('')
  const [interests, setInterests] = useState('')
  const [touched, setTouched] = useState({ name: false, interests: false })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const nameError = touched.name && !name.trim()
  const interestsError = touched.interests && !interests.trim()

  async function handleSubmit(e) {
    e.preventDefault()
    setTouched({ name: true, interests: true })

    if (!name.trim() || !interests.trim()) {
      return
    }

    const previewWindow = window.open('', '_blank')

    if (previewWindow) {
      previewWindow.document.write(`<!doctype html><html><head><title>Generating...</title></head><body style="margin:0;display:grid;place-items:center;min-height:100vh;background:#0f172a;color:#fff;font-family:Inter,system-ui,sans-serif;">Generating page...</body></html>`)
      previewWindow.document.close()
    }

    setIsLoading(true)
    setError('')

    try {
      const result = await generatePersonalizedPage({
        name: name.trim(),
        interests: interests.trim(),
      })

      if (previewWindow) {
        previewWindow.document.open()
        previewWindow.document.write(result.html)
        previewWindow.document.close()
        previewWindow.focus()
      } else {
        const blob = new Blob([result.html], { type: 'text/html' })
        const url = URL.createObjectURL(blob)
        window.location.assign(url)
        setTimeout(() => URL.revokeObjectURL(url), 60_000)
      }
    } catch (submitError) {
      setError(submitError.message)

      if (previewWindow) {
        previewWindow.document.open()
        previewWindow.document.write(`<!doctype html><html><head><title>Error</title></head><body style="margin:0;display:grid;place-items:center;min-height:100vh;background:#190b15;color:#fecdd3;font-family:Inter,system-ui,sans-serif;padding:24px;text-align:center;">${submitError.message}</body></html>`)
        previewWindow.document.close()
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-rose-950 flex items-center justify-center px-4">
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-pink-600/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-rose-500/20 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-600/10 blur-2xl" />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="text-5xl">💘</span>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Loverboy <span className="text-pink-400">AI</span>
          </h1>
          <p className="mt-2 text-rose-300/80 text-sm tracking-widest uppercase font-medium">
            Send ur perfect valentines card
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-rose-800/50 bg-white/5 backdrop-blur-md p-8 shadow-2xl shadow-rose-950/60"
        >
          <p className="mb-6 text-center text-rose-200/70 text-sm leading-relaxed">
            Enter a name and interests, and we'll generate a full HTML page with Backboard.
          </p>

          <div className="mb-5">
            <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-rose-200">
              Their Name
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
              <p className="mt-1.5 text-xs text-red-400">Please enter a name.</p>
            )}
          </div>

          <div className="mb-7">
            <label htmlFor="interests" className="mb-1.5 block text-sm font-semibold text-rose-200">
              Interests
            </label>
            <input
              id="interests"
              type="text"
              value={interests}
              onChange={e => setInterests(e.target.value)}
              onBlur={() => setTouched(t => ({ ...t, interests: true }))}
              placeholder="e.g. music, art, hiking"
              className={`w-full rounded-xl border px-4 py-3 text-white bg-white/10 placeholder-rose-300/40 outline-none transition focus:ring-2 ${
                interestsError
                  ? 'border-red-400 focus:ring-red-400/40'
                  : 'border-rose-700/50 focus:border-pink-500 focus:ring-pink-500/30'
              }`}
            />
            {interestsError && (
              <p className="mt-2 text-xs text-red-400">Please enter interests.</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-pink-600/30 transition-all hover:shadow-pink-600/50 hover:scale-[1.02] active:scale-100"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isLoading ? 'Generating...' : 'Open generated page'}
              <span className="text-lg">💕</span>
            </span>
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-fuchsia-500 to-pink-500 transition-transform duration-300 group-hover:translate-x-0" />
          </button>

          {error && (
            <p className="mt-4 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </p>
          )}
        </form>

        <p className="mt-6 text-center text-xs text-rose-400/50">
          Uses Backboard with Anthropic Claude Haiku 4.5 and opens the generated HTML in a new page.
        </p>
      </div>
    </main>
  )
}
