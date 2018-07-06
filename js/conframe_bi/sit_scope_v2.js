//  ------------------------------------------------------------------------------------ //
//                                  ConFrame-Electric CTM V3                             //
//                               Copyright (c) 2011-2014 DunRose                         //
//                                  <http://www.dunrose.ru/>                             //
//  ------------------------------------------------------------------------------------ //
//  Author: Mr. Thurairajasingam Senthilruban           TSRuban[AT]dunrose.ru            //
//  Programmer: Mr. Kharitonov Constantine Igorevich    CKharitonov[AT]dunrose.ru        //
//  URL: http://www.dunrose.ru                                                           //
// ------------------------------------------------------------------------------------- //
jQuery(function($){
    $.datepicker.regional['ru'] = {
        closeText: 'Закрыть',
        prevText: '&#x3c;Пред',
        nextText: 'След&#x3e;',
        currentText: 'Сегодня',
        monthNames: ['Январь','Февраль','Март','Апрель','Май','Июнь',
            'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
        monthNamesShort: ['Янв','Фев','Мар','Апр','Май','Июн',
            'Июл','Авг','Сен','Окт','Ноя','Дек'],
        dayNames: ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'],
        dayNamesShort: ['вск','пнд','втр','срд','чтв','птн','сбт'],
        dayNamesMin: ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],
        weekHeader: 'Не',
        dateFormat: 'dd.mm.yy',
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: ''
    };
    $.datepicker.setDefaults($.datepicker.regional['ru']);
});

function group_event(){
    this.group_id = null;
    this.group_name = null;
    this.class_name = null;
    this.div_id = null;
    this.events = new Array();
}

function evt(data){
    this.data = data;
}

var SIT_SCOPE = {
    'base_url' : null,
    'items' : null,
    'drag_event' : null,
    'drag_start' : false,
    'group_events': new Object(),
    'timeline' : null,
    'selected_objects' : new Array(),
    'union_window' : null,
    'events' : new Object(),
    'default_class' : 'label-default',
    'selected_class' : 'label-primary',
    'blink' : null,
    'situations' : null,
    'messages' : null,
    'msg_window_width' : 450,
    'msg_window_height' : 150,
    'msg_window_max_length' : 150,
    'evt_content_max_length' : 7,
    'sms_icon' : 'glyphicon glyphicon-envelope',
    'email_icon' : 'glyphicon glyphicon-inbox',
    'ojur_icon' : 'glyphicon glyphicon-book',
    'alarm_event_map' : null,
    'alarm_rules' : null,
    //'zoomMax' : 8500000,
    //'zoomMin' : 400000,
    'sits_id_list' : new Array(),
    'msgs_id_list' : new Array(),
    'radec_list' : null,
    'act_view_url' : null,
    'count_of_de_energized_facilities' : null,
    'count_ps_rp_tp' : null,
    'equipment_people_teams' : null,
    'update_timer' : null,
    'update_interval' : 30000 //30 Sec
};
/*
 * CKharitonov
 */
SIT_SCOPE.init = function(){
    $('#content').html('<div class="panel-body" id="visualization" style="padding-top:0px;"></div>');
    $('#situation').html('<div class="sit_cont" id="sit_cont" style="height:'+$(window).height()/3+';"></div>');
    SIT_SCOPE.load_data();
    if (SIT_SCOPE.situations != null){
        SIT_SCOPE.situation_view();
    }
    else {
        $('#sit_cont').html('Открытые ситуации отсутствуют.');
    }
    $('.pop').popover({html:true});
    SIT_SCOPE.load_mouse_events();
    SIT_SCOPE.load_mouse_events_for_drag();
}
/*
 * CKharitonov
 */
SIT_SCOPE.situation_view = function(){
    $('#style').html('');
    $('#sit_cont').html('');
    for (var i=0; i<SIT_SCOPE.situations.length; i++){
        SIT_SCOPE.add_situation(SIT_SCOPE.situations[i],i);
    }
    var html = '';
    html += '<div role="tooltip">';
        html += '<div id="pop_win" class="pop_window"></div>';
    html += '</div>';
    $('#sit_cont').append(html);
}
/*
 * CKharitonov
 */
SIT_SCOPE.event_onmousedown = function(evt_id){
    $('#pop_win').css({
        'visibility': 'hidden'
    });
    SIT_SCOPE.drag_event = SIT_SCOPE.events[evt_id];
    SIT_SCOPE.timeline.setOptions({moveable: false});
    SIT_SCOPE.drag_start = true;
    if (SIT_SCOPE.events[evt_id]["fk_copy"] != null){
        if (SIT_SCOPE.group_events[SIT_SCOPE.events[evt_id]["fk_copy"]].events.length > 1){
            var html = SIT_SCOPE.group_events[SIT_SCOPE.events[evt_id]["fk_copy"]].events.length+' '+langs.get_term("txt_events");
        }
        else {
            var html = SIT_SCOPE.group_events[SIT_SCOPE.events[evt_id]["fk_copy"]].events[0].text;
        }
    }
    else {
        if (SIT_SCOPE.selected_objects.length > 1){
            var html = SIT_SCOPE.selected_objects.length+' '+langs.get_term("txt_events");
        }
        else {
            var html = SIT_SCOPE.events[evt_id]["text"];
        }
    }
    $('#drag_cont').html(html);
    if (SIT_SCOPE.events[evt_id]["fk_copy"] != null){
        for (var i=0; i<SIT_SCOPE.selected_objects.length; i++){
            $('#'+SIT_SCOPE.selected_objects[i]).removeClass(SIT_SCOPE.selected_class).addClass(SIT_SCOPE.default_class);
        }
        $('#selected_events_window').dialog('close');
        SIT_SCOPE.selected_objects = new Array();
        for (var i=0; i<SIT_SCOPE.group_events[SIT_SCOPE.events[evt_id]["fk_copy"]].events.length; i++){
            SIT_SCOPE.selected_objects.push(SIT_SCOPE.group_events[SIT_SCOPE.events[evt_id]["fk_copy"]].events[i].id);
            $('#'+SIT_SCOPE.group_events[SIT_SCOPE.events[evt_id]["fk_copy"]].events[i].id).removeClass(SIT_SCOPE.group_events[SIT_SCOPE.events[evt_id]["fk_copy"]].class_name).addClass(SIT_SCOPE.selected_class);
        }
    }
    $('.group_bdg_active').removeClass('group_bdg_active').addClass('group_bdg');
}
/*
 * CKharitonov
 */
SIT_SCOPE.group_onmousedown = function(div_id){
    $('#pop_win').css({
        'visibility': 'hidden'
    });
    for (var i in SIT_SCOPE.group_events){
        if (SIT_SCOPE.group_events[i].div_id == div_id){
            var group_id = SIT_SCOPE.group_events[i].group_id;
        }
    }
    SIT_SCOPE.drag_event = SIT_SCOPE.events[group_id];
    SIT_SCOPE.drag_div = div_id;
    SIT_SCOPE.timeline.setOptions({moveable: false});
    SIT_SCOPE.drag_start = true;
    if (SIT_SCOPE.group_events[group_id].events.length > 1){
        var html = SIT_SCOPE.group_events[group_id].events.length+' '+langs.get_term("txt_events");
    }
    else {
        var html = SIT_SCOPE.group_events[group_id].events[0].text;
    }
    $('#drag_cont').html(html);
    for (var i=0; i<SIT_SCOPE.selected_objects.length; i++){
        $('#'+SIT_SCOPE.selected_objects[i]).removeClass(SIT_SCOPE.selected_class).addClass(SIT_SCOPE.default_class);
    }
    $('#selected_events_window').dialog('close');
    SIT_SCOPE.selected_objects = new Array();
    for (var i=0; i<SIT_SCOPE.group_events[group_id].events.length; i++){
        SIT_SCOPE.selected_objects.push(SIT_SCOPE.group_events[group_id].events[i].id);
        $('#'+SIT_SCOPE.group_events[group_id].events[i].id).removeClass(SIT_SCOPE.group_events[group_id].class_name).addClass(SIT_SCOPE.selected_class);
    }
    $('.group_bdg').removeClass('group_bdg').addClass('group_bdg_active');
}
/*
 * CKharitonov
 */
SIT_SCOPE.group_onmouseup = function(div_id){
    if (SIT_SCOPE.drag_start == false) return;
    if (SIT_SCOPE.drag_event == null) return;
    if (SIT_SCOPE.events[SIT_SCOPE.selected_objects[0]]["fk_situation"] == null) return;
    $('#drag_cont').css({
        'visibility': 'hidden'
    });
    if (SIT_SCOPE.events[SIT_SCOPE.selected_objects[0]]["fk_copy"] != null){
        if (SIT_SCOPE.group_events[SIT_SCOPE.events[SIT_SCOPE.selected_objects[0]]["fk_copy"]].div_id != div_id){
            if (!confirm(langs.get_term('txt_union_groups'))){
                $('.group_bdg_active').removeClass('group_bdg_active').addClass('group_bdg');
                for (var i=0; i<SIT_SCOPE.selected_objects.length; i++){
                    $('#'+SIT_SCOPE.selected_objects[i]).removeClass(SIT_SCOPE.selected_class).addClass(SIT_SCOPE.group_events[SIT_SCOPE.events[SIT_SCOPE.selected_objects[0]]["fk_copy"]].class_name);
                }
                $('#selected_events_window').dialog('close');
                SIT_SCOPE.selected_objects = new Array();
                SIT_SCOPE.drag_event = null;
                SIT_SCOPE.drag_start = false;
                SIT_SCOPE.timeline.setOptions({moveable: true});
                return;
            }
        }
    }
    for (var i in SIT_SCOPE.group_events){
        if (SIT_SCOPE.group_events[i].div_id == div_id){
            var group_id = SIT_SCOPE.group_events[i].group_id;
            var sit_id = SIT_SCOPE.group_events[i].events[0].fk_situation;
        }
    }
    if (SIT_SCOPE.group_events[SIT_SCOPE.events[SIT_SCOPE.selected_objects[0]]["fk_copy"]].div_id != div_id){
        SIT_SCOPE.set_event_order(sit_id,SIT_SCOPE.group_events[group_id].group_order);
    }
    for (var i=0; i<SIT_SCOPE.selected_objects.length; i++){
        $('#'+SIT_SCOPE.selected_objects[i]).removeClass(SIT_SCOPE.selected_class).addClass(SIT_SCOPE.group_events[group_id].class_name);
        if (SIT_SCOPE.events[SIT_SCOPE.selected_objects[i]]["fk_copy"] != group_id){
            SIT_SCOPE.group_events[group_id].events.push(SIT_SCOPE.events[SIT_SCOPE.selected_objects[i]]);
            if (SIT_SCOPE.events[SIT_SCOPE.selected_objects[i]]["fk_copy"] != null){
                SIT_SCOPE.remove_event(SIT_SCOPE.events[SIT_SCOPE.selected_objects[i]]["id"],''+SIT_SCOPE.group_events[SIT_SCOPE.events[SIT_SCOPE.selected_objects[i]]["fk_copy"]].div_id+'',1,false);
            }
            SIT_SCOPE.update_sit_grp(SIT_SCOPE.events[SIT_SCOPE.selected_objects[i]]["id"],sit_id,group_id);
        }
    }
    $('#bdg_'+SIT_SCOPE.group_events[group_id].div_id).html(SIT_SCOPE.group_events[group_id].events.length);
    $('#'+SIT_SCOPE.group_events[group_id].div_id+'_alarm').html(SIT_SCOPE.check_group_alarm(SIT_SCOPE.group_events[group_id].events));
    $('.group_bdg_active').removeClass('group_bdg_active').addClass('group_bdg');
    $('#selected_events_window').dialog('close');
    SIT_SCOPE.selected_objects = new Array();
    SIT_SCOPE.drag_event = null;
    SIT_SCOPE.drag_start = false;
    SIT_SCOPE.timeline.setOptions({moveable: true});
}
/*
 * CKharitonov
 */
