//  ------------------------------------------------------------------------------------ //
//                                  ConFrame-Electric CTM V3                             //
//                               Copyright (c) 2011-2014 DunRose                         //
//                                  <http://www.dunrose.ru/>                             //
//  ------------------------------------------------------------------------------------ //
//  Author: Mr. Thurairajasingam Senthilruban           TSRuban[AT]dunrose.ru            //
//  Programmer: Mr. Kharitonov Constantine Igorevich    CKharitonov[AT]dunrose.ru        //
//  URL: http://www.dunrose.ru                                                           //
// ------------------------------------------------------------------------------------- //

var BEOM_BROWSER = {
    'base_url' : null,
    'beom_list' : null,
    'data' : null,
    'database' : null,
    'schema' : null,
    'table' : null,
    'nodes' : null,
    'edges' : null,
    'network' : null,
    'path' : null,
    'basic_elem' : null,
    'context_menu' : null,
    'active_element' : null,
    'color_voltage' : null,
    'logotip' : null,
    'mode' : null,
    'background_color' : '#000',
    'color' : '#FFF'
};
/*
 * CKharitonov
 */
BEOM_BROWSER.init = function(){
    if (BEOM_BROWSER.mode == 'beom_d'){
        BEOM_BROWSER.background_color = '#FFF';
        BEOM_BROWSER.color = '#000';
    }
    html = '<nav class="navbar navbar-default" style="margin-bottom:0px;height:51px;">';
        if (BEOM_BROWSER.mode != 'beom_d'){
            html += '<div class="navbar-header">';
                html += '<p class="navbar-brand" style="padding:0px"><img src="'+BEOM_BROWSER.logotip+'" height="50" onclick="location.href=\''+BEOM_BROWSER.project_menu+'\'"></img>&nbsp;&nbsp;'+langs.get_term('txt_beom_browser')+'</p>';
            html += '</div>';
        }
        if (BEOM_BROWSER.beom_list.length != 0){
            for (var i=0; i<BEOM_BROWSER.beom_list.length; i++){
                if (BEOM_BROWSER.mode != 'beom_d'){
                    html += '<ul class="nav navbar-nav">';
                        html += '<li class="dropdown">';
                            html += '<a href="#" class="dropdown-toggle" data-toggle="dropdown" onclick="get_beom_data(\''+BEOM_BROWSER.beom_list[i]["database"]+'\',\''+BEOM_BROWSER.beom_list[i]["schema"]+'\',\''+BEOM_BROWSER.beom_list[i]["table"]+'\','+i+')" role="button" aria-expanded="false">'+BEOM_BROWSER.beom_list[i]["name"]+'</a>';
                            html += '<ul class="dropdown-menu" role="menu" id="drop'+i+'"></ul>';
                        html += '</li>';
                    html += ' </ul>';
                }
                else {
                    if (BEOM_BROWSER.beom_list[i].table == 'org_struct'){
                        html += '<ul class="nav navbar-nav">';
                            html += '<li class="dropdown">';
                                html += '<a href="#" class="dropdown-toggle" data-toggle="dropdown" onclick="get_beom_data(\''+BEOM_BROWSER.beom_list[i]["database"]+'\',\''+BEOM_BROWSER.beom_list[i]["schema"]+'\',\''+BEOM_BROWSER.beom_list[i]["table"]+'\','+i+')" role="button" aria-expanded="false">'+BEOM_BROWSER.beom_list[i]["name"]+'</a>';
                                html += '<ul class="dropdown-menu" role="menu" id="drop'+i+'"></ul>';
                            html += '</li>';
                        html += ' </ul>';
                    }
                }
            }
        }
        html += '<div class="navbar-form navbar-right" role="search" style="visibility:hidden;margin-right:5px;" id="search_form">';
            html += '<div class="form-group has-default has-feedback dropdown">';
                html += '<input type="text" class="form-control dropdown-toggle" placeholder="Поиск" id="search" aria-describedby="search_status" data-toggle="dropdown" aria-expanded="true" style="width:300px;">';
                html += '<span class="glyphicon glyphicon-search form-control-feedback" aria-hidden="true"></span>';
                html += '<span id="search_status" class="sr-only">(search)</span>';
                html += '<ul class="dropdown-menu" id="search_dd" role="menu" aria-labelledby="search"></ul>';
            html += '</div>';
        html += '</div>';
    html += '</nav>';
    html += '<div id="visualization" style="height:'+($(window).height()-85)+'px;background-color:'+BEOM_BROWSER.background_color+'"></div>';
    html += '<div id="selection" style="height:35px;background-color:'+BEOM_BROWSER.background_color+';color:'+BEOM_BROWSER.color+';font-size:14px;padding-top:10px;"></div>';
    $('#beom_browser').html(html);
    $('#search').bind('change paste keyup focus', function(){
        if (!$("#search_dd").is(':visible')){
            $('#search_dd').dropdown('toggle');
        }
        BEOM_BROWSER.search_node();
    });
}
/*
 *  CKharitonov
 */
