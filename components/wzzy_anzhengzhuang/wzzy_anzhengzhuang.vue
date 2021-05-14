<template>
	<view class="">
		<!-- <view class="uni_tabtit"><p style="font-size: 36upx; line-height: 2;">主诉症状</p></view> -->
		<!-- 症状表现 -->
		<!-- <view class="uni-units">
			<view class="uni_option uni-flex uni-row">
				<text>症状表现</text>
				<view class="uni-flex uni-row" style="margin-left: auto;margin-right: auto;width: 65%;position: relative;">
					<view class="uni-flex uni-row" style="height: 60upx;margin-top: 20upx; width: 100%;position: relative;">
					    <input type="text" @focus="lx_viewshow" @blur="lx_viewhide" class="zzbx_input" v-model="zzbx" placeholder="输入关键字查询症状表现" @input="keyup" />
						<button type="default" size="mini" class="uni_option_serchBtn" @tap="seachZzbx"><text class="suosou">&#xe609;</text></button>
					</view>
					<view class="lx_view" v-if="lx_view">
						<tr v-for="(item, index) in lxci" :key="index" :id="item.bzzz" @tap="idSeach" style="font-size: 30upx;">{{ item.zzjs }}</tr>
					</view>
				</view>
				<view class="uni_nav"><image src="/pagesZhiyi/static/wzzy/add.png" class="addimg" @tap="choosezyzz(1)"></image></view>
			</view>
			<view class="zzBtn_view">
				<button size="mini" :style="{'padding-right':item.rmv==false?'6rpx':'38rpx'}" class="zzBtn_view_btn" v-for="(item, index) in zzbxArr" :key="index">
					{{ item.bzzz }}
					<text v-show="item.rmv" class="remove-img" @tap="removeZzbxBtn(index)">&#xe71f;</text>
				</button>
			</view>
		</view> -->
		<view class="" v-if="!seachModal">
			<!-- 主诉症状 -->
			<view class="uni-units">
				<view class="uni_option">
					<view class="title_view">
						<text>主诉症状</text>
						<text class="jieshi" @tap="openJieshi(1)">&#xe652;</text>
					</view>
					<view class="uni_nav">
						<input class="seach_input" type="text" value="" placeholder="请输入主诉症状..." @tap="openSeachModal(1)" :disabled="true"/>
						<text class="suosou seach_icon">&#xe609;</text>
					</view>
					<image src="/static/wzzy/add.png" class="addimg" @tap="choosezyzz(1)"></image>
				</view>
				<view class="zzBtn_view">
					<button  type="default" size="mini" :style="{'padding-right':item.rmv==false?'6rpx':'38rpx'}"  class="zzBtn_view_btn" v-for="(item, index) in zzbxArr" :key="index">
						{{ item.bzzz }}
						<text class="remove-img" @tap="removeZzbxBtn(index)">&#xe71f;</text>
					</button>
				</view>
			</view>
			<!-- 其他症状 -->
			<view class="uni-units">
				<view class="uni_option">
					<view class="title_view">
						<text>其他症状</text>
						<text class="jieshi" @tap="openJieshi(2)">&#xe652;</text>
					</view>
					<view class="uni_nav">
						<input class="seach_input" type="text" value="" placeholder="请输入其他症状..." @tap="openSeachModal(2)" :disabled="true"/>
						<text class="suosou  seach_icon" style="vertical-align: middle;">&#xe609;</text>
					</view>
					<image src="/static/wzzy/add.png" class="addimg" @tap="choosezyzz(2)"></image>
				</view>
				<view class="zzBtn_view">
					<button  type="default" size="mini" :style="{'padding-right':item.rmv==false?'6rpx':'38rpx'}"  class="zzBtn_view_btn" v-for="(item, index) in othersArr" :key="index">
						{{ item.bzzz }}
						<text class="remove-img" @tap="removeOthersBtn(index)">&#xe71f;</text>
					</button>
				</view>
			</view>
			<!-- 舌象 -->
			<view class="uni-units">
				<view class="uni_option">
					<view class="title_view">
						<text>舌象</text>
					</view>
					<view class="uni_nav">
						<input class="seach_input" type="text" value="" placeholder="请输入舌象..." @tap="openSeachModal(3)" :disabled="true"/>
						<text class="suosou  seach_icon" style="vertical-align: middle;">&#xe609;</text>
					</view>
					<image src="/static/wzzy/add.png" class="addimg" @tap="choosezyzz(3)"></image>
				</view>
				<view class="zzBtn_view">
					<button  type="default" size="mini" :style="{'padding-right':item.rmv==false?'6rpx':'38rpx'}"  class="zzBtn_view_btn" v-for="(item, index) in sxArr" :key="index">
						{{ item.bzzz }}
						<text class="remove-img" @tap="removeSxBtn(index)">&#xe71f;</text>
					</button>
				</view>
			</view>
			<!-- 脉象 -->
			<view class="uni-units">
				<view class="uni_option">
					<view class="title_view">
						<text>脉象</text>
					</view>
					<view class="uni_nav">
						<input class="seach_input" type="text" value="" placeholder="请输入脉象..." @tap="openSeachModal(4)" :disabled="true"/>
						<text class="suosou  seach_icon" style="vertical-align: middle;">&#xe609;</text>
					</view>
					<image src="/static/wzzy/add.png" class="addimg" @tap="choosezyzz(4)"></image>
				</view>
				<view class="zzBtn_view">
					<button type="default" size="mini" :style="{'padding-right':item.rmv==false?'6rpx':'38rpx'}"  class="zzBtn_view_btn" v-for="(item, index) in mxArr" :key="index">
						{{ item.bzzz }}
						<text class="remove-img"  @tap="removeMxBtn(index)">&#xe71f;</text>
					</button>
				</view>
			</view>
			<!-- 已知病名 -->
			<view class="uni-units">
				<view class="uni_option">
					<view class="title_view">
						<text>已知病名</text>
					</view>
					<view class="uni_nav">
						<input class="seach_input" type="text" value="" placeholder="请输入病名..." @tap="openSeachModal(5)" :disabled="true"/>
						<text class="suosou  seach_icon" style="vertical-align: middle;">&#xe609;</text>
					</view>
					<!-- <image src="/static/wzzy/add.png" class="addimg" @tap="choosezyzz(5)"></image> -->
				</view>
				<view class="zzBtn_view">
					<button type="default" size="mini" :style="{'padding-right':item.rmv==false?'6rpx':'38rpx'}" class="zzBtn_view_btn" v-for="(item, index) in yzbmArr" :key="index">
						{{item}}
						<text class="remove-img" @tap="removeYzbmBtn(index)">&#xe71f;</text>
					</button>
				</view>
			</view>
			<!-- 说明 -->
			<view class="explain">
				<text>{{ explain }}</text>
			</view>
			<view class="submit_view">
				<button size="default" class="submitBtn" @tap="submitZybz">提 交</button>
			</view>
		</view>
		<!-- 搜索弹出框 -->
		<!-- <modal :show="seachModal" type="esSeach" @hidePopup="hidePopup">
			<view style="padding: 20upx;">
				<view class="esJg_view" v-for="(item, index) in lxci" :key="index" :id="item.bzzz" @tap="idSeach">{{item.ccfz}}<{{item.zzjs}}></view>
			</view>
			<view class="modal_ft">
				<button class="closeBtn" type="default" @tap="hidePopup">关闭</button>
			</view>
		</modal> -->
		<!-- 解释弹出层 -->
		<modal :show="jieshiModal" type="jeishi" @hidePopup="hidePopup">
			<view class="modal_head">
				<view class="zz_title">{{zz_type}}</view>
				<view class="close_modal" @tap="jieshiModal=false">关闭</view>
			</view>
			<view class="modal_content" style="color: #A5A5A5;">{{zz_con}}</view>
			<view class="modal_ft">
				<button class="closeBtn"  @tap="hidePopup">确 认</button>
			</view>
		</modal>
	</view>
