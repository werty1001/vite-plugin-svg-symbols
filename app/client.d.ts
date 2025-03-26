
declare module 'svg:symbols@icons' {
  const symbols: Record<string, string>;
  export default symbols;
}

declare module '*.svg?symbol' {
  const src: string
  export default src
}
