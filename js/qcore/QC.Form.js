
//  ------------------------------------------------------------------------ //
//                         ConFrame-Electric CTM V3                          //
//                      Copyright (c) 2011-2014 DunRose                      //
//                         <http://www.dunrose.ru/>                          //
//  ------------------------------------------------------------------------ //
//  Author: Mr. Thurairajasingam Senthilruban   TSRuban[AT]dunrose.ru        //
//  Programmer: Mr. Gritsenko Vadim Victorovich VGritsenko[AT]dunrose.ru     //
//  URL: http://www.dunrose.ru						     					 //
// ------------------------------------------------------------------------- //

var QC = {
	items: null,
	default_parameters_dialog: {
			title: "txt_panel_settings",
			autoOpen: false,
			height: 'auto',
			width: 'auto',
			position: 'top',
		},
	button: {
			name: 'btn_cancel',
			onclick: '$(\'#\').dialog(\'close\')',
			style: 'btn btn-default',
			id: 'btn_cancel',
		}
};

QC.open_dialog = function(json_data){
	data_dialog = JSON.parse(json_data)
	$("#save_window").remove();
	var dialog = CFUtil.dialog.create(data_dialog.id_window, QC.get_parameters(data_dialog.parameters));
	if ( dialog ){

		var html_content = '<div id="save_window" class="ui-dialog-content ui-widget-content" style="width: auto; min-height: 105px; height: auto;" scrolltop="0" scrollleft="0"></div>';
		$(dialog).html(html_content)
		
		var compiled = _.template(QCTemplate[data_dialog.view_templ]);
		var result = compiled({items:data_dialog.fields_main_content});
		$("#save_window").html(result)
	
		var compiled = _.template(QCTemplate.tmpl_down_panel_buttons);
		var result = compiled({items:QC.get_content_footer(data_dialog.down_panel_buttons)});
		$("#save_window").append(result)
		if (data_dialog.focus_selector) {$(data_dialog.focus_selector).focus()}
		
	}
}
//конец функции

QC.validation_form = function (){
	text = "";
	var j = 0;
	$('#save_window form input').each(function (){

		if ($(this).val() == ""){
			text +=j+" - "+ $('#for_'+$(this).attr('id')).text();
			$('#for_'+$(this).attr('id')).addClass("has-error");
			j++
		}

	})
	if (text!=""){
		$("#error_div").addClass("alert-danger").html(text);
	}
}

//функция получения содержимого основной части окна 
QC.get_main_content = function (data_dialog){

	var compiled = _.template(QCTemplate[data_dialog.view_templ]);
	var result = compiled({items:data_dialog.fields_main_content});
	return result;

}

//функция получения параметров окна 
QC.get_parameters = function (parameters){
	
	result = JSON.parse(JSON.stringify(QC.default_parameters_dialog));
	for (var i in parameters) {result[i] = parameters[i]}
	return result;

}

//функция получения параметров окна 
QC.get_content_footer = function (array_elements){
	
	result = new Array();
	for (var i in array_elements) {
		result[i] = JSON.parse(JSON.stringify(QC.button));
		for (var j in array_elements[i]) {
			result[i][j] = array_elements[i][j];
		}
	}
	return result;

}