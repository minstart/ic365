<template>
	<!-- <view class="page-loading" v-if="pageMask"></view> -->
	<view class="page-wrap">
		<view class="banner-wrap">
			<page-head :title='pageHeadTitle' :isHide='true' :isBack='false' :isModule="false" :background="'transparent'"></page-head>
			<view class="user-info-wrap">
				<view class="head-pic-wrap">
					<view class="vip-icon" :vipLevel='userInfo.vipLevel'></view>
					<image class="head-pic" :src='userInfo.avatar || defaultHeadPic' @error="defaultHeadPicUrl" alt=""></image>
				</view>
				<view class="user-info">
					<h3 class="name">{{userInfo.nickname}}同学</h3>
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
			<view class="banner-text-wrap">
				<h3 class="banner-text-title">{{pageData.banner.title}}</h3>
				<h4 class="banner-text-content">{{pageData.banner.content}}</h4>
				<h5 class="banner-text-contentFrom">{{pageData.banner.contentFrom}}</h5>
			</view>
			<view class="activity-wrap">
				<image class="activity" @click="jumpPage({url:'/pages/page/study/calendar'})" src='/static/image/1_challenge.png'></image>
				<image class="activity" @click="jumpPage({url:'/pages/page/team/team',type:'reLaunch'})" src='/static/image/1_study.png'></image>
			</view>
		</view>
		<view class="plan-wrap uni-padding-wrap">
			<view class="item-title-wrap">
				<h3 class="item-title">今日学习目标</h3>
				<view class="item-subtitle">AI智能推荐</view>
				<view class="item-more" style="color: #999999;">{{plan.finished}}/{{plan.total}} 完成</view>
			</view>
			<!-- 暂无数据 -->
			<view class="no-list-tip" v-if="plan.list && plan.list.length==0">暂无数据</view>
			<ul class="plan-list-wrap">
				<li class="plan-list" v-for="(item,i) in plan.list" :key="item.missionId" :type="item.missionTypeId" :colorScheme="item.colorScheme" @click="jumpPage({url:''})">
					<!-- <image class="plan-background" :src="planBackground(item.missionTypeId)"></image> -->
					<view class="plan-background"></view>
					<view class="plan-list-type-back">
						{{item.typeName}}
					</view>
					<image class="plan-list-icon" :src="item.cover"></image>
					<view class="plan-list-img"></view>
					<view class="plan-list-name-wrap">
						<view class="plan-list-name">{{item.name}}</view>
						<view class="plan-reward" v-if="item.rewardName">
							<image class="plan-reward-icon" :src="rewardIcon(item.currencyTypeId)"></image>
							<span>{{item.rewardName}}</span>
						</view>
					</view>
					<!-- 任务要求 -->
					<view class="plan-list-require">{{item.subTitle}}</view>
					<!-- 进度条 -->
					<view class="progress-wrap" v-if="item.startTime==0">
						<progress :percent="item.processTotal" activeColor="#77D182" backgroundColor="#ffffff" stroke-width="8" />
					</view>
					<view class="time-limited-wrap" v-else="calculateDaysUntilDeadline(changeTime(item.endTime))>0">
						<view class="time-limited">
							限时活动 剩余{{calculateDaysUntilDeadline(changeTime(item.endTime))}}天
						</view>
					</view>
				</li>
			</ul>
		</view>
		<view class="plan-recommend-wrap uni-padding-wrap">
			<view class="item-title-wrap">
				<h3 class="item-title">推荐学习</h3>
			</view>
			<view class="no-list-tip" v-if="videos.length==0">暂无数据</view>
			<ul class="plan-recommend-list-wrap">
				<li class="plan-recommend-list" :key="item.videoId" v-for="item in videos" @click="jumpPage({url:'/pages/page/study/answerQuestions?pageType=video&keyword='+item.categoryName})">
					<image class="list-icon" :src="item.coverUrl"></image>
				</li>
			</ul>
		</view>
		<view class="plan-recommend-wrap uni-padding-wrap">
			<view class="item-title-wrap">
				<h3 class="item-title">最新成就</h3>
				<view class="item-more">
					<view class="text icon-more" @click="jumpPage({url:'/pages/page/user/achievementDetails'})">查看全部</view>
				</view>
			</view>
			<view class="achievement-wrap">
				<image class="achievement-back" src="/static/image/1_achievement_back.png"></image>
				<view class="achievement-statistics">
					{{achievement.obtained}}
					/
					{{achievement.total}}
				</view>
				<view class="recently-achievement">
					<view class="recently-achievement-list" v-if="achievement&&achievement.list&&achievement.list.length>0" v-for="(item,i) in newAchievement" :key="item.achievementId">
						<image class="achievement-head-pic" :src="item.imgPath || defaultAchievementIcon" @error="defaultAchievementIconUrl(i)"></image>
						<view class="achievement-info">
							<view class="achievement-name">{{item.name}}</view>
							<view class="achievement-from">{{item.subtitle}}</view>
							<view class="achievement-time">
								<view v-if="item.rare!=0" class="achievement-rare">
									<image class="achievement-rare-icon" src="/static/icons/achievement.png"></image>
									稀有成就
								</view>
								{{changeDate(item.obtainTimeUnix*1000).fullDate}}
							</view>
						</view>
					</view>
				</view>
				<ul class="more-achievement">
					<li class="achievement-list" v-if="achievement&&achievement.list&&achievement.list.length>0" v-for="(item,i) in otherAchievement" :key="item.achievementId">
						<div class="achievement-list-pic-wrap flex-center">
							<image class="achievement-list-pic" :src="item.imgPath || defaultAchievementIcon" @error="defaultAchievementMoreIconUrl(i)"></image>
						</div>
						<view class="achievement-list-back"></view>
						<view class="achievement-list-name">{{item.name}}</view>
						<view class="achievement-list-time">{{changeDate(item.obtainTimeUnix*1000).fullDate}}</view>
					</li>
				</ul>
			</view>
		</view>
	</view>
	<uni-popup ref="rewardPopUp" :mask-click="false" type="center">
		<reward-pop-up></reward-pop-up>
	</uni-popup>
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
		computed: {
			newAchievement() {
				this.achievement.list.map(img => img.imgPath || this.defaultAchievementIcon);
				return this.achievement.list.slice(0, 1)
			},
			otherAchievement() {
				this.achievement.list.map(img => img.imgPath || this.defaultAchievementIcon);
				return this.achievement.list.slice(1, 3)
			},
		},
		data() {
			return {
				pageHeadTitle: "",
				cumulative: [],
				defaultHeadPic: store.state.defaultHeadPic, //默认头像
				defaultAchievementIcon: "/static/image/head_pic.png", // 默认成就图标
				// 活动列表
				activityList: [],
				// activityList: [{
				// 		activityBack: "/static/shuijiao.jpg",
				// 		title: "每日挑战",
				// 		tip: "完成挑战赢取奖励"
				// 	},
				// 	{
				// 		activityBack: "/static/shuijiao.jpg",
				// 		title: "组队学习",
				// 		tip: "与好友一起进步"
				// 	}
				// ],
				// 推荐学习
				videos: [],
				// videos: [{
				// 	"videoId": 37815146,
				// 	"coverUrl": "https://ic365.ajulye.com/media/xue_ke_cover/video_47474516.jpg",
				// 	"categoryName": "找规律"
				// }, {
				// 	"videoId": 37815106,
				// 	"coverUrl": "https://ic365.ajulye.com/media/xue_ke_cover/video_47474515.jpg",
				// 	"categoryName": "两位数减一位数"
				// }, {
				// 	"videoId": 37815017,
				// 	"coverUrl": "https://ic365.ajulye.com/media/xue_ke_cover/video_47474514.jpg",
				// 	"categoryName": "两位数加一位数"
				// }],
				// 学习模块
				plan: {
					list: []
				},
				// 最新成就
				achievement: {},
				// achievement: {
				// 	"total": 12,
				// 	"obtained": 3,
				// 	"list": [{
				// 			"achievementId": 1,
				// 			"name": "持之以恒",
				// 			"subtitle": "连续登录7天",
				// 			"imgPath": "achievement_1.png",
				// 			"rare": 1,
				// 			"obtainTime": "2025-07-20T21:58:49",
				// 			"obtainTimeUnix": 1753019929
				// 		},
				// 		{
				// 			"achievementId": 4,
				// 			"name": "错题终结者",
				// 			"subtitle": "订正100道错题",
				// 			"imgPath": "achievement_4.png",
				// 			"rare": 0,
				// 			"obtainTime": "2025-07-20T21:58:49",
				// 			"obtainTimeUnix": 1753019929
				// 		},
				// 		{
				// 			"achievementId": 12,
				// 			"name": "数字小精灵",
				// 			"subtitle": "完成100道10以内加减法",
				// 			"imgPath": "achievement_12.png",
				// 			"rare": 0,
				// 			"obtainTime": "2025-07-20T21:58:49",
				// 			"obtainTimeUnix": 1753019929
				// 		}
				// 	]
				// },
				// userInfo: {
				// 	nickname: "",
				// 	currencies: {

				// 	}
				// },
				pageData: {
					banner: {
						bannerBack: "#3c25b9",
						title: "下午好，小明，数学小超人！",
						content: "数学是真理的永恒表现形式",
						contentFrom: "- 卡尔·弗里德里希·高斯"
					}
				}
			};
		},
		onLoad() {

		},

		onReady() {
			this.verifLogin().then(data => {
				store.state.taskbarHeight = uni.getSystemInfoSync().statusBarHeight * 2 + "rpx"
				const deviceInfo = uni.getDeviceInfo()
				const appInfo = uni.getSystemInfoSync()
				// console.log("设备信息：：：",deviceInfo)
				// console.log("安装包版本：：：",appInfo)
				let recordActivity = {
					deviceModel: deviceInfo.deviceBrand + deviceInfo.deviceModel,
					osVersion: deviceInfo.system,
					appVersion: appInfo.appVersion,
					uniqueId: deviceInfo.deviceId
				}
				// 记录用户设备信息
				this.commonRequest({
					url: "/api/student/recordActivity",
					notLoading: true,
					data: recordActivity
				}).then(res => {
					// this.consoleLog("加载app时传输用户设备信息：",res)

				}).catch(error => {
					// this.consoleLog("记录用户设备信息报错：：", error)
				})

				// 获取用户信息
				this.commonRequest({
					url: "/api/student/info"
				}).then(res => {
					// this.consoleLog("获取用户信息::", JSON.stringify(res))
					if (res.code == 0) {
						try {
							store.commit("Update_UserInfo", res.data)
							this.userInfo = res.data;
						} catch (e) {}
						// 全新用户，需要选年级

						if (res.data.grade == 0) {
							uni.redirectTo({
								url: '/pages/page/index/supplement_info?pageFrom=' +
									data.pathUrl
							});
						}
					} else {
						uni.showToast({
							title: res.message || "获取用户信息失败!",
							icon: "none"
						});
					}
				}).catch(error => {
					this.consoleLog("获取用户信息报错：：", error)
				})

				// 获取任务列表
				this.commonRequest({
					url: "/api/mission/getAll"
				}).then(res => {
					this.consoleLog("首页任务列表::", JSON.stringify(res))
					if (res.code == 0) {
						try {
							this.plan = res.data;
						} catch (e) {}
					} else {
						uni.showToast({
							title: res.message || "首页任务列表失败!",
							icon: "none"
						});
					}
				}).catch(error => {
					this.consoleLog("获取任务列表报错：：", error)
				})

				// 获取我的成就
				this.commonRequest({
					url: "/api/achievement/mine"
				}).then(res => {
					console.log("最新成就::", res)
					try {
						this.achievement = res.data;
					} catch (e) {}

				}).catch(error => {
					console.log("获取最新成就失败：：", error)
				})

				// 获取推荐学习
				this.commonRequest({
					url: "/api/recommend/videos"
				}).then(res => {
					console.log("推荐学习::", res.data)
					if (res.code == 0) {
						try {
							this.videos = res.data;
						} catch (e) {}
					} else {
						uni.showToast({
							title: res.message || "获取推荐学习失败!",
							icon: "none"
						});
					}
				}).catch(error => {
					console.log("获取推荐学习失败：：", error)
				})
			}).catch(error => {
				this.consoleLog("没有登录：：", error)
			})
		},
		onShow() {
			this.pageOnShowSet({
				uniHide: "all"
			}).then(res => {
				this.$refs.rewardPopUp.open('center')
			})
		},
		onHide() {

		},
		watch: {

		},
		methods: {
			// 用户头像默认图标
			defaultHeadPicUrl() {
				this.userInfo.avatar = '/static/image/head_pic.png';
				return '/static/image/head_pic.png';
			},
			// 成就默认图标
			defaultAchievementIconUrl(i) {
				this.achievement.list[i].imgPath = this.defaultAchievementIcon;
			},
			defaultAchievementMoreIconUrl(i) {
				this.achievement.list[i + 1].imgPath = this.defaultAchievementIcon;
			},
			// 设置任务列表背景图
			planBackground(id) {
				switch (id) {
					case 1:
						// 每日口算
						return "/static/image/1_task_arithmetic.png";
						break;
					case 2:
						break;
					case 3:
						break;
					case 4:
						break;
					case 5:
						// 圣诞欢乐颂
						return "/static/image/1_task_christmas.png";
						break;
					case 6:
						break;
					case 7:
						// 分数认识
						return "/static/image/1_task_fraction.png";
						break;
					case 8:
						// 图形拼图
						return "/static/image/1_task_jigsaw.png";
						break;
				}
			},

		}
	};
