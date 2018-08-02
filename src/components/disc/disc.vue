<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import MusicList from 'components/music-list/music-list'
import {mapGetters} from 'vuex'
import { getDiscDetail } from 'api/recommend'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'

export default {
  data() {
    return {
      songs: []
    }
  },
  computed: {
    title() {
      return this.disc.dissname
    },
    bgImage() {
      return this.disc.imgurl
    },
    ...mapGetters([
      'disc'
    ])
  },
  created() {
    this._getDiscDetail()
  },
  methods: {
    _getDiscDetail() {
      if (!this.disc.dissid) {
        this.$router.push('/recommend')
        return
      }
      getDiscDetail(this.disc.dissid).then(res => {
        if (res.code === ERR_OK) {
          console.log(res.cdlist[0].songlist)
          this._normalizeSongs(res.cdlist[0].songlist)
        }
      })
    },
    _normalizeSongs(list) {
      this.songs = list.map(val => {
        return createSong(val)
      })
    }
  },
  components: {
    MusicList
  }
}
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slide-enter-active,
  .slide-leave-active
    transition: all 0.3s
  .slide-enter
    transform: translate3d(100%, 0, 0)
  .slide-leave-to
    transform: translate3d(-100%, 0, 0)
</style>
