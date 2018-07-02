<template>
  <div class="player" v-show="playlist.length">
    <!-- 播放器正常状态 start -->
    <transition name="normal"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle">
          <div class="middle-l">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="isCdRotate">
                <img class="image" :src="currentSong.image">
              </div>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="operators">
            <div class="icon i-left">
              <i class="icon-sequence"></i>
            </div>
            <div class="icon i-left">
              <i class="icon-prev" @click="preSong"></i>
            </div>
            <div class="icon i-center">
              <i :class="playIcon"  @click="togglePlay"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-next" @click="nextSong"></i>
            </div>
            <div class="icon i-right">
              <i class="icon icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <!-- 播放器正常状态 end -->
    <!-- 播放器迷你状态 start -->
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon" ref="iconWrapper">
          <img :class="isCdRotate" width="40" height="40" :src="currentSong.image">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <i :class="miniPlayIcon" @click.stop="togglePlay"></i>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <!-- 播放器迷你状态 end -->
    <audio :src="currentSong.url" ref="audio" @canplay="ready" @error="err"></audio>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
import createAnimation from 'create-keyframe-animation'

export default {
  data() {
    return {
      currentSongReady: false
    }
  },
  computed: {
    isCdRotate() {
      return this.playing ? 'play' : 'play pause' // 这里是play pause是因为如果直接取消变成pause动画就取消了 就有个瞬间转回去的效果，很突兀
    },
    playIcon() {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    miniPlayIcon() {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    ...mapGetters([
      'fullScreen',
      'playlist',
      'currentSong',
      'currentIndex',
      'playing'
    ])
  },
  methods: {
    togglePlay() {
      // 切换播放状态
      this.setPlayingState(!this.playing)
    },
    preSong() {
      if (!this.currentSongReady) return
      // 上一首歌曲
      this.currentIndex === 0 ? this.setCurrentIndex(this.playlist.length - 1) : this.setCurrentIndex(this.currentIndex - 1)
      if (!this.playing) {
        this.togglePlay()
      }
      this.currentSongReady = false
    },
    nextSong() {
      if (!this.currentSongReady) return
      // 下一首歌曲
      this.currentIndex === this.playlist.length - 1 ? this.setCurrentIndex(0) : this.setCurrentIndex(this.currentIndex + 1)
      if (!this.playing) {
        this.togglePlay()
      }
      this.currentSongReady = false
    },
    ready() {
      // 歌曲加载成功
      this.currentSongReady = true
    },
    err() {
      // 歌曲加载失败
      console.log('歌曲加载错误')
      this.currentSongReady = true
    },
    back() {
      // 缩小播放器
      this.setFullScreen(false)
    },
    open() {
      // 放大播放器
      this.setFullScreen(true)
    },
    /* ======== 播放器的动画逻辑 start  =========== */
    enter(el, done) {
      const {x, y, scale} = this._getPosAndScale()

      let animation = {
        0: {
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0, 0, 0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0, 0, 0) scale(1)`
        }
      }

      createAnimation.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 400,
          easing: 'linear'
        }
      })

      createAnimation.runAnimation(this.$refs.cdWrapper, 'move', done)
    },
    afterEnter(el) {
      this.$refs.cdWrapper.style.animation = ''
      createAnimation.unregisterAnimation('move')
    },
    leave(el, done) {
      const {x, y, scale} = this._getPosAndScale()

      let animation = {
        0: {
          transform: `translate3d(${-x}px, ${-y}px, 0) scale(${1 / scale})`
        },
        60: {
          transform: `translate3d(0, 0, 0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0, 0, 0) scale(1)`
        }
      }

      createAnimation.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 300,
          easing: 'ease-in'
        }
      })

      createAnimation.runAnimation(this.$refs.iconWrapper, 'move', done)
    },
    afterLeave(el) {
      this.$refs.cdWrapper.style.animation = ''
      createAnimation.unregisterAnimation('move')
    },
    _getPosAndScale() {
      // 获取位置及缩放尺寸
      const targetWidth = 40 // 迷你播放器图片宽高
      const paddingLeft = 40 // 迷你播放器中心距左边的距离
      const paddingBottom = 30 // 迷你播放器中心距右边的距离
      const paddingTop = 80 // normal播放器的top
      const width = window.innerWidth * 0.8
      const scale = targetWidth / width
      const x = -(window.innerWidth / 2 - paddingLeft)
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
      return {
        x,
        y,
        scale
      }
    },
    /* ======== 播放器的动画逻辑 end  =========== */
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayingState: 'SET_PLAYING_STATE'
    })
  },
  watch: {
    currentSong(newSong) {
      this.$nextTick(() => {
        this.$refs.audio.play()
        this.setPlayingState(true)
      })
    },
    playing(newState) {
      // 监听playing的状态,控制播放和暂停
      this.$nextTick(() => {
        newState ? this.$refs.audio.play() : this.$refs.audio.pause()
      })
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>