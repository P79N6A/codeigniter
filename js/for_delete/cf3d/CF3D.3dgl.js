/* 

 */
var CF3D_3dgl = {
	add_element: null
}; 
 
var default_object = {
                'color': 0xeeeeee,
                'radius': 100,
                'height': 200,
                'width': 200,
                'depth': 200,
                'radiusTop':1,
                'radiusBottom':100,
                'radiusSegments':32,
                'name': 'New_object',
                'sbj_id': 0,
                'X': 0,
                'Y': 0,
                'Z': 0,
                'level':1,
                'db_id': null
        }
/*
 * функция добавления объектов типа сфера
 * vadim
 * 20141017
 */
CF3D_3dgl.add_sphere = function (attr){

	if (CF3D.scene.children.length==0){
		CF3D.create_light();
		i=0;
		CF3D.init_helper_arrow();
	}

	var geometry1 = new THREE.SphereGeometry(attr['radius'],40,40);//задание тип фигуры - сфера, (радиус, количество меридиан, количество параллелей)
	
	if(attr['name'].indexOf('Россети') + 1) {
		var texture= THREE.ImageUtils.loadTexture(CF3D.base_url+'img/logotip_rosseti(texture).png')
		texture.anistropy=8;
		var material1 = new THREE.MeshPhongMaterial({map:texture, emissive: 0xffffff})
	}
	else{
		var material1 = new THREE.MeshPhongMaterial({color:attr['color'], emissive: attr['color']})
	}
	
	build_object = new THREE.Mesh (geometry1,material1)

	CF3D.scene.add(build_object)
	build_object.name=attr['name'];
	build_object.select=true;
	build_object.position.set(attr['X'],attr['Y'],attr['Z']);
	if (attr['lines']) build_object.lines=attr['lines'];
	else build_object.lines=[];
	build_object.type_element="sphere";
	build_object.open_obj=false;
	build_object.sbj_id=attr['sbj_id'];
	build_object.child_obj=new Array();
	build_object.parent_obj = null;
	build_object.db_id = attr['db_id'];	
//	build_object.db_id = null;
	if (attr['parent_obj']) build_object.parent_obj = attr['parent_obj']

	build_object.addEventListener('click', function() {console.log("clicked the three.js ball");});
	
		build_object.get_json = function(){
			return {
				"typical_element_type":"sphere",
				"X":this.position.x,
				"Y":this.position.y,
				"Z":this.position.z,
				"radius":this['geometry']['boundingSphere']['radius'],
				"color": this.material.color.getHex(),
				"level": this['level'],
				"name": this['name'],
				"sbj_id": this['sbj_id'],
				"db_id": this['db_id'],
			}
			
		}
		build_object.copy_element = function(){
			CF3D.copy_element = this
			$('#pop_up_window_div').remove();
		}

		build_object.cut_element = function(){
			this.copy_element();
			CF3D.right_click_sel_obj = this
			CF3D_editor.rec_del_lines();
			connected_obj = new Array()
			CF3D.scene.remove(this.label)
			CF3D.scene.remove(this)
		}


	if (attr['level']){
		build_object.level=attr['level'];	
	}
	build_object.sbj_id=attr['sbj_id']	
	if (attr['child_db']){
		build_object.child_db=attr['child_db'];
	}
	
	CF3D_3dgl.add_label_name(build_object)

	build_object.element={
				id : build_object.id,
				name : build_object.name,
				type_element : build_object.type_element,
				parameters : attr
			};
		
	CF3D_3dgl.add_object_window = null

}
//конец функции


/*
 * функция добавления объектов типа куб
 * vadim
 * 20141017
 */
