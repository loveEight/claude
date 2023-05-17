import { createPinia } from 'pinia'
import useLoginStore from '@/stores/login'

function initPinia(app) {
  app.use(createPinia())
  const loginStore = useLoginStore()
  // loginStore.loadCache()
}

export default initPinia
