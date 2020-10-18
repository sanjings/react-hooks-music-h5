import React, { memo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { renderRoutes } from 'react-router-config';
import { forceCheck } from 'react-lazyload'

import Scroll from 'components/Scroll'
import Loading from 'components/Loading'
import ModuleTitle from 'components/ModuleTitle'
import GlobalList from './GlobalList'
import OfficialList from './OfficialList'

import { actions } from './store'

const { getRankListAction } = actions;

const Rank = props => {
  const loading = useSelector(state => state.rank.loading),
        officialList = useSelector(state => state.rank.officailList),
        globalList = useSelector(state => state.rank.globalList),
        playList = useSelector(state => state.player.playList);

  const dispatch = useDispatch()

  /**
   * 获取榜单数据
   */
  useEffect(() => {
    if (!globalList.length || !officialList.length) {
      dispatch(getRankListAction())
    }
  }, [])

  /**
   * 根据播放状态动态改变滚动高度
   */
  const wrapperStyle = {
    flex: 1,
    overflow: 'hidden',
    marginBottom: playList.length ? '60px' : 0
  }

  return (
    <div style={wrapperStyle}>
      <Scroll onScroll={forceCheck}>
        <div className="rank">
          {/* 官方榜 */}
          <ModuleTitle title="官方榜" />
          <OfficialList listData={officialList} />

          {/* 全球榜 */}
          <ModuleTitle title="全球榜" />
          <GlobalList listData={globalList} />
        </div>
      </Scroll>
      { renderRoutes(props.route.routes)}
      {/* loading */}
      { loading && <Loading /> }
    </div>
  )
}

export default memo(Rank)