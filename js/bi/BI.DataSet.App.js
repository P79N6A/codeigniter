
/*
 * функция загрузки диалогового окна
 * 20150316
 * Vadim GRITSENKO
 */
BI.set_new_config_db = function(){
	
	var dialog = CFUtil.dialog.create('util_window',
	{
		title: 'Конфигурация БД', // переделать langs
		autoOpen: false,
		height: "auto",
		width: (700),
		modal: true,
		resizable:false
	});
	if (dialog){
		BI.load_content_data_set(1);
		//$(dialog).html(text_html)
	}
	
}
//конец функции	

/*
 * функция записи временных данных в глобальную переменную
 * 20150420
 * Vadim GRITSENKO
 */
continue_step = true; // флаг на продолжение выполнения последовательности
record_temp_data = function(){

	//опрос объектов визуализации для заполнения временной переменной для набора данных (data set)
	if ($('#table_name').val() && $('#table_name').val() != ''){
		BI.choose_name_table = $('#table_name').val();
	}
	if ($('#name').val()){
		BI.temp_data_set.name = $('#name').val();
	}
	if ($('#view_sql').val() == 'sql'){
		BI.temp_data_set.sql_text = $('#area_sql').val();
		BI.temp_data_set.name = $('#name').val();
	}

	//опрос объектов визуализации для заполнения временной переменной для отчета (user report)
	if ($('#name_ds').val()){
		BI.temp_user_report.fk_data_set = $('#name_ds').val();
	}
	if ($('#ur_name').val()){
		BI.temp_user_report.name = $('#ur_name').val();
	}
	if ($('#list_show_column').length > 0){
		BI.temp_user_report.fields = get_value_multiple_selector('list_show_column', JSON.parse(BI.temp_user_report.fields), 'show');
		if (BI.temp_user_report.fields == '[]') {
			alert('Нет колонок, которые нужно показать');
			continue_step = false;
			return;
		}
		continue_step = true;
	}
	if ($('#list_order_column').length > 0){
		BI.temp_user_report.order = get_value_multiple_selector('list_order_column', JSON.parse(BI.temp_user_report.order), 'order');
	}
	if ($('#list_group_column').length > 0){
		BI.temp_user_report.group = get_value_multiple_selector('list_group_column', JSON.parse(BI.temp_user_report.group));
	}	
	if ($('#list_styles option:selected').length > 0){
		BI.temp_user_report.fk_style = ($('#list_styles option:selected:last').val());
	}
	if ($('#list_show_style').length == 1){
		field_config = {};
		$('#list_show_style table th').each(function (){
			field_config[fields[$(this).index()]['name']] = {'display_text':$(this).html()};
		})
		BI.temp_user_report.field_config = JSON.stringify(field_config);
	}
	if ($('#span_filters').length > 0){
		filters = [];
		$('#span_filters span.text_filter').each(function (){
			if ($(this).children('.text_filter').children('#name_field').val() != ''){
				filters[filters.length] = {
						'field':$(this).children('#name_field').val(),
						'condition':$(this).children('#condition').val(),
						'value':$(this).children('#value_condition').val(),
						'link':$(this).children('#link_condition').val(),
					};
			}
		})
		BI.temp_user_report.filters = JSON.stringify(filters);
	}
	if ($('#span_params').length > 0){
		parameters = [];
		$('#span_params span.text_filter').each(function (){
			if ($(this).children('.text_filter').children('#name_field').val() != ''){
				parameters[parameters.length] = {
						'name':$(this).children('#name_params').val(),
						'field':$(this).children('#name_field').val(),
						'condition':$(this).children('#condition').val(),
						'default_value':$(this).children('#default_value').val(),
						'link':$(this).children('#link_condition').val(),
					};
			}
		})
		BI.temp_user_report.parameters = JSON.stringify(parameters);
	}

}
//конец функции	

/*
 * функция записи временных данных в объекты визуализаци
 * 20150420
 * Vadim GRITSENKO
 */
temp_data_visualization = function(){
	$('#table_name').val(BI.choose_name_table);
	$('#name').val(BI.temp_data_set.name);
	$('#ur_name').val(BI.temp_user_report.name);
	$('#name_ds').val(BI.temp_user_report.fk_data_set);
	if (BI.temp_data_set.sql_text != null){
		$('#view_sql').val('sql');
		$('#area_sql').val(BI.temp_data_set.sql_text).removeAttr('disabled');
	}
/*
	if (BI.temp_user_report.fields != null && $('#list_show_column').length>0){
		for (field in BI.temp_user_report.fields){
			$('#list_table_column option[value="'+BI.temp_user_report.fields[field]['name']+'"]').attr('checkned','true')
		}
		//add_columns('list_show_column');
	}
	if (BI.temp_user_report.order != null && $('#list_order_column').length>0){
		for (field in BI.temp_user_report.order){
			$('#list_order_column option[value="'+BI.temp_user_report.order[field]['name']+'"]').attr('checkned','true')
		}
		//add_columns('list_show_column');
	}
*/
}
//конец функции	

