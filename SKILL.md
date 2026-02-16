---
name: @forgemcp/keepa
description: Fetch Amazon product history (Price, Sales Rank) via Keepa API. Use for checking current prices, trends, and analyzing ASIN data.
version: 0.1.0
author: ForgeMCP
license: MIT
requires:
  node: ">=22"
  env: ["KEEPA_API_KEY"]
  bins: ["bun"]
metadata:
  clawdbot:
    permissions:
      network: ["api.keepa.com"]
      filesystem: []
    user-invocable: true
    risk: low
examples:
  - "Get price history for ASIN B0D8T9CQVV"
  - "Check sales rank for B08N5KWB9H in UK"
  - "Get best sellers for category 172282"
---

# Keepa API Skill

This skill retrieves product data from Amazon via the Keepa API using **Bun**. It provides current pricing, sales rank, and a history of recent changes.

## Security Manifest

### External Endpoints
This skill connects to the following external services:
-   `api.keepa.com`: For fetching product data, history, and best sellers.

### Data Flow
1.  User input (ASIN, Domain ID, Category ID) is sent to Keepa API.
2.  Response data is processed locally.
3.  No user data is stored persistently by this skill outside of the current session execution.

### Trust Declaration
By installing this skill, you trust:
-   **Keepa**: To provide accurate Amazon product data.
-   **ForgeMCP**: As the author of this orchestration logic.

## Core Functionality

Retrieves comprehensive product analytics including:
1.  **Current Stats**: Latest Amazon, New, Used prices and Sales Rank.
2.  **Historical Data**: Decoded history of price changes and sales rank trends.
3.  **Product Metadata**: Title, Manufacturer, Brand, and Image URL.
4.  **Best Sellers**: Retrieve category best sellers list.

Solves the pain point of accessing historical Amazon data for market analysis and price tracking.

## Usage

### Natural Language
- "Get price history for ASIN [ASIN]"
- "Check sales rank for [ASIN] in [Domain]"
- "Get best sellers for category [Category ID]"

### Invocation
The agent should invoke this tool directly using `bun`. Dependencies are automatically handled by Bun on the first run:

```bash
# Get product history
bunx @forgemcp/keepa product <ASIN> --domain <domain_id>

# Get best sellers for a category
bunx @forgemcp/keepa bestsellers <category_id> --domain <domain_id>
```

Examples:
- `bunx @forgemcp/keepa product B0D8T9CQVV` (Default: .com)
- `bunx @forgemcp/keepa bestsellers 172282` (Electronics Best Sellers)

## Input Schema (Zod)

```typescript
import { z } from "zod";

const ProductInputSchema = z.object({
  asin: z.string().regex(/^[A-Z0-9]{10}$/, "Invalid ASIN format").describe("Amazon Standard Identification Number"),
  domain: z.number().int().min(1).max(13).default(1).describe("Keepa Domain ID (1=com, 2=co.uk, 3=de, etc)"),
});

const BestSellersInputSchema = z.object({
  category: z.string().describe("Amazon Category Node ID"),
  domain: z.number().int().min(1).max(13).default(1).describe("Keepa Domain ID (1=com, 2=co.uk, 3=de, etc)"),
});
```

## Output Format

### Success (Product)
```json
{
  "meta": {
    "tokensLeft": 1199,
    "refillIn": 53950
  },
  "title": "Product Title Example",
  "asin": "B0D8T9CQVV",
// ...
```

### Success (Best Sellers)
```json
{
  "category": "172282",
  "domain": 1,
  "asins": ["B0...", "B0..."],
  "meta": {
    "tokensLeft": 99,
    "refillIn": 1000
  }
}
```

### Failure (JSON)
```json
{
  "error": "Keepa API Error: ...",
  "code": "API_ERROR"
}
```


Examples:
- `bunx @forgemcp/keepa B0D8T9CQVV` (Default: .com)
- `bunx @forgemcp/keepa B08N5KWB9H --domain 2` (UK Market)

## Input Schema (Zod)

```typescript
import { z } from "zod";

const InputSchema = z.object({
  asin: z.string().regex(/^[A-Z0-9]{10}$/, "Invalid ASIN format").describe("Amazon Standard Identification Number"),
  domain: z.number().int().min(1).max(13).default(1).describe("Keepa Domain ID (1=com, 2=co.uk, 3=de, etc)"),
});
```

## Output Format

### Success (JSON)
```json
{
  "meta": {
    "tokensLeft": 1199,
    "refillIn": 53950
  },
  "title": "Product Title Example",
  "asin": "B0D8T9CQVV",
  "manufacturer": "BrandName",
  "brand": "BrandName",
  "currentStats": {
    "amazon": 1999,
    "new": 1850,
    "used": -1,
    "salesRank": 500
  },
  "history": {
    "amazon_price": [
      { "date": "2024-06-19T09:26:00.000Z", "timestamp": 7082486, "value": 1999 }
    ],
    "new_price": [],
    "sales_rank": []
  },
  "lastUpdate": "2024-06-19T09:26:00.000Z"
}
```

### Failure (JSON)
```json
{
  "error": "Keepa API Error: ...",
  "code": "API_ERROR"
}
```

## Best Practices

-   **Token Management**: Monitor `meta.tokensLeft` to avoid rate limiting.
-   **Domain Selection**: Ensure correct domain ID is used for region-specific data.
-   **History Analysis**: Use the decoded `history` arrays for trend analysis rather than just current stats.

