# 利用better-scroll实现scroll组件

### 模板部分
```html
<template>
    <div ref="wrapper">
      <slot></slot>
    </div>
</template>
```

### 逻辑部分
```javascript
import BScroll from 'better-scroll'

export default {
  props: {
    probeType: { // 监听滚动的方式，例如是否节流
      type: Number,
      default: 1
    },
    click: { // 是否有点击事件
      type: Boolean,
      default: true
    },
    data: { // 传入的数据
      type: Array,
      default: () => {
        return []
      }
    },
    listenScroll: { // 是否监听滚动事件
      type: Boolean,
      default: false
    }
  },
  mounted() {
    setTimeout(() => {
      this._initScroll()
    }, 20)
  },
  methods: {
    _initScroll() {
      // 初始化Scroll
      if (!this.$refs.wrapper) {
        return
      }
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click
      })
      if (this.listenScroll) {
        this.scroll.on('scroll', pos => {
          this.$emit('scroll', pos) // 通知父组件
        })
      }
    },
    enable() {
      // 开启
      this.scroll && this.scroll.enable()
    },
    disable() {
      // 关闭
      this.scroll && this.scroll.disable()
    },
    refresh() {
      // 刷新
      this.scroll && this.scroll.refresh()
    },
    scrollTo() {
      // 滚动到什么地方
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    scrollToElement() {
      // 滚动到那个元素上
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    }
  },
  watch: {
    data() {
      // 监听数据变化，一旦变化就刷新,就会重新计算高度，将内容撑开
      setTimeout(() => {
        this.refresh()
      }, 20)
    }
  }
}
```
