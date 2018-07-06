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
	array_elements: [], //список соединений
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
			enabled: true,
			theta: 1 / 0.6, // inverted to save time during calculation
			gravitationalConstant: -1500,
			centralGravity: 0.01,
			//springLength: 11500,
			springConstant: 0.009,
			//damping: 0.009
		}
	},
	stabilize: false,
	//configurePhysics: true,
	smoothCurves: true,
	hover: true,
	groups: { 
                'mObject': {
			shape: 'box',
			color: '#0277BD',
			fontColor: '#ffffff',
			fontSize: '18',
			className: 'object',
		},
                 'mTime': {
			shape: 'box',
			color: '#6D4C41',
			fontColor: '#ffffff',
			fontSize: '18',
			className: 'object',
		},
                'mSubject': {
			shape: 'box',
			color: '#2E7D32',
			fontColor: '#ffffff',
			fontSize: '18',
			className: 'object',
		},
                'mTask': {
			shape: 'box',
			color: '#DD2C00',
			fontColor: '#ffffff',
			fontSize: '18',
			className: 'object',
		},
                'mRelation': {
			shape: 'box',
			color: '#8E24AA',
			fontColor: '#ffffff',
			fontSize: '18',
			className: 'object',
		},
                'mSpace': {
			shape: 'box',
			color: '#827717',
			fontColor: '#ffffff',
			fontSize: '18',
			className: 'object',
		},
		'object': {
			shape: 'box',
			color: '#B3E5FC',
			fontColor: '#000000',
			fontSize: '10',
			className: 'object',
		},
		'subject': {
//                shape: 'dot',
			shape: 'box',
			color: '#A5D6A7',
			fontColor: '#000000',
			fontSize: '10',				
			className: 'subject',
		},
		'type': {
//                shape: 'dot',
			shape: 'box',
			color: '#ECEFF1',
			fontColor: '#000',
			fontSize: '10',				
			className: 'type',
		},
		'space': {
//                shape: 'dot',
			shape: 'box',
			color: '#F0F4C3',
			fontColor: '#000000',
			fontSize: '10',				
			className: 'space',
		},
		'task': {
//                shape: 'dot',
			shape: 'box',
			color: '#FFAB91',
			fontColor: '#000',
			fontSize: '10',				
			className: 'space',
		},
                'relation': {
//                shape: 'dot',
			shape: 'box',
			color: '#D1C4E9',
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

	//var beom_object = this.get_mbeom(BEOM.xml.EDOM.BEOM.MOBJECTS.MOBJECT);
	var beom_object = this.get_elements_beom(BEOM.xml.EDOM.BEOM.MOBJECTS.MOBJECT, 'mObject');
	//var beom_subject = this.get_mbeom(BEOM.xml.EDOM.BEOM.MSUBJECTS.MSUBJECT);
	var beom_subject = this.get_elements_beom(BEOM.xml.EDOM.BEOM.MSUBJECTS.MSUBJECT, 'mSubject');
	//var beom_task = this.get_mbeom(BEOM.xml.EDOM.BEOM.MTASKS.MTASK);
	var beom_task = this.get_elements_beom(BEOM.xml.EDOM.BEOM.MTASKS.MTASK, 'mTask');
	//var beom_relation = this.get_mbeom(BEOM.xml.EDOM.BEOM.MRELATIONS.MRELATION);
	var beom_relation = this.get_elements_beom(BEOM.xml.EDOM.BEOM.MRELATIONS.MRELATION, 'mRelation');
	//var beom_space = this.get_mbeom(BEOM.xml.EDOM.BEOM.MSPACES.MSPACE);
	var beom_space = this.get_elements_beom(BEOM.xml.EDOM.BEOM.MSPACES.MSPACE, 'mSpace');
	//var beom_time = this.get_mbeom(BEOM.xml.EDOM.BEOM.MTIMES.MTIME);
	var beom_time = this.get_elements_beom(BEOM.xml.EDOM.BEOM.MTIMES.MTIME, 'mTime');

	var nodes_object = this.get_elements_beom(BEOM.xml.EDOM.BEOM.OBJECTS.OBJECT, 'object');
	var nodes_subject = this.get_elements_beom(BEOM.xml.EDOM.BEOM.SUBJECTS.SUBJECT, 'subject');
	var nodes_type = this.get_elements_beom(BEOM.xml.EDOM.BEOM.TYPES.TYPE, 'type');
	var nodes_space = this.get_elements_beom(BEOM.xml.EDOM.BEOM.SPACES.SPACE, 'space');
	var nodes_task = this.get_elements_beom(BEOM.xml.EDOM.BEOM.TASKS.TASK, 'task');
	var nodes_relation = this.get_elements_beom(BEOM.xml.EDOM.BEOM.RELATIONS.RELATION, 'relation');
	
	nodes = $.merge(nodes_object, nodes_subject); 
	nodes = $.merge(nodes, nodes_type); 
	nodes = $.merge(nodes, nodes_space); 
	nodes = $.merge(nodes, nodes_task); 
	nodes = $.merge(nodes, nodes_relation); 

        nodes = $.merge(nodes, beom_object); 
        nodes = $.merge(nodes, beom_subject); 
        nodes = $.merge(nodes, beom_task); 
        nodes = $.merge(nodes, beom_relation); 
        nodes = $.merge(nodes, beom_space); 
        nodes = $.merge(nodes, beom_time); 
        
	//var edges = this.get_edges(BEOM.xml.EDOM.BEOM);
	var edges = this.get_edges(BEOM.array_elements);

	var container = document.getElementById('content_div');
	var data = {
			nodes: [],//nodes,
			edges: [],//edges
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

/*
 * функция очистки панели опций
 * 20150306
 * Vadim GRITSENKO
 */
function clear_option_div (){
	$('#div_option').html('');
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


BEOM.get_mbeom = function (array_objects){
	var nodes = [];
	//for (current in array_objects){
		nodes.push({
				id: array_objects['@attributes']['ID'],
				label: array_objects.NAME, 
				group: 'm'+array_objects.ENNAME
			})	
	BEOM.array_elements = $.merge(BEOM.array_elements, [array_objects]);
	//}
	return nodes; 
	//this.add_nodes(nodes);
}


/*
 * функция формирование массива объектов
 * 20150304
 * Vadim GRITSENKO
 */
BEOM.get_elements_beom = function (array_objects, group){
	array_objects = (array_objects.NAME?[array_objects]:array_objects);
	var nodes = [];
	for (current in array_objects){
		nodes.push({
				id: array_objects[current]['@attributes']['ID'],
				label: array_objects[current].NAME, 
				group: group
			})
	}
	BEOM.array_elements = $.merge(BEOM.array_elements, array_objects);
	return nodes;
}
//конец функции


BEOM.get_relations = function (array_tasks){
	if (array_tasks.NAME) array_tasks = [array_tasks]
	var nodes = [];
	for (current in array_tasks){
		nodes.push({
				id: array_tasks[current]['@attributes']['ID'],
				label: array_tasks[current].NAME, 
				group: 'relation'
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
	/*object = JSON.parse(JSON.stringify(array_data.OBJECTS.OBJECT));
	subject = JSON.parse(JSON.stringify(array_data.SUBJECTS.SUBJECT));
	type = JSON.parse(JSON.stringify(array_data.TYPES.TYPE));
	space = JSON.parse(JSON.stringify(array_data.SPACES.SPACE));
	task = JSON.parse(JSON.stringify(array_data.TASKS.TASK));
	relation = JSON.parse(JSON.stringify(array_data.RELATIONS.RELATION));
    
        mtask = JSON.parse(JSON.stringify(array_data.MTASKS.MTASK));
        mtime = JSON.parse(JSON.stringify(array_data.MTIMES.MTIME));
        msubject = JSON.parse(JSON.stringify(array_data.MSUBJECTS.MSUBJECT));
        mobject = JSON.parse(JSON.stringify(array_data.MOBJECTS.MOBJECT));
        mspace = JSON.parse(JSON.stringify(array_data.MSPACES.MSPACE));

	array_data = $.merge(object, subject);
	array_data = $.merge(array_data, (type.NAME? [type]: type));
	array_data = $.merge(array_data, (space.NAME? [space]: space));
	array_data = $.merge(array_data, (task.NAME? [task]: task));
	array_data = $.merge(array_data, (relation.NAME? [relation]: relation));
	array_data = $.merge(array_data, (mtask.NAME? [mtask]: mtask));
	array_data = $.merge(array_data, (mtime.NAME? [mtime]: mtime));
	array_data = $.merge(array_data, (msubject.NAME? [msubject]: msubject));
	array_data = $.merge(array_data, (mobject.NAME? [mobject]: mobject));
	array_data = $.merge(array_data, (mspace.NAME? [mspace]: mspace));*/
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
