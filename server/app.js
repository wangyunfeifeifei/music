const Koa = require('koa')
const chalk = require('chalk')

const config = require('./config/index')
const router = require('./router/index')

const app = new Koa()

app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*')
  ctx.set('Content-Type', 'application/json')
  await next()
})

app.use(router.routes())
   .use(router.allowedMethods())

app.listen(config.PORT, config.HOST, () => {
  console.log(`server is start at ${chalk.green(`http://${config.HOST}:${config.PORT}`)}`)
})
