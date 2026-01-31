# معمارية التطبيق | Application Architecture

## نظرة عامة

محرر فيديو القرآن الكريم هو تطبيق سطح مكتب مبني على Electron مع React للواجهة الأمامية و FFmpeg لمعالجة الفيديو.

## البنية العامة

```
┌─────────────────────────────────────────┐
│         Electron Main Process           │
│  (Node.js Backend + System Access)      │
│                                          │
│  ┌──────────────┐   ┌──────────────┐    │
│  │   FFmpeg     │   │  File System │    │
│  │  Integration │   │    Access    │    │
│  └──────────────┘   └──────────────┘    │
└─────────────────────────────────────────┘
              ↕ IPC Communication
┌─────────────────────────────────────────┐
│      Electron Renderer Process          │
│        (React Application)              │
│                                          │
│  ┌──────────┐  ┌──────────┐  ┌───────┐ │
│  │  Pages   │  │Components│  │Services│ │
│  └──────────┘  └──────────┘  └───────┘ │
└─────────────────────────────────────────┘
```

## مكونات النظام

### 1. Electron Main Process (main.js)

**المسؤوليات:**
- إدارة دورة حياة التطبيق
- إنشاء النوافذ
- التعامل مع نظام الملفات
- تنفيذ أوامر FFmpeg
- التواصل مع Renderer Process عبر IPC

**الوظائف الرئيسية:**
```javascript
- createWindow() // إنشاء النافذة الرئيسية
- getFFmpegPath() // الحصول على مسار FFmpeg
- executeFFmpeg() // تنفيذ أوامر FFmpeg
- IPC Handlers // معالجات الاتصال
```

### 2. Preload Script (preload.js)

**الهدف:**
- جسر آمن بين Main و Renderer
- توفير APIs محدودة وآمنة
- منع الوصول المباشر لـ Node.js APIs

**APIs المكشوفة:**
```javascript
window.electronAPI = {
  // Dialog APIs
  openFileDialog()
  saveFileDialog()
  
  // File System APIs
  readFile()
  writeFile()
  fileExists()
  
  // FFmpeg APIs
  executeFFmpeg()
  executeFFprobe()
  
  // Path APIs
  joinPath()
  getDirname()
}
```

### 3. React Application (src/)

#### 3.1 Pages

**Home.jsx**
- الصفحة الرئيسية
- رفع الفيديو
- عرض الميزات
- الانتقال للمحرر

**Editor.jsx**
- المحرر الرئيسي
- إدارة حالة المشروع
- تنسيق المكونات
- معالجة التصدير

**ProjectManager.jsx**
- إدارة المشاريع
- عرض قائمة المشاريع
- حذف وإعادة تسمية المشاريع

#### 3.2 Components

**VideoPlayer.jsx**
- عرض الفيديو
- التحكم في التشغيل
- عرض الكابشنات
- التزامن مع Timeline

**CaptionEditor.jsx**
- إضافة وتحرير الكابشنات
- تخصيص الأنماط
- استخراج النصوص
- عرض قائمة الكابشنات

**ToolsPanel.jsx**
- عرض أدوات التحرير
- إعدادات الأدوات
- تطبيق التعديلات

**EffectsPanel.jsx**
- التأثيرات البصرية
- ضبط القيم
- معاينة التأثيرات

**Timeline.jsx**
- الخط الزمني
- عرض الكابشنات
- التنقل في الفيديو
- Drag & Drop

**ExportDialog.jsx**
- إعدادات التصدير
- اختيار الصيغة والجودة
- بدء عملية التصدير

**VideoUpload.jsx**
- رفع ملفات الفيديو
- Drag & Drop
- التحقق من الملفات

#### 3.3 Services

**ffmpegService.js**
```javascript
class FFmpegService {
  // تهيئة FFmpeg
  initialize()
  
  // الحصول على معلومات الفيديو
  getVideoMetadata(videoPath)
  
  // عمليات التحرير
  trimVideo()
  cropVideo()
  changeResolution()
  adjustVolume()
  
  // التأثيرات
  applyBrightness()
  applyContrast()
  applySaturation()
  
  // تنفيذ الأوامر
  executeFFmpeg(args, onProgress)
}
```

