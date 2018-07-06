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
	link_term: null, //список соединений
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
			springLength: 500,
			springConstant: 0.009,
			//damping: 0.009
		}
	},
	stabilize: false,
	//configurePhysics: true,
	smoothCurves: true,
	hover: true,
	//moveable: false,
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
			shape: 'box',
			color: '#A5D6A7',
			fontColor: '#000000',
			fontSize: '10',				
			className: 'subject',
		},
		'type': {
			shape: 'box',
			color: '#ECEFF1',
			fontColor: '#000',
			fontSize: '10',				
			className: 'type',
		},
		'space': {
			shape: 'box',
			color: '#F0F4C3',
			fontColor: '#000000',
			fontSize: '10',				
			className: 'space',
		},
		'task': {
			shape: 'box',
			color: '#FFAB91',
			fontColor: '#000',
			fontSize: '10',				
			className: 'task',
		},
		'relation': {
			shape: 'box',
			color: '#D1C4E9',
			fontColor: '#000',
			fontSize: '10',				
			className: 'relation',
		},
		'time': {
			shape: 'box',
			color: '#6D4C41',
			fontColor: '#ffffff',
			fontSize: '10',
			className: 'time',
		},		
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
var choose_object
BEOM.load = function (id){
    if (id === "a"){
		clear_option_div()
        BEOM.load_beom_a();
    }
    else if (id === "b"){
		clear_option_div()
        BEOM.load_beom_b();
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
	$('#pop_up_window').remove();
	BEOM.nodes = new Array();
	BEOM.edges = new Array();
	BEOM.array_elements = new Array();
	nodes_object = null;
	nodes_subject = null;
	
}


BEOM.load_beom_a = function(){
	BEOM.destroy();
	
	if (BEOM.xml.EDOM.BEOM.NAME) {$('#name_beom').html(BEOM.xml.EDOM.BEOM.NAME)}
		
	nodes = $.merge(this.get_elements_beom(BEOM.xml.EDOM.BEOM.OBJECTS.OBJECT, 'object', 'object'), this.get_elements_beom(BEOM.xml.EDOM.BEOM.SUBJECTS.SUBJECT, 'subject', 'subject')); 
	nodes = $.merge(nodes, this.get_elements_beom(BEOM.xml.EDOM.BEOM.TYPES.TYPE, 'type','type')); 
	nodes = $.merge(nodes, this.get_elements_beom(BEOM.xml.EDOM.BEOM.SPACES.SPACE, 'space', 'space')); 
	nodes = $.merge(nodes, this.get_elements_beom(BEOM.xml.EDOM.BEOM.TASKS.TASK, 'task', 'task')); 
	nodes = $.merge(nodes, this.get_elements_beom(BEOM.xml.EDOM.BEOM.RELATIONS.RELATION, 'relation', 'relation')); 

        nodes = $.merge(nodes, this.get_elements_beom(BEOM.xml.EDOM.BEOM.MOBJECTS.MOBJECT, 'mObject', 'object')); 
        nodes = $.merge(nodes, this.get_elements_beom(BEOM.xml.EDOM.BEOM.MSUBJECTS.MSUBJECT, 'mSubject', 'subject')); 
        nodes = $.merge(nodes, this.get_elements_beom(BEOM.xml.EDOM.BEOM.MTASKS.MTASK, 'mTask', 'task')); 
        nodes = $.merge(nodes, this.get_elements_beom(BEOM.xml.EDOM.BEOM.MRELATIONS.MRELATION, 'mRelation', 'relation')); 
        nodes = $.merge(nodes, this.get_elements_beom(BEOM.xml.EDOM.BEOM.MSPACES.MSPACE, 'mSpace', 'space')); 
        nodes = $.merge(nodes, this.get_elements_beom(BEOM.xml.EDOM.BEOM.MTIMES.MTIME, 'mTime', 'time')); 
    
	//var edges = this.get_edges(BEOM.xml.EDOM.BEOM); '<a id="dl" download="Canvas.png">Download Canvas</a>'
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
		if (properties.nodes.length != 1 || properties.edges.length != 1) return; //&& properties.edges.length == 0
		generate_context(properties);
    });	
	
    BEOM.network.on('mousedown',function (properties){
		alert(1)
    });

    BEOM.network.on('click',function (properties){
        $('#pop_up_window').remove();
		if (properties.pointer.button == 2) {
			if ((properties.nodes.length == 1)) {
				choose_object = BEOM.network.nodesData._data[properties['nodes'][0]];	
				generate_context(properties, BEOM.context_menu.entity.visualization);
			}
			else if ((properties.edges.length == 1)){
				choose_object = BEOM.network.edgesData._data[properties['edges'][0]];
				generate_context(properties, BEOM.context_menu.link.visualization);
			}
		}
		if (properties.pointer.button == 0) {
			if ((properties.nodes.length == 1)) {
				choose_object = BEOM.network.nodesData._data[properties['nodes'][0]];	
				generate_coi(properties, choose_object);
			}
			else if ((properties.edges.length == 1)){
				choose_object = BEOM.network.edgesData._data[properties['edges'][0]];
				generate_coi(properties, choose_object);
			}
		}
	})
	
	$(document).mousedown(function (e) {
		var container = $("#pop_up_window");
		if (container.has(e.target).length === 0){
			container.remove();
		}
	});	
	
	//функция генерации контекстного меню
	function generate_coi(properties,choose_object){
		var html = '<div id="pop_up_window" class="pop_up_window" style="position:absolute;left:'+(properties.pointer.DOM.x+230)+'px;top:'+(properties.pointer.DOM.y)+'px;"></div>';
		$('body').append(html);
		var html = '';
		html += '<table border = 2>';
		html += '<tr><td>Наименование</td><td>'+(choose_object.xml_object.NAME?choose_object.xml_object.NAME:'-')+'</td></tr>';
		html += '<tr><td>Аббревиатура</td><td>'+(choose_object.xml_object.ABBREVIATION?choose_object.xml_object.ABBREVIATION:'-')+'</td></tr>';
		html += '<tr><td>SID</td><td>'+(choose_object.xml_object.SID?choose_object.xml_object.SID:'-')+'</td></tr>';
		if (choose_object.xml_object.TO) html += '<tr><td>Тип</td><td>'+(choose_object.xml_object.TYPE?choose_object.xml_object.TYPE:'-')+'</td></tr>';
		html += '</table>';

		$('#pop_up_window').html(html);
	}    

	//функция генерации контекстного меню
	function generate_context(properties,menu){
		var html = '<div id="pop_up_window" class="pop_up_window" style="position:absolute;left:'+(properties.pointer.DOM.x+230)+'px;top:'+(properties.pointer.DOM.y)+'px;"></div>';
		$('body').append(html);
		var html = '';
		if (properties.nodes.length == 1 || properties.edges.length == 1){
			id_select = properties.nodes;
			for (var i=0; i < menu.length; i++){
				html += '<li class="pop_up_item" onclick="'+menu[i]["onclick"]+'">'+menu[i]["name"]+'</li>';
			}
		}
		if (html != '') $('#pop_up_window').html(html);
		else $('#pop_up_window').remove();
	}    

	
	$('#div_option').html('<a id="table_form">'+'Таблица'+'</a>&nbsp&nbsp<a id="page_print">'+'Печать'+'</a>&nbsp&nbsp<a id="open_editor">'+'Открыть редактор'+'</a>&nbsp&nbsp<a id="load_file">'+'Открыть файл'+'</a>');
	
	$('#open_editor').click('click', BEOM.open_editor, false);	
	$('#load_file').click('click', BEOM.load_file, false);	

	$('#page_print').click('click', function(ev) {
		window_open = window.open(BEOM.base_url+'/index.php/edom/page_print/'+BEOM.name_file,'QuaSy','left=530,width=1000,height=900,resizable=yes,location=no,modal=yes');
		window_open.focus();
	}, false);

	
	$('#table_form').click('click', function(ev) {
		window_open = window.open(BEOM.base_url+'/index.php/edom/table_form/'+BEOM.name_file,'QuaSy','left=530,width=1000,height=900,resizable=yes,location=no,modal=yes');
		window_open.focus();
	}, false);

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
				label: array_objects[current].name_10 || array_objects[current].name, 
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
BEOM.get_elements_beom = function (array_objects, group, type){
	array_objects = processing_xml(array_objects);
	//array_objects = (array_objects.NAME?[array_objects]:array_objects);
	var nodes = [];
	for (current in array_objects){
		nodes.push({
				id: array_objects[current]['@attributes']['ID'],
				label: array_objects[current].NAME, 
				term: (array_objects[current].TERM?array_objects[current].TERM:''),
				position_entity: current,
				type: type, 
				xml_object: array_objects[current], 
				group: group,
				article: (array_objects[current].ARTICLE?array_objects[current].ARTICLE:''),				
				attributes: get_fields_array(array_objects[current],'ATTRIBUTES','ATTRIBUTE'),				
				links: get_fields_array(array_objects[current],'RELATIONSHIPS','RELATIONSHIP'),
			})
	}
	BEOM.array_elements = $.merge(BEOM.array_elements, array_objects);
	return nodes;
}
//конец функции
get_fields_array = function(current_object, field_1, field_2){
	var result_array = [];
	try{
		result_array = processing_xml(current_object[field_1][field_2]);
	}
	catch(err){result_array = [];}
	return result_array;
}

