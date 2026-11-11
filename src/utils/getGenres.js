import { GENRES } from "../data/genres";

export function getGenres(albums) {
  return GENRES.filter((genre) =>
    albums.some((album) => album.genre === genre),
  );
}
