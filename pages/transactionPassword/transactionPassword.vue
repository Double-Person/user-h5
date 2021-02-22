<template>
	<view class="loginPassword">
		<!-- header -->
		<commonHeader headerTitl="修改交易密码" xingHide=true lingHide=true fenxiangHide=true></commonHeader>
		<view class="tips">
                请输入交易密码
		</view>
		<input type="number" password="true" maxlength="6" placeholder-style="color:#333" v-model="oldPwd" placeholder="请输入原密码" v-if="isEdit"/>
		<input type="number" password="true" maxlength="6" placeholder-style="color:#333" v-model="newPwd" placeholder="请输入新密码"/>
		<input type="number" password="true" maxlength="6" placeholder-style="color:#333" v-model="pwd" placeholder="请再次输入新密码"/>
		<view class="submit" @tap="submit">
			确认修改
		</view>
	</view>
</template>

<script>
	import commonHeader from "@/components/common-header/common-header"
    import {transaction, pwdInfo} from "@/common/apis.js"
	export default {
		data() {
			return {
				isEdit: false,// 是否已设置交易密码
				oldPwd:'',
                newPwd:'',
                pwd:''
			};
		},
		components:{commonHeader},
		mounted() {
			this.check()
		},
		methods:{
			// userinfo_id    USERINFO_ID
			check(){
				let userinfo_id = uni.getStorageSync('USERINFO_ID')
				pwdInfo({userinfo_id}).then(res => {
					this.isEdit = (res.returnMsg == "已经设置交易密码");
				})
			},
			submit(){
				if (this.oldPwd  === '' && !this.isEdit) {
				    uni.showToast({
				        title:'请完善信息！',
				        icon:'none'
				    })
				    return false
				}
                if (this.newPwd==='' || this.pwd==='') {
                    uni.showToast({
                        title:'请完善信息！',
                        icon:'none'
                    })
                    return false
                }
                if(this.newPwd !== this.pwd){
                    uni.showToast({
                        title:'上次输入密码不一致！',
                        icon:'none'
                    })
                    return false
                }
                uni.showLoading({
                    title:'加载中...',
					mask: true
                })
				 
                var obj = {
                    USERINFO_ID:uni.getStorageSync('USERINFO_ID'),
                    oldPassword:this.oldPwd,
                    newPassword:this.newPwd
                }
                transaction(obj).then(res => {
                    uni.hideLoading()
                    if(res.returnMsg.status == '00'){
                        uni.showToast({
                            title:'交易密码修改成功！',
                            duration:2000
                        })
                        setTimeout(()=>{
                            uni.navigateTo({
                                url:'../personal/personal'
                            })
                        },2000)
                    }
                    if(res.returnMsg.status == '01'){
                        uni.showToast({
                            title:'交易密码更换失败！',
                            duration:2000,
                            icon:'none'
                        })
                    }
                    if(res.returnMsg.status == '02'){
                        uni.showToast({
                            title:'原密码不正确！',
                            duration:2000,
                            icon:'none'
                        })
                    }
                })
				// // #ifdef H5
				// let canBack = true;
				// const pages = getCurrentPages();
				// // 有可返回的页面则直接返回，uni.navigateBack默认返回失败之后会自动刷新页面 ，无法继续返回  
				// if (pages.length > 1) {
				// 	uni.navigateBack(1)
				// 	return;
				// }
				// // vue router 可以返回uni.navigateBack失败的页面 但是会重新加载  
				// let a = this.$router.go(-1)
				// // router.go失败之后则重定向到首页 
				// if (a == undefined) {
				// 	uni.reLaunch({
				// 		url: "/pages/index/index"
				// 	})
				// }
				// return;
				// // #endif
				// // 修复小程序app返回退出应用bug(无法返回重定向至首页)
				// var pagelength = getCurrentPages();
				// if(pagelength.length===1){
				// 	var path = pagelength[0].route;
				// 	// console.log(path)
				// 	uni.reLaunch({
				// 		url:'/'+path
				// 	})
				// }else{
				// 	uni.navigateBack(1)
				// }
			}
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
	}
</style>
