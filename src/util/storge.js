class HyStorge {
  localSet(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  }

  localGet(key) {
    const value = localStorage.getItem(key)
    if (!value) return
    else {
      return JSON.parse(value)
    }
  }

  localRemove(key) {
    console.log(11111)
    localStorage.removeItem(key)
  }

  sessionSet(key, value) {
    sessionStorage.setItem(key, JSON.stringify(value))
  }

  sessionGet(key) {
    const value = sessionStorage.getItem(key)
    if (!value) return
    else {
      return JSON.parse(value)
    }
  }

  sessionRemove(key) {
    sessionStorage.removeItem(key)
  }
}

const hyStorge = new HyStorge()
export default hyStorge
