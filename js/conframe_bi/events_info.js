
var  CF_Events_info = { 
    base_url:null,
    'count_of_de_energized_facilities' : null,
    'count_ps_rp_tp' : null,
    'equipment_people_teams' : null,
    radec_list : null,
};

CF_Events_info.get_event_info = function(id,id_inf,append_html){
    if (!id) return '';

    $.ajax({
        url:CF_Events_info.base_url+'index.php/conframe_bi/get_event_info/'+id,
    }).done(function(responce){
        //console.log(responce);return;
        if (!responce) return;
        var html = '<div class="">';
        try{
           var responce = JSON.parse(responce); 
        }catch(e){
            console.log('Ошибка при парсинге данных с БД');
            return;
        }
        if (!responce) return;
        if (!responce[0]) return;
        var opened_event = responce[0];
            var alarm = '';
            if (!opened_event) return;
            if  (opened_event.is_alarm == "t" && (!opened_event.is_acquainted_alarm || opened_event.is_acquainted_alarm == 'f')){
                alarm = '<span class="glyphicon glyphicon-bell" style="color:red"></span>'
            }else if (opened_event.is_alarm == "t" && opened_event.is_acquainted_alarm == 't'){
                alarm = '<span class="glyphicon glyphicon-bell" style="color:rgb(234,187,0);"></span>'
            } 

            html += put_attribute('Семантический идентификатор',opened_event.text+alarm);
            html += put_attribute('Тип события',opened_event.event_type);

            if (opened_event.situation_name != null && opened_event.situation_name != ''){
                html += put_attribute('Событие',opened_event.situation_name);
            }else if (opened_event.situation_semantic_id != null){
                html += put_attribute('Событие',opened_event.situation_semantic_id);
            }
            /*********comment code***************/
            if ( typeof ( langs ) == "object"){
                html += put_attribute(langs.get_term('txt_message'),opened_event.sms_name);
                html += put_attribute(langs.get_term('txt_message'),opened_event.email_name);
                html += put_attribute(langs.get_term('txt_information_incorrect_operating_pa'),opened_event["information_incorrect_operating_pa"]);
                html += put_attribute(langs.get_term('txt_information_about_aircraft'),opened_event["information_about_aircraft"]);
                html += put_attribute(langs.get_term('txt_state_of_sdtu'),opened_event["state_of_sdtu_fk_pr"]);
                html += put_attribute(langs.get_term('txt_battery_info'),opened_event["battery_info"]);
                html += put_attribute(langs.get_term('txt_state_own_needs'),opened_event["state_own_needs"]);
                html += put_attribute(langs.get_term('txt_characteristics_disconnected_consumers'),opened_event["characteristics_disconnected_consumers"]);
                html += put_attribute(langs.get_term('txt_cause_of_situation'),opened_event["cause_of_situation"]);
                html += put_attribute(langs.get_term('txt_cutoff_power_mvt'),opened_event["cutoff_power_mvt"]);
                html += put_attribute(langs.get_term('txt_wind'),opened_event.wind);
                html += put_attribute(langs.get_term('txt_action_crew'),opened_event["information_crew_name"]);
                html += put_attribute(langs.get_term('txt_fk_precipitation'),opened_event["precipitations_name"]);
                html += put_attribute(langs.get_term('txt_temperature'),opened_event["temperature"]);
                html += put_attribute(langs.get_term('txt_forecast_recovery_consumers'),opened_event["forecast_recovery_consumers"]);
                html += put_attribute(langs.get_term('txt_fias_unpowered_count'),opened_event["fias_unpowered_count"]);
                //html += put_attribute(langs.get_term('txt_appearence_time'),moment(CFUtil.(opened_event["appearence_time"])).format("DD-MM-YYYY HH:mm:ss"));
                html += put_attribute(langs.get_term('txt_appearence_time'),moment(opened_event["appearence_time"]).format("DD-MM-YYYY HH:mm:ss"));
                html += put_attribute(langs.get_term('txt_time_loss_consumers'),opened_event["time_loss_consumers"]);
                html += put_attribute(langs.get_term('txt_numeric_feed_consumers'),opened_event["numeric_feed_consumers"]);
                html += put_attribute(langs.get_term('txt_number_of_de_energized_consumers'),opened_event["number_of_de_energized_consumers"]);
                html += put_attribute(langs.get_term('txt_number_of_remaining_de_energized_consumers'),opened_event["number_of_remaining_de_energized_consumers"]);
                html += put_attribute(langs.get_term('txt_ropiz'),CF_Events_info.radec_list[opened_event["ropiz"]]);
                html += put_attribute(langs.get_term('ttl_organizational_structure'),opened_event["org_struct_name"]);
               // html += put_attribute(langs.get_term('txt_datetime_create'),moment(CFUtil.get_local_datetime(opened_event["datetime_create"])).format("DD-MM-YYYY HH:mm:ss"));
                html += put_attribute(langs.get_term('txt_datetime_create'),moment(opened_event["datetime_create"]).format("DD-MM-YYYY HH:mm:ss"));
                html += put_attribute(langs.get_term('txt_info_emergency_operations_disconnect'),opened_event["info_emergency_operations_disconnect"]);
                html += put_attribute(langs.get_term('txt_fusion_of_ice'),opened_event["fusion_of_ice"]);
                html += put_array_of_attributes(langs.get_term('txt_action_n_equipment'),opened_event["action_n_equipment"]);
                html += put_array_of_attributes(langs.get_term('txt_action_n_feeder'),opened_event["action_n_feeder"]);
                html += put_array_of_attributes(langs.get_term('txt_action_n_vl'),opened_event["action_n_vl"]);
                html += put_array_of_attributes(langs.get_term('txt_changing_modes'),opened_event["changing_modes"]);
                html += put_array_of_attributes_with_type('count_of_de_energized_facilities',opened_event["count_of_de_energized_facilities"]);
                html += put_array_of_attributes_with_type('count_ps_rp_tp',opened_event["count_ps_rp_tp"]);
                html += put_array_of_attributes_with_type('equipment_people_teams',opened_event["equipment_people_teams"]);
                html += put_array_of_attributes(langs.get_term('txt_fias'),opened_event["fias"]);
                html += put_array_of_attributes(langs.get_term('txt_level_rza'),opened_event["level_rza"]);
                html += put_array_of_attributes(langs.get_term('txt_object_ps'),opened_event["object_ps"]);
                html += put_array_of_attributes(langs.get_term('txt_object_vl'),opened_event["object_vl"]);
                html += put_array_of_attributes(langs.get_term('txt_orgstruct'),opened_event["orgstruct"]);
                html += put_array_of_attributes(langs.get_term('txt_result_apv'),opened_event["result_apv"]);
                html += put_array_of_attributes(langs.get_term('txt_result_rpv'),opened_event["result_rpv"]);
            }
                    
          /*********comment code***************/
        html += '</div>';
     	//if (!CFbi.message_info) return;
       // $('#info').append(html);
        if (!append_html){
       		$('#'+id_inf).append(html);
        }else{
        	$('#'+id_inf).html(html);
        } 

    })
}
   
