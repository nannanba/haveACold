<template>
	<view class="container">
		<view class="page-body">
			<scroll-view class="nav-left" scroll-y :style="'height:'+(height-45)+'px'">
				<view class="nav-left-item" @click="categoryClickMain(item,index)" :class="index==part1Index?'active':'unselected'" v-for="(item,index) in leftList" :key="index">
					<view class="left_part">{{item.bzjs1}}</view>
				</view>
			</scroll-view>
			<scroll-view class="nav-right" scroll-y :scroll-top="scrollTop" @scroll="scroll" :style="'height:'+(height-45)+'px'" scroll-with-animation>
				<!-- <form @submit="submitForm">
					<view class="uni-list">
						<checkbox-group @change="aaa">
							<label class="uni-list-cell uni-list-cell-pd" v-for="(item,index) in rightList.bzjs1" :key="index" :id="index" @tap="checkboxChange">
								<view style="width: 100%;">
									<view style="font-size: 16px;padding: 10px;" :style="{'border-bottom':item.checked?'1px solid #ccc':''}">
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
					<button class="submitBtn" form-type="submit">提交</button>
				</form> -->
				<view class="sxImg-view" v-for="(item,index) in sxImgArr" :key="index">
					<image :src="item" mode="" class="sxImg" :data-src="item" @tap="previewImage"></image>
				</view>
			</scroll-view>
		</view>
		<button  size="default" class="xzbz_confirm" @tap="wzzyBack">确 定</button>
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
				checkedValue:[],
				sxImgArr:[]
			}
		},
		onLoad: function (e) {
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			this.wzzyAddImgIndex=e.index;
			this.height = uni.getSystemInfoSync().windowHeight;
			if (global.sxmxSymptom.length==0) {
				this.getPartList();
			}else{
				this.leftList=[];
				this.leftList= JSON.parse(JSON.stringify(global.sxmxSymptom));//global.sxmxSymptom为引用类型数据 将global.symtom赋值给leftList并不是真正赋值而是值传递
				this.getSxtByName(this.leftList[0].bzjs1)
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
			
		},
		methods: {
			aaa:function(e){
				console.log(e);
				var value=e.detail.value;
			},
			scroll(e) {
				this.scrollHeight = e.detail.scrollHeight;
			},
			//请求数据*************************************************************
			getPartList:function(){
				let _this=this;
					global.getSymptom(1).then(data =>{
					let array=data.data;//后台返回的数据
					console.log(data);
					let leftObj={};//左侧数据
					for (var i = 0; i < array.length; i++) {
						leftObj={
							bzjs1:array[i].bzjs1,
							bzzz:array[i].bzjs2.split("|")[0]+','+array[i].bzjs2.split('|')[1],
							bzbzmc:array[i].bzjs2.split('|')[1],
							bzjs2:array[i].bzjs2.split('|')[2],
						}
						_this.leftList.push(leftObj);
					}
					console.log(this.leftList);
					global.sxmxSymptom=JSON.parse(JSON.stringify(this.leftList));
					this.getSxtByName(this.leftList[0].bzjs1)
				}); 
			},
			//请求舌象图***********************************************************
			getSxtByName:function(name){
				global.getSxtByName(name).then(res =>{
					console.log('舌象图请求完毕...');
					this.sxImgArr=res.data;
				})
			},
			//预览舌象图
			previewImage: function(e) {
				var current = e.target.dataset.src
				uni.previewImage({
					current: current,
					urls: this.sxImgArr
				})
			},
			//part1点击切换
			categoryClickMain(categroy, index) {
				this.part1Index = index;
				this.part2Index=0;
				this.getSxtByName(this.leftList[this.part1Index].bzjs1)
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
						if (this.checkedValue.length>=2) {
							uni.showToast({
								title: '主诉症状最多可选择两个症状',
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
				var bzjs1=this.leftList[this.part1Index].bzjs1;
				console.log(bzjs1);
				global.bzArray.push(bzjs1);
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
		display: flex;
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
		font-size: 32upx;
		align-items: center;
		justify-content: center;
		border-bottom: solid 1px #E0E0E0;
	}
	.nav-right {
		width: 70%;
	}
	.nav-right-item image {
		width: 100upx;
		height: 100upx;
	}
	.active {
		background: #FFFFFF;
		color: #007AFF;
		font-size: 16px;
		text-align: center;
	}
	.unselected{
		color: #000000;
		font-size: 16px;
		text-align: center;
	}
	.left_part{
		font-size: 32upx;
		height: 80upx;
		line-height: 80upx;
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
	/* 舌象图相关 */
	.sxImg-view{
		padding: 4upx;
		padding-top: 0;
	}
	.sxImg{
		width: 100%;
	}
</style>
