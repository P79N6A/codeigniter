

var  CFbi = { 
		//type_viewer : ["TIME_GROUP","STAIRS","STAIRS_V2","STAIRS_V3_NRP","STAIRS_V4_NRPL"],//0 всегд по умолчанию
		type_viewer : [
		{
			type:"TIME_GROUP",//Групповое представление по типам сообщений ситуации
			text_id:"txt_viewer_v1",
		},
		{
			type:"STAIRS",//Линейное представление сообщений ситуации
			text_id:"txt_viewer_v2",
		},
		{
			type:"STAIRS_V2",//Линейно групповое представление сообщений ситуации
			text_id:"txt_viewer_v3",
		},
		{
			type:"STAIRS_V3_NRP",//Лестничное представление сообщений ситуации
			text_id:"txt_viewer_v4",
		},
		{
			type:"STAIRS_V4_NRPL",//Лестничное представление отправителей сообщений ситуации
			text_id:"txt_viewer_v5",
		},
		],
		print:false,
		event_data:null,//Data Base
		got_viewer : null,
		situation_info:null,
		id_conframe_bi : null,
		ajax_conframe_bi : {},//все конфреймы при нажатии открыть
		event: null,
		message_info: null,
		coordX:0,
		coordY:0,
		step_level:1,
		base_url: null,
		categories:{},
		nodes:  [],
		edges:  [],
		network:null,
		conframe_bi:{},
		name_create_event: null,
		subjects : [],//чубзики
		objects : [],//сообщения
	//	image_subject:  'img/conframe_bi/subject_group.png',
		image_subject:  ['img/conframe_bi/subject.png','img/conframe_bi/subject_group.png'],
		div_panel: null,
		group:"get_group",
		mode:"",//CLONE
		diff:100,
		old_add :null,
		full_messages:[],
		type_message:[
			{
				name : 'ОЖУР',
				color: 'green',
				width: 2,
				style_line: 'to',	
			},
			{
				name : 'СМС',
				color: '#0000FF',
				width: 2,
				style_line: 'to',	
			},
			{
				name : 'Почта',
				color: '#FF0000',
				width: 2,
				style_line: 'to',	
			},
			{
				name : 'Телефон',
				color: 'darkblue',
				width: 2,
				style_line: 'dashes',	//dash-line old param
			},

		],
	//	categories:{},//?
		default_color:{
			name : 'Без типа', 
			color: '#FFF',
			width: 2,
			style_line: 'to',
		},
		/*
		//old options
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
			 
		},*/
		
		options :{
				
				'groups': {
				    object: {
				    	font:{
				    		size:14,
				    		color:'#FFF',
				    	},
				    	color:{	
				    		border: '#9F9E7E',
				    		background: '#EDEA09',
				    	},
				   },
				    action: {
				   		font:{
				    		size:14,
				    		color:'#FFF',
				    	},
					    color: {
					    	border: '#9F9E7E',
					        background: '#7DB1FA',
					    }
					    
				   }
				},
				'layout': {
					hierarchical: {
							direction: "LR",
							levelSeparation:250,
					},
					
				},
				'nodes':{
					shadow:true,
					
				},
				"physics": {	
						    	"hierarchicalRepulsion": {
							        "gravitationalConstant": -7000,
							        "centralGravity": 0.3,
							        "springLength": 1,
							        "springConstant": 0.02,
							        "damping": 0.3,
							        //"avoidOverlap": 0.04
							    },
							    //"timestep": 0.56
							}
				
		},
};

CFbi.ge = function(id) {
	return document.getElementById(id); 
}
$(document).ready(function(){
	
     

	CFbi.get_html_popover();
	$('#setting_popover').popover('show');
	$('#setting_popover').popover('hide');

	
})
CFbi.create_modal = function(attr){
	if (!attr) return;
	HCModal.run(attr);
}
/************/

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

