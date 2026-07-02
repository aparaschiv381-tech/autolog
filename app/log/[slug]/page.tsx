import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const revalidate = 60

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { data: project } = await supabase
    .from('projects')
    .select('name')
    .eq('slug', params.slug)
    .single()
  return { title: project ? `${project.name} — Changelog` : 'Changelog' }
}

export default async function PublicChangelogPage({ params }: { params: { slug: string } }) {
  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!project) notFound()

  const { data: entries } = await supabase
    .from('changelog_entries')
    .select('*')
    .eq('project_id', project.id)
    .order('published_at', { ascending: false })

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <header className="mb-12">
          <h1 className="text-3xl font-bold mb-1">{project.name}</h1>
          <p className="text-white/40 text-sm">Changelog · {project.github_repo}</p>
        </header>

        {!entries?.length ? (
          <p className="text-white/30">No changelog entries yet. Push some commits!</p>
        ) : (
          <div className="space-y-12">
            {entries.map((entry: any) => (
              <article key={entry.id}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-2 py-0.5 bg-violet-600/30 text-violet-300 text-xs rounded-full border border-violet-500/30">
                    {entry.version}
                  </span>
                  <span className="text-white/30 text-sm">
                    {new Date(entry.published_at).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </span>
                </div>
                <h2 className="text-xl font-bold mb-4">{entry.title}</h2>
                <div className="prose prose-invert prose-sm max-w-none text-white/70">
                  <ReactMarkdown>{entry.body}</ReactMarkdown>
                </div>
                <hr className="mt-10 border-white/10" />
              </article>
            ))}
          </div>
        )}

        <footer className="mt-16 text-center text-white/20 text-xs">
          Powered by{' '}
          <Link href="/" className="underline hover:text-white/40">⚡ AutoLog</Link>
        </footer>
      </div>
    </main>
  )
}
