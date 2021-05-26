<template>
	<view class="pageall" >
		<view class="null"></view>
		<view class="history">
			<view class="hintText_view">
				<text class="hintText">已回答{{answerIndex}}组问题</text><text class="skip" @tap="skip">查看</text>
			</view>
		</view>
		<view class="uni-flex uni-row problem_view">
			<view class="wenzhen_view">
				<image src="/static/wenzhen.png" mode="" class="wenzhen"></image>
			</view>
			<view class="problem_background">
				<view class="problem_title" :style="{display:titleArray.display}">
					{{titleArray.title}}
				</view>
			</view>
		</view>
		<!-- 单选区域 -->
		<view class="radio_view" v-show="radioShow">
			<radio-group :name="titleArray.name" @change="radioChange" >
				<label class="radio_label uni-row uni-flex" v-for="(item2,index2) in titleArray.answerArray" :key="index2">
					<radio style="transform:scale(0.8);display: none;" :value="item2.value" :checked="item2.checked" :style="{display:item2.title=='null'?'none':''}"/>
					<view  class="radio_label_view" :style="{display:item2.title=='null'?'none':''}" :class="item2.checked?'radioChecked':''">{{item2.title}}</view><!-- :style="[{color:item2.checked?'red':'#000'}]" -->
				</label>
			</radio-group>
		</view>
		<!-- 多选区域 -->
		<scroll-view v-show="checkboxShow" class="checkbox_view" :scroll-top="scrollTop" scroll-y="true" @scroll="scroll">
			<view class="checkbox_label" v-for="(item2,index2) in titleArray.answerArray" :key="index2">
				<text style="color: #A6803F;">{{item2.number}}、</text>
				<text  :style="{display:item2.title=='null'?'none':''}" :class="item2.value=='noValue'? 'noValue':''" style="color:#A6803F;">{{item2.title}}</text><!-- :style="[{color:item2.checked?'red':'#000'}]" -->
				<view v-for="(item3,index3) in titleArray.answerArray[index2].childAnswer" :key="index3" style="line-height: 1;text-indent: 3em;">
					<text @tap="openChoose(item2)">{{item3.checked?item3.title:''}}</text>
				</view>
				<view class="child_body" :style="{display:item2.display}">
					<radio-group :name="item2.name" @change="childChange($event,titleArray,item2)" :data-index="index2">
						<label class="child_label" @click.stop='radioClick(item3,item2)' v-for="(item3,index3) in titleArray.answerArray[index2].childAnswer" :key="index3" :style="{display:index3==titleArray.answerArray[index2].childAnswer.length-2&&titleArray.answerArray[index2].childAnswer[1].title=='是'||item3.checked?'none':titleArray.answerArray[index2].childAnswer[0].title=='是'?'inline-block':'flex',}">
							<radio style="transform:scale(0.8);display: none;"  class="child_radio" :value="item3.value" :checked="item3.checked"/>
							<view class="checkbox_text" :class="item3.checked?'checkbox_checked':''">{{item3.title}}</view>
						</label>
					</radio-group>
				</view>
			</view>
			<view class="jump_view"><text class="jump_Btn"  hover-class="close_btn_hover" v-show="isRespond" @tap="jumpOver">无上述症状，跳过>></text></view>
		</scroll-view>
	</view>
</template>

