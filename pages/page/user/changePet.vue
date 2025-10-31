<template>
	<!-- <view class="page-loading" v-if="pageMask"></view> -->
	<view class="wrap uni-padding-wrap">
		<page-head ref="pageHead" :title='pageHeadTitle' :isBack='true' :background="'transparent'"></page-head>
		<view class="banner-back"></view>
		<view class="banner-back2"></view>
		<view class="content-wrap">
			<view class="border-left"></view>
			<view class="border-right"></view>
			<view class="border-bottom"></view>
			<scroll-view class="tab-content-wrap" scroll-y="true" :style="'max-height: calc(100vh - 340rpx - '+$store.state.taskbarHeight+');'">
				<view class="no-list-tip" v-if="productsList.list.length==0">暂无数据</view>
				<view class="tab-list-wrap">
					<view class="tab-list" v-for="item in productsList.list">
						<view class="list-pet-wrap">
							<image class="pet-icon" :src="item.icon"></image>
							<h3 class="title">{{item.productName}}</h3>
						</view>
						<view class="change-btn" :isSelect='item.using' @click.stop="changePet(item)">
							{{item.using?'使用中':'立即更换'}}
						</view>
					</view>
				</view>

				<!-- <view v-if="productsList['products' + item.id] && productsList['products' + item.id].list.length>0 && !productsList['products' + item.id].noData && !isLoading" class="get-more-btn" @click="getProducts()"></view> -->
				<view class="no-list-tip" v-if="productsList.list.length>0 && productsList.noData">- 没有更多了 -</view>
			</scroll-view>
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
				productsList: {
					page: 0, //默认页码（请求前会+1）
					noData: false, //是否后续没数据了
					list: [] //请求的列表合集
				}
			}
		},
		onLoad() {

		},
		onReady() {
			store.state.taskbarHeight = uni.getSystemInfoSync().statusBarHeight * 2 + "rpx"
		},
		onShow() {
			this.pageOnShowSet({
				uniHide: "all"
			}).then(res => {
				this.getProductsDetail()
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
			getProductsDetail(data) {
				let number = 10; //一次加载多少条数据
				let page = Number(this.productsList.page) + 1;
				let postData = {
					page: page,
					type: 2,
					size: number.toString()
				}
				this.isLoading = true;
				console.log("请求参数：", postData)
				// 获取兑换商品列表
				this.commonRequest({
					url: "/api/exchange/obtained-products-with-group-types",
					data: postData
				}).then(res => {
					this.isLoading = false;
					if (res.data.obtainedProducts.length == 0) {
						this.productsList.noData = true;
						return false;
					} else if (res.data.obtainedProducts.length != number) {
						this.productsList.noData = true;
					}
					// console.log("search:",this.keyword,",groupType:",this.selectProductsId)
					console.log("获取兑换商品列表:", res.data.obtainedProducts)
					this.productsList.requested = true;
					this.productsList.page = (this.productsList.page ? this.productsList.page : 0) + 1;
					this.productsList.list = this.productsList.list.concat(res.data.obtainedProducts);
					console.log(this.productsList)

				}).catch(error => {
					console.log("获取兑换商品列表报错：：", error)
				})
			},
			changePet(item) {
				console.log(item)
				if (!item.using) {
					this.commonRequest({
						url: "/api/user/change-show-currency",
						data: {
							currencyId: item.productCurrencyType
						}
					}).then(res => {
						console.log(res)
						uni.showToast({
							title: '更换成功',
							icon: 'success',
							duration: 1500
						})
						this.productsList.list.forEach((item, i) => {
							this.productsList.list[i].using = false;
						})
						for (let i in this.productsList.list) {
							try {
								if (this.productsList.list[i].productCurrencyType == item.productCurrencyType) {
									this.productsList.list[i].using = true;
									break;
								}
							} catch (e) {}
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "/static/css/standard.scss";
	.wrap {
		position: relative;
		height: 100vh;
		background: linear-gradient(#FFD269 0%, #FFD269 40%, #F4F4F4 100%);
		overflow: hidden;

		.banner-back {
			position: relative;
			width: 636rpx;
			height: 260rpx;
			z-index: 0;
			margin: 0 auto;
			margin-top: -80rpx;
			background: url($imgSrc+"/image/change_pet_banner.png") no-repeat center / 100% 100%;
			z-index: 2;
		}

		.banner-back2 {
			position: absolute;
			top: 0;
			width: 734rpx;
			height: 446rpx;
			z-index: 0;
			background: url($imgSrc+"/image/change_pet_back.png") no-repeat top / 100% 100%;
			z-index: 1;
		}

		.content-wrap {
			position: relative;
			border-radius: 0 0 16rpx 16rpx;
			overflow: hidden;
			background: #fff;
			padding: 0 38rpx 20rpx 38rpx;
			z-index: 2;

			.border-left {
				top: 0;
				position: absolute;
				left: 0;
				height: 100%;
				width: 20rpx;
				background: url($imgSrc+'/image/change_pet_border.png');
				z-index: 3;
			}

			.border-right {
				top: 0;
				position: absolute;
				right: 0;
				height: 100%;
				width: 20rpx;
				background: url($imgSrc+'/image/change_pet_border.png');
				z-index: 3;
			}

			.border-bottom {
				position: absolute;
				bottom: 0;
				height: 20rpx;
				width: 100%;
				background: url($imgSrc+'/image/change_pet_border2.png');
				z-index: 3;
			}

			.tab-content-wrap {
				position: relative;
				padding-top: 50rpx;
				left: 0;
				background: #fff;
				z-index: 2;

				.tab-list-wrap {
					width: 100%;

					.tab-list {
						float: left;
						width: calc(50% - 74rpx);
						margin-bottom: 60rpx;

						.list-pet-wrap {
							position: relative;
							height: 310rpx;
							border-radius: 20rpx;

							.pet-icon {
								width: 5.5rem;
								height: 6.75rem;
								margin-right: 0.75rem;
								overflow: hidden;
								position: absolute;
								top: 0;
								left: 0;
								right: 0;
								bottom: 30rpx;
								margin: auto;
							}

							.title {
								position: absolute;
								width: 100%;
								text-align: center;
								right: 0;
								bottom: 10rpx;
								font-size: 28rpx;
								color: #000;
							}
						}

						.change-btn {
							width: 140rpx;
							height: 40rpx;
							line-height: 40rpx;
							font-size: 24rpx;
							color: #fff;
							margin: 0 auto;
							margin-top: 26rpx;
							text-align: center;
							border-radius: 40rpx;

							&[isSelect='true'] {
								background: #FF811E;
							}

							&[isSelect='false'] {
								background: #FFD150;
								color: #000;
							}
						}

						&:nth-child(2n+1) {
							.list-pet-wrap {
								background: #f2f8fd;
							}

							margin-left: 44rpx;
							margin-right: 30rpx;
						}

						&:nth-child(2n) {
							.list-pet-wrap {
								background: #fef9e8;
							}

							margin-left: 30rpx;
							margin-right: 44rpx;
						}
					}
				}
			}
		}
	}
</style>