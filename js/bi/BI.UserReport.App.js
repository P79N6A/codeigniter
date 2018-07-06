BI.sequence_ur_step = [
					'data_set',
					'columns',
					//'format_col',
					'filters',
					'parameters',
					'style',
					'save',
				]
var columns_data_set
/*
 * функция получения посредствам ajax-запроса данных о колонках таблицы
 * Vadim GRITSENKO
 * 20150420
 */
BI.ajax_columns_data_set = function (id_data_set,callback){
	html = $.ajax({     
		url: BI.base_url+'index.php/bi/get_ajax_columns_data_set',
		type: "POST",
		data: {id_data_set:id_data_set,}
	}).done(function (response, textStatus, jqXHRб){
		try {
			result = JSON.parse(response);
			if (result.array_column.length>0){
				return_text = (building_select_multiple(result.array_column, 'list_table_column'));
			}
			else {
				return_text = ('Нет колонок')
			}
		}
		catch(err) {
			alert('Перезагрузитесь');
			return_text = ('Авторизуйтесь');
			result.array_column = []
		}
	
		callback(return_text, result.array_column); 
	});
}
//конец функции	

/*
 * функция получения посредствам ajax-запроса данных о стилях для таблицы
 * Vadim GRITSENKO
 * 20150420
 */
BI.ajax_styles = function (callback){
	html = $.ajax({     
		url: BI.base_url+'index.php/bi/get_ajax_styles',
		type: "POST",
	}).done(function (response, textStatus, jqXHRб){
		try {
			result = JSON.parse(response);
			if (result.array_styles.length>0){
				BI.list_styles = result.array_styles;
				return_text = (building_select_multiple_1(result.array_styles, 'list_styles'));
			}
			else {
				return_text = ('Нет стилей')
			}
		}
		catch(err) {
			alert('Перезагрузитесь');
			return_text = ('Авторизуйтесь');
		}
		callback(return_text); 
	});
}
//конец функции	

/*
 * функция построение для вывода на экран полученных колонок
 * Vadim GRITSENKO
 * 20150420
 */
building_select_multiple = function (array_column, id){

	html_text = '<select  class="form-control" multiple="multiple" id="'+id+'" size="10">';
	
	for (column in array_column){
		html_text += '<option value="'+array_column[column]+'"><div>'+array_column[column]+'</div></option>';
	}
	
	html_text += '</select>';

	return html_text;
}
//конец функции	

/*
 * функция построение для вывода на экран полученных колонок
 * Vadim GRITSENKO
 * 20150420
 */
building_select_multiple_1 = function (array_column, id, proper_option, proper_select){

	html_text = '<select  class="form-control" multiple="multiple" '+proper_select+' id="'+id+'" size="10">';
	
	for (column in array_column){
		html_text += '<option '+proper_option+' value="'+(array_column[column]['id']?array_column[column]['id']:array_column[column]['name'])+'"><div>'+array_column[column]['name']+'</div></option>';
	}
	
	html_text += '</select>';

	return html_text;
}
//конец функции

/*
 * функция загрузки диалогового окна
 * 20150316
 * Vadim GRITSENKO
 */
BI.set_new_user_report = function(){
	
	var dialog = CFUtil.dialog.create('util_window',
	{
		title: 'Новый пользовательский отчет', // переделать langs
		autoOpen: false,
		height: "auto",
		width: (800),
		modal: true,
		resizable:false
	});
	if (dialog){
		BI.load_content_user_report(BI.sequence_ur_step[0]);
	}
	
}
//конец функции	

/*
 * функция загрузки диалогового окна
 * 20150422
 * Vadim GRITSENKO
 */
BI.load_content_user_report = function (step){
	record_temp_data();
	if (continue_step == true) $('#util_window').html(eval('get_ur_content_step_'+step+'()'));
	temp_data_visualization();
}
//конец функции	

/*
 * функция получение содержимого для шага 1 (отчет)
 * 20150422
 * Vadim GRITSENKO
 */
