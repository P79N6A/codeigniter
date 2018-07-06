//  ------------------------------------------------------------------------------------ //
//                                  ConFrame-Electric CTM V3                             //
//                               Copyright (c) 2011-2014 DunRose                         //
//                                  <http://www.dunrose.ru/>                             //
//  ------------------------------------------------------------------------------------ //
//  Author: Mr. Thurairajasingam Senthilruban           TSRuban[AT]dunrose.ru            //
//  Programmer: Mr. Kharitonov Constantine Igorevich    CKharitonov[AT]dunrose.ru        //
//  URL: http://www.dunrose.ru                                                           //
// ------------------------------------------------------------------------------------- //

var ATL = {
    'base_url' : null,
    'groups' : null,
    'items' : null,
    'coordX' : null,
    'coordY' : null,
    'message_info' : null,
    'start_time' : null,
    'end_time' : null,
    'evnt' : null,
    'situation' : null,
    'zoomMin' : 30000,
    'sms_icon' : 'glyphicon glyphicon-envelope',
    'email_icon' : 'glyphicon glyphicon-inbox',
    'ojur_icon' : 'glyphicon glyphicon-book'
};
/*
 * CKharitonov
 */
ATL.init = function(){
    $('#sit_name').append(ATL.situation.semantic_id);
    var html = '<div class="panel-body" id="visualization"></div>';
    $('#atl_diagram').html(html);
    if (ATL.situation.length != 0){
        ATL.load_data();
    }
    $(function(){
        $(document).mousedown(function(e){
            $("tr").removeClass(' active_tr');
            ATL.coordX = e.pageX;
            ATL.coordY = e.pageY;
            if (ATL.message_info != null){
                ATL.message_info = null;
                $("#message_info").dialog('close');
            }
        });
    });
}
/*
 * CKharitonov
 */
ATL.load_data = function(){
    $('#visualization').empty();
    $('#table').empty();
    ATL.groups = new vis.DataSet();
    ATL.items = new vis.DataSet();
    if (ATL.situation.messages.length != 0){
        for (var i=0; i<ATL.situation.messages.length; i++){
            if (ATL.groups.get(ATL.situation.messages[i]["from_id"]) == null){
                ATL.groups.add({
                    id: ATL.situation.messages[i]["from_id"],
                    content: ATL.situation.messages[i]["msg_from"],
                });
            }

			var content = ATL.get_icon(ATL.situation.messages[i]["type_operator"])+' '+ATL.strip(ATL.situation.messages[i]["text"]).substr(0,17)+((ATL.situation.messages[i]["text"].length > 17)?'...':'')
            /*if (ATL.situation.messages[i]["text"].length > 17){
               // ATL.situation.messages[i]["text"] = Sanitizer.escape(ATL.situation.messages[i]["text"]);
                var content = ATL.get_icon(ATL.situation.messages[i]["type_operator"])+' '+ATL.strip(ATL.situation.messages[i]["text"]).substr(0,17);//Sanitizer.escape(ATL.situation.messages[i]["text"]).substr(0,17);
                content = content+'...';
            }
            else {
                var content = ATL.get_icon(ATL.situation.messages[i]["type_operator"])+' '+ATL.situation.messages[i]["text"];
            }*/

            ATL.items.add({
                id: ATL.situation.messages[i]["id"],
                group: ATL.situation.messages[i]["from_id"],
                start: CFUtil.get_local_datetime(ATL.situation.messages[i]["date_time"]),
                style:'background-color: #d1d1d1',
                //content: ATL.strip(content),
                content: (content),
                from: ATL.situation.messages[i]["msg_from"],
                to: ATL.situation.messages[i]["msg_to"]
            });
        }
    }
    ATL.get_event_time();
    var options = {
        //start: ATL.start_time,
        //end: ATL.end_time,
        editable: false,
        margin: {
            item: 10,
            axis: 5
    	},
        locale: 'ru',
        zoomMin: ATL.zoomMin
    };
    var container = document.getElementById('visualization');
    timeline = new vis.Timeline(container,null,options);
    timeline.setGroups(ATL.groups);
    timeline.setItems(ATL.items);
    timeline.on('select',function (properties){
        if (properties.items.length != 0){
            ATL.select_event(properties.items[0]);
            ATL.open_dialog(properties.items[0]);
        }
    });
    ATL.build_table();
}
/*
 * CKharitonov
 */
ATL.select_event = function(id){
    $("tr").removeClass(' active_tr');
    $("#"+id).addClass(' active_tr');
    timeline.setSelection(id,{focus: true});
}
/*
 * CKharitonov
 */
