<template>
	<view class="myEvaluate">
		<!-- header -->
		<commonHeader headerTitl="我的评价" xingHide=true lingHide=true fenxiangHide=true></commonHeader>
		<!-- 内容开始 -->
		
		 
		<view v-if="myEvaluateList.length == 0" style="text-align: center;color: #999;">
            暂无评价
        </view>
		
		<!-- 内容结束 -->
		
		<view class="myEvaluate-content" v-if="myEvaluateList.length != 0">

			<view class="myEvaluate-content-item" v-for="item in myEvaluateList" :key="item.EVALUATE_ID">
				<view class="title">
					{{item.SHOP_NAME}}
				</view>
				<view class="content">
					<view class="content-left">
						<image :src="imgBaseUrl + item.GOODS_IMG" mode=""></image>
					</view>
					<view class="content-right">
						<text>下单时间：{{item.SHOPTIME}}</text>
						<view>
							{{item.DETAILS?item.DETAILS:"暂无评价!"}}
						</view>
					</view>
				</view>
				<view class="comments-warp">
					用户评论：{{ item.CONTENT }}
					<view class="content-img-warp">
						<image :src="imgBaseUrl + item.IMGS" mode="" @click="previewImage(imgBaseUrl + item.IMGS)"></image>
					</view>
				</view>
				<view class="comments-warp" v-if="item.HF && item.HF.length">
					商家回复：{{ item.HF && item.HF.length && item.HF[0].REPLY }}
				</view>
				<view class="btn">
					<text v-if="item.EVALUATE_ID" @tap="deleteEvaluate(item.EVALUATE_ID)">删除</text>
					<text @tap="goEvaluate(item)">评价</text>
				</view>
			</view>
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
    import {evaluateList,delEvaluate, imgBaseUrl} from "@/common/apis.js"
	export default {
		components:{
			commonHeader,
			tabbar
		},
		data() {
			return {
				imgBaseUrl: imgBaseUrl,
				myEvaluateList:[],
                USERINFO_ID:''
			};
		},
		methods:{
			previewImage(urls) {
				uni.previewImage({ urls: [urls] });
			},
			// 删除
			deleteEvaluate(EVALUATE_ID){
                var obj = { EVALUATE_ID }
                delEvaluate(obj).then(res =>  {
                    if (res.returnMsg.status == '00'){
                        uni.showToast({
                            title:'删除成功！',
                            duration:2000,
                            mask:true
                        })
                        setTimeout(()=>{
                            this.getList()
                        },1000)
                    }else{
                        uni.showToast({
                            title:'删除失败！',
                            icon:'none'
                        })
                    }
                })
			},
			// 前往评价页
			goEvaluate(item){
				console.log(item.EVALUATE_ID)
				uni.navigateTo({
					url:"../evaluate/evaluate?ORDERSUMMARY_ID="+item.EVALUATE_ID+'&goodsId='+item.GOODS_ID
				})
			},
            // 获取评价列表
            getList(){
                uni.getStorage({
                    key:'USERINFO_ID',
                    success:res => {
						uni.showLoading({ title: '加载中', mask: true });
                        evaluateList({"USERINFO_ID":res.data}).then(res => {
                            this.myEvaluateList = res.returnMsg.evaluate;
                        }).finally(() => uni.hideLoading())
                    }
                })
            }
		},
		
        onLoad() {
           this.getList()
        }
	}
</script>

<style lang="less">
	.content-img-warp{
		width: 100%;
		image{
			width: 150rpx;
			height: 150rpx;
			margin-left: 150rpx;
		}
	}
	.comments-warp{

		background: #F7F7F7;
		border-radius: 10rpx;
		padding: 30rpx;
		margin-bottom: 30rpx;

	}
	.myEvaluate{
		min-height: 100%;
		background: #f6f7f8;
		padding: 130rpx 0;
		/* #ifdef APP-PLUS */
		padding-top: 170rpx;
		/* #endif */
		/* #ifdef MP-WEIXIN */
		padding-top: 170rpx;
		/* #endif */
		.myEvaluate-content{
			.myEvaluate-content-item{
				background: #fff;
				padding: 0 20rpx;
				width: 90%;
				margin: 0 auto 30rpx;
				border-radius: 20rpx;
				color: #333;
				.title{
					padding: 30rpx 0;
					font-weight: bold;
					font-size: 32rpx;
					border-bottom: 1px solid #e0e0e0;
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
						text{
							font-size: 28rpx;
							color: #666;
						}
						view{
							margin-top: 10rpx;
							height: 105rpx;
							width: 461rpx;
							color: #999;
							font-size: 28rpx;
							overflow: hidden;
							text-overflow:ellipsis;
							 display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 3;
						}
					}
				}
				.btn{
					display: flex;
					justify-content: flex-end;
					padding-bottom: 20rpx;
					text{
						padding: 9rpx 44rpx;
						color: #FF6504;
						border: 1px solid  #FF6504;
						border-radius: 44rpx;
						font-size: 24rpx;
					}
					text:first-child{
						margin-right: 30rpx;
					}
				}
			}
		}
	}
</style>
