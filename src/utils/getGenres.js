export function getGenres(albums) {
  const genres = albums.map((album) => album.genre);
  const unique = new Set(genres);

  return [...unique].sort((a, b) => a.localeCompare(b, "pt-BR"));
}
