<template>
	<view style="height: 100%;" @click="closeLxView">
		<view class="modal_content">
			<view class="uni-flex uni-row" style="height: 60upx;position: relative;">
			    <input type="text" confirm-type="search"  @click.stop="lx_viewshow"  :focus="true" class="zzbx_input" @confirm="seachZzbx" v-model="zzbx" :placeholder="placeholder" @input="keyup" />
				<text class="rmv-btn removeInput" v-show="zzbx!==''?true:false" @tap="zzbx='',lxci=[],lx_view=false,autofocus=true,historyStatus=true,manualSeach=false">&#xe71f;</text>
				<text class="suosou suosou_icon">&#xe609;</text> 
				<!-- <view class="searchBtn"><text class="suosou" @tap="seachZzbx" style="font-size: 32upx;">&#xe609;</text></view> -->
				<text style="font-size: 30upx;position: absolute;right: 6upx;" @tap="seachZzbx">搜索</text>
			</view>
			<view class="zz_hint" v-show="!lx_view&&(!manualSeach)">
				主诉症状最多选择两个，若要修改，需要先删除已选择好的症状再进行搜索。
			</view>
			<!-- 搜索历史 -->
			<view class="input_view" v-show="!lx_view&&(!manualSeach)">
				<view class="">
					<text class="history_seach">搜索记录</text>
					<text class="remove_history removeBtn" @tap="removeHistory">&#xe678;</text>
				</view>
				<view class="history_view">
					<view class="history_btn" v-for="(item,index) in historyItemCopy" :key="index" @tap="btnSeach(item.name)" :style="[{display:item.name==''?'none':item.display}]">
						<text>{{item.name}}</text>
					</view> 
					<view class="history_btn look_more" :style="[{display:more_showCopy==false?'none':'inline-block'}]" @tap="showAllHistory">更多<text class="more_icon">&#xe618;</text></view>
				</view>
			</view>
			<!-- 病名提示词 -->
			<view class="lx_view" v-if="seachIndex==5" v-show="lx_view">
				<tr v-for="(item, index) in lxci" :key="index" :id="item.name" class="hotWord" @tap="idSeach">{{item.name+'('+item.type+')'}}</tr>
			</view>
			<!-- 症状提示词 -->
			<view class="lx_view" v-else v-show="lx_view">
				<view class="glzzTitle" v-show="relation">相关症状：</view>
				<tr v-for="(item, index) in lxci" :key="index" :id="item.cfzz" class="hotWord" @tap="idSeach">{{item.cfzz+'；'+item.bzzz+(item.zzjs==null||item.zzjs=='null'?'':'；'+item.zzjs)}}</tr>
			</view>
			<!-- 病名点击搜索按钮后显示的提示词 -->
			<view class="manualSeachView" v-if="seachIndex==5" v-show="manualSeach" :style="{'height':scrollView}">
				<view class="esJg_view" v-for="(item, index) in lxci" :key="index" :id="item.name" @tap="idSeach">{{item.name+'('+item.type+')'}}</view>
			</view>
			<!-- 点击搜索按钮后显示的症状提示词 -->
			<view class="manualSeachView" v-else v-show="manualSeach" :style="{'height':scrollView}">
				<view class="esJg_view" v-for="(item, index) in lxci" :key="index" :id="item.cfzz" @tap="idSeach">{{item.cfzz+(item.zzjs==null||item.zzjs=='null'||item.zzjs==''?'':'<'+item.zzjs+'>')}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import * as Api from '@/common/API.js';
	import { tokenAjax } from '@/common/ajax.js';
	import helper   from '@/common/helper.js';
	export default {
		data() {
			return {
				zzbx:'',
				lxci: [],
				seachIndex:null,
				lx_view: false,
				manualSeach:false,
				autofocus:true,
				historyItemCopy:[],
				more_showCopy:false,
				historyStatus:false,
				zzbxArray:[],
				othersArray:[],
				yzbmArray:[],
				sxArray:[],
				mxArray:[],
				placeholder:'输入关键词查询症状...',
				relation:false
			}
		},
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		onLoad(e) {
			console.log(e);
			var array=JSON.parse(e.array);
			var allArray=JSON.parse(e.allArrays);
			this.seachIndex=parseInt(e.type) 
			switch (this.seachIndex){
				case 1:
					this.zzbxArray=array;
					this.historyItemCopy=uni.getStorageSync('wzzyRecord')==''?[]:uni.getStorageSync('wzzyRecord');
					break;
				case 2:
					this.historyItemCopy=uni.getStorageSync('wzzyRecord')==''?[]:uni.getStorageSync('wzzyRecord');
					this.othersArray=array;
					break;
				case 3:
					this.sxArray=array
					this.placeholder='请输入舌象...'
					this.historyItemCopy=uni.getStorageSync('wzzy_sxRecord')==''?[]:uni.getStorageSync('wzzy_sxRecord');
					break;
				case 4:
					this.mxArray=array
					this.placeholder='请输入脉象...'
					this.historyItemCopy=uni.getStorageSync('wzzy_mxRecord')==''?[]:uni.getStorageSync('wzzy_mxRecord');
					break;
				case 5:
					this.placeholder='请输入病名...'
					this.yzbmArray=array
					this.historyItemCopy=uni.getStorageSync('wzzy_bmRecord')==''?[]:uni.getStorageSync('wzzy_bmRecord');
					break;
				default:
					break;
			}
			//是否显示更多按钮
			if (this.historyItemCopy.length>6) {
				this.more_showCopy=true
			}else{
				this.more_showCopy=false
			}
			if (this.historyItemCopy.length>0) {
				this.historyStatus=true;
			}else{
				this.historyStatus=false;
			}
			//如果array有值 自动请求相关症状
			if (allArray.length>0&&(e.type!==5)) {
				var allArrayString='';
				for (var i = 0; i < allArray.length; i++) {
					allArrayString+= '；'+allArray[i].bzzz
				}
				allArrayString=allArrayString.substr(1);
				console.log('即将搜索'+'“'+allArrayString+'”'+'的相关症状');
				global.getRelation(allArrayString,this.seachIndex).then(res =>{
					var arr=res.data;
					if (arr=='') {
						return
					}
					this.relation=true;
					for (var i = 0; i < arr.length; i++) {
						var obj={
							cfzz:arr[i].split('#')[0],
							bzzz:arr[i].split('#')[1],
							zzjs:arr[i].split('#')[2],
						}
						this.lxci.push(obj);
					}
					console.log(this.lxci);
					//this.historyStatus=false;
					this.lx_view=true;
					//this.glzz=true;
				}).catch(err =>{
					
				})
			}
		},
		created() {
		},
		onShow() {
			
		},
		computed:{
			scrollView:function(){
				var height=global.systemInfo.windowHeight;
				console.log(height);
				return height-50+'px'
			}
		},
		methods: {
			closeLxView:function(){
				this.lx_view=false,
				this.manualSeach=false,
				this.historyStatus=true
			},
			/* 输入框 得到焦点  */
			 lx_viewshow(){
					if(this.lxci.length!==0){
					this.lx_view=true;
					this.manualSeach=false;
					this.historyStatus=false;
					}
				}, 
			//搜索记录
			seachHistory:function(){
				var name = this.zzbx.trim().replace(/\)s/g, '');
				switch (this.seachIndex){
					case 1: case 2:
					var arr=uni.getStorageSync('wzzyRecord');
						break;
					case 3:
					var arr=uni.getStorageSync('wzzy_sxRecord');
						break;
					case 4:
					var arr=uni.getStorageSync('wzzy_mxRecord');
						break;
					case 5:
					var arr=uni.getStorageSync('wzzy_bmRecord');
						break;
					default:
						break;
				}
				if (arr=='') {
					arr=[];
				}
				if (arr.length==0) {
					var obj={
						name:name,
						display:'inline-block'
					}
					arr.unshift(obj);
				}else{
					for (var i = 0; i < arr.length; i++) {
						if (arr[i].name==name) {
							arr.splice(i,1);
							break
						}
					}
					var obj={
						name:name,
						display:'inline-block'
					}
					arr.unshift(obj);
				}
				for (var i = 0; i < arr.length; i++) {
					if (i>5) {
						arr[i].display='none';
						this.more_showCopy=true;
					}
				}
				this.historyItemCopy=arr;
				switch (this.seachIndex){
					case 1: case 2:
					uni.setStorageSync('wzzyRecord',arr);
						break;
					case 3:
					uni.setStorageSync('wzzy_sxRecord',arr);
						break;
					case 4:
					uni.setStorageSync('wzzy_mxRecord',arr);
						break;
					case 5:
					uni.setStorageSync('wzzy_bmRecord',arr);
						break;
					default:
						break;
				}
			},
			/* 输入框自动请求事件 */
			keyup(e) {
				this.relation=false;
				if (e==undefined) {
					var name=this.zzbx.replace(/(^\s*)|(\s*$)/g, "");
				}else{
					var name = e.detail.value.replace(/(^\s*)|(\s*$)/g, "");
				}
				if (name=='') {
					this.lx_view = false;
					return
				}
				if (this.seachIndex==1||this.seachIndex==2) {
				}else if(this.seachIndex==3){
				}
				switch (this.seachIndex){
					case 1: case 2:
						this.request(name,false,Api.lxApi);
						break;
					case 3: case 4:
						this.sxmxSeach(name,false);
						break;
					case 5:
						this.yzbmSeach(name,false);
						break;
					default:
						break;
				}
			},
			//删除历史记录
			removeHistory:function(){
				this.historyItemCopy=[];
				uni.setStorageSync('wzzyRecord',[]);
			},
			//将历史记录赋值到输入框
			btnSeach:function(name){
				this.zzbx=name;
				this.keyup();
			},
			//展开所有历史记录
			showAllHistory:function(){
				this.more_showCopy=false;
				var arr=this.historyItemCopy;
				for (var i = 0; i < arr.length; i++) {
					arr[i].display='inline-block';
				}
			},
			/* 搜索按钮 查询症状表现 */
			seachZzbx() {
				var name = this.zzbx.trim().replace(/\)s/g, '');
				console.log(name);
				if (name == '') {
					uni.showModal({
						title: '提示',
						content: '请输入症状表现',
						showCancel: false,
						confirmText: '确定'
					});
					return;
				}
				this.seachHistory();
				switch (this.seachIndex){
					case 1: case 2:
					this.request(name,true,Api.searchZybz);
						break;
					case 3: case 4:
					this.sxmxSeach(name,true);
						break;
					case 5:
					this.yzbmSeach(name,true);
						break;
					default:
						break;
				}
			},
			/* 点击建议词 将建议词放到指定view*/
			idSeach: function(e) {
				this.seachHistory();
				let lx_name = e.currentTarget.id;
				var flag = false;
				var array=[];
				switch (this.seachIndex){
					case 1:
						array=this.zzbxArray;
						break;
					case 2:
						array=this.othersArray;
						break;
					case 3:
						array=this.sxArray;
						break;
					case 4:
						array=this.mxArray;
						break;
					case 5:
						array=this.yzbmArray;
						break;
					default:
						break;
				}
				if (array == undefined) {
					array = 0;
				}
				if (array.length !== 0) {
					for (let i = 0; i < array.length; i++) {
						if (this.seachIndex!==5) {
							if (lx_name == array[i].cfzz) {
								flag = true;
								break;
							}
						}else{
							if (lx_name == array[i]) {
								flag = true;
								break;
							}
						}
					}
					if (!flag) {
						for (let n = 0; n <= this.lxci.length; n++) {
							if (this.seachIndex!==5) {
								if (this.relation) {
									if (lx_name == this.lxci[n].cfzz) {
										array.push({bzzz:this.lxci[n].bzzz,bzbzmc:this.lxci[n].bzzz,rmv:true});
										break;
									}
								}else{
									if (lx_name == this.lxci[n].cfzz) {
										array.push({ bzbzmc: this.lxci[n].bzbzmc, bzzz:this.lxci[n].bzzz,zzbh: this.lxci[n].zzbh,rmv:true});
										break;
									}
								}
							}else{
								if (lx_name == this.lxci[n].name) {
									array.push(this.lxci[n].name);
									break;
								}
							}
						}
					}
				} else {
					for (let j = 0; j <= this.lxci.length; j++) {
						if (this.seachIndex!==5) {
							if (this.relation) {
								if (lx_name == this.lxci[j].cfzz) {
									array.push({bzzz:this.lxci[j].bzzz,bzbzmc:this.lxci[j].bzzz,rmv:true});
									break;
								}
							}else{
								if (lx_name == this.lxci[j].cfzz) {
									array.push({ bzbzmc: this.lxci[j].bzbzmc,bzzz:this.lxci[j].bzzz, zzbh: this.lxci[j].zzbh,rmv:true});
									break;
								}
							}
						}else{
							if (lx_name == this.lxci[j].name) {
								array.push(this.lxci[j].name);
								break;
							}
						}
					}
				}
				this.lx_view=false;
				this.seachModal=false;
				switch (this.seachIndex){
					case 1:
						uni.$emit('func',{array:this.zzbxArray,type:'zzbx'})
						break;
					case 2:
						uni.$emit('func',{array:this.othersArray,type:'others'})
						break;
					case 3:
						uni.$emit('func',{array:this.sxArray,type:'sx'})
						break;
					case 4:
						uni.$emit('func',{array:this.mxArray,type:'mx'})
						break;
					case 5:
						uni.$emit('func',{array:this.yzbmArray,type:'yzbm'})
						break;
					default:
						break;
				}
				uni.navigateBack({
					delta: 1
				});
			},
			/* 症状表现搜索请求方法 */
			request(name,flag,url) {
				let _this = this;
				tokenAjax({
					url: url,
					data: {
						searchMsg: name,
						size: 100,
						page: 0,
						//isClick:flag
					},
					success: function(res) {
						console.log(res);
						if (res.data.status == 200) {
							_this.historyStatus=false;
							_this.lxci = res.data.zybzPartList;
							if (flag) {
								_this.manualSeach=true;
								_this.lx_view= false;
							}else{
								_this.lx_view= true;
								_this.manualSeach=false;
							}
						} else if(res.data.status == 301) {
							//_this.seachModal=false;
							_this.lx_view = false;
							_this.lxci= [];
							if (flag) {
								uni.showModal({
									title: '提示',
									content: '暂无查询数据',
									showCancel: false,
									confirmText: '确定',
								}); 
							}
						}else if(res.data.status == 500){
							uni.showToast({
								title: '服务器内部错误'
							});
						}
					}
				});
			},
			//舌象脉象搜索 (联想，搜索按钮)**************************************
			sxmxSeach:function(name,flag){
				var type=null;
				let _this=this;
				if (this.seachIndex==3) {
					type=1
				}else if(this.seachIndex==4){
					type=2
				}else{
					uni.showToast({
						title: '搜索类型出现错误',
						icon: 'none'
					});
					return
				}
				tokenAjax({
					url: Api.getSymptomByNameAndType,
					data: {
						name: encodeURI(name),
						type:type
					},
					success: function(res) {
						console.log(res);
						_this.lxci= [];
						if (res.statusCode == 200) {
							_this.historyStatus=false;
							var arr = res.data;
							if (arr=='') {
								_this.lx_view=false;
								return
							}
							for (var i = 0; i < arr.length; i++) {
								var obj={
									cfzz:arr[i].split('#')[0],
									bzzz:arr[i].split('#')[1],
									zzjs:arr[i].split('#')[2]
								}
								_this.lxci.push(obj);
							}
							if (flag) {
								_this.manualSeach=true;
								_this.lx_view= false;
								//_this.glzz=false;
							}else{
								_this.lx_view= true;
								//_this.glzz=false;
								_this.manualSeach=false;
							}
						} else if(res.statusCode == 301) {
							//_this.seachModal=false;
							_this.lx_view = false;
							_this.lxci= [];
							if (flag) {
								uni.showModal({
									title: '提示',
									content: '暂无查询数据',
									showCancel: false,
									confirmText: '确定',
								}); 
							}
						}else if(res.statusCode == 500){
							uni.showToast({
								title: '服务器内部错误'
							});
						}
					}
				});
			},
			//病名搜索***************************************
			yzbmSeach:function(name,flag){
				this.lxci=[];
				global.getZbxb(name).then(res =>{
					console.log(res);
					if (res.data.length!==0||res.data!=='') {
						this.historyStatus=false;
						for (var i = 0; i < res.data.length; i++) {
							var obj={
								name:res.data[i].split('#')[1],
								type:res.data[i].split('#')[2]
							}
							this.lxci.push(obj);
						}
						console.log(this.lxci);
						this.manualSeach=flag;
						this.lx_view=!flag;
					}else{
						if (flag) {
							uni.showToast({
								title: '暂无查询数据',
								icon: 'none'
							});
						}
						console.log('暂无数据');
					}
				}).catch(err =>{
					console.log(err);
				})
			}
		}
	}
