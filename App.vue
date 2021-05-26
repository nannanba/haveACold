<script>
	import {ajax} from '@/common/ajax.js';
	import * as api from '@/common/API.js';
	import helper from '@/common/helper.js';
	export default {
		onLaunch: function() {
			console.log('App Launch');
			var id=uni.getStorageSync('UnionId');
			/* if (id!=='') {
				global.isUpdateCode();
				global.getTokenStatus=false;
			} */
			const res=uni.getSystemInfoSync();
			console.log(res);
			global.systemInfo=res;
		},
		onShow: function() {//小程序每次从后台进入前台时 若token为空：获取token
			console.log('App Show');
			if (global.getTokenStatus) {
				var UnionId=uni.getStorageSync('UnionId');
				if (UnionId!=="") {
					var token =uni.getStorageSync('code');
					if (token==""||token ==null||token ==undefined) {
						global.updateCode();
					}
					console.log('token:',token);
				}
			}
		},
		onHide: function() {//小程序每次从前台进入后台，清除token
			console.log('App Hide');
			global.getTokenStatus=true;
			uni.removeStorageSync('code');
			clearInterval(global.codeIntervalId);//停止有效码验证
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import './common/uni.css';
	@font-face {
	  font-family: 'w-iconfont';  /* project id 1111526 */
	  src: url('//at.alicdn.com/t/font_1111526_vr7mpmcne3.eot');
	  src: url('//at.alicdn.com/t/font_1111526_vr7mpmcne3.eot?#iefix') format('embedded-opentype'),
	  url('//at.alicdn.com/t/font_1111526_vr7mpmcne3.woff2') format('woff2'),
	  url('//at.alicdn.com/t/font_1111526_vr7mpmcne3.woff') format('woff'),
	  url('//at.alicdn.com/t/font_1111526_vr7mpmcne3.ttf') format('truetype'),
	  url('//at.alicdn.com/t/font_1111526_vr7mpmcne3.svg#iconfont') format('svg');
	}
	.jtDown{
		font-family: 'w-iconfont';
		color: #000000;
	}
	page{
		height: 100%;
	}
	/* 删除组 */
	.removeGroup{
		color: red;
		font-size: 36upx;
		font-family: 'w-iconfont';
	}
	.addGroup{
		color: #1296DB;
		font-size: 44upx;
		font-family: 'w-iconfont';
	}
	.remove{
		font-family: 'w-iconfont';
		font-size: 30upx;
	}
	.money {
		font-family: 'w-iconfont';
		color: #276B52;
		font-size: 50upx;
	}
	
	.yes {
		color: red;
		font-size: 32upx;
		font-family: 'w-iconfont';
	}
	
	.removeBtn {
		font-family: 'w-iconfont';
		font-size: 32upx;
	}
	/* 更多 */
	.more_icon{
		color: #888888;
		font-size: 24upx;
		font-family: 'w-iconfont';
	}
	.youke{
		font-size: 42upx;
		color: #1296DB; 
		font-family: 'w-iconfont';
	}
	.modal_close{
		color: #A6803F;
		font-size: 30upx;
		padding: 6upx;
		font-family: 'w-iconfont';
	}
	.xiangqing{
		font-weight: 400;
		color: #333333;
		float: right;
		font-size: 26upx;
		padding-top: 6upx;
		padding-left: 10upx;
		font-family: 'w-iconfont';
	}
	.packUp{
		font-size: 30upx;
		padding-left: 6upx;
		font-family: 'w-iconfont';
	}
	.suosou{
		font-family: 'w-iconfont';
		color: #1296DB;
		font-size: 38upx;
		line-height: 1;
		height: 40upx;
	}
	.remove-img{
		font-family: 'w-iconfont';
		color: #CCCCCC;
		font-size: 32upx;
		line-height: 0;
		z-index: 999;
		position: absolute;
		top: 26upx;
		right: 4upx;
	}
	.jieshi{
		color: #CCCCCC;
		font-family: 'w-iconfont';
		font-size: 32upx;
		width: 20%;
		}
	.select{
		float: right;
		font-size: 14px;
		font-family: 'w-iconfont';
	}
	/* 11/30   修改 */
	.rmv-btn{
		font-family: 'w-iconfont';
		font-size: 20px;
	}
	/* 急症自助 **************************************************************************************************************************/
	.hot_icon{
		color: red;
		font-size: 32upx;
		margin-left: 10upx;
		font-family: 'w-iconfont';
	}
</style>
