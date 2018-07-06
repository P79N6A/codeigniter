/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var ISOM = {
    top_menu_div:EDOM.top_menu_div,
    left_menu_div:EDOM.left_menu_div,
    content_div:EDOM.content_div,
    splash_div:EDOM.splash_div,
    splash_screen:'',
    base_url:EDOM.base_url,
    linker_tree:'',
    save_history:true
};

ISOM.load_top_menu = function() {
    html = $.ajax({
        url: EDOM.base_url+"index.php/edom/menu/isom",
        type: "POST"
    }).done(function (response, textStatus, jqXHRб){
        if(response){
        	$('#'+EDOM.top_menu_div).html(response);
        }
    });
}
/*
 * 
 */
ISOM.new_isom = function() {
    html = $.ajax({
        url: EDOM.base_url+"index.php/qcore/ajax/load_form/edom/beom",
        type: "POST"
    }).done(function (response, textStatus, jqXHRб){
        if(response){
        	$('#'+EDOM.content_div).html(response);
        }
    });
}
/*
 * 
 */
ISOM.isom_list = function() {
    html = $.ajax({
        url: EDOM.base_url+"index.php/edom/beom_list",
        type: "POST"
    }).done(function (response, textStatus, jqXHRб){
        if(response){
        	$('#'+EDOM.content_div).html(response);
        }
    });
}

/*
 * генерирование таблицы систем
 * Vadim GRITSENKO
 */
ISOM.system_list = function(view) {
    ISOM.clear_content();
    if (EDOM.save_history==true) {
        EDOM.push_history({ page: "system_list", type: view },'edom?app=ISOM&page=system_list&type='+view);
    }
	CFUtil.datatable.table_open('<table id="example" width="100%">');
    CFUtil.datatable.set_header(['',langs.get_term("txt_name"),langs.get_term("txt_description"),langs.get_term("txt_code"),langs.get_term("txt_options")]);
    content='<div class="panel panel-default" style="float: right"><div class="panel-heading">';
    content+='<button type="button" class="btn btn-primary btn-xs" onclick="create_system(\''+view+'\')">'+langs.get_term("txt_create_"+view)+'</button></div><div class="panel-body">';
    content+=CFUtil.datatable.generate()+'</div></div>';
	
	$('#'+EDOM.content_div).html(content);
	
    $("#example").dataTable({
        "sPaginationType": "full_numbers",
        "bProcessing": true,
        "bServerSide": true,
        "sAjaxSource": ISOM.base_url+"edom/isom/get_list/"+view,
        "sServerMethod": "POST",
        "aoColumnDefs":	[{ "bVisible": false, "aTargets": [ 0 ] }],
        "aaSorting": [[ 1, "asc" ]],
		"aoColumns": [null,null,null,{ "sWidth": "120px"},{ "sWidth": "100px","bSortable": false }],
        "iDisplayLength": 25
    });
    EDOM.save_history=true;
}

ISOM.clear_content = function() {
    $('#'+EDOM.content_div).html("");
	$('#'+EDOM.left_menu_div).html("");
}
/*
 *
 */
ISOM.hide_left_menu = function() {
    $('#'+EDOM.left_menu_div).hide();
}

create_system = function(view){
	var dialog =CFUtil.dialog.create("save_window",
	{
		title: langs.get_term("txt_create_"+view), 
		autoOpen: false,
		height: "auto",
		width: 400,
		modal: true
	}).bind('dialogclose', function(event) {
		ISOM.reload_page(view);
	});
	if ( dialog ){
		html = $.ajax({     
			url: ISOM.base_url+"qcore/ajax/load_form/edom/q"+view,    
			type: "POST"         
		}).done(function (response, textStatus, jqXHRб){
			$(dialog).html(response); 
		});
	}
}

ISOM.reload_page=function (name){
	ISOM.system_list(name);
}

edit_system = function(id,view){
	var dialog =CFUtil.dialog.create("save_window",
	{
		title: langs.get_term("txt_edit_"+view), 
		autoOpen: false,
		height: "auto",
		width: 400,
		modal: true
	}).bind('dialogclose', function(event) {
		ISOM.reload_page(view);
	});
	if ( dialog ){
		html = $.ajax({     
			url: ISOM.base_url+"qcore/ajax/edit_form/edom/q"+view+"/"+id,    
			type: "POST"         
		}).done(function (response, textStatus, jqXHRб){
			$(dialog).html(response); 
		});
	}
}
/*
 * 
 */
ISOM.load_splash = function() {
    EDOM.load_splash();
}
/*
 *  CKharitonov
 */
ISOM.open_topology = function(type,id) {
	//EDOM.clear_content();
    if (EDOM.save_history==true) {
        EDOM.push_history({ page: "open_topology", type: type, id: id },'edom?app=ISOM&page=open_topology&type='+type+'&id='+id);
    }
    if (type == 'element') {
    	url = ISOM.base_url+'edom/isom/get_link_type_info/'+type+'/'+id;
    }
    else {
    	url = ISOM.base_url+'edom/isom/get_qsystem_info/'+type+'/'+id;
    }
    $.ajax({
        url: url,
        type: 'POST',
        async: false,
        success: function(data){
            info = data;
            try{var data = JSON.parse(String(info));}catch(e){}
            ISOM.load_info(type,data);
            ISOM.load_topology_tree(type,data);
        }
    }); 
    EDOM.save_history=true;
}
/*
 *  CKharitonov
 */
