const { spawn } = require('child_process');
const path = require('path');

// dynamiczny import open (ESM)
const open = (...args) => import('open').then(mod => mod.default(...args));

// 1. Start backend
const backendProcess = spawn('node', ['backend/server.js'], { stdio: 'inherit' });

backendProcess.on('error', (err) => {
  console.error('❌ Błąd backendu:', err.message);
});

// 2. Start frontend
const frontendProcess = spawn('npm', ['run', 'dev', '--prefix', 'frontend'], { stdio: 'inherit' });

frontendProcess.on('error', (err) => {
  console.error('❌ Błąd frontendu:', err.message);
});

// 3. Otwórz przeglądarkę po 2 sekundach
setTimeout(async () => {
  try {
    await open('http://localhost:8080');
  } catch (err) {
    console.error('❌ Błąd otwierania przeglądarki:', err.message);
  }
}, 2000);

// (opcjonalnie) możesz zakończyć procesy na ctrl+c itp.
process.on('SIGINT', () => {
  backendProcess.kill();
  frontendProcess.kill();
  process.exit();
});
