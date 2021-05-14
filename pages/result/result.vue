<template>
	<view class="pageall" >
	<image class="background" src="/static/background.jpg" mode=""></image>
		<!-- 我的症状 -->
		<view class="xt_view" style="margin-top: 0upx;">
			<view class="xt_title">
				<text>| 我的症状</text>
				<text class="wz_history" @tap="intoWzHistory">问症历史</text>
				<button class="xt_chakanBtn againCeshi" hover-class="bzz_btn" @tap="retest">重新问症</button>
			</view>
			<text class="yxzz_text" v-for="(item,index) in anserArray" :key="index">{{item.title}}；</text>
			<!-- 在我的症状与补充症状之间加空格，直接加&nbsp;无效，故添加此view -->
			<view style="width: 15px;display: inline-block;"></view>
			<!-- 补充症状 -->
			<view class="replenish" @tap="supplement">
				<text class="">补充症状</text>
				<text class="xiangqing" style="float: none;padding-left: 6upx;color: #276B52;font-style: normal;">&#xe68d;</text>
			</view>
			<view style="color: red;font-size: 32upx;">(以下内容仅供参考，若要采纳，需医生指导。)</view>
		</view>
		<!-- 诊断参考 -->
		<!-- <view class="xt_view">
			<view class="xt_title">| 病症类型</view>
			<view class="zlck">
				<text style="text-decoration: underline;"  @tap="zxmcInfo(result.gmmc)">{{result.gmmc}}</text>
				<rich-text style="text-align: justify;" :nodes="result.mcjs"></rich-text>
			</view>
		</view> -->
		<!-- 相关证型 -->
		<view class="xt_view">
			<view class="xt_title">
				<text>| 辨证论治</text>
				<text class="xiangqing" @tap="zxcx('bzlz')" v-show="bzlzBtnShow">&#xe68d;</text><text class="seeJbzd" @tap="zxcx('bzlz')" v-show="bzlzBtnShow">查看</text> 
				<button class="xt_chakanBtn againCeshi" hover-class="bzz_btn" @tap="bzlzClick" 
				v-show="!bzlzBtnShow" :class="result.bzlzNum==0?'disabled':'xt_chakanBtn'">重新辩证</button>
			</view>
			<view class="xt_part" v-show="!bzlzBtnShow">
				<view class="" style="border-bottom: 4upx solid #CCCCCC;margin-top: 10upx;padding-bottom: 10upx;" :style="{display:index>1&&lookMore==false? 'none':'block'}">
					<view class="con_view">
						<!-- 查询es时，参数病名若为空 返回的结果需要判断zxtype类型，B：证型名称改为病名显示(glzb+glxb);Z:不处理no processing -->
						<!-- <text style="font-weight: 700;" v-if="esData.zxtype=='B'">病名：</text> -->
						<text style="font-weight: 700;">证型名称：</text>
						<!-- <text style="font-weight: 700;" v-if="esData.zxtype=='B'">{{esData.glzb==null?'':esData.glzb+',',esData.glxb==null?'':esData.glxb}}</text> -->
						<text style="font-weight: 700;">{{esData.zxmc==null?'无':esData.zxmc}}</text>
						<!-- <button class="xt_chakanBtn againCeshi" hover-class="bzz_btn" @tap="lunzhi">论治</button> -->
					</view>
					<view class="con_view" style="position: relative;">
						<text style="font-weight: 700;">临床表现：</text>
						<text  v-show="esData.score==undefined?false:true"><text>（</text><text>{{esData.score}}</text><text>）</text></text>
						<!-- <rich-text  :nodes="esData.heightLcbx==null?'无':esData.heightLcbx==undefined?esData.bzlcbx:esData.heightLcbx"></rich-text> -->
						<view class="">
							<text>{{esData.lcbx==null||esData.lcbx==''?'无':esData.lcbx}}</text>
							<text v-show="esData.sx!==null&&esData.sx!==undefined?true:false">{{'&nbsp;&nbsp;&nbsp;'+esData.sx}}</text>
							<text v-show="esData.mx!==null&&esData.mx!==undefined?true:false">{{'。'+esData.mx}}</text>
							<!-- <button class="bhjs_view"  @tap="openBhjs()"  v-show="esData.lcbx==''||esData.lcbx==null?false:true">
								<text>（</text><text class='bhjs_text'>白话解释</text><text>）</text>
							</button> --> 
						</view>
					</view>
					<view class="con_view"><text style="font-weight: 700;">中医病名：</text>{{esData.glzb==null?'无':esData.glzb}}</view>
					<view class="con_view"><text style="font-weight: 700;">西医病名：</text>{{esData.glxb==null?'无':esData.glxb}}</view>
					<view class="con_view"><text style="font-weight: 700;">治法治则：</text>{{esData.zfzz==null||esData.zfzz==''?'无':esData.zfzz}}</view>
					<view class="con_view"><text style="font-weight: 700;">参考方剂：</text>{{esData.ckfj==null||esData.ckfj==''?'无':esData.ckfj}}</view>
				</view>
				<view class="look_more">
					<button size="mini" class="look_btn" hover-class="look_hover" @tap="this.lookMore=true" :style="{display:'none'}">查看更多</button>
				</view>
			</view>
		</view>
		<!-- 鉴别诊断 -->
		<view class="xt_view">
			<view class="xt_title">
				<text>| 鉴别诊断</text>
				<text class="xiangqing" @tap="zxcx('jbzd')" v-show="jbzdShow">&#xe68d;</text><text class="seeJbzd" @tap="zxcx('jbzd')" v-show="jbzdShow">查看</text>
				<text class="seeJbzd" @tap="jbzdShow=true" v-show="!jbzdShow">收起<text class="packUp">&#xe63a;</text></text>
			</view>
			<view class="zlck" v-show="jbzdShow==false?true:false">
				<rich-text :style="{display:result.jianbie=='null'||result.jianbie==''||result.jianbie==null?'inline-block':''}" style="text-align: justify;" :nodes="result.jianbie=='null'||result.jianbie==''||result.jianbie==null?'无':result.jianbie"></rich-text>
			</view>
		</view>
		<!-- 用药参考 -->
		<view class="xt_view">
			<view class="xt_title">
				<text>| 成药参考</text>
				<text class="xiangqing" @tap="zxcx('yyck')" v-show="yyckShow">&#xe68d;</text><text class="seeJbzd" @tap="zxcx('yyck')" v-show="yyckShow">查看</text>
				<text class="seeJbzd" @tap="yyckShow=true" v-show="!yyckShow">收起<text class="packUp">&#xe63a;</text></text>
			</view>
			<view class="zlck" v-show="!yyckShow">
				<rich-text :style="{display:result.recips=='null'||result.recips==''||result.recips==null?'inline-block':''}" style="text-align: justify;" :nodes="result.recips=='null'||result.recips==''||result.recips==null?'无':result.recips"></rich-text>
			</view>
		</view>
		<!-- 相关治疗 -->
		<view class="xt_view">
			<view class="xt_title">
				<text>| 相关治疗</text>
				<text class="xiangqing" @tap="zxcx('xgzl')" v-show="xgzlShow">&#xe68d;</text><text class="seeJbzd" @tap="zxcx('xgzl')" v-show="xgzlShow">查看</text>
				<text class="seeJbzd" @tap="xgzlShow=true" v-show="!xgzlShow">收起<text class="packUp">&#xe63a;</text></text>
			</view>
			<view class="zlck" v-show="!xgzlShow">
				<view v-for="(item,index) in result.cure" :key="index" v-show="item==''?false:true">
					<rich-text :style="{display:item=='null'||item==''||item==null?'inline-block':''}" style="text-align: justify;" :nodes="whetherCon==true?'无':item"></rich-text>
				</view>
			</view>
		</view>
		<!-- 注意禁忌 -->
		<view class="xt_view">
			<view class="xt_title">
				<text>| 注意禁忌</text>
				<text class="xiangqing" @tap="zxcx('zyjj')" v-show="zyjjShow">&#xe68d;</text><text class="seeJbzd" @tap="zxcx('zyjj')" v-show="zyjjShow">查看</text>
				<text class="seeJbzd" @tap="zyjjShow=true" v-show="!zyjjShow">收起<text class="packUp">&#xe63a;</text></text>
			</view>
			<view class="zlck" v-show="!zyjjShow">
				<rich-text :style="{display:result.notice=='null'||result.notice==''||result.notice==null?'inline-block':''}" style="text-align: justify;" :nodes="result.notice=='null'||result.notice==''||result.notice==null?'无':result.notice"></rich-text>
			</view>
		</view>
		<!-- 养生保健 -->
		<view class="xt_view">
			<view class="xt_title">
				<text>| 养生保健</text>
				<text class="xiangqing" v-show="ysbj_look" @tap="zxcx('ysbj')">&#xe68d;</text><text class="seeJbzd" v-show="ysbj_look" @tap="zxcx('ysbj')">查看</text>
				<text class="seeJbzd" @tap="ysbj_look=true" v-show="!ysbj_look">收起<text class="packUp">&#xe63a;</text></text>
			</view>
			<view class="" v-show="!ysbj_look">
				<view class="" v-if="ysbjLength" >
					<view class="" v-for="(item,index) in result.ysjk" :key="index">
						<text class="ysbj_tit" v-show="item.split('#')[1]==''?false:true">{{item.split('#')[0]}}</text>
						<rich-text class="ysbj_con" :nodes="item.split('#')[1]"></rich-text>
					</view>
				</view>
				<view v-else style="text-align: center;color: #CCCCCC;">
					<text>暂无匹配内容</text>
				</view>
			</view>
		</view>
		<!-- 关注公众号 -->
		<view class="xtGuanzhu_view">
			<official-account></official-account>
		</view>
		<!-- 跳转小程序 -->
		<view class="skip_view uni-flex uni-row" style="text-align: center;">
			<view class="" :style="{width:saveShow?'50%':'60%'}" style="margin: auto;">
				<button  v-show="intoJk" class="save_btn" @tap="skip">进入易一健康</button>
				<!-- <button  v-show="saveJk"  class="save_btn" @tap="saveResult">保存到易一健康</button> -->
			</view>
			<view class="" v-show="saveShow" style="width: 50%;">
				<button v-if="showWHo" class="save_result" open-type="getPhoneNumber" @getphonenumber="getphoneAndSaveJg">保 存</button>
				<button v-else class="save_result" @tap="saveResult">保 存</button>
			</view>
		</view>
		<!-- 打赏图 -->
		<view class="xt_dashangview">
			<image src="/static/pay.jpg" mode="" class="xt_dashangimg" @tap="playing"></image>
		</view>
		<!-- 底部说明 -->
		<!-- <view class="footer">
			<text>©易一健康管理咨询（天津）有限公司&#12288;2019</text>
		</view> -->
		<!-- 打赏 modal -->
		<popupModal :show="show" style="width: 100%;" type="middle" @hidePopup="hidePopup">
			<view class="head_view">
				<text class="removeBtn closeBtn" @tap="hidePopup">&#xe677;</text>
				<image :src="headImg" mode="" class="headImg"></image>
				<view style="position: relative;">
					<!-- <text class="youke">&#xe628;</text>
					<text class="youke_text">{{identity}}</text> -->
					<text class="nickName">{{nickName}}</text>
				</view>
				<text class="thanks_text">感谢您的使用</text>
			</view>
			<form @submit="formSubmit">
				<view class="money_view">
					<radio-group class="" @change="radioMoney" name="radioMoney">
						<label class="radio radio_label" v-for="(item,index) in moneyArray" :key="index" :style="{'border-color':item.checked==true?'#08c406':'#276B52'}">
							<radio :value="item.money" class="money_radio" :checked="item.checked" />
							<text class="money_number" v-if="item.money!==0">{{item.money}}</text>
							<text class="money" v-if="item.money!==0">&#xe60f;</text>
							<input type="number" v-if="item.money==0" v-model="inputMoney" class="money_input" placeholder="任意赏" />
						</label>
					</radio-group>
				</view>
				<view class="httz_view">
					<text class="yes">&#xe60b;</text>
					<text class="httz_text">获得一次后天体质测试资格</text>
				</view>
				<view class="reward_view">
					<button type="default" formType="submit" class="reward_btn">打 赏</button>
				</view>
			</form>
		</popupModal>
		<!-- 病症类型弹层 -->
		<popupModal :show="mcjs_show" type="mcjs" @hidePopup="mcjsHidePopup">
			<view class="modal_hd">
				<text>{{result.gmmc}}</text>
			</view>
			<view class="modal_bd">
				<view class="" v-for="(item,index) in bmxq" :key="index">
					<view class="bmxq_tit" v-show="item.split('#')[1]==''?false:true"><text>{{item.split('#')[0]}}:</text></view>
					<view class="bmxq_con"><rich-text :nodes="item.split('#')[1]"></rich-text></view>
				</view>
			</view>
			<view class="modal_ft">
				<button class="yesBtn" @tap="mcjsHidePopup">确定</button>
			</view>
		</popupModal>
		<!-- 补充症状弹层 -->
		<!-- 补充证状弹层为单独组件，单独组件内又引入的modal弹层组件，此举为了减少页面代码量 -->
		<!-- <supplement :show="supplementModal" type="esSeach" @supplementHidePopup="supplementHidePopup"></supplement> -->
		<!-- 白话解释弹层 -->
		<popupModal :show="bhjs_show" type="mcjs" @hidePopup="hideBhjs(index)">
			<view class="modal_hd">
				<text>白话解释</text>
			</view>
			<view class="modal_bd">
				<view class="">{{esData.zzjs}}</view>
			</view>
			<view class="modal_ft">
				<button class="yesBtn" @tap="hideBhjs(index)">确定</button>
			</view>
		</popupModal>
	</view>
