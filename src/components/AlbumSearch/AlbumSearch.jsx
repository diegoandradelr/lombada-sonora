import { useEffect, useRef, useState } from "react";
import { searchAlbums } from "../../services/itunes";
import { isSameAlbum } from "../../utils/isSameAlbum";

export const AlbumSearch = ({ albums, onAdd }) => {
  const [query, setQuery] = useState("");
  const searchInputRef = useRef(null);
  const [search, setSearch] = useState({
    term: "",
    results: [],
    failed: false,
  });

  const term = query.trim();

  useEffect(() => {
    const searchTerm = query.trim();
    if (searchTerm.length < 2) return;

    let ignore = false;

    const timer = setTimeout(() => {
      searchAlbums(searchTerm)
        .then((results) => {
          if (!ignore) {
            setSearch({ term: searchTerm, results, failed: false });
          }
        })
        .catch(() => {
          if (!ignore) {
            setSearch({ term: searchTerm, results: [], failed: true });
          }
        });
    }, 400);

    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [query]);

  const isActive = term.length >= 2;
  const isLoading = isActive && search.term !== term;
  const isDone = isActive && !isLoading;
  const results = isDone ? search.results : [];

  function clearSearch() {
    setQuery("");
    searchInputRef.current?.focus();
  }

  return (
    <div className="mb-8 max-w-md">
      <label htmlFor="album-search" className="sr-only">
        Buscar discos para adicionar à coleção
      </label>
      <input
        ref={searchInputRef}
        id="album-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Buscar disco ou artista…"
        autoComplete="off"
        className="w-full bg-transparent border-b border-line py-2 font-mono text-sm placeholder:text-muted outline-none focus:border-ink"
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            clearSearch();
          }
        }}
      />

      <div className="mt-2 flex items-center justify-between gap-4">
        <p role="status" className="font-mono text-xs text-muted">
          {isLoading && "Buscando…"}
          {isDone &&
            search.failed &&
            "Não foi possível buscar agora. Tente de novo."}
          {isDone &&
            !search.failed &&
            results.length === 0 &&
            `Nenhum disco encontrado para “${term}”.`}
          {results.length > 0 &&
            `${results.length} ${results.length === 1 ? "disco encontrado" : "discos encontrados"}`}
        </p>
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="shrink-0 font-mono text-xs uppercase tracking-widest text-muted cursor-pointer transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
          >
            Limpar
          </button>
        )}
      </div>

      {results.length > 0 && (
        <ul className="mt-3 flex flex-col divide-y divide-line">
          {results.map((album) => (
            <li key={album.id} className="flex items-center gap-3 py-2">
              <img
                src={album.cover}
                alt=""
                className="size-12 shrink-0 rounded-sm"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{album.title}</p>
                <p className="truncate text-xs text-muted">{album.artist}</p>
                <p className="font-mono text-xs text-muted">
                  {album.year} · {album.genre}
                </p>
              </div>
              {albums.some((owned) => isSameAlbum(owned, album)) ? (
                <span className="ml-auto shrink-0 font-mono text-xs text-muted">
                  Na estante
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => onAdd(album)}
                  className="ml-auto shrink-0 font-mono text-xs uppercase tracking-widest underline cursor-pointer hover:text-ink text-muted"
                >
                  Adicionar
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
