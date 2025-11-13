
// frontend/src/utils/uploadImage.js
export const uploadImage = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  
  const API_BASE = (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.trim()) || "http://localhost:5000";
  const response = await fetch('${API_BASE}/api/upload', {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Upload failed");
  }

  const data = await response.json();
  return data.fileUrl;
};
