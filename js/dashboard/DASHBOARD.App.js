

var DASHBOARD = {
	base_url: null, //переменная для хранения адреса сайта
};

/*
 * функция инициализации данных
 * Vadim GRITSENKO
 * 20150203
 */
DASHBOARD.init = function (){
	
	setInterval(update_data, 10000);
	//window.addEventListener( 'resize', on_window_resize, false );
	
}
//конец функции

/*
 * функция создания диалогового окна
 * Vadim GRITSENKO
 * 20150203
 */
function open_list(row, column){

	query = $.ajax ({
		//url: DASHBOARD.base_url+'/index.php/dashboard/get_data_list/',
		url: DASHBOARD.base_url+'/index.php/dashboard/ajax_build_table/',
		type:'POST',
		data: {
				'row': row,
				'column': column,
			}
	});
	query.done(function (response, textStatus, jqXHRб){
		content = (response);
		//content = get_content_list(result);
		
		$('#div_content').html('<div>'+content+'</div>');

		/*
		var default_parameters_dialog = {
				title: 'Листинг данных', 
				autoOpen: false,
				height: "auto",
				position: "left top",
				width: "1000",
				maxHeight: "500",
				modal: false
			};	
	
		create_dialog(default_parameters_dialog ,content, 'dialog_detal_data');
		*/
	});
}
//конец функции

/*
 * функция создания диалогового окна
 * Vadim GRITSENKO
 * 20150203
 */
function create_dialog(parameters,content,id){
	var dialog = CFUtil.dialog.create(id,parameters);
	if ( dialog ){
		$(dialog).html(content);
	}
}
// конец функции

/*
 * функция формирования содержания листинга 
 * Vadim GRITSENKO
 * 20150203
 */
function get_content_list(array_list){
	if (array_list.length>0){
		html_text = '<table width=100% class="table table-condensed table-hover table-bordered">';
		html_text += '<thead><tr>';
		array_keys = Object.keys( array_list[0] );
		for ( i=0; i<array_keys.length; i++){
			html_text += '<td>'+array_keys[i]+'</td>';
		}
		html_text += '</tr></thead>';
		html_text += '<tbody>';
		for ( i=0; i<array_list.length; i++){
			html_text += '<tr>';
			for (var key in array_list[i]){
				html_text += '<td>'+array_list[i][key]+'</td>';
			}
			html_text += '</tr>';
		}
		html_text += '</tbody>';	
		html_text += '</table>';
		return html_text;
	}
	else return'Нет данных';
}
// конец функции

/*
 * функция формирования содержания листинга 
 * Vadim GRITSENKO
 * 20150203
 */
function update_data(){
	query = $.ajax ({
		url: DASHBOARD.base_url+'/index.php/dashboard/update_data/',
		type:'POST',
	});
	query.done(function (response, textStatus, jqXHRб){
		result = JSON.parse(response);
		//console.log(result);
		for (key in result){
			if ($('#'+key).html() != result[key]) {
//				$('#'+key).fadeOut(1000).html(result[key]).fadeIn(1000);
				$('#'+key).toggle( "highlight" ).html(result[key]).toggle( "highlight" );
			}
		}
	});
}
// конец функции


/*
 * TSRuban
 */
DASHBOARD.window_sms = function(sit_id){
    var dialog = CFUtil.dialog.create("save_window",
    {
		//title: langs.get_term('txt_close_situation'), 
        title: langs.get_term('txt_sms_message'), // переделать langs
        autoOpen: false,
        height: "auto",
        width: (400 <  $(window).width() ? 400 : $(window).width()),
        modal: true,
        resizable:false
    });
    if (dialog){
        html = $.ajax({     
            url: DASHBOARD.base_url+"index.php/qcore/ajax/edit_form/dashboard/sms_data/"+sit_id+"?CONTINUE=close",
            type: "POST"         
        }).done(function (response, textStatus, jqXHRб){
            $(dialog).html(response);
        });
    }
};

/*
 * TSRuban
 */
