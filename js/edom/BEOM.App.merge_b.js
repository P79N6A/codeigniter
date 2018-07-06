/* 
 *
 */
/*************D*********************/



 BEOM.load_beom_d = function(){
 	BEOM.destroy();
 	var html_text = '';
 	html_text+='<h4>Открытые репозитарии</h4><div class = "btn-group" role="group" >';
 	
 	for (var i in BEOM.config_buttons_d){
		html_text+='<button ';
		for (var p in BEOM.config_buttons_d[i]){
			if (BEOM.config_buttons_d[i][p]){
				html_text+= p+'="'+BEOM.config_buttons_d[i][p]+'"' ;
			}
		}
		html_text+='>'+BEOM.config_buttons_d[i]["value"]+'</button>'
	}
 	
	html_text+='</div><div id="submenu" style="width:100%"></div>';
	$('#div_option').html(html_text);
}
 

BEOM.load_klassification_d = function(id_button,link){
    var html = '<iframe';
        html += ' width="100%" height="'+($(window).height()-140)+'" frameBorder="0" src="'+BEOM.base_url+'index.php/'+link+'"';
    html += '></iframe>';
    $('#content_div').css("margin-top",parseInt($('#div_option').css("height")));
    $('#content_div').css("height",$(window).height()-140);
    BEOM.change_color_botton(id_button);
    $('#content_div').html(html);
}

BEOM.config_buttons_d = [

    {
        id: "type_event",
        title: null,
        style: null,
        class: "btn btn-primary",
        value: "Объекты",
        onclick: "BEOM.load_klassification_d(\'type_event\',\'conframe_bi/beom_browser/beom_d\')",//id button,table,function get
    },
    {
        id: "type_event1",
        title: null,
        style: null,
        class: "btn btn-primary",
        value: "Субъекты",
        onclick: "BEOM.load_klassification_d(\'type_event1\',\'conframe_bi/beom_browser/beom_d\')",//id button,table,function get
    },
    {
        id: "type_event2",
        title: null,
        style: null,
        class: "btn btn-primary",
        value: "Задачи",
        onclick: "BEOM.load_klassification_d(\'type_event2\',\'conframe_bi/browser/prj_task/3\')",//id button,table,function get
    }

]
/*******************************//*******************************//*******************************//*******************************//*******************************/
/*******************************//*******************************//*******************************//*******************************//*******************************/
/*******************************//*******************************//*******************************//*******************************//*******************************/

 /*
	Artem
*/
 BEOM.load_beom_b = function(){
	BEOM.destroy();
	//clear_option_div()
	var html_text = '';
	html_text+='<h4>Атрибуты</h4><div class="btn-group" role="group" >';
	for (var i in BEOM.config_buttons_b){
		html_text+='<button ';
		for (var p in BEOM.config_buttons_b[i]){
			if (BEOM.config_buttons_b[i][p]){
				html_text+= p+'="'+BEOM.config_buttons_b[i][p]+'"' ;
			}
		}
		html_text+='>'+BEOM.config_buttons_b[i]["value"]+'</button>'
	}
	html_text+='</div><div id="submenu"></div>';
	$('#div_option').html(html_text);

}
/*
	Artem
*/
BEOM.load_klassification_top = function(id_button){
	if (!id_button ) return;
	if (!$('#'+id_button).attr("delimiter")) return; // console.log($('#'+id_button).attr("delimiter"));
	BEOM.destroy();
//	var prop = $('#'+id_button).attr("delimiter").split(',');
	var prop = BEOM.get_mas_delimiter(id_button,BEOM.config_buttons_b)
	
	var info = [];
	info.push({
		id:"9999999",
		name:$('#'+id_button).val(),
		name_10:BEOM.split_string($('#'+id_button).val().substr(0,10)),
	});
	var id=10;
	for (var i in prop){
		id ++;
		info.push({
			id:id,
			name:prop[i],
			name_10:BEOM.split_string(prop[i]),
			parent:"9999999",
		})
	}
	BEOM.set_hierarchical(info);
	BEOM.change_color_botton(id_button);
}
BEOM.split_string = function(str){
	if (!str) return;
	return str.substr(0,10)
} 

/*
	Конфигурация
	ВАЖНО!!! : Схему таблицы передавать без ковычек | Тот атрибут, который ненадо добавлять к кнопке - null
	Artem 
*/

