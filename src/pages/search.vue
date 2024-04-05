<template>
	<el-drawer v-model="drawers" title="I am the title" :with-header="false" class="drawer">
		<div class="search">
			<div class="flexcenter allcontents" ref='pondModel'>
				<!-- 已上传文件chatGtp聊天框 -->
				<div class="contents" ref="problem">
					<div class="charts" v-for="v in list">
						<img src="../assets/heard.png" class="chartimg" v-if="v.state==1">
						<img src="../assets/AI.png" class="chartimgs" v-if="v.state==2">
						<p class="chartcontent" v-if="typeof(v.log)=='string'">
							{{v.log}}
						</p>
						<p class="chartcontent" v-if="typeof(v.log)=='object'">
						<p v-for="(item,index) in v.log">
						<p v-if="typeof(item)=='string'">{{item}}</p>
						<p v-if="typeof(item)=='object'">
							<a :href="item[1][0]" target="_blank">{{item[0]}}</a>
							<br />
						<p>{{item[1][1]}}</p>
						</p>
						</p>
						</p>
					</div>
				</div>
			</div>
			<div class="updata">
				<el-input v-model="model" placeholder="Please input" class="input">
					<template #append>
						<el-icon @click.stop="updataClick" size="30">
							<Top />
						</el-icon>
					</template>
				</el-input>
			</div>
		</div>
		<!-- 发送问题的input框 -->
	</el-drawer>
</template>

<script>
	import {
		apiAgent
	} from "@/api/user.js"
	export default {
		data() {
			return {
				model: "",
				drawers: false,
				list: [],
				str: []
			}
		},
		watch: {
			drawer() {
				this.drawers = this.drawer
			},
			drawers() {
				this.$emit('drawerstate', this.drawers);
			},
		},
		props: {
			drawer: {
				type: Boolean,
				default: false,
			}
		},
		mounted() {
	  
	// 输出匹配到的网络连接  
			// console.log(add[2].split("]"))
		},
		methods: {
			updataClick() {
				let add = {
					log: this.model,
					state: 1,
				}
				// 页面展示内容
				this.list.push(add)
				// 清空问题框
				this.model = ""
				// inputstate变为1不可发送问题
				this.inputstate = 1
				let adds = {
					log: "obtaining answers....(it might take a while for the first time)",
					state: 2
				}
				this.list.push(adds)
				apiAgent(add).then((res) => {
					var acc = res.data.data
					this.list.pop() 
					var add = acc.split("[")
					add.forEach((v, i) => {
						if (v.search(']') !== -1) {
							add[i] = add[i].split("]")
							add[i][1] = add[i][1].split(").")
							add[i][1][0] = add[i][1][0].split("(")[1]
							add[i][1][0]=add[i][1][0].split("):")[0]
							if(add[i][1][0].includes(")")){
								add[i][1][0]=add[i][1][0].split(")")[0]
							}else if(add[i][1][0].includes("):")){
								add[i][1][0]=add[i][1][0].split("):")[0]
							}
						}
					})
					let adds = {
						log: add,
						state: 2
					}
					this.list.push(adds)
				})
			},
		}
	}
</script>
<style>
	.drawer{
		width: 35% !important;
	}
	.el-drawer__body{
		padding: 0;
	}
	.el-input__wrapper{
		background-color: transparent;
	}
	.el-input-group__append{
		background-color: transparent;
	}
</style>
<style lang="scss" scoped>
	
	.search {
		width: 180%;
		height: 100%;
		padding: 20px;
		background-image: url(../assets/searchback.jpg);
		background-size: 100% 100%;
		.allcontents {
			height: 90%;
			position: relative;

			#pondModel {
				.contrastButton {
					position: absolute;
					width: 90px;
					height: 29px;
					left: 45%;
					color: #fff;
					font-size: 16px;
					border-radius: 4px;
					background-color: #099eff;
				}
			}

			.contents {
				width: 100%;
				height: 100%;
				overflow: scroll;

				.pdfname {
					width: 22%;
					// background-color: #fff;
					height: 30px;
					padding-left: 6px;
					padding-top: 10px;
					position: fixed;
					font-size: 18px;

					.pdfColor {
						width: 3px;
						height: 100%;
						background-color: #1f00ff;
					}

					.pdfnames {
						margin-left: 4px;

						span {
							color: red;
						}
					}
				}

				.charts {
					display: flex;
					margin-top: 30px;
				}

				.chartimg {
					width: 49px;
					height: 49px;
					margin-right: 8px;
					margin-top: 6px;
					margin-left: 5px;
				}

				.chartimgs {
					width: 44px;
					height: 44px;
					margin-right: 8px;
					margin-top: 12px;
					margin-left: 7px;
				}

				.chartcontent {
					min-width: 40px;
					max-width: 90%;
					padding: 12px;
					// background: #fff;
					border-radius: 10px;
					font-size: 18px;
				}

				.answer {
					width: 100%;
					min-height: 52px;
					background-color: #f9f9fa;
					padding: 16px 16px;
					box-sizing: border-box;

					.time {
						width: 30%;
						text-align: center;
					}

				}

			}
			.contents::-webkit-scrollbar {
				display: none;
			}
		}
		.updata {
			width: 100%;
			height: 6%;
			position: absolute;
			bottom: 10;
			left: 0;

			.input {
				height: 70px;
			}
		}
	}
</style>