import type { Arm } from '@/utils/social-templates'

export interface StoryProps {
  arm: Arm
  eyebrow?: string
  headline: string
  accentLine?: string
  subhead?: string
  image?: string
  features?: string[]
  ctaLabel?: string
  hint?: string
}

export function StoryTemplate({
  eyebrow,
  headline,
  accentLine,
  subhead,
  image,
  features,
  ctaLabel,
  hint,
}: StoryProps) {
  return (
    <div className="relative h-full box-border px-24 pt-[250px] pb-[300px] flex flex-col items-center justify-between text-center">
      <div className="flex flex-col items-center">
        {eyebrow && (
          <span className="block font-mono font-semibold text-[22px] tracking-[0.18em] text-[#8E8E92] uppercase">
            {eyebrow}
          </span>
        )}
        <div className="mt-10 flex flex-col items-center">
          <h1 className="font-display font-bold text-[82px] leading-[0.98] tracking-[-0.03em] text-[#FAF8F4]">
            {headline}
          </h1>
          {accentLine && (
            <h1 className="font-display font-bold text-[82px] leading-[0.98] tracking-[-0.03em] text-primary">
              {accentLine}
            </h1>
          )}
          {subhead && <p className="mt-[18px] font-sans text-[30px] leading-[1.4] text-[#8E8E92]">{subhead}</p>}
        </div>
      </div>

      {image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt=""
          className="w-[560px] max-w-full rounded-2xl shadow-2xl object-cover"
          style={{ boxShadow: '0 40px 90px rgba(0,0,0,0.55)' }}
        />
      )}

      {features && features.length > 0 && (
        <div className="w-full flex flex-col gap-[14px]">
          {features.map((feature, i) => (
            <div key={i} className="bg-[#1E1E21] rounded-lg px-4 py-[14px]">
              <span className="font-sans font-medium text-[30px] text-[#FAF8F4]">{feature}</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col items-center gap-10">
        {ctaLabel && (
          <div className="inline-flex items-center justify-center gap-[10px] h-[92px] px-11 rounded-full bg-primary">
            <span className="font-sans font-semibold text-[32px] text-[#FAF8F4]">{ctaLabel}</span>
          </div>
        )}
        {hint && (
          <span className="block font-mono font-medium text-[22px] tracking-[0.12em] text-[#8E8E92] uppercase">
            {hint}
          </span>
        )}
      </div>
    </div>
  )
}
