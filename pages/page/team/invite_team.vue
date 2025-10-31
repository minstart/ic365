<template>
	<view class="page-loading" v-if="pageMask"></view>
	<view class="page-wrap">
		<page-head ref="pageHead" :isBack='true' :background="'transparent'"></page-head>
		<view class="banner-back"></view>
		<view class="banner-back2"></view>
		<view class="banner-wrap">
			<view class="user-info-wrap">
				<view class="invite-team-icon"></view>
				<h3 class="info-title">邀请好友加入队伍</h3>
				<view class="info-subtitle">邀请好友一起学习，共同进步,还能获得额外奖励！</view>
				<view class="reward-wrap">
					<view class="banner"></view>
					<view class="reward-flex-wrap">
						<view class="reward">
							<h3 class="title">邀请1位好友</h3>
							<view class="reward-list-wrap">
								<view class="reward-list" v-for="item in reward[0].rewardList">
									<image class="icon" :src="rewardIcon(item.currencyTypeId).icon3"></image>
									<h3 class="reward-text">奖励{{item.name.replace(/\d/g, '')}}{{item.quantity}}</h3>
								</view>
							</view>
						</view>
						<view class="reward">
							<h3 class="title">邀请2位好友</h3>
							<view class="reward-list-wrap">
								<view class="reward-list" v-for="item in reward[1].rewardList">
									<image class="icon" :src="rewardIcon(item.currencyTypeId).icon3"></image>
									<h3 class="reward-text">奖励{{item.name.replace(/\d/g, '')}}{{item.quantity}}</h3>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="invitation-code-wrap">
					<h3 class="my-code">邀请码：<span>{{invitationCode}}</span></h3>
				</view>
				<view class="btn-wrap">
					<button class="share-btn btn-yellow" @click="getInvitationCode">生成邀请码</button>
					<button class="copy-btn btn-white" @click="copyBtn">复制邀请码</button>
				</view>
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
				invitationCode: "",
				reward: []
			}
		},
		onLoad() {
			this.verifLogin().then(data => {
				this.commonRequest({
					url: "/api/user/qrCode",
					notLoading: true
				}).then(res => {
					this.qrCode = res.data;
				})
				this.commonRequest({
					url: "/api/mission/getInviteMission",
					notLoading: true
				}).then(res => {
					console.log("获取邀请奖励", res.data)
					this.reward = res.data;
				})
			})
		},
		onReady() {

		},
		onShow() {
			this.pageOnShowSet({
				uniHide: "all"
			}).then(res => {

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
			getInvitationCode() {
				// 获取组队邀请码
				this.commonRequest({
					url: "/api/team/generateTeamCode"
				}).then(res => {
					console.log("获取组队邀请码", res.data)
					this.invitationCode = res.data
				})
			},
			copyBtn() {
				if (!this.invitationCode) {
					this.$refs.pageHead.openMsgTips({
						content: "请先点击生成邀请码按钮，再复制邀请码"
					})
					return false;
				}
				uni.setClipboardData({
					data: this.invitationCode,
					success: function() {
						this.$refs.pageHead.openMsgTips({
							content: "已复制邀请码，发送给好友邀请他/她一起来学习吧！"
						})
					},
					fail: function(err) {
						console.error('复制失败:', err);
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "/static/css/standard.scss";
	@import '/static/css/standard.scss';

	.page-wrap {
		background-color: $background;
		min-height: calc(100vh - 120rpx);
		padding-top: 60rpx;
		position: relative;
	}

	.banner-back {
		position: absolute;
		z-index: 0;
		left: 0;
		top: 0;
		width: 100vw;
		height: 14.375rem;
		background: linear-gradient(#FFEEE6 0%, #FFEEE6 95%, #fff 100%);
		border-radius: 0 0 3rem 3rem;
	}

	.banner-back2 {
		position: absolute;
		bottom: 0;
		z-index: 0;
		width: 100%;
		height: 750rpx;
		background: url($imgSrc+"/image/3_2_back.png") no-repeat center / 100% 100%;
	}

	.banner-wrap {
		position: relative;
		z-index: 1;

		.btn-wrap {
			overflow: hidden;
			width: 21.4375rem;
			margin: 0 auto;

			.set-btn {
				margin: 0 0.5rem 1.06rem 0;
				width: 1.25rem;
				height: 1.25rem;
				float: right;
				background: url($imgSrc+"/icons/setUp-white.png") no-repeat center/100% 100%;
			}
		}

		.user-info-wrap {
			position: relative;
			width: 21.4375rem;
			background: #fff;
			margin: 0 auto;
			border-radius: 0.5rem;
			margin-bottom: 0;
			text-align: center;
			padding-bottom: 1.25rem;

			.invite-team-icon {
				position: absolute;
				top: -2rem;
				left: 1.5rem;
				width: 4.5rem;
				height: 5.1875rem;
				background: url($imgSrc+"/image/3_3_invite_team_icon.png") no-repeat top / 100% 100%;
			}

			.info-title {
				padding: 1.3125rem 0 0.3rem 0;
				line-height: 1.75rem;
				color: #222;
				font-size: 1.25rem;
			}

			.info-subtitle {
				font-size: 0.8125rem;
				color: #999;
			}

			.reward-wrap {
				position: relative;

				.banner {
					width: 100%;
					height: 420rpx;
					margin: 40rpx 0 60rpx 0;
					background: url($imgSrc+"/image/3_2_banner.png") no-repeat center / 100% 100%;
				}

				.reward-flex-wrap {
					position: absolute;
					top: 162rpx;
					margin: 0 80rpx;
					// opacity: 0.8;
					width: calc(100% - 160rpx);
					height: 172rpx;
					display: flex;

					.reward {
						flex: 1;
						text-align: center;

						.title {
							font-size: 24rpx;
							margin: 14rpx 0 10rpx 0;
							color: #000;
						}

						&:nth-child(1) {
							margin-right: 66rpx;

							.icon {
								width: 56rpx;
								height: 76rpx;
								margin: 0 auto;
							}

							.reward-text {
								color: #fff;
								font-size: 24rpx;
								margin-top: -16rpx;
							}
						}

						&:nth-child(2) {
							.reward-list {
								text-align: left;
								margin-left: 20rpx;
							}

							.icon {
								width: 34rpx;
								height: 46rpx;
								margin-right: 8rpx;
								display: inline-block;
							}

							.reward-text {
								color: #fff;
								font-size: 22rpx;
								line-height: 46rpx;
								display: inline-block;
								vertical-align: top;
								margin-right: 8rpx;
							}
						}
					}
				}
			}

			.qr-code {
				width: 9.75rem;
				height: 9.75rem;
				background: #e9e9e9;
				border-radius: 0.5rem;
				margin: 0.625rem auto;
			}

			.info-tips {
				color: #999;
				font-size: 0.8125rem;
				margin-bottom: 1.25rem;
			}

			.invitation-code-wrap {
				border-radius: 1rem;
				padding: 0.625rem;
				margin-bottom: 1.25rem;

				.my-code {
					font-size: 1.125rem;
					color: #222;
					line-height: 1.625rem;

					span {
						display: inline-block;
						min-width: 200rpx;
						min-height: 2rpx;
					}
				}
			}

			.btn-wrap {
				display: flex;

				.share-btn {
					flex: 1;
					margin: 0 27rpx 60rpx 40rpx;
				}

				.copy-btn {
					flex: 1;
					margin: 0 40rpx 60rpx 27rpx;
				}
			}
		}
	}
</style>