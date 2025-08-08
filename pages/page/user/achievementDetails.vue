<template>
	<view class="page-wrap">
		<page-head :title='pageHeadTitle' :isBack='true' :background="'#F4F4F4'"></page-head>
		<view class="uni-padding-wrap">
			<view class="achievement-statistics-wrap ">
				<view class="item-title-wrap" style="margin: 0.625rem 0 0.5rem 0;">
					<h3 class="item-title">成就中心</h3>
				</view>
				<view class="achievement-statistics">
					<view class="achievement-progress-wrap">
						<view class="progress-icon" :style="'left:50'+'%'"></view>
						<view class="progress-wrap">
							<progress percent="50" activeColor="#9F60FF" backgroundColor="#EFEFEF" stroke-width="10" />
						</view>
					</view>
					<h3 class="achievement-title">成就等级</h3>
					<h3 class="statistics">10/24 完成</h3>
					<ul class="progress-list-wrap">
						<li class="progress-list" v-for="(item,i) in progress" :style="'margin-top:'+ -i * 1.2 + 'rem'">
							<i>{{item}}</i>
						</li>
					</ul>
				</view>

			</view>
			<!-- 搜索相关 -->
			<view class="search-wrap">
				<view class="search-btn-wrap">
					<input class="search-input" type="text" v-model="search" placeholder="搜索成就名称" />
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
							<view class="item-title-wrap">
								<h3 class="item-title">{{item.name}}</h3>
							</view>
							
							<view class="no-list-tip" v-if="searchResult[i].list && searchResult[i].list.length==0">暂无数据</view>
							<view class="tab-list" v-for="item2 in searchResult[i].list">
								<image class="list-icon" :src="item2.coverImage" mode=""></image>
								<view class="list-info">
									<h3 class="info-title">{{item2.name}}</h3>
									<view class="info-subtitle">{{item2.subtitle}}</view>
									<view class="achievement-type">
										<h3 class="type" :typeId="item2.labelType">
											<image class="icon"></image>
											<view class="text">{{item2.label}}</view>
										</h3>
										<view class="time">{{item2.time}}</view>
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
				progress: ["12个", "4个", "5个", "2个", "0个"],
				search: "",
				current: 0,
				searchResult: [{
						name: "学习成就",
						list: [{
								name: "学习新秀",
								coverImage: "http://ic365.com/material/mission/2508/ff0cda9f79194011957e7829f9a3ad4e.png",
								subtitle: "完成所有图形认知练习",
								time: "2025.07.22获得",
								labelType: 1,
								label: "铜质成就"
							},
							{
								name: "学习新秀2",
								coverImage: "http://ic365.com/material/mission/2508/ff0cda9f79194011957e7829f9a3ad4e.png",
								subtitle: "完成所有图形认知练习",
								time: "3/5 进度",
								labelType: 2,
								label: "银质成就"
							}
						]
					},
					{
						name: "挑战成就",
					},
					{
						name: "团队成就",
					},
					{
						name: "活动成就",
					},
					{
						name: "未获得",
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
				uniHide:"all"
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
			clickTab(i) {
				if (this.current !== i) {
					this.current = i
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "/static/css/standard.scss";
	
	.item-title-wrap{
		margin-top: 1rem;
	}
	
	.page-wrap {
		background: #F4F4F4;
	}

	// 成就中心 ------Start
	.achievement-statistics-wrap {
		.achievement-statistics {
			min-height: 22.06rem;
			background: url("/static/image/5_achievement_back.png") no-repeat top /100%;
			position: relative;

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
						font-size: 0.625rem;
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
						display: flex;
						padding: 1rem;
						background-color: #fff;
						border-radius: 1rem;
						margin-bottom: 0.75rem;

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

								.type {
									display: inline-block;
									margin-right: 1.25rem;
									padding: 0.375rem 0.5rem 0.375rem 0.5rem;
									font-size: 0.75rem;
									border-radius: 1rem;
									overflow: hidden;
									.icon {
										float: left;
										width: 1.25rem;
										height: 1.25rem;
									}

									.text {
										display: inline-block;
										vertical-align: top;
										line-height: 1.25rem;
									}

									&[typeid="1"] {
										background-color: #FFE7DA;

										.icon {
											background: url("/static/icons/achievement_1.png") no-repeat top/ 100% 100%;
										}
									}

									&[typeid="2"] {
										background-color: #E9E9E9;

										.icon {
											background: url("/static/icons/achievement_2.png") no-repeat top/ 100% 100%;
										}
									}

									&[typeid="3"] {
										background-color: #FFF5E5;

										.icon {
											background: url("/static/icons/achievement_3.png") no-repeat top/ 100% 100%;
										}
									}

									&[typeid="4"] {
										background-color: #FFF7E2;

										.icon {
											background: url("/static/icons/achievement_4.png") no-repeat top/ 100% 100%;
										}
									}

									&[typeid="5"] {
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