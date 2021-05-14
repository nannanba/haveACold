<template>
	<view>
		<view class="head_view">
			<!-- 下拉框 -->
			<view class="selectView">
				<text style="font-weight: 700;">问症历史</text>
				<view class="tabView" @tap="openSelect">
					<text>{{selectText}}</text>
					<text class="select select_text">&#xe6df;</text>
					<view class="select_view" v-show="statusShow" >
						<view class="select_con" @click.stop="tabBar(index)" v-for="(item,index) in items" :key="index">{{item.bm}}</view>
					</view>
				</view>
			</view>
			<!-- 问症历史列表 -->
			<view class="uni-row uni-flex" style="padding: 0px 20upx;border-bottom: 1px solid #CCCCCC;">
				<view class="listHead" style="width: 30%;">日期</view>
				<view class="listHead" style="width: 45%;">症状</view>
				<view class="listHead" style="width: 25%;">病症类型</view>
			</view>
		</view>
		<view v-if="historyListShow" class="list_view">
			<view v-for="(item,index) in historyList" :key="index">
				<view class="uni-row uni-flex symptomRow" @tap="historyResult(item.id)">
					<view class="listDate">{{item.date}}</view>
					<view class="listBody uni-row uni-flex" style="width: 45%;">
						<view class="symptomCon_tit">{{item.symptom}}</view> 
						<text v-show="item.show" class="jieshi" @click.stop="openModel(item.symptom)">&#xe61a;</text>
					</view>
					<view class="listBody" style="width: 25%;overflow: hidden;">{{item.type}}</view>
				</view>
			</view>
		</view> 
		<view v-else class="noData">
			<text>暂无查询数据</text>
		</view>
		 <view class="TheBottom" v-show="botttomShow">
		 	<text>已加载全部数据</text>
		 </view>
		<!-- 弹出框 -->
		<modal :show="modelShow" type="symptom" @hidePopup="hidePopup">
			<view class="model_hd">
				<text>历史症状</text>
			</view>
			<view class="model_body">
				<view class="model_list" v-for="(item,index) in allSymptom" :key="index">
					<text>{{item}}</text>
				</view>
			</view>
			<view class="model_ft" @tap="hidePopup">
				<text>关闭</text>
			</view>
		</modal>
	</view>
</template>

<script>
	import App from '@/App.vue';
	import * as api from '@/common/API.js';
	import helper from '@/common/helper.js';
	import {ajax} from '@/common/ajax.js'
	import modal from '@/components/modal.vue';
	export default {
		components:{
			modal
		},
		data() {
			return {
				index:0,
				selectArray: [],
				bmId:0,
				historyList:[],
				historyListShow:true,
				modelShow:false,
				allSymptom:[],
				autoHeight:0,
				page:1,
				botttomShow:false,
				selectText:'',
				statusShow:false,
				current:0,
				items: [],
			}
		},
		computed:{
			
		},
		onLoad(e) {
			//计算列表高度
			/* let windowHeight=uni.getSystemInfoSync().windowHeight;
			const query = uni.createSelectorQuery().in(this);
				  query.select('#select_view').boundingClientRect(data => {
				  console.log("得到布局位置信息:" + JSON.stringify(data));
				  this.autoHeight=windowHeight-data.height;
				  console.log(this.autoHeight);
				  }).exec(); */
			//获取病名
			global.getBm().then(res =>{
				console.log(e.bm);
				let array=res.data;
				var arr=[];
				for(let i in array){
					var bm=array[i].split("#");
					var bmObj={
						bm:bm[0],
						status:bm[1],
						value:i,
						title:bm[2],
					}
					arr.push(bmObj);
				}
				arr.unshift({bm:'全部',status:1,value:-1})
				this.items=arr;
				for (var i = 0; i < this.items.length; i++) {
					if (e.bm==this.items[i].bm.replace(/\s*/g,"")) {
						this.selectText=this.items[i].bm;
						this.bmId=this.items[i].value;
					}
				}
				this.gethistory(this.bmId,this.page)
			}).catch(err =>{
				uni.showToast({
					title: '网络连接失败',
					icon: 'none'
				});
			})
		},
		//上拉加载
		onReachBottom(){
			if (this.botttomShow) {
				return
			}
			this.gethistory(-1,this.page)
		},
		methods: {
			/* 打开下拉框 */
			openSelect:function(){
				if (this.statusShow==false) {
					this.statusShow=true
				}else{
					this.statusShow=false;
				}
			},
			/* 问症历史 分类切换 */
			tabBar(index) {
				this.statusShow=false;
				if (this.selectText==this.items[index].bm) {
					return
				}
				this.selectText=this.items[index].bm;
				if (this.current !== index) {
					this.current = index
				}
				this.bmId=this.items[index].value;
				this.index=index;
				this.historyList=[]
				this.page=1;
				this.botttomShow=false;
				this.gethistory(this.bmId,1);
			},
			//关闭弹出框
			hidePopup:function(){
				this.modelShow=false
			},
			//获取问症历史
			gethistory:function(bmId,page){
				global.gethistory(bmId,page).then(data =>{
					console.log(data);
					let list=data.data;
					if (list!=="") {
						this.page+=1;
						this.historyListShow=true;
						//this.historyList=[]
						for (var i = 0; i < list.length; i++) {
							let obj={
								id:list[i].split("#")[0],
								date:list[i].split("#")[1],
								type:list[i].split("#")[2],
								symptom:list[i].split("#")[3],
								show:true
							}
							if (obj.symptom.split(',').length<2) {
								obj.show=false
							}
							this.historyList.push(obj);
						}
						if (list.length<20) {
							this.botttomShow=true;
						}
					}else if(list==''&&page<=1){
						this.historyListShow=false
					}
				}).catch(err =>{
					console.log('请求失败')
				})
			},
			//点击查看症状列表详情
			historyResult:function(id){
				global.gethistoryById(id).then(data =>{
					console.log(data);
					if (data.data=='') {
						uni.showToast({
							title: '请稍后重试',
							icon: 'none'
						});
						return
					}
					var pages=getCurrentPages();
					var prevPage = pages[pages.length - 2];   //上一页面
					prevPage.setData({
						historyData : data.data
					})
					uni.navigateBack({
						delta: 1
					}); 
				})
			},
			//查看症状
			openModel:function(symptom){
				if (symptom=='') {
					return
				}
				let arr=symptom.split(',');
				this.allSymptom=arr;
				this.modelShow=true;
			}
		}
	}
