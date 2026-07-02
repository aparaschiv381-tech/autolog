import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10">
        <span className="text-xl font-bold tracking-tight">⚡ AutoLog</span>
        <div className="flex gap-3">
          <Link href="/login" className="px-4 py-2 text-white/70 hover:text-white text-sm transition-colors">Login</Link>
          <Link href="/login" className="px-4 py-2 bg-white text-black rounded-lg text-sm font-semibold hover:bg-white/90 transition-colors">Get Started Free</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 py-28 max-w-4xl mx-auto">
        <span className="mb-6 px-3 py-1 bg-white/10 text-white/70 rounded-full text-sm border border-white/20">
          🤖 AI-Powered · No Manual Work
        </span>
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
          Your GitHub commits,<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
            turned into changelogs.
          </span>
        </h1>
        <p className="text-xl text-white/60 mb-10 max-w-2xl">
          Push to GitHub. AutoLog reads your commits, writes a beautiful changelog with AI, and publishes it instantly.
        </p>
        <Link href="/login" className="px-10 py-4 bg-violet-600 hover:bg-violet-700 text-white text-lg font-semibold rounded-xl transition-colors">
          Connect your first repo → Free
        </Link>
        <p className="mt-4 text-white/30 text-sm">No credit card required · 1 repo free forever</p>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-6 py-16 border-t border-white/10">
        <h2 className="text-3xl font-bold text-center mb-12">How it works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: '1', title: 'Connect GitHub', desc: 'Paste your repo URL. AutoLog generates a webhook secret for you instantly.' },
            { step: '2', title: 'Push your code', desc: 'Every git push triggers AutoLog. AI reads your commits and writes a clean entry.' },
            { step: '3', title: 'Share your changelog', desc: 'A public page at autolog.app/log/your-app updates automatically.' },
          ].map(({ step, title, desc }) => (
            <div key={step} className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <div className="text-4xl font-black text-violet-400 mb-3">{step}</div>
              <h3 className="text-lg font-semibold mb-2">{title}</h3>
              <p className="text-white/50 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-3xl mx-auto px-6 py-16 border-t border-white/10">
        <h2 className="text-3xl font-bold text-center mb-12">Simple Pricing</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
            <h3 className="text-xl font-bold mb-2">Free</h3>
            <p className="text-4xl font-black mb-4">$0<span className="text-white/40 text-base font-normal">/mo</span></p>
            <ul className="space-y-2 text-white/60 text-sm mb-6">
              <li>✓ 1 GitHub repository</li>
              <li>✓ Last 10 changelog entries</li>
              <li>✓ Public changelog page</li>
            </ul>
            <Link href="/login" className="block w-full text-center px-4 py-2 border border-white/20 rounded-lg text-sm hover:bg-white/10 transition-colors">Get Started</Link>
          </div>
          <div className="bg-violet-600/20 rounded-2xl p-8 border border-violet-500/50">
            <h3 className="text-xl font-bold mb-2">Pro <span className="ml-2 px-2 py-0.5 bg-violet-500 rounded-full text-xs">Popular</span></h3>
            <p className="text-4xl font-black mb-4">$19<span className="text-white/40 text-base font-normal">/mo</span></p>
            <ul className="space-y-2 text-white/60 text-sm mb-6">
              <li>✓ Unlimited repositories</li>
              <li>✓ Full changelog history</li>
              <li>✓ Custom domain support</li>
              <li>✓ Priority AI processing</li>
            </ul>
            <Link href="/login" className="block w-full text-center px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg text-sm font-semibold transition-colors">Upgrade to Pro</Link>
          </div>
        </div>
      </section>

      <footer className="text-center py-10 text-white/20 text-sm border-t border-white/10">
        Built with ❤️ by AutoLog
      </footer>
    </main>
  )
}
