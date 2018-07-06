/* 

 */
 


var MONITORING = {
	base_url: null //переменная для хранения адреса сайта
};
var graph2d_array = new Array();
var detal_graph, plot=null;

/*	
 * функция инициализации
 * Vadim GRITSENKO
 * 20141108
 */
var default_parameters_dialog = {
		title: 'Subjects', 
		autoOpen: false,
		height: "auto",
		position: "right top",
		width: 250,
		modal: true		
	};

/*
 * функция инициализации данных
 * Vadim GRITSENKO
 * 20141203
 */
MONITORING.init = function (){
	
	window.addEventListener( 'resize', on_window_resize, false );
	
}
//конец функции

/*
 * функция изменения ширины страницы
 * Vadim GRITSENKO
 * 20141105
 */
function on_window_resize() {

	$('#div_dash_board').height( $(window).height() - 60 ); //- $('#sub_panel').height()
	if (MONITORING.data.format_list){
		$('#div_dash_board').height( MONITORING.data.format_list.height ).width( MONITORING.data.format_list.width ); //- $('#sub_panel').height()
		$('body').width( MONITORING.data.format_list.width ).height( MONITORING.data.format_list.width ); //- $('#sub_panel').height()
	}
	$('.div_graph').each(function(){
		$(this).parent().height($(this).parent().parent().height() - $(this).parent().siblings('.panel-footer').outerHeight() - $(this).parent().siblings('.panel-heading').outerHeight() - 10 );
		$(this).height($(this).parent().height());
	})	
	for (var i in graph2d_array){
		graph2d_array[i]._callbacks.resize[0]();
	}

	if (plot != null) {
		plot.replot();
		set_style(plot);
		$('.jqplot-xaxis-tick').addClass('name_statistic');
	}
}
// конец функции

/*
 * функция для генерирования пространства данных
 * Vadim GRITSENKO
 * 20141105
 */
MONITORING.generate_area_data = function (array_cell) {

	array_cell = this.data.template;
	var text_html = '',
        height_flag = false,
        h_counter = 1,
        row_height = '355px';

    if(array_cell.length == 2){
        height_flag = true;
    }


	for (var i in array_cell){

        if(height_flag && h_counter == 2){
            row_height = 'calc(100% - 355px)';
        }
		if(array_cell.length == 1) row_height = 'calc(100% - 10px)';

		text_html += '<div class="row show-grid" style="height:'+row_height+';" >';
		for (var j in array_cell[i]){
			text_html += '<div class="'+array_cell[i][j]['class']+' cell" >';
			text_html += '<div class="'+array_cell[i][j]['style']+'" style="height:100%">';
			//console.log(this.data.config_template[array_cell[i][j]['config_id']]);
			text_html += get_title_field(this.data.config_template[array_cell[i][j]['config_id']],i,j);

			text_html += '<div class="panel-body"><div id="row-'+i+'_column-'+j+'" class="div_graph"></div></div>';
			if (this.data.config_template[array_cell[i][j]['config_id']] && this.data.config_template[array_cell[i][j]['config_id']]['footer_elements']){
                text_html += '<div class="panel-footer">'+this.get_button_panel(this.data.config_template[array_cell[i][j]['config_id']]['footer_elements'])+'</div>';
            }
			text_html += '</div>';
			text_html += '</div>';
		}
		text_html += '</div>';

        h_counter++;
	}
	$('#div_dash_board').html(text_html);
	
}
// конец функции


/*
 * функция построения графика
 * Vadim GRITSENKO
 * 20141204
 */
