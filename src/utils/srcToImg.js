const http = require('http')
const https = require('https')
const path = require('path')
const { promisify } = require('util')
const { createWriteStream, writeFile } = require('fs')

const myWriteFile = promisify(writeFile)

module.exports = async function(src, dir) {
  // 匹配以jpg|jpeg|png|gif结尾的字符串
  const reg = /.(jpg|jpeg|png|gif)$/
  // 说明是图片地址
  if (reg.test(src)) {
    await urlToImg(src, dir)
  } else { // 说明是base64编码图片
    await base64ToImg(src, dir)
  }
}
// 将网络图片存在images文件夹
const urlToImg = async (url, dir) => {
  // 匹配以https开头的字符串
  const reg = /^https:/
  // 拿到url后缀名
  const ext= path.extname(url)
  const file = path.join(dir, `${ Date.now() }${ ext }`)
  const module= reg.test(url) ? https : http

  module.get(url, res => {
    res.pipe(createWriteStream(file))
       .on('finish', () => {
         console.log('写入完成')
       })
  })
}
// 将base64图片存在images文件夹
const base64ToImg = async (str, dir) => {
  // data:image/jpeg;base64,......................................
  const reg = /^data:(.+);base64,(.+)$/
  const matches = str.match(reg)
  try {
    // image/jpeg => jpeg => jpg
    const ext = matches[1].split('/')[1].replace('jpeg', 'jpg')
    const file = path.join(dir, `${ Date.now() }.${ ext }`)
  
    await myWriteFile(file, matches[2], 'base64')
  } catch (err) {
    console.log('非法的base64')
  }
}