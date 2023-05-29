//图片加载失败所显示的默认图片
import defaltImg from '@/assets/img/200.png'

// 引入监听是否进入视口
import { useIntersectionObserver } from '@vueuse/core'

export default {
  // 需要拿到main.js中由createApp方法产出的app实例对象
  install (app) {
    // app实例身上有我们想要的全局注册指令方法  调用即可
    app.directive('imgLazy', {
    
      mounted (el, binding) {
        // el:img dom对象
        // binding.value  图片url地址
        // 使用vueuse/core提供的监听api 对图片dom进行监听 正式进入视口才加载
        // img.src = url
      
        const { stop } = useIntersectionObserver(
          // 监听目标元素
          el,
          ([{ isIntersecting }], observerElement) => {
            if (isIntersecting) {
              // 当图片url无效加载失败的时候使用默认图片替代
              el.onerror = function () {
                el.src = defaltImg
              }
              el.src = binding.value
              stop()
            }
          })
      }
    })
  }
}