import { WordmarkLockup } from './WordmarkLockup'
import type { Arm } from '@/utils/social-templates'

export interface ProcessExplainerProps {
  arm: Arm
  badge?: string
  headline: string
  accentLine?: string
  steps: { label: string; title: string }[]
  footer?: string
}

export function ProcessExplainerTemplate({ arm, badge, headline, accentLine, steps, footer }: ProcessExplainerProps) {
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

      <div className="mt-20">
        <h1 className="font-display font-bold text-[90px] leading-[0.98] tracking-[-0.035em] text-[#FAF8F4]">
          {headline}
        </h1>
        {accentLine && (
          <h1 className="font-display font-bold text-[90px] leading-[0.98] tracking-[-0.035em] text-primary mt-[6px]">
            {accentLine}
          </h1>
        )}
      </div>

      <div className="mt-16 flex flex-col gap-[10px]">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-6 bg-[#1E1E21] rounded-lg px-4 py-[14px]">
            <span className="shrink-0 w-[108px] font-mono font-semibold text-lg tracking-[0.16em] text-primary uppercase">
              {step.label}
            </span>
            <span className="font-sans font-semibold text-[30px] text-[#FAF8F4]">{step.title}</span>
          </div>
        ))}
      </div>

      {footer && (
        <div className="mt-auto bg-[#1E1E21] rounded-lg px-7 py-6">
          <span className="font-mono font-medium text-[21px] tracking-[0.04em] text-[#FAF8F4] leading-[1.4]">
            {footer}
          </span>
        </div>
      )}
    </div>
  )
}
