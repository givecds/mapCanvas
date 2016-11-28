function Drawing(options){
    for(var k in options){
        this[k] = options[k];
    }
    //this.pixelRatio || ( this.pixelRatio = 8.34 );
    this.timer = {};
}

Drawing.prototype = {
    constructor: Drawing,

    init: function () {
        if (!this.canvas) return;
        this.canvas.css({
            'left': this.canvasLeft,
            'top': this.canvasTop,
            'width': this.canvasWidth,
            'height': this.canvasHeight,
            'classname': this.classname
        });
        this.pixelRatio = this.cancasScale;

        if (!this.readonly) {
            this.canvas.live('click', $.proxy(this.canvasHandler, this))
                .delegate('div.booth', 'click', $.proxy(this.boothHandler, this));

            this.infoDialog.delegate(':button', 'click', $.proxy(this.dialogHandler, this));
        }
    },

    canvasHandler: function (e) {
        e.stopPropagation();
        if (e.layerX) {
            this.layerX = e.layerX;
            this.layerY = e.layerY;
        } else {
            this.layerX = e.offsetX;
            this.layerY = e.offsetY;
        }

        this.isEdit = false;

        Dialog.open.call(this.infoDialog);
    },

    boothHandler: function (e) {
        e.stopPropagation();
        var id = $(e.currentTarget).attr('id');
        this.currentBoothId = id;

        this.isEdit = true;

        this._post('id=' + id + '&action=get');
    },

    dialogHandler: function (e) {
        var t = $(e.target),
            name = t.attr('name'),
            dialog = this.infoDialog;
        switch (name) {
            case 'sure': Dialog.sure.call(dialog, this); break;
            case 'cancel': Dialog.close.call(dialog); break;
            case 'del': Dialog.del.call(dialog, this); break;
        }
    },

    getLayer: function () {
        return { layerX: this.layerX, layerY: this.layerY };
    },

    paint: function (data) {
        this.canvas.append(this.paintHtml(data));
        this.bindDrag(':last');
    },

    paintAll: function (data) {
        var tempArrs = [],
            t = this;
        $.each(data, function (i, n) {
            tempArrs.push(t.paintHtml(n));
        });

        this.canvas.append(tempArrs.join(''));

        this.bindDrag();

        data = tempArrs = null;
        initBooth();
    },

    paintHtml: function (data) {
        var className = 'booth',
            pr = this.pixelRatio;
        if (data['classname']) {
            className = data['classname'];
        }
        pr = this.pixelRatio;

        if (data['sign']) {
            className = 'booth booth-sign';
        }
        var params = /hno=(\w+)/.exec(location),
            hno = '11';
        if (params) {
            hno = params[1];
        }
        var html = '';
        if (data['csname'] == '' && data['namechi'] == '') {
            html = '<a class="' + className + '" id="' + data['id'] + '" style="left: ' + data['left'] + 'px; top: ' + data['top'] + 'px; width: ' + parseFloat(data['width'] * pr).toFixed(2) + 'px; height: ' + parseFloat(data['height'] * pr).toFixed(2) + 'px;" rel="application-details.aspx?hno=' + hno + '&pno=' + data['placeno'] + '" target="_blank" title="直接点击申请该展位">';
            html = html + '<p class="f9">' + data['placeno'] + '</p>';
            if (data['area'] > 18) {
                html = html + '<p>' + data['area'] + 'm<sup>2</sup></p>';
                html = html + '<p>(' + data['width'] + '*' + data['height'] + ')</p>';
            }
            html = html + '</a>';
        } else {
            /*         html ='<div class="'+ className +'" id="'+ data['id'] +'" style="left: '+ data['left'] +'px; top: '+ data['top'] +'px; width: '+ parseFloat(data['width'] * pr).toFixed(2) +'px; height: '+ parseFloat(data['height'] * pr).toFixed(2) +'px;">';
            html = html+'<p class="f9">'+ data['placeno'] +'</p>';
            if(data['area']>18){ 
            //    html = html+'<p>'+ data['area'] +'m<sup>2</sup></p>';
            html = html+'<p>('+ data['width'] +'*'+data['height']+')</p>';
            }
            html = html+'<p>'+ data['csname'] +'</p>';
            html = html+'</div>';
            */

            html = '<div class="booth" id="' + data['id'] + '" style="left: ' + data['left'] + 'px; top: ' + data['top'] + 'px; width: ' + parseFloat(data['width'] * pr).toFixed(2) + 'px; height: ' + parseFloat(data['height'] * pr).toFixed(2) + 'px;"  info="' + hno.substr(0, hno.length - 1) + '.' + hno.substr(hno.length - 1, 1) + '馆' + data['placeno'] + '"  cname="' + data['namechi'] + '">'
                + '<p  class="f9">' + data['placeno'] + '</p>';
            if (data['area'] >= 36 && data['logo'] != undefined && data['logo'] != '' && data['width'] > 3 && data['height'] > 3) {
                // html = html+'<p><img src='+ data['logo'] +' style="vertical-align:middle;max-width:'+parseFloat(data['width'] * pr).toFixed(2)+'px;max-height:'+ (parseFloat(data['height'] * pr).toFixed(2)-17) +'px;"/></p>';
            } else {
                if (data['area'] >= 18 && data['width'] >= 3 && data['height'] > 3) {
                    // html = html + '<p>' + data['csname'] + '</p>';
                    html = html + '<p>(' + data['width'] + '*' + data['height'] + ')</p>';
                    //html = html + '<p>' + data['area'] + 'm<sup>2</sup></p>';
                }
            }
            html = html + '</div>';
        }
        /*  0320
               
        var html = '<div class="booth" id="'+ data['id'] +'" style="left: '+ data['left'] +'px; top: '+ data['top'] +'px; width: '+ parseFloat(data['width'] * pr).toFixed(2) +'px; height: '+ parseFloat(data['height'] * pr).toFixed(2) +'px;">'
        +'<p  class="f9">'+ data['placeno'] +'</p>';
        if(data['area']>=36 && data['logo']!=undefined &&data['logo']!='' ){
        html = html+'<p><img src='+ data['logo'] +' style="vertical-align:middle;max-width:160px;max-height:80px;"/></p>';
        }else{
        html = html+'<p>'+ data['csname'] +'</p>';}
        html = html+'</div>';    
        */

        return html;
    },

    bindDrag: function (selector) {
        if (!this.draggable) return;
        this.canvas.children(selector).show(100).draggable({
            containment: 'parent',
            scroll: false,
            start: $.proxy(this.dragStart, this),
            stop: $.proxy(this.dragStop, this)
        });
    },

    dragStart: function (e, ui) {
        var id = ui.helper.attr('id');
        clearTimeout(this.timer[id]);
    },

    dragStop: function (e, ui) {
        var id = ui.helper.attr('id'),
            x = ui.position.left,
            y = ui.position.top,
            t = this;


        this.layerX = x;
        this.layerY = y;

        this.timer[id] = setTimeout(function () {
            t._post('action=moving&left=' + x + '&top=' + y + '&id=' + id);
        }, 2000);
    },

    _post: function (params) {
        $.ajax({
            cache: false,
            url: this.url,
            data: params,
            dataType: 'json',
            success: $.proxy(this._postSuc, this),
            error: function (e) { debugger; }
        });
    },

    _postSuc: function (data) {
        if (!data || data.status === 0) return alert('操作失败!');
        switch (data.action) {
            case 'add':
                this.paint(data.data);
                break;
            case 'moving':
                //alert('移动成功');
                break;
            case 'edit':
                $('#' + this.currentBoothId).remove();
                this.paint(data.data);
                break;
            case 'get':
                Dialog.open.call(this.infoDialog, data.data);
                break;
            case 'del':
                $('#' + this.currentBoothId).remove();
                this.currentBoothId = '';
                break;
        }
    }
}

