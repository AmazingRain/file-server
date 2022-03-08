const Koa = require('koa');
const koaBody = require('koa-body');
const path = require('path');
const KoaStatic = require('koa-static');
const fs = require('fs');
const https = require('https');
const sslify = require('koa-sslify').default;
const http = require('http');

const app = new Koa();

const router = require('./router');
const {
    getRandomString,
    getUploadDirName,
    checkDirExist,
} = require('./utils');

const { port, maxSize } = require('./config');



app
    .use(sslify())
    .use(async (ctx, next) => {
        ctx.set('Access-Control-Allow-Origin', '*');
        ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
        ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
        if (ctx.method == 'OPTIONS') {
            ctx.body = 200;
        } else {
            await next();
        }
    })
    .use(koaBody({
        multipart: true,
        formidable: {
            uploadDir: path.join(__dirname, './static/upload'),
            keepExtensions: true,
            maxFileSize: maxSize,
            onFileBegin: (name, file) => {
                const ext = path.extname(file.path);
                let dir = path.join(__dirname, './static/upload', getUploadDirName());
                checkDirExist(dir);
                const fileName = getRandomString(32) + Date.now() + ext;
                file.path = `${dir}/${fileName}`;
            },
            onError: (err) => {
                console.log(err);
            }
        },
    }))
    .use(KoaStatic(path.join(__dirname, 'static')))
    .use(router.routes());


const options = {
    key: fs.readFileSync('./https/080925.xyz.key'),
    cert: fs.readFileSync('./https/080925.xyz_bundle.pem'),
}


https.createServer(options, app.callback())
.listen(port, (err) => {
    if (err) {
        console.log('服务器启动出错', err);
    } else {
        console.log(`running in ${port}`);
    }
})

http.createServer((req, res) => {
    res.writeHead(301, { 'Location': `https://localhost:9000${req.url}` });
    res.end();
}).listen(80);

// app.listen(port, (err) => {
//     if (err) {
//         return console.log(err);
//     }
//     console.log(`running in ${port}`);
// })
