const path = require('path');
const fs = require('fs');
const { randomUUID } = require('crypto');
const ytdlp = require('yt-dlp-exec');

const downloadsDir = path.join(__dirname, '..', '..', 'frontend', 'public', 'downloads');
if (!fs.existsSync(downloadsDir)) fs.mkdirSync(downloadsDir, { recursive: true });

async function convertMedia(url, format) {
  const uuid = randomUUID();
  const outputTemplate = path.join(downloadsDir, `dl-${uuid}.%(ext)s`);

  const formatOptionsMap = {
    mp3: { extractAudio: true, audioFormat: 'mp3' },
    wav: { extractAudio: true, audioFormat: 'wav' },
    m4a: { extractAudio: true, audioFormat: 'm4a' },
    ogg: { extractAudio: true, audioFormat: 'vorbis' },
    flac: { extractAudio: true, audioFormat: 'flac' },
    mp4: { format: 'bestvideo+bestaudio', mergeOutputFormat: 'mp4' },
    webm: { format: 'bestvideo+bestaudio', mergeOutputFormat: 'webm' },
    mkv: { format: 'bestvideo+bestaudio', mergeOutputFormat: 'mkv' },
  };

  if (!formatOptionsMap[format]) {
    throw new Error(`Nieobsługiwany format: ${format}`);
  }

  const options = {
    output: outputTemplate,
    noCheckCertificates: true,
    preferFreeFormats: true,
    quiet: true,
    ...formatOptionsMap[format],
  };

  const result = await Promise.race([
    ytdlp(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject({ code: 'TIMEOUT', publicMessage: 'Operacja trwała zbyt długo.' }), 120000)
    ),
  ]);

  const files = fs.readdirSync(downloadsDir);
  const file = files.find(f => f.startsWith(`dl-${uuid}`));
  if (!file) throw new Error('Nie znaleziono pobranego pliku.');

  // Auto-cleanup po 10 min
  setTimeout(() => {
    try {
      fs.unlinkSync(path.join(downloadsDir, file));
      console.log(`🗑️ Usunięto: ${file}`);
    } catch (e) {
      console.warn(`⚠️ Cleanup fail: ${file}`, e.message);
    }
  }, 10 * 60 * 1000);

  return {
    filename: file,
    downloadUrl: `/downloads/${file}`,
  };
}

module.exports = { convertMedia };
