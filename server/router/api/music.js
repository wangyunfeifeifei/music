const Router = require('koa-router')

const music = new Router()
const musicController = require('../../controller/music')
music.get('/getRecommend', async (ctx) => {
  await musicController.getRecommend(ctx)
})

music.get('/getSingerList', async (ctx) => {
  await musicController.getSingerList(ctx)
})

module.exports = music
