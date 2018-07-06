/* 

 */
 


var QFolder = {
	base_url: null, //переменная для хранения адреса сайта
	controller_url: null, //переменная для хранения адреса сайта
	trash_id: null, //переменная для хранения адреса сайта
	current_folder: null, //переменная для хранения адреса сайта
};

/*
 * функция инициализации элементов и объектов страницы
 * Vadim GRITSENKO
 * 20141224
 */
QFolder.init = function (){
	if (QFolder.current_folder==''){get_last_mod_files()}
	else {QFolder.open_folder(QFolder.current_folder,false,'not_root')}


	$('#folder_div, #area_files').height( $(window).height()-50+"px");	

	$("#browser").treeview({persist: "cookie"});
	$('a[role="folder"]').click(function (){
		$(this).parent('.folder').trigger('click');		
		QFolder.open_folder($(this).attr('folder_id'),true,'is_root');
	})
	$('a[role="file"]').click(function (){
		alert($(this).attr('conframe_id'))
	})
	$('a[role="system_folder"]').click(function (){QFolder.open_folder($(this).attr('folder_id'),true,'is_system');})
	$('a[role="last_mod_files"]').click(function (){get_last_mod_files(true);})
	$("#cell_tree").css("height",$('#cell_data_folder').height());

	$(window).resize(function (){change_width_cell();$('#folder_div, #area_files').height( $(window).height()-50+"px");});
	
	$("#div_resize_tree").draggable({
		axis:'x',
		drag: function( event, ui ) {
			$('#cell_tree').width($(this).css('left'));
			if (parseInt($(this).css('left'))>=parseInt($('#cell_tree').css('max-width'))+90) {
				change_width_cell()
			}
			$('#area_files').width($(window).width()-$('#folder_div').width());
		},
		stop: function( event, ui ) {
			if (parseInt($(this).css('left'))>=parseInt($('#cell_tree').css('max-width'))+90) {
				change_width_cell()
			}
			$("#div_resize_tree").css('left',$('#folder_div').width())
			$('#area_files').width($(window).width()-$('#folder_div').width());
		}
	});

	/*
	 * функция для установления размеров областей окна
	 * Vadim GRITSENKO
	 */
	function change_width_cell(){
		$('#div_resize_tree').css('left',parseInt($('#cell_tree').css('max-width'))+90);
		$('#cell_tree').width($('#folder_div').width());
		$('#area_files').width($(window).width()-$('#folder_div').width());
	}

	/*
	 * выделение нужных файлов
	 * Vadim GRITSENKO
	 */
	$('#select_all').click(function (){
		if ($(this).prop("checked")) {$('.select_file').each(function (){$(this).attr('checked','checked');})}
		else {$('.select_file').each(function (){$(this).removeAttr('checked');})}
	})

	/*
	 * операции при выполнении какого-либо события
	 * Vadim GRITSENKO
	 */
	$('.jstree-anchor').bind('mouseover', function(){
		$(this).toggleClass('jstree-hovered').mouseout(function(){$(this).removeClass('jstree-hovered')});});
	$('.jstree-anchor').bind('click', function(){
		$('.jstree-clicked').removeClass('jstree-clicked');
		$(this).toggleClass('jstree-clicked');
	});

	var data_conframe = null;
	var cols = document.querySelectorAll('td');
	[].forEach.call(cols, function(col) {
		col.addEventListener('dragstart', function(e){
				
				var dragIcon = document.createElement('img');
				dragIcon.src = QFolder.base_url+'/img/cf.ico';
				dragIcon.width = 300;
				e.dataTransfer.setDragImage(dragIcon, -10, -10);	
				
				data_conframe = get_selected_files();
				if (data_conframe.length == 0){
					data_conframe = [{
						'conframe_id':$(e.toElement).parent().attr('conframe_id'),
						'name':$(e.toElement).parent().attr('conframe_name')
					}]
				}
			}, false); //начало перемещени
		col.addEventListener('dragover', function(e){
				if (e.preventDefault) e.preventDefault();
			}, false);
		col.addEventListener('drop', function(e){
				if (e.preventDefault) e.preventDefault();
					if ($(e.toElement).attr('folder_id')){QFolder.move_files(data_conframe, $(e.toElement).attr('folder_id'))}
			}, false);

			
	})

}
//конец функции

