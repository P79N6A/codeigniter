/* 
 * CKharitonov
 */
var EDOM = {
    top_menu_div:'top_menu_div',
    left_menu_div:'left_menu_div',
    content_div:'content_div',
    splash_div:'splash_div',
    splash_screen:'',
    base_url:'',
    list_project_beom:null,
    oTable:null,
    position:null,
    view:null,
    parent:null,
    save_history:true,
    beom_data : null
};
/*
 * CKharitonov
 */
EDOM.common_beom = function(){
    EDOM.clear_content();
    if (EDOM.save_history==true){
        EDOM.push_history({ page: "common_beom" },'edom?page=common_beom');
    }
    EDOM.load_left_menu("common_beom");
    EDOM.save_history=true;
}
/*
 * CKharitonov
 */
EDOM.object_list = function(parent){
    EDOM.clear_content();
    if (EDOM.save_history==true){	
        EDOM.push_history({ page: "object_list", parent: parent },'edom?page=object_list&parent='+parent);
    }
    else {
        parent=EDOM.parent;
    }		
    EDOM.load_left_menu("common_beom");
    CFUtil.datatable.table_open('<table id="example" width="100%">');
    path = CFUtil.datatable.generate_breadcrumbs(EDOM.base_url+'index.php/edom/get_path/beom/object/'+parent,"object_list");
    CFUtil.datatable.set_header(['',langs.get_term("txt_name"),langs.get_term("txt_description"),langs.get_term("txt_code"),'']);
    $('#'+EDOM.content_div).html('<div class="panel panel-default"><div class="panel-heading"><button type="button" class="btn btn-primary btn-small" onClick="EDOM.add(\'object\');">'+langs.get_term("txt_add_object")+'</button></div><div class="panel-body">'+path+CFUtil.datatable.generate()+'</div></div>');
    $("li").removeClass("active");
    $("#object").addClass("active");
    oTable = $("#example").dataTable({
        "sPaginationType": "full_numbers",
        "bProcessing": true,
        "bServerSide": true,
        "sAjaxSource": EDOM.base_url+'index.php/edom/get_object_list/'+parent,
        "sServerMethod": "POST",
        "aoColumnDefs":	[{ "bVisible": false, "aTargets": [ 0 ] }],
        "aaSorting": [[ 1, "asc" ]],
        "bAutoWidth": true,
        "iDisplayLength": 25
    });
    $('#example tbody').on('dblclick','tr',function(){
        var aData = oTable.fnGetData(this);
        if (aData){
            var id = aData[0];
            var name = aData[1];
            EDOM.object_list(id);
        }
    });
    EDOM.save_history=true;	
}
/*
 * CKharitonov
 */
EDOM.subject_list = function(parent){
    EDOM.clear_content();
    if (EDOM.save_history==true){	
        EDOM.push_history({ page: "subject_list", parent: parent },'edom?page=subject_list&parent='+parent);
    }
    else {
        parent=EDOM.parent;
    }
    EDOM.load_left_menu("common_beom");
    CFUtil.datatable.table_open('<table id="example" width="100%">');
    path = CFUtil.datatable.generate_breadcrumbs(EDOM.base_url+'index.php/edom/get_path/beom/subject/'+parent,"subject_list");
    CFUtil.datatable.set_header(['',langs.get_term("txt_name"),langs.get_term("txt_description"),langs.get_term("txt_code"),'']);
    $('#'+EDOM.content_div).html('<div class="panel panel-default"><div class="panel-heading"><button type="button" class="btn btn-primary btn-small" onClick="EDOM.add(\'subject\');">'+langs.get_term("txt_add_subject")+'</button></div><div class="panel-body">'+path+CFUtil.datatable.generate()+'</div></div>');
    $("li").removeClass("active");
    $("#subject").addClass("active");
    oTable = $("#example").dataTable({
        "sPaginationType": "full_numbers",
        "bProcessing": true,
        "bServerSide": true,
        "sAjaxSource": EDOM.base_url+'index.php/edom/get_subject_list/'+parent,
        "sServerMethod": "POST",
        "aoColumnDefs":	[{ "bVisible": false, "aTargets": [ 0 ] }],
        "aaSorting": [[ 1, "asc" ]],
        "bAutoWidth": true,
        "iDisplayLength": 25
    });
    $('#example tbody').on('dblclick','tr',function(){
        var aData = oTable.fnGetData(this);
        if (aData){
            var id = aData[0];
            var name = aData[1];
            EDOM.subject_list(id);
        }
    });
    EDOM.save_history=true;	
}
/*
 * CKharitonov
 */
