export const AlbumDetails = ({ album }) => {
  return (
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
          {album.note && (
            <p className="mt-4 text-sm leading-relaxed">{album.note}</p>
          )}
        </>
      ) : (
        <p className="text-muted">Escolha um disco na estante</p>
      )}
    </div>
  );
};
