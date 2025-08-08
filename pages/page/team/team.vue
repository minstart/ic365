<template>
	<view class="page-wrap">
		<page-head :title='pageHeadTitle' :isHide='true' :isBack='false' :isModule="false" :background="'transparent'"></page-head>
		<view class="uni-padding-wrap">
			<view class="user-info-wrap">
				<!-- <view class="head-pic"></view> -->
				<image class="head-pic" :src='userInfo.avatar || defaultHeadPic' @error="defaultHeadPicUrl" alt=""></image>
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
				<view class="btn-setUp" @click="jumpPage({url:''})"></view>
			</view>
			<!-- 当前挑战 -->
			<view class="challenge-wrap">
				<h3 class="progress">团队进度： {{currentMission.processTotal}}</h3>
				<view class="progress-info">
					<image class="info-icon" :src="currentMission.coverImage"></image>
					<view class="info-wrap">
						<h3 class="info-title">{{currentMission.name}}</h3>
						<view class="info-describe">{{currentMission.subtitle}}</view>
					</view>
				</view>
				<view class="progress-reward-wrap flex-center">
					<h2 class="progress-time">{{currentMission.remainingTime}}</h2>
					<h2 class="progress-reward">{{currentMission.rewardNames}}</h2>
				</view>
			</view>
			<view class="team-task-wrap">
				<view class="item-title-wrap">
					<h3 class="item-title">组队任务</h3>
				</view>
				<view class="no-list-tip" v-if="teamTask.length==0">暂无数据</view>
				<ul class="team-task-list-wrap">
					<li class="team-task-list" v-for="item in teamTask" :colorScheme="item.colorScheme">
						<div class="flex-center">
							<view class="list-info">
								<h3 class="info-title">{{item.name}}</h3>
								<view class="info-describe">{{item.subtitle}}</view>
								<view class="info-reward-wrap">
									<view class="reward" v-for="item2 in item.rewards">
										<image class="reward-icon" :src="rewardIcon(item2.currencyTypeId)"></image>
										<span>{{item2.name}}</span>
									</view>
								</view>
							</view>
						</div>
						<image class="list-icon" :src="item.coverImage" mode=""></image>
					</li>
				</ul>
			</view>
			<view class="team-situation-wrap">
				<view class="item-title-wrap">
					<h3 class="item-title">组队情况</h3>
				</view>
				<view class="team-situation-info-wrap">
					<view class="team-situation-info">
						<h3 class="info-num">{{stats.completedCount}}</h3>
						<view class="info-title">组队完成次数</view>
					</view>
					<view class="team-situation-info">
						<h3 class="info-num">{{stats.completionRate}}%</h3>
						<view class="info-title">任务完成率</view>
					</view>
				</view>
			</view>
			<view class="my-team-wrap">
				<view class="item-title-wrap">
					<h3 class="item-title my-team-title">我的队伍</h3>
					<view class="item-more" style="color: #79D183;">{{members.length || 0}}名成员</view>
				</view>
				<ul class="team-list-wrap">
					<li class="team-list" v-for="item in members">
						<image class="list-avatar" :src="item.avatar"></image>
						<h3 class="list-nickname">{{item.nickname}}同学</h3>
						<view class="list-time green">{{item.lastActive}}</view>
					</li>
					<li class="team-list invite"  @click="jumpPage({url:'/pages/page/team/invite_team'})">
						<view class="list-avatar"></view>
						<h3 class="list-nickname">邀请好友</h3>
						<view class="list-time"></view>
					</li>
				</ul>
			</view>
			<view class="team-dynamics-wrap">
				<view class="item-title-wrap">
					<h3 class="item-title">队伍动态</h3>
				</view>
				<view class="no-list-tip" v-if="activities.length==0">暂无数据</view>
				<ul class="dynamics-list-wrap">
					<li class="dynamics-list" v-for="item in activities">
						<image class="list-avatar" :src="item.avatar"></image>
						<view class="list-info-wrap">
							<view class="list-info">
								<h3 class="list-info-name" v-if="item.nickname">{{item.nickname}}</h3>
								<span class="list-info-action">{{item.action}}</span>
								<h3 class="task-name">{{item.eventName}}</h3>
							</view>
							<view class="list-subtitle">{{item.subtitle}}</view>
						</view>
					</li>
				</ul>
			</view>
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
				pageHeadTitle: "标题",
				defaultHeadPic: store.state.defaultHeadPic, //默认头像
				// 当前挑战
				currentMission: {},

				// 组队情况
				stats: {},

				// 组队任务
				teamTask: [],
				// 我的队伍
				members: [],
				activities: []
			}
		},
		onLoad() {

		},
		onReady() {
			const route = getCurrentPages(); //获取当前页面地址
			const pathUrl = route[route.length - 1].route;
			this.getLogin().then(data => {
				// this.consoleLog(store.state.userInfo.token)
				// this.consoleLog(store.state.userInfo)
				// 已经登陆了
				this.consoleLog("已经登陆了")

				// 获取我的队伍和任务相关信息
				this.commonRequest({
					url: "/api/team-mission/details"
				}).then(res => {
					this.consoleLog("获取我的队伍和任务相关信息::", JSON.stringify(res))
					if (res.code == 0) {
						try {
							// 当前任务
							this.currentMission = res.data.currentMission || {};
							// 组队情况统计
							this.stats = res.data.stats;
							// 团队成员
							this.members = res.data.members || [];
							// 队伍日志
							this.activities = res.data.activities || [];

							// 没有数据时模拟数据
							// this.currentMission = {
							// 	"missionId": 12,
							// 	"name": "团队算术任务",
							// 	"subtitle": "完成100道算术题目",
							// 	"processTotal": 0,
							// 	"remainingTime": "7天0小时",
							// 	"rewardNames": "100智慧星,50知识尘",
							// 	"coverImage": "http://ic365.com/material/mission/2508/ff0cda9f79194011957e7829f9a3ad4e.png"
							// }
							// this.stats = {
							// 	"completedCount": 0,
							// 	"completionRate": 0
							// }
							// this.members = [{
							// 		avatar: "https://ic365.ajulye.com/material/mission/001@2x.png",
							// 		nickname: "晓东",
							// 		lastActive: "30分钟"
							// 	},
							// 	{
							// 		avatar: "https://ic365.ajulye.com/material/mission/001@2x.png",
							// 		nickname: "凛冬",
							// 		lastActive: "30分钟"
							// 	}
							// ]
							// this.activities = [{
							// 		"nickname": "Nature",
							// 		"eventName": "加入队伍",
							// 		"eventType": 3,
							// 		"time": "2025-08-05T09:11:49",
							// 		"rewardName": "100智慧星"
							// 	},
							// 	{
							// 		"nickname": "团队",
							// 		"eventName": "周学习目标",
							// 		"eventType": 2,
							// 		"time": "2025-08-05T08:11:49",
							// 		"rewardName": "100智慧星"
							// 	},
							// 	{
							// 		"nickname": "IC3795",
							// 		"eventName": "完成计算题",
							// 		"eventType": 1,
							// 		"time": "2025-08-05T07:11:49",
							// 		"rewardName": "10星尘"
							// 	}
							// ]
							try {
								this.activities.forEach(item => {
									if (item.eventType == 1) {
										// 完成任务
										item.action = "完成了";
										item.subtitle = item.time || "" + " · " + item.rewardName || "";
									} else if (item.eventType == 2) {
										// 团队消息
										item.nickname = "";
										item.action = "团队达成了";
										item.subtitle = item.time || "";
									} else if (item.eventType == 3) {
										// 成员加入
										item.action = "加入了队伍";
										item.eventName = "";
										item.subtitle = item.time || "" + " · " + item.rewardName || "";
									}
									console.log(item.subtitle)
								})
							} catch (e) {
								console.log(e)
							}
						} catch (e) {}
					} else {
						uni.showToast({
							title: res.message || "获取我的队伍和任务相关信息失败!",
							icon: "none"
						});
					}
				}).catch(error => {
					this.consoleLog("获取我的队伍和任务相关信息报错：：", error)
				})

				// 获取组队任务
				this.commonRequest({
					url: "/api/team-mission/list"
				}).then(res => {
					this.consoleLog("获取组队任务::", JSON.stringify(res))
					if (res.code == 0) {
						this.teamTask = res.data;

						// 没返回数据时的测试数据
						// this.teamTask = [{
						// 	"missionId": 12,
						// 	"name": "团队算术任务",
						// 	"subtitle": "完成100道算术题目",
						// 	"coverImage": "http://ic365.com/material/mission/2508/ff0cda9f79194011957e7829f9a3ad4e.png",
						// 	"rewards": [{
						// 			"name": "100智慧星",
						// 			"currencyTypeId": 1,
						// 			"quantity": 100
						// 		},
						// 		{
						// 			"name": "50知识尘",
						// 			"currencyTypeId": 2,
						// 			"quantity": 50
						// 		}
						// 	]
						// }]
					} else {
						uni.showToast({
							title: res.message || "获取组队任务失败!",
							icon: "none"
						});
					}
				}).catch(error => {
					this.consoleLog("获取组队任务报错：：", error)
				})
			}).catch(err => {
				// 没有登陆
				if (pathUrl.indexOf("/login") == -1) {
					// 没有登录
					// console.log("没有登录,跳转到登录页面")
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
		computed: {

		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
	.user-info-wrap {
		display: flex;
		padding: 0.6875rem 1.6875rem;

		.head-pic {
			width: 3rem;
			height: 3rem;
			border-radius: 50%;
			background: #fff;
			overflow: hidden;
			// flex: 1;
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

	.challenge-wrap {
		background: url("/static/image/3_challenge_back.png") no-repeat top / 100%;
		height: 16.75rem;
		position: relative;

		.progress {
			position: absolute;
			top: 0.45rem;
			right: 0.75rem;
			color: #ef761f;
		}

		.progress-info {
			display: flex;
			position: absolute;
			top: 4.625rem;
			left: 1.5rem;
			width: calc(100% - 3rem);

			.info-icon {
				width: 4.25rem;
				height: 4.25rem;
				border-radius: 0.5rem;
				margin-right: 0.6875rem;
				// background: red;
			}

			.info-wrap {
				flex: 1;

				.info-title {
					font-size: 1.25rem;
					line-height: 1.75rem;
					margin-top: 0.5rem;
				}

				.info-describe {
					font-size: 0.875rem;
					color: #999;
					line-height: 1.25rem;
				}
			}
		}

		.progress-reward-wrap {
			position: absolute;
			left: 1.5rem;
			top: 12rem;
			width: calc(100% - 3rem);
			display: flex;
			text-align: center;

			.progress-time {
				flex: 1;
				margin-right: 0.6875rem;
				color: #ef761f;
				font-size: 1.25rem;
			}

			.progress-reward {
				flex: 1;
				color: #0588ae;
				font-size: 1.25rem;
			}
		}
	}

	// 组队任务 ------Start
	.team-task-wrap {
		.team-task-list-wrap {
			.team-task-list {
				border-radius: 1rem;
				padding: 1.25rem;
				display: flex;
				margin-bottom: 0.75rem;

				.list-info {
					flex: 1;

					.info-title {
						line-height: 1.5625rem;
						margin-bottom: 0.25rem;
						color: #333;
					}

					.info-describe {
						line-height: 1.25rem;
						font-size: 0.875rem;
						margin-bottom: 0.25rem;
						color: #666;
					}

					.info-reward-wrap {
						overflow: hidden;
						width: 100%;

						.reward {
							float: left;
							padding: 0.375rem 0.5rem;
							background-color: #fff;
							font-size: 0.75rem;
							line-height: 1;
							font-weight: 500;
							margin-right: 0.3rem;
							color: #ff926b;
							border-radius: 0.25rem;
							margin-bottom: 0.2rem;

							.reward-icon {
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

						.limit-label {
							display: inline-block;
							padding: 0.375rem 0.5rem;
							background-color: #fff;
							font-size: 0.75rem;
							line-height: 1;
							font-weight: 500;
							color: #ff926b;
							border-radius: 0.25rem;
						}
					}
				}

				.list-icon {
					width: 6.625rem;
					height: 6.9375rem;
					margin-left: 1.4375rem;
					border-radius: 0.5rem;
				}

				background-color:#B4E4FD;

				&[colorscheme="1"] {
					background-color: #FAE382;
				}

				&[colorscheme="2"] {
					background-color: #B4E4FD;
				}

				&[colorscheme="3"] {
					background-color: #AAE795;
				}
			}
		}
	}

	// 组队任务 ------End

	// 组队情况 ------Start
	.team-situation-wrap {
		.team-situation-info-wrap {
			display: flex;

			.team-situation-info {
				flex: 1;
				border-radius: 0.5rem;
				text-align: center;
				padding: 1.25rem;

				.info-num {
					padding-bottom: 0.3125rem;
					line-height: 1.75rem;
					min-height: 1.75rem;
				}

				.info-title {
					color: #666;
					font-size: 0.875rem;
				}

				&:nth-child(1) {
					background-color: #E8F9FF;
					margin-right: 0.6875rem;

					.info-num {
						color: #11a9d5;
					}
				}

				&:nth-child(2) {
					background-color: #EBFDEA;

					.info-num {
						color: #11CB66;
					}
				}
			}
		}
	}

	// 组队情况 ------End
	// 我的队伍 ------Start
	.my-team-wrap {
		.team-list-wrap {
			overflow: hidden;
			background: #E4FDE2;
			border-radius: 1rem;
			border: 0.125rem solid #56D279;
			padding: 1.75rem 0.75rem;

			.team-list {
				float: left;
				width: calc(100%/3 - 0.35rem);
				background: #fff;
				text-align: center;
				border-radius: 0.5rem;
				margin: 1.7rem 0 1.875rem 0;
				padding-bottom: 1rem;

				.list-avatar {
					width: 3.375rem;
					height: 3.375rem;
					border-radius: 50%;
					margin-top: -1.7rem;
					display: inline-block;
				}

				.list-nickname {
					font-size: 1rem;
					line-height: 1.375rem;
					margin-top: 1rem;
					margin-bottom: 0.25rem;
				}

				.list-time {
					min-height: 1.31rem;
					color: #999;
				}

				.green {
					color: #0CB96F;
				}

				&:not(:nth-child(3n)) {
					margin-right: 0.5rem;
				}
			}

			.invite {
				.list-avatar {
					background: url("/static/icons/invite.png") no-repeat top /100% 100%;
				}
			}
		}
	}

	// 我的队伍 ------End

	// 队伍动态 ------Start
	.team-dynamics-wrap {
		.dynamics-list-wrap {
			.dynamics-list {
				display: flex;
				margin-bottom: 0.75rem;
				padding: 1rem 0.75rem;
				background-color: #F6F6F6;
				border-radius: 1rem;

				.list-avatar {
					width: 3.375rem;
					height: 3.375rem;
					border-radius: 50%;
					margin-right: 0.5rem;
				}

				.list-info-wrap {
					flex: 1;

					.list-info {
						line-height: 1.56rem;
						color: #222;

						.list-info-name {
							font-size: 1.125rem;
							display: inline-block;
							margin-right: 0.5rem;

						}

						.list-info-action {
							font-size: 1rem;
							margin-right: 0.5rem;
						}

						.task-name {
							font-size: 1.125rem;
							color: #79d183;
							display: inline-block;
						}
					}

					.list-subtitle {
						font-size: 0.875rem;
						color: #999;
						margin-top: 0.2rem;
					}
				}
			}
		}
	}

	// 队伍动态 ------End
</style>