
$(document).delegate('*.lightwindow', 'click', function(event) {
    event.preventDefault();
    $(this).ekkoLightbox({
        type : 'image'
    });
});


setTimeout(function(){
    var $modal = $('#felicitation-modal');
    if ($modal.length && !document.cookie.match(/felicitation=1/)) {
        $modal.one('hide.bs.modal', function() {
            document.cookie = 'felicitation=1; path=/'
        });
        $modal.modal();
        setTimeout(function(){
            $modal.modal('hide');
        }, 10000);
    }
}, 1500);

setTimeout(function(){
    var $modal = $('#alert-modal');
    if ($modal.length && !document.cookie.match(/crnamdl=1/)) {
        $modal.modal();
    }
}, 1500);
var ExhibitionEntries = {};
ExhibitionEntries.busy = false;
ExhibitionEntries.uri = location.href;
ExhibitionEntries.pages = {
    next: 2
};

ExhibitionEntries.loadNextPage = function () {
    var GET = {};
    var options = arguments[0] || {};
    if (ExhibitionEntries.busy == false && ExhibitionEntries.pages.next) {
        ExhibitionEntries.busy = true;
        delete options.success;
        var ajaxOptions = {
            type: 'GET',
            data: $.extend(GET, {'page': ExhibitionEntries.pages.next}),
            url: ExhibitionEntries.uri,
            success: function (data) {
                var newItems = $('<div></div>').html(data.content).find('.exhibition-row');
                $('.exhibition-row-footer').before(newItems);
                ExhibitionEntries.pages = data.pages;
                ExhibitionEntries.busy = false;
            }
        };
        ajaxOptions = $.extend(ajaxOptions, options);
        return $.ajax(ajaxOptions);
    }
};

$('body').on('click', '.exhibition-row-footer a', function (e) {
    e.preventDefault();
    var $me = $(this);
    var jqXHR = ExhibitionEntries.loadNextPage({
        beforeSend: function () {
            $me.append('<i class=\"fa fa-spinner fa-spin\"></i>')
        }
    });
    if (jqXHR) {
        jqXHR.done(function () {
            if (!ExhibitionEntries.pages.next) {
                $me.closest('.exhibition-row-footer').remove();
            }
        }).always(function () {
            $me.find('.fa-spin').remove();
        })
    }
});

$(function () {
    $('body').on('show.bs.collapse hidden.bs.collapse', '#country-filter, #topic-filter', function (ev) {
        var $btn = $('.participants-nav-wrap button[href="#' + $(this).attr('id') + '"]');
        if (ev.type == 'show') {
            $btn.addClass('cpsed');
            $('#country-filter, #topic-filter').not(this).collapse('hide');
        } else {
            $btn.removeClass('cpsed');
        }
    });
    $('body').on('click', '.participants-nav-wrap .collapse .btn-reset', function () {
        $(this).closest('.collapse').find('.checkbox-custom').checkbox('uncheck');
    })
});


$(function () {

    $('body').on('click', '#step1 .btn-next', function () {
        $('.participant-application-nav a[href="#step2"]').click();
    });

    $('body').on('click', '#step2 .btn-next', function () {
        $('.participant-application-nav a[href="#step3"]').click();
    });

    $('body').on('click', '.participant-application-nav a', function () {
        $('.participant-application-nav li').removeClass('active');
        $(this).closest('li').addClass('active');
        $('#step1, #step2, #step3').hide();
        $($(this).attr('href')).show();
    });

    $('.participant-application-form form input').on('invalid', function () {
        var $container = $(this).closest('#step1, #step2')
        $('.participant-application-nav a[href="#' + $container.attr('id') + '"]').click();
    });
});

$('body').on('mouseover mouseout focusin focusout', '.participant-application-form .form-control', function (evt) {
    var $fg = $(this).closest('.form-group');
    if (evt.type == 'mouseover') {
        $fg.addClass('over');
    } else if (evt.type == 'mouseout') {
        $fg.removeClass('over');
    } else if (evt.type == 'focusin') {
        $fg.addClass('focus');
    } else if (evt.type == 'focusout') {
        $fg.removeClass('focus');
    }
});


$('body').on('click', '.participants-list tr > td:first-child() a', function (ev) {


    var $tpl = $('.company_short_info:not(.active)');
    var $this = $(this);
    $('.company_short_info.active').remove();
    var $block = $tpl.clone();
    $block.appendTo($this.closest('.main-container'));
    var $tr = $this.closest('tr');

    /*if ($tr.data('adtext').length == 0){
        return;
    }*/

    ev.preventDefault();
/*
    if ($tr.data('fax').length) {
        $block.find('.fax').html($tr.data('fax'));
    } else {
        $block.find('.fax').prev('dt').remove();
        $block.find('.fax');
    }

    if ($tr.data('address').length) {
        $block.find('.address').html($tr.data('address'));
    } else {
        $block.find('.address').prev('dt').remove();
        $block.find('.address');
    }

    if ($tr.data('phone').length) {
        $block.find('.phone').html($tr.data('phone'));
    } else {
        $block.find('.phone').prev('dt').remove();
        $block.find('.phone');
    }

    if ($tr.data('website').length) {
        $block.find('.website').html($tr.data('website'));
    } else {
        $block.find('.website').prev('dt').remove();
        $block.find('.website');
    }
*/
    $block.find('.ad-text').html($tr.data('adtext'));
    $block.find('.btn').attr('href', $this.attr('href'));


    $block.find('h2').html($this.text());
    $block.find('.stand').html($this.closest('tr').find('td:last()').text());
    if ($tr.find('.participant-logo').length) {
        $block.find('h2').after($tr.find('.participant-logo').clone());
    }

    $block.css({
        'left': 0,
        'top': ($this.position().top - 30) + 'px'
    });

    $block.addClass('active');
});

$('body').on('click', '.company_short_info a.close', function (ev){
    ev.preventDefault();
    $(this).closest('.company_short_info').hide();
});

