import { describe, expect, it } from "vitest";
import { handleApi } from "./index";

async function requestScienceExport(query = "") {
  const url = new URL(`https://scienceboard.test/api/science/export.json${query}`);
  return handleApi(
    new Request(url),
    {} as Parameters<typeof handleApi>[1],
    url,
  );
}

describe("science export API", () => {
  it("rejects unknown board slugs without returning the full registry", async () => {
    const response = await requestScienceExport("?board=not-a-board");

    expect(response.status).toBe(404);
    expect(response.headers.get("content-disposition")).toBeNull();
    expect(await response.json()).toEqual({
      error: "Science board not found",
      board: "not-a-board",
    });
  });

  it("rejects an explicitly empty board filter", async () => {
    const response = await requestScienceExport("?board=");

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({
      error: "Science board not found",
      board: "",
    });
  });

  it("exports only records belonging to a known board", async () => {
    const response = await requestScienceExport("?board=astronomy");
    const payload = await response.json() as { records: Array<{ discipline: string }>; total: number };

    expect(response.status).toBe(200);
    expect(payload.total).toBe(3);
    expect(payload.records.every((record) => record.discipline === "Astronomy")).toBe(true);
    expect(response.headers.get("content-disposition")).toContain("science-board-astronomy-");
  });

  it("exports all records only when the board filter is omitted", async () => {
    const response = await requestScienceExport();
    const payload = await response.json() as { total: number };

    expect(response.status).toBe(200);
    expect(payload.total).toBe(25);
    expect(response.headers.get("content-disposition")).toContain("science-board-all-");
  });
});
