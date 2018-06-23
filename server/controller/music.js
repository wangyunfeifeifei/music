const {commonParams} = require('./config')
const request = require('superagent')

class MusicController  {
  constructor() {
  }
  // 获取推荐页面信息
  async getRecommend(ctx) {
    const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
    const data = Object.assign({}, commonParams, {
      platform: 'h5',
      uin: 981525928,
      needNewCode: 1
    })
    ctx.body = await request.get(url)
           .query(data)
           .then(res => {
             return res.text
           })
  }
  // 获取歌手列表
  async getSingerList(ctx) {
    const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
    const data = Object.assign({}, commonParams, {
      channel: 'singer',
      page: 'list',
      key: 'all_all_all',
      g_tk: 1748439263,
      pagesize: 100,
      pagenum: 1,
      loginUin: 981525928,
      hostUin: 0,
      platform: 'yqq',
      needNewCode: 0
    })
    ctx.body = await request.get(url)
                    .query(data)
                    .then(res => {
                      console.log(res.text)
                      return res.text
                    })

  }
}

module.exports = new MusicController()
