import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import { aesEncrypt, aesDecrypt } from './crypto'
import { refreshKeys, shouldRefreshKeys } from './cryptoService'


// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  async config => {
    const crypto = JSON.parse(sessionStorage.getItem('crypto'))
    const newConfig = { ...config };

    if (store.getters.token) {
      newConfig.headers['Authorization'] = 'Bearer ' + getToken()
    }

    if (store.getters.encrypt_enabled &&
      !config.url.includes('/crypto')) {

      if (shouldRefreshKeys(crypto)) {
        try {


          const newCrypto = await refreshKeys()
          if (newCrypto) {
            newConfig.headers['X-Session-Key'] = newCrypto.sessionKey
            if (newConfig.data) {
              newConfig.data = { data: aesEncrypt(newConfig.data, newCrypto.aesKey) }
            }
            return newConfig
          }
        } catch (e) {
          console.error('密钥刷新失败，使用旧密钥', e)
        }
      }

      if (crypto?.sessionKey && crypto?.aesKey) {
        newConfig.headers['X-Session-Key'] = crypto.sessionKey
        if (newConfig.data) {
          newConfig.data = { data: aesEncrypt(newConfig.data, crypto.aesKey) }
        }
      }
    }

    return config
  },
  error => Promise.reject(error)
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    if (store.getters.encrypt_enabled &&
      response.config.url.includes('/crypto') === false &&
      response.data?.data) {

      // AES KEY EXPIRED.
      if (res.code === 407) {
        return handleSessionExpired(response.config)
      }


      const { aesKey } = store.getters.crypto
      if (aesKey) {
        try {
          res.data = aesDecrypt(response.data.data, aesKey)
        } catch (e) {
          console.error('解密失败', e)
          return Promise.reject(e)
        }
      }
    }

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 0) {
      Message({
        message: res.msg || '服务器返回异常',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token 50012: Other clients logged in 50014: Token expired
      if (res.code === 401 || res.code === 401 || res.code === 401) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })

    if (error.response && error.response.data.code === 407) {
      return handleSessionExpired(error.config)
    }

    return Promise.reject(error)
  }
)


async function handleSessionExpired(originalRequest) {
  try {
    const newCrypto = await refreshKeys()
    originalRequest.headers['X-Session-Key'] = newCrypto.sessionKey
    if (originalRequest.data) {
      originalRequest.data = { data: aesEncrypt(originalRequest.data, newCrypto.aesKey) }
    }
    return service(originalRequest)
  } catch (e) {
    console.error('处理会话过期失败', e)
    return Promise.reject(e)
  }
}

export default service
