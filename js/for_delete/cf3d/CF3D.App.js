/* 

 */

var CF3D = {
	camera: null,
	scene: null,
    raycaster:new THREE.Raycaster(),
    projector: new THREE.Projector(),
	mouse: new THREE.Vector2(),		
	move: new THREE.Vector2(),
	paste_position: null,
	context: null,
	base_url: null,
	scheme: null,
	table: null,
	db_name: null,
};
var settings = new Object();
var stn_template, stn_template_id;

var default_parameters_dialog =	{
			title: "txt_panel_settings",
			autoOpen: false,
			height: 'auto',
			width: 'auto',
			position: 'top',
		}

CF3D.init = function (){
			this.scene = new THREE.Scene();//создание сцены для формирования 3d объектов
		
			this.config = new Config();

			this.create_camera();
			this.create_renderer();			
			this.create_container();
			this.create_labelRenderer();
		

			this.create_light();
			
			
			document.addEventListener('mousemove',function (event){
				
				CF3D.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
				CF3D.mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;
				CF3D.move.x=event.clientX
				CF3D.move.y=event.clientY

			})

			
			document.addEventListener('dblclick',function (event){
				if (CF3D.selected_obj && CF3D.selected_obj['type_element']) {
					if (CF3D.mode=="MULTIPLE") {
						CF3D_import.open_object(CF3D.selected_obj['sbj_id']);
					}
/*					else if (CF3D.mode=="MULTIPLESINGLE" && CF3D.selected_obj['open_obj']==false){
						CF3D.open_object(CF3D.selected_obj['sbj_id']);
					}
					
*/					//CF3D.open_object();
				}
			});

			//событие при клике правой кнопкой мыши
			
			$('canvas').click(function (event){
				if (CF3D_editor.planeHelper){
					var vector = new THREE.Vector3( CF3D.mouse.x, CF3D.mouse.y, 1 );
					CF3D.projector.unprojectVector( vector, CF3D.camera );
					CF3D.raycaster.set( CF3D.camera.position, vector.sub( CF3D.camera.position ).normalize() );
					intersects = CF3D.raycaster.intersectObjects( CF3D.scene.children );
					if (intersects.length>0){
						if ( intersects[0]['object'].geometry instanceof THREE.PlaneGeometry ) {
							if (CF3D_3dgl.add_object_window!=null) {
								new_position = intersects[0]['point'];
								var new_object = default_object;
								new_object['X'] = new_position.x;
								new_object['Z'] = new_position.z;
								new_object['sbj_id'] = CF3D.scene.children.length;
								CF3D_3dgl['add_'+CF3D_3dgl.add_object_window](new_object)
								CF3D.transformControls.attach(CF3D.scene.children[CF3D.scene.children.length-2])
								CF3D_3dgl.add_object_window=null;
								CF3D.right_click_sel_obj = CF3D.scene.children[CF3D.scene.children.length-2]
							}
						}
					}
				}
				else if ( CF3D.mode == 'EDITOR' ) {alert(langs.get_term("txt_not_plane"))}

				if ( event.shiftKey && CF3D.click_object && (CF3D.click_object != CF3D.selected_obj)){
					CF3D.connect_obj1 = CF3D.click_object;
					CF3D.connect_obj2 = CF3D.selected_obj;
					type = CF3D_editor.get_connect_type(function(id_window) {
							CF3D_3dgl['connect_'+$("#type_line").val()]();
							$('#'+id_window).dialog('close');
						});
				}				
				
				if ( CF3D.selected_obj ) {
					CF3D.click_object = CF3D.selected_obj;
				}

				$("#pop_up_window_div").remove();				

			})			
			
			$('body').bind("contextmenu",function(event){
				if (CF3D.selected_obj) {	
					open_pop_window(event.clientX,event.clientY,"object")
				}
				else if (CF3D.paste_position)(open_pop_window(event.clientX,event.clientY,"plane"))
			})
			
			window.addEventListener( 'resize', onWindowResize, false );
			
			$(document).keydown(function(event) {CF3D.event_keyboard()})
			
}

/*
 * функция загрузки контекстного меню
 * vadim
 * 20141008
 */
CF3D.load_context = function (context){
	CF3D.context=context;
}
//конец функции