/*
 * функция загрузки содержимого в диалоговое окно
 * 20150420
 * Vadim GRITSENKO
 */
BI.load_content_data_set = function (step){
	record_temp_data()
	if ($('#view_sql').val() == 'sql' && parseInt(step) != 1){
		BI.save_data_set();
	}
	else {
		$('#util_window').html(eval('get_ds_content_step_'+step+'()'));
	}
	temp_data_visualization()
}
//конец функции	


/*
 * функция получение содержимого для шага 1
 * 20150420
 * Vadim GRITSENKO
 */
get_ds_content_step_1 = function (){
	text_html = 'Наименование<br>';
	text_html += '<input type="text" id="name"/><br>';

	text_html += 'Вид формирования подготовки данных<br>';
	text_html += '<select id="view_sql" onchange="($(\'#view_sql\').val()!=\'sql\' ? $(\'#area_sql\').attr(\'disabled\',\'true\') : $(\'#area_sql\').removeAttr(\'disabled\'))">';
		text_html += '<option value="standart">'+'Составной'+'</option>';
		text_html += '<option value="sql">'+'Сложный запрос'+'</option>';
	text_html += '<select><br>';

	text_html += 'SQL-запрос<br>';
	text_html += '<textarea id="area_sql" style="width:100%;height:200px;" class="form-control" rows="3" disabled></textarea><br>';//onchange = 	
	text_html += '<button type="button" class="btn btn-primary" id="next" onclick="BI.load_content_data_set(3)">'+'Далее'+'</button>';//поменять на BI.load_content_data_set(2)

	return text_html;
}
//конец функции	

/*
 * функция получение содержимого для шага 2
 * 20150420
 * Vadim GRITSENKO
 */
get_ds_content_step_2 = function (){

	text_html = '<select id = "table_name">';
	text_html += '<option></option>';
	for (table in BI.list_data_table_db){
		text_html += '<option value = "'+table+'">'+table+'</option>';
	}
	text_html += '</select><br>';
	
	text_html += '<button type="button" class="btn btn-primary" id="back" onclick="BI.load_content_data_set(1)">'+'Назад'+'</button>';
	text_html += '<button type="button" class="btn btn-primary" id="next" onclick="BI.load_content_data_set(2)">'+'Далее'+'</button>';
	return text_html;
}
//конец функции	



/*
 * функция получение содержимого для шага 4
 * 20150420
 * Vadim GRITSENKO
 */
get_ds_content_step_4 = function (){
	
	text_html = '<div class="well" style="width:50%;margin-left: auto;margin-right: auto;"><a href="javascript::void" onclick="alert(1)" target="_blank" class="btn btn-info btn-lg btn-block" style="font-size:15px;padding-top:0px "><span class="glyphicon glyphicon-th"></span>&nbsp;Сорханить в БД</a></div>'
	
	text_html += '<button type="button" class="btn btn-primary" id="back" onclick="BI.load_content_data_set(3)">'+'Назад'+'</button>';
	return text_html;
}
//конец функции	



/*
 * функция получение содержимого для шага 3
 * 20150420
 * Vadim GRITSENKO
 */
get_ds_content_step_3 = function (){

	BI.ajax_columns(BI.choose_name_table, function(return_text) {
		
		text_html = '<div id="">';
		text_html += '<div id="list_columns" width="100%">';
		
		text_html += '<table width="100%">';
			text_html += '<tr>';
			
				text_html += '<td rowspan="2" width="50%" style="vertical-align:top">Доступные колонки<br>';
					text_html += return_text;
				text_html += '</td>';

				text_html += '<td style="width:5%" >';
					text_html += '<button type="button" onclick="add_columns(\'list_show_column\')"><span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span></button><br>';
					text_html += '<button type="button" onclick="remove_columns(\'list_show_column\')"><span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span></button><br>';
				text_html += '</td>';

				text_html += '<td style="vertical-align:top">Вывести колонки:';
					text_html += '<select multiple="multiple" id="list_show_column" style="width:100%; height: 100%" size="10"></select>';
				text_html += '</td>';

			text_html += '</tr>';

			text_html += '<tr>';

				text_html += '<td style="width:5%">';
					text_html += '<button type="button" onclick="add_columns(\'list_group_column\')"><span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span></button><br>';
					text_html += '<button type="button" onclick="remove_columns(\'list_group_column\')"><span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span></button><br>';
				text_html += '</td>';
				
				text_html += '<td style="vertical-align:top">Группировать колонки:';
					text_html += '<select multiple="multiple" id="list_group_column" style="width:100%; height: 100%" size="10"></select>';
				text_html += '</td>';
			
			text_html += '</tr>';
		
		text_html += '</table>';
		text_html += '</div>';
		text_html += '</div>';
		
		text_html += '<button type="button" class="btn btn-primary" id="back" onclick="BI.load_content_data_set(1)">'+'Назад'+'</button>';
		text_html += '<button type="button" class="btn btn-primary" id="next" onclick="BI.load_content_data_set(4)">'+'Далее'+'</button>';

		$('#util_window').html(text_html);
		
	});
	return 'Ожидайте ответ...'
}
//конец функции	

