import {playMode} from 'common/js/config'

const state = {
  singer: {}, // 歌手
  disc: {}, // 歌单
  topList: {}, // 排行榜
  playing: false, // 是否播放中
  fullScreen: false, // 是否展开
  playlist: [], // 播放列表
  sequenceList: [], // 顺序的播放列表
  mode: playMode.sequence, // 播放模式
  currentIndex: -1 // 当前播放是哪首歌
}

export default state
