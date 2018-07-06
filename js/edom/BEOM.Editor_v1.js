/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var BEOM_editor = {
	name_file: null,
	name_structure: null,
};


/*
 * функция формирования контента network
 * 20150304
 * Vadim GRITSENKO
 */
var groups
var id_select
var choose_object

BEOM_editor.init = function (){

	//$('#div_option').html('<a id="add_link">'+'Добавить связь'+'</a>&nbsp&nbsp<a id="add_entity">'+'Добавить сущность'+'</a>');
	panel_button = '<div class="btn-group" role="group" aria-label="..."><a id="add_link" title="Добавить связь"><button type="button" class="btn btn-default">'+'<span class="glyphicon glyphicon-sort-by-order" aria-hidden="true"></span>'+'</button></a><a id="add_entity" title="Добавить сущность"><button type="button" class="btn btn-default">'+'<span class="glyphicon glyphicon-subtitles" aria-hidden="true"></span>'+'</button></a>'
	
	

	$('#div_tool_object').html(panel_button)
	
	var container = document.getElementById('content_div');
	var data = {
			nodes: [],//nodes,
			edges: [],//edges
		};
	BEOM.network = new vis.Network(container, data, options);
	
	BEOM.nodes = BEOM.network.nodesData;
	BEOM.edges = BEOM.network.edgesData;	

	$('#add_link').click('click', BEOM_editor.add_link, false);
	$('#add_entity').click('click', BEOM_editor.add_entity, false);
	$('#save_xml').click('click', BEOM_editor.save_xml, false);

	$('#name_file').mousedown(function(event){
		event.preventDefault();
		if(event.button == 2){
			$('#pop_up_window').remove();
			generate_context({X:event.clientX, Y:event.clientY}, BEOM_editor.context_menu.file.modeler);
		}
	});
	
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
		if (properties.nodes.length != 1) generate_context({X:properties.pointer.DOM.x, Y:properties.pointer.DOM.y}, BEOM_editor.context_menu.entity.modeler);
		if (properties.edges.length != 1) generate_context({X:properties.pointer.DOM.x, Y:properties.pointer.DOM.y}, BEOM_editor.context_menu.link.modeler); //&& properties.edges.length == 0
    });

    BEOM.network.on('click',function (properties){
        $('#pop_up_window').remove();
		if (properties.pointer.button == 2) {
			if ((properties.nodes.length == 1)) {
				choose_object = BEOM.network.nodesData._data[properties['nodes'][0]];	
				generate_context({X:properties.pointer.DOM.x, Y:properties.pointer.DOM.y}, BEOM_editor.context_menu.entity.modeler);
			}
			else if ((properties.edges.length == 1)){
				choose_object = BEOM.network.edgesData._data[properties['edges'][0]];
				generate_context({X:properties.pointer.DOM.x, Y:properties.pointer.DOM.y}, BEOM_editor.context_menu.link.modeler);
			}
		}		
	})
	
};

//функция генерации контекстного меню
function generate_context(coordinates,menu){
	var html = '<div id="pop_up_window" class="pop_up_window" style="position:absolute;left:'+(coordinates.X+30)+'px;top:'+(coordinates.Y)+'px;"></div>';
	$('body').append(html);
	var html = '';
	for (var i=0; i < menu.length; i++){
		html += '<li class="pop_up_item" onclick="'+menu[i]["onclick"]+'">'+menu[i]["name"]+'</li>';
	}
	if (html != '') $('#pop_up_window').html(html);
	else $('#pop_up_window').remove();
} 
	
/*
 * функция загрузка на холст данных xml
 * 20150319
 * Vadim GRITSENKO
 */
