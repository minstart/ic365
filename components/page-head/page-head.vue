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
	<view v-if="showRewardPopUp" class="reward-pop-up-wrap" v-for="item in rewardPopUpList">
		<view class="pop-up-type" :data-type="item.type">
			<view class="reward-pop-up-back">

			</view>
			<div class="reward-pop-up-content">

			</div>
		</view>
	</view>
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

			// 奖励弹窗
			showRewardPopUp: {
				default: false
			},
			// 奖励列表
			rewardPopUpList: {
				default: []
			},
			standardTitle:{
				default: false
			}
		},
		data() {
			return {
				taskbarHeight: 0
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
		.standard-title{
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

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}

	//奖励列表弹窗 
	// .reward-pop-up-wrap {
	// 	position: fixed;
	// 	overflow: hidden;
	// 	left: 0;
	// 	top: 0;
	// 	width: 100vw;
	// 	height: 1600rpx;
	// 	background: rgba(0, 0, 0, 0.5);
	// 	z-index: 100000;
	// 	.pop-up-type{
	// 		width: 80%;
	// 		height: 80%;
	// 		background: #fff;
	// 	}
	// }
</style>