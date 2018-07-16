<template>
  <div class="progress-circle">
    <svg :width="radius" :height="radius" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg" >
      <circle class="progress-background" r="50" cx="50" cy="50" fill="transparent"></circle>
      <circle class="progress-bar" r="50" cx="50" cy="50" fill="transparent" :stroke-dasharray="dasharray"
      :stroke-dashoffset="dashoffset"
      ></circle>
    </svg>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    radius: {
      type: Number,
      default: 100
    },
    percent: {
      type: Number,
      default: 0
    }
  },
  computed: {
    dasharray() {
      return 100 * Math.PI
    },
    dashoffset() {
      return (1 - this.percent) * this.dasharray
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"

  .progress-circle
    position: relative
    circle
      transform-origin: center
      stroke-width: 10px
      &.progress-background
        transform: scale(0.9)
        stroke: $color-theme
        opacity: 0.3
      &.progress-bar
        transform: scale(0.9) rotate(-90deg)
        stroke: $color-theme

</style>