EDOM.task_list = function(parent){
    EDOM.clear_content();
	if (EDOM.save_history==true){
		EDOM.push_history({ page: "task_list", parent: parent},'edom?page=task_list&parent='+parent);
    }
	else {
		parent=EDOM.parent;
	}	
    EDOM.load_left_menu("common_beom");
    CFUtil.datatable.table_open('<table id="example" width="100%">');
    path = CFUtil.datatable.generate_breadcrumbs(EDOM.base_url+'index.php/edom/get_path/beom/task/'+parent,"task_list");
    CFUtil.datatable.set_header(['',langs.get_term("txt_name"),langs.get_term("txt_description"),langs.get_term("txt_code"),'']);
    $('#'+EDOM.content_div).html('<div class="panel panel-default"><div class="panel-heading"><button type="button" class="btn btn-primary btn-small" onClick="EDOM.add(\'task\');">'+langs.get_term("txt_add_task")+'</button></div><div class="panel-body">'+path+CFUtil.datatable.generate()+'</div></div>');
    $("li").removeClass("active");
    $("#task").addClass("active");
    oTable = $("#example").dataTable({
        "sPaginationType": "full_numbers",
        "bProcessing": true,
        "bServerSide": true,
        "sAjaxSource": EDOM.base_url+'index.php/edom/get_task_list/'+parent,
        "sServerMethod": "POST",
        "aoColumnDefs":	[{ "bVisible": false, "aTargets": [ 0 ] }],
        "aaSorting": [[ 1, "asc" ]],
        "bAutoWidth": true,
        "iDisplayLength": 25
    });
    $('#example tbody').on('dblclick','tr',function(){
        var aData = oTable.fnGetData(this);
        if (aData){
            var id = aData[0];
            var name = aData[1];
            EDOM.task_list(id);
        }
    });
	EDOM.save_history=true;
}
/*
 * CKharitonov
 */
EDOM.relation_list = function(parent){
    EDOM.clear_content();
    if (EDOM.save_history==true){
        EDOM.push_history({ page: "relation_list", parent: parent},'edom?page=relation_list&parent='+parent);
    }
    else {
        parent=EDOM.parent;
    }   
    EDOM.load_left_menu("common_beom");
    CFUtil.datatable.table_open('<table id="example" width="100%">');
    path = CFUtil.datatable.generate_breadcrumbs(EDOM.base_url+'index.php/edom/get_path/beom/relation/'+parent,"relation_list");
    CFUtil.datatable.set_header(['',langs.get_term("txt_name"),langs.get_term("txt_description"),langs.get_term("txt_code"),'']);
    $('#'+EDOM.content_div).html('<div class="panel panel-default"><div class="panel-heading"><button type="button" class="btn btn-primary btn-small" onClick="EDOM.add(\'relation\');">'+langs.get_term("txt_add_relation")+'</button></div><div class="panel-body">'+path+CFUtil.datatable.generate()+'</div></div>');
    $("li").removeClass("active");
    $("#relation").addClass("active");
    oTable = $("#example").dataTable({
        "sPaginationType": "full_numbers",
        "bProcessing": true,
        "bServerSide": true,
        "sAjaxSource": EDOM.base_url+'index.php/edom/get_relation_list/'+parent,
        "sServerMethod": "POST",
        "aoColumnDefs": [{ "bVisible": false, "aTargets": [ 0 ] }],
        "aaSorting": [[ 1, "asc" ]],
        "bAutoWidth": true,
        "iDisplayLength": 25
    });
    $('#example tbody').on('dblclick','tr',function(){
        var aData = oTable.fnGetData(this);
        if (aData){
            var id = aData[0];
            var name = aData[1];
            EDOM.relation_list(id);
        }
    });
    EDOM.save_history=true;
}
/*
 * CKharitonov
 */
