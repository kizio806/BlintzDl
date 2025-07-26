import { ValidationResult } from '@/types/converter';

const URL_PATTERNS = {
  youtube: [
    /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]{11}/,
    /^https?:\/\/(www\.)?(youtube\.com\/playlist\?list=)[a-zA-Z0-9_-]+/,
    /^https?:\/\/(music\.)?youtube\.com\//,
  ],
  spotify: [
    /^https?:\/\/(open\.)?spotify\.com\/(track|album|playlist|artist)\/[a-zA-Z0-9]+/,
  ],
  soundcloud: [
    /^https?:\/\/(www\.)?soundcloud\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+/,
  ],
};

export const validateUrl = (url: string): ValidationResult => {
  if (!url.trim()) {
    return {
      isValid: false,
      error: 'Wklej link do konwersji'
    };
  }

  try {
    new URL(url);
  } catch {
    return {
      isValid: false,
      error: 'Nieprawidłowy format URL'
    };
  }

  const allPatterns = [
    ...URL_PATTERNS.youtube,
    ...URL_PATTERNS.spotify,
    ...URL_PATTERNS.soundcloud,
  ];

  const isSupported = allPatterns.some(pattern => pattern.test(url));
  
  if (!isSupported) {
    return {
      isValid: false,
      error: 'Obsługujemy tylko linki z YouTube, Spotify i SoundCloud'
    };
  }

  return { isValid: true };
};

export const detectPlatform = (url: string): string | null => {
  if (URL_PATTERNS.youtube.some(pattern => pattern.test(url))) {
    return 'YouTube';
  }
  if (URL_PATTERNS.spotify.some(pattern => pattern.test(url))) {
    return 'Spotify';
  }
  if (URL_PATTERNS.soundcloud.some(pattern => pattern.test(url))) {
    return 'SoundCloud';
  }
  return null;
};

export const isFormatCompatible = (url: string, format: 'mp3' | 'mp4'): boolean => {
  const platform = detectPlatform(url);
  
  if (platform === 'Spotify' && format === 'mp4') {
    return false;
  }
  
  return true;
};