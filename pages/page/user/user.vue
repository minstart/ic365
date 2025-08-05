<template>
	<view class="page-wrap">
		<page-head :title='pageHeadTitle' :isHide='true' :isBack='false' :isModule="false"
			:background="'transparent'"></page-head>
		<view class="banner-wrap">
			<view class="btn-user-set-wrap">
				<view class="btn-user-set" @click="jumpPage({url:''})"></view>
			</view>
			<view class="user-info-wrap">
				<view class="uni-padding-wrap">
					<image class="head-pic" :src='userInfo.avatar || defaultHeadPic' @error="defaultHeadPicUrl" alt="">
					</image>
					<view class="user-info">
						<h3 class="name">{{userInfo.nickname||""}}同学</h3>
						<view class="school">{{userInfo.school||""}} {{userInfo.className||""}}</view>
						<ul class="title-wrap">
							<li class="title" v-for="item in userInfo.showAchievementName">
								{{item.showAchievementName}}
							</li>
						</ul>
					</view>
				</view>
				<view class="property">
					<view class="property-item">
						<h3 class="item-info-num">358</h3>
						<view class="item-info-title">智慧星</view>
					</view>
					<view class="property-item">
						<h3 class="item-info-num">58</h3>
						<view class="item-info-title">启明石</view>
					</view>
					<view class="property-item">
						<h3 class="item-info-num">1256</h3>
						<view class="item-info-title">知识尘</view>
					</view>
				</view>
				<view class="user-id">
					<view class="userId-title">守护者ID</view>
					<h3 class="userId">{{userInfo.userId}}</h3>
				</view>
			</view>
		</view>
		<view class="uni-padding-wrap uni-common-mt tab-wrap">
			<!-- 我的tab相关 ------Start -->
			<view class="tab-list-wrap">
				<view class="tab-list" :class="selectedClass(i)" :current='i' @click="clickTab(i)"
					v-for="(item,i) in practiceList">
					{{item.title}}
				</view>
			</view>
			<view class="tab-list-content">
				<view class="tab-list" :current='current' v-if="current === 0">
					<view class="practice-list" v-for="item in practiceList[current].list">
						<image class="list-icon" src="" mode=""></image>
						<view class="list-info">
							<h3 class="title">{{item.title}}</h3>
							<view class="introduce">{{item.introduce}}</view>
						</view>
					</view>
				</view>
				<view class="tab-list" :current='current' v-if="current === 1"><text class="content-text">选项卡2的内容</text>
				</view>
				<view class="tab-list" :current='current' v-if="current === 2"><text class="content-text">选项卡3的内容</text>
				</view>
				<view class="tab-list" :current='current' v-if="current === 3"><text class="content-text">选项卡4的内容</text>
				</view>
			</view>
			<!-- 我的tab相关 ------End -->
			<!-- 皮肤tab ------Start -->
			<view class="skin-tab-wrap">
				<view class="skin-tab-list-wrap">
					<h3 class="skin-tab-list flex-center" :class="selectedClass2(i)" :current='i' @click="clickTab2(i)"
						v-for="(item,i) in skinList" v-html="item.title">
					</h3>
				</view>
				<view class="skin-tab-content">
					<view class="tab-list" :current='current' v-if="skinCurrent === 0">
						<view class="skin-list" v-for="item in skinList[skinCurrent].list">
							<image class="list-icon" src="" mode=""></image>
							<view class="list-info ">
								<view class="flex-center">
									<view>
										<h3 class="title">{{item.title}}</h3>
										<view class="introduce">{{item.introduce}}</view>
										<view class="isObtain back-green" v-if="item.obtain==1">使用中</view>
										<view class="isObtain back-green" v-if="item.obtain==2">已获取</view>
										<view class="isObtain" v-if="item.obtain==3">未获得</view>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view class="tab-list" :current='skinCurrent' v-if="skinCurrent === 1"><text
							class="content-text">选项卡2的内容</text>
					</view>
					<view class="tab-list" :current='skinCurrent' v-if="skinCurrent === 2"><text
							class="content-text">选项卡3的内容</text>
					</view>
					<view class="tab-list" :current='skinCurrent' v-if="skinCurrent === 3"><text
							class="content-text">选项卡4的内容</text>
					</view>
					<view class="tab-list" :current='skinCurrent' v-if="skinCurrent === 4"><text
							class="content-text">选项卡5的内容</text>
					</view>
				</view>
			</view>
			<!-- 皮肤tab ------End -->
			<!-- 兑换商城 ------Start -->
			<view class="exchange-wrap">
				<view class="item-title-wrap">
					<h3 class="item-title">兑换商城</h3>
					<view class="item-subtitle">限时兑换</view>
					<view class="item-more">
						<view class="text icon-more" @click="jumpPage({url:''})">查看更多</view>
					</view>
				</view>
				<ul class="exchange-list-wrap">
					<li class="exchange-list" v-for="item in exchangeList" :type="item.missionTypeId"
						:colorscheme="item.colorScheme">
						<image class="list-icon"></image>
						<view class="list-info">
							<h3 class="info-title">{{item.title}}</h3>
							<view class="info-describe">{{item.describe}}</view>
							<view class="rewardBtn-wrap">
								<view class="list-reward" v-if="item.rewardName">
									<image class="reward-reward-icon" :src="rewardIcon(item.currencyTypeId)"></image>
									<span>{{item.rewardName}}</span>
								</view>
								<view class="exchange-btn">立即兑换</view>
							</view>
						</view>
					</li>
				</ul>
			</view>
			<!-- 兑换商城 ------End -->
		</view>
	</view>
	
