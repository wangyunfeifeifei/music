import jsonp from 'common/js/jsonp'
import { commonParams, options } from './config'

export function getSingerList() {
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

  return jsonp(url, data, options)
}

export function getSingerDetail(mid) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
  const data = Object.assign({}, commonParams, {
    g_tk: 1145974907,
    loginUin: 981525928,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    singermid: mid,
    order: 'listen',
    begin: 0,
    num: 100,
    songstatus: 1
  })

  return jsonp(url, data, options)
}
