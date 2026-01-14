import React from 'react';
import Section from '../components/Section';
import { EXPERIENCES } from '../constants';
import type { Experience } from '../types';

const ExperienceCard: React.FC<{ experience: Experience; isLast: boolean }> = ({ experience, isLast }) => (
  <div className="relative pl-8 sm:pl-12 py-6">
    {/* Timeline vertical line */}
    {!isLast && <div className="absolute top-0 left-3 sm:left-4 w-px h-full bg-gray-300 dark:bg-gray-700"></div>}
    {/* Timeline dot */}
    <div className="absolute top-8 left-0 sm:left-1 w-6 h-6 bg-gray-100 dark:bg-gray-800 border-2 border-cyan-500 dark:border-cyan-400 rounded-full"></div>
    
    <div className="bg-white/60 dark:bg-gray-800/40 backdrop-blur-lg border border-gray-200 dark:border-white/10 p-6 rounded-lg">
      <p className="text-cyan-500 dark:text-cyan-400 font-semibold mb-1">{experience.date}</p>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{experience.role}</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-3">{experience.company}</p>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{experience.description}</p>
      {experience.achievements && (
        <ul className="list-disc list-inside mt-3 text-gray-700 dark:text-gray-300 space-y-1">
          {experience.achievements.map((ach, i) => (
            <li key={i}>{ach}</li>
          ))}
        </ul>
      )}
    </div>
  </div>
);


const ExperienceSection: React.FC = () => {
  return (
    <Section id="experience" title="Experience & Achievements">
      <div className="max-w-3xl mx-auto">
        {EXPERIENCES.map((exp, index) => (
          <ExperienceCard key={index} experience={exp} isLast={index === EXPERIENCES.length - 1} />
        ))}
      </div>
    </Section>
  );
};

export default ExperienceSection;