BEOM.config_buttons_b = [
	{
		id:"type_event",
		title:null,
		style:null,
		class:"btn btn-primary",
		value:"Сотрудник",
		delimiter:["Наименование","Аббревиатура (акроним)","Код (Семантический ID)","Физ. лицо","Должность","Орг. структура","Телефон рабочий","Телефон мобильный","E-mail"],
		onclick:"BEOM.load_klassification_top(\'type_event\')",//id button,table,function get
	},

	{
		id:"type_event1",
		title:null,
		style:null,
		class:"btn btn-primary",
		value:"Орг.структура",
		delimiter:["Наименование","Аббревиатура","Код (Семантический идентификатор)","Широта / Долгота","Адрес","Телефоны","Факс","E-mail адрес","Зона эксплуатационной отвественности"],
		onclick:"BEOM.load_klassification_top(\'type_event1\')",//id button,table,function get
	},

	{
		id:"type_event2",
		title:null,
		style:null,
		class:"btn btn-primary",
		value:"Подстанция",
		delimiter:["Диспетчерское наименование","Аббревиатура","Семантический ID","Орг. структура","Схема ПС","Уровень напряжения","Вид оперативного обслуживания"],
		onclick:"BEOM.load_klassification_top(\'type_event2\')",//id button,table,function get
	},

	{
		id:"type_event3",
		title:null,
		style:null,
		class:"btn btn-primary",
		value:"ЛЭП",
		delimiter:["Диспетчерское наименование","Аббревиатура","Семантический ID","Орг. структура","Уровень напряжения"],
		onclick:"BEOM.load_klassification_top(\'type_event3\',\'domain_repositories.ropiz\')",//id button,table,function get
	},

	{
		id:"type_event4",
		title:null,
		style:null,
		class:"btn btn-primary",
		value:"Атрибуты сингулярных событий",
		delimiter:["Наименование","Аббревиатура","Семантический ID","Информация о пострадавших","Численность обесточенного населения","Название РЗ","Время обесточения потребителей","Прогноз восстановления обесточения потребителей(часов)","Изменения в режимах РПГ, ОРР , РВР ","Численность (пере-)запитанного населения","Нагрузка","Количество СЗО и объектов жизнеобеспечения","Названия населенных пунктов, административных районов","Задействованные силы и средства","Результат РПВ","Результат АПВ","Информация о состоянии оборудования","Ступень/Зона РЗ","Поврежденное оборудование ПС и ЛЭП","Количество ПС, РП, ТП","Осадки","Действия бригад","Субъекты, вовлеченные в событие","Информация об аварийном оперативном отключении","Количество абнентских ПС, РП, ТП","Информация о неправильном действии противоаварийной автоматики","Сведения о СДТУ","Количество ЛЭП (фидеров)","Информация о повреждении зданий и сооружений приводящее к отключению оборудования приводящее к угрозе отключения оборудования приводящее к невозможности включения из резерва, ремонта, консервации без обрушения несущих конструкций совпровождающееся обрушением несущих элементов здания, сооружения совпровождающееся обрушением несущих элементов здания, в том числе вследствие взрыва или пожара","Информация об обесточении потребителей","Ветер","Информация о состоянии ЛЭП 0,4-20 кВ","Эксплуатирующая организация","Информация о состоянии ЛЭП","Причина возниконовения аварии (ситуации)","Температура","Количество обесточенных населенных пунктов","Время возниконовения сингулярного события","ПС на которой произошло событие","ЛЭП на которой произошло событие","Информация о повреждение основного оборудования ПС и ВЛ выявленное во время работы, выявленное во время простоя, выявленное во время ремонта, выявленное во время опробования, выявленное во время обходов, выявленное во время осмотров, выявленное во время испытаний","Семантический ID события","Состояние собственных нужд","Сведения об АБ","Название ПА","Информация о воздушном судне","Время о воздушном судне","Время возниконовения сингулярного события","Дата возниконовения сингулярного события","Численность оставшегося обесточенного населения","Выделенный энергорайона","РОПИЗ"],
		onclick:"BEOM.load_klassification_top(\'type_event4\',\'sbj_ba.control_centers_types\')",//id button,table,function get
	},


];

/*
 * функция формирование массива объектов
 * 20150305
 * Vadim GRITSENKO
 */

BEOM.build_hierarchical = function (id,table,schema){
	var url =  BEOM.base_url+'index.php/edom/';
	if (schema == "null") schema = null; 
	var sh = schema ? schema : ' ';

	if (!table || table == "null"){
		url+='get_hierarchical';
	}else{
		url+='get_hierarchical_table/'+table+'/'+sh;
	}
	$.ajax({
        url: url,
		type: 'POST',
		data: {'id':id},
        success: function(data){
			var info = JSON.parse(data);
			BEOM.set_hierarchical(info,id);
			
		}
    });
}

BEOM.set_hierarchical = function(info,id){
	format_hierarchical = BEOM.generate_hierarchical(info);
	// create a network
    var container = document.getElementById('content_div');
	var data = {
		nodes: format_hierarchical.nodes,
		edges: format_hierarchical.edges
	};

    var options = {
		//stabilize: false,
		//smoothCurves: false,
		tooltip: {
			delay: 300,
			fontSize: 12,
			color: {
				background: "#BBDEFB"
			}
		},
        hierarchicalLayout: {
			direction: 'DU',
			layout: "direction",
			//layout: "hubsize",
        },
        edges: {style:"arrow"},
        smoothCurves:false
    };
    BEOM.network = new vis.Network(container, data, options);
	$('.btn.btn-success').removeClass('btn-success')
	if (id) $('#object_'+id).addClass('btn-success');
}
//конец функции
BEOM.get_table_schema = function(table){
	var table_get = table ? table : null; 
    table_get = table_get.split('.');
    if (table_get.length == 0) return null; 
    if (!table_get[1]){
    	table_get[1] = table_get[0]; 
    	table_get[0] = '';
    }
    return table_get;
}

BEOM.get_format_data_table = function(id_button,array_parent){
	var info = [];
	info.push({
				name:$('#'+id_button).val(),
				name_10:$('#'+id_button).val().substr(0,10),
				id:"9999999",
			})
			var name = '';
			for (var i in array_parent){
				name = array_parent[i].name || array_parent[i]["descr"];
				info.push({
					name : name,
					name_10 : name.substr(0,10),
					id : array_parent[i].id,
					parent : "9999999",
				})
			}
			return info
}
BEOM.change_color_botton = function(id_button){
	$('.btn.btn-warning').removeClass('btn-warning')
	$('#'+id_button).addClass('btn-warning');
}
BEOM.get_mas_delimiter = function(id_button,mas){
	var prop = [];
	for (var i in mas){
		if (mas[i].id == id_button){
			prop = mas[i].delimiter;
		}
	}
	return prop;
}