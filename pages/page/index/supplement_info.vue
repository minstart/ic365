<template>
	<page-head :title='pageHeadTitle' :isBack='true'></page-head>
	<view class="uni-padding-wrap uni-common-mt">
		<uni-forms ref="baseForm" :rules="rules" :model="baseFormData" labelWidth="80px">
			<uni-forms-item label="性别" required name="gender">
				<uni-data-checkbox v-model="baseFormData.gender" primaryColor="#F5A623" :localdata="genders" />
			</uni-forms-item>
			<uni-forms-item label="年级" required name="grade">
				<uni-data-select v-model="baseFormData.grade" :localdata="gradeRange">
				</uni-data-select>
			</uni-forms-item>
			<uni-forms-item label="昵称" required name="nickname">
				<uni-easyinput v-model="baseFormData.nickname" primaryColor="#F5A623" placeholder="请输入昵称" />
			</uni-forms-item>
			<uni-forms-item label="学校" name="school">
				<uni-easyinput v-model="baseFormData.school" primaryColor="#F5A623" placeholder="请输入学校" />
			</uni-forms-item>
			<uni-forms-item label="班级" name="class_name">
				<uni-easyinput v-model="baseFormData.class_name" primaryColor="#F5A623" placeholder="请输入班级" />
			</uni-forms-item>
		</uni-forms>
		<button class="submit-btn" type="primary" @click="submit('baseForm')">提交</button>
	</view>
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
				pageHeadTitle: '补充用户信息',
				baseFormData: {
					grade: ""
				},
				gradeRange: [{
						value: 1,
						text: '一年级'
					},
					{
						value: 2,
						text: '二年级'
					},
					{
						value: 3,
						text: '三年级'
					},
					{
						value: 4,
						text: '四年级'
					},
					{
						value: 5,
						text: '五年级'
					},
					{
						value: 6,
						text: '六年级'
					},
				],

				genders: [{
						value: 0,
						text: '男'
					},
					{
						value: 1,
						text: '女'
					}
				],
				rules: {
					grade: {
						rules: [{
							required: true,
							errorMessage: '请选择年级',
						}]
					},
					gender: {
						rules: [{
							required: true,
							errorMessage: '请选择性别'
						}]
					},
					nickname: {
						rules: [{
							required: true,
							errorMessage: '请输入昵称'
						}]
					}
				}
			}
		},
		onLoad() {

		},
		onReady() {

		},
		onShow() {
			this.commonRequest({
				url: "/api/student/info"
			}).then(res => {
				this.consoleLog("获取用户信息::", JSON.stringify(res))
				if (res.code == 0) {
					try {
						store.commit("Update_UserInfo", res.data)
						this.baseFormData = res.data;
					} catch (e) {}

				} else {
					uni.showToast({
						title: res.message || "获取用户信息失败!",
						icon: "none"
					});
				}
			}).catch(error => {
				this.consoleLog("获取用户信息报错：：", error)
			})
		},
		onHide() {

		},

		created() {

		},
		mounted() {

		},
		methods: {
			// 提交数据
			submit(ref) {
				let _this = this;
				console.log(this.$refs[ref].validate())
				this.$refs[ref].validate().then(res => {
					// 校验通过
					this.commonRequest({
							url: "/api/student/info",
							method: "POST",
							data: this.baseFormData
						})
						.then(res => {
							if (res.code == 0) {
								_this.$store.commit("Update_UserInfo", _this.baseFormData)
								uni.showToast({
									title: res.message || "更新用户信息成功!",
									icon: "success",
									duration: 2000,
									success: function() {
										setTimeout(() => {
											uni.reLaunch({
												url: "/pages/page/index/index"
											});
										}, 2000)
									}
								});
							} else {
								uni.showToast({
									title: res.message || "更新用户信息失败!",
									icon: "none"
								});
							}
						}).catch(error => {
							uni.showToast({
								title: '更新用户信息失败:' + error,
								icon: "none"
							});
							console.error('更新用户信息失败:', error)
						})
				}).catch(err => {
					// console.log('err', err);
					uni.showToast({
						title: err[0].errorMessage,
						icon: "none"
					});
				})
			}
		}
	}
</script>

<style lang="scss" >
	@import "/static/css/standard.scss";
	.uni-form-item {
		.title {
			flex: 1;
		}

		.content {
			flex: 2;
		}
	}

	.uni-select,
	.uni-stat-box {
		background-color: #fff !important;
	}

	.uni-picker-tips {
		font-size: 12px;
		color: #666;
		margin-bottom: 15px;
		padding: 0 15px;
		/* text-align: right; */
	}
	
	.submit-btn{
		width: 90%;
		// background-color: $ThemeColor !important;
		// font-size: 1rem;
	}
</style>

