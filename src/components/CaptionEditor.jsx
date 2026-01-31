import React, { useState } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiMic, FiType } from 'react-icons/fi';
import { whisperService } from '../services/whisperService';

function CaptionEditor({
  captions,
  selectedCaption,
  currentTime,
  onAddCaption,
  onUpdateCaption,
  onDeleteCaption,
  onSelectCaption
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [newCaption, setNewCaption] = useState({
    text: '',
    startTime: 0,
    endTime: 0,
    fontSize: 24,
    color: '#ffffff',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    bold: false,
    italic: false,
    shadow: true
  });

  const handleStartAdd = () => {
    setNewCaption({
      ...newCaption,
      startTime: currentTime,
      endTime: currentTime + 3
    });
    setIsAdding(true);
  };

  const handleAddSubmit = () => {
    if (!newCaption.text.trim()) {
      alert('يرجى إدخال نص الكابشن');
      return;
    }

    onAddCaption(newCaption);
    setIsAdding(false);
    setNewCaption({
      text: '',
      startTime: 0,
      endTime: 0,
      fontSize: 24,
      color: '#ffffff',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      bold: false,
      italic: false,
      shadow: true
    });
  };

  const handleExtractCaptions = async (videoPath) => {
    setIsExtracting(true);
    try {
      const extractedCaptions = await whisperService.extractCaptions(videoPath);
      extractedCaptions.forEach(caption => onAddCaption(caption));
      alert(`تم استخراج ${extractedCaptions.length} كابشن بنجاح`);
    } catch (error) {
      console.error('Failed to extract captions:', error);
      alert('فشل في استخراج الكابشنات. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsExtracting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      {/* Actions */}
      <div className="space-y-2">
        <button
          onClick={handleStartAdd}
          className="w-full btn-primary flex items-center justify-center gap-2"
        >
          <FiPlus />
          إضافة كابشن
        </button>
        <button
          onClick={() => handleExtractCaptions()}
          disabled={isExtracting}
          className="w-full btn-secondary flex items-center justify-center gap-2"
        >
          <FiMic />
          {isExtracting ? 'جاري الاستخراج...' : 'استخراج من الصوت'}
        </button>
      </div>

      {/* Add/Edit Form */}
      {(isAdding || selectedCaption) && (
        <div className="card space-y-3">
          <h4 className="font-semibold flex items-center gap-2">
            <FiType />
            {isAdding ? 'إضافة كابشن جديد' : 'تحرير الكابشن'}
          </h4>

          <div>
            <label className="block text-sm mb-1">النص</label>
            <textarea
              value={isAdding ? newCaption.text : selectedCaption?.text || ''}
              onChange={(e) => {
                if (isAdding) {
                  setNewCaption({ ...newCaption, text: e.target.value });
                } else if (selectedCaption) {
                  onUpdateCaption(selectedCaption.id, { text: e.target.value });
                }
              }}
              className="input-field w-full h-24 resize-none quran-text"
              placeholder="اكتب النص هنا..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1">وقت البداية (ث)</label>
              <input
                type="number"
                step="0.1"
                value={isAdding ? newCaption.startTime : selectedCaption?.startTime || 0}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (isAdding) {
                    setNewCaption({ ...newCaption, startTime: value });
                  } else if (selectedCaption) {
                    onUpdateCaption(selectedCaption.id, { startTime: value });
                  }
                }}
                className="input-field w-full"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">وقت النهاية (ث)</label>
              <input
                type="number"
                step="0.1"
                value={isAdding ? newCaption.endTime : selectedCaption?.endTime || 0}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (isAdding) {
                    setNewCaption({ ...newCaption, endTime: value });
                  } else if (selectedCaption) {
                    onUpdateCaption(selectedCaption.id, { endTime: value });
                  }
                }}
                className="input-field w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1">حجم الخط</label>
              <input
                type="number"
                value={isAdding ? newCaption.fontSize : selectedCaption?.fontSize || 24}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (isAdding) {
                    setNewCaption({ ...newCaption, fontSize: value });
                  } else if (selectedCaption) {
                    onUpdateCaption(selectedCaption.id, { fontSize: value });
                  }
                }}
                className="input-field w-full"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">لون النص</label>
              <input
                type="color"
                value={isAdding ? newCaption.color : selectedCaption?.color || '#ffffff'}
                onChange={(e) => {
                  if (isAdding) {
                    setNewCaption({ ...newCaption, color: e.target.value });
                  } else if (selectedCaption) {
                    onUpdateCaption(selectedCaption.id, { color: e.target.value });
                  }
                }}
                className="input-field w-full h-10"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isAdding ? newCaption.bold : selectedCaption?.bold || false}
                onChange={(e) => {
                  if (isAdding) {
                    setNewCaption({ ...newCaption, bold: e.target.checked });
                  } else if (selectedCaption) {
                    onUpdateCaption(selectedCaption.id, { bold: e.target.checked });
                  }
                }}
                className="rounded"
              />
              <span className="text-sm">عريض</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isAdding ? newCaption.italic : selectedCaption?.italic || false}
                onChange={(e) => {
                  if (isAdding) {
                    setNewCaption({ ...newCaption, italic: e.target.checked });
                  } else if (selectedCaption) {
                    onUpdateCaption(selectedCaption.id, { italic: e.target.checked });
                  }
                }}
                className="rounded"
              />
              <span className="text-sm">مائل</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isAdding ? newCaption.shadow : selectedCaption?.shadow || false}
                onChange={(e) => {
                  if (isAdding) {
                    setNewCaption({ ...newCaption, shadow: e.target.checked });
                  } else if (selectedCaption) {
                    onUpdateCaption(selectedCaption.id, { shadow: e.target.checked });
                  }
                }}
                className="rounded"
              />
              <span className="text-sm">ظل</span>
            </label>
          </div>

          <div className="flex gap-2">
            {isAdding ? (
              <>
                <button onClick={handleAddSubmit} className="btn-primary flex-1">
                  إضافة
                </button>
                <button
                  onClick={() => setIsAdding(false)}
                  className="btn-secondary flex-1"
                >
                  إلغاء
                </button>
              </>
            ) : (
              <button
                onClick={() => onSelectCaption(null)}
                className="btn-secondary w-full"
              >
                إغلاق
              </button>
            )}
          </div>
        </div>
      )}

      {/* Captions List */}
      <div className="space-y-2">
        <h4 className="font-semibold text-sm text-dark-400">
          الكابشنات ({captions.length})
        </h4>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {captions.length === 0 ? (
            <div className="text-center py-8 text-dark-500">
              <p>لا توجد كابشنات بعد</p>
            </div>
          ) : (
            captions.map((caption) => (
              <div
                key={caption.id}
                className={`card cursor-pointer transition-all ${
                  selectedCaption?.id === caption.id
                    ? 'border-primary-500 bg-primary-500/10'
                    : 'hover:border-dark-600'
                }`}
                onClick={() => onSelectCaption(caption)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate quran-text">
                      {caption.text}
                    </p>
                    <p className="text-xs text-dark-500 mt-1">
                      {formatTime(caption.startTime)} - {formatTime(caption.endTime)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCaption(caption);
                      }}
                      className="btn-icon text-xs"
                      title="تحرير"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteCaption(caption.id);
                      }}
                      className="btn-icon text-xs text-red-400"
                      title="حذف"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default CaptionEditor;
