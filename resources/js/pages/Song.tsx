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

  //pagination and search
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);
  const songsPerPage = 5;
    const filteredSongs = songs.filter((song) =>
      (song.song_name).toLowerCase().startsWith(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSongs.length / songsPerPage);
  const startIndex = (currentPage - 1) * songsPerPage;
  const endIndex = startIndex + songsPerPage;
  const displayedSongs = filteredSongs.slice(startIndex, endIndex);

  return (  
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Manage Songs" />
      <Toaster position="top-right" richColors />

      <div className="flex flex-col gap-6 p-6 bg-white text-black shadow-lg rounded">
        <div className="flex justify-between items-center mb-4">
        {/* Search Bar on the Left */}
        <div>
          <Input
            className="border rounded px-2 py-1 w-100"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
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
                {[
                  "Cover Photo",
                  "Song Name",
                  "Category",
                  "Status",
                  "Actions",
                ].map((header) => (
                  <th key={header} className="border p-3 text-left">
                    {header}
                  </th>
                ))}
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
                    <td className="p-3">
                      <div className="font-semibold">{song.song_name}</div>
                    </td>
                    <td className="p-3">
                      {category.find(cat => cat.id === song.category_id)?.category_name || 'No Category'}
                    </td>

                    <td className="p-3">{song.status}</td>

                    {/* <td className="p-3 text-center">{song.song_copies}</td> */}
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
                  <td colSpan={7} className="text-center p-4 text-gray-600">
                    No available songs.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
    <div className="flex justify-between items-center mt-4 px-4 py-3 text-sm text-gray-700 cursor-pointer">
      <span>
        Page {currentPage} — {displayedSongs.length} song
        {displayedSongs.length !== 1 && "s"} on this page
      </span>

      <div className="flex items-center gap-1">
        <button
          className="px-3 py-1 border rounded hover:bg-gray-200 disabled:opacity-50 cursor-pointer"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <span className="px-3 py-1 bg-purple-700 text-white rounded">
          {currentPage}
        </span>

        <button
          className="px-3 py-1 border rounded hover:bg-gray-200 disabled:opacity-50 cursor-pointer"
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


//original code 3 working