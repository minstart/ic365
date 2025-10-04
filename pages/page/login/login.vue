	<meta content="always" name="referrer" />
	<template>
		<view class="page-wrap">
			<page-head ref="pageHead" :title='pageHeadTitle' :isBack='false' :background="'transparent'"></page-head>
			<view class="uni-padding-wrap">
				<h3 class="page-title">本机号码一键登录</h3>
				<uni-forms ref="baseForm" :rules="rules" :model="baseFormData" labelWidth="80px">
					<uni-forms-item class="uni-forms-item checkbox-item" required name="agreement" label-width="0">
						<view class="agreement-text">已阅读并同意
							<span class="link-a" @click="jumpPage({url:'/pages/page/user/webView?webViewType=4'})">《儿童隐私政策》</span>、
							<span class="link-a" @click="jumpPage({url:'/pages/page/user/webView?webViewType=2'})">《用户服务协议》</span>、
							<span class="link-a" @click="jumpPage({url:'/pages/page/user/webView?webViewType=1'})">《第三方SDK清单》</span>和
							<span class="link-a" @click="jumpPage({url:'/pages/page/user/webView?webViewType=3'})">《隐私政策》</span>。
						</view>
						<uni-data-checkbox multiple v-model="baseFormData.agreement" :localdata="agreements" />
					</uni-forms-item>
				</uni-forms>
				<button class="directLogin" @click='verifyNumber()'>本机号码登录</button>
				<view class="change-login" @click="changeLogin()">手机验证码登陆</view>
			</view>
		</view>
	</template>

	<script>
		import store from '/store/index.js';
		import commonJs from '/common/js/common.js';
		import Cookies from 'js-cookie';
		// #ifdef APP-PLUS
		const ydLogin = uni.requireNativePlugin('YD-Login');
		ydLogin.registerWithBusinessID({
			businessId: '8a0edb8e5b064fffbaf91c2ed8b82930',
			loginType: 'quickLogin',
			timeout: 3,
			debug: true
		}, (data) => {
			if (data.success) {
				// console.log("初始化成功", data)
				ydLogin.shouldQuickLogin((data) => {
					console.log("检测是否符合条件",data)
					if (!data.success) {
						try {
							// uni.showModal({
							// 	content: '不具备一键登录网络环境（请保持手机卡移动数据联网），或者是否需要跳转到手机验证码登录？',
							// 	showCancel: true,
							// 	success: (res) => {
							// 		if (res.confirm) {
							// 			// 确认
							// 			uni.reLaunch({
							// 				url: '/pages/page/login/phoneLogin'
							// 			});
							// 		} else if (res.cancel) {
							// 			// 取消
							// 		}
							// 	}
							// })
						} catch (e) {}

						// console.log("不具备一键登录网络环境 - 跳转到账号密码登录", data)
					} else {
						// console.log("具备一键登录网络环境", data)
					}
				})
			} else {
				// console.log("初始化失败", data)
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
					pageHeadTitle: "",
					baseFormData: {
						agreement: ""
					},
					agreements: [{
						text: '',
						value: 0
					}],
					rules: {
						agreement: {
							rules: [{
								required: true,
								errorMessage: '请查看协议内容并勾选'
							}]
						},
					}
				}
			},
			onShow() {
				this.pageOnShowSet({
					uniHide: "all"
				})
			},
			onLoad() {
				// console.log("neOneLogin::", neOneLogin)
				// neOneLogin.getToken();

				// this.pageHeadTitle = "修改后的标题"
				uni.showToast({
					title: '登陆成功',
					icon: 'success',
					duration: 9000
				})
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
					this.$refs['baseForm'].validate().then(res => {
						uni.showLoading();
						// #ifdef APP-PLUS
						ydLogin.getPhoneNumberCompletion((data) => {
							uni.hideLoading()
							let preNumberData = data;
							if (data.success) {
								console.log('预取号成功', data)
								const platform = uni.getSystemInfoSync().platform
								const config = {
								}
								if (platform === 'ios') {
									config.presentDirectionType = 1;
								}
								try {
									ydLogin.setCustomView(config, (data) => {
										if (platform === 'ios') {
											// console.log("ios自定义页面回调", data)
										} else if (platform === 'android') {
											// console.log("android自定义页面回调", data)
										}
									})
								} catch (e) {}
								
								ydLogin.cucmctAuthorizeLoginCompletion((data) => {
									console.log("data::", data)
									if (!data.success && !data.cancel) {
										console.log('授权失败', data)
									} else if (data.cancel) {
										console.log('用户取消', data)
									} else {
										// TODO: 授权成功处理，可以进行关闭授权页、服务端验证等
										console.log('授权成功：：', data)
										const _this = this;
										this.commonRequest({
											url: '/api/auth/oneClickLogin',
											method: "post",
											data: {
												yidun_token: preNumberData.token,
												telecom_token: data.accessToken
											}
										}).then(res => {
											_this.setLogin(res.data)
											console.log('/api/sms/forLogin：一键登陆成功:', res)
											uni.showToast({
												title: '登陆成功',
												icon: 'success',
												duration: 3000
											})
											setTimeout(() => {
												uni.reLaunch({
													url: "/pages/page/index/index"
												});
												ydLogin.closeAuthController()
											}, 2000)
										}).catch(error => {
											uni.showToast({
												title: "一键登陆失败",
												icon: 'none'
											})
											// console.error('一键登陆失败:', JSON.stringify(error))
										})
										return false;
										// 下面是不用加密的
									}
								})
								// console.log(456)
							} else {
								console.log('预取号失败了:', data)
								// uni.showToast({
								// 	title: data.msg || data.desc + "，请重新点击或者切换手机验证码方式登录！" || "一键登陆失败调用预约号失败，请重新点击或者切换手机验证码方式登录！",
								// 	icon: 'none',
								// 	duration: 5000
								// })
								
								let _this = this;
								this.$refs.pageHead.openPopupTips({
									title: "提示",
									content: data.msg || data.desc + '请关闭WiFi，使用中国移动、中国电信、中国联通数据流量，再点击一键登录！或者是否需要跳转到手机验证码登录？',
									success: res => {
										this.$refs.pageHead.closePopupTips()
										// 确认
										uni.reLaunch({
											url: '/pages/page/login/phoneLogin'
										});
									}
								})
							}
						});
						// #endif
					}).catch(err => {
						// console.log('err', err);
						uni.showToast({
							title: err[0].errorMessage,
							icon: "none"
						});
					})
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
			height: calc(100vh - 88rpx);
			background: url("/static/image/0_login_back.png") no-repeat top / 100%;
		}

		.page-title {
			padding: 3.25rem 2rem 4.375rem 2rem;
			font-size: 1.25rem;
			color: $ThemeColor;
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

		.checkbox-item {
			position: relative;
			margin-bottom: 1rem;

			.uni-label-pointer {
				padding-bottom: 1rem;
			}

			.agreement-text {
				position: absolute;
				top: 3px;
				right: 0;
				width: calc(100% - 1.5rem);
				font-size: 0.75rem;
				z-index: 2;
				line-height: 1.5;
				padding-bottom: 1rem;

				.link-a {
					color: #0034FF !important;
					font-size: 0.75rem;
					text-decoration: none;
					display: inline-block;
				}
			}
		}

		.uni-link {
			color: #0034FF !important;
		}

		.uni-data-checklist {
			.checklist-group {
				.checklist-box {
					align-items: flex-start !important;
					margin-right: 0 !important;
					line-height: 1.5 !important;

					.checkbox__inner {
						border-radius: 50% !important;
					}
				}

				.checklist-box.is--default.is-checked {
					.checkbox__inner {
						border-color: $ThemeColor !important;
						background-color: $ThemeColor !important;
					}

					.checklist-text {
						color: $ThemeColor !important;
					}
				}
			}
		}
	</style>