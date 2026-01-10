import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

export type BlogPostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO YYYY-MM-DD
  keywords: string[];
};

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

function getMarkdownFiles(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((fileName) => fileName.endsWith(".md"));
}

export function getAllBlogPosts(): BlogPostMeta[] {
  const files = getMarkdownFiles();

  const posts = files
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const fullPath = path.join(BLOG_DIR, fileName);
      const raw = fs.readFileSync(fullPath, "utf8");
      const parsed = matter(raw);

      const title = String(parsed.data.title ?? "").trim();
      const description = String(parsed.data.description ?? "").trim();
      const date = String(parsed.data.date ?? "").trim();
      const keywords = Array.isArray(parsed.data.keywords)
        ? parsed.data.keywords.map((k: unknown) => String(k)).filter(Boolean)
        : [];

      if (!title || !description || !date) {
        throw new Error(
          `Blog post '${fileName}' is missing required frontmatter (title/description/date).`
        );
      }

      return { slug, title, description, date, keywords } satisfies BlogPostMeta;
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  return posts;
}

export async function getBlogPostHtml(slug: string): Promise<{
  meta: BlogPostMeta;
  html: string;
}> {
  const fullPath = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Blog post not found: ${slug}`);
  }

  const raw = fs.readFileSync(fullPath, "utf8");
  const parsed = matter(raw);

  const meta: BlogPostMeta = {
    slug,
    title: String(parsed.data.title ?? "").trim(),
    description: String(parsed.data.description ?? "").trim(),
    date: String(parsed.data.date ?? "").trim(),
    keywords: Array.isArray(parsed.data.keywords)
      ? parsed.data.keywords.map((k: unknown) => String(k)).filter(Boolean)
      : [],
  };

  const processed = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(parsed.content);

  return { meta, html: String(processed) };
}