function get_beom_data(database,schema,table,idx){
    BEOM_BROWSER.data = new Array();
    $.ajax({
        url: BEOM_BROWSER.base_url+'index.php/conframe_bi/get_beom_data/'+database+'/'+schema+'/'+table,
        success: function(data){
            BEOM_BROWSER.database = database;
            BEOM_BROWSER.schema = schema;
            BEOM_BROWSER.table = table;
            BEOM_BROWSER.data = JSON.parse(data);
            BEOM_BROWSER.basic_elem = [];
            for (var i=0; i<BEOM_BROWSER.data.length; i++){
                if (BEOM_BROWSER.data[i]["parent"] == 0 || BEOM_BROWSER.data[i]["parent"] == null){
                    BEOM_BROWSER.basic_elem.push(BEOM_BROWSER.data[i]);
                }
            }
            if (BEOM_BROWSER.basic_elem.length > 0){
                BEOM_BROWSER.create_dropdown(idx);
            }
        }
    });
}
/*
 * CKharitonov
 */
BEOM_BROWSER.create_dropdown = function(idx){
    html = '';
    for (var i=0; i<BEOM_BROWSER.basic_elem.length; i++){
        html += '<li><a href="#" onclick="BEOM_BROWSER.load_data('+i+')">'+BEOM_BROWSER.basic_elem[i]["name"]+'</a></li>';
    }
    $('#drop'+idx).html(html);
}
/*
 * CKharitonov
 */
BEOM_BROWSER.load_data = function(idx){
    if (BEOM_BROWSER.basic_elem == null) return;
    $('#pop_up_window').remove();
    $('#search_form').css({'visibility':'visible'});
    $("#visualization").empty();
    $("#selection").empty();
    var nodes = new Array();
    var edges = new Array();
    BEOM_BROWSER.nodes = new Array();
    BEOM_BROWSER.edges = new Array();
    BEOM_BROWSER.network = new Array();
    nodes.push({
        id: BEOM_BROWSER.basic_elem[idx]["id"],
        label: BEOM_BROWSER.basic_elem[idx]["name"],
        group: BEOM_BROWSER.basic_elem[idx]["parent"],
        is_open: false
    });
    BEOM_BROWSER.nodes = new vis.DataSet(nodes);
    var from = BEOM_BROWSER.basic_elem[idx]["parent"];
    var to = BEOM_BROWSER.basic_elem[idx]["id"];
    edges.push({
        from: from,
        to: to
    });
    BEOM_BROWSER.edges = new vis.DataSet(edges);
    var container = document.getElementById('visualization');
    var data = {
        nodes: BEOM_BROWSER.nodes,
        edges: BEOM_BROWSER.edges
    };
	/* старые настройки стиля 
	    var options = {
        nodes: {
            shape: "dot",
            //size: 15,
            //fontColor: BEOM_BROWSER.color
        },
        edges: {
            style: "arrow"
        },
        tooltip: {
            delay: 200,
            fontSize: 12,
            color: {
                background: "#CCCCCC"
            }
        },
        physics: {  
            barnesHut: {

				enabled: false,
                gravitationalConstant: 10000,
                centralGravity: 0.1,
                springLength: 300,
                springConstant: 0.0,
                damping: 0.0
            }
        },
        stabilize: false,
        smoothCurves: true,
        hover: true,
        groups: {
            'extra_nodes': {
                shape: 'triangle',
                color: '#FF0000',
                fontColor: '#FFA07A'
            },
            'substations': {
                //shape: 'dot',
                shape: 'square',
                color: BEOM_BROWSER.color,
                font: {color: '#FFA07A'}
				//fontColor: '#FFA07A'
            },
            'fias': {
                shape: 'square',
                color: '#FFA07A',
                font: {color: '#FFA07A'}
                //fontColor: '#FFA07A'
            },
            'lines': {
                shape: 'square',
                //color: '#FFA07A',
                //fontColor: '#FFA07A'
            }
        }
    };
	*/
    var options = {
        nodes: {
            shape: "dot",
            size: 15,
            font: {color: BEOM_BROWSER.color},
        },
        edges: {
			/*arrows: {
				to:     {enabled: false, scaleFactor:1, type:'arrow'},
				middle: {enabled: false, scaleFactor:1, type:'arrow'},
				from:   {enabled: false, scaleFactor:1, type:'arrow'}
			},*/
		},
        tooltip: {
            delay: 200,
            fontSize: 12,
            color: {
                background: "#CCCCCC"
            }
        },
        physics: {  
            barnesHut: {

				gravitationalConstant: -5000,
				centralGravity: 0.3,
				springLength: 150,
				springConstant: 0.04,
				damping: 0.09,
				avoidOverlap: 0

				/*
				enabled: false,
                gravitationalConstant: 10000,
                centralGravity: 0.1,
                springLength: 300,
                springConstant: 0.0,
                damping: 0.0*/
            }
        },
        stabilize: false,
        smoothCurves: true,
        hover: true,
        groups: {
            'extra_nodes': {
                shape: 'triangle',
                color: '#FF0000',
                font: {color: '#FFA07A'}
            },
            'substations': {
                //shape: 'dot',
                shape: 'square',
                color: BEOM_BROWSER.color,
                font: {color: '#FFA07A'}
				//fontColor: '#FFA07A'
            },
            'fias': {
                shape: 'square',
                color: '#FFA07A',
                font: {color: '#FFA07A'}
                //fontColor: '#FFA07A'
            },
            'lines': {
                shape: 'square',
                //color: '#FFA07A',
                //fontColor: '#FFA07A'
            }
        }
    };
    BEOM_BROWSER.network = new vis.Network(container,data,options);
    BEOM_BROWSER.network.on('click',function (properties){
        $('#pop_up_window').remove();
    });
    BEOM_BROWSER.network.on('doubleClick',function (properties){
        if (properties.nodes.length != 0){
            BEOM_BROWSER.active_element = properties.nodes[0];
            BEOM_BROWSER.toggle_node();
        }
    });
    BEOM_BROWSER.network.on('hoverNode',function (properties){
        for (var i=0; i<BEOM_BROWSER.data.length; i++){
            if (BEOM_BROWSER.data[i]["parent"] == properties.node){
                document.body.style.cursor = 'pointer';
            }
        }
    });
    BEOM_BROWSER.network.on('blurNode',function (properties){
        document.body.style.cursor = 'default';
    });
    BEOM_BROWSER.network.on('select',function (properties){
        if (properties.nodes.length != 0){
            var select_node = BEOM_BROWSER.nodes.get(properties.nodes);
            var html = BEOM_BROWSER.build_path(select_node[0]["id"]);
            document.getElementById('selection').innerHTML = html;
        }
    });
    BEOM_BROWSER.network.on('hold',function (properties){
        $('#pop_up_window').remove();
        if (properties.nodes.length == 0 && properties.edges.length == 0) return;
        generate_context(properties);
    });
    BEOM_BROWSER.network.on('click',function (properties){
        //alert(1);
        if ((properties.pointer.button == 2) && ((properties.nodes.length > 0))){
            generate_context(properties);
        }
        //console.log(properties);
    });	
    //функция генерации контекстного меню
    function generate_context(properties){
        BEOM_BROWSER.active_element = properties.nodes[0];//console.log(BEOM_BROWSER.nodes._data);
        var html = '<div id="pop_up_window" class="pop_up_window" style="position:absolute;left:'+properties.pointer.DOM.x+'px;top:'+(properties.pointer.DOM.y+30)+'px;"></div>';
        $('body').append(html);
        var html = '';
        if (properties.nodes.length == 1){
            menu = BEOM_BROWSER.context_menu[BEOM_BROWSER.table][BEOM_BROWSER.nodes._data[BEOM_BROWSER.active_element]['group']] ? BEOM_BROWSER.context_menu[BEOM_BROWSER.table][BEOM_BROWSER.nodes._data[BEOM_BROWSER.active_element]['group']]: BEOM_BROWSER.context_menu[BEOM_BROWSER.table]['subject'];
            //menu = BEOM_BROWSER.context_menu[BEOM_BROWSER.table];
            for (var i=0; i < menu.length; i++){
                html += '<li class="pop_up_item" onclick="'+menu[i]["onclick"]+'">'+menu[i]["name"]+'</li>';
            }
        }
        $('#pop_up_window').html(html);
    }
}
/*
 *  CKharitonov
 */
