export const Spine = ({ album, onClick, isSelected }) => {
  const { title, artist, color, height } = album;
  return (
    <button
      style={{ backgroundColor: color, height }}
      className={`w-10 shrink-0 cursor-pointer rounded-b-sm p-2 flex justify-between items-center [writing-mode:vertical-rl] rotate-180 select-none transition-transform hover:-translate-y-2 text-paper focus-visible:outline-2 focus-visible:outline-ember focus-visible:outline-offset-2 ${
        isSelected
          ? "-translate-y-2 outline-2 outline-ember outline-offset-2"
          : ""
      }`}
      onClick={onClick}
      aria-pressed={isSelected}
    >
      <span className="font-bold  text-xs tracking-wide truncate max-h-36">
        {title}
      </span>
      <span className="font-mono text-paper/80 text-[10px] tracking-wider truncate max-h-24">
        {artist}
      </span>
    </button>
  );
};
