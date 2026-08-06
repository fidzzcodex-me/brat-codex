export type BratThemeName =
  | "apple"
  | "white"
  | "black"
  | "dark"
  | "brat"
  | "lime"
  | "purple"
  | "pink"
  | "orange"
  | "sky"
  | "forest"
  | "coffee"
  | "sand"
  | "rose"
  | "custom";

export type BratEmojiProvider =
  | "apple"
  | "google"
  | "twitter"
  | "samsung"
  | "microsoft"
  | "facebook"
  | "openmoji"
  | "noto";

export type BratFontName =
  | "apple"
  | "sfpro"
  | "arial"
  | "roboto"
  | "inter"
  | "poppins"
  | "helvetica"
  | string;

export type BratTextAlign = "left" | "center" | "right" | "justify";

export interface BratThemeDefinition {
  background: string;
  card: string;
  text: string;
  shadow: string;
  radius: number;
  accent: string;
}

export interface BratBaseOptions {
  theme?: BratThemeName;
  background?: string;
  card?: string;
  text?: string;
  width?: number;
  height?: number;
  padding?: number;
  radius?: number;
  shadow?: number;
  shadowColor?: string;
  stroke?: number;
  strokeColor?: string;
  opacity?: number;
  font?: BratFontName;
  fontWeight?: number;
  minFontSize?: number;
  maxFontSize?: number;
  emoji?: BratEmojiProvider;
  align?: BratTextAlign;
  lineSpacing?: number;
}

export interface BratStickerOptions extends BratBaseOptions {
  packname?: string;
  author?: string;
  packId?: string;
  categories?: string[];
  emojiTags?: string[];
  quality?: number;
}

export type BratVideoFormat = "mp4" | "gif" | "webp";

export interface BratVideoProgress {
  current: number;
  total: number;
  stage: "frames" | "encode" | "done";
}

export interface BratVideoOptions extends BratBaseOptions {
  format?: BratVideoFormat;
  fps?: number;
  duration?: number;
  quality?: number;
  animateWords?: boolean;
  onProgress?: (progress: BratVideoProgress) => void;
  signal?: AbortSignal;
}

export interface BratVideoStickerOptions extends BratVideoOptions {
  packname?: string;
  author?: string;
}

export function brat(text: string, options?: BratBaseOptions): Promise<Buffer>;
export function bratSticker(text: string, options?: BratStickerOptions): Promise<Buffer>;
export function bratVideo(text: string, options?: BratVideoOptions): Promise<Buffer>;
export function bratVideoSticker(text: string, options?: BratVideoStickerOptions): Promise<Buffer>;

export const themes: Record<string, BratThemeDefinition>;
export const fonts: string[];
export const emojis: string[];

declare const _default: {
  brat: typeof brat;
  bratSticker: typeof bratSticker;
  bratVideo: typeof bratVideo;
  bratVideoSticker: typeof bratVideoSticker;
  themes: typeof themes;
  fonts: typeof fonts;
  emojis: typeof emojis;
};

export default _default;