ATL.open_dialog = function(id){
    ATL.message_info = CFUtil.dialog.create("message_info",
    {
        title: '&nbsp;',
        width: 500,
        resizable: false,
        position:[ATL.coordX+10,ATL.coordY+10]
    });
    if (ATL.message_info){
        if (ATL.situation.messages.length != 0){
            for (var i=0; i<ATL.situation.messages.length; i++){
                if (ATL.situation.messages[i]["id"] == id){
                    //console.log(ATL.situation.messages[i]["text"])
                    html = '<table class="table table-bordered table-striped table-condensed" style="margin-bottom:0;font-size:12px;">';
                        html += '<tbody>';
                            html += '<tr>';
                                html += '<td><b>'+langs.get_term('txt_time')+'</b></td>';
                                html += '<td>'+moment(CFUtil.get_local_datetime(ATL.situation.messages[i]["date_time"])).format("DD.MM.YYYY HH:mm:ss")+'</td>';
                            html += '</tr>';
                            html += '<tr>';
                                html += '<td><b>'+langs.get_term('txt_from')+'</b></td>';
                                html += '<td>'+check_not_null(htmlentities(ATL.situation.messages[i]["msg_from"]))+' <img src="'+ATL.base_url+'img/conframe_bi/subject.png" height="15"></td>';
                            html += '</tr>';
                           /* html += '<tr>';
                                html += '<td><b>'+langs.get_term('txt_atl_to')+'</b></td>';
                                html += '<td>'+check_not_null(htmlentities(ATL.situation.messages[i]["msg_to"]))+' <img src="'+ATL.base_url+'img/conframe_bi/subject.png" height="15"></td>';
                            html += '</tr>';
                            html += '<tr>';
                                html += '<td><b>'+langs.get_term('txt_type_message')+'</b></td>';
                                html += '<td>'+langs.get_term(ATL.situation.messages[i]["msg_type"])+'</td>';
                            html += '</tr>';*/
                            html += '<tr>';
                                html += '<td width="110px">'+ATL.get_icon(ATL.situation.messages[i]['type_operator'])+'<b> '+langs.get_term('txt_message')+'</b></td>';
                                html += '<td>'+ATL.situation.messages[i]["text"]+'</td>';
                            html += '</tr>';
                          
                        html += '</tbody>';
                    html += '</table>';
                    $(ATL.message_info).html(html);
                }
            }
        } 
    }
}
/*
 * CKharitonov
 */
