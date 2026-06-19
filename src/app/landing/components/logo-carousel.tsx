"use client"

import Image from 'next/image'

type ClientLogo = {
  name: string
  logo: string
}

// Drop logo files into /public/images/clients/ and list them here.
// Format: PNG or SVG, ideally dark/transparent background.
const clients: ClientLogo[] = [
  { name: 'Native Filmworks', logo: '/images/clients/native-filmworks.png' },
  { name: 'Data Sentinels', logo: '/images/clients/data-sentinels.png' },
  { name: 'Amnik Enterprise', logo: '/images/clients/amnik-enterprise.png' },
]

function ClientLogoItem({ client }: { client: ClientLogo }) {
  return (
    <div className="flex-shrink-0 flex items-center justify-center h-12 w-40 opacity-50 hover:opacity-100 transition-opacity duration-300">
      <Image
        src={client.logo}
        alt={client.name}
        width={120}
        height={40}
        className="object-contain max-h-10 w-auto dark:invert"
        onError={(e) => {
          // Fallback to text if image not found
          const target = e.target as HTMLImageElement
          target.style.display = 'none'
          const span = document.createElement('span')
          span.className = 'text-sm font-semibold text-foreground'
          span.textContent = client.name
          target.parentNode?.appendChild(span)
        }}
      />
    </div>
  )
}

export function LogoCarousel() {
  if (clients.length === 0) return null

  return (
    <section className="py-12 border-t border-border/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-bold tracking-[0.18em] text-muted-foreground uppercase text-center mb-8">
          Trusted by
        </p>

        <div className="relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          <div className="overflow-hidden">
            <div className="flex animate-logo-scroll space-x-12">
              {[...clients, ...clients].map((client, index) => (
                <ClientLogoItem key={index} client={client} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
