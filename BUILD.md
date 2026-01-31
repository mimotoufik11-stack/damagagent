# دليل البناء والنشر | Build & Deployment Guide

## 📦 متطلبات البناء

### 1. بيئة التطوير
- Node.js 18 أو أحدث
- npm أو yarn
- Git
- 8GB RAM على الأقل
- 2GB مساحة حرة على القرص

### 2. أدوات إضافية

#### Windows
```bash
npm install --global windows-build-tools
```

#### macOS
```bash
xcode-select --install
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt-get install build-essential
```

## 🔨 خطوات البناء

### 1. إعداد المشروع

```bash
# استنساخ المشروع
git clone https://github.com/your-repo/quran-video-editor.git
cd quran-video-editor

# تثبيت المكتبات
npm install

# تحميل FFmpeg
# ضع ffmpeg.exe و ffprobe.exe في public/ffmpeg/
```

### 2. بناء واجهة React

```bash
npm run build:renderer
```

**الناتج:**
- مجلد `build/` يحتوي على ملفات HTML/CSS/JS المصغرة
- حجم تقريبي: 2-5 MB

### 3. بناء تطبيق Electron

#### Windows (64-bit)
```bash
npm run build:electron
```

**الناتج:**
- `dist/QuranVideoEditor-Setup-{version}.exe` (~150-200 MB)
- يتضمن:
  - تطبيق Electron
  - FFmpeg binaries
  - جميع المكتبات المطلوبة

#### macOS
```bash
npm run build:electron
```

**الناتج:**
- `dist/QuranVideoEditor-{version}.dmg`
- `dist/QuranVideoEditor-{version}.zip`

#### Linux
```bash
npm run build:electron
```

**الناتج:**
- `dist/QuranVideoEditor-{version}.AppImage`
- `dist/QuranVideoEditor-{version}.deb`
- `dist/QuranVideoEditor-{version}.rpm`

### 4. بناء لجميع المنصات

```bash
npm run build:all
```

**ملاحظة:** يتطلب بيئة مناسبة لكل منصة.

## 🎯 إعدادات البناء

### electron-builder.yml

```yaml
appId: com.quran.videoeditor
productName: Quran Video Editor

win:
  target: nsis
  icon: public/icons/icon.ico

mac:
  target: dmg
  icon: public/icons/icon.icns

linux:
  target:
    - AppImage
    - deb
```

### package.json

```json
{
  "build": {
    "appId": "com.quran.videoeditor",
    "productName": "Quran Video Editor",
    "directories": {
      "output": "dist"
    }
  }
}
```

## 📋 قائمة التحقق قبل البناء

- [ ] تحديث رقم الإصدار في `package.json`
- [ ] تحديث `CHANGELOG.md`
- [ ] التأكد من وجود FFmpeg binaries
- [ ] التأكد من وجود الأيقونات
- [ ] اختبار التطبيق في وضع التطوير
- [ ] مراجعة الكود والتعليقات
- [ ] تحديث الوثائق
- [ ] إزالة console.log غير الضرورية

## 🧪 الاختبار قبل النشر

### 1. اختبار يدوي
```bash
# تشغيل في وضع التطوير
npm run dev

# اختبار الميزات الأساسية:
# - تحميل الفيديو
# - إضافة كابشنات
# - تطبيق أدوات
# - التصدير
```

### 2. اختبار البناء
```bash
# بناء التطبيق
npm run build:electron

# تشغيل الملف الناتج
# Windows: dist/QuranVideoEditor-Setup-{version}.exe
# تثبيت واختبار جميع الميزات
```

### 3. اختبار على أنظمة مختلفة
- Windows 10/11
- macOS 10.13+
- Ubuntu 20.04+

## 📦 تحسين حجم الملف

### 1. تصغير الكود
```javascript
// vite.config.js
export default defineConfig({
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true
      }
    }
  }
});
```

### 2. تقسيم الحزم
```javascript
rollupOptions: {
  output: {
    manualChunks: {
      'react-vendor': ['react', 'react-dom'],
      'video-vendor': ['react-player']
    }
  }
}
```

### 3. ضغط الأصول
- استخدام صور محسنة
- ضغط الخطوط
- إزالة الملفات غير المستخدمة

