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
			<view class="become-member-wrap" :style="'transform: scale('+becomeMemberSize+');'">
				<view class="title">关注公众号</view>
				<image class="qr-code" :src="$store.state.officialAccountQRCode"></image>
				<p class="tips">扫码关注 “学养网” 公众号开通会员</p>
				<view class="btn-wrap">
					<button class="btn-close" @click.stop="closeBecomeMember">关闭</button>
				</view>
			</view>
		</view>
	</uni-popup>

	<!-- 询问弹窗 -->
	<!-- tipsDatas数据控制，从openPopupTips传参 -->
	<!-- 关闭需要在 父级页面调用this.$refs.pageHead.closePopupTips()关闭 -->
	<uni-popup ref="popupTips" :mask-click="false" :type="tipsData.type">
		<view class="popup-tips-wrap">
			<view class="popup-tips-title" v-if="tipsData.title">{{tipsData.title}}</view>
			<view class="popup-tips-content" v-html="tipsData.content"></view>
			<view class="popup-tips-btn-wrap">
				<view class="tips-btn" @click.stop="closePopupTips">取消</view>
				<view class="border"></view>
				<view class="tips-btn" @click.stop="tipsData.success">确定</view>
			</view>
		</view>
	</uni-popup>

	<!-- 异常弹窗 -->
	<!-- msgData数据控制 从openMsgTips传参-->
	<!-- 关闭需要在 父级页面调用this.$refs.pageHead.closeMsgTips()关闭 -->
	<uni-popup ref="msgTips" :mask-click="false" :type="msgData.type" :style="'z-index:100002 !important;'">
		<view class="msg-tips-wrap">
			<view class="msg-tips-icon" :type="msgData.icon"></view>
			<view class="msg-tips-content" v-html="msgData.content"></view>
			<view class="msg-tips-btn-wrap" v-if="msgData.icon=='2'">
				<view class="tips-btn" @click.stop="closeMsgTips">知道了</view>
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
			},
			becomeMemberSize: {
				default: 1
			}
		},
		data() {
			return {
				taskbarHeight: 0,
				tipsData: {}, //询问弹窗参数对象
				msgData: {}, //提示弹窗参数对象
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
			},
			openPopupTips(data) {
				this.$refs.popupTips.open(); // 打开消息咨询弹窗
				// console.log("咨询弹窗带来的data:",data)
				this.tipsData = {
					type: "center",
					title: "提示",
					content: "",
					success: () => {
						this.closePopupTips()
					}
				};
				this.tipsData = {
					...this.tipsData,
					...data
				};
				console.log("合并后的data", this.tipsData)
			},
			closePopupTips() {
				this.$refs.popupTips.close(); //关闭消息咨询弹窗

			},
			openMsgTips(data) {
				this.$refs.msgTips.open(); // 打开消息咨询弹窗
				console.log("咨询弹窗带来的data:", data)
				this.msgData = {
					type: "center",
					icon: "2",
					content: ""
				};
				this.msgData = {
					...this.msgData,
					...data
				};
				console.log("合并后的data", this.msgData)
				if (data.time) {
					let _this = this;
					let _time = (Number(data.time) - 100) || 0
					setTimeout(function() {
						_this.closeMsgTips()
					}, _time)
				}
			},
			closeMsgTips() {
				this.$refs.msgTips.close(); //关闭消息咨询弹窗
			}			
		}
	}
</script>
<style lang="scss">
	@import "/static/css/standard.scss";

	.common-page-head-view {
		position: relative;
		top: 0;
		// z-index: 999;
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
			z-index: 1000;
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
			background: url($imgSrc+"/image/title_back.png") no-repeat bottom center / 5.5rem;
		}

		.standard-title {
			font-size: 36rpx;
			color: #000;
			font-weight: normal;
			background: transparent;
		}

		.page-head-back-icon {
			border-radius: 50%;
			background: url($imgSrc+"/icons/back_orange.png") no-repeat center / 100% 100%;
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

	// 询问弹窗
	.popup-tips-wrap {
		width: 610rpx;
		background-color: #FFFFFF;
		border-radius: 12rpx;
		overflow: auto;

		.popup-tips-title {
			text-align: center;
			font-size: 32rpx;
			color: #000;
			background-color: #FFFAEE;
			line-height: 88rpx;
		}

		.popup-tips-content {
			padding: 62rpx 52rpx;
			font-size: 30rpx;
			color: #000;
			line-height: 44rpx;
		}

		.popup-tips-btn-wrap {
			box-shadow: 0px -4px 8px 0px rgba(0, 0, 0, 0.08);
			height: 72rpx;
			padding: 30rpx 48rpx;
			display: flex;
			align-items: center;
			justify-content: center;

			.tips-btn,
			.border {
				display: inline-block;
				vertical-align: middle;
			}

			.border {
				height: 46rpx;
				width: 2rpx;
				margin: 0rpx 32rpx;
				background-color: #F2F2F2;
			}

			.tips-btn {
				flex: 1;
				font-size: 32rpx;
				height: 64rpx;
				line-height: 64rpx;
				color: #000;
				text-align: center;
				border-radius: 8rpx;
			}

			.tips-btn:nth-child(1) {
				border: 4rpx solid #303030;
			}

			.tips-btn:nth-child(3) {
				border: 4rpx solid $ThemeColor;
				background-color: $ThemeColor;
			}
		}
	}

	// 提示弹窗
	.msg-tips-wrap {
		width: 610rpx;
		background-color: #FFFFFF;
		border-radius: 20rpx;
		overflow: auto;
		position: relative;

		.msg-tips-icon {
			width: 80rpx;
			height: 118rpx;
			background: url($imgSrc+"/icons/tips.png") no-repeat center / 100% 100%;
			&[type="2"] {
				width: 80rpx;
				height: 118rpx;
				background: url($imgSrc+"/icons/tips.png") no-repeat center / 100% 100%;
			}

			margin: 34rpx auto 34rpx auto;
		}

		.msg-tips-content {
			padding: 0 52rpx 50rpx 52rpx;
			font-size: 30rpx;
			color: #000;
			line-height: 44rpx;
			position: relative;
			text-align: center;
		}

		.msg-tips-btn-wrap {
			padding:0 48rpx 40rpx 48rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			.tips-btn {
				text-align: center;
				width: 260rpx;
				font-size: 32rpx;
				height: 64rpx;
				line-height: 64rpx;
				color: #000;
				text-align: center;
				border-radius: 30rpx;
				border: 2rpx solid $ThemeColor;
				letter-spacing: 8rpx;
				padding-left: 8rpx;
			}
		}
	}
</style>