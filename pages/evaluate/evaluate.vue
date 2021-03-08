<template>
	<view class="evaluate">
		<!-- header -->
		<commonHeader headerTitl="我要评价" xingHide=true lingHide=true fenxiangHide=true></commonHeader>
		<!-- 内容开始 -->
		<view class="evaluate-content">
			<!-- 评价 -->
			<view class="evaluate-content-dianping">
				<view class="item" @tap="selectActive(1)">
					<view>
						差
					</view>
					<text class="iconfont icon-chaping1" :class="active===1?'active':''"></text>
				</view>
				<view class="item" @tap="selectActive(2)">
					<view>
						一般
					</view>
					<text class="iconfont icon-pj_yiban" :class="active===2?'active':''"></text>
				</view>
				<view class="item" @tap="selectActive(3)">
					<view>
						还不错
					</view>
					<text class="iconfont icon-biaoqing-xue" :class="active===3?'active':''"></text>
				</view>
				<view class="item" @tap="selectActive(4)">
					<view>
						很满意
					</view>
					<text class="iconfont icon-xiaolian" :class="active===4?'active':''"></text>
				</view>
				<view class="item" @tap="selectActive(5)">
					<view>
						强烈推荐
					</view>
					<text class="iconfont icon-daxiao" :class="active===5?'active':''"></text>
				</view>
			</view>
			<!-- 评价文字 -->
			<view class="evaluate-content-text">
				<textarea v-model="content" placeholder-style="fontSize:24rpx" placeholder="质量如何，服务是否周到，交通是否便利？（写够15字，才是好同志~）" />
				</view>
			<!-- 上传照片 -->
			<view class="evaluate-content-phone">
				<view @tap="addImg">
                    <view class="item" :class="imgHide?'':'imgHide'">
                        <text class="iconfont icon-tubiaolunkuo-"></text>
                        <view>添加图片</view>
                    </view>
                    <view class="right-img" :class="imgHide?'imgHide':''">
                        <image :src="imgBaseUrl + imgUrl" mode=""></image>
                    </view>

                </view>
			</view>
		</view>
		<!-- 内容结束 -->
        <!-- 评价 -->
        <view class="submit-btn" @tap="submit">
        	评价
        </view>
		<!-- tabbar -->
		<tabbar></tabbar>
	</view>
</template>

