<template>
	<view>
		<modal :show="show" :type="type" @hidePopup="hideModal">
			<view class="page-body">
				<scroll-view class="nav-left" scroll-y :style="'height:'+height+'px'">
					<view class="nav-left-item" @click="categoryClickMain(item,index)" :class="index==part1Index?'active':'unselected'" v-for="(item,index) in leftList" :key="index" :style="{height:index==part1Index?'':'50px'}">
						<view :style="{'line-height':index==part1Index?'50px':'50px'}" class="left_part">{{item[0].part1}}</view>
						<view class="unselected part2" :style="{display:item.length==1&&item[0].part2==null?'none':index==part1Index?'block':'none'}"
							v-for="(item2,index2) in item" :key="index2" @click.stop="part2Click(item,index,item2,index2)">
							<text :class="index2==part2Index?'active2':'unselected'" style="padding-left: 112upx;">{{item2.part2==null?'其他':item2.part2}}</text>
						</view>
					</view> 
				</scroll-view>
				<scroll-view class="nav-right" scroll-y :scroll-top="scrollTop" @scroll="scroll" :style="'height:'+height+'px'" scroll-with-animation>
					<form @submit="submitForm">
						<view class="uni-list">
							<checkbox-group @change="checkboxChange">
								<label class="uni-list-cell uni-list-cell-pd" v-for="(item,index) in rightList" :key="index">
									<view style="width: 100%;">
										<view style="font-size: 16px;padding: 10px;" :style="{'border-bottom':item.checked?'1px solid #ccc':''}">
											<text>{{item.bzjs1}}</text>
											<checkbox :value="item.bzjs1" :checked="item.checked" style="float: right;"/>
										</view>
										<view @click.stop="checkboxChange">
											<view class="radio_view">
												<radio-group :name="'zz'+index" v-show="item.checked" @change="radioChange">
													<label style="display: block;" v-for="(item2,index2) in item.bzjs2" :key="index2">
														<radio style="transform:scale(0.8)"  v-show="item2==''?false:true" :value="item.bzzz[index2]" :checked="item.checked?'':false"/><text>{{item2}}</text>
													</label>
												</radio-group>
											</view>
										</view>
									</view>
								</label>
							</checkbox-group>
						</view>
						<button class="submitBtn" form-type="submit">提交</button>
					</form>
				</scroll-view>
			</view>
		</modal>
	</view>
</template>

