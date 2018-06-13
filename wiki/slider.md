# 利用BetterScroll封装轮播图组件
### 模板部分
模板部分就是由n个点和一个带有插槽的div组成,插槽用来放置轮播的图片
一般子组件形式为
```html
<div>
  <a>
    <img />
  </a>
</div>
```
代码如下
```html
<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="item in dots" :key="item" :class="{active: currentPageIndex=== item}"></span>
    </div>
  </div>
</template>
```

### 逻辑部分
```javascript
import BScroll from 'better-scroll'
import { addClass } from 'common/js/dom'

export default {
  props: {
    loop: {
      // 是否循环轮播
      type: Boolean,
      default: true
    },
    autoplay: {
      // 是否自动播放
      type: Boolean,
      default: true
    },
    interval: {
      // 自动播放间隔时间，单位毫秒
      type: Number,
      default: 4000
    }
  },
  data() {
    return {
      dots: 0, // 点的数量
      currentPageIndex: 1 // 当前是第几张图片
    }
  },
  mounted() {
    setTimeout(() => {
      this._setSliderWidth() // 进行宽度相关计算
      this._initDots() // 初始化点
      this._initSlider() // 初始化轮播组件
      if (this.autoplay) {
        this._play()
      }
    }, 20)

    window.addEventListener('resize', () => {
      if (!this.slider) {
        return
      }
      this._setSliderWidth(true) // 如果resize， 重新进行宽度的计算
      this.slider.refresh() // 刷新
    })
  },
  methods: {
    _setSliderWidth(isResize) {
      this.children = this.$refs.sliderGroup.children
      let width = 0 // 轮播图所有子组件总宽度
      let sliderWidth = this.$refs.slider.clientWidth // 轮播图可见区域的宽度
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i]
        addClass(child, 'slider-item')
        child.style.width = `${sliderWidth}px` // 将插槽中每一个子组件宽度设置为sliderWidth
        width += sliderWidth
      }

      if (this.loop && !isResize) {
        // 如果是循环播放，better-scroll会在首尾各加两个组件
        // 但是如果是resize的话，dom已经加上去了,就不必重新加宽度了
        width += 2 * sliderWidth
      }
      this.$refs.sliderGroup.style.width = `${width}px`  // 将容器宽度设置为width
    },
    _initSlider() {
      let self = this
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true, // 设置为横向滚动
        scrollY: false,
        momentum: false, // 滚动动画
        snap: { // 这些属性一般都是为了配合slider组件做的
          loop: self.loop, // 是否循环
          threshold: 0.3,
          easing: { // 轮播的缓动函数
            style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            fn: function(t) {
              return t * (2 - t)
            }
          }
        }
      })

      this.slider.on('scrollEnd', () => { // 滚动完成时的事件
        let pageIndex = this.slider.getCurrentPage().pageX // 完成时是在第几页
        this.currentPageIndex = pageIndex + 1 // 由于是数组存储，所以当前页数需要加一

        if (this.autoplay) {
          clearTimeout(this.timer)
          this._play()
        }
      })
    },
    _initDots() {
      this.dots = this.children.length
    },
    _play() {
      this.timer = setTimeout(() => {
        this.slider.next()
      }, this.interval)
    }
  },
  destroyed() {
    clearTimeout(this.timer) // 清除定时器
  }
}
```

### 样式部分
样式部分采用的是stylus来编写
```css
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: #ccc
        transition: width .1s ease-in-out
        &.active
          width: 20px
          border-radius: 5px
          background: #ffcd32
```

## 使用时的注意点
+ 使用时最好在外层加一个v-if，当数组有值才来初始化该组件, 也就是当数据获取到时才来初始化该组件
+ 当图片加载成功时，最好刷新该组件