BEOM_editor.load_beom = function (){
	if (BEOM.xml.EDOM.BEOM.NAME) {$('#name_beom').html(BEOM.xml.EDOM.BEOM.NAME)}

	nodes = $.merge(BEOM.get_elements_beom(BEOM.xml.EDOM.BEOM.OBJECTS.OBJECT, 'object', 'object'), BEOM.get_elements_beom(BEOM.xml.EDOM.BEOM.SUBJECTS.SUBJECT, 'subject', 'subject')); 
	nodes = $.merge(nodes, BEOM.get_elements_beom(BEOM.xml.EDOM.BEOM.TYPES.TYPE, 'type','type')); 
	nodes = $.merge(nodes, BEOM.get_elements_beom(BEOM.xml.EDOM.BEOM.SPACES.SPACE, 'space', 'space')); 
	nodes = $.merge(nodes, BEOM.get_elements_beom(BEOM.xml.EDOM.BEOM.TASKS.TASK, 'task', 'task')); 
	nodes = $.merge(nodes, BEOM.get_elements_beom(BEOM.xml.EDOM.BEOM.RELATIONS.RELATION, 'relation', 'relation')); 

	nodes = $.merge(nodes, BEOM.get_elements_beom(BEOM.xml.EDOM.BEOM.MOBJECTS.MOBJECT, 'mObject', 'object')); 
	nodes = $.merge(nodes, BEOM.get_elements_beom(BEOM.xml.EDOM.BEOM.MSUBJECTS.MSUBJECT, 'mSubject', 'subject')); 
	nodes = $.merge(nodes, BEOM.get_elements_beom(BEOM.xml.EDOM.BEOM.MTASKS.MTASK, 'mTask', 'task')); 
	nodes = $.merge(nodes, BEOM.get_elements_beom(BEOM.xml.EDOM.BEOM.MRELATIONS.MRELATION, 'mRelation', 'relation')); 
	nodes = $.merge(nodes, BEOM.get_elements_beom(BEOM.xml.EDOM.BEOM.MSPACES.MSPACE, 'mSpace', 'space')); 
	nodes = $.merge(nodes, BEOM.get_elements_beom(BEOM.xml.EDOM.BEOM.MTIMES.MTIME, 'mTime', 'time'));

	edges = BEOM.get_edges(BEOM.array_elements);
	
	BEOM.add_nodes (nodes);
	BEOM.add_edges (edges);

}
//конец функции

/*
 * функция добавления связи
 * 20150313
 * Vadim GRITSENKO
 */
BEOM_editor.add_link_to_entity = function (){
	$('#window_util').dialog('close')
	$('#pop_up_window').remove()
	html = get_html_link_window();
	html += '<button type="button" class="btn btn-primary" onclick="generate_link()">Сгенерировать связь</button>';
	
	data_window = { id: 'window_util', title: 'Добавление связи', html: html}	
	load_window(data_window);

	$('#entity_A').val(choose_object.id).attr('disabled','disabled')
}
//конец функции

/*
 * функция добавления связи
 * 20150313
 * Vadim GRITSENKO
 */
BEOM_editor.add_link = function (){
	$('#window_util').dialog('close');
	$('#pop_up_window').remove()
	html = get_html_link_window();
	html += '<button type="button" class="btn btn-primary" onclick="generate_link()">Сгенерировать связь</button>';
	
	data_window = { id: 'window_util', title: 'Добавление связи', html: html}	
	load_window(data_window);
}
//конец функции

/*
 * функция получения html-кода для окна добавления и редактирование связей
 * 20150316
 * Vadim GRITSENKO
 */
function get_html_link_window(){
	select_options = gen_options_select(BEOM.nodes._data);

	html = '<label>Сущность А</label>';
	html += '<select id="entity_A" class="form-control">';
	html += select_options;
	html += '<select>';

	html += '<label>Связь</label>';
	html += '<input type="text" id="type_link" class="form-control" placeholder="Тип связи"/>';
	
	html += '<label>Сущность B</label>';
	html += '<select id="entity_B" class="form-control">';
	html += select_options;
	html += '<select>';

	html += '<label>Абревиатура</label>';
	html += '<input type="text" id="abbreviation" class="form-control" placeholder="Абревиатура"/>';
	
	html += '<label>SID</label>';
	html += '<input type="text" id="sid" class="form-control" placeholder="SID"/>';
	
	html += '<label>Термин</label>';
	html += '<input type="text" id="term" class="form-control" placeholder="Термин"/>';
	
	html += '<label>Статья</label>';
	html += '<input type="text" id="article" class="form-control" placeholder="Статья"/>';
	
	return html;
}
//конец функции

function gen_options_select(array_nodes){
	select_html = '';
	for (id in array_nodes){
		select_html += '<option value="'+id+'">'+array_nodes[id]['label']+'</option>';
	}
	return select_html;
}


