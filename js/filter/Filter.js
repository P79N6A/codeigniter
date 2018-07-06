
var Filter = {
	'columns':{},
	'config_data_table':{
			'EQ' : {'id':'EQ','name':'равно','input_value':'one'}, // =
			'GT' : {'id':'GT','name':'больше','input_value':'one'}, // >
			'GTE' : {'id':'GTE','name':'больше либо равно','input_value':'one'}, // >=
			'LTE' : {'id':'LTE','name':'меньше либо равно','input_value':'one'}, // <=
			'LT' : {'id':'LT','name':'меньше','input_value':'one'}, // <
			'NEQ' : {'id':'NEQ','name':'не равно','input_value':'one'}, // <>
			'LIKE' : {'id':'LIKE','name':'похоже','input_value':'one'}, // LIKE
			'NOTLIKE' : {'id':'NOTLIKE','name':'не похоже','input_value':'one'}, // NOT LIKE
			'ISN' : {'id':'ISN','name':'пустой','input_value':'none'}, // IS NULL
			'ISNN' : {'id':'ISNN','name':'непустой','input_value':'none'}, // IS NOT NULL
			'BTN' : {'id':'BTN','name':'между','input_value':'double'}, // IS NOT NULL
		},
	'default_operators': Array("=", "<", "<=", ">", ">=", "<>", "LIKE", "NOT LIKE"),
	'link': {
			'AND': {'id':'AND','name':'И'},
			'OR': {'id':'OR','name':'ИЛИ'},
		},//Array("OR","AND"),
	'select_columns': null,
	'select_link': null,
	'select_conditions': null,
	'callback': null,
	'content': '<div class="btn-group btn-group-xs"><button class="btn btn-info btn-xs" onclick="Filter.add_filter()"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span> Добавить условие</button><button class="btn btn-success btn-xs" onclick="Filter.callback.call()"><span class="glyphicon glyphicon-search" aria-hidden="true"></span> Применить</button></button></div><div id="div_list_filters"></div><button class="btn btn-danger btn-xs pull-right hide" id="btn_clear" onclick="$(\'.filter\').remove();update_btn_clear()"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span> Очистить</button>',
	'json_object': '[]',
	
	'button_save': false, //показать кнопку сохранения фильтра
	'panel_btn_control':{
		'btn_data_filter':{
				'class':'btn btn-default',
				'add_propeties':' title="Показать фильтр" ',
				'text':'Фильтр',
				'id':'btn_window_filter',
				'id_div':'div_btn_filter',
			},

		'btn_save_filter':{
				'class':'btn btn-success',
				'add_propeties':' title="Сохранить фильтр"',
				'onlick':'alert("Задайте функцию для сохранения фильтров")',
				'text':'Сохранить',
				'id':'btn_save_filter',
			},
		'class_group': 'btn-group btn-group-xs pull-right',
		'properties_group': 'role="group" aria-label="..."',
		
	},
	
	'default_parameters_dialog' : {
			'autoOpen': false,
			'height': "auto",
			'position': "top",
			'width': "600",
			'maxHeight': "500",
			'modal': false
		}
}

/*
 * функция формирования окна фильтров
 * 20150702
 * Vadim GRITSENKO
 */
Filter.add_column = function (array_columns){
	for (numb_column in array_columns){
		Filter.columns[numb_column] = array_columns[numb_column]
	}
	Filter.generate_select_fields();
}
//конец функции

/*
 * функция инициализации объекта фильтр
 * 20150702
 * Vadim GRITSENKO
 */
Filter.initialization = function (){
	Filter.check_plugins();
	Filter.set_panel_button();
	Filter.set_class_btn();
	Filter.generate_select_fields();
	Filter.generate_select_link();
	Filter.generate_select_conditions();
}
//конец функции

/*
 * загрузки классов для управляющих кнопок
 * 20150714
 * Vadim GRITSENKO
 */
Filter.set_class_btn = function (){
	if (Filter.json_object != '[]') {
		$('#btn_window_filter').addClass('btn-warning');
	}
	else {
		$('#btn_save_filter').addClass('disabled');
	}
}
//конец функции

/*
 * проверка на подключение jquery-ui
 * 20150713
 * Vadim GRITSENKO
 */
Filter.check_plugins = function (){
	if (!(typeof jQuery == "function" && ('ui' in jQuery) && jQuery.ui && ('version' in jQuery.ui)))
	{
		alert('Поключите библиотеку JQuery UI');
	}
}
//конец функции

/*
 * функция загрузка панели управляющих кнопок
 * 20150713
 * Vadim GRITSENKO
 */
