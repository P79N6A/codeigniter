
var CFsbj = [
	/*{ 
		id:101,
		name:"staff1",
	},
	{ 
		id:102,
		name:"staff2",
	},
 	{ 
		id:103,
		name:"staff3",
	},
	 { 
		id:104,
		name:"staff4",
	},
	{ 
		id:105,
		name:"staff5",
	},
	{ 
		id:106,
		name:"staff6",
	},
	*/
];


var  CFbi = { 
		connecting_selection :[],//последние два элемента
		network:null,
		ajax_conframe_bi : {},//все конфреймы при нажатии открыть //edit
		event: null,//убрать, исп в view где все event
		message_info: null,//диалоговое окно
		
		//coordX:0,//координаты для диалогового окна
		//coordY:0,//координаты для диалогового окна
		base_url: null,
		step_level:1,//сколько между элементами шагов
		type_viewer : [
		{
			type:"TIME_GROUP",
			text_id:"txt_viewer_v1",
		},
		{
			type:"STAIRS",
			text_id:"txt_viewer_v2",
		},
		{
			type:"STAIRS_V2",
			text_id:"txt_viewer_v3",
		},
		{
			type:"STAIRS_V3_NRP",
			text_id:"txt_viewer_v4",
		},
		{
			type:"STAIRS_V4_NRPL",
			text_id:"txt_viewer_v5",
		},
		],
		type_message:[
			{
				name : 'ОЖУР',
				color: 'green',
				width: 2,
				style_line: 'to',	
			},
			{
				name : 'СМС',
				color: 'darkblue',
				width: 2,
				style_line: 'to',	
			},
			{
				name : 'Почта',
				color: 'darkred',
				width: 2,
				style_line: 'to',	
			},
			{
				name : 'Телефон',
				color: 'darkblue',
				width: 2,
				style_line: 'dashes',	
			},

		],
	//	categories:{},//?
		default_color:{
			name : 'Без типа', 
			color: 'black',
			width: 2,
			style_line: 'to',
		},

		options :{
				
				groups: {
				    object: {
				    	font:{
				    		size:14,
				    		color:'black',
				    	},
				    	color:{	
				    		border: '#9F9E7E',
				    		background: '#EDEA09',
				    	},
				   },
				   action: {
				   		font:{
				    		size:14,
				    		color:'black',
				    	},
					    color: {
					    	border: '#9F9E7E',
					        background: '#7DB1FA',
					    }
					    
				   }
				  // add more groups here
				},


				//*disableStart :true,
				//*stabilize: true,
			
			   //* smoothCurves: false,
				//smoothCurves:{dynamic:false,type:"discrete"},
				layout: {

					hierarchical: {
							//enabled:true,
							direction: "LR",
							levelSeparation:250,
							//nodeSpacing:-800
							//ayout:"direction",
					},
					
				},

				nodes:{
					shadow:true,
					
				},
				
				edges:{
					smooth:false,
				}
				
				/*physics: { 
							barnesHut: {
									gravitationalConstant: -7000,
									centralGravity: 0.3, 
									springLength: 200, 
									springConstant: 0.02, 
									damping: 0.3
								
							},
							hierarchicalRepulsion: {
						          centralGravity: 0.5,
						          springLength: 150,
						          springConstant: 0.01,
						          damping: 0.3

						    }	
				     	}*/

			 
		},

		alert : new CFEAlert(""),
		nodes:  [],
		edges:  [],
		cur_ection : null,//элемент с которым открыто окно
		conframe_bi:{},//из бд которые созданны
		data_conframe_bi: null,//id div где описание события
		//name_create_event: null,//воообщем то не нужно
		subjects : [],//чубзики
		objects : [],//сообщения
	//	image_subject:  'img/conframe_bi/subject_group.png',
		image_subject:  ['img/conframe_bi/subject.png','img/conframe_bi/subject_group.png'],
		div_panel: null,
		group:"get_group",
		mode:"SINsGLE",//CLONE
		diff:100,
		old_add :null,//moment во view , предыдущий
		full_messages:[],//????
		
};

CFbi.get_events = function(set_event,viewer_type){
	if (!set_event || !viewer_type) return;

	var id_ev = $("#"+set_event).val();
	if (!event_data[id_ev] ){
		if (event_data[set_event]){
			id_ev = set_event;
		}else return;
	} 
	CFbi.run_viewer(event_data[id_ev].messages,viewer_type);
	
}

CFbi.run_viewer = function(CFevent,viewer_type){//просмотр событий с БД
	$('#'+CFbi.div_panel).css('height',screen.height-200);
		CFbi.clear_data();
		CFbi.draw();
		CFbi.event = CFevent;
		CFevent =  CFevent.sort(dynamicSort("start_time"));
		CFbi.get_interval(CFevent);
		for (var sob in CFevent){//соеденения
			if (viewer_type == CFbi.type_viewer[0].type)	CFbi.set_detal_message(CFevent[sob]);
		 	if (viewer_type == CFbi.type_viewer[1].type)	CFbi.set_viewer_sujects(CFevent[sob]);
		 	if (viewer_type == CFbi.type_viewer[2].type)	CFbi.set_viewer_sujects_v1(CFevent[sob]);
		 	if (viewer_type == CFbi.type_viewer[3].type)	CFbi.set_viewer_sujects_v3(CFevent[sob]);
		 	if (viewer_type == CFbi.type_viewer[4].type)	CFbi.set_viewer_sujects_v4(CFevent[sob]);

	 		//CFbi.set_detal_message(CFevent[sob]);
		}

		CFbi.init();
		CFbi.types_subjects();

	CFbi.draw();

}

CFbi.get_position = function(call_back){

	$.ajax({
		url:CFbi.base_url+'index.php/conframe_bi/get_position_ajax'
	}).done(function(response){
		//console.log(response);return;
		var json = JSON.parse(response);

		CFbi.set_cfsbj(json);
		if (call_back) call_back();
	})
}

CFbi.ge= function(id) {
	return document.getElementById(id); 
}

CFbi.create_modal = function(attr){
	if (!attr) return;
	HCModal.run(attr);
}
/*
	создает один субъект из опции - Правка -> добавить субъект;
	артем 
*/
CFbi.add_subject = function(html_id_label,type){
	if (!html_id_label && !type) {
		CFbi.get_position(function(){
			html_modal();
		})
		return;
	}

	if (type){
		var html = '<select style="float:left" id = "subject_one" class="form-control">;'
		for (var s in CFsbj){
			if (CFsbj[s].type_pers == type && CFsbj[s].name) html+='<option value="'+CFsbj[s].id+'">'+CFsbj[s].name+'</option>';
		}
		html+='</select>';
		$('#show_selected').html(html);
		$('.modal-footer').html('<button type="button" onclick = "CFbi.add_subject(\'subject_one\');" class="btn btn-success">Применить</button>')
		return;
	}
	function html_modal(){
		var attr ={};
		attr.title  = 'Свойства';
	/******************/
		attr.body='<div class="btn-group btn-group-justified"  role="group" >'
  					attr.body+='<div  class="btn-group" role="group">	<button type="button" class="btn btn-default" onclick = "CFbi.add_subject(\'\',\'positions\')">Должности</button></div>'
 			 		attr.body+='<div  class="btn-group" role="group">	<button type="button" class="btn btn-default" onclick = "CFbi.add_subject(\'\',\'physical_persons\')">ФИО</button></div>'
					attr.body+='</div>'
					attr.body+='<div id="show_selected"></div>'
	/*******************/
		attr.body+='<div style="clear:both"></div>';
		attr.footer = ' ';
		CFbi.create_modal(attr);
	}

	var id_subject = $('#'+html_id_label).val();
	var id = 1;
	if (CFbi.nodes.length>0) id = CFbi.nodes[CFbi.nodes.length-1].id;
	id++;
	var level = 0;
	if (CFbi.subjects[id_subject]){
		var count = CFbi.subjects[id_subject].length-1;
		level = CFbi.subjects[id_subject][count].level;
	}else{

		if (CFbi.nodes.length>0) level = CFbi.nodes[CFbi.nodes.length-1].level;
	}
	level++;
	var label = '';
	for (var s in CFsbj){
		if (CFsbj[s].id == id_subject){
			label = CFsbj[s].name;
			break;
		}
	}
	CFbi.add_sub({
					id:id,
					label:label,
					level:level,
					id_subject:id_subject,
				})
	CFbi.set_options_vis();
	CFbi.network.selectNodes([id]);
	HCModal.close_modal();
}

/*
	добовляется один объект действия, уровень береться +1 от последнего созданного
*/
CFbi.add_connecting_selection = function(id_node){
	if (CFbi.connecting_selection.length >= 2){
		pop_connection();
	}
	push_connecting(get_node(id_node));
	function get_node(id){
		var node = null;
		for (var i in CFbi.nodes){
			if (CFbi.nodes[i].id == id){
				node = CFbi.nodes[i];
			} 
		}
		return node;
	}

	function push_connecting(node){
		//if (node.group != "object")
		CFbi.connecting_selection.push(node);
	};

	function pop_connection(){
		CFbi.connecting_selection.splice(0,1);
	};
}

CFbi.set_connecting_selection = function(text){
	if (!text){
		return get_html_connecting();
	}
	if ($('#'+text).val() == '') return;
	function get_html_connecting(){
		var html = '';
		if (CFbi.connecting_selection.length>=2){
			html+='Выбранные два последний элемента : ';
			for (var i in CFbi.connecting_selection){
				html += CFbi.connecting_selection[i].label
				if (i < CFbi.connecting_selection.length-1){
					html +=' - > ';
				}
			}
			
		}
		return html;
	}

	var parametrs = {}
	parametrs.from = {};
	parametrs.message = {};
	parametrs.to = {};
		
	parametrs.from.id = CFbi.connecting_selection[0].id;
	parametrs.to.id= CFbi.connecting_selection[1].id;


	for(var s in CFbi.nodes){

		if (CFbi.nodes[s].id == parametrs.from.id ){

			parametrs.from.level = CFbi.nodes[s].level;
			parametrs.from.level++;
		}
	}
	var id_mes = CFbi.nodes[CFbi.nodes.length-1].id;
	id_mes++;
	var cont = CFbi.checked_id(id_mes);
	while (!cont){
		id_mes++;
		cont = CFbi.checked_id(id_mes);
	}


	CFbi.add_message({
			id:id_mes,//CFbi.nodes.length+1,
			level:parametrs.from.level,
			label:$('#'+text).val(),
		})

		
	CFbi.add_line({
		id_from:parametrs.from.id,
		id_to:id_mes,//CFbi.nodes.length,
	})
	CFbi.add_line({
		id_from:id_mes,
		id_to:parametrs.to.id,//CFbi.nodes.length,
	})
	CFbi.set_group_sub(parametrs.to.id);
	HCModal.close_modal();
//	CFbi.draw(); 

	CFbi.network.setData({nodes:CFbi.nodes,edges:CFbi.edges,options:CFbi.options});

	//network.selectNodes([id_mess]);
}
/*
получение инфы type_event
*/
CFbi.get_type_events = function(call_back){
	var data = {};
	$.ajax({
		url:CFbi.base_url + 'index.php/conframe_bi/get_type_events'
	}).done(function(response){
		if (response && call_back){
			call_back(JSON.parse(response));
		}
	});
}

