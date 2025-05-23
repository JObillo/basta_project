import { usePage } from "@inertiajs/react";

type Song = {
  id: number;
  song_name: string;
  lyric: string;
  url: string;
  cover_photo?: string;
};

function getEmbedUrl(url: string) {
  try {
    const parsedUrl = new URL(url);

    let videoId = "";

    if (parsedUrl.hostname.includes("youtube.com")) {
      videoId = parsedUrl.searchParams.get("v") || "";
      if (!videoId) {
        const paths = parsedUrl.pathname.split("/");
        const embedIndex = paths.indexOf("embed");
        if (embedIndex !== -1 && paths.length > embedIndex + 1) {
          videoId = paths[embedIndex + 1];
        }
      }
    } else if (parsedUrl.hostname === "youtu.be") {
      videoId = parsedUrl.pathname.slice(1);
    }

    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }

    return url;
  } catch (error) {
    return url;
  }
}

export default function SongDetail() {
  const { props } = usePage<{ song: Song }>();
  const song = props.song;
  const embedUrl = getEmbedUrl(song.url);

  return (
    <div className="p-6 max-w-3xl mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">{song.song_name}</h1>

      <div className="mb-6">
        {/* Show the original and embed URLs visibly for debugging */}
        {/* <p><strong>Original URL:</strong> {song.url}</p>
        <p><strong>Embed URL:</strong> {embedUrl}</p> */}

        <iframe
          width="100%"
          height="400"
          src={embedUrl}
          title={song.song_name}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="rounded shadow-lg border-4 border-purple-600"
          frameBorder="0"
        />
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2 text-black">Lyrics</h2>
        <pre className="whitespace-pre-wrap text-left text-black">{song.lyric}</pre>
      </div>
    </div>
  );
}
