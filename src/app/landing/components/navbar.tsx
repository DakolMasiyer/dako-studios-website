"use client"

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowUpRight, TextAlignJustify, Terminal, Sparkles, Video, Clapperboard, GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { DakoLogo } from '@/components/dako-logo'
import { ModeToggle } from '@/components/mode-toggle'
import { rootNavItems, labsNavItems, motionNavItems } from '@/data/site'
import { services } from '@/data/services'
import { cn } from '@/lib/utils'

const smoothScrollTo = (targetId: string) => {
  if (targetId.startsWith('#')) {
    const element = document.querySelector(targetId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
}

const armIconMap = {
  labs: Terminal,
  brand: Sparkles,
  motion: Video,
  film: Clapperboard,
  academy: GraduationCap,
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
      <span className="relative z-10 transition-all duration-500">Start a Project</span>
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
  const isMotion = pathname === '/motion' || pathname?.startsWith('/motion')
  const isArmPage = isLabs || isMotion

  const navigationItems = isLabs ? labsNavItems : isMotion ? motionNavItems : rootNavItems

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

  const navItemClass = "px-2 lg:px-4 py-2 text-sm font-medium rounded-full text-muted-foreground hover:text-foreground hover:bg-background outline outline-transparent hover:outline-border hover:shadow-xs transition tracking-normal cursor-pointer"

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
          <Link href={isLabs ? "/labs" : isMotion ? "/motion" : "/"} className="flex items-center space-x-2 cursor-pointer">
            <DakoLogo size={28} />
          </Link>

          {/* Desktop Navigation */}
          {!isArmPage && (
            <NavigationMenu viewport={false} className="max-lg:hidden bg-muted p-0.5 rounded-full">
              <NavigationMenuList className="flex gap-0">
                {/* Services flyout */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={cn(navItemClass, "bg-transparent data-[state=open]:bg-background data-[state=open]:text-foreground data-[state=open]:shadow-xs data-[state=open]:outline-border")}
                  >
                    Services
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="min-w-[320px] p-2 rounded-xl border border-border/40 bg-popover shadow-xl">
                    <ul className="space-y-0.5">
                      {services.map((service) => {
                        const Icon = armIconMap[service.id as keyof typeof armIconMap] || Terminal
                        const isActive = service.isClickable

                        const inner = (
                          <div className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                            isActive
                              ? "hover:bg-muted cursor-pointer"
                              : "opacity-50 cursor-default"
                          )}>
                            <div className="p-1.5 bg-primary/10 rounded-md shrink-0">
                              <Icon className="size-4 text-primary" strokeWidth={1.5} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-foreground">{service.subtitle}</span>
                                <span className={cn(
                                  "text-[10px] font-bold tracking-[0.1em] uppercase px-1.5 py-0.5 rounded-full",
                                  isActive
                                    ? "bg-primary/10 text-primary"
                                    : "bg-muted text-muted-foreground"
                                )}>
                                  {service.badge}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground truncate mt-0.5">{service.description}</p>
                            </div>
                            {isActive && (
                              <ArrowUpRight className="size-3.5 text-muted-foreground shrink-0" strokeWidth={1.5} />
                            )}
                          </div>
                        )

                        if (!isActive) return <li key={service.id}>{inner}</li>

                        const isExternal = service.href?.startsWith('http')
                        return (
                          <li key={service.id}>
                            <NavigationMenuLink asChild>
                              {isExternal ? (
                                <a href={service.href} target="_blank" rel="noopener noreferrer">
                                  {inner}
                                </a>
                              ) : (
                                <Link href={service.href!}>
                                  {inner}
                                </Link>
                              )}
                            </NavigationMenuLink>
                          </li>
                        )
                      })}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Remaining nav items */}
                {navigationItems.map((item) => (
                  <NavigationMenuItem key={item.name}>
                    {item.isExternal ? (
                      <NavigationMenuLink
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={navItemClass}
                      >
                        {item.name}
                      </NavigationMenuLink>
                    ) : item.href.startsWith('/') ? (
                      <NavigationMenuLink asChild className={navItemClass}>
                        <Link href={item.href}>{item.name}</Link>
                      </NavigationMenuLink>
                    ) : (
                      <NavigationMenuLink
                        href={item.href}
                        onClick={(e) => handleLinkClick(e, item.href)}
                        className={navItemClass}
                      >
                        {item.name}
                      </NavigationMenuLink>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          )}

          {/* Arm nav (no Services dropdown) */}
          {isArmPage && (
            <NavigationMenu className="max-lg:hidden bg-muted p-0.5 rounded-full">
              <NavigationMenuList className="flex gap-0">
                {navigationItems.map((item) => (
                  <NavigationMenuItem key={item.name}>
                    {item.href.startsWith('/') ? (
                      <NavigationMenuLink asChild className={navItemClass}>
                        <Link href={item.href}>{item.name}</Link>
                      </NavigationMenuLink>
                    ) : (
                      <NavigationMenuLink
                        href={item.href}
                        onClick={(e) => handleLinkClick(e, item.href)}
                        className={navItemClass}
                      >
                        {item.name}
                      </NavigationMenuLink>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          )}

          {/* Desktop CTA & Theme Toggle */}
          <div className="hidden lg:flex items-center gap-4">
            <ModeToggle variant="ghost" />
            <CollaborateButton href="/contact" />
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden flex items-center gap-2">
            <ModeToggle variant="ghost" />
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
              <DropdownMenuTrigger className="rounded-full bg-background border border-border p-2 outline-none flex items-center justify-center cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground">
                <TextAlignJustify size={20} />
                <span className="sr-only">Menu</span>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-64 mt-2">
                {/* Services header */}
                {!isArmPage && (
                  <>
                    <div className="px-2 py-1.5">
                      <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground">Services</p>
                    </div>
                    {services.map((service) => {
                      const Icon = armIconMap[service.id as keyof typeof armIconMap] || Terminal
                      const isActive = service.isClickable
                      const isExternal = service.href?.startsWith('http')

                      const label = (
                        <div className="flex items-center gap-2 w-full">
                          <Icon className="size-3.5 text-primary shrink-0" strokeWidth={1.5} />
                          <span className={cn("text-sm font-medium flex-1", !isActive && "text-muted-foreground")}>
                            {service.subtitle}
                          </span>
                          {!isActive && (
                            <span className="text-[9px] font-bold tracking-wider uppercase text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                              Soon
                            </span>
                          )}
                        </div>
                      )

                      return (
                        <DropdownMenuItem key={service.id} disabled={!isActive} asChild={isActive}>
                          {isActive ? (
                            isExternal ? (
                              <a
                                href={service.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full cursor-pointer px-2 py-1.5 block"
                                onClick={() => setIsOpen(false)}
                              >
                                {label}
                              </a>
                            ) : (
                              <Link
                                href={service.href!}
                                className="w-full cursor-pointer px-2 py-1.5 block"
                                onClick={() => setIsOpen(false)}
                              >
                                {label}
                              </Link>
                            )
                          ) : (
                            <div className="px-2 py-1.5 opacity-50">{label}</div>
                          )}
                        </DropdownMenuItem>
                      )
                    })}
                    <DropdownMenuSeparator />
                  </>
                )}

                {/* Regular nav items */}
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

                <DropdownMenuSeparator />
                <div className="px-1 pt-1">
                  <DropdownMenuItem asChild>
                    <Link
                      href="/contact"
                      className="w-full cursor-pointer text-sm font-semibold text-primary px-2 py-1.5 block text-center"
                      onClick={() => setIsOpen(false)}
                    >
                      Start a Project
                    </Link>
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
