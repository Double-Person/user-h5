<template>
	<view class="loginPassword">
		<!-- header -->
		<commonHeader headerTitl="修改密码" xingHide=true lingHide=true fenxiangHide=true></commonHeader>
		<view class="tips">
			请输入登录密码
		</view>
		<input type="number" password="true" maxlength="6" placeholder-style="color:#333" v-model="oldPwd" placeholder="请输入原密码" />
		<input type="number" password="true" maxlength="6" placeholder-style="color:#333" v-model="newPwd" placeholder="请输入新密码" />
		<input type="number" password="true" maxlength="6" placeholder-style="color:#333" v-model="pwd" placeholder="请再次输入新密码" />
		<view class="submit" @tap="submit">
			确认修改
		</view>
	</view>
</template>

<script>
	import md5 from "@/common/md5.js"
	import commonHeader from "@/components/common-header/common-header"
	import {
		setPassword
	} from "@/common/apis.js"
	export default {
		data() {
			return {
				oldPwd: '',
				newPwd: '',
				pwd: '',
				USERINFO_ID: ''
			};
		},
		components: {
			commonHeader
		},
		methods: {
			submit() {
				if (this.oldPwd === '' || this.newPwd === '' || this.pwd === '') {
					uni.showToast({
						title: '请完善信息！',
						icon: 'none'
					})
					return false
				}
				if (this.newPwd !== this.pwd) {
					uni.showToast({
						title: '上次输入密码不一致！',
						icon: 'none'
					})
					return false
				}
				if (this.newPwd.length != 6 || this.pwd.length != 6) {
					uni.showToast({
						title: '请输入6位密码！',
						icon: 'none'
					})
					return false
				}
				uni.showLoading({
					title: '加载中...'
				})
				// var pwd = md5(val)
				var obj = {
					USERINFO_ID: this.USERINFO_ID,
					oldPassword: this.oldPwd,
					newPassword: this.newPwd
				}
				setPassword(obj).then(res => {

					if (res.returnMsg.status == '00') {
						uni.showToast({
							title: '密码修改成功，请重新登录！',
							duration: 2000
						})
						uni.hideLoading()
						setTimeout(() => {
							uni.clearStorageSync();
							uni.reLaunch({
								url: '../login/login'
							})
						}, 2000)
					}
					if (res.returnMsg.status == '01') {
						uni.showToast({
							title: '原密码不正确！',
							duration: 2000,
							icon: 'none'
						})
					}
				})
			}
		},
		mounted() {
			uni.getStorage({
				key: 'USERINFO_ID',
				success: res => this.USERINFO_ID = res.data
			})
		}
	}
</script>

<style lang="less">
	.loginPassword {
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
		.tips {
			padding: 40rpx 0 40rpx 30rpx;
			font-size: 41rpx;
		}

		input {
			height: 90rpx;
			background: #fff;
			text-indent: 30rpx;
			border-bottom: 1px solid #e0e0e0;
		}

		.submit {
			height: 88rpx;
			line-height: 88rpx;
			width: 95%;
			margin: 150rpx auto 0;
			border-radius: 10rpx;
			text-align: center;
			color: #fff;
			background: linear-gradient(243deg, rgba(255, 153, 96, 1) 0%, rgba(255, 90, 44, 1) 100%);
			box-shadow: 0px 10rpx 6px #FF9960;
		}
	}
</style>
