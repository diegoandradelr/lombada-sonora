import { useEffect, useRef } from "react";

export const ConfirmRemove = ({ album, onConfirm, onCancel }) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (album && !dialog.open) {
      dialog.showModal();
    }

    if (!album && dialog.open) {
      dialog.close();
    }
  }, [album]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onCancel}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          event.currentTarget.close();
        }
      }}
      aria-labelledby="confirm-remove-title"
      className="m-auto w-[calc(100%-2rem)] max-w-sm rounded-lg bg-sage p-0 text-ink shadow-xl backdrop:bg-ink/45"
    >
      <div className="p-6">
        {album && (
          <>
            <h2
              id="confirm-remove-title"
              className="font-display text-xl font-bold leading-tight"
            >
              Remover “{album.title}” da estante?
            </h2>
            <p className="mt-2 text-sm text-muted">
              O disco sai da sua coleção. Dá para adicionar de novo pela busca.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="cursor-pointer rounded-full border border-line px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:border-ink hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="cursor-pointer rounded-full border border-ink bg-ink px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-sage transition-colors hover:bg-ink/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                Remover
              </button>
            </div>
          </>
        )}
      </div>
    </dialog>
  );
};
