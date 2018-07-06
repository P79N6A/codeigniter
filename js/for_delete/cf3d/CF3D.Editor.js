/* 

 */

var CF3D_editor = {
	base_url:null,
	add_element:null,
	context:null,
	conframe_id:null,
	planeHelper:null,
};
//var CF3D.paste_position;
var db_name, scheme, table, color_line;
var default_object = {
					'color': 0xeeeeee,
					'radius': 100,
					'height': 200,
					'width': 200,
					'depth': 200,
					'radiusTop':1,
					'radiusBottom':100,
					'radiusSegments':32,
					'name': 'New_object',
					'sbj_id': 0,
					'X': 0,
					'Y': 0,
					'Z': 0,
					'level':1,
					'db_id': null
				}

/*
 * функция удаление линий и потомков объекта (функция - реляционная)
 * vadim
 * 20141001
 */
close_object = function (obj){
	var lines = obj['lines'];
	for (var i=0; i<lines.length;i++){
		if (lines[i]['from'] == obj){
			CF3D.scene.remove(lines[i])
			close_object(lines[i]['to'])
			CF3D.scene.remove(lines[i]['to']['label'])
			CF3D.scene.remove(lines[i]['to'])
		}
		
	}

}
//конец фукнцииz

/*
 * функция нахождения объекта по параметру в поле
 * vadim
 * 20140930
 */
search_obj = function (field,id){
	for (var i=0; i<CF3D.scene.children.length;i++){
		if (CF3D.scene.children[i][field]==id){
			return CF3D.scene.children[i];
		}
	}
}
//конец функции


/*
 * показать/скрыть наименования объектов
 * vadim
 * 20140930
 */
CF3D.hidden_name = function (){
	$('.label').toggleClass('hidn_label');
	if (CF3D.hidn_name==false) {
		$.cookie("hidden_name", true)
		CF3D.hidn_name=true
	}
	else {
		$.cookie("hidden_name", false)
		CF3D.hidn_name=false
	}
}
//конец функции


/*
 * показать/скрыть сетку и плоскость объектов
 * vadim
 * 20140930
 */
CF3D_editor.set_grid_visiblity = function (){
	if ($.cookie("grid") == 'false'){
		$.cookie("grid", true);
		CF3D_editor.planeHelper.visible = true; 
		CF3D.gridHelper.visible = true;
	}
	else {
		$.cookie("grid", false);
		CF3D_editor.planeHelper.visible = false; 
		CF3D.gridHelper.visible = false;
	}
}
//конец функции


/*
 * функция построения вспомогательной сетки и плоскости
 * vadim
 * 20141013
 */
CF3D_editor.create_grid = function (){
	var gridhelper_size = 5000;
	var gridhelper_step = 100;
		$.cookie("grid", true);
		CF3D.gridHelper = new THREE.GridHelper( gridhelper_size, gridhelper_step );
		CF3D.gridHelper.setColors(settings['color_gridhelper_centline'], settings['color_gridhelper_line']);
		CF3D.scene.add( CF3D.gridHelper );
		CF3D_editor.planeHelper = new THREE.Mesh( new THREE.PlaneGeometry( 10000, 10000 ), new THREE.MeshLambertMaterial( { opacity: settings['opacity_gridhelper_plane'], color: settings['color_gridhelper_plane'],  transparent:true } ) );
		CF3D_editor.planeHelper.rotation.x = - Math.PI / 2;
		CF3D_editor.planeHelper.visible = true;
		CF3D.scene.add( CF3D_editor.planeHelper );
		CF3D_editor.planeHelper.paste_element = function (){
			if (CF3D.copy_element){
				var new_object = CF3D.copy_element.element.parameters;
				CF3D_3dgl.add_object_window = CF3D.copy_element.element.type_element;
				new_object.X = CF3D.paste_position.x
				new_object.Y = CF3D.paste_position.y
				new_object.Z = CF3D.paste_position.z
				new_object.sbj_id = CF3D.scene.children.length
				CF3D_3dgl['add_'+CF3D_3dgl.add_object_window](new_object)
			}
			$('#pop_up_window_div').remove();
		}
}
//конец функции



/*
 * функция вызова окна добавление потомка объекта
 * vadim
 * 20141009
 */
