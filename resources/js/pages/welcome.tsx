import { Head, Link, usePage } from "@inertiajs/react";
import { useEffect, useState, useMemo } from "react";
import "../../css/app.css";

type Song = {
  id: number;
  song_name: string;
  lyric: string;
  url: string;
  status: string;
  cover_photo?: string;
  category_id: number;
  category?: {
    id: number;
    category_name: string;
  };
};

type Category = {
  id: number;
  category_name: string;
};

export default function Welcome() {
  const { props } = usePage<{
    songs: Song[];
    categories: Category[];
    flashMessage?: string;
  }>();

  const [songs, setSongs] = useState<Song[]>(props.songs || []);
  const [category, setCategory] = useState<Category[]>(props.categories || []);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchFilter, setSearchFilter] = useState<string>("All");

  useEffect(() => {
    if (props.songs) {
      setSongs(props.songs);
    }
    if (props.categories) {
      setCategory(props.categories);
    }
  }, [props.songs, props.categories, props.flashMessage]);

  // Filter songs by status (public), category filter AND search term
  const groupedSongs = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();

    // Step 1: Filter public songs only
    const publicSongs = songs.filter((song) => song.status === "public");

    // Step 2: Filter by category
    const filteredByCategory =
      searchFilter === "All"
        ? publicSongs
        : publicSongs.filter(
            (song) => song.category?.category_name === searchFilter
          );

    // Step 3: Filter by search term (song or category name)
    const filteredSongs = filteredByCategory.filter(
      (song) =>
        song.song_name.toLowerCase().includes(lowerSearch) ||
        song.category?.category_name.toLowerCase().includes(lowerSearch)
    );

    // Group by category
    const groups: Record<string, Song[]> = {};
    category.forEach((cat) => {
      groups[cat.category_name] = [];
    });

    filteredSongs.forEach((song) => {
      const categoryName =
        song.category?.category_name ||
        category.find((c) => c.id === song.category_id)?.category_name ||
        "Uncategorized";

      if (!groups[categoryName]) {
        groups[categoryName] = [];
      }
      groups[categoryName].push(song);
    });

    return groups;
  }, [songs, category, searchTerm, searchFilter]);

  const categoryNames = category.map((cat) => cat.category_name);

  return (
    <>
      <Head title="PhilCST Library" />
      <div className="flex flex-col min-h-screen bg-dark text-white-900 p-4 sm:p-6">
        {/* Header */}
        <header className="fixed top-0 left-0 z-50 w-full flex justify-between items-center px-6 py-4 shadow-md">
          <img src="philcstlogo.png" alt="Logo" className="h-10" />
          <div className="flex items-center gap-4">
            <Link
              href={route("login")}
              className="text-gray-700 hover:text-purple-700 text-sm sm:text-base"
            >
              Login
            </Link>
          </div>
        </header>

        {/* Welcome Message */}
        <div className="text-center mt-24">
          <h1 className="lilitaOneFont royalPurple text-2xl sm:text-3xl font-bold">
            Unbellevable Songs Hub
          </h1>
        </div>

        {/* Search & Category Filter */}
        <div className="flex space-x-2 mt-6">
          <select
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="border rounded px-2 py-2 shadow-sm focus:outline-none focus:ring focus:border-purple-500"
          >
            <option value="All">All</option>
            {categoryNames.map((catName) => (
              <option key={catName} value={catName}>
                {catName}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search songs or categories..."
            className="border rounded px-2 py-2 w-150 shadow-sm focus:outline-none focus:ring focus:border-purple-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Song Categories */}
        <div className="mt-10 space-y-10">
          {categoryNames.length > 0 ? (
            Object.keys(groupedSongs)
              .filter((categoryName) => groupedSongs[categoryName]?.length > 0)
              .map((categoryName) => {
                const categoryId =
                  groupedSongs[categoryName][0]?.category?.id ||
                  groupedSongs[categoryName][0]?.category_id;

                return (
                  <div key={categoryName}>
                    <h2 className="text-lg font-semibold mb-2">
                      {categoryName}
                    </h2>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {groupedSongs[categoryName]
                        ?.slice(0, 5)
                        .map((song) => (
                          <div
                            key={song.id}
                            className="h-auto  rounded-md border border-gray-300 shadow-sm p-2 flex flex-col items-center"
                          >
                            <Link
                              href={route("songs.show", { song: song.id })}
                              className="block w-full"
                            >
                              <img
                                src={
                                  song.cover_photo || "/placeholder-song.png"
                                }
                                alt={song.song_name}
                                className="w-100 h-65 object-cover rounded cursor-pointer hover:scale-[1.02]"
                              />
                            </Link>

                            <div className="mt-2 w-full text-center">
                              <Link
                                href={route("songs.show", { song: song.id })}
                                className="text-sm font-semibold truncate block hover:underline"
                              >
                                {song.song_name}
                              </Link>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                );
              })
          ) : (
            <p className="text-center text-gray-500">
              no available song right now.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
