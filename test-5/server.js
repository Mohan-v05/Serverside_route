const http = require('http');
const fs = require('fs').promises;

async function renderPage(layoutFile, contentFile) {
    try {
        let layout = await fs.readFile(layoutFile, 'utf8');
        let content = await fs.readFile(contentFile, 'utf8');

        // Extract <style> block
        const styleStart = content.indexOf('<style>');
        const styleEnd = content.indexOf('</style>');

        let style = '';
        if (styleStart !== -1 && styleEnd !== -1) {
            style = content.substring(styleStart, styleEnd + '</style>'.length);
            content = content.substring(0, styleStart) + content.substring(styleEnd + '</style>'.length);
        }

        // Extract <script> block
        const scriptStart = content.indexOf('<script>');
        const scriptEnd = content.indexOf('</script>');

        let script = '';
        if (scriptStart !== -1 && scriptEnd !== -1) {
            script = content.substring(scriptStart, scriptEnd + '</script>'.length);
            content = content.substring(0, scriptStart) + content.substring(scriptEnd + '</script>'.length);
        }

        // Replace placeholders with actual content
        const renderedPage = layout
            .replace('{{content}}', content)
            .replace('{{style}}', style)
            .replace('{{script}}', script);

        return renderedPage;
    } catch (err) {
        throw (err);
    }
}

const server = http.createServer(async (req, res) => {
    let filePath = './views/about.html';
    let layout_use = './layouts/layout_user.html';

    if (req.url === '/') {
        filePath = './views/about.html';
        layout_use = "./layouts/layout_user.html"
    }
    else if (req.url === '/about') {
        filePath = './views/about.html';
        layout_use = "./layouts/layout_user.html";
    }
    else if (req.url === '/program') {
        filePath = './views/program.html';
        layout_use = "./layouts/layout_user.html";
    }
    else if (req.url === '/price') {
        filePath = './views/price.html';
        layout_use = "./layouts/layout_user.html";
    }else if (req.url === '/gallery') {
        filePath = './views/gallery.html';
        layout_use = "./layouts/layout_user.html";
    }
    else if (req.url === '/contactus') {
        filePath = './views/contactus.html';
        layout_use = "./layouts/layout_user.html";
    }
    else if (req.url === '/admin') {
        filePath = './views/admin.html';
        layout_use = "./layouts/layout_admin.html"
    }
    else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        return res.end('<h1>404 Not Found</h1>');
    }

    try {
        let renderedPage = await renderPage(layout_use, filePath);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(renderedPage);
    } catch (err) {
        console.log(err);
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end('<h1>500 Internal Server Error</h1>');
    }

});

// Set the server to listen on port 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
