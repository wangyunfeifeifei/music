import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'

export function getTopList() {

  return jsonp(url, data, options)
}
