//  ------------------------------------------------------------------------------------ //
//                                  ConFrame-Electric CTM V3                             //
//                               Copyright (c) 2011-2014 DunRose                         //
//                                  <http://www.dunrose.ru/>                             //
//  ------------------------------------------------------------------------------------ //
//  Author: Mr. Thurairajasingam Senthilruban           TSRuban[AT]dunrose.ru            //
//  Programmer: Mr. Kharitonov Constantine Igorevich    CKharitonov[AT]dunrose.ru        //
//  URL: http://www.dunrose.ru                                                           //
// ------------------------------------------------------------------------------------- //

var Substation = {
    'base_url' : null,
    'data' : null,
    'default_info' : [
        {'label':'txt_name', 'value':'name'},
        {'label':'txt_semantic_id', 'value':'semantic_id'},
        {'label':'txt_mrid', 'value':'mrid'}
    ],
    'other_info' : {
        'power_transformer' : [],
        'voltage_level' : [
            {'label':'txt_base_voltage', 'value':'base_voltage'},
            {'label':'txt_high_voltage_limit', 'value':'high_voltage_limit'},
            {'label':'txt_low_voltage_limit', 'value':'low_voltage_limit'}
        ],
        'bay' : [
            {'label':'txt_breaker_configuration', 'value':'breaker_configuration'},
            {'label':'txt_busbar_configuration', 'value':'busbar_configuration'}
        ]
    },
    'device_default_info' : [
        {'label':'txt_name', 'value':'name'},
        {'label':'txt_base_voltage', 'value':'base_voltage'},
        {'label':'txt_semantic_id', 'value':'semantic_id'},
        {'label':'txt_mrid', 'value':'mrid'}
    ],
    'switching_device_default_info' : [
        {'label':'txt_name', 'value':'name'},
        {'label':'txt_base_voltage', 'value':'base_voltage'},
        {'label':'txt_semantic_id', 'value':'semantic_id'},
        {'label':'txt_normal_open', 'value':'normal_open'},
        {'label':'txt_mrid', 'value':'mrid'}
    ],
    'device_other_info' : {
        'breaker' : [
            //{'label':'txt_current_state', 'value':'current_state'},
            {'label':'txt_switch_on_count', 'value':'switch_on_count'},
            {'label':'txt_switch_on_date', 'value':'switch_on_date'},
            {'label':'txt_rated_current', 'value':'rated_current'},
            {'label':'txt_breaking_capacity', 'value':'breaking_capacity'},
            {'label':'txt_in_transit_time', 'value':'in_transit_time'}
        ],
        'busbar_section' : [],
        'current_transformer' : [],
        'disconnector' : [
            //{'label':'txt_current_state', 'value':'current_state'},
            {'label':'txt_switch_on_count', 'value':'switch_on_count'},
            {'label':'txt_switch_on_date', 'value':'switch_on_date'},
            {'label':'txt_rated_current', 'value':'rated_current'},
            {'label':'txt_normally_in_service', 'value':'normally_in_service'},
            {'label':'txt_max_initial_short_circuit_current', 'value':'max_initial_short_circuit_current'},
            {'label':'txt_total_break_time', 'value':'total_break_time'},
            {'label':'txt_sleet_total_break_time', 'value':'sleet_total_break_time'}
        ],
        'energy_consumer' : [],
        'energy_source' : [],
        'fuse' : [
            //{'label':'txt_current_state', 'value':'current_state'}
        ],
        'generator' : [],
        'ground' : [],
        'ground_disconnector' : [
            //{'label':'txt_current_state', 'value':'current_state'}
        ],
        'high_frequency_rejector' : [],
        'jumper' : [],
        'line_segment' : [
            {'label':'txt_from_substation', 'value':'from_substation'},
            {'label':'txt_to_substation', 'value':'to_substation'}
        ],
        'load_break_switch' : [
            //{'label':'txt_current_state', 'value':'current_state'}
        ],
        'potential_transformer' : [],
        'power_transformer_end' : [
            {'label':'txt_winding_connection', 'value':'winding_connection'},
            {'label':'txt_xground', 'value':'xground'},
            {'label':'txt_rground', 'value':'rground'},
            {'label':'txt_mag_sat_flux', 'value':'mag_sat_flux'},
            {'label':'txt_mag_base_u', 'value':'mag_base_u'},
            {'label':'txt_grounded', 'value':'grounded'},
            {'label':'txt_end_number', 'value':'end_number'},
            {'label':'txt_bmag_sat', 'value':'bmag_sat'},
            {'label':'txt_x0', 'value':'x0'},
            {'label':'txt_x', 'value':'x'},
            {'label':'txt_rated_u', 'value':'rated_u'},
            {'label':'txt_rated_s', 'value':'rated_s'},
            {'label':'txt_r0', 'value':'r0'},
            {'label':'txt_r', 'value':'r'},
            {'label':'txt_phase_angle_clock', 'value':'phase_angle_clock'},
            {'label':'txt_g0', 'value':'g0'},
            {'label':'txt_g', 'value':'g'},
            {'label':'txt_b0', 'value':'b0'},
            {'label':'txt_b', 'value':'b'}
        ],
        'rectifier_inverter' : [],
        'series_compensator' : [],
        'shunt_compensator' : [],
        'static_var_compensator' : [],
        'surge_protector' : [],
        'synchronous_machine' : []
    }
};
/*
 *  CKharitonov
 */
Substation.display_device_info = function(device){
    if (!device) return '';
    if (!device.type) return '';
    var html = '';
    if (device.type == 'power_transformer' || device.type == 'voltage_level' || device.type == 'bay'){
        for (var i in Substation.default_info){
            html += '<tr><td><b>'+langs.get_term(Substation.default_info[i]['label'])+'</b></td><td>'+device[Substation.default_info[i]['value']]+'</td></tr>';
        }
        if (Substation.other_info[device.type]){
            for (var i in Substation.other_info[device.type]){
                html += '<tr><td><b>'+langs.get_term(Substation.other_info[device.type][i]['label'])+'</b></td><td>'+device[Substation.other_info[device.type][i]['value']]+'</td></tr>';
            }
        }
    }
    else {
        if (device.type == 'breaker' || device.type == 'load_break_switch' || device.type == 'disconnector' || device.type == 'fuse' || device.type == 'ground_disconnector'){
            for (var i in Substation.switching_device_default_info){
                html += '<tr><td><b>'+langs.get_term(Substation.switching_device_default_info[i]['label'])+'</b></td><td>'+device[Substation.switching_device_default_info[i]['value']]+'</td></tr>';
            }
        }
        else {
            for (var i in Substation.device_default_info){
                html += '<tr><td><b>'+langs.get_term(Substation.device_default_info[i]['label'])+'</b></td><td>'+device[Substation.device_default_info[i]['value']]+'</td></tr>';
            }
        }
        if (Substation.device_other_info[device.type] && (device.id != null || device.type == 'power_transformer_end') && !$.isArray(device.profile)){
            for (var i in Substation.device_other_info[device.type]){
                if (device.type == 'power_transformer_end' || device.type == 'line_segment'){
                    html += '<tr><td><b>'+langs.get_term(Substation.device_other_info[device.type][i]['label'])+'</b></td><td>'+device[Substation.device_other_info[device.type][i]['value']]+'</td></tr>';
                }
                else {
                    html += '<tr><td><b>'+langs.get_term(Substation.device_other_info[device.type][i]['label'])+'</b></td><td>'+device['profile'][Substation.device_other_info[device.type][i]['value']]+'</td></tr>';
                }
            }
        }
    }
    html += Substation.add_tele_measurements(device.type);
    html += Substation.add_buttons(device);
    return html;
}
/*
 *  CKharitonov
 */
