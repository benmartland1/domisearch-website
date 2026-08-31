import createImageUrlBuilder from "@sanity/image-url";
import type { Image } from "sanity";
import { dataset, projectId } from "../env";

const builder = createImageUrlBuilder({ projectId, dataset });

export function urlForImage(source: Image) {
  return builder.image(source).auto("format").fit("max");
}

/** Absolute URL for a Sanity image, sized for Open Graph and schema.org. */
export function ogImageUrl(source: Image | undefined | null): string | undefined {
  if (!source) return undefined;
  return urlForImage(source).width(1200).height(630).fit("crop").url();
}
