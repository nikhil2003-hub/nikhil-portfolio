import React from 'react';

const Footer: React.FC = () => {
  const socialLinks = [
    { name: 'GitHub', url: 'https://github.com/nikhil2003-hub', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg> },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/nikhilesh-konidala', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/></svg> },
    { name: 'Twitter', url: 'https://x.com/nani_0320?t=If0AFSMNIwiB-UFiPGq0cQ&s=09', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616v.064c0 2.299 1.634 4.212 3.793 4.649-.65.177-1.354.226-2.064.077.608 1.923 2.372 3.243 4.463 3.282-1.78 1.398-4.015 2.182-6.42 2.182-1.39 0-2.757-.081-4.093-.238 2.288 1.47 5.013 2.333 7.923 2.333 9.497 0 14.694-7.88 14.694-14.695 0-.224-.005-.447-.015-.668.998-.722 1.868-1.624 2.557-2.658z"/></svg> },
  ];

  return (
    <footer className="relative overflow-hidden bg-gray-100 dark:bg-gray-900/50">
       <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none select-none"
      >
        <span className="text-8xl md:text-9xl font-black text-gray-200/80 dark:text-gray-800/60 tracking-widest uppercase">
          NIKHILESH
        </span>
      </div>
      <div className="relative z-10 container mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-gray-500 dark:text-gray-400">
        <div className="flex justify-center space-x-6 mb-4">
          {socialLinks.map((link) => (
            <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">
              <span className="sr-only">{link.name}</span>
              {link.icon}
            </a>
          ))}
        </div>
        <p>&copy; {new Date().getFullYear()} Nikhilesh. All Rights Reserved.</p>
        <p className="text-xs mt-2">
          Designed & Built by{' '}
          <a href="https://github.com/nikhil2003-hub" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors font-semibold">
            Nikhilesh
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;