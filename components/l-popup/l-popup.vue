<template name="l-popup">
	<view class="l-popup-background">
		<view class="l-popup-window" :style="{'width':width,'height':height,'background':background}">
			<view class="l-popup-wrap">
				<view class="l-popup-close-icon" @click="close"></view>
				<view class="l-popup-content">
					<slot></slot>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		name: "uni-popup",
		props: {
			width: {
				default: "80%"
			},
			height: {
				default: "80%"
			},
			background: {
				default: "#fff"
			},
			close: {
				type: Function,
				default: () => {
					console.log("默认关闭弹窗，需要在父级组件设置才能关闭")
				}
			}
		},
		data() {
			return {
				taskbarHeight: 0
			}
		},
		mounted() {
			this.systemTaskbar ? (this.taskbarHeight = uni.getSystemInfoSync().statusBarHeight * 2 + "rpx") : (this.taskbarHeight = "0rem")
			// console.log("taskbarHeight",this.taskbarHeight)
		},
		methods: {
			clickBack() {

			}
		}
	}
</script>
<style lang="scss">
	.l-popup-background {
		position: fixed;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		z-index: 100;
		background: rgba(0, 0, 0, 0.5);
	}

	.l-popup-window {
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		margin: auto;
		background: #fff;
		z-index: 1000;

		.l-popup-wrap {
			position: relative;
			width: 100%;
			height: 100%;

			.l-popup-close-icon {
				width: 60rpx;
				height: 60rpx;
				border-radius: 60rpx;
				background-color: #dedede;
				position: absolute;
				right: -60rpx;
				top: -60rpx;
				z-index: 1000000;
				border: 6rpx solid #fff;
				overflow: hidden;

				&::after {
					width: 100%;
					height: 100%;
					content: "";
					display: block;
					background: url('/static/icons/close.png') no-repeat center / 100% 100%;
				}
			}

			.l-popup-content {
				position: relative;
				width: 100%;
				height: 100%;
				z-index: 2;
			}
		}

	}
</style>