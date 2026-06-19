import Image from 'next/image'
import { PortfolioItem } from '@/data/portfolio'

interface PortfolioCardVisualProps {
  item: PortfolioItem
}

export function PortfolioCardVisual({ item }: PortfolioCardVisualProps) {
  if (item.coverImage && item.coverImageMobile) {
    return (
      <div className="aspect-video relative flex items-center justify-center overflow-hidden border-b border-border/20 bg-[#1E1E21]">
        {/* Blurred background — the site's real hero image */}
        <Image
          src={item.coverImage}
          alt=""
          fill
          className="object-cover scale-110 blur-[2px] brightness-50 transition-transform duration-500 group-hover:scale-[1.18]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />

        {/* Phone frame mockup of the real mobile site */}
        <div className="relative z-10 w-[42%] sm:w-[38%] aspect-[9/19.5] rounded-[20px] border-[3px] border-[#3A3A3D] bg-black shadow-2xl transition-transform duration-500 group-hover:scale-[1.05]">
          <div className="absolute left-1/2 top-1.5 -translate-x-1/2 w-8 h-1.5 rounded-full bg-[#3A3A3D] z-10" />
          <div className="relative w-full h-full rounded-[17px] overflow-hidden">
            <Image
              src={item.coverImageMobile}
              alt={item.title}
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    )
  }

  if (item.image) {
    return (
      <div className="aspect-video relative flex items-center justify-center overflow-hidden border-b border-border/20 bg-[#1E1E21]">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
        />
      </div>
    )
  }

  return (
    <div className="aspect-video bg-gradient-to-br from-primary/5 via-[#1E1E21] to-[#252528] relative flex items-center justify-center overflow-hidden border-b border-border/20 p-4">
      {/* Floating Browser Top Bar */}
      <div className="absolute top-2 left-3 flex space-x-1.5 z-10">
        <div className="w-2.5 h-2.5 rounded-full bg-[#E0E0E4]/20"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-[#E0E0E4]/20"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-[#E0E0E4]/20"></div>
      </div>

      {/* Floating abstract UI mockup representing the niche */}
      <div className="w-4/5 h-[80%] mt-6 rounded-lg bg-card/40 border border-border/20 shadow-lg p-3 flex flex-col justify-between transition-transform duration-500 group-hover:scale-[1.03]">
        {/* Header mockup */}
        <div className="flex justify-between items-center border-b border-border/10 pb-2">
          <div className="w-12 h-3 rounded bg-primary/20"></div>
          <div className="flex space-x-2">
            <div className="w-6 h-2 rounded bg-[#8E8E92]/20"></div>
            <div className="w-6 h-2 rounded bg-[#8E8E92]/20"></div>
          </div>
        </div>
        {/* Content mockup */}
        <div className="space-y-2 py-2 flex-1">
          <div className="w-3/4 h-4 rounded bg-foreground/10"></div>
          <div className="w-full h-3 rounded bg-muted-foreground/10"></div>
          <div className="w-5/6 h-3 rounded bg-muted-foreground/10"></div>
        </div>
        {/* CTA mockup */}
        <div className="flex justify-start">
          <div className="w-16 h-5 rounded bg-primary/80"></div>
        </div>
      </div>

      {/* Backdrop Glow */}
      <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-primary/10 rounded-full blur-2xl transition-all duration-500 group-hover:w-36 group-hover:h-36 group-hover:bg-primary/20"></div>
    </div>
  )
}
