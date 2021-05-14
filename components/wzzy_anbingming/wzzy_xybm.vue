<template>
	<view>
		<view class="" style="font-size: 30upx;">
			<form  @submit="formSubmit">
				<radio-group name="bm" @change="radioBmChange">
					<label class="radio bmList" v-for="(item,index) in bmList " :key="item.value">
						<radio style="line-height:2.5;transform:scale(0.8)" :value="item.value" :checked="index === current" color="#1296DB"/>
						<text class="bmName" @tap="openModal(item.value)">{{item.title}}</text>
						<text class="bmCon">{{item.con}}</text>
						<text>. . .</text>
					</label>
				</radio-group>
				<view class="" style="position: absolute; width: 100%; bottom: 20px;">
					<button type="default" class="submitBm" formType="submit">提交</button>
				</view>
			</form>
		</view>
		<!-- 弹出框 -->
		<modal  :show="show" class="modalAll" type="all" @hidePopup="hidePopup">
			<view style="position:relative;overflow: auto;">
				<view class="modal-title">
					<text>{{modalTitle}}</text>
				</view>
				<view class="modal-content">
					<view  v-for="(item,index2) in modalContent" :key="index2">
						<view class="con_tit" :class="[item.con==''? 'hide':'']">{{item.tit}}</view>
						<rich-text :nodes="item.con" style="font-size: 30upx;"></rich-text>
					</view> 
				</view>
				<!-- 模态框关闭按钮 -->
				<view style="position: relative;">
					<button type="primary" @tap="hidePopup" class="closeBtn">关闭</button>
				</view>
			</view>
		</modal>
	</view>
</template>

<script>
	import helper from '@/common/helper.js'; 
	import * as api from'@/common/API.js';
	import {ajax} from '@/common/ajax.js';
	import modal from '../modal.vue';
	export default {
		components:{
			modal
		},
		data() {
			return {
				modalTitle:'',
				current:null,
				radioValue:'',
				bmList:[{value:'心脏病',title:'心脏病',con:'心脏病是指体内循环动脉'},
				{value:'高血压',title:'高血压',con:'心脏病是指体内循环动脉'},
				{value:'冠心病',title:'冠心病',con:'心脏病是指体内循环动脉'},
				{value:'高血脂',title:'高血脂',con:'心脏病是指体内循环动脉'},
				],
				show:false,
				modalContent:[{tit:'病因',con:'1'},{tit:'临床表现',con:'2'},{tit:'舌象',con:'3'},{tit:'脉象',con:'4'}],
			};
		},
		computed:{
			/* bmList:function(){
				return helper.xybmList;
			} */
		},
		methods:{
			hidePopup:function(){
				this.show=false;
			},
			/* 点击病名显示详细信息 */
			openModal:function(name){
				this.show=true;
				this.modalTitle=name;
			},
			/* 病名单选 */
			radioBmChange:function(evt){
				this.radioValue=evt.detail.value;
				for (let i = 0; i < this.bmList.length; i++) {
			    if (this.bmList[i].value === evt.target.value) {
			        this.current = i;
			        break;
			    }
			}
			},
			/* 选择西医病名提交后匹配证型 */
			formSubmit:function(e){
				/* console.log(JSON.stringify(e.detail.value)); */
				let glbm=e.detail.value.bm;
				if (glbm==''||glbm==null||glbm==undefined) {
					uni.showModal({
						title: '提示',
						content: '请选择相关病名',
						showCancel: false,
						confirmText: '确定',
					});
					return
				}
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				ajax({
					url:api.zxcxApi,
					data:{
						glbm:glbm,
						bzbzmc:'',
						sx:'',
						mx:'',
						size:10,
						page:0
					},
					success:res=>{
						console.log(res);
						uni.hideLoading();
						helper.xybmRadio=this.radioValue;
						if (res.data.status==200) {
							/* 有匹配证型 显示症型+临床表现(症状)*/
							this.$emit('showZyzxModule',true);
							helper.zyzxResult=res.data;/* 匹配结果存入数组 */
							let arr=res.data.zxcxList;/* 将返回结果中的glbm字段值  先存入数组 在wzzy_zyzx组件调用 */
							let glbmArr=[];
							for (var i = 0; i < arr.length; i++) {
								var glbm=arr[i].lcbx.split('，');
								glbmArr.push(glbm);
							}
							helper.anbmGlbm=glbmArr;
						}else if(res.data.status==301){
							/* 没有匹配证型 显示病名表中的症状*/
							this.$emit('showBmzzModule',true);
						}else{
							uni.showToast({
								title: '操作异常'
							});
						}
					}
				})
			},
		}
	}
</script>

<style scoped>
.bmList{
	display: flex;
	line-height: 2.5;
	padding: 0upx 30upx;
}
.bmName{
	line-height: 2;
	margin-right: 16upx;
	margin-left:10upx ;
	font-size: 17px;
    color: #337ab7;
    text-decoration: underline;
    -webkit-text-decoration-color: #337ab7;
    text-decoration-color: #337ab7;
}

.bmCon{
	white-space: nowrap;
    max-width: 10rem;
    overflow: hidden;
}
.submitBm{
	width: 80%;
	color: #FFFFFF;
	background:#1296DB;
}
.hide{
	display: none;
}
.con_tit{
	font-size: 17px;
    font-weight: 700;
}
.closeBtn{
	position: fixed;
    width: 100%;
    bottom: 0;
	background: #1296DB;
	border-radius: 0;
}
.modal-title{
	line-height: 2;
    text-align: center;
    font-size: 20px;
	position: fixed;
	width: 100%;
	background: #FFFFFF; 
    border-bottom: 1px solid #ccc;
}
.modal-content{
	margin-top: 12%;
	font-size: 32upx;
	padding: 0upx 30upx;
	margin-bottom: 120upx;
}
</style>