/*
 * функция для формирования списка последних измененных файлов
 * Vadim GRITSENKO
 */
function get_last_mod_files(table_destroy){
	
	if (table_destroy==true){oTable.fnDestroy()}
		$('#group_btn_action').html(get_html_dropdown('0', 'last_file'));		
	$('#list_parent_folder').html('<li>'+langs.get_term('txt_last_mod_file')+'</li>');
	generate_table('null');
	oTable.fnSort( [ [4,'desc'] ] );
	get_min_width();
	$('div.dataTables_filter input').focus();
}	

/*
 * функция изменения значения минимальной ширины область дерева
 * Vadim GRITSENKO
 */
function get_min_width(){
	min_width=parseInt($('#cell_tree').width());
	$("#div_resize_tree").css('left',parseInt($('#folder_div').width()));
}	

/*
 * функция переименования выбранных файлов
 * Vadim GRITSENKO
 * 20141224
 */
QFolder.rename_file = function(){
	if ($('.select_file:checked').not("#select_all").length==1){

		id_win = "save_window";
		parameters_dialog = {
			title : "txt_elaboration",
			position : 'top',
			width : 400,
		};

		down_panel_buttons = [
				//кнопка сохранения
				{
					name: langs.get_term('sm_btn_save'),
					onclick: 'QFolder.update_file('+$('.select_file:checked').not( "#select_all" ).attr('id_file')+','+$('.select_file:checked').not( "#select_all" ).attr('fk_folder')+')',
					id: "btn_save",
					style: 'btn btn-primary btn-sm',						
				},
				//кнопка закрытия диалогового окна
				{
					name: langs.get_term('btn_cancel'),
					onclick: "$(\'#"+id_win+"\').dialog(\'close\')",
				},				
			
			]
		
		data_dialog = {
			parameters:	parameters_dialog,
			down_panel_buttons:down_panel_buttons,
			fields_main_content : [
				{
					"id": "label_name",
					"name" :'I223',
					"image": "glyphicon glyphicon-copyright-mark",
					"value": $('.select_file:checked').not( "#select_all" ).attr('name_file'),
					"type" : "text"
				},
			],
			id_window : id_win,
			view_templ : "tmpl_main_content",
			focus_selector: '#label_name',
		}	

		QC.open_dialog (JSON.stringify(data_dialog))			
	}
	else {
		QFolder.window_not_exist_file()	
	}
}

/*
 * функция переименования выбранных файлов
 * Vadim GRITSENKO
 * 20141224
 */
QFolder.form_delete_file = function (){
	if ($('.select_file:checked').length==1 && $('.select_file:checked').attr('id')=='select_all'){
		QFolder.window_not_exist_file()	
	}	
	else if ($('.select_file:checked').length>=1){
	

		id_win = "save_window";
		parameters_dialog = {
			title : langs.get_term('I232'),
			position : 'top',
			width : 400,
		};

		down_panel_buttons = [
				//кнопка подтверждения удаления
				{
					name: langs.get_term('txt_ok'),
					onclick: 'QFolder.delete_file()',
					id: "btn_save",
					style: 'btn btn-primary btn-sm',						
				},
				//кнопка закрытия диалогового окна
				{
					name: langs.get_term('btn_cancel'),
					onclick: "$(\'#"+id_win+"\').dialog(\'close\')",
				},				
			
			]
		
		data_dialog = {
			parameters:	parameters_dialog,
			down_panel_buttons:down_panel_buttons,
			fields_main_content : [
				{
					"id": "label_name",
					"name" :langs.get_term('I232'),
					"image": "glyphicon glyphicon-copyright-mark",
					"value": '',
					"type" : "label"
				},
			],
			id_window : id_win,
			view_templ : "tmpl_main_content",
			focus_selector: '#label_name',
		}	

		QC.open_dialog (JSON.stringify(data_dialog))
	}
	else {
		QFolder.window_not_exist_file()	
	}			
}

/*
 * функция для генерирования сообщения об ошибке
 * Vadim GRITSENKO
 * 20141224
 */