SIT_SCOPE.load_mouse_events = function(){
    $(document).mouseup(function(){
        if (SIT_SCOPE.drag_event != null && SIT_SCOPE.events[SIT_SCOPE.drag_event.id]["fk_copy"] != null){
            var selected_events = $('.'+SIT_SCOPE.selected_class);
            for (var i=0; i<selected_events.length; i++){
                $('#'+selected_events[i].id).removeClass(SIT_SCOPE.selected_class).addClass(SIT_SCOPE.group_events[SIT_SCOPE.events[selected_events[i].id]["fk_copy"]].class_name);
            }
            $('.group_bdg_active').removeClass('group_bdg_active').addClass('group_bdg');
            $('#selected_events_window').dialog('close');
            SIT_SCOPE.selected_objects = new Array();
        }
        SIT_SCOPE.drag_event = null;
        SIT_SCOPE.drag_start = false;
        SIT_SCOPE.timeline.setOptions({moveable: true});
        $('#drag_cont').css({
            'visibility': 'hidden'
        });
        $('.for_drag').css({
            'height': 35,
            'width': 5,
            'display': 'inline-block',
            'background': '#fff',
            'border': 0
        });
        $('.pop').popover('hide');
    }).mousemove(function(e){
        if (SIT_SCOPE.drag_start){
            $('#drag_cont').css({
                'top': e.pageY+10,
                'left': e.pageX+5,
                'visibility': 'visible'
            });
            if ($('#'+SIT_SCOPE.drag_event.id).hasClass(SIT_SCOPE.default_class)){
                var m = false;
                for (var i=0; i<SIT_SCOPE.selected_objects.length; i++){
                    if (SIT_SCOPE.drag_event.id == SIT_SCOPE.selected_objects[i]){
                        m = true;
                    }
                }
                if (m == false){
                    SIT_SCOPE.selected_objects.push(SIT_SCOPE.drag_event.id);
                }
                if (SIT_SCOPE.selected_objects.length > 0){
                    SIT_SCOPE.selected_events_view();
                    $('.group_bdg').removeClass('group_bdg').addClass('group_bdg_active');
                }
                $('#'+SIT_SCOPE.drag_event.id).removeClass(SIT_SCOPE.default_class).addClass(SIT_SCOPE.selected_class);
            }
            else if ($('#'+SIT_SCOPE.drag_event.id).hasClass(SIT_SCOPE.selected_class)){
                if (SIT_SCOPE.selected_objects.length > 0){
                    $('.group_bdg').removeClass('group_bdg').addClass('group_bdg_active');
                }
            }
            if (SIT_SCOPE.selected_objects.length > 1){
                var html = SIT_SCOPE.selected_objects.length+' '+langs.get_term("txt_events");
            }
            else {
                var html = SIT_SCOPE.events[SIT_SCOPE.selected_objects[0]]["text"];
            }
            $('#drag_cont').html(html);
        }
    });
    $('body').unbind();
    $('body').mouseup(function(e){
        var found_elem = false;
        $(e.target).parents().map(function(){
            if ($(this).attr('role') == 'tooltip'){
                found_elem = true;
                return;
            }
        });
        if (found_elem == false){
            $('#pop_win').css({
                'visibility': 'hidden'
            });
        }
    });
    document.getElementById('move_left').onclick = function(){ move(0.2); };
    document.getElementById('move_right').onclick = function(){ move(-0.2); };
    $('#sit_cont').unbind();
    $('#sit_cont').scroll(function(){
        $('.pop').popover('hide');
        $('#pop_win').css({
            'visibility': 'hidden'
        });
    });
}
/*
 * CKharitonov
 */
SIT_SCOPE.load_mouse_events_for_drag = function(){
    $('.for_drag').unbind();
    $('.for_drag').mouseout(function(e){
        if (SIT_SCOPE.drag_start){
            $('#'+e.target.id).css({
                'height': 35,
                'width': 5,
                'display': 'inline-block',
                'background': '#fff',
                'border': 0,
                'padding': 5
            });
        }
    }).mouseover(function(e){
        if (SIT_SCOPE.drag_start){
            if (SIT_SCOPE.drag_event.fk_situation == $(e.target).attr('sit')){
                $('#'+e.target.id).css({
                    'height': 35,
                    'width': 35,
                    'display': 'inline-block',
                    'background': '#e6e6e6',
                    'padding': 10
                });
            }
        }
    }).mouseup(function(e){
        if (SIT_SCOPE.drag_start){
            if (SIT_SCOPE.drag_event.fk_situation == $(e.target).attr('sit')){
                SIT_SCOPE.set_event_order(SIT_SCOPE.drag_event.fk_situation,$(e.target).attr('pos'));
            }
        }
    });
}
/*
 * CKharitonov
 */
SIT_SCOPE.set_event_order = function(sit_id,pos){
    var ord = 0;
    var events_order = new Array();
    $('#events_'+sit_id+' span.group').each(function(){
        if ($(this).attr('id') !== 'cont_'+SIT_SCOPE.drag_div){
            ord++;
            if (ord == pos){
                ord++;
            }
            $('#'+$(this).attr('id')).attr('data-sort',ord);
        }
        else {
            $('#cont_'+SIT_SCOPE.drag_div).attr('data-sort',pos);
        }
        for (var i in SIT_SCOPE.group_events){
            if ('cont_'+SIT_SCOPE.group_events[i].div_id == $(this).attr('id')){
                event_order = new Object();
                event_order.group = new Array();
                for (var j=0; j<SIT_SCOPE.group_events[i].events.length; j++){
                    var evt_ord = new Object();
                    evt_ord.id = SIT_SCOPE.group_events[i].events[j].id;
                    evt_ord.event_order = $('#'+$(this).attr('id')).attr('data-sort');
                    event_order.group.push(evt_ord);
                }
            }
        }
        events_order.push(event_order);
    });
    $.ajax({
        url: SIT_SCOPE.base_url+'index.php/conframe_bi/update_event_order',
        type: 'POST',
        data: {'sit_id':sit_id,'data':JSON.stringify(events_order)},
        success: function(){
            SIT_SCOPE.sort_events(sit_id);
            SIT_SCOPE.load_mouse_events_for_drag();
        }
    });
}

function on_group_mouseup(sit_id,sit_count){
    if (SIT_SCOPE.drag_event != null){
        if (SIT_SCOPE.selected_objects.length > 0){
            SIT_SCOPE.union(sit_id,sit_count);
            SIT_SCOPE.load_mouse_events_for_drag();
        }
    }
}

function on_group_over(grp){
    $(grp).css({
        'background': '#DCDCDC'
    })
}

function on_group_out(grp){
    $(grp).css({
        'background': '#F5F5F5'
    })
}
/*
 * CKharitonov
 */
SIT_SCOPE.add_group_button = function(grp,sit_id){
    if (grp.group_order == null){
        grp.group_order = $('#events_'+sit_id).children('span.group').length+1;
    }
    var html = '<span class="group" id="cont_'+grp.div_id+'" data-sort="'+grp.group_order+'"><div id="'+CFUtil.guid()+'" sit="'+sit_id+'" pos="" class="for_drag">&nbsp;</div>';
        html += '<span class="well well-sm cls_event" onmouseup="SIT_SCOPE.group_onmouseup(\''+grp.div_id+'\')" ';
            html += 'onmousedown="SIT_SCOPE.group_onmousedown(\''+grp.div_id+'\')" ';
            html += 'id="'+grp.div_id+'" onclick="SIT_SCOPE.add_group_popover_content(this,\''+grp.div_id+'\')">';
            html += '<span id="'+grp.div_id+'_alarm">'+SIT_SCOPE.check_group_alarm(grp.events)+'</span>';
            html += '<span id="'+grp.div_id+'_name" style="margin-right:5px;">'+grp.group_name+'</span>';
            html += '<span class="badge '+grp.class_name+'" id="bdg_'+grp.div_id+'">'+grp.events.length+'</span>';
        html += '</span>';
    html += '</span>';
    $('#events_'+sit_id).append(html);
    /*$('#'+grp.div_id).mouseover(function(){
       $('#'+grp.div_id).css({
            'background': '#DCDCDC'
        })
    }).mouseout(function(){
       $('#'+grp.div_id).css({
            'background': '#F5F5F5'
        })
    });*/
}
/*
 * CKharitonov
 */
