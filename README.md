# دماج للقرآن الكريم (Dammaj Al-Quran)

## Professional Quran Video Editing Studio

<div align="center">

![Dammaj Al-Quran](https://img.shields.io/badge/Version-1.0.0-green)
![License](https://img.shields.io/badge/License-MIT-blue)
![React](https://img.shields.io/badge/React-18.2-61dafb)
![Electron](https://img.shields.io/badge/Electron-28.0-47848F)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688)

</div>

## 📖 نظرة عامة

دماج للقرآن الكريم هو استوديو مونتاج فيديو احترافي متخصص في إنتاج المحتوى القراني. يجمع التطبيق بين قوة التحرير المتقدم وأدوات الذكاء الاصطناعي لإنشاء مشاريع قرآنية متميزة.

## ✨ المميزات

### 🎬 التحرير
- **جدول زمني متعدد المسارات** - 支持 6+ مسارات للفيديو والصوت والترجمات
- **قص وتعديل** - أدوات سهلة لقص المقاطع
- **سحب وإفلات** - واجهة بديهية لإدارة المقاطع
- **معاينة فورية** - عرض فيديو في الوقت الفعلي

### 🤖 الذكاء الاصطناعي
- **نسخ صوتي** - تحويل الصوت إلى نص باستخدام Whisper
- **ترجمات تلقائية** - إنشاء ترجمات ذكية
- **دبلجة صوتية** - إنتاج صوتي باستخدام Coqui TTS
- **إزالة الضوضاء** - تنظيف الصوت الخلفية
- **تعرف على الآيات** - تحديد الآيات القرآنية تلقائياً

### ☪️ دعم القرآن
- **خطوط قرآنية** - دعم خطوط مخصصة للقرآن
- **مزامنة الآيات** - ربط النص بالصوت
- **تصدير SRT** - حفظ الترجمات بصيغة قياسية

### 📤 التصدير
- **دقة متعددة** - 720p, 1080p, 4K
- **جودة متدرجة** - منخفضة, متوسطة, عالية, فائقة
- **صيغ متنوعة** - MP4, WebM, MOV

## 🛠️ التقنيات

### الواجهة الأمامية
- **Electron** - تطبيق سطح مكتب
- **React 18** - واجهة المستخدم
- **TypeScript** - أمان الأنواع
- **Zustand** - إدارة الحالة
- **CSS Modules** - تنسيق الأنماط

### الخادم الخلفي
- **FastAPI** - إطار عمل Python
- **SQLAlchemy** - قاعدة البيانات
- **Whisper** - نسخ صوتي
- **Coqui TTS** - تحويل نص لصوت
- **FFmpeg** - معالجة الفيديو

## 📦 التثبيت

### المتطلبات
- Node.js 18+
- Python 3.10+
- FFmpeg

### التثبيت السريع

```bash
# استنساخ المشروع
git clone https://github.com/your-repo/dammaj-al-quran.git
cd dammaj-al-quran

# تثبيتdependences للواجهة الأمامية
npm install

# تثبيت dependences للخادم الخلفي
cd backend
pip install -r requirements.txt

# تشغيل التطبيق
npm run dev
```

## 📁 هيكل المشروع

```
dammaj-al-quran/
├── src/
│   ├── frontend/
│   │   ├── main/          # Electron main process
│   │   ├── preload/       # Preload scripts
│   │   └── renderer/      # React application
│   │       ├── components/  # UI components
│   │       ├── pages/        # Page components
│   │       ├── stores/       # Zustand stores
│   │       ├── services/     # API services
│   │       ├── styles/       # CSS styles
│   │       └── utils/        # Utilities
│   ├── backend/
│   │   ├── app/
│   │   │   ├── api/         # API routers
│   │   │   ├── core/        # Core configuration
│   │   │   ├── db/          # Database models
│   │   │   ├── models/      # SQLAlchemy models
│   │   │   ├── services/    # Business logic
│   │   │   └── schemas/     # Pydantic schemas
│   │   └── scripts/         # Utility scripts
│   └── shared/
│       ├── types/          # Shared TypeScript types
│       └── constants/      # Shared constants
├── config/                  # Configuration files
├── docs/                    # Documentation
└── scripts/                 # Build scripts
```

## 🚀 الاستخدام

### إنشاء مشروع جديد
1. انقر على "مشروع جديد"
2. أدخل اسم المشروع
3. اختر الدقة وعدد الإطارات
4. انقر "إنشاء"

### استيراد الوسائط
1. اسحب الملفات إلى المكتبة أو
2. انقر على زر الاستيراد
3. حدد ملفات الفيديو/الصوت

### التحرير على الجدول الزمني
1. اسحب المقاطع من المكتبة
2. قص المقاطع بالسحب من الأطراف
3. أضف ترجمات على مسار الترجمات
4. استخدم لوحة الخصائص للتعديلات

### التصدير
1. انقر على "تصدير"
2. اختر الصيغة والجودة
3. انقر "تصدير"

## ⌨️ اختصارات لوحة المفاتيح

| الاختصار | الوظيفة |
|---------|---------|
| Space | تشغيل/إيقاف |
| Ctrl+Z | تراجع |
| Ctrl+Y | إعادة |
| Delete | حذف المحدد |
| A | اختيار الكل |
| Escape | إلغاء الاختيار |

## 📚 الوثائق

- [دليل المستخدم](docs/USER_GUIDE.md)
- [دليل المطور](docs/DEVELOPER_GUIDE.md)
- [وثائق API](docs/API_ENDPOINTS.md)
- [إعداد البيئة](docs/SETUP_GUIDE.md)

## 🤝 المساهمة

نرحب بمساهماتكم! يرجى قراءة [دليل المساهمة](docs/CONTRIBUTING.md) للمزيد من المعلومات.

## 📄 الترخيص

هذا المشروع مرخص تحت MIT License - راجع [LICENSE](LICENSE) للمزيد من التفاصيل.

## 📞 التواصل

- **البريد الإلكتروني**: support@dammaj.com
- **الموقع**: https://dammaj.com

---

<div align="center">

**جميع الحقوق محفوظة © 2024 دماج للقرآن الكريم**

</div>
