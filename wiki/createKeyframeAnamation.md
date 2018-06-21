## 利用create-keyframe-animation 使用js创建css3动画

由于项目中的宽高等都是动态获取的，所以不能直接书写css3动画,所以这里就引用了create-keyframe-animation这个库来创建css3动画

```javascript
import createAnimation from 'create-keyframe-animation'

let animation = {
  0: {
    transform: 'translate(0, 0)'
  },
  100: {
    transfrom: 'translate(100px, 100px)'
  }
}

createAnimation.registerAnimaiton({
  name: '动画名称',
  animation,
  presets: {
    duration: 300,
    easing: 'ease-in-out',
    delay: '100'
  }
})

createAnimation.runAnimation(targetDOM, '动画名称', callback)

```
