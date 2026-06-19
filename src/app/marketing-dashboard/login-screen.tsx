"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Eye, EyeOff, Loader2 } from 'lucide-react'
import { DakoLogo } from '@/components/dako-logo'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export function LoginScreen() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsPending(true)

    try {
      const response = await fetch('/api/marketing-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Incorrect password')
      }

      // Reload/redirect to trigger page refresh and read cookie
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Background radial overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(193,39,45,0.03),transparent_60%)] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        <div className="flex justify-center mb-2">
          <DakoLogo size={36} />
        </div>

        <Card className="border border-border/40 bg-card/60 backdrop-blur-md rounded-[8px] shadow-2xl">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="font-display text-2xl font-bold tracking-tight text-foreground">
              Internal Portal Lock
            </CardTitle>
            <CardDescription className="text-sm font-light text-muted-foreground">
              Please enter the master password to view the Strategy and CRM pipeline.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80 block">
                  Security Code
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/80">
                    <Lock className="h-4 w-4" />
                  </div>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-background/50 border-border/40 h-11 focus-visible:ring-primary rounded-[4px]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/30 text-destructive-foreground text-xs rounded-[4px] font-medium leading-none">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isPending}
                className="w-full cursor-pointer h-11 bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-semibold rounded-[4px] flex items-center justify-center space-x-2"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Unlocking...</span>
                  </>
                ) : (
                  <span>Access Dashboard</span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground/60">
          Authorized personnel only. Built by Dako Studios Labs.
        </p>
      </div>
    </div>
  )
}