$('body').on('click', '.calendar-dropdown-handler .btn', function(ev){
    ev.preventDefault();
    var $this = $(this);
    var $dd = $('.calendar-dropdown');
    $dd.appendTo($(this).closest('.calendar-dropdown-handler'));

    var $programCol = $this.closest('.program-col');
    var $programRow = $this.closest('tr');
    if ($programCol.length){
        $dd.find('a.icalc').attr('href', 'http://addtocalendar.com/atc/ical?utz=180&uln=ru-RU&vjs=1.5' +
            '&e[0][date_start]=' + $programCol.data('start-date') +
            '&e[0][date_end]=' + $programCol.data('end-date') + '&e[0][timezone]=Europe/Moscow' +
            '&e[0][title]=' + $programCol.find('h4').text() + '&e[0][description]=' + $programCol.find('h4').nextAll('p').text() +
            '&e[0][location]=' + $programCol.find('.venue').text() +
            '&e[0][organizer]=' + $programCol.find('.organizer').text() + '&e[0][organizer_email]=');

        $dd.find('a.gcalc').attr('href', 'http://addtocalendar.com/atc/google?utz=180&uln=ru-RU&vjs=1.5' +
            '&e[0][date_start]=' + $programCol.data('start-date') +
            '&e[0][date_end]=' + $programCol.data('end-date') + '&e[0][timezone]=Europe/Moscow' +
            '&e[0][title]=' + $programCol.find('h4').text() + '&e[0][description]=' + $programCol.find('h4').nextAll('p').text() +
            '&e[0][location]=' + $programCol.find('.venue').text() +
            '&e[0][organizer]=' + $programCol.find('.organizer').text() + '&e[0][organizer_email]=');

        $dd.find('a.outlook').attr('href', 'http://addtocalendar.com/atc/outlook?utz=180&uln=ru-RU&vjs=1.5' +
            '&e[0][date_start]=' + $programCol.data('start-date') +
            '&e[0][date_end]=' + $programCol.data('end-date') + '&e[0][timezone]=Europe/Moscow' +
            '&e[0][title]=' + $programCol.find('h4').text() + '&e[0][description]=' + $programCol.find('h4').nextAll('p').text() +
            '&e[0][location]=' + $programCol.find('.venue').text() +
            '&e[0][organizer]=' + $programCol.find('.organizer').text() + '&e[0][organizer_email]=');

        $dd.find('a.yahoo').attr('href', 'http://addtocalendar.com/atc/outlook?utz=180&uln=ru-RU&vjs=1.5' +
            '&e[0][date_start]=' + $programCol.data('start-date') +
            '&e[0][date_end]=' + $programCol.data('end-date') + '&e[0][timezone]=Europe/Moscow' +
            '&e[0][title]=' + $programCol.find('h4').text() + '&e[0][description]=' + $programCol.find('h4').nextAll('p').text() +
            '&e[0][location]=' + $programCol.find('.venue').text() +
            '&e[0][organizer]=' + $programCol.find('.organizer').text() + '&e[0][organizer_email]=');

        $dd.find('a.register').closest('li')[$programCol.data('allow-reg')?'show':'hide']();

        $('#EventParticipant input[name=event]').val($programCol.data('event-id'));
    }else if ($programRow.length){
        $dd.find('a.icalc').attr('href', 'http://addtocalendar.com/atc/ical?utz=180&uln=ru-RU&vjs=1.5' +
            '&e[0][date_start]=' + $programRow.data('start-date') +
            '&e[0][date_end]=' + $programRow.data('end-date') + '&e[0][timezone]=Europe/Moscow' +
            '&e[0][title]=' + $programRow.find('.name').text() + '&e[0][description]=' +
            '&e[0][location]=' + $programRow.find('.venue').text() +
            '&e[0][organizer]=' + $programRow.find('.organizer').text() + '&e[0][organizer_email]=');

        $dd.find('a.gcalc').attr('href', 'http://addtocalendar.com/atc/google?utz=180&uln=ru-RU&vjs=1.5' +
            '&e[0][date_start]=' + $programRow.data('start-date') +
            '&e[0][date_end]=' + $programRow.data('end-date') + '&e[0][timezone]=Europe/Moscow' +
            '&e[0][title]=' + $programRow.find('.name').text() + '&e[0][description]=' +
            '&e[0][location]=' + $programRow.find('.venue').text() +
            '&e[0][organizer]=' + $programRow.find('.organizer').text() + '&e[0][organizer_email]=');

        $dd.find('a.outlook').attr('href', 'http://addtocalendar.com/atc/outlook?utz=180&uln=ru-RU&vjs=1.5' +
            '&e[0][date_start]=' + $programRow.data('start-date') +
            '&e[0][date_end]=' + $programRow.data('end-date') + '&e[0][timezone]=Europe/Moscow' +
            '&e[0][title]=' + $programRow.find('.name').text() + '&e[0][description]=' +
            '&e[0][location]=' + $programRow.find('.venue').text() +
            '&e[0][organizer]=' + $programRow.find('.organizer').text() + '&e[0][organizer_email]=');

        $dd.find('a.yahoo').attr('href', 'http://addtocalendar.com/atc/yahoo?utz=180&uln=ru-RU&vjs=1.5' +
            '&e[0][date_start]=' + $programRow.data('start-date') +
            '&e[0][date_end]=' + $programRow.data('end-date') + '&e[0][timezone]=Europe/Moscow' +
            '&e[0][title]=' + $programRow.find('.name').text() + '&e[0][description]=' +
            '&e[0][location]=' + $programRow.find('.venue').text() +
            '&e[0][organizer]=' + $programRow.find('.organizer').text() + '&e[0][organizer_email]=');

        $dd.find('a.register').closest('li')[$programRow.data('allow-reg')?'show':'hide']();

        $('#EventParticipant input[name=event]').val($programRow.data('event-id'));
    }

    $dd.collapse('show');
});

$('body').on('change', '#EventParticipant input[name=isSpeaker]', function(){
    var isChecked =  $(this).is(':checked');
    $('#EventParticipant input[name=speechTopic]').closest('.form-group')[isChecked?'show':'hide']();
});