CF3D_3dgl.add_cube = function (attr){

	if (CF3D.scene.children.length==0){
		CF3D.create_light();
		i=0;
		CF3D.init_helper_arrow();
	}

	var geometry1 = new THREE.BoxGeometry(attr['width'],attr['height'],attr['depth']);//задание тип фигуры - куб, (ширина, длина, высота)
	
	var material1 = new THREE.MeshPhongMaterial({color:attr['color'], emissive: attr['color']})
	
	build_object = new THREE.Mesh (geometry1,material1)

	CF3D.scene.add(build_object)
	build_object.name=attr['name'];
	build_object.select=true;
	build_object.position.set(attr['X'],attr['Y'],attr['Z']);
	if (attr['lines']) build_object.lines=attr['lines'];
	else build_object.lines=[];
	build_object.type_element="cube";
	build_object.open_obj=false;
	build_object.sbj_id=attr['sbj_id'];
	build_object.child_obj=new Array();
	build_object.parent_obj = null;
	build_object.db_id = attr['db_id'];	
//	build_object.db_id = null;	
	if (attr['parent_obj']) build_object.parent_obj = attr['parent_obj']
	
	build_object.addEventListener("dblclick", function (){alert(1)});

		build_object.get_json = function(){
			return {
				"typical_element_type":"cube",
				"X":this.position.x,
				"Y":this.position.y,
				"Z":this.position.z,
				"width":this.geometry.parameters.width,
				"height":this.geometry.parameters.height,
				"depth":this.geometry.parameters.depth,
				"color": this.material.color.getHex(),
				"level": this['level'],
				"name": this['name'],
				"sbj_id": this['sbj_id'],
				"db_id": this['db_id'],
			}
			
		}
		build_object.copy_element = function(){
			CF3D.copy_element = this
			$('#pop_up_window_div').remove();
		}

		build_object.cut_element = function(){
			this.copy_element();
			CF3D.right_click_sel_obj = this
			CF3D_editor.rec_del_lines();
			connected_obj = new Array()
			CF3D.scene.remove(this.label)
			CF3D.scene.remove(this)
		}

	
	if (attr['level']){
		build_object.level=attr['level'];	
	}
	build_object.sbj_id=attr['sbj_id']	
	if (attr['child_db']){
		build_object.child_db=attr['child_db'];
	}
	
	CF3D_3dgl.add_label_name(build_object)
	
	build_object.element={
				id : build_object.id,
				name : build_object.name,
				type_element : build_object.type_element,
				parameters : attr
			};	
		
	CF3D_3dgl.add_object_window = null

}
//конец функции


/*
 * функция добавления объектов типа цилиндр
 * vadim
 * 20141017
 */
CF3D_3dgl.add_conus = function (attr){

	if (CF3D.scene.children.length==0){
		CF3D.create_light();
		i=0;
		CF3D.init_helper_arrow();
	}

	var geometry1 = new THREE.CylinderGeometry(attr['radiusTop'], attr['radiusBottom'], attr['height'], attr['radiusSegments']);//задание тип фигуры - конус, (радиусВерха, радиусНиза, высота, количество сегментов)
	
	if(attr['name'].indexOf('Россети') + 1) {
		var texture= THREE.ImageUtils.loadTexture(CF3D_editor.base_url+'img/logotip_rosseti(texture).png')
		texture.anistropy=8;
		var material1 = new THREE.MeshPhongMaterial({map:texture, emissive: 0xffffff})
	}
	else{
		var material1 = new THREE.MeshPhongMaterial({color:attr['color'], emissive: attr['color']})
	}
	
	build_object = new THREE.Mesh (geometry1,material1)

	CF3D.scene.add(build_object)
	build_object.name=attr['name'];
	build_object.select=true;
	build_object.position.set(attr['X'],attr['Y'],attr['Z']);
	if (attr['lines']) build_object.lines=attr['lines'];
	else build_object.lines=[];
	build_object.type_element="conus";
	build_object.open_obj=false;
	build_object.sbj_id=attr['sbj_id'];
	build_object.child_obj=new Array();
	build_object.parent_obj = null;
	build_object.db_id = attr['db_id'];	
//	build_object.db_id = null;	
	if (attr['parent_obj']) build_object.parent_obj = attr['parent_obj']
	
	
		build_object.get_json = function(){
			return {
				"typical_element_type":"conus",
				"X":this.position.x,
				"Y":this.position.y,
				"Z":this.position.z,
				"height":this.geometry.parameters.height,				
				"radialSegments":this.geometry.parameters.radialSegments,				
				"radiusBottom":this.geometry.parameters.radiusBottom,				
				"radiusTop":this.geometry.parameters.radiusTop,				
				"color": this.material.color.getHex(),
				"level": this['level'],
				"name": this['name'],
				"sbj_id": this['sbj_id'],
				"db_id": this['db_id'],
			}
		}
		build_object.copy_element = function(){
			CF3D.copy_element = this
			$('#pop_up_window_div').remove();
		}

		build_object.cut_element = function(){
			this.copy_element();
			CF3D.right_click_sel_obj = this
			CF3D_editor.rec_del_lines();
			connected_obj = new Array()
			CF3D.scene.remove(this.label)
			CF3D.scene.remove(this)
		}

	
	if (attr['level']){
		build_object.level=attr['level'];	
	}
	build_object.sbj_id=attr['sbj_id']	
	if (attr['child_db']){
		build_object.child_db=attr['child_db'];
	}
	
	CF3D_3dgl.add_label_name(build_object)

	build_object.element={
				id : build_object.id,
				name : build_object.name,
				type_element : build_object.type_element,
				parameters : attr
			};	
		
	CF3D_3dgl.add_object_window = null

}
//конец функции

