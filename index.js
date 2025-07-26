const { spawn } = require('child_process');
const path = require('path');

async function openBrowser(url) {
  const mod = await import('open');
  return mod.default(url);
}

const backendProcess = spawn('node', ['backend/server.js'], { stdio: 'inherit' });

backendProcess.on('error', (err) => {
  console.error('❌ Błąd backendu:', err.message);
});

const frontendProcess = spawn('npm', ['run', 'dev', '--prefix', 'frontend'], { stdio: 'inherit' });

frontendProcess.on('error', (err) => {
  console.error('❌ Błąd frontendu:', err.message);
});

// Poczekaj zanim odpalisz przeglądarkę (brzydki timeout, lepiej użyć wait-on)
setTimeout(() => {
  openBrowser('http://localhost:8080').catch(err =>
    console.error('❌ Błąd otwierania przeglądarki:', err.message)
  );
}, 2000);

// Obsługa sygnałów zakończenia
['SIGINT', 'SIGTERM', 'exit', 'uncaughtException'].forEach(event => {
  process.on(event, () => {
    backendProcess.kill();
    frontendProcess.kill();
    process.exit();
  });
});
