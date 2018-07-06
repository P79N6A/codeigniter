
var Mentor = {
	base_url: null, //переменная для хранения адреса сайта
	options_attributes: null, //переменная для хранения опций аттритбутов
	options_event_type: null, //переменная для хранения опций типов событий
	fk_sms: null, //переменная для хранения идентификатора сообщения
	fk_email: null, //переменная для хранения идентификатора почты
	current_view_message: null, //переменная для хранения текущего вида сообщения 
	report_type: null, //переменная для хранения текущего вида субъекта
	save_history: true, //переменная для хранения флага на сохранение текущего приложения в истории (по умолчанию true - запись)
	id_user: null, //переменная для хранения идентификатора выбранного пользователя
	report_date: null, //дата анализа Ментора
	parser_version: '', //парсер-версия 
	filters: null, //фильтр 
};

var default_parameters_dialog = {
		title: 'Листинг данных', 
		autoOpen: false,
		height: "auto",
		position: "top",
		width: "auto",
		maxHeight: "500",
		modal: false
	};	

/*
 * функция задания объекта фильтр
 * Vadim GRITSENKO
 * 20150713
 */
Mentor.set_object_filter = function (){
	if (typeof (Filter) == 'undefined') {
		alert('Подключите плагин фильтров');
		return;
	}
	
	mentor_filter = Filter;
	mentor_filter.button_save = true;
	mentor_filter.panel_btn_control.btn_save_filter['onclick'] = 'Mentor.load_form_create(\'filters\',\'Сохранение фильтра\')';
	mentor_filter.panel_btn_control.btn_save_filter['text'] = '<span class="glyphicon glyphicon-floppy-save" aria-hidden="true"></span>&nbsp;';
	mentor_filter.add_column(array_columns);
	mentor_filter.json_object = JSON.stringify(Mentor.filters);
	mentor_filter.initialization();
		
	mentor_filter.callback = function (){
		parameters_url = mentor_filter.get_filter_url_get();
		location.href = Mentor.base_url + 'index.php/mentor/load_main_content/'+ view_message + parameters_url;
	};
	$('#btn_window_filter').click(function (){
		load_window();
		if (mentor_filter.json_object == '[]') {Filter.add_filter();}
	});
	
}
//конец функции

/*
 * функция инициализации элементов и объектов страницы (главной)
 * Vadim GRITSENKO
 * 20150527
 */
Mentor.init_main_page = function (view_message){
	resize_window();
	Mentor.load_list_data('list_'+view_message, view_message);
}
//конец функции

/*
 * функция загрузка пользовательского списка проанализированных посланий
 * Vadim GRITSENKO
 * 20150602
 */
Mentor.load_user_analize = function (){
	user_list = true;
	window.open(Mentor.base_url + 'index.php/mentor/my_analize/report/default');
}
//конец функции

/*
 * функция загрузка пользовательского списка проанализированных посланий
 * Vadim GRITSENKO
 * 20150602
 */
Mentor.open_new_window = function (url_message){
	window.open(Mentor.base_url + '/index.php/' + url_message);
}
//конец функции

/*
 * функция инициализации элементов и объектов страницы (анализа сообщения)
 * Vadim GRITSENKO
 * 20150528
 */
Mentor.init_analize_sms_page = function (){
	resize_window();
	//window.addEventListener( 'resize', resize_window, false );
}
//конец функции

/*
 * функция инициализации даты для отчета
 * Vadim GRITSENKO
 * 20150703
 */
Mentor.set_date_report = function (){
	cur_date = new Date();
	Mentor.report_date = {'start_date':'01-'+('0'+(cur_date.getMonth()+1)).slice(-2)+'-'+cur_date.getFullYear(),'end_date':('0'+cur_date.getDate()).slice(-2)+'-'+('0'+(cur_date.getMonth()+1)).slice(-2)+'-'+cur_date.getFullYear(),}
}
//конец функции

/*
 * функция инициализации страницы списка отчетов
 * Vadim GRITSENKO
 * 20150603
 */
Mentor.init_reports_page = function (){
	resize_window();
	Mentor.set_date_report()
	$('#btn_'+Mentor.report_type).removeClass('btn-default').addClass('btn-success');
}
//конец функции

/*
 * функция изменения размерности элементов страницы
 * Vadim GRITSENKO
 * 20150527
 */
resize_window = function (){
	$('body').height($(window).height())
	$('#content_div').height($(window).height()-$('header').height()-$('#panel_top_btn').height());
	
	$('#graph_tree').height($('#data_reports').height()-60)
	$('.well').each(function (){
		$(this).css({'height':$(this).closest('td').height() - $(this).closest('td').find('#panel_top_btn').height() - 20, 'overflow': 'auto'})
	})
	$('#graph_emails').height(($('#graph_emails').closest('.well').height() - $('#tables_data').height())/2 - 20);
	$('#graph_sms').height($('#graph_emails').height());	
	$('.row').css({'width': $('#data_reports').width()})
}
//конец функции

resize_graph = function (){
	$('.row').css({'width': $('#data_reports').width()})
	$('#graph_situation').height(300);
	$('#graph_emails').height(($('#graph_emails').closest('.well').height() - $('#tables_data').height())/2 - 20);
	$('#graph_sms').height($('#graph_emails').height());
}

/*
 * функция загрузки листинга сообщений или почты по пользователю
 * Vadim GRITSENKO
 * 20150622
 */
Mentor.load_list_user = function (table_mes, parameters){
	change_class('', 'list_'+table_mes);
	parameters_query = parameters || [];
	var html = $.ajax({
		url: Mentor.base_url+"index.php/mentor/ajax/load_table/mentor/list_" + table_mes + '_user',
		type: "POST",
		data: {'parameters':parameters_query}	
	}).done(function (response, textStatus, jqXHRб){
		$('#data_reports').html('<div>'+response+'</div>');
		$('.dataTable').width('100%');
	});
}
//конец функции

/*
 * функция инициализации элементов и объектов страницы
 * Vadim GRITSENKO
 * 20150527
 */
Mentor.load_list_data = function (table_mes, view_mes){
	Mentor.current_view_message = view_mes;
	$('#btn_'+view_mes).removeClass('btn-default').addClass('btn-success');
	//(user_list == true? $('#btn_user_analize').removeClass('btn-default').addClass('btn-warning'): '');
	var html = $.ajax({
		url: Mentor.base_url + "index.php/mentor/ajax/load_table/mentor/" + table_mes,
		type: "POST",
		data: { 'parameters' : { 'filters' : (Mentor.filters) } }
	}).done(function (response, textStatus, jqXHRб){
		$('#list_data').html('<div>'+response+'</div>');
		$('.dataTable').width('100%');
	});
}
//конец функции

/*
 * функция загрузки иерархии задач
 * Vadim GRITSENKO
 * 20150623
 */
Mentor.load_list_task = function (){
	change_class('btn_table_tam', 'list_tam');
	var html = $.ajax({
		url: Mentor.base_url+"index.php/mentor/get_hierarchy_tam/",
		type: "POST"
	}).done(function (response, textStatus, jqXHRб){
		result = JSON.parse(response);
		$('#data_reports').html('<h3> Дерево задач  (табличный вид) </h3>'+'<div>'+get_table_hierarchy(result.hierarchy_data, 'Иерархия орг/структуры')+'</div>');
	});
}
//конец функции

/*
 * функция загрузка листа COMA
 * Vadim GRITSENKO
 * 20150624
 */
Mentor.load_list_coma = function (){
	change_class('', 'list_coma');
	var html = $.ajax({
		url: Mentor.base_url+"index.php/mentor/get_data_coma/",
		type: "POST"
	}).done(function (response, textStatus, jqXHRб){
		result = JSON.parse(response);
		$('#data_reports').html('<h3> Таблица данных COMA </h3>'+'<div>'+get_table_coma(result.data_coma)+'</div>');
	});
}
//конец функции

/*
 * функция удаления фильтра из БД
 * Vadim GRITSENKO
 * 20150714
 */
Mentor.delete_filter = function (id_filter){
	if (confirm('Вы действительно хотите удалить')){
		var html = $.ajax({
			url: Mentor.base_url+"index.php/mentor/delete_filter/",
			type: "POST",
			data: {'id' : id_filter}
		}).done(function (response, textStatus, jqXHRб){
			location.reload();
		});
	}
}
//конец функции

