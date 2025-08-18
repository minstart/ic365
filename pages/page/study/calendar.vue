<template>
	<view class="page-loading" v-if="pageMask"></view>
	<page-meta v-model='fontSize' :page-font-size="fontSize+'px'" :root-font-size="fontSize+'px'"></page-meta>
	<view style="width: 100vw;height: 100vh;overflow: hidden;">
		<page-head :isBack='true' :background="'transparent'" :systemTaskbar="false"></page-head>
		<view class="page-wrap" :style="'padding-left:'+taskbarHeight2">
			<view class="calendar-back"></view>
			<view class="calendar-wrap" v-if="showCalendar">
				<h3 class="month-title">
					<span>{{new Date().getMonth() + 1}}</span>
					<span>月</span>
				</h3>
				<view class="">
					<!-- 插入模式 -->
					<uni-calendar class="uni-calendar--hook" :disabledDay="disabledDays" :selected="info.selected" :showMonth="false" @change="change">
						<template v-slot:date-content="date">
							<view :class="{'selected': date.isSelected}">
								{{ date.text1 }}
							</view>
						</template>
					</uni-calendar>
				</view>
			</view>
			<view class="btn-wrap">
				<button class="next-btn" type="button" @click="doingExercises">进入做题</button>
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
				showCalendar: false,
				taskbarHeight2: "",
				info: {
					lunar: true,
					range: true,
					insert: false,
					selected: []
				},
				disabledDays: [],
				checkedDate: ""
			}
		},
		onLoad() {

		},
		onReady() {
			this.$nextTick(() => {
				this.showCalendar = true
			})
			this.verifLogin().then(data => {
				this.info.date = this.changeDate(new Date(), -30).fullDate
				this.info.startDate = this.changeDate(new Date(), -60).fullDate
				this.info.endDate = this.changeDate(new Date(), 30).fullDate
				// 获取已答题的日期
				this.commonRequest({
					url: "/api/question/answeredDates"
				}).then(res => {
					// this.consoleLog("推荐学习::", JSON.stringify(res))
					try {
						this.info.selected = res.data || [];
					} catch (e) {}

				}).catch(error => {
					this.consoleLog("获取已答题的日期：：", error)
				})
			}).catch(error => {
				this.consoleLog("没有登录：：", error)
			})
			this.taskbarHeight2 = uni.getSystemInfoSync().statusBarHeight * 2 + "rpx";
		},
		onShow() {
			/* #ifndef APP-PLUS-NVUE */
			try {
				plus.navigator.setFullscreen(true);
			} catch (e) {}
			/* #endif */
			this.pageOnShowSet({
				uniHide: "all",
				orientation: "landscape"
			}).then(data => {
				this.disabledDays = this.getDatesInCurrentMonth()
			})
		},
		onHide() {
			
		},
		onUnload() {
			/* #ifndef APP-PLUS-NVUE */
			try {
				// 恢复手机系统栏
				plus.navigator.setFullscreen(false);
			} catch (e) {}
			/* #endif */
		},
		created() {

		},
		mounted() {

		},
		computed: {

		},
		methods: {
			getDatesInCurrentMonth() {
				const today = new Date();
				const year = today.getFullYear();
				const month = today.getMonth(); // 0为1月，11为12月
				const days = [];
				const dateArray = [];
				let tempDate = new Date(year, month, 1); // 当月的第一天

				while (tempDate.getMonth() === month) { // 只要月份相同，就继续循环
					days.push(new Date(tempDate)); // 添加副本以避免引用问题
					tempDate.setDate(tempDate.getDate() + 1); // 日期加1
				}
				days.forEach(item => {
					const year = item.getFullYear();
					const month = ('0' + (item.getMonth() + 1)).slice(-2);
					const day = ('0' + item.getDate()).slice(-2);
					if (new Date(item) > new Date()) {
						item = `${year}-${month}-${day}`
						dateArray.push(item);
					} else {
						if (this.changeDate(item).fullDate == this.changeDate(new Date()).fullDate) {
							item = `${year}-${month}-${day}`
							this.checkedDate = item;
						}
					}
				})

				return dateArray; // 返回包含所有日期的数组
			},
			change(e) {
				console.log('change 返回:', e)
				this.checkedDate = e.fulldate;
			},
			doingExercises() {
				this.jumpPage({
					url: "/pages/page/study/answerQuestions?date=" + this.checkedDate + "&pageType=everyDay"
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-wrap {
		background: linear-gradient(to right, #FFDA8F 0%, #FFDA8F 40%, #F4F4F4 100%);
		display: flex;
		padding-bottom: 0;
		height: calc(100vh - 88rpx);
		margin-top: -88rpx;
		padding-top: 88rpx;
	}

	.calendar-back {
		width: 412rpx;
		height: 100%;
		background: url("/static/image/1_2_calendar_back.png") no-repeat bottom / 100%;
	}

	.calendar-wrap {
		flex: 1;

		.month-title {
			color: #fff;
			margin-top: -54rpx;

			span {
				display: inline-block;
				line-height: 1;

				&:nth-child(1) {
					font-size: 114rpx;
				}

				&:nth-child(2) {
					font-size: 50rpx;
					vertical-align: text-bottom;
				}
			}
		}
	}

	.example-body {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
	}

	.calendar-button {
		flex: 1;
		font-weight: bold;
		font-size: 32rpx;
	}

	.btn-wrap {
		position: relative;
		width: 244rpx;
		margin: 0 32rpx;

		.next-btn {
			width: 244rpx;
			height: 80rpx;
			font-weight: 700;
			color: #fff;
			font-size: 32rpx;
			position: absolute;
			top: 80%;
		}
	}
</style>
<!-- 以下是修改日历样式 -->
<style>
	:global(.uni-calendar__header) {
		display: none !important;
	}

	:global(.uni-calendar__content) {
		background: transparent !important;
	}

	:global(.uni-calendar__weeks:nth-child(1)) {
		font-weight: 700;
		color: #222;
	}

	:global(.uni-calendar-item--disable2) {
		/* display: none !important; */
	}

	:global(.uni-calendar-item--disable) {
		background: #fff !important;
		opacity: 0 !important;
		/* display: none !important; */
	}

	.new-disable {
		opacity: 0.5 !important;

	}

	.new-disable .uni-calendar-item--disable2 {
		opacity: 1 !important;
		color: #333;
	}



	:global(.uni-calendar-item--isDay) {
		background-color: #fff !important;
		color: #333 !important;
		opacity: 1 !important;
	}



	:global(.uni-calendar-item--checked) {
		background-color: #fff !important;
		color: #333 !important;
		opacity: 1 !important;
	}

	:global(.uni-calendar-item--hook) {
		background: #fff;
		color: #333;
		margin: calc(18rpx / 2);
		border-radius: 16rpx;
		font-weight: 700;
		opacity: 0.5;
		position: relative;

		.uni-calendar-item__weeks-box-text {
			font-size: 28rpx !important;
			font-weight: 700;
		}
	}

	:global(.uni-calendar__weeks-day) {
		/* width: 64rpx !important; */
		height: 64rpx !important;
		border-width: 0px !important;
	}

	:global(.uni-calendar-item__weeks-box-item) {
		width: 64rpx !important;
		height: 64rpx !important;
		position: unset !important;
	}

	:global(.uni-calendar__weeks-item) {
		/* max-width: calc(64rpx + 18rpx * 2); */
	}

	:global(.uni-calendar-item--isDay-text:last-child) {
		display: none !important;
	}

	.new-disable-icon {
		position: absolute;
		width: 18rpx !important;
		height: 22rpx !important;
		top: calc(-18rpx / 3) !important;
		right: calc(-22rpx /3) !important;
		background: url("/static/icons/calendar_disable.png") no-repeat center /100% 100%;
	}

	.checked-icon {
		position: absolute;
		width: 22rpx !important;
		height: 22rpx !important;
		top: calc(-22rpx /3) !important;
		right: calc(-22rpx /3) !important;
		background: url("/static/icons/calendar_checked.png") no-repeat center /100% 100%;
	}

	.calendar-selected {
		background: #fff !important;
		opacity: 1;
	}

	:global(.uni-calendar-item__weeks-box-circle) {
		width: 28rpx !important;
		height: 28rpx !important;
		top: calc(-28rpx / 3) !important;
		right: calc(-28rpx / 3) !important;
		background: url("/static/icons/calendar_selected.png") no-repeat top / 100% 100%;
		background-color: transparent !important;
	}
</style>