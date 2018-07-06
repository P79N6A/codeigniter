/* 
 *
 */
/*
 BEOM.load_beom_d = function(){
 var html = '<iframe';
 html += ' width="100%" frameBorder="0" height="500px" src="'+BEOM.base_url+'index.php/conframe_bi/browser/prj_task/3"';
 html += '></iframe>';
 $('#content_div').html(html);
 $('iframe').height($(document).height()-120);
 } 
 */
/*
 Artem
 */
BEOM.load_beom_c = function () {
    BEOM.destroy();
    //clear_option_div()
    var html_text = '';
    html_text += '<h4>Классификаторы</h4><div class="btn-group" role="group" >';
    for ( var i in BEOM.config_buttons_c ) {
        html_text += '<button ';
        for ( var p in BEOM.config_buttons_c[i] ) {
            if ( BEOM.config_buttons_c[i][p] ) {
                html_text += p + '="' + BEOM.config_buttons_c[i][p] + '"';
            }
        }
        html_text += '>' + BEOM.config_buttons_c[i]["value"] + '</button>'
    }
    html_text += '</div><div id="submenu"></div>';
    $('#div_option').html(html_text);
}

BEOM.load_klassification_table_delimiter = function (id_button, table, type, where) {
    if ( !id_button || !table || !type || !where ) {
        return;
    }

    var table_get = BEOM.get_table_schema(table);
    $.ajax({
        url: BEOM.base_url + 'index.php/edom/get_parent_table_where/' + table_get[1] + '/' + table_get[0] + '/' + type + '/' + where,
    }).done(function (responce) {
        //	console.log(responce);
        var array_parent = JSON.parse(responce);

        if ( array_parent.length == 0 ) {
            return;
        }
        BEOM.set_hierarchical(BEOM.get_format_data_table(id_button, array_parent));
        $('.btn.btn-success').removeClass('btn-success')
        if ( id_button ) {
            $('#' + id_button).addClass('btn-success');
        }
    })
}

BEOM.load_klassification_table = function (id_button, table) {
    if ( !id_button || !table ) {
        return;
    }
    BEOM.destroy();
    $('#submenu').html('');

    if ( $('#' + id_button).attr("delimiter") ) {

        var delimiter = $('#' + id_button).attr("delimiter").split(',');

        var html_text = '<div class="btn-group" role="group" >';

        for ( var pos = 1; pos < delimiter.length; pos++ ) {
            html_text += ' <button type="button" class="btn btn-default" value="' + delimiter[pos] + '" id="object_' + pos + '" onclick="BEOM.load_klassification_table_delimiter(\'object_' + pos + '\',\'' + table + '\',\'' + delimiter[pos] + '\',\'' + delimiter[0] + '\')">' + delimiter[pos] + '</button>';
        }

        html_text += '</div>';
        $('#submenu').html(html_text);
        BEOM.change_color_botton(id_button);
        return;
    }

    var table_get = BEOM.get_table_schema(table);
    /*
     *	table_get[1] > таблица;
     *	table_get[0] > схема;
     */

    $.ajax({
        url: BEOM.base_url + 'index.php/edom/get_parent_table/' + table_get[1] + '/' + table_get[0],
    }).done(function (responce) {
        var array_parent = JSON.parse(responce);
        if ( array_parent.length == 0 ) {
            return;
        }
        BEOM.set_hierarchical(BEOM.get_format_data_table(id_button, array_parent));
        BEOM.change_color_botton(id_button);

    })

}

/*
 Artem
 */
BEOM.load_klassification = function (id_button, table) {
    if ( !id_button || !table ) {
        return;
    }
    BEOM.destroy();

    var table_get = BEOM.get_table_schema(table);
    if ( !table_get ) {
        return;
    }

    /*
     *	table_get[1] > таблица;
     *	table_get[0] > схема;
     */

    var url = BEOM.base_url + 'index.php/edom/';
    url += table ? 'get_attr_table/' + table_get[1] + '/' + table_get[0] : 'get_parent';

    if ( table_get[0] == '' ) {
        table_get[0] = null;
    }

    $.ajax({
        url: url,
        success: function (data) {
            var array_parent = JSON.parse(data);
            var html_text = '<div class="btn-group" role="group" >';

            for ( position in array_parent ) {
                html_text += ' <button type="button" class="btn btn-default" id="object_' + array_parent[position]['id'] + '" title="' + array_parent[position]['name'] + '" onclick="BEOM.build_hierarchical(' + array_parent[position]['id'] + ',\'' + table_get[1] + '\',\'' + table_get[0] + '\')">' + array_parent[position]['name_10'] + '</button>';
            }

            html_text += '</div>';

            $('#submenu').html(html_text);
            BEOM.change_color_botton(id_button);
            //$('.btn.btn-warning').removeClass('btn-warning')
            //$('#'+id_button).addClass('btn-warning');
        }
    });

}

/*
 Конфигурация
 ВАЖНО!!! : Схему таблицы передавать без ковычек | Тот атрибут, который ненадо добавлять к кнопке - null
 Artem
 */

