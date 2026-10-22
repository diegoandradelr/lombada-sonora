const BASE_URL = "https://itunes.apple.com/search";

export async function getPreviewUrl(artist, track) {
  const params = new URLSearchParams({
    term: `${artist} ${track}`,
    entity: "song",
    country: "BR",
    limit: "1",
  });

  const response = await fetch(`${BASE_URL}?${params}`);
  const data = await response.json();

  return data.results[0]?.previewUrl ?? null;
}
