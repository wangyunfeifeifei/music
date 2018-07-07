<template>
  <!-- 进度条组件 -->
  <div class="progress-bar" ref="bar">
    <div class="bar-inner" @click="clickBar">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
        @touchstart.prevent="progressTouchStart"
        @touchmove.prevent="progressTouchMove"
        @touchend="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    percent: {
      // 占比
      type: Number,
      default: 0
    }
  },
  created() {
    this.touch = {}
  },
  mounted() {
    this.$refs.progress.style.transform = `scaleX(0)`
  },
  methods: {
    progressTouchStart(e) {
      this.touch.initated = true
      this.touch.startX = e.touches[0].pageX
      this.touch.len = this.$refs.progress.clientWidth * this.percent
      this.touch.percent = this.percent
    },
    progressTouchMove(e) {
      if (!this.touch.initated) {
        return
      }
      const delta = e.touches[0].pageX - this.touch.startX
      const left = Math.min(Math.max(this.touch.len + delta, 0), this.$refs.bar.clientWidth)
      const percent = left / this.$refs.bar.clientWidth
      this.$refs.progress.style.transform = `scaleX(${percent})`
      this.$refs.progressBtn.style.left = `${percent * 100}%`
      this.touch.percent = percent
    },
    progressTouchEnd(e) {
      this.touch.initated = false
      this.__changePercent(this.touch.percent)
    },
    clickBar(e) {
      let left = e.pageX - e.target.getBoundingClientRect().left
      let percent = left / this.$refs.bar.clientWidth
      this.$refs.progress.style.transform = `scaleX(${percent})`
      this.$refs.progressBtn.style.left = `${percent * 100}%`
      this.__changePercent(percent)
    },
    __changePercent(percent) {
      this.$emit('changePercent', percent)
    }
  },
  watch: {
    percent(newPer) {
      if (newPer >= 0 && !this.touch.initated) {
        // console.log(newPer)
        this.$refs.progress.style.transform = `scaleX(${newPer})`
        this.$refs.progressBtn.style.left = `${newPer * 100}%`
      }
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background-color: rgba(0, 0, 0, 0.3)
      border-radius: 2px
      .progress
        position: absolute
        height: 100%
        width: 100%
        border-radius: 2px
        transform-origin: left
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: -7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 5px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
