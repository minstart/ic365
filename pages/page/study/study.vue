<template>
	<!-- <view class="page-loading" v-if="pageMask"></view> -->
	<view class="page-wrap">
		<view class="banner-wrap">
			<page-head ref="pageHead" :isHide='true' :isBack='false' :isModule="false" :background="'transparent'"></page-head>
			<view class="user-info-wrap">
				<view class="head-pic-wrap">
					<view class="vip-icon" :vipLevel='userInfo.vipLevel'></view>
					<image class="head-pic" :src='userInfo.avatar || defaultHeadPic' @error="defaultHeadPicUrl" alt=""></image>
				</view>
				<view class="user-info">
					<h3 class="name">{{userInfo.nickname}}同学
						<span class="achievement" v-if="userInfo.showAchievementName">{{userInfo.showAchievementName}}</span>
					</h3>
					<ul class="cumulative-list">
						<li class="list">
							<view class="icon" type="star"></view>
							<h4 class="number">{{userInfo.currencies.star||0}}</h4>
						</li>
						<li class="list">
							<view class="icon" type="stone"></view>
							<h4 class="number">{{userInfo.currencies.stone||0}}</h4>
						</li>
						<li class="list">
							<view class="icon" type="dust"></view>
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
					<view class="method-img method_left" @click="jumpPage({url:'/pages/page/study/answerQuestions?pageType=video'})"></view>
				</view>
				<view class="learning-method">
					<view class="method-img method_right" @click="jumpPage({url:'/pages/page/study/answerQuestions?pageType=question'})"></view>
					<view class="method-img method_right" @click="jumpPage({url:'/pages/page/study/answerQuestions?pageType=errorList'})"></view>
				</view>
			</view>
			<view class="item-title-wrap">
				<h3 class="item-title">知识点练习</h3>
			</view>
			<view class="no-list-tip" v-if="knowledgePoints.length==0">暂无数据</view>
			<ul class="plan-list-wrap" v-if="knowledgePoints.length>0">
				<li class="plan-list" v-for="item in knowledgePoints" @click="jumpPage({url:'/pages/page/study/answerQuestions?pageType=question&categoryId=' + item.categoryId})">
					<image class="list-icon" :src='item.coverUrl'></image>
					<h3 class="list-title">{{item.name}}</h3>
					<view class="list-subtitle">{{item.subtitle}}</view>
				</li>
			</ul>
			<view class="item-title-wrap">
				<h3 class="item-title">推荐课堂</h3>
			</view>
			<view class="no-list-tip" v-if="classroom.length==0">暂无数据</view>
			<ul class="plan-recommend-list-wrap">
				<li class="plan-recommend-list" :key="item.videoId" v-for="(item,i) in classroom" @click="jumpPage({url:'/pages/page/study/answerQuestions?pageType=video&categoryId='+item.categoryId+'&videoId='+item.videoId})">
					<view class="is-vip" :vipLevel='item.vipLevel'></view>
					<view class="list-icon"></view>
					<view class="title-wrap">
						<view class="title">{{item.categoryName}}</view>
					</view>
				</li>
			</ul>
		</view>
	</view>
	<uni-popup ref="rewardPopUp" :mask-click="false" type="center">
		<reward-pop-up :close="closeRewardPopUp"></reward-pop-up>
	</uni-popup>
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
				defaultHeadPic: "", //默认头像
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
				// 知识点练习
				knowledgePoints: [],
				classroom: [],
				videosBackArr: [{
						background: "#DFE6FF",
						background2: "#879EF6",
					},
					{
						background: "#E5F9E6",
						background2: "#71D874",
					},
					{
						background: "#F8DE96",
						background2: "#FF9743",
					},
					{
						background: "#FAD8B9",
						background2: "#D8A374",
					},
					{
						background: "#F9EBE5",
						background2: "#FF9696",
					},
					{
						background: "#FFE1FC",
						background2: "#E48BF8",
					},
				],
				randomBack: [], //推荐学习背景色随机数后的数组
			}
		},
		onLoad() {

		},
		onReady() {
			store.state.taskbarHeight = uni.getSystemInfoSync().statusBarHeight * 2 + "rpx";
			this.randomBack = this.videosBackArr.sort(() => Math.random() - 0.5);
		},
		onShow() {
			this.verifLogin().then(data => {
				// 如果已经有登陆信息，那就不重新获取
				if (store.state.userInfo.token && store.state.userInfo.info && store.state.userInfo.info
					.currencies) {
					this.userInfo = store.state.userInfo.info
				} else {
					// 获取用户信息
					this.commonRequest({
						url: "/api/student/info"
					}).then(res => {
						console.log("获取用户信息::", res)
						try {
							store.commit("Update_UserInfo", res.data)
							this.userInfo = res.data;
						} catch (e) {}
					}).catch(error => {
						console.log("获取用户信息报错：：", error)
					})
				}
				
				// 通知消息（成就奖励、任务奖励）
				this.commonRequest({
					url: "/api/notice/getAll"
				}).then(res => {
					console.log("通知消息::", res.data)
					try {
						if (res.data.length > 0) {
							this.$store.state.rewardPopUpList = res.data;
							this.$refs.rewardPopUp.open('center')
						} else {
							this.closeRewardPopUp()
						}
					} catch (e) {}
				}).catch(error => {
					console.log("通知消息失败：：", error)
				})

				// 获取用户周报数据
				this.commonRequest({
					url: "/api/report/weekly"
				}).then(res => {
					console.log("获取用户周报数据::", res)
					try {
						res.data && (this.learningGoal = res.data);
					} catch (e) {}
				}).catch(error => {
					console.log("获取用户周报数据报错：：", error)
				})

				// 知识点练习
				this.commonRequest({
					url: "/api/recommend/categories"
				}).then(res => {
					console.log("知识点练习::", res)
					try {
						res.data && (this.knowledgePoints = res.data);
					} catch (e) {}
				}).catch(error => {
					console.log("知识点练习报错：：", error)
				})

				// 推荐课堂 - 目前使用推荐学习的接口
				this.commonRequest({
					url: "/api/recommend/videos"
				}).then(res => {
					console.log("推荐课堂::", res.data)
					try {
						res.data && (this.classroom = res.data);
					} catch (e) {}
				}).catch(error => {
					console.log("获取推荐课堂失败：：", error)
				})
			}).catch(error => {
				console.log("没有登录：：", error)
			})
			this.pageOnShowSet({
				uniHide: "all"
			}).then(res => {

			})
		},
		onHide() {
			this.closeRewardPopUp()
		},
		created() {

		},
		mounted() {

		},
		methods: {
			// 用户头像默认图标
			defaultHeadPicUrl() {
				this.userInfo.avatar = this.$store.state.$imgSrc + '/image/head_pic.png';
				return this.$store.state.$imgSrc + '/image/head_pic.png';
			},
			//关闭弹窗 
			closeRewardPopUp() {
				this.$refs.rewardPopUp.close()
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import "/static/css/standard.scss";

	.banner-wrap {
		border-radius: 0.6rem;
		padding: 20rpx 24rpx 0 24rpx;

		.user-info-wrap {
			display: flex;
			margin-bottom: 1.6rem;

			.head-pic-wrap {
				.vip-icon {
					right: 12rpx;
				}
			}

			.head-pic {
				width: 96rpx;
				height: 96rpx;
				border-radius: 50%;
				background: #fff;
				overflow: hidden;
				margin-right: 16rpx;
				border-radius: 96rpx;
				border: 4rpx solid #fff;
				position: relative;
			}

			.user-info {
				.name {
					margin: 8rpx 0;
					line-height: 50rpx;
					font-size: 40rpx;

					.achievement {
						margin-left: 8rpx;
						padding: 0 16rpx;
						color: #eb7d1e;
						font-size: 26rpx;
						background: #FFFBDB;
						line-height: 50rpx;
						display: inline-block;
						vertical-align: top;
					}
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

							&[type="star"] {
								background-image: url($imgSrc+"/icons/star.png");
								background-repeat: no-repeat;
								background-position: center;
								background-size: 100% 100%;
							}

							&[type="stone"] {
								background-image: url($imgSrc+"/icons/stone.png");
								background-repeat: no-repeat;
								background-position: center;
								background-size: 100% 100%;
							}

							&[type="dust"] {
								background-image: url($imgSrc+"/icons/dust.png");
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
		background: url($imgSrc+'/image/2_header_banner.png') no-repeat top / 100%;
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
				background: url($imgSrc+"/image/2_method_1.png") no-repeat top / 100% 100%;
			}

			.method_right {
				width: 100%;
				height: 6.375rem;

				&:nth-child(1) {
					margin-bottom: 0.6875rem;
					background: url($imgSrc+"/image/2_method_2.png") no-repeat top / 100% 100%;
				}

				&:nth-child(2) {
					background: url($imgSrc+"/image/2_method_3.png") no-repeat top / 100% 100%;
				}
			}

			&:nth-child(1) {
				margin-right: 0.68rem;
			}
		}
	}

	// 知识点练习
	.plan-list-wrap {
		display: flex;
		height: 9.06rem;

		.plan-list {
			flex: 1;
			max-width: 214rpx;
			height: 100%;
			position: relative;
			text-align: center;

			&:nth-child(1) {
				background: url($imgSrc+"/image/2_knowledge_points1.png") no-repeat center / 100% 100%;
			}

			&:nth-child(2) {
				background: url($imgSrc+"/image/2_knowledge_points2.png") no-repeat center / 100% 100%;
			}

			&:nth-child(3) {
				background: url($imgSrc+"/image/2_knowledge_points3.png") no-repeat center / 100% 100%;
			}

			.list-icon {
				position: absolute;
				width: 92rpx;
				height: 92rpx;
				top: 0;
				left: 0;
				right: 0;
				margin: 0 auto;
				// background: #ccc;
				border-radius: 0.5rem;
			}

			.list-title {
				position: absolute;
				bottom: 60rpx;
				color: #fff;
				width: 100%;
				font-size: 36rpx;
				line-height: 1.2;
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
	.plan-recommend-list-wrap {
		display: flex;

		.plan-recommend-list {
			position: relative;
			flex: 1;
			padding: 20rpx 20rpx 20rpx 20rpx;
			margin-right: 0.68rem;
			min-height: 180rpx;
			border-radius: 40rpx;

			.title-wrap {
				display: flex;
				align-items: center;
				position: relative;
				width: 100%;
				height: 60rpx;
				text-align: center;
				font-size: 26rpx;
				color: #323232;

				.title {
					flex: 1;
				}
			}

			.list-icon {
				width: 132rpx;
				height: 132rpx;
				margin: 0 auto;
				border-radius: 132rpx;
				margin-bottom: 12rpx;
			}

			.is-vip {
				position: absolute;
				right: 2rpx;
				top: 2rpx;
				width: 58rpx;
				height: 50rpx;

				&[vipLevel='0'] {
					background: url($imgSrc+'/icons/recommend_video_novip.png') no-repeat center / 100% 100%;
				}

				&[vipLevel='1'],
				&[vipLevel='2'],
				&[vipLevel='3'] {
					background: url($imgSrc+'/icons/recommend_video_vip.png') no-repeat center / 100% 100%;
				}
			}

			&:nth-child(1) {
				box-shadow: 0 0 12rpx #b2dffd;

				.list-icon {
					background: url($imgSrc+"/icons/recommend_video1.png") no-repeat center / 100% 100%;
				}
			}

			&:nth-child(2) {
				box-shadow: 0 0 12rpx #fdd1a0;

				.list-icon {
					background: url($imgSrc+"/icons/recommend_video2.png") no-repeat center / 100% 100%;
				}
			}

			&:nth-child(3) {
				box-shadow: 0 0 12rpx #fdf391;

				.list-icon {
					background: url($imgSrc+"/icons/recommend_video3.png") no-repeat center / 100% 100%;
				}
			}

			&:last-child {
				margin-right: 0;
			}
		}
	}
</style>