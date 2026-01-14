
import React, { useEffect } from 'react';
import { BLOG_POSTS } from '../../constants';
import { TransformersContent } from './content/transformers';
import { OpenCvContent } from './content/opencv';

// Maps URL slugs to their corresponding content components
const componentMap: { [key: string]: React.FC } = {
    'understanding-transformers': TransformersContent,
    'guide-to-opencv': OpenCvContent,
};

const BlogPostPage: React.FC<{ slug: string }> = ({ slug }) => {
    const post = BLOG_POSTS.find(p => p.slug === slug);
    const ContentComponent = componentMap[slug];

    useEffect(() => {
        if (post) {
            document.title = `${post.title} | Nikhilesh's Portfolio`;
        } else {
            document.title = "Post Not Found | Nikhilesh's Portfolio";
        }
    }, [post]);

    if (!post || !ContentComponent) {
        return (
            <main className="pt-24 pb-16">
                <div className="container mx-auto px-4 py-20 text-center">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white">404 - Post Not Found</h1>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Sorry, we couldn't find the post you were looking for.</p>
                    <a href="/#" className="mt-8 inline-block bg-cyan-500 text-white font-semibold py-3 px-8 rounded-full hover:bg-cyan-600 transition-colors duration-300">
                        &larr; Back to Portfolio
                    </a>
                </div>
            </main>
        );
    }

    // Use a higher resolution image for the blog header
    const headerImageUrl = post.imageUrl.replace('/400/200', '/1200/600');

    return (
        <main className="pt-16 pb-16 bg-gray-50 dark:bg-[#0a0a0a]">
            <article className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                <header className="py-8 md:py-12">
                    <a href="/#" className="text-cyan-500 dark:text-cyan-400 hover:underline text-sm font-medium transition-colors">
                        &larr; Back to Portfolio
                    </a>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mt-4 leading-tight">
                        {post.title}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-3 text-base">
                        Published on {post.date}
                    </p>
                </header>

                <img src={headerImageUrl} alt={`Header image for ${post.title}`} className="w-full h-auto max-h-[450px] object-cover rounded-xl my-4 md:my-8 shadow-lg" />
                
                {/* Apply prose styles for beautiful typography */}
                <div className="prose prose-lg prose-cyan dark:prose-invert max-w-none">
                    <ContentComponent />
                </div>
            </article>

            {/* Basic styling for Tailwind Typography since the plugin might not be available via CDN */}
            <style>{`
                .prose {
                    color: #374151; /* dark:text-gray-300 */
                }
                .dark .prose {
                    color: #d1d5db;
                }
                .prose h2 {
                    font-size: 1.875rem; /* text-3xl */
                    font-weight: 700; /* font-bold */
                    margin-top: 2.5em;
                    margin-bottom: 1em;
                    border-bottom: 2px solid #e5e7eb; /* dark:border-gray-700 */
                    padding-bottom: 0.3em;
                }
                .dark .prose h2 {
                    border-color: #374151;
                }
                .prose h3 {
                    font-size: 1.5rem; /* text-2xl */
                    font-weight: 600; /* font-semibold */
                    margin-top: 2em;
                    margin-bottom: 0.8em;
                }
                .prose p, .prose ul, .prose ol, .prose blockquote {
                    margin-top: 1.25em;
                    margin-bottom: 1.25em;
                    line-height: 1.75;
                }
                .prose a {
                    color: #0891b2; /* text-cyan-600 */
                    text-decoration: none;
                    transition: color 0.2s;
                }
                .prose a:hover {
                    color: #06b6d4; /* text-cyan-500 */
                    text-decoration: underline;
                }
                .prose pre {
                    background-color: #111827; /* bg-gray-900 */
                    color: #e5e7eb; /* text-gray-200 */
                    border-radius: 0.5rem; /* rounded-lg */
                    padding: 1rem;
                    overflow-x: auto;
                    font-family: monospace;
                    font-size: 0.875rem; /* text-sm */
                }
                .prose code {
                    background-color: #e5e7eb;
                    color: #1f2937;
                    padding: 0.2em 0.4em;
                    border-radius: 0.25rem;
                    font-size: 0.9em;
                }
                .dark .prose code {
                    background-color: #374151;
                    color: #e5e7eb;
                }
                .prose pre code {
                    background-color: transparent;
                    color: inherit;
                    padding: 0;
                    border-radius: 0;
                    font-size: inherit;
                }
                .prose blockquote {
                    border-left: 4px solid #06b6d4; /* border-cyan-500 */
                    padding-left: 1em;
                    font-style: italic;
                    color: #4b5563; /* text-gray-600 */
                }
                .dark .prose blockquote {
                    border-color: #22d3ee; /* border-cyan-400 */
                    color: #9ca3af; /* text-gray-400 */
                }
            `}</style>
        </main>
    );
};

export default BlogPostPage;
