import { defineStore } from 'pinia'
import router from '@/router'
import {
  queryChatLog,
  addChatLogNew,
  deleteChatLog,
  updateChatLogTitle,
  clearChatLog,
  addChatLogTalk
} from '@/api/request'
import hyStorge from '@/util/storge'
import { LOGIN_TOKEN } from '@/global/constants'

const useHomeStore = defineStore('home', {
  state: () => ({
    chatLogList: [], //所有对话记录
    currentLogIndex: -1,  //当前对话记录索引
    currentLog: {}
  }),
  actions: {
    //查询所有对话记录
    async queryChatLogAction() {
      const queryResult = await queryChatLog()
      this.chatLogList = queryResult.data.reverse()
    },
    //新增对话
    addChatLogNewAction() {
      addChatLogNew().then(() => {
        queryChatLog().then((res) => {
          const chatLogList = res.data.reverse()
          this.chatLogList[0]["_id"] = chatLogList[0]["_id"]
        })
      })
    },
    //删除对话
    deleteChatLogNewAction(id) {
      deleteChatLog(id)
    },
    //更新对话标题
    updateChatLogTitleAction(data) {
      updateChatLogTitle(data)
    },
    //清空所有对话记录
    clearChatLogAction() {
      clearChatLog()
    },
    //在一次对话中增加聊天记录
    addChatLogTalkAction(newTalk) {
      const id = this.currentLog["_id"]
      const data = { id, newTalk }
      addChatLogTalk(data)
      this.chatLogList[this.currentLogIndex].chatLog.list.push(newTalk)
      console.log('this.chatLogList[this.currentLogIndex]', this.chatLogList[this.currentLogIndex])
    }
  }
})

export default useHomeStore