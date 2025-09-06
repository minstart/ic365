<template>
	<view>
		<view class="swiper-css zqui-rel" :style="{ height: hpx }">
			<swiper class="swiper" :style="{ height: hpx }" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration" @change="guideAction">
				<swiper-item class="flex1" v-for="(item, index) in imageList" :key="index">
					<view class="swiper-img"></view>
				</swiper-item>
			</swiper>
			<!-- 按钮样式切换 -->
			<template v-if="cur != 3">
				<view class=" flex-column dots">
					<block v-for="(item,index) in imageList" :key="index">
						<view class="dot" :class="{'active':  index == cur}"></view>
					</block>
				</view>
			</template>
			<!-- 第四张图使用按钮《立即进入》 -->
			<template v-if="cur == 3">
				<button class="flex-column cu-btn footer" @click="launchApp">开始课题吧！</button>
			</template>
		</view>
	</view>
</template>

<script>
	import commonJs from '/common/js/common.js';
	const animation = weex.requireModule('animation');
	export default {
		data() {
			return {
				//修改图片,文字描述
				imageList: [{
						src: '/static/guide/guide1.png'
					},
					{
						src: '/static/guide/guide2.png'
					},
					{
						src: '/static/guide/guide3.png'
					},
					{
						src: '/static/guide/guide4.png'
					}
				],
				indicatorDots: false,
				autoplay: false,
				interval: 10000,
				duration: 500,
				iStatusBarHeight: '0px',
				hpx: '100%',
				cur: 0,
				dotsStyles: ''
			};
		},
		mixins: [commonJs],
		onLoad() {
			let that = this;
			plus.navigator.closeSplashscreen();
			uni.getSystemInfo({
				success: function(res) {
					that.hpx = res.windowHeight + 'px';
				}
			});
		},
		onReady() {
			this.move(0, 1);
		},
		methods: {
			launchApp() {
				const _this = this;
				//跳过引导页,储存本地值,下次进入直接跳过
				uni.setStorage({
					key: 'launchFlag',
					data: true,
					success() {
						_this.verifLogin().then(data => {
							_this.jumpPage({
								url:"/pages/page/index/index",
								type:"reLaunch"
							})
						}).catch(error => {
							_console.log("没有登录：：", error)
						})
					}
				});
			},
			guideAction(event) {
				let that = this,
					index = event.detail.current;
				that.cur = index;
				if (index == 0) {
					that.move(0, 1);
					that.moveTwo(150, 0.1);
					that.moveThree(150, 0.1);
					that.lefMainAction(0);
				}
				if (index == 1) {
					that.moveTwo(0, 1);
					that.move(150, 0.1);
					that.moveThree(150, 0.1);
					that.lefMainAction(uni.upx2px(80) + 'px');
				}
				if (index == 2) {
					that.moveThree(0, 1);
					that.moveTwo(150, 0.1);
					that.move(150, 0.1);
					that.lefMainAction(uni.upx2px(160) + 'px');
				}
			},
			lefMainAction(mum) {
				var testLM = this.$refs.lefMain;
				animation.transition(
					testLM, {
						styles: {
							transform: 'translate(' + mum + ',0px)'
						},
						duration: 400, //ms
						timingFunction: 'ease',
						delay: 0 //ms
					},
					function() {}
				);
			},
			move(tran, opa) {
				var testEl = this.$refs.box1;
				animation.transition(
					testEl, {
						styles: {
							transform: 'translate(' + tran + 'px,0px)',
							transformOrigin: 'center center',
							opacity: opa
						},
						duration: 800, //ms
						timingFunction: 'ease',
						delay: 0 //ms
					},
					function() {}
				);
				var textE2 = this.$refs.box2;
				animation.transition(
					textE2, {
						styles: {
							transform: 'translate(0px,' + tran + 'px) scale(' + opa + ')',
							transformOrigin: 'center center',
							opacity: opa
						},
						duration: 800, //ms
						timingFunction: 'ease',
						delay: 0 //ms
					},
					function() {}
				);
			},
			moveTwo(tran, opa) {
				var testEl = this.$refs.box3;
				animation.transition(
					testEl, {
						styles: {
							transform: 'translate(' + tran + 'px,0px)',
							transformOrigin: 'center center',
							opacity: opa
						},
						duration: 800, //ms
						timingFunction: 'ease',
						delay: 0 //ms
					},
					function() {}
				);
				var textE2 = this.$refs.box4;
				animation.transition(
					textE2, {
						styles: {
							transform: 'translate(0px,' + tran + 'px) scale(' + opa + ')',
							transformOrigin: 'center center',
							opacity: opa
						},
						duration: 800, //ms
						timingFunction: 'ease',
						delay: 0 //ms
					},
					function() {}
				);
			},
			moveThree(tran, opa) {
				var testEl = this.$refs.box5;
				animation.transition(
					testEl, {
						styles: {
							transform: 'translate(' + tran + 'px,0px)',
							transformOrigin: 'center center',
							opacity: opa
						},
						duration: 800, //ms
						timingFunction: 'ease',
						delay: 0 //ms
					},
					function() {}
				);
				var textE2 = this.$refs.box6;
				animation.transition(
					textE2, {
						styles: {
							transform: 'translate(0px,' + tran + 'px) scale(' + opa + ')',
							transformOrigin: 'center center',
							opacity: opa
						},
						duration: 800, //ms
						timingFunction: 'ease',
						delay: 0 //ms
					},
					function() {}
				);
			}
		}
	};
</script>

<style lang="scss">
	page {
		background-color: #FFFFFF;
		min-height: 100%;
		height: 100%;
	}

	.guide {
		flex-direction: column;
		flex: 1;
	}

	.flex1 {
		flex: 1;
		width: 100vw;
		height: 100vw;

		.swiper-img {
			width: 100%;
			height: 100%;
		}

		&:nth-child(1) {
			.swiper-img {
				background: url("/static/guide/guide1.png") no-repeat top / 100vw;
			}
		}

		&:nth-child(2) {
			.swiper-img {
				background: url("/static/guide/guide2.png") no-repeat top / 100vw;
			}
		}

		&:nth-child(3) {
			.swiper-img {
				background: url("/static/guide/guide3.png") no-repeat top / 100vw;
			}
		}

		&:nth-child(4) {
			.swiper-img {
				background: url("/static/guide/guide4.png") no-repeat top / 100vw;
			}
		}
	}

	.footer {
		width: 13.125rem;
		height: 2.5rem;
		text-align: center;
		position: fixed;
		bottom: 2rem;
		left: 0;
		right: 0;
		margin: auto;
		font-size: 1rem;
		font-weight: 500;
		color: #FFFFFF;
		border-radius: 1rem;

	}

	.btn-box {
		position: absolute;
		z-index: 999;
		right: 40rpx;
		top: 120rpx;
	}

	.dots {
		display: flex;
		justify-content: center;
		position: absolute;
		z-index: 999;
		height: 1rem;
		left: 0;
		right: 0;
		bottom: 1rem;
	}

	.dot {
		margin: 0 4rpx;
		width: 15rpx;
		height: 15rpx;
		background: #D5D5D5;
		border-radius: 8rpx;
		transition: all .6s;
	}

	.dot.active {
		width: 40rpx;
		background: #F5A623 !important;
	}

	/* 相对定位 */
	.zqui-rel {
		position: relative;
	}

	.swiper-css {
		width: 100vw;
	}

	.swiper-item {
		width: 100vw;
	}
</style>