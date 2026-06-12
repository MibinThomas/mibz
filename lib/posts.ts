import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "public", "content", "blog");

export interface PostData {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  author: string;
  readTime: string;
  category: string;
  tags: string[];
  content: string;
}

// Get all posts sorted by date
export function getSortedPostsData(): Omit<PostData, "content">[] {
  // Ensure directory exists
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      // Remove ".md" from file name to get slug
      const slug = fileName.replace(/\.md$/, "");

      // Read markdown file as string
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents);

      // Combine the data with the slug
      return {
        slug,
        title: matterResult.data.title || "",
        date: matterResult.data.date || "",
        excerpt: matterResult.data.excerpt || "",
        author: matterResult.data.author || "Mibin Thomas",
        readTime: matterResult.data.readTime || "",
        category: matterResult.data.category || "",
        tags: matterResult.data.tags || [],
      };
    });

  // Sort posts by date descending
  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

// Get single post data by slug
export function getPostData(slug: string): PostData | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    if (!fs.existsSync(fullPath)) {
      return null;
    }
    
    const fileContents = fs.readFileSync(fullPath, "utf8");

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    return {
      slug,
      title: matterResult.data.title || "",
      date: matterResult.data.date || "",
      excerpt: matterResult.data.excerpt || "",
      author: matterResult.data.author || "Mibin Thomas",
      readTime: matterResult.data.readTime || "",
      category: matterResult.data.category || "",
      tags: matterResult.data.tags || [],
      content: matterResult.content,
    };
  } catch {
    return null;
  }
}
