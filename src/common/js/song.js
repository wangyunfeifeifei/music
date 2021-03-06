import {getLyric, getPUrl} from 'api/song'
import {ERR_OK} from 'api/config'
import {Base64} from 'js-base64'
import {getUid} from 'common/js/uid'

export default class Song {
  constructor({id, mid, singer, name, album, albumid, albummid, duration, image, url}) {
    Object.assign(this, {
      id, mid, singer, name, album, albumid, albummid, duration, image, url
    })
  }

  getLyric() {
    // 获取歌词函数
    return new Promise((resolve, reject) => {
      getLyric(this.mid).then(res => {
        if (res.code === ERR_OK) {
          this.lyric = Base64.decode(res.lyric) // 使用base64解码
          // this.lyric = atob(escape(res.lyric))
          resolve(this.lyric)
        } else {
          reject(new Error('\'get lyric failed\''))
        }
      })
    })
  }
}

export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    albumid: musicData.albumid,
    albummid: musicData.albummid,
    duration: musicData.interval,
    image: `http://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `http://ws.stream.qqmusic.qq.com/C100${musicData.songmid}.m4a?fromtag=46` // 这里是qq音乐可用播放源
  })
}

function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}

export function changeSongsUrl(songs) {
  const uid = getUid()
  const mids = songs.map(song => {
    return song.mid
  })
  return getPUrl(mids, uid).then(res => {
    res.forEach((item, index) => {
      songs[index].url = item
    })
    return songs
  })
}
