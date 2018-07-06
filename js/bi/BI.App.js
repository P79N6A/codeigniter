/*

 */



var BI = {
    base_url: null, //переменная для хранения адреса сайта
    list_data_table_db: null, //переменная для хранения списка таблиц БД
    choose_name_table: null, //переменная для хранения наименование выборанной БД
    temp_data_set: {
        name: null, //переменная для хранения наименования наборы данных
        sql_text: null, //переменная для хранения sql-запроса набора данных
    },
    temp_user_report: {
        name: null, //переменная для хранения наименования отчета
        fk_data_set: null, //переменная для хранения идентификатора набора данных
        fields: null, //переменная для хранения списка колонок и их данные
        order: null, //переменная для хранения списка сортируемых колонок
        fk_style: null, //переменная для хранения идентификатора стиля
        group: null, //переменная для хранения идентификатора стиля
        field_config: null, //переменная для хранения конфигурации столбцов
        filters: null, //переменная для хранения фильтров
        parameters: null, //переменная для хранения параметров
    },
    id_data_set: null, // переменная для хранения идентификатора набора данных
    id_user_report: null, //переменная для хранения идентификатора пользовательского отчета
    list_data_set: null, //переменная для хранения списка набора данных
    list_styles: null, //переменная для хранения списка стилей
    list_view_condition: null, //переменная для хранения списка видов условий
    link_condition: null, //переменная для хранения списка соединительных условий
    options_columns: null, //переменная для хранения списка опций колонок
};
//конец функции

/*
 * функция инициализации данных
 * Vadim GRITSENKO
 * 20150420
 */
BI.init = function() {
    $('body').css('height', $(window).height() - 70);
    $('#div_result').css('height', $(window).height() - 90);
    //window.addEventListener( 'resize', on_window_resize, false );

}
//конец функции

/*
 * функция получения посредствам ajax-запроса данных о колонках таблицы
 * Vadim GRITSENKO
 * 20150420
 */
BI.ajax_columns = function(name_table, callback) {
    html = $.ajax({
        url: BI.base_url + 'index.php/bi/get_ajax_columns_table',
        type: "POST",
        data: {
            name_table: name_table,
        }
    }).done(function(response, textStatus, jqXHRб) {
        result = JSON.parse(response);
        if (result.result.length > 0) {
            //$('#list_columns').html(building_table_column(result.result))
            return_text = (building_table_column(result.result));
        } else {
            //$('#list_columns').html('Нет колонок')
            return_text = ('Нет колонок')
        }
        callback(return_text);
    });
}
//конец функции

/*
 * функция построение для вывода на экран полученных колонок
 * Vadim GRITSENKO
 * 20150420
 */
building_table_column = function(array_column) {

    html_text = '<select multiple="multiple" id="list_table_column" size="10">';

    for (column in array_column) {
        html_text += '<option title="' + (array_column[column]['description'] != null ? array_column[column]['description'] : array_column[column]['name_column']) + '" value="' + array_column[column]['name_column'] + '">' + array_column[column]['name_column'] + '</option>';
    }

    html_text += '</select>';

    return html_text;
}
//конец функции

/*
 * функция получение через ajax запрос примерочные данные таблицы
 * Vadim GRITSENKO
 * 20150420
 */
BI.get_sample_data = function(name_table, schema_name) {
    html = $.ajax({
        url: BI.base_url + 'index.php/bi/get_sample_table',
        type: "POST",
        data: {
            name_table: name_table,
            schema_name: schema_name,
        }
    }).done(function(response, textStatus, jqXHRб) {
        result = JSON.parse(response);
        console.log(result);
        if (result.result.length > 0) {
            //$('#util_window').append(building_sample_data(result));
        } else {
            alert('Нет колонок')
        }
    });
}
//конец функции

/*
 * функция вывод примерочных данных таблицы
 * Vadim GRITSENKO
 * 20150420
 */