</script>

<style scoped>
	.picker_view{
		width: 30%;
		text-align: center;
		border: 1px solid #276B52;
		border-radius: 5px;
	}
	.down{
		float: right;
		display: inline;
		padding: 6upx 6upx;
		background: #CCCCCC;
		border-bottom-right-radius:10upx;
		border-top-right-radius: 10upx;
	}
	.select_text{
		padding: 0upx 6upx;
		background: #CCCCCC;
		border-bottom-right-radius: 10upx;
		border-top-right-radius: 10upx;
	}
	.listHead{
		font-weight: 700;
		font-size: 32upx;
		text-align: center;
	}
	.listBody{
		font-size: 32upx;
		line-height: 100upx;
		text-align: center;
	}
	.listDate{
		font-size: 32upx;
		width: 30%;
		text-align: center;
		line-height: 40upx;
		margin-top: 4upx;
	}
	.symptomRow{
		height: 90upx;
		border-bottom: 2upx solid #CCCCCC;
	}
	.symptomCon_tit{
		width: 80%;
		font-size: 32upx;
		line-height: 100upx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow:ellipsis;
	}
	.noData{
		font-size: 32upx;
		color: #CCCCCC;
		height: 70upx;
		line-height: 70upx;
		text-align: center;
		padding-top: 162upx;
		border-bottom: 2upx solid #CCCCCC;
	}
	.list_view{
		padding: 0upx 20upx;
		overflow: auto;
		margin-top: 162upx;
	}
	.model_hd{
		height: 70upx;
		line-height: 70upx;
		text-align: center;
		font-size: 32upx;
		border-bottom:  1upx solid #CCCCCC;
	}
	.model_body{
		height: 600upx;
		overflow: auto;
	}
	.model_list{
		height: 70upx;
		line-height: 70upx;
		font-size: 32upx;
		padding: 0px 30upx;
		border-bottom: 1upx solid #CCCCCC;
	}
	.model_ft{
		color: #b4b4b4;
		height: 70upx;
		line-height: 70upx;
		font-size: 32upx;
		text-align: center;
		padding: 0px 30upx;
		border-top: 1upx solid #CCCCCC;
	}
	.TheBottom{
		color: #CCCCCC;
		font-size: 32upx;
		height: 70upx;
		line-height: 70upx;
		text-align: center;
	}
	.head_view{
		position: fixed;
		top: 0;
		width: 100%;
		z-index: 999;
		background: #FFFFFF;
	}
	.selectView{
		padding: 20upx;
		font-size: 32upx;
	}
	.tabView{
		width: 35%;
		height: 25px;
		z-index: 997;
		text-align: center;
		position: relative;
		font-size: 32upx;
		margin-left: 20upx;
		display: inline-block;
		line-height: 25px;
		background: #f5f7fa;
		border-radius: 10upx;
		border: 1px solid #276B52;
	}
	.select_view{
		top: 25px;
		position: absolute;
		font-size: 16px;
		background: #FFFFFF;
		width: 99%;
		border: 1px solid #276B52;
	}
	.select_con{
		line-height: 2;
		font-size: 16px;
		border-bottom: 1px solid #eaeaea;
	}
</style>
