import React from 'react';
import AnimatedBackground from '../components/AnimatedBackground';

const HeroSection: React.FC = () => {
  return (
    <section 
      id="hero" 
      className="relative h-screen flex items-center justify-center text-center overflow-hidden bg-gray-50 dark:bg-[#0a0a0a]"
    >
      <AnimatedBackground />
      
      <div className="relative z-10 p-4">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight mb-4">
          Hi, I'm <span className="text-cyan-500 dark:text-cyan-400">Nikhilesh</span>
        </h1>
        <p className="text-lg md:text-2xl font-light text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
          AIML Enthusiast | CSE Student | Full-Stack Developer
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="#projects" className="bg-cyan-500 text-white font-semibold py-3 px-8 rounded-full hover:bg-cyan-600 transition-colors duration-300">
            View My Work
          </a>
          <a href="#contact" className="border border-cyan-500 dark:border-cyan-400 text-cyan-600 dark:text-cyan-400 font-semibold py-3 px-8 rounded-full hover:bg-cyan-500 dark:hover:bg-cyan-400 hover:text-white dark:hover:text-gray-900 transition-colors duration-300">
            Work Together
          </a>
          <a href="/resume.html" target="_blank" rel="noopener noreferrer" className="bg-gray-700 text-white font-semibold py-3 px-8 rounded-full hover:bg-gray-600 transition-colors duration-300">
            Download Resume
          </a>
        </div>
      </div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
        <a href="#about" aria-label="Scroll down">
          <svg className="w-8 h-8 text-gray-400 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
        </a>
      </div>
    </section>
  );
};

export default HeroSection;