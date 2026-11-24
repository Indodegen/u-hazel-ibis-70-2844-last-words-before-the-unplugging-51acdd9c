import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const text = readFileSync(join(here, "entry.txt"), "utf8");

function fail(message) {
  console.error(`error: ${message}`);
  process.exit(1);
}

if (text.length < 1 || text.length > 200) {
  fail(`entry must be 1-200 characters, got ${text.length}`);
}
if (text !== text.trim()) {
  fail("entry must not start or end with whitespace");
}
if (/[\n\r\u2028\u2029]/.test(text)) {
  fail("entry must be a single line");
}
if (/[\u0000-\u001F\u007F]/.test(text)) {
  fail("entry must not contain control characters");
}
if (/[\u200B\u200C\u200D\uFEFF]/.test(text)) {
  fail("entry must not contain invisible characters (U+200B/U+200C/U+200D/U+FEFF)");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), text, "utf8");