/*****************************/
CFbi.add_object = function(html_id_label,type){
	var html_id = {
		id_select : 'id_type_events',
		text_obj:'text_obj',
	}
	if (!html_id_label){
		html_modal();
		return;
	}
	
	var id_mess = 0;
	var level = 0;
	
	if (CFbi.nodes.length>0){
		id_mess = CFbi.nodes[CFbi.nodes.length-1].id;// id потому что nodes
	//	level = CFbi.objects[CFbi.objects.length-1].level;
		level = CFbi.objects.length == 0 ? CFbi.nodes[CFbi.nodes.length-1].level : CFbi.objects[CFbi.objects.length-1].level;
	} 
	id_mess++;
	level++;
	var text = Sanitizer.escape($('#'+html_id_label).val());
	
	CFbi.add_message({
			id:id_mess,//CFbi.nodes.length+1,
			level:level,
			label:text,
			type_action:'MSG',
		})

	if (CFbi.network){//в случае если мы рисуем не  с нуля - нет необходимости все заново прорисовывать
		CFbi.network.setData({nodes:CFbi.nodes,edges:CFbi.edges,options:CFbi.options});
	}else{
		CFbi.draw();
	}

	CFbi.network.selectNodes([id_mess]);
	HCModal.close_modal();

	function html_modal(){
		var attr ={};
		attr.title  = 'Добавления действия (установлен будет по последнему уровню)';
		attr.body= '<label for="'+html_id.text_obj+'">Текст сообщения :<div id="'+html_id.id_select+'_div"></div></label> </br> <textarea id="'+html_id.text_obj+'" class="form-control" placeholder="Текст сообщения" rows=15></textarea></br>';
		attr.body+=connect();
		attr.footer = '<button type="button" onclick = "CFbi.add_object(\''+html_id.text_obj+'\');" class="btn btn-success">Применить</button>';//create_object
		CFbi.create_modal(attr);

		/*CFbi.get_type_events(function(data){
			set_select(data);
		})*/
	}
	/*function set_select(data){
		var html = '<select  class="form-control" id="'+html_id.id_select+'" style="float:left;width:83%">'
			html+='<option value=" "></option>';
			for (var i in data){
				html+='<option value="'+data[i].name+'">'+data[i].name+'</option>';
			}
			html+='</select><button class="btn btn-success"  onclick = "CFbi.add_text_selected(\''+html_id.id_select+'\',\''+html_id.text_obj+'\')"  style="float:left">Добавить</button>';			
			$('#'+html_id.id_select+'_div').html(html);
	}*/
	function connect(){
		var html = CFbi.set_connecting_selection();
		if (html != '' && html != null && html) html+='  <button class="btn btn-warning" onclick="CFbi.set_connecting_selection(\'text_obj\')">Соеденить</button>';
		return html;
	}
}
CFbi.add_text_selected = function(from_selected,to){
	$('#'+to).val( $('#'+to).val()+' '+$('#'+from_selected+' option:selected').val() );
	$("#"+from_selected+" option[value=' ']").prop("selected", true);
}
CFbi.add_object2 = function(html_id_label,type){
	var html_id = {
		id_select : 'id_type_events',
		text_obj:'text_obj',
	}
	if (!html_id_label){
		html_modal();
		return;
	}
	
	var id_mess = 0;
	var level = 0;
	
	if (CFbi.nodes.length>0){
		id_mess = CFbi.nodes[CFbi.nodes.length-1].id;// id потому что nodes
	//	level = CFbi.objects[CFbi.objects.length-1].level;
		level = CFbi.objects.length == 0 ? CFbi.nodes[CFbi.nodes.length-1].level : CFbi.objects[CFbi.objects.length-1].level;
	} 
	id_mess++;
	level++;
	var text = $('#'+html_id.id_select+' option:selected').val();
	
	CFbi.add_message({
			id:id_mess,//CFbi.nodes.length+1,
			level:level,
			label:text,
			type_action:'ACTION'
		})
	CFbi.draw();
	//CFbi.network.setData({nodes:CFbi.nodes,edges:CFbi.edges},false);
	CFbi.network.selectNodes([id_mess]);
	HCModal.close_modal();

	function html_modal(){
		var attr ={};
		attr.title  = 'Добавления события (установлен будет по последнему уровню)';
		attr.body= '<label for="'+html_id.id_select+'">Текст события :<div id="'+html_id.id_select+'_div"></div></label> </br> </br>';
		//attr.body+=connect();
		attr.footer = '<button type="button" onclick = "CFbi.add_object2(\''+html_id.id_select+'\');" class="btn btn-success">Применить</button>';//create_object
		CFbi.create_modal(attr);

		CFbi.get_type_events(function(data){
			set_select(data);
		})
	}
	function set_select(data){
		var html = '<select  class="form-control" id="'+html_id.id_select+'" style="float:left;width:83%">'
			html+='<option value=" "></option>';
			for (var i in data){
				html+='<option value="'+data[i].name+'">'+data[i].name+'</option>';
			}
			html+='</select>';			
			$('#'+html_id.id_select+'_div').html(html);
	}
	function connect(){
		var html = CFbi.set_connecting_selection();
		if (html != '' && html != null && html) html+='  <button class="btn btn-warning" onclick="CFbi.set_connecting_selection(\'text_obj\')">Соеденить</button>';
		return html;
	}
}
/*Создание детально сообщение from message to*/

CFbi.add_detal_message = function(subject_from,text,subject_to,type,from_to){
	
	var html_id = {
		id_select : 'id_type_events',
		text_obj:'text_obj',
	}

	if ((!subject_from || !text || !subject_to) && (!type || !from_to)){
		CFbi.get_position(function(){
			html_modal();
		})

		return;
	}

	if (type && from_to){

		var option = '';
		
		//создание from
		if (from_to == 'from'){
			set_from();
		}else{//to создание
			set_to();
		}

		if ($('#show_selected_from').html() != '' && $('#show_selected_to').html() != ''){
			$('.modal-footer').html('<button type="button" onclick = "CFbi.add_detal_message(\'subject_from_dm\',\'text_obj\',\'subject_to_dm\');" class="btn btn-success">Применить</button>');
		} 
		
		$('#subject_from_dm').change(function(){
			if ($('#subject_to_dm option:selected').val() == $('#subject_from_dm option:selected').val())
			set_to();
		})
		$('#subject_to_dm').change(function(){
			if ($('#subject_to_dm option:selected').val() == $('#subject_from_dm option:selected').val())
			set_from();
		})
		return;
	}

	function set_to(){
		var html = '<select style="float:left" id = "subject_to_dm" class="form-control">;'
		for (var s in CFsbj){
			if (CFsbj[s].type_pers == type && $('#subject_from_dm option:selected').val() != CFsbj[s].id && CFsbj[s].name){
				html+='<option value="'+CFsbj[s].id+'">'+CFsbj[s].name+'</option>';
			} 
		}
		html+='</select>';
		$('#show_selected_to').html(html);
	}

	function set_from(){
		var html = '<select style="float:left" id = "subject_from_dm" class="form-control">;'
		for (var s in CFsbj){
			if (CFsbj[s].type_pers == type && $('#subject_to_dm option:selected').val() != CFsbj[s].id && CFsbj[s].name){
				html+='<option value="'+CFsbj[s].id+'">'+CFsbj[s].name+'</option>';
			} 
		}
		html+='</select>';
	
		$('#show_selected_from').html(html);
	}


	function html_modal(){
		var attr = {};
		attr.title = 'Детальные свойства действия ( по должности )';
//<select style="width:50%; float:left" id = "subject_from_dm" class="form-control">
		attr.body = '<label style="float:left;padding-top:4px" for="subject_from_dm" >Имя (<b> от кого </b>): &nbsp </label>';
		
		/******************/
		attr.body+='<div class="btn-group btn-group-justified" role="group" >'
		attr.body+='	<div class="btn-group" role="group"><button type="button" class="btn btn-default" onclick = "CFbi.add_detal_message(\' \',\' \',\' \',\'positions\',\'from\')">Должности</button></div>'
 		attr.body+='	<div class="btn-group" role="group"><button type="button" class="btn btn-default" onclick = "CFbi.add_detal_message(\' \',\' \',\' \',\'physical_persons\',\'from\')">ФИО</button></div>'
		attr.body+='</div>'
		attr.body+='<div id="show_selected_from"></div><div style="clear:both"></div>'
		/*******************/

		attr.body+= '<label for="'+html_id.text_obj+'">Текст действия/сообщения :</label><div id="'+html_id.id_select+'_div"></div> </br> <textarea id="'+html_id.text_obj+'" class="form-control" placeholder="Текст действия/сообщения" row=10></textarea></br>';
		/****************************************************/
		attr.body+='<div style="clear:both"></div><label style="float:left;padding-top:4px" for="subject_to_dm" >Имя (<b> кому </b>): &nbsp </label>';
		/******************/
		attr.body+='<div class="btn-group btn-group-justified" role="group" >'
		attr.body+='	<div class="btn-group" role="group"><button type="button" class="btn btn-default" onclick = "CFbi.add_detal_message(\' \',\' \',\' \',\'positions\',\'to\')">Должности</button></div>'
 		attr.body+='	<div class="btn-group" role="group"><button type="button" class="btn btn-default" onclick = "CFbi.add_detal_message(\' \',\' \',\' \',\'physical_persons\',\'to\')">ФИО</button></div>'
		attr.body+='</div>'
		attr.body+='<div id="show_selected_to"></div><div style="clear:both"></div>';
		/********************/
		//attr.body+='<div id="selection_to"></div>';
		/****************************************************/
		attr.body+='<div style="clear:both"></div>';

		attr.footer = ' ' ;
		CFbi.create_modal(attr);

		//$('#selection_to').html(set_selector(CFsbj,'subject_to_dm'));
	/*	CFbi.get_type_events(function(data){
			set_select(data);
		})*/

	}
	function set_select(data){
		var html = '<select  class="form-control" id="'+html_id.id_select+'" style="float:left;width:83%">'
		html+='<option value=" "></option>';
		for (var i in data){
			html+='<option value="'+data[i].name+'">'+data[i].name+'</option>';
		}
		html+='</select><button class="btn btn-success"  onclick = "CFbi.add_text_selected(\''+html_id.id_select+'\',\''+html_id.text_obj+'\')"  style="float:left">Добавить</button>';			
		$('#'+html_id.id_select+'_div').html(html);
	}
	/*function set_selector (arg,set_id) {
		var html_s = '';
		html_s+='<select style="width:50%; float:left" id = "'+set_id+'" class="form-control">';
		
		for (var s in arg){
			if ($('#subject_from_dm option:selected').val() != arg[s].id)
			html_s+='<option value="'+arg[s].id+'">'+arg[s].name+'</option>';
		}
		html_s+=' </select >'
		return html_s; 
	}*/
	
	var parametrs = {}
	parametrs.from ={};
	parametrs.to = {};

	parametrs.message = Sanitizer.escape($('#'+text).val());
	parametrs.end_time = "";
	parametrs.from.id = parseInt($("#"+subject_from+' option:selected').val());
	parametrs.to.id = parseInt($("#"+subject_to+' option:selected').val());
	for(var s in CFsbj){
		if (CFsbj[s].id == parametrs.from.id ){
			parametrs.from.name = CFsbj[s].name;
		}
		if (CFsbj[s].id == parametrs.to.id) {
			parametrs.to.name = CFsbj[s].name;
		}
	}
	CFbi.set_detal_message(parametrs);
	HCModal.close_modal();
	CFbi.set_options_vis();
	
}
/******************ЧЕРЕЗ АТРИБУТЫ ATTR УНИВЕРСАЛЬНАЯ****************************************/
CFbi.add_sub = function(attr){
	var label = attr.label
	if (attr.type_message == "Почта"){
		label = 'САЦ РОССЕТИ';
	}
		var parametrs = {
			id : attr.id,
			level : attr.level,
			image : CFbi.base_url + CFbi.image_subject[0],
			group :"subject",
			shape : 'image',
			title : attr.label,
			label : label,
			id_subject : attr.id_subject,
		};
		CFbi.nodes.push(parametrs);

		CFbi.add_mass(CFbi.subjects,attr.id_subject,parametrs);
		CFbi.types_subjects();
}
/*
CFbi.get_group_sub = function(id){
	
	var level = null;
	var double_subject = false;
	for (var i in CFbi.subjects[id]){
		level = CFbi.subjects[id][i].level;
		
		double_subject = get_double_level(level,i);
		if (double_subject) CFbi.set_group_sub(i);
	}

	function get_double_level (level,not_id_subj){
		var dbl = false;
		for (var s in CFbi.subjects){
		
			if (s!=not_id_subj){
				if (CFbi.subjects[s].level == level){
					dbl = true;
					break;
				}
			}
		}
		return dbl;
	}
}
*/
CFbi.set_group_sub = function(id_subject){
	var edges_subject = get_group(id_subject);
	if (edges_subject.length>1){
		set_image(id_subject);
	}

	function get_group(id){//id subject
		var edg = [];
		for (var i in CFbi.edges){
			if (CFbi.edges[i].to == id){
				edg.push(CFbi.edges[i]);
			}
		}
		return edg;
	}

	function set_image (id){//id subject
		for (var i in CFbi.nodes){
			if (CFbi.nodes[i].id == id){
				CFbi.nodes[i].image = CFbi.base_url+CFbi.image_subject[1];
				break;
			}
		}
		CFbi.network.setData({nodes:CFbi.nodes,edges:CFbi.edges},false)
	}
	
}

