<template>
  <scroll class="listview"
          :data="data"
          ref="listview"
          :listenScroll="listenScroll"
          :probeType="probeType"
          @scroll="scroll"
  >
    <ul>
      <li v-for="(group,index) in data" class="list-group" :key="index" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li @click="selectItem(item)" v-for="item in group.items" class="list-group-item" :key="item.id">
            <img class="avatar" v-lazy="item.avatar" />
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(item, index) in shortcutList"
            :key="item"
            :class="{'current': currentIndex === index, 'item': true}"
            :data-index="index"
        >
          {{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixed" >
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
    <div v-show="!data.length" class="loading-container">
      <loading />
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import {getData} from 'common/js/dom'

const ANCHOR_HEIGHT = 18
const FIXED_HEIGHT = 30

export default {
  created() {
    this.touch = {}
    this.listenScroll = true
    this.listHeight = []
    this.probeType = 3
  },
  data() {
    return {
      scrollY: -1,
      currentIndex: 0,
      diff: -1
    }
  },
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  computed: {
    // 右侧快速入口数据
    shortcutList() {
      return this.data.map(val => {
        return val.title.substr(0, 1)
      })
    },
    // 滚动固定标题
    fixedTitle() {
      if (this.scrollY > 0) {
        return ''
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }
  },
  methods: {
    selectItem(item) {
      // 当选择成员时，想父组件传递消息
      this.$emit('select', item)
    },
    onShortcutTouchStart(e) {
      // 开始触摸
      let anchorIndex = getData(e.target, 'index')
      let firstTouch = e.touches[0] // touch的对象
      this.touch.y1 = firstTouch.pageY // 触摸开始的位置
      this.touch.anchorIndex = anchorIndex // 记录当前的index
      this._scrollTo(anchorIndex) // 列表滚动到右侧快速入口相应的位置
    },
    onShortcutTouchMove(e) {
      // 触摸过程中
      let firstTouch = e.touches[0]
      this.touch.y2 = firstTouch.pageY // 现在touch的位置
      let delta = ~~((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT) // y轴上的偏移
      let anchorIndex = delta + Number(this.touch.anchorIndex)
      this._scrollTo(anchorIndex) // 列表滚动到右侧快速入口相应的位置
    },
    scroll(pos) {
      // 滚动时记录当前的位置
      this.scrollY = pos.y
    },
    _scrollTo(index) {
      // 滚动到指定地方
      if ((!index && index !== 0) || index < 0 || index > this.listHeight.length - 2) {
        return
      }
      this.scrollY = -this.listHeight[index]
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
    },
    _calculateHeight() {
      // 计算每个部分`距离顶部`的距离
      this.listHeight = []
      const list = this.$refs.listGroup
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    scrollY(newY) {
      // 滚动到顶部以上时
      if (newY >= 0) {
        this.currentIndex = 0
        return
      }
      const listHeight = this.listHeight
      for (let i = 0; i < listHeight.length; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]
        if (!height2 || (-newY >= height1 && -newY < height2)) {
          this.currentIndex = i
          this.diff = height2 + newY
          return
        }
      }
      // 滚动到底部，且-newY大于最后的上线
      this.currentIndex = listHeight.length - 2
    },
    diff(newVal) {
      // diff 是这个部分距离顶部的距离和滚动距离的差 也就是fixedtitle漏出来的高度
      let fixedTop = (newVal > 0 && newVal < FIXED_HEIGHT) ? newVal - FIXED_HEIGHT : 0
      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      this.$refs.fixed.style.transform = `translate3d(0, ${fixedTop}px, 0)`
    }
  },
  components: {
    Scroll, Loading
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: -1px
      left: 0
      width: 100%
      .fixed-title
        height: 31px
        line-height: 31px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