CF3D_editor.add_object_window = function (){

	if (!CF3D.right_click_sel_obj) return;
	if (CF3D.mode == 'MULTIPLE' && CF3D.right_click_sel_obj.open_obj == false) {
		CF3D.selected_obj = CF3D.right_click_sel_obj;
		CF3D_import.open_object();
	}
	$("#pop_up_window_div").remove();
	id_win = "add_object_window";
	
	parameters_dialog = JSON.parse(JSON.stringify(default_parameters_dialog));
	parameters_dialog.title = langs.get_term("txt_data_object"),
	parameters_dialog.position = 'top';

	down_panel_buttons = CF3D.array_buttons(2);

	down_panel_buttons[0].name = langs.get_term('sm_btn_save');
	down_panel_buttons[0].onclick = "CF3D_editor.add_object()";
	down_panel_buttons[0].id = "btn_save";

	down_panel_buttons[1].name = langs.get_term('btn_cancel');
	down_panel_buttons[1].onclick = "$(\'#"+id_win+"\').dialog(\'close\')";
	down_panel_buttons[1].id = "btn_cancel";	

	data_dialog = {
		parameters:	parameters_dialog,
		down_panel_buttons:down_panel_buttons,
		fields_main_content : [
			{
				"id": "type_line",
				"name" :langs.get_term('txt_line_type'),
				"image": "glyphicon glyphicon-copyright-mark",
				"value": '',
				"type" : "select",
				"options" : [
					{
						"value" : "curl",
						"name" : langs.get_term('txt_curl'),
					},
					{
						"value" : "straight",
						"name" : langs.get_term('txt_straight'),
					},
				]
			},
			{
				"id": "type_object",
				"name" :langs.get_term('txt_type_object'),
				"image": "glyphicon glyphicon-copyright-mark",
				"value": '',
				"type" : "select",
				"options" : [
					{
						"value" : "sphere",
						"name" : langs.get_term("txt_sphere"),
					},
					{
						"value" : "cube",
						"name" : langs.get_term("txt_cube"),
					},
					{
						"value" : "conus",
						"name" : langs.get_term("txt_conus"),
					},
				]
			},
				{
				"id": "view_object",
				"name" :langs.get_term('txt_view_object'),
				"image": "glyphicon glyphicon-copyright-mark",
				"value": '',
				"type" : "select",
				"options" : [
					{
						"value" : "child",
						"name" : langs.get_term("txt_child"),
					},
					{
						"value" : "parent",
						"name" : langs.get_term("txt_parent"),
					},
					{
						"value" : "level",
						"name" : langs.get_term("txt_level"),
					},
				]
			},		
			{
				"id": "name_object",
				"name" :langs.get_term('txt_name'),
				"image": "glyphicon glyphicon-copyright-mark",
				"value": '',
				"type" : "text"
			},
			{
				"id": "id_object",
				"name" :'txt_id_object',
				"image": "glyphicon glyphicon-copyright-mark",
				"propeties": 'readonly',
				"value": CF3D.right_click_sel_obj['id'],
				"type" : "text"
			},				
		],
		id_window : id_win,
		view_templ : "tmpl_main_content",
	}	

	QC.open_dialog (JSON.stringify(data_dialog))
//	$("#btn_save").click(function (){callback(id_win)})

}
//конец функции

/*
 * функция добавление объекта
 * vadim
 * 20141010
 */
CF3D_editor.add_object = function (){
	CF3D_3dgl['add_'+$('#view_object').val()]()
}
//конец функции

/*
 * функция загрузки объектов и соединений
 * vadim
 * 20140926
 */
var type_line
CF3D_editor.load_edit = function (){
	
	CF3D.mode = 'EDITOR';
	
		CF3D.load_settings()
		CF3D_editor.create_grid()

}
//конец функции

/*
 * функция загрузки списка настроек
 * vadim
 * 20141008
 */
CF3D_editor.load_list_settings = function (list_settings){
	CF3D.list_settings=list_settings;
}
//конец функции

/*
 * функция добавления название conframe файла 
 * vadim
 * 20141008
 */
CF3D_editor.load_data_conframe = function (data_conframe){
	this.conframe_id = data_conframe['conframe_id']
	$('#file_name').html('<span class="label label-success">'+data_conframe['name']+'</span>')
}
//конец функции

/*
 * функция добавления объектов и связей посредством передачи объекта json
 * vadim
 * 20141008
 */
