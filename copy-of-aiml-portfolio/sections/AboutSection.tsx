
import React from 'react';
import Section from '../components/Section';

const AboutSection: React.FC = () => {
  return (
    <Section id="about" title="About Me">
      <div className="max-w-4xl mx-auto text-center text-lg leading-relaxed text-gray-700 dark:text-gray-300">
        <p className="mb-6">
          I am a passionate Computer Science & Engineering student with a deep specialization in Artificial Intelligence and Machine Learning. My journey in technology is driven by a fascination with creating intelligent systems that can learn, adapt, and solve real-world problems.
        </p>
        <p className="mb-6">
          From developing complex algorithms and neural networks to building full-stack web applications, I thrive on challenges that push the boundaries of my knowledge. I'm proficient in Python, TensorFlow, and React, and I'm always eager to learn new technologies and apply them to impactful projects.
        </p>
        <p>
          My goal is to leverage my skills in AIML and software development to contribute to innovative solutions that make a difference.
        </p>
      </div>
    </Section>
  );
};

export default AboutSection;