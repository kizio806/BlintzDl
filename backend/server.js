const express = require('express');
const cors = require('cors');
const path = require('path');

const convertRoute = require('./routes/convert'); // <- nowy endpoint konwersji

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Endpoint konwersji
app.use('/api/convert', convertRoute);

// Statyczne pliki (np. pliki do pobrania)
app.use('/downloads', express.static(path.join(__dirname, '../downloads')));

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
