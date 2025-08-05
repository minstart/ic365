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
			<view class="challenge-wrap">
				<h3 class="progress">团队进度： 42 / 100</h3>
				<view class="progress-info">
					<image class="info-icon" src=""></image>
					<view class="info-wrap">
						<h3 class="info-title">数学马拉松</h3>
						<view class="info-describe">完成100道数学题挑战</view>
					</view>
				</view>
				<view class="progress-reward-wrap">
					<h2 class="progress-time">3天12小时</h2>
					<h2 class="progress-reward">500 智慧星</h2>
				</view>
			</view>
			<view class="team-task-wrap">
				<view class="item-title-wrap">
					<h3 class="item-title">组队任务</h3>
				</view>
				<ul class="team-task-list-wrap">
					<li class="team-task-list" v-for="item in teamTask" :colorScheme="item.colorScheme">
						<view class="list-info">
							<h3 class="info-title">{{item.name}}</h3>
							<view class="info-describe">{{item.subTitle}}</view>
							<view class="info-reward-wrap">
								<view class="reward" v-if="item.rewardName">
									<image class="reward-icon" :src="rewardIcon(item.currencyTypeId)"></image>
									<span>{{item.rewardName}}</span>
								</view>
								<view class="limit-label" v-if="item.limit">限定称号</view>
							</view>
						</view>
						<image class="list-icon" :src="item.cover" mode=""></image>
					</li>
				</ul>
			</view>
			<view class="team-situation-wrap">
				<view class="item-title-wrap">
					<h3 class="item-title">组队情况</h3>
				</view>
				<view class="team-situation-info-wrap">
					<view class="team-situation-info">
						<h3 class="info-num">28</h3>
						<view class="info-title">组队完成次数</view>
					</view>
					<view class="team-situation-info">
						<h3 class="info-num">92%</h3>
						<view class="info-title">任务完成率</view>
					</view>
				</view>
			</view>
			<view class="my-team-wrap">
				<view class="item-title-wrap">
					<h3 class="item-title my-team-title">我的队伍</h3>
					<view class="item-more" style="color: #79D183;">3名成员</view>
				</view>
				<ul class="team-list-wrap">
					<li class="team-list" v-for="item in myTeam">
						<image class="list-avatar" :src="item.avatar"></image>
						<h3 class="list-nickname">{{item.nickname}}同学</h3>
						<view class="list-time green">{{item.time}}</view>
					</li>
					<li class="team-list invite">
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
				<ul class="dynamics-list-wrap">
					<li class="dynamics-list" v-for="item in dynamics">
						<image class="list-avatar" :src="item.avatar"></image>
						<view class="list-info-wrap">
							<view class="list-info">
								<h3 class="list-info-name" v-if="item.nickname">{{item.nickname}}</h3>
								<span class="list-info-action">{{item.action}}</span>
								<h3 class="task-name">{{item.taskName}}</h3>
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
				userInfo: {
					nickname: "",
					currencies: {

					}
				},
				// 当前挑战
				progress: {

				},
				// 组队任务
				teamTask: [{
						colorScheme: 1,
						name: "数学马拉松",
						subTitle: "团队合作完成100道数学题挑战，提升计算能力",
						cover: "https://ic365.ajulye.com/material/mission/001@2x.png",
						rewardName: "10智慧星",
						currencyTypeId: 1,
						limit: true
					},
					{
						colorScheme: 2,
						name: "逻辑大师",
						subTitle: "解决30道逻辑推理题，锻炼思维能力",
						cover: "https://ic365.ajulye.com/material/mission/001@2x.png",
						rewardName: "10智慧星",
						currencyTypeId: 2,
						limit: true
					},
					{
						colorScheme: 3,
						name: "速算王者",
						subTitle: "完成50道速算题:提升计算速度和准确率",
						cover: "https://ic365.ajulye.com/material/mission/001@2x.png",
						rewardName: "800智慧星",
						currencyTypeId: 1,
						limit: true
					},
				],
				myTeam: [{
						avatar: "https://ic365.ajulye.com/material/mission/001@2x.png",
						nickname: "晓东",
						time: "30分钟"
					},
					{
						avatar: "https://ic365.ajulye.com/material/mission/001@2x.png",
						nickname: "凛冬",
						time: "30分钟"
					},
					{
						avatar: "https://ic365.ajulye.com/material/mission/001@2x.png",
						nickname: "小南",
						time: "0分钟"
					}
				],
				dynamics:[
					{
						avatar: "https://ic365.ajulye.com/material/mission/001@2x.png",
						nickname: "晓东",
						action:"完成了",
						taskName:"分数联系",
						subtitle:"2小时前 · 获得20知识尘"
					},
					{
						avatar: "https://ic365.ajulye.com/material/mission/001@2x.png",
						nickname: "小刚",
						action:"加入了队伍",
						// taskName:"分数联系",
						subtitle:"今天 · 08:35"
					},
					{
						avatar: "https://ic365.ajulye.com/material/mission/001@2x.png",
						// nickname: "晓东",
						action:"团队达成了",
						taskName:"周学习目标",
						subtitle:"昨天 · 获得100智慧星"
					}
				]
			}
		},
		onLoad() {

		},
		onReady() {

		},
		onShow() {
			this.uniHide("all")
			if (store.state.userInfo.info) {
				this.userInfo = {
					...this.userInfo,
					...store.state.userInfo.info
				}
			}

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
			// 奖励图标
			rewardIcon(id) {
				switch (id) {
					case 1:
						// 智慧星
						return "/static/icons/star.png";
						break;
					case 2:
						// 知识尘
						return "/static/icons/dust.png";
						break;
					case 3:
						// 启明石
						return "/static/icons/stone.png";
						break;
					case 4:
						// 丰硕穗
						break;
					case 5:
						// 圣诞欢乐颂
						return "/static/icons/christmas.png";
						break;
					case 6:
						// 课程
						break;
				}
			},
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
				background: red;
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
			bottom: 2.5rem;
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
						.reward {
							display: inline-block;
							padding: 0.375rem 0.5rem;
							background-color: #fff;
							font-size: 0.75rem;
							line-height: 1;
							font-weight: 500;
							margin-right: 0.4rem;
							color: #ff926b;
							border-radius: 0.25rem;

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
				}

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
				.list-time{
					min-height: 1.31rem;
					color: #999;
				}
				.green{
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
	.team-dynamics-wrap{
		.dynamics-list-wrap{
			.dynamics-list{
				display: flex;
				margin-bottom: 0.75rem;
				padding:1rem 0.75rem;
				background-color: #F6F6F6;
				border-radius: 1rem;
				.list-avatar{
					width: 3.375rem;
					height: 3.375rem;
					border-radius: 50%;
					margin-right: 0.5rem;
				}
				.list-info-wrap{
					flex: 1;
					.list-info{
						line-height: 1.56rem;
						color: #222;
						.list-info-name{
							font-size: 1.125rem;
							display: inline-block;
							margin-right:0.5rem;
							
						}
						.list-info-action{
							font-size: 1rem;
							margin-right:0.5rem;
						}
						.task-name{
							font-size: 1.125rem;
							color: #79d183;
							display: inline-block;
						}
					}
					.list-subtitle{
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