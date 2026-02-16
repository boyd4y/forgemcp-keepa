import { test, expect, mock } from "bun:test";
import { fetchProduct, fetchBestSellers } from "../src/index";

const mockResponse = {
  products: [{
    title: "Test Product",
    asin: "TESTASIN",
    manufacturer: "TestMaker",
    brand: "TestBrand",
    stats: {
      current: [1000, 2000, -1, 50]
    },
    csv: [
      [100, 1000, 200, 1200],
      [100, 2000, 200, 2200],
      [],
      [100, 50, 200, 45],
      [], [], [], [], [], [], [], [], [], [], [], [],
      [],
      []
    ],
    lastUpdate: 20000
  }],
  tokensLeft: 100,
  refillIn: 5000
};

const mockBestsellersResponse = {
  bestSellersList: {
    "123": ["ASIN1", "ASIN2"]
  },
  tokensLeft: 99,
  refillIn: 4000
};

test("fetchProduct returns correct structure", async () => {
  global.fetch = mock(() => 
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    } as Response)
  ) as unknown as typeof fetch;

  const result = await fetchProduct("TESTASIN");

  expect(result.asin).toBe("TESTASIN");
  expect(result.title).toBe("Test Product");
  expect(result.currentStats.amazon).toBe(1000);
  expect(result.history.amazon_price).toBeDefined();
  expect(result.meta.tokensLeft).toBe(100);
});

test("fetchBestSellers returns correct structure", async () => {
  global.fetch = mock(() => 
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockBestsellersResponse)
    } as Response)
  ) as unknown as typeof fetch;

  const result = await fetchBestSellers("123");

  expect(result.category).toBe("123");
  expect(result.asins).toEqual(["ASIN1", "ASIN2"]);
  expect(result.meta.tokensLeft).toBe(99);
});
