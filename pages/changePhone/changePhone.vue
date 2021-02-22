<template>
	<view class="changePhone">
		<!-- header -->
		<commonHeader headerTitl="手机号更换" xingHide=true lingHide=true fenxiangHide=true></commonHeader>
		<view class="phone1">
			注册手机号：{{oldPhone}}
		</view>
		<input type="text" value="" 
		placeholder="请输入变更手机号" 
		@input="enter" maxlength="11" 
		:class="testCode===0?'testsuc':''||testCode===1?'testerr':''||testCode===2?'':''"/>
		<view class="getcode">
			<input type="text" value="" maxlength="6" @input="gettestcode" placeholder="请输入验证码"/>
			<button class="testCode" :class="selectCode?'selectCode':''" :disabled="disabled"  @tap="getCode">{{codeText}}</button>
		</view>
		
		
		<button class="login-content-btn" :disabled="btnState" :class="btnState?'btnState':''" @tap="submit">确认更换</button>
		<!-- 手机号更换提示蒙层 -->
		<view class="phoneMask" :class="phoneMaskShow?'':'phoneMaskShow'">
			<view class="phoneMask-content">
				<view class="phoneMask-content-title">
					手机号更换提示
				</view>
				<view class="phoneMask-content-text">
					确定将绑定的<text>{{this.oldPhone}}</text>手机号，更换为{{phone}}吗？
				</view>
				<view class="phoneMask-content-btn">
					<text @tap="phoneMaskShow=false">取消</text>
					<text @tap="submitChange">确认</text>
				</view>
			</view>
		</view>
		<!-- tabbar -->
		<tabbar></tabbar>

	</view>
</template>

<script>
	// header
	import commonHeader from"@/components/common-header/common-header";
	// tabbar 
	import tabbar from"@/components/common-tabbar/common-tabbar";
    import {changePhone,sendCode} from"@/common/apis.js"
	export default {
		data() {
			return {
				testCode:2,
				phoneMaskShow:false,
				phone:"",
				hideBox: true,
				hideTips:false,
				btnState: true,
				selectCode: false,
				disabled: false,
				code:"",
				codeState:false,
				codeText: "获取验证码",
                oldPhone:'',
                oldPhone1:''
			};
		},
		components:{
			commonHeader,
			tabbar,
		},
		methods:{
			// 获取输入手机号
			enter(e){
				if(e.detail.value.length===0){
					this.testCode = 2;
					this.selectCode = false;
				}else if(e.detail.value.length===11){
                    if(e.detail.value == this.oldPhone1) {
                        uni.showToast({
                            title:'更换手机与原手机号码相同!',
                            icon:'none'
                        })
                    }else{
                        this.testCode = 0;
                        this.selectCode = true;
                        this.phone = e.detail.value;
                    }
				}else{
					this.testCode = 1;
					this.selectCode = false;
				}
				this.submitState();
			},
			// 获取验证码
			gettestcode(e){
				if(e.detail.value.length === 6){
					this.codeState = true;
					this.code = e.detail.value;
				}else{
					this.codeState = false;
				}
				this.submitState();
			},
			// 判断输入按钮状态
			submitState(){
				if(this.testCode===0 && this.codeState){
					this.btnState = false;
				}else{
					this.btnState = true;
				}
			},
			// 更换手机号
			submit(){
                this.phoneMaskShow = true;
			},
			// 获取输入密码
			getPwd(val) {
				if(val==888888){
					this.hideBox = true;
					this.phoneMaskShow=true;
					uni.reLaunch({
						url:"../login/login"
					})
				}else{
					this.hideTips = true;
				}
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
            // 确认更换
            submitChange(){
                uni.showLoading({
                    title:'更换中...'
                })
				let userInfo = uni.getStorageSync('userInfo');
                var obj = {
                    // "USERINFO_ID": getApp().globalData.USERINFO_ID,
                    "USERINFO_ID": userInfo.USERINFO_ID,
                    "code": this.code,
                    "mobile": this.phone
                }
				
		
                changePhone(obj).then(res=>{
                    this.phoneMaskShow = false;
                    uni.hideLoading()
                    if(res.returnMsg.status == '00'){
                        uni.showToast({
                            title:'更换成功,请重新登录!',
                            icon:'none',
                            duration:2000
                        })
                        // 保存状态到本地
                        uni.setStorage({
                        	key: 'saveStata',
                        	data: false
                        })
                        setTimeout(()=>{
                            uni.reLaunch({
                                url:'../login/login'
                            })
                        },2000)
                    }else if(res.returnMsg.status == '01'){
                        uni.showToast({
                            title:'请输入验证码!',
                            icon:'none'
                        })
                    }else if(res.returnMsg.status == '02'){
                        uni.showToast({
                            title:'验证码错误!',
                            icon:'none'
                        })
                    }else if(res.returnMsg.status == '03'){
                        uni.showToast({
                            title:'验证码超时!',
                            icon:'none'
                        })
                    }else if(res.returnMsg.status == '04'){
                        uni.showToast({
                            title:'更换失败!',
                            icon:'none'
                        })
                    }else {
						uni.showToast({
						    title:'更换失败!',
						    icon:'none'
						})
					}
                }).catch(() => {
					uni.showToast({
					    title:'更换失败!',
					    icon:'none'
					})
				})
            }
		},
        mounted() {
            // 获取手机号
            uni.getStorage({
                key: 'name',
                success:  (res)=> {
                    this.oldPhone1 = JSON.parse(res.data).PHONE
                    this.oldPhone = JSON.parse(res.data).PHONE.substr(0,3) + "****" + JSON.parse(res.data).PHONE.substr(7)
                }
            });
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
		.phone1{
			padding: 30rpx;
			background: #fff;
			font-size: 34rpx;
		}
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
