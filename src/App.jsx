import { useRef, useState } from "react";
import { albums as initialAlbums } from "./data/albums";
import { SPINE_COLORS } from "./data/spineColors";
import { pickRandom, randomBetween } from "./utils/random";
import { isSameAlbum } from "./utils/isSameAlbum";
import { NowPlaying } from "./components/NowPlaying/NowPlaying";
import { Collection } from "./components/Collection/Collection";

function App() {
  const [albums, setAlbums] = useState(initialAlbums);
  const [selectedId, setSelectedId] = useState(null);
  const spineRefs = useRef(new Map());
  const activeFilterRef = useRef(null);

  const selectedAlbum = albums.find((album) => album.id === selectedId);

  function handleAdd(result) {
    const newAlbum = {
      id: result.id,
      title: result.title,
      artist: result.artist,
      year: result.year,
      genre: result.genre,
      cover: result.cover,
      color: pickRandom(SPINE_COLORS),
      height: randomBetween(226, 240),
      note: "",
      track: null,
    };

    setAlbums((current) =>
      current.some((album) => isSameAlbum(album, newAlbum))
        ? current
        : [...current, newAlbum],
    );
  }

  function handleRemove(id) {
    setAlbums((current) => current.filter((album) => album.id !== id));
    setSelectedId((currentId) => (currentId === id ? null : currentId));
  }

  function handleSelect(id) {
    setSelectedId((currentId) => (currentId === id ? null : id));
  }

  function handleReturn() {
    const returnedId = selectedId;
    setSelectedId(null);

    const spine = spineRefs.current.get(returnedId);

    if (spine) {
      spine.focus();
    } else {
      activeFilterRef.current?.focus();
    }
  }

  function registerSpine(id, element) {
    spineRefs.current.set(id, element);

    return () => {
      spineRefs.current.delete(id);
    };
  }

  return (
    <div className="min-h-screen grid grid-cols-[320px_1fr] p-4">
      <NowPlaying album={selectedAlbum} onReturn={handleReturn} />
      <Collection
        albums={albums}
        onSelect={handleSelect}
        selectedId={selectedId}
        registerSpine={registerSpine}
        activeFilterRef={activeFilterRef}
        onAdd={handleAdd}
        onRemove={handleRemove}
      />
    </div>
  );
}

export default App;
