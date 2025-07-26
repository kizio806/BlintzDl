import { ConvertRequest, ConvertResponse } from '@/types/converter';

const API_BASE_URL = 'http://localhost:3001';

class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

export const convertMedia = async (request: ConvertRequest): Promise<ConvertResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/convert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.error || `HTTP error! status: ${response.status}`,
        response.status
      );
    }

    const data: ConvertResponse = await response.json();
    
    if (!data.success) {
      throw new ApiError(data.error || 'Konwersja nie powiodła się');
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    if (error instanceof TypeError) {
      throw new ApiError('Błąd połączenia z serwerem. Sprawdź połączenie internetowe.');
    }
    
    throw new ApiError('Nieoczekiwany błąd podczas konwersji');
  }
};

export const downloadFile = (downloadUrl: string, filename?: string) => {
  const link = document.createElement('a');
  link.href = downloadUrl;
  
  if (filename) {
    link.download = filename;
  }
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};