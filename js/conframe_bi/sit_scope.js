//  ------------------------------------------------------------------------------------ //
//                                  ConFrame-Electric CTM V3                             //
//                               Copyright (c) 2011-2014 DunRose                         //
//                                  <http://www.dunrose.ru/>                             //
//  ------------------------------------------------------------------------------------ //
//  Author: Mr. Thurairajasingam Senthilruban           TSRuban[AT]dunrose.ru            //
//  Programmer: Mr. Kharitonov Constantine Igorevich    CKharitonov[AT]dunrose.ru        //
//  URL: http://www.dunrose.ru                                                           //
// ------------------------------------------------------------------------------------- //

function group_event(){
    this.group_id = null;
    this.group_name = null;
    this.class_name = null;
    this.events = new Array();
}

var SIT_SCOPE = {
    'base_url' : null,
    'items' : null,
    'drag_event' : null,
    'drag_start' : false,
    'group_events': new Array(),
    'timeline' : null,
    'selected_objects' : new Array(),
    'union_window' : null,
    'events' : new Array(),
    'default_class' : 'label-default',
    'selected_class' : 'label-primary',
    'blink' : null
};
/*
 * CKharitonov
 */
SIT_SCOPE.init = function(){
    html = '<div class="panel panel-primary">';
        html += '<div class="panel-heading">';
            html += '<div class="row">';
                html += '<div class="col-md-8" style="cursor:default;"><h5><b>Эпюра ситуации Шведина-База (ЭСШ-База)</b></h5></div>';
                html += '<div class="col-md-1 col-md-offset-3"><button type="button" class="btn btn-primary" title="'+langs.get_term("txt_print")+'" onclick="window.print();"><span class=""><i class="fa fa-print" aria-hidden="true"></i></span></button></div>';
            html += '</div>';
        html += '</div>';
        html += '<div class="panel-body" id="situation_name" style="cursor:default;"></div>';
        html += '<div class="panel-body" id="visualization"></div>';
    html += '</div>';
    html += '<div class="panel panel-default">';
        html += '<div class="panel-body">';
            html += '<div id="events" style="float:left;"></div>';
            html += '<div style="float:left;">';
                html += '<span class="well well-sm" ';
                    html += 'style="border:1px dashed #000;cursor:pointer;"';
                    html += 'id="add_group"><span id="grp_bdg" class="badge group_bdg">+</span>';
                html += '</span>';
            html += '</div>';
        html += '</div>';
    html += '</div>';
    $('#content').html(html);
    if (situation_data && situation_data.length != 0){
        for (var i=0; i<situation_data[0].messages.length; i++){
            for (var j=0; j<situation_data[0].messages[i].events.length; j++){
                situation_data[0].messages[i].events[j].message_id = situation_data[0].messages[i].id;
                SIT_SCOPE.events.push(situation_data[0].messages[i].events[j]);
            }
        }
        SIT_SCOPE.load_data(situation_data[0]);
    }
    $('span.drag').mousedown(function(e){
        for (var i=0; i<SIT_SCOPE.events.length; i++){
            if (SIT_SCOPE.events[i].id == this.id){
                SIT_SCOPE.drag_event = SIT_SCOPE.events[i];
                SIT_SCOPE.timeline.setOptions({moveable: false});
                SIT_SCOPE.drag_start = true;
                $('#drag_cont').html(SIT_SCOPE.events[i]["content"]);
            }
        }
        if ($('#'+this.id).attr('group') != ''){
            for (var i=0; i<SIT_SCOPE.selected_objects.length; i++){
                $('#'+SIT_SCOPE.selected_objects[i]).removeClass(SIT_SCOPE.selected_class).addClass(SIT_SCOPE.default_class);
            }
            $('#grp_bdg').removeClass('group_bdg_active').addClass('group_bdg');
            SIT_SCOPE.selected_objects = new Array();
            for (var i=0; i<SIT_SCOPE.group_events.length; i++){
                if (SIT_SCOPE.group_events[i].group_id == $('#'+this.id).attr('group')){
                    for (var j=0; j<SIT_SCOPE.group_events[i].events.length; j++){
                        SIT_SCOPE.selected_objects.push(SIT_SCOPE.group_events[i].events[j].id);
                        $('#'+SIT_SCOPE.group_events[i].events[j].id).removeClass(SIT_SCOPE.group_events[i].class_name).addClass(SIT_SCOPE.selected_class);
                    }
                }
            }
        }
    });
    $(document).mouseup(function(){
        if (SIT_SCOPE.drag_event != null && $('#'+SIT_SCOPE.drag_event.id).attr('group') != ''){
            var selected_events = $('.'+SIT_SCOPE.selected_class);
            for (var i=0; i<selected_events.length; i++){
                for (var j=0; j<SIT_SCOPE.group_events.length; j++){
                    if (SIT_SCOPE.group_events[j].group_id == $('#'+selected_events[i].id).attr('group')){
                        $('#'+selected_events[i].id).removeClass(SIT_SCOPE.selected_class).addClass(SIT_SCOPE.group_events[j].class_name);
                    }
                }
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
                    $('#grp_bdg').removeClass('group_bdg').addClass('group_bdg_active');
                }
                $('#'+SIT_SCOPE.drag_event.id).removeClass(SIT_SCOPE.default_class).addClass(SIT_SCOPE.selected_class);
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
            for (var i=0; i<SIT_SCOPE.group_events.length; i++){
                $('#grp'+i).popover('hide');
            }
        }
    });
    $('#add_group').mouseup(function(){
        if (SIT_SCOPE.drag_event != null){
            if (SIT_SCOPE.selected_objects.length > 0 && $('#'+SIT_SCOPE.selected_objects[0]).attr('group') == ''){
                SIT_SCOPE.union();
            }
        }
    }).mouseover(function(){
        $('#add_group').css({
            'background': '#DCDCDC'
        })
    }).mouseout(function(){
        $('#add_group').css({
            'background': '#F5F5F5'
        })
    });
}
/*
 * CKharitonov
 */
