#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const projectRoot = process.cwd();
const androidRes = path.join(projectRoot, "android/app/src/main/res");
const sourceIcon = path.join(projectRoot, "src/assets/images/logo.png");

const androidIconSizes = {
  "mipmap-mdpi": 48,
  "mipmap-hdpi": 72,
  "mipmap-xhdpi": 96,
  "mipmap-xxhdpi": 144,
  "mipmap-xxxhdpi": 192,
};

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function resizeImage(input, output, size) {
  execSync(`sips -z ${size} ${size} "${input}" --out "${output}"`);
}

function generateAndroidIcons() {
  console.log("⚡ Generating Android icons...");

  Object.entries(androidIconSizes).forEach(([folder, size]) => {
    const dir = path.join(androidRes, folder);
    ensureDir(dir);

    // Square icon
    resizeImage(sourceIcon, path.join(dir, "ic_launcher.png"), size);

    // Round icon (same image, Android treats it as round in manifest)
    resizeImage(sourceIcon, path.join(dir, "ic_launcher_round.png"), size);
  });

  console.log("✅ Android icons (square + round) generated!");
}

generateAndroidIcons();