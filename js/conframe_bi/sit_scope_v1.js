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
        yearSuffix: ''};
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
    'msg_window_width' : 400,
    'msg_window_height' : 150,
    'msg_window_max_length' : 120,
    'evt_content_max_length' : 7,
    'sms_icon' : 'glyphicon glyphicon-envelope',
    'email_icon' : 'glyphicon glyphicon-inbox',
    'zoomMax': 85000000,
    'zoomMin': 30000
};
/*
 * CKharitonov
 */
SIT_SCOPE.init = function(){
    html = '<div class="panel-body" id="visualization" style="padding-top:0px;"></div>';
    $('#content').html(html);
    html = '<div class="sit_cont" id="sit_cont" style="height:'+$(window).height()/3+';">';
    if (SIT_SCOPE.situations != null){
        html += SIT_SCOPE.situation_view();
    }
    else {
        html += 'Открытые ситуации отсутствуют.';
    }
    html += '</div>';
    $('#situation').html(html);
    SIT_SCOPE.load_events();
    SIT_SCOPE.load_data();
    SIT_SCOPE.load_mouse_events();
}
/*
 * CKharitonov
 */
SIT_SCOPE.situation_view = function(){
    var html = '';
    for (var i=0; i<SIT_SCOPE.situations.length; i++){
        html += '<div class="panel panel-default" style="margin-bottom:5px;">';
            html += '<table class="table" style="font-size:12px;">';
                html += '<td class="grip" width="4px"></td>';
                html += '<td width="20%">';
                    html += '<div><b>'+SIT_SCOPE.situations[i]["text"]+'</b></div>';
                    html += SIT_SCOPE.get_option_buttons(SIT_SCOPE.situations[i]["id"]);
                html += '</td>';
                html += '<td>';
                    html += '<div id="events_'+SIT_SCOPE.situations[i]["id"]+'" style="float:left;padding-top:8px;"></div>';
                    html += '<div style="float:left;padding-top:8px;">';
                        html += '<span class="well well-sm" ';
                            html += 'style="border:1px dashed #000;cursor:pointer;" ';
                            html += 'onmouseup="on_group_mouseup('+SIT_SCOPE.situations[i]["id"]+','+i+')" ';
                            html += 'onmouseover="on_group_over(this)" ';
                            html += 'onmouseout="on_group_out(this)" ';
                            html += '><span class="badge group_bdg">+</span>';
                        html += '</span>';
                    html += '</div>';
                html += '</td>';
            html += '</table>';
        html += '</div>';
    }
    return html;
}

