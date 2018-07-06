/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Export= {
    "base_url" : '',
    "template_id" : '',
    "type" : '',
    "user_template_id" : null,
    "name_user_template" : '',
    "desc_user_template" : '',
    "type_user_template" : '',
    "wizzards_data" : [
        {
            "title":"ШАГ 1 : Выберите отчет/шаблон или создать новую.", //0
            "body":"export/data_user_template",
            "foot":[null,"Export.load_template_data(1)"]
        }, 
		{
			"title":"ШАГ 2 : Фильтрации и Просмотр данных ", //load_template_data(1)
			"attribute":"set_param",
			"foot":["Export.load_step_data(0)","Export.download_table_data(2)"]
		},
        {
            "title":"Загрузки данных. ", //2
            "foot":["Export.load_template_data(1)"/*"Export.load_template_data(3)"*/,null]
        },
        {
            "title":"ШАГ 2 :  Введите наименование нового отчета", //3
            "body":"export/data_step1",
            "foot":["Export.load_step_data(0)"/*"Export.create_new()"*/,"Export.load_table_data(2)"]
        },
        {
            "title":"ШАГ 2 : Создать новый шаблон", //4
            "body":"export/data_new_template",
            "foot":["Export.create_new_data()","Export.save_template_data(6)"]
        },
        {
            "title":"ШАГ 3 :  Выберите репозитории", //5
            "body":"export/data_step2",
            "foot":["Export.load_step_data(0)","Export.load_step_data(4)"]
        },
        {
            "title":"ШАГ 4 : Фильтрации и Просмотр данных ", //6
            "foot":["Export.load_step_data(4)","Export.preview(2)"]
        },		
    ],
    "wizzards_report" : [
        {
            "title":"ШАГ 1 : Выберите отчет/шаблон или создать новую.", //0
            "body":"export/data_user_template",
            "foot":[null,"Export.load_template_report(1)"]
        }, 
        {
            "title":" ШАГ 2 : Фильтрации и Просмотр данных ", //1
            "foot":["Export.load_step_report(0)","Export.preview(4)"/*"Export.download_table(4)"*/]
        },
        {
            "title":"Загрузки данных. ", //2
            "foot":["Export.load_template_report(6)"/*"Export.load_template_data(3)"*/,null]
        },
        {
            "title":"ШАГ 2 : Создать новый шаблон", //3
            "body":"export/data_new_template",
            "foot":["Export.create_new_report()","Export.save_template_report(7)"]
			//"foot":["Export.load_step_report(0)","Export.save_template_report(6)"]
        },
        {
			"title":"ШАГ 3 : Задание параметров ", //load_template_data(4)
			"attribute":"set_param",
			"foot":["Export.load_template_report(1)","Export.save_params()"/*"Export.download_table_report(5)"*/]
        },
        {
            "title":"Загрузки данных. ", //5
            "foot":["Export.load_user_param(4)"/*"Export.load_template_data(3)"*/,null]
        },
        {
            "title":"ШАГ 3 :  Выберите репозитории", //6
            "body":"export/data_step2",
            "foot":["Export.load_step_report(0)","Export.load_step_report(3)"]
			//"foot":["Export.create_new_report()","Export.load_table_report(7)"]
        },
        {
            "title":"ШАГ 4 : Фильтрации и Просмотр данных ", //7
            "foot":["Export.load_step_report(3)","Export.preview(8)"]
        },
        {
			"title":"ШАГ 5 : Задание параметров ", //load_template_data(8)
			"attribute":"set_param",
			"foot":["Export.load_template_report(1)","Export.save_params()"/*"Export.download_table_report(5)"*/]
        },		
    ]	
};

Export.init = function(){
    
};

Export.run = function(){
    if (Export.type == 'REPORT') {Export.load_step_report(0);}
    else {Export.load_step_data(0);}
};

Export.save_template_data = function(step){
	if ($('#name_user_template').val()){
		Export.name_user_template = $('#name_user_template').val()
		Export.desc_user_template = $('#desc_user_template').val()
		Export.type_user_template = ($('#type_user_template').val() == 'Отчет'?'report':'export')
		Export.load_table_data(step);
	}
	else {
		alert('Наименование неопределено')
	}
}

