import React, { memo, useCallback, useRef, useState } from "react"
import PropTypes from 'prop-types'
import { CSSTransition } from 'react-transition-group'
import animations from 'create-keyframe-animation'

import Background from './background'
import Top from './top'
import CD from './cd'
import Lyric from './lyric'
import Control from './control'

import { formatSingerName } from 'utils/filters'

import styles from './index.module.scss'

const FullScreenPlayer = props => {
  const { 
    song, 
    fullScreen, 
    playingStatus, 
    currentTime, 
    duration, 
    percent,
    currentLyric,
    currentPlayingLyric,
    currentLineNum 
  } = props
  const { name, album, singers } = song

  const {
    toggleFullScreen,
    togglePlayingState, 
    toggleShowPlayList, 
    onProgressChange, 
    onClickNext, 
    onClickPrev 
  } = props

  const [showCd, setShowCd] = useState(true)

  const fullPlayerRef = useRef(),
        cdRef = useRef();

  /**
   * 切换cd和歌词显示
   */
  const toggleCd = useCallback(status => {
    setShowCd(status)
  }, [])

  /**
   * 计算偏移的辅助函数
   */
  const _getPosAndScale = () => {
    const targetWidth = 40;
    const paddingLeft = 30;
    const paddingBottom = 70;
    const paddingTop = 80;
    const width = window.innerWidth * 0.8;
    const scale = targetWidth / width;
    // 两个圆心的横坐标距离和纵坐标距离
    const x = -(window.innerWidth / 2 - paddingLeft);
    const y = window.innerHeight - paddingTop - width / 2 - paddingBottom;
    return {
      x,
      y,
      scale
    };
  };

  const enter = () => {
    fullPlayerRef.current.style.display = "flex";
    setShowCd(true)
    const { x, y, scale } = _getPosAndScale();
    const animation = {
      0: {
        transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
      },
      60: {
        transform: `translate3d(0, 0, 0) scale(1.1)`
      },
      100: {
        transform: `translate3d(0, 0, 0) scale(1)`
      }
    };
    animations.registerAnimation({
      name: "move",
      animation,
      presets: {
        duration: 400,
        easing: "linear"
      }
    });
    animations.runAnimation(cdRef.current, "move");
  }

  const afterEnter = () => {
    // 进入后解绑帧动画
    const cdDom = cdRef.current;
    animations.unregisterAnimation("move");
    cdDom.style.animation = "";
  };

  const leave = () => {
    if (!cdRef.current) return;
    const cdDom = cdRef.current;
    cdDom.style.transition = "all 0.4s";
    const { x, y, scale } = _getPosAndScale();
    cdDom.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
  };

  const afterLeave = () => {
    if (!cdRef.current) return;
    const cdDom = cdRef.current;
    cdDom.style.transition = "";
    cdDom.style.transform = "";
    fullPlayerRef.current.style.display = "none";
  };

  return (
    <CSSTransition
      in={fullScreen}
      classNames={'full'}
      timeout={400}
      mountOnEnter
      onEnter={enter}
      onEntered={afterEnter}
      onExit={leave}
      onExited={afterLeave}
    >
      <div ref={fullPlayerRef} className={styles['fullscreen-player']}>
        {/* 背景 */}
        <Background picUrl={album.picUrl}  />

        {/* 顶部 */}
        <Top 
          songName={name} 
          singerName={formatSingerName(singers)}
          toggleFullScreen={toggleFullScreen} 
        />

        {/* cd封面 */}
        <CD
          ref={cdRef}
          show={showCd} 
          picUrl={album.picUrl} 
          playingStatus={playingStatus}
          toggleCd={toggleCd}
          currentPlayingLyric={currentPlayingLyric} 
        />

        {/* 全屏歌词 */}
        <Lyric
          show={!showCd} 
          currentLyric={currentLyric}
          currentLineNum={currentLineNum} 
          toggleCd={toggleCd} 
        />

        {/* 控制器 */}
        <Control
          percent={percent}
          currentTime={currentTime}
          duration={duration} 
          playingStatus={playingStatus}
          onProgressChange={onProgressChange} 
          togglePlayingState={togglePlayingState}
          toggleShowPlayList={toggleShowPlayList}
          onClickNext={onClickNext} 
          onClickPrev={onClickPrev} 
        />
      </div>
    </CSSTransition>
  )
}

FullScreenPlayer.defaultProps = {
  playingStatus: false,
  currentPlayingLyric: '纯音乐，暂无歌词'
}

FullScreenPlayer.propTypes = {
  song: PropTypes.object, 
  fullScreen: PropTypes.bool, 
  playingStatus: PropTypes.bool,
  currentTime: PropTypes.number, 
  duration: PropTypes.number, 
  percent: PropTypes.number,
  currentLyric: PropTypes.object,
  currentPlayingLyric: PropTypes.string,
  currentLineNum: PropTypes.number,
  toggleFullScreen: PropTypes.func,
  togglePlayingState: PropTypes.func,
  toggleShowPlayList: PropTypes.func,
  onProgressChange: PropTypes.func, 
  onClickNext: PropTypes.func, 
  onClickPrev: PropTypes.func 
}

export default memo(FullScreenPlayer)