/*
 * функция построения таблицы листинга COMA
 * Vadim GRITSENKO
 * 20150624
 */
get_table_coma = function(array_data){
	if (array_data.length > 0){
		html_code = '<table class="table table-bordered table-striped">';
		
		html_code += '<thead><tr><th>'+'Наименование'+'</th><th>'+'Описание'+'</th><th>'+'Задача'+'</th></tr></thead>';
		html_code += '<tbody>';

		for (position in array_data){
			html_code += '<tr onclick="Mentor.edit_form(\'analize_coma\',\'Редактирование COMA\','+array_data[position]['id']+')"><td>'+array_data[position]['name']+'</td><td>'+( array_data[position]['description']!= null ? array_data[position]['description'] : '' )+'</td><td>'+array_data[position]['analize_task_name']+'</td></tr>';
		}
		
		html_code += '</tbody>';
		html_code += '</table>';

		return html_code;
	}
	else {return 'Нет данных, таблица пуста';}
};
//конец функции

/*
 * функция построения таблицы иерархии 
 * Vadim GRITSENKO
 * 20150623
 */
get_table_hierarchy = function(array_data, title){

	try{
		current_level = array_data[0]['level'];
		html_code = '';

			for (position in array_data){
				if (parseInt(array_data[position]['level']) > parseInt(current_level)) html_code += '<ul>';
				else if (parseInt(array_data[position]['level']) < parseInt(current_level)) {
					for (i = 0; i < parseInt(current_level) - parseInt(array_data[position]['level']) ; i++) html_code += '</ul>';
				}
				current_level = array_data[position]['level'];
				html_code += '<li><a onclick="Mentor.edit_form(\'analize_task\',\'Редактирование задачи\',' + array_data[position]['id'] + ')">' + array_data[position]['name'] + '</a></li>';
			}

		return html_code;
	}catch(e){alert("Проверьте базу данных или запрос иерархии"); return '';}
};
//конец функции

/*
 * функция изменения класса выбранного элемента
 * Vadim GRITSENKO
 * 20150622
 */
change_class = function (id_btn, id_list){
	$('.basic_entity').removeClass('btn-success').addClass('btn-default');
	$('.btn_coma_tam').removeClass('btn-success').addClass('btn-warning');
	if($('#'+id_btn).length > 0){
		$('#'+id_btn).removeClass('btn-default').addClass('btn-success');
	}
	if($('#'+id_list).length > 0){
		$('.list-group-item-success').removeClass('list-group-item-success');
		$('#'+id_list).addClass('list-group-item-success');
	}
}
//конец функции

/*
 * функция демонстрации данных по пользоваелю
 * Vadim GRITSENKO
 * 20150604
 */
Mentor.load_data_default = function (){
	record_check_history('default');
	change_class('btn_default', 'list_common_report');
	var html = $.ajax({
		url: Mentor.base_url+"index.php/mentor/get_graph_default/",
		type: "POST",
		data: { 'id_user' : Mentor.id_user, 'report_date' : Mentor.report_date }
	}).done(function (response, textStatus, jqXHRб){
		var graph_options = JSON.parse(JSON.stringify(Mentor.graph_options));
		
		result = JSON.parse(response);
		$('#data_reports').html('<h3 class="text-primary"> Общие сведения '+(choose_user_data!=null?' эксперта - '+choose_user_data['user_name']:'')+'</h3><div class="row" id="tables_data" ><div class="col-md-6">'+get_common_table(result.total_report_data, 'СМС-сообщения', 'sms')+'</div><div class="col-md-6">'+get_common_table(result.total_report_data,'E-mail', 'emails')+'</div></div><div class="row" id="graphs_data" ><div class="col-md-6"><h3 class="panel-title">Динамика анализа СМС (<a href="javascript:void(0)" onclick="Mentor.window_change_date(\'default\')" id="a_date_graph">'+Mentor.report_date.start_date+'/'+Mentor.report_date.end_date+'</a>)</h3><div id="graph_sms"></div></div><div class="col-md-6"><h3 class="panel-title">Динамика анализа почты (<a href="javascript:void(0)" onclick="Mentor.window_change_date(\'default\')" id="a_date_graph">'+Mentor.report_date.start_date+'/'+Mentor.report_date.end_date+'</a>)</h3><div id="graph_emails"></div></div></div>');
		
		resize_graph();
		
		var graph_options = JSON.parse(JSON.stringify(Mentor.graph_options));

		graph_options['db_data'] = result.graph_data_emails;
		//graph_options.graph_options.clickPoint = {"name_func" : 'Mentor.analize_day_emails',"url" : 'index.php/monitoring/ajax_build_table/'}
		graph_options.groups[0] = $.extend(graph_options.groups[0],{"name_func" : 'Mentor.analize_day_emails',"parameters" : "\'false\'"})
		graph_options.groups[1] = $.extend(graph_options.groups[1],{"name_func" : 'Mentor.analize_day_emails',"parameters" : "\'true\'"})
		graph_options.groups[2] = $.extend(graph_options.groups[2],{"name_func" : 'Mentor.analize_day_emails',"parameters" : "\'\'"})
		Mentor.building_graph(graph_options, 'graph_emails');

		graph_options['db_data'] = result.graph_data_sms;
		//graph_options.graph_options.clickPoint = {"name_func" : 'Mentor.analize_day_sms',"url" : 'index.php/monitoring/ajax_build_table/'}
		graph_options.groups[0] = $.extend(graph_options.groups[0],{"name_func" : 'Mentor.analize_day_sms',"parameters" : "\'false\'"})
		graph_options.groups[1] = $.extend(graph_options.groups[1],{"name_func" : 'Mentor.analize_day_sms',"parameters" : "\'true\'"})
		graph_options.groups[2] = $.extend(graph_options.groups[2],{"name_func" : 'Mentor.analize_day_sms',"parameters" : "\'\'"})
		Mentor.building_graph(graph_options, 'graph_sms');
	});
}
//конец функции

/*
 * загрузка вспомогательного окна с листингом данных анализа по почте
 * Vadim GRITSENKO
 * 20150619
 */
Mentor.analize_day_emails = function (date, view_analize){
	Mentor.open_list_situation_type('list_analize_message','Листинг проведенных анализов за - ' + date + ' (почты)','email', view_analize, date)
}
//конец функции

/*
 * загрузка вспомогательного окна с листингом данных анализа по смс
 * Vadim GRITSENKO
 * 20150619
 */
Mentor.analize_day_sms = function (date, view_analize){
	Mentor.open_list_situation_type('list_analize_message','Листинг проведенных анализов за - ' + date + ' (SMS-сообщения)','sms', view_analize, date)
}
//конец функции

/*
 * обработчик событий срабатываемый при переходе по истории загрузки
 * Vadim GRITSENKO
 * 20150619
 */
get_common_table = function(array_data_sms, title, view_message){
	html_code = '<table class="table table-bordered table-striped"><thead>'
	html_code += '<tr class="info"><th colspan="2" class="text_center">'+title+'</th></tr>';
	html_code += '<tbody>';
	html_code += '<tr><td> Общее количество </td><td><span class="label label-info label-lg">'+array_data_sms['total_count_'+view_message]+'</span></td></tr>';
	html_code += '<tr onclick="Mentor.open_list_situation_type(\'list_valid_'+view_message+'\',\'Листинг нераспознанных сообщений\',\'\', \'\',\'\')"><td> Число проанализированных </td><td><span class="label label-warning label-lg">'+array_data_sms['total_count_'+view_message+'_analize']+'</span></td></tr>';
	html_code += '<tr onclick="Mentor.open_list_situation_type(\'list_valid_'+view_message+'\',\'Листинг распознанных сообщений\',\'\', \'true\',\'\')" class="cursor-pointer"><td> Число распознанных </td><td><span class="label label-success label-lg">'+array_data_sms['total_count_'+view_message+'_success']+'</span></td></tr>';
	html_code += '<tr onclick="Mentor.open_list_situation_type(\'list_valid_'+view_message+'\',\'Листинг нераспознанных сообщений\',\'\', \'false\',\'\')" class="cursor-pointer"><td> Число нераспознанных </td><td><span class="label label-danger label-lg">'+array_data_sms['total_count_'+view_message+'_danger']+'</span></td></tr>';
	html_code += '</tbody>';
	html_code += '</table>';
	return html_code;
};
//конец функции


