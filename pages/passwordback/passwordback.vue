<template>
	<view class="changePhone">
		<!-- header -->
		<commonHeader headerTitl="找回交易密码" xingHide=true lingHide=true fenxiangHide=true></commonHeader>
		<input type="text" value="" placeholder="请输入手机号" @input="enter" maxlength="11" :class="testCode===0?'testsuc':''||testCode===1?'testerr':''||testCode===2?'':''"/>
		<view class="getcode">
			<input type="text" value="" maxlength="6" @input="gettestcode" placeholder="请输入验证码"/>
			<button class="testCode" :class="selectCode?'selectCode':''" :disabled="disabled"  @tap="getCode">{{codeText}}</button>
		</view>
		<input type="password" :value="pwd" placeholder="设置6位数交易密码" @input="setpwd" maxlength="6"/>
		<input type="password" :value="pwd1" placeholder="确认密码" @blur="setpwd1" maxlength="6"/>
		
		<button class="login-content-btn" :disabled="btnState" :class="btnState?'btnState':''" @tap="submit">确认</button>
	</view>
</template>

<script>
	import share from '@/mixin/share.js'
	// header
	import commonHeader from"@/components/common-header/common-header";
	// tabbar 
	import tabbar from"@/components/common-tabbar/common-tabbar";
	// 请求接口
	import {passwordback,sendCode} from '@/common/apis.js';
	export default {
		data() {
			return {
				testCode:2,
				phone:"",
				hideBox: true,
				hideTips:false,
				btnState: true,
				selectCode: false,
				disabled: false,
				code:"",
				codeState:false,
				codeText: "获取验证码",
				setpwdState:false,
				setpwdState1:false,
				pwd:"",
				pwd1:'',
                USERINFO_ID:''
			};
		},
		components:{
			commonHeader,
			tabbar,
		},
		mixins: [share],
		onLoad() {
			this.otherPage();
		},
		methods:{
			// 获取输入手机号
			enter(e){
				if(e.detail.value.length===0){
					this.testCode = 2;
					this.selectCode = false;
				}else if(e.detail.value.length===11){
					this.testCode = 0;
					this.selectCode = true;
					this.phone = e.detail.value;
					// this.phoneMaskShow = true;
				}else{
					this.testCode = 1;
					this.selectCode = false;
				}
				this.submitState();
			},
			// 获取验证码
			gettestcode(e){
				if(e.detail.value.length===6){
					this.codeState = true;
					this.code = e.detail.value;
				}else{
					this.codeState = false;
				}
				this.submitState();
			},
			// 获取交易密码
			setpwd(e){
				if(e.detail.value.length===6){
					this.setpwdState = true;
					this.pwd = e.detail.value;
				}else{
					this.setpwdState = false;
				}
				this.submitState();
			},
			// 确认密码
			setpwd1(e){
				this.pwd1 = e.detail.value;
				if(this.pwd === this.pwd1){
					this.setpwdState1 = true;
				}else{
					this.setpwdState1 = false;
					uni.showToast({
						title:'两次输入密码不一致',
						icon:'none'
					})
				}
				this.submitState();
			},
			// 判断输入按钮状态
			submitState(){
				if(this.testCode===0&&this.codeState&&this.setpwdState&&this.setpwdState1){
					this.btnState = false;
				}else{
					this.btnState = true;
				}
			},
			// 更换手机号
			submit(){
                uni.showLoading({
                    title: '加载中...'
                });
				var obj={
					code:this.code,
					USERINFO_ID:this.USERINFO_ID,
					TRADRPASS:this.pwd1
				};
				passwordback(obj).then(res=>{
                    uni.hideLoading();
					if(res.returnMsg.status=='00'){
                        uni.showToast({
                            title:'密码修改成功！',
                            duration:2000
                        })
						setTimeout(()=>{
                            uni.navigateTo({
                            	url:'../personal/personal',
                            })
                        },1000)
					}else if(res.returnMsg.status=='02'){
                        uni.showToast({
                            title:'验证码错误！',
                            duration:2000
                        })
						setTimeout(()=>{
                            uni.navigateTo({
                            	url:'../personal/personal',
                            })
                        },1000)
					}else if(res.returnMsg.status=='03'){
                        uni.showToast({
                            title:'验证码超时！',
                            duration:2000
                        })
						setTimeout(()=>{
                            uni.navigateTo({
                            	url:'../personal/personal',
                            })
                        },1000)
					}else{
						uni.showToast({
							title:'重置失败！'
						})
					}
				}).catch(err=>{
					uni.showToast({
						title:'请求失败！',
						icon:'none'
					})
				})
			},
			// 获取验证码
			getCode() {
				if (this.selectCode) {
					this.disabled = true;
					this.codeHide = false;
					var time = 59;
					this.codeText = time + 's后重新获取';
					// 发送验证码
					sendCode({MOBILE:this.phone}).then(res=>{
						if(res.returnMsg.status=='00'){
							uni.showToast({
								title:'发送成功！',
								icon:'none'
							})
						}else{
							uni.showToast({
								title:'发送失败！',
								icon:'none'
							})
						}
					}).catch(err=>{
						uni.showToast({
							title:'发送失败！',
							icon:'none'
						})
					})
					var setTime = setInterval(() => {
						time--;
						this.codeText = time + 's后重新获取';
					}, 1000)
					setTimeout(() => {
						this.codeText = "获取验证码";
						this.disabled = false;
						this.codeHide = true;
						clearInterval(setTime);
					}, 59000)
				}
			},
		},
        mounted() {
            uni.getStorage({
                key:'USERINFO_ID',
                success:res => this.USERINFO_ID = res.data
            })
        }
	}
