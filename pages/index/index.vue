<template>
	<view class="pageall" style="height: 100%;">
		<!-- 首页模板 --> 
		<view class="logo_view">
			<image src="/static/indexBackground.png" mode="" class="logo_top"></image>
			<image class="logo" src="/static/kuaihao.png"></image>
		</view>
		<view class="text_view">
			<text class="title">{{title}}</text>
		</view>
		<view class="uni-flex uni-row select_view">
			<text>请选择：</text>
			<view class="picker_view">
				<picker mode="selector" :value="index" :range="selectArray" @change="selectChange" :range-key="'bm'">
					<view class="select_text">{{selectArray[index].bm}}</view>
					<view class="down"><text class="jtDown">&#xe6df;</text></view>
				</picker> 
			</view>
		</view>
		<!-- 病名说明 -->
		<view class="bmExplain">
			<text>{{selectArray[index].bmExplain}}</text>
		</view>
		<view class="submit_view">
			<!-- <button size="default" hover-class="green" class="startBtn" v-else @tap="navigator">开始测试</button> -->
			<button size="default" hover-class="green" class="startBtn" @tap="navigator">开始测试</button>
			<button class="oldUser" v-if="oldStatus" size="mini"  @tap="oldUserInto">老用户进入</button>
		</view>
		<!-- <view class="intoTest" @tap="intoTest">
			<text>进入测试页</text>
		</view> -->
		<!-- 弹出框 -->
		<modals :show="modalShow" type="skipHint">
			<view class="modal_hd">
				<text>提示</text>
			</view>
			<view class="modal_bd">
				<text>您是会员，可以进入易一健康主程序使用此功能，并发现更多。</text>
			</view>
			<view class="modal_ft uni-row uni-flex">
				<button class="modal_cancel"  @tap="dontInto">不进入</button>
				<button class="modal_confirm" @tap="skip">进入主程序</button>
			</view>
		</modals>
	</view>
</template>
<!-- :style="{'background-image':'url('+imageURl+')'}" -->
<script>
	import * as api from '@/common/API.js';
	import modals from'@/components/modal.vue';
	import helper from '@/common/helper.js';
	import {ajax}   from '@/common/ajax.js';
	export default {
		components:{
			modals
		},
		data() {
			return {
				selected:'',
				index:0,
				selectArray: [],
				bmId:0,
				title: '',
				imageURl:'/static/indexBackground1.png',
				oldStatus:false,
				modalShow:false,
				bmExplain:'',
				type:null
			}
		},
		onLoad(e) {
			this.type=e.type;
			global.getGnTitle().then(res =>{
				this.title=res
			}).catch(err =>{
				uni.showToast({
					title: '网络连接失败',
					icon: 'none'
				});
				return
			})
			global.getBm().then(res =>{
				console.log(res);
				let array=res.data;
				var arr=[];
				for(let i in array){
					var bm=array[i].split("#");
					if (bm[2]!=='') {
						var bmObj={
							bm:bm[0],
							status:bm[1],
							title:bm[2],
							bmExplain:(bm[3]==null?'':bm[3])
						}
					}else{
						var bmObj={
							bm:bm[0],
							status:bm[1],
							title:bm[2],
							bmExplain:(bm[3]==null?'':bm[3])
						}
					}
					arr.push(bmObj);
				}
				this.selectArray=arr;
				console.log(arr);
			}).catch(err =>{
				uni.showToast({
					title: '网络连接失败',
					icon: 'none'
				});
			})
		},
		onShow() {
			console.log('indexOnShow');
			uni.hideHomeButton();
			var nickName=uni.getStorageSync('nickName');
			if (nickName==""||nickName==undefined||nickName==null) {
				this.oldStatus=true;
			}else{
				this.oldStatus=false;
			}
		},
		methods: {
			intoTest:function(){
				let bmId=this.bmId;
				global.answerArray=[];
				uni.navigateTo({
					url: '/pages/inquiry/inquiry-copy?bmId='+bmId,
				});
			},
			//选择病名
			selectChange:function(e){
				console.log(e);
				let value=e.detail.value;
				if (this.selectArray[value].status=='0') {
					uni.showModal({
						title: '提示',
						content: this.selectArray[value].title,
						showCancel: false,
						confirmText: '确定',
					});
					return
				}
				this.bmId=value;
				this.index=value;
			},
			/* 开始测试：先判断登录状态，登陆未过期：判断剩余次数，>0：跳转至测试页；=0：提示升级或认证；登录已过期：先登录再判断*/
			navigator:function(){
				global.flag=0;
				let bmId=this.bmId;
				global.answerArray=[];
				//判断剩余次数=0
				this.detection(bmId);
			},
			/*老用户进入 */
			oldUserInto:function(e){
				global.getUserProfile().then(res =>{//授权个人信息
					if (res) {
						//老用户登录完成后有四种情况：是会员也是老用户；是会员不是老用户；不是会员是老用户；不是会员也不是老用户；
						let UnionId=uni.getStorageSync('UnionId');
						var isVip=0;
						var oldUser='';
						global.isPhoneNumber().then(data =>{
							isVip=data;
							console.log(isVip);
							//检测是否有测算结果
							global.getResult().then(data2=>{
								oldUser=data2;
								console.log(oldUser);
								if (isVip==2&&oldUser!=='') {//是会员也是老用户（提示跳转易一健康）
									this.modalShow=true;
									this.oldStatus=false;
								}else if(isVip==2&&oldUser==''){//是会员不是老用户（提示跳转易一健康）
									this.modalShow=true;
									this.oldStatus=false;
								}else if(isVip==1&&oldUser!==''){//不是会员是老用户(跳转结果页)
								console.log('跳转结果页');
									uni.redirectTo({
										url: '/pages/result/result?status=0',
									});
								}else if(isVip==1&&oldUser==''){//不是会员也不是老用户(停留在首页，隐藏老用户按钮)
									this.oldStatus=false;
									uni.showModal({
										title: '提示',
										content: '没有查询到您的历史记录，请点击开始测试，进行评测',
										showCancel: false,
										confirmText: '确定'
									}); 
								}
							})
						})
					}
				})
			},
			//不跳转，检查是否有结果
			dontInto:function(){
				this.modalShow=false;
				global.getResult().then(res =>{
					if (res=='') {//没结果，停留在首页
						this.oldStatus=false;
					}else{//有结果，跳转至结果页
						uni.redirectTo({
							url: '/pages/result/result?status=0'
						}); 
					}
				})
			},
			/**
			 * 是会员也是老用户 是会员不是老用户
			 *   *跳转小程序
			 * 		*允许：跳转
			 * 		*取消：判断是否有结果：
			 * 			*有：跳转结果页；
			 * 			*没有：停留在首页，隐藏老用户按钮
			 */
			skip:function(){
				this.modalShow=false;
				let path='';
				let type='none';
				global.up(path,type).then(data =>{//成功跳转至指定页面
					console.log(data);
				}).catch(err =>{//取消跳转
					global.getResult().then(res =>{//有结果
						if (res=='') {//没结果，停留在首页
							this.oldStatus=false;
						}else{//有结果，跳转至结果页
							uni.redirectTo({
								url: '/pages/result/result?status=0'
							});
						}
					})
					console.log(err);
				})
			},
			/* 判断用户使用次数 */
			detection:function(bmId){
				//调用接口，判断使用次数
				var gnid=null;
				var bmId=parseInt(bmId);
				switch (bmId){
					case 0:
						gnid=6;
						break;
					case 1:
						gnid=8;
						break;
					case 2:
						gnid=7;
					default:
						break;
				}
				global.getUserCtrl(gnid).then(res =>{
					if (!res) {
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
									global.up(path,type).then(res =>{//去易一健康
										
									}).catch(err =>{//取消跳转则跳转至结果页
										/* uni.redirectTo({
											url: '/pages/result/result?status=0'
										}); */
									});
								}else if(res.cancel){//跳转至结果页
									/* uni.redirectTo({
										url: '/pages/result/result?status=0'
									}); */
								}
							}
						});
					}else{
						//剩余次数>0
						uni.reLaunch({
							url: '/pages/inquiry/inquiry-copy?bmId='+bmId,
						});
					}
				})
			}
		}
	}
