const Router = require('koa-router')

const API = require('./api/api')

const router = new Router()

router.use('/api', API.routes(), API.allowedMethods())

module.exports = router
