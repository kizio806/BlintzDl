function validateInput(url, format) {
  if (!url || !format) return 'Brakuje "url" lub "format".';

  const youtubeRegex = /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//;
  const soundcloudRegex = /^https?:\/\/(www\.)?soundcloud\.com\//;

  if (
    !youtubeRegex.test(url) &&
    !soundcloudRegex.test(url)
  ) {
    return 'Nieprawidłowy URL (obsługiwane: YouTube, SoundCloud).';
  }

  const supportedFormats = ['mp3', 'wav', 'm4a', 'ogg', 'flac', 'mp4', 'webm', 'mkv'];
  if (!supportedFormats.includes(format)) return `Nieobsługiwany format: ${format}`;

  return null;
}

module.exports = { validateInput };
