<template>
	<!-- <view class="page-loading" v-if="pageMask"></view> -->
	<view class="page-wrap uni-padding-wrap">
		<page-head ref="pageHead" :title='pageHeadTitle' :isBack='baseFormData.grade?true:false' :background="'transparent'"></page-head>
		<uni-forms ref="baseForm" :rules="rules" :model="baseFormData" labelWidth="80px">
			<uni-forms-item label="性别" required name="gender">
				<uni-data-checkbox v-model="baseFormData.gender" primaryColor="#F5A623" :localdata="genders" />
			</uni-forms-item>
			<uni-forms-item label="年级" required name="grade">
				<uni-data-select v-model="baseFormData.grade" :localdata="gradeRange">
				</uni-data-select>
			</uni-forms-item>
			<uni-forms-item label="昵称" required name="nickname">
				<uni-easyinput v-model="baseFormData.nickname" maxlength="8" primaryColor="#F5A623" placeholder="请输入昵称" />
			</uni-forms-item>
			<uni-forms-item label="学校" name="school">
				<uni-easyinput v-model="baseFormData.school" maxlength="12" primaryColor="#F5A623" placeholder="请输入学校" />
			</uni-forms-item>
			<uni-forms-item label="班级" name="class_name">
				<uni-easyinput v-model="baseFormData.class_name" maxlength="12" primaryColor="#F5A623" placeholder="请输入班级" />
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
				pageHeadTitle: '修改用户信息',
				baseFormData: {},
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
					gender: {
						rules: [{
							required: true,
							errorMessage: '请选择性别'
						}],
					},
					grade: {
						rules: [{
							required: true,
							errorMessage: '请选择年级',
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
			this.pageOnShowSet({
				uniHide: "all"
			})

			this.commonRequest({
				url: "/api/student/info"
			}).then(res => {
				console.log("获取用户信息::", res)
				try {
					store.commit("Update_UserInfo", res.data)
					this.baseFormData = res.data;
					!this.baseFormData.grade && (this.baseFormData.grade = "");
				} catch (e) {}
			}).catch(error => {
				console.log("获取用户信息报错：：", error)
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
				console.log("this.baseFormData::", this.baseFormData)
				this.$refs[ref].validate().then(res => {
					// 校验通过
					this.commonRequest({
							url: "/api/student/update",
							method: "POST",
							data: this.baseFormData
						})
						.then(res => {
							_this.$store.commit("Update_UserInfo", _this.baseFormData)
							uni.showToast({
								title: res.msg || "更新成功",
								icon: "success",
								duration: 2000
							});
							setTimeout(() => {
								_this.jumpPage({
									url: "/pages/page/index/index",
									type: "reLaunch"
								})
							}, 2000)

						})
				})
				// .catch(err => {
				// 	// console.log('err', err);
				// 	this.$refs.pageHead.openMsgTips({
				// 		content: err[0].errorMessage
				// 	})
				// })
			}
		}
	}
</script>

<style lang="scss">
	@import "/static/css/standard.scss";

	.page-wrap {
		background: url($imgSrc+"/image/0_login_back.png") no-repeat top / 100%;
	}

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

	.submit-btn {
		width: 90%;
	}
</style>