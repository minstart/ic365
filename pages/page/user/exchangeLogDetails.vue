<!-- 兑换记录 -->
<template>
	<!-- <view class="page-loading" v-if="pageMask"></view> -->
	<view class="page-wrap">
		<page-head :title='pageHeadTitle' :isBack='true' :background="'#fff'"></page-head>
		<view class="uni-padding-wrap">
			
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
		computed:{
			
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
</style>