SIT_SCOPE.load_mouse_events = function(){
    $('span.drag').mousedown(function(e){
        SIT_SCOPE.drag_event = SIT_SCOPE.events[this.id];
        SIT_SCOPE.timeline.setOptions({moveable: false});
        SIT_SCOPE.drag_start = true;
        $('#drag_cont').html(SIT_SCOPE.events[this.id]["text"]);
        if ($('#'+this.id).attr('group') != ''){
            for (var i=0; i<SIT_SCOPE.selected_objects.length; i++){
                //$('#'+SIT_SCOPE.selected_objects[i]).removeClass(SIT_SCOPE.selected_class).addClass(SIT_SCOPE.default_class);
            }
            $('.group_bdg_active').removeClass('group_bdg_active').addClass('group_bdg');
            SIT_SCOPE.selected_objects = new Array();
            for (var i=0; i<SIT_SCOPE.group_events[$('#'+this.id).attr('group')].events.length; i++){
                SIT_SCOPE.selected_objects.push(SIT_SCOPE.group_events[$('#'+this.id).attr('group')].events[i].id);
                $('#'+SIT_SCOPE.group_events[$('#'+this.id).attr('group')].events[i].id).removeClass(SIT_SCOPE.group_events[$('#'+this.id).attr('group')].class_name).addClass(SIT_SCOPE.selected_class);
            }
        }
    });
    $('span.drag_group').mousedown(function(e){
        for (var i in SIT_SCOPE.group_events){
            if (SIT_SCOPE.group_events[i].div_id != this.id){
                $('#'+SIT_SCOPE.group_events[i].div_id).popover('hide');
            }
            else {
                var group_id = SIT_SCOPE.group_events[i].group_id;
            }
        }
        SIT_SCOPE.drag_event = SIT_SCOPE.events[group_id];
        SIT_SCOPE.timeline.setOptions({moveable: false});
        SIT_SCOPE.drag_start = true;
        $('#drag_cont').html(SIT_SCOPE.events[group_id]["text"]);
        for (var i=0; i<SIT_SCOPE.selected_objects.length; i++){
            //$('#'+SIT_SCOPE.selected_objects[i]).removeClass(SIT_SCOPE.selected_class).addClass(SIT_SCOPE.default_class);
        }
        $('.group_bdg_active').removeClass('group_bdg_active').addClass('group_bdg');
        SIT_SCOPE.selected_objects = new Array();
        for (var i=0; i<SIT_SCOPE.group_events[$('#'+group_id).attr('group')].events.length; i++){
            SIT_SCOPE.selected_objects.push(SIT_SCOPE.group_events[$('#'+group_id).attr('group')].events[i].id);
            $('#'+SIT_SCOPE.group_events[$('#'+group_id).attr('group')].events[i].id).removeClass(SIT_SCOPE.group_events[$('#'+group_id).attr('group')].class_name).addClass(SIT_SCOPE.selected_class);
        }
    });
    $(document).mouseup(function(){
        if (SIT_SCOPE.drag_event != null && $('#'+SIT_SCOPE.drag_event.id).attr('group') != ''){
            var selected_events = $('.'+SIT_SCOPE.selected_class);
            for (var i=0; i<selected_events.length; i++){
                $('#'+selected_events[i].id).removeClass(SIT_SCOPE.selected_class).addClass(SIT_SCOPE.group_events[$('#'+selected_events[i].id).attr('group')].class_name);
                $('.group_bdg_active').removeClass('group_bdg_active').addClass('group_bdg');
            }
            SIT_SCOPE.selected_objects = new Array();
        }
        SIT_SCOPE.drag_event = null;
        SIT_SCOPE.drag_start = false;
        SIT_SCOPE.timeline.setOptions({moveable: true});
        $('#drag_cont').css({
            'visibility': 'hidden'
        });
    }).mousemove(function(e){
        if (SIT_SCOPE.drag_start){
            $('#drag_cont').css({
                'top': e.pageY+10,
                'left': e.pageX+5,
                'visibility': 'visible'
            });
            if ($('#'+SIT_SCOPE.drag_event.id).hasClass(SIT_SCOPE.default_class)){
                SIT_SCOPE.selected_objects.push(SIT_SCOPE.drag_event.id);
                if (SIT_SCOPE.selected_objects.length > 0){
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
                $('#drag_cont').html(SIT_SCOPE.selected_objects.length+' '+langs.get_term("txt_events"));
            }
        }
    });
    $('body').mouseup(function(e){
        var found_elem = false;
        $(e.target).parents().map(function(){
            if ($(this).attr('role') == 'tooltip'){
                found_elem = true;
                return;
            }
        });
        if (found_elem == false){
            for (var i in SIT_SCOPE.group_events){
                $('#'+SIT_SCOPE.group_events[i].div_id).popover('hide');
            }
        }
    });
    document.getElementById('move_left').onclick = function (){ move(0.2); };
    document.getElementById('move_right').onclick = function (){ move(-0.2); };
}

function on_group_mouseup(sit_id,sit_count){
    if (SIT_SCOPE.drag_event != null){
        if (SIT_SCOPE.selected_objects.length > 0){
            SIT_SCOPE.union(sit_id,sit_count);
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
    var html = '<span class="well well-sm drag_group" ';
        html += 'style="border:1px dashed #000;cursor:pointer;margin-right:10px;" data-toggle="popover" data-placement="bottom" data-content=""';
        html += 'id="'+grp.div_id+'" onclick="SIT_SCOPE.add_popover_content(\''+grp.div_id+'\')"><span id="'+grp.div_id+'_name">'+grp.group_name+'</span>&nbsp;&nbsp;';
        html += '<span class="badge '+grp.class_name+'" id="bdg_'+grp.div_id+'">'+grp.events.length+'</span>';
    html += '</span>';
    $('#events_'+sit_id).append(html);
    $('#'+grp.div_id).popover({html:true});
    $('#'+grp.div_id).mouseup(function(){
        if (SIT_SCOPE.drag_start == false) return;
        if (SIT_SCOPE.drag_event != null){
            for (var j=0; j<SIT_SCOPE.selected_objects.length; j++){
                $('#'+SIT_SCOPE.selected_objects[j]).removeClass(SIT_SCOPE.selected_class).addClass(SIT_SCOPE.group_events[grp.group_id].class_name);
                if ($('#'+SIT_SCOPE.selected_objects[j]).attr('group') != grp.group_id){
                    SIT_SCOPE.group_events[grp.group_id].events.push(SIT_SCOPE.events[SIT_SCOPE.selected_objects[j]]);
                    if ($('#'+SIT_SCOPE.events[SIT_SCOPE.selected_objects[j]]["id"]).attr('group') != ''){
                        SIT_SCOPE.remove_event(SIT_SCOPE.events[SIT_SCOPE.selected_objects[j]]["id"],SIT_SCOPE.group_events[$('#'+SIT_SCOPE.events[SIT_SCOPE.selected_objects[j]]["id"]).attr('group')].group_id,''+SIT_SCOPE.group_events[$('#'+SIT_SCOPE.events[SIT_SCOPE.selected_objects[j]]["id"]).attr('group')].div_id+'',1);
                        SIT_SCOPE.update_sit_grp(SIT_SCOPE.events[SIT_SCOPE.selected_objects[j]]["id"],sit_id,grp.group_id);
                    }
                    $('#'+SIT_SCOPE.events[SIT_SCOPE.selected_objects[j]]["id"]).attr('group',grp.group_id);
                    SIT_SCOPE.update_sit_grp(SIT_SCOPE.events[SIT_SCOPE.selected_objects[j]]["id"],sit_id,grp.group_id);
                }
            }
            $('.group_bdg_active').removeClass('group_bdg_active').addClass('group_bdg');
            $('#bdg_'+grp.div_id).html(SIT_SCOPE.group_events[grp.group_id].events.length);
            SIT_SCOPE.selected_objects = new Array();
            SIT_SCOPE.drag_event = null;
            SIT_SCOPE.drag_start = false;
            SIT_SCOPE.timeline.setOptions({moveable: true});
            $('#drag_cont').css({
                'visibility': 'hidden'
            });
        }
    }).mouseover(function(){
        $('#'+grp.div_id).css({
            'background': '#DCDCDC'
        })
    }).mouseout(function(){
        $('#'+grp.div_id).css({
            'background': '#F5F5F5'
        })
    });
}
/*
 * CKharitonov
 */
SIT_SCOPE.add_popover_content = function(div_id){
    for (var i in SIT_SCOPE.group_events){
        if (SIT_SCOPE.group_events[i].div_id != div_id){
            $('#'+SIT_SCOPE.group_events[i].div_id).popover('hide');
        }
        else {
            var group_id = SIT_SCOPE.group_events[i].group_id;
        }
    }
    if (SIT_SCOPE.group_events[group_id].events.length != 0){
        var html = '<div style="height:140px;overflow:auto;">';
            html += '<table class="table table-hover" style="font-size:12;">';
                html += '<tbody>';
                //html += '<tr><td width="95%"><input type="text" class="form-control input-sm" id="group_'+group_id+'_name" value="'+SIT_SCOPE.group_events[group_id].group_name+'"></td><td width="5%" style="vertical-align:middle;"><span class="glyphicon glyphicon-ok alert-success" style="cursor:pointer;" title="'+langs.get_term("sm_btn_save")+'" onclick="SIT_SCOPE.edit_group_name('+group_id+','+grp_count+')"></span></td></tr>';
                for (var i=0; i<SIT_SCOPE.group_events[group_id].events.length; i++){
                    var msg_id = null;
                    if (SIT_SCOPE.group_events[group_id].events[i].fk_sms != null){
                        msg_id = SIT_SCOPE.group_events[group_id].events[i].fk_sms;
                    }
                    else if (SIT_SCOPE.group_events[group_id].events[i].fk_email != null){
                        msg_id = SIT_SCOPE.group_events[group_id].events[i].fk_email;
                    }
                    html += '<tr id="tr'+SIT_SCOPE.group_events[group_id].events[i]["id"]+'" style="cursor:pointer;" onmouseout="SIT_SCOPE.mouse_out('+SIT_SCOPE.group_events[group_id].events[i]["id"]+')" onmouseover="SIT_SCOPE.mouse_over('+SIT_SCOPE.group_events[group_id].events[i]["id"]+')"><td width="95%" onclick="SIT_SCOPE.timeline.focus(\'msg'+msg_id+'\',{animate:1000});">'+SIT_SCOPE.group_events[group_id].events[i]["text"]+'</td><td width="5%"><span class="glyphicon glyphicon-remove alert-danger" title="'+langs.get_term("sm_btn_delete")+'" onclick="SIT_SCOPE.remove_event('+SIT_SCOPE.group_events[group_id].events[i]["id"]+','+group_id+',\''+SIT_SCOPE.group_events[group_id].div_id+'\',0);"></span></td></tr>';
                }
                html += '</tbody>';
            html += '</table>';
        html += '</div>';
        $('#'+SIT_SCOPE.group_events[group_id].div_id).attr('data-content',html);
    }
}
/*
 * CKharitonov
 */
SIT_SCOPE.remove_event = function(evt_id,group_id,div_id,m){
    for (var i in SIT_SCOPE.group_events){
        if (SIT_SCOPE.group_events[i].div_id != div_id){
            $('#'+SIT_SCOPE.group_events[i].div_id).popover('hide');
        }
        else {
            var group_id = SIT_SCOPE.group_events[i].group_id;
        }
    }
    $('#tr'+evt_id).remove();
    for (var i=0; i<SIT_SCOPE.group_events[group_id].events.length; i++){
        if (SIT_SCOPE.group_events[group_id].events[i].id == evt_id){
            SIT_SCOPE.group_events[group_id].events.splice(i,1);
            $('#'+evt_id).attr('group','');
            $('#bdg_'+div_id).html(SIT_SCOPE.group_events[group_id].events.length);
            if (m == 0){
                $('#'+evt_id).removeClass(SIT_SCOPE.group_events[group_id].class_name).addClass(SIT_SCOPE.default_class);
                SIT_SCOPE.update_sit_grp(evt_id,null,null);
                if (evt_id == group_id && SIT_SCOPE.group_events[group_id].events.length != 0){
                    for (var j=0; j<SIT_SCOPE.group_events[group_id].events.length; j++){
                        SIT_SCOPE.update_sit_grp(SIT_SCOPE.group_events[group_id].events[j].id,SIT_SCOPE.group_events[group_id].events[j].fk_situation,SIT_SCOPE.group_events[group_id].events[0].id);
                        SIT_SCOPE.group_events[group_id].events[j].fk_copy = SIT_SCOPE.group_events[group_id].events[0].id;
                        SIT_SCOPE.group_events[group_id].events[j].fk_situation = SIT_SCOPE.group_events[group_id].events[j].fk_situation;
                        $('#'+SIT_SCOPE.group_events[group_id].events[j].id).attr('group',SIT_SCOPE.group_events[group_id].events[0].id);
                    }
                    var arr = SIT_SCOPE.group_events[group_id];
                    SIT_SCOPE.group_events[SIT_SCOPE.group_events[group_id].events[0].id] = arr;
                    arr.group_id = SIT_SCOPE.group_events[group_id].events[0].id;
                    arr.group_name = SIT_SCOPE.group_events[group_id].events[0].text;
                    $('#'+arr.div_id+'_name').html(arr.group_name);
                    delete SIT_SCOPE.group_events[group_id];
                    group_id = arr.group_id;
                }
            }
            SIT_SCOPE.mouse_out(evt_id);
            if (SIT_SCOPE.group_events[group_id].events.length == 0){
                $('#'+div_id).attr('data-content','');
                $('#'+div_id).popover('hide');
                $('#'+div_id).remove();
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
    if ($('#'+SIT_SCOPE.selected_objects[0]).attr('group') != ''){
        $('#'+SIT_SCOPE.group_events[$('#'+SIT_SCOPE.selected_objects[0]).attr('group')].div_id).attr('data-content','');
        $('#'+SIT_SCOPE.group_events[$('#'+SIT_SCOPE.selected_objects[0]).attr('group')].div_id).popover('hide');
        $('#'+SIT_SCOPE.group_events[$('#'+SIT_SCOPE.selected_objects[0]).attr('group')].div_id).remove();
    }
    for (var i=0; i<SIT_SCOPE.selected_objects.length; i++){
        //$('#grp_'+SIT_SCOPE.selected_objects[i]).removeClass(SIT_SCOPE.selected_class).addClass('label-group'+sit_count);
        if (group_id == null && group_name == ''){
            group_id = SIT_SCOPE.events[SIT_SCOPE.selected_objects[i]]["id"];
            group_name = SIT_SCOPE.events[SIT_SCOPE.selected_objects[i]]["text"];
        }
        SIT_SCOPE.events[SIT_SCOPE.selected_objects[i]].fk_situation = sit_id;
        data.push(SIT_SCOPE.events[SIT_SCOPE.selected_objects[i]]);
        $('#'+SIT_SCOPE.events[SIT_SCOPE.selected_objects[i]]["id"]).attr('group',group_id);
        SIT_SCOPE.update_sit_grp(SIT_SCOPE.events[SIT_SCOPE.selected_objects[i]]["id"],sit_id,group_id);
    }
    var grp = new group_event();
    grp.group_id = group_id;
    grp.group_name = group_name;
    grp.class_name = 'label-group'+sit_count;
    grp.events = data;
    grp.div_id = CFUtil.guid();
    SIT_SCOPE.group_events[group_id] = grp;
    SIT_SCOPE.add_group_button(grp,sit_id);
    $('.group_bdg_active').removeClass('group_bdg_active').addClass('group_bdg');
    $('#union_window').dialog('close');
    SIT_SCOPE.selected_objects = new Array();
}
/*
 * CKharitonov
 */
SIT_SCOPE.select_object = function(id){
    if ($('#'+id).attr('group') != '') return;
    if ($('#'+id).hasClass(SIT_SCOPE.default_class)){
        SIT_SCOPE.selected_objects.push(id);
        $('#'+id).removeClass(SIT_SCOPE.default_class).addClass(SIT_SCOPE.selected_class);
        if (SIT_SCOPE.selected_objects.length > 0){
            $('.grp_bdg').removeClass('group_bdg').addClass('group_bdg_active');
        }
    }
    else if ($('#'+id).hasClass(SIT_SCOPE.selected_class)){
        for (var i=0; i<SIT_SCOPE.selected_objects.length; i++){
            if (SIT_SCOPE.selected_objects[i] == id){
                SIT_SCOPE.selected_objects.splice(i,1);
            }
        }
        $('#'+id).removeClass(SIT_SCOPE.selected_class).addClass(SIT_SCOPE.default_class);
        if (SIT_SCOPE.selected_objects.length < 1){
            $('.group_bdg_active').removeClass('group_bdg_active').addClass('group_bdg');
        }
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
    if (SIT_SCOPE.selected_objects.length == 0){
        $('.group_bdg_active').removeClass('group_bdg_active').addClass('group_bdg');
        $('#union_window').dialog('close');
    }
    $('#tr'+id).remove();
}
/*
 *
 */
SIT_SCOPE.set_event_content = function(evt){
    if (!evt) return "";
    var html = '';
    for (var j=0; j<evt.length; j++){
        if (j%5 == 0){
            html += '<br>';
        }
        var title = evt[j].text.replace(/"/g,'&quot;');
        var content = evt[j].text;
        if (evt[j].text.length > SIT_SCOPE.evt_content_max_length){
            content = evt[j].text.substr(0,SIT_SCOPE.evt_content_max_length);
            content = content+'...';
        }
        html += '<span class="label '+SIT_SCOPE.default_class+' drag" group="" draggable="true" style="cursor:pointer;" onclick="SIT_SCOPE.select_object('+evt[j]["id"]+')" id="'+evt[j]["id"]+'" title="'+title+'">'+content+'</span>&nbsp;&nbsp;';
    }
    return html;
}
/*
 *
 */
SIT_SCOPE.set_message_content = function(msg){
    if (!msg) return "";
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
                    html += '<td><span class="'+SIT_SCOPE[msg.msg_type+"_icon"]+'" title="'+msg.msg_type+'"></span></td>';
                    html += '<td>'+content+'</td>';
                html += '</tr>';
                html += '<tr>';
                    html += '<td class="event_cont" colspan="2">';
                        html += SIT_SCOPE.set_event_content(msg["events"]);
                    html += '</td>';
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
    SIT_SCOPE.items = new vis.DataSet();
    if (SIT_SCOPE.messages.length != 0){
        for (var i=0; i<SIT_SCOPE.messages.length; i++){
            SIT_SCOPE.items.add({
                id: 'msg'+SIT_SCOPE.messages[i]["id"],
                start: SIT_SCOPE.messages[i]["date_time"],
                content: SIT_SCOPE.set_message_content(SIT_SCOPE.messages[i]),
                className: 'item_'+SIT_SCOPE.messages[i]["msg_type"]
            });
        }
    }
    var container = document.getElementById('visualization');
    var options = {
        height: $(window).height()/2,
        selectable: false,
        moveable: true,
        locale: 'ru',
        zoomMax: SIT_SCOPE.zoomMax,
        zoomMin: SIT_SCOPE.zoomMin
    };
    SIT_SCOPE.timeline = new vis.Timeline(container,SIT_SCOPE.items,options);
    SIT_SCOPE.load_from_db();
}
/*
 * CKharitonov
 */
SIT_SCOPE.load_from_db = function(){
    for (var i=0; i<SIT_SCOPE.situations.length; i++){
        $('#events_'+SIT_SCOPE.situations[i]["id"]).empty();
        var tmp_group_events = new Array();
        for (var j=0; j<SIT_SCOPE.situations[i].events.length; j++){
            var fk_copy = SIT_SCOPE.situations[i].events[j]["fk_copy"];
            if (tmp_group_events[fk_copy] == undefined){
                tmp_group_events[fk_copy] = new Array();
            }
            tmp_group_events[fk_copy].push(SIT_SCOPE.situations[i].events[j]);
        }
        for (val in tmp_group_events){
            var data = new Array();
            var group_id = null;
            var group_name = '';
            for (var j=0; j<tmp_group_events[val].length; j++){
                if (tmp_group_events[val][j].id == tmp_group_events[val][j].fk_copy){
                    group_id = tmp_group_events[val][j]["id"];
                    group_name = tmp_group_events[val][j]["text"];
                }
                data.push(tmp_group_events[val][j]);
                $('#'+tmp_group_events[val][j]["id"]).attr('group',val);
                $('#'+tmp_group_events[val][j]["id"]).removeClass(SIT_SCOPE.default_class).addClass('label-group'+i);
            }
            var grp = new group_event();
            grp.group_id = group_id;
            grp.group_name = group_name;
            grp.class_name = 'label-group'+i;
            grp.div_id = CFUtil.guid();
            sit_id = SIT_SCOPE.situations[i].events[0].fk_situation;
            grp.events = data;
            SIT_SCOPE.group_events[group_id] = grp;
            SIT_SCOPE.add_group_button(grp,sit_id);
        }
    }
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
 * CKharitonov

SIT_SCOPE.edit_group_name = function(group_id){
    SIT_SCOPE.group_events[group_id].group_name = $('#group_'+group_id+'_name').val().replace(/ <.*?script.*?>.*?<\/.*?script.*?>/igm,"");
    $('#grp_'+group_id+'_name').html(SIT_SCOPE.group_events[group_id].group_name);
}*/
/*
 * TSRuban
 * Returns the additional buttons for each situation
 */
SIT_SCOPE.get_option_buttons = function(sit_id){
    var btn_set = '';
    btn_set += '<div class="btn-group">';
        btn_set += '<button type="button" class="btn btn-default btn-xs" onclick=SIT_SCOPE.remove_events_from_sit("'+sit_id+'") title="Очистить ситуацию от событий"><span class="glyphicon glyphicon-remove alert-danger" style="background-color:rgba(255,255,255,0);"></span></button>';
        btn_set += '<button type="button" class="btn btn-default btn-xs" onclick=SIT_SCOPE.print_sitiuation("'+sit_id+'") title="Распечатать информацию о ситуации"><span class="glyphicon glyphicon-print"></span></button>';
        btn_set += '<button type="button" class="btn btn-default btn-xs" onclick=SIT_SCOPE.open_sitiuation("'+sit_id+'") title="Открыть информацию о ситуации"><span class="glyphicon glyphicon-folder-open"></span></button>';
    btn_set += '</div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
    btn_set += '<div class="btn-group">';
        btn_set += '<button type="button" title="ЭСШ-Логика" class="btn btn-default btn-xs" onclick=SIT_SCOPE.open_logic("'+sit_id+'")><span class="glyphicon  glyphicon-user alert-success"  style="background-color:rgba(255,255,255,0);"></span></button>';
        btn_set += '<button type="button" title="ЭСШ-События" class="btn btn-default btn-xs" onclick=SIT_SCOPE.open_event("'+sit_id+'")><span class="glyphicon glyphicon-saved alert-success"  style="background-color:rgba(255,255,255,0);"></span></button>';
        btn_set += '<button type="button" title="ЭСШ-Время" class="btn btn-default btn-xs" onclick=SIT_SCOPE.open_time("'+sit_id+'")><span class="glyphicon glyphicon-time  alert-success"  style="background-color:rgba(255,255,255,0);"></span></button>';
        btn_set += '<button type="button" title="ЭСШ-Цикл" class="btn btn-default btn-xs" onclick=SIT_SCOPE.open_radec("'+sit_id+'")><span class="glyphicon glyphicon-repeat  alert-success"  style="background-color:rgba(255,255,255,0);"></span></button>';
    btn_set += '</div>';
    return btn_set;
}
/*
 * CKharitonov
 */
SIT_SCOPE.open_logic = function(sit_id){
    var logic_window = window.open(SIT_SCOPE.base_url+"index.php/conframe_bi/view_db/"+sit_id,"ЭСШ-Логика","width="+$(document).width()-500+",height="+$(document).height()-200+",resizable=yes,scrollbars=yes,status=yes");
    logic_window.focus();
}
/*
 * CKharitonov
 */
SIT_SCOPE.open_event = function(sit_id){
    var event_window = window.open(SIT_SCOPE.base_url+"index.php/conframe_bi/etl_db/"+sit_id,"ЭСШ-События","width="+$(document).width()-600+",height="+$(document).height()-500+",resizable=yes,scrollbars=yes,status=yes");
    event_window.focus();
}
/*
 * CKharitonov
 */
SIT_SCOPE.open_time = function(sit_id){
    var time_window = window.open(SIT_SCOPE.base_url+"index.php/conframe_bi/atl_v1/"+sit_id,"ЭСШ-Время","width="+$(document).width()-600+",height="+$(document).height()-500+",resizable=yes,scrollbars=yes,status=yes");
    time_window.focus();
}
/*
 * CKharitonov
 */
SIT_SCOPE.update_sit_grp = function(evt_id,sit_id,group_id){
    $.ajax({
        url: SIT_SCOPE.base_url+'index.php/conframe_bi/update_sit_grp/'+evt_id+'/'+sit_id+'/'+group_id,
        success: function(data){
            //console.log(data);
            SIT_SCOPE.events[evt_id].fk_situation = sit_id;
            SIT_SCOPE.events[evt_id].fk_copy = group_id;
            $.ajax({
                url: SIT_SCOPE.base_url+'index.php/conframe_bi/load_sits',
                success: function(data){
                    SIT_SCOPE.situations = JSON.parse(data);
                }
            });
            SIT_SCOPE.load_mouse_events();
        }
    });
}
/*
 * CKharitonov
 */
SIT_SCOPE.remove_events_from_sit = function(sit_id){
    if (confirm("Удалить все события, относящиеся к данной ситуации?")){
        for (var i in SIT_SCOPE.group_events){
            for (var j=0; j<SIT_SCOPE.group_events[i].events.length; j++){
                if (SIT_SCOPE.group_events[i].events[j].fk_situation == sit_id){
                    SIT_SCOPE.remove_event(SIT_SCOPE.group_events[i].events[j].id,SIT_SCOPE.group_events[i].group_id,''+SIT_SCOPE.group_events[i].div_id+'',0);
                }
            }
        }
    }
}
/*
 * CKharitonov
 */
SIT_SCOPE.get_message_buttons = function(msg_id){
    var btn_set = '';
    btn_set += '<span class="label label-default" style="cursor:pointer;" title="Открыть информацию о сообщении" onclick="SIT_SCOPE.message_info_view('+msg_id+')"><span class="glyphicon glyphicon-folder-open"></span></span><br>';
    btn_set += '<span class="label label-default"><span class="glyphicon glyphicon-pencil"></span></span><br>';
    btn_set += '<span class="label label-default"><span class="glyphicon glyphicon-remove"></span></span><br>';
    return btn_set;
}

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
    $.ajax({
        url: SIT_SCOPE.base_url+'index.php/conframe_bi/load_msgs/'+$('#d_from').val()+'/'+$('#d_to').val()+'/'+$('#mode').val()+'/'+$('#msg_type').val(),
        beforeSend: function(xhr){
            $(btn).html(SIT_SCOPE.get_loader());
        },
        success: function(data){
            SIT_SCOPE.messages = JSON.parse(data);
            SIT_SCOPE.load_events();
            SIT_SCOPE.load_data();
            SIT_SCOPE.load_mouse_events();
            history.pushState({},"",SIT_SCOPE.base_url+'index.php/conframe_bi/sit_scope_v1/'+$('#d_from').val()+'/'+$('#d_to').val()+'/'+$('#mode').val()+'/'+$('#msg_type').val());
            $(btn).html("Показать ");
        }
    });
}
/*
 * CKharitonov
 */
SIT_SCOPE.update_sit_data = function(btn){
    $.ajax({
        url: SIT_SCOPE.base_url+'index.php/conframe_bi/load_sits',
        beforeSend: function(xhr){
            $(btn).html(SIT_SCOPE.get_loader());
        },
        success: function(data){
            SIT_SCOPE.situations = JSON.parse(data);
            $('#sit_cont').html(SIT_SCOPE.situation_view());
            SIT_SCOPE.update_data(btn);
        }
    });
}
/*
 * CKharitonov
 */
SIT_SCOPE.load_events = function(){
    if (SIT_SCOPE.messages.length != 0){
        for (var i=0; i<SIT_SCOPE.messages.length; i++){
            if (SIT_SCOPE.messages[i]["events"] != null){
                for (var j=0; j<SIT_SCOPE.messages[i]["events"].length; j++){
                    SIT_SCOPE.events[SIT_SCOPE.messages[i]["events"][j]["id"]] = SIT_SCOPE.messages[i]["events"][j];
                }
            }
        }
    }
}
/*
 * CKharitonov
 */
SIT_SCOPE.open_sitiuation = function(sit_id){
    var dialog = CFUtil.dialog.create("sit_window_"+sit_id,
    {
        title: '',
        autoOpen: false,
        height: 500,
        width: 800,
        modal: false,
        position: 'top'
    });
    if (dialog){
    	$.ajax({
	    url: SIT_SCOPE.base_url+'index.php/conframe_bi/get_situation/'+sit_id,
	    success: function(data){
	        opened_situation = JSON.parse(data);
	        $(dialog).dialog('option','title','Информация о ситуации: '+opened_situation["semantic_id"]);
                //$(dialog).dialog('option','maxHeight',500);
                $(dialog).html(SIT_SCOPE.situation_info_view(opened_situation));
	    }
	});
    }
}
/*
 * CKharitonov
 */
SIT_SCOPE.situation_info_view = function(opened_situation,mode){
    var html = '<div style="overflow:auto;">';
        html = '<table class="table table-condensed" style="font-size:12px; font-family:Arial;" ';
            if (mode =="PRINT"){
                html += ' border=1 cellspacing=0';
            }
            html += '>';
            html += '<tbody>';
                html += '<tr>';
                    html += '<td><b>Статус:</b></td>';
                    html += '<td style="padding-bottom:0px;padding-top:0px;">';
                        if (opened_situation["is_current"]){
                            html += '<h5><span class="label label-success">Открыта</span></h5>';
                        }
                        else {
                            html += '<h5><span class="label label-danger">Закрыта</span></h5>';
                        }
                    html += '</td>';
                html += '</tr>';
                html += '<tr>';
                    html += '<td colspan="2"><b>События:</b>';
                        if (opened_situation.events != null){
                            html += '<table class="table table-condensed" style="font-size:12px;margin-top:8px;">';
                            for (var i in opened_situation.events){
                                html += '<tr class="active">';
                                    html += '<td nowrap><span class="badge">'+(parseInt(i)+1)+' <span class="'+SIT_SCOPE[opened_situation.events[i].message.msg_type+"_icon"]+'" title="'+opened_situation.events[i].message.msg_type+'"></span></span> <b>'+opened_situation.events[i].semantic_id+'</b></td>';
                                    html += '<td colspan="2">'+opened_situation.events[i].event_type.name+'</td>';
                                html += '</tr>';
                                html += '<tr>';
                                    html += '<td></td>';
                                    html += '<td nowrap><b>Результат РПВ:</b></td>';
                                    html += '<td colspan="2">'+check_not_null(opened_situation.events[i].rpv_result)+'</td>';
                                html += '</tr>';
                                html += '<tr>';
                                    html += '<td></td>';
                                    html += '<td nowrap><b>Результат АПВ:</b></td>';
                                    html += '<td colspan="2">'+check_not_null(opened_situation.events[i].apv_result)+'</td>';
                                html += '</tr>';
                                html += '<tr>';
                                    html += '<td></td>';
                                    html += '<td nowrap><b>Температура:</b></td>';
                                    html += '<td colspan="2">'+check_not_null(opened_situation.events[i].temperature)+'</td>';
                                html += '</tr>';
                                html += '<tr>';
                                    html += '<td colspan="3">';
                                        html += '<table class="table table-condensed table-bordered" style="font-size:12px;margin-top:8px;">';
                                            html += '<tr>';
                                                html += '<td nowrap><b>От:</b> '+htmlentities(opened_situation.events[i].message.address_source_from)+'</td>';
                                                html += '<td nowrap><b>Кому:</b> '+htmlentities(opened_situation.events[i].message.address_source_to)+'</td>';
                                                html += '<td nowrap><b>Дата:</b> '+opened_situation.events[i].message.date+'</td>';
                                            html += '</tr>';
                                            html += '<tr>';
                                                html += '<td><b>Сообщение:</b></td>';
                                                html += '<td colspan="2">'+opened_situation.events[i].message.text+'</td>';
                                            html += '</tr>';
                                        html += '</table>';
                                    html += '</td>';
                                html += '</tr>';
                            }
                            html += '</table>';
                        }
                        else {
                            html += ' События в данной ситуации отсутствуют.';
                        }
                    html += '</td>';
                html += '</tr>';
            html += '</tbody>';
        html += '</table>';
    html += '</div>';
    return html;
}

SIT_SCOPE.print_sitiuation = function(sit_id){
    $.ajax({
        url: SIT_SCOPE.base_url+'index.php/conframe_bi/get_situation/'+sit_id,
        success: function(data){
            opened_situation = JSON.parse(data);
            $.ajax({
            url: SIT_SCOPE.base_url+'index.php/conframe_bi/view_db/'+sit_id+'/PRINT',
            crossDomain:true,
            success: function(image){
                var print_window = window.open('','Print','width=1200,height=500');
                print_window.document.write('<h2>Информация о ситуации: '+opened_situation["semantic_id"]+'</h2><hr>'+SIT_SCOPE.situation_info_view(opened_situation,"PRINT")+'<hr>'+image);
                //print_window.print();
            }
            })

        }
    });
}
/*
 * CKharitonov
 */
SIT_SCOPE.message_info_view = function(msg_id){
    var dialog = CFUtil.dialog.create("msg_window",
    {
        title: 'Информация о сообщении',
        autoOpen: false,
        height: 350,
        width: 600,
        modal: false,
        position: 'top'
    });
    if (dialog){
        var html = '<div style="overflow:auto;">';
            for (var i=0; i<SIT_SCOPE.messages.length; i++){
                if (SIT_SCOPE.messages[i].id == msg_id){
                    html += '<table class="table table-condensed table-striped" style="font-size:12px;">';
                        html += '<tr>';
                            html += '<td><b>От:</b></td>';
                            html += '<td>'+htmlentities(SIT_SCOPE.messages[i].msg_from)+'</td>';
                        html += '</tr>';
                        html += '<tr>';
                            html += '<td><b>Кому:</b></td>';
                            html += '<td>'+htmlentities(SIT_SCOPE.messages[i].msg_to)+'</td>';
                        html += '</tr>';
                        html += '<tr>';
                            html += '<td><b>Дата:</b></td>';
                            html += '<td>'+SIT_SCOPE.messages[i].date_time+'</td>';
                        html += '</tr>';
                        html += '<tr>';
                            html += '<td><b>Сообщение:</b></td>';
                            html += '<td>'+SIT_SCOPE.messages[i].text+'</td>';
                        html += '</tr>';
                        html += '<tr>';
                            html += '<td><b>События:</b></td>';
                            html += '<td>';
                            for (var j=0; j<SIT_SCOPE.messages[i].events.length; j++){
                                if (SIT_SCOPE.messages[i].events[j].fk_situation == null){
                                    html += '<span class="label '+SIT_SCOPE.default_class+'" style="cursor:pointer;" onclick="SIT_SCOPE.event_info_view('+SIT_SCOPE.messages[i].events[j].id+')">'+SIT_SCOPE.messages[i].events[j].text+'</span> ';
                                }
                                else {
                                    for (var n=0; n<SIT_SCOPE.situations.length; n++){
                                        if (SIT_SCOPE.situations[n].id == SIT_SCOPE.messages[i].events[j].fk_situation){
                                            html += '<span class="label label-group'+n+'" onclick="SIT_SCOPE.event_info_view('+SIT_SCOPE.messages[i].events[j].id+')">'+SIT_SCOPE.messages[i].events[j].text+'</span> ';
                                        }
                                    }
                                }
                            }
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
SIT_SCOPE.event_info_view = function(evt_id){
    $.ajax({
        url: SIT_SCOPE.base_url+'index.php/conframe_bi/get_event_info/'+evt_id,
        success: function(data){
            data = JSON.parse(data);
            opened_event = data[0];
            var html = '<table class="table table-condensed table-hover" style="font-size:12px;">';
                html += '<tbody>';
                    html += '<tr>';
                        html += '<td nowrap><b>Семантический ID</b></td>';
                        html += '<td>'+opened_event.semantic_id+'</td>';
                    html += '</tr>';
                    html += '<tr>';
                        html += '<td nowrap><b>Тип события</b></td>';
                        html += '<td>'+opened_event.event_type+'</td>';
                    html += '</tr>';
                    html += '<tr>';
                        html += '<td nowrap><b>Результат РПВ</b></td>';
                        html += '<td>'+check_not_null(opened_event.rpv_result)+'</td>';
                    html += '</tr>';
                    html += '<tr>';
                        html += '<td nowrap><b>Результат АПВ</b></td>';
                        html += '<td>'+check_not_null(opened_event.apv_result)+'</td>';
                    html += '</tr>';
                    html += '<tr>';
                        html += '<td nowrap><b>Температура</b></td>';
                        html += '<td>'+check_not_null(opened_event.temperature)+'</td>';
                    html += '</tr>';
                html += '</tbody>';
            html += '</table>';
            $('#event_info').html(html);
            $('#event_info').css('display','block');
        }
    });
}

function htmlentities(s){
    var div = document.createElement('div');
    var text = document.createTextNode(s);
    div.appendChild(text);
    return div.innerHTML;
}

function check_not_null(value){
    if (value == null){
        value = '-';
    }
    return value;
}
