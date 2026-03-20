function App() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16 sm:px-10 lg:px-12">
        <div className="max-w-3xl">
          <span className="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-sm font-medium text-cyan-300">
            Vite + React + Tailwind CSS
          </span>
          <h1 className="mt-6 text-5xl font-semibold tracking-tight text-white sm:text-6xl">
            Ship your next interface faster.
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-300 sm:text-xl">
            This starter is wired up with React, Vite, and Tailwind so you can
            jump straight into building.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a
            href="https://vite.dev/guide/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Vite docs
          </a>
          <a
            href="https://tailwindcss.com/docs"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-500 hover:bg-slate-900"
          >
            Tailwind docs
          </a>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {[
            ['Fast refresh', 'Iterate quickly with Vite\'s React-powered dev server.'],
            ['Utility-first styling', 'Compose responsive UIs directly in your JSX.'],
            ['Production-ready', 'Build optimized assets with a minimal setup.'],
          ].map(([title, description]) => (
            <section
              key={title}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-2xl shadow-slate-950/30"
            >
              <h2 className="text-lg font-semibold text-white">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">{description}</p>
            </section>
          ))}
        </div>
      </div>
    </main>
  )
}

export default App
