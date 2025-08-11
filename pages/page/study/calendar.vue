<template>
	<page-meta v-model='fontSize' :page-font-size="fontSize+'px'" :root-font-size="fontSize+'px'"></page-meta>
	<view style="width: 100vw;height: 100vh;overflow: hidden;">
		<page-head :title='pageHeadTitle' :isBack='true'
			:background="'linear-gradient(to right,#FFDA8F 0%, #FFDA8F 40%, #F4F4F4 100%)'"
			:systemTaskbar="false"></page-head>
		<view class="page-wrap" :style="'padding-left:'+taskbarHeight2">
			<view class="calendar-back"></view>
			<view class="calendar-wrap" v-if="showCalendar">
				<view class="">
					<!-- 插入模式 -->
					<uni-calendar class="uni-calendar--hook" :disabledDay="disabledDays" :selected="info.selected"
						:showMonth="false" @change="change">
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
				checkedDate:""
			}
		},
		onLoad() {

		},
		onReady() {
			this.$nextTick(() => {
				this.showCalendar = true
			})
			// TODO 模拟请求异步同步数据
			setTimeout(() => {
				this.info.date = this.changeDate(new Date(), -30).fullDate
				this.info.startDate = this.changeDate(new Date(), -60).fullDate
				this.info.endDate = this.changeDate(new Date(), 30).fullDate


				this.info.selected = [{
						date: this.changeDate("2025-8-1").fullDate
					},
					{
						date: this.changeDate("2025-8-4").fullDate
					}
				]

				console.log(this.info)
			}, 2000)
			this.taskbarHeight2 = uni.getSystemInfoSync().statusBarHeight / 16 + "rem";
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
						if(this.changeDate(item).fullDate == this.changeDate(new Date()).fullDate){
							item = `${year}-${month}-${day}`
							this.checkedDate = item;
						}
					}
				})

				return dateArray; // 返回包含所有日期的数组
			},
			/**
			 * 获取任意时间
			 */
			changeDate(date, AddDayCount = 0) {
				if (!date) {
					date = new Date()
				}
				if (typeof date !== 'object') {
					date = date.replace(/-/g, '/')
				}
				const dd = new Date(date)

				dd.setDate(dd.getDate() + AddDayCount) // 获取AddDayCount天后的日期

				const y = dd.getFullYear()
				const m = dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1 // 获取当前月份的日期，不足10补0
				const d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate() // 获取当前几号，不足10补0
				return {
					fullDate: y + '-' + m + '-' + d,
					year: y,
					month: m,
					date: d,
					day: dd.getDay()
				}
			},
			change(e) {
				console.log('change 返回:', e)
				this.checkedDate = e.fulldate;
			},
			doingExercises(){
				uni.showToast({
					title:"当前选择的做题日期：" + this.checkedDate,
					icon:"none"
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
		height: calc(100vh - 2.75rem);
	}

	.calendar-back {
		width: 12.875rem;
		height: 100vh;
		background: url("/static/image/1_2_calendar_back.png") no-repeat center / 100%;
	}

	.calendar-wrap {
		flex: 1;
		height: 3rem;
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
		width: 7.62rem;
		margin: 0 1rem;

		.next-btn {
			width: 7.625rem;
			height: 2.5rem;
			font-weight: 700;
			color: #fff;
			font-size: 1rem;
			position: absolute;
			top: 70%;
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

	.new-disable-icon {
		position: absolute;
		width: 0.75rem !important;
		height: 0.75rem !important;
		top: -0.2rem !important;
		right: -0.2rem !important;
		background: url("/static/icons/calendar_disable.png") no-repeat center /100% 100%;
	}
	:global(.uni-calendar-item--isDay){
		background-color: #fff !important;
		color: #333 !important;
		opacity: 1 !important;
	}
	.checked-icon{
		position: absolute;
		width: 0.75rem !important;
		height: 0.75rem !important;
		top: -0.2rem !important;
		right: -0.2rem !important;
		background: url("/static/icons/calendar_checked.png") no-repeat center /100% 100%;
	}
	
	:global(.uni-calendar-item--checked){
		background-color: #fff !important;
		color: #333 !important;
		opacity: 1 !important;
	}
	:global(.uni-calendar-item--hook) {
		background: #fff;
		color: #333;
		margin: calc(0.56rem / 2);
		border-radius: 0.5rem;
		font-weight: 700;
		opacity: 0.5;
		position: relative;

		.uni-calendar-item__weeks-box-text {
			font-size: 0.875rem !important;
			font-weight: 700;
		}
	}


	:global(.uni-calendar-item__weeks-box-item) {
		width: 2rem !important;
		height: 2rem !important;
		position: unset !important;
	}

	:global(.uni-calendar__weeks-item) {
		/* max-width: calc(2rem + 0.56rem * 2); */
	}

	:global(.uni-calendar-item--isDay-text:last-child) {
		display: none !important;
	}

	.calendar-selected {
		background: #fff !important;
		opacity: 1;
	}


	:global(.uni-calendar-item__weeks-box-circle) {
		width: 0.75rem !important;
		height: 0.75rem !important;
		top: -0.2rem !important;
		right: -0.2rem !important;
		background: url("/static/icons/calendar_selected.png") no-repeat top / 100% 100%;
		background-color: transparent !important;
	}
</style>