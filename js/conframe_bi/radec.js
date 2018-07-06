//  ------------------------------------------------------------------------------------ //
//                                  ConFrame-Electric CTM V3                             //
//                               Copyright (c) 2011-2014 DunRose                         //
//                                  <http://www.dunrose.ru/>                             //
//  ------------------------------------------------------------------------------------ //
//  Author: Mr. Thurairajasingam Senthilruban           TSRuban[AT]dunrose.ru            //
//  Programmer: Mr. Kharitonov Constantine Igorevich    CKharitonov[AT]dunrose.ru        //
//  URL: http://www.dunrose.ru                                                           //
// ------------------------------------------------------------------------------------- //

var RADEC = {
    'base_url': null,
    'groups': null,
    'items': null,
    'coordX': null,
    'coordY': null,
    'event_info': null,
    'start_time': null,
    'end_time': null,
    'radec_list': null,
    'situation': null,
    'colors': ['#FFEBEE', '#F3E5F5', '#F1F8E9', '#FFF3E0', '#E3F2FD'],
    'class': new Array(),
    'count_of_de_energized_facilities': null,
    'count_ps_rp_tp': null,
    'equipment_people_teams': null
};
/*
 * CKharitonov
 */
RADEC.init = function () {
    var name = RADEC.situation.name != "" ? RADEC.situation.name : RADEC.situation.semantic_id;

    $('#sit_name').append(name);
    html = '<div class="panel-body" id="visualization"></div>';
    $('#radec').html(html);
    if ( RADEC.situation.length != 0 ) {
        RADEC.load_data();
    }
    $(function () {
        $(document).mousedown(function (e) {
            RADEC.coordX = e.pageX;
            RADEC.coordY = e.pageY;
            if ( RADEC.event_info != null ) {
                var found_elem = false;
                $(e.target).parents().map(function () {
                    if ( $(this).attr('role') == 'dialog' ) {
                        found_elem = true;
                        return;
                    }
                });
                if ( found_elem == false ) {
                    RADEC.event_info = null;
                    $("#event_info").dialog('close');
                }
            }
        });
    });
}
/*
 * CKharitonov
 */
RADEC.load_data = function () {
    $('#visualization').empty();
    RADEC.groups = new vis.DataSet();
    RADEC.items = new vis.DataSet();
    var i = 0;
    for ( var key in RADEC.radec_list ) {
        RADEC.groups.add({
            id: key,
            content: RADEC.radec_list[key],
            style: 'background-color:' + RADEC.colors[i]
        });
        RADEC.class[key] = 'c' + i;
        i++;
    }
    if ( RADEC.situation.events != null ) {
        for ( var i = 0; i < RADEC.situation.events.length; i++ ) {
            var start = null;
            if ( RADEC.situation.events[i].appearence_time != null ) {
                start = new Date(RADEC.situation.events[i].appearence_time);
            }
            else {
                start = CFUtil.get_local_datetime(RADEC.situation.events[i].message.date);
            }
            RADEC.items.add({
                id: RADEC.situation.events[i].id,
                group: RADEC.situation.events[i].ropiz,
                start: start,
                className: RADEC.class[RADEC.situation.events[i].ropiz],
                content: RADEC.situation.events[i].event_type_abbrev
            });
        }
    }
    RADEC.get_event_time();
    var options = {
        //start: RADEC.start_time,
        //end: RADEC.end_time,
        editable: false,
        margin: {
            item: 10,
            axis: 5
        },
        locale: 'ru'
    };
    var container = document.getElementById('visualization');
    timeline = new vis.Timeline(container, null, options);
    timeline.setGroups(RADEC.groups);
    timeline.setItems(RADEC.items);
    timeline.on('select', function (properties) {
        if ( properties.items.length != 0 ) {
            RADEC.open_dialog(properties.items[0]);
        }
    });
}
/*
 * CKharitonov
 */
