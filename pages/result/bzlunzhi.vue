
<template>     
	<view class="all">
		<!-- <view class="uni-padding-wrap uni-common-mt">
			<uni-segmented-control class="tab_bar" :current="current" :values="items" @clickItem="onClickItem" styleType="text"></uni-segmented-control>
		</view> -->
		<view class="content">
			<!-- 按症状view -->
			<view v-show="current === 0" style="width: 100%;">
				<anzhengzhuang @showOrhiden='show' @func="changeData" :num="bzlzNum"  :zzbxArray="btnArray" :othersArray="othersArray" :sxArray="sxBtnArray" :mxArray="mxBtnArray" :yzbmArray="yzbmBtnArray" v-if="showOrhiden"></anzhengzhuang>
			</view>
			<!-- 按病名view -->
			<view v-show="current === 1" style="width: 100%;">
				<anbingming v-if="hideAnbingMing" @anbingming='anbingming'></anbingming>
			</view>
		</view>
	</view>
</template>

<script>
	import uniSegmentedControl from '@/components/uni-segmented-control.vue';
	import anzhengzhuang from '@/components/wzzy_anzhengzhuang/wzzy_anzhengzhuang.vue';
	import anbingming from '@/components/wzzy_anbingming/wzzy_findByGlbm.vue';
	import helper from '@/common/helper.js';
	export default {
		components: {
			anzhengzhuang,
			anbingming,
			uniSegmentedControl
		},
		data() {
			return {
				bzlzNum:NaN,
				showOrhiden: true,
				glzyzxShow: false,
				showTyfa: false,
				btnArray: [],
				othersArray:[],
				sxBtnArray: [],
				mxBtnArray: [],
				yzbmBtnArray: [],
				explain: '说明: 请点击“+”按钮选择您的病症。',
				items: ['按症状', '按病名'],
				current: 0,
				SearchCon: '',
				hideAnbingMing: true,
				showTiaoYang: false
			}
		},
		onLoad(e) {
			this.bzlzNum=e.bzlzNum;
			console.log(this.bzlzNum);
			if (e.dyzx!==undefined&&e.sx!==undefined&&e.glbm!==undefined) {
				let dyzx=e.dyzx.split(',');
				let sx=e.sx.split(',');
				let glbm=e.glbm.split('；');
				for (var i = 0; i < dyzx.length; i++) {//去除对应证型内的舌象元素
					if (dyzx[i].includes('舌')==true||dyzx[i].includes('苔')==true||dyzx[i]=='') {
						dyzx.splice(i,1)
						i=i-1;
						continue
					}
					this.othersArray.push({ bzzz: dyzx[i],rmv:true});
				}
				for (var i = 0; i < sx.length; i++) {
					if (sx[i]!=='') {
						this.sxBtnArray.push({ bzzz: sx[i],rmv:true});
					}
				}
				for (var i = 0; i < glbm.length; i++) {
					this.yzbmBtnArray.push(glbm[i]);
				}
			}
		},
		computed: {
			/* glzyzxShow:function(){
				if (this.showOrhiden==false) {
					return true
				}else{
					return false
				}
			} */
		},
		onShow: function() {
			uni.$once('func',this.changeData)
			if (global.bzArray.length !== 0) {
				var nameArray = global.bzArray; //选择病症页面传递过来的病症数组
				var zyzxArray = '';
				let index = parseInt(global.wzzyAddImgIndex)
				switch (index) {
					case 1:
						zyzxArray = this.btnArray;
						break;
					case 2:
						zyzxArray = this.othersArray;
						break;
					case 3:
						zyzxArray = this.sxBtnArray;
						break;
					case 4:
						zyzxArray = this.mxBtnArray;
						break;
					case 5:
						zyzxArray = this.yzbmBtnArray;
						break;
				}
				if (zyzxArray.length !== 0) {
					for (var i = 0; i < zyzxArray.length; i++) {
						for (var n = 0; n < nameArray.length; n++) {
							if (zyzxArray[i].bzzz == nameArray[n].split(',')[0]) {
								nameArray.splice(n, 1)
							}
						}
					}
				}
				for (var i = 0; i < nameArray.length; i++) {
					zyzxArray.push({
						bzzz: (nameArray[i].split(',')[0]==undefined?nameArray[i]:nameArray[i].split(',')[0]),
						bzbzmc: (nameArray[i].split(',')[1]==undefined?'':nameArray[i].split(',')[1]),
						rmv:true
					});
				}
				switch (index) {
						case 1:
							this.btnArray=zyzxArray;
							break;
						case 2:
							this.othersArray=zyzxArray;
							break;
						case 3:
							this.sxBtnArray=zyzxArray;
							break;
						case 4:
							this.mxBtnArray=zyzxArray;
							break;
						case 5:
							this.yzbmBtnArray=zyzxArray;
							break;
					}
					global.bzArray=[];
					global.wzzyAddImgIndex=0;
			}
		},
		methods: {
			onClickItem(index) {
				if (this.current !== index) {
					this.current = index;
				}
			},
			//子组件传递的数据
			changeData(data){ 
				console.log(data);
				switch (data.type){
					case 'zzbx':
					this.btnArray=data.array;
						break;
					case 'others':
					this.othersArray=data.array;
						break;
					case 'sx':
					this.sxBtnArray=data.array;
						break;
					case 'mx':
					this.mxBtnArray=data.array;
						break;
					case 'yzbm':
					this.yzbmBtnArray=data.array;
						break;
					default:
						break;
				}
				console.log(this.btnArray);
			},
			/* 子组件传递过来的  点击提交按钮以后如果有返回值，就隐藏选择症状组件，显示关联中医证型组件 */
			show(data) {
				if (data == false) {
					this.showOrhiden = false;
					this.glzyzxShow = true;
				} else {
					this.showOrhiden = true;
					this.glzyzxShow = false;
				}
			},
			/* 中医证型组件  点击修改按钮后 隐藏中医证型组件，显示选择症状组件 */
			showChooseBz(data) {
				this.showOrhiden = data;
				this.glzyzxShow = false;
			},
			/* 中医证型组件  点击修改按钮后 隐藏中医证型组件 显示调养方案组件  */
			show_Tyfa(data) {
				this.showTyfa = data;
				this.glzyzxShow = false;
			},
			/* wzzy_findByGlbm组件传递过来的值 隐藏此组件显示调养方案组件*/
			anbingming(data) {
				this.hideAnbingMing = data;
				this.showTiaoYang = !data;
			},
			emptyCon() {
				this.SearchCon = '';
				this.explainCon = '请根据您搜索的病名，对应中医理论制定调理，养生保健等方案。'
			},


		} /* methods结束 */
	} /* export default */
