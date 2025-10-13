import { mkdirSync, readFileSync } from 'fs';
import { execSync } from 'child_process';

let failed = false;
let blob = null;

// Ensure the dist directory exists
mkdirSync('dist', { recursive: true });

try {
  const target = 'dist/xbox-app-sgdb.exe';
  const data = readFileSync('sea-config.json', { encoding: 'utf-8', flag: 'r' });
  blob = JSON.parse(data).output;

  // Generate the blob to be injected
  execSync('node --experimental-sea-config sea-config.json', { stdio: 'inherit' });

  // Create a copy of the current Node.js executable
  execSync(`node -e \"require('fs').copyFileSync(process.execPath, '${target}')\"`, { stdio: 'inherit' });

  // Inject the blob into the copied executable
  execSync(
    `npx postject ${target} NODE_SEA_BLOB ${blob} --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2 --overwrite`,
    { stdio: 'inherit' }
  );
} catch (error) {
  console.error('An error occurred during the build process:', error);
  failed = true;
}

process.exitCode = Number(failed);
