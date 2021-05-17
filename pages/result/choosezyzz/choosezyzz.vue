<template>
	<view class="container">
		<view class="page-body">
			<view class="uni-row uni-flex">
				<scroll-view class="nav-left" scroll-y :style="'height:'+(height-45)+'px'">
					<view class="nav-left-item" @click="categoryClickMain(item,index)" :class="index==part1Index?'active':'unselected'" v-for="(item,index) in leftList" :key="index" :style="{height:index==part1Index?'':'50px',display:conditionShow(item)}">
						<view :style="{'line-height':index!==part1Index?'50px':item.part2.length==1&&item.part2[0]==''?'50px':''}" class="left_part">{{item.part1==''?'其他症状':item.part1}}</view>
						<view class="unselected part2" :style="{display:index!==part1Index?'none':item.part2.length==1&&item.part2[0]==''?'none':'block'}"
							v-for="(item2,index2) in item.part2" :key="index2" @click.stop="part2Click(item,index,item2,index2)">
							<text :class="index2==part2Index?'active2':'unselected'" style="padding-left: 112upx;">{{item.part2.length==1&&item2==''?'':item.part2.length>=1&&item2==''?'其他':item2}}</text>
						</view>
					</view>
				</scroll-view>
				<scroll-view class="nav-right" scroll-y :scroll-top="scrollTop" @scroll="scroll" :style="'height:'+(height-45)+'px'" scroll-with-animation>
					<form @submit="submitForm">
						<view class="uni-list">
							<checkbox-group @change="aaa">
								<label class="uni-list-cell uni-list-cell-pd" v-for="(item,index) in rightList.bzjs1" :key="index" :id="index" @tap="checkboxChange">
									<view style="width: 100%;">
										<view style="padding: 10px;" :style="{'border-bottom':item.checked?'1px solid #ccc':''}">
											<text>{{item.name}}</text>
											<checkbox :value="item.name" color="#1296DB" :checked="item.checked" style="float: right;transform:scale(0.7);"/>
										</view>
										<view class="radio_view" @click.stop="aaa">
											<radio-group :name="'zz'+index" v-show="item.checked" @change="radioChange($event,index)">
												<label style="display: block;padding: 10upx 0upx;" v-for="(item2,index2) in rightList.bzjs2[index]" :key="index2">
													<radio style="transform:scale(0.7);" color="#1296DB" v-show="item2.bzzz==''?false:true" :value="item2.bzzz" :checked="item2.checked"/>
													<text>{{item2.bzzz}}</text>
												</label>
											</radio-group>
										</view>
									</view>
								</label>
							</checkbox-group>
						</view>
						<!-- <button class="submitBtn" form-type="submit">确 定</button> -->
					</form>
				</scroll-view>
			</view>
		</view>
		<button class="submitBtn" @tap="submitForm">确 定</button>
	</view>
</template>

