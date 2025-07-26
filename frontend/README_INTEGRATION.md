# Media Converter - Integracja Frontend-Backend

## 📋 Wymagania API

Frontend jest gotowy na integrację z backendem zgodnie z następującą specyfikacją:

### Endpoint konwersji
```
POST /api/convert
Content-Type: application/json
```

### Request Body
```json
{
  "url": "https://youtube.com/watch?v=dQw4w9WgXcQ",
  "format": "mp3"
}
```

### Response (Sukces)
```json
{
  "success": true,
  "downloadUrl": "/downloads/converted_file_123.mp3",
  "message": "Konwersja zakończona pomyślnie"
}
```

### Response (Błąd)
```json
{
  "success": false,
  "error": "Nieprawidłowy URL lub błąd konwersji"
}
```

## 🚀 Konfiguracja środowiska

### Frontend (Vite)
Skonfiguruj proxy w `vite.config.ts` dla developmentu:

```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
```

### Backend URL
Zmień URL backendu w `src/lib/api.ts`:
```typescript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-production-backend.com' 
  : 'http://localhost:3001';
```

## 🔧 Walidacja frontendu

Frontend automatycznie waliduje:

✅ **Obsługiwane platformy:**
- YouTube (`youtube.com`, `youtu.be`, `music.youtube.com`)
- Spotify (`open.spotify.com`)
- SoundCloud (`soundcloud.com`)

✅ **Kompatybilność formatów:**
- YouTube: MP3 ✅ MP4 ✅
- Spotify: MP3 ✅ MP4 ❌ (tylko audio)
- SoundCloud: MP3 ✅ MP4 ❌ (tylko audio)

✅ **Walidacja URL:** Regex patterns dla każdej platformy

## 🎯 Flow użytkownika

1. **Input URL** → Frontend waliduje format URL
2. **Wybór formatu** → Frontend sprawdza kompatybilność
3. **Kliknięcie "Konwertuj"** → POST do `/api/convert`
4. **Oczekiwanie** → Loading state z animacjami
5. **Sukces** → Przycisk "Pobierz plik" z `downloadUrl`
6. **Error** → Toast z komunikatem błędu

## 🛠️ Implementacja backendu (przykład)

### Node.js/Express
```javascript
app.post('/api/convert', async (req, res) => {
  try {
    const { url, format } = req.body;
    
    // Walidacja
    if (!url || !format) {
      return res.status(400).json({
        success: false,
        error: 'Brak wymaganych parametrów'
      });
    }
    
    // Konwersja (yt-dlp, ffmpeg, itp.)
    const outputFile = await convertMedia(url, format);
    
    res.json({
      success: true,
      downloadUrl: `/downloads/${outputFile}`,
      message: 'Konwersja zakończona'
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Endpoint do pobierania plików
app.get('/downloads/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'downloads', req.params.filename);
  res.download(filePath);
});
```

## 🔒 Bezpieczeństwo

Backend powinien zaimplementować:
- ✅ Walidację URL po stronie serwera
- ✅ Rate limiting (np. 5 konwersji na minutę)
- ✅ Sanityzację nazw plików
- ✅ Automatyczne usuwanie starych plików
- ✅ CORS dla frontendu
- ✅ Limit rozmiaru/długości plików

## 📝 Dodatkowe funkcje

Frontend jest przygotowany na rozszerzenia:
- Progress tracking (WebSocket/Server-Sent Events)
- Batch conversion (wiele URLi)
- Format quality selection (320kbps, 1080p, etc.)
- Download history
- User accounts

## 🧪 Testowanie

Testuj z przykładowymi URLami:
```
YouTube: https://youtube.com/watch?v=dQw4w9WgXcQ
Spotify: https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh
```

Frontend automatycznie wykryje platformę i pokaże odpowiednie UI.