CFbi.unset_group_sub = function(id_subject){
	for (var i in CFbi.nodes){
		if (CFbi.nodes[i].id == id_subject){
			CFbi.nodes[i].image = CFbi.base_url+CFbi.image_subject[0];
			break;
		}
	}
	CFbi.network.setData({nodes:CFbi.nodes,edges:CFbi.edges},false)
}

/*
	пройдется по линиям и выявит to - нужно ли там что то менять
	елси группа - true | иначе false
	Артем
*/
CFbi.change_subject_group = function(edges_guids,id_from){
	if (!edges_guids) return;

	var ch_subject = null;
	var count_edges = 0;
	for (var i in edges_guids){
		for (var j in CFbi.edges){
			if (edges_guids[i] == CFbi.edges[j].id && CFbi.edges[j].to != id_from){

				ch_subject = get_subject(CFbi.edges[j].to);
				if (ch_subject) count_edges++;
			}	
		}
	}

	function get_subject (id){
		var sub = null;
		for (var i in CFbi.nodes){
			if (CFbi.nodes[i].id == id){
				sub = CFbi.nodes[i];
				break;
			}
		}
		return sub;
	}
	if (!ch_subject) return;
	if (count_edges>1) {
		CFbi.set_group_sub(ch_subject.id);
	}else{
		CFbi.unset_group_sub(ch_subject.id);
	}
	
}

/*
	Функция для добавления "условия"
	@param attr = id,level,label - передаются при загрузке страницы
	default id,level,label - сам создает , при создании данного объекта
	функцию CFbi.draw() - необходимо вызывать только при создании объекта(не при загрузке страницы, так как там свой draw есть, соотственно этот будет лишним)
	Артем
*/
CFbi.add_condition = function(attr){
	if (!attr) attr = {};
	var old_params = {
		id : 0 ,
		level : 1,
	}
	var param = {
		id:attr.id || get_id_for_nodes().id,
		level:attr.level || get_id_for_nodes().level,
		label: attr.label || ' ',
	}
	var parametrs = {
		id:param.id,
		level:param.level,
		shape:'diamond',
		label:param.label,
		type_action:'CONDITION',
	}
	function get_id_for_nodes(){
	
		if (CFbi.nodes[CFbi.nodes.length-1]){
			old_params.id = CFbi.nodes[CFbi.nodes.length-1].id;
			old_params.level = CFbi.nodes[CFbi.nodes.length-1].level;
			old_params.id++;
			old_params.level++;
		}
		return old_params;
	}

	CFbi.nodes.push(jQuery.extend(true, {}, parametrs));
	CFbi.add_mass_obj(CFbi.objects,parametrs);
	if (!attr.id) CFbi.draw();
}

/*
	Функция добавления сообщения
	@param attr = id , level, type_action, label, type_message, start_time,
	В объект заноситься только сокращенное название для вывода, в title и при нажатии диалогового окна - полный текст
		который берется из CFbi.full_message - это не обходимо для корректного вывода схемы

*/
CFbi.add_message = function(attr){
	var sub_label = CFbi.sub_string(attr.label);

	var  parametrs = {
		id: attr.id, 
		level:attr.level,  
		shape: 'box', 
		title:'<div class="title-main">'+attr.label+'</div>', 
		group: attr.type_action == "ACTION" ? "action" : 'object',
		label:sub_label,
		start_time:attr.start_time,
		type_message:attr.type_message,
		type_action:attr.type_action || "MSG",
	}
	CFbi.nodes.push(jQuery.extend(true, {}, parametrs));
	parametrs.label = attr.label;
	CFbi.add_mass_obj(CFbi.objects,parametrs);
}

/*
	Функция получения параметров линии
	@param attr = id_from, id_to
	Получение значений цвета , тип линий и др, из параметров CFbi (см. вверху)
	Артем
*/
CFbi.get_parametrs_line = function(attr){
	var json_color = null;
	for (var i in CFbi.nodes){
		if (CFbi.nodes[i].id == attr.id_from){
			json_color = get_type_message(CFbi.nodes[i]);
		}
	}
	for (var i in CFbi.nodes){
		if (CFbi.nodes[i].id == attr.id_to){
			if (CFbi.nodes[i].type_message && CFbi.nodes[i].type_message!= ''){
				json_color = get_type_message(CFbi.nodes[i]);
			}
		}
	}

	function  get_type_message(node){
		var color = {};
		if (!node.type_message || node.type_message == '') {
			color = CFbi.default_color;
		
			return color;
		}
		for (var i in CFbi.type_message){
			if (CFbi.type_message[i].name == node.type_message){

				color = CFbi.type_message[i];
				
				return color;
			}
		}
	//	console.log(color);
		if (!color.color) color = CFbi.default_color;
		return color;
	}

	return json_color;
}

CFbi.add_line = function(attr){
	var pl = null;
	for (var i in CFbi.nodes){
		if (CFbi.nodes[i].id == attr.id_from){
			pl = CFbi.get_parametrs_line(attr);
			pl.start_time = CFbi.nodes[i].start_time;//message
		}
	}
	
	parametrs = {
		from: attr.id_from,
		to: attr.id_to, 
		//style: pl.style_line,
		arrows: pl.style_line != "dashes" ? pl.style_line : 'to',
		dashes: pl.style_line == "dashes" ? true : false,
		color:pl.color ,
		widthSelectionMultiplier: 4 ,
		label: attr.label || pl.start_time || '',
	}
	CFbi.edges.push(parametrs);
}
/********************************************************************/

CFbi.set_detal_message = function(attr){
	var id_subject_from = attr.from.id;
	var id_subject_to = attr.to.id;
	var level = 1;
	var label_from = attr.from.name;
	var label_to = attr.to.name;
	var text = attr.message;//attr.message.substr(0,10);
	var add_from = true;
	var add_to = true;
	var add_message = true;

	
		if (!CFbi.subjects[id_subject_from] && CFbi.mode == "SINGLE") {
			/*from*/
			/* CFbi.add_sub({
					id:CFbi.nodes.length+1,
					label:label_to,
					level:level,
				})*/
		}else {
				if (CFbi.mode == "SINGLE"){
					var id_create_from = CFbi.subjects[id_subject_from][0].id;
					level =CFbi.subjects[id_subject_from][0].level;
				}else{
				
					if (CFbi.subjects[attr.from.id]){
						add_from = false;
						var count = CFbi.subjects[attr.from.id].length-1;
						level=CFbi.subjects[attr.from.id][count].level;
					}
				}
					 
		}
 /************************не atl*********************************/
	/**********************from*******************************/

		var id_from = 0;
		if (CFbi.nodes[CFbi.nodes.length-1]){
			id_from = CFbi.nodes[CFbi.nodes.length-1].id;
			id_from++;
		}

		if (add_from){
			CFbi.add_sub({
					id:id_from,//CFbi.nodes.length+1,
					label:label_from,
					level:level,
					id_subject:attr.from.id,
			})
	
		}
			

	/**********************message*******************************/
	//	level++;
		level = level + CFbi.step_level;
		//id_message = 1;
		if (CFbi.nodes[CFbi.nodes.length-1]){
			id_mess = CFbi.nodes[CFbi.nodes.length-1].id;
			id_mess++;
		}
		CFbi.add_message({
			id:id_mess,//CFbi.nodes.length+1,
			level:level,
			label:text,
			type_message:attr.type_message,
		//	id_message:attr.id,
		})
		if (add_from){
			CFbi.add_line({
				id_from:id_from,
				id_to:id_mess,//CFbi.nodes.length,
			})
		}else{
			CFbi.add_line({
				id_from:CFbi.subjects[attr.from.id][count].id,
				id_to:id_mess,//CFbi.nodes.length,
			})
		}
		
	 /**********************TO*******************************/
	//	level++;
		level = level + CFbi.step_level;
		if (CFbi.nodes[CFbi.nodes.length-1]){
			id_to_temp = CFbi.nodes[CFbi.nodes.length-1].id;
			id_to_temp++;

			if (CFbi.subjects[attr.to.id]){
				
				var count = CFbi.subjects[attr.to.id].length-1;
				for (var s in CFbi.subjects[attr.to.id]){
				
					if (level ==CFbi.subjects[attr.to.id][s].level ){
						add_to = false;
						id_to_temp = CFbi.subjects[attr.to.id][s].id;
						break;
					}
				}
			}

		}
		
			if (add_to){
				CFbi.add_sub({
					id:id_to_temp,//CFbi.nodes.length+1,
					label:label_to,
					level:level,
					id_subject:attr.to.id,
					type_message:attr.type_message,
				})
			}else{

				CFbi.set_group_sub(id_to_temp);
			}
				
		/**********************Соединение*******************************/
				

		CFbi.add_line({
			id_from:id_mess,//CFbi.nodes.length-1,
			id_to:id_to_temp,//CFbi.nodes.length,
		})


}
/************************/


CFbi.add_mass = function(mass,id,parametrs){
	if (!mass || !id) return;
	if (!mass[id]) mass[id] = [];
	mass[id].push(parametrs);
}

CFbi.add_mass_obj = function(mass,parametrs){
	if (!mass || !parametrs) return;
	mass.push(parametrs);
	CFbi.full_messages[parametrs.id] = parametrs;
}


CFbi.create_edge = function(from,to,label){
	if (!from || !to || !label) return;
	var parametrs = {from: $('#'+from).val(), to: $('#'+to).val(), style: 'arrow', label: $('#'+label).val()}//label:"СМС4"
	CFbi.edges.push(parametrs);
		HCModal.close_modal();
		CFbi.draw();
}

CFbi.draw = function(){
	if (!CFbi.div_panel) return;
	var data = {
				nodes: CFbi.nodes,
				edges: CFbi.edges
		};
	var container = document.getElementById(CFbi.div_panel);
	
	CFbi.network = new vis.Network(container, data, CFbi.options);
	CFbi.network.on("click",function(e){
		
		if (e.nodes.length != 0){
			CFbi.add_connecting_selection(e.nodes);
			CFbi.open_dialog(e.nodes,e.edges)//CFbi.event,CFbi.full_messages[id].id_message
			return;
		}else if (e.edges.length == 1){
			CFbi.open_dialog_edges(e.edges)
		}else{
			CFbi.cur_ection = null;
			if (CFbi.message_info){
				CFbi.message_info.dialog("close");
				CFbi.message_info = null;
			}
		}
	})
	$('canvas').attr('id',"svg")
}
CFbi.open_dialog_edges = function(edges_guids){
        //console.log(CFbi);
	CFbi.message_info = CFUtil.dialog.create("message_info",
	{
			title: '&nbsp;Информация',
			width: 500,
			resizable: false,
			position:"right top",//[CFbi.coordX+20,CFbi.coordY+20]
	});
	var data ={};
	if (CFbi.message_info){
		for (var i in CFbi.edges){
			if (CFbi.edges[i].id == edges_guids[0]){
				
				for (var el in CFbi.nodes){
					if (CFbi.nodes[el].id == CFbi.edges[i].from){
						data.from = CFbi.nodes[el];
					}else if (CFbi.nodes[el].id == CFbi.edges[i].to){
						data.to = CFbi.nodes[el];
					}
				}
				if ( CFbi.edges[i].from == CFbi.edges[i].to) data.to = data.from;
				break;
			}
		}
		//click arrow
		var html = '<table class="table table-bordered table-striped table-condensed" style="margin-bottom:0;font-size:12px;">';
								html += '<tbody>';
										html += '<tr>';
												html += '<td><b>От кого</b>'
												html+= '<span > <img src="'+CFbi.base_url+'img/conframe_bi/subject.png" height="15"></span>';
												html+='</td>';
												html += '<td>';
											//	if (data.from.id_subject)
												html+= data.from.id_subject ? data.from.label : '';
											//	html+=data.from.label;
												html +='</td>';
										html += '</tr>';
										html += '<tr>';
												html += '<td><b>Кому</b>'
												html+= '<span > <img src="'+CFbi.base_url+'img/conframe_bi/subject.png" height="15"></span>';
												html+='</td>';
												html += '<td>';
												html+= data.to.id_subject ? data.to.label : '';
												html +='</td>';
										html += '</tr>';
                                        html += '<tr>';
												html += '<td><b>Время перехода между событиями </b>'
												html+='</td>';
												html += '<td>';
												html+='<input type="text" id="label_per" class=" form-control input-sm" style="float:left;" value="'+CFbi.edges[i].label+'"> </input>';
											//	html+='<button class="btn btn-success btn-sm" style="float:left;"  onclick="CFbi.set_label(\''+edges_guids[0]+'\')"><span class="glyphicon glyphicon-ok"></span></button>'
												html +='</td>';
										html += '</tr>';
									//	html += CFbi.get_yes_no_html(CFbi.edges[i],data.from);//зачем епта
										html += '<tr>';
												html += '<td><b>Опции</b></td>';
												html+='<td>';
												html+='<button class="btn btn-success btn-sm" style="float:left;"  onclick="CFbi.set_label(\''+edges_guids[0]+'\')"><span class="glyphicon glyphicon-ok"></span>Применить</button>'
												html+='<button class="btn btn-danger btn-sm" onclick="CFbi.delete_edge(\''+edges_guids[0]+'\')">Удалить связь</button>'
												html+='</td>';
										html += '</tr>';
								html += '</tbody>';
						html += '</table>';
		// html='<button class="btn btn-danger btn-sm" onclick="CFbi.delete_edge(\''+edges_guids[0]+'\')">Удалить линию</button>';
		$(CFbi.message_info).html(html);
	}
}