/*
 * функция добавления метки наименования
 * vadim
 * 20141017
 */
CF3D_3dgl.add_label_name = function(build_object){

	var text = document.createElement( 'div' );
	text.className = 'label';
	if (CF3D.hidn_name==false) text.className+=' hidn_label';
	text.id = build_object.id;
	text.style.color = settings['color_name'];
	text.textContent = build_object.name;

	var label = new THREE.CSS2DObject( text );
	label.position.x = build_object.position.x;
	label.position.y = build_object.position.y;
	label.position.z = build_object.position.z;
	CF3D.scene.add( label );	

	build_object.label = label

}
//конец функции


/* 			
 * содениние объектов с помощью произвольных линий
 * vadim
 * 20140926
 */
//var j = 0
CF3D_3dgl.connect_curl = function(){
	
	start_obj = CF3D.connect_obj1;
	end_obj = CF3D.connect_obj2;
	var randomPoints = [];
	randomPoints.push( new THREE.Vector3( start_obj.position.x,start_obj.position.y,start_obj.position.z ) );

		var start=start_obj.position
		var end=end_obj.position
		var del=parseInt(start.distanceTo( end )/100)
		var del_x=(start_obj.position.x-end_obj.position.x)/del
		var del_y=(start_obj.position.y-end_obj.position.y)/del
		var del_z=(start_obj.position.z-end_obj.position.z)/del
		
	for ( var i = 0; i < del; i ++ ) {
		
		randomPoints.push( new THREE.Vector3( THREE.Math.randFloat( start_obj.position.x-(i* del_x)-30, start_obj.position.x-(i* del_x)+30 ), ( start_obj.position.y-(i*del_y) ), THREE.Math.randFloat( start_obj.position.z-(i* del_z)-30, start_obj.position.z-(i* del_z)+30 ) ) );
		
	}
	randomPoints.push( new THREE.Vector3( end_obj.position.x,end_obj.position.y,end_obj.position.z ) );

	var randomSpline =  new THREE.SplineCurve3( randomPoints );

	var extrudeSettings = {
		steps			: 200,
		bevelEnabled	: false,
		extrudePath		: randomSpline
	};


	var pts = [], numPts = 4;

	for ( var i = 0; i < numPts * 2; i ++ ) {

		var l = i % 2 == 1 ? 2.5 : 5;

		var a = i / numPts * Math.PI;

		pts.push( new THREE.Vector2 ( Math.cos( a ) * l, Math.sin( a ) * l ) );

	}

	var shape = new THREE.Shape( pts );

	var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );

	var material2 = new THREE.MeshLambertMaterial( { color: settings['color_line'], wireframe: false } );

	var new_line = new THREE.Mesh( geometry, material2 );
	new_line.select=true

	new_line.from=start_obj
	new_line.to=end_obj
	
	new_line.type_line='curl';
	if (type_line) new_line.type_line = type_line
	
	start_obj.lines.push(new_line);
	end_obj.lines.push(new_line);
	
	CF3D.scene.add( new_line );
	
	new_line.get_json = function (){
	
		return {
			"to":new_line.to['sbj_id'],
			"from":new_line.from['sbj_id'],
			"color": new_line.material.color.getHex(),
			"type_line": new_line.type_line,
		}
	
	};

	end_obj.parent_obj = start_obj;
	start_obj.child_obj[start_obj.child_obj.length] = end_obj;
	
}
// конец процедуры

