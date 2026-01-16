import HeroSection from '@/components/HeroSection';
import ServicesSection from '@/components/ServicesSection';
import TherapyLocationFinder from '@/components/TherapistFinder';
import ArticlesSection from '@/components/ArticlesSection';
import CommunitySection from '@/components/CommunitySection';
import TherapyLocationRegistrationForm from '@/components/TherapyLocationRegistrationForm';
import ContactSection from '@/components/ContactSection';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <ServicesSection />
      <TherapyLocationFinder />
      <ArticlesSection />
      <CommunitySection />
      <TherapyLocationRegistrationForm />
      <ContactSection />
    </div>
  );
}