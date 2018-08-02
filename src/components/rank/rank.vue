<template>
    <div>
      排行页面
    </div>
</template>

<script type="text/ecmascript-6">
import {getTopList} from 'api/rank'
import {ERR_OK} from 'api/config'

export default {
  created() {
    this._getTopList()
  },
  methods: {
    _getTopList() {
      getTopList().then(res => {
        if (res.code === ERR_OK) {
          console.log(res.data.topList)
        }
      })
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
