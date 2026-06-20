import fs from 'fs'
import path from 'path'
import { parseFrontMatter } from './blog'

export interface CaseStudyResult {
  value: string
  label: string
}

export interface CaseStudy {
  slug: string
  title: string
  client: string
  arm: string
  date: string
  summary: string
  tags: string[]
  heroImage: string
  video?: string
  videos: string[]
  gallery: string[]
  results: CaseStudyResult[]
  content: string
  heroIsPortrait?: boolean
  externalUrl?: string
  figmaEmbedUrl?: string
}

const caseStudiesDirectory = path.join(process.cwd(), 'content/case-studies')

function toCaseStudy(slug: string, data: Record<string, any>, content: string): CaseStudy {
  return {
    slug,
    title: data.title || 'Untitled Case Study',
    client: data.client || '',
    arm: data.arm || 'labs',
    date: data.date || '2026-01-01',
    summary: data.summary || '',
    tags: Array.isArray(data.tags) ? data.tags : [],
    heroImage: data.heroImage || '',
    video: data.video || undefined,
    videos: Array.isArray(data.videos) ? data.videos : [],
    gallery: Array.isArray(data.gallery) ? data.gallery : [],
    results: Array.isArray(data.results) ? data.results : [],
    content,
    heroIsPortrait: data.heroIsPortrait ? true : undefined,
    externalUrl: data.externalUrl || undefined,
    figmaEmbedUrl: data.figmaEmbedUrl || undefined,
  }
}

export function getCaseStudies(): CaseStudy[] {
  if (!fs.existsSync(caseStudiesDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(caseStudiesDirectory)
  const allCaseStudies = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const slug = fileName.replace(/\.md$/, '')
      const fullPath = path.join(caseStudiesDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = parseFrontMatter(fileContents)
      return toCaseStudy(slug, data, content)
    })

  return allCaseStudies.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getCaseStudyBySlug(slug: string): CaseStudy | null {
  try {
    const fullPath = path.join(caseStudiesDirectory, `${slug}.md`)
    if (!fs.existsSync(fullPath)) {
      return null
    }
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = parseFrontMatter(fileContents)
    return toCaseStudy(slug, data, content)
  } catch {
    return null
  }
}
