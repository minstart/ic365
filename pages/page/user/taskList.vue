<template>
	<view class="page-loading" v-if="pageMask"></view>
	<view class="page-wrap">
		<page-head :title='pageHeadTitle' :isBack='true' :background="'transparent'"></page-head>
		<div class="uni-padding-wrap">
			<view class="task-back">
				<view class="task-back-icon"></view>
				<h3 class="task-back-title">{{typeName.indexOf("任务")==-1?typeName + "任务": typeName}}</h3>
			</view>
			<scroll-view class="task-wrap" scroll-y="true" :scroll-into-view="selectMissionId" :scroll-with-animation="true" @scrolltolower="GetNextVideoList">
				<view :id="'task-list-'+item.missionId" class="task-list" v-for="(item,i) in taskList" @click="openTaskDetails(item)">
					<image lazy-load class="task-list-icon" :src="item.cover"></image>
					<view class="task-list-content">
						<h3 class="content-title">{{item.subTitle}}</h3>
						<view class="content-time"></view>
					</view>
					<view class="task-right">
						<view class="task-list-btn" v-if="!item.finishedTime" @tap.stop="jumpPage({url:''})">做任务</view>
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
				typeName:"",//任务类型名称
				taskList: [{
						"missionId": 7,
						"missionTypeId": 2,
						"name": "完成5道题目",
						"subTitle": "完成5道题目",
						"typeName": "周常",
						"startTime": 0,
						"endTime": 0,
						"rewardName": "15知识尘",
						"currencyTypeId": 2,
						"status": null,
						"processTotal": null,
						"finishedTime": null,
						"cover": "https://ic365.ajulye.comnull",
						"colorScheme": 1
					},
					{
						"missionId": 8,
						"missionTypeId": 1,
						"name": "每日1题",
						"subTitle": "每日1题",
						"typeName": "日常",
						"startTime": 0,
						"endTime": 0,
						"rewardName": "10智慧星",
						"currencyTypeId": 2,
						"status": null,
						"processTotal": null,
						"finishedTime": "123456",
						"cover": "https://ic365.ajulye.com/material/mission/9999FF.png",
						"colorScheme": 1
					},
					{
						"missionId": 10,
						"missionTypeId": 8,
						"name": "图形拼图",
						"subTitle": "知识点学习",
						"typeName": "特定",
						"startTime": 0,
						"endTime": 0,
						"rewardName": "",
						"currencyTypeId": 0,
						"status": null,
						"processTotal": null,
						"finishedTime": null,
						"cover": "https://ic365.ajulye.com/material/mission/AEE3A5.png",
						"colorScheme": 4
					}
				]
			}
		},
		onLoad(option) {
			option.missionTypeId && (this.missionTypeId = option.missionTypeId);
			option.typeName && (this.typeName = option.typeName);
			this.verifLogin().then(data => {
				// 获取任务列表
				this.commonRequest({
					url: "/api/mission/getAll",
					data: {
						size: 15,
						missionTypeId: this.missionTypeId
					}
				}).then(res => {
					console.log("任务列表::", res)
					try {
						this.taskList = res.data.list;
					} catch (e) {}

				}).catch(error => {
					console.log("获取任务列表报错：：", error)
				})
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
				this.taskDetails = item;
				this.$refs.taskPopUp.open("bottom")
			},
			closeTaskPopUp() {
				this.$refs.taskPopUp.close()
			},
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
					&::after{
						content: "";
						display: inline-block;
						margin-left: 6rpx;
						width: 20rpx;
						height: 20rpx;
						background: url("/static/icons/doubt.png") no-repeat center / 100% 100%;
					}
				}

				.content-time {
					color: #a0a0a0;
					font-size: 20rpx;
				}
			}
			.task-right{
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