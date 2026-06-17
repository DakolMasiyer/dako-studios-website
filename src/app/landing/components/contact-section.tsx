"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Mail, MessageSquare, MapPin, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { siteConfig } from '@/data/site'

const contactFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  contactInfo: z.string().min(5, {
    message: "Please provide your email address or WhatsApp number.",
  }),
  service: z.enum(["labs", "brand", "motion", "film", "academy"]),
  message: z.string().min(10, {
    message: "Project details must be at least 10 characters.",
  }),
})

export function ContactSection() {
  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      contactInfo: "",
      service: "labs",
      message: "",
    },
  })

  const [isPending, setIsPending] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  async function onSubmit(values: z.infer<typeof contactFormSchema>) {
    setIsPending(true)
    setSubmitStatus("idle")
    try {
      const response = await fetch("https://learn.dako.studio/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      setSubmitStatus("success")
      form.reset()
    } catch (error) {
      console.error("Submit error:", error)
      setSubmitStatus("error")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <section id="contact" className="py-24 sm:py-32 relative bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <span className="font-sans text-xs font-bold tracking-[0.18em] text-primary uppercase block mb-4">
            Start a Project
          </span>
          <h2 className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight mb-4 text-foreground leading-none">
            Ready to build something that grows with you?
          </h2>
          <p className="text-lg text-muted-foreground font-light max-w-xl mx-auto leading-relaxed">
            Send a brief description of your business and what you need. We respond within 2 hours during business hours.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-5 max-w-5xl mx-auto">
          {/* Direct channels */}
          <div className="lg:col-span-2 space-y-6 flex flex-col justify-between">
            <Card className="border border-border/40 bg-card flex-1 flex flex-col justify-between rounded-[8px]">
              <div>
                <CardHeader>
                  <CardTitle className="font-display text-2xl font-bold tracking-tight text-foreground">Direct Channels</CardTitle>
                  <CardDescription className="text-sm font-light text-muted-foreground leading-relaxed">
                    Reach out directly via email or message us on WhatsApp for an immediate response.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Location Info */}
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-primary/10 rounded-[4px] text-primary">
                      <MapPin className="h-5 w-5" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">Location</h4>
                      <p className="text-sm text-muted-foreground">
                        {siteConfig.contact.address}
                      </p>
                    </div>
                  </div>

                  {/* Global Scope */}
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-primary/10 rounded-[4px] text-primary">
                      <Globe className="h-5 w-5" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">Scope</h4>
                      <p className="text-sm text-muted-foreground">
                        Serving Nigeria &amp; the diaspora
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-primary/10 rounded-[4px] text-primary">
                      <Mail className="h-5 w-5" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">Email us</h4>
                      <a href={`mailto:${siteConfig.contact.email}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                        {siteConfig.contact.email}
                      </a>
                    </div>
                  </div>

                </CardContent>
              </div>

              {/* Direct Actions */}
              <div className="p-6 pt-0 space-y-3">
                <Button size="lg" className="w-full cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex items-center justify-center space-x-2 rounded-[4px] h-12" asChild>
                  <a href={`mailto:${siteConfig.contact.email}`}>
                    <Mail className="h-4 w-4" strokeWidth={1.5} />
                    <span>Email Studio</span>
                  </a>
                </Button>
                <Button size="lg" className="w-full cursor-pointer bg-[#25D366] hover:bg-[#20BA5A] text-white border-none font-semibold flex items-center justify-center space-x-2 rounded-[4px] h-12" asChild>
                  <a href={siteConfig.contact.whatsapp} target="_blank" rel="noopener noreferrer">
                    <MessageSquare className="h-4 w-4 fill-current" />
                    <span>WhatsApp Us →</span>
                  </a>
                </Button>
              </div>
            </Card>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <Card className="border border-border/40 bg-card rounded-[8px]">
              <CardHeader>
                <CardTitle className="font-display text-2xl font-bold tracking-tight text-foreground">Submit a Brief</CardTitle>
                <CardDescription className="text-sm font-light text-muted-foreground leading-relaxed">
                  Tell us about your business and goals, and we'll reply in 2 hours with next steps.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Name */}
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. John Doe" className="bg-background border-border/30 h-11 focus-visible:ring-primary rounded-[4px]" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Contact Info */}
                    <FormField
                      control={form.control}
                      name="contactInfo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email or WhatsApp Number</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. hello@example.com or +234..." className="bg-background border-border/30 h-11 focus-visible:ring-primary rounded-[4px]" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Service Area */}
                    <FormField
                      control={form.control}
                      name="service"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Service Area</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-background border-border/30 h-11 focus:ring-primary rounded-[4px] text-muted-foreground cursor-pointer">
                                <SelectValue placeholder="Select a service area" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-card border-border/30 text-foreground">
                              <SelectItem value="labs" className="cursor-pointer hover:bg-secondary">Labs (Web Design &amp; Dev)</SelectItem>
                              <SelectItem value="brand" className="cursor-pointer hover:bg-secondary">Brand (Identity &amp; Marketing)</SelectItem>
                              <SelectItem value="motion" className="cursor-pointer hover:bg-secondary">Motion (Design &amp; Video)</SelectItem>
                              <SelectItem value="film" className="cursor-pointer hover:bg-secondary">Film (BTS &amp; Premiere)</SelectItem>
                              <SelectItem value="academy" className="cursor-pointer hover:bg-secondary">Academy (Bootcamp)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Message */}
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Project Details & Goals</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Briefly describe your business and what you need in a website..."
                              rows={5}
                              className="bg-background border-border/30 focus-visible:ring-primary rounded-[4px] min-h-32"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {submitStatus === "success" && (
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm rounded-[4px]">
                        Thank you! Your project request has been successfully submitted. We will get back to you within 2 hours.
                      </div>
                    )}
                    {submitStatus === "error" && (
                      <div className="p-3 bg-destructive/10 border border-destructive/30 text-destructive-foreground text-sm rounded-[4px]">
                        Failed to send request. Please try emailing us directly or message us on WhatsApp instead.
                      </div>
                    )}

                    <Button 
                      type="submit" 
                      disabled={isPending}
                      className="w-full cursor-pointer h-12 bg-primary text-primary-foreground hover:bg-primary/95 text-base font-semibold rounded-[4px] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isPending ? "Submitting Request..." : "Submit Project Request"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Footer Note */}
        <div className="text-center mt-12">
          <p className="text-xs text-muted-foreground/60 font-medium tracking-wide">
            Based in Abuja, Nigeria · Serving Nigeria &amp; the diaspora · 50% deposit to start
          </p>
        </div>
      </div>
    </section>
  )
}