Substation.open_device_info = function(div_id,device){
    if (!device) return '';
    var html = '';
    html += '<table class="table table-bordered table-striped table-condensed" style="margin-bottom:0;">';
        html += '<tbody>';
            html += Substation.display_device_info(device);
    	html += '</tbody>';
    html += '</table>';
    $('#'+div_id).html(html);
}
/*
 *  CKharitonov
 */
Substation.display_substation_info = function(){
    var html = '';
    html += '<div class="panel panel-default">';
        html += '<div class="panel-heading">';
            html += '<span><h4>'+Substation.data['name'];
                html += '<div class="pull-right">';
                    html += '<a href="javascript:void(0);"';
                        html += 'onClick="edit_device(\'substation\',\'substation\','+Substation.data['id']+')"';
                    html += '>'+langs.get_term('txt_edit')+'</a>';
                    html += '&nbsp;&nbsp;&nbsp;<a href="javascript:void(0)" onclick="duplicate(\'substation\','+Substation.data['id']+')" title="'+langs.get_term('txt_duplicate')+'"><span class="glyphicon glyphicon-random alert-info"></span></a>';
                    html += '&nbsp;&nbsp;&nbsp;<a href="javascript:void(0)" onclick="remove_equipment(\'substation\','+Substation.data['id']+')"><span class="glyphicon glyphicon-remove alert-danger"></span></a>';
                html += '</div>';
            html += '</h4></span>';
        html += '</div>';
        html += '<div class="panel-body" id="'+Substation.data['mrid']+'">';
            html += '<table class="table table-bordered table-striped table-condensed" style="margin-bottom:0;">';
                html += '<tbody>';   
                    html += '<tr>';
                        html += '<td><b>'+langs.get_term('txt_name')+'</b></td>';
                        html += '<td>'+Substation.data['name']+'';
                            html += '<div class="pull-right">';
                                html += '<a href="'+Substation.base_url+'index.php/qobject/substation/rtu/'+Substation.data['id']+'">'+langs.get_term('txt_substation_rtu_topology')+'</a>&nbsp;&nbsp;&nbsp;';
                                html += '<a href="'+Substation.base_url+'index.php/qobject/substation/tabular/'+Substation.data['id']+'">'+langs.get_term('txt_substation_tabular')+'</a>&nbsp;&nbsp;';
                            html += '</div>';
                        html += '</td>';
                    html += '</tr>';
                    html += '<tr>';
                        html += '<td><b>'+langs.get_term('txt_substn_type')+'</b></td>';
                        html += '<td>'+Substation.data['substation_type_name']+' ('+Substation.data['substation_type_code']+')</td>';
                    html += '</tr>';
                    html += '<tr>';
                        html += '<td><b>'+langs.get_term('ttl_organizational_structure')+'</b></td>';
                        html += '<td>'+Substation.data['path']+'</td>';
                    html += '</tr>';
                    html += '<tr>';
                        html += '<td><b>'+langs.get_term('txt_high_voltage')+'</b></td>';
                        html += '<td>'+Substation.data['base_voltage']+'</td>';
                    html += '</tr>';
                    html += '<tr>';
                        html += '<td><b>'+langs.get_term('txt_semantic_id')+'</b></td>';
                        html += '<td>'+Substation.data['semantic_id']+'</td>';
                    html += '</tr>';
                    html += '<tr>';
                        html += '<td><b>'+langs.get_term('txt_composite_id')+'</b></td>';
                        html += '<td>'+check_not_null(Substation.data['composite_id'])+'</td>';
                    html += '</tr>';
                    html += '<tr>';
                        html += '<td><b>'+langs.get_term('txt_mrid')+'</b></td>';
                        html += '<td>'+Substation.data['mrid']+'</td>';
                    html += '</tr>';
                    html += '<tr>';
                        html += '<td><b>'+langs.get_term('txt_conframe')+'</b></td>';
                        html += '<td>';
                            console.log(Substation.data);
                            if (Substation.data['conframe_id'] && Substation.data['conframe_info'].length != 0){
                                html += Substation.data['conframe_info']['name'];
                                html += '<div class="pull-right">';
                                    html += '<a href="javascript:void(0)" onclick="open_display(\''+Substation.base_url+'index.php/qconframe/ctm/view/'+Substation.data['conframe_id']+'\')">'+langs.get_term('sm_btn_open')+' '+langs.get_term('txt_conframe')+'</a>&nbsp;&nbsp;';
                                html += '</div>';
                            }
                        html += '</td>';
                    html += '</tr>';
                    html += Substation.add_tele_measurements('substation');
                    html += Substation.add_buttons(Substation.data);
                html += '</tbody>';
            html += '</table>';
        html += '</div>';
    html += '</div>';
    $('#substn_info').html(html);
}
/*
 *  CKharitonov
 */
Substation.open_substation = function(callback){
    $.ajax({
        url: Substation.base_url+'index.php/qobject/substation_ajax/get_substation_info_json/'+Substation.data['id'],
        success: function(data){
            Substation.data = JSON.parse(data);
            Substation.run();
            if (callback){
                callback.call();
            }
        }
    });
}
/*
 *  CKharitonov
 */
Substation.open_power_transformer = function(div_id,parent_id,callback){
    $.ajax({
        url: Substation.base_url+'index.php/qobject/substation_ajax/get_power_transformer_full_info/'+parent_id,
        success: function(data){
            for (var i=0; i<Substation.data.power_transformer.length; i++){
                if (Substation.data.power_transformer[i]['id'] == parent_id){
                    Substation.data.power_transformer[i]['profile'] = JSON.parse(data);
                    Substation.open_device_info(div_id,Substation.data.power_transformer[i]);
                    Substation.add_div(div_id,'power_transformer_end',i);
                    Substation.update_topology_tree(Substation.data.power_transformer[i]);
                    if (callback){
                        callback.call();
                    }
                }
            }
        }
    });
}
/*
 *  CKharitonov
 */
Substation.open_voltage_level = function(div_id,parent_id,callback){
    $.ajax({
        url: Substation.base_url+'index.php/qobject/substation_ajax/get_full_info/voltage_level/'+parent_id+'/bay',
        success: function(data){
            for (var i=0; i<Substation.data.voltage_level.length; i++){
                if (Substation.data.voltage_level[i]['id'] == parent_id){
                    Substation.data.voltage_level[i]['bay'] = JSON.parse(data);
                    Substation.open_device_info(div_id,Substation.data.voltage_level[i]);
                    Substation.add_div(div_id,'bay',i);
                    Substation.update_topology_tree(Substation.data.voltage_level[i]);
                    if (callback){
                        callback.call();
                    }
                }
            }
        }
    });
}
/*
 *  CKharitonov
 */
Substation.open_bay = function(div_id,parent_id,callback){
    $.ajax({
        url: Substation.base_url+'index.php/qobject/substation_ajax/get_full_info/bay/'+parent_id+'/equipment',
        success: function(data){
            for (var i=0; i<Substation.data.voltage_level.length; i++){
                if (Substation.data.voltage_level[i].bay){
                    for (var j=0; j<Substation.data.voltage_level[i].bay.length; j++){
                        if (Substation.data.voltage_level[i].bay[j]['id'] == parent_id){
                            Substation.data.voltage_level[i].bay[j]['equipment'] = JSON.parse(data);
                            Substation.open_device_info(div_id,Substation.data.voltage_level[i].bay[j]);
                            Substation.add_div(div_id,'equipment',i,j);
                            Substation.update_topology_tree(Substation.data.voltage_level[i].bay[j]);
                            if (callback){
                                callback.call();
                            }
                        }
                    }
                }
            }
        }
    });
}
/*
 *  CKharitonov
 */
