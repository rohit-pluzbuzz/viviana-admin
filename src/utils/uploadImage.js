// src/utils/uploadImage.js
export const uploadImage = async (file) => {
  if (!file) throw new Error('No file provided');

  const API_BASE =
    (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.trim()) || "";

  const form = new FormData();
  form.append("image", file); // must match multer.single("image")

  const res = await fetch(`${API_BASE}/api/upload`, {
    method: "POST",
    body: form
  });

  if (!res.ok) {
    const text = await res.text().catch(() => null);
    throw new Error(`Upload failed: ${res.status} ${res.statusText} ${text || ""}`);
  }

  const data = await res.json();

  // backend returns { url: "/uploads/file.png" }
  if (data.url) {
    return `${API_BASE}${data.url}`;
  }

  throw new Error("Unexpected upload response");
};