get_ur_content_step_data_set = function (){
	text_html = 'Наименование<br>';
	text_html += '<input type="text" id="ur_name"/><br>';
	
	text_html += 'Название набора данных<br>';
	text_html += '<select id = "name_ds">';
	text_html += '<option></option>';
	for (position in BI.list_data_set){
		text_html += '<option value = "'+BI.list_data_set[position]['id']+'">'+BI.list_data_set[position]['name']+'</option>';
	}
	text_html += '</select><br>';	

	text_html += get_step_footer('data_set')

	return text_html;
}
//конец функции	

/*
 * функция получение содержимого для шага 3
 * 20150420
 * Vadim GRITSENKO
 */
get_ur_content_step_columns = function (){

	BI.ajax_columns_data_set(BI.temp_user_report.fk_data_set, function(return_text) {
		
		text_html = '<div id="">';
		text_html += '<div id="list_columns" width="100%">';
		
		text_html += '<table width="100%">';
			text_html += '<tr>';
			
				text_html += '<td rowspan="3" width="50%" style="vertical-align:top">Доступные колонки<br>';

					text_html += return_text;

				text_html += '</td>';

				text_html += '<td style="width:5%" >';
				
					text_html += '<button type="button" onclick="add_columns(\'list_show_column\')"><span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span></button><br>';
					text_html += '<button type="button" onclick="remove_columns(\'list_show_column\')"><span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span></button><br>';
					
					text_html += '<button type="button" onclick="move_up_column(\'list_show_column\')"><span class="glyphicon glyphicon-arrow-up" aria-hidden="true"></span></button><br>';
					text_html += '<button type="button" onclick="move_down_column(\'list_show_column\')"><span class="glyphicon glyphicon-arrow-down" aria-hidden="true"></span></button><br>';
					
				text_html += '</td>';

				text_html += '<td style="vertical-align:top">Вывести колонки:';

					text_html += building_select_multiple_1(JSON.parse(BI.temp_user_report.fields), 'list_show_column', 'view-column="show"');

				text_html += '</td>';
				text_html += '<td style="vertical-align:top; width:20%">Опции';
					text_html += set_options_columns('show');
				text_html += '</td>';

			text_html += '</tr>';


			text_html += '<tr>';


				text_html += '<td style="width:5%">';
				
					text_html += '<button type="button" onclick="add_columns(\'list_group_column\')"><span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span></button><br>';
					text_html += '<button type="button" onclick="remove_columns(\'list_group_column\')"><span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span></button><br>';
					
					text_html += '<button type="button" onclick="move_up_column(\'list_group_column\')"><span class="glyphicon glyphicon-arrow-up" aria-hidden="true"></span></button><br>';
					text_html += '<button type="button" onclick="move_down_column(\'list_group_column\')"><span class="glyphicon glyphicon-arrow-down" aria-hidden="true"></span></button><br>';

				text_html += '</td>';
				
				text_html += '<td style="vertical-align:top">Группировать:';
					text_html += building_select_multiple_1(JSON.parse(BI.temp_user_report.group), 'list_group_column', 'view-column="group"');
				text_html += '</td>';

				text_html += '<td style="vertical-align:top; width:20%">';
					text_html += '<div style="padding: 10px">Нет опций</div>';
				text_html += '</td>';
			
			text_html += '</tr>';


			
			text_html += '<tr>';

			
				text_html += '<td style="width:5%">';

					text_html += '<button type="button" onclick="add_columns(\'list_order_column\')"><span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span></button><br>';
					text_html += '<button type="button" onclick="remove_columns(\'list_order_column\')"><span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span></button><br>';
					
					text_html += '<button type="button" onclick="move_up_column(\'list_order_column\')"><span class="glyphicon glyphicon-arrow-up" aria-hidden="true"></span></button><br>';
					text_html += '<button type="button" onclick="move_down_column(\'list_order_column\')"><span class="glyphicon glyphicon-arrow-down" aria-hidden="true"></span></button><br>';

				text_html += '</td>';
				
				text_html += '<td style="vertical-align:top;">Сортировка';
					text_html += building_select_multiple_1(JSON.parse(BI.temp_user_report.order), 'list_order_column', 'view-column="order"');
					//text_html += '<select multiple="multiple" id="list_order_column" style="width:100%; height: 100%" size="10"></select>';
				text_html += '</td>';

				text_html += '<td style="vertical-align:top; width:20%">Опции';
					text_html += set_options_columns('order');
				text_html += '</td>';
				
			text_html += '</tr>';
		
		text_html += '</table>';
		text_html += '</div>';
		text_html += '</div>';

		text_html += get_step_footer('columns')

		$('#util_window').html(text_html);
		
		$('select option[view-column]').click(function(){
			fileds = ( $(this).attr('view-column') == 'show'? JSON.parse(BI.temp_user_report.fields):JSON.parse(BI.temp_user_report.order))
			reload_option($(this).attr('view-column'), fileds);
			record_option($(this).attr('view-column'));
		})
		$('select option[view = "option"]').click(function(){
			record_option($(this).attr('view-column'))
		})
	});
	return 'Ожидайте ответ...'
}
//конец функции	

