<template>
	<view class="page-loading" v-if="pageMask"></view>
	<view class="page-wrap">
		<page-head :isBack='true' :background="'#FFEEE6'"></page-head>
		<view class="banner-back"></view>
		<view class="banner-back2"></view>
		<div class="banner-wrap">
			<view class="btn-wrap">
				<view class="set-btn"></view>
			</view>
			<view class="user-info-wrap">
				<view class="invite-team-icon"></view>
				<h3 class="info-title">邀请好友加入队伍</h3>
				<view class="info-subtitle">邀请好友一起学习，共同进步,还能获得额外奖励！</view>
				<image src=""></image>
				<div class="invitation-code-wrap">
					<h3 class="my-code">邀请码：{{invitationCode}}</h3>
				</div>
				<div class="btn-wrap">
					<button class="share-btn btn-yellow" @click="shareBtn">生成邀请码</button>
					<button class="copy-btn btn-white" @click="copyBtn">复制邀请码</button>
				</div>
			</view>
		</div>
		
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
				invitationCode:"MATH-2023-015"
			}
		},
		onLoad() {
			this.verifLogin().then(data => {
				this.commonRequest({
					url: "/api/user/qrCode",
					notLoading:true
				}).then(res => {
					this.qrCode = res.data;
				})
			})
		},
		onReady() {

		},
		onShow() {
			this.pageOnShowSet({
				uniHide: "all"
			}).then(res=>{
				
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
				            icon: 'none',
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
	@import '/static/css/standard.scss';
	.page-wrap {
		background-color: $background;
		min-height: calc(100vh - 60rpx);
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
				border-radius: 1rem;
				padding: 0.625rem;
				margin-bottom: 1.25rem;
				.my-code {
					font-size: 1.125rem;
					color: #222;
					line-height: 1.625rem;
				}
			}
			
			.btn-wrap{
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