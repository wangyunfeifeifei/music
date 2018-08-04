<template>
    <div class="rank">
      <scroll class="toplist" :data="topList">
        <ul>
          <li class="item" v-for="top in topList" :key="top.id">
            <div class="icon">
              <img width="100" height="100" v-lazy="top.picUrl">
            </div>
            <ul class="songlist">
              <h3 class="toptitle">{{top.topTitle}}</h3>
              <li class="song" v-for="(song, index) in top.songList" :key="index">
                <span>{{index + 1}}</span>
                <span>{{song.songname}}-</span>
                <span>{{song.singername}}</span>
              </li>
            </ul>
          </li>
        </ul>
      </scroll>
      <router-view></router-view>
    </div>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import {getTopList} from 'api/rank'
import {ERR_OK} from 'api/config'

export default {
  created() {
    this._getTopList()
  },
  data() {
    return {
      topList: []
    }
  },
  methods: {
    _getTopList() {
      getTopList().then(res => {
        if (res.code === ERR_OK) {
          console.log(res.data.topList)
          this.topList = res.data.topList
        }
      })
    }
  },
  components: {
    Scroll
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .rank
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .toplist
      height: 100%
      overflow: hidden
      .item
        display: flex
        margin: 0 20px
        padding-top: 20px
        height: 100px
        &:last-child
          padding-bottom: 20px
        .icon
          flex: 0 0 100px
          width: 100px
          height: 100px
        .songlist
          flex: 1
          display: flex
          flex-direction: column
          justify-content: center
          padding: 0 20px
          height: 100px
          overflow: hidden
          background: $color-background-white
          color: $color-text-d
          font-size: $font-size-small
          .toptitle
            color: #333
            font-size: $font-size-large
            margin-top: 10px
            height: 20px
            line-height: 20px
            no-wrap()
          .song
            no-wrap()
            line-height: 26px
            span:nth-of-type(2)
              color: #333
              font-weight 600
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
