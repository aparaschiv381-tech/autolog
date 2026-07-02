import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

export async function generateChangelog(
  commits: { message: string; author: string }[],
  repoName: string,
  version: string
): Promise<{ title: string; body: string }> {
  const commitList = commits.map(c => `- ${c.message} (by ${c.author})`).join('\n')

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are a technical writer that converts raw git commits into clean, user-friendly changelog entries.\nWrite in a friendly but professional tone. Use markdown. Group changes into categories: ✨ New Features, 🐛 Bug Fixes, ⚡ Improvements, 🔒 Security.\nOnly include categories with relevant commits. Be concise. Do NOT include commit SHAs.`
      },
      {
        role: 'user',
        content: `Repository: ${repoName}\nVersion/Tag: ${version}\n\nCommits:\n${commitList}\n\nGenerate a changelog title (max 8 words) and body.`
      }
    ],
    tools: [
      {
        type: 'function',
        function: {
          name: 'output_changelog',
          parameters: {
            type: 'object',
            properties: {
              title: { type: 'string', description: 'Short changelog title, max 8 words' },
              body: { type: 'string', description: 'Full markdown changelog body' }
            },
            required: ['title', 'body']
          }
        }
      }
    ],
    tool_choice: { type: 'function', function: { name: 'output_changelog' } }
  })

  const args = response.choices[0].message.tool_calls?.[0]?.function?.arguments ?? '{"title":"Update","body":"Various improvements."}'
  return JSON.parse(args)
}
