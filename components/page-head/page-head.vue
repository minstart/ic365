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
			<viww class="common-page-head-back">
				<view class="page-head-back-icon" v-if='isBack' @click="clickBack(backData)"></view>
			</viww>
			<view class="common-page-head-title">{{title}}</view>
			<view class="common-page-head-module">
				<image v-if='isModule' :src="moduleIcon" mode="" @click="clickModule"></image>
			</view>
		</view>
	</view>
	<view class="page-loading" v-if="$store.state.isLoading"></view>
</template>
<script>
	export default {
		name: "page-head",
		props: {
			clickModule: {
				type: Function,
				default: () => {
					console.log("默认右侧功能区函数")
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
			}
		},
		data() {
			return {
				taskbarHeight: 0
			}
		},
		mounted() {
			this.systemTaskbar ? (this.taskbarHeight = uni.getSystemInfoSync().statusBarHeight / 16 + "rem") : (this.taskbarHeight = "0rem")
			// console.log("taskbarHeight",this.taskbarHeight)
		},
		methods: {
			clickBack() {
				uni.navigateBack({
					animationType: 'fade-in',
					animationDuration: 0
				})
			}
		}
	}
</script>
<style lang="less">
	.page-head {
		z-index: 999;
	}

	.reserve-seat {
		height: 2.6rem;
	}

	.common-page-head {
		display: flex;
		/* 定义弹性容器 */
		padding: 0;
		position: fixed;
		top: 0;
		width: 100%;
		background: #fff;
		z-index: 999;

		.common-page-head-back,
		.common-page-head-module {
			flex: 1;
			position: relative;

			* {
				position: absolute;
				left: 0;
				right: 0;
				bottom: 0;
				top: 0;
				margin: auto;
				width: 2rem;
				height: 2rem;
			}
		}

		.common-page-head-title {
			flex: 4;
			border-width: 0;
			color: #333;
		}

		.page-head-back-icon {
			background: url("/static/icons/back_orange.png") no-repeat center / 100% 100%;
		}

		.page-head-module-icon {
			width: 2.125rem;
			height: 2.125rem;
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
		z-index: 99999999999999999999999999999;
	}

	.page-loading::before {
		content: "";
		width: 1rem;
		height: 1rem;
		border-radius: 100%;
		color: rgba(255, 206, 9, .4);
		box-shadow: 0 -2.5rem rgba(255, 206, 9, .9),
			/* top */
			2.5rem 0px,
			/* right */
			0 2.5rem,
			/* bottom */
			-2.5rem 0 rgba(255, 206, 9, .7),
			/* left */

			-1.75rem -1.75rem rgba(255, 206, 9, .8),
			/* left-top */
			1.75rem -1.75rem rgba(255, 206, 9, 1),
			/* right-top */
			1.75rem 1.75rem,
			/* right-bottom */
			-1.75rem 1.75rem;
		/* left-bottom */
		animation: spin 1s steps(8) infinite;
		/* center */
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		margin: auto;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}
</style>