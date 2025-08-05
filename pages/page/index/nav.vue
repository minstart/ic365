<template>
	<page-head :title='pageHeadTitle' :isBack='false'></page-head>
	<view class="nav-list" v-for="item in pathArr" @click="jump(item.path)">{{item.meta.navigationBar.titleText}}</view>
</template>

<script>
	import store from '@/store/index.js';
	import commonJs from '/common/js/common.js';
	export default {
		mixins: [commonJs],
		props: {

		},
		components: {},
		data() {
			return {
				pathArr:[]
			}
		},
		onLoad() {

		},
		onReady() {
			// const pathArr = [];
			// this.$router.getRoutes().forEach((item,i)=>{
			// 	if(item.path.indexOf("/pages/page")!=-1){
			// 		pathArr.push(item)
			// 	}
			// })
			// this.pathArr = pathArr;
		},
		onShow() {

		},
		onHide() {

		},
		// watch {
			
		// },
		created() {
			
		},
		mounted() {
			
		},
		methods: {
			jump(url){
				console.log(url)
				uni.reLaunch({
				    url: url
				});
			}
		}
	}
</script>

<style lang="less" scoped>
	.nav-list{
		padding: 1rem;
		line-height: 2;
	}
</style>