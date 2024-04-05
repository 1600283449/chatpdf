<template>
	<div class="page">
		<div class="title flexDirectionCenter">
			<div class="titles">
				Please select the large model you want to chat with
			</div>
			<div class="flexDirectionCenter">
				<!-- 选择模型 -->
				<el-select v-model="allmodel" filterable placeholder="Please select a model"
					style="width: 260px;height: 60px; margin-top: 80px;">
					<el-option v-for="item in allmodels" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
				<!-- 跳转pdf页面 -->
				<el-button type="primary" @click="add" style="width: 260px; margin-top: 80px;">start your
					conversation<el-icon>
						<Right />
					</el-icon></el-button>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				// 当前选择的数据
				allmodel: "llama2_13b",
				// 所有模型数据
				allmodels: [
					{
						value: 'gemma_7b',
						label: 'gemma_7b'
					}, {
						value: 'llama2_13b',
						label: 'llama2_13b'
					}, {
						value: 'llama2_70b',
						label: 'llama2_70b'
					}, {
						value: 'mistral_7b',
						label: 'mistral_7b'
					}, {
						value: 'mixtral_8x7b',
						label: 'mixtral_8x7b'
					}
				],
			}
		},
		methods: {
			add() {
				// 获取当前选中模型名字
				var allmodelname = ""
				this.allmodels.forEach((v, i) => {
					if (v.value == this.allmodel) {
						allmodelname = v.label
					}
				})
				// 跳转下一页
				this.$router.push({
					path: '/pdf',
					query: {
						allmodelname: allmodelname,
						allmodel: this.allmodel
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.title {
		width: 100%;
		height: 80vh;
		background-color: #fff;
		text-align: center;
		justify-content: center;
		background-image: radial-gradient(at 21% 11%, rgba(186, 186, 233, .53) 0, transparent 50%), radial-gradient(at 85% 0, hsla(46, 57%, 78%, .52) 0, transparent 50%), radial-gradient(at 91% 36%, rgba(194, 213, 255, .68) 0, transparent 50%), radial-gradient(at 8% 40%, rgba(251, 218, 239, .46) 0, transparent 50%);

		.titles {
			width: 930px;
			font-size: 40px;
			line-height: 60px;
			text-align: center;
		}
	}
</style>