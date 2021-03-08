<template>
	<view class="myaddress">
		<!-- header -->
		<commonHeader headerTitl="我的收货地址" xingHide=true lingHide=true fenxiangHide=true></commonHeader>
		<!-- 内容开始 -->
		<view class="myaddress-content">
			<view class="myaddress-content-address" v-if="addressList.length>0">
				<view @longpress="delStata" @longtap="delStata" class="item" v-for="(item,index) in addressList" :key="index">
					<view class="item-left" @tap="goAddress(item)">
						<text class="iconfont icon-dingwei"></text>
						<view class="item-msg">
							<view>
								{{item.USERNAME}}
								<text>{{item.PHONE}}</text>
							</view>
							<text>{{item.FULLADD}}</text>
						</view>
					</view>
					<text class="iconfont icon-youjiantou" @tap="goAddress(item)" :class="rightText?'rightText':''"></text>
					<text class="del" :class="rightText?'':'rightText'" @tap="delAddress(item.ADDRESS_ID)">删除</text>
                    <view class="setDefault" :class="item.STATES==1?'setDefaultActive':''" @click="setDefault(item.ADDRESS_ID)">
                        设为默认
                    </view>
				</view>
			</view>
            <view v-else style="text-align: center;color: #999;font-size: 30rpx;padding-top: 50rpx;">暂无收货地址</view>
			<!-- 新增 -->
			<view class="myaddress-content-btn" @tap="goNewAddress">
				新增收货地址
			</view>
		</view>
		<!-- 内容结束 -->
	</view>
</template>

<script>
	import share from '@/mixin/share.js'
	// header
	import commonHeader from "@/components/common-header/common-header";
    import {getAddress,delAddress,setDeAdress} from"@/common/apis.js";
	export default {
		data() {
			return {
				addressList:[],
				rightText:false,
                USERINFO_ID:'',
                state:''
			};
		},
		components:{
			commonHeader
		},
		mixins: [share],
		methods:{
            // 前往新增地址
			goNewAddress(){
				uni.navigateTo({
					url:"../newAddress/newAddress"
				})
			},
            // 设置默认地址
            setDefault(ADDRESS_ID){
                setDeAdress({USERINFO_ID:this.USERINFO_ID,ADDRESS_ID}).then(res => {
                    this.getAddressList()
                })
            },
			// 删除收货地址
			delStata(){
				this.rightText = true;
			},
			// 删除选中
			delAddress(id){
                delAddress({ADDRESS_ID:id}).then(res => {
                    if(res.returnMsg.status == '00'){
                        uni.showToast({
                            title:'删除成功！'
                        })
                        this.getAddressList()
                        this.rightText = false;
                    }
                })
			},
			// 前往地址编辑
			goAddress(item){
				if(this.state){
                    getApp().globalData.address = item
                    getApp().globalData.addressState = true
                    uni.navigateBack({
                        delta:1
                    })
                }else{
                    if(this.rightText){
                    	this.rightText = false;
                    }else{
                    	uni.navigateTo({
                    		url:'../newAddress/newAddress?item='+encodeURIComponent(JSON.stringify(item))
                    	})
                    }
                }
			},
            // 获取收货地址列表
            getAddressList(){
                getAddress({USERINFO_ID:this.USERINFO_ID}).then(res => {
                  this.addressList = res.returnMsg.list
                })
            }
		},
        mounted() {
            uni.getStorage({
                key: 'USERINFO_ID',
                success: res => {
                    this.USERINFO_ID = res.data
                    this.getAddressList()
                }
            })
        },
        onLoad(e){
            this.state = e.state
			this.otherPage();
        }
	}
</script>

<style lang="less">
	.myaddress{
		max-height: 100%;
		background: #f7f7f7;
		padding-top: 120rpx;
		color: #333;
		/* #ifdef APP-PLUS */
		padding-top: 160rpx;
		/* #endif */
		/* #ifdef MP-WEIXIN */
		padding-top: 160rpx;
		/* #endif */
		.myaddress-content{
			.myaddress-content-address{
				.item{
                    position: relative;
					background: #fff;
					width: 86%;
					height: 140rpx;
					margin: 30rpx auto;
					border-radius: 20rpx;
					display: flex;
					justify-content: space-between;
					align-items: center;
					font-size: 30rpx;
					padding: 0 30rpx;
					overflow: hidden;
                    .setDefault{
                        position: absolute;
                        top: 50rpx;
                        right: 100rpx;
                        font-size: 20rpx;
                        padding: 5rpx 10rpx;
                        color: #fff;
                        border-radius: 50rpx;
                        background: #999;
                    }
                    .setDefaultActive{
                        background: #FF602E;
                    }
					.item-left{
						display: flex;
						align-items: center;
						.iconfont{
							font-size: 60rpx;
							color: #FF602E;
							margin-right: 30rpx;
						}
						.item-msg{
							view{
								margin-bottom: 10rpx;
								text{
									margin-left: 20rpx;
								}
							}
							>text{
								font-size: 28rpx;
								color: #999;
							}
						}
					}
					>.iconfont{
						font-size: 40rpx;
						font-weight: bold;
						color: #999;
					}
					.del{
						background: red;
						height: 100%;
						width: 100rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						color: #fff;
						letter-spacing: 5rpx;
						margin-right: -30rpx;
					}
					.rightText{
						display: none !important;
					}
				}
			}
			.myaddress-content-btn{
				width: 95%;
				background:linear-gradient(243deg,rgba(255,153,96,1) 0%,rgba(255,90,44,1) 100%);
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
	}
</style>
