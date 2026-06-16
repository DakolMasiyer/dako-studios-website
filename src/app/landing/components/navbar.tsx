"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet'
import { DakoLogo } from '@/components/dako-logo'
import { ModeToggle } from '@/components/mode-toggle'
import { rootNavItems, labsNavItems } from '@/data/site'

// Smooth scroll function
const smoothScrollTo = (targetId: string) => {
  if (targetId.startsWith('#')) {
    const element = document.querySelector(targetId)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }
}

export function LandingNavbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const isLabs = pathname === '/labs' || pathname?.startsWith('/labs')

  const navigationItems = isLabs ? labsNavItems : rootNavItems

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      smoothScrollTo(href)
    } else if (href.startsWith('/labs#') && !isLabs) {
      // If we are navigating from root to a hash on labs
      // Allow default link behavior to navigate
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Link href={isLabs ? "/labs" : "/"} className="flex items-center space-x-2 cursor-pointer">
            <DakoLogo size={28} />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-1">
          {navigationItems.map((item) => (
            item.isExternal ? (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-max items-center justify-center px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary focus:outline-none cursor-pointer"
              >
                {item.name}
              </a>
            ) : (
              item.href.startsWith('/') ? (
                <Link
                  key={item.name}
                  href={item.href}
                  className="inline-flex h-10 w-max items-center justify-center px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary focus:outline-none cursor-pointer"
                >
                  {item.name}
                </Link>
              ) : (
                <a
                  key={item.name}
                  href={item.href}
                  className="inline-flex h-10 w-max items-center justify-center px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary focus:outline-none cursor-pointer"
                  onClick={(e) => handleLinkClick(e, item.href)}
                >
                  {item.name}
                </a>
              )
            )
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center space-x-4">
          <ModeToggle variant="ghost" />
          <Button asChild className="cursor-pointer font-medium bg-primary text-primary-foreground hover:bg-primary/95">
            <a href="#contact" onClick={(e) => handleLinkClick(e, '#contact')}>
              Start a Project
              <ArrowRight className="h-4 w-4 ml-2" />
            </a>
          </Button>
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="cursor-pointer">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:w-[350px] p-6 gap-0 [&>button]:hidden overflow-hidden flex flex-col">
            <div className="flex flex-col h-full justify-between">
              {/* Header */}
              <div className="space-y-4">
                <SheetHeader className="space-y-0 pb-4 border-b flex flex-row items-center justify-between">
                  <DakoLogo size={24} />
                  <div className="flex items-center gap-2">
                    <ModeToggle variant="ghost" />
                    <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="cursor-pointer h-8 w-8">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </SheetHeader>

                {/* Navigation Links */}
                <nav className="space-y-1 mt-6">
                  {navigationItems.map((item) => (
                    item.isExternal ? (
                      <a
                        key={item.name}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center px-4 py-3 text-base font-medium rounded-lg transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer text-muted-foreground hover:text-primary"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </a>
                    ) : (
                      item.href.startsWith('/') ? (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-center px-4 py-3 text-base font-medium rounded-lg transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer text-muted-foreground hover:text-primary"
                          onClick={() => setIsOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ) : (
                        <a
                          key={item.name}
                          href={item.href}
                          className="flex items-center px-4 py-3 text-base font-medium rounded-lg transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer text-muted-foreground hover:text-primary"
                          onClick={(e) => {
                            setIsOpen(false)
                            handleLinkClick(e, item.href)
                          }}
                        >
                          {item.name}
                        </a>
                      )
                    )
                  ))}
                </nav>
              </div>

              {/* CTA */}
              <div className="border-t pt-6">
                <Button asChild size="lg" className="w-full cursor-pointer bg-primary text-primary-foreground">
                  <a href="#contact" onClick={(e) => {
                    setIsOpen(false);
                    handleLinkClick(e, '#contact');
                  }}>
                    Start a Project
                  </a>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
