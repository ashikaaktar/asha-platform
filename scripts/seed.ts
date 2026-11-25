import { runDatabaseSeed } from "../lib/seed";

async function main() {
  await runDatabaseSeed();
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
