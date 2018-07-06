
Raphael.fn.connection = function (obj1, obj2, line, bg) {
    if (obj1.line && obj1.from && obj1.to) {
        line = obj1;
        obj1 = line.from;
        obj2 = line.to;
    }
    var bb1 = obj1.getBBox(),
        bb2 = obj2.getBBox(),
        p = [{x: bb1.x + bb1.width / 2, y: bb1.y - 1},
        {x: bb1.x + bb1.width / 2, y: bb1.y + bb1.height + 1},
        {x: bb1.x - 1, y: bb1.y + bb1.height / 2},
        {x: bb1.x + bb1.width + 1, y: bb1.y + bb1.height / 2},
        {x: bb2.x + bb2.width / 2, y: bb2.y - 1},
        {x: bb2.x + bb2.width / 2, y: bb2.y + bb2.height + 1},
        {x: bb2.x - 1, y: bb2.y + bb2.height / 2},
        {x: bb2.x + bb2.width + 1, y: bb2.y + bb2.height / 2}],
        d = {}, dis = [];
    for (var i = 0; i < 4; i++) {
        for (var j = 4; j < 8; j++) {
            var dx = Math.abs(p[i].x - p[j].x),
                dy = Math.abs(p[i].y - p[j].y);
            if ((i == j - 4) || (((i != 3 && j != 6) || p[i].x < p[j].x) && ((i != 2 && j != 7) || p[i].x > p[j].x) && ((i != 0 && j != 5) || p[i].y > p[j].y) && ((i != 1 && j != 4) || p[i].y < p[j].y))) {
                dis.push(dx + dy);
                d[dis[dis.length - 1]] = [i, j];
            }
        }
    }
    if (dis.length == 0) {
        var res = [0, 4];
    } else {
        res = d[Math.min.apply(Math, dis)];
    }
    var x1 = p[res[0]].x,
        y1 = p[res[0]].y,
        x4 = p[res[1]].x,
        y4 = p[res[1]].y;
    dx = Math.max(Math.abs(x1 - x4) / 2, 10);
    dy = Math.max(Math.abs(y1 - y4) / 2, 10);
    var x2 = [x1, x1, x1 - dx, x1 + dx][res[0]].toFixed(3),
        y2 = [y1 - dy, y1 + dy, y1, y1][res[0]].toFixed(3),
        x3 = [0, 0, 0, 0, x4, x4, x4 - dx, x4 + dx][res[1]].toFixed(3),
        y3 = [0, 0, 0, 0, y1 + dy, y1 - dy, y4, y4][res[1]].toFixed(3);
    var path = ["M", x1.toFixed(3), y1.toFixed(3), "C", x2, y2, x3, y3, x4.toFixed(3), y4.toFixed(3)].join(",");
    if (line && line.line) {
        line.bg && line.bg.attr({path: path});
        line.line.attr({path: path});
    } else {
        var color = typeof line == "string" ? line : "#000";
        return {
            bg: bg && bg.split && this.path(path).attr({stroke: bg.split("|")[0], fill: "none", "stroke-width": bg.split("|")[1] || 3}),
            line: this.path(path).attr({stroke: color, fill: "none"}),
            from: obj1,
            to: obj2
        };
    }
};