</script>

<style scoped>
	page{
		height: 100%
	}
	.pageall{
		 background-image:url('~@/static/backgroundwenlu2.png');
	}
	.intoTest{
		text-align: center;
		margin-top: 20upx;
		text-decoration: underline;
	}
	.logo_top{
		width: 100%;
		height: 100%;
	}
	.logo_view{
		height: 35%;
		position: relative;	
	}
	.logo {
		top: 10%;
		width: 50%;
		right: 25%;
		height: 80%;
		position: absolute;
	}
	.title {
		/* color: #276b52; */
		text-indent: 1em
	}
	.bmExplain{
		text-align: justify;
		margin-top: 20upx;
		padding: 0upx 30upx;
	}
	.startBtn{
		width: 60%;
		color: #FFFFFF;
		line-height: 2;
		border-radius: 40upx;
		margin-bottom: 10upx;
		background: #276b52;
	}
	.text_view{
		text-align: justify;
		/* text-indent: 1rem; */
		margin-top: 30upx;
		padding: 0upx 30upx;
	}
	.select_view{
		color: #276B52;
		margin-top: 20upx;
		padding-left: 20%;
	}
	.picker_view{
		width: 40%;
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
		color: #000000;
		display: inline;
	}
	.submit_view{
		text-align: center;
		margin-top: 60upx;
		padding: 0upx 30upx;
	}
	.oldUser{
		color: #276B52;
		font-size: 34upx;
		text-decoration: underline;
		border-style:none;
		background-color:transparent;
	}
	.oldUser::after{
		border: 0upx;
	}
	.green{
		background: #36886a !important;
	}
	/*  */
	.modal_hd{
		font-size: 36upx;
		text-align: center;
		line-height: 2;
	}
	.modal_bd{
		color: #9c9c9c;
		height: 140upx;
		padding-left: 50upx;
		padding-right: 50upx;
	}
	.modal_ft{
		border-top: 2upx solid #CCCCCC;
	}
	.modal_confirm{
		width: 50%;
		color: rgb(89, 125, 165);
		font-weight: 700;
		background: #FFFFFF;
		border-radius: 0upx;
		border-left: 1upx solid #CCCCCC;
	}
	.modal_cancel{
		color: #9C9C9C;
		width: 50%;
		font-weight: 700;
		background: #FFFFFF;
		border-radius: 0upx;
	}
	button::after{
		border: 0upx;
	}
	/*  */
</style>
