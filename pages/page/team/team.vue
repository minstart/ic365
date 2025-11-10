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
				<view class="btn-setUp" @click="jumpPage({url:''})"></view>
			</view>
		</view>
		<view class="uni-padding-wrap">
			<!-- 当前挑战 -->
			<view class="challenge-wrap">
				<h3 class="progress">团队进度：
					<span v-if="currentMission.missionId">{{currentMission.processTotal}} / {{currentMission.conditionCount}}</span>
					<span v-else>— —</span>
				</h3>
				<view class="progress-info" :class="currentMission.missionId ? 'jumpTask' : ''" @tap.stop="currentMission.missionId&&openTask(currentMission)">
					<image class="info-icon" :src="currentMission.coverImage"></image>
					<view class="info-wrap">
						<h3 class="info-title">{{currentMission.name}}</h3>
						<view class="info-describe">{{currentMission.subtitle}}</view>
					</view>
				</view>
				<view class="no-challenge" v-if="!currentMission.missionId"></view>
				<view class="progress-reward-wrap flex-center">
					<h2 class="progress-time">
						<span v-if="currentMission.remainingTime">{{currentMission.remainingTime}}</span>
						<span v-else>— —</span>
					</h2>
					<h2 class="progress-reward">
						<span v-if="currentMission.rewardNames">{{currentMission.rewardNames}}</span>
						<span v-else>— —</span>
					</h2>
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
										<image class="reward-icon" :src="rewardIcon(item2.currencyTypeId).min"></image>
										<span>{{item2.name}}</span>
									</view>
								</view>
							</view>
						</div>
						<view class="list-icon-wrap">
							<image class="list-icon" :src="item.coverImage" mode=""></image>
							<view class="open-task" v-if="!currentMission.missionId && item.status == null" @click="openTaskDetails(item)">开始挑战</view>
							<div class="status-text" v-if="item.status != null" :style="{'background-color':item.statusColor}">
								{{item.statusName}}
							</div>

						</view>
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
						<view class="info-title">任务完成次数</view>
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
						<view class="delete-btn" @tap.stop="deleteTeammate(item)" v-if="!item.isCaptain && isCaptain && item.userId != userInfo.userId"></view>
						<image class="list-avatar" :src="item.avatar"></image>
						<h3 class="list-nickname">{{item.nickname}}同学</h3>
						<view class="list-time green">{{item.isCaptain?"队长":"队员"}}</view>
					</li>
					<li class="team-list" v-for="item in placeholderMembers">
						<image class="list-avatar" :src="item.avatar"></image>
						<h3 class="list-nickname">待邀请</h3>
						<view class="list-time green"></view>
					</li>
					<li class="team-list" type='invite' v-if="members.length<3" @click="jumpPage({url:'/pages/page/team/invite_team'})">
						<view class="list-avatar"></view>
						<h3 class="list-nickname">邀请好友</h3>
						<view class="list-time"></view>
					</li>
					<li class="team-list" type="join" v-if="members.length==0" @tap.stop='joinTeam'>
						<view class="list-avatar"></view>
						<h3 class="list-nickname">加入队伍</h3>
						<view class="list-time"></view>
					</li>
					<li class="team-list" type="exit" v-if="members.length>0" @tap.stop="exitTeam(item)">
						<view class="list-avatar"></view>
						<h3 class="list-nickname">退出队伍</h3>
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
	<uni-popup ref="joinTeam" :mask-click="false" type="bottom" :style="'z-index:10001 !important;'">
		<div class="joinTeam-wrap">
			<input type="text" class="joinTeam-input uni-input" placeholder="请输入邀请码" v-model="invitationCode">
			<view class="tips">输入或者粘贴好友发送的邀请码，点确定加入队伍。</view>
			<view class="btn-wrap">
				<button class="join-btn btn-white" @tap.stop="joinPopupClose">关闭</button>
				<button class="join-btn" @tap.stop='confirmJoin'>确认</button>
			</view>
		</div>
	</uni-popup>
	<uni-popup ref="taskPopUp" :mask-click="false" type="bottom">
		<task-details :details='taskDetails' :close="closeTaskPopUp"></task-details>
	</uni-popup>
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
				invitationCode: "", //加入队伍输入的邀请码
				defaultHeadPic: "", //默认头像
				// 当前挑战
				currentMission: {},

				// 组队情况
				stats: {},

				// 组队任务
				teamTask: [],
				// 我的队伍
				members: [],
				placeholderMembers: [],
				activities: [],
				taskDetails: {}, //任务详情
				isCaptain: false // 队伍里我是不是队长
			}
		},
		onLoad() {
			
		},
		onReady() {
			store.state.taskbarHeight = uni.getSystemInfoSync().statusBarHeight * 2 + "rpx"
		},
		onShow() {
			const route = getCurrentPages(); //获取当前页面地址
			const pathUrl = route[route.length - 1].route;
			this.verifLogin().then(data => {
				// console.log(store.state.userInfo.token)
				// console.log(store.state.userInfo)
				// 已经登陆了
				this.getTeamInfo()
				
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
			}).catch(err => {
				console.log("没有登录：：", error)
			});

			this.pageOnShowSet({
				uniHide: "all"
			})
		},
		onHide() {
			this.closeRewardPopUp()
			this.$refs.pageHead.closePopupTips()
		},
		created() {

		},
		mounted() {

		},
		computed: {

		},
		methods: {
			// 所有获取队伍相关信息接口合集
			getTeamInfo() {
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

				this.getTeamDetails()
			},
			joinTeam() {
				this.$refs.joinTeam.open("center")
			},
			joinPopupClose() {
				this.$refs.joinTeam.close()
			},
			deleteTeammate(item) {
				let _this = this;
				this.$refs.pageHead.openPopupTips({
					title: "队伍管理",
					content: '是否确认把' + item.nickname + "同学移出队伍？",
					success: res => {
						this.$refs.pageHead.closePopupTips()
						// 开启任务
						_this.commonRequest({
							url: "/api/team/kickMember",
							data: {
								userId: item.userId
							}
						}).then(res => {
							console.log("移出队员：", res.data)
							// 获取我的队伍和任务相关信息
							_this.getTeamDetails()
							this.$refs.pageHead.openMsgTips({
								content: "移出队员成功"
							})
						})
					}
				})
			},
			exitTeam(item) {
				console.log("离开队伍", item)
				this.commonRequest({
					url: "/api/team/leaveTeam"
				}).then(res => {
					console.log("离开队伍：", res.data)
					this.getTeamInfo()
					this.$refs.pageHead.openMsgTips({
						content: "离开队伍成功"
					})
				})
			},
			// 任务详情处理
			openTaskDetails(item) {
				console.log("任务详情处理:", item)
				if (this.currentMission && item.missionId == this.currentMission.missionId) {
					let isOther = this.openTask(item);
					return false;
				}
				if (this.members.length == 0) {
					this.$refs.pageHead.openMsgTips({
						content: "请点击邀请好友或加入队伍，组建队伍再开始挑战任务。"
					})
					return false;
				}
				if (!this.isCaptain) {
					this.$refs.pageHead.openMsgTips({
						content: "只有队长才能开启任务" + ((this.currentMission && this.currentMission.name) ? ",且当前挑战任务未完成。" : "")
					})
					return false;
				}
				// 获取我的队伍和任务相关信息
				this.getTeamDetails().then(res => {
					// 校验当前是否有挑战任务
					if (!this.currentMission || !this.currentMission.name) {
						let _this = this;
						this.$refs.pageHead.openPopupTips({
							title: "是否开启挑战任务",
							content: item.name + "：" + item.subtitle + "。",
							success: res => {
								this.$refs.pageHead.closePopupTips()
								// 开启任务
								_this.commonRequest({
									url: "/api/team-mission/startMission",
									data: {
										missionId: item.missionId
									}
								}).then(res => {
									console.log("开启任务:", res.data)
									// 更新当前挑战任务
									_this.getTeamDetails()
									this.$refs.pageHead.openMsgTips({
										content: "开启组队任务成功"
									})
								})
							}
						})
						return false;
					} else {
						this.$refs.pageHead.openMsgTips({
							content: "已开启挑战任务，请先完成当前组队挑战任务"
						})
					}
				})

				// let isOther = this.openTask(item);
				// if(isOther){
				// 	// 已经做完了或其他情况，查看任务详情
				// 	this.taskDetails = item;
				// 	this.$refs.taskPopUp.open("bottom")
				// }
			},
			//关闭弹窗
			closeRewardPopUp() {
				this.$refs.rewardPopUp.close()
			},
			closeTaskPopUp() {
				this.$refs.taskPopUp.close()
			},
			confirmJoin() {
				if (!this.invitationCode) {
					this.$refs.pageHead.openMsgTips({
						content: '请输入邀请码'
					})
					return false;
				}
				this.commonRequest({
					url: "/api/joining/team",
					data: {
						code: this.invitationCode
					}
				}).then(res => {
					console.log("加入队伍：", res.data)
					this.getTeamInfo()
					this.$refs.pageHead.openMsgTips({
						content: '加入队伍成功'
					})
					this.$refs.joinTeam.close()
				})
			},
			getTeamDetails() {
				return new Promise((resolve, reject) => {
					// 获取我的队伍和任务相关信息
					this.commonRequest({
						url: "/api/team-mission/details"
					}).then(res => {
						console.log("获取我的队伍和任务相关信息::", res)
						try {
							// 当前任务
							this.currentMission = res.data.currentMission || {};
							// 组队情况统计
							this.stats = res.data.stats;
							// 团队成员
							this.members = res.data.members || [];

							this.members.forEach(item => {
								if (item.userId == this.userInfo.userId && item.isCaptain) {
									this.isCaptain = true;
								}
							})
							this.placeholderMembers = [];
							let teamDefault = [{
									avatar: this.$store.state.$imgSrc + "/image/placehold_avatar1.png",
									isCaptain: true
								},
								{
									avatar: this.$store.state.$imgSrc + "/image/placehold_avatar2.png",
									isCaptain: false
								},
								{
									avatar: this.$store.state.$imgSrc + "/image/placehold_avatar3.png",
									isCaptain: false
								}
							]
							if (this.members.length == 0) {
								this.placeholderMembers = teamDefault;
							} else if (this.members.length == 1) {
								this.placeholderMembers.push(teamDefault[1], teamDefault[2])
							} else if (this.members.length == 2) {
								this.placeholderMembers.push(teamDefault[2])
							}

							// 队伍日志
							this.activities = res.data.activities || [];

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
										item.nickname = item.nickname + "同学";
										item.action = "加入了队伍";
										item.eventName = "";
										item.subtitle = item.time || "" + " · " + item.rewardName || "";
									}
									// console.log(item.subtitle)
								})
							} catch (e) {
								console.log(e)
							}
						} catch (e) {}
						resolve(res);
					}).catch(error => {
						console.log("获取我的队伍和任务相关信息报错：：", error)
					})

					// 获取组队任务
					this.commonRequest({
						url: "/api/team-mission/list"
					}).then(res => {
						console.log("获取组队任务::", res);
						res.data.forEach((item, i) => {
							let statusName = "";
							let statusColor = "";
							if (item.status == 0) {
								statusName = "进行中"
								statusColor = "#F5A623"
							} else if (item.status == 1) {
								statusName = "已完成"
								statusColor = "#25CC05"
							} else if (item.status == 2) {
								statusName = "已失败"
								statusColor = "#D81212"
							} else if (item.status == 3) {
								statusName = "已过期"
								statusColor = "#6E4603"
							}
							res.data[i].statusName = statusName;
							res.data[i].statusColor = statusColor;
						})
						this.teamTask = res.data;

						// console.log(this.teamTask)

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

					}).catch(error => {
						console.log("获取组队任务报错：：", error)
					})
				})
			}
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

	.challenge-wrap {
		background: url($imgSrc+"/image/3_challenge_back.png") no-repeat top / 100%;
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

		.jumpTask {
			&::after {
				content: " ";
				position: absolute;
				right: 20rpx;
				top: 0;
				bottom: 0;
				margin: auto;
				width: 16rpx;
				height: 28rpx;
				background: url($imgSrc+"/icons/next.png") no-repeat right / 100% 100%;
			}
		}

		.no-challenge {
			position: absolute;
			top: 130rpx;
			left: 0;
			right: 0;
			margin: auto;
			width: 332rpx;
			height: 160rpx;
			background: url($imgSrc+'/image/3_no_challenge.png') no-repeat center / 100% 100%;
		}

		.progress-reward-wrap {
			position: absolute;
			left: 1.5rem;
			top: 400rpx;
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
				padding: 40rpx;
				display: flex;
				margin-bottom: 0.75rem;
				position: relative;

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

				.flex-center {
					flex: 1;
				}

				.list-icon-wrap {
					position: relative;

					.open-task {
						// position: absolute;
						width: 200rpx;
						height: 60rpx;
						// top: 0;
						// bottom: 0;
						// right: 268rpx;
						// margin: auto;
						// background: #fff1bd;
						border-radius: 30rpx;
						font-size: 32rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						line-height: 60rpx;
						color: #fff;
						position: relative;

						&::after {
							content: " ";
							display: inline-block;
							width: 14rpx;
							height: 22rpx;
							margin-left: 6px;
							vertical-align: top;
							background: url($imgSrc+"/icons/next3.png") no-repeat center / 100% 100%;
						}
					}

					.status-text {
						width: 200rpx;
						height: 60rpx;
						border-radius: 30rpx;
						font-size: 32rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						line-height: 60rpx;
						color: #fff;
						position: relative;
					}

					.list-icon {
						width: 137.6rpx;
						height: 145.6rpx;
						margin: 0 31.5rpx;
						// margin-left: 46rpx;
						border-radius: 0.5rem;
						margin-bottom: 10rpx;
						position: relative;
						margin-top: -16rpx;
					}
				}


				background-color:#B4E4FD;

				&[colorscheme="1"] {
					background-color: #FAE382;

					.open-task {
						background-color: #F5A623;
					}
				}

				&[colorscheme="2"] {
					background-color: #B4E4FD;

					.open-task {
						background-color: #4F91FF;
					}
				}

				&[colorscheme="3"] {
					background-color: #AAE795;

					.open-task {
						background-color: #529B02;
					}
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
				display: inline-block;
				vertical-align: top;
				width: calc(100%/3 - 0.35rem);
				background: #fff;
				text-align: center;
				border-radius: 0.5rem;
				margin: 1.7rem 0 1.875rem 0;
				padding-bottom: 1rem;
				position: relative;

				.delete-btn {
					position: absolute;
					right: -12rpx;
					top: -24rpx;
					width: 48rpx;
					height: 48rpx;
					background: url($imgSrc+"/icons/delete.png") no-repeat center / 100% 100%;
				}

				.list-avatar {
					width: 3.375rem;
					height: 3.375rem;
					border-radius: 50%;
					margin-top: -1.7rem;
					display: inline-block;
					border: 4rpx solid #fff;
				}

				.list-nickname {
					font-size: 1rem;
					line-height: 1.375rem;
					margin-top: 1rem;
					margin-bottom: 0.25rem;
					padding: 4rpx;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
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

				&[type="invite"] {
					.list-avatar {
						background: url($imgSrc+"/icons/team_invite.png") no-repeat top /100% 100%;
					}
				}

				&[type="join"] {
					.list-avatar {
						background: url($imgSrc+"/icons/team_join.png") no-repeat top /100% 100%;
					}
				}

				&[type="exit"] {
					.list-avatar {
						background: url($imgSrc+"/icons/team_exit.png") no-repeat top /100% 100%;
					}
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
	
	// 加入队伍弹窗
	.joinTeam-wrap {
		background: url($imgSrc+"/image/join_team.png") no-repeat center / 100% 100%;
		border-radius: 30rpx;
		width: 658rpx;
		height: 446rpx;
		padding: 20rpx;
		position: relative;
		.joinTeam-input {
			width: 382rpx;
			border-width: 0;
			border-radius: 20px;
			margin-bottom: 10px;
			line-height: 82rpx;
			font-size: 24rpx;
			background: #FDF0DE;
			position: absolute;
			top: 174rpx;
			right: 72rpx;
		}

		.tips {
			position: absolute;
			color: #000;
			font-size: 20rpx;
			width: 512rpx;
			right: 48rpx;
			bottom: 162rpx;
			text-align: center;
		}

		.btn-wrap {
			position: absolute;
			width: 472rpx;
			right: 80rpx;
			bottom: 20rpx;
			display: flex;

			.join-btn {
				flex: 1;
				border-radius: 30rpx;
				border-width: 0;
				width: 200rpx;
				font-size: 32rpx;
				font-weight: 500;

				&:nth-child(1) {
					margin-right: 16rpx;
					color: #484848 !important;
				}

				&:nth-child(2) {
					margin-left: 16rpx;
					color: #fff !important;
				}
			}
		}
	}
</style>