DASHBOARD.window_email = function(sit_id){
    var dialog = CFUtil.dialog.create("save_window",
    {
		//title: langs.get_term('txt_close_situation'), 
        title: langs.get_term('txt_mail'), // переделать langs
        autoOpen: false,
        height: "auto",
        width: (400 <  $(window).width() ? 400 : $(window).width()),
        modal: true,
        resizable:false
    });
    if (dialog){
        html = $.ajax({     
            url: DASHBOARD.base_url+"index.php/qcore/ajax/edit_form/dashboard/emails_data/"+sit_id+"?CONTINUE=close",
            type: "POST"         
        }).done(function (response, textStatus, jqXHRб){
            $(dialog).html(response);
        });
    }
};

/*
 * TSRuban
 */
DASHBOARD.window_event = function(event_id){
    var dialog = CFUtil.dialog.create("save_window",
    {
        title: langs.get_term('txt_event'), // переделать langs
        autoOpen: false,
        height: "auto",
        width: (600 <  $(window).width() ? 600 : $(window).width()),
        modal: true,
        resizable:false
    });
    if (dialog){
        html = $.ajax({     
            url: DASHBOARD.base_url+"index.php/conframe_bi/get_event_info/"+event_id,
            type: "POST"
        }).done(function (response, textStatus, jqXHRб){
			data = JSON.parse(response);
			opened_event = data[0];
			console.log(data);
                        var html = '<table class="table table-condensed table-hover" style="font-size:12px;margin-bottom:0px;">';
                        html += '<tbody>';
                        html += put_attribute(langs.get_term('txt_semantic_id'),opened_event.text);
                        html += put_attribute(langs.get_term('txt_event_type'),opened_event.event_type);
                        html += '<tr>';
                            html += '<td width="50%"><b>'+langs.get_term('txt_situation')+'</b></td>';
                            html += '<td>';
                                if (opened_event.situation_name != null && opened_event.situation_name != ''){
                                    html += opened_event.situation_name+' <span  ></span>';
                                    // class="glyphicon glyphicon-search" style="cursor:pointer" onclick="search_situation(\''+opened_event.situation_name+'\');" title="'+langs.get_term('txt_show_situation')+'"
                                }
                                else if (opened_event.situation_semantic_id != null){
                                    html += opened_event.situation_semantic_id+' <span ></span>';
                                }
                                else {
                                    html += ' - ';
                                }
                            html += '</td>';
                        html += '</tr>';
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
                        html += put_attribute(langs.get_term('txt_appearence_time'),moment(CFUtil.get_local_datetime(opened_event["appearence_time"])).format("DD-MM-YYYY HH:mm:ss"));
                        html += put_attribute(langs.get_term('txt_time_loss_consumers'),opened_event["time_loss_consumers"]);
                        html += put_attribute(langs.get_term('txt_numeric_feed_consumers'),opened_event["numeric_feed_consumers"]);
                        html += put_attribute(langs.get_term('txt_number_of_de_energized_consumers'),opened_event["number_of_de_energized_consumers"]);
                        html += put_attribute(langs.get_term('txt_number_of_remaining_de_energized_consumers'),opened_event["number_of_remaining_de_energized_consumers"]);
                        html += put_attribute(langs.get_term('txt_ropiz'),opened_event["ropiz_name"]);
                        html += put_attribute(langs.get_term('ttl_organizational_structure'),opened_event["org_struct_name"]);
                        if (opened_event["datetime_create"]){
                           html += put_attribute(langs.get_term('txt_datetime_create'),moment(CFUtil.get_local_datetime(opened_event["datetime_create"])));
                        }
                        html += put_attribute(langs.get_term('txt_info_emergency_operations_disconnect'),opened_event["info_emergency_operations_disconnect"]);
                    html += '</tbody>';
                html += '</table>';
	
            $(dialog).html(html);
        });
    }
};
function put_attribute(name,value){
    var html = '';
    if (value != null && value != 'Invalid'){
        html += '<tr>';
            html += '<td width="50%"><b>'+name+'</b></td>';
            html += '<td>'+value+'</td>';
        html += '</tr>';
    }
    return html;
}