QFolder.window_not_exist_file = function(){
	id_win = "save_window";
	parameters_dialog = {
		title : langs.get_term('txt_elaboration'),
		position : 'top',
		width : 400,
	};

	down_panel_buttons = [
			//кнопка закрытия диалогового окна
			{
				name: langs.get_term('btn_cancel'),
				onclick: "$(\'#"+id_win+"\').dialog(\'close\')",
			},				
		
		]
	
	data_dialog = {
		parameters:	parameters_dialog,
		down_panel_buttons:down_panel_buttons,
		fields_main_content : [
			{
				"id": "label_name",
				"name" :'txt_file_is_not_selected',
				"image": "glyphicon glyphicon-copyright-mark",
				"value": '',
				"type" : "label"
			},
		],
		id_window : id_win,
		view_templ : "tmpl_main_content",
		focus_selector: '#label_name',
	}	

	QC.open_dialog (JSON.stringify(data_dialog));
}

/*
 * функция создание контента диалогового окна переименования каталога
 * Vadim GRITSENKO
 * 20141224
 */
QFolder.rename_folder = function(folder_id,name_folder,parent_id){
	id_win = "save_window";
	parameters_dialog = {
		title : langs.get_term('I223'),
		position : 'top',
		width : 400,
	};

	down_panel_buttons = [
			//кнопка подтверждения удаления
			{
				name: langs.get_term('txt_ok'),
				onclick: 'QFolder.update_folder('+folder_id+','+parent_id+',\''+name_folder+'\')',
				id: "btn_save",
				style: 'btn btn-primary btn-sm',						
			},
			//кнопка закрытия диалогового окна
			{
				name: langs.get_term('btn_cancel'),
				onclick: "$(\'#"+id_win+"\').dialog(\'close\')",
			},			
		]
	
	data_dialog = {
		parameters:	parameters_dialog,
		down_panel_buttons:down_panel_buttons,
		fields_main_content : [
			{
				"id": "label_name",
				"name" :'I223',
				"image": "glyphicon glyphicon-copyright-mark",
				"value": decodeURI(name_folder),
				"type" : "text"
			},
		],
		id_window : id_win,
		view_templ : "tmpl_main_content",
		focus_selector: '#label_name',
	}	
	QC.open_dialog (JSON.stringify(data_dialog));	
}
/*
 * функция создание контента диалогового окна создания нового каталога
 * Vadim GRITSENKO
 * 20141224
 */
QFolder.create_new_folder = function(parent_id){

	id_win = "save_window";
	parameters_dialog = {
		title : langs.get_term('I220'),
		position : 'top',
		width : 400,
	};

	down_panel_buttons = [
			//кнопка подтверждения удаления
			{
				name: langs.get_term('txt_ok'),
				onclick: 'QFolder.new_folder('+parent_id+')',
				id: "btn_save",
				style: 'btn btn-primary btn-sm',						
			},
			//кнопка закрытия диалогового окна
			{
				name: langs.get_term('btn_cancel'),
				onclick: "$(\'#"+id_win+"\').dialog(\'close\')",
			},			
		]
	
	data_dialog = {
		parameters:	parameters_dialog,
		down_panel_buttons:down_panel_buttons,
		fields_main_content : [
			{
				"id": "label_name",
				"name" :'btn_new_folder',
				"image": "glyphicon glyphicon-copyright-mark",
				"value": langs.get_term('btn_new_folder'),
				"type" : "text"
			},
		],
		id_window : id_win,
		view_templ : "tmpl_main_content",
		focus_selector: '#label_name',
	}	
	QC.open_dialog (JSON.stringify(data_dialog));	
}


/*
 * функция ajax изминения имени файла
 * Vadim GRITSENKO
 * 20141224
 */
QFolder.update_file = function (fid, folder){
	if ($('#label_name').val().trim()!=""){
		var data={};
		data['conframe_id']=fid;
		data['fk_folder']=folder;
		data['name']=$('#label_name').val().trim();
		query=$.ajax({
			url: QFolder.controller_url+'/rename_file',
			type:'POST',
			data: data
		});
		query.done(function (response, textStatus, jqXHRб){
			result=JSON.parse(response);
			if (result['result']==1){location.reload();}
			else{output_message(result['msg'], 'alert-danger');}
		});
	}
	else {output_message(langs.get_term("err_inv_fld_name"), 'alert-danger');}
}

/*
 * функция ajax создания нового каталога
 * Vadim GRITSENKO
 * 20141224 
 */
