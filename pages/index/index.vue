<template>
	<view>
		<view class="box">
			<view @click="open" :data-id="'up'">
				打开上弹窗
			</view>
			<view @click="open" :data-id="'below'">
				打开下弹窗
			</view>
			<view @click="open" :data-id="'left'">
				打开左弹窗
			</view>
			<view @click="open" :data-id="'right'">
				打开右弹窗
			</view>
			<view @click="open" :data-id="'center'">
				打开中间弹窗
			</view>
		</view>

		<pop ref="pop" :direction="direction" :is_close="true" :is_mask="true" :width="80">

			<view v-for="t in 5" :key="t">
				我是：{{direction}}一个弹窗
			</view>

		</pop>
	</view>
</template>

<script>
	import pop from "@/components/ming-pop/ming-pop.vue"
	export default {
		data() {
			return {
				direction: "up"
			}
		},
		onLoad() {

		},
		methods: {
			open(e) {
				this.direction = e.currentTarget.dataset.id;
				//打开弹窗
				this.$refs.pop.show();
			}
		},
		components: {
			pop
		}
	}
</script>

<style scoped>
	.box view {
		text-align: center;
		margin: 20px;
		background-color: #007AFF;
		color: #FFFFFF;
		border-radius: 3px;
		padding: 10px 0;
	}
</style>