/*
 * обработчик событий срабатываемый при переходе по истории загрузки
 * Vadim GRITSENKO
 * 20150619
 */
popHandler = function(e){
	Mentor.save_history = false;
	load_content(history.state.report_type);
};
//конец функции

/*
 * фукнция на проверку и запись в историю загрузки
 * Vadim GRITSENKO
 * 20150619
 */
function record_check_history(name_report_type){
	if (Mentor.save_history == true) {
		history.pushState({report_type:'load_data_' + name_report_type}, '', Mentor.base_url+'index.php/mentor/load_list_reports/'+(choose_user_data != null?choose_user_data['user_id']:null)+'/'+name_report_type);
	}
};
//конец функции

/*
 * фукнция загрузки контента на страницу
 * Vadim GRITSENKO
 * 20150619
 */
function load_content(report_content){
	Mentor.set_date_report();
	Mentor[report_content]();
};
//конец функции

/*
 * функция загрузка данных по ситуации на страницу
 * Vadim GRITSENKO
 * 20150608
 */
Mentor.load_data_situation = function (){
	record_check_history('situation');
	change_class('btn_sit', 'list_common_report');
	var html = $.ajax({
		url: Mentor.base_url+"index.php/mentor/get_graph_situation/",
		type: "POST",
		data: {'id_user': Mentor.id_user, 'report_date' : Mentor.report_date, 'parser_version' : Mentor.parser_version }
	}).done(function (response, textStatus, jqXHRб){
		var graph_options = JSON.parse(JSON.stringify(Mentor.graph_options));

		result = JSON.parse(response);
		graph_options['db_data'] = result['graph_data'];
		$('#data_reports').html('<h3 class="text-primary"> Сведения по ситуациям '+(choose_user_data!=null?' эксперта - '+choose_user_data['user_name']:'')+'</h3>'+Mentor.get_select_parser_version(JSON.parse(list_parser_version))+'<div class="row"><div id="table_situation" class="col-md-6" style="height:100%">'+get_html_data_table(result['table_data'])+get_html_data_table_sit(result['table_data_sit'])+'</div><a href="javascript:void(0)" onclick="Mentor.window_change_date(\'situation\')" id="a_date_graph">'+Mentor.report_date.start_date+'/'+Mentor.report_date.end_date+'</a><div id="graph_situation" class="col-md-6" style="height:100%"></div></div>');
		
		resize_graph()
		
		//graph_options.graph_options.clickPoint = {"name_func" : 'Mentor.sit_day_date',"url" : 'index.php/monitoring/ajax_build_table/'}
		graph_options.groups[0] = $.extend(graph_options.groups[0],{"name_func" : 'Mentor.sit_day_date',"parameters" : "\'false\'"})
		graph_options.groups[1] = $.extend(graph_options.groups[1],{"name_func" : 'Mentor.sit_day_date',"parameters" : "\'true\'"})
		graph_options.groups[2] = $.extend(graph_options.groups[2],{"name_func" : 'Mentor.sit_day_date',"parameters" : "\'\'"})
		Mentor.building_graph(graph_options, 'graph_situation');
		
		$('#parser_version').val(Mentor.parser_version).change(function (e){Mentor.update_parser_version(this, 'situation');})
	});
}
//конец функции

/*
 * функция загрузки листинга анализа ситуаций
 * Vadim GRITSENKO
 * 20150608
 */
Mentor.sit_day_date = function (date, view_analize){
	Mentor.open_list_situation_type('list_analize_situation','Листинг проведенных анализов ситуаций  за - ' + date,'all', view_analize, date)
}
//конец функции

/*
 * функция скрыть/показать списка проделанного анализа
 * Vadim GRITSENKO
 * 20150608
 */
function show_analize(){
	$('#thead_analizes').closest('thead').next().toggleClass("hide");
}
//конец функции

/*
 * функция генерирования html-кода таблицы данных по анализу (вариант-1)
 * Vadim GRITSENKO
 * 20150610
 */
get_html_data_table = function (array_data){
	html_code = '<table class="table table-bordered table-striped">';
	html_code += '<thead><tr><th colspan="2">Таблица результирующих данных</th></tr><thead>';
	html_code += '<tbody>';
	html_code += '<tr onclick="Mentor.open_list_situation_type(\'list_analize_situation\',\'Листинг проведенных анализов ситуаций\',\'all\', \'\',\'\')"><td>Число проанализированных</td><td><span class="label label-warning label-lg">'+array_data['count_total']+'</span></td></tr>';
	html_code += '<tr onclick="Mentor.open_list_situation_type(\'list_analize_situation\',\'Листинг распознанных ситуаций\',\'all\', \'true\',\'\')"><td>Число распознаных</td><td><span class="label label-success label-lg">'+array_data['count_success']+' ('+get_percent(array_data['count_total'],array_data['count_success'])+'%) '+'</span></td></tr>';
	html_code += '<tr onclick="Mentor.open_list_situation_type(\'list_analize_situation\',\'Листинг нераспознанных ситуаций\',\'all\', \'false\',\'\')" ><td>Число нераспознаных</td><td><span class="label label-danger label-lg">'+array_data['count_danger']+' ('+get_percent(array_data['count_total'],array_data['count_danger'])+'%) '+'</span></td></tr>';
	html_code += '</tbody>';
	html_code += '</table>';
	return html_code;
}
//конец функции

/*
 * функция генерирования html-кода таблицы данных по анализу (вариант-2)
 * Vadim GRITSENKO
 * 20150610
 */
get_html_data_table_sit = function (array_data){
	html_code = '<table class="table table-bordered table-striped">';
	html_code += '<thead><tr><th>Cитуация</th><th>Общее число</th><th>Динамика</th></tr><thead>';
	html_code += '<tbody>';
	for(current in array_data){
		html_code += '<tr><td>'+array_data[current]['name_sit']+'</td><td onclick="Mentor.open_list_situation_type(\'list_analize_situation\',\'Листинг проведенных анализов по ситуации - '+array_data[current]['name_sit']+'\',\''+array_data[current]['name_sit']+'\', \'\',\'\')"><span class="label label-warning label-lg">'+array_data[current]['count_total']+'</span></td><td><div>'+'<span class="pull-left" style="color:#fff"  onclick="Mentor.open_list_situation_type(\'list_analize_situation\',\'Листинг случаев распознанных ситуации - '+array_data[current]['name_sit']+'\',\''+array_data[current]['name_sit']+'\', \'true\',\'\')">'+parseInt(array_data[current]['percent_success'])+'%</span>'+'<span class="pull-right" style="color:#fff" onclick="Mentor.open_list_situation_type(\'list_analize_situation\',\'Листинг случаев нераспознанных ситуации - '+array_data[current]['name_sit']+'\',\''+array_data[current]['name_sit']+'\', \'false\',\'\')">'+(100-parseInt(array_data[current]['percent_success']))+'%</span><progress id=\'p\' class="determinate" max=\''+array_data[current]['count_total']+'\' value=\''+array_data[current]['count_success']+'\'></progress></div><div style="text-align:center">'+array_data[current]['count_success']+'/'+array_data[current]['count_danger']+'</div></td></tr>';
	}
	html_code += '</tbody>';
	html_code += '</table>';
	return html_code;
}
//конец функции

/*
 * функция загрузка данных по событиям на страницу
 * Vadim GRITSENKO
 * 20150608
 */
