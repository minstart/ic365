<!-- isHide 控制导航栏是否显示 -->
<!-- background 导航栏背景色 默认白色-->
<!-- isBack 控制返回上一页按钮是否显示 -->
<!-- isModule 控制标题右侧功能模块是否显示 -->
<!-- clickModule 右侧功能模块点击函数 -->
<!-- systemTaskbar 是否计算系统任务栏高度 -->
<template name="page-head">
	<view class="common-page-head-view" :style="{paddingTop:taskbarHeight}">
		<view class="reserve-seat" v-if='!isHide'></view>
		<view v-if='!isHide' class="common-page-head" :style="{background:background,paddingTop:taskbarHeight}">
			<view class="common-page-head-back">
				<view class="page-head-back-icon" v-if='isBack' @click="clickBack(backData)"></view>
			</view>
			<view class="common-page-head-title" :class="standardTitle?'standard-title':''" :style="!title&&'height:0;opacity: 0;'">{{title}}</view>
			<view class="common-page-head-module" :style="!isModule&&'height:0;opacity: 0;'">
				<image v-if='isModule' :src="moduleIcon" mode="" @click="clickModule"></image>
			</view>
		</view>
	</view>
	<!-- <view class="become-member-window" @touchstart="touchstart" v-if="$store.state.officialAccountWindow">
		<view class="become-member-wrap">
			<view class="title">关注公众号</view>
			<image class="qr-code" :src="$store.state.officialAccountQRCode"></image>
			<p class="tips">扫码关注 “学养网” 公众号开通会员</p>
			<view class="btn-wrap">
				<button class="btn-close" @click.stop="closeBecomeMember">关闭</button>
			</view>
		</view>
	</view> -->
	<uni-popup ref="becomeMember" :mask-click="false" type="center">
		<view class="become-member-window">
			<view class="become-member-wrap">
				<view class="title">关注公众号</view>
				<image class="qr-code" :src="$store.state.officialAccountQRCode"></image>
				<p class="tips">扫码关注 “学养网” 公众号开通会员</p>
				<view class="btn-wrap">
					<button class="btn-close" @click.stop="closeBecomeMember">关闭</button>
				</view>
			</view>
		</view>
	</uni-popup>
	
	<uni-popup ref="popup-tips" :mask-click="false" :type="tipsData.type">
		<view class="popup-tips-wrap">
			<view class="popup-tips-title" v-if="tipsData.title">{{tipsData.title}}</view>
			<view class="popup-tips-content">{{tipsData.content}}</view>
			<view class="popup-tips-btn-wrap">
				<view class="tips-btn"></view>
				<view class="tips-btn"></view>
			</view>
		</view>
	</uni-popup>
</template>
<script>
	export default {
		name: "page-head",
		props: {
			clickModule: {
				type: Function,
				default: () => {
					// console.log("默认右侧功能区函数")
				}
			},
			isHide: {
				default: false
			},
			title: {
				// type: String,
				default: ""
			},
			background: {
				default: "#fff"
			},
			// 是否显示返回按钮
			isBack: {
				default: false
			},
			// 是否显示最右边功能模块
			isModule: {
				default: false
			},
			moduleIcon: {
				default: "/static/icons/nav-bar.png"
			},
			systemTaskbar: {
				default: true
			},

			standardTitle: {
				default: false
			}
		},
		data() {
			return {
				taskbarHeight: 0,
				tipsData:{
					type:"center",
					content:""
				}
			}
		},
		mounted() {
			this.systemTaskbar ? (this.taskbarHeight = uni.getSystemInfoSync().statusBarHeight * 2 + "rpx") : (this.taskbarHeight = "0rem")
		},
		methods: {
			clickBack() {
				this.$store.state.isLoading = true;
				// setTimeout(() => {
				// 	this.$store.state.isLoading = false;
				// }, 1000)
				uni.navigateBack({
					animationType: 'none',
					animationDuration: 1000
				})
			},
			
			openBecomeMember() {
				this.$refs.becomeMember.open(); // 打开弹窗
			},
			closeBecomeMember() {
				this.$store.state.officialAccountWindow = false;
				this.$refs.becomeMember.close(); // 关闭弹窗
			}

		}
	}
</script>
<style lang="less">
	.common-page-head-view {
		position: relative;
		top: 0;
		// background: green;
	}

	.page-head {
		z-index: 999;
	}

	.reserve-seat {
		height: 88rpx;
	}

	.common-page-head {
		display: flex;
		/* 定义弹性容器 */
		padding: 0;
		position: fixed;
		top: 0;
		width: 100%;
		background: #fff;
		z-index: 99;

		.common-page-head-back {
			height: 88rpx;
		}

		.common-page-head-back,
		.common-page-head-module {
			flex: 1;
			position: relative;
			min-height: 2rpx;

			* {
				position: absolute;
				left: 0;
				right: 0;
				bottom: 0;
				top: 0;
				margin: auto;
				width: 64rpx;
				height: 64rpx;
			}
		}

		.common-page-head-title {
			flex: 4;
			border-width: 0;
			color: #333;
			display: inline-block;
			font-weight: 700;
			font-size: 44rpx;
			// line-height: ;
			padding-bottom: 0.1rem;
			background: url("/static/image/title_back.png") no-repeat bottom center / 5.5rem;
		}

		.standard-title {
			font-size: 36rpx;
			color: #000;
			font-weight: normal;
			background: transparent;
		}

		.page-head-back-icon {
			background: url("/static/icons/back_orange.png") no-repeat center / 100% 100%;
		}

		.page-head-module-icon {
			width: 68rpx;
			height: 68rpx;
		}
	}

	.page-loading {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		background: #fff;
		z-index: 10000;
	}

	.become-member-window {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: rgba(0, 0, 0, 0.5);
		z-index: 100000000000000;

		.become-member-wrap {
			width: 608rpx;
			height: 830rpx;
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			margin: auto;
			background: #fff;
			border-radius: 20rpx;
			// padding: 20rpx;
			text-align: center;

			.title {
				text-align: center;
				line-height: 88rpx;
				font-size: 32rpx;
				border-bottom: 2rpx solid #dfdfdf;
			}

			.qr-code {
				width: 400rpx;
				height: 400rpx;
				margin: 60rpx auto;
			}

			.tips {
				font-size: 30rpx;
				color: #f00;
			}

			.btn-wrap {
				position: absolute;
				bottom: 0;
				height: 132rpx;
				width: 100%;
				border-top: 2rpx solid #dfdfdf;

				.btn-close {
					width: 390rpx;
					margin: 20rpx auto;
				}
			}
		}
	}
</style>