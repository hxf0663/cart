Vue.config.productionTip = false;
new Vue({
	el:'.container',
	//data, computed, method里面的属性都会被代理到vm对象的实例属性上
	data:{// 需提交到后台的数据记得定义在data里
		limitNum:3,
		addressList: [],
		currentIndex:0,
		shippingMethod:1
	},
	mounted: function(){
		this.$nextTick(function(){
			this.getAddressList();
		});
	},
	computed:{//计算属性：任何复杂逻辑，都应当使用计算属性，而不应在模板内使用复杂的表达式
		filterAddress:function(){//计算属性是基于它们的依赖进行缓存的，只有在它的相关依赖发生改变时才会重新求值
			return this.addressList.slice(0,this.limitNum);
		}
	},
	methods:{
		getAddressList: function() {
			var _this = this;
			this.$http.get("data/address.json").then(function(response) {
				var res = response.data;
				if (res.status == "0") {
					_this.addressList = res.result;

				}
			});
		},
		// loadMore:function(){// 展开所有的功能也可以写成方法，然后调用
		// 	this.limitNum = this.addressList.length;
		// },
		setDefault:function(addressId){
			this.addressList.forEach(function(address,index){
				if(address.addressId==addressId){
					address.isDefault = true;
				}else{
					address.isDefault = false;
				}
			});
		}
	}
});