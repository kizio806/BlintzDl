export type Format = 
  | 'mp3' | 'wav' | 'm4a' | 'ogg' | 'flac' 
  | 'mp4' | 'webm' | 'mkv';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

const URL_PATTERNS = {
  youtube: [
    /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]{11}/,
    /^https?:\/\/(www\.)?(youtube\.com\/playlist\?list=)[a-zA-Z0-9_-]+/,
    /^https?:\/\/(music\.)?youtube\.com\//,
  ],
  soundcloud: [
    /^https?:\/\/(www\.)?soundcloud\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+/,
  ],
};

export const validateUrl = (url: string): ValidationResult => {
  if (!url.trim()) {
    return {
      isValid: false,
      error: 'Wklej link do konwersji',
    };
  }

  try {
    new URL(url);
  } catch {
    return {
      isValid: false,
      error: 'Nieprawidłowy format URL',
    };
  }

  const allPatterns = [
    ...URL_PATTERNS.youtube,
    ...URL_PATTERNS.soundcloud,
  ];

  const isSupported = allPatterns.some(pattern => pattern.test(url));

  if (!isSupported) {
    return {
      isValid: false,
      error: 'Obsługujemy tylko linki z YouTube i SoundCloud',
    };
  }

  return { isValid: true };
};

export const detectPlatform = (url: string): 'YouTube' | 'SoundCloud' | null => {
  if (URL_PATTERNS.youtube.some(pattern => pattern.test(url))) {
    return 'YouTube';
  }
  if (URL_PATTERNS.soundcloud.some(pattern => pattern.test(url))) {
    return 'SoundCloud';
  }
  return null;
};

export const isFormatCompatible = (url: string, format: Format): boolean => {
  const platform = detectPlatform(url);

  if (!platform) return false;

  // SoundCloud obsługuje tylko formaty audio
  if (platform === 'SoundCloud' && ['mp4', 'webm', 'mkv'].includes(format)) {
    return false;
  }

  // YouTube obsługuje wszystkie formaty z listy
  return true;
};
