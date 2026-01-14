
// FIX: Import React to use React.createElement for creating elements without JSX syntax.
import React from 'react';
import type { Project, Experience, BlogPost, Skill } from './types';
import { PythonIcon, TensorFlowIcon, ReactIcon, NodeJSIcon, MongoDBIcon, TypeScriptIcon, OpenCVIcon } from './components/SkillIcons';

export interface CategorizedSkill {
  category: string;
  skills: string[];
}

export const CATEGORIZED_SKILLS: CategorizedSkill[] = [
    {
        category: 'Programming',
        skills: ['C', 'Python', 'Object Oriented Programming in Java', 'HTML', 'CSS', 'JavaScript'],
    },
    {
        category: 'Core Concepts',
        skills: ['Data Structures and Algorithms', 'Operating Systems', 'Computer Networks'],
    },
    {
        category: 'Cyber Security',
        skills: ["Introduction to Cyber Security and It's Fundamentals"],
    },
];

export const SKILLS: Skill[] = [
  { name: 'Python', icon: React.createElement(PythonIcon) },
  { name: 'TensorFlow', icon: React.createElement(TensorFlowIcon) },
  { name: 'React', icon: React.createElement(ReactIcon) },
  { name: 'Node.js', icon: React.createElement(NodeJSIcon) },
  { name: 'MongoDB', icon: React.createElement(MongoDBIcon) },
  { name: 'TypeScript', icon: React.createElement(TypeScriptIcon) },
  { name: 'OpenCV', icon: React.createElement(OpenCVIcon) },
];


export const PROJECTS: Project[] = [
  {
    title: 'Live Webcam Object Detection',
    description: 'A live, in-browser object detection demonstration using TensorFlow.js and the COCO-SSD model. Grant camera access and see it identify objects in real-time!',
    image: 'https://images.unsplash.com/photo-1678043639454-4814a0f4a8e0?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800',
    tags: ['React', 'TensorFlow.js', 'TypeScript', 'Live Demo'],
    category: 'AIML',
    slug: 'webcam-object-detection',
    githubUrl: '#',
  },
  {
    title: 'Live Sentiment Analysis API',
    description: 'An interactive demo that analyzes the sentiment of any text in real-time. It provides a score, a classification (Positive, Negative, Neutral), and an explanation.',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800',
    tags: ['React', 'Gemini API', 'TypeScript', 'JSON Mode'],
    category: 'AIML',
    slug: 'sentiment-analysis-api',
    githubUrl: '#',
  },
  {
    title: 'E-commerce Analytics Dashboard',
    description: 'A full-stack web application providing insightful analytics for e-commerce data, built with React, Node.js, and MongoDB.',
    image: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800',
    tags: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
    category: 'Web Dev',
    liveUrl: 'https://dashboards.mantine.dev/',
    githubUrl: '#',
  },
  {
    title: 'Personal Portfolio Website',
    description: 'The very site you are on! A responsive and modern portfolio built to showcase my skills and projects in the AIML and web development fields.',
    image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800',
    tags: ['React', 'TypeScript', 'Tailwind CSS'],
    category: 'Web Dev',
    liveUrl: '#',
    githubUrl: '#',
  },
  {
    title: 'Real-Time Collaborative Code Editor',
    description: 'A web-based code editor that allows multiple users to write and edit code together in real-time, featuring syntax highlighting and shared execution environments.',
    image: 'https://images.unsplash.com/photo-1580894732444-84cf4b75246b?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800',
    tags: ['React', 'WebSockets', 'Node.js', 'Monaco Editor'],
    category: 'Web Dev',
    liveUrl: '#',
    githubUrl: '#',
  },
  {
    title: 'AI-Powered Recipe Generator',
    description: 'Enter a list of ingredients you have, and this app uses the Gemini API to generate unique and creative recipes you can make.',
    image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800',
    tags: ['React', 'Gemini API', 'TypeScript', 'Tailwind CSS'],
    category: 'AIML',
    liveUrl: '#',
    githubUrl: '#',
  },
];

export const EXPERIENCES: Experience[] = [
    {
        role: 'Cyber Security Booth Camp',
        company: 'GITAM UNIVERSITY-HACKOPS CLUB, Hyderabad',
        date: 'May 2025 - July 2025 (Planned)',
        description: 'Participant in an intensive training camp covering various aspects of cyber security, ethical hacking, and network defense.',
    },
    {
        role: 'Artificial Intelligence Workshop',
        company: 'Techgyan Technologies at IIT Hyderabad',
        date: 'January 2025',
        description: 'Engaged in a hands-on workshop focusing on practical applications of Artificial Intelligence and modern AI frameworks.',
    },
    {
        role: 'AI with Deep Learning Workshop',
        company: 'Techobyte Technologies at BITS Pilani, Hyderabad',
        date: 'November 2024',
        description: 'Participated in a comprehensive workshop covering deep learning fundamentals and hands-on implementation with AI frameworks.',
    },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    title: 'Understanding Transformers: The Core of Modern NLP',
    summary: 'A deep dive into the architecture that powers models like Gemini and GPT-4. Understand self-attention and why it changed everything.',
    date: 'July 15, 2024',
    imageUrl: 'https://images.unsplash.com/photo-1675865259569-829f03a505c0?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=400&h=200',
    slug: 'understanding-transformers',
  },
  {
    title: "A Practical Beginner's Guide to OpenCV in Python",
    summary: 'Learn the fundamentals of computer vision by reading, manipulating, and analyzing images with OpenCV, the powerful open-source library.',
    date: 'June 28, 2024',
    imageUrl: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=400&h=200',
    slug: 'guide-to-opencv',
  },
];
