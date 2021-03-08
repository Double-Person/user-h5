<template>
	<view class="newAddress">
		<!-- header -->
		<commonHeader :headerTitl="title+'收货地址'" xingHide=true lingHide=true fenxiangHide=true></commonHeader>
		<!-- 内容开始 -->
		<view class="newAddress-content">
			<view class="newAddress-content-item">
				<text>收货地址:</text>
				<input type="text" @blur="getAddress" placeholder-style="color:#999;fontSize:28rpx;textAlign:right" :value="address" placeholder="请输入收货地址"/>
			</view>
			<view class="newAddress-content-item">
				<text>门牌口:</text>
				<input type="text" class="twoInput" @blur="getRoomNum" :value="roomNum" placeholder-style="color:#999;fontSize:28rpx;textAlign:right" placeholder="详细地址, 例: 16号楼5层501室"/>
			</view>
			<view class="newAddress-content-item">
				<text>联系人:</text>
				<input type="text" :value="username" @blur="getUsername" placeholder-style="color:#999;fontSize:28rpx;textAlign:right" placeholder="姓名/昵称"/>
			</view>
			<view class="newAddress-content-sex">
				<label class="radio">
					<radio value="先生" :checked="checked" @tap="checked=!checked"/><text>先生</text>
				</label>
				<label class="radio">
					<radio value="女士" :checked="!checked" @tap="checked=!checked"/><text>女士</text>
				</label>
			</view>
			<view class="newAddress-content-item">
				<text>手机号:</text>
				<input type="text" :value="phone" @blur="getPhone" maxlength="11" placeholder-style="color:#999;fontSize:28rpx;textAlign:right" placeholder="请输入手机号"/>
			</view>
		</view>
		<!-- 修改 -->
		<view class="submit-btn" @tap="submit(editState)">
			{{title}}
		</view>
		<!-- 内容结束 -->
	</view>
</template>

<script>
	import share from '@/mixin/share.js'
	// header
	import commonHeader from "@/components/common-header/common-header";
    import {addAddress,editAddress} from "@/common/apis.js"
	export default {
		data() {
			return {
				title:'新增',
				checked:true,
				address:'',
				roomNum:'',
				username:'',
				phone:'',
                USERINFO_ID:'',
                editState:0
			};
		},
		components:{
			commonHeader
		},
		mixins: [share],
		onLoad(option) {
			this.otherPage();
            // 获取USERINFO_ID
            uni.getStorage({
                key: 'USERINFO_ID',
                success: res => {
                    this.USERINFO_ID = res.data
                }
            })
            // 数据回填
            if(!option.item){
                this.editState = 0
                return false
            }else{
               this.editState = 1
               var obj = JSON.parse(decodeURIComponent(option.item));
               this.title = '编辑';
               this.checked = obj.SEX == '先生' ? true:false;
               this.address = obj.AREA;
               this.roomNum = obj.FULLADD;
               this.username = obj.USERNAME;
               this.phone = obj.PHONE; 
            }
		},
		methods:{
			// 获取地址
			getAddress(e){
				this.address = e.detail.value;
			},
			// 获取门牌号
			getRoomNum(e){
				this.roomNum = e.detail.value;
			},
			// 获取联系人
			getUsername(e){
				this.username = e.detail.value;
			},
			// 获取手机号
			getPhone(e){
				this.phone = e.detail.value;
			},
			// 提交
			submit(state){
                if(this.username == ''||this.phone == ''||this.roomNum==''||this.address==''){
                    uni.showToast({
                        title:'请完善信息！',
                        icon:'none'
                    })
                    return false
                }
                var obj = {
                    USERINFO_ID: this.USERINFO_ID,
                    USERNAME: this.username,
                    SEX: this.checked?'先生':'女士',
                    PHONE: this.phone,
                    FULLADD: this.roomNum,
                    AREA:this.address,
                    STATES:0
                }
                if(state == 0){
                    addAddress(obj).then(res => {
                        if(res.returnMsg.status == '00'){
                            uni.showToast({
                               title:'添加成功!',
                               icon:'none'
                            })
                            setTimeout(()=>{
                                uni.navigateTo({
                                    url:"../myAddress/myAddress"
                                })
                            },1000)
                        }
                    }).catch(err => {
                        uni.showToast({
                            title:'添加失败!',
                            icon:'none'
                        })
                    })
                }else{
                    editAddress(obj).then(res => {
                        if(res.returnMsg.status == '00'){
                            uni.showToast({
                               title:'修改成功!',
                               icon:'none'
                            })
                            setTimeout(()=>{
                                uni.navigateTo({
                                    url:"../myAddress/myAddress"
                                })
                            },1000)
                        }
                    }).catch(err => {
                        uni.showToast({
                            title:'添加失败!',
                            icon:'none'
                        })
                    })
                }
			}
		}
	}
</script>

<style lang="less">
	.newAddress{
		height: 100%;
		background: #f7f7f7;
		padding-top: 120rpx;
		/* #ifdef APP-PLUS */
		padding-top: 160rpx;
		/* #endif */
		/* #ifdef MP-WEIXIN */
		padding-top: 160rpx;
		/* #endif */
		color: #333;
		font-size: 30rpx;
		.newAddress-content{
			padding-left: 30rpx;
			background: #fff;
			.newAddress-content-item{
				display: flex;
				padding-right: 30rpx;
				height: 90rpx;
				align-items: center;
				justify-content: space-between;
				border-bottom: 1rpx solid #e0e0e0;
				.twoInput{
					width: 500rpx;
				}
				input{
					text-align: right;
				}
			}
			.newAddress-content-sex{
				height: 90rpx;
				display: flex;
				align-items: center;
				border-bottom: 1rpx solid #e0e0e0;
				.radio{
					margin-left: 60rpx;
				}
				.radio:first-child{
					margin-left: 100rpx;
				}
			}
		}
		.submit-btn{
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
</style>
