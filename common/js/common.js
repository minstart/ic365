// 存储登录信息
// localStorage.setItem('userToken', 'your_token_here');

// 获取登录信息
// let token = localStorage.getItem('userToken');

// 清除登录信息
// localStorage.removeItem('userToken'); 
// import request from '@/utils/request'

// import {
// 	aesEncrypt,
// 	aesDecrypt
// } from '/common/utils/crypto';
// import { exchangeKeys } from '/common/utils/cryptoService';
import {
	refreshKeys,
	shouldRefreshKeys
} from '/common/utils/cryptoService'
import Cookies from 'js-cookie';
import request from '/common/utils/request'
import store from '/store/index.js'

// 校验加密数据
async function fetchData(data) {
	try {
		const crypto = Cookies.get('crypto') ? JSON.parse(Cookies.get('crypto')) : ""
		if (store.state.encrypt_enabled) {
			if (shouldRefreshKeys(crypto)) {
				await refreshKeys()
			}
		}
		data.url && data.url.indexOf("http") == -1 && (data.url = store.state.configData.staticUrl + data.url)
		return request({
			url: data.url,
			method: data.method || 'get',
			data: data.data
		}).finally(() => {
			uni.hideLoading()
		})
	} catch (error) {
		console.error('校验加密数据失败:', error);
	}
}

export default {
	data() {
		return {
			loading2: false,
			staticUrl: this.$store.state.configData.staticUrl
		}
	},
	onReady() {
		// Cookies.remove('crypto') //测试的时候需要每次清除
		// this.encryptionData()
	},
	onLoad() {
		// console.log(this.$store.state.hasLogin)
		// console.log(this.$store.state.configData.staticUrl)
		// console.log(this.staticUrl)
		// this.pageHeadTitle = "修改后的标题"
		// console.log("this.$store.state::",this.$store.state)
		// console.log(this.$store.mutation.login())
	},
	methods: {
		// 打印数据
		consoleLog(data, data2, data3) {
			let conText = '';
			data && (conText = conText + JSON.stringify(data));
			data2 && (conText = conText + JSON.stringify(data2));
			data3 && (conText = conText + JSON.stringify(data3));
			console.log(conText)
			return conText;
		},
		// 设置登录token状态及数据
		setLogin(data) {
			if (!data) return console.log("没有data");
			uni.setStorage({
				key: store.state.userInfo.cookieName,
				data: data,
				success: function() {
					store.state.userInfo.token = data.token
					store.state.userInfo.info = data;
				}
			});
		},
		getLogin() {
			let _this = this;
			return new Promise((resolve, reject) => {
				uni.getStorage({
					key: store.state.userInfo.cookieName,
					success: function(res) {
						// console.log(res.data)
						// console.log(store.state.userInfo)
						resolve(res.data);
						// if(store.state.userInfo.token != res.data.token || !res.data.info || res.data != store.state.userInfo){
						// 	uni.setStorage(store.state.userInfo)
						// }
						store.state.userInfo.token = res.data.token
						
						// console.log(store.state.userInfo.info)
						// store.state.userInfo.info = res.data;
					},
					fail: function(err) {
						console.log(err)
						reject(err);
						_this.removeLogin()
					}
				});
			})
			// console.log("data2::",data)
			// return data;
		},
		removeLogin() {
			uni.removeStorage({
				key: store.state.userInfo.cookieName,
				success: function() {
					store.state.userInfo.info = {};
					store.state.userInfo.token = "";
				}
			});
		},

		//公共请求函数
		// url请求路径
		// dataType 数据返回类型
		// method发起请求类型
		// .then() //成功返回
		// .catch() //失败返回
		// .finally()
		commonRequest(data) {
			this.consoleLog("请求前的传参：", data)
			uni.showLoading();
			return fetchData(data)

			// let successFn = data.success ? data.success : () => {};
			// let failFn = data.fail ? data.fail : () => {};
			// data.url && data.url.indexOf("http") == -1 && (data.url = this.staticUrl + data.url)
			// 	uni.request({
			// 		header:data.header||this.$store.state.requestHead,
			// 		url: data.url,
			// 		dataType: data.dataType || 'json',
			// 		method: data.type || "post",
			// 		timeout: data.timeout || 10000,
			// 		data: data.data,
			// 		success: (res) => {
			// 			console.log('request success：', res)
			// 			successFn()
			// 		},
			// 		fail: (err) => {
			// 			console.log('request fail：', err);
			// 			failFn()
			// 		},
			// 		complete: () => {
			// 			// 请求完成(成功失败都返回)
			// 			this.loading = false;
			// 			uni.hideLoading();
			// 		}
			// 	});

		}

		// 封装数据储存
		// key : key名称
		// data ：存储的数据
		,
		uniSetStorage(data) {
			if (!data || !data.key || !data.data) {
				console.log("存储数据失败：缺少key|data")
				return false;
			}
			if (typeof data.data == 'object') {
				data.data = JSON.stringify(data.data)
			}
			uni.setStorage({
				key: data.key,
				data: data.data,
				success: (res) => {
					uni.showModal({
						title: '存储数据成功',
						// #ifndef MP-ALIPAY
						content: JSON.stringify(res.errMsg),
						// #endif
						// #ifdef MP-ALIPAY
						content: data,
						// #endif
						showCancel: false
					})
				},
				fail: () => {
					uni.showModal({
						title: '储存数据失败!',
						showCancel: false
					})
				}
			})
		}
		// 清除储存数据
		,
		uniClearStorage() {
			uni.clearStorageSync()
		},
		// 跳转页面
		// url 跳转页面地址
		// type uni 跳转页面函数("navigateTo","redirectTo","reLaunch") - 默认navigateTo
		jumpPage(data) {
			if (!data) return this.consoleLog("jumpPage()没有传参")
			if (!data.url) return this.consoleLog("url没有传参")
			if (data.type) {
				switch (data.type) {
					case "navigateTo":
						// 方法用于保留当前页面，跳转到应用内的某个页面
						uni.navigateTo({
							url: data.url
						});
						break;
					case "redirectTo":
						// 方法用于关闭当前页面，跳转到应用内的某个页面
						uni.redirectTo({
							url: data.url
						});
						break;
					case "reLaunch":
						// 方法用于关闭所有页面，打开到应用内的某个页面
						uni.reLaunch({
							url: data.url
						});
						break;
					default:
						uni.navigateTo({
							url: data.url
						});
						break;
				}
			} else {
				uni.navigateTo({
					url: data.url
				});
			}
		},
		// 隐藏弹窗信息
		uniHide(type){
			if(!type) return;
			if(type == "all" || type == "loading"){
				uni.hideLoading()
			}
			if(type == "all" || type == "toast"){
				uni.hideToast();
			}
		}
		
	}
}