$('body').on('show.bs.modal', '#event-register', function(ev){
    $('#EventParticipant input[name=speechTopic]').closest('.form-group').hide();
    $('#EventParticipant input[name=event]').val($(ev.relatedTarget).closest('tr,.program-col').data('event-id'));
});

$('body').on('hide.bs.modal', '#event-register', function(){
    $('#event-register').find('.alert').remove();
    if ($('#EventParticipant').length){
        $('#EventParticipant').get(0).reset();
    }
});

$('body').on('submit', '#EventParticipant', function(ev){
    ev.preventDefault();
    var $this = $(this);
    var $btn = $this.find('.btn-primary');
    var $spinner = $('<i class="fa fa-spin fa-spinner" />');
    $spinner.appendTo($btn);
    $.ajax($this.attr('action'), {
        type : 'post',
        data : $this.serialize()
    }).done(function(json){
        $('#event-register .alert').remove();
        $('#EventParticipant').before(json.content);
        //$('#EventParticipant').remove();
    }).always(function(){
        $spinner.remove();
    })
});


$('body').on('click', '.calendar-dropdown .close-dropdown', function(ev){
    ev.preventDefault();
    $(this).closest('.calendar-dropdown').collapse('hide');
});

$('body').on('click', '#random-program-lnk', function(ev){
    ev.preventDefault();
    var $this = $(this);
    var $fa = $this.nextAll('.fa');
    if ($fa.hasClass('fa-spin')){
        return;
    }
    $fa.addClass('fa-spin');
    $.get($this.data('href')).done(function(json){
        $this.closest('.events-bar').find('.col-xs-13').html(json.content);
    }).always(function(){
        $fa.removeClass('fa-spin');
    });
});

$(function(){
    $('.program-day-blocks .program-row').each(function(){
        var $this = $(this);
        $this.css('height', $this.height() + 'px');
    })
});

$(function () {
    $('.participant-application-form [data-toggle="tooltip"]').tooltip({
        'html' : true
    })
});

$(function(){
    /*$('input[name=phone]').inputmask('Regex',  {
        regex: '\\+[0-9]+.{8,}',
        isComplete: function(buffer, opts) {
            return new RegExp(opts.regex).test(buffer.join(''));
        }
    });
    $('input[name=mobile]').inputmask('Regex', {
        regex: '\\+[0-9]+.{8,}',
        isComplete: function(buffer, opts) {
            return new RegExp(opts.regex).test(buffer.join(''));
        }
    });*/
    $('input[name=email]').inputmask("email");
    $('.participant-application-form .sqrm-group input').inputmask("9{1,3}");
});


$(function(){
    $('body').on('slid.bs.carousel', '#news-article-gallery', function () {
        var $this = $(this);
        var currentIndex = $this.find('.item.active').index() + 1;
        $(this).find('.carousel-counter').html('' + currentIndex + '/' + $this.find('.item').length + '');
    });
})

$(function(){
    $('body').on('show.bs.collapse shown.bs.collapse hidden.bs.collapse hide.bs.collapse', '#news_subscribe', function(evt){
        var $this = $(this);
        if (evt.type == 'show'){
            $('.modal-backdrop').remove();
            $this.after('<div class="modal-backdrop fade in" />');
        }else if (evt.type == 'hide'){
            $('.modal-backdrop').removeClass('in');
        }else if (evt.type == 'hidden'){
            $('.modal-backdrop').remove();
        }else if (evt.type == 'shown'){
            location.href = '#news_subscribe';
        }
    });

    $('body').on('submit', '#news_subscribe form', function(e){
        e.preventDefault();
        var $form = $(this);
        var $spinner = $('<i class="fa fa-spin fa-spinner" />');
        $spinner.appendTo($form.find('.btn-primary'));
        $.ajax($form.attr('action'), {
            'type' : 'post',
            'data' : $form.serialize()
        }).done(function(json){
            $('#news_subscribe .block-body').html(json.html);
        }).always(function(){
            $spinner.remove();
        })
    })
});

$(function () {
    $('.news-list-nav .date').each(function(){
        var $this = $(this);
        $this.datetimepicker({
            locale: $this.data('lang'),
            defaultDate: ($this.find('.form-control').attr('name') == 'start')?moment():moment().subtract(1, 'month'),
            icons: {
                time: "fa fa-clock-o",
                date: "fa fa-calendar",
                up: "fa fa-arrow-up",
                down: "fa fa-arrow-down"
            },
            format : 'DD-MM-YYYY',
            maxDate : moment()
        });
    })
});

$(function () {
    var $form = $('.gallery-list-wrapper header form');
    $form.find('select,input').on('change', function () {
        $(this).closest('form').submit();
    });
    $form.find('.btn-group > .btn').on('click', function(){
        $(this).find('input').prop('checked', true).trigger('change');
    })
});

$('body').on('show.bs.modal', '#media-modal', function(event){
    setTimeout(function(){
        $('.modal-backdrop').addClass('media-backdrop');
    }, 50);
    var id = $(event.relatedTarget).data('media-id');
    var $active = $(this).find('[data-media-id=' + id + ']');
    $('#media-modal-carousel').carousel($(this).find('.item').index($active));
    $(this).find('.counter .num').html($(this).find('.item').index($(this).find('.active'))+1);

});
$('body').on('hidden.bs.modal', '#media-modal', function(){
    $('.modal-backdrop').removeClass('media-backdrop');
});

$('body').on('slid.bs.carousel', '#media-modal-carousel', function(){
    $(this).find('.counter .num').html($(this).find('.item').index($(this).find('.active'))+1);
});

$(function(){
    $('body').on('mouseover mouseout', '.gallery-item', function(event){
        if (event.type == 'mouseover'){
            $(this).addClass('hover');
        }else{
            $(this).removeClass('hover');
        }
    })
})

$(function () {
    $('body').on('slid.bs.carousel', '#carousel-opinion-widget', function (e) {
        var $this = $(this);
        var $active = $this.find('.item.active');
        if ($active.nextAll('.item').length == 0) {
            var pages = $this.data('pages') || {next: 2};
            if (!pages.next) {
                return;
            }
            $.get($this.data('uri'), {
                page: pages.next
            }).done(function (resp) {
                $this.data('pages', resp.pages);
                var $items = $('<div />').html(resp.content).find('#carousel-opinion-widget .carousel-inner .item');
                if ($items.length) {
                    $items.removeClass('active');
                    $items.appendTo($active.closest('.carousel-inner'));
                }
            });
        }
    });
    $('#carousel-opinion-widget').trigger('slid');
});