SIT_SCOPE.add_group_popover_content = function(e,div_id){
    $('#pop_win').css({
        'visibility': 'hidden'
    });
    for (var i in SIT_SCOPE.group_events){
        if (SIT_SCOPE.group_events[i].div_id == div_id){
            var group_id = SIT_SCOPE.group_events[i].group_id;
        }
    }
    if (SIT_SCOPE.group_events[group_id].events.length != 0){
        var html = '<table class="table table-hover" style="font-size:12;margin-bottom:0;">';
            html += '<tbody>';
            for (var i=0; i<SIT_SCOPE.group_events[group_id].events.length; i++){
                var msg_id = null;
                if (SIT_SCOPE.group_events[group_id].events[i].fk_sms != null){
                    msg_id = 'sms_'+SIT_SCOPE.group_events[group_id].events[i].fk_sms;
                }
                else if (SIT_SCOPE.group_events[group_id].events[i].fk_email != null){
                    msg_id = 'email_'+SIT_SCOPE.group_events[group_id].events[i].fk_email;
                }
                html += '<tr id="tr'+SIT_SCOPE.group_events[group_id].events[i]["id"]+'" style="cursor:pointer;" onmouseout="SIT_SCOPE.mouse_out('+SIT_SCOPE.group_events[group_id].events[i]["id"]+')" onmouseover="SIT_SCOPE.mouse_over('+SIT_SCOPE.group_events[group_id].events[i]["id"]+')">';
                    html += '<td width="12%" style="padding:3px;">'+SIT_SCOPE.check_for_alarm(SIT_SCOPE.group_events[group_id].events[i])+'</td>';
                    html += '<td width="65%" style="padding:3px;" onclick="SIT_SCOPE.focus_on_message(\''+msg_id+'\');" nowrap>'+SIT_SCOPE.group_events[group_id].events[i]["text"]+'</td>';
                    html += '<td width="23%" style="padding:3px;">';
                        if (SIT_SCOPE.group_events[group_id].events.length > 1){
                            html += '<span class="glyphicon glyphicon-minus-sign alert-warning" style="margin-right:5px;" title="Разгруппировать" onclick="SIT_SCOPE.ungroup_event('+SIT_SCOPE.group_events[group_id].events[i]["id"]+',\''+SIT_SCOPE.group_events[group_id].div_id+'\',\''+SIT_SCOPE.group_events[group_id].class_name+'\')"></span>';
                        }
                        html += '<span class="glyphicon glyphicon-remove-sign alert-danger" title="'+langs.get_term("sm_btn_delete")+'" onclick="SIT_SCOPE.remove_event('+SIT_SCOPE.group_events[group_id].events[i]["id"]+',\''+SIT_SCOPE.group_events[group_id].div_id+'\',0,true);"></span>';
                    html += '</td>';
                html += '</tr>';
            }
            html += '</tbody>';
        html += '</table>';
        $('#pop_win').html(html);
        var coord = e.getBoundingClientRect();
        if (coord.bottom+145 > $(window).height()){
            $('#pop_win').css({
                'top': coord.top-145,
                'left': coord.left,
                'visibility': 'visible'
            });
        }
        else {
            $('#pop_win').css({
                'top': coord.bottom+5,
                'left': coord.left,
                'visibility': 'visible'
            });
        }
    }
}
/*
 * CKharitonov
 */
SIT_SCOPE.focus_on_message = function(msg_id){
    SIT_SCOPE.timeline.focus(msg_id,{animate:1000});
    for (var i=0; i<SIT_SCOPE.messages.length; i++){
        if (SIT_SCOPE.messages[i].id == msg_id){
            var date = CFUtil.get_local_datetime(SIT_SCOPE.messages[i].date_time);
            var start_date = new Date(date.setMinutes(date.getMinutes()-2.5));
            var date = CFUtil.get_local_datetime(SIT_SCOPE.messages[i].date_time);
            var end_date = new Date(date.setMinutes(date.getMinutes()+3.5));
            SIT_SCOPE.timeline.setWindow({
                start: start_date,
                end: end_date
            });
        }
    }
}
/*
 * CKharitonov
 */
SIT_SCOPE.ungroup_event = function(evt_id,div_id,class_name){
    sit_id = SIT_SCOPE.events[evt_id].fk_situation;
    SIT_SCOPE.remove_event(evt_id,div_id,0,false);
    var data = new Array();
    data.push(SIT_SCOPE.events[evt_id]);
    var grp = new group_event();
    grp.group_id = evt_id;
    grp.group_name = SIT_SCOPE.events[evt_id].type;
    grp.class_name = class_name;
    grp.group_order = null;
    grp.events = data;
    grp.div_id = CFUtil.guid();
    SIT_SCOPE.group_events[evt_id] = grp;
    SIT_SCOPE.add_group_button(grp,sit_id);
    SIT_SCOPE.drag_div = grp.div_id;
    SIT_SCOPE.set_event_order(sit_id,grp.group_order);
    SIT_SCOPE.update_sit_grp(evt_id,sit_id,evt_id);
    $('#'+evt_id).removeClass(SIT_SCOPE.default_class).addClass(class_name);
}
/*
 * CKharitonov
 */
SIT_SCOPE.remove_event = function(evt_id,div_id,m,conf){
    if (conf){
        if (!confirm(langs.get_term("txt_delete_evt_from_grp_sit"))){
            return;
        }
    }
    for (var i in SIT_SCOPE.group_events){
        if (SIT_SCOPE.group_events[i].div_id == div_id){
            var group_id = SIT_SCOPE.group_events[i].group_id;
        }
    }
    $('#tr'+evt_id).remove();
    for (var i=0; i<SIT_SCOPE.group_events[group_id].events.length; i++){
        if (SIT_SCOPE.group_events[group_id].events[i].id == evt_id){
            SIT_SCOPE.group_events[group_id].events.splice(i,1);
            $('#bdg_'+div_id).html(SIT_SCOPE.group_events[group_id].events.length);
            if (m == 0){
                $('#'+evt_id).removeClass(SIT_SCOPE.group_events[group_id].class_name).addClass(SIT_SCOPE.default_class);
                if (conf){
                    SIT_SCOPE.update_sit_grp(evt_id,null,null);
                }
                if (evt_id == group_id && SIT_SCOPE.group_events[group_id].events.length != 0){
                    for (var j=0; j<SIT_SCOPE.group_events[group_id].events.length; j++){
                        SIT_SCOPE.update_sit_grp(SIT_SCOPE.group_events[group_id].events[j].id,SIT_SCOPE.group_events[group_id].events[j].fk_situation,SIT_SCOPE.group_events[group_id].events[0].id);
                        SIT_SCOPE.group_events[group_id].events[j].fk_copy = SIT_SCOPE.group_events[group_id].events[0].id;
                        SIT_SCOPE.group_events[group_id].events[j].fk_situation = SIT_SCOPE.group_events[group_id].events[j].fk_situation;
                    }
                    var arr = SIT_SCOPE.group_events[group_id];
                    SIT_SCOPE.group_events[SIT_SCOPE.group_events[group_id].events[0].id] = arr;
                    arr.group_id = SIT_SCOPE.group_events[group_id].events[0].id;
                    arr.group_name = SIT_SCOPE.group_events[group_id].events[0].type;
                    $('#'+arr.div_id+'_name').html(arr.group_name);
                    $('#'+arr.div_id+'_alarm').html(SIT_SCOPE.check_group_alarm(arr.events));
                    delete SIT_SCOPE.group_events[group_id];
                    group_id = arr.group_id;
                }
            }
            $('#'+SIT_SCOPE.group_events[group_id].div_id+'_alarm').html(SIT_SCOPE.check_group_alarm(SIT_SCOPE.group_events[group_id].events));
            SIT_SCOPE.mouse_out(evt_id);
            if (SIT_SCOPE.group_events[group_id].events.length == 1){
                $('.glyphicon-minus-sign').css({
                    'visibility': 'hidden'
                });
            }
            if (SIT_SCOPE.group_events[group_id].events.length == 0){
                $('#pop_win').css({
                    'visibility': 'hidden'
                });
                $('#cont_'+div_id).remove();
                delete SIT_SCOPE.group_events[group_id];
                return;
            }
        }
    }
}
/*
 * CKharitonov
 */
SIT_SCOPE.union = function(sit_id,sit_count){
    var data = new Array();
    var group_id = null;
    var group_name = '';
    var group_order = null;
    if (SIT_SCOPE.events[SIT_SCOPE.selected_objects[0]]["fk_copy"] != null){
        if (SIT_SCOPE.events[SIT_SCOPE.selected_objects[0]]["fk_situation"] == sit_id){
            $('#selected_events_window').dialog('close');
            SIT_SCOPE.selected_objects = new Array();
            $('.group_bdg_active').removeClass('group_bdg_active').addClass('group_bdg');
            return;
        }
        else {
            $('#pop_win').css({
                'visibility': 'hidden'
            });
            $('#cont_'+SIT_SCOPE.group_events[SIT_SCOPE.events[SIT_SCOPE.selected_objects[0]]["fk_copy"]].div_id).remove();
        }
    }
    for (var i=0; i<SIT_SCOPE.selected_objects.length; i++){
        $('#'+SIT_SCOPE.selected_objects[i]).removeClass(SIT_SCOPE.selected_class).addClass('label-group'+sit_count);
        if (group_id == null && group_name == ''){
            group_id = SIT_SCOPE.events[SIT_SCOPE.selected_objects[i]]["id"];
            group_name = SIT_SCOPE.events[SIT_SCOPE.selected_objects[i]]["type"];
            group_order = SIT_SCOPE.events[SIT_SCOPE.selected_objects[i]]["event_order"];
        }
        SIT_SCOPE.events[SIT_SCOPE.selected_objects[i]].fk_situation = sit_id;
        data.push(SIT_SCOPE.events[SIT_SCOPE.selected_objects[i]]);
        SIT_SCOPE.update_sit_grp(SIT_SCOPE.events[SIT_SCOPE.selected_objects[i]]["id"],sit_id,group_id);
    }
    var grp = new group_event();
    grp.group_id = group_id;
    grp.group_name = group_name;
    grp.class_name = 'label-group'+sit_count;
    grp.group_order = group_order;
    grp.events = data;
    grp.div_id = CFUtil.guid();
    SIT_SCOPE.group_events[group_id] = grp;
    SIT_SCOPE.add_group_button(grp,sit_id);
    $('#selected_events_window').dialog('close');
    SIT_SCOPE.selected_objects = new Array();
    $('.group_bdg_active').removeClass('group_bdg_active').addClass('group_bdg');
}
/*
 * CKharitonov
 */
SIT_SCOPE.select_object = function(id){
    if (SIT_SCOPE.events[id]["fk_copy"] != null) return;
    if ($('#'+id).hasClass(SIT_SCOPE.default_class)){
        SIT_SCOPE.selected_objects.push(id);
        $('#'+id).removeClass(SIT_SCOPE.default_class).addClass(SIT_SCOPE.selected_class);
        if (SIT_SCOPE.selected_objects.length > 0){
            SIT_SCOPE.selected_events_view();
            $('.grp_bdg').removeClass('group_bdg').addClass('group_bdg_active');
        }
    }
    else if ($('#'+id).hasClass(SIT_SCOPE.selected_class)){
        SIT_SCOPE.remove_selected_object(id);
    }
}
/*
 * CKharitonov
 */
