import { useEffect, useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import SongModal from "@/components/SongModal";
import AppLayout from "@/layouts/app-layout";
import { Toaster, toast } from "sonner";
import { BreadcrumbItem } from "@/types";
import { Input } from "@/components/ui/input";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Manage Songs',
    href: '/song',
  },
];

export type Song = {
  id?: number;
  song_name: string;
  lyric: string;
  url: string;
  status: string;
  cover_photo?: string;
  category_id?: number;
  created_at?: string;
};

type Category = {
  id: number;
  category_name: string;
};

export default function Songs() {
  const { songs = [], category = [] } = usePage<{
    songs?: Song[];
    category?: Category[];
  }>().props;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const openModal = (song: Song | null = null) => {
    setSelectedSong(song);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    router.delete(`/songs/${id}`, {
      onSuccess: () => {
        toast.success("Song deleted successfully.");
        router.reload();
      },
      onError: () => {
        toast.error("Failed to delete.");
      },
    });
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter]);

  const songsPerPage = 5;

  const filteredSongs = songs
    .filter((song) => {
      const matchesSearch = song.song_name
        .toLowerCase()
        .startsWith(searchQuery.toLowerCase());

      const matchesCategory =
        categoryFilter === 'All' ||
        category.find((cat) => cat.id === song.category_id)?.category_name === categoryFilter;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const dateA = new Date(a.created_at || '').getTime();
      const dateB = new Date(b.created_at || '').getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

  const totalPages = Math.ceil(filteredSongs.length / songsPerPage);
  const startIndex = (currentPage - 1) * songsPerPage;
  const endIndex = startIndex + songsPerPage;
  const displayedSongs = filteredSongs.slice(startIndex, endIndex);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Manage Songs" />
      <Toaster position="top-right" richColors />

      <div className="flex flex-col gap-6 p-6 bg-white text-black shadow-lg rounded ">
        <div className="flex flex-wrap gap-2 justify-between items-center mb-4">
          <div className="flex gap-2 items-center">
            <Input
              className="border rounded px-2 py-1"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="All">All</option>
              {category.map((cat) => (
                <option key={cat.id} value={cat.category_name}>
                  {cat.category_name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => openModal()}
            className="bg-green-600 text-white rounded px-3 py-1 text-sm hover:bg-green-700 transition cursor-pointer"
          >
            Add Song
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white text-black shadow-sm rounded-lg">
            <thead>
              <tr className="bg-purple-900 text-white border-b">
                <th className="border p-3 text-left">Cover Photo</th>
                <th className="border p-3 text-left">Song Name</th>
                <th className="border p-3 text-left">Category</th>
                <th className="border p-3 text-left">Status</th>
                <th
                  className="border p-3 text-left cursor-pointer select-none"
                  onClick={toggleSortOrder}
                  title="Click to sort"
                >
                  Added Date
                  <span className="ml-1">
                    {sortOrder === 'asc' ? '▲' : '▼'}
                  </span>
                </th>
                <th className="border p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedSongs.length ? (
                displayedSongs.map((song) => (
                  <tr key={song.id} className="border-b hover:bg-gray-100">
                    <td className="p-3">
                      {song.cover_photo ? (
                        <img
                          src={song.cover_photo}
                          alt="Song Cover"
                          className="w-20 h-28 object-cover rounded shadow"
                        />
                      ) : (
                        <span className="text-gray-500">No Photo Cover</span>
                      )}
                    </td>

                    <td className="p-3 font-semibold">{song.song_name}</td>
                    <td className="p-3">
                      {category.find(cat => cat.id === song.category_id)?.category_name || 'No Category'}
                    </td>
                    <td className="p-3">{song.status}</td>
                    <td className="p-3">
                      {song.created_at
                        ? new Date(song.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "N/A"}
                    </td>
                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => openModal(song)}
                        className="bg-blue-500 hover:bg-blue-600 text-sm text-white px-3 py-1 rounded cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(song.id!)}
                        className="bg-red-500 hover:bg-red-600 text-sm text-white px-3 py-1 rounded cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center p-4 text-gray-600">
                    No available songs.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4 px-4 py-3 text-sm text-gray-700 cursor-pointer">
        <span>
          Page {currentPage} — {displayedSongs.length} song
          {displayedSongs.length !== 1 && "s"} on this page
        </span>
        <div className="flex items-center gap-1">
          <button
            className="px-3 py-1 border rounded bg-white hover:bg-gray-200 disabled:opacity-50 cursor-pointer"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="px-3 py-1 bg-white text-black rounded">
            {currentPage}
          </span>
          <button
            className="px-3 py-1 border rounded bg-white hover:bg-gray-200 disabled:opacity-50 cursor-pointer"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      <SongModal
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        song={selectedSong}
        category={category}
      />
    </AppLayout>
  );
}
