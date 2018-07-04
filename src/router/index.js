import Vue from 'vue'
import Router from 'vue-router'
import Rank from 'components/rank/rank'
import Recommend from 'components/recommend/recommend'
import Singer from 'components/singer/singer'
import Search from 'components/search/search'
import SingerDetail from 'components/singer-detail/singer-detail'
import Album from 'components/album/album'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    redirect: '/recommend'
  }, {
    path: '/recommend',
    component: Recommend
  }, {
    path: '/singer',
    component: Singer,
    children: [{
      path: ':id',
      component: SingerDetail
    }]
  }, {
    path: '/rank',
    component: Rank
  }, {
    path: '/search',
    component: Search
  }, {
    path: '/album',
    component: Album
  }
  ]
})
