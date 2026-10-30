const BASE_URL = "https://itunes.apple.com/search";

export async function getPreviewUrl(artist, track) {
  const params = new URLSearchParams({
    term: `${artist} ${track}`,
    entity: "song",
    country: "BR",
    limit: "5",
  });

  const response = await fetch(`${BASE_URL}?${params}`);

  if (!response.ok) {
    throw new Error(`A API do iTunes respondeu com status ${response.status}`);
  }

  const data = await response.json();
  const match = data.results.find((result) => result.previewUrl);

  return match?.previewUrl ?? null;
}

export async function searchAlbums(term) {
  const params = new URLSearchParams({
    term,
    entity: "album",
    country: "BR",
    limit: "8",
  });

  const response = await fetch(`${BASE_URL}?${params}`);

  if (!response.ok) {
    throw new Error(`A API do iTunes respondeu com status ${response.status}`);
  }

  const data = await response.json();

  return data.results.map((result) => ({
    id: result.collectionId,
    title: result.collectionName,
    artist: result.artistName,
    year: new Date(result.releaseDate).getFullYear(),
    genre: result.primaryGenreName,
    cover: result.artworkUrl100,
  }));
}