/*
	@param id_line - ид линии из CFbi.edges 
	label == либо периоду между событиями, либо "да/нет" - в случае если у линии from node == условие(condition) ;
	данное условияе появляется только у линии у котороых from node == условие(condition)
	Артем
*/
CFbi.set_label = function(id_line){
	for (var i in CFbi.edges){
			if (CFbi.edges[i].id == id_line){
				CFbi.edges[i].label = ($('#yes_no_condition')[0] != undefined && $('#yes_no_condition option:selected').val() != '')  ? $('#yes_no_condition option:selected').val() : $('#label_per').val();
				CFbi.network.setData({nodes:CFbi.nodes,edges:CFbi.edges},false);		
				if (CFbi.cur_ection && CFbi.cur_ection.nodes)	CFbi.network.selectNodes([CFbi.cur_ection.nodes.id]);		
				break;
			}
		}
}
CFbi.delete_edge = function(edges_guid){
	for (var i in CFbi.edges){
		if (CFbi.edges[i].id == edges_guid){
			CFbi.edges.splice(i,1) ;
			CFbi.message_info.dialog("close");
			CFbi.message_info = null;
			CFbi.draw();
			return;
		}
	}
}
CFbi.change_in_dialog_pers = function(type){
	var html = '<select style="width:85%; float:left" id = "subject_dialog" class="form-control">;'
	for (var s in CFsbj){
		if (CFsbj[s].type_pers == type && CFsbj[s].name) html+='<option value="'+CFsbj[s].id+'">'+CFsbj[s].name+'</option>';
	}
	html+='</select>';
	$('#show_selected_name').html(html);
	$('#applay_name_pers').html('<button class="btn btn-default" onclick="CFbi.change_subject(\'subject_dialog\')"><span class="glyphicon glyphicon-ok" style="color:green" ></span></button>');
	//$('.modal-footer').html('<button type="button" onclick = "CFbi.add_subject(\'subject_one\');" class="btn btn-success">Применить</button>')
	return;
}

CFbi.open_dialog = function(nodes_id,edges_guids){

//console.log(nodes,edges);
		CFbi.message_info = CFUtil.dialog.create("message_info",
		{
				title: '&nbsp;Информация',
				width: 500,
				resizable: false,
				position:"right top",//[CFbi.coordX+20,CFbi.coordY+20]
		});
		if (CFbi.message_info){
			//nodes_id = nodes_id++;
			for (var nod in CFbi.nodes){
				if (CFbi.nodes[nod].id == nodes_id){
					var data_nodes = CFbi.nodes[nod];
					break;
				}
			}
			var connect_edges = [];
			for (var ed in CFbi.edges){//найти ид по которым можно будет найти в nodes
			
				for (var g_ed in edges_guids){
					if (CFbi.edges[ed].id == edges_guids[g_ed]){
						connect_edges.push(CFbi.edges[ed]);
					}
				}
			}
			var connecting = connection(connect_edges,data_nodes);
			function connection(edges,node){
				var json_to_from = {}
				json_to_from.html_to = '';
				json_to_from.html_from = '';
				var to = []
				var data = null;
				for (var i in edges){
					if (edges[i].from != node.id){
						data = get_to_from_node(edges[i].from); 
						json_to_from.html_from = data.label;
					}
					if (edges[i].to != node.id){
						data = get_to_from_node(edges[i].to);
						to.push(data.label);
					}
				}
				for (var t in to){
					json_to_from.html_to+=to[t];
					if (t != to.length-1) json_to_from.html_to += ', ';
				}
				function get_to_from_node(id){
					var subject = null;
					for (var s in CFbi.nodes){
						if (CFbi.nodes[s].id == id){
							subject = CFbi.nodes[s];
							break;
						}
					}
				return subject;
				}
				return json_to_from;
			}

			if (data_nodes){
				
				CFbi.cur_ection = null;//чтоб от предыдущего ни чего не осталось;
				CFbi.cur_ection  = {};
				CFbi.cur_ection.nodes = data_nodes;
				CFbi.cur_ection.edges_guids = edges_guids;
				if (data_nodes.group == "subject"){
					html = '<table class="table table-bordered table-striped table-condensed" style="margin-bottom:0;font-size:12px;">';
								html += '<tbody>';
										html += '<tr>';
												html += '<td><b>Имя субъекта('+data_nodes.level+')</b>'
												html+= '<span > <img src="'+CFbi.base_url+'img/conframe_bi/subject.png" height="15"></span>';
												html+='</td>';
												html += '<td>'
												html+= '<div id ="show_name_subject">'+ data_nodes.label + '</div>';
												CFbi.cur_ection.type_pers = null;
												
												html+='<div class="btn-group btn-group-justified" role="group" >'
							  					html+='	<div  class="btn-group" role="group" ><button type="button" class="btn btn-default" onclick = "CFbi.change_in_dialog_pers(\'positions\')">Должности</button></div>'
							 			 		html+='	<div  class="btn-group" role="group" ><button type="button" class="btn btn-default" onclick = "CFbi.change_in_dialog_pers(\'physical_persons\')">ФИО</button></div>'
												html+='</div>'
												html+='<div id="show_selected_name"></div>'
												
											
												html += '<div id="applay_name_pers"></div>';
											//	html +='<button class="btn btn-default" onclick="CFbi.change_subject(\'subject_dialog\')"><span class="glyphicon glyphicon-ok" style="color:green" ></span></button>';
												html +='</td>';
										html += '</tr>';

										html += '<tr>';
												html += '<td><b>Опции</b></td>';
												html += '<td><button type="button" onclick="CFbi.delete()" class="btn btn-danger">Удалить</button>';
												html += '<button type="button" onclick="CFbi.add_subj_to_mes()" class="btn btn-success"><span class="glyphicon glyphicon-plus"></span>Сообщение</button>';
												html += '&nbsp<button type="button" onclick="CFbi.change_level(\'left_down\')" class="btn btn-default"><span class="glyphicon glyphicon-chevron-left"></span></button>';
												html += '<button type="button" onclick="CFbi.change_level(\'right_up\')" class="btn btn-default"><span class="glyphicon glyphicon-chevron-right"></span></button>';
												html+='</td>';
										html += '</tr>';
								html += '</tbody>';
						html += '</table>';
								
				}else if (data_nodes.group == "object" || data_nodes.group == "action"){//object
					html = '<table class="table table-bordered table-striped table-condensed" style="margin-bottom:0;font-size:12px;">';
								html += '<tbody>';
										
										html += '<tr>';
												html += '<td><b>От кого</b></td>';
												html += '<td>'+connecting.html_from+' </td>';
										html += '</tr>';

										html += '<tr>';
												html += '<td><b>Событие</b></td>';
												html += '<td>'+CFbi.full_messages[data_nodes.id].label+' </td>';
										html += '</tr>';

										html += '<tr>';
												html += '<td><b>Кому</b></td>';
												html += '<td>'+connecting.html_to+' </td>';
										html += '</tr>';

										html += '<tr>';
												html += '<td><b>Дата/Время</b></td>';
												html += '<td> <input id="datetimepicker" class="form-control input-sm" style ="width:80%;float:left;padding:0px"  />'
												html += '<button class="btn btn-default" onclick="CFbi.set_date_time(\'datetimepicker\')"><span class="glyphicon glyphicon-ok" style="color:green;float:left"></span>&nbsp</button>'
												html+='</td>';
										html += '</tr>';

										html += '<tr>';
												html += '<td><b>Тип</b></td>';
												html += '<td>';//type_message
												html += '<select style="float:left;width:85%;padding:0px" id = "object_type" class="form-control input-sm">';
												if (data_nodes.type_message){
													html += '<option value="'+data_nodes.type_message+'">'+data_nodes.type_message+'</option>';
												} else {
													html += '<option value=""></option>';
												}
												for (var m in CFbi.type_message){
													if (data_nodes.type_message != CFbi.type_message[m].name)
													html += '<option value="'+CFbi.type_message[m].name+'">'+CFbi.type_message[m].name+'</option>';
												}
												html +=' </select>';
												html +='<button class="btn btn-default" onclick="CFbi.set_type_message(\'object_type\')"><span class="glyphicon glyphicon-ok" style="color:green" ></span></button>';
												html+='</td>';
										html += '</tr>';

										html += '<tr>';
												html += '<td><b>Опции</b></td>';
												html += '<td><button type="button" onclick="CFbi.delete()" class="btn btn-danger">Удалить</button>';
												html += '<button type="button" onclick="CFbi.change_message()" class="btn btn-warning">Изменить</button>';
												html += '<button type="button" onclick="CFbi.add_mes_to_subject()" class="btn btn-success"><span class="glyphicon glyphicon-plus"></span>К кому</button>';
												html += '&nbsp<button type="button" onclick="CFbi.change_level(\'left_down\')" class="btn btn-default"><span class="glyphicon glyphicon-chevron-left"></span></button>';
												html += '<button type="button" onclick="CFbi.change_level(\'right_up\')" class="btn btn-default"><span class="glyphicon glyphicon-chevron-right"></span></button>';
												html+='</td>';
										html += '</tr>';
								html += '</tbody>';
						html += '</table>';
				}else{//условие
					var html = '<table class="table table-bordered table-striped table-condensed" style="margin-bottom:0;font-size:12px;">';
										html += '<tr>';
												html += '<td><b>Тип</b></td>';
												html += '<td>Условие </td>';
										html += '</tr>';
										html += '<tr>';
												html += '<td><b>Опции</b></td>';
												html += '<td><button type="button" onclick="CFbi.delete()" class="btn btn-danger">Удалить</button>';
												html += '<button type="button" onclick="CFbi.change_condition()" class="btn btn-warning">Изменить</button>';
												html += '<button type="button" onclick="CFbi.add_subj_to_mes()" class="btn btn-success"><span class="glyphicon glyphicon-plus"></span>Сообщение</button>';
												html += '<button type="button" onclick="CFbi.add_mes_to_subject()" class="btn btn-success"><span class="glyphicon glyphicon-plus"></span>К кому</button>';
												html += '&nbsp<button type="button" onclick="CFbi.change_level(\'left_down\')" class="btn btn-default"><span class="glyphicon glyphicon-chevron-left"></span></button>';
												html += '<button type="button" onclick="CFbi.change_level(\'right_up\')" class="btn btn-default"><span class="glyphicon glyphicon-chevron-right"></span></button>';
												html+='</td>';
										html += '</tr>';
					html += '</table>';
				}
				var value = data_nodes.start_time;
				if (!value) value = '';
				$(CFbi.message_info).html(html);
				$('#datetimepicker').datetimepicker({
					value:value,
				  	format:'Y.m.d H:i',
				  	lang:'ru',
				});
				$('#datetimepicker').click(function(){
				 	$('#datetimepicker').datetimepicker('show'); //support hide,show and destroy command
				});
				$('.xdsoft_datetimepicker').css("z-index",99999999999);
			}
		}
}
CFbi.set_type_message = function(id_html_type){
	var type = $('#'+id_html_type+' option:selected').val();
	CFbi.cur_ection.nodes.type_message = type;
	var pl = null
	for (var i in CFbi.edges){
		for (var g in CFbi.cur_ection.edges_guids){
			if (CFbi.edges[i].id == CFbi.cur_ection.edges_guids[g]){
				pl = CFbi.get_parametrs_line({
					id_from:CFbi.edges[i].from,
					id_to:CFbi.edges[i].to,
				});
				CFbi.edges[i].color = pl.color;
				CFbi.edges[i].style = pl.style_line;
				CFbi.edges[i].dashes =  pl.style_line == "dashes" ? true : false;

			}
		}
	}
	CFbi.network.setData({nodes:CFbi.nodes,edges:CFbi.edges},false)
}
CFbi.set_date_time = function(id_html_time){
	var datetime = $('#'+id_html_time).val();
	CFbi.cur_ection.nodes.start_time = datetime;//пройтись по edges
	for (var edg in CFbi.edges){
		for (var cur_ed = 1; cur_ed < CFbi.cur_ection.edges_guids.length; cur_ed++){
			if (CFbi.cur_ection.edges_guids[ cur_ed ] == CFbi.edges[ edg ].id){
				CFbi.edges[ edg ].label = datetime;
			}
		}
	}
	CFbi.network.setData({nodes:CFbi.nodes,edges:CFbi.edges},false)
	CFbi.network.selectNodes([CFbi.cur_ection.nodes.id]);
}
/*
	Возможен баг с subjects and objects
*/
CFbi.change_level = function(level,type){
	if (!level ) return;
	
		if (level == "right_up"){
			CFbi.cur_ection.nodes.level++;
		}else if (level == "left_down"){
			CFbi.cur_ection.nodes.level--;
		}

	CFbi.draw();
	CFbi.network.selectNodes([CFbi.cur_ection.nodes.id])
}
/**********************************/
CFbi.change_subject = function(id_subject){//исправить
	var id = $('#'+id_subject+' option:selected').val();
	for (var i in CFsbj){
		if (CFsbj[i].id == id){
			delete_subject_from(id);
			$('#show_name_subject').html(CFsbj[i].name);
			CFbi.cur_ection.nodes["id_subject"] =  CFsbj[i].id;
			CFbi.cur_ection.nodes["title"] = CFsbj[i].name;
			CFbi.cur_ection.nodes["label"] =  CFsbj[i].name;
			add_subject_from(id);
			break;
		}
	}
	function delete_subject_from(id_subject){//ид субъекта который ставлю
		if (!CFbi.subjects[id_subject]) return;
		for (var s in CFbi.subjects[id_subject]){
			if (CFbi.subjects[id_subject][s].id == CFbi.cur_ection.nodes["id"]){
				CFbi.subjects[id_subject].splice(s,1);
				break;	
			}
		}
	}
	function add_subject_from(id_subject){
		if (!id_subject) return;
		CFbi.add_mass(CFbi.subjects,id_subject,CFbi.cur_ection.nodes);
	}

	CFbi.draw();
}

