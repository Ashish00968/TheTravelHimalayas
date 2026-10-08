import fs from "node:fs";
import path from "node:path";

const OUT_DIR = path.resolve(process.cwd(), "out");

if (!fs.existsSync(OUT_DIR)) {
  console.log("[sync-static-routes] No 'out' directory found. Skipping.");
  process.exit(0);
}

let copiedCount = 0;

function walkDir(currentDir) {
  const entries = fs.readdirSync(currentDir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(currentDir, entry.name);

    if (entry.isDirectory()) {
      // Check if there is a sibling HTML file with the same name: <dir>.html
      const siblingHtml = `${fullPath}.html`;
      const targetIndex = path.join(fullPath, "index.html");

      if (fs.existsSync(siblingHtml) && !fs.existsSync(targetIndex)) {
        fs.copyFileSync(siblingHtml, targetIndex);
        copiedCount++;
        const relDir = path.relative(OUT_DIR, fullPath);
        console.log(`[sync-static-routes] Synchronized: ${relDir}.html -> ${relDir}/index.html`);
      }

      walkDir(fullPath);
    }
  }
}

console.log("[sync-static-routes] Scanning 'out' for directory / .html routing collisions...");
walkDir(OUT_DIR);
console.log(`[sync-static-routes] Done! Successfully created ${copiedCount} index.html mirrors to guarantee 100% 200 OK edge responses.`);
