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
    'evnt' : null
};
/*
 * CKharitonov
 */
ATL.init = function(){
	html = '<div class="panel panel-primary">';
        html += '<div class="panel-heading">';
            html += '<div class="row">';
                html += '<div class="col-md-4"><h5><b>Эпюра ситуации Шведина-Время (ЭСШ-Время)</b></h5></div>';
                html += '<div class="col-md-4 col-md-offset-4">';
                    html += '<select class="form-control input-sm" id="events">';
                        if (event_data && event_data.length != 0){
                            for (var i=0; i<event_data.length; i++){
                                html += '<option value="'+i+'">'+event_data[i]["name"]+'</option>';
                            }
                        }
                    html += '</select>';
                html += '</div>';
            html += '</div>';
        html += '</div>';
        html += '<div class="panel-body" id="visualization"></div>';
    html += '</div>';
	$('#atl_diagram').html(html);
    if (event_data && event_data.length != 0){
        ATL.load_data(event_data[$("#events").val()]);
    }
    $("#events").change(function(){
        ATL.load_data(event_data[$("#events").val()]);
    });
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
ATL.load_data = function(evnt){
    $('#visualization').empty();
    $('#table').empty();
	var date = new Date();
	ATL.groups = new vis.DataSet();
	ATL.items = new vis.DataSet();
    ATL.evnt = evnt;
	if (evnt["messages"].length != 0){
		for (var i=0; i<ATL.evnt["messages"].length; i++){
			if (ATL.groups.get(ATL.evnt["messages"][i]["from"]["id"]) == null){
				ATL.groups.add({
                    id: ATL.evnt["messages"][i]["from"]["id"],
                    content: ATL.evnt["messages"][i]["from"]["name"]
                });
            }
            if (ATL.evnt["messages"][i]["message"].length > 7){
                var content = ATL.evnt["messages"][i]["message"].substr(0,7);
                content = content+'...';
            }
            else {
                var content = ATL.evnt["messages"][i]["message"];
            }
            ATL.items.add({
		        id: ATL.evnt["messages"][i]["id"],
		        group: ATL.evnt["messages"][i]["from"]["id"],
		        start: ATL.evnt["messages"][i]["start_time"],
		        content: content,
		        from: ATL.evnt["messages"][i]["from"]["name"],
		        to: ATL.evnt["messages"][i]["to"]["name"]
		    });
		}
	}
    ATL.get_event_time();
  	var options = {
	    stack: false,
	    start: ATL.start_time,
	    end: ATL.end_time,
	    editable: false,
	    margin: {
	    	item: 10,
	    	axis: 5
    	},
        locale: 'ru'
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
        if (ATL.evnt["messages"].length != 0){
            for (var i=0; i<ATL.evnt["messages"].length; i++){
                if (ATL.evnt["messages"][i]["id"] == id){
                	html = '<table class="table table-bordered table-striped table-condensed" style="margin-bottom:0;font-size:12px;">';
                        html += '<tbody>';
                            html += '<tr>';
                                html += '<td><b>'+langs.get_term('txt_from')+'</b></td>';
                                html += '<td>'+ATL.evnt["messages"][i]["from"]["name"]+' <img src="'+ATL.base_url+'img/conframe_bi/subject.png" height="15"></td>';
                            html += '</tr>';
                            html += '<tr>';
                                html += '<td><b>'+langs.get_term('txt_atl_to')+'</b></td>';
                                html += '<td>'+ATL.evnt["messages"][i]["to"]["name"]+' <img src="'+ATL.base_url+'img/conframe_bi/subject.png" height="15"></td>';
                            html += '</tr>';
                            html += '<tr>';
                                html += '<td><b>'+langs.get_term('txt_action')+'</b></td>';
                                html += '<td>'+ATL.evnt["messages"][i]["message"]+'</td>';
                            html += '</tr>';
                            html += '<tr>';
                                html += '<td><b>'+langs.get_term('txt_time')+'</b></td>';
                                html += '<td>'+moment(ATL.evnt["messages"][i]["start_time"]).format("DD-MM-YYYY HH:mm:ss")+'</td>';
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
    html = '<div class="panel panel-info">';
        html += '<div class="panel-heading">'+ATL.evnt["name"]+'</div>';
        html += '<div class="panel-body" style="height:'+($(window).height()/2)+'px;overflow:auto;">';
            html += '<table class="table table-bordered table-hover" style="font-size:12px;">';
                html += '<tbody>';
                    html += '<tr class="active"><th width="15%" nowrap>'+langs.get_term('txt_subject')+'</th><th>'+langs.get_term('txt_action')+'</th><th nowrap>'+langs.get_term('txt_time')+'</th></tr>';
                    for (var j=0; j<groups.length; j++){
                        html += '<tr class="active"><td nowrap><img src="'+ATL.base_url+'img/conframe_bi/subject.png" height="15"> <b>'+groups[j]["content"]+'</b></td><td></td><td></td></tr>';
                        var array = [];
                        for (var i=0; i<ATL.evnt["messages"].length; i++){
                            if (groups[j]["id"] == ATL.evnt["messages"][i]["from"]["id"]){
                                array.push(ATL.evnt["messages"][i]);
                            }
                        }
                        array = array.sort(dynamicSort("start_time"));
                        for (var i=0; i<array.length; i++){
                            html += '<tr id="'+array[i]["id"]+'" onclick="ATL.select_event('+array[i]["id"]+');"><td align="right" nowrap>'+array[i]["to"]["name"]+' <img src="'+ATL.base_url+'img/conframe_bi/subject.png" height="15"></td><td>'+array[i]["message"]+'</td><td nowrap>'+moment(array[i]["start_time"]).format("DD-MM-YYYY HH:mm:ss")+'</td></tr>';
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
                    html += '<tr class="active"><td width="15%" nowrap></td><td align="right" nowrap><b>'+langs.get_term('txt_event_duration')+'</b></td><td nowrap><b>'+duration+'</b></td></tr>';
                html += '</tbody>';
            html += '</table>';
        html += '</div>';
    html += '</div>';
    $("#table").html(html);
}
/*
 * CKharitonov
 */
ATL.get_event_time = function(){
    var time = [];
    for (var i=0; i<ATL.evnt["messages"].length; i++){
        time.push(ATL.evnt["messages"][i]["start_time"]);
    }
    time = time.sort();
    ATL.start_time = time[0];
    ATL.end_time = time[time.length-1];
}