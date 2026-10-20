import { AlbumDetails } from "../AlbumDetails/AlbumDetails";
import { Turntable } from "../Turntable/Turntable";

export const NowPlaying = ({ album, onReturn }) => {
  return (
    <aside className="sticky top-4 self-start h-[calc(100vh-2rem)] p-8 flex flex-col gap-6">
      <div
        aria-hidden="true"
        className="absolute right-0 top-8 bottom-8 w-px bg-line "
      />
      <span className="font-mono text-xs text-ember uppercase tracking-widest ">
        Tocando agora
      </span>
      <div className="flex flex-col gap-6 mt-6">
        <Turntable album={album} />
        <AlbumDetails album={album} />
        {album && (
          <button
            type="button"
            onClick={onReturn}
            className="self-start font-mono text-xs uppercase tracking-widest underline cursor-pointer mt-6 hover:text-ember"
          >
            Devolver à prateleira
          </button>
        )}
      </div>
    </aside>
  );
};