MONITORING.init_content = function (array_cell) {
	

	array_cell = MONITORING.data.template;

	for (var i in array_cell){
		for (var j in array_cell[i]){
			if (!MONITORING.data.config_template[array_cell[i][j]['config_id']]) continue
			if (MONITORING.data.config_template[array_cell[i][j]['config_id']]['type'] == 'graph'){
				$('#row-'+i+'_column-'+i).parent().height($('#row-'+i+'_column-'+i).parent().parent().height() - $('#row-'+i+'_column-'+i).parent().siblings('.panel-footer').outerHeight() - $('#row-'+i+'_column-'+i).parent().siblings('.panel-heading').outerHeight());
				$('#row-'+i+'_column-'+i).height($('#row-'+i+'_column-'+i).parent().height());
				MONITORING.data.config_template[array_cell[i][j]['config_id']].graph_options.graphHeight  = $('#row-'+i+'_column-'+j).height() - 57;

				graph2d_array[graph2d_array.length] = MONITORING.building_graph(MONITORING.data.config_template[array_cell[i][j]['config_id']],'row-'+i+'_column-'+j);

				MONITORING.data.config_template[array_cell[i][j]['config_id']].position_graph = graph2d_array.length-1;
			}
			else if (MONITORING.data.config_template[array_cell[i][j]['config_id']]['type'] == 'link' && MONITORING.data.mode != 'print'){
				MONITORING.building_link(MONITORING.data.config_template[array_cell[i][j]['config_id']],'row-'+i+'_column-'+j);
			}
			else if (MONITORING.data.config_template[array_cell[i][j]['config_id']]['type'] == 'statistic'){
				MONITORING.building_statistic(MONITORING.data.config_template[array_cell[i][j]['config_id']],'row-'+i+'_column-'+j);
			}
			else if (MONITORING.data.config_template[array_cell[i][j]['config_id']]['type'] == 'gystogram'){
				$('#row-'+i+'_column-'+j).css({height: $('#row-'+i+'_column-'+j).parent().parent().height() - $('#row-'+i+'_column-'+j).closest('.panel').children('.panel-heading').height()-5});
				MONITORING.building_gystogramm(MONITORING.data.config_template[array_cell[i][j]['config_id']], 'row-'+i+'_column-'+j);
			}
			else if (MONITORING.data.config_template[array_cell[i][j]['config_id']]['type'] == 'list_data'){
				MONITORING.building_list_data(MONITORING.data.config_template[array_cell[i][j]['config_id']], 'row-'+i+'_column-'+j);
			}
			else if (MONITORING.data.config_template[array_cell[i][j]['config_id']]['type'] == 'inner_html'){
				MONITORING.build_inner_html(MONITORING.data.config_template[array_cell[i][j]['config_id']], 'row-'+i+'_column-'+j);
			}
			else if (MONITORING.data.config_template[array_cell[i][j]['config_id']]['type'] == 'image_php'){
				MONITORING.build_image_url(MONITORING.data.config_template[array_cell[i][j]['config_id']], 'row-'+i+'_column-'+j);
			}
			
		}
	}

}

set_style = function(){
	$('.jqplot-xaxis-tick').addClass('name_statistic');
			$('.jqplot-yaxis-tick').css({
					'position':'absolute',
					'right':'0',
					'text-align':'right',
					'right':'10px',
					'margin-right':'0'
				});
	$(".jqplot-xaxis-tick").css({'font-size':'0'});
	if(plot._sumx == 0) $('.div_graph.jqplot-target:last>.jqplot-point-label').css('left', parseInt($('.jqplot-yaxis').css('width')) + 5);
}

// конец функции
MONITORING.get_iframe = function(){

}

MONITORING.build_inner_html = function(config, selector,callback){
	
	$('#'+selector).css({"height": $('#'+selector).parent().parent().height() - 17, 'overflow-y': 'hidden'})
	var inner_html = '';
	var query = $.ajax ({
		url: MONITORING.base_url+'index.php/monitoring/block_preview/',
		type:'POST',
		data: {'id': config.url}
	});
	query.done(function (response, textStatus, jqXHRб){
		$('#'+selector).html(response);
		try {
			callback.call();
		}catch (e){console.warn()}
	});
}


MONITORING.build_image_url = function(config, selector,callback){
	$('#'+selector).css({"height": $('#'+selector).parent().parent().height()-22, 'overflow': 'auto'}).html("<img src='"+config.image_url+"' ></img>");
}


/*
 * функция построения группы кнопок
 * Vadim GRITSENKO
 * 20141205
 */
MONITORING.building_link = function (data_link, selector) {

	text_html = '';
	array_element = data_link['elements']
	for (var i in array_element){
		text_html += '<button type="'+array_element[i]['type']+'" id="'+array_element[i]['id']+'" class="'+array_element[i]['style']+'" title="'+array_element[i]['title']+'" onclick="location.href=\''+MONITORING.base_url+'index.php/'+array_element[i]['onclick']+'">'+array_element[i]['name']+'</button>';
	}
	$('#'+selector).html(text_html).css('padding','5px');
	
}
// конец функции

/*
 * функция построения списка статистики
 * Vadim GRITSENKO
 * 20141205
 */
