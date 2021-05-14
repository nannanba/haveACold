import * as api from './API.js';
import {ajax} from './/ajax.js';
import {tokenAjax} from './/ajax.js';
import App    from '@/App.vue';
 //支付======================================================================================
 global.wxPay=function(UnionId, total_fee,body) {
	 console.log('111');
 		uni.request({ //向后端发起请求，由后端调用 jsapi.java 统一下单并返回结果
 			url: api.wxPayapi, //
 			data: {
 				wxId: UnionId, //向后端传送用户的openId
 				totalPrice: total_fee, //这里向后端传送订单的金额
				body:body,//商品描述
 			},
 			success: function(res) {
 				console.log(res);
				if (res.data==''||res.data==null) {
					uni.showToast({
						title: '服务器内部错误',
						icon: 'none'
					});
					return
				}
 				uni.requestPayment({ //将返回的参数对应填上去！
					'provider':'wxpay',
 					'timeStamp': res.data.timeStamp,
 					'nonceStr': res.data.nonceStr,
 					'package': res.data.package,
 					'signType': res.data.signType,
 					'paySign': res.data.sign,
 					success: function(res1) {
 						console.log(res1);
 					},
 					fail: function(err) {
 						console.log(err);
						uni.showToast({
							title: '已取消支付',
							icon: 'none'
						});
 					},
 				});
 			}
 		});
 	},
	//获取code************************************************************
	global.code=function(){
		return new Promise(function(resolve,rej){
			uni.login({
				provider: 'weixin',
				success: res => {
					uni.setStorageSync('loginCode',res.code);
					console.log(res.code);
					resolve(res)
				},
				fail: error => {
					rej(error)
				}
			});
		})
	}
	//新增 静默登录******************************************************
	global.getUnionId=function(){
		console.log('在正登录....');
		uni.login({
			success:res =>{
				console.log(res.code);
				var param={
					code:res.code,
					type:2  //1:主程序 2：快好  3：先天体质  4：后天体质
				}
				ajax({
					url:api.login,
					method:'POST',
					data:param,
					success:res2 =>{
						console.log(res2);
						//缓存用户ID
						uni.setStorageSync('UnionId',res2.data[0]);
						uni.setStorageSync('classId', res2.data[1]);//用户等级
						global.isUpdateCode();
						global.getTokenStatus=false;
						//查询次数
						global.getUserCtrl(6);
					},
					fail:err =>{
						console.log('登陆失败');
					}
				})
			}
		})
	}
	//上传用户信息=======================================================================
	global.saveUserInfo=function(param){
		var params={
			userInfo:param
		}
		tokenAjax({
			url:api.saveUserInfo,
			method:'POST',
			data:params,
			success:res2 =>{
				console.log(res2);
				if (res2.data==1) {
					console.log('保存成功');
				}else{
					console.log('保存失败...');
				}
			},
			fail:err =>{
				console.log('保存用户信息失败.....');
			}
		})
	}
	//授权个人信息*********************************************************************************
	global.getUserProfile=function(){
		return new Promise(function(resolve,rej){
			uni.getUserProfile({
				desc: '用于完善会员资料',
				success: (res) => {
					//授权成功  保存用户信息
				    console.log(res);
					var param=res.userInfo;
					uni.setStorageSync('nickName',param.nickName);
					uni.setStorageSync('headImg',param.avatarUrl);
					var UnionId=uni.getStorageSync('UnionId');
					param.unionid=UnionId;
					console.log(param);
					param=JSON.stringify(param);
					global.saveUserInfo(param);//保存用户信息
					global.loginStatus=false;
					resolve(true);
				},
				fail:(err) =>{
					console.log(err);
					uni.showModal({
						title: '提示',
						content: '需要得到您的授权才能继续查看，请重新授权',
						showCancel: false,
						confirmText: '确定'
					});
					return
				}
			})
		})
	}
	//获取  功能次数************************************************************************
	global.functionFlag=null;
	global.getUserCtrl=function(gnId){
		return new Promise(function(resolve,rej){
			tokenAjax({
				url:api.getUserCtrl,
				data:{
					wxId:uni.getStorageSync('UnionId'),
					gnId:gnId
				},
				success:res=>{
					console.log(res); 
					var data=res.data[0];
					if (data.leftTime>0) { 
						global.functionFlag=true;
						resolve(true);
					}else{
						global.functionFlag=false;
						resolve(false);
					}
				},
				fail: err=>{
					console.log(err);
					rej(err)
				}
			})
		})
	}
	//辩证论治次数 减1***********************************************************************
	global.setBzlzTime=function(){
		let id=uni.getStorageSync('UnionId');
		tokenAjax({
			url:api.setBzlzTime,
			data:{
				wxId:id
			},
			success: (res) =>{
				console.log(res);
			},
			fail: (err) =>{
				console.log(err);
			}
		})
	}
	//登录========================================================================================
	global.login=function(e){
		console.log(e);
		return new Promise(function(resolve,rej){
			if (!e.detail.iv) {
				uni.showToast({ 
					title: '授权失败',
					icon: 'none'
				})
				return
			}
			uni.showLoading({
				title: '正在登录...',
				mask: true
			});
			let code=uni.getStorageSync('loginCode');
			console.log('缓存code信息：',code);
			var param={
					encryptedData:e.detail.encryptedData,
					iv:e.detail.iv,
					code:code
				}
				console.log(param);
			ajax({
				url:api.login,
				method: "POST",
				timeout:60000,
				data:param,
				success:res=>{
					uni.hideLoading();
					console.log(res);
					if (res.statusCode!==200) {
						uni.showToast({
							title: '请稍后重试',
							icon: 'none'
						});
						//登录失败后获取一次code  下次登录时使用最新缓存code
						global.code();
						return
					}
					if (res.data[0]==''||res.data[0]==undefined||res.data[0]==null) {
						uni.showToast({
							title: '登陆失败,稍后重试',
							icon: 'none'
						});
						//登录失败后获取一次code  下次登录时使用最新缓存code
						global.code();
						//resolve(res)
						return
					}
					clearInterval(global.loginInterval);//清除 定时获取code
					uni.setStorageSync('nickName',e.detail.userInfo.nickName);//昵称
					uni.setStorageSync('headImg', e.detail.userInfo.avatarUrl);//头像
					uni.setStorageSync('gender', e.detail.userInfo.gender);//性别
					uni.setStorageSync('UnionId',res.data[0]);//登陆后，将后台返回的用户UnionId缓存起来
					uni.setStorageSync('sessionKey',res.data[1]);//登陆后，将后台返回的用户sessionKey缓存起来
					global.updateCode();
					resolve(res);
					console.log('登陆完后台返回的信息',res);
				},
				fail:err=>{
					rej(err)
				}
			})
		})
	}
	//检查后台是否有测算结果========================================================================
	global.getResult=function(url){
		return new Promise(function(resolve,rej){
		let UnionId = uni.getStorageSync('UnionId'); //获取用户UnionId
		if (UnionId=='') {
			uni.showToast({
				title: '用户ID为空',
				icon: 'none'
			});
			return
		}
		if (UnionId==undefined) {
			uni.showToast({
				title: '用户ID未定义',
				icon: 'none'
			});
			return
		}
		tokenAjax({
			url: api.getResult,
			method: 'GET',
			data: {
				wxId: UnionId
			},
			success: res => {
				resolve(res.data)
				console.log(res);
				uni.setStorageSync('checkSession', true);
				uni.setStorageSync('login', false);
				uni.setStorageSync('Jg',res.data);
			},
			fail:err => {
				rej(err)
			}
		})
		})
	},
	//首页获取病名==========================================================================
	global.getBm=function(){
		return new Promise(function(resolve,rej){
			uni.request({
				url: api.getBm,
				method: 'GET',
				data: {},
				success: res => {
					resolve(res);
				},
				fail: err => {
					rej(err);
					console.log(err);
				},
			});
		})
	},
	//获取病症=====================================================================================
	global.getWz=function(bmId,groupNo){
		return new Promise(function(resolve,rej){
			uni.request({
				url: api.getWz,
				method: 'GET',
				data: {
					bmId:bmId,
					groupNo:groupNo
				},
				success: res => {
					resolve(res.data);
				},
				fail: err => {
					rej(err);
				}
			});
		})
	},
	//上传感冒结果========================================================================================
	global.getJg=function(result,userId,bmId){
		return new Promise(function(resolve,rej){
			uni.showLoading({
				title: '正在提交...',
				mask: false
			});
			uni.request({
				url: api.getJg,
				method: 'GET',
				data: {
					wxId:userId,
					jg:result,
					bmId:bmId,
					flag:global.flag
				},
				success: res => {
					resolve(res)
					if (res.data!=='') {
						uni.setStorageSync('Jg',res.data);
					}
				},
				fail: err => {
					rej(err)
				},
				complete: () => {
					uni.hideLoading();
				}
			})
		})
	}
	global.yxzz = [];//已选症状集合
	global.againWzzyList=[];//重新辩证  结果集合
	//获取治疗方案==============================================================================================
	global.zxcx=function(bzbzmc,glbm,sx,mx,size,page,bzmc1,bzmc2,type){
		return new Promise(function(resolve,rej){
			uni.showLoading({
				title: '加载中...',
				mask: false
			});
			tokenAjax({
				url: api.zxcx,
				method: 'GET',
				data: {
					bzbzmc:bzbzmc,
					glbm:glbm,
					sx:sx,
					mx:mx,
					size:size,
					page:page,
					type:type,
					bzmc1:bzmc1,
					bzmc2:bzmc2
				},
				success: res => {
					resolve(res);
					uni.hideLoading();
				},
				fail: err => {
					console.log(err);
					rej(err);
					uni.hideLoading();
				}
			});
		})
	}
	//重新辩证  保存关注病症****************************************************************************
	/* 问症知医 保存关注病症****************************************************************** */
	global.saveWzzyGzbz=function(array,checkedbzzz,isHaveBm){
		var gzbzArray=[];
		for (var i = 0; i < array.length; i++) {
			if (array[i].zxtype=='Z') {
				if (isHaveBm) {//输入了已知病名  类型z改为b  
					var obj={
						bzmc:array[i].glbmString,
						rel_bzmc:array[i].gs_zxmc==null?'':array[i].gs_zxmc, 
						/* rel_bzmc:'', */
						select_option:'',
						type:'B'
					}
				}else{
					var obj={
						bzmc:array[i].gs_zxmc,
						rel_bzmc:array[i].glbmString,
						/* rel_bzmc:'', */
						select_option:'',
						type:array[i].zxtype
					}
				}
			}else{
				var obj={
					bzmc:array[i].glzb,
					/* rel_bzmc:array[i].gs_zxmc, */
					rel_bzmc:array[i].gs_zxmc==null?'':array[i].gs_zxmc,
					/* rel_bzmc:'', */
					select_option:'',
					type:array[i].zxtype
				}
			}
			var bzzzString='';
			for (var n = 0; n < checkedbzzz.length; n++) {
				if (checkedbzzz[n].bzzz==undefined) {
					bzzzString+=';'+checkedbzzz[n];
				}else{
					bzzzString+=';'+checkedbzzz[n].bzzz;
				}
			}
			bzzzString=bzzzString.substr(1);
			obj.select_option=bzzzString;
			gzbzArray.push(obj);
		}
		return new Promise(function(resolve,rej){
			var obj={
				wxid:uni.getStorageSync('UnionId'),
				params:JSON.stringify(gzbzArray)
			}
			console.log(obj);
			tokenAjax({
				url:api.saveWzzyGzbz,
				data:obj,
				method:'POST',
				success:res =>{
					console.log(res);
					if (res.data==1) {//关注成功后 关注病症的刷新标识为true 在适当时机判断此标识 为true时才获取最新关注病症
						global.gzbzRefresh=true;
					}
					resolve(res);
				},
				fail: err=>{
					console.log(err);
					rej(err);
				}
			})
		})
	}
	//验证后台是否有此用户手机号==========================================================================================
	global.isPhoneNumber= function(){ 
		let UnionId=uni.getStorageSync('UnionId');
		return new Promise(function(resolve,rej){
			uni.request({
				url: api.UnionIdapi,
				method: 'GET',
				data: {
					wxId:UnionId
				},
				success: res => {
					resolve(res.data);
					console.log(res.data);
					uni.setStorageSync('phoneNumberStatus',res.data);
				},
				fail: error => {
					rej(error);
					uni.showToast({
						title: '服务器内部错误',
						icon: 'none'
					});
				}
			});
		})
	},
	//统一获取手机号方法=======================================================
	global.getPhoneNumber=function(e){
		return new Promise(function(resolve,rej){
			let UnionId=uni.getStorageSync('UnionId');
			var param={
				encryptedData:e.detail.encryptedData,
				iv:e.detail.iv,
				uId:UnionId
			}
			ajax({/* 授权手机号成功后将带有手机号的加密数据传输到后台解密 */
				url:api.getPhoneNumber,
				method:'POST',
				data:param,
				success:res =>{
					if (res.data==1) {
						uni.setStorageSync('phoneNumber',res.data);//缓存用户手机号
						resolve(res);
					}else{
						uni.showToast({
							title: '授权手机号失败  代码：1003',
							icon: 'none'
						});
						return
					}
				},
				fail: err2 => {
					rej(err);
				}
			})
		})
	}
	
	//跳转小程序========================================================================================
	 global.up=function(path,type){//type 跳转后的目的：进入对应功能 或者升级
		 console.log('正在跳转小程序');
		 global.isPhoneNumber();
		 return new Promise(function(resolve,rej){
			let nickName=uni.getStorageSync('nickName');
			let headImg=uni.getStorageSync('headImg');
			let UnionId=uni.getStorageSync('UnionId');
			let phone  =uni.getStorageSync('phoneNumberStatus');
			uni.navigateToMiniProgram({
			  appId: 'wxab7f96196d20b1ff',
			  path: '',
			  extraData: {
				type:type,
				path:path,
				name: 'kh',
				phone:phone,
				wxId:UnionId,
				headImg:headImg, 
				nickName:nickName
			  },
			  envVersion:'trial',//''develop
			  success(res) {
				// 打开成功
				resolve(res)
			  },
			  fail(err) {
				  rej(err);
			  }
			})
		 })
		
	},
	//获取用户测算数据=====================================================================================
	global.getXttzData=function(UnionId){
		return new Promise(function(resolve,rej){
			uni.request({
				url: api.getResult,
				method: 'GET',
				data: {
					wxId:UnionId
				},
				success: res => {
					resolve(res.data);
				},
				fail: err => {
					rej(err);
				}
			});
		})
	}
	/* 获取首页说明 */
	global.getGnTitle=function(){
		return new Promise(function(resolve,rej){
			uni.showLoading({
				title: '加载中...',
				mask: false
			});
			uni.request({
				url: api.getGnTitle,
				method: 'GET',
				data: {
					gnId:5
				},
				success: res => {
					setTimeout(uni.hideLoading, 300);
					resolve(res.data)
				},
				fail: err => {
					setTimeout(uni.hideLoading, 300);
					rej(err)
				}
			});
		})
	}
	
	/* 获取结果页病症类型详情*************************************************************************** */
	global.getBzxq=function(name){
		 return new Promise(function(resolve,rej){
			 console.log(name);
			uni.request({
				url: api.getBzlz,
				method: 'GET',
				data: {
					bm:name
				},
				success: res => {
					resolve(res);
				},
				fail: err => {
					rej(err)
				}
			});
		})
	}
	//获取病症历史============================================================
	global.gethistory=function(bmId,page){
		let wxId=uni.getStorageSync('UnionId');
		console.log(bmId);
		console.log(page);
		console.log('微信id：',wxId);
		return new Promise(function(resolve,rej){
			uni.showLoading({
				title: '加载中...',
				mask: false
			});
			uni.request({
				url: api.gethistory,
				method: 'GET',
				data: {
					wxId:wxId,
					bmId:bmId,
					pgNo:page,
					pgSize:20
				},
				success: res => {
					resolve(res)
				},
				fail: error => {
					rej(error)
				},
				complete: () => {
					setTimeout(function(){
						uni.hideLoading();
					},500);
				}
			});
		})
	}
	//问症历史详情======================================================================================
	global.gethistoryById=function(id){
		return new Promise(function(resolve,rej){
			uni.showLoading({
				title: '加载中...',
				mask: false
			});
			uni.request({
				url: api.gethistoryById,
				method: 'GET',
				data: {
					id:id
				},
				success: res => {
					resolve(res)
				},
				fail: err => {
					rej(err)
				},
				complete: () => {
					uni.hideLoading();
				}
			});
		})
	}
	//保存结果至关注病症========================================================================
	global.saveGzBz=function(id,zfzz,ckfj,bzmc,rel_bzmc,type,classId){
		return new Promise(function(resolve,rej){
			uni.showLoading({
				title: '加载中...',
				mask: false
			});
			let wxId=uni.getStorageSync('UnionId');
			uni.request({
				url: api.saveGzbz,
				method: 'GET',
				data: {
					wxId:wxId,
					dataId:id,
					zfzz:zfzz,
					ckfj:ckfj,
					bzmc:bzmc,
					classId:classId,
					relbzmc:rel_bzmc,
					type:1
				},
				success: res => {
					resolve(res)
				},
				fail: err => {
					rej(err)
				},
				complete() {
					uni.hideLoading();
				}
			});
		})
	}
	/* //问症知医选择症状=========================================================
	global.getSymptom=function(){
		return new Promise(function(resolve,rej){
			uni.showLoading({
				title: '加载中...',
				mask: false
			});
			uni.request({
				url: api.getSymptom,
				method: 'GET',
				data: {},
				success: res => {
					resolve(res)
				},
				fail: err => {
					rej(err)
				},
				complete: () => {
					uni.hideLoading();
				}
			});
		})
	} */
	//es结果上传后台  海哥===========================================================
	global.saveEsResult=function(zxmc,lcbx,xgxb,xgzb,zfzz,ckfj,id,type){
		return new Promise(function(resolve,rej){
			uni.showLoading({
				title: '加载中...',
				mask: false
			});
			let wxId=uni.getStorageSync('UnionId');
			uni.request({
				url: api.saveEsResult,
				method: 'GET',
				data: {
					wxId:wxId,
					dataId:id,
					zyzx:zxmc==null?'':encodeURI(encodeURI(zxmc)),
					lcbx:lcbx==null?'':encodeURI(encodeURI(lcbx)),
					xbm:xgxb==null?'':encodeURI(encodeURI(xgxb)),
					sbm:xgzb==null?'':encodeURI(encodeURI(xgzb)),
					zfzz:zfzz==null?'':encodeURI(encodeURI(zfzz)),
					ckfj:ckfj==null?'':encodeURI(encodeURI(ckfj)),
					type:type
				},
				success: res => {
					resolve(res);
				},
				fail: (err) => {
					rej(err);
				},
				complete: () => {
					uni.hideLoading();
				}
			});
		})
	},
	// token 相关************************************************************************************************************
	//计算时间*****************************************************************************************************************
	global.zeroPadd=function (date){
		var year=date.getFullYear();
		var month=date.getMonth()+1;
		if (month<10) {
			month='0'+month;
		}
		var day=(date.getDate()<10?'0'+date.getDate():date.getDate());
		var hour=(date.getHours()<10?'0'+date.getHours():date.getHours());
		var minu=(date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes());
		var send=(date.getSeconds()<10?'0'+date.getSeconds():date.getSeconds());
		var newDate=year.toString()+month.toString()+day.toString()+hour.toString()+minu.toString()+send.toString();
		return newDate
	}
	global.intervalId='';//定时器id
	global.codeIntervalId='';//有效码 定时器id
	global.cesuan=function(){
		var date = new Date();
		var date1 = new Date().getTime();	// 获取当前时间戳
		// 当前时间戳+3600s（一小时，其他时间通过计算时间戳进行相应加减），重新设置 Date 对象
		date.setTime(date1 + 3600000);	
		var oneHourAfter=zeroPadd(date);
		uni.setStorageSync('oneHourAfter',oneHourAfter);
	}
	//获取有效码*********************************************************************************************
	global.updateCode=async function(){
			console.log('有效码开始更新............');
			var id=uni.getStorageSync('UnionId');
			if (id=="") {
				uni.showToast({
					title: '用户ID为空'
				});
				clearInterval(global.codeIntervalId);//停止每秒查询一次登录有效期
				return
			}
			var [error, res] = await uni.request({
				url: api.infoCode,
				method: 'GET',
				data: {uId:id},
			});
			console.log(res);
			if (res==undefined) {
				global.updateCode();
				return
			}
			if (res.statusCode==200) {
				//有效码获取成功
				console.log('有效码更新结束...');
				//请求完token后，给token设置失效时间
				var date = new Date();
				var date1 = new Date().getTime();// 获取当前时间戳
				// 当前时间戳+300s（4分钟，其他时间通过计算时间戳进行相应加减），重新设置 Date 对象
				date.setTime(date1 + 240000);	
				var tokenTime=global.zeroPadd(date);
				uni.setStorageSync('tokenTime',tokenTime);
				uni.setStorageSync('code',res.data[0]);//缓存code
				global.Timewait();
			}else{
				//有效码更新失败
				global.updateCode();
			}
	}
	//是否需要更新token
	global.isUpdateCode=function(){
		//先判断token是否存在 然后判断token有效期，有效不执行操作，无效重新请求token
		var token=uni.getStorageSync('code');
		if (token==""||token ==null||token ==undefined) {//如果token不存在  直接请求token 不再向下执行函数
			console.log('token 不存在');
			global.updateCode();
			return
		}
		console.log('判断token有效期...');
		var currentDate=new Date();
		var currentTime=global.zeroPadd(currentDate);//当前时间
		var tokenTime=uni.getStorageSync('tokenTime');//token失效时间
		if (tokenTime!=="") {
			if (currentTime>=tokenTime) {//时间超时：更新token码。未超时：开始计时
				global.updateCode();
			}else{
				global.Timewait();//
			}
		}else{
			global.updateCode();
		}
	}
	//每秒执行一次，判断是否需要更新有效码
	global.Timewait=function(){
		global.codeIntervalId=setInterval(()=>{
			console.log('token有效，验证有效期...');
			var currentDate=new Date();
			var currentTime=global.zeroPadd(currentDate);//当前时间
			var tokenTime=uni.getStorageSync('tokenTime');//token失效时间
			if (currentTime>=tokenTime) {
				console.log('开始更新有效码(全局触发)...');
				global.updateCode();
				clearInterval(global.codeIntervalId);//停止有效码验证
			}
		},1000);
	}
	//请求问症知医相关症状*****************************************************************************************
	global.getRelation=function(name,type){
		var types=null;
		switch (type){
			case 1:case 2:
				types=0
				break;
			case 3:
				types=1
				break;
			case 4:
				types=2
				break;		
			default:
				break;
		}
		return new Promise(function(resolve,rej){
			tokenAjax({
				url:api.getRelation,
				data:{
					name:encodeURI(name),
					type:types
				},
				success:res=>{
					console.log(res);
					resolve(res);
				},
				fail:err=>{
					rej(err)
				}
			})
		})
	}
	//获取 中西医病名列表************************************************************************
	global.getZbxb=function(name){
		return new Promise(function(resolve,rej){
			tokenAjax({
				url:api.findIdNameByName,
				data:{
					name:encodeURI(name)
				},
				success: res=>{
					resolve(res)
				},
				fail: err=>{
					rej(err);
				}
			})
		})
	}
	//问症知医根据type类型 选择症状=========================================================
	global.getSymptom=function(type){
		console.log(type);
		return new Promise(function(resolve,rej){
			tokenAjax({
				url: api.getSymptomByType,
				method: 'GET',
				data: {
					type:type
				},
				success: res => {
					resolve(res)
				},
				fail: err => {
					rej(err)
				},
				complete: () => {
					uni.hideLoading();
				}
			});
		})
	}
	//请求舌象图*******************************************************
	global.getSxtByName=function(name){
		return new Promise(function(resolve,rej){
			tokenAjax({
				url:api.getSxtByName,
				data:{
					name:encodeURI(name),
				},
				success:res=>{
					console.log(res);
					resolve(res);
				},
				fail:err=>{
					rej(err)
				}
			})
		})
	}
	global.helperData={
		loginView:false,//登录弹层
		phoneBtn:false//获取手机号按钮
	}
	global.answerArray=[];
	global.groupPro=[];
	global.clickNum=0;
	global.flag=0;
	global.symptom=[];
	global.bzArray=[];
	global.supplementArray=[];
	global.wzzyAddImgIndex=0;
	global.titleArray=[];
	global.serialNumber=1;
	global.getTokenStatus=false;//为阻止APP launch与APP SHOW 同时触发获取code
	global.loginInterval='';//微信 login获取code的定时器
	global.systemInfo={}
	global.sxmxSymptom=[];
	global.loginStatus=false;
 /* 用户头像，昵称 */
export const nickName = '';
export const headImg = '';