</template>

<script>
import * as api from '@/common/API.js';
import { ajax } from '@/common/ajax.js';
import { tokenAjax } from '@/common/ajax.js';
import helper   from '@/common/helper.js';
import modal    from '@/components/modal.vue'
export default {
	components:{
		modal
	},
	props: {
		zzbxArray:{
			type:Array
		}, 
		othersArray:{
			type:Array
		},
		sxArray:{
			type:Array
		}, 
		mxArray:{
			type:Array
		}, 
		yzbmArray:{
			type:Array
		},
		 showOrhiden:{
			type:Boolean,
			default:false
		},
		type:{
			type:String
		}
	},
	data() {
		return {
			explain: '说明: 请点击“+”按钮，或搜索按钮选择您的症状。',
			lxci: [],
			lx_view: false,
			yzbm: '',
			zzbx: '',
			zzbxArr:[],
			othersArr:[],
			sxArr:[],
			mxArr:[],
			yzbmArr:[],
			typeInvoking:'',
			seachModal:false,
			jieshiModal:false,
			manualSeach:false,
			zz_con:'',
			zz_type:'',
			seachIndex:null,
			autofocus:true,
			historyItemCopy:[],
			more_showCopy:false,
			historyStatus:false
		};
	},
	created() {
		
	},
	watch: {
			othersArray:function(newValue,oldValue){
				this.othersArr=newValue;
			},
			zzbxArray:function(newValue, oldValue) {
				this.zzbxArr=newValue;
			},
			sxArray:function(newValue,oldValue){
				this.sxArr=newValue;
			},
			mxArray:function(newValue,oldValue){
				this.mxArr=newValue;
			},
			yzbmArray:function(newValue,oldValue){
				this.yzbmArr=newValue;
			},
	},
	computed: {//组件的计算函数
		/* lx_viewShow() {
			if (this.lxci == '') {
				return 'none';
			} else {
				return 'block';
			}
		} */
		/* historyStatus:function(){
			if (this.historyItemCopy==''||this.historyItemCopy.length==0) {
				return false
			}else{
				return true
			}
		} */
		scrollView:function(){
			var height=global.systemInfo.windowHeight;
			return height-50+'px'
		}
	},
	mounted() {//挂载到实例上去之后调用
		this.zzbxArr=this.zzbxArray;
		this.othersArr=this.othersArray;
		this.sxArr=this.sxArray;
		this.mxArr=this.mxArray;
		for (var i = 0; i < this.yzbmArray.length; i++) {
			if (this.yzbmArray[i].indexOf('类型不明')>-1) {
				this.yzbmArray.splice(i);
			}
		}
		this.yzbmArr=this.yzbmArray;
		this.typeInvoking=this.type;
		//获取缓存数据
		this.historyItemCopy=uni.getStorageSync('wzzyRecord')==''?[]:uni.getStorageSync('wzzyRecord')
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
	},
	methods: {
		// Await  将异步函数改为同步函数；await方法
		bb: async function() {
			let err, res;
			[err, res] = await uni.request({
				url: 'http://101.200.196.248:8085/zybz/findById',
				data: {
					id: 3
				}
			});
			console.log('数据：', err, res);
			console.log('111');
		},
		/* 输入框 得到焦点 失去焦点  */
		 lx_viewshow(){
				if(this.lxci.length!==0){
				this.lx_view=true;
				this.manualSeach=false;
				this.historyStatus=false;
				}
			}, 
		 lx_viewhide(event){
			 /* setTimeout(()=>{
				this.lx_view=false 
			 },100) */
		}, 
		/* 输入框自动请求事件 */
		keyup(e) {
			if (e==undefined) {
				var name=this.zzbx.replace(/(^\s*)|(\s*$)/g, "");
			}else{
				var name = e.detail.value.replace(/(^\s*)|(\s*$)/g, "");
			}
			if (name=='') {
				this.lx_view = false;
				return
			}
			this.request(name,false,api.lxApi);
		},
		//打开解释弹层
		openJieshi:function(type){
			if (type==1) {
				this.zz_type='主诉症状';
				this.zz_con='主诉症状就是本次就诊的最主要原因，包括主要症状、体征及持续时间，最多不超过两个。';
			}else{
				this.zz_type='其他症状';
				this.zz_con='其他症状就是主诉症状以外的其他症状。';
			}
			this.jieshiModal=true;
		},
		//打开搜索层
		openSeachModal:function(type){
			var array=[];
			switch (type){
				case 1:
					if (this.zzbxArr.length>1) {
						uni.showToast({
							title: '主诉症状最多选择两个,请在其他症状内添加',
							icon: 'none'
						});
						return 
					}
					this.zz_type='主诉症状';
					this.seachIndex=1;
					array=this.zzbxArr;
					break;
				case 2:
					this.seachIndex=2;
					this.zz_type='其他症状';
					array=this.othersArr;
					break;
				case 3:
					this.seachIndex=3;
					this.zz_type='舌象';
					array=this.sxArr;
					break;
				case 4:
					this.seachIndex=4;
					this.zz_type='脉象';
					array=this.mxArr;
					break;
				case 5:
					this.seachIndex=5;
					this.zz_type='已知病名';
					array=this.yzbmArr;
					break;
				default:
					break;
			}
			//主诉症状，其他症状，舌象，脉象，第二次进入搜索页面时，需携带其他三组已选好的症状，去匹配相关症状
			var allArray=[];
			if (type!==5) {
				allArray=this.zzbxArray.concat(this.sxArray.concat(this.mxArray.concat(this.othersArray)));
			}
			//this.seachModal=true;
			setTimeout(()=>{
				uni.$emit('array',{array:array,type:type});
			}, 100);
			uni.navigateTo({
				url: `/pages/result/wzzy_seach?type=${type}&array=${JSON.stringify(array)}&allArrays=${JSON.stringify(allArray)}`,
				success: res => {},
				fail: () => {},
				complete: () => {}
			});
		},
		//关闭弹层
		hidePopup:function(){
			this.seachModal=false;
			this.jieshiModal=false;
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
			var arr=uni.getStorageSync('wzzyRecord');
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
			uni.setStorageSync('wzzyRecord',arr);
			this.request(name,true,api.searchZybz);
		},
		/* 删除所选症状 */
		removeZzbxBtn: function(index) {
			if (this.zzbxArr[index].rmv==false) {
				return
			}
			this.zzbxArr.splice(index, 1);
			this.$emit('func',{array:this.zzbxArr,type:'zzbx'})
		},
		removeOthersBtn:function(index){
			this.othersArr.splice(index, 1);
			this.$emit('func',{array:this.othersArr,type:'others'})
		},
		removeSxBtn: function(index) {
			if (this.sxArr[index].rmv==false) {
				return
			}
			this.sxArr.splice(index, 1);
			this.$emit('func',{array:this.sxArr,type:'sx'})
		},
		removeMxBtn: function(index) {
			if (this.mxArr[index].rmv==false) {
				return
			}
			this.mxArr.splice(index, 1);
			this.$emit('func',{array:this.mxArr,type:'mx'})
		},
		removeYzbmBtn: function(index) {
			if (this.yzbmArr[index].rmv==false) {
				return
			}
			this.yzbmArr.splice(index, 1);
			this.$emit('func',{array:this.yzbmArr,type:'yzbm'})
		},
		/* 跳转到选择病症页面 */
		choosezyzz: function(index) {
			if (index==1||index==2||index==4) {
				if (index==1) {
					if (this.zzbxArr.length>1) {
						uni.showToast({
							title: '主诉症状最多选择两个,请在其他症状内添加',
							icon: 'none'
						});
						return 
					}
				}
				uni.navigateTo({
					url: `/pages/result/choosezyzz/choosezyzz?index=${index}&zszz=${JSON.stringify(this.zzbxArr)}`
				}); 
			}else if(index==3){
				uni.navigateTo({
					url: `/pages/result/sxmxChooseZyzz?index=${index}&zszz=${JSON.stringify(this.zzbxArr)}`
				}); 
			}
		},
		/* 将数组转换为字符串 */
		splitArray: function(arrayName,type) {
			var btnArray = '';
			var string = '';
			for (var i = 0; i < arrayName.length; i++) {
				/* if (type=='bzlz') {//bzlz为向广海传输bzzz+bzbzmc
					if (arrayName[i].bzbzmc!==undefined) {
						btnArray += (arrayName[i].bzbzmc +','+arrayName[i].bzzz+'；').toString();
					}else{
						btnArray += (arrayName[i].bzzz + '；').toString();
					}
				}else{//向es查询传输bzbzmc
					if (arrayName[i].bzbzmc!==undefined) {
						btnArray += (arrayName[i].bzbzmc + '；').toString();
					}else{
						btnArray += (arrayName[i].bzzz + '；').toString();
					}
				} 
				string = btnArray.substring(0, btnArray.length - 1);
				return string;*/
				if (arrayName[i].bzzz==undefined) {
					btnArray+='；'+arrayName[i];
				}else{
					btnArray+='；'+arrayName[i].bzzz;
				}
			}
			string=btnArray.substr(1);
			return string;
		},
		/* 按症状    提交中医标症(四种)事件 */
		submitZybz: function() {
			let gnid=4;//辨证论治功能id=4
			global.getUserCtrl(gnid).then(flag =>{
				if (!flag) {
					uni.showModal({
						title: '提示',
						content: '当前会员级别使用次数已达上限，请升级会员级别。',
						showCancel: true,
						cancelText: '取消',
						confirmText: '确定',
						success: res => {
							if (res.confirm) {//跳转小程序
							let path='/pagesD/mine/memberGrade/memberGrade';
							let type='upgrade';
								global.up(path,type).catch(err =>{
									//
								});
							}
						}
					});
					return
				}
				if (this.zzbxArray.length +this.othersArray.length+this.sxArray.length + this.mxArray.length + this.yzbmArray.length<=0) {
					uni.showModal({
						title: '提示',
						content: '请选择您要提交的症状',
						showCancel: false,
						confirmText: '确定'
					});
					return;
				}
				var bzbzmc = '',
					sx = '',
					mx = '',
					glbm = '',
					size=10,
					page=0,
					bzmc1='',
					bzmc2='',
					type='';
				//将所有症状传输至广海保存至辨证论治
				/* if (this.zzbxArray.length !== 0) {
					var zzbx = this.splitArray(this.zzbxArray,'bzlz');
				}
				if (this.sxArray.length !== 0) {
					sx = this.splitArray(this.sxArray,'bzlz');
				}
				if (this.mxArray.length !== 0) {
					mx = this.splitArray(this.mxArray,'bzlz');
				}
				if (this.othersArray.length !== 0) {
					bzbzmc = this.splitArray(this.othersArray,'bzlz');
				} */
				console.log(bzbzmc,sx,mx);
				if (this.zzbxArray.length !== 0) {
					var zzbx = this.splitArray(this.zzbxArray,'es');
				}
				if (this.sxArray.length !== 0) {
					sx = this.splitArray(this.sxArray,'es');
				}
				if (this.mxArray.length !== 0) {
					mx = this.splitArray(this.mxArray,'es');
				}
				if (this.othersArray.length !== 0) {
					bzbzmc = this.splitArray(this.othersArray,'es');
				}
				if (this.yzbmArray.length !== 0) {
					glbm= this.splitArray(this.yzbmArray,'es');
				}
				if (zzbx==undefined) {
					zzbx=''
				}
				if (zzbx!=='') {
					if(zzbx.split('；').length>1){
						bzmc1=zzbx.split('；')[0];
						bzmc2=zzbx.split('；')[1];
					}else{
						bzmc1=zzbx.split('；')[0];
					} 
				}
				if (glbm=='') {//若病名为空 返回的结果需要判断zxtype类型，B：证型名称改为病名显示(glzb+glxb);Z:不处理no processing
					uni.setStorageSync('glbmStatus',false);
				}else{
					uni.setStorageSync('glbmStatus',true);
				} 
				console.log(bzbzmc);
				global.zxcx(bzbzmc,glbm,sx,mx,size,page,bzmc1,bzmc2,type).then(data => {
					console.log(data);
					uni.hideLoading();
					if (data.data.status == 200) {
						/* 根据是否选择了主诉症状 选择返回结果集：若未选择主诉症状，结果应使用mainbz0,选择了一个主诉症状：使用mainbz1，选择了两个症状，使用mainbz2 */
						var zxcxList=[];
						if (bzmc1!==''&&bzmc2=='') {//选择了一个主诉症状，使用mainbz1
							zxcxList= data.data.data.mainbz1;
						}else if(bzmc1==''&&bzmc2==''){//未选择主诉症状，使用mainbz0
							zxcxList = data.data.data.mainbz0;
						}else if(bzmc1!==''&&bzmc2!==''){//选择了两个主诉症状，使用mainbz2
							zxcxList = data.data.data.mainbz2;
						}
						if (JSON.stringify(zxcxList)=='{}') {
							uni.showToast({
								title: '暂无匹配结果',
								icon:'none'
							});
							return
						}
						zxcxList=zxcxList.zxcxList;
						if (zxcxList.length==0) {
							uni.showToast({
								title: '暂无匹配结果',
								icon:'none'
							});
							return
						}
						for (var i = 0; i < zxcxList.length; i++) {
							zxcxList[i].heightLcbx=(zxcxList[i].highlightMap.bzjczz==undefined?'':zxcxList[i].highlightMap.bzjczz)+(zxcxList[i].highlightMap.bzlcbx==undefined?'':zxcxList[i].highlightMap.bzlcbx)+(zxcxList[i].highlightMap.sx==undefined&&zxcxList[i].sx==null?'':zxcxList[i].highlightMap.sx==undefined?zxcxList[i].sx:zxcxList[i].highlightMap.sx)+(zxcxList[i].highlightMap.mx==undefined&&zxcxList[i].mx==null?'':zxcxList[i].highlightMap.mx==undefined?zxcxList[i].mx:zxcxList[i].heightMap.mx);
							zxcxList[i].heightGlxb=zxcxList[i].highlightMap.glxb==undefined?null:zxcxList[i].highlightMap.glxb;
							zxcxList[i].heightGlzb=zxcxList[i].highlightMap.glzb==undefined?null:zxcxList[i].highlightMap.glzb;
						}
						global.againWzzyList=zxcxList;
						/* 将选则好的症状传递给helper.yxzz  */
						var yxzzArray = this.zzbxArray.concat(this.sxArray.concat(this.mxArray.concat(this.yzbmArray.concat(this.othersArray))));
						global.yxzz = yxzzArray;/* 已选症状集合 */
						//查询完 次数减1
						global.setBzlzTime();
						uni.navigateTo({
							url: '/pages/bzlzResult/bzlzResult'
						});
					} else if(data.data.status==301){
						uni.showModal({
							title: '提示',
							content: '暂未查询出您要查询的病症',
							showCancel: false,
							cancelText: '',
							confirmText: '确定'
						});
					}else if(data.data.status==500){
						uni.showToast({
							title: '服务器内部错误'
						})
					}else if(data.data.status==null){
						uni.showModal({
							title: '提示',
							content: '暂未查询出您要查询的病症',
							showCancel: false,
							cancelText: '',
							confirmText: '确定'
						});
					}
				})
			})
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
		}
	}
};
</script>