</script>

<style>
	@import '../../../common/uni-nvue.css';
</style>

<style lang="less" scoped>
	.banner-wrap {
		padding: 20rpx 24rpx 0 24rpx;
		// display: flex;
		min-height: 760rpx;
		background: url("/static/image/1_header_banner.png") no-repeat top / 100%;
		position: relative;

		.user-info-wrap {
			display: flex;
			// position: absolute;
			// bottom: 560rpx;

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
								background-image: url("/static/icons/star.png");
								background-repeat: no-repeat;
								background-position: center;
								background-size: 100% 100%;
							}

							&[type="stone"] {
								background-image: url("/static/icons/stone.png");
								background-repeat: no-repeat;
								background-position: center;
								background-size: 100% 100%;
							}

							&[type="dust"] {
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

		.banner-text-wrap {
			color: #00362B;
			margin-left: 1rem;
			font-size: 1.1rem;
			position: absolute;
			bottom: 300rpx;

			* {
				text-shadow: 0px 2px 3px #fff;
			}

			.banner-text-title {
				margin-bottom: 0.6rem;
				font-size: 1.06rem;
			}

			.banner-text-content {
				margin-bottom: 0.2rem;
				font-size: 0.93rem;
				display: block;
			}

			.banner-text-contentFrom {
				font-size: 0.8rem;
			}
		}

		.activity-wrap {
			margin-top: 126rpx;
			display: flex;
			position: absolute;
			bottom: 0;
			width: calc(100% - 48rpx);

			.activity {
				flex: 1;
				overflow: hidden;
				position: relative;
				overflow: hidden;
				border-radius: 0.6rem;
				height: 7.375rem;
			}
		}

	}

	.plan-wrap {
		margin-bottom: 1rem;

		// 学习目标 - 列表---------Start
		.no-plan-list {
			padding: 1rem;
			font-size: 1rem;
			text-align: center;
		}

		.plan-list-wrap {
			.plan-list {
				margin: 0.75rem 0;
				position: relative;

				// display: flex;
				.plan-background {
					width: 100%;
					height: 6.5rem;
				}

				.plan-list-type-back {
					width: 1.9rem;
					height: 1.7rem;
					line-height: 1.5rem;
					font-size: 0.75rem;
					color: #fff;
					padding-left: 0.3rem;
					position: absolute;
					left: -0.2rem;
					top: 1rem;
					z-index: 2;
				}

				.plan-list-icon {
					width: 142rpx;
					height: 142rpx;
					position: absolute;
					top: 1rem;
					left: 50rpx;
				}

				// 列表标题名称 + 奖励
				.plan-list-name-wrap {
					position: absolute;
					top: 1rem;
					right: 0.75rem;
					width: 13.375rem;

					.plan-list-name {
						display: inline-block;
						font-size: 1.125rem;
						font-weight: 700;
					}

					.plan-reward {
						display: inline-block;
						padding: 0.375rem 0.5rem;
						background-color: #fff;
						font-size: 0.75rem;
						line-height: 1;
						font-weight: 500;
						margin-left: 0.4rem;

						.plan-reward-icon {
							width: 0.75rem;
							height: 0.75rem;
							display: inline-block;
							margin-right: 0.2rem;
						}

						span {
							display: inline-block;
							vertical-align: top;
							line-height: 0.75rem;
						}

					}

				}

				.plan-list-require {
					position: absolute;
					top: 2.8rem;
					right: 0.75rem;
					width: 13.375rem;
					font-size: 0.75rem;
				}

				.progress-wrap {
					position: absolute;
					bottom: 1.4rem;
					right: 0.75rem;
					width: 13.375rem;
					overflow: hidden;
					border-radius: 0.5rem;
				}

				//进度条 
				.time-limited-wrap {
					position: absolute;
					bottom: 1.1rem;
					right: 0.75rem;
					width: 13.375rem;
					overflow: hidden;

					// 活动倒计时
					.time-limited {
						padding: 0 0.3rem 0 1rem;
						font-weight: 700;
						font-size: 0.75rem;
						color: #fff;
						line-height: 1.3rem;
						display: inline-block;
						background: url("/static/image/1_time_limited.png") no-repeat left / 100% 100%;
					}
				}

				&[colorscheme="1"] {
					background: #FFF2EA;

					.plan-list-type-back {
						background: url("/static/image/1_plan_label1.png") no-repeat center / 100% 100%;
					}

					.plan-list-name-wrap {
						.plan-list-name {
							color: #712A02;
						}

						.plan-reward {
							span {
								color: #CA8417;
							}
						}
					}

					.plan-list-require {
						color: #CA590B;
					}
				}

				&[colorscheme="2"] {
					background: #FFEFF3;

					.plan-list-type-back {
						background: url("/static/image/1_plan_label2.png") no-repeat center / 100% 100%;
					}

					.plan-list-name-wrap {
						.plan-list-name {
							color: #FC4148;
						}

						.plan-reward {
							span {
								color: #FE6268;
							}
						}
					}

					.plan-list-require {
						color: #E95C61;
					}
				}

				&[colorscheme="3"] {
					background: #EBFDEA;

					.plan-list-type-back {
						background: url("/static/image/1_plan_label3.png") no-repeat center / 100% 100%;
					}

					.plan-list-name-wrap {
						.plan-list-name {
							color: #004264;
						}

						.plan-reward {
							span {
								color: #00A8DC;
							}
						}
					}

					.plan-list-require {
						color: #008BD0;
					}
				}

				&[colorscheme="4"] {
					background: #EBFDEA;

					.plan-list-type-back {
						background: url("/static/image/1_plan_label4.png") no-repeat center / 100% 100%;
					}

					.plan-list-name-wrap {
						.plan-list-name {
							color: #51750E;
						}

						.plan-reward {
							span {
								color: #0A9E19;
							}
						}
					}

					.plan-list-require {
						color: #0A9E19;
					}
				}
			}
		}
	}

	// 学习目标 - 列表---------End
	.plan-recommend-list-wrap {
		display: flex;

		.plan-recommend-list {
			flex: 1;
			margin-right: 0.68rem;

			.list-icon {
				width: 100%;
				height: 7.5rem;
			}

			&:last-child {
				margin-right: 0;
			}
		}
	}

	// 最新成就  -------------Start
	.achievement-wrap {
		position: relative;

		.achievement-back {
			width: 100%;
			height: 23.625rem;
		}

		// 成就统计
		.achievement-statistics {
			font-size: 1rem;
			color: #FFFFFF;
			position: absolute;
			top: 0.4rem;
			left: 81%;
			font-weight: 500;
		}

		// 最新成就
		.recently-achievement {
			position: absolute;
			top: 40rpx;
			width: 90%;
			left: 0;
			right: 0;
			margin: 0 auto;

			.achievement-head-pic {
				width: 164rpx;
				height: 164rpx;
				display: inline-block;
				margin-right: 1rem;
				border-radius: 100%;
				border: 4rpx solid #7FD488;
				overflow: hidden;
			}

			.achievement-info {
				display: inline-block;
				vertical-align: top;
				max-width: 13rem;

				.achievement-name {
					font-size: 1.25rem;
					color: #0E562F;
					font-weight: 700;
				}

				.achievement-from {
					font-size: 0.9rem;
					color: #09916A;
					margin: 0.2rem 0 0.5rem 0;
				}

				.achievement-time {
					color: #065E4F;
					font-size: 0.81rem;

					.achievement-rare {
						color: #EB7D1E;
						background: #FFFBDB;
						display: inline-block;
						padding: 0.25rem 0.5rem;
						margin-right: 0.2rem;

						.achievement-rare-icon {
							width: 0.75rem;
							height: 0.75rem;
							padding-right: 0.1rem;
						}
					}
				}
			}
		}

		// 最近成就
		.more-achievement {
			width: 100%;
			position: absolute;
			top: 13rem;
			display: flex;

			.achievement-list {
				text-align: center;
				flex: 1;

				.achievement-list-pic-wrap {
					width: 180rpx;
					height: 180rpx;
					margin: 0 auto;
				}

				.achievement-list-pic {
					width: 136rpx;
					height: 136rpx;
					clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
					overflow: hidden;
					/* 隐藏超出部分 */
				}

				&:nth-child(1) {
					.achievement-list-pic-wrap {
						background: url("/static/image/1_achievement_back1.png") no-repeat center / 100% 100%;
					}
				}

				&:nth-child(2) {
					.achievement-list-pic-wrap {
						background: url("/static/image/1_achievement_back2.png") no-repeat center / 100% 100%;
					}
				}

				&:nth-child(3) {
					.achievement-list-pic-wrap {
						background: url("/static/image/1_achievement_back3.png") no-repeat center / 100% 100%;
					}
				}

				.achievement-list-back {
					width: 3.56rem;
					height: 0.5rem;
					border-radius: 50%;
					background-color: #79D183;
					opacity: 0.45;
					margin: 0.2rem auto;
				}

				.achievement-list-name {
					color: #0E562F;
					font-size: 1.06rem;
					font-weight: 500;
					line-height: 1.5rem;
				}

				.achievement-list-time {
					color: #09916A;
					font-size: 0.75rem;
					line-height: 1.25rem;
				}
			}
		}
	}

	// 最新成就  -------------End
</style>