<script>
	import modal from '@/components/modal.vue';
	export default {
		components:{
			modal
		},
		data() {
			return {
				mengcengShow:false,
				radioSubmit:true,
				disabled:false,
				radioShow:true,
				checkboxShow:false,
				modal:false,
				title: '',
				answerNum:0,
				allAnswer:[],
				problemIndex:'',//
				titleArray:[],
				presentCheck:[],
				titleNumber:1,
				bmId:0,//病名号
				groupNo:1,//题号
				answerIndex:0,//顶部已回答问题数
				submit_text:'确  认',
				isRespond:false,
				scrollTop: 0,
				old: {
					scrollTop: 0
				},
				addUp:0
			}
		},
		onLoad(e) {
			console.log('初始化加载...');
			global.clickNum=0;//多选框点击次数
			global.groupPro=[];//症状数组清空
			global.titleArray=[];
			var bmId=parseInt(e.bmId)+1;
			this.bmId=bmId;
			this.getWz(bmId,this.groupNo);
		},
		onShow(e) {
			console.log('onshow');
			uni.hideHomeButton();
			var problemIndex=uni.getStorageSync('problemIndex');
			if(problemIndex!==''){
				var _this=this;
				this.titleArray=[];
				this.groupNo=problemIndex;
				this.answerNum=problemIndex-1;
				this.answerIndex=problemIndex-1;
				this.getWz(this.bmId,problemIndex).then(data =>{
					global.clickNum+=1;
				})
				uni.setStorageSync('problemIndex','');
			}
			var jumpTitle=uni.getStorageSync('jumpTitle');
			if (JSON.stringify(jumpTitle)!=='{}'&&jumpTitle!=='') {
				this.getWz(this.bmId,jumpTitle.groupNo,jumpTitle.traceStatus);
			}
		},
		methods: {
			scroll: function(e) {
				this.old.scrollTop = e.detail.scrollTop
			},
			skip:function(){
				if (global.groupPro.length<1) {
					uni.showModal({
						title: '提示',
						content: '您还没有回答问题',
						showCancel: false,
						confirmText: '确定',
					});
					return
				} 
				/* uni.redirectTo({
					url: '/pages/historyCopy/historyCopy',
				}); */
				uni.navigateTo({
					url: '/pages/historyCopy/historyCopy',
				})
			},
			//二级选项点击==========================================================================
			radioClick:function(item3,item2){
				//点击时如果二级选项已选中，直接关闭选项
				if (item3.checked) {
					if (item3.checked) {
						item2.display='none'
					}
				}
			},
			//单选选中==================================================================
			radioChange:function(e){
				console.log(e);
				this.isRespond=true;
				var answerValue=e.detail.value;
				var index=e.currentTarget.dataset.index;
				var value=this.titleArray.answerArray;
				for (var i = 0; i < value.length; i++) {
					if (value[i].value==e.target.value) {
						value[i].checked=true;
						value[i].display='block';
					}else{
						value[i].checked=false;
						 value[i].display='none';
						 var zixiang=(value[i].childAnswer==undefined?'null':value[i].childAnswer);
						 if (zixiang!=='null') {
						 	for (var j = 0; j < zixiang.length; j++) {
									zixiang[j].checked=false
								} 
						 }
					}
				}
				this.submitRadio();
			},
			//子项单选========================================================================
			childChange:function(e,item,item2){
				var childAn=e.detail.value;
				var index=e.currentTarget.dataset.index;
				var value=this.titleArray.answerArray[index].childAnswer;
				for (var i = 0; i < value.length; i++) {
					if (value[i].value==childAn) {
						value[i].checked=true
					}else{
						value[i].checked=false
					}
				}
				item2.display='none';
				if (childAn!=='no') {
					item2.checked=true;
				}
				if (index+1<this.titleArray.answerArray.length) {
					this.titleArray.answerArray[index+1].display='block';
				}
				this.scrollTop = this.old.scrollTop
				/* this.$nextTick(function() {
					this.scrollTop = 100;
				}); */
					/* const query = uni.createSelectorQuery().in(this);
					query.select('.checkbox_label').boundingClientRect(data => {
						var num=data.height+5;  
						this.addUp+=num;
						this.$nextTick(function() {
							this.scrollTop = this.addUp;
						console.log(this.scrollTop);
						});
					}).exec(); */
					//最后一个选项选中后，调用单项选中提交方法(submitRadio)
					if (index==item.answerArray.length-1) {
						this.submitRadio();
					}
			},
			//打开二级选项
			openChoose:function(item2){
				if (item2.display=='block') {
					item2.display='none'
				}else{
					item2.display='block'
				}
			},
			//单项选项提交====================================================================
			submitRadio:function(index){
				var title1=this.titleArray.alias;
				var array=this.titleArray.answerArray;
				var flag1=false;
				var noValueFlag=true;
				//当此组题不可跳过时，检测每个选项的选中值，若有选中值（“无”，“否”除外），可以请求下一题或提交，若没有则停止
					for (var i = 0; i < array.length; i++) {
						if (array[i].childAnswer!==undefined) {
							for (var j = 0; j < array[i].childAnswer.length; j++) {
								if (array[i].childAnswer[j].value!=='no'&&array[i].childAnswer[j].checked) {
									this.isRespond=true;
									break
								}
							}
						}
					}
				if (this.isRespond==false) {
					console.log('不可跳过');
					return 
				}else{
					console.log('可以跳过');
				}
				this.titleNumber+=1;
				this.answerNum+=1;
				this.answerIndex+=1;
				this.addUp=0;
				this.scrollTop=0;
				//将整组问题存入数组，历史页调用
				var groupPro=global.groupPro;
				if (groupPro.length==0) {
					if (this.titleArray.alias!==undefined) {
						global.groupPro.push(this.titleArray);
					}else{
						for (var i = 0; i < array.length; i++) {
							if (array[i].value!=='noValue') {
								global.groupPro.push(array[i]);
							}
						}
					}
				}else{
					if (this.titleArray.alias!==undefined) {
						for (var i = 0; i < groupPro.length; i++) {
							if (groupPro[i].title==this.titleArray.title) {
									groupPro.splice(i,1);
								}
							}
							groupPro.push(this.titleArray);
					}else{
						var newArr=[];
						for (var i = 0; i < array.length; i++) {
							for (var j = 0; j < groupPro.length; j++) {
								if (array[i].title==groupPro[j].title) {
									groupPro.splice(j,1);
								}
							}
						}
						for (var i = 0; i < array.length; i++) {
							if (array[i].value!=='noValue') {
								newArr.push(array[i]);
							}
						}
						for (var i = 0; i < newArr.length; i++) {
							global.groupPro.push(newArr[i])
						}
					}
				}
				var bzidArray=[];//选中一级选项id数组
				for (var i = 0; i < array.length; i++) {
					if (array[i].checked) {
						//将选中的问题答案存入数组
							var answerarr='';
							if (this.titleArray.answerArray[0].childAnswer==undefined) {
								answerarr={groupNum:array[i].groupNum,title:title1,answer:array[i].title,value:array[i].value};
							}else{
								var childArr=array[i].childAnswer;
								if (childArr!==undefined) {
									for (var n = 0; n < childArr.length; n++) {
										if (childArr[n].title=='N') {
											answerarr={groupNum:array[i].groupNum,title:array[i].title,answer:'',value:array[i].value,titleNum:array[i].number};
											break
										}else if (childArr[n].checked) {
											answerarr={groupNum:array[i].groupNum,title:array[i].title,answer:childArr[n].title,value:childArr[n].value,titleNum:array[i].number};
											break
										}
									}
								}
							}
							//过滤重复答案
							for (var j = 0; j < this.allAnswer.length; j++) {
								if (this.allAnswer[j].title==answerarr.title) {
									this.allAnswer.splice(j,1);
								}
							}
							if (answerarr!=='') {
								this.allAnswer.push(answerarr);
							}
							//获取选中选项id
							var wz_id='';
							if (array[i].childAnswer==undefined) {
								 wz_id=array[i].value;
								 bzidArray.push(wz_id);
							}else{
								var checkedValue=array[i].childAnswer;
								for (var n = 0; n < checkedValue.length; n++) {
									if (checkedValue[n].title=='N') {
										wz_id=array[i].value;
										bzidArray.push(wz_id);
										break
									}else{
										if (checkedValue[n].checked) {
											wz_id=checkedValue[n].value;
											bzidArray.push(wz_id);
											break
										}
									}
								}
							}
					/* 
					 var allAnswer=this.allAnswer;
					 for (var n = 0; n < allAnswer.length; n++) {
						if (allAnswer[n].title==array[i].title) {
							allAnswer.splice(n,1);
						}
					 }
					
					 */
				}else{
					//如果未选中，查看对当前选项是否是带n的选项题，是：查看是否有两个n，是:获取反选项，getJg时需要提交反选项
					if (array[i].value!=='noValue'&&array[i].childAnswer!==undefined&&array[i].childAnswer.length==3&&array[i].childAnswer[0].title=='是'&&array[i].childAnswer[1].title=='是') {
						answerarr={index:this.answerNum,Inverse:true,groupNum:array[i].groupNum,title:array[i].title,answer:'否',value:array[i].childAnswer[1].value,titleNum:array[i].number};
						//过滤重复答案
						for (var j = 0; j < this.allAnswer.length; j++) {
							if (this.allAnswer[j].title==answerarr.title) {
								this.allAnswer.splice(j,1);
							}
						}
						if (answerarr!=='') {
							this.allAnswer.push(answerarr);
						}
					}
				}
				}
				console.log(`已选病症id：${bzidArray}`);
				global.answerArray=this.allAnswer;
				this.compare(bzidArray,index);
			},
			//跳过================================================================================================
			jumpOver:function(){
				var title1=this.titleArray.alias;
				var array=this.titleArray.answerArray;
				var groupPro=global.groupPro;
				var answerarr={}
				var titleArray=this.titleArray;
				//点击跳过时将此组问题全部取消选中
				if (titleArray.alias!==undefined) {
					for (var i = 0; i < array.length; i++) {
						array[i].checked=false;
					}
				}else{
					for (var i = 0; i < array.length; i++) {
						array[i].checked=false;
						for (var j = 0; j < array[i].childAnswer.length; j++) {
							array[i].childAnswer[j].checked=false
						}
					}
				}
				//将整组问题存入数组，历史页调用
				if (groupPro.length==0) {
					if (this.titleArray.alias!==undefined) {
						global.groupPro.push(this.titleArray);
					}else{
						for (var i = 0; i < array.length; i++) {
							if (array[i].value!=='noValue') {
								global.groupPro.push(array[i]);
							}
						}
					}
				}else{
					if (this.titleArray.alias!==undefined) {
						for (var i = 0; i < groupPro.length; i++) {
							if (groupPro[i].title==this.titleArray.title) {
									groupPro.splice(i,1);
								}
							}
							groupPro.push(this.titleArray);
					}else{
						var newArr=[];
						for (var i = 0; i < array.length; i++) {
							for (var j = 0; j < groupPro.length; j++) {
								if (array[i].title==groupPro[j].title) {
									groupPro.splice(j,1);
								}
							}
						}
						for (var i = 0; i < array.length; i++) {
							if (array[i].value!=='noValue') {
								newArr.push(array[i]);
							}
						}
						for (var i = 0; i < newArr.length; i++) {
							global.groupPro.push(newArr[i])
						}
					}
				}
				//点击跳过时，如果跳转条件为“-1” 跳转症状号为null 说明此题为最后一题，结束问症。否则：下一题
				if (titleArray.isJump=='-1'&&titleArray.jumpCon=='null') {
					//结束问症，提交已选症状
					this.postForm();
				}else{
					this.titleNumber+=1;
					this.answerNum+=1;
					this.answerIndex+=1;
					var bmId=this.bmId;
					this.groupNo+=1;
					this.getWz(bmId,this.groupNo);
				}
			},
			//已选病症与跳转条件比较=================================================================
			compare:function(bzidArray,index){
				var traceStatus=this.titleArray.traceStatus;
				if (traceStatus==-1) {
					this.answerNum-=1;
					this.answerIndex-=1;
					this.postForm();
					return
				}
				//将选项id数组与跳转条件数相比较
				var bmId=this.bmId;
				var jumpConArray=[];//跳转条件数组
				var jumpCon=this.titleArray.jumpCon.split(',');
				if (jumpCon[0]!=='null') {//如果jumpCon为null，判断isJump
					/* if (jumpCon.indexOf(',')>-1) {
						jumpConArray=jumpCon.split(',');
					}else{
					} */
						jumpConArray=jumpCon;
					var equal=0;
					if (jumpConArray.length==bzidArray.length) {//如果跳转条件数组长度==一级选项id长度时：进行比较；否则：一定不跳转，直接提交进入下一题；
						for (var i = 0; i < bzidArray.length; i++) {
							for (var j = 0; j < jumpConArray.length; j++) {
								if (bzidArray[i]==jumpConArray[j]) {
									equal+=1;
								}
							}
						}
						if (equal==bzidArray.length) {//如果相等说明完全匹配,判断isJump值：null正常提交调用getWz方法进入下一题；-1直接提交结果调用getJg方法；>0根据题号提交调用getWz
							var isJump=this.titleArray.isJump;
							if (isJump=='null') {
								this.groupNo+=1;
								this.getWz(bmId,this.groupNo);
							}else if(isJump>0){
								var groupNo=isJump;
								this.getWz(bmId,groupNo);
							}else{//isJump==-1:停止问答;调用getJg提交结果
							this.answerNum-=1;
							this.answerIndex-=1;
							//对global.answerArray进行操作:仅保留当前题组之前的数组元素，之后的元素删除掉；
							var newsArray=[];
							var array=global.answerArray;
							for (var i = 0; i < array.length; i++) {
								if (array[i].groupNum<=this.answerNum+1) {
									newsArray.push(array[i]);
								}
							}
							global.answerArray=newsArray;
							this.postForm();
							}
						}else{//正常提交调用getWz
							this.groupNo+=1;
							this.getWz(bmId,this.groupNo);
						}
					}else{//正常提交调用getWz
						this.groupNo+=1;
						this.getWz(bmId,this.groupNo);
					}
					
				}else{
					//jumpCon为null判断isJump：null下一题；-1：提交结果；>0跳转到此题号
					var isJump=this.titleArray.isJump;
					if (isJump=='null') {
						this.groupNo+=1;
						this.getWz(bmId,this.groupNo);
					}else if(isJump>0){
						this.getWz(bmId,isJump);
					}else{//isJump==-1:停止问答;调用getJg提交结果
						this.answerNum-=1;
						this.answerIndex-=1;
						//对global.answerArray进行操作:仅保留当前题组之前的数组元素，之后的元素删除掉；
						var newsArray=[];
						var array=global.answerArray;
						for (var i = 0; i < array.length; i++) {
							if (array[i].groupNum<=this.answerNum+1) {
								newsArray.push(array[i]);
							}
						}
						global.answerArray=newsArray;
						this.postForm();
					}
				}
			},
			//获取病症问题=============================================================================
			getWz:function(bmId,groupNo,traceStatus){
				uni.setStorageSync('jumpTitle','');
				console.log(global.answerArray);
				var _this=this;
				return new Promise(function(resolve,rej){
					global.clickNum=0;//多选框点击次数
					global.getWz(bmId,groupNo).then(res =>{
						if (res=='') {
							_this.postForm();
							_this.answerIndex-=1;
							return
						}
						_this.titleArray=[];
						var array=res;
						var obj={};
						var groupArr=[];
						var groupSort=[];
						var answerArr=[];
						var intra_group=[];//组内问题
						var answerArray=[];
						var Array=array.split("%");
						var childArr=[];//子选项数组
						console.log(Array);
						if (Array.length==3) {//Array.length==2此组题为单选题，没有二级选项;
							_this.radioShow=true;
							_this.checkboxShow=false;
							for (var i = 0; i < Array.length-2; i++) { 
										groupArr=Array[i].split('&');
								}
								for (var i = 0; i < groupArr.length; i++) {
									intra_group.push(groupArr[i].split('#'));
								}
								obj={
									index:_this.answerNum+1,
									traceStatus:traceStatus,
									name:'radio'+_this.titleNumber,
									title:intra_group[0][1],
									alias:intra_group[0][2],
									display:'block',
									isJump:Array[1].split('&')[0],//是否跳转：null下一题；-1：停止；>0:跳转到此题号
									jumpCon:Array[1].split('&')[1],//跳转条件：与选中的一级选项号比较
									isRespond:Array[2],//此题是否可以跳过 0：可以跳过，1：不可以跳过
									answerArray:[],
									groupNum:groupNo
									}
								for (var i = 1; i < intra_group.length; i++) {
										answerArr={title:intra_group[i][0],value:intra_group[i][1],checked:false,display:'none',groupNum:groupNo};
										answerArray.push(answerArr);
								}
								console.log('此题是否可以跳过',obj.isRespond);
								//answerArr={title:'无以上症状',value:'noValue',checked:false,display:'none'};
								//answerArray.push(answerArr);
						}else{//此组题为多选题，有二级选项
							_this.radioShow=false;
							_this.checkboxShow=true;
							for (var i = 0; i < Array.length-2; i++) {
								groupArr.push(Array[i].split('&'));
							}
							for (var i = 0; i < groupArr.length; i++) {
								for (var j = 0; j < groupArr[i].length; j++) {
									intra_group.push(groupArr[i][j].split('#'));
								}
								groupSort[i]=intra_group;
								intra_group=[]
							}
							obj={
								index:_this.answerNum+1,
								traceStatus:traceStatus,
								name:'radio'+_this.titleNumber,
								title:groupSort[0][0][1],//组标题
								display:'block',
								jumpCon:Array[Array.length-2].split('&')[1],//跳转条件：与选中的一级选项号比较
								isJump:Array[Array.length-2].split('&')[0],//是否跳转：null下一题；-1：停止；>0:跳转到此题号
								isRespond:Array[Array.length-1],//此题是否可以跳过 0：可以跳过，1：不可以跳过
								answerArray:[],
								groupNum:groupNo
							}
							for (var i = 0; i < groupSort.length; i++) {
								answerArr={value:(groupSort[i][1][0]=='N'?groupSort[i][1][1]:groupSort[i][0][0]),groupNum:groupNo,number:global.serialNumber++,title:groupSort[i][0][2],checked:false,showModal:false,display:'none',wz_id:groupSort[i][1][2],name:'radio'+(i+1)+'-1',
										   childAnswer:[],index:_this.answerNum+1
										  }
								for (var j = 1; j <= groupSort[i].length; j++) {//为症状添加“无”选项与“是”，“否”选项
									if (j==groupSort[i].length) {
										childArr={title:(groupSort[i][j-1][0]=='N'?'否':'没有以上症状'),value:'no',groupNum:groupNo,checked:false};
									}else{
										childArr={title:(groupSort[i][j][0]=='N'?'是':groupSort[i][j][0]),value:groupSort[i][j][1],groupNum:groupNo,checked:false}
									}
									answerArr.childAnswer.push(childArr);
									childArr=[];
								}
								answerArray.push(answerArr);
							}
							//answerArr={value:'noValue',title:'都没有',checked:false,display:'none',name:'radioNo'}
							//answerArray.push(answerArr);
						}
						//如果跳转条件为0显示跳转链接，可跳过
						if (obj.isRespond=='0') {
							_this.isRespond=true
						}else{
							_this.isRespond=false
						}
						obj['answerArray']=answerArray;
						_this.titleArray=obj;
						//_this.titleArray.answerArray[0].display='block';//默认展开第一选项
						//将组问题存入公共变量
						console.log(_this.titleArray);
						if (global.titleArray.length==0) {
							global.titleArray.push(_this.titleArray);
						}else{
							var flag=false;
							for (var i = 0; i < global.titleArray.length; i++) {
								if (global.titleArray[i].groupNum==_this.titleArray.groupNum) {
									flag=true;
									break
								}
							}
							if (!flag) {
								global.titleArray.push(_this.titleArray);
							}
						}
					resolve(obj)
					//获取完问题后如果此组题选中过，默认选中。(在重答状态下)
					_this.sortMxz();
					var arr=global.answerArray;
					var titleArray=_this.titleArray.answerArray;
					if (arr.length==0) {
						return
					}
					titleArray[0].display='block';
					if (titleArray[0].childAnswer==undefined) {
						for (var i = 0; i < arr.length; i++) {
							for (var j = 0; j < titleArray.length;j++) {
								if (arr[i].answer==titleArray[j].title) {
									titleArray[j].checked=true
									_this.isRespond=true;
									global.clickNum=1;
									break
								}
							}
						}
					}else{
						var flag=false;
						_this.presentCheck=[];
						for (var i = 0; i < arr.length; i++) {
							for (var n = 0; n < titleArray.length; n++) {
								if (arr[i].title==titleArray[n].title) {
									_this.isRespond=true;
									titleArray[n].checked=true;
									//_this.titleArray.answerArray[0].display='none';//在重答状态下，若此题之前选中过，第一选项不展开
									_this.presentCheck.push(titleArray[n].value)
									for (var j = 0; j < titleArray[n].childAnswer.length; j++) {
										if (arr[i].answer==titleArray[n].childAnswer[j].title) {
											titleArray[n].childAnswer[j].checked=true;
											global.clickNum=1;
											break
										}
									}
									break
								}
							}
						}
					}
					}).catch(err=>{
						console.log('请求失败...');
					})
				})
			},
			//明细证排序 =======================================================================
			sortMxz:function(){
				var num=0;
				var newArr=[];
				var childArr=[];
				var arr=this.titleArray.answerArray;
				if (arr[0].childAnswer==undefined&&arr[1].childAnswer==undefined) {
					for (var i = 0; i < arr.length; i++) {
						childArr.push(arr[i].value)
					}
					childArr.sort(function(a,b){
						return a-b
					})
					for (var i = 0; i < arr.length; i++) {
						for (var j = 0; j < arr.length; j++) {
							if (arr[j].value==childArr[num]) {
								newArr.push(arr[j]);
								num+=1;
								break
							}
						}
					}
					this.titleArray.answerArray=newArr;
				}else{
					for (var i = 0; i < arr.length; i++) {
						if (arr[i].value!=='noValue') {
							for (var j = 0; j < arr[i].childAnswer.length; j++) {
								childArr.push(arr[i].childAnswer[j].value); 
							}
							childArr.sort(function(a,b){
								return a-b
							})
							for (var j = 0; j < arr[i].childAnswer.length; j++) {
								for (var n = 0; n < arr[i].childAnswer.length; n++) {
									if (arr[i].childAnswer[n].value==childArr[num]) {
										newArr.push(arr[i].childAnswer[n]);
										num+=1;
										break
									}
								}
							}
						}
						arr[i].childAnswer=newArr;
						num=0;
						newArr=[];
						childArr=[];
					}
				}
			},
			//表单提交====================================================================
			postForm:function(){
				//调用接口，判断使用次数
				var gnid=null;
				switch (this.bmId){
					case 1:
						gnid=6;
						break;
					case 2:
						gnid=8;
						break;
					case 3:
						gnid=7;
					default:
						break;
				}
				global.getUserCtrl(gnid).then(res =>{
					var Jg=uni.getStorageSync('Jg');
					if (!res) {
						uni.showModal({
							title: '提示',
							content: '当前会员级别使用次数已达上限，请升级会员级别。',
							showCancel: true,
							cancelText: '取消',
							confirmText: '确定',
							success: res => {
								if (res.confirm) {//跳转小程序
								var classId=Jg.classId;
								if (classId<1) {//不是会员
									global.up().then(res =>{//去易一健康授权手机号
										
									}).catch(err =>{//取消跳转
										
									});
								}else{
									let path='/pagesD/mine/memberGrade/memberGrade';
									let type='upgrade';
										global.up(path,type).then(res =>{//去易一健康
											
										}).catch(err =>{//取消跳转则跳转至结果页
											uni.redirectTo({
												url: '/pages/result/result?status=0'
											});
										});
								}
								}else if(res.cancel){//跳转至结果页
									uni.redirectTo({
										url: '/pages/result/result?status=0'
									});
								}
							}
						});
					}else{
						//剩余次数>0
						var answer='';
						var array=global.answerArray;
						var userId=uni.getStorageSync('UnionId');
						var bmId=this.bmId;
						console.log(array);
						//去除值为no
						for (var i = 0; i < array.length; i++) {
							if (array[i].value=='no') {
								array.splice(i,1);
								i=i-1;
							}
						}
						for (var i = 0; i < array.length; i++) {
							if (array[i].value!=='') {
								answer+=','+array[i].value
							}
						}
						var answerString=answer.substr(1);
						console.log(answerString);
						global.getJg(answerString,userId,bmId).then(res =>{
							console.log(res);
							var result=res.data;
							if (result=='') {
								uni.showToast({
									title: '服务器错误',
									icon: 'none'
								});
								return
							}
							if (JSON.stringify(result) == '{}' ) {
								uni.showToast({
									title: '服务器内部错误'
								});
							}else if(result.jump!==undefined){
								let jump=result.jump.split('#');
								global.flag=jump[2];
								this.getWz(this.bmId,jump[0],jump[1]);
							}else{
								uni.redirectTo({
									url: `/pages/result/result?status=1`,
								});
							}
						});
					}
				})
			}
		}
	}
