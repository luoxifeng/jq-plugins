/**
 * 弹窗组件
 */

function Dialog(opt = {}){
    let defaults = {
        id: "Dialog",
        class: "J-Dialog",
        preCls: "dialog",
        title: '温馨提示',
        content: "这就是提示内容",
        button: '确定',
        maskClose: true,
        beforeOpen: function(){},
        afterOpen: function(){},
        beforeClose: function(){},
        afterClose: function(){},
    }
    opt = Object.assign(defaults, opt);

    /**
     * 钩子
     */
    this.hooks = {
        beforeOpen: opt.beforeOpen,
        afterOpen: opt.afterOpen,
        beforeClose: opt.beforeClose,
        afterClose: opt.afterClose
    }
    //渲染
    render.call(this, opt);
    //绑定事件
    bindEvent.call(this, opt);
}

Dialog.prototype = {
    constructor: Dialog,

    /**
     * 打开弹窗
     * @param {*} content 替换提示内容，若不传使用原来的
     */
    open(content){
        if(content &&　content !== this.context.find("[class*=content]")) 
            this.changeContent(content);
        $("body").css({
            overflow: "hidden"
        })
        this.hooks.beforeOpen.call(this);
        
        this.context.show();
        this.hooks.afterOpen.call(this);
    },
    close: function(){
        this.hooks.beforeClose.call(this);
        this.context.hide();
        this.hooks.afterClose.call(this);
        $("body").css({
            overflow: ""
        })
    },
    changeContent: function(content){
        this.context.find("[class*=content]").html(content);
    }
}

function render(opt){
    var pre = opt.preCls;
    let html = ''
    +   '<div class="' + (pre + '-wrapper ' + opt.class) + '" id="' + opt.id + '">'
    +       '<div class="' + (pre + '-inner') + '">'
    +           '<div class="' + (pre + '-header') + '">' + opt.title + '</div>'
    +           '<div class="' + (pre + '-content') + '">' + opt.content + '</div>'
    +           '<div class="' + (pre + '-footer') + '">'
    +               '<span class="' + (pre + '-btn') + '">'
    +                   opt.button
    +               '</span>'
    +           '</div>'
    +       '</div>'       
    +   '</div>';
    this.context = $(html).appendTo("body");
}

function bindEvent(opt){
    var self = this;
    self.context.find("[class*=btn]").on("click", function(){
        self.close();
    });

    //点击遮罩关闭
    if(opt.maskClose){
        self.context.on("click", function(e){
            if(e.target === self.context[0]){
                self.close();
            }
        });
    }
}

module.exports = Dialog;