<template>
	<view class="page-loading" v-if="pageMask"></view>
	<view class="page-wrap">
		<page-head ref="pageHead" :title='pageHeadTitle' :isBack='true' :standardTitle='true' :background="'#fff'"></page-head>
		<view class="uni-padding-wrap">
			<view class="list-wrap">
				<view class="list" @tap="jumpPage({url:'/pages/page/index/supplement_info'})">
					<view class="list-title">修改用户信息</view>
					<view class="list-text"></view>
					<view class="list-icon"></view>
				</view>
				<!-- <view class="list" @tap="parentBinding">
					<view class="list-title">绑定家长</view>
					<view class="list-text"></view>
					<view class="list-icon"></view>
				</view>
				<view class="list" @tap="parentUnbind">
					<view class="list-title">解绑功能</view>
					<view class="list-text"></view>
					<view class="list-icon"></view>
				</view> -->
			</view>
			<view class="list-wrap">
				<view class="list">
					<view class="list-title">版本号</view>
					<view class="list-text">{{appVersion}}</view>
				</view>
				<view class="list" @tap="jumpPage({url:'/pages/page/user/webView?webViewType=4'})">
					<view class="list-title">儿童隐私协议</view>
					<view class="list-text"></view>
					<view class="list-icon"></view>
				</view>
				<view class="list" @tap="jumpPage({url:'/pages/page/user/webView?webViewType=3'})">
					<view class="list-title">隐私协议</view>
					<view class="list-text"></view>
					<view class="list-icon"></view>
				</view>
				<view class="list" @tap="jumpPage({url:'/pages/page/user/webView?webViewType=2'})">
					<view class="list-title">用户协议</view>
					<view class="list-text"></view>
					<view class="list-icon"></view>
				</view>
				<view class="list" @tap="jumpPage({url:'/pages/page/user/webView?webViewType=1'})">
					<view class="list-title">第三方SDK清单</view>
					<view class="list-text"></view>
					<view class="list-icon"></view>
				</view>
			</view>
			<button class="log-out" @click="logOut">退出登录</button>
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
				pageHeadTitle: "设置",
				appVersion:""
			}
		},
		onLoad() {
			plus.runtime.getProperty(plus.runtime.appid, (inf) => {
			this.appVersion = inf.version;
			})
			// const appInfo = uni.getSystemInfoSync()
			// this.appVersion = appInfo.appVersion;
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
			parentBinding(){
				// 绑定家长
				uni.showToast({
					title:"绑定家长"
				})
			},
			parentUnbind(){
				// 解除绑定
				uni.showToast({
					title:"解除绑定"
				})
			},
			
			logOut(){
				// 退出登录
				this.removeLogin()//清除登录状态
				store.commit('RESET_CRYPTO') //清除crypto加密储存数据
				
				this.jumpPage({
					url:"/pages/page/login/login",
					type:"reLaunch"
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-wrap {
		min-height: 100vh;
		background-color: #F2F2F2;

		.list-wrap {
			border-radius: 16rpx;
			background: #fff;
			padding: 0 44rpx;
			margin: 40rpx 12rpx;

			.list {
				border-bottom: 2rpx solid #E3E3E3;
				line-height: 106rpx;
				position: relative;
				font-size: 32rpx;
				color: #000;
				display: flex;
				align-items: center;
				// justify-content: center;
				&:last-child {
					border-width: 0;
				}

				&::after {
					position: absolute;
				}
				.list-title{
					
				}
				.list-text{
					flex: 1;
					text-align: right;
				}
				.list-icon{
					display: inline-block;
					width: 16rpx;
					height: 28rpx;
					background: url("/static/icons/next.png") no-repeat right / 100% 100%;
				}
			}
		}
		.log-out{
			font-weight: 700;
			font-size: 32rpx;
			color: #fff;
			border-radius: 30rpx;
			margin: 0 12rpx;
		}
	}
</style>