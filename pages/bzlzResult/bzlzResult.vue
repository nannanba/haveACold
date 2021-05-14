<template>
	<view>
		<image class="background" src="/static/background.jpg" mode=""></image>
		<form @submit="saveResult">
			<radio-group name="esZx">
				<view class="element_view" v-for="(item,index) in esData" :key="index" :style="{display:index>2&&lookMore==false? 'none':'block'}">
					<view class="con_view">
						<radio :value="item.id" :disabled="index>2?true:false" :style="{display:index>2?'none':''}"/>
						<text style="font-weight: 700;" v-if="glbmStatus==false&&item.zxtype=='B'">病名：</text><!-- 若病名为空 返回的结果需要判断zxtype类型，B：证型名称改为病名显示(glzb+glxb);Z:不处理no processing -->
						<text style="font-weight: 700;" v-else>证型名称：</text>
						<text style="font-weight: 700;" v-if="glbmStatus==false&&item.zxtype=='B'">{{item.glzb==null?'':item.glzb+',',item.glxb==null?'':item.glxb+'('+item.mainBz+')'}}</text>
						<text style="font-weight: 700;" v-else>{{item.zxmc==null?'无':item.zxmc+'('+item.mainBz+')'}}</text>
					</view>
					<!-- 临床表现 -->
					<view class="con_view" style="position: relative;">
						<text style="font-weight: 700;">临床表现：</text>
						<text>（</text><text>{{item.score}}</text><text>）</text>
						<rich-text  :nodes="item.heightLcbx==null?'无':item.heightLcbx==undefined?item.bzlcbx:item.heightLcbx"></rich-text>
						<view style="display: inline-block;">
							<button class="bhjs_view" v-show="item.heightLcbx==null?false:true" @tap="openBhjs(index)">
								<text>（</text><text class='bhjs_text'>白话解释</text><text>）</text>
							</button> 
						</view>
					</view>
					<view class="con_view"><text style="font-weight: 700;">治法治则：</text>无</view>
					<view class="con_view"><text style="font-weight: 700;">参考方剂：</text>无</view>
					<view class="con_view"><text style="font-weight: 700;">关联病名：</text>
						<text v-show="item.heightGlxb==null&&item.glxb==null&&item.heightGlzb==null&&item.glzb==null">无</text>
						<view class="heightGlbm" v-html="item.heightGlxb==null&&item.glxb==null?'':item.heightGlxb==null?item.glxb:item.heightGlxb"></view> 
						<text v-show="(item.heightGlxb!==null||item.glxb!==null)&&(item.heightGlzb!==null&&item.glzb!==null)">，</text>
						<view class="heightGlbm" v-html="item.heightGlzb==null&&item.glzb==null?'':item.heightGlzb==null?item.glzb:item.heightGlzb"></view>
					</view>
					<view class="con_view"><text style="font-weight: 700;">上级编号： </text><text :class="item.upbh==null?'':'upbh_text'" @tap="upbh(item.upbh)">{{item.upbh==null?'无':item.upbh}}</text></view>
					<!-- 白话解释弹层 -->
					<popupModal :show="item.show" type="mcjs" @hidePopup="hideBhjs(index)">
						<view class="modal_hd">
							<text>白话解释</text>
						</view>
						<view class="modal_bd">
							<view class="">{{item.zzjs}}</view>
						</view>
						<view class="modal_ft">
							<button class="yesBtn" @tap="hideBhjs(index)">确定</button>
						</view>
					</popupModal>
				</view>
			</radio-group>
			<view class="look_more">
				<button size="mini" class="look_btn" hover-class="look_hover" @tap="this.lookMore=true" :style="{display:lookMore==true?'none':''}">查看更多</button>
			</view>
			<view class="skip_view" v-show="isSave">
				<button form-type="submit" class="save_btn">保存结果</button>
			</view>
			<view class="skip_view" v-show="!isSave">
				<button class="save_btn" @tap="toyyjk">进入易一健康</button>
			</view>
		</form>
	</view>
</template>

