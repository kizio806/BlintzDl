const path = require('path');
const fs = require('fs');
const { randomUUID } = require('crypto');
const ytdlp = require('yt-dlp-exec');

const downloadsDir = path.join(__dirname, '..', '..', 'frontend', 'public', 'downloads');
if (!fs.existsSync(downloadsDir)) fs.mkdirSync(downloadsDir, { recursive: true });

async function convertMedia(url, format) {
  const uuid = randomUUID();
  const outputTemplate = path.join(downloadsDir, `dl-${uuid}.%(ext)s`);

  const options = {
    output: outputTemplate,
    noCheckCertificates: true,
    preferFreeFormats: true,
    quiet: true,
  };

  if (format === 'mp3') {
    options.extractAudio = true;
    options.audioFormat = 'mp3';
  } else if (format === 'mp4') {
    options.format = 'bestvideo+bestaudio';
    options.mergeOutputFormat = 'mp4';
  }
  
  const result = await Promise.race([
    ytdlp(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject({ code: 'TIMEOUT', publicMessage: 'Operacja trwała zbyt długo.' }), 120000)
    ),
  ]);

  const files = fs.readdirSync(downloadsDir);
  const file = files.find(f => f.startsWith(`dl-${uuid}`));
  if (!file) throw new Error('Nie znaleziono pobranego pliku.');

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