<script>
	import helper from '@/common/helper.js';  
	export default {
		data() {
			return {
			    checkedYes:[],
				wzzyAddImgIndex:0,
				leftList: [],
				rightList: [],
				height: 0,
				part1Index: 0,
				part2Index:0,
				scrollTop: 0,
				scrollHeight: 0,
				rightArray:[],
				checkedArray:[],
				checkedValue:[]
			}
		},
		onLoad: function (e) {
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			this.wzzyAddImgIndex=e.index;
			this.height = uni.getSystemInfoSync().windowHeight;
			if (this.wzzyAddImgIndex==3) {
				this.part1Index=3
			}else if(this.wzzyAddImgIndex==4){
				this.part1Index=14
			}
			if (global.symptom.length==0) {
				this.getPartList();
			}else{
				this.leftList=[];
				this.rightList=[];
				this.leftList= JSON.parse(JSON.stringify(global.symptom));//global.symptom为引用类型数据 将global.symtom赋值给leftList并不是真正赋值而是值传递
				this.rightList={
					bzjs1:this.leftList[this.part1Index].bzjs1[0],
					bzjs2:this.leftList[this.part1Index].bzjs2[0]
				}
			}
			if (this.wzzyAddImgIndex==1) {
				var array=JSON.parse(e.zszz);
				this.checkedValue=array;
			}
			console.log(this.leftList);
		},
		onUnload() {
		},
		computed:{
			conditionShow:function(item){
				return function(item){
					if (this.wzzyAddImgIndex==3) {
						if (item.part1=='舌象') {
							return 'block';
						}else{
							return 'none'
						}
					}else if(this.wzzyAddImgIndex==4){
						if (item.part1=='脉象') {
							return 'block';
						}else{
							return 'none'
						}
					}else{
						if (item.part1=='舌象'||item.part1=='脉象') {
							return 'none'
						}else{
							return 'block'
						}
					}
				}
				
			}
		},
		methods: {
			aaa:function(e){
				console.log(e);
				var value=e.detail.value;
			},
			scroll(e) {
				this.scrollHeight = e.detail.scrollHeight;
			},
			getPartList:function(){
				let _this=this;
					global.getSymptom(0).then(data =>{
					let array=data.data;//后台返回的数据
					console.log(data);
					let leftObj={};//左侧数据
					let rightObj={};//右侧数据
					let leftArray=[];//
					let rightArr=[];//
					let rightArray=[];//
					let rightArray1=[];//
					for (var i = 0; i < array.length; i++) {
						leftObj={
							part1:array[i].part1,
							part2:[],
							bzjs1:[],
							bzjs2:[]
						}
						leftObj.part2.push(array[i].part2);
						leftObj.bzjs1.push(array[i].bzjs1);
						leftObj.bzjs2.push(array[i].bzjs2);
						if (this.leftList.length==0) { 
							this.leftList.push(leftObj);
						}else{
							for (var j = 0; j < this.leftList.length; j++) {
								if (this.leftList[j].part1==array[i].part1) {//part1相等 判断part2
									let part2=_this.leftList[j].part2
									for (var a = 0; a < part2.length; a++) {
										if (part2[a]==array[i].part2) {//part2已存在  判断bzjs1
											let bzjs1=_this.leftList[j].bzjs1;
											for (var b = 0; b < bzjs1.length; b++) {
												if (bzjs1[b]==array[i].bzjs1) {//bzjs1已存在 拼接bzjs2
													_this.leftList[j].bzjs2[b]+='%'+array[i].bzjs2;
													break
												}else{//bzjs1不存在 创建新的bzjs1
													if (b==bzjs1.length-1) {
														_this.leftList[j].bzjs1[a]+='&&'+array[i].bzjs1;
														_this.leftList[j].bzjs2[a]+='&&'+array[i].bzjs2;
														break
													}
												}
											}
											break
										}else{//part2不存在 创建新组内二级部位
											if (a==part2.length-1) {
												_this.leftList[j].part2.push(array[i].part2);
												_this.leftList[j].bzjs1.push(array[i].bzjs1);
												_this.leftList[j].bzjs2.push(array[i].bzjs2);
												break
											}
										}
									}
									break
								}else{//part1不相等 创建新组 一级部位
									if (j==this.leftList.length-1) {
										this.leftList.push(leftObj);
										break
									}
								}
							}
						}
					}
					//将数组内的pert2 bzjs1  bzjs2的字符串转换为数组
					//解析bzjs1 有多少个part2 就有多少种bzjs1
					for (var i = 0; i < this.leftList.length; i++) {
						for (var j = 0; j < this.leftList[i].bzjs1.length; j++) {
							this.leftList[i].bzjs1[j]=this.leftList[i].bzjs1[j].split('&&');
							var bzjs1=this.leftList[i].bzjs1[j];
							for (var a = 0; a < bzjs1.length; a++) {
								var obj={
									name:bzjs1[a],
									checked:false
								}
								bzjs1[a]=(obj);
							}
						}
						//解析bzjs2
						for (var j = 0; j < this.leftList[i].bzjs2.length; j++) {
							this.leftList[i].bzjs2[j]=this.leftList[i].bzjs2[j].split('&&');
							var bzjs2=this.leftList[i].bzjs2[j];
							for (var a = 0; a < bzjs2.length; a++) {
								var bzjs2s=bzjs2[a].split('%');
								bzjs2[a]=[];
								for (var b = 0; b < bzjs2s.length; b++) {
									let obj={
										bzzz:(bzjs2s[b].split('|')[0]+','+bzjs2s[b].split('|')[1]),
										bzbzmc:(bzjs2s[b].split('|')[1]),
										bzjs2:(bzjs2s[b].split('|')[2]),
										show:false,
										checked:false
									}
									bzjs2[a].push(obj)
								}
							}
						}
					}
					//将数据中 part1 part2为空或者null的合并
					var arr=this.leftList;
					var littleTime=[];
					for (var i = 0; i < arr.length; i++) {
						if (arr[i].part1==''||arr[i].part1==null) {
							littleTime.push(arr[i])
							arr.splice(i,1);
							i--
						}
					}
					if (littleTime.length==1) {
						this.leftList.push(littleTime[0])
					}else if(littleTime.length>1){
						var obj={
							part1:'',
							part2:[],
							bzjs1:[],
							bzjs2:[]
						} 
						for (var i = 0; i < littleTime.length; i++) {
							for (var n = 0; n < littleTime[i].part2.length; n++) {
								obj.part2.push(littleTime[i].part2[n]);
							}
							for (var n = 0; n < littleTime[i].bzjs1.length; n++) {
								obj.bzjs1.push(littleTime[i].bzjs1[n]);
							}
							for (var n = 0; n < littleTime[i].bzjs2.length; n++) {
								obj.bzjs2.push(littleTime[i].bzjs2[n]);
							}
						}
						this.leftList.push(obj);
					}
					//part2
					for (var i = 0; i < arr.length; i++) {
					var littleTimePart2=[];
						for (var n = 0; n < arr[i].part2.length; n++) {
							if (arr[i].part2[n]==''||arr[i].part2[n]==null) {
								var obj={
									part2:arr[i].part2[n],
									bzjs1:arr[i].bzjs1[n],
									bzjs2:arr[i].bzjs2[n]
								}
								littleTimePart2.push(obj);
								arr[i].part2.splice(n,1)
								arr[i].bzjs1.splice(n,1)
								arr[i].bzjs2.splice(n,1)
								n--
							}
						}
						if (littleTimePart2.length==1) {
							arr[i].part2.push('');
							arr[i].bzjs1.push(littleTimePart2[0].bzjs1);
							arr[i].bzjs2.push(littleTimePart2[0].bzjs2)
						}else if(littleTimePart2.length>1){
							arr[i].part2.push('');
							var bigBzjs1=littleTimePart2[0].bzjs1.concat(littleTimePart2[1].bzjs1)
							var bigBzjs2=littleTimePart2[0].bzjs2.concat(littleTimePart2[1].bzjs2)
							arr[i].bzjs1.push(bigBzjs1);
							arr[i].bzjs2.push(bigBzjs2)
						}
					}
					//初始化右侧数据
					this.rightList={
						bzjs1:this.leftList[this.part1Index].bzjs1[0],
						bzjs2:this.leftList[this.part1Index].bzjs2[0]
					}
					global.symptom=JSON.parse(JSON.stringify(this.leftList));
				}); 
			},
			//part1点击切换
			categoryClickMain(categroy, index) {
				this.rightList={
					bzjs1:this.leftList[index].bzjs1[0],
					bzjs2:this.leftList[index].bzjs2[0]
				};
				this.part1Index = index;
				this.part2Index=0;
			},
			//part2点击切换
			part2Click:function(item,index,item2,index2){
				this.rightList={
					bzjs1:item.bzjs1[index2],
					bzjs2:item.bzjs2[index2]
				}
				this.part2Index=index2;
				console.log(this.rightList);
			},
			//多选事件
			checkboxChange: function (e) {
				/* if (e.type=='tap') {
					return
				} */
				console.log('已选中症状',this.checkedValue);
				console.log(e);
				var id=parseInt(e.currentTarget.id);
				var array=this.checkedArray;
				console.log(this.rightList);
				var items = this.rightList.bzjs1;
				var bzjs2 = this.rightList.bzjs2,
                values = e.detail.value;
				var checkedBzjs1='';
				if (!items[id].checked) {
					if (this.wzzyAddImgIndex==1) {
						if (this.checkedValue.length>=3) {
							uni.showToast({
								title: '主诉症状最多可选择三个症状',
								icon: 'none'
							});
							items[id].checked=true;
							setTimeout(() =>{
								items[id].checked=false;
							},100);
							console.log(items[id]);
							return
						}
					}
				}
				items[id].checked=!items[id].checked;
				if (!items[id].checked) {
					for (var n = 0; n < bzjs2[id].length; n++) {
						bzjs2[id][n].checked=false;
					}
					//取消症状选中后判断已选中bzjs2数组是否有取消症状下的bzjs2  如果有：remove
					checkedBzjs1=items[id].name;
					for (var j = 0; j < array.length; j++) {
					 	if (array[j].bzjs1.name==checkedBzjs1) {
					 		array.splice(j,1);
					 	}
					}
					for (var i = 0; i < this.checkedValue.length; i++) {
						if (this.checkedValue[i]==items[id].name) {
							this.checkedValue.splice(i,1);
						}
					}
					console.log('删除后症状',this.checkedValue);
				}else{
					this.checkedValue.push(items[id].name)
				}
				console.log(array);
				this.checkedYes=values;
			},
			//bzjs2选中事件
			radioChange:function(e,index){
				console.log(e);
				var checkedArray=this.checkedArray;
				var value=e.detail.value;
				var bzjs2s=this.rightList.bzjs2[index];
				var bzjs2='';
				for (var i = 0; i < bzjs2s.length; i++) {
					if (value==bzjs2s[i].bzzz) {
						bzjs2s[i].checked=true;
						bzjs2=bzjs2s[i].bzzz;
					}else{
						bzjs2s[i].checked=false;
					}
				}
				//每选中一次 向数组增加一条数据
				var part1=this.leftList[this.part1Index].part1;
				var part2=this.leftList[this.part1Index].part2[this.part2Index];
				var bzjs1=this.leftList[this.part1Index].bzjs1[this.part2Index][index];
				var obj={
					part1:part1,
					part2:part2,
					bzjs1:bzjs1,
					bzjs2:bzjs2
				}
				if (checkedArray.length==0) {
					checkedArray.push(obj);
				}else{
					for (var i = 0; i < checkedArray.length; i++) {
						if (checkedArray[i].part1==part1) {
							if (checkedArray[i].part2==part2) {
								if (checkedArray[i].bzjs1==bzjs1) {
									checkedArray.splice(i,1);
									checkedArray.push(obj);
									break
								}else{
									if (i==checkedArray.length-1) {
										checkedArray.push(obj);
										break
									}
								}
							}else{
								if (i==checkedArray.length-1) {
									checkedArray.push(obj);
								}
							}
						}else{
							if (i==checkedArray.length-1) {
								checkedArray.push(obj);
							}
						}
					}
				}
				console.log(checkedArray);
			},
			//症状表单提交
			submitForm:function(e){
				console.log(e);
				var array=[]
				for (var i = 0; i < this.checkedArray.length; i++) {
					array.push(this.checkedArray[i].bzjs2);
				}
				console.log(array);
				if (array.length==0) {
					uni.showModal({
						title: '提示',
						content: '请选择明细症状',
						showCancel: false,
						cancelText: '确定',
					});
					return
				}
				global.bzArray=array;
				uni.$emit('buchong',{bzArr:array});
				global.wzzyAddImgIndex=this.wzzyAddImgIndex;
				uni.navigateBack({
					delta: 1
				});
			},
			//确定症状，返回上一页
			wzzyBack:function(){
				global.bzArray=this.checkedYes;
				global.wzzyAddImgIndex=this.wzzyAddImgIndex;
				uni.navigateBack({
					delta: 1
				});
			}
		}
	}
