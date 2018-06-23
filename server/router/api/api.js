const Router = require('koa-router')

const music = require('./music')

const API = new Router()

API.use('/music', music.routes(), music.allowedMethods())

module.exports = API