SIT_SCOPE.add_group_button = function(grp,count){
    var html = '<span class="well well-sm" ';
        html += 'style="border:1px dashed #000;cursor:pointer;margin-right:10px;" data-toggle="popover" data-placement="bottom" data-content=""';
        html += 'id="grp'+count+'" onclick="SIT_SCOPE.add_popover_content('+count+')"><span id="grp'+count+'_name">'+grp.group_name+'</span>&nbsp;&nbsp;';
        html += '<span class="badge '+grp.class_name+'" id="bdg'+count+'">'+grp.events.length+'</span>';
    html += '</span>';
    $('#events').append(html);
    $('#grp'+count).popover({html:true});
    $('#grp'+count).mouseup(function(){
        if (SIT_SCOPE.drag_start == false) return;
        for (var i=0; i<SIT_SCOPE.group_events.length; i++){
            if (SIT_SCOPE.group_events[i].group_id == this.id && SIT_SCOPE.drag_event != null){
                for (var j=0; j<SIT_SCOPE.selected_objects.length; j++){
                    $('#'+SIT_SCOPE.selected_objects[j]).removeClass(SIT_SCOPE.selected_class).addClass(SIT_SCOPE.group_events[i].class_name);
                    if ($('#'+SIT_SCOPE.selected_objects[j]).attr('group') != this.id){
                        for (var n=0; n<SIT_SCOPE.events.length; n++){
                            if (SIT_SCOPE.selected_objects[j] == SIT_SCOPE.events[n]["id"]){
                                SIT_SCOPE.group_events[i].events.push(SIT_SCOPE.events[n]);
                                if ($('#'+SIT_SCOPE.events[n]["id"]).attr('group') != ''){
                                    for (var z=0; z<SIT_SCOPE.group_events.length; z++){
                                        if ($('#'+SIT_SCOPE.events[n]["id"]).attr('group') == SIT_SCOPE.group_events[z].group_id){
                                            SIT_SCOPE.remove_event(SIT_SCOPE.events[n]["id"],z,1);
                                        }
                                    }
                                }
                                $('#'+SIT_SCOPE.events[n]["id"]).attr('group','grp'+i);
                            }
                        }
                    }
                }
                SIT_SCOPE.selected_objects = new Array();
                $('#grp_bdg').removeClass('group_bdg_active').addClass('group_bdg');
                $('#bdg'+i).html(SIT_SCOPE.group_events[i].events.length);
                SIT_SCOPE.drag_event = null;
                SIT_SCOPE.drag_start = false;
                SIT_SCOPE.timeline.setOptions({moveable: true});
                $('#drag_cont').css({
                    'visibility': 'hidden'
                });
            }
        }
    }).mouseover(function(){
        $('#grp'+count).css({
            'background': '#DCDCDC'
        })
    }).mouseout(function(){
        $('#grp'+count).css({
            'background': '#F5F5F5'
        })
    });
}
/*
 * CKharitonov
 */
