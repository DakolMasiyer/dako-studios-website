"use client"

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowUpRight, TextAlignJustify } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList
} from '@/components/ui/navigation-menu'
import { DakoLogo } from '@/components/dako-logo'
import { ModeToggle } from '@/components/mode-toggle'
import { rootNavItems, labsNavItems } from '@/data/site'
import { cn } from '@/lib/utils'

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

const CollaborateButton = ({
  className,
  onClick,
  href,
}: {
  className?: string
  onClick?: (e: React.MouseEvent) => void
  href: string
}) => (
  <Button
    asChild
    className={cn(
      "relative text-sm font-medium rounded-full h-10 p-1 ps-4 pr-12 group transition-all duration-500 hover:ps-12 hover:pr-4 w-fit overflow-hidden hover:bg-primary/80 cursor-pointer bg-primary text-primary-foreground shadow-xs",
      className
    )}
  >
    <a href={href} onClick={onClick}>
      <span className="relative z-10 transition-all duration-500">
        Start a Project
      </span>
      <div className="absolute right-1 w-8 h-8 bg-background text-foreground rounded-full flex items-center justify-center transition-all duration-500 group-hover:right-[calc(100%-36px)] group-hover:rotate-45">
        <ArrowUpRight size={16} />
      </div>
    </a>
  </Button>
)

export function LandingNavbar() {
  const [sticky, setSticky] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const isLabs = pathname === '/labs' || pathname?.startsWith('/labs')

  const navigationItems = isLabs ? labsNavItems : rootNavItems

  const handleScroll = useCallback(() => {
    setSticky(window.scrollY >= 50)
  }, [])

  const handleResize = useCallback(() => {
    if (window.innerWidth >= 1024) setIsOpen(false)
  }, [])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleResize)
    }
  }, [handleScroll, handleResize])

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      smoothScrollTo(href)
    }
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-500",
        sticky
          ? "bg-transparent py-2"
          : "bg-background/80 backdrop-blur-xl border-b border-border/20 py-0"
      )}
    >
      <div className="w-full px-4 sm:px-6">
        <nav
          className={cn(
            "w-full flex items-center justify-between gap-3.5 lg:gap-6 transition-all duration-500",
            sticky
              ? "max-w-5xl mx-auto p-2 bg-background/60 backdrop-blur-lg border border-border/40 shadow-2xl shadow-primary/5 rounded-full px-4 sm:px-6"
              : "max-w-7xl mx-auto py-4 bg-transparent border-transparent"
          )}
        >
          {/* Logo */}
          <Link href={isLabs ? "/labs" : "/"} className="flex items-center space-x-2 cursor-pointer">
            <DakoLogo size={28} />
          </Link>

          {/* Desktop Navigation */}
          <div>
            <NavigationMenu className="max-lg:hidden bg-muted p-0.5 rounded-full">
              <NavigationMenuList className="flex gap-0">
                {navigationItems.map((item) => (
                  <NavigationMenuItem key={item.name}>
                    {item.isExternal ? (
                      <NavigationMenuLink
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 lg:px-4 py-2 text-sm font-medium rounded-full text-muted-foreground hover:text-foreground hover:bg-background outline outline-transparent hover:outline-border hover:shadow-xs transition tracking-normal cursor-pointer"
                      >
                        {item.name}
                      </NavigationMenuLink>
                    ) : item.href.startsWith('/') ? (
                      <Link href={item.href} passHref legacyBehavior>
                        <NavigationMenuLink
                          className="px-2 lg:px-4 py-2 text-sm font-medium rounded-full text-muted-foreground hover:text-foreground hover:bg-background outline outline-transparent hover:outline-border hover:shadow-xs transition tracking-normal cursor-pointer"
                        >
                          {item.name}
                        </NavigationMenuLink>
                      </Link>
                    ) : (
                      <NavigationMenuLink
                        href={item.href}
                        onClick={(e) => handleLinkClick(e, item.href)}
                        className="px-2 lg:px-4 py-2 text-sm font-medium rounded-full text-muted-foreground hover:text-foreground hover:bg-background outline outline-transparent hover:outline-border hover:shadow-xs transition tracking-normal cursor-pointer"
                      >
                        {item.name}
                      </NavigationMenuLink>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Desktop CTA & Theme Toggle */}
          <div className="hidden lg:flex items-center gap-4">
            <ModeToggle variant="ghost" />
            <CollaborateButton
              href="#contact"
              onClick={(e) => handleLinkClick(e, '#contact')}
            />
          </div>

          {/* Mobile Menu & Theme Toggle */}
          <div className="lg:hidden flex items-center gap-2">
            <ModeToggle variant="ghost" />
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
              <DropdownMenuTrigger className="rounded-full bg-background border border-border p-2 outline-none flex items-center justify-center cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground">
                <TextAlignJustify size={20} />
                <span className="sr-only">Menu</span>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-56 mt-2"
              >
                {navigationItems.map((item) => (
                  <DropdownMenuItem key={item.name} asChild>
                    {item.isExternal ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full cursor-pointer text-sm font-medium px-2 py-1.5 block"
                      >
                        {item.name}
                      </a>
                    ) : item.href.startsWith('/') ? (
                      <Link
                        href={item.href}
                        className="w-full cursor-pointer text-sm font-medium px-2 py-1.5 block"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ) : (
                      <a
                        href={item.href}
                        className="w-full cursor-pointer text-sm font-medium px-2 py-1.5 block"
                        onClick={(e) => {
                          setIsOpen(false)
                          handleLinkClick(e, item.href)
                        }}
                      >
                        {item.name}
                      </a>
                    )}
                  </DropdownMenuItem>
                ))}

                {/* Mobile Extra CTA in Dropdown */}
                <div className="border-t border-border/40 mt-1 pt-1.5 px-1">
                  <DropdownMenuItem asChild>
                    <a
                      href="#contact"
                      className="w-full cursor-pointer text-sm font-semibold text-primary px-2 py-1.5 block text-center"
                      onClick={(e) => {
                        setIsOpen(false)
                        handleLinkClick(e, '#contact')
                      }}
                    >
                      Start a Project
                    </a>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </nav>
      </div>
    </header>
  )
}
