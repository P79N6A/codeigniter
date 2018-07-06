/* 

 */

var CF3D = {
    scene:null,
    camera:null,
    base_url:null,
    container:null,
    renderer:null,
    controls:null,
    labelRenderer:null,
    mouse:null,
    move:null,
    data:null,
		children:null,
		parent:null,
		context:null,
    raycaster:null,
    projector:null,
    save_object:null,
		click_object:null,
		right_click_sel_obj:null,
		list_obj:null,
    selected_obj:null,
	Subject:[]
};		
CF3D.init = function (){
			this.scene = new THREE.Scene();//создание сцены для формирования 3d объектов
			this.camera = new THREE.PerspectiveCamera(35, window.innerWidth/window.innerHeight, 1, 1000000);
			this.camera.position.z = 6300; //установление позиции камеры по оси z
			this.camera.position.x = 0; //установление позиции камеры по оси x
			this.camera.position.y = 5000; //установление позиции камеры по оси y

			
		this.container = document.createElement( 'div' );

			
		
			
			this.renderer = new THREE.WebGLRenderer();
			this.renderer.setClearColorHex(0xe5e5e5);
			this.renderer.shadowMapEnabled = false;// появляется тень от источника света
			this.renderer.setSize(window.innerWidth, window.innerHeight);
			this.renderer.shadowMapWidth = 5024;
			this.renderer.shadowMapHeight = 5024;
			this.renderer.shadowMapDarkness = 1;
		document.body.appendChild( this.container );


		this.container.appendChild( this.renderer.domElement );	
		this.renderer.domElement.style.position = "relative";
		this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
//		this.controls = new THREE.TrackballControls( this.camera, this.renderer.domElement );


		
		
				this.labelRenderer = new THREE.CSS2DRenderer();
				this.labelRenderer.setSize( window.innerWidth, window.innerHeight );
				this.labelRenderer.domElement.style.position = 'absolute';
				this.labelRenderer.domElement.style.top = '0';
				this.labelRenderer.domElement.style.pointerEvents = 'none';
				this.container.appendChild( this.labelRenderer.domElement );		
		
			this.projector = new THREE.Projector();
			this.raycaster = new THREE.Raycaster();		
			
			var axisHelper = new THREE.AxisHelper( 5 );
			this.scene.add( axisHelper );
		
		
			this.mouse = new THREE.Vector2();		
			this.move = new THREE.Vector2();
			this.create_light();
			
			
			document.addEventListener('mousemove',function (event){

				CF3D.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
				CF3D.mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;
				CF3D.move.x=event.clientX
				CF3D.move.y=event.clientY

			})
			
			//document.addEventListener('click',function (event){CF3D.object_edit()})
			document.addEventListener('dblclick',function (event){
				if (CF3D.selected_obj && CF3D.selected_obj['sbj_id']) {
					CF3D.open_object(CF3D.selected_obj['sbj_id']);
				}
			});
			
			
			
			//вывод контесктного меню при клике правой кнопкой мыши
			$('body').click(function (){
				$("#pop_up_window_div").remove();
			})			
				
			//событие при клике правой кнопкой мыши
			$('body').bind("contextmenu",function(event){
				if (CF3D.selected_obj && CF3D.selected_obj['sbj_id']) {	
					open_pop_window(event.clientX,event.clientY)
				}
			})			

			
			$(document).keydown(function(event) {CF3D.event_keyboard()})
}

CF3D.open_object = function(id){
	$('#edit_window').dialog('close')
	if (CF3D.right_click_sel_obj) id = CF3D.right_click_sel_obj['sbj_id']
		this.delete_object('all')
		query=$.ajax({
			url: CF3D.base_url+'index.php/qcf3d/open_object/'+id,
			type:'POST',
			});
		query.done(function (response, textStatus, jqXHRб){
			CF3D.right_click_sel_obj=null;
			CF3D.load_data(JSON.parse(response))
		});		

	
}

CF3D.build_total_struct = function (){
	this.delete_object('all')
	query=$.ajax({
		url: CF3D.base_url+'index.php/qcf3d/get_total_struct/',
		type:'POST',
	});
	query.done(function (response, textStatus, jqXHRб){
		levels=new Array;
		CF3D.list_obj=JSON.parse(response);
//		count_children(CF3D.list_obj[0]);
		levels[0]=new Array;
		levels[0].push(CF3D.list_obj[0]);
		CF3D.list_obj.splice (0, 1);
		count_children(levels[0]);

		console.log(levels)
		
		//total_struct()
	});			

}

	function total_struct(){
		for (var i=0; i<levels.length-2;i++){
			for(var j=0; j<levels[i].length;j++){
				CF3D.building_object({'color': 0xfda74a, 'sbj_id': levels[i][j]['id'],'name': levels[i][j]['name'], 'X': j*300, 'Y': i*150, 'Z': 0})
				console.log(i + " - " + j)
			}
		}
	}