Substation.open_device = function(div_id,device){
    if (device == 'pte'){
        for (var i=0; i<Substation.data.power_transformer.length; i++){
            if (Substation.data.power_transformer[i].profile && Substation.data.power_transformer[i].profile.power_transformer_end != null){
                for (var j=0; j<Substation.data.power_transformer[i].profile.power_transformer_end.length; j++){
                    if (Substation.data.power_transformer[i].profile.power_transformer_end[j]['mrid'] == div_id){
                        Substation.open_device_info(div_id,Substation.data.power_transformer[i].profile.power_transformer_end[j]);
                    }
                }
            }
        }
    }
    else {
        for (var i=0; i<Substation.data.voltage_level.length; i++){
            if (Substation.data.voltage_level[i].bay){
                for (var j=0; j<Substation.data.voltage_level[i].bay.length; j++){
                    if (Substation.data.voltage_level[i].bay[j].equipment){
                        for (var n=0; n<Substation.data.voltage_level[i].bay[j].equipment.length; n++){
                            if (Substation.data.voltage_level[i].bay[j].equipment[n]['mrid'] == div_id){
                                Substation.open_device_info(div_id,Substation.data.voltage_level[i].bay[j].equipment[n]);
                            }
                        }
                    }
                }
            }
        }
    }
}
/*
 *  CKharitonov
 */
Substation.load_other_info = function(device,id,div_id){
    $.ajax({
        url: Substation.base_url+'index.php/qobject/substation_ajax/get_other_info/'+device+'/'+id,
        success: function(data){
            for (var i=0; i<Substation.data.voltage_level.length; i++){
                if (Substation.data.voltage_level[i].bay){
                    for (var j=0; j<Substation.data.voltage_level[i].bay.length; j++){
                        if (Substation.data.voltage_level[i].bay[j].equipment){
                            for (var n=0; n<Substation.data.voltage_level[i].bay[j].equipment.length; n++){
                                if (Substation.data.voltage_level[i].bay[j].equipment[n]['id'] == id && Substation.data.voltage_level[i].bay[j].equipment[n]['type'] == device){
                                    Substation.data.voltage_level[i].bay[j].equipment[n]['profile'] = JSON.parse(data);
                                    Substation.open_device_info(div_id,Substation.data.voltage_level[i].bay[j].equipment[n]);
                                }
                            }
                        }
                    }
                }
            }
        }
    });
}
/*
 *  CKharitonov
 */
