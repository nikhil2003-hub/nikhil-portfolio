
import React, { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  theme: string;
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const navLinks = [
    { href: '#about', label: 'About' },
    { href: '#skills', label: 'Skills' },
    { href: '#projects', label: 'Projects' },
    { href: '#experience', label: 'Experience' },
    { href: '#labs', label: 'Labs' },
    { href: '#blog', label: 'Blog' },
    { href: '#contact', label: 'Contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    if (!href) return;

    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      const headerOffset = 100; // Increased offset for floating nav
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    } else if (href === '#') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (mobileNavOpen) {
      setMobileNavOpen(false);
    }
  };

  return (
    <div className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 flex justify-center pointer-events-none">
      <div className="w-full max-w-5xl pointer-events-auto">
        <header className={`transition-all duration-300 backdrop-blur-lg rounded-full ${scrolled ? 'bg-white/80 dark:bg-gray-900/80 shadow-lg border border-gray-200/50 dark:border-white/10' : 'bg-white/50 dark:bg-gray-900/50 border border-transparent'}`}>
          <div className="mx-auto px-6 sm:px-8">
            <div className="flex items-center justify-between h-16">
              <a href="#" onClick={handleNavLinkClick} className="text-xl font-bold text-gray-900 dark:text-white transition-colors hover:text-cyan-500 dark:hover:text-cyan-400">
                N<span className="text-cyan-500 dark:text-cyan-400">.</span>
              </a>
              <nav className="hidden md:flex items-center space-x-4">
                {navLinks.map((link) => (
                  <a 
                    key={link.href} 
                    href={link.href} 
                    onClick={handleNavLinkClick}
                    className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
                <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
              </nav>
              <div className="md:hidden flex items-center space-x-2">
                <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
                <button onClick={() => setMobileNavOpen(!mobileNavOpen)} className="text-gray-800 dark:text-white focus:outline-none">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    {mobileNavOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>
        {mobileNavOpen && (
          <div className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-md mt-2 rounded-2xl shadow-lg border border-gray-200/50 dark:border-white/10 overflow-hidden">
            <nav className="p-2">
              {navLinks.map((link) => (
                <a 
                  key={link.href} 
                  href={link.href} 
                  onClick={handleNavLinkClick} 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
