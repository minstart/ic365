<template>
	<view class="page-wrap">
		<page-head :title='pageHeadTitle' :isBack='true' :background="'#FFEEE6'"></page-head>
		<view class="uni-padding-wrap">
			<view class="achievement-statistics-wrap ">
				<view class="item-title-wrap" style="margin: 0.625rem 0 0.5rem 0;">
					<h3 class="item-title">错题本</h3>
				</view>
				<view class="achievement-statistics">
					<h3 class="achievement-title">错题统计</h3>
					<h3 class="statistics">共28道错题</h3>
					<view class="property">
						<view class="property-item">
							<h3 class="item-info-num">3</h3>
							<view class="item-info-title">高频错题</view>
						</view>
						<view class="property-item">
							<h3 class="item-info-num">12</h3>
							<view class="item-info-title">本周新增</view>
						</view>
						<view class="property-item">
							<h3 class="item-info-num">4</h3>
							<view class="item-info-title">已掌握</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 搜索相关 -->
			<view class="search-wrap">
				<view class="search-btn-wrap">
					<input class="search-input" type="text" v-model="search" placeholder="搜索知识点或题目" />
					<view class="search-btn">搜索</view>
				</view>
				<view class="tab-wrap search-content-wrap">
					<view class="tab-overflow-bar">
						<ul class="tab-wrap search-tab-wrap">
							<li class="tab search-tab" :class="tabSelected(i)" v-for="(item,i) in searchResult"
								:current='i' @click="clickTab(i)">
								{{item.name}}
							</li>
						</ul>
					</view>
					<view class="tab-content-wrap">
						<view class="table-list-wrap" v-for="(item,i) in searchResult" :current='current'
							v-show='current == i'>
							<view class="no-list-tip" v-if="searchResult[i].list && searchResult[i].list.length==0">暂无数据
							</view>
							<view class="tab-list" v-for="item2 in searchResult[i].list">
								<view class="topic-title-wrap">
									<h3 class="topic-title">{{item2.name}}</h3>
									<view class="topic-time">{{item2.time}}</view>
								</view>
								<view class="topic-wrap">
									<view class="topic">{{item2.topic}}</view>
									<view class="topic-answer-wrap">
										<view class="topic-answer">
											<view class="topic-answer-title">你的答案</view>
											<view class="answer">{{item2.myAnswer}}</view>
										</view>
										<view class="topic-answer">
											<view class="topic-answer-title">正确答案</view>
											<view class="answer">{{item2.correctAnswer}}</view>
										</view>
									</view>
									<view class="list-btn-wrap">
										<view class="list-btn" @click="similarExercises(item2)">同类练习</view>
										<view class="list-btn" @click="reAnswer(item2)">从新作答</view>
										<view class="list-btn" @click="print(item2)">打印</view>
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
				search: "",
				current: 0,
				searchResult: [{
						name: "数学",
						list: [{
								id:"1",
								name: "分数运算",
								topic: "小明有3/4块巧克力，吃了1/2，还剩多少块？",
								time: "2025.07.22",
								myAnswer: "1/4块",
								correctAnswer: "1/2块"
							},
							{
								id:"2",
								name: "图形面积",
								topic: "水水水水水水水水水水水水水水水水水水水顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶帆帆帆帆帆帆帆帆帆帆？",
								time: "2025.07.29",
								myAnswer: "？？？错误答案",
								correctAnswer: "！！！正确答案"
							},
						]
					},
					{
						name: "逻辑",
					},
					{
						name: "图形",
					},
					{
						name: "高频错题",
					},
					{
						name: "未复习",
					}
				]
			}
		},
		onLoad() {

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
			similarExercises(data){
				// 同类练习
				uni.showToast({
					title: "同类练习" + data.id,
					icon: "none"
				})
			},
			reAnswer(data){
				// 重新作答
				uni.showToast({
					title: "重新作答" + data.id,
					icon: "none"
				})
			},
			print(data){
				// 打印
				uni.showToast({
					title: "打印" + data.id,
					icon: "none"
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "/static/css/standard.scss";

	.page-wrap {
		background: linear-gradient(#FFEEE6 0%, #F4F4F4 40%, #F4F4F4 100%);
	}

	// 成就中心 ------Start
	.achievement-statistics-wrap {
		.achievement-statistics {
			min-height: 14rem;
			background: url("/static/image/2_2_banner_back.png") no-repeat top /100%;
			position: relative;

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
						&:last-child{
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
						padding: 1rem;
						background-color: #fff;
						border-radius: 1rem;
						margin-bottom: 0.75rem;
						.topic-title-wrap{
							overflow: hidden;
							.topic-title{
								float: left;
								font-size: 0.75rem;
								color: #222;
							}
							.topic-time{
								float: right;
								font-size: 0.625rem;
								color: #676767;
							}
						}
						.topic-wrap{
							.topic{
								padding: 0.75rem 0;
								color: #222;
								font-size: 0.81rem;
							}
							.topic-answer-wrap{
								.topic-answer{
									border-radius: 1rem;
									padding: 0.625rem;
									font-size: 0.81rem;
									line-height: 1.125rem;
									&:nth-child(1){
										background: #FFF5F6;
										color: #7D000F;
										margin-bottom: 0.625rem;
									}
									&:nth-child(2){
										background: #F3FFF3;
										color: #1C760D;
									}
									.topic-answer-title{
										font-size: 0.81rem;
										margin-bottom: 0.2rem;
									}
								}
							}
							.list-btn-wrap{
								display: flex;
								margin-top: 0.625rem;
								.list-btn{
									flex: 1;
									text-align: center;
									padding: 0.43rem;
									margin-right: 1.3rem;
									&:nth-child(1){
										border: 0.1rem solid #ACE48C;
										background: #F1FFEE;
										border-radius: 1rem;
									}
									&:nth-child(2){
										border: 0.1rem solid #6093FF;
										background: #6093FF;
										border-radius: 1rem;
										color: #fff;
									}
									&:nth-child(3){
										border: 0.1rem solid #ACACAC;
										background: #F2F2F2;
										border-radius: 1rem;
									}
									&:last-child{
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