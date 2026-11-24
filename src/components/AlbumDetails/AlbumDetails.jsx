import { useState } from "react";
import { GENRES } from "../../data/genres";

export const AlbumDetails = ({ album, onUpdate }) => {
  const [draft, setDraft] = useState(null);

  const isEditing = album !== undefined && draft?.albumId === album.id;

  function handleSubmit(event) {
    event.preventDefault();

    onUpdate(draft.albumId, { note: draft.note, genre: draft.genre });
    setDraft(null);
  }

  return (
    <div className="flex flex-col gap-1">
      <div aria-live="polite" className="flex flex-col gap-1">
        {album ? (
          <>
            <h2
              className={`font-display font-bold leading-tight text-balance ${
                album.title.length > 24 ? "text-2xl" : "text-3xl"
              }`}
            >
              {album.title}
            </h2>
            <p className="text-muted">{album.artist}</p>
            <p className="font-mono text-xs text-muted mt-2">
              {album.year} · {album.genre}
            </p>
          </>
        ) : (
          <p className="text-muted">Escolha um disco na estante</p>
        )}
      </div>

      {album &&
        (isEditing ? (
          <form className="mt-4 flex flex-col gap-2" onSubmit={handleSubmit}>
            <label
              htmlFor="album-note"
              className="font-mono text-xs text-muted"
            >
              Nota
            </label>
            <textarea
              id="album-note"
              rows={4}
              value={draft.note}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  note: event.target.value,
                }))
              }
              className="w-full resize-none bg-transparent border border-line rounded-sm p-2 text-sm leading-relaxed outline-none focus:border-ink"
            />
            <label
              htmlFor="album-genre"
              className="mt-2 font-mono text-xs text-muted"
            >
              Gênero
            </label>
            <select
              id="album-genre"
              value={draft.genre}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  genre: event.target.value,
                }))
              }
              className="w-full bg-transparent border border-line rounded-sm p-2 text-sm outline-none focus:border-ink"
            >
              {GENRES.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
            <div className="mt-2 flex gap-4">
              <button
                type="submit"
                className="font-mono text-xs uppercase tracking-widest text-ink cursor-pointer transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
              >
                Salvar
              </button>
              <button
                type="button"
                onClick={() => setDraft(null)}
                className="font-mono text-xs uppercase tracking-widest text-muted cursor-pointer transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <>
            {album.note && (
              <p className="mt-4 text-sm leading-relaxed">{album.note}</p>
            )}
            <button
              type="button"
              onClick={() =>
                setDraft({
                  albumId: album.id,
                  note: album.note,
                  genre: album.genre,
                })
              }
              className="self-start font-mono text-xs uppercase tracking-widest text-muted cursor-pointer transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
            >
              Editar
            </button>
          </>
        ))}
    </div>
  );
};