CF3D.create_camera = function (){

	this.camera = new THREE.PerspectiveCamera(35, window.innerWidth/window.innerHeight, 1, 1000000);
	this.camera.position.z = 6300; //установление позиции камеры по оси z
	this.camera.position.x = 0; //установление позиции камеры по оси x
	this.camera.position.y = 5000; //установление позиции камеры по оси y

}	
		
CF3D.create_container = function (){
	
	field_canvas=document.getElementById('field_building');
	this.container = document.createElement( 'div' );
	this.container.style.top='0';
	this.container.style.left='0';
	this.container.style.position='absolute';
	this.container.style.zIndex = '-1';		
	field_canvas.appendChild( this.container );
	this.container.setAttribute('id','canvas_area')
	this.container.appendChild( this.renderer.domElement );	
}

CF3D.create_labelRenderer = function (){

	this.labelRenderer = new THREE.CSS2DRenderer();
	this.labelRenderer.setSize( window.innerWidth, window.innerHeight );
	this.labelRenderer.domElement.style.position = 'absolute';
	this.labelRenderer.domElement.style.top = '0';
	this.labelRenderer.domElement.style.left = '0';
	this.labelRenderer.domElement.style.zIndex = '0';
	this.labelRenderer.domElement.style.pointerEvents = 'none';
	this.labelRenderer.domElement.setAttribute('id','label_area')
	this.container.appendChild( this.labelRenderer.domElement );		
		
}

		
CF3D.create_renderer = function (){

	this.renderer = new THREE.WebGLRenderer();
	if ($.cookie("background_color") && $.cookie("background_color")!='null') {
		this.renderer.setClearColorHex($.cookie("background_color"));
	}
	else {
		this.renderer.setClearColorHex(0xe5e5e5);
	}

	this.renderer.shadowMapEnabled = false;// появляется тень от источника света
	this.renderer.setSize(window.innerWidth, window.innerHeight);
	this.renderer.shadowMapWidth = 5024;
	this.renderer.shadowMapHeight = 5024;
	this.renderer.shadowMapDarkness = 1;

	field_canvas=document.getElementById('field_building');


	this.renderer.domElement.style.position = "relative";
	this.renderer.domElement.style.top = '0';		
	this.renderer.domElement.style.left = '0';
	this.renderer.domElement.style.zIndex = '0';		
	this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );

}	

/*
 * функция создания источника света на сцене
 * vadim
 * 20140930
 */
CF3D.create_light = function (){

	var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
	directionalLight.position.set( CF3D.camera.position.x, CF3D.camera.position.y, CF3D.camera.position.z );
	this.scene.add( directionalLight );
	directionalLight.name = 'light';
				
//				light = CF3D.scene.children[i].get_json()
	directionalLight.get_json = function (){
		return {
			"typical_element_type":"DirectionalLight",
			"X":directionalLight.position.x,
			"Y":directionalLight.position.y,
			"Z":directionalLight.position.z,
			"color": directionalLight.color.getHex(),
		}
	}

}
// конец функции

/*
 * функция изменения ширины страницы
 * vadim
 * 20141009
 */
function onWindowResize() {

	CF3D.camera.aspect = window.innerWidth / window.innerHeight;
	CF3D.camera.updateProjectionMatrix();
	CF3D.labelRenderer.setSize( window.innerWidth, window.innerHeight );
	CF3D.renderer.setSize( window.innerWidth, window.innerHeight );
	
}
// конец функции


CF3D.run = function (){
	this.render();
}


