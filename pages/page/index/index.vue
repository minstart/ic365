<template>
	<!-- <view class="page-loading" v-if="pageMask"></view> -->
	<view class="page-wrap">
		<view class="banner-wrap">
			<page-head ref="pageHead" :title='pageHeadTitle' :isHide='true' :isBack='false' :isModule="false" :background="'transparent'"></page-head>
			<view class="user-info-wrap">
				<view class="head-pic-wrap">
					<view class="vip-icon" :vipLevel='userInfo.vipLevel'></view>
					<image class="head-pic" :src='userInfo.avatar || defaultHeadPic' @error="defaultHeadPicUrl" alt=""></image>
				</view>
				<view class="user-info">
					<h3 class="name">{{userInfo.nickname}}同学
						<span class="achievement" v-if="userInfo.showAchievementName">{{userInfo.showAchievementName}}</span>
					</h3>
					<ul class="cumulative-list">
						<li class="list">
							<view class="icon" type="star"></view>
							<h4 class="number">{{userInfo.currencies.star||0}}</h4>
						</li>
						<li class="list">
							<view class="icon" type="stone"></view>
							<h4 class="number">{{userInfo.currencies.stone||0}}</h4>
						</li>
						<li class="list">
							<view class="icon" type="dust"></view>
							<h4 class="number">{{userInfo.currencies.dust||0}}</h4>
						</li>
					</ul>
				</view>
			</view>
			<view class="banner-text-wrap">
				<h3 class="banner-text-title">{{pageData.banner.title}}</h3>
				<h4 class="banner-text-content">{{pageData.banner.content}}</h4>
				<h5 class="banner-text-contentFrom">{{pageData.banner.contentFrom}}</h5>
			</view>
			<image class="statue" :src="userInfo.showCurrencyImg||$store.state.$imgSrc+'/image/analysis_image2.png'"></image>
			<view class="disc"></view>
			<view class="activity-wrap">
				<image class="activity" @click="jumpPage({url:'/pages/page/study/calendar'})" :src="$store.state.$imgSrc+'/image/1_challenge.png'"></image>
				<image class="activity" @click="jumpPage({url:'/pages/page/team/team',type:'reLaunch'})" :src="$store.state.$imgSrc+'/image/1_study.png'"></image>
			</view>
		</view>
		<view class="plan-wrap uni-padding-wrap">
			<view class="item-title-wrap">
				<h3 class="item-title">今日学习目标</h3>
				<view class="item-subtitle">AI智能推荐</view>
				<view class="item-more">
					<view class="text icon-more" @click="jumpPage({url:'/pages/page/user/taskList'})">更多任务</view>
				</view>
				<!-- {{plan.finished}}/{{plan.total}} 完成 -->
			</view>
			<!-- 暂无数据 -->
			<view class="no-list-tip" v-if="plan.list && plan.list.length==0">暂无数据</view>
			<ul class="plan-list-wrap">
				<li class="plan-list next-icon" v-for="(item,i) in plan.list" :key="item.missionId" :type="item.missionTypeId" :colorScheme="item.colorScheme" @click="openTaskDetails(item)">
					<!-- <image class="plan-background" :src="planBackground(item.missionTypeId)"></image> -->
					<!-- <view class="plan-background"></view> -->
					<view class="plan-list-type-back">
						{{item.typeName}}
					</view>
					<view class="list-wrap">
						<view class="flex-center">
							<image class="plan-list-icon" :src="item.cover"></image>
						</view>
						<view class="list-info">
							<view class="plan-list-name-wrap">
								<view class="plan-list-name">{{item.name}}</view>
								<view class="plan-reward" v-if="item.rewardName">
									<image class="plan-reward-icon" :src="rewardIcon(item.currencyTypeId).min"></image>
									<span>{{item.rewardName}}</span>
								</view>
							</view>
							<!-- 任务要求 -->
							<view class="plan-list-require">{{item.subTitle}}</view>
							<!-- 进度条 -->
							<view class="progress-wrap">
								<progress :percent="item.processTotal" activeColor="#77D182" backgroundColor="#ffffff" stroke-width="8" />
							</view>
							<view class="time-limited-wrap" v-if="item.endTime>0">
								<view class="time-limited">
									限时活动 剩余{{calculateTimeDifference(item.endTime*1000).days}}天 {{calculateTimeDifference(item.endTime*1000).hours}}小时
								</view>
							</view>
						</view>
					</view>
				</li>
			</ul>
		</view>
		<view class="plan-recommend-wrap uni-padding-wrap">
			<view class="item-title-wrap">
				<h3 class="item-title">推荐学习</h3>
			</view>
			<view class="no-list-tip" v-if="videos.length==0">暂无数据</view>
			<ul class="plan-recommend-list-wrap">
				<li class="plan-recommend-list" :key="item.videoId" v-for="(item,i) in videos" @click="jumpPage({url:'/pages/page/study/answerQuestions?pageType=video&categoryId='+item.categoryId+'&videoId='+item.videoId})">
					<view class="is-vip" :vipLevel='item.vipLevel'></view>
					<view class="list-icon"></view>
					<view class="title-wrap">
						<view class="title">{{item.categoryName}}</view>
					</view>
				</li>
			</ul>
		</view>
		<view class="plan-recommend-wrap uni-padding-wrap">
			<view class="item-title-wrap">
				<h3 class="item-title">最新成就</h3>
				<view class="item-more">
					<view class="text icon-more" @click="jumpPage({url:'/pages/page/user/achievementDetails'})">查看全部</view>
				</view>
			</view>
			<view class="achievement-wrap">
				<image class="achievement-back" :src="$store.state.$imgSrc+'/image/1_achievement_back.png'"></image>
				<view class="achievement-statistics">
					{{achievement.obtained}}
					/
					{{achievement.total}}
				</view>
				<view class="recently-achievement">
					<view class="recently-achievement-list" v-if="achievement&&achievement.list&&achievement.list.length>0" v-for="(item,i) in newAchievement" :key="item.achievementId">
						<image class="achievement-head-pic" :src="item.imgPath || defaultAchievementIcon" @error="defaultAchievementIconUrl(i)"></image>
						<view class="achievement-info">
							<view class="achievement-name">{{item.name}}</view>
							<view class="achievement-from text-ellipsis2">{{item.subtitle}}</view>
							<view class="achievement-time">
								<view v-if="item.rare!=0" class="achievement-rare" :typeId="item.type">
									<view class="achievement-rare-icon"></view>
									<span>{{item.typeName}}成就</span>
								</view>
								<span>{{changeDate(item.obtainTimeUnix*1000).fullDate}}</span>
							</view>
						</view>
					</view>
				</view>
				<ul class="more-achievement">
					<li class="achievement-list" v-if="achievement&&achievement.list&&achievement.list.length>0" v-for="(item,i) in otherAchievement" :key="item.achievementId">
						<div class="achievement-list-pic-wrap flex-center">
							<image class="achievement-list-pic" :src="item.imgPath || defaultAchievementIcon" @error="defaultAchievementMoreIconUrl(i)"></image>
						</div>
						<view class="achievement-list-back"></view>
						<view class="achievement-list-name">{{item.name}}</view>
						<view class="achievement-list-time">{{changeDate(item.obtainTimeUnix*1000).fullDate}}</view>
					</li>
				</ul>
			</view>
		</view>
	</view>
	<uni-popup ref="rewardPopUp" :mask-click="false" type="center">
		<reward-pop-up :close="closeRewardPopUp"></reward-pop-up>
	</uni-popup>
	<uni-popup ref="taskPopUp" :mask-click="false" type="bottom">
		<task-details :details='taskDetails' :close="closeTaskPopUp"></task-details>
	</uni-popup>
