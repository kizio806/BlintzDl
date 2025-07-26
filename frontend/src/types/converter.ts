export type ConversionFormat =
  | 'mp3' | 'wav' | 'm4a' | 'ogg' | 'flac'
  | 'mp4' | 'webm' | 'mkv';


export type ConversionStatus = 'idle' | 'processing' | 'completed' | 'error';

export interface ConvertRequest {
  url: string;
  format: ConversionFormat;
}

export interface ConvertResponse {
  filename: null;
  success: boolean;
  downloadUrl?: string;
  message?: string;
  error?: string;
}

export interface ConversionState {
  status: ConversionStatus;
  progress: number;
  downloadUrl: string | null;
  error: string | null;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}