/*
 * функция генерации связи на холсте vis.js
 * 20150316
 * Vadim GRITSENKO
 */
function generate_link(){
	if ($('#entity_A').val() != ''){
		array_link = add_link_to_xml();
		BEOM.add_edges([{
						to: $('#entity_B').val(),
						from: $('#entity_A').val(),
						label: $('#type_link').val(),
						sid: $('#sid').val(),
						article: $('#article').val(),
						term: $('#term').val(),
						abbreviation: $('#abbreviation').val(),
						fontColor: '#0000ff',
						fontSize: '10',
						position_link: array_link.length-1,
						xml_object: array_link[array_link.length-1],
					}]);
		
		$('#window_util').remove();
		alert('Линия добавлена')
	}
}
//конец функции



/*
 * функция добавления связи в xml-объект
 * 20150316
 * Vadim GRITSENKO
 */
function add_link_to_xml(){
	entity_A = null
	entity_A = BEOM.nodes._data[$('#entity_A').val()]['xml_object'];
	entity_A.RELATIONSHIPS.RELATIONSHIP = processing_xml(entity_A.RELATIONSHIPS.RELATIONSHIP)
	entity_A.RELATIONSHIPS.RELATIONSHIP = $.makeArray(entity_A.RELATIONSHIPS.RELATIONSHIP?entity_A.RELATIONSHIPS.RELATIONSHIP:[]);
	entity_A.RELATIONSHIPS.RELATIONSHIP = [
		{
			TO:$('#entity_B').val(), 
			NAME: $('#type_link').val(), 
			TERM: $('#term').val(), 
			SID: $('#sid').val(), 
			ARTICLE: $('#article').val(), 
			ABBREVIATION: $('#abbreviation').val()
		}].concat((entity_A.RELATIONSHIPS.RELATIONSHIP.TO? [entity_A.RELATIONSHIPS.RELATIONSHIP]:(entity_A.RELATIONSHIPS.RELATIONSHIP)));
	return entity_A.RELATIONSHIPS.RELATIONSHIP;
}
//конец функции


/*
 * функция редактирования связи
 * 20150316
 * Vadim GRITSENKO
 */
BEOM_editor.edit_link = function (){
	$('#pop_up_window').remove();

	html = '<label>Связь</label>';
	html += '<input type="text" id="type_link" class="form-control" placeholder="Тип связи"/>';

	html += '<label>Абревиатура</label>';
	html += '<input type="text" id="abbreviation" class="form-control" placeholder="Абревиатура"/>';
	
	html += '<label>SID</label>';
	html += '<input type="text" id="sid" class="form-control" placeholder="SID"/>';
	
	html += '<label>Термин</label>';
	html += '<input type="text" id="term" class="form-control" placeholder="Термин"/>';
	
	html += '<label>Статья</label>';
	html += '<input type="text" id="article" class="form-control" placeholder="Статья"/>';
		
	
	//html = get_html_link_window();	
	html += '<button type="button" class="btn btn-primary" onclick="save_change_link()">Сохранить изменения</button>';
	//data_window = { id: 'window_edit_link', title: 'Редактирование связи', html: html}
	data_window = { id: 'window_util', title: 'Редактирование связи', html: html}

	load_window(data_window);
	//$('#entity_A').val(choose_object.from);
	//$('#entity_B').val(choose_object.to);
	$('#type_link').val(BEOM.network.edges[choose_object.id].label);
	$('#sid').val(choose_object.xml_object.SID);
	$('#abbreviation').val($.type(choose_object.xml_object.ABBREVIATION)=='object'?'':choose_object.xml_object.ABBREVIATION);
	$('#term').val(choose_object.xml_object.TERM);
	$('#article').val(choose_object.xml_object.ATRICLE);
	
}
//конец функции



/*
 * функция сохранения изменения связи
 * 20150316
 * Vadim GRITSENKO
 */
