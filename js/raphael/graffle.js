
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
/*GLOBAL DATA*/
var el, connections = [];
var cfevent = [];
var old_time = null;
/**************/
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
    shapes: [],
    raphael : null,
    objects:[],
    message_info:null,
    base_url : null,
    panzoom:null,//zoomer
    image_subject:  ['img/conframe_bi/subject.png','img/conframe_bi/subject_group.png'],
    options:{
            width_level : 100,//расстояние между элементами по y []. ---- .[]
            height_level : 50,//расстояние между элементами по x . <>  .
            start_x:10,//построение первого элемента
            start_y:200,//построение первого элемента, сделать середину див через js
            elements:[],
            count_hr:0,//сколько строк
        },
    type_message:[
        {
            name : 'ОЖУР',
            color: 'green',
            width: 2,
            style_line: 'arrow',    
        },
        {
            name : 'СМС',
            color: 'darkblue',
            width: 2,
            style_line: 'arrow',    
        },
        {
            name : 'Почта',
            color: 'darkred',
            width: 2,
            style_line: 'arrow',    
        },
        {
            name : 'Телефон',
            color: 'darkblue',
            width: 2,
            style_line: 'dash-line',    
        },

    ],
    default_color:{
            name : 'Без типа', 
            color: 'black',
            width: 2,
            style_line: 'arrow',
        },
}


