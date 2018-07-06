/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var BEOM = {
	xml: null, //xml данные
	network: null, //элемент визуалиции сети 
	nodes: null, //список узлов
	edges: null, //список соединений
};

var options = {
	nodes: {
		shape: "dot",
		radius: 5,
		fontColor: "white"
	},
	edges: {
		style: "arrow"
	},
	tooltip: {
		delay: 200,
		fontSize: 12,
		color: {
			background: "#fff"
		}
	},
	physics: {
		
		barnesHut: {
			enabled: false,
			theta: 1 / 0.6, // inverted to save time during calculation
			gravitationalConstant: -3500,
			centralGravity: 0.3,
			springLength: 500,
			springConstant: 0.01,
			damping: 0.09
		}
	},
	stabilize: false,
	//configurePhysics: true,
	smoothCurves: true,
	hover: true,
	groups: { 
		'object': {
			shape: 'box',
			color: '#E1BEE7',
			fontColor: '#000000',
			fontSize: '10',
			className: 'object',
		},
		'subject': {
//                shape: 'dot',
			shape: 'box',
			color: '#FFCDD2',
			fontColor: '#000000',
			fontSize: '10',				
			className: 'subject',
		},
		'type': {
//                shape: 'dot',
			shape: 'box',
			color: '#ff0000',
			fontColor: '#fff',
			fontSize: '10',				
			className: 'type',
		},
		'space': {
//                shape: 'dot',
			shape: 'box',
			color: '#bef7db',
			fontColor: '#000000',
			fontSize: '10',				
			className: 'space',
		},
		'task': {
//                shape: 'dot',
			shape: 'box',
			color: '#ffee6d',
			fontColor: '#000',
			fontSize: '10',				
			className: 'space',
		},
/*		'object_hierarchical': {
//                shape: 'dot',
			shape: 'box',
			color: '#00ff00',
			fontColor: '#000000',
			fontSize: '10',				
			className: 'space',
		},*/
		'line_1': {
			fontColor: '#0000ff',
			fontSize: '10',
		},
	}
};

/*
 * функция формирования контента network
 * 20150304
 * Vadim GRITSENKO
 */
var groups
var id_select
BEOM.load = function (id){
    if (id === "a"){
		clear_option_div()
        BEOM.load_beom_a();
    }
    else if (id === "b"){
		clear_option_div()
        //BEOM.load_beom_b();
    }
    else if (id === "c"){
		//clear_option_div()
		BEOM.load_beom_c();
    }
    else if (id === "d"){
		clear_option_div()	
        BEOM.load_beom_d();
    }
    else{
		clear_option_div()	
        BEOM.load_beom_a();
    }
}
BEOM.init = function (){
	
};

BEOM.destroy = function() {
	if (BEOM.network !== null) {
		BEOM.network.destroy();
		BEOM.network = null;
	}
	$('#content_div').empty();
	BEOM.nodes = new Array();
	BEOM.edges = new Array();
	nodes_object = null;
	nodes_subject = null;
	
}


BEOM.load_beom_a = function(){
	BEOM.destroy();

	
	//this.nodes = new vis.DataSet([]);
	var nodes_object = this.get_objects(BEOM.xml.EDOM.BEOM.OBJECTS.OBJECT);
	var nodes_subject = this.get_subjects(BEOM.xml.EDOM.BEOM.SUBJECTS.SUBJECT);
	var nodes_type = this.get_types(BEOM.xml.EDOM.BEOM.TYPES.TYPE);
	var nodes_space = this.get_spaces(BEOM.xml.EDOM.BEOM.SPACES.SPACE);
	var nodes_task = this.get_tasks(BEOM.xml.EDOM.BEOM.TASKS.TASK);
	nodes = $.merge(nodes_object, nodes_subject,nodes_type); 
	nodes = $.merge(nodes, nodes_type); 
	nodes = $.merge(nodes, nodes_space); 
	nodes = $.merge(nodes, nodes_task); 
	//nodes = $.extend(nodes_object, nodes_subject); 
	var edges = this.get_edges(BEOM.xml.EDOM.BEOM);
	
	var container = document.getElementById('content_div');
	var data = {
			nodes: [],//nodes,
			edges: [],
		};
	this.network = new vis.Network(container, data, options);
	this.nodes = BEOM.network.nodesData;
	this.edges = BEOM.network.edgesData;
	BEOM.add_nodes(nodes)
	BEOM.add_edges(edges)

    BEOM.network.on('hoverNode',function (properties){
		if (properties.node){
			document.body.style.cursor = 'pointer';
		}
    });
    BEOM.network.on('blurNode',function (properties){
        document.body.style.cursor = 'default';
    });
	
    BEOM.network.on('hold',function (properties){
        $('#pop_up_window').remove();
		if (properties.nodes.length == 0 ) return; //&& properties.edges.length == 0
		generate_context(properties);
    });

    BEOM.network.on('click',function (properties){
        $('#pop_up_window').remove();
		if ( (properties.pointer.button == 2) && ((properties.nodes.length > 0))) {
			generate_context(properties);
		}
		console.log(properties);//properties['nodes'][0]
	})	
	
	//функция генерации контекстного меню
	function generate_context(properties){
		var html = '<div id="pop_up_window" class="pop_up_window" style="position:absolute;left:'+(properties.pointer.DOM.x+230)+'px;top:'+(properties.pointer.DOM.y)+'px;"></div>';
		$('body').append(html);
		var html = '';
		if (properties.nodes.length == 1){
			menu = (BEOM.context_menu);
			id_select = properties.nodes;
			for (var i=0; i < menu.length; i++){
				html += '<li class="pop_up_item" onclick="'+menu[i]["onclick"]+'">'+menu[i]["name"]+'</li>';
			}
		}
		$('#pop_up_window').html(html);
	}    
}
//конец функции