MONITORING.building_statistic = function (data_statistic, selector) {
	
	text_html='<table class="table table-condensed table-hover table-bordered">';
	text_html+='<tbody>';
	for (var i in data_statistic['elements']){
		if (data_statistic['elements'][i]['title_add']) {
			$('#'+selector).parent().parent().children('.panel-heading').children('#title_name').append('  ('+data_statistic['db_data'][i]['count']+')');
			if (data_statistic['elements'][i]['hidden']) continue;
		}
		text_html += '<tr><td style="width:85%;'+(data_statistic['elements'][i]['onclick'] == ""? '' :'cursor:pointer')+'"  onclick="'+data_statistic['elements'][i]['onclick']+'"';
		text_html += '><span  style="color: #ffb2b2;"><i class="fa fa-folder-open" aria-hidden="true"></i></span>&nbsp;&nbsp;<i class="name_statistic">'+data_statistic['elements'][i]['name']+'</i></td><td style="text-align:right;" class="warning" id = "field_'+data_statistic['elements'][i]['id']+'">'+(data_statistic['db_data'][i] != null ? data_statistic['db_data'][i]['count'] : ' - ')+'</td></tr>';
	}
	text_html+='</tbody>';
	text_html+='</table>'
	$('#'+selector).html(text_html).css({'padding':'5px', 'overflow': 'auto'});
	$('#'+selector).parent().height ($('#'+selector).parent().parent().height() - 65);
}
// конец функции

/*
 * функция построения графика
 * Vadim GRITSENKO
 * 20141204
 */
MONITORING.building_graph = function (data_graph,selector) {

	var container = document.getElementById(selector);

	var dataset = new vis.DataSet(items);
	
	var items = data_graph['db_data'];	
	
	var groups = new vis.DataSet();

		for ( group in data_graph['groups']){
			groups.add(data_graph['groups'][group]);
		}
	
	var options = data_graph['graph_options'];
	if (data_graph['db_data'].length > 1){
		var start_date = new Date(data_graph['db_data'][0]['x']);
		var end_date = new Date(data_graph['db_data'][data_graph['db_data'].length-1]['x']);
	}
	else {
		var end_date = new Date();
		var start_date = new Date(end_date - 10*24*60*60*1000);
	}
	options.start = start_date;
	options.end = end_date;
	graph2d = new vis.Graph2d(container, items, groups, options);
	graph2d.container_selector = selector;
	graph2d.on("resize", function() {
		graph2d.setOptions({height: $('#'+selector).height()})
		graph2d.setOptions({height: $('#'+selector).height()})
	});
	return graph2d;
}
// конец функции


/*
 * функция для генерирования пространства данных
 * Vadim GRITSENKO
 * 20141105
 */
MONITORING.get_button_panel = function (array_element) {

	text_html = '';
	for (var i in array_element){
		text_html += '<button type="'+array_element[i]['type']+'" id="'+array_element[i]['id']+'" class="'+array_element[i]['style']+'" title="'+array_element[i]['title']+'" onclick="'+array_element[i]['onclick']+'">'+array_element[i]['name']+'</button>';
	}
	if (text_html == '') return 'Нет опций'; //подстоить под lang
	else return text_html;

}
// конец функции


/*
 * функция обновления данных в области данных
 * Vadim GRITSENKO
 * 20141108
 */
MONITORING.update_date_field = function (id_config) {

	query = $.ajax ({
		url: MONITORING.base_url+'index.php/monitoring/update_data_field',
		type:'POST',
		data: {
				'id_config' : id_config
			}
	});
	query.done(function (response, textStatus, jqXHRб){
		result_data = JSON.parse(response);
		if (result_data.result === 1){
			MONITORING.data.config_template[id_config]['db_data'] = result_data['data'];
			if (MONITORING.data.config_template[id_config]['type'] === 'statistic') {
				for (var i in MONITORING.data.config_template[id_config]['elements']){
					$('#field_'+MONITORING.data.config_template[id_config]['elements'][i]['id']).html(MONITORING.data.config_template[id_config]['db_data'][i]['count'])
				}
			}
			else if (MONITORING.data.config_template[id_config]['type'] === 'graph') {
				graph2d_array[MONITORING.data.config_template[id_config]['position_graph']].setItems(MONITORING.data.config_template[id_config]['db_data']);
			}
		}
	});
	
}
// конец функции

