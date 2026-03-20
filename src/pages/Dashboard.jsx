import { useState } from 'react'
import { generatePersonalizedPage } from '../backboardClient'

export default function Dashboard() {
  const [name, setName] = useState('')
  const [interests, setInterests] = useState('')
  const [touched, setTouched] = useState({ name: false, interests: false })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  const nameError = touched.name && !name.trim()
  const interestsError = touched.interests && !interests.trim()

  async function handleSubmit(e) {
    e.preventDefault()
    setTouched({ name: true, interests: true })

    if (!name.trim() || !interests.trim()) {
      return
    }

    setIsLoading(true)
    setError('')
    setResult(null)

    try {
      const data = await generatePersonalizedPage({
        name: name.trim(),
        interests: interests.trim(),
      })

      setResult(data)
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-rose-950 px-4 py-10">
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-pink-600/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-rose-500/20 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-600/10 blur-2xl" />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[420px_minmax(0,1fr)]">
        <section>
          <div className="mb-8 text-center lg:text-left">
            <span className="text-5xl">💘</span>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Backboard <span className="text-pink-400">Page Lab</span>
            </h1>
            <p className="mt-2 text-rose-300/80 text-sm tracking-widest uppercase font-medium">
              Generate a custom mini-site from a prompt
            </p>
          </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-rose-800/50 bg-white/5 backdrop-blur-md p-8 shadow-2xl shadow-rose-950/60"
        >
          <p className="mb-6 text-center text-rose-200/70 text-sm leading-relaxed">
            Enter a name and a few interests, then we'll ask Backboard for a fully styled HTML page you can preview immediately.
          </p>

          <div className="mb-5">
            <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-rose-200">
              Name
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
            <textarea
              id="interests"
              rows="5"
              value={interests}
              onChange={e => setInterests(e.target.value)}
              onBlur={() => setTouched(t => ({ ...t, interests: true }))}
              placeholder="e.g. indie music, hiking, vintage cameras, ramen"
              className={`w-full rounded-xl border px-4 py-3 text-white bg-white/10 placeholder-rose-300/40 outline-none transition focus:ring-2 ${
                interestsError
                  ? 'border-red-400 focus:ring-red-400/40'
                  : 'border-rose-700/50 focus:border-pink-500 focus:ring-pink-500/30'
              }`}
            />
            {interestsError && (
              <p className="mt-2 text-xs text-red-400">Please enter at least one interest.</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-pink-600/30 transition-all hover:shadow-pink-600/50 hover:scale-[1.02] active:scale-100"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isLoading ? 'Generating…' : 'Generate custom page'}
              <span className="text-lg">✨</span>
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
            The API key stays server-side and the generated page is rendered in a sandboxed iframe.
          </p>
        </section>

        <section className="rounded-3xl border border-rose-800/50 bg-slate-950/60 p-4 shadow-2xl shadow-rose-950/60 backdrop-blur-md">
          <div className="mb-4 flex items-center justify-between gap-4 px-3 pt-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-300/60">
                Live Preview
              </p>
              <h2 className="mt-1 text-2xl font-semibold text-white">
                {result ? `${name.trim() || 'Your'} custom page` : 'Your generated page will appear here'}
              </h2>
            </div>
          </div>

          <div className="overflow-hidden rounded-[28px] border border-white/10 bg-slate-950">
            {result ? (
              <iframe
                title="Generated custom webpage"
                srcDoc={result.html}
                sandbox="allow-scripts"
                className="h-[720px] w-full border-0 bg-white"
              />
            ) : isLoading ? (
              <div className="flex h-[720px] items-center justify-center px-6 text-center text-sm text-slate-300">
                Generating a personalized page with Backboard…
              </div>
            ) : (
              <div className="flex h-[720px] items-center justify-center px-6 text-center text-sm text-slate-400">
                Submit the form to generate a self-contained HTML page from Backboard.
              </div>
            )}
          </div>

          {result && (
            <details className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-rose-100/80">
              <summary className="cursor-pointer list-none font-semibold text-white">
                View generated HTML
              </summary>
              <pre className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-950/80 p-4 text-xs text-rose-100/80">
                <code>{result.html}</code>
              </pre>
            </details>
          )}
        </section>
      </div>
    </main>
  )
}
