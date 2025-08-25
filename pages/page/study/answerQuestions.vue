<template>
	<view class="page-loading" v-if="pageMask"></view>
	<page-meta v-model='fontSize' :page-font-size="fontSize+'px'" :root-font-size="fontSize+'px'"></page-meta>
	<view style="width: 100vw;height: 100vh;overflow: hidden;">
		<page-head :isBack='true' :background="'transparent'" :systemTaskbar="false"></page-head>
		<view class="page-wrap" :style="'padding-left:'+taskbarHeight2">
			<view class="content-wrap">
				<view class="category-wrap">
					<view class="subject-grade-wrap">
						<span class="subject">{{categoryTree.subject}}</span>
						<span> · </span>
						<span class="grade">{{categoryTree.grade}}年级{{categoryTree.semester}}{{treeID}}</span>
					</view>
					<scroll-view class="tree-wrap" scroll-y="true" :scroll-into-view="treeID" :scroll-with-animation="true">
						<view :id="'tree-list-'+item.categoryId" class="tree-list" :class='selectCategory.categoryId == item.categoryId?"tree-selected":""' v-for="(item,i) in categoryTree.category" @click.stop="choiceCategory(item)">
							<view class="tree-list-title">{{item.name}}</view>
							<!-- <view class="tree-list" v-for="(item2,i2) in item.children">
								<view class="tree-list-title">{{item2.categoryName}}</view>
								<div class="tree-list" v-for="(item3,i3) in item2.children">
									<view class="tree-list-title">{{item3.categoryName}}</view>
								</div>
							</view> -->
						</view>
					</scroll-view>
				</view>
				<view class="topic-wrap">
					<view class="topic-function-wrap">
						<view class="search-btn-wrap" v-if="pageType!='everyDay'">
							<input class="search-input" type="text" v-model="keyword" placeholder="你想学什么" />
							<view class="search-btn" @click="getQuestion"></view>
						</view>
						<view class="collect-btn-wrap" v-if="pageType=='question'">
							<view class="collect-btn" :isCollect="topic.isCollect"  @click.stop="collectTopic()">
								<view class="collect-icon"></view>
								{{topic.isCollect?'已收藏':'收藏'}}
							</view>
						</view>
					</view>
					<!-- 答题右下方内容 -->
					<view class="topic-content-wrap" v-if="pageType=='everyDay' || pageType=='question'">
						<view class="topic">
							<h3 class="topic-text">{{topic.content}}</h3>
							<view class="topic-image-wrap">
								<image class="topic-image" :src="item" v-for="item in topic.contentImages"></image>
							</view>
							<view class="topic-options-wrap">
								<view class="topic-options" :class="{
									'selected' : !answered && i===current,
									'check-correct' : answered && i===current && item.optionName === topic.answer,
									'check-error': answered && i===current && item.optionName !== topic.answer,
								}" :current='i' @click="clickOption(item,i)" v-for="(item,i) in changeOptions(topic.options)">
									{{item.optionName}}.{{item.option}}
								</view>
							</view>
							<view class="btn-wrap">
								<button class="topic-next" @click="nextTopic" v-if="pageType=='question'&&answered">下一题</button>
								<button class="topic-submit" @click="submitTopic" v-if="!answered">提交</button>
							</view>

						</view>
						<view class="analysis-wrap">
							<view class="analysis" v-if="answered">
								<view class="analysis-title">
									<span class="title-icon"></span>
									<view class="title">我的答案</view>
								</view>
								<view class="answer-text">{{answer.optionName}}.{{answer.option}}</view>
								<view class="analysis-text" @click="textAnalysis">
									<view class="analysis-icon"></view>
									<span>{{answer.optionName == topic.answer ? '答对了!看看解析来巩固一下!' : '答错了! 看看解析也许会有用!'}}
									</span>
								</view>
								<!-- 视频解析 -->
								<view class="other-analysis-wrap" v-if="topic.videoId && pageType == 'everyDay'">
									<view class="analysis-title">
										<span class="title-icon"></span>
										<view class="title">视频解析</view>
									</view>
									<view class="play-video-btn" @click="playVideo()"></view>
								</view>
								<!-- AI析题 -->
								<view class="lingbao-wrap" v-if="pageType == 'everyDay'">
									<view class="lingbao-icon" @click="AIAnalysis()"></view>
									<view class="lingbao-image"></view>
								</view>
							</view>
						</view>
					</view>
					<!-- 视频列表 -->
					<view class="video-list-wrap">
						<scroll-view class="video-list-window" scroll-y="true" @scrolltolower="GetNextVideoList">
							<view class="name-wrap">
								<view class="name">{{selectCategory.name}} <span class="border"></span></view>
							</view>
							<view class="video-list" v-for="item in videoList.list" @tap.stop="verifyPlayVideo(item)">
								<div class="video-img-wrap flex-center">
									<view class="label">会员</view>
									<image lazy-load class="video-img" :src="item.coverUrl"></image>
								</div>
							</view>
							<view style="float: left;width: 100%;" class="no-list-tip" v-if="videoList.noData"> - 没有更多视频了 -</view>
						</scroll-view>
					</view>
				</view>
			</view>
		</view>
	</view>

	<!-- 视频弹窗 -->
	<!-- 	<uni-popup ref="showVideo" :mask-click="true" type="center">
		<view class="common-popup-wrap">
			<view class="common-popup-close" @click.stop="closePopup"></view>
			<div class="common-popup-content">
				<video id="video1" class="video-view" :src="analysis.video" autoplay="true" duration="" show-fullscreen-btn="false"></video>
			</div>
		</view>
	</uni-popup> -->
	<!-- 视频弹窗 -->
	<l-popup :pageShow="showVideo" :close="closePopup" :width="'calc(80vh / 9 * 16)'">
		<template v-slot>
			<video id="video1" class="video-view" :src="analysis.video" autoplay="true" duration="" show-fullscreen-btn="false"></video>
		</template>
	</l-popup>
	<!-- 文字 + 图片析题弹窗 -->
	<l-popup :pageShow="showAnalysis" :close="closePopup">
		<template v-slot>
			<view class="popup-analysis-wrap">
				<h3 style="margin-bottom: 16rpx;">题目：{{topic.content}}</h3>
				<view class="popup-analysis-text" v-if="topic.analysis" v-html="'解析：'+topic.analysis"></view>
			</view>
		</template>
	</l-popup>
	<!-- AI析题弹窗 -->
	<l-popup :pageShow="showAIAnalysis" :close="closePopup">
		<template v-slot>
			<view class="popup-analysis-wrap">
				<view class="conten-window">
					<h3 style="margin-bottom: 16rpx;">题目：{{topic.content}}</h3>
					<view class="popup-analysis-text" v-if="topic.AIanalysis" v-html="'AI解析：'+topic.AIanalysis.text">
					</view>
					<div class="next-btn-wrap" v-show="AIanalysisNextBtn">
						<view class="next-btn" @click="getAIAnalysis">下一步</view>
					</div>
				</view>
			</view>
		</template>
	</l-popup>
