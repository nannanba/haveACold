<template>
	<view style="height: 100%;" @click="closeLxView">
		<view class="modal_content" style="height: calc(100% - 40upx);">
			<view class="uni-flex uni-row" style="height: 80upx;position: relative;background: #FFFFFF;">
			    <input type="text" confirm-type="search"  @click.stop="lx_viewshow"  :focus="true" class="zzbx_input" @confirm="seachZzbx" v-model="zzbx" :placeholder="placeholder" @input="keyup" />
				<text class="rmv-btn removeInput" v-show="zzbx!==''?true:false" @tap="zzbx='',lxci=[],lx_view=false,autofocus=true,historyStatus=true,manualSeach=false">&#xe71f;</text>
				<text class="suosou suosou_icon">&#xe609;</text> 
				<!-- <view class="searchBtn"><text class="suosou" @tap="seachZzbx" style="font-size: 36upx;">&#xe609;</text></view> -->
				<text style="font-size: 36upx;position: absolute;right: 6upx;" @tap="seachZzbx">搜索</text>
			</view>
			<!-- 病名提示词 -->
			<view class="lx_view" v-if="type==5" v-show="lx_view">
				<tr v-for="(item, index) in lxci" :key="index" :id="item.name" class="hotWord" @click.stop="idSeach">{{item.name+'('+item.type+')'}}</tr>
			</view>
			<!-- 症状提示词 -->
			<view class="lx_view" v-else v-show="lx_view">
				<!-- <view class="glzzTitle" v-show="relation">相关症状：</view> -->
				<tr v-for="(item, index) in lxci" :key="index" :id="item.bzzz" class="hotWord" @click.stop="idSeach">{{item.cfzz+'；'+item.bzzz+'；'+(item.zzjs==null||item.zzjs=='null'?'':item.zzjs)}}</tr>
			</view>
			<!-- 病名点击搜索按钮后显示的提示词 -->
			<view class="manualSeachView" v-if="type==5" v-show="manualSeach" :style="{'height':scrollView}">
				<view class="esJg_view" v-for="(item, index) in lxci" :key="index" :id="item.name" @click.stop="idSeach">{{item.name+'('+item.type+')'}}</view>
			</view>
			<!-- 点击搜索按钮后显示的提示词 -->
			<view class="manualSeachView" v-else v-show="manualSeach" :style="{'height':scrollView}">
				<view class="esJg_view" v-for="(item, index) in lxci" :key="index" :id="item.bzzz" @click.stop="idSeach">{{item.cfzz+(item.zzjs==null||item.zzjs=='null'||item.zzjs==''?'':'<'+item.zzjs+'>')}}</view>
			</view>
			<view class="zz_hint" v-show="!lx_view&&(!manualSeach)&&(type==1)">
				主诉症状最多选择两个，若要修改，需要先删除已选择好的症状再进行搜索。
			</view>
			<!-- 搜索历史 -->
			<view class="input_view" v-show="historyAndFamiliar">
				<view class="">
					<text class="history_seach">历史搜索</text>
					<text class="remove_history remove" @tap="removeHistory">&#xe678;</text>
				</view>
				<view class="history_view">
					<view class="history_btn" v-for="(item,index) in historyItemCopy" :key="index" @tap="btnSeach(item.name)" :style="[{display:item.name==''?'none':item.display}]">
						<text>{{item.name}}</text>
					</view>
					<view class="history_btn look_more" :style="[{display:more_showCopy==false?'none':'inline-block'}]" @tap="showAllHistory">更多<text class="more_icon">&#xe618;</text></view>
				</view>
			</view>
			<!-- 常见症状 -->
			<view class="input_view" v-show="historyAndFamiliar">
				<view class="">
					<text class="history_seach">常见症状</text>
					<text class="hot_icon">&#xe68e;</text>
				</view>
				<view class="history_view">
					<view class="history_btn" v-for="(item,index) in familiar" :key="index" @tap="btnSeach(item.name)" :style="[{display:item.name==''?'none':item.display}]">
						<text>{{item.name}}</text>
					</view>
				</view>
			</view>
			<!-- 相关症状-->
			<view v-show="hotWordModal" :style="{height:(type==1&&!lx_view&&(!manualSeach)?' calc(100% - 100px)':' calc(100% - 40px)')}" style="overflow: hidden;">
				<view style="padding:4upx 20upx;border-bottom:1upx solid #CCCCCC;height: 80upx;line-height: 80upx;">
					<text style="font-weight: 500;font-size: 36upx;">| 请选择符合您的症状</text>
				</view>
				<!-- 症状选择 -->
				<view style="padding-top: 20upx;height: calc(100% - 110upx);overflow: auto;" v-show="bzzzShow">
					<view class="" style="height: 80%;overflow: auto;text-align: center;">
						<view class="xgzzBtn" v-for="(item,index) in xgzzArr" :key="index" hover-class="btnHover" :class="item.checked?'cfzzChecked':'xgzzBtn'" @tap="openCon(item)">
							<text style="margin-right: 6upx;">{{item.sjzz}}</text>
							<!-- <text class="jieshi question" @tap="zzjsModal=true">&#xe652;</text> -->
						</view>
					</view>
					<view style="margin-top: 40upx;"><button class="sbmitCheckedBzzz" @tap="submitSjzz">确 定</button></view>
				</view>
			</view>
			<!-- 症状属性弹层 -->
			<modal :show="bzzzConShow" type="zzjsModal" @hidePopup="bzzzConShow=false">
				<view class="modal-heard"><text style="font-weight: 700;font-size: 36upx;">{{selectedBzzz.sjzz}}</text></view>
				<view class="modal-content">
					<view style="border-bottom: 2upx solid #CCCCCC;height:50upx;max-height: 100upx;overflow: auto;padding-top: 10upx;padding-bottom: 10upx;text-align: center;">
						<text>{{selectedBzzz.bzjs1[0]}}</text>
					</view>
					<view style="padding: 10upx 0upx;">请选择细分症状或属性：</view>
					<view style="height: calc(80% - 104upx);overflow: auto;">
						<button class="xgzzBtn" hover-class="btnHover" :class="item.checked?'cfzzChecked':'xgzzBtn'" v-for="(item,index) in selectedBzzz.cfzz" :key="index" @tap="selectCfzz(item)">{{item.value}}</button>
					</view>
				</view>
				<view class="modal-foot uni-flex uni-row">
					<view style="width: 50%;"><button class="close-modal" @tap="bzzzConShow=false">取 消</button></view>
					<view style="width: 50%;"><button class="submit-bzzz" @tap="submitCfzz">确 定</button></view>
				</view>
			</modal>
			<!-- 数据主症解释弹层 -->
			<modal :show="sjzzShow" type="sjzzShow" @hidePopup="sjzzShow=false">
				<view class="modal-heard"><text style="font-weight: 700;font-size: 36upx;">{{selectedBzzz.sjzz}}</text></view>
				<view class="modal-content" style="height: 130upx;line-height: 130upx;margin-bottom:80upx;text-align: center;">
					<text>{{selectedBzzz.bzjs1[0]}}</text>
				</view>
				<view class="modal-foot uni-flex uni-row">
					<view style="width: 50%;"><button class="close-modal" @tap="sjzzShow=false">取 消</button></view>
					<view style="width: 50%;"><button class="submit-bzzz" @tap="seleckedSjzz">确 定</button></view>
				</view>
			</modal>
			<!-- 拆分症状解释弹层 -->
			<modal :show="zzjsShow" type="sjzzShow" mask="zzjs" @hidePopup="zzjsShow=false">
				<view class="modal-heard"><text style="font-weight: 700;font-size: 36upx;">{{cfzz_zzjs.value}}</text></view>
				<view class="modal-content" style="height: 130upx;line-height: 130upx;margin-bottom:80upx;text-align: center;">
					<text>{{zzjsCon}}</text>
				</view>
				<view class="modal-foot uni-flex uni-row">
					<view style="width: 50%;"><button class="close-modal" @tap="zzjsShow=false">取 消</button></view>
					<view style="width: 50%;"><button class="submit-bzzz" @tap="seleckedZzjs">确 定</button></view>
				</view>
			</modal>
		</view>
	</view>