function get_extra_data(table,id){
    $.ajax({
        url: BEOM_BROWSER.base_url+'index.php/conframe_bi/get_extra_data/'+table+'/'+id,
        success: function(data){
            var info = JSON.parse(data);
            BEOM_BROWSER.add_extra_nodes(table,info);
        }
    });
}
/*
 * CKharitonov
 */
BEOM_BROWSER.add_nodes = function(parent){
    if (BEOM_BROWSER.data == null) return;
    var nodes = [];
    var edges = [];
    for (var i=0; i<BEOM_BROWSER.data.length; i++){
        if (BEOM_BROWSER.data[i]["parent"] == parent){
            nodes.push({
                id: BEOM_BROWSER.data[i]["id"],
                label: BEOM_BROWSER.data[i]["name"],
                group: BEOM_BROWSER.data[i]["parent"],
                is_open: false
            });
        }
    }
    BEOM_BROWSER.nodes.add(nodes);
    for (var i=0; i<BEOM_BROWSER.data.length; i++){
        if (BEOM_BROWSER.data[i]["parent"] == parent){
            edges.push({
                from: BEOM_BROWSER.data[i]["parent"],
                to: BEOM_BROWSER.data[i]["id"]
            });
        }
    }
    BEOM_BROWSER.edges.add(edges);
}
/*
 * CKharitonov
 */
BEOM_BROWSER.add_extra_nodes = function(table,data){
    if (data == null) return;
    var nodes = [];
    var edges = [];
    var field = null;
    var label = null;
    for (var i=0; i<data.length; i++){
        nodes.push({
            id: 'ex_'+data[i]["id"],
            db_id: data[i]["id"],
            label: data[i]["name"],
            group: 'extra_nodes'
        });
    }
    BEOM_BROWSER.nodes.add(nodes);
    for (var i=0; i<data.length; i++){
        if (table == 'org_struct'){
            field = 'fk_org_struct';
            if (data[i]["type_name"] != null){
                label = 'Центр упр. ('+data[i]["type_name"]+')';
            }
            else {
                label = 'Центр упр.';
            }
        }
        else if (table == 'control_centers'){
            field = 'backreference';
            label = 'Орг. структ.';
        }
        else if (table == 'org_struct_suravr'){
            field = 'fk_org_struct_suravr';
            label = 'Орг. структ.';
        }
        edges.push({
            from: data[i][field],
            to: 'ex_'+data[i]["id"],
            style: 'dash-line',
            color: {
                color: '#FF0000',
                hover: '#FF0000',
                highlight: '#FF0000'
            },
            widthSelectionMultiplier: 1,
            length: 350, 
            width: 2,
            label: label,
            fontColor: '#FFA07A',
            fontFill: BEOM_BROWSER.background_color
        });
    }
    BEOM_BROWSER.edges.add(edges);
}
/*
 * CKharitonov
 */
