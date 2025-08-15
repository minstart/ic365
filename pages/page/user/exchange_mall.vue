<template>
	<!-- <view class="page-loading" v-if="pageMask"></view> -->
	<view class="page-wrap">
		<page-head :title='pageHeadTitle' :isBack='true' :background="'#FFF0DC'"></page-head>
		<view class="uni-padding-wrap">
			<view class="achievement-statistics-wrap ">
				<view class="item-title-wrap" style="margin:20rpx 0 16rpx 0;">
					<h3 class="item-title">兑换商城</h3>
				</view>
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
					<input class="search-input" type="text" v-model="search" placeholder="搜索商品名称" />
					<view class="search-btn">搜索</view>
				</view>
				<view class="tab-wrap search-content-wrap">
					<view class="tab-overflow-bar">
						<ul class="tab-wrap search-tab-wrap">
							<li class="tab search-tab" :class="tabSelected(i)" v-for="(item,i) in searchResult" :current='i' @click="clickTab(i)">
								{{item.name}}
							</li>
						</ul>
					</view>
					<view class="tab-content-wrap">
						<view class="table-list-wrap" v-for="(item,i) in searchResult" :current='current' v-show='current == i'>
							<view class="no-list-tip" v-if="searchResult[i].list && searchResult[i].list.length==0">暂无数据
							</view>
							<view class="item-title-wrap">
								<h3 class="item-title">{{item.name}}</h3>
								<view class="item-more">
									<view class="text" style="color:#F23E3E;font-weight: 700;">剩余2天</view>
								</view>
							</view>
							<view class="tab-list" v-for="item2 in searchResult[i].list">
								<image class="list-icon" :src="item2.coverImage" mode=""></image>
								<view class="list-info">
									<h3 class="info-title">{{item2.name}}</h3>
									<view class="info-subtitle">{{item2.subtitle}}</view>
									<view class="achievement-type">
										<view class="label" v-if="item2.payCurrencyTypeName">
											<image class="reward-reward-icon" :src="rewardIcon(item2.payCurrencyType)"></image>
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
				userInfo: {
					nickname: "",
					currencies: {

					}
				},
				search: "",
				current: 0,
				searchResultTab: [],
				searchResult: {}
			}
		},
		onLoad() {

		},
		onReady() {
			this.verifLogin().then(data => {
				if (store.state.userInfo.token && store.state.userInfo.info && store.state.userInfo.info.currencies) {
					this.userInfo = store.state.userInfo.info
				} else {
					// 获取用户信息
					this.commonRequest({
						url: "/api/student/info"
					}).then(res => {
						console.log("获取用户信息::", res)
						try {
							store.commit("Update_UserInfo", res.data)
							this.userInfo = res.data;
						} catch (e) {}

					}).catch(error => {
						this.consoleLog("获取用户信息报错：：", error)
					})
				}
				
				// 兑换资源类型(Tab)
				this.commonRequest({
					url: "/api/exchange/group-types"
				}).then(res => {
					console.log("兑换资源类型(Tab)::", res)
					for(let i in res.data){
						this.searchResultTab.push({
							
						})
					}
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
			clickTab(i) {
				if (this.current !== i) {
					this.current = i
				}
			},
			exchange(data) {
				// 同类练习
				uni.showToast({
					title: "兑换" + data.id,
					icon: "none"
				})
			}

		}
	}
</script>

<style lang="scss" scoped>
	@import "/static/css/standard.scss";

	.page-wrap {
		background: linear-gradient(#FFF0DC 0%, #F4F4F4 40%, #F4F4F4 100%);
	}

	.item-title-wrap {
		margin-top: 1rem;
	}

	// 成就中心 ------Start
	.achievement-statistics-wrap {
		.achievement-statistics {
			min-height: 14rem;
			background: url("/static/image/5_2_banner_back.png") no-repeat top /100%;
			position: relative;

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

						&:last-child {
							margin-bottom: 0;
						}

						.list-icon {
							width: 5.5rem;
							height: 6.75rem;
							margin-right: 0.75rem;
							background: #ccc;
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

								.label {
									float: left;
									line-height: 1.75rem;
									width: 6.25rem;
									text-align: center;
									background-color: #FFF3EC;
									color: #ff926b;
									font-size: 0.8125rem;
									border-radius: 0.5rem;

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
									border: 0.1rem solid #79D183;
									width: 4.25rem;
									line-height: 1.625rem;
									text-align: center;

									background-color: #79D183;
									font-size: 1rem;
									color: #fff;
									display: inline-block;
									padding: 0.31rem 0.81rem;
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