/*
 * функция получение содержимого для шага 4
 * 20150420
 * Vadim GRITSENKO
 */
get_ur_content_step_format_col = function (){
	
		text_html = '<div id="">';
		text_html += '<div id="list_columns" width="100%">';
		
		text_html += '<table width="100%">';
			text_html += '<tr>';
			
				text_html += '<td style="vertical-align:top">Источник поля:';

					text_html += building_select_multiple_1(JSON.parse(BI.temp_user_report.fields), 'list_source_column');

				text_html += '</td>';

				text_html += '<td rowspan="2" width="50%" style="vertical-align:top">Имя поля<br>';

					text_html += building_select_multiple_1(JSON.parse(BI.temp_user_report.fields), 'list_column_name');

				text_html += '</td>';

			text_html += '</tr>';

		text_html += '</table>';
		text_html += '</div>';
		text_html += '</div>';

	text_html += get_step_footer('format_col');

	return text_html;
}
//конец функции	

/*
 * функция получение содержимого для шага 4
 * 20150420
 * Vadim GRITSENKO
 */
get_ur_content_step_save = function (){
	
	text_html = '<div class="well" style="width:50%;margin-left: auto;margin-right: auto;"><a href="javascript::void" onclick="BI.save_user_report()" target="_blank" class="btn btn-info btn-lg btn-block" style="font-size:15px;padding-top:0px "><span class="glyphicon glyphicon-th"></span>&nbsp;' + 'Сохранить отчет' + '</a></div>'

	text_html += get_step_footer('save');

	return text_html;
}
//конец функции	

/*
 * функция получение содержимого для формирования фильтра
 * 20150506
 * Vadim GRITSENKO
 */
get_ur_content_step_filters = function (){

	BI.ajax_columns_data_set(BI.temp_user_report.fk_data_set, function(return_text, array_columns) {
		
		columns_data_set = array_columns;
		
		text_html = '<div class="panel panel-success" id="area_condition" style="margin-bottom:0px;">';
			text_html += '<div class="panel-heading">';
			text_html += '<h3 class="panel-title" style="width:100%">'
			
			text_html += '<button type="button" class="btn btn-default btn-success" onclick="add_condition()"><span class="glyphicon glyphicon-plus" style="color:green"></span>&nbsp;' + 'Добавить условие' + '</button>';

			text_html += '</h3>';
			text_html += '</div>';
		
		text_html += '<div class="panel-body" id="condition_body">';
			text_html += '<div class="span_filters" id="span_filters" style="margin-left:0px">';

			text_html += '</div>';
		text_html += '</div>';
		text_html += '</div>';

		text_html += get_step_footer('filters');

		$('#util_window').html(text_html);
		
		console.log(BI.temp_user_report.filters);
		filters = JSON.parse(BI.temp_user_report.filters);
		for (i = 0; i < filters.length; i++){
			add_condition();
			$('.span_filters').children('.span_filter:last').children('.text_filter').children('#name_field').val(filters[i]['field']);
			$('.span_filters').children('.span_filter:last').children('.text_filter').children('#condition').val(filters[i]['condition']);
			$('.span_filters').children('.span_filter:last').children('.text_filter').children('#value_condition').val(filters[i]['value']);
			$('.span_filters').children('.span_filter:last').children('.text_filter').children('#link_condition').val(filters[i]['link']);
		}
	})
	return 'Ожидайте ответа';
}
//конец функции	

