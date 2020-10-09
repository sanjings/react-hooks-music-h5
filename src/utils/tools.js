
/**
 * 防抖函数
 * @params {Function} fn 要执行的函数
 * @params {Number} delayTime 延迟执行的时间
 * @return {Function}
 */
export const debounce = (fn, delayTime = 300) => {
  let timer = null;
  return function (...args) {
    const _this = this;

    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(_this, args);
    }, delayTime)
  }
}

/**
 * 节流函数
 * @params {Function} fn 要执行的函数
 * @params {Number} waitTime 间隔执行的时间
 * @return {Function}
 */
export const throttle = (fn, waitTime) => {
  let preTime = 0;
  return function (...args) {
    const nowTime = new Date().getTime();

    if (nowTime - preTime >= waitTime) {
      fn.apply(this, args);
      preTime = nowTime;
    }
  }
}

/**
 * 判断是否是空对象
 * @param {Object} obj 
 */
export const isEmptyObject = obj => {
  return JSON.stringify(obj) === '{}' ? true : false
}

/**
 * 组装歌曲的url
 * @param {String | Number} id 
 */
export const getSongUrl = id => {
  return `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
}

/**
 * 转换歌曲播放时间
 * @param {Number} interval 
 */
export const formatPlayTime = interval => {
  interval = interval | 0; // 向下取整
  const minute = (interval / 60) | 0;
  const second = (interval % 60).toString().padStart(2, "0");
  return `${minute}:${second}`;
};