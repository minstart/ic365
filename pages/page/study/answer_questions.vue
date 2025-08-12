<template>
	<page-meta v-model='fontSize' :page-font-size="fontSize+'px'" :root-font-size="fontSize+'px'"></page-meta>
	<view style="width: 100vw;height: 100vh;overflow: hidden;">
		<page-head :title='pageHeadTitle' :isBack='true' :background="'transparent'" :systemTaskbar="false"></page-head>
		<view class="page-wrap" :style="'padding-left:'+taskbarHeight2">
			<view class="content-wrap">
				<view class="category-wrap">
					<view class="subject-grade-wrap">
						<span class="subject">数学</span>
						<span> · </span>
						<span class="grade">一年级下册</span>
					</view>
					<view class="tree-wrap" v-for="(item,i) in categoryTree.category">
						<h3 class="tree-title">{{item.name}}</h3>
						<view class="tree-list" v-for="(item2,i2) in item.children">
							<view class="tree-list-title">{{item2.name}}</view>
							<div class="tree-list" v-for="(item3,i3) in item2.children">
								<view class="tree-list-title">{{item3.name}}</view>
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
								<view class="topic-options" :class="selectedClass(i)" :current='i' @click="clickOption(item,i)" v-for="(item,i) in changeOptions(topic.options)">
									{{item.optionName}}.{{item.option}}
								</view>
							</view>
							<button class="topic-submit" @click="submit">提交</button>
						</view>
						<view class="analysis-wrap"></view>
					</view>
				</view>
			</view>
		</view>
	</view>
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
				current:"",//选中的答案下标
				answer:"",//选中的答案
				categoryTree: { //左侧类目树状图
					subject: "数学", //学科
					grade: "一",
					semester: "上册", //接口会返回 fall 上册, spring 下册
					category: [{
						name: "1-5的认识和加减法",
						children: []
					}]
				},
				topic: {
					"answer": "C",
					"analysis": "图片一中苹果的数量为5个，故选C。",
					"videoId": 6800,
					"content": "苹果对应的数字是多少？", //题目内容
					"options": [
						"3",
						"4",
						"5",
						"6"
					],
					"contentImages": [
						"https://ic365.ajulye.com/media/picture/2508/b9b4fdc88bda4448ab5c95bf47b3977c.png"
					],
				}
			}
		},
		onLoad(option) {
			// this.verifLogin().then(data => {
			// 	// 获取今日题目
			// 	this.commonRequest({
			// 		url: "/api/question/today"
			// 	}).then(res => {
			// 		console.log(res)
			// 		if (res.code == 0) {

			// 		} else {
			// 			uni.showToast({
			// 				title: res.message || "获取今日题目失败!",
			// 				icon: "none"
			// 			});
			// 		}
			// 	}).catch(error => {
			// 		this.consoleLog("获取今日题目报错：：", error)
			// 	})
			// })
		},
		onReady() {
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
			}).then(data => {

			})
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
			selectedClass() {
				// 根据current的值返回选中状态的class
				return index => index === this.current ? 'selected' : '';
			},
		},
		methods: {
			changeOptions(arr) {
				let _arr = [];
				let optionName = ["A", "B", "C", "D", "E", "F"]
				arr.forEach((item, i) => {
					_arr.push({
						optionName: optionName[i],
						option: item
					})
				})
				return _arr;
			},
			changeGrade(id) {
				let arr = ["一", "二", "三", "四", "五", "六"]
				return arr[Number(id) - 1]
			},
			clickOption(item,i) {
				if (this.current !== i) {
					this.current = i;
					this.answer = item;
				}
			},
			submit(){
				uni.showActionSheet({
				    itemList: ['选项1', '选项2', '选项3'],
				    success: function(res) {
				        console.log('选择了第' + (res.tapIndex + 1) + '个选项');
				    }
				});
				// uni.showToast({
				// 	title:"提交的答案：" + this.answer.optionName + this.answer.option
				// })
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
				width: 9.625rem;
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
					.topic{
						height: 100%;
						flex: 1;
						position: relative;
						padding: 0.5rem 1.25rem;
						border-right: 0.18rem solid #FFF5F3;
						overflow-y: auto;
						.topic-text{
							font-size: 1.25rem;
						}
						.topic-image-wrap{
							margin: 0.2rem 0;
							.topic-image{
								width: 20rem;
								height: auto;
								div{
									display: none !important;
								}
								img{
									width: 100%;
									height:auto;
								}
							}
						}
						.topic-options-wrap{
							overflow: hidden;
							.topic-options{
								float: left;
								width: calc(8.5rem - 0.625rem * 2);
								font-size: 0.9375rem;
								line-height: 2.25rem;
								color: #000;
								padding: 0 0.625rem;
								border-radius: 0.5rem;
								border:0.08rem solid #C2C2C2;
								margin: 0 0.85rem 0.85rem 0;
							}
							.selected{
								border-color: #428BFE;
								background: #EDF3FF;
							}
						}
						.topic-submit{
							width: 5.625rem;
							height: 2.25rem;
							line-height: 2.25rem;
							font-weight: 500;
							font-size: 1rem;
							background: linear-gradient(to right,#FDB150,#FFDB9B);
							float: right;
						}
					}
					.analysis-wrap{
						
					}
				}

				// 右侧解析 ------ Start
				.analysis-wrap {
					width: 9.5rem;
					height: 100%;
				}
			}

			// 右侧解析 ------ End
		}
	}
	:global(.topic-image > div){
		display: none;
	}
	:global(.topic-image > img){
		opacity: 1;
		width: 100%;
		height: auto;
		position:relative;
	}
</style>