"""
Dammaj Al-Quran - Audio Processing Service
"""

import os
import asyncio
from pathlib import Path
from typing import Optional, Dict, Any
import numpy as np
import librosa
import soundfile as sf
from scipy.io import wavfile
from scipy.signal import wiener

from app.core.config import settings
from app.core.logger import logger


class AudioService:
    """Audio processing service with librosa"""
    
    def __init__(self):
        self.sample_rate = 44100
    
    async def get_audio_info(self, audio_path: str) -> Dict[str, Any]:
        """
        Get audio file information
        
        Args:
            audio_path: Path to audio file
        
        Returns:
            Audio metadata
        """
        loop = asyncio.get_event_loop()
        
        def analyze():
            y, sr = librosa.load(audio_path, sr=None)
            duration = librosa.get_duration(y=y, sr=sr)
            
            # Get additional info
            info = sf.info(audio_path)
            
            return {
                "filename": os.path.basename(audio_path),
                "duration": duration,
                "sample_rate": sr,
                "channels": 1 if len(y.shape) == 1 else y.shape[0],
                "samples": len(y),
                "format": info.format,
                "subtype": info.subtype,
            }
        
        return await loop.run_in_executor(None, analyze)
    
    async def reduce_noise(
        self,
        audio_path: str,
        strength: float = 0.5,
        output_path: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Reduce noise from audio
        
        Args:
            audio_path: Path to audio file
            strength: Noise reduction strength (0-1)
            output_path: Output path
        
        Returns:
            Processing result
        """
        loop = asyncio.get_event_loop()
        
        if output_path is None:
            output_path = str(Path(audio_path).with_stem(f"{Path(audio_path).stem}_denoised"))
        
        def process():
            # Load audio
            y, sr = librosa.load(audio_path, sr=self.sample_rate)
            
            # Estimate noise from silent portions
            # Simple spectral subtraction for noise reduction
            S = np.abs(librosa.stft(y))
            
            # Estimate noise floor (from quiet sections)
            noise_level = np.percentile(S, 10) * strength
            
            # Subtract noise
            S_clean = np.maximum(S - noise_level, 0)
            
            # Reconstruct audio
            y_clean = librosa.istft(S_clean * np.exp(1j * np.angle(librosa.stft(y))))
            
            # Save result
            sf.write(output_path, y_clean, sr)
            
            return output_path
        
        result = await loop.run_in_executor(None, process)
        
        logger.info(f"🔇 Noise reduction completed: {result}")
        
        return {
            "output_path": result,
            "strength": strength,
        }
    
    async def normalize_audio(
        self,
        audio_path: str,
        target_level: float = -3.0,
        output_path: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Normalize audio levels
        
        Args:
            audio_path: Path to audio file
            target_level: Target level in dB
            output_path: Output path
        
        Returns:
            Processing result
        """
        loop = asyncio.get_event_loop()
        
        if output_path is None:
            output_path = str(Path(audio_path).with_stem(f"{Path(audio_path).stem}_normalized"))
        
        def process():
            # Load audio
            y, sr = librosa.load(audio_path, sr=self.sample_rate)
            
            # Calculate current peak level
            current_peak = np.max(np.abs(y))
            
            # Calculate gain needed
            target_linear = 10 ** (target_level / 20)
            gain = target_linear / current_peak if current_peak > 0 else 1
            
            # Apply gain
            y_normalized = y * gain
            
            # Prevent clipping
            y_normalized = np.clip(y_normalized, -1, 1)
            
            # Save result
            sf.write(output_path, y_normalized, sr)
            
            return output_path, gain
        
        result, gain = await loop.run_in_executor(None, process)
        
        logger.info(f"🔊 Audio normalized: {result}, gain: {gain:.2f}")
        
        return {
            "output_path": result,
            "target_level": target_level,
            "gain_applied": gain,
        }
    
    async def adjust_volume(
        self,
        audio_path: str,
        volume: float = 1.0,
        output_path: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Adjust audio volume
        
        Args:
            audio_path: Path to audio file
            volume: Volume multiplier
            output_path: Output path
        
        Returns:
            Processing result
        """
        loop = asyncio.get_event_loop()
        
        if output_path is None:
            output_path = str(Path(audio_path).with_stem(f"{Path(audio_path).stem}_adjusted"))
        
        def process():
            # Load audio
            y, sr = librosa.load(audio_path, sr=self.sample_rate)
            
            # Apply volume
            y_adjusted = y * volume
            
            # Prevent clipping
            y_adjusted = np.clip(y_adjusted, -1, 1)
            
            # Save result
            sf.write(output_path, y_adjusted, sr)
            
            return output_path
        
        result = await loop.run_in_executor(None, process)
        
        logger.info(f"🔈 Volume adjusted: {volume}x")
        
        return {
            "output_path": result,
            "volume": volume,
        }
    
    async def mix_tracks(
        self,
        audio_paths: list,
        output_path: str,
        volumes: Optional[list] = None,
        output_format: str = "mp3"
    ) -> Dict[str, Any]:
        """
        Mix multiple audio tracks
        
        Args:
            audio_paths: List of audio file paths
            output_path: Output file path
            volumes: Volume levels for each track
            output_format: Output format
        
        Returns:
            Processing result
        """
        loop = asyncio.get_event_loop()
        
        if volumes is None:
            volumes = [1.0] * len(audio_paths)
        
        def process():
            tracks = []
            sr = self.sample_rate
            
            # Load all tracks
            for path in audio_paths:
                y, track_sr = librosa.load(path, sr=sr)
                tracks.append(y)
            
            # Pad shorter tracks to match longest
            max_length = max(len(t) for t in tracks)
            padded = []
            for i, track in enumerate(tracks):
                if len(track) < max_length:
                    padded.append(np.pad(track, (0, max_length - len(track))))
                else:
                    padded.append(track)
            
            # Mix tracks
            mixed = np.zeros(max_length)
            for track, vol in zip(padded, volumes):
                mixed += track * vol
            
            # Normalize to prevent clipping
            max_val = np.max(np.abs(mixed))
            if max_val > 1:
                mixed = mixed / max_val
            
            # Save result
            sf.write(output_path, mixed, sr)
            
            return output_path
        
        result = await loop.run_in_executor(None, process)
        
        logger.info(f"🎵 Audio mixed: {result}")
        
        return {
            "output_path": result,
            "tracks_count": len(audio_paths),
        }
    
    async def extract_waveform_data(
        self,
        audio_path: str,
        samples: int = 1000
    ) -> Dict[str, Any]:
        """
        Extract waveform data for visualization
        
        Args:
            audio_path: Path to audio file
            samples: Number of samples to return
        
        Returns:
            Waveform data
        """
        loop = asyncio.get_event_loop()
        
        def extract():
            y, sr = librosa.load(audio_path, sr=self.sample_rate)
            
            # Downsample to requested number of samples
            if len(y) > samples:
                indices = np.linspace(0, len(y) - 1, samples).astype(int)
                y_downsampled = y[indices]
            else:
                y_downsampled = y
            
            # Calculate peaks
            peaks = []
            chunk_size = len(y_downsampled) // samples
            for i in range(0, len(y_downsampled), chunk_size):
                chunk = y_downsampled[i:i + chunk_size]
                peaks.append({
                    "min": float(np.min(chunk)) if len(chunk) > 0 else 0,
                    "max": float(np.max(chunk)) if len(chunk) > 0 else 0,
                    "avg": float(np.mean(chunk)) if len(chunk) > 0 else 0,
                })
            
            return {
                "peaks": peaks,
                "duration": len(y) / sr,
                "sample_rate": sr,
            }
        
        return await loop.run_in_executor(None, extract)
    
    async def convert_audio_format(
        self,
        audio_path: str,
        output_path: str,
        target_format: str = "wav",
        sample_rate: int = 44100
    ) -> Dict[str, Any]:
        """
        Convert audio to different format
        
        Args:
            audio_path: Input audio path
            output_path: Output audio path
            target_format: Target format
            sample_rate: Target sample rate
        
        Returns:
            Processing result
        """
        loop = asyncio.get_event_loop()
        
        def convert():
            y, sr = librosa.load(audio_path, sr=sample_rate)
            sf.write(output_path, y, sr)
            return output_path
        
        result = await loop.run_in_executor(None, convert)
        
        logger.info(f"🔄 Audio converted: {result}")
        
        return {
            "output_path": result,
            "format": target_format,
            "sample_rate": sample_rate,
        }