function save_change_link(){
	BEOM.edges.update({
			id:choose_object.id,
			//to:$('#entity_B').val(),
			//from:$('#entity_A').val(),
			label:$('#type_link').val(),
		});
	//BEOM.network.edges[choose_object.id].label = $('#type_link').val();
	
	entity_A = BEOM.nodes._data[choose_object.from]['xml_object'];
	choose_object.xml_object.NAME = $('#type_link').val();
	choose_object.xml_object.SID = $('#sid').val();
	choose_object.xml_object.ABBREVIATION = $('#abbreviation').val();
	choose_object.xml_object.TERM = $('#term').val();
	choose_object.xml_object.ARTICLE = $('#article').val();
	$('#window_util').remove();
}
//конец функции


/*
 * функция удаление связи
 * 20150316
 * Vadim GRITSENKO
 */
BEOM_editor.remove_link = function(){
	entity_A = BEOM.nodes._data[BEOM.edges._data[choose_object.id].from]['xml_object'];
	delete entity_A.RELATIONSHIPS.RELATIONSHIP[choose_object.position_link];
	
	BEOM.edges.remove(choose_object.id);
	$('#window_edit_link').remove();
	$('#pop_up_window').remove();
}
//конец функции


/*
 * функция добавления сущности
 * 20150316
 * Vadim GRITSENKO
 */
BEOM_editor.add_entity = function (){
	$('#window_util').remove();
	html = get_html_entity_window();
	html += '<button type="button" class="btn btn-primary" onclick="generate_entity()">Добавить сущность</button>';
	
	data_window = { id: 'window_util', title: 'Добавление сущности', html: html}
	
	load_window(data_window);
}
//конец функции



/*
 * функция получения html-кода для окна добавления и редактирование связей
 * 20150316
 * Vadim GRITSENKO
 */
function get_html_entity_window(){
	select_options = gen_options_select(BEOM_editor.list_type_entity);

	html = '<label>Тип сущности</label>';
	html += '<select id="type" class="form-control">';
	html += select_options;
	html += '<select>';

	html += '<label>Идентификатор</label>';
	html += '<input type="text" id="id_entity" class="form-control" placeholder="Идентификатор"/>';

	html += '<label>Наименование</label>';
	html += '<input type="text" id="name" class="form-control" placeholder="Наименование"/>';
	
	html += '<label>Английское наименование</label>';
	html += '<input type="text" id="enname" class="form-control" placeholder="Термин"/>';

	html += '<label>Абревиатура</label>';
	html += '<input type="text" id="abbreviation" class="form-control" placeholder="Абревиатура"/>';
	
	html += '<label>SID</label>';
	html += '<input type="text" id="sid" class="form-control" placeholder="SID"/>';
	
	html += '<label>Термин</label>';
	html += '<input type="text" id="term" class="form-control" placeholder="Термин"/>';
	
	html += '<label>Статья</label>';
	html += '<input type="text" id="article" class="form-control" placeholder="Статья"/>';
	
	return html;
}
//конец функции


/*
 * функция генерации сущности на холсте vis.js
 * 20150316
 * Vadim GRITSENKO
 */
function generate_entity(){
	if ($('#id_entity').val() != '' || $('#name').val() != '' || $('#term').val() != ''){
		BEOM.xml.EDOM.BEOM[$('#type').val().toUpperCase()+'S'][$('#type').val().toUpperCase()] = processing_xml(BEOM.xml.EDOM.BEOM[$('#type').val().toUpperCase()+'S'][$('#type').val().toUpperCase()]);
		objects_entity = BEOM.xml.EDOM.BEOM[$('#type').val().toUpperCase()+'S'][$('#type').val().toUpperCase()];
		objects_entity.push({
				'@attributes':{ID:$('#id_entity').val()},
				'ENNAME':$('#enname').val(),
				'NAME':$('#name').val(),
				'RELATIONSHIPS':{RELATIONSHIP:[]},
				'TERM':$('#name').val(),
				'ARTICLE':$('#article').val(),
				'SID':$('#sid').val(),
				'ABBREVIATION':$('#abbreviation').val(),
			})
		BEOM.add_nodes([
				{
					id: $('#id_entity').val(),
					label: $('#name').val(), 
					term: $('#term').val(),
					type: $('#type').val(), 
					article: $('#article').val(), 
					sid: $('#sid').val(), 
					xml_object: objects_entity[objects_entity.length-1], 
					position_entity: objects_entity.length-1, 
					group: $('#type').val()
				}
			]);
		$('#window_util').remove();
		alert('Сущность добавлена');
	}
}
//конец функции

