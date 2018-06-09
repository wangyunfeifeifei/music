import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'

export function getTopList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'
  const data = Object.assign({}, commonParams, {
    tpl: 3,
    page: 'detail',
    date: `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`,
    topid: 4,
    type: 'top',
    song_begin: 0,
    song_num: 30,
    g_tk: 1748439263,
    loginUin: 981525928,
    hostUin: 0,
    platform: 'yqq'
  })

  return jsonp(url, data, options)
}