</template>
<script>
	import store from '/store/index.js';
	import commonJs from '/common/js/common.js';

	function getTimeOfDay() {
		const now = new Date();
		const hours = now.getHours();

		if (hours < 12) {
			return '早上';
		} else if (hours < 18) {
			return '下午';
		} else {
			return '晚上';
		}
	}
	export default {
		mixins: [commonJs],
		components: {

		},
		props: {

		},
		computed: {
			newAchievement() {
				this.achievement.list.map(img => img.imgPath || this.defaultAchievementIcon);
				return this.achievement.list.slice(0, 1)
			},
			otherAchievement() {
				this.achievement.list.map(img => img.imgPath || this.defaultAchievementIcon);
				return this.achievement.list.slice(0, 3)
			},
		},
		data() {
			return {
				pageHeadTitle: "",
				isSpecial: false, //是否已经检测过app安装包升级
				cumulative: [],
				defaultHeadPic: store.state.defaultHeadPic, //默认头像
				defaultAchievementIcon: this.$store.state.$imgSrc + "/image/head_pic.png", // 默认成就图标
				// 活动列表
				activityList: [],
				// 推荐学习
				videos: [],
				// 推荐学习背景色默认随机数顺序
				videosBackArr: [{
						background: "#DFE6FF",
						background2: "#879EF6",
					},
					{
						background: "#E5F9E6",
						background2: "#71D874",
					},
					{
						background: "#F8DE96",
						background2: "#FF9743",
					},
					{
						background: "#FAD8B9",
						background2: "#D8A374",
					},
					{
						background: "#F9EBE5",
						background2: "#FF9696",
					},
					{
						background: "#FFE1FC",
						background2: "#E48BF8",
					},
				],
				randomBack: [], //推荐学习背景色随机数后的数组
				// 学习模块
				plan: {
					list: []
				},
				// 最新成就
				achievement: {},

				userInfo: {
					nickname: "",
					currencies: {

					}
				},
				pageData: {
					banner: {
						bannerBack: "#3c25b9",
						title: " ",
						content: "数学是真理的永恒表现形式",
						contentFrom: "- 卡尔·弗里德里希·高斯"
					}
				},
				taskDetails: {}, //选中的任务详情

			};
		},
		onLoad() {

		},

		onReady() {
			store.state.taskbarHeight = uni.getSystemInfoSync().statusBarHeight * 2 + "rpx"
			const deviceInfo = uni.getDeviceInfo()
			const appInfo = uni.getSystemInfoSync()
			// console.log("设备信息：：：",deviceInfo)
			// console.log("安装包版本：：：",appInfo)
			let recordActivity = {
				deviceModel: deviceInfo.deviceBrand + deviceInfo.deviceModel,
				osVersion: deviceInfo.system,
				appVersion: appInfo.appVersion,
				uniqueId: deviceInfo.deviceId
			}
			this.randomBack = this.videosBackArr.sort(() => Math.random() - 0.5);
			// 记录用户设备信息
			this.commonRequest({
				url: "/api/student/recordActivity",
				notLoading: true,
				data: recordActivity
			}).then(res => {
				// console.log("加载app时传输用户设备信息：",res)

			}).catch(error => {
				// console.log("记录用户设备信息报错：：", error)
			})

		},
		onShow() {
			this.verifLogin().then(data => {
				// 获取用户信息
				this.commonRequest({
					url: "/api/student/info"
				}).then(res => {
					console.log("获取用户信息::", res)
					try {
						store.commit("Update_UserInfo", res.data)
						this.userInfo = res.data;

						this.pageData.banner.title = getTimeOfDay() + "好，" + this.userInfo.nickname + "同学" + (this.userInfo.showAchievementName ? '，' + this.userInfo.showAchievementName : "") + '。'
					} catch (e) {}
					// 全新用户，需要选年级

					if (res.data.grade == 0) {
						uni.redirectTo({
							url: '/pages/page/index/supplement_info?pageFrom=' + data.pathUrl
						});
						return false;
					}
					// 测试人员，安装新线上测试包
					if (res.data.special && !this.isSpecial) {
						//#ifdef APP-PLUS
						// 获取本地应用资源版本号
						plus.runtime.getProperty(plus.runtime.appid, (inf) => {
							// console.log(plus.runtime.appid)
							// console.log(uni.getSystemInfoSync().platform)
							// console.log(inf.versionCode)
							// return false;
							//获取服务器的版本号
							this.commonRequest({
								url: '/api/common/app-version', //示例接口
								data: {
									edition_type: plus.runtime.appid,
									version_type: uni.getSystemInfoSync().platform, //android或者ios
									edition_number: inf.versionCode, // 打包时manifest设置的版本号 
									user_id: res.data.userId
								}
							}).then(res => {
								this.isSpecial = true;
								console.log("检测升级返回的数据：", res)
								//res.data.xxx根据后台返回的数据决定（我这里后端返回的是data），所以是res.data.data
								//判断后台返回版本号是否大于当前应用版本号 && 是否发行 （上架应用市场时一定不能弹出更新提示）
								if (Number(res.data.edition_number) > Number(inf.versionCode) && res.data.edition_issue == 1) {

									//如果是wgt升级，并且是静默更新 （注意！！！ 如果是手动检查新版本，就不用判断静默更新，请直接跳转更新页，不然点击检查新版本后会没反应）
									if (res.data.package_type == 1 && res.data.edition_silence == 1) {

										//调用静默更新方法 传入下载地址
										silenceUpdate(res.data.edition_url)

									} else {
										//跳转更新页面 （注意！！！如果pages.json第一页的代码里有一打开就跳转其他页面的操作，下面这行代码最好写在setTimeout里面设置延时3到5秒再执行）
										setTimeout(function() {
											uni.navigateTo({
												url: '/uni_modules/rt-uni-update/components/rt-uni-update/rt-uni-update?obj=' +
													JSON.stringify(res.data)
											});
										}, 3000)

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
					}
				}).catch(error => {
					console.log("获取用户信息报错：：", error)
				})

				// 获取推荐学习
				this.commonRequest({
					url: "/api/recommend/videos"
				}).then(res => {
					console.log("推荐学习::", res.data)
					try {
						this.videos = res.data;
					} catch (e) {}
				}).catch(error => {
					console.log("获取推荐学习失败：：", error)
				})

				// 获取任务列表
				this.commonRequest({
					url: "/api/mission/getAll",
					data: {
						size: 3
					}
				}).then(res => {
					console.log("首页任务列表::", res)
					try {
						this.plan = res.data;
					} catch (e) {}

				}).catch(error => {
					console.log("获取任务列表报错：：", error)
				})

				// 获取我的成就
				this.commonRequest({
					url: "/api/achievement/mine"
				}).then(res => {
					console.log("最新成就::", res)
					try {
						this.achievement = res.data;
					} catch (e) {}

				}).catch(error => {
					console.log("获取最新成就失败：：", error)
				})

				// 通知消息（成就奖励、任务奖励）
				this.commonRequest({
					url: "/api/notice/getAll"
				}).then(res => {
					console.log("通知消息::", res.data)
					try {
						if (res.data.length > 0) {
							this.$store.state.rewardPopUpList = res.data;
							this.$refs.rewardPopUp.open('center')
						} else {
							this.closeRewardPopUp()
						}
					} catch (e) {}
				}).catch(error => {
					console.log("通知消息失败：：", error)
				})

			}).catch(error => {
				console.log("没有登录：：", error)
			})

			// this.jumpPage({url:"/pages/page/study/answerQuestions?pageType=errorList"})
			this.pageOnShowSet({
				uniHide: "all"
			}).then(res => {})
		},
		onHide() {

		},
		watch: {},
		methods: {
			// 用户头像默认图标
			defaultHeadPicUrl() {
				this.userInfo.avatar = this.$store.state.$imgSrc + '/image/head_pic.png';
				return this.$store.state.$imgSrc + '/image/head_pic.png';
			},
			// 成就默认图标
			defaultAchievementIconUrl(i) {
				this.achievement.list[i].imgPath = this.defaultAchievementIcon;
			},
			defaultAchievementMoreIconUrl(i) {
				this.achievement.list[i + 1].imgPath = this.defaultAchievementIcon;
			},
			// 设置任务列表背景图
			planBackground(id) {
				switch (id) {
					case 1:
						// 每日口算
						return this.$store.state.$imgSrc + "/image/1_task_arithmetic.png";
						break;
					case 2:
						break;
					case 3:
						break;
					case 4:
						break;
					case 5:
						// 圣诞欢乐颂
						return this.$store.state.$imgSrc + "/image/1_task_christmas.png";
						break;
					case 6:
						break;
					case 7:
						// 分数认识
						return this.$store.state.$imgSrc + "/image/1_task_fraction.png";
						break;
					case 8:
						// 图形拼图
						return this.$store.state.$imgSrc + "/image/1_task_jigsaw.png";
						break;
				}
			},
			//关闭弹窗 
			closeRewardPopUp() {
				this.$refs.rewardPopUp.close()
			},
			closeTaskPopUp() {
				this.$refs.taskPopUp.close()
			},
			// 打开任务详情
			openTaskDetails(item) {
				let isOther = this.openTask(item);
				if (isOther) {
					// 已经做完了或其他情况，查看任务详情
					this.taskDetails = item;
					this.$refs.taskPopUp.open("bottom")
				}
			}
		}
	};
</script>

<style>
	@import '../../../common/uni-nvue.css';
</style>

<style lang="scss" scoped>
	@import "/static/css/standard.scss";

	.banner-wrap {
		padding: 20rpx 24rpx 0 24rpx;
		// display: flex;
		min-height: 830rpx;
		background: url($imgSrc+'/image/1_header_banner.png') no-repeat top / 100%;
		position: relative;

		.user-info-wrap {
			display: flex;
			// position: absolute;
			// bottom: 560rpx;

			.head-pic-wrap {
				.vip-icon {
					right: 12rpx;
				}
			}

			.head-pic {
				width: 96rpx;
				height: 96rpx;
				border-radius: 50%;
				background: #fff;
				overflow: hidden;
				margin-right: 16rpx;
				border-radius: 96rpx;
				border: 4rpx solid #fff;
				position: relative;
			}

			.user-info {
				.name {
					margin: 8rpx 0;
					line-height: 50rpx;
					font-size: 40rpx;

					.achievement {
						margin-left: 8rpx;
						padding: 0 16rpx;
						color: #eb7d1e;
						font-size: 26rpx;
						background: #FFFBDB;
						line-height: 50rpx;
						display: inline-block;
						vertical-align: top;
					}
				}

				.cumulative-list {
					overflow: hidden;

					.list {
						float: left;
						margin-right: 0.8rem;

						.icon {
							width: 0.75rem;
							height: 0.75rem;
							display: inline-block;
							margin-right: 0.56rem;

							&[type="star"] {
								background-image: url($imgSrc+"/icons/star.png");
								background-repeat: no-repeat;
								background-position: center;
								background-size: 100% 100%;
							}

							&[type="stone"] {
								background-image: url($imgSrc+"/icons/stone.png");
								background-repeat: no-repeat;
								background-position: center;
								background-size: 100% 100%;
							}

							&[type="dust"] {
								background-image: url($imgSrc+"/icons/dust.png");
								background-repeat: no-repeat;
								background-position: center;
								background-size: 100% 100%;
							}
						}

						.number {
							display: inline-block;
							font-size: 0.875rem;
							color: #EB7D1E;
						}
					}
				}
			}
		}

		.banner-text-wrap {
			color: #00362B;
			margin-left: 1rem;
			font-size: 1.1rem;
			position: absolute;
			bottom: 300rpx;
			width: 420rpx;

			* {
				text-shadow: 0px 2px 3px #fff;
			}

			.banner-text-title {
				margin-bottom: 0.6rem;
				font-size: 1.06rem;
			}

			.banner-text-content {
				margin-bottom: 0.2rem;
				font-size: 0.93rem;
				display: block;
			}

			.banner-text-contentFrom {
				font-size: 0.8rem;
			}
		}

		.statue {
			position: absolute;
			right: 50rpx;
			bottom: 310rpx;
			width: 218rpx;
			height: 268rpx;
			z-index: 2;
		}

		.disc {
			position: absolute;
			right: 70rpx;
			bottom: 230rpx;
			width: 180rpx;
			height: 180rpx;
			z-index: 1;
			border-radius: 218rpx;
			transform: rotateX(75deg);
			background-color: #145C35;
			opacity: 0.4;
		}

		.activity-wrap {
			margin-top: 126rpx;
			display: flex;
			position: absolute;
			bottom: 0;
			width: calc(100% - 48rpx);

			.activity {
				flex: 1;
				overflow: hidden;
				position: relative;
				overflow: hidden;
				border-radius: 0.6rem;
				height: 7.375rem;
			}
		}

	}

	.plan-wrap {
		margin-bottom: 1rem;

		// 学习目标 - 列表---------Start
		.no-plan-list {
			padding: 1rem;
			font-size: 1rem;
			text-align: center;
		}

		.plan-list-wrap {
			.plan-list {
				margin: 0.75rem 0;
				position: relative;

				// display: flex;
				.plan-background {
					width: 100%;
					height: 6.5rem;
				}

				.plan-list-type-back {
					width: 1.9rem;
					height: 1.7rem;
					line-height: 1.5rem;
					font-size: 0.75rem;
					color: #fff;
					padding-left: 0.3rem;
					position: absolute;
					left: -0.2rem;
					top: 1rem;
					z-index: 2;
				}

				.list-wrap {
					display: flex;

					.plan-list-icon {
						width: 142rpx;
						height: 142rpx;
						margin: 32rpx 38rpx 32rpx 50rpx;
						// position: absolute;
						// top: 1rem;
						// left: 50rpx;
					}

					.list-info {
						flex: 1;

						// 列表标题名称 + 奖励
						.plan-list-name-wrap {
							// position: absolute;
							position: relative;
							padding-top: 1rem;
							left: 0;
							width: 400rpx;

							.plan-list-name {
								display: inline-block;
								font-size: 1.125rem;
								font-weight: 700;
								line-height: 48rpx;
							}

							.plan-reward {
								display: inline-block;
								vertical-align: top;
								height: 48rpx;
								background-color: #fff;
								font-size: 0.75rem;
								line-height: 1;
								font-weight: 500;
								margin-left: 0.4rem;
								padding: 0 16rpx;

								.plan-reward-icon {
									width: 24rpx;
									height: 24rpx;
									display: inline-block;
									margin: 12rpx 0;
									margin-right: 0.2rem;
								}

								span {
									display: inline-block;
									vertical-align: top;
									line-height: 48rpx;
								}

							}

						}

						// 任务要求
						.plan-list-require {
							// position: absolute;
							position: relative;
							left: 0;
							margin-top: 4rpx;
							// top: 2.8rem;
							// right: 0.75rem;
							width: 400rpx;
							font-size: 0.75rem;
						}

						//进度条 
						.progress-wrap {
							position: relative;
							left: 0;
							margin-top: 26rpx;
							// position: absolute;
							// bottom: 1.4rem;
							// right: 0.75rem;
							width: 400rpx;
							overflow: hidden;
							border-radius: 0.5rem;
						}

						// 限时倒计时
						.time-limited-wrap {
							// position: absolute;
							position: relative;
							left: 0;
							padding-top: 4rpx;
							// bottom: 1.1rem;
							// right: 0.75rem;
							width: 400rpx;
							overflow: hidden;

							// 活动倒计时
							.time-limited {
								padding: 0 0.3rem 0 1rem;
								margin: 10rpx 0 28rpx 0;
								font-weight: 700;
								font-size: 0.75rem;
								color: #fff;
								line-height: 1.3rem;
								display: inline-block;
								background: url($imgSrc+"/image/1_time_limited.png") no-repeat left / 100% 100%;
							}
						}

					}
				}




				&[colorscheme="1"] {
					background: #FFF2EA;

					.plan-list-type-back {
						background: url($imgSrc+"/image/1_plan_label1.png") no-repeat center / 100% 100%;
					}

					.plan-list-name-wrap {
						.plan-list-name {
							color: #712A02;
						}

						.plan-reward {
							span {
								color: #CA8417;
							}
						}
					}

					.plan-list-require {
						color: #CA590B;
					}
				}

				&[colorscheme="2"] {
					background: #FFEFF3;

					.plan-list-type-back {
						background: url($imgSrc+"/image/1_plan_label2.png") no-repeat center / 100% 100%;
					}

					.plan-list-name-wrap {
						.plan-list-name {
							color: #FC4148;
						}

						.plan-reward {
							span {
								color: #FE6268;
							}
						}
					}

					.plan-list-require {
						color: #E95C61;
					}
				}

				&[colorscheme="3"] {
					background: #EBFDEA;

					.plan-list-type-back {
						background: url($imgSrc+"/image/1_plan_label3.png") no-repeat center / 100% 100%;
					}

					.plan-list-name-wrap {
						.plan-list-name {
							color: #004264;
						}

						.plan-reward {
							span {
								color: #00A8DC;
							}
						}
					}

					.plan-list-require {
						color: #008BD0;
					}
				}

				&[colorscheme="4"] {
					background: #EBFDEA;

					.plan-list-type-back {
						background: url($imgSrc+"/image/1_plan_label4.png") no-repeat center / 100% 100%;
					}

					.plan-list-name-wrap {
						.plan-list-name {
							color: #51750E;
						}

						.plan-reward {
							span {
								color: #0A9E19;
							}
						}
					}

					.plan-list-require {
						color: #0A9E19;
					}
				}
			}
		}
	}

	// 学习目标 - 列表---------End
	.plan-recommend-list-wrap {
		display: flex;

		.plan-recommend-list {
			position: relative;
			flex: 1;
			padding: 20rpx 20rpx 20rpx 20rpx;
			margin-right: 0.68rem;
			min-height: 180rpx;
			border-radius: 40rpx;

			.title-wrap {
				display: flex;
				align-items: center;
				position: relative;
				width: 100%;
				height: 60rpx;
				text-align: center;
				font-size: 26rpx;
				color: #323232;

				.title {
					flex: 1;
				}
			}

			.list-icon {
				width: 132rpx;
				height: 132rpx;
				margin: 0 auto;
				border-radius: 132rpx;
				margin-bottom: 12rpx;
			}

			.is-vip {
				position: absolute;
				right: 2rpx;
				top: 2rpx;
				width: 58rpx;
				height: 50rpx;

				&[vipLevel='0'] {
					background: url($imgSrc+'/icons/recommend_video_novip.png') no-repeat center / 100% 100%;
				}

				&[vipLevel='1'],
				&[vipLevel='2'],
				&[vipLevel='3'] {
					background: url($imgSrc+'/icons/recommend_video_vip.png') no-repeat center / 100% 100%;
				}
			}

			&:nth-child(1) {
				box-shadow: 0 0 12rpx #b2dffd;

				.list-icon {
					background: url($imgSrc+"/icons/recommend_video1.png") no-repeat center / 100% 100%;
				}
			}

			&:nth-child(2) {
				box-shadow: 0 0 12rpx #fdd1a0;

				.list-icon {
					background: url($imgSrc+"/icons/recommend_video2.png") no-repeat center / 100% 100%;
				}
			}

			&:nth-child(3) {
				box-shadow: 0 0 12rpx #fdf391;

				.list-icon {
					background: url($imgSrc+"/icons/recommend_video3.png") no-repeat center / 100% 100%;
				}
			}

			&:last-child {
				margin-right: 0;
			}
		}
	}

	// 最新成就  -------------Start
	.achievement-wrap {
		position: relative;

		.achievement-back {
			width: 100%;
			height: 23.625rem;
		}

		// 成就统计
		.achievement-statistics {
			font-size: 1rem;
			color: #FFFFFF;
			position: absolute;
			top: 0.4rem;
			left: 81%;
			font-weight: 500;
		}

		// 最新成就
		.recently-achievement {
			position: absolute;
			top: 40rpx;
			width: 90%;
			left: 0;
			right: 0;
			margin: 0 auto;

			.achievement-head-pic {
				width: 164rpx;
				height: 164rpx;
				display: inline-block;
				margin-right: 1rem;
				border-radius: 100%;
				border: 4rpx solid #7FD488;
				overflow: hidden;
			}

			.achievement-info {
				display: inline-block;
				vertical-align: top;
				max-width: 13rem;

				.achievement-name {
					font-size: 1.25rem;
					color: #0E562F;
					font-weight: 700;
				}

				.achievement-from {
					font-size: 0.9rem;
					color: #09916A;
					margin: 0.2rem 0 0.5rem 0;
				}

				.achievement-time {
					color: #065E4F;
					font-size: 0.81rem;

					span {
						display: inline-block;
						vertical-align: top;
						line-height: 52rpx;
					}

					.achievement-rare {
						color: #EB7D1E;
						background: #FFFBDB;
						display: inline-block;
						padding: 0 16rpx;
						margin-right: 12rpx;

						// span{
						// 	line-height: 52rpx;
						// 	display: inline-block;
						// }
						.achievement-rare-icon {
							width: 26rpx;
							height: 26rpx;
							margin-right: 8rpx;
							display: inline-block;
							margin-top: 12rpx;
						}

						&[typeid="0"] {
							.achievement-rare-icon {
								background: url($imgSrc+"/icons/achievement_1.png") no-repeat top/ 100% 100%;
							}
						}

						&[typeid="1"] {
							.achievement-rare-icon {
								background: url($imgSrc+"/icons/achievement_2.png") no-repeat top/ 100% 100%;
							}
						}

						&[typeid="2"] {
							.achievement-rare-icon {
								background: url($imgSrc+"/icons/achievement_3.png") no-repeat top/ 100% 100%;
							}
						}

						&[typeid="3"] {
							.achievement-rare-icon {
								background: url($imgSrc+"/icons/achievement_4.png") no-repeat top/ 100% 100%;
							}
						}

						&[typeid="4"] {
							.achievement-rare-icon {
								background: url($imgSrc+"/icons/achievement_5.png") no-repeat top/ 100% 100%;
							}
						}
					}
				}
			}
		}

		// 最近成就
		.more-achievement {
			width: 100%;
			position: absolute;
			top: 13rem;
			// display: flex;

			.achievement-list {
				text-align: center;
				width: 33.33%;
				float: right;

				.achievement-list-pic-wrap {
					width: 180rpx;
					height: 180rpx;
					margin: 0 auto;
				}

				.achievement-list-pic {
					width: 136rpx;
					height: 136rpx;
					clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
					overflow: hidden;
					/* 隐藏超出部分 */
				}

				&:nth-child(1) {
					.achievement-list-pic-wrap {
						background: url($imgSrc+"/image/1_achievement_back1.png") no-repeat center / 100% 100%;
					}
				}

				&:nth-child(2) {
					.achievement-list-pic-wrap {
						background: url($imgSrc+"/image/1_achievement_back2.png") no-repeat center / 100% 100%;
					}
				}

				&:nth-child(3) {
					.achievement-list-pic-wrap {
						background: url($imgSrc+"/image/1_achievement_back3.png") no-repeat center / 100% 100%;
					}
				}

				.achievement-list-back {
					width: 3.56rem;
					height: 0.5rem;
					border-radius: 50%;
					background-color: #79D183;
					opacity: 0.45;
					margin: 0.2rem auto;
				}

				.achievement-list-name {
					color: #0E562F;
					font-size: 1.06rem;
					font-weight: 500;
					line-height: 1.5rem;
					padding: 0 10rpx;
				}

				.achievement-list-time {
					color: #09916A;
					font-size: 0.75rem;
					line-height: 1.25rem;
				}
			}
		}
	}

	// 最新成就  -------------End
</style>