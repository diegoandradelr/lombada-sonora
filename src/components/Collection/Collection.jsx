import { useEffect, useRef, useState } from "react";
import { Shelf } from "../Shelf/Shelf";
import { chunk } from "../../utils/chunk";
import { AlbumSearch } from "../AlbumSearch/AlbumSearch";
import { getGenres } from "../../utils/getGenres";
import { GenreFilter } from "../GenreFilter/GenreFilter";
import { ConfirmRemove } from "../ConfirmRemove/ConfirmRemove";

export const Collection = ({
  albums,
  onSelect,
  selectedId,
  registerSpine,
  activeFilterRef,
  onAdd,
  onRemove,
}) => {
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const [albumToRemove, setAlbumToRemove] = useState(null);
  const [removedCount, setRemovedCount] = useState(0);
  const [leavingId, setLeavingId] = useState(null);
  const removeToggleRef = useRef(null);
  const searchInputRef = useRef(null);

  const genres = getGenres(albums);
  const visibleAlbums = selectedGenre
    ? albums.filter((album) => album.genre === selectedGenre)
    : albums;
  const shelves = chunk(visibleAlbums, 6);

  useEffect(() => {
    if (removedCount === 0) return;

    if (removeToggleRef.current) {
      removeToggleRef.current.focus();
    } else {
      searchInputRef.current?.focus();
    }
  }, [removedCount]);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key !== "/") return;

      const tag = event.target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      event.preventDefault();
      searchInputRef.current?.focus();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function handleRemoveRequest(album) {
    if (leavingId !== null) return;
    setAlbumToRemove(album);
  }

  function handleConfirmRemove() {
    const removed = albumToRemove;
    setAlbumToRemove(null);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      finishRemove(removed);
    } else {
      setLeavingId(removed.id);
    }
  }

  function finishRemove(removed) {
    const isLastOfFilteredGenre =
      removed.genre === selectedGenre &&
      !albums.some(
        (album) => album.id !== removed.id && album.genre === removed.genre,
      );

    if (isLastOfFilteredGenre) {
      setSelectedGenre(null);
    }

    if (albums.length === 1) {
      setIsRemoving(false);
    }

    setLeavingId(null);
    setRemovedCount((count) => count + 1);
    onRemove(removed.id);
  }

  return (
    <main className="p-6">
      <div className="mb-8 flex items-center justify-between gap-4">
        <h1 className="font-display text-4xl font-bold">Minha estante</h1>
        {albums.length > 0 && (
          <button
            ref={removeToggleRef}
            type="button"
            onClick={() => setIsRemoving((current) => !current)}
            aria-pressed={isRemoving}
            className={`shrink-0 cursor-pointer rounded-full border px-2 py-1 font-mono text-xs uppercase tracking-widest transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
              isRemoving
                ? "border-ink bg-ink text-sage"
                : "border-line text-muted hover:border-ink hover:text-ink"
            }`}
          >
            {isRemoving ? "Concluir" : "Remover discos"}
          </button>
        )}
      </div>
      <p
        role="status"
        className="-mt-6 mb-6 min-h-4 font-mono text-xs text-muted"
      >
        {isRemoving && "Clique numa lombada para remover o disco da estante."}
      </p>
      {!isRemoving && (
        <AlbumSearch onAdd={onAdd} albums={albums} inputRef={searchInputRef} />
      )}
      <GenreFilter
        genres={genres}
        selectedGenre={selectedGenre}
        onChange={setSelectedGenre}
        activeFilterRef={activeFilterRef}
      />
      <div className="flex flex-col gap-8">
        {shelves.length === 0 ? (
          <Shelf albums={[]}>
            <p className="font-mono text-xs text-muted">
              Sua estante está vazia. Use a busca acima para adicionar discos.
            </p>
          </Shelf>
        ) : (
          shelves.map((shelf, index) => (
            <Shelf
              key={index}
              albums={shelf}
              onSelect={onSelect}
              selectedId={selectedId}
              registerSpine={registerSpine}
              isRemoving={isRemoving}
              onRemoveRequest={handleRemoveRequest}
              leavingId={leavingId}
              onLeft={finishRemove}
            />
          ))
        )}
      </div>
      <ConfirmRemove
        album={albumToRemove}
        onConfirm={handleConfirmRemove}
        onCancel={() => setAlbumToRemove(null)}
      />
    </main>
  );
};
