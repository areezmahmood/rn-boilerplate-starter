#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

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

async function handleChatUIScript() {
    const answer = await askQuestion('Do you want to install Chat UI now? › (y/N) ');
    if (answer === 'y' || answer === 'yes') {
      console.log('Installing Chat UI...');
    } else {
      console.log('🛠  Chat UI support disabled. Cleaning up...');
      const projectDir = process.cwd();
      const projectName = path.basename(projectDir);
      const foldersToDelete = [
        "src/components/templates/ChatHeader",
        "src/screens/ChatScreen",
      ]

      foldersToDelete.forEach((folder) => {
        const fullPath = path.join(projectDir, folder);
        if (fs.existsSync(fullPath)) {
          fs.rmSync(fullPath, { recursive: true, force: true });
          console.log(`🗑️  Removed: ${folder}`);
        }
      });
      const templateIndexPath = path.join(projectDir, "src/components/templates/index.ts");
      if (fs.existsSync(templateIndexPath)) {
        let content = fs.readFileSync(templateIndexPath, "utf-8");
        const before = content;
        
        // Regex removes the whole ChatHeader export block
        content = content.replace(
          /export\s*\{[^}]*ChatHeader[^}]*\}[^;]*;\n?/gs,
          ""
        );

        if (content !== before) {
          fs.writeFileSync(templateIndexPath, content, "utf-8");
          console.log("📝 Removed ChatHeader export from src/components/templates/index.ts");
        }
      }
      // Step 3: Remove ChatScreen from src/navigation/path.ts
        const pathFile = path.join(projectDir, "src/navigation/paths.ts");
        if (fs.existsSync(pathFile)) {
          let content = fs.readFileSync(pathFile, "utf-8");
          const before = content;

          // This handles both enum and object-style Paths
          content = content.replace(
            /\s*ChatScreen\s*=\s*['"]chatScreen['"],?\n?/g, "" // enum style
          );
          content = content.replace(
            /\s*ChatScreen\s*:\s*['"]chatScreen['"],?\n?/g, "" // object style
          );

          if (content !== before) {
            fs.writeFileSync(pathFile, content, "utf-8");
            console.log("📝 Removed ChatScreen from src/navigation/path.ts");
          }
        }

      // Step 4: Remove ChatScreen type from src/navigation/types.ts
      const typesFile = path.join(projectDir, "src/navigation/types.ts");
      if (fs.existsSync(typesFile)) {
        let content = fs.readFileSync(typesFile, "utf-8");
        const before = content;

        content = content.replace(
          /\[Paths\.ChatScreen\]:\s*\{[^}]*\};?\n?/gs,
          ""
        );

        if (content !== before) {
          fs.writeFileSync(typesFile, content, "utf-8");
          console.log("📝 Removed ChatScreen type from src/navigation/types.ts");
        }
      }
      // Step 5:Remove screen export from src/screens/index.ts
      const screensIndexPath = path.join(projectDir, "src/screens/index.ts");
      if (fs.existsSync(screensIndexPath)) {
        let content = fs.readFileSync(screensIndexPath, "utf-8");
        const before = content;

        content = content.replace(
          /export\s*\{[^}]*ChatScreen[^}]*\}[^;]*;\n?/gs,
          ""
        );

        if (content !== before) {
          fs.writeFileSync(screensIndexPath, content, "utf-8");
          console.log("📝 Removed ChatScreen export from src/screens/index.ts");
        }
      }
      // Step 6: Remove dependencies from package.json
      const depsToRemove = [
      "@react-native-documents/picker",
      "@react-native-documents/viewer",
      "react-native-image-viewing",
      "rn-emoji-keyboard",
      ];
      const pkgPath = path.join(projectDir, 'package.json');
      if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
      let changed = false;

      depsToRemove.forEach((dep) => {
        if (pkg.dependencies && pkg.dependencies[dep]) {
          delete pkg.dependencies[dep];
          changed = true;
        }
        if (pkg.devDependencies && pkg.devDependencies[dep]) {
          delete pkg.devDependencies[dep];
          changed = true;
        }
      });

        if (changed) {
          fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), 'utf-8');
          console.log("📦 Removed Chat UI dependencies from package.json");
        }
      }
      // Step 7: Update src/navigation/application.tsx
      const appNavPath = path.join(projectDir, "src/navigation/application.tsx");
if (fs.existsSync(appNavPath)) {
  let content = fs.readFileSync(appNavPath, "utf-8");
  const before = content;

  // Remove ChatScreen import
 content = content.replace(
  /import\s*\{([^}]*)\}\s*from\s*['"]@\/screens['"];?/,
  (match, imports) => {
    const cleaned = imports
      .split(',')
      .map((s) => s.trim())
      .filter((imp) => imp !== 'ChatScreen')
      .join(', ');

    return cleaned.length > 0
      ? `import { ${cleaned} } from '@/screens';`
      : ''; // if ChatScreen was the only one, remove the whole line
  }
);

  // Remove ChatHeader + HeaderActionsProvider imports
  content = content.replace(
    /import\s*\{[^}]*ChatHeader[^}]*\}[^;]*;\n?/gs,
    ""
  );

  // Replace whole HeaderActionsProvider + ChatScreen block with clean NavigationContainer
  content = content.replace(
    /<HeaderActionsProvider>[\s\S]*?<\/HeaderActionsProvider>/g,
    `<NavigationContainer theme={navigationTheme}>
        <Stack.Navigator key={variant} screenOptions={{ headerShown: false }}>
          <Stack.Screen component={Startup} name={Paths.Startup} />
          <Stack.Screen component={Example} name={Paths.Example} />
        </Stack.Navigator>
      </NavigationContainer>`
  );

  if (content !== before) {
    fs.writeFileSync(appNavPath, content, "utf-8");
    console.log("📝 Cleaned up Chat UI code from src/navigation/application.tsx");
  }
}


    }
}

