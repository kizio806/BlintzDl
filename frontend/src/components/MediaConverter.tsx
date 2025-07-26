import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Link as LinkIcon, Music, Video, CheckCircle, AlertCircle, Loader2, ExternalLink } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { convertMedia, downloadFile } from '@/lib/api';
import { validateUrl, detectPlatform, isFormatCompatible } from '@/lib/validation';
import { ConversionFormat, ConversionStatus, ConversionState } from '@/types/converter';

const MediaConverter = () => {
  const [url, setUrl] = useState('');
  const [format, setFormat] = useState<ConversionFormat>('mp3');
  const [conversionState, setConversionState] = useState<ConversionState>({
    status: 'idle',
    progress: 0,
    downloadUrl: null,
    error: null,
  });
  const urlValidation = validateUrl(url);
  const detectedPlatform = url.trim() ? detectPlatform(url) : null;
  // Usuwamy warunek z Spotify, zakładamy, że mp3 i mp4 są kompatybilne dla YouTube i SoundCloud
  const isFormatValid = url.trim() ? isFormatCompatible(url, format) : true;
  const [convertedFilename, setConvertedFilename] = useState<string | null>(null);

  const handleConvert = useCallback(async () => {
    if (!urlValidation.isValid) {
      toast({
        title: "Błąd walidacji",
        description: urlValidation.error,
        variant: "destructive",
      });
      return;
    }

    if (!isFormatValid) {
      toast({
        title: "Niekompatybilny format",
        description: "⚠️ SoundCloud obsługuje tylko formaty audio: MP3, WAV, M4A, OGG, FLAC",
        variant: "destructive",
      });
      return;
    }


    setConversionState({
      status: 'processing',
      progress: 0,
      downloadUrl: null,
      error: null,
    });

    try {
      const response = await convertMedia({
        url: url.trim(),
        format: format
      });

      setConvertedFilename(response.filename || null);
      setConversionState({
        status: 'completed',
        progress: 100,
        downloadUrl: response.downloadUrl || null,
        error: null,
      });

    } catch (error: any) {
      const errorMessage = error.message || 'Wystąpił nieoczekiwany błąd';

      setConversionState({
        status: 'error',
        progress: 0,
        downloadUrl: null,
        error: errorMessage,
      });

      toast({
        title: "Błąd konwersji",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [url, format, urlValidation, isFormatValid]);

  const handleDownload = useCallback(() => {
    if (conversionState.downloadUrl && convertedFilename) {
      try {
        downloadFile(conversionState.downloadUrl, convertedFilename);

        toast({
          title: "Pobieranie rozpoczęte",
          description: "Plik zostanie zapisany w folderze Pobrane",
        });
      } catch (error) {
        toast({
          title: "Błąd pobierania",
          description: "Nie udało się pobrać pliku",
          variant: "destructive",
        });
      }
    }
  }, [conversionState.downloadUrl, convertedFilename]);

  const resetConverter = useCallback(() => {
    setUrl('');
    setConvertedFilename(null);
    setConversionState({
      status: 'idle',
      progress: 0,
      downloadUrl: null,
      error: null,
    });
  }, []);

  const getStatusIcon = () => {
    switch (conversionState.status) {
      case 'processing':
        return <Loader2 className="w-5 h-5 animate-spin text-primary" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-destructive" />;
      default:
        return <LinkIcon className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusText = () => {
    switch (conversionState.status) {
      case 'processing':
        return 'Przetwarzanie...';
      case 'completed':
        return 'Gotowe do pobrania';
      case 'error':
        return conversionState.error || 'Błąd konwersji';
      default:
        if (detectedPlatform) {
          return `Wykryto: ${detectedPlatform}`;
        }
        return 'Wklej link i wybierz format';
    }
  };

  const canConvert = urlValidation.isValid && 
                    isFormatValid && 
                    conversionState.status !== 'processing';

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          BlintzDL
        </h1>
        <p className="text-muted-foreground text-lg">
          Konwertuj YouTube i SoundCloud do MP3/MP4
        </p>
      </div>

      <Card className="p-8 shadow-card border-border/50 animate-scale-in">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Link do konwersji
            </label>
            <div className="relative">
              <Input
                type="url"
                placeholder="https://youtube.com/watch?v=... lub https://soundcloud.com/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className={`pl-10 transition-smooth ${
                  url.trim() && !urlValidation.isValid 
                    ? 'border-destructive focus:border-destructive' 
                    : 'border-border/50 focus:border-primary'
                }`}
                disabled={conversionState.status === 'processing'}
              />
              <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
            
            {url.trim() && !urlValidation.isValid && (
              <p className="text-sm text-destructive animate-fade-in">
                {urlValidation.error}
              </p>
            )}
            
            {detectedPlatform && urlValidation.isValid && (
              <div className="flex items-center gap-2 animate-fade-in">
                <Badge variant="outline" className="text-xs">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  {detectedPlatform}
                </Badge>
              </div>
            )}
            {url.trim() && detectedPlatform === 'SoundCloud' && !isFormatValid && (
              <p className="text-sm text-warning animate-fade-in">
                ⚠️ SoundCloud obsługuje tylko formaty audio: MP3, WAV, m4a, OGG, FLAC
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Format wyjściowy</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as ConversionFormat)}
              disabled={conversionState.status === 'processing'}
              className="w-full bg-muted border border-border text-foreground text-sm rounded-xl px-4 py-2 shadow-inner focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-150 disabled:opacity-50 dark:bg-zinc-900 dark:border-zinc-700"
            >
              <optgroup label="Audio">
                <option value="mp3">MP3</option>
                <option value="wav">WAV</option>
                <option value="m4a">m4a</option>
                <option value="ogg">OGG</option>
                <option value="flac">FLAC</option>
              </optgroup>
              <optgroup label="Wideo">
                <option value="mp4">MP4</option>
                <option value="webm">WEBM</option>
                <option value="mkv">MKV</option>
              </optgroup>
            </select>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <span className="text-sm font-medium">
                {getStatusText()}
              </span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            {conversionState.status === 'completed' && conversionState.downloadUrl ? (
              <>
                <Button
                  onClick={handleDownload}
                  className="flex-1 gap-2 shadow-primary hover:shadow-glow transition-smooth"
                >
                  <Download className="w-4 h-4" />
                  Pobierz plik
                </Button>
                <Button
                  variant="secondary"
                  onClick={resetConverter}
                  className="transition-smooth"
                >
                  Nowy
                </Button>
              </>
            ) : (
              <Button
                onClick={handleConvert}
                disabled={!canConvert}
                className="w-full gap-2 shadow-primary hover:shadow-glow transition-smooth disabled:opacity-50"
              >
                {conversionState.status === 'processing' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Przetwarzanie...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Konwertuj
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </Card>

      <div className="text-center space-y-3 animate-slide-up">
        <p className="text-sm text-muted-foreground">Obsługiwane serwisy:</p>
        <div className="flex justify-center gap-2">
          <Badge variant="secondary" className="transition-smooth hover:bg-primary/10">
            YouTube
          </Badge>
          <Badge variant="secondary" className="transition-smooth hover:bg-primary/10">
            SoundCloud
          </Badge>
        </div>
      </div>

    </div>
  );
};

export default MediaConverter;