var el, connections = [];
var cfevent = [];
/*
var cfevent =[
' [{"from":{"id":"945c8bc8aef10e324aeb612393ffa495","name":"79210000945"},"to":{"id":"ed4f24d76d82d9c738736dd40ebb35ae","name":"79037676735"},"start_time":"2015-02-02 04:53:50.872","id":15371,"message":"ОАО «Ленэнерго» Кингисеппские ЭС. Кингисеппский РЭС. В 07-33 на ПС 35кВ Усть-Луга отключился фидер 5-03 10кВ, обесточено 19ТП, 4НП, 1 водозабор,1насосная,332 человек. Направлена бригада ОВБ.","type_message":"СМС"},{"from":{"id":"945c8bc8aef10e324aeb612393ffa495","name":"79210000945"},"to":{"id":"ed4f24d76d82d9c738736dd40ebb35ae","name":"79037676735"},"start_time":"2015-02-02 12:18:46.121","id":15430,"message":"ОАО «Ленэнерго» Кингисеппские ЭС. Кингисеппский РЭС. В 15-02 на ПС 35кВ Усть-Луга включен фидер 5-03 10кВ, запитаны все погашенные потребители. Причина отключения – падение дерева в пролете опор 144-145.","type_message":"СМС"}]',
' [{"from":{"id":"945c8bc8aef10e324aeb612393ffa496","name":"79210000946"},"to":{"id":"ed4f24d76d82d9c738736dd40ebb35a6","name":"79037676736"},"start_time":"2015-02-02 15:53:50.872","id":15374,"message":"ОАО «Ленэнерго» Кингисеппские ЭС. Кингисеппский РЭС. В 07-33 на ПС 35кВ Усть-Луга отключился фидер 5-03 10кВ, обесточено 19ТП, 4НП, 1 водозабор,1насосная,332 человек. Направлена бригада ОВБ.","type_message":"СМС"},{"from":{"id":"945c8bc8aef10e324aeb612393ffa496","name":"79210000946"},"to":{"id":"ed4f24d76d82d9c738736dd40ebb35a6","name":"79037676736"},"start_time":"2015-02-02 19:18:46.121","id":15438,"message":"ОАО «Ленэнерго» Кингисеппские ЭС. Кингисеппский РЭС. В 15-02 на ПС 35кВ Усть-Луга включен фидер 5-03 10кВ, запитаны все погашенные потребители. Причина отключения – падение дерева в пролете опор 144-145.","type_message":"СМС"}]',
' [{"from":{"id":"945c8bc8aef10e324aeb612393ffa498","name":"79210000948"},"to":{"id":"ed4f24d76d82d9c738736dd40ebb35a8","name":"79037676738"},"start_time":"2015-01-19 08:14:09.528","id":14888,"message":"ОАО «Ленэнерго» Кабельная Сеть. Центральный РЭС. В 07-10 запитаны все погашенные потребители в Центральном р-не СПб. Причина отключения – повреждение КЛ-6 кВ 5023-5060.","type_message":"СМС"},{"from":{"id":"17ee3602c21d07e3f589b4a8f97590f8","name":"79202555558"},"to":{"id":"ed4f24d76d82d9c738736dd40ebb35a8","name":"79037676738"},"start_time":"2015-01-19 05:21:28.851","id":14888,"message":"МРСК ЦиП. Рязаньэнерго. ПрПМЭС. 19.01 в 07-25 на ПС 220/110/10 Сасово (ПрПМЭС) отключилась 1 сек.ш. 10 кВ из-за повреждения в яч. ф. 18 (ГТТЭЦ). В результате обесточены 3 фидера ПО Сасовские ЭС: 22 ТП, 10 нас. п., 1кот, 5 ВНС, 283 жителя. Отключенная нагрузка составила 0,467 МВт.","type_message":"СМС"},{"from":{"id":"945c8bc8aef10e324aeb612393ffa498","name":"79210000948"},"to":{"id":"ed4f24d76d82d9c738736dd40ebb35a8","name":"79037676738"},"start_time":"2015-01-26 06:40:28.487","id":14978,"message":"ОАО «Ленэнерго» Новоладожские ЭС. Лодейнопольский РЭС. В 10-10 отключился участок фидера-2 6кВ от ГЭС-9, обесточено 4ТП, 1НП, 101 человек. Направлена бригада ОВБ.","type_message":"СМС"}]'
] */
var old_time = null;

window.onload = function () {
   //delete ->is CFbi.load()
};
//attr x y