Export.save_template_report = function(step){

	if ($('#name_user_template').val()){
		Export.name_user_template = $('#name_user_template').val()
		Export.desc_user_template = $('#desc_user_template').val()
		//Export.type_user_template = $('#type_user_template').val()
		Export.type_user_template = ($('#type_user_template').val() == 'Отчет'?'report':'export')
		Export.load_table_report(step);
	}
	else {
		alert('Наименование неопределено')
	}
}

Export.load_step_data = function(step,call_back){
	if ($('#template_id').val()){
		Export.template_id = $('#template_id').val();
	}

    if (Export.wizzards_data[step]){
        var wiz = Export.wizzards_data[step];
        $("#wiz_head").html(wiz.title);
        Export.load_body(wiz.body,call_back);
        
        $("#wiz_foot").html(Export.load_foot_data(step));
    }else{
        Export.load_step_data(step+1);
    }
	
};

Export.load_step_report = function(step,call_back){
	if ($('#template_id').val()){
		Export.template_id = $('#template_id').val();
	}

    if (Export.wizzards_report[step]){
        var wiz = Export.wizzards_report[step];
        $("#wiz_head").html(wiz.title);
        Export.load_body(wiz.body,call_back);
        
        $("#wiz_foot").html(Export.load_foot_report(step));
    }else{
        Export.load_step_report(step+1);
    }
	
};

Export.create_new_report = function (){
    $("#user_template_id").val("");
    Export.load_step_report(6,function (){
		if (Export.name_user_template != '') $('#name_user_template').val(Export.name_user_template);
		if (Export.desc_user_template != '') $('#desc_user_template').val(Export.desc_user_template);
		if (Export.type_user_template != '') $('#type_user_template').val((Export.type_user_template == 'report'?'Отчет':'Выгрузка'));
	});
}


Export.create_new_data = function (){
    $("#user_template_id").val("");
    Export.load_step_data(5,function (){
		if (Export.name_user_template != '') $('#name_user_template').val(Export.name_user_template);
		if (Export.desc_user_template != '') $('#desc_user_template').val(Export.desc_user_template);
		//if (Export.type_user_template != '') $('#type_user_template').val(Export.type_user_template);
		if (Export.type_user_template != '') $('#type_user_template').val((Export.type_user_template == 'report'?'Отчет':'Выгрузка'));
	});
}


Export.download_table_report = function(step){
    if ($("#template_id").val() != undefined){
       Export.template_id =  $("#template_id").val();
    }
    if ($("#user_template_id").val() != undefined){
       Export.user_template_id =  $("#user_template_id").val();
    }
    if (!Export.template_id && !Export.user_template_id ){
        alert('Выберите таблицу!');
        return;
    }
    if (Export.wizzards_report[step]){
        var wiz = Export.wizzards_report[step];
        $("#wiz_head").html(wiz.title);
        
        $.ajax({
			url: Export.base_url+'index.php/export/download_report/'+Export.user_template_id,
			beforeSend: function(xhr){
				$("#wiz_body").html(Export.get_loader()); 
			},
			success: function(data){
				$("#wiz_body").html(data);    
			}
		});
        
        $("#wiz_foot").html(Export.load_foot_report(step));
    }
}

Export.download_table_data = function(step){
    if ($("#template_id").val() != undefined){
       Export.template_id =  $("#template_id").val();
    }
    if ($("#user_template_id").val() != undefined){
       Export.user_template_id =  $("#user_template_id").val();
    }
    if (!Export.template_id && !Export.user_template_id ){
        alert('Выберите таблицу!');
        return;
    }
    if (Export.wizzards_data[step]){
        var wiz = Export.wizzards_data[step];
        $("#wiz_head").html(wiz.title);
        
        $.ajax({
        url: Export.base_url+'index.php/export/download_table/'+Export.user_template_id,
        beforeSend: function(xhr){
            $("#wiz_body").html(Export.get_loader()); 
        },
        success: function(data){
            $("#wiz_body").html(data);    
        }
    });
        
        $("#wiz_foot").html(Export.load_foot_data(step));
    }
}

