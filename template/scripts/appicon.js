#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const projectRoot = process.cwd();
const androidRes = path.join(projectRoot, "android/app/src/main/res");
const iosAssets = path.join(projectRoot, "ios", "AwesomeProject", "Images.xcassets", "AppIcon.appiconset");
const sourceIcon = path.join(projectRoot, "src/assets/images/logo.png");

// ----------------- ANDROID -----------------
const androidIconSizes = {
  "mipmap-mdpi": 48,
  "mipmap-hdpi": 72,
  "mipmap-xhdpi": 96,
  "mipmap-xxhdpi": 144,
  "mipmap-xxxhdpi": 192,
};

// ----------------- IOS -----------------
const iosIconSpecs = [
  { idiom: "iphone", size: "20x20", scale: "2x", pixels: 40 },
  { idiom: "iphone", size: "20x20", scale: "3x", pixels: 60 },
  { idiom: "iphone", size: "29x29", scale: "2x", pixels: 58 },
  { idiom: "iphone", size: "29x29", scale: "3x", pixels: 87 },
  { idiom: "iphone", size: "40x40", scale: "2x", pixels: 80 },
  { idiom: "iphone", size: "40x40", scale: "3x", pixels: 120 },
  { idiom: "iphone", size: "60x60", scale: "2x", pixels: 120 },
  { idiom: "iphone", size: "60x60", scale: "3x", pixels: 180 },
  { idiom: "ios-marketing", size: "1024x1024", scale: "1x", pixels: 1024 },
];

// ----------------- HELPERS -----------------
function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function resizeImage(input, output, size) {
  execSync(`sips -z ${size} ${size} "${input}" --out "${output}"`);
}

// ----------------- ANDROID -----------------
function generateAndroidIcons() {
  console.log("⚡ Generating Android icons...");

  Object.entries(androidIconSizes).forEach(([folder, size]) => {
    const dir = path.join(androidRes, folder);
    ensureDir(dir);

    resizeImage(sourceIcon, path.join(dir, "ic_launcher.png"), size);
    resizeImage(sourceIcon, path.join(dir, "ic_launcher_round.png"), size);
  });

  console.log("✅ Android icons generated!");
}

// ----------------- IOS -----------------
function generateIOSIcons() {
  console.log("⚡ Generating iOS icons...");

  ensureDir(iosAssets);

  const contents = { images: [], info: { version: 1, author: "xcode" } };

  iosIconSpecs.forEach(({ idiom, size, scale, pixels }) => {
    const filename = `icon-${pixels}.png`;
    const outputPath = path.join(iosAssets, filename);

    resizeImage(sourceIcon, outputPath, pixels);

    contents.images.push({
      idiom,
      size,
      scale,
      filename,
    });
  });

  fs.writeFileSync(
    path.join(iosAssets, "Contents.json"),
    JSON.stringify(contents, null, 2)
  );

  console.log("✅ iOS icons generated!");
}

// ----------------- RUN -----------------
generateAndroidIcons();
generateIOSIcons();