<template>
	<view class="page-wrap">
		<page-head :title='pageHeadTitle' :isBack='true' :background="'#FFEEE6'"></page-head>
		<view class="banner-back"></view>
		<div class="banner-wrap">
			<view class="btn-wrap">
				<view class="set-btn"></view>
			</view>
			<view class="user-info-wrap">
				<view class="invite-team-icon"></view>
				<h3 class="info-title">邀请好友加入队伍</h3>
				<view class="info-subtitle">邀请好友一起学习，共同进步,还能获得额外奖励！</view>
				<image class="qr-code" src=""></image>
				<view class="info-tips">扫描二维码加入我的队伍</view>
				<div class="invitation-code-wrap">
					<view class="invitation-code-tips">或使用邀请码</view>
					<h3 class="my-code">MATH-2023-015</h3>
				</div>
				<button class="share-btn btn-yellow" @click="shareBtn">分享邀请链接</button>
				<button class="copy-btn btn-white" @click="copyBtn">复制邀请码</button>
			</view>
		</div>
		<view class="uni-padding-wrap">
			<view class="item-title-wrap">
				<h3 class="item-title">邀请奖励</h3>
			</view>
			<view class="list-wrap rewar-list-wrap">
				<view class="list" v-for="item in invitationRewards">
					<image class="list-icon" :src="item.cover"></image>
					<view class="list-info">
						<h3 class="list-info-title">{{item.name}}</h3>
						<view class="list-info-subtitle">奖励：{{item.rewardName}}</view>
					</view>
				</view>
			</view>
			<view class="item-title-wrap">
				<h3 class="item-title">已邀请好友</h3>
				<view class="item-more">
					<view class="text">2/3</view>
				</view>
			</view>
			<view class="list-wrap invited-list-wrap">
				<view class="list" v-for="item in invited">
					<image class="list-icon" :src="item.cover"></image>
					<view class="list-info">
						<h3 class="list-info-title">{{item.name}}同学</h3>
						<view class="list-info-subtitle">{{item.time}} 加入</view>
					</view>
					<view class="flex-center">
						<view class="list-more">
							<view class="delete-btn" @click="deleteUser(item)">删除</view>
						</view>
					</view>
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
				pageHeadTitle: "",
				invitationRewards: [{
						name: "成功邀请1位好友",
						cover: "https://ic365.ajulye.com/material/mission/002@2x.png",
						rewardName: "50智慧星"
					},
					{
						name: "成功邀请3位好友",
						cover: "https://ic365.ajulye.com/material/mission/002@2x.png",
						rewardName: "200智慧星+限定称号"
					},
					{
						name: "成功邀请5位好友",
						cover: "https://ic365.ajulye.com/material/mission/002@2x.png",
						rewardName: "500智慧星+10启明石"
					}
				],
				invited: [{
					userId: "1",
					cover: "https://ic365.ajulye.com/material/mission/002@2x.png",
					name: "小红",
					time: "2023.11.15"
				}, {
					userId: "2",
					cover: "https://ic365.ajulye.com/material/mission/002@2x.png",
					name: "小黑",
					time: "2023.12.15"
				}, ]
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
		onHide() {

		},
		created() {

		},
		mounted() {

		},
		computed: {

		},
		methods: {
			shareBtn(){
				uni.showToast({
					title:"分享邀请链接",
					icon: "none"
				})
			},
			copyBtn(){
				uni.setClipboardData({
				    data: '邀请码1234567899999',
				    success: function () {
				        uni.showToast({
				            title: '已复制邀请码，发送给好友邀请他/她一起来学习吧 ^_^ ',
				            icon: 'success',
				            duration: 5000
				        });
				    },
				    fail: function (err) {
				        console.error('复制失败:', err);
				    }
				});
			},
			deleteUser(data){
				uni.showModal({
					content: "是否确认删除好友" + data.name + "同学？",
					confirmText: "确认",
					success: function(res) {
						if (res.confirm) {
							uni.showToast({
								title:"删除好友："+data.userId,
								icon: "none"
							})
						}
					}
				})
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-wrap {
		background-color: #F4F4F4;
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
				background: url("/static/icons/setUp-white.png") no-repeat center/100% 100%;
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
				background: url("/static/image/3_3_invite_team_icon.png") no-repeat top / 100% 100%;
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
				background: #F9F9F9;
				border-radius: 1rem;
				padding: 0.625rem;
				margin-bottom: 1.25rem;

				.invitation-code-tips {
					margin-bottom: 0.3125rem;
					font-size: 0.8125rem;
					color: #999;
				}

				.my-code {
					font-size: 1.125rem;
					color: #222;
					line-height: 1.625rem;
				}
			}

			.share-btn {
				margin: 0 0.5rem 1.25rem 0.5rem;
			}

			.copy-btn {
				margin: 0 0.5rem;
			}
		}
	}


	.list-wrap {
		.list {
			display: flex;
			padding: 1.25rem 0;

			.list-icon {
				width: 3.375rem;
				height: 3.375rem;
				margin-right: 0.8rem;
			}

			.list-info {
				flex: 1;

				.list-info-title {
					font-size: 1.125rem;
					line-height: 1.5625rem;
					color: #222;
					margin-bottom: 0.3125rem;
				}

				.list-info-subtitle {
					font-size: 0.875rem;
					color: #999;
				}
			}
		}
	}

	.rewar-list-wrap {
		background: #fff;
		padding: 0 0.75rem;
		border-radius: 1rem;

		.list {
			border-bottom: 0.1rem solid #D7D7D7;

			&:last-child {
				border-width: 0;
			}
		}
	}

	.invited-list-wrap {
		.list{
			background: #fff;
			padding: 1rem 0.75rem;
			border-radius: 1rem;
			margin-bottom: 0.75rem;
		}
		.delete-btn{
			width: 4.125rem;
			border: 0.1rem solid #FF3A3A;
			border-radius: 1rem;
			color: #ff3a3a;
			font-weight: 700;
			font-size: 1rem;
			line-height: 1.875rem;
			text-align: center;
		}
	}
</style>