//функция вывода контекстного меню	
open_pop_window = function(x, y){
	
	if (CF3D.transformControls.object != null){
		CF3D.clear_select()
		CF3D.create_lines(CF3D.right_click_sel_obj)
	}
	
	if (CF3D.selected_obj && CF3D.selected_obj != CF3D_editor.planeHelper){
		CF3D.right_click_sel_obj = CF3D.selected_obj;
		CF3D.change_lvl_color = CF3D.right_click_sel_obj['level']
	}
	if (!CF3D.right_click_sel_obj) {return;}
	$("#pop_up_window_div").remove();
	var pop_up_window_div = '<div id="pop_up_window_div" class="pop_up_window" style="position:absolute;left:'+x+'px;top:'+y+'px;"></div>';
	$("body").append(pop_up_window_div);
	var pop_menus = '';
	for (var j in CF3D.context){
		pop_menus += '<hr style= "padding:1px;margin:3px;">';
		pop_menus += '<li class="pop_up_item" onclick="'+CF3D.context[j]['on_click']+'">';
		pop_menus += '<span class="'+CF3D.context[j]['image']+'"></span>&nbsp;';
		pop_menus += langs.get_term(CF3D.context[j]['name']);
		pop_menus += '</li>';
	}
	$("#pop_up_window_div").html(pop_menus);
	
	//вычисление координаты x, y в случае если контесктное меню выходит за границы окна
	if ((( y + parseInt($('#pop_up_window_div').css('height')) ) - window.innerHeight)>0){
		$('#pop_up_window_div').css('top',y - (( y + parseInt($('#pop_up_window_div').css('height')) ) - window.innerHeight))
	}
	if ((( x + parseInt($('#pop_up_window_div').css('width')) ) - window.innerWidth)>0){
		$('#pop_up_window_div').css('left',x - (( x + parseInt($('#pop_up_window_div').css('width')) ) - window.innerWidth))
	}	
} 			
//конец

/*
 * функция очистки глобальных переменных
 * vadim
 * 20140930
 */
CF3D.clear_select = function (){
	if (CF3D.right_click_sel_obj!=null){
		update_topology(CF3D.right_click_sel_obj)
		CF3D.create_lines()
	}
	CF3D.transformControls.detach (CF3D.right_click_sel_obj);
	CF3D.right_click_sel_obj = null;
}
// конец функции

/*
 * функция запуска функция перемещения объекта
 * vadim
 * 20140926
 */
CF3D.move_object = function (move_child){
	if (move_child == true) CF3D.right_click_sel_obj.move_child = true;
	$("#pop_up_window_div").remove();
	CF3D.transformControls.attach(CF3D.right_click_sel_obj)
		CF3D.rec_del_lines()
}	
// конец

// инициализация линий для перемещений
CF3D.init_helper_arrow = function (){

	CF3D.transformControls = new THREE.TransformControls( CF3D.camera, CF3D.container );
		CF3D.transformControls.addEventListener( 'change', function () {
			CF3D.controls.enabled = true;
		});
	CF3D.scene.add( CF3D.transformControls );			

}
// конец

/*
 * функция загрузки списка importa-файлов
 * vadim
 * 20141008
 */
CF3D.load_data_import = function (form_data_import){
	this.form_data_import=form_data_import;
}
//конец функции

CF3D.array_buttons = function (numb){
	var array_buttons = new Array();
	for (var i = 0; i < numb; i++){
		array_buttons[array_buttons.length] = {
			"name":'btn_cancel',
			"onclick":"$(\'#\').dialog(\'close\')",
			"style":"btn btn-primary btn-sm",
			"id":"btn_cancel",
		}
	}
	return array_buttons;
}

/*
 * функция открытия формы import
 * vadim
 * 20141001
 */
CF3D.open_view = function (view){
	id_win = "import_window";
	var dialog_parameters = JSON.parse(JSON.stringify(default_parameters_dialog));
	dialog_parameters.width = 500;
	dialog_parameters.title = langs.get_term("txt_open_import");
	
	down_panel_buttons = CF3D.array_buttons(2);
	down_panel_buttons[0].name = langs.get_term('sm_btn_open');
	down_panel_buttons[0].onclick = "CF3D.check_form_"+view+"()";
	down_panel_buttons[0].id = "btn_save";

	down_panel_buttons[1].name = langs.get_term('btn_cancel');
	down_panel_buttons[1].onclick = "$(\'#"+id_win+"\').dialog(\'close\')";
	down_panel_buttons[1].id = "btn_cancel";	
	

	data_dialog = {
		parameters: dialog_parameters,
		down_panel_buttons: down_panel_buttons,
		fields_main_content : [
			{
				"id": "name_db",
				"name" :langs.get_term('txt_db_name'),
				"image": "glyphicon glyphicon-copyright-mark",
				"propeties": "onchange=\"select_choose(\'#name_db\')\"",
				"value": '',
				"type" : "select",
				"options" : CF3D.form_data_import
			},
			{
				"id": "name_scheme",
				"name" :langs.get_term('txt_name_scheme'),
				"image": "glyphicon glyphicon-copyright-mark",
				"propeties": "onchange=\"select_choose(\'#name_scheme\')\"",
				"value": '',
				"type" : "select",
				"options" : []
			},
			{
				"id": "name_table",
				"name" :langs.get_term('txt_name_table'),
				"image": "glyphicon glyphicon-copyright-mark",
				"value": '',
				"type" : "select",
				"options" : []
			},			
		],
		id_window : id_win,
		view_templ: "tmpl_main_content",
	}
	QC.open_dialog(JSON.stringify(data_dialog))

}
// конец функции