/*
 * функция получение содержимого для шага пользовательские параметры
 * 20150505
 * Vadim GRITSENKO
 */
get_ur_content_step_parameters = function (){
	
	BI.ajax_columns_data_set(BI.temp_user_report.fk_data_set, function(return_text, array_columns) {
		
		columns_data_set = array_columns;
		
		text_html = '<div class="panel panel-warning" id="area_condition" style="margin-bottom:0px;">';
			text_html += '<div class="panel-heading">';
			text_html += '<h3 class="panel-title" style="width:100%">'
			
			text_html += '<button type="button" class="btn btn-default btn-success" onclick="add_parameters()"><span class="glyphicon glyphicon-plus" style="color:green"></span>&nbsp;' + 'Добавить параметр' + '</button>';

			text_html += '</h3>';
			text_html += '</div>';
		
		text_html += '<div class="panel-body" id="condition_body">';
			text_html += '<div class="span_params" id="span_params" style="margin-left:0px">';

			text_html += '</div>';
		text_html += '</div>';
		text_html += '</div>';

		text_html += get_step_footer('parameters');

		$('#util_window').html(text_html);
		
		//console.log(BI.temp_user_report.parameters);
		parameters = JSON.parse(BI.temp_user_report.parameters);
		for (i = 0; i < parameters.length; i++){
			add_parameters();
			$('.span_params').children('.span_filter:last').children('.text_filter').children('#name_params').val(parameters[i]['name']);
			$('.span_params').children('.span_filter:last').children('.text_filter').children('#name_field').val(parameters[i]['field']);
			$('.span_params').children('.span_filter:last').children('.text_filter').children('#condition').val(parameters[i]['condition']);
			$('.span_params').children('.span_filter:last').children('.text_filter').children('#default_value').val(parameters[i]['default_value']);
			$('.span_params').children('.span_filter:last').children('.text_filter').children('#link_condition').val(parameters[i]['link']);
		}
	})
	return 'Ожидайте ответа';
	
}
//конец функции	

/*
 * функция получение содержимого для шага 4
 * 20150420
 * Vadim GRITSENKO
 */
get_ur_content_step_style = function (){

	BI.ajax_styles(function(return_text) {

		text_html = '<div id="">';
		text_html += '<div id="list_columns" width="100%">';
		
		text_html += '<table width="100%">';
			text_html += '<tr>';
			
				text_html += '<td rowspan="2" width="50%" style="vertical-align:top">Доступные стили<br>';
					text_html += return_text;
				text_html += '</td>';

				text_html += '<td style="vertical-align:top" width="50%">Демонтрация стиля:';
					text_html += '<div id="list_show_style" style="border: 4px solid black; width:100%; height: 150px; padding: 10px; overflow: scroll" size="10"></div>';
				text_html += '</td>';

			text_html += '</tr>';

		text_html += '</table>';
		text_html += '</div>';
		text_html += '</div>';

		text_html += get_step_footer('style');

		$('#util_window').html(text_html);
		$('#list_styles option[value="'+BI.temp_user_report.fk_style+'"]').attr('selected','true');
		show_style();
		$('#list_styles option').on('click', show_style);
		
	});
	return 'Ожидайте ответ...'
}
//конец функции	

/*
 * функция опроса элемента select multiple
 * 20150420
 * Vadim GRITSENKO
 */
