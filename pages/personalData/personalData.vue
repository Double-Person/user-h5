<template>
	<view class="personalData">
		<!-- header -->
		<commonHeader headerTitl="个人资料" xingHide=true lingHide=true fenxiangHide=true gengduoHide=true></commonHeader>
		<view class="personalData-content">
			<view class="personalData-content-phone">
				<view class="left">
					头像
				</view>
				<!-- addImg  -->
				<view class="right" @tap="uploadBackgroundImg">
					<view class="right-add" :class="imgHide?'':'imgHide'">
						<text class="iconfont icon-tubiaolunkuo-"></text>
						<view>添加图片</view>
					</view>
					<view class="right-img" :class="imgHide?'imgHide':''">
						<image :src="imgBaseUrl + imgUrl" mode=""></image>
					</view>
				</view>
			</view>
			<view class="personalData-content-username">
				<view class="left">
					用户名
				</view>
				<input type="text" v-model="username" placeholder="请输入用户名" placeholder-style="color:#999" />
			</view>
		</view>

		<!-- 修改 -->
		<view class="submit-btn" @tap="upload">
			修改
		</view>
		<!-- tabbar -->
		<tabbar></tabbar>
	</view>
</template>

<script>
	import share from '@/mixin/share.js'
	// header
	import commonHeader from "@/components/common-header/common-header";
	// tabbar
	import tabbar from "@/components/common-tabbar/common-tabbar";
	import {
		pathToBase64,
		base64ToPath
	} from 'image-tools'
	import {
		uploadImag,
		setPassword,
		personal,
		editInfo,
		baseUrl,
		imgBaseUrl
	} from '@/common/apis.js';
	export default {
		data() {
			return {
				imgBaseUrl: imgBaseUrl,
				imgHide: true, // 隐藏/显示图片
				imgUrl: '', // 图片地址
				username: '',
				USERINFO_ID: ''
			};
		},
		components: {
			commonHeader,
			tabbar
		},
		mixins: [share],
		onLoad() {
			this.otherPage();
		},
		methods: {
			// 上传背景图
			uploadBackgroundImg() {
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: (res) => {
						const tempFilePaths = res.tempFilePaths;
						uni.uploadFile({
							url: baseUrl + '/uploadFile/file', //仅为示例，非真实的接口地址
							filePath: tempFilePaths[0],
							name: 'file',
							formData: {
								file: 'test'
							},
							success: (uploadFileRes) => {
								// let url = (JSON.parse(uploadFileRes.data).data).split(
								// 	'/usr/local/tomcat8.5/apache-tomcat-8.5.47/webapps/qufl');
								// console.log(baseUrl + url[1])
								// this.imgUrl = baseUrl + url[1]
								this.imgUrl = JSON.parse(uploadFileRes.data).data
								this.imgHide = false 
							}
						});

					}
				});
			},
		
			// 修改
			upload() {
				if (this.imgUrl == '' || this.username == '') {
					uni.showToast({
						title: '请先完善信息！',
						icon: 'none'
					})
					return;
				}
				uni.showLoading({
					title: '加载中...'
				})
				// userinfo_id     name   hard
				editInfo({
					"userinfo_id": this.USERINFO_ID,
					"hard": this.imgUrl,
					"name": this.username
				}).then(res => {
					if (res.msgType == '0') {
						setTimeout(() => {
							uni.hideLoading();
							uni.showToast({
								title: '修改成功!'
							})
							setTimeout(() => {
								uni.navigateTo({
									url: '../setting/setting'
								})
							}, 500)
						}, 1000)
					}
					console.log(res)
				}).catch(err => {
					uni.showToast({
						title: '修改失败！',
						icon: 'none'
					})
				}).finally(() => {
					uni.hideLoading()
				})
			},
			
			getInfo() {
				personal({
					USERINFO_ID: this.USERINFO_ID
				}).then(res => {
					if (res.returnMsg.status == '00') {
						let { FACEICON, USERNAME } = res.returnMsg.userInfo
						if (FACEICON) {
							this.imgUrl = FACEICON
							this.imgHide = false;
						}
						this.username = USERNAME
					} else {
						uni.showToast({
							title: '网络出小差了！',
							icon: 'none'
						})
					}
				}).finally(() => uni.hideLoading())
			}
		},
		async mounted() {
			await uni.showLoading({
				title: '加载中', mask: true
			})
			await uni.getStorage({
				key: 'USERINFO_ID',
				success: res => {
					this.USERINFO_ID = res.data
					this.getInfo()
				},
				fail() {
					uni.hideLoading()
				}
				
			})
			
			
		}
	}
</script>

<style lang="less">
	.personalData {
		color: #333;
		height: 90%;
		background: #f6f7f8;
		padding-top: 90rpx;
		/* #ifdef APP-PLUS */
		padding-top: 130rpx;
		/* #endif */
		/* #ifdef MP-WEIXIN */
		padding-top: 130rpx;

		/* #endif */
		.personalData-content {
			padding-left: 30rpx;
			background: #FFF;
			font-size: 30rpx;

			.personalData-content-phone {
				margin-top: 20rpx;
				padding: 20rpx 30rpx 20rpx 0;
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-bottom: 1px solid #e0e0e0;

				.right {
					.right-add {
						color: #999;
						width: 180rpx;
						height: 152rpx;
						background: #f8f6f9;
						border-radius: 10rpx;
						display: flex;
						align-items: center;
						flex-direction: column;
						justify-content: center;

						text {
							font-size: 60rpx;
						}

						view {
							margin-top: 10rpx;
							font-size: 24rpx;
						}
					}

					.right-img {
						width: 180rpx;
						height: 152rpx;
						border-radius: 10rpx;

						image {
							width: 100%;
							height: 100%;
						}
					}

					.imgHide {
						display: none;
					}
				}
			}

			.personalData-content-username {
				height: 90rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-bottom: 1px solid #e0e0e0;

				input {
					width: 200rpx;
					font-size: 28rpx;
					text-align: right;
					margin-right: 30rpx;
				}
			}
		}

		.submit-btn {
			width: 95%;
			background: linear-gradient(243deg, rgba(255, 153, 96, 1) 0%, rgba(255, 90, 44, 1) 100%);
			height: 88rpx;
			border-radius: 10rpx;
			color: #fff;
			font-size: 40rpx;
			margin: 100rpx auto 90rpx;
			text-align: center;
			line-height: 88rpx;
			box-shadow: 0 10rpx 20rpx #FF9960;
		}
	}
</style>
