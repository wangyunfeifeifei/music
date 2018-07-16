# 使用svg 制作环形进度条
html结构
```html
<svg width="30" height="30" version="1.1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle r="50" cx="50" cy="50" fill="transparent" stroke="#ddd" stroke-width="8px" />
    <circle r="50" cx="50" cy="50" fill="transparent" stroke="#999" stroke-dasharray="314" stroke-dashoffset="100" stroke-width="8px" />
</svg>
```
属性解释
```html
viewBox: 这个属性表示svg中的视口， 从0，0坐标开始width的100%就是100，height的100%就是100 不管svg自身有多大，都不会影响内部  
circle: 圆形  
  r: 半径
  cx，cy:圆心位置
  fill:填充色
  stroke:描边
  stroke-dasharray: 描边多少了
  stroke-dashoffset: 描边偏移量
```
