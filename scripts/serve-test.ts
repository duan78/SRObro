/**
 * Simple HTTP Test Server
 *
 * Serves the test HTML file for Babylon.js skinning test
 */

import http from 'http';
import fs from 'fs';
import path from 'path';

const PORT = 8080;
const CLIENT_DIR = path.resolve(__dirname, '../client');

const mimeTypes: Record<string, string> = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.glb': 'model/gltf-binary',
};

const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);

    // Default to test-skinning.html
    let url = req.url === '/' ? '/test-skinning.html' : req.url;

    // Remove query string
    url = url.split('?')[0];

    const filePath = path.join(CLIENT_DIR, url);

    // Security check
    if (!filePath.startsWith(CLIENT_DIR)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }

    // Check if file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            res.writeHead(404);
            res.end('Not Found');
            return;
        }

        // Get file extension
        const ext = path.extname(filePath);
        const contentType = mimeTypes[ext] || 'application/octet-stream';

        // Read and serve file
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Internal Server Error');
                return;
            }

            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        });
    });
});

server.listen(PORT, () => {
    console.log('='.repeat(60));
    console.log('🌐 Test Server Running');
    console.log('='.repeat(60));
    console.log(`\nServer running at: http://localhost:${PORT}`);
    console.log(`\n📁 Serving directory: ${CLIENT_DIR}`);
    console.log(`\n🧪 Test page: http://localhost:${PORT}/test-skinning.html`);
    console.log('\nPress Ctrl+C to stop');
    console.log('='.repeat(60));
});
