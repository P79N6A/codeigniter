/* 

 */

var CF3D_styler = {
		transformControls: null,
		base_url: null,
		default_settings_import: null,
};


CF3D_styler.load_settings = function(stn_template){
	/*
		CF3D.controls = new THREE.TrackballControls( CF3D.camera, CF3D.renderer.domElement );
		CF3D.controls.rotateSpeed = 0.5;
		CF3D.controls.addEventListener( 'change', CF3D.render );	
*/

	window.addEventListener( 'resize', CF3D_styler.onWindowResize, false );
	
	settings = JSON.parse(stn_template['value']);
	
	CF3D_3dgl.add_object_window='sphere';
	CF3D_3dgl['add_'+CF3D_3dgl.add_object_window]({'color': settings['color_level'][0], 'radius': 100, 'sbj_id': 0,'db_id': null,'name': 'color level 0', 'X': 0, 'Y':0, 'Z':0, 'level': 0, 'child_db':[0], 'parent_obj': null})
	
	
	for (j=1; j<settings['color_level'].length; j++){

		color = settings['color_level'][j]

		CF3D_3dgl.add_object_window='sphere';
		CF3D_3dgl['add_'+CF3D_3dgl.add_object_window]({'color': color, 'radius': 100, 'sbj_id': j,'db_id': null,'name': 'color level '+j, 'X': 0, 'Y':0-(j*1000), 'Z':0, 'level': j, 'child_db':[j], 'parent_obj': CF3D.scene.children[CF3D.scene.children.length-2]})
	//	parent.child_obj[parent.child_obj.length] = CF3D.scene.children[CF3D.scene.children.length-2];
		
		if (settings['type_line'] == null) settings['type_line']='curl';
		record_arr_connected_obj(CF3D.scene.children[CF3D.scene.children.length-2],CF3D.scene.children[CF3D.scene.children.length-4],settings['type_line'])
	}
	CF3D.create_lines()

}

CF3D_styler.delete_stn_template = function(stn_template_id){
	data = {};
	data['stn_template_id'] = stn_template_id;
	html = $.ajax({     
		url: CF3D_styler.base_url+"index.php/qcf3d/stn_template/validation_id/",    
		type: "POST",
		data: data
	}).done(function (response, textStatus, jqXHRб){
		result = JSON.parse(response);
		if (result.length==0){
			html = $.ajax({
				url: CF3D_styler.base_url+"index.php/qcf3d/stn_template/delete_stn_template/",    
				type: "POST",
				data: data
			}).done(function (response, textStatus, jqXHRб){
				location.reload();
			})
		}
		else {
			if (confirm('Удалить привязку шаблона к проекту')){
				html = $.ajax({
					url: CF3D_styler.base_url+"index.php/qcf3d/stn_template/delete_stn_template/",    
					type: "POST",
					data: data
				}).done(function (response, textStatus, jqXHRб){
					html = $.ajax({
						url: CF3D_styler.base_url+"index.php/qcf3d/stn_template/delete_stn_connect_project/",    
						type: "POST",
						data: data
					}).done(function (response, textStatus, jqXHRб){
						location.reload();
					})
				})
			}
		}
	})
}

CF3D_styler.copy_stn_template = function (stn_template_id){
	data = {};
	data['stn_template_id'] = stn_template_id;
	html = $.ajax({     
		url: CF3D_styler.base_url+"index.php/qcf3d/stn_template/copy_stn_tamplate/",    
		type: "POST",
		data: data
	}).done(function (response, textStatus, jqXHRб){
		location.reload();
	})	
}

CF3D_styler.window_create_new = function(){

	var dialog_parameters = JSON.parse(JSON.stringify(default_parameters_dialog));
	dialog_parameters.title = langs.get_term("txt_panel_settings");
	id_win = "settings_window";

	down_panel_buttons = CF3D.array_buttons(2);

	down_panel_buttons[0].name = langs.get_term('sm_btn_save');
//	down_panel_buttons[0].onclick = "alert(1)";
	down_panel_buttons[0].onclick = "CF3D_styler.create_new()";
	down_panel_buttons[0].id = "btn_save";
	
	down_panel_buttons[1].name = langs.get_term('btn_cancel');
	down_panel_buttons[1].onclick = "$('#"+id_win+"').dialog(\'close\')";
	down_panel_buttons[1].id = "btn_cancel";		
	
	data_dialog = {
		parameters :	dialog_parameters,
		down_panel_buttons : down_panel_buttons,
		fields_main_content : CF3D_styler.default_settings_import,
		id_window : id_win,
		view_templ : "tmpl_main_content"
	}	
	
	QC.open_dialog (JSON.stringify(data_dialog));
	
//	for (var i=0; i<settings['color_level'].length; i++){CF3D_styler.add_color_level();}
//	settings = CF3D_styler.default_settings_import;
//	init_settings('#settings_window');
	
}