RADEC.open_dialog = function (id) {
    RADEC.event_info = CFUtil.dialog.create("event_info",
        {
            title: '&nbsp;',
            height: 350,
            width: 500,
            resizable: false,
            position: [RADEC.coordX + 10, RADEC.coordY + 10]
        });
    if ( RADEC.event_info ) {
        $.ajax({
            url: RADEC.base_url + 'index.php/conframe_bi/get_event_info/' + id,
            beforeSend: function () {
                if ( 'start_preloader' in RADEC ) {
                    $(RADEC.event_info).html(RADEC.start_preloader());
                }
            },
            success: function (data) {

                data = JSON.parse(data);
                var opened_event = data[0];
                var html = '<div style="max-height:290px;overflow:auto;">';
                html += '<table class="table table-condensed TblSituation" style="font-size:12px;margin-top:8px;margin-bottom:2px;">';
                html += '<tr class="active">';
                html += '<td colspan="3" style="background-color: #353A41;">';

                html += '<b ><label style="cursor:pointer;" onclick="toggle(\'msg\')">' + opened_event.text + '</label></b> ' + RADEC.get_icon(opened_event.type_operator);
                //  html += '&nbsp;<span  class="';

                /* if (opened_event.message.msg_type == 'sms'){
                 html += 'glyphicon glyphicon-envelope';
                 }
                 else if (opened_event.message.msg_type == 'email'){
                 html += 'glyphicon glyphicon-inbox';
                 }
                 else if (opened_event.message.msg_type == 'ojur'){
                 html += 'glyphicon glyphicon-book';
                 }*/
                //   html += '" title="'+langs.get_term(opened_event.message.msg_type)+'"></span>&nbsp;';
                html += '</td>';
                html += '</tr>';
                html += '<tr>';
                html += '<td colspan="3"  style="padding:0px">';
                html += '<table class="table table-condensed table-bordered"  style="font-size:12px;margin-top:0px;margin-bottom:10px;">';
                html += '<tr id="msg" style="display:none;">';
                html += '<td colspan="3"><b>' + langs.get_term('txt_message') + '</b><br>' + htmlentities(opened_event.message.text) + '</td>';
                html += '</tr>';
                html += put_attribute(langs.get_term('txt_information_incorrect_operating_pa'), opened_event["information_incorrect_operating_pa"]);
                html += put_attribute(langs.get_term('txt_information_about_aircraft'), opened_event["information_about_aircraft"]);
                html += put_attribute(langs.get_term('txt_state_of_sdtu'), opened_event["state_of_sdtu_fk_pr"]);
                html += put_attribute(langs.get_term('txt_battery_info'), opened_event["battery_info"]);
                html += put_attribute(langs.get_term('txt_state_own_needs'), opened_event["state_own_needs"]);
                html += put_attribute(langs.get_term('txt_characteristics_disconnected_consumers'), opened_event["characteristics_disconnected_consumers"]);
                html += put_attribute(langs.get_term('txt_cause_of_situation'), opened_event["cause_of_situation"]);
                html += put_attribute(langs.get_term('txt_cutoff_power_mvt'), opened_event["cutoff_power_mvt"]);
                html += put_attribute(langs.get_term('txt_wind'), opened_event["wind"]);
                html += put_attribute(langs.get_term('txt_action_crew'), opened_event["information_crew_name"]);
                html += put_attribute(langs.get_term('txt_fk_precipitation'), opened_event["precipitations_name"]);
                html += put_attribute(langs.get_term('txt_temperature'), opened_event["temperature"]);
                html += put_attribute(langs.get_term('txt_forecast_recovery_consumers'), opened_event["forecast_recovery_consumers"]);
                html += put_attribute(langs.get_term('txt_fias_unpowered_count'), opened_event["fias_unpowered_count"]);
                html += put_attribute(langs.get_term('txt_appearence_time'), moment(opened_event["appearence_time"]).format("DD.MM.YYYY HH:mm:ss"));
                html += put_attribute(langs.get_term('txt_time_loss_consumers'), opened_event["time_loss_consumers"]);
                html += put_attribute(langs.get_term('txt_numeric_feed_consumers'), opened_event["numeric_feed_consumers"]);
                html += put_attribute(langs.get_term('txt_number_of_de_energized_consumers'), opened_event["number_of_de_energized_consumers"]);
                html += put_attribute(langs.get_term('txt_number_of_remaining_de_energized_consumers'), opened_event["number_of_remaining_de_energized_consumers"]);
                html += put_attribute(langs.get_term('txt_fk_ropiz'), RADEC.radec_list[opened_event["ropiz"]]);
                html += put_attribute(langs.get_term('ttl_organizational_structure'), opened_event["org_struct_name"]);
                html += put_attribute(langs.get_term('txt_datetime_create'), moment(opened_event["datetime_create"]).format("DD.MM.YYYY HH:mm:ss"));
                html += put_attribute(langs.get_term('txt_info_emergency_operations_disconnect'), opened_event["info_emergency_operations_disconnect"]);
                html += put_array_of_attributes(langs.get_term('txt_action_n_equipment'), opened_event["action_n_equipment"]);
                html += put_array_of_attributes(langs.get_term('txt_action_n_feeder'), opened_event["action_n_feeder"]);
                html += put_array_of_attributes(langs.get_term('txt_action_n_vl'), opened_event["action_n_vl"]);
                html += put_array_of_attributes(langs.get_term('txt_changing_modes'), opened_event["changing_modes"]);
                html += put_array_of_attributes_with_type('count_of_de_energized_facilities', opened_event["count_of_de_energized_facilities"]);
                html += put_array_of_attributes_with_type('count_ps_rp_tp', opened_event["count_ps_rp_tp"]);
                html += put_array_of_attributes_with_type('equipment_people_teams', opened_event["equipment_people_teams"]);
                html += put_array_of_attributes(langs.get_term('txt_fias'), opened_event["fias"]);
                html += put_array_of_attributes(langs.get_term('txt_level_rza'), opened_event["level_rza"]);
                html += put_array_of_attributes(langs.get_term('txt_object_ps'), opened_event["object_ps"]);
                html += put_array_of_attributes(langs.get_term('txt_object_vl'), opened_event["object_vl"]);
                html += put_array_of_attributes(langs.get_term('txt_orgstruct'), opened_event["orgstruct"]);
                html += put_array_of_attributes(langs.get_term('txt_result_apv'), opened_event["result_apv"]);
                html += put_array_of_attributes(langs.get_term('txt_result_rpv'), opened_event["result_rpv"]);
                html += '</table>';
                html += '</td>';
                html += '</tr>';
                html += '</table>';
                html += '</div>';
                $(RADEC.event_info).html(html);
                $(RADEC.event_info).dialog({title: opened_event.event_type});
            }
        });
    }
}
/*
 * CKharitonov
 */