QFolder.new_folder = function(fid){
	if ($('#label_name').val().trim()!=""){
		var data={};
		var data={};
		data['parent_id']=fid;
		data['name']=encodeURI($('#label_name').val().trim());
		query=$.ajax({
			url: QFolder.controller_url+'/new_folder/',
			type:'POST',
			data: data
		});
		query.done(function (response, textStatus, jqXHRб){
			result=JSON.parse(response);
			if (result['result']==1){location.href=QFolder.controller_url+'/open/'+result['msg'];}
			else{output_message(result['msg'], 'alert-danger');}
		});
	}
	else {output_message('<?php echo lang("err_inv_fld_name");?>', 'alert-danger');}
}


/*
 * функция формирования окна сообщения о выполнении какой-либо операции
 * Vadim GRITSENKO
 */
function output_message(text, class_alarm){
	var dialog =new CFEAlert('');
	dialog.set_message(text);
	dialog.set_type(class_alarm);
	dialog.show_message();
}

/*
 * функция для удаление файла-ов (перемещение файла-ов в папку Trash)
 * Vadim GRITSENKO
 * 20141224
 */
QFolder.delete_file = function(){
	QFolder.move_files(get_selected_files(), QFolder.trash_id);
}

/*
 * функйия для формирования массива выбранных файлов
 * Vadim GRITSENKO
 * 20141224
 */
function get_selected_files(){
	var files=new Array;
	$('.select_file:checked').each(function(){
		if (QFolder.trash_id != $(this).attr('id_folder')){
			if ($(this).attr('id')!="select_all"){
				obj = {
					'conframe_id':$(this).parent().parent().attr('conframe_id'),
					'name':$(this).parent().parent().attr('conframe_name')
				};
				files.push(obj);
			}
		}
		else {
			alert('Файл уже находится в папке удаленных');
			$(this).removeAttr('checked');
			$('#save_window').remove();
		}
	})
	return files;
}

/*
 * функция для перемещения выбранных файлов
 * Vadim GRITSENKO
 * 20141224
 */
QFolder.move_files = function(files,folder){
	var data={};
	data['fk_folder']=folder;
	data['files']=files;
	query=$.ajax({
		url: QFolder.controller_url+'/ajax_move_file/',
		type:'POST',
		data: data
	});
	query.done(function (response, textStatus, jqXHRб){
		result=JSON.parse(response);
		if (result['result']==-1){
			output_message(result['msg'], 'alert-danger');
		}
		else location.reload();
	});
}

/*
 * функция перемещения выбранных файлов
 * Vadim GRITSENKO
 * 20141224
 */
QFolder.move_file = function(){
	if ($('.select_file:checked').length>=1 && $('.select_file:checked').attr('id')!='select_all'){
		 var dialog = CFUtil.dialog.create("save_window",
			{
				title: langs.get_term('I231'), 
				autoOpen: false,
				height: "auto",
				width: 400,
				modal: true
			});
			if ( dialog ){
				query=$.ajax({
					url: QFolder.base_url+'index.php/conframe_bi/folder/build_folder_tree_bi/winbrowser',
					type:'POST'
				});
				query.done(function (response, textStatus, jqXHRб){
					if (response){
						$(dialog).html('<div id="dialog_move_tree" class="tree" style="heigth:100%;width:100%">'+response+'</div>');
						$("#winbrowser").treeview({persist: "cookie"});
						$('a[role="folder"]').click(function (){
							$(this).parent('.folder').trigger('click');		
							$('#move_to_folder').remove();
							$('#dialog_move_tree').before('<button id="move_to_folder" type="button" folder_id='+$(this).attr('folder_id')+'>'+langs.get_term('sm_btn_move_selected_files')+'-'+$(this).text()+'</button>')
							$('#move_to_folder').click(function (){
							QFolder.move_files(get_selected_files(),$(this).attr('folder_id'))
							});
						})
					}
				});	
			}
	}
	else {
		QFolder.window_not_exist_file()		
	}
}
/*
 * функция ajax переименования каталога
 * Vadim GRITSENKO
 * 20141224
 */