<script>
	// header
	import commonHeader from "@/components/common-header/common-header";
	// tabbar
	import tabbar from "@/components/common-tabbar/common-tabbar";
    import {addEvaluate, baseUrl, imgBaseUrl} from "@/common/apis.js";
    import { pathToBase64, base64ToPath } from 'image-tools';
	import share from '@/mixin/share.js'
	export default {
		data() {
			return {
				imgBaseUrl: imgBaseUrl,
				active:0,
				inputNum:15,
				EVALUEATE_ID: '',

				ORDERSUMMARY_ID:'',
				goodsId:'',
				USERINFO_ID:'',
				content:'',
				imgHide: true, // 隐藏/显示图片
				imgUrl: '', // 图片地址
				fromPath:''
			};
		},
		components:{
			commonHeader,
			tabbar
		},
		mixins: [share],
		
		onLoad(e){
			this.otherPage();
			this.ORDERSUMMARY_ID = e.ORDERSUMMARY_ID
			if(e.from == 'order') {
				this.fromPath = e.from
			}
			this.goodsId = e.goodsId
			this.EVALUEATE_ID = e.EVALUATE_ID || '';
			uni.getStorage({
				key:"USERINFO_ID",
				success:(res)=>{
					this.USERINFO_ID = res.data
				}
			})
		},
		methods:{
			selectActive(index){
				this.active = index;
			},
	
			// 添加图片
			addImg(){
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album','camera'], //从相册选择
					success: (res)=> {
						const tempFilePaths = res.tempFilePaths;
						uni.uploadFile({
							url: baseUrl + '/uploadFile/file', //仅为示例，非真实的接口地址
							filePath: tempFilePaths[0],
							name: 'file',
							formData: {
								file: 'test'
							},
							success: (uploadFileRes) => {
								this.imgUrl = JSON.parse(uploadFileRes.data).data
								this.imgHide = false 
							}
						});
					}
				})
				
			},
	 // 发表评论
			submit(){
				let that = this;
				if(this.active<0 || this.content.trim() == ''){
					 return uni.showToast({
						title:'请完善信息!',
						icon:'none'
					 })
				}
		   
				var obj = {
					"USERINFO_ID": this.USERINFO_ID,
					"GOODS_ID": this.goodsId,
					"EVALUEATE_ID": this.EVALUEATE_ID || this.ORDERSUMMARY_ID,
					"SCORE": this.active,
					"CONTENT": this.content,
					"IMGS": this.imgUrl
				}
				uni.showLoading({ title: '加载中', mask: true });
				addEvaluate(obj).then(res => {
					if(res.returnMsg.status == '00'){
						uni.showToast({
								title:"评价成功!",
								duration:2000,
								mask:true
						})
						setTimeout(()=>{
							uni.navigateTo({
									url:"../myEvaluate/myEvaluate"
							})
							// if(that.fromPath == 'order') {
							// 	uni.navigateTo({
							// 		url: '../myOrder/myOrder'
							// 	})
							// }else{
							// 	uni.navigateTo({
							// 			url:"../myEvaluate/myEvaluate"
							// 	})
							// }                    
						},2000)
					}else{
						uni.showToast({
							title: res.returnMsg|| "您已评价此订单!",
							duration:2000,
							icon:"none",
							mask:true
						})
					}
				}).finally(() => uni.hideLoading())
	 
			}
		}
		
	}
</script>

<style lang="less">
	.evaluate{
		background: #f6f7f8;
		height: 100%;
		padding-top: 120rpx;
		color: #999;
		/* #ifdef APP-PLUS */
		padding-top: 160rpx;
		/* #endif */
		/* #ifdef MP-WEIXIN */
		padding-top: 160rpx;
		/* #endif */
		.evaluate-content{
			.evaluate-content-dianping{
				background: #fff;
				width: 95%;
				margin: auto;
				border-radius: 20rpx;
				display: flex;
				justify-content: space-around;
				color: #333;
				text-align: center;
				.item{
					padding: 30rpx 0;
					font-size: 24rpx;
					view{
						margin-bottom: 30rpx;
					}
					text{font-size: 72rpx;color: #999;}
					.active{
						color: #FF7900;
					}
				}
			}
			.evaluate-content-text{
				position: relative;
				width: 95%;
				height: 283rpx;
				margin: auto;
				background: #fff;
				margin-top: 30rpx;
				border-radius: 20rpx;
				textarea{
					height: 243rpx;
					width: 90%;
					padding: 20rpx;
				}
				view{
					font-size: 24rpx;
					text-align: right;
					margin-right: 30rpx;
					position: absolute;
					right: 30rpx;
					bottom: 20rpx;
				}
			
			}
			.evaluate-content-phone{
				height: 283rpx;
				background: #fff;
				width: 95%;
				margin: 30rpx auto 0;
				border-radius: 20rpx;
				display: flex;
				.item{
					width: 150rpx;
					height: 150rpx;
					border-radius: 20rpx;
					background: #f8f6f9;
					margin: 30rpx 0 0 30rpx;
					font-size: 24rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					flex-direction: column;
					text{
						font-size: 60rpx;
					}
					view{
						margin-top: 10rpx;
					}
				}
                .right-img {
                	width: 150rpx;
                	height: 150rpx;
                	border-radius: 20rpx;
                	background: #f8f6f9;
                	margin: 30rpx 0 0 30rpx;
                	font-size: 24rpx;
                	display: flex;
                	align-items: center;
                	justify-content: center;
                	flex-direction: column;
                
                	image {
                		width: 100%;
                		height: 100%;
                	}
                }
                
                .imgHide {
                	display: none !important;
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
