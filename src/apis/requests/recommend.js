import { ajaxGet } from '../ajax.js'
import {
  GET_BANNERS,
  GET_RECOMMEND_LIST,
  GET_RECOMMEND_NEW_SONGS
} from '../url'

/**
 * 请求banner数据
 * @param {Number} type  
 */
const getBannersRequest = type => {
  return ajaxGet(GET_BANNERS, { type })
}

/**
 * 请求推荐歌单数据
 * @param {Number} limit 取出数量
 */
const getRecommendListRequest = limit => {
  return ajaxGet(GET_RECOMMEND_LIST, { limit })
}

/**
 * 请求推荐新歌数据
 */
const getRecommendNewSongsRequest = () => {
  return ajaxGet(GET_RECOMMEND_NEW_SONGS)
    .then(res => {
      const list = res.result;
      return list.map(item => {
        return {
          id: item.id,
          name: item.name,
          album: item.song.album,
          singers: item.song.artists,
          dt: item.song.duration
        }
      })
    })
}

export {
  getBannersRequest,
  getRecommendListRequest,
  getRecommendNewSongsRequest
}