/*******************************************************************/
CFbi.add_sub = function(attr){
	var label = attr.label;
	if (attr.type_message){
		if (attr.type_message == "Почта") label= "САЦ РОССЕТИ";
	}
		var parametrs = {
			id: attr.id, 
			level:attr.level, 
			image: CFbi.base_url + CFbi.image_subject[0],
			group: CFbi.group, 
			shape: 'image',
			font: {color: '#f8f4e3'}, //Vadim GRITSENKO - цвет шрифта
			// title:"id :"+attr.id, 
			 label:label,

			};
		CFbi.nodes.push(parametrs);
		CFbi.add_mass(CFbi.subjects,attr.id_subject,parametrs);
}
CFbi.add_message = function(attr){

	var full_data = null;
	
	if (CFbi.event_data){
		for (var i in CFbi.event_data.messages){
			if (CFbi.event_data.messages[i].id == attr.id_message && CFbi.event_data.messages[i].semantic){
				full_data = CFbi.event_data.messages[i];
				break;
			}
		}
	}

	var label = attr.start_time ? moment(CFUtil.get_local_datetime(new Date(attr.start_time))).format("DD-MM-YYYY HH:mm:ss") : attr.label;
	var  parametrs = {
		id: attr.id, 
		level:attr.level,  
		shape: 'box', 
		color:"#F2EE05", 
		title:'<div class="title-main">&#10 '+attr.label+'</div>', 
		group: CFbi.group,
		full_data : full_data || null, 
		label:label,
		id_message:attr.id_message,
		type_message:attr.type_message,
		start_time:attr.start_time,
	}
	//CFbi.nodes.push(parametrs);
	CFbi.nodes.push(jQuery.extend(true, {}, parametrs));
	attr.label.replace('\r\n', "\\r\\n");
	parametrs.label = attr.label;
	CFbi.add_mass_obj(CFbi.objects,parametrs);
}
CFbi.add_line = function(attr){

	var pl = null;
	for (var i in CFbi.nodes){
		if (CFbi.nodes[i].id == attr.id_from){
			pl = CFbi.get_parametrs_line(attr);
			//pl.start_time = CFbi.nodes[i].start_time;//message
		}
	}

	if (!pl) return;

	var parametrs = {
		from: attr.id_from,
		to: attr.id_to, 
	//	style: pl.style_line,
		arrows: pl.style_line != "dashes" ? pl.style_line : 'to',
		dashes: pl.style_line == "dashes" ? true : false,
		color:pl.color ,
		widthSelectionMultiplier: 4 ,
		label:attr.label || '',

	}
	CFbi.edges.push(parametrs);
}

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
		if (!color.color) color = CFbi.default_color;
		return color;
	}
	return json_color;
}

/*******************************************************************/
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

		if (CFbi.subjects[attr.from.id]){
			add_from = false;
			var count = CFbi.subjects[attr.from.id].length-1;
			level=CFbi.subjects[attr.from.id][count].level;
		}
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
		
		level = level + CFbi.step_level;
		//id_message = 1;
        var id_mess = null;
		if (CFbi.nodes[CFbi.nodes.length-1]){
			id_mess = CFbi.nodes[CFbi.nodes.length-1].id;
			id_mess++;
		}
		CFbi.add_message({
			id:id_mess,//CFbi.nodes.length+1,
			level:level,
			label:text,
			id_message:attr.id,
			type_message:attr.type_message,
			start_time:attr.start_time
		})
		if (add_from){
			CFbi.add_line({
				id_from:id_from,
				id_to:id_mess,//CFbi.nodes.length,
				type_message:attr.type_message,
			})
		}else{
			CFbi.add_line({
				id_from:CFbi.subjects[attr.from.id][count].id,
				id_to:id_mess,//CFbi.nodes.length,
				type_message:attr.type_message,
			})
		}
		
	 /**********************TO*******************************/
	
		level = level + CFbi.step_level;
        var id_to_temp = null;
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
			type_message:attr.type_message,
		})

}



