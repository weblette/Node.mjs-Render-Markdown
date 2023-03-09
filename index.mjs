import http from 'http';
import fileFromRequest from './static-files.mjs';
import fetch from 'node-fetch';
const git = 'https://github.com/weblette/Node.mjs-Render-Markdown/blob/main';

http.createServer(onRequest).listen(3000);

async function onRequest(req, res) {
const hostProxy = req.headers['host'];
  if (req.url == '/ping') {
    res.statusCode = 200;
    return res.end();
  }
  
  let URI = req.url.replaceAll('*', '');
  let shortURI = URI.split('?')[0].split('#')[0];

  let md = shortURI.split('.');
  let mdx = md[md.length - 1];
  if(mdx=='md'){
    let mdres = await fetch(git+shortURI);
    let mdtext = await mdres.text();
    mdtext=mdtext.replace('<head>',
        `<head modified>
         <link rel="stylesheet" href="https://`+hostProxy+`/md.css">`);
    res.statusCode = 200;
    return res.end(mdtext);
  }
  return fileFromRequest(req, res);
}