var levels=new Array;

function count_children(parent_id){
	if (parent_id.length==0) {
		delete levels[levels.length-1]
		return;	
	}
	else if (levels.length==3) return;
	levels[levels.length]=new Array;
	for (var j=0; j<parent_id.length; j++){
		for (var i=0; i<CF3D.list_obj.length; i++){
			if (CF3D.list_obj[i]['parent']==parent_id[j]['id']) {
				CF3D.building_object({'color': 0xfda74a, 'sbj_id': CF3D.list_obj[i]['id'],'name': CF3D.list_obj[i]['name'], 'X': levels[levels.length-1].length*300, 'Y': (levels.length-1)*550, 'Z': 0})
				levels[levels.length-1].push(CF3D.list_obj[i]);
				CF3D.list_obj.splice (i, 1);
				i--
	//			last_obj_x=levels[levels.length-1].length*300
			}
	//		if (i==0) first_obj_x=levels[levels.length-1].length*300			
		}
	//	parent_id[j].position.x=(first_obj_x-last_obj_x)/2
	}
	
	count_children(levels[levels.length-1])

/*	levels[curObj['id']]=new Array;
	for (var i=0; i<CF3D.list_obj.length; i++){
		if (CF3D.list_obj[i]['parent']==curObj['id']) {
			levels[curObj['id']].push(CF3D.list_obj[i]);
			count_children(CF3D.list_obj[i])
		}
	}
	if (levels[curObj['id']].length==0) delete levels[curObj['id']];*/
};

CF3D.object_edit = function (){
	if (!CF3D.right_click_sel_obj) return;
	var dialog = CFUtil.dialog.create("edit_window",
	{
		title: langs.get_term("txt_data_object"),
		autoOpen: false,
		height: 'auto',
		width: 'auto',
		position: 'left, top',
	});
	if ( dialog ){
		var data = {};
		data['sbj_id']=CF3D.right_click_sel_obj['sbj_id'];
		html = $.ajax({
			url: CF3D.base_url+"index.php/qcf3d/ajax_data_object/",
			type: "POST",
			data: data,
		}).done(function (response, textStatus, jqXHRб){
			data_obj=JSON.parse(response);
			content='<table class="table">';
				content += '<tr><td><label>'+langs.get_term('txt_id')+'</label></td><td>'+data_obj[0]['id']+'<td></tr>';
				content += '<tr><td><label>'+langs.get_term('txt_name')+'</label></td><td>'+data_obj[0]['name']+'<td></tr>';
				content += '<tr><td><label>'+langs.get_term('txt_parent')+'</label></td><td>'+data_obj[0]['parent_name']+'<td></tr>';
			content+='</table>';
			content+='<button type="button" onclick="CF3D.open_object('+data_obj[0]['id']+')">'+langs.get_term('txt_open_object')+'</button>';
			$(dialog).html(content);
		});
	}

}



