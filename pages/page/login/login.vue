	<meta content="always" name="referrer" />
	<template>
		<view class="page-wrap">
			<page-head :title='pageHeadTitle' :isBack='true' :background="'transparent'"></page-head>
			<view class="uni-padding-wrap">
				<h3 class="page-title">本机号码一键登录</h3>
				<button class="directLogin" @click='verifyNumber()'>本机号码登录</button>
				<view class="change-login"  @click="changeLogin()">手机验证码登陆</view>
			</view>
		</view>
	</template>

	<script>
		import store from '/store/index.js';
		import commonJs from '/common/js/common.js';
		import Cookies from 'js-cookie';
		// #ifdef APP-PLUS
		const ydLogin = uni.requireNativePlugin('YD-Login')
		ydLogin.registerWithBusinessID({
			businessId: '8a0edb8e5b064fffbaf91c2ed8b82930',
			loginType: 'quickLogin',
			timeout: 3,
			debug: true
		}, (data) => {
			if (data.success) {
				// console.log("初始化成功", data)
				ydLogin.shouldQuickLogin((data) => {
					// console.log(data)
					if (!data.success) {
						this.getLogin().then(data => {}).catch(err => {
							uni.showModal({
								content: '不具备一键登录网络环境（请保持手机卡移动数据联网，断开WiFi联网），或者是否需要跳转到手机验证码登录？',
								showCancel: true,
								success: (res) => {
									if (res.confirm) {
										// 确认
										uni.reLaunch({
											url: '/pages/page/login/phoneLogin'
										});
									} else if (res.cancel) {
										// 取消
									}
								}
							});
						})
						
						// this.consoleLog("不具备一键登录网络环境 - 跳转到账号密码登录", data)
					} else {
						// this.consoleLog("具备一键登录网络环境", data)
					}
				})
			} else {
				// this.consoleLog("初始化失败", data)
			}
		});
		// #endif

		export default {
			mixins: [commonJs],
			components: {

			},
			props: {

			},
			data() {
				return {
					pageHeadTitle: ""
				}
			},
			onLoad() {
				// this.consoleLog("neOneLogin::", neOneLogin)
				// neOneLogin.getToken();

				// this.pageHeadTitle = "修改后的标题"
			},
			onReady() {
				// this.getLogin()
				// setTimeout(()=>{
				// 	console.log("token2:::",store.state.userInfo.token)
				// },2000)
			},
			methods: {
				// 预取号
				verifyNumber() {
					uni.showLoading();
					// #ifdef APP-PLUS
					ydLogin.getPhoneNumberCompletion((data) => {
						uni.hideLoading()
						if (data.success) {
							// this.consoleLog('预取号成功', data)
							const config = {}
							ydLogin.setCustomView(config, (data) => {
								const platform = uni.getSystemInfoSync().platform
								if (platform === 'ios') {
									// this.consoleLog("ios自定义页面回调", data)
								} else if (platform === 'android') {
									// this.consoleLog("android自定义页面回调", data)
								}
							})

							ydLogin.cucmctAuthorizeLoginCompletion((data) => {
								if (!data.success && !data.cancel) {
									// this.consoleLog('授权失败', data)
								} else if (data.cancel) {
									// this.consoleLog('用户取消', data)

								} else {
									// TODO: 授权成功处理，可以进行关闭授权页、服务端验证等
									// this.consoleLog('授权成功：：', data)
									const _this = this;
									this.commonRequest({
											url: '/api/auth/oneClickLogin',
											method: "post",
											data: {
												yidun_token: data.token,
												telecom_token: data.accessToken
											},
										})
										.then(res => {
											console.log('/api/sms/forLogin：验证码登录成功:', JSON.stringify(res))
											ydLogin.closeAuthController()
											if (res.code === 0) {
												uni.showToast({
													title: res.message || '一键登陆成功',
													icon: 'success',
													duration: 2000,
													success: function() {
														_this.setLogin(res.data)
														setTimeout(() => {
															uni.reLaunch({
																url: "/pages/page/index/index"
															});
														}, 2000)
													}
												})
											} else {
												uni.showToast({
													title: res.message || "一键登陆失败",
													icon: 'none'
												})
											}
										}).catch(error => {
											uni.showToast({
												title: error || "一键登陆失败",
												icon: 'none'
											})
											// console.error('一键登陆失败:', JSON.stringify(error))
										})
									return false;
									// 下面是不用加密的
								}
							})
						} else {
							this.consoleLog('预取号失败了:', data)
						}

					});
					// #endif
				},
				changeLogin() {
					uni.navigateTo({
						url: '/pages/page/login/phoneLogin'
					});
				}
			}
		}
	</script>

	<style lang="scss">
		@import "/static/css/standard.scss";
		.page-wrap {
			width: 100%;
			height: 100%;
			background: url("/static/image/0_login_back.png") no-repeat top / 100%;
		}
		.page-title {
			padding: 3.25rem 2rem 4.375rem 2rem;
			font-size: 1.25rem;
			color: #F5A623;
		}
		.directLogin {
			margin: 2rem auto 1rem auto;
			width: 90%;
			background-color: $ThemeColor !important;
			color: #fff;
			font-size: 1rem;
		}

		.change-login {
			color: #393939;
			font-size: 0.75rem;
			float: right;
			margin: 0rem 5%;
			line-height: 2;
		}
	</style>