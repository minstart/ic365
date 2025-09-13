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

const imageUrlPattern = /https:\/\/[^\s]+\.(png|jpg|jpeg|gif|svg)/gi; //图片校验

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
			method: data.method || 'post',
			data: data.data
		}).finally(() => {
			!data.notLoading && uni.hideLoading()
		})
	} catch (error) {
		// store.commit('RESET_CRYPTO') //清除crypto加密储存数据
		console.error('校验加密数据失败:', error);

	}
}

export default {
	data() {
		return {
			pageMask: true, //页面遮罩，配合组件page-head使用
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
	onHide() {
		this.pageMask = true;
	},
	methods: {
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
		// method发起请求类型 默认get
		// notLoading 是否请求过程中显示loading图标
		// .then() //成功返回
		// .catch() //失败返回
		// .finally()
		commonRequest(data) {
			// console.log("请求前的传参：", data);
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
			// console.log("jumpPage:::::", data)
			if (!data) return console.log("jumpPage()没有传参")
			if (!data.url) return console.log("url没有传参"), uni.showToast({
				title: "没有填写跳转地址",
				icon: "none"
			})
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
						// 如果是跳转到导航栏的页面，用这个
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
				if (data.orientation && data.orientation == "landscape") {
					// 横屏的rem设置有毒
					var index = 6;
					let time = setInterval(() => {
						index = index - 1;
						if (index == 0) {
							clearInterval(time)
						}
						this.fontSize = store.state.baseFontSize - 0.01;
						setTimeout(() => {
							this.fontSize = store.state.baseFontSize
						}, 10)
					}, 200)
				} else {
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
			store.state.isLoading = true;
			this.pageMask = true;
			if (!data) return;
			return new Promise((resolve, reject) => {
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
					uni.showLoading({})
					if (data.orientation) {
						setTimeout(() => {
							// #ifdef APP-PLUS
							plus.screen.lockOrientation(data.orientation + '-primary');
							// #endif  
						}, 400)
						_this.setRootFontSize(data)
					} else {
						// setTimeout(() => {
						// #ifdef APP-PLUS
						plus.screen.lockOrientation('portrait-primary');
						// #endif  
						// }, 0)
						_this.setRootFontSize(data)
					}
					setTimeout(() => {
						try {
							this.pageMask = false;
						} catch (e) {}
						uni.hideLoading();
					}, 1000)
				} catch (e) {
					// #ifdef APP-PLUS
					plus.screen.lockOrientation('portrait-primary');
					// #endif  
					_this.setRootFontSize(data)
				}
				setTimeout(() => {
					store.state.isLoading = false;
				}, 1000)
				resolve();
			})
		},

		// 奖励图标统一返回
		rewardIcon(id) {
			if (id == 1) {
				// 智慧星
				return {
					min: "/static/icons/star.png",
					moderate: "/static/icons/star2.png",
					icon3: "/static/icons/star3.png",
					icon4: "/static/icons/star4.png",

				};
			} else if (id == 2) {
				// 知识尘
				return {
					min: "/static/icons/dust.png",
					moderate: "/static/icons/dust2.png",
					icon3: "/static/icons/dust3.png",
					icon4: "/static/icons/dust4.png",

				};
			} else if (id == 3) {
				// 启明石
				return {
					min: "/static/icons/stone.png",
					moderate: "/static/icons/stone2.png",
					icon3: "/static/icons/stone3.png",
					icon4: "/static/icons/stone4.png",
				};
			} else if (id == 4) {
				// 丰硕穗
			} else if (id == 5) {
				return {
					min: "/static/icons/christmas.png",
					moderate: ""
				};
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
					// console.log("已经登陆了 - 来自common")
					data.route = route;
					data.pathUrl = pathUrl;
					resolve(data);
				}).catch(err => {
					// 没有登陆
					reject(err);
					// console.error("data：：：：：2", JSON.stringify(err));
					// console.log(pathUrl)
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
		},

		verifVip(_data) {
			let _this = this;
			return new Promise((resolve, reject) => {
				typeof _data.vip == "undefined" && (_data.vip = 0);
				typeof _data.myvip == "undefined" && (_data.myvip = 0);
				if (_data.myvip >= _data.vip) {
					// 是会员且符合VIP要求
					resolve()
				} else {
					uni.showModal({
						// title: '提示',
						content: _data.msg || '当前会员等级不满足该功能需要的vip会员等级，是否同意展示开通会员渠道？',
						success: function (res) {
							if (res.confirm) {
								_this.openOfficialAccountWindow()
								console.log('用户点击确定');
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					});
					reject()
				}
			})
		},
		openOfficialAccountWindow(){
			this.$store.state.officialAccountQRCode = "";
			console.log(this.$refs)
			// 获取公众号二维码
			this.commonRequest({
				url: "/api/common/get-wechat-qr"
			}).then(res => {
				// console.log("获取公众号二维码::", res)
				this.$store.state.officialAccountQRCode = res.data
				this.$refs.pageHead.openBecomeMember()
			}).catch(error => {
				console.log("获取公众号二维码报错：：", error)
			})
		},
		

		/**
		 * 获取任意时间(转换时间)
		 */
		changeDate(date, AddDayCount = 0) {
			if (!date) {
				date = new Date()
			}
			if (typeof date == "number") {
				if (date.toString().length == 10) {
					date = Number(date.toString() + "000")
				}
			} else if (typeof date !== 'object') {
				date = date.replace(/-/g, '/')
			}
			const dd = new Date(date)

			dd.setDate(dd.getDate() + AddDayCount) // 获取AddDayCount天后的日期

			const y = dd.getFullYear()
			const m = dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1 // 获取当前月份的日期，不足10补0
			const d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate() // 获取当前几号，不足10补0
			return {
				fullDate: y + '-' + m + '-' + d,
				year: y,
				month: m,
				date: d,
				day: dd.getDay()
			}
		},
		// 转换服务端返回的时间转换成YYYY-MM-DD
		// type不传 返回格式：YYYY-MM-DD，type:1 => YYYY-MM-DD  type:2 直接删除T返回
		changeTime(time, type) {
			if (!time) return false;
			if (typeof type != "undefined" && type == 2) return time.replace("T", "");
			if (time.indexOf("T") != 1 || time.indexOf(":") != 1) {
				let date = new Date(time);
				const y = date.getFullYear()
				const m = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1 // 获取当前月份的日期，不足10补0
				const d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate() // 获取当前几号，不足10补0
				return `${y}-${m}-${d}`;
			} else {
				return time;
			}
		},
		// 计算倒计时（剩余时间）
		calculateDaysUntilDeadline(endTime) {
			if (endTime.indexOf("-") != -1) {
				endTime = new Date(endTime).getTime()
			}
			if (typeof endTime == "string") {
				endTime = Number(endTime);
				if (!endTime) return "";
			}
			// 获取当前时间的时间戳
			const now = new Date().getTime();
			// 计算两个时间戳的差值（毫秒）
			const diff = endTime - now;
			// 将差值转换为天数（需要除以一天的毫秒数86400000）
			const daysUntilDeadline = Math.floor(diff / (1000 * 60 * 60 * 24));

			return daysUntilDeadline;
		},
		// 计算时间戳距离现在还剩多少
		calculateTimeDifference(endTime) {
			const givenDate = new Date(endTime);
			const currentDate = new Date();
			const diffMs = givenDate - currentDate; // 绝对值，不考虑正负
			const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)); // 天数
			const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); // 剩余小时数
			return {
				days: diffDays,
				hours: diffHours
			}
		},
		// 图片路径转换为图片
		// content : 需要转换的内容
		// imgClass : 转换后图片的class名称 默认change-img
		imgUrlChangeImg(data) {
			if (!data || !data.content) return false;
			if (data.content.indexOf("http") != -1) {
				// 1. 正则表达式提取图片URL
				const contentImages = data.content.match(imageUrlPattern) || [];
				// 2. 删除图片URL后的文本
				try {
					contentImages.forEach((item, i) => {
						data.content = data.content.replace(item, 'imgDom' + i).trim();
					})
					contentImages.forEach((item, i) => {
						data.content = data.content.replace('imgDom' + i, '<image class="' + (data.imgClass || "change-img") + '" src="' + item + '" mode=""></image>').trim();
					})
					return data.content;
				} catch (e) {
					return data.content;
				}
			} else {
				return data.content;
			}
		},
		// 处理任务跳转数据
		openTask(item) {
			// 返回true,页面处理 false 当前逻辑处理
			if (item.processTotal && item.processTotal == 100) {
				return true;
			}
			// 没有做完，跳转到任务界面
			if (item.matchSubTypeId == 1) {
				// 任务做题
				this.jumpPage({
					url: '/pages/page/study/answerQuestions?pageType=question&missionId=' + item.missionId
				})
				return false;
			} else if (item.matchSubTypeId == 2) {
				// 任务看视频
				this.jumpPage({
					url: '/pages/page/study/answerQuestions?pageType=video&categoryId=' + (item.categoryId || '') + '&missionId=' + item.missionId
				})
				return false;
			} else {
				uni.showToast({
					title: "匹配不到任务类型",
					icon: "none"
				})
				return true;
			}
		},
		// 对象转换成url参数
		objectToQueryString(obj) {
			return Object.keys(obj).map(key => {
				return encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]);
			}).join('&');
		}
	}
}