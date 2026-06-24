import { WordmarkLockup } from './WordmarkLockup'
import type { Arm } from '@/utils/social-templates'

export interface FeedPostProps {
  arm: Arm
  badge?: string
  eyebrow?: string
  headline: string
  accentLine?: string
  subhead?: string
  stats?: { value: string; label: string }[]
  footerTitle?: string
  footerSubtitle?: string
}

export function FeedPostTemplate({
  arm,
  badge,
  eyebrow,
  headline,
  accentLine,
  subhead,
  stats,
  footerTitle,
  footerSubtitle,
}: FeedPostProps) {
  return (
    <div className="relative h-full box-border flex flex-col px-20 pt-20 pb-[72px]">
      <div className="flex justify-between items-start">
        <WordmarkLockup arm={arm} />
        {badge && (
          <div className="inline-flex items-center px-5 py-[11px] rounded-full bg-primary/10">
            <span className="font-mono font-semibold text-xs tracking-[0.15em] text-primary uppercase">{badge}</span>
          </div>
        )}
      </div>

      <div className={stats ? 'mt-[84px]' : 'flex-1 flex flex-col justify-center'}>
        {eyebrow && (
          <span className="block font-mono font-medium text-[15px] tracking-[0.22em] text-[#8E8E92] uppercase mb-[28px]">
            {eyebrow}
          </span>
        )}
        <h1 className="font-display font-bold text-[82px] leading-[0.98] tracking-[-0.03em] text-[#FAF8F4]">
          {headline}
        </h1>
        {accentLine && (
          <h1 className="font-display font-bold text-[82px] leading-[0.98] tracking-[-0.03em] text-primary mt-[10px]">
            {accentLine}
          </h1>
        )}
        {subhead && (
          <p className="mt-[38px] font-sans text-[30px] leading-[1.4] text-[#8E8E92] max-w-[760px]">{subhead}</p>
        )}
      </div>

      {stats && stats.length > 0 && (
        <div className="mt-16 flex flex-col">
          {stats.map((stat, i) => (
            <div
              key={i}
              className={`flex items-baseline justify-between py-[26px] border-t border-[#2C2C30] ${i === stats.length - 1 ? 'border-b' : ''}`}
            >
              <span className="font-mono font-semibold text-[56px] tracking-[-0.02em] text-[#FAF8F4] leading-none">
                {stat.value}
              </span>
              <span className="font-sans text-[26px] text-[#8E8E92]">{stat.label}</span>
            </div>
          ))}
        </div>
      )}

      {(footerTitle || footerSubtitle) && (
        <div className="mt-auto bg-[#1E1E21] rounded-lg px-7 py-6 flex flex-col gap-[10px]">
          {footerTitle && <span className="font-mono font-semibold text-2xl tracking-[0.02em] text-[#FAF8F4]">{footerTitle}</span>}
          {footerSubtitle && <span className="font-sans text-[19px] text-[#8E8E92]">{footerSubtitle}</span>}
        </div>
      )}

      {!stats && !footerTitle && !footerSubtitle && (
        <div className="flex flex-col gap-7">
          <div className="h-px w-full bg-[#2C2C30]" />
          <span className="font-sans font-medium text-xl tracking-[0.04em] text-[#8E8E92]">
            labs · brand · motion · film · academy
          </span>
        </div>
      )}
    </div>
  )
}
