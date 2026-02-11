import {
  HeroSection,
  SocialProofBar,
  ProblemSection,
  HowItWorksSection,
  FeaturesSection,
  CTASection,
} from '@/components/landing';

export function HomePage() {
  return (
    <div>
      <HeroSection />
      <SocialProofBar />
      <ProblemSection />
      <HowItWorksSection />
      <FeaturesSection />
      <CTASection />
    </div>
  );
}
