<!-- 成就中心 -->
<template>
	<!-- <view class="page-loading" v-if="pageMask"></view> -->
	<view class="page-wrap">
		<page-head ref="pageHead" :title='pageHeadTitle' :isBack='true' :background="'#ECEFFF'"></page-head>
		<view class="uni-padding-wrap">
			<view class="achievement-statistics-wrap ">
				<view class="achievement-statistics">
					<view class="achievement-progress-wrap">
						<view class="progress-icon" :style="'left:'+progress.obtainedCount/progress.totalCount*100+'%'"></view>
						<view class="progress-wrap">
							<progress :percent="progress.obtainedCount/progress.totalCount*100" activeColor="#9F60FF" backgroundColor="#EFEFEF" stroke-width="10" />
						</view>
					</view>
					<h3 class="achievement-title">成就等级</h3>
					<h3 class="statistics">{{progress.obtainedCount}}/{{progress.totalCount}} 完成</h3>
					<ul class="progress-list-wrap">
						<li class="progress-list" v-for="(item,i) in progress.list" :style="'margin-top:'+ -i * 0.6 + 'rem'">
							<i>{{item}}个</i>
						</li>
					</ul>
				</view>

			</view>
			<!-- 搜索相关 -->
			<view class="search-wrap">
				<view class="search-btn-wrap">
					<input class="search-input" type="text" v-model="keyword" placeholder="搜索成就名称" />
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
					<scroll-view class="tab-content-wrap" scroll-y="true" @scrolltolower="getProducts()" :style="'max-height: calc(100vh - 960rpx - '+$store.state.taskbarHeight+');'">
						<view class="table-list-wrap" v-for="(item,i) in productsTab" :current='current' v-show='current == i'>
							<view class="item-title-wrap">
								<h3 class="item-title">{{item.name}}</h3>
							</view>
							<view class="no-list-tip" v-if="productsList['products' + item.id] && productsList['products' + item.id].list.length==0">暂无数据</view>
							<view class="tab-list" v-for="item2 in productsList['products' + item.id].list">
								<div class="list-icon-wrap flex-center">
									<image lazy-load class="list-icon" :src="item2.imgPath" mode=""></image>
								</div>
								<view class="list-info">
									<h3 class="info-title">{{item2.name}}</h3>
									<view class="info-subtitle">{{item2.subtitle}}</view>
									<view class="achievement-type">
										<h3 class="type" :typeId="item2.type">
											<view class="icon"></view>
											<view class="text">{{item2.typeName}}成就</view>
										</h3>
									</view>
									<view class="time">{{item2.obtainTimeUnix ? changeDate(item2.obtainTimeUnix*1000).fullDate + " 获得": ""}}</view>
								</view>
							</view>
							<!-- <view v-if="productsList['products' + item.id] && productsList['products' + item.id].list.length>0 && !productsList['products' + item.id].noData && !isLoading" class="get-more-btn" @click="getProducts()"></view> -->
							<view class="no-list-tip" v-if="productsList['products' + item.id] && productsList['products' + item.id].list.length>0 && productsList['products' + item.id].noData">- 没有更多了 -</view>
						</view>
					</scroll-view>
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
				progress: {},
				current: 0,
				pageHeadTitle: "成就中心",
				keyword: "",
				current: 0,
				selectProductsId: "",
				productsTab: [],
				productsList: {},
				option: {},
				isLoading: false
			}
		},
		onLoad(option) {
			option && (this.option = option);
			if (option && option.tabId) {
				this.selectProductsId = option.tabId;
				this.current = 1
			}
			this.verifLogin().then(data => {
				// 兑换资源类型(Tab)
				this.commonRequest({
					url: "/api/achievement/group-types"
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
					this.getProducts({
						reset: true
					})
				}).catch(error => {
					console.log("兑换资源类型(Tab)报错：：", error)
				})
			})
		},
		onReady() {
			store.state.taskbarHeight = uni.getSystemInfoSync().statusBarHeight * 2 + "rpx"
		},
		onShow() {
			this.pageOnShowSet({
				uniHide: "all"
			}).then(res => {
				console.log("this.selectProductsId:", this.selectProductsId)
				if (this.selectProductsId) {
					this.getProducts({
						reset: true
					})
				}
				// 成就统计
				this.commonRequest({
					url: "/api/achievement/stats"
				}).then(res => {
					console.log("成就统计:", res.data)
					this.progress = res.data
					this.progress.list = [];
					this.progress.list.push(res.data.groupTypeCounts["铜质"] || 0)
					this.progress.list.push(res.data.groupTypeCounts["银质"] || 0)
					this.progress.list.push(res.data.groupTypeCounts["金质"] || 0)
					this.progress.list.push(res.data.groupTypeCounts["钻石"] || 0)
					this.progress.list.push(res.data.groupTypeCounts["稀有"] || 0)
				})
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
					this.getProducts({
						changeType: "tab"
					})
				}
			},
			// 获取商品
			getProducts(data) {
				if (data && data.reset) {
					this.productsTab.forEach(item => {
						this.productsList["products" + item.id] = {
							requested: false,
							page: 0,
							noData: false,
							list: []
						}
					})
				} else {
					if (this.productsList["products" + this.selectProductsId].noData) return false;
				}
				this.getProductsDetail(data)
			},
			getProductsDetail(data) {
				let number = 10; //一次加载多少条数据
				let page = Number(this.productsList["products" + this.selectProductsId].page)
				if (data && data.changeType) {
					// 如果是tab切换的
					if (data.changeType == "tab") {
						if (page == 0) {
							page = page + 1;
						} else {
							return false;
						}
					}
				} else {
					page = page + 1;
				}
				let postData = {
					search: this.keyword,
					page: page,
					groupType: this.selectProductsId,
					size: number.toString()
				}
				this.isLoading = true;
				console.log("请求参数：", postData)
				// 获取成就列表
				this.commonRequest({
					url: "/api/achievement/list",
					data: postData
				}).then(res => {
					this.isLoading = false;
					if (res.data.length == 0) {
						this.productsList["products" + this.selectProductsId].noData = true;
						return false;
					} else if (res.data.length != number) {
						this.productsList["products" + this.selectProductsId].noData = true;
					}
					// console.log("search:",this.keyword,",groupType:",this.selectProductsId)
					console.log("获取成就列表:", res.data)
					this.productsList["products" + this.selectProductsId].requested = true;
					this.productsList["products" + this.selectProductsId].page = (this.productsList["products" + this.selectProductsId].page ? this.productsList["products" + this.selectProductsId].page : 0) + 1;
					this.productsList["products" + this.selectProductsId].list = this.productsList["products" + this.selectProductsId].list.concat(res.data);
					console.log(this.productsList["products" + this.selectProductsId])
				}).catch(error => {
					console.log("获取成就列表报错：：", error)
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import "/static/css/standard.scss";

	.item-title-wrap {
		margin-top: 1rem;
	}

	.page-wrap {
		background: linear-gradient(#ECEFFF 0%, #F4F4F4 40%, #F4F4F4 100%);
		min-height: 100vh;
		padding-bottom: 0;
	}

	// 成就中心 ------Start
	.achievement-statistics-wrap {
		.achievement-statistics {
			min-height: 610rpx;
			background: url("/static/image/5_achievement_back.png") no-repeat top /100% 100%;
			position: relative;
			margin-top: 20rpx;

			.achievement-title {
				color: #fff;
				font-size: 40rpx;
				position: absolute;
				top: 60rpx;
				left: 1.25rem;
			}

			.statistics {
				position: absolute;
				top: 60rpx;
				right: 1.0625rem;
				font-size: 1rem;
			}

			.achievement-progress-wrap {
				position: absolute;
				margin: 180rpx 1.0625rem 0 1.0625rem;
				width: calc(100% - 2.125rem);

				.progress-icon {
					position: absolute;
					width: 1.875rem;
					height: 2rem;
					top: calc(-1rem + 5px);
					margin-left: -0.937rem;
					background: url("/static/icons/progress.png") no-repeat top / 100% 100%;
				}

				.progress-wrap {
					border-radius: 1rem;
					overflow: hidden;
				}
			}

			.progress-list-wrap {
				display: flex;
				width: calc(100% - 1.5rem);
				margin: 0 0.75rem;
				position: absolute;
				top: 520rpx;

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

	// 成就中心 ------End

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
				position: absolute;
				left: 0;
				width: 100%;

				.table-list-wrap {
					padding: 0 40rpx;

					.tab-list {
						display: flex;
						padding: 1rem;
						background-color: #fff;
						border-radius: 1rem;
						margin-bottom: 0.75rem;
						position: relative;

						.list-icon-wrap {
							height: 100%;
							float: left;
							margin: auto 0;
						}

						.list-icon {
							width: 176rpx;
							height: 176rpx;
							margin-right: 0.75rem;
							border-radius: 16rpx;
						}

						.list-info {
							flex: 1;

							.info-title {
								margin-top: 0.5rem;
								line-height: 1.56rem;
								font-size: 1.125rem;
							}

							.info-subtitle {
								color: #999;
								font-size: 0.875rem;
								margin: 0.125rem 0 20rpx 0;
							}

							.achievement-type {
								overflow: hidden;
								position: absolute;
								right: -60rpx;
								top: 0;
								.type {
									display: inline-block;
									margin-right: 1.25rem;
									padding: 0.375rem 0.5rem 0.375rem 0.5rem;
									font-size: 0.75rem;
									border-radius: 1rem;
									overflow: hidden;

									.icon {
										float: left;
										width: 40rpx;
										height: 40rpx;
										margin-right: 8rpx;
									}

									.text {
										display: inline-block;
										vertical-align: top;
										line-height: 1.25rem;
									}

									&[typeid="0"] {
										background-color: #FFE7DA;

										.icon {
											background: url("/static/icons/achievement_1.png") no-repeat top/ 100% 100%;
										}
									}

									&[typeid="1"] {
										background-color: #E9E9E9;

										.icon {
											background: url("/static/icons/achievement_2.png") no-repeat top/ 100% 100%;
										}
									}

									&[typeid="2"] {
										background-color: #FFF5E5;

										.icon {
											background: url("/static/icons/achievement_3.png") no-repeat top/ 100% 100%;
										}
									}

									&[typeid="3"] {
										background-color: #FFF7E2;

										.icon {
											background: url("/static/icons/achievement_4.png") no-repeat top/ 100% 100%;
										}
									}

									&[typeid="4"] {
										background-color: #EFFFE5;

										.icon {
											background: url("/static/icons/achievement_5.png") no-repeat top/ 100% 100%;
										}
									}
								}
							}

							.time {
								float: right;
								font-size: 0.68rem;
								color: #676767;
								vertical-align: bottom;
							}
						}
					}
				}
			}
		}
	}
</style>