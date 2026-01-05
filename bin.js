#!/usr/bin/env node

import { argv, cwd, exit } from 'node:process';
import { join, resolve } from 'node:path';
import { resolveConfig } from 'vite';

const getMagentaText = (text) => '\x1b[35m'.concat(text, '\x1b[0m');
const getYellowText = (text) => '\x1b[33m'.concat(text, '\x1b[0m');
const getGreenText = (text) => '\x1b[32m'.concat(text, '\x1b[0m');

try {
  const root = cwd();
  const userConfigPath = argv.at(2);
  const configFile = userConfigPath ? resolve(root, userConfigPath) : join(root, 'vite.config.ts');

  const resolvedConfig = await resolveConfig({ configFile }, 'build');
  const vitePluginSvgSymbols = resolvedConfig.plugins?.find((plugin) => plugin.name === 'vite-plugin-svg-symbols');

  if (!vitePluginSvgSymbols) {
    throw new Error([
      '\n',
      `Plugin '${getMagentaText('vite-plugin-svg-symbols')}' was not found in ${getYellowText(configFile)} :(`,
      `Please add it to your plugins array or specify the config path in the vpss command, for example:`,
      getGreenText('vpss ./myvite.config.ts'),
      '',
    ].join('\n'));
  }

  await vitePluginSvgSymbols.api.generateSymbolsTypes();

  exit(0);
} catch(err) {
  console.error(err);
  exit(1);
}
