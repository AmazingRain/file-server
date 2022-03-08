const KoaRouter = require('koa-router');
const router = new KoaRouter({ prefix: '/api' });

const { host, port } = require('../config');

router.post('/upload', async (ctx) => {
    const file = ctx.request.files?.file;
    const [_, url] = file.path.split('static');
    if (file) {
        ctx.body = {
            url: `${host}:${port}${url}`,
            code: 1000,
        }
    } else {
        ctx.body = {
            msg: '文件上传失败',
            code: 2000,
        }
    }
})

router.get('/test', async (ctx) => {
    ctx.body = {
        msg: '测试数据',
        data: [
            {id: 1, name: '张三'},
            {id: 2, name: '李四'},
        ]
    }
})
module.exports = router;