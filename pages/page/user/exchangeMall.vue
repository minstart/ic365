<template>
	<!-- <view class="page-loading" v-if="pageMask"></view> -->
	<view class="page-wrap">
		<page-head :title='pageHeadTitle' :isBack='true' :background="'#FFF0DC'"></page-head>
		<view class="uni-padding-wrap">
			<view class="achievement-statistics-wrap ">
				<view class="achievement-statistics">
					<h3 class="achievement-title">我的货币</h3>
					<view class="property">
						<view class="property-item">
							<h3 class="item-info-num">{{userInfo.currencies.star||0}}</h3>
							<view class="item-info-title">智慧星</view>
						</view>
						<view class="property-item">
							<h3 class="item-info-num">{{userInfo.currencies.stone||0}}</h3>
							<view class="item-info-title">启明石</view>
						</view>
						<view class="property-item">
							<h3 class="item-info-num">{{userInfo.currencies.dust||0}}</h3>
							<view class="item-info-title">知识尘</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 搜索相关 -->
			<view class="search-wrap">
				<view class="search-btn-wrap">
					<input class="search-input" type="text" v-model="keyword" placeholder="搜索商品名称" />
					<view class="search-btn" @click="getProducts({reset:true})">搜索</view>
				</view>
				<view class="tab-wrap search-content-wrap">
					<view class="tab-overflow-bar">
						<ul class="tab-wrap search-tab-wrap">
							<li class="tab search-tab" :class="tabSelected(i)" v-for="(item,i) in productsTab" :current='i' @click="clickTab(item,i)">
								{{item.name}}
							</li>
						</ul>
					</view>
					<view class="tab-content-wrap">
						<view class="table-list-wrap" v-for="(item,i) in productsTab" :current='current' v-show='current == i'>
							<view class="item-title-wrap">
								<h3 class="item-title">{{item.name}}</h3>
							</view>
							<view class="no-list-tip" v-if="productsList['products' + item.id] && productsList['products' + item.id].list.length==0">暂无数据</view>
							<view class="tab-list" v-for="item2 in productsList['products' + item.id].list">
								<image class="list-icon" :src="item2.icon" mode=""></image>
								<view class="list-info">
									<h3 class="info-title">{{item2.productName}}</h3>
									<view class="item-more" v-if="item2.endTime">
										<view class="text" style="color:#F23E3E;font-weight: 700;">剩余{{calculateDaysUntilDeadline(changeTime(item2.endTime))}}天</view>
									</view>
									<view class="info-subtitle">{{item2.subtitle}}</view>
									<view class="achievement-type">
										<view class="label" v-if="item2.payCurrencyTypeName">
											<image class="reward-reward-icon" :src="rewardIcon(item2.payCurrencyType).min"></image>
											<span>{{item2.quantity}}{{item2.payCurrencyTypeName}}</span>
										</view>
										<view class="exchange-btn" :class="item2.obtained&&'already-redeemed'" @click="() => exchange(item2)">{{!item2.obtained?'立即兑换':'已拥有'}}</view>
									</view>
								</view>
							</view>
						</view>
					</view>
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
				pageHeadTitle: "兑换商城",
				keyword: "",
				current: 0,
				selectProductsId: "",
				productsTab: [],
				productsList: {},
				option: {}
			}
		},
		onLoad(option) {
			option && (this.option = option);
			if (option.tabId) {
				this.selectProductsId = option.tabId;
				this.current = 1
			}
		},
		onReady() {
			this.verifLogin().then(data => {
				// 兑换资源类型(Tab)
				this.commonRequest({
					url: "/api/exchange/group-types"
				}).then(res => {
					console.log("兑换资源类型(Tab)::", res)
					for (let i in res.data) {
						try {
							!this.selectProductsId && (this.selectProductsId = i);
							this.productsTab.push({
								id: i,
								name: res.data[i],
								page: 1
							})
							this.productsList["products" + i] = {
								requested: false,
								list: []
							}
						} catch (e) {}
					}
					this.getProducts()
				}).catch(error => {
					this.consoleLog("兑换资源类型(Tab)报错：：", error)
				})
			})
		},
		onShow() {
			this.pageOnShowSet({
				uniHide: "all"
			})
		},
		onHide() {

		},
		created() {

		},
		mounted() {

		},
		computed: {
			tabSelected() {
				// 根据current的值返回选中状态的class
				return index => index === this.current ? 'selected' : '';
			},
		},
		methods: {
			clickTab(item, i) {
				if (this.current !== i) {
					this.selectProductsId = item.id;
					this.current = i;
					this.getProducts()
				}
			},
			exchange(data) {
				if (data.obtained) return console.log("已拥有：", data.productionId);
				// 兑换商品
				this.commonRequest({
					url: "/api/exchange/redeem",
					data: {
						productionId: data.productionId,
					}
				}).then(res => {
					// 点击兑换商品
					uni.showToast({
						title: res.msg || "兑换成功",
						icon: "success"
					})
					data.obtained = true;
					this.commonRequest({
						url: "/api/student/info"
					}).then(res => {
						console.log("获取用户信息::", res)
						try {
							store.commit("Update_UserInfo", res.data)
							this.userInfo = res.data;
						} catch (e) {}
					
					}).catch(error => {
						console.log("获取用户信息报错：：", error)
					})
				}).catch(error => {
					this.consoleLog("兑换商品报错：：", error)
				})

			},
			// 获取商品
			getProducts(data) {
				if (!this.selectProductsId) return;
				if (data && data.reset) {
					this.productsTab.forEach(item => {
						this.productsList["products" + item.id].requested = false;
						this.productsList["products" + item.id].list = [];
					})
				}
				if (!this.productsList["products" + this.selectProductsId].requested && this.productsList["products" + this.selectProductsId].list.length == 0) {
					console.log(this.keyword, this.selectProductsId)
					// 获取兑换商品列表
					this.commonRequest({
						url: "/api/exchange/products",
						method: "POST",
						data: {
							keyword: this.keyword,
							type: this.selectProductsId,
							size: "10"
						}
					}).then(res => {
						console.log("获取兑换商品列表:", res.data)
						this.productsList["products" + this.selectProductsId].requested = true;
						this.productsList["products" + this.selectProductsId].list = this.productsList["products" + this.selectProductsId].list.concat(res.data);
					}).catch(error => {
						this.consoleLog("获取兑换商品列表报错：：", error)
					})
				}
			}

		}
	}