BEOM_BROWSER.remove_nodes_edges = function(parent){
    for (var i in BEOM_BROWSER.edges["_data"]){
        if (BEOM_BROWSER.edges["_data"][i]["from"] == parent){
            BEOM_BROWSER.remove_nodes_edges(BEOM_BROWSER.edges["_data"][i]["to"]);
            BEOM_BROWSER.nodes.remove(BEOM_BROWSER.edges["_data"][i]["to"]);
            BEOM_BROWSER.edges.remove(BEOM_BROWSER.edges["_data"][i]["id"]);
        }
    }
}
/*
 * CKharitonov
 */
BEOM_BROWSER.focus_on_node = function(parent){
    var node_id = parent;
    var options = {
        scale: 1,
        animation: {
            duration: 3000, //5000
            easingFunction: "easeInOutQuad"
        }
    }
    /*BEOM_BROWSER.network.focusOnNode(node_id,options); //Vadim GRITSENKO старая фокусировка */
    BEOM_BROWSER.network.focus(node_id,options);
}
/*
 * CKharitonov
 */
BEOM_BROWSER.get_path = function(id){
    var node = BEOM_BROWSER.nodes.get(id);
    if (node != null){
        BEOM_BROWSER.path.push(node);
        if (node["group"] == 0 || node["group"] == null){
            return;
        }
        else {
            BEOM_BROWSER.get_path(node["group"]);
        }
    }
}
/*
 * CKharitonov
 */
BEOM_BROWSER.build_path = function(id){
    BEOM_BROWSER.path = [];
    BEOM_BROWSER.get_path(id);
    var html = '<b>&nbsp;&nbsp;&nbsp;'+langs.get_term('txt_selected')+': ';
    if (BEOM_BROWSER.path.length != 0){
        for(var i=BEOM_BROWSER.path.length-1; i>=0; i--){
            html += '<span style="cursor:pointer;" onclick="BEOM_BROWSER.focus_on_node(\''+BEOM_BROWSER.path[i]["id"]+'\')">'+BEOM_BROWSER.path[i]["label"]+'</a></span>';
            if (i != 0){
                html += ' / ';
            }
        }
    }
    html += '</b>';
    return html;
}
/*
 * CKharitonov
 */
BEOM_BROWSER.search_node = function(){
    var value = $('#search').val();
    var searched = false;
    var html = '';
    if (value.length > 1){
        for (var i in BEOM_BROWSER.nodes._data){
            if (String(BEOM_BROWSER.nodes._data[i]["label"]).toLowerCase().indexOf(String(value).toLowerCase()) + 1){
                searched = true;
                html += '<li>';
                    html += '<a href="#" onclick="BEOM_BROWSER.focus_on_search_node(\''+BEOM_BROWSER.nodes._data[i]["id"]+'\')">'+BEOM_BROWSER.nodes._data[i]["label"]+'</a>';
                html += '</li>';
            }
        }
    }
    if (!searched){
        html += '<li class="dropdown-header">Ничего не найдено</li>';
    }
    $('#search_dd').html(html);
}
/*
 * CKharitonov
 */
BEOM_BROWSER.focus_on_search_node = function(id){
    BEOM_BROWSER.network.selectNodes([id]);
    var html = BEOM_BROWSER.build_path(id);
    document.getElementById('selection').innerHTML = html;
    BEOM_BROWSER.focus_on_node(id);
}
/*
 * CKharitonov
 */
BEOM_BROWSER.toggle_node = function(){
    if (BEOM_BROWSER.nodes["_data"][BEOM_BROWSER.active_element]["is_open"] == false){
        BEOM_BROWSER.add_nodes(BEOM_BROWSER.active_element);
        BEOM_BROWSER.nodes["_data"][BEOM_BROWSER.active_element]["is_open"] = true;
        setTimeout('BEOM_BROWSER.focus_on_node('+BEOM_BROWSER.active_element+');',1000);
        if (BEOM_BROWSER.table == 'org_struct' || BEOM_BROWSER.table == 'control_centers' || BEOM_BROWSER.table == 'org_struct_suravr'){
            get_extra_data(BEOM_BROWSER.table,BEOM_BROWSER.active_element);
        }
    }
    else {
        BEOM_BROWSER.remove_nodes_edges(BEOM_BROWSER.active_element);
        BEOM_BROWSER.nodes["_data"][BEOM_BROWSER.active_element]["is_open"] = false;
    }
    BEOM_BROWSER.active_element = null;
    $('#pop_up_window').remove();
}
/*
 * CKharitonov
 */
BEOM_BROWSER.get_substations = function(db,shm,tbl){
    if (BEOM_BROWSER.nodes.get('substn_'+BEOM_BROWSER.active_element) != null){
        BEOM_BROWSER.remove_nodes_edges('substn_'+BEOM_BROWSER.active_element);
        BEOM_BROWSER.nodes.remove('substn_'+BEOM_BROWSER.active_element);
        for (var i in BEOM_BROWSER.edges["_data"]){
            if (BEOM_BROWSER.edges["_data"][i]["to"] == 'substn_'+BEOM_BROWSER.active_element){
                BEOM_BROWSER.edges.remove(BEOM_BROWSER.edges["_data"][i]["id"]);
            }
        }
        BEOM_BROWSER.active_element = null;
        $('#pop_up_window').remove();
    }
    else {
        $.ajax({
            url: BEOM_BROWSER.base_url+'index.php/conframe_bi/get_substations_on_org_struct/'+BEOM_BROWSER.active_element,
            type: 'POST',
            data: {	
                "name_db": db,
                "name_shm": shm,
                "name_tbl": tbl,
            },
            success: function(data){
                var info = JSON.parse(data);
                if (info != null && info.length != 0){
                    BEOM_BROWSER.add_substations(info);console.log(info);
                }
                else {
                    output_message('Нет подстанций', 'alert-danger');//переделать на lang //Vadim GRITSENKO
                }		
                BEOM_BROWSER.active_element = null;
                $('#pop_up_window').remove();
            }
        });
    }
}
/*
 * CKharitonov
 */
