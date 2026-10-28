import { useEffect, useRef, useState } from "react";
import { getPreviewUrl } from "../../services/itunes";
import { AlbumDetails } from "../AlbumDetails/AlbumDetails";
import { Turntable } from "../Turntable/Turntable";

export const NowPlaying = ({ album, onReturn }) => {
  const [preview, setPreview] = useState({ albumId: null, url: null });
  const [playingUrl, setPlayingUrl] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!album) return;

    let ignore = false;

    getPreviewUrl(album.artist, album.track)
      .then((url) => {
        if (!ignore) {
          setPreview({ albumId: album.id, url });
        }
      })
      .catch(() => {
        if (!ignore) {
          setPreview({ albumId: album.id, url: null });
        }
      });

    return () => {
      ignore = true;
    };
  }, [album]);

  const previewUrl = preview.albumId === album?.id ? preview.url : null;
  const isLoading = Boolean(album) && preview.albumId !== album.id;
  const isUnavailable = Boolean(album) && !isLoading && previewUrl === null;
  const isPlaying = previewUrl !== null && playingUrl === previewUrl;

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  }

  return (
    <aside className="sticky top-4 self-start h-[calc(100vh-2rem)] p-8 flex flex-col gap-6">
      <div
        aria-hidden="true"
        className="absolute right-0 top-8 bottom-8 w-px bg-line "
      />
      <div className="flex items-center justify-between">
        <span className="font-mono text-sm text-ember uppercase tracking-widest">
          Tocando agora
        </span>
        {album && (
          <button
            type="button"
            onClick={onReturn}
            className="group flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-muted cursor-pointer transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
          >
            Devolver
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-3 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
              <path d="m13 6 6 6-6 6" />
            </svg>
          </button>
        )}
      </div>
      <div className=" flex flex-col gap-6 ">
        <div className="w-full max-w-[38vh]">
          <Turntable
            album={album}
            isPlaying={isPlaying}
            canPlay={previewUrl !== null}
            onTogglePlay={togglePlay}
          />
        </div>
        <AlbumDetails album={album} />
        <p role="status" className="font-mono text-xs text-muted">
          {isLoading && "Buscando a faixa…"}
          {isUnavailable && "Prévia indisponível para este disco"}
          {previewUrl && (
            <span className="text-sm text-ink">♪ {album.track}</span>
          )}
        </p>
        {previewUrl && (
          <audio
            ref={audioRef}
            src={previewUrl}
            autoPlay
            onPlay={() => setPlayingUrl(previewUrl)}
            onPause={() => setPlayingUrl(null)}
            onEnded={() => setPlayingUrl(null)}
          />
        )}
      </div>
    </aside>
  );
};
