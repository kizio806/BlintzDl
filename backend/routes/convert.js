const express = require('express');
const router = express.Router();
const { validateInput } = require('../validators/validateInput');
const { convertMedia } = require('../services/convertMedia');

router.post('/', async (req, res) => {
  const { url, format } = req.body;

  const error = validateInput(url, format);
  if (error) return res.status(400).json({ success: false, error });

  try {
    const result = await convertMedia(url, format);
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    console.error('❌ Konwersja nie powiodła się:', err.message);
    const status = err.code === 'TIMEOUT' ? 504 : 500;
    return res.status(status).json({
      success: false,
      error: err.publicMessage || 'Błąd serwera.',
    });
  }
});

module.exports = router;