Mentor.load_data_event = function (){
	record_check_history('event');
	change_class('btn_event', 'list_common_report');
	var html = $.ajax({
		url: Mentor.base_url+"index.php/mentor/get_graph_event/",
		type: "POST",
		data: {'id_user': Mentor.id_user, 'report_date' : Mentor.report_date, 'parser_version' : Mentor.parser_version }
	}).done(function (response, textStatus, jqXHRб){
		var graph_options = JSON.parse(JSON.stringify(Mentor.graph_options));

		result = JSON.parse(response);
		graph_options['db_data'] = result['graph_data'];
		$('#data_reports').html('<h3 class="text-primary"> Сведения по событиям '+(choose_user_data!=null?' эксперта - '+choose_user_data['user_name']:'')+'</h3>'+Mentor.get_select_parser_version(JSON.parse(list_parser_version))+'<div class="row"><div id="table_situation" class="col-md-6" style="height:100%">'+get_html_data_table_event(result['table_data'])+get_html_data_table_event_name(result['table_data_event'])+'</div><a href="javascript:void(0)" onclick="Mentor.window_change_date(\'event\')" id="a_date_graph">'+Mentor.report_date.start_date+'/'+Mentor.report_date.end_date+'</a><div id="graph_situation" class="col-md-6" style="height:100%"></div></div>');
		
		resize_graph()
		
		//graph_options.graph_options.clickPoint = {"name_func" : 'Mentor.event_day_date',"url" : 'index.php/monitoring/ajax_build_table/'}		
		graph_options.groups[0] = $.extend(graph_options.groups[0],{"name_func" : 'Mentor.event_day_date',"parameters" : "\'false\'"})
		graph_options.groups[1] = $.extend(graph_options.groups[1],{"name_func" : 'Mentor.event_day_date',"parameters" : "\'true\'"})
		graph_options.groups[2] = $.extend(graph_options.groups[2],{"name_func" : 'Mentor.event_day_date',"parameters" : "\'\'"})
		Mentor.building_graph(graph_options, 'graph_situation');
		
		$('#parser_version').val(Mentor.parser_version).change(function (e){Mentor.update_parser_version(this, 'event');})		
	});
}
//конец функции

/*
 * функция загрузки листинга анализа событий
 * Vadim GRITSENKO
 * 20150608
 */
Mentor.event_day_date = function (date, view_analize){
	Mentor.open_list_situation_type('list_analize_event','Листинг проведенных анализов событий за - ' + date,'all', view_analize, date)
}
//конец функции

/*
 * функция генерирования html-кода таблицы данных по анализу (вариант-1)
 * Vadim GRITSENKO
 * 20150610
 */
get_html_data_table_event = function (array_data){
	html_code = '<table class="table table-bordered table-striped">';
	html_code += '<thead><tr><th colspan="2">Таблица результирующих данных</th></tr><thead>';
	html_code += '<tbody>';
	html_code += '<tr onclick="Mentor.open_list_situation_type(\'list_analize_event\',\'Листинг проведенных анализов ситуаций\',\'all\', \'\',\'\')"><td>Число проанализированных</td><td><span class="label label-warning label-lg">'+array_data['count_total']+'</span></td></tr>';
	html_code += '<tr onclick="Mentor.open_list_situation_type(\'list_analize_event\',\'Листинг распознанных ситуаций\',\'all\', \'true\',\'\')"><td>Число распознаных</td><td><span class="label label-success label-lg">'+array_data['count_success']+' ('+get_percent(array_data['count_total'],array_data['count_success'])+'%) '+'</span></td></tr>';
	html_code += '<tr onclick="Mentor.open_list_situation_type(\'list_analize_event\',\'Листинг нераспознанных ситуаций\',\'all\', \'false\',\'\')" ><td>Число нераспознаных</td><td><span class="label label-danger label-lg">'+array_data['count_danger']+' ('+get_percent(array_data['count_total'],array_data['count_danger'])+'%) '+'</span></td></tr>';
	html_code += '</tbody>';
	html_code += '</table>';
	return html_code;
}
//конец функции

/*
 * функция генерирования html-кода таблицы данных по анализу (вариант-2)
 * Vadim GRITSENKO
 * 20150610
 */
get_html_data_table_event_name = function (array_data){
	html_code = '<table class="table table-bordered table-striped">';
	html_code += '<thead><tr><th>Cитуация</th><th>Общее число</th><th>Динамика</th></tr><thead>';
	html_code += '<tbody>';
	for(current in array_data){
		html_code += '<tr><td>'+array_data[current]['name_sit']+'</td><td onclick="Mentor.open_list_situation_type(\'list_analize_event\',\'Листинг проведенных анализов по ситуации - '+array_data[current]['name_sit']+'\',\''+array_data[current]['name_sit']+'\', \'\',\'\')"><span class="label label-warning label-lg">'+array_data[current]['count_total']+'</span></td><td><div>'+'<span class="pull-left" style="color:#fff"  onclick="Mentor.open_list_situation_type(\'list_analize_event\',\'Листинг случаев распознанных ситуации - '+array_data[current]['name_sit']+'\',\''+array_data[current]['name_sit']+'\', \'true\',\'\')">'+parseInt(array_data[current]['percent_success'])+'%</span>'+'<span class="pull-right" style="color:#fff" onclick="Mentor.open_list_situation_type(\'list_analize_event\',\'Листинг случаев нераспознанных ситуации - '+array_data[current]['name_sit']+'\',\''+array_data[current]['name_sit']+'\', \'false\',\'\')">'+(100-parseInt(array_data[current]['percent_success']))+'%</span><progress id=\'p\' class="determinate" max=\''+array_data[current]['count_total']+'\' value=\''+array_data[current]['count_success']+'\'></progress></div><div style="text-align:center">'+array_data[current]['count_success']+'/'+array_data[current]['count_danger']+'</div></td></tr>';
	}
	html_code += '</tbody>';
	html_code += '</table>';
	return html_code;
}
//конец функции

/*
 * функция возвращающая обратно процент от числа
 * Vadim GRITSENKO
 * 20150609
 */
get_percent = function (value_total, value_current){
	if (parseInt(value_total) == 0) return 0;
	return  (parseInt(value_current)*100/parseInt(value_total)).toFixed(3);
}
//конец функции

/*
 * функция демонстрации нужного листинга datatables
 * Vadim GRITSENKO
 * 20150609
 */
Mentor.open_list_situation_type = function (name_list, title, name_situation_type, view_analize, date){
	Mentor.load_report_list_analize(name_list, title, {'name_situation': name_situation_type, 'view_analize':view_analize, 'date':date, 'id_user': Mentor.id_user, 'parser_version': Mentor.parser_version})
}
//конец функции

/*
 * функция загрузка данных по аттрибутам на страницу
 * Vadim GRITSENKO
 * 20150618
 */
Mentor.load_data_attr = function (){
	record_check_history('attr');
	change_class('btn_attr', 'list_common_report');
	var html = $.ajax({
		url: Mentor.base_url+"index.php/mentor/get_graph_attr/",
		type: "POST",
		data: {'id_user': Mentor.id_user, 'report_date' : Mentor.report_date, 'parser_version' : Mentor.parser_version}
	}).done(function (response, textStatus, jqXHRб){
		var graph_options = JSON.parse(JSON.stringify(Mentor.graph_options));

		result = JSON.parse(response);
		graph_options['db_data'] = result['graph_data'];
		$('#data_reports').html('<h3 class="text-primary"> Сведения по атрибутам '+(choose_user_data!=null?' эксперта - '+choose_user_data['user_name']:'')+'</h3>'+Mentor.get_select_parser_version(JSON.parse(list_parser_version))+'<div class="row"><div id="table_situation" class="col-md-6" style="height:100%">'+get_html_data_table_attr(result['table_data'])+get_html_data_table_attr_name(result['table_data_attr'])+'</div> <a href="javascript:void(0)" onclick="Mentor.window_change_date(\'attr\')" id="a_date_graph">'+Mentor.report_date.start_date+'/'+Mentor.report_date.end_date+'</a><div id="graph_situation" class="col-md-6" style="height:100%"></div></div>');

		resize_graph()

		//graph_options.graph_options.clickPoint = {"name_func" : 'Mentor.attr_day_date',"url" : 'index.php/monitoring/ajax_build_table/'}
		graph_options.groups[0] = $.extend(graph_options.groups[0],{"name_func" : 'Mentor.attr_day_date',"parameters" : "\'false\'"})
		graph_options.groups[1] = $.extend(graph_options.groups[1],{"name_func" : 'Mentor.attr_day_date',"parameters" : "\'true\'"})
		graph_options.groups[2] = $.extend(graph_options.groups[2],{"name_func" : 'Mentor.attr_day_date',"parameters" : "\'\'"})
		Mentor.building_graph(graph_options, 'graph_situation');
		
		$('#parser_version').val(Mentor.parser_version).change(function (e){Mentor.update_parser_version(this, 'attr');})		
	});
}
//конец функции

