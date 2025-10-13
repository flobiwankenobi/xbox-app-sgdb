export async function getTitleByGogId(gameId: string): Promise<string | undefined> {
  const baseURL = 'https://api.gog.com/products/';
  try {
    const response = await fetch(baseURL + gameId);
    const data = await response.json();
    return data?.title;
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw new Error(`GOGDB API request failed: ${err.message}`);
    }
  }
}