/*
 * функция для генерирования шапки области данных
 * Vadim GRITSENKO
 * 20141108
 */
function get_title_field(config_element,row,column) {

	additional_component = '';
	config_element =config_element || []
	if (config_element['title'] && !(config_element['type'] == 'link' && MONITORING.data.mode == 'print')){
		additional_component = config_element['title'];//add_to_title
	}	
	if (config_element['title_add_element'] && MONITORING.data.mode != 'print'){
		additional_component += '<div class="btn-group btn-group-xs pull-right hide_print" role="group">';
		for (var i in config_element['title_add_element']){
			if (config_element['title_add_element'][i]['class']){ additional_component += '<span class=" '+config_element['title_add_element'][i]['class'] + ' btn-xs" '}
			if (config_element['title_add_element'][i]['onclick']){
				additional_component += 'onclick = "'+config_element['title_add_element'][i]['onclick'] + '" ';
			}
			if (config_element['title_add_element'][i]['title']){
				additional_component += 'title = "'+config_element['title_add_element'][i]['title'] + '" ';
			}
			additional_component += '></span>'; 
		}
		additional_component += '</div>';
	}
	if ( additional_component == '' ){
		return '';
	}
	return '<div class="panel-heading" style="'+(MONITORING.data.mode == 'print'?'font-size:11px':'')+'"><div id="title_name">'+additional_component+'</div></div>';
}
// конец функции

/*
 * функция создания диалогового окна
 * Vadim GRITSENKO
 * 20141208
 */
function create_dialog(parameters,content,id){
	var dialog = CFUtil.dialog.create(id,parameters);
	if ( dialog ){
		$(dialog).html(content);
	}
}
// конец функции

/*
 * функция создания заполнения диалогового окна
 * Vadim GRITSENKO
 * 20141208
 */
function show_detal_data(id_config){
	
	parameters_dialog = JSON.parse(JSON.stringify(default_parameters_dialog));
	parameters_dialog.title = MONITORING.data.config_template[id_config]['title'];
	parameters_dialog.position = "absolute";
	parameters_dialog.margin = "auto";
	parameters_dialog.width = window.innerWidth * 0.9;
	parameters_dialog.height = window.innerHeight * 0.9;
	parameters_dialog.modal = true;
	
	content = '<div id="dialog_config_'+id_config+'" class="div_detal_graph"></div><div><label> Установить даты от: </label><input type="text" class="datepicker" id="date_start"><label> по: </label><input type="text" class="datepicker" id="date_end"><button type="button" onclick="update_detal_graph(\''+id_config+'\')">Обновить</button></div>';
	
	create_dialog(parameters_dialog,content,'dialog_detal_data');

	MONITORING.data.config_template[id_config].graph_options.height  = $('#dialog_config_'+id_config).parent().parent().height() - 122;	
	
	detal_graph = MONITORING.building_graph(MONITORING.data.config_template[id_config],'dialog_config_'+id_config);
	detal_graph.setOptions({moveable: true});
	
	$('#date_end').val(new Date(detal_graph.range.end).getFullYear()+'-'+(new Date(detal_graph.range.end).getMonth()+1)+'-'+new Date(detal_graph.range.end).getDate())
	$('#date_start').val(new Date(detal_graph.range.start).getFullYear()+'-'+(new Date(detal_graph.range.start).getMonth()+1)+'-'+new Date(detal_graph.range.start).getDate())
	$(function() {$( ".datepicker" ).datepicker({
		dateFormat: 'yy-mm-dd' //Setting dateformat for the datepicker
	});})
	
}
// конец функции


/*
 * функция создания заполнения диалогового окна
 * Vadim GRITSENKO
 * 20141208
 */
MONITORING.build_detal_graph = function(confid){

	detal_graph = MONITORING.building_graph(confid,'detal_print');
	detal_graph.setOptions({moveable: true});
	
	$('#date_end').val(new Date(detal_graph.range.end).getFullYear()+'-'+(new Date(detal_graph.range.end).getMonth()+1)+'-'+new Date(detal_graph.range.end).getDate())
	$('#date_start').val(new Date(detal_graph.range.start).getFullYear()+'-'+(new Date(detal_graph.range.start).getMonth()+1)+'-'+new Date(detal_graph.range.start).getDate())
	$(function() {$( ".datepicker" ).datepicker({
		dateFormat: 'yy-mm-dd' //Setting dateformat for the datepicker
	});})
	
	return detal_graph;
	
}
// конец функции



