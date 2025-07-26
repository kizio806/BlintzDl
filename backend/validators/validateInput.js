function validateInput(url, format) {
  if (!url || !format) return 'Brakuje "url" lub "format".';

  const youtubeRegex = /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//;
  const soundcloudRegex = /^https?:\/\/(www\.)?soundcloud\.com\//;

  if (
    !youtubeRegex.test(url) &&
    !soundcloudRegex.test(url)
  ) {
    return 'Nieprawidłowy URL (obsługiwane: YouTube,SoundCloud).';
  }

  if (!['mp3', 'mp4'].includes(format)) return 'Nieobsługiwany format.';
  
  return null;
}

module.exports = { validateInput };
