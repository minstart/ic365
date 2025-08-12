<template>
	<page-meta v-model='fontSize' :page-font-size="fontSize+'px'" :root-font-size="fontSize+'px'"></page-meta>
	<view style="width: 100vw;height: 100vh;overflow: hidden;">
		<page-head :title='pageHeadTitle' :isBack='true' :background="'transparent'" :systemTaskbar="false"></page-head>
		<view class="page-wrap" :style="'padding-left:'+taskbarHeight2">
			
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
				taskbarHeight2: "",
			}
		},
		onLoad() {

		},
		onReady() {
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
		methods: {}
	}
</script>

<style lang="scss" scoped>
	.page-wrap {
		background: linear-gradient(to right, #FFDA8F 0%, #FFDA8F 40%, #F4F4F4 100%);
		display: flex;
		padding-bottom: 0;
		height: calc(100vh - 2.75rem);
		margin-top: -2.75rem;
		padding-top: 2.75rem;
	}
</style>