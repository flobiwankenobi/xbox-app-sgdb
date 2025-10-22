import fs from 'node:fs';
import { log } from './helper/log';

interface UserConfig {
  apiKey: string;
  dimensions: `${string}x${string}`[];
  concurrency: number;
  force: boolean;
  logLevel: 'info' | 'debug' | 'error' | 'warn';
  mapIds: Record<string, string>;
  dryRun?: boolean;
}

export const config = Object.freeze({
  path: './xbox-sgdb.config',
  thirdpartyPath: `${process.env.LOCALAPPDATA}/Packages/Microsoft.GamingApp_8wekyb3d8bbwe/LocalState/ThirdPartyLibraries`,
});

export const userConfig: UserConfig = {
  apiKey: '',
  dimensions: ['512x512', '1024x1024'],
  concurrency: Number(process.env.CONCURRENCY) || 5,
  force: false,
  logLevel: 'info',
  mapIds: {
    '1317860': '780310',
    '3601140': '2486820',
  },
};

if (fs.existsSync(config.path)) {
  try {
    const configFile = JSON.parse(fs.readFileSync(config.path, 'utf-8')) as Partial<UserConfig>;
    Object.assign(userConfig, configFile);
  } catch (err: unknown) {
    log.error(`Failed to parse configuration file at ${config.path}: ${(err as Error).message}`);
    process.exit(1);
  }
}