CF3D_styler.create_new = function(){
	data = {};
	data['name'] = $("#settings_window #name").val();;
	data['stn_json'] = JSON.stringify(CF3D_styler.get_data_settings('#settings_window'));
	console.log(data);
	
	html = $.ajax({     
		url: CF3D_styler.base_url+"index.php/qcf3d/stn_template/create_new/",
		type: "POST",
		data: data
	}).done(function (response, textStatus, jqXHRб){
		result = JSON.parse(response);
		if (result){location.reload();}
//		else {output_message(result['msg'], 'alert-danger');}
	})	
	
}

/*
 * функция получения данных настроек (из окна)
 * vadim
 * 20141113
 */
CF3D_styler.get_data_settings = function (selector){
	for (var i in CF3D_styler.default_settings_import){
//	for (var i in CF3D_styler.default_settings_import){
		if (CF3D_styler.default_settings_import[i]['default_value'] instanceof Array){
			for (var j=0; j<$(selector+' [attribute="'+CF3D_styler.default_settings_import[i]['id']+'"]').length; j++){
				settings[CF3D_styler.default_settings_import[i]['id']][j] = $(selector+' #'+CF3D_styler.default_settings_import[i]['id']+'_'+j).val()
			}
		}
		else{
			settings[CF3D_styler.default_settings_import[i]['id']] = $(selector+' #'+CF3D_styler.default_settings_import[i]['id']).val();
		}
	}
	return settings;
}
//конец функции


/*
 * функция выбора шаблона настроек
 * vadim
 * 20141111
 */
CF3D_styler.add_color_level = function(position){
	if (position>=0) {selector = '[position=\''+position+'\']'}
	else {selector = '#settings_window'}

	level=$('[position=\''+position+'\']'+' #for_add_color_level [type=color]').length;
	content = '<div id="field_'+level+'"><label>'+(level+1)+' - </label><input type="color" attribute="color_level" id="color_level_'+level+'"/><button type="button" onclick="$(\'#field_'+level+'\').remove()"><span class="glyphicon glyphicon-remove-sign"></span></button></div><br>';
	$('[position=\''+position+'\']'+' #for_add_color_level').append(content);
	if (settings['color_level'][level]) {$('#color_level_'+level).val(settings['color_level'][level])}

}
//конец функции

/*
 * функция инициализации настроек
 * vadim
 * 20141110
 */
init_settings = function (selector){

	for (var i in CF3D_styler.default_settings_import){
		$(selector+' #'+CF3D_styler.default_settings_import[i]['id']).val(settings[CF3D_styler.default_settings_import[i]['id']])
	}

}
//конец функции


/*
 * функция инициализации настроек
 * vadim
 * 20141110
 */
CF3D_styler.save_stn_template = function (position){

	data = {};
	data['name'] = $("[position='"+position+"'] #name").val();
	data['three_settings_id'] = array_stn_template[position]['three_settings_id'];
	data['stn_json'] = JSON.stringify(CF3D_styler.get_data_settings("[position='"+position+"']"));
	console.log(data);
	
	html = $.ajax({     
		url: CF3D_styler.base_url+"index.php/qcf3d/stn_template/save_stn_template/",
		type: "POST",
		data: data
	}).done(function (response, textStatus, jqXHRб){
		
		result = JSON.parse(response);
		if (result['result']==1){location.reload();}
		else {output_message(result['msg'], 'alert-danger');}
		
//		location.reload();
	})	
		

}
//конец функции


CF3D_styler.onWindowResize = function(){
//	$('#canvas_area').css({'top': window.innerHeight - $('#cf3d_menu_div').height(), 'width': window.innerWidth - $('#list_stn_template').width();})
	$('#canvas_area').css({'z-index':'0',top:($('#cf3d_menu_div').height()+4)+'px',left:($('table').width())+'px',height:(window.innerHeight*0.5),width:(window.innerWidth*0.5)})
//	$('#label_area').css({'z-index':'0',top:($('#cf3d_menu_div').height()+4)+'px',left:($('table').width()-10)+'px',height:(window.innerHeight*0.6),width:(window.innerWidth*0.6)})
	$('#canvas_area canvas').css({height:(window.innerHeight*0.5),width:(window.innerWidth*0.5)})
	$('#canvas_area #label_area').css({height:(window.innerHeight*0.5),width:(window.innerWidth*0.5)})
//	CF3D.renderer.setSize(window.innerWidth*0.6, window.innerHeight*0.6);

}