/*
 * функция добавления узла
 * 20150304
 * Vadim GRITSENKO
 */
BEOM.add_nodes = function (nodes){
	BEOM.nodes.add(nodes);
}
//конец функции

/*
 * функция добавления соединения
 * 20150304
 * Vadim GRITSENKO
 */
BEOM.add_edges = function (edges){
	BEOM.edges.add(edges);
}
//конец функции

/*
 * функция добавления соединения
 * 20150304
 * Vadim GRITSENKO
 */
BEOM.get_edges = function (array_data){
	var edges = [];
	for (current in array_data){
		if (array_data[current].RELATIONSHIPS.RELATIONSHIP){
			relation = processing_xml(array_data[current].RELATIONSHIPS.RELATIONSHIP);
			for (current_relat in relation){
				edges.push({
					to:relation[current_relat].TO,
					from:array_data[current]['@attributes']['ID'],
					label: relation[current_relat].NAME,
					position_link: current_relat,
					fontColor: '#0000ff',
					fontSize: '10',
					term: (relation[current_relat].TERM?relation[current_relat].TERM:''),
					article: (relation[current_relat].ARTICLE?relation[current_relat].ARTICLE:''),
					xml_object: relation[current_relat], 
				})
			}
		}
	}
	return edges;
}
//конец функции

