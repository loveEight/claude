import { createApp} from 'vue'
import App from './App.vue'
import router from './router'
import 'normalize.css'
import './index.less'
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css' //样式
import 'highlight.js/styles/vs2015.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

//创建v-highlight全局指令
app.directive('highlight', function(el) {
  let blocks = el.querySelectorAll('pre code');
  blocks.forEach((block) => {
    hljs.highlightBlock(block)
  })
})

app.use(router)
app.use(ElementPlus)
app.mount('#app')