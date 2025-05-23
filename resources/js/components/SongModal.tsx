import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { Toaster, toast } from "sonner";

type Song = {
  id?: number;
  song_name: string;
  lyric: string;
  url: string;
  cover_photo?: string;
  category_id?: number;
  status: string;
};

interface Props {
  isOpen: boolean;
  closeModal: () => void;
  song: Song | null;
  category: { id: number; category_name: string }[];
}

export default function SongModal({
  isOpen,
  closeModal,
  song,
  category = [],
}: Props) {
  const [formData, setFormData] = useState<Song>({
    song_name: "",
    lyric: "",
    url: "",
    cover_photo: "",
    category_id: undefined,
    status: "active", // Default status
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      if (song) {
        setFormData({
          song_name: song.song_name,
          lyric: song.lyric,
          url: song.url,
          cover_photo: song.cover_photo || "",
          category_id: song.category_id,
          status: song.status || "active",
        });
        setPreview(song.cover_photo || "");
        setSelectedFile(null);
      } else {
        setFormData({
          song_name: "",
          lyric: "",
          url: "",
          cover_photo: "",
          category_id: undefined,
          status: "active",
        });
        setPreview("");
        setSelectedFile(null);
      }
    }
  }, [isOpen, song]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "category_id" ? (value === "" ? undefined : parseInt(value, 10)) : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append("song_name", formData.song_name);
    data.append("lyric", formData.lyric);
    data.append("url", formData.url);
    data.append("category_id", formData.category_id ? String(formData.category_id) : "");
    data.append("status", formData.status);

    if (selectedFile) {
      data.append("cover_photo", selectedFile);
    }

    const successMessage = song?.id ? "Song updated successfully." : "Song added successfully.";
    const errorMessage = song?.id ? "Failed to update song." : "Failed to add song.";

    if (song?.id) {
      data.append("_method", "PUT");
      router.post(`/song/${song.id}`, data, {
        onSuccess: () => {
          toast.success(successMessage);
          closeModal();
          router.reload();
        },
        onError: () => {
          toast.error(errorMessage);
        },
      });
    } else {
      router.post("/song", data, {
        onSuccess: () => {
          toast.success(successMessage);
          closeModal();
          router.reload();
        },
        onError: () => {
          toast.error(errorMessage);
        },
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-opacity-30">
      <div className="relative w-full max-w-4xl mx-auto p-8 bg-white rounded-md shadow-xl transition-all">
        <h2 className="text-lg font-semibold mb-4">{song ? "Edit Song" : "Add Song"}</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div className="mb-3">
              <label htmlFor="song_name" className="block text-black font-medium">Song Name</label>
              <input
                id="song_name"
                type="text"
                name="song_name"
                value={formData.song_name}
                onChange={handleChange}
                className="w-full border rounded p-2 text-black"
                required
                placeholder="Enter song name"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="lyric" className="block text-black font-medium">Lyric</label>
              <textarea
                id="lyric"
                name="lyric"
                value={formData.lyric}
                onChange={handleChange}
                className="w-full border rounded p-2 text-black"
                placeholder="Enter lyrics"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="url" className="block text-black font-medium">URL</label>
              <input
                id="url"
                type="url"
                name="url"
                value={formData.url}
                onChange={handleChange}
                className="w-full border rounded p-2 text-black"
                required
                placeholder="YouTube video URL"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="cover_photo" className="block text-sm font-medium text-black">Song Cover</label>
              <input
                id="cover_photo"
                type="file"
                name="cover_photo"
                onChange={handleFileChange}
                accept="image/*"
                className="w-full border rounded p-2 text-black"
              />
              {preview && (
                <img
                  src={preview}
                  alt="Song cover preview"
                  className="mt-2 w-20 h-28 object-cover"
                />
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="category_id" className="block text-black font-medium">Category</label>
              <select
                id="category_id"
                name="category_id"
                value={formData.category_id || ""}
                onChange={handleChange}
                className="w-full border rounded p-2 text-black"
              >
                <option value="">Select Category</option>
                {category.length > 0 ? (
                  category.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.category_name}
                    </option>
                  ))
                ) : (
                  <option disabled>No categories available</option>
                )}
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="status" className="block text-sm font-medium text-black">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border rounded p-2 text-black"
                required
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>

          </div>

          <div className="flex gap-2 mt-6">
            <button
              type="button"
              onClick={closeModal}
              className="py-2 px-4 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {song ? "Update" : "Add"} Song
            </button>
          </div>
        </form>
      </div>
      <Toaster />
    </div>
  );
}
