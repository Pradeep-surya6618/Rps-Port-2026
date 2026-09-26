import { SiteProvider } from "@/components/providers/SiteProvider";
import { IntroLoader } from "@/components/intro/IntroLoader";
import { LightningCursor } from "@/components/cursor/LightningCursor";
import { ScrollProgress } from "@/components/animation/ScrollProgress";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { TechStack } from "@/components/sections/TechStack";
import { Philosophy } from "@/components/sections/Philosophy";
import { Instagram } from "@/components/sections/Instagram";
import { Education } from "@/components/sections/Education";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <SiteProvider>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <IntroLoader />
      <LightningCursor />
      <ScrollProgress />
      <Navbar />
      <main id="main">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <TechStack />
        <Philosophy />
        <Instagram />
        <Education />
        <Contact />
      </main>
      <Footer />
    </SiteProvider>
  );
}