ISOM.get_top_topology = function() {
    $.ajax({
        url: ISOM.base_url+'edom/isom/get_qsystem_info/'+EDOM.get("top_type")+'/'+EDOM.get("top_id"),
        type: 'POST',
        async: false,
        success: function(data){
            info = data;
            if (info != '') {
                try{var data = JSON.parse(String(info));}catch(e){}
            }
            ISOM.load_topology_tree(EDOM.get("top_type"),data);
        }
    });
}
/*
 *  CKharitonov
 */
ISOM.info_view = function(type,id) {
    if (EDOM.save_history==true) {
        if (EDOM.get("top_type") && EDOM.get("top_id")){
            EDOM.push_history({ page: "info_view", type: type, id: id, top_type: EDOM.get("top_type"), top_id: EDOM.get("top_id") },'edom?app=ISOM&page=info_view&type='+type+'&id='+id+'&top_type='+EDOM.get("top_type")+'&top_id='+EDOM.get("top_id"));
        }
        else {
            EDOM.push_history({ page: "info_view", type: type, id: id, top_type: EDOM.get("top_type"), top_id: EDOM.get("top_id") },'edom?app=ISOM&page=info_view&type='+type+'&id='+id+'&top_type='+EDOM.get("type")+'&top_id='+EDOM.get("id"));
        }
    }
    if (type == 'element') {
    	url = ISOM.base_url+'edom/isom/get_link_type_info/'+type+'/'+id;
    }
    else {
    	url = ISOM.base_url+'edom/isom/get_qsystem_info/'+type+'/'+id;
    }
    $.ajax({
        url: url,
        type: 'POST',
        async: false,
        success: function(data){
            info = data;
            if (info != '') {
                try{var data = JSON.parse(String(info));}catch(e){}
            }
            ISOM.load_info(type,data);
        }
    });
    EDOM.save_history=true;
}
/*
 *  CKharitonov
 */
update_component_id = function(id,name,form,count) {
    $.ajax({
        url: ISOM.base_url+'edom/isom/add_linker/'+form+'/'+id+'/q'+EDOM.get("type")+'/'+EDOM.get("id"),
    });
    ISOM[EDOM.get("page")](EDOM.get("type"),EDOM.get("id"));
    if (EDOM.get("page") != 'open_topology') {
        ISOM.get_top_topology();
    }
}
/*
 *  CKharitonov
 */