/*
 * функция для построения связи прямой линии
 * vadim
 * 20140926
 */
CF3D_3dgl.connect_straight = function (){

	start_obj = CF3D.connect_obj1;
	end_obj = CF3D.connect_obj2;
	var boxGeometry = new THREE.BoxGeometry( 10, 10, 10 );

	var start = start_obj.position
	var end = end_obj.position
	
	//start.multiplyScalar( 75 );
	//end.multiplyScalar( 75 );

	var new_line = new THREE.Mesh( boxGeometry, new THREE.MeshLambertMaterial( {color:settings['color_line']}) );
	new_line.position.copy( start );
	new_line.position.lerp( end, 0.5 );
	new_line.scale.set( 1,1, start.distanceTo( end )/10 );
	new_line.lookAt( end );
	new_line.from=start_obj
	new_line.to=end_obj
	
	start_obj.lines.push(new_line)
	end_obj.lines.push(new_line)

	end_obj.parent_obj = start_obj
	start_obj.child_obj[start_obj.child_obj.length] = end_obj
	
	new_line.select=true	

	new_line.type_line = 'straight';
	CF3D.scene.add( new_line );

	new_line.get_json = function (){
	
		return {
			"to":new_line.to['sbj_id'],
			"from":new_line.from['sbj_id'],
			"color": new_line.material.color.getHex(),
			"type_line": new_line.type_line,
		}
	
	};	
	
}
// конец процедуры

/*
 * функция добавление потомка объекта
 * vadim
 * 20141009
 */
CF3D_3dgl.add_child = function (){

	parent_object = CF3D.scene.getObjectById(parseInt($('#id_object').val()));
	CF3D.children = [];

		var d_y = 1000;
		new_object = JSON.parse(JSON.stringify(default_object))
	CF3D_3dgl.add_object_window = $('#type_object').val()
	new_object['color'] = 0xeeeeee;
	new_object['name'] = $('#name_object').val()
	new_object['X'] = parent_object.position.x;
	new_object['Y'] = parent_object.position.y - d_y;
	new_object['Z'] = parent_object.position.z;
	new_object['level'] = parent_object.level+1;
	new_object['sbj_id'] = String(CF3D.scene.children.length);
	CF3D_3dgl['add_'+CF3D_3dgl.add_object_window](new_object);
	
	record_arr_connected_obj(CF3D.scene.children[CF3D.scene.children.length-2],parent_object,$('#type_line').val());
	CF3D.create_lines();
	CF3D_3dgl.update_typologie(parent_object, d_y);

	CF3D.create_lines();
	$('#add_object_window').remove();
}
//конец функции

/*
 * функция добавление родителя объекта
 * vadim
 * 20141027
 */
