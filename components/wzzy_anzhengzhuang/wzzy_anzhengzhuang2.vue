<template>
	<view>
		<!-- 已选症状 -->
		<view class="uni_tabtit view_edge">
			<p style="font-size: 36upx; line-height: 2;display: inline;" >已选症状：</p>
			<button size="mini" class="modify_btn" @tap="modifyZyzz">修改</button>
		</view>
		<view class="view_edge choose_zyzx " style="padding: 0upx 30upx;">
			<button style="font-size: 30upx;" type="default" size="mini" v-for="(item,index) in yxzzArray" :key="index" >{{item.bzmc}}</button>
		</view>
		<!-- 中医证型 -->
		<view class="uni_tabtit view_edge">
			<text>中医证型：</text>
		</view>
		<!-- 症型列表 -->
		<view class="zyzx_view">
			<view class="asx">
				<form @submit="formSubmit">
					<checkbox-group name="zyzx" @change="cheoose_zyzx" style="display: inline;">
						<label class="checkbox view_edge"   v-for="(list,index) in Template" :key="index">
							<checkbox :value="list.zxmc" :checked="list.checked"/>
							<text class="zyzx_name" @tap="getBaikeData(list.zxmc)">{{list.zxmc}}</text>
							<text style="padding-left: 16upx;" class="zyzx_js">{{list.zzjs}}</text>
							<text>...</text>
							<!-- 相关疾病 -->
							<view class="zyzx_xgjb view_edge"> 
								<text style="font-size: 30upx;">相关疾病：</text>
								<checkbox-group name="glbm" @change="glbmchoose($event,index)">
									<label class="checkbox"  v-for="(item,index1) in glbmArr[index]" :key="index1" style="padding-right: 0upx;">
										<checkbox  :value="item.glbm" style="display: none;" :checked="item.checked"></checkbox>
										<!-- <button class="xgjb_btn" size="mini">{{glbm}}</button> -->
										<text class='xgjb_btn' :class="item.checked==true?  'on':'xgjb_btn'">{{item.glbm}}</text>
									</label>
								</checkbox-group>
							</view>
							<view style="line-height: 2;" class="view_edge">
								<text class="zyzx_shuoming">(若已发现上列疾病，选择后为您提供调养方案)</text>
							</view>
						</label>
					</checkbox-group> 
						<!-- 提交中医证型 -->
					<view style="position: absolute;width: 100%;bottom: 40upx;">
						<button type="primary" class="submit_zyzz" formType="submit">确认</button>
					</view>
				</form>
			</view>
		</view>
		<!-- 模态框 -->
		<modalUp  :show="show" class="modalAll" type="all" @hidePopup="hidePopup">
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
		</modalUp>
	</view>
</template>

