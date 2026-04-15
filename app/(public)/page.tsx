import HeroSection from '@/components/HeroSection';
import ServicesSection from '@/components/ServicesSection';
import TherapyLocationFinder from '@/components/TherapistFinder';
import TrustSection from '@/components/TrustSection';
import FounderStorySection from '@/components/FounderStorySection';
import ArticlesSection from '@/components/ArticlesSection';
import CommunitySection from '@/components/CommunitySection';
import TherapyLocationRegistrationForm from '@/components/TherapyLocationRegistrationForm';
import ContactSection from '@/components/ContactSection';
import {
  getHomepageStats,
  getHomepageArticles,
  getHomepageThreads,
  getHomepageEvents,
} from '@/lib/api/seo';

export const revalidate = 3600;

export default async function HomePage() {
  const [stats, articles, threads, events] = await Promise.all([
    getHomepageStats(),
    getHomepageArticles(6),
    getHomepageThreads(4),
    getHomepageEvents(3),
  ]);

  return (
    <div className="min-h-screen bg-white">
      <HeroSection initialStats={stats} />
      <ServicesSection />
      <TherapyLocationFinder />
      <TrustSection />
      <FounderStorySection />
      <ArticlesSection initialArticles={articles} />
      <CommunitySection initialThreads={threads} initialEvents={events} />
      <TherapyLocationRegistrationForm />
      <ContactSection />
    </div>
  );
}
