'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ExportableCanvas } from './ExportableCanvas'
import { WordmarkLockup } from './WordmarkLockup'
import type { Arm } from '@/utils/social-templates'

export interface CarouselSlide {
  eyebrow?: string
  heading: string
  body?: string
  image?: string
}

export interface CarouselProps {
  arm: Arm
  slides: CarouselSlide[]
  fileName: string
  showDownloadButton?: boolean
}

// Carousel slides are 1080x1350 each, like a feed post. Only the active slide is
// rendered/exported at a time — prev/next controls live outside ExportableCanvas's
// export root, so they're naturally excluded from the downloaded PNG.
export function CarouselTemplate({ arm, slides, fileName, showDownloadButton = true }: CarouselProps) {
  const [index, setIndex] = useState(0)
  const slide = slides[Math.min(index, slides.length - 1)] ?? { heading: '' }

  return (
    <div className="flex flex-col gap-4">
      <ExportableCanvas
        width={1080}
        height={1350}
        arm={arm}
        fileName={`${fileName}-slide-${index + 1}`}
        showDownloadButton={showDownloadButton}
      >
        <div className="relative h-full box-border flex flex-col px-20 pt-20 pb-[72px]">
          <div className="flex justify-between items-start">
            <WordmarkLockup arm={arm} />
            <div className="inline-flex items-center px-5 py-[11px] rounded-full bg-primary/10">
              <span className="font-mono font-semibold text-xs tracking-[0.15em] text-primary uppercase">
                {String(index + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
              </span>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            {slide.eyebrow && (
              <span className="block font-mono font-medium text-[15px] tracking-[0.22em] text-[#8E8E92] uppercase mb-6">
                {slide.eyebrow}
              </span>
            )}
            <h2 className="font-display font-bold text-[62px] leading-[1.1] tracking-[-0.03em] text-[#FAF8F4] max-w-[920px]">
              {slide.heading}
            </h2>
            {slide.body && (
              <p className="mt-7 font-sans text-[26px] leading-[1.5] text-[#8E8E92] max-w-[760px]">{slide.body}</p>
            )}
            {slide.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={slide.image}
                alt=""
                className="mt-10 w-full rounded-lg shadow-2xl"
                style={{ boxShadow: '0 24px 80px rgba(0,0,0,0.55)' }}
              />
            )}
          </div>
        </div>
      </ExportableCanvas>

      {slides.length > 1 && (
        <div data-export-exclude="true" className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={index === 0}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-full border border-border text-sm text-muted-foreground disabled:opacity-30 cursor-pointer disabled:cursor-default"
          >
            <ChevronLeft className="h-4 w-4" /> Prev
          </button>
          <span className="text-xs text-muted-foreground font-mono">
            Slide {index + 1} of {slides.length}
          </span>
          <button
            type="button"
            onClick={() => setIndex((i) => Math.min(slides.length - 1, i + 1))}
            disabled={index === slides.length - 1}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-full border border-border text-sm text-muted-foreground disabled:opacity-30 cursor-pointer disabled:cursor-default"
          >
            Next <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}
