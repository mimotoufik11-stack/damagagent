"""
Dammaj Al-Quran - Whisper Transcription Service
"""

import os
import asyncio
from pathlib import Path
from typing import Optional, Dict, Any
import whisper
import torch

from app.core.config import settings
from app.core.logger import logger


class WhisperService:
    """Whisper speech-to-text transcription service"""
    
    def __init__(self):
        self.model = None
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model_name = settings.WHISPER_MODEL
        logger.info(f"🎤 Initializing Whisper service with model: {self.model_name} on {self.device}")
    
    async def load_model(self):
        """Load Whisper model"""
        if self.model is None:
            loop = asyncio.get_event_loop()
            self.model = await loop.run_in_executor(
                None,
                lambda: whisper.load_model(self.model_name).to(self.device)
            )
            logger.info(f"✅ Whisper model loaded: {self.model_name}")
    
    async def transcribe(
        self,
        audio_path: str,
        language: str = "ar",
        enable_timestamps: bool = True
    ) -> Dict[str, Any]:
        """
        Transcribe audio file
        
        Args:
            audio_path: Path to audio file
            language: Language code (default: Arabic)
            enable_timestamps: Include timestamp information
        
        Returns:
            Transcription result with text and optionally segments
        """
        await self.load_model()
        
        if not os.path.exists(audio_path):
            raise FileNotFoundError(f"Audio file not found: {audio_path}")
        
        logger.info(f"🎤 Starting transcription: {audio_path}")
        
        loop = asyncio.get_event_loop()
        
        # Run transcription
        result = await loop.run_in_executor(
            None,
            lambda: self.model.transcribe(
                audio_path,
                language=language,
                verbose=False
            )
        )
        
        # Format response
        response = {
            "text": result.get("text", ""),
            "language": result.get("language", language),
        }
        
        if enable_timestamps and "segments" in result:
            segments = []
            for seg in result["segments"]:
                segments.append({
                    "id": seg.get("id"),
                    "start": seg.get("start"),
                    "end": seg.get("end"),
                    "text": seg.get("text", "").strip(),
                    "confidence": seg.get("avg_logprob", 0)
                })
            response["segments"] = segments
        
        logger.info(f"✅ Transcription completed: {len(response.get('text', ''))} characters")
        
        return response
    
    async def transcribe_with_timestamps(
        self,
        audio_path: str,
        language: str = "ar"
    ) -> Dict[str, Any]:
        """
        Transcribe audio with detailed timestamp information
        
        Args:
            audio_path: Path to audio file
            language: Language code
        
        Returns:
            Full transcription result with word-level timestamps
        """
        await self.load_model()
        
        if not os.path.exists(audio_path):
            raise FileNotFoundError(f"Audio file not found: {audio_path}")
        
        logger.info(f"🎤 Starting transcription with timestamps: {audio_path}")
        
        loop = asyncio.get_event_loop()
        
        # Load audio
        audio = whisper.load_audio(audio_path)
        
        # Transcribe with word timestamps
        result = await loop.run_in_executor(
            None,
            lambda: self.model.transcribe(
                audio,
                language=language,
                word_timestamps=True,
                verbose=False
            )
        )
        
        response = {
            "text": result.get("text", "").strip(),
            "language": result.get("language", language),
            "duration": result.get("duration", 0),
        }
        
        if "segments" in result:
            segments = []
            for seg in result["segments"]:
                segment_data = {
                    "id": seg.get("id"),
                    "start": seg.get("start"),
                    "end": seg.get("end"),
                    "text": seg.get("text", "").strip(),
                    "words": []
                }
                
                if "words" in seg:
                    for word in seg["words"]:
                        segment_data["words"].append({
                            "word": word.get("word", ""),
                            "start": word.get("start"),
                            "end": word.get("end"),
                            "confidence": word.get("probability", 0)
                        })
                
                segments.append(segment_data)
            
            response["segments"] = segments
        
        logger.info(f"✅ Transcription with timestamps completed")
        
        return response
    
    async def transcribe_video(
        self,
        video_path: str,
        language: str = "ar"
    ) -> Dict[str, Any]:
        """
        Transcribe video file (extracts audio first)
        
        Args:
            video_path: Path to video file
            language: Language code
        
        Returns:
            Transcription result
        """
        from app.services.ffmpeg_service import FFmpegService
        
        # Extract audio from video
        ffmpeg_service = FFmpegService()
        audio_path = str(Path(video_path).with_suffix(".wav"))
        
        await ffmpeg_service.extract_audio(video_path, audio_path)
        
        try:
            result = await self.transcribe(audio_path, language)
            return result
        finally:
            # Clean up extracted audio
            if os.path.exists(audio_path):
                os.remove(audio_path)
    
    def unload_model(self):
        """Unload model to free memory"""
        if self.model is not None:
            del self.model
            self.model = None
            if torch.cuda.is_available():
                torch.cuda.empty_cache()
            logger.info("🗑️ Whisper model unloaded")