EDOM.space_list = function(parent){
    EDOM.clear_content();
    if (EDOM.save_history==true){
        EDOM.push_history({ page: "space_list", parent: parent},'edom?page=space_list&parent='+parent);
    }
    else {
        parent=EDOM.parent;
    }   
    EDOM.load_left_menu("common_beom");
    CFUtil.datatable.table_open('<table id="example" width="100%">');
    path = CFUtil.datatable.generate_breadcrumbs(EDOM.base_url+'index.php/edom/get_path/beom/space/'+parent,"space_list");
    CFUtil.datatable.set_header(['',langs.get_term("txt_name"),langs.get_term("txt_description"),langs.get_term("txt_code"),'']);
    $('#'+EDOM.content_div).html('<div class="panel panel-default"><div class="panel-heading"><button type="button" class="btn btn-primary btn-small" onClick="EDOM.add(\'space\');">'+langs.get_term("txt_add_space")+'</button></div><div class="panel-body">'+path+CFUtil.datatable.generate()+'</div></div>');
    $("li").removeClass("active");
    $("#space").addClass("active");
    oTable = $("#example").dataTable({
        "sPaginationType": "full_numbers",
        "bProcessing": true,
        "bServerSide": true,
        "sAjaxSource": EDOM.base_url+'index.php/edom/get_space_list/'+parent,
        "sServerMethod": "POST",
        "aoColumnDefs": [{ "bVisible": false, "aTargets": [ 0 ] }],
        "aaSorting": [[ 1, "asc" ]],
        "bAutoWidth": true,
        "iDisplayLength": 25
    });
    $('#example tbody').on('dblclick','tr',function(){
        var aData = oTable.fnGetData(this);
        if (aData){
            var id = aData[0];
            var name = aData[1];
            EDOM.space_list(id);
        }
    });
    EDOM.save_history=true;
}
/*
 * CKharitonov
 */
EDOM.time_list = function(parent){
    EDOM.clear_content();
    if (EDOM.save_history==true){
        EDOM.push_history({ page: "time_list", parent: parent},'edom?page=time_list&parent='+parent);
    }
    else {
        parent=EDOM.parent;
    }   
    EDOM.load_left_menu("common_beom");
    CFUtil.datatable.table_open('<table id="example" width="100%">');
    path = CFUtil.datatable.generate_breadcrumbs(EDOM.base_url+'index.php/edom/get_path/beom/time/'+parent,"time_list");
    CFUtil.datatable.set_header(['',langs.get_term("txt_name"),langs.get_term("txt_description"),langs.get_term("txt_code"),'']);
    $('#'+EDOM.content_div).html('<div class="panel panel-default"><div class="panel-heading"><button type="button" class="btn btn-primary btn-small" onClick="EDOM.add(\'time\');">'+langs.get_term("txt_add_time")+'</button></div><div class="panel-body">'+path+CFUtil.datatable.generate()+'</div></div>');
    $("li").removeClass("active");
    $("#time").addClass("active");
    oTable = $("#example").dataTable({
        "sPaginationType": "full_numbers",
        "bProcessing": true,
        "bServerSide": true,
        "sAjaxSource": EDOM.base_url+'index.php/edom/get_time_list/'+parent,
        "sServerMethod": "POST",
        "aoColumnDefs": [{ "bVisible": false, "aTargets": [ 0 ] }],
        "aaSorting": [[ 1, "asc" ]],
        "bAutoWidth": true,
        "iDisplayLength": 25
    });
    $('#example tbody').on('dblclick','tr',function(){
        var aData = oTable.fnGetData(this);
        if (aData){
            var id = aData[0];
            var name = aData[1];
            EDOM.time_list(id);
        }
    });
    EDOM.save_history=true;
}
/*
 * CKharitonov
 */