Filter.set_panel_button = function (){
	panel_btn_control = Filter.panel_btn_control;
	var html_panel = '<button type="button" id="'+panel_btn_control.btn_data_filter['id']+'" '+panel_btn_control.btn_data_filter['add_propeties']+' class="'+panel_btn_control.btn_data_filter['class']+'">'+panel_btn_control.btn_data_filter['text']+'</button>';
	html_panel += (this.button_save == true? '<button type="button" class="'+panel_btn_control.btn_save_filter['class']+'" '+panel_btn_control.btn_save_filter['add_propeties']+' id="'+panel_btn_control.btn_save_filter['id']+'" onclick="'+panel_btn_control.btn_save_filter['onclick']+'">'+panel_btn_control.btn_save_filter['text']+'</button>':'');
	html_panel = '<div class="'+panel_btn_control.class_group+'" '+panel_btn_control.properties_group+'>'+html_panel + '</div>';
	
	$('#'+panel_btn_control.btn_data_filter.id_div).html(html_panel)
}
//конец функции

/*
 * функция генерации элемента select (полей)
 * Vadim GRITSENKO
 * 20150702
 */
Filter.generate_select_fields = function (){
	select_fields = '<select class="form-control input-sm" id="field_name" style="width:24%" onchange="set_view_value_by_field(this)">';
	select_fields += generate_select_options(Filter.columns, '');
	select_fields += '</select>';
	Filter.select_columns = select_fields;
}
// конец функции

/*
 * функция генерации элемента select (соединителей)
 * Vadim GRITSENKO
 * 20150702
 */
Filter.generate_select_link = function (){
	select_link = '<select id="link" class="form-control input-sm" style="width:18%">';
	select_link += generate_select_options(Filter.link, '');
	select_link += '</select>';
	Filter.select_link = select_link;
}
// конец функции

/*
 * функция генерации элемента select (условий)
 * Vadim GRITSENKO
 * 20150702
 */
Filter.generate_select_conditions = function (){
	select_conditions = '<select id="condition" class="form-control input-sm" style="width:24%" onchange="set_view_value_by_condition(this)">';
	select_conditions += generate_select_options(Filter.config_data_table, '');
	select_conditions += '</select>';
	Filter.select_conditions = select_conditions;
}
// конец функции

/*
 * функция генерации опций (options) для select
 * Vadim GRITSENKO
 * 20150706
 */
generate_select_options = function (array_options, hide_option){
	text_options = '';
	for (numb in array_options){
		if( hide_option.indexOf(numb) + 1 ){continue;}
		text_options += '<option value="'+numb+'">' + array_options[numb]['name'] + '</option>';
	}
	return text_options;
}
// конец функции

/*
 * функция изменения формата кнопки
 * Vadim GRITSENKO
 * 20150708
 */
update_btn_clear = function (){
	if( $('.filter').length > 0 ){
		$('#btn_clear.hide').removeClass('hide').addClass('show');
	}
	else {
		$('#btn_clear.show').removeClass('show').addClass('hide');
	}
}
// конец функции

/*
 * функция добавления фильтра (строки)
 * Vadim GRITSENKO
 * 20150702
 */
Filter.add_filter = function (){
	html_code = '<div class="filter form-inline">'+Filter.select_columns+Filter.select_conditions+'<input type="text" view_input="value" class="form-control input-sm" style="width:25%"/><input type="text"  class="" view_input="value_additional"/>'+Filter.select_link +'<span class="glyphicon glyphicon-minus-sign btn" aria-hidden="true" style="color:red" onclick="Filter.remove_filter(this)"></span></div>';
	
	$('#div_list_filters').append(html_code);
	set_view_value_by_field($('.filter:last').find('#field_name'));
	set_view_value_by_condition($('.filter:last').find('#condition'));
	update_btn_clear();
}
// конец функции

/*
 * изменение поля value - значение при выборе поля для фильтра
 * Vadim GRITSENKO
 * 20150706
 */
set_view_value_by_field = function (obj){
	$(obj).closest('.filter').children('[view_input="value"]').attr('class','form-control input-sm').val('').unbind();
	switch (Filter.columns[$(obj).val()]['type']){
		case 'date':
			$(obj).closest('.filter').children('input[type="text"]').addClass('datepicker');
			$(obj).closest('.filter').find('#condition').html(generate_select_options(Filter.config_data_table, 'EQ,NEQ,BTN,LIKE,NOTLIKE'));
			if (typeof init_datepicker == 'function'){init_datepicker()};
			break;
		case 'text':
			$(obj).closest('.filter').find('#condition').html(generate_select_options(Filter.config_data_table, 'GT,GTE,LTE,LT,BTN'))
			break;
		case 'numb':
			$(obj).closest('.filter').find('#condition').html(generate_select_options(Filter.config_data_table, 'BTN'));
			$(obj).closest('.filter').children('input').addClass('check_number');
			$('.check_number').keyup(function(){check_number(this);});
			break;
	}
	if (Filter.columns[$(obj).val()]['autocopmlete']){set_autocomplete(obj,Filter.columns[$(obj).val()]['autocopmlete'])}
}
// конец функции

