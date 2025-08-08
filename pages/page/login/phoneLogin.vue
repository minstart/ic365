	<template>
		<page-head :title='pageHeadTitle' :isBack='true' :background="'transparent'"></page-head>
		<h3 class="page-title">输入手机号，验证码登录</h3>
		<view class="uni-padding-wrap uni-common-mt">
			<uni-forms ref="baseForm" :rules="rules" :model="baseFormData" labelWidth="80px">
				<uni-forms-item class="uni-forms-item phone-input-wrap" required name="phone" label-width="0">
					<uni-easyinput type="tel" v-model="baseFormData.phone" maxlength="11" placeholder="请输入手机号码" />
					<button class="get-verification-code" type="primary" :disabled="isForLogin" size="mini"
						@click="forLogin('baseForm')">{{forLoginName}}</button>
				</uni-forms-item>
				<uni-forms-item class="uni-forms-item" required name="code" label-width="0">
					<uni-easyinput v-model="baseFormData.code" placeholder="请输入验证码" />
				</uni-forms-item>
				<uni-forms-item class="uni-forms-item checkbox-item" required name="agreement" label-width="0">
					<view class="agreement-text">已阅读并同意<uni-link class="link-a" href="https://www.baidu.com/"
							text="《智算365》"></uni-link>、<uni-link class="link-a" href="https://www.baidu.com/"
							text="《用户服务协议》"></uni-link>、<uni-link class="link-a" href="https://www.baidu.com/"
							text="《隐私政策》"></uni-link>和<uni-link class="link-a" href="https://www.baidu.com/"
							text="《中国移动认证服务协议》"></uni-link>。</view>
					<uni-data-checkbox multiple v-model="baseFormData.agreement" :localdata="agreements" />
				</uni-forms-item>
				<button class="submit-btn" type="primary" @click="submit('baseForm')">立即登录</button>
				<view class="change-login">手机号码一键登录</view>

			</uni-forms>

		</view>
	</template>

	<script>
		import store from '/store/index.js';
		import commonJs from '/common/js/common.js';

		export default {
			mixins: [commonJs],
			components: {

			},
			props: {

			},
			data() {
				return {
					pageHeadTitle: "",
					isForLogin: false, //是否禁用发送验证码
					forLoginName: "发送验证码",
					baseFormData: {
						phone: "",
						code: "",
						agreement: ""
					},
					agreements: [{
						text: '',
						value: 0
					}],
					rules: {
						phone: {
							rules: [{
								required: true,
								errorMessage: '手机号码不能为空',
							}, {
								validateFunction: (rule, value, data, callback) => {
									let reg = this.$store.state.formRules.phone
									//判断手机号格式时候正确
									if (!reg.test(this.baseFormData.phone)) {
										callback('请输入正确的手机号')
										// return false
									}
									return true
								}
							}]
						},
						code: {
							rules: [{
								required: true,
								errorMessage: '验证码不能为空'
							}]
						},
						agreement: {
							rules: [{
								required: true,
								errorMessage: '请查看协议内容并勾选'
							}]
						},
					}
				}
			},
			onLoad() {

			},
			onReady() {

			},
			onShow() {
				this.pageOnShowSet({
					uniHide: "all"
				})
			},
			methods: {
				forLogin: function(ref) {
					this.$refs[ref].validateField(["phone"]).then((checkRes) => {
						this.isForLogin = true;
						let countdown = 60;
						this.forLoginName = countdown + " s";
						let time = setInterval(() => {
							if (countdown - 1 <= 0) {
								this.isForLogin = false;
								this.forLoginName = "发送验证码";
								clearInterval(time)
							} else {
								countdown = countdown - 1;
								this.forLoginName = countdown + " s";
							}
						}, 1000)
						this.commonRequest({
								url: "/api/sms/forLogin",
								method: "POST",
								data: {
									phone: this.baseFormData.phone
								}
							})
							.then(res => {
								if (res.code == 0) {
									uni.showToast({
										title: res.message || "验证码发送成功!",
										icon: "success",
										duration: 2000
									});
								} else {
									uni.showToast({
										title: res.message || "验证码发送失败!",
										icon: "none"
									});
								}
							}).catch(error => {
								console.error('验证码发送失败:', error)
							})
					}).catch((err) => {
						uni.showToast({
							title: err[0].errorMessage,
							icon: "none"
						});
					})
					return false;
				},
				// 提交数据
				submit(ref) {
					let _this = this;
					this.$refs[ref].validate().then(res => {
						this.commonRequest({
								url: "/api/auth/loginWithPhone",
								method: "POST",
								data: this.baseFormData
							})
							.then(res => {
								if (res.code == 0) {
									uni.showToast({
										title: res.message || "验证码登陆成功!",
										icon: "success",
										duration: 2000,
										success: function() {
											_this.setLogin(res.data)
											setTimeout(() => {
												uni.reLaunch({
													url: "/pages/page/index/index"
												});
											}, 2000)
										}
									});
								} else {
									uni.showToast({
										title: res.message || "验证码登录失败!",
										icon: "none"
									});
								}
								console.error('/api/sms/forLogin：验证码登录成功:', res)
							}).catch(error => {
								console.error('验证码登录失败:', error)
							})
					}).catch(err => {
						// console.log('err', err);
						uni.showToast({
							title: err[0].errorMessage,
							icon: "none"
						});
					})
				},
			}
		}
	</script>


	<style lang="scss" scoped>
		uni-page-body {
			background: url("/static/image/0_login_back.png") no-repeat top / 100%;
		}

		.page-title {
			padding: 3.25rem 2rem 4.375rem 2rem;
			font-size: 1.25rem;
			color: #F5A623;
		}

		.get-verification-code {
			background: transparent !important;
			padding: 0 0.7rem !important;
			position: absolute;
			right: 0;
			bottom: 0;
			border-width: 0;
			color: #7A7A7A;
			line-height: 2.18rem;
			z-index: 2;
			border-bottom: 1px solid #dcdfe6;
			border-radius: 0;
			&::after {
				border-width: 0;
			}
		}

		.change-login {
			color: #393939;
			font-size: 0.75rem;
			float: right;
			margin: 1rem 5%;
			line-height: 2;
		}
	</style>
	<style lang="scss">
		@import "/static/css/standard.scss";

		.uni-forms-item {
			position: relative;
			margin: 0 1rem;


			.uni-forms-item__label {
				display: none !important;
			}

			.uni-easyinput__content {
				border-radius: 0;
				border-width: 0;
				border-bottom: 1px solid #dcdfe6 !important;

				.uni-easyinput__content-input {
					padding-left: 0 !important;
				}
			}
		}

		.phone-input-wrap {
			.uni-easyinput__content {
				width: calc(100% - 5rem)
			}
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

				.link-a {
					span{
						color: #0034FF !important;
						font-size: 0.75rem
					}
					text-decoration: none;
				}
			}
		}
		.uni-link{
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

		.submit-btn {
			width: 90%;
			background-color: $ThemeColor !important;
			font-size: 1rem;
		}
	</style>