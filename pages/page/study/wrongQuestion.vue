<template>
	<!-- 错题本 -->
	<!-- <view class="page-loading" v-if="pageMask"></view> -->
	<view class="page-wrap">
		<page-head :title='pageHeadTitle' :isBack='true' :background="'#FFEEE6'"></page-head>
		<view class="uni-padding-wrap">
			<view class="achievement-statistics-wrap ">
				<view class="achievement-statistics">
					<h3 class="achievement-title">错题统计</h3>
					<h3 class="statistics">共28道错题</h3>
					<view class="property">
						<view class="property-item">
							<h3 class="item-info-num">{{wrongRecordsCount.highFrequencyErrCount||0}}</h3>
							<view class="item-info-title">高频错题</view>
						</view>
						<view class="property-item">
							<h3 class="item-info-num">{{wrongRecordsCount.weeklyNewCount}}</h3>
							<view class="item-info-title">本周新增</view>
						</view>
						<view class="property-item">
							<h3 class="item-info-num">{{wrongRecordsCount.masteredCount}}</h3>
							<view class="item-info-title">已掌握</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 搜索相关 -->
			<view class="search-wrap">
				<view class="search-btn-wrap">
					<input class="search-input" type="text" v-model="keyword" placeholder="搜索知识点或题目" />
					<view class="search-btn" @click="getProducts({reset:true})">搜索</view>
				</view>
				<view class="search-content-wrap">
					<scroll-view class="tab-wrap search-tab-wrap" scroll-x="true" :scroll-into-view="tabID" :scroll-with-animation="true">
						<view :id="'tab-list-'+item.id" class="tab search-tab" :class="selectProductsId==item.id?'selected':''" v-for="(item,i) in productsTab" :current='i' @click="clickTab(item,i)">
							{{item.name}}
						</view>
					</scroll-view>
					<view class="tab-content-wrap">
						<view class="table-list-wrap" v-for="(item,i) in productsTab" :current='current' v-show='current == i'>
							<view class="no-list-tip" v-if="productsList['products' + item.id] && productsList['products' + item.id].list.length==0">暂无数据</view>
							<view class="tab-list" v-for="item2 in productsList['products' + item.id].list">
								<view class="topic-title-wrap">
									<h3 class="topic-title">{{item2.title}}</h3>
									<view class="topic-time">{{changeTime(item2.createTime,2)}}</view>
								</view>
								<view class="topic-wrap">
									<view class="topic">{{item2.topic}}</view>
									<view class="topic-answer-wrap">
										<view class="topic-answer">
											<view class="topic-answer-title">你的答案</view>
											<view class="answer">{{item2.userAnswer}}</view>
										</view>
										<view class="topic-answer">
											<view class="topic-answer-title">正确答案</view>
											<view class="answer">{{item2.correctAnswer}}</view>
										</view>
									</view>
									<view class="list-btn-wrap">
										<view class="list-btn" @click="similarExercises(item2)">同类练习</view>
										<view class="list-btn" @click="reAnswer(item2)">从新作答</view>
										<!-- <view class="list-btn" @click="print(item2)">打印</view> -->
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
				wrongRecordsCount: {},
				pageHeadTitle: "错题本",
				keyword: "",
				current: 0,
				selectProductsId: "",
				productsTab: [], //tab选项
				productsList: {}, //tab列表
				tabID: "", //选中的tabId
			}
		},
		onLoad(option) {
			option.categoryId && (this.selectProductsId = option.categoryId)
		},
		onReady() {

		},
		onShow() {
			this.pageOnShowSet({
				uniHide: "all"
			}).then(res => {
				this.verifLogin().then(data => {
					// 错题统计
					this.commonRequest({
						url: "/api/wrong-records/stats"
					}).then(res => {
						console.log("错题统计::", JSON.stringify(res))
						try {
							this.wrongRecordsCount = res.data;
						} catch (e) {}
					}).catch(error => {
						console.log("错题统计报错：：", error)
					})

					this.commonRequest({
						url: "/api/wrong-records/getCategories"
					}).then(res => {
						console.log("获取错题类目分组(Tab)::", res)
						for (let i in res.data) {
							try {
								!this.selectProductsId && (this.selectProductsId = i);
								this.productsTab.push({
									id: i,
									name: res.data[i],
									page: 1,
									noData:false
								})
								this.productsList["products" + i] = {
									requested: false,
									list: []
								}
							} catch (e) {}
						}
						let _that = this;
						setTimeout(() => {
							_that.tabID = "tab-list-" + _that.selectProductsId;
						}, 1000)
						this.getProducts()
					}).catch(error => {
						this.consoleLog("获取错题类目分组(Tab)报错：：", error)
					})
				})

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
			similarExercises(data) {
				this.jumpPage({
					url:"/pages/page/study/answerQuestions?pageType=question&categoryId"+data.categoryId
				})
				// // 同类练习
				// uni.showToast({
				// 	title: "同类练习" + data.recordId,
				// 	icon: "none"
				// })
			},
			reAnswer(data) {
				this.jumpPage({
					url:"/pages/page/study/answerQuestions?pageType=question&categoryId"+data.categoryId+"&keyword="+data.questionId
				})
				// 重新作答
				// uni.showToast({
				// 	title: "重新作答" + data.recordId,
				// 	icon: "none"
				// })
			},
			print(data) {
				// 打印
				uni.showToast({
					title: "打印" + data.recordId,
					icon: "none"
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
					// 错题列表
					this.commonRequest({
						url: "/api/wrong-records/getAll",
						data: {
							keyword: this.keyword,
							type: this.selectProductsId,
							size: "10"
						}
					}).then(res => {
						console.log("错题列表:", res)
						this.productsList["products" + this.selectProductsId].requested = true;
						this.productsList["products" + this.selectProductsId].list = [...this.productsList["products" + this.selectProductsId].list, ...res.data];
					}).catch(error => {
						this.consoleLog("错题列表报错：：", error)
					})
				}
			}

		}
	}
</script>

<style lang="scss" scoped>
	@import "/static/css/standard.scss";

	.page-wrap {
		background: linear-gradient(#FFEEE6 0%, #F4F4F4 40%, #F4F4F4 100%);
	}

	// 错题本 ------Start
	.achievement-statistics-wrap {
		.achievement-statistics {
			min-height: 14rem;
			background: url("/static/image/2_2_banner_back.png") no-repeat top /100%;
			position: relative;
			margin-top: 36rpx;

			.achievement-title {
				color: #fff;
				font-size: 1.25rem;
				position: absolute;
				top: 0.75rem;
				left: 1.25rem;
			}

			.statistics {
				position: absolute;
				top: 0.42rem;
				right: 1.0625rem;
				font-size: 1rem;
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

					&:nth-child(1) {
						.item-info-num {
							color: #b50f0f;
						}
					}

					&:nth-child(2) {
						.item-info-num {
							color: #0E00B0;
						}
					}

					&:nth-child(3) {
						margin-right: 0;

						.item-info-num {
							color: #417505;
						}
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

	// 错题本 ------End

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
			.search-tab-wrap {
				white-space: nowrap;
				width: 100%;
				height: 80rpx;
				.tab {
					padding: 0.56rem 0.56rem;
					margin-right: 0.625rem;
					border-radius: 1rem;
					background-color: #fff;
					font-size: 0.75rem;
					min-width: calc(3.75rem - 0.56rem * 2);
					text-align: center;
					display: inline-block;
					&:last-child {
						margin-right: 0;
					}
				}

				.selected {
					background: #FFE084;
				}
			}

			.tab-content-wrap {
				.table-list-wrap {
					.tab-list {
						padding: 1rem;
						background-color: #fff;
						border-radius: 1rem;
						margin-bottom: 0.75rem;

						.topic-title-wrap {
							overflow: hidden;

							.topic-title {
								float: left;
								font-size: 0.75rem;
								color: #222;
							}

							.topic-time {
								float: right;
								font-size: 0.625rem;
								color: #676767;
							}
						}

						.topic-wrap {
							.topic {
								padding: 0.75rem 0;
								color: #222;
								font-size: 0.81rem;
							}

							.topic-answer-wrap {
								.topic-answer {
									border-radius: 1rem;
									padding: 0.625rem;
									font-size: 0.81rem;
									line-height: 1.125rem;

									&:nth-child(1) {
										background: #FFF5F6;
										color: #7D000F;
										margin-bottom: 0.625rem;
									}

									&:nth-child(2) {
										background: #F3FFF3;
										color: #1C760D;
									}

									.topic-answer-title {
										font-size: 0.81rem;
										margin-bottom: 0.2rem;
									}
								}
							}

							.list-btn-wrap {
								display: flex;
								margin-top: 0.625rem;

								.list-btn {
									flex: 1;
									text-align: center;
									padding: 0.43rem;
									margin-right: 1.3rem;

									&:nth-child(1) {
										border: 0.1rem solid #ACE48C;
										background: #F1FFEE;
										border-radius: 1rem;
									}

									&:nth-child(2) {
										border: 0.1rem solid #6093FF;
										background: #6093FF;
										border-radius: 1rem;
										color: #fff;
									}

									&:nth-child(3) {
										border: 0.1rem solid #ACACAC;
										background: #F2F2F2;
										border-radius: 1rem;
									}

									&:last-child {
										margin-right: 0;
									}
								}
							}
						}
					}
				}
			}
		}
	}
</style>