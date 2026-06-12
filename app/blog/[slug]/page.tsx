import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { getPostData, getSortedPostsData } from "@/lib/posts";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface BlogDetailsProps {
  params: {
    slug: string;
  };
}

// Generate dynamic metadata for search engines
export async function generateMetadata({ params }: BlogDetailsProps) {
  const post = getPostData(params.slug);
  if (!post) {
    return {
      title: "Post Not Found",
      description: "This growth insight article could not be found.",
    };
  }

  return {
    title: `${post.title} | Mibin Thomas Blog`,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} | Mibin Thomas Blog`,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: ["Mibin Thomas"],
    },
  };
}

// Generate static params for optimal ISR/Static compilation
export async function generateStaticParams() {
  const posts = getSortedPostsData();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default function BlogDetailPage({ params }: BlogDetailsProps) {
  const post = getPostData(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col justify-between selection:bg-brand-emerald/30 selection:text-brand-emerald">
      <Navbar />

      <main className="flex-grow max-w-4xl mx-auto w-full px-6 md:px-12 pt-32 pb-24 space-y-12">
        
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-brand-gray-400 hover:text-white transition-colors group text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-emerald rounded p-1"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to all insights</span>
          </Link>
        </div>

        {/* Post Metadata Header */}
        <article className="space-y-6 pb-8 border-b border-brand-gray-800/60">
          <div className="flex items-center gap-4 text-xs font-bold text-brand-gray-400">
            <span className="text-brand-emerald bg-brand-dark border border-brand-gray-800 px-2.5 py-1 rounded uppercase tracking-wider">
              {post.category}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{post.date}</span>
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{post.readTime}</span>
            </span>
          </div>

          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-brand-gray-800 border border-brand-gray-700 flex items-center justify-center font-bold text-brand-blue">
                M
              </div>
              <div>
                <span className="block text-sm font-semibold text-white">{post.author}</span>
                <span className="block text-[10px] text-brand-gray-500 font-bold uppercase tracking-wider">E-Comm Specialist</span>
              </div>
            </div>
          </div>
        </article>

        {/* Markdown Render Body */}
        <div className="prose prose-invert max-w-none text-brand-gray-300 space-y-6 leading-relaxed text-base md:text-lg">
          <ReactMarkdown
            components={{
              h2: ({ ...props }) => (
                <h2
                  className="font-heading font-extrabold text-2xl sm:text-3xl text-white mt-12 mb-4 pt-6 border-t border-brand-gray-900/30 flex items-center gap-1.5"
                  {...props}
                />
              ),
              h3: ({ ...props }) => (
                <h3 className="font-heading font-bold text-xl text-white mt-8 mb-3" {...props} />
              ),
              p: ({ ...props }) => <p className="mb-6 leading-relaxed" {...props} />,
              ul: ({ ...props }) => <ul className="list-disc list-inside space-y-2 mb-6 pl-4" {...props} />,
              ol: ({ ...props }) => <ol className="list-decimal list-inside space-y-2 mb-6 pl-4" {...props} />,
              li: ({ ...props }) => <li className="text-brand-gray-300" {...props} />,
              strong: ({ ...props }) => <strong className="font-semibold text-white" {...props} />,
              a: ({ ...props }) => (
                <a
                  className="text-brand-emerald hover:underline font-semibold focus:outline-none focus:ring-1 focus:ring-brand-emerald rounded"
                  {...props}
                />
              ),
              hr: () => <hr className="my-10 border-brand-gray-800/40" />,
              table: ({ ...props }) => (
                <div className="overflow-x-auto my-8 border border-brand-gray-800/40 rounded-xl bg-brand-card">
                  <table className="w-full text-left text-sm border-collapse" {...props} />
                </div>
              ),
              thead: ({ ...props }) => <thead className="bg-[#0c0c0c] border-b border-brand-gray-800/60" {...props} />,
              tbody: ({ ...props }) => <tbody className="divide-y divide-brand-gray-800/30" {...props} />,
              th: ({ ...props }) => <th className="px-6 py-4 font-bold text-white uppercase tracking-wider text-xs" {...props} />,
              td: ({ ...props }) => <td className="px-6 py-4 text-brand-gray-300" {...props} />,
              pre: ({ ...props }) => (
                <pre
                  className="p-5 rounded-xl bg-[#0c0c0c] border border-brand-gray-800/50 overflow-x-auto text-sm font-mono text-brand-gray-300 my-6 shadow-inner"
                  {...props}
                />
              ),
              code: ({ ...props }) => (
                <code className="px-1.5 py-0.5 rounded bg-brand-gray-900 border border-brand-gray-850 font-mono text-sm text-brand-blue" {...props} />
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        {/* Footer Meta Tags */}
        <div className="flex flex-wrap gap-2 pt-12 border-t border-brand-gray-800/60">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-brand-card border border-brand-gray-800/50 text-brand-gray-400"
            >
              #{tag}
            </span>
          ))}
        </div>

      </main>

      <Footer />
    </div>
  );
}
