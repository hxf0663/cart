Vue.config.productionTip = false;
Vue.filter("money", function(value, type){// 全局过滤器：所有页面都可使用
	return '￥ '+value.toFixed(2)+type;
});
var vm = new Vue({//this可以用vm替换（$nextTick中）；可以不必var vm = 
	el: "#app",
	data: {// 模型（Vue基本是通过实例上的数据状态变动而改变前台视图，而不会直接操作DOM）
		productList:[],
		totalMoney:0,
		checkAllFlag:false,
		delFlag:false,
		curProduct:''
	},
	filters: {// 局部过滤器：只在此实例中生效
		formatMoney: function(value){
			return '￥ '+value.toFixed(2);
		}
	},
	mounted: function(){//页面加载之后自动调用
		this.$nextTick(function(){//在2.0版本中，加mounted的$nextTick方法，才能使用vm
			// 保证this.$el已经插入文档
			this.cartView();
		})
	},
	methods: {//最好的方式是：methods 只有纯粹的数据逻辑，而不是去处理 DOM 事件细节
		cartView: function(){
			var _this = this;
			// this.$http.post,this.$http.jsonp都可以，返回数据在此版本的vue-resource是在res.data中
			this.$http.get("data/cartData.json", {"id":123}).then(function(res){
				_this.productList = res.data.result.list;//数组
				// _this.totalMoney = res.data.result.totalMoney;
			});
			// ES6写法：
			// let _this = this;
			// this.$http.get("data/cartData.json", {"id":123}).then(res=>{
			// 	this.productList = res.data.result.list;
			// 	this.totalMoney = res.data.result.totalMoney;
			// });
		},
		changeMoney: function(product, way){// 通过+、-改变商品数量从而改变总额：v-model双向绑定
			if(way>0){
				product.productQuantity++;
			}else{
				if(product.productQuantity>1){
					product.productQuantity--;
				}
			}
			this.calcTotalPrice();
		},
		selectedProduct: function(item){
			if(typeof item.checked =='undefined'){//判断是否未定义，如果没点击过按钮是没有注册的，则需要先注册checked属性
				// Vue.set(item,"checked",true);//全局注册
				this.$set(item,"checked",true);//局部注册
			}else{
				item.checked = !item.checked;
			}
			this.calcTotalPrice();
		},
		checkAll:function(flag){
			this.checkAllFlag = flag;
			var _this = this;
			this.productList.forEach(function(item,index){
				if(typeof item.checked == 'undefined'){//也要防止未定义
					_this.$set(item,"checked",_this.checkAllFlag);//通过set来给item添加属性checked
				}else{
					item.checked = _this.checkAllFlag;
				}
			});
			this.calcTotalPrice();
		},
		calcTotalPrice:function(){// 计算总金额
			var _this = this;
			this.totalMoney = 0;
			this.productList.forEach(function(item,index){
				if(item.checked){
					_this.totalMoney += item.productPrice*item.productQuantity;
				}
			});
		},
		// 确定删除
		delConfirm:function(item){
			this.delFlag = true;
			this.curProduct = item;
		},
		delProduct:function(){
			var index = this.productList.indexOf(this.curProduct);
			this.productList.splice(index,1);
			this.delFlag = false;
			this.calcTotalPrice();
		}
	}
});