CFbi.add_subj_to_mes = function(id_message){
	var html_id = {
		id_select : 'id_type_events',
		text_obj:'subj_to_mes',
	}
	if (!id_message){
		CFbi.message_info.dialog("close");
		html_modal();
		return;
	}
	function html_modal(){
		var attr = {};
		attr.title = 'Наберите текст действия/сообщения';
		attr.body= '<div id="'+html_id.id_select+'_div"></div>';
		attr.body+='<textarea id="'+html_id.text_obj+'" class="form-control" placeholder="Текст действия/сообщения" rows="15">';
		attr.body+='</textarea>';
		attr.footer = '<button type="button" onclick="CFbi.add_subj_to_mes(\''+html_id.text_obj+'\')" class="btn btn-primary">Подвердить</button>';
		CFbi.create_modal(attr);

		CFbi.get_type_events(function(data){
			set_select(data);
		})

	}
	function set_select(data){
		var html = '<select  class="form-control" id="'+html_id.id_select+'" style="float:left;width:83%">'
		html+='<option value=" "></option>';
		for (var i in data){
			html+='<option value="'+data[i].name+'">'+data[i].name+'</option>';
		}
		html+='</select><button class="btn btn-success"  onclick = "CFbi.add_text_selected(\''+html_id.id_select+'\',\''+html_id.text_obj+'\')"  style="float:left">Добавить</button>';			
		$('#'+html_id.id_select+'_div').html(html);
	}
	
	var level = CFbi.cur_ection.nodes.level;
	//level++;
	level = level + CFbi.step_level;

	var set_to_mes = CFbi.nodes[CFbi.nodes.length-1].id;
	set_to_mes++;
	CFbi.add_message({
				id:set_to_mes,
				label:Sanitizer.escape($('#'+id_message).val()),
				level:level,
				//id_message:CFbi.cur_ection.nodes.id_subject,
			})
	CFbi.add_line({
			id_from:CFbi.cur_ection.nodes.id,//CFbi.nodes.length-1,
			id_to:set_to_mes,//CFbi.nodes.length,
		})

	
	HCModal.close_modal();

	CFbi.draw();
}

/*
	id_subject - то jq id после вызова html,
	если он пустой он вызовет html code для выбора субьекта;
	учесть тот факт с кем он УЖЕ связан
*/
CFbi.add_mes_to_subject = function(id_subject,type){//object
	if (!id_subject&& !type){
		CFbi.get_position(function(){
			html_modal();
		})
		
		CFbi.message_info.dialog("close");
		return;
	}
	if (type){
		var html = '<select style="float:left" id = "mes_to_sub" class="form-control">;'
		for (var s in CFsbj){
			if (CFsbj[s].type_pers == type && CFsbj[s].name) html+='<option value="'+CFsbj[s].id+'">'+CFsbj[s].name+'</option>';
		}
		html+='</select>';
		$('#show_selected').html(html);
		$('.modal-footer').html('<button type="button" onclick="CFbi.add_mes_to_subject(\'mes_to_sub\')" class="btn btn-primary">Выбрать</button>')
		return;
	}

	function html_modal(){
		var attr = {};
		attr.title = 'Выберите субъект';
		/*attr.body = '<select id = "mes_to_sub" class="form-control">';
		for (var s in CFsbj){
			attr.body+='<option value="'+CFsbj[s].id+'">'+CFsbj[s].name+'</option>';
		}
		attr.body+=' </select >';*/
		/******************///dr
		attr.body='<div class="btn-group btn-group-justified" role="group" >'
  					attr.body+='<div class="btn-group" role="group">	<button type="button" class="btn btn-default" onclick = "CFbi.add_mes_to_subject(\'\',\'positions\')">Должности</button></div>'
 			 		attr.body+='<div class="btn-group" role="group">	<button type="button" class="btn btn-default" onclick = "CFbi.add_mes_to_subject(\'\',\'physical_persons\')">ФИО</button></div>'
					attr.body+='</div>'
					attr.body+='<div id="show_selected"></div><div style="clear:both"></div>'
		/*******************/
		attr.footer = ' ';
		CFbi.create_modal(attr);
	}
	var id_db_subject = parseInt($("#"+id_subject+' option:selected').val());//120 к примеру, из бд ид
	for (var sub_db in CFsbj){//вытащим name
		if (CFsbj[sub_db].id == id_db_subject){
			var subject_db = CFsbj[sub_db];
			break;
		}
	}
	if (!subject_db) return; // или ошибку вывести
	add_subj = true;
	var level = CFbi.cur_ection.nodes.level;

	//level++;
	level = level + CFbi.step_level;
	var is_create_subject = CFbi.get_is_create_subject(subject_db.id);
	var to_id_subj = CFbi.nodes[CFbi.nodes.length-1].id;
	if (is_create_subject){//если уже был создан
		for (var s in CFbi.subjects[subject_db.id]){
			if (CFbi.subjects[subject_db.id][s].level == level){//нужно проверить есть ли на +1 лвле уже этот обьект
				add_subj = false;
				to_id_subj = CFbi.subjects[subject_db.id][s].id;//id из nodes
				HCModal.close_modal();
				//return;
			}
		}
	}
	
	if (add_subj){
	to_id_subj++;
	CFbi.add_sub({
					id:to_id_subj,
					label:subject_db.name,
					level:level,
					id_subject:subject_db.id||to_id_subj,
				})
	}else{
		CFbi.set_group_sub(to_id_subj);
	}
	

	CFbi.add_line({
			id_from:CFbi.cur_ection.nodes.id,//CFbi.nodes.length-1,
			id_to:to_id_subj,//CFbi.nodes.length,
		})
	CFbi.draw();
	HCModal.close_modal();
}

CFbi.get_is_create_subject = function(id_db){
	if (!id_db) return;
	if (CFbi.subjects[id_db]){//id взятый из БД
		return true;
	}else{
		return false;
	}
}

CFbi.change_condition = function(ch){
	if (!CFbi.cur_ection) return;
	var html_id = {
		text_obj : 'ch_condition',
	}
	if (CFbi.message_info) CFbi.message_info.dialog('close')
	if (!ch) {
		html();
		return;
	}
	function html(){
		var attr = {
			title:'Измените текст условия',
		};

		attr.body ='<textarea id="'+html_id.text_obj+'" class="form-control" placeholder="Текст условия" row=15>';
		attr.body+= CFbi.cur_ection.nodes.label;
		attr.body+='</textarea>';
		attr.footer='<button type="button" onclick="CFbi.change_condition(\''+html_id.text_obj+'\')" class="btn btn-primary">Применить изменения</button>';
		CFbi.create_modal(attr);
	}

	CFbi.cur_ection.nodes.label = Sanitizer.escape($('#'+html_id.text_obj).val());
	CFbi.network.setData({edges:CFbi.edges,nodes:CFbi.nodes,option:CFbi.options},false);
	HCModal.close_modal(); 


}
CFbi.change_message = function(type){
	if (!CFbi.cur_ection) return;
	CFbi.message_info.dialog("close");

	var html_id = {
		id_select : 'id_type_events',//select
		text_obj:'ch_mess',//textarea
	}//dr
	if (!type){//после нажатия диалогового окна
		
		if (CFbi.full_messages && CFbi.full_messages[CFbi.cur_ection.nodes.id].type_action && CFbi.full_messages[CFbi.cur_ection.nodes.id].type_action == "ACTION"){
			
			//изменения действия
			var attr = {};
			attr.title = "Измените текст действия/сообщения";
			attr.body= '<div id="'+html_id.id_select+'_div"></div><div style="clear:both"></div>';
			CFbi.get_type_events(function(data){
						set_select(data);
					})
			attr.footer='<button type="button" onclick="CFbi.change_message(\''+CFbi.full_messages[CFbi.cur_ection.nodes.id].type_action+'\')" class="btn btn-primary">Применить изменения</button>'
			CFbi.create_modal(attr);
			return;

		}else if (CFbi.full_messages && CFbi.full_messages[CFbi.cur_ection.nodes.id].type_action && CFbi.full_messages[CFbi.cur_ection.nodes.id].type_action == "MSG"){
			
			//изменение сообщения
			var attr = {};
			attr.title = "Измените текст действия/сообщения";
			
			attr.body ='<textarea id="'+html_id.text_obj+'" class="form-control" placeholder="Текст действия/сообщения" row=15>';
			attr.body+= CFbi.full_messages[CFbi.cur_ection.nodes.id].label;
			attr.body+='</textarea>';
			attr.footer='<button type="button" onclick="CFbi.change_message(\''+CFbi.full_messages[CFbi.cur_ection.nodes.id].type_action+'\')" class="btn btn-primary">Применить изменения</button>'
			CFbi.create_modal(attr);
			return;

		}

	}else{// применения изменений
		
		var message = type == "ACTION" ? $('#'+html_id.id_select+' option:selected').val() :  Sanitizer.escape($('#'+html_id.text_obj).val());
		if (!message) return;//ошибку

		for (var n in CFbi.nodes){
		
			if (CFbi.nodes[n].id == CFbi.cur_ection.nodes.id){
		
				CFbi.nodes[n].label = CFbi.sub_string(message);
				CFbi.nodes[n].title = message;
				CFbi.full_messages[CFbi.nodes[n].id].label = message;
				break;
		
			}
		}
		
		CFbi.draw();
		HCModal.close_modal(); 

	}

	function set_select(data){//лучше вместе так как id html тэгов необходимо использовать
		
		var html = '<select  class="form-control" id="'+html_id.id_select+'" style="float:left;width:83%">'
		html+='<option value="'+CFbi.full_messages[CFbi.cur_ection.nodes.id].label+'">'+CFbi.full_messages[CFbi.cur_ection.nodes.id].label+'</option>';
		
		for (var i in data){
			if (data[i].name != CFbi.full_messages[CFbi.cur_ection.nodes.id].label)
			html+='<option value="'+data[i].name+'">'+data[i].name+'</option>';
		}
	
		html+='</select>';			
		$('#'+html_id.id_select+'_div').html(html);
	
	}
	
}

