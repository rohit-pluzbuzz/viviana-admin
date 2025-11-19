// src/utils/uploadImage.js

export const uploadImage = async (file) => {
  if (!file) throw new Error("No file provided");

  const API_BASE =
    (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.trim()) || "";

  const form = new FormData();
  form.append("image", file);

  const res = await fetch(`${API_BASE}/api/upload`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => null);
    throw new Error(`Upload failed: ${res.status} ${text || ""}`);
  }

  const data = await res.json();

  // Your backend returns:
  // { filePath: "/uploads/filename.png", fullUrl: "http://..." }

  if (data.fullUrl) {
    return data.fullUrl; // BEST OPTION
  }

  if (data.filePath) {
    return `${API_BASE}${data.filePath}`;
  }

  throw new Error("Unexpected upload response: " + JSON.stringify(data));
};