/*
 * функция загрузки xml-файла
 * 20150316
 * Vadim GRITSENKO
 */
BEOM_editor.load_file = function(){
	html = $.ajax({     
		url: base_url+'index.php/edom/load_file',
		type: "POST",
	}).done(function (response, textStatus, jqXHRб){
		result = JSON.parse(response);

		select_options = gen_options_select(result);

		html = '<label>Название файла</label>';
		html += '<select id="input_name_file" class="form-control">';
		html += select_options;
		html += '<select>';	

		html += '<button type="button" class="btn btn-primary" onclick="BEOM_editor.get_data_file($(\'#input_name_file\').val())">Загрузить файл</button>';
		
		data_window = { id: 'window_util', title: 'Загрузка файла', html: html}
		
		load_window(data_window);
	});
}
//конец функции

/*
 * функция сохранения xml
 * 20150316
 * Vadim GRITSENKO
 */
BEOM_editor.get_data_file = function (name_file){
	location.href = BEOM_editor.base_url+'/index.php/edom/open_beom_editor/'+name_file
}
//конец функции

/*
 * функция удаление сущности
 * 20150316
 * Vadim GRITSENKO
 */
BEOM_editor.remove_entity = function(){
	delete BEOM.xml.EDOM.BEOM[choose_object.type.toUpperCase()+'S'][choose_object.type.toUpperCase()].splice(choose_object.position_entity, 1)
	
	BEOM.nodes.remove(choose_object.id);
	$('#pop_up_window').remove();
}
//конец функции

/*
 * функция редактирование сущности
 * 20150316
 * Vadim GRITSENKO
 */
BEOM_editor.edit_entity = function(){
	$('#pop_up_window').remove();
	//html = get_html_entity_window();

	html = '<label>Наименование</label>';
	html += '<input type="text" id="name" class="form-control" placeholder="Наименование"/>';
	
	html += '<label>Термин</label>';
	html += '<input type="text" id="term" class="form-control" placeholder="Термин"/>';
	
	html += '<label>Идентификатор</label>';
	html += '<input type="text" id="id_entity" class="form-control" placeholder="Идентификатор"/>';
	
	html += '<label>Абревиатура</label>';
	html += '<input type="text" id="abbreviation" class="form-control" placeholder="Абревиатура"/>';
	
	html += '<label>SID</label>';
	html += '<input type="text" id="sid" class="form-control" placeholder="SID"/>';
	
	html += '<label>Английское наименование</label>';
	html += '<input type="text" id="enname" class="form-control" placeholder="Термин"/>';
	
	html += '<label>Статья</label>';
	html += '<input type="text" id="article" class="form-control" placeholder="Статья"/>';
	
	html += '<label>Соединения <button class="pull-right" onclick="BEOM_editor.add_link_to_entity()"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></button></label>';
	html += '<select multiple id="links" class="form-control"></select>';
	
	html += '<label>Атрибуты <button class="pull-right" onclick="BEOM_editor.add_attribute()"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></button></label>';
	html += '<select multiple id="attributes" class="form-control"></select>';
	//html += '<input type="text" id="attributes" class="form-control" placeholder="Атрибуты"/>';

	html += '<button type="button" class="btn btn-primary" onclick="save_change_entity()">Изменить сущность</button>';
	
	data_window = { id: 'window_util', title: 'Редактирование сущности', html: html}

	load_window(data_window);
	
	$('#name').val(choose_object.label);
	$('#id_entity').val(choose_object.xml_object['@attributes']['ID']);
	$('#term').val(choose_object.term);
	$('#abbreviation').val(choose_object.xml_object.ABBREVIATION);
	$('#sid').val(choose_object.xml_object.SID);
	$('#enname').val(choose_object.xml_object.ENNAME);
	$('#article').val(choose_object.xml_object.ARTICLE);
	$('#attributes').html(get_option_multi(choose_object.attributes))
	$('#links').html(get_option_multi(choose_object.links))
}
//конец функции