/************************************/
CFbi.delete = function(){
	if (confirm("Удалить?")) {

		if (!CFbi.cur_ection) return; 
		
		for (var n in CFbi.nodes){//удаление из CFbi.nodes (список всех субъектов и сообщений)
			if (CFbi.nodes[n].id == CFbi.cur_ection.nodes.id){
				CFbi.nodes.splice(n,1);
				break;
			}
		}
		
		if (CFbi.subjects[CFbi.cur_ection.nodes.id_subject]){//удаление субъекта
			
			delete CFbi.subjects[CFbi.cur_ection.nodes.id_subject];

		} else{

			for (var o in CFbi.objects){//ищем собщение и удаляем
			
				if(CFbi.objects[o].id == CFbi.cur_ection.nodes.id){
			
					CFbi.objects.splice(o,1);
					break;
				}
			}  
			
			if (CFbi.cur_ection.edges_guids.length != 0) CFbi.change_subject_group(CFbi.cur_ection.edges_guids,CFbi.cur_ection.nodes.id);//возращает true/false 
			delete CFbi.full_messages[CFbi.cur_ection.nodes.id];
		}
		
		for (var i in CFbi.cur_ection.edges_guids){//удаление соединений между субъектом и других элементов
			
			for (var e in CFbi.edges){

				if (CFbi.edges[e].id == CFbi.cur_ection.edges_guids[i]){
			
					CFbi.edges.splice(e,1);
					break;
				}
			}	
		}
		CFbi.message_info.dialog("close");

		CFbi.draw();
		CFbi.types_subjects();
	} else {
		return;
	}
}


/*
	Открытие conframe_bi нами созданные через edit
*/
CFbi.open_confrem_bi = function(){
        window.open(CFbi.base_url  + 'index.php/conframe_bi/open/','_blank'); return false;
}

CFbi.open_confrem_bi_for_id = function(jq_id){//conframe_id jquery
	var conframe_id = $("#"+jq_id).val(); 
	if (!CFbi.ajax_conframe_bi[conframe_id]) return; //добавить ошибку error modal  о том что не существует такой conframe_bi
	window.history.pushState({},{}, CFbi.base_url+'index.php/conframe_bi/edit/'+conframe_id);
	var json = CFbi.ajax_conframe_bi[conframe_id];
	json.svg_json = JSON.parse(CFbi.ajax_conframe_bi[conframe_id]["svg_json"])
	json.conframe_id = CFbi.ajax_conframe_bi[conframe_id]["conframe_id"];
	HCModal.close_modal();
	CFbi.run(json);
}
/***********************/
CFbi.html_save_modal = function(html_body){
	var attr = {};
	attr.title  = 'Сохранение';
	attr.body = html_body;
	CFbi.create_modal(attr);
}
/***************************************************************************************/
CFbi.save_events = function(id_name_event){
	if (CFbi.conframe_bi.conframe_id){
	   	CFbi.update();
	}else{
		CFbi.save_as();
	}
}

CFbi.save_as = function(){
	var html = $.ajax({			
                url: CFbi.base_url+"index.php/qcore/ajax/load_form/conframe_bi/conframe",		
                type: "POST"			   
            }).done(function (response, textStatus, jqXHRб){

                var json = CFbi.get_json();
                CFbi.html_save_modal(response);
           		$('#create_date').val(moment().format('YYYY-MM-DD hh:mm:ss'))
           		$('#create_date').css("display",'none');

                $("#svg_json").html(JSON.stringify(json));

            });
}

CFbi.update = function(){
	var save_data = {};
        save_data.conframe_id = CFbi.conframe_bi.conframe_id;
        var json = CFbi.get_json();
        save_data.svg_json = JSON.stringify(json);

        req = $.ajax({			
            url: CFbi.base_url+"index.php/conframe_bi/conframe_bi/ajax_save",		
            type: "POST",	
            data:save_data	
        }).done(function (response, textStatus, jqXHRб){
            //svg_json = editor.get_json();   
            result = JSON.parse(response);
            //console.log(result);
            CFbi.show_alert(result.msg);
        });
}
/***************************************************************************************/

CFbi.new_conframe_bi = function(old_save){
	window.open(CFbi.base_url+'index.php/conframe_bi/edit');
}

CFbi.sub_string = function(str){
	if (!str) return ' ';
	if (str.length>20){
		str = str.substr(0,20)+"...";
	}
	return str;
}
CFbi.get_json = function(){
	var json = {};
	//json.name = CFbi.name_create_event;
	var nodes = jQuery.extend(true, [], CFbi.nodes);

	for (var i in nodes){
		if (nodes[i].group == "object"){ // или == object
			if (CFbi.full_messages[nodes[i].id]){
				nodes[i].label = CFbi.full_messages[nodes[i].id].label;
				nodes[i].title = nodes[i].label;
				
			} 
		}else{
			delete nodes[i].image;
			if (CFbi.full_messages[nodes[i].id] && CFbi.full_messages[nodes[i].id].label){
				nodes[i].title = nodes[i].label;
			}
		}
	}
	json.nodes = nodes;
	json.edges = CFbi.edges;
	
	json.options = CFbi.options;

	return json;
	//console.log(json);
}
/*
	svg_json parse
	conframe_id
*/
CFbi.run = function(json){
	if (!json) return;
	if (!json.svg_json.edges) return;
	if (!json.svg_json.nodes) return;
	
	CFbi.clear_data();

	CFbi.conframe_bi = jQuery.extend(true, {}, json);
	
	delete CFbi.conframe_bi.svg_json;
	CFbi.set_data_conframe_bi();
	if (json.svg_json.options){
		if (!json.svg_json.options.stabilize) CFbi.options = json.svg_json.options;//чтоб старые загружались
		
		//
	}
	for (var n in json.svg_json.nodes){//сообщения объекты и тд

		if (json.svg_json.nodes[n].group == "subject"){
			CFbi.add_sub({
					id:json.svg_json.nodes[n].id,
					label:json.svg_json.nodes[n].label,
					level:json.svg_json.nodes[n].level,
					id_subject:json.svg_json.nodes[n].id_subject||json.svg_json.nodes[n].id,
				})
		}else if (json.svg_json.nodes[n].group == "object" || json.svg_json.nodes[n].group == "action"){
			
			CFbi.add_message({
				id:json.svg_json.nodes[n].id,
				label:json.svg_json.nodes[n].label,
				level:json.svg_json.nodes[n].level,
				start_time:json.svg_json.nodes[n].start_time,
				type_message:json.svg_json.nodes[n].type_message,
				type_action:json.svg_json.nodes[n].type_action,
			//	id_message:json.svg_json.nodes[n].id_subject||json.svg_json.nodes[n].i,
			})
		}else{

			CFbi.add_condition({
				id:json.svg_json.nodes[n].id,
				label:json.svg_json.nodes[n].label,
				level:json.svg_json.nodes[n].level,
			})
		}
		
	}
//	CFbi.edges = json.svg_json.edges;
//if (json.svg_json.options) CFbi.options = json.svg_json.options;
//

	for (var i in json.svg_json.edges){

		CFbi.add_line({
			id_from:json.svg_json.edges[i].from,
			id_to:json.svg_json.edges[i].to,
			label:json.svg_json.edges[i].label
		});

	}

	CFbi.types_subjects();
	

	CFbi.draw();

	for (var n in json.svg_json.nodes){//сообщения объекты и тд
		if (json.svg_json.nodes[n].group == "subject"){
			CFbi.set_group_sub( json.svg_json.nodes[n].id )
		}
	}

}
/*
	установка cfbj объекты
*/
CFbi.set_cfsbj = function(personal){
	CFsbj = [];

	for (var p in personal){
		CFsbj.push(personal[p]);
	}
}
CFbi.clear_data = function(){
	CFbi.message_info = null;
	CFbi.nodes=  [];
	CFbi.edges=  [];
	CFbi.subjects = [];//чубзики
	CFbi.objects = [];//сообщения
	CFbi.full_messages=[];
	CFbi.old_add =null;
}
CFbi.show_alert = function(text){
	CFbi.alert.set_message(text);
    CFbi.alert.show_message();
}
CFbi.alert_save = function(){
	HCModal.close_modal();
/*	CFbi.alert.set_message("Сохранено");
    CFbi.alert.show_message();*/
}
CFbi.set_data_conframe_bi = function(){
	if (!CFbi.conframe_bi) return;
	var html = '';
	html+= '<label>Ситуация : '+CFbi.conframe_bi.name+'</label></br>';
	html+= '<label>Автор : '+CFbi.conframe_bi.create_user+'</label></br>';
	html+= '<label>Создан : '+CFbi.conframe_bi.create_date+'</label></br>';
	if (CFbi.conframe_bi.description) html+= '<label>Описание : '+CFbi.conframe_bi.description+'</label>';
	$('#'+CFbi.data_conframe_bi).html(html);
}

/***************************/
CFbi.change_data_conrame_bi = function(applay){
	var id_jq = {
		id_jq_name : 'id_name_cb',
		id_jq_description: 'id_desc_cb',
		id_jq_type_line : 'id_type_line_cb',
		id_jq_level_separation : 'level_separation',
	}
	if (!applay){
		html_create_modal();
		return;
	}

	function html_create_modal(){
		var attr = {};
		attr.title = 'Опции';
		attr.body = '<label for="'+id_jq.id_jq_name+'">Название</label><input id = "'+id_jq.id_jq_name+'" class="form-control" value="'
		if (CFbi.conframe_bi.name) attr.body+=CFbi.conframe_bi.name;
		attr.body+='"/>';
		attr.body+= '<label for="'+id_jq.id_jq_description+'">Описание</label><textarea id= "'+id_jq.id_jq_description+'" class="form-control" placeholder="Добавьте текст" rows="15">';
		if (CFbi.conframe_bi.description) attr.body+=CFbi.conframe_bi.description;
		attr.body+='</textarea>';
		attr.body+= '<label for="'+id_jq.id_jq_type_line+'">Тип линии между элементами</label>';
		attr.body+='<select id="'+id_jq.id_jq_type_line+'" class="form-control">';
		
		if (!CFbi.options.edges.smooth.enabled){//стандартное значение smooth
			attr.body+='<option value="none">Прямая</option>';
			attr.body+='<option value="diagonalCross">Загнутая</option>';
		}else{
			attr.body+='<option value="diagonalCross">Загнутая</option>';
			attr.body+='<option value="none">Прямая</option>';
		}

		attr.body+='</select>';
		attr.body+= '<label style="float:left">Расстояние между элементами</label><input id="'+id_jq.id_jq_level_separation+'" value="'+CFbi.options.layout.hierarchical.levelSeparation+'" class="form-control input-sm" step=50 style ="padding:0px"  type="number" />';
		attr.body+='<div style="clear:both"></div>'
		attr.footer = '<button class="btn btn-success" onclick="CFbi.change_data_conrame_bi(\'applay\')">Применить изменения</button>';
		CFbi.create_modal(attr);
	}

	var json = {};
	json.conframe_id = CFbi.conframe_bi.conframe_id;
	json.name = Sanitizer.escape($('#'+id_jq.id_jq_name).val());
	json.description = Sanitizer.escape($('#'+id_jq.id_jq_description).val());
	CFbi.options.layout.hierarchical.levelSeparation = parseFloat($('#'+id_jq.id_jq_level_separation).val());
	if ($("#"+id_jq.id_jq_type_line+' option:selected').val() == "none"){

		CFbi.options.edges.smooth = false;

	}else if (($("#"+id_jq.id_jq_type_line+' option:selected').val() == "diagonalCross")){

		CFbi.options.edges.smooth = {
										enabled:true,
										dynamic:false,
										type:"diagonalCross"
										
									};
		
	}
	CFbi.draw();
	$.ajax({
		url:CFbi.base_url+'index.php/conframe_bi/ajax_save',
		type:"POST",
		data:json,
	}).done(function(response){
		if (!response) return;
		if (!JSON.parse(response)) return;
		var res = JSON.parse(response);
		if (res.result == "success"){
			CFbi.conframe_bi = res.data;
		}
		HCModal.close_modal();
		CFbi.set_data_conframe_bi();
	})
}
/***************************/
CFbi.init= function(){
	if (!CFbi.div_panel)return;

	$('#'+CFbi.div_panel).css('height',$(window).height()-80);//screen.height-185

	var html= ''
	for (var i in CFbi.type_message){
	//	html+= '<label><span style="width:15px;background-color:'+CFbi.type_message[i].color+'">&nbsp</span>'+CFbi.type_message[i].name+' ('+CFbi.type_message[i].style_line+' )&nbsp&nbsp</label>';
		html+= '<span class="line-bi';
		if (CFbi.type_message[i].style_line == "dashes"){
			html+=' line-dash';
		}
		html+= '" ';
		html+= ' style = "border-bottom-color:'+CFbi.type_message[i].color+'">'+CFbi.type_message[i].name+'</span>'
	}
	html+= '<span class="line-bi';
	if (CFbi.default_color.style_line == "dashes"){
		html+=' line-dash';
	}
	html+= '" ';
	html+='style = "border-bottom-color:'+CFbi.default_color.color+'">'+CFbi.default_color.name+'</span>';
	html+='<span id="subjects"></span>';
	$('#footer').html(html);

}

