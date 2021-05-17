<template>
	<view class="">
		<view class="" v-if="!seachModal">
			<!-- 主诉症状 -->
			<view class="uni-units" v-show="!subHealth">
				<view class="uni_option">
					<view class="title_view">
						<text>主诉症状</text>
						<text class="jieshi" style="padding: 0upx 20upx 0upx 10upx;" @tap="openJieshi(1)">&#xe652;</text>
					</view>
					<view class="uni_nav">
						<text class="addGroup" @tap="choosezyzz(1)">&#xe619;</text>
						<text class="suosou seach_icon" style="margin-left: 40upx;" @tap="openSeachModal(1)">&#xe609;</text>
					</view>
				</view>
				<view class="zzBtn_view" v-show="zzbxConShow">
					<view class="hint-text" :style="{display:zzbxArray.length==0?'block':'none'}">
						<text>请搜索或选择您的主要症状</text>
					</view>
					<view class="uni-flex uni-row" v-for="(item, index) in zzbxArr" :key="index">
						<view class="bzzz_tit"><text>{{index+1}}、</text><text>{{item.bzzz}}</text></view>
						<view class="remove-bzzz" @tap="removeZzbxBtn(index)"><text class="removeBtn" style="font-size: 40upx;color: #31b8ff;">&#xe61c;</text></view>
					</view>
				</view>
			</view>
			<!-- 其他症状 -->
			<view class="uni-units">
				<view class="uni_option">
					<view class="title_view">
						<text v-if="subHealth">日常症状</text>
						<text v-else>其他症状</text>
						<text class="jieshi" style="padding: 0upx 20upx 0upx 10upx;" @tap="openJieshi(2)">&#xe652;</text>
					</view>
					<view class="uni_nav">
						<text class="addGroup" @tap="choosezyzz(2)">&#xe619;</text>
						<text class="suosou seach_icon" style="margin-left: 40upx;" @tap="openSeachModal(2)">&#xe609;</text>
					</view>
				</view>
				<view class="zzBtn_view" v-show="otherConShow">
					<!-- <button  type="default" size="mini" :style="{'padding-right':item.rmv==false?'6rpx':'38rpx'}"  class="zzBtn_view_btn" v-for="(item, index) in othersArr" :key="index">
						{{ item.bzzz }}
						<text class="remove-img" v-show="item.rmv" @tap="removeOthersBtn(index)">&#xe71f;</text>
					</button> -->
					<view class="hint-text" :style="{display:othersArray.length==0?'block':'none'}">
						<text v-if="subHealth">请搜索或选择您常出现的症状</text>
						<text v-else>请搜索或选择其他症状</text>
					</view>
					<view class="uni-flex uni-row" v-for="(item, index) in othersArr" :key="index">
						<view class="bzzz_tit"><text>{{index+1}}、</text><text>{{item.bzzz}}</text></view>
						<view class="remove-bzzz" @tap="removeOthersBtn(index)"><text class="remove" style="font-size: 40upx;color: #31b8ff;">&#xe61c;</text></view>
					</view>
				</view>
			</view>
			<!-- 已知病名 -->
			<view class="uni-units">
				<view class="uni_option">
					<view class="title_view">
						<text>已知病</text>
						<text class="jieshi" style="padding: 0upx 20upx 0upx 10upx;" @tap="openJieshi(5)">&#xe652;</text>
					</view>
					<view class="uni_nav" style="text-align: left;">
						<text class="suosou seach_icon" style="margin-left: 80upx;" @tap="openSeachModal(5)">&#xe609;</text>
						<!-- <text class="xiangqing" @tap="openBzzz(5)" v-show="!yzbmShow&&yzbmArr.length!==0">&#xe68d;</text>
						<text class="packUp" style="float: right;" @tap="yzbmShow=false" v-show="yzbmShow">&#xe63a;</text> -->
					</view>
				</view>
				<view class="zzBtn_view" v-show="yzbConShow">
					<view class="hint-text" :style="{display:yzbmArray.length==0?'block':'none'}">
						<text>请搜索或选择您常出现的已知病</text>
					</view>
					<view class="uni-flex uni-row" v-for="(item, index) in yzbmArr" :key="index">
						<view class="bzzz_tit"><text>{{index+1}}、</text><text>{{item}}</text></view>
						<view class="remove-bzzz" @tap="removeYzbmBtn(index)"><text class="remove" style="font-size: 40upx;color: #31b8ff;">&#xe61c;</text></view>
					</view>
				</view>
			</view>
			<!-- 舌象 -->
			<view class="uni-units">
				<view class="uni_option">
					<view class="title_view">
						<text>舌象</text>
						<text class="jieshi" style="padding: 0upx 20upx 0upx 10upx;" @tap="openJieshi(3)">&#xe652;</text>
					</view>
					<view class="uni_nav">
						<text class="addGroup" @tap="choosezyzz(3)">&#xe619;</text>
						<text class="suosou seach_icon" style="margin-left: 40upx;" @tap="openSeachModal(3)">&#xe609;</text>
					</view>
				</view>
				<view class="zzBtn_view" v-show="sxConShow">
					<!-- <button  type="default" size="mini" :style="{'padding-right':item.rmv==false?'6rpx':'38rpx'}"  class="zzBtn_view_btn" v-for="(item, index) in sxArr" :key="index">
						{{ item.bzzz }}
						<text class="remove-img"  @tap="removeSxBtn(index)">&#xe71f;</text>
					</button> -->
					<view class="hint-text" :style="{display:sxArray.length==0?'block':'none'}">
						<text>请搜索或选择您常出现的舌体形态</text>
					</view>
					<view class="uni-flex uni-row" v-for="(item, index) in sxArr" :key="index">
						<view class="bzzz_tit"><text>{{index+1}}、</text><text>{{item.bzzz}}</text></view>
						<view class="remove-bzzz" @tap="removeSxBtn(index)"><text class="remove" style="font-size: 40upx;color: #31b8ff;">&#xe61c;</text></view>
					</view>
				</view>
			</view>
			<!-- 脉象 -->
			<view class="uni-units">
				<view class="uni_option">
					<view class="title_view">
						<text>脉象</text>
						<text class="jieshi" style="padding: 0upx 20upx 0upx 10upx;" @tap="openJieshi(4)">&#xe652;</text>
					</view>
					<view class="uni_nav">
						<text class="addGroup" @tap="choosezyzz(4)">&#xe619;</text>
						<text class="suosou seach_icon" style="margin-left: 40upx;" @tap="openSeachModal(4)">&#xe609;</text>
						<!-- <image src="/pagesZhiyi/static/wzzy/add.png" class="addimg" @tap="choosezyzz(4)"></image> -->
						<!-- <text class="xiangqing" @tap="openBzzz(4)" v-show="!mxShow&&mxArr.length!==0">&#xe68d;</text>
						<text class="packUp" style="float: right;" @tap="mxShow=false" v-show="mxShow">&#xe63a;</text> -->
					</view>
				</view>
				<view class="zzBtn_view" v-show="mxConShow">
					<!-- <button type="default" size="mini" :style="{'padding-right':item.rmv==false?'6rpx':'38rpx'}"  class="zzBtn_view_btn" v-for="(item, index) in mxArr" :key="index">
						{{ item.bzzz }}
						<text class="remove-img" @tap="removeMxBtn(index)">&#xe71f;</text>
					</button> -->
					<view class="hint-text" :style="{display:mxArray.length==0?'block':'none'}">
						<text>请搜索或选择您常出现的脉搏形象与动态</text>
					</view>
					<view class="uni-flex uni-row" v-for="(item, index) in mxArr" :key="index">
						<view class="bzzz_tit"><text>{{index+1}}、</text><text>{{item.bzzz}}</text></view>
						<view class="remove-bzzz" @tap="removeMxBtn(index)"><text class="remove" style="font-size: 40upx;color: #31b8ff;">&#xe61c;</text></view>
					</view>
				</view>
			</view>
			<view class="submit_view">
				<button size="default" class="submitBtn" hover-class="hoverBtn" @tap="submitZybz">提 交</button>
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
				<button class="closeBtn"  @tap="hidePopup">我知道了</button>
			</view>
		</modal>
		<!-- 搜索层 -->
		<modal :show="seachModal" type="esSeach" v-if="seachModal" @tap="lx_view=false,manualSeach=false,historyStatus=true">
			<!-- <view class="modal_head">
				<view class="zz_title">{{zz_type}}</view>
				<view class="close_modal" @tap="seachModal=false">关闭</view>
			</view> -->
			<view class="modal_content">
				<view class="uni-flex uni-row" style="height: 60upx;margin-top: 20upx;position: relative;">
				    <input type="text" confirm-type="search"  @focus="lx_viewshow" @blur="lx_viewhide" :focus="autofocus" class="zzbx_input" @confirm="seachZzbx" v-model="zzbx" placeholder="输入关键词查询症状..." @input="keyup" />
					<text class="rmv-btn removeInput" v-show="zzbx!==''?true:false" @tap="zzbx='',lxci=[],lx_view=false,autofocus=true,historyStatus=true,manualSeach=false">&#xe71f;</text>
					<!-- <text class="suosou suosou_icon">&#xe609;</text> -->
					<view class="searchBtn"><text class="suosou" @tap="seachZzbx" style="font-size: 36upx32upx;">&#xe609;</text></view>
					<text style="font-size: 36upx30upx;position: absolute;right: 6upx;" @tap="seachModal=false">取消</text>
				</view>
				<view class="zz_hint" v-show="!lx_view&&(!manualSeach)">
					主诉症状最多选择两个，若要修改，需要先删除已选择好的症状再进行搜索。
				</view>
				<!-- 搜索历史 -->
				<view class="input_view" v-show="historyStatus">
					<view class="">
						<text class="history_seach">搜索记录</text>
						<text class="remove_history remove" @tap="removeHistory">&#xe678;</text>
					</view>
					<view class="history_view">
						<view class="history_btn" v-for="(item,index) in historyItemCopy" :key="index" @tap="btnSeach(item.name)" :style="[{display:item.display}]">
							<text>{{item.name}}</text>
						</view>
						<view class="history_btn look_more" :style="[{display:more_showCopy==false?'none':'inline-block'}]" @tap="showAllHistory">更多<text class="more_icon">&#xe618;</text></view>
					</view>
				</view>
				<!-- 提示词 -->
				<view class="lx_view" v-show="lx_view">
					<tr v-for="(item, index) in lxci" :key="index" :id="item.bzzz" class="hotWord" @tap="idSeach">{{ item.ccfz+'；'+'；'+item.zzjs+'；'+item.bzzz }}</tr>
				</view>
				<!-- 点击搜索按钮后显示的提示词 -->
				<view class="manualSeachView" v-show="manualSeach" :style="{'height':scrollView}">
					<view class="esJg_view" v-for="(item, index) in lxci" :key="index" :id="item.bzzz" @tap="idSeach">{{item.ccfz+'<'+item.zzjs+'>'}}</view>
				</view>
			</view>
			<!-- <view class="modal_ft" style="margin-top:50px;width: 100%;">
				<button class="closeBtn"  @tap="hidePopup">确 认</button>
			</view> -->
		</modal>
	</view>
