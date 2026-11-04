function normalize(text) {
  return text
    .replace(/\s*[([].*?[)\]]/g, "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function isSameAlbum(a, b) {
  if (a.id === b.id) return true;

  return (
    normalize(a.title) === normalize(b.title) &&
    normalize(a.artist) === normalize(b.artist)
  );
}