building_sample_data = function(array_data) {
    html_text = '<table class="table table-bordered">';

    html_text += '<tr>';
    array_data_column = array_data.result;
    array_name_column = array_data.data_column;
    array_keys = Object.keys(array_data_column[0]);
    for (key in array_keys) {
        name_column = array_keys[key];
        for (numb_column in array_name_column) {
            if (array_name_column[numb_column]['name_column'] == array_keys[key]) {
                name_column = array_name_column[numb_column]['comment'];
                break;
            }
        }
        html_text += '<th title="' + array_keys[key] + '">' + name_column.substr(0, 20) + '</th>';
    }
    html_text += '</tr>';

    for (row in array_data_column) {
        html_text += '<tr>';
        for (col in array_keys) {
            html_text += '<td>' + array_data_column[row][array_keys[col]] + '</td>';
        }
        html_text += '</tr>';
    }

    html_text += '</table>';
    $('#table_columns').html(html_text);
}
//конец функции

/*
 * функция загрузки диалогового окна
 * 20150316
 * Vadim GRITSENKO
 */
function load_window(data_window) {

    var dialog = CFUtil.dialog.create(data_window.id, {
        title: data_window.title, // переделать langs
        autoOpen: false,
        height: "auto",
        width: (data_window.width ? data_window.width : 400),
        modal: true,
        resizable: false
    });
    if (dialog) {
        $(dialog).html(data_window.html)
    }

}
//конец функции

/*
 * функция очистки временных переменных
 * 20150421
 * Vadim GRITSENKO
 */
function clear_temp_data() {
    BI.temp_data_set = {
        name: null,
        sql_text: null,
    };
    BI.temp_user_report = {
        name: null,
        fk_data_set: null,
        fields: null,
        order: null,
        group: null,
        field_config: null,
        filters: null,
        paramters: null,
    };
    BI.id_data_set = null;
    BI.id_user_report = null;
}
//конец функции

/*
 * функция формирования окна сообщения о выполнении какой-либо операции
 * Vadim GRITSENKO
 * 20150505
 */
get_string_condition = function() {
    condition = '<div class="span_filter"><span class="text_filter">';

    condition += '<select id="name_field">';
    //condition += '<option></option>';
    if (columns_data_set.length > 0) {
        for (numb in columns_data_set) {
            condition += '<option value = ' + columns_data_set[numb] + '>' + columns_data_set[numb] + '</option>';
        }
    }
    condition += '</select>';

    condition += building_select_condition(BI.list_view_condition, 'condition', 'width:100px');

    condition += '<input type="text" id="value_condition" style="margin-bottom:0px"/>';

    condition += building_select_condition(BI.link_condition, 'link_condition', 'width:100px');

    condition += '<span class="glyphicon glyphicon-remove" onclick="$(this).parent().parent().remove()" style="color:red; cursor:pointer"></span>';
    condition += '</span></div>';
    return condition;
}
//конец функции


/*
 * функция формирования окна сообщения о выполнении какой-либо операции
 * Vadim GRITSENKO
 * 20150505
 */
get_string_params = function() {
    condition = '<div class="span_filter"><span class="text_filter">';

    condition += '<input type="text" id="name_params" style="margin-bottom:0px;"/>';

    condition += '<select id="name_field" style="">';
    //condition += '<option></option>';
    if (columns_data_set.length > 0) {
        for (numb in columns_data_set) {
            condition += '<option value = ' + columns_data_set[numb] + '>' + columns_data_set[numb] + '</option>';
        }
    }
    condition += '</select>';

    condition += building_select_condition(BI.list_view_condition, 'condition', 'width:150px');

    condition += '<input type="text" id="default_value" style="margin-bottom:0px;width:80px"/>';

    condition += building_select_condition(BI.link_condition, 'link_condition', 'width:50px');

    condition += '<span class="glyphicon glyphicon-remove" onclick="$(this).parent().parent().remove()" style="color:red; cursor:pointer"></span>';
    condition += '</span></div>';
    return condition;
}
//конец функции

/*
 * функция построения в виде строки элемента select
 * Vadim GRITSENKO
 * 20150505
 */
building_select_condition = function(array_elements, id, style) {

    html_text = '<select id="' + id + '" style="' + style + '">';

    for (element in array_elements) {
        html_text += '<option value="' + (element) + '"><div>' + array_elements[element][1] + '</div></option>';
    }

    html_text += '</select>';

    return html_text;
}
//конец функции

/*
 * функция формирования окна сообщения о выполнении какой-либо операции
 * Vadim GRITSENKO
 * 20150505
 */
function output_message(text, class_alarm) {
    var dialog = new CFEAlert('');
    dialog.set_message(text);
    dialog.set_type(class_alarm);
    dialog.show_message();
}
//конец функции