CF3D_3dgl.add_parent = function (){

	child_object = CF3D.scene.getObjectById(parseInt($('#id_object').val()));
	CF3D.children = [];

		var d_y = 1000;
		new_object = JSON.parse(JSON.stringify(default_object))
	CF3D_3dgl.add_object_window = $('#type_object').val()
	new_object['color'] = 0xeeeeee;
	new_object['name'] = $('#name_object').val()
	new_object['X'] = child_object.position.x;
	new_object['Y'] = child_object.position.y + d_y;
	new_object['Z'] = child_object.position.z;
	new_object['level'] = child_object.level-1;
	new_object['sbj_id'] = String(CF3D.scene.children.length);
	CF3D_3dgl['add_'+CF3D_3dgl.add_object_window](new_object);
	
	record_arr_connected_obj(child_object,CF3D.scene.children[CF3D.scene.children.length-2],$('#type_line').val());
	CF3D.create_lines();
	CF3D_3dgl.update_typologie(child_object, d_y);

	CF3D.create_lines();
	$('#add_object_window').remove();
}
//конец функции


/*
 * функция добавление потомка объекта
 * vadim
 * 20141009
 */
CF3D_3dgl.add_level = function (){

	parent_object = CF3D.scene.getObjectById(parseInt($('#id_object').val()));

		var d_y = 1000;

	CF3D_3dgl.add_object_window = $('#type_object').val()
	new_object['color'] = 0xeeeeee;
	new_object['name'] = $('#name_object').val()
	new_object['X'] = parent_object.position.x + 1000;
	new_object['Y'] = parent_object.position.y;
	new_object['Z'] = parent_object.position.z + 1000;
	new_object['level'] = parent_object.level;
	new_object['sbj_id'] = String(CF3D.scene.children.length);
//	CF3D.building_object(new_object);
	CF3D_3dgl['add_'+CF3D_3dgl.add_object_window](new_object);
	record_arr_connected_obj(CF3D.scene.children[CF3D.scene.children.length-2],parent_object,$('#type_line').val());
	CF3D.create_lines();

	CF3D_3dgl.update_typologie(parent_object, d_y);

	CF3D.create_lines();
	$('#add_object_window').remove();

}
//конец функции

/*
 * функция обновления типолгии объекта
 * vadim
 * 20141010
 */
CF3D_3dgl.update_typologie = function (parent_object, d_y){
	var children_obj = [];
	i = 0;
	while  ( i < parent_object['lines'].length){
            var current_line = parent_object['lines'][i];
            if (current_line['from'] == parent_object) {
                children_obj[children_obj.length] = current_line['to']
                record_arr_connected_obj(current_line['to'],parent_object,current_line['type_line'])
                CF3D_3dgl.delete_line(current_line)
                CF3D.scene.remove(current_line);
            }
            else i++
	}
	
	if (children_obj.length > 1){
            for (var j in children_obj){
                new_position = get_position_children_circle(children_obj.length, d_y, parseInt(j), parent_object) 
                children_obj[j].position.set(new_position.x,new_position.y,new_position.z)
                children_obj[j].label.position.set(new_position.x,new_position.y,new_position.z)
                CF3D_3dgl.update_typologie (children_obj[j], d_y)
            }
	}
	else if (children_obj.length == 1){
            children_obj[0].position.set(parent_object.position.x,parent_object.position.y - d_y,parent_object.position.z)
            children_obj[0].label.position.set(parent_object.position.x,parent_object.position.y - d_y,parent_object.position.z)
            CF3D_3dgl.update_typologie (children_obj[0], d_y)			
	}

}
//конец функции

/*
 * функция получения координат одиночного потомка у объекта
 * vadim
 * 20141013
 */
get_position_children_circle = function (count, d_y, iteration, parent_object){

    new_position = new THREE.Vector3();

    var d_grad=(2*Math.PI/count)
    var radius = 500*Math.sqrt(count);

    new_position.setX (Math.sin(d_grad*iteration)*radius+parent_object.position.x)
    new_position.setY (parent_object.position.y - d_y)
    new_position.setZ (Math.cos(d_grad*iteration)*radius+parent_object.position.z)
    return new_position;
} 
//конец функции

