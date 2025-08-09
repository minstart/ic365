<template>
	<page-meta v-model='fontSize' :page-font-size="fontSize+'px'" :root-font-size="fontSize+'px'"></page-meta>
	<view class="page-wrap">
		<page-head :title='pageHeadTitle' :isBack='true' :background="'linear-gradient(to right,#FFDA8F 0%, #FFDA8F 40%, #F4F4F4 100%)'" :systemTaskbar="false"></page-head>
		<view class="calendar-back">{{fontSize}}</view>
		<view class="calendar-wrap" v-if="showCalendar">
			<view class="">
				<!-- 插入模式 -->
				<uni-calendar class="uni-calendar--hook" :selected="info.selected" :showMonth="false" @change="change" @monthSwitch="monthSwitch" />
			</view>
		</view>
	</view>
</template>

<script>
	import store from '/store/index.js';
	import commonJs from '/common/js/common.js';

	/**
	 * 获取任意时间
	 */
	function getDate(date, AddDayCount = 0) {
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
	}

	export default {
		mixins: [commonJs],
		props: {

		},
		components: {},

		data() {
			return {
				showCalendar: false,
				info: {
					lunar: true,
					range: true,
					insert: false,
					selected: []
				}
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
				this.info.date = getDate(new Date(), -30).fullDate
				this.info.startDate = getDate(new Date(), -60).fullDate
				this.info.endDate = getDate(new Date(), 30).fullDate
				this.info.selected = [{
						date: getDate(new Date(), -3).fullDate,
						info: '打卡'
					},
					{
						date: getDate(new Date(), -2).fullDate,
						info: '签到',
						data: {
							custom: '自定义信息',
							name: '自定义消息头'
						}
					},
					{
						date: getDate(new Date(), -1).fullDate,
						info: '已打卡'
					}
				]
				
				console.log(this.info)
			}, 2000)
			console.log("系统状态栏高度：", uni.getSystemInfoSync().statusBarHeight / 16 + "rem")
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
				this.setRootFontSize({
					orientation: "landscape"
				})
			})
			
		},
		onHide() {

		},
		onUnload() {
			/* #ifndef APP-PLUS-NVUE */
			try {
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
			open() {
				this.$refs.calendar.open()
			},
			close() {
				console.log('弹窗关闭');
			},
			change(e) {
				console.log('change 返回:', e)
				// 模拟动态打卡
				if (this.info.selected.length > 5) return
				this.info.selected.push({
					date: e.fulldate,
					info: '打卡'
				})
			},
			confirm(e) {
				console.log('confirm 返回:', e)
			},
			monthSwitch(e) {
				console.log('monthSwitchs 返回:', e)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-wrap{
		background: linear-gradient(to right,#FFDA8F 0%, #FFDA8F 40%, #F4F4F4 100%);
	}
	.calendar-back{
		width: 12.875rem;
		height: 18.375rem;
		background: url("/static/image/1_2_calendar_back.png") no-repeat top / 100%;
	}
	.calendar-wrap{
		
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
	
</style>
<style>
	:global(.uni-calendar__header){
		display: none !important;
	}
</style>