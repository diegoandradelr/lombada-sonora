export const Turntable = ({ album, isPlaying, canPlay, onTogglePlay }) => {
  return (
    <div className="relative aspect-[1.15] w-full rounded-md bg-wood-500 border-t-4 border-wood-300 shadow-md">
      {/* prato */}
      <div className="absolute left-[8%] top-[10%] w-[68%] aspect-square rounded-full bg-ink/20">
        {album && (
          <div
            key={album.id}
            className="size-full motion-safe:animate-record-in"
          >
            <div
              className="relative size-full rounded-full grooves motion-safe:animate-spin-record"
              style={{ animationPlayState: isPlaying ? "running" : "paused" }}
            >
              {/* selo central, na cor do disco */}
              <div
                className="absolute inset-[34%] rounded-full border-2 border-transparent border-t-paper/40"
                style={{ backgroundColor: album.color }}
              />

              {/* furo central */}
              <div className="absolute inset-[48%] rounded-full bg-ink" />
            </div>
          </div>
        )}
      </div>

      {/* braço */}
      <div
        className={`absolute right-[10%] top-[8%] h-[55%] w-1 rounded-full bg-paper origin-top transition-transform duration-700 ${
          album ? "rotate-22 delay-300" : "rotate-0"
        }`}
      />
      {/* pivô do braço */}
      <div className="absolute right-[7%] top-[5%] size-4 rounded-full bg-paper" />

      {canPlay && (
        <button
          type="button"
          onClick={onTogglePlay}
          aria-label={isPlaying ? "Pausar" : "Tocar"}
          className="absolute right-[6%] bottom-[7%] size-10 rounded-full grid place-items-center bg-paper text-ink cursor-pointer transition duration-100 hover:brightness-95 active:translate-y-0.5 shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          {isPlaying ? (
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-4"
              aria-hidden="true"
            >
              <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-4 translate-x-px"
              aria-hidden="true"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
};