get_option_multi = function(array_options){
	html_text = '';
	for(pos in array_options){
		html_text += '<option>' + array_options[pos]['NAME'] + '</option>';
	}
	return html_text;
}

/*
 * функция добавления атрибутов
 * 20160118
 * Vadim GRITSENKO
 */
BEOM_editor.add_attribute = function(){
	$('#pop_up_window').remove();
	
	html = '<label>Атрибуты</label>';

	html += '<table id="table_attr" style="width:100%">';
	html += '<thead><tr><th>Наименование</th><th>Тип</th><th></th></tr></thead><tbody>';
	html += '</tbody></table>';

	html += '<button type="button" class="btn btn-primary" onclick="save_new_attributes()">Обновить атрибуты</button>';
	
	data_window = { id: 'window_util', title: 'Добавление атрибутов', html: html}

	load_window(data_window);

	for(pos in choose_object.attributes){
		append_row();
		$('#table_attr tr:last #name_attr').val(choose_object.attributes[pos]['NAME'])
		$('#table_attr tr:last #type_attr').val(choose_object.attributes[pos]['TYPE'])
	}
	append_row();
}

append_row = function(){
	$('#table_attr tbody').append('<tr><td><input id="name_attr" style="width:100%"/></td><td><input id="type_attr" style="width:100%"/></td><td><button onclick="append_row()"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span></button></td></tr>');
}

save_new_attributes = function (){
	current_xml_object = BEOM.xml.EDOM.BEOM[choose_object.type.toUpperCase()+'S'][choose_object.type.toUpperCase()][choose_object.position_entity]
	if(!current_xml_object.ATTRIBUTES) current_xml_object['ATTRIBUTES'] = {'ATTRIBUTE':[]};
	if(!current_xml_object.ATTRIBUTES.ATTRIBUTE) current_xml_object.ATTRIBUTES.ATTRIBUTE = [];
	current_xml_object.ATTRIBUTES.ATTRIBUTE = [];

	$('#table_attr tbody>tr').each(function(){
		if($(this).find('#name_attr').val() != '' && $(this).find('#type_attr').val() != ''){
			current_xml_object.ATTRIBUTES.ATTRIBUTE.push({
					'NAME':$(this).find('#name_attr').val(),
					'TYPE':$(this).find('#type_attr').val(),
				});
		}
	})
	$('#window_util').remove();
}

/*
 * функция сохранения изменения связи
 * 20150316
 * Vadim GRITSENKO
 */
function save_change_entity(){
	BEOM.xml.EDOM.BEOM[choose_object.type.toUpperCase()+'S'][choose_object.type.toUpperCase()][choose_object.position_entity].NAME = $('#name').val()
	if ( $('#term').val() != '') {BEOM.xml.EDOM.BEOM[choose_object.type.toUpperCase()+'S'][choose_object.type.toUpperCase()][choose_object.position_entity].TERM = $('#term').val()}
	if ( $('#abbreviation').val() != '') {BEOM.xml.EDOM.BEOM[choose_object.type.toUpperCase()+'S'][choose_object.type.toUpperCase()][choose_object.position_entity].ABBREVIATION = $('#abbreviation').val()}
	if ( $('#sid').val() != '') {BEOM.xml.EDOM.BEOM[choose_object.type.toUpperCase()+'S'][choose_object.type.toUpperCase()][choose_object.position_entity].SID = $('#sid').val()}
	if ( $('#enname').val() != '') {BEOM.xml.EDOM.BEOM[choose_object.type.toUpperCase()+'S'][choose_object.type.toUpperCase()][choose_object.position_entity].ENNAME = $('#enname').val()}
	if ( $('#article').val() != '') {BEOM.xml.EDOM.BEOM[choose_object.type.toUpperCase()+'S'][choose_object.type.toUpperCase()][choose_object.position_entity].ARTICLE = $('#article').val()}

	BEOM.nodes.update({
			id:choose_object.id,
			label:$('#name').val(),
			term:$('#term').val(),
			sid:$('#sid').val(),
			abbreviation:$('#abbreviation').val(),
			enname:$('#enname').val(),
			article:$('#article').val(),
		});
	
	$('#window_util').remove();
}
//конец функции

/*
 * функция сохранения xml
 * 20150316
 * Vadim GRITSENKO
 */
