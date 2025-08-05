import axios from 'axios'
// import { MessageBox, Message } from 'element-ui'
import store from '/store/index.js'
import {
	getToken
} from '/common/utils/auth'
import {
	aesEncrypt,
	aesDecrypt
} from './crypto'
import {
	refreshKeys,
	shouldRefreshKeys
} from './cryptoService'
import Cookies from 'js-cookie';

// import { createUniAppAxiosAdapter } from '@uni-helper/axios-adapter'
import axiosAdapterUniapp from 'axios-adapter-uniapp'

// create an axios instance
const service = axios.create({
	baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
	// withCredentials: true, // send cookies when cross-domain requests
	// adapter:createUniAppAxiosAdapter(),
	adapter: axiosAdapterUniapp,
	timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
	async config => {
			// console.log("config::::", JSON.stringify(config))
			const crypto = Cookies.get('crypto') ? JSON.parse(Cookies.get('crypto')) : ""
			const newConfig = {
				...config
			};

			// console.log("store.state.userInfo.token:::",store.state.userInfo.token)
			if (store.state.userInfo.token) {
				newConfig.headers['Authorization'] = 'Bearer ' + store.state.userInfo.token
			}

			if (store.state.encrypt_enabled) {
				// console.log("crypto:::::",crypto)
				if (shouldRefreshKeys(crypto)) {
					// try {
						let newCrypto = refreshKeys()
						
						if (store.state.crypto && JSON.stringify(store.state.crypto) != "{}" && JSON.stringify(newCrypto) == "{}") {
							newCrypto = store.state.crypto
						}
						newCrypto = JSON.parse(JSON.stringify(newCrypto))
						if (newCrypto || JSON.stringify(newCrypto) != "{}") {
							try{
								newCrypto.sessionKey && (newConfig.headers['X-Session-Key'] = newCrypto.sessionKey)
							}catch(e){}
							if (newConfig.data) {
								newConfig.data = {
									data: aesEncrypt(newConfig.data, newCrypto.aesKey)
								}
							}
							// console.log("请求参数2：newConfig:::", JSON.stringify(newConfig))
							return newConfig
						}
					// } catch (e) {
					// 	console.error('密钥刷新失败，使用旧密钥', JSON.stringify(e))
					// }
				}

				if (crypto.sessionKey && crypto.aesKey) {
					newConfig.headers['X-Session-Key'] = crypto.sessionKey
					if (newConfig.data) {
						console.log("2222222222222",newConfig.data, crypto.aesKey)
						newConfig.data = {
							data: aesEncrypt(newConfig.data, crypto.aesKey)
						}
					}
				}
			}
			// console.log("请求参数：newConfig:::", JSON.stringify(newConfig))
			return newConfig
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
		// console.log("接口返回::", JSON.stringify(response))
		const res = response.data
		if (store.state.encrypt_enabled && response.config.url.includes('/crypto') === false && response.data
			?.data) {
			// AES KEY EXPIRED.
			if (res.code === 407) {
				return handleSessionExpired(response.config)
			}

			const {
				aesKey
			} = store.state.crypto
			if (aesKey) {
				try {
					res.data = aesDecrypt(response.data.data, aesKey)
				} catch (e) {
					// console.log('解密失败', JSON.stringify(e))
					return Promise.reject(e)
				}
			}
		}

		// if the custom code is not 20000, it is judged as an error.
		if (res.code !== 0) {
			uni.showToast({
				title: res.message || '服务器返回异常',
				icon: 'none',
				duration: 5000
			});

			// 50008: Illegal token 50012: Other clients logged in 50014: Token expired
			if (res.code === 401 || res.code === 401 || res.code === 401) {
				// to re-login
				MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again',
					'Confirm logout', {
						confirmButtonText: 'Re-Login',
						cancelButtonText: 'Cancel',
						type: 'warning'
					}).then(() => {
					store.dispatch('resetToken').then(() => {
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
		console.log("报错接口返回：",error)
		uni.showToast({
			title: error.message,
			icon: "none"
		});

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
			console.log("333333333333",originalRequest.data, newCrypto.aesKey)
			originalRequest.data = {
				data: aesEncrypt(originalRequest.data, newCrypto.aesKey)
			}
		}
		return service(originalRequest)
	} catch (e) {
		// console.log('处理会话过期失败', JSON.stringify(e))
		return Promise.reject(e)
	}
}

export default service