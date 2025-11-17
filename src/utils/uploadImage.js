// src/utils/uploadImage.js
export const uploadImage = async (file) => {
  if (!file) throw new Error('No file provided');

  const API_BASE = (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.trim()) || "";

  const form = new FormData();
  form.append('image', file); // 'image' must match multer.single('image') on backend

  // IMPORTANT: do NOT set Content-Type header manually; the browser will set the boundary for multipart/form-data.
  const res = await fetch(`${API_BASE}/api/upload`, {
    method: 'POST',
    body: form,
    credentials: 'include' // optional: if your backend uses cookies/auth
  });

  if (!res.ok) {
    const text = await res.text().catch(()=>null);
    throw new Error(`Upload failed: ${res.status} ${res.statusText} ${text || ''}`);
  }

  const data = await res.json();

  // backend returns fullUrl and filePath. Prefer fullUrl if present, otherwise build from API_BASE + filePath
  if (data.fullUrl && data.fullUrl.startsWith('http')) {
    return data.fullUrl;
  }
  if (data.filePath) {
    return `${API_BASE}${data.filePath}`;
  }

  throw new Error('Unexpected upload response');
};
