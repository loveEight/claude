import { createApp } from 'vue'
import router from './router'
import pinia from './stores'
import App from './App.vue'
import directivePlugin from '@/directives'

import 'normalize.css'
import './index.less'
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css' //样式
import 'highlight.js/styles/vs2015.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import icons from './global/registerIcon'

//创建v-highlight全局指令
// app.directive('highlight', function(el) {
//   let blocks = el.querySelectorAll('pre code');
//   blocks.forEach((block) => {
//     hljs.highlightBlock(block)
//   })
// })

const app = createApp(App)
app.use(directivePlugin)
app.use(icons)
app.use(pinia)
app.use(router)
app.use(ElementPlus)

app.mount('#app')