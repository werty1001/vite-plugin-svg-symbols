# vite-plugin-svg-symbols
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square&color=0071e3&labelColor=1d1d1f)](https://raw.githubusercontent.com/werty1001/vite-plugin-svg-symbols/main/LICENSE) [![](https://img.shields.io/npm/v/vite-plugin-svg-symbols?style=flat-square&color=0071e3&labelColor=1d1d1f)](https://www.npmjs.com/package/vite-plugin-svg-symbols) [![](https://img.shields.io/npm/dm/vite-plugin-svg-symbols?style=flat-square&color=0071e3&labelColor=1d1d1f)](https://www.npmjs.com/package/vite-plugin-svg-symbols) ![](https://img.shields.io/github/stars/werty1001/vite-plugin-svg-symbols?style=flat-square&color=0071e3&labelColor=1d1d1f)

> Vite plugin for creating SVG symbol sprite 🧞‍♂️

### Features
* Create a single sprite from SVG files
* Use a sprite as a static file for JS bundle optimization
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

#### Single import
```js
import icon from '@icons/dog.svg?symbol'; // import icon as symbol href
```

#### Mass import
```js
import icons from 'symbols:dog,cat'; // import two icons as symbol hrefs
// { dog: '...', cat: '...' }
```
By default, icons are loaded from the **@icons** alias:
```js
'symbols:dog,cat' = 'symbols@icons:dog,cat'
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
import icon from '@lucide/banana.svg?symbol';
```
```js
import icons from 'symbols@lucide:apple,banana';
// { apple: '...', banana: '...' }
```

#### All import
```js
import icons from 'symbols:*'; // import all svg from the @icons alias
// { dog: '...', cat: '...', and another }
```
> ⚠️ Use a wildcard import only if you have few icons; otherwise, import them individually by name

<p align="center">
  <a href="#vite-plugin-svg-symbols"><img align="center" src="https://werty1001.github.io/sep.svg" alt=""></a>
</p>

## Examples
When you have `src/icons/cat.svg` and `src/icons/dog.svg` and **@icons** alias in `vite.config.ts`
> [Vue](#vue) / [React](#react) / [Svelte](#svelte)

### Vue
Single import:
```vue
<script setup lang="ts">
import dogSymbol from '@icons/dog.svg?symbol';
</script>

<template>
  <svg aria-hidden="true">
    <use :href="dogSymbol" /> // use dogSymbol from script
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
import icons from 'symbols:dog,cat'; // import two icons from @icons
</script>

<template>
  <svg aria-hidden="true">
    <use :href="icons.dog" />
  </svg>

  <svg aria-hidden="true">
    <use :href="icons.cat" />
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
import icons from 'symbols:dog,cat'; // import two icons from @icons
import BaseIcon from '@/components/BaseIcon.vue';
</script>

<template>
  <BaseIcon :src="icons.dog" />
  <BaseIcon :src="icons.cat" />
</template>
```

### React
```
soon
```

### Svelte
```
soon
```

<p align="center">
  <a href="#navigation"><img align="center" src="https://werty1001.github.io/sep.svg" alt=""></a>
</p>

## Options
