const {commonParams} = require('./config')
const request = require('superagent')

class MusicController {
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

  // 获取歌单列表
  async getDiscList(ctx) {
    const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
    const data = Object.assign({}, commonParams, {
      g_tk: 756018626,
      platform: 'yqq',
      hostUin: 0,
      sin: 0,
      ein: 29,
      sortId: 5,
      picmid: 1,
      needNewCode: 0,
      loginUin: 981525928,
      categoryId: 10000000,
      rnd: Math.random(),
      format: 'json'
    })
    ctx.body = await request.get(url)
      .query(data)
      .set({
        referer: 'https://y.qq.com/portal/playlist.html'
      })
      .set('host', 'c.y.qq.com')
      .then(res => {
        return res
      })
  }
  // 获取歌单详情
  async getDiscDetail(ctx) {
    const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
    // TODO 获取歌单详情
    const data = Object.assign({}, commonParams, {
      disstid: ctx.query.disstid,
      type: 1,
      json: 1,
      urf8: 1,
      onlysong: 0,
      format: 'json',
      g_tk: 668456545,
      loginUin: 981525928,
      hostUin: 0,
      platform: 'yqq',
      needNewCode: 0
    })
    ctx.body = await request.get(url)
      .query(data)
      .set('referer', 'https://y.qq.com/n/yqq/playsquare/3269852386.html')
      .then(res => {
        console.log(ctx.query.dissid)
        console.log(res.text)
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
        return res.text
      })

  }

  // 获取歌手详情
  async getSingerDetail(ctx) {
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
    const data = Object.assign({}, commonParams, {
      g_tk: 1145974907,
      loginUin: 981525928,
      hostUin: 0,
      platform: 'yqq',
      needNewCode: 0,
      singermid: ctx.query.mid,
      order: 'listen',
      begin: 0,
      num: 100,
      songstatus: 1
    })
    ctx.body = await request.get(url)
      .query(data)
      .then(res => {
        return res.text
      })
  }

  // 获取歌词信息
  async getLyric(ctx) {
    const url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
    const data = Object.assign({}, commonParams, {
      platform: 'yqq',
      needNewCode: 0,
      songmid: ctx.query.mid,
      pcachetime: +new Date(),
      hostUin: 0,
      format: 'json'
    })
    ctx.body = await request(url)
      .query(data)
      .set({
        referer: 'https://y.qq.com/portal/player.html'
      })
      .then(res => {
        if (typeof res.text === 'string') {
          let reg = /^\w+\(({[^()]+})\)$/
          let data = reg.exec(res.text)[1] || ''
          return data
        }
        return res.text
      })
  }
}

module.exports = new MusicController()
