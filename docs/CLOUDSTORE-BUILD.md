# CloudStore Extension - Configuration & Integration Guide

## Integration Steps

### 1. Installation

Add CloudStore to your `package.json`:

```bash
npm install cloudstore-extension
# or
npm install extensions/CloudStore.js
```

### 2. Configuration

Create a `.env` file with your cloud provider credentials:

```env
# Google Drive
GOOGLE_DRIVE_ACCESS_TOKEN=your_access_token
GOOGLE_DRIVE_REFRESH_TOKEN=your_refresh_token
GOOGLE_DRIVE_API_KEY=your_api_key

# Dropbox
DROPBOX_ACCESS_TOKEN=your_access_token
DROPBOX_API_KEY=your_app_key

# AWS S3
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_BUCKET_NAME=your-bucket
AWS_REGION=us-east-1

# Azure Blob Storage
AZURE_STORAGE_ACCOUNT=your_storage_account
AZURE_STORAGE_KEY=your_storage_key
AZURE_CONTAINER_NAME=your-container
```

### 3. Module Import

In your main application file:

```javascript
// app.js
const CloudStore = require('extensions/CloudStore');

// Initialize based on environment
const cloudStore = new CloudStore({
  provider: process.env.CLOUD_PROVIDER || 'google-drive',
  accessToken: process.env[`${process.env.CLOUD_PROVIDER.toUpperCase()}_ACCESS_TOKEN`],
  refreshToken: process.env[`${process.env.CLOUD_PROVIDER.toUpperCase()}_REFRESH_TOKEN`],
  apiKey: process.env[`${process.env.CLOUD_PROVIDER.toUpperCase()}_API_KEY`]
});

module.exports = cloudStore;
```

### 4. Usage in Plugins

Integrate CloudStore with your plugins:

```javascript
// plugins/StoragePlugin.js
const CloudStore = require('../extensions/CloudStore');

class StoragePlugin {
  constructor() {
    this.cloudStore = new CloudStore({
      provider: 'google-drive',
      accessToken: process.env.GOOGLE_DRIVE_ACCESS_TOKEN
    });
  }

  async initialize() {
    await this.cloudStore.authenticate();
  }

  async backupData(data) {
    const backupFile = `/backups/backup-${Date.now()}.json`;
    return await this.cloudStore.uploadFile(
      './backup.json',
      backupFile
    );
  }

  async restoreData(backupFile) {
    return await this.cloudStore.downloadFile(
      backupFile,
      './restored-backup.json'
    );
  }
}

module.exports = StoragePlugin;
```

## DroidScript Integration

### APK Build Configuration

Add to your `build.gradle`:

```gradle
dependencies {
  // CloudStore dependencies
  implementation 'com.google.api-client:google-api-client-android:1.33.0'
  implementation 'com.dropbox.core:dropbox-core-sdk:5.3.1'
  implementation 'software.amazon.awssdk:s3:2.20.0'
  implementation 'com.azure:azure-storage-blob:12.18.0'
  
  // HTTP clients
  implementation 'com.squareup.okhttp3:okhttp:4.10.0'
  implementation 'org.apache.httpcomponents:httpclient:4.5.14'
}

android {
  compileOptions {
    sourceCompatibility JavaVersion.VERSION_11
    targetCompatibility JavaVersion.VERSION_11
  }
  
  packagingOptions {
    exclude 'META-INF/proguard/androidx-*.pro'
  }
}
```

### ProGuard Rules

Add to `proguard-rules.pro`:

```proguard
# CloudStore
-keep class extensions.CloudStore { *; }
-keep class extensions.CloudStore$* { *; }
-keep interface extensions.CloudStore$* { *; }

# Google Drive
-keep class com.google.api.client.** { *; }
-keep class com.google.auth.** { *; }

# Dropbox
-keep class com.dropbox.core.** { *; }

# AWS S3
-keep class software.amazon.awssdk.** { *; }

# Azure
-keep class com.azure.storage.** { *; }

# HTTP clients
-keep class okhttp3.** { *; }
-keep interface okhttp3.** { *; }
-keep class org.apache.http.** { *; }

# Preserve line numbers for debugging
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile
```

### AndroidManifest.xml

Add required permissions:

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

  <!-- Network permissions -->
  <uses-permission android:name="android.permission.INTERNET" />
  <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
  
  <!-- File access permissions -->
  <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
  <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
  
  <!-- Cloud service permissions -->
  <uses-permission android:name="android.permission.GET_ACCOUNTS" />
  <uses-permission android:name="android.permission.USE_CREDENTIALS" />
  
  <application>
    <!-- Activities and services -->
  </application>

</manifest>
```

## Build Artifacts

### 1. APK (Android Package)

```bash
npm run build:apk

# Output: app/build/outputs/apk/debug/app-debug.apk
# Size: ~8-12 MB (depends on dependencies)
# Usage: Direct installation on Android device
```

### 2. SPK (DroidScript Source Package)

```bash
npm run build:spk

# Output: build/output.spk
# Contains: Source code, resources, metadata
# Usage: DroidScript IDE or on-device compilation
```

### 3. PPK (Protected Package)

```bash
npm run build:ppk

