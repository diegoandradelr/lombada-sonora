export const Turntable = ({ album }) => {
  return (
    <div className="relative aspect-[1.15] w-full rounded-md bg-wood-500 border-t-4 border-wood-300 shadow-md">
      {/* prato */}
      <div className="absolute left-[8%] top-[10%] w-[68%] aspect-square rounded-full bg-ink/20">
        {album && (
          <div
            key={album.id}
            className="size-full motion-safe:animate-record-in"
          >
            <div className="relative size-full rounded-full grooves motion-safe:animate-spin-record">
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
          album ? "rotate-[22deg] delay-300" : "rotate-0"
        }`}
      />
      {/* pivô do braço */}
      <div className="absolute right-[7%] top-[5%] size-4 rounded-full bg-paper" />
    </div>
  );
};
