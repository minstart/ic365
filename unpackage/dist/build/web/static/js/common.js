// 存储登录信息
// localStorage.setItem('userToken', 'your_token_here');
 
// 获取登录信息
// let token = localStorage.getItem('userToken');
 
// 清除登录信息
// localStorage.removeItem('userToken'); 
// import request from '@/utils/request'

// import { exchangeKeys } from '../utils/cryptoService'

export default {
	data() {
	    return {
			loading2:false,
			staticUrl:this.$store.state.configData.staticUrl
		}
	},
	onLoad() {
		console.log(this.$store.state.hasLogin)
		console.log(this.$store.state.configData.staticUrl)
		console.log(this.staticUrl)
		// this.pageHeadTitle = "修改后的标题"
	},
	methods: {
	//公共请求函数
	// url请求路径
	// success 请求成功调用函数
	// dataType 数据返回类型
	// type发起请求类型
	commonRequest(data){
		let successFn = data.success?data.success:()=>{};
		let errorFn = data.error?data.error:()=>{};
		uni.showLoading();
		data.url && data.url.indexOf("http")==-1 && (data.url = this.staticUrl + data.url)
		uni.request({
			url: data.url,
			dataType: data.dataType || 'json',
			method:data.type||"post",
			timeout:data.timeout || 10000,
			data: data.data,
			success: (res) => {
				console.log('request success：', res)
				successFn()
			},
			fail: (err) => {
				console.log('request error：', err);
				errorFn()
			},
			complete: () => {
				// 请求完成(成功失败都返回)
				this.loading = false;
				uni.hideLoading();
			}
		});
	}
	
	// 封装数据储存
	// key : key名称
	// data ：存储的数据
	,uniSetStorage(data){
		if(!data||!data.key||!data.data){
			console.log("存储数据失败：缺少key|data")
			return false;
		}
		if(typeof data.data == 'object'){
			data.data = JSON.stringify(data.data)
		}
		uni.setStorage({
			key: data.key,
			data: data.data,
			success: (res) => {
				uni.showModal({
					title: '存储数据成功',
					// #ifndef MP-ALIPAY
					content: JSON.stringify(res.errMsg),
					// #endif
					// #ifdef MP-ALIPAY
					content: data,
					// #endif
					showCancel:false
				})
			},
			fail: () => {
				uni.showModal({
					title: '储存数据失败!',
					showCancel:false
				})
			}
		})
	}
	// 清除储存数据
	,uniClearStorage: function () {
		uni.clearStorageSync()
	}
  }
}

	
