<template>
	<view class="certification">
		<!-- header -->
		<commonHeader headerTitl="实名认证" xingHide="true" lingHide="true" fenxiangHide="true"></commonHeader>
		<view class="certification-content">
			<view class="certification-content-username">
				<view class="left">姓名</view>
				<input type="text" v-model="username" placeholder="请输入真实姓名" placeholder-style="color:#999" />
			</view>
			<view class="certification-content-upload">上传身份证照</view>
		</view>
		<view class="certification-upload">
			<view class="certification-upload-zhang" @tap="zheng">
				<view class="top" :class="imgHide1 ? '' : 'imgHide'">
					<image :src="userInfo.IDCARDFRONT ? (imgBaseUrl + userInfo.IDCARDFRONT) :'/static/images/renzheng01.png'" mode=""></image>
					<view>请上传身份证正面</view>
					<text>注：请上传jpg/png格式图片</text>
				</view>
				<view class="img" :class="imgHide1 ? 'imgHide' : ''">
					<image :src="imgBaseUrl + imgUrl1" mode=""></image>
				</view>
			</view>
			<view class="certification-upload-fan" @tap="fan">
				<view class="top" :class="imgHide2 ? '' : 'imgHide'">
					<image :src="userInfo.IDCARDBACK ? (imgBaseUrl + userInfo.IDCARDBACK) : '/static/images/renzheng02.png'" mode=""></image>
					<view>请上传身份证反面</view>
					<text>注：请上传jpg/png格式图片</text>
				</view>
				<view class="img" :class="imgHide2 ? 'imgHide' : ''">
					<image :src="imgBaseUrl + imgUrl2" mode=""></image>
				</view>
			</view>
		</view>
		<view class="submit-btn" v-if="userInfo.CHECKSTATE == 1">审核通过</view>
		<view class="submit-btn" v-if="userInfo.CHECKSTATE == 0">审核中</view>
		<!-- <view class="submit-btn" @tap="submit" v-if="userInfo.CHECKSTATE == 2 || userInfo.CHECKSTATE == '-1'">提交审核</view> -->
		<view class="submit-btn" @tap="submit" v-if="userInfo.CHECKSTATE != 1 && userInfo.CHECKSTATE != 0">提交审核</view>
		<!-- tabbar -->
		<tabbar></tabbar>
	</view>
</template>