ISOM.load_info = function(type,data) {
    var info = '';
    info += '<div class="panel panel-default">';
    info += '<div class="panel-heading">';
    view = data[0];
    if (type == 'system') {
    	info += '<span class="badge badge-inverse">'+langs.get_term("txt_system")+'</span>';
    	button = '<tr><td colspan="2"><button type="button" class="btn btn-primary btn-xs" onclick="open_lookup_window(\'edom\',\'qsystem\',\'isom\',\'qapp\','+EDOM.get("id")+')">'+langs.get_term("txt_add")+' '+langs.get_term("txt_application")+'</button></td></tr>';
    }
    else if (type == 'app') {
    	info += '<span class="badge badge-important">'+langs.get_term("txt_application")+'</span>';
    	button = '<tr><td colspan="2"><button type="button" class="btn btn-primary btn-xs" onclick="open_lookup_window(\'edom\',\'qapp\',\'isom\',\'qmodule\','+EDOM.get("id")+')">'+langs.get_term("txt_add")+' '+langs.get_term("txt_module")+'</button>&nbsp;<button type="button" class="btn btn-primary btn-xs" onclick="open_lookup_window(\'edom\',\'qapp\',\'isom\',\'qcomponent\','+EDOM.get("id")+')">'+langs.get_term("txt_add")+' '+langs.get_term("txt_component")+'</button>&nbsp;<button type="button" class="btn btn-primary btn-xs" onclick="open_lookup_window(\'edom\',\'qapp\',\'isom\',\'qunit\','+EDOM.get("id")+')">'+langs.get_term("txt_add")+' '+langs.get_term("txt_unit")+'</button>&nbsp;<button type="button" class="btn btn-primary btn-xs" onclick="open_lookup_window(\'edom\',\'qapp\',\'isom\',\'qelement\','+EDOM.get("id")+')">'+langs.get_term("txt_add")+' '+langs.get_term("txt_element")+'</button></td></tr>';
    }
    else if (type == 'module') {
    	info += '<span class="badge badge-warning">'+langs.get_term("txt_module")+'</span>';
    	button = '<tr><td colspan="2"><button type="button" class="btn btn-primary btn-xs" onclick="open_lookup_window(\'edom\',\'qmodule\',\'isom\',\'qcomponent\','+EDOM.get("id")+')">'+langs.get_term("txt_add")+' '+langs.get_term("txt_component")+'</button>&nbsp;<button type="button" class="btn btn-primary btn-xs" onclick="open_lookup_window(\'edom\',\'qmodule\',\'isom\',\'qunit\','+EDOM.get("id")+')">'+langs.get_term("txt_add")+' '+langs.get_term("txt_unit")+'</button>&nbsp;<button type="button" class="btn btn-primary btn-xs" onclick="open_lookup_window(\'edom\',\'qmodule\',\'isom\',\'qelement\','+EDOM.get("id")+')">'+langs.get_term("txt_add")+' '+langs.get_term("txt_element")+'</button></td></tr>';
    }
    else if (type == 'component') {
    	info += '<span class="badge badge-success">'+langs.get_term("txt_component")+'</span>';
    	button = '<tr><td colspan="2"><button type="button" class="btn btn-primary btn-xs" onclick="open_lookup_window(\'edom\',\'qcomponent\',\'isom\',\'qunit\','+EDOM.get("id")+')">'+langs.get_term("txt_add")+' '+langs.get_term("txt_unit")+'</button>&nbsp;<button type="button" class="btn btn-primary btn-xs" onclick="open_lookup_window(\'edom\',\'qcomponent\',\'isom\',\'qelement\','+EDOM.get("id")+')">'+langs.get_term("txt_add")+' '+langs.get_term("txt_element")+'</button></td></tr>';
    }
    else if (type == 'unit') {
    	info += '<span class="badge badge-info">'+langs.get_term("txt_unit")+'</span>';
    	button = '<tr><td colspan="2"><button type="button" class="btn btn-primary btn-xs" onclick="open_lookup_window(\'edom\',\'qunit\',\'isom\',\'qelement\','+EDOM.get("id")+')">'+langs.get_term("txt_add")+' '+langs.get_term("txt_element")+'</button></td></tr>';
    }
    else if (type == 'element') {
    	info += '<span class="badge">'+langs.get_term("txt_element")+'</span>';
    	button = '';
    	view = data;
    }
    info += '&nbsp;&nbsp;&nbsp;<b>'+view["name"]+'</b></div>';
    info += '<div class="panel-body">';
    info += '<table class="table table-bordered table-striped table-condensed"><tbody>';
    info += '<tr><td width="30%"><b>'+langs.get_term("txt_name")+'</b></td><td width="70%">'+view["name"]+'</td></tr>';
    info += '<tr><td><b>'+langs.get_term("txt_code")+'</b></td><td>'+view["code"]+'</td></tr>';
    info += '<tr><td><b>'+langs.get_term("txt_description")+'</b></td><td>'+view["description"]+'</td></tr>';
    info += button;
    info += '</tbody></table>';
    info += '</div></div>';
    $('#'+EDOM.content_div).html(info);
}

ISOM.load_linker = function(linker) {
    //var topology_tree = '';
    if (linker) {
        for (j=0; j<linker.length; ++j) {
            if (linker[j]["link_type"] == 'qmodule') {
            	ISOM.linker_tree += "qm->"+linker[j].qmodule.name+"<br>";
            	ISOM.load_linker(linker[j].qmodule.linker);
            }
            if (linker[j]["link_type"] == 'qcomponent') {
                ISOM.linker_tree += "qc->"+linker[j].qcomponent.name+"<br>";
                ISOM.load_linker(linker[j].qcomponent.linker);
            }
        }
    }
    return ISOM.linker_tree;
}
/*
 *  CKharitonov
 */
