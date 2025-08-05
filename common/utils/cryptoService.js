import request from '/common/utils/request'
import {
	generateAesKey,
	rsaEncrypt
} from '/common/utils/crypto'
import store from '/store/index.js'

const staticUrl = store.state.configData.staticUrl

// console.log("11111:",staticUrl)
let refreshPromise = null
async function getPublicKey() {
	return new Promise((resolve, reject) => {
		uni.request({
			url: staticUrl + '/api/crypto/publicKey',
			method: 'get',
			success: res => {
				resolve(res);
			},
			fail: err => {
				reject(err);
			},
			complete: (res) => {
				// console.log("/api/crypto/publicKey接口返回：", JSON.stringify(res))
			}
		})
	})
}
async function getExchange(data) {
	return new Promise((resolve, reject) => {
		uni.request({
			url: staticUrl + '/api/crypto/exchange',
			method: 'POST',
			data:data,
			success: res => {
				resolve(res);
			},
			fail: err => {
				reject(err);
			},
			complete: (res) => {
				// console.log("/api/crypto/exchange接口返回：", JSON.stringify(res))
			}
		})
	})
}
// 密钥交换逻辑（登录时使用）
export async function exchangeKeys() {

	// try {
	// 1. 获取RSA公钥
	const pubRes = await getPublicKey()

	// 2. 生成并加密AES密钥
	const aesKey = generateAesKey()
	// 3. 交换密钥
	const encryptedKey = rsaEncrypt(aesKey, pubRes.data.data.public_key)
	const keyRes = await getExchange({
		keyId: pubRes.data.data.key_id,
		encryptedAesKey: encryptedKey
	})
	
	// uni.request({
	// 	url: staticUrl + '/api/crypto/exchange',
	// 	method: 'post',
	// 	data: {
	// 		keyId: pubRes.data.data.key_id,
	// 		encryptedAesKey: encryptedKey
	// 	},
	// 	complete: function(res) {
	// 		console.log("/api/crypto/exchange接口返回：", JSON.stringify(res))
	// 	}
	// })
	// console.log("keyRes::",keyRes)
	// 4. 存储密钥信息
	const cryptoData = {
		sessionKey: keyRes.data.data.session_key,
		aesKey: aesKey,
		expireTime: Date.now() + keyRes.data.expire_time * 1000
	}
	
	// const pubRes = await request({
	// 	url: staticUrl + '/api/crypto/publicKey',
	// 	method: 'get'
	// })
	store.commit('SET_CRYPTO', cryptoData)
	// aesKey && (refreshPromise = cryptoData);
	return cryptoData
	// } catch (error) {
	// 	console.log('密钥交换失败', JSON.stringify(error))
	// 	if(store.state.crypto && JSON.stringify(store.state.crypto) != "{}"){
	// 		// console.log("store.state.crypto::",JSON.stringify(store.state.crypto))
	// 		return store.state.crypto
	// 	}
	// 	throw error
	// }
}


export async function refreshKeys() {
	// console.log("refreshKeys2222222222222::",JSON.stringify(refreshPromise))
	if (store.state.crypto && JSON.stringify(store.state.crypto) != "{}" && JSON.stringify(
			refreshPromise) == "{}") {
		newCrypto = store.state.crypto
		return newCrypto;
	}

	if (refreshPromise) {
		// console.log("refreshPromisekkkkk:::::::::::",JSON.stringify(refreshPromise))
		return refreshPromise;
	}

	refreshPromise = (async () => {
		try {
			return await exchangeKeys()
		} finally {
			// console.log("refreshPromise报错！！！！！！！")
			// refreshPromise = null
			if (store.state.crypto && store.state.crypto.aesKey) {
				refreshPromise = store.state.crypto
				return store.state.crypto;
			}
		}
	})()
	// console.log("refreshKeys::",JSON.stringify(refreshPromise))
	return refreshPromise
}


// 检查密钥是否有效（提前10秒刷新）
export function shouldRefreshKeys(crypto) {
	return !crypto ||
		!crypto.sessionKey ||
		!crypto.aesKey ||
		(crypto.expireTime - Date.now() < 10000)
}