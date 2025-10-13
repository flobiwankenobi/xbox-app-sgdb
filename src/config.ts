import fs from 'node:fs';

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

export const userConfig = fs.existsSync(config.path)
  ? (JSON.parse(fs.readFileSync(config.path, 'utf-8')) as UserConfig)
  : ({
      apiKey: '',
      dimensions: ['512x512', '1024x1024'],
      concurrency: Number(process.env.CONCURRENCY) || 5,
      force: false,
      logLevel: 'info',
      mapIds: {
        '1317860': '387380',
      },
    } as UserConfig);