EDOM.load_left_menu = function(type){
    var left_menu = '';
    if (type == "common_beom"){
        left_menu += '<ul class="nav nav-list">';
            left_menu += '<li class="nav-header">'+langs.get_term("txt_common_beom")+'</li>';
            left_menu += '<li id="object"><a href="javascript:void(0);" onclick="EDOM.object_list(\'0\');">'+langs.get_term("txt_object")+'</a></li>';
            left_menu += '<li id="subject"><a href="javascript:void(0);" onclick="EDOM.subject_list(\'0\');">'+langs.get_term("txt_subject")+'</a></li>';
            left_menu += '<li id="task"><a href="javascript:void(0);" onclick="EDOM.task_list(\'0\');">'+langs.get_term("txt_task")+'</a></li>';
            left_menu += '<li id="relation"><a href="javascript:void(0);" onclick="EDOM.relation_list(\'0\');">'+langs.get_term("txt_relation")+'</a></li>';
            left_menu += '<li id="space"><a href="javascript:void(0);" onclick="EDOM.space_list(\'0\');">'+langs.get_term("txt_space")+'</a></li>';
            left_menu += '<li id="time"><a href="javascript:void(0);" onclick="EDOM.time_list(\'0\');">'+langs.get_term("txt_time")+'</a></li>';
        left_menu += '</ul>';
    }
    if (type == "beom"){
        left_menu += '<ul class="nav nav-list" id="beom_list"></ul>';
        EDOM.get_project_beom();
    }
    $('#'+EDOM.left_menu_div).html(left_menu);

}
/*
 * CKharitonov
 */
EDOM.get_project_beom = function(){
    $('#beom_list').empty();
    html = $.ajax({
        url: EDOM.base_url+"index.php/edom/get_project_beom",
        type: "POST"
    }).done(function (response, textStatus, jqXHRб){
        EDOM.list_project_beom = JSON.parse(response);
        html_text = '<li class="nav-header">'+langs.get_term("txt_beom")+'</li>';
        //html_text += '<a href="javascript:void(0);" onclick="EDOM.create_beom(\'qbeom\',null,null)"><button type="button" class="btn btn-danger btn-sm">'+langs.get_term("txt_new_qbeom")+'</button></a>';
        for (i=0;i<EDOM.list_project_beom.length;i++){
            html_text+='<li id=\'li_'+i+'\'><a href="javascript:void(0);" onclick="EDOM.get_info_beom(\''+i+'\')" >'+EDOM.list_project_beom[i]['name']+'</a></li>';
        }
        $('#beom_list').append(html_text);
        if (EDOM.position != null){
            EDOM.save_history = false;
            EDOM.get_info_beom(EDOM.position);
        }
        if (EDOM.view != null){
            EDOM.save_history = false;
            EDOM.list_beom(EDOM.position,EDOM.view,EDOM.parent);
        }
    });
}
/*
 * CKharitonov
 */
EDOM.select_beom = function(position){
    $('li').removeClass('active');
    $('#li_'+position).addClass('active');
}
/*
 * CKharitonov
 */