/*
 * функция загрузки листинга атрибутов по дням
 * Vadim GRITSENKO
 * 20150609
 */
Mentor.attr_day_date = function (date, view_analize){
	Mentor.open_list_situation_type('list_analize_attr','Листинг проведенных анализов атрибуту  за - ' + date,'all', view_analize, date)
}
//конец функции

/*
 * функция генерирования html-кода таблицы данных по анализу (вариант-1)
 * Vadim GRITSENKO
 * 20150610
 */
get_html_data_table_attr = function (array_data){
	html_code = '<table class="table table-bordered table-striped">';
	html_code += '<thead><tr><th colspan="2">Таблица результирующих данных</th></tr><thead>';
	html_code += '<tbody>';
	html_code += '<tr onclick="Mentor.open_list_situation_type(\'list_analize_attr\',\'Листинг проведенных анализов атрибутов\',\'all\', \'\',\'\')"><td>Число проанализированных</td><td><span class="label label-warning label-lg">'+array_data['count_total']+'</span></td></tr>';
	html_code += '<tr onclick="Mentor.open_list_situation_type(\'list_analize_attr\',\'Листинг распознанных атрибутов\',\'all\', \'true\',\'\')"><td>Число распознаных</td><td><span class="label label-success label-lg">'+array_data['count_success']+' ('+get_percent(array_data['count_total'],array_data['count_success'])+'%) '+'</span></td></tr>';
	html_code += '<tr onclick="Mentor.open_list_situation_type(\'list_analize_attr\',\'Листинг нераспознанных атрибутов\',\'all\', \'false\',\'\')" ><td>Число нераспознаных</td><td><span class="label label-danger label-lg">'+array_data['count_danger']+' ('+get_percent(array_data['count_total'],array_data['count_danger'])+'%) '+'</span></td></tr>';
	html_code += '</tbody>';
	html_code += '</table>';
	return html_code;
}
//конец функции


/*
 * функция генерирования html-кода таблицы данных по анализу (вариант-2)
 * Vadim GRITSENKO
 * 20150610
 */
get_html_data_table_attr_name = function (array_data){
	html_code = '<table class="table table-bordered table-striped">';
	html_code += '<thead><tr><th>Cитуация</th><th>Общее число</th><th>Динамика</th></tr><thead>';
	html_code += '<tbody>';
	for(current in array_data){
		html_code += '<tr><td>'+array_data[current]['name_sit']+'</td><td onclick="Mentor.open_list_situation_type(\'list_analize_attr\',\'Листинг проведенных анализов по атрибуту - '+array_data[current]['name_sit']+'\',\''+array_data[current]['id_attr']+'\', \'\',\'\')"><span class="label label-warning label-lg">'+array_data[current]['count_total']+'</span></td><td><div>'+'<span class="pull-left" style="color:#fff"  onclick="Mentor.open_list_situation_type(\'list_analize_attr\',\'Листинг проведенных анализов по атрибуту - '+array_data[current]['name_sit']+'\',\''+array_data[current]['id_attr']+'\', \'true\',\'\')">'+parseInt(array_data[current]['percent_success'])+'%</span>'+'<span class="pull-right" style="color:#fff" onclick="Mentor.open_list_situation_type(\'list_analize_attr\',\'Листинг проведенных анализов по атрибуту - '+array_data[current]['name_sit']+'\',\''+array_data[current]['id_attr']+'\', \'false\',\'\')">'+(100-parseInt(array_data[current]['percent_success']))+'%</span><progress id=\'p\' class="determinate" max=\''+array_data[current]['count_total']+'\' value=\''+array_data[current]['count_success']+'\'></progress></div><div style="text-align:center">'+array_data[current]['count_success']+'/'+array_data[current]['count_danger']+'</div></td></tr>';
	}
	html_code += '</tbody>';
	html_code += '</table>';
	return html_code;
}
//конец функции

/*
 * функция загрузки окна для изменения даты
 * Vadim GRITSENKO
 * 20150708
 */
Mentor.window_change_date = function (id_graph){
	$('.datepicker').datepicker('destroy');
	
	parameters_dialog = JSON.parse(JSON.stringify(default_parameters_dialog));
	parameters_dialog.title = 'Изменить даты';
	parameters_dialog.margin = "auto";
	parameters_dialog.position = 'top';		
	parameters_dialog.modal = true;
	
	content = '<div class="form-inline text-center"> C - '+'<input type="text" style="width:25%" class="form-control input-sm datepicker" id="start_date" value ="'+Mentor.report_date.start_date+'"/> по - '+'<input type="text" class="form-control input-sm datepicker" style="width:25%" id="end_date" value ="'+Mentor.report_date.end_date+'"/>'+'<br><div class="padding_top_5"><button class="btn btn-default btn-xs" onclick="Mentor.update_graph(\''+id_graph+'\')">Обновить граф</button></div></div>';
	create_dialog(parameters_dialog,content,'save_window');	
	init_datepicker();
}
//конец функции

/*
 * функция получения html-кода select опций
 * Vadim GRITSENKO
 * 20150529
 */
Mentor.get_select_parser_version = function (options){
	select_html = '<b>Версия парсера </b><select class="" id="parser_version">';
	select_html += '<option value=""></option>';
	for (attribute in options){
		select_html += '<option value="'+options[attribute]['value']+'">'+options[attribute]['name']+'</option>';
	}
	select_html += '</select>'
	return select_html;
}
//конец функции

/*
 * функция загрузки окна для изменения даты
 * Vadim GRITSENKO
 * 20150708
 */
Mentor.update_graph = function (id_graph){
	Mentor.report_date = {'start_date':($('#start_date').val()!=''?$('#start_date').val():Mentor.report_date.start_date),'end_date':($('#end_date').val()!=''?$('#end_date').val():Mentor.report_date.end_date)};
	Mentor['load_data_'+id_graph]();
	$('#save_window').dialog('close');
}
//конец функции

/*
 * изменение парсер-версии
 * Vadim GRITSENKO
 * 20150710
 */
Mentor.update_parser_version = function (obj, id_graph){
	Mentor.parser_version = $(obj).val();
	Mentor['load_data_'+id_graph]();
}
//конец функции

/*
 * функция инициализации элементов и объектов страницы
 * Vadim GRITSENKO
 * 20150527
 */
Mentor.edit_form = function (form_name, title, id){
	var html = $.ajax({
		url: Mentor.base_url+"index.php/qcore/ajax/edit_form/mentor/"+form_name+"/"+id,
		type: "POST",
	}).done(function (response, textStatus, jqXHRб){
	
		parameters_dialog = JSON.parse(JSON.stringify(default_parameters_dialog));
		parameters_dialog.title = title;
		parameters_dialog.position = "absolute";
		parameters_dialog.margin = "auto";
		parameters_dialog.width = '500';
		parameters_dialog.height = '500';
		parameters_dialog.position = 'top';		
		parameters_dialog.modal = true;
		
		content = '<div>'+response+'</div>';
		create_dialog(parameters_dialog,content,'save_window');	
		
		$('.paging_full_numbers').css({'float': 'left', 'clear': 'both'})
	});
}
//конец функции

/*
 * функция инициализации элементов и объектов страницы
 * Vadim GRITSENKO
 * 20150527
 */
Mentor.load_form_create = function (table_name, title){
	var html = $.ajax({
		url: Mentor.base_url+"index.php/qcore/ajax/load_form/mentor/"+table_name,
		type: "POST",
	}).done(function (response, textStatus, jqXHRб){
		parameters_dialog = JSON.parse(JSON.stringify(default_parameters_dialog));
		parameters_dialog.title = title;
		parameters_dialog.width = '500';
		
		content = '<div>'+response+'</div>';
		create_dialog(parameters_dialog,content,'save_window');	
		
		if ($('#url_params').length > 0 ){$('#url_params').val($(location).attr('href').split("/index.php/").splice(1).join("/"));}
		$('.paging_full_numbers').css({'float': 'left', 'clear': 'both'})
	});
}
//конец функции

/*
 * функция инициализации элементов и объектов страницы
 * Vadim GRITSENKO
 * 20150527
 */
