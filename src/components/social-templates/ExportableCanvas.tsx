'use client'

import { useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import { Download, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Arm } from '@/utils/social-templates'

interface ExportableCanvasProps {
  width: number
  height: number
  arm: Arm
  fileName: string
  children: React.ReactNode
  showDownloadButton?: boolean
  className?: string
}

export function ExportableCanvas({
  width,
  height,
  arm,
  fileName,
  children,
  showDownloadButton = true,
  className,
}: ExportableCanvasProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [downloaded, setDownloaded] = useState(false)

  const handleDownload = async () => {
    const node = rootRef.current
    if (!node) return
    try {
      const dataUrl = await toPng(node, {
        width,
        height,
        pixelRatio: 4,
        filter: (n) => !(n instanceof HTMLElement && n.dataset.exportExclude === 'true'),
      })
      const a = document.createElement('a')
      a.download = `${fileName}.png`
      a.href = dataUrl
      a.click()
      setDownloaded(true)
      setTimeout(() => setDownloaded(false), 1500)
    } catch (e) {
      console.error('Export failed', e)
    }
  }

  return (
    <div className="relative" style={{ width, height }}>
      {showDownloadButton && (
        <button
          type="button"
          onClick={handleDownload}
          data-export-exclude="true"
          className="absolute top-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-primary px-[18px] py-[11px] text-sm font-semibold text-primary-foreground shadow-lg cursor-pointer"
        >
          {downloaded ? <Check className="h-4 w-4" /> : <Download className="h-4 w-4" />}
          {downloaded ? 'Saved' : 'Download PNG'}
        </button>
      )}
      {/*
        data-arm scopes `--primary` to the right accent color (see globals.css arm overrides).
        Background/foreground/border below are hardcoded to DESIGN.md's dark token values
        rather than using bg-background/text-foreground/border-border — the academy arm
        override flips those to *light* surface values for the live site's Academy pages,
        but social posts must always render on dark carbon regardless of arm (DESIGN.md §9).
      */}
      <div
        ref={rootRef}
        data-arm={arm}
        data-export-root="true"
        className={cn('relative overflow-hidden bg-[#161618] text-[#FAF8F4] font-sans', className)}
        style={{ width, height }}
      >
        {/* crimson/arm radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 40%, color-mix(in srgb, var(--primary) 10%, transparent) 0%, transparent 70%)',
          }}
        />
        {/* dot-grid texture, radially masked */}
        <div
          className="absolute inset-0 pointer-events-none opacity-50"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.16) 1px, transparent 1px)',
            backgroundSize: '16px 16px',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 42%, #000 0%, transparent 78%)',
            maskImage: 'radial-gradient(ellipse 70% 60% at 50% 42%, #000 0%, transparent 78%)',
          }}
        />
        <div className="relative h-full">{children}</div>
      </div>
    </div>
  )
}
