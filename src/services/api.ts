import axios from 'axios';
import { Post } from '@types';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

// 1. Gọi API bằng Fetch chuẩn (Chương 2.7.3)
export const fetchPostsWithFetch = async (): Promise<Post[]> => {
  const response = await fetch(`${BASE_URL}/posts?_limit=15`);
  if (!response.ok) {
    throw new Error(`Lỗi HTTP: ${response.status}`);
  }
  const data: Post[] = await response.json();
  return data;
};

// 2. Gọi API bằng Axios chuẩn (Chương 2.7.4)
export const apiAxios = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export const fetchPostsWithAxios = async (): Promise<Post[]> => {
  const response = await apiAxios.get<Post[]>('/posts?_limit=15');
  return response.data;
};
