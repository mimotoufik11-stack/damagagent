# دليل التثبيت التفصيلي
# Detailed Installation Guide

<div dir="rtl">

## المتطلبات الأساسية

### 1. تثبيت Node.js
- قم بتحميل Node.js 18 أو أحدث من: https://nodejs.org/
- تأكد من التثبيت بكتابة الأمر التالي في Terminal/CMD:
```bash
node --version
npm --version
```

### 2. تحميل المشروع

#### الطريقة الأولى: استنساخ من Git
```bash
git clone https://github.com/your-repo/quran-video-editor.git
cd quran-video-editor
```

#### الطريقة الثانية: تحميل ZIP
1. حمّل المشروع كملف ZIP
2. فك الضغط عن الملف
3. افتح Terminal/CMD في مجلد المشروع

### 3. تثبيت المكتبات

```bash
npm install
```

سيقوم هذا الأمر بتثبيت جميع المكتبات المطلوبة تلقائياً.

### 4. تحميل FFmpeg (مهم جداً!)

FFmpeg مطلوب لمعالجة الفيديو. اتبع الخطوات التالية:

#### لنظام Windows:

1. **تحميل FFmpeg:**
   - زر الموقع: https://www.gyan.dev/ffmpeg/builds/
   - حمّل: `ffmpeg-release-essentials.zip`
   - أو: https://github.com/BtbN/FFmpeg-Builds/releases

2. **استخراج الملفات:**
   - فك الضغط عن الملف المحمل
   - ابحث عن المجلد `bin` داخل الملف المستخرج
   - انسخ الملفات التالية:
     - `ffmpeg.exe`
     - `ffprobe.exe`

3. **وضع الملفات:**
   - انسخ الملفات إلى مجلد `public/ffmpeg/` في المشروع
   - يجب أن يكون المسار الكامل:
     ```
     quran-video-editor/public/ffmpeg/ffmpeg.exe
     quran-video-editor/public/ffmpeg/ffprobe.exe
     ```

#### لنظام macOS:

```bash
# باستخدام Homebrew
brew install ffmpeg
```

#### لنظام Linux:

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install ffmpeg

# Fedora
sudo dnf install ffmpeg

# Arch Linux
sudo pacman -S ffmpeg
```

### 5. تحميل الخطوط العربية (اختياري)

لأفضل دعم للخطوط العربية، حمّل الخطوط التالية:

1. **Amiri Quran:**
   - https://fonts.google.com/specimen/Amiri+Quran
   - حمّل الخط وضعه في `public/fonts/`

2. **Cairo:**
   - https://fonts.google.com/specimen/Cairo
   - حمّل الخط وضعه في `public/fonts/`

3. **Noto Sans Arabic:**
   - https://fonts.google.com/noto/specimen/Noto+Sans+Arabic
   - حمّل الخط وضعه في `public/fonts/`

## التشغيل

### وضع التطوير

```bash
npm run dev
```

سيفتح التطبيق تلقائياً في نافذة Electron.

### بناء التطبيق للإنتاج

#### بناء لنظام Windows فقط:
```bash
npm run build:electron
```

#### بناء لجميع الأنظمة:
```bash
npm run build:all
```

#### بناء واجهة React فقط:
```bash
npm run build:renderer
```

## الملفات الناتجة

بعد البناء، ستجد الملفات في مجلد `dist/`:

### Windows:
- `QuranVideoEditor-Setup-{version}.exe` - ملف التثبيت
- حجم الملف: ~150-200 MB (يتضمن FFmpeg)

### macOS:
- `QuranVideoEditor-{version}.dmg`

### Linux:
- `QuranVideoEditor-{version}.AppImage`
- `QuranVideoEditor-{version}.deb`

## حل المشاكل الشائعة

### المشكلة: `npm install` يفشل

**الحل:**
```bash
# احذف المجلد والملف
rm -rf node_modules package-lock.json

# أعد التثبيت
npm install
```

### المشكلة: FFmpeg لا يعمل

**الحل:**
1. تأكد من وضع `ffmpeg.exe` و `ffprobe.exe` في المجلد الصحيح
2. تأكد من أن الملفات قابلة للتنفيذ
3. جرّب تشغيل FFmpeg مباشرة من Terminal:
```bash
./public/ffmpeg/ffmpeg.exe -version
```

### المشكلة: التطبيق لا يبدأ

**الحل:**
1. تأكد من تثبيت جميع المكتبات: `npm install`
2. احذف مجلد `build/` وأعد البناء: `npm run build`
3. تحقق من سجلات الأخطاء في Console

### المشكلة: الخطوط العربية لا تظهر

**الحل:**
1. تأكد من تحميل الخطوط ووضعها في `public/fonts/`
2. أعد تشغيل التطبيق
3. تحقق من إعدادات الخط في محرر الكابشنات

### المشكلة: البناء يفشل على Windows

**الحل:**
```bash
# استخدم PowerShell كمسؤول
npm install --global windows-build-tools

# ثم أعد البناء
npm run build:electron
```

### المشكلة: الفيديو لا يتم تصديره

**الحل:**
1. تحقق من وجود مساحة كافية على القرص
2. تأكد من أن FFmpeg مثبت بشكل صحيح
3. جرّب تصدير فيديو قصير أولاً
4. تحقق من سجلات الأخطاء

## الدعم الفني

إذا واجهت أي مشاكل:

1. تحقق من قسم [Issues](https://github.com/your-repo/quran-video-editor/issues)
2. ابحث عن مشكلة مشابهة
3. إذا لم تجد حلاً، افتح Issue جديد

### معلومات مطلوبة عند فتح Issue:

- نظام التشغيل والإصدار
- إصدار Node.js: `node --version`
- إصدار npm: `npm --version`
- رسالة الخطأ الكاملة
- خطوات إعادة إنتاج المشكلة

## الخطوات التالية

بعد التثبيت الناجح:
1. اقرأ [دليل الاستخدام](README.md#-دليل-الاستخدام)
2. جرّب الأمثلة الموجودة
3. استكشف الميزات المختلفة

---

حظاً موفقاً! 🚀

</div>
