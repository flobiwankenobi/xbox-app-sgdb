const baseURL = 'https://raw.githubusercontent.com/Haoose/UPLAY_GAME_ID/refs/heads/master/README.md';

export async function getTitleByUplayId(gameId: string): Promise<string | undefined> {
  try {
    const response = await fetch(baseURL).then((res) => res.text());
    const gameEntry = response.split('\n').find((line) => line.startsWith(gameId));
    const gameTitle = gameEntry?.substring(gameEntry.indexOf('-') + 2);

    return gameTitle?.trim();
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw new Error(`UplayIdDB API request failed: ${err.message}`);
    }
  }
}
