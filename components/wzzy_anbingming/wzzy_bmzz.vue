<template>
	<view>
		<view class="">
			<view class="" style="position: relative;padding: 0upx 30upx;">
				<text class="title">已选病名:</text>
				<button size="mini" class="modify-btn" @tap="modifyZyzz">修改</button>
			</view>
			<view class="" style="padding: 0upx 30upx;">
				<text class="xybm">{{bmName}}:</text>
				<text class="lcbx">心脏病符合地方大家凑儿戳</text>
				<text>...</text>
			</view>
			<view class="explain">
				<text>{{explain}}</text>
			</view>
			<view class="">
				<form @submit="formSubmit">
					<checkbox-group name="bmzz" class="choosezz" @change="choosezz">
						<label class="checkbox" v-for="(item,index) in xybmList" :key="index">
							<checkbox :value="item.value" style="display: none;" :checked="item.checked" color="#1296DB"></checkbox>
							<text class="symptom" :class="item.checked==true? 'on':'symptom'">{{item.value}}</text>
						</label>
					</checkbox-group>
					<view class="" style="position: absolute; bottom: 40upx;width: 100%;">
						<button class="submitbmzz" form-type="submit">确认</button>
					</view>
				</form>
			</view>
		</view>
	</view>
</template>

<script>
	import helper from '@/common/helper.js'; 
	import * as api from'@/common/API.js';
	import {ajax} from '@/common/ajax.js';
	export default {
		computed:{
			/* xybmList(){
				let bmName=helper.xybmRadio;
				console.log(bmName);
				let bmList=helper.xybmList;
				console.log(bmList);
				for (var i=0;i<bmList.length;i++) {
					if (bmName==bmList[i].value) {
						return bmList[i];
					}
				}
			}, */
		},
		data() {
			return {
				bmName:helper.xybmRadio,
				explain:'请选择发生的症状:',
				xybmList:[{value:'感冒'},{value:'发烧'},{value:'头痛'}]
			};
		},
		methods:{
			/* 修改已选病名 返回到xybm组件 */
			modifyZyzz:function(){
				this.$emit('showXybm',true);
			},
			/* 相关症状多选 */
			choosezz:function(e){
				 var items = this.xybmList,
				    values = e.detail.value;//已选症状
					helper.xybmzz=values;
				for (var i = 0, lenI = items.length; i < lenI; ++i) {
				    if(values.includes(items[i].value)){
				        this.$set(items[i],'checked',true)
				    }else{
				        this.$set(items[i],'checked',false)
				    }
				}
			},
			/* 选中症状后提交 */
			formSubmit:function(e){
				let zzName=e.detail.value.bmzz;
				let sx='';
				let mx='';
				let bm=helper.xybmRadio;
				if (zzName.length==0) {
					uni.showModal({
						title: '提示',
						content: '请选择症状',
						showCancel: false,
						confirmText: '确定',
					});
					return
				}
				uni.showLoading({
					title:'加载中'
				})
				ajax({
					url:api.fuheapi,
					data:{
						zxtz:'',
						illness:bm,
						lcbx:zzName.toString(),
						part:'',
						otherMessages:'',
						page:0,
						size:10,
						meridian:'',
						sx:sx.toString(),
						mx:mx.toString(),
						xname:'',
						alias:'',
						index:''
					},
					success:res=>{
						console.log(res);
						uni.hideLoading();
						if (res.data.status==200) {
							this.$emit('anbingming',false);
							helper.fuheResult=res.data;
						}else if(res.data.status==301){
							uni.showModal({
								title: '提示',
								content: '查询结果为空',
								showCancel: false,
								confirmText: '确定',
							});
						}
					}
				})
			}
		}
	}
</script>

<style scoped="scoped">
	.on{
		color: #FFFFFF;
		border:none;
		background: #1296DB;
	}
.title{
	font-size: 36upx;
	font-weight: 700;
	line-height: 2.5;
}
.lcbx{
	max-width: 10em;
    overflow: hidden;
    white-space: nowrap;
    display: inline-flex;
	line-height: 2.5;
}
.xybm{
	font-size: 17px;
    color: #1296DB;
	margin-right: 14upx;
    text-decoration: underline;
}
.explain{
	padding: 0upx 30upx;
	font-size: 16px;
    line-height: 2.5;
    color: #757575;
}
.symptom{
	padding: 0upx 6upx;
	border-radius:6upx ;
	border: 2upx solid #CCCCCC;
}
.submitbmzz{
	width: 80%;
	color: #FFFFFF;
	background: #1296DB;
}
.choosezz{
	line-height: 2.5;
	padding: 0upx 30upx;
	border-bottom: 2upx solid #CCCCCC;
}
.modify-btn{
    background: #1296db;
    color: #fff;
    font-size: 15px;
    line-height: 1.6;
	position: absolute;
    left: 220upx;
    top: 20upx;
}
</style>
