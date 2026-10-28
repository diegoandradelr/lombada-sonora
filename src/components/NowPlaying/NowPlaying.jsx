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
      <span className="font-mono text-xs text-ember uppercase tracking-widest ">
        Tocando agora
      </span>
      <div className="flex flex-col gap-6 mt-6">
        <Turntable
          album={album}
          isPlaying={isPlaying}
          canPlay={previewUrl !== null}
          onTogglePlay={togglePlay}
        />
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
