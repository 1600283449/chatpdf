<template>
	<div class="flex">
		<div class="exchange">
			<!-- 左边顶部的2个按钮 -->
			<div class="title justifyBetween" style="justify-content: flex-end;">
				<!-- 上传按钮 -->
				<el-upload class="upload-demo" action="#" multiple :limit="3" :show-file-list="false"
					:file-list="fileList" style="margin-top: 2px;" :http-request="handleFileUpload">
					<el-button type="primary" v-loading.fullscreen.lock="fullscreenLoading" class="button" size="small">
						Share<el-icon class="el-icon--right">
							<Upload />
						</el-icon>
					</el-button>
				</el-upload>
				<!-- 打开弹窗按钮 -->
				<el-button type="primary" class="button" size="small" @click="dialogTableVisible=true"
					style="margin-left: 10px;">
					select<el-icon class="el-icon--right">
						<Operation />
					</el-icon>
				</el-button>
				<el-button type="primary" class="button" size="small" @click="searchState=true"
					style="margin-left: 10px;">
					search<el-icon class="el-icon--right">
						<Search />
					</el-icon>
				</el-button>
			</div>
			<!-- 弹窗选择 -->
			<el-dialog title="" v-model="dialogTableVisible" width="800">
				<el-table :data="tableData" style="width: 100%;height: 180px;margin-top: 20px;">
					<el-table-column prop="Key" label="" width="300">
					</el-table-column>
					<el-table-column prop="time" label="" width="300">
					</el-table-column>
					<el-table-column label="" width="100">
						<template #default="scope">
							<el-icon size="16" @click="pdfselects(scope.row)">
								<Link />
							</el-icon>
							<span @click="pdfselects(scope.row)">view</span>
						</template>
					</el-table-column>
				</el-table>
			</el-dialog>
			<!-- 聊天框 -->
			<div class="modeltitle flex">
				<div class="pdfname flexAlignCenter">
					<div class="pdfColor"></div>
					<div class="pdfnames">chatgpt-4 <span
							v-if="my_time[0].chatTime!=''">duration:{{my_time[0].chatTime}}s</span></div>
				</div>
				<div class="pdfname flexAlignCenter">
					<div class="pdfColor"></div>
					<div class="pdfnames">{{$route.query.allmodelname}} <span
							v-if="my_time[1].modelTime!=''">duration:{{my_time[1].modelTime}}s</span></div>
				</div>
			</div>
			<div class="content">
				<div class="flexcenter allcontents" :style="{'height':contrastData?'50%':'88%'}" ref='pondModel'>
					<!-- 对比按钮 -->
					<div id='pondModel' v-if="answer==2">
						<div @mousedown="move" @mouseup="moves" class="contrastButton flexcenter"
							@click="contrastclick">
							contrast<el-icon class="el-icon-s-data">
								<Operation />
							</el-icon>
						</div>
					</div>
					<!-- 已上传文件chatgpt聊天框 -->
					<div class="contents" v-if="src" ref="problem">
						<div class="charts" v-for="v in list">
							<img src="../assets/heard.png" class="chartimg" v-if="v.state==1">
							<img src="../assets/AI.png" class="chartimgs" v-if="v.state==2">
							<p class="chartcontent">
								{{v.log}}
							</p>
						</div>
					</div>
					<!-- 未上传文件chatgpt聊天框 -->
					<div class="contents flexDirectionCenter" v-else>
						<el-upload class="upload-demo" action="#" multiple :limit="3" :show-file-list="false"
							:file-list="fileList" style="margin-top: 2px;" :http-request="handleFileUpload">
							<div class="flexDirectionCenter">
								<el-button type="primary" v-loading.fullscreen.lock="fullscreenLoading" class="button"
									size="small">
									Share<el-icon class="el-icon--right">
										<Upload />
									</el-icon>
								</el-button>
								<div style="margin-top:10px ;">There are currently no PDF documents available, please
									upload
									them</div>
							</div>
						</el-upload>
					</div>
					<!-- 已上传文件其他模型聊天框 -->
					<div class="contents" v-if="src" ref="problems">
						<div class="charts" v-for="v in list">
							<img src="../assets/heard.png" class="chartimg" v-if="v.state==1">
							<img src="../assets/AI.png" class="chartimgs" v-if="v.state==2">
							<p class="chartcontent">
								{{v.logs}}
							</p>
						</div>
					</div>
					<!-- 未上传文件其他模型聊天框 -->
					<div class="contents flexDirectionCenter" v-else>
						<el-upload class="upload-demo" action="#" multiple :limit="3" :show-file-list="false"
							:file-list="fileList" style="margin-top: 2px;" :http-request="handleFileUpload">
							<div class="flexDirectionCenter">
								<el-button type="primary" v-loading.fullscreen.lock="fullscreenLoading" class="button"
									size="small">
									Share<el-icon class="el-icon--right">
										<Upload />
									</el-icon>
								</el-button>
								<div style="margin-top:10px ;">There are currently no PDF documents available, please
									upload
									them</div>
							</div>
						</el-upload>
					</div>
				</div>
				<!-- 对比回答聊天框 -->
				<div class="allcontents" style="height:41%;width: 100%;border-top: 1px solid #000;" v-if="contrastData">
					<div class="contents" ref="allcontentsProblem" style="width: 100%;">
						<div class="pdfname flexAlignCenter">
							<div class="pdfColor"></div>
							<div class="pdfnames">contrast</div>
						</div>
						<el-icon class="el-icon-contrast" @click="contrastData=''">
							<Close />
						</el-icon>
						<div class="charts">
							<img src="../assets/AI.png" class="chartimgs">
							<p class="chartcontent">
								{{contrastData}}
							</p>
						</div>
					</div>
				</div>
				<!-- 发送问题的input框 -->
				<div class="updata">
					<el-input v-model="input2" placeholder="Please input" class="input">
						<template #append>
							<el-icon @click.stop="updataClick" size="30">
								<Top />
							</el-icon>
						</template>
					</el-input>
				</div>
			</div>
		</div>
		<!-- pdf展示 -->
		<div class="exchange">
			<div class="title titles">
				<div class="pdfTitle flexAlignCenter">
					<!-- 文件名字 -->
					<div class="pdfname flexAlignCenter">
						<div class="pdfColor"></div>
						<div class="pdfnames">{{pdfname}}</div>
					</div>
					<!-- 页数选择器 -->
					<div class="pagenum flexcenter">
						<!-- 增加页数 -->
						<el-icon @click="jia">
							<ArrowDown />
						</el-icon>
						<!-- 当前页数和总页数 -->
						<div class="input">
							<el-input class="inputs" v-model="currentPage" placeholder="Please input" /> /{{numPages}}
						</div>
						<!-- 减少页数 -->
						<el-icon @click="jian">
							<ArrowUp />
						</el-icon>
					</div>
					<!-- 占位符 -->
					<div class="proportion flexcenter">
					</div>
				</div>
			</div>
			<!-- psf展示 -->
			<div class="pdfs" ref="pdf" @scroll.passive="getScroll($event)" v-if="src">
				<pdf v-for="i in numPages" :key="i" :src="src" :page="i" style="width: 100%;margin-bottom: 20px;"
					:style="{'height':pdfheight}">

				</pdf>
			</div>
			<!-- 上传文件 -->
			<div class="pdfs flexDirectionCenter" v-else>
				<div style="margin-top:10px ;">There are currently no PDF documents available, please upload
					them</div>
			</div>
		</div>
		<search :drawer="searchState" @drawerstate="drawerstate"></search>
		<!-- 最右边侧边栏pdf名字 -->
		<div class="exchange exchanges">
			<div class="title titles">

			</div>
			<div class="selectpdf flexdirection">
				<div>{{pdfname}}</div>
			</div>
		</div>
	</div>
