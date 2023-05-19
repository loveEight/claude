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
    currentLog: { title: '新建聊天' },
    parentMessageId: '',
    isNowSend: false
  }),
  actions: {
    //查询所有对话记录
    async queryChatLogAction() {
      const queryResult = await queryChatLog()
      this.chatLogList = queryResult.data.reverse()
    },
    //新增对话
    addChatLogNewAction() {
      this.parentMessageId = ''
      addChatLogNew().then(() => {
        queryChatLog().then((res) => {
          const chatLogList = res.data.reverse()
          this.chatLogList[0]["_id"] = chatLogList[0]["_id"]
        })
      })
    },
    //删除对话
    deleteChatLogNewAction(id) {
      this.parentMessageId = ''
      deleteChatLog(id)
    },
    //更新对话标题
    updateChatLogTitleAction(data) {
      updateChatLogTitle(data)
    },
    //清空所有对话记录
    clearChatLogAction() {
      this.parentMessageId = ''
      clearChatLog()
    },
    //在一次对话中增加聊天记录
    addChatLogTalkAction(newTalk) {
      setTimeout(() => {
        const id = this.currentLog["_id"]
        const data = { id, newTalk }
        addChatLogTalk(data)
        this.chatLogList[this.currentLogIndex].chatLog.list.push(newTalk)
        console.log('this.chatLogList[this.currentLogIndex]', this.chatLogList[this.currentLogIndex])
      },300)
    }
  }
})

export default useHomeStore