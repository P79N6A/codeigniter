/* 
//  ------------------------------------------------------------------------ //
//                         ConFrame-Electric CTM V3                          //
//                      Copyright (c) 2011-2014 DunRose                      //
//                         <http://www.dunrose.ru/>                          //
//  ------------------------------------------------------------------------ //
//  Author: Mr. Thurairajasingam Senthilruban   TSRuban[AT]dunrose.ru        //
//  URL: http://www.dunrose.ru						     //
// ------------------------------------------------------------------------- //
 */

CFUtil = {
    dialog : {}, 
    evocs : {},
    datatable: {
        headers :new Array(),
        table_open : ''
    }
};

CFUtil.get_local_datetime = function(datetime){
    if (!datetime || datetime===""){
        return null;
    }
    else{
        var datetime = new Date(datetime);
        var d = new Date(datetime.getTime()+(-1*datetime.getTimezoneOffset()*60000));
        //return d.getFullYear() + '-' +(d.getMonth()+1) + '-' + d.getDay + ' ' + d.getHours() + ':' + d.getMinutes;
        return d;
    }
}
CFUtil.guid = function(){
        function S4() {
                return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        }
        return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
};

CFUtil.dialog.create = function(id,conf){
    $("#"+id).remove();
    $("body").append('<div id="'+id+'" title="'+conf.title+'"></div>');
    if (conf.position) {
    	position = conf.position;

    } else position = "top";
    return $("#"+id).dialog({close:conf.close,width:conf.width,top:conf.top,height:conf.height,maxHeight:conf.maxHeight,modal:conf.modal,resizable:conf.resizable,position:position,"z-index":999999});
};

CFUtil.evocs.load_term = function(term){
    alert(term);
};

CFUtil.datatable.table_open = function(table_open){
    CFUtil.datatable.table_div = new String();
    if (table_open){
            CFUtil.datatable.table_div = table_open;
    }
};

CFUtil.datatable.set_header = function(headers){
    if (headers){
        CFUtil.datatable.headers = new Array();
        CFUtil.datatable.headers = headers;
    }
};

CFUtil.datatable.generate = function(table_div){
    var table = '';
    if( CFUtil.datatable.table_div){
        table += CFUtil.datatable.table_div;
    }
    table += '<thead><tr role="row">';
    for (i in CFUtil.datatable.headers){
        table += '<th>';
            table += CFUtil.datatable.headers[i];
        table += '</th>';    
    }
    table += '</tr></thead>';
    table += '<tbody>';
    table += '</tbody>';
    table += '</table>';
    return table;
};

CFUtil.datatable.generate_breadcrumbs = function(url,list){
    $.ajax({
        url: url,
        type: 'POST',
        async: false,
        success: function(data){
            path = data;
        }
    });
    if (path != '') {
        try{var location = JSON.parse(String(path));}catch(e){}
    }
    var breadcrumbs = '';
    breadcrumbs += '<ol class="breadcrumb">';
    breadcrumbs += '<li><a href="javascript:void(0);" onclick="EDOM.'+list+'(0);"><span class="glyphicon glyphicon-folder-open"></span></a></li>';
    if (location) {
        for (i=location.length-1;i>-1;--i) {
            if (i == 0) {
                breadcrumbs += '<li class="active">'+location[i]["name"]+'</li>';
            }
            else {
                breadcrumbs += '<li><a href="javascript:void(0);" onclick="EDOM.'+list+'('+location[i]["id"]+');">'+location[i]["name"]+'</a></li>';
            }
        }
    }
    breadcrumbs += '</ol>';
    return breadcrumbs;
};


CFUtil.datatable.generate_breadcrumbs_beom = function(url,list,position,view){
    $.ajax({
        url: url,
        type: 'POST',
        async: false,
        success: function(data){
            path = data;
        }
    });
    if (path != '') {
        try{var location = JSON.parse(String(path));}catch(e){}
    }
    var breadcrumbs = '';
    breadcrumbs += '<ol class="breadcrumb">';
    breadcrumbs += '<li><a href="javascript:void(0);" onclick="EDOM.'+list+'('+position+',\''+view+'\',0);"><span class="glyphicon glyphicon-folder-open"></span></a></li>';
    if (location) {
        for (i=location.length-1;i>-1;--i) {
            if (i == 0) {
                breadcrumbs += '<li class="active">'+location[i]["name"]+'</li>';
            }
            else {
                breadcrumbs += '<li><a href="javascript:void(0);" onclick="EDOM.'+list+'('+position+',\''+view+'\','+location[i]["id"]+');">'+location[i]["name"]+'</a></li>';
            }
        }
    }
    breadcrumbs += '</ol>';
    return breadcrumbs;
};

