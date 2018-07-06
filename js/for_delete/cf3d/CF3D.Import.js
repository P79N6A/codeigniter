/* 

 */

var CF3D_import = {
		transformControls: null,
};

var db_name, scheme, table, color_line
/*
 * функция открывания объекта
 * vadim
 * 20140930
 */
CF3D_import.open_object = function(){
	if (CF3D.selected_obj['open_obj']==false){
		$('#edit_window').dialog('close')
		if (CF3D.right_click_sel_obj){ 
			id = CF3D.right_click_sel_obj['sbj_id']
			CF3D.change_lvl_color=null
		}
		var data={};
		data['id']=CF3D.selected_obj['sbj_id'];
		data['parent']=true;
		data['db_name']=CF3D.db_name;
		data['scheme']=CF3D.scheme;
		data['table']=CF3D.table;
		query=$.ajax({
			url: CF3D.base_url+'index.php/qcf3d/open_object/',
			type:'POST',
			data:data
			});
		query.done(function (response, textStatus, jqXHRб){
			CF3D.right_click_sel_obj=null;
			data = (JSON.parse(response))
			
			CF3D_import.children = data['children'];
			if (CF3D_import.children.length == 0){ alert(langs.get_term('I238')) }
			else CF3D_import.build_children(data['data_obj']['id'])
		});
	}
	else {
		CF3D.selected_obj['open_obj']=false;
			if (CF3D.selected_obj['parent_obj']!=null && CF3D.selected_obj['parent_obj'].position){
				CF3D.selected_obj.position.x -= (CF3D.selected_obj.position.x - CF3D.selected_obj['parent_obj'].position.x) / 3;
				CF3D.selected_obj.position.z -= (CF3D.selected_obj.position.z - CF3D.selected_obj['parent_obj'].position.z) / 3;
			}
		close_object (CF3D.selected_obj)

		CF3D.right_click_sel_obj = CF3D.selected_obj;
		CF3D.rec_del_lines();
		CF3D.create_lines();
	}
}
//конец фукнции

CF3D_import.open_root = function (id){
	var data={};
	data['id']=id;
	data['db_name']=CF3D.db_name;
	data['scheme']=CF3D.scheme;
	data['table']=CF3D.table;
	query=$.ajax({
		url: CF3D.base_url+'index.php/qcf3d/open_object/',
		type:'POST',
		data:data
		});
	query.done(function (response, textStatus, jqXHRб){
		data = (JSON.parse(response))
		CF3D.clear_scene();
		CF3D_import.load_import(data)
	});
}
//конец фукнции


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
			
/*
			CF3D.right_click_sel_obj = lines[i]['to'];
			arr_del_export_object.splice(arr_del_export_object.length-1,1)
			CF3D_3dgl.delete_object();
*/
			
			CF3D.scene.remove(lines[i]['to']['label'])
			CF3D.scene.remove(lines[i]['to'])


			obj['lines'].splice(i,1);
			i--
		}
	}
	obj['child_obj'] = [];
}
//конец фукнции




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
 * функция сохранения изменений настроек
 * vadim
 * 20141003
 */
CF3D_import.change_settings = function (){
	for (var i in CF3D.list_settings){
		$.cookie(CF3D.list_settings[i]['id'],$('#'+CF3D.list_settings[i]['id']).val())
	}
	location.reload();
}
//конец функции


// инициализация линий для перемещений
CF3D_import.init_helper_arrow = function (){

	CF3D.transformControls = new THREE.TransformControls( this.camera, this.container );
		CF3D.transformControls.addEventListener( 'change', function () {
			CF3D.controls.enabled = true;
		});
	CF3D.scene.add( CF3D.transformControls );			

}
// конец


/*
 * функция изменения содержания элемента select
 * vadim
 * 20141002
 */
get_content = function (array_config){
	html_content ='<option value=""></option>';
	for (var i in array_config){
		html_content += '<option value="'+array_config[i]['value']+'" numb_row='+i+'>'+langs.get_term(array_config[i]['name'])+'</option>';
	}
	return html_content;
}
// конец функции



/*
 * функция загрузки формы импортированных данных
 * vadim
 * 20140926
 */
