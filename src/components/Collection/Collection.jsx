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
}) => {
  const [selectedGenre, setSelectedGenre] = useState(null);

  const genres = getGenres(albums);
  const visibleAlbums = selectedGenre
    ? albums.filter((album) => album.genre === selectedGenre)
    : albums;
  const shelves = chunk(visibleAlbums, 6);

  return (
    <main className="p-6">
      <h1 className="font-display text-4xl font-bold mb-8">Minha estante</h1>
      <AlbumSearch />
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
          />
        ))}
      </div>
    </main>
  );
};
