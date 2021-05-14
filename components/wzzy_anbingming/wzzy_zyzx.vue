<template>
	<view>
		<view class="piece_view bm_view">
			<view style="position: relative;line-height: 2.5;">
				<text class="title">已选病名:</text>
				<button size="mini" class="modifyBtn" @tap="modifyZyzz">修改</button>
			</view>
			<view class="">
				<text class="xybm">{{bmName}}</text>
			</view>
		</view>
		<view class="">
			<view class="piece_view">
				<text class="title">中医证型:</text>
			</view>
			<!-- 中医证型 -->
			<form @submit="formSubmit">
				<checkbox-group>
					<label class="checkbox zyzx_lable" v-for="(item,index) in Template" :key="index">
						<checkbox :value="item.zxmc" />
						<text class="zyzx_name">{{item.zxmc}}</text>
						<text style="padding-left: 16upx;" class="zyzx_js">{{item.zzjs}}</text>
						<text>...</text>
						<!-- 相关疾病 -->
						<view class="zyzx_xgjb view_edge"> 
							<text style="font-size: 30upx;">相关疾病：</text>
							<checkbox-group @change="glbmchoose">
								<label class="checkbox"  v-for="(glbm,indexVal) in glbmArr[index]" :key="indexVal" style="padding-right: 0upx;">
									<checkbox  :value="glbm" style="display: none;"></checkbox>
									<text type="default" size="mini" class="xgjb_btn">{{glbm}}</text>
								</label>
							</checkbox-group>
						</view>
						<view style="line-height: 2;" class="view_edge">
							<text class="zyzx_shuoming">(若已发现上列疾病，选择后为您提供调养方案)</text>
						</view>
					</label>
				</checkbox-group>
			</form>
		</view>
	</view>
</template>

<script>
	import helper from '@/common/helper.js'; 
	import * as api from'@/common/API.js';
	import {ajax} from '@/common/ajax.js';
	export default {
		data() {
			return {
				bmName:helper.xybmRadio,
				Template:helper.result.zxcxList,
				glbmArr:helper.glbmArr,
			}
		},
		computed:{
			/* bmName(){
				console.log(helper.xybmRadio);
				return helper.xybmRadio;
			} */
		},
		methods:{
			/* 修改已选病名 返回到xybm组件 */
			modifyZyzz:function(){
				this.$emit('showXybm',true);
			}
		}
	}
</script>

<style scoped>
.piece_view{
	padding: 0upx 30upx;
}
.xybm{
	font-size: 30upx;
    border: 2upx solid #ccc;
    border-radius: 10upx;
    padding: 0upx 10upx;
    padding-bottom: 4upx;
}
.title{
	font-size: 36upx;
	font-weight: 700;
}
.modifyBtn{
    background: #1296db;
    color: #fff;
    font-size: 30upx;
    line-height: 1.8;
	position: absolute;
    left: 180upx;
    top: 20upx;
}
.bm_view{
	padding-bottom: 10upx;
	border-bottom: 2upx solid #CCCCCC;
}
.zyzx_lable{
	padding: 0upx 30upx;
	padding-right: 0upx;
}
.zyzx_name{
	font-size: 34upx;
	color: #337ab7;
	text-decoration: underline;
    text-decoration-color: #337ab7;
}
.zyzx_js{
	font-size: 15px;
    max-width: 10em;
    overflow: hidden;
    white-space: nowrap;
    display: inline-flex;
    margin-bottom: 0px;
}
.view_edge{
	padding: 0upx 30upx;
}
.xgjb_btn{
	padding: 2upx 17upx;
	margin: 0upx 6upx;
	border: 2upx solid #CCCCCC;
	border-radius: 10upx;
	vertical-align: middle;
}
.zyzx_shuoming{  
	color: #CCCCCC;
	font-size:30upx ;
	border-bottom: 2upx solid #CCCCCC;
}
</style>
