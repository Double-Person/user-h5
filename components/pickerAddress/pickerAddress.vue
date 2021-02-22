<template>
	<view class="">
		<picker @change="bindPickerChange" @columnchange="columnchange" :range="array" range-key="name" :value="value" mode="multiSelector">
			<slot></slot>
		</picker>
	</view>
</template>

<script>
	import AllAddress from './data.js'
	let selectVal = ['', '', '']

	export default {
		
		data() {
			return {
				AllAddress: AllAddress,
				value: [0, 0, 0],
				array: [],
				index: 0,
				list: []
			}
		},
		created() {
			this.initSelect()
		},
		mounted() {
			setTimeout(() => {
				this.setCheckAddress()
			}, 3000)

		},

		methods: {
			
			async setCheckAddress() {
				
				try {
				    const value = uni.getStorageSync('addressList');
					
				    if (value) {
						let index = await this.AllAddress.findIndex( ele => ele.provinceName == value[0] );
						
						this.value = await [ index, 0, 0 ];
					
						let indey = await this.AllAddress[index].city.findIndex( ele => ele.cityName == value[1] );
						
						await this.updateSelectIndex('change1', indey)
						
						let indez = await this.AllAddress[index].city[indey].county.findIndex( ele => ele.countyName == value[2] );
				
						await this.updateSelectIndex('change2', indez).updateSourceDate().updateAddressDate().$forceUpdate() // 触发双向绑定
						// this.value = await [ index, indey, indez ];
				
				    }
				} catch (e) {
				    // error
				}
			},
			// 初始化地址选项
			initSelect() {
				this.updateSourceDate() // 更新源数据
					.updateAddressDate() // 更新结果数据
					.$forceUpdate() // 触发双向绑定
			},
			// 地址控件改变控件
			columnchange(d) {
				this.updateSelectIndex(d.detail.column, d.detail.value) // 更新选择索引
					.updateSourceDate() // 更新源数据
					.updateAddressDate() // 更新结果数据
					.$forceUpdate() // 触发双向绑定
			},

			/**
			 * 更新源数据
			 * */
			updateSourceDate() {
				this.array = []
				this.array[0] = AllAddress.map(obj => {
					return {
						name: obj.provinceName
					}
				})
				this.array[1] = AllAddress[this.value[0]].city.map(obj => {
					return {
						name: obj.cityName
					}
				})
				this.array[2] = AllAddress[this.value[0]].city[this.value[1]].county.map(obj => {
					return {
						name: obj.countyName
					}
				})
				return this
			},

			/**
			 * 更新索引
			 * */
			updateSelectIndex(column, value) {
				let arr = JSON.parse(JSON.stringify(this.value))
				arr[column] = value
				if (column === 0) {
					arr[1] = 0
					arr[2] = 0
				}
				if (column === 1) {
					arr[2] = 0
				}
				// 手动更改数据
				if(column === 'change1') {
					arr[1] = value
				}
				if(column === 'change2') {
					arr[2] = value
				}
				
				this.value = arr
				return this
			},

			/**
			 * 更新结果数据 
			 * */
			updateAddressDate() {
				selectVal[0] = this.array[0][this.value[0]].name
				selectVal[1] = this.array[1][this.value[1]].name
				selectVal[2] = this.array[2][this.value[2]].name
				return this
			},

			/**
			 * 点击确定
			 * */
			bindPickerChange(e) {
				this.$emit('change', {
					index: this.value,
					data: selectVal
				})
				return this
			}

		}
	}
</script>

<style>
</style>