EDOM.get_info_beom = function(position){
    EDOM.select_beom(position);
    if (EDOM.save_history == true){
        EDOM.push_history({page:"get_info_beom",position:position},'edom?page=get_info_beom&position='+position);
    }
    else {
        position = EDOM.position;
    }
    if (position == null){
        return;
    }
    var content = '<div class="panel panel-default" style="float:center;">';
        content += '<div class="panel-heading"><b>'+langs.get_term("txt_beom_for")+EDOM.list_project_beom[position]['name']+'</b>';
            //content += '<button type="button" class="btn btn-warning btn" style="float:right;height:20px;min-height:10px" onclick="edit_beom('+EDOM.list_project_beom[position]['id']+',\'qbeom\')">'+langs.get_term("txt_edit")+'</button>';
        content += '</div>';
        content += '<div class="panel-body">';
            content += '<button type="button" class="btn btn-primary btn-xs" onclick="EDOM.list_beom('+position+',\'object\',\'0\')">'+langs.get_term("txt_object")+'</button>&nbsp;';
            content += '<button type="button" class="btn btn-primary btn-xs" onclick="EDOM.list_beom('+position+',\'subject\',\'0\')">'+langs.get_term("txt_subject")+'</button>&nbsp;';
            content += '<button type="button" class="btn btn-primary btn-xs" onclick="EDOM.list_beom('+position+',\'task\',\'0\')">'+langs.get_term("txt_task")+'</button>&nbsp;';
            content += '<button type="button" class="btn btn-primary btn-xs" onclick="EDOM.list_beom('+position+',\'relation\',\'0\')">'+langs.get_term("txt_relation")+'</button>&nbsp;';
            content += '<button type="button" class="btn btn-primary btn-xs" onclick="EDOM.list_beom('+position+',\'space\',\'0\')">'+langs.get_term("txt_space")+'</button>&nbsp;';
            content += '<button type="button" class="btn btn-primary btn-xs" onclick="EDOM.list_beom('+position+',\'time\',\'0\')">'+langs.get_term("txt_time")+'</button><br><br>';
            content += '<div class="panel panel-success">';
                content += '<div class="panel-heading"><div onclick="toggle(\'prj_object\','+EDOM.list_project_beom[position]['id']+')" style="cursor:pointer;">'+langs.get_term('txt_object')+'</div></div>';
                content += '<div class="panel-body hide" id="prj_object"></div>';
            content += '</div>';
            content += '<div class="panel panel-info">';
                content += '<div class="panel-heading"><div onclick="toggle(\'prj_subject\','+EDOM.list_project_beom[position]['id']+')" style="cursor:pointer;">'+langs.get_term('txt_subject')+'</div></div>';
                content += '<div class="panel-body hide" id="prj_subject"></div>';
            content += '</div>';
            content += '<div class="panel panel-warning">';
                content += '<div class="panel-heading"><div onclick="toggle(\'prj_task\','+EDOM.list_project_beom[position]['id']+')" style="cursor:pointer;">'+langs.get_term('txt_task')+'</div></div>';
                content += '<div class="panel-body hide" id="prj_task"></div>';
            content += '</div>';
            content += '<div class="panel panel-primary">';
                content += '<div class="panel-heading"><div onclick="toggle(\'prj_relation\','+EDOM.list_project_beom[position]['id']+')" style="cursor:pointer;">'+langs.get_term('txt_relation')+'</div></div>';
                content += '<div class="panel-body hide" id="prj_relation"></div>';
            content += '</div>';
            content += '<div class="panel panel-default">';
                content += '<div class="panel-heading"><div onclick="toggle(\'prj_space\','+EDOM.list_project_beom[position]['id']+')" style="cursor:pointer;">'+langs.get_term('txt_space')+'</div></div>';
                content += '<div class="panel-body hide" id="prj_space"></div>';
            content += '</div>';
            content += '<div class="panel panel-danger">';
                content += '<div class="panel-heading"><div onclick="toggle(\'prj_time\','+EDOM.list_project_beom[position]['id']+')" style="cursor:pointer;">'+langs.get_term('txt_time')+'</div></div>';
                content += '<div class="panel-body hide" id="prj_time"></div>';
            content += '</div>';
        content += '</div>';
    content += '</div>';
    $('#'+EDOM.content_div).html(content);
    EDOM.save_history = true;
}
/*
 * CKharitonov
 */
EDOM.list_beom = function(position,view,parent){
    if (EDOM.save_history == true){
       EDOM.push_history({ page: "list_beom", view:view,position:position,parent:parent},'edom?page=list_beom&position='+position+'&view='+view+'&parent='+parent);
    }
    else {
        position = EDOM.position;
        view = EDOM.view;
        parent = EDOM.parent;
    }
    CFUtil.datatable.table_open('<table id="example" width="100%">');
    path = CFUtil.datatable.generate_breadcrumbs_beom(EDOM.base_url+'index.php/edom/get_path/beom/prj_'+view+'/'+parent,'list_beom',position,view);
    CFUtil.datatable.set_header(['',langs.get_term("txt_name"),langs.get_term("txt_description"),langs.get_term("txt_code")]);
    $("li").removeClass("active");
    $("#task").addClass("active");
    var content = '';
    //content += '<button type="button" class="btn btn-primary btn-xs" onclick="EDOM.create_beom(\'prj_'+view+'\','+EDOM.list_project_beom[position]['id']+','+parent+')">'+langs.get_term("txt_new_prj_"+view)+'</button>';
    content += path;
    content += CFUtil.datatable.generate();
    $('#'+EDOM.content_div+' div.panel-body').html(content);
    oTable = $("#example").dataTable({
        "sPaginationType": "full_numbers",
        "bProcessing": true,
        "bServerSide": true,
        "destroy": true,		
        "sAjaxSource": EDOM.base_url+'index.php/edom/list_beom/'+EDOM.list_project_beom[position]['id']+'/prj_'+view+'/'+parent,
        "sServerMethod": "POST",
        "aoColumnDefs": [{ "bVisible": false, "aTargets": [ 0 ] }],
        "aaSorting": [[ 1, "asc" ]],
        "aoColumns": [{ "sWidth": "0%" },{ "sWidth": "25%" },{ "sWidth": "50%" },{ "sWidth": "15%" }],
        "iDisplayLength": 25
    });
    $('#example tbody').on('dblclick','tr',function(){
        var aData = oTable.fnGetData(this);
        if (aData){
            var id = aData[0];
            var name = aData[1];
            EDOM.list_beom(position, view, id);
        }
    });
    EDOM.select_beom(position);	
    EDOM.save_history=true;
}
/*
 *
 */