CF3D.load_data = function (data){

	if (data.length==0) return;
		CF3D.Subject= new Array()
		i=0;
	var d_y=500;

/*	var d_x=1000;
	var d_y=1000;
	var d_z=600;
	this.data=data['data_obj'];
	this.children=data['children'];
	this.parent=data['parent'];
	var row=parseInt(Math.sqrt(this.children.length))
	this.building_object({'color': 0xe83425, 'sbj_id': this.data['id'], 'name': this.data['name'], 'X': 0, 'Y': d_y, 'Z': 0})
	for (var j in this.parent){
		this.building_object({'color': 0xfda74a, 'sbj_id': this.parent[j]['id'],'name': this.parent[j]['name'], 'X': this.Subject[0].position.x, 'Y': this.Subject[0].position.y + j*d_y+d_y, 'Z': this.Subject[0].position.z})
		this.connect_branch(this.Subject[this.Subject.length-2],this.Subject[this.Subject.length-1])
	}
	for (var j in this.children){
		this.building_object({'color': 0x009d28, 'sbj_id': this.children[j]['id'],'name': this.children[j]['name'], 'X': 0+((j%row)*d_x), 'Y': 0, 'Z': 0+(parseInt(j/row)*d_z)})
		this.connect_branch(this.Subject[0],this.Subject[parseInt(j)+1])
	}*/

	this.data=data['data_obj'];
	this.children=data['children'];
	this.parent=data['parent'];
	if (data['context']) this.context=data['context'];
	var d_grad=(2*Math.PI/this.children.length)
	var radius = 500*Math.sqrt(this.children.length);
	this.building_object({'color': 0xe83425, 'sbj_id': this.data['id'], 'name': this.data['name'], 'X': 0, 'Y': d_y, 'Z': 0})
	for (var j in this.parent){
		this.building_object({'color': 0xfda74a, 'sbj_id': this.parent[j]['id'],'name': this.parent[j]['name'], 'X': this.Subject[0].position.x, 'Y': this.Subject[0].position.y + j*d_y+d_y, 'Z': this.Subject[0].position.z})
		this.connect_branch(this.Subject[this.Subject.length-2],this.Subject[this.Subject.length-1])
	}
	for (var j in this.children){
		this.building_object({'color': 0x009d28, 'sbj_id': this.children[j]['id'],'name': this.children[j]['name'], 'X': Math.sin(d_grad*j)*radius, 'Y': 0, 'Z': Math.cos(d_grad*j)*radius})
		this.connect_branch(this.Subject[0],this.Subject[this.parent.length+parseInt(j)+1])
	}

}



CF3D.run = function (){
	this.render();
}

CF3D.delete_object= function (obj){
	if (obj=="all") {
		while( CF3D.scene.children.length > 0 ) {
		
			var object = CF3D.scene.children[ 0 ];
			object.parent.remove( object );

		}
		$('.label').remove()
	}
	else{
		
		if ($('#object_id').val()=="") alert('Не выбран объект')
		
		for (var i=0; i<CF3D.scene.children.length;i++)	{
			if ((CF3D.scene.children[i].element && CF3D.scene.children[i].element.id==$('#object_id').val()) || CF3D.scene.children[i].id==$('#object_id').val()){
				delete_lines(CF3D.scene.children[i].id)
				CF3D.scene.remove(CF3D.scene.children[i])
				i--
			}
		}
		$('#list_object [value='+$('#object_id').val()+']').remove()
		clear_select()
	}
}

