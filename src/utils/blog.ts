import fs from 'fs'
import path from 'path'

export interface BlogPost {
  slug: string
  title: string
  date: string
  description: string
  category: string
  tags: string[]
  author: string
  content: string
}

const postsDirectory = path.join(process.cwd(), 'content/blog')

// Simple pure-JS frontmatter parser to avoid external dependencies
// Shared with src/utils/case-studies.ts
export function parseFrontMatter(fileContent: string) {
  const frontMatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/
  const match = fileContent.match(frontMatterRegex)
  
  if (!match) {
    return { data: {} as Record<string, any>, content: fileContent }
  }
  
  const yamlBlock = match[1]
  const content = match[2]
  const data: Record<string, any> = {}
  
  yamlBlock.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':')
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim()
      let value = line.slice(colonIndex + 1).trim()
      
      // Strip outer quotes
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1)
      }
      
      // Parse arrays like: tags: ["tag1", "tag2"]
      if (value.startsWith('[') && value.endsWith(']')) {
        try {
          // Normalize single quotes to double quotes for JSON parsing
          const jsonVal = value.replace(/'/g, '"')
          data[key] = JSON.parse(jsonVal)
        } catch {
          // Fallback array splitting
          data[key] = value.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, ''))
        }
      } else {
        data[key] = value
      }
    }
  })
  
  return { data, content }
}

export function getBlogPosts(): BlogPost[] {
  // Ensure directory exists
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const slug = fileName.replace(/\.md$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = parseFrontMatter(fileContents)

      return {
        slug,
        title: data.title || 'Untitled Post',
        date: data.date || '2026-01-01',
        description: data.description || '',
        category: data.category || 'General',
        tags: Array.isArray(data.tags) ? data.tags : [],
        author: data.author || 'Dako Studios',
        content,
      }
    })

  // Sort posts by date descending
  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getBlogPostBySlug(slug: string): BlogPost | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`)
    if (!fs.existsSync(fullPath)) {
      return null
    }
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = parseFrontMatter(fileContents)

    return {
      slug,
      title: data.title || 'Untitled Post',
      date: data.date || '2026-01-01',
      description: data.description || '',
      category: data.category || 'General',
      tags: Array.isArray(data.tags) ? data.tags : [],
      author: data.author || 'Dako Studios',
      content,
    }
  } catch {
    return null
  }
}
