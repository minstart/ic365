<template>
	<view class="page-wrap">
		<view class="banner-wrap">
			<page-head :title='pageHeadTitle' :isHide='true' :isBack='false' :isModule="false" :background="'transparent'"></page-head>
			<view class="user-info-wrap">
				<image class="head-pic" :src='userInfo.avatar || defaultHeadPic' @error="defaultHeadPicUrl" alt=""></image>
				<view class="user-info">
					<h3 class="name">{{userInfo.nickname}}同学</h3>
					<ul class="cumulative-list">
						<li class="list">
							<view class="icon" iconType="star"></view>
							<h4 class="number">{{userInfo.currencies.star||0}}</h4>
						</li>
						<li class="list">
							<view class="icon" iconType="stone"></view>
							<h4 class="number">{{userInfo.currencies.stone||0}}</h4>
						</li>
						<li class="list">
							<view class="icon" iconType="dust"></view>
							<h4 class="number">{{userInfo.currencies.dust||0}}</h4>
						</li>
					</ul>
				</view>
			</view>
		</view>
		<view class="uni-padding-wrap">
			<view class="learning-goal-wrap">
				<h3 class="learning-goal-title">本周学习目标</h3>
				<ul class="learning-goal-list-wrap">
					<!-- v-for="item in learningGoal" -->
					<li class="learning-goal-list">
						<h3 class="list-content">
							<span class="list-num">{{learningGoal.loginDays}}</span>
							<span class="list-unit">天</span>
						</h3>
						<view class="list-title">本周学习</view>
					</li>
					<li class="learning-goal-list">
						<h3 class="list-content">
							<span class="list-num">{{learningGoal.questionCount}}</span>
							<span class="list-unit">题</span>
						</h3>
						<view class="list-title">完成练习</view>
					</li>
					<li class="learning-goal-list">
						<h3 class="list-content">
							<span class="list-num">{{learningGoal.accuracy}}</span>
							<span class="list-unit">%</span>
						</h3>
						<view class="list-title">正确率</view>
					</li>
				</ul>
			</view>
			<view class="learning-method-wrap">
				<view class="learning-method">
					<view class="method-img method_left" @click="jumpPage({url:''})"></view>
				</view>
				<view class="learning-method">
					<view class="method-img method_right" @click="jumpPage({url:''})"></view>
					<view class="method-img method_right" @click="jumpPage({url:'/pages/page/study/wrong_question'})"></view>
				</view>
			</view>
			<view class="item-title-wrap">
				<h3 class="item-title">知识点学习</h3>
			</view>
			<view class="no-list-tip" v-if="knowledgePoints.length==0">暂无数据</view>
			<ul class="plan-list-wrap">
				<li class="plan-list" v-for="item in knowledgePoints" @click="jumpPage({url:''})">
					<image class="list-back" :src='item.coverUrl'></image>
					<h3 class="list-title">{{item.name}}</h3>
					<view class="list-subtitle">{{item.subtitle}}</view>
				</li>
			</ul>
			<view class="item-title-wrap">
				<h3 class="item-title">推荐课堂</h3>
			</view>
			<view class="no-list-tip" v-if="classroom.length==0">暂无数据</view>
			<ul class="classroom-list-wrap">
				<li class="classroom-list" :colorTheme="item.colorScheme" @click="jumpPage({url:''})" v-for="item in classroom">
					<image class="list-back" :src='item.coverUrl'></image>
					<h3 class="list-title">{{item.name}}</h3>
				</li>
			</ul>
		</view>
	</view>
</template>

