<template>
	<!-- <view class="page-loading" v-if="pageMask"></view> -->
	<view class="wrap uni-padding-wrap">
		<page-head ref="pageHead" :title='pageHeadTitle' :isBack='true' :background="'transparent'"></page-head>
		<view class="banner-back"></view>
		<view class="content-wrap">
			<view class="content-back"></view>
			<scroll-view class="tab-content-wrap" scroll-y="true" @scrolltolower="getProductsDetail()" :style="'max-height: calc(100vh - 390rpx - '+$store.state.taskbarHeight+');'">
				<view class="table-list-wrap">
					<view class="no-list-tip" v-if="productsList.list.length==0">暂无数据</view>
					<view class="tab-list" v-for="item in productsList.list">
						<div class="list-icon-wrap flex-center">
							<image lazy-load class="list-icon" :src="item.imgPath" mode=""></image>
						</div>
						<view class="list-info">
							<h3 class="info-title">{{item.name}}</h3>
							<view class="info-subtitle">{{item.subtitle}}</view>
							<view class="change-btn" :isSelect='item.using' @click.stop="changeTitle(item)">
								{{item.using?'使用中':'立即更换'}}
							</view>
						</view>
					</view>
					<view class="no-list-tip" v-if="productsList.list.length>0 && productsList.noData">- 没有更多了 -</view>
				</view>
			</scroll-view>
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
				productsList: {
					page: 0, //默认页码（请求前会+1）
					noData: false, //是否后续没数据了
					list: [] //请求的列表合集
				}
			}
		},
		onLoad() {

		},
		onReady() {
			store.state.taskbarHeight = uni.getSystemInfoSync().statusBarHeight * 2 + "rpx"
		},
		onShow() {
			this.pageOnShowSet({
				uniHide: "all"
			}).then(res => {
				this.getProductsDetail()
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
			getProductsDetail(data) {
				let number = 10; //一次加载多少条数据
				let page = Number(this.productsList.page) + 1;
				let postData = {
					page: page,
					obtained: true,
					size: number.toString()
				}
				this.isLoading = true;
				console.log("请求参数：", postData)
				// 获取成就列表
				this.commonRequest({
					url: "/api/achievement/list",
					data: postData
				}).then(res => {
					this.isLoading = false;
					if (res.data.length == 0) {
						this.productsList.noData = true;
						return false;
					} else if (res.data.length != number) {
						this.productsList.noData = true;
					}
					// console.log("search:",this.keyword,",groupType:",this.selectProductsId)
					console.log("获取成就列表:", res.data)
					this.productsList.requested = true;
					this.productsList.page = (this.productsList.page ? this.productsList.page : 0) + 1;
					this.productsList.list = this.productsList.list.concat(res.data);
					console.log(this.productsList)
					
				}).catch(error => {
					console.log("获取成就列表报错：：", error)
				})
			},
			changeTitle(item){
				if(!item.using){
					this.commonRequest({
						url: "/api/achievement/change-show-achievement",
						data: {
							achievementId:item.achievementId
						}
					}).then(res => {
						uni.showToast({
							title: '更换成功',
							icon: 'success',
							duration: 1500
						})
						this.productsList.list.forEach((item, i) => {
							this.productsList.list[i].using = false;
						})
						for(let i in this.productsList.list){
							try{
								if(this.productsList.list[i].achievementId == item.achievementId){
									this.productsList.list[i].using = true;
									break;
								}
							}catch(e){}
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "/static/css/standard.scss";
	.wrap {
		position: relative;
		height: 100vh;
		background: linear-gradient(#FFD269 0%, #FFD269 40%, #F4F4F4 100%);
		.banner-back{
			position: relative;
			margin-top: -80rpx;
			margin-left: -30rpx;
			width: 724rpx;
			height: 398rpx;
			z-index: 0;
			background: url($imgSrc+"/image/change_title.png") no-repeat center / 100% 100%;
			z-index: 2;
		}
		.content-wrap{
			margin-top: -170rpx;
			position: relative;
			.content-back{
				position: relative;
				width: 100%;
				height: 184rpx;
				background: url($imgSrc+"/image/change_title2.png") no-repeat center / 100% 100%;
				z-index: 1;
			}
			.tab-content-wrap {
				position: relative;
				left: 0;
				margin-top: -38rpx;
				width: 100%;
				background: #fff;
				border-radius:  0 0 16rpx 16rpx;
				z-index: 2;
				.table-list-wrap {
					padding: 20rpx 38rpx 0 38rpx;
					.tab-list {
						display: flex;
						padding: 1rem;
						background-color: #fff;
						border-radius: 1rem;
						margin-bottom: 40rpx;
						position: relative;
						box-shadow: 0px 0px 16px 0px rgba(0,0,0,0.11);
						&:nth-last-child(n+2):not(.no-list-tip):not(:nth-last-child(n+3)){
							margin-bottom: 0;
						}
						.list-icon-wrap {
							height: 100%;
							float: left;
							margin: auto 0;
						}
			
						.list-icon {
							width: 176rpx;
							height: 176rpx;
							margin-right: 0.75rem;
							border-radius: 16rpx;
						}
			
						.list-info {
							flex: 1;
			
							.info-title {
								margin-top: 0.5rem;
								line-height: 1.56rem;
								font-size: 1.125rem;
							}
			
							.info-subtitle {
								color: #999;
								font-size: 0.875rem;
								margin: 0.125rem 0 20rpx 0;
							}
							.change-btn{
								width: 140rpx;
								height: 40rpx;
								line-height: 40rpx;
								font-size: 24rpx;
								color: #fff;
								float: right;
								margin-right: 20rpx;
								text-align: center;
								border-radius: 40rpx;
								&[isSelect='true']{
									background: #FF811E;
								}
								&[isSelect='false']{
									background: #FFD150;
									color: #000;
								}
							}
							
						}
					}
				}
			}
		}
	}
</style>