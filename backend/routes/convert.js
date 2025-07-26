const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const ytdlp = require('yt-dlp-exec');

const downloadsDir = path.join(__dirname, '..', '..', 'frontend', 'public', 'downloads');
if (!fs.existsSync(downloadsDir)) fs.mkdirSync(downloadsDir, { recursive: true });

router.post('/', async (req, res) => {
  const { url, format } = req.body;

  if (!url || !format) {
    return res.status(400).json({
      success: false,
      error: 'Brakuje pola "url" lub "format".',
    });
  }

  const outputTemplate = path.join(downloadsDir, 'downloaded-%(title).80s.%(ext)s');

  try {
    if (format === 'mp3') {
      // Audio-only, mp3
      await ytdlp(url, {
        extractAudio: true,
        audioFormat: 'mp3',
        output: outputTemplate,
      });
    } else if (format === 'mp4') {
      // Video + audio, mp4 container
      await ytdlp(url, {
        format: 'bestvideo+bestaudio',
        mergeOutputFormat: 'mp4',
        output: outputTemplate,
      });
    } else {
      return res.status(400).json({
        success: false,
        error: 'Nieobsługiwany format.',
      });
    }

    const files = fs.readdirSync(downloadsDir);
    const latestFile = files
      .map(file => ({
        name: file,
        time: fs.statSync(path.join(downloadsDir, file)).mtime.getTime(),
      }))
      .sort((a, b) => b.time - a.time)[0]?.name;

    if (!latestFile) {
      return res.status(500).json({
        success: false,
        error: 'Nie znaleziono pobranego pliku.',
      });
    }

    const downloadUrl = `/downloads/${latestFile}`;

    return res.status(200).json({
      success: true,
      downloadUrl,
      filename: latestFile,
    });
  } catch (err) {
    console.error('Błąd yt-dlp-exec:', err);
    return res.status(500).json({
      success: false,
      error: 'Błąd przy pobieraniu lub konwersji.',
    });
  }
});

module.exports = router;
