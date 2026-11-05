import { Spine } from "../Spine/Spine";

export const Shelf = ({
  albums,
  onSelect,
  selectedId,
  registerSpine,
  isRemoving,
  onRemoveRequest,
}) => {
  return (
    <div className="w-full ">
      <div className="flex items-end gap-1 px-4 ">
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
          />
        ))}
      </div>
      <div className="h-4 w-full bg-wood-500 border-t-3 border-wood-300 rounded-xs shadow-sm" />
    </div>
  );
};
