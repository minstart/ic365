const configData = {
	staticUrl: "https://ic365.ajulye.com" //请求接口地址
}
import Cookies from 'js-cookie';
// #ifndef VUE3
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const getCrypto = (data) => {
	const crypto = JSON.parse(Cookies.get('crypto') || 'null') || {
		sessionKey: '',
		aesKey: '',
		expireTime: 0
	};
	return crypto;
}

const store = new Vuex.Store({
			// #endif

			// #ifdef VUE3
			import {
				createStore
			} from 'vuex'
			const store = createStore({
				// #endif
				// 在Vuex中，store的state属性用于存储全局状态数据，通过mutations和actions进行修改
				// State: 驱动应用的单一状态源
				state: {
					// 状态数据
					configData: configData, //接口请求路径
					defaultHeadPic: "/static/image/head_pic.png", //默认用户头像
					requestHead: {
						Authorization: ""
					},
					userInfo: { //储存用户登录信息
						cookieName: "userInfo", //用于查询cookie储存的key名称
						token: "", //登陆后的token，没有就说明没登录
						info: {} //登录用户信息数据存储
					},
					crypto: crypto,
					encrypt_enabled: process.env.VUE_APP_ENCRYPT_ENABLED === 'true',
					formRules: { //uni-forms校验必填
						phone: /^1[3456789]\d{9}$/
					},
					baseFontSize:16,
					isLoading:true,//页面是否加载loading样式


					hasLogin: false,
					isUniverifyLogin: false,
					loginProvider: "",
					openid: null,
					testvuex: false,
					colorIndex: 0,
					colorList: ['#FF0000', '#00FF00', '#0000FF'],
					noMatchLeftWindow: true,
					active: 'componentPage',
					leftWinActive: '/pages/page/index/index',
					activeOpen: '',
					menu: [],
					univerifyErrorMsg: '',
					// vuex测试例使用
					username: "foo",
					sex: "男",
					age: 10
				},
				// Mutations: 同步修改 State 的方法
				mutations: {
					// 复位crypto
					RESET_CRYPTO: (state) => {
						Cookies.remove('crypto')
						state.crypto = {
							sessionKey: '',
							aesKey: '',
							expireTime: 0
						}
					},
					// 设置crypto
					SET_CRYPTO: (state, crypto) => {
						// console.log("crypto:::index",crypto)
						state.crypto = crypto
						Cookies.set('crypto', JSON.stringify(crypto))
					},
					SET_ENCRYPTENABLED: (state, encryptEnabled) => {
						state.encrypt_enabled = encryptEnabled
					},
					RESET_LOGIN: (state) => {
						state.userInfo.info = {};
						state.userInfo.token = "";
					},
					SET_LOGIN: (state, data) => {
						console.log("data.token::", data.token)
						state.userInfo.token = data.token
						state.userInfo.info = data;
					},
					Update_UserInfo: (state, data) => {
						state.userInfo.info = {
							...state.userInfo.info,
							...data
						}
						uni.setStorage({
							key: state.userInfo.cookieName,
							data: state.userInfo,
							success: function() {
								// state.userInfo.token = data.token;
								// state.userInfo.info = data;
							}
						});
					},





					// 同步方法
					login(state, provider) {
						state.hasLogin = true;
						state.loginProvider = provider;
					},
					logout(state) {
						state.hasLogin = false
						state.openid = null
					},
					setOpenid(state, openid) {
						state.openid = openid
					},
					setTestTrue(state) {
						state.testvuex = true
					},
					setTestFalse(state) {
						state.testvuex = false
					},
					setColorIndex(state, index) {
						state.colorIndex = index
					},
					setMatchLeftWindow(state, matchLeftWindow) {
						state.noMatchLeftWindow = !matchLeftWindow
					},
					setActive(state, tabPage) {
						state.active = tabPage
					},
					setLeftWinActive(state, leftWinActive) {
						state.leftWinActive = leftWinActive
					},
					setActiveOpen(state, activeOpen) {
						state.activeOpen = activeOpen
					},
					setMenu(state, menu) {
						state.menu = menu
					},
					setUniverifyLogin(state, payload) {
						typeof payload !== 'boolean' ? payload = !!payload : '';
						state.isUniverifyLogin = payload;
					},
					setUniverifyErrorMsg(state, payload = '') {
						state.univerifyErrorMsg = payload
					},
					// vuex测试例使用
					increment(state) {
						state.age++;
					},
					incrementTen(state, payload) {
						state.age += payload.amount
					},
					resetAge(state) {
						state.age = 10
					}
				},
				getters: {
					// 计算属性，用于从state派生出一些状态
					currentColor(state) {
						return state.colorList[state.colorIndex]
					},
					// vuex测试例使用
					doubleAge(state) {
						return state.age * 2;
					}
				},
				// Actions: 处理异步操作并提交 Mutations
				actions: {
					// 异步方法，可以调用mutations或者其他的API调用等
					// vuex测试例使用
					incrementAsync(context, payload) {
						context.commit('incrementTen', payload)
					},
					// lazy loading openid
					getUserOpenId: async function({
						commit,
						state
					}) {
						return await new Promise((resolve, reject) => {
							if (state.openid) {
								resolve(state.openid)
							} else {
								// uni.login({
								// 	success: (data) => {
								// 		commit('login')
								// 		setTimeout(function() { //模拟异步请求服务器获取 openid
								// 			const openid = '123456789'
								// 			console.log(
								// 				'uni.request mock openid[' +
								// 				openid + ']');
								// 			commit('setOpenid', openid)
								// 			resolve(openid)
								// 		}, 1000)
								// 	},
								// 	fail: (err) => {
								// 		console.log('uni.login 接口调用失败，将无法正常使用开放接口等服务',
								// 			err)
								// 		reject(err)
								// 	}
								// })
							}
						})
					},
					getPhoneNumber: function({
						commit
					}, univerifyInfo) {
						return new Promise((resolve, reject) => {
							uni.request({
								url: 'https://97fca9f2-41f6-449f-a35e-3f135d4c3875.bspapp.com/http/univerify-login',
								method: 'POST',
								data: univerifyInfo,
								success: (res) => {
									const data = res.data
									if (data.success) {
										resolve(data.phoneNumber)
									} else {
										reject(res)
									}

								},
								fail: (err) => {
									reject(res)
								}
							})
						})
					}
				},
				modules: {
					// 模块化，可以将公共函数放在模块中

				}
			})

			export default store