var Dialog = {
    mark: $('.d-mark'),
    open: function(data){
        var w = $(window), d = $(document);
        this.css({ 
                'left' : ( w.width() - this.outerWidth() ) / 2, 
                'top' : ( w.height() - this.outerHeight() ) / 2 + w.scrollTop()
            })
            .show();
        Dialog.mark
            .css({
                'width': d.width(),
                'height': d.height()
            })
            .show();
        if( data ){
            Dialog.fill.call(this,data);
        }
    },
    close: function(){
        this.hide();
        Dialog.clear.call(this);
        
        Dialog.mark.hide();
    },
    clear: function(){
        this.find(':text').val('');
    },
    fill: function(data){
        var inputs = this.find(':text,:hidden');
        for(var k in data){
            inputs.filter('[name='+ k +']').val(data[k]);
        }
    },
    sure: function(drawing){
        var fields = this.find(':text,:hidden').serialize();
        
        fields +=  '&hallno=' + drawing.hallno;
        
        if(!drawing.isEdit){
            fields += '&action=add&left='+ drawing.layerX + '&top=' + drawing.layerY;
        }else{
            fields += '&action=edit&id=' + drawing.currentBoothId;
        }
        drawing._post(fields);
        
        Dialog.close.call(this);
    },
    del: function(drawing){
        var id = drawing.currentBoothId;
        Dialog.close.call(this);
        if(!id) return;
        drawing._post('action=del&id='+ id);
    }
}

function initBooth() {
    $('a.booth').click(function () {
        var _this = $(this)
        var _chiname = "";
        $.ajax({
            type: "POST",
            contentType: "application/json",
            dataType: 'json',
            url: "/Services/MemberService.asmx/GetLoginUser",
            data: null,
            cache: false,
            async: false,
            success: function (data) {
                if (data["d"] == null) {
                    $('.opacitybg').height($('body').height());
                    $('.opacitybg').show();
                    $('#loginDiv').show();
                    if (_this.attr('rel') != "" && _this.attr('rel') != undefined) {
                        $("input[name=BackUrl]").val(_this.attr('rel')); 
                    }
                   
                } else {
                    if (_this.attr('rel') != "" && _this.attr('rel') != undefined) {
                        location.href = _this.attr('rel');
                    } else {
                        _chiname = _this.attr("namechi");
                    }
                }
            }
        });
        if (_chiname != "") {
            $.ajax({
                type: "POST",
                contentType: "application/json",
                dataType: 'json',
                url: "/API/AldgoServices.asmx/GetCompanyInfo",
                data: "{ChiName:'" + _chiname + "',ApiKey:'JDKJLHJFHSD212JJFDKJFKSD'}",
                cache: false,
                async: false,
                success: function (data) {
                    if (data["d"] == null) {
                    }
                }
            });
            $('.altInfo').show();
            $('.altInfoTitle').html(_this.attr('info'));
        }
    })
}
