<!-- 兑换记录 -->
<template>
	<!-- <view class="page-loading" v-if="pageMask"></view> -->
	<view class="page-wrap" style="padding-bottom: 0;">
		<view class="banner-wrap" :style="'padding-top:'+$store.state.taskbarHeight">
			<page-head ref="pageHead" :title='pageHeadTitle' :isBack='true' :background="'transparent'"></page-head>
		</view>
		<view class="uni-padding-wrap">
			<view class="commodity-wrap">
				<view class="banner-info-wrap">
					<view class="banner-back"></view>
					<view class="banner-text">商品兑换记录是用户通过智慧星、启明石、知识尘等虚拟币获得以下商品。</view>
					<h3 class="exchange-total">
						<span class="total-title">已兑换：</span>
						{{exchangeTotal}}
					</h3>
				</view>

				<scroll-view scroll-y="true" class="commodity-list-wrap" @scrolltolower="getCommodity" :style="'height: calc(100vh - 420rpx - '+$store.state.taskbarHeight+');'">
					<view class="no-list-tip" v-if="commodity.commodityList && commodity.commodityList.length==0">暂无数据</view>
					<view>
						<view class="commodity-list-content-wrap" v-for="(item,i) in commodity.commodityList">
							<view class="item-title">
								<h3 class="month-title">{{item.title}}</h3>
								<h3 class="month-total">兑换：{{commodity.statistics[i]}}</h3>
							</view>
							<view class="commodity-list" v-for="item2 in item.data" @click="jumpPage({url:'/pages/page/user/exchangeLogDetails?' + objectToQueryString(item2)})">
								<image class="list-icon" :src="item2.icon"></image>
								<h3 class="list-title">{{item2.productName}}</h3>
								<view class="list-time">兑换时间：{{this.changeTime(item2.redeemTime) || ''}}</view>
							</view>
						</view>
					</view>
					<view style="float: left;width: 100%;" class="no-list-tip" v-if="commodity.noData"> - 没有更多了 -</view>
				</scroll-view>
			</view>
		</view>
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
				pageHeadTitle: "",
				exchangeTotal: "0",
				commodity: {
					page: 0,
					noData: false,
					commodityList: {},
					statistics: {}
				},
			}
		},
		onLoad() {
			// 获取我的兑换统计
			this.commonRequest({
				url: "/api/exchange/stat"
			}).then(res => {
				this.exchangeTotal = res.data.exchangeTotal
			}).catch(error => {
				console.log("获取我的兑换统计报错：：", error)
			})

			// 获取月份兑换统计
			this.commonRequest({
				url: "/api/exchange/redeem-history-grouped-count"
			}).then(res => {
				console.log("获取月份兑换统计:", res.data)
				this.commodity.statistics = res.data;
			}).catch(error => {
				console.log("获取获取月份兑换统计报错：：", error)
			})

			this.getCommodity()
		},
		onReady() {
			store.state.taskbarHeight = uni.getSystemInfoSync().statusBarHeight * 2 + "rpx"
		},
		onShow() {
			this.pageOnShowSet({
				uniHide: "all"
			})
		},
		onHide() {

		},
		// watch {

		// },
		created() {

		},
		mounted() {

		},
		computed: {

		},
		methods: {
			getCommodity() {
				if (this.commodity.noData == true) {
					return false;
				}
				this.commodity.page = this.commodity.page + 1;
				this.commonRequest({
					url: "/api/exchange/products",
					method: "POST",
					data: {
						page: this.commodity.page,
						type: 2,
						size: "10"
					}
				}).then(res => {
					console.log("已兑换商品列表", res.data)
					if (res.data.length == 0) {
						this.commodity.noData = true;
						return false;
					}
					res.data.forEach(item => {
						let year = this.changeDate(this.changeTime(item.redeemTime)).year;
						let month = this.changeDate(this.changeTime(item.redeemTime)).month
						if (typeof this.commodity.commodityList[year + '-' + month] == "undefined") {
							this.commodity.commodityList[year + '-' + month] = {
								title: year + '年' + month + "月",
								data: []
							}
						}
						this.commodity.commodityList[year + '-' + month].data.push(item)
					})
				}).catch(error => {
					console.log("已兑换商品列表报错：：", error)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "/static/css/standard.scss";

	.banner-wrap {
		width: 100%;
		height: 280rpx;
		background: linear-gradient(to right, #FEFAE9 0%, #FCEFD0 100%);
	}

	.commodity-wrap {
		margin-top: -160rpx;
		padding: 20rpx;
		min-height: calc(100vh - 420rpx);
		background-color: #fff;
		border-radius: 20rpx;

		.banner-info-wrap {
			position: relative;

			.banner-back {
				position: absolute;
				top: -100rpx;
				width: 640rpx;
				height: 334rpx;
				left: 0;
				right: 0;
				margin: auto;
				background: url($imgSrc+"/image/5_1_back.png") no-repeat center / 100% 100%;
			}

			.banner-text {
				z-index: 2;
				position: absolute;
				top: 136rpx;
				padding: 0 40rpx;
				margin-top: 10rpx;
				font-size: 24rpx;
				color: #525252;
			}

			.exchange-total {
				font-size: 50rpx;
				color: #000;
				position: absolute;
				right: 0;
				top: 0;
				z-index: 2;
				line-height: 64rpx;

				.total-title {
					color: #696969;
					font-size: 24rpx;
					display: inline-block;
					line-height: 60rpx;
					vertical-align: text-bottom;
				}
			}
		}

		.commodity-list-wrap {
			margin-top: 260rpx;
			width: 100%;

			.commodity-list-content-wrap {
				border-bottom: 20rpx solid #F6F6F6;
				&:last-child{
					border-width: 0;
				}
				.item-title {
					padding: 30rpx 40rpx;
					overflow: hidden;
					margin-bottom: 40rpx;
					// background: linear-gradient(to right, #fff 0%, #FFF9E4 100%);
					border-radius: 12rpx;
					.month-title {
						color: #000000;
						font-size: 24rpx;
						float: left;
					}

					.month-total {
						color: #696969;
						font-size: 24rpx;
						float: right;
					}
				}

				.commodity-list {
					display: inline-block;
					width: calc(50% - 72rpx);
					vertical-align: top;
					margin-bottom: 40rpx;
					border-radius: 16rpx;

					&:nth-child(2n) {
						padding-left: 40rpx;
						margin-right: 32rpx;
					}

					&:nth-child(2n+1) {
						margin-left: 32rpx;
						padding-right: 40rpx;
					}

					.list-icon {
						width: calc(100% - 80rpx);
						height: calc(310rpx - 80rpx);
						padding: 40rpx;
						margin-bottom: 10rpx;
						background-color: #f1f4fb;
						border-radius: 16rpx;
					}

					.list-title {
						line-height: 40rpx;
						font-size: 28rpx;
						color: #575757;
					}

					.list-time {
						line-height: 28rpx;
						font-size: 20rpx;
						color: #575757;
						margin-bottom: 4rpx;
					}
				}
			}
		}
	}
</style>