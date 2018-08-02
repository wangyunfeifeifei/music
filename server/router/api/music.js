const Router = require('koa-router')

const music = new Router()
const musicController = require('../../controller/music')
music.get('/getRecommend', async (ctx) => {
  await musicController.getRecommend(ctx)
})

music.get('/getSingerList', async (ctx) => {
  await musicController.getSingerList(ctx)
})

music.get('/getDiscList', async (ctx) => {
  await musicController.getDiscList(ctx)
})

music.get('/getSingerDetail', async (ctx) => {
  await musicController.getSingerDetail(ctx)
})

music.get('/getSongLyric', async (ctx) => {
  await musicController.getLyric(ctx)
})

music.get('/getDiscDetail', async (ctx) => {
  await musicController.getDiscDetail(ctx)
})

music.get('/getTopList', async (ctx) => {
  await musicController.getTopList(ctx)
})

module.exports = music
