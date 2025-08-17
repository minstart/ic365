<template>
	<!-- v-if解决center弹窗位置问题 -->
	<view :class="direction==='center'?'centers':''" v-if="direction==='center'?open:true">
		<view class="product-window"
			:style="{width:width+'%',height:height=='fit-content'?height:(open?height:'fit-content')}"
			:class="(open ? 'on' : '')+' '+direction" @touchmove.stop.prevent="">
			<!-- 兼容h5顶部导航空位 -->
			<view class="roll">
				<view v-if="is_close" class="close-img">
					<!-- #ifdef H5 -->
						<image :class="{'close-img-H5':H5HeightTed}" src="../../static/ming-pop/close.png" mode=""  @click="close" ></image>
					<!-- #endif -->
					<!-- #ifndef H5 -->
						<image src="../../static/ming-pop/close.png" mode=""  @click="close" ></image>
					<!-- #endif -->
				</view>
				<!-- #ifdef H5 -->
				<view v-if="H5HeightTed" style="height: 90rpx;"></view>
				<!-- #endif -->
				<slot></slot>
			</view>
		</view>
		<view class="mask" v-if="is_mask" @touchmove.prevent :hidden="!open" @click="close(1)"></view>
	</view>
</template>

<script>
	export default {
		props: {
			direction: {
				type: String,
				default: "below"
			},
			width: {
				type: Number,
				default: 100
			},
			height: {
				type: String,
				default: "fit-content"
			},
			is_close: {
				type: Boolean,
				default: true
			},
			is_mask: {
				type: Boolean,
				default: true
			},
			maskFun: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				open: false,
				H5Height:true
			};
		},
		computed:{
			H5HeightTed(){
				return this.H5Height||(this.direction==='up'||this.direction==='left'||this.direction==='right')
			}
		},
		methods: {
			show() {
				this.open = true;
				this.$emit("watchOpen");
				try{
					let that=this;
					const query = uni.createSelectorQuery();
					query
						.select('.roll')
						.boundingClientRect(data => {
							uni.getSystemInfo({
								success(res) {
									if(data.height>res.windowHeight) {that.H5Height=true} else that.H5Height=false;
								}
							})
						})
						.exec();
				}catch(err){console(err,55)}

			},
			close(e) {
				if (e == 1 && !this.maskFun) return;
				this.open = false;
				this.$emit("watchClose")
			}
		}
	}
</script>

<style lang="scss" scoped>
	view {
		box-sizing: border-box;
	}

	.centers {
		width: 100vw;
		display: flex;
		justify-content: center;
		align-items: center;
		// height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}

	.product-window {
		position: fixed;
		background-color: #fff;
		z-index: 77;
		border-radius: 15rpx;
		padding: 0 20rpx;
		transition: all .3s cubic-bezier(.25, .5, .5, .9);
		-webkit-transition: all .3s cubic-bezier(.25, .5, .5, .9);
	}

	.below {
		left: 0;
		bottom: 0;
		transform: translate3d(0, 100%, 0);
		-webkit-transform: translate3d(0, 100%, 0);
	}

	.up {
		top: 0;
		left: 0;
		transform: translate3d(0, -100%, 0);
		-webkit-transform: translate3d(0, -100%, 0);
	}

	.right {
		right: 0;
		top: 0;
		height: 100%;
		transform: translate3d(100vw, 0, 0);
		-webkit-transform: translate3d(100vw, 0, 0);
	}

	.left {
		left: 0;
		top: 0;
		height: 100%;
		transform: translate3d(-100vw, 0, 0);
		-webkit-transform: translate3d(-100vw, 0, 0);
	}

	.center {
		position: static;
		-webkit-position: static;
		transform: translate3d(-100vw, -100%, 0);
		-webkit-transform: translate3d(-100vw, -100%, 0);
	}

	.product-window.on {
		transform: translate3d(0, 0, 0);
		-webkit-transform: translate3d(0, 0, 0);
	}

	.mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #000;
		opacity: .5;
		z-index: 5;
	}

	.close-img{
		height: 50rpx;
	}
	.close-img {
		image {
			position: fixed;
			right: 20rpx;
			top: 10rpx;
			font-size: 35rpx;
			color: #8a8a8a;
			width: 50rpx;
			height: 50rpx;
		}
		.close-img-H5{
			top: 100rpx;
		}
	}
	.roll {
		max-width: 100vw;
		max-height: 100vh;
		overflow: auto;
	}
</style>