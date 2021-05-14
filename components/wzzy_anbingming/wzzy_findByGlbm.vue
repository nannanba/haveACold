<template>
	<view>
		<view class="">
			<view class="SearchView uni-flex  uni-row">
				<i class="search-btn"></i>
				<input type="text" value="" v-model="SearchCon" class="SearchCon uni-input" placeholder="请输入您要搜索的内容" />
				<i class="close-icon" @click="emptyCon"></i>
				<button size="mini" class="searchBtn" @click="search_click">搜索</button>
			</view>
			<view class="explainView">
				<text>{{explainCon}}</text>
			</view>
		</view>
		<!-- 病名表返回的病名 -->
		<xybmList v-if="showGlbm" @showZyzxModule="showZyzxModule" @showBmzzModule="showBmzzModule"></xybmList>
		<!-- 选择病名提交后有匹配值返回证型没有匹配值显示病名+症状 -->
		<bmzz v-if="showBmzz" @anbingming="anbingming" @showXybm="showXybm"></bmzz>
		<zyzx v-if="showZyzx" @showXybm="showXybm"></zyzx>
	</view>
</template>

<script>
	import xybmList from'./wzzy_xybm.vue';
	import bmzz from './wzzy_bmzz.vue';
	import zyzx from './wzzy_zyzx.vue';
	import modal from '../modal.vue';
	import helper from '@/common/helper.js'; 
	import * as api from'@/common/API.js';
	import {ajax} from '@/common/ajax.js';
	export default {
		components:{
			xybmList,
			bmzz,
			zyzx
		},
		data() {
			return {
				showGlbm:true,
				showBmzz:false,
				showZyzx:false,
				SearchCon:'',
				explainCon:'请根据您搜索的病名，对应中医理论制定调理，养生保健等方案。',
				
			};
		},
		methods:{
			emptyCon(){
				this.SearchCon='';
			},
			/* 子组件传递过来的值显示中医证型隐藏关联病名组件 */
			showZyzxModule:function(data){
				this.showZyzx=data;
				this.showGlbm=false;
				this.explainCon='';
			},
			/* 显示病名症状  隐藏西医病名列表 */
			showBmzzModule:function(data){
				this.showBmzz=data;
				this.showGlbm=false;
				this.explainCon='';
			},
			/* wzzy_bmzz组件传递过来的blooen值 */
			anbingming(data){
				this.$emit('anbingming',data);
			},
			/* 已选病名  bmzz或zyzx组件点击修改按钮传值到本组件  显示西医病名 xybm组件 */
			showXybm(data){
				this.showGlbm=data;
				this.showBmzz=false;
				this.showZyzx=false;
				this.explainCon='请根据您搜索的病名，对应中医理论制定调理，养生保健等方案。'
			},
			/* 搜索病名 */
			search_click(){
				if (this.SearchCon=='') {
					uni.showModal({
						title:'提示',
						content:'请输入您要查询的内容',
						showCancel:false,
						confirmText:'确定',
					})
					return
				}
				let name=this.SearchCon;
				let _this=this;/* this指向data */
				ajax({
					url:api.bmApi,
					data:{
						name:name,
						page:0,
						size:10
					},
					success:function(res){
						console.log(res);
						if (res.data.status==301) {
							 uni.showModal({
								title: '提示',
								content: '暂无您要查询的病名',
								showCancel: false,
								cancelText: '确定',
							});
							return 
						}else if(res.data.status==200){
							helper.xybmList=res.data.zxcxList;
							_this.explainCon='您是否在寻找下列中的某项病名？';
							_this.showGlbm=true;
							_this.showBmzz=false;
							_this.showZyzx=false;
						}else{
							uni.showToast({
								title: '请稍后重试'
							});
						}
					}
				})
			}
		}
	}
</script>
<style scoped>
.search-btn{background-image: url('~@/static/wzzy/sousuo.png');background-repeat: no-repeat;background-size:30upx;width:40upx;height:40upx;position:absolute;z-index:99;top: 20upx;left: 4upx;background-position: 2px 2px;}
.content {display: flex;}
.SearchView{margin-left: 30upx;margin-top: 20upx;position: relative;}
.SearchCon{background: #FFFFFF;height: 60upx;padding: 4upx 50upx;border: 2upx solid #CCCCCC;font-size: 30upx;}
.close-icon{background-image: url('~@/static/wzzy/close.png');background-repeat: no-repeat;background-size: 30upx;
			width: 40upx;height: 40upx;position: absolute;z-index: 99;top: 20upx;right: 194upx;background-position: 2px 2px;}
.searchBtn{background: #1296DB; color: #FFFFFF;margin-left: 40upx;margin-right: 30upx;font-size: 34upx;padding: 0upx 20upx;line-height: 2;}
.explainView{padding-left: 30upx;padding-right: 30upx;padding-top: 10upx;color: #757575;font-size: 30upx;}
.uni-input {
	height: 40upx;
	padding: 8upx 40upx;
	font-size:28upx;
	background:#FFF;
	flex: 1;
}



</style>
