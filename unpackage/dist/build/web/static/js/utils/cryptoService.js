import request from '@/utils/request'
import { generateAesKey, rsaEncrypt } from './crypto'
import store from '@/store'

const RSAUrl = "https://ic365.ajulye.com"

// 密钥交换逻辑（登录时使用）
export async function exchangeKeys() {
  try {
    // 1. 获取RSA公钥
    const pubRes = await request({ url: RSAUrl+'/api/crypto/publicKey', method: 'get' })

    // 2. 生成并加密AES密钥
    const aesKey = generateAesKey()
    const encryptedKey = rsaEncrypt(aesKey, pubRes.data.public_key)

    // 3. 交换密钥
    const keyRes = await request({
      url: RSAUrl+'/api/crypto/exchange',
      method: 'post',
      params: {
        keyId: pubRes.data.key_id,
        encryptedAesKey: encryptedKey
      }
    })

    // 4. 存储密钥信息
    const cryptoData = {
      sessionKey: keyRes.data.session_key,
      aesKey: aesKey,
      expireTime: Date.now() + keyRes.data.expire_time * 1000
    }

    console.log(Date.now())
    console.log(Date.now() + keyRes.data.expire_time * 1000)

    store.commit('user/SET_CRYPTO', cryptoData)

    return cryptoData
  } catch (error) {
    console.error('密钥交换失败', error)
    throw error
  }
}

let refreshPromise = null

export async function refreshKeys() {
  if (refreshPromise) {
    return refreshPromise
  }

  refreshPromise = (async () => {
    try {
      return await exchangeKeys()
    } finally {
      refreshPromise = null
    }
  })()

  return refreshPromise
}

// 检查密钥是否有效（提前10秒刷新）
export function shouldRefreshKeys(crypto) {
  return !crypto ||
    !crypto.sessionKey ||
    !crypto.aesKey ||
    (crypto.expireTime - Date.now() < 10000)
}