EDOM.hide_left_menu = function(){
    $('#'+EDOM.left_menu_div).hide();
}
/*
 * 
 */
EDOM.load_splash = function(){
    $('#'+EDOM.splash_div).html(EDOM.splash_screen);
}
/*
 * CKharitonov
 */
EDOM.get = function(key){
    var s = window.location.search;
    s = s.match(new RegExp(key + '=([^&=]+)'));
    return s ? s[1] : false;
}
/*
 * CKharitonov
 */
EDOM.load_content = function(){
	if (EDOM.get("app")){
		if (EDOM.get("app")=='ISOM') {
			ISOM.load_top_menu();
			if (EDOM.get("top_type") && EDOM.get("top_id")) {
				ISOM[EDOM.get("page")](EDOM.get("type"),EDOM.get("id"));
				ISOM.get_top_topology();
			}
			else {
				ISOM[EDOM.get("page")](EDOM.get("type"),EDOM.get("id"));
			}
    	}
    	else {
			EDOM[EDOM.get("page")](EDOM.get("parent"));
		}
	}
	else {
		if (EDOM.get("position")){
			EDOM.clear_content();		
			if (EDOM.get("position")) {EDOM.position=EDOM.get("position")};
			if (EDOM.get("view")) {EDOM.view=EDOM.get("view")};	
			if (EDOM.get("parent")) {EDOM.parent=EDOM.get("parent")};	
			EDOM.save_history=false;
			EDOM.load_beom();
		}
		else if (EDOM.get("page")) EDOM[EDOM.get("page")](EDOM.get("parent"));
	}	
	//ISOM.load_page(EDOM.get("page"));
}
/*
 * 
 */
EDOM.clear_content = function(){
    $('#'+EDOM.left_menu_div).html("");
    $('#'+EDOM.content_div).html("");
}
/*
 * 
 */
EDOM.push_history = function(state,url){
	history.pushState(state,"history",url);
}
/*
 * 
 */
EDOM.pull_history = function(){
    
}
/*
 * 
 */
EDOM.load_isom = function(){
    EDOM.clear_content();
    ISOM.load_top_menu();
    ISOM.system_list('system');
}
/*
 * 
 */
EDOM.load_beom = function(){
    EDOM.clear_content();
	if (EDOM.save_history==true){	
        EDOM.push_history({ page: "load_beom" },'edom?page=load_beom');
    }
	EDOM.load_left_menu('beom');
    EDOM.save_history=true;
	//BEOM.run();
}
/*
 * 
 * @param {type} param1
 * @param {type} param2 FOR vadim.....
 */
window.addEventListener("popstate", function(event){
	EDOM.save_history=false;
	array_data=event.state;
	if (array_data!=null) {
		EDOM.position=array_data["position"];
		EDOM.parent=array_data["parent"];
		EDOM.view=array_data["view"];
	}
	else {
		location.reload();
	}
	if (array_data["view"]){
		EDOM.load_beom();
	}
	/*
	 * vadim to kostya
	 */
    /*else if (array_data["type"] && array_data["id"] && array_data["top_type"] && array_data["top_id"]){
        ISOM.type=array_data["type"];
        ISOM.id=array_data["id"];
        ISOM[array_data["page"]](ISOM.type,ISOM.id)
    }*/
    else if (array_data["type"] && array_data["id"]){
        ISOM.type=array_data["type"];
        ISOM.id=array_data["id"];
        ISOM[array_data["page"]](ISOM.type,ISOM.id)
    }	
    else if (array_data["type"]){
        ISOM.type=array_data["type"];
        ISOM[array_data["page"]](ISOM.type)
    }
	else {
		EDOM[array_data["page"]]();
	}
});
/*
 * CKharitonov
 */