</template>

<script>
	import store from '/store/index.js';
	import commonJs from '/common/js/common.js';
	const imageUrlPattern = /https?:\/\/[^\s]+?\.(?:png|jpg|jpeg|gif|svg)/gi; //图片校验
	export default {
		mixins: [commonJs],
		props: {

		},
		components: {},

		data() {
			return {
				taskbarHeight2: "", //计算任务栏高度，避开左侧摄像头位置
				treeID: "", //树状图左侧菜单滚动位置
				pageType: "", //everyDay 每日一题；question 题目；video 视频
				answered: false, //是否已经回答了问题
				keyword: "", //搜索内容
				time: 0, //答题计时器
				current: "", //选中的答案下标
				answer: {
					optionName: "", //ABCDEF选项
					option: "" //答案内容
				}, //选中的答案
				categoryTree: { //左侧类目树状图
					subject: "数学", //学科
					grade: "",
					semester: "", //接口会返回 fall 上册, spring 下册
					category: [{}]
				},
				analysis: { //分析相关
					text: {},
					images: {},
					video: ""
				},

				showVideo: false, //是否展示是视频弹窗（uni-popup 有毒）
				topic: {}, //题目内容
				context: {},
				showAnalysis: false, //是否展示文本或图片解析弹窗
				showAIAnalysis: false, //是否展示AI解析弹窗
				videoEl: "",
				AIanalysisNextBtn: true, //是否显示AI解析下一步按钮
				selectCategory: { //选中的类目
					categoryId: "", //选中的类目id
					name: "", //选中的类目名称
				},
				recommendCategoryId: "", //推荐视频带过来的CategoryId
				videoList: { //视频列表
					page: 0,
					noData: false, //判断是不是已经没有更多视频了
					list: []
				}
			}
		},
		onLoad(option) {
			this.verifLogin().then(data => {
				option.pageType && (this.pageType = option.pageType);
				option.keyword && (this.keyword = option.keyword);
				option.categoryId && (this.recommendCategoryId = option.categoryId)
				if (this.pageType == "everyDay") {
					// 每日一题 ------ Start
					let requestData = {
						url: "/api/question/today"
					}
					this.changeDate(option.date).fullDate != this.changeDate(new Date()).fullDate && (requestData.date = option.date)
					// 获取今日题目
					this.commonRequest(requestData).then(res => {
						console.log("获取今日题目::", res)
						try {
							this.categoryTree.grade = this.changeGrade(res.data.grade);
							// this.categoryTree.semester = res.data.semester == "fall" ? "上册" : (res.data.semester == "spring" ? "下册" : "");
							this.categoryTree.category[0] = {
								categoryId: res.data.categoryId,
								name: res.data.categoryName
							};
							this.selectCategory = {
								categoryId: res.data.categoryId,
								name: res.data.categoryName
							}
							this.topic = res.data;
							this.topicFilter()
						} catch (e) {
							console.log(e)
						}
					}).catch(error => {
						this.consoleLog("获取今日题目报错：：", error)
					})
					// 每日一题 ------ End
				} else {
					this.getQuestion().then(res => {
						try {
							this.categoryTree.grade = this.changeGrade(store.state.userInfo.info.grade);
						} catch (e) {
							console.log(e)
						}
					})
					if (this.pageType == "video") {
						// 教材同步（视频）------ Start

						// 教材同步（视频）------ End
					}
				}
			})
		},
		onReady() {
			this.context = uni.createVideoContext("video1", this);
			this.taskbarHeight2 = store.state.taskbarHeight
			// console.log(this.taskbarHeight2)
		},
		onShow() {
			/* #ifndef APP-PLUS-NVUE */
			try {
				plus.navigator.setFullscreen(true);
			} catch (e) {}
			/* #endif */
			this.pageOnShowSet({
				uniHide: "all",
				orientation: "landscape"
			}).then(data => {})
		},
		onHide() {

		},
		onUnload() {
			/* #ifndef APP-PLUS-NVUE */
			try {
				// 恢复手机系统栏
				plus.navigator.setFullscreen(false);
			} catch (e) {}
			/* #endif */
		},
		created() {

		},
		mounted() {

		},
		computed: {
			// 给class赋值选中效果和答题后判断
			checkClass() {
				return {
					selected: i === this.current
				}
				// return index === this.current ? 'selected' : '';
			}
		},
		methods: {
			// 选项新增ABCD
			changeOptions(arr) {
				let _arr = [];
				let optionName = ["A", "B", "C", "D", "E", "F"]
				try {
					arr.forEach((item, i) => {
						_arr.push({
							optionName: optionName[i],
							option: item
						})
					})
					return _arr;
				} catch (e) {
					return arr;
				}
			},
			// 年级转换成大写
			changeGrade(id) {
				let arr = ["一", "二", "三", "四", "五", "六"]
				return arr[Number(id) - 1]
			},
			// 答题选中选项
			clickOption(item, i) {
				if (this.current !== i && !this.answered) {
					this.current = i;
					this.answer = item;
				}
			},
			// 题目赋值后，对数据结构进行过滤
			topicFilter() {
				// 题目问题数据处理
				if (this.topic.content.indexOf("http") != -1) {
					// 1. 正则表达式提取图片URL
					const contentImages = this.topic.content.match(imageUrlPattern) || [];
					// 2. 删除图片URL后的文本
					try {
						this.topic.content = this.topic.content.replace(imageUrlPattern, '').trim();
					} catch (e) {}
					this.topic.contentImages = [...this.topic.contentImages, contentImages]
				}

				// 解析数据处理
				if (this.topic.analysis.indexOf("http") != -1) {
					const analysisImages = this.topic.analysis.match(imageUrlPattern) || [];
					this.topic.analysisImages = [...this.topic.analysisImages, ...analysisImages]
					try {
						this.topic.analysisImages.forEach(item => {
							this.topic.analysis = this.topic.analysis.replace(item, '<image class="popup-analysis-img" src="' + item + '" mode=""></image>').trim();
						})
					} catch (e) {}
				}!this.topic.AIanalysis && (this.topic.AIanalysis = {})
				this.topic.AIanalysis = {
					text: "",
					step: 0
				}
				let _this = this;
				let time = setInterval(() => {
					if (_this.answered) {
						clearInterval(time)
					}
					_this.time = _this.time + 1;
				}, 1000)
			},

			// 提交答案
			submitTopic() {
				if (!this.answer.optionName) return uni.showToast({
					title: "请选择答案",
					icon: "none"
				});
				this.answered = true;
				let postData = {
					questionId: this.topic.questionId,
					answer: this.answer.optionName,
					useTime: this.time
					// missionId: "",
					// teamId: "",
					// wrong_record_id: ""
				}
				this.answer.optionName != this.topic.answer && (postData.wrong_record_id = this.topic.questionId)

				// 回答问题
				this.commonRequest({
					url: "/api/question/submit",
					method: "POST",
					data: postData
				}).then(res => {
					try {
						uni.showToast({
							title: (this.answer.optionName == this.topic.answer ? "恭喜你，答对啦(●'◡'●)" : "很遗憾，你答错了~~>_<~~") + "，用时：" + this.time + "秒",
							icon: "none",
							duration: "4000"
						})
					} catch (e) {
						console.log(e)
					}
				}).catch(error => {
					this.consoleLog("回答问题接口报错：：", error)
				})
			},

			// 下一题
			nextTopic() {
				this.resetProblem("question")
				this.choiceCategory(this.selectCategory, true)
			},
			// 教材同步 - 需要校验会员
			verifyPlayVideo(item) {
				if (item) {
					console.log("item", item)
					try {
						this.playVideo(item.videoId)
					} catch (e) {}
				}
			},

			// 每日一题、视频列表 - 打开视频解析
			playVideo(videoId) {
				if (!this.analysis.video || this.pageType == "video") {
					console.log("播放视频id：", videoId || this.topic.videoId)
					this.commonRequest({
						url: "/api/video/getById",
						data: {
							id: videoId || this.topic.videoId
						}
					}).then(res => {
						console.log("获取视频解析地址::", res.data)
						try {
							this.showVideo = true;
							this.analysis.video = res.data
							this.videoEl = uni.createVideoContext('video1'); //创建视频实例指向video
							this.videoEl.seek(0);
							this.videoEl.play();

						} catch (e) {}
					}).catch(error => {
						console.log("获取视频解析地址报错", error)
					})
				} else {
					this.showVideo = true;
					this.videoEl.seek(0);
					this.videoEl.play();
				}
			},

			// 获取AI解析
			getAIAnalysis() {
				if (this.topic.AIanalysis.step != 0) {
					this.AIanalysisNextBtn = false
				}
				if (this.topic.AIanalysis.step == 0 || ((this.topic.AIanalysis.step + 1) <= this.topic.AIanalysis.stepCount)) {
					// console.log("questionId:",this.topic.questionId,",step:",this.topic.AIanalysis.step + 1)
					this.commonRequest({
						url: "/api/ai/getAnalysisByStep",
						data: {
							questionId: this.topic.questionId,
							step: this.topic.AIanalysis.step + 1
						}
					}).then(res => {
						console.log("/api/ai/getAnalysisByStep：：", res.data)
						this.topic.AIanalysis.step = res.data.currentStep;
						this.topic.AIanalysis.stepCount = res.data.stepCount;
						res.data.currentStep < res.data.stepCount ? (this.AIanalysisNextBtn = true) : (this.AIanalysisNextBtn = false)
						this.topic.AIanalysis.text = this.topic.AIanalysis.text + (this.topic.AIanalysis.step != 1 ? "</br></br>" : "") + res.data.content;

						// 解析数据处理
						if (this.topic.AIanalysis.text.indexOf("http") != -1) {
							const analysisImages = this.topic.AIanalysis.text.match(imageUrlPattern) || [];
							try {
								analysisImages.forEach(item => {
									this.topic.AIanalysis.text = this.topic.AIanalysis.text.replace(item, '<image class="popup-analysis-img" src="' + item + '" mode=""></image>').trim();
								})
							} catch (e) {}
						}
					}).catch(error => {
						console.log("AI析题报错", error)
					})
				}
			},

			// 视频、题目类型获取左侧类目目录
			getQuestion() {
				return new Promise((resolve, reject) => {
					this.commonRequest({
						url: "/api/category/getCategoryWithQuestionCountByGrade",
						data: {
							keyword: this.keyword,
							fromType: this.pageType
						}
					}).then(res => {
						console.log("视频、题目类型获取左侧类目目录:", res.data)
						this.resetProblem("all")
						this.categoryTree.category = res.data.categories;
						this.selectCategory = res.data.categories[0]
						if (this.keyword) {
							try {
								res.data.categories.forEach(item => {
									if (item.name == this.keyword || item.categoryId == this.keyword || item.categoryId == this.recommendCategoryId) {
										this.selectCategory = item;
										let _this = this;
										setTimeout(() => {
											_this.treeID = "tree-list-" + item.categoryId;
										}, 1000)
										throw new Error("已经匹配了，终止循环")
									}
								})
							} catch (e) {}
						} else {}
						this.choiceCategory(this.selectCategory, true)
						resolve(res)
					}).catch(error => {
						console.log("视频、题目类型获取左侧类目目录报错", error)
						reject(error)
					})
				})
			},
			
			// 收藏题目
			collectTopic(){
				console.log(this.topic.questionId)
				this.commonRequest({
					url: "/api/question/collection",
					data: {
						questionId: this.topic.questionId,
					}
				}).then(res => {
					console.log("收藏题目",res.data)
					this.topic.isCollect = !this.topic.isCollect;
					uni.showToast({
						title: this.topic.isCollect?"收藏成功":"取消收藏成功",
						icon: "none"
					});
				}).catch(error => {
					console.log("收藏题目报错", error)
				})
			},
			
			// 点击类目之后,获取右侧内容
			choiceCategory(item, isInitialization) {
				console.log(this.selectCategory.categoryId, item.categoryId)
				if (this.selectCategory.categoryId != item.categoryId || this.pageType == "video" || typeof isInitialization != "undefined") {
					if (this.selectCategory.categoryId != item.categoryId && item) {
						this.selectCategory = {
							categoryId: item.categoryId,
							name: item.name
						}
						this.resetProblem(this.pageType)
					}
					console.log("this.pageType:", this.pageType)
					// console.log("categoryId：：",item.categoryId)
					if (this.pageType == "question") {
						// 获取题目
						this.commonRequest({
							url: "/api/question/byCategory",
							data: {
								keyword: this.keyword,
								// page:,
								size: "1",
								categoryId: item.categoryId
							}
						}).then(res => {
							console.log("获取题目:", res.data)
							this.topic = res.data[0];
							this.topicFilter()
						}).catch(error => {
							console.log("获取题目报错", error)
							reject(error)
						})
					} else if (this.pageType == "video") {
						if (this.videoList.noData) return false;
						// 获取视频列表
						this.commonRequest({
							url: "/api/video/byCategory",
							data: {
								keyword: this.keyword,
								page: this.videoList.page + 1,
								size: "24",
								categoryId: item.categoryId
							}
						}).then(res => {
							console.log("获取视频列表:", res.data)
							if (res.data.length == 0) {
								this.videoList.noData = true;
							}
							this.isLoading = false;
							this.videoList.page = this.videoList.page + 1;
							this.videoList.list = [...this.videoList.list, ...res.data]
						}).catch(error => {
							console.log("获取视频列表报错", error)
						})
					} else {
						return console.log("每日一题的不能点")
					}
				}
				// resetProblem("question")
			},

			GetNextVideoList() {
				if (this.isLoading) return false;
				this.isLoading = true;
				this.choiceCategory(this.selectCategory)
				// console.log("触发滚动到底部加载视频新数据")
			},
			// 切换题目之后，需要调用，重置数据 type: "all" 所有；question:题目相关 （题目、答案和解析）；video:视频列表；category 左侧类目
			resetProblem(type) {
				if (type == "all" || type == "question") {
					this.answered = false; //是否已经回答了问题
					this.time = 0; //答题计时器
					this.current = ""; //选中的答案下标
					this.answer = {
						optionName: "", //ABCDEF选项
						option: "" //答案内容
					} //选中的答案
					this.analysis = { //分析相关
						text: {},
						images: {},
						video: ""
					}
					this.showAnalysis = false //是否展示文本或图片解析弹窗
					this.showAIAnalysis = false //是否展示AI解析弹窗
					this.showVideo = false //是否展示是视频弹窗
					this.topic = {}
					this.context = {}
					this.videoEl = ""
				}

				if (type == "all" || type == "category") {
					this.categoryTree = { //左侧类目树状图
							subject: "数学", //学科
							grade: "",
							semester: "", //接口会返回 fall 上册, spring 下册
							category: [{}]
						},
						this.selectCategory = { //选中的类目
							categoryId: "", //选中的类目id
							name: "", //选中的类目名称
						}
				}

				if (type == "all" || type == "video") {
					this.videoList = { //视频列表
						page: 0,
						noData: false, //判断是不是已经没有更多视频了
						list: []
					}
				}
			},

			// 打开文本 + 图片解析；
			textAnalysis() {
				this.showAnalysis = true;
			},
			// 关闭视频弹窗
			closePopup() {
				if (this.videoEl && this.showVideo) {
					this.videoEl.pause()
				}
				this.showVideo = false;
				this.showAnalysis = false;
				this.showAIAnalysis = false;
				if (this.pageType == "video") {
					this.analysis.video = ""
					this.videoEl = ""
				}
				try {
					this.$refs.showVideo.close()
				} catch (e) {}
			},

			// 打开AI解析
			AIAnalysis() {
				this.showAIAnalysis = true;
				if (this.topic.AIanalysis.step == 0) {
					this.getAIAnalysis();
				}
			},

		}
	}
