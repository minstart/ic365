<template name="reward-pop-up">
	<view class="reward-pop-up-list-wrap">
		<view class="reward-pop-up-list" v-for="item in $store.state.rewardPopUpList" :rewardType="item.type">
			<view class="reward-wrap">
				<view class="reward-back-wrap">
					<image class="back1" src="/static/image/reward_back1.png" mode=""></image>
					<image class="back2" src="/static/image/reward_back2.png" mode=""></image>
					<image class="back3" src="/static/image/reward_back3.png" mode=""></image>
					<image class="back4" src="/static/image/reward_back4.png" mode=""></image>
					<view class="back5"></view>
					<view class="back6"></view>
					<view class="back7"></view>
				</view>
				<view class="reward-content-wrap" v-if="item.type == '1'">
					<view class="reward-content flex-center">
						<view class="reward-list" v-for="item2 in item.rewardList">
							<span>{{item2.name.replace(/\d/g,'')}}</span>
							<span style="margin-left:20rpx;">{{item2.quantity}}颗</span>
						</view>
					</view>
					<view class="reward-close-btn" @tap.stop="closeRewardPopUp(item)"></view>
				</view>
				<view class="reward-content-wrap" v-if="item.type == '2'">
					<!-- v-if="item.coverUrl" -->
					<image class="reward-icon" :src="item.coverUrl"></image>
					<h3 class="reward-content-title">{{item.name}}</h3>
					<view class="reward-content-subtitle">{{item.summary}}</view>
					<div class="reward-btn-wrap">
						<button class="reward-close-btn" @tap.stop="closeRewardPopUp(item)">领取</button>
					</div>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import commonJs from '/common/js/common.js';
	export default {
		props: {
			width: {
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
	.reward-pop-up-list-wrap {
		position: relative;
		width: 100vw;
		height: 100vh;
	}

	.reward-pop-up-list {
		position: absolute;
		top: 0;
		width: 100vw;
		height: 100vh;
		background: rgba(0, 0, 0, 0.5);
		z-index: 2;

		.reward-wrap {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			margin: auto;

			.reward-back-wrap {
				position: absolute;
				width: 100%;
				top: -160rpx;
				min-height: 300rpx;

				@keyframes back1Keyframes {
					0% {
						transform: translateX(0) translateY(0) rotate(0deg);
						opacity: 1;
					}

					50% {
						transform: translateX(100rpx) translateY(-200rpx) rotate(180deg);
						opacity: 0.5;
					}

					100% {
						transform: translateX(200px) translateY(-300rpx) rotate(360deg);
						opacity: 0;
					}
				}

				.back1 {
					width: 40rpx;
					height: 32rpx;
					position: absolute;
					right: 20rpx;
					bottom: 0;
					animation: back1Keyframes 3s linear infinite;
				}

				@keyframes back2Keyframes {
					0% {
						transform: translateX(0) translateY(0) rotate(0deg);
						opacity: 1;
					}

					50% {
						transform: translateX(-100rpx) translateY(-200rpx) rotate(180deg);
						opacity: 0.8;
					}

					100% {
						transform: translateX(-160px) translateY(-400rpx) rotate(260deg);
						opacity: 0;
					}
				}

				.back2 {
					width: 40rpx;
					height: 48rpx;
					position: absolute;
					left: 20rpx;
					bottom: 0;
					animation: back2Keyframes 4s linear infinite;
				}

				@keyframes back3Keyframes {
					0% {
						transform: translateX(0) translateY(0) rotate(0deg);
						opacity: 1;
					}

					50% {
						transform: translateX(-100rpx) translateY(-200rpx) rotate(180deg);
						opacity: 0.8;
					}
					100% {
						transform: translateX(-110px) translateY(-350rpx) rotate(360deg);
						opacity: 0;
					}
				}

				.back3 {
					width: 40rpx;
					height: 40rpx;
					position: absolute;
					left: 55%;
					bottom: 20rpx;
					animation: back3Keyframes 2s linear infinite;
				}

				@keyframes back4Keyframes {
					0% {
						opacity: 0;
						visibility: hidden;
					}

					50% {
						opacity: 1;
						visibility: visible;
					}

					100% {
						opacity: 0;
						visibility: hidden;
					}
				}

				.back4 {
					width: 100%;
					position: absolute;
					bottom: 60rpx;
					animation: back4Keyframes 3s linear infinite;
				}

				@keyframes back5Keyframes {
					0% {
						transform: translateX(0) translateY(0) rotate(0deg);
						opacity: 1;
					}

					50% {
						transform: translateX(-10rpx) translateY(-180rpx) rotate(180deg);
						opacity: 0.8;
					}

					100% {
						transform: translateX(-30px) translateY(-360rpx) rotate(260deg);
						opacity: 0;
					}
				}

				.back5 {
					width: 30rpx;
					height: 30rpx;
					border-radius: 30rpx;
					background: linear-gradient(#3023AE, #C86DD7);
					position: absolute;
					bottom: 10rpx;
					left: 20%;
					animation: back5Keyframes 1.5s linear infinite;
				}

				@keyframes back6Keyframes {
					0% {
						transform: translateX(0) translateY(0) rotate(0deg);
						opacity: 1;
					}

					50% {
						transform: translateX(-100rpx) translateY(-200rpx) rotate(180deg);
						opacity: 0.8;
					}

					100% {
						transform: translateX(-130px) translateY(-400rpx) rotate(260deg);
						opacity: 0;
					}
				}

				.back6 {
					width: 30rpx;
					height: 30rpx;
					border-radius: 30rpx;
					background: linear-gradient(#F5515F, #9F041B);
					position: absolute;
					left: 40%;
					bottom: 40rpx;
					animation: back6Keyframes 2s linear infinite;
				}

				@keyframes back7Keyframes {
					0% {
						transform: translateX(0) translateY(0) rotate(0deg);
						opacity: 1;
					}

					50% {
						transform: translateX(110rpx) translateY(-200rpx) rotate(180deg);
						opacity: 0.8;
					}

					100% {
						transform: translateX(140px) translateY(-400rpx) rotate(360deg);
						opacity: 0;
					}
				}

				.back7 {
					width: 26rpx;
					height: 26rpx;
					border-radius: 30rpx;
					background: linear-gradient(#FAD961, #F76B1C);
					position: absolute;
					right: 90rpx;
					bottom: 60rpx;
					animation: back7Keyframes 1.5s linear infinite;
				}

			}

			.reward-content-wrap {
				position: relative;
				width: 100%;
				height: 100%;

				.reward-content {
					position: absolute;
				}
			}
		}

		&[rewardType="1"] {

			// 成就
			.reward-wrap {
				width: 656rpx;
				height: 838rpx;
				background: url("/static/image/reward_content_back.png") no-repeat center / 100% 100%;

				.reward-content-wrap {
					.reward-content {
						position: absolute;
						right: 70rpx;
						bottom: 200rpx;
						width: 340rpx;
						height: 230rpx;
						display: grid;
						align-items: center;

						.reward-list {
							width: 100%;
							font-size: 40rpx;
							line-height: 56rpx;
							color: #000;
						}
					}

					.reward-close-btn {
						position: absolute;
						right: 44rpx;
						bottom: 16rpx;
						width: 542rpx;
						height: 116rpx;
					}
				}
			}
		}

		&[rewardType="2"] {
			.reward-wrap {
				width: 656rpx;
				height: max-content;
				border-radius: 60rpx;

				.reward-content-wrap {
					position: relative;
					padding: 222rpx 72rpx 60rpx 72rpx;
					width: calc(656rpx - 72rpx * 2);
					background: #fff;
					border-radius: 60rpx;

					.reward-icon {
						position: absolute;
						top: -300rpx;
						left: 0;
						right: 0;
						margin: auto;
						width: 568rpx;
						height: 498rpx;
					}

					.reward-content-title {
						width: 100%;
						font-size: 60rpx;
						text-align: center;
						margin-bottom: 20rpx;
					}

					.reward-content-subtitle {
						font-size: 32rpx;
						line-height: 1.5;

					}

					.reward-btn-wrap {
						width: 100%;
						text-align: center;

						.reward-close-btn {
							width: 260rpx;
							height: 88rpx;
							padding: 0;
							margin-top: 60rpx;
							font-size: 46rpx;
							color: #fff;
							line-height: 88rpx;
							border-radius: 60rpx;
						}
					}
				}
			}
		}
	}
</style>