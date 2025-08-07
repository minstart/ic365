<template>
	<view class="page-wrap">
		<page-head :title='pageHeadTitle' :isBack='false'></page-head>
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
				pageHeadTitle: "标题",
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