</script>

<style lang="scss" scoped>
	@import "/static/css/standard.scss";

	.page-wrap {
		background: linear-gradient(#FFF0DC 0%, #FFF0DC 40%, #FFFFFF 100%);
		display: flex;
		padding-bottom: 0;
		height: calc(100vh - 2.75rem);
		margin-top: -2.75rem;
		padding-top: 2.75rem;

		.content-wrap {
			display: flex;
			width: 100vw;

			// 左侧树状菜单 ------ Start
			.category-wrap {
				max-width: 9.625rem;
				width: 300rpx;
				max-height: calc(100vh - 2.75rem);
				overflow: auto;
				padding-right: 0.2rem;

				.subject-grade-wrap {
					font-size: 0.75rem;
					color: #000;
					margin-top: 1.25rem;
					margin-bottom: 1.625rem;
				}

				.tree-wrap {
					height: calc(100% - 128rpx);

					.tree-list {
						.tree-list-title {
							line-height: 52rpx;
						}

						margin-bottom: 10rpx;
					}

					.tree-selected {
						.tree-list-title {
							background: $ThemeColor;
							border-radius: 30rpx;
							font-weight: 700;
							font-size: 28rpx;
							display: inline-block;
							color: #fff;
							padding: 0 20rpx;
						}
					}
				}
			}

			// 左侧树状菜单 ------ End
			// 右侧内容 ------Start
			.topic-wrap {
				flex: 1;
				margin-top: -2.75rem;
				background: #fff;
				position: relative;
				z-index: 100;

				.topic-function-wrap {
					background: #FFEDBB;
					height: 2.75rem;
					position: relative;

					.search-btn-wrap {
						background-color: #fff;
						border-radius: 60rpx;
						height: 48rpx;
						position: absolute;
						top: 0;
						bottom: 0;
						left: 40rpx;
						margin: auto;
						overflow: hidden;

						.search-input {
							padding: 0 6rpx 0 30rpx;
							height: 100%;
							display: inline-block;
							font-size: 28rpx;
						}

						.search-btn {
							width: 80rpx;
							height: 48rpx;
							display: inline-block;
							background: url("/static/icons/search.png") no-repeat center / 36rpx 36rpx;
						}
					}

					.collect-btn-wrap {
						position: absolute;
						top: 0;
						bottom: 0;
						right:200rpx;
						margin: auto;
						display: flex;
						align-items: center;
						justify-content: center;
						z-index: 2;
						.collect-btn {
							border-radius: 30rpx;
							line-height: 54rpx;
							padding: 0 20rpx;
							display: flex;
							align-items: center;
							justify-content: center;
							font-size: 28rpx;
							background-color: #fff;
							&[isCollect="true"] {
								.collect-icon{
									background: url("/static/icons/collect.png") no-repeat center / 100% 100%;
								}
							}
							&[isCollect="false"] {
								.collect-icon{
									background: url("/static/icons/un_collect.png") no-repeat center / 100% 100%;
								}
							}
							.collect-icon{
								width: 34rpx;
								height: 30rpx;
								margin-right: 8rpx;
							}
						}
					}
				}

				// 中间答题 ------ Start
				.topic-content-wrap {
					display: flex;
					height: calc(100vh - 2.75rem - 1rem);

					.topic {
						height: 100%;
						width: 600rpx;
						flex: 1;
						position: relative;
						padding: 0.5rem 1.25rem;
						border-right: 0.18rem solid #FFF5F3;
						overflow-y: auto;

						.topic-text {
							font-size: 1.25rem;
						}

						.topic-image-wrap {
							margin-top: 0.2rem;

							.topic-image {
								width: 20rem;
								height: auto;

								div {
									display: none !important;
								}

								img {
									width: 100%;
									height: auto;
								}
							}
						}

						.topic-options-wrap {
							margin-top: 0.5rem;

							.topic-options {
								position: relative;
								display: inline-block;
								vertical-align: top;
								width: calc(50% - 0.625rem * 2 - 0.75rem);
								font-size: 0.9375rem;
								line-height: 2rem;
								color: #000;
								padding: 0 0.625rem;
								border-radius: 0.5rem;
								border: 0.08rem solid #C2C2C2;
								margin: 0 0.75rem 0.75rem 0;

								&:nth-child(2n) {
									margin-right: 0;
								}
							}

							.selected {
								border-color: #428BFE;
								background: #EDF3FF;
							}

							.check-correct {
								border-color: #7ED321;

								&::after {
									display: block;
									content: "";
									position: absolute;
									right: -0.625rem;
									top: -0.625rem;
									width: 1.25rem;
									height: 1.25rem;
									background: url('/static/icons/correct.png') no-repeat center /100% 100%;
								}
							}

							.check-error {
								border-color: #D0021B;
								background: #FFEFF1;

								&::after {
									display: block;
									content: "";
									position: absolute;
									right: -0.625rem;
									top: -0.625rem;
									width: 1.25rem;
									height: 1.25rem;
									background: url('/static/icons/error.png') no-repeat center /100% 100%;
								}
							}
						}

						.topic-submit {
							width: 180rpx;
							height: 72rpx;
							line-height: 72rpx;
							font-weight: 500;
							font-size: 32rpx;
							background: linear-gradient(to right, #FDB150, #FFDB9B);
							border: 2rpx solid linear-gradient(to right, #FDB150, #FFDB9B);
							float: right;
							border-radius: 36rpx;
							margin-right: 40rpx;
						}

						.topic-next {
							width: 180rpx;
							height: 72rpx;
							line-height: 72rpx;
							font-weight: 500;
							font-size: 32rpx;
							background: #fff !important;
							float: right;
							border-radius: 36rpx;
							border: 2rpx solid #FF7426;
						}
					}

				}

				// 中间答题 ------ End
				// 视频列表 ------ Start
				.video-list-wrap {
					height: calc(100vh - 2.75rem - 1rem);
					padding: 30rpx;

					.video-list-window {
						height: 100%;

						.name-wrap {
							width: 100%;
							height: 60rpx;
							margin-bottom: 16rpx;
						}

						.name {
							float: left;
							position: relative;
							padding-left: 20rpx;
							font-size: 24rpx;
							line-height: 24rpx;

							&::after {
								content: "";
								position: absolute;
								top: 4rpx;
								left: 0;
								width: 16rpx;
								height: 18rpx;
								background: url("/static/icons/positioning.png") no-repeat center / 100% 100%;
							}

							.border {
								position: absolute;
								left: 20rpx;
								right: 0;
								margin: 0 auto;
								bottom: -20rpx;
								width: 70%;
								height: 4rpx;
								background-color: #F8E71C;
							}
						}

						.video-list {
							float: left;
							width: 234rpx;
							height: 158rpx;
							margin-right: 30rpx;
							margin-bottom: 30rpx;
							border: 2rpx solid #000;
							border-radius: 4rpx;
							padding: 8rpx;

							.video-img-wrap {
								position: relative;
								width: 100%;
								height: 100%;
								border-radius: 4rpx;
								overflow: hidden;

								.label {
									position: absolute;
									top: 0;
									right: 0;
									padding: 6rpx 10rpx;
									font-size: 13rpx;
									color: #000;
									background-color: $ThemeColor;
									z-index: 2;
								}

								.video-img {
									width: 100%;
									height: 100%;
									background: #ccc;
								}
							}
						}
					}
				}

				// 视频列表 ------ END
				// 右侧解析 ------ Start
				.analysis-wrap {
					width: 10.5rem;
					height: calc(100% - 40rpx);
					padding: 40rpx 0 0 14rpx;
					position: relative;

					.analysis-title {
						margin-bottom: 0.8125rem;

						.title-icon {
							width: 0.43rem;
							height: 0.43rem;
							border-radius: 1rem;
							background: $ThemeColor;
							display: inline-block;
							margin-right: 0.3125rem;
						}

						.title {
							display: inline-block;
							font-size: 0.9375rem;
							vertical-align: middle;
						}
					}

					.answer-text {
						font-size: 0.9375rem;
					}

					.analysis-text {
						font-size: 0.75rem;
						line-height: 0.875rem;
						margin-top: 1.25rem;

						.analysis-icon {
							display: inline-block;
							width: 0.875rem;
							height: 0.875rem;
							margin-right: 0.3125rem;
							background: url("/static/icons/expand.png") no-repeat top / 100% 100%;
						}

						span {
							vertical-align: top;
						}
					}

					.other-analysis-wrap {
						position: absolute;
						left: 0.625rem;
						bottom: 0;

						.play-video-btn {
							width: 6rem;
							height: 4rem;
							background: url('/static/image/play_video_btn.png') no-repeat center / 100% 100%;
						}
					}

					.lingbao-wrap {
						position: absolute;
						right: 0;
						bottom: 0;

						.lingbao-icon {
							position: absolute;
							right: 2rem;
							bottom: 6rem;
							width: 5.5rem;
							height: 4.75rem;
							background: url("/static/image/analysis_icon.png") no-repeat bottom / 100%;
							animation: shake 2s ease-in-out infinite;
							transform-origin: bottom right;
						}

						@keyframes shake {

							0%,
							100% {
								transform: rotate(0)
							}

							50% {
								transform: rotate(10deg)
							}
						}

						.lingbao-image {
							position: absolute;
							right: 0;
							bottom: 0;
							width: 4rem;
							height: 6rem;
							background: url("/static/image/analysis_image.png") no-repeat bottom / 100%;
						}
					}
				}

				// 右侧解析 ------ End
			}

			// 右侧内容 ------ End
		}
	}

	// 解析弹窗样式 ------ Start
	.video-view {
		width: 100% !important;
		height: 80vh !important;
		z-index: 2;
	}

	// 解析弹窗样式 ------ End

	// 文本、图片’AI弹窗解析 ------Start
	.popup-analysis-wrap {
		padding: 20rpx 20rpx 0 20rpx;
		width: calc(100% - 40rpx);
		height: calc(100% - 40rpx);
		overflow-x: hidden;
		overflow-y: auto;
		position: relative;

		.conten-window {
			height: 100% !important;
			overflow: hidden auto;
		}

		.popup-analysis-text {
			font-size: 40rpx;
			line-height: 1.5;
			margin-bottom: 20rpx;

			.popup-analysis-img {
				width: auto;
				height: 60rpx;
				background: red;
			}
		}

		.popup-analysis-img {
			width: 100%;
			margin-bottom: 20rpx;
		}

		.next-btn-wrap {
			width: 100%;
			text-align: center;

			.next-btn {
				width: 180rpx;
				font-weight: 500;
				margin: 10rpx auto;
				color: #000;
				font-size: 32rpx;
				line-height: 60rpx;
				border-radius: 20rpx;
				background: linear-gradient(to right, #FDB150, #FFDB9B);
			}
		}

	}

	// 文本或者弹窗解析 ------End
	:global(.topic-image > div) {
		display: none;
	}

	:global(.topic-image > img) {
		opacity: 1;
		width: 100%;
		height: auto;
		position: relative;
	}
</style>