BEOM_editor.save_xml = function (){
	$('#window_save_as').remove();
	if (BEOM_editor.name_file != null){
		html = $.ajax({     
			url: BEOM_editor.base_url+'index.php/edom/save_xml',
			type: "POST",
			data: {xml:JSON.stringify(BEOM.xml),name_file:BEOM_editor.name_file,}
		}).done(function (response, textStatus, jqXHRб){
			result = JSON.parse(response);
			if (result === true){
				alert('Успешно сохранен')
			}
			else {
				alert('Не удалось сохранить')
			}
		});
	}
	else {BEOM_editor.save_xml_as();}
}
//конец функции

/*
 * функция сохранения xml как 
 * 20150320
 * Vadim GRITSENKO
 */
BEOM_editor.save_xml_as = function (){

	html = '<label>Наименование структуры</label>';
	html += '<input type="text" id="input_name_structure" class="form-control" placeholder="Наименование"/>';

	html += '<label>Наименование файла</label>';
	html += '<input type="text" id="input_name_file" class="form-control" placeholder="Наименование"/>';
	
	html += '<button type="button" class="btn btn-primary" onclick="BEOM_editor.change_name_file($(\'#input_name_file\').val(),$(\'#input_name_structure\').val());BEOM_editor.check_name_file();">Сохранить файл</button>';
	
	data_window = { id: 'window_util', title: 'Введите имя нового файла', html: html}
	
	load_window(data_window);
	$('#input_name_file').bind("change keyup input click", change_numb_latin)	
}
//конец функции


/*
 * функция сохранения xml
 * 20150316
 * Vadim GRITSENKO
 */
BEOM_editor.create_new = function (){
	BEOM.xml = JSON.parse(JSON.stringify(frame_beom));
	BEOM.destroy();
	BEOM_editor.init();
	BEOM_editor.load_beom();
	$('#label_name_file').empty();
	$('#window_util').remove();
	BEOM_editor.name_file = null;
}
//конец функции

/*
 * функция изменить наименование файла
 * 20150320
 * Vadim GRITSENKO
 */
BEOM_editor.change_name_file = function (new_name){
	BEOM_editor.name_file = new_name;
	$('#label_name_file').html('<span class="label label-success" id="name_file" style="cursor:pointer">' + BEOM_editor.name_file+ '.xml'  + '</span>');
}
//конец функции

/*
 * функция сохранения xml (методом построчной записи)
 * 20150316
 * Vadim GRITSENKO
 */
BEOM_editor.check_name_file = function (){
	if ($('#input_name_file').val() != '') {
		html = $.ajax({     
			url: BEOM_editor.base_url+'index.php/edom/check_name_file',
			type: "POST",
			data: {xml:JSON.stringify(BEOM.xml),name_file:BEOM_editor.name_file,}
		}).done(function (response, textStatus, jqXHRб){
			result = JSON.parse(response);
			if (result.result === true){
				BEOM_editor.set_name_structure($('#input_name_structure').val());
				BEOM_editor.save_xml_2();
				$('#window_util').remove();
			}
			else {
				alert('Такой файл существует')
			}
		});
	}
	else {alert('Введите имя');}
}

/*
 * функция сохранения xml (методом построчной записи)
 * 20150316
 * Vadim GRITSENKO
 */
BEOM_editor.save_xml_2 = function (){
	$('#window_util').remove();
	if (BEOM_editor.name_file != null){
		//if ()
		html = $.ajax({
			//url: BEOM_editor.base_url+'index.php/edom/save_xml',
			url: BEOM_editor.base_url+'index.php/edom/save_xml_2_variant',
			type: "POST",
			data: {xml:JSON.stringify(BEOM.xml),name_file:BEOM_editor.name_file,}
		}).done(function (response, textStatus, jqXHRб){
			result = JSON.parse(response);
			if (result.result === true){
				alert('Успешно сохранен')
				
				BEOM_editor.get_data_file(BEOM_editor.name_file);
			}
			else {
				alert('Не удалось сохранить')
			}
		});
	}
	else {BEOM_editor.save_xml_as();}
}
//конец функции

/*
 * функция загрузки xml-файла
 * 20150316
 * Vadim GRITSENKO
 */