/*
viewer new
*/
CFbi.set_viewer_sujects = function(attr){
//	console.log(attr);
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
			type_message:attr_event.type_message,
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

	attr_from_obj_to.add_from = true;
	attr_from_obj_to.add_to = true;
	attr_from_obj_to.add_message = true;

	if (CFbi.subjects[attr_event.from_id]){
		attr_from_obj_to.add_from = false;
		var count = CFbi.subjects[attr_event.from_id].length-1;
		attr_from_obj_to.level = CFbi.subjects[attr_event.from_id][count].level;
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
		//	CFbi.old_add =  moment(attr_event.start_time);
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
//1111111111111111111
		connecting_to({
			id	: 	get_id_for_nodes(),//for nodes
			id_from	: 	attr_from_obj_to.mes_id,
			id_subject	: 	attr_event.to_id,//id subject массив subjects
			label	: 	attr_event.to_label,
			level	: 	get_level_for_object(),
			type_message: attr_event.type_message,
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
			type_message:attr_event.type_message,
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
				type_message:to_subj.type_message,
				id_subject:to_subj.id_subject,
			})
		}
		//*************************
		CFbi.add_line({
				id_from:to_subj.id_from,
				id_to:cur_id,//наш id
				type_message:to_subj.type_message
				//type_message:attr.type_message,
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
				type_message:to_subj.type_message,
				id_subject:to_subj.id_subject,
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

CFbi.add_mass = function(mass,id,parametrs){
	if (!mass || !id) return;
	if (!mass[id]) mass[id] = [];
	mass[id].push(parametrs);
}

CFbi.add_mass_obj = function(mass,parametrs){
	if (!mass || !parametrs) return;
	mass.push(parametrs);
	
	CFbi.full_messages[parametrs.id_message] = parametrs;
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
		$('#setting_popover').popover('hide');
			if (e.nodes.length != 0){
				var id = e.nodes[0];
				for (var i in CFbi.full_messages){
					if (CFbi.full_messages[i].id == id){
						CFbi.coordX = e.pointer.DOM.x;
						CFbi.coordY = e.pointer.DOM.y;
						if (!CFbi.full_messages[i].id_message) return;
						CFbi.open_dialog(e.nodes,e.edges)
						break;
					}
				}
				//if (!CFbi.full_messages[id]) return;
				
			//	CFbi.open_dialog(CFbi.event,CFbi.full_messages[id].id_message)
			}else{
				if (CFbi.message_info){
					CFbi.message_info.dialog("close");
					CFbi.message_info = null;
				}
			}
		})

}


CFbi.get_events = function(set_event){
	if (!set_event){
		html_modal();
		return;
	}
	function html_modal(){
		var attr={};
		attr.title = 'Список событий';
		attr.body = '<label style="float:left;padding-top:4px" for="set_ev" >Выберите событие: &nbsp </label><select style="width:50%; float:left" id = "set_ev" class="form-control">';
		for (var s in event_data){
			attr.body+='<option value="'+s+'">'+event_data[s].name+'</option>';
		}
		attr.body+=' </select ><div style="clear:both"></div>';
		attr.footer = '<button type="button" onclick = "CFbi.get_events(\'set_ev\');" class="btn btn-success">Выбрать</button>';
		CFbi.create_modal(attr);
	}

	var id_ev = $("#"+set_event).val();
	if (!event_data[id_ev] ){
		if (event_data[set_event]){
			id_ev = set_event;
		}else return;
	} 
	CFbi.id_conframe_bi = id_ev;
	window.history.pushState({},{}, CFbi.base_url+'index.php/conframe_bi/view/'+id_ev);
	CFbi.run(event_data[id_ev].messages);
	HCModal.close_modal();
}



CFbi.open_dialog = function(nodes_id,edges_guids){
//	console.log(nodes,edges);
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
			
					
					var html = '<table class="table table-bordered table-striped table-condensed" style="margin-bottom:0;font-size:12px;">';
												html += '<tbody>';

														html += '<tr>';
																html += '<td><b>Время</b></td>';
																html += '<td>'
																if (data_nodes.start_time)
																html+=moment(CFUtil.get_local_datetime(new Date(data_nodes.start_time))).format("DD-MM-YYYY HH:mm:ss");
																html+='</td>';
														html += '</tr>';

														html += '<tr>';
																html += '<td><b>От</b></td>';
																html += '<td>'+connecting.html_from+' <img src="'+CFbi.base_url+'img/conframe_bi/subject.png" height="15"></td>';
														html += '</tr>';

														/*html += '<tr>';
																html += '<td><b>Кому</b></td>';
																html += '<td>'+connecting.html_to+' <img src="'+CFbi.base_url+'img/conframe_bi/subject.png" height="15"></td>';
														html += '</tr>';*/

														html += '<tr>';
																html += '<td width="120px">'+CFbi.get_icon(data_nodes.full_data.type_operator)+'<b> Сообщение</b></td>';
																html += '<td>'
																	if (CFbi.full_messages[data_nodes.id_message]) html+=CFbi.full_messages[data_nodes.id_message].label;
																html+='</td>';
														html += '</tr>';

														if (data_nodes.full_data){
															if (data_nodes.full_data.semantic){
																html += '<tr>';
																	html += '<td><b>Событии</b></td>';
										                            html += '<td>';
										                            for (var s in data_nodes.full_data.semantic){
										                                html+='<button class="btn btn-info btn-sm" onclick="CF_Events_info.get_event_info(\''+data_nodes.full_data.semantic[s].id_event+'\',\'info\',\'1\')">'+data_nodes.full_data.semantic[s].semantic_id+'</button>';
										                            }
										                           	
										                            html += '</td>';
																html += '</tr>';
															}
														}	
														
												html += '</tbody>';
										html += '</table><div id="info"></div>';

				var value = data_nodes.start_time;
				//if (!value) value = '';
				$(CFbi.message_info).html(html);
				
			}
		}
}



CFbi.open_dialog_v1 = function(evnt,id){
		CFbi.message_info = CFUtil.dialog.create("message_info",
		{
				title: '&nbsp;',
				width: 500,
				resizable: false,
				position:[CFbi.coordX+20,CFbi.coordY+20]
		});
		if (CFbi.message_info){
				if (evnt.length != 0){
						for (var i=0; i<evnt.length; i++){
								if (evnt[i]["id"] == id){
									var html = '<table class="table table-bordered table-striped table-condensed" style="margin-bottom:0;font-size:12px;">';
												html += '<tbody>';
														html += '<tr>';
																html += '<td><b>От</b></td>';
																html += '<td>'+evnt[i]["from"]["name"]+' <img src="'+CFbi.base_url+'img/conframe_bi/subject.png" height="15"></td>';
														html += '</tr>';
														html += '<tr>';
																html += '<td><b>Кому</b></td>';
																html += '<td>'+evnt[i]["to"]["name"]+' <img src="'+CFbi.base_url+'img/conframe_bi/subject.png" height="15"></td>';
														html += '</tr>';
														html += '<tr>';
																html += '<td><b>Сообщение</b></td>';
																html += '<td>'+evnt[i]["message"]+'</td>';
														html += '</tr>';
														html += '<tr>';
																html += '<td><b>Время</b></td>';
																html += '<td>'+evnt[i]["start_time"]+'</td>';
														html += '</tr>';
												html += '</tbody>';
										html += '</table>';
										$(CFbi.message_info).html(html);
										break;
								}
						}
				} 
		}
}