Mentor.load_report_list_analize = function (name_list, title, parameters){
	parameters_query = parameters || [];
	var html = $.ajax({
		url: Mentor.base_url+"index.php/mentor/ajax/load_table/mentor/"+name_list,
		type: "POST",
		data: {'parameters':parameters_query}
	}).done(function (response, textStatus, jqXHRб){
	
		parameters_dialog = JSON.parse(JSON.stringify(default_parameters_dialog));
		parameters_dialog.title = title;
		parameters_dialog.position = "absolute";
		parameters_dialog.margin = "auto";
		parameters_dialog.width = window.innerWidth * 0.9;
		parameters_dialog.height = window.innerHeight * 0.9;
		parameters_dialog.modal = true;
		
		content = '<div>'+response+'</div>';
		create_dialog(parameters_dialog,content,'save_window');	
		
		$('.paging_full_numbers').css({'float': 'left', 'clear': 'both'})
	});
}
//конец функции

/*
 * функция загрузка данных по COMA/TAM
 * Vadim GRITSENKO
 * 20150709
 */
Mentor.load_data_coma_tam = function (type_coma_tam, id_element, title){
	//record_check_history('situation');
	var title = title;
	change_class('btn_'+type_coma_tam, 'list_'+id_element);
	var html = $.ajax({
		url: Mentor.base_url+"index.php/mentor/ajax/load_table/mentor/list_" + type_coma_tam,
		type: "POST",
		data: {'parameters': {'id_element': id_element}}
	}).done(function (response, textStatus, jqXHRб){
		$('#data_reports').html('<h3 class="text-primary">'+title+'</h3>'+'<div>'+response+'</div>');
		$('.dataTable').width('100%');
	});
}
//конец функции


/*
 * функция создания диалогового окна
 * Vadim GRITSENKO
 * 20150610
 */
function create_dialog(parameters,content,id){
	var dialog = CFUtil.dialog.create(id,parameters);
	if ( dialog ){
		$(dialog).html(content);
	}
}
// конец функции

/*
 * функция демонстрации загрузчик
 * Vadim GRITSENKO
 * 20150803
 */
Mentor.add_loader = function (){
	$('#content_div').addClass('spoiler');
	$('body').append('<div class="cssload-loader-inner" id="loader_div"><div class="cssload-cssload-loader-line-wrap-wrap"><div class="cssload-loader-line-wrap"></div></div><div class="cssload-cssload-loader-line-wrap-wrap"><div class="cssload-loader-line-wrap"></div></div><div class="cssload-cssload-loader-line-wrap-wrap"><div class="cssload-loader-line-wrap"></div></div><div class="cssload-cssload-loader-line-wrap-wrap"><div class="cssload-loader-line-wrap"></div></div><div class="cssload-cssload-loader-line-wrap-wrap"><div class="cssload-loader-line-wrap"></div></div></div>');
}
// конец функции

/*
 * функция демонстрации загрузчик
 * Vadim GRITSENKO
 * 20150803
 */
Mentor.remove_loader = function (){
	$('#loader_div').remove();
	$('#content_div').removeClass('spoiler');
}
// конец функции

/*
 * функция загрузки анализа по данному сообщению
 * Vadim GRITSENKO
 * 20150528
 */
var situation_type, array_sim_id, sentences, data_sentence
Mentor.run_analize_sms = function (id_sms, type){
	Mentor.add_loader();
	$('#cell_analize_sms').html('<iframe frameBorder="0" id="iframe_analize" src="'+Mentor.base_url+'../decart/runDecartParse.php?limit=1&offset=0&id='+id_sms+'&type='+type+'" style="width:100%; height:100%"></iframe>');
	$('iframe#iframe_analize').load(function(){
		Mentor.remove_loader();

		$('tbody[hide="true"]').attr('class','hide');

		situation_type = []
		$('iframe#iframe_analize').contents().find('.orig_msg_all_msg p').next('ol').children('li').each(function(){
			situation_type[situation_type.length] = $(this).html()
		})
		$(this).contents().find('div.orig_msg_2_all_msg,button.btn_content,script').remove();
		$(this).contents().find('div.orig_msg_1_all_msg').children().each(function (){
			if ($(this).is('hr')){
				return false;
			}
			$(this).remove();
		})
		
		data_sentence = [];
		$(this).contents().find('.item_all_msg').children().each(function (){
			if ($(this).attr('class') == 'sentence'){
				data_sentence[data_sentence.length] = {'sentence' : $(this).html(), 'events': []};
			}
			if ($(this).attr('class') == 'list_one'){	
				events = $(this).find('.signature_sensparser_methods').text().split(' Семантический идентификатор: ');
				events.splice(0,1)
				data_sentence[data_sentence.length-1]['events'] = events;
			}
		});

		Mentor.load_data_form(Mentor.get_code_sim_id(data_sentence), id_sms);
	})
}
//конец функции

/*
 * функция загрузки симантичсеких id
 * Vadim GRITSENKO
 * 20150528
 */
Mentor.load_data_form = function (array_code_sim_id, id_sms){

	var html = $.ajax({
		url: Mentor.base_url+"index.php/mentor/get_attritube",
		type: "POST",
		data: {code: array_code_sim_id.join('|'), fk_sms: Mentor.fk_sms, fk_email: Mentor.fk_email}
	}).done(function (response, textStatus, jqXHRб){
		result = JSON.parse(response);
		if (result.result == 1){
			array_attr_type = result.array_attr_type;
			options_attributes = Mentor.get_html_options_select(JSON.parse(Mentor.options_attributes));
			options_event_type = Mentor.get_html_options_select(JSON.parse(Mentor.options_event_type));
			options_parser_version = Mentor.get_html_parser_select(result.parser_version);

			var html_text = '<table style="width:100%" class="table_attritubes">';

			html_text += '<tr class="warning" view_tr="parser_version"><td style="font-weight:bold;font-size: 16px">'+' Парсер - версия '+'</div>'+options_parser_version+'</td></tr>';
			
			for(current_sit in situation_type){
				html_text += '<tr class="warning" view_tr="situation_type"><td style="font-weight:bold;font-size: 16px" situation_type="'+situation_type[current_sit]+'">'+' Тип НС - '+situation_type[current_sit]+'</div>'+options_attributes+'<br><textarea placeholder="Замечания" class="hide" style="width:100%;"></textarea>'+'</td></tr>';
			}
			
			var html_attr_type = [];
			
			for (cur_sentence in data_sentence){
				html_text += '<tr><td>'+'<div class="text_sentence">'+data_sentence[cur_sentence]['sentence']+'</div>'+'</td></tr>';
				array_events = data_sentence[cur_sentence]['events'];
				for (cur_event in array_events){
					
					html_attr_type[array_events[cur_event]['sim_id_code']] = get_attribute_type_event(array_events[cur_event]['type_event'] , array_attr_type , options_attributes, array_events[cur_event]['sim_id_code']);
					
					html_text += '<tr class="type_event"><td sim_id_e_t="'+array_events[cur_event]['sim_id_code']+'" style="font-weight:bold;font-size:13px" id_type = "'+html_attr_type[array_events[cur_event]['sim_id_code']]['id_type']+'">'+html_attr_type[array_events[cur_event]['sim_id_code']]['name_type'] + ' - ' + array_events[cur_event]['sim_id_code']+' ('+array_events[cur_event]['type_event']+')'+options_event_type+'<br><textarea placeholder="Замечания" class="hide" style="width:100%;"></textarea>'+'</td></tr>';
					
					html_text += html_attr_type[array_events[cur_event]['sim_id_code']]['html_attr'];
					html_text += '<tr><td><hr size="50" color="blue" style="padding:0;margin-top:0;margin-bottom:0px;border:1px solid blue"></td></tr>';
				}
			}

			html_text += '<tr view_tr="setense"><td style="font-weight:bold;font-size: 14px">'+'Разделение на предложения'+options_attributes+'<br><textarea placeholder="Замечания" class="hide" style="width:100%;"></textarea>'+'</td></tr>';
			html_text += '<tr view_tr="unrecognized_events"><td style="font-weight:bold;font-size: 14px">'+'Нераспознанные события'+options_attributes+'<br><textarea placeholder="Замечания" class="hide" style="width:100%;"></textarea>'+'</td></tr>';
			html_text += '<tr class="tr_action"><td style="text-align:center; font-weight:bold">'+list_coma_checkox(result.list_coma)+'</td></tr>';
			html_text += '<tr class="tr_action"><td style="text-align:center; font-weight:bold"><button type="button"  class="btn btn-success" onclick="Mentor.save_analize()"><span class="glyphicon glyphicon-floppy-save"></span> Сохранить </button></td></tr>';
			html_text += '<tr class="tr_action"><td style="text-align:center; font-weight:bold"><div><input type="checkbox" id="is_test"/> <span onclick="choose_coma(this)">Тестовый вариант</span>  </div></td></tr>';
			
			html_text += '</table>';
			$('#div_sim_id').html(html_text);
			
			Mentor.initial_analysis('iframe');
		}
	});

}
//конец функции