</template>

<script>
	// 引用pdf插件
	import pdf from 'vue3-pdf'
	import search from "./search.vue"
	// 引用api文件里定义的api
	import {
		apiData,
		apiDatas,
		c3,
		allcontentsapi,
		apiList
	} from "@/api/user.js"
	// 引用element-ui里的loading插件
	import {
		ElLoading
	} from 'element-plus'
	export default {
		components: {
			pdf,
			search
		},
		data() {
			return {
				// 点击对比按钮loading是否显示
				loadingInstance: "",
				// 控制对比按钮为2的时候显示
				answer: 1,
				searchState: false,
				// 选择表格的数字组
				tableData: [],
				// 控制弹窗是否显示
				dialogTableVisible: false,
				// 上传按钮的loading是否显示
				fullscreenLoading: false,
				// 当前页数
				currentPage: 0,
				// 总页数
				numPages: 0,
				// 发送问题绑定的值
				input2: "",
				// 对比回答出的内容
				contrastData: "",
				// 文件路由
				src: '',
				// 控制是否可以发送信息
				inputstate: 2,
				// 检测对比按钮是点击还是滑动,false为滑动,true为点击
				key: false,
				// s3路由前缀
				pdfUrl: "https://chatpdf-team815.s3.amazonaws.com/",
				// pdf的名字
				pdfname: "",
				// 聊天框显示的内容数组
				list: [{
					log: "Hello, I am your GPT assistant.",
					logs: "Hello, I am your OpenSource Model assistant.",
					state: 2
				}],
				// 鼠标按下时间
				firstTime: "",
				// 鼠标抬起时间
				lastTime: "",
				// 定时器
				testTimeOuts: "",
				my_time: [{
						'chatTime': ""
					},
					{
						'modelTime': ""
					}
				],
				pdfheight: ""
			}
		},
		// 生命周期获取也面前加载的数据
		created() {
			// 获取到s3pdf列表数据
			apiList().then((res) => {
				this.tableData = res.data.data.Contents
				this.tableData.forEach((data) => {
					var Time = new Date(data.LastModified)
					var getMonth = Time.getMonth() + 1
					data.time = Time.getFullYear() + "-" + getMonth + "-" + Time.getDate()
					if (this.$route.query.pdfname == data.Key) {
						console.log(data)
						this.pdfselects(data)
					}
				})
			})
		},
		// 生命周期销毁页面
		beforeUnmount() {
			var that = this
			clearTimeout(that.testTimeOuts)
		},
		// 监听list发生改变自动加载聊天框置底高度
		watch: {
			list: {
				handler: function(newVal, oldVal) {
					// ...
					if (this.list.length >= 2) {
						var current = this.$refs.problem
						current.scrollTop = current.scrollHeight + 100
						var currents = this.$refs.problems
						currents.scrollTop = currents.scrollHeight
					}

					if (this.contrastData.length != 0) {
						var allcontentsCurrent = this.$refs.allcontentsProblem
						allcontentsCurrent.scrollTop = allcontentsCurrent.scrollHeight
					}
				},
				deep: true

			}
		},
		methods: {
			// 对比按钮鼠标抬起事件,决定鼠标从按下到抬起所用时间
			moves() {
				this.lastTime = new Date().getTime();
				if ((this.lastTime - this.firstTime) < 200) {
					this.key = true;

				}
			},
			drawerstate(value) {
				this.searchState = value
			},
			// 对比按钮鼠标按下开始滑动
			move(e) {
				this.key = false;
				this.firstTime = new Date().getTime();
				let odiv = e.target
				let disX = e.clientX - odiv.offsetLeft
				let disY = e.clientY - odiv.offsetTop
				document.onmousemove = (e) => {
					//计算元素位置(需要判断临界值)
					let left = e.clientX - disX;
					let top = e.clientY - disY;
					let {
						offsetHeight: pondModelHeight,
						offsetWidth: pondModelWidth,
					} = this.$refs.pondModel;
					let {
						offsetHeight: sonNodeHeight,
						offsetWidth: sonNodeWidth,
					} = odiv;
					// 左上角(left)
					if (left < 0) {
						left = 0;
					}
					if (top < 0) {
						top = 0;
					}
					// 左下角
					if (top > pondModelHeight - sonNodeHeight) {
						top = pondModelHeight - sonNodeHeight
					}
					if (left > pondModelWidth - sonNodeWidth) {
						left = pondModelWidth - sonNodeWidth
					}
					odiv.style.left = left + 'px'
					odiv.style.top = top + 'px'
					odiv.style.zIndex = 999

				}
				document.onmouseup = (e) => {
					document.onmousemove = null
					document.onmouseup = null
					odiv.style.zIndex = 1
					odiv = null
				}
			},
			// 点击弹窗表格的查看
			pdfselects(row) {
				this.pdfname = row.Key
				this.src = this.pdfUrl + row.Key
				this.dialogTableVisible = false
				const loadingTask = pdf.createLoadingTask(this.src)
				loadingTask.promise.then(pdf => {
					this.numPages = pdf.numPages
				})
				this.currentPage = 1
				this.inputstate = 2
				this.list = [{
					log: "Hello, I am your GPT assistant.",
					logs: "Hello, I am your OpenSource Model assistant.",
					state: 2
				}]
			},
			// 上传文件
			async handleFileUpload(file) {
				var that = this
				const formDate = new FormData()
				formDate.append('file', file.file)
				// 调用后端服务器的接口
				that.fullscreenLoading = true
				c3(formDate).then((res) => {
						that.fullscreenLoading = false
						if (res.data.success == true) {
							that.src = res.data.data
							that.pdfname = file.file.name
							that.currentPage = 1
							that.fullscreenLoading = false
							that.inputstate = 2
							that.list = [{
								log: "Hello, I am your GPT assistant.",
								logs: "Hello, I am your OpenSource Model assistant.",
								state: 2
							}]
							const loadingTask = pdf.createLoadingTask(that.src)
							loadingTask.promise.then(pdf => {
								that.numPages = pdf.numPages
								that.pdfheight = that.numPages * 1269
								console.log(that.pdfheight)
							})
							that.$refs.pdf.scrollTop = 0
						} else {
							this.fullscreenLoading = false
						}
					})
					.catch(error => {
						this.fullscreenLoading = false
					});
				// 先无痕解析pdf
				apiData(formDate).then((res) => {

				})

			},
			// 增加页面
			jia() {
				if (this.currentPage < this.numPages) {
					this.currentPage = this.currentPage + 1
					this.$refs.pdf.scrollTop = (this.currentPage - 1) * 1269
				}
			},
			// 减少页面
			jian() {
				if (this.currentPage >= 1) {
					if (this.currentPage <= 1) {
						this.currentPage = 1
					} else {
						this.currentPage = this.currentPage - 1
					}
					var currentPages = this.currentPage - 1
					this.$refs.pdf.scrollTop = currentPages * 1269
				}
			},
			// 实时监控pdf展示框的高度来计算当前页数
			getScroll(event) {
				// 检测当前高度
				let scrollBottom =
					event.target.scrollHeight -
					event.target.scrollTop -
					event.target.clientHeight;
				console.log(scrollBottom)
				// 计算当前页数  ~~是js的取整数方法
				this.currentPage = this.numPages - (~~(scrollBottom / 1269 + 1)) + 1
				if (this.currentPage == 0 || this.currentPage == 1) {
					this.currentPage = 1
				}
			},
			// 点击对比触发的方法
			contrastclick() {
				var that = this
				if (this.key) {
					// element-ui Loading写法,开启Loading
					let options = ({
						lock: true,
						text: 'Loading',
						background: 'rgba(0, 0, 0, 0.7)',
					})
					that.loadingInstance = ElLoading.service(options);
					// 调用chatgpt对比回答
					var chatlists = that.list[that.list.length - 1];
					let add = {
						log: chatlists.log + ',gentle,' + chatlists.logs +
							",Evaluate the two answers using matrics as Relevance, Fluency, and if there is garble message, according to the content of the file, and return the result of the comparison.",
						pdfname: that.pdfname,
					}
					// 进行两个答案对比回答
					allcontentsapi(add).then(res => {
							if (res.data.success) {
								that.contrastData = res.data.data
								// 关闭Loading
								that.loadingInstance.close();
							} else {
								that.loadingInstance.close();
							}
						})
						.catch(error => {
							that.loadingInstance.close();
						})
				}
			},
			// 点击回答
			updataClick() {
				// src有数据的时候可以选择进行发送问题操作
				if (this.src) {
					var that = this
					// inputstate为2的时候可以进行发送问题操作
					if (that.inputstate == 2) {
						// 定义要发送的内容
						let add = {
							log: that.input2,
							logs: that.input2,
							state: 1,
							pdfname: that.pdfname,
							allmodel: that.$route.query.allmodel
						}
						// 页面展示内容
						that.list.push(add)
						// 清空问题框
						that.input2 = ""
						// inputstate变为1不可发送问题
						that.inputstate = 1
						// 继续改变聊天框显示内容
						let adds = {
							log: "obtaining answers....(it might take a while for the first time)",
							logs: "obtaining answers....(it might take a while for the first time)",
							state: 2
						}
						that.list.push(adds)
						// 定时器如果超过30秒则改变聊天框显示内容
						that.testTimeOuts = setTimeout(function() {
							that.list.forEach((res) => {
								if (res.log ==
									"obtaining answers....(it might take a while for the first time)") {
									res.log = "It might be slow for the first time..."
									res.logs = "It might be slow for the first time..."
									clearTimeout(that.testTimeOuts)
								}
							})
						}, 30000);
						// 发送问题到后端
						apiDatas(add).then(res => {
								if (res.data.success) {
									// 获取成功清楚最后获取问题是的一些展示显示答案
									that.list.pop()
									// 清空定时器
									clearTimeout(that.testTimeOuts)
									let add = {
										log: res.data.data.chatlAnswer,
										logs: res.data.data.allmodelAnswer,
										state: 2
									}
									res.data.data.my_time[0].chatTime = res.data.data.my_time[0].chatTime.toFixed(3)
									res.data.data.my_time[1].modelTime = res.data.data.my_time[1].modelTime.toFixed(3)
									this.my_time = res.data.data.my_time

									let chatlAnswer = res.data.data.chatlAnswers
									let chatlAnswersplitOne = chatlAnswer.split("found on page")
									console.log(chatlAnswersplitOne)
									if (chatlAnswersplitOne[1]) {
										let chatlAnswersplitTwo = chatlAnswersplitOne[1].split("of")
										let chatlAnswerpage = Number(chatlAnswersplitTwo[0])
										this.currentPage = chatlAnswerpage + 2
										this.$refs.pdf.scrollTop = (chatlAnswerpage + 2.3) * 1269
									}
									that.answer = 2
									that.inputstate = 2
									that.list.push(add)
								} else {
									// 获取失败清楚改变显示答案
									that.answer = 1
									// 清空定时器
									clearTimeout(that.testTimeOuts)
									that.inputstate = 2
									that.list.forEach((res) => {
										if (res.log ==
											"obtaining answers....(it might take a while for the first time)" ||
											res.log == "It might be slow for the first time...") {
											res.log = "Please re-enter the question"
											res.logs = "Please re-enter the question"
											that.inputstate = 2
										}
									})
								}
							})
							// 链接失败清楚改变显示答案
							.catch(error => {
								that.answer = 1
								// 清空定时器
								clearTimeout(that.testTimeOuts)
								that.inputstate = 2
								that.list.forEach((res) => {
									if (res.log ==
										"obtaining answers....(it might take a while for the first time)" ||
										res.log == "It might be slow for the first time...") {
										res.log = "Please re-enter the question"
										res.logs = "Please re-enter the question"
										that.inputstate = 2
									}
								})
							});
					} else {
						// 如果上一个问题还未回答完成继续提出问题提示
						this.$message({
							message: 'Please wait for the previous information acquisition to be completed',
							type: 'warning'
						});
					}
				} else {
					// 如果没上传文件提示
					this.$message({
						message: 'Please upload the file',
						type: 'warning'
					});
				}
			}
		}
	}