CFbi.run = function(CFevent){//просмотр событий с БД



//	$('#'+CFbi.div_panel).css('height',$(window).height()-110);//screen.height-200

    CFbi.clear_data();
    CFbi.draw();
    CFbi.event = CFevent;
    CFevent =  CFevent.sort(dynamicSort("start_time"));
    CFbi.get_interval(CFevent);
    //Cfbi.type_viewer
    for (var sob in CFevent){//соеденения
        //CFbi.set_detal_message(CFevent[sob]);
        if (!CFbi.got_viewer){
        //	CFbi.set_viewer_sujects_v1(CFevent[sob]);
            CFbi.change_type_viewer(CFbi.type_viewer[0].type);
            return;
        }//for-setted-type-viewer
        if (CFbi.got_viewer == CFbi.type_viewer[0].type){

            $('[data-for-setted-type-viewer]').html( langs.get_term(CFbi.type_viewer[0].text_id) );
            CFbi.set_detal_message(CFevent[sob]);

        }else if (CFbi.got_viewer == CFbi.type_viewer[1].type)	{

            $('[data-for-setted-type-viewer]').html( langs.get_term(CFbi.type_viewer[1].text_id) );
            CFbi.set_viewer_sujects(CFevent[sob]);

        }else if (CFbi.got_viewer == CFbi.type_viewer[2].type)	{

            $('[data-for-setted-type-viewer]').html( langs.get_term(CFbi.type_viewer[2].text_id) );
            CFbi.set_viewer_sujects_v1(CFevent[sob]);

        }else if (CFbi.got_viewer == CFbi.type_viewer[3].type)	{

            $('[data-for-setted-type-viewer]').html( langs.get_term(CFbi.type_viewer[3].text_id) );
            CFbi.set_viewer_sujects_v3(CFevent[sob]);

        }else if (CFbi.got_viewer == CFbi.type_viewer[4].type)	{

            $('[data-for-setted-type-viewer]').html( langs.get_term(CFbi.type_viewer[4].text_id) );
            CFbi.set_viewer_sujects_v4(CFevent[sob]);

        }
    }

	//CFbi.init();//убрал 30.06.2015
	CFbi.types_subjects();
	CFbi.draw();
	if (CFbi.print){
		
		 CFbi.get_canvas(true);
	}
}
CFbi.clear_data = function(){
	CFbi.message_info = null;
	CFbi.categories={};
	CFbi.nodes=  [];
	CFbi.edges=  [];
	CFbi.subjects = [];//чубзики
	CFbi.objects = [];//сообщения
	//CFbi.old_add =null;
	CFbi.full_messages=[];
}
CFbi.get_interval = function(events){
	
	var mass_start_time = [];//ТОЛЬКО ВРЕМЯ
	for (var sob in events){
		mass_start_time.push(events[sob].start_time);
	}
	//
	mass_start_time = mass_start_time.sort();
	var ev1 =  moment(mass_start_time[0]);
	var ev2 = moment(mass_start_time[mass_start_time.length-1]);
	
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
//html полученный путем формы
CFbi.html_save_modal = function(html_body){
	var attr = {};
	attr.title  = 'Сохранение';
	attr.body = html_body;
	CFbi.create_modal(attr);
}


CFbi.save_events = function(id_name_event){
	CFbi.name_create_event = $("#"+id_name_event).val();
	if (CFbi.name_create_event == "") return;//добавить ошибку о том, что не введено имя . error modal

	var html = $.ajax({			
                url: CFbi.base_url+"index.php/qcore/ajax/load_form/conframe_bi/conframe",		
                type: "POST"			   
            }).done(function (response){
                var json = CFbi.get_json();
                CFbi.html_save_modal(response);
                $("#svg_json").html(JSON.stringify(json));
            });
}



CFbi.get_json = function(){
	var json = {};
	json.name = CFbi.name_create_event;
	json.nodes = CFbi.nodes;
	json.edges = CFbi.edges;
	return json;
}
/*****************************************/
CFbi.init = function(){

	if (!CFbi.div_panel) return;

	var html= ''
	html+=get_html_type_viewer();
	
	$(function () {
		  $('[data-toggle="popover"]').popover()
		})

	html+=get_html_settings();
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

    CFbi.set_offset_blocks();
	
	function get_html_type_viewer(){
	
		var h_viewer = '<div class="btn-group dropup btn-group-sm" style="float:left">';
		h_viewer+='   <span  class="btn btn-default" data-for-setted-type-viewer>'

		if (!CFbi.got_viewer){
			h_viewer+=langs.get_term(CFbi.type_viewer[0].text_id); //'Тип отображения';
		}else{
			for (var i in CFbi.type_viewer){
				if (CFbi.got_viewer == CFbi.type_viewer[i].type){
					h_viewer+=langs.get_term(CFbi.type_viewer[i].text_id);
					break;
				}
			}
		}

		h_viewer+=' </span>'
		h_viewer+='<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">'
  	    	h_viewer+= '<span class="caret"></span>';
	    	h_viewer+= '<span class="sr-only"></span>';
	    h_viewer+='</button>';

		h_viewer+=' <ul class="dropdown-menu" role="menu">';
		for (var i in CFbi.type_viewer){
			h_viewer+='<li role="presentation"><a role="menuitem" tabindex="-1" onclick ="CFbi.change_type_viewer(\''+CFbi.type_viewer[i].type+'\')" href="javascript:void(0)">'+langs.get_term(CFbi.type_viewer[i].text_id)+'</a></li>'
		}
		h_viewer+= ' </ul>';
		h_viewer+= '</div>';
		return h_viewer;
	}

	function get_html_settings(){
		
		var h_settings = '<button type="button" id="setting_popover" class="btn btn-sm" data-content="" data-toggle="popover" data-placement="top" ';
		//h_settings+= get_title();
		//h_settings+= get_content();
		h_settings+= '>Настройки физики</button>';
		
		return h_settings;
	}
}

//Artem
/*
* Установка высоты блока панели при загрузке/изменения размера страницы
* */
CFbi.set_offset_blocks = function(){
    var header = $('.main-header').length &&  $('.main-raised').length  && $('footer').length ? true : 0;

    if (header){
        header = $('.main-header').get(0).getBoundingClientRect().height +
                 $('.main-raised').get(0).getBoundingClientRect().height +
                 $('footer').get(0).getBoundingClientRect().height ;
    }

    $('#'+CFbi.div_panel).css('height',$(window).height()-header);//screen.height-200
}

CFbi.get_html_popover = function(){
	
	function get_content(){

			var data_options = {

				nodeDistance:CFbi.options.physics.hierarchicalRepulsion.nodeDistance || '150',
				centralGravity:CFbi.options.physics.hierarchicalRepulsion.centralGravity || '0',
				springLength:CFbi.options.physics.hierarchicalRepulsion.springLength || '100',
				springConstant:CFbi.options.physics.hierarchicalRepulsion.springConstant || '0.01',
				damping:CFbi.options.physics.hierarchicalRepulsion.damping || '0.09',
				levelSeparation:CFbi.options.layout.hierarchical.levelSeparation || '0.09',

			}

			var content = '';
			content+= '<table id="graph_bh_table" style="display: block;">';
			content+= '<tbody>';
			
			content+= '<tr style="background-color: #cccc33; color: #000;">';
				content+= '<td width="150"><b>'+langs.get_term('txt_hierarchical_repulsion')+'</b></td>';//hierarchicalRepulsion
			content+= '</tr>';
			content+= '<tr>';
				content+= '<td width="150px">'+langs.get_term('txt_node_distance')+'</td>';
				content+= '<td>0</td>';//+
				content+= '<td><input type="range" onchange="(function(){$(\'#graph_h_nd_value\').val($(\'#graph_h_nd\').val()); CFbi.set_options(\'physics\',\'nodeDistance\',\'graph_h_nd_value\',\'hierarchicalRepulsion\')})();" min="0" max="300" value="'+data_options.nodeDistance+'" step="1" style="width:300px" id="graph_h_nd"></td>';
				content+= '<td width="50px">300</td>';
				content+= '<td><input disabled value="'+data_options.nodeDistance+'" id="graph_h_nd_value" style="width:60px"></td>';
			content+= '</tr>';
			content+= '<tr>';
				content+= '<td width="150px">'+langs.get_term('txt_central_gravity')+'</td>';
				content+= '<td>0</td>';//centralGravity +
				content+= '<td><input type="range" onchange="(function(){$(\'#graph_h_cg_value\').val($(\'#graph_h_cg\').val()); CFbi.set_options(\'physics\',\'centralGravity\',\'graph_h_cg_value\',\'hierarchicalRepulsion\')})();" min="0" max="10" value="'+data_options.centralGravity+'" step="0.05" style="width:300px" id="graph_h_cg"></td>';
				content+= '<td>10</td>';
				content+= '<td><input disabled value="'+data_options.centralGravity+'" id="graph_h_cg_value" style="width:60px"></td>';
			content+= '</tr>';
			content+= '<tr>';
				content+= '<td width="150px">'+langs.get_term('txt_spring_length')+'</td>';
				content+= '<td>0</td>';//springLength +
				content+= '<td><input type="range" onchange="(function(){$(\'#graph_h_sl_value\').val($(\'#graph_h_sl\').val()); CFbi.set_options(\'physics\',\'springLength\',\'graph_h_sl_value\',\'hierarchicalRepulsion\')})();" min="0" max="500" value="'+data_options.springLength+'" step="1" style="width:300px" id="graph_h_sl"></td>';
				content+= '<td>500</td>';
				content+= '<td><input disabled value="'+data_options.springLength+'" id="graph_h_sl_value" style="width:60px"></td>';
			content+= '</tr>';
			
			content+= '<tr>';
				content+= '<td width="150px">'+langs.get_term('txt_spring_constant')+'</td>';
				content+= '<td>0</td>';//springConstan +
				content+= '<td><input type="range" onchange="(function(){$(\'#graph_h_sc_value\').val($(\'#graph_h_sc\').val()); CFbi.set_options(\'physics\',\'springConstant\',\'graph_h_sc_value\',\'hierarchicalRepulsion\')})();" min="0" max="0.5" value="'+data_options.springConstant+'" step="0.001" style="width:300px" id="graph_h_sc"></td>';
				content+= '<td>0.5</td>';
				content+= '<td><input disabled value="'+data_options.springConstant+'" id="graph_h_sc_value" style="width:60px"></td>';
			content+= '</tr>';
			
			content+= '<tr>';
				content+= '<td width="150px">'+langs.get_term('txt_damping')+'</td>';
				content+= '<td>0</td>';//damping +
				content+= '<td><input type="range" onchange="(function(){$(\'#graph_h_damp_value\').val($(\'#graph_h_damp\').val()); CFbi.set_options(\'physics\',\'damping\',\'graph_h_damp_value\',\'hierarchicalRepulsion\')})();" min="0" max="0.3" value="'+data_options.damping+'" step="0.005" style="width:300px" id="graph_h_damp"></td>';
				content+= '<td>0.3</td>';
				content+= '<td><input disabled value="'+data_options.damping+'" id="graph_h_damp_value" style="width:60px"></td>';
			content+= '</tr>';
		
			content+= '<tr>';
				content+= '<td width="150px">'+langs.get_term('txt_level_separation')+'</td>';
				content+= '<td>1</td>';// +
				content+= '<td><input type="range" onchange="(function(){$(\'#graph_hc_levsep_value\').val($(\'#graph_hc_levsep\').val()); CFbi.set_options(\'layout\',\'levelSeparation\',\'graph_hc_levsep_value\',\'hierarchical\')})();" min="250" max="700" value="'+data_options.levelSeparation+'" step="1" style="width:300px" id="graph_hc_levsep"></td>';
				content+= '<td>500</td>';
				content+= '<td><input disabled value="'+data_options.levelSeparation+'" id="graph_hc_levsep_value" style="width:60px"></td>';
			content+= '</tr>';
		
		/*	content+= '<tr>';
				content+= '<td width="150px">'+langs.get_term('txt_node_spacing')+'</td>';
				content+= '<td>1</td>';
				content+= '<td><input type="range" onchange="(function(){$(\'#graph_hc_nspac_value\').val($(\'#graph_hc_nspac\').val()); CFbi.set_options(\'physics\',\'nodeSpacing\',\'graph_hc_nspac_value\',\'hierarchicalRepulsion\')})();" min="0" max="500" value="100" step="1" style="width:300px" id="graph_hc_nspac"></td>';
				content+= '<td>500</td>';
				content+= '<td><input disabled value="100" id="graph_hc_nspac_value" style="width:60px"></td>';
			content+= '</tr>';*/
				/************************************************/
			/*content+= '<tr style="background-color:yellow">';
				content+= '<td><b>'+langs.get_term('txt_hierarchical')+'</b></td>';
			content+= '</tr>';
			content+= '<tr>';
				content+= '<td width="150px">'+langs.get_term('txt_node_spacing')+'</td>';
				content+= '<td>-1</td>';
				content+= '<td><input type="range" onchange="(function(){$(\'#graph_h_nspac_value\').val($(\'#graph_h_nspac\').val()); CFbi.set_options(\'hierarchicalLayout\',\'nodeSpacing\',\'graph_h_nspac_value\')})();" min="-1" max="1" value="100" step="1" style="width:300px" id="graph_h_nspac"></td>';
				content+= '<td>1</td>';
				content+= '<td><input disabled value="100" id="graph_h_nspac_value" style="width:60px"></td>';
			content+= '</tr>';

			content+= '<tr>';
				content+= '<td width="150px">'+langs.get_term('txt_level_separation')+'</td>';
				content+= '<td>1</td>';
				content+= '<td><input type="range" onchange="(function(){$(\'#graph_h_levsep_value\').val($(\'#graph_h_levsep\').val());CFbi.set_options(\'hierarchicalLayout\',\'levelSeparation\',\'graph_h_levsep_value\') })();" min="0" max="500" value="150" step="1" style="width:300px" id="graph_h_levsep"></td>';
				content+= '<td>500</td><td>';
				content+= '<input disabled value="150" id="graph_h_levsep_value" style="width:60px"></td>';
			content+= '</tr>';
			content+= '</tbody>';
			content+= '</table>';*/
			
			return content;
		}
		
		$("#setting_popover").attr("data-content",get_content());
		$('#setting_popover').popover({html:true});
		$('#setting_popover').on('shown.bs.popover', function (e) {
			if (!e.currentTarget) return; 
			if (!e.currentTarget.nextElementSibling) return;
			if (!e.currentTarget.nextElementSibling.id) return;
			var id_div_popover = e.currentTarget.nextElementSibling.id;
			$('#'+id_div_popover).css('max-width',800);
			$(".arrow").css('left','30%');
		})
}

CFbi.set_options = function(opt,type,jq_id,dop_opt){
	if (!jq_id) return;

	if (CFbi.options[opt]){

		if (CFbi.options[opt][type]){

			CFbi.options[opt][type]  = $('#'+jq_id).val();
			CFbi.network.setData({nodes:CFbi.nodes,edges:CFbi.edges,options:CFbi.options},false);

		}else if (CFbi.options[opt][dop_opt]){
				CFbi.options[opt][dop_opt][type] = parseFloat($('#'+jq_id).val());
				CFbi.network.setData({nodes:CFbi.nodes,edges:CFbi.edges,options:CFbi.options});
		}
	}
}


CFbi.types_subjects = function(){
	var html = '';
	for (var i in CFbi.subjects){
		html+= '<button type="button" onclick="CFbi.selected_nodes(\''+i+'\')" class="btn btn-info btn-xs""><span class="glyphicon glyphicon-user" style="color:black"></span>'+CFbi.subjects[i][0].label+' ('+CFbi.subjects[i].length+')</button>&nbsp';
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
/********************************/

CFbi.open_confrem_bi = function(jq_id){
	if (!jq_id){
		$.ajax({
		url:CFbi.base_url + 'index.php/conframe_bi/get_conframe_bi',
		}).done(function(response){
			CFbi.ajax_conframe_bi = JSON.parse(response);
			var attr = {};
			attr.title = 'Выберите conframe bi';

			attr.body=  '<select id = "open_confrem_bi" class="form-control">';
			for (var i in CFbi.ajax_conframe_bi){
				attr.body+='<option value="'+CFbi.ajax_conframe_bi[i].conframe_id+'">'+CFbi.ajax_conframe_bi[i].name+'</option>';
			}
			attr.body+=' </select >';
			attr.footer = '<button type="button" onclick="CFbi.open_confrem_bi(\'open_confrem_bi\')" class="btn btn-success">Выбрать</button>';
			CFbi.create_modal(attr);
		})
		return;
	}
	CFbi.init();
	CFbi.clear_data();
	var conframe_id = $("#"+jq_id).val(); 
	if (!CFbi.ajax_conframe_bi[conframe_id]) return; //добавить ошибку error modal  о том что не существует такой conframe_bi
	window.history.pushState({},{}, CFbi.base_url+'index.php/conframe_bi/view/'+conframe_id);
	var json = CFbi.ajax_conframe_bi[conframe_id];
	json.svg_json = JSON.parse(CFbi.ajax_conframe_bi[conframe_id]["svg_json"])
	json.conframe_id = CFbi.ajax_conframe_bi[conframe_id]["conframe_id"];
	HCModal.close_modal();
	CFbi.run_viewer (json.svg_json);
}
CFbi.open_editor_cfbi = function(){
	if (!CFbi.id_conframe_bi) return;
	var patch = '';
	if (CFbi.event_data){
		patch = CFbi.base_url  + 'index.php/conframe_bi/edit_db/'+CFbi.id_conframe_bi+'/';
		if (CFbi.got_viewer) patch+=CFbi.got_viewer;
		window.open(patch); return false;
	}else{
		patch = CFbi.base_url  + 'index.php/conframe_bi/edit/'+CFbi.id_conframe_bi+'/';
		if (CFbi.got_viewer) patch+=CFbi.got_viewer;
		window.open(patch); return false;
	}
	
	  
}

CFbi.run_viewer = function(svg,data_conf){

	if (!svg.nodes || !svg.edges) return;
	

	CFbi.conframe_bi = jQuery.extend(true, {}, data_conf);
	//if (svg.options) CFbi.options = svg.options;//опции с edit
	delete CFbi.conframe_bi.svg_json;
	CFbi.set_data_conframe_bi();

	for (var n in svg.nodes){//сообщения объекты и тд
		if (svg.nodes[n].group == "subject"){
			CFbi.add_sub({
					id:svg.nodes[n].id,
					label:svg.nodes[n].label,
					level:svg.nodes[n].level,
					id_subject:svg.nodes[n].id_subject||svg.nodes[n].id,
				})
		}else if (svg.nodes[n].group == "object"){

			CFbi.add_message({
				id:svg.nodes[n].id,
				label:svg.nodes[n].label,
				level:svg.nodes[n].level,
				start_time:svg.nodes[n].start_time,
				type_message:svg.nodes[n].type_message,
				id_message:svg.nodes[n].id_subject||svg.nodes[n].id,
			})
		}else{

			CFbi.add_condition({
				id:svg.nodes[n].id,
				label:svg.nodes[n].label,
				level:svg.nodes[n].level,
			})
		}
		
	}

	for (var i in svg.edges){
		
		CFbi.add_line({
			id_from:svg.edges[i].from,
			id_to:svg.edges[i].to,
			label :svg.edges[i].label,
		});
	}
	CFbi.types_subjects();

	CFbi.draw();
}
/*
	Добавить условие
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

	//CFbi.nodes.push(parametrs);
	//parametrs.label = attr.label;
	CFbi.nodes.push(jQuery.extend(true, {}, parametrs));
	CFbi.add_mass_obj(CFbi.objects,parametrs);
	if (!attr.id) CFbi.draw();
	//CFbi.draw();
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

CFbi.change_type_viewer = function(type){
	if (!type) return;
	for (var i in CFbi.type_viewer){
		if (CFbi.type_viewer[i].type == type){

			set_run(type);
			break;
		}
	}
	function set_run(type_viewer){
		CFbi.got_viewer = type_viewer;
		if (CFbi.id_conframe_bi && event_data[CFbi.id_conframe_bi] && !CFbi.event_data){
			CFbi.run(event_data[CFbi.id_conframe_bi].messages)
		}else if(CFbi.event_data){
			CFbi.run(CFbi.event_data.messages);
		}
	}

	
	CFbi.get_html_popover();//каждый раз вызывается при изменении типа
}
CFbi.set_db_event = function(json){
	
	if (!json) return;
	var db_event = {};
	db_event.messages = [];
	var messages_db = null;
	var rpl = false;
	for (var i in json){
 		rpl = false;
		messages_db = null;
		messages_db = {};
		messages_db.from = {};
		messages_db.to = {}

		messages_db.start_time = json[i].date_time;
		messages_db.id = parseInt(json[i].id);
		messages_db.message = json[i].text;

		messages_db.from.id=json[i].from_id;
		messages_db.to.id='one_id';//json[i].to_id;

		messages_db.from.name = json[i].msg_from;
		messages_db.semantic = get_sem_id(json[i].id);
		messages_db.to.name = json[i].msg_to;
		messages_db.type_message = json[i].type_message;
		messages_db.type_operator = json[i].type_operator == "NULL" ? null : json[i].type_operator;
		for (var d in db_event.messages){
            if (db_event.messages[d].id == parseInt(json[i].id)){
                rpl = true;break;
            }
        }
        if (!rpl){
            db_event.messages.push(messages_db);
        }

	}
	CFbi.event_data = db_event;
	CFbi.run(db_event.messages);
	function get_sem_id (id_message){
        var sem = [];

        for (var s in json){
            if (json[s].id == id_message && json[s].fk_situation == CFbi.situation_id && json[s].semantic_id != "ОЖУР"){
            	
                sem.push({
                    semantic_id : json[s].semantic_id,
                    id_event : json[s].id_event
                })
            }
        }
        return sem;
    }
}
$( window ).resize(function() {
    CFbi.set_offset_blocks();
    CFbi.draw();

});

CFbi.get_canvas = function(location){
    var canvas = document.getElementsByTagName('canvas');
    var context = canvas[0].getContext("2d");
    var imgData = context.getImageData(10, 10, 50, 50);
   
    if (location){
    	//document.location = canvas[0].toDataURL("image/png"); return false;
    		$("#"+CFbi.div_panel).css("background-color","white");
    		//$("#"+CFbi.div_panel).css("page-break-after","always");
    	var temp_function = function(){
			self.document.writeln('<img src="'+canvas[0].toDataURL("image/png")+'"></img>');
    		$("nav").attr("hidden",true);
			$("#footer").attr("hidden",true);
	    	$("#contentwrapper").attr("hidden",true);
    	}
    	setTimeout( temp_function, 300); return false;
    }else{
    	window.open(canvas[0].toDataURL("image/png")); return false;
    }
   
	
}
CFbi.open_situation = function(){
    if (!CFbi.situation_id) return;
    window.open( CFbi.base_url+'index.php/conframe_bi/situation/'+CFbi.situation_id )
}
CFbi.open_time = function(){
	if (!CFbi.id_conframe_bi) return;
	document.location = CFbi.base_url+'index.php/conframe_bi/atl_v1/'+CFbi.id_conframe_bi;
}

CFbi.get_icon = function(type){
    var html = '<span class="';
    if (!type || type == 'NULL'){//она же и почта
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

CFbi.get_param_options = function(sit_info){
	$('#sit_options').html(CFbi.get_option_buttons(sit_info));
}

