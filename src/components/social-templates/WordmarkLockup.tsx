import type { Arm } from '@/utils/social-templates'

const ARM_LABELS: Record<Arm, string> = {
  studio: 'STUDIOS',
  labs: 'LABS',
  brand: 'BRAND',
  motion: 'MOTION',
  film: 'FILM',
  academy: 'ACADEMY',
}

export function WordmarkLockup({ arm, size = 44 }: { arm: Arm; size?: number }) {
  return (
    <div className="flex items-center gap-[18px]">
      <svg width={size} height={(size * 200) / 205} viewBox="0 0 205 200" fill="none" className="block text-primary shrink-0">
        <path
          d="M 0 0 L 108 0 Q 205 0 205 100 Q 205 200 108 200 L 0 200 L 0 132 L 70 100 L 0 68 Z"
          fill="currentColor"
        />
      </svg>
      <div className="flex flex-col gap-[5px]">
        {/* Hardcoded to DESIGN.md dark tokens, not text-foreground/text-muted-foreground — see ExportableCanvas comment */}
        <span className="font-display font-extrabold text-[30px] tracking-[-0.5px] text-[#FAF8F4] leading-none">
          DAKO
        </span>
        <span className="font-sans font-semibold text-[12px] tracking-[0.15em] text-[#8E8E92] leading-none">
          {ARM_LABELS[arm]}
        </span>
      </div>
    </div>
  )
}