</script>

<style lang="less">
	.changePhone{
		height: 100%;
		background: #F7F7F7;
		padding-top:110rpx ;
		/* #ifdef APP-PLUS */
		padding-top: 150rpx;
		/* #endif */
		/* #ifdef MP-WEIXIN */
		padding-top: 150rpx;
		/* #endif */
		// 失败提示
		.testerr{
			border-bottom: 1px solid #f00;
		}
		// 成功提示
		.testsuc{
			border-bottom: 1px solid #0f0;
		}
		input{
			background: #fff;
			height: 90rpx;
			border-top: 20rpx solid #F7F7F7;
			text-indent: 30rpx;
		}
		
		.getcode{
			display: flex;
			justify-content: space-between;
			align-items: center;
			position: relative;
			background: #fff;
			input{
				flex: 1;
			}
			.testCode {
				position: absolute;
				right: 30rpx;
				bottom: 20rpx;
				font-size: 30rpx;
				color: #FF5904;
				padding: 9rpx 25rpx;
				background: #f1f1f1;
				border-radius: 40rpx;
				opacity: 0.5;
			}
			
			/deep/ uni-button {
				line-height: 1em;
			}
			
			/deep/ button {
				line-height: 1em;
			}
			
			.selectCode {
				opacity: 1;
			}
		}
		
		// 确认更换
		.login-content-btn {
			width: 95%;
			background: linear-gradient(243deg, rgba(255, 153, 96, 1) 0%, rgba(255, 90, 44, 1) 100%);
			height: 88rpx;
			border-radius: 10rpx;
			color: #fff;
			font-size: 40rpx;
			text-align: center;
			margin: 150rpx auto 0;
			line-height: 88rpx;
			box-shadow: 0 10rpx 20rpx #FF9960;
		}
		
		.btnState {
			opacity: 0.5;
			color: #fff !important;
		}
		// 蒙层
		// 显示隐藏
		.phoneMaskShow{
			display: none;
		}
		.phoneMask{
			position: absolute;
			top: 0;
			left: 0;
			height: 100%;
			width: 100%;
			background:rgba(0,0,0,0.8);
			z-index: 9999999;
			font-size: 30rpx;
			.phoneMask-content{
				color: #333;
				position: absolute;
				top: -400rpx;
				bottom: 0;
				left: 0;
				right: 0;
				width: 80%;
				height: 355rpx;
				border-radius: 20rpx;
				background: #fff;
				margin: auto;
				padding-top: 30rpx;
				.phoneMask-content-title{
					padding-bottom: 20rpx;
					font-size: 37rpx;
					font-weight: bold;
					text-align: center;
					border-bottom: 1px solid #e0e0e0;
				}
				.phoneMask-content-text{
					padding: 30rpx;
					text{color: #FF5A2C;}
				}
				.phoneMask-content-btn{
					display: flex;
					justify-content: space-around;
					padding-top: 30rpx;
					text{
						width: 240rpx;
						height: 80rpx;
						text-align: center;
						line-height: 80rpx;
						border-radius: 20rpx;
					}
					text:first-child{
						background: #F7F7F7;
					}
					text:last-child{
						background: #FF5A2C;
						color: #fff;
					}
				}
			}
		}
	
		// 验证密码蒙层
		.hideBox {
			display: none;
		}
		
		.shopManage-testPwd {
			position: fixed;
			height: 100%;
			width: 100%;
			z-index: 9999;
			top: 0;
			background: #fff;
			.back{
				font-size: 30rpx;
				margin-left: 30rpx;
				margin-top: 30rpx;
				color: #FF5A2C;
			}
			.shopManage-testPwd-title {
				margin-top: 300rpx;
				text-align: center;
				font-size: 40rpx;
				font-weight: bold;
				margin-bottom: 100rpx;
			}
		
			.shopManage-testPwd-tips {
				text-align: center;
				margin-top: 20rpx;
				color: red;
				display: none;
			}
		
			.hideTips {
				display: block;
			}
		}
	}
</style>
