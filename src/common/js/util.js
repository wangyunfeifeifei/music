/**
 * 获取随机数
 * @param l {Number} 下限
 * @param r {Number} 上限
 * @returns {number} 返回的随机数
 */
function getRandomNumber(l, r) {
  return ~~(Math.random() * (r - l + 1) + l)
}

/**
 * 打乱数组
 * @param arr {Array} 数组
 * @param l {Number} 数组索引下界
 * @param r {Number} 数组索引上界
 * @returns {Array} 打乱后的数组
 */
export function shuffle(arr, l = 0, r = arr.length - 1) {
  for (let i = 0; i < r; i++) {
    let rand = getRandomNumber(0, r)
    let t = arr[rand]
    arr[rand] = arr[i]
    arr[i] = t
  }
  return arr
}