BEOM_BROWSER.add_substations = function(data){
    var nodes = [];
    var edges = [];
    nodes.push({
        id: 'substn_'+BEOM_BROWSER.active_element,
        label: 'Подстанции',
        group: 'substations'
    });
    for (var i=0; i<data.length; i++){
        nodes.push({
            id: 'substn_'+data[i]["id"],
            db_id: data[i]["id"],			
            label: data[i]["name"],
            shape: 'dot',
            group: 'substation',
            color: BEOM_BROWSER.color_voltage['txt_'+data[i]["voltage"]+'_kv'],
            fontcolor: BEOM_BROWSER.color_voltage['txt_'+data[i]["voltage"]+'_kv'],
        });
    }
    BEOM_BROWSER.nodes.add(nodes);
    edges.push({
        from: BEOM_BROWSER.active_element,
        to: 'substn_'+BEOM_BROWSER.active_element,
        style: 'dash-line',
        color: {
            color: BEOM_BROWSER.color,
            hover: BEOM_BROWSER.color,
            highlight: BEOM_BROWSER.color
        },
        widthSelectionMultiplier: 1,
        length: 350, 
        width: 2,
        label: '',
        fontColor: '#FFA07A',
        fontFill: BEOM_BROWSER.background_color
    });
    for (var i=0; i<data.length; i++){
        edges.push({
            from: 'substn_'+BEOM_BROWSER.active_element,
            to: 'substn_'+data[i]["id"],
            //style: 'dash-line',
            style: 'line',
            color: {
                color: BEOM_BROWSER.color_voltage['txt_'+data[i]["voltage"]+'_kv'],
                hover: BEOM_BROWSER.color_voltage['txt_'+data[i]["voltage"]+'_kv'],
                highlight: BEOM_BROWSER.color_voltage['txt_'+data[i]["voltage"]+'_kv']
            },
            widthSelectionMultiplier: 1,
            width: 2,
            label: '',
            fontColor: '#FFA07A',
            fontFill: BEOM_BROWSER.background_color
        });
    }
    BEOM_BROWSER.edges.add(edges);
}
/*
 * функция демонстрации данных
 * 20150123
 * Vadim GRITSENKO
 */
BEOM_BROWSER.show_data_subject = function(){
    $('#pop_up_window').remove();
    id = BEOM_BROWSER.nodes._data[BEOM_BROWSER.active_element]['group'] == 'extra_nodes' ? BEOM_BROWSER.nodes._data[BEOM_BROWSER.active_element]['db_id'] : BEOM_BROWSER.active_element;	
    query = $.ajax({
        url: BEOM_BROWSER.base_url+'index.php/conframe_bi/get_data_object/',
        type: 'POST',
        data: {"id": id},
    });
    query.done(function (response, textStatus, jqXHRб){
        result = JSON.parse(response);
        data = result[0];
        var dialog = CFUtil.dialog.create('save_window',{
            title: 'Информация (Орг.структура)', 
            autoOpen: false,
            height: "auto",
            position: "right top",
            width: 300,
            modal: false
        });
        html_text = '<table class="table table-condensed" style="font-size:12px">';
        /*for (option in data ){
            html_text += '<tr><td><label>'+option+'</label></td><td>'+(data[option]!=null ? data[option]:'-')+'</td></tr>';
        }*/
        html_text += '<tr><td><label>Имя</label></td><td>'+(data['name']!=null ? data['name']:'-')+'</td></tr>';
        html_text += '<tr><td><label>Аббревиатура</label></td><td>'+(data['abbrev']!=null ? data['abbrev']:'-')+'</td></tr>';
        html_text += '<tr><td><label>Номер телефона</label></td><td>'+(data['phone_numbers']!=null ? data['phone_numbers']:'-')+'</td></tr>';
        html_text += '<tr><td><label>Факс</label></td><td>'+(data['fax']!=null ? data['fax']:'-')+'</td></tr>';
        html_text += '<tr><td><label>Почта</label></td><td>'+(data['email']!=null ? data['email']:'-')+'</td></tr>';
        html_text += '<tr><td colspan="2"><center><label style="color:#00007F">ФИАС</label></center></td></tr>';
        if ((result.length > 1) && (data['formalname'] != null)){
            for (numb_fias in result){
                html_text += '<tr><td colspan="2">'+(result[numb_fias]['formalname']!=null ? result[numb_fias]['formalname']:'-')+'</td></tr>';
            }
        }
        html_text += '</table>';
        $("#save_window").html(html_text);
    });
}
//конец функции
/*
 * функция для добавления данных фиас
 * Vadim GRITSENKO
 * 20150126
 */
