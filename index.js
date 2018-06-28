'use strict'

/**
 * Expose compositor.
 */

module.exports = compose

/**
 * Compose `middleware` returning
 * a fully valid middleware comprised
 * of all those which are passed.
 *
 * @param {Array} middleware
 * @return {Function}
 * @api public
 */
function compose (middleware) {
  // 判断中间件是否是一个数组
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
  // 遍历数组 如有非function类型 抛异常
  for (const fn of middleware) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
  }

  /**
   * @param {Object} context
   * @return {Promise}
   * @api public
   */
  // 函数柯里化 
  return function (context, next) {
    // last called middleware #
    // 设置默认索引为 -1
    let index = -1
    // 返回dispatch执行结果
    return dispatch(0)
   
    function dispatch (i) {
      // 判断如果 i 小于索引 抛出异常
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))
      index = i
      let fn = middleware[i]
      if (i === middleware.length) fn = next
      
      if (!fn) return Promise.resolve()
      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }
}