function put_attribute(name,value){
    var html = '';
    if (value != null && value != 'Invalid date'){
        html += '<div class="row info-row">';
            html += '<div class="col-xs-6"><b>'+name+'</b></div>';
            html += '<div class="col-xs-6">'+value+'</div>';
        html += '</div>';
    }
    return html;
}

function put_array_of_attributes(name,array){
   // if (!array) return;
    var html = '';
    if (array && array.length != 0){
        html += '<div class="row info-row">';
        html += '<div class="col-xs-6"><b>'+name+'</b></div>';
         //   html += '<ul>';
        html += '<div class="col-xs-6"><ul>';
            for (var i=0; i<array.length; i++){
                html += '<li>'+array[i].value+'</li>';
            }
        html += '</ul></div></div>';
    }
    return html;
}
function put_array_of_attributes_with_type(name,array){
    var html = '';
    //if (!array) return;
    if (array && array.length != 0){
    
        html += '<div class="row info-row">';
        html += '<div class="col-xs-6"><b>'+langs.get_term('txt_'+name+'')+'</b></div>';
        
        html += '<div class="col-xs-6"><ul>';
            for (var i=0; i<array.length; i++){
                html += '<li>'+CF_Events_info[name][array[i].type]+array[i].value+'</li>';
            }
        html += '</ul></div></div>';

    }
    return html;
}

CF_Events_info.run = function(attr){
	if (typeof(attr) != "object") return;
    for (var i in attr){
        CF_Events_info[i] = attr[i];
    }
}