BEOM_editor.download_file = function(){
	if (BEOM_editor.name_file != null){
		window.open(base_url+'index.php/edom/download_file/'+BEOM_editor.name_file);
	}
	else {
		alert('Для скачивания нужно сохранить');
	}
}
//конец функции


/*
 * функция сохранения xml как 
 * 20150320
 * Vadim GRITSENKO
 */
BEOM_editor.window_rename_file = function (){
	
	html = '<label>Наименование структуры</label>';
	html += '<input type="text" id="input_name_structure" class="form-control" placeholder="Наименование"/>';

	html += '<label>Наименование файла</label>';
	html += '<input type="text" id="input_name_file" class="form-control" placeholder="Наименование"/>';
	
	html += '<button type="button" class="btn btn-primary" onclick="BEOM_editor.check_rename_file();">Сохранить файл</button>';
	
	data_window = { id: 'window_util', title: 'Введите новое имя файла', html: html}
	
	load_window(data_window);
	
	$('#input_name_file').bind("change keyup input click", change_numb_latin)

}
//конец функции


/*
 * функция сохранения xml (методом построчной записи)
 * 20150316
 * Vadim GRITSENKO
 */
BEOM_editor.check_rename_file = function (){
	if ($('#input_name_file').val() != '') {
		$('#pop_up_window').remove();
		html = $.ajax({     
			url: BEOM_editor.base_url+'index.php/edom/check_name_file',
			type: "POST",
			data: {name_file:$('#input_name_file').val(),}
		}).done(function (response, textStatus, jqXHRб){
			result = JSON.parse(response);
			if (result.result === true){
				BEOM_editor.set_name_structure($('#input_name_structure').val());			
				BEOM_editor.rename_file();
			}
			else {
				alert('Такой файл существует')
			}
		});
	}
	else {alert('Введите имя');}
}
//конец функции

/*
 * функция для переименование xml-файла
 * 20150406
 * Vadim GRITSENKO
 */
BEOM_editor.rename_file = function(){
	if (BEOM_editor.name_file != null){
		html = $.ajax({     
			url: BEOM_editor.base_url+'index.php/edom/rename_file',
			type: "POST",
			data: {old_name_file:BEOM_editor.name_file,new_name_file:$('#input_name_file').val(),}
		}).done(function (response, textStatus, jqXHRб){
			result = JSON.parse(response);
			if (result.result === true){
				alert('Файл успешно переименован');
				//BEOM_editor.change_name_file($('#input_name_file').val());
				BEOM_editor.get_data_file($('#input_name_file').val());
				$('#window_util').remove();
			}
			else {
				alert('Не удалось переименовать')
			}
		});
	}
	else {
		alert('Не выбран файл');
	}
}
//конец функции

/*
 * функция для записи название структуры из xml
 * 20150406
 * Vadim GRITSENKO
 */
BEOM_editor.set_name_structure = function (name_structure){
	BEOM.xml.EDOM.BEOM['NAME'] = name_structure;
	BEOM_editor.name_structure = name_structure;
}
//конец функции

/*
 * функция для проверки вводимых символов (только латиница и цифры)
 * 20150406
 * Vadim GRITSENKO
 */
function change_numb_latin() {
	if (this.value.match(/[^a-zA-Z0-9]/g)) {
		this.value = this.value.replace(/[^a-zA-Z0-9]/g, '');
	}
};
//конец функции


/*
 * функция для переименование xml-файла
 * 20150406
 * Vadim GRITSENKO
 */
BEOM_editor.copy_file = function(){
	if (BEOM_editor.name_file != null){
		html = $.ajax({     
			url: BEOM_editor.base_url+'index.php/edom/copy_file',
			type: "POST",
			data: {name_file:BEOM_editor.name_file}
		}).done(function (response, textStatus, jqXHRб){
			result = JSON.parse(response);
			console.log(result)
			if (result.result === true){
				alert('Копия создана');
				BEOM_editor.change_name_file(result.name_file);
				BEOM_editor.get_data_file(BEOM_editor.name_file);
			}
			else {
				alert('Не удалось создать копию')
			}
		});
	}
	else {
		alert('Нельзя создать копию не сохраненного файла');
	}
}
//конец функции