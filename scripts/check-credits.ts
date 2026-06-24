import fs from 'fs'
import path from 'path'

function loadEnvLocal() {
  const envPath = path.join(process.cwd(), '.env.local')
  if (!fs.existsSync(envPath)) return
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1)
    process.env[key] = value
  }
}

async function main() {
  loadEnvLocal()
  const res = await fetch('https://api.firecrawl.dev/v1/team/credit-usage', {
    headers: { Authorization: `Bearer ${process.env.FIRECRAWL_API_KEY}` },
  })
  const json = await res.json()
  console.log(JSON.stringify(json, null, 2))
}

main()