CF3D_editor.load_3dgraphics_json = function (svg_json){

	CF3D.camera.position.x=svg_json['camera']['X']
	CF3D.camera.position.y=svg_json['camera']['Y']
	CF3D.camera.position.z=svg_json['camera']['Z']
	CF3D.camera.rotation._x=svg_json['camera']['rotation_x']
	CF3D.camera.rotation._y=svg_json['camera']['rotation_y']
	CF3D.camera.rotation._z=svg_json['camera']['rotation_z']
	
	if (svg_json) {
		objects=svg_json['objects']
		for (var i in objects){
			CF3D_3dgl.add_object_window = objects[i]['typical_element_type']
			CF3D_3dgl['add_'+CF3D_3dgl.add_object_window](objects[i])
		}
		if (svg_json['connectors']) {
			var lines=svg_json['connectors']
			for (var j in lines){
				CF3D.connect_obj1 = search_obj('sbj_id',lines[j]['from']);
				CF3D.connect_obj2 = search_obj('sbj_id',lines[j]['to']);
				CF3D_3dgl['connect_'+lines[j]['type_line']]()
			}
		}
	}
};
//конец функции

CF3D.clear_scene= function (){
	while( CF3D.scene.children.length > 0 ) {
		var object = CF3D.scene.children[ 0 ];
			object.parent.remove( object );
	}
}

CF3D.event_keyboard=function() {
	
	if( event.keyCode === 27 ) {
		CF3D.clear_select()
	}
/*	if (!$('select').is(":focus")){
				
		if( event.keyCode === 27 ) clear_select()
		else if ( event.keyCode == 37 && save_object && event.ctrlKey) {$('#object_position_z').val(parseInt($('#object_position_z').val())-100); save_object_change()} //arrow left keyup
		else if ( event.keyCode == 39 && save_object && event.ctrlKey) {$('#object_position_z').val(parseInt($('#object_position_z').val())+100); save_object_change()} //arrow right keyup
		else if ( event.keyCode == 37 && save_object) {$('#object_position_x').val(parseInt($('#object_position_x').val())-100); save_object_change()} //arrow left keyup
		else if ( event.keyCode == 39 && save_object) {$('#object_position_x').val(parseInt($('#object_position_x').val())+100); save_object_change()} //arrow right keyup
		else if ( event.keyCode == 38 && save_object) {$('#object_position_y').val(parseInt($('#object_position_y').val())+100); save_object_change()} //arrow up keyup
		else if ( event.keyCode == 40 && save_object) {$('#object_position_y').val(parseInt($('#object_position_y').val())-100); save_object_change()} //arrow down keyup
		else if ( event.keyCode == 67 && event.ctrlKey && save_object) {building_object({'color': save_object.currentHex.color.getHex(), 'name': '\''+save_object.name+'\'', 'X': (parseInt(save_object.position.x)+100), 'Y': (parseInt(save_object.position.y)+100), 'Z': (parseInt(save_object.position.z)+100)})} //arrow down keyup
		else if ( event.keyCode == 46 && event.altKey && save_object) {delete_lines(save_object.id)} //arrow down keyup
		else if ( event.keyCode == 46 && save_object) {clear_scene()} //arrow down keyup
	
	}
*/

	
};

/*
 * функция загрузки формы импортированных данных
 * vadim
 * 20140926
 */
CF3D_editor.load_import = function (data){

	CF3D.mode = "MULTIPLE";
	if (data.length==0) return;
		CF3D.Subject= new Array()
		i=0;
	var d_y=1000;

	CF3D.load_settings()
	
	CF3D.db_name = data['db_name']
	CF3D.scheme = data['scheme']
	CF3D.table = data['table']

	CF3D.hidn_name=true;
	
	$('.root_btn').attr('class', 'btn btn-primary root_btn');
	$('#root_'+data['data_obj']['id']).toggleClass('btn-primary btn-success').addClass('active');
	
	CF3D_import.data=data['data_obj'];
	CF3D_import.children=data['children'];
	CF3D_import.parent=data['parent'];
	if (data['context']) this.context=data['context'];
	var d_grad=(2*Math.PI/CF3D_import.children.length)
	var radius = 500*Math.sqrt(CF3D_import.children.length);
	CF3D_3dgl.add_object_window='sphere';
	CF3D_3dgl['add_'+CF3D_3dgl.add_object_window]({'color': settings['color_main_object'], 'radius': 200, 'sbj_id': CF3D_import.data['id'],'db_id': CF3D_import.data['id'], 'name': CF3D_import.data['name'], 'X': 0, 'Y': d_y, 'Z': 0,'level':0,'parent_obj':{'id':0,'name':' - '}})
//	CF3D_3dgl['add_'+CF3D_3dgl.add_object_window]({'color': settings['color_main_object'], 'radius': 200, 'sbj_id': CF3D_import.data['id'],'db_id': CF3D_import.data['id'], 'name': CF3D_import.data['name'], 'X': 0, 'Y': d_y, 'Z': 0,'level':CF3D_import.parent.length+1,'parent_obj':{'id':0,'name':' - '}})
	CF3D_import.build_children(CF3D_import.data['id'])
}
//конец функции

