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
        <div class="middle"
             @touchstart.prevent="middleTouchStart"
             @touchmove.prevent="middleTouchMove"
             @touchend="middleTouchEnd"
        >
          <!-- 播放器专辑页面 start -->
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="isCdRotate">
                <img class="image" :src="currentSong.image">
              </div>
            </div>
          </div>
          <!-- 播放器专辑页面 end -->
          <!-- 播放器歌词页面 start -->
          <Scroll class="middle-r" ref="lyricList"  :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <!-- 每一行的歌词 -->
                <p ref="lyricLine"
                  class="text"
                   v-for="(line, index) in currentLyric.lines"
                   :key="index"
                   :class="{'current':currentLineNum === index}"
                >{{line.txt}}</p>
              </div>
            </div>
          </Scroll>
          <!-- 播放器歌词页面 end -->
        </div>
        <div class="bottom">
          <!-- 进度条相关 start -->
          <div class="dot-wrapper">
            <span class="dot" :class="{'active': currentShow==='cd'}"></span>
            <span class="dot" :class="{active: currentShow === 'lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{_formatTime(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @changePercent="progressPercentChange"></progress-bar>
            </div>
            <span class="time time-r">{{_formatTime(currentSong.duration)}}</span>
          </div>
          <!-- 进度条相关 end -->
          <!-- 操作区相关 start -->
          <div class="operators">
            <div class="icon i-left">
              <i @click="changeMode" :class="iconMode"></i>
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
          <!-- 操作区相关 end -->
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
          <progress-circle :radius="30" :percent="percent">
            <i :class="miniPlayIcon" class="icon-mini" @click.stop="togglePlay"></i>
          </progress-circle>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <!-- 播放器迷你状态 end -->
    <audio autoplay :src="currentSong.url" ref="audio" @canplay="ready" @error="err" @timeupdate="timeUpdate" @ended="songEnd"></audio>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
import createAnimation from 'create-keyframe-animation'
import ProgressBar from 'base/progress-bar/progress-bar'
import ProgressCircle from 'base/progress-circle/progress-circle'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import Lyric from 'lyric-parser'
import Scroll from 'base/scroll/scroll'

