"use client"

import { useState } from "react"
import { ArrowRight, BarChart3, Shield, Users, Fuel } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LoginModal } from "@/components/login-modal"

export function LandingHero() {
  const [isLoginOpen, setIsLoginOpen] = useState(false)

  return (
    <>
      <section className="relative overflow-hidden bg-background py-20 md:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

        <div className="container mx-auto px-4 relative">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              <Fuel className="h-4 w-4" />
              Modern Pump Management
            </div>

            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-6xl text-balance">
              Streamline Your <span className="text-primary">Petrol Pump</span> Operations
            </h1>

            <p className="mb-8 text-lg text-muted-foreground md:text-xl text-pretty">
              FuelFlow is a comprehensive management system designed to help petrol pump owners track sales, manage
              staff, monitor inventory, and optimize daily operations with ease.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" onClick={() => setIsLoginOpen(true)} className="gap-2">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#features">Learn More</a>
              </Button>
            </div>
          </div>

          {/* Feature highlights */}
          <div className="mt-20 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: BarChart3,
                title: "Sales Tracking",
                description: "Monitor real-time sales data, analyze trends, and generate comprehensive reports.",
              },
              {
                icon: Users,
                title: "Staff Management",
                description: "Manage employees, track attendance with GPS verification, and assign shifts efficiently.",
              },
              {
                icon: Shield,
                title: "Role-Based Access",
                description: "Secure access control with Super Admin, Admin, and Staff roles for your organization.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/30"
              >
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-card-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  )
}
