<script>
	import {
		mapMutations
	} from 'vuex'
	import {
		version
	} from './package.json'
	// #ifdef APP
	import checkUpdate from '@/uni_modules/uni-upgrade-center-app/utils/check-update';
	// #endif

	import {
		useRoute
	} from 'vue-router';
	import store from '/store/index.js'
	import commonJs from '/common/js/common.js';
	import silenceUpdate from '/uni_modules/rt-uni-update/js_sdk/silence-update.js' //引入静默更新
	export default {
		mixins: [commonJs],

		onLaunch: function() {
			store.commit("SET_ENCRYPTENABLED", true) //开启数据加密模式

			// this.removeLogin()//清除登录状态
			// store.commit('RESET_CRYPTO') //清除crypto加密储存数据
			// //测试用 - 清除缓存进入启动页
			// uni.removeStorage({
			// 	key: 'launchFlag'
			// })

			// #ifdef H5
			//H5调试 页面，模拟已经登陆的状态
			// store.state.userInfo.token = "yJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJpYzM2NS1hdXRoLXNlcnZpY2UiLCJzdWIiOiIxNzM3NjI2Nzk1NyIsInJvbGVJZCI6MSwiZ3JhZGUiOjAsInVzZXJJZCI6OTIxMTA0NTM5LCJpYXQiOjE3NTQyMjg3NTMsImV4cCI6MTc1NjgyMDc1M30._QTvEPkfXpPKHDvkuWVpt8UnJRqgdjGypHL11-PZc4folW4c34uDab8xLpiuYf7cH9v0rECBNwnsXTP8T3tU3g"
			// store.state.userInfo.info = {"cookieName":"userInfo","token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJpYzM2NS1hdXRoLXNlcnZpY2UiLCJzdWIiOiIxMzQzNDY2NzQzMSIsInJvbGVJZCI6MSwiZ3JhZGUiOjAsInVzZXJJZCI6NzkxNjc2MTUzLCJpYXQiOjE3NTMwMDI1NjQsImV4cCI6MTc1NTU5NDU2NH0.ScNQAloEFNCcZhhKE14XXWs965eBxcag_TK0ygRZ4xb62QIfh5wAQzzbbp1OlKonI7-Fa4gNRKBidPxOW40NCQ","info":{"username":"13434667431","token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJpYzM2NS1hdXRoLXNlcnZpY2UiLCJzdWIiOiIxMzQzNDY2NzQzMSIsInJvbGVJZCI6MSwiZ3JhZGUiOjAsInVzZXJJZCI6NzkxNjc2MTUzLCJpYXQiOjE3NTMwMDI1NjQsImV4cCI6MTc1NTU5NDU2NH0.ScNQAloEFNCcZhhKE14XXWs965eBxcag_TK0ygRZ4xb62QIfh5wAQzzbbp1OlKonI7-Fa4gNRKBidPxOW40NCQ"}}
			// this.setLogin(store.state.userInfo)

			// #endif
			// }

			// #ifdef H5
			console.log(
				`%c hello uniapp %c v${version} `,
				'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
				'background:#007aff ;padding: 1px; border-radius: 0 3px 3px 0;  color: #fff; font-weight: bold;'
			)
			// #endif
			// 线上示例使用
			// console.log('%c uni-app官方团队诚邀优秀前 端工程师加盟，一起打造更卓越的uni-app & uniCloud，欢迎投递简历到 hr2013@dcloud.io', 'color: red');
			// console.log('App Launch');
			// #ifdef APP-PLUS
			// App平台检测升级，服务端代码是通过uniCloud的云函数实现的，详情可参考：https://ext.dcloud.net.cn/plugin?id=4542
			if (plus.runtime.appid !== 'HBuilder') { // 真机运行不需要检查更新，真机运行时appid固定为'HBuilder'，这是调试基座的appid
				checkUpdate()
			}
			// #endif
		},
		onShow: function() {

			//#ifdef APP-PLUS 
			// 获取本地应用资源版本号
			plus.runtime.getProperty(plus.runtime.appid, (inf) => {
				// console.log("app包名称",plus.runtime.appid)
				// console.log("设备是安卓还是IOS",uni.getSystemInfoSync().platform)
				// console.log("当前版本号：",inf.versionCode)
				// console.log("设备基础数据：",inf)
				// return false;
				
				//获取服务器的版本号
				this.commonRequest({
					url: '/api/common/app-version', //示例接口
					data: {
						edition_type: plus.runtime.appid,
						version_type: uni.getSystemInfoSync().platform, //android或者ios
						edition_number: inf.versionCode, // 打包时manifest设置的版本号 
					}
				}).then(res => {
					console.log("检测升级返回的数据：",res)
					//res.data.xxx根据后台返回的数据决定（我这里后端返回的是data），所以是res.data.data
					//判断后台返回版本号是否大于当前应用版本号 && 是否发行 （上架应用市场时一定不能弹出更新提示）
					if (Number(res.data.edition_number) > Number(inf.versionCode) && res.data.edition_issue == 1) {

						//如果是wgt升级，并且是静默更新 （注意！！！ 如果是手动检查新版本，就不用判断静默更新，请直接跳转更新页，不然点击检查新版本后会没反应）
						if (res.data.package_type == 1 && res.data.edition_silence == 1) {

							//调用静默更新方法 传入下载地址
							silenceUpdate(res.data.edition_url)

						} else {
							let _this = this;
							//跳转更新页面 （注意！！！如果pages.json第一页的代码里有一打开就跳转其他页面的操作，下面这行代码最好写在setTimeout里面设置延时3到5秒再执行）
							setTimeout(function(){
								_this.jumpPage({url:'/uni_modules/rt-uni-update/components/rt-uni-update/rt-uni-update?obj=' + JSON.stringify(res.data)})
							},3000)
						}
					} else {
						// 如果是手动检查新版本 需开启以下注释
						/* uni.showModal({
						    title: '提示',
						    content: '已是最新版本',
						    showCancel: false
						}) */
					}
				})
			});
			//#endif    
		},
		onHide: function() {
			// console.log('App Hide')
		},
		globalData: {
			test: ''
		},
		methods: {
			...mapMutations(['setUniverifyErrorMsg'])
		}
	}
