import fs, { type Dirent } from 'node:fs';
import path from 'node:path';
import readline from 'node:readline/promises';
import { Jimp } from 'jimp';
import SGDB, { type SGDBImageOptions, type SGDBImage } from 'steamgriddb';

import { config, userConfig } from './config';
import { log } from './helper/log';
import { getTitleByUplayId } from './api/uplayid';
import { isEpic, isGog, isSteam, isUbi } from './helper/platform';
import { getTitleByEpicId } from './api/egdata';
import { getTitleByGogId } from './api/gogdb';

const { promises: fsp } = fs;
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
let failures = new Set();

async function downloadToFile(url: string, destPath: string) {
  log.debug('Downloading image', url);
  const res = await fetch(url);
  if (!res.ok) {
    log.error(`Failed to download ${url}: ${res.status} ${res.statusText}`);
  }

  if (isGog(destPath) || isUbi(destPath)) {
    await fsp.chmod(destPath, 0o755);
  }

  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const image = await Jimp.read(buffer);
  image.resize({ w: 200 });
  image.crop({ x: 0, y: 0, w: 200, h: 200 });

  if (userConfig.dryRun) return;

  await image.write(destPath as `${string}.${string}`);

  // Make image read-only because it gets overwritten
  if ((isGog(destPath) || isUbi(destPath)) && userConfig.force) {
    await fsp.chmod(destPath, 0o444);
  }
}

async function getGameTitle(platform: string, gameId: string): Promise<string> {
  let gameTitle: string | undefined;

  if (isEpic(platform)) {
    gameTitle = await getTitleByEpicId(gameId);
  } else if (isGog(platform)) {
    gameTitle = await getTitleByGogId(gameId);
  } else if (isUbi(platform)) {
    gameTitle = await getTitleByUplayId(gameId);
  }

  if (!gameTitle) {
    log.error(`Could not retrieve title for game ${gameId}`);
    return gameId;
  }

  return gameTitle;
}

async function processGameCovers<T = unknown>(
  iterable: Dirent[],
  mapper: (item: Dirent) => Promise<T>,
  concurrency = 5
) {
  const results: Promise<T>[] = [];
  const executing = new Set<Promise<T>>();

  for (const item of iterable) {
    while (executing.size >= concurrency) {
      await Promise.race(Array.from(executing));
    }

    const p = Promise.resolve().then(() => mapper(item));
    results.push(p);

    const remove = () => executing.delete(p);
    p.then(remove, remove);
    executing.add(p);
  }

  // Wait for all to settle but propagate results if needed
  return Promise.allSettled(results);
}

async function processGame(parentPath: string, fileName: string) {
  let [platform, gameId] = fileName.substring(0, fileName.lastIndexOf('.')).split('_');

  log.info('Processing', gameId, 'on', platform);

  const sgdb = new SGDB({
    key: userConfig.apiKey,
  });

  if (!isSteam(platform)) {
    const gameTitle = await getGameTitle(platform, gameId);
    const response = await sgdb.searchGame(gameTitle);
    gameId = response[0].id.toString();
  }

  if (userConfig.mapIds[gameId]) {
    gameId = userConfig.mapIds[gameId];
  }

  const getCover = async (dimensions?: typeof userConfig.dimensions) => {
    const opts: SGDBImageOptions = {
      type: isSteam(platform) ? platform : 'game',
      id: Number(gameId),
      styles: ['alternate', 'white_logo', 'material'],
      types: ['static'],
    };
    if (dimensions) opts.dimensions = dimensions;

    return await sgdb.getGrids(opts);
  };

  let images: SGDBImage[] = [];

  try {
    images = await getCover(userConfig.dimensions);

    if (!images?.length) {
      log.warn('No square images found for', gameId, 'on', platform, '-', 'Retrying wihtout dimensions filter.');

      images = await getCover(['600x900']);
    }

    if (!images?.length) {
      log.warn('No images found for', gameId, 'on', platform);
      return false;
    }

    await downloadToFile(images[0].url.toString(), path.join(parentPath, fileName));
    log.info('Saved cover for', gameId, 'on', platform);

    return true;
  } catch (err: unknown) {
    failures.add(gameId);
    log.error(err, 'Error processing cover for', gameId, 'on', platform, '-');
    return false;
  }
}

async function ensureConfigFile() {
  if (fs.existsSync(config.path)) return;

  const apiKey = await rl.question('Please enter your SteamGridDB API key to continue: \n');
  if (apiKey.length != 32) {
    rl.write('Your API key is not valid, please try again. \n');
    return ensureConfigFile();
  }

  userConfig.apiKey = apiKey;
  await fsp.writeFile(config.path, JSON.stringify(userConfig, null, 2));

  log.debug(`Created config at ${path.join(process.cwd(), config.path)}`);
  rl.prompt();
}

async function readGameCovers() {
  const entries = await fsp.readdir(config.thirdpartyPath, { withFileTypes: true, recursive: true });
  const gameCovers = entries.filter((entry) => entry.isFile() && entry.name.endsWith('.png'));

  if (!gameCovers.length) {
    await rl.question('🤷 Could not find any game covers to patch. Press ENTER to quit.');
    process.exit(0);
  }

  log.info(`Found ${gameCovers.length} game covers to patch.`);

  return gameCovers;
}

async function main() {
  try {
    if (!process.env.LOCALAPPDATA) {
      log.error(`🤷 Could not find Xbox app directory at ${config.thirdpartyPath}. Press ENTER to quit.`);
      process.exit(1);
    }

    await ensureConfigFile();
    log.debug('Using config: ', userConfig);

    await processGameCovers(
      await readGameCovers(),
      async ({ parentPath, name }) => {
        await processGame(parentPath, name);
      },
      userConfig.concurrency
    );
    await rl.question(`🎮 Sucessfully patched game covers. Missing ${failures.size}. Press ENTER to quit.`);

    process.exit(0);
  } catch (err: unknown) {
    log.error(err, 'Fatal error:');
    process.exit(1);
  }
}

main();