/*
 * функция загрузки симантичсеких id
 * Vadim GRITSENKO
 * 20150528
 */
Mentor.get_code_sim_id = function (array_sim_id){
	array_code_sim_id = [];
	for (cur_sentence in data_sentence){
		array_event = data_sentence[cur_sentence]['events'];
		for (cur_id in array_event){
			path_code = array_event[cur_id].split('-');
			array_code_sim_id[array_code_sim_id.length] = path_code[2];
			data_sentence[cur_sentence]['events'][cur_id] = {'sim_id_code':data_sentence[cur_sentence]['events'][cur_id],'type_event':path_code[2]};
		}
	}
	return array_code_sim_id;
}
//конец функции

/*
 * функция первичного анализа
 * Vadim GRITSENKO
 * 20150630
 */
Mentor.initial_analysis = function (tag_parser){

	$('[view_tr="attribute"]').each(function (){
		if (tag_parser == 'iframe'){
			parser_analize = $('iframe').contents().find('li.signature_sensparser_methods:contains("Семантический идентификатор: ' + $(this).attr('sim_id_code') + '")').next('ul').find('li:contains("' + $(this).find('span.span_name_attr').html() + ' (")').find('span').html() || '';
		}
		else {
			parser_analize = $('#cell_analize_sms').find('li.signature_sensparser_methods:contains("Семантический идентификатор: ' + $(this).attr('sim_id_code') + '")').next('ul').find('li:contains("' + $(this).find('span.span_name_attr').html() + '")').find('span').html() || '';
		}
		if (parser_analize != '') {
			$(this).find('span.span_name_attr').append(' <br><b>(' + parser_analize + ')</b>').next('select').val('ПРАВ').trigger('onchange');
		}
	})

}
//конец функции

/*
 * функция генерации кода списка coma в виде checkbox
 * Vadim GRITSENKO
 * 20150624
 */
list_coma_checkox = function (array_coma){
	if (array_coma.length > 0){
		html_code = '<ul>';
		for (current in array_coma){
			html_code += '<li><div><input type="checkbox" class="is_coma" view_element="analize_coma" id_coma="'+array_coma[current]['coma_id']+'"/>&nbsp;<span onclick="choose_coma(this)">'+array_coma[current]['coma_name']+'</span>&nbsp;&nbsp;</div></li>';
		}
		html_code += '</ul>';
		return html_code;
	}
	else {return 'Нет в базе coma';}
}
//конец функции

choose_coma = function (obj){
	var checkBoxes = $(obj).closest('div').find('input[type="checkbox"]');
        checkBoxes.prop("checked", !checkBoxes.prop("checked"));
}

/*
 * функция получения html-кода select опций
 * Vadim GRITSENKO
 * 20150529
 */
Mentor.get_html_options_select = function (options){
	select_html = '<select class="pull-right" onchange="Mentor.set_view_attribute(this)">';
	for (attribute in options){
		select_html += '<option value="'+options[attribute]['value']+'">'+options[attribute]['name']+'</option>';
	}
	select_html += '</select>'
	return select_html;
}
//конец функции

/*
 * функция загрузки дерева задач
 * Vadim GRITSENKO
 * 20150720
 */
Mentor.load_tree = function (data_view){
	change_class('btn_tree_'+data_view, 'list_tam');
	var html = $.ajax({
		url: Mentor.base_url+"index.php/mentor/load_data_tree",
		type: "POST",
		data: {'data_view' : data_view}
	}).done(function (response, textStatus, jqXHRб){
		result = JSON.parse(response);
		$('#data_reports').html('<h3> Дерево задач (графический вид) </h3>'+'<div id="graph_tree"></div>')
		resize_window()
		Mentor.building_graph_tree(result.data_tree, 'graph_tree')
	})
}
//конец функции

/*
 * функция получения html-кода select опций
 * Vadim GRITSENKO
 * 20150529
 */
Mentor.get_html_parser_select = function (parser_version){
	select_html = '<input type="text" class="pull-right" readonly id="parser_version" value="' + parser_version + '"/>';
	return select_html;
}
//конец функции

/*
 * функция задания атрибуту класса и комментария (при необходимости)
 * Vadim GRITSENKO
 * 20150529
 */
Mentor.set_view_attribute = function (obj){
	switch($(obj).val()) {
		case 'НД':
			$(obj).closest('tr[view_tr]').attr('class','tr_no_data');
			$(obj).closest('tr').find('textarea:first').attr('class','hide');
			break;
		case 'ПРАВ':
			$(obj).closest('tr[view_tr]').attr('class','tr_correct');
			$(obj).closest('tr').find('textarea:first').attr('class','hide');
			break;
		case 'НЕПР':
			$(obj).closest('tr[view_tr]').attr('class','tr_not_correct');
			$(obj).closest('tr').find('textarea:first').attr('class','show');
			break;
		case 'СОВТ':
			$(obj).closest('tr').find('textarea:first').attr('class','show');
			break;
		case 'НЕРАСП':
			/*$('[sim_id_code="'+$(obj).closest('td').attr('sim_id_e_t')+'"]').each(function(){
				$(this).find('select').val('НЕРАСП');
				Mentor.set_view_attribute($(this).find('select'))
			})*/
			$(obj).closest('tr[view_tr]').attr('class','tr_not_rego');
			$(obj).closest('tr').find('textarea:first').attr('class','show');
			break;
	}
}
//конец функци

/*
 * функция получения списка атрибутов по названию типа события
 * Vadim GRITSENKO
 * 20150529
 */
get_attribute_type_event = function (current_type_abbrev, array_attr_type, options_select, sim_id_code){
	flag_record = false;
	html_attr = '';
	for (cur_attr in array_attr_type){
		if ( flag_record == true && array_attr_type[cur_attr]['type_abbrev'] != current_type_abbrev ) break;
		if ( array_attr_type[cur_attr]['type_abbrev'] == current_type_abbrev ) {
			flag_record = true;
			name_type = array_attr_type[cur_attr]['type_name'];
			id_type = array_attr_type[cur_attr]['type_id'];
			html_attr += '<tr class="tr_no_data" view_tr="attribute" sim_id_code="'+sim_id_code+'"><td attr_id="'+array_attr_type[cur_attr]['attr_id']+'"><span class="span_name_attr">'+array_attr_type[cur_attr]['attr_name']+'</span>'+options_select+'<br><textarea placeholder="Замечания" class="hide" style="width:100%;"></textarea>'+'</td></tr>';
		}
	}
	return {html_attr : html_attr, name_type : name_type, id_type : id_type};
}
//конец функции

/*
 * функция сохранения результатов анализа
 * Vadim GRITSENKO
 * 20150529
 */
