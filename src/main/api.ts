import path from 'path';
import os from 'os';
import fs from 'fs';
import axios from 'axios';
import AdmZip from 'adm-zip';

export type ApplicationResponse = {
  title: string;
  description: string | null;
  latestVersion: string;
  installedVersion: string | null;
  patchNotes: { version: string; date: string; notes: string[] }[];
};

type ProductData = {
  latestVersion: string;
  minimumVersion: string;
  notes: string;
  description: string;
  patch: { [version: string]: { date: string; changes: string[] } }[];
};

type LatestVersionResponse = {
  latestVersion: { [key: string]: string };
  minimumVersion: { [key: string]: string };
  products: { [key: string]: ProductData };
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
  const { products } = resp.data;

  return Object.entries(products)
    .filter(([title]: [string, ProductData]) => {
      // TODO: For now, only allow video tools to show up here
      return title === 'Video Tools';
    })
    .map(([title, product]: [string, ProductData]) => {
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
        description: product.description,
        latestVersion: product.latestVersion.toString(),
        installedVersion,
        patchNotes: product.patch.flatMap((obj) => {
          return Object.entries(obj).map(([version, data]) => {
            return { version, date: data.date, notes: data.changes };
          });
        }),
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
      fs.rmSync(unpackedDir, { recursive: true, force: true });
    }

    zip.extractAllTo(unpackedDir, true);
  } finally {
    if (fs.existsSync(archivePath)) {
      fs.rmSync(archivePath);
    }
  }
}