</template>

<script>
	import * as Api from '@/common/API.js';
	import { tokenAjax } from '@/common/ajax.js';
	import helper   from '@/common/helper.js';
	import modal    from '@/components/modal.vue';
	export default {
		components:{
			modal
		},
		data() {
			return {
				zzbx:'',
				lxci: [],
				type:'',
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
				relation:false,
				glzz:false,
				showAll:true,
				glzzArray:[],
				hotWordModal:false,
				zzjsModal:false,
				bzzzShow:true,
				bzzzConShow:false,
				selectedBzzz:'',
				xgzzArr:[],
				historyAndFamiliar:true,//历史记录和常见症状
				sjzzCheckedNum:0,
				checkedArray:[],
				sjzzShow:false,
				zzjsShow:false,
				cfzz_zzjs:{},
				zzjsCon:'',
				familiar:[
					{name:'头痛'},
					{name:'口腔溃疡'},
					{name:'腰酸背痛'},
					{name:'心慌气短'},
					{name:'手足麻木'},
					{name:'尿频尿急'},
					{name:'视力模糊'},
					{name:'肩膀疼痛'},
					{name:'头晕眼花'},
					{name:'胃痛'},
					{name:'乏力'},
					{name:'呕吐'}
					]
			}
		},
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		onLoad(e) {
			console.log(e);
			if (e.origin=='亚健康') {
				uni.setNavigationBarTitle({
					title:e.origin
				})
			}
			this.type=parseInt(e.type) ;
			var array=JSON.parse(e.array);
			var allArray=JSON.parse(e.allArrays);
			this.checkedArray=allArray;
			this.seachIndex=this.type
			switch (this.type){
				case 1:
					this.zzbxArray=array;
					this.historyItemCopy=uni.getStorageSync('wzzyRecord')==''?[]:uni.getStorageSync('wzzyRecord');
					break;
				case 2:
					this.othersArray=array;
					this.historyItemCopy=uni.getStorageSync('wzzyRecord')==''?[]:uni.getStorageSync('wzzyRecord');
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
			console.log(this.historyItemCopy);
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
			if (allArray.length>0&&(this.type!==5)) {
				this.glzzArray=[];
				var allArrayString='';
				for (var i = 0; i < allArray.length; i++) {
					allArrayString+= '；'+allArray[i].bzzz
				}
				allArrayString=allArrayString.substr(1);
				console.log('即将搜索'+'“'+allArrayString+'”'+'的相关症状');
				global.getRelation(allArrayString,this.type).then(res =>{
					var arr=res.data;
					if (arr==''||Object.keys(arr).length==0) {
						this.hotWordModal=false;
						return
					}
					this.relation=true;
					for (var key in arr) {
						var obj={
							sjzz:key,
							bzjs1:[],
							cfzz:[],
							bzzz:[],
							zzjs:[],
							checked:false
						}
						//提取症状解释
						for (var i = 0; i < arr[key].length; i++) {
							obj.bzjs1.push(arr[key][i].split('#')[0]);
						}
						//提取拆分症状
						for (var i = 0; i < arr[key].length; i++) {
							var cfzzobj={
								value:arr[key][i].split('#')[1],
								checked:false
							}
							obj.cfzz.push(cfzzobj);
						}
						//提取bzzz
						for (var i = 0; i < arr[key].length; i++) {
							obj.bzzz.push(arr[key][i].split('#')[2]);
						}
						//提取拆分症状的 症状解释zzjs
						for (var i = 0; i < arr[key].length; i++) {
							obj.zzjs.push(arr[key][i].split('#')[3]);
						}
						this.xgzzArr.push(obj);
					}
					console.log(this.xgzzArr);
					//this.historyStatus=false;
					this.hotWordModal=true;
					this.historyAndFamiliar=false;
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
				return height-50+'px'
			}
		},
		methods: {
			//关闭热词提示框
			closeLxView:function(){
				this.lx_view=false
				this.manualSeach=false
				if (this.glzzArray.length!==0) {
					this.glzz=true;
				}
				this.historyStatus=true
			},
			/* 输入框 得到焦点  */
			 lx_viewshow:function(){
					if(this.lxci.length!==0){
					this.lx_view=true;
					this.glzz=false;
					this.manualSeach=false;
					this.historyStatus=false;
					}
					this.hotWordModal=false;
					this.historyAndFamiliar=true;
				}, 
			//搜索记录
			seachHistory:function(){
				var name = this.zzbx.trim().replace(/\)s/g, '');
				switch (this.type){
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
				switch (this.type){
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
				switch (this.type){
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
				switch (this.type){
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
			//点击 数据主症打开属性*************************************
			openCon:function(item){
				this.selectedBzzz=item;
				//如果当前数据主症 已选中 点击则取消选中
				if (this.selectedBzzz.checked) {
					this.sjzzCheckedNum-=1;
					this.selectedBzzz.checked=false;
					var cfzz=this.selectedBzzz.cfzz;
					for (var i = 0; i < cfzz.length; i++) {
						cfzz[i].checked=false;
					}
				}else{
					//主诉症状 个数限制
					if (this.type==1) {
						if (this.zzbxArray.length+this.sjzzCheckedNum>=3) {
							uni.showToast({
								title: '主诉症状最多可选三个',
								icon: 'none'
							});
							return
						}
					}
					//如果 当前数据主症下只有一条拆分症状 cfzz 则弹出解释弹层
					if (this.selectedBzzz.cfzz.length<=1) {
						this.sjzzShow=true;
					}else{
						this.zzjs='';
						this.bzzzConShow=true;
					}
				}
			},
			//数据主症 解释弹层 确定事件*************************************************************************
			seleckedSjzz:function(){
				this.sjzzCheckedNum+=1;
				this.selectedBzzz.checked=true;
				this.selectedBzzz.cfzz[0].checked=true;
				this.sjzzShow=false;
			},
			//点击拆分症状  弹出解释*********************************************************************************
			selectCfzz:function(item){
				this.cfzz_zzjs=item;
				var selectedBzzz=this.selectedBzzz;
				for (var i = 0; i < selectedBzzz.cfzz.length; i++) {
					if (selectedBzzz.cfzz[i].value==item.value) {
						this.zzjsCon=selectedBzzz.zzjs[i];
					}
				}
				this.zzjsShow=true;
			},
			//拆分症状的解释层  点击确定*************************************************************************
			seleckedZzjs:function(){
				var item=this.cfzz_zzjs;
				var selectedBzzz=this.selectedBzzz;
				for (var i = 0; i < selectedBzzz.cfzz.length; i++) {
					if (selectedBzzz.cfzz[i].value==item.value) {
						selectedBzzz.cfzz[i].checked=true;
					}else{
						selectedBzzz.cfzz[i].checked=false;
					}
				}
				this.zzjsShow=false;
			},
			//选中拆分症状后   点击确定*****************************************************************************
			submitCfzz:function(){
				var selectedBzzz=this.selectedBzzz;
				for (var i = 0; i < selectedBzzz.cfzz.length; i++) {
					if (selectedBzzz.cfzz[i].checked) {
						this.selectedBzzz.checked=true;
						this.bzzzConShow=false;
						this.sjzzCheckedNum+=1;
						break
					}else{
						if (i==selectedBzzz.cfzz.length-1) {
							uni.showToast({
								title: '请选择您的症状',
								icon: 'none'
							});
						}
					}
				}
			},
			//数据主症  点击确定*************************************************************************************
			submitSjzz:function(){
				var array=[];
				var xgzzArr=this.xgzzArr;
				switch (this.type){
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
				if (array.length==0) {
					for (var i = 0; i < xgzzArr.length; i++) {
						for (var n = 0; n < xgzzArr[i].cfzz.length; n++) {
							if (xgzzArr[i].cfzz[n].checked) {
								array.push({bzzz:xgzzArr[i].bzzz[n]});
							}
						}
					}
				}else{
					for (var i = 0; i < xgzzArr.length; i++) {
						if (xgzzArr[i].checked) {
							for (var n = 0; n < xgzzArr[i].cfzz.length; n++) {
								if(xgzzArr[i].cfzz[n].checked){
									for (var j = 0; j < array.length; j++) {
										if (array[j].bzzz!==xgzzArr[i].bzzz[n]) {
											if (j==array.length-1) {
												array.push({bzzz:xgzzArr[i].bzzz[n]});
											}
										}
									}
								}
							}
						}
					}
				}
				
				if (this.sjzzCheckedNum==0) {
					uni.showToast({
						title: '请选择符合您的症状',
						icon: 'none'
					});
					return
				}
				switch (this.type){
					case 1:
						uni.$emit('func',{array:array,type:'zzbx'})
						break;
					case 2:
						uni.$emit('func',{array:array,type:'others'})
						break;
					case 3:
						uni.$emit('func',{array:array,type:'sx'})
						break;
					case 4:
						uni.$emit('func',{array:array,type:'mx'})
						break;
					case 5:
						uni.$emit('func',{array:array,type:'yzbm'})
						break;
					default:
						break;
				}
				uni.navigateBack({
					delta: 1
				});
			},
			/* 点击建议词 将建议词放到指定view*/
			idSeach: function(e) { 
				this.seachHistory();
				let lx_name = e.currentTarget.id;
				var flag = false;
				var array=[];
				switch (this.type){
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
						if (this.type!==5) {
							if (lx_name == array[i].bzzz) {
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
							if (this.type!==5) {
								if (this.relation) {
									if (lx_name == this.lxci[n].bzzz) {
										array.push({bzzz:this.lxci[n].bzzz,bzbzmc:this.lxci[n].bzzz,rmv:true});
										break;
									}
								}else{
									if (lx_name == this.lxci[n].bzzz) {
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
						if (this.type!==5) {
							if (this.relation) {
								if (lx_name == this.lxci[j].bzzz) {
									array.push({bzzz:this.lxci[j].bzzz,bzbzmc:this.lxci[j].bzzz,rmv:true});
									break;
								}
							}else{
								if (lx_name == this.lxci[j].bzzz) {
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
				switch (this.type){
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
			//相关症状展开全部*********************************************************
			showAllXgzz:function(){
				this.showAll=false;
			},
			/* 症状表现搜索请求方法 *********************************************************/
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
								//_this.glzz=false;
							}else{
								_this.lx_view= true;
								//_this.glzz=false;
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
				if (this.type==3) {
					type=1
				}else if(this.type==4){
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
		font-size: 36upx;
	}
.modal_content{
	font-size: 36upx;
	padding: 20upx;
}
.zzbx_input {
	position: relative;
	height: 2em;
	width: 70%;
	background: #f4f4f4;
	font-size: 36upx;
	border-radius: 10upx;
	padding-right: 50upx;
	padding-left: 60upx;
	line-height: 2em;
}
.removeInput{
	position: absolute;
	right: 110upx;
	top: 10upx;
	color: #CCCCCC;
	font-size: 36upx;
	z-index: 1010;
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
.zz_hint{
	padding-top: 10upx;
	color: #A5A5A5;
	font-size: 36upx;
}
.lx_view {
	width: 97%;
	top: 200rpx;
	padding:18rpx;
	z-index: 1000;
	overflow: auto;
	background: #fff;
	height: calc(100% - 100upx);
}
.glzzTitle{
	font-size: 36upx;
	border-bottom: 2upx solid #CCCCCC;
}
.hotWord{
	font-size: 36upx;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	line-height: 2.2;
	border-bottom: 2upx solid #CCCCCC;
}
.manualSeachView{
	overflow: auto;
}
.esJg_view{
	font-size: 36upx;
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
	font-size: 36upx;
}
.remove_history{
	color: #888888;
	font-size: 36upx;
	float: right;
}
.history_view{
	max-height: 400upx;
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
.xgzzBtn{
	color: #5a5a5a;
	text-align: start;
	line-height: 1.5;
	background: #F8F8F8;
	margin-right: 16upx;
	margin-bottom: 16upx;
	border-radius: 12upx;
	padding: 20upx 40upx;
	display: inline-block;
	border: 4upx solid #1296db;
}
.cfzzChecked{
	border: 0upx;
	color: #FFFFFF;
	padding: 24upx 44upx;
	background: #1296DB;
}
.btnHover{
	background: #f0f0f0;
}
.question{
	top: -4upx;
	right: -4upx;
	position: absolute;
}
.sbmitCheckedBzzz{
	width: 50%;
	line-height: 2;
	color: #1296DB;
	border-radius: 40upx;
	border: 2upx solid #1296DB;
	
}
.modal-heard{
	height: 60upx;
	padding: 10upx;
	text-align: center;
}
.modal-content{
	height: calc(100% - 184upx);
	overflow: auto;
	padding: 20upx;
	padding-top: 0;
	text-align: justify;
}
.modal-foot{
	bottom: 0;
	width: 100%;
	height: 80upx;
	z-index: 1010;
	color: #5a5a5a;
	line-height: 2;
	position: absolute;
	text-align: center;
	background: #FFFFFF;
}
button::after{
	border-radius: 0upx;
}
.submit-bzzz{
	color: #FFFFFF;
	height: 80upx;
	border-radius: 0upx;
	line-height: 80upx;
	background: #1296DB;
	border-bottom-right-radius: 10upx;
}
.close-modal{
	color: #666666;
	height: 80upx;
	border-radius: 0upx;
	line-height: 80upx;
	border-bottom-left-radius: 10upx;
}
.xgzz_all{
	max-height: 400rpx;
	overflow: auto;
	margin-top: 10rpx;
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
