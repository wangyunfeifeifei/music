<template>
  <transition name="slide">
    <music-list :title="title" :songs="songs" :bg-image="bgImage"></music-list>
  </transition>
</template>

<script>
import MusicList from 'components/music-list/music-list'
import {mapGetters} from 'vuex'
import {getTopListDetail} from 'api/rank'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'

export default {
  name: 'top-list',
  created() {
    this._getTopListDetail()
  },
  data() {
    return {
      songs: []
    }
  },
  computed: {
    title() {
      return this.topList.topTitle
    },
    bgImage() {
      if (this.songs.length) {
        return this.songs[0].image
      }
      return ''
    },
    ...mapGetters([
      'topList'
    ])
  },
  methods: {
    _getTopListDetail() {
      if (!this.topList.id) {
        this.$router.push('/rank')
        return
      }
      getTopListDetail(this.topList.id)
        .then(res => {
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSongs(res.songlist)
          }
        })
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach(item => {
        let {data} = item
        if (data.albumid && data.songid) {
          ret.push(createSong(data))
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

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition all 0.3s ease
  .slide-enter
    transform translate3d(100%, 0, 0)
  .slide-leave-to
    transform translate3d(-100%, 0, 0)
</style>