CF3D_editor.open_root = function (id){
	var data={};
	data['id']=id;
	data['db_name']=CF3D.db_name;
	data['CF3D.scheme']=CF3D.scheme;
	data['CF3D.table']=CF3D.table;
	query=$.ajax({
		url: CF3D.base_url+'index.php/qcf3d/open_object/',
		type:'POST',
		data:data
		});
	query.done(function (response, textStatus, jqXHRб){
		data = (JSON.parse(response))
		CF3D.clear_scene();
		CF3D_editor.create_grid();
		CF3D.create_light();
		CF3D_editor.load_import(data);
	});
}
//конец фукнции

/*
 * функция очистки глобальных переменных
 * vadim
 * 20140930
 */
CF3D.clear_select = function (){
	if (CF3D.right_click_sel_obj!=null){
		CF3D.create_lines()
		if (CF3D.right_click_sel_obj.move_child){
			CF3D_3dgl.update_typologie(CF3D.right_click_sel_obj,1000);
			CF3D.create_lines();
		}
	}
	CF3D.transformControls.detach (CF3D.right_click_sel_obj);
	CF3D.right_click_sel_obj = null;
}
// конец функции

/*
 * функция проверки соединений объектов
 * vadim
 * 20140926
 */
CF3D_editor.is_connected = function (){
	var lines = CF3D.connect_obj1['lines'];
	for (var i in lines){
		var current_line = lines[i]
		if ((current_line['to'] == CF3D.connect_obj2) || (current_line['from'] == CF3D.connect_obj2)){
			return true;
		}
	}
	return false;
}
//конец функции

/*
 * функция связей между объектами
 * vadim
 * 20140926
 */	
CF3D_editor.get_connect_type = function (callback){

	id_win = "choose_connect";
	
	parameters_dialog = JSON.parse(JSON.stringify(default_parameters_dialog));
	parameters_dialog.title = langs.get_term("txt_create_connect"),
	parameters_dialog.position = 'top';
	parameters_dialog.width = 500;

	down_panel_buttons = CF3D.array_buttons(2);

	down_panel_buttons[0].name = langs.get_term('sm_btn_open');
	down_panel_buttons[0].onclick = "";
	down_panel_buttons[0].id = "btn_save";

	down_panel_buttons[1].name = langs.get_term('btn_cancel');
	down_panel_buttons[1].onclick = "$(\'#"+id_win+"\').dialog(\'close\')";
	down_panel_buttons[1].id = "btn_cancel";
	
	data_dialog = {
		parameters:	parameters_dialog,
		down_panel_buttons:down_panel_buttons,
		fields_main_content : [
			{
				"id": "type_line",
				"name" :langs.get_term('txt_line_type'),
				"image": "glyphicon glyphicon-copyright-mark",
				"value": '',
				"type" : "select",
				"options" : [
					{
						"name": langs.get_term("txt_straight"),
						"value": "straight",
					},
					{
						"name": langs.get_term("txt_curl"),
						"value": "curl",
					}
					
				]
			},
/*			{
				"id": "type_line",
				"name" :langs.get_term('txt_CF3D.db_name'),
				"image": "glyphicon glyphicon-copyright-mark",
				"value": '',
				"type" : "select",
				"options" : [
					{
						"name": langs.get_term("txt_straight"),
						"value": "straight",
					},
					{
						"name": langs.get_term("txt_curl"),
						"value": "curl",
					}
					
				]
			}*/
		],
		id_window : id_win,
		view_templ: "tmpl_main_content",
	}
	QC.open_dialog(JSON.stringify(data_dialog))
	$("#btn_save").click(function (){callback(id_win)})
}
//конец функции