Raphael.st.draggable = function() {
  var me = this,
	lx = 0,
	ly = 0,
	ox = 0,
	oy = 0,
	moveFnc = function(dx, dy) {
		lx = dx + ox;
		ly = dy + oy;
		me.transform('t' + lx + ',' + ly);
	}, //if (connections) console.log(connections)
		/*if (connections){
            for (var i = connections.length; i--;) {
                CFbi.raphael.connection(connections[i]);
            }	  
		}*/
	startFnc = function() {},
	endFnc = function() {
		ox = lx;
		oy = ly;
	};
	this.drag(moveFnc, startFnc, endFnc);
};
/**************************************************/
/*
    Основной код CFbi
*/
/**************************************************/
CFbi = {
    event_etl:null,
    events:[],//тоже самое что и в ctm.cf.etl.js
    shapes: [],//всё
    raphael : null,//обьект рафаель с ним работаешь для манипуляции обьектов
    objects:[],//обьекты

    message_info:null,//диалоговое окно
    html_mes_info:[],

    base_url : null,
    panzoom:null,//zoomer
    image_subject:  ['img/conframe_bi/subject.png','img/conframe_bi/subject_group.png'],
    options:{
            width_level : 100,//расстояние между элементами по y []. ---- .[]
            height_level : 50,//расстояние между элементами по x . <>  .
            start_x:1,//построение первого элемента
            start_y:1,//построение первого элемента, сделать середину див через js
            elements:[],//не использовать , если где то есть - удалить заменить на cfbi.object
            count_hr:0,//сколько строк
        }
}
CFbi.load = function(){
     var width = $("#holder").css("width");
    var height = $("#holder").css("height");
    CFbi.width_panel = parseInt(width.substr(0,width.length-2));
    CFbi.height_panel = parseInt(height.substr(0,height.length-2));
    

    var dragger = function () {
        if (this.type == "text"){
            for (var i in CFbi.shapes){
                if (CFbi.shapes[i]){
                    if (CFbi.shapes[i].label_element){
                        if (CFbi.shapes[i].label_element.id == this.id && this != CFbi.shapes[i]) {
                            this.parent = CFbi.shapes[i];
                            break;
                        };
                    }
                }
            }
        }
        this.ox = this.type == "rect" ? this.attr("x") : this.attr("x");
        this.oy = this.type == "rect" ? this.attr("y") : this.attr("y");
        
        if (this.type != "text"){
            this.animate({"fill-opacity": 0.2}, 100);
        }else{
            this.parent.animate({"fill-opacity": 0.2}, 100);
        }
      
        this.ocx = this.attr("cx");
        this.ocy = this.attr("cy");
        if (this.type == "rect"){
            this.ocx = this.attr("x")+this.attr("width")/2;
            this.ocy = this.attr("y")+this.attr("height")/2
        }else if (this.type == "image"){
            this.ocx = this.attr("x")+this.attr("width")/2;
            this.ocy = this.attr("y")+this.attr("height");
        }else if (this.type =="text"){
            this.ox = this.attr("x");
            this.oy = this.attr("y");
        }
        
    },
    
        move = function (dx, dy) {
           // var att = this.type == "rect" ? {x: this.ox + dx, y: this.oy + dy} : {cx: this.ox + dx, cy: this.oy + dy};
            dx = CFbi.set_offset_x(dx);
            dy = CFbi.set_offset_y(dy);
            var att = {
                x: this.ox + dx, 
                y: this.oy + dy
            };

            this.attr(att);     
            if (this.label_element){
                this.label_element.attr({x: this.ocx + dx, y: this.ocy + dy});
            }else if (this.parent){
              
                this.attr({x:this.ox + dx, y :this.oy + dy})
                this.parent.attr({
                    x: this.attr("x")-this.parent.attr("width")/2, 
                    y: this.attr("y")-this.parent.attr("height")/2 
                });
            }
            for (var i = connections.length; i--;) {
                CFbi.raphael.connection(connections[i]);
            }
            CFbi.raphael.safari();
        },
        up = function () {
            if (this.type != "text"){
                this.animate({"fill-opacity": 1}, 2000);
            }else{
                this.parent.animate({"fill-opacity": 1}, 2000);
            }
           
        };
        
      
        //connections = [],
        
        conte = function (){
            for (var i = connections.length; i--;) {
                CFbi.raphael.connection(connections[i]);
            }
            CFbi.raphael.safari();       
        }
       var ob = null;
       var copy = [];
    for (var cfe in CFbi.event_etl){
        ob = null;

        if (CFbi.event_etl[cfe].mas_copy) delete CFbi.event_etl[cfe].mas_copy;
        if (CFbi.event_etl[cfe].fk_copy != "" && CFbi.event_etl[cfe].fk_copy && (CFbi.event_etl[cfe].fk_copy != CFbi.event_etl[cfe].id)){
            copy.push(CFbi.event_etl[cfe]);
            continue;
        };
        ob =  CFbi.add_rectangle({
            text:CFbi.event_etl[cfe].semantic_id,
            full_data:CFbi.event_etl[cfe],
            level:get_level(CFbi.event_etl[cfe]),
            level_height:get_level_height(CFbi.event_etl[cfe]),
            type:"object",
        })
        CFbi.shapes.push(ob);      
        if (CFbi.shapes.length>1){
            connections.push(CFbi.raphael.connection(CFbi.shapes[CFbi.shapes.length-2], CFbi.shapes[CFbi.shapes.length-1], "darkblue",0.1));
            connections[connections.length-1].line.attr({ 'arrow-end':   'block-wide-long','text':'1'})
        }
       function get_level_height(object){
            var level = 1;
            if (CFbi.shapes.length>0){
                level = CFbi.shapes[CFbi.shapes.length-1].level_height;
            }
            return level;
        }     

        function get_level(object){
            var level = 1;
            if (CFbi.shapes.length>0){
                level = CFbi.shapes[CFbi.shapes.length-1].level;
                if (CFbi.shapes[CFbi.shapes.length-1].level_height%2 == 0){
                    level--;
                }else{
                    level ++;
                }
                
            }
            return level;
        }        
    }   

     for (var c in copy){

        for (var s in CFbi.shapes){

            if (CFbi.shapes[s].full_data.event_id_db == copy[c].fk_copy){
                if (!CFbi.shapes[s].full_data.mas_copy) CFbi.shapes[s].full_data.mas_copy = [];
                CFbi.shapes[s].full_data.mas_copy.push(copy[c]);
                CFbi.shapes[s].attr({fill: "#94CEF2"});
                break;
            }
        }
    }
    var count_mas = 0;
    for (var i = 0, ii = CFbi.shapes.length; i < ii; i++) {

        if(CFbi.shapes[i]){
            if (CFbi.shapes[i].full_data.mas_copy){
                count_mas = CFbi.shapes[i].full_data.mas_copy.length+1;
                CFbi.shapes[i].label_element.attr({text:CFbi.shapes[i].label_element.attr("text")+'('+count_mas+')'})
             //   console.log(CFbi.shapes[i].label_element.attr("text"))
            }else{
               CFbi.shapes[i].attr({fill: "#EDEA09", stroke: "#9F9E7E", "fill-opacity": 1,"border-radius":"4px", "stroke-width": 2});// cursor: "move" 
            }
            
        }
    }


    for (var i = connections.length; i--;) {
        CFbi.raphael.connection(connections[i]);
    }
    
    CFbi.raphael.setViewBox(0, 0, CFbi.width_panel, CFbi.height_panel, false);

}

