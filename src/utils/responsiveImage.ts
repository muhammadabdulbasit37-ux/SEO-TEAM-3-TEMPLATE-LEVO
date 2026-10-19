const RASTER_EXT = /\.(png|jpe?g|webp)$/i;

/** 400w covers ~330px card slots at 1x; 640w covers 2x retina. */
export const CARD_IMAGE_WIDTHS = [400, 640] as const;
export const CARD_IMAGE_SIZES = '(min-width: 1024px) 330px, (min-width: 640px) 50vw, calc(100vw - 2.5rem)';
/** 512w matches the desktop hero slider (~487px at 1x); 640/960 cover retina. */
export const HERO_IMAGE_WIDTHS = [512, 640, 960] as const;
/** Slider is desktop-only. The 1px fallback keeps phones and tablets from selecting a wide candidate. */
export const HERO_IMAGE_SIZES = '(min-width: 1024px) 490px, 1px';
export const HERO_DESKTOP_MQ = '(min-width: 1024px)';
export const DEFAULT_IMAGE_WIDTHS = [640, 960] as const;

export function stripRasterExt(src: string): string {
  return src.replace(RASTER_EXT, '');
}

export function webpSrc(src: string, width: number): string {
  return `${stripRasterExt(src)}-${width}.webp`;
}

export function responsiveSrcSet(src: string, widths: readonly number[] = DEFAULT_IMAGE_WIDTHS): string {
  return widths.map((width) => `${webpSrc(src, width)} ${width}w`).join(', ');
}

/** Smallest variant, used as img src so Lighthouse and no-srcset clients get the right size. */
export function defaultWebpSrc(src: string, widths: readonly number[]): string {
  return webpSrc(src, widths[0] ?? 640);
}