$(function(){
    $('body').on('shown.bs.tab', '#partners-widget a[data-toggle="tab"]', function(e){
        $($(e.target).attr('href') + ' .partner-row').each(function(){
            var $this = $(this);
            if ($this.hasClass('hs')){
                return;
            }
            $this.css('height', $this.height() + 'px');
        }).addClass('hs');
    });

    $('.partner-list').imagesLoaded( function() {
        $('.partner-list .partner-row').each(function(){
            var $this = $(this);
            if ($this.hasClass('hs')){
                return;
            }
            $this.css('height', $this.height() + 'px');
        }).addClass('hs');
    });

});
/** Abstract base class for collection plugins v1.0.1.
 Written by Keith Wood (kbwood{at}iinet.com.au) December 2013.
 Licensed under the MIT (https://github.com/jquery/jquery/blob/master/MIT-LICENSE.txt) license. */
(function(){var j=false;window.JQClass=function(){};JQClass.classes={};JQClass.extend=function extender(f){var g=this.prototype;j=true;var h=new this();j=false;for(var i in f){h[i]=typeof f[i]=='function'&&typeof g[i]=='function'?(function(d,e){return function(){var b=this._super;this._super=function(a){return g[d].apply(this,a||[])};var c=e.apply(this,arguments);this._super=b;return c}})(i,f[i]):f[i]}function JQClass(){if(!j&&this._init){this._init.apply(this,arguments)}}JQClass.prototype=h;JQClass.prototype.constructor=JQClass;JQClass.extend=extender;return JQClass}})();(function($){JQClass.classes.JQPlugin=JQClass.extend({name:'plugin',defaultOptions:{},regionalOptions:{},_getters:[],_getMarker:function(){return'is-'+this.name},_init:function(){$.extend(this.defaultOptions,(this.regionalOptions&&this.regionalOptions[''])||{});var c=camelCase(this.name);$[c]=this;$.fn[c]=function(a){var b=Array.prototype.slice.call(arguments,1);if($[c]._isNotChained(a,b)){return $[c][a].apply($[c],[this[0]].concat(b))}return this.each(function(){if(typeof a==='string'){if(a[0]==='_'||!$[c][a]){throw'Unknown method: '+a;}$[c][a].apply($[c],[this].concat(b))}else{$[c]._attach(this,a)}})}},setDefaults:function(a){$.extend(this.defaultOptions,a||{})},_isNotChained:function(a,b){if(a==='option'&&(b.length===0||(b.length===1&&typeof b[0]==='string'))){return true}return $.inArray(a,this._getters)>-1},_attach:function(a,b){a=$(a);if(a.hasClass(this._getMarker())){return}a.addClass(this._getMarker());b=$.extend({},this.defaultOptions,this._getMetadata(a),b||{});var c=$.extend({name:this.name,elem:a,options:b},this._instSettings(a,b));a.data(this.name,c);this._postAttach(a,c);this.option(a,b)},_instSettings:function(a,b){return{}},_postAttach:function(a,b){},_getMetadata:function(d){try{var f=d.data(this.name.toLowerCase())||'';f=f.replace(/'/g,'"');f=f.replace(/([a-zA-Z0-9]+):/g,function(a,b,i){var c=f.substring(0,i).match(/"/g);return(!c||c.length%2===0?'"'+b+'":':b+':')});f=$.parseJSON('{'+f+'}');for(var g in f){var h=f[g];if(typeof h==='string'&&h.match(/^new Date\((.*)\)$/)){f[g]=eval(h)}}return f}catch(e){return{}}},_getInst:function(a){return $(a).data(this.name)||{}},option:function(a,b,c){a=$(a);var d=a.data(this.name);if(!b||(typeof b==='string'&&c==null)){var e=(d||{}).options;return(e&&b?e[b]:e)}if(!a.hasClass(this._getMarker())){return}var e=b||{};if(typeof b==='string'){e={};e[b]=c}this._optionsChanged(a,d,e);$.extend(d.options,e)},_optionsChanged:function(a,b,c){},destroy:function(a){a=$(a);if(!a.hasClass(this._getMarker())){return}this._preDestroy(a,this._getInst(a));a.removeData(this.name).removeClass(this._getMarker())},_preDestroy:function(a,b){}});function camelCase(c){return c.replace(/-([a-z])/g,function(a,b){return b.toUpperCase()})}$.JQPlugin={createPlugin:function(a,b){if(typeof a==='object'){b=a;a='JQPlugin'}a=camelCase(a);var c=camelCase(b.name);JQClass.classes[c]=JQClass.classes[a].extend(b);new JQClass.classes[c]()}}})(jQuery);
/* http://keith-wood.name/imageCube.html
 Image Cube for jQuery v2.0.0.
 Written by Keith Wood (kbwood{at}iinet.com.au) June 2008.
 Available under the MIT (https://github.com/jquery/jquery/blob/master/MIT-LICENSE.txt) license.
 Please attribute the author if you use it. */