/*
    text:CFbi.event_etl[cfe].semantic_id,
    full_data:CFbi.event_etl[cfe],
    level:get_level(CFbi.event_etl[cfe]),
    type:"object",
*/
CFbi.add_rectangle = function(json){
    if (!CFbi.raphael && !json) return;
    var el = null;
    var y_el = 0;/*CFbi.options.height_level+CFbi.options.start_y;*/
    var x_el = 0;
    var width_rectangle  = 200;
    var height_rectangle = 30;
    var diff =0;
    var from_messages = [];
    diff = width_rectangle + CFbi.options.width_level;
    
    if (CFbi.objects.length > 0){
        x_el = CFbi.objects[CFbi.objects.length-1].attr("x")+diff;
    
      
        if (x_el+width_rectangle > CFbi.width_panel && json.level_height%2!=0){
            json.level_height++;
            x_el-=diff;
        }else if (x_el-diff==CFbi.objects[0].attr("x")  && json.level_height%2==0 ){
            json.level_height++;
            x_el-=diff;
        }else{
            if (json.level_height%2==0){
               x_el-=diff*2;
            }
        }

        y_el = CFbi.options.start_y+CFbi.options.height_level*json.level_height;

    }else{
        x_el = CFbi.options.width_level+width_rectangle
        y_el = CFbi.options.start_y+CFbi.options.height_level;
    }

/**************/
el = CFbi.raphael.rect(x_el, y_el, width_rectangle, height_rectangle, 16);
/*CFbi.set_wh({
    x:x_el,
    y:y_el,
})*/
el.node.onclick = function () {
    CFbi.open_dialog(el);
};

//el.from_id = json.el_from.id;
//el.to_id = json.el_to.id;
//el.type_element = json.type;
el.level = json.level;
el.level_height = json.level_height;
el.full_data = json.full_data;
el.label_element = CFbi.raphael.text(x_el+width_rectangle/2, y_el+height_rectangle/2, json.text).attr({fill: 'black'});
//el.label_element.full_text = json.full_text;
el.label_element.full_data = json.full_data;
el.label_element.node.onclick = function(){
    CFbi.open_dialog(el.label_element)
}
/*************/

    CFbi.objects.push(el);
  
    return el;
}
CFbi.open_situation = function(){
    if (!CFbi.situation_id) return;
    window.open( CFbi.base_url+'index.php/conframe_bi/situation/'+CFbi.situation_id)
}


