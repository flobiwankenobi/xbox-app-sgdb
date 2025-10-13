export async function getTitleByEpicId(gameId: string): Promise<string | undefined> {
  const baseURL = 'https://api.egdata.app/multisearch/offers?query=';
  try {
    const response = await fetch(baseURL + gameId);
    const data = await response.json();
    return data?.hits?.[0]?.title;
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw new Error(`EGData API request failed: ${err.message}`);
    }
  }
}
