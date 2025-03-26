
import { join } from 'node:path';
import type { ResolvedConfig } from 'vite';

export default () => {
  const config = {
    isDevMode: false,
    isTestMode: false,
    root: '',
    base: '',
    assets: '',
    aliases: {} as Record<string, string>,
  };

  const parseAliases = (aliases: ResolvedConfig['resolve']['alias']) =>
    aliases.reduce((acc, el) => {
      if (typeof el.find === 'string') {
        acc[el.find] = el.replacement;
      }
      return acc;
    }, {} as typeof config.aliases);

  const updateConfig = (viteConfig: ResolvedConfig) => {
    config.isDevMode = viteConfig.command === 'serve';
    config.isTestMode = viteConfig.mode === 'plugintest';
    config.root = viteConfig.root;
    config.base = viteConfig.base;
    config.assets = viteConfig.build.assetsDir;
    config.aliases = {
      '@icons': join(config.root, 'src', 'icons'),
      ...parseAliases(viteConfig.resolve.alias),
    };
  };

  const findAliasName = (filePath: string) => {
    const [findedAlias = []] = Object.entries(config.aliases)
      .filter(([_, val]) => filePath.startsWith(val))
      .sort(([, one], [, two]) => two.length - one.length);
    const [alias = ''] = findedAlias;
    return alias.replace('@', '');
  };

  return {
    config,
    updateConfig,
    findAliasName,
  };
};