function dynamicSort(property) {
        var sortOrder = 1;
        if(property[0] === "-") {
                sortOrder = -1;
                property = property.substr(1);
        }
        return function (a,b) {
                var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
                return result * sortOrder;
        }
}

//node полностью элемент
CFbi.open_dialog = function(element){
    if (!CFbi.events_info || CFbi.events_info == "null") return;
        if (CFbi.message_info){
                CFbi.message_info.dialog("close");
                CFbi.message_info = null;
               // return;
        }
        CFbi.message_info = CFUtil.dialog.create("message_info",
        {
                title: '&nbsp;Информация',
                width: 500,
                height:200,
                resizable: false,
                position:"center",//[CFbi.coordX+20,CFbi.coordY+20]
        });
        if (CFbi.message_info){

            $(CFbi.message_info).html('');
            var id_inf = parseInt(Math.random()*1000); 
            var html = '<div id = "info_'+id_inf+'"></div>';
            $(CFbi.message_info).html(html);
            CF_Events_info.get_event_info(element.full_data.event_id_db,'info_'+id_inf);

            if (element.full_data.mas_copy){
                
                for (var mc in element.full_data.mas_copy){
                    CF_Events_info.get_event_info(element.full_data.mas_copy[mc].event_id_db,'info_'+id_inf);
                }
            }
        }
}
/*
CFbi.get_event_info = function(id,id_inf){
    $.ajax({
        url:CFbi.base_url+'index.php/conframe_bi/get_event_info/'+id,
    }).done(function(responce){
        var html = '<div class="well well-sm">';
        var responce = JSON.parse(responce);
        var  opened_event =  responce[0];
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
            }
            else if (opened_event.situation_semantic_id != null){
                html += put_attribute('Событие',opened_event.situation_semantic_id);
            }
                    
            html += put_attribute('Сообщение',opened_event.sms_name);
            html += put_attribute('Сообщение',opened_event.email_name);
            html += put_attribute('Информация о неправильном действии режимной и противоаварийной автоматики',opened_event["information_incorrect_operating_pa"]);
            html += put_attribute('Информация о воздушном судне',opened_event["information_about_aircraft"]);
            html += put_attribute('Состояние СДТУ',opened_event["state_of_sdtu"]);
            html += put_attribute('Сведения об АБ',opened_event["battery_info"]);
            html += put_attribute('Состояние собственных нужд',opened_event["state_own_needs"]);
            html += put_attribute('Характеристика обесточенных потребителей',opened_event["characteristics_disconnected_consumers"]);
            html += put_attribute('Причина возникновения ситуации',opened_event["cause_of_situation"]);
            html += put_attribute('Отключенная нагрузка (МВт)',opened_event["cutoff_power_mvt"]);
            html += put_attribute('Ветер',opened_event.wind);
            html += put_attribute('Действия бригад',opened_event["information_crew_name"]);
            html += put_attribute('Осадки',opened_event["precipitations_name"]);
            html += put_attribute('Температура',opened_event["temperature"]);
            html += put_attribute('Прогноз восстановления обесточения потребителей',opened_event["forecast_recovery_consumers"]);
            html += put_attribute('Количество обесточенных населенных пунктов',opened_event["fias_unpowered_count"]);
            html += put_attribute('Время возникновения сингулярного события',moment(CFUtil.get_local_datetime(opened_event["appearence_time"])).format("DD-MM-YYYY HH:mm:ss"));
            html += put_attribute('Время обесточения потребителей',opened_event["time_loss_consumers"]);
            html += put_attribute('Численность запитанного населения',opened_event["numeric_feed_consumers"]);
            html += put_attribute('Численность обесточенного населения',opened_event["number_of_de_energized_consumers"]);
            html += put_attribute('Численность оставшегося обесточенного населения',opened_event["number_of_remaining_de_energized_consumers"]);
            html += put_attribute('РОПИЗ',opened_event["ropiz_name"]);
            html += put_attribute('Организационная структура',opened_event["org_struct_name"]);
            html += put_attribute('Дата-время регистрации события в системе',moment(CFUtil.get_local_datetime(opened_event["datetime_create"])).format("DD-MM-YYYY HH:mm:ss"));
            html += put_attribute('Информация об аварийном оперативном отключении',opened_event["info_emergency_operations_disconnect"]); 
        html += '</div>';
        if (!CFbi.message_info) return;
       // $('#info').append(html);
        $('#info_'+id_inf).append(html);
       
        if (parseInt($('#info_'+id_inf).css("height")) < parseInt($(CFbi.message_info[0]).css("height")) || parseInt($(CFbi.message_info[0]).css("height")) <= 200){
            $(CFbi.message_info[0]).css("height",parseInt($('#info_'+id_inf).css("height"))+35);
        }

    })
}
function put_attribute(name,value){
    var html = '';
    if (value != null && value != 'Invalid date'){
        html += '<div class="row info-row">';
            html += '<div class="col-xs-4"><b>'+name+'</b></div>';
            html += '<div class="col-xs-8">'+value+'</div>';
        html += '</div>';
    }
    return html;
}*/
/**************ВАЖНО**************************/

