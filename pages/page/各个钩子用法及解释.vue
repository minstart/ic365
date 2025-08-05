<template>
	<page-head :title='pageHeadTitle' :isBack='false'></page-head>
	<input type="text" v-model="something">
	<!-- 父页面调用子页面方法 -->
	<child-component ref="childRef"></child-component>
	<button @click="callChildMethod">调用子组件方法</button>
	
	<!-- 公共页面项标题 -->
	<view class="item-title-wrap">
		<h3 class="item-title">最新成就</h3>
		<view class="item-subtitle">AI智能推荐</view>
		<view class="item-more">
			<view class="text icon-more" @click="jumpPage({url:''})">详情</view>
		</view>
	</view>
</template>

<script>
	import store from '@/store/index.js';
	import commonJs from '/common/js/common.js';
	import ChildComponent from './ChildComponent.vue';

	export default {
		// ‌Vue Mixins（混入）的核心作用是促进代码复用和功能封装‌，通过将可复用的逻辑、数据或生命周期方法独立封装为混入对象（Mixin），再通过组件的 mixins 属性引入，实现功能的共享与扩展
		mixins: [commonJs],
		// Vue中的props是父组件向子组件传递数据的主要机制，主要用于实现组件间的数据通信
		// 通过props，父组件可以向下传递数据给子组件，子组件通过props接收这些数据并进行处理。这是组件间通信的官方推荐方式，确保数据传递的规范性和响应式更新
		props: {

		},
		// ‌代码复用与模块化‌ - 组件允许将UI和逻辑封装为独立单元，避免重复代码，尤其适合重复出现的功能模块（如按钮、表单等）
		components: {
			ChildComponent
		},
		// 数据隔离与组件独立性 data()函数确保每个组件实例返回独立的数据对象，避免不同组件实例共享同一数据。这种设计解决了对象引用共享导致的状态污染问题，每个组件可独立维护自身状态
		data() {
			return {
				pageHeadTitle: "这是标题",
				something: ""
			}
		},
		// onload事件时在网页或者图片完全加载完成后触发的，它适用于整个网页加载时 - 该方法就会执行一次，适合用于进行 页面初始化工作 和获取 一次性数据 。
		onLoad() {

		},
		// 确保 DOM 渲染完成‌：在 onReady 执行时，组件的 DOM 结构已完全生成并挂载到页面，此时可以进行 DOM 操作或获取元素数据。 ‌
		onReady() {
			// uni常用的方法
		},
		// 页面显示
		onShow() {

		},
		// 页面隐藏
		onHide() {

		},
		// Vue的watch用于监听响应式数据的变化，支持基础类型、对象、数组等多种数据源，可通过配置immediate和deep选项实现立即执行和深度监听
		watch {
			"something": {
				handler(newVal, oldVal) {
					console.log("新的值:" + newVal);
					console.log("旧的值:" + oldVal);
					console.log("hellow  world");
				}
			}
		},
		// 如果你需要在数据加载完成后立即渲染页面（例如列表数据），通常使用created钩子。Vue将在数据加载完成后立即渲染组件
		// 如果你需要在DOM元素可用的情况下进行操作（例如基于DOM的操作或计算DOM尺寸），则使用mounted钩子。例如，你可能需要在加载数据后初始化一个图表或地图，这时候就需要在mounted钩子中进行。
		// created：在实例创建完成后被调用，此时组件的模板已经编译完成，但DOM还未挂载，即无法访问到DOM元素。适合进行一些非DOM操作的初始化工作，如API调用
		created() {
			this.fetchData();
		},
		// mounted：在el被新创建的vm.$el替换，并挂载到实例上去之后调用。此时可以访问到DOM元素，进行DOM操作或初始化UI相关的操作。
		mounted() {
			this.fetchData();
		},
		// 计算函数
		computed:{
			
		},
		// methods选项主要用于定义组件的方法
		methods: {
			fetchData() {
				axios.get('/api/items')
					.then(response => {
						this.items = response.data;
					})
					.catch(error => {
						console.error("Error fetching data:", error);
					});
			},
			// 父页面调用子页面的方法 - childMethod写在子页面的methods里面
			callChildMethod() {
				this.$refs.childRef.childMethod(); // 调用子组件的方法
			}
		}
	}
</script>

<style lang="less" scoped>
	// 背景图用法
	.background {
		background-image: url("/static/icons/star.png");
		background-repeat: no-repeat;
		background-position: center;
		background-size: 100% 100%;
		// background-size: cover; /* 使用 cover 关键字确保图像覆盖整个元素 */
	}
	
</style>