/*
 * функция вывода окна терминологии сущности 
 * 20150312
 * Vadim GRITSENKO
 */
BEOM.show_definition = function (){
	$('#pop_up_window').remove();

	if (choose_object.term !='' || ($.type(choose_object.term) != 'object')){
		html = $.ajax({     
			url: BEOM.link_term+(choose_object.term.toLowerCase()),
			type: "POST"
		}).done(function (response, textStatus, jqXHRб){
			result = JSON.parse(response);
			html_text = (result.length>0?get_html_term(result[0]):'Нет данных');
			load_window( { id: 'window_util', title: 'Термины', html: html_text, width:700})
		});
	}
	else {
		load_window( { id: 'window_util', title: 'Термины', html: 'Не указан термин', width:700})
	}
	
}
//конец функции


/*
 * функция генерации html-кода окна терминологии 
 * 20150312
 * Vadim GRITSENKO
 */
function get_html_term (array_term){

	html_text = '<table class="table table-condensed" style="font-size:12px">';
	html_text += '<tr><td><label>Термин</label></td><td>'+array_term['term']+'</td></tr>';
	html_text += '<tr><td><label>SID</label></td><td>'+''+'</td></tr>';
	html_text += '<tr><td><label>Определение</label></td><td>'+array_term['definition']+'</td></tr>';
	html_text += '<tr><td><label>Аббревиатура</label></td><td>'+array_term['abbrev']+'</td></tr>';
	html_text += '<tr><td><label>Дата последнего изменения</label></td><td>'+array_term['modify_date']+'</td></tr>';
	html_text += '</table>';
	
	return html_text;
}
//конец функции