CFbi.init = function(){
    //$('#vsipanel').css('height')
    $('#holder').css('height',$(window).height()-parseInt($('#vsipanel').css('height'))-parseInt($('nav').css('height'))-25);
    CFbi.raphael = Raphael("holder");
    $('#holder >svg').attr("id","holder_svg")
    CFbi.load();
    var panEnabled = false;
    if (CFbi.not_menu) panEnabled = true
    CFbi.panzoom = svgPanZoom("#holder_svg",{
          'zoomEnabled': true,
          'panEnabled':true, 
          'controlIconsEnabled': false,
          'zoomScaleSensitivity': 0.2,
          'minZoom': 0.2,
          'maxZoom': 4, 
          fit: false,
          center: false
    });
}
CFbi.set_db_event = function(json){
    if (!json) return;
    var db_event = {};
    db_event.messages = [];
    var messages_db = null;
    var rpl = false;
    for (var i in json){
        rpl = false;
        messages_db = null;
        messages_db = {};
        messages_db.from = {};
        messages_db.to = {}

        messages_db.start_time = json[i].date_time;
        messages_db.id = parseInt(json[i].id);
        messages_db.message = json[i].text;

        messages_db.from.id=json[i].from_id;
        messages_db.to.id=json[i].to_id;

        messages_db.from.name = json[i].msg_from;
        
        messages_db.to.name = json[i].msg_to;
        messages_db.semantic = get_sem_id(json[i].id);//передаем сообщение
        messages_db.type_message = json[i].type_message;
        for (var d in db_event.messages){
            if (db_event.messages[d].id == parseInt(json[i].id)){
                rpl = true;break;
            }
        }
        if (!rpl){
            db_event.messages.push(messages_db);
        }
        
    }


    cfevent = db_event;
    function get_sem_id (id_message){
        var sem = [];
        for (var s in json){
            if (json[s].id == id_message){
                sem.push({
                    semantic_id : json[s].semantic_id,
                    id_event : json[s].id_event
                })
            }
        }
        return sem;
    }
}
/*******************************************************/

/*ZOOMER************************************************/
CFbi.get_pan = function(){
    var pan = {x:0,y:0,zoom:1}
          if (CFbi.panzoom){
            pan = CFbi.panzoom.getPan();//не нужно
            pan.zoom = CFbi.panzoom.getZoom()
          } 
   return pan;
}

CFbi.set_offset_x = function(x){
    var pan = CFbi.get_pan();
    return (x/pan.zoom)
}

CFbi.set_offset_y = function(y){
    var pan = CFbi.get_pan();
    return (y/pan.zoom)
}
/*************************************************/




$( window ).resize(function() {
    $('#holder').html('');
    CFbi.clear();
    $('#holder').css('height',$(window).height()-parseInt($('#vsipanel').css('height'))-parseInt($('nav').css('height'))-25);
    CFbi.init();
});
CFbi.clear = function(){
    CFbi.shapes= [];
    CFbi.raphael = null;
    CFbi.objects=[];
    CFbi.message_info=null;
    CFbi.count_dr = 0;
    CFbi.count_hr = 0;
    CFbi.options.count_hr = 0;
    CFbi.options.elements = [];
    old_time = null;
    connections = [];
}