</template>

<script>
import * as Api from '@/common/API.js';
import { ajax } from '@/common/ajax.js';
import { tokenAjax } from '@/common/ajax.js';
import modal    from '@/components/modal.vue';
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
			historyStatus:false,
			zzbxConShow:true,
			otherConShow:false,
			sxConShow:false,
			mxConShow:false,
			yzbConShow:false,
			subHealth:false
		};
	},
	created() {
		
	},
	watch: {
			zzbxArray:function(newValue, oldValue) {
				this.zzbxArr=newValue;
				console.log('主诉症状，数据更新');
				if (this.zzbxArr.length==0) {
					this.zzbxConShow=false;
				}else{
					this.zzbxConShow=true;
				}
				this.otherConShow=true;
			},
			othersArray:function(newValue,oldValue){
				this.othersArr=newValue;
				console.log('其他症状，数据更新');
				if (this.othersArr.length==0) {
					this.otherConShow=false;
				}else{
					this.otherConShow=true;
				}
				//this.yzbConShow=true;
			},
			yzbmArray:function(newValue,oldValue){
				this.yzbmArr=newValue;
				console.log('已知病，数据更新');
				if (this.yzbmArr.length==0) {
					this.yzbConShow=false;
				}else{
					this.yzbConShow=true;
				}
				//this.sxConShow=true;
			},
			sxArray:function(newValue,oldValue){
				this.sxArr=newValue;
				console.log('舌象，数据更新');
				if (this.sxArr.length==0) {
					this.sxConShow=false;
				}else{
					this.sxConShow=true;
				}
				//this.mxConShow=true;
			},
			mxArray:function(newValue,oldValue){
				this.mxArr=newValue;
				console.log('脉象，数据更新');
				if (this.mxArr.length==0) {
					this.mxConShow=false;
				}else{
					this.mxConShow=true;
				}
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
		//亚健康进来时，隐藏主诉症状
		if (this.$parent.origin=="亚健康") {
			this.subHealth=true;
			this.otherConShow=true;
		}
		//快好 重新辩证进入时，如果有携带值，默认展开
		if (this.zzbxArray.length!==0) {
			this.zzbxShow=false
		}
		if (this.othersArray.length!==0) {
			this.otherConShow=true;
		}
		if (this.sxArray.length!==0) {
			this.sxConShow=true;
		}
		if (this.mxArray.length!==0) {
			this.mxConShow=true;
		}
		if (this.yzbmArray.length!==0) {
			this.yzbConShow=true;
		}
		//
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
			this.request(name,false,Api.lxApi);
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
					if (this.zzbxArr.length>2) {
						uni.showToast({
							title: '主诉症状最多选择三个,请在其他症状内添加',
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
				url: `/pages/result/wzzy_seach?type=${type}&array=${JSON.stringify(array)}&origin=${this.$parent.origin}&allArrays=${JSON.stringify(allArray)}`
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
			this.request(name,true,Api.searchZybz);
		},
		/* 删除所选症状 */
		removeZzbxBtn: function(index) {
			/* if (this.zzbxArr[index].rmv==false) {
				return
			} */
			this.zzbxArr.splice(index, 1);
			if (this.zzbxArr.length==0) {
				this.zzbxConShow=false;
			}
			this.$emit('func',{array:this.zzbxArr,type:'zzbx'})
		},
		removeOthersBtn:function(index){
			this.othersArr.splice(index, 1);
			if (this.othersArr.length==0) {
				this.otherConShow=false;
			}
			this.$emit('func',{array:this.othersArr,type:'others'})
		},
		removeSxBtn: function(index) {
			/* if (this.sxArr[index].rmv==false) {
				return
			} */
			this.sxArr.splice(index, 1);
			if (this.sxArr.length==0) {
				this.sxConShow=false;
			}
			this.$emit('func',{array:this.sxArr,type:'sx'})
		},
		removeMxBtn: function(index) {
			/* if (this.mxArr[index].rmv==false) {
				return
			} */
			this.mxArr.splice(index, 1);
			if (this.mxArr.length==0) {
				this.mxConShow=false;
			}
			this.$emit('func',{array:this.mxArr,type:'mx'})
		},
		removeYzbmBtn: function(index) {
			if (this.yzbmArr[index].rmv==false) {
				return
			}
			this.yzbmArr.splice(index, 1);
			if (this.yzbmArr.length==0) {
				this.yzbConShow=false;
			}
			this.$emit('func',{array:this.yzbmArr,type:'yzbm'})
		},
		/* 跳转到选择病症页面 */
		choosezyzz: function(index) {
			if (index==1||index==2||index==5||index==4) {
				if (index==1) {
					if (this.zzbxArr.length>2) {
						uni.showToast({
							title: '主诉症状最多选择三个,请在其他症状内添加',
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
					url: `/pages/result/sxmxChooseZyzz?index=${index}&zszz=${JSON.stringify(this.sxArr)}`
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
				} */
				if (arrayName[i].bzzz==undefined) {
						btnArray+='；'+arrayName[i];
					}else{
						btnArray+='；'+arrayName[i].bzzz;
					}
				}
			string=btnArray.substr(1)
			return string
		},
		bm:function(){
			var string='';
			for(var i=0; i<this.yzbmArray.length; i++){
				string+=';'+this.yzbmArray[i];
			}
			string=string.substr(1);
			return string
		},
		/* 按症状    提交中医标症(四种)事件 */
		submitZybz:async function() {
			if (this.zzbxArray.length +this.othersArray.length+this.sxArray.length + this.mxArray.length + this.yzbmArray.length<=0) {
				uni.showModal({
					title: '提示',
					content: '请选择您要提交的症状',
					showCancel: false,
					confirmText: '确定'
				});
				return;
			}
			//先查询 使用次数是否有剩余
			var flag=await global.getUserCtrl(4);//同步调用次数查询接口，async配合 await使用
			if (!flag) {
				uni.showModal({
					title: '提示',
					content: '当前会员级别的问症知医 次数已用尽，请升级会员级别继续使用此功能',
					showCancel: true,
					cancelText: '取消',
					confirmText: '升级',
					success: res => {
						if (res.confirm) {
							console.log('用户点击确定');
							uni.navigateTo({
								url: '/pagesD/mine/memberGrade/memberGrade',
							});
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					},
				});
				return
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
				glbm= this.bm();
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
			if (glbm=='') {//若病名为空 返回的结果需要判断zxtype类型，B：证型名称改为病名显示(glzb);Z:不处理no processing
				uni.setStorageSync('glbmStatus',false);
			}else{
				uni.setStorageSync('glbmStatus',true);
			}
			//typeInvoking值为kh时该组件为快好模块调用，值为wzzy时为问症知医调用
				global.zxcx(bzbzmc,glbm,sx,mx,size,page,bzmc1,bzmc2,type).then(data => {
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
						url: `/pages/bzlzResult/bzlzResult`
					});
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
}
.uni_option {
	position: relative;
	line-height: 100upx;
	padding-right: 20upx;
	padding-left: 20upx;
}
.title_view{
	width:40%;
	display: inline-flex;
}
.addimg {
	top: 16upx;
	right: 30upx;
	width: 66upx;
	height: 66upx;
	margin-left: 70upx;
	/* position: absolute; */
	vertical-align: middle;
}
.uni_tabtit {
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
	border-radius: 10upx;
	padding-right: 90upx;
	padding-left: 20upx;
	line-height: 2em;
}
.uni_nav {
	width: 30%;
	display: inline-block;
	/* position: relative;
	display: inline-flex; */
}
.seach_input{
	width: 100%;
	border-radius: 12px;
	background: #f4f4f4;
	display: inline-flex;
	padding: 10rpx;
	border-radius: 10rpx;
	padding-left: 60rpx;
}
.seach_icon{
	font-size: 44upx;
	/* position: absolute;
	vertical-align: middle; */
}
.submit_view{
	width: 100%;
	margin-top: 5%;
	margin-bottom: 10%;
}
.color-tag {
	width: 50upx;
	height: 50upx;
}
.submitBtn {
	width: 60%;
	line-height: 2;
	color: #1296db;
	font-size: 38upx;
	background: #FFFFFF;
	border-radius: 40upx;
	border: 2upx solid #1296DB;
}
.hoverBtn{
	background: #F4F4F4;
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
	margin: 0upx 4upx 6upx 4upx;
	background: #ffffff;
	border-bottom: 2upx solid #e4e4e4;
}
.zzBtn_view {
	min-height: 60upx;
	overflow: auto;
	margin: 10upx 20upx;
	margin-bottom: 0upx;
	background: #FFFFFF;
	transition-duration:0.5s;
	-webkit-transition-duration: 0.5s;
}
.hint-text{
	color: #868686;
	display: block;
	font-size: 32upx;
	padding: 0upx 10upx;
}
.bzzz_tit{
	width: 94%;
	font-size: 36upx;
	overflow: auto;
	line-height: 2.1;
	white-space: nowrap;
}
.remove-bzzz{
	width: 6%;
	color: #666666;
	text-align: center;
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
	font-size: 36upx;
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
	font-size: 36upx;
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
	font-size: 36upx;
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
	font-size: 36upx;
}
.modal_content{
	font-size: 36upx;
	padding: 20upx;
	height: 40%;
	overflow: auto;
}
.zz_title{
	font-weight: 700;
	font-size: 36upx;
	text-align: center;
}
.esJg_view{
	font-size: 36upx;
	white-space: nowrap;
	border-bottom: 2upx solid #CCCCCC;
	padding: 20upx 0upx 10upx 0upx;
}
.modal_ft{
	text-align: center;
	font-size: 36upx;
}
.closeBtn{
	width: 40%;
	color: #fff;
	line-height: 2;
	font-size: 36upx;
	background: #1296db;
	border-radius: 40upx;
	margin-bottom: 15px;
}
.removeInput{
	position: absolute;
	right: 180upx;
	top: 2upx;
	color: #CCCCCC;
	font-size: 36upx;
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
	font-size: 36upx;
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
	font-size: 36upx;
}
.remove_history{
	color: #888888;
	font-size: 36upx;
	float: right;
}
.history_view{
	height: 400upx;
	overflow: auto;
	padding-top: 10upx;
}
.history_btn{
	color: #5a5a5a;
	font-size: 36upx;
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