<script>
	import store from '/store/index.js';
	import commonJs from '/common/js/common.js';

	export default {
		mixins: [commonJs],
		props: {

		},
		components: {},
		data() {
			return {
				pageHeadTitle: "",
				defaultHeadPic: store.state.defaultHeadPic, //默认头像
				userInfo: {
					nickname: "",
					currencies: {

					}
				},
				// 本周学习目标
				learningGoal: {
					loginDays: "",
					questionCount: "",
					accuracy: ""
				},
				// 知识点学习
				knowledgePoints: [],
				classroom: [],
			}
		},
		onLoad() {

		},
		onReady() {
			const route = getCurrentPages(); //获取当前页面地址
			const pathUrl = route[route.length - 1].route;
			this.getLogin().then(data => {
				// this.consoleLog(store.state.userInfo.token)
				this.consoleLog(store.state.userInfo)
				// 已经登陆了
				this.consoleLog("已经登陆了")

				// 如果已经有登陆信息，那就不重新获取
				if (store.state.userInfo.token && store.state.userInfo.info && store.state.userInfo.info
					.currencies) {
					this.userInfo = store.state.userInfo.info
				} else {
					// 获取用户信息
					this.commonRequest({
						url: "/api/student/info"
					}).then(res => {
						this.consoleLog("获取用户信息::", JSON.stringify(res))
						if (res.code == 0) {
							try {
								store.commit("Update_UserInfo", res.data)
								this.userInfo = res.data;
							} catch (e) {}
						} else {
							uni.showToast({
								title: res.message || "获取用户信息失败!",
								icon: "none"
							});
						}
					}).catch(error => {
						this.consoleLog("获取用户信息报错：：", error)
					})
				}

				// 获取用户周报数据
				this.commonRequest({
					url: "/api/report/weekly",
					method: "get"
				}).then(res => {
					this.consoleLog("获取用户周报数据::", JSON.stringify(res))
					if (res.code == 0) {
						res.data && (this.learningGoal = res.data);
					} else {
						uni.showToast({
							title: res.message || "获取用户周报数据失败!",
							icon: "none"
						});
					}
				}).catch(error => {
					this.consoleLog("获取用户周报数据报错：：", error)
				})

				// 知识点学习
				this.commonRequest({
					url: "/api/recommend/categories",
					method: "get"
				}).then(res => {
					this.consoleLog("知识点学习::", JSON.stringify(res))
					if (res.code == 0) {
						res.data && (this.knowledgePoints = res.data);
						res.data && (this.classroom = res.data);
					} else {
						uni.showToast({
							title: res.message || "知识点学习失败!",
							icon: "none"
						});
					}
				}).catch(error => {
					this.consoleLog("知识点学习报错：：", error)
				})



			}).catch(err => {
				// 没有登陆
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

		},
		onShow() {
			this.pageOnShowSet({
				uniHide:"all"
			})
		},
		onHide() {

		},
		created() {

		},
		mounted() {

		},
		methods: {
			// 用户头像默认图标
			defaultHeadPicUrl() {
				this.userInfo.avatar = '/static/image/head_pic.png';
				return '/static/image/head_pic.png';
			},
		}
	}
</script>

<style lang="scss" scoped>
	.banner-wrap {
		border-radius: 0.6rem;
		padding: 1.25rem 0.75rem 0 0.75rem;
		padding-top: 1.5rem;

		.user-info-wrap {
			display: flex;
			margin-bottom: 1.6rem;

			.head-pic {
				width: 3rem;
				height: 3rem;
				border-radius: 50%;
				background: #fff;
				overflow: hidden;
				margin-right: 0.5rem;
			}

			.user-info {
				.name {
					margin: 0.2rem 0;
				}

				.cumulative-list {
					overflow: hidden;

					.list {
						float: left;
						margin-right: 0.8rem;

						.icon {
							width: 0.75rem;
							height: 0.75rem;
							display: inline-block;
							margin-right: 0.56rem;

							&[iconType="star"] {
								background-image: url("/static/icons/star.png");
								background-repeat: no-repeat;
								background-position: center;
								background-size: 100% 100%;
							}

							&[iconType="stone"] {
								background-image: url("/static/icons/stone.png");
								background-repeat: no-repeat;
								background-position: center;
								background-size: 100% 100%;
							}

							&[iconType="dust"] {
								background-image: url("/static/icons/dust.png");
								background-repeat: no-repeat;
								background-position: center;
								background-size: 100% 100%;
							}

						}

						.number {
							display: inline-block;
							font-size: 0.875rem;
							color: #EB7D1E;
						}
					}
				}
			}
		}
	}

	// 学习目标
	.learning-goal-wrap {
		min-height: 14.18rem;
		background: url('/static/image/2_header_banner.png') no-repeat top / 100%;
		position: relative;
		margin-bottom: 1.2rem;

		.learning-goal-title {
			font-size: 1.25rem;
			color: #fff;
			padding: 1.65rem 0.875rem;
		}

		.learning-goal-list-wrap {
			display: flex;
			position: absolute;
			bottom: 1.6rem;
			width: 100%;

			.learning-goal-list {
				flex: 1;
				text-align: center;

				.list-content {
					.list-num {
						font-size: 1.5rem;
						margin-right: 0.2rem;
					}

					.list-unit {
						font-size: 1.125rem;
					}
				}

				.list-title {
					color: #999999;
					font-size: 0.875rem;
					line-height: 1.25rem;
				}
			}
		}
	}

	// 学习方法导航
	.learning-method-wrap {
		display: flex;

		.learning-method {
			flex: 1;
			height: 13.4rem;

			.method_left {
				width: 100%;
			}

			.method_left {
				height: 100%;
				background: url("/static/image/2_method_1.png") no-repeat top / 100% 100%;
			}

			.method_right {
				width: 100%;
				height: 6.375rem;

				&:nth-child(1) {
					margin-bottom: 0.6875rem;
					background: url("/static/image/2_method_2.png") no-repeat top / 100% 100%;
				}

				&:nth-child(2) {
					background: url("/static/image/2_method_3.png") no-repeat top / 100% 100%;
				}
			}

			&:nth-child(1) {
				margin-right: 0.68rem;
			}
		}
	}

	// 知识点学习
	.plan-list-wrap {
		display: flex;
		height: 9.06rem;

		.plan-list {
			flex: 1;
			height: 100%;
			position: relative;
			text-align: center;

			.list-back {
				position: absolute;
				width: 100%;
				height: 9.06rem;
				z-index: 0;
				top: 0;
				left: 0;
				background: #ccc;
				border-radius: 0.5rem;
			}

			.list-title {
				position: absolute;
				top: 3.85rem;
				color: #fff;
				width: 100%;
				font-size: 1.25rem;
			}

			.list-subtitle {
				position: absolute;
				width: 100%;
				top: 5.6rem;
				color: #fff;
				font-size: 0.75rem;
			}

			&:nth-child(1),
			&:nth-child(2) {
				margin-right: 0.6875rem;
			}
		}
	}

	// 推荐课堂
	.classroom-list-wrap {
		overflow: hidden;
		display: flex;
		flex-wrap: wrap;

		.classroom-list {
			width: calc(50% - 0.6875rem / 2);
			height: 10.375rem;
			margin: 0 0.6875rem 0.6875rem 0;
			background: #ccc;
			border-radius: 1rem;
			position: relative;

			&:nth-child(2n) {
				margin-right: 0;
			}

			.list-back {
				position: absolute;
				width: 100%;
				height: 100%;
				z-index: 0;
				top: 0;
				left: 0;
			}

			.list-title {
				position: absolute;
				left: 1rem;
				right: 1rem;
				top: 64%;
				margin: auto;
				text-align: center;
				font-size: 1.125rem;
			}
		
			&[colorTheme="1"]{
				background: #EBFDEA;
				.list-title{
					color:#51750E;
				}
			}
			&[colorTheme="2"]{
				background: #FFEFF3;
				.list-title{
					color:#F9626D;
				}
			}
			&[colorTheme="3"]{
				background:#FFF2EA;
				.list-title{
					color:#EF761F;
				}
			}
			&[colorTheme="4"]{
				background: #E8F9FF;
				.list-title{
					color:#0588AE;
				}
			}
		}
	}
</style>