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
			!data.notLoading && uni.hideLoading()
		})
	} catch (error) {
		console.error('校验加密数据失败:', error);
	}
}

export default {
	data() {
		return {
			isLoading: true,
			userInfo: {
				nickname: "",
				currencies: {

				}
			},
			fontSize: 16, //页面默认rem尺寸
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
						// console.log(err)
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
		// notLoading 是否请求过程中显示loading图标
		// .then() //成功返回
		// .catch() //失败返回
		// .finally()
		commonRequest(data) {
			// this.consoleLog("请求前的传参：", data);
			!data.notLoading && uni.showLoading();
			return fetchData(data)
		},

		// 封装数据储存
		// key : key名称
		// data ：存储的数据
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
		},
		// 清除储存数据
		uniClearStorage() {
			uni.clearStorageSync()
		},
		// 跳转页面
		// url 跳转页面地址
		// type uni 跳转页面函数("navigateTo","redirectTo","reLaunch") - 默认navigateTo
		jumpPage(data) {
			console.log("jumpPage:::::", data)
			if (!data) return this.consoleLog("jumpPage()没有传参")
			if (!data.url) return this.consoleLog("url没有传参")
			if (data.type) {
				switch (data.type) {
					case "navigateTo":
						// 方法用于保留当前页面，跳转到应用内的某个页面
						uni.navigateTo({
							url: data.url,
							animationType: 'none', // 设置为"none"以关闭动画
							animationDuration: 0 // 动画持续时间设置为0
						});
						break;
					case "redirectTo":
						// 方法用于关闭当前页面，跳转到应用内的某个页面
						uni.redirectTo({
							url: data.url,
							animationType: 'none', // 设置为"none"以关闭动画
							animationDuration: 0 // 动画持续时间设置为0
						});
						break;
					case "reLaunch":
						// 方法用于关闭所有页面，打开到应用内的某个页面
						uni.reLaunch({
							url: data.url,
							animationType: 'none', // 设置为"none"以关闭动画
							animationDuration: 0 // 动画持续时间设置为0
						});
						break;
					default:
						uni.navigateTo({
							url: data.url,
							animationType: 'none', // 设置为"none"以关闭动画
							animationDuration: 0 // 动画持续时间设置为0
						});
						break;
				}
			} else {
				uni.navigateTo({
					url: data.url,
					animationType: 'none', // 设置为"none"以关闭动画
					animationDuration: 0 // 动画持续时间设置为0
				});
			}
		},
		// 隐藏弹窗信息
		uniHide(type) {
			if (!type) return;
			if (type == "all" || type == "loading") {
				uni.hideLoading()
			}
			if (type == "all" || type == "toast") {
				uni.hideToast();
			}
		},
		// 设置屏幕rem的fontsize(主要用在横屏保持竖屏尺寸)
		setRootFontSize(data) {
			const baseWidth = 375; // 基准宽度
			const baseFontSize = 16; // 基准字体大小
			let scale = uni.getSystemInfoSync().windowWidth / baseWidth; // 获取当前窗口宽度并计算比例
			let _this = this;
			if (!data || (data.orientation && data.orientation == "portrait")) {
				try {
					let newFontSize = baseFontSize * scale
					if (newFontSize > 0) {
						newFontSize < 16 && (newFontSize = 16);
						store.state.baseFontSize = newFontSize;
						this.fontSize = newFontSize;
						console.log("设置store.state.baseFontSize", store.state.baseFontSize)
					} else {
						console.log("newFontSize:", newFontSize, store.state.baseFontSize)
					}
				} catch (e) {
					console.log('报错：：：：', e)
				}
			} else if (store.state.baseFontSize) {
				console.log("store.state.baseFontSize:", store.state.baseFontSize)
				if(data.orientation && data.orientation == "landscape"){
					// 横屏的rem设置有毒
					var index = 30;
					let time = setInterval(()=>{
						index = index - 1;
						if(index==0){
							clearInterval(time)
						}
						this.fontSize = store.state.baseFontSize-0.01;
						setTimeout(()=>{
							this.fontSize = store.state.baseFontSize
						},10)
					},100)
				}else{
					this.fontSize = store.state.baseFontSize
				}
				
			} else {
				console.log("baseFontSize::", baseFontSize)
				this.fontSize = baseFontSize;
			}
		},

		// 页面onShow 钩子触发的函数
		// uniHide 隐藏各种弹窗等
		// orientation 页面横屏竖屏 portrait（竖屏）或landscape（横屏）
		pageOnShowSet(data) {
			if (!data) return;
			return new Promise((resolve, reject) => {
				// store.state.isLoading = true;
				// setTimeout(() => {
					store.state.isLoading = false;
				// }, 1000)
				try {
					data.uniHide && this.uniHide(data.uniHide)
				} catch (e) {}

				if (store.state.userInfo.info) {
					this.userInfo = {
						...this.userInfo,
						...store.state.userInfo.info
					}
				}

				// this.setRootFontSize(data)
				let _this = this
				// 设置横屏还是竖屏，默认竖屏
				try {
					if (data.orientation) {
						if(data.orientation == "portrait"){
							
						}
						setTimeout(() => {
							// #ifdef APP-PLUS
							plus.screen.lockOrientation(data.orientation + '-primary');
							// #endif  
						}, data.orientation == "portrait" ? 0 : 500)
						_this.setRootFontSize(data)
					} else {
						// #ifdef APP-PLUS
						plus.screen.lockOrientation('portrait-primary');
						// #endif  
						_this.setRootFontSize(data)
					}
				} catch (e) {
					// #ifdef APP-PLUS
					plus.screen.lockOrientation('portrait-primary');
					// #endif  
					_this.setRootFontSize(data)
				}

				resolve();
			})

		},

		// 奖励图标统一返回
		rewardIcon(id) {
			switch (id) {
				case 1:
					// 智慧星
					return "/static/icons/star.png";
					break;
				case 2:
					// 知识尘
					return "/static/icons/dust.png";
					break;
				case 3:
					// 启明石
					return "/static/icons/stone.png";
					break;
				case 4:
					// 丰硕穗
					break;
				case 5:
					// 圣诞欢乐颂
					return "/static/icons/christmas.png";
					break;
				case 6:
					// 课程
					break;
			}
		},

		// 校验是否已经登录
		// success : function 确认已经登录的调用
		verifLogin(_data) {
			let _this = this;
			return new Promise((resolve, reject) => {
				const route = getCurrentPages(); //获取当前页面地址
				const pathUrl = route[route.length - 1].route;
				_this.getLogin().then(data => {
					// 已经登陆了
					_this.consoleLog("已经登陆了")
					data.route = route;
					data.pathUrl = pathUrl;
					resolve(data);
				}).catch(err => {
					// 没有登陆
					reject(err);
					// console.error("data：：：：：2", JSON.stringify(err));
					if (pathUrl.indexOf("/login") == -1) {
						// 没有登录
						console.log("没有登录,跳转到登录页面")
						// #ifdef APP-PLUS
						uni.redirectTo({
							url: '/pages/page/login/login?pageFrom=' + pathUrl
						});
						// #endif
						// #ifdef H5
						// uni.redirectTo({
						// 	url: '/pages/page/login/phoneLogin?pageFrom=' + pathUrl
						// });
						// #endif
					}
				});
			})
		}
	}
}