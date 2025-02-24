"use client";

import { notFound } from "next/navigation";
import { BlogHeader } from "@/components/marketing/blog-header";
import { blogPosts } from "@/lib/constants/blog-posts";
import { useParams } from "next/navigation";

export default async function BlogPost() {
  const params = useParams<{ slug: string }>();
  const post = blogPosts[params.slug as keyof typeof blogPosts];

  if (!post) {
    notFound();
  }

  return (
    <article className=" mx-auto py-40 lg:py-60">
      <BlogHeader
        title={post.title}
        created={post.date}
        tags={post.tags}
        className="px-4 max-w-7xl mx-auto"
      />
      <div className="h-px w-full bg-gray-200"></div>
      <div className="prose prose-lg dark:prose-invert max-w-5xl mt-20 mx-auto">
        {post.content.split("\n").map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}