ISOM.load_topology_tree = function(type,data) {
	var topology_tree = '';
	topology_tree += '<div class="panel panel-default">';
    topology_tree += '<div class="panel-heading"><b>'+langs.get_term("txt_topology")+'</b></div>';
    topology_tree += '<div class="sidetree" id="sidetree">';
    topology_tree += '<div class="panel-body" id="topology" style="overflow:auto;"><ul id="browser" class="filetree treeview"><ul>';
    if (data) {
    	for (i in data) {

            ///topology_tree += ISOM.load_linker(data["qapp"][i]["linker"]);
            //ISOM.linker_tree = '';

            if (type == 'system') {
   				topology_tree += '<li class="closed"><div class="hitarea collapsable-hitarea"></div><span class="badge badge-inverse">S</span>&nbsp;<span onclick="ISOM.info_view(\'system\','+data[i]["qsystem_id"]+')">'+data[i]["name"]+'</span><ul>';
   			}
            else if (type == 'app') {
                topology_tree += '<li class="closed"><div class="hitarea collapsable-hitarea"></div><span class="badge badge-important">A</span>&nbsp;<span onclick="ISOM.info_view(\'app\','+data[i]["qapp_id"]+')">'+data[i]["name"]+'</span><ul>';
            }
   			else if (type == 'module') {
   				topology_tree += '<li class="closed"><div class="hitarea collapsable-hitarea"></div><span class="badge badge-warning">M</span>&nbsp;<span onclick="ISOM.info_view(\'module\','+data[i]["qmodule_id"]+')">'+data[i]["name"]+'</span><ul>';
   			}
   			else if (type == 'component') {
   				topology_tree += '<li class="closed"><div class="hitarea collapsable-hitarea"></div><span class="badge badge-success">C</span>&nbsp;<span onclick="ISOM.info_view(\'component\','+data[i]["qcomponent_id"]+')">'+data[i]["name"]+'</span><ul>';
   			}
   			else if (type == 'unit') {
   				topology_tree += '<li class="closed"><div class="hitarea collapsable-hitarea"></div><span class="badge badge-info">U</span>&nbsp;<span onclick="ISOM.info_view(\'unit\','+data[i]["qunit_id"]+')">'+data[i]["name"]+'</span><ul>';
   			}
   			else if (type == 'element') {
   				topology_tree += '<li><span class="badge">E</span>&nbsp;<span style="cursor:pointer;" onclick="ISOM.info_view(\'element\','+data["qelement_id"]+')">'+data["name"]+'</span></li>';
                break;
            }
   			if (data[i]["linker"]) {
   				for (j=0; j<data[i]["linker"].length; ++j) {
   					if (data[i]["linker"][j]["link_type"] == 'qapp') {
   						topology_tree += '<li class="closed"><div class="hitarea collapsable-hitarea"></div><span class="badge badge-important">A</span>&nbsp;<span onclick="ISOM.info_view(\'app\','+data[i]["linker"][j]["qapp"]["qapp_id"]+')">'+data[i]["linker"][j]["qapp"]["name"]+'</span><ul>';
                        if (data[i]["linker"][j]["qapp"]["linker"]) {
   							for (c=0; c<data[i]["linker"][j]["qapp"]["linker"].length; ++c) {	
                                if (data[i]["linker"][j]["qapp"]["linker"][c]["link_type"] == 'qmodule') {
   									topology_tree += '<li class="closed"><div class="hitarea collapsable-hitarea"></div><span class="badge badge-warning">M</span>&nbsp;<span onclick="ISOM.info_view(\'module\','+data[i]["linker"][j]["qapp"]["linker"][c]["qmodule"]["qmodule_id"]+')">'+data[i]["linker"][j]["qapp"]["linker"][c]["qmodule"]["name"]+'</span><ul>';
   									if (data[i]["linker"][j]["qapp"]["linker"][c]["qmodule"]["linker"]) {
                                        for (u=0; u<data[i]["linker"][j]["qapp"]["linker"][c]["qmodule"]["linker"].length; ++u) {
                                            if (data[i]["linker"][j]["qapp"]["linker"][c]["qmodule"]["linker"][u]["link_type"] == 'qcomponent') {
			   									topology_tree += '<li class="closed"><div class="hitarea collapsable-hitarea"></div><span class="badge badge-success">C</span>&nbsp;<span onclick="ISOM.info_view(\'component\','+data[i]["linker"][j]["qapp"]["linker"][c]["qmodule"]["linker"][u]["qcomponent"]["qcomponent_id"]+')">'+data[i]["linker"][j]["qapp"]["linker"][c]["qmodule"]["linker"][u]["qcomponent"]["name"]+'</span><ul>';
			   									if (data[i]["linker"][j]["qapp"]["linker"][c]["qmodule"]["linker"][u]["qcomponent"]["linker"]) {
						   							for (e=0; e<data[i]["linker"][j]["qapp"]["linker"][c]["qmodule"]["linker"][u]["qcomponent"]["linker"].length; ++e) {
						   								if (data[i]["linker"][j]["qapp"]["linker"][c]["qmodule"]["linker"][u]["qcomponent"]["linker"][e]["link_type"] == 'qunit') {
						   									topology_tree += '<li class="closed"><div class="hitarea collapsable-hitarea"></div><span class="badge badge-info">U</span>&nbsp;<span style="cursor:pointer;" onclick="ISOM.info_view(\'unit\','+data[i]["linker"][j]["qapp"]["linker"][c]["qmodule"]["linker"][u]["qcomponent"]["linker"][e]["qunit"]["qunit_id"]+')">'+data[i]["linker"][j]["qapp"]["linker"][c]["qmodule"]["linker"][u]["qcomponent"]["linker"][e]["qunit"]["name"]+'</span><ul>';
                                                            if (data[i]["linker"][j]["qapp"]["linker"][c]["qmodule"]["linker"][u]["qcomponent"]["linker"][e]["qunit"]["linker"]) {
                                                                for (a=0; a<data[i]["linker"][j]["qapp"]["linker"][c]["qmodule"]["linker"][u]["qcomponent"]["linker"][e]["qunit"]["linker"].length; ++a) {
                                                                    if (data[i]["linker"][j]["qapp"]["linker"][c]["qmodule"]["linker"][u]["qcomponent"]["linker"][e]["qunit"]["linker"][a]["link_type"] == 'qelement') {
                                                                        topology_tree += '<li><span class="badge">E</span>&nbsp;<span style="cursor:pointer;" onclick="ISOM.info_view(\'element\','+data[i]["linker"][j]["qapp"]["linker"][c]["qmodule"]["linker"][u]["qcomponent"]["linker"][e]["qunit"]["linker"][a]["qelement"]["qelement_id"]+')">'+data[i]["linker"][j]["qapp"]["linker"][c]["qmodule"]["linker"][u]["qcomponent"]["linker"][e]["qunit"]["linker"][a]["qelement"]["name"]+'</span></li>';
                                                                    }
                                                                }
                                                            }
                                                            topology_tree += '</ul>';
                                                        }
                                                        if (data[i]["linker"][j]["qapp"]["linker"][c]["qmodule"]["linker"][u]["qcomponent"]["linker"][e]["link_type"] == 'qelement') {
                                                            topology_tree += '<li><span class="badge">E</span>&nbsp;<span style="cursor:pointer;" onclick="ISOM.info_view(\'element\','+data[i]["linker"][j]["qapp"]["linker"][c]["qmodule"]["linker"][u]["qcomponent"]["linker"][e]["qelement"]["qelement_id"]+')">'+data[i]["linker"][j]["qapp"]["linker"][c]["qmodule"]["linker"][u]["qcomponent"]["linker"][e]["qelement"]["name"]+'</span></li>';
                                                        }
						   							}
						   						}
						   						topology_tree += '</ul>';
			   								}
                                            if (data[i]["linker"][j]["qapp"]["linker"][c]["qmodule"]["linker"][u]["link_type"] == 'qunit') {
                                                topology_tree += '<li class="closed"><div class="hitarea collapsable-hitarea"></div><span class="badge badge-info">U</span>&nbsp;<span onclick="ISOM.info_view(\'unit\','+data[i]["linker"][j]["qapp"]["linker"][c]["qmodule"]["linker"][u]["qunit"]["qunit_id"]+')">'+data[i]["linker"][j]["qapp"]["linker"][c]["qmodule"]["linker"][u]["qunit"]["name"]+'</span><ul>';
                                                if (data[i]["linker"][j]["qapp"]["linker"][c]["qmodule"]["linker"][u]["qunit"]["linker"]) {
                                                    for (e=0; e<data[i]["linker"][j]["qapp"]["linker"][c]["qmodule"]["linker"][u]["qunit"]["linker"].length; ++e) {
                                                        if (data[i]["linker"][j]["qapp"]["linker"][c]["qmodule"]["linker"][u]["qunit"]["linker"][e]["link_type"] == 'qelement') {
                                                            topology_tree += '<li><span class="badge">E</span>&nbsp;<span style="cursor:pointer;" onclick="ISOM.info_view(\'element\','+data[i]["linker"][j]["qapp"]["linker"][c]["qmodule"]["linker"][u]["qunit"]["linker"][e]["qelement"]["qelement_id"]+')">'+data[i]["linker"][j]["qapp"]["linker"][c]["qmodule"]["linker"][u]["qunit"]["linker"][e]["qelement"]["name"]+'</span></li>';
                                                        }
                                                    }
                                                }
                                                topology_tree += '</ul>';
                                            }
                                            if (data[i]["linker"][j]["qapp"]["linker"][c]["qmodule"]["linker"][u]["link_type"] == 'qelement') {
                                                topology_tree += '<li><span class="badge">E</span>&nbsp;<span style="cursor:pointer;" onclick="ISOM.info_view(\'element\','+data[i]["linker"][j]["qapp"]["linker"][c]["qmodule"]["linker"][u]["qelement"]["qelement_id"]+')">'+data[i]["linker"][j]["qapp"]["linker"][c]["qmodule"]["linker"][u]["qelement"]["name"]+'</span></li>';
                                            }
			   							}
			   						}
			   						topology_tree += '</ul>';
   								}
   								if (data[i]["linker"][j]["qapp"]["linker"][c]["link_type"] == 'qcomponent') {
   									topology_tree += '<li class="closed"><div class="hitarea collapsable-hitarea"></div><span class="badge badge-success">C</span>&nbsp;<span onclick="ISOM.info_view(\'component\','+data[i]["linker"][j]["qapp"]["linker"][c]["qcomponent"]["qcomponent_id"]+')">'+data[i]["linker"][j]["qapp"]["linker"][c]["qcomponent"]["name"]+'</span><ul>';
                                    if (data[i]["linker"][j]["qapp"]["linker"][c]["qcomponent"]["linker"]) {
                                        for (u=0; u<data[i]["linker"][j]["qapp"]["linker"][c]["qcomponent"]["linker"].length; ++u) {
                                            if (data[i]["linker"][j]["qapp"]["linker"][c]["qcomponent"]["linker"][u]["link_type"] == 'qunit') {
                                                topology_tree += '<li class="closed"><div class="hitarea collapsable-hitarea"></div><span class="badge badge-info">U</span>&nbsp;<span onclick="ISOM.info_view(\'unit\','+data[i]["linker"][j]["qapp"]["linker"][c]["qcomponent"]["linker"][u]["qunit"]["qunit_id"]+')">'+data[i]["linker"][j]["qapp"]["linker"][c]["qcomponent"]["linker"][u]["qunit"]["name"]+'</span><ul>';
                                                if (data[i]["linker"][j]["qapp"]["linker"][c]["qcomponent"]["linker"][u]["qunit"]["linker"]) {
                                                    for (e=0; e<data[i]["linker"][j]["qapp"]["linker"][c]["qcomponent"]["linker"][u]["qunit"]["linker"].length; ++e) {
                                                        if (data[i]["linker"][j]["qapp"]["linker"][c]["qcomponent"]["linker"][u]["qunit"]["linker"][e]["link_type"] == 'qelement') {
                                                            topology_tree += '<li><span class="badge">E</span>&nbsp;<span style="cursor:pointer;" onclick="ISOM.info_view(\'element\','+data[i]["linker"][j]["qapp"]["linker"][c]["qcomponent"]["linker"][u]["qunit"]["linker"][e]["qelement"]["qelement_id"]+')">'+data[i]["linker"][j]["qapp"]["linker"][c]["qcomponent"]["linker"][u]["qunit"]["linker"][e]["qelement"]["name"]+'</span></li>';
                                                        }
                                                    }
                                                }
                                                topology_tree += '</ul>';
                                            }
                                            if (data[i]["linker"][j]["qapp"]["linker"][c]["qcomponent"]["linker"][u]["link_type"] == 'qelement') {
                                                topology_tree += '<li><span class="badge">E</span>&nbsp;<span style="cursor:pointer;" onclick="ISOM.info_view(\'element\','+data[i]["linker"][j]["qapp"]["linker"][c]["qcomponent"]["linker"][u]["qelement"]["qelement_id"]+')">'+data[i]["linker"][j]["qapp"]["linker"][c]["qcomponent"]["linker"][u]["qelement"]["name"]+'</span></li>';
                                            }
                                        }
                                    }
                                    topology_tree += '</ul>';
                                }
   								if (data[i]["linker"][j]["qapp"]["linker"][c]["link_type"] == 'qunit') {
   									topology_tree += '<li class="closed"><div class="hitarea collapsable-hitarea"></div><span class="badge badge-info">U</span>&nbsp;<span onclick="ISOM.info_view(\'unit\','+data[i]["linker"][j]["qapp"]["linker"][c]["qunit"]["qunit_id"]+')">'+data[i]["linker"][j]["qapp"]["linker"][c]["qunit"]["name"]+'</span><ul>';
                                    if (data[i]["linker"][j]["qapp"]["linker"][c]["qunit"]["linker"]) {
                                        for (e=0; e<data[i]["linker"][j]["qapp"]["linker"][c]["qunit"]["linker"].length; ++e) {
                                            if (data[i]["linker"][j]["qapp"]["linker"][c]["qunit"]["linker"][e]["link_type"] == 'qelement') {
                                                topology_tree += '<li><span class="badge">E</span>&nbsp;<span style="cursor:pointer;" onclick="ISOM.info_view(\'element\','+data[i]["linker"][j]["qapp"]["linker"][c]["qunit"]["linker"][e]["qelement"]["qelement_id"]+')">'+data[i]["linker"][j]["qapp"]["linker"][c]["qunit"]["linker"][e]["qelement"]["name"]+'</span></li>';
                                            }
                                        }
                                    }
                                    topology_tree += '</ul>';
                                }
                                if (data[i]["linker"][j]["qapp"]["linker"][c]["link_type"] == 'qelement') {
                                    topology_tree += '<li><span class="badge">E</span>&nbsp;<span style="cursor:pointer;" onclick="ISOM.info_view(\'element\','+data[i]["linker"][j]["qapp"]["linker"][c]["qelement"]["qelement_id"]+')">'+data[i]["linker"][j]["qapp"]["linker"][c]["qelement"]["name"]+'</span></li>';
                                }
   							}
   						}
   						topology_tree += '</ul>';
   					}
                    if (data[i]["linker"][j]["link_type"] == 'qmodule') {
                        topology_tree += '<li class="closed"><div class="hitarea collapsable-hitarea"></div><span class="badge badge-warning">M</span>&nbsp;<span onclick="ISOM.info_view(\'module\','+data[i]["linker"][j]["qmodule"]["qmodule_id"]+')">'+data[i]["linker"][j]["qmodule"]["name"]+'</span><ul>';
                        if (data[i]["linker"][j]["qmodule"]["linker"]) {
                            for (c=0; c<data[i]["linker"][j]["qmodule"]["linker"].length; ++c) {
                                if (data[i]["linker"][j]["qmodule"]["linker"][c]["link_type"] == 'qcomponent') {
                                    topology_tree += '<li class="closed"><div class="hitarea collapsable-hitarea"></div><span class="badge badge-success">C</span>&nbsp;<span onclick="ISOM.info_view(\'component\','+data[i]["linker"][j]["qmodule"]["linker"][c]["qcomponent"]["qcomponent_id"]+')">'+data[i]["linker"][j]["qmodule"]["linker"][c]["qcomponent"]["name"]+'</span><ul>';
                                    if (data[i]["linker"][j]["qmodule"]["linker"][c]["qcomponent"]["linker"]) {
                                        for (u=0; u<data[i]["linker"][j]["qmodule"]["linker"][c]["qcomponent"]["linker"].length; ++u) {
                                            if (data[i]["linker"][j]["qmodule"]["linker"][c]["qcomponent"]["linker"][u]["link_type"] == 'qunit') {
                                                topology_tree += '<li class="closed"><div class="hitarea collapsable-hitarea"></div><span class="badge badge-info">U</span>&nbsp;<span onclick="ISOM.info_view(\'unit\','+data[i]["linker"][j]["qmodule"]["linker"][c]["qcomponent"]["linker"][u]["qunit"]["qunit_id"]+')">'+data[i]["linker"][j]["qmodule"]["linker"][c]["qcomponent"]["linker"][u]["qunit"]["name"]+'</span><ul>';
                                                if (data[i]["linker"][j]["qmodule"]["linker"][c]["qcomponent"]["linker"][u]["qunit"]["linker"]) {
                                                    for (e=0; e<data[i]["linker"][j]["qmodule"]["linker"][c]["qcomponent"]["linker"][u]["qunit"]["linker"].length; ++e) {
                                                        if (data[i]["linker"][j]["qmodule"]["linker"][c]["qcomponent"]["linker"][u]["qunit"]["linker"][e]["link_type"] == 'qelement') {
                                                            topology_tree += '<li><span class="badge">E</span>&nbsp;<span style="cursor:pointer;" onclick="ISOM.info_view(\'element\','+data[i]["linker"][j]["qmodule"]["linker"][c]["qcomponent"]["linker"][u]["qunit"]["linker"][e]["qelement"]["qelement_id"]+')">'+data[i]["linker"][j]["qmodule"]["linker"][c]["qcomponent"]["linker"][u]["qunit"]["linker"][e]["qelement"]["name"]+'</span></li>';
                                                        }
                                                    }
                                                }
                                                topology_tree += '</ul>';
                                            }
                                            if (data[i]["linker"][j]["qmodule"]["linker"][c]["qcomponent"]["linker"][u]["link_type"] == 'qelement') {
                                                topology_tree += '<li><span class="badge">E</span>&nbsp;<span style="cursor:pointer;" onclick="ISOM.info_view(\'element\','+data[i]["linker"][j]["qmodule"]["linker"][c]["qcomponent"]["linker"][u]["qelement"]["qelement_id"]+')">'+data[i]["linker"][j]["qmodule"]["linker"][c]["qcomponent"]["linker"][u]["qelement"]["name"]+'</span></li>';
                                            }
                                        }
                                    }
                                    topology_tree += '</ul>';
                                }
                                if (data[i]["linker"][j]["qmodule"]["linker"][c]["link_type"] == 'qunit') {
                                    topology_tree += '<li class="closed"><div class="hitarea collapsable-hitarea"></div><span class="badge badge-info">U</span>&nbsp;<span onclick="ISOM.info_view(\'unit\','+data[i]["linker"][j]["qmodule"]["linker"][c]["qunit"]["qunit_id"]+')">'+data[i]["linker"][j]["qmodule"]["linker"][c]["qunit"]["name"]+'</span><ul>';
                                    if (data[i]["linker"][j]["qmodule"]["linker"][c]["qunit"]["linker"]) {
                                        for (e=0; e<data[i]["linker"][j]["qmodule"]["linker"][c]["qunit"]["linker"].length; ++e) {
                                            if (data[i]["linker"][j]["qmodule"]["linker"][c]["qunit"]["linker"][e]["link_type"] == 'qelement') {
                                                topology_tree += '<li><span class="badge">E</span>&nbsp;<span style="cursor:pointer;" onclick="ISOM.info_view(\'element\','+data[i]["linker"][j]["qmodule"]["linker"][c]["qunit"]["linker"][e]["qelement"]["qelement_id"]+')">'+data[i]["linker"][j]["qmodule"]["linker"][c]["qunit"]["linker"][e]["qelement"]["name"]+'</span></li>';
                                            }
                                        }
                                    }
                                    topology_tree += '</ul>';
                                }
                                if (data[i]["linker"][j]["qmodule"]["linker"][c]["link_type"] == 'qelement') {
                                    topology_tree += '<li><span class="badge">E</span>&nbsp;<span style="cursor:pointer;" onclick="ISOM.info_view(\'element\','+data[i]["linker"][j]["qmodule"]["linker"][c]["qelement"]["qelement_id"]+')">'+data[i]["linker"][j]["qmodule"]["linker"][c]["qelement"]["name"]+'</span></li>';
                                }
                            }
                        }
                        topology_tree += '</ul>';
                    }
   					if (data[i]["linker"][j]["link_type"] == 'qcomponent') {
   						topology_tree += '<li class="closed"><div class="hitarea collapsable-hitarea"></div><span class="badge badge-success">C</span>&nbsp;<span onclick="ISOM.info_view(\'component\','+data[i]["linker"][j]["qcomponent"]["qcomponent_id"]+')">'+data[i]["linker"][j]["qcomponent"]["name"]+'</span><ul>';
						if (data[i]["linker"][j]["qcomponent"]["linker"]) {
   							for (c=0; c<data[i]["linker"][j]["qcomponent"]["linker"].length; ++c) {
   								if (data[i]["linker"][j]["qcomponent"]["linker"][c]["link_type"] == 'qunit') {
   									topology_tree += '<li class="closed"><div class="hitarea collapsable-hitarea"></div><span class="badge badge-info">U</span>&nbsp;<span onclick="ISOM.info_view(\'unit\','+data[i]["linker"][j]["qcomponent"]["linker"][c]["qunit"]["qunit_id"]+')">'+data[i]["linker"][j]["qcomponent"]["linker"][c]["qunit"]["name"]+'</span><ul>';
   									if (data[i]["linker"][j]["qcomponent"]["linker"][c]["qunit"]["linker"]) {
			   							for (e=0; e<data[i]["linker"][j]["qcomponent"]["linker"][c]["qunit"]["linker"].length; ++e) {
			   								if (data[i]["linker"][j]["qcomponent"]["linker"][c]["qunit"]["linker"][e]["link_type"] == 'qelement') {
			   									topology_tree += '<li><span class="badge">E</span>&nbsp;<span style="cursor:pointer;" onclick="ISOM.info_view(\'element\','+data[i]["linker"][j]["qcomponent"]["linker"][c]["qunit"]["linker"][e]["qelement"]["qelement_id"]+')">'+data[i]["linker"][j]["qcomponent"]["linker"][c]["qunit"]["linker"][e]["qelement"]["name"]+'</span></li>';
			   								}
			   							}
			   						}
			   						topology_tree += '</ul>';
   								}
   								if (data[i]["linker"][j]["qcomponent"]["linker"][c]["link_type"] == 'qelement') {
   									topology_tree += '<li><span class="badge">E</span>&nbsp;<span style="cursor:pointer;" onclick="ISOM.info_view(\'element\','+data[i]["linker"][j]["qcomponent"]["linker"][c]["qelement"]["qelement_id"]+')">'+data[i]["linker"][j]["qcomponent"]["linker"][c]["qelement"]["name"]+'</span></li>';
   								}
   							}
   						}
   						topology_tree += '</ul>';   					
   					}
   					if (data[i]["linker"][j]["link_type"] == 'qunit') {
   						topology_tree += '<li class="closed"><div class="hitarea collapsable-hitarea"></div><span class="badge badge-info">U</span>&nbsp;<span onclick="ISOM.info_view(\'unit\','+data[i]["linker"][j]["qunit"]["qunit_id"]+')">'+data[i]["linker"][j]["qunit"]["name"]+'</span><ul>';
   						if (data[i]["linker"][j]["qunit"]["linker"]) {
   							for (c=0; c<data[i]["linker"][j]["qunit"]["linker"].length; ++c) {
   								if (data[i]["linker"][j]["qunit"]["linker"][c]["link_type"] == 'qelement') {
   									topology_tree += '<li><span class="badge">E</span>&nbsp;<span style="cursor:pointer;" onclick="ISOM.info_view(\'element\','+data[i]["linker"][j]["qunit"]["linker"][c]["qelement"]["qelement_id"]+')">'+data[i]["linker"][j]["qunit"]["linker"][c]["qelement"]["name"]+'</span></li>';
   								}
   							}
   						}
   						topology_tree += '</ul>';
   					}
   					if (data[i]["linker"][j]["link_type"] == 'qelement') {
   						topology_tree += '<li><span class="badge">E</span>&nbsp;<span style="cursor:pointer;" onclick="ISOM.info_view(\'element\','+data[i]["linker"][j]["qelement"]["qelement_id"]+')">'+data[i]["linker"][j]["qelement"]["name"]+'</span></li>';
   					}
   				}
   			}
			topology_tree += '</ul></li>';
		}
    }
    topology_tree += '</ul></li></ul></div></div></div>';

    $('#'+EDOM.left_menu_div).html(topology_tree);

	$(document).ready(function(){
		$("#browser").treeview({
			collapsed: true,
			animated: "fast",
			control: "#sidetreecontrol",
			prerendered: false,
			persist: "cookie"
		});
	});

	$(function(){
		document.getElementById('topology').style.maxHeight = $(window).height()-150+"px";
		$(".sidetree").mouseenter(function(){
			document.onmousewheel = function (e) {
				e.preventDefault();
			}
		$('#sidetree').mousewheel(function(event, delta) {
			if (delta > 0) {
				topology.scrollTop-=10;
			} else {
				topology.scrollTop+=10;
			}
		});
		}).mouseleave(function(){
			document.onmousewheel = null;
		})
    });
	/*
	 *  Resize substation topology div
	 *  CKharitonov
	 */
	$(window).resize(function(){
		document.getElementById('topology').style.maxHeight = $(window).height()-150+"px";
	});
}
/*
 *  CKharitonov
 */
open_lookup_window = function(app,frm,schema,table_name,i){
    var wi = window.open(''+ISOM.base_url+'qcore/ajax/table_lookup/'+app+'/'+frm+'/'+schema+'/'+table_name+'/'+i,'lookup','width=550,height=550');
    wi.focus();
}