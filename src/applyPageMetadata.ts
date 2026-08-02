import type { PageMetadata } from "./pageMetadata";

export function applyPageMetadata(metadata: PageMetadata, targetDocument: Document = document): void {
  targetDocument.title = metadata.title;
  targetDocument.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute("content", metadata.description);
  targetDocument.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute("href", metadata.canonicalUrl);
  targetDocument.querySelector<HTMLMetaElement>('meta[property="og:title"]')?.setAttribute("content", metadata.title);
  targetDocument.querySelector<HTMLMetaElement>('meta[property="og:description"]')?.setAttribute("content", metadata.description);
  targetDocument.querySelector<HTMLMetaElement>('meta[property="og:url"]')?.setAttribute("content", metadata.canonicalUrl);
}
