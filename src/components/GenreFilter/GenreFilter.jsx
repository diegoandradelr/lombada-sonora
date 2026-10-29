export const GenreFilter = ({
  genres,
  selectedGenre,
  onChange,
  activeFilterRef,
}) => {
  const getButtonClasses = (isActive) =>
    `cursor-pointer rounded-full border px-3 py-1 font-mono text-xs transition-colors focus-visible:outline-2 focus-visible:outline-ember focus-visible:outline-offset-2 ${
      isActive
        ? "border-ink bg-ink text-sage"
        : "border-line text-muted hover:border-ink"
    }`;

  return (
    <div
      role="group"
      aria-label="Filtrar por gênero"
      className="flex flex-wrap gap-2 mb-8"
    >
      <button
        type="button"
        onClick={() => onChange(null)}
        aria-pressed={selectedGenre === null}
        className={getButtonClasses(selectedGenre === null)}
        ref={selectedGenre === null ? activeFilterRef : null}
      >
        Todos
      </button>

      {genres.map((genre) => (
        <button
          key={genre}
          type="button"
          onClick={() => onChange(genre)}
          aria-pressed={selectedGenre === genre}
          className={getButtonClasses(selectedGenre === genre)}
          ref={selectedGenre === genre ? activeFilterRef : null}
        >
          {genre}
        </button>
      ))}
    </div>
  );
};