Substation.add_div = function(div_id,device,i,j){
    var html = '';
    if (device == 'power_transformer' && Substation.data.power_transformer){
        html += '<h4 class="text-center">'+langs.get_term('txt_power_transformer')+'</h4>';
        for (var i=0; i<Substation.data.power_transformer.length; i++){
            html += '<div class="panel panel-warning">';
                html += '<div class="power_trans_hover panel-heading"><div onClick="toggle(\'';
                    html += Substation.data.power_transformer[i]['mrid'];
                    html += '\',\'power_transformer_end\','+Substation.data.power_transformer[i]['id']+')" style="cursor:pointer; float:left; width:85%;"><b>'+Substation.data.power_transformer[i]['name']+'</b>&nbsp;&nbsp;&nbsp;</div>&nbsp';
                    html += '<div class="pull-right"><a href="'+Substation.base_url+'index.php/qobject/equipment_profile/'+Substation.data.power_transformer[i]['id']+'">'+langs.get_term('btn_profile')+'</a>&nbsp;&nbsp;&nbsp;'; 
                    html += '<a href="javascript:void(0)" onClick="edit_device(\'equipment_power_transformer\',\'power_transformer\','+Substation.data.power_transformer[i]['id']+',\''+Substation.data['mrid']+'\','+Substation.data['id']+',\''+Substation.data.power_transformer[i]['mrid']+'\');"';
                    html += '>'+langs.get_term('txt_edit')+'</a>';
                    html += '&nbsp;&nbsp;&nbsp;<a href="javascript:void(0)" onclick="remove_equipment(\'power_transformer\','+Substation.data.power_transformer[i]['id']+',\''+Substation.data.power_transformer[i]['mrid']+'\')"><span class="glyphicon glyphicon-remove alert-danger"></span></a>';
                html += '</div></div>';
                html += '<div class="panel-body hide" id="';
                    html += Substation.data.power_transformer[i]['mrid'];
                    html += '">';
                html += '</div>';
            html += '</div>';
        }
    }
    else if (device == 'voltage_level' && Substation.data.voltage_level){
        html += '<h4 class="text-center">'+langs.get_term('txt_voltage_level')+'</h4>';
        for (var i=0; i<Substation.data.voltage_level.length; i++){
            html += '<div class="panel panel-info">';
                html += '<div class="vol_lev_hover panel-heading"><div onClick="toggle(\'';
                    html += Substation.data.voltage_level[i]['mrid'];
                    html += '\',\'bay\','+Substation.data.voltage_level[i]['id']+')" style="cursor:pointer; float:left; width:90%;"><b>'+Substation.data.voltage_level[i]['name']+'</b>&nbsp;&nbsp;&nbsp;&nbsp;</div>&nbsp;<div class="pull-right"><a href="javascript:void(0);"'; 
                    html += 'onClick="edit_device(\'voltage_level\',\'voltage_level\','+Substation.data.voltage_level[i]['id']+',\''+Substation.data['mrid']+'\','+Substation.data['id']+',\''+Substation.data.voltage_level[i]['mrid']+'\');"';
                    html += '>'+langs.get_term('txt_edit')+'</a>';
                    html += '&nbsp;&nbsp;&nbsp;<a href="javascript:void(0)" onclick="duplicate(\'voltage_level\','+Substation.data.voltage_level[i]['id']+')" title="'+langs.get_term('txt_duplicate')+'"><span class="glyphicon glyphicon-random alert-info"></span></a>';
                    html += '&nbsp;&nbsp;&nbsp;<a href="javascript:void(0)" onclick="remove_equipment(\'voltage_level\','+Substation.data.voltage_level[i]['id']+',\''+Substation.data.voltage_level[i]['mrid']+'\')"><span class="glyphicon glyphicon-remove alert-danger"></span></a>';
                html += '</div></div>';
                html += '<div class="panel-body hide" id="';
                    html += Substation.data.voltage_level[i]['mrid'];
                    html += '">';
                html += '</div>';
            html += '</div>';
        }
    }
    else if (device == 'power_transformer_end' && Substation.data.power_transformer[i].profile.power_transformer_end){
        html += '<h4 class="text-center">'+langs.get_term('txt_power_transformer_end')+'</h4>';
        for (var j=0; j<Substation.data.power_transformer[i].profile.power_transformer_end.length; j++){
            html += '<div class="panel panel-success">';
                html += '<div class="bay_pte_hover panel-heading"><div onClick="toggle(\'';
                    html += Substation.data.power_transformer[i].profile.power_transformer_end[j]['mrid'];
                    html += '\',\'pte\','+Substation.data.power_transformer[i].profile.power_transformer_end[j]['id']+')" style="cursor:pointer; float:left; width:85%;"><b>'+Substation.data.power_transformer[i].profile.power_transformer_end[j]['name']+'</b>&nbsp;&nbsp;&nbsp;&nbsp;</div>&nbsp;<div class="pull-right"><a href="javascript:void(0);"'; 
                    html += 'onClick="edit_device(\'power_transformer_end\',\'power_transformer_end\','+Substation.data.power_transformer[i].profile.power_transformer_end[j]['id']+',\''+Substation.data.power_transformer[i]['mrid']+'\','+Substation.data.power_transformer[i]['id']+',\''+Substation.data.power_transformer[i].profile.power_transformer_end[j]['mrid']+'\');"';
                    html += '>'+langs.get_term('txt_edit')+'</a>';
                    html += '&nbsp;&nbsp;&nbsp;<a href="javascript:void(0)" onclick="remove_equipment(\'power_transformer_end\','+Substation.data.power_transformer[i].profile.power_transformer_end[j]['id']+',\''+Substation.data.power_transformer[i].profile.power_transformer_end[j]['mrid']+'\')"><span class="glyphicon glyphicon-remove alert-danger"></span></a>';
                html += '</div></div>';
                html += '<div class="panel-body hide" id="';
                    html += Substation.data.power_transformer[i].profile.power_transformer_end[j]['mrid'];
                    html += '">';
                html += '</div>';
            html += '</div>';
        }
    }
    else if (device == 'bay' && Substation.data.voltage_level[i].bay){
    	html += '<h4 class="text-center">'+langs.get_term('txt_bay')+'</h4>';
    	for (var j=0; j<Substation.data.voltage_level[i].bay.length; j++){
            html += '<div class="panel panel-success">';
                html += '<div class="bay_pte_hover panel-heading"><div onClick="toggle(\'';
                    html += Substation.data.voltage_level[i].bay[j]['mrid'];
                    html += '\',\'equipment\','+Substation.data.voltage_level[i].bay[j]['id']+')" style="cursor:pointer; float:left; width:85%;"><b>'+Substation.data.voltage_level[i].bay[j]['name']+'</b>&nbsp;&nbsp;&nbsp;&nbsp;</div>&nbsp;<div class="pull-right"><a href="javascript:void(0);"'; 
                    html += 'onClick="edit_device(\'bay\',\'bay\','+Substation.data.voltage_level[i].bay[j]['id']+',\''+Substation.data.voltage_level[i]['mrid']+'\','+Substation.data.voltage_level[i]['id']+',\''+Substation.data.voltage_level[i].bay[j]['mrid']+'\');"';
                    html += '>'+langs.get_term('txt_edit')+'</a>';
                    html += '&nbsp;&nbsp;&nbsp;<a href="javascript:void(0)" onclick="duplicate(\'bay\','+Substation.data.voltage_level[i].bay[j]['id']+',\''+Substation.data.voltage_level[i]['mrid']+'\','+Substation.data.voltage_level[i]['id']+')" title="'+langs.get_term('txt_duplicate')+'"><span class="glyphicon glyphicon-random alert-info"></span></a>';
                    html += '&nbsp;&nbsp;&nbsp;<a href="javascript:void(0)" onclick="remove_equipment(\'bay\','+Substation.data.voltage_level[i].bay[j]['id']+',\''+Substation.data.voltage_level[i].bay[j]['mrid']+'\')"><span class="glyphicon glyphicon-remove alert-danger"></span></a>';
                html += '</div></div>';
                html += '<div class="panel-body hide" id="';
                    html += Substation.data.voltage_level[i].bay[j]['mrid'];
                    html += '">';
                html += '</div>';
            html += '</div>';
        }
    }
    else if (device == 'equipment' && Substation.data.voltage_level[i].bay[j].equipment){
        html += '<h4 class="text-center">'+langs.get_term('txt_equipment')+'</h4>';
        for (var n=0; n<Substation.data.voltage_level[i].bay[j].equipment.length; n++){
            html += '<div class="panel panel-default">';
                html += '<div class="equipment_hover panel-heading"><div onClick="toggle(\'';
                    html += Substation.data.voltage_level[i].bay[j].equipment[n]['mrid'];
                    html += '\',\''+Substation.data.voltage_level[i].bay[j].equipment[n]['type']+'\','+Substation.data.voltage_level[i].bay[j].equipment[n]['id']+')" style="cursor:pointer; float:left; width:80%;"><b>'+Substation.data.voltage_level[i].bay[j].equipment[n]['name']+'</b>&nbsp;&nbsp;&nbsp;';
                    html += '<span class="label label-default">'+langs.get_term('txt_'+Substation.data.voltage_level[i].bay[j].equipment[n]['type'])+'</span>';
                    html += '</div>&nbsp;<div class="pull-right"><a href="'+Substation.base_url+'index.php/qobject/equipment_profile/'+Substation.data.voltage_level[i].bay[j].equipment[n]['id']+'">'+langs.get_term('btn_profile')+'</a>&nbsp;&nbsp;&nbsp;';
                    if (Substation.data.voltage_level[i].bay[j].equipment[n]['type'] == 'line_segment'){
                        html += '<a href="javascript:void(0)" onClick="edit_device(\'equipment\',\''+Substation.data.voltage_level[i].bay[j].equipment[n]['type']+'\','+Substation.data.voltage_level[i].bay[j].equipment[n]['line_id']+',\''+Substation.data.voltage_level[i].bay[j]['mrid']+'\','+Substation.data.voltage_level[i].bay[j]['id']+',\''+Substation.data.voltage_level[i].bay[j].equipment[n]['mrid']+'\');"';
                    }
                    else {
                        html += '<a href="javascript:void(0)" onClick="edit_device(\'equipment\',\''+Substation.data.voltage_level[i].bay[j].equipment[n]['type']+'\','+Substation.data.voltage_level[i].bay[j].equipment[n]['id']+',\''+Substation.data.voltage_level[i].bay[j]['mrid']+'\','+Substation.data.voltage_level[i].bay[j]['id']+',\''+Substation.data.voltage_level[i].bay[j].equipment[n]['mrid']+'\');"';
                    }
                    html += '>'+langs.get_term('txt_edit')+'</a>';
                    if (Substation.data.voltage_level[i].bay[j].equipment[n]['type'] != 'line_segment'){
                        html += '&nbsp;&nbsp;&nbsp;<a href="javascript:void(0)" onclick="duplicate(\''+Substation.data.voltage_level[i].bay[j].equipment[n]['type']+'\','+Substation.data.voltage_level[i].bay[j].equipment[n]['id']+',\''+Substation.data.voltage_level[i].bay[j]['mrid']+'\','+Substation.data.voltage_level[i].bay[j]['id']+')" title="'+langs.get_term('txt_duplicate')+'"><span class="glyphicon glyphicon-random alert-info"></span></a>';
                    }
                    html += '&nbsp;&nbsp;&nbsp;<a href="javascript:void(0)" onclick="remove_equipment(\''+Substation.data.voltage_level[i].bay[j].equipment[n]['type']+'\','+Substation.data.voltage_level[i].bay[j].equipment[n]['id']+',\''+Substation.data.voltage_level[i].bay[j].equipment[n]['mrid']+'\')"><span class="glyphicon glyphicon-remove alert-danger"></span></a>';
                html += '</div></div>';
                html += '<div class="panel-body hide" id="';
                    html += Substation.data.voltage_level[i].bay[j].equipment[n]['mrid'];
                    html += '">';
                html += '</div>';
            html += '</div>';
        }
    }
    $('#'+div_id).append(html);
}
/*
 *  CKharitonov
 */
