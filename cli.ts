#!/usr/bin/env bun
import { Command } from "commander";
import { fetchProduct, fetchBestSellers } from "./src/index";
import pkg from "./package.json";

if ((import.meta as any).main) {
  const program = new Command();

  program
    .name("keepa")
    .description("Fetch Amazon product history (Price, Sales Rank) via Keepa API. Use for checking current prices, trends, and analyzing ASIN data.")
    .version(pkg.version);

  program
    .command("product")
    .description("Fetch product details by ASIN (default command)")
    .argument("<asin>", "Amazon Standard Identification Number (ASIN)")
    .option("-d, --domain <number>", "Keepa Domain ID (1=com, 2=co.uk, 3=de, etc)", (value) => parseInt(value), 1)
    .action(async (asin, options) => {
      try {
        const result = await fetchProduct(asin, options.domain);
        console.log(JSON.stringify(result, null, 2));
        console.error(`Tokens Left: ${result.meta.tokensLeft} (Refill in ${result.meta.refillIn}ms)`);
      } catch (err: any) {
        console.error(err.message || err);
        process.exit(1);
      }
    });

  program
    .command("bestsellers")
    .description("Fetch best sellers list for a category")
    .argument("<category>", "Category Node ID")
    .option("-d, --domain <number>", "Keepa Domain ID", (value) => parseInt(value), 1)
    .action(async (category, options) => {
      try {
        const result = await fetchBestSellers(category, options.domain);
        console.log(JSON.stringify(result, null, 2));
        console.error(`Tokens Left: ${result.meta.tokensLeft} (Refill in ${result.meta.refillIn}ms)`);
      } catch (err: any) {
        console.error(err.message || err);
        process.exit(1);
      }
    });


  program.parse(process.argv);
}