<script>
	import modalUp from '../modal.vue'
	import helper from '@/common/helper.js'; 
	import * as api from'@/common/API.js';
	import {ajax} from '@/common/ajax.js';
	export default {
		components: {
			modalUp
		},
		data() {
			return {
				show:false,
				modalTitle:'',
				zzjs:'',
				lcbx:'',
				mx:'',
				sx:'',
				zyzxArray:[],
				Template:helper.result.zxcxList,
				/* glbmArr:helper.glbmArr, */
				modalContent:[{tit:'名词解释',con:''},{tit:'临床表现',con:''},{tit:'舌象',con:''},{tit:'脉象',con:''}],
				on:false,
				selectedGlbm:''
			}
		},
		computed: {
			/* 上一组件将选择好的病症 放入已选症状*/
			yxzzArray() {
				if (helper.yxzz.length!==0) {
					return helper.yxzz
				}
			},
			glbmArr(){
				var glbmArray=helper.glbmArr;
				var array=[];
				for (var i = 0; i < glbmArray.length; i++) {
					 const newArr=glbmArray[i].map(i=>({glbm:i,checked:false}))
					 array.push(newArr);
				}
				return array
			}
		},
		methods:{
			hidePopup: function() {
				this.show = false;
			},
			/* 点击中医证型显示详情弹层 */
			getBaikeData:function(name){
				var  dataArray=helper.result.zxcxList;
			 	for(var i=0;i<dataArray.length;++i){
					if(name==dataArray[i].zxmc){
						this.modalTitle=dataArray[i].zxmc;
						this.modalContent[0].con=dataArray[i].zzjs;
						this.modalContent[1].con=dataArray[i].lcbx;
						this.modalContent[2].con=dataArray[i].sx;
						this.modalContent[3].con=dataArray[i].mx;
					}
				} 
				this.show=true;
				
			},/* 修改按钮事件 */
			modifyZyzz:function(){
				this.$emit('showChooseBz',true);
			},
			
			/* 选择中医证型 */
			cheoose_zyzx:function(e){
				 var items = this.Template,
                    values = e.detail.value;
					console.log(values);
                for (var i = 0, lenI = items.length; i < lenI; ++i) {
                    if(values.indexOf(items[i].zxmc)>=0){
                        this.$set(items[i],'checked',true);
                    }else{
                        this.$set(items[i],'checked',false);
                    }
                }
			},
			/* 选择相关病名 */
			glbmchoose:function(e,index){
				event.stopPropagation();//阻止事件冒泡：禁止触发中医证型choose
				console.log(e.detail.value);
				 var glbmArray = this.glbmArr[index],
				    values = e.detail.value;//已选症状
					helper.zyzxGlbm=values;
					this.selectedGlbm=values;//将选择好的相关病名存入新的数组
					console.log('selectedGlbm'+':'+this.selectedGlbm.length);
				for (var i = 0, lenI = glbmArray.length; i < lenI; ++i) {
				    if(values.indexOf(glbmArray[i].glbm)>=0){
				       /* this.$set(glbmArray[i],'checked',true); */
					   glbmArray[i].checked=true;
				    }else{
				       /* this.$set(glbmArray[i],'checked',false); */
					   glbmArray[i].checked=false;
				    }
				}
				console.log();
				
			},
			/* 复合查询返回文章列表 */
			formSubmit:function(e){
				console.log(e);
				let zyzx=e.detail.value.zyzx;
				 if(zyzx.length==0){
					uni.showModal({
						title: '提示',
						content: '请至少选择一项中医证型',
						showCancel: false,
						confirmText: '确定',
					});
					return
				} 
				var zxtz=zyzx.toString();//中医证型
				var illness=[];//关联病名
				var lcbx=[];//临床表现
				var sx=[];//舌象
				var mx=[];//脉象
				var xname='';//项目名称
				var alias='';//别名
				var _this=this;
				var dataArr=helper.result.zxcxList;
				for (let i=0;i<zyzx.length;i++) {
					for (let n=0;n<dataArr.length;n++) {
						if (zyzx[i]==dataArr[n].zxmc) {
							lcbx.push(dataArr[n].lcbx);
							sx.push(dataArr[n].sx);
							mx.push(dataArr[n].mx);
						}
					}
				}
				/* 将中医证型和关联病名传递到helper 在调养方案组件显示 */
				helper.zyzxArr=zyzx;
				helper.glbm=illness;
				uni.showLoading({
					title:'加载中'
				})
				ajax({
					url:api.fuheapi,
					data:{
						zxtz:zxtz,
						illness:illness,
						lcbx:lcbx.toString(),
						part:'',
						otherMessages:'',
						page:0,
						size:10,
						meridian:'',
						sx:sx.toString(),
						mx:mx.toString(),
						xname:xname,
						alias:alias,
						index:''
					},
					success:function(res){
						console.log(res);
						uni.hideLoading();
						if (res.data.status!==200) {
							uni.showModal({
								title: '提示',
								content: '暂无您要查询的结果',
								showCancel: false,
								confirmText: '确定',
							});
						}else{
							helper.fuheSearch=res.data;
							_this.$emit('show_Tyfa',true);
						}
					}
				}) 
			}
		}
	}
</script>
<style scoped>
	page{
		background: #FFFFFF;
	}
	h1{
		font-size: 36upx;
	}
	page {height: auto;}
.view_edge{
	padding: 0upx 30upx;
}
.uni_tabtit{
	font-size: 36upx;
	font-weight: 700;
	line-height: 2;
	position: relative;
	}
.modify_btn{
    background: #1296db;
    color: #fff;
    font-size: 15px;
    line-height: 1.8;
	position: absolute;
    right: 30upx;
    top: 8upx;
}
.choose_zyzx{
	padding: 0upx;
	border-bottom: 2upx solid #CCCCCC;
}
.zyzx_name{
	font-size: 34upx;
	color: #337ab7;
	text-decoration: underline;
    text-decoration-color: #337ab7;
}
.zyzx_js{
	font-size: 30upx;
    max-width: 10em;
    overflow: hidden;
    white-space: nowrap;
    display: inline-flex;
    margin-bottom: 0px;
}
.zyzx_xgjb{
	line-height: 2;
}
.xgjb_btn{
	margin: 0upx 6upx;
    border: 2upx solid #ccc;
    display: -webkit-inline-box;
    border-radius: 10upx;
    line-height: 1.5;
    padding: 0upx 10upx;
}
uni-button[size=mini] {
	line-height: 1.8;
}
.zyzx_shuoming{  
	color: #CCCCCC;
	font-size:30upx ;
	border-bottom: 2upx solid #CCCCCC;
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
.zyzx_view{
	height: 720upx;
	overflow: auto;
}
.submit_zyzz{
	width: 80%;
	background: #1296DB;
}
.hide{
	display: none;
}
.con_tit{
	font-size: 17px;
    font-weight: 700;
}
.on{
	color: #FFFFFF;
	background: #1296DB;
}
</style>