</script>
<style lang="scss" scoped>
	.exchange {
		width: 48%;
		height: 97vh;
		border-right: 2px solid #f5f5f5;
		
		.title {
			width: 100%;
			height: 5%;
			// border-bottom: 2px solid #f5f5f5;
			padding: 8px;
			box-sizing: border-box;

			.button {
				border-radius: 16px;
			}
		}

		.selectpdf {
			height: 90px;
			// border-bottom: 2px solid #f5f5f5;
			font-size: 16px;
			color: #aea2b0;
			font-weight: 400;
			justify-content: center;
		}

		.pdfs {
			width: 100%;
			height: 95vh;
			overflow: scroll;
			padding-right: 30px;
			// background: #f5f5f5;
		}
		.pdfs::-webkit-scrollbar {
			display: none;
		}
			
		.modeltitle{
			width: 100%;
			height: 40px;
			.pdfname {
				width: 50%;
				height: 30px;
				padding-left: 6px;
				padding-top: 10px;
				font-size: 20px;
			
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
		}
		.content {
			height: 93%;
			box-sizing: border-box;

			.allcontents {
				height: 90%;
				position: relative;
				#pondModel {
					.contrastButton {
						position: absolute;
						width: 90px;
						height: 29px;
						left: 45%;
						z-index: 99;
						color: #fff;
						font-size: 16px;
						border-radius: 4px;
						background-color: #099eff;
					}
				}

				.contents {
					width: 50%;
					height: 100%;
					overflow: scroll;
					position: relative;
					// border-left: 2px solid #54ffff;
					.pdfname {
						width: 22%;
						height: 30px;
						padding-left: 6px;
						padding-top: 10px;
						position: fixed;
						font-size: 20px;

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

					.el-icon-contrast {
						position: absolute;
						right: 30px;
						top: 20px;
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
						font-size: 16px;
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
			}

			.contents::-webkit-scrollbar {
				display: none;
			}

			.updata {
				width: 100%;
				// height: 10%;


				.input {
					height: 70px;
					font-size: 16px;
				}
			}
		}

		.titles {
			.pdfTitle {
				width: 100%;
				height: 80%;

				.pdfname {
					width: 33.3%;
					height: 100%;

					.pdfColor {
						width: 3px;
						height: 100%;
						background-color: #00ffff;
					}

					.pdfnames {
						margin-left: 4px;

						span {
							font-weight: 700;
						}
					}
				}

				.pagenum {
					width: 33.3%;
					height: 100%;
					// border-right: 2px solid #f5f5f5;
					// border-left: 2px solid #f5f5f5;

					.input {
						margin: 0 20px;

						.inputs {
							width: 50px;
							height: 30px;
						}
					}
				}

				.proportion {
					width: 33.3%;
					height: 100%;

					.m-2 {
						width: 100px;
						border: none;
					}
				}
			}
		}
	}

	.exchanges {
		width: 4%;
	}

	:deep(.el-select .el-input__wrapper) {
		box-shadow: none !important;
	}


	:deep(.el-select .el-input.is-focus .el-input__wrapper) {
		border-color: #DCDFE6 !important;
		box-shadow: none !important;
	}
</style>
<style>
	.el-dialog {
	   background-image: url(../assets/searchback.jpg);
	   background-size: 100% 100%;
	}
	.el-table tr {
	   background-color: transparent !important;  
	}
	.el-table--fit{
		background-color: transparent !important;
	}
	.el-table td.el-table__cell, .el-table th.el-table__cell.is-leaf {
	    background-color: transparent !important;
	}
	.el-table td.el-table__cell, .el-table th.el-table__cell.is-leaf {
		border-bottom:none;
	}
</style>