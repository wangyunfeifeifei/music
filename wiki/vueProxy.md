# vue后端代理的方式
在获取qq音乐歌单列表时，我遇到了一个问题，qq音乐在这里做了referer检验,这样的话纯前端的方式就不能获取到歌单的信息了，所以在这里，我使用了vue的后端代理的方式来伪装。
```javascript
1. 找到config文件夹, 打开其中的index.js
2. 找到dev字段中的proxyTable字段，添加如下代码:
proxyTable: {
      '/api/getDiscList': {
        target: 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg', // 请求的目标
        bypass: (req, res, proxyOptions) => {
          // 请求时需要做的处理，这里我将header中的referer写成了qq音乐的referer
          req.headers.referer = 'https://y.qq.com/portal/playlist.html'
          req.headers.host = 'c.y.qq.com'
        },
        pathRewrite: {
          // 重命名path
          '^/api/getDiscList': ''
        }
      }
```
经过这样的处理之后，我只需要用axios请求`/api/getDiscList`就可以发出正确地请求