get_value_multiple_selector = function (selector, old_array, option){
	array_columns = []
	$('#'+selector).children('option').each(function (){
		array_columns [$(this).index()] = {};
		array_columns [$(this).index()]['name'] = $(this).val();
		try{
			if(temp_option[option][$(this).val()]) array_columns [$(this).index()]['option'] = temp_option[option][$(this).val()];
			else if (old_array[$(this).index()]['option']) array_columns [$(this).index()]['option'] = old_array[$(this).index()]['option'];
		}
		catch(err){}
	})
	return JSON.stringify(array_columns);
}
//конец функции	

/*
 * функция сохранения пользовательского отчета
 * 20150422
 * Vadim GRITSENKO
 */
BI.save_user_report = function (){
	html = $.ajax({     
		url: BI.base_url+'index.php/bi/save_user_report',
		type: "POST",
		data: {id:BI.id_user_report,data:BI.temp_user_report,}
	}).done(function (response, textStatus, jqXHRб){
		result = JSON.parse(response);
		if (result.result == 1){
			location.reload();
		}
		else {
			alert('Не удалось сохранить');
		}
	});	
}
//конец функции	

/*
 * функция сохранения пользовательского отчета
 * 20150422
 * Vadim GRITSENKO
 */
BI.edit_user_report = function (position){

	BI.temp_user_report.name = BI.list_user_report[position].name;
	BI.temp_user_report.fk_data_set = BI.list_user_report[position].fk_data_set;
	BI.temp_user_report.fields = (BI.list_user_report[position].fields != null ? BI.list_user_report[position].fields : '[]');
	BI.temp_user_report.order = (BI.list_user_report[position].order != null ? BI.list_user_report[position].order : '[]');
	BI.temp_user_report.fk_style = BI.list_user_report[position].fk_style;
	BI.temp_user_report.group = (BI.list_user_report[position].group != null ? BI.list_user_report[position].group : '[]');
	BI.temp_user_report.field_config = (BI.list_user_report[position].field_config != null ? BI.list_user_report[position].field_config : '[]');
	BI.temp_user_report.filters = (BI.list_user_report[position].filters != null ? BI.list_user_report[position].filters : '[]');
	BI.temp_user_report.parameters = (BI.list_user_report[position].parameters != null ? BI.list_user_report[position].parameters : '[]');
	
	BI.id_user_report = BI.list_user_report[position].id;
	
	BI.set_new_user_report();
	BI.load_content_user_report('data_set');
}
//конец функции	

/*
 * функция сохранения пользовательского отчета
 * 20150422
 * Vadim GRITSENKO
 */
BI.load_user_report = function (position){
	window_waiting();
	html = $.ajax({     
		url: BI.base_url+'index.php/bi/get_result_user_report',
		type: "POST",
		data: {id_user_report:BI.list_user_report[position].id,params:'[]'}
	}).done(function (response, textStatus, jqXHRб){
		console.log(response);
		try {
			window_waiting();
			result = JSON.parse(response);
			result.data_column = JSON.parse(BI.list_user_report[position].field_config);
			if (result.check_sql_ur != ''){
				alert(result.check_sql_ur);
			}
			else if (result.result_report.length>0){
				$('#table_columns').html(building_params_div(JSON.parse(BI.list_user_report[position].parameters), position)+'<div id="div_sample_data">'+building_report_data(result, JSON.parse(BI.list_user_report[position].style_config), JSON.parse(BI.list_user_report[position].fields))+'</div>');
				$('th').resizable({});
				$( "table" ).draggable({cursor: "crosshair"});
			}
			else {
				alert('Результат пустой');
			}
		}
		catch(err) {
			output_message(response, 'alert-danger');
		}	
	});	
}
//конец функции	

/*
 * функция сохранения пользовательского отчета
 * 20150422
 * Vadim GRITSENKO
 */