/*
 * функция загрузки настроек edit
 * vadim
 * 20141008
 */
CF3D.load_settings = function (){
	for (var i in CF3D.list_settings){
		if (stn_template[CF3D.list_settings[i]['id']]){
			settings[CF3D.list_settings[i]['id']] = stn_template[CF3D.list_settings[i]['id']]
		}
		else if ($.cookie(CF3D.list_settings[i]['id'])){
			settings[CF3D.list_settings[i]['id']] = $.cookie(CF3D.list_settings[i]['id'])
		}		
		else {
			settings[CF3D.list_settings[i]['id']] = CF3D.list_settings[i]['default_value']
		}
	}
}
//конец функции



/*
 * функция загрузки списка настроек
 * vadim
 * 20141008
 */
CF3D.load_list_settings = function (list_settings){
	CF3D.list_settings=list_settings;
}
//конец функции


/*
 * событие при изменении элемента select
 * vadim
 * 20141002
 */
select_choose = function (id){
	if (id=='#name_db'){
		$('#name_scheme').html(get_content(CF3D.form_data_import[$('#name_db option:selected').val()]['scheme']))
	}
	else if (id=='#name_scheme'){
		$('#name_table').html(get_content(CF3D.form_data_import[$('#name_db option:selected').val()]['scheme'][$('#name_scheme option:selected').attr('numb_row')]['table']))
	}
}
// конец функции



CF3D.check_form_viewer = function (){
	if ($('#name_db').val() !='' && $('#name_scheme').val() !='' && $('#name_table').val() !=''){
		location.href = CF3D.base_url + 'index.php/qcf3d/view/'+$('#name_db').val()+'/'+$('#name_scheme').val()+'/'+$('#name_table').val()
	}
}

CF3D.check_form_import = function (){
	if ($('#name_db').val() !='' && $('#name_scheme').val() !='' && $('#name_table').val() !=''){
		location.href = CF3D.base_url + 'index.php/qcf3d/import/'+$('#name_db').val()+'/'+$('#name_scheme').val()+'/'+$('#name_table').val()
	}
}

CF3D.show_settings = function (){

	var dialog_parameters = JSON.parse(JSON.stringify(default_parameters_dialog));
	dialog_parameters.title = langs.get_term("txt_panel_settings");
	id_win = "settings_window";

	down_panel_buttons = CF3D.array_buttons(5);
	down_panel_buttons[0].name = langs.get_term('txt_load');
	down_panel_buttons[0].onclick = "CF3D.change_settings()";
	down_panel_buttons[0].id = "btn_load";

	down_panel_buttons[1].name = langs.get_term('btn_cancel');
	down_panel_buttons[1].onclick = "$('#"+id_win+"').dialog(\'close\')";
	down_panel_buttons[1].id = "btn_cancel";		

	down_panel_buttons[2].name = langs.get_term('sm_btn_save');
	down_panel_buttons[2].onclick = "CF3D.update_stn_template()";
	down_panel_buttons[2].id = "btn_save";
	
	down_panel_buttons[3].name = langs.get_term('sm_btn_new');
	down_panel_buttons[3].onclick = "CF3D.add_template_settings()";
	down_panel_buttons[3].id = "create_settings";
	
	down_panel_buttons[4].name = langs.get_term('btn_select');
	down_panel_buttons[4].onclick = "CF3D.select_stn_template()";
	down_panel_buttons[4].id = "select_stn_template";		
	
	data_dialog = {
		parameters :	dialog_parameters,
		down_panel_buttons : down_panel_buttons,
		fields_main_content : CF3D.list_settings,
		id_window : id_win,
		view_templ : "tmpl_main_content"
	}	
	
	QC.open_dialog (JSON.stringify(data_dialog));
	
	for (var i=0; i<settings['color_level'].length; i++){CF3D.add_color_level();}
	init_settings (CF3D.list_settings);
	
}
//конец функции

