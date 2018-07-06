
var CFsbj = [
];
var  CFbi = { 
    network:null,
    message_info: null,//диалоговое окно
    base_url: null,
    alert : new CFEAlert(""),
    div_table: null,
    div_panel:null,
    events:[],
    full_messages:[],
    events_info:null,
    nodes:  [],
	edges:  [],
    image_subject:  ['img/conframe_bi/subject.png','img/conframe_bi/subject_group.png'],
    cur_ection : null,
    exception:["id","is_test","sensparsed","fk_copy","event_order","is_sensparsed"],
	type_message:[
		{
			name : 'ОЖУР',
			color: 'green',
			width: 2,
			style_line: 'arrow',	
		},
		{
			name : 'СМС',
			color: 'darkblue',
			width: 2,
			style_line: 'arrow',	
		},
		{
			name : 'Почта',
			color: 'darkred',
			width: 2,
			style_line: 'arrow',	
		},
		{
			name : 'Телефон',
			color: 'darkblue',
			width: 2,
			style_line: 'dash-line',	
		},

	],
	default_color:{
		name : 'Без типа', 
		color: 'black',
		width: 2,
		style_line: 'arrow',
	},
	options :{
				disableStart :true,
				stabilize: true,
				smoothCurves:{dynamic:true,type:"straightCross"},
				hierarchicalLayout: {
						enabled:true,
						direction: "LR",
						levelSeparation:200,
						nodeSpacing:-300,
					//	layout:"layout",
					 },

				physics: { 
							barnesHut: {
									gravitationalConstant: -7000,
									centralGravity: 0.3, 
									springLength: 1, 
									springConstant: 0.02, 
									damping: 0.3
							},
							hierarchicalRepulsion: {
						          centralGravity: 0.5,
						          springLength: -150,
						          springConstant: 1,
						          damping: 0.3
						    }	
				     	}
			 
		},
};
CFbi.window_events = function(id_marker,id_subject){
	if (!id_marker || !id_subject){
            if (CFbi.message_info){
                    CFbi.message_info.dialog("close");
                    CFbi.message_info = null;
            }
            return;
	} 
		
		CFbi.message_info = CFUtil.dialog.create("message_info",
		{
				title: '&nbsp;Информация',
				width: 500,
				resizable: false,
				position:"center",//[CFbi.coordX+20,CFbi.coordY+20]
		});
		if (CFbi.message_info){
			var attr = {};
			for (var i in CFsbj){
                            if (CFsbj[i].id == id_subject){
                                attr.name = CFsbj[i].subject;
                              
                                for (var e in CFsbj[i].events){
                                    if (CFsbj[i].events[e].marker == id_marker){
                                            attr.event = CFsbj[i].events[e];
                                    }
                                }
                                break;
                            }
			}
			
            html = '<table class="table table-bordered table-striped table-condensed" style="margin-bottom:0;font-size:12px;">';
                html += '<tbody>';
                    html += '<tr>';
                            html+='<td>Тип события</td><td>'+attr.event.marker+'</td>'
                    html += '</tr>';
                    html += '<tr>';
                            html+='<td>Субъект</td><td>'+attr.name+'</td>'
                    html += '</tr>';
                    html += '<tr>';
                            html+='<td>Время</td><td>'+moment(CFUtil.get_local_datetime(new Date(attr.event.start_time))).format("DD-MM-YYYY HH:mm:ss")+'</td>'	
                    html += '</tr>';
                    html += '<tr>';
                            html+='<td width="100px">'+CFbi.get_icon(attr.event.type_operator)+' Сообщение</td><td>'+attr.event.content+'</td>'		
                    html += '</tr>';
                html += '</tbody>';
            html += '</table>';
			
			$(CFbi.message_info).html(html);
		}
}
CFbi.window_situation = function(node){
	if (!CFbi.events_info || CFbi.events_info == "null" || !node || !node.event_id_db) return;

    if (CFbi.message_info){
            CFbi.message_info.dialog("close");
            CFbi.message_info = null;
    }
    CFbi.message_info = CFUtil.dialog.create("message_info",
		{
				title: '&nbsp;Информация',
				width: 500,
				height:300,
				resizable: false,
				position:"center",//[CFbi.coordX+20,CFbi.coordY+20]
		});
    if (CFbi.message_info){
    	var html = '<div id = "info"></div>';
        $(CFbi.message_info).html(html);
        CF_Events_info.get_event_info(node.event_id_db,'info');
    }
}

