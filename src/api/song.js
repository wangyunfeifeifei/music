import axios from 'axios'
import {API_HOST} from './config'

export function getLyric(mid) {
  const url = `${API_HOST}/api/music/getSongLyric`

  return axios.get(url, {
    params: {mid}
  }).then(res => {
    return res.data
  })
}

export function getPUrl(mids, uid) {
  const url = `${API_HOST}/api/music/getPUrl`

  return axios.post(url, {
    mids, uid
  }).then(res => {
    return res.data
  })
}
