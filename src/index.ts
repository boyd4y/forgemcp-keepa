import { config } from "./config";

const KEEPA_EPOCH = 1293840000000;

export interface KeepaHistoryPoint {
  date: string;
  value: number;
  timestamp: number;
}

export function keepaToDate(keepaMinutes: number): string {
  const ms = (keepaMinutes * 60000) + KEEPA_EPOCH;
  return new Date(ms).toISOString();
}

export function decodeHistory(csv: number[] | null | undefined, limit = 5): KeepaHistoryPoint[] {
  if (!csv || csv.length === 0) return [];

  const history: KeepaHistoryPoint[] = [];
  const len = csv.length;

  for (let i = len - 2; i >= 0; i -= 2) {
    if (history.length >= limit) break;
    
    const time = csv[i];
    const val = csv[i+1];
    
    history.push({
      date: typeof time === 'number' ? new Date((time * 60000) + KEEPA_EPOCH).toISOString() : "Invalid Date",
      timestamp: time,
      value: val
    });
  }
  
  return history.reverse();
}

export async function fetchProduct(asin: string, domain: number = 1) {
  const url = `https://api.keepa.com/product?key=${config.KEEPA_API_KEY}&domain=${domain}&asin=${asin}&history=1&stats=1`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const json = await response.json();

  if (json.error) {
    throw new Error(`Keepa API Error: ${JSON.stringify(json.error)}`);
  }
  
  const tokensLeft = json.tokensLeft;
  const refillIn = json.refillIn;
  
  if (!json.products || json.products.length === 0) {
    throw new Error(`No product found for ASIN: ${asin}`);
  }

  const product = json.products[0];
  const LIMIT = 100; 

  const result = {
    meta: {
        tokensLeft,
        refillIn
    },
    title: product.title,
    asin: product.asin,
    manufacturer: product.manufacturer,
    brand: product.brand,
    currentStats: {
      amazon: product.stats?.current?.[0], 
      new: product.stats?.current?.[1],
      used: product.stats?.current?.[2],
      salesRank: product.stats?.current?.[3]
    },
    history: {
      amazon_price: decodeHistory(product.csv[0], LIMIT), 
      new_price: decodeHistory(product.csv[1], LIMIT),
      sales_rank: decodeHistory(product.csv[3], LIMIT),
      rating: decodeHistory(product.csv[16], LIMIT),
      review_count: decodeHistory(product.csv[17], LIMIT)
    },
    lastUpdate: new Date((product.lastUpdate * 60000) + KEEPA_EPOCH).toISOString()
  };

  return result;
}

export async function fetchBestSellers(category: string, domain: number = 1) {
  const url = `https://api.keepa.com/bestsellers?key=${config.KEEPA_API_KEY}&domain=${domain}&category=${category}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const json = await response.json();

  if (json.error) {
    throw new Error(`Keepa API Error: ${JSON.stringify(json.error)}`);
  }
  
  const asins = json.bestSellersList?.[category];
  
  if (!asins) {
    throw new Error(`No best sellers found for category: ${category}`);
  }

  return {
    category,
    domain,
    asins,
    meta: {
      tokensLeft: json.tokensLeft,
      refillIn: json.refillIn
    }
  };
}