Substation.add_buttons = function(device){
    if (!device) return '';
    var html = '';
    if (device.type == 'substation'){
        html += '<tr>';
            html += '<td colspan="2">';
                html += '<button type="button" class="btn btn-primary btn-xs"';
                    html += 'onClick="add_device(\'equipment_power_transformer\',\'power_transformer\','+Substation.data['id']+',\''+Substation.data['mrid']+'\')">';
                html += langs.get_term('txt_add')+' '+langs.get_term('txt_power_transformer')+'</button>&nbsp;';
                html += '<button type="button" class="btn btn-primary btn-xs"';
                    html += 'onClick="add_device(\'voltage_level\',\'voltage_level\','+Substation.data['id']+',\''+Substation.data['mrid']+'\')">';
                html += langs.get_term('txt_add')+' '+langs.get_term('txt_voltage_level')+'</button>';
                html += '<div class="pull-right" style="margin-top:3px;">';
                    html += '<a href="'+Substation.base_url+'index.php/qobject/substation/equip_param_tabular/'+Substation.data['id']+'">'+langs.get_term('txt_equip_param_tabular')+'</a>&nbsp;&nbsp;';
                html += '</div>';
            html += '</td>';
        html += '</tr>';
    }
    else if (device.type == 'power_transformer'){
    	html += '<tr>';
            html += '<td colspan="2">';
                html += ' <button type="button" class="btn btn-primary btn-xs"';
                    html += 'onClick="add_device(\'power_transformer_end\',\'power_transformer_end\','+device['id']+',\''+device['mrid']+'\');"';
                html += '>'+langs.get_term('txt_add')+' '+langs.get_term('txt_power_transformer_end')+'</button>';
            html += '</td>';
        html += '</tr>';
    }
    else if (device.type == 'voltage_level'){
    	html += '<tr>';
            html += '<td colspan="2">';
                html += ' <button type="button" class="btn btn-primary btn-xs"';
                    html += 'onClick="add_device(\'bay\',\'bay\','+device['id']+',\''+device['mrid']+'\');"';
                html += '>'+langs.get_term('txt_add')+' '+langs.get_term('txt_bay')+'</button>';
            html += '</td>';
        html += '</tr>';
    }
    else if (device.type == 'bay'){
    	html += '<tr>';
            html += '<td colspan="2">';
                html += '<div class="btn-group">';
                    html += '<button class="btn btn-primary btn-xs dropdown-toggle" type="button" data-toggle="dropdown">';
                        html += langs.get_term('txt_add')+' '+langs.get_term('txt_switching_equipment')+' <span class="caret"></span>';
                    html += '</button>';
                    html += '<ul class="dropdown-menu" role="menu">';
                        html += '<li><a href="javascript:void(0);" onClick="add_device(\'switching_equipment\',\'breaker\','+device['id']+',\''+device['mrid']+'\');">'+langs.get_term('txt_breaker')+'</a></li>';
                        html += '<li><a href="javascript:void(0);" onClick="add_device(\'switching_equipment\',\'load_break_switch\','+device['id']+',\''+device['mrid']+'\');">'+langs.get_term('txt_load_break_switch')+'</a></li>';
                        html += '<li><a href="javascript:void(0);" onClick="add_device(\'switching_equipment\',\'disconnector\','+device['id']+',\''+device['mrid']+'\');">'+langs.get_term('txt_disconnector')+'</a></li>';
                        html += '<li><a href="javascript:void(0);" onClick="add_device(\'switching_equipment\',\'ground_disconnector\','+device['id']+',\''+device['mrid']+'\');">'+langs.get_term('txt_ground_disconnector')+'</a></li>';
                        html += '<li><a href="javascript:void(0);" onClick="add_device(\'switching_equipment\',\'fuse\','+device['id']+',\''+device['mrid']+'\');">'+langs.get_term('txt_fuse')+'</a></li>';
                    html += '</ul>';
                html += '</div> ';
                html += '<div class="btn-group">';
                    html += '<button class="btn btn-primary btn-xs dropdown-toggle" type="button" data-toggle="dropdown">';
                        html += langs.get_term('txt_add')+' '+langs.get_term('txt_measuring_equipment')+' <span class="caret"></span>';
                    html += '</button>';
                    html += '<ul class="dropdown-menu" role="menu">';
                        html += '<li><a href="javascript:void(0);" onClick="add_device(\'equipment\',\'current_transformer\','+device['id']+',\''+device['mrid']+'\');">'+langs.get_term('txt_current_transformer')+'</a></li>';
                        html += '<li><a href="javascript:void(0);" onClick="add_device(\'equipment\',\'potential_transformer\','+device['id']+',\''+device['mrid']+'\');">'+langs.get_term('txt_potential_transformer')+'</a></li>';
                    html += '</ul>';
                html += '</div> ';
                html += '<div class="btn-group">';
                    html += '<button class="btn btn-primary btn-xs dropdown-toggle" type="button" data-toggle="dropdown">';
                        html += langs.get_term('txt_add')+' '+langs.get_term('txt_compensator')+' <span class="caret"></span>';
                    html += '</button>';
                    html += '<ul class="dropdown-menu" role="menu">';
                        html += '<li><a href="javascript:void(0);" onClick="add_device(\'equipment\',\'static_var_compensator\','+device['id']+',\''+device['mrid']+'\');">'+langs.get_term('txt_static_var_compensator')+'</a></li>';
                        html += '<li><a href="javascript:void(0);" onClick="add_device(\'equipment\',\'series_compensator\','+device['id']+',\''+device['mrid']+'\');">'+langs.get_term('txt_series_compensator')+'</a></li>';
                        html += '<li><a href="javascript:void(0);" onClick="add_device(\'equipment\',\'shunt_compensator\','+device['id']+',\''+device['mrid']+'\');">'+langs.get_term('txt_shunt_compensator')+'</a></li>';
                    html += '</ul>';
                html += '</div> ';
                html += '<div class="btn-group">';
                    html += '<button class="btn btn-primary btn-xs dropdown-toggle" type="button" data-toggle="dropdown">';
                        html += langs.get_term('txt_add')+' '+langs.get_term('txt_other_equipment')+' <span class="caret"></span>';
                    html += '</button>';
                    html += '<ul class="dropdown-menu" role="menu">';
                        html += '<li><a href="javascript:void(0);" onClick="open_line_lookup_window(\'table_forms\',\'substation\',\'obj_ba\',\'line\','+device['id']+','+Substation.data['id']+',\''+device['mrid']+'\');">'+langs.get_term('txt_line')+'</a></li>';
                        html += '<li><a href="javascript:void(0);" onClick="add_device(\'equipment\',\'busbar_section\','+device['id']+',\''+device['mrid']+'\');">'+langs.get_term('txt_busbar_section')+'</a></li>';
                        html += '<li><a href="javascript:void(0);" onClick="add_device(\'equipment\',\'generator\','+device['id']+',\''+device['mrid']+'\');">'+langs.get_term('txt_generator')+'</a></li>';
                        html += '<li><a href="javascript:void(0);" onClick="add_device(\'equipment\',\'ground\','+device['id']+',\''+device['mrid']+'\');">'+langs.get_term('txt_ground')+'</a></li>';
                        html += '<li><a href="javascript:void(0);" onClick="add_device(\'equipment\',\'jumper\','+device['id']+',\''+device['mrid']+'\');">'+langs.get_term('txt_jumper')+'</a></li>';
                        html += '<li><a href="javascript:void(0);" onClick="add_device(\'equipment\',\'synchronous_machine\','+device['id']+',\''+device['mrid']+'\');">'+langs.get_term('txt_synchronous_machine')+'</a></li>';
                        html += '<li><a href="javascript:void(0);" onClick="add_device(\'equipment\',\'energy_consumer\','+device['id']+',\''+device['mrid']+'\');">'+langs.get_term('txt_energy_consumer')+'</a></li>';
                        html += '<li><a href="javascript:void(0);" onClick="add_device(\'equipment\',\'high_frequency_rejector\','+device['id']+',\''+device['mrid']+'\');">'+langs.get_term('txt_high_frequency_rejector')+'</a></li>';
                        html += '<li><a href="javascript:void(0);" onClick="add_device(\'equipment\',\'rectifier_inverter\','+device['id']+',\''+device['mrid']+'\');">'+langs.get_term('txt_rectifier_inverter')+'</a></li>';
                        html += '<li><a href="javascript:void(0);" onClick="add_device(\'equipment\',\'surge_protector\','+device['id']+',\''+device['mrid']+'\');">'+langs.get_term('txt_surge_protector')+'</a></li>';
                        html += '<li><a href="javascript:void(0);" onClick="add_device(\'equipment\',\'energy_source\','+device['id']+',\''+device['mrid']+'\');">'+langs.get_term('txt_energy_source')+'</a></li>';
                    html += '</ul>';
                html += '</div>';
            html += '</td>';
        html += '</tr>';
    }
    else if (Substation.device_other_info[device.type].length > 0 && device.type != 'power_transformer_end'){
        if (device.profile && $.isArray(device.profile)){
            html += '<tr>';
                html += '<td colspan="2">';
                    html += ' <button type="button" class="btn btn-primary btn-xs"';
                        html += 'onClick="add_device(\''+device['type']+'\',\''+device['type']+'\','+device['id']+',\''+device['mrid']+'\');"';
                    html += '>'+langs.get_term('txt_add')+' '+langs.get_term('txt_additional_data')+'</button>';
                html += '</td>';
            html += '</tr>';
        }
        else if (device.profile && !$.isArray(device.profile)){
            html += '<tr>';
                html += '<td colspan="2">';
                    html += ' <button type="button" class="btn btn-primary btn-xs"';
                        html += 'onClick="edit_device(\''+device['type']+'\',\''+device['type']+'\','+device['profile']['id']+',\''+device['mrid']+'\','+device['id']+');"';
                    html += '>'+langs.get_term('txt_modify')+' '+langs.get_term('txt_additional_data')+'</button>';
                html += '</td>';
            html += '</tr>';
        }
    }
    return html;
}
/*
 *  CKharitonov
 */