Export.load_template_data = function (step){
	if ($("#user_template_id").val() != undefined){
       Export.user_template_id =  $("#user_template_id").val();
    }
	
	if (!Export.user_template_id){
        alert('Выберите таблицу!');
        return;
    }
    if (Export.wizzards_data[step]){
        var wiz = Export.wizzards_data[step];
        $("#wiz_head").html(wiz.title);
        
        $.ajax({
			url: Export.base_url+'index.php/export/user_data_view/'+Export.user_template_id,
			beforeSend: function(xhr){
				$("#wiz_body").html(Export.get_loader()); 
			},
			success: function(data){
				$("#wiz_body").html(data);    
			}
		});
        
        $("#wiz_foot").html(Export.load_foot_data(step));
    }
}

Export.load_template_report = function (step){
	if ($("#user_template_id").val() != undefined){
       Export.user_template_id =  $("#user_template_id").val();
    }
	
	if (!Export.user_template_id){
        alert('Выберите таблицу!');
        return;
    }
    if (Export.wizzards_report[step]){
        var wiz = Export.wizzards_report[step];
        $("#wiz_head").html(wiz.title);
        
        $.ajax({
			url: Export.base_url+'index.php/export/user_data_view/'+Export.user_template_id + ( wiz.attribute ? '/set_param': '' ),
			beforeSend: function(xhr){
				$("#wiz_body").html(Export.get_loader()); 
			},
			success: function(data){
				$("#wiz_body").html(data);    
			}
		});
        
        $("#wiz_foot").html(Export.load_foot_report(step));
    }
}


Export.load_user_param = function (step){
	if ($("#user_template_id").val() != undefined){
       Export.user_template_id =  $("#user_template_id").val();
    }
	if ($("#template_id").val() != undefined){
       Export.template_id =  $("#template_id").val();
    }	
	if (!Export.user_template_id && !Export.template_id){
        alert('Выберите таблицу!');
        return;
    }
    if (Export.wizzards_report[step]){
        var wiz = Export.wizzards_report[step];
        $("#wiz_head").html(wiz.title);
        
        $.ajax({
			url: Export.base_url+'index.php/export/load_user_param/'+Export.user_template_id,
			beforeSend: function(xhr){
				$("#wiz_body").html(Export.get_loader()); 
			},
			success: function(data){
				$("#wiz_body").html(data);    
			}
		});
        
        $("#wiz_foot").html(Export.load_foot_report(step));
    }
}

Export.load_table_data = function(step){

    if ($("#template_id").val() != undefined){
       Export.template_id =  $("#template_id").val();	
    }
    
    if (!Export.template_id){
        alert('Выберите таблицу!');
        return;
    }
    if (Export.wizzards_data[step]){
        var wiz = Export.wizzards_data[step];
        $("#wiz_head").html(wiz.title);
        
        $.ajax({
        url: Export.base_url+'index.php/export/data_view/'+Export.template_id,
        beforeSend: function(xhr){
            $("#wiz_body").html(Export.get_loader()); 
        },
        success: function(data){
            $("#wiz_body").html(data);    
        }
    });
        
        $("#wiz_foot").html(Export.load_foot_data(step));
    }
}


Export.load_table_report = function(step){

    if ($("#template_id").val() != undefined){
       Export.template_id =  $("#template_id").val();	
    }
    
    if (!Export.template_id){
        alert('Выберите таблицу!');
        return;
    }
    if (Export.wizzards_report[step]){
        var wiz = Export.wizzards_report[step];
        $("#wiz_head").html(wiz.title);
        
        $.ajax({
        url: Export.base_url+'index.php/export/data_view/'+Export.template_id,
        beforeSend: function(xhr){
            $("#wiz_body").html(Export.get_loader()); 
        },
        success: function(data){
            $("#wiz_body").html(data);    
        }
    });
        
        $("#wiz_foot").html(Export.load_foot_report(step));
    }
}

Export.get_loader = function(){
    return '<img src="'+Export.base_url+'/img/ajax-loader.gif"></img>';
}