/*
 * функция пересохранения файла conframe
 * vadim
 * 20140925
 */		
CF3D_editor.save_conframe = function (){
	
	host_string = window.location.href
	host_array = host_string.split('/')

	if (CF3D_editor.conframe_id != null){
		var data = {
				'id':host_array[host_array.length-1],
				'key_field' : 'conframe_id',
				'data': {
						'svg_json':JSON.stringify(CF3D_editor.get_json_objects()),
					}
			}
		
		html = $.ajax({     
			url: url_base+"index.php/qcf3d/update",
			type: "POST",
			data: data
		}).done(function (response, textStatus, jqXHRб){
			result = JSON.parse(response)
			if (result['result']== -1){output_message(result['msg'], 'alert-danger');}
			else {output_message(langs.get_term('I200'), 'alert-success');}
		});
	}
	else CF3D_editor.save_as_conframe()

}
//конец функции


/*
 * функция обработки данных для сохранения export
 * vadim
 * 20141024
 */
CF3D_editor.child_data = function(parent_obj){
	var objects = []
	objects [objects.length]= {
		"name" : parent_obj['name'],
		"id" : parent_obj['id'],
		"child_obj":[],
		"db_id": (parent_obj['db_id']),
	}
	for (var i in parent_obj.child_obj){
		objects[objects.length-1].child_obj[objects[objects.length-1].child_obj.length] = CF3D_editor.child_data(parent_obj.child_obj[i]);
	}
	return objects[0];
}
//конец функции

/*
 * функция сохранения export
 * vadim
 * 20141024
 */
CF3D_editor.export_db = function (){
	var objects = [];
	for (var i in CF3D.scene.children){
		if (CF3D.scene.children[i]['type_element']){
			if (CF3D.scene.children[i]['parent_obj'] == null || CF3D.scene.children[i].parent_obj.id == 0) {
				objects[objects.length] = CF3D_editor.child_data (CF3D.scene.children[i])
			}
		}
	}
	var data = {};
	data['objects'] = objects;
	//data['db_name'] = "conframe_bi";
	data['db_name'] = data['db_name'];
	data['del_object'] = arr_del_export_object;
	data['CF3D.scheme'] = "obj_ba";
	data['CF3D.table'] = "sample_three";
	
	
	html = $.ajax({
		url: url_base+"index.php/qcf3d/export_db",
		type: "POST",
		data: data
	}).done(function (response, textStatus, jqXHRб){
		export_data = JSON.parse(response);
		for (var i in export_data){
			CF3D_editor.update_after_export(export_data[i])
		}
	});
	arr_del_export_object = new Array();
}
//конец функции

/*
 * функция обновления объектов находящихся сцене
 * vadim
 * 20141024
 */		
CF3D_editor.update_after_export = function (object){

	graphic_object = CF3D.scene.getObjectById(parseInt(object['id']))
	graphic_object.db_id = object['db_id']
	for (var i in object['child_obj']){
		CF3D_editor.update_after_export(object['child_obj'][i])
	}
}
//конец функции

/*
 * функция сохранения файла conframe
 * vadim
 * 20140925
 */		
CF3D_editor.save_as_conframe = function (){

	var dialog = CFUtil.dialog.create("save_window",
	{
		title: langs.get_term("ttl_save_conframe"), 
		autoOpen: false,
		height: "auto",
		width: 500,
		modal: true
	});
	if ( dialog ){
		html = $.ajax({     
			url: url_base+"index.php/qcore/ajax/load_form/qcf3d/save_form/",    
			type: "POST"         
		}).done(function (response, textStatus, jqXHRб){
			$(dialog).html(response);
			$('#svg_json').val(JSON.stringify(CF3D_editor.get_json_objects()))
		});
	}

}
//конец функции

/*
 * функция вывода сообщения о статусе выполнения запроса
 * vadim
 * 20141008
 */
function output_message(text, class_alarm){
	var dialog =new CFEAlert('');
	dialog.set_message(text);
	dialog.set_type(class_alarm);
	dialog.show_message();
}
//конец функции

/*
 * функция получение параметров камеры
 * vadim
 * 20141022
 */		
