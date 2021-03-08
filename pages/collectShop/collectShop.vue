<template>
	<view class="collectShop">
		<!-- header -->
		<commonHeader headerTitl="收藏店铺" xingHide=true lingHide=true></commonHeader>
		<!-- 内容开始 -->
		<view class="collectShop-content" v-if="collectShopList.length > 0">
			<view class="collectShop-content-item" v-for="item in collectShopList" :key="item.id" @click="toShop(item.shopId)">
				<view class="title" :style="{'background':'url('+imgBaseUrl + item.bgImg+')'}">
					<view class="shop">
						<view class="title-left">
							<image :src="imgBaseUrl + item.faceicon" mode=""></image>
							<text>{{item.shopName}}</text>
							
						</view>
						<view class="title-right">
							<!-- 已收藏 -->
							<view class="btn">
								<text @tap.stop="cancel(item.collectionsId)">取消收藏</text>
								<!-- <text>再来一单</text> -->
							</view>
						</view>
					</view>
					<text class="time">关注时间：{{ item.creates }}</text>
				</view>
				
			
				<view class="btn">
					<!-- <text @tap="cancel(item.collectionsId)">取消收藏</text> -->
					<!-- <text>再来一单</text> -->
				</view>
			</view>
		</view>
        <view v-else style="text-align: center;color: #999;">
            暂无收藏哟！
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
    import {collections,delCollec, imgBaseUrl} from"@/common/apis.js"
	import share from '@/mixin/share.js'
	export default {
		data() {
			return {
				imgBaseUrl: imgBaseUrl,
				collectShopList:[],
                USERINFO_ID:''
			};
		},
		components:{
			commonHeader,
			tabbar
		},
		mixins: [share],
		onLoad() {
			this.otherPage();
		},
		methods:{
			// 去店铺
			toShop(shopId) {
			
				uni.navigateTo({
					url:'../shopPage/shopPage?shopId=' + shopId
				})
			},
			// 取消收藏
			cancel(shopId){
                delCollec({COLLECTIONS_ID:shopId}).then(res => {
                    if (res.returnMsg.status == '00'){
                        uni.showToast({
                            title:'取消收藏成功!',
                            duration:2000,
                            mask:true
                        })
                        setTimeout(()=>{
                            this.getList()
                        },2000)
                    } 
                })
			},
            // 获取评价列表
            getList(){
                uni.getStorage({
                    key:'USERINFO_ID',
                    success:res => {
                        collections({USERINFO_ID:res.data}).then(res => {
                            this.collectShopList = res.returnMsg.list
                        })
                    }
                })
                
            }
		},
        mounted() {
            this.getList()
        }
	}
</script>

<style lang="less">
	.collectShop{
		min-height: 100%;
		background: #f6f7f8;
		padding: 130rpx 0;
		/* #ifdef APP-PLUS */
		padding-top: 170rpx;
		/* #endif */
		/* #ifdef MP-WEIXIN */
		padding-top: 170rpx;
		/* #endif */
		.collectShop-content{
			.collectShop-content-item{
				// background: #fff;
				background-size: contain;
				padding: 0 0rpx;
				width: 90%;
				margin: 0 auto 30rpx;
				border-radius: 20rpx;
				color: #333;
				.shop{
					display: flex;
					justify-content: space-between;
					align-items: center;
				}
				.time{
					font-size: 28rpx;
					margin-left: 20rpx;
				}
				.title{
					padding: 30rpx 0;
					
					border-bottom: 1px solid #e0e0e0;
					font-weight: bold;
					.title-left{
						font-size: 32rpx;
						display: flex;
						align-items: center;
						margin-left: 20rpx;
						image{
							width: 50rpx;
							height: 50rpx;
							border-radius: 50%;
							margin-right: 20rpx;
						}
					}
					.title-right{
						font-size: 28rpx;
						color: #999;
						display: flex;justify-content: center;
						align-items: center;
						position: relative;
						z-index: 666;
					}
				}
				.content{
					display: flex;
					padding: 30rpx 0;
					.content-left{
						width: 180rpx;
						height: 152rpx;
						border-radius: 20rpx;
						image{width: 100%;height: 100%;}
					}
					.content-right{
						margin-left: 20rpx;
						flex: 1;
						margin-top: -10rpx;
						display: flex;
						flex-direction: column;
						>text{
							font-size: 28rpx;
							color: #666;
							margin-top: 20rpx;
						}
					}
				}
				.btn{
					display: flex;
					justify-content: flex-end;
					// padding-bottom: 20rpx;
					text{
						padding: 9rpx 20rpx;
						color: #FF6504;
						border: 1px solid  #FF6504;
						border-radius: 44rpx;
						font-size: 24rpx;
					}
					text:first-child{
						margin-right: 30rpx;
					}
					text:last-child{
						color: #fff;
						background:linear-gradient(231deg,rgba(255,178,10,1) 0%,rgba(255,127,4,1) 60%,rgba(255,89,4,1) 100%);;
						border: 0;
					}
				}
			}
		}
	}
</style>
