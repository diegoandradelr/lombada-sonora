export const Spine = ({ album, onClick, isSelected, ref, isRemoving }) => {
  const { title, artist, color, height } = album;
  return (
    <button
      style={{ backgroundColor: color, height }}
      className={`relative w-10 shrink-0 cursor-pointer rounded-b-sm p-2 flex justify-between items-center [writing-mode:vertical-rl] rotate-180 select-none transition-transform hover:-translate-y-2 text-paper focus-visible:outline-2 focus-visible:outline-ember focus-visible:outline-offset-2 ${
        isSelected
          ? "-translate-y-2 outline-2 outline-ember outline-offset-2"
          : ""
      } ${
        isRemoving
          ? "motion-safe:animate-wobble odd:[animation-delay:-250ms]"
          : ""
      }`}
      ref={ref}
      onClick={onClick}
      aria-label={isRemoving ? `Remover ${title}` : undefined}
      aria-pressed={isRemoving ? undefined : isSelected}
    >
      <span className="font-bold  text-xs tracking-wide truncate max-h-36">
        {title}
      </span>
      <span className="font-mono text-paper/80 text-[10px] tracking-wider truncate max-h-24">
        {artist}
      </span>
      {isRemoving && (
        <span
          aria-hidden="true"
          className="absolute bottom-1.5 left-1/2 -translate-x-1/2 rotate-180 size-5 grid place-items-center rounded-full bg-paper text-ink text-sm font-mono [writing-mode:horizontal-tb]"
        >
          ×
        </span>
      )}
    </button>
  );
};