Substation.add_tele_measurements = function(type){
    var html = '';
    if (type == 'power_transformer' || type == 'voltage_level' || type == 'bay'){
        return html;
    }  
    html += '<tr><td><b>'+langs.get_term('txt_tele_measurement')+'</b></td><td>';
    for (var i=0; i<Substation.data.tele_measurement.length; i++){
        if (Substation.data.tele_measurement[i]['dev_type'] == type){
            html += Substation.data.tele_measurement[i]['name']+'; ';
        }
    }
    html += '</td></tr>';
    return html;
}
/*
 *  CKharitonov
 */
Substation.init = function(){
    console.log(Substation);
};
/*
 *  CKharitonov
 */
Substation.run = function(){
    Substation.display_substation_info();
    Substation.add_div(Substation.data['mrid'],'power_transformer');
    Substation.add_div(Substation.data['mrid'],'voltage_level');
    Substation.build_topology_tree();
};
/*
 *  CKharitonov
 */
Substation.main = function(){
    Substation.init();
    Substation.run();
}
/*
 *  CKharitonov
 */
Substation.build_topology_tree = function(){
    var html = '';
    // Substation
    html += '<li class="closed"><div class="hitarea collapsable-hitarea"></div><span class="'+QCImage.get_icon('substation')+'"></span><span style="cursor:pointer;">&nbsp;'+Substation.data['name']+'</span>';
        html += '<ul>';
            // Power transformer
            html += '<li class="closed"><div class="hitarea collapsable-hitarea"></div><span class="'+QCImage.get_icon('power_transformer_folder')+'"></span><span style="cursor:pointer;">&nbsp;'+langs.get_term('txt_power_transformer')+'</span>';
                html += '<ul>';
                    if (Substation.data.power_transformer && Substation.data.power_transformer != null){
                        for (var i=0; i<Substation.data.power_transformer.length; i++){
                            html += '<li class="closed"><div class="hitarea collapsable-hitarea"></div><span class="'+QCImage.get_icon('power_transformer')+'" onclick="open_div(\''+Substation.data.power_transformer[i]['mrid']+'\',\'power_transformer_end\','+Substation.data.power_transformer[i]['id']+');"></span><span onclick="open_div(\''+Substation.data.power_transformer[i]['mrid']+'\',\'power_transformer_end\','+Substation.data.power_transformer[i]['id']+');" style="cursor:pointer;">&nbsp;'+Substation.data.power_transformer[i]['name']+'</span>';
                                html += '<ul id="'+Substation.data.power_transformer[i]['mrid']+'_ul">';

                                html += '</ul>';
                            html += '</li>';
                        }
                    }
                    html += '<li><div onclick="add_device(\'equipment_power_transformer\',\'power_transformer\','+Substation.data['id']+',\''+Substation.data['mrid']+'\')" title="'+langs.get_term('txt_add')+' '+langs.get_term('txt_power_transformer')+'" style="cursor:pointer;"><span class="glyphicon glyphicon-plus"></span></div></li>';
                html += '</ul>';
            html += '</li>';
            // Voltage level
            html += '<li class="closed"><div class="hitarea collapsable-hitarea"></div><span class="'+QCImage.get_icon('voltage_level_folder')+'"></span><span style="cursor:pointer;">&nbsp;'+langs.get_term('txt_voltage_level')+'</span>';
                html += '<ul>';
                    if (Substation.data.voltage_level && Substation.data.voltage_level != null){
                        for (var i=0; i<Substation.data.voltage_level.length; i++){
                            html += '<li class="closed"><div class="hitarea collapsable-hitarea"></div><span class="'+QCImage.get_icon('voltage_level')+'"></span><span style="cursor:pointer;">&nbsp;'+Substation.data.voltage_level[i]['name']+'</span>';
                                html += '<ul>';
                                    html += '<li class="closed"><div class="hitarea collapsable-hitarea"></div><span class="'+QCImage.get_icon('bay_folder')+'" onclick="open_div(\''+Substation.data.voltage_level[i]['mrid']+'\',\'bay\','+Substation.data.voltage_level[i]['id']+');"></span><span style="cursor:pointer;" onclick="open_div(\''+Substation.data.voltage_level[i]['mrid']+'\',\'bay\','+Substation.data.voltage_level[i]['id']+');">&nbsp;'+langs.get_term('txt_bay')+'</span>';
                                        html += '<ul>';
                                            html += '<div id="'+Substation.data.voltage_level[i]['mrid']+'_ul">';

                                            html += '</div>';
                                            html += '<li><div onclick="add_device(\'bay\',\'bay\','+Substation.data.voltage_level[i]['id']+',\''+Substation.data.voltage_level[i]['mrid']+'\');" title="'+langs.get_term('txt_add')+' '+langs.get_term('txt_bay')+'" style="cursor:pointer;"><span class="glyphicon glyphicon-plus"></span></div></li>';
                                        html += '</ul>';
                                    html += '</li>';
                                html += '</ul>';
                            html += '</li>';
                        }
                    }
                    html += '<li><div onclick="add_device(\'voltage_level\',\'voltage_level\','+Substation.data['id']+',\''+Substation.data['mrid']+'\')" title="'+langs.get_term('txt_add')+' '+langs.get_term('txt_voltage_level')+'" style="cursor:pointer;"><span class="glyphicon glyphicon-plus"></span></div></li>';
                html += '</ul>';
            html += '</li>';
        html += '</ul>';
    html += '</li>';
    var branches = $('#browser').html(html);
    $("#browser").treeview({
        add: branches
    });
}
/*
 *  CKharitonov
 */