BEOM_BROWSER.get_fias = function(db,shm,tbl){
    if (BEOM_BROWSER.nodes.get('fias_'+BEOM_BROWSER.active_element) != null){
        BEOM_BROWSER.remove_nodes_edges('fias_'+BEOM_BROWSER.active_element);
        BEOM_BROWSER.nodes.remove('fias_'+BEOM_BROWSER.active_element);
        for (var i in BEOM_BROWSER.edges["_data"]){
            if (BEOM_BROWSER.edges["_data"][i]["to"] == 'fias_'+BEOM_BROWSER.active_element){
                BEOM_BROWSER.edges.remove(BEOM_BROWSER.edges["_data"][i]["id"]);
            }
        }
        BEOM_BROWSER.active_element = null;
        $('#pop_up_window').remove();
    }
    else {
        $.ajax({
            url: BEOM_BROWSER.base_url+'index.php/conframe_bi/get_fias/'+BEOM_BROWSER.active_element,
            type: 'POST',
            data: {
                "name_db": db,
                "id": BEOM_BROWSER.active_element,
            },
            success: function(data){
                var info = JSON.parse(data);
                if (info != null && info.length != 0){
                    BEOM_BROWSER.add_fias(info);
                }
                else {
                    output_message('Нет данных ФИАС', 'alert-danger');//переделать на lang //Vadim GRITSENKO
                }
                BEOM_BROWSER.active_element = null;
                $('#pop_up_window').remove();
            }
        });
    }
}
/*
 * функция для добавления данных фиас
 * Vadim GRITSENKO
 * 20150126
 */
BEOM_BROWSER.add_fias = function(data){
    var nodes = [];
    var edges = [];
    nodes.push({
        id: 'fias_'+BEOM_BROWSER.active_element,
        label: 'Фиас',
        group: 'fias'
    });
    for (var i=0; i<data.length; i++){
        nodes.push({
            id: 'fias_'+data[i]["id"],
            db_id: data[i]["addrobj_id"],
            label: data[i]["name"],
            group: 'fias'
        });
    }
    BEOM_BROWSER.nodes.add(nodes);
    edges.push({
        from: BEOM_BROWSER.active_element,
        to: 'fias_'+BEOM_BROWSER.active_element,
        style: 'dash-line',
        color: {
            color: '#FFA07A',
            hover: '#FFA07A',
            highlight: '#FFA07A'
        },
        widthSelectionMultiplier: 1,
        length: 350, 
        width: 2,
        label: '',
        fontColor: '#FFA07A',
        fontFill: BEOM_BROWSER.background_color
    });
    for (var i=0; i<data.length; i++){
        edges.push({
            from: 'fias_'+BEOM_BROWSER.active_element,
            to: 'fias_'+data[i]["id"],
            style: 'dash-line',
            color: {
                color: '#FFA07A',
                hover: '#FFA07A',
                highlight: '#FFA07A'
            },
            widthSelectionMultiplier: 1,
            width: 2,
            label: '',
            fontColor: '#FFA07A',
            fontFill: BEOM_BROWSER.background_color
        });
    }
    BEOM_BROWSER.edges.add(edges);
}
/*
 * функция демонстрации данных фиас
 * 20150126
 * Vadim GRITSENKO
 */
