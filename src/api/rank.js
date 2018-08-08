import axios from 'axios'
import {API_HOST} from './config'

export function getTopList() {
  const url = `${API_HOST}/api/music/getTopList`
  return axios.get(url)
    .then(res => {
      return res.data
    })
}

export function getTopListDetail(topid) {
  const url = `${API_HOST}/api/music/getTopListDetail?topid=${topid}`
  return axios.get(url)
    .then(res => {
      return res.data
    })
}