(function($){var U='imagecube';var V=0;var W=1;var X=2;var Y=3;$.JQPlugin.createPlugin({name:U,defaultOptions:{direction:'random',randomSelection:['up','down','left','right'],speed:2000,easing:'linear',repeat:true,pause:2000,selection:'forward',shading:true,opacity:0.8,imagePath:'',full3D:true,segments:20,reduction:30,expansion:10,lineHeight:[0.0,1.25],letterSpacing:[-0.4,0.0],beforeRotate:null,afterRotate:null},_getters:['current','next'],_instSettings:function(a,b){return{_position:a.css('position')}},_postAttach:function(b,c){b.css({position:'relative'}).children().each(function(){var a=$(this);a.data(U,{display:a.css('display'),width:a.css('width'),height:a.css('height'),position:a.css('position'),lineHeight:a.css('lineHeight'),letterSpacing:a.css('letterSpacing')}).css({display:'block',width:b.css('width'),height:b.css('height'),position:'absolute',lineHeight:c.options.lineHeight[1],letterSpacing:c.options.letterSpacing[1]})}).not(':first').hide();this._prepareRotation(b)},_optionsChanged:function(a,b,c){$.extend(b.options,c);this._prepareRotation(a)},_prepareRotation:function(b){b=$(b);b.children('.imageCubeShading,.imageCubeFrom,.imageCubeTo').remove();var c=this._getInst(b[0]);c.current=b.children(':visible')[0];c.current=(c.current?c.current:b.children(':first')[0]);var d=function(a){return(!a.length?a:a.filter(':eq('+Math.floor(Math.random()*a.length)+')'))};c.next=(c.options.selection=='random'?d(b.children(':hidden')):(c.options.selection=='backward'?$(c.current).prev():$(c.current).next()));c.next=(c.next.length?c.next:(c.options.selection=='random'?c.current:(c.options.selection=='backward'?b.children(':last'):b.children(':first'))))[0];if(c.options.repeat&&!c._timer){var e=this;c._timer=setTimeout(function(){e.rotate(b)},c.options.pause)}},rotate:function(a,b,c){a=$(a);if(!a.hasClass(this._getMarker())){return}if(typeof b=='function'){c=b;b=null}this.stop(a,true);var d=this._getInst(a[0]);if(b!=null){b=(typeof b=='number'?a.children(':eq('+b+')'):$(b));if(a.children().filter(function(){return this===b[0]}).length>0){d.next=b}}var e=[d.current,d.next];if($.isFunction(d.options.beforeRotate)){d.options.beforeRotate.apply(a[0],e)}var f={};f[U]=1.0;a.attr(U,0.0).stop(true,true).animate(f,d.options.speed,d.options.easing,function(){if($.isFunction(d.options.afterRotate)){d.options.afterRotate.apply(a[0],e)}if(c){c.apply(a[0])}})},current:function(a){a=$(a);return(a.hasClass(this._getMarker())?this._getInst(a[0]).current:null)},next:function(a){a=$(a);return(a.hasClass(this._getMarker())?this._getInst(a[0]).next:null)},stop:function(a,b){a=$(a);if(!a.hasClass(this._getMarker())){return}var c=this._getInst(a[0]);if(c._timer){clearTimeout(c._timer);c._timer=null}if(!b){c.options.repeat=false}},start:function(a){this.option(a,{repeat:true})},_preDestroy:function(b,c){this.stop(b);var c=this._getInst(b[0]);b.stop().css({position:c._position}).children('.imageCubeShading,.imageCubeFrom,.imageCubeTo').remove();b.children().each(function(){var a=$(this);a.css(a.data(U)).removeData(U)}).show()},_prepareAnimation:function(d){d=$(d);var e=this._getInst(d[0]);var f={left:0,top:0};d.parents().each(function(){var a=$(this);if(a.css('position')=='fixed'){f.left-=a.offset().left;f.top-=a.offset().top;return false}});var g={width:d.width(),height:d.height()};var h=(e.options.direction!='random'?e.options.direction:e.options.randomSelection[Math.floor(Math.random()*e.options.randomSelection.length)]);h=Math.max(0,$.inArray(h,['up','down','left','right']));e._curDirection=h;var j=(h==V||h==W);var k=(h==X||h==Y);var l=(h==V||h==X);var m=(l?0:e.options.opacity);var n=$(e.current);var o=$(e.next);var q=[];var r=function(p){var b=[0,0,0,0];if(p.css('border')!=undefined){$.each(['Left','Right','Top','Bottom'],function(i,a){b[i]=p.css('border'+a+'Width');b[i]=parseFloat({thin:1,medium:3,thick:5}[b[i]]||b[i])})}return b};q[0]=r(n);q[1]=r(o);var s=[];s[0]=[parseFloat(n.css('padding-left')),parseFloat(n.css('padding-right')),parseFloat(n.css('padding-top')),parseFloat(n.css('padding-bottom'))];s[1]=[parseFloat(o.css('padding-left')),parseFloat(o.css('padding-right')),parseFloat(o.css('padding-top')),parseFloat(o.css('padding-bottom'))];var t=[];t[0]=($.support.boxModel?[q[0][0]+q[0][1]+s[0][0]+s[0][1],q[0][2]+q[0][3]+s[0][2]+s[0][3]]:[0,0]);t[1]=($.support.boxModel?[q[1][0]+q[1][1]+s[1][0]+s[1][1],q[1][2]+q[1][3]+s[1][2]+s[1][3]]:[0,0]);var u=[];u[0]={elem:n[0],props:{left:{start:f.left,end:f.left+(h==Y?g.width:0),units:'px'},width:{start:g.width-t[0][0],end:(j?g.width-t[0][0]:0),units:'px'},top:{start:f.top,end:f.top+(h==W?g.height:0),units:'px'},height:{start:g.height-t[0][1],end:(j?0:g.height-t[0][1]),units:'px'},paddingLeft:{start:s[0][0],end:(k?0:s[0][0]),units:'px'},paddingRight:{start:s[0][1],end:(k?0:s[0][1]),units:'px'},paddingTop:{start:s[0][2],end:(j?0:s[0][2]),units:'px'},paddingBottom:{start:s[0][3],end:(j?0:s[0][3]),units:'px'},borderLeftWidth:{start:q[0][0],end:(k?0:q[0][0]),units:'px'},borderRightWidth:{start:q[0][1],end:(k?0:q[0][1]),units:'px'},borderTopWidth:{start:q[0][2],end:(j?0:q[0][2]),units:'px'},borderBottomWidth:{start:q[0][3],end:(j?0:q[0][3]),units:'px'},lineHeight:{start:e.options.lineHeight[1],end:(j?e.options.lineHeight[0]:e.options.lineHeight[1]),units:'em'},letterSpacing:{start:e.options.letterSpacing[1],end:(j?e.options.letterSpacing[1]:e.options.letterSpacing[0]),units:'em'}}};u[1]={elem:o[0],props:{left:{start:f.left+(h==X?g.width:0),end:f.left,units:'px'},width:{start:(j?g.width-t[1][0]:0),end:g.width-t[1][0],units:'px'},top:{start:f.top+(h==V?g.height:0),end:f.top,units:'px'},height:{start:(j?0:g.height-t[1][1]),end:g.height-t[1][1],units:'px'},paddingLeft:{start:(k?0:s[1][0]),end:s[1][0],units:'px'},paddingRight:{start:(k?0:s[1][1]),end:s[1][1],units:'px'},paddingTop:{start:(j?0:s[1][2]),end:s[1][2],units:'px'},paddingBottom:{start:(j?0:s[1][3]),end:s[1][3],units:'px'},borderLeftWidth:{start:(k?0:q[1][0]),end:q[1][0],units:'px'},borderRightWidth:{start:(k?0:q[1][1]),end:q[1][1],units:'px'},borderTopWidth:{start:(j?0:q[1][2]),end:q[1][2],units:'px'},borderBottomWidth:{start:(j?0:q[1][3]),end:q[1][3],units:'px'},lineHeight:{start:(j?e.options.lineHeight[0]:e.options.lineHeight[1]),end:e.options.lineHeight[1],units:'em'},letterSpacing:{start:(j?e.options.letterSpacing[1]:e.options.letterSpacing[0]),end:e.options.letterSpacing[1],units:'em'}}};if(e.options.shading){var v=function(a,b,c){return{left:{start:a.left.start,end:a.left.end,units:'px'},width:{start:a.width.start,end:a.width.end,units:'px'},top:{start:a.top.start,end:a.top.end,units:'px'},height:{start:a.height.start,end:a.height.end,units:'px'},paddingLeft:{start:a.paddingLeft.start+a.borderLeftWidth.start,end:a.paddingLeft.end+a.borderLeftWidth.end,units:'px'},paddingRight:{start:a.paddingRight.start+a.borderRightWidth.start,end:a.paddingRight.end+a.borderRightWidth.end,units:'px'},paddingTop:{start:a.paddingTop.start+a.borderTopWidth.start,end:a.paddingTop.end+a.borderTopWidth.end,units:'px'},paddingBottom:{start:a.paddingBottom.start+a.borderBottomWidth.start,end:a.paddingBottom.end+a.borderBottomWidth.end,units:'px'},opacity:{start:b,end:c,units:''}}};u[2]={elem:$((!$.support.opacity?'<img src="'+e.options.imagePath+'imageCubeHigh.png"':'<div')+' class="imageCubeShading" style="background-color: white; opacity: '+m+'; z-index: 10; position: absolute;"'+(!$.support.opacity?'/>':'></div>'))[0],props:v(u[l?0:1].props,m,e.options.opacity-m)};u[3]={elem:$((!$.support.opacity?'<img src="'+e.options.imagePath+'imageCubeShad.png"':'<div')+' class="imageCubeShading" style="background-color: black; opacity: '+(e.options.opacity-m)+'; z-index: 10; position: absolute;"'+(!$.support.opacity?'/>':'></div>'))[0],props:v(u[l?1:0].props,e.options.opacity-m,m)}}if(e.options.full3D){for(var i=0;i<e.options.segments;i++){d.append(n.clone().addClass('imageCubeFrom').css({display:'block',position:'absolute',overflow:'hidden'}));if(e.options.shading){d.append($(u[l?2:3].elem).clone())}}for(var i=0;i<e.options.segments;i++){d.append(o.clone().addClass('imageCubeTo').css({display:'block',position:'absolute',width:0,overflow:'hidden'}));if(e.options.shading){d.append($(u[l?3:2].elem).clone())}}n.hide();o.css({width:g.width-t[1][0],height:g.height-t[1][1]})}else{var w=function(a){return{left:a.left.start+'px',width:a.width.start+'px',top:a.top.start+'px',height:a.height.start+'px',lineHeight:a.lineHeight.start+'em',padding:a.paddingTop.start+'px '+a.paddingRight.start+'px '+a.paddingBottom.start+'px '+a.paddingLeft.start+'px',borderLeftWidth:a.borderLeftWidth.start+'px',borderRightWidth:a.borderRightWidth.start+'px',borderTopWidth:a.borderTopWidth.start+'px',borderBottomWidth:a.borderBottomWidth.start+'px',letterSpacing:a.letterSpacing.start+'em',overflow:'hidden'}};n.css(w(u[0].props));o.css(w(u[1].props)).show();if(e.options.shading){d.append(u[2].elem).append(u[3].elem)}}for(var i=0;i<u.length;i++){for(var x in u[i].props){var y=u[i].props[x];y.diff=y.end-y.start}}return u},_drawFull3D:function(G,H,I){G=$(G);var J=G.data(U);if(!J.options.full3D){return false}var K=J._curDirection;var L=(K==V||K==W);var M=(K==V||K==X);var N=G.width();var O=G.height();if(N==0||O==0){return true}var P=(1-H)*(L?O:N);var Q=J.options.segments;var R=J.options.expansion*(1-Math.abs(2*P-(L?O:N))/(L?O:N));var S=J.options.reduction-(J.options.reduction*P/(L?O:N));var T=function(a,b,c,d,e,f,g,k,l,m,n,o){var p=[d-b,f-k];var w=Math.max(p[0],p[1]);var q=[l-c,g-e];var h=Math.max(q[0],q[1]);var r=(L?(p[0]-p[1])/(Q-1)/2:w/Q);var s=(L?h/Q:(q[0]-q[1])/(Q-1)/2);var t=n.paddingLeft[o]+n.paddingRight[o]+n.borderLeftWidth[o]+n.borderRightWidth[o];var u=n.paddingTop[o]+n.paddingBottom[o]+n.borderTopWidth[o]+n.borderBottomWidth[o];var v=Math.round(b);var x=Math.round(c);var y=v;var z=x;var i=0;for(var j=0;j<G[0].childNodes.length;j++){var A=G[0].childNodes[j];if(A.className!=a){continue}var B=Math.round(b+(i+1)*r);var C=Math.round(c+(i+1)*s);var D=p[0]-(L?2*i*r:0);var E=q[0]-(L?0:2*i*s);A.style.left=(L?y:b)+'px';A.style.top=(L?c:z)+'px';A.style.width=Math.max(0,D-t)+'px';A.style.height=Math.max(0,E-u)+'px';A.style.letterSpacing=(L?D/w*(J.options.letterSpacing[1]-J.options.letterSpacing[0])+J.options.letterSpacing[0]:H*n.letterSpacing.diff+n.letterSpacing.start)+n.letterSpacing.units;A.style.lineHeight=(!L?E/h*(J.options.lineHeight[1]-J.options.lineHeight[0])+J.options.lineHeight[0]:H*n.lineHeight.diff+n.lineHeight.start)+n.lineHeight.units;A.style.clip='rect('+(!L?'auto':(z-x)+'px')+','+(L?'auto':(B-v)+'px')+','+(!L?'auto':(C-x)+'px')+','+(L?'auto':(y-v)+'px')+')';if(J.options.shading){var F=A.nextSibling;F.style.left=y+'px';F.style.top=z+'px';F.style.width=(L?p[0]-2*i*r:B-y)+'px';F.style.height=(L?C-z:q[0]-2*i*s)+'px';F.style.opacity=m;if(!$.support.opacity){F.style.filter='alpha(opacity='+(m*100)+')'}}y=B;z=C;i++}};T('imageCubeFrom',[S,-R,0,N-P][K],[0,O-P,S,-R][K],[N-S,N+R,P,N][K],[0,O-P,-R,S][K],[N+R,N-S,P,N][K],[P,O,O+R,O-S][K],[-R,S,0,N-P][K],[P,O,O-S,O+R][K],(!J.options.shading?0:(M?H:1-H)*I[2].props.opacity.diff+I[2].props.opacity.start),I[0].props,'start');T('imageCubeTo',[-R,J.options.reduction-S,P,0][K],[P,0,-R,J.options.reduction-S][K],[N+R,N-(J.options.reduction-S),N,N-P][K],[P,0,J.options.reduction-S,-R][K],[N-(J.options.reduction-S),N+R,N,N-P][K],[O,O-P,O-(J.options.reduction-S),O+R][K],[J.options.reduction-S,-R,P,0][K],[O,O-P,O+R,O-(J.options.reduction-S)][K],(!J.options.shading?0:(M?H:1-H)*I[3].props.opacity.diff+I[3].props.opacity.start),I[1].props,'end');return true}});$.fx.step[U]=function(a){if(!a.stepProps){a.start=0.0;a.end=1.0;a.stepProps=$.imagecube._prepareAnimation(a.elem);var b=a.stepProps[0].elem;a.saveCSS={borderLeftWidth:b.style.borderLeftWidth,borderRightWidth:b.style.borderRightWidth,borderTopWidth:b.style.borderTopWidth,borderBottomWidth:b.style.borderBottomWidth,padding:b.style.padding}}if(!$.imagecube._drawFull3D(a.elem,a.pos,a.stepProps)){for(var i=0;i<a.stepProps.length;i++){var c=a.stepProps[i];for(var d in c.props){var e=c.props[d];c.elem.style[d]=(a.pos*e.diff+e.start)+e.units;if(!$.support.opacity&&d=='opacity'){c.elem.style.filter='alpha(opacity='+((a.pos*e.diff+e.start)*100)+')'}}}}if(a.pos==1){$(a.stepProps[0].elem).hide().css(a.saveCSS);$(a.stepProps[1].elem).show();$.imagecube._prepareRotation(a.elem)}}})(jQuery);