Substation.update_topology_tree = function(device){
    var html = '';
    if (device.type == 'power_transformer'){
        if (device.profile.power_transformer_end != null){
            for (var i=0; i<device.profile.power_transformer_end.length; i++){
                html += '<li class="closed"><div class="hitarea collapsable-hitarea"></div><span class="'+QCImage.get_icon('power_transformer_end')+'" onclick="open_div(\''+device.profile.power_transformer_end[i]['mrid']+'\',\'pte\','+device.profile.power_transformer_end[i]['id']+');"></span><span onclick="open_div(\''+device.profile.power_transformer_end[i]['mrid']+'\',\'pte\','+device.profile.power_transformer_end[i]['id']+');" style="cursor:pointer;">&nbsp;'+device.profile.power_transformer_end[i]['name']+'</span>';
                    html += '<ul id="'+device.profile.power_transformer_end[i]['mrid']+'_ul">';
                        for (var j=0; j<Substation.data.tele_measurement.length; j++){
                            if (Substation.data.tele_measurement[j]['dev_type'] == 'power_transformer_end'){
                                html += '<li onmousedown="drag_start(this)" dev_name="" mrid="" dev_type="TM"><div style="cursor:pointer;"><span class=""></span>&nbsp;'+Substation.data.tele_measurement[j]['name']+'</div></li>';
                            }
                        }
                    html += '</ul>';
                html += '</li>';
            }
        }
        html += '<li><div onclick="add_device(\'power_transformer_end\',\'power_transformer_end\','+device['id']+',\''+device['mrid']+'\');" title="'+langs.get_term('txt_add')+' '+langs.get_term('txt_power_transformer_end')+'" style="cursor:pointer;"><span class="glyphicon glyphicon-plus"></span></div></li>';
    }
    else if (device.type == 'voltage_level'){
        // Bay
        if (device.bay && device.bay != null){
            for (var i=0; i<device.bay.length; i++){
                html += '<li class="closed"><div class="hitarea collapsable-hitarea"></div><span class="'+QCImage.get_icon('bay')+'" onclick="open_div(\''+device.bay[i]['mrid']+'\',\'equipment\','+device.bay[i]['id']+');"></span><span onclick="open_div(\''+device.bay[i]['mrid']+'\',\'equipment\','+device.bay[i]['id']+');" style="cursor:pointer;">&nbsp;'+device.bay[i]['name']+'</span>';
                    html += '<ul id="'+device.bay[i]['mrid']+'_ul"></ul>';
                html += '</li>';
            }
        }
    }
    else if (device.type == 'bay'){
        if (device.equipment && device.equipment != null){
            for (var i=0; i<device.equipment.length; i++){
                html += '<li class="closed"><div class="hitarea collapsable-hitarea"></div>';
                    html += '<span class="'+QCImage.get_icon(device.equipment[i].type)+'" onclick="open_div(\''+device.equipment[i]['mrid']+'\',\''+i+'\','+device.equipment[i]['id']+');"></span>';
                    html += '<span onclick="open_div(\''+device.equipment[i]['mrid']+'\',\''+i+'\','+device.equipment[i]['id']+');" style="cursor:pointer;" ';
                        html += ' onmousedown="drag_start(this)"    ';
                        html += 'dev_name="'+device.equipment[i]['name']+'" ';
                        html += 'mrid="'+device.equipment[i]['mrid']+'" ';
                        html += 'dev_type="'+device.equipment[i].type+'" ';
                        html += ' >&nbsp;'+device.equipment[i]['name']+'</span>';
                    html += '<ul id="'+device.equipment[i]['mrid']+'_ul">';
                    for (var n=0; n<Substation.data.tele_measurement.length; n++){
                        if (Substation.data.tele_measurement[n]['dev_type'] == device.equipment[i].type){
                            html += '<li onmousedown="drag_start(this)" ';
                                html += 'dev_name="'+Substation.data.tele_measurement[n]['name']+'" ';
                                html += 'mrid="'+device.equipment[i]['mrid']+'" ';
                                html += 'dev_type="TM" ';
                            html += '><div style="cursor:pointer;"><span class=""></span>&nbsp;'+Substation.data.tele_measurement[n]['name']+'</div></li>';
                        }
                    }
                    html += '</ul>';
                html += '</li>';
            }
        }
        html += '<li><div onclick="select_device(\''+device.mrid+'\','+device.id+')" title="'+langs.get_term('txt_add')+' '+langs.get_term('txt_equipment')+'" style="cursor:pointer;"><span class="glyphicon glyphicon-plus"></span></div></li>';
    }
    var branches = $('#'+device.mrid+'_ul').html(html);
    $("#browser").treeview({
        add: branches
    });
}
/*
 *  CKharitonov
 */
function select_device(div_id,bay_id){
    var dialog = CFUtil.dialog.create("save_window",
    {
        title: langs.get_term('txt_add')+' '+langs.get_term('txt_equipment'),
        autoOpen: false,
        height: "auto",
        width: 400,
        modal: false
    });
    if (dialog){
        html = $.ajax({
            url: url_base+"index.php/qobject/substation_ajax/select_device/"+Substation.data['id']+"/"+bay_id,
            type: "POST"
        }).done(function (response, textStatus, jqXHRб){
            $(dialog).html(response);
        });
        $(dialog).bind('dialogclose', function(event){
            Substation.open_bay(div_id,bay_id);
        });
    }
}
/*
 *  Open modal window for add device
 *  CKharitonov
 */
function add_device(conf_name,dev_type,id,div_id){
    var dialog = CFUtil.dialog.create("save_window",
    {
        title: langs.get_term('txt_add')+' '+langs.get_term('txt_'+dev_type+''),
        autoOpen: false,
        height: "auto",
        width: 400,
        modal: false
    });
    if (dialog){
        html = $.ajax({
            url: Substation.base_url+"index.php/qcore/ajax/load_form/qobject/"+conf_name+"/"+id+"/"+dev_type+"/"+Substation.data['id']+"?CONTINUE=close",
            type: "POST"
        }).done(function (response,textStatus,jqXHRб){
            $(dialog).html(response);            
        });
        $(dialog).bind('dialogclose', function(event){
            if (dev_type == 'power_transformer' || dev_type == 'voltage_level'){
                Substation.open_substation();
            }
            else if (dev_type == 'power_transformer_end'){
                Substation.open_power_transformer(div_id,id);
            }
            else if (dev_type == 'bay'){
                Substation.open_voltage_level(div_id,id);
            }
            else if (conf_name == dev_type && conf_name != 'power_transformer' && conf_name != 'line_segment'){
                Substation.load_other_info(dev_type,id,div_id);
            }
            else {
                Substation.open_bay(div_id,id);
            }
        });
    }
}
/*
 *  Open modal window for edit device
 *  CKharitonov
 */