QFolder.update_folder = function(fid, parent_id, old_name){
	if (old_name==$('#label_name').val().trim()){$('#save_window').dialog('close');}
	else if ($('#label_name').val().trim()!=""){
		var data={};
		data['folder_id']=fid;		
		data['name']=encodeURI($('#label_name').val().trim());		
		data['parent_id']=parent_id;		
		query=$.ajax({
			url: QFolder.controller_url+'/update_folder/',
			type:'POST',
			data: data});
		query.done(function (response, textStatus, jqXHRб){
			result=JSON.parse(response);
			if (result['result']==1){location.reload();}
			else{output_message(result['msg'], 'alert-danger');}				
			
		});
	}
	else {output_message(langs.get_term("err_inv_fld_name"), 'alert-danger');}		
}

/*
 * функция ajax проверки на возможность удаления выбранной папки
 * Vadim GRITSENKO
 * 20141224
 */
QFolder.check_del_folder = function(fid){
	var data={};
	data['folder_id']=fid;
	query=$.ajax({
		url: QFolder.controller_url+'/validation_delete_folder/',
		type:'POST',
		data: data});
	query.done(function (response, textStatus, jqXHRб){						
		if (response==""){
			id_win = "delete_window";
			parameters_dialog = {
				title : langs.get_term('I220'),
				position : 'top',
				width : 400,
			};
			down_panel_buttons = [
					//кнопка подтверждения удаления
					{
						name: langs.get_term('txt_ok'),
						onclick: 'QFolder.delete_folder('+fid+')',
						id: "btn_save",
						style: 'btn btn-primary btn-sm',						
					},
					//кнопка закрытия диалогового окна
					{
						name: langs.get_term('btn_cancel'),
						onclick: "$(\'#"+id_win+"\').dialog(\'close\')",
					},			
				]
			
			data_dialog = {
				parameters:	parameters_dialog,
				down_panel_buttons:down_panel_buttons,
				fields_main_content : [
					{
						"id": "label_name",
						"name" :'I219',
						"image": "glyphicon glyphicon-copyright-mark",
						"value": '',
						"type" : "label"
					},
				],
				id_window : id_win,
				view_templ : "tmpl_main_content",
				focus_selector: '#label_name',
			}	
			QC.open_dialog (JSON.stringify(data_dialog));
		}
		else {
			output_message(response, 'alert-danger')
		}
	});		
}

/*
 * функция ajax удаления каталога
 * Vadim GRITSENKO
 * 20141224
 */
QFolder.delete_folder = function(fid){
	var data={};
	data['folder_id']=fid;		
	query=$.ajax({
		url: QFolder.controller_url+'/delete/',
		type:'POST',
		data: data});
	query.done(function (response, textStatus, jqXHRб){						
		if (response==""){
			output_message(langs.get_term("I225"), 'alert-success');
			location.href=QFolder.controller_url+'/open/';
			}
		else {
			output_message(response, 'alert-danger')
		}
	});
} 

/*
 * функция создание списка путь выбранной папки
 * Vadim GRITSENKO
 * 20141224
 */
QFolder.open_folder = function(fid,destroy_table,view_folder){
	$('#select_all').removeAttr("checked");
	var data={};
	data['folder_id']=fid;
	query=$.ajax({
		url: QFolder.controller_url+'/get_folder_path/'+fid+'/is_ajax',
		type:'POST',
		data: data});
	query.done(function (response, textStatus, jqXHRб){						
		folder_path=JSON.parse(response);
		html_folder_path='';
		for (i=folder_path.length-1;i>=1;i--){
			html_folder_path+='<li><a href="javascript:void(0)"  onclick="QFolder.open_folder(\''+folder_path[i]['folder_id']+'\',true,\'not_root\')">'+decodeURI(folder_path[i]['name'])+'</a></li>';
		}	
		html_folder_path+='<li>'+decodeURI(folder_path[0]['name'])+'</li>';
		if (folder_path.length!=1)	text_html=get_html_dropdown(folder_path[0], 'not_root');
		else text_html=get_html_dropdown(folder_path[0], view_folder);
		$('#list_parent_folder').html(html_folder_path);
		$('#group_btn_action').html(text_html);
		if (destroy_table) oTable.fnDestroy();
		generate_table(fid);
		$('div.dataTables_filter input').focus();
		get_min_width();
		$('#area_files').width($(window).width()-$('#folder_div').width());
	
	});
}