import path from 'path';
import os from 'os';
import fs from 'fs';
import axios from 'axios';
import AdmZip from 'adm-zip';

const descriptions: { [key: string]: string } = {
  'Video Tools':
    'The ULTIMATE extension for language learning through video websites, providing powerful tools to help you learn through immersive video experiences.',
  MasterLingQ:
    'The ULTIMATE extension for enhancing the experience on LingQ.com, the language learning giant. Make the most of your LingQ learning with added features and improvements.',
};

export type ApplicationResponse = {
  title: string;
  description: string | null;
  latestVersion: string;
  installedVersion: string | null;
};

type LatestVersionResponse = {
  latestVersion: { [key: string]: string };
  minimumVersion: { [key: string]: string };
  notes: { [key: string]: string };
};

/**
 * Returns the root directory the user has chosen to store their
 * rooster/language master data
 */
export async function getDownloadPath(): Promise<string | null> {
  const Store = (await import('electron-store')).default;
  const store = new Store();

  const downloadPath = store.get('download-path') ?? null;

  if (downloadPath && !fs.existsSync(downloadPath as string)) {
    return null;
  }

  return downloadPath as string;
}

/**
 * Query available tools and whether they are installed or not
 */
export async function getApplications(): Promise<ApplicationResponse[]> {
  const resp = await axios.get<LatestVersionResponse>(
    'https://languagemaster.io/api/latest-version',
  );

  const downloadPath = await getDownloadPath();
  const { latestVersion } = resp.data;

  return Object.entries(latestVersion)
    .filter(([title]: [string, string]) => {
      // TODO: For now, only allow video tools to show up here
      return title === 'Video Tools';
    })
    .map(([title, version]: [string, string]) => {
      let installedVersion = null;

      if (downloadPath) {
        const manifestFile = path.join(downloadPath, title, 'manifest.json');
        if (fs.existsSync(manifestFile)) {
          try {
            const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
            installedVersion = manifest.version.toString();
          } catch (e) {
            // If this fails to load it's either missing or corrupt, so we assume
            // it's missing.
          }
        }
      }

      return {
        title,
        description: descriptions[title] ?? null,
        latestVersion: version.toString(),
        installedVersion,
      };
    });
}

/**
 * Generic method for downloading from a URL to a zip.
 */
async function downloadFileToPath({
  url,
  archivePath,
  onProgress = () => {},
}: {
  url: string;
  archivePath: string;
  onProgress: Function;
}): Promise<void> {
  const writer = fs.createWriteStream(archivePath, { flags: 'w' });

  const resp = await axios.get(url, {
    responseType: 'stream',
    onDownloadProgress(e) {
      onProgress((e?.progress ?? 0) * 100);
    },
  });

  resp.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

export async function downloadTools(
  appName: string,
  version: string,
  onProgress: Function = () => {},
) {
  const downloadPath = await getDownloadPath();

  if (!downloadPath) {
    throw new Error('No download path');
  }

  const tmpDir = os.tmpdir();
  const archivePath = path.join(tmpDir, `${appName}-${version}.zip`);
  const unpackedDir = path.join(downloadPath, appName);
  const url = 'https://languagemaster.io/api/download-rvt';

  try {
    await downloadFileToPath({ url, archivePath, onProgress });

    const zip = new AdmZip(archivePath);

    if (fs.existsSync(unpackedDir)) {
      fs.rmSync(unpackedDir);
    }

    zip.extractAllTo(unpackedDir, true);
  } finally {
    if (fs.existsSync(archivePath)) {
      fs.rmSync(archivePath);
    }
  }
}