/*
 * функция обновления данных детализованного графа
 * Vadim GRITSENKO
 * 20141209
 */
function update_detal_graph(id_config){
	if ($('#date_end').val() == ''){$('#date_end').datepicker("setDate" , "0");}
	if(check_date($('#date_start').val(), $('#date_end').val()) == false) {return;}

		detal_graph.setOptions({start: $('#date_start').val()});
		detal_graph.setOptions({end: $('#date_end').val()});
		
	query = $.ajax ({
		url: MONITORING.base_url+'index.php/monitoring/update_data_field',
		type:'POST',
		data: {
				'id_config' : id_config,
				'start_date' : $('#date_start').val(),
				'end_date' : $('#date_end').val()
			}
	});
	query.done(function (response, textStatus, jqXHRб){
		result_data = JSON.parse(response);
		detal_graph.setItems(result_data.data);
	});	
	

	
}
// конец функции

function get_cell_scale(max_value){
	cell_scale_max = Math.round((max_value/10)/7) * 10;
	return (cell_scale_max<10?10:cell_scale_max);	
}

function get_series_jqplot(array_series){
	full_series = []
	var date = new Date();
	for(numb in array_series){
		full_series.push({'label':eval(array_series[numb]['label'])})
	}
	return full_series;
}

/*
 * функция обновления данных детализованного графа
 * Vadim GRITSENKO
 * 20141210
 */
MONITORING.building_gystogramm = function(data_gystogramm, selector){

	if (data_gystogramm['db_data']['count'][0].length > 0){
		var date = new Date();
		if (typeof(data_gystogramm['add_to_title']) != 'undefined' && (typeof(MONITORING.mode) != 'undefined' && MONITORING.mode != 'print')) {
			$('#'+selector).parent().parent().children('.panel-heading').children('#title_name').append(eval(data_gystogramm['add_to_title']))
			$('#'+selector).css({height: $('#'+selector).closest('.panel').height() - $('#'+selector).closest('.panel').children('.panel-heading').height()-20});		
			$('#'+selector).closest('.panel').children('.panel-body').css({height: $('#'+selector).closest('.panel').height() - $('#'+selector).closest('.panel').children('.panel-heading').height()-5, width: $('#'+selector).parent().parent().width()});		
		}

		options = data_gystogramm['gyst_options'];
		if(options.series){
			options.series = get_series_jqplot(options.series);
		}
		
		if (data_gystogramm['type_graph'] == 'pie'){
			options.seriesDefaults.renderer = $.jqplot.PieRenderer;// вид графа в данном случае пирог
		
		}
		else {
			options.seriesDefaults.renderer = $.jqplot.BarRenderer;// вид графа в данном случае столбиками
			options.axes.yaxis.renderer = $.jqplot.CategoryAxisRenderer;
			if (data_gystogramm['db_data']['count'][0][0] == "number") options.axes.xaxis.tickInterval = get_cell_scale(Math.max.apply(Math,data_gystogramm['db_data']['count']));
			options.axes.yaxis["ticks"] = data_gystogramm['db_data']['ticks'];

			if (options.grid){
				options.grid.renderer = $.jqplot.CanvasGridRenderer;
				options.highlighter.tooltipContentEditor = function(str, seriesIndex, pointIndex, jqPlot) {
						return '<table class="label_marker_bars"><tr><td>' + data_gystogramm['db_data']['tooltip'][pointIndex] + '</td></tr></table> ';
				}
			}
			
		}
		
		real_height =  data_gystogramm['db_data']['count'][0].length
		
		if (data_gystogramm['db_data']['count'][0].length*real_height > $('#'+selector).height()) {
			$('#'+selector).height(data_gystogramm['db_data']['count'][0].length * real_height);
			//$('#'+selector).closest('.panel-body').css('overflow-y','scroll');
		}
		
		plot = $.jqplot(selector, data_gystogramm['db_data']['count'], options);

		/*$('#'+selector).bind('jqplotDataClick', 
			function (ev, seriesIndex, pointIndex, data) {
				eval(options['seriesDefaults']['onclick_bar']['name_func']+'('+JSON.stringify( data_gystogramm['db_data']['id'][pointIndex])+',"'+options['seriesDefaults']['onclick_bar']['url']+'")')
			}
		);*/
		/*
			max_width = 0;
			$('.jqplot-yaxis:last').children('.jqplot-yaxis-tick').each(function(){if (max_width < $(this).width()){max_width = $(this).width()};})
			console.log(max_width);
			$('.jqplot-yaxis').css({'min-width':(max_width+80)+'px'});
			$('.jqplot-yaxis').css({'width':(max_width+80)+'px !important'});
			$('.jqplot-yaxis').css({'min-width':'210px'});
		*/


		$('.jqplot-xaxis-tick').addClass('name_statistic');
		try{
			if (data_gystogramm['db_data']['count'][0] && data_gystogramm['gyst_options']['axes']['xaxis']['textAlign']) {
				$('.jqplot-yaxis-tick').addClass(data_gystogramm['gyst_options']['axes']['yaxis']['textAlign']);
			}
			else {
				$('.jqplot-yaxis-tick').css({
						'position':'absolute',
						'right':'0',
						'text-align':'right',
						'right':'10px',
						'margin-right':'0'
					});
			}
			if (data_gystogramm['gyst_options']['axes']['xaxis']['max'] == 0 && data_gystogramm['gyst_options']['axes']['xaxis']['min'] == 0) {
				$('.div_graph.jqplot-target:last>.jqplot-point-label').css('left', parseInt($('.jqplot-yaxis').css('width')) + 5);
			}
		}
		catch(e){}
		$(".jqplot-xaxis-tick").css({'font-size':'0'});
		/*
			var w = parseInt($(".jqplot-yaxis").width(), 10) + parseInt($("#chart").width(), 10);
			var h = parseInt($(".jqplot-title").height(), 10) + parseInt($(".jqplot-xaxis").height(), 10) + parseInt($("#chart").height(), 10);
			$("#chart").width(w).height(h);
		*/
		
		$('#'+selector).bind('jqplotHighlighterUnhighlight', 
			function (ev) {
				$('#customTooltipDiv').fadeOut(300);
			}
		);

		$('#'+selector).bind('resize', function(){
			plot.replot( { resetAxes: true } );
		}); 	
		//plot.replot();

		return plot;
	}
	//else {alert(1);}
}
// конец функции


