import axios from 'axios'
import {API_HOST} from './config'

export function getAlbumList() {
  const url = `${API_HOST}/api/music/getAlbumLib`
  return axios.get(url)
    .then(res => {
      return res.data.albumlib
    })
}
