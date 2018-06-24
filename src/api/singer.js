import { API_HOST } from './config'
import axios from 'axios'

export function getSingerList() {
  const url = `${API_HOST}/api/music/getSingerList`

  return axios.get(url)
    .then(res => {
      return res.data
    })
}

export function getSingerDetail(mid) {
  const url = `${API_HOST}/api/music/getSingerDetail?mid=${mid}`

  return axios.get(url)
    .then(res => {
      return res.data
    })
}
