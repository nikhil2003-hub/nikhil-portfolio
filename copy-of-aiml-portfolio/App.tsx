
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroSection from './sections/HeroSection';
import AboutSection from './sections/AboutSection';
import SkillsSection from './sections/SkillsSection';
import ProjectsSection from './sections/ProjectsSection';
import ExperienceSection from './sections/ExperienceSection';
import LabsSection from './sections/LabsSection';
import BlogSection from './sections/BlogSection';
import ContactSection from './sections/ContactSection';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import LoginModal from './components/LoginModal';
import BlogPostPage from './components/blog/BlogPostPage';

const App: React.FC = () => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTheme = window.localStorage.getItem('theme');
      if (storedTheme) return storedTheme;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark'; // Default theme
  });

  const [currentSlug, setCurrentSlug] = useState<string | null>(null);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/blog/')) {
        setCurrentSlug(hash.substring('#/blog/'.length));
        window.scrollTo(0, 0);
      } else {
        setCurrentSlug(null);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // check on initial load
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);


  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Dynamic Title Update on Scroll
  useEffect(() => {
    if (currentSlug) return; // Don't run this effect on blog pages

    const sections = [
      { id: 'hero', title: "Konidala Nikhilesh | Portfolio" },
      { id: 'about', title: "About Me | Konidala Nikhilesh's Portfolio" },
      { id: 'skills', title: "My Skills | Konidala Nikhilesh's Portfolio" },
      { id: 'projects', title: "My Projects | Konidala Nikhilesh's Portfolio" },
      { id: 'experience', title: "My Experience | Konidala Nikhilesh's Portfolio" },
      { id: 'labs', title: "Interactive Labs | Konidala Nikhilesh's Portfolio" },
      { id: 'blog', title: "My Blog | Konidala Nikhilesh's Portfolio" },
      { id: 'contact', title: "Contact Me | Konidala Nikhilesh's Portfolio" }
    ];

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: Array.from(Array(101).keys(), i => i / 100) // Create thresholds for every 1%
    };
    
    let lastVisibleSectionId: string | null = null;

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      let mostVisibleEntry: IntersectionObserverEntry | null = null;

      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!mostVisibleEntry || entry.intersectionRatio > mostVisibleEntry.intersectionRatio) {
            mostVisibleEntry = entry;
          }
        }
      });
      
      if (mostVisibleEntry && mostVisibleEntry.target.id !== lastVisibleSectionId) {
          const section = sections.find(s => s.id === mostVisibleEntry!.target.id);
          if (section) {
            document.title = section.title;
            lastVisibleSectionId = section.id;
          }
      }
    };
    
    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const sectionElements = sections.map(s => document.getElementById(s.id)).filter(el => el);
    sectionElements.forEach(el => observer.observe(el!));

    return () => {
      sectionElements.forEach(el => observer.unobserve(el!));
    };
  }, [currentSlug]);

  return (
    <div className="bg-gray-50 dark:bg-[#0a0a0a] text-gray-800 dark:text-gray-300 transition-colors duration-300">
      <LoginModal />
      <Header theme={theme} toggleTheme={toggleTheme} />
      
      {currentSlug ? (
        <BlogPostPage slug={currentSlug} />
      ) : (
        <main>
          <HeroSection />
          <AboutSection />
          <SkillsSection />
          <ProjectsSection />
          <ExperienceSection />
          <LabsSection />
          <BlogSection />
          <ContactSection />
        </main>
      )}

      <Footer />
      {!currentSlug && <Chatbot />}
    </div>
  );
};

export default App;