/*******************************is ctm.cf.etl.js*/
CFbi.set_db_etl_v2 = function(json){
    if (!json) return;
    var etl = [];
    var db_etl = {};
    for (var i in json){
/**************CLEAR**********************/
        if (checked_subject(json[i].from_id)){
            json_event = {};
            mas_events = [];
            db_etl.events =[];

            //db_etl.event_id_db = json[i].id;//??? видимо не верно
            //db_etl.message = null // видимо не нужно так как используется вывод content
            db_etl.subject = null;//имя???

/************UP*******************/
            db_etl.id = etl.length;//все равно что будет тут
            db_etl.groups_copy = [];
            db_etl.subject = json[i].msg_from;//потом имя сюда (левая колонка)
            db_etl.subject_id = json[i].from_id;//id для сверок eventsov
            db_etl.msg_type = json[i].msg_type;
        /************in EVENTS*******************/  
            db_etl.events = get_events(json,json[i].from_id);
            etl.push(jQuery.extend(true, {},  db_etl));
        }
    }

    CFbi.set_table(etl);
    CFbi.set_etl_schema();

    function checked_subject (id_subject){
        if (!id_subject) return false;
        for (var i in etl){
            if (etl[i].subject_id == id_subject){
                return false;
                break;
            }
        }
        return true;
    }

    function get_events (events,id_subject){
        var mas_events = [];
        var json_event = {};
        for (var i in events){
            if (events[i].from_id == id_subject){
                json_event = {};
                json_event.content = events[i].content;
                json_event.id = events[i].id;//заменить на реальный id??? 
                json_event.marker = events[i].event_type;
                json_event.start_time = events[i].date_time;
                json_event.semantic_id = events[i].abbrev_long;//events[i].event_order+events[i].semantic_id;
                json_event.event_id_db = events[i].id;
                json_event.fk_copy = events[i].fk_copy;
                mas_events.push(json_event);
            }
        }
        return mas_events;
    }

}

/********************************************/