SIT_SCOPE.remove_selected_object = function(id){
    for (var i=0; i<SIT_SCOPE.selected_objects.length; i++){
        if (SIT_SCOPE.selected_objects[i] == id){
            SIT_SCOPE.selected_objects.splice(i,1);
        }
    }
    $('#'+id).removeClass(SIT_SCOPE.selected_class).addClass(SIT_SCOPE.default_class);
    if (SIT_SCOPE.selected_objects.length < 1){
        $('.group_bdg_active').removeClass('group_bdg_active').addClass('group_bdg');
        $('#selected_events_window').dialog('close');
    }
    $('#tr_'+id).remove();
}
/*
 *
 */
SIT_SCOPE.set_event_content = function(evt){
    if (!evt) return "";
    var html = '';
    var n = 0;
    for (var j=0; j<evt.length; j++){
        if (evt[j]["fk_situation"] != null){
            if (!(in_array(evt[j]["fk_situation"],SIT_SCOPE.sits_id_list))) continue;
        }
        if (n != 0 && n%5 == 0){
            html += '<br>';
        }
        n++;
        var title = evt[j].text.replace(/"/g,'&quot;');
        var content = evt[j].text;
        if (evt[j].text.length > SIT_SCOPE.evt_content_max_length){
            content = evt[j].text.substr(0,SIT_SCOPE.evt_content_max_length);
            content = content+'...';
        }
        html += '<span class="label '+SIT_SCOPE.default_class+'" draggable="true" style="cursor:default;"';
        html += ' id="'+evt[j]["id"]+'"';
        html += ' title="'+title+'"><span class="glyphicon glyphicon-info-sign" style="cursor:pointer;" onclick="SIT_SCOPE.open_event_window('+evt[j]["id"]+')"></span><span onclick="SIT_SCOPE.select_object('+evt[j]["id"]+')" onmousedown="SIT_SCOPE.event_onmousedown(\''+evt[j]["id"]+'\')">&nbsp;'+content+'</span></span>&nbsp;&nbsp;';
    }
    return html;
}
/*
 *
 */
SIT_SCOPE.set_message_content = function(msg){
    if (!msg) return '';
    if (msg.text == null) msg.text = '-';
    var content = msg.text;
    if (msg.text.length > SIT_SCOPE.msg_window_max_length){
        content = msg.text.substr(0,SIT_SCOPE.msg_window_max_length);
        content = content+'...';
    }
    var html = '<div style="max-width:'+SIT_SCOPE.msg_window_width+';max-height:'+SIT_SCOPE.msg_window_height+';">';
        html += '<table class="table" style="font-size:12px;margin-bottom:0;" width="'+SIT_SCOPE.msg_window_width+'">';
            html += '<tbody>';
                html += '<tr>';
                    html += '<td rowspan="2" width="10px">';
                        html += SIT_SCOPE.get_message_buttons(msg.id);
                    html += '</td>';
                    html += '<td><span class="'+SIT_SCOPE[msg.msg_type+"_icon"]+'" title="'+langs.get_term(msg.msg_type)+'"></span></td>';
                    html += '<td><b>'+check_not_null(msg.semantic_id)+'</b><br>'+content+'</td>';
                html += '</tr>';
                html += '<tr>';
                    html += '<td class="event_cont" colspan="2"><div style="max-height:52px;overflow-y:auto;">';
                        html += SIT_SCOPE.set_event_content(msg["events"]);
                    html += '</div></td>';
                html += '</tr>';
            html += '</tbody>';
        html += '</table>';
    html += '</div>';
    return html;
}
/*
 * CKharitonov
 */
SIT_SCOPE.load_data = function(){
    $('#visualization').empty();
    var items = [];
    if (SIT_SCOPE.messages.length != 0){
        for (var i=0; i<SIT_SCOPE.messages.length; i++){
            try {
                items.push({
                    id: SIT_SCOPE.messages[i]["id"],
                    start: CFUtil.get_local_datetime(SIT_SCOPE.messages[i]["date_time"]),
                    content: SIT_SCOPE.set_message_content(SIT_SCOPE.messages[i]),
                    className: 'item_'+SIT_SCOPE.messages[i]["msg_type"]
                });
            } catch(e){
                console.log(e);
            }
        }
    }
    SIT_SCOPE.items = new vis.DataSet(items);
    var start_date = new Date($('#d_from').val());
    var end_date = new Date($('#d_to').val());
    end_date.setDate(end_date.getDate()+1);
    var container = document.getElementById('visualization');
    var options = {
        height: $(window).height()/2,
        selectable: false,
        moveable: true,
        locale: 'ru',
        zoomMax: SIT_SCOPE.zoomMax,
        zoomMin: SIT_SCOPE.zoomMin,
        start: start_date,
        end: end_date
    };
    SIT_SCOPE.timeline = new vis.Timeline(container,SIT_SCOPE.items,options);
    SIT_SCOPE.timeline.on('rangechanged',function(){
        for (var i=0; i<SIT_SCOPE.situations.length; i++){
            for (var j=0; j<SIT_SCOPE.situations[i].events.length; j++){
                if ($('#'+SIT_SCOPE.situations[i].events[j].id).hasClass(SIT_SCOPE.default_class)){
                    $('#'+SIT_SCOPE.situations[i].events[j].id).removeClass(SIT_SCOPE.default_class).addClass('label-group'+i);
                }
            }
        }
    });
    SIT_SCOPE.run_auto_update();
}
/*
 * CKharitonov
 */
SIT_SCOPE.load_from_db = function(sit,i){
    $('#events_'+sit["id"]).html('');
    var tmp_group_events = new Array();
    for (var j=0; j<SIT_SCOPE.situations[i].events.length; j++){
        var fk_copy = SIT_SCOPE.situations[i].events[j]["fk_copy"];
        if (tmp_group_events[fk_copy] == undefined){
            tmp_group_events[fk_copy] = new Array();
        }
        tmp_group_events[fk_copy].push(SIT_SCOPE.situations[i].events[j]);
        if ($('#'+SIT_SCOPE.situations[i].events[j].id).hasClass(SIT_SCOPE.default_class)){
            $('#'+SIT_SCOPE.situations[i].events[j].id).removeClass(SIT_SCOPE.default_class).addClass('label-group'+i);
        }
    }
    for (val in tmp_group_events){
        var data = new Array();
        var group_id = null;
        var group_name = '';
        var group_order = null;
        for (var j=0; j<tmp_group_events[val].length; j++){
            if (tmp_group_events[val][j].id == tmp_group_events[val][j].fk_copy){
                group_id = tmp_group_events[val][j]["id"];
                group_name = tmp_group_events[val][j]["type"];
                group_order = tmp_group_events[val][j]["event_order"];
            }
            data.push(tmp_group_events[val][j]);
            $('#'+tmp_group_events[val][j]["id"]).removeClass(SIT_SCOPE.default_class).addClass('label-group'+i);
        }
        var grp = new group_event();
        grp.group_id = group_id;
        grp.group_name = group_name;
        grp.class_name = 'label-group'+i;
        grp.group_order = group_order;
        var order_group = group_order;
        grp.div_id = CFUtil.guid();
        sit_id = SIT_SCOPE.situations[i].events[0].fk_situation;
        grp.events = data;
        SIT_SCOPE.group_events[group_id] = grp;
        SIT_SCOPE.add_group_button(grp,sit_id);
    }
    if (order_group == null){
        SIT_SCOPE.set_event_order(SIT_SCOPE.situations[i].id);
    }
    else {
        SIT_SCOPE.sort_events(SIT_SCOPE.situations[i].id);
    }
}
/*
 * @param {type} sit_id
 * @returns {undefined}
 */
SIT_SCOPE.run_auto_update = function(){
    setInterval(
        function(){
            SIT_SCOPE.run_auto_ajax_update();
        },SIT_SCOPE.update_interval
    );
}
/*
 * CKharitonov
 */
SIT_SCOPE.run_auto_ajax_update = function(){
    var request = $.ajax({
        url: SIT_SCOPE.base_url+'index.php/conframe_bi/update_sit_scope_data/'+$('#d_from').val()+'/'+$('#d_to').val(),
        type: "POST"
    });
    request.done(function (response, textStatus, jqXHR){
        var data = JSON.parse(response);
        SIT_SCOPE.events = data['events'];
        for (var i=0; i<data.situations.length; i++){
            if (!(in_array(data.situations[i].id,SIT_SCOPE.sits_id_list))){
                SIT_SCOPE.sits_id_list.push(data.situations[i].id);
                SIT_SCOPE.situations.push(data.situations[i]);
                SIT_SCOPE.add_situation(data.situations[i],i);
            }
        }
        for (var i=0; i<data.messages.length; i++){
            if (!(in_array(data.messages[i].id,SIT_SCOPE.msgs_id_list))){
                SIT_SCOPE.msgs_id_list.push(data.messages[i].id);
                SIT_SCOPE.messages.push(data.messages[i]);
                SIT_SCOPE.add_message(data.messages[i]);
            }
        }
    });
}
/*
 * CKharitonov
 */
SIT_SCOPE.add_message = function(msg){
    try {
        SIT_SCOPE.items.add({
            id: msg.id,
            start: CFUtil.get_local_datetime(msg.date_time),
            content: SIT_SCOPE.set_message_content(msg),
            className: 'item_'+msg.msg_type
        });
    } catch(e){
        console.log(e);
    }
}
/*
 * CKharitonov
 */
SIT_SCOPE.add_situation = function(sit,i){
    var html = '';
    html += '<div class="panel panel-default sit_cont_" style="margin-bottom:0px;"';
    html += ' sit_id="'+sit["id"]+'"';
    html += ' sit_text="'+String(sit["text"]).toUpperCase()+' '+String(sit["name"]).toUpperCase()+'"';
    html += ' sit_is_curr="'+String(sit["is_current"]).toUpperCase()+'"';
    html += ' sit_is_auto="'+String(sit["is_auto_reg"]).toUpperCase()+'"';
    html += ' sit_is_fini="'+String(sit["is_finished"]).toUpperCase()+'"';
    html += '>';
        html += '<table class="table" style="font-size:12px;">';
            html += '<tr>';
                html += '<td class="grip" width="4px"></td>';
                html += '<td width="15%">';
                    html += '<div sit_btn="'+sit["id"]+'">';
                        html += SIT_SCOPE.get_option_buttons(sit,'return');
                    html += '</div>';
                html += '</td>';
                html += '<td>';
                    html += '<span id="events_'+sit["id"]+'"></span>';
                    html += '<span>';
                        html += '<span class="well well-sm" ';
                            html += 'style="height:38px;display:inline-block;border:1px dashed #000;cursor:pointer;margin-bottom:0px;margin-left:10px;" ';
                            html += 'onmouseup="on_group_mouseup('+sit["id"]+','+i+')" ';
                            html += 'onmouseover="on_group_over(this)" ';
                            html += 'onmouseout="on_group_out(this)">';
                            html += '<span class="badge group_bdg">+</span>';
                        html += '</span>';
                    html += '</span>';
                html += '</td>';
            html += '</tr>';
        html += '</table>';
    html += '</div>';
    $('#sit_cont').append(html);
    $('.pop').popover({html:true});
    var clss = '.label-group'+i+' { background-color: '+randomColor({luminosity:'dark'})+'; cursor: pointer; } ';
    $('#style').append(clss);
    SIT_SCOPE.load_from_db(sit,i);
}
/*
 * CKharitonov
 */
SIT_SCOPE.sort_events = function(sit_id){
    var html = '';
    for (var i=0; i<$('#events_'+sit_id+' span.group').length; i++){
        a = $('#events_'+sit_id+' span.group')[i];
        b = $('#events_'+sit_id+' span.group')[i+1];
        html = $('#events_'+sit_id+' span.group').sort(function(a,b){
            var contentA = parseInt($(a).attr('data-sort'));
            var contentB = parseInt($(b).attr('data-sort'));
            return (contentA < contentB) ? -1 : (contentA > contentB) ? 1 : 0;
        });
    }
    $('#events_'+sit_id).html(html);
    var ord = 1;
    $("div[sit='"+sit_id+"']").each(function(){
        $(this).attr("pos",ord);
        ord++;
    });
}
/*
 * CKharitonov
 */
SIT_SCOPE.mouse_over = function(id){
    SIT_SCOPE.blink = setInterval(function(){
        $('#'+id).toggleClass('blink');
    },300)
}
/*
 * CKharitonov
 */
SIT_SCOPE.mouse_out = function(id){
    $('#'+id).removeClass('blink')
    clearInterval(SIT_SCOPE.blink)
}
/*
 * TSRuban
 * Returns the additional buttons for each situation
 */
SIT_SCOPE.get_option_buttons = function(sit,mode){
    var btn_set = '<div style="cursor:default;">';
        if (sit["is_auto_reg"] === 't'){
            var type = 'АНС';
        }
        else {
            var type = 'РНС';
        }
        if (sit["is_current"] === 't'){
            type += ', ТНС';
        }
        if (sit["is_finished"] === 't'){
            type += ', ЗНС';
        }
        if (sit.events.length != 0){
            var bell = '';
            for (var j=0; j<sit.events.length; j++){
                if (sit.events[j].is_alarm == 't' && sit.events[j].is_acquainted_alarm != 't'){
                    bell = '<span class="glyphicon glyphicon-bell" style="color:red;font-size:15px;top:4px;cursor:pointer;" title="Квитировать" onclick="SIT_SCOPE.confirmation(\'sit\','+sit["id"]+')"></span>&nbsp;';
                    break;
                }
                if (sit.events[j].is_alarm == 't' && sit.events[j].is_acquainted_alarm == 't'){
                    bell = '<span class="glyphicon glyphicon-bell" style="color:rgb(234,187,0);font-size:15px;top:4px;"></span>&nbsp;';
                }
            }
            btn_set += bell;
        }
        if (sit["name"]){
            btn_set += '<b title="'+type+'">'+sit["name"]+'</b>';
        }
        else {
            btn_set += '<b title="'+type+'">'+sit["text"]+'</b>';
        }
    btn_set += '</div>';
    btn_set += '<div class="btn-group">';
        if (sit.events.length == 0){
            btn_set += '<button type="button" class="btn btn-default btn-xs" onclick="SIT_SCOPE.remove_situation(\''+sit["id"]+'\')" title="'+langs.get_term('txt_delete_situation')+'">&nbsp;<span class="glyphicon glyphicon-remove alert-danger" style="background-color:rgba(255,255,255,0);"></span>&nbsp;</button>';
        }
        if (sit["is_finished"] != 't'){
            btn_set += '<button type="button" class="btn btn-default btn-xs" onclick="SIT_SCOPE.edit_sit_name(\''+sit["id"]+'\')" title="'+langs.get_term('txt_edit_sit_name')+'">&nbsp;<span class="glyphicon glyphicon-edit"></span>&nbsp;</button>';
        }
        btn_set += '<button type="button" class="btn btn-default btn-xs" onclick="SIT_SCOPE.open_situation(\''+sit["id"]+'\')" title="'+langs.get_term('txt_open_sit_info')+'">&nbsp;<span class="glyphicon glyphicon-folder-open"></span>&nbsp;</button>';
        if (sit["is_finished"] != 't'){
            btn_set += '<button type="button" title="'+langs.get_term('txt_close_situation')+'" class="btn btn-default btn-xs" onclick="SIT_SCOPE.close_situation(\''+sit["id"]+'\')">&nbsp;<span class="glyphicon glyphicon-stop alert-danger" style="background-color:rgba(255,255,255,0);"></span>&nbsp;</button>';
        }
        if (sit["is_current"] != 't'){
            btn_set += '<i id="act_'+sit["id"]+'">';
                if (sit["act_idn"] == null){
                    btn_set += '<button type="button" title="Прикрепить акт?" class="btn btn-default btn-xs" onclick="SIT_SCOPE.open_acts_list(\''+moment(sit["registration_datetime"]).format("YYYY-MM-DD")+'\',\''+sit["id"]+'\')">&nbsp;<span class="glyphicon glyphicon-warning-sign" style="color:#FF0000;"></span>&nbsp;</button>';
                }
                else {
                    btn_set += '<button type="button" class="btn btn-default btn-xs pop" id="act_popover_'+sit["id"]+'" data-container="body" data-toggle="popover" data-placement="right" data-content="" onclick="SIT_SCOPE.add_act_popover_content(\''+sit["id"]+'\',\''+sit["act_idn"]+'\')">&nbsp;<span class="glyphicon glyphicon-warning-sign" style="color:#007c48;"></span>&nbsp;</button>';
                }
            btn_set += '</i>';
        }
    btn_set += '</div>&nbsp;&nbsp;&nbsp;';
    btn_set += '<button type="button" class="btn btn-default btn-xs pop" id="popover_'+sit["id"]+'" data-container="body" data-toggle="popover" data-placement="right" data-content="" onclick="SIT_SCOPE.add_popover_content(\''+sit["id"]+'\')">'+langs.get_term('txt_epures')+'</button>';
    if (mode == 'return'){
        return btn_set;
    }
    else if (mode == 'push'){
        $('div[sit_btn='+sit["id"]+']').html(btn_set);
        $('.pop').popover({html:true});
    }
}

SIT_SCOPE.open_acts_list = function(date,sit_id){
    var win_acts_list = window.open(SIT_SCOPE.base_url+'index.php/adaptor/get/act/'+date+'?sit_id='+sit_id,"Список актов","width="+$(document).width()+",height="+$(document).height()/1.5+",top=150,resizable=yes,scrollbars=yes,status=yes");
    win_acts_list.focus();
}

SIT_SCOPE.open_act = function(act_id){
    var win_act = window.open(SIT_SCOPE.act_view_url+act_id,"Акт","width="+$(document).width()/1.5+",height="+$(document).height()/1.5+",resizable=yes,scrollbars=yes,status=yes");
    win_act.focus();
}
/*
 * CKharitonov
 */
SIT_SCOPE.add_popover_content = function(sit_id){
    var html = '<table class="table table-hover" style="font-size:12;margin-bottom:0px;">';
        html += '<tbody>';
            html += '<tr onclick="SIT_SCOPE.open_logic1(\''+sit_id+'\')" style="cursor:pointer;"><td><span class="glyphicon glyphicon-random alert-success"></span>  ЭСШ-Логика 1</td></tr>';
            html += '<tr onclick="SIT_SCOPE.open_logic2(\''+sit_id+'\')" style="cursor:pointer;"><td><span class="glyphicon glyphicon-random alert-success"></span>  ЭСШ-Логика 2</td></tr>';
            html += '<tr onclick="SIT_SCOPE.open_event(\''+sit_id+'\')" style="cursor:pointer;"><td><span class="glyphicon glyphicon-saved alert-success"></span>  ЭСШ-События</td></tr>';
            html += '<tr onclick="SIT_SCOPE.open_time(\''+sit_id+'\')" style="cursor:pointer;"><td><span class="glyphicon glyphicon-time alert-success"></span>  '+langs.get_term('txt_dss_time_short')+'</td></tr>';
            html += '<tr onclick="SIT_SCOPE.open_radec(\''+sit_id+'\')" style="cursor:pointer;"><td><span class="glyphicon glyphicon-repeat alert-success"></span>  '+langs.get_term('txt_dss_cycle_short')+'</td></tr>';
        html += '</tbody>';
    html += '</table>';
    $('#popover_'+sit_id).attr('data-content',html);
}
/*
 * CKharitonov
 */
SIT_SCOPE.open_logic1 = function(sit_id){
    var logic_window1 = window.open(SIT_SCOPE.base_url+"index.php/conframe_bi/view_db/"+sit_id,"ЭСШ-Логика","width="+$(document).width()/1.5+",height="+$(document).height()/1.5+",resizable=yes,scrollbars=yes,status=yes");
    logic_window1.focus();
}
/*
 * CKharitonov
 */
SIT_SCOPE.open_logic2 = function(sit_id){
    var logic_window2 = window.open(SIT_SCOPE.base_url+"index.php/conframe_bi/view_db_v2/"+sit_id,"ЭСШ-Логика","width="+$(document).width()/1.5+",height="+$(document).height()/1.5+",resizable=yes,scrollbars=yes,status=yes");
    logic_window2.focus();
}
/*
 * CKharitonov
 */
SIT_SCOPE.open_event = function(sit_id){
    var event_window = window.open(SIT_SCOPE.base_url+"index.php/conframe_bi/etl_db_v2/"+sit_id,"ЭСШ-События","width="+$(document).width()/1.5+",height="+$(document).height()/1.5+",resizable=yes,scrollbars=yes,status=yes");
    event_window.focus();
}
/*
 * CKharitonov
 */
SIT_SCOPE.open_time = function(sit_id){
    var time_window = window.open(SIT_SCOPE.base_url+"index.php/conframe_bi/atl_v1/"+sit_id,langs.get_term('txt_dss_time_short'),"width="+$(document).width()/1.5+",height="+$(document).height()/1.5+",resizable=yes,scrollbars=yes,status=yes");
    time_window.focus();
}
/*
 * CKharitonov
 */
SIT_SCOPE.open_radec = function(sit_id){
    var radec_window = window.open(SIT_SCOPE.base_url+"index.php/conframe_bi/radec/"+sit_id,langs.get_term('txt_dss_cycle_short'),"width="+$(document).width()/1.5+",height="+$(document).height()/1.5+",resizable=yes,scrollbars=yes,status=yes");
    radec_window.focus();
}
/*
 * CKharitonov
 */
SIT_SCOPE.update_sit_grp = function(evt_id,sit_id,group_id){
    $.ajax({
        url: SIT_SCOPE.base_url+'index.php/conframe_bi/update_sit_grp/'+evt_id+'/'+sit_id+'/'+group_id,
        success: function(data){
            SIT_SCOPE.events[evt_id].fk_situation = sit_id;
            SIT_SCOPE.events[evt_id].fk_copy = group_id;
            $.ajax({
                url: SIT_SCOPE.base_url+'index.php/conframe_bi/update_sit_scope_data/'+$('#d_from').val()+'/'+$('#d_to').val(),
                success: function(data){
                    data = JSON.parse(data);
                    SIT_SCOPE.situations = data['situations'];
                    for (var i=0; i<SIT_SCOPE.situations.length; i++){
                        SIT_SCOPE.get_option_buttons(SIT_SCOPE.situations[i],'push');
                    }
                }
            });
            SIT_SCOPE.load_mouse_events();
        }
    });
}
/*
 * CKharitonov
 */
SIT_SCOPE.remove_situation = function(sit_id){
    if (confirm(langs.get_term('txt_delete_situation')+'?')){
        $.ajax({
            url: SIT_SCOPE.base_url+'index.php/conframe_bi/remove_situation/'+sit_id,
            success: function(data){
                for (var i=0; i<SIT_SCOPE.situations.length; i++){
                    if (SIT_SCOPE.situations[i].id == sit_id){
                        SIT_SCOPE.situations.splice(i,1);
                        $('div[sit_id='+sit_id+']').remove();
                    }
                }
            }
        });
    }
}
/*
 * CKharitonov
 */
SIT_SCOPE.get_message_buttons = function(msg_id){
    var btn_set = '';
    btn_set += '<span class="label label-default" style="cursor:pointer;" title="'+langs.get_term('txt_open_msg_info')+'" onclick="SIT_SCOPE.message_info_view(\''+msg_id+'\')"><span class="glyphicon glyphicon-folder-open"></span></span><br>';
    return btn_set;
}
/*
 * CKharitonov
 */
function move(percentage){
    var range = SIT_SCOPE.timeline.getWindow();
    var interval = range.end - range.start;
    SIT_SCOPE.timeline.setWindow({
        start: range.start.valueOf() - interval * percentage,
        end: range.end.valueOf() - interval * percentage
    });
}
/*
 * TSRuban
 * Loads the loder.gif before sending request to the server.
 */
SIT_SCOPE.get_loader = function(){
    return '<img src="'+SIT_SCOPE.base_url+'/img/ajax-loader.gif"></img>';
}
/*
 * CKharitonov
 */
SIT_SCOPE.update_data = function(btn){
    if (btn != ''){
        SIT_SCOPE.load_data();
        for (var i=0; i<SIT_SCOPE.situations.length; i++){
            SIT_SCOPE.load_from_db(SIT_SCOPE.situations[i],i);
        }
    }
    else {
        for (var i=0; i<SIT_SCOPE.situations.length; i++){
            SIT_SCOPE.load_from_db(SIT_SCOPE.situations[i],i);
        }
        SIT_SCOPE.run_auto_update();
    }
    SIT_SCOPE.load_mouse_events();
    SIT_SCOPE.load_mouse_events_for_drag();
    history.pushState({},"",SIT_SCOPE.base_url+'index.php/conframe_bi/sit_scope_v2/'+$('#d_from').val()+'/'+$('#d_to').val());
    $(btn).html(langs.get_term('txt_show')+' ');
}
/*
 * CKharitonov
 */
SIT_SCOPE.update_sit_scope_data = function(btn){
    $.ajax({
        url: SIT_SCOPE.base_url+'index.php/conframe_bi/update_sit_scope_data/'+$('#d_from').val()+'/'+$('#d_to').val(),
        beforeSend: function(xhr){
            $(btn).html(SIT_SCOPE.get_loader());
        },
        success: function(data){
            data = JSON.parse(data);
            SIT_SCOPE.situations = data['situations'];
            SIT_SCOPE.sits_id_list = data['sits_id_list'];
            SIT_SCOPE.messages = data['messages'];
            SIT_SCOPE.msgs_id_list = data['msgs_id_list'];
            SIT_SCOPE.events = data['events'];
            SIT_SCOPE.alarm_rules = data['alarm_rules'];
            SIT_SCOPE.situation_view();
            $('.pop').popover({html:true});
            SIT_SCOPE.update_data(btn);
            SIT_SCOPE.set_sit_filter();
            $('#selected_events_window').dialog('close');
            SIT_SCOPE.selected_objects = new Array();
            SIT_SCOPE.set_sit_bit_filter();
        }
    });
}
/*
 * CKharitonov
 */
SIT_SCOPE.open_situation = function(sit_id){
    var situation_window = window.open(SIT_SCOPE.base_url+'index.php/conframe_bi/situation/'+sit_id,'Ситуация',"width="+$(document).width()/1.5+",height="+$(document).height()/1.5+",resizable=yes,scrollbars=yes,status=yes");
    situation_window.focus();
}
/*
 * TSRuban
 */
SIT_SCOPE.print_situation = function(sit_id){
    $.ajax({
        url: SIT_SCOPE.base_url+'index.php/conframe_bi/get_situation/'+sit_id,
        success: function(data){
            opened_situation = JSON.parse(data);
            $.ajax({
                url: SIT_SCOPE.base_url+'index.php/conframe_bi/view_db/'+sit_id+'/PRINT',
                crossDomain:true,
                success: function(image){
                    var print_window = window.open('','Print','width=1200,height=500');
                    //print_window.document.write('<h2>Информация о ситуации: '+opened_situation["semantic_id"]+'</h2><hr>'+SIT_SCOPE.situation_info_view(opened_situation,"PRINT")+'<hr>'+image);
                    //print_window.print();
                }
            });
        }
    });
}
/*
 * CKharitonov
 */
SIT_SCOPE.message_info_view = function(msg_id){
    var dialog = CFUtil.dialog.create("msg_window",
    {
        title: langs.get_term('txt_msg_info'),
        autoOpen: false,
        height: 'auto',
        width: 800,
        modal: false,
        position: 'top'
    });
    if (dialog){
        var html = '<div style="max-height:450px;overflow:auto;">';
            for (var i=0; i<SIT_SCOPE.messages.length; i++){
                if (SIT_SCOPE.messages[i].id == msg_id){
                    html += '<table class="table table-condensed table-striped" style="font-size:12px;">';
                        html += '<tr>';
                            html += '<td width="20%"><b>'+langs.get_term('txt_from')+':</b></td>';
                            html += '<td>'+check_not_null(htmlentities(SIT_SCOPE.messages[i].msg_from))+'</td>';
                        html += '</tr>';
                        html += '<tr>';
                            html += '<td><b>'+langs.get_term('txt_atl_to')+':</b></td>';
                            html += '<td>'+check_not_null(htmlentities(SIT_SCOPE.messages[i].msg_to))+'</td>';
                        html += '</tr>';
                        html += '<tr>';
                            html += '<td><b>'+langs.get_term('txt_date')+':</b></td>';
                            html += '<td>'+moment(CFUtil.get_local_datetime(SIT_SCOPE.messages[i].date_time)).format("DD-MM-YYYY HH:mm:ss")+'</td>';
                        html += '</tr>';
                        html += '<tr>';
                            html += '<td><b>'+langs.get_term('txt_semantic_id')+':</b></td>';
                            html += '<td>'+check_not_null(SIT_SCOPE.messages[i].semantic_id)+'</td>';
                        html += '</tr>';
                        html += '<tr>';
                            html += '<td><b>'+langs.get_term('txt_message')+':</b></td>';
                            html += '<td>'+check_not_null(SIT_SCOPE.messages[i].text)+'</td>';
                        html += '</tr>';
                        html += '<tr>';
                            html += '<td><b>'+langs.get_term('txt_sit_events')+':</b></td>';
                            html += '<td>';
                                html += '<div class="btn-group" data-toggle="buttons">';
                                    if (SIT_SCOPE.messages[i].events){
                                        for (var j=0; j<SIT_SCOPE.messages[i].events.length; j++){
                                            var title = SIT_SCOPE.messages[i].events[j].text.replace(/"/g,'&quot;');
                                            var content = SIT_SCOPE.messages[i].events[j].text;
                                            if (SIT_SCOPE.messages[i].events[j].text.length > SIT_SCOPE.evt_content_max_length){
                                                content = SIT_SCOPE.messages[i].events[j].text.substr(0,SIT_SCOPE.evt_content_max_length);
                                                content = content+'...';
                                            }
                                            html += '<label class="btn btn-info btn-xs" style="margin-right:5px;margin-bottom:5px;" onclick="SIT_SCOPE.event_info_view('+SIT_SCOPE.messages[i].events[j].id+',\'event_info\');$(\'#event_info\').css(\'display\',\'block\');" title="'+title+'">';
                                                html += '<input type="radio" name="options" id="option'+j+'" autocomplete="off">'+content;
                                            html += '</label>';
                                        }
                                    }
                                    else {
                                        html += ' События отсутствуют.';
                                    }
                                html += '</div>';
                            html += '</td>';
                        html += '</tr>';
                    html += '</table>';
                }
            }
            html += '<div class="well well-sm" id="event_info" style="display:none;"></div>';
        html += '</div>';
        $(dialog).html(html);
    }
}
/*
 * CKharitonov
 */
SIT_SCOPE.open_event_window = function(evt_id){
    var dialog = CFUtil.dialog.create("evt_window",
    {
        title: langs.get_term('txt_evt_info'),
        autoOpen: false,
        height: 'auto',
        width: 800,
        modal: false,
        position: 'top'
    });
    if (dialog){
        var html = '<div id="evt_info" style="max-height:450px;overflow:auto;"></div>';
        $('#evt_window').html(html);
        SIT_SCOPE.event_info_view(evt_id,'evt_info');
    }
}
/*
 * CKharitonov
 */
SIT_SCOPE.event_info_view = function(evt_id,mode){
    $.ajax({
        url: SIT_SCOPE.base_url+'index.php/conframe_bi/get_event_info/'+evt_id,
        success: function(data){
            data = JSON.parse(data);
            var opened_event = data[0];
            var html = '<table class="table table-condensed table-hover" style="font-size:12px;margin-bottom:0px;">';
                html += '<tbody>';
                    html += '<tr>';
                        html += '<td width="50%"><b>'+langs.get_term('txt_semantic_id')+'</b></td>';
                        html += '<td>'+opened_event.text+'&nbsp;<span style="font-size:15px;" id="evt_info_'+evt_id+'">'+SIT_SCOPE.check_for_alarm(opened_event)+'</span></td>';
                    html += '</tr>';
                    html += put_attribute(langs.get_term('txt_event_type'),opened_event.event_type);
                    html += '<tr>';
                        html += '<td width="50%"><b>'+langs.get_term('txt_situation')+'</b></td>';
                        html += '<td>';
                            if (opened_event.situation_name != null && opened_event.situation_name != ''){
                                html += opened_event.situation_name+' <span class="glyphicon glyphicon-search" style="cursor:pointer" onclick="search_situation(\''+opened_event.situation_name+'\');" title="'+langs.get_term('txt_show_situation')+'"></span>';
                            }
                            else if (opened_event.situation_semantic_id != null){
                                html += opened_event.situation_semantic_id+' <span class="glyphicon glyphicon-search" style="cursor:pointer" onclick="search_situation(\''+opened_event.situation_semantic_id+'\');" title="'+langs.get_term('txt_show_situation')+'"></span>';
                            }
                            else {
                                html += ' - ';
                            }
                        html += '</td>';
                    html += '</tr>';
                    html += put_attribute(langs.get_term('txt_message'),opened_event.sms_name);
                    html += put_attribute(langs.get_term('txt_message'),opened_event.email_name);
                    html += put_attribute(langs.get_term('txt_information_incorrect_operating_pa'),opened_event["information_incorrect_operating_pa"]);
                    html += put_attribute(langs.get_term('txt_information_about_aircraft'),opened_event["information_about_aircraft"]);
                    html += put_attribute(langs.get_term('txt_state_of_sdtu'),opened_event["state_of_sdtu_fk_pr"]);
                    html += put_attribute(langs.get_term('txt_battery_info'),opened_event["battery_info"]);
                    html += put_attribute(langs.get_term('txt_state_own_needs'),opened_event["state_own_needs"]);
                    html += put_attribute(langs.get_term('txt_characteristics_disconnected_consumers'),opened_event["characteristics_disconnected_consumers"]);
                    html += put_attribute(langs.get_term('txt_cause_of_situation'),opened_event["cause_of_situation"]);
                    html += put_attribute(langs.get_term('txt_cutoff_power_mvt'),opened_event["cutoff_power_mvt"]);
                    html += put_attribute(langs.get_term('txt_wind'),opened_event.wind);
                    html += put_attribute(langs.get_term('txt_action_crew'),opened_event["information_crew_name"]);
                    html += put_attribute(langs.get_term('txt_fk_precipitation'),opened_event["precipitations_name"]);
                    html += put_attribute(langs.get_term('txt_temperature'),opened_event["temperature"]);
                    html += put_attribute(langs.get_term('txt_forecast_recovery_consumers'),opened_event["forecast_recovery_consumers"]);
                    html += put_attribute(langs.get_term('txt_fias_unpowered_count'),opened_event["fias_unpowered_count"]);
                    html += put_attribute(langs.get_term('txt_appearence_time'),moment(opened_event["appearence_time"]).format("DD-MM-YYYY HH:mm:ss"));
                    html += put_attribute(langs.get_term('txt_time_loss_consumers'),opened_event["time_loss_consumers"]);
                    html += put_attribute(langs.get_term('txt_numeric_feed_consumers'),opened_event["numeric_feed_consumers"]);
                    html += put_attribute(langs.get_term('txt_number_of_de_energized_consumers'),opened_event["number_of_de_energized_consumers"]);
                    html += put_attribute(langs.get_term('txt_number_of_remaining_de_energized_consumers'),opened_event["number_of_remaining_de_energized_consumers"]);
                    html += put_attribute(langs.get_term('txt_ropiz'),SIT_SCOPE.radec_list[opened_event["ropiz"]]);
                    html += put_attribute(langs.get_term('ttl_organizational_structure'),opened_event["org_struct_name"]);
                    html += put_attribute(langs.get_term('txt_datetime_create'),moment(opened_event["datetime_create"]).format("DD-MM-YYYY HH:mm:ss"));
                    html += put_attribute(langs.get_term('txt_info_emergency_operations_disconnect'),opened_event["info_emergency_operations_disconnect"]);
                    html += put_attribute(langs.get_term('txt_fusion_of_ice'),opened_event["fusion_of_ice"]);
                    html += put_array_of_attributes(langs.get_term('txt_action_n_equipment'),opened_event["action_n_equipment"]);
                    html += put_array_of_attributes(langs.get_term('txt_action_n_feeder'),opened_event["action_n_feeder"]);
                    html += put_array_of_attributes(langs.get_term('txt_action_n_vl'),opened_event["action_n_vl"]);
                    html += put_array_of_attributes(langs.get_term('txt_changing_modes'),opened_event["changing_modes"]);
                    html += put_array_of_attributes_with_type('count_of_de_energized_facilities',opened_event["count_of_de_energized_facilities"]);
                    html += put_array_of_attributes_with_type('count_ps_rp_tp',opened_event["count_ps_rp_tp"]);
                    html += put_array_of_attributes_with_type('equipment_people_teams',opened_event["equipment_people_teams"]);
                    html += put_array_of_attributes(langs.get_term('txt_fias'),opened_event["fias"]);
                    html += put_array_of_attributes(langs.get_term('txt_level_rza'),opened_event["level_rza"]);
                    html += put_array_of_attributes(langs.get_term('txt_object_ps'),opened_event["object_ps"]);
                    html += put_array_of_attributes(langs.get_term('txt_object_vl'),opened_event["object_vl"]);
                    html += put_array_of_attributes(langs.get_term('txt_orgstruct'),opened_event["orgstruct"]);
                    html += put_array_of_attributes(langs.get_term('txt_result_apv'),opened_event["result_apv"]);
                    html += put_array_of_attributes(langs.get_term('txt_result_rpv'),opened_event["result_rpv"]);
                html += '</tbody>';
            html += '</table>';
            $('#'+mode).html(html);
        }
    });
}
/*
 * CKharitonov
 */
function put_attribute(name,value){
    var html = '';
    if (value != null && value != 'Invalid date'){
        html += '<tr>';
            html += '<td width="50%"><b>'+name+'</b></td>';
            html += '<td>'+value+'</td>';
        html += '</tr>';
    }
    return html;
}
/*
 * CKharitonov
 */
function put_array_of_attributes_with_type(name,array){
    var html = '';
    if (array && array.length != 0){
        html += '<tr>';
            html += '<td width="50%"><b>'+langs.get_term('txt_'+name+'')+'</b></td>';
            html += '<td>';
                html += '<ul>';
                for (var i=0; i<array.length; i++){
                    html += '<li>'+SIT_SCOPE[name][array[i].type]+array[i].value+'</li>';
                }
                html += '</ul>';
            html += '</td>';
        html += '</tr>';
    }
    return html;
}
/*
 * CKharitonov
 */
function put_array_of_attributes(name,array){
    var html = '';
    if (array && array.length != 0){
        html += '<tr>';
            html += '<td width="50%"><b>'+name+'</b></td>';
            html += '<td>';
                html += '<ul>';
                for (var i=0; i<array.length; i++){
                    html += '<li>'+array[i].value+'</li>';
                }
                html += '</ul>';
            html += '</td>';
        html += '</tr>';
    }
    return html;
}

function search_situation(sit_name){
    $('#txt_filter').val(sit_name);
    SIT_SCOPE.set_sit_filter();
}
/*
 * CKharitonov
 */
function htmlentities(s){
    var div = document.createElement('div');
    var text = document.createTextNode(s);
    div.appendChild(text);
    return div.innerHTML;
}
/*
 * CKharitonov
 */
function check_not_null(value){
    if (value == null || value == '' || value == '  .. ()'){
        value = '-';
    }
    return value;
}

function check_filter_values(){
    var data = {
        'ans' : $('#ans').hasClass('btn-primary'),
        //'rns' : $('#rns').hasClass('btn-primary'),
        'tns' : $('#tns').hasClass('btn-primary'),
        'zns' : $('#zns').hasClass('btn-primary')
    };
    var check = false;
    for (key in data){
        if (data[key] == true){
            check = true;
        }
    }
    if (!check){
        data = {
        'ans' : false,
        //'rns' : false,
        'tns' : false,
        'zns' : false};
    }
    return data;
}
/*
 * CKharitonov
 */
SIT_SCOPE.edit_sit_name = function(sit_id){
    var dialog = CFUtil.dialog.create("save_window",
    {
        title: langs.get_term('txt_edit_sit_name'),
        autoOpen: false,
        height: "auto",
        width: 400,
        modal: false
    });
    if (dialog){
        html = $.ajax({
            url: SIT_SCOPE.base_url+"index.php/qcore/ajax/edit_form/conframe_bi/edit_situation/"+sit_id+"?CONTINUE=close",
            type: "POST"
        }).done(function (response,textStatus,jqXHRб){
            $(dialog).html(response);
        });
        $(dialog).bind('dialogclose', function(e){
            for (var i=0; i<SIT_SCOPE.situations.length; i++){
                if (SIT_SCOPE.situations[i].id == sit_id){
                    SIT_SCOPE.situations[i].name = $('#name').val();
                    SIT_SCOPE.get_option_buttons(SIT_SCOPE.situations[i],'push');
                }
            }
        });
    }
}
/*
 * TSRuban
 */
SIT_SCOPE.close_situation = function(sit_id){
    var dialog = CFUtil.dialog.create("save_window",
    {
        title: langs.get_term('txt_close_situation'),
        autoOpen: false,
        height: "auto",
        width: 400,
        modal: false,
        resizable: false
    });
    if (dialog){
        html = $.ajax({
            url: SIT_SCOPE.base_url+"index.php/qcore/ajax/edit_form/conframe_bi/end_situation/"+sit_id+"?CONTINUE=close",
            type: "POST"
        }).done(function (response, textStatus, jqXHRб){
            $(dialog).html(response);
        });
        $(dialog).bind('dialogclose', function(e){
            SIT_SCOPE.update_sit_scope_data('');
        });
    }
};
/*
 * TSRuban
 */
SIT_SCOPE.open_situation_list = function(){
    var dialog = CFUtil.dialog.create("close_sit_window",
    {
        title: langs.get_term('txt_situations_list'),
        autoOpen: false,
        height: $(window).height(),
        width: $(window).width()-500
    });
    if (dialog){
        html = $.ajax({
            url: SIT_SCOPE.base_url+"index.php/qcore/ajax/load_table/conframe_bi/situation",
            type: "POST"
        }).done(function (response, textStatus, jqXHRб){
            $(dialog).html('<div style="padding:10px;">'+response+'</div>');
        });
    }
};
/*
 * CKaritonov
 */
SIT_SCOPE.selected_events_view = function(){
    var dialog = CFUtil.dialog.create("selected_events_window",
    {
        title: langs.get_term('txt_selected_events'),
        autoOpen: false,
        height: "auto",
        width: 250,
        position: ['right','top']
    });
    if (dialog){
        var html = '<table class="table table-hover" style="font-size:12px;">';
        for (var i=0; i<SIT_SCOPE.selected_objects.length; i++){
            var msg_id = null;
            if (SIT_SCOPE.events[SIT_SCOPE.selected_objects[i]].fk_sms != null){
                msg_id = 'sms_'+SIT_SCOPE.events[SIT_SCOPE.selected_objects[i]].fk_sms;
            }
            else if (SIT_SCOPE.events[SIT_SCOPE.selected_objects[i]].fk_email != null){
                msg_id = 'email_'+SIT_SCOPE.events[SIT_SCOPE.selected_objects[i]].fk_email;
            }
            html += '<tr style="cursor:default;" id="tr_'+SIT_SCOPE.selected_objects[i]+'"><td width="95%" onclick="SIT_SCOPE.focus_on_message(\''+msg_id+'\');">'+SIT_SCOPE.events[SIT_SCOPE.selected_objects[i]].text+'</td><td><span class="glyphicon glyphicon-remove-sign alert-danger" title="'+langs.get_term("sm_btn_delete")+'" onclick="SIT_SCOPE.remove_selected_object(\''+SIT_SCOPE.selected_objects[i]+'\')"></span></td></tr>';
        }
        html += '</table>';
        $(dialog).html(html);
    }
};
/*
 * CKaritonov
 */
SIT_SCOPE.check_group_alarm = function(event){
    if (!event) return '';
    var html = '';
    for (var i=0; i<event.length; i++){
        if (event[i].is_alarm == 't' && event[i].is_acquainted_alarm != 't'){
            html = '<span class="glyphicon glyphicon-bell" style="color:red;font-size:15px;top:4px;margin-right:3px;"></span>';
            return html;
        }
        if (event[i].is_alarm == 't' && event[i].is_acquainted_alarm == 't'){
            html = '<span class="glyphicon glyphicon-bell" style="color:rgb(234,187,0);font-size:15px;top:4px;margin-right:3px;"></span>';
        }
    }
    return html;
}
/*
 * CKaritonov
 */
SIT_SCOPE.check_for_alarm = function(event){
    if (!event) return '';
    var html = '';
    if (event.is_alarm == 't'){
        html = '<span class="glyphicon glyphicon-bell" style="color:red;cursor:pointer;" title="Квитировать" onclick="SIT_SCOPE.confirmation(\'evt\','+event.id+')"></span>&nbsp;';
    }
    if (event.is_acquainted_alarm == 't'){
        html = '<span class="glyphicon glyphicon-bell" style="color:rgb(234,187,0);"></span>&nbsp;';
    }
    return html;
}
/*
 * CKharitonov
 */
SIT_SCOPE.confirmation = function(type,id){
    var dialog = CFUtil.dialog.create("confirm_window",
    {
        title: 'Квитирование',
        autoOpen: false,
        height: "auto",
        width: 400,
        modal: false
    });
    if (dialog){
        var html = '<div class="form-group input-group-sm" id="for_is_acquainted_alarm">';
            html += '<label for="is_acquainted_alarm">Вы ознакомлены с алармом?</label>';
            html += '<select class="form-control" id="is_acquainted_alarm">';
                html += '<option value="1">Да</option>';
                html += '<option value="0" selected="selected">Нет</option>';
            html += '</select>';
            html += '<br>';
            html += '<button type="button" class="btn btn-primary btn-sm" id="btn_save" onclick="SIT_SCOPE.update_alarm(\''+type+'\','+id+')">Сохранить</button>&nbsp;&nbsp;';
            html += '<button type="button" class="btn btn-default btn-sm" id="btn_cancel" onclick="$(\'#confirm_window\').dialog(\'close\')">Отмена</button>';
        html += '</div>';
        $(dialog).html(html);
    }
}
/*
 * CKharitonov
 */
SIT_SCOPE.update_alarm = function(type,id){
    if (type == 'sit' && $('#is_acquainted_alarm').val() == 1){
        $.ajax({
            url: SIT_SCOPE.base_url+'index.php/conframe_bi/update_sit_alarm/'+id,
            success: function(data){
                for (var i=0; i<SIT_SCOPE.situations.length; i++){
                    if (SIT_SCOPE.situations[i].id == id){
                        for (var j=0; j<SIT_SCOPE.situations[i].events.length; j++){
                            if (SIT_SCOPE.situations[i].events[j].is_alarm == 't'){
                                SIT_SCOPE.events[SIT_SCOPE.situations[i].events[j].id].is_acquainted_alarm = 't';
                                SIT_SCOPE.situations[i].events[j].is_acquainted_alarm = 't';
                                $('#'+SIT_SCOPE.group_events[SIT_SCOPE.situations[i].events[j].fk_copy].div_id+'_alarm').html('<span class="glyphicon glyphicon-bell" style="color:rgb(234,187,0);font-size:15px;top:4px;"></span>&nbsp;');
                                $('#evt_info_'+SIT_SCOPE.situations[i].events[j].id).html(SIT_SCOPE.check_for_alarm(SIT_SCOPE.situations[i].events[j]));
                            }
                        }
                        SIT_SCOPE.get_option_buttons(SIT_SCOPE.situations[i],'push');
                    }
                }
            }
        });
    }
    else if (type == 'evt' && $('#is_acquainted_alarm').val() == 1){
        $.ajax({
            url: SIT_SCOPE.base_url+'index.php/conframe_bi/update_evt_alarm/'+id,
            success: function(data){
                if (SIT_SCOPE.events[id].fk_situation == null){
                    SIT_SCOPE.events[id].is_acquainted_alarm = 't';
                    $('#evt_info_'+id).html(SIT_SCOPE.check_for_alarm(SIT_SCOPE.events[id]));
                }
                else {
                    for (var i=0; i<SIT_SCOPE.situations.length; i++){
                        if (SIT_SCOPE.situations[i].id == SIT_SCOPE.events[id].fk_situation){
                            for (var j=0; j<SIT_SCOPE.situations[i].events.length; j++){
                                if (SIT_SCOPE.situations[i].events[j].id == id){
                                    SIT_SCOPE.events[id].is_acquainted_alarm = 't';
                                    SIT_SCOPE.situations[i].events[j].is_acquainted_alarm = 't';
                                    $('#'+SIT_SCOPE.group_events[SIT_SCOPE.situations[i].events[j].fk_copy].div_id+'_alarm').html(SIT_SCOPE.check_group_alarm(SIT_SCOPE.group_events[SIT_SCOPE.situations[i].events[j].fk_copy].events));
                                    $('#evt_info_'+id).html(SIT_SCOPE.check_for_alarm(SIT_SCOPE.events[id]));
                                }
                            }
                            SIT_SCOPE.get_option_buttons(SIT_SCOPE.situations[i],'push');
                        }
                    }
                }
            }
        });
    }
    $('#confirm_window').dialog('close');
}
/*
 * CKharitonov
 */
function in_array(value,array){
    for (var i=0; i<array.length; i++){
        if (array[i] == value) return true;
    }
    return false;
}
/*
 * CKharitonov
 */
SIT_SCOPE.update_act_idn = function(sit_id,act_id,mode){
    if (mode == 'disconnect'){
        if (!confirm('Вы уверены, что хотите отсоединить акт от ситуации')){
            return;
        }
    }
    if (sit_id != null){
        $.ajax({
            url: SIT_SCOPE.base_url+'index.php/conframe_bi/update_act_idn/'+sit_id+'/'+act_id,
            success: function(data){
                for (var i=0; i<SIT_SCOPE.situations.length; i++){
                    if (SIT_SCOPE.situations[i].id == sit_id){
                        SIT_SCOPE.situations[i].act_idn = act_id;
                        var html = '';
                        if (act_id == null){
                            html += '<button type="button" title="Прикрепить акт?" class="btn btn-default btn-xs" onclick="SIT_SCOPE.open_acts_list(\''+moment(SIT_SCOPE.situations[i].registration_datetime).format("YYYY-MM-DD")+'\',\''+sit_id+'\')">&nbsp;<span class="glyphicon glyphicon-warning-sign" style="color:#FF0000;"></span>&nbsp;</button>';
                        }
                        else {
                            html += '<button type="button" class="btn btn-default btn-xs pop" id="act_popover_'+sit_id+'" data-container="body" data-toggle="popover" data-placement="right" data-content="" onclick="SIT_SCOPE.add_act_popover_content(\''+sit_id+'\',\''+act_id+'\')">&nbsp;<span class="glyphicon glyphicon-warning-sign" style="color:#007c48;"></span>&nbsp;</button>';
                        }
                        $('#act_'+sit_id).html(html);
                        if (act_id != null){
                            $('#act_popover_'+sit_id).popover({html:true});
                        }
                    }
                }
            }
        });
    }
    else {
        alert('Ошибка');
    }
}
/*
 * CKharitonov
 */
SIT_SCOPE.add_act_popover_content = function(sit_id,act_id){
    var html = '<table class="table table-hover" style="font-size:12;margin-bottom:0px;">';
        html += '<tbody>';
            html += '<tr onclick="SIT_SCOPE.open_act(\''+act_id+'\')" style="cursor:pointer;"><td><span class="glyphicon glyphicon-eye-open alert-success"></span>  Просмотр акта</td></tr>';
            html += '<tr onclick="SIT_SCOPE.update_act_idn(\''+sit_id+'\',null,\'disconnect\')" style="cursor:pointer;"><td><span class="glyphicon glyphicon-remove alert-danger"></span>  Отсоединить акт</td></tr>';
        html += '</tbody>';
    html += '</table>';
    $('#act_popover_'+sit_id).attr('data-content',html);
}
