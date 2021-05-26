<template>
	<view class="pageall">
		<view class="" style="height: 40upx;"></view>
		<view class="head"></view>
		<view class="body">
			<view class="problem_title">已答历史：</view>
			<view class="" style="padding-left: 40upx;padding-right: 30upx;">
				<view class="uni-flex uni-row" v-for="(item,index) in proArr" :key='index' :style="{'margin-top':firstView(index)}">
					<view style="width: 85%;">
						<view class="pro_title"><text>{{item.titNum}}、</text>{{item.title}}</view>
						<view class="problem" :style="{display:item.answer=='null'?'none':'block'}"> {{item.answer==''?'无':item.answer}}</view>
					</view>
					<view class="againAnswer" @tap="again(index)">重答</view>
				</view>
			</view>
		</view>
		<view class="foot"></view>
		<!-- 重答弹层 -->
		<view class="modal_view" v-show="mengcengShow">
			<view class="uni-mask" v-show="mengcengShow"></view><!--  -->
			<view class="child_view">
				<view class="child_head">
					<text class="modal_close" @click.stop="closeModal()">&#xe677;</text>
				</view>
				<view class="child_body">
					<view class="options_title">{{answerArray.title}}</view>
					<view class="options_view">
						<radio-group name="" @change="againRadio($event,answerArray.answer)">
							<label class="option_label" v-for="(item,index) in answerArray.answer" :key="index" :style="{display:item.title=='是'&&index==1?'none':item.title=='是'||item.title=='否'?'inline-block':'block'}">
								<radio :value="item.value" :checked="item.checked" style="display: none;"/>
								<text class="option_text" :class="index==current?'checkbox_checked':''">{{item.title}}</text>
							</label>
						</radio-group>
					</view>
				</view>
				<view class="uni-row uni-flex modal_foot">
					<view class="modal_btn" @tap="closeModal()">取消</view>
					<view style="border-left: 2upx solid #CCCCCC;"></view>
					<view class="modal_btn" @tap="confirm(item)">确定</view>
				</view>
			</view>
		</view>
		<view class="">
			<button type="default" class="close_historyBtn" hover-class="close_btn_hover" @tap="closeHistory">关&nbsp;&nbsp;闭</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				proArr:[],
				questionArray:[],
				mengcengShow:false,
				answerArray:{},
				current:-1,
				radioValue:-1,
				indexClick:-1,
				problemIndex:-1
			}
		},
		onLoad() {
			let obj={};
			let num=0;
			let proArr=global.groupPro;
			for (var i = 0; i < proArr.length; i++) {
				let child=proArr[i].childAnswer;
				if (child==undefined) {
					obj={
						titNum:num+=1,
						title:proArr[i].alias,
						answer:'',
						value:'',
						groupNum:proArr[i].groupNum
					}
					for (var j = 0; j < proArr[i].answerArray.length; j++) {
						if (proArr[i].answerArray[j].checked==true) {
							obj['answer']=proArr[i].answerArray[j].title;
							obj['value']=proArr[i].answerArray[j].value;
							break
						}
					}
				}else{
					obj={
						titNum:num+=1,
						title:proArr[i].title,
						answer:'',
						value:'',
						groupNum:proArr[i].groupNum
					}
					for (var j = 0; j < proArr[i].childAnswer.length; j++) {
						if (proArr[i].childAnswer[j].title=='N') {
							if (proArr[i].checked==true) {
								obj['answer']='null';
								obj['value']=proArr[i].childAnswer[j].value;
							}else{
								obj['answer']='';
							}
						}else if(proArr[i].childAnswer[j].checked==true){
							obj['answer']=proArr[i].childAnswer[j].title;
							obj['value']=proArr[i].childAnswer[j].value;
						}
						/* if (proArr[i].childAnswer[j].checked==true) {
							if (proArr[i].childAnswer[j].title=='N') {
								obj['answer']='null';
							}else{
								obj['answer']=proArr[i].childAnswer[j].title
							}
						} */
					}
				}
				this.proArr.push(obj);
			}
				console.log(this.proArr);
			/* for (var i = 0; i < array.length; i++) {
				array[i].titNum=++num;
			}
			console.log(global.answerArray); */
			this.questionArray=global.answerArray;
		},
		computed: {
			firstView(index){
				return function(index){
					if (index==0) {
						return '40px'
					}else{
						return '5px'
					}
				}
			}
		},
		methods: {
			//重答======================================================================================
			again:function(index){
				console.log(index);
				console.log('shuzu',this.answerArray);
				this.indexClick=index;
				global.clickNum=0;
				this.mengcengShow=true;
				let problemIndex=global.groupPro[index].index;
				this.problemIndex=problemIndex;
				let answer=global.groupPro[index];
				if (answer.alias!==undefined) {
					this.answerArray.title=answer.alias;
					this.answerArray.answer=answer.answerArray;
				}else{
					this.answerArray.title=answer.title;
					this.answerArray.answer=answer.childAnswer;
				}
				//设置默认选中效果
				let answerArray=this.answerArray.answer;
				for (var i = 0; i < answerArray.length; i++) {
					if (answerArray[i].checked) {
						this.current=i;
						this.radioValue=answerArray[i].value;
					}
				}
				console.log(this.answerArray);
				/* uni.setStorageSync('problemIndex',problemIndex); */
				/* uni.navigateBack({
					delta: 1
				}); */
			},
			//关闭弹层===================================================================================
			closeModal:function(){
				this.current=-1;
				this.answerArray.title='';
				this.answerArray.answer=[];
				this.mengcengShow=false;
			},
			//重答单选==========================================================================================
			againRadio:function(e,item){
				console.log(e);
				console.log(item);
				for (var i = 0; i < item.length; i++) {
					if (e.detail.value==item[i].value) {
						this.current=i
						this.radioValue=e.detail.value;
						break
					}
				} 
			},
			//弹层确定事件===============================================================================
			confirm:function(item){
				let value=this.radioValue;
				let answer=this.answerArray.answer;
				let global_answer=this.proArr[this.indexClick];
				///修改选中值
				for (var i = 0; i < answer.length; i++) {
					if (answer[i].value==value) {
						answer[i].checked=true;
					}else{
						answer[i].checked=false;
					}
				}
				//提取本次选中值
				/* for (var i = 0; i < this.proArr.length; i++) {
					if (this.proArr[i].groupNum==answer[0].groupNum&&this.proArr[i].value!=='no') {
						answerString+=','+this.proArr[i].value;
					}
				} */
				let newAnswer={};
				//获取本次选中的选项
				for (var i = 0; i < answer.length; i++) {
					if (answer[i].checked) {
						newAnswer=answer[i];
						newAnswer.caption=this.answerArray.title;
						if (answer[i].title=='否'&&answer.length==3) {//反选题的值
							newAnswer.value=answer[1].value;
						}
					}
				}
				
				//查找当前重答的所在组
				let titleArray=[];
				let groupTitleArray=global.titleArray;
				for (var i = 0; i < groupTitleArray.length; i++) {
					if (groupTitleArray[i].groupNum==answer[0].groupNum) {
						titleArray=groupTitleArray[i];
						break
					}
				}
				//提取本次选中所在组的所有选中值
				let answerString='';
				let firstClass=titleArray.answerArray;
				if (titleArray.alias==undefined) {
					for (var i = 0; i < firstClass.length; i++) {
						for (var j = 0; j < firstClass[i].childAnswer.length; j++) {
							if (firstClass[i].childAnswer[j].checked&&firstClass[i].childAnswer[j].value!=='no') {
								answerString+=','+firstClass[i].childAnswer[j].value;
							}
						}
					}
				}else{
					for (var i = 0; i < firstClass.length; i++) {
						if (firstClass[i].checked) {
							answerString+=','+firstClass[i].value;
						}
					}
				}
				answerString=answerString.substr(1);
				console.log('本组选中值',answerString);
				this.compare(answerString.split(','),titleArray,newAnswer);
				this.mengcengShow=false;
			},
			//关闭页面====================================================================================================
			closeHistory:function(){
				uni.navigateBack({
					delta:1 
				});
			},
			//已选症状已跳转条件比较====================================================================================
			compare:function(bzidArray,titleArray,newAnswer){
				//将选项id数组与跳转条件数相比较
				let isJump=titleArray.isJump;//是否跳转
				let jumpCon=titleArray.jumpCon;//跳转条件
				if (jumpCon!=='null') {
					if (jumpCon==bzidArray.toString()) {//如果相等说明完全匹配,判断isJump值：null正常提交调用getWz方法进入下一题；-1直接提交结果调用getJg方法；>0根据题号提交调用getWz
						if (isJump=='null') {//此时说明重答后，未满足跳转条件，将重答值存入global.answerArray，流程完毕
							console.log('不满足跳转条件');
							this.modifyAnswer();//修改最终答案数组
							this.modifyChecked();//修改历史页选中值
						}else if(isJump>0){
							console.log('需要跳题');
							uni.showModal({
								title: '提示',
								content: '当前选项影响后续问答，是否确认修改',
								showCancel: true,
								cancelText: '取消',
								confirmText: '确认',
								success: res => {
									if (res.confirm) {
										this.modifyChecked();//修改历史页选中值
										this.deleteProArr(newAnswer);//删除历史页后续答案与标题
										this.modifyAnswer(newAnswer);//修改最终答案数组
										this.deleteAnswer(titleArray);//删除最终答案后续
										this.modifyTitleNum(newAnswer);//修改题号
										uni.setStorageSync('problemIndex',isJump);
									}else if(res.cancel){
										console.log('取消跳题');
									}
								},
							});
						}else{//isJump==-1:停止问答;
						//对global.answerArray进行操作:仅保留当前题组之前的数组元素，之后的元素删除掉；
						console.log('停止问答');
						uni.showModal({
							title: '提示',
							content: '当前选项修改后将结束问答，是否确认修改',
							showCancel: true,
							cancelText: '取消',
							confirmText: '确认',
							success: res => {
								if (res.confirm) {
									console.log('确认');
									this.modifyChecked();//修改历史页选中值
									this.deleteProArr(newAnswer);//删除历史页后续答案与标题
									this.modifyAnswer(newAnswer);//修改最终答案数组
									this.deleteAnswer(titleArray);//删除后续答案
								}else if(res.cancel){
									console.log('取消');
								}
							}
						});
						}
					}else{//此时说明重答后，未满足跳转条件，将重答值存入global.answerArray，流程完毕
						console.log('不满足跳转条件');
						this.modifyAnswer(newAnswer);//修改最终答案数组
						this.modifyChecked();//修改历史页选中值
					}
				}else{
					if (isJump=='null') {//此时说明重答后，未满足跳转条件，将重答值存入global.answerArray，流程完毕
						console.log('不满足跳转条件');
						this.modifyAnswer(newAnswer);//修改最终答案数组
						this.modifyChecked();//修改历史页选中值
					}else if(isJump>0){//跳转至此题
					console.log('需要跳题');
						uni.showModal({
							title: '提示',
							content: '当前选项影响后续问答，是否确认修改',
							showCancel: true,
							cancelText: '取消',
							confirmText: '确认',
							success: res => {
								if (res.confirm) {
									console.log('确认跳题');
									this.modifyChecked();//修改历史页选中值
									this.deleteProArr(newAnswer);//删除历史页后续答案与标题
									this.modifyAnswer(newAnswer);//修改最终答案数组
									this.deleteAnswer(titleArray);//删除后续答案
									this.modifyTitleNum(newAnswer);//修改题号
									uni.setStorageSync('problemIndex',isJump);
								}else if(res.cancel){
									console.log('取消跳题');
								}
							},
						});
					}else{//isJump==-1:停止问答;
						//对global.answerArray进行操作:仅保留当前题组之前的数组元素，之后的元素删除掉；
						console.log('最后一题停止问答');
						uni.showModal({
							title: '提示',
							content: '当前选项修改将结束问答，是否确认修改',
							showCancel: true,
							cancelText: '取消',
							confirmText: '确认',
							success: res => {
								if (res.confirm) {
									console.log('确认停止问答');
									this.modifyChecked();//修改历史页选中值
									this.deleteProArr(newAnswer);//删除历史页后续答案与标题
									this.modifyAnswer(newAnswer);//修改最终答案数组
									this.deleteAnswer(titleArray);//删除后续答案
								}else if(res.cancel){
									console.log('取消停止问答');
								}
							}
						});
					}
				}
				this.mengcengShow=false;
				this.answerArray.title='';
				this.answerArray.answer=[];
			},
			//删除最终答案数组后续===============================================================================================
			deleteAnswer:function(titleArray){
				let newArray=[];
				let arr=global.answerArray;
				for (var i = 0; i < arr.length; i++) {
					if (arr[i].groupNum<=titleArray.groupNum||arr[i].Inverse) {
						newArray.push(arr[i]);
					}
				}
				global.answerArray=newArray;
				console.log('删除后最终答案数组',global.answerArray);
				this.postForm();
			},
			//修改最终答案案数组=====================================================================================
			modifyAnswer:function(newAnswer){
				let num=0;
				let groupAnswer=global.answerArray;//所有已回答的问题数组
				for (var i = 0; i < groupAnswer.length; i++) {
					if (groupAnswer[i].title==newAnswer.caption) {
						groupAnswer[i].value=newAnswer.value;
						groupAnswer[i].answer=newAnswer.title;
						break
					}else{
						num+=1;
					}
				}
				//新增最终答案数组
				if (num==groupAnswer.length) {
					let obj={
						answer:newAnswer.title,
						groupNum:newAnswer.groupNum,
						title:newAnswer.caption,
						value:newAnswer.value,
					}
					groupAnswer.push(obj);
				}
				console.log('修改后答案数组：',groupAnswer);
			},
			//修改历史页选中值================================================================================================
			modifyChecked:function(){
				let value=this.radioValue;
				let answer=this.answerArray.answer;
				let global_answer=this.proArr[this.indexClick];
				///修改选中值
				for (var i = 0; i < answer.length; i++) {
					if (answer[i].value==value) {
						global_answer.answer=answer[i].title;
						global_answer.value=answer[i].value;
					}
				}
				console.log('修改后历史页数组：',this.proArr);
			},
			//删除历史页后续答案与标题==============================================================================================
			deleteProArr:function(newAnswer){
				for (var i = 0; i < this.proArr.length; i++) {
					if (this.proArr[i].groupNum>newAnswer.groupNum||!this.proArr[i].Inverse&&this.proArr[i].Inverse!==undefined) {
						this.proArr.splice(i,1);
						i-=1;
					}
				}
				console.log('删除后历史页数组',this.proArr);
			},
			//确认重答后修改题号========================================================================================================
			modifyTitleNum:function(newAnswer){
				let answerArray=[];
				let answer=global.answerArray;
				for (var i = 0; i < answer.length; i++) {
					if (newAnswer.groupNum==answer[i].groupNum) {
						answerArray.push(answer[i])
					}
				}
				global.serialNumber=answerArray[0].titleNum;
				console.log(global.serialNumber);
			},
			//提交答案===============================================================================================================
			postForm:function(){
				if (!global.functionFlag) {
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
										
									});
								}
							}
						}
					});
					return
				}
				var answer='';
				var array=global.answerArray;
				var userId=uni.getStorageSync('UnionId');
				var bmId=1;
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
					var result=res.data;
					if(result.jump!==undefined){
						let jump=result.jump.split('#');
						global.flag=jump[2];
						let obj={
							groupNo:jump[0],
							traceStatus:jump[1]
						}
						uni.setStorageSync('jumpTitle',obj);
						uni.navigateBack({
							delta: 1
						});
					}else{
						uni.reLaunch({
							url: `/pages/result/result?status=0`,
						});
					}
					//重新查询剩余次数
					global.getUserCtrl(6);
				})
			}
		}
	}
