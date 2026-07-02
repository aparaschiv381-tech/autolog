'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function NewProjectPage() {
  const router = useRouter()
  const supabase = createClient()
  const [name, setName] = useState('')
  const [repo, setRepo] = useState('')
  const [loading, setLoading] = useState(false)
  const [created, setCreated] = useState<{ webhookUrl: string; secret: string } | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  async function handleCreate() {
    if (!name || !repo) return
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const secret = Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0')).join('')
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      + '-' + Math.random().toString(36).slice(2, 6)

    const { data, error } = await supabase.from('projects').insert({
      user_id: user.id,
      name,
      github_repo: repo,
      slug,
      webhook_secret: secret,
    }).select().single()

    if (!error && data) {
      await supabase.from('subscriptions').upsert(
        { user_id: user.id },
        { onConflict: 'user_id' }
      )
      setCreated({
        webhookUrl: `${window.location.origin}/api/webhook/github?project=${data.id}`,
        secret,
      })
    }
    setLoading(false)
  }

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  if (created) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="max-w-lg w-full bg-white/5 border border-white/10 rounded-2xl p-8">
          <h1 className="text-2xl font-bold mb-2">🎉 Project created!</h1>
          <p className="text-white/50 mb-2">Add this webhook to your GitHub repo:</p>
          <p className="text-white/40 text-xs mb-6">GitHub Repo → Settings → Webhooks → Add webhook</p>

          <div className="space-y-4">
            <div>
              <label className="text-white/70 text-sm block mb-1">Payload URL</label>
              <div className="flex gap-2">
                <input value={created.webhookUrl} readOnly
                  className="flex-1 bg-white/5 border border-white/20 text-white text-xs rounded-lg px-3 py-2 font-mono" />
                <button onClick={() => copy(created.webhookUrl, 'url')}
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs transition-colors">
                  {copied === 'url' ? '✓' : 'Copy'}
                </button>
              </div>
            </div>
            <div>
              <label className="text-white/70 text-sm block mb-1">Secret</label>
              <div className="flex gap-2">
                <input value={created.secret} readOnly
                  className="flex-1 bg-white/5 border border-white/20 text-white text-xs rounded-lg px-3 py-2 font-mono" />
                <button onClick={() => copy(created.secret, 'secret')}
                  className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs transition-colors">
                  {copied === 'secret' ? '✓' : 'Copy'}
                </button>
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-4 text-xs text-white/50 space-y-1">
              <p>• Content type: <code className="text-white/80">application/json</code></p>
              <p>• Events: <code className="text-white/80">Just the push event</code> + <code className="text-white/80">Releases</code></p>
              <p>• SSL verification: <code className="text-white/80">Enabled</code></p>
            </div>
          </div>

          <button onClick={() => router.push('/dashboard')}
            className="w-full mt-6 py-3 bg-violet-600 hover:bg-violet-700 rounded-xl font-semibold text-sm transition-colors">
            Go to Dashboard
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-2xl p-8">
        <h1 className="text-2xl font-bold mb-6">Connect a Repository</h1>
        <div className="space-y-4">
          <div>
            <label className="text-white/70 text-sm block mb-1">Project Name</label>
            <input
              className="w-full bg-white/5 border border-white/20 text-white rounded-lg px-3 py-2 placeholder:text-white/30 focus:outline-none focus:border-violet-500"
              placeholder="My Awesome App"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="text-white/70 text-sm block mb-1">GitHub Repo (owner/repo)</label>
            <input
              className="w-full bg-white/5 border border-white/20 text-white rounded-lg px-3 py-2 placeholder:text-white/30 focus:outline-none focus:border-violet-500"
              placeholder="aparaschiv381-tech/my-app"
              value={repo}
              onChange={e => setRepo(e.target.value)}
            />
          </div>
          <button
            onClick={handleCreate}
            disabled={!name || !repo || loading}
            className="w-full py-3 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold text-sm transition-colors mt-2"
          >
            {loading ? 'Creating...' : 'Create Project & Get Webhook URL'}
          </button>
        </div>
      </div>
    </main>
  )
}
