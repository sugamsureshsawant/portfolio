/**
 * Portfolio Server
 * ----------------
 * Security features:
 *   - No-Cache headers on Admin Panel routes to prevent back-button caching
 *   - Clean URL rewrites (http://localhost/ and http://localhost/daemon)
 */

const http = require('http');
const path = require('path');
const fs   = require('fs');

const PORT = process.env.PORT || 80;
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.webp': 'image/webp',
  '.json': 'application/json',
};

function serveFile(res, filePath, isPrivate = false) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }
    const ext  = path.extname(filePath).toLowerCase();
    const mime = MIME[ext] || 'application/octet-stream';
    const headers = { 'Content-Type': mime };
    
    if (isPrivate) {
      headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, private';
      headers['Pragma'] = 'no-cache';
      headers['Expires'] = '0';
    }

    res.writeHead(200, headers);
    res.end(data);
  });
}

function startServer(port) {
  const server = http.createServer((req, res) => {
    let urlPath = req.url.split('?')[0].replace(/\/+$/, '') || '/';
    console.log('[' + new Date().toTimeString().slice(0, 8) + '] ' + req.method + ' ' + urlPath);

    // Main Portfolio Route (http://localhost/ and http://localhost/main)
    if (urlPath === '/' || urlPath === '/main' || urlPath === '/index.html') {
      return serveFile(res, path.join(ROOT, 'index.html'));
    }

    // Admin Panel Route (http://localhost/daemon and http://localhost/main/daemon) - Served with NO-CACHE headers
    if (urlPath === '/daemon' || urlPath === '/main/daemon' || urlPath === '/admin.html') {
      return serveFile(res, path.join(ROOT, 'admin.html'), true);
    }

    // Static assets (CSS, JS, Images...)
    const cleanAsset = path.basename(urlPath);
    let filePath = path.join(ROOT, cleanAsset);

    // Security check
    if (!filePath.startsWith(ROOT)) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('403 Forbidden');
      return;
    }

    fs.stat(filePath, (err, stat) => {
      if (err || !stat.isFile()) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
        return;
      }
      serveFile(res, filePath);
    });
  });

  server.on('error', (err) => {
    if (err.code === 'EACCES' || err.code === 'EADDRINUSE') {
      console.log(`Port ${port} in use or requires elevation. Falling back to port 3000...`);
      startServer(3000);
    } else {
      console.error('Server error:', err);
    }
  });

  server.listen(port, () => {
    const pStr = port === 80 ? '' : ':' + port;
    console.log('');
    console.log('  ╔══════════════════════════════════════════════════════════╗');
    console.log('  ║              Portfolio Server Running!                   ║');
    console.log('  ╚══════════════════════════════════════════════════════════╝');
    console.log('');
    console.log(`  Portfolio : http://localhost${pStr}/`);
    console.log(`  Admin     : http://localhost${pStr}/daemon`);
    console.log('');
    console.log('  Press Ctrl+C to stop.');
    console.log('');
  });
}

startServer(PORT);