/*
 * функция построения графика
 * Vadim GRITSENKO
 * 20141204
 */
MONITORING.building_list_data = function (data_graph,selector) {

	$('#'+selector).css({"margin": '5px', "background": '#000', "width": '150px'});
	html_text = '<table class="table table-condensed table-hover table-bordered">';
	html_text += '<tr class="info"><td>ФИО</td><td>Должность</td><td>Причина</td><td>Период</td><td>Замещающий</td></tr>';
	db_data = data_graph['db_data'];
	for (var i in db_data){
		html_text += '<tr><td colspan="5">'+i+'</td></tr>'
		for (var j in db_data[i]){
			html_text += '<tr><td></td></tr>'
		}
	}
	html_text = '</table>';
	$('#'+selector).html(html_text);
}
// конец функции

/*
 * функция построения графика
 * Vadim GRITSENKO
 * 20141204
 */
MONITORING.save_image_gystogramm = function (config_id) {
	for (var i in MONITORING.data.template){
		for (var j in MONITORING.data.template[i]){
			if (MONITORING.data.template[i][j]['config_id'] == config_id){
				var data = $('#row-'+i+'_column-'+j).jqplotToImageStr({});
				downloadWithName(data, MONITORING.data.config_template[config_id]['title']+'_'+new Date().getFullYear()+'-'+(new Date().getMonth()+1)+'-'+new Date().getDate()+".jpg")
				return;
			}
		}
	}
}
// конец функции


function downloadWithName(uri, name) {

    function eventFire(el, etype){
        if (el.fireEvent) {
            (el.fireEvent('on' + etype));
        } else {
            var evObj = document.createEvent('Events');
            evObj.initEvent(etype, true, false);
            el.dispatchEvent(evObj);
        }
    }

	var link = document.createElement("a");
	link.download = name;
	link.href = uri;
	eventFire(link, "click");
	
	var a = $("<a>").attr("href", uri).attr("download",name).appendTo("body");
	a[0].click();
	a[0].remove();

}

/*
 * функция загрузка печатной страницы
 * Vadim GRITSENKO
 * 20150616
 */
MONITORING.page_print = function(id_config){
	window.open(MONITORING.base_url +'/index.php/monitoring/block_print/'+id_config, '_blank')
}

