import { useEffect, useRef, useState } from "react";
import { getPreview } from "../../services/itunes";
import { AlbumDetails } from "../AlbumDetails/AlbumDetails";
import { Turntable } from "../Turntable/Turntable";
import { Logo } from "../Logo/Logo";

export const NowPlaying = ({ album, onReturn, onUpdate }) => {
  const [preview, setPreview] = useState({
    albumId: null,
    url: null,
    track: null,
  });
  const [playingUrl, setPlayingUrl] = useState(null);
  const audioRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!album) return;

    let ignore = false;

    getPreview(album)
      .then((result) => {
        if (!ignore) {
          setPreview({
            albumId: album.id,
            url: result?.url ?? null,
            track: result?.track ?? null,
          });
        }
      })
      .catch(() => {
        if (!ignore) {
          setPreview({ albumId: album.id, url: null, track: null });
        }
      });

    return () => {
      ignore = true;
    };
  }, [album]);

  const previewUrl = preview.albumId === album?.id ? preview.url : null;
  const trackName = preview.albumId === album?.id ? preview.track : null;
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

  function showPanel() {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const behavior = prefersReducedMotion ? "auto" : "smooth";

    panelRef.current?.scrollIntoView({ behavior, block: "start" });
  }

  return (
    <aside
      ref={panelRef}
      aria-label="Tocando agora"
      className="lg:sticky lg:top-4 lg:self-start lg:h-[calc(100vh-2rem)] px-8 pt-6 pb-24 lg:pb-6 flex flex-col gap-6 lg:col-start-1 lg:row-start-1"
    >
      <div className="hidden lg:block lg:shrink-0">
        <Logo />
      </div>
      <div
        aria-hidden="true"
        className="absolute right-0 top-8 bottom-8 w-px bg-line hidden lg:block"
      />
      <div className="shrink-0 flex items-center justify-between">
        <span className="flex items-center gap-2 font-mono text-sm text-ink uppercase tracking-widest">
          <span aria-hidden="true" className="size-2 rounded-full bg-ember" />
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
      <div className="flex min-h-0 flex-1 flex-col gap-5">
        <div className="shrink-0 w-full max-w-[32vh]">
          <Turntable
            album={album}
            isPlaying={isPlaying}
            canPlay={previewUrl !== null}
            onTogglePlay={togglePlay}
          />
        </div>
        <div className="-mx-2 min-h-0 overflow-y-auto px-2 pb-2 scrollbar-thin [scrollbar-color:var(--color-line)_transparent]">
          <AlbumDetails album={album} onUpdate={onUpdate} />
        </div>
        <p role="status" className="shrink-0 font-mono text-xs text-muted">
          {isLoading && "Buscando a faixa…"}
          {isUnavailable && "Prévia indisponível para este disco"}
          {previewUrl && (
            <span className="text-sm text-ink">♪ {trackName}</span>
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
      {album && (
        <div className="fixed inset-x-3 bottom-3 z-10 flex items-center gap-3 rounded-xl bg-ink px-4 py-3 text-paper shadow-lg lg:hidden">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{album.title}</p>
            <p className="truncate font-mono text-xs text-paper/70">
              {album.artist}
            </p>
          </div>
          <button
            type="button"
            onClick={showPanel}
            className="shrink-0 cursor-pointer rounded-full border border-paper/40 px-3 py-1 font-mono text-xs uppercase tracking-widest text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
            aria-label="Ver o disco no toca-discos"
          >
            Ver
          </button>

          <button
            type="button"
            onClick={togglePlay}
            disabled={isLoading || isUnavailable}
            aria-label={isPlaying ? "Pausar prévia" : "Tocar prévia"}
            className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full bg-paper text-ink disabled:opacity-40"
          >
            {isPlaying ? "❚❚" : "▶"}
          </button>
        </div>
      )}
    </aside>
  );
};
