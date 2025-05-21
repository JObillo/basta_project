import React from "react";
import ReactPlayer from "react-player";

type Song = {
  song_name: string;
  url: string;      // YouTube URL as a string
  lyric: string;
};

type SongDetailProps = {
  song: Song;
};

export default function SongDetail({ song }: SongDetailProps) {
  console.log("Song URL type:", typeof song.url);
  console.log("Song URL value:", song.url);

  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <h1>{song.song_name}</h1>

      <ReactPlayer
        url={song.url}
        controls
        width="100%"
        height="360px"
        onError={(e) => {
          console.error("ReactPlayer failed to load video", e);
          alert("Failed to load video. Please check the URL.");
        }}
      />

      <h2>Lyrics</h2>
      <pre
        style={{
          whiteSpace: "pre-wrap",
          backgroundColor: "#f0f0f0",
          padding: "1rem",
          borderRadius: "8px",
        }}
      >
        {song.lyric}
      </pre>
    </div>
  );
}