BI.refresh_user_report = function (position){
	new_parameters = {}
	$('.param').each(function (){
		new_parameters[$(this).children('#new_param').attr('field')] = $(this).children('#new_param').val()
	})
	window_waiting()
	
	html = $.ajax({     
		url: BI.base_url+'index.php/bi/get_result_user_report',
		type: "POST",
		data: {id_user_report:BI.list_user_report[position].id,params:JSON.stringify(new_parameters)}
	}).done(function (response, textStatus, jqXHRб){
		//console.log(response);
		try {
			window_waiting();
			result = JSON.parse(response);
			result.data_column = JSON.parse(BI.list_user_report[position].field_config);
			//console.log(result);
			if (result.check_sql_ur != ''){
				alert(result.check_sql_ur);
			}
			else if (result.result_report.length>0){
				$('#div_sample_data').html(building_report_data(result, JSON.parse(BI.list_user_report[position].style_config), JSON.parse(BI.list_user_report[position].fields)));
				$('th').resizable({});
				$( "table" ).draggable({cursor: "crosshair"});
				alert('Обновлено');
			}
			else {
				$('#div_sample_data').html('');
				alert('Результат пустой');
			}
		}
		catch(err) {
			output_message(response, 'alert-danger');
		}	
	});	
}
//конец функции

/*
 * функция вывода div-а загрузки
 * Vadim GRITSENKO
 * 20150508
 */
window_waiting = function (){
	if ($('#div_waiting').length == 0){
		$('body').append('<div id="div_waiting"><div style = "z-index:999998; position:absolute; background-color:#fff; opacity:0.5; left:0px; top:0px; width:'+($(window).width())+'px;height:'+($(window).height())+'px;"></div><div style="z-index:999999;position:absolute;background-color:#fff;left:'+($('body').width()/2)+'px;top:'+($('body').height()/2)+'px;padding:10px">Подождите загружается</div></div>');
	}
	else {
		$('#div_waiting').remove();
	}
}

/*
 * функция получения html - кода области параметров
 * Vadim GRITSENKO
 * 20150508
 */
building_params_div = function (parameters, position){
	if (parameters == null) parameters = []
	html_text = '';
	
	if (parameters.length > 0){
		html_text += '<div id="div_parameters">';
		for (numb_param in parameters){
			html_text += '<div class="param"><label>'+parameters[numb_param]['name']+'</label><input type="text" id="new_param" field="'+parameters[numb_param]['field']+'" value="'+parameters[numb_param]['default_value']+'"/></div>';
		}
		html_text += '<button type="button" onclick="BI.refresh_user_report(' + position + ')">Обновить</button></div>';
	}
	return html_text
}
//конец функции	

/*
 * функция получения html - кода области данных
 * Vadim GRITSENKO
 * 20150420
 */
building_report_data = function (array_data, style, fields){
	if (style == null) style = []
	
	html_text = '<table class="table table-bordered">';
	
	html_text += '<tr>';
	array_data_column = array_data.result_report;
	array_name_column = array_data.data_column;
	for (key in fields){
		name_column = fields[key]['name'];

		if (array_name_column[name_column] && array_name_column[name_column]['display_text']) name_column = array_name_column[name_column]['display_text'];

		html_text += '<th title="' + fields[key]['name'] + '" style="' + (style["th"] ? style["th"] : '') + '">' + name_column + '</th>';
	}
	html_text += '</tr>';
	
	for (row in array_data_column){
		html_text += '<tr>';
		for (col in fields){
			html_text += '<td  style="'+(style["td"] ? style["td"] : '')+'">'+(array_data_column[row][fields[col]['name']] != null?array_data_column[row][fields[col]['name']]:' - ')+'</td>';
		}			
		html_text += '</tr>';
	}
	
	html_text += '</table>';
	return html_text;
}
//конец функции	

/*
 * функция наименование функций для кнопок шага
 * Vadim GRITSENKO
 * 20150420
 */