CFbi.run = function(json){
	if(!json) return;
	if (CFsbj.length == 0 || !CFsbj) CFsbj = json;
	var html = '';
	for (var i in CFsbj){
		html+= get_html_subj_event(CFsbj[i],i)
	}
	CFbi.events =  CFbi.events.sort(dynamicSort("marker"));
	$('#'+CFbi.div_table).append(html);
	for (var si in CFbi.events){
		CFbi.events[si].cs = si;
		$('#head_subj_ev').append('<th class="align-center-table">'+CFbi.events[si].marker+'</th>');
	}
	for (var s in CFsbj){
		get_html_data(CFsbj[s]);
	}
	
/******************************КОНТЕНТ ТАБЛИЦЫ******************************************/
	function get_html_data(data){
		var html = '';
		var cs_sp = [];

		for (var i in data.events){
			for (var e in CFbi.events){
				if (CFbi.events[e].data.marker == data.events[i].marker){//CFbi.events[e].data.id == data.events[i].id
					cs_sp[CFbi.events[e].cs+'_id'] = CFbi.events[e];
				}
			}
		}
		
		for (var i in CFbi.events){
			if (cs_sp[i+'_id'] || cs_sp[i+'_id'] == 0){
				//console.log(cs_sp[i+'_id'].data,data.id);
				html+='<td class="align-center-table set-cursor" onclick="CFbi.window_events(\''+cs_sp[i+'_id'].data.marker+'\',\''+data.id+'\')"><span style="color:green" class="glyphicon glyphicon-ok"></span></td>'
			}else{

				html+='<td class="align-center-table" onclick="CFbi.window_events()"><span style="color:red" class="glyphicon glyphicon-remove"></span></td>'
			}
		}

		$('#'+data.id+'_sub').append(html);
	}
/**************************************************************************************/
/*
data 
end_time: "2013-03-13 16:30:05"
events: Array[3]

[0]
content: "E1: АПВ неуспешно"
id: 11
marker: "АПВ"
start_time: "2013-03-13 16:21:05"

id: 1
message: "M01: 16-21 АО с неуспешным АПВ ВЛ-220. Б10-Погорелово.Б10: ДФЗ. Погорелово: ДФЗ, 1ст.ТЗНП."
start_time: "2013-03-13 16:15:05
"subject: "ДЭВ 3"
*/
	function get_html_subj_event(data,i){
		if (!data || !i) return;
		var html_hr = '';

		if (i == 0){
			var html_ev ='<tr id="head_subj_ev">';
			html_ev+='<td></td>';
			html_ev+='</tr>';
			$('#'+CFbi.div_table).append(html_ev);
		} 
		/*********************************************************************************/
		var empty = false;
		var id_empty = null;
		html_hr+=add_subject(data);

		for (var j in data.events){//поставил загаловки
			empty = false;
			id_empty = null;
			for (var se in CFbi.events){
				if (data.events[j].marker == CFbi.events[se].data.marker){//data.events[j].id == CFbi.events[se].data.id
					id_empty = data.events[j].marker;
					empty = true;
					break;
				}
			}
			if (empty){

			}else{

				
				CFbi.events.push({
					data : data.events[j],
					cs : CFbi.events.length,
					marker:data.events[j].marker,
				});
			}
		}
		/*********************************************************************************/
		function add_subject(data,cs){
			
			var html_hr ='<tr id="'+data.id+'_sub">';
			html_hr+= '<th>';
			
		//	html_hr+=CFbi.get_icon(data.type_operator)+' ';
			/*if (data.msg_type == "EMAIL"){
				html_hr+='<span class="glyphicon glyphicon-inbox"></span>&nbsp';
			}else if(data.msg_type == "SMS"){
				html_hr+='<span class="glyphicon glyphicon-envelope"></span>&nbsp';
			}*/
			html_hr+=data.subject+'</th>';
			html_hr+='</tr>';
			return html_hr;
		}
		
		return html_hr;
	}
	
}
function dynamicSort(property) {
		var sortOrder = 1;
		if(property[0] === "-") {
				sortOrder = -1;
				property = property.substr(1);
		}
		return function (a,b) {
				var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
				return result * sortOrder;
	
		}
}
CFbi.set_db_etl_v2 = function(json){
	if (!json) return;

	CFsbj = [];
	var db_etl = {};
	for (var i in json){
/**************CLEAR**********************/
		if (checked_subject(json[i].from_id)){
		    json_event = {};
			mas_events = [];
			db_etl.events =[];

			//db_etl.event_id_db = json[i].id;//??? видимо не верно
			//db_etl.message = null // видимо не нужно так как используется вывод content
			db_etl.subject = null;//имя???

		/************UP*******************/
			db_etl.id = CFsbj.length;//все равно что будет тут
			
			db_etl.subject = json[i].msg_from;//потом имя сюда (левая колонка)
			db_etl.subject_id = json[i].from_id;//id для сверок eventsov
			db_etl.msg_type = json[i].msg_type;

		/************in EVENTS*******************/	
			db_etl.events = get_events(json,json[i].from_id);
			

			CFsbj.push(jQuery.extend(true, {},  db_etl));
		}
		
	}
	CFbi.run(CFsbj);
	CFbi.set_etl_schema_v2();
	function checked_subject (id_subject){
		if (!id_subject) return false;
		for (var i in CFsbj){
			if (CFsbj[i].subject_id == id_subject){
				return false;
				break;
			}
		}
		return true;
	}
	function get_events (events,id_subject){
		var mas_events = [];
		var json_event = {};
		for (var i in events){
			if (events[i].from_id == id_subject){
				json_event = {};
				json_event.content = events[i].content;
				json_event.id = events[i].id;//заменить на реальный id??? 
				json_event.marker = events[i].event_type;
				json_event.start_time = events[i].date_time;
				json_event.semantic_id = events[i].abbrev_long;//events[i].event_order+events[i].semantic_id;
				json_event.event_id_db = events[i].id;
				json_event.type_operator = events[i].type_operator == "NULL" ? null : events[i].type_operator;
				mas_events.push(json_event);
			}
		}
		return mas_events;
	}
}
CFbi.set_db_etl = function(json){
	if(!json) return;
	//CFsbj - то тчо не обходимо туда
	CFsbj = [];
	var db_etl = {};
	for (var i in json){
/**************CLEAR**********************/
		if (checked_subject(json[i].from_id)){
		    json_event = {};
			mas_events = [];
			db_etl.events = [];

			//db_etl.event_id_db = json[i].id;
			//db_etl.message = null // видимо не нужно так как используется вывод content
			db_etl.subject = null;//имя???

		/************UP*******************/
			db_etl.id = CFsbj.length;//все равно что будет тут
			
			db_etl.subject = json[i].msg_from;//потом имя сюда (левая колонка)

			db_etl.subject_id = json[i].from_id;//id для сверок eventsov
			db_etl.msg_type = json[i].msg_type;

			//db_etl.type_operator = json[i].type_operator;
		/************in EVENTS*******************/	
			db_etl.events = get_events(json,json[i].from_id);
			CFsbj.push(jQuery.extend(true, {},  db_etl));
		}
		
	}
	
	CFbi.run(CFsbj);
	CFbi.set_etl_schema();
	function checked_subject (id_subject){
		if (!id_subject) return false;
		for (var i in CFsbj){
			if (CFsbj[i].subject_id == id_subject){
				return false;
				break;
			}
		}
		return true;
	}
	function get_events (events,id_subject){
		var mas_events = [];
		var json_event = {};
		for (var i in events){
			if (events[i].from_id == id_subject){

				json_event = {};
				json_event.content = events[i].content;
				json_event.id = events[i].id;//заменить на реальный id??? 
				json_event.marker = events[i].event_type;
				json_event.start_time = events[i].date_time;
				json_event.semantic_id = events[i].semantic_id;
				json_event.event_id_db = events[i].id;
				json_event.type_operator = events[i].type_operator == "NULL" ? null : events[i].type_operator;
				mas_events.push(json_event);
			}
		}
		
		return mas_events;
	}

}
/*************************CANVAS********************************/
CFbi.set_etl_schema = function(){
	var subject = null;
	var object = null;
	var all_events = [];
	var objects = [];
	var subjects = [];
	var line = [];
	var id_sub_line = null;
	for (var i in CFsbj){
		//проверять не зачем на совпадение субьектов, так как уже ранее события были распределны по субьектам
		get_events(jQuery.extend(true, {},  CFsbj[i]),all_events);
		subject = add_subject({
			name:CFsbj[i].subject,
			id:CFsbj[i].subject_id,
		})
		subjects.push(jQuery.extend(true, {},  subject));
		CFbi.nodes.push(subject);
	}
//	var all_events =  all_events.sort(dynamicSort("start_time"));
	for (var i in all_events){
		object = add_object(all_events[i]);
		CFbi.nodes.push(object);
		id_sub_line = get_id_from_mas(subjects,"id",{
							where:"subject_id",
							is:all_events[i].subject_id,
						});

		set_level_object({
			objects:objects,
			cur_object:object,
		});
		objects.push(object);
		for (var s in subjects){

			if (subjects[s].subject_id == all_events[i].subject_id){
				subjects[s].set_events.push(object);
				//то что больше обьектов, нужно проверить что текущее время == предыдущему
				if (subjects[s].set_events.length>2){
					//если текущий == предыдущему
					if (subjects[s].set_events[subjects[s].set_events.length-1].start_time == subjects[s].set_events[subjects[s].set_events.length-2].start_time){
						//console.log(subjects[s].set_events[subjects[s].set_events.length-2]);

						for (var edg in CFbi.edges){

							if (CFbi.edges[edg].to == subjects[s].set_events[subjects[s].set_events.length-2].id){
								id_sub_line = CFbi.edges[edg].from;
								line =  add_line({
											id_from:id_sub_line,
											id_to:parseInt(object.id),
											start_time:all_events[i].start_time,
										})
								CFbi.edges.push(line);
							}

						}

						id_sub_line = null;
						continue;

					}
					//начинаем  с конца
					for (var sub = subjects[s].set_events.length-2; sub!=0; sub--){
						//если еще есть повторения после него продолжаем
						//добавить условие если последний совпадает с текущим
						if ( subjects[s].set_events[sub].start_time ==  subjects[s].set_events[sub-1].start_time && sub-1 != 0){
							continue;
						}else{//закончились повторения терь вуаля

							for (var set_id_line = sub-1;  set_id_line != subjects[s].set_events.length-1; set_id_line++){

								if (subjects[s].set_events[sub-1].start_time ==  subjects[s].set_events[subjects[s].set_events.length-1].start_time ) continue;


								id_sub_line = subjects[s].set_events[set_id_line].id;
								line =  add_line({
											id_from:id_sub_line,
											id_to:parseInt(object.id),
											start_time:all_events[i].start_time,
										})
								CFbi.edges.push(line);
							}

							id_sub_line = null;
							break;

						}
					}

				}else if (subjects[s].set_events.length == 2){

					if (subjects[s].set_events[1].start_time !=  subjects[s].set_events[0].start_time){
						id_sub_line = subjects[s].set_events[0].id;
						line =  add_line({
											id_from:id_sub_line,
											id_to:parseInt(object.id),
											start_time:all_events[i].start_time,
										})
						CFbi.edges.push(line);
						id_sub_line = null;
					}
				}	
				
				break;
			}
		}

		if (id_sub_line != null && id_sub_line != "null" && id_sub_line != undefined && id_sub_line != "undefined"){
			line =  add_line({
						id_from:id_sub_line,
						id_to:parseInt(object.id),
						start_time:all_events[i].start_time,
					})
			CFbi.edges.push(line);
		}

	}

	function set_level_object(attr){
		if (!attr) return;
		
		if (attr.objects.length == 0){
			attr.cur_object.level = CFbi.nodes[CFbi.nodes.length-1].level;
		}else{
			if (attr.cur_object.start_time == attr.objects[attr.objects.length-1].start_time ){
				attr.cur_object.level = attr.objects[attr.objects.length-1].level;
			}else{
				attr.cur_object.level =  attr.objects[attr.objects.length-1].level;
				attr.cur_object.level++;
			}
		}
		
	}
	function add_line(attr){
		var json = {
			from: attr.id_from,
			to: attr.id_to, 
			widthSelectionMultiplier: 4 ,
			//label:attr.start_time || '',
		}
		return json;
	}
	function add_object(object_data){
		var json = {
			id: CFbi.nodes.length,
			level:2,//get_level
			shape: 'box', 
			title:'<div class="title-main">'+object_data.start_time+'</div>',//label
			group: "object", 
			label:object_data.semantic_id,//label
			start_time:object_data.start_time,
			event_id_db:object_data.event_id_db,
		}
		return json;
	}
	function add_subject(subject_data){
		var json = {
			id : CFbi.nodes.length,
			subject_id:subject_data.id,
			level : 1,//get_level
			image : CFbi.base_url + CFbi.image_subject[0],
			group :"subject",
			shape : 'image',
			title : subject_data.name,
			label : subject_data.name,
			set_events: [],
		};
		return json;
	}
	function get_events(data,mas){
		if (!data) return;
		for (var i in data.events){
			data.events[i].subject_name = data.subject;
			data.events[i].subject_id = data.subject_id;
			//data.events[i].event_id_db = data.event_id_db;
			mas.push(data.events[i]);
		}
	}

//data {where:'';is:''}
//param - параметр для сохранения
	function get_id_from_mas(mas,param,data){
		if (!mas || !data || !param) return null;
		var result = null;
		for (var i in mas){
			if (mas[i][data.where] == data.is){
				result = mas[i][param];
				break;
			}
		}
		return result;
	}
	CFbi.draw();
}
CFbi.draw = function(){
	if (!CFbi.div_panel) return;
	$('#'+CFbi.div_panel).css('height',$(window).height()-220);

		var data = {
				nodes: CFbi.nodes,
				edges: CFbi.edges
		};
		var container = document.getElementById(CFbi.div_panel);

		CFbi.network = new vis.Network(container, data, CFbi.options);
		CFbi.network.on("click",function(e){
			
			if (e.nodes.length != 0){
				for (var i in CFbi.nodes){
					if (e.nodes[0] == CFbi.nodes[i].id && CFbi.nodes[i].group == "object"){
						CFbi.window_situation(CFbi.nodes[i]);
						break;
					}
				}
			}else{
				CFbi.cur_ection = null;
				if (CFbi.message_info){
					CFbi.message_info.dialog("close");
					CFbi.message_info = null;
				}
				
			}
		})
}
/***************************************************************/
$( window ).resize(function() {
  $('#'+CFbi.div_panel).css('height',$(window).height()-220);
  CFbi.draw();
});
CFbi.open_situation = function(){
    if (!CFbi.situation_id) return;
    window.open( CFbi.base_url+'index.php/conframe_bi/situation/'+CFbi.situation_id)
}
CFbi.set_etl_schema_v2 = function(){
	var subject = null;
	var object = null;
	var all_events = [];
	var objects = [];
	var subjects = [];
	var line = [];
	var id_sub_line = null;
	for (var i in CFsbj){
		//проверять не зачем на совпадение субьектов, так как уже ранее события были распределны по субьектам
		get_events(jQuery.extend(true, {},  CFsbj[i]),all_events);
	
	}
	//var all_events =  all_events.sort(dynamicSort("start_time"));

	for (var i in all_events){
		//console.log(all_events[i])
		object = add_object(all_events[i]);//получили параметры обьекта
		CFbi.nodes.push(object);//
		if (CFbi.nodes.length>1){
			id_sub_line = CFbi.nodes[CFbi.nodes.length-2].id;//id предыдущего важно -2 так как -1 это текущий
			CFbi.nodes[CFbi.nodes.length-1].level = CFbi.nodes[CFbi.nodes.length-2].level;
			CFbi.nodes[CFbi.nodes.length-1].level++;
		}else{
			id_sub_line = null;//id = null знач линии не надо рисовать
		}
		objects.push(object);
		if (id_sub_line != null && id_sub_line != "null" && id_sub_line != undefined && id_sub_line != "undefined"){
			line =  add_line({
						id_from:id_sub_line,
						id_to:parseInt(object.id),
						start_time:all_events[i].start_time,
					})
			CFbi.edges.push(line);
		}
	}

	CFbi.draw();
	function add_line(attr){
		var json = {
			from: attr.id_from,
			to: attr.id_to, 
			widthSelectionMultiplier: 4 ,
			style:"arrow",
			//label:attr.start_time || '',
		}
		return json;
	}

	function add_object(object_data){

		var json = {
			id: CFbi.nodes.length,
			level:1,//get_level
			shape: 'box', 
			title:'<div class="title-main">'+object_data.semantic_id+'</div>',//label
			group: "object", 
			label:object_data.semantic_id.substr(0,10),//label // object_data.semantic_id
			start_time:object_data.start_time,
			event_id_db:object_data.event_id_db,
		}
		return json;
	}
		//str.substr(0, str.length - 8)
	
	function get_events(data,mas){
		if (!data || typeof(mas) != "object") return;

		for (var i in data.events){
			data.events[i].subject_name = data.subject;
			data.events[i].subject_id = data.subject_id;
			//data.events[i].event_id_db = data.event_id_db;
			mas.push(data.events[i]);
		}
	}

//data {where:'';is:''}
//param - параметр для сохранения
	function get_id_from_mas(mas,param,data){
		if (!mas || !data || !param) return null;
		var result = null;
		for (var i in mas){
			if (mas[i][data.where] == data.is){
				result = mas[ i ][ param ];
				break;
			}
		}
		return result;
	}
}

CFbi.get_icon = function(type){
    var html = '<span class="';
    if (!type){
        html+='glyphicon glyphicon-envelope';
        html+='">';
    }else if (type == 'beeline'){
        html+='beeline">Б';
    }else if (type == 'megafon'){
        html+='megafon">М';
    }else{
        html+='">';
    }
    html+='</span>';
    return html;
}