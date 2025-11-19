// src/utils/uploadImage.js
export const uploadImage = async (file) => {
  if (!file) throw new Error('No file provided');

  const API_BASE = (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.trim()) || "";

  const form = new FormData();
  form.append('image', file); // 'image' must match multer.single('image') on backend

  // Do NOT set Content-Type manually.
  const res = await fetch(`${API_BASE}/api/upload`, {
    method: 'POST',
    body: form,
    credentials: 'include' // optional if you use cookies/auth
  });

  if (!res.ok) {
    const text = await res.text().catch(()=>null);
    throw new Error(`Upload failed: ${res.status} ${res.statusText} ${text || ''}`);
  }

  const data = await res.json();

  if (data.fullUrl && data.fullUrl.startsWith('http')) {
    return data.fullUrl;
  }
  if (data.filePath) {
    return `${API_BASE}${data.filePath}`;
  }

  throw new Error('Unexpected upload response');
};
