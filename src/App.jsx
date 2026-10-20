import { albums } from "./data/albums";
import { NowPlaying } from "./components/NowPlaying/NowPlaying";
import { Collection } from "./components/Collection/Collection";
import { useState } from "react";

function App() {
  const [selectedId, setSelectedId] = useState(null);

  const selectedAlbum = albums.find((album) => album.id === selectedId);

  function handleSelect(id) {
    setSelectedId((currentId) => (currentId === id ? null : id));
  }

  return (
    <div className="min-h-screen grid grid-cols-[320px_1fr]  p-4">
      <NowPlaying
        album={selectedAlbum}
        onReturn={() => setSelectedId(null)}
      />
      <Collection
        albums={albums}
        onSelect={handleSelect}
        selectedId={selectedId}
      />
    </div>
  );
}

export default App;
