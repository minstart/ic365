<!-- 任务详情 -->
<template name="task-pop-up">
	<view class="task-pop-up-wrap">
		<view class="task-type">{{details.typeName}}</view>
		<div class="task-content-wrap">
			<h3 class="content-title">任务说明：</h3>
			<view class="content-text">{{details.subTitle}}</view>
		</div>
		<view class="task-reward-wrap">
			<h3 class="content-title">任务奖励：</h3>
			<view class="reward-list-wrap">
				<view class="reward-list">
					<view class="reward" v-if="details.rewardName">
						<view class="reward-icon-back" :currencyType="details.currencyTypeId">
							<image class="reward-icon" :src="rewardIcon(details.currencyTypeId).moderate"></image>
						</view>
						<view class="reward-text">{{details.rewardName.replace(/\d/g,'')}}</view>
						<view class="reward-num">{{details.rewardName.match(/\d+/g)[0]}}颗</view>
					</view>
				</view>
			</view>
		</view>
		<view class="close-btn-wrap flex-center">
			<button class="close-btn" @tap.stop='close'>关闭</button>
		</view>
	</view>
</template>
<script>
	import commonJs from '/common/js/common.js';
	export default {
		mixins: [commonJs],
		props: {
			close: {
				type: Function,
				default: () => {
					// console.log("默认右侧功能区函数")
				}
			},
			details: {
				default: ""
			},
		},
		data() {
			return {
				
			}
		},
		mounted() {},
		methods: {

		}
	}
</script>
<style lang="scss">
	@import "/static/css/standard.scss";
	.task-pop-up-wrap {
		border-radius: 30rpx 30rpx 0 0;
		background: #fff;
		min-height: 600rpx;
		position: relative;
		padding: 0 40rpx;
		.task-type{
			position: absolute;
			top: -30rpx;
			background: $ThemeColor;
			font-size: 32rpx;
			left: 40rpx;
			padding: 14rpx 20rpx 14rpx 60rpx;
			border-radius: 40rpx;
			color: #fff;
			line-height: 1;
			&::after{
				content: "";
				position: absolute;
				left: 20rpx;
				top: 0;
				bottom: 0;
				margin: auto;
				width: 32rpx;
				height: 22rpx;
				background: url("/static/icons/task_type.png") no-repeat center / 100% 100%;
			}
		}
		.task-content-wrap{
			padding-top: 80rpx;
			.content-title{
				font-size: 30rpx;
			}
			.content-text{
				background-color: #F8F8F8;
				font-size: 24rpx;
				text-indent: 48rpx;
				padding: 26rpx 16rpx;
				margin-top: 10rpx;
				color: #222;
			}
		}
		.task-reward-wrap{
			padding-top: 80rpx;
			padding-bottom: 220rpx;
			.content-title{
				font-size: 30rpx;
			}
			.reward-list-wrap{
				background-color: #F8F8F8;
				margin-top: 10rpx;
				.reward-list{
					padding: 20rpx;
					.reward{
						display: flex;
						line-height: 140rpx;
						.reward-icon-back{
							display: flex;
							align-items: center;
							justify-content: center;
							margin-right: 26rpx;
							width: 100rpx;
							height: 140rpx;
							background-color: #ECFAFF;
							.reward-icon{
								width: 100%;
								height: 100%;
							}
						}
						.reward-text{
							flex: 4;
						}
						.reward-num{
							flex: 1;
						}
					}
				}
			}
		}
		.close-btn-wrap {
			position: absolute;
			height: 176rpx;
			width: 100%;
			margin-left: -40rpx;
			text-align: center;
			bottom: 0;
			box-shadow: 0px -4px 8px 0px rgba(0, 0, 0, 0.08);

			.close-btn {
				width: 80%;
				font-weight: 700;
				line-height: 80rpx;
				font-size: 32rpx;
				color: #fff;
			}
		}
	}
</style>