SIT_SCOPE.add_popover_content = function(count){
    for (var i=0; i<SIT_SCOPE.group_events.length; i++){
        if (SIT_SCOPE.group_events[i].group_id != 'grp'+count){
            $('#grp'+i).popover('hide');
        }
    }
    if (SIT_SCOPE.group_events[count].events.length != 0){
        var html = '<div style="height:140px;overflow:auto;">';
            html += '<table class="table table-hover" style="font-size:12;">';
                html += '<tbody>';
                html += '<tr><td width="95%"><input type="text" class="form-control input-sm" id="group'+count+'_name" value="'+SIT_SCOPE.group_events[count].group_name+'"></td><td width="5%" style="vertical-align:middle;"><span class="glyphicon glyphicon-ok alert-success" style="cursor:pointer;" title="'+langs.get_term("sm_btn_save")+'" onclick="SIT_SCOPE.edit_group_name('+count+')"></span></td></tr>';
                for (var i=0; i<SIT_SCOPE.group_events[count].events.length; i++){
                    html += '<tr id="tr'+SIT_SCOPE.group_events[count].events[i]["id"]+'" style="cursor:pointer;" onmouseout="SIT_SCOPE.mouse_out('+SIT_SCOPE.group_events[count].events[i]["id"]+')" onmouseover="SIT_SCOPE.mouse_over('+SIT_SCOPE.group_events[count].events[i]["id"]+')"><td width="95%" onclick="SIT_SCOPE.timeline.focus('+SIT_SCOPE.group_events[count].events[i]["message_id"]+',{animate:1000});">'+SIT_SCOPE.group_events[count].events[i]["content"]+'</td><td width="5%"><span class="glyphicon glyphicon-remove alert-danger" title="'+langs.get_term("sm_btn_delete")+'" onclick="SIT_SCOPE.remove_event('+SIT_SCOPE.group_events[count].events[i]["id"]+','+count+',0);"></span></td></tr>';
                }
                html += '</tbody>';
            html += '</table>';
        html += '</div>';
        $('#grp'+count).attr('data-content',html);
    }
}
/*
 * CKharitonov
 */
SIT_SCOPE.remove_event = function(id,count,m){
    $('#tr'+id).remove();
    for (var i=0; i<SIT_SCOPE.group_events[count].events.length; i++){
        if (SIT_SCOPE.group_events[count].events[i].id == id){
            SIT_SCOPE.group_events[count].events.splice(i,1);
            $('#'+id).attr('group','');
            $('#bdg'+count).html(SIT_SCOPE.group_events[count].events.length);
            if (m == 0){
                $('#'+id).removeClass(SIT_SCOPE.group_events[count].class_name).addClass(SIT_SCOPE.default_class);
            }
            if (SIT_SCOPE.group_events[count].events.length == 0){
                $('#grp'+count).attr('data-content','');
                $('#grp'+count).popover('hide');
                $('#grp'+count).remove();
            }
            SIT_SCOPE.mouse_out(id);
        }
    }
}
/*
 * CKharitonov
 */
