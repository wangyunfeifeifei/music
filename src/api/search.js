import {API_HOST} from './config'
import axios from 'axios'

export function getHotKey() {
  const url = `${API_HOST}/api/music/getHotKey`

  return axios.get(url).then(data => {
    return data.data
  })
}
