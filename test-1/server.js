const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    // Set the default route
    let filePath = './views/home.html';

    // Handle different routes
    if (req.url === '/') {
        filePath = './views/home.html';
    } else if (req.url === '/about') {
        filePath = './views/about.html';
    }

    else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>');
        return;
    }

    // Read the layout file
    fs.readFile('./views/layout.html', 'utf8', function (err, layout) {
        if (err) {
            console.log(err);
            res.writeHead(500, { 'Content-Type': 'text/html' });
            res.end('<h1>500 Internal Server Error</h1>');

            return;
        }

        // Read the content file
        fs.readFile(filePath, 'utf8', (err, content) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end('<h1>500 Internal Server Error</h1>');
                return;
            }

            // Replace the placeholder with the actual content
            const renderedPage = layout.replace('{{content}}', content);
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(renderedPage);
        });
    });
});

// Set the server to listen on port 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