</script>

<style scoped>
	page{
		height: 100%;
	}
.modal_content{
	font-size: 30upx;
	padding: 20upx;
}
.zzbx_input {
	position: relative;
	height: 2em;
	width: 70%;
	background: #f4f4f4;
	font-size: 30upx;
	border-radius: 10upx;
	padding-right: 50upx;
	padding-left: 60upx;
	line-height: 2em;
}
.removeInput{
	position: absolute;
	right: 110upx;
	top: 2upx;
	color: #CCCCCC;
	font-size: 32upx;
	z-index: 1003;
}
.suosou_icon{
	color: #ccc;
	position: absolute;
	left: 5px;
	top: 7px;
}
.searchBtn{
	color: #4780d0;
	font-size: 30upx;
	position: absolute;
	right: 96upx;
	height: 2em;
	line-height: 2em;
	padding: 0upx 20upx;
	border-radius: 10rpx;
	background: #dde1e4;
	border-top-left-radius: 0px;
	border-bottom-left-radius: 0px;
}
.zz_hint{
	padding-top: 40upx;
	color: #A5A5A5;
	font-size: 30upx;
}
.lx_view {
	width: 80%;
	top: 200rpx;
	background: #fff;
	padding: 0rpx 18rpx;
	border: 1px solid #ccc;
	z-index: 1000;
	height: 250px;
	overflow: auto;
	z-index: 2000;
}
.glzzTitle{
	font-size: 30upx;
	border-bottom: 2upx solid #CCCCCC;
}
.hotWord{
	font-size: 30upx;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.manualSeachView{
	overflow: auto;
}
.esJg_view{
	font-size: 30upx;
	white-space: nowrap;
	border-bottom: 2upx solid #CCCCCC;
	padding: 20upx 0upx 10upx 0upx;
}
/* 历史记录 */
.input_view{
	position: relative;
	margin-top: 20upx;
	text-align: 30rpx;
	}
.history_seach{
	color: #888888;
	font-size: 30upx;
}
.remove_history{
	color: #888888;
	font-size: 30upx;
	float: right;
}
.history_view{
	height: 400upx;
	overflow: auto;
	padding-top: 10upx;
}
.history_btn{
	color: #5a5a5a;
	font-size: 28upx;
	padding: 16upx;
	line-height: 1;
	background: #f4f4f4;
	border: 0upx;
	border-radius:6upx;
	margin-right: 10upx;
	margin-bottom: 10upx;
	display: inline-block;
}
.history_btn::after{
	border: 0upx;
}
.look_more{
	background: #FFFFFF;
	padding: 10upx;
	margin: 0upx;
}
</style>
