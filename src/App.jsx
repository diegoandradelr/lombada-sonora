import { useRef, useState } from "react";
import { albums } from "./data/albums";
import { NowPlaying } from "./components/NowPlaying/NowPlaying";
import { Collection } from "./components/Collection/Collection";

function App() {
  const [selectedId, setSelectedId] = useState(null);
  const spineRefs = useRef(new Map());
  const activeFilterRef = useRef(null);

  const selectedAlbum = albums.find((album) => album.id === selectedId);

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
      />
    </div>
  );
}

export default App;