function dynamicSort(property){
    var sortOrder = 1;
    if (property[0] === "-"){
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b){
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}
/*
 * CKharitonov
 */
ATL.build_table = function(){
    var groups = ATL.groups.get();

    var html = '<div class="sit_cont" style="max-height:450px;overflow:auto">';
        html += '<table class="table table-bordered table-hover" style="background-color:#fff;font-size:12px;">';
            html += '<tbody>';
                html += '<tr class="active"><th width=95%>'+langs.get_term('txt_message')+'</th><th >'+langs.get_term('txt_time')+'</th></tr>';
                for (var j=0; j<groups.length; j++){
                    html += '<tr class="active"><td><img src="'+ATL.base_url+'img/conframe_bi/subject.png" height="15"> <b>'+groups[j]["content"]+'</b></td><td></td></tr>';
                    var array = [];
                    for (var i=0; i<ATL.situation.messages.length; i++){
                        if (groups[j]["id"] == ATL.situation.messages[i]["from_id"]){
                            
                            array.push(ATL.situation.messages[i]);
                        }
                    }
                    array = array.sort(dynamicSort("date_time"));
                    for (var i=0; i<array.length; i++){
                        html += '<tr style="cursor:pointer" id="'+array[i]["id"]+'" onclick="ATL.select_event('+array[i]["id"]+');"><td>'+ATL.get_icon(array[i]['type_operator'])+' '+array[i]["text"]+'</td><td nowrap>'+moment(CFUtil.get_local_datetime(array[i]["date_time"])).format("DD.MM.YYYY HH:mm:ss")+'</td></tr>';//<span class="'+ATL[array[i]["msg_type"]+'_icon']+'" title="'+langs.get_term(array[i]["msg_type"])+'"></span>
                    }
                }
                var a = moment(ATL.start_time);
                var b = moment(ATL.end_time);
                var delta = Math.abs(b - a) / 1000;
                var days = Math.floor(delta / 86400);
                delta -= days * 86400;
                var hours = Math.floor(delta / 3600) % 24;
                delta -= hours * 3600;
                var minutes = Math.floor(delta / 60) % 60;
                var duration = '';
                if (days != 0){
                    duration += days+' '+langs.get_term('txt_days')+' ';
                }
                if (hours != 0){
                    duration += hours+' '+langs.get_term('txt_hours')+' ';
                }
                if (minutes != 0){
                    duration += minutes+' '+langs.get_term('txt_minutes');
                }
                html += '<tr class="active"><td align="right"><b>'+langs.get_term('txt_event_duration')+'</b></td><td><b>'+duration+'</b></td></tr>';
            html += '</tbody>';
        html += '</table>';
    html += '</div>';
    $("#table").html(html);
    ATL.get_view(ATL.situation.id);
}
/*
    var groups = ATL.groups.get();
    var html = '<div class="sit_cont" style="max-height:450px;overflow:auto">';
        html += '<table class="table table-bordered table-hover" style="background-color:#fff;font-size:12px;">';
            html += '<tbody>';
                html += '<tr class="active"><th width="30%">'+langs.get_term('txt_subject')+'</th><th>'+langs.get_term('txt_message')+'</th><th>'+langs.get_term('txt_time')+'</th></tr>';
                for (var j=0; j<groups.length; j++){
                    html += '<tr class="active"><td><img src="'+ATL.base_url+'img/conframe_bi/subject.png" height="15"> <b>'+groups[j]["content"]+'</b></td><td></td><td></td></tr>';
                    var array = [];
                    for (var i=0; i<ATL.situation.messages.length; i++){
                        if (groups[j]["id"] == ATL.situation.messages[i]["from_id"]){
                            array.push(ATL.situation.messages[i]);
                        }
                    }
                    array = array.sort(dynamicSort("date_time"));
                    for (var i=0; i<array.length; i++){
                        html += '<tr style="cursor:pointer" id="'+array[i]["id"]+'" onclick="ATL.select_event('+array[i]["id"]+');"><td align="right">'+check_not_null(htmlentities(array[i]["msg_to"]))+' <img src="'+ATL.base_url+'img/conframe_bi/subject.png" height="15"></td><td><span class="'+ATL[array[i]["msg_type"]+'_icon']+'" title="'+langs.get_term(array[i]["msg_type"])+'"></span> '+array[i]["text"]+'</td><td nowrap>'+moment(CFUtil.get_local_datetime(array[i]["date_time"])).format("DD.MM.YYYY HH:mm:ss")+'</td></tr>';
                    }
                }
                var a = moment(ATL.start_time);
                var b = moment(ATL.end_time);
                var delta = Math.abs(b - a) / 1000;
                var days = Math.floor(delta / 86400);
                delta -= days * 86400;
                var hours = Math.floor(delta / 3600) % 24;
                delta -= hours * 3600;
                var minutes = Math.floor(delta / 60) % 60;
                var duration = '';
                if (days != 0){
                    duration += days+' '+langs.get_term('txt_days')+' ';
                }
                if (hours != 0){
                    duration += hours+' '+langs.get_term('txt_hours')+' ';
                }
                if (minutes != 0){
                    duration += minutes+' '+langs.get_term('txt_minutes');
                }
                html += '<tr class="active"><td width="15%"></td><td align="right"><b>'+langs.get_term('txt_event_duration')+'</b></td><td><b>'+duration+'</b></td></tr>';
            html += '</tbody>';
        html += '</table>';
    html += '</div>';
    $("#table").html(html);
    ATL.get_view(ATL.situation.id);
*/
/*
 * CKharitonov
 */
ATL.get_event_time = function(){
    var time = [];
    for (var i=0; i<ATL.situation.messages.length; i++){
        time.push(moment(CFUtil.get_local_datetime(ATL.situation.messages[i]["date_time"])).format("YYYY-MM-DD HH:mm:ss"));
    }
    time = time.sort();
    ATL.start_time = time[0];
    ATL.end_time = time[time.length-1];
}
/*
 * CKharitonov
 */
ATL.get_view = function(sit_id){
    $("#view").html('<iframe src="'+ATL.base_url+'index.php/conframe_bi/view_db/'+sit_id+'/PRINT'+'" width="100%" height="'+$('body').height()+'" frameBorder="0"></iframe>');
}

/*
    Artem
*/
ATL.get_icon = function(type){
    var html = '<span class="';
    if (!type || type == 'NULL'){
        html+='glyphicon glyphicon-envelope';
        html+='">';
    }else if (type == 'beeline'){
        html+='beeline">Б';
    }else if (type == 'megafon'){
        html+='megafon">М';
    }else if (type == 'OJUR'){
        html+='glyphicon glyphicon-book">';
    }else{
        html+='">';
    }
    html+='</span>';
    return html;
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
/*
 * CKharitonov
 */
function htmlentities(s){
    var div = document.createElement('div');
    var text = document.createTextNode(s);
    div.appendChild(text);
    return div.innerHTML;
}
ATL.strip = function(html){
   var tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
}