</template>

<script>
	import App from '@/App.vue';
	import * as api from '@/common/API.js';
	import popupModal from '@/components/modal.vue';
	
	import supplement from '@/components/supplement.vue';
	import helper from '@/common/helper.js';
	import {ajax} from '@/common/ajax.js'
	export default {
		components: {
			popupModal,
			supplement
		},
		data() {
			return {
				anserArray:[],
				esData: {},
				classid: 0,
				identity: '',
				show: false,
				bzlzBtnShow:true,
				headImg: uni.getStorageSync('headImg'),
				nickName: uni.getStorageSync('nickName'),
				moneyArray: [{money: 1,checked: false}, {
					money: 5,
					checked: false
				}, {
					money: 10,
					checked: false
				}, {
					money: 15,
					checked: false
				}, {
					money: 20,
					checked: false
				}, {
					money: 0,
					checked: false
				}, ],
				status: 2,
				inputMoney: '',
				result: {},
				mcjs_show: false,
				intoJk: false,
				saveJk: false,
				lookMore:true,
				bhjs_show:false,
				bzzz:[],
				bmxq:[],
				ysbj:[],
				ysbj_look:true,
				ysbjLength:true,
				saveShow:false,
				jbzdShow:true,
				xgzlShow:true,
				yyckShow:true,
				zyjjShow:true,
				supplementModal:false,
				loginStatus:global.loginStatus
			}
		},

		onLoad(e) {
			/**
			 * 1、点击完辩证论治的查看后才显示保存到易一健康，或保存按钮
			 * 2、会员等级为0时，显示到存到易一健康；会员等级>0时，显示保存。
			 * 3、鉴别诊断、成药参考、相关治疗、注意禁忌,养生保健的内容与顶部我的症状内容，一起获取到的。
			 * 5、保存关注病症时，bzmc字段为es返回的中医病名或者西医病名，优先使用中医病名，中医病名有可能是多个，使用主病症（感冒）去匹配各中医病名，
			 * 若匹配上则使用，匹配不上则使用西医病名。
			 */
			this.status = e.status;
			let Jg = uni.getStorageSync('Jg');
			this.parseData(Jg);
			if (this.result.classid>0) {
				
			}
		}, 
		onShareAppMessage() {
			from: 'menu';
			return {
				title: '快好—小病自查，你也快来试一试吧！',
				path: '/pages/start/start',
				imageUrl: '/static/kuaihao.png',
			}
		},
		onShow() {
			//监听补充症状的症状
			var _this=this;
			uni.$once('buchong',function(data){
				console.log('监听补充症状事件',data.bzArr);
				var bzArr=data.bzArr;
				//将补充症状填充到已选症状
				for (var i = 0; i < bzArr.length; i++) {
				var obj={
					bzzz:bzArr[i].split(',')[0],
					title:bzArr[i].split(',')[1]
				}
				for (var n = 0; n < _this.anserArray.length; n++) {
					if (_this.anserArray[n].title==obj.title) {
						_this.anserArray.splice(n,1);
					}
				}
				_this.anserArray.push(obj);
				}
			});
			uni.hideHomeButton();
			if (this.result.classId == 0&&this.result.isSave==0) {
				this.intoJk = false;
			} else {
				this.intoJk = true;
			}
			var pages = getCurrentPages();
			var currPage = pages[pages.length - 1]; //当前页面
			let json = currPage.data.historyData;
			if (json==""||json==undefined) {
				return
			}
			console.log(json)//为历史页传过来的值
			this.parseData(json);
			this.lookMore=false;
			this.jbzdShow=true;
			this.xgzlShow=true;
			this.yyckShow=true; 
			this.zyjjShow=true;
			this.ysbj_look=true;
			//this.saveJk=false;//保存到易一健康
			//this.saveShow=false;//保存
			currPage.data.historyData='';
		},
		computed: { //计算属性
			showWHo(){
				if (this.result.classId<1) {
					return true;
				}else{
					return false
				}
			},
			save_Show(){
				if (this.result.isSave==0) {
					return 'inline'
				}else{
					return 'none'
				}
			},
			whetherCon(){
				let num=0;
				let arr=this.result.cure;
				if (arr==undefined) {
					return
				}
				for (var i = 0; i < arr.length; i++) {
					if (arr[i]==''||arr[i]=='null'||arr[i]==null) {
						num+=1;
					}
				}
				if (num==this.result.cure.length) {
					return true
					console.log('没有内容');
				}else{
					console.log('有内容');
					return false
				}
			}
		},
		watch:{
			result:function(newValue, oldValue){
				
			}
		},
		mounted(){//挂载到实例上去之后调用
			
		},
		methods: {
			//解析数据========================================================
			parseData:function(Jg){
				this.result={}
				this.anserArray=[]
				this.result.bm=Jg.bm;//病名：感冒
				this.result.sbm = Jg.sbm; //病症类型
				this.result.description = Jg.description; //名词解释
				this.result.dbSymptom = Jg.dbSymptom; //对应症型
				this.result.classId = Jg.classId; //会员等级；0：不是会员；>0是会员
				this.result.leftimes = Jg.leftimes; //剩余次数
				this.result.queryNum = Jg.queryNum; //总次数
				this.result.tips = Jg.tips; //剩余次数为0时，提示文字
				this.result.selectOption=Jg.selectOption;//已选症状
				this.result.recips=Jg.recips;//用药参考
				this.result.cure=(Jg.cure==null?Jg.cure:Jg.cure.split("#"));//相关治疗
				this.result.notice=Jg.notice;//注意禁忌
				this.result.notice=Jg.jianbie;//鉴别诊断
				this.result.sx=Jg.sx;//舌象
				this.result.isSave=Jg.isSave//保存状态 0：没保存过 1：保存过
				this.result.bzlzNum=Jg.wzNum;//辨证论治次数
				this.result.dataId=Jg.id;//id
				if (Jg.ysjk!==undefined&&Jg.ysjk!==null&&Jg.ysjk!=='') {
					this.result.ysjk=Jg.ysjk.split('#');//养生健康
					let res = this.result.ysjk.filter((num) => {//如果养生健康内的内容全部为空
					  return num !=='';
					});
					if (res.length==0) {
						this.ysbjLength=false;
					}
				}else{
					this.ysbjLength=false;
				}
				if (Jg.es!==undefined&&Jg.es!==''&&Jg.es.split('#')[0]!=='null') {//es.zxmc,es.lcbx,es.glxb,es.glzb,es.ckfj,es.zfzz,id,type
					this.esData.zxmc=Jg.es.split('#')[0];
					this.esData.lcbx=Jg.es.split('#')[1];
					this.esData.zfzz=Jg.es.split('#')[2];
					this.esData.ckfj=Jg.es.split('#')[3];
					this.esData.glxb=Jg.es.split('#')[4];
					this.esData.glzb=Jg.es.split('#')[5];
					this.esData.zxtype=parseInt(Jg.type);
					this.esData.show=false;
					//this.bzlzBtnShow=false;//隐藏查看按钮
				}else{
					//this.bzlzBtnShow=true;
				}
				//console.log(this.esData);
				let bzzz=this.result.dbSymptom.split(';');
				//console.log(bzzz.length);
				let minezz=this.result.selectOption.split(',');
				let num=0;
				let obj={};
				//将后台返回的标症拼接至我的症状
				for (var i = 0; i < minezz.length; i++) {
					obj={
						 title:minezz[i]
					}
					this.anserArray.push(obj);
				}
				//我的症状内的最后一位是舌象，显示时用单独返回的sx字段；
				var sxLength=0;
				if (this.result.sx=='') {
					sxLength=0
				}else{ 
					sxLength=this.result.sx.split(';').length;
				}
				for (var i = 0; i < this.anserArray.length; i++) {
					for (var j = num; j < (bzzz.length-sxLength); j++) {
						if (bzzz[i]!=='') {
							this.anserArray[i].bzzz=bzzz[j];
							num=j+1
							break
						}
					}
				}
				//如果单独返回的舌象不为空，将此值追加到我的症状内的舌象对应的证型内
				if (this.result.sx!=='') {
					for (var i = 0; i < this.anserArray.length; i++) {
						if (this.anserArray[i].bzzz==undefined) {
							this.anserArray[i].bzzz=this.result.sx;
						}
					}
				}
				//会员等级>0并且保存状态为0，显示保存按钮。
				if (parseInt(this.result.classId)>0&&parseInt(this.result.isSave)==0&&JSON.stringify(this.esData)!=='{}') {
					this.saveShow=true;
				}else{
					this .saveShow=false;
				} 
				//console.log(this.result);
			},
			/* 关闭打赏modal */
			hidePopup: function() {
				this.show = false;
			},
			/* 关闭名词解释 */
			mcjsHidePopup: function() {
				this.mcjs_show = false
			},
			/* 打开名词解释 */
			/* openMcjsModal: function() {
				this.mcjs_show = true;
			}, */
			/* 关闭白话解释 */
			hideBhjs:function(){
				this.bhjs_show=false;
			},
			/* 白话解释 */
			openBhjs:function(){
				this.bhjs_show=true;
			},
			/* 打开打赏弹出框 */
			playing: function() {
				var classid = this.classid;
				if (classid == 0) {
					this.identity = '游客身份'
				} else if (classid == 1) {
					this.identity = '普通会员'
				}
				this.show = true;
			},
			/* 赏金单选 */
			radioMoney: function(evt) {
				for (var i = 0; i < this.moneyArray.length; i++) {
					if (this.moneyArray[i].money == evt.target.value) {
						this.moneyArray[i].checked = true
					} else {
						this.moneyArray[i].checked = false
					}
				}
			},
			intoWzHistory:function(){
				uni.navigateTo({
					url: `../wzHistory/wzHistory?bm=${this.result.bm}`,
				});
			},
			/* 关闭补充证状弹层 */
			supplementHidePopup:function(){
				this.supplementModal=false;
			},
			/* 补充症状*/
			supplement:function(){
				//this.supplementModal=true;
				uni.navigateTo({
					url: '/pages/result/choosezyzz/choosezyzz'
				});
			},
			/* 重新测试按钮 点击返回首页 */
			retest: function() {
				var Jg=uni.getStorageSync('Jg');
				if (global.functionFlag) {
					uni.setStorageSync('pcHistory', false);
					global.answerArray=[]
					uni.navigateTo({
						url: '/pages/index/index'
					});
				}else{
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
				}
			},
			//病症类型详情
			zxmcInfo:function(name){
				console.log(name);
				let bmName=encodeURI(encodeURI(name))
				global.getBzxq(bmName).then(data =>{
					console.log(data);
					let con=data.data;
					let num=con.length;
					for (var i = 0; i < con.length; i++) {
						if (con[i].split('#')[1]=='') {
							num-=1
						}
					}
					if (num<=0) {
						uni.showToast({
							title: '暂无内容',
							icon: 'none'
						});
						return
					}
					this.mcjs_show=true;
					this.bmxq=data.data
				}).catch(err =>{
					uni.showToast({
						title: '服务器错误',
						icon: 'none'
					});
				})
			},
			//查看 辨证论治es查询********************************************************************
			zxcx:function(type){
				let _this=this;
				var nickName=uni.getStorageSync('nickName');
				if (nickName==''||nickName==undefined) {
					global.getUserProfile().then(res =>{
						switch (type){
							case 'bzlz':
								_this.bzlzBtnShow=false;
								_this.getZxcx();
								break;
							case 'jbzd':
								this.jbzdShow=false;
								break;
							case 'yyck':
								_this.yyckShow=false;
								break;
							case 'xgzl':
								this.xgzlShow=false;
								break;
							case 'zyjj':
								this.zyjjShow=false;
								break;
							case 'ysbj':
								this.ysbj_look=false;
								break;
							default:
								break;
						}
					})
				}else{
					switch (type){
						case 'bzlz':
							_this.getZxcx();
							break;
						case 'jbzd':
							this.jbzdShow=false;
							break;
						case 'yyck':
							_this.yyckShow=false;
							break;
						case 'xgzl':
							this.xgzlShow=false;
							break;
						case 'zyjj':
							this.zyjjShow=false;
							break;
						case 'ysbj':
							this.ysbj_look=false;
							break;
						default:
							break;
					}
				}
			},
			//获取辨证论治结果**********************************************************************
			getZxcx:function(){
				//先查看后台是否有保存es结果
				if (JSON.stringify(this.esData)!=='{}') {
					this.bzlzBtnShow=false;
					return
				}
				//获取辨证论治
				let bzbzmc='';
				let glbm=this.result.bm.replace(/\s+/g,"");//${this.result.sbm}
				let sx=this.result.sx;
				let mx='';
				let size=10;
				let page=0;
				let bzmc=this.result.dbSymptom.split(';');
				let type='';
				let bzmc1='';
				let bzmc2='';
				//es查询时，去掉症状内的舌象
				var sxLength=0;
				for (var i = 0; i < (bzmc.length); i++) {
					if (bzmc[i]=='无') {
						bzmc.splice(i,1);
						//continue
					}
				}
				for (var i = 0; i < (bzmc.length); i++) {
					bzbzmc+=`；${bzmc[i]}`
				}
				console.log(bzbzmc.substr(1));
				global.zxcx(bzbzmc.substr(1),glbm,sx,mx,size,page,bzmc1,bzmc2,type).then(data => {
					let zxcxList=data.data.data.mainbz0.zxcxList;
					if (zxcxList.length==0) {
						uni.showToast({
							title: '暂无匹配结果',
							icon: 'none'
						});
						return
					}
					for (var i = 0; i < zxcxList.length; i++) {
						zxcxList[i].show=false;
					}
					this.esData=zxcxList[0]
					this.bzlzBtnShow=false;
					console.log(this.esData);
					if (this.result.classId>0&&this.result.isSave==0) {
						this.saveShow=true;
					}else{
						this.saveShow=false;
					}
					//获取完es结果后再次上传到广海后台
					var es=this.esData;
					var id=this.result.dataId;
					var type=this.esData.zxtype;
					if (type=="Z") {
						type=2
					}else if(type=="B"){
						type=1
					}
					global.saveEsResult(es.zxmc,es.lcbx,es.glxb,es.glzb,es.ckfj,es.zfzz,id,type).then(data =>{
						console.log(data);
					})
				}).catch(err =>{
					console.log(err);
					uni.showToast({
						title: '服务器错误'
					});
				})
			},
			//授权个人信息*************************************************************************
			getUserInfo:function(){
				 let _this=this;
				global.getUserProfile().then(res =>{
					if (res) {
						_this.getZxcx();
						_this.loginStatus=false;
					}
				})
			},
			//重新辩证***************************************************************************
			bzlzClick:function(){
				let gnid=4;//辨证论治功能id=4
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
									global.up(path,type).catch(err =>{
										//
									});
								}
							}
						});
					}else{
						uni.setStorageSync('khResultId',this.result.dataId);//辨证论治结果 保存时使用
						let dyzx=this.result.dbSymptom.split(';');
						let sx=this.result.sx;
						let glbm=`${this.result.bm}；${this.result.sbm}`;
						for (var i = 0; i < dyzx.length; i++) {
							if (dyzx[i]=='无') {
								dyzx.splice(i,1);
								i=i-1;
							}
						}
						console.log(dyzx);
						uni.navigateTo({
							url: `/pages/result/bzlunzhi?dyzx=${dyzx}&sx=${sx}&glbm=${glbm}&bzlzNum=${this.result.bzlzNum}`
						});
					}
				})
				
			},
			//打赏***************************************************************************************************
			formSubmit: function(e) {
				console.log(e.detail.value);
				var money = e.detail.value.radioMoney;
				if (money == 0) {//自定义金额
					money = parseInt(this.inputMoney);
				}
				console.log(money);
				if (money == '') {
					return
				}
				let UnionId = uni.getStorageSync('UnionId'); /* 调用缓存UnionId */
				let body = 'kh';
				global.wxPay(UnionId, money, body);
			},
			//进入易一健康
			skip: function() {
				let path = 'pages/jiankang/start/start';
				global.up(path).then(res =>{
					console.log('成功跳转');
				}).catch(err =>{
					console.log('取消跳转');
				});
			},
			//授权手机号   并且保存结果***********************************************************
			getphoneAndSaveJg:function(e){
				console.log(e);
				if (!e.detail.iv) {
					uni.showModal({
						title: '提示',
						content: '需要得到您的授权，才能进行保存，请您重新授权',
						showCancel: false,
						cancelText: '',
						confirmText: '确定'
					});
					return
				}
				global.getPhoneNumber(e).then(data =>{
					console.log(data);
					this.saveResult();
				})
			},
			//保存结果 关注病症*******************************************************************
			saveResult:function(e){
				var classId='';
				if (this.result.classid==0) {//需要授权
					console.log('需要授权手机号，然后保存...');
					classId=0;
				}else{
					console.log('不需要授权，直接保存，关注病症...');
					classId=1;
				}
				let id=this.result.dataId;
				if (id==null||id==undefined||id=='') {
					uni.showToast({
						title: '没有数据ID',
						icon: 'none'
					});
					return
				}
				if (this.esData.zfzz==undefined) {
					var zfzz=''
				}else{
					var zfzz=encodeURI(encodeURI(this.esData.zfzz));
				}
				if (this.esData.ckfj==undefined) {
					var ckfj=''
				}else{
					var ckfj=encodeURI(encodeURI(this.esData.ckfj));
				}
				/* if (this.esData.zxmc==undefined||this.esData.zxmc==null) {
					var glzx=''
				} else{
					var glzx=encodeURI(encodeURI(this.esData.zxmc));
				} */
				let glbm=this.result.bm;
				/* if (this.esData.glzb!==undefined&&this.esData.glzb!==null&&this.esData.glzb!=='') {//匹配病名，优先从中医病名内匹配，如没有再从西医病名内取病名
					if (this.esData.glzb.indexOf(glbm)>-1) {
						var bzmc=encodeURI(encodeURI(this.esData.glzb));
					} else{
						var bzmc=this.esData.glxb;
						if (bzmc==undefined||bzmc==null||bzmc=='') {
							bzmc=''
						}else{
							bzmc=encodeURI(encodeURI(this.esData.glxb))
						}
					}
				} */
				/* var zxtype=this.esData.zxtype;
				if (zxtype=="Z") {
					var bzmc=encodeURI(encodeURI(this.esData.zxmc));
					var rel_bzmc=encodeURI(encodeURI(this.esData.glzb));
					var type=1;
				}else if(zxtype=="B"){
					var bzmc=encodeURI(encodeURI(this.esData.glzb));
					var rel_bzmc=encodeURI(encodeURI(this.esData.zxmc));
					var type=1;
				} */
				var bzmc=encodeURI(encodeURI(this.esData.glzb));
				var rel_bzmc=encodeURI(encodeURI(this.esData.zxmc));
				var type=1;
				global.saveGzBz(id,zfzz,ckfj,bzmc,rel_bzmc,type,classId).then(data =>{
					console.log(data);
					if (data.data==1) {
						this.saveShow=false;
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
			}
		}
	}
</script>

<style scoped>
	page {
		height: 100%;
	}
	button::after {
		border: none;
	}
	.background{
		width: 100%;
		height: 100%;
		position: fixed;
		z-index: -1;
	}
	.pageall {
		/* height: 100%;
		background-size: 100% 100%; */
		/* background-image: url('~@/static/background.jpg'); */
	}
	.yxzz_text{
		/* display: inline; */
	}
	.replenish{
		display: inline-block;
		color:#276B52;
		line-height: 1;
		border-bottom: 2upx solid #276B52;
		font-style:italic ;
	}
	.wz_history{
		color: #276B52;
		right: 210upx;
		position: absolute;
		font-style: italic;
		font-weight: normal;
		text-decoration:underline;
	}
	.zlck {
		padding-top: 6upx;
		/* overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis; */
	}

	.zlck_text {
		font-weight: 700;
		/* text-decoration: underline; */
	}

	.con_view {
		padding-top: 4upx;
		text-align: justify;
	}
	.bhjs_view{
		background: #FFFFFF;
		padding: 0upx;
		color:#276B52;
		line-height: 1.8;
		display: inline-flex;
		font-style: italic;
	}
	.bhjs_text{
		text-decoration: underline;
	}
	.xt_view {
		position: relative;
		margin-top: 4upx;
		margin-left: 2%;
		margin-right: 2%;
		border: 1px solid #e8e8e8;
		border-radius: 5px;
		background: #fff;
		padding-left: 3%;
		padding-right: 3%;
	}

	.xtGuanzhu_view {
		position: relative;
		margin-top: 20upx;
		margin-left: 2%;
		margin-right: 2%;
		border-radius: 5px;
		background: #fff;
	}

	.xt_title {
		padding: 10upx 0upx;
		font-weight: 700;
		color: #276B52;
		font-family: microsoft yahei;
		border-bottom: 2upx solid #e8e8e8;
	}

	.xt_yhjb {
		padding: 10upx 0upx;
	}
	.seeJbzd{
		color: #333333;
		float: right;
		font-weight: normal;
		font-style: italic;
	}
	.look_more{
		text-align: center;
		color: #276B52;
		font-size: 32upx;
	}
	.look_btn{
		color: #276B52;
		border: 0;
		padding: 0;
		background: #FFFFFF;
		line-height: 2;
		text-decoration: underline;
	}
	.login_btn{
		padding: 0px;
		float: right;
		line-height: 1.5;
		display: inline;
		border-radius: 0;
		font-weight: 300;
		font-style: italic;
		background: #FFFFFF;
	}
	.look_hover{
		color: #00B26A;
		background: #FFFFFF;
	}
	.xt_dashangview {
		margin-top: 10upx;
		margin-left: 2%;
		margin-right: 2%;
		border-radius: 20upx;
	}

	.xt_dashangimg {
		width: 100%;
		height: 200upx;
	}

	.xt_chakanBtn {
		display: inline;
		color: #276B52;
		font-size: 32upx;
		line-height: 1.8;
		background: #FFFFFF;
		border-radius: 6upx;
		padding: 0upx 10upx;
		border-color: #276B52;
		border: 2upx solid #276B52;
	}

	.bazi {
		color: red;
		width: 50upx;
		line-height: 1.4;
		text-align: center;
		display: inline-flex;
	}
	
	.dayun {
		width: 50upx;
		line-height: 1.5;
		text-align: center;
		display: inline-flex;
	}

	.headImg {
		width: 130upx;
		height: 130upx;
		border-radius: 100upx;
	}

	.head_view {
		padding: 30upx;
		padding-top: 60upx;
		text-align: center;
	}

	.nickName {
		font-size: 36upx;
	}

	.youke_text {
		top: 17%;
		left: 36%;
		font-size: 26upx;
		color: #FFFFFF;
		position: absolute;
	}

	.thanks_text {
		display: block;
		color: #CCCCCC;
	}

	.money_radio {
		display: none;
	}

	.money_number {
		color: #276B52;
		font-size: 40upx;
		margin-right: 10upx;
	}

	.money_view {
		padding: 0upx 40upx;
	}

	.radio_label {
		height: 70upx;
		width: 15%;
		line-height: 1.5;
		padding-left: 30rpx;
		border-radius: 6rpx;
		padding-right: 30rpx;
		display: inline-flex;
		margin: 20upx;
		border: 2upx solid #276B52;
	}

	/* .money_input{
	width: 18%;
	margin: 20rpx;
	height: 1.5rem;
	font-size: 32upx;
	border-radius: 6upx;
	padding: 10rpx 20rpx;
	padding-bottom: 14rpx;
	display: inline-flex;
	border: 2upx solid #276B52;
} */
	.money_input {
		height: 1.5rem;
		padding: 8rpx 0rpx;
		display: inline-flex;
	}

	.httz_view {
		margin-top: 30upx;
		text-align: center;
	}

	.httz_text {
	}

	.reward_view {
		width: 100%;
		text-align: center;
		margin-top: 100upx;
		margin-bottom: 100upx;
	}

	.reward_btn {
		width: 60%;
		color: #FFFFFF;
		line-height: 2;
		border-radius: 40upx;
		background: #276B52;
	}

	.againCeshi {
		float: right;
		line-height: 1.5;
		margin-top: 4upx;
		padding-bottom: 2upx;
	}
	.disabled{
		border:2upx solid #CCCCCC;
		color: #CCCCCC;
	}
	.bzz_btn{
		background: #C8C7CC;
	}
	.checkedRadio {
		border-color: #000;
	}

	.closeBtn {
		position: absolute;
		right: 40upx;
		top: 30upx;
		color: #CCCCCC;
	}

	.save_btn {
		width: 80%;
		color: #FFFFFF;
		line-height: 2;
		border-radius: 40upx;
		background: #276B52;
	}
	.save_result{
		width: 75%;
		color: #FFFFFF;
		line-height: 2;
		border-radius: 40upx;
		background: #276B52;
	}
	.login_wx {
		left: 25%;
		width: 50%;
		color: #FFFFFF;
		bottom: 30px;
		line-height: 2;
		background: #276B52;
		position: absolute;
		border: 1px solid #ccc;
	}

	.skip_view {
		margin-bottom: 40upx;
		margin-top: 40upx;
	}

	.skip {
		color: #276B52;
		text-decoration: underline;
	}

	.testNum {
		display: none;
		color: #333333;
		font-size: 28upx;
		font-weight: 100;
	}

	.con_view {
		font-size: 700;
	}

	.modal_hd {
		line-height: 2.5;
		text-align: center;
		border-bottom: 2upx solid #CCCCCC;
	}

	.modal_bd {
		padding: 20upx;
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
	.upbh_text{
		text-decoration: underline;
	}
	.footer{
		width: 100%;
		text-align: center;
	}
	.bmxq_tit{
		font-weight: bold;
	}
	.bmxq_con{
		text-align: justify;
	}
	.ysbj_tit{
		font-size: 34upx;
		font-weight: bold;
	}
	.ysbj_con{
		text-align: justify;
	}
	.heightGlbm{
		display: inline-block;
	}
</style>
