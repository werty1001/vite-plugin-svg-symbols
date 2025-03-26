
export const VIRTUAL_PREFIX = '\0virtual:';
export const VIRTUAL_SYMBOL = '\0virtual:symbol:';
export const VIRTUAL_SYMBOLS = '\0virtual:svg:symbols';

export const SYMBOL_EXTNAME = '.svg?symbol';
export const SYMBOL_PREFIX = 'svg:symbols@';
export const SPRITE_STUB = '/@id/__vite-plugin-svg-symbols__.svg';

export const INJECT_ATTRS = {
  'aria-hidden': 'true',
  style: [
    'position:absolute;',
    'top:0;',
    'left:0;',
    'width:1px;',
    'height:1px;',
    'visibility:hidden;',
    'opacity:0;',
  ].join(''),
};

export const INHERIT_SVG_ATTRS = [
  'fill',
  'stroke',
  'stroke-dasharray',
  'stroke-dashoffset',
  'stroke-linecap',
  'stroke-linejoin',
  'stroke-miterlimit',
  'stroke-opacity',
  'stroke-width',
];

export const MODULE_DECLARATION = `declare module 'svg:symbols@[alias]' {
[content]
  const symbols: Record<string, string>;
  export default symbols;
}`;

export const ICON_COMMENT = `/**
 * @see [see]
 */`;

export const PLUGIN_COMMENT = `/**
 * Vite plugin for creating SVG symbol sprite
 * @see [Documentation on Github](https://github.com/werty1001/vite-plugin-svg-symbols)
 */`;

export const SYMBOL_MODULE_DECLARATION = `declare module '*.svg?symbol' {
  const src: string
  export default src
}`;

