import { Navbar } from './Navbar';
import { Hero } from './Hero';
import { LogoCloud } from './LogoCloud';
import { Features } from './Features';
import { HowItWorks } from './Howitworks';
import { Stats } from './Stats';
import { DashboardPreview } from './DashboardPreview';
import { Testimonials } from './Testimonials';
import { Pricing } from './Pricing';
import { FAQ } from './FAQ';
import { CTABanner } from './CTABanner';
import { Footer } from './Footer';
import { ReducedMotionProvider } from './context/ReducedMotionContext';

export const LandingPage = () => {
  return (
    <ReducedMotionProvider>
      <div className="min-h-screen bg-[#0b1120] text-white font-sans overflow-x-hidden">
        <Navbar />
        <Hero />
        <LogoCloud />
        <Features />
        <HowItWorks />
        <Stats />
        <DashboardPreview />
        <Testimonials />
        <Pricing />
        <FAQ />
        <CTABanner />
        <Footer />
      </div>
    </ReducedMotionProvider>
  );
};