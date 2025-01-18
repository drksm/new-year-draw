// Web Worker for handling interpretation requests
self.onmessage = (event) => {
  const { url, token, data } = event.data
  const xhr = new XMLHttpRequest()
  
  xhr.open('POST', url)
  xhr.setRequestHeader('Content-Type', 'application/json')
  xhr.setRequestHeader('Authorization', `Bearer ${token}`)
  
  xhr.onprogress = (event) => {
    const newText = event.target.responseText
    if (newText) {
      self.postMessage({ type: 'progress', data: newText })
    }
  }
  
  xhr.onerror = () => {
    self.postMessage({ type: 'error', data: '网络请求失败' })
  }
  
  xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      self.postMessage({ type: 'progress', data: xhr.responseText })
    } else {
      self.postMessage({ type: 'error', data: xhr.statusText })
    }
  }
  
  xhr.send(JSON.stringify(data))
} 