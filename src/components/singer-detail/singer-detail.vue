<template>
  <transition name="slide">
    <div class="singer-detail">

    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import {mapGetters} from 'vuex'
import {getSingerDetail} from 'api/singer'
import {ERR_OK} from 'api/config'

export default {
  computed: {
    ...mapGetters([
      'singer'
    ])
  },
  created() {
    console.log(this.singer)
    this._getDetail()
  },
  methods: {
    _getDetail() {
      if (!this.singer.id) {
        // 如果vuex中没有singer,就回退到歌手列表，比如直接刷新的时候
        this.$router.push('/singer')
        return
      }
      getSingerDetail(this.singer.mid).then(res => {
        if (ERR_OK === res.code) {
          console.log(res.data)
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .singer-detail
    position: fixed
    z-index: 100
    top: 0
    left: 0
    right: 0
    bottom: 0
    background: $color-background
  .slide-enter-active,
  .slide-leave-active
    transition: all 0.3s
  .slide-enter
    transform: translate3d(100%, 0, 0)
  .slide-leave-to
    transform: translate3d(-100%, 0, 0)
</style>