export default {
  data() {
    return {
      currentSongReady: false,
      currentTime: 0, // 当前播放时间
      currentLyric: null,
      currentLineNum: 0,
      currentShow: 'cd' // 当前播放器的页面
    }
  },
  computed: {
    iconMode() {
      // 播放模式按钮的图标
      switch (this.mode) {
        case playMode.loop:
          return 'icon-loop'
        case playMode.sequence:
          return 'icon-sequence'
        case playMode.random:
          return 'icon-random'
      }
    },
    isCdRotate() {
      // 设置cd是否转动
      return this.playing ? 'play' : 'play pause' // 这里是play pause是因为如果直接取消变成pause动画就取消了 就有个瞬间转回去的效果，很突兀
    },
    playIcon() {
      // 播放和暂停的按钮
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    miniPlayIcon() {
      // 迷你播放器的播放和暂停
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    percent() {
      return this.currentTime / this.currentSong.duration
    },
    ...mapGetters([
      'fullScreen',
      'playlist',
      'currentSong',
      'currentIndex',
      'playing',
      'mode',
      'sequenceList'
    ])
  },
  methods: {
    /* ======== 播放器的功能逻辑 start  =========== */
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
    songEnd() {
      if (this.mode === playMode.loop) {
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()
      } else {
        this.nextSong()
      }
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
    timeUpdate(e) {
      this.currentTime = e.target.currentTime
    },
    back() {
      // 缩小播放器
      this.setFullScreen(false)
    },
    open() {
      // 放大播放器
      this.setFullScreen(true)
    },
    changeMode() {
      // 切换播放模式
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = []
      if (this.mode === playMode.random) {
        list = shuffle(this.sequenceList.slice())
      } else {
        list = this.sequenceList
      }
      let index = list.findIndex(item => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
      this.setPlaylist(list)
    },
    progressPercentChange(percent) {
      this.$refs.audio.currentTime = this.currentSong.duration * percent
      if (!this.playing) {
        this.togglePlay()
      }
    },
    getLyric() {
      // 获取歌词
      this.currentSong.getLyric().then(lyric => {
        this.currentLyric = new Lyric(lyric, this.handleLyric)
        if (this.playing) {
          this.currentLyric.play()
        }
        console.log(this.currentLyric)
      })
    },
    handleLyric({lineNum, txt}) {
      // lyric-parser 中的回调函数
      this.currentLineNum = lineNum
      if (lineNum > 5) {
        let lineEl = this.$refs.lyricLine[lineNum - 5] // 将当前行 - 5行 作为第一行
        this.$refs.lyricList.scrollToElement(lineEl, 1000)
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000)
      }
    },
    middleTouchStart(e) {
      this.touch = {}
      const touch = e.touches[0]
      this.touch.initial = true
      this.touch.startX = touch.pageX
      this.touch.startY = touch.pageY
    },
    middleTouchMove(e) {
      if (!this.touch.initial) {
        return
      }
      const touch = e.touches[0]
      const deltaX = touch.pageX - this.touch.startX
      const deltaY = touch.pageY - this.touch.startY
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        // 歌词是竖向滚动， 如果纵向大于横向，则页面不滚动
        return
      }
      const left = this.currentShow === 'cd' ? 0 : -window.innerWidth // 开始时cd的位置
      const offsetLeft = Math.min(0, Math.max(left + deltaX, -window.innerWidth)) // [-window.innerWidth, 0] lyriclist的可移动区间
      this.touch.percent = Math.abs(offsetLeft / window.innerWidth)
      this.$refs.lyricList.$el.style.transform = `translate3d(${offsetLeft}px, 0, 0)`
      this.$refs.middleL.style.opacity = `${1 - this.touch.percent}`
      this.$refs.lyricList.$el.style.transitionDuration = `0`
      this.$refs.middleL.style.transitionDuration = `0`
    },
    middleTouchEnd() {
      let offsetLeft = 0
      let opacity = 0
      const time = 200 // 动画有延时
      if (this.currentShow === 'cd') {
        if (this.touch.percent > 0.15) {
          this.currentShow = 'lyric'
          offsetLeft = -window.innerWidth
          opacity = 0
        } else {
          offsetLeft = 0
          opacity = 1
        }
      } else {
        if (this.touch.percent < 0.85) {
          this.currentShow = 'cd'
          offsetLeft = 0
          opacity = 1
        } else {
          offsetLeft = -window.innerWidth
          opacity = 0
        }
      }
      this.$refs.lyricList.$el.style.transitionDuration = `${time}ms`
      this.$refs.middleL.style.transitionDuration = `${time}ms`
      this.$refs.lyricList.$el.style.transform = `translate3d(${offsetLeft}px, 0, 0)`
      this.$refs.middleL.style.opacity = `${opacity}`
    },
    /* ======== 播放器的功能逻辑 end  =========== */
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
    /* ======== 播放器的动画逻辑 end  =========== */
    /* ======== 工具方法 start  =========== */
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
    _formatTime(interval) {
      interval = ~~interval
      const minute = interval / 60 | 0
      const second = interval % 60
      return `${minute}:${`0${second}`.slice(-2)} ` // 格式化时间 补零
    },
    /* ======== 工具方法 end  =========== */
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayingState: 'SET_PLAYING_STATE',
      setPlayMode: 'SET_PLAY_MODE',
      setPlaylist: 'SET_PLAYLIST'
    })
  },
  watch: {
    currentSong(newSong) {
      this.$nextTick(() => {
        if (this.currentLyric) {
          this.currentLyric.stop()
        }
        this.getLyric()
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
  },
  components: {
    ProgressBar,
    ProgressCircle,
    Scroll
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
                color: $color-theme
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
            transition: width 0.2s ease-in-out
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
            flex: 0 0 35px
            line-height: 30px
            width: 35px
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
          font-size: 30px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