<script>
	// header
	import commonHeader from '@/components/common-header/common-header';
	// tabbar
	import tabbar from '@/components/common-tabbar/common-tabbar';
	import {
		Authentication,
		personal,
		uploadImag,
		baseUrl,
		imgBaseUrl
	} from '@/common/apis.js';
	import {
		pathToBase64,
		base64ToPath
	} from 'image-tools';
	export default {
		data() {
			return {
				imgBaseUrl: imgBaseUrl,
				imgHide1: true,
				imgHide2: true,
				imgUrl1: '',
				imgUrl2: '',
				username: '',
				USERINFO_ID: '',
				userInfo: {}
			};
		},
		components: {
			commonHeader,
			tabbar
		},
		methods: {
			// 身份证正面上传
			zheng() {
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有  'original', 
					sourceType: ['album', 'camera'], //从相册选择
					success: res => {
						const tempFilePaths = res.tempFilePaths;
						uni.uploadFile({
							url: baseUrl + '/uploadFile/file', //仅为示例，非真实的接口地址
							filePath: tempFilePaths[0],
							name: 'file',
							// formData: {
							// 	file: 'test'
							// },
							success: (uploadFileRes) => {
								this.imgUrl1 = JSON.parse(uploadFileRes.data).data
								this.imgHide1 = false
							}
						});

					}
				});
			},
			fan() {
				let that = this;
				uni.chooseImage({
					count: 1, //默认9
					sizeType: [ 'compressed'], //可以指定是原图还是压缩图，默认二者都有 'original',
					sourceType: ['album', 'camera'], //从相册选择
					success: res => {
						const tempFilePaths = res.tempFilePaths;
						uni.uploadFile({
							url: baseUrl + '/uploadFile/file', //仅为示例，非真实的接口地址
							filePath: tempFilePaths[0],
							name: 'file',
							// formData: {
							// 	file: 'test'
							// },
							success: (uploadFileRes) => {
								that.imgUrl2 = JSON.parse(uploadFileRes.data).data
								that.imgHide2 = false
							}
						});

					}
				});
			},
			// 提交审核
			submit() {
				if (this.username == '' || this.imgUrl1 == '' || this.imgUrl2 == '') {
					uni.showToast({
						title: '请先完善信息！',
						icon: 'none'
					});
					return;
				}
				uni.showLoading({
					title: '上传中...'
				});
				var obj = {
					USERINFO_ID: this.USERINFO_ID,
					NAME: this.username,
					IDCARDFRONT: this.imgUrl1,
					IDCARDBACK: this.imgUrl2
				};
				Authentication(obj)
					.then(res => {
						uni.hideLoading();
						if (res.returnMsg.status == '00') {
							uni.showToast({
								title: '上传成功！',
								icon: 'none'
							});
							setTimeout(() => {
								// #ifdef H5
								let canBack = true;
								const pages = getCurrentPages();
								// 有可返回的页面则直接返回，uni.navigateBack默认返回失败之后会自动刷新页面 ，无法继续返回
								if (pages.length > 1) {
									uni.navigateBack(1);
									return;
								}
								// vue router 可以返回uni.navigateBack失败的页面 但是会重新加载
								let a = this.$router.go(-1);
								// router.go失败之后则重定向到首页
								if (a == undefined) {
									uni.reLaunch({
										url: '/pages/index/index'
									});
								}
								return;
								// #endif
								// 修复小程序app返回退出应用bug(无法返回重定向至首页)
								var pagelength = getCurrentPages();
								if (pagelength.length === 1) {
									var path = pagelength[0].route;
									uni.reLaunch({
										url: '/' + path
									});
								} else {
									uni.navigateBack(1);
								}
							}, 1000);
						}
					})
					.catch(err => {
						uni.showToast({
							title: '上传失败！',
							icon: 'none'
						});
					});
			},

			getUserInfo() {
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				// 获取个人资料
				personal({
					USERINFO_ID: this.USERINFO_ID
				}).then(res => {
					
					this.userInfo = res.returnMsg.userInfo
					
					this.username = res.returnMsg.userInfo.NAME ? res.returnMsg.userInfo.NAME : '';
					if (res.returnMsg.userInfo.IDCARDFRONT) {
						this.imgHide1 = false;
						this.imgUrl1 = res.returnMsg.userInfo.IDCARDFRONT;
					}
					if (res.returnMsg.userInfo.IDCARDBACK) {
						this.imgHide2 = false;
						this.imgUrl2 = res.returnMsg.userInfo.IDCARDBACK;
					}

				}).finally(() => uni.hideLoading())
			}



		},
		mounted() {
			uni.getStorage({
				key: 'USERINFO_ID',
				success: res => {
					console.log(res)
					this.USERINFO_ID = res.data;
					this.getUserInfo()
				}
			});

		}
	};
</script>

<style lang="less">
	.certification {
		color: #333;
		height: 100%;
		background: #f6f7f8;
		padding-top: 90rpx;
		/* #ifdef APP-PLUS */
		padding-top: 130rpx;
		/* #endif */
		/* #ifdef MP-WEIXIN */
		padding-top: 130rpx;
		/* #endif */

		.certification-content {
			padding-left: 30rpx;
			background: #fff;
			font-size: 30rpx;

			.certification-content-username {
				margin-top: 20rpx;
				height: 90rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-bottom: 1px solid #e0e0e0;
				padding-right: 30rpx;

				input {
					width: 200rpx;
					font-size: 28rpx;
					text-align: right;
				}
			}

			.certification-content-upload {
				height: 90rpx;
				line-height: 90rpx;
			}
		}

		.certification-upload {
			>view {
				width: 500rpx;
				height: 302rpx;
				border: 20rpx solid #fff;
				border-radius: 10rpx;
				margin: 30rpx auto;
				background: #f7f4f8;
				text-align: center;
				font-size: 24rpx;

				image {
					width: 180rpx;
					height: 105rpx;
				}

				.top {
					margin-top: 40rpx;
					margin-bottom: 10rpx;
				}

				text {
					color: #999;
				}

				.img {
					width: 100%;
					height: 100%;

					image {
						width: 100%;
						height: 100%;
					}
				}
			}

			.imgHide {
				display: none;
			}

			.certification-upload-zhang {
				margin-bottom: 50rpx;
			}
		}

		.submit-btn {
			width: 95%;
			background: linear-gradient(243deg, rgba(255, 153, 96, 1) 0%, rgba(255, 90, 44, 1) 100%);
			height: 88rpx;
			border-radius: 10rpx;
			color: #fff;
			font-size: 40rpx;
			margin: 50rpx auto 90rpx;
			text-align: center;
			line-height: 88rpx;
			box-shadow: 0 10rpx 20rpx #ff9960;
		}
	}
</style>
