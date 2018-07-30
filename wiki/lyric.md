# 播放器中歌词部分开发详解
### 歌词解码
抓取回来的数据是经过base64转码过后的，所以需要将这个解码回来
原生的解码方法为`this.lyric = atob(escape(res.lyric))`
而我在项目中引用了一个`js-base64`的库来帮助解码
 
### 解码后
解码完成后，在播放器组件中引用lyric-parser这个库，将所有歌词解析为一行一行的数据
`this.currentLyric = new Lyric(lyric, this.handle)`其中handleLyric是
lyric-parser的回调函数，其中的参数有 lineNum和txt, 我们将播放器中的lyric部分
设置为scroll组件，然后通过lineNum来控制歌词的滚动
