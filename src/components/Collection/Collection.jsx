import { useState } from "react";
import { Shelf } from "../Shelf/Shelf";
import { chunk } from "../../utils/chunk";
import { AlbumSearch } from "../AlbumSearch/AlbumSearch";
import { getGenres } from "../../utils/getGenres";
import { GenreFilter } from "../GenreFilter/GenreFilter";

export const Collection = ({
  albums,
  onSelect,
  selectedId,
  registerSpine,
  activeFilterRef,
  onAdd,
}) => {
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [isRemoving, setIsRemoving] = useState(false);

  const genres = getGenres(albums);
  const visibleAlbums = selectedGenre
    ? albums.filter((album) => album.genre === selectedGenre)
    : albums;
  const shelves = chunk(visibleAlbums, 6);

  function handleRemoveRequest(album) {
    console.log("remover:", album.title);
  }

  return (
    <main className="p-6">
      <div className="mb-8 flex items-center justify-between gap-4">
        <h1 className="font-display text-4xl font-bold">Minha estante</h1>
        <button
          type="button"
          onClick={() => setIsRemoving((current) => !current)}
          aria-pressed={isRemoving}
          className={`shrink-0 cursor-pointer rounded-full border px-3 py-1 font-mono text-xs uppercase tracking-widest transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
            isRemoving
              ? "border-ink bg-ink text-sage"
              : "border-line text-muted hover:border-ink hover:text-ink"
          }`}
        >
          {isRemoving ? "Concluir" : "Remover discos"}
        </button>
      </div>
      <p
        role="status"
        className="-mt-6 mb-6 min-h-4 font-mono text-xs text-muted"
      >
        {isRemoving && "Clique numa lombada para remover o disco da estante."}
      </p>
      <AlbumSearch onAdd={onAdd} albums={albums} />
      <GenreFilter
        genres={genres}
        selectedGenre={selectedGenre}
        onChange={setSelectedGenre}
        activeFilterRef={activeFilterRef}
      />
      <div className="flex flex-col gap-8">
        {shelves.map((shelf, index) => (
          <Shelf
            key={index}
            albums={shelf}
            onSelect={onSelect}
            selectedId={selectedId}
            registerSpine={registerSpine}
            isRemoving={isRemoving}
            onRemoveRequest={handleRemoveRequest}
          />
        ))}
      </div>
    </main>
  );
};