/*
 * изменение поля value - значение при выборе условия для фильтра
 * Vadim GRITSENKO
 * 20150706
 */
set_view_value_by_condition = function (obj){
	$(obj).closest('.filter').children('input[type="text"]').addClass('hide');
	switch (Filter.config_data_table[$(obj).val()]['input_value']){
		case 'double':
			//снять комменатрий на случай проработки условия BETWEEN
			//$(obj).closest('.filter').children('input[type="text"][view_input="value_additional"],[view_input="value"]').removeClass('hide');
			break;
		case 'one':
			$(obj).closest('.filter').children('input[type="text"][view_input="value"]').removeClass('hide');
			break;
	}
}
// конец функции

/*
 * изменение поля value - значение при выборе условия для фильтра
 * Vadim GRITSENKO
 * 20150706
 */
set_autocomplete = function (obj_input, array_values){

	try{
		$(obj_input).closest('.filter').children('input[type="text"]').autocomplete("destroy");
	}catch(e){}
	
	$(obj_input).closest('.filter').children('input[type="text"]').autocomplete({
		  source: array_values
	});	
}
// конец функции

/*
 * проверка на отсутствие букв в строке 
 * Vadim GRITSENKO
 * 20150706
 */
check_number = function (obj){
	 if (obj.value.match(/[^0-9.,:]/g)) {
        obj.value = obj.value.replace(/[^0-9.,:]/g, '');
    }
}
// конец функции

/*
 * функция удаления фильтра (строки)
 * Vadim GRITSENKO
 * 20150702
 */
Filter.remove_filter = function (obj){
	$(obj).closest('div').remove();
	update_btn_clear();
}
// конец функции

/*
 * функция получения json-объекта
 * Vadim GRITSENKO
 * 20150702
 */
Filter.get_filter_json = function (){
	data_filters = Array();
	$('.filter').each(function (){
		data_filters.push({
			'name_field': 	$(this).find('#field_name').val(),
			'condition': 	$(this).find('#condition').val(),
			'value': 		$(this).find('[view_input="value"]').val(),
			'link': 		$(this).find('#link').val(),
		})
	})
	return JSON.stringify(data_filters);
}
// конец функции

/*
 * функция получения json-объекта
 * Vadim GRITSENKO
 * 20150702
 */
Filter.get_filter_sql = function (){
	data_filters = '';
	$('.filter').each(function (){
			data_filters +=	$(this).find('#field_name').val() + ' ' + $(this).find('#condition').val() + ' ' + $(this).find('#value').val() + ' ' + $(this).find('#link').val() + ' '
	})
	return data_filters;
}
// конец функции

/*
 * функция получения json-объекта
 * Vadim GRITSENKO
 * 20150702
 */
Filter.get_filter_url_get = function (){
	names = '_name=';
	conditions = '_conditions=';
	values = '_values=';
	links = '_links=';
	$('.filter').each(function (){
		names += 		$(this).find('#field_name').val()+'|';
		conditions += 	$(this).find('#condition').val()+'|';
		values += 		$(this).find('[view_input="value"]').val() + '|';
		//($(this).find('[view_input="value_additional"][class!="hide"]')?'^' + $(this).find('[view_input="value_additional"]').val():)
		links += 		$(this).find('#link').val() + '|';
	})
	return (names != '_name='?'?' + names.substring(0, names.length - 1) + '&' + conditions.substring(0, conditions.length - 1) + '&' + values.substring(0, values.length - 1) + '&' + links.substring(0, links.length - 1):'');
}
// конец функции

/*
 * функция загрузки json-объекта
 * Vadim GRITSENKO
 * 20150703
 */
Filter.load_filters = function (){
	try{
		var filters = JSON.parse(Filter.json_object);
		for (i=0; i<filters['fields_name'].length; i++){
			Filter.add_filter();
			$('.filter:last').each(function (){
				$(this).find('#field_name').val(filters['fields_name'][i]);
				set_view_value_by_field($(this).find('#field_name'));
				$(this).find('#condition').val(filters['conditions'][i]);
				set_view_value_by_condition($(this).find('#condition'));
				$(this).find('[view_input="value"]').val(filters['values'][i]);
				$(this).find('#link').val(filters['links'][i]);
			})
		}
	}catch(e){}
}
// конец функции
