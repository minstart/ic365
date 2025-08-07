<!-- isHide 控制导航栏是否显示 -->
<!-- background 导航栏背景色 默认白色-->
<!-- isBack 控制返回上一页按钮是否显示 -->
<!-- isModule 控制标题右侧功能模块是否显示 -->
<!-- clickModule 右侧功能模块点击函数 -->
<template name="page-head">
	<view class="common-page-head-view" :style="{paddingTop:taskbarHeight}">
		<view class="reserve-seat" v-if='!isHide'></view>
		<view v-if='!isHide' class="common-page-head" :style="{background:background,paddingTop:taskbarHeight}">
			<viww class="common-page-head-back">
				<view class="page-head-back-icon" v-if='isBack' @click="clickBack(backData)"></view>
			</viww>
			<view class="common-page-head-title">{{title}}</view>
			<view class="common-page-head-module">
				<image v-if='isModule' :src="moduleIcon" mode=""  @click="clickModule"></image>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		name: "page-head",
		props: {
			clickModule:{
				type:Function,
				default:()=>{
					console.log("默认右侧功能区函数")
				}
			},
			isHide:{
				default : false
			},
			title: {
				// type: String,
				default: ""
			},
			background:{
				default:"#fff"
			},
			// 是否显示返回按钮
			isBack:{
				default:false
			},
			// 是否显示最右边功能模块
			isModule:{
				default:false
			},
			moduleIcon:{
				default:"/static/icons/nav-bar.png"
			}
		},
		data(){
			return {
				taskbarHeight : 0
			} 
		},
		mounted(){
			this.taskbarHeight = uni.getSystemInfoSync().statusBarHeight/16 + "rem"
			// console.log("taskbarHeight",this.taskbarHeight)
		},
		methods:{
			clickBack(){
				uni.navigateBack()
			}
		}
	}
</script>
<style lang="less">
	.page-head{
		z-index: 999;
	}
	.reserve-seat{
		height: 2.6rem;
	}
	.common-page-head{
		display: flex; /* 定义弹性容器 */
		padding: 0;
		position: fixed;
		top: 0;
		width: 100%;
		background: #fff;
		z-index: 999;
		.common-page-head-back,.common-page-head-module{
			flex: 1;
			position: relative;
			*{
				position: absolute;
				left: 0;
				right: 0;
				bottom: 0;
				top: 0;
				margin: auto;
				width: 2rem;
				height: 2rem;
			}
		}
		.common-page-head-title{
			flex: 4;
			border-width: 0;
			color: #333;
		}
		.page-head-back-icon{
			background: url("/static/icons/back_grey.png") no-repeat center / 100% 100%;
		}
		.page-head-module-icon{
			width: 2.125rem;
			height: 2.125rem;
		}
	}
</style>