</script>

<style scoped>
	.pageall{
		height: 100%;
		padding: 0rpx;
		background-size: 100% 100%; 
		background-image: url('~@/static/background.jpg'); 
	}
	.head{
		height: 100rpx;
		background-size: 100% 100%;
		background-repeat:no-repeat;
		background-image: url('~@/static/history/background1.png');
	}
	.body{
		overflow: auto;
		-webkit-overflow-scrolling:touch;
		font-weight: 700;
		min-height: 34%;
		max-height: 67%;
		padding: 0rpx 30rpx;
		/* font-family: cursive; */
		position: relative;
		background-size: 100% 100%;
		background-repeat:no-repeat;
		background-image: url('~@/static/history/background2.png');
	}
	.foot{
		height: 100rpx;
		background-size: 100% 100%;
		background-repeat:no-repeat;
		background-image: url('~@/static/history/background3.png');
	}
	.close_historyBtn{
		color: #FFFFFF;
		width: 22%;
		padding: 0rpx;
		line-height: 1.6;
		margin-top: 36rpx;
		border-radius: 6rpx;
		background: rgb(166,128,63);
	}
	.problem_title{
		width: 85%;
		line-height: 2.5;
		position:fixed;
		padding-left: 40upx;
		background: #ecd9ae;
	}
	.problem{
		line-height: 2;
		font-weight:500 ;
		padding-left: 50upx;
	}
	.pro_title{
	}
	.againAnswer{
		width: 15%;
		line-height: 2;
		font-weight: 500;
		text-align: center;
		text-decoration: underline;
	}
	.close_btn_hover{
		background: #f6daaa;
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
	.modal_view{
		
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
	.options_title{
		font-weight: 700;
		margin-left: 20upx;
	}
	.options_view{
	}
	.option_label{
		margin: 20upx;
		display: block;
	}
	.checkbox_checked{
		color: #FFFFFF;
		background: #A6803F;
		border: 1px solid #A6803F;
	}
	.option_text{
		padding: 4upx 20upx;
		border-radius: 6upx;
		border: 1upx solid #9C9C9C;
	}
	.child_label{
		line-height: 2.5;
		/* text-align: left; */
		display: block;
		padding-right: 0upx;
	}
	.modal_foot{
		width: 100%;
		border-top: 2upx solid #CCCCCC !important;
	}
	.modal_btn{
		width: 49.5%;
		line-height:2;
		text-align: center;
	}
	button::after{
		border: 0upx;
	}
</style>
