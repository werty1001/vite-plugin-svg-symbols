import type { Plugin } from 'vite';

export type SymbolPayload = {
  symbolId: string
  symbolBody: string
  symbolViewBox: string
  svgBody: string
  svgPath: string
  svgAttrs: Record<string, string>
}

export type SvgSymbolsPluginOptions = {
  /**
   * Sprite filename
   * @default "sprite-[hash]"
   */
  fileName?: string

  /**
   * List of SVG attributes to inherit in <symbol>
   * @default [
   *   'fill',
   *   'stroke',
   *   'stroke-dasharray',
   *   'stroke-dashoffset',
   *   'stroke-linecap',
   *   'stroke-linejoin',
   *   'stroke-miterlimit',
   *   'stroke-opacity',
   *   'stroke-width',
   * ];
   */
  shouldInheritAttrs?: string[]

  /**
   * When set to true, injects the sprite into index.html
   * @default false
   */
  shouldInjectToHtml?: boolean

  /**
   * Defines sprite attributes when injected into index.html
   * @default {
   *    'aria-hidden': 'true',
   *    style: 'position:absolute;top:0;left:0;width:1px;height:1px;visibility:hidden;opacity:0;',
   * }
   */
  injectAttrs?: Record<string, string | boolean | undefined>

  /**
   * Callback function to transform an icon body
   * @default (code) => code
   */
  transformIcon?: (iconCode: string, iconPath: string) => string | Promise<string>

  /**
   * Callback function to transform an icon id
   * @default (id) => id
   */
  transformIconId?: (iconId: string, iconPath: string) => string | Promise<string>

  /**
   * Callback function to transform the sprite symbol
   * @default (code) => code
   */
  transformSymbol?: (symbolCode: string, payload: SymbolPayload) => string | Promise<string>

  /**
   * Callback function to transform the sprite body
   * @default (body) => body
   */
  transformSprite?: (body: string) => string | Promise<string>

  /**
   * Callback function to transform import name
   * @default (name) => name
   */
  transformImportName?: (name: string, iconPath: string) => string | Promise<string>

  /**
   * Callback function to transform import comment
   * @default (comment) => comment
   */
  transformImportComment?: (comment: string, iconPath: string) => string | Promise<string>
};


/**
 * Vite plugin for creating SVG symbol sprite
 * @see [Documentation on Github](https://github.com/werty1001/vite-plugin-svg-symbols)
 *
 * @example
 * ```ts
 * // vite.config.ts
 * import { defineConfig } from 'vite';
 * import { fileURLToPath, URL } from 'node:url';
 * import useSvgSymbols from 'vite-plugin-svg-symbols';
 *
 * export default defineConfig({
 *   plugins: [
 *     useSvgSymbols(),
 *   ],
 *   resolve: {
 *     alias: {
 *       '@icons': fileURLToPath(new URL('./src/icons', import.meta.url)),
 *     },
 *   },
 * });
 * ```
 *
 * @example
 * ```ts
 * // You have src/icons/cat.svg and src/icons/dog.svg
 * // and '@icons' alias (src/icons) in vite.config.ts
 *
 * // Plain import
 * import catIcon from '@icons/cat.svg?symbol';
 *
 * // Mass import
 * import { catIcon, dogIcon } from 'svg:symbols@icons';
 * ```
 */
declare const _default: (options?: SvgSymbolsPluginOptions) => Plugin;

export const defaultInjectAttrs: {
  'aria-hidden': string
  style: string
}

export const defaultInheritAttrs: string[]

export default _default;