RADEC.get_event_time = function () {
    if ( RADEC.situation.events == null ) {
        return;
    }
    if ( RADEC.situation.events.length == 0 ) {
        return;
    }
    var time = [];
    for ( var i = 0; i < RADEC.situation.events.length; i++ ) {
        if ( RADEC.situation.events[i].appearence_time != null ) {
            time.push(RADEC.situation.events[i].appearence_time);
        }
        else {
            time.push(moment(CFUtil.get_local_datetime(RADEC.situation.events[i].message.date)).format("YYYY-MM-DD HH:mm:ss"));
        }
    }
    time = time.sort();
    RADEC.start_time = time[0];
    RADEC.end_time = time[time.length - 1];
}
/*
 * CKharitonov
 */
function put_attribute(name, value) {
    var html = '';
    if ( value != null && value != 'Invalid date' ) {
        html += '<tr class="active">';
        html += '<td width="50%"><b>' + name + '</b></td>';
        html += '<td colspan="2">' + value + '</td>';
        html += '</tr>';
    }
    return html;
}
/*
 * CKharitonov
 */
function put_array_of_attributes_with_type(name, array) {
    var html = '';
    if ( array && array.length != 0 ) {
        html += '<tr class="active">';
        html += '<td width="50%"><b>' + langs.get_term('txt_' + name + '') + '</b></td>';
        html += '<td colspan="2">';
        html += '<ul>';
        for ( var i = 0; i < array.length; i++ ) {
            html += '<li>' + RADEC[name][array[i].type] + array[i].value + '</li>';
        }
        html += '</ul>';
        html += '</td>';
        html += '</tr>';
    }
    return html;
}
/*
 * CKharitonov
 */
function put_array_of_attributes(name, array) {
    var html = '';
    if ( array && array.length != 0 ) {
        html += '<tr class="active">';
        html += '<td width="50%"><b>' + name + '</b></td>';
        html += '<td colspan="2">';
        html += '<ul>';
        for ( var i = 0; i < array.length; i++ ) {
            html += '<li>' + array[i].value + '</li>';
        }
        html += '</ul>';
        html += '</td>';
        html += '</tr>';
    }
    return html;
}
/*
 * CKharitonov
 */
function toggle(id) {
    $('#' + id).toggle();
}

function htmlentities(s) {
    var div = document.createElement('div');
    var text = document.createTextNode(s);
    div.appendChild(text);
    return div.innerHTML;
}
/*
 * CKharitonov
 */
function dynamicSort(property) {
    var sortOrder = 1;
    if ( property[0] === "-" ) {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a, b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}
/*
 * CKharitonov
 */
RADECtart_preloader = function () {
    var html = '<div id="loader-wrapper">';
    html += '<div id="loader"></div>';
    html += '</div>';
    return html;
}

/*
 Artem
 */
RADEC.get_icon = function (type) {
    var html = '<span class="';
    if ( !type || type == 'NULL' ) {
        html += 'glyphicon glyphicon-envelope';
        html += '">';
    }
    else if ( type == 'beeline' ) {
        html += 'beeline">Б';
    }
    else if ( type == 'megafon' ) {
        html += 'megafon">М';
    }
    else if ( type == 'OJUR' ) {
        html += 'glyphicon glyphicon-book">';
    }
    else {
        html += '">';
    }
    html += '</span>';
    return html;
}