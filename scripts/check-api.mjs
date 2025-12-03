import { spawn } from 'child_process';
import { setTimeout as delay } from 'timers/promises';

const backendDir = 'C:/Users/hh/Documents/GitHub/prj_web/gaza-support-backend';

const server = spawn('php', ['artisan', 'serve', '--host=127.0.0.1', '--port=8000'], {
  cwd: backendDir,
  stdio: ['ignore', 'pipe', 'pipe'],
});

server.stdout?.on('data', (chunk) => process.stdout.write(chunk.toString()));
server.stderr?.on('data', (chunk) => process.stderr.write(chunk.toString()));
server.on('spawn', () => console.log(`Server process started (PID ${server.pid})`));
server.on('error', (err) => console.error('Server spawn error:', err.message));
server.on('close', (code, signal) => console.log(`Server process closed (code ${code}, signal ${signal})`));

console.log('Starting Laravel server...');
await delay(1000);

const waitForServer = async () => {
  const deadline = Date.now() + 15000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/test');
      if (response.ok) {
        await response.text();
        return;
      }
    } catch (err) {
      await delay(1000);
    }
  }
  throw new Error('Timed out waiting for Laravel server to start.');
};

const endpoints = [
  '/api/test',
  '/api/donations',
  '/api/testimonials',
  '/api/admin/testimonials/pending/all',
];

try {
  await waitForServer();
  for (const endpoint of endpoints) {
    const url = `http://127.0.0.1:8000${endpoint}`;
    console.log(`=== GET ${endpoint} ===`);
    try {
      const response = await fetch(url);
      const text = await response.text();
      try {
        const parsed = JSON.parse(text);
        console.log(JSON.stringify(parsed, null, 2));
      } catch {
        console.log(text || '<empty response>');
      }
    } catch (err) {
      console.error('Request failed:', err.message);
    }
  }
} catch (err) {
  console.error('Error during verification:', err.message);
} finally {
  console.log('Stopping Laravel server...');
  server.kill();
  await delay(500);
  console.log('Server stopped.');
}
