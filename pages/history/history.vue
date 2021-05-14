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
				answerArray:[]
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
						answer:''
					}
					for (var j = 0; j < proArr[i].answerArray.length; j++) {
						if (proArr[i].answerArray[j].checked==true) {
							obj['answer']=proArr[i].answerArray[j].title;
							break
						}
					}
				}else{
					obj={
						titNum:num+=1,
						title:proArr[i].title,
						answer:''
					}
					for (var j = 0; j < proArr[i].childAnswer.length; j++) {
						if (proArr[i].childAnswer[j].title=='N') {
							if (proArr[i].checked==true) {
								obj['answer']='null';
							}else{
								obj['answer']='';
							}
						}else if(proArr[i].childAnswer[j].checked==true){
							obj['answer']=proArr[i].childAnswer[j].title
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
			/* for (var i = 0; i < array.length; i++) {
				array[i].titNum=++num;
			}
			console.log(global.answerArray); */
			this.answerArray=global.answerArray;
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
			//重答
			again:function(index){
				console.log(index);
				global.clickNum=0;
				let problemIndex=global.groupPro[index].index;
				uni.setStorageSync('problemIndex',problemIndex);
				uni.navigateBack({
					delta: 1
				});
			},
			//关闭页面
			closeHistory:function(){
				uni.navigateBack({
					delta:1 
				});
			}
		}
	}
</script>

<style scoped>
	.pageall{
		padding: 0rpx;
		height: 100%;
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
		font-weight: 700;
		min-height: 34%;
		max-height: 67%;
		font-size: 32rpx;
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
		font-size: 32rpx;
		border-radius: 6rpx;
		background: rgb(166,128,63);
	}
	.problem_title{
		width: 85%;
		line-height: 2.5;
		position:fixed;
		font-size: 32rpx;
		padding-left: 40upx;
		background: #ecd9ae;
	}
	.problem{
		line-height: 2;
		font-weight:500 ;
		font-size: 32upx;
		padding-left: 50upx;
	}
	.pro_title{
		font-size: 32upx;
	}
	.againAnswer{
		width: 15%;
		line-height: 2;
		font-weight: 500;
		text-align: center;
		font-size: 32rpx;
		text-decoration: underline;
	}
	.close_btn_hover{
		background: #f6daaa;
	}
	button::after{
		border: 0upx;
	}
</style>
