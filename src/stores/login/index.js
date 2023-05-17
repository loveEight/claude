import { defineStore } from 'pinia'
import router from '@/router'
import { accountLogin, accountRegister } from '@/api/request'
import hyStorge from '@/util/storge'
import { LOGIN_TOKEN } from '@/global/constants'
// import useMainStore from '@/stores/main/main'

const useLoginStore = defineStore('login', {
  state: () => ({
    token: '',
    userInfo: { name: '' },
    userMenus: []
  }),
  actions: {
    async accountLoginAction(account) {

      const accountResult = await accountLogin(account)
      // const id = accountResult.data.id
      console.log(accountResult)
      //保存toekn
      // this.token = accountResult.data.token
      // hyStorge.localSet(LOGIN_TOKEN, this.token)
    },
    async accountRegisterAction(account) {

      const accountResult = await accountRegister(account)
      // const id = accountResult.data.id
      console.log(accountResult)
      //保存toekn
      // this.token = accountResult.data.token
      // hyStorge.localSet(LOGIN_TOKEN, this.token)
    },
    async loadCache() {
      const token = hyStorge.localGet(LOGIN_TOKEN)
      const userInfo = hyStorge.localGet('userInfo')
      const userMenus = hyStorge.localGet('userMenus')
      this.token = token
      this.userInfo = userInfo
      this.userMenus = userMenus
      //请求所有角色和所有部门
      const mainStore = useMainStore()
      mainStore.fetchEntireDataAction()
      //动态路由的设置
      const routes = mapMenusToRoutes(this.userMenus)
      routes.forEach((item) => {
        router.addRoute('main', item)
      })
    }
  }
})

export default useLoginStore