CFbi.options_conframe_bi = function(id_html_lseparation){
	if (!id_html_lseparation) {
		html_modal();
		return;
	}

	CFbi.options.layout.hierarchical.levelSeparation = parseFloat($('#'+id_html_lseparation).val());

	function html_modal(){
		var attr = {};
		attr.title = "Настройки опций графа";
		attr.body = '<label style="float:left">Длина между линиями &nbsp</label><input id="level_separation" value="'+CFbi.options.layout.hierarchical.levelSeparation+'" class="form-control input-sm" step=50 style ="width:50%;float:left;padding:0px"  type="number" />';
		attr.body+='<div style="clear:both"></div>'
		attr.footer = '<button class = "btn btn-primary" onclick="CFbi.options_conframe_bi(\'level_separation\')">Применить</button>';
		CFbi.create_modal(attr);
	}
	CFbi.set_options_vis();
	
	HCModal.close_modal();

}

CFbi.types_subjects = function(){
	var html = '';
	for (var i in CFbi.subjects){
		html+= '<button type="button" onclick="CFbi.selected_nodes(\''+i+'\')" class="btn btn-info btn-xs""><span style="color:#fff;"><i class="fa fa-user" aria-hidden="true"></i></span>&nbsp'+CFbi.subjects[i][0].label+' ('+CFbi.subjects[i].length+')</button>&nbsp';
	}
	$('#subjects').html(html);
}
CFbi.selected_nodes = function(id_subject){
	if (!id_subject) return;
	if (!CFbi.subjects[id_subject]) return;
	var elements_id = [];
	for (var i in CFbi.subjects[id_subject]){
		elements_id.push(CFbi.subjects[id_subject][i].id);
	}
	CFbi.network.selectNodes(elements_id);
}
/***************/
CFbi.checked_id = function(id){
	var no_id = true;
	for (var i in CFbi.nodes){
		if (id == CFbi.nodes[i].id){
			no_id = false; 
			break;
		}
	}
	return no_id;
}

/*************************/
/*
viewer new
*/
CFbi.set_viewer_sujects = function(attr){
//	console.log(attr);
	var attr_event = {
		from_id :attr.from.id,
		to_id :attr.to.id,
		message_id :attr.id,
		type_message :attr.type_message,
		start_time :attr.start_time,
		from_label :attr.from.name,
		to_label :attr.to.name,
		text_message :attr.message,
	};
	

/*
id которые нужны для vis.js 
*/
	var attr_from_obj_to = {};
	attr_from_obj_to.from_id = get_id_for_nodes();
	attr_from_obj_to.mes_id = 0;
	attr_from_obj_to.to_id = 0;
	attr_from_obj_to.level = 1;

	attr_from_obj_to.add_from = true;
	attr_from_obj_to.add_to = true;
	attr_from_obj_to.add_message = true;

	if (CFbi.subjects[attr_event.from_id]){
		attr_from_obj_to.add_from = false;
		var count = CFbi.subjects[attr_event.from_id].length-1;
		attr_from_obj_to.level=CFbi.subjects[attr_event.from_id][count].level;
		attr_from_obj_to.from_id = CFbi.subjects[attr_event.from_id][count].id;
	}
	/**********************from*******************************/

		if (attr_from_obj_to.add_from){
			var temp_level =get_level_for_object();
			//temp_level;
			CFbi.add_sub({
					id:attr_from_obj_to.from_id,//CFbi.nodes.length-1,
					label:attr_event.from_label,
				//	level:attr_from_obj_to.level,
					level:temp_level,
					id_subject:attr_event.from_id,//id subject attr
			})
		}

	/**********************message*******************************/
	
		var got_level = get_level_for_object();
		if (got_level){
			attr_from_obj_to.level = got_level;
			attr_from_obj_to.level++;
		}else{
			attr_from_obj_to.level = attr_from_obj_to.level + CFbi.step_level;
		}

		
		attr_from_obj_to.mes_id = get_id_for_nodes();

		CFbi.add_message({
			id : attr_from_obj_to.mes_id,//CFbi.nodes.length+1,
			level : attr_from_obj_to.level,
			label : attr_event.text_message,
			id_message : attr_event.message_id,
			type_message : attr_event.type_message,
			start_time : attr_event.start_time,
		})
	
	
		CFbi.add_line({
			id_from	: 	attr_from_obj_to.from_id,
			id_to	: 	attr_from_obj_to.mes_id,//CFbi.nodes.length,
			type_message	: 	attr_event.type_message,
		})

		connecting_to({
			id	: 	get_id_for_nodes(),//for nodes
			id_from	: 	attr_from_obj_to.mes_id,
			id_subject	: 	attr_event.to_id,//id subject массив subjects
			label	: 	attr_event.to_label,
			level	: 	get_level_for_object(),
			type_message : attr_event.type_message,
		})
				

	 /**********************TO*******************************/
	function connecting_to (to_subj){
		//*************добавить или нет****************
		var cur_id = to_subj.id;
		if (CFbi.subjects[to_subj.id_subject]){//всегда 0 один
			for (var i in CFbi.nodes){

				if (CFbi.nodes[i].id == CFbi.subjects[to_subj.id_subject][0].id){
					cur_id = CFbi.subjects[to_subj.id_subject][0].id;
					CFbi.nodes[i].level = CFbi.nodes[CFbi.nodes.length-1].level;
					CFbi.nodes[i].level++;
					CFbi.set_group_sub(cur_id);
					break;
				}
			}
		}else{
			to_subj.level++;
			CFbi.add_sub({
				id:to_subj.id,//CFbi.nodes.length+1,
				label:to_subj.label,
				level:to_subj.level,
				id_subject:to_subj.id_subject,
				type_message:to_subj.type_message,
			})
		}
		//*************************
		CFbi.add_line({
				id_from:to_subj.id_from,
				id_to:cur_id,//наш id
				type_message:attr.type_message,
			})


	}
	
		function get_level_for_object (){
			if (!CFbi.objects || CFbi.objects.length <1) return false;

			var level = CFbi.objects[CFbi.objects.length-1].level;
			return level;
		}
		function get_id_for_nodes(){
			var id = 0;
			if (CFbi.nodes[CFbi.nodes.length-1]){
				id = CFbi.nodes[CFbi.nodes.length-1].id;
				id++;
			}
			return id;
		}
	
}

CFbi.set_viewer_sujects_v1 = function(attr){//+1
	CFbi.old_add = null;
	var attr_event = {
		from_id: attr.from.id,
		to_id: attr.to.id,
		message_id: attr.id,
		type_message: attr.type_message,
		start_time: attr.start_time,
		
		from_label: attr.from.name,
		to_label: attr.to.name,

		text_message: attr.message,
	};
	/*
	attr_event.from_id = attr.from.id;
	attr_event.to_id = attr.to.id;
	attr_event.message_id = attr.id;
	attr_event.type_message = attr.type_message;
	attr_event.start_time = attr.start_time;
	
	attr_event.from_label = attr.from.name;
	attr_event.to_label = attr.to.name;

	attr_event.text_message = attr.message;
*/
	/*
		id которые нужны для vis.js 
	*/
	var attr_from_obj_to = {
		from_id: get_id_for_nodes(),
		mes_id: 0,
		to_id: 0,
		level: 1,
		add_from: true,
		add_to: true,
		add_message: true,
	};
	/*
	attr_from_obj_to.from_id = get_id_for_nodes();
	attr_from_obj_to.mes_id = 0;
	attr_from_obj_to.to_id = 0;
	attr_from_obj_to.level = 1;

	attr_from_obj_to.add_from = true;
	attr_from_obj_to.add_to = true;
	attr_from_obj_to.add_message = true;
*/
	if (CFbi.subjects[attr_event.from_id]){
		attr_from_obj_to.add_from = false;
		var count = CFbi.subjects[attr_event.from_id].length-1;
		attr_from_obj_to.level = CFbi.subjects[attr_event.from_id][count].level;
		attr_from_obj_to.from_id = CFbi.subjects[attr_event.from_id][count].id;
	}
	/**********************from*******************************/

	if (attr_from_obj_to.add_from){
		var temp_level =get_level_for_object();
		//temp_level ;
		CFbi.add_sub({
				id:attr_from_obj_to.from_id,//CFbi.nodes.length-1,
				label:attr_event.from_label,
			//	level:attr_from_obj_to.level,
				level:1,
				id_subject:attr_event.from_id,//id subject attr
		})
	}

	/**********************message*******************************/
		
		if (!CFbi.old_add){
			var got_level = get_level_for_object();
			if (got_level){
				attr_from_obj_to.level = got_level;
				attr_from_obj_to.level++;
			}else{
				attr_from_obj_to.level = attr_from_obj_to.level + CFbi.step_level;
			}
			
		
		}else{
			var st_time = moment(attr_event.start_time);
			
			if (st_time.diff(CFbi.old_add,"minutes") <= CFbi.diff){

				attr_from_obj_to.level = CFbi.objects[CFbi.objects.length-1].level;
			}else{
					var got_level = get_level_for_object();
					if (got_level){

						attr_from_obj_to.level = got_level;
						attr_from_obj_to.level++;
					}else{

						attr_from_obj_to.level = attr_from_obj_to.level + CFbi.step_level;
					}
					CFbi.old_add =  moment(attr_event.start_time);
			}
		}
		
		attr_from_obj_to.mes_id = get_id_for_nodes();
		
		CFbi.add_message({
			id : attr_from_obj_to.mes_id,//CFbi.nodes.length+1,
			level : attr_from_obj_to.level,
			label : attr_event.text_message,
			id_message : attr_event.message_id,
			type_message : attr_event.type_message,
			start_time : attr_event.start_time,
		})
	
	
		CFbi.add_line({
			id_from	: 	attr_from_obj_to.from_id,
			id_to	: 	attr_from_obj_to.mes_id,//CFbi.nodes.length,
			type_message	: 	attr_event.type_message,
		})

		connecting_to({
			id	: 	get_id_for_nodes(),//for nodes
			id_from	: 	attr_from_obj_to.mes_id,
			id_subject	: 	attr_event.to_id,//id subject массив subjects
			label	: 	attr_event.to_label,
			level	: 	get_level_for_object(),
			type_message : attr_event.type_message,
		})
				

	 /**********************TO*******************************/
	function connecting_to (to_subj){
		//*************добавить или нет****************
		var cur_id = to_subj.id;
		if (CFbi.subjects[to_subj.id_subject]){//всегда 0 один
			for (var i in CFbi.nodes){

				if (CFbi.nodes[i].id == CFbi.subjects[to_subj.id_subject][0].id){
					cur_id = CFbi.subjects[to_subj.id_subject][0].id;
					CFbi.nodes[i].level = CFbi.nodes[CFbi.nodes.length-1].level;
					CFbi.nodes[i].level++;
					CFbi.set_group_sub(cur_id);
					break;
				}
			}
		}else{
			if (!to_subj.level) to_subj.level = 3; 
			to_subj.level++;
			CFbi.add_sub({
				id:to_subj.id,//CFbi.nodes.length+1,
				label:to_subj.label,
				level:to_subj.level,
				id_subject:to_subj.id_subject,
				type_message:to_subj.type_message,
			})
		}
		//*************************
		CFbi.add_line({
				id_from:to_subj.id_from,
				id_to:cur_id,//наш id
				type_message:attr.type_message,
			})


	}
	
		function get_level_for_object (){
			if (!CFbi.objects || CFbi.objects.length <2) return false;

			var level = CFbi.objects[CFbi.objects.length-1].level;
			return level;
		}
		function get_id_for_nodes(){
			var id = 0;
			if (CFbi.nodes[CFbi.nodes.length-1]){
				id = CFbi.nodes[CFbi.nodes.length-1].id;
				id++;
			}
			return id;
		}
	
}
CFbi.set_viewer_sujects_v3 = function(attr){//no replace
	var attr_event = {};
	attr_event.from_id = attr.from.id;
	attr_event.to_id = attr.to.id;
	attr_event.message_id = attr.id;
	attr_event.type_message = attr.type_message;
	attr_event.start_time = attr.start_time;
	
	attr_event.from_label = attr.from.name;
	attr_event.to_label = attr.to.name;

	attr_event.text_message = attr.message;



/*
id которые нужны для vis.js 
*/
	var attr_from_obj_to = {};
	attr_from_obj_to.from_id = get_id_for_nodes();
	attr_from_obj_to.mes_id = 0;
	attr_from_obj_to.to_id = 0;
	attr_from_obj_to.level = 1;

//	attr_from_obj_to.add_from = true;
	attr_from_obj_to.add_to = true;
	attr_from_obj_to.add_message = true;

	//if (CFbi.subjects[attr_event.from_id]){
	//	attr_from_obj_to.add_from = false;
		//var count = CFbi.subjects[attr_event.from_id].length-1;
	//	attr_from_obj_to.level = CFbi.subjects[attr_event.from_id][count].level;
	//	attr_from_obj_to.from_id = CFbi.subjects[attr_event.from_id][count].id;
//	}
	/**********************from*******************************/
	attr_from_obj_to.level = 1;
	attr_from_obj_to.from_id = get_id_for_nodes();
	//if (attr_from_obj_to.add_from){
		var temp_level =get_level_for_object();
		
		CFbi.add_sub({
				id:attr_from_obj_to.from_id,//CFbi.nodes.length-1,
				label:attr_event.from_label,
			//	level:attr_from_obj_to.level,
				level:1,
				id_subject:attr_event.from_id,//id subject attr
		})
	//}

	/**********************message*******************************/
		
		
			var got_level = get_level_for_object();
			if (got_level){
				attr_from_obj_to.level = got_level;
				attr_from_obj_to.level++;
			}else{
				attr_from_obj_to.level = attr_from_obj_to.level + CFbi.step_level;
			}
		attr_from_obj_to.mes_id = get_id_for_nodes();

		CFbi.add_message({
			id : attr_from_obj_to.mes_id,//CFbi.nodes.length+1,
			level : attr_from_obj_to.level,
			label : attr_event.text_message,
			id_message : attr_event.message_id,
			type_message : attr_event.type_message,
			start_time : attr_event.start_time,
		})
	

		CFbi.add_line({
			id_from	: 	attr_from_obj_to.from_id,
			id_to	: 	attr_from_obj_to.mes_id,//CFbi.nodes.length,
			type_message	: 	attr_event.type_message,
		})
//	return;
		connecting_to({
			id	: 	get_id_for_nodes(),//for nodes
			id_from	: 	attr_from_obj_to.mes_id,
			id_subject	: 	attr_event.to_id,//id subject массив subjects
			label	: 	attr_event.to_label,
			level	: 	get_level_for_object(),
			type_message : attr_event.type_message,
		})
				

	 /**********************TO*******************************/
	function connecting_to (to_subj){
		//*************добавить или нет****************
		var cur_id = to_subj.id;
		if (CFbi.subjects[to_subj.id_subject]){//всегда 0 один
			for (var i in CFbi.nodes){

				if (CFbi.nodes[i].id == CFbi.subjects[to_subj.id_subject][0].id){
					cur_id = CFbi.subjects[to_subj.id_subject][0].id;
					CFbi.nodes[i].level = CFbi.nodes[CFbi.nodes.length-1].level;
					CFbi.nodes[i].level++;
					CFbi.set_group_sub(cur_id);
					break;
				}
			}
		}else{
			to_subj.level++;
			CFbi.add_sub({
				id:to_subj.id,//CFbi.nodes.length+1,
				label:to_subj.label,
				level:to_subj.level,
				id_subject:to_subj.id_subject,
				type_message:to_subj.type_message,
			})
		}
		//*************************
		CFbi.add_line({
				id_from:to_subj.id_from,
				id_to:cur_id,//наш id
				type_message:attr.type_message,
			})


	}
	
		function get_level_for_object (){
			if (!CFbi.objects || CFbi.objects.length <1) return false;

			var level = CFbi.objects[CFbi.objects.length-1].level;
			return level;
		}
		function get_id_for_nodes(){
			var id = 0;
			if (CFbi.nodes[CFbi.nodes.length-1]){
				id = CFbi.nodes[CFbi.nodes.length-1].id;
				id++;
			}
			return id;
		}
	
}

