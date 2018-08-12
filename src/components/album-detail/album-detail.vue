<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
import MusicList from 'components/music-list/music-list'
import {mapGetters} from 'vuex'
import {getAlbumInfo} from 'api/album'
import {ERR_OK} from 'api/config'
import {createSong, changeSongsUrl} from 'common/js/song'

export default {
  name: 'album-detail',
  data() {
    return {
      songs: []
    }
  },
  computed: {
    title() {
      return this.album.album_name
    },
    bgImage() {
      return this._normalizeImageUrl(this.album.album_mid)
    },
    ...mapGetters([
      'album'
    ])
  },
  created() {
    if (!this.album.album_id) {
      this.$router.push('/album')
      return
    }
    this._getAlbumInfo()
    console.log(this.album)
  },
  methods: {
    _normalizeImageUrl(mid) {
      return `https://y.gtimg.cn/music/photo_new/T002R300x300M000${mid}.jpg?max_age=2592000`
    },
    _getAlbumInfo() {
      getAlbumInfo(this.album.album_mid).then(res => {
        if (ERR_OK === res.code) {
          changeSongsUrl(this._normalizeSongs(res.data.list)).then(res => {
            console.log(res)
            alert(1)
            this.songs = res
          })
        }
      })
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach(item => {
        if (item.songid && item.albumid) {
          ret.push(createSong(item))
        }
      })
      return ret
    }
  },
  components: {
    MusicList
  }
}
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"

  .slide-enter-active,
  .slide-leave-active
    transition: all 0.3s
  .slide-enter
    transform: translate3d(100%, 0, 0)
  .slide-leave-to
    transform: translate3d(-100%, 0, 0)
</style>
