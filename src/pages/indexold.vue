<template>
	<div class="page">
		<div class="title flexDirectionCenter">
			<div class="titles">
				Empower your organization's Business Intelligence with
				<span class="font-bold">SEC Insights </span>
			</div>
			<div class="mintitle">
				Effortlessly analyze multifaceted financial documents such as 10-Ks and 10-Qs.
			</div>
			<div class="forms">
				<div class="formTitle">
					Start your conversation by selecting the documents you want to explore
				</div>
				<div class="selects flexcenter">
					<el-select v-model="secClk" filterable placeholder="请选择公司" class="select">
						<el-option v-for="item in secClks" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
					<el-select v-model="secType" filterable placeholder="请选择" class="select">
						<el-option v-for="item in secTypes" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
					<el-select v-model="time" filterable placeholder="请选择时间" class="select">
						<el-option v-for="item in times" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
					<el-button type="primary" @click="adds" :loading="loading">Add</el-button>
					<!-- 	<el-upload
					  class="upload-demo"
					  action="http://127.0.0.1:1234/api/c3"
					  :on-preview="handlePreview"
					  :on-remove="handleRemove"
					  :before-remove="beforeRemove"
					  multiple
					  :limit="3"
					  :on-exceed="handleExceed"
					  :file-list="fileList"
					  @change="change"
					  >
					  <el-button size="small" type="primary">点击上传</el-button>
					  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
					</el-upload> -->
				</div>
				<el-table :data="tableData" style="width: 100%;height: 180px;margin-top: 20px;">
					<el-table-column fixed prop="secClk" label="" width="200">
					</el-table-column>
					<el-table-column prop="secType" label="" width="200">
					</el-table-column>
					<el-table-column prop="time" label="" width="200">
					</el-table-column>
					<el-table-column label="" width="200">
						<template #default>
							<el-icon size="16">
								<DeleteFilled @click="delect" />
							</el-icon>
						</template>
					</el-table-column>
				</el-table>
				<div class="bottoms flexcenter">
					<div>Add up to 8 more docs</div>
					<div class="or">or</div>
					<el-button type="primary" @click="add">start your conversation<el-icon>
							<Right />
						</el-icon></el-button>
					<el-select v-model="allmodel"  filterable placeholder="请选择时间" class="select"
						style="margin-left: 10px;width: 160px;" @change="selectchange">
						<el-option v-for="item in allmodels" :key="item.value" :label="item.label" 
							:value="item.value">
						</el-option>
					</el-select>
				</div>
			</div>
		</div>
		<div class="backTop" @click="backTop">Back to Top</div>
	</div>
</template>