get_step_footer = function (current_step){
	
	if (BI.id_user_report != null){
		text_html = '<nav><ul class="pagination ">';
		for (numb in BI.sequence_ur_step){
			text_html += '<li class="' + ( BI.sequence_ur_step[numb] == current_step ? 'active' : '' ) + '" style="cursor:pointer"><a href="#" onclick="BI.load_content_user_report(\''+BI.sequence_ur_step[parseInt(numb)]+'\')">' + (parseInt(numb)+1) + '</a></li>';
		}
		text_html += '</ul></nav>';
		return text_html;	
	}
	else {
		for (numb in BI.sequence_ur_step){

			if (BI.sequence_ur_step[numb] == current_step) {
				text_html = '<br><div id="footer_btn">'
				
				if (BI.sequence_ur_step[parseInt(numb)-1]){
					text_html += '<button type="button" class="btn btn-primary" id="back" onclick="BI.load_content_user_report(\''+BI.sequence_ur_step[parseInt(numb)-1]+'\')">' + 'Назад' + '</button>';
				}
				if (BI.sequence_ur_step[parseInt(numb)+1]){
					text_html += '<button type="button" class="btn btn-primary" id="back" onclick="BI.load_content_user_report(\''+BI.sequence_ur_step[parseInt(numb)+1]+'\')">' + 'Далее' + '</button>';
				}
				
				text_html += '</div>'
				
				return text_html
			}
			
		}
	}
}
//конец функции	

/*
 * функция демонстрации стиля
 * Vadim GRITSENKO
 * 20150505
 */
show_style = function (){
	
	for (position in BI.list_styles){
		if ($('#list_styles option:selected:last').val() == BI.list_styles[position]['id']) {
			current_style = JSON.parse(BI.list_styles[position]['configuration']);
			break;
		}
	}

	html_head = ''; html_value = '';
	fields = JSON.parse(BI.temp_user_report.fields);
	field_config = JSON.parse(BI.temp_user_report.field_config);
	for (field in fields){
		html_head += '<th style="' + (current_style["th"] ? current_style["th"] : '') + '" contenteditable="true">' + (field_config[fields[field]['name']] ? field_config[fields[field]['name']]['display_text'] : fields[field]['name']) + '</th>';
		html_value += '<td style="' + (current_style["td"] ? current_style["td"] : '') + '">' + '{' + fields[field]['name'] + '}' + '</th>'
	}

	html_text = '<table class = "table table-bordered table_example"><tr>' + html_head + '</tr><tr>' + html_value + '</tr></table>';
	$('#list_show_style').css('width', $('#list_show_style').parent().width()).html(html_text);

}
//конец функции

/*
 * функция добавление строки фильтра
 * Vadim GRITSENKO
 * 20150507
 */
add_condition = function (){
	$('#span_filters').append(get_string_condition());
}
//конец функции

/*
 * функция добавления строки параметров
 * Vadim GRITSENKO
 * 20150507
 */
add_parameters = function (){
	$('#span_params').append(get_string_params());
}
//конец функции

/*
 * функция загрузки опций
 * Vadim GRITSENKO
 * 20150513
 */
set_options_columns = function (view_columns){
	temp_option
	
	html_text = '<select  class="form-control" multiple="multiple" id="options_'+view_columns+'" size="10">';
	html_text += '<option view = "option" value="">Нет опции</option>';
	
	array_option = BI.options_columns[view_columns];
	for (option in array_option){
		html_text += '<option view = "option" value="'+option+'"><div>'+array_option[option][1]+'</div></option>';
	}
	
	html_text += '</select>';

	return html_text;
	//$('#td_options').html('Опции' + html_text);
}
//конец функции

/*
 * функция записи опции
 * Vadim GRITSENKO
 * 20150513
 */
var temp_option = {'order':{}, 'show':{}}
record_option = function (view_columns){
	try {
		temp_option['show'][$('#list_show_column').val()[0]] = $('#options_show').val()[0]
		if ($('#options_show').val()[0] == "") delete temp_option['show'][$('#list_show_column').val()[0]];
	}catch(err){}
	try {
		temp_option['order'][$('#list_order_column').val()[0]] = $('#options_order').val()[0]
		if ($('#options_order').val()[0] == "") delete temp_option['order'][$('#list_order_column').val()[0]];
	}catch(err){}
}
//конец функции

/*
 * функция записи опции
 * Vadim GRITSENKO
 * 20150513
 */
reload_option = function (view_columns, fields){
	try{
		$('#options_'+view_columns).val(fields[$('#list_'+view_columns+'_column option:selected').index()].option)
	}
	catch(err){}
}
//конец функции