</script>

<style scoped>
	page {
		height: auto;
	}

	.all {
		padding-top: 0;
		margin-bottom: 10upx;
	}
	.content {
		display: flex;
	}

	.addimg {
		width: 70upx;
		height: 70upx;
		vertical-align: middle;
	}

	.uni_nav {
		display: inline;
		float: right;
		line-height: 100upx;
	}

	.explain {
		padding-left: 30upx;
		font-size: 32upx;
		line-height: 100upx;
	}

	.color-tag {
		width: 50upx;
		height: 50upx;
	}

	.uni-common-mt {
		width: 95%;
		background: #fff;
		margin-top: 0upx;
		padding: 0upx 20upx 2upx 20upx;
		border-bottom: 2upx solid #ccc;
	}

	.submitBtn {
		width: 80%;
		margin-top: 50upx;
		color: #FFFFFF;
		background: #1296db;
	}

	.SearchCon {
		background: #FFFFFF;
		height: 60upx;
		padding: 4upx 50upx;
		border: 2upx solid #CCCCCC;
		font-size: 30upx;
	}

	.SearchView {
		margin-left: 30upx;
		margin-top: 20upx;
		position: relative;
	}

	.searchBtn {
		background: #1296DB;
		color: #FFFFFF;
		margin-left: 40upx;
		margin-right: 40upx;
		font-size: 34upx;
		padding: 0upx 20upx;
		line-height: 2;
	}

	.explainView {
		padding-left: 30upx;
		padding-right: 30upx;
		padding-top: 10upx;
		color: #757575;
		font-size: 30upx;
	}

	.uni-modal__hd {
		border: 2upx solid #CCCCCC;
	}

	.uni_option_serchBtn {
		height: 100%;
		padding: 5px;
		padding-top: 3px;
		border-left: 1px solid #ccc;
		position: absolute;
		right: 3px;
		top: 1px;
		border-radius: 0;
	}

	uni-button:after {
		width: 0;
		height: 0;
	}

	button::after {
		border: none;
	}

	.uni-units {
		background: #FFFFFF;
		border-bottom: 2upx solid #CCCCCC;
	}

	.zzBtn {
		border: 2upx solid #CCCCCC;
	}

	.zzBtn_view {
		padding: 0upx 30upx;
	}

	.lx_view {
		position: absolute;
		top: 76upx;
		background: #fff;
		width: 80.5%;
		padding-left: 20upx;
		border: 1px solid #ccc;
		z-index: 1;
	}

	/* #ifdef H5*/
	.lx_view {
		position: absolute;
		top: 72upx;
		background: #fff;
		width: 80.5%;
		border: 1px solid #ccc;
		z-index: 1;
	}

	/* #endif */
	.zzBtn_view_btn {
		border: 1px solid #CCCCCC;
		padding: 0upx 6upx;
		margin-left: 10upx;
		line-height: 1.8;
	}
</style>
