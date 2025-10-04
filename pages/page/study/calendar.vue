<template>
	<view class="page-loading" v-if="pageMask"></view>
	<page-meta v-model='fontSize' :page-font-size="fontSize+'px'" :root-font-size="fontSize+'px'"></page-meta>
	<view style="width: 100vw;height: 100vh;overflow: hidden;">
		<page-head ref="pageHead" :isBack='true' :background="'transparent'" :systemTaskbar="false"></page-head>
		<view class="page-wrap" :style="'padding-left:'+taskbarHeight2">
			<view class="calendar-back"></view>
			<view class="calendar-wrap" v-if="showCalendar">
				<h3 class="month-title-wrap">
					<view class="placeholder">
						<view class="last-month" @click.stop="lastMonth" v-if="isLastMonth"></view>
					</view>
					<view class="month-title">
						<span>{{date.getMonth() + 1}}</span>
						<span>月</span>
					</view>
					<view class="placeholder">
						<view class="next-month" @click.stop="nextMonth" v-if="isNextMonth"></view>
					</view>
				</h3>
				<view class="">
					<!-- 插入模式 -->
					<uni-calendar id="calendar" :date="date" class="uni-calendar--hook" :disabledDay="disabledDays" :selected="info.selected" :errorDay="errorDays" :showMonth="false" @change="change">
						<template v-slot:date-content="date">
							{{date}}
							<view :class="{'selected': date.isSelected}">
								{{ date.text1 }}
							</view>
						</template>
					</uni-calendar>
				</view>
			</view>
			<view class="btn-wrap">
				<!-- 功能说明 -->
				<view class="instructions-wrap">
					<h3 class="title">功能说明</h3>
					<view class="instructions">
						<view class="instructions-icon"></view>
						已掌握
					</view>
					<view class="instructions">
						<view class="instructions-icon"></view>
						未解锁
					</view>
					<view class="instructions">
						<view class="instructions-icon"></view>
						未掌握
					</view>
				</view>
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
				errorDays: [],
				checkedDate: "",
				isLastMonth: true,
				isNextMonth: false,
				date: new Date() // 当前日期
			}
		},
		onLoad() {

		},
		onReady() {
			this.$nextTick(() => {
				this.showCalendar = true
			})
			this.verifLogin().then(data => {
				this.answeredDates()
			}).catch(error => {
				console.log("没有登录：：", error)
			})
			this.taskbarHeight2 = uni.getSystemInfoSync().statusBarHeight * 2 + "rpx";
			this.answeredDates()
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
						item = `${year}-${month}-${day}`;
						dateArray.push(item);
					} else {
						if (this.changeDate(item).fullDate == this.changeDate(new Date()).fullDate) {
							item = `${year}-${month}-${day}`;
							!this.checkedDate && (this.checkedDate = item)
						}
					}
				})
				return dateArray; // 返回包含所有日期的数组
			},
			change(e) {
				this.checkedDate = e.fulldate;
			},
			doingExercises() {
				let vipLevel = 0;
				try {
					vipLevel = store.state.userInfo.info.vipLevel
				} catch (e) {}
				if (new Date(this.changeDate("", -10).fullDate) > new Date(this.checkedDate) && vipLevel == 0) {
					uni.showToast({
						title: "非VIP只能补做10天内的题目！",
						icon: "none",
						duration: 3000
					})
					return false;
				}
				console.log(this.checkedDate)
				this.jumpPage({
					url: "/pages/page/study/answerQuestions?date=" + this.checkedDate + "&pageType=everyDay"
				})
			},
			// 设置当前月份
			answeredDates() {
				// this.info.date = this.changeDate(new Date(), -30).fullDate
				// this.info.startDate = this.changeDate(new Date(), -60).fullDate
				// this.info.endDate = this.changeDate(new Date(), 0).fullDate

				// console.log(this.info.date)
				// console.log(this.info.startDate)
				// console.log(this.info.endDate)
				let _year = this.date.getFullYear();
				let _month = this.date.getMonth() + 1;
				if (_month < 10) {
					_month = "0" + _month
				}
				this.isLastMonth = false;
				this.isNextMonth = false;
				// 获取已答题的日期
				this.commonRequest({
					url: "/api/question/answeredDates",
					data: {
						month: _year + "-" + _month
					}
				}).then(res => {
					console.log("获取已答题的日期::", res)
					if (Number(_year) == 2025 && Number(_month) <= 9) {
						this.isLastMonth = false;
					} else {
						this.isLastMonth = true;
					}
					if (new Date().getFullYear() == Number(_year) && new Date().getMonth() + 1 <= Number(_month)) {
						this.isNextMonth = false;
					} else {
						this.isNextMonth = true;
					}
					try {
						res.data.forEach(item => {
							for (let i in item) {
								try {
									if (item[i] == true) {
										this.info.selected.push(i)
									} else {
										this.errorDays.push(i)
									}
								} catch (e) {}
							}
						})
					} catch (e) {}
				}).catch(error => {
					console.log("获取已答题的日期失败：：", error)
				})
			},

			// 切换到上一个月
			lastMonth() {
				const prevMonth = new Date(this.date);
				prevMonth.setMonth(prevMonth.getMonth() - 1);
				this.date = prevMonth; // 更新为上个月
				this.answeredDates()

			},
			nextMonth() {
				console.log("切换到下一个月")
				const nextMonth = new Date(this.date);
				nextMonth.setMonth(nextMonth.getMonth() + 1);
				this.date = nextMonth; // 更新为下个月
				this.answeredDates()

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
		background: url("/static/image/1_2_calendar_back.png") no-repeat center / 100%;
	}

	.calendar-wrap {
		flex: 1;

		.month-title-wrap {
			color: #fff;
			margin-top: -54rpx;
			display: flex;
			align-items: center;
			justify-content: center;

			.placeholder {
				width: 120rpx;
				height: 90rpx;
			}

			.last-month {
				width: 120rpx;
				height: 90rpx;
				transform: rotate(180deg);
				background: url('/static/icons/next_month.png') no-repeat center / 20rpx 26rpx;
			}

			.next-month {
				width: 120rpx;
				height: 90rpx;
				background: url('/static/icons/next_month.png') no-repeat center / 20rpx 26rpx;
			}

			.month-title {
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

		.instructions-wrap {
			width: 192rpx;
			padding: 20rpx 30rpx;
			background: rgba(255, 255, 255, 0.6);
			border-radius: 10rpx;
			position: absolute;
			top: 60rpx;

			.title {
				text-align: center;
				font-size: 24rpx;
				margin-bottom: 30rpx;
			}

			.instructions {
				display: flex;
				align-items: center;
				// justify-content: center;
				font-size: 20rpx;
				margin-bottom: 30rpx;

				.instructions-icon {}

				&:nth-child(2) {
					.instructions-icon {
						width: 26rpx;
						height: 26rpx;
						margin-right: 20rpx;
						background: url("/static/icons/calendar_selected.png") no-repeat center /100% 100%;
					}
				}

				&:nth-child(3) {
					.instructions-icon {
						margin: 0 20rpx 0 3rpx;
						width: 20rpx;
						height: 26rpx;
						background: url("/static/icons/calendar_disable.png") no-repeat center /100% 100%;
					}
				}

				&:nth-child(4) {
					margin-bottom: 0;

					.instructions-icon {
						width: 24rpx;
						height: 24rpx;
						margin: 1rpx 20rpx 1rpx 1rpx;
						background: url("/static/icons/error2.png") no-repeat center /100% 100%;
					}
				}

			}
		}

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
		z-index: 2;
	}

	.new-error-icon {
		position: absolute;
		width: 22rpx !important;
		height: 22rpx !important;
		top: calc(-22rpx /3) !important;
		right: calc(-22rpx /3) !important;
		background: url("/static/icons/error2.png") no-repeat center /100% 100%;
	}

	.calendar-selected {
		background: #fff !important;
		opacity: 1;
	}

	.selected-icon {
		position: absolute;
		width: 28rpx !important;
		height: 28rpx !important;
		top: calc(-28rpx / 3) !important;
		right: calc(-28rpx / 3) !important;
		background: url("/static/icons/calendar_selected.png") no-repeat top / 100% 100%;
	}

	:global(.uni-calendar-item__weeks-box-circle) {
		background-color: transparent !important;
	}
</style>