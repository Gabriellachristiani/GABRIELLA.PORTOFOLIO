import { lazy, Suspense, useEffect, useState } from 'react';
import { PortfolioData } from './types/portfolio';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { ExperienceSection } from './components/ExperienceSection';
import { ProjectsSection } from './components/ProjectsSection';
import { SkillsSection } from './components/SkillsSection';
import { CertificationsSection } from './components/CertificationsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { RefreshCw } from 'lucide-react';
import { loadPortfolio } from './sanity/fetchPortfolio';

// Panel admin (Sanity Studio) hanya dimuat saat /admin dibuka, supaya situs publik tetap ringan.
const StudioPage = lazy(() => import('./sanity/StudioPage'));

function LoadingScreen({ text }: { text: string }) {
  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center text-[#2A1E17] gap-3">
      <RefreshCw className="w-5 h-5 animate-spin text-[#8C5E34]" />
      <span className="text-sm font-medium">{text}</span>
    </div>
  );
}

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname);
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);

  const isAdminRoute = currentPath.startsWith('/admin');

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);

    // Ctrl+Shift+A (atau Cmd+Shift+A) membuka admin
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        window.location.assign('/admin');
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (isAdminRoute) return;
    let cancelled = false;
    loadPortfolio()
      .then((data) => {
        if (!cancelled) setPortfolio(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isAdminRoute]);

  if (isAdminRoute) {
    return (
      <Suspense fallback={<LoadingScreen text="Membuka panel admin..." />}>
        <StudioPage />
      </Suspense>
    );
  }

  if (loading && !portfolio) {
    return <LoadingScreen text="Loading portfolio..." />;
  }

  return (
    <div className="min-h-screen bg-[#F8F5EF] text-[#3E2C22] flex flex-col font-sans selection:bg-[#E8DDD0] selection:text-[#3E2C22]">
      <Navbar profile={portfolio?.profile || null} />

      <main className="flex-grow">
        <Hero profile={portfolio?.profile || null} />
        <AboutSection profile={portfolio?.profile || null} />
        <ExperienceSection experiences={portfolio?.experiences || []} />
        <ProjectsSection projects={portfolio?.projects || []} />
        <SkillsSection
          certifications={portfolio?.certifications || []}
          profile={portfolio?.profile || null}
        />
        <CertificationsSection certifications={portfolio?.certifications || []} />
        <ContactSection profile={portfolio?.profile || null} />
      </main>

      <Footer profile={portfolio?.profile || null} />
    </div>
  );
}