</template>

<script>
	import store from '/store/index.js';
	import commonJs from '/common/js/common.js';

	export default {
		mixins: [commonJs],
		data() {
			return {
				defaultHeadPic: store.state.defaultHeadPic, //默认头像
				userInfo: {
					nickname: "",
					userId: "5654654321",
					title: [{
							"title": "数学小能手"
						},
						{
							"title": "超级会员"
						}
					],
					currencies: {

					}
				},
				current: 0, //选项卡显示下标
				practiceList: [{
						title: "我的练习",
						list: [{
								icon: "",
								title: "最近练习",
								introduce: "查看最近的练习记录",
								unRead: "3条新记录"
							},
							{
								icon: "",
								title: "最近练习",
								introduce: "查看最近的练习记录",
								unRead: ""
							}
						]
					},
					{
						title: "我的错题",
					},
					{
						title: "我的兑换",
					},
					{
						title: "我的任务",
					}
				],

				skinCurrent: 0,
				skinList: [{
						title: "星座<br>战衣",
						list: [{
								icon: "",
								title: "狮子座战衣",
								introduce: "勇敢的狮子座专属",
								obtain: 1
							},
							{
								icon: "",
								title: "处女座战衣",
								introduce: "完美的处女座",
								obtain: 2
							},
							{
								icon: "",
								title: "白羊座战衣",
								introduce: "热情冲动的白羊座",
								obtain: 3
							},
							{
								icon: "",
								title: "射手座战衣",
								introduce: "凑数的射手座战衣",
								obtain: 3
							}
						]
					},
					{
						title: "生肖<br>守护者",
					},
					{
						title: "数学<br>名人堂",
					},
					{
						title: "皮肤",
					},
					{
						title: "饰品",
					}
				],
				exchangeList: [{
					icon: "",
					title: "圣诞限定皮肤",
					describe: "节日专属智算365皮肤",
					rewardName: "1500知识尘",
					currencyTypeId: 1,
					isExchange: 1,
					missionTypeId: 1,
					colorScheme: 2
				}, {
					icon: "",
					title: "圣诞限定皮肤",
					describe: "节日专属智算365皮肤",
					rewardName: "1500知识尘",
					currencyTypeId: 1,
					isExchange: 1,
					missionTypeId: 1,
					colorScheme: 3
				}, ]
			}
		},

		onLoad() {

		},
		onReady() {
			const route = getCurrentPages(); //获取当前页面地址
			const pathUrl = route[route.length - 1].route;
			this.getLogin().then(data => {
				// this.consoleLog(store.state.userInfo.token)
				// this.consoleLog(store.state.userInfo)
				// 已经登陆了
				this.consoleLog("已经登陆了")

				// 获取用户信息
				this.commonRequest({
					url: "/api/student/info"
				}).then(res => {
					this.consoleLog("获取用户信息::", JSON.stringify(res))
					if (res.code == 0) {
						try {
							store.commit("Update_UserInfo", res.data)
							this.userInfo = res.data;
						} catch (e) {}
						// 全新用户，需要选年级

						if (res.data.grade == 0) {
							uni.redirectTo({
								url: '/pages/page/index/supplement_info?pageFrom=' + pathUrl
							});
						}
					} else {
						uni.showToast({
							title: res.message || "获取用户信息失败!",
							icon: "none"
						});
					}
				}).catch(error => {
					this.consoleLog("获取用户信息报错：：", error)
				})

				// 获取任务列表
				this.commonRequest({
					url: "/api/mission/getAll"
				}).then(res => {
					this.consoleLog("首页任务列表::", JSON.stringify(res))
					if (res.code == 0) {
						try {
							this.plan = res.data;
						} catch (e) {}
					} else {
						uni.showToast({
							title: res.message || "获取用户信息失败!",
							icon: "none"
						});
					}
				}).catch(error => {
					this.consoleLog("获取任务列表报错：：", error)
				})

				// 获取我的成就
				this.commonRequest({
					url: "/api/achievement/mine"
				}).then(res => {
					this.consoleLog("首页我的成就::", JSON.stringify(res))
					if (res.code == 0) {
						try {
							achievement = res.data;
						} catch (e) {}
					} else {
						uni.showToast({
							title: res.message || "获取最新成就失败!",
							icon: "none"
						});
					}
				}).catch(error => {
					this.consoleLog("获取任务列表报错：：", error)
				})
			}).catch(err => {
				// 没有登陆
				// console.error("data：：：：：2", JSON.stringify(err));
				if (pathUrl.indexOf("/login") == -1) {
					// 没有登录
					console.log("没有登录,跳转到登录页面")
					// #ifdef APP-PLUS
					uni.redirectTo({
						url: '/pages/page/login/login?pageFrom=' + pathUrl
					});
					// #endif
					// #ifdef H5
					// uni.redirectTo({
					// 	url: '/pages/page/login/phoneLogin?pageFrom=' + pathUrl
					// });
					// #endif
				}
			});

		},
		onShow() {
			if (store.state.userInfo.info) {
				this.userInfo = {
					...this.userInfo,
					...store.state.userInfo.info
				}
			}
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
			selectedClass() {
				// 根据current的值返回选中状态的class
				return index => index === this.current ? 'selected' : '';
			},
			selectedClass2() {
				// 根据current的值返回选中状态的class
				return index => index === this.skinCurrent ? 'selected' : '';
			}
		},
		methods: {
			// 用户头像默认图标
			defaultHeadPicUrl() {
				this.userInfo.avatar = '/static/image/head_pic.png';
				return '/static/image/head_pic.png';
			},
			// 奖励图标
			rewardIcon(id) {
				switch (id) {
					case 1:
						// 智慧星
						return "/static/icons/star.png";
					case 2:
						// 知识尘
						return "/static/icons/dust.png";
					case 3:
						// 启明石
						return "/static/icons/stone.png";
					case 4:
						// 丰硕穗
						break;
					case 5:
						// 圣诞欢乐颂
						break;
					case 6:
						// 课程
						break;
				}
			},
			clickTab(i) {
				if (this.current !== i) {
					this.current = i
				}
			},
			clickTab2(i) {
				if (this.skinCurrent !== i) {
					this.skinCurrent = i
				}
			},
		}
	}