EDOM.add = function(table){
    var dialog = CFUtil.dialog.create("save_window",
    {
        title: langs.get_term("txt_"+table+""),
        autoOpen: false,
        height: "auto",
        width: 400,
        modal: true
    }).bind('dialogclose', function(event){
        EDOM[table+"_list"](EDOM.get("parent"));
    });
    if ( dialog ){
        html = $.ajax({
            url: EDOM.base_url+"index.php/qcore/ajax/load_form/edom/"+table+"/"+EDOM.get("parent")+"/?CONTINUE=close",
            type: "POST"
        }).done(function (response, textStatus, jqXHRб){
            $(dialog).html(response);
        });
    }
}
/*
 * CKharitonov
 */
EDOM.edit = function(fid,table){
    var dialog = CFUtil.dialog.create("save_window",
    {
        title: langs.get_term("txt_"+table+""),
        autoOpen: false,
        height: "auto",
        width: 400,
        modal: true
    }).bind('dialogclose', function(event){
        EDOM[table+"_list"](EDOM.get("parent"));
    });
    if ( dialog ){
        html = $.ajax({
            url: EDOM.base_url+"index.php/qcore/ajax/edit_form/edom/"+table+"/"+fid+"/"+EDOM.get("parent")+"/?CONTINUE=close",
            type: "POST"
        }).done(function (response, textStatus, jqXHRб){
            $(dialog).html(response);
        });
    }
}

EDOM.create_beom = function(path_form,fk_project,parent){
	var dialog =CFUtil.dialog.create("save_window",
	{
		title: langs.get_term("txt_new_"+path_form), 
		autoOpen: false,
		height: "auto",
		width: 400,
		modal: true
	}).bind('dialogclose', function(event){
		EDOM.load_content();
	});
	if ( dialog ){
		html = $.ajax({     
			url: EDOM.base_url+"index.php/qcore/ajax/load_form/edom/"+path_form+'/'+fk_project+'/'+parent,
			type: "POST"         
		}).done(function (response, textStatus, jqXHRб){
			$(dialog).html(response); 
		});
	}
}

edit_beom = function(id,view){
	var dialog =CFUtil.dialog.create("save_window",
	{
		title: langs.get_term("txt_edit"), 
		autoOpen: false,
		height: "auto",
		width: 400,
		modal: true
	}).bind('dialogclose', function(event){
		EDOM.load_content();
	});
	if ( dialog ){
		html = $.ajax({     
			url: ISOM.base_url+"qcore/ajax/edit_form/edom/"+view+"/"+id,    
			type: "POST"         
		}).done(function (response, textStatus, jqXHRб){
			$(dialog).html(response); 
		});
	}
}
/*
 *  CKharitonov
 */
EDOM.remove = function(schema,type,id){
    if (confirm("Вы уверены?")){
        $.ajax({
            url: EDOM.base_url+'index.php/edom/remove/'+schema+'/'+type+'/'+id,
            success: function(data){
                if (data == 1){
                    EDOM.load_content();
                }
                else (
                    alert("Удалите все элементы внутри.")
                )
            }
        });
    }
}
/*
 *  Open / close div
 *  CKharitonov
 */
function toggle(div_id,beom_id){
    if ($("#"+div_id).hasClass("hide")){
        EDOM.check_beom_data(div_id,beom_id);
    }
    else {
        close_div(div_id);
    }
};
/*
 *  CKharitonov
 */
function open_div(div_id,beom_id){
    var html = '';
    if (EDOM.beom_data[div_id][0]["count"] > 0){
        html += '<iframe';
        html += ' width="100%" frameBorder="0" height="500px" src="'+EDOM.base_url+'index.php/conframe_bi/browser/'+div_id+'/'+beom_id+'"';
        html += '></iframe>';
    }
    else {
        html += 'Данные отсутствуют.';
    }
    $('#'+div_id).html(html);
    $("#"+div_id).removeClass("hide");
};
/*
 *  CKharitonov
 */
function close_div(div_id){
    $('#'+div_id).html('');
    $("#"+div_id).addClass("hide");
};
/*
 * CKharitonov
 */
EDOM.check_beom_data = function(div_id,beom_id){
    $.ajax({
        url: EDOM.base_url+'index.php/edom/check_beom_data/'+div_id+'/'+beom_id,
        success: function(data){
            EDOM.beom_data = JSON.parse(data);
            if (EDOM.beom_data != null){
                open_div(div_id,beom_id);
            }
        }
    });
}