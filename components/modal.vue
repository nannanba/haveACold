<template>
	<view>
		<view class="uni-mask" v-show="show" :style="{top:offsetTop + 'px'}" @click="hide"></view>
		<view :class="['uni-popup','uni-popup-'+type]" v-show="show">
			{{msg}}
			<slot></slot>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			show: {
				type: Boolean,
				default: false
			},
			type: {
				type: String,
				//top - 顶部， middle - 居中, bottom - 底部
				default: 'middle'
			},
			msg: {
				type: String,
				default: ""
			}
		},
		data() {
			let offsetTop = 0;
			return {
				offsetTop: offsetTop
			}
		},
		methods: {
			hide: function() {
				this.$emit('hidePopup');
			}
		}
	}
</script>
<style>
.uni-mask {
	position: fixed;
	z-index: 999;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	background-color: rgba(0, 0, 0, .3);
	}

.uni-popup {
	position: fixed;
	z-index: 999;
	background-color: #ffffff;
	box-shadow: 0 0 30upx rgba(0, 0, 0, .1);
	}
.uni-popup-sjzzShow{
	display: flex;
	flex-direction: column;
	width: 80%;
	/* height: 25%; */
	border-radius: 20upx;
	top: 45%;
	left: 50%;
	overflow: scroll;
	z-index: 1006;
	transform: translate(-50%, -50%);
}
.uni-popup-zzjsModal{
	display: flex;
	flex-direction: column;
	width: 80%;
	height: 70%;
	border-radius: 20upx;
	top: 45%;
	left: 50%;
	overflow: scroll;
	z-index: 1006;
	transform: translate(-50%, -50%);
}
.uni-popup-middle {
	display: flex;
	flex-direction: column;
	width: 90%;
	height: auto;
	border-radius: 10upx;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	}
.uni-popup-esSeach {
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
	border-radius: 0upx;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	}
.uni-popup-login {
	display: flex;
	flex-direction: column;
	width: 70%;
	height: 40%;
	overflow: scroll;
	border-radius: 10upx;
	top: 55%;
	left: 50%;
	transform: translate(-50%, -50%);
	}
.uni-popup-skipHint {
	display: flex;
	flex-direction: column;
	width: 80%;
	height: 300upx;
	border-radius: 10upx;
	top: 48%;
	left: 50%;
	overflow: scroll;
	transform: translate(-50%, -50%);
}

.uni-popup-top {
	top: 0;
	left: 0;
	width: 100%;
	height: 100upx;
	line-height: 100upx;
	text-align: center; 
	}

.uni-popup-bottom {
	left: 0;
	bottom: 0;
	width: 100%;
	height: 100upx;
	line-height: 100upx;
	text-align: center;
	}
	/* 感冒名词解释css */
	.uni-popup-mcjs {
		display: flex;
		flex-direction: column;
		width: 90%;
		height: 80%;
		border-radius: 10upx;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		}
	.uni-popup-symptom {
		display: flex;
		flex-direction: column;
		width: 75%;
		border-radius: 10upx;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		}
	.uni-popup-jeishi {
		display: flex;
		flex-direction: column;
		width: 100%;
		overflow: scroll;
		top: 78%;
		left: 50%;
		border-top-left-radius: 30upx;
		border-top-right-radius: 30upx;
		transform: translate(-50%, -50%);
		}
</style>
