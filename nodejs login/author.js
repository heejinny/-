//202035107 권희진
module.exports = {
    HTML: function (title, authors) {
        return `
            <!doctype html>
            <html>
            <head>
                <title>WEB1 - ${title}</title>
                <meta charset="utf-8">
            </head>
            <body> 
                <h1><a href="/">${title}</a></h1>
                <a href="/author">author</a>
                ${authors}
            </body>
            </html>
        `;
    }
}
