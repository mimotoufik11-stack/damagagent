"""
Dammaj Al-Quran - FFmpeg Video Processing Service
"""

import os
import asyncio
from pathlib import Path
from typing import Optional, Dict, Any, Tuple
import ffmpeg
import subprocess
from app.core.config import settings
from app.core.logger import logger


class FFmpegService:
    """FFmpeg video and audio processing service"""
    
    def __init__(self):
        self.ffmpeg_path = settings.FFFMPEG_PATH
        self.threads = settings.FFMPEG_THREADS
    
    def _run_ffmpeg(self, args: list) -> subprocess.CompletedProcess:
        """Run FFmpeg command"""
        try:
            result = subprocess.run(
                args,
                capture_output=True,
                text=True,
                check=True
            )
            return result
        except subprocess.CalledProcessError as e:
            logger.error(f"FFmpeg error: {e.stderr}")
            raise
    
    async def get_video_info(self, video_path: str) -> Dict[str, Any]:
        """
        Get video file information
        
        Args:
            video_path: Path to video file
        
        Returns:
            Video metadata
        """
        loop = asyncio.get_event_loop()
        
        def probe():
            try:
                probe = ffmpeg.probe(video_path)
                return probe
            except ffmpeg.Error as e:
                logger.error(f"FFprobe error: {e}")
                raise
        
        probe_result = await loop.run_in_executor(None, probe)
        
        # Extract video stream info
        video_info = {}
        for stream in probe_result.get("streams", []):
            if stream.get("codec_type") == "video":
                video_info = {
                    "width": int(stream.get("width", 0)),
                    "height": int(stream.get("height", 0)),
                    "codec": stream.get("codec_name"),
                    "frame_rate": self._parse_frame_rate(stream.get("r_frame_rate")),
                    "duration": float(stream.get("duration", 0)),
                    "bit_rate": int(stream.get("bit_rate", 0)),
                    "pix_fmt": stream.get("pix_fmt"),
                }
                break
        
        # Extract audio stream info
        audio_info = {}
        for stream in probe_result.get("streams", []):
            if stream.get("codec_type") == "audio":
                audio_info = {
                    "codec": stream.get("codec_name"),
                    "sample_rate": int(stream.get("sample_rate", 0)),
                    "channels": int(stream.get("channels", 0)),
                    "duration": float(stream.get("duration", 0)),
                }
                break
        
        # Format info
        format_info = probe_result.get("format", {})
        
        return {
            "filename": os.path.basename(video_path),
            "size": int(format_info.get("size", 0)),
            "duration": video_info.get("duration", 0),
            "bit_rate": video_info.get("bit_rate", 0),
            "video": video_info,
            "audio": audio_info,
        }
    
    def _parse_frame_rate(self, frame_rate: str) -> float:
        """Parse frame rate string to float"""
        if "/" in frame_rate:
            num, den = frame_rate.split("/")
            return float(num) / float(den) if den != "0" else 0
        return float(frame_rate) if frame_rate else 0
    
    async def generate_thumbnail(
        self,
        video_path: str,
        output_path: str,
        timestamp: float = 0.0
    ) -> str:
        """
        Generate thumbnail from video
        
        Args:
            video_path: Path to video file
            output_path: Output path for thumbnail
            timestamp: Time in seconds to capture
        
        Returns:
            Path to generated thumbnail
        """
        loop = asyncio.get_event_loop()
        
        def capture():
            (
                ffmpeg
                .input(video_path, ss=timestamp)
                .output(output_path, vframes=1, qscale_v=2)
                .overwrite_output()
                .run(capture_stdout=True, capture_stderr=True, quiet=True)
            )
        
        await loop.run_in_executor(None, capture)
        logger.info(f"🖼️ Thumbnail generated: {output_path}")
        return output_path
    
    async def extract_audio(
        self,
        video_path: str,
        audio_path: str,
        format: str = "wav"
    ) -> str:
        """
        Extract audio from video
        
        Args:
            video_path: Path to video file
            audio_path: Output path for audio
            format: Audio format
        
        Returns:
            Path to extracted audio
        """
        loop = asyncio.get_event_loop()
        
        def extract():
            (
                ffmpeg
                .input(video_path)
                .output(audio_path, **{'q:a': 0, 'map': 'a'})
                .overwrite_output()
                .run(capture_stdout=True, capture_stderr=True, quiet=True)
            )
        
        await loop.run_in_executor(None, extract)
        logger.info(f"🎵 Audio extracted: {audio_path}")
        return audio_path
    
    async def encode_video(
        self,
        input_path: str,
        output_path: str,
        resolution: Tuple[int, int] = (1920, 1080),
        fps: int = 30,
        bitrate: str = "8M",
        codec: str = "libx264",
        preset: str = "medium"
    ) -> str:
        """
        Encode video with specified settings
        
        Args:
            input_path: Input video path
            output_path: Output video path
            resolution: (width, height)
            fps: Frame rate
            bitrate: Video bitrate
            codec: Video codec
            preset: Encoding preset
        
        Returns:
            Path to encoded video
        """
        loop = asyncio.get_event_loop()
        
        def encode():
            (
                ffmpeg
                .input(input_path)
                .output(
                    output_path,
                    vcodec=codec,
                    vf=f"scale={resolution[0]}:{resolution[1]}",
                    r=fps,
                    b=bitrate,
                    preset=preset,
                    acodec="aac",
                    ab="192k"
                )
                .overwrite_output()
                .run(capture_stdout=True, capture_stderr=True, quiet=True)
            )
        
        await loop.run_in_executor(None, encode)
        logger.info(f"🎬 Video encoded: {output_path}")
        return output_path
    
    async def mix_audio(
        self,
        audio_paths: list,
        output_path: str,
        volumes: Optional[list] = None,
        output_format: str = "mp3"
    ) -> str:
        """
        Mix multiple audio tracks
        
        Args:
            audio_paths: List of audio file paths
            output_path: Output file path
            volumes: Volume levels for each track
            output_format: Output format
        
        Returns:
            Path to mixed audio
        """
        loop = asyncio.get_event_loop()
        
        if volumes is None:
            volumes = [1.0] * len(audio_paths)
        
        # Normalize volumes to FFmpeg filter format
        filters = []
        for i, (path, vol) in enumerate(zip(audio_paths, volumes)):
            filters.append(
                f"[{i}:a]volume={vol}[a{i}]"
            )
        
        # Build filter chain
        filter_complex = ";".join(filters) + ";" + "".join(
            f"[a{i}]" for i in range(len(audio_paths))
        ) + f"amix=inputs={len(audio_paths)}[out]"
        
        def mix():
            # Create FFmpeg inputs
            inputs = []
            for path in audio_paths:
                inputs.extend(['-i', path])
            
            (
                ffmpeg
                .input(*inputs)
                .output(
                    output_path,
                    filter_complex=filter_complex,
                    acodec="aac" if output_format == "m4a" else "libmp3lame",
                    **{'q:a': 0} if output_format == "mp3" else {}
                )
                .overwrite_output()
                .run(capture_stdout=True, capture_stderr=True, quiet=True)
            )
        
        await loop.run_in_executor(None, mix)
        logger.info(f"🎵 Audio mixed: {output_path}")
        return output_path
    
    async def add_subtitles(
        self,
        video_path: str,
        subtitle_path: str,
        output_path: str,
        font_path: Optional[str] = None,
        font_size: int = 48,
        font_color: str = "white",
        position: str = "bottom"
    ) -> str:
        """
        Add subtitles to video
        
        Args:
            video_path: Input video path
            subtitle_path: Subtitle file path (SRT)
            output_path: Output video path
            font_path: Path to font file
            font_size: Font size
            font_color: Font color
            position: Subtitle position
        
        Returns:
            Path to video with subtitles
        """
        loop = asyncio.get_event_loop()
        
        # Determine position
        y_position = "h-th-50" if position == "bottom" else "40"
        
        def burn():
            if font_path:
                (
                    ffmpeg
                    .input(video_path)
                    .input(subtitle_path)
                    .output(
                        output_path,
                        vcodec="copy",
                        acodec="copy",
                        **{'c:s': 'mov_text'},
                        **{'c:t': 'ttml'}
                    )
                    .overwrite_output()
                    .run(capture_stdout=True, capture_stderr=True, quiet=True)
                )
            else:
                # Soft subtitles
                (
                    ffmpeg
                    .input(video_path)
                    .input(subtitle_path)
                    .output(
                        output_path,
                        vcodec="copy",
                        acodec="copy",
                        **{'c:s': 'mov_text'}
                    )
                    .overwrite_output()
                    .run(capture_stdout=True, capture_stderr=True, quiet=True)
                )
        
        await loop.run_in_executor(None, burn)
        logger.info(f"📝 Subtitles added: {output_path}")
        return output_path
    
    async def trim_video(
        self,
        video_path: str,
        output_path: str,
        start_time: float,
        end_time: float
    ) -> str:
        """
        Trim video to specified duration
        
        Args:
            video_path: Input video path
            output_path: Output video path
            start_time: Start time in seconds
            end_time: End time in seconds
        
        Returns:
            Path to trimmed video
        """
        loop = asyncio.get_event_loop()
        
        def trim():
            (
                ffmpeg
                .input(video_path, ss=start_time, to=end_time)
                .output(output_path, c="copy")
                .overwrite_output()
                .run(capture_stdout=True, capture_stderr=True, quiet=True)
            )
        
        await loop.run_in_executor(None, trim)
        logger.info(f"✂️ Video trimmed: {output_path}")
        return output_path
    
    async def concatenate_videos(
        self,
        video_paths: list,
        output_path: str
    ) -> str:
        """
        Concatenate multiple videos
        
        Args:
            video_paths: List of video paths
            output_path: Output path
        
        Returns:
            Path to concatenated video
        """
        loop = asyncio.get_event_loop()
        
        # Create concat file
        concat_file = output_path + ".txt"
        with open(concat_file, 'w') as f:
            for path in video_paths:
                f.write(f"file '{os.path.abspath(path)}'\n")
        
        def concat():
            (
                ffmpeg
                .input(concat_file, f="concat")
                .output(output_path, c="copy")
                .overwrite_output()
                .run(capture_stdout=True, capture_stderr=True, quiet=True)
            )
        
        await loop.run_in_executor(None, concat)
        
        # Clean up concat file
        os.remove(concat_file)
        
        logger.info(f"🔗 Videos concatenated: {output_path}")
        return output_path
    
    async def apply_video_effect(
        self,
        video_path: str,
        output_path: str,
        effect: str,
        params: Dict[str, Any] = None
    ) -> str:
        """
        Apply video effect
        
        Args:
            video_path: Input video path
            output_path: Output video path
            effect: Effect name
            params: Effect parameters
        
        Returns:
            Path to processed video
        """
        loop = asyncio.get_event_loop()
        
        def apply():
            input_stream = ffmpeg.input(video_path)
            
            if effect == "brightness":
                brightness = params.get("value", 0)
                output_stream = input_stream.filter("eq", brightness=brightness)
            elif effect == "contrast":
                contrast = params.get("value", 1)
                output_stream = input_stream.filter("eq", contrast=contrast)
            elif effect == "saturation":
                saturation = params.get("value", 1)
                output_stream = input_stream.filter("eq", saturation=saturation)
            elif effect == "fade_in":
                duration = params.get("duration", 1)
                output_stream = input_stream.filter("fade", t="in", d=duration)
            elif effect == "fade_out":
                duration = params.get("duration", 1)
                output_stream = input_stream.filter("fade", t="out", d=duration)
            else:
                output_stream = input_stream
            
            (
                output_stream
                .output(output_path)
                .overwrite_output()
                .run(capture_stdout=True, capture_stderr=True, quiet=True)
            )
        
        await loop.run_in_executor(None, apply)
        logger.info(f"✨ Effect applied: {effect}")
        return output_path
