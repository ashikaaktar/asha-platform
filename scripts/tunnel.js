const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const cloudflaredPath = 'C:\\Users\\MS ASHIKA AKTAR\\AppData\\Local\\Programs\\cloudflared.exe';
const stateFile = path.join(__dirname, '..', 'public-tunnel.json');

console.log('Starting Cloudflare Tunnel for ASHA...');

const child = spawn(cloudflaredPath, ['tunnel', '--url', 'http://localhost:3000'], {
  stdio: ['ignore', 'pipe', 'pipe']
});

let tunnelUrl = null;

function handleLine(line) {
  const match = line.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/i);
  if (match && !tunnelUrl) {
    tunnelUrl = match[0];
    console.log('PUBLIC TUNNEL READY:', tunnelUrl);
    fs.writeFileSync(stateFile, JSON.stringify({
      url: tunnelUrl,
      updatedAt: new Date().toISOString()
    }, null, 2));
  }
}

child.stdout.on('data', (d) => {
  d.toString().split('\n').forEach(handleLine);
});

child.stderr.on('data', (d) => {
  d.toString().split('\n').forEach(handleLine);
});

child.on('close', (code) => {
  console.log('Tunnel exited with code', code);
});
