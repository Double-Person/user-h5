<template>
    <view class="bindWeixin">
        <!-- header -->
        <commonHeader headerTitl="绑定支付宝" xingHide=true lingHide=true fenxiangHide=true></commonHeader>
        <!-- 内容 -->
        <view class="bindWeixin-content">
            <view class="bindWeixin-content-item">
                <text>姓名</text>
                <input type="text" value="" placeholder-style="color:#999;fontSize:28rpx;" v-model="username"
                    placeholder="请输入姓名，实名不一致将导致提现失败" />
            </view>
            <view class="bindWeixin-content-item">
                <text>支付宝账号</text>
                <input type="text" value="" placeholder-style="color:#999;fontSize:28rpx;" v-model="wx" placeholder="请输入支付宝账号" />
            </view>
            <view class="bindWeixin-content-item">
                <text>手机号</text>
                <input type="number" value="" @input="getphone" maxlength="11" placeholder-style="color:#999;fontSize:28rpx;" v-model="phone"
                    placeholder="请输入手机号" />
            </view>
            <view class="bindWeixin-content-item">
                <text>验证码</text>
                <view>
                    <input type="number" value="" v-model="code" placeholder-style="color:#999;fontSize:28rpx;"
                        placeholder="请填写验证码" />
                    <button class="testCode" :class="selectCode?'selectCode':''" :disabled="disabled" @tap="getCode">{{codeText}}</button>
                </view>
            </view>
        </view>
        <!-- 提交按钮 -->
        <view class="submit-btn" @tap="goBack">
            提交
        </view>
    </view>
</template>

<script>
    import commonHeader from "@/components/common-header/common-header";
	import share from '@/mixin/share.js'
    import {
        bandApliy,
        sendCode
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
                code: ''
            };
        },
        components: {
            commonHeader
        },
		mixins: [share],
		onLoad() {
			this.otherPage();
		},
        methods: {
            // 获取手机号
            getphone(e){
                if(e.detail.value.length == 11){
                    this.selectCode = true
                }else{
                    this.selectCode = false
                }
            },
            goBack() {
                if (this.username == '' || this.wx == '' || this.phone == '' || this.code == '') {
                    uni.showToast({
                        title: "请完善信息!",
                        icon: 'none'
                    })
                    return false
                }
                var obj = {
                    "USERINFO_ID": this.USERINFO_ID,
                    "name": this.username,
                    "aliAccount": this.wx,
                    "mobile": this.phone,
                    "code": this.code
                }
                bandApliy(obj).then(res => {
                    if (res.returnMsg.status == '00') {
                        uni.showToast({
                            title: "绑定成功!",
                            icon: 'none'
                        })
                        setTimeout(() => {
                            uni.navigateTo({
                                url: "../myCard/myCard"
                            })
                        }, 2000)
                    }else if(res.returnMsg.status == '01'){
                        uni.showToast({
                            title: "请输入验证码!",
                            icon:'none',
                        })
                    }else if(res.returnMsg.status == '02'){
                        uni.showToast({ title: "验证码错误!", icon:'none', })
                    }else if(res.returnMsg.status == '03'){
                        uni.showToast({ title: "验证码超市!", icon:'none', })
                    }else if(res.returnMsg.status == '04'){
                        uni.showToast({ title: "实名认证未通过或未认证!", icon:'none', })
                    }else if(res.returnMsg.status == '05'){
                        uni.showToast({ title: "与实名认证中的姓名不一致!", icon:'none', })
                    }else if(res.returnMsg.status == '06'){
                        uni.showToast({ title: "绑定手机号不一致!", icon:'none', })
                    }
                })
            },
            // 获取验证码
            getCode() {
            	if (this.selectCode) {
            		this.disabled = true;
            		var time = 59;
            		this.codeText = time + 's后重新获取';
            		// 发送验证码
            		sendCode({MOBILE:this.phone}).then(res=>{
            			if(res.returnMsg.status=='00'){
            				uni.showToast({
            					title:'发送成功！',
            					icon:'none'
            				})
            			}else{
            				uni.showToast({
            					title:'发送失败！',
            					icon:'none'
            				})
            			}
            		}).catch(err=>{
            			uni.showToast({
            				title:'发送失败！',
            				icon:'none'
            			})
            		})
            		var setTime = setInterval(() => {
            			time--;
            			this.codeText = time + 's后重新获取';
            		}, 1000)
            		setTimeout(() => {
            			this.codeText = "获取验证码";
            			this.disabled = false;
            			clearInterval(setTime);
            		}, 59000)
            	}
            },
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
