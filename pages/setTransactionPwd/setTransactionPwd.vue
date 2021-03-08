<template>
	<view class="loginPassword">
		<!-- header -->
		<commonHeader headerTitl="设置交易密码" xingHide=true lingHide=true fenxiangHide=true></commonHeader>
		<view class="tips">
			设置交易密码
		</view>
		<input type="number" password maxlength="6" placeholder-style="color:#333" v-model="pwd" placeholder="请输入6位数交易密码"/>
		<input type="number" password maxlength="6" placeholder-style="color:#333" v-model="pwd1" placeholder="确认交易密码"/>
		<button class="submit" @tap="submit">
			确认
		</button>
	</view>
</template>

<script>
	import share from '@/mixin/share.js'
	import commonHeader from "@/components/common-header/common-header";
	import {setPassword} from "@/common/apis.js";
	export default {
		data() {
			return {
				pwd:'',
				pwd1:'',
                USERINFO_ID:''
			};
		},
		mixins: [share],
		onLoad() {
			this.otherPage();
		},
		components:{commonHeader},
		methods:{
			// 确认
			submit(){
                if (this.pwd === '' || this.pwd1 === '') {
                    uni.showToast({
                        title:'请完善信息!',
                        icon:'none'
                    })
                    return false
                }
                if (this.pwd !== this.pwd1) {
                    uni.showToast({
                        title:'两次输入密码不一致!',
                        icon:'none'
                    })
                    return false
                }
                uni.showLoading({
                    title:'加载中...'
                })
				setPassword({
                    "USERINFO_ID": this.USERINFO_ID,
					"TRADRPASS": this.pwd
				}).then(res=>{
                    uni.hideLoading()
					if (res.returnMsg.status == '00') {
						uni.showToast({
							title:'设置成功',
							success:()=>{
								getApp().globalData.isPwd = true;
								getApp().globalData.pwd = this.pwd1;
								setTimeout(()=>{
                                    uni.reLaunch({
                                    	url:'../setting/setting'
                                    })
                                },1000)
							}
						})
					}
				}).catch(err=>{
					uni.showToast({
						title:'设置失败！',
						icon:'none'
					})
				})
			}
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
	.loginPassword{
		color: #333;
		background: #f6f7f8;
		height: 100%;
		padding-top: 90rpx;
		/* #ifdef APP-PLUS */
		padding-top: 130rpx;
		/* #endif */
		/* #ifdef MP-WEIXIN */
		padding-top: 130rpx;
		/* #endif */
		.tips{
			padding: 40rpx 0 40rpx 30rpx;
			font-size: 41rpx;
		}
		input{
			height: 90rpx;
			background: #fff;
			text-indent: 30rpx;
			border-bottom: 1px solid #e0e0e0;
		}
		.submit{
			height:88rpx;
			line-height: 88rpx;
			width: 95%;
			margin: 150rpx auto 0;
			border-radius: 10rpx;
			text-align: center;
			color: #fff;
			background:linear-gradient(243deg,rgba(255,153,96,1) 0%,rgba(255,90,44,1) 100%);
			box-shadow: 0px 10rpx 6px #FF9960;
		}
		uni-button:after{
			border: 0;
		}
	}
</style>
