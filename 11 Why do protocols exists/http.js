const http = require('http');

const server = http.createServer((req, res) => {
    console.log("Method:", req.method);
    console.log("URL:", req.url);
    console.log("Headers:", req.headers);

    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello from raw HTTP server');
});

server.listen(3000, () => {
    console.log('Server running on port 3000');
});