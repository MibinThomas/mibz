import React from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Calendar, Clock, ChevronRight } from "lucide-react";
import { getSortedPostsData } from "@/lib/posts";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "E-Commerce Growth Blog & Paid Media Insights | Mibin Thomas",
  description: "Read case studies, optimization guidelines, and performance marketing articles covering Meta Ads CAPI, Shopify SEO, and GA4 dashboards.",
};

export default function BlogListingPage() {
  const posts = getSortedPostsData();

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col justify-between selection:bg-brand-emerald/30 selection:text-brand-emerald">
      {/* Reusable Navbar */}
      <Navbar />

      <main className="flex-grow max-w-5xl mx-auto w-full px-6 md:px-12 pt-32 pb-24 space-y-16">
        
        {/* Breadcrumb / Back button */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-brand-gray-400 hover:text-white transition-colors group text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-emerald rounded p-1"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Portfolio</span>
          </Link>
        </div>

        {/* Header Block */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-emerald/10 border border-brand-emerald/20 text-brand-emerald text-xs font-semibold uppercase tracking-wider select-none">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Growth & Analytics Insights</span>
          </div>
          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-white tracking-tight leading-tight">
            E-Commerce Growth Strategy & Case Studies
          </h1>
          <p className="text-brand-gray-400 max-w-3xl leading-relaxed">
            Data-backed breakdowns of paid customer acquisition, conversion optimization structures, and technical search engine configurations for brands scaling in the GCC.
          </p>
        </div>

        {/* Articles List */}
        <div className="space-y-6 pt-6 border-t border-brand-gray-800/40">
          {posts.length === 0 ? (
            <div className="py-12 text-center text-brand-gray-500 font-medium">
              No insights published yet. Check back soon!
            </div>
          ) : (
            posts.map((post) => (
              <article
                key={post.slug}
                className="group relative p-6 sm:p-8 rounded-2xl bg-brand-card border border-brand-gray-800/30 hover:border-brand-emerald/45 transition-all duration-300 flex flex-col justify-between gap-6 hover:shadow-lg hover:shadow-brand-emerald/2"
              >
                <div className="space-y-4">
                  {/* Category and Read time */}
                  <div className="flex items-center gap-4 text-xs font-bold text-brand-gray-400">
                    <span className="text-brand-emerald bg-brand-dark px-2.5 py-1 rounded uppercase tracking-wider">
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{post.readTime}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{post.date}</span>
                    </span>
                  </div>

                  <h2 className="font-heading font-bold text-xl sm:text-2xl text-white group-hover:text-brand-emerald transition-colors">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="focus:outline-none focus:underline"
                    >
                      {post.title}
                    </Link>
                  </h2>

                  <p className="text-brand-gray-400 text-sm sm:text-base leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-brand-gray-800/40 pt-4 mt-2">
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-brand-dark border border-brand-gray-800 text-brand-gray-450"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-emerald uppercase tracking-widest group-hover:underline focus:outline-none focus:ring-1 focus:ring-brand-emerald rounded p-1"
                  >
                    <span>Read Article</span>
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </article>
            ))
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
}