Export.load_body = function(url,call_back){
    $.ajax({
        url: Export.base_url+'index.php/'+url,
        beforeSend: function(xhr){
            $("#wiz_body").html(Export.get_loader()); 
        },
        success: function(data){
            $("#wiz_body").html(data);   
            if (call_back){
                call_back.call();
            }

			if (Export.name_user_template != '') $('#name_user_template').val(Export.name_user_template);
			if (Export.desc_user_template != '') $('#desc_user_template').val(Export.desc_user_template);
			if (Export.type_user_template != '') $('#type_user_template').val((Export.type_user_template == 'report'?'Отчет':'Выгрузка'));	
			
        }
    });
    
};

Export.load_foot_data = function(step){
    if (Export.wizzards_data[step]){
    var wiz = Export.wizzards_data[step];
        if (wiz.foot){
            var foot_btn = '';
            for (var i in wiz.foot){
                if (i==0){
                    foot_btn += '&nbsp;<button class="btn btn-primary" ';
                    if (!wiz.foot[i]){
                        foot_btn += ' disabled '
                    }
                    foot_btn += ' onclick='+wiz.foot[i]+'><span class="glyphicon glyphicon-arrow-left"></span>&nbsp;Назад</button>';
                }
                if (i==1){
                    foot_btn += '&nbsp;<button class="btn btn-primary" ';
                    if (!wiz.foot[i]){
                        foot_btn += ' disabled '
                    }
                    foot_btn += 'onclick='+wiz.foot[i]+'>Далее&nbsp;<span class="glyphicon glyphicon-arrow-right"></span></button>';
                }
            }
            return foot_btn;
        }
    }
    return '';
}

