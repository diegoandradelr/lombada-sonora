import { Spine } from "../Spine/Spine";

export const Shelf = ({
  albums,
  onSelect,
  selectedId,
  registerSpine,
  isRemoving,
  onRemoveRequest,
  children,
  leavingId,
  onLeft,
}) => {
  return (
    <div className="w-full ">
      <div
        className={`flex items-end gap-1 px-4 ${
          albums.length === 0 ? "min-h-60 pb-4" : ""
        }`}
      >
        {albums.map((album) => (
          <Spine
            key={album.id}
            album={album}
            onClick={() =>
              isRemoving ? onRemoveRequest(album) : onSelect(album.id)
            }
            isSelected={album.id === selectedId}
            ref={(element) => registerSpine(album.id, element)}
            isRemoving={isRemoving}
            isLeaving={album.id === leavingId}
            onLeaveEnd={() => onLeft(album)}
          />
        ))}
        {children}
      </div>
      <div className="h-4 w-full bg-wood-500 border-t-3 border-wood-300 rounded-xs shadow-sm" />
    </div>
  );
};
