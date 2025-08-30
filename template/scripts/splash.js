#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const projectRoot = process.cwd();
const splashSource = path.join(projectRoot, 'src/assets/branding/splash.png');

// --- ANDROID PATHS ---
const drawableDir = path.join(projectRoot, 'android/app/src/main/res/drawable');
const stylesFile = path.join(
  projectRoot,
  'android/app/src/main/res/values/styles.xml',
);

// --- IOS PATHS ---
const iosImagesDir = path.join(
  projectRoot,
  'ios',
  'App',
  'Images.xcassets',
  'splash.imageset',
);
const iosStoryboard = path.join(
  projectRoot,
  'ios',
  'AwesomeProject',
  'LaunchScreen.storyboard',
);

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function copySplashDrawable() {
  ensureDir(drawableDir);
  const splashDrawable = path.join(drawableDir, 'splash_logo.png');

  // resize splash to 512x512
  execSync(`sips -z 512 512 "${splashSource}" --out "${splashDrawable}"`);
  return splashDrawable;
}

function createLayerListDrawable() {
  const xml = `<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:drawable="@android:color/white" />
    <item>
        <bitmap
            android:gravity="center"
            android:src="@drawable/splash_logo"/>
    </item>
</layer-list>
`;
  const target = path.join(drawableDir, 'splash_background.xml');
  fs.writeFileSync(target, xml, 'utf8');
  console.log('✅ Created splash_background.xml (layer-list)');
}

function injectSplashStyle(fullscreen) {
  let xml = fs.readFileSync(stylesFile, 'utf8');
  const marker = '<!-- Customize your theme here. -->';

  const normalSplash = `        <item name="android:windowBackground">@drawable/splash_background</item>`;
  const fullscreenSplash = `
        <item name="android:windowBackground">@drawable/splash_logo</item>
        <item name="android:windowFullscreen">true</item>
        <item name="android:statusBarColor">@android:color/transparent</item>
  `;

  const insertBlock = fullscreen ? fullscreenSplash : normalSplash;

  if (
    !xml.includes('@drawable/splash_logo') &&
    !xml.includes('@drawable/splash_background')
  ) {
    xml = xml.replace(marker, `${marker}\n${insertBlock}`);
    fs.writeFileSync(stylesFile, xml, 'utf8');
    console.log('✅ Splash style injected into styles.xml');
  } else {
    console.log('ℹ️ Splash style already exists in styles.xml');
  }
}

// ----------------- iOS -----------------
function createIOSImageset() {
  const imagesDir = path.join(
    projectRoot,
    'ios',
    'AwesomeProject',
    'Images.xcassets',
    'splash.imageset',
  );
  ensureDir(imagesDir);

  // Export splash in 1x, 2x, 3x
  execSync(
    `sips -Z 200 "${splashSource}" --out "${path.join(imagesDir, 'splash.png')}"`,
  );
  execSync(
    `sips -Z 400 "${splashSource}" --out "${path.join(imagesDir, 'splash@2x.png')}"`,
  );
  execSync(
    `sips -Z 600 "${splashSource}" --out "${path.join(imagesDir, 'splash@3x.png')}"`,
  );

  const contents = {
    images: [
      { idiom: 'universal', filename: 'splash.png', scale: '1x' },
      { idiom: 'universal', filename: 'splash@2x.png', scale: '2x' },
      { idiom: 'universal', filename: 'splash@3x.png', scale: '3x' },
    ],
    info: { version: 1, author: 'xcode' },
  };

  fs.writeFileSync(
    path.join(imagesDir, 'Contents.json'),
    JSON.stringify(contents, null, 2),
    'utf8',
  );

  console.log('✅ Created splash.imageset for iOS');
}