</script>

<style lang="scss" scoped>
	@import "/static/css/standard.scss";

	.page-wrap {
		background: linear-gradient(#FFF0DC 0%, #F4F4F4 40%, #F4F4F4 100%);
		min-height: 100vh;
	}

	.item-title-wrap {
		margin-top: 1rem;
	}

	// 兑换商城 ------Start
	.achievement-statistics-wrap {
		.achievement-statistics {
			min-height: 14rem;
			background: url("/static/image/5_2_banner_back.png") no-repeat top /100%;
			position: relative;
			margin-top: 36rpx;

			.achievement-title {
				color: #fff;
				font-size: 1.25rem;
				position: absolute;
				top: 0.75rem;
				left: 1.25rem;
			}

			.property {
				display: flex;
				margin-bottom: 1.25rem;
				padding: 0 0.9375rem;
				padding-top: 4rem;

				.property-item {
					flex: 1;
					padding-top: 4rem;
					margin-right: 0.68rem;
					height: 3.5rem;
					text-align: center;

					&:nth-child(3) {
						margin-right: 0;
					}

					.item-info-num {
						font-size: 1.5rem;
						color: #222;
					}

					.item-info-title {
						font-size: 0.875rem;
						color: #999999;
					}
				}
			}


			.progress-list-wrap {
				display: flex;
				width: calc(100% - 1.5rem);
				margin: 0 0.75rem;
				position: absolute;
				top: 19rem;

				.progress-list {
					flex: 1;
					text-align: center;
					margin-right: 0.52rem;

					i {
						font-weight: 700;
						font-size: 1rem;
					}
				}
			}
		}
	}

	// 兑换商城 ------End

	// 搜索功能及搜索列表
	.search-wrap {
		margin: 1.25rem 0;

		.search-btn-wrap {
			position: relative;
			overflow: hidden;
			border-radius: 1rem;

			.search-input {
				padding: 0 4rem 0 0.875rem;
				background: #fff;
				line-height: 1.875rem;
				height: 1.875rem;
				font-size: 0.875rem;
			}

			.search-btn {
				position: absolute;
				top: 0;
				right: 0;
				background: $ThemeColor;
				line-height: 1.875rem;
				font-size: 0.875rem;
				padding: 0 0.875rem;
				border-radius: 1rem;
			}
		}

		.search-content-wrap {
			margin: 1.25rem 0;

			.tab-overflow-bar {
				.search-tab-wrap {
					.tab {
						padding: 0.56rem 0.56rem;
						margin-right: 0.625rem;
						border-radius: 1rem;
						background-color: #fff;
						font-size: 0.75rem;
						min-width: calc(3.75rem - 0.56rem * 2);
						text-align: center;

						&:last-child {
							margin-right: 0;
						}
					}

					.selected {
						background: #FFE084;
					}
				}
			}

			.tab-content-wrap {
				.table-list-wrap {
					.tab-list {
						display: flex;
						padding: 1rem;
						background-color: #fff;
						border-radius: 1rem;
						margin-bottom: 0.75rem;

						&:last-child {
							margin-bottom: 0;
						}

						.list-icon {
							width: 5.5rem;
							height: 6.75rem;
							margin-right: 0.75rem;
							// background: #ccc;
							border-radius: 20rpx;
							overflow: hidden;
						}

						.list-info {
							flex: 1;

							.info-title {
								margin-top: 0.5rem;
								line-height: 1.56rem;
								font-size: 36rpx;
							}

							.info-subtitle {
								color: #999;
								font-size: 28rpx;
								margin: 4rpx 0 30rpx 0;
							}

							.achievement-type {
								overflow: hidden;

								.label {
									float: left;
									line-height: 56rpx;
									width: 6.25rem;
									text-align: center;
									background-color: #FFF3EC;
									color: #ff926b;
									font-size: 0.8125rem;
									border-radius: 0.5rem;
									margin-top: 4rpx;

									.reward-reward-icon {
										width: 0.75rem;
										height: 0.75rem;
										display: inline-block;
										margin-right: 0.2rem;
									}

									span {
										display: inline-block;
										vertical-align: top;
									}
								}

								.exchange-btn {
									float: right;
									border-radius: 1rem;
									border: 2rpx solid #79D183;
									width: 4.25rem;
									line-height: 64rpx;
									text-align: center;
									background-color: #79D183;
									font-size: 32rpx;
									color: #fff;
									display: inline-block;
									padding: 0 36rpx;
									border-radius: 1rem;
								}

								.already-redeemed {
									background: #EEFFF0;
									color: #79D183;
									font-size: 1rem;
									border-radius: 1rem;
									border: 0.1rem solid #79D183;
								}
							}
						}
					}
				}
			}
		}
	}
</style>