$('#defaultCube').imagecube({
 imagePath : '/assets/img/'
});
if (typeof ymaps != undefined && $('#ymap-office').length) {
    var officeMap;
    var coordinates = {
        'office': {
            'point': [55.805516, 37.633722],
            'pixelInitial': [1267808.6233656888, 656852.1707334585],
            'pixelOpened':  [1267808.6233656888, 656642.1707334585],
            'icon' : '/assets/img/contact_placemark_icon.png'
        }
        /*,
        'exhibition': {
            'point': [55.830944, 37.638266],
            'pixelInitial': [1267808.6233656888, 656802.1707334585],
            'pixelOpened': [1267834.7911623109, 656440.98206240],
            'icon' : '/assets/img/contact_placemark_vdnkh.png'

        }*/
    };
    ymaps.ready(function () {
        officeMap = new ymaps.Map("ymap-office", {
            center: [55.830044, 37.633774],
            zoom: 13,
            controls: []
        });
        officeMap.controls
            .add("zoomControl", {
                float: "none",
                position: {
                    bottom: 20,
                    left: 10
                }
            });

        $.each(coordinates, function (k, v) {
            var meLayout = ymaps.templateLayoutFactory.createClass('<div class="me_pm_container">' +
                '<img src="' + v['icon'] +'" class="icon"></div>');

            var placemark = new ymaps.Placemark(v['point'], null, {
                iconLayout: meLayout,
                iconShape: {
                    type: 'Circle',
                    coordinates: [0, -66],
                    radius: 27
                }
            });
            officeMap.geoObjects.add(placemark);
        });

    });


    $('body').on('click', '.contact-header  .map-collapse-handler', function (e) {
        e.preventDefault();
        if ($('.contact-header').is('.opening')) {
            return;
        }

        var pixel = coordinates['office'];
        if ($('.contact-header').is('.opened:not(.exhibition)')) {
            officeMap.setGlobalPixelCenter([pixel['pixelInitial'][0], pixel['pixelInitial'][1]], 13, {
                duration: 500
            });
            $('.contact-header').removeClass('office');
            $('.contact-header').removeClass('opened');
        } else {
            officeMap.setGlobalPixelCenter([pixel['pixelOpened'][0], pixel['pixelOpened'][1]], 13, {
                duration: 500
            });
            $('.contact-header').addClass('office');
            $('.contact-header').addClass('opening');
            $('.contact-header').addClass('opened');
            setTimeout(function(){
                $('.contact-header').removeClass('opening');
            }, 1000);
        }

        $('.contact-header').removeClass('exhibition');

    });

    $('body').on('click', '.contact-header  .slide-handler', function (e) {
        e.preventDefault();
        if ($('.contact-header').is('.opening')) {
            return;
        }

        var pixel = coordinates['exhibition'];
        if ($('.contact-header').is('.opened:not(.office)')) {  //закрываем
            officeMap.setGlobalPixelCenter([pixel['pixelInitial'][0], pixel['pixelInitial'][1]], 13, {
                duration: 500
            });
            $('.contact-header').removeClass('exhibition');
            $('.contact-header').removeClass('opened');

        } else { //открываем
            officeMap.setGlobalPixelCenter([pixel['pixelOpened'][0], pixel['pixelOpened'][1]], 13, {
                duration: 500
            });
            $('.contact-header').addClass('exhibition');
            $('.contact-header').addClass('opening');
            $('.contact-header').addClass('opened');
            setTimeout(function(){
                $('.contact-header').removeClass('opening');
            }, 1000);
        }
        $('.contact-header').removeClass('office');

    })
}

