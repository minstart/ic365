<template>
	<view class="banner-wrap">
		<page-head :title='pageHeadTitle' :isHide='true' :isBack='false' :isModule="false" :background="'transparent'"></page-head>
		<view class="user-info-wrap">
			<!-- <view class="head-pic"></view> -->
			<image class="head-pic" :src='userInfo.avatar || defaultHeadPic' @error="defaultHeadPicUrl" alt=""></image>
			<view class="user-info">
				<h3 class="name">{{userInfo.nickname}}同学</h3>
				<ul class="cumulative-list">
					<li class="list">
						<view class="icon" type="star"></view>
						<h4 class="number">{{userInfo.currencies.star||0}}</h4>
					</li>
					<li class="list">
						<view class="icon" type="stone"></view>
						<h4 class="number">{{userInfo.currencies.stone||0}}</h4>
					</li>
					<li class="list">
						<view class="icon" type="dust"></view>
						<h4 class="number">{{userInfo.currencies.dust||0}}</h4>
					</li>
				</ul>
			</view>
			<view class="btn-setUp" @click="jumpPage({url:''})"></view>
		</view>
		<view class="study-report-wrap">
			<!-- 设置跳转到详情页面 -->
			<view class="report-details" @click="jumpPage({url:'/pages/page/parent/parent_detail'})"></view>
			<view class="report-info-wrap">
				<view class="report-info">
					<h4 class="info-text">{{overallReport.studyMinutes}}小时</h4>
					<h4 class="info-rowth-rate" :state="growthRate.studyMinutes>0?'1':'2'">{{growthRate.studyMinutes}}%</h4>
				</view>
				<view class="report-info">
					<h4 class="info-text">{{overallReport.completedMissions}}/- </h4>
					<h4 class="info-rowth-rate" :state="growthRate.completedMissions>0?'1':'2'">{{growthRate.completedMissions}}%</h4>
				</view>
			</view>
			<view class="report-info-wrap">
				<view class="report-info">
					<h4 class="info-text">{{overallReport.questionCount}}题</h4>
					<h4 class="info-rowth-rate" :state="growthRate.questionCount>0?'1':'2'">{{growthRate.questionCount}}%</h4>
				</view>
				<view class="report-info">
					<h4 class="info-text">{{overallReport.correctRate}}</h4>
					<h4 class="info-rowth-rate" :state="growthRate.correctRate>0?'1':'2'">{{growthRate.correctRate}}%</h4>
				</view>
			</view>
			<view class="trend-title">
				<span>每日平均</span>
				<span class="info-rowth-rate" :state="dailyReport.fluctuation>0?'1':'2'">{{dailyReport.fluctuation}}%</span>
			</view>
			<view class="charts-box">
				<qiun-data-charts type="column" :opts="barChartOpts" :chartData="dailyReport" />
			</view>
		</view>
	</view>

	<view class="plan-recommend-wrap uni-padding-wrap">
		<view class="ability-analysis-wrap">
			<view class="item-title-wrap">
				<h3 class="item-title">最新成就</h3>
				<view class="item-more">
					<view class="text icon-more" @click="jumpPage({url:''})">详情</view>
				</view>
			</view>
			<view class="charts-box-wrap">
				<view class="charts-box">
					<qiun-data-charts type="radar" :opts="RadarChartOpts" :chartData="radarChart" />
				</view>
				<view class="statistics-wrap" style="margin: 0 1.25rem;">
					<view class="statistics">
						<span class="icon-advantage">优势能力</span>
						<span>计算（92分）</span>
					</view>
					<view class="statistics">
						<span class="icon-improve">待提升能力</span>
						<span>空间想象（62分）</span>
					</view>
				</view>
			</view>

		</view>
		<view class="suggestion-wrap">
			<view class="item-title-wrap">
				<h3 class="item-title">提升建议</h3>
				<view class="item-more">
					<view class="text icon-more" @click="jumpPage({url:''})">全部</view>
				</view>
			</view>
			<view class="no-list-tip" v-if="suggestionImproveOther.categories.length==0">暂无数据</view>
			<ul class="suggestion-list-wrap">
				<li class="suggestion-list" v-for="item in suggestionImproveOther.categories">
					<image class="item-icon" src=""></image>
					<view class="item-info">
						<h3 class="info-title">{{item.name}}</h3>
						<view class="info-text">正确率：{{item.accuracy}}% | {{suggestionTetx(item.accuracy)}}</view>
						<button class="info-btn" @click="jumpPage({url:''})">{{item.btnTitle}}专项学习</button>
					</view>
				</li>
			</ul>
		</view>
		<view class="property-wrap">
			<!-- 学习资产 -->
			<view class="item-title-wrap">
				<h3 class="item-title">学习资产</h3>
				<view class="item-more">
					<view class="text icon-more" @click="jumpPage({url:''})">兑换记录</view>
				</view>
			</view>
			<view class="property">
				<view class="property-item">
					<h3 class="item-info-num">358</h3>
					<view class="item-info-title">智慧星</view>
				</view>
				<view class="property-item">
					<h3 class="item-info-num">58</h3>
					<view class="item-info-title">启明石</view>
				</view>
				<view class="property-item">
					<h3 class="item-info-num">1256</h3>
					<view class="item-info-title">知识尘</view>
				</view>
			</view>
			<view class="statistics-wrap">
				<view class="statistics">
					<span>本周获取</span>
					<span>{{suggestionImproveOther.currencies._newlyAdded.text}}</span>
				</view>
				<view class="statistics">
					<span>可兑换{{suggestionImproveOther.currencies.exchanges.name}}</span>
					<span>{{suggestionImproveOther.currencies.exchanges.quantity}}个</span>
				</view>
			</view>
		</view>
		<view class="information-wrap">
			<view class="item-title-wrap">
				<h3 class="item-title">系统资讯</h3>
				<view class="item-more">
					<view class="text icon-more" @click="jumpPage({url:''})">更多</view>
				</view>
			</view>
			<ul class="information-list-wrap">
				<li class="information-list" v-for="item in information" @click="jumpPage({url:''})">
					<image class="list-icon" src="" mode=""></image>
					<view class="list-info">
						<h3 class="title">{{item.title}}</h3>
						<view class="introduce">{{item.introduce}}</view>
					</view>
				</li>
			</ul>
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
				defaultHeadPic: store.state.defaultHeadPic, //默认头像

				overallReport: {}, //整体报告
				growthRate: {}, //对比上周涨幅

				dailyReport: {}, //每日数据(柱状图数据)
				// 柱状图设置
				barChartOpts: {
					color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4",
						"#ea7ccc"
					],
					padding: [30, 15, 10, 5],
					enableScroll: false,
					legend: {
						show: false
					},
					xAxis: {
						disableGrid: true,
						// disabled:true
					},
					yAxis: {
						disabled: true,
						disableGrid: true,
						data: [{
							min: 0
						}]
					},
					extra: {
						column: {
							type: "group",
							width: 23,
							activeBgColor: "#000000",
							activeBgOpacity: 0.08,
							barBorderCircle: true
						}
					}
				},
				// 雷达图数据
				radarChart: {},
				// 雷达图设置
				RadarChartOpts: {
					legend: {
						position: 'bottom'
					},
					extra: {
						radar: {
							border: true,
							radius: uni.getSystemInfoSync().windowWidth * 0.3
						}
					},

				},

				// 建议提升和其他
				suggestionImproveOther: {},
				// 家长页面统计
				parent: {},

				suggestion: [{
						icon: "",
						title: "",
						accuracy: "65",
						suggestion: "建议练习",
						btnTitle: "专项学习"
					},
					{
						icon: "",
						title: "",
						accuracy: "72",
						suggestion: "概念巩固",
						btnTitle: "图形面积计算"
					},
				],
				// 系统资讯
				information: [{
						icon: "",
						title: "限时福利",
						introduce: "完成3天打卡领取圣诞礼包",
						id: ""
					},
					{
						icon: "",
						title: "会员免费体验",
						introduce: "7天VIP会员显示领取",
						id: ""
					},
					{
						icon: "",
						title: "限时福利",
						introduce: "完成3天打卡领取圣诞礼包",
						id: ""
					}
				]
			}
		},
		onLoad() {

		},
		onReady() {
			this.verifLogin().then(data => {
				// 获取家长版报告数据(统计图)
				this.commonRequest({
					url: "/api/report/parent"
				}).then(res => {
					if (res.code == 0) {
						console.log("获取家长版报告数据(统计图)：", res)
						try {
							this.overallReport = res.data.overallReport;
							this.growthRate = res.data.growthRate;
							this.dailyReport = res.data.dailyReport;
							this.radarChart = res.data.radarChart || {};
						} catch (e) {}
						this.parent = res.data;
					} else {
						uni.showToast({
							title: res.message || "获取家长版报告数据(统计图)失败!",
							icon: "none"
						});
					}
				}).catch(error => {
					this.consoleLog("获取家长版报告数据(统计图)失败：：", error)
				})

				// 获取提升建议和其他
				this.commonRequest({
					url: "/api/report/getAdviceAndCurrenciesAndPublish"
				}).then(res => {
					if (res.code == 0) {
						console.log("获取提升建议和其他：", res)
						try {
							let _currencies = {};

							//处理后端返回的数据拼凑成前端简易展示数据 ------------Start
							res.data.currencies.current.forEach(item => {
								item.type == 1 && (_currencies.star = item.quantity)
								item.type == 2 && (_currencies.stone = item.quantity)
								item.type == 3 && (_currencies.dust = item.quantity)
							})
							store.state.userInfo.info.currencies = _currencies;
							this.userInfo = {
								...this.userInfo,
								...store.state.userInfo.info
							}
							res.data.currencies._current = _currencies;
							let addCurrencies = [];
							res.data.currencies.newlyAdded.forEach(item => {
								addCurrencies.push((item.quantity > 0 ? "+" + item.quantity : item.quantity) + item.name)
							})
							res.data.currencies._newlyAdded = {
								text: addCurrencies.join("，")
							}
							//处理后端返回的数据拼凑成前端简易展示数据 ------------End
							this.suggestionImproveOther = res.data
						} catch (e) {}
					} else {
						uni.showToast({
							title: res.message || "获取提升建议和其他失败!",
							icon: "none"
						});
					}
				}).catch(error => {
					this.consoleLog("获取提升建议和其他失败：：", error)
				})

			}).catch(error => {
				this.consoleLog("没有登录：：", error)
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
		methods: {
			suggestionTetx(num) {
				if (num > 0 && num <= 50) {
					return "建议练习"
				} else if (num>50 && num<=80) {
					return "概念巩固"
				} else if (num>80 && num<=100) {
					return "继续提升"
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	.banner-wrap {
		border-radius: 0.6rem;
		padding: 1.25rem 0.75rem 0 0.75rem;
		padding-top: 1.5rem;
		margin-bottom: 2rem;

		.user-info-wrap {
			display: flex;
			margin-bottom: 1.6rem;
			position: relative;

			.head-pic {
				width: 3rem;
				height: 3rem;
				border-radius: 50%;
				background: #fff;
				overflow: hidden;
				margin-right: 0.5rem;
			}

			.user-info {
				.name {
					margin: 0.2rem 0;
				}

				.cumulative-list {
					overflow: hidden;

					.list {
						float: left;
						margin-right: 0.8rem;

						.icon {
							width: 0.75rem;
							height: 0.75rem;
							display: inline-block;
							margin-right: 0.56rem;

							&[type="star"] {
								background-image: url("/static/icons/star.png");
								background-repeat: no-repeat;
								background-position: center;
								background-size: 100% 100%;
							}

							&[type="stone"] {
								background-image: url("/static/icons/stone.png");
								background-repeat: no-repeat;
								background-position: center;
								background-size: 100% 100%;
							}

							&[type="dust"] {
								background-image: url("/static/icons/dust.png");
								background-repeat: no-repeat;
								background-position: center;
								background-size: 100% 100%;
							}

						}

						.number {
							display: inline-block;
							font-size: 0.875rem;
							color: #EB7D1E;
						}
					}
				}
			}

			.btn-setUp {
				position: absolute;
				top: 0.9rem;
				right: 0.5rem;
				margin: auto;
				width: 1.25rem;
				height: 1.25rem;
				background: url("/static/icons/setUp.png") no-repeat top / 100% 100%;
			}
		}
	}

	// 学习报告 ------Start
	.study-report-wrap {
		width: 100%;
		height: 34.75rem;
		background: url("/static/image/4_banner_background.png") no-repeat center / 100% 100%;
		position: relative;

		.report-details {
			width: 5.1875rem;
			height: 1.375rem;
			position: absolute;
			top: 0.625rem;
			right: 0.875rem;
		}

		.report-info-wrap {
			display: flex;
			line-height: 1.75rem;

			.report-info {
				flex: 1;

				.info-text {
					float: left;
					font-size: 1.25rem;
				}

				.info-rowth-rate {
					float: right;
					font-size: 0.93rem;

					&[state="1"] {
						color: #79D183;
						padding-left: 0.6rem;
						background: url("/static/icons/rise-green.png") no-repeat left / 0.5rem 0.75rem;
					}

					&[state="2"] {
						color: #F9626D;
						padding-left: 0.6rem;
						background: url("/static/icons/decline-red.png") no-repeat left / 0.5rem 0.75rem;
					}
				}

				&:nth-child(1) {
					margin-right: 0.6875rem;

					.info-rowth-rate {
						margin-right: 0.625rem;
					}
				}

				&:nth-child(2) {
					.info-text {
						margin-left: 0.625rem;
					}
				}
			}

			&:nth-child(2) {
				padding-top: 6.9375rem;
				margin: 2rem;
			}

			&:nth-child(3) {
				padding-top: 2.5rem;
				margin: 2rem;
			}
		}

		.trend-title {
			color: #5893F3;
			font-size: 1rem;
			float: right;
			margin-right: 1.31rem;
			margin-top: 1rem;

			span {
				display: inline-block;

				&:nth-child(1) {
					margin-right: 0.375rem;
				}

				&:nth-child(2) {
					font-weight: 700;

					&[state="1"] {
						color: #5893F3;
						padding-left: 0.6rem;
						background: url("/static/icons/rise-blue.png") no-repeat left / 0.5rem 0.75rem;
					}

					&[state="2"] {
						color: #F9626D;
						padding-left: 0.6rem;
						background: url("/static/icons/decline-red.png") no-repeat left / 0.5rem 0.75rem;
					}
				}
			}
		}

		.charts-box {
			width: 18.815rem;
			bottom: 1.5rem;
			position: absolute;
			left: 0.5rem;
			right: 0;
			margin: 0 auto;
			height: 13.375rem;
		}
	}

	// 学习报告  ------End

	// 能力分析 ------Start
	.ability-analysis-wrap {
		.charts-box-wrap {
			margin: 1.125rem 0 2rem 0;
			padding-bottom: 1rem;
			background: url("/static/image/4_ability_analysis_back.png") no-repeat top / 100% 100%;

			.charts-box {
				padding: 1rem 0;
				height: 20.375rem;
			}

		}
	}

	.statistics-wrap {
		background: #F9F9F9;
		font-size: 1rem;
		color: #333333;

		.statistics {
			overflow: hidden;
			padding: 0 0.2rem 0 0.65rem;
			line-height: 3.375rem;

			span {
				&:nth-child(1) {
					float: left;
				}

				&:nth-child(2) {
					float: right;
				}
			}

			&:nth-child(1) {
				span {
					&:nth-child(1) {
						margin-left: 0.2rem;
					}

					&:nth-child(2) {
						color: #79D183;
					}
				}
			}

			&:nth-child(2) {
				span {
					&:nth-child(1) {
						margin-left: 0.2rem;
					}

					&:nth-child(2) {
						color: #F9626D;
					}
				}
			}
		}

		.icon-advantage {
			padding-left: 1.4rem;
			background: url("/static/icons/advantage.png") no-repeat left / 0.875rem 1rem;
		}

		.icon-improve {
			padding-left: 1.4rem;
			background: url("/static/icons/improve.png") no-repeat left / 0.875rem 1rem;
		}
	}

	// 能力分析  ------End

	// 提升建议 ------Start
	.suggestion-wrap {
		.suggestion-list-wrap {
			.suggestion-list {
				margin: 0.6878rem 0 1.3756rem 0;
				overflow: hidden;
				display: flex;

				.item-icon {
					margin-right: 1.125rem;
					width: 6.75rem;
					height: 6.75rem;
					background: #F2F8FD;
					border-radius: 0.5rem;
				}

				.item-info {
					flex: 1;
					padding-top: 0.3rem;
					text-align: left;

					.info-title {
						font-size: 1.125rem;
						line-height: 1.56rem;
					}

					.info-text {
						color: #999999;
						font-size: 0.875rem;
						margin: 0.2rem 0 0.875rem 0;
					}

					.info-btn {
						line-height: 2rem;
						font-size: 1rem;
						color: #fff;
						margin: 0;
						border-radius: 1rem;
						background: #79D183 !important;
						width: fit-content;
					}
				}
			}
		}
	}

	// 提升建议 ------End

	// 学习资料 ------Start
	.property-wrap {
		.property {
			display: flex;
			margin-bottom: 1.25rem;

			.property-item {
				flex: 1;
				padding-top: 4rem;
				margin-right: 0.68rem;
				height: 3.5rem;
				text-align: center;

				&:nth-child(1) {
					background: url("/static/image/4_property_item1.png") no-repeat center / 100% 100%;
				}

				&:nth-child(2) {
					background: url("/static/image/4_property_item2.png") no-repeat center / 100% 100%;
				}

				&:nth-child(3) {
					background: url("/static/image/4_property_item3.png") no-repeat center / 100% 100%;
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
	}

	// 学习资料 ------End

	// 系统资讯 ------Start
	.information-wrap {
		.information-list-wrap {
			.information-list {
				background: #F9F9F9;
				border-bottom: 0.16rem solid #F6F6F6;
				display: flex;
				padding: 1.375rem 1.125rem;

				.list-icon {
					width: 2.25em;
					height: 2.25em;
					display: inline-block;
					margin-right: 0.625rem;
					background: #ccc;
					border-radius: 0.2rem;
				}

				.list-info {
					flex: 1;
					display: inline-block;
					background: url("/static/icons/next.png") no-repeat right / 0.5rem 0.85rem;

					.title {
						font-size: 1.125rem;
						line-height: 1;
						margin-bottom: 0.2rem;
					}

					.introduce {
						color: #999;
						font-size: 0.875rem;
					}
				}
			}
		}
	}

	// 系统资讯 ------End
</style>