add_columns = function (selector){
	$('#list_table_column').children('option:selected').each(function (){
		if ($('#'+selector+' option[value="'+$(this).val()+'"]').length == 0){
			$('#'+selector).append('<option ondblclick="remove_columns(\''+selector+'\')" value="'+$(this).val()+'">'+$(this).html()+'</option>');
		}
	})
}

remove_columns = function (selector){
	$('#'+selector).children('option:selected').each(function (){
		$(this).remove();
	})
}

move_up_column = function (selector){
	$('#'+selector).children('option:selected').each(function (){
		iIndex = $(this).index();
		var oListbox = document.getElementById(selector);
		if (iIndex>0){
			var oListbox = document.getElementById(selector);
			var oOption = oListbox.options[iIndex];
			var oPrevOption = oListbox.options[iIndex-1];
			oListbox.insertBefore(oOption, oPrevOption);
		}
	})
}

move_down_column = function (selector){
	$('#'+selector).children('option:selected').reverseEach(function (){
		iIndex = $(this).index();
		var oListbox = document.getElementById(selector);
		if (iIndex < oListbox.options.length - 1){
			var oOption = oListbox.options[iIndex];
			var oNextOption = oListbox.options[iIndex+1];
			oListbox.insertBefore(oNextOption, oOption);
		}
	})
}	

//функция перебора дочрених элементов в обратном порядке
jQuery.fn.reverseEach = (function () {
	var list = jQuery([1]);
	return function (c) {
		var el, i=this.length;
		try {
			while (i-->0 && (el=list[0]=this[i]) && c.call(list,i,el)!==false);
		}
		catch(e) {
			delete list[0];
			throw e;
		}
		delete list[0];
		return this;
	};
}());

/*
 * функция сохранения конфигурации таблицы
 * 20150420
 * Vadim GRITSENKO
 */
BI.save_data_set = function (){
	BI.check_sql(function (valid_query){
		if (valid_query === true && BI.temp_data_set.name != ''){
			html = $.ajax({     
				url: BI.base_url+'index.php/bi/save_data_set',
				type: "POST",
				data: {data:BI.temp_data_set,id:BI.id_data_set,}
			}).done(function (response, textStatus, jqXHRб){
				result = JSON.parse(response);
				console.log(result);
				( parseInt(result.result) == 1 ? location.reload(): alert('Не удалось сохранить') );
			});
		}
		else if (BI.temp_data_set.name == ''){
			alert('Наименование не определено');
		}
		else if (valid_query) {
			alert('Запрос составлен неверно.'+valid_query);
		}
	})
}
// конец функции

/*
 * функция проверки на ошибки SQL-запроса
 * 20150420
 * Vadim GRITSENKO
 */
BI.check_sql = function (callback){
	html = $.ajax({     
		url: BI.base_url+'index.php/bi/check_sql',
		type: "POST",
		data: {sql:BI.temp_data_set.sql_text,id: BI.id_data_set,}
	}).done(function (response, textStatus, jqXHRб){
		result = JSON.parse(response);
		if (result.result != ''){
			callback(result.result);
		}
		else {
			callback(true);
		}
	});
}
// конец функции

/*
 * функция проверки на ошибки SQL-запроса
 * 20150420
 * Vadim GRITSENKO
 */
BI.edit_data_set = function (position){
	
	BI.temp_data_set.name = BI.list_data_set[position].name
	BI.temp_data_set.sql_text = BI.list_data_set[position].sql_text
	BI.id_data_set = BI.list_data_set[position].id
	
	BI.set_new_config_db()
	BI.load_content_data_set(1)

}
// конец функции