CFbi.load = function(){
    var width = $("#holder").css("width");
    var height = $("#holder").css("height");
    CFbi.width_panel = parseInt(width.substr(0,width.length-2));
    CFbi.height_panel = parseInt(height.substr(0,height.length-2));

    var dragger = function () {//стандартная функция
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
    
        move = function (dx, dy) {//стандартная функция
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
        /************************************/
        var subjects = [];
        var is_from_sub = false;//нужна для пометки что это from
        var is_to_sub = false;//нужна для пометки что это from
        var times = [];
        var sub_text = null;
        var json_color = {};
        var temp_subject = null;
        var text = '';
     //   console.log(cfevent)
        if (!cfevent || !cfevent["messages"]) return;
        
        //список событий
        data_event = cfevent["messages"];
        data_event =  data_event.sort(dynamicSort("start_time"));
        CFbi.count_hr = data_event.length;//строк
        CFbi.count_dr = 2;//столбцов

        for (var ev in data_event){
            is_from_sub = false;
            is_to_sub = false;
            if (times.length>1){
                if (data_event[ev].start_time != times[times.length-1]){
                    times.push(data_event[ev].start_time)
                }   
            }else{
                times.push(data_event[ev].start_time);
            }
            for (var s in subjects){
                if (subjects[s].id == data_event[ev].from.id ) is_from_sub = true;
                if (subjects[s].id == data_event[ev].to.id ) is_to_sub = true;
            }
            if (!is_from_sub) subjects.push(data_event[ev].from);
            if (!is_to_sub) subjects.push(data_event[ev].to);
        }

        CFbi.count_dr+=times.length;

       //субьекты вначале
        for (var ev in data_event){
        
            temp_subject = CFbi.add_ellipse({
                el_from:data_event[ev].from,
                el_to:data_event[ev].to,
                text:data_event[ev].from.name,
                level:1,
                is_to:false,
                type:"subject",
            })
            
            if (temp_subject) CFbi.shapes.push(temp_subject);
                   
        }
        
        //обьекты(сообщения)
        for (var obj in data_event){
            text = CFbi.strip(data_event[obj].message);
            
            if(text.length >= 30){
                text = text.substr(0,30)+"...";
            }
            
            var temp_object = CFbi.add_rectangle({
                el_from:data_event[obj].from,
                el_to:data_event[obj].to,
                text:CFbi.strip(text),
                full_data:data_event[obj],
                level:get_level(data_event[obj]),
                type_message:data_event[obj].type_message,
                type:"object",
            });

            if (temp_object){

                CFbi.shapes.push(temp_object);

                for (var sh in CFbi.shapes){

                    if (CFbi.shapes[sh].type_element == "subject" && CFbi.shapes[sh].from_id == data_event[obj].from.id){

                        if (obj < data_event.length-2 && data_event.length-2 >1){
                            
                            CFbi.shapes[parseInt(sh)].attr({y:temp_object.attrs.y})//CFbi.shapes[CFbi.shapes.length-1] вместо temp_object было
                            CFbi.shapes[parseInt(sh)].label_element.attr({y:temp_object.attrs.y+CFbi.shapes[parseInt(sh)].label_element.height_element})//CFbi.shapes[CFbi.shapes.length-1]
                        }
                        
                        json_color = get_parametrs_line(data_event[obj].type_message);
                        connections.push(CFbi.raphael.connection(CFbi.shapes[parseInt(sh)],temp_object , json_color.color,0.1));//CFbi.shapes[CFbi.shapes.length-1]
                    }

                }//end for соедненеия
            } 
        }

        //субъекты to
        for (var ev in data_event){
            
            temp_subject = CFbi.add_ellipse({
                el_from:data_event[ev].from,
                el_to:data_event[ev].to,
                is_to:true,
                text:data_event[ev].to.name,
                level: CFbi.count_dr,
                type_message:data_event[ev].type_message,
                type:"subject",
            });

            //null при dublicate

            if (temp_subject){//sтут может некорректно работаать, так как проходит последний элемент типа все это дело сглаживает
                
                CFbi.shapes.push(temp_subject);

                for (var sh in CFbi.shapes){//соиднения с to
                  
                    if (temp_subject && CFbi.shapes[sh].type_element == "object" && CFbi.shapes[sh].to_id == data_event[ev].to.id){
                      ///  console.log(CFbi.shapes[sh]);
                        json_color = get_parametrs_line(CFbi.shapes[sh].type_message);
                        connections.push(CFbi.raphael.connection(CFbi.shapes[parseInt(sh)], temp_subject, json_color.color,0.1));
                        
                    }
                }//end соеденения tod

            } 

        }//end for субъекты to


        function get_parametrs_line (type_msg){
            var set_color  = CFbi.default_color;
            for (var tp in CFbi.type_message){
               
                if (CFbi.type_message[tp].name == type_msg){
                  
                    set_color = CFbi.type_message[tp];
                    break;
                }
            }
            return set_color;
        }

        function get_level(event){
            if (!event) return;

            var level = 1;//change level
            var st_time = moment(event.start_time);

            if (old_time){

                if (moment(old_time.start_time) == st_time){
                
                    level == old_time.level;

                }else{
                
                    level = old_time.level;
                    level++;
                
                }
            }
            old_time = event;
            old_time.level = level;

            return level;
       }

        //цвет объектов
        for (var i = 0, ii = CFbi.shapes.length; i < ii; i++) {
            if(CFbi.shapes[i]){
                CFbi.shapes[i].attr({fill: "#EDEA09", stroke: "#9F9E7E", "fill-opacity": 1,"border-radius":"4px", "stroke-width": 2});// cursor: "move"
            }
        }//end цвет

        //перезапись соеденений
        for (var i = connections.length; i--;) {
            CFbi.raphael.connection(connections[i]);
        }

        //run
        CFbi.raphael.setViewBox(0, 0, CFbi.width_panel, CFbi.height_panel, false);
}//end function

CFbi.set_wh = function(attr){
    
    if (attr.x > CFbi.width_panel){
        CFbi.width_panel = attr.x+CFbi.options.width_level;
        $("#holder").css("widht",CFbi.width_panel);
    }
    if (attr.y > CFbi.height_level){
        CFbi.height_level = attr.y+CFbi.options.height_level;
        $("#holder").css("height",CFbi.height_level);
    }
}

CFbi.add_rectangle = function(json){
    if (!CFbi.raphael && !json) return;
    var el = null;
    var y_el = 0;/*CFbi.options.height_level+CFbi.options.start_y;*/
    var width_rectangle  = 200;
    var height_rectangle = 30;
    var diff =0;
    var from_messages = [];
    //console.log(connections)

    if (CFbi.objects.length == 0){
        y_el = CFbi.options.start_y-(CFbi.options.height_level/CFbi.count_hr);//значит start_y-(уровень высоты / количество строк)
        
    }else{
        y_el = CFbi.objects[CFbi.objects.length-1].attrs.y + CFbi.options.height_level //значит от последнего добавленного объекта + уровень высоты
    }

/**************/
el = CFbi.raphael.rect(json.level*CFbi.options.width_level+width_rectangle, y_el, width_rectangle, height_rectangle, 16);
CFbi.set_wh({
    x:json.level*CFbi.options.width_level+width_rectangle,
    y:y_el,
})
el.node.onclick = function () {
    CFbi.open_dialog(el);
};

el.from_id = json.el_from.id;
el.to_id = json.el_to.id;
el.type_message = json.type_message;

el.type_element = json.type;
el.level = json.level;
el.full_data = json.full_data;
el.label_element = CFbi.raphael.text(json.level*CFbi.options.width_level+width_rectangle+width_rectangle/2, y_el+height_rectangle/2, json.text).attr({fill: 'black'});
//el.label_element.full_text = json.full_text;
el.label_element.full_data = json.full_data;
el.label_element.node.onclick = function(){
    CFbi.open_dialog(el.label_element)
}

/*************/

    CFbi.objects.push(el);
   /* CFbi.options.elements.push({
        el_from: json.el_from,
        el_to:json.el_to,
        element :el,
        level:json.level,
        type:json.type,
    });*/
    return el;
}
CFbi.open_situation = function(){
    if (!CFbi.situation_id) return;
    window.open( CFbi.base_url+'index.php/conframe_bi/situation/'+CFbi.situation_id)
}

CFbi.add_ellipse = function(json){
   // console.log(json)
    var el = null;
    var width  = 40;
    var height = 40;
    var y_el = CFbi.options.height_level+CFbi.options.start_y;
    var diff =0;
    var is_dublicate = false;
    //console.log(json)
    el =  create_subj();

    if (!el) el = null;
    return el;
        
    function create_subj(){
        //получаем изображение
        var xy = get_x_y();
        //когда понимаем чтоб это дубликат все досвидос
        if (is_dublicate) return null; 

        var element =  CFbi.raphael.image(CFbi.base_url+CFbi.image_subject[0], xy["x"], xy["y"], width, height);

        if (typeof(element) != "object") return null;

        element.from_id = json.el_from.id;
        element.to_id = json.el_to.id;
        element.type_element = json.type;
        element.level = json.level;
        element.is_to = json.is_to;
        element.type_message = json.type_message;
        var text = json.text;
        
        if (json.type_message == "Почта"){
            text = "САЦ РОССЕТИ"
        }
        
        element.label_element = CFbi.raphael.text(element.attrs.x+width/2, element.attrs.y+height, text).attr({fill: 'black'});
        element.label_element.height_element = height;
 
        CFbi.set_wh({
            x: xy["x"] + width/2,
            y: xy["y"] + height,
        })
      
        return element;
    }

    function get_x_y(){
        
        var coord_xy = {
                x:0,
                y:0,
               }
        var to_one = true;
        var temp_object = null;
        if (CFbi.shapes.length >=1){
            
            for (var cxy in CFbi.shapes){

                //одинаковый уровень и текущий y меньше ["y"] , иначе это первый элемент этого уровня
                if( CFbi.shapes[cxy]["level"] == json.level && coord_xy["y"] <= CFbi.shapes[cxy].attrs["y"] && CFbi.shapes[cxy]["type_element"] == "subject" ){
                        
                    //в случае если повторяются to
                    if (  (json.level >1 && CFbi.shapes[cxy].to_id == json.el_to.id) || (json.level == 1 && CFbi.shapes[cxy].from_id == json.el_from.id)){
                        is_dublicate = true;
                        break;
                    }else{//в случае если не повторяются to

                        coord_xy["y"] = CFbi.shapes[cxy].attrs["y"] + CFbi.options.height_level+height+20;
                        coord_xy["x"] = CFbi.shapes[cxy].attrs["x"];

                        to_one = false;//нужно видимо третье условие
                    }
                   
                }

            }//end for

            //для to
            if (to_one && json.is_to){
                
                for (var o = CFbi.shapes.length-1; o > 0; o--){
                    
                    if (CFbi.shapes[o].type_element == "object"){
                        
                        coord_xy["x"] = CFbi.shapes[o].attrs["x"] + CFbi.shapes[o].attrs["width"] + CFbi.options.width_level
                        break;
                    }
                }
                
                for (var o in CFbi.shapes){

                    if (CFbi.shapes[o].type_element == "object"){

                        coord_xy["y"] = CFbi.shapes[o].attrs["y"];//тут может быть ошибка МОЖЕТ БЫТЬ
                        break;

                    }
                }
                //coord_xy["y"] = CFbi.shapes[0].attrs["y"];
            }

        }else if (CFbi.shapes.length == 0){//первый элемент
            
            coord_xy["x"] = json.level*(CFbi.options.width_level+CFbi.options.start_x);
            coord_xy["y"] = CFbi.options.height_level+CFbi.options.start_y;

        }
        
        return coord_xy;
       
    }
}

CFbi.add_ellipse_old = function (json) {
    if (!CFbi.raphael && !json) return;
    var el = null;
    var width  = 40;
    var height = 40;
    var y_el = CFbi.options.height_level+CFbi.options.start_y;
    var diff =0;
    var is_dublicate = false;
    
    for (var i in CFbi.shapes){
        if (!CFbi.shapes[i]) continue;

        if (json.el_from.id == CFbi.shapes[i].from_id && !json.is_to){//совпало id и это не 1 уровень
            is_dublicate = true;
        }else if (json.el_to.id == CFbi.shapes[i].to_id && CFbi.shapes[i].level > 1 && CFbi.shapes[i].type_element == "subject"){
            is_dublicate = true;
        }

        if (CFbi.shapes[i].level == json.level && !is_dublicate){
            
            diff = CFbi.shapes[i].attrs.y - ( CFbi.shapes[i].attrs.y - CFbi.options.height_level );//разница смещение
                
                CFbi.shapes[i].attr({
                    y: CFbi.shapes[i].attrs.y + CFbi.options.height_level,
                });

                if (CFbi.shapes[i].label_element){
                     
                   CFbi.shapes[i].label_element.attr({
                        y: CFbi.shapes[i].label_element.attrs.y + diff
                   })

                }

            y_el= CFbi.shapes[i].attrs.y + CFbi.options.height_level-diff;
         //   set_param();
           // return null;
        }  

    }

    if (!is_dublicate){
      //  el = CFbi.raphael.ellipse(json.level*(CFbi.options.width_level+CFbi.options.start_x), y_el, width, height);
      var x_el = 0;
        if (CFbi.shapes.length>1 && json.level >1){
            
            for(var o = CFbi.shapes.length; o > 0; o--){
              
                if(CFbi.shapes[o]){
                   
                    if (CFbi.shapes[o].type_element == "object"){
                       
                        x_el = CFbi.shapes[o].attrs.x+CFbi.shapes[o].attrs.width+CFbi.options.width_level;
                        break;
                    }
                }
            }
           
        }else{
           
            x_el = json.level*(CFbi.options.width_level+CFbi.options.start_x);
        }
        el =  CFbi.raphael.image(CFbi.base_url+CFbi.image_subject[0], x_el, y_el, width, height);

        el.from_id = json.el_from.id;
        el.to_id = json.el_to.id;
        el.type_element = json.type;
        el.level = json.level;
        var text = json.text
        if (json.type_message == "Почта"){
            text = "САЦ РОССЕТИ"
        }
    
            el.label_element = CFbi.raphael.text(x_el+width/2, y_el+height, text).attr({fill: 'black'});
            el.label_element.height_element = height;
    
       
     
            CFbi.set_wh({
                x:x_el+width/2,
                y:y_el+height,
            })
      
        return el;
    }
    return null;
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
CFbi.set_db_event = function(json){
    if (!json) return;

    var db_event = {};
    db_event.messages = [];
    var messages_db = null;
    var rpl = false;
    var delete_eto = null;
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
        messages_db.to.id='one_id';//json[i].to_id;

        messages_db.from.name = json[i].msg_from;
 
        messages_db.to.name = json[i].msg_to;
        messages_db.semantic = get_sem_id(json[i].id);//передаем сообщение
        messages_db.type_message = json[i].type_message;
        messages_db.type_operator = json[i].type_operator == "NULL" ? null : json[i].type_operator;

        for (var d in db_event.messages){
            if (db_event.messages[d].id == parseInt(json[i].id)){
                rpl = true;break;
            }
        }
        if (!rpl){
            db_event.messages.push(messages_db);
/*            var s = jQuery.extend(true, {},messages_db);
            s.type_message = "Почта";
            s.id = s.id+1;
            db_event.messages.push(s);*/
        }
        
    }

    cfevent = db_event;
    
    function get_sem_id (id_message){
        var sem = [];
        for (var s in json){
            if (json[s].id == id_message && json[s].fk_situation == CFbi.situation_id && json[s].semantic_id != "ОЖУР"){
                sem.push({
                    semantic_id : json[s].semantic_id,
                    id_event : json[s].id_event
                })
            }
        }
        return sem;
    }
}
//node полностью элемент
CFbi.open_dialog = function(element){
    if (!element) return
    CFbi.message_info = CFUtil.dialog.create("message_info",
        {
                title: '&nbsp;Информация',
                width: 550,
                resizable: false,
                position:"right top",//[CFbi.coordX+20,CFbi.coordY+20]
        });
    
    if (CFbi.message_info){
       
        var data_info = {
            from : element.full_data.from.name,
            to : element.full_data.to.name,
            full_text : element.full_data.message,
            start_time:moment(CFUtil.get_local_datetime(new Date(element.full_data.start_time))).format("DD-MM-YYYY HH:mm:ss"),
            semantic:element.full_data.semantic,
            type_operator:element.full_data.type_operator,//element.full_data.type_operator ,
        };
        var html = '<table class="table table-bordered table-striped table-condensed TblMsgSit" style="margin-bottom:0;font-size:12px;">';
                html += '<tbody>';
                         html+='<tr>';
                        if (data_info.start_time){
                            html += '<td>Время</td>';
                            html += '<td>'+data_info.start_time+'</td>';
                        }

                        html+='</tr>';

                        html += '<tr>';
                        if (data_info.from){
                            html += '<td>От кого</td>';
                            html += '<td>'+data_info.from+'</td>'
                        }
                        html += '</tr>'

                      /*  html+='<tr>';
                        if (data_info.to){
                            html += '<td>Кому</td>';
                            html += '<td>'+data_info.to+'</td>';
                        }
                        html+='</tr>';*/
                       
                        html+='<tr>';
                        
                        if (data_info.full_text){
                            html += '<td width="100px">'+CFbi.get_icon(data_info.type_operator)+' Сообщение</td>';
                            html += '<td>'+data_info.full_text+'</td>';
                        }

                        html += '</tr>';
                        html+='<tr>';

                        if (data_info.semantic){
                            html += '<td><b>Событии</b></td>';
                            html += '<td>'
                            for (var s in data_info.semantic){
                                html+='<button class="btn btn-info btn-sm" onclick="CF_Events_info.get_event_info(\''+data_info.semantic[s].id_event+'\',\'info\',\'1\')">'+data_info.semantic[s].semantic_id+'</button>';
                            }
                           
                            html += '</td>';
                        }

                        html += '</tr>';
                html += '</tbody>';
        html += '</table><div id="info"></div>';
        $(CFbi.message_info).html(html);
    } 
}
CFbi.init = function(){
    CFbi.raphael = Raphael("holder");
    $('#holder >svg').attr("id","holder_svg")
    CFbi.load();
    //var panEnabled = false;
   // if (CFbi.not_menu) panEnabled = true;
    if (typeof svgPanZoom == 'function' ){
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
    }else{
        console.warn('Не загружена библиотека svgPanZoom, либо не верная версия.');
    }
}

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
$( window ).resize(function() {
    $('#holder').html('');
    CFbi.clear();
    $('#holder').css('height',$(window).height()-($(window).height()*10/100));
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

//почта,смс(beeline,megafon)
CFbi.get_icon = function(type){
    var html = '<span class="';
    if (!type || type == 'NULL'){
        html+='glyphicon glyphicon-envelope';
        html+='">';
    }else if (type == 'beeline'){
        html+='beeline">Б';
    }else if (type == 'megafon'){
        html+='megafon">М';
    }else if (type == 'OJUR'){
        html+='glyphicon glyphicon-book">';
    }else{
        html+='">';
    }
    html+='</span>';
    return html;
}
CFbi.strip = function(html){
   var tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
}