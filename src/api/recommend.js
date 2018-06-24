import {API_HOST} from './config'
import axios from 'axios'

export function getRecommend() {
  const url = `${API_HOST}/api/music/getRecommend`

  return axios.get(url)
    .then(res => {
      return res.data
    })
}

export function getDiscList() {
  const url = `${API_HOST}/api/music/getDiscList`

  return axios.get(url)
    .then(res => {
      return res.data
    })
}
