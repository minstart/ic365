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
						<span class="grade">{{categoryTree.grade}}年级{{categoryTree.semester}}</span>
					</view>
					<view class="tree-wrap" v-for="(item,i) in categoryTree.category">
						<h3 class="tree-title">{{item.categoryName}}</h3>
						<view class="tree-list" v-for="(item2,i2) in item.children">
							<view class="tree-list-title">{{item2.categoryName}}</view>
							<div class="tree-list" v-for="(item3,i3) in item2.children">
								<view class="tree-list-title">{{item3.categoryName}}</view>
							</div>
						</view>
					</view>
				</view>
				<view class="topic-wrap">
					<view class="topic-function-wrap"></view>
					<view class="topic-content-wrap">
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
							<button class="topic-submit" @click="submit" v-if="!answered">提交</button>
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
								<view class="other-analysis-wrap" v-if="topic.videoId">
									<view class="analysis-title">
										<span class="title-icon"></span>
										<view class="title">视频解析</view>
									</view>
									<view class="play-video-btn" @click="playVideo"></view>
								</view>
								<view class="lingbao-wrap">
									<view class="lingbao-icon" @click="AIAnalysis"></view>
									<view class="lingbao-image"></view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
	<!-- 视频弹窗 -->
	<l-popup v-show="showVideo" :close="closePopupVideo">
		<template v-slot>
			<video id="video1" class="video-view" :src="analysis.video" autoplay="true" duration="" show-fullscreen-btn="false"></video>
		</template>
	</l-popup>
	<!-- 文字 + 图片析题弹窗 -->
	<l-popup v-show="showAnalysis" :close="closePopupVideo">
		<template v-slot>
			<view class="popup-analysis-wrap">
				<view class="popup-analysis-text" v-if="topic.analysis">
					{{topic.analysis}}
				</view>
				<view class="popup-analysis-img-wrap" v-for="item in topic.analysisImages">
					<image class="popup-analysis-img" :src="item" mode=""></image>
				</view>
			</view>
		</template>
	</l-popup>
	<!-- AI析题弹窗 -->
	<l-popup v-show="showAIAnalysis" :close="closePopupVideo">
		<template v-slot>
			<view class="popup-analysis-wrap">
				<view class="popup-analysis-text" v-if="topic.analysis">
					{{topic.analysis}}
				</view>
				<view class="popup-analysis-img-wrap" v-for="item in topic.analysisImages">
					<image class="popup-analysis-img" :src="item" mode=""></image>
				</view>
			</view>
		</template>
	</l-popup>
</template>

