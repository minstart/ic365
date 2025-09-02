<!-- 兑换记录详情 -->
<template>
	<!-- <view class="page-loading" v-if="pageMask"></view> -->
	<page-head :title='pageHeadTitle' :isBack='true' :background="'#fff'"></page-head>
	<view class="uni-padding-wrap">
		<view class="details-wrap">
			<view class="details-info">
				<image class="info-img" :src="exchangeData.icon"></image>
				<h3 class="info-text">{{exchangeData.productName}}</h3>
			</view>
			<view class="currency-list-wrap">
				<view class="currency-list" :type="exchangeData.payCurrencyType">
					<image class="currency-icon" :src="rewardIcon(exchangeData.payCurrencyType).icon4"></image>
					<view class="currency-name">{{exchangeData.payCurrencyTypeName}} X{{exchangeData.quantity}}</view>
				</view>
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
				exchangeData: {}
			}
		},
		onLoad(options) {
			console.log(options)
			for(var i in options){
				let item = options[i]
				options[i] = decodeURIComponent(item)
			}
			console.log(options)
			options && (this.exchangeData = options)
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

		}
	}
</script>

<style lang="scss" scoped>
	@import "/static/css/standard.scss";

	.details-wrap {
		height: calc(100vh - 88rpx);
		background: linear-gradient(#FFF4CF 0%, #FFF4CF 50%, $background 100%);

		.details-info {
			text-align: center;
			padding-top: 42rpx;

			.info-img {
				width: 208rpx;
				height: 212rpx;
				margin-bottom: 16rpx;
				padding: 20rpx;
				background-color: #f1f4fb;
			}
		}

		.currency-list-wrap {
			padding: 40rpx;
			background-color: #fff;
			margin: 60rpx 40rpx;

			.currency-list {
				display: flex;

				.currency-icon {
					width: 136rpx;
					height: 136rpx;
					margin-right: 40rpx;
				}

				.currency-name {
					color: #000;
					font-size: 30rpx;
					line-height: 136rpx;
					font-weight: 500;
				}
			}
		}
	}
</style>