BEOM.config_buttons_c = [
    {
        id: "type_event",
        title: null,
        style: null,
        class: "btn btn-primary",
        value: "Типы ситуаций",
        onclick: "BEOM.load_klassification(\'type_event\',\'decart_config_module.event_type_situations\')",//id button,table,function get
    },

    {
        id: "type_event1",
        title: null,
        style: null,
        class: "btn btn-primary",
        value: "Типы устройств РЗА и ПА",
        onclick: "BEOM.load_klassification(\'type_event1\',\'rza_repo\')",//id button,table,function get
    },

    {
        id: "type_event2",
        title: null,
        style: null,
        class: "btn btn-primary",
        value: "Типы сингулярных событий",
        onclick: "BEOM.load_klassification_table(\'type_event2\',\'decart_config_module.type_event\')",//id button,table,function get
    },


    {
        id: "type_event4",
        title: null,
        style: null,
        class: "btn btn-primary",
        value: "РОПИЗ",
        onclick: "BEOM.load_klassification_table(\'type_event4\',\'domain_repositories.ropiz\')",//id button,table,function get
    },

    {
        id: "type_event5",
        title: null,
        style: null,
        class: "btn btn-primary",
        value: "Типы центров управления",
        onclick: "BEOM.load_klassification_table(\'type_event5\',\'sbj_ba.control_centers_types\')",//id button,table,function get
    },

    {
        id: "type_event6",
        title: null,
        style: null,
        class: "btn btn-primary",
        value: "Работа АПВ",
        onclick: "BEOM.load_klassification_table(\'type_event6\',\'domain_repositories.emergency_shutdown_apv\')",//id button,table,function get
    },

    {
        id: "type_event7",
        title: null,
        style: null,
        class: "btn btn-primary",
        value: "Сведения об РПВ",
        onclick: "BEOM.load_klassification_table(\'type_event7\',\'domain_repositories.emergency_shutdown_rpv\')",//id button,table,function get
    },


    {
        id: "type_event9",
        title: null,
        style: null,
        class: "btn btn-primary",
        value: "Типы сообщений",
        onclick: "BEOM.load_klassification_table(\'type_event9\',\'ojur.type_message\')",//id button,table,function get
    },

    {
        id: "type_event10",
        title: null,
        style: null,
        class: "btn btn-primary",
        value: "Виды оснований для изменения орг. режима",
        delimiter: ["type_mode", "РПГ", "ОРР", "РВР", "ЧС"],//[0] название столбца, остальные параметр по которму ищем, ВАЖНО! - запятые внутри текста не использовать!
        onclick: "BEOM.load_klassification_table(\'type_event10\',\'ojur.types_of_grounds_for_changing_org_mode\')",//id button,table,function get
    },

    {
        id: "type_event3",
        title: null,
        style: null,
        class: "btn btn-primary",
        value: "Шкала Бофорта",
        onclick: "BEOM.load_klassification_table(\'type_event3\',\'domain_repositories.beaufort_scale\')",//id button,table,function get
    },

    {
        id: "type_event8",
        title: null,
        style: null,
        class: "btn btn-primary",
        value: "Осадки",
        onclick: "BEOM.load_klassification_table(\'type_event8\',\'domain_repositories.precipitations\')",//id button,table,function get
    },


];

/*
 * функция формирование массива объектов
 * 20150305
 * Vadim GRITSENKO
 */

BEOM.build_hierarchical = function (id, table, schema) {
    var url = BEOM.base_url + 'index.php/edom/';
    if ( schema == "null" ) {
        schema = null;
    }
    var sh = schema ? schema : ' ';

    if ( !table || table == "null" ) {
        url += 'get_hierarchical';
    }
    else {
        url += 'get_hierarchical_table/' + table + '/' + sh;
    }
    $.ajax({
        url: url,
        type: 'POST',
        data: {'id': id},
        success: function (data) {
            var info = JSON.parse(data);
            BEOM.set_hierarchical(info, id);

        }
    });
}

BEOM.set_hierarchical = function (info, id) {
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
        edges: {style: "arrow"},
        smoothCurves: false
    };

    BEOM.network = new vis.Network(container, data, options);
    $('.btn.btn-success').removeClass('btn-success')
    if ( id ) {
        $('#object_' + id).addClass('btn-success');
    }
}
//конец функции
BEOM.get_table_schema = function (table) {
    var table_get = table ? table : null;
    table_get = table_get.split('.');
    if ( table_get.length == 0 ) {
        return null;
    }
    if ( !table_get[1] ) {
        table_get[1] = table_get[0];
        table_get[0] = '';
    }
    return table_get;
}

BEOM.get_format_data_table = function (id_button, array_parent) {
    var info = [];
    info.push({
        name: $('#' + id_button).val(),
        name_10: $('#' + id_button).val().substr(0, 10),
        id: "9999999",
    })
    var name = '';
    for ( var i in array_parent ) {
        name = array_parent[i].name || array_parent[i]["descr"];
        info.push({
            name: name,
            name_10: name.substr(0, 10),
            id: array_parent[i].id,
            parent: "9999999",
        })
    }
    return info
}

BEOM.change_color_botton = function (id_button) {
    $('.btn.btn-warning').removeClass('btn-warning')
    $('#' + id_button).addClass('btn-warning');
}
/***************************//***************************//***************************//***************************//***************************//***************************/
/***************************//***************************//***************************//***************************//***************************//***************************/
/***************************//***************************//***************************//***************************//***************************//***************************/
/*
 Спецификация
 */
BEOM.show_specification = function () {
    $('#pop_up_window').remove();
    if ( choose_object.type == "type" ) {
        return;
    }
    window_open = window.open(BEOM.base_url + 'index.php/edom/attribute/' + choose_object.type + '/' + choose_object.id, choose_object.type, 'left=530,width=1000,height=900,resizable=yes,location=no,modal=yes');
    window_open.focus();
    //alert('показать спецификацию '+id_select)
}
/***************************//***************************//***************************//***************************//***************************//***************************/
/***************************//***************************//***************************//***************************//***************************//***************************/
/***************************//***************************//***************************//***************************//***************************//***************************/