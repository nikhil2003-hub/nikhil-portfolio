
import React from 'react';
import Section from '../components/Section';
import { SKILLS } from '../constants';

const SkillsSection: React.FC = () => {
  return (
    <Section id="skills" title="My Tech Stack">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {SKILLS.map((skill, index) => (
            <div key={index} className="group flex flex-col items-center p-4 bg-gray-100/60 dark:bg-gray-800/40 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-lg transition-all duration-300 hover:scale-105 hover:bg-cyan-400/10 dark:hover:bg-cyan-500/10">
              {React.cloneElement(skill.icon, { animationDelay: `${index * 300}ms` })}
              <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">{skill.name}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default SkillsSection;