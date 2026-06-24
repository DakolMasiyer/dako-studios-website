import { WordmarkLockup } from './WordmarkLockup'
import type { Arm } from '@/utils/social-templates'

export interface TestimonialProps {
  arm: Arm
  quote: string
  emphasis?: string
  name?: string
  role?: string
  initials?: string
}

export function TestimonialTemplate({ arm, quote, emphasis, name, role, initials }: TestimonialProps) {
  const emphasisIndex = emphasis ? quote.indexOf(emphasis) : -1
  const before = emphasisIndex >= 0 ? quote.slice(0, emphasisIndex) : quote
  const after = emphasisIndex >= 0 ? quote.slice(emphasisIndex + (emphasis?.length ?? 0)) : ''

  return (
    <div className="relative h-full box-border p-20 flex flex-col">
      <WordmarkLockup arm={arm} size={40} />

      <div className="relative flex-1 flex flex-col justify-center">
        <span className="absolute -left-1 top-[160px] font-display font-bold text-[200px] leading-none text-primary opacity-25 pointer-events-none select-none">
          &ldquo;
        </span>
        <p className="relative font-sans font-medium text-[46px] leading-[1.65] text-[#FAF8F4] max-w-[880px]">
          {before}
          {emphasisIndex >= 0 && <span className="font-serif italic font-normal">{emphasis}</span>}
          {after}
        </p>
      </div>

      <div className="h-px w-full bg-[#2C2C30]" />

      <div className="mt-10 flex items-center justify-between">
        <div className="flex items-center gap-[18px]">
          {initials && (
            <div className="shrink-0 w-[60px] h-[60px] rounded-full bg-primary flex items-center justify-center">
              <span className="font-sans font-bold text-[22px] tracking-[0.04em] text-primary-foreground">{initials}</span>
            </div>
          )}
          <div className="flex flex-col gap-[6px]">
            {name && <span className="font-sans font-semibold text-[26px] text-[#FAF8F4] leading-none">{name}</span>}
            {role && <span className="font-sans text-[19px] text-[#8E8E92] leading-none">{role}</span>}
          </div>
        </div>
        <div className="inline-flex items-center gap-2 px-5 py-[11px] rounded-full bg-primary/10">
          <span className="font-mono font-semibold text-xs tracking-[0.15em] text-primary uppercase">verified client</span>
        </div>
      </div>
    </div>
  )
}