BEOM.load_beom_c = function(){
	BEOM.destroy();
	//clear_option_div()
	var html_text = '<h2>Классификаторы</h2><div class="btn-group" role="group" ><button type="button" class="btn btn-default" id = "type_event" onclick="BEOM.load_klassification()">Типы ситуаций</button></div><div id="submenu"></div>';
	$('#div_option').html(html_text);

}
//конец функции

BEOM.load_klassification = function(){
	BEOM.destroy();
	$.ajax({
        url: BEOM.base_url+'index.php/edom/get_parent/',
        success: function(data){
			var array_parent = JSON.parse(data);
			
			var html_text = '<div class="btn-group" role="group">';
			for (position in array_parent){
				html_text += ' <button type="button" class="btn btn-default" id="object_'+array_parent[position]['id']+'" title="'+array_parent[position]['name']+'" onclick="BEOM.build_hierarchical('+array_parent[position]['id']+')">'+array_parent[position]['name_10']+'</button>';
			}
			html_text += '</div>';
			
			//$('#content_div').html(html_text);
			$('#submenu').html(html_text);
			
			$('.btn.btn-warning').removeClass('btn-warning')
			$('#type_event').addClass('btn-warning');
		}
    });

}
//конец функции


function clear_option_div (){
	$('#div_option').html('');
}

/*
 * функция формирование массива объектов
 * 20150305
 * Vadim GRITSENKO
 */
BEOM.build_hierarchical = function (id){
	$.ajax({
        url: BEOM.base_url+'index.php/edom/get_hierarchical/',
		type: 'POST',
		data: {'id':id},
        success: function(data){
			
			var info = JSON.parse(data);
			format_hierarchical = BEOM.generate_hierarchical(info);
			console.log(format_hierarchical);
            
			// create a network
            var container = document.getElementById('content_div');
			var data = {
				nodes: format_hierarchical.nodes,
				edges: format_hierarchical.edges
			};

            var options = {
				//stabilize: false,
				//smoothCurves: false,
				tooltip: {
					delay: 300,
					fontSize: 12,
					color: {
						background: "#BBDEFB"
					}
				},
                hierarchicalLayout: {
					direction: 'DU',
					layout: "direction",
					//layout: "hubsize",
                },
                edges: {style:"arrow"},
                smoothCurves:false
            };
            BEOM.network = new vis.Network(container, data, options);
			$('.btn.btn-success').removeClass('btn-success')
			$('#object_'+id).addClass('btn-success');
		}
    });
}
//конец функции

/*
 * функция формирование массива объектов
 * 20150305
 * Vadim GRITSENKO
 */
BEOM.generate_hierarchical = function (array_objects){
	var nodes = [];
	var edges = [];
	for (current in array_objects){
		nodes.push({
				id: array_objects[current].id,
				//label: array_objects[current].name, 
				label: array_objects[current].name_10, 
				title: '<div style="max-width:200px;white-space:pre-wrap;">'+array_objects[current].name+'</div>', 
				//group: 'object_hierarchical'
			})
		if (array_objects[current]['parent'] != '0'){
			//if (array_objects[current]['parent'] == '34'){
				edges.push({
						to:array_objects[current].parent,
						from: array_objects[current].id,
						
					})
			//}
		}
	}
	return {'nodes':nodes, 'edges':edges,}; 
}
//конец функции

/*
 * функция формирование массива объектов
 * 20150304
 * Vadim GRITSENKO
 */
BEOM.get_objects = function (array_objects){
	var nodes = [];
	for (current in array_objects){
		nodes.push({
				id: array_objects[current]['@attributes']['ID'],
				label: array_objects[current].NAME, 
				group: 'object'
			})
	}
	return nodes; 
	this.add_nodes(nodes);
}
//конец функции