</script>

<style scoped>
	page{
		background: #fff;
		font-size: 32upx;
	}
	.page-body {
		/* display: flex; */
	}

	.nav {
		display: flex;
		width: 100%;
	}

	.nav-left {
		width: 30%;
		background: #f1f1f1;
		border-right: solid 1px #E0E0E0;
	}

	.nav-left-item {
		border-bottom: solid 1px #E0E0E0;
		font-size: 32upx;
		/* display: inline; */
		align-items: center;
		justify-content: center;
	}

	.nav-right {
		width: 70%;
	}


	.nav-right-item image {
		width: 100upx;
		height: 100upx;
	}

	.active {
		color: #007AFF;
		text-align: center;
	}
	.unselected{
		color: #000000;
		text-align: center;
	}
	.active {
		/* color: #007AFF; */
		background: #FFFFFF;
		text-align: center;
	}
	.left_part{
		font-size: 32upx;
		/* border-bottom: 2upx solid #CCCCCC; */
	}
	.part2{
		font-size: 16px;
	}
	.active2 {
		color: #007AFF;
	}
	.radio_view{
		/* width: 50%;
		margin-left: 25%; */
	}
	.xzbz_confirm{
	position: fixed;
    width: 100%;
    bottom: 0px;
    background: #1296db;
    color: #fff;
	border-radius: 0upx;
	}
	.uni-list-cell::after{
		left: 0upx;
		height: 0upx;
	}
	.uni-list-cell-pd{
		padding: 0;
		border-bottom: 2upx solid #CCCCCC;
	}
	.uni-list{
	padding: 0px 5px;
    width: 96%;
	}
	.submitBtn{
		height: 90upx;
		width: 100%;
		bottom: 0;
		z-index: 1001;
		color: #FFFFFF;
		background: #1296DB;
		position: fixed;
		left: 0;
		border-radius: 0px;
	}
</style>
