import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { validateGitHubWebhook } from '@/lib/github'
import { generateChangelog } from '@/lib/openai'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  const projectId = request.nextUrl.searchParams.get('project')
  if (!projectId) return NextResponse.json({ error: 'Missing project' }, { status: 400 })

  const rawBody = await request.text()
  const signature = request.headers.get('x-hub-signature-256') ?? ''
  const eventType = request.headers.get('x-github-event') ?? ''

  const { data: project, error } = await supabase
    .from('projects')
    .select('*, subscriptions(plan)')
    .eq('id', projectId)
    .single()

  if (error || !project) return NextResponse.json({ error: 'Project not found' }, { status: 404 })

  if (!validateGitHubWebhook(rawBody, signature, project.webhook_secret)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const payload = JSON.parse(rawBody)
  let commits: { message: string; author: string }[] = []
  let version = 'latest'

  if (eventType === 'push') {
    commits = (payload.commits ?? []).map((c: any) => ({
      message: c.message?.split('\n')[0] ?? '',
      author: c.author?.name ?? 'Unknown'
    })).filter((c: any) => !c.message.startsWith('Merge ') && c.message.length > 3)
    version = payload.after?.slice(0, 7) ?? 'latest'
  } else if (eventType === 'release') {
    const rb = payload.release?.body ?? payload.release?.name ?? ''
    commits = [{ message: rb, author: payload.release?.author?.login ?? 'Unknown' }]
    version = payload.release?.tag_name ?? 'v?'
  }

  if (!commits.length) return NextResponse.json({ skipped: true })

  const plan = (project as any).subscriptions?.plan ?? 'free'
  if (plan === 'free') {
    const { count } = await supabase
      .from('changelog_entries')
      .select('*', { count: 'exact', head: true })
      .eq('project_id', projectId)

    if ((count ?? 0) >= 10) {
      const { data: oldest } = await supabase
        .from('changelog_entries')
        .select('id')
        .eq('project_id', projectId)
        .order('published_at', { ascending: true })
        .limit(1)
      if (oldest?.[0]) {
        await supabase.from('changelog_entries').delete().eq('id', oldest[0].id)
      }
    }
  }

  const { title, body } = await generateChangelog(commits, project.github_repo, version)

  await supabase.from('changelog_entries').insert({
    project_id: projectId,
    version,
    title,
    body,
    raw_commits: commits,
  })

  return NextResponse.json({ success: true })
}
