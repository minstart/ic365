<template>
	<view class="page-wrap">
		<page-head ref="pageHead" :standardTitle='true' :title='pageHeadTitle' :isBack='true' :background="'transparent'"></page-head>
		<view class="web-view-wrap">
			<web-view :src="viewUrl"></web-view>
		</view>
	</view>
</template>

<script>
	import store from '/store/index.js';
	import commonJs from '/common/js/common.js';

	export default {
		mixins: [commonJs],
		props: {},
		components: {},

		data() {
			return {
				viewUrl: "",
				pageHeadTitle: "",
				wvTop: "88rpx"
			}
		},
		onLoad(option) {
			// 1、智算365协议
			let type = option.webViewType;
			switch (type) {
				case "1":
					this.pageHeadTitle = "第三方SDK收集使用信息说明"
					this.viewUrl = "/hybrid/html/usageDescription.html"
					break;
				case "2":
					this.pageHeadTitle = "用户协议"
					this.viewUrl = "/hybrid/html/privacyPolicy.html"
					break;
				case "3":
					this.pageHeadTitle = "隐私协议"
					this.viewUrl = "/hybrid/html/agreement.html"
					break;
				case "4":
					this.pageHeadTitle = "儿童隐私协议"
					this.viewUrl = "/hybrid/html/privacyChildren.html"
					break;
				case "5":
					if(option.url){
						this.viewUrl = option.url;
					}
					break;
			}

			let height = 0; // 定义动态的高度变量
			let statusbar = 0; // 动态状态栏高度
			let width = 0; //页面宽度
			// 获取当前设备的具体信息
			uni.getSystemInfo({
				success: (sysinfo) => {
					statusbar = sysinfo.statusBarHeight; // 获取状态栏高度
					height = sysinfo.windowHeight; // 获取屏幕高度
					width = sysinfo.windowWidth;//页面高度
				}
			});

			// 获取当前 WebView
			let currentWebview = this.$scope.$getAppWebview();

			// 设置延迟，确保页面初始化完成
			setTimeout(function() {
				var wv = currentWebview.children()[0]; // 获取 WebView 组件
				
				// 动态调整 WebView 的布局
				wv.setStyle({
					top: (statusbar + 50) / 375 * width, // WebView 距离顶部的距离（状态栏高度）
					height: height - (statusbar + 50) / 375 * width, // WebView 的高度（屏幕高度减去状态栏高度）
				});
			}, 200); // 延迟 200ms，确保页面初始化完成

		},
		onReady() {

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
		computed: {

		},
		methods: {

		}
	}
</script>

<style lang="scss" scoped>
	@import "/static/css/standard.scss";
	.web-view-wrap {
		display: flex;
		flex-direction: column;
		position: fixed;
		width: 50vw;
		height: calc(100vh - 88rpx);
		top: 88rpx;
		overflow: hidden;

		web-view {
			height: calc(100vh - 88rpx);
		}
	}
</style>