BEOM_BROWSER.show_data_fias = function(){
    $('#pop_up_window').remove();
    if (!BEOM_BROWSER.nodes._data[BEOM_BROWSER.active_element]['db_id']) return;
    query = $.ajax({
        url: BEOM_BROWSER.base_url+'index.php/conframe_bi/get_data_fias/',
        type: 'POST',
        data: {"id": BEOM_BROWSER.nodes._data[BEOM_BROWSER.active_element]['db_id']},		
    });
    query.done(function (response, textStatus, jqXHRб){
    result = JSON.parse(response);
    console.log(result)
    data = result[0];
    var dialog = CFUtil.dialog.create('save_window',{
                            title: 'Информация ФИАС', 
                            autoOpen: false,
                            height: "auto",
                            position: "right top",
                            width: 300,
                            modal: false		
                    });
    html_text = '<table class="table table-condensed" style="font-size:12px">';
    /*for ( option in data ){
            html_text += '<tr><td><label>'+option+'</label></td><td>'+(data[option]!=null ? data[option]:'-')+'</td></tr>';
    }*/
    html_text += '<tr><td><label>Официальное название</label></td><td>'+(data['formalname']!=null ? data['formalname']:'-')+'</td></tr>';
    html_text += '<tr><td><label>Наименование</label></td><td>'+(data['offname']!=null ? data['offname']:'-')+'</td></tr>';
    html_text += '<tr><td><label>Сокращенное имя</label></td><td>'+(data['shortname']!=null ? data['shortname']:'-')+'</td></tr>';
    html_text += '<tr><td><label>Код региона</label></td><td>'+(data['regioncode']!=null ? data['regioncode']:'-')+'</td></tr>';
    html_text += '<tr><td><label>Почтовый индекс</label></td><td>'+(data['postalcode']!=null ? data['postalcode']:'-')+'</td></tr>';
    html_text += '</table>';
    $("#save_window").html(html_text)		

    });
}
//конец функции
/*
* функция демонстрации данных субъекта СУР АВР
* 20150127
* Vadim GRITSENKO
*/
BEOM_BROWSER.show_data_suravr_subject = function(){
    $('#pop_up_window').remove();
    query = $.ajax({
        url: BEOM_BROWSER.base_url+'index.php/conframe_bi/get_data_suravr_subject/',
        type: 'POST',
        data: {"id": BEOM_BROWSER.nodes._data[BEOM_BROWSER.active_element]['id']},		
    });
    query.done(function (response, textStatus, jqXHRб){
        result = JSON.parse(response);
        console.log(result)
        data = result[0];
        var dialog = CFUtil.dialog.create('save_window',{
            title: 'Информация (СУРР АВР)',
            autoOpen: false,
            height: "auto",
            position: "right top",
            width: 300,
            modal: false
        });
        html_text = '<table class="table table-condensed" style="font-size:12px">';
        /*for (option in data){
            html_text += '<tr><td><label>'+option+'</label></td><td>'+(data[option]!=null ? data[option]:'-')+'</td></tr>';
        }*/
        html_text += '<tr><td><label>Наименование</label></td><td>'+(data['name']!=null ? data['name']:'-')+'</td></tr>';
        html_text += '<tr><td><label>Код</label></td><td>'+(data['code']!=null ? data['code']:'-')+'</td></tr>';
        html_text += '<tr><td><label>Тип</label></td><td>'+(data['type']!=null ? data['type']:'-')+'</td></tr>';
        html_text += '</table>';
        $("#save_window").html(html_text);
    });
}
//конец функции
/*
* функция демонстрации данных субъекта СУР АВР
* 20150127
* Vadim GRITSENKO
*/
BEOM_BROWSER.show_data_cntrl_center_subject = function(){
    $('#pop_up_window').remove();
    id = BEOM_BROWSER.nodes._data[BEOM_BROWSER.active_element]['group'] == 'extra_nodes' ? BEOM_BROWSER.nodes._data[BEOM_BROWSER.active_element]['db_id'] : BEOM_BROWSER.nodes._data[BEOM_BROWSER.active_element]['id'];
    query = $.ajax({
        url: BEOM_BROWSER.base_url+'index.php/conframe_bi/get_data_cntrl_center_subject/',
        type: 'POST',
        data: {"id": id},
    });
    query.done(function (response, textStatus, jqXHRб){
        result = JSON.parse(response);
        console.log(result);
        data = result[0];
        var dialog = CFUtil.dialog.create('save_window',{
            title: 'Информация (Центр управления)', 
            autoOpen: false,
            height: "auto",
            position: "right top",
            width: 300,
            modal: false
        });
        html_text = '<table class="table table-condensed" style="font-size:12px">';
        /*for (option in data){
            html_text += '<tr><td><label>'+option+'</label></td><td>'+(data[option]!=null ? data[option]:'-')+'</td></tr>';
        }*/
        html_text += '<tr><td><label>Наименование</label></td><td>'+(data['name']!=null ? data['name']:'-')+'</td></tr>';
        html_text += '<tr><td><label>Аббревиатура</label></td><td>'+(data['abbrev']!=null ? data['abbrev']:'-')+'</td></tr>';
        html_text += '<tr><td><label>Факс</label></td><td>'+(data['fax']!=null ? data['fax']:'-')+'</td></tr>';
        html_text += '<tr><td><label>Тип</label></td><td>'+(data['type']!=null ? data['type']:'-')+'</td></tr>';
        html_text += '</table>';
        $("#save_window").html(html_text);
    });
}
//конец функции
/*
 * функция демонстрации данных
 * 20150123
 * Vadim GRITSENKO
 */
BEOM_BROWSER.show_data_substation = function(){
    $('#pop_up_window').remove();
    if (BEOM_BROWSER.nodes._data[BEOM_BROWSER.active_element]['db_id']) {
        query = $.ajax({
            url: BEOM_BROWSER.base_url+'index.php/conframe_bi/get_data_stn/',
            type: 'POST',
            data: {"id": BEOM_BROWSER.nodes._data[BEOM_BROWSER.active_element]['db_id']},		
        });
        query.done(function (response, textStatus, jqXHRб){
            result = JSON.parse(response);
            data = result[0];
            var dialog = CFUtil.dialog.create('save_window',{
                title: 'Информация (подстанция)', 
                autoOpen: false,
                height: "auto",
                position: "right top",
                width: 300,
                modal: false
            });
            html_text = '<table class="table table-condensed" style="font-size:12px">';
            html_text += '<tr><td><label>Наименование</label></td><td>'+(data['name']!=null ? data['name']:'-')+'</td></tr>';
            html_text += '<tr><td><label>Диспетчерское наименование</label></td><td>'+(data['name_edit']!=null ? data['name_edit']:'-')+'</td></tr>';
            html_text += '<tr><td><label>Номинальное напряжение</label></td><td>'+(data['voltage']!=null ? data['voltage']+' кВ':'-')+'</td></tr>';
            html_text += '<tr><td><label>Орг. структура</label></td><td>'+(data['org_struct_name']!=null ? data['org_struct_name']:'-')+'</td></tr>';
            html_text += '</table>';
            $("#save_window").html(html_text);
        });
    }
}
//конец функции
/*
 * функция для добавления линий
 * Vadim GRITSENKO
 * 20150212
 */