# Output: build/output.ppk
# Contains: Encrypted source code
# Usage: Distribution with source code protection
```

## Manifest Configuration

Create `droidscript-manifest.json`:

```json
{
  "name": "magmod.app",
  "version": "1.0.0",
  "description": "DroidScript app with CloudStore extension",
  "main": "app.js",
  "author": "Your Name",
  "license": "MIT",
  "extensions": [
    {
      "name": "CloudStore",
      "version": "1.0.0",
      "path": "extensions/CloudStore.js",
      "providers": ["google-drive", "dropbox", "s3", "azure"]
    },
    {
      "name": "ThemeEngine",
      "version": "1.0.0",
      "path": "extensions/ThemeEngine.js"
    },
    {
      "name": "AnimationLibrary",
      "version": "1.0.0",
      "path": "extensions/AnimationLibrary.js"
    },
    {
      "name": "Encryption",
      "version": "1.0.0",
      "path": "extensions/Encryption.js"
    },
    {
      "name": "APIClient",
      "version": "1.0.0",
      "path": "extensions/APIClient.js"
    },
    {
      "name": "DataParser",
      "version": "1.0.0",
      "path": "extensions/DataParser.js"
    }
  ],
  "plugins": [
    {
      "name": "Core",
      "version": "1.0.0",
      "path": "plugins/CorePlugin.js"
    },
    {
      "name": "UI",
      "version": "1.0.0",
      "path": "plugins/UIPlugin.js"
    },
    {
      "name": "Network",
      "version": "1.0.0",
      "path": "plugins/NetworkPlugin.js"
    },
    {
      "name": "Storage",
      "version": "1.0.0",
      "path": "plugins/StoragePlugin.js"
    },
    {
      "name": "Camera",
      "version": "1.0.0",
      "path": "plugins/CameraPlugin.js"
    },
    {
      "name": "Location",
      "version": "1.0.0",
      "path": "plugins/LocationPlugin.js"
    }
  ],
  "permissions": [
    "android.permission.INTERNET",
    "android.permission.READ_EXTERNAL_STORAGE",
    "android.permission.WRITE_EXTERNAL_STORAGE",
    "android.permission.GET_ACCOUNTS",
    "android.permission.ACCESS_NETWORK_STATE"
  ],
  "minSdkVersion": 21,
  "targetSdkVersion": 33,
  "versionCode": 1
}
```

## Build Script Configuration

Update `package.json` scripts:

```json
{
  "scripts": {
    "build:all": "npm run build:apk && npm run build:spk && npm run build:ppk",
    "build:apk": "droidscript build --format apk --output app/build/outputs/apk/debug/",
    "build:spk": "droidscript build --format spk --output build/",
    "build:ppk": "droidscript build --format ppk --output build/ --encrypt",
    "sign:apk": "jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore keystore.jks app/build/outputs/apk/debug/app-debug.apk alias_name",
    "align:apk": "zipalign -v 4 app/build/outputs/apk/debug/app-debug.apk app/build/outputs/apk/release/app-release.apk",
    "install:apk": "adb install app/build/outputs/apk/debug/app-debug.apk",
    "test": "jest",
    "test:watch": "jest --watch",
    "coverage": "jest --coverage"
  }
}
```

## CI/CD Pipeline

Create `.github/workflows/build-release.yml`:

```yaml
name: Build and Release

on:
  push:
    branches: [main, magmod.app-dev]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build APK
      run: npm run build:apk
    
    - name: Build SPK
      run: npm run build:spk
    
    - name: Build PPK
      run: npm run build:ppk
    
    - name: Upload artifacts
      uses: actions/upload-artifact@v3
      with:
        name: build-artifacts
        path: |
          app/build/outputs/apk/debug/
          build/
```

## Performance Optimization

### For APK:

```bash
# Enable code shrinking
npm run build:apk -- --minify

# Enable resource shrinking
npm run build:apk -- --resource-minify

# Strip debug symbols
npm run build:apk -- --strip-debug-symbols
```

### For SPK/PPK:

```bash
# Compress source files
npm run build:spk -- --compress

# Optimize assets
npm run build:ppk -- --optimize-assets
```

## Distribution

### Play Store Release:

```bash
# Sign APK for release
npm run sign:apk

# Align APK
npm run align:apk

# Upload to Play Store
```

### Direct Distribution:

```bash
# Create release package
npm run build:ppk

# Create checksums
sha256sum build/output.ppk > build/output.ppk.sha256

# Create manifest
cat > build/manifest.json << EOF
{
  "version": "1.0.0",
  "files": [
    {
      "name": "output.ppk",
      "sha256": "$(cat build/output.ppk.sha256 | cut -d' ' -f1)",
      "size": $(stat -f%z build/output.ppk)
    }
  ]
}
EOF
```

## Verification

After building, verify the package:

```bash
# Check APK
aapt dump badging app/build/outputs/apk/debug/app-debug.apk

# List SPK contents
unzip -l build/output.spk

# Verify PPK signature
droidscript verify build/output.ppk
```

## Troubleshooting

**Build fails with "CloudStore not found"**
- Ensure `extensions/CloudStore.js` exists
- Check file permissions
- Verify paths in manifest

**APK is too large**
- Enable ProGuard shrinking
- Remove unused dependencies
- Use resource minification

**SPK/PPK generation fails**
- Check DroidScript version compatibility
- Verify manifest configuration
- Ensure all required files are present

For more help, see the main [BUILDING.md](./BUILDING.md) guide.