**videoService.js**
```javascript
class VideoService {
  // تصدير الفيديو
  exportVideo({ inputPath, captions, exportSettings })
  
  // تطبيق الأدوات
  applyTool(videoPath, tool, settings)
  
  // تطبيق التأثيرات
  applyEffect(videoPath, effect, settings)
}
```

**whisperService.js**
```javascript
class WhisperService {
  // استخراج الكابشنات
  extractCaptions(videoPath)
  
  // استخراج الصوت
  extractAudio(videoPath, outputPath)
  
  // حفظ النسخ النصي
  saveTranscription(captions, outputPath)
}
```

**storageService.js**
```javascript
class StorageService {
  // حفظ المشروع
  saveProject(project)
  
  // تحميل المشاريع
  getAllProjects()
  getProject(projectId)
  
  // حذف المشروع
  deleteProject(projectId)
}
```

#### 3.4 Utils

**constants.js**
- الثوابت والإعدادات
- قوائم الخيارات
- القيم الافتراضية

**helpers.js**
- دوال مساعدة
- تنسيق البيانات
- معالجة الوقت

**validators.js**
- التحقق من المدخلات
- قواعد التحقق
- رسائل الخطأ

## تدفق البيانات

### 1. تحميل الفيديو
```
User Action → VideoUpload Component
    ↓
File Dialog (Electron API)
    ↓
File Path → Editor State
    ↓
FFprobe (Get Metadata)
    ↓
Display Video in Player
```

### 2. إضافة كابشن
```
User Input → CaptionEditor
    ↓
Validate Caption Data
    ↓
Add to Captions Array (State)
    ↓
Update Timeline Display
    ↓
Sync with Video Player
```

### 3. تصدير الفيديو
```
User Clicks Export → ExportDialog
    ↓
Select Export Settings
    ↓
Generate FFmpeg Command
    ↓
Execute FFmpeg (Main Process)
    ↓
Monitor Progress (IPC)
    ↓
Complete → Show Success Message
```

## إدارة الحالة

### Local State (useState)
- حالة المكونات المحلية
- مدخلات المستخدم المؤقتة

### Context API (مستقبلاً)
- حالة المشروع العامة
- إعدادات التطبيق

### LocalStorage
- حفظ المشاريع
- الإعدادات المستمرة

## الأمان

### Context Isolation
- فصل كامل بين Main و Renderer
- عدم الوصول المباشر لـ Node.js APIs

### Preload Script
- APIs محدودة ومعرفة مسبقاً
- عدم تعرض نظام الملفات مباشرة

### Input Validation
- التحقق من جميع المدخلات
- منع Path Traversal
- تنظيف البيانات

## الأداء

### Optimization Strategies

1. **Code Splitting:**
   - تقسيم الحزم حسب الصفحات
   - تحميل كسول للمكونات

2. **Memoization:**
   - React.memo للمكونات
   - useMemo للحسابات الثقيلة

3. **Virtual Scrolling:**
   - للقوائم الطويلة
   - Timeline optimization

4. **Worker Threads:**
   - معالجة خلفية للمهام الثقيلة
   - عدم حجب UI thread

## التوسع المستقبلي

### Planned Improvements

1. **Redux Integration**
   - إدارة حالة مركزية أفضل
   - DevTools للتطوير

2. **Web Workers**
   - معالجة FFmpeg في الخلفية
   - تحسين الأداء

3. **Database**
   - SQLite للمشاريع الكبيرة
   - بحث أسرع

4. **Plugin System**
   - إضافة مكونات خارجية
   - توسيع الوظائف

5. **Cloud Sync**
   - مزامنة المشاريع
   - Backup تلقائي

## الاختبار

### Unit Tests
- اختبار الدوال المساعدة
- اختبار Services

### Integration Tests
- اختبار تفاعل المكونات
- اختبار IPC Communication

### E2E Tests
- اختبار سير العمل الكامل
- Playwright/Spectron

## البناء والنشر

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build:renderer  # Build React
npm run build:electron  # Build Electron
```

### Release
```bash
npm run build:all  # Build for all platforms
```

## الموارد والمراجع

- [Electron Documentation](https://www.electronjs.org/docs)
- [React Documentation](https://react.dev/)
- [FFmpeg Documentation](https://ffmpeg.org/documentation.html)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

**Version:** 1.0.0  
**Last Updated:** 2024-01-31
