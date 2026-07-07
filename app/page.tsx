import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { Architecture } from '@/components/landing/Architecture';
import { CallToAction } from '@/components/landing/CallToAction';
import { Footer } from '@/components/layout/Footer';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <Architecture />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}
