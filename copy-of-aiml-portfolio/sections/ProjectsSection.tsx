
import React, { useState, useMemo, useRef, useEffect } from 'react';
import Section from '../components/Section';
import { PROJECTS } from '../constants';
import type { Project } from '../types';
import ProjectModal from '../components/ProjectModal';

const INITIAL_LOAD_COUNT = 4;
const LOAD_MORE_COUNT = 4;

const ProjectCard: React.FC<{ project: Project; onClick: () => void; onDeepDiveClick: () => void; index: number }> = ({ project, onClick, onDeepDiveClick, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        root: null, // observe viewport
        rootMargin: '0px',
        threshold: 0.1 // trigger when 10% of the item is visible
      }
    );

    const currentCardRef = cardRef.current;
    if (currentCardRef) {
      observer.observe(currentCardRef);
    }

    return () => {
      if (currentCardRef) {
        observer.unobserve(currentCardRef);
      }
    };
  }, []);

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      className={`group cursor-pointer bg-white dark:bg-gray-800/50 backdrop-blur-lg border border-gray-200 dark:border-white/10 rounded-lg overflow-hidden transform mb-4 md:mb-8 break-inside-avoid transition-all duration-300 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      } hover:-translate-y-2 hover:scale-[1.03] hover:shadow-xl dark:hover:shadow-cyan-800/20`}
      style={{ transitionDelay: `${index * 100}ms` }}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
    >
      <img src={project.image} alt={project.title} className="w-full h-auto object-cover" />
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{project.title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{project.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map(tag => (
            <span key={tag} className="bg-gray-200 dark:bg-gray-700 text-cyan-700 dark:text-cyan-300 text-xs font-semibold px-2.5 py-1 rounded-full">{tag}</span>
          ))}
        </div>
        <div className="flex justify-between items-center text-sm" onClick={(e) => e.stopPropagation()}>
           <button 
              onClick={onDeepDiveClick}
              className="font-medium text-cyan-600 dark:text-cyan-400 hover:underline transition-colors"
              title="Get a technical explanation using AI"
            >
              AI Deep Dive
            </button>
          <div className="flex space-x-4">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-gray-600 dark:text-gray-300 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors" onKeyPress={(e) => e.stopPropagation()}>
                Live Demo
              </a>
            )}
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-gray-600 dark:text-gray-300 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors" onKeyPress={(e) => e.stopPropagation()}>
              GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectCardSkeleton: React.FC = () => (
  <div className="bg-gray-100 dark:bg-gray-800/50 backdrop-blur-lg border border-gray-200 dark:border-white/10 rounded-lg overflow-hidden mb-4 md:mb-8 break-inside-avoid">
    <div className="w-full h-48 bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
    <div className="p-6">
      <div className="h-6 w-3/4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-3"></div>
      <div className="h-4 w-full bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
      <div className="h-4 w-5/6 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
      <div className="flex flex-wrap gap-2">
        <div className="h-6 w-16 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse"></div>
        <div className="h-6 w-20 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse"></div>
      </div>
    </div>
  </div>
);

const ProjectsSection: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [startDeepDive, setStartDeepDive] = useState(false);
  const [visibleCount, setVisibleCount] = useState(INITIAL_LOAD_COUNT);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const filteredProjects = useMemo(() => {
    if (filter === 'All') return PROJECTS;
    return PROJECTS.filter(p => p.category === filter);
  }, [filter]);
  
  // Reset visible count when filter changes
  useEffect(() => {
    setVisibleCount(INITIAL_LOAD_COUNT);
  }, [filter]);

  const projectsToShow = useMemo(() => {
    return filteredProjects.slice(0, visibleCount);
  }, [filteredProjects, visibleCount]);

  const categories = ['All', ...Array.from(new Set(PROJECTS.map(p => p.category)))];

  const handleDeepDiveClick = (project: Project) => {
    setSelectedProject(project);
    setStartDeepDive(true);
  };

  const handleCardClick = (project: Project) => {
    setSelectedProject(project);
    setStartDeepDive(false);
  };
  
  const handleCloseModal = () => {
    setSelectedProject(null);
    setStartDeepDive(false);
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + LOAD_MORE_COUNT);
  };

  return (
    <Section id="projects" title="My Projects">
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 dark:bg-gray-800/50 backdrop-blur-lg p-1.5 rounded-full flex space-x-1">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
                filter === category
                  ? 'bg-cyan-500 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      <div className="md:columns-2 lg:columns-3 gap-4 md:gap-8">
        {loading
          ? Array.from({ length: INITIAL_LOAD_COUNT }).map((_, i) => <ProjectCardSkeleton key={i} />)
          : projectsToShow.map((project, index) => (
              <ProjectCard 
                key={`${project.title}-${index}`}
                project={project} 
                index={index}
                onClick={() => handleCardClick(project)}
                onDeepDiveClick={() => handleDeepDiveClick(project)}
              />
            ))}
      </div>

      {!loading && visibleCount < filteredProjects.length && (
        <div className="text-center mt-12">
          <button
            onClick={handleLoadMore}
            className="bg-cyan-500 text-white font-semibold py-3 px-8 rounded-full hover:bg-cyan-600 transition-colors duration-300"
          >
            Load More Projects
          </button>
        </div>
      )}

      {selectedProject && (
        <ProjectModal 
            project={selectedProject} 
            onClose={handleCloseModal}
            startDeepDive={startDeepDive}
        />
      )}
    </Section>
  );
};

export default ProjectsSection;