BEOM_BROWSER.get_lines = function(db,shm,tbl){
    if (BEOM_BROWSER.nodes.get('lines_'+BEOM_BROWSER.active_element) != null){
        BEOM_BROWSER.remove_nodes_edges('lines_'+BEOM_BROWSER.active_element);
        BEOM_BROWSER.nodes.remove('lines_'+BEOM_BROWSER.active_element);
        for (var i in BEOM_BROWSER.edges["_data"]){
            if (BEOM_BROWSER.edges["_data"][i]["to"] == 'lines_'+BEOM_BROWSER.active_element){
                BEOM_BROWSER.edges.remove(BEOM_BROWSER.edges["_data"][i]["id"]);
            }
        }
        BEOM_BROWSER.active_element = null;
        $('#pop_up_window').remove();
    }
    else {
        $.ajax({
            url: BEOM_BROWSER.base_url+'index.php/conframe_bi/get_lines/'+BEOM_BROWSER.active_element,
            type: 'POST',
            data: {
                "name_db": db,
                "id": BEOM_BROWSER.active_element,
            },
            success: function(data){
                var info = JSON.parse(data);
                if (info != null && info.length != 0){
                    BEOM_BROWSER.add_lines(info);
                    //console.log(info);
                }
                else {
                    output_message('Нет линий', 'alert-danger');//переделать на lang //Vadim GRITSENKO
                }
                BEOM_BROWSER.active_element = null;
                $('#pop_up_window').remove();
            }
        });
    }
}
/*
 * функция для рисования линий
 * Vadim GRITSENKO
 * 20150212
 */
BEOM_BROWSER.add_lines = function(data){
    var nodes = [];
    var edges = [];
    nodes.push({
        id: 'lines_'+BEOM_BROWSER.active_element,
        label: 'Линии',
        group: 'lines'
    });
    for (var i=0; i<data.length; i++){
        nodes.push({
            id: 'lines_'+data[i]["id"],
            db_id: data[i]["id"],
            label: data[i]["name"],
            color: BEOM_BROWSER.color_voltage['txt_'+data[i]["voltage"]+'_kv'],
            hover: BEOM_BROWSER.color_voltage['txt_'+data[i]["voltage"]+'_kv'],
            highlight: BEOM_BROWSER.color_voltage['txt_'+data[i]["voltage"]+'_kv'],
            radius: 7,
            group: 'lines'
        });
    }
    BEOM_BROWSER.nodes.add(nodes);
    edges.push({
        from: BEOM_BROWSER.active_element,
        to: 'lines_'+BEOM_BROWSER.active_element,
        style: 'dash-line',
        color: {
            color: '#FFA07A',
            hover: '#FFA07A',
            highlight: '#FFA07A'
        },
        widthSelectionMultiplier: 1,
        length: 350, 
        width: 2,
        label: '',
        fontColor: '#FFA07A',
        fontFill: BEOM_BROWSER.background_color
    });
    for (var i=0; i<data.length; i++){
        edges.push({
            from: 'lines_'+BEOM_BROWSER.active_element,
            to: 'lines_'+data[i]["id"],
            style: 'line',
            color: {
                color: BEOM_BROWSER.color_voltage['txt_'+data[i]["voltage"]+'_kv'],
                hover: BEOM_BROWSER.color_voltage['txt_'+data[i]["voltage"]+'_kv'],
                highlight: BEOM_BROWSER.color_voltage['txt_'+data[i]["voltage"]+'_kv']
            },
            widthSelectionMultiplier: 1,
            width: 2,
            label: '',
            fontColor: '#FFA07A',
            fontFill: BEOM_BROWSER.background_color
        });
    }
    BEOM_BROWSER.edges.add(edges);
}
//конец функции
/*
 * функция демонстрации данных линии
 * 20150212
 * Vadim GRITSENKO
 */
BEOM_BROWSER.show_data_line = function(){
    $('#pop_up_window').remove();
    id = BEOM_BROWSER.nodes._data[BEOM_BROWSER.active_element]['db_id']
    query = $.ajax({
        url: BEOM_BROWSER.base_url+'index.php/conframe_bi/get_data_line/',
        type: 'POST',
        data: {"id": id},		
    });
    query.done(function (response, textStatus, jqXHRб){
        result = JSON.parse(response);
        console.log(result);
        data = result[0];
        var dialog = CFUtil.dialog.create('save_window',{
            title: 'Информация (линия)', 
            autoOpen: false,
            height: "auto",
            position: "right top",
            width: 400,
            modal: false
        });
        html_text = '<table class="table table-condensed" style="font-size:12px">';
        /*for (option in data){
            html_text += '<tr><td><label>'+option+'</label></td><td>'+(data[option]!=null ? data[option]:'-')+'</td></tr>';
        }*/
        html_text += '<tr><td><label>Наименование</label></td><td>'+(data['name']!=null ? data['name']:'-')+'</td></tr>';
        html_text += '<tr><td><label>Диспетчерское наименование</label></td><td>'+(data['name_edit']!=null ? data['name_edit']:'-')+'</td></tr>';
        html_text += '<tr><td><label>Номинальное напряжение</label></td><td>'+(data['voltage']!=null ? data['voltage']+' кВ':'-')+' </td></tr>';
        html_text += '<tr><td><label>Идентификатор</label></td><td>'+(data['identificator']!=null ? data['identificator']:'-')+' </td></tr>';
        html_text += '<tr><td><label>Орг.структура</label></td><td>'+(data['org_struct_name']!=null ? data['org_struct_name']:'-')+' </td></tr>';
        html_text += '</table>';
        $("#save_window").html(html_text);
    });
}
//конец функции
/*
 * функция формирования окна сообщения о выполнении какой-либо операции
 * Vadim GRITSENKO
 * 20150217
 */
function output_message(text,class_alarm){
    var dialog =new CFEAlert('');
    dialog.set_message(text);
    dialog.set_type(class_alarm);
    dialog.show_message();
}
//конец функции output_message(result['msg'], 'alert-danger');