/*
 * функция загрузки 3D-conframe файла 
 * vadim
 * 20141007
 */
CF3D.new_page = function (url, value){
	if (value != null) {
		value = $('#'+value).val()
	}
	else {
		value = '';
	}
	location.href=CF3D.base_url+url+value;
}
// конец процедуры

/*
 * функция удаления линий объекта и запись в память
 * vadim
 * 20140926
 */
var connected_obj = new Array()
CF3D.rec_del_lines = function (){
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

/*
 * функция записи в глобальный временный массив вершин соединенных связью
 * vadim
 * 20141016
 */
record_arr_connected_obj = function (to,from,type_line){

	connected_obj[connected_obj.length] = {
		'to': to,
		'from': from,
		'type_line': type_line
	}

}
//конец функции

/*
 * функция для генерирования связей из данных занесенных в массив connected_obj
 * vadim
 * 20140926
 */	
CF3D.create_lines = function(obj){

	for (var i=0; i<connected_obj.length;i++){
		CF3D.connect_obj1 = connected_obj[i]['from'];
		CF3D.connect_obj2 = connected_obj[i]['to'];
		type_line = connected_obj[i]['type_line'];
		CF3D_3dgl['connect_'+type_line]();
	}
	connected_obj = new Array()
}
// конец функции


/*
 * функция сохранения изменений настроек
 * vadim
 * 20141003
 */
CF3D.change_settings = function (){
	for (var i in CF3D.list_settings){
		$.cookie(CF3D.list_settings[i]['id'],$('#'+CF3D.list_settings[i]['id']).val())
	}
	location.reload();
}
//конец функции


/*
 * функция сохранения изменений настроек
 * vadim
 * 20141003
 */
CF3D.save_settings = function (){

//	JSON.stringify(settings);
	html = $.ajax({
		url: url_base+"index.php/qcf3d/save_settings",
		type: "POST"
	}).done(function (response, textStatus, jqXHRб){
		alert(1);
	})
}
//конец функции


/*
 * функция сохранение настроек в БД
 * vadim
 * 20141110
 */
CF3D.add_template_settings = function (){
	
	$('#settings_window').dialog('close');

	list_conframe = JSON.stringify(CF3D.get_data_settings());

	var dialog = CFUtil.dialog.create("new_stn_template",
	{
		title: langs.get_term("ttl_save_conframe"), 
		autoOpen: false,
		height: "auto",
		width: 500,
		modal: true
	});
	if ( dialog ){
		html = $.ajax({     
			url: url_base+"index.php/qcore/ajax/load_form/qcf3d/save_settings_form/",    
			type: "POST"         
		}).done(function (response, textStatus, jqXHRб){
			$(dialog).html(response);
			$('#stn_json').val(list_conframe)
		});
	}
	
}
//конец функции

/*
 * функция сохранения привязки шаблона настроек к проекту
 * vadim
 * 20141111
 */
CF3D.update_stn_template = function (){
	if (stn_template_id!=''){
		data['data'] = {
					stn_json : JSON.stringify(CF3D.get_data_settings())
				};
		data['id'] = stn_template_id;
		data['key_field'] = 'three_settings_id';
		console.log(data)
		html = $.ajax({
			url: url_base+"index.php/qcf3d/update_stn_template",
			type: "POST",
			data: data
		}).done(function (response, textStatus, jqXHRб){
			result = JSON.parse(response);
			if (result['result']==1){location.reload();}
			else {output_message(result['msg'], 'alert-danger');}
		})
	}
	else {
		CF3D.add_template_settings();
	}
}
//конец функции

function record_id_stn_template(id){
	CF3D.update_conframe_settings(id);
}

/*
 * функция выбора шаблона настроек
 * vadim
 * 20141111
 */
CF3D.select_stn_template = function (){
	window_open = window.open(CF3D.base_url+'index.php/qcf3d/stn_template/form_select_stn/'+stn_template_id,'QuaSy','left=530,width=1000,height=900,resizable=yes,location=no,modal=yes');
	window_open.focus();
/*	html = $.ajax({     
		url: url_base+"index.php/qcf3d/get_list_stn_template",    
		type: "POST"         
	}).done(function (response, textStatus, jqXHRб){
		
		$('#settings_window').dialog('close');
		list_stn_template = (JSON.parse(response))

		id_win = "open_stn_settings";
		
		parameters_dialog = JSON.parse(JSON.stringify(default_parameters_dialog));
		parameters_dialog.title = langs.get_term("txt_data_object"),
		parameters_dialog.position = 'top';
		parameters_dialog.width = 500;

		down_panel_buttons = CF3D.array_buttons(2);

		down_panel_buttons[0].name = langs.get_term('sm_btn_save');
		down_panel_buttons[0].onclick = "CF3D.update_conframe_settings()";
		down_panel_buttons[0].id = "btn_save";

		down_panel_buttons[1].name = langs.get_term('btn_cancel');
		down_panel_buttons[1].onclick = "$(\'#"+id_win+"\').dialog(\'close\')";
		down_panel_buttons[1].id = "btn_cancel";	
		
		data_dialog = {
			parameters:	parameters_dialog,
			down_panel_buttons:down_panel_buttons,
			fields_main_content : [
				{
					"id": "stn_template",
					"name" : langs.get_term('sm_btn_conframe'),
					"image": "glyphicon glyphicon-copyright-mark",
					"value": "",
					"type" : "select",
					"options" : list_stn_template
				},
			],
			id_window : id_win,
			view_templ: "tmpl_main_content",
			
		}
		
		QC.open_dialog(JSON.stringify(data_dialog))
	})	
*/	
}
//конец функции


/*
 * функция сохранения привязки шаблона настроек к проекту
 * vadim
 * 20141111
 */
CF3D.update_conframe_settings = function (id){
	
	data['stn_template'] = id;
	data['name'] = CF3D.scheme+'/'+CF3D.table;
	html = $.ajax({
		url: url_base+"index.php/qcf3d/update_conframe_settings",
		type: "POST",
		data: data
	}).done(function (response, textStatus, jqXHRб){

		location.reload();
	
	})	
	
}
//конец функции







	
CF3D.render = function () {
	CF3D.controls.update()

	CF3D.transformControls.update()	

	var vector = new THREE.Vector3( CF3D.mouse.x, CF3D.mouse.y, 1 );

	CF3D.projector.unprojectVector( vector, CF3D.camera );

	CF3D.raycaster.set( CF3D.camera.position, vector.sub( CF3D.camera.position ).normalize() );
	var intersects = CF3D.raycaster.intersectObjects( CF3D.scene.children );
	if ( intersects.length >0 ) {

		if ( CF3D.selected_obj != intersects[ 0 ].object ) {

			if ( CF3D.selected_obj ){
				CF3D.selected_obj.material = CF3D.selected_obj.currentHex;
				CF3D.selected_obj = null;
			}
			if (intersects[ 0 ].object.select == true) {
				CF3D.selected_obj = intersects[ 0 ].object;
				CF3D.selected_obj.currentHex = CF3D.selected_obj.material;
				CF3D.selected_obj.material=new THREE.MeshLambertMaterial({color: 0xb0cdcb});
			}
			
		}
		if (intersects[ 0 ].object.geometry  instanceof THREE.PlaneGeometry ){
			CF3D.paste_position = intersects[ 0 ].point;
		}
	}	
	else {

		if ( CF3D.selected_obj ) CF3D.selected_obj.material= CF3D.selected_obj.currentHex ;

			CF3D.paste_position = null;

		CF3D.selected_obj = null;
		CF3D.controls.enabled = true;
	}

	if ( CF3D.right_click_sel_obj && CF3D.right_click_sel_obj['label'])	{
		CF3D.right_click_sel_obj['label'].position.set(CF3D.right_click_sel_obj.position.x,CF3D.right_click_sel_obj.position.y,CF3D.right_click_sel_obj.position.z)
	}

	requestAnimationFrame(CF3D.render);
//	render();
	CF3D.renderer.render(CF3D.scene, CF3D.camera);
	CF3D.labelRenderer.render( CF3D.scene, CF3D.camera );
		
};