SIT_SCOPE.union = function(){
    var data = new Array();
    var count = SIT_SCOPE.group_events.length;
    var group_name = '';
    for (var i=0; i<SIT_SCOPE.selected_objects.length; i++){
        $('#'+SIT_SCOPE.selected_objects[i]).removeClass(SIT_SCOPE.selected_class).addClass('label-group'+count);
        for (var j=0; j<SIT_SCOPE.events.length; j++){
            if (SIT_SCOPE.selected_objects[i] == SIT_SCOPE.events[j]["id"]){
                if (group_name == ''){
                    group_name = SIT_SCOPE.events[j]["content"];
                }
                data.push(SIT_SCOPE.events[j]);
                $('#'+SIT_SCOPE.events[j]["id"]).attr('group','grp'+count);
            }
        }
    }
    var grp = new group_event();
    grp.group_id = 'grp'+count;
    grp.group_name = group_name;
    grp.class_name = 'label-group'+count;
    grp.events = data;
    SIT_SCOPE.group_events.push(grp);
    SIT_SCOPE.add_group_button(grp,count);
    $('#grp_bdg').removeClass('group_bdg_active').addClass('group_bdg');
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
            $('#grp_bdg').removeClass('group_bdg').addClass('group_bdg_active');
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
            $('#grp_bdg').removeClass('group_bdg_active').addClass('group_bdg');
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
        $('#grp_bdg').removeClass('group_bdg_active').addClass('group_bdg');
        $('#union_window').dialog('close');
    }
    $('#tr'+id).remove();
}
/*
 *
 */
SIT_SCOPE.set_event_content = function(evt){
    if (!evt) return "";
    var html = '<br><div>';
    for (var j=0; j<evt.length; j++){
        html += '<span class="label '+SIT_SCOPE.default_class+' drag" group="" draggable="true" style="cursor:pointer;" onclick="SIT_SCOPE.select_object('+evt[j]["id"]+')" id="'+evt[j]["id"]+'">'+evt[j]["content"]+'</span>&nbsp;&nbsp;';
    }
    html += '</div>';
    return html;
}
/*
 *
 */
SIT_SCOPE.set_message_content = function(msg){
    if (!msg) return "";
    var html = '<div style="height:70px;cursor:default;">';
        html += '<span class="alert alert-danger">'+msg.message+'</span><br>';
        if (msg["events"].length != 0){
            html += SIT_SCOPE.set_event_content(msg["events"]);
        }
    html += '</div>';
    return html;
}
/*
 * CKharitonov
 */
SIT_SCOPE.load_data = function(situation){
    $('#visualization').empty();
    $('#situation_name').html('<h6><b>'+situation["name"]+'</b></h6>');
    SIT_SCOPE.items = new vis.DataSet();
    if (situation["messages"].length != 0){
        for (var i=0; i<situation["messages"].length; i++){
            SIT_SCOPE.items.add({
                id: situation["messages"][i]["id"],
                start: situation["messages"][i]["start_time"],
                content: SIT_SCOPE.set_message_content(situation["messages"][i]),
                className: 'blue'
            });
        }
    }
    var container = document.getElementById('visualization');
    var options = {
        start: '2013-03-13 16:10:00',
        end: '2013-03-13 17:25:00',
        height: $(window).height()/2.2,
        selectable: false,
        moveable: true,
        locale: 'ru'
    };
    SIT_SCOPE.timeline = new vis.Timeline(container,SIT_SCOPE.items,options);
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
 */
SIT_SCOPE.edit_group_name = function(count){
    SIT_SCOPE.group_events[count].group_name = $('#group'+count+'_name').val().replace(/ <.*?script.*?>.*?<\/.*?script.*?>/igm,"");
    $('#grp'+count+'_name').html(SIT_SCOPE.group_events[count].group_name);
}