<script>
	import modal from './modal.vue';
	import helper from '@/common/helper.js';
	export default {
		props:{
			show:{
				type:Boolean,
				default:false
			},
			type:{
				type:String,
				default:'middle'
			}
		},
		components:{
			modal
		},
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
				rightArray:[]
			};
		},
		beforeMount() {// 在挂载开始之前被调用。
			this.height = uni.getSystemInfoSync().windowHeight;
			this.getPartList();
		},
		created() {// 实例创建完成之后调用 【组件创建完成，不代表组件已挂载到页面】
			
		},
		mounted() {// 挂载到实例上去之后调用。 注意：此处并不能确定子组件被全部挂载，如果需要子组件完全挂载之后在执行操作可以使用$nextTickVue官方文档  
			
		},
		methods:{
			/* 关闭补充证状弹层 */
			hideModal:function(){
				this.$emit('supplementHidePopup');
			},
			//获取数据
			getPartList:function(){
				global.getSymptom().then(data =>{
					console.log(data);
					let array=data.data;//后台返回的数据
					let leftObj={};//左侧数据
					let rightObj={};//右侧数据
					let leftArray=[];//
					let rightArr=[];//
					let rightArray=[];//
					let rightArray1=[];//
					for (var i = 0; i < array.length; i++) {
						//左侧部位数组
						leftObj={
							part1:array[i].part1,
							part2:array[i].part2
						}
						if (leftArray.length==0) {
							leftArray.push(leftObj);
						}else{
							for (var j = 0; j < leftArray.length; j++) {
								if (leftArray[j].part1==leftObj.part1) {
									leftArray.push(leftObj);
									break
								}else{
									this.leftList.push(leftArray);
									leftArray=[];
									leftArray.push(leftObj);
								}
							}
						}
						//左侧数据去重
						for (var n = 0; n < leftArray.length; n++) {
							for (var j = n+1; j < leftArray.length; j++) {
								if (leftArray[n].part2==leftArray[j].part2) {
									leftArray.splice(j);
									j--;
								}
							}
						}
						console.log(leftArray);
						//右侧症状数组
						//part1  part2  bzjs1  bzzz bzbzmc  bzjs2
						//(废弃)全身%头部%发热%发热#发热#|发热而汗出不解#发热，汗出不解#汗出不解|发热不扬#发热不扬#发热不扬|发热轻/微发热#发热轻#发热轻|发热重#发热重#发热重
						let zzArr=array[i];
							rightObj={
								part1:zzArr.part1,
								part2:zzArr.part2,
								bzjs1:zzArr.bzjs1,
								bzzz:[],
								bzbzmc:[],
								bzjs2:[]
							}
						let bzjs2=zzArr.bzjs2.split('%');
						for (var n = 0; n < bzjs2.length; n++) {
							rightObj.bzzz.push(bzjs2[n].split('|')[0]+','+bzjs2[n].split('|')[1]);
							rightObj.bzbzmc.push(bzjs2[n].split('|')[1])
							rightObj.bzjs2.push(bzjs2[n].split('|')[2]);
						}
						if (rightArr.length==0) {
							rightArr.push(rightObj);
						}else{
							for(var j = 0; j < rightArr.length; j++) {
								if (rightArr[j].part1==rightObj.part1&&rightArr[j].part2==rightObj.part2) {
									rightArr.push(rightObj);
									break;
								}else{
									rightArray1.push(rightArr);
									rightArr=[];
									rightArr.push(rightObj);
									}
							}
						}
					}
					rightArray1.push(rightArr);
					console.log(rightArray1);
					for (var a = 0; a < rightArray1.length; a++) {
						if (rightArray.length==0) {
							rightArray.push(rightArray1[a])
						}else{
							for (var b = 0; b < rightArray.length; b++) {
								if (rightArray[b][0].part1==rightArray1[a][0].part1) {
									rightArray.push(rightArray1[a])
									break;
								}else{
									this.rightArray.push(rightArray);
									rightArray=[];
									rightArray.push(rightArray1[a]);
								}
							}
						}
					}
					this.rightArray.push(rightArray);
					if (leftArray.length!==0) {
						this.leftList.push(leftArray);
					}
					console.log('左侧部位数组',this.leftList);
					console.log('右侧症状数组',this.rightArray);
					this.rightList=this.rightArray[0][0];
				});
			},
			//part1点击切换
			categoryClickMain(categroy, index) {
				this.rightList=this.rightArray[index][0];
				this.part1Index = index;
				this.part2Index=0;
			},
			//part2点击切换
			part2Click:function(item,index,item2,index2){
				this.rightList=this.rightArray[index][index2];
				this.part2Index=index2;
				console.log(this.rightList);
			},
			//多选事件
			checkboxChange: function (e) {
				if (e.type=='tap') {
					return
				}
				console.log(e);
				console.log(this.rightList);
				   var items = this.rightList,
			        values = e.detail.value;
			    for (var i = 0; i<items.length; ++i) {
			        if(values.includes(items[i].bzjs1)){
			            this.$set(items[i],'checked',true);
			        }else{
			            this.$set(items[i],'checked',false);
			        }
			    }
				this.checkedYes=values;
			},
			//bzjs2选中事件
			radioChange:function(e){
				console.log(e);
			},
			//症状表单提交
			submitForm:function(e){
				console.log(e);
				let arr=e.detail.value;
				let array=[];
				for (let i in arr) {
					if (arr[i]!=="") {
						array.push(arr[i])
					}
				}
				console.log(array);
				if (array.length==0) {
					return
				}
				global.supplementArray=array;
				global.wzzyAddImgIndex=this.wzzyAddImgIndex;
				this.$emit('supplementHidePopup');
			}
		}
	}
</script>

<style>
page{
	background: #fff;
	font-size: 32upx;
	}
	.container{
		border-top: 1upx solid #CCCCCC;
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
		background: #eafcff;
		/* border-right: solid 1px #E0E0E0; */
	}

	.nav-left-item {
		/* border-bottom: solid 1px #E0E0E0; */
		font-size: 32upx;
		/* display: inline; */
		align-items: center;
		justify-content: center;
	}

	.nav-right {
		position: initial;
		width: 70%;
	}


	.nav-right-item image {
		width: 100upx;
		height: 100upx;
	}

	.active {
		/* color: #007AFF; */
		font-size: 16px;
		background: #FFFFFF;
		text-align: center;
	}
	.active2 {
		color: #007AFF;
		font-size: 16px;
	}
	.unselected{
		color: #000000;
		font-size: 16px;
		text-align: center;
	}
	.left_part{
		font-size: 32upx;
		/* border-bottom: 2upx solid #CCCCCC; */
	}
	.part2{
		font-size: 15px;
		text-align: left;
	}
	.radio_view{
		width: 50%;
		margin-left: 25%;
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
		border-bottom: 0upx solid #CCCCCC;
	}
	.uni-list{
	padding: 0px 5px;
    width: 96%;
	}
	.submitBtn{
		width: 100%;
		bottom: 0;
		z-index: 999;
		color: #FFFFFF;
		background: #1296DB;
		position: fixed;
		left:0;
		border-radius: 0;
	}
</style>
