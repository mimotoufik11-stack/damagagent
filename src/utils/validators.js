export const validateVideoPath = (path) => {
  if (!path || typeof path !== 'string') {
    return { valid: false, error: 'مسار الفيديو غير صالح' };
  }
  
  const validExtensions = ['mp4', 'avi', 'mkv', 'mov', 'webm', 'flv', 'wmv'];
  const extension = path.split('.').pop().toLowerCase();
  
  if (!validExtensions.includes(extension)) {
    return { valid: false, error: 'صيغة الفيديو غير مدعومة' };
  }
  
  return { valid: true };
};

export const validateResolution = (width, height) => {
  if (!width || !height || width <= 0 || height <= 0) {
    return { valid: false, error: 'الدقة غير صالحة' };
  }
  
  if (width > 7680 || height > 4320) {
    return { valid: false, error: 'الدقة كبيرة جداً (الحد الأقصى 8K)' };
  }
  
  return { valid: true };
};

export const validateTimeRange = (startTime, endTime, duration) => {
  if (startTime < 0) {
    return { valid: false, error: 'وقت البداية لا يمكن أن يكون سالباً' };
  }
  
  if (endTime <= startTime) {
    return { valid: false, error: 'وقت النهاية يجب أن يكون أكبر من وقت البداية' };
  }
  
  if (duration && endTime > duration) {
    return { valid: false, error: 'وقت النهاية يتجاوز مدة الفيديو' };
  }
  
  return { valid: true };
};

export const validateCropRegion = (x, y, width, height, videoWidth, videoHeight) => {
  if (x < 0 || y < 0) {
    return { valid: false, error: 'إحداثيات الاقتصاص لا يمكن أن تكون سالبة' };
  }
  
  if (width <= 0 || height <= 0) {
    return { valid: false, error: 'أبعاد الاقتصاص يجب أن تكون أكبر من صفر' };
  }
  
  if (x + width > videoWidth || y + height > videoHeight) {
    return { valid: false, error: 'منطقة الاقتصاص تتجاوز حدود الفيديو' };
  }
  
  return { valid: true };
};

export const validateVolume = (volume) => {
  if (typeof volume !== 'number' || volume < 0 || volume > 200) {
    return { valid: false, error: 'مستوى الصوت يجب أن يكون بين 0 و 200' };
  }
  
  return { valid: true };
};

export const validateFps = (fps) => {
  const validFps = [24, 25, 30, 50, 60, 120];
  
  if (!validFps.includes(fps)) {
    return { valid: false, error: 'معدل الإطارات غير مدعوم' };
  }
  
  return { valid: true };
};

export const validateCaption = (caption) => {
  const errors = [];
  
  if (!caption.text || caption.text.trim() === '') {
    errors.push('نص الكابشن مطلوب');
  }
  
  if (typeof caption.startTime !== 'number' || caption.startTime < 0) {
    errors.push('وقت البداية غير صالح');
  }
  
  if (typeof caption.endTime !== 'number' || caption.endTime <= caption.startTime) {
    errors.push('وقت النهاية غير صالح');
  }
  
  if (caption.fontSize && (caption.fontSize < 8 || caption.fontSize > 200)) {
    errors.push('حجم الخط يجب أن يكون بين 8 و 200');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

export const validateExportSettings = (settings) => {
  const errors = [];
  
  if (!settings.format || !['mp4', 'avi', 'mkv', 'mov', 'webm'].includes(settings.format)) {
    errors.push('صيغة التصدير غير صالحة');
  }
  
  if (!settings.outputPath || typeof settings.outputPath !== 'string') {
    errors.push('مسار الإخراج غير صالح');
  }
  
  const resolutionMatch = settings.resolution?.match(/^(\d+)x(\d+)$/);
  if (!resolutionMatch) {
    errors.push('دقة التصدير غير صالحة');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

export const validateProjectName = (name) => {
  if (!name || typeof name !== 'string') {
    return { valid: false, error: 'اسم المشروع مطلوب' };
  }
  
  if (name.trim().length === 0) {
    return { valid: false, error: 'اسم المشروع لا يمكن أن يكون فارغاً' };
  }
  
  if (name.length > 100) {
    return { valid: false, error: 'اسم المشروع طويل جداً (الحد الأقصى 100 حرف)' };
  }
  
  const invalidChars = /[<>:"/\\|?*]/;
  if (invalidChars.test(name)) {
    return { valid: false, error: 'اسم المشروع يحتوي على أحرف غير صالحة' };
  }
  
  return { valid: true };
};
