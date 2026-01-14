
import React from 'react';
import Section from '../components/Section';
import { BLOG_POSTS } from '../constants';
import type { BlogPost } from '../types';

const BlogCard: React.FC<{ post: BlogPost }> = ({ post }) => (
  <a href={`#/blog/${post.slug}`} className="group block bg-white/60 dark:bg-gray-800/40 backdrop-blur-lg border border-gray-200 dark:border-white/10 rounded-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2">
    <img src={post.imageUrl} alt={post.title} className="w-full h-40 object-cover" />
    <div className="p-6">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{post.date}</p>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors">{post.title}</h3>
      <p className="text-gray-700 dark:text-gray-300 text-sm">{post.summary}</p>
    </div>
  </a>
);

const BlogSection: React.FC = () => {
  return (
    <Section id="blog" title="My Blog">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
        {BLOG_POSTS.map((post, index) => (
          <BlogCard key={index} post={post} />
        ))}
      </div>
       <div className="text-center mt-12">
          <a href="#blog" className="text-cyan-500 dark:text-cyan-400 font-semibold hover:underline">
            View All Posts &rarr;
          </a>
        </div>
    </Section>
  );
};

export default BlogSection;
