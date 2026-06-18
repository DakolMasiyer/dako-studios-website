import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DakoLogo } from "@/components/dako-logo"

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Top bar — logo */}
      <div className="px-6 py-5 sm:px-10">
        <Link href="/" aria-label="Dako Studios home">
          <DakoLogo size={24} />
        </Link>
      </div>

      {/* Background watermark "404" */}
      <span
        aria-hidden
        className="pointer-events-none select-none absolute inset-0 flex items-center justify-center font-display font-extrabold text-[40vw] leading-none text-foreground/[0.04]"
      >
        404
      </span>

      {/* Main content */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center relative z-10">
        <p className="text-xs font-semibold tracking-[0.18em] uppercase text-muted-foreground mb-4">
          Error 404
        </p>
        <h1 className="font-display font-extrabold text-5xl sm:text-6xl md:text-7xl tracking-tight text-foreground">
          Lost in the edit.
        </h1>
        <p className="mt-4 text-base text-muted-foreground font-light max-w-sm leading-relaxed">
          This page doesn&apos;t exist — but we know where to find what you need.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Button asChild size="lg">
            <Link href="/">Take Me Home</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/#contact">Start a Project</Link>
          </Button>
        </div>
      </div>

      {/* Bottom bar — copyright */}
      <div className="px-6 py-5 sm:px-10 text-center">
        <p className="text-xs text-muted-foreground/50">
          © 2026 Dako Studios. Abuja, Nigeria.
        </p>
      </div>
    </div>
  )
}