CF3D_editor.get_camera_json = function(){
	return {
			'X':CF3D.camera.position.x,
			'Y':CF3D.camera.position.y,
			'Z':CF3D.camera.position.z,
			'far':CF3D.camera.far,
			'fov':CF3D.camera.fov,
			'near':CF3D.camera.near,
			'rotation_x':CF3D.camera.rotation._x,
			'rotation_y':CF3D.camera.rotation._y,
			'rotation_z':CF3D.camera.rotation._z
		};
}
//конец функции

/*
 * функция добавления объектов
 * vadim
 * 20141007
 */		
CF3D_editor.get_json_objects = function (){

	var conframe_data = new Array();	
		save_json={
			'scene':{},
			'camera':CF3D_editor.get_camera_json(),
			'objects':{},
			'light':{},
			'connectors':{}}
	var objects = new Array()	
	var lines = new Array()	
	for (var i in CF3D.scene.children){
		if (CF3D.scene.children[i].type_line){
			lines [lines.length]= CF3D.scene.children[i].get_json()
		}
		else if (CF3D.scene.children[i]['geometry'] instanceof THREE.SphereGeometry){
			objects[objects.length] = CF3D.scene.children[i].get_json()
		}
		else if (CF3D.scene.children[i]['geometry'] instanceof THREE.BoxGeometry){
			objects[objects.length] = CF3D.scene.children[i].get_json()
		}
		else if (CF3D.scene.children[i]['geometry'] instanceof THREE.CylinderGeometry){
			objects[objects.length] = CF3D.scene.children[i].get_json()
		}		
		else if (CF3D.scene.children[i].name == 'light'){
			light = CF3D.scene.children[i].get_json()
		}
	}
	save_json['objects']=objects;
	save_json['light']=light;
	save_json['connectors']=lines;
		
	return save_json;
}
//конец функции

/*
 * функция загрузки вспомогательного окна 3D-conframe
 * vadim
 * 20141007
 */
CF3D_editor.open_conframe = function (){

	html = $.ajax({     
		url: url_base+"index.php/qcf3d/get_list_conframe",    
		type: "POST"         
	}).done(function (response, textStatus, jqXHRб){

		list_conframe = (JSON.parse(response))

		id_win = "open_conframe";
		
		parameters_dialog = JSON.parse(JSON.stringify(default_parameters_dialog));
		parameters_dialog.title = langs.get_term("txt_data_object"),
		parameters_dialog.position = 'top';
		parameters_dialog.width = 500;

		down_panel_buttons = CF3D.array_buttons(2);

		down_panel_buttons[0].name = langs.get_term('sm_btn_save');
		down_panel_buttons[0].onclick = "CF3D.new_page('index.php/qcf3d/edit/','conframe')";
		down_panel_buttons[0].id = "btn_save";

		down_panel_buttons[1].name = langs.get_term('btn_cancel');
		down_panel_buttons[1].onclick = "$(\'#"+id_win+"\').dialog(\'close\')";
		down_panel_buttons[1].id = "btn_cancel";	
		
		data_dialog = {
			parameters:	parameters_dialog,
			down_panel_buttons:down_panel_buttons,
			fields_main_content : [
				{
					"id": "conframe",
					"name" : langs.get_term('sm_btn_conframe'),
					"image": "glyphicon glyphicon-copyright-mark",
					"value": "",
					"type" : "select",
					"options" : list_conframe
				},
			],
			id_window : id_win,
			view_templ: "tmpl_main_content",
			
		}
		
		QC.open_dialog(JSON.stringify(data_dialog))
	})	

}
// конец процедуры

/*
 * функция загрузки нового поля conframe 
 * vadim
 * 20141007
 */
CF3D_editor.new_conframe = function (){
	CF3D.new_page('index.php/qcf3d/',null)
}
// конец процедуры

/*
 * функция удаления линий объекта и запись в память
 * vadim
 * 20140926
 */
var connected_obj = new Array()
CF3D_editor.rec_del_lines = function (){
	var obj = CF3D.right_click_sel_obj;
	var i = 0;
	while  ( i < obj['lines'].length){
		var current_line = obj['lines'][i]
		record_arr_connected_obj (current_line['to'], current_line['from'],current_line['type_line'])
		CF3D_3dgl.delete_line(current_line);
		CF3D.scene.remove(current_line);
	}
}
//конец функции

