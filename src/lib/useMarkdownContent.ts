import matter from "gray-matter";

export async function useMarkdownContent(folder: "posts" | "pages") {
  const files = import.meta.glob(`/content/${folder}/*.md`, {
    as: "raw",
    eager: true,
  });

  const contentArray = Object.entries(files).map(([path, raw]) => {
    const { data, content } = matter(raw as string);

    return {
      id: path.split("/").pop()?.replace(".md", "") ?? "",
      title: data.title || "Untitled",
      type: folder.slice(0, -1),
      status: "published",
      excerpt: content.slice(0, 150),
      content,
      createdAt: data.date || "2025-01-01",
      updatedAt: data.date || "2025-01-01",
    };
  });

  return contentArray;
}