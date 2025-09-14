<!-- 成就中心 -->
<template>
	<!-- <view class="page-loading" v-if="pageMask"></view> -->
	<view class="page-wrap">
		<page-head ref="pageHead" :title='pageHeadTitle' :isBack='true' :background="'#ECEFFF'"></page-head>
		<view class="uni-padding-wrap">
			<view class="achievement-statistics-wrap ">
				<view class="achievement-statistics">
					<view class="achievement-progress-wrap">
						<view class="progress-icon" :style="'left:50'+'%'"></view>
						<view class="progress-wrap">
							<progress percent="50" activeColor="#9F60FF" backgroundColor="#EFEFEF" stroke-width="10" />
						</view>
					</view>
					<h3 class="achievement-title">成就等级</h3>
					<h3 class="statistics">{{progress.obtainedCount}}/{{progress.totalCount}} 完成</h3>
					<ul class="progress-list-wrap">
						<li class="progress-list" v-for="(item,i) in progress.list" :style="'margin-top:'+ -i * 1.2 + 'rem'">
							<i>{{item}}</i>
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
					<view class="tab-content-wrap">
						<view class="table-list-wrap" v-for="(item,i) in productsTab" :current='current' v-show='current == i'>
							<view class="item-title-wrap">
								<h3 class="item-title">{{item.name}}</h3>
							</view>
							<view class="no-list-tip" v-if="productsList['products' + item.id] && productsList['products' + item.id].list.length==0">暂无数据</view>
							<scroll-view scroll-y="true" class="scroll-Y" @scrolltoupper="upper" @scrolltolower="lower" @scroll="scroll">
								<view class="tab-list" v-for="item2 in productsList['products' + item.id].list">
									<div class="list-icon-wrap flex-center">
										<image lazy-load class="list-icon" :src="item2.imgPath" mode=""></image>
									</div>
									<view class="list-info">
										<h3 class="info-title">{{item2.name}}</h3>
										<view class="info-subtitle">{{item2.subtitle}}</view>
										<view class="achievement-type">
											<h3 class="type" :typeId="item2.type">
												<image class="icon"></image>
												<view class="text">{{item2.typeName}}成就</view>
											</h3>
											<view class="time">{{changeDate(item2.obtainTimeUnix*1000).fullDate}}</view>
										</view>
									</view>
								</view>
							</scroll-view>
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
				progress: {},
				current: 0,
				pageHeadTitle: "成就中心",
				keyword: "",
				current: 0,
				selectProductsId: "",
				productsTab: [],
				productsList: {}
			}
		},
		onLoad() {
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
					this.getProducts()
				}).catch(error => {
					console.log("兑换资源类型(Tab)报错：：", error)
				})
			})
		},
		onReady() {},
		onShow() {
			this.pageOnShowSet({
				uniHide: "all"
			}).then(res => {
				console.log("this.selectProductsId:",this.selectProductsId)
				if(this.selectProductsId){
					this.getProducts()
				}
				// 成就统计
				this.commonRequest({
					url: "/api/achievement/stats"
				}).then(res => {
					console.log("成就统计:",res.data)
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
					this.getProducts()
				}
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
					// 获取成就列表
					this.commonRequest({
						url: "/api/achievement/list",
						data: {
							search: this.keyword,
							groupType: this.selectProductsId,
							size: "20"
						}
					}).then(res => {
						// console.log("search:",this.keyword,",groupType:",this.selectProductsId)
						console.log("获取成就列表:", res.data)
						this.productsList["products" + this.selectProductsId].requested = true;
						this.productsList["products" + this.selectProductsId].list = this.productsList["products" + this.selectProductsId].list.concat(res.data);
					}).catch(error => {
						console.log("获取成就列表报错：：", error)
					})
				}
			}
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
	}

	// 成就中心 ------Start
	.achievement-statistics-wrap {
		.achievement-statistics {
			min-height: 22.06rem;
			background: url("/static/image/5_achievement_back.png") no-repeat top /100%;
			position: relative;
			margin-top: 36rpx;

			.achievement-title {
				color: #fff;
				font-size: 1.25rem;
				position: absolute;
				top: 1.375rem;
				left: 1.25rem;
			}

			.achievement-progress-wrap {
				position: absolute;
				margin: 4.6875rem 1.0625rem 0 1.0625rem;
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

			.statistics {
				position: absolute;
				top: 1.25rem;
				right: 1.0625rem;
				font-size: 1rem;
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
				.table-list-wrap {
					.tab-list {
						display: flex;
						padding: 1rem;
						background-color: #fff;
						border-radius: 1rem;
						margin-bottom: 0.75rem;
						.list-icon-wrap{
							height: 100%;
							float: left;
							margin: auto 0;
						}
						.list-icon {
							width: 5.5rem;
							height: 5.5rem;
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
								margin: 0.125rem 0 1.125rem 0;
							}

							.achievement-type {
								overflow: hidden;
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

								.time {
									float: right;
									font-size: 0.68rem;
									color: #676767;
									vertical-align: bottom;
									margin-top: 1rem;
								}
							}
						}
					}
				}
			}
		}
	}
</style>