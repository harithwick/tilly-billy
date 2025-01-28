import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/lib/components/ui/card";
import Link from "next/link";
import { Badge } from "@/lib/components/ui/badge";
import { BlogHeader } from "@/lib/components/marketing/blog-header";
import { getBlogPostsArray } from "@/lib/constants/blog-posts";

export default async function BlogPage() {
  const blogPosts = getBlogPostsArray();

  return (
    <div className="bg-white py-40 lg:py-60">
      <BlogHeader
        title="Frosdfm the blog"
        description="Learn how to grow your business with our expert advice."
        className="px-4 max-w-7xl mx-auto"
      />
      <div className="h-px w-full bg-gray-200"></div>
      <div className="bg-white py-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 mx-4">
          {blogPosts.map((post) => (
            <Link href={`/blog/${post.slug}`} key={post.id}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{post.title}</CardTitle>
                  <CardDescription>{post.date}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{post.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