</script>

<style>
	
	.null{
		height: 40upx;
	}
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.scrollView{
		height: 200upx;
	}
	.logo {
		height: 200upx;
		width: 200upx;
		margin-top: 200upx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50upx;
	}
	.pageall{
		height: 100%;
		background-size: 100% 100%;
		background-image: url('~@/static/background.jpg');
	}
	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36upx;
		color: #8f8f94;
	}
	.history{
		width: 60%;
		height: 140rpx;
		margin-left: 20%;
		text-align: center;
		line-height: 140rpx;
		background-size: 100% 100%;
		background-repeat:no-repeat;
		justify-content: center;
		background-image: url('~@/static/hengfu.png') ;
	}
	.hintText_view{
		height: 140upx;
		line-height: 140upx;
	}
	.hintText{
		margin-right: 40rpx;
	}
	.skip{
		text-decoration: underline;
	}
	.problem_view{
		position: relative;
		margin-top: 60upx;
	}
	.wenzhen{
		width: 120upx;
		height: 240upx;
	}
	.wenzhen_view{
		width: 20%;
		padding-left: 70upx;
	}
	.problem_background{
		left: 25%;
		z-index: 99;
		min-height: 40%;
		max-height: 65%;
		position: absolute;
		background-size: 128% 180%;
		background-image: url('~@/static/qipao.png');
	}
	.problem_titleView{
		left: 15%;
		top: 15%;
		position: absolute;
		text-align: center;
	}
	.problem_title{
		padding: 30upx;
		padding-left: 60upx;
		padding-right: 4upx;
		/* font-family: cursive; */
	}
	/* .radio_view{
		left: 13%;
		width: 78%;
		top: 230upx;
		padding: 20upx;
		padding-top: 0upx;
		position: absolute;
		border-radius: 6upx;
		border:2upx solid #CCCCCC;
	} */
	.radio_view{
		width: 60%;
		margin-top: -5%;
		margin-left: 30%;
	}
	.checkbox_view{
		left: 25%;
		width: 70%;
		top: 450upx;
		overflow: auto;
		height: 700upx;
		position: fixed;
	}
	.checked_child{
		margin-left: 60upx;
	}
	.child_view{
		top: 45%;
		left: 50%;
		width: 71%;
		min-width: 58%;
		max-width: 72%;
		z-index: 999;
		position: fixed;
		background: #fff;
		border-radius: 10upx;
		transform: translate(-50%, -50%);
	}
	.uni-mask {
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 998;
		position: fixed;
		background-color: rgba(0, 0, 0, .3);
		}
	.modal_view{
		/* position: fixed;
		z-index: 999; */
	}
	.child_head{
		padding: 16upx;
		line-height: 1;
		text-align: right;
		padding-top:16upx;
		padding-bottom: 16upx;
	}
	.child_body{
		padding-top: 0upx;
		padding-right: 0upx;
		padding-bottom: 10upx;
		border-top-left-radius: 10upx;
		border-top-right-radius: 10upx;
	}
	.child_label{
		margin: 10upx;
		line-height: 1.8;
		padding-right: 0upx;
	}
	.hide_label{
		display: none;
	}
	.checkbox_text{
		line-height: 1.3;
		border-radius: 6upx;
		border: 1px solid #9C9C9C;
		padding: 4upx 20upx;
	}
	.jump_view{
		margin-top: 20upx;
		padding-left: 50upx;
	}
	.checkbox_checked{
		color: #FFFFFF;
		background: #A6803F;
		border: 1px solid #A6803F;
	}
	.checkbox_label{
		display: block;
		line-height: 2;
		padding:0upx 20upx;
		margin-top: 5px;
		padding-left: 50upx;
	}
	.radio_label{
		margin: 10upx;
		margin-top: 20upx;
		line-height: 1.5;
		padding-right: 0upx;
		display: flex;
		/* text-align: center;
		justify-content: center; */
	}
	.radio_label_view{
		line-height: 1.3;
		border-radius: 6upx;
		padding:4upx 20upx;
		border: 1px solid #9C9C9C;
	}
	.radioChecked{
		color: #FFFFFF;
		background: #A6803F;
		border: 1px solid #A6803F;
	}
	.child_radio{
		/* clear: right;
		float: right; */
		transform: scale(0.8);
	}
	.radio_title{
		font-weight: 700;
		/* font-family: kaiti; */
	}
	.close_Btn{
		height: 60upx;
		color: #FFFFFF;
		padding-top: 4rpx;
		line-height: 1.7;
		vertical-align: middle;
		padding-left: 20upx;
		padding-right: 20upx;
		border-radius: 6rpx;
		background: #A6803F;
	}
	.jump_Btn{
		color: #000;
		font-style: italic;
		text-decoration:underline;
	}
	.close_btn_hover{
		background: #f6daaa;
	}
	.submit_view{
		position:fixed;
		bottom: 60upx;
		width:40%;
		left:30%;
		text-align: center;
	}
	.submitAll_view{
		position: fixed;
		width: 26%;
		left: 38%;
		bottom: 18%;
	}
	.showSubmit{
		color: #FFFFFF;
		padding: 0rpx;
		line-height: 1.6;
		border-radius: 6rpx;
		background: #A6803F;
	}
	.modal_foot{
		height: 50upx;
		width: 100%;
		border-top: 2upx solid #CCCCCC !important;
	}
	.modal_submit{
		width: 100%;
		border: 0upx;
		line-height: 50upx;
		border-top-left-radius: 0upx;
		border-top-right-radius: 0upx;
		border-bottom-left-radius: 10upx;
		border-bottom-right-radius: 10upx;
	}
	.noValue{
		color: #555;
		font-style: italic;
	}
	.modal_cancel{
		width: 50%;
		border: 0upx;
		line-height: 1.8;
		border-radius: 0upx;
	}
	button::after{
		border: 0upx;
		border-radius: 0upx;
	}

	/* #ifdef MP-WEIXIN */
		checkbox .wx-checkbox-input  {
			border: 2upx solid #A6803F;
			background: #eeebe4 !important;
			}
		 checkbox .wx-checkbox-input-checked{
			background: #eeebe4 !important;
			/* color: #FFFFFF !important; */
		}
		/* checkbox .wx-checkbox-input-checked::before{
			font-size: 40upx !important;
		} */
		radio .wx-radio-input  {
			border: 2upx solid #A6803F;
			}
	/* #endif */
	
</style>