/*
 * функция формирование массива субъектов
 * 20150304
 * Vadim GRITSENKO
 */
BEOM.get_subjects = function (array_subjects){
	if (array_subjects.NAME) array_subjects = [array_subjects]
	var nodes = [];
	for (current in array_subjects){
		nodes.push({
				id: array_subjects[current]['@attributes']['ID'],
				label: array_subjects[current].NAME, 
				group: 'subject'
			})
	}
	return nodes; 
	this.add_nodes(nodes);
}

/*
 * функция формирование массива субъектов
 * 20150304
 * Vadim GRITSENKO
 */
BEOM.get_types = function (array_subjects){
	if (array_subjects.NAME) array_subjects = [array_subjects]
	var nodes = [];
	for (current in array_subjects){
		nodes.push({
				id: array_subjects[current]['@attributes']['ID'],
				label: array_subjects[current].NAME, 
				group: 'type'
			})
	}
	return nodes; 
	this.add_nodes(nodes);
}
//конец функции

/*
 * функция формирование массива субъектов
 * 20150304
 * Vadim GRITSENKO
 */
BEOM.get_spaces = function (array_subjects){
	if (array_subjects.NAME) array_subjects = [array_subjects]
	var nodes = [];
	for (current in array_subjects){
		nodes.push({
				id: array_subjects[current]['@attributes']['ID'],
				label: array_subjects[current].NAME, 
				group: 'space'
			})
	}
	return nodes; 
	this.add_nodes(nodes);
}
//конец функции

/*
 * функция формирование массива субъектов
 * 20150304
 * Vadim GRITSENKO
 */
BEOM.get_tasks = function (array_tasks){
	if (array_tasks.NAME) array_tasks = [array_tasks]
	var nodes = [];
	for (current in array_tasks){
		nodes.push({
				id: array_tasks[current]['@attributes']['ID'],
				label: array_tasks[current].NAME, 
				group: 'task'
			})
	}
	return nodes; 
	this.add_nodes(nodes);
}
//конец функции
/*
 * функция добавления узла
 * 20150304
 * Vadim GRITSENKO
 */
BEOM.add_nodes = function (nodes){
	BEOM.nodes.add(nodes);
	//BEOM.network.nodesData.add(nodes);
}
//конец функции

/*
 * функция добавления соединения
 * 20150304
 * Vadim GRITSENKO
 */
BEOM.add_edges = function (edges){
	BEOM.edges.add(edges);
	//BEOM.network.edgesData.add(nodes);	
}
//конец функции

/*
 * функция добавления соединения
 * 20150304
 * Vadim GRITSENKO
 */
BEOM.get_edges = function (array_data){
	var edges = [];
	object = JSON.parse(JSON.stringify(array_data.OBJECTS.OBJECT));
	subject = JSON.parse(JSON.stringify(array_data.SUBJECTS.SUBJECT));
	type = JSON.parse(JSON.stringify(array_data.TYPES.TYPE));
	space = JSON.parse(JSON.stringify(array_data.SPACES.SPACE));
	task = JSON.parse(JSON.stringify(array_data.TASKS.TASK));
	array_data = $.merge(object, subject);
	array_data = $.merge(array_data, (type.NAME? [type]: type));
	array_data = $.merge(array_data, (space.NAME? [space]: space));
	array_data = $.merge(array_data, (task.NAME? [task]: task));
	for (current in array_data){
		if (array_data[current].RELATIONSHIPS.RELATIONSHIP){
			relation = array_data[current].RELATIONSHIPS.RELATIONSHIP.TO? [{'TO':array_data[current].RELATIONSHIPS.RELATIONSHIP.TO,'NAME':array_data[current].RELATIONSHIPS.RELATIONSHIP.NAME}]: array_data[current].RELATIONSHIPS.RELATIONSHIP;
			for (current_relat in relation){
				edges.push({
					to:relation[current_relat].TO,
					from:array_data[current]['@attributes']['ID'],
					label: relation[current_relat].NAME,
					fontColor: '#0000ff',
					fontSize: '10',
				})
			}
		}
	}
	return edges;
}
//конец функции

/*
 * функция вывод определение объекта
 * 20150305
 * Vadim GRITSENKO
 */
BEOM.show_definition = function (){
	$('#pop_up_window').remove();
	alert('определение '+id_select)
}
//конец функции

/*
 * функция вывод определение субъекта
 * 20150305
 * Vadim GRITSENKO
 */
BEOM.show_attributes = function (){
	$('#pop_up_window').remove();
	alert('атрибуты '+id_select)
}
//конец функции
