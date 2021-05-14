export const ajax = (opt) => {
	 opt = opt || {};
    opt.url = opt.url || '';
    opt.data = opt.data || null;
    opt.method = opt.method || 'GET';
    opt.header = opt.header || {
        "Content-Type": "application/json"
    };
    opt.success = opt.success || function () {};
    uni.request({
        url:opt.url,
        data:opt.data || null,
        method: opt.method,
        header: opt.header, 
		header:opt.header,
        dataType: 'json',
        success: function (res) {
            opt.success(res);
        },
        fail: function (err) {
			console.log(err)
            uni.showToast({
            	title: '服务器连接失败',
            	icon: 'none'
            });
        }
    })
}
//携带token  请求*********************************************************************************
var requestNum=0;
var storageOpt={};
export const tokenAjax = (opt) => {
	storageOpt=opt;
	//未过期，每次请求刷新登录有效期计时
	uni.showLoading({
		title: '加载中...',
		mask: false
	});
	//请求时有效码即将到期
	var currentDate=new Date();
	var currentTime=global.zeroPadd(currentDate);//当前时间
	var tokenTime=uni.getStorageSync('tokenTime');//token失效时间
	var token=uni.getStorageSync('code');
	console.log(parseInt(tokenTime)-parseInt(currentTime));
	var requestId='';
	if (tokenTime-currentTime<=3) {
		console.log('延时请求已开始');
		requestId=setInterval(()=>{//每一秒执行一次：将老的token与新的token比较  不相等时说明token已更新，再发起请求
			var newToken=uni.getStorageSync('code');
			if (token !== newToken) {
				request(opt);
				clearInterval(requestId);
			}
		},1000);
	}else{
		request(opt);
	}
}
//数据请求
function request(opt){
	requestNum+=1;
	uni.request({
	    url:opt.url,
	    data: opt.data,
	    method: opt.method ||'GET',
		header:{'Content-Type':'application/json'},
		header:{'Content-Type':'text/html;charset=utf-8'},
		header:{'Access-Control-Allow-Origin':'*'},
		header:{'Access-Control-Allow-Methods':'*'},
		header:{'Access-Control-Allow-Headers':'x-requested-with,content-type'},
		header:{'token':uni.getStorageSync('code')},
	    dataType: 'json',
	    success: function (res) {
			uni.hideLoading();
			if (res.data.code==424) {//后台返回有效码不合法，清除code重新请求，缓存code 再次发起本请求
				if (requestNum<=2) {
					global.updateCode();
					request(opt);
				}else{
					uni.showModal({
						title: '提示',
						content: 'TOKEN 值无效',
						showCancel: false,
						cancelText: '',
						confirmText: '确定'
					});
				}
			}
	        opt.success(res);
	    },
	    fail: function () {
			uni.hideLoading();
			uni.showToast({
				title: '请求失败，请稍后重试',
				icon: 'none'
			});
	    }
	})
}