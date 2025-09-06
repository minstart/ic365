<template>
	<view class="content">加载处理页面（测试用）</view>
</template>

<script>
	import commonJs from '/common/js/common.js';
	export default {
		mixins: [commonJs],
		onLoad() {
			this.checkGuide();
		},
		methods: {
			checkGuide() {
				// console.log("进入checkGuide判断页");
				// 思路： 检测是否有启动缓存，如果没有，就是第一次启动，第一次启动就去 启动介绍页面
				try {
					
					var launchFlag = uni.getStorageSync('launchFlag');

					if (launchFlag) { //判断本地缓存跳转首页
						this.verifLogin().then(data => {
							this.jumpPage({
								url: "/pages/page/index/index",
								type: "reLaunch"
							})
						}).catch(error => {
							console.log("没有登录judge：：", error)
						})
					} else { //没有缓存进入启动页引导页
						// console.log('去引导页');
						uni.redirectTo({
							url: '/pages/page/guide/guide'
						});
					}
				} catch (e) {
					// console.log(e.message);
				}
			}
		}
	};
</script>