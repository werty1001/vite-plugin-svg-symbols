import { join, resolve, relative, dirname, isAbsolute } from 'node:path';
import { writeFile } from 'node:fs/promises';

import useReader from './reader';
import useConfig from './config';

import {
  VIRTUAL_PREFIX,
  VIRTUAL_SYMBOL,
  VIRTUAL_SYMBOLS,
  SYMBOL_EXTNAME,
  SYMBOL_PREFIX,
  SPRITE_STUB,
  INJECT_ATTRS,
  ICON_COMMENT,
  PLUGIN_COMMENT,
  MODULE_DECLARATION,
  SYMBOL_MODULE_DECLARATION,
  INHERIT_SVG_ATTRS,
 } from './constants';

import {
  generateHash,
  getUsedIds,
  replaceStub,
  normalizeExtname,
  generateSymbolId,
  createSymbol,
  getSymbolId,
  wrapSpriteBody,
  generateImportName,
} from './utils';

import type { Plugin } from 'vite';
import type { SvgSymbolsPluginOptions } from '../index.d';

export const defaultInjectAttrs = INJECT_ATTRS;
export const defaultInheritAttrs = INHERIT_SVG_ATTRS;

export default (options?: SvgSymbolsPluginOptions): Plugin<{
  generateSymbolsTypes: () => Promise<void>
}> => {
  const {
    fileName = 'sprite-[hash]',
    shouldInheritAttrs = defaultInheritAttrs,
    shouldInjectToHtml = false,
    injectAttrs = defaultInjectAttrs,
    transformIcon = (code: string) => code,
    transformIconId = (id: string) => id,
    transformSymbol = (code: string) => code,
    transformSprite = (body: string) => body,
    transformImportName = (name: string) => name,
    transformImportComment = (comment: string) => comment,
  } = options || {};


  // Config

  const { config, updateConfig, findAliasName } = useConfig();


  // Reader

  const { getDirContent, getFileContent } = useReader(['.svg'], transformIcon);


  // Sprite

  const sprite = new Map<string, string>();

  const getSpriteHref = async (filePath: string) => {
    const version = config.isDevMode ? `?v=${Date.now()}` : '';
    const id = await transformIconId(
      generateSymbolId(filePath, config.root),
      filePath
    );
    return [SPRITE_STUB.concat(version), id].join('#');
  };

  const addFileToSprite = async (filePath: string) => {
    const [code, href] = await Promise.all([
      getFileContent(filePath),
      getSpriteHref(filePath),
    ]);
    const [body, payload] = createSymbol(code, filePath, getSymbolId(href), shouldInheritAttrs);
    const transformed = await transformSymbol(body, payload);
    sprite.set(filePath, transformed);
    return href;
  };

  const generateSpriteBody = async (usedIds?: Set<string>) => {
    const keys = Array.from(sprite.keys()).sort((a, b) => {
      const one = relative(config.root, a);
      const two = relative(config.root, b);
      return one > two ? 1 : -1;
    });
    let content = '';
    for (const key of keys) {
      const code = sprite.get(key) || '';
      if (!usedIds) {
        content += code;
        continue;
      }
      const id = await getSpriteHref(key);
      if (usedIds.has(id)) {
        content += code;
      }
    }
    return transformSprite(content);
  };


  // Module

  const modules = new Map<string, [string, string, string][]>();

  const createModule = async (alias: string) => {
    const aliasPath = config.aliases[`@${alias}`] || '';

    if (!aliasPath) {
      throw new Error([
        `The alias @${alias} is not defined.`,
        'Please add it to your vite.config.ts',
      ].join(' '));
    }

    const icons = await getDirContent(aliasPath);
    const types: [string, string, string][] = [];
    const namesMap = new Map<string, number>();

    let code = '';
    let ids = '';

    for (const src of icons) {
      const [generatedName, href] = await Promise.all([
        transformImportName(generateImportName(aliasPath, src), src),
        addFileToSprite(src),
      ]);

      const nameCount = namesMap.get(generatedName) || 0;
      const name = generatedName.concat(nameCount > 0 ? String(nameCount + 1) : '');

      code += `export const ${name} = '${href}';\n`;
      ids += `${name}, `;

      types.push([src, name, href]);
      namesMap.set(generatedName, nameCount + 1);
    }

    modules.set(alias, types);

    return code.concat(`export default { ${ids}};`);
  };

  const updateTypes = async () => {
    let content = '';

    for (const [alias, items] of modules.entries()) {
      let moduleContent = '';

      for (const [src, name, href] of items) {
        const relativePath = relative(config.root, src);
        const comment = ICON_COMMENT
          .replace('[see]', `[${relativePath}](file://${src})`);
        const importComment = await transformImportComment(comment, src);
        const importDeclaration = `export const ${name}: '#${getSymbolId(href)}'`;
        moduleContent += [importComment, importDeclaration, '\n'].join('\n');
      }

      const declaration = MODULE_DECLARATION
        .replace('[alias]', alias)
        .replace('[content]', moduleContent);

      content += [PLUGIN_COMMENT, declaration, '\n'].join('\n');
    }

    content += [
      [PLUGIN_COMMENT, SYMBOL_MODULE_DECLARATION].join('\n'),
    ].join('\n\n');

    const typePath = config.isTestMode
      ? join(config.root, 'app', 'client.d.ts')
      : join(config.root, 'node_modules', 'vite-plugin-svg-symbols', 'client.d.ts');

    return writeFile(typePath, content);
  };


  // Plugin

  let timeout: ReturnType<typeof setTimeout>;
  let spriteBody = '';

  return {
    name: 'vite-plugin-svg-symbols',
    enforce: 'pre',

    closeWatcher() {
      clearTimeout(timeout);
    },

    configResolved(resolvedConfig) {
      updateConfig(resolvedConfig);
    },

    configureServer({ watcher, middlewares, ws, moduleGraph }) {
      const updatedAliases = new Set<string>();

      const updateModules = () => {
        for (const aliasName of updatedAliases) {
          const moduleId = VIRTUAL_SYMBOLS.concat('@', aliasName);
          const aliasModule = moduleGraph.getModuleById(moduleId);
          if (aliasModule) {
            moduleGraph.invalidateModule(aliasModule);
          }
        }
        updatedAliases.clear();
        ws.send({
          type: 'full-reload',
          path: '*',
        });
      };

      const setUpdateTimeout = () => {
        clearTimeout(timeout);
        timeout = setTimeout(updateModules, 50);
      };

      watcher.on('all', (_, filePath) => {
        if (!filePath.endsWith('.svg')) return;
        const aliasName = findAliasName(filePath);
        if (aliasName) {
          updatedAliases.add(aliasName);
          setUpdateTimeout();
        }
      });

      middlewares.use(SPRITE_STUB, async (request, response) => {
        const body = await generateSpriteBody();
        const sprite = wrapSpriteBody(body);
        const hash = generateHash(sprite, 32);
        const requestHash = request.headers['if-none-match'];
        if (hash === requestHash) {
          response.writeHead(304, { 'Content-Length': 0 }).end('');
          return;
        }
        response.writeHead(200, {
          'Content-Length': Buffer.byteLength(sprite),
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'no-cache',
          'Etag': hash,
        }).end(sprite);
      });
    },

    resolveId(id, importer = '') {
      if (id.endsWith(SYMBOL_EXTNAME)) {
        const src = isAbsolute(id) ? id : resolve(dirname(importer), id);
        return VIRTUAL_SYMBOL.concat(src.replace(SYMBOL_EXTNAME, '.svg'));
      }
      if (id.startsWith(SYMBOL_PREFIX)) {
        return VIRTUAL_PREFIX.concat(id);
      }
      return null;
    },

    async load(id) {
      if (id.startsWith(VIRTUAL_SYMBOL)) {
        const src = id.replace(VIRTUAL_SYMBOL, '');
        const href = await addFileToSprite(src);
        return `export default '${href}';`;
      }
      if (id.startsWith(VIRTUAL_SYMBOLS)) {
        const [, alias = 'icons'] = id.split('@');
        const code = await createModule(alias);
        await updateTypes();
        return code;
      }
      return null;
    },

    transformIndexHtml() {
      if (config.isDevMode || !shouldInjectToHtml) return;
      return [{
        tag: 'svg',
        attrs: injectAttrs,
        children: spriteBody,
        injectTo: 'body-prepend',
      }];
    },

    async generateBundle(_, bundle) {
      if (config.isDevMode) return;

      const usedIds = getUsedIds(bundle, SPRITE_STUB);
      const body = await generateSpriteBody(usedIds);
      const sprite = wrapSpriteBody(body);

      const hash = generateHash(sprite);
      const name = normalizeExtname(fileName.replace('[hash]', hash));

      const href = shouldInjectToHtml ? '' : join(config.base, config.assets, name);
      const regex = new RegExp(SPRITE_STUB, 'g');

      replaceStub(bundle, regex, href);

      if (shouldInjectToHtml) {
        spriteBody = body;
      } else {
        this.emitFile({
          type: 'asset',
          fileName: join(config.assets, name),
          source: sprite,
        });
      }
    },

    api: {
      async generateSymbolsTypes() {
        const modulesNames = Object.keys(config.aliases).map((name) => name.replace('@', '')).filter(Boolean);
        await Promise.all(modulesNames.map(createModule));
        return updateTypes();
      },
    },
  };
};
