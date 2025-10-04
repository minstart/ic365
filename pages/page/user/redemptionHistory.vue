<!-- 兑换记录 -->
<template>
	<!-- <view class="page-loading" v-if="pageMask"></view> -->
	<view class="page-wrap" style="padding-bottom: 0;">
		<page-head ref="pageHead" :title='pageHeadTitle' :isBack='true' :background="'#fff'"></page-head>
		<view class="uni-padding-wrap">
			<view class="banner-wrap">
				<h3 class="banner-title">兑换记录</h3>
				<h3 class="exchange-total">{{exchangeTotal}}</h3>
			</view>
			<view class="commodity-wrap">
				<scroll-view scroll-y="true" class="commodity-list-wrap" @scrolltolower="getCommodity">
					<view class="no-list-tip" v-if="commodity.commodityList && commodity.commodityList.length==0">暂无数据</view>
					<view class="commodity-list-content-wrap" v-for="(item,i) in commodity.commodityList">
						<view class="item-title">
							<h3 class="month-title">{{item.title}}</h3>
							<h3 class="month-total">{{commodity.statistics[i]}}</h3>
						</view>
						<view class="commodity-list" v-for="item2 in item.data" @click="jumpPage({url:'/pages/page/user/exchangeLogDetails?' + objectToQueryString(item2)})">
							<image class="list-icon" :src="item2.icon"></image>
							<h3 class="list-title">{{item2.productName}}</h3>
							<view class="list-time">兑换时间：{{this.changeTime(item2.redeemTime) || ''}}</view>
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
				exchangeTotal: "",
				commodity: {
					page: 0,
					noData: false,
					commodityList: {},
					statistics:{}
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
				console.log("获取月份兑换统计:",res.data)
				this.commodity.statistics = res.data;
			}).catch(error => {
				console.log("获取获取月份兑换统计报错：：", error)
			})
			
			this.getCommodity()
		},
		onReady() {

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
		height: 160rpx;
		background: url("/static/image/5_1_back.png") no-repeat center / 100% 100%;

		.banner-title {
			padding: 32rpx 0 0 30rpx;
			font-size: 44rpx;
		}

		.exchange-total {
			font-size: 50rpx;
			color: #000;
			// font-weight: 700;
			padding-left: 30rpx;
		}
	}

	.commodity-wrap {
		padding: 20rpx;
		min-height: calc(100vh - 420rpx);
		background-color: #F6F6F6;

		.commodity-list-wrap {
			height: calc(100vh - 480rpx);
			background: #fff;
			padding-top: 50rpx;
			width: calc(100%);

			.commodity-list-content-wrap {
				margin: 0 50rpx;

				.item-title {
					width: 100%;
					overflow: hidden;
					margin-bottom: 40rpx;

					.month-title {
						line-height: 46rpx;
						color: #4b4b4b;
						font-size: 30rpx;
						float: left;
					}

					.month-total {
						line-height: 46rpx;
						color: $ThemeColor;
						font-size: 46rpx;
						float: right;
					}
				}

				.commodity-list {
					display: inline-block;
					width: calc(50% - 34rpx);
					vertical-align: top;
					margin-bottom: 40rpx;

					&:nth-child(2n) {
						margin-right: 32rpx;
					}

					&:nth-child(2n+1) {
						margin-left: 32rpx;
					}

					.list-icon {
						width: calc(100% - 80rpx);
						height: calc(310rpx - 80rpx);
						padding: 40rpx;
						margin-bottom: 10rpx;
						background-color: #f1f4fb;
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