CF3D_import.load_import = function (data){

	CF3D.mode = "MULTIPLE";
	if (data.length==0) return;
		CF3D.Subject= new Array()
		i=0;
	var d_y=1000;

	
	CF3D.db_name = data['db_name']
	CF3D.scheme = data['scheme']
	CF3D.table = data['table']

	CF3D.hidn_name=true;
	CF3D.scene.remove( CF3D.gridHelper );
	CF3D.scene.remove( CF3D.planeHelper );
	
	$('.root_btn').attr('class', 'btn btn-primary root_btn');
	$('#root_'+data['data_obj']['id']).toggleClass('btn-primary btn-success').addClass('active');
	
	this.data=data['data_obj'];
	this.children=data['children'];
	this.parent=data['parent'];
	if (data['context']) this.context=data['context'];
	var d_grad=(2*Math.PI/this.children.length)
	var radius = 500*Math.sqrt(this.children.length);
	CF3D_3dgl.add_object_window='sphere';
	CF3D_3dgl['add_'+CF3D_3dgl.add_object_window]({'color': settings['color_main_object'], 'radius': 200, 'sbj_id': this.data['id'],'db_id': this.data['id'], 'name': this.data['name'], 'X': 0, 'Y': d_y, 'Z': 0,'level':1,'parent_obj':null})
	CF3D_import.build_children(this.data['id'])
}
//конец функции

/*
 * функция построения потомков в объекта
 * vadim
 * 20140930
 */
/*
CF3D_import.build_children = function (parent_id){

	var parent = search_obj('sbj_id',parent_id);
	parent['child_obj']=new Array();
	var d_y=1000;

	for (var j in CF3D_import.children){
		parent['open_obj']=true;
		if (CF3D_import.children.length == 1){
			var x = parent.position.x
			var y = parent.position.y-d_y
			var z = parent.position.z
		}
		else {
			new_position = get_position_children_circle (CF3D_import.children.length, d_y, parseInt(j), parent)
			var x = new_position.x
			var y = new_position.y
			var z = new_position.z
		}
		if (CF3D_import.children[j]['children'].length >0 ){
			var color = settings['color_object_child'];
		}
		else{
			var color = settings['color_object_not_child'];
		}
		CF3D_3dgl.add_object_window='sphere';
		CF3D_3dgl['add_'+CF3D_3dgl.add_object_window]({'color': color, 'radius': 100, 'sbj_id': CF3D_import.children[j]['id'],'name': CF3D_import.children[j]['name'], 'X': x, 'Y': y, 'Z':z, 'level': parent.level+1, 'child_db':CF3D_import.children[j]['children'],'parent_obj':parent,'db_id': CF3D_import.children[j]['id']})
		//parent.child_obj[parent.child_obj.length] = CF3D.scene.children[CF3D.scene.children.length-2];
		
		if (settings['type_line'] == null) settings['type_line']='curl';
		record_arr_connected_obj(CF3D.scene.children[CF3D.scene.children.length-2],parent,settings['type_line'])
	}
	CF3D.create_lines()
}
//конец функции
*/

/*
 * функция построения потомков в объекта
 * vadim
 * 20140930
 */
CF3D_import.build_children = function (parent_id){

	var parent = search_obj('sbj_id',parent_id);
	parent['open_obj']=true;
	parent['child_obj']=new Array();
	if (parent['parent_obj']!=null && parent['parent_obj']['id']!=0){
		parent.position.x += (parent.position.x - parent['parent_obj'].position.x)/2;
		parent.position.z += (parent.position.z - parent['parent_obj'].position.z)/2;
	}
	CF3D.right_click_sel_obj = parent;
	CF3D.rec_del_lines();
	CF3D.create_lines()
	
	var d_y=1000;

	for (var j in CF3D_import.children){
		if (CF3D_import.children.length == 1){
			var x = parent.position.x
			var y = parent.position.y-d_y
			var z = parent.position.z
		}
		else {
			new_position = get_position_children_circle (CF3D_import.children.length, d_y, parseInt(j), parent)
			var x = new_position.x
			var y = new_position.y
			var z = new_position.z
		}
		if (CF3D_import.children[j]['children'].length >0 ){
			if (settings['color_level'][parent.level]) color = settings['color_level'][parent.level]
			else color = settings['color_object_child'];
		}
		else{
			var color = settings['color_object_not_child'];
		}
		CF3D_3dgl.add_object_window='sphere';
		CF3D_3dgl['add_'+CF3D_3dgl.add_object_window]({'color': color, 'radius': 100, 'sbj_id': CF3D_import.children[j]['id'],'db_id': CF3D_import.children[j]['id'],'name': CF3D_import.children[j]['name'], 'X': x, 'Y': y, 'Z':z, 'level': parent.level+1, 'child_db':CF3D_import.children[j]['children'],'parent_obj':parent})
	//	parent.child_obj[parent.child_obj.length] = CF3D.scene.children[CF3D.scene.children.length-2];
		
		if (settings['type_line'] == null) settings['type_line']='curl';
		record_arr_connected_obj(CF3D.scene.children[CF3D.scene.children.length-2],parent,settings['type_line'])
	}
	CF3D.create_lines()
}
//конец функции


