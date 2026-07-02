import { createServerSupabase } from '@/lib/supabase-server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (!project) notFound()

  const { data: entries } = await supabase
    .from('changelog_entries')
    .select('*')
    .eq('project_id', params.id)
    .order('published_at', { ascending: false })

  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10">
        <Link href="/dashboard" className="text-white/50 hover:text-white text-sm transition-colors">← Dashboard</Link>
        <Link href={`/log/${project.slug}`} target="_blank"
          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors">
          View Public Page ↗
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold mb-1">{project.name}</h1>
        <p className="text-white/40 text-sm mb-8">{project.github_repo}</p>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
          <h2 className="font-semibold mb-3 text-sm text-white/70 uppercase tracking-wider">Webhook URL</h2>
          <code className="text-xs text-violet-300 break-all">
            {`${process.env.NEXT_PUBLIC_APP_URL}/api/webhook/github?project=${project.id}`}
          </code>
        </div>

        <h2 className="text-xl font-bold mb-4">Changelog Entries ({entries?.length ?? 0})</h2>
        {!entries?.length ? (
          <p className="text-white/30">No entries yet. Push some commits to your repo!</p>
        ) : (
          <div className="space-y-4">
            {entries.map((e: any) => (
              <div key={e.id} className="bg-white/5 border border-white/10 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-0.5 bg-violet-600/30 text-violet-300 text-xs rounded-full border border-violet-500/30">
                    {e.version}
                  </span>
                  <span className="text-white/30 text-xs">
                    {new Date(e.published_at).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="font-semibold">{e.title}</h3>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
