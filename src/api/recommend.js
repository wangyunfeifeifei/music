import {commonParams} from './config'
import axios from 'axios'

export function getRecommend() {
  return axios.get('http://localhost:3000/api/music/getRecommend')
    .then(res => {
      return res.data
    })
}

export function getDiscList() {
  const url = '/api/getDiscList'
  const data = Object.assign({}, commonParams, {
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

  return axios.get(url, {
    params: data
  }).then(res => {
    return res.data
  })
}