Mentor.save_analize = function (){
	if (confirm('Вы действительно хотите сохранить')){
		var data = {
				analize: {
					fk_sms: Mentor.fk_sms,
					fk_email: Mentor.fk_email,
					is_valid: (($('select option:selected[value="НЕПР"]').length>0 || $('select option:selected[value="НЕРАСП"]').length>0|| $('select option:selected[value="СОВТ"]').length>0)?false:true),
					is_test: $('#is_test').prop("checked"),
				},
				result: {
					parser_extract: $('iframe#iframe_analize').contents().find('.item_all_msg').html(),
					parser_version: $('#parser_version').val(),
					setense_result: $('tr[view_tr="setense"]').find('select').val(),
					setense_comment: ($('tr[view_tr="setense"]').find('select').val() == 'НЕРАСП' || $('tr[view_tr="setense"]').find('select').val() == 'НЕПР')?$('tr[view_tr="setense"]').find('textarea').val():null,
					unrecognized_events_result: $('tr[view_tr="unrecognized_events"]').find('select').val(),
					unrecognized_events_comment: ($('tr[view_tr="unrecognized_events"]').find('select').val() == 'НЕРАСП' || $('tr[view_tr="unrecognized_events"]').find('select').val() == 'НЕПР')?$('tr[view_tr="unrecognized_events"]').find('textarea').val():null,
				},
				analize_attr: Mentor.analize_attr(),
				analize_coma: Mentor.analize_coma(),
				analize_event: Mentor.analize_event(),
				analize_situation: Mentor.analize_situation(),
			}
		var html = $.ajax({
			url: Mentor.base_url+"index.php/mentor/save_attr",
			type: "POST",
			data: {data: data}
		}).done(function (response, textStatus, jqXHRб){
			result = JSON.parse(response);
			if (result.result == 1){
				//alert('Успешно сохранено');
				//location.reload();
				location.href = Mentor.base_url+"index.php/mentor/analize_view/"+result.id_savers.analize+"/"+(Mentor.fk_sms != null?'sms':'emails')
			}
			else {
				alert('Не удалось сохранить. Ошибка произошла на шаге - '+result.step);
			}
		});
	}
}
//конец функции

/*
 * функция сохранения результатов анализа
 * Vadim GRITSENKO
 * 20150529
 */
Mentor.analize_attr = function (){
	data_analize_attr = []
	$('tr[view_tr="attribute"]').each(function (){
		data_analize_attr[data_analize_attr.length] = {
				sim_id_event : $(this).attr('sim_id_code'),
				fk_attr : $(this).find('td').attr('attr_id'),
				result : $(this).find('select').val(),
				comment : ($(this).find('select').val() == 'НЕРАСП' || $(this).find('select').val() == 'НЕПР')?$(this).find('textarea').val():null,
			}
	})
	return (data_analize_attr.length>0?data_analize_attr:null);
}
//конец функции

/*
 * функция сохранения результатов анализа
 * Vadim GRITSENKO
 * 20150529
 */
Mentor.analize_coma = function (){
	data_analize_coma = []
	$('.is_coma:checked').each(function (){
		data_analize_coma[data_analize_coma.length] = {
				fk_coma : parseInt($(this).attr('id_coma')),
			}
	})
	return (data_analize_coma.length>0?data_analize_coma:null);
}
//конец функции

/*
 * функция сохранения результатов анализа
 * Vadim GRITSENKO
 * 20150529
 */
Mentor.analize_event = function (){
	data_analize_event = []
	$('tr.type_event').each(function (){
		data_analize_event[data_analize_event.length] = {
				sim_id_event : $(this).find('td').attr('sim_id_e_t'),
				id_type : parseInt($(this).find('td').attr('id_type')),
				result : $(this).find('select').val(),
				comment : ($(this).find('select').val() == 'СОВТ' || $(this).find('select').val() == 'НЕПР')?$(this).find('textarea').val():null,
			}
	})
	return (data_analize_event.length>0?data_analize_event:null);
}
//конец функции

/*
 * функция сохранения результатов анализа по ситуации
 * Vadim GRITSENKO
 * 20150611
 */
Mentor.analize_situation = function (){
	data_analize_situation = []
	$('tr[view_tr="situation_type"]').each(function (){
		data_analize_situation[data_analize_situation.length] = {
				situation_type : $(this).find('td').attr('situation_type'),
				result : $(this).find('select').val(),
				comment : ($(this).find('select').val() == 'НЕРАСП' || $(this).find('select').val() == 'НЕПР')?$(this).find('textarea').val():null,
			}
	})
	return (data_analize_situation.length>0?data_analize_situation:null);
}
//конец функции

/*
 * функция загружающая страницу нового анализа
 * Vadim GRITSENKO
 * 20150611
 */
Mentor.window_pass_param = function (id, view_message){
	window.open(Mentor.base_url + 'index.php/mentor/analize_'+view_message+'/'+id);
}
//конец функции

/*
 * функция сохранения результатов анализа
 * Vadim GRITSENKO
 * 20150529
 */
Mentor.load_analize_page = function (id_analize, type){
	window.open(Mentor.base_url + 'index.php/mentor/analize_view/'+id_analize+'/'+type, "_blank", "toolbar=yes, scrollbars=yes, resizable=yes, top=0, left=0, width=1200, height=800");
}
//конец функции

/*
 * функция демонстрации данных по пользоваелю
 * Vadim GRITSENKO
 * 20150604
 */
Mentor.show_data_user = function (id_user){
	location.href = Mentor.base_url+"index.php/mentor/load_list_reports/" + id_user
}
//конец функции

/*
 * функция демонстрации сигнатуры
 * Vadim GRITSENKO
 * 20150814
 */
Mentor.show_signature = function (id_message, view_messsage){
	window.open(Mentor.base_url+'../decart/runDecartParse.php?limit=1&offset=0&id='+id_message+'&type='+view_messsage);
	//location.href = ('https://10.0.0.11/sensparser/signature22.1.php?limit=1&offset=0&id='+id_message+'&type=sms');
}
//конец функции

/*
 * функция демонстрации данных по пользоваелю
 * Vadim GRITSENKO
 * 20150604
 */
show_hide_analize = function (){
	if ($('#cell_analize_sms').attr('class') == 'hide'){
		$('#cell_analize_sms').removeClass('hide');
		$('#btn_show_hide_parser').html(' Скрыть исходный вывод парсера ');
	}
	else {
		$('#cell_analize_sms').addClass('hide');
		$('#btn_show_hide_parser').html(' Показать исходный вывод парсера ');
	}
}
//конец функции

/*
 * функция построения дерева
 * Vadim GRITSENKO
 * 20150720
 */
Mentor.building_graph_tree = function (data_tree, selector) {
	var container = document.getElementById(selector);
	
	edges = [];
	nodes = [];
	for (node in data_tree){
		nodes[nodes.length] = {
				id: parseInt(data_tree[node]['id']), 
				label: data_tree[node]['name'].substring(0,10),
				title: data_tree[node]['name'],
				level: parseInt(data_tree[node]['level'])
			};
		edges[edges.length] = {from: parseInt(data_tree[node]['id']), to: parseInt(data_tree[node]['parent'])}
	}
	data = {nodes, edges};
	
	var options = {
		tooltip: {
			delay: 300,
			fontSize: 12,
			color: {
				background: "#BBDEFB"
			}
		},
        hierarchicalLayout: {
			direction: 'UD',
			sortMethod: "hubsize"
        },
	};
	tree = new vis.Network(container, data, options);
	return tree;
}
// конец функции

/*
 * функция построения графика
 * Vadim GRITSENKO
 * 20150603
 */
Mentor.building_graph = function (data_graph, selector) {
	var container = document.getElementById(selector);

	var dataset = new vis.DataSet(items);
	
	var items = data_graph['db_data'];	
	
	var groups = new vis.DataSet();

		for ( group in data_graph['groups']){
			groups.add(data_graph['groups'][group]);
		}
	
	var options = data_graph['graph_options'];

	date = Mentor.report_date.start_date.split("-");
	date = new Date(date[2], date[1]-1, date[0]);
	options.start = new Date(date);

	date = Mentor.report_date.end_date.split("-");
	date = new Date((Mentor.report_date.start_date==Mentor.report_date.end_date?parseInt(date[2])+1:date[2]), date[1]-1, date[0]);
	options.end = new Date(date);

	options.width = $('#'+selector).width()
	options.height = $('#'+selector).height()
	graph2d = new vis.Graph2d(container, items, groups, options);
	/*graph2d.container_selector = selector;
	graph2d.on("resize", function() {
		graph2d.setOptions({height: $('#'+selector).height()})
		graph2d.setOptions({height: $('#'+selector).height()})
	});*/
	$('svg:parent(\'.LineGraph\'):parent(\'#'+selector+'\'):first').append($('#'+selector).find('.point_value'))
	return graph2d;
}
// конец функции