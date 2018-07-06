Mtt = {
	base_url: null, //адрес текущего локального сервер
	structure: [], //переменная хранящая структуру дерева задач
    config_menu : null, //конфигурация контекстного меню
    nodes : null,
    edges : null,
    network : null,
	mode_graph: 'tree', //вид графа (либо дерево, либо "салют")
	//mode_graph: 'test_option', //вид графа (либо дерево, либо "салют")
	mode_options: {
		'tree':{
			edges: {
				smooth: {
					type:'cubicBezier',
					forceDirection: 'vertical',
					roundness: 0.4
				},			
			},
			layout: {
				hierarchical:{
					direction: 'UD'
				}
			},
			/*physics :{ 
				hierarchicalRepulsion :  { 
					  centralGravity :  0.0 , 
					  springLength :  100 , 
					  springConstant :  0.01 , 
					  nodeDistance :  250 , 
					  damping :  0.09 
					},
			},*/
		},
		'basic':{},
	},
	view_task:{
		groups:	{
			'switch': {
				shape: 'triangle',
				color: '#ff0000',
				hover: true,
			}
		},
	},
	destroy_network: function(){
		if(Mtt.network != null){
			Mtt.network.destroy();
		}
	},
}

/*
 * функция инициализации данных
 * 20160121
 * Vadim GRITSENKO
 */
var choose_id_obj = null;
Mtt.init = function(){
	Mtt.destroy_network();
	var nodes = new Array();
    var edges = new Array();
    Mtt.nodes = new Array();
    Mtt.edges = new Array();
    Mtt.network = new Array();
    for (i in Mtt.structure){
        nodes.push({
            id: Mtt.structure[i]["id"],
            label: normalize_name(Mtt.structure[i]["label"], 10, '...'),
            //title: '<div style="max-width:200px;white-space:pre-wrap;">'+Mtt.structure[i]["name"]+'</div>',
            title: Mtt.structure[i]["label"],
            control_level: Mtt.structure[i]["control_level"],
            group: 'switch',
            is_open: false
        });
    }
	show_name_root();
    Mtt.nodes = new vis.DataSet(nodes);
    for (i in Mtt.structure){
        var from = Mtt.structure[i]["parent"];
        var to = Mtt.structure[i]["id"];
        edges.push({
            from: from,
            to: to
        });
    }
    Mtt.edges = new vis.DataSet(edges);
    var container = document.getElementById('content_div');
    var data = {
        nodes: Mtt.nodes,
        edges: Mtt.edges
    };
	
	set_btn_mode_graph(Mtt.mode_graph);
	options = $.extend(Mtt.mode_options[Mtt.mode_graph], Mtt.view_task);
    Mtt.network = new vis.Network(container,data,options);
	
    Mtt.network.on('click',function (properties){
        $('#pop_up_window').remove();
        if ((properties.pointer.button == 2) && ((properties.nodes.length == 1))){
            generate_context(properties);
			choose_id_obj = properties.nodes[0];
		}
        if ((properties.pointer.button == 0) && ((properties.nodes.length == 1))){
            generate_discription(properties);
		}
    });	
	
    //функция генерации контекстного меню
    function generate_context(properties){
        var html = '<div id="pop_up_window" class="pop_up_window" style="position:absolute;left:'+(properties.pointer.DOM.x+25)+'px;top:'+(properties.pointer.DOM.y+5)+'px;"></div>';
        $('body').append(html);
        var html = '';
        if (properties.nodes.length == 1){
            menu = Mtt.config_menu.nodes;
            for (var i=0; i < menu.length; i++){
                html += '<li class="'+menu[i]["class"]+'" style="'+menu[i]["style"]+'" onclick="'+menu[i]["onclick"]+'">'+menu[i]["name"]+'</li>';
            }
        }
        $('#pop_up_window').html(html);
    }

    //функция генерации контекстного меню
    function generate_discription(properties){
		var html = '<div id="pop_up_window" class="pop_up_window field_description" style="position:absolute;left:'+(properties.pointer.DOM.x+25)+'px;top:'+(properties.pointer.DOM.y+5)+'px;">'+Mtt.nodes._data[properties.nodes[0]].title+'<br>(Уровень управления: '+Mtt.nodes._data[properties.nodes[0]].control_level+')</div>';
        $('body').append(html);
    }
	
    //функция помечание кнопки выбранного вида графа
	function set_btn_mode_graph(view_mode){
		$('.btn_view_mode').removeClass('btn-success');
		if(view_mode == 'tree') $('.btn_view_mode#btn_tree').addClass('btn-success');
		else if(view_mode == 'basic') $('.btn_view_mode#btn_basic').addClass('btn-success');
	}
}

