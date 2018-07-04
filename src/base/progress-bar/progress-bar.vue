<template>
  <!-- 进度条组件 -->
  <div class="progress-bar">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn">
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
  mounted() {
    this.$refs.progress.style.transform = `scaleX(0)`
  },
  watch: {
    percent(newPer) {
      if (newPer >= 0) {
        console.log(newPer)
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
