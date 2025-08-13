<template>
	<page-meta v-model='fontSize' :page-font-size="fontSize+'px'" :root-font-size="fontSize+'px'"></page-meta>
	<view style="width: 100vw;height: 100vh;overflow: hidden;">
		<page-head :title='pageHeadTitle' :isBack='true' :background="'transparent'" :systemTaskbar="false"></page-head>
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
								<view class="analysis-text">
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
									<view class="lingbao-icon"></view>
									<view class="lingbao-image"></view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
	<uni-popup ref="popup" type="center" :mask-click="false" border-radius="10px 10px 0 0" :animation="false">
		<view class="popup-video-wrap">
			<view class="close-icon" @click="closePopupVideo"></view>
			<video id="video1" class="video-view" :src="analysis.video" autoplay="false" duration=""></video>
		</view>
	</uni-popup>
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
					optionName: "A",
					option: "随便填的答案"
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
				context:{}
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
			this.taskbarHeight2 = uni.getSystemInfoSync().statusBarHeight / 16 + "rem";
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
			/**
			 * 获取任意时间
			 */
			changeDate(date, AddDayCount = 0) {
				if (!date) {
					date = new Date()
				}
				if (typeof date !== 'object') {
					date = date.replace(/-/g, '/')
				}
				const dd = new Date(date)

				dd.setDate(dd.getDate() + AddDayCount) // 获取AddDayCount天后的日期

				const y = dd.getFullYear()
				const m = dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1 // 获取当前月份的日期，不足10补0
				const d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate() // 获取当前几号，不足10补0
				return {
					fullDate: y + '-' + m + '-' + d,
					year: y,
					month: m,
					date: d,
					day: dd.getDay()
				}
			},
			submit() {
				if (!this.answer.optionName) return uni.showToast({
					title: "请选择答案",
					icon: "none"
				});
				this.answered = true;
				uni.showToast({
					title: "提交的答案：" + this.answer.optionName + this.answer.option + "，用时：" + this.time + "秒",
					icon: "none"
				})
			},

			playVideo() {
				console.log(this.topic.videoId)
				// #ifdef H5
				this.$refs.popup.open('center')
				// #endif
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
						// this.showVideo = true;
						this.$refs.popup.open('center')
						let _this = this;
						// 安卓多次重复播放发现视频宽高出现概率性缩小的情况 ---Start
						setTimeout(()=>{
							_this.context.play()
						},1000)
						// 安卓多次重复播放发现视频宽高出现概率性缩小的情况 ---End
					} catch (e) {}
				}).catch(error => {
					this.consoleLog("获取视频解析地址报错", error)
				})
			},
			closePopupVideo() {
				this.$refs.popup.close()
				// this.showVideo = false;
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
				width: 30%;
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

				.topic-content-wrap {
					display: flex;
					height: calc(100vh - 2.75rem - 1rem);

					.topic {
						height: 100%;
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

				// 右侧解析 ------ Start
				.analysis-wrap {
					width: 9.5rem;
					height: calc(100% - 1.25rem);
					padding: 1.25rem 0 0 0.625rem;
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
							background: #333;
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
	.popup-video-wrap {
		width: 80vw;
		height: 80vh;
		// background: #fff;
		position: relative;
		z-index: 100;

		.close-icon {
			width: 1.6rem;
			position: absolute;
			height: 1.6rem;
			right: -0.8rem;
			top: -0.8rem;
			z-index: 4;
			background: url("/static/icons/error.png") no-repeat center/100% 100%;
		}

		.video-view {
			width: 100% !important;
			height: 100% !important;
			// position: absolute;
			// left: 0;
			// right: 0;
			// top: 0;
			// bottom: 0;
			// margin: auto;
			// z-index: 2;
		}
	}


	// 解析弹窗样式 ------ End
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