CF3D.event_keyboard=function() {
	
	if (!$('select').is(":focus")){
				
		if( event.keyCode === 27 ) clear_select()
		else if ( event.keyCode == 37 && save_object && event.ctrlKey) {$('#object_position_z').val(parseInt($('#object_position_z').val())-100); save_object_change()} //arrow left keyup
		else if ( event.keyCode == 39 && save_object && event.ctrlKey) {$('#object_position_z').val(parseInt($('#object_position_z').val())+100); save_object_change()} //arrow right keyup
		else if ( event.keyCode == 37 && save_object) {$('#object_position_x').val(parseInt($('#object_position_x').val())-100); save_object_change()} //arrow left keyup
		else if ( event.keyCode == 39 && save_object) {$('#object_position_x').val(parseInt($('#object_position_x').val())+100); save_object_change()} //arrow right keyup
		else if ( event.keyCode == 38 && save_object) {$('#object_position_y').val(parseInt($('#object_position_y').val())+100); save_object_change()} //arrow up keyup
		else if ( event.keyCode == 40 && save_object) {$('#object_position_y').val(parseInt($('#object_position_y').val())-100); save_object_change()} //arrow down keyup
		else if ( event.keyCode == 67 && event.ctrlKey && save_object) {building_object({'color': save_object.currentHex.color.getHex(), 'name': '\''+save_object.name+'\'', 'X': (parseInt(save_object.position.x)+100), 'Y': (parseInt(save_object.position.y)+100), 'Z': (parseInt(save_object.position.z)+100)})} //arrow down keyup
		else if ( event.keyCode == 46 && event.altKey && save_object) {delete_lines(save_object.id)} //arrow down keyup
		else if ( event.keyCode == 46 && save_object) {delete_object()} //arrow down keyup
	
	}	
};
		
		
		

			
CF3D.create_light = function (){
/*
	var light = new THREE.HemisphereLight( 0xffffff, 0x989898, 1  );
	light.position.set( 1, 1, 1 );
	light.shadowMapWidth=2048;
	light.shadowMapHeight=2048;
	this.scene.add( light );	
*/
/*
			var light = new THREE.PointLight( 0xffffff, 1, 55000 );
			light.position.set(500, 5500, 1400 );
			light.shadowMapWidth=5024;
			light.shadowMapHeight=5024;
			this.scene.add( light );	
*/
	var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
	directionalLight.position.set( CF3D.camera.position.x, CF3D.camera.position.y, CF3D.camera.position.z );
	this.scene.add( directionalLight );


	
}
		

	var root = new THREE.Object3D();
	var i=0
	CF3D.building_object = function(elm){
		if (this.scene.children.length==0){CF3D.create_light(); i=0}
		var geometry1 = new THREE.SphereGeometry(100,40,40);//задание тип фигуры - сфера, (радиус, количество меридиан, количество параллелей)
		
		if(elm['name'].indexOf('Россети') + 1) {
			var texture= THREE.ImageUtils.loadTexture(CF3D.base_url+'img/logotip_rosseti(texture).png')
			texture.anistropy=8;
			var material1 = new THREE.MeshPhongMaterial({map:texture, emissive: 0xffffff})
		}
		else{
			var material1 = new THREE.MeshPhongMaterial({color:elm['color'], emissive: elm['color']})
		}
		
		this.Subject[i] = new THREE.Mesh (geometry1,material1)
		this.scene.add(this.Subject[i])
		this.Subject[i].name=elm['name'];
		this.Subject[i].select=true;
		this.Subject[i].position.x=elm['X'];			
		this.Subject[i].position.y=elm['Y'];
		this.Subject[i].position.z=elm['Z'];
		this.Subject[i].lines=[];	
		this.Subject[i].sbj_id=elm['sbj_id']	
	
		
			var text = document.createElement( 'div' );
			text.className = 'label';
			text.id = this.Subject[i].id;
			text.style.color = 'blue';
			text.textContent = this.Subject[i].name;

			var label = new THREE.CSS2DObject( text );
//			label.position.copy( this.Subject[i].position );
			label.position.x = this.Subject[i].position.x;
			label.position.y = this.Subject[i].position.y+100;
			label.position.z = this.Subject[i].position.z;
			this.scene.add( label );	
			i++
	}
	
		//содениние объектов с помощью произвольных линий			
	CF3D.connect_branch = function(start_obj,end_obj){
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

		var material2 = new THREE.MeshLambertMaterial( { color: 0xffffff, wireframe: false } );

		var mesh = new THREE.Mesh( geometry, material2 );
		mesh.select=true
		mesh.from=start_obj.id
		mesh.to=end_obj.id
		
		start_obj.lines.push(mesh.id)
		end_obj.lines.push(mesh.id)
		
		this.scene.add( mesh );

	}
		// конец процедуры

/*		//вывод контесктного меню при клике правой кнопкой мыши
		$('body').click(function (){$("#pop_up_window_div").remove();})			
			
		//событие при клике правой кнопкой мыши
		$('body').bind("contextmenu",function(event){
			open_pop_window(event.clientX,event.clientY)
		})			*/
			
		//функция вывода контекстного меню	
	open_pop_window = function(x,y){
		
		if (CF3D.selected_obj)CF3D.right_click_sel_obj=CF3D.selected_obj;

		$("#pop_up_window_div").remove();
		var pop_up_window_div = '<div id="pop_up_window_div" class="pop_up_window" style="position:absolute;left:'+x+'px;top:'+y+'px;"></div>';
		$("body").append(pop_up_window_div);
		var pop_menus = '';
		for (var j in CF3D.context){
		
			pop_menus += '<hr style= "padding:1px;margin:3px;">';
				
				pop_menus += '<li class="pop_up_item" onclick="'+CF3D.context[j]['on_click']+'">';
				pop_menus += '<span class="'+CF3D.context[j]['image']+'"></span>&nbsp;';
				pop_menus += langs.get_term(CF3D.context[j]['name']);
				pop_menus += '</li>';
		
		}
		$("#pop_up_window_div").html(pop_menus);
	} 			
		//конец
			
			
			$('#list_object').change(function (event){
				if ($(this).val()==""){clear_select()}
				else {
					this.selected_obj=find_object_scene($(this).val())
					select_object()
					this.selected_obj=null
				}
			})
			

			
		



