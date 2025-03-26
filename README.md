# vite-plugin-svg-symbols
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square&color=0071e3&labelColor=1d1d1f)](https://raw.githubusercontent.com/werty1001/vite-plugin-svg-symbols/main/LICENSE) [![](https://img.shields.io/npm/v/vite-plugin-svg-symbols?style=flat-square&color=0071e3&labelColor=1d1d1f)](https://www.npmjs.com/package/vite-plugin-svg-symbols) [![](https://img.shields.io/npm/dm/vite-plugin-svg-symbols?style=flat-square&color=0071e3&labelColor=1d1d1f)](https://www.npmjs.com/package/vite-plugin-svg-symbols) ![](https://img.shields.io/github/stars/werty1001/vite-plugin-svg-symbols?style=flat-square&color=0071e3&labelColor=1d1d1f)

> Vite plugin for creating SVG symbol sprite 🧞‍♂️

### Features
* Create a single sprite from SVG files
* Use a sprite as a static file for JS bundle optimization
* The production build includes only the icons that are actually used
* Support mass import or by one
* Compatible with modern frameworks: [Vue](#vue) / [React](#react) / [Svelte](#svelte)

### Navigation
* [Getting Started](#getting-started)
* [Usage](#usage)
* [Examples](#examples)
* [Options](#options)

<p align="center">
  <a href="#vite-plugin-svg-symbols"><img align="center" src="https://werty1001.github.io/sep.svg" alt=""></a>
</p>

## Getting Started
**1.** Install using npm:
```bash
npm i vite-plugin-svg-symbols -D
```
**2.** Add to your `vite.config.ts`:
```js
import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';
import useSvgSymbols from 'vite-plugin-svg-symbols';

export default defineConfig({
  plugins: [
    useSvgSymbols(), // add plugin
  ],
  resolve: {
    // Using aliases makes imports prettier
    alias: {
      '@icons': fileURLToPath(new URL('./src/icons', import.meta.url)),
    },
  },
});
```
**3.** Add to your `env.d.ts`:
```html
/// <reference types="vite-plugin-svg-symbols/client" />
```

<p align="center">
  <a href="#vite-plugin-svg-symbols"><img align="center" src="https://werty1001.github.io/sep.svg" alt=""></a>
</p>

## Usage
For example, you have `src/icons/cat.svg` and `src/icons/dog.svg` and **@icons** alias in `vite.config.ts`

#### Plain import
```js
import dogIcon from '@icons/dog.svg?symbol'; // import icon as symbol href
```

#### Mass import
```js
import { dogIcon, catIcon } from 'svg:symbols@icons'; // import two icons as symbol hrefs
```

#### Icon packages
You can add alias for library, for example **@lucide** ([lucide](https://www.npmjs.com/package/lucide-static)):
```js
// vite.config.ts
alias: {
  '@lucide': fileURLToPath(new URL('./node_modules/lucide-static/icons/', import.meta.url)),
},
```
Then import icons from **lucide** package:
```js
import bananaIcon from '@lucide/banana.svg?symbol';
```
```js
import { appleIcon, bananaIcon } from 'svg:symbols@lucide';
```

#### Import names
By default, icon names are defined in camel case with the `Icon` suffix:
```js
banana.svg → bananaIcon
a-arrow-up.svg → aArrowUpIcon
arrow-down-a-z.svg → arrowDownAZIcon
arrow-down-1-0.svg → arrowDown10Icon

// subdir
home/foo.svg → homeFooIcon
```

<p align="center">
  <a href="#vite-plugin-svg-symbols"><img align="center" src="https://werty1001.github.io/sep.svg" alt=""></a>
</p>

## Examples
When you have `src/icons/cat.svg` and `src/icons/dog.svg` and **@icons** alias in `vite.config.ts`
> [Vue](#vue) / [React](#react) / [Svelte](#svelte)

### Vue
Plain import:
```vue
<script setup lang="ts">
import dogIcon from '@icons/dog.svg?symbol';
</script>

<template>
  <svg aria-hidden="true">
    <use :href="dogIcon" /> // use dogIcon from script
  </svg>

  <svg aria-hidden="true">
    <use href="@icons/cat.svg?symbol" /> // or import icon directly
  </svg>

  <!-- Don't do this -->
  <svg aria-hidden="true">
    <use :href="'@icons/cat.svg?symbol'" /> // ⚠️ dynamic path not working
  </svg>
  <!-- :( -->

</template>
```
Mass import:
```vue
<script setup lang="ts">
import { dogIcon, catIcon } from 'svg:symbols@icons'; // import two icons
</script>

<template>
  <svg aria-hidden="true">
    <use :href="dogIcon" />
  </svg>

  <svg aria-hidden="true">
    <use :href="catIcon" />
  </svg>
</template>
```
You can create a very simple component **BaseIcon.vue**:
```vue
<script setup lang="ts">
defineProps<{ src: string }>()
</script>

<template>
  <svg aria-hidden="true">
    <use :href="src" />
  </svg>
</template>
```
```vue
<script setup lang="ts">
import { dogIcon, catIcon } from 'svg:symbols@icons';
import BaseIcon from '@/components/BaseIcon.vue';
</script>

<template>
  <BaseIcon :src="dogIcon" />
  <BaseIcon :src="catIcon" />
</template>
```

<p align="center">
  <a href="#vite-plugin-svg-symbols"><img align="center" src="https://werty1001.github.io/sep.svg" alt=""></a>
</p>

### React
Plain import:
```tsx
import dogIcon from '@icons/dog.svg?symbol';

function App() {
  return (
    <>
      <svg aria-hidden="true">
        <use href={dogIcon} />
      </svg>
    </>
  )
}

export default App
```
Mass import:
```tsx
import { dogIcon, catIcon } from 'svg:symbols@icons'; // import two icons

function App() {
  return (
    <>
      <svg aria-hidden="true">
        <use href={dogIcon} />
      </svg>

      <svg aria-hidden="true">
        <use href={catIcon} />
      </svg>      
    </>
  )
}

export default App
```
You can create a very simple component **BaseIcon.tsx**:
```tsx
function BaseIcon({ src = '' }) {
  return (
    <svg aria-hidden="true">
      <use href={src} />
    </svg>
  )
}
export default BaseIcon
```
```tsx
import { dogIcon, catIcon } from 'svg:symbols@icons'; // import two icons
import BaseIcon from './BaseIcon'

function App() {
  return (
    <>      
      <BaseIcon src={dogIcon} />
      <BaseIcon src={catIcon} />
    </>
  )
}

export default App
```

<p align="center">
  <a href="#vite-plugin-svg-symbols"><img align="center" src="https://werty1001.github.io/sep.svg" alt=""></a>
</p>

### Svelte
Plain import:
```svelte
<script lang="ts">
import dogIcon from '@icons/dog.svg?symbol';
</script>

<main>
  <svg aria-hidden="true">
    <use href={dogIcon} />
  </svg>
</main>
```
Mass import:
```svelte
<script lang="ts">
import { dogIcon, catIcon } from 'svg:symbols@icons'; // import two icons
</script>

<main>
  <svg aria-hidden="true">
    <use href={dogIcon} />
  </svg>

  <svg aria-hidden="true">
    <use href={catIcon} />
  </svg>
</main>
```
You can create a very simple component **BaseIcon.svelte**:
```svelte
<script lang="ts">
  export let src = '';
</script>

<svg aria-hidden="true">
  <use href={src} />
</svg>
```
```svelte
<script lang="ts">
import { dogIcon, catIcon } from 'svg:symbols@icons';
import BaseIcon from './BaseIcon.svelte';
</script>

<main>
  <BaseIcon src={dogIcon} />
  <BaseIcon src={catIcon} />
</main>
```

<p align="center">
  <a href="#vite-plugin-svg-symbols"><img align="center" src="https://werty1001.github.io/sep.svg" alt=""></a>
</p>

## Options
* Inject: [shouldInjectToHtml](#shouldinjecttohtml) | [injectAttrs](#injectattrs)
* Transform: [Icon](#transformicon) | [IconId](#transformiconid) | [Sprite](#transformsprite) | [Symbol](#transformsymbol) | [ImportName](#transformimportname) | [ImportComment](#transformimportcomment)
```ts
type SymbolPayload = {
  symbolId: string
  symbolBody: string
  symbolViewBox: string
  svgBody: string
  svgPath: string
  svgAttrs: Record<string, string>
}

type SvgSymbolsPluginOptions = {
  fileName?: string
  shouldInjectToHtml?: boolean
  injectAttrs?: Record<string, string | boolean | undefined>
  transformIcon?: (iconCode: string, iconPath: string) => string | Promise<string>
  transformIconId?: (iconId: string, iconPath: string) => string | Promise<string>
  transformSprite?: (body: string) => string | Promise<string>
  transformSymbol?: (symbolCode: string, payload: SymbolPayload) => string | Promise<string>
  transformImportName?: (name: string, iconPath: string) => string | Promise<string>
  transformImportComment?: (comment: string, iconPath: string) => string | Promise<string>
}
```
#### fileName
```js
{
  fileName: 'my-sprite-name-[hash]', // default 'sprite-[hash]'
}
```

#### shouldInheritAttrs
```js
{
  shouldInheritAttrs: [], // List of SVG attributes to inherit in <symbol>
}
// default: [
//   'fill',
//   'stroke',
//   'stroke-dasharray',
//   'stroke-dashoffset',
//   'stroke-linecap',
//   'stroke-linejoin',
//   'stroke-miterlimit',
//   'stroke-opacity',
//   'stroke-width',
// ];
```
```html
<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
  <circle cx="8" cy="8" r="8"></circle>
</svg>

<!-- Become -->
<symbol viewBox="0 0 16 16" id="some-id">
  <g fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="8" cy="8" r="8"></circle>
  </g>
</symbol>
```

#### shouldInjectToHtml
```js
{
  shouldInjectToHtml: true, // When set to true, injects the sprite into index.html
}
```

#### injectAttrs
```js
{
  injectAttrs: { ... }, // Defines sprite attributes when injected into index.html
}
// default:
// {
//  'aria-hidden': 'true',
//   style: 'position:absolute;top:0;left:0;width:1px;height:1px;visibility:hidden;opacity:0;',
// }
```

#### transformIcon
```js
// Callback function to transform an icon body, for example, to optimize it with svgo:

const { optimize } = require('svgo');
const svgoOptions = {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeComments: true,
        },
      },
    },
  ],
};
```
```js
{
  transformIcon: (iconCode, iconPath) => {
    const optimizationResult = optimize(iconCode, svgoOptions);
    return optimizationResult.data;
  },
}
```

#### transformIconId
```js
// Callback function to transform an icon id, for example, when you have:
// src/icons/cat.svg
{
  transformIconId: (iconId, iconPath) => {
    console.log(iconId); // 'icons-cat'
    console.log(iconPath); // '/Users/werty1001/Desktop/app/src/icons/cat.svg'
    return iconId;
  },
}
```

#### transformSprite
```js
// Callback function to transform the sprite body, for example, to prepend <defs>:
{
  transformSprite: (body) => {
    return '<defs>...</defs>'.concat(body);
  },
}
```

#### transformSymbol
```js
// Callback function to transform the sprite symbol, for example, when you have:
// src/icons/cat.svg
{
  transformSymbol: (symbolCode, payload) => {
    console.log(symbolCode); // '<symbol ...'
    console.log(payload);
    // {
    //   symbolId: 'icons-cat',
    //   symbolBody: '<path ...',
    //   symbolViewBox: '0 0 24 24',
    //   svgBody: '<path ...',
    //   svgPath: '/Users/werty1001/Desktop/app/src/icons/cat.svg',
    //   svgAttrs: { viewBox: '0 0 24 24', ... }
    // }
    return symbolCode;
  },
}
```

#### transformImportName
```js
// Callback function to transform import name, for example, when you have:
// src/icons/cat.svg
{
  transformImportName: (name, iconPath) => {
    console.log(name); // 'catIcon'
    console.log(iconPath); // '/Users/werty1001/Desktop/app/src/icons/cat.svg'
    return name;
  },
}
// import { catIcon } from 'svg:symbols@icons';
```

#### transformImportComment
```js
// Callback function to transform import comment,
// for example, when you have lucide package:

import { basename } from 'path';

const lucideComment = `/**
 * Lucide
 * @see https://lucide.dev/icons/[name]
 */`;
```
```js
{
  // Replace the default comment to enable IDEs to show
  // tooltips with a link to the icon at https://lucide.dev

  transformImportComment: (comment, iconPath) => {
    if (iconPath.includes('lucide-static')) {
      return lucideComment.replace('[name]', basename(iconPath, '.svg'));
    }
    return comment;
  },
}
```

<p align="center">
  <a href="#vite-plugin-svg-symbols"><img align="center" src="https://werty1001.github.io/sep.svg" alt=""></a>
</p>