CFbi.set_viewer_sujects_v4 = function(attr){//no replace

	var attr_event = {};
	attr_event.from_id = attr.from.id;
	attr_event.to_id = attr.to.id;
	attr_event.message_id = attr.id;
	attr_event.type_message = attr.type_message;
	attr_event.start_time = attr.start_time;
	
	attr_event.from_label = attr.from.name;
	attr_event.to_label = attr.to.name;

	attr_event.text_message = attr.message;



/*
id которые нужны для vis.js 
*/
	var attr_from_obj_to = {};
	attr_from_obj_to.from_id = get_id_for_nodes();
	attr_from_obj_to.mes_id = 0;
	attr_from_obj_to.to_id = 0;
	attr_from_obj_to.level = 1;

	attr_from_obj_to.add_to = true;
	attr_from_obj_to.add_message = true;


	/**********************from*******************************/
	attr_from_obj_to.level = 1;
	
	/**********************message*******************************/
		
		
			var got_level = get_level_for_object();
			if (got_level){
				attr_from_obj_to.level = got_level;
				attr_from_obj_to.level++;
			}else{
				attr_from_obj_to.level = attr_from_obj_to.level + CFbi.step_level;
			}
		attr_from_obj_to.mes_id = get_id_for_nodes();

		CFbi.add_message({
			id : attr_from_obj_to.mes_id,//CFbi.nodes.length+1,
			level : attr_from_obj_to.level,
			label : attr_event.text_message,
			id_message : attr_event.message_id,
			type_message : attr_event.type_message,
			start_time : attr_event.start_time,
		})
		attr_from_obj_to.level--;
		attr_from_obj_to.from_id = get_id_for_nodes();

		CFbi.add_sub({
				id:attr_from_obj_to.from_id,//CFbi.nodes.length-1,
				label:attr_event.from_label,
				level:attr_from_obj_to.level,
				id_subject:attr_event.from_id,//id subject attr
		})

		CFbi.add_line({
			id_from	: 	attr_from_obj_to.from_id,
			id_to	: 	attr_from_obj_to.mes_id,//CFbi.nodes.length,
			type_message	: 	attr_event.type_message,
		})
//	return;
		connecting_to({
			id	: 	get_id_for_nodes(),//for nodes
			id_from	: 	attr_from_obj_to.mes_id,
			id_subject	: 	attr_event.to_id,//id subject массив subjects
			label	: 	attr_event.to_label,
			level	: 	get_level_for_object(),
			type_message : attr_event.type_message,
		})
				

	 /**********************TO*******************************/
	function connecting_to (to_subj){
		//*************добавить или нет****************
		var cur_id = to_subj.id;
		if (CFbi.subjects[to_subj.id_subject]){//всегда 0 один
			for (var i in CFbi.nodes){

				if (CFbi.nodes[i].id == CFbi.subjects[to_subj.id_subject][0].id){
					cur_id = CFbi.subjects[to_subj.id_subject][0].id;
					CFbi.nodes[i].level = CFbi.nodes[CFbi.nodes.length-1].level;
					CFbi.nodes[i].level++;
					CFbi.nodes[i].level++;
					break;
				}
			}
		}else{
			to_subj.level++;
			CFbi.add_sub({
				id:to_subj.id,//CFbi.nodes.length+1,
				label:to_subj.label,
				level:to_subj.level,
				id_subject:to_subj.id_subject,
				type_message : to_subj.type_message,
			})
		}
		//*************************
		CFbi.add_line({
				id_from:to_subj.id_from,
				id_to:cur_id,//наш id
				type_message:attr.type_message,
			})


	}
	
		function get_level_for_object (){
			if (!CFbi.objects || CFbi.objects.length <1) return false;

			var level = CFbi.objects[CFbi.objects.length-1].level;
			return level;
		}
		function get_id_for_nodes(){
			var id = 0;
			if (CFbi.nodes[CFbi.nodes.length-1]){
				id = CFbi.nodes[CFbi.nodes.length-1].id;
				id++;
			}
			return id;
		}
	
}
CFbi.set_db_event = function(json,viewer_type){
	if (!json || !viewer_type) return;
	var db_event = {};
	db_event.messages = [];
	db_event.name = "Test db";
	var messages_db = null;

	for (var i in json){
		console.log(json[i]);
		messages_db = null;
		messages_db = {};
		messages_db.from = {};
		messages_db.to = {}

		messages_db.start_time = json[i].date_time;
		messages_db.id = parseInt(json[i].id);
		messages_db.message = json[i].text;

		
		messages_db.from.id=json[i].from_id;
		messages_db.to.id=json[i].to_id;
		
		messages_db.from.name = json[i].msg_from;
		messages_db.to.name = json[i].msg_to;

		messages_db.type_message = json[i].type_message;
		db_event.messages.push(messages_db);

	}
	CFbi.event_data = db_event;

	CFbi.run_viewer(db_event.messages,viewer_type);
}

$( window ).resize(function() {
  $('#'+CFbi.div_panel).css('height',$(window).height()-80);
  CFbi.draw();
  //console.log(screen.height-185);
});

CFbi.get_interval = function(events){
	
	var mass_start_time = [];//ТОЛЬКО ВРЕМЯ
	for (var sob in events){
		mass_start_time.push(events[sob].start_time);
	}
	//
	mass_start_time = mass_start_time.sort();
	var ev1 =  moment(mass_start_time[0]);
	var ev2 = moment(mass_start_time[mass_start_time.length-1]);
	//console.log()
	CFbi.diff = ev2.diff(ev1,"minutes");
	CFbi.diff = parseInt(CFbi.diff/(mass_start_time.length-1));
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

/*
	функция вызываемся через кнопнку в меню добавить соеденение
*/
CFbi.add_connection = function(set_connect){
	if (CFbi.connecting_selection.length != 2 ) return;
	CFbi.add_line({
		id_from:CFbi.connecting_selection[0].id,
		id_to:CFbi.connecting_selection[1].id,//CFbi.nodes.length,
	})
	CFbi.network.setData({nodes:CFbi.nodes,edges:CFbi.edges},false)
}

CFbi.open_situation = function(){
    if (!CFbi.situation_id) return;
    window( CFbi.base_url+'index.php/conframe_bi/situation/'+CFbi.situation_id)
}
//export svg to png
CFbi.export = function(){
	var canvas = document.getElementById("svg");//когда нету элемента - null(когда на панели не одного элемента)
	if (!canvas) return;
	var link = document.createElement('a');//если не использовать это, то файл будет без формата + имени ("сохраненные файлы")
    link.download = CFbi.conframe_bi.name ? CFbi.conframe_bi.name : "Схема";//наименование файла, png автоматически припысывает
    link.href = canvas.toDataURL("image/png");
    link.click();
}

/*
	@param edge - текущая линия с её параметрами из CFbi.edges
	@param from_node - объект from (в случае)
	функция определяет from line - если элемент является "условием" - то в диалоговое окно возращает
	html select YES NO 
	Артем
*/
CFbi.get_yes_no_html = function(edge,from_node){
	if (!edge || !from_node || from_node["type_action"] != "CONDITION") return;
	
var html = '<tr>';
		html+= '<td><b>Условие</b></td>';
		html+= '<td>';
			html+= '<select id="yes_no_condition" class="form-control" style="float:left">';
				html+= '<option value=""></option>';
				html+= '<option value="Да">Да</option>';
				html+= '<option value="Нет">Нет</option>';
			html+= '</select>';
		html+= '</td>';
	html+= '</tr>';

	return html;
}

CFbi.set_options_vis = function(){
	if (CFbi.network){
		CFbi.network.setData({nodes:CFbi.nodes,edges:CFbi.edges,options:CFbi.options},false);
	}else{
		CFbi.draw()
	};
}