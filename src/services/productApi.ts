// src/services/productApi.ts
// Tầng Service gọi API với Fetch chuẩn (Chương 2.7.3 & Sprint 2)
export type PostItem = {
  id: number;
  title: string;
  body: string;
  userId?: number;
};

export async function fetchSamplePosts(): Promise<PostItem[]> {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=10');
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  return res.json();
}
