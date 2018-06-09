<template>
  <div class="singer">
    <list-view :data="singers"></list-view>
  </div>
</template>

<script type="text/ecmascript-6">
import {getSingerList} from 'api/singer'
import {ERR_OK} from 'api/config'
import Singer from 'common/js/singer'
import ListView from 'base/listview/listview'

const HOT_NAME = '热门'
const HOT_SINGER_LENGTH = 10

export default {
  data() {
    return {
      singers: []
    }
  },
  created() {
    this._getSingerList()
  },
  methods: {
    _getSingerList() {
      getSingerList().then(res => {
        if (res.code === ERR_OK) {
          this.singers = this._normalizeSinger(res.data.list)
        }
      })
    },
    _normalizeSinger(list) {
      // 构造歌手数据结构
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      let keys = [] // 存储Findex

      list.forEach((item, index) => {
        let one = new Singer(item.Fsinger_id, item.Fsinger_mid, item.Fsinger_name)
        if (index < HOT_SINGER_LENGTH) {
          map.hot.items.push(one)
        }
        const key = item.Findex
        if (!map[key]) {
          if (key.match(/[a-zA-Z]/)) {
            keys.push(key)
          }
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(one)
      })
      // 处理map得到有序列表
      keys.sort()
      return [map.hot, ...keys.map((val) => {
        return map[val]
      })]
    }
  },
  components: {
    ListView
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