$(function () {
    $('body').on('submit', '.contact-form form', function (e) {
        e.preventDefault();
        var $form = $(this);
        var $spinner = $('<i class="fa fa-spin fa-spinner" />');
        $spinner.appendTo($form.find('.btn-primary'));
        $.ajax($form.attr('action'), {
            'type': 'post',
            'data': $form.serialize()
        }).done(function (json) {
            $form.before(json.html);
            $form.get(0).reset();
        }).always(function () {
            $spinner.remove();
        })
    })
});

$(function(){
    $('#exhibition-schema-opener .btn').on('click', function(ev){
        ev.preventDefault();
        $('#exhibition-schema, #exhibition-schema-opener').toggleClass('opened');
    });
});
(function () {
    var $container = $('#schema-wrap'),
        $svg = $container.find('svg'),
        _DRAGGGING_STARTED = 0,
        _LAST_MOUSEMOVE_POSITION = {x: null, y: null},
        _DIV_OFFSET = $container.offset(),
        _CONTAINER_WIDTH = $container.outerWidth(),
        _CONTAINER_HEIGHT = $container.outerHeight(),
        _IMAGE_WIDTH = $svg.width(),
        _IMAGE_HEIGHT = $svg.height();


    $container.on('mousedown', function (event) {
        _DRAGGGING_STARTED = 1;
        /* Save mouse position */
        _LAST_MOUSE_POSITION = {x: event.pageX - _DIV_OFFSET.left, y: event.pageY - _DIV_OFFSET.top};
    });

    $container.on('mouseup', function () {
        _DRAGGGING_STARTED = 0;
    });

    $container.on('mousemove', function (event) {
        if (_DRAGGGING_STARTED === 1) {
            var current_mouse_position = {x: event.pageX - _DIV_OFFSET.left, y: event.pageY - _DIV_OFFSET.top};
            var change_x = current_mouse_position.x - _LAST_MOUSE_POSITION.x;
            var change_y = current_mouse_position.y - _LAST_MOUSE_POSITION.y;

            /* Save mouse position */
            _LAST_MOUSE_POSITION = current_mouse_position;

            var img_top = parseInt($svg.css('top'), 10);
            var img_left = parseInt($svg.css('left'), 10);

            var img_top_new = img_top + change_y;
            var img_left_new = img_left + change_x;

            /* Validate top and left do not fall outside the image, otherwise white space will be seen */
            if (img_top_new > 0)
                img_top_new = 0;
            if (img_top_new < (_CONTAINER_HEIGHT - $svg.height()))
                img_top_new = _CONTAINER_HEIGHT - $svg.height();

            if (img_left_new > 0)
                img_left_new = 0;
            if (img_left_new < (_CONTAINER_WIDTH - $svg.width()))
                img_left_new = _CONTAINER_WIDTH - $svg.width();

            $svg.css({top: img_top_new + 'px', left: img_left_new + 'px'});
        }
    });

    var participantData = [], dataUri = $container.data('url');

    function findRecordByPoint(rect) {
        return participantData.find(function (val) {
            return (parseFloat(val.x) >= rect.x && parseFloat(val.y) >= rect.y && parseFloat(val.x) <= (rect.x + rect.width) && parseFloat(val.y) <= (rect.y + rect.height))
        });
    }

    $.getJSON(dataUri).done(function (json) {
        if (json.success) {
            participantData = json.coordinates;
        }
    });

    $svg.find('path').on("mouseover", function (ev) {
        var record = findRecordByPoint(this.getBBox());
        if (record && record.participants.length) {
            this.innerHTML = '<title>' + record.participants.map(function(v){
                return v.name;
            }).join(', ') + '</title>';
        }
    });

    $svg.find('path').on("click", function (ev) {
        var parentOffset = $container.offset(), relX = ev.pageX - parentOffset.left,
            relY = ev.pageY - parentOffset.top,
            $popover = $('.popover'), record, html;
        if (!$popover.length) {
            $popover = $('<div class="popover fade top" role="tooltip"><div class="arrow" style="left: 50%;"></div><div class="popover-content"></div></div>');
            $popover.appendTo($container);
        }
        $popover.hide().removeClass('in');

        record = findRecordByPoint(this.getBBox());
        if (record && record.participants.length) {
            html = '<ul>';
            html += record.participants.map(function (v) {
                return '<li><a target="_blank" href="' + dataUri.replace('coordinates', v.id) + '">' + v.name + '</a></li>'
            }).join(' ');
            html += '</ul>';

            $popover.find('.popover-content').html(html);
            $popover.show().addClass('in').css({
                'left': relX - ($popover.width() / 2),
                'top': relY - $popover.height() - 10
            });
        }
    });

    $container.on('mousewheel', function(ev){
        ev.preventDefault();
        var delta = ev.deltaY || ev.detail || ev.wheelDelta,
            w = Math.max(Math.min($svg.width() + (delta * 50), _IMAGE_WIDTH * 3), $container.width());

        $svg.css('width', w + 'px');
    });

})();