async function handleCameraScript(){
  const answer = await askQuestion('Do you want to install Camera now? › (y/N) ');

  const projectDir = process.cwd();
  const projectName = path.basename(projectDir);

const plistPath = path.join(projectDir, 'ios', projectName, 'Info.plist');

  if (answer === 'y' || answer === 'yes') {
    console.log('Installing Camera...');
      let plistContent = fs.readFileSync(plistPath, 'utf-8');

    if (!plistContent.includes('<key>NSCameraUsageDescription</key>')) {
  const injection = `
  <key>NSCameraUsageDescription</key>
  <string>$(PRODUCT_NAME) needs access to your Camera.</string>

  <!-- optionally, if you want to record audio: -->
  <key>NSMicrophoneUsageDescription</key>
  <string>$(PRODUCT_NAME) needs access to your Microphone.</string>
  <key>NSPhotoLibraryUsageDescription</key>
  <string>$(PRODUCT_NAME) needs access to your library.</string>
  <key>NSPhotoLibraryAddUsageDescription</key>
  <string>$(PRODUCT_NAME) needs access to write to your library.</string>
`;

  // Insert before the <key>UIAppFonts</key> line
  const lines = plistContent.split('\n');
  const insertIndex = lines.findIndex(line => line.includes('<key>UIAppFonts</key>'));

  if (insertIndex !== -1) {
    lines.splice(insertIndex, 0, injection);
    plistContent = lines.join('\n');

    fs.writeFileSync(plistPath, plistContent, 'utf-8');
    console.log('📄 Injected camera permissions into Info.plist before UIAppFonts');
  } else {
    console.warn('⚠️ Could not find <key>UIAppFonts</key> to insert permissions before it. Skipping injection.');
  }
}
  } else {
    console.log('🛠  Camera support disabled. Cleaning up...');

    // Step 1: Remove folders
    const foldersToDelete = [
      'src/components/organisms/CameraView',
      'src/hooks/Camera',
      'src/hooks/ImageLibrary',
      'patches',
    ];

    foldersToDelete.forEach((folder) => {
      const fullPath = path.join(projectDir, folder);
      if (fs.existsSync(fullPath)) {
        fs.rmSync(fullPath, { recursive: true, force: true });
        console.log(`🗑️  Removed: ${folder}`);
      }
    });


     const indexPath = path.join(projectDir,'src/components/organisms/index.ts');
    if (fs.existsSync(indexPath)) {
      let content = fs.readFileSync(indexPath, 'utf-8');
      const before = content;
      content = content.replace(/export\s+\{default\s+as\s+CameraView\}.*\n?/, '');
      if (content !== before) {
        fs.writeFileSync(indexPath, content, 'utf-8');
        console.log('📝 Removed CameraView export from src/components/organisms/index.ts');
      }
    }
     const hooksIndexPath = path.join(projectDir, 'src', 'hooks', 'index.ts');
    if (fs.existsSync(hooksIndexPath)) {
      let content = fs.readFileSync(hooksIndexPath, 'utf-8');
      const before = content;
      content = content
        .replace(/export\s+\{\s*useCameraPermission\s*\}.*\n?/, '')
        .replace(/export\s+\{\s*useImagePickerPermission\s*\}.*\n?/, '');
      if (content !== before) {
        fs.writeFileSync(hooksIndexPath, content, 'utf-8');
        console.log('📝 Removed Camera exports from src/hooks/index.ts');
      }
    }

    // Step 4: Remove dependencies from package.json
    const depsToRemove = [
      'react-native-compressor',
      'react-native-image-picker',
      'react-native-vision-camera',
    ];

    const pkgPath = path.join(projectDir, 'package.json');
    if (!fs.existsSync(pkgPath)) {
      console.warn('⚠️  package.json not found. Skipping dependency cleanup.');
    } else {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

      let changed = false;
      depsToRemove.forEach((dep) => {
        if (pkg.dependencies && pkg.dependencies[dep]) {
          delete pkg.dependencies[dep];
          changed = true;
        }
        if (pkg.devDependencies && pkg.devDependencies[dep]) {
          delete pkg.devDependencies[dep];
          changed = true;
        }
      });

      if (changed) {
        fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), 'utf-8');
        console.log(`📦 Updated package.json`);
      }
    }

    // // Step 4: Reinstall dependencies
    // try {
    //   console.log('📦 Running yarn install...');
    //   execSync('yarn install', { stdio: 'inherit' });
    // } catch (err) {
    //   console.warn('⚠️  yarn install failed. Run it manually.');
    // }

    // // Step 5: Format code using yarn format
    // try {
    //   console.log('🎨 Formatting code...');
    //   execSync('yarn format', { stdio: 'inherit' });
    // } catch (err) {
    //   console.warn('⚠️  yarn format failed. Make sure the script is defined.');
    // }

    // console.log('✅ Cleanup complete.');
  }
}


(async () => {
 await handleCameraScript();
 await handleChatUIScript();
})();
