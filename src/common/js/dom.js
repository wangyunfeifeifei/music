/**
 * 为dom元素添加class
 * @param el dom元素
 * @param className 类名
 */
export function addClass(el, className) {
  return el.classList.add(className)
}

/**
 * 判断dom元素是否含有制定class
 * @param el dom元素
 * @param className 类名
 * @returns {boolean}
 */
export function hasClass(el, className) {
  return el.classList.contains(className)
}

/**
 * 操纵data属性
 * @param el 必填参数，dom元素
 * @param name 必填参数，data-name
 * @param val 选填，若填val，则set一个值，若不填则获取data-name的值
 */
export function getData(el, name, val) {
  name = `data-${name}`
  if (val) {
    el.setAttribute(name, val)
  } else {
    return el.getAttribute(name)
  }
}

let elementStyle = document.createElement('div').style

// 计算供应商
let vendor = (() => {
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    ms: 'msTransform',
    standard: 'transform'
  }

  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }

  return false
})()

/**
 * 根据浏览器能力来加前缀
 * @param {String} style 某个样式
 */
export function prefixStyle(style) {
  if (vendor === false) {
    return false
  }

  if (vendor === 'standard') {
    return style
  }

  return `${vendor}${style.charAt(0).toUpperCase()}${style.substring(1)}`
}