/*
 * функция добавления задачи
 * 20160121
 * Vadim GRITSENKO
 */
Mtt.add_task = function(){
	$('#pop_up_window').remove();
	var dialog = CFUtil.dialog.create("save_window",
	{
		title: "Добавление задачи", 
		autoOpen: false,
		height: "auto",
		width: 500,
		modal: true
	});
	if ( dialog ){
		html = $.ajax({     
			url: Mtt.base_url+"index.php/qcore/ajax/load_form/edom/prj_task/",    
			type: "POST"         
		}).done(function (response, textStatus, jqXHRб){
			$(dialog).html(response);
			$('#parent').val(choose_id_obj);
		});
	}
}

/*
 * функция редактирование задачи
 * 20160121
 * Vadim GRITSENKO
 */
Mtt.edit_task = function(){
	$('#pop_up_window').remove();
	var dialog = CFUtil.dialog.create("save_window",
	{
		title: "Редактирование задачи", 
		autoOpen: false,
		height: "auto",
		width: 500,
		modal: true
	});
	if ( dialog ){
		html = $.ajax({
			url: Mtt.base_url+"index.php/qcore/ajax/edit_form/edom/prj_task/" + choose_id_obj,    
			type: "POST"
		}).done(function (response, textStatus, jqXHRб){
			$(dialog).html(response);
		});
	}
}

/*
 * функция удаления задачи
 * 20160121
 * Vadim GRITSENKO
 */
Mtt.remove_task = function(){
	$('#pop_up_window').remove();
	if(confirm("Вы действительно хотите удалить задачу?")){
		$.ajax({
			url: Mtt.base_url+"index.php/edom/remove_task/" + choose_id_obj,
			type: "POST",
			data: {id:choose_id_obj}
		}).done(function (response, textStatus, jqXHRб){
			delete_flag = JSON.parse(response);
			if(Mtt.structure[choose_id_obj].parent == '0') load_page('index.php/edom/mtt/');
			if(delete_flag.result == 1) {
				Mtt.nodes.remove({id:choose_id_obj});
				delete(Mtt.structure[choose_id_obj]);
			}
		});		
	}
}

/*
 * обработка наименования
 * 20160121
 * Vadim GRITSENKO
 */
function normalize_name(str, count, add_symbol){
	return (str.length > count+1 ? str.substr(0,count+1)+add_symbol : str)
}

/*
 * открыть страницу по ссылке
 * 20160121
 * Vadim GRITSENKO
 */
function load_page(link){
	location.href = Mtt.base_url + link;
}

/*
 * функция обновления графа задач
 * 20160121
 * Vadim GRITSENKO
 */
Mtt.update = function (obj){
	var new_data = {
            id: obj.uuid,
            label: normalize_name($('#name').val(), 10, '...'),
            title: $('#name').val(),
            control_level: $("#control_level").val(),
            parent: choose_id_obj,
            group: 'switch',
            is_open: false
        }; 
	
	if(choose_id_obj == 0){
		load_page('index.php/edom/mtt/' + obj.uuid);
	}
	else if(Mtt.nodes._data[obj.uuid]){
		Mtt.nodes.update(new_data);
		Mtt.structure[choose_id_obj] = new_data;
	}
	else {
		Mtt.nodes.add(new_data);
		Mtt.structure[choose_id_obj] = new_data;
		Mtt.edges.add({
				from: obj.uuid,
				to: choose_id_obj			
			});
	}
}

/*
 * функция добавление корневой задачи
 * 20160121
 * Vadim GRITSENKO
 */
Mtt.add_root = function (){
	choose_id_obj = 0;
	Mtt.add_task();
}

/*
 * вывод графа в основном виде
 * 20160122
 * Vadim GRITSENKO
 */
Mtt.change_mode_graph = function (new_mode_view){
	Mtt.mode_graph = new_mode_view;
	Mtt.init();
}

/*
 * вывод наименования корневого элемента
 * 20160125
 * Vadim GRITSENKO
 */
show_name_root = function(){
	var array_keys = Object.keys(Mtt.structure);
	if(array_keys.length > 0){
		$('#name_root').html(Mtt.structure[array_keys[0]]['label']+' (Уровень управления: <b>'+Mtt.structure[array_keys[0]]['control_level']+'</b>)');
	}
}