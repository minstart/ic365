<template>
	<view class="page-wrap">
		<page-head :title='pageHeadTitle' :isBack='true' :background="'transparent'"></page-head>
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
				<view class="search-content-wrap">
					<view class="tab-overflow-bar">
						<ul class="tab-wrap search-tab-wrap">
							<li class="tab search-tab" :class="tabSelected(i)" v-for="(item,i) in searchResult" :current='i' @click="clickTab(i)">
								{{item.name}}
							</li>
						</ul>
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
				search:"",
				current:0,
				searchResult:[{
					name:"学习成就",
					list:[
						{
							name:"学习新秀",
							coverImage:"http://ic365.com/material/mission/2508/ff0cda9f79194011957e7829f9a3ad4e.png",
							subtitle:"完成所有图形认知练习",
							time:"2025.07.22获得",
							labelType:1,
							label:"铜质成就"
						}
					]
				},
				{
					name:"挑战成就",
				},
				{
					name:"团队成就",
				},
				{
					name:"活动成就",
				},
				{
					name:"活动成就",
				},
				{
					name:"未获得",
				}
				]
			}
		},
		onLoad() {

		},
		onReady() {

		},
		onShow() {
			this.uniHide("all")
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
			clickTab(i){
				if (this.current !== i) {
					this.current = i
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-wrap {
		background-color: #F4F4F4;
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
				right: 1.0625rem
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
			}

			.search-btn {
				position: absolute;
				top: 0;
				right: 0;
				background: #FFCE09;
				line-height: 1.875rem;
				font-size: 0.875rem;
				padding: 0 0.875rem;
				border-radius: 1rem;
			}
		}
		.search-content-wrap{
			.tab-overflow-bar{
				.search-tab-wrap{
					.tab{
						margin-right: 1.125rem;
					}
				}
			}
		}
	}
</style>