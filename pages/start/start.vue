<template>
	<view style="height: 100%;">
		<image class="background" src="/static/start/huanying.jpg" mode=""></image>
		<view class="footer">
			<text>©易一健康管理咨询（天津）有限公司&#12288;2019</text>
		</view>
		<modal :show="modalShow" type="skipHint">
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
		</modal>
	</view>
</template>

<script>
	import {ajax} from '@/common/ajax.js';
	import * as api from '@/common/API.js';
	import helper from '@/common/helper.js';
	import modal  from '@/components/modal.vue'
	export default {
		components:{
			modal
		},
		data() {
			return {
				modalShow:false
			}
		},
		onLoad() {
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			let UnionId = uni.getStorageSync('UnionId'); //获取用户UnionId
			console.log('用户UnionId:  ' + UnionId);
			if (UnionId !== ''&&UnionId!==null&&UnionId!==undefined) { //如果用户UnionId不为空，检查登录状态是否过期
				console.log('有 UnionId');
				uni.checkSession({
					//登录状态未过期 先判断是否是会员；是会员：提示跳转易一健康？是：跳转；否：检查用户时是否有测算结果：有：跳转结果页；没有：跳转至首页；不是会员：检查用户时是否有测算结果：有：跳转结果页；没有：跳转至首页
					success: res => { 
						console.log('登录状态未过期');
						global.getUserCtrl(6);//查询次数
						global.isUpdateCode();
						global.getTokenStatus=false;
						var nickName=uni.getStorageSync('nickName');
						if (nickName==''||nickName==undefined) {
							global.loginStatus=true;
						}
						//是否是会员
						global.isPhoneNumber().then(data=>{
							if (data==2) {//返回结果是2：有手机号；1：有此用户没有手机号；
								this.modalShow=true;
							}else{
								console.log('不是会员');
								global.getResult().then(res =>{
									if (res == "") {
										console.log('登录状态未过期，但没有测算结果');
										setTimeout(function() {
											uni.reLaunch({
												url: '/pages/index/index?type=1',
											});
										}, 2000);
									} else {
										console.log('登录状态未过期，有测算结果');
										setTimeout(function() {
											uni.reLaunch({
												url: '/pages/result/result?status=0',
											});
										}, 2000);
									}
								});
							}
						})
					},
					fail: err => { //登录状态已过期 重新登陆
						console.log('登录状态已过期');
						global.loginStatus=true;
						uni.clearStorageSync()
						global.getUnionId();//静默登录
						setTimeout(function() {
							uni.reLaunch({ 
								url: '/pages/index/index?type=0',
							});
						}, 1000);
					}
				})
			} else { //用户UnionId为空 
				console.log('没有UnionId');
				uni.clearStorageSync();
				global.loginStatus=true;
				global.getUnionId();//静默登录
				setTimeout(function() {
					uni.reLaunch({
						url: '/pages/index/index?type=0',
					});
				}, 1000);
			}
		},
		methods: {
			//不跳转，检查是否有结果
			dontInto:function(){
				this.modalShow=false;
				global.getResult().then(res =>{
					if (res == "") {
						console.log('登录状态未过期，但没有测算结果');
						uni.redirectTo({
							url: '/pages/index/index?type=1',
						});
					} else {
						console.log('登录状态未过期，有测算结果');
						uni.redirectTo({
							url: '/pages/result/result?status=0',
						});
					}
				});
			},
			//跳转小程序
			skip:function(){
				this.modalShow=false;
				let type='none'
				let path='';
				global.up(path,type).then(data =>{//成功跳转至易一指定页面
					console.log(data);
					console.log('成功跳转小程序');
					uni.redirectTo({
						url: '/pages/result/result?status=0',
					});
				}).catch(err =>{//取消跳转
					global.getResult().then(res =>{
						if (res == "") {
							console.log('登录状态未过期，但没有测算结果');
							uni.redirectTo({
								url: '/pages/index/index?type=1',
							});
						} else {
							console.log('登录状态未过期，有测算结果');
							uni.redirectTo({
								url: '/pages/result/result?status=0',
							});
						}
					});
				})
			}
		}
	}
</script>

<style scoped>
	.background{
		width: 100%;
		height: 100%;
	}
	.pageall{
		height: 100%;
		background-size: 100% 100%;
		background-image:url('~@/static/start/huanying.jpg');
	}
	.modal_hd{
		font-size: 36upx;
		text-align: center;
		line-height: 2;
	}
	.modal_bd{
		color: #9c9c9c;
		height: 140upx;
		font-size: 32upx;
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
	.welcome {
		text-align: center;
	}
	.footer{
		bottom: 5%;
		width: 100%;
		position: absolute;
		text-align: center;
	}
	button::after{
		border: 0upx;
	}
</style>
