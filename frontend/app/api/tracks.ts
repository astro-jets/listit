import client from "./client";

export const uploadTrack = (
  file: File,
  releaseId: number,
  onProgress: (p: number) => void
) => {
  const form = new FormData();
  form.append("file", file);

  return client
    .post(`/tracks/upload/${releaseId}`, form, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (e) => {
        if (e.total) {
          const percent = Math.floor((e.loaded * 100) / e.total);
          onProgress(percent);
        }
      },
    })
    .then((r) => r.data);
};