<style scoped>
page {
	height: auto;
	background: #CCCCCC;
}
.uni_option {
	position: relative;
	line-height: 100upx;
	padding-right: 30upx;
	padding-left: 30upx;
}
.title_view{
	width:25%;
	display: inline-flex;
}
.addimg {
	top: 16upx;
	right: 30upx;
	width: 60upx;
	height: 60upx;
	position: absolute;
	vertical-align: middle;
}
.uni_tabtit {
	font-size: 36upx;
	font-weight: 700;
	line-height: 2.5;
	padding-left: 30upx;
	background: #fff;
	border-bottom: 20upx solid #eaeaea;
}
.zzbx_input {
	position: relative;
	height: 2em;
	width: 65%;
	background: #f4f4f4;
	font-size: 30upx;
	border-radius: 10upx;
	padding-right: 90upx;
	padding-left: 20upx;
	line-height: 2em;
}
.uni_nav {
	width: 60%;
	margin-left: 20upx;
	position: relative;
	display: inline-flex;
}
.seach_input{
	width: 100%;
	border-radius: 12px;
	background: #f4f4f4;
	display: inline-flex;
	font-size: 32rpx;
	padding: 10rpx;
	border-radius: 10rpx;
	padding-left: 60rpx;
}
.seach_icon{
	top: 16upx;
	left: 12upx;
	color: #CCCCCC;
	position: absolute;
	vertical-align: middle;
}
.explain {
	color: #a5a5a5;
	padding-left: 30upx;
	font-size: 28upx;
	line-height: 100upx;
}
.submit_view{
	width: 100%;
}
.color-tag {
	width: 50upx;
	height: 50upx;
}
.submitBtn {
	width: 60%;
	line-height: 2;
	border-radius: 40upx;
	margin-top: 50upx;
	color: #ffffff;
	background: #1296db;
}
.uni_option_serchBtn {
	height: 100%;
	padding: 5px;
	padding-top: 3px;
	border-left: 1px solid #ccc;
	position: absolute;
	right: 3px;
	top: 1px;
	border-radius: 0;
}
uni-button:after {
	width: 0;
	height: 0;
}
button::after {
	border: none;
}
.uni-units {
	background: #ffffff;
	border-bottom: 2upx solid #cccccc;
}
.zzBtn_view {
	padding: 0upx 30upx;
}
/* #ifdef MP-WEIXIN */
.lx_view {
	width: 80%;
	top: 200rpx;
	background: #fff;
	padding: 0rpx 20rpx;
	border: 1px solid #ccc;
	z-index: 1000;
	height: 250px;
	overflow: auto;
	z-index: 2000;
}
.hotWord{
	font-size: 30upx;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.manualSeachView{
	padding: 10px;
	padding-top: 0px;
	overflow: auto;
	margin-top: 10upx;
}
.zz_hint{
	padding-top: 40upx;
	color: #A5A5A5;
	font-size: 30upx;
}
/* #endif */


/* #ifdef H5*/
.lx_view {
	padding: 0upx 20upx;
	position: absolute;
	top: 78upx;
	background: #fff;
	width: 90%;
	border: 1px solid #ccc;
	z-index: 1000;
	height: 320%;
	overflow: auto;
}
/* #endif */
.zzBtn_view_btn {
	color: #056496;
	font-size: 34rpx;
	background: #FFFFFF;
	border: 1px solid #056496;
	padding: 0upx 6upx;
	margin-left: 10upx;
	margin-bottom: 6upx;
	line-height: 1.5;
	z-index: 990;
	position: relative;
	padding-right: 38rpx;
}
.modal_head{
	padding: 20upx;
}
.close_modal{
	color: #A5A5A5;
	position: absolute;
	right: 20upx;
	top: 20upx;
	font-size: 16px;
}
.modal_content{
	font-size: 30upx;
	padding: 20upx;
}
.zz_title{
	font-weight: 700;
	font-size: 32upx;
	text-align: center;
}
.esJg_view{
	font-size: 30upx;
	white-space: nowrap;
	border-bottom: 2upx solid #CCCCCC;
	padding: 20upx 0upx 10upx 0upx;
}
.modal_ft{
	text-align: center;
}
.closeBtn{
	width: 60%;
	color: #fff;
	background: #1296db;
	border-radius: 40upx;
	margin-bottom: 15px;
}
.removeInput{
	position: absolute;
	right: 180upx;
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
