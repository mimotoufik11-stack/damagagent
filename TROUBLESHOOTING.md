# دليل حل المشاكل | Troubleshooting Guide

<div dir="rtl">

## 🔧 مشاكل التثبيت

### المشكلة: `npm install` يفشل

**السبب المحتمل:**
- اتصال إنترنت ضعيف
- نسخة Node.js قديمة
- مشاكل في الصلاحيات

**الحل:**
```bash
# 1. تحديث npm
npm install -g npm@latest

# 2. حذف cache
npm cache clean --force

# 3. حذف node_modules
rm -rf node_modules package-lock.json

# 4. إعادة التثبيت
npm install
```

### المشكلة: خطأ في صلاحيات npm (Permission Error)

**الحل (Linux/macOS):**
```bash
# استخدم nvm بدلاً من sudo
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install node
```

**الحل (Windows):**
```powershell
# شغّل PowerShell كمسؤول
npm install -g npm@latest
```

### المشكلة: Module not found

**الحل:**
```bash
npm install
# أو إذا فشل
npm install --force
```

## 🎬 مشاكل FFmpeg

### المشكلة: FFmpeg not found

**الأعراض:**
- رسالة خطأ: "FFmpeg is not installed"
- عدم القدرة على معالجة الفيديو

**الحل:**

**Windows:**
```bash
# 1. حمّل FFmpeg من:
https://www.gyan.dev/ffmpeg/builds/

# 2. استخرج ffmpeg.exe و ffprobe.exe

# 3. ضعهما في:
public/ffmpeg/ffmpeg.exe
public/ffmpeg/ffprobe.exe

# 4. تحقق من التثبيت:
./public/ffmpeg/ffmpeg.exe -version
```

**macOS:**
```bash
# باستخدام Homebrew
brew install ffmpeg

# تحقق من التثبيت
ffmpeg -version
```

**Linux:**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install ffmpeg

# تحقق من التثبيت
ffmpeg -version
```

### المشكلة: FFmpeg command failed

**الأعراض:**
- فشل في معالجة الفيديو
- رسالة خطأ من FFmpeg

**الحل:**
1. تحقق من صلاحيات الملفات
2. تأكد من وجود مساحة كافية
3. جرّب ملف فيديو آخر
4. تحقق من سجلات الأخطاء

### المشكلة: FFprobe cannot read file

**الحل:**
```bash
# تحقق من صحة ملف الفيديو
ffprobe video.mp4

# إذا كان الملف تالفاً، جرّب إصلاحه
ffmpeg -i video.mp4 -c copy video_fixed.mp4
```

## 🖥️ مشاكل التطبيق

### المشكلة: التطبيق لا يبدأ

**الحل:**

**Windows:**
```bash
# 1. حذف ملفات البناء
rmdir /s /q build dist

# 2. إعادة البناء
npm run build
npm run dev
```

**macOS/Linux:**
```bash
# 1. حذف ملفات البناء
rm -rf build dist

# 2. إعادة البناء
npm run build
npm run dev
```

### المشكلة: شاشة سوداء عند التشغيل

**السبب:**
- مشكلة في بناء React
- مشكلة في تحميل الملفات

**الحل:**
```bash
# 1. افتح DevTools في Electron
# اضغط F12 أو Ctrl+Shift+I

# 2. تحقق من الأخطاء في Console

# 3. إعادة بناء React
npm run build:renderer
```

### المشكلة: الأيقونات لا تظهر

**الحل:**
```bash
# تأكد من تثبيت react-icons
npm install react-icons