/*
 * функция вывод описания сущности
 * 20150313
 * Vadim GRITSENKO
 */
BEOM.show_profile = function (){
	$('#pop_up_window').remove();
	if ((choose_object.article) && choose_object.article != '' && $.type(choose_object.article)!='object') {
		link_profile = choose_object.article;
	}
	else {
		alert('Нет описания в Qwiki');
		return;
	}
	window.open(BEOM.path_wiki+link_profile);
}
//конец функции

/*
 * функция построения топологии (A) сущности
 * 20150313
 * Vadim GRITSENKO
 */
BEOM.build_topology_a = function (){
	$('#pop_up_window').remove();
	window_open = window.open(BEOM.base_url+'/index.php/edom/build_topology_a/'+choose_object.type+'/'+BEOM.name_file,choose_object.type,choose_object.type,'left=530,width=800,height=900,resizable=yes,location=no,modal=yes');
	window_open.focus();
	//alert('построение топологии '+id_select)
}
//конец функции

/*
 * функция построения топологии (B) сущности
 * 20150318
 * Vadim GRITSENKO
 */
BEOM.build_topology_b = function (){
	$('#pop_up_window').remove();
	window_open = window.open(BEOM.base_url+'/index.php/edom/build_topology_b/'+choose_object.id+'/'+choose_object.type+'/'+choose_object.position_entity+'/'+BEOM.name_file,choose_object.type,'left=530,width=800,height=900,resizable=yes,location=no,modal=yes');
	window_open.focus();
}
//конец функции

/*
 * функция открытия редактора
 * 20150319
 * Vadim GRITSENKO
 */
BEOM.open_editor = function (){
	$('#pop_up_window').remove();
	window.open (BEOM.base_url+'index.php/edom/open_beom_editor/');
}
//конец функции


/*
 * функция загрузки диалогового окна
 * 20150316
 * Vadim GRITSENKO
 */
function load_window(data_window){
	
    var dialog = CFUtil.dialog.create(data_window.id,
	{
		title: data_window.title, // переделать langs
		autoOpen: false,
		height: "auto",
		width: (data_window.width?data_window.width:400),
		modal: true,
		resizable:false
	});
	if (dialog){
		$(dialog).html(data_window.html)
    }
}
//конец функции

function processing_xml(array_xml){
	
	return (array_xml.NAME ? [array_xml] : ($.type(array_xml) === 'object'? []:array_xml));
	//return (array_xml.NAME ? [array_xml] : array_xml);
}


/*
 * функция загрузки xml-файла
 * 201500406
 * Vadim GRITSENKO
 */
BEOM.load_file = function(){
	html = $.ajax({     
		url: base_url+'index.php/edom/load_file',
		type: "POST",
	}).done(function (response, textStatus, jqXHRб){
		result = JSON.parse(response);

		select_options = gen_options_select(result);

		html = '<label>Название файла</label><br>';
		html += '<select id="input_name_file" class="form-control">';
		html += select_options;
		html += '<select><br>';	

		html += '<button type="button" class="btn btn-primary" onclick="BEOM.load_data_file($(\'#input_name_file\').val())">Загрузить файл</button>';
		
		data_window = { id: 'window_util', title: 'Загрузка файла', html: html}
		
		load_window(data_window);
	});
}
//конец функции

/*
 * функция загрузка данных из файла
 * 20150406
 * Vadim GRITSENKO
 */
BEOM.load_data_file = function (name_file){
	location.href = BEOM.base_url+'/index.php/edom/xml/'+name_file
}
//конец функции