//移动端 下拉刷新插件
;(function($,window,document,undefied){

	var pluginName = 'slideDownRefresh',//插件名称
		//默认配置
		defaults   = {
			distance: 50, //鼠标滑动触发距离，大于这个值才会触发刷新事件
			callback:function(ele){
				//在这里可以使用ajax去后台调取数据
				//当加载完数据后，可以调用ele.slideEnd()函数，移除加载框
				setTimeout(function(){
					ele.slideEnd();
				},1000);
			},//触发刷新事件后的回调函数
		};

	function Plugin(element,options){
		this.element = element;
		this.options = $.extend({},defaults,options);

		this.init();
		this.holdEvent();
	}

	Plugin.prototype = {
		init: function(){
			this._start = 0; //用来记录鼠标down的位置
			this._end = 0; //用来记录鼠标滑动的距离和方向
		},
		
		holdEvent: function(){

			this.touchStart();
		},
		createSlide: function(){ //创建加载图标dom对象

			if(this.$slid){
				return;
			}
			this.element.prepend([
				'<div id="slid-down">',
					'<p>加载中...</p>',
				'</div>'
			].join(''));

			this.$slid = this.element.find('#slid-down');
			this._slid_height = this.$slid.height();
		},
		touchStart: function(){
			var _self = this;
			
			this.element.on('touchstart',function(e){
				if(_self.$slid){
					return;
				}
				_self._start = e.touches[0].pageY; //记录鼠标点击的Y轴坐标
				_self.touchMove();
				_self.createSlide();
			})
			
		},
		touchMove: function(){
			var _self = this;
			
			this.element.on('touchmove',function(e){
				_self._end = _self._start - e.touches[0].pageY;
				if(_self._end < - _self._slid_height){

					_self.$slid.css('height',- _self._end );
				}

				_self.touchEnd();
			})
		},
		touchEnd: function(){
			var _self = this;
			this.element.on('touchend',function(e){
				_self.$slid.css({height:_self._slid_height});
				if(_self._end <= - _self.options.distance){
					//超过了触发距离，则触发回调事件
					_self.options.callback(_self);
				}

				_self.element.off('touchmove touchend');
			})
		},
		slideEnd: function(){//结束本次下拉刷新事件
			var _self = this;
			this.$slid.css({height:0});//删除
			_self.$slid.remove();
			delete _self.$slid;
			//zepto没有过度函数，所有动画效果做的不是太好
		}
	}

	$.fn[pluginName] = function(options){

		return $(this).each(function(){

			if(!$(this).data('Plugin_' + pluginName)){

				return $(this).data('Plugin_' + pluginName,new Plugin($(this),options));
			}
		})
	}

})(Zepto,window,document);