/**
 * 获取线上实时数据
 */
;(function ($, window, document, undefined) {

    var RealTimeData = function (element, options) {
        this.options = options;
        this.$element = $(element);
        this.listen();
    };

    RealTimeData.prototype = {
        'data': {},
        'listen': function () {
            if(this.options.listenUrl.length != 0) {
                var objRealTime = this;
                $.get(
                    objRealTime.options.listenUrl,
                    function (result) {
                        if(result.status) {
                            if(result.data != objRealTime.data) {
                                objRealTime.data = result.data;
                                objRealTime.$element.trigger('dataChanged', objRealTime.data);
                            }
                        }
                        // objRealTime.listen(); // 递归调用
                        setTimeout($.proxy(function () { this.listen(); }, objRealTime), 100); // setTimeout 全局调用
                    },
                    'json'
                );
            } else {
                throw new Error('监听 url 不能为空!');
            }
        },
        'change': function () {}
    };

    // 保留原来的数据
    var old = $.fn.realTimeData;

    // 给 jQuery 里添加插件
    $.fn.realTimeData = function (option) {
        return this.each(function () {
            var $this = $(this)
              , data = $this.data('realTimeData')
              , options = $.extend({}, $.fn.realTimeData.defaults, $this.data(), typeof option == 'object' && option);
            if(!data) $this.data('realTimeData', (data = new RealTimeData(this, options)));
            if(typeof option == 'string') data[option]();
        });
    };

    // 处理重名冲突
    $.fn.realTimeData.noConflict = function () {
        $.fn.realTimeData = old;
        return this;
    }

    // 默认参数
    $.fn.realTimeData.defaults = {
        'listenUrl' : ''
    };

}) (window.jQuery, window, document);