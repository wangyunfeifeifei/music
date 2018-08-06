<template>
  <transition name="slide">
    <music-list :title="title" ></music-list>
  </transition>
</template>

<script>
import MusicList from 'components/music-list/music-list'
import {mapGetters} from 'vuex'
export default {
  name: 'top-list',
  computed: {
    title() {
      return this.topList.topTitle
    },
    ...mapGetters([
      'topList'
    ])
  },
  mounted() {
    console.log(this.topList)
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