/*
 * функция загруки ссылки на новой вкладке
 * Vadim GRITSENKO
 * 20150616
 */
MONITORING.open_page = function(url){
	window.open(MONITORING.base_url + url, '_blank')
}

/*
 * функция получения название месяца (в И.П.)
 * Vadim GRITSENKO
 * 20150616
 */
MONITORING.get_month = function(numb_month, lang){
	text_month = {
		"RU":new Array("январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"),
		"EN":new Array("january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december")
	}
	return text_month[lang][numb_month];
}

/*
 * функция демонстрации данных графика
 * Vadim GRITSENKO
 * 20150209
 */
MONITORING.data_pointer = function (array_data, url) {
	
	query = $.ajax ({
		url: MONITORING.base_url+url,
		type:'POST',
		data: {'array_data': JSON.stringify(array_data)}
	});
	query.done(function (response, textStatus, jqXHRб){
		content = (response);
		var default_parameters_dialog = {
				title: 'Листинг данных', 
				autoOpen: false,
				height: "auto",
				position: "left top",
				width: "1000",
				maxHeight: "500",
				modal: false
			};	
	
		create_dialog(default_parameters_dialog ,content, 'dialog_detal_data');		
		
	});
}
// конец функции

/*
 * функция создания заполнения диалогового окна детального графа
 * Vadim GRITSENKO
 * 20150722
 */
function show_detal_gysto(id_config){
	
	parameters_dialog = JSON.parse(JSON.stringify(default_parameters_dialog));
	parameters_dialog.title = MONITORING.data.config_template[id_config]['title'];
	parameters_dialog.position = "absolute";
	parameters_dialog.margin = "auto";
	parameters_dialog.width = window.innerWidth * 0.9;
	parameters_dialog.height = window.innerHeight * 0.9;
	parameters_dialog.modal = true;
	
	content = '<div id="dialog_config_'+id_config+'" class="div_graph"></div><div id="control_panel"><label> Установить даты от: </label><input type="text" class="datepicker" id="date_start"><label> по: </label><input type="text" class="datepicker" id="date_end"><button type="button" onclick="update_detal_gysto(\''+id_config+'\',\'dialog_config_'+id_config+'\', function(){})">Обновить</button></div>';
	
	create_dialog(parameters_dialog,content,'dialog_detal_data');
	
	$('#dialog_config_'+id_config).height($('#dialog_config_'+id_config).parent().parent().height() - $('#control_panel').height() - 60)
	
	detal_graph = MONITORING.building_gystogramm(MONITORING.data.config_template[id_config],'dialog_config_'+id_config);
	$(function() {$( ".datepicker" ).datepicker({
		dateFormat: 'yy-mm-dd' //Setting dateformat for the datepicker
	});})
	set_style();
}
// конец функции

/*
 * функция обновления данных детализованного графа-гистограмма
 * Vadim GRITSENKO
 * 20150722
 */
function update_detal_gysto(id_config, id_field, callback){
	if ($('#date_end').val() == ''){$('#date_end').datepicker("setDate" , "0");}
	if (check_date($('#date_start').val(), $('#date_end').val()) == false) {return;}
	
	query = $.ajax ({
		url: MONITORING.base_url+'index.php/monitoring/update_data_field',
		type:'POST',
		data: {
				'id_config' : id_config,
				'start_date' : $('#date_start').val(),
				'end_date' : $('#date_end').val()
			}
	});
	query.done(function (response, textStatus, jqXHRб){
		result_data = JSON.parse(response);
		detal_graph.destroy();
		MONITORING.building_gystogramm(result_data.data, id_field)
		callback()
	});	
}
// конец функции

/*
 * функция проверки даты
 * Vadim GRITSENKO
 * 20150723
 */
check_date = function (date_start, date_end){
	if ((new Date(date_end) - new Date(date_start))<-10800001 || (date_start=='') || (date_end=='')){
		alert('Откорректируйте даты');
		return false;
	}
	return true;
}
// конец функции

/*
 * функция демонстрации детализированного графа
 * Vadim GRITSENKO
 * 20150722
 */
MONITORING.build_detal_gysto = function(confid){
	detal_graph = MONITORING.building_gystogramm(confid,'detal_print');
	$(function() {$( ".datepicker" ).datepicker({
		dateFormat: 'yy-mm-dd' //Setting dateformat for the datepicker
	});})
	return detal_graph;
}
// конец функции