<script>
	import store from '/store/index.js';
	import commonJs from '/common/js/common.js';

	export default {
		mixins: [commonJs],
		props: {

		},
		components: {},

		data() {
			return {
				taskbarHeight2: "", //计算任务栏高度，避开左侧摄像头位置
				isEveryDay: false, //是否是每日一题，默认不是
				answered: false, //是否已经回答了问题
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
				topic: {},
				context: {},
				showAnalysis: false, //是否展示文本或图片解析弹窗
				showAIAnalysis: false, //是否展示AI解析弹窗
				videoEl: "",

				// answered: true,
				// answer: {
				// 	optionName: "A", //ABCDEF选项
				// 	option: "随便填的答案" //答案内容
				// }
			}
		},
		onLoad(option) {
			// #ifdef H5
			this.categoryTree.grade = this.changeGrade('1');
			this.categoryTree.semester = "上册";
			this.categoryTree.category[0].categoryName = "1-5的认识和加减法";
			this.topic = {
				questionId: "bb53a6f9b454348ca860aaf4c32b62cb",
				"title": "苹果对应的数字是多少？",
				"content": "苹果对应的数字是多少？",
				"answer": "C",
				"analysis": "图片一中苹果的数量为5个，故选C。",
				"videoId": 6800,
				"tags": "",
				"categoryId": 7,
				"categoryName": "1-5的认识和加减法",
				"semester": "fall",
				"grade": 1,
				options: [
					"3",
					"4",
					"5",
					"6"
				],
				"contentImages": [
					"http://ic365.com/media/picture/20250719/01578a43e5814d148ace9b8c3b0a0765.png"
				],
			};
			// #endif
			console.log(option)
			this.verifLogin().then(data => {
				option.isEveryDay && (this.isEveryDay = option.isEveryDay);
				if (option.isEveryDay == "true") {
					let requestData = {
						url: "/api/question/today"
					}
					this.changeDate(option.date).fullDate != this.changeDate(new Date()).fullDate && (requestData.date = option.date)
					// 获取今日题目
					this.commonRequest(requestData).then(res => {
						console.log("获取今日题目::", res)
						try {
							this.categoryTree.grade = this.changeGrade(res.data.grade);
							this.categoryTree.semester = res.data.semester == "fall" ? "上册" : (res.data.semester == "spring" ? "下册" : "");
							this.categoryTree.category[0].categoryName = res.data.categoryName;
							this.topic = res.data;

							if (this.topic.content.indexOf("http") != -1) {
								// 1. 正则表达式提取图片URL
								const imageUrlPattern = /https?:\/\/[^\s]+?\.(?:png|jpg|jpeg|gif)/gi;
								const contentImages = this.topic.content.match(imageUrlPattern) || [];
								// 2. 删除图片URL后的文本
								this.topic.content = this.topic.content.replace(imageUrlPattern, '').trim();
								this.topic.contentImages = [...this.topic.contentImages, contentImages]
							}

							let time = setInterval(() => {
								if (this.answered) {
									clearInterval(time)
								}
								this.time = this.time + 1;
							}, 1000)
						} catch (e) {}
					}).catch(error => {
						this.consoleLog("获取今日题目报错：：", error)
					})
				}
			})


		},
		onReady() {
			this.context = uni.createVideoContext("video1", this);
			this.taskbarHeight2 = uni.getSystemInfoSync().statusBarHeight * 2 + "rpx";
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
			checkClassSet(item, i) {
				console.log(item, i)
				return 1;
			},
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
			changeGrade(id) {
				let arr = ["一", "二", "三", "四", "五", "六"]
				return arr[Number(id) - 1]
			},
			clickOption(item, i) {
				if (this.current !== i && !this.answered) {
					this.current = i;
					this.answer = item;
				}
			},

			submit() {
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

				console.log("postData", postData)
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

			playVideo() {
				if (!this.analysis.video) {
					this.commonRequest({
						url: "/api/video/getById",
						method: 'post',
						data: {
							id: this.topic.videoId
						}
					}).then(res => {
						console.log("获取视频解析地址::", res.data)
						try {
							this.analysis.video = res.data
							this.showVideo = true;
							// 安卓多次重复播放发现视频宽高出现概率性缩小的情况 ---Start
							// let _this = this;
							// setTimeout(()=>{
							// 	 _this.context.play()
							// },1000)
							// 安卓多次重复播放发现视频宽高出现概率性缩小的情况 ---End

							this.videoEl = uni.createVideoContext('video1'); //创建视频实例指向video
							this.videoEl.seek(0);
							this.videoEl.play();
						} catch (e) {}
					}).catch(error => {
						this.consoleLog("获取视频解析地址报错", error)
					})
				} else {
					this.videoEl.seek(0);
					this.videoEl.play();
				}

			},
			AIAnalysis() {
				this.showAIAnalysis = true;
			},
			textAnalysis() {
				this.showAnalysis = true;
			},
			closePopupVideo() {
				if (this.videoEl && this.showVideo) {
					this.videoEl.pause()
				}
				this.showVideo = false;
				this.showAnalysis = false;
				this.showAIAnalysis = false;
			},
			// 切换题目之后，需要调用，重置数据
			resetProblem() {
				this.answered = false; //是否已经回答了问题
				this.time = 0; //答题计时器
				this.current = ""; //选中的答案下标
				this.answer = {
					optionName: "", //ABCDEF选项
					option: "" //答案内容
				} //选中的答案
				this.categoryTree = { //左侧类目树状图
					subject: "数学", //学科
					grade: "",
					semester: "", //接口会返回 fall 上册, spring 下册
					category: [{}]
				}
				this.analysis = { //分析相关
					text: {},
					images: {},
					video: ""
				}
				this.showVideo = false //是否展示是视频弹窗（uni-popup 有毒）
				this.topic = {}
				this.context = {}
				this.showAnalysis = false //是否展示文本或图片解析弹窗
				this.showAIAnalysis = false //是否展示AI解析弹窗
				this.videoEl = ""
			}
		}
	}
</script>

<style lang="scss" scoped>
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
					.tree-title {
						margin-bottom: 1.375rem;
					}
				}
			}

			// 左侧树状菜单 ------ End
			.topic-wrap {
				flex: 1;
				margin-top: -2.75rem;
				background: #fff;

				.topic-function-wrap {
					background: #FFEDBB;
					height: 2.75rem;
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
							width: 5.625rem;
							height: 2.25rem;
							line-height: 2.25rem;
							font-weight: 500;
							font-size: 1rem;
							background: linear-gradient(to right, #FDB150, #FFDB9B);
							float: right;
						}
					}

				}

				// 中间答题 ------ End
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
							background: #F5A623;
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
			}

			// 右侧解析 ------ End
		}
	}

	// 解析弹窗样式 ------ Start
	.video-view {
		width: 100% !important;
		height: 80vh !important;
		z-index: 2;
	}

	// 解析弹窗样式 ------ End

	// 文本或者弹窗解析 ------Start
	.popup-analysis-wrap {
		padding: 20rpx 20rpx 0 20rpx;
		width: calc(100% - 40rpx);
		height: calc(100% - 40rpx);
		overflow-x: hidden;
		overflow-y: auto;

		.popup-analysis-text {
			font-size: 40rpx;
			line-height: 1.5;
			margin-bottom: 20rpx;
		}

		.popup-analysis-img-wrap {
			.popup-analysis-img {
				width: 100%;
				margin-bottom: 20rpx;
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