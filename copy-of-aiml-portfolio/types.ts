// FIX: Import `ReactElement` to resolve the 'Cannot find namespace JSX' error.
import type { ReactElement } from 'react';

export interface Skill {
  name: string;
  icon: ReactElement;
}

export interface Project {
  title: string;
  description: string;
  image: string;
  tags: string[];
  category: 'Web Dev' | 'AIML';
  liveUrl?: string;
  githubUrl: string;
  slug?: string;
}

export interface Experience {
  role: string;
  company: string;
  date: string;
  description: string;
  achievements?: string[];
}

export interface BlogPost {
  title: string;
  summary: string;
  date: string;
  imageUrl: string;
  slug: string; // For linking to a full post (mocked)
}