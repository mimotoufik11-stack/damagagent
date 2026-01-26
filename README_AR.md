# دماج للقرآن الكريم (Dammaj Al-Quran)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)](https://www.python.org/downloads/)
[![React](https://img.shields.io/badge/React-18.2+-61dafb.svg)](https://reactjs.org/)
[![Electron](https://img.shields.io/badge/Electron-27.0+-47848f.svg)](https://electronjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-009688.svg)](https://fastapi.tiangolo.com/)

## نظرة عامة

**دماج للقرآن الكريم** هو تطبيق استوديو فيديو احترافي مصمم خصيصاً لإنشاء فيديوهات قرآنية عالية الجودة مع طباعة عربية متطورة ومعالجة صوتية متقدمة وميزات مدعومة بالذكاء الاصطناعي. مبني باستخدام Electron وReact وFastAPI، يوفر حلاً شاملاً للحواسيب المكتبية لمنتجي المحتوى الإسلامي.

## 🌟 المميزات الرئيسية

### 🎬 محرر فيديو احترافي
- **تحرير قائم على الجدول الزمني** مع دعم متعدد المسارات
- **معاينة في الوقت الفعلي** مع تسريع الأجهزة
- **انتقالات ومؤثرات احترافية**
- **دعم تصدير 4K/8K**
- **دمج الترجمات** مع تنسيقات متعددة

### 🎵 معالجة صوتية متقدمة
- **تركيب صوتي مدعوم بالذكاء الاصطناعي** (تحويل النص إلى كلام)
- **نسخ تلقائي** باستخدام OpenAI Whisper
- **تطبيع الصوت** وتقليل الضوضاء
- **دعم تنسيقات صوتية متعددة** (MP3, WAV, FLAC, OGG)

### 📝 الطباعة العربية ودعم RTL
- **خطوط عربية جميلة** مع التشكيل المناسب
- **عرض نصي RTL** مع محاذاة مثالية
- **إدارة خطوط مخصصة** مع نظام المعاينة
- **دمج الخط الإسلامي**
- **أنماط وتخطيطات نصية عربية متعددة**

### 🤖 دمج الذكاء الاصطناعي
- **Whisper ASR** للنسخ التلقائي للصوت
- **تحويل النص إلى كلام** بأصوات عربية طبيعية
- **إنشاء ترجمات تلقائي**
- **تحسين فيديو مدعوم بالذكاء الاصطناعي**
- **تحليل ذكي للمحتوى**

### 📊 إدارة المشاريع
- **نظام قوالب** لإنشاء مشاريع سريعة
- **التحكم في الإصدارات** للمشاريع
- **مزامنة سحابية** جاهزة
- **إعدادات تصدير** لمنصات مختلفة
- **قدرات المعالجة الدفعية**

## 🏗️ الهيكل المعماري

```
dammaj-quran/
├── frontend/           # تطبيق سطح المكتب Electron + React
│   ├── src/main/       # عملية Electron الرئيسية
│   ├── src/renderer/   # واجهة React
│   └── dist/           # التطبيق المبني
├── backend/            # خادم FastAPI
│   ├── app/            # منطق التطبيق
│   ├── ml_models/      # نماذج الذكاء الاصطناعي والمعالجة
│   └── tests/          # اختبارات الخلفية
├── docs/               # التوثيق
├── scripts/            # نصوص الإعداد والبناء
└── docker/             # تكوين Docker
```

## 🚀 البدء السريع

### المتطلبات المسبقة
- **Node.js** 18+
- **Python** 3.9+
- **FFmpeg** 4.0+
- **Git**

### التثبيت

1. **استنساخ المستودع**
```bash
git clone https://github.com/mimotoufik11-stack/-dammaj-quran.git
cd dammaj-quran
```

2. **إعداد التطبيق**
```bash
# جعل نص الإعداد قابل للتنفيذ
chmod +x scripts/setup.sh

# تشغيل الإعداد الكامل
./scripts/setup.sh
```

3. **تشغيل التطبيق**
```bash
# تشغيل الواجهة الأمامية والخلفية
npm run start

# أو تشغيل منفصل
npm run dev:frontend  # الواجهة الأمامية فقط
npm run dev:backend   # الخلفية فقط
```

### إعداد Docker

```bash
# بناء وتشغيل باستخدام Docker Compose
docker-compose up --build

# النشر للإنتاج
docker-compose -f docker-compose.prod.yml up -d
```

## 📚 التوثيق

| الوثيقة | الوصف | اللغة |
|----------|-------------|----------|
| [دليل التثبيت](docs/INSTALLATION.md) | تعليمات الإعداد الكاملة | EN |
| [دليل المستخدم](docs/USER_GUIDE.md) | كيفية استخدام التطبيق | EN |
| [دليل المستخدم](docs/USER_GUIDE_AR.md) | دليل شامل للاستخدام | AR |
| [دليل المطور](docs/DEVELOPER_GUIDE.md) | توثيق التطوير | EN |
| [توثيق API](docs/API_ENDPOINTS.md) | مرجع API كامل | EN |
| [المعمارية](docs/ARCHITECTURE.md) | معمارية النظام | EN |

## 🛠️ التطوير

### تطوير الواجهة الأمامية
```bash
cd frontend
npm install
npm run dev:react      # بدء خادم تطوير React
npm run build:react     # بناء تطبيق React
npm test               # تشغيل اختبارات الواجهة الأمامية
```

### تطوير الخلفية
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### إعداد نماذج الذكاء الاصطناعي
```bash
# تحميل نماذج الذكاء الاصطناعي المطلوبة
python scripts/download-models.py
```

## 🎯 حالات الاستخدام

### منتجو المحتوى
- إنشاء فيديوهات تلاوة قرآنية احترافية
- إنشاء محتوى تعليمي إسلامي
- إنتاج فيديوهات الطباعة العربية الجميلة
- تصميم عروض تقديمية وإنيميشن إسلامية

### المساجد والمراكز الإسلامية
- جلسات دراسة قرآنية أسبوعية
- ندوات تعليمية
- إعلانات المجتمع
- تسجيلات الأحداث مع ترجمة

### المدارس والجامعات الإسلامية
- فيديوهات منهج القرآن
- مواد تعليمية تفاعلية
- تسجيلات التقييم
- عروض تقديمية بحثية

## 🔧 التكوين

### متغيرات البيئة
```bash
# تكوين الخلفية
DATABASE_URL=postgresql://user:pass@localhost/dammaj_quran
SECRET_KEY=your-secret-key
OPENAI_API_KEY=your-openai-key

# نماذج الذكاء الاصطناعي
WHISPER_MODEL=base
TTS_VOICE=ar-XA-Wavenet-A
```

### التنسيقات المدعومة

#### تنسيقات الإدخال
- **فيديو**: MP4, AVI, MOV, MKV, WebM
- **صوت**: MP3, WAV, FLAC, OGG, M4A
- **صور**: PNG, JPG, JPEG, WebP, SVG
- **نص**: TXT, SRT, VTT, ASS

#### تنسيقات الإخراج
- **فيديو**: MP4 (H.264/H.265), WebM
- **صوت**: MP3, WAV, AAC
- **ترجمة**: SRT, VTT, ASS

## 🤝 المساهمة

1. استنساخ المستودع
2. إنشاء فرع ميزة (`git checkout -b feature/amazing-feature`)
3. تنفيذ التغييرات (`git commit -m 'Add amazing feature'`)
4. دفع الفرع (`git push origin feature/amazing-feature`)
5. فتح Pull Request

### إرشادات التطوير
- اتباع نمط الكود الموجود
- كتابة اختبارات شاملة
- تحديث التوثيق
- ضمان دعم العربية/RTL
- اختبار مع تسجيلات قرآنية مختلفة

## 📝 الترخيص

هذا المشروع مرخص تحت رخصة MIT - انظر ملف [LICENSE](LICENSE) للتفاصيل.

## 🙏 الشكر والتقدير

- **Quran.com API** لنص القرآن والترجمات
- **OpenAI Whisper** للنسخ التلقائي للصوت
- **FFmpeg** لقدرات معالجة الفيديو
- **مجتمع الطباعة العربية** لموارد الخطوط
- **العلماء الإسلاميون** للتحقق من المحتوى

## 📞 الدعم

- **المشاكل**: [GitHub Issues](https://github.com/mimotoufik11-stack/-dammaj-quran/issues)
- **النقاشات**: [GitHub Discussions](https://github.com/mimotoufik11-stack/-dammaj-quran/discussions)
- **البريد الإلكتروني**: support@dammaj-quran.com

## 🗺️ خارطة الطريق

- [ ] **تطبيق محمول** (React Native)
- [ ] **إصدار ويب** (PWA)
- [ ] **دمج سحابي** (AWS/GCP)
- [ ] **ميزات ذكاء اصطناعي متقدمة**
- [ ] **تحرير تعاوني**
- [ ] **دمج البث المباشر**
- [ ] **نظام إضافات**
- [ ] **دعم متعدد اللغات**

---

<div align="center">

**صُنع بحب ❤️ للأمة**

*بسم الله الرحمن الرحيم*

[الموقع](https://dammaj-quran.com) | [التوثيق](docs/) | [API](docs/API_ENDPOINTS.md)

</div>