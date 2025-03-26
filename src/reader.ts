import { stat, readdir, readFile } from 'node:fs/promises';
import { join, extname } from 'node:path';

export default (
  extnames: string[] = [],
  transformFile?: (fileBody: string, filePath: string) => string | Promise<string>
) => {
  const store = new Map<string, [number, string[]]>();

  const getFileContent = async (src: string) => {
    const stats = await stat(src);

    if (store.has(src)) {
      const [storeTime, storeFiles] = store.get(src) || [0, []];
      if (storeTime === stats.mtimeMs) {
        const [firstFile] = storeFiles;
        return firstFile;
      }
    }

    const content = await readFile(src, { encoding: 'utf8' });
    const transformed = await (typeof transformFile === 'function'
      ? transformFile(content, src)
      : Promise.resolve(content)
    );

    store.set(src, [stats.mtimeMs, [transformed]]);

    return transformed;
  };

  const getDirContent = async (src: string) => {
    const stats = await stat(src);

    if (store.has(src)) {
      const [storeTime, storeFiles] = store.get(src) || [0, []];
      if (storeTime === stats.mtimeMs) {
        return storeFiles;
      }
    }

    const files: string[] = [];
    const items = await readdir(src, { withFileTypes: true });

    for (const item of items) {
      if (item.isDirectory()) {
        const subfiles = await getDirContent(join(src, item.name));
        files.push(...subfiles);
      }
      if (extnames.length === 0 || extnames.includes(extname(item.name))) {
        files.push(join(src, item.name));
      }
    }

    store.set(src, [stats.mtimeMs, files]);

    return files;
  };

  return {
    store,
    getDirContent,
    getFileContent,
  };
};