CFbi.set_table = function(json){
    if(!json) return;
    CFsbj = json;
    var html = '';
    for (var i in CFsbj){
        html+= get_html_subj_event(CFsbj[i],i)
    }

    CFbi.events =  CFbi.events.sort(dynamicSort("marker"));
    $('#'+CFbi.div_table).append(html);
    for (var si in CFbi.events){
        CFbi.events[si].cs = si;
        $('#head_subj_ev').append('<th class="align-center-table">'+CFbi.events[si].marker+'</th>');
    }
    for (var s in CFsbj){
        get_html_data(CFsbj[s]);
    }
    
/******************************КОНТЕНТ ТАБЛИЦЫ******************************************/
    function get_html_data(data){
        var html = '';
        var cs_sp = [];

        for (var i in data.events){
            for (var e in CFbi.events){
                if (CFbi.events[e].data.marker == data.events[i].marker){//CFbi.events[e].data.id == data.events[i].id
                    cs_sp[CFbi.events[e].cs+'_id'] = CFbi.events[e];
                }
            }
        }
        
        for (var i in CFbi.events){
            if (cs_sp[i+'_id'] || cs_sp[i+'_id'] == 0){
                //console.log(cs_sp[i+'_id'].data,data.id);
                html+='<td class="align-center-table set-cursor" onclick="CFbi.window_events(\''+cs_sp[i+'_id'].data.marker+'\',\''+data.id+'\')"><span style="color:green" class="glyphicon glyphicon-ok"></span></td>'
            }else{

                html+='<td class="align-center-table" onclick="CFbi.window_events()"><span style="color:red" class="glyphicon glyphicon-remove"></span></td>'
            }
        }

        $('#'+data.id+'_sub').append(html);
    }
/**************************************************************************************/
/*
data 
end_time: "2013-03-13 16:30:05"
events: Array[3]

[0]
content: "E1: АПВ неуспешно"
id: 11
marker: "АПВ"
start_time: "2013-03-13 16:21:05"

id: 1
message: "M01: 16-21 АО с неуспешным АПВ ВЛ-220. Б10-Погорелово.Б10: ДФЗ. Погорелово: ДФЗ, 1ст.ТЗНП."
start_time: "2013-03-13 16:15:05
"subject: "ДЭВ 3"
*/
    function get_html_subj_event(data,i){
        if (!data || !i) return;
        var html_hr = '';

        if (i == 0){
            var html_ev ='<tr id="head_subj_ev">';
            html_ev+='<td></td>';
            html_ev+='</tr>';
            $('#'+CFbi.div_table).append(html_ev);
        } 
        /*********************************************************************************/
        var empty = false;
        var id_empty = null;
        html_hr+=add_subject(data);

        for (var j in data.events){//поставил загаловки
            empty = false;
            id_empty = null;
            for (var se in CFbi.events){
                if (data.events[j].marker == CFbi.events[se].data.marker){//data.events[j].id == CFbi.events[se].data.id
                    id_empty = data.events[j].marker;
                    empty = true;
                    break;
                }
            }
            if (empty){

            }else{

                
                CFbi.events.push({
                    data : data.events[j],
                    cs : CFbi.events.length,
                    marker:data.events[j].marker,
                });
            }
        }
        /*********************************************************************************/
        function add_subject(data,cs){
            
            var html_hr ='<tr id="'+data.id+'_sub">';
            html_hr+= '<th>';
            if (data.msg_type == "EMAIL"){
                html_hr+='<span class="glyphicon glyphicon-inbox"></span>&nbsp';
            }else if(data.msg_type == "SMS"){
                html_hr+='<span class="glyphicon glyphicon-envelope"></span>&nbsp';
            }
            html_hr+=data.subject+'</th>';
            html_hr+='</tr>';
            return html_hr;
        }
        
        return html_hr;
    }
    
}
CFbi.window_events = function(id_marker,id_subject){
    if (!id_marker || !id_subject){
            if (CFbi.message_info){
                    CFbi.message_info.dialog("close");
                    CFbi.message_info = null;
            }
            return;
    } 

        CFbi.message_info = CFUtil.dialog.create("message_info",
        {
                title: '&nbsp;Информация',
                width: 500,
                resizable: false,
                position:"center",//[CFbi.coordX+20,CFbi.coordY+20]
        });
        if (CFbi.message_info){
            var attr = {};
            for (var i in CFsbj){
                            if (CFsbj[i].id == id_subject){
                                attr.name = CFsbj[i].subject;
                                for (var e in CFsbj[i].events){
                                    if (CFsbj[i].events[e].marker == id_marker){
                                            attr.event = CFsbj[i].events[e];
                                    }
                                }
                                break;
                            }
            }
            html = '<table class="table table-bordered table-striped table-condensed" style="margin-bottom:0;font-size:12px;">';
                html += '<tbody>';
                    html += '<tr>';
                            html+='<td>Тип события</td><td>'+attr.event.marker+'</td>'
                    html += '</tr>';
                    html += '<tr>';
                            html+='<td>Субъект</td><td>'+attr.name+'</td>'
                    html += '</tr>';
                    html += '<tr>';
                            html+='<td>Время</td><td>'+moment(CFUtil.get_local_datetime(new Date(attr.event.start_time))).format("DD-MM-YYYY HH:mm:ss")+'</td>' 
                    html += '</tr>';
                    html += '<tr>';
                            html+='<td>Сообщение</td><td>'+attr.event.content+'</td>'       
                    html += '</tr>';
                html += '</tbody>';
            html += '</table>';
            
            $(CFbi.message_info).html(html);
        }
}

CFbi.set_etl_schema = function(){
    var subject = null;
    var object = null;
    var all_events = [];
    var objects = [];
    var subjects = [];
    var line = [];
    var id_sub_line = null;
    for (var i in CFsbj){
        //проверять не зачем на совпадение субьектов, так как уже ранее события были распределны по субьектам
        get_events(jQuery.extend(true, {},  CFsbj[i]),all_events);
    
    }

    CFbi.event_etl = all_events;
    CFbi.init();
   
    function get_events(data,mas){
        if (!data) return;

        for (var i in data.events){
            data.events[i].subject_name = data.subject;
            data.events[i].subject_id = data.subject_id;
            //data.events[i].event_id_db = data.event_id_db;
            mas.push(data.events[i]);
        }
    }

}