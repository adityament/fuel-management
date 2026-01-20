import { LandingHeader } from "@/components/landing/header";
import { LandingHero } from "@/components/landing/hero";
import { LandingFeatures } from "@/components/landing/features";
import { LandingFooter } from "@/components/landing/footer";
import ContactSection from "@/components/landing/contact";
import AboutSection from "@/components/landing/about";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <LandingHeader />
      <main>
        <LandingHero />
        <AboutSection />
        <LandingFeatures />
        <ContactSection />
      </main>
      <LandingFooter />
    </div>
  );
}