# إعادة التشغيل
npm run dev
```

## 🎥 مشاكل الفيديو

### المشكلة: الفيديو لا يتم تحميله

**الأسباب المحتملة:**
- صيغة غير مدعومة
- ملف تالف
- حجم كبير جداً

**الحل:**
1. **تحقق من الصيغة:**
   ```
   الصيغ المدعومة: MP4, AVI, MKV, MOV, WebM
   ```

2. **تحويل الصيغة:**
   ```bash
   ffmpeg -i input.flv -c copy output.mp4
   ```

3. **تقليل الحجم:**
   ```bash
   ffmpeg -i input.mp4 -vcodec h264 -acodec aac output.mp4
   ```

### المشكلة: المعاينة بطيئة أو متقطعة

**الحل:**
1. **تقليل الدقة مؤقتاً**
2. **إغلاق البرامج الأخرى**
3. **زيادة ذاكرة الوصول العشوائي**
4. **استخدام SSD بدل HDD**

### المشكلة: الصوت غير متزامن

**الحل:**
```bash
# إعادة مزامنة الصوت مع الفيديو
ffmpeg -i input.mp4 -itsoffset 0.5 -i input.mp4 -map 0:v -map 1:a -c copy output.mp4
```

## 📝 مشاكل الكابشنات

### المشكلة: الكابشنات لا تظهر

**الحل:**
1. **تحقق من التوقيت:**
   - startTime < currentTime < endTime

2. **تحقق من اللون:**
   - تأكد من أن اللون مختلف عن خلفية الفيديو

3. **تحقق من حجم الخط:**
   - جرّب حجم أكبر (مثلاً 32px)

### المشكلة: الخط العربي لا يظهر بشكل صحيح

**الحل:**
1. **حمّل خطوط عربية:**
   - Amiri Quran
   - Cairo
   - Noto Sans Arabic

2. **ضع الخطوط في:**
   ```
   public/fonts/
   ```

3. **أعد تشغيل التطبيق**

### المشكلة: استخراج الكابشنات يفشل

**الحل:**
1. **تحقق من الاتصال بالإنترنت**
2. **تأكد من وجود صوت في الفيديو:**
   ```bash
   ffprobe -show_streams video.mp4 | grep audio
   ```

3. **جرّب استخراج الصوت يدوياً:**
   ```bash
   ffmpeg -i video.mp4 -vn -acodec pcm_s16le audio.wav
   ```

## 💾 مشاكل التصدير

### المشكلة: التصدير يفشل

**الأسباب:**
- مساحة قرص غير كافية
- صلاحيات كتابة
- مسار غير صحيح

**الحل:**
1. **تحقق من المساحة:**
   ```bash
   # Windows
   dir

   # macOS/Linux
   df -h
   ```

2. **تحقق من الصلاحيات:**
   - تأكد من أنك تحفظ في مجلد لديك صلاحيات الكتابة فيه

3. **جرّب مسار مختلف:**
   - احفظ في مجلد المستندات

### المشكلة: التصدير بطيء جداً

**الحل:**
1. **قلل الجودة:**
   - اختر "متوسطة" بدل "أفضل جودة"

2. **قلل الدقة:**
   - 720p بدل 1080p للاختبار

3. **استخدم ترميز أسرع:**
   - H.264 بدل H.265

### المشكلة: حجم الملف الناتج كبير جداً

**الحل:**
```bash
# ضغط الفيديو يدوياً
ffmpeg -i input.mp4 -vcodec h264 -crf 28 output.mp4

# CRF: 18-28 (18 = أفضل جودة، 28 = حجم أصغر)
```

## 🔌 مشاكل الأداء

### المشكلة: استهلاك عالي للذاكرة

**الحل:**
1. **أغلق البرامج الأخرى**
2. **قلل دقة المعاينة**
3. **احفظ المشروع وأعد التشغيل**
4. **نظّف ذاكرة التخزين المؤقت**

### المشكلة: التطبيق يتجمد

**الحل:**
1. **انتظر قليلاً** - قد تكون المعالجة جارية
2. **تحقق من Task Manager/Activity Monitor**
3. **أعد تشغيل التطبيق**
4. **احذف المشاريع القديمة**

## 🐛 سجلات الأخطاء

### كيف أجد سجلات الأخطاء؟

**Electron DevTools:**
```javascript
// افتح في التطبيق
اضغط F12 أو Ctrl+Shift+I

// Console سيعرض جميع الأخطاء
```

**سجلات Node.js:**
```bash
# شغّل التطبيق من Terminal
npm run dev

# الأخطاء ستظهر في Terminal
```

### كيف أحفظ سجلات الأخطاء؟

```bash
# Windows PowerShell
npm run dev > log.txt 2>&1

# macOS/Linux
npm run dev > log.txt 2>&1
```

## 🆘 طلب المساعدة

إذا لم تجد حلاً لمشكلتك:

### 1. ابحث في Issues
https://github.com/your-repo/issues

### 2. افتح Issue جديد

**معلومات مطلوبة:**
- نظام التشغيل والإصدار
- نسخة Node.js: `node --version`
- نسخة npm: `npm --version`
- نسخة التطبيق
- خطوات إعادة إنتاج المشكلة
- سجلات الأخطاء
- Screenshots إن أمكن

### 3. راسلنا

**البريد الإلكتروني:**
support@quranvideoeditor.com

**المعلومات المطلوبة:**
- وصف تفصيلي للمشكلة
- ما حاولت فعله
- ماذا حدث فعلياً
- ما هو المتوقع

## 📚 موارد إضافية

- [FAQ](FAQ.md)
- [دليل التثبيت](INSTALLATION.md)
- [الوثائق الكاملة](README.md)
- [API Documentation](API.md)

---

**آخر تحديث:** 2024-01-31

</div>