function patchIosStoryboard(fullscreen) {
  if (!fs.existsSync(iosStoryboard)) {
    console.log('⚠️ LaunchScreen.storyboard not found, skipping iOS patch.');
    return;
  }

  let xml = fs.readFileSync(iosStoryboard, 'utf8');

  // remove any existing <subviews>…</subviews> and <constraints>…</constraints>
  xml = xml.replace(/<subviews>[\s\S]*?<\/subviews>/, '<subviews></subviews>');
  xml = xml.replace(/<constraints>[\s\S]*?<\/constraints>/, '');

  if (fullscreen) {
    // fullscreen image
    const imageView = `
        <imageView clipsSubviews="YES" userInteractionEnabled="NO"
          contentMode="scaleAspectFill" image="splash"
          translatesAutoresizingMaskIntoConstraints="NO" id="splashImage">
          <rect key="frame" x="0.0" y="0.0" width="414" height="896"/>
        </imageView>`;
    xml = xml.replace(
      '<subviews></subviews>',
      `<subviews>${imageView}\n</subviews>`,
    );

    const constraints = `
        <constraints>
            <constraint firstItem="splashImage" firstAttribute="top" secondItem="Ze5-6b-2t3" secondAttribute="top" id="c1"/>
            <constraint firstItem="splashImage" firstAttribute="bottom" secondItem="Ze5-6b-2t3" secondAttribute="bottom" id="c2"/>
            <constraint firstItem="splashImage" firstAttribute="leading" secondItem="Ze5-6b-2t3" secondAttribute="leading" id="c3"/>
            <constraint firstItem="splashImage" firstAttribute="trailing" secondItem="Ze5-6b-2t3" secondAttribute="trailing" id="c4"/>
        </constraints>`;
    xml = xml.replace(/<\/view>/, `${constraints}\n</view>`);
  } else {
    // centered logo
    const imageView = `
        <imageView clipsSubviews="YES" userInteractionEnabled="NO"
          contentMode="scaleAspectFit" image="splash"
          translatesAutoresizingMaskIntoConstraints="NO" id="splashImage">
          <rect key="frame" x="107" y="298" width="200" height="200"/>
        </imageView>`;
    xml = xml.replace(
      '<subviews></subviews>',
      `<subviews>${imageView}\n</subviews>`,
    );

    const constraints = `
        <constraints>
            <constraint firstItem="splashImage" firstAttribute="centerX" secondItem="Ze5-6b-2t3" secondAttribute="centerX" id="c1"/>
            <constraint firstItem="splashImage" firstAttribute="centerY" secondItem="Ze5-6b-2t3" secondAttribute="centerY" id="c2"/>
        </constraints>`;
    xml = xml.replace(/<\/view>/, `${constraints}\n</view>`);
  }

  fs.writeFileSync(iosStoryboard, xml, 'utf8');
  console.log(
    `✅ Patched LaunchScreen.storyboard for iOS (${fullscreen ? 'fullscreen' : 'centered'})`,
  );
}

// ----------------- COMMON -----------------
function askQuestion(query) {
  const rl = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve =>
    rl.question(query, ans => {
      rl.close();
      resolve(ans.toLowerCase());
    }),
  );
}

(async () => {
  if (!fs.existsSync(splashSource)) {
    console.error(`❌ Missing file: ${splashSource}`);
    process.exit(1);
  }

  const answer = await askQuestion('Do you want a full screen splash (Y/N)? ');
  const fullscreen = answer === 'y' || answer === 'yes';

  // --- ANDROID ---
  copySplashDrawable();
  if (!fullscreen) createLayerListDrawable();
  injectSplashStyle(fullscreen);

  // --- IOS ---
  createIOSImageset();

  if (fs.existsSync(iosStoryboard)) {
    if (fullscreen) {
      patchIosStoryboard(true); // fullscreen splash
    } else {
      patchIosStoryboard(false); // centered logo only
    }
  } else {
    console.log('⚠️ LaunchScreen.storyboard not found, skipping iOS patch.');
  }
  console.log('🎉 Done!');
})();
