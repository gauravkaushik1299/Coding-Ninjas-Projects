import gulp from "gulp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

gulp.task("default", async function () {
  const srcDir = path.join(__dirname, "src/files");
  const destDir = path.join(__dirname, "dest/files");

  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const allowedExtensions = [".js", ".json", ".css", ".html"];
  const files = fs.readdirSync(srcDir);

  let combinedContent = "";

  for (const file of files) {
    const ext = path.extname(file);
    if (allowedExtensions.includes(ext)) {
      const content = fs.readFileSync(path.join(srcDir, file), "utf8");
      combinedContent += content + "\n";
    }
  }

  fs.writeFileSync(path.join(destDir, "all.js"), combinedContent);
});
