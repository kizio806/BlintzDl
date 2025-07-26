function validateInput(url, format) {
  if (!url || !format) return 'Brakuje "url" lub "format".';
  if (!/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//.test(url))
    return 'Nieprawidłowy URL YouTube.';
  if (!['mp3', 'mp4'].includes(format)) return 'Nieobsługiwany format.';
  return null;
}

module.exports = { validateInput };
