<template>
  <div class="album">
    <scroll class="albumlist" :data="albumList">
      <ul>
        <li class="item" v-for="album in albumList" :key="album.album_id">
          <div class="icon">
            <img width="100%" v-lazy="_normalizeImageUrl(album.album_mid)">
          </div>
          <div class="text">
            <h2 class="name">{{album.album_name}}</h2>
            <p class="singers">{{_normalizeSingers(album)}}</p>
            <p class="time">{{album.public_time}}</p>
          </div>
        </li>
      </ul>
      <div class="loading-container" v-if="!albumList.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
import {getAlbumList} from 'api/album'
import {ERR_OK} from 'api/config'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'

export default {
  created() {
    this._getAlbumList()
  },
  data() {
    return {
      albumList: []
    }
  },
  methods: {
    _getAlbumList() {
      getAlbumList().then(res => {
        if (res.code === ERR_OK) {
          this.albumList = res.data.list
        }
      })
    },
    _normalizeImageUrl(mid) {
      return `https://y.gtimg.cn/music/photo_new/T002R300x300M000${mid}.jpg?max_age=2592000`
    },
    _normalizeSingers(album) {
      let ret = []
      album.singers.forEach(item => {
        ret.push(item.singer_name)
      })
      return ret.join(' / ')
    }
  },
  components: {
    Scroll, Loading
  }
}
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable"
@import "~common/stylus/mixin"

.album
  position: fixed
  top: 88px
  bottom: 0
  width: 100%
  .albumlist
    height: 100%
    overflow: hidden
    font-size: 0
    .item
      margin: 20px 3% 0
      overflow: hidden
      display: inline-block
      font-size: $font-size-medium
      vertical-align: top
      width: 44%
      .icon
        width: 100%
        margin-bottom: 15px
      .text
        font-size: $font-size-medium
        color: $color-text-l
        line-height: 20px
        .name
          color: $color-text
          font-weight: 400
        .singers
          no-wrap()
  .loading-container
    position: absolute
    top: 50%
    width: 100%
    transform: translateY(-50%)
</style>
