import { LandingHeader } from "@/components/landing/header"
import { LandingHero } from "@/components/landing/hero"
import { LandingFeatures } from "@/components/landing/features"
import { LandingFooter } from "@/components/landing/footer"
import ContactSection from "@/components/landing/contact"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <LandingHeader />
      <main>
        <LandingHero />
        <section id="about" className="py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold text-foreground md:text-4xl mb-6">About FuelFlow</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                FuelFlow was built to address the unique challenges faced by petrol pump owners and managers. Our
                platform combines powerful features with an intuitive interface, making it easy to manage sales, track
                inventory, monitor staff attendance, and generate reports—all from one place. Whether you operate a
                single pump or manage multiple locations, FuelFlow scales with your business.
              </p>
            </div>
          </div>
        </section>
        <LandingFeatures />
        <ContactSection/>
      </main>
      <LandingFooter />
    </div>
  )
}
