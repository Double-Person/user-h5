<template>
	<view class="bindWeixin">
	    <!-- header -->
	    <commonHeader headerTitl="支付宝提现" xingHide=true lingHide=true fenxiangHide=true></commonHeader>
	    <!-- 内容 -->
	    <view class="bindWeixin-content">
	        <view class="bindWeixin-content-item">
	            <text>可提现金额:{{nowmoney}}</text>
	        </view>
	        <view class="bindWeixin-content-item">
	            <text>提现金额</text>
	            <input type="text" value="" placeholder-style="color:#999;fontSize:28rpx;" v-model="amount" placeholder="请输入提现金额" />
	        </view>
	    </view>
	    <!-- 提交按钮 -->
	    <view class="submit-btn" @tap="goBack">
	        提现
	    </view>
	</view>
</template>

<script>
	import commonHeader from "@/components/common-header/common-header";
	import {
	    bandApliy,
	    sendCode,transfer,personal
	} from "@/common/apis.js"
	export default {
	    data() {
	        return {
	            selectCode: false,
	            disabled: false,
	            codeText: "获取验证码",
	            USERINFO_ID: '',
	            username: '',
	            wx: '',
	            phone: '',
	            code: '',
				amount:'',
				nowmoney:0
	        };
	    },
	    components: {
	        commonHeader
	    },
	    methods: {
	        goBack() {
				var data = {
					USERINFO_ID:this.USERINFO_ID,
					trans_amount:this.amount
				}
	           transfer(data).then(res=>{
				   var returnMsg = res.returnMsg;
				   if(res.msgType == 0){
					   if(returnMsg.status == "00"){
						  uni.showToast({
						  	title:'提现成功！',
						  	icon:'success'
						  }) 
					   }
				   }else{
					   uni.showToast({
					   	title:'网络出小差了！',
					   	icon:'none'
					   })
				   }
			   })
	        },
	    },
	    mounted() {
	        uni.getStorage({
	            key: 'USERINFO_ID',
	            success: res =>{
					this.USERINFO_ID = res.data
                    personal({USERINFO_ID:res.data}).then(res=>{
						var returnMsg = res.returnMsg
						var userInfo = returnMsg.userInfo
                    	if(res.msgType == 0){
                    		var userBalance = userInfo.BALANCE
							var bounty = userInfo.bounty
							var nowmoney = parseFloat(userBalance) - parseFloat(bounty)
							this.nowmoney = nowmoney
                    	}else{
                    		uni.showToast({
                    			title:'网络出小差了！',
                    			icon:'none'
                    		})
                    	}
                    })
                } 
	        })
	    }
	}
</script>

<style  lang="less">
	.bindWeixin {
	    min-height: 97%;
	    background: #f7f7f7;
	    padding-top: 120rpx;
	    color: #333;
	    font-size: 30rpx;
	    /* #ifdef APP-PLUS */
	    padding-top: 160rpx;
	    /* #endif */
	    /* #ifdef MP-WEIXIN */
	    padding-top: 160rpx;
	
	    /* #endif */
	    .bindWeixin-content {
	        background: #fff;
	        padding-left: 30rpx;
	
	        .bindWeixin-content-item {
	            display: flex;
	            justify-content: space-between;
	            border-bottom: 1px solid #e0e0e0;
	            height: 90rpx;
	            align-items: center;
	
	            text {
	                width: 180rpx;
	            }
	
	            input {
	                width: 250rpx;
	                text-align: right;
	                margin-right: 30rpx;
	            }
	
	            view {
	                display: flex;
	
	                input {
	                    width: 200rpx;
	                }
	
	                .testCode {
	                    font-size: 30rpx;
	                    color: #FF5904;
	                    padding: 10rpx 25rpx;
	                    background: #f1f1f1;
	                    border-radius: 40rpx;
	                    margin-right: 30rpx;
	                    opacity: 0.5;
	                }
	                .selectCode {
	                	opacity: 1;
	                }
	
	                /deep/ uni-button {
	                    line-height: 1em;
	                }
	
	                /deep/ button {
	                    line-height: 1em;
	                }
	            }
	        }
	
	        .bindWeixin-content-item:first-child {
	            input {
	                flex: 1;
	            }
	        }
	
	        uni-button {
	            line-height: 1em;
	            padding: 0;
	        }
	    }
	
	    .submit-btn {
	        width: 95%;
	        background: linear-gradient(243deg, rgba(255, 153, 96, 1) 0%, rgba(255, 90, 44, 1) 100%);
	        height: 88rpx;
	        border-radius: 10rpx;
	        color: #fff;
	        font-size: 40rpx;
	        margin: 150rpx auto 90rpx;
	        text-align: center;
	        line-height: 88rpx;
	        box-shadow: 0 10rpx 20rpx #FF9960;
	    }
	}
</style>