/*
 * функция удаление объекта
 * vadim
 * 20141009
 */
var arr_del_export_object = new Array();
CF3D_3dgl.delete_object = function (){
	
	if (CF3D.right_click_sel_obj.db_id != null){
            arr_del_export_object[arr_del_export_object.length] = CF3D.right_click_sel_obj['db_id'];
	}
	var obj = CF3D.right_click_sel_obj;
	var parent_obj = CF3D.right_click_sel_obj['parent_obj'];
	var i = 0;
	while  ( i < obj['lines'].length){
            var current_line = obj['lines'][i]
            CF3D_3dgl.delete_line(current_line);
            CF3D.scene.remove(current_line);
	}
	CF3D.scene.remove(CF3D.right_click_sel_obj.label);
	CF3D.scene.remove(CF3D.right_click_sel_obj);
	$('#pop_up_window_div').remove();

	//снять в случае не надобности обновления топологии  после обновления удалить нижние строчки
	if (parent_obj != null){
            CF3D_3dgl.update_typologie(parent_obj,1000);
            CF3D.create_lines();
	}
}
// конец процедуры

/*
 * функция удаление в объекте линии из списка линий
 * vadim
 * 20140929
 */
CF3D_3dgl.delete_line = function (current_line){
	
    var obj = current_line.to
    for (var j=0; j<obj['lines'].length; j++){
        if (obj['lines'][j]==current_line) {
            obj['lines'].splice(j,1);
            break;
        }
    }
    obj['parent_obj'] = null
    obj = current_line.from
    for (var k=0; k<obj['lines'].length; k++){
        if (obj['lines'][k]==current_line) {
            obj['lines'].splice(k,1);
            break;
        }
    }
    CF3D_3dgl.delete_child_in_parent(obj,current_line.to);

}
//конец функции

/*
 * функция диалогового окна данных объекта
 * vadim
 * 20141009
 */
var levels=new Array;
CF3D_3dgl.object_edit = function (){
	
	if (!CF3D.right_click_sel_obj) {
            $('#pop_up_window_div').remove();
            return;
	}

	id_win = "edit_window";	
	
	parameters_dialog = JSON.parse(JSON.stringify(default_parameters_dialog));
	parameters_dialog.title = langs.get_term("txt_data_object");
	parameters_dialog.position = 'top';

	down_panel_buttons = CF3D.array_buttons(2);

	down_panel_buttons[0].name = langs.get_term('sm_btn_save');
	down_panel_buttons[0].onclick = "CF3D_3dgl.save_change_object()";
	down_panel_buttons[0].id = "btn_save";

	down_panel_buttons[1].name = langs.get_term('btn_cancel');
	down_panel_buttons[1].onclick = "$(\'#"+id_win+"\').dialog(\'close\')";
	down_panel_buttons[1].id = "btn_cancel";
	
	if (CF3D.right_click_sel_obj['type_element']){
            var arr_fields = [
                {
                    "id": "id",
                    "name" :"txt_id",
                    "image": "glyphicon glyphicon-copyright-mark",
                    "value": CF3D.right_click_sel_obj['id'],
                    "propeties" : "readonly",				
                    "type" : "text"
                },
                {
                    "id": "db_id",
                    "name" :"txt_db_id",
                    "image": "glyphicon glyphicon-copyright-mark",
                    "value": CF3D.right_click_sel_obj['db_id'],
                    "propeties" : "readonly",				
                    "type" : "text"
                },
                {
                    "id": "name",
                    "name" :"txt_name",
                    "image": "glyphicon glyphicon-copyright-mark",
                    "value": CF3D.right_click_sel_obj['name'],
                    "type" : "text"
                },
                {
                    "id": "type_element",
                    "name" :"txt_type_element",
                    "image": "glyphicon glyphicon-copyright-mark",
                    "value": CF3D.right_click_sel_obj['type_element'],
                    "type" : "select",
                    "options" : [
                            {
                                    "value" : "sphere",
                                    "name" : langs.get_term("txt_sphere"),
                            },
                            {
                                    "value" : "cube",
                                    "name" : langs.get_term("txt_cube"),
                            },
                            {
                                    "value" : "conus",
                                    "name" : langs.get_term("txt_conus"),
                            },
                    ]
                },
            ]
	}	
	else if (CF3D.right_click_sel_obj['type_line']){
		var arr_fields = [
			{
				"id": "from",
				"name" :"txt_parent",
				"image": "glyphicon glyphicon-copyright-mark",
				"value": CF3D.right_click_sel_obj['from']['name'],
				"propeties" : "readonly",
				"type" : "text"
			},
			{
				"id": "to",
				"name" :"txt_child",
				"image": "glyphicon glyphicon-copyright-mark",
				"value": CF3D.right_click_sel_obj['to']['name'],
				"propeties" : "readonly",
				"type" : "text"
			},
			{
				"id": "type_line",
				"name" :"txt_line_type",
				"image": "glyphicon glyphicon-copyright-mark",
				"value": CF3D.right_click_sel_obj['type_line'],
				"propeties" : "readonly",
				"type" : "text"
			}		
		
		];

	}

	data_dialog = {
		parameters: parameters_dialog,
		down_panel_buttons: down_panel_buttons,
		fields_main_content : arr_fields,
		id_window : id_win,
		view_templ : "tmpl_main_content"
	}	
	
	QC.open_dialog (JSON.stringify(data_dialog))
	
	$("#pop_up_window_div").remove();

}
//конец функции 

