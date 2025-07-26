// Typy dla API konwertera mediów

export type ConversionFormat = 'mp3' | 'mp4';

export type ConversionStatus = 'idle' | 'processing' | 'completed' | 'error';

// Request do API
export interface ConvertRequest {
  url: string;
  format: ConversionFormat;
}

// Response z API
export interface ConvertResponse {
  filename: null;
  success: boolean;
  downloadUrl?: string;
  message?: string;
  error?: string;
}

// Status konwersji
export interface ConversionState {
  status: ConversionStatus;
  progress: number;
  downloadUrl: string | null;
  error: string | null;
}

// Walidacja URL
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}