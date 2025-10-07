<template>
	<!-- <view class="page-loading" v-if="pageMask"></view> -->
	<view class="page-wrap">
		<page-head ref="pageHead" :title='pageHeadTitle' :isBack='true' :background="'transparent'"></page-head>
		<div class="uni-padding-wrap">
			<view class="task-back">
				<view class="task-back-icon"></view>
				<h3 class="task-back-title">学习任务</h3>
			</view>
			<scroll-view class="task-wrap" scroll-y="true" :scroll-into-view="selectMissionId" :scroll-with-animation="true" @scrolltolower="getTaskList">
				<view :id="'task-list-'+item.missionId" class="task-list" v-for="(item,i) in taskList" @click="openTaskDetails(item)">
					<image lazy-load class="task-list-icon" :src="item.cover"></image>
					<view class="task-list-content">
						<h3 class="content-title">{{item.subTitle}}</h3>
						<view class="content-time"></view>
					</view>
					<view class="task-right">
						<view class="task-list-btn" v-if="!item.finishedTime" @tap.stop="completeTask(item)">去完成</view>
						<view class="task-list-complete-icon" v-if="item.finishedTime"></view>
					</view>

				</view>
			</scroll-view>
		</div>
	</view>
	<uni-popup ref="taskPopUp" :mask-click="false" type="bottom">
		<task-details :details='taskDetails' :close="closeTaskPopUp"></task-details>
	</uni-popup>
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
				selectMissionId: "", //选中的任务id
				taskDetails: "", //任务详情
				missionTypeId: "", //任务类型id
				typeName: "", //任务类型名称
				taskList: [],
				page: 0, //页码
				noData: false, //没更多数据了
			}
		},
		onLoad(option) {
			option.missionTypeId && (this.missionTypeId = option.missionTypeId);
			option.typeName ? (this.typeName = option.typeName) : (this.typeName = "我的");

			this.verifLogin().then(data => {
				this.getTaskList()
			})
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
		// watch {

		// },
		created() {

		},
		mounted() {

		},
		computed: {

		},
		methods: {
			// 打开任务详情
			openTaskDetails(item) {
				// 已经做完了，查看任务详情
				this.taskDetails = item;
				this.$refs.taskPopUp.open("bottom")
			},
			completeTask(item) {
				// 没有做完，跳转到任务界面
				if (item.matchSubTypeId == 1) {
					// 任务做题
					this.jumpPage({
						url: '/pages/page/study/answerQuestions?pageType=question&missionId=' + item.missionId
					})
				} else if (item.matchSubTypeId == 2) {
					// 任务看视频
					this.jumpPage({
						url: '/pages/page/study/answerQuestions?pageType=video&categoryId=' + item.categoryId + '&missionId=' + item.missionId
					})
				} else {
					this.$refs.pageHead.openMsgTips({
						content: "匹配任务类型失败，无法跳转"
					})
				}
			},
			closeTaskPopUp() {
				this.$refs.taskPopUp.close()
			},
			getTaskList() {
				if (this.noData) return false;
				let postData = {
					size: 15,
					page: this.page + 1
				}
				this.missionTypeId && (postData.missionTypeId = this.missionTypeId)
				// 获取任务列表
				this.commonRequest({
					url: "/api/mission/getAll",
					data: postData,
				}).then(res => {
					console.log("任务列表::", res)
					try {
						if (res.data.list.length == 0) {
							this.noData = true;
						}
						this.taskList = res.data.list;
					} catch (e) {}

				}).catch(error => {
					console.log("获取任务列表报错：：", error)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-wrap {
		background-color: #F6F6F6;
		min-height: 100vh;

		.task-back {
			margin-top: 16rpx;
			height: 160rpx;
			background: url("/static/image/task_back.png") no-repeat center / 100% 100%;
			position: relative;

			.task-back-title {
				font-size: 44rpx;
				color: #222;
				padding: 30rpx;
			}

			.task-back-icon {
				position: absolute;
				width: 230rpx;
				height: 188rpx;
				top: -60rpx;
				right: 0;
				background: url("/static/image/task_back_icon.png") no-repeat center / 100% 100%;
			}
		}
	}

	.task-wrap {
		height: calc(100vh - 600rpx);
		.task-list {
			display: flex;
			align-items: center;
			background-color: #fff;
			border-radius: 12rpx;
			padding: 36rpx 30rpx;
			margin-bottom: 20rpx;
			position: relative;

			// justify-content: center;
			.task-list-icon {
				width: 72rpx;
				height: 72rpx;
				margin-right: 20rpx;
			}

			.task-list-content {
				flex: 1;

				.content-title {
					font-size: 26rpx;
					color: #222;

					&::after {
						content: "";
						display: inline-block;
						vertical-align: text-top;
						margin-left: 6rpx;
						width: 30rpx;
						height: 30rpx;
						background: url("/static/icons/doubt.png") no-repeat center / 100% 100%;
					}
				}

				.content-time {
					color: #a0a0a0;
					font-size: 20rpx;
				}
			}

			.task-right {
				min-width: 140rpx;
				min-height: 10rpx;
			}

			.task-list-btn {
				font-style: 24rpx;
				color: #fff;
				border-radius: 30rpx;
				line-height: 48rpx;
				background-color: #79D183;
				padding: 0 24rpx;
				float: right;
			}

			.task-list-complete-icon {
				position: absolute;
				bottom: 0;
				right: 0;
				width: 140rpx;
				height: 140rpx;
				background: url("/static/icons/task_complete.png") no-repeat center / 100% 100%;
			}
		}
	}
</style>