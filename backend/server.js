const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const convertRoute = require('./routes/convert');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/convert', convertRoute);

const downloadsPath = path.join(__dirname, '../downloads');
if (!fs.existsSync(downloadsPath)) {
  console.warn('⚠️ Katalog /downloads nie istnieje. Tworzę...');
  fs.mkdirSync(downloadsPath, { recursive: true });
}
app.use('/downloads', express.static(downloadsPath));

app.use((req, res) => {
  res.status(404).json({ error: 'Nie znaleziono zasobu' });
});

app.use((err, req, res, next) => {
  console.error('❌ Błąd aplikacji:', err);
  res.status(500).json({ error: 'Coś poszło nie tak w backendzie.' });
});

const server = app.listen(PORT, () => {
  console.log(`✅ Backend listening on http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
  console.log('👋 Zamykam backend...');
  server.close(() => {
    console.log('✅ Backend zakończył pracę');
    process.exit(0);
  });
});
