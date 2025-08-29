#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const readline = require("readline");

const projectRoot = process.cwd();
const splashSource = path.join(projectRoot, "src/assets/branding/splash.png");
const drawableDir = path.join(projectRoot, "android/app/src/main/res/drawable");
const stylesFile = path.join(projectRoot, "android/app/src/main/res/values/styles.xml");

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function copySplashDrawable() {
  ensureDir(drawableDir);
  const splashDrawable = path.join(drawableDir, "splash_logo.png");

  // resize splash to 512x512 (keeps it clean for drawable)
  execSync(`sips -z 512 512 "${splashSource}" --out "${splashDrawable}"`);

  return splashDrawable;
}

function createLayerListDrawable() {
  const xml = `<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:drawable="@android:color/white" /> <!-- background color -->
    <item>
        <bitmap
            android:gravity="center"
            android:src="@drawable/splash_logo"/>
    </item>
</layer-list>
`;
  const target = path.join(drawableDir, "splash_background.xml");
  fs.writeFileSync(target, xml, "utf8");
  console.log("✅ Created splash_background.xml (layer-list)");
}

function injectSplashStyle(fullscreen) {
  let xml = fs.readFileSync(stylesFile, "utf8");
  const marker = "<!-- Customize your theme here. -->";

  const normalSplash = `        <item name="android:windowBackground">@drawable/splash_background</item>`;

  const fullscreenSplash = `
        <item name="android:windowBackground">@drawable/splash_logo</item>
        <item name="android:windowFullscreen">true</item>
        <item name="android:statusBarColor">@android:color/transparent</item>
  `;

  const insertBlock = fullscreen ? fullscreenSplash : normalSplash;

  if (!xml.includes("@drawable/splash_logo") && !xml.includes("@drawable/splash_background")) {
    xml = xml.replace(marker, `${marker}\n${insertBlock}`);
    fs.writeFileSync(stylesFile, xml, "utf8");
    console.log("✅ Splash style injected into styles.xml");
  } else {
    console.log("ℹ️ Splash style already exists in styles.xml");
  }
}

function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans.toLowerCase());
    })
  );
}

(async () => {
  if (!fs.existsSync(splashSource)) {
    console.error(`❌ Missing file: ${splashSource}`);
    process.exit(1);
  }

  const answer = await askQuestion("Do you want a full screen splash (Y/N)? ");
  const fullscreen = answer === "y" || answer === "yes";

  copySplashDrawable();

  if (!fullscreen) {
    createLayerListDrawable();
  }

  injectSplashStyle(fullscreen);

  console.log("🎉 Done!");
})();