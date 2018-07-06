var CFbi = { 
    base_url: null,
    iframe: null,
    sit_id: null,
    one_iframe: 'index.php/conframe_bi/situation/',
    sit_info: null,
    buttons: null,
    analyzes: null
};

CFbi.init = function(attr){
    if (attr.base_url) CFbi.base_url = attr.base_url;
    if (attr.sit_id) CFbi.sit_id = attr.sit_id;
    $('#data').html('<iframe src="'+CFbi.base_url+CFbi.one_iframe+CFbi.sit_id+'" width="100%" frameBorder="0" allowfullscreen></iframe>');
    CFbi.iframe = $('iframe');
    CFbi.iframe.css('height',$(window).height()-130);
    //CFbi.iframe.attr("src",CFbi.base_url+CFbi.one_iframe+CFbi.sit_id);
    /* кнопки */
    if (attr.sit_info) CFbi.sit_info = attr.sit_info;
    if (attr.analyzes) CFbi.analyzes = attr.analyzes;
    if (attr.buttons_menu){
        var html = '';
        for (var i in CFbi.buttons){
            if (CFbi.buttons[i].name == "DEFAULT"){
                html+='<a class="btn btn-primary btn-block" href="'+CFbi.base_url+CFbi.buttons[i].link_iframe+'">'+CFbi.buttons[i].html_text+'</a>';
            }
            else if (CFbi.buttons[i].name == "DEFAULT_ESH_BASA"){//проверку на sit info
                if (CFbi.sit_info){
                    if (CFbi.sit_info.semantic_id) html+='<a class="btn btn-danger btn-block" href="'+CFbi.base_url+CFbi.buttons[i].link_iframe+CFbi.sit_info.semantic_id+'" target="_blank">'+CFbi.buttons[i].html_text+'</a>';
                }
            }
            else if (CFbi.buttons[i].name == 'ANALIZE'){
                html += '<button class="btn btn-warning btn-block" onclick="CFbi.add_analize();">'+CFbi.buttons[i].html_text+'</button>';
            }
            else {
                html+='<button class="btn btn-success btn-block" onclick="CFbi.change_link_iframe(\''+CFbi.buttons[i].name+'\')">'+CFbi.buttons[i].html_text+'</button>';
            }
        };
        $('#'+attr.buttons_menu).html(html);
    } 
    /***********/
    CFbi.set_name_navbar('Информация');
    CFbi.analyzes_list();
}

CFbi.set_name_navbar = function(name){
    var sem_id = '';
    if (CFbi.sit_info){
        if (CFbi.sit_info.semantic_id){
            sem_id = CFbi.sit_info.semantic_id;
        }
    }
    $('.navbar-brand').html(name+' '+sem_id);
}

CFbi.change_link_iframe = function(type){
    for (var i in CFbi.buttons){
        if (CFbi.buttons[i].name == type){
            CFbi.set_name_navbar(CFbi.buttons[i].navbar_name);
            $('#data').css({'width':'90%','padding-left':'0px'});
            $('#data').html('<iframe src="'+CFbi.base_url+CFbi.buttons[i].link_iframe+CFbi.sit_id+'/TRUE/" width="100%" frameBorder="0" allowfullscreen></iframe>');
            CFbi.iframe = $('iframe');
            CFbi.iframe.css('height',$(window).height()-130);
            //CFbi.iframe.attr("src",CFbi.base_url+CFbi.buttons[i].link_iframe+CFbi.sit_id+'/TRUE/');
            break;
        }
    }
}
/*
 * CKharitonov
 */
CFbi.add_analize = function(){
    if (CFbi.sit_info == null) return;
    CFbi.set_name_navbar('Экспертный анализ ситуации');
    var html = '<h4>';
        if (CFbi.sit_info.name != null && CFbi.sit_info.name != ''){
            html += CFbi.sit_info.name+' / ';
        }
        html += CFbi.sit_info.semantic_id+' / ';
        html += moment(CFUtil.get_local_datetime(CFbi.sit_info.registration_datetime)).format("DD.MM.YYYY HH:mm:ss");
    html += '</h4>';
    $('#data').html(html);
    $.ajax({
        url: CFbi.base_url+"index.php/qcore/ajax/load_form/conframe_bi/expert_estimation/"+CFbi.sit_info.id,
        type: "POST"
    }).done(function (response, textStatus, jqXHRб){
        $('#data').css({'width':'50%','padding-left':'100px'});
        $('#data').append(response);
        $("#btn_cancel").click(function(){$('#data').html('');})
    });
}
/*
 * CKharitonov
 */
