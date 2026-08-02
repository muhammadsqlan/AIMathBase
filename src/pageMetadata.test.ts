import { describe, expect, it } from "vitest";
import { applyPageMetadata } from "./applyPageMetadata";
import { pageMetadataForPath } from "./pageMetadata";

class FakeElement {
  readonly attributes = new Map<string, string>();

  setAttribute(name: string, value: string): void {
    this.attributes.set(name, value);
  }
}

function metadataDocument() {
  const elements = new Map<string, FakeElement>([
    ['meta[name="description"]', new FakeElement()],
    ['link[rel="canonical"]', new FakeElement()],
    ['meta[property="og:title"]', new FakeElement()],
    ['meta[property="og:description"]', new FakeElement()],
    ['meta[property="og:url"]', new FakeElement()],
  ]);
  const targetDocument = {
    title: "",
    querySelector: (selector: string) => elements.get(selector) ?? null,
  } as unknown as Document;
  return { elements, targetDocument };
}

describe("route metadata", () => {
  it("gives the Mathematics route its AIMathBase identity", () => {
    const metadata = pageMetadataForPath("/math/");
    const { elements, targetDocument } = metadataDocument();

    applyPageMetadata(metadata, targetDocument);

    expect(targetDocument.title).toBe("AIMathBase");
    expect(metadata.description).toContain("mathematical results");
    expect(elements.get('link[rel="canonical"]')?.attributes.get("href")).toBe("https://scienceboard.sqlan.workers.dev/math");
    expect(elements.get('meta[property="og:title"]')?.attributes.get("content")).toBe("AIMathBase");
    expect(elements.get('meta[property="og:description"]')?.attributes.get("content")).toBe(metadata.description);
    expect(elements.get('meta[property="og:url"]')?.attributes.get("content")).toBe(metadata.canonicalUrl);
  });

  it("keeps science routes on the Science Board identity", () => {
    expect(pageMetadataForPath("/")).toEqual({
      title: "Science Board",
      description: expect.stringContaining("scientific disciplines"),
      canonicalUrl: "https://scienceboard.sqlan.workers.dev/",
    });
  });
});
