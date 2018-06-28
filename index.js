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
      // 执行完一次索引值将会更新所以重新赋值
      index = i
      // 从新的数组下标中取出中间件
      let fn = middleware[i]
      // 如果到了最后一个 则设置fn等于next ？ next是undefined
      if (i === middleware.length) fn = next
      // 如果是undefined 直接返回一个 成功状态的promise 
      if (!fn) return Promise.resolve()
      try {
        // 返回一个成功状态的promise对象 调用中间件函数 传入上下文 递归调用dispatch 执行下一个中间价
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        // 如果执行过程中又错误则返回一个错误状态的promise
        return Promise.reject(err)
      }
    }
  }
}