/*			document.addEventListener('mousedown',function (event){ 

				move_object=true;
			})
			document.addEventListener('mouseup',function (event){move_object=false})
			document.addEventListener('click',function (event){select_object()})*/

			save_object_change = function (){
				if ($('#object_id').val()=="") {
					alert("Объект не выбран")
					return
				}
				if (save_object){
					save_object.id=$('#object_id').val()
					save_object.name=$('#object_name').val()
					
					if ($('#color_object').val()!="")save_object.material=new THREE.MeshLambertMaterial({color: parseInt($('#color_object').val())})
					
					if ((save_object.position.x!=parseInt($('#object_position_x').val())) || (save_object.position.y!=parseInt($('#object_position_y').val())) || (save_object.position.z=parseInt($('#object_position_z').val()))){
						save_object.position.x=parseInt($('#object_position_x').val())
						save_object.position.y=parseInt($('#object_position_y').val())
						save_object.position.z=parseInt($('#object_position_z').val())					
						change_lines(save_object)
						for (var i=0; i<this.scene.children.length;i++)	{
							if ((this.scene.children[i].element && this.scene.children[i].element.id==$('#object_id').val()) ){
								this.scene.children[i].position.copy(save_object.position)
								return;
							}
						}
					}
				}
			}

		//изменение координат линий
		function change_lines(obj){
			if (!obj.lines) return
			var lines=obj.lines;
			var connecter=[]
			for (var i=0;i<this.scene.children.length; i++){
				if ($.inArray(this.scene.children[i].id, lines)>=0){
					if (this.scene.children[i].from==obj.id) connecter.push(find_object_scene(this.scene.children[i].to))
					else connecter.push(find_object_scene(this.scene.children[i].from))
					delete connecter[connecter.length - 1].lines.splice($.inArray(this.scene.children[i].id,connecter[connecter.length - 1].lines),1);
					this.scene.remove(this.scene.children[i])
					i--
				}
			}
			obj.lines=[]
			for (i=0; i<connecter.length; i++){
				connect_branch(obj,connecter[i])
			}
		}
		//конец
			
			// фнукция поиска объекта по id
			function find_object_scene (id){
				for (i=0;i<this.scene.children.length; i++){
					if (this.scene.children[i].id==id) return this.scene.children[i]
				}
			}	
			// конец
			
			var x,y
			document.addEventListener('mousemove',function (event){

				CF3D.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
				CF3D.mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;
				CF3D.move.x=event.clientX
				CF3D.move.y=event.clientY

			})

			// функция снятия выделенных объектов 
			clear_select = function (){
				$('.data_selection').val('')
				document.getElementById('color_object').options[0].selected=true
				save_object=null
			}
			// конец


			
		//удаление линий
		function delete_lines(id){
			obj=find_object_scene(id)
			if (!obj.lines) return
			var  lines=obj.lines;
			for (var i=0;i<this.scene.children.length; i++){
				if ($.inArray(this.scene.children[i].id, lines)>=0){
					this.scene.remove(this.scene.children[i])
					i--
				}
			}
		}
		//конец
			

		
		
		CF3D.render = function () {
			//this.controls.update()
			
			$('#'+$('#object_id').val()).html($('#object_name').val());
			
			
			var vector = new THREE.Vector3( CF3D.mouse.x, CF3D.mouse.y, 1 );

			CF3D.projector.unprojectVector( vector, CF3D.camera );

			CF3D.raycaster.set( CF3D.camera.position, vector.sub( CF3D.camera.position ).normalize() );
			var intersects = CF3D.raycaster.intersectObjects( CF3D.scene.children );
			if ( intersects.length >0 ) {

				if ( CF3D.selected_obj != intersects[ 0 ].object ) {

					if ( CF3D.selected_obj )	CF3D.selected_obj.material=CF3D.selected_obj.currentHex;
					if (intersects[ 0 ].object.select==true) {
						CF3D.selected_obj = intersects[ 0 ].object;
						CF3D.selected_obj.currentHex = CF3D.selected_obj.material;
						CF3D.selected_obj.material=new THREE.MeshLambertMaterial({color: 0xb0cdcb});

					}
					
					
				}


			}	
			else {

				if ( CF3D.selected_obj ) CF3D.selected_obj.material= CF3D.selected_obj.currentHex ;

				CF3D.selected_obj = null;
			
			}


			requestAnimationFrame(CF3D.render);
		
			CF3D.renderer.render(CF3D.scene, CF3D.camera);
			CF3D.labelRenderer.render( CF3D.scene, CF3D.camera );
				
		};

		//render();		
