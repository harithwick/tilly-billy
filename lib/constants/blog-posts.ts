export interface BlogPost {
  id: number;
  title: string;
  description: string;
  date: string;
  content: string;
  tags: string[];
  slug: string;
}

export const blogPosts: Record<string, BlogPost> = {
  "getting-started-with-ai": {
    id: 1,
    title: "Getting Started with AI Development",
    description:
      "Learn the fundamentals of AI development and how to implement machine learning models in your applications.",
    date: "March 15, 2024",
    content: `
          Artificial Intelligence (AI) has become an integral part of modern software development. 
          In this comprehensive guide, we'll explore the fundamentals of AI development and how you 
          can get started with implementing machine learning models in your applications.
    
          ## What You'll Learn
          - Basic concepts of machine learning
          - Popular AI frameworks and libraries
          - Implementing your first AI model
          - Best practices for AI development
    
          ## Getting Started
          To begin your journey in AI development, you'll need to understand some key concepts...
        `,
    tags: ["AI", "Machine Learning", "Development"],
    slug: "getting-started-with-ai",
  },
  "future-of-web-development": {
    id: 2,
    title: "The Future of Web Development",
    description:
      "Explore upcoming trends in web development and how they will shape the future of the internet.",
    date: "March 10, 2024",
    content: `
          The web development landscape is constantly evolving. In this article, we'll explore 
          the emerging trends that are shaping the future of web development.
    
          ## Key Trends
          - Web Assembly and the future of browser-based applications
          - AI-powered development tools
          - The rise of edge computing
          - Serverless architectures
    
          ## Impact on Developers
          These changes will significantly impact how we build web applications...
        `,
    tags: ["Web Development", "Future Tech", "Trends"],
    slug: "future-of-web-development",
  },
  "building-scalable-applications": {
    id: 3,
    title: "Building Scalable Applications",
    description:
      "Best practices and patterns for building applications that can scale to millions of users.",
    date: "March 5, 2024",
    content: `
          Scalability is crucial for modern applications. Learn how to design and implement 
          systems that can handle growth effectively.
    
          ## Core Principles
          - Horizontal vs Vertical scaling
          - Microservices architecture
          - Caching strategies
          - Database optimization
    
          ## Implementation Strategies
          When building scalable applications, consider the following approaches...
        `,
    tags: ["Architecture", "Scalability", "Best Practices"],
    slug: "building-scalable-applications",
  },
};

// Helper function to get blog posts as an array
export const getBlogPostsArray = () => Object.values(blogPosts);
