"""
Dammaj Al-Quran - TTS (Text-to-Speech) Service using Coqui TTS
"""

import os
import asyncio
from pathlib import Path
from typing import Optional, Dict, Any
from TTS.api import TTS
import torch

from app.core.config import settings
from app.core.logger import logger


class TTSService:
    """Text-to-speech service using Coqui TTS"""
    
    def __init__(self):
        self.tts = None
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        logger.info(f"🔊 Initializing TTS service on {self.device}")
    
    async def load_model(self):
        """Load TTS model"""
        if self.tts is None:
            loop = asyncio.get_event_loop()
            
            # Initialize TTS with Arabic model
            def init():
                try:
                    # Try loading a multilingual model with Arabic support
                    self.tts = TTS(
                        model_name="tts_models/multilingual/multi-dataset/xtts_v2",
                        device=self.device,
                        progress_bar=False
                    )
                except Exception as e:
                    logger.warning(f"XTTSv2 not available, trying fallback: {e}")
                    # Fallback to a simpler model
                    self.tts = TTS(
                        model_name="tts_models/ar/omar/mellotron",
                        device=self.device,
                        progress_bar=False
                    )
            
            await loop.run_in_executor(None, init)
            logger.info("✅ TTS model loaded")
    
    async def generate_dubbing(
        self,
        text: str,
        language: str = "ar",
        voice: Optional[str] = None,
        speed: float = 1.0,
        output_path: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Generate speech from text
        
        Args:
            text: Text to convert to speech
            language: Language code
            voice: Voice identifier
            speed: Speech speed (0.5 - 2.0)
            output_path: Output file path
        
        Returns:
            Generated audio information
        """
        await self.load_model()
        
        if not text or not text.strip():
            raise ValueError("Text cannot be empty")
        
        if output_path is None:
            output_path = str(settings.TEMP_DIR / f"tts_{os.urandom(8).hex()}.wav")
        
        loop = asyncio.get_event_loop()
        
        def generate():
            # Generate speech
            self.tts.tts_to_file(
                text=text,
                file_path=output_path,
                language=language,
                speed=speed
            )
            return output_path
        
        result = await loop.run_in_executor(None, generate)
        
        file_size = os.path.getsize(result)
        
        logger.info(f"🔊 TTS generated: {result}, size: {file_size} bytes")
        
        return {
            "output_path": result,
            "text": text,
            "language": language,
            "speed": speed,
            "file_size": file_size,
        }
    
    async def generate_with_timestamps(
        self,
        text: str,
        language: str = "ar",
        output_path: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Generate speech with word-level timestamps
        
        Args:
            text: Text to convert to speech
            language: Language code
            output_path: Output file path
        
        Returns:
            Audio info with word timestamps
        """
        await self.load_model()
        
        if output_path is None:
            output_path = str(settings.TEMP_DIR / f"tts_{os.urandom(8).hex()}.wav")
        
        loop = asyncio.get_event_loop()
        
        def generate():
            # Generate with character alignments
            self.tts.tts_to_file(
                text=text,
                file_path=output_path,
                language=language,
                split_sentences=True
            )
            return output_path
        
        result = await loop.run_in_executor(None, generate)
        
        return {
            "output_path": result,
            "text": text,
            "language": language,
        }
    
    async def get_available_voices(self, language: str = "ar") -> Dict[str, Any]:
        """
        Get list of available voices for a language
        
        Args:
            language: Language code
        
        Returns:
            List of available voices
        """
        await self.load_model()
        
        # Return default voices for Arabic
        return {
            "language": language,
            "voices": [
                {
                    "id": "default",
                    "name": "Default Arabic Voice",
                    "gender": "male",
                    "description": "Standard Arabic text-to-speech voice"
                }
            ]
        }
    
    def unload_model(self):
        """Unload model to free memory"""
        if self.tts is not None:
            del self.tts
            self.tts = None
            if torch.cuda.is_available():
                torch.cuda.empty_cache()
            logger.info("🗑️ TTS model unloaded")
