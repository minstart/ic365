<!-- 商品详情 -->
<template>
	<!-- <view class="page-loading" v-if="pageMask"></view> -->
	<page-head ref="pageHead" :isBack='true' :background="'#fff'"></page-head>
	<view class="uni-padding-wrap">
		<view class="details-wrap">
			<view class="details-info">
				<h3 class="info-title">{{exchangeData.name||exchangeData.productName}}</h3>
				<h3 class="info-subTitle">{{exchangeData.subtitle}}</h3>
				<view class="info-img-wrap flex-center">
					<image class="info-img" :src="exchangeData.icon"></image>
				</view>
				<h3 class="info-text">{{exchangeData.description}}</h3>
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
				exchangeData: {}
			}
		},
		onLoad(options) {
			console.log(options)
			for (var i in options) {
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

	.uni-padding-wrap {
		padding-top: 40rpx;
		background: linear-gradient(#FFF4CF 0%, $background 100%);
	}

	.details-wrap {
		height: calc(100vh - 250rpx);

		.details-info {
			text-align: center;
			background: linear-gradient(#FFFCF1 0%, $background 100%);
			height: calc(100vh - 290rpx);
			border-radius: 6rpx;
			.info-title {
				font-size: 100rpx;
				color: #22538e;
				padding-top: 70rpx;
			}
			.info-subTitle {
				font-size: 40rpx;
				color: #0067e4;
				padding: 0 20rpx;
				text-align: center;
				margin: 0 auto;
				margin-bottom: 60rpx;
			}

			.info-img-wrap {
				width: 382rpx;
				height: 382rpx;
				border-radius: 40rpx;
				background-color: #fff;
				box-shadow: 0 0 12rpx #B9B9B9;
				margin: 0 auto;
				margin-bottom: 60rpx;
			}

			.info-img {
				width: 350rpx;
				height: 350rpx;
				background-color: #f1f4fb;
				border-radius: 40rpx;

			}

			.info-text {
				font-size: 40rpx;
				width: 480rpx;
				margin: 0 auto;
				text-align: center;
				line-height: 56rpx;
			}
		}

	}
</style>