/*
 * функция вызова окна добавление потомка объекта
 * vadim
 * 20141014
 */
CF3D_3dgl.save_change_object = function (){

	change_object = CF3D.scene.getObjectById(parseInt($('#id').val()));
	new_object =  $.extend( [], default_object );
	for (var i in change_object.element.parameters){
		new_object[i] = change_object.element.parameters[i];
		if ($('#'+i).val()) new_object[i] = $('#'+i).val();
	}
	CF3D_3dgl['add_'+ $('#type_element').val()](new_object);
	CF3D.scene.children[CF3D.scene.children.length-2].position.set(change_object.position.x,change_object.position.y,change_object.position.z);
	CF3D.scene.children[CF3D.scene.children.length-1].position.set(change_object.position.x,change_object.position.y,change_object.position.z);
	$('#edit_window').dialog('close');
	
	CF3D_3dgl.update_data_object(change_object);
}
//конец функции 

/*
 * функция обновления данных объекта
 * vadim
 * 20141024
 */
CF3D_3dgl.update_data_object = function (change_object){
	CF3D_3dgl.delete_child_in_parent (change_object['parent_obj'],change_object);

	for (var i in change_object['child_obj']){
		change_object['child_obj'][i]['parent_obj'] = CF3D.scene.children[CF3D.scene.children.length-2];
		record_arr_connected_obj(change_object['child_obj'][i],CF3D.scene.children[CF3D.scene.children.length-2],"curl");
	}
	if (change_object['parent_obj']){
		record_arr_connected_obj(CF3D.scene.children[CF3D.scene.children.length-2],change_object['parent_obj'],"curl");
	}
	parent_obj = change_object['parent_obj'];

	CF3D.right_click_sel_obj = change_object;	
	CF3D_3dgl.delete_object();

	arr_del_export_object.splice(arr_del_export_object.length-1,1);
	
	CF3D_3dgl.update_typologie(parent_obj,1000);
	
	CF3D.create_lines();	
}
//конец функции 

/*
 * функция вызова окна добавление потомка объекта
 * vadim
 * 20141014
 */
CF3D_3dgl.delete_child_in_parent = function (parent,children){
	if (!parent) return;
	for (var k=0; k<parent['child_obj'].length; k++){
		if (parent['child_obj'][k]==children) {
			parent['child_obj'].splice(k,1);
			break;
		}
	}	
	
}
//конец функции 