<script>
	import axios from 'axios';
	import {
		apiinformation
	} from "@/api/user.js"
	export default {
		data() {
			return {
				json_body: {
					"inputs": [
						[{
								"role": "system",
								"content": "You are chat bot who writes songs"
							},
							{
								"role": "user",
								"content": "Write a rap about Barbie"
							}
						]
					],
					"parameters": {
						"max_new_tokens": 256,
						"top_p": 0.9,
						"temperature": 0.6
					}
				},
				allmodel: "meta/llama-2-7b:77dde5d6c56598691b9008f7d123a18d98f40e4b4978f8a72215ebfc2553ddd8",
				allmodels: [{
					value: 'meta/llama-2-7b:77dde5d6c56598691b9008f7d123a18d98f40e4b4978f8a72215ebfc2553ddd8',
					label: 'Llama-2-7b'
				}, {
					value: 'mistralai/mistral-7b-instruct-v0.1:5fe0a3d7ac2852264a25279d1dfb798acbc4d49711d126646594e212cb821749',
					label: 'mistral 7b'
				}],
				secClks: [{
					value: '320193',
					label: 'AAPL'
				}, {
					value: '789019',
					label: 'MSFT',
				}, {
					value: '0001018724',
					label: 'AMZN'
				}, {
					value: '1652044',
					label: 'GOOGL'
				}, {
					value: '1326801',
					label: 'META'
				}, {
					value: '1045810',
					label: 'NVDA'
				}, {
					value: '1065280',
					label: 'NFLX'
				}, {
					value: '0001633917',
					label: 'PYPL'
				}, {
					value: '78003',
					label: 'PFE (Pfizer)'
				}, {
					value: '901832',
					label: 'AZNCF (AstraZeneca)'
				}, {
					value: '59478',
					label: 'LLY (Eli Lilly)'
				}, {
					value: '1682852',
					label: 'MRNA (Moderna)'
				}, {
					value: '200406',
					label: 'JNJ (Johnson & Johnson)'
				}],
				secClk: '',
				secTypes: [{
						value: '10-K',
						label: '10-K'
					},
					{
						value: '10-Q',
						label: '10-Q'
					}
				],
				secType: '',
				times: [{
						value: '2020',
						label: '2020'
					},
					{
						value: '2021',
						label: '2021'
					},
					{
						value: '2022',
						label: '2022'
					},
					{
						value: '2023',
						label: '2023'
					}
				],
				time: "",

				tableData: [],
				imgOne: 'https://www.secinsights.ai/chat-1.svg',
				imgTwo: "https://www.secinsights.ai/multi-doc-4.svg",
				imgThree: "https://www.secinsights.ai/highlight-4.svg",
				pdfurl: "",
				loading: false,
			}
		},
		mounted() {
			// const url="https://pfhzzfz7rb.execute-api.us-east-1.amazonaws.com/default/myLlama2"
			//  axios.post(url,this.json_body) // 发送GET请求到指定URL
			//         .then(response => {
			// 			console.log(response); // 处理错误情况
			//         })
			//         .catch(error => {
			//           console.log(error); // 处理错误情况
			//         });
			window.addEventListener('scroll', this.handleScroll, true)
		},
		methods: {
			change(e) {
				console.log(e)
			},
			selectchange(val, e) {
				console.log(e)
			},
			adds() {
				if (this.loading) {
					this.$message({
						message: '请等待加载完成',
						type: 'warning'
					});
				} else if (this.secClk == "") {
					this.$message({
						message: '请选择公司',
						type: 'warning'
					});
				} else if (this.secType == "") {
					this.$message({
						message: '请选择下载类型',
						type: 'warning'
					});
				} else if (this.time == "") {
					this.$message({
						message: '请选择时间',
						type: 'warning'
					});
				} else {
					this.loading = true
					apiinformation({
							secClk: this.secClk,
							secType: this.secType,
							time: this.time,
						}).then((res) => {
							if (res.data.success) {
								var add=res.data.data.split("/")[3]
								this.tableData = []
								var list = {
									secClk:add,
									secType: this.secType,
									time: this.time
								}
								this.tableData.push(list)
								this.pdfurl = res.data.data
								this.loading = false
							} else {
								this.loading = false
							}
						})
						.catch(error => {
							this.tableData = []
							this.loading = false
						});
				}
			},
			delect() {
				this.tableData = []
				this.pdfurl = ""
			},
			handleScroll() {
				//方法一
			},
			backTop() {
				window.scrollTo(0, 0)
			},
			add() {
				console.log(this.allmodel)
				// if(this.pdfurl==""){
				// 	this.$message({
				// 		message: '请选择下载文件',
				// 		type: 'warning'
				// 	});
				// }else{
				var allmodelname = ""
				this.allmodels.forEach((v, i) => {
					if (v.value == this.allmodel) {
						allmodelname = v.label
					}
				})
				console.log(this.pdfurl)
				this.$router.push({
					path: '/pdf',
					query: {
						allmodelname: allmodelname,
						allmodel: this.allmodel,
						pdfurl: this.pdfurl,
						pdfname: this.pdfurl.split("/")[3]
					}
				})
				// }
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
			margin-top: 20px;
			.font-bold {
				font-weight: 700
			}
		}

		.mintitle {
			font-size: 18px;
			width: 420px;
			font-family: Nunito Sans, sans-serif;
			text-align: center;
			margin-top: 16px;
		}

		.forms {
			width: 75%;
			max-width: 1200px;
			font-size: 40px;
			border-radius: 8px;
			margin-top: 20px;
			border: 1px solid rgba(59, 130, 246, .5);
			border-top: 0px;
			background-color: #fff;
			padding:16px 16px 0 16px;
			box-sizing: border-box;

			.formTitle {
				font-weight: 700;
				font-size: 20px;
				text-align: center
			}

			.selects {
				margin-top: 20px;

				.clkSelect {
					margin-right: 20px;
				}

				.select {
					margin-right: 10px;
				}

				.button {
					margin-left: 40px;
					position: relative;

					.buttons {
						width: 62px;
						height: 40px;
						background: #d2d2dc;
						font-size: 16px;
						border-radius: 8px;
					}

					.buttonTitle {
						width: 180px;
						margin-top: 10px;
						font-size: 12px;
						position: absolute;
						left: -50px;
						bottom: -20px;
					}
				}
			}

			.bottoms {
				width: 100%;
				height: 74px;
				background: #f9f9fa;
				font-size: 18px;

				.or {
					margin: 0 30px;
				}
			}
		}
	}

	.bottomTitle {
		margin: 30px 0;

		.bottomTitle {
			font-size: 12px;
			color: #91a2f4;
		}

		.bottomConcent {
			width: 600px;
			font-size: 30px;
			font-weight: 700;
			text-align: center;
		}
	}

	.conents {
		width: 100%;
		background-color: hsla(0, 0%, 100%, .5);
		background-image: radial-gradient(at 68% 65%, rgba(219, 236, 250, .5) 0, transparent 20%), radial-gradient(at 100% 38%, rgba(226, 215, 255, .5) 0, transparent 20%), radial-gradient(at 85% 56%, hsla(0, 0%, 100%, .7) 0, transparent 20%), radial-gradient(at 67% 82%, hsla(0, 0%, 100%, .5) 0, transparent 20%), radial-gradient(at 73% 46%, rgba(220, 249, 247, .5) 0, transparent 20%), radial-gradient(at 51% 53%, rgba(247, 222, 240, .5) 0, transparent 20%);
		margin-top: 60px;

		img {
			width: 500px;
			height: 600px;
		}

		.conentsAll {
			width: 30%;
			margin-left: 16%;

			.conentsAllOne {
				font-size: 30px;
				font-weight: 7000;
			}

			.conentsAllTwo {
				font-size: 18px;
				margin-top: 10px;
			}
		}

		.conentsAlls {
			margin-left: 0;
			margin-right: 16%;
		}
	}

	.backTop {
		width: 100%;
		text-align: center;
		margin: 160px 0;
		font-size: 20px;
		font-weight: 500;
	}
</style>