function edit_device(table,conf_name,id,parent_div_id,parent_id,div_id){
    if (table == 'equipment'){
        if (conf_name == 'breaker' || conf_name == 'load_break_switch' || conf_name == 'disconnector' || conf_name == 'ground_disconnector' || conf_name == 'fuse'){
            table = 'switching_equipment';
        }
        else if (conf_name == 'line_segment'){
            table = 'line';
        }
    }
    var dialog = CFUtil.dialog.create("save_window",
    {
        title: langs.get_term('txt_modify')+' '+langs.get_term('txt_'+conf_name+''),
        autoOpen: false,
        height: "auto",
        width: 400,
        modal: false
    });
    if (dialog){
        html = $.ajax({
            url: Substation.base_url+"index.php/qcore/ajax/edit_form/qobject/"+table+"/"+id+"?CONTINUE=close",
            type: "POST"
        }).done(function (response,textStatus,jqXHRб){
            $(dialog).html(response);
        });
        $(dialog).bind('dialogclose', function(event){
            if (conf_name == 'substation'){
                Substation.open_substation();
            }
            else if (conf_name == 'power_transformer'){
                Substation.open_substation(function(){open_div(div_id,'power_transformer_end',id);});
            }
            else if (conf_name == 'voltage_level'){
                Substation.open_substation(function(){open_div(div_id,'bay',id);});
            }
            else if (conf_name == 'power_transformer_end'){
                Substation.open_power_transformer(parent_div_id,parent_id,function(){open_div(div_id,'pte',id);});  
            }
            else if (conf_name == 'bay'){
                Substation.open_voltage_level(parent_div_id,parent_id,function(){open_div(div_id,'equipment',id);});
            }
            else if (conf_name == table && conf_name != 'power_transformer' && conf_name != 'line_segment'){
                Substation.load_other_info(conf_name,parent_id,parent_div_id);
            }
            else {
                Substation.open_bay(parent_div_id,parent_id,function(){open_div(div_id,conf_name,id);});
            }
        });
    }
}
/*
 *  Open / close div
 *  CKharitonov
 */
function toggle(div_id,device,parent_id){
    if ($("#"+div_id).hasClass("hide")){
        open_div(div_id,device,parent_id);
    }
    else {
        close_div(div_id);
    }
};
/*
 *  CKharitonov
 */
function open_div(div_id,device,parent_id){
    if (device == 'power_transformer_end'){
        Substation.open_power_transformer(div_id,parent_id);
    }
    else if (device == 'bay'){
        Substation.open_voltage_level(div_id,parent_id);
    }
    else if (device == 'equipment'){
        Substation.open_bay(div_id,parent_id);
    }
    else if (device != null){
        Substation.open_device(div_id,device);
    }
    $("#"+div_id).removeClass("hide");
    if (device != 'substation' && device != 'power_transformer' && device != 'voltage_level'){
    	$('.active_panel').removeClass("active_panel");
    	$('#'+div_id).parent().addClass("active_panel");
        try {
            $('html, body').animate({
                scrollTop: $("#"+div_id).offset().top-80
            });
        }
        catch(e){
            console.warn(e);
        }
    }
};
/*
 *  CKharitonov
 */
function close_div(div_id){
    $('#'+div_id).parent().removeClass("active_panel");
    $("#"+div_id).addClass("hide");
};
/*
 *  CKharitonov
 */
$(function(){
    $('#topology').css({'maxHeight':$(window).height()-150+"px"});
    $(".sidetree").mouseenter(function(){
        document.onmousewheel = function(e){
            e.preventDefault();
        }
        $('#sidetree').mousewheel(function (event,delta){
            if (delta > 0){
                topology.scrollTop-=10;
            }
            else {
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
    try {
        document.getElementById('topology').style.maxHeight = $(window).height()-150+"px";
    }
    catch(e){
        console.warn(e);
    }
});
/*
 *  Open window with line list
 *  CKharitonov
 */
function open_line_lookup_window(app,frm,schema,table_name,bay_id,substn_id,line_link){
    var wi = window.open(''+Substation.base_url+'index.php/qcore/ajax/table_lookup/'+app+'/'+frm+'/'+schema+'/'+table_name+'/'+bay_id+'/'+substn_id+'/'+line_link,'lookup','width=550,height=550');
    wi.focus();
}
/*
 *  Update line segment id
 *  CKharitonov
 */
function update_line_segment_id(id,name,form,bay_id,line_link){
    $.ajax({
        url: Substation.base_url+'index.php/qobject/substation_ajax/add_line_segment/'+bay_id+'/'+id+'/'+Substation.data['id'],
        success: function(){
            $('#save_window').dialog('close');
            Substation.open_bay(line_link,bay_id);
        }
    });
}
/*
 *  CKharitonov
 */
function duplicate(type,id,parent_div_id,parent_id){
    query = $.ajax({
        url: Substation.base_url+'index.php/qobject/substation_ajax/duplicate/'+type+'/'+id,
        success: function(data){
            if (type == 'substation'){
                location.href = Substation.base_url+'index.php/qobject/substation_ajax/edit/'+data;
            }
            else if (type == 'voltage_level'){
                Substation.open_substation();
            }
            else if (type == 'bay'){
                Substation.open_voltage_level(parent_div_id,parent_id);
            }
            else {
                Substation.open_bay(parent_div_id,parent_id);
            }
        }
    })
}
/*
 *  Ajax request for remove equipment, take equip id, equip type, link and bay id and send request for remove equip of this id and type
 *  CKharitonov
 */
function remove_equipment(type,id,div_id){
    if (confirm(langs.get_term('txt_are_you_sure'))){
        query = $.ajax({
            url: Substation.base_url+'index.php/qobject/substation_ajax/remove_equipment/'+id+'/'+type,
            success: function(data){
                if (data == 1){
                    if (type == 'substation'){
                        document.location.href = ""+Substation.base_url+"index.php/qobject/";
                    }
                    else {
                        $('#'+div_id).parent().remove();
                        $('#'+div_id+'_ul').parent().remove();
                    }
                }
                else if (data == -1){
                    alert(langs.get_term('err_access_denied'));
                }
                else {
                    alert(langs.get_term('txt_remove_all_elements'));
                }
            }
        });
    }
}
/*
 *  Function for open window with ConFrame. Take link and open window
 *  CKharitonov
 */
function open_display(link){
    var params = [
        'height='+screen.height,
        'width='+screen.width,
        'fullscreen=yes' // only works in IE, but here for completeness
    ].join(',');
    var scada_window = window.open(link,'scada_window',params); 
    scada_window.moveTo(0,0);
    scada_window.focus();
}
/*
 *  CKharitonov
 */
$(document).ready(function(){
    try {
        $("#browser").treeview({
            collapsed: true,
            animated: "fast",
            control: "#sidetreecontrol",
            prerendered: false,
            persist: "cookie"
        });
    }
    catch(e){}   
});
/*
 *  For Draging the element from tree. stores its type, CB,DC,TR etc
 *  TSRuban
 */
function drag_start(ev){
    try {
        var cmd = {};
        var dev_type = $(ev).attr("dev_type");
        var dev_mrid = $(ev).attr("mrid");
        var dev_name = $(ev).attr("dev_name");
        cmd.dev_type = dev_type;
        cmd.dev_mrid = dev_mrid;
        cmd.dev_name = dev_name;
        editor.current_drop_command = cmd;
        console.log(cmd);
    }
    catch(e){}
}

function check_not_null(value){
    if (value == null){
        value = '-';
    }
    return value;
}