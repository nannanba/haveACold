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
				<form @submit="formSubmit" @reset="formReset">
					<view class="problem_title" v-for="(item,index) in titleArray" :key="index" :style="{display:item.display}">
						{{item.title}}
						<view class="radio_view">
							<!-- <view class="radio_title"><text>选择符合您的项目</text></view> -->
							<radio-group v-show="radioShow" :name="item.name" @change="radioChange" :data-index="index" >
								<label class="radio uni-row uni-flex" v-for="(item2,index2) in item.answerArray" :key="index2">
									<radio style="transform:scale(0.8)" :value="item2.value" :checked="item2.checked" :style="{display:item2.title=='null'?'none':''}"/>
									<view  style="font-size: 32upx;line-height: 2;" :style="{display:item2.title=='null'?'none':''}">{{item2.title}}</view><!-- :style="[{color:item2.checked?'red':'#000'}]" -->
								</label>
							</radio-group>
							<checkbox-group v-show="checkboxShow"  :name="item.name" @change="checkboxChange($event,item)" :data-index="index">
								<label class="radio" v-for="(item2,index2) in item.answerArray" :key="index2">
									<checkbox style="transform:scale(0.8)"  :value="item2.value" :disabled='item2.disabled' :checked="item2.checked" :style="{display:item2.title=='null'?'none':''}"/>
									<text  :style="{display:item2.title=='null'?'none':''}" :class="item2.value=='noValue'? 'noValue':''">{{item2.title}}</text><!-- :style="[{color:item2.checked?'red':'#000'}]" -->
									<!-- 已选二级选项 -->
									<view class="checked_child" @click.stop="checkboxChange"  v-for="(item3,index3) in item.answerArray[index2].childAnswer" :key="index3">
										<text @click.stop="openModel(item2)">{{item3.checked?item3.title:''}}</text><!--  -->
									</view>
									<!-- 子选项弹层 -->
									<view class="modal_view" @click.stop="checkboxChange" :style="{display:item2.display}">
										<view class="uni-mask" v-show="mengcengShow"></view><!--  -->
										 <view class="child_view">
											 <view class="child_head">
											 	<text class="modal_close" @click.stop="closeModal(item2)">&#xe677;</text>
											 </view>
											 <view class="child_body">
												<radio-group :name="item2.name" @change="childChange($event,item2)" @click.stop="checkboxChange" :data-index="index" :data-key="index2">
													<label class="child_label" @click.stop="radioClick(item3,item2)" v-for="(item3,index3) in item.answerArray[index2].childAnswer" :key="index3" :style="{display:((item3.title!=='null'&&item3.title!=='N'&&item3.title!==''&&item3.title!==undefined)?'block':'none')}">
														<radio style="transform:scale(0.8)"  class="child_radio" :value="item3.value" :checked="item3.checked"/>
														<text >{{item3.title}}</text>
													</label>
												</radio-group>
											 </view>
											<!-- <view class="uni-row uni-flex modal_foot">
												<button class="modal_submit" @tap="childRadioChecked(item2)">确定</button>
											</view> -->
										</view>
									</view>
								</label>
							</checkbox-group>
							<view class="submit_view">
								<button  class="close_Btn"  hover-class="close_btn_hover" @tap="submitRadio(index)">{{submit_text}}</button>
								<view style="padding-top: 20upx;"><text class="jump_Btn"  hover-class="close_btn_hover" v-show="isRespond" @tap="jumpOver">无上述症状，跳过</text></view>
							</view>
						</view>
					</view>
				</form>
			</view>
		</view>
		
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
				title: 'Hello',
				answerNum:0,
				temporary:true,
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
			}
		},
		onLoad(e) {
			console.log('初始加载...');
			global.clickNum=0;//多选框点击次数
			global.groupPro=[];//症状数组清空
			let bmId=parseInt(e.bmId)+1;
			this.bmId=bmId;
			this.getWz(bmId,this.groupNo);
		},
		onShow(e) {
			console.log('onshow');
			uni.hideHomeButton();
			let problemIndex=uni.getStorageSync('problemIndex');
			if(problemIndex!==''){
				let _this=this;
				this.titleArray=[];
				this.groupNo=problemIndex;
				this.answerNum=problemIndex-1;
				this.answerIndex=problemIndex-1;
				this.getWz(this.bmId,problemIndex).then(data =>{
					global.clickNum+=1;
				})
				//对global.answerArray进行操作:仅保留problemIndex之前的数组元素，之后的元素删除掉；
				/* let arr=global.answerArray;
				for (var i = 0; i < arr.length; i++) {
					if (arr[i].index>=problemIndex) {
						arr.splice(i);
						break
					}
				} */
				uni.setStorageSync('problemIndex','');
				console.log(global.answerArray);
			}
		},
		methods: {
			//关闭弹出框================================================================
			closeModal:function(event){
				let child=event.childAnswer;
				let trueNum=0;
				for (var i = 0; i < child.length; i++) {
					if (child[i].checked==true) {
						trueNum+=1;
					}
				}
				if (trueNum<1) {
					event.checked=false;
				}
				event.display='none';
				this.mengcengShow=false;
			},
			//点击已选二级症状弹出二级症状弹层==============================================
			openModel:function(item2){
				item2.display='block';
				this.mengcengShow=true;
			},
			//点击二级标症时如果此时已选中关闭弹出层=========================================
			radioClick:function(item3,item2){
				if (item3.checked) {
					this.mengcengShow=false;
					item2.display='none'
				}
			},
			//查看已答问题================================================================
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
				uni.navigateTo({
					url: '/pages/history/history',
				});
			},
			//单选选中==================================================================
			radioChange:function(e){
				console.log(e);
				this.temporary=true;
				let answerValue=e.detail.value;
				let index=e.currentTarget.dataset.index;
				let value=this.titleArray[index].answerArray;
				for (var i = 0; i < value.length; i++) {
					if (value[i].value==e.target.value) {
						value[i].checked=true;
						value[i].display='block';
					}else{
						value[i].checked=false;
						 value[i].display='none';
						 let zixiang=(value[i].childAnswer==undefined?'null':value[i].childAnswer);
						 if (zixiang!=='null') {
						 	for (var j = 0; j < zixiang.length; j++) {
									zixiang[j].checked=false
								} 
						 }
					}
				}
			},
			//多选选中====================================================================
			checkboxChange:function(e,item){
				console.log(e);
				let checkTitle='';
				this.temporary=true;
				let answerValue=e.detail.value;
				if (answerValue==undefined) {
					return
				}
				//
				let val=this.titleArray[0].answerArray;
				for (var i = 0; i < val.length; i++) {
					if (answerValue.includes(val[i].value)) {
						val[i].checked=true;
					}else{
						 val[i].checked=false;
						 val[i].display='none';
						 let childChecked=val[i].childAnswer;
						 if (childChecked!==undefined) {
						 	for (var n = 0; n < childChecked.length; n++) {
						 		childChecked[n].checked=false;
						 	}
						 }
					}
				} 
				//检查多选中是否选中“都没有”是：取消其它选项选中状态
				let values=[];
				values=this.titleArray[0].answerArray;
				if (answerValue[answerValue.length-1]=='noValue') {
					global.clickNum+=1;
					this.presentCheck=['noValue'];
					 for (var j = 0; j < values.length; j++) {
							if (values[j].value!=='noValue') {
								values[j].checked=false;
								let childChecked=values[j].childAnswer;
								console.log(childChecked);
								if (childChecked!==undefined) {
									for (var n = 0; n < childChecked.length; n++) {
										childChecked[n].checked=false;
									}
								}
							}
						} 
						return
				}else{
					for (var j = 0; j < values.length; j++) {
							if (values[j].value=='noValue') {
								values[j].checked=false;
							}
						} 
				} 
				if (global.clickNum==0) {
					this.presentCheck=e.detail.value;
					checkTitle=this.presentCheck[0];
				}else{
					if (this.presentCheck.length<=answerValue.length) {//选中
						checkTitle=answerValue[answerValue.length-1];
					}
					this.presentCheck=answerValue;
				}
				global.clickNum+=1;
				//let index=e.currentTarget.dataset.index;
				let value=this.titleArray[0].answerArray;
				for (var i = 0; i < value.length; i++) {
					if (checkTitle==value[i].value) {
						if (value[i].childAnswer[0].title!=='N') {
							value[i].display='block';//显示二级选项弹层
							this.mengcengShow=true;
						}
						break
					}
				}
			},
			//弹出层确定=======================================================================
			childRadioChecked:function(event){
				console.log(event);
				let flag=false;
				let array=event.childAnswer;
				for (var i = 0; i < array.length; i++) {
					if (array[i].checked==true) {
						flag=true;
					}
				}
				if (flag) {
					event.display='none';
					this.mengcengShow=false;
				}
			},
			//子项单选========================================================================
			childChange:function(e,item2){
				//this.disabled=true;
				console.log(e);
				let childAn=e.detail.value;
				let index=e.currentTarget.dataset.index;
				let key=e.currentTarget.dataset.key;
				let value=this.titleArray[index].answerArray[key].childAnswer;
				for (var i = 0; i < value.length; i++) {
					if (value[i].value==childAn) {
						value[i].checked=true
					}else{
						value[i].checked=false
					}
				}
				item2.display='none';
				this.mengcengShow=false;
			},
			//单项选项提交====================================================================
			submitRadio:function(index){
				console.log(global.clickNum);
				let title1=this.titleArray[index].alias;
				let array=this.titleArray[index].answerArray;
				let flag1=false;
				let noValueFlag=true;
				//将整组问题存入数组，历史页调用
				let groupPro=global.groupPro;
				if (groupPro.length==0) {
					if (this.titleArray[0].alias!==undefined) {
						global.groupPro.push(this.titleArray[0]);
					}else{
						for (var i = 0; i < array.length; i++) {
							if (array[i].value!=='noValue') {
								global.groupPro.push(array[i]);
							}
						}
					}
				}else{
					if (this.titleArray[0].alias!==undefined) {
						for (var i = 0; i < groupPro.length; i++) {
							if (groupPro[i].title==this.titleArray[0].title) {
									groupPro.splice(i,1);
								}
							}
							groupPro.push(this.titleArray[0]);
					}else{
						let newArr=[];
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
				//点击多选选项时，需要选择二级病症
				for (var i = 0; i < array.length; i++) {
					if (array[i].checked) {
						let flag=false;
							flag1=true;
						let childValue=array[i].childAnswer;
						if (array[i].value=='noValue') {
							noValueFlag=false;
						}
						if (childValue!==undefined&&childValue.length!==0) {
							for (var n = 0; n < childValue.length; n++) {
								if (childValue[n].checked) {
									flag=true
								}
								if (childValue[n].title=='N') {
									flag=true
								}
							}
							if (flag==false) {
								uni.showModal({
									title: '提示',
									content: '请您选择具体病症',
									showCancel: false,
									confirmText: '确定'
								});
								return 
							}
						}
					}
				}
				if (flag1==false) {
					return
				}else{
					this.titleNumber+=1;
					this.answerNum+=1;
				}
				if (flag1==true&&noValueFlag==true) {
					this.answerIndex+=1;
				}
				let bzidArray=[];//选中一级选项id数组
				for (var i = 0; i < array.length; i++) {
					if (array[i].checked) {
						//this.answerNum=(index+1);
						if (index<this.titleArray.length-1) {
							let whetherUp=array[i].childAnswer;
							if (whetherUp!==undefined) {
								for (var n = 0; n < whetherUp.length; n++) {
									if (whetherUp[n].checked==true&&whetherUp[n].whetherUp==0) {
										this.temporary=false;
										break
									}
								}
							}else{
								if (array[i].whetherUp==0) {
									this.temporary=false;
								}
							}
						}
						//将选中的问题答案存入数组
						var answerarr='';
						console.log(global.groupPro);
						if (this.titleArray[index].answerArray[0].childAnswer==undefined) {
							answerarr={index:this.answerNum,title:title1,answer:array[i].title,value:array[i].value};
						}else{
							let childArr=array[i].childAnswer;
							if (childArr!==undefined) {
								for (var n = 0; n < childArr.length; n++) {
									if (childArr[n].title=='N') {
										answerarr={index:this.answerNum,title:array[i].title,answer:'',value:array[i].value};
										break
									}else if (childArr[n].checked) {
										answerarr={index:this.answerNum,title:array[i].title,answer:childArr[n].title,value:childArr[n].value};
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
							let checkedValue=array[i].childAnswer;
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
						console.log(`已选病症id：${bzidArray}`);
					}else{//如果选项为选中状态：查看答案数组内是否有此选项
						let allAnswer=this.allAnswer;
						for (var n = 0; n < allAnswer.length; n++) {
							if (allAnswer[n].title==array[i].title) {
								allAnswer.splice(n,1);
							}
						}
						//如果未选中，查看对当前选项是否是带n的选项题，是：查看是否有两个n，是:获取反选项，getJg时需要提交反选项
						if (array[i].value!=='noValue'&&array[i].childAnswer!==undefined&&array[i].childAnswer.length==2&&array[i].childAnswer[0].title=='N'&&array[i].childAnswer[1].title=='N') {
							answerarr={index:this.answerNum,title:'此题反选',answer:'',value:array[i].childAnswer[1].value};
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
					global.answerArray=this.allAnswer;
				}
				for (var i = 0; i < array.length; i++) {
					if (array[i].checked&&array[i].value=='noValue') {
						if (this.titleArray[index].isJump==-1&&this.titleArray[index].jumpCon=='null') {
							this.postForm();
						}else if(this.titleArray[index].isJump>0){
							this.getWz(this.bmId,this.titleArray[index].isJump);
						}else{
							this.groupNo+=1
							this.getWz(this.bmId,this.groupNo);
						}
						return
					}
				}
				console.log(global.answerArray);
				this.compare(bzidArray,index);
				console.log(this.answerNum);
			},
			//跳过================================================================================================
			jumpOver:function(){
				let title1=this.titleArray[0].alias;
				let array=this.titleArray[0].answerArray;
				let groupPro=global.groupPro;
				let answerarr={}
				let titleArray=this.titleArray[0];
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
					if (this.titleArray[0].alias!==undefined) {
						global.groupPro.push(this.titleArray[0]);
					}else{
						for (var i = 0; i < array.length; i++) {
							if (array[i].value!=='noValue') {
								global.groupPro.push(array[i]);
							}
						}
					}
				}else{
					if (this.titleArray[0].alias!==undefined) {
						for (var i = 0; i < groupPro.length; i++) {
							if (groupPro[i].title==this.titleArray[0].title) {
									groupPro.splice(i,1);
								}
							}
							groupPro.push(this.titleArray[0]);
					}else{
						let newArr=[];
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
					let bmId=this.bmId;
					this.groupNo+=1;
					this.getWz(bmId,this.groupNo);
				}
			},
			//已选病症与跳转条件比较=================================================================
			compare:function(bzidArray,index){
				let traceStatus=this.titleArray[index].traceStatus;
				if (traceStatus==-1) {
					this.answerNum-=1;
					this.answerIndex-=1;
					this.postForm();
					return
				}
				//将选项id数组与跳转条件数相比较
				let bmId=this.bmId;
				var jumpConArray=[];//跳转条件数组
				let jumpCon=this.titleArray[index].jumpCon.split(',');
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
							let isJump=this.titleArray[index].isJump;
							if (isJump=='null') {
								this.groupNo+=1;
								this.getWz(bmId,this.groupNo);
							}else if(isJump>0){
								let groupNo=isJump;
								this.getWz(bmId,groupNo);
							}else{//isJump==-1:停止问答;调用getJg提交结果
							this.answerNum-=1;
							this.answerIndex-=1;
							//对global.answerArray进行操作:仅保留当前题组之前的数组元素，之后的元素删除掉；
							let newArray=[];
							let arr=global.answerArray;
							for (var i = 0; i < arr.length; i++) {
								if (arr[i].index<=this.answerNum+1) {
									newArray.push(arr[i]);
								}
							}
							global.answerArray=newArray;
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
					let isJump=this.titleArray[index].isJump;
					if (isJump=='null') {
						this.groupNo+=1;
						this.getWz(bmId,this.groupNo);
					}else if(isJump>0){
						let groupNo=isJump;
						this.getWz(bmId,groupNo);
					}else{//isJump==-1:停止问答;调用getJg提交结果
						this.answerNum-=1;
						this.answerIndex-=1;
						//对global.answerArray进行操作:仅保留当前题组之前的数组元素，之后的元素删除掉；
						let newArray=[];
						let arr=global.answerArray;
						for (var i = 0; i < arr.length; i++) {
							if (arr[i].index<=this.answerNum+1) {
								newArray.push(arr[i]);
							}
						}
						global.answerArray=newArray;
						this.postForm();
					}
				}
			},
			//获取病症问题=============================================================================
			getWz:function(bmId,groupNo,traceStatus){
				let _this=this;
				return new Promise(function(resolve,rej){
					global.clickNum=0;//多选框点击次数
					console.log(bmId,groupNo);
					global.getWz(bmId,groupNo).then(res =>{
						console.log(res);
						if (res=='') {
							_this.postForm();
							_this.answerIndex-=1;
							return
						}
						_this.titleArray=[];
						let array=res;
						let obj={};
						let groupArr=[];
						let groupSort=[];
						let answerArr=[];
						let intra_group=[];//组内问题
						let answerArray=[];
						let Array=array.split("%");
						let childArr=[];//子选项数组
						console.log(Array);
						if (Array.length==3) {//Array.length==2此组题为单选题，没有二级选项;
							_this.radioShow=true;
							_this.checkboxShow=false;
							for (var i = 0; i < Array.length-2; i++) { 
										groupArr=Array[i].split('&');
								}
								console.log(groupArr);
								for (var i = 0; i < groupArr.length; i++) {
									intra_group.push(groupArr[i].split('#'));
								}
								console.log(intra_group);
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
									answerArray:[]
									}
								for (var i = 1; i < intra_group.length; i++) {
										answerArr={title:intra_group[i][0],value:intra_group[i][1],checked:false,display:'none',wz_id:intra_group[i][2]};
										answerArray.push(answerArr);
								}
								console.log(obj.isRespond);
								//answerArr={title:'无以上症状',value:'noValue',checked:false,display:'none'};
								//answerArray.push(answerArr);
						}else{//此组题为多选题，有二级选项
							_this.radioShow=false;
							_this.checkboxShow=true;
							for (var i = 0; i < Array.length-2; i++) {
								groupArr.push(Array[i].split('&'));
							}
							console.log(groupArr);
							for (var i = 0; i < groupArr.length; i++) {
								for (var j = 0; j < groupArr[i].length; j++) {
									intra_group.push(groupArr[i][j].split('#'));
								}
								groupSort[i]=intra_group;
								intra_group=[]
							}
							console.log(intra_group);
							console.log(groupSort);
							obj={
								index:_this.answerNum+1,
								traceStatus:traceStatus,
								name:'radio'+_this.titleNumber,
								title:groupSort[0][0][1],
								display:'block',
								jumpCon:Array[Array.length-2].split('&')[1],//跳转条件：与选中的一级选项号比较
								isJump:Array[Array.length-2].split('&')[0],//是否跳转：null下一题；-1：停止；>0:跳转到此题号
								isRespond:Array[Array.length-1],//此题是否可以跳过 0：可以跳过，1：不可以跳过
								answerArray:[]
							}
							console.log(obj.isRespond);
							for (var i = 0; i < groupSort.length; i++) {
								answerArr={value:(groupSort[i][1][0]=='N'?groupSort[i][1][1]:groupSort[i][0][0]),title:groupSort[i][0][2],checked:false,showModal:false,display:'none',wz_id:groupSort[i][1][2],name:'radio'+(i+1)+'-1',
										   childAnswer:[],index:_this.answerNum+1
										  }
								for (var j = 1; j < groupSort[i].length; j++) {
									childArr={title:(groupSort[i][j][0]=='N'?'N':groupSort[i][j][0]),value:groupSort[i][j][1],wz_id:groupSort[i][j][2],checked:false}
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
						console.log(_this.isRespond);
						obj['answerArray']=answerArray;
						_this.titleArray.push(obj);
						console.log(_this.titleArray);
						/* if (_this.titleArray[0].isJump==-1&&_this.titleArray[0].jumpCon=='null') {
							_this.submit_text='提  交'
						}else{
							_this.submit_text='确  认'
						} */
					resolve(obj)
					//获取完问题后如果此组题选中过，默认选中。(在重答状态下)
					_this.sortMxz()
					let arr=global.answerArray;
					let titleArray=_this.titleArray[0].answerArray;
					if (arr.length==0) {
						return
					}
					if (titleArray[0].childAnswer==undefined) {
						for (var i = 0; i < arr.length; i++) {
							for (var j = 0; j < titleArray.length;j++) {
								if (arr[i].answer==titleArray[j].title) {
									titleArray[j].checked=true
									global.clickNum=1;
									break
								}
							}
						}
					}else{
						_this.presentCheck=[];
						for (var i = 0; i < arr.length; i++) {
							for (var n = 0; n < titleArray.length; n++) {
								if (arr[i].title==titleArray[n].title) {
									titleArray[n].checked=true;
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
					})
				})
			},
			//明细证排序 =======================================================================
			sortMxz:function(){
				let num=0;
				let newArr=[];
				let childArr=[];
				let arr=this.titleArray[0].answerArray;
				if (arr[0].childAnswer==undefined&&arr[1].childAnswer==undefined) {
					for (var i = 0; i < arr.length; i++) {
						childArr.push(arr[i].value)
					}
					childArr.sort(function(a,b){
						return a-b
					})
					console.log(childArr);
					for (var i = 0; i < arr.length; i++) {
						for (var j = 0; j < arr.length; j++) {
							if (arr[j].value==childArr[num]) {
								newArr.push(arr[j]);
								num+=1;
								break
							}
						}
					}
					this.titleArray[0].answerArray=newArr;
				}else{
					for (var i = 0; i < arr.length; i++) {
						if (arr[i].value!=='noValue') {
							for (var j = 0; j < arr[i].childAnswer.length; j++) {
								childArr.push(arr[i].childAnswer[j].value); 
							}
							childArr.sort(function(a,b){
								return a-b
							})
							console.log(childArr);
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
				let Jg=uni.getStorageSync('Jg');
				console.log(Jg);
				if (Jg.leftimes==0) {//剩余次数=0
					uni.showModal({
						title: '提示',
						content: Jg[7],
						showCancel: true,
						cancelText: '取消',
						confirmText: '确定',
						success: res => {
							if (res.confirm) {//跳转小程序
								let hydj=Jg[4];//获取会员等级
								if (hydj==0) {//不是会员
									global.up().then(res =>{//去易一健康首页授权手机号
										
									}).catch(err =>{//取消跳转则跳转至结果页
										uni.redirectTo({
											url: '/pages/result/result?status=0'
										});
									});
								}else{//是会员
									let path='/pageD/mine/vip/vip'
									global.up(path).then(res =>{//去易一健康首页授权手机号
										
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
					let answer='';
					let array=global.answerArray;
					let userId=uni.getStorageSync('UnionId');
					let bmId=this.bmId;
					console.log(array);
					for (var i = 0; i < array.length; i++) {
						if (array[i].value!=='') {
							answer+=','+array[i].value
						}
					}
					let answerString=answer.substr(1);
					console.log(answerString);
					uni.showLoading({
						title: '正在提交...',
						mask: false
					});
					global.getJg(answerString,userId,bmId).then(res =>{
						uni.hideLoading();
						console.log(res);
						let data=res.data;
						/* let result=data.split('#');
						if (result.length==0||data=='') {
							uni.showToast({
								title: '服务器内部错误'
							});
						}else if(result.length==3){
							global.flag=result[2];
							this.getWz(this.bmId,result[0],result[1]);
						}else{
							uni.setStorageSync('saveShow',true);
							uni.setStorageSync('answerArray',global.answerArray);
							uni.navigateTo({
								url: `/pages/result/result?status=0`,
							});
						} */
						var result=res.data;
						if (JSON.stringify(result) == '{}' ) {
							uni.showToast({
								title: '服务器内部错误'
							});
						}else if(result.jump!==undefined){
							let jump=result.jump.split('#');
							global.flag=jump[2];
							this.getWz(this.bmId,jump[0],jump[1]);
						}else{
							uni.navigateTo({
								url: `/pages/result/result?status=0`,
							});
						}
					});
				}
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
		font-size: 32rpx;
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
		font-size: 34upx;
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
	left: 5%;
	width: 160%;
	top: 214upx;
	/* height: 42%; */
	overflow: auto;
	padding: 20rpx;
	padding-top: 0rpx;
	position: absolute;
	border-radius: 6rpx;
	/* border: 2rpx solid #CCCCCC; */
	}
	.checked_child{
		font-size: 32upx;
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
		padding: 20upx;
		padding-top: 0upx;
		padding-right: 0upx;
		padding-bottom: 34upx;
		border-top-left-radius: 10upx;
		border-top-right-radius: 10upx;
	}
	.child_label{
		font-size: 32upx;
		line-height: 2.5;
		/* text-align: left; */
		display: block;
		padding-right: 0upx;
	}
	.radio{
		font-size: 32upx;
		/* display: block; */
		line-height: 2;
		padding-right: 0upx;
	}
	.child_radio{
		/* clear: right;
		float: right; */
		transform: scale(0.8);
	}
	.radio_title{
		font-weight: 700;
		font-size: 32upx;
		/* font-family: kaiti; */
	}
	.close_Btn{
		height: 60upx;
		color: #FFFFFF;
		padding: 0rpx;
		line-height: 1.7;
		vertical-align: middle;
		padding-left: 20upx;
		padding-right: 20upx;
		font-size: 34rpx;
		border-radius: 6rpx;
		background: #A6803F;
	}
	.jump_Btn{
		color: #000;
		font-size: 32rpx;
		font-style: italic;
		font-weight: 700;
		text-decoration:underline;
	}
	.close_btn_hover{
		background: #f6daaa;
	}
	.submit_view{
		position:fixed;
		bottom: 210upx;
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
		font-size: 32rpx;
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
		font-size: 32upx;
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
