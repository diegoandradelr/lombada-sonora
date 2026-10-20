import { Shelf } from "../Shelf/Shelf";
import { chunk } from "../../utils/chunk";

export const Collection = ({ albums, onSelect, selectedId }) => {
  const shelves = chunk(albums, 6);

  return (
    <main className="p-6">
      <h1 className="font-display text-4xl font-bold mb-8">Minha estante</h1>
      <div className="flex flex-col gap-8">
        {shelves.map((shelf, index) => (
          <Shelf
            key={index}
            albums={shelf}
            onSelect={onSelect}
            selectedId={selectedId}
          />
        ))}
      </div>
    </main>
  );
};
