const puppeteer = require('puppeteer')
const path = require('path')
const srcToImg = require('./utils/srcToImg')

;(async function () {
  // 创建一个browser对象
  // const browser = await puppeteer.launch({
  //   slowMo: 50, // 延时500ms，方便观察
  //   devtools: true // 打开控制台
  // })
  const browser = await puppeteer.launch()
  // 创建page
  const page = await browser.newPage()
  // 跳转到对应网址
  await page.goto('https://image.baidu.com')
  // 通过当前网页中input标签的id选中改元素，然后聚焦
  await page.focus('#kw')
  // 模拟键盘输入关键字
  await page.keyboard.sendCharacter('雷姆 3840*1080')
  // 通过类名获取点击搜索按钮并触发点击事件进行搜索
  await page.click('.s_newBtn')
  // 页面完成加载时触发
  page.on('load', async function() {
    // 传入的回调可在页面实例上下文中执行
    const sources = await page.evaluate(async () => {
      // 通过类名获取所有image标签
      const images = document.getElementsByClassName('main_img')
      // 返回所有image标签的src属性数组
      return [...images].map(img => img.src)
    })

    for(let src of sources) {
      await srcToImg(src, path.resolve(__dirname, 'imgs'))
      // 关闭
    }
    await browser.close()
  })
})()