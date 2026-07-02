import { createServerSupabase } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: projects } = await supabase
    .from('projects')
    .select('id, name, github_repo, slug, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('plan')
    .eq('user_id', user.id)
    .single()

  const plan = sub?.plan ?? 'free'

  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10">
        <span className="text-xl font-bold">⚡ AutoLog</span>
        <div className="flex items-center gap-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            plan === 'pro' ? 'bg-violet-600' : 'bg-white/10 text-white/70'
          }`}>
            {plan === 'pro' ? '⚡ Pro' : 'Free'}
          </span>
          {plan === 'free' && (
            <form action="/api/stripe/checkout" method="POST">
              <button type="submit" className="px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg text-sm font-semibold transition-colors">
                Upgrade to Pro
              </button>
            </form>
          )}
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Your Projects</h1>
          <Link href="/dashboard/new" className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg text-sm font-semibold hover:bg-white/90 transition-colors">
            + Add Repository
          </Link>
        </div>

        {!projects?.length ? (
          <div className="text-center py-20 text-white/40">
            <p className="text-lg mb-4">No projects yet.</p>
            <Link href="/dashboard/new" className="px-6 py-3 bg-violet-600 hover:bg-violet-700 rounded-xl text-white text-sm font-semibold transition-colors">
              Connect your first repo
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((p: any) => (
              <div key={p.id} className="bg-white/5 border border-white/10 rounded-xl p-6 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-lg">{p.name}</h2>
                  <p className="text-white/40 text-sm">{p.github_repo}</p>
                </div>
                <div className="flex gap-3">
                  <Link href={`/log/${p.slug}`} target="_blank" className="px-3 py-1.5 text-white/50 hover:text-white text-sm border border-white/10 rounded-lg transition-colors">
                    Public Page ↗
                  </Link>
                  <Link href={`/dashboard/project/${p.id}`} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-sm rounded-lg transition-colors">
                    Manage
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