<script>
	import App from '@/App.vue';
	import * as api from '@/common/API.js';
	import popupModal from '@/components/modal.vue';
	import helper from '@/common/helper.js';
	import {ajax} from '@/common/ajax.js'
	export default {
		components:{
			popupModal
		},
		data() {
			return {
				esData:[],
				isSave:true,
				lookMore:true,
				glbmStatus:uni.getStorageSync('glbmStatus')
			}
		},
		onLoad(e) {
			console.log(e);
			console.log('已选症状：',global.yxzz);
			let zxcxList=global.againWzzyList;
			for (var i = 0; i < zxcxList.length; i++) {
				zxcxList[i].show=false;
			}
			this.esData=zxcxList;
			if (this.esData.length<=2) {
				this.lookMore=true
			}else{
				this.lookMore=false
			}
			console.log(this.esData);
			
		},
		methods: {
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			//证型三选一提交
			saveResult:function(e){
				console.log(e);
				let zxmcId=e.detail.value.esZx;
				console.log(zxmcId);
				if (zxmcId=='') {
					return
				}
				let arr=[];
				let zxcxList=global.againWzzyList;
				for (var i = 0; i < zxcxList.length; i++) {
					if (zxmcId==zxcxList[i].id) {
						arr=zxcxList[i];
						break
					}
				}
				var checkedbzzz=global.yxzz;
				var array=[];
				array.push(arr);
				global.saveWzzyGzbz(array,checkedbzzz,this.glbmStatus).then(data =>{
					console.log(data);
					if (data.data==1) {
						this.isSave=false;
						//保存成功 提示跳转到易一健康 查看内容
						uni.showModal({
							title: '提示',
							content: '保存成功 可跳转至易一健康主程序查看',
							showCancel: true,
							cancelText: '不跳转',
							confirmText: '跳转',
							success: res => {
							 if (res.confirm) {
									global.up();
								}
							},
							fail: () => {},
							complete: () => {}
						});
					}else{
						uni.showToast({
							title: '保存失败',
							icon: 'none'
						});
					}
				}).catch(err =>{
					uni.showToast({
						title: '保存失败',
						icon: 'none'
					});
				})
			},
			//进入易一健康
			toyyjk:function(){
				global.up();
			},
			/* 关闭白话解释 */
			hideBhjs:function(index){
				this.esData[index].show=false;
			},
			/* 白话解释 */
			openBhjs:function(index){
				this.esData[index].show=true;
			},
		}
	}
</script>

<style scoped>
	button::after {
		border: none;
	}
	.background{
		width: 100%;
		height: 100%;
		position: fixed;
		z-index: -1;
	}
	.element_view{
		margin: 0 2%;
		padding: 0 3%;
		margin-top: 10upx;
		background: #FFFFFF;
		border-radius: 10upx;
		padding-bottom: 10upx;
		border-bottom: 4upx solid #CCCCCC;
	}
	.con_view {
		padding-top: 4upx;
		text-align: justify;
		font-size: 32upx;
	}
	.bhjs_view{
		background: #FFFFFF;
		padding: 0upx;
		color:#276B52;
		line-height: 1.8;
		font-size: 32upx;
		display: inline-flex;
		font-style: italic;
	}
	.bhjs_text{
		text-decoration: underline;
	}
	.heightGlbm{
		font-size: 32upx;
		display: inline-block;
	}
	.modal_hd {
			line-height: 2.5;
			font-size: 34upx;
			text-align: center;
			border-bottom: 2upx solid #CCCCCC;
		}
	
	.modal_bd {
		padding: 20upx;
		font-size: 32upx;
		height: 80%;
		overflow: auto;
	}

	.modal_ft {
		position: fixed;
		bottom: 0;
		width: 100%;
	}
	.yesBtn {
		color: #FFFFFF;
		border-top-left-radius: 0upx;
		border-top-right-radius: 0upx;
		background: #1296db;
	}
	.look_more{
		text-align: center;
		color: #276B52;
		font-size: 32upx;
	}
	.look_btn{
		color: #276B52;
		font-size: 32upx;
		border: 0;
		padding: 0;
		background: none;
		line-height: 2;
		text-decoration: underline;
	}
	.look_hover{
		color: #00B26A;
		background: #FFFFFF;
	}
	.save_view{
		text-align: center;
		margin-top: 60upx;
		margin-bottom: 60upx;
	}
	.save_btn{
		width: 40%;
		line-height: 2.5;
		color: #FFFFFF;
		font-size: 32upx;
		background: #276B52;
	}
	.skip_view {
		margin-bottom: 40upx;
		margin-top: 40upx;
	}
</style>
