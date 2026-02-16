---
name: keepa-api
description: Fetch Amazon product history (Price, Sales Rank) via Keepa API. Use for checking current prices, trends, and analyzing ASIN data.
---

# Keepa API Skill

This skill retrieves product data from Amazon via the Keepa API using **Bun**. It provides current pricing, sales rank, and a history of recent changes.

## Usage

To fetch product details for a given ASIN:

```bash
bun run cli.ts product <ASIN>
```

To fetch best sellers for a category:

```bash
bun run cli.ts bestsellers <CATEGORY>
```

## Features
- **Native Bun Implementation**: Fast startup, built-in TypeScript support.
- **Token Handling**: Logs remaining tokens and refill time to stderr.
- **History Decoding**: Automatically converts Keepa's compressed CSV time format to ISO dates.

## Output

The script outputs a JSON object containing:
-   **Meta**: Token usage info (`tokensLeft`, `refillIn`).
-   **Product Info**: Title, Brand, Manufacturer.
-   **Current Stats**: Object `{ amazon, new, used, salesRank }` with latest values in cents (e.g., 1999 = $19.99).
-   **History**: Arrays of recent changes for Amazon Price, New Price, and Sales Rank.
    -   `amazon_price`: Sold by Amazon.
    -   `new_price`: 3rd Party New.
    -   `sales_rank`: Best Sellers Rank.

## Examples

**Fetch data for an ASIN:**
```bash
bun run cli.ts B0D8T9CQVV
```

**Run Tests:**
```bash
bun test
```
