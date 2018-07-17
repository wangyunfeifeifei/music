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