## 🚀 النشر

### 1. إنشاء Release على GitHub

```bash
# إنشاء tag
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0

# رفع الملفات
# اذهب إلى GitHub Releases
# أنشئ release جديد
# ارفع ملفات التوزيع
```

### 2. توليد Checksums

```bash
# Windows
certutil -hashfile QuranVideoEditor-Setup-1.0.0.exe SHA256

# macOS/Linux
shasum -a 256 QuranVideoEditor-1.0.0.dmg
```

### 3. كتابة Release Notes

```markdown
## What's New
- Feature 1
- Feature 2
- Bug fixes

## Downloads
- Windows: QuranVideoEditor-Setup-1.0.0.exe
- macOS: QuranVideoEditor-1.0.0.dmg
- Linux: QuranVideoEditor-1.0.0.AppImage

## Checksums
SHA256:
- Windows: abc123...
- macOS: def456...
```

## 🔄 التحديثات التلقائية (مستقبلاً)

### electron-updater

```javascript
// main.js
const { autoUpdater } = require('electron-updater');

app.on('ready', () => {
  autoUpdater.checkForUpdatesAndNotify();
});

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall();
});
```

## 📊 مراقبة الأداء

### تقليل حجم البناء

```bash
# تحليل حجم الحزم
npm run build:renderer
npx vite-bundle-visualizer

# تحليل حجم Electron
npx electron-builder --dir
```

## ⚠️ مشاكل شائعة

### المشكلة: FFmpeg لا يتم تضمينه

**الحل:**
```yaml
# electron-builder.yml
extraResources:
  - from: public/ffmpeg
    to: ffmpeg
```

### المشكلة: الأيقونة لا تظهر

**الحل:**
- تأكد من وجود الأيقونة بالصيغة الصحيحة
- Windows: .ico (256x256)
- macOS: .icns
- Linux: .png (512x512)

### المشكلة: البناء يفشل على macOS

**الحل:**
```bash
# تثبيت Xcode Command Line Tools
xcode-select --install

# إعادة البناء
npm run build:electron
```

## 🎨 تخصيص المثبت

### Windows (NSIS)

```yaml
nsis:
  oneClick: false
  allowToChangeInstallationDirectory: true
  createDesktopShortcut: true
  createStartMenuShortcut: true
  installerIcon: public/icons/icon.ico
  uninstallerIcon: public/icons/icon.ico
```

### macOS (DMG)

```yaml
dmg:
  contents:
    - x: 130
      y: 220
    - x: 410
      y: 220
      type: link
      path: /Applications
  background: public/icons/background.png
```

## 📝 قائمة ملفات التوزيع

بعد البناء الناجح، ستحصل على:

### Windows
```
dist/
├── QuranVideoEditor-Setup-1.0.0.exe        (Installer)
├── QuranVideoEditor-1.0.0-win.zip          (Portable)
└── builder-effective-config.yaml           (Build config)
```

### macOS
```
dist/
├── QuranVideoEditor-1.0.0.dmg              (Installer)
├── QuranVideoEditor-1.0.0-mac.zip          (Archive)
└── mac/                                    (App bundle)
```

### Linux
```
dist/
├── QuranVideoEditor-1.0.0.AppImage         (Universal)
├── QuranVideoEditor_1.0.0_amd64.deb        (Debian/Ubuntu)
└── QuranVideoEditor-1.0.0.x86_64.rpm       (Fedora/RedHat)
```

## 🔐 التوقيع الرقمي (مستقبلاً)

### Windows Code Signing
```yaml
win:
  certificateFile: cert.pfx
  certificatePassword: ${env.CERT_PASSWORD}
```

### macOS Code Signing
```yaml
mac:
  identity: "Developer ID Application: Your Name (TEAM_ID)"
```

## 📈 المتابعة بعد النشر

1. **مراقبة التحميلات** على GitHub Releases
2. **متابعة التقارير** عن الأخطاء
3. **جمع الملاحظات** من المستخدمين
4. **تخطيط التحديثات** القادمة

---

**النسخة:** 1.0.0  
**آخر تحديث:** 2024-01-31
