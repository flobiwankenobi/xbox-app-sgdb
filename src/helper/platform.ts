function normalizePlatform(platform: string): string {
  return platform.toLowerCase();
}

export function isBattleNet(platform: string): boolean {
  const name = normalizePlatform(platform);
  return name.match(/b(attle)?net/) != null;
}

export function isEpic(platform: string): boolean {
  return normalizePlatform(platform).includes('epic');
}

export function isGog(platform: string): boolean {
  return normalizePlatform(platform).includes('gog');
}

export function isSteam(platform: string): boolean {
  return normalizePlatform(platform).includes('steam');
}

export function isUbi(platform: string): boolean {
  return normalizePlatform(platform).includes('ubi');
}