/*
 * функция очистки сцены
 * vadim
 * 20140930
 */
CF3D_import.research = function (){
	var half_elements = Math.round(CF3D.scene.children.length/2);
	if ($("#field_research").val() == ""){
		alert(1)
	}
	else{
		for (i = 1 ; i <= half_elements; i++){
			if ((CF3D.scene.children[half_elements+i]) && (CF3D.scene.children[half_elements+i].name.indexOf($("#field_research").val()) + 1)) {
				CF3D.scene.children[half_elements+i].material = new THREE.MeshLambertMaterial({color: 0xb0cdcb});
				//return;
			}
			if ((CF3D.scene.children[half_elements-i]) && (CF3D.scene.children[half_elements-i].name.indexOf($("#field_research").val()) + 1)) {
				CF3D.scene.children[half_elements-i].material = new THREE.MeshLambertMaterial({color: 0xb0cdcb});
				//return;
			}
		}
	}
}
//конец функции 

/*
 * функция очистки сцены
 * vadim
 * 20140930
 */
CF3D_import.clear_scene= function (){
	while( CF3D.scene.children.length > 0 ) {
		var object = CF3D.scene.children[ 0 ];
			object.parent.remove( object );
	}
}
//конец функции 

/*
 * функция очистки глобальных переменных
 * vadim
 * 20140930
 */
CF3D_import.clear_select = function (){
	if (CF3D.right_click_sel_obj!=null){
		CF3D.create_lines(CF3D.right_click_sel_obj)
	}
	CF3D.transformControls.detach (CF3D.right_click_sel_obj);
	CF3D.right_click_sel_obj = null;
}
// конец функции

/*
 * функция диалогового окна данных объекта
 * vadim
 * 20140926
 */
var levels=new Array;
CF3D_import.open_object_data = function (){
	if (!CF3D.right_click_sel_obj) return;
	if (!CF3D.right_click_sel_obj['parent_obj']) parent_name = " - ";
	else parent_name = CF3D.right_click_sel_obj['parent_obj']['name'];

	id_win = "open_conframe";
	
	parameters_dialog = JSON.parse(JSON.stringify(default_parameters_dialog));
	parameters_dialog.title = langs.get_term("txt_data_object");
	parameters_dialog.position = 'left top';

	down_panel_buttons = CF3D.array_buttons(1);
	down_panel_buttons[0].name = langs.get_term('btn_cancel');
	down_panel_buttons[0].onclick = "$(\'#"+id_win+"\').dialog(\'close\')";
	down_panel_buttons[0].id = "btn_cancel";

	
	if (CF3D.right_click_sel_obj['type_element']){
		var arr_fields =  [
			{
				"id": "conframe",
				"name" : langs.get_term('txt_id'),
				"image": "glyphicon glyphicon-copyright-mark",
				"value": CF3D.right_click_sel_obj['id'],
				"type" : "label",
			},
			{
				"id": "conframe",
				"name" : langs.get_term('txt_name'),
				"image": "glyphicon glyphicon-copyright-mark",
				"value": CF3D.right_click_sel_obj['name'],
				"type" : "label",
			},
			{
				"id": "conframe",
				"name" : langs.get_term('txt_parent'),
				"image": "glyphicon glyphicon-copyright-mark",
				"value": parent_name,
				"type" : "label",
			},
			
		];		
	
	}
	else if (CF3D.right_click_sel_obj['type_line']){
		var arr_fields = [
			{
				"id": "from",
				"name" :"txt_parent",
				"image": "glyphicon glyphicon-copyright-mark",
				"value": CF3D.right_click_sel_obj['from']['name'],
				"propeties" : "readonly",
				"type" : "text"
			},
			{
				"id": "to",
				"name" :"txt_child",
				"image": "glyphicon glyphicon-copyright-mark",
				"value": CF3D.right_click_sel_obj['to']['name'],
				"propeties" : "readonly",
				"type" : "text"
			},
			{
				"id": "type_line",
				"name" :"txt_line_type",
				"image": "glyphicon glyphicon-copyright-mark",
				"value": CF3D.right_click_sel_obj['type_line'],
				"propeties" : "readonly",
				"type" : "text"
			}		
		
		];
	}	
	
		data_dialog = {
			parameters:	parameters_dialog,
			down_panel_buttons:down_panel_buttons,
			fields_main_content : arr_fields,
			id_window : id_win,
			view_templ: "tmpl_panel_output_info",
		}
		
		QC.open_dialog(JSON.stringify(data_dialog))
		$('#pop_up_window_div').remove()
}
//конец функции