CFbi.analyzes_list = function(){
    if (CFbi.analyzes == null) return;
    CFbi.analyzes = CFbi.analyzes.sort(dynamicSort("situation_analysis_date"));
    var html = '<ul class="list-group">';
    for (var i=0; i<CFbi.analyzes.length; i++){
        html += '<li class="list-group-item" style="background:#FFECD3;">';
            html += '<a href="javascript:void(0)" onclick="CFbi.analyze_info_view('+CFbi.analyzes[i].id+')">Э'+(i+1)+' / '+moment(CFUtil.get_local_datetime(CFbi.analyzes[i].situation_analysis_date)).format("DD.MM.YYYY")+'</a>';
            html += '<span class="glyphicon glyphicon-edit pull-right" onclick="CFbi.edit_analize('+CFbi.analyzes[i].id+')" style="cursor:pointer;"></span>';
        html += '</li>';
    }
    html += '</ul>';
    $('#analyzes').html(html);
}
/*
 * CKharitonov
 */
function dynamicSort(property){
    var sortOrder = 1;
    if (property[0] === "-"){
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b){
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}
/*
 * CKharitonov
 */
CFbi.edit_analize = function(id){
    CFbi.set_name_navbar('Экспертный анализ ситуации');
    var html = '<h4>';
        if (CFbi.sit_info.name != null && CFbi.sit_info.name != ''){
            html += CFbi.sit_info.name+' / ';
        }
        html += CFbi.sit_info.semantic_id+' / ';
        html += moment(CFUtil.get_local_datetime(CFbi.sit_info.registration_datetime)).format("DD.MM.YYYY HH:mm:ss");
    html += '</h4>';
    $('#data').html(html);
    $.ajax({
        url: CFbi.base_url+"index.php/qcore/ajax/edit_form/conframe_bi/expert_estimation/"+id,
        type: "POST"
    }).done(function (response, textStatus, jqXHRб){
        $('#data').css({'width':'50%','padding-left':'100px'});
        $('#data').append(response);
        $("#btn_cancel").click(function(){$('#data').html('');})
    });
}
/*
 * CKharitonov
 */
CFbi.analyze_info_view = function(id){
    if (CFbi.analyzes == null) return;
    $('#data').css({'width':'50%','padding-left':'100px'});
    CFbi.set_name_navbar('Экспертный анализ ситуации');
    for (var i=0; i<CFbi.analyzes.length; i++){
        if (CFbi.analyzes[i].id == id){
            var html = '<h4>';
                if (CFbi.sit_info.name != null && CFbi.sit_info.name != ''){
                    html += CFbi.sit_info.name+' / ';
                }
                html += CFbi.sit_info.semantic_id+' / ';
                html += moment(CFUtil.get_local_datetime(CFbi.sit_info.registration_datetime)).format("DD.MM.YYYY HH:mm:ss");
            html += '</h4>';
            html += CFbi.put_attribute('Эксперт',CFbi.analyzes[i].expert);
            html += CFbi.put_attribute('Дата анализа ситуации',moment(CFUtil.get_local_datetime(CFbi.analyzes[i].situation_analysis_date)).format("DD.MM.YYYY HH:mm:ss"));
            html += CFbi.put_attribute('Дата возникновения ситуации',moment(CFUtil.get_local_datetime(CFbi.analyzes[i].situation_occurence)).format("DD.MM.YYYY HH:mm:ss"));
            html += CFbi.put_attribute('Дата завершения ситуации',moment(CFUtil.get_local_datetime(CFbi.analyzes[i].situation_denial)).format("DD.MM.YYYY HH:mm:ss"));
            html += CFbi.put_attribute('Место возникновения ситуации',CFbi.analyzes[i].situation_occurence_place);
            html += CFbi.put_attribute('Достаточно ли поступившей оперативной информации для правильной оценки ситуации?',change_value(CFbi.analyzes[i].sufficiency_of_operative_information));
            html += CFbi.put_attribute('Чего не хватает в поступившей оперативной информации для правильной оценки ситуации?',CFbi.analyzes[i].insufficient_parts_of_operative_information);
            html += CFbi.put_attribute('Какая информация была не достоверной?',CFbi.analyzes[i].non_authentic_information);
            html += CFbi.put_attribute('Правильна ли оценка ситуации ОД САЦ?',change_value(CFbi.analyzes[i].information_estimation_correctness));
            html += CFbi.put_attribute('В чем заключается ошибка ОД САЦ?',CFbi.analyzes[i].od_saz_fault);
            html += CFbi.put_attribute('Нарушен ли порядок передачи оперативной информации?',change_value(CFbi.analyzes[i].information_order_transfer_violation));
            html += CFbi.put_attribute('В чем состоит нарушение порядка передачи оперативной информации?',CFbi.analyzes[i].violation_text);
            $('#data').html(html);
        }
    }
}
/*
 * CKharitonov
 */
CFbi.put_attribute = function(name,value){
    if (value == null) value = ' - ';
    var html = '<div class="form-group">';
        html += '<label>'+name+'</label>';
        html += '<p style="font-style:italic;">'+value+'</p>';
    html += '</div>';
    return html;
}
/*
 * CKharitonov
 */
function change_value(val){
    if (val == 0){
        return 'Нет';
    }
    else if (val == 1){
        return 'Да';
    }
    else {
        return ' - ';
    }
}