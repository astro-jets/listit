import uploadClient from "./client";

export async function submitUpload(data: {
  title: string;
  featuring?: string;
  genre: string;
  isrc?: string;
  releaseDate: string;
  isAlbum: boolean;
  cover: File;
  audio: File;
}) {
  const formData = new FormData();

  formData.append("title", data.title);
  formData.append("featuring", data.featuring || "");
  formData.append("genre", data.genre);
  formData.append("isrc", data.isrc || "");
  formData.append("releaseDate", data.releaseDate);
  formData.append("isAlbum", String(data.isAlbum));

  formData.append("cover", data.cover);
  formData.append("audio", data.audio);

  const res = await uploadClient.post("/artist/uploads", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
}
