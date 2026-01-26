"""
Dammaj Al-Quran - Logger Configuration
"""

import sys
from loguru import logger
from app.core.config import settings

def setup_logger():
    """Configure application logger"""
    
    # Remove default handler
    logger.remove()
    
    # Add console handler
    logger.add(
        sys.stdout,
        format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | "
               "<level>{level: <8}</level> | "
               "<cyan>{message}</cyan>",
        level=settings.LOG_LEVEL,
        colorize=True,
    )
    
    # Add file handler for errors
    logger.add(
        settings.DATA_DIR / "logs" / "error.log",
        format="{time:YYYY-MM-DD HH:mm:ss} | {level: <8} | {message}",
        level="ERROR",
        rotation="10 MB",
        retention="7 days",
    )
    
    # Add file handler for all logs
    logger.add(
        settings.DATA_DIR / "logs" / "app.log",
        format="{time:YYYY-MM-DD HH:mm:ss} | {level: <8} | {message}",
        level=settings.LOG_LEVEL,
        rotation="10 MB",
        retention="30 days",
    )
    
    return logger

# Initialize logger
log = setup_logger()