</script>

<style lang="scss">
	@import '@/uni_modules/uni-scss/index.scss';
	/* #ifndef APP-PLUS-NVUE */
	/* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
	@import './common/uni.css';
	@import '@/static/customicons.css';

	/* H5 兼容 pc 所需 */
	/* #ifdef H5 */
	@media screen and (min-width: 768px) {
		body {
			overflow-y: scroll;
		}
	}

	/* 顶栏通栏样式 */
	/* .uni-top-window {
	    left: 0;
	    right: 0;
	} */

	uni-page-body {
		background-color: #ffffff !important;
		min-height: 100% !important;
		height: auto !important;
	}

	.uni-top-window uni-tabbar .uni-tabbar {
		background-color: #fff !important;
	}

	.uni-app--showleftwindow .hideOnPc {
		display: none !important;
	}

	/* #endif */

	/* 以下样式用于 hello uni-app 演示所需 */
	page {
		background-color: #efeff4;
		height: 100%;
		font-size: 28rpx;
		/* line-height: 1.8; */
	}

	.fix-pc-padding {
		padding: 0 50px;
	}

	.uni-header-logo {
		padding: 30rpx;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-top: 10rpx;
	}

	.uni-header-image {
		width: 100px;
		height: 100px;
	}

	.uni-hello-text {
		color: #7A7E83;
	}

	.uni-hello-addfile {
		text-align: center;
		line-height: 300rpx;
		background: #FFF;
		padding: 50rpx;
		margin-top: 10px;
		font-size: 38rpx;
		color: #808080;
	}

	/* #endif*/
	body,
	.page-view {
		background: #fff;
	}
</style>

<style lang="scss">
	@import '/static/css/common.scss';
</style>