Export.load_foot_report = function(step){
    if (Export.wizzards_report[step]){
    var wiz = Export.wizzards_report[step];
        if (wiz.foot){
            var foot_btn = '';
            for (var i in wiz.foot){
                if (i==0){
                    foot_btn += '&nbsp;<button class="btn btn-primary" ';
                    if (!wiz.foot[i]){
                        foot_btn += ' disabled '
                    }
                    foot_btn += ' onclick='+wiz.foot[i]+'><span class="glyphicon glyphicon-arrow-left"></span>&nbsp;Назад</button>';
                }
                if (i==1){
                    foot_btn += '&nbsp;<button class="btn btn-primary" ';
                    if (!wiz.foot[i]){
                        foot_btn += ' disabled '
                    }
                    foot_btn += 'onclick='+wiz.foot[i]+'>Далее&nbsp;<span class="glyphicon glyphicon-arrow-right"></span></button>';
                }
            }
            return foot_btn;
        }
    }
    return '';
}

	Export.edit_columns = function (){
		var dialog = CFUtil.dialog.create("save_window",
		{
			title: 'Редактирование колонок',
			autoOpen: false,
			height: "auto",
			width: "400px",
			modal: true
		});
		if ( dialog ){
			//user_columns = Object.keys( user_columns ).length == 0? fields: user_columns;//fields

			html_list = '<table>';
			html_list += '<tr>';

			html_list += '<td style="width:30%; height: 100%">';
			html_list += '<div class="list-group">';

			html_list += '<label>'+'Исходные колонки'+'</label>';
			html_list += '<select multiple="multiple" id="list_table_column" style="width:100%; height: 100%" size="10">';
			for (current in fields){
				html_list += '<option ondblclick="add_columns()" value="'+current+'">' + fields[current].display_text + '</option>';
			}
			html_list += '</select>';

			html_list += '</div>';
			html_list += '</td>';
			
			html_list += '<td style="width:10%">';
			html_list += '<button type="button" onclick="add_columns()"><span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span></button><br>';
			html_list += '<button type="button" onclick="remove_columns()"><span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span></button><br>';
			html_list += '</td>';
			
			
			html_list += '<td style="width:30%">';
			html_list += '<div class="list-group">';
			
			html_list += '<label>'+'Выбранные колонки'+'</label>';
			html_list += '<select multiple="multiple" id="list_edit_column" style="width:100%; height: 100%" size="10">';
			html_list += '</select>';
			
			html_list += '</div>';
			html_list += '</td>';
	
			html_list += '<td style="width:10%">';
			html_list += '<button type="button" onclick="move_up_column()"><span class="glyphicon glyphicon-arrow-up" aria-hidden="true"></span></button><br>';
			html_list += '<button type="button" onclick="move_down_column()"><span class="glyphicon glyphicon-arrow-down" aria-hidden="true"></span></button><br>';
			html_list += '</td>';
			
			html_list += '</tr>';
			html_list += '</table>';

			html_list += '<p><button onclick="Export.save_columns()">'+'Сохранить редактирование колонок'+'</button></p>';
			
			$(dialog).html(html_list);
			load_db_columns()
		}
	}
	
	load_db_columns = function(){
		html_list = ''
		for (current in user_columns){
			$('#list_table_column').children('[value="'+user_columns[current].name+'"]').remove();
			html_list += '<option ondblclick="remove_columns()" value="'+user_columns[current].name+'">' + user_columns[current].display_text + '</option>';
		}
		$('#list_edit_column').html(html_list);
	}

	add_columns = function (){
		$('#list_table_column').children('option:selected').each(function (){
			$('#list_edit_column').append('<option ondblclick="remove_columns()" value="'+$(this).val()+'">'+$(this).html()+'</option>');
			$(this).remove();
		})
	}
	
	remove_columns = function (){
		$('#list_edit_column').children('option:selected').each(function (){
			$('#list_table_column').append('<option ondblclick="add_columns()" value="'+$(this).val()+'">'+$(this).html()+'</option>');
			$(this).remove();
		})
	}
		
	move_up_column = function (){
		$('#list_edit_column').children('option:selected').each(function (){

			iIndex = $(this).index();
			var oListbox = document.getElementById("list_edit_column");
			if (iIndex>0){
				var oListbox = document.getElementById("list_edit_column");
				var oOption = oListbox.options[iIndex];
				var oPrevOption = oListbox.options[iIndex-1];
				oListbox.insertBefore(oOption, oPrevOption);
			}
		})
	}
	
	move_down_column = function (){
		$('#list_edit_column').children('option:selected').reverseEach(function (){
			iIndex = $(this).index();
			var oListbox = document.getElementById("list_edit_column");
			if (iIndex < oListbox.options.length - 1){
				var oOption = oListbox.options[iIndex];
				var oNextOption = oListbox.options[iIndex+1];
				oListbox.insertBefore(oNextOption, oOption);
			}
		})
	}
	
	//функция перебора дочрених элементов в обратном порядке
	jQuery.fn.reverseEach = (function () {
		var list = jQuery([1]);
		return function (c) {
			var el, i=this.length;
			try {
				while (i-->0 && (el=list[0]=this[i]) && c.call(list,i,el)!==false);
			}
			catch(e) {
				delete list[0];
				throw e;
			}
			delete list[0];
			return this;
		};
	}());
	
	get_columns = function (){
		array_columns = []
		$('#list_edit_column').children('option').each(function (){
			array_columns [$(this).index()] = {};
			array_columns [$(this).index()]['name'] = $(this).val();
			array_columns [$(this).index()]['display_text'] = $(this).html();
		})
		return (array_columns);
	}
	
	Export.save_columns = function (){
		html = $.ajax({
			url: Export.base_url+"index.php/export/save_columns/",
			type: "POST",
			data: {
					'id' : (Export.user_template_id),
					'columns' : JSON.stringify(get_columns()),
				}
		}).done(function (response, textStatus, jqXHRб){
			Export.user_template_id = JSON.parse(response);
			$('#save_window').dialog('close')
			if (Export.type == 'REPORT') Export.load_template_report(1);
			else Export.load_template_data(1);
		});	
	
	}
	
	
	Export.save_filter_to_next = function (step){
		if (step == 1) {
			if (Export.type == 'REPORT') Export.load_template_report(1);
			else Export.load_template_data(1);
		}
		else if (step == 2) Export.download_table_data(2);
		else if (step == 8) {
			if (Export.type == 'REPORT') Export.load_user_param(8);
			else Export.load_template_data(8);
		}
		else if (step == 4) Export.load_user_param(4);
	}
	

	Export.add_condition_btn = function (){
		$('#condition_body').append(condition);
		$('.span_filter .text_filter:last').append('<select class="view_link_condition"><option value="OR">'+link_condition['OR']+'</option><option value="AND">'+link_condition['AND']+'</option></select>');
		$('.span_filter:last').append('<span class="glyphicon glyphicon-remove" onclick="$(this).parent().remove()" style="color:red"></span>');
	}	
