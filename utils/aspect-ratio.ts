import { DEFAULT_IMAGE_HEIGHT, DEFAULT_IMAGE_WIDTH } from "~/constants";

export const ASPECT_RATIO_LANDSCAPE = "landscape";
export const ASPECT_RATIO_PORTRAIT = "portrait";
export const ASPECT_RATIO_SQUARE = "square";

export function getAspectRatio(width: number, height: number): string {
  const ratio = width / height;
  if (ratio > 1) return ASPECT_RATIO_LANDSCAPE;
  if (ratio < 1) return ASPECT_RATIO_PORTRAIT;
  return ASPECT_RATIO_SQUARE;
}

export function setImageDimensions(aspectRatio: string): {
  width: number;
  height: number;
} {
  switch (aspectRatio) {
    case ASPECT_RATIO_LANDSCAPE:
      return { width: DEFAULT_IMAGE_HEIGHT, height: DEFAULT_IMAGE_WIDTH };
      break;
    case ASPECT_RATIO_PORTRAIT:
      return { width: DEFAULT_IMAGE_WIDTH, height: DEFAULT_IMAGE_HEIGHT };
      break;

    default:
      return { width: DEFAULT_IMAGE_WIDTH, height: DEFAULT_IMAGE_WIDTH };
      break;
  }
}