</script>
<style lang="scss" scoped>
	uni-page-body {
		background-color: #F4F4F4 !important;
	}
	.page-wrap{
		background: url("/static/image/5_user_back.png") no-repeat top / 100%;
	}
	.banner-wrap {

		.btn-user-set-wrap {
			overflow: hidden;
			width: 21.4375rem;
			margin: 0 auto;

			.btn-user-set {
				margin: 1.5625rem 0.5rem 1.06rem 0;
				width: 1.25rem;
				height: 1.25rem;
				float: right;
				background: url("/static/icons/setUp-white.png") no-repeat center/100% 100%;
			}
		}

		.user-info-wrap {
			width: 21.4375rem;
			background: #fff;
			margin: 0 auto;
			border-radius: 0.5rem;
			margin-bottom: 2.5rem;

			.uni-padding-wrap {
				display: flex;
				padding: 1.25rem 0.9375rem;
			}

			.head-pic {
				width: 3rem;
				height: 3rem;
				border-radius: 50%;
				background: #fff;
				overflow: hidden;
				// flex: 1;
				margin-right: 0.5rem;
			}

			.user-info {
				flex: 1;

				.name {
					margin: 0.2rem 0;
				}

				.school {
					font-size: 0.8125rem;
					color: #999;
				}

				.title-wrap {
					margin-top: 0.375rem;

					.title {
						display: inline-block;
						font-size: 0.8125rem;
						color: #eb7d1e;
						padding: 0.25rem 0.5rem;
						background: #FFFBDB;
					}
				}
			}
		}

		.property {
			display: flex;
			margin-bottom: 1.25rem;
			padding: 0 0.9375rem;

			.property-item {
				flex: 1;
				padding-top: 4rem;
				margin-right: 0.68rem;
				height: 3.5rem;
				text-align: center;

				&:nth-child(1) {
					background: url("/static/image/4_property_item1.png") no-repeat center / 100% 100%;
				}

				&:nth-child(2) {
					background: url("/static/image/4_property_item2.png") no-repeat center / 100% 100%;
				}

				&:nth-child(3) {
					background: url("/static/image/4_property_item3.png") no-repeat center / 100% 100%;
					margin-right: 0;
				}

				.item-info-num {
					font-size: 1.5rem;
					color: #222;
				}

				.item-info-title {
					font-size: 0.875rem;
					color: #999999;
				}
			}
		}

		.user-id {
			font-size: 1rem;
			text-align: center;
			line-height: 1.5;
			background-color: #F9F9F9;
			padding: 1.1875rem 0;

			.userId-title {
				color: #999;
			}

			.userId {
				color: #666;
			}
		}
	}

	.tab-wrap {
		.tab-list-wrap {
			display: flex;
			margin-bottom: 0.875rem;

			.tab-list {
				flex: 1;
				color: #666;
				font-size: 1rem;
				text-align: center;
				padding-top: 0.25rem;
				padding-bottom: 0.5rem;
			}

			.selected {
				font-weight: 700;
				font-size: 1.2rem;
				padding-top: 0;
				background: url("/static/icons/selected.png") no-repeat bottom / 1.3125rem 0.375rem;
			}
		}

		.practice-list {
			background: #F9F9F9;
			border-bottom: 0.16rem solid #F6F6F6;
			display: flex;
			padding: 1.375rem 1.125rem;

			.list-icon {
				width: 2.25em;
				height: 2.25em;
				display: inline-block;
				margin-right: 0.625rem;
				background: #ccc;
				border-radius: 0.2rem;
			}

			.list-info {
				position: relative;
				flex: 1;
				display: inline-block;
				background: url("/static/icons/next.png") no-repeat right / 0.5rem 0.85rem;

				.title {
					font-size: 1.125rem;
					line-height: 1;
					margin-bottom: 0.2rem;
				}

				.introduce {
					color: #999;
					font-size: 0.875rem;
				}

				.unRead {
					position: absolute;
					color: #5893f3;
					font-size: 0.93rem;
					top: 0;
					bottom: 0;
					right: 1rem;
					margin: auto;
					height: 1.3rem;
				}
			}

		}

		// 皮肤
		.skin-tab-wrap {
			margin-top: 1.25rem;
			background: #79D183;
			border-radius: 1rem;
			min-height: 10rem;
			padding: 0.4rem;
			display: flex;

			.skin-tab-list-wrap {
				padding: 1rem 0;

				.skin-tab-list {
					font-size: 1rem;
					text-align: center;
					background-color: #aae795;
					color: #43933e;
					border: 0.125rem solid #fff;
					padding: 0.75rem 0.375rem;
					border-radius: 0.5rem 0 0 0.5rem;
					margin-bottom: 0.5rem;
					width: 3.5rem;
					min-height: 2.25rem;

					&:last-of-type {
						margin-bottom: 0;
					}
				}

				.selected {
					background: #FAE382;
					color: #235120;
				}
			}

			.skin-tab-content {
				margin-left: -0.2rem;
				flex: 1;
				min-height: 100%;
				background: #fff;
				border-radius: 1rem;

				.skin-list {
					background-color: #F1F4FB;
					border-radius: 1rem;
					margin: 0.5rem;
					display: flex;
					padding-right: 0.5rem;

					.list-icon {
						width: 6.5rem;
						height: 6.5rem;
					}

					.list-info {
						position: relative;
						flex: 1;

						.flex-center {
							height: 100%;
							justify-content: left;
						}

						.introduce {}

						.isObtain {
							position: absolute;
							right: -0.5rem;
							top: 0;
							background: #C2C2C2;
							font-size: 0.81rem;
							color: #fff;
							padding: 0.18rem 0.56rem;
							border-radius: 0 1rem 0 1rem;
						}

						.back-green {
							background: #79D183;
						}
					}
				}
			}
		}

	}

	.exchange-wrap {
		.exchange-list-wrap {
			.exchange-list {
				display: flex;
				background-color: #fff;
				padding: 1rem;
				border-radius: 1rem;
				margin-bottom: 0.75rem;

				.list-icon {
					width: 5.5rem;
					height: 6.75rem;
					background-color: #FFEFF3;
					border-radius: 0.8rem;
					margin-right: 0.75rem;
				}

				.list-info {
					flex: 1;

					.info-title {
						font-size: 1.125rem;
						line-height: 1.56rem;
						margin-top: 0.5rem;
					}

					.info-describe {
						font-size: 0.875rem;
						color: #999;
						line-height: 1.25rem;
						margin-bottom: 0.93rem;
					}

					.rewardBtn-wrap {
						position: relative;

						.list-reward {
							display: inline-block;
							padding: 0.375rem 0.5rem;
							background-color: #FFF3EC;
							font-size: 0.75rem;
							line-height: 1;
							font-weight: 500;
							margin-left: 0.4rem;

							.reward-reward-icon {
								width: 0.75rem;
								height: 0.75rem;
								display: inline-block;
								margin-right: 0.2rem;
							}

							span {
								display: inline-block;
								vertical-align: top;
							}
						}

						.exchange-btn {
							background-color: #79D183;
							font-size: 1rem;
							color: #fff;
							display: inline-block;
							padding: 0.31rem 0.81rem;
							border-radius: 1rem;
							position: absolute;
							right: 0;
							bottom: -0.25rem;
						}
					}
				}

				&[colorscheme="1"] {
					.list-reward {
						background: #FFF2EA !important;

						span {
							color: #CA8417;
						}
					}
				}

				&[colorscheme="2"] {
					.list-reward {
						background: #FFEFF3 !important;

						span {
							color: #FE6268;
						}
					}
				}

				&[colorscheme="3"] {
					.list-reward {
						background: #EBFDEA !important;

						span {
							color: #00A8DC;
						}
					}
				}

				&[colorscheme="4"] {
					.list-reward {
						background: #EBFDEA !important;

						span {
							color: #0A9E19;
						}
					}
				}
			}
		}
	}
</style>