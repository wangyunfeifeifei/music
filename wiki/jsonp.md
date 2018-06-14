# jsonp 抓取qq音乐数据
使用到的库： jsonp
安装方式: `npm install jsonp`

## jsonp使用方法
```javascript
jsonp(url, option, (err, data) => {
})
原理： 新建一个<sctipt> 标签，script标签自动发送get请求，然后由预定义的函数执行
```

## Promise封装
```javascript
import originJSONP from 'jsonp'

export default function jsonp(url, data, option) {
  // 将url和data构造成串
  url += (url.includes('?') ? '&' : '?') + param(data)

  return new Promise((resolve, reject) => {
    originJSONP(url, option, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

// 构造url的函数
function param(data) {
  let url = ''
  for (let k in data) {
    let value = data[k] !== undefined ? data[k] : ''
    url += `&${k}=${encodeURIComponent(value)}`
  }
  return url ? url.substring(1) : ''
}

```
