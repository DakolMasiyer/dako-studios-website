"use client"

import { Separator } from '@/components/ui/separator'
import { DakoLogo } from '@/components/dako-logo'
import { siteConfig } from '@/data/site'

const socialLinks = [
  { name: 'Instagram', href: siteConfig.socials.instagram },
  { name: 'Twitter', href: siteConfig.socials.twitter },
  { name: 'LinkedIn', href: siteConfig.socials.linkedin },
]

export function LandingFooter() {
  return (
    <footer className="border-t border-border/40 bg-card text-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Logo & Description */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-sm">
            <DakoLogo size={28} />
            <p className="text-muted-foreground text-sm font-light mt-4 leading-relaxed">
              We design and build premium websites that convert visitors into customers. Fully responsive, lightning-fast, and search-optimized.
            </p>
          </div>

          {/* Links grid matching design system footer-links */}
          <div className="flex flex-col items-center md:items-end gap-4">
            <div className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2 text-sm">
              <a href="/labs" className="text-muted-foreground hover:text-primary transition-colors font-medium">Labs</a>
              <span className="text-muted-foreground/20">·</span>
              <a href="#services" className="text-muted-foreground hover:text-primary transition-colors font-medium">Brand</a>
              <span className="text-muted-foreground/20">·</span>
              <a href="#services" className="text-muted-foreground hover:text-primary transition-colors font-medium">Motion</a>
              <span className="text-muted-foreground/20">·</span>
              <a href="#services" className="text-muted-foreground hover:text-primary transition-colors font-medium">Film</a>
              <span className="text-muted-foreground/20">·</span>
              <a href="https://learn.dako.studio" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors font-medium">Academy</a>
            </div>

            <div className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2 text-xs text-muted-foreground/60">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  {social.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-border/20" />

        {/* Bottom Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted-foreground/60">
          <div>
            <span>© 2026 Dakonoveu Ltd. Abuja, Nigeria.</span>
          </div>
          <div className="flex items-center space-x-6">
            <a href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Terms of Service
            </a>
            <span className="text-muted-foreground/40">Serving Clients Worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
