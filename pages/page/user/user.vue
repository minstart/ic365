<template>
	<!-- <view class="page-loading" v-if="pageMask"></view> -->
	<view class="page-wrap">
		<page-head :isHide='true' :isBack='false' :isModule="false" :background="'transparent'"></page-head>
		<view class="banner-wrap">
			<view class="btn-wrap">
				<view class="user-set-btn" @click="jumpPage({url:''})"></view>
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
					<view class="flex-center">
						<view class="qr-code" @click="jumpPage({url:'/pages/page/team/invite_team'})"></view>
					</view>
				</view>
				<view class="property">
					<view class="property-item">
						<h3 class="item-info-num">{{userInfo.currencies.star||0}}</h3>
						<view class="item-info-title">智慧星</view>
					</view>
					<view class="property-item">
						<h3 class="item-info-num">{{userInfo.currencies.stone||0}}</h3>
						<view class="item-info-title">启明石</view>
					</view>
					<view class="property-item">
						<h3 class="item-info-num">{{userInfo.currencies.dust||0}}</h3>
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
				<view class="tab-list" :class="selectedClass(i)" :current='i' @click="clickTab(i)" v-for="(item,i) in practiceList">
					{{item.title}}
				</view>
			</view>
			<view class="tab-list-content">
				<view class="tab-list" :current='current' v-if="current === 0">
					<view class="no-list-tip" v-if="practiceList[current].list.length==0">暂无数据</view>
					<!-- 我的练习 -->
					<view class="practice-list" v-for="item in practiceList[current].list" @click="jumpPage({url:''})">
						<image class="list-icon" :src="item.coverUrl" mode=""></image>
						<view class="list-info">
							<h3 class="title">{{item.title}}</h3>
							<view class="introduce">{{item.introduce}}</view>
						</view>
					</view>
				</view>
				<view class="tab-list" :current='current' v-if="current === 1">
					<view class="no-list-tip" v-if="practiceList[current].list.length==0">暂无数据</view>
					<!-- 我的错题 -->
					<view class="practice-list" v-for="item in practiceList[current].list" @click="jumpPage({url:'/pages/page/study/answerQuestions?pageType=video&keyword='+item.title})">
						<image class="list-icon" :src="item.coverUrl" mode=""></image>
						<view class="list-info">
							<h3 class="title">{{item.title}}</h3>
							<view class="introduce">{{item.introduce}}</view>
						</view>
					</view>
				</view>
				<view class="tab-list" :current='current' v-if="current === 2">
					<!-- 我的兑换 -->
					<view class="practice-list" v-for="item in practiceList[current].list" @click="jumpPage({url:item.jumpUrl})">
						<image class="list-icon" :src="item.coverUrl" mode=""></image>
						<view class="list-info">
							<h3 class="title">{{item.title}}</h3>
							<view class="introduce">{{item.introduce}}</view>
						</view>
					</view>
				</view>
				<view class="tab-list" :current='current' v-if="current === 3">
					<view class="no-list-tip" v-if="practiceList[current].list.length==0">暂无数据</view>
					<!-- 我的任务 -->
					<view class="practice-list" v-for="item in practiceList[current].list" @click="jumpPage({url:''})">
						<image class="list-icon" :src="item.coverUrl" mode=""></image>
						<view class="list-info">
							<h3 class="title">{{item.title}}</h3>
							<view class="introduce">
								<span>{{item.introduce}}</span>
								<view class="progress-wrap">
									<progress :percent="item.completedCount / item.totalCount * 100" :activeColor="item.colorValue||'#77D182'" backgroundColor="#ffffff" stroke-width="10" />
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 我的tab相关 ------End -->
			<!-- 皮肤tab ------Start -->
			<view class="skin-tab-wrap">
				<view class="skin-tab-list-wrap">
					<h3 class="skin-tab-list flex-center" :class="selectedClass2(i)" :current='i' @click="clickTab2(i)" v-for="(item,i) in skinList" v-html="item.resourceTypeName">
					</h3>
				</view>
				<view class="skin-tab-content">
					<view class="tab-list" v-for="(item,i) in skinList" :current='i' v-show="skinCurrent === i">
						<view class="skin-list" v-for="item in skinList[skinCurrent].resourceDetails">
							<image class="list-icon" :src="item.icon" mode=""></image>
							<view class="list-info ">
								<view class="flex-center">
									<view>
										<h3 class="title">{{item.name}}</h3>
										<view class="introduce">{{item.subtitle}}</view>
										<view class="isObtain back-green" v-if="item.possessed==2">使用中</view>
										<view class="isObtain back-green" v-if="item.possessed==1">已获取</view>
										<view class="isObtain" v-if="item.possessed==0">未获得</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 皮肤tab ------End -->
			<!-- 兑换商城 ------Start -->
			<view class="exchange-wrap">
				<view class="item-title-wrap">
					<h3 class="item-title">兑换商城</h3>
					<view class="item-more">
						<view class="text icon-more" @click="jumpPage({url:'/pages/page/user/exchangeMall'})">查看更多</view>
					</view>
				</view>
				<!-- 暂无数据 -->
				<view class="no-list-tip" v-if="exchangeList.length==0">暂无数据</view>
				<ul class="exchange-list-wrap">
					<li class="exchange-list" v-for="(item,i) in exchangeList" :type="item.missionTypeId" :colorscheme="item.colorScheme">
						<image class="list-icon" :src="item.icon"></image>
						<view class="list-info">
							<h3 class="info-title">{{item.productName}}</h3>
							<view class="info-describe">{{item.subtitle}}</view>
							<view class="rewardBtn-wrap">
								<view class="list-reward" v-if="item.payCurrencyTypeName">
									<image class="reward-reward-icon" :src="rewardIcon(item.payCurrencyType)"></image>
									<span>{{item.quantity}}{{item.payCurrencyTypeName}}</span>
								</view>
								<view class="exchange-btn" :class="item.obtained&&'already-redeemed'" @click="() => exchange(item)">{{!item.obtained?'立即兑换':'已拥有'}}</view>
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
				current: 0, //选项卡显示下标
				practiceList: [{
						title: "我的任务",
						list: []
					},
					{
						title: "我的练习",
						list: [{
								coverUrl: "/static/icons/recently_practiced.png",
								title: "最近练习",
								introduce: "查看最近的练习记录",
								unRead: ""
							},
							{
								coverUrl: "/static/icons/collecting_exercises.png",
								title: "收藏练习",
								introduce: "",
								unRead: ""
							}

						]
					},
					{
						title: "我的错题",
						list: []
					},
					{
						title: "我的兑换",
						list: [{
								coverUrl: "/static/icons/exchange_records.png",
								title: "兑换物品",
								introduce: ""
							},
							{
								coverUrl: "/static/icons/exchange_mall.png",
								title: "可兑商品",
								introduce: "",
								jumpUrl: "/pages/page/user/exchangeMall"
							}
						]
					}

				],

				skinCurrent: 0,
				skinList: [],
				exchangeList: []
			}
		},

		onLoad() {

		},
		onReady() {
			const route = getCurrentPages(); //获取当前页面地址
			const pathUrl = route[route.length - 1].route;
			this.verifLogin().then(data => {
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

				// 获取我资源(战衣/皮肤/名人堂...)
				this.commonRequest({
					url: "/api/student/getResourcesGroups"
				}).then(res => {
					if (res.code == 0) {
						this.skinList = res.data.currencies;
					} else {
						uni.showToast({
							title: res.message || "获取我资源(战衣/皮肤/名人堂...)失败!",
							icon: "none"
						});
					}

				}).catch(error => {
					this.consoleLog("获取我资源(战衣/皮肤/名人堂...)报错：：", error)
				})

				// 获取兑换商品列表
				this.commonRequest({
					url: "/api/exchange/products",
					data: {
						size: 3
					}
				}).then(res => {
					console.log("获取兑换商品列表:", res.data)
					this.exchangeList = res.data;
				}).catch(error => {
					this.consoleLog("获取兑换商品列表报错：：", error)
				})

				// 获取最近题目和收藏题目数量
				this.commonRequest({
					url: "/api/question/getRecentlyAndCollection"
				}).then(res => {
					console.log("获取最近题目和收藏题目数量", res.data)
					res.data.recently > 0 ? (this.practiceList[0].list[0].unRead = res.data.recently + "条新记录") : (this.practiceList[0].list[0].unRead = "");
					this.practiceList[0].list[1].introduce = "已收藏" + (res.data.collection || 0) + "个练习"
				}).catch(error => {
					this.consoleLog("获取最近题目和收藏题目数量报错：：", error)
				})

				// 我的错题
				this.commonRequest({
					url: "/api/wrong-records/category-stats"
				}).then(res => {
					// console.log("我的错题：", res.data)
					res.data.forEach(item => {
						this.practiceList[1].list.push({
							coverUrl: item.coverUrl,
							title: item.categoryName,
							introduce: item.total + "道错题待复习",
							unRead: item.highFrequencyErrTotal + "道高频错题"
						})
					})
				}).catch(error => {
					this.consoleLog("我的错题报错：：", error)
				})


				// 获取我的兑换统计
				this.commonRequest({
					url: "/api/exchange/stat"
				}).then(res => {
					console.log("获取我的兑换统计：", res.data)
					this.practiceList[2].list[0].introduce = "已兑换" + (res.data.exchangeTotal || 0) + "件物品"
					this.practiceList[2].list[1].introduce = (res.data.availableExchangeCount || 0) + "件商品可兑换"
					// res.data.recently
					// collection
				}).catch(error => {
					this.consoleLog("获取我的兑换统计报错：：", error)
				})

				// 我的任务
				this.commonRequest({
					url: "/api/mission/mine-stat"
				}).then(res => {
					console.log("我的任务：", res.data)
					res.data.forEach(item => {
						this.practiceList[3].list.push({
							coverUrl: item.cover,
							title: item.name,
							introduce: "已完成" + item.completedCount + "/" + item.totalCount + "个任务",
							totalCount: item.totalCount,
							completedCount: item.completedCount,
						})
					})
				}).catch(error => {
					this.consoleLog("我的任务报错：：", error)
				})
			})
		},
		onShow() {
			this.pageOnShowSet({
				uniHide: "all"
			}).then(data => {
				// this.verifLogin().then(data => {

				// })
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
			exchange(item) {
				if (item.obtained) return false;
				item.obtained = true
				uni.showToast({
					title: "点击了兑换商城的id" + item.productionId,
					icon: "none"
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	uni-page-body {
		background-color: #F4F4F4 !important;
	}

	.page-wrap {
		background: url("/static/image/5_user_back.png") no-repeat top / 100%;
	}

	.banner-wrap {

		.btn-wrap {
			overflow: hidden;
			width: 21.4375rem;
			margin: 0 auto;

			.user-set-btn {
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

			.qr-code {
				width: 2rem;
				height: 2rem;
				background: url("/static/icons/QR_code.png") no-repeat center / 100% 100%;
				border-radius: 0.5rem;
				margin-left: 0.5rem;
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
					font-size: 28rpx;
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
			margin-bottom: 28rpx;

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
				width: 72rpx;
				height: 72rpx;
				display: inline-block;
				margin-right: 20rpx;
				border-radius: 6rpx;
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
					font-size: 28rpx;
					display: flex;

					.progress-wrap {
						width: 200rpx;
						height: 10px;
						border-radius: 16rpx;
						margin: auto 0;
						overflow: hidden;
						margin-left: 40rpx;
					}
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
				max-height: 40rem;
				overflow: auto;

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
						font-size: 28rpx;
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

						.already-redeemed {
							background: #EEFFF0;
							color: #79D183;
							font-size: 1rem;
							border-radius: 1rem;
							border: 0.1rem solid #79D183;
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