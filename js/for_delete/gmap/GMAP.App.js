/* 

 */
 


var GMAP = {
	base_url: null, //переменная для хранения адреса сайта
	db_objects: null, //переменная для хранения адреса сайта
	data: null, //переменная для хранения адреса сайта
};

/*	
 * функция инициализации
 * Vadim GRITSENKO
 * 20141105
 */
var default_parameters_dialog = {
		title: 'Subjects', 
		autoOpen: false,
		height: "auto",
		position: "right top",
		width: 250,
		modal: false		
	};

var map;
var circles = new Array();
var subjects = new Array();
var label_name = new Array();
var route_message, map, decorator, animatedMarker, label_message, popup,selected_object, interval_select;
GMAP.init = function (){

/*
	geocoder = new google.maps.Geocoder()
	var mapOptions = {
	//	center: new google.maps.LatLng(55.5461485377552, 39.73947831792769), //координаты Ростова-на-Дону
		center: new google.maps.LatLng(55.755826, 37.6173), //координаты Ростова-на-Дону
		zoom: 5,
		mapTypeId: google.maps.MapTypeId.ROADMAP    
	};
	map = new google.maps.Map(document.getElementById("map"),mapOptions);

	$('#map').height(window.innerHeight - $('#head_panel').height() - $('#sub_panel').height());
	
	window.addEventListener( 'resize', onWindowResize, false );
	google.maps.event.addListener(map, 'zoom_changed', getZoomMap);
*/

		map = new L.Map('map', {center: new L.LatLng(55.755826, 37.6173), zoom: 5, zoomAnimation: true });
		var osm = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
		var other_map = new L.TileLayer("http://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png", {
				attribution: '"Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>"',
				id: 'examples.map-i875mjb7'
			});
		var yndx = new L.Yandex();
		var googleLayer_4 = new L.Google('HYBRID');// комбинация обычной карты и снимков со спутника.
		var googleLayer_3 = new L.Google('SATELLITE');// снимки Google Планета Земля, сделанные со спутника.
		var googleLayer_2 = new L.Google('TERRAIN');// физическая карта, основанная на информации о ландшафте.
		var googleLayer_1 = new L.Google('ROADMAP');// дорожная карта, используемая по умолчанию.
//		var googleLayer = new L.Google('ROADMAP');// дорожная карта, используемая по умолчанию.

		
		
		var dgis = new L.DGis();
			
		map.addLayer(osm);
		
		start_zoom = map.getZoom();
		
//		map.addControl(new L.Control.Layers({'OSM':osm, "Yandex":yndx, "Google":googleLayer, "GIS":dgis, "MapBox":other_map}));
		map.addControl(new L.Control.Layers({'OSM':osm, "Yandex":yndx, "Google road":googleLayer_1, "Google terrain":googleLayer_2, "Google satelite":googleLayer_3, "Google hybrid":googleLayer_4, "GIS":dgis, "MapBox":other_map}));
		
		
		window.addEventListener( 'resize', onWindowResize, false );
//		google.maps.event.addListener(map, 'zoom_changed', getZoomMap);

		
//		map.on('zoomstart', function (){start_zoom = map.getZoom();});
		map.on('zoomend', getZoomMap);
		map.on('popupclose', delete_route_message);
		
	/*
	var map = L.map('map').setView([55.755826, 37.6173], 7);
//	L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
	
	L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: 'Map data &copy; <a rel="nofollow" href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a rel="nofollow" href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a rel="nofollow" href="http://cloudmade.com">CloudMade</a>',
		id: 'examples.map-i875mjb7'
	}).addTo(map);

//	var map1 = L.map('map').setView([51.505, -0.09], 13);	

/*
	L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a rel="nofollow" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
//		id: 'examples.map-i875mjb7'
	}).addTo(map);	
*/

}
//конец функции


/*	
 * функция загрузки объектов
 * Vadim GRITSENKO
 * 20141105
 */
GMAP.update_structure = function(objects){
	if (!QCValidation.check_data( objects, "array" )){ return; }

	level=(map.getZoom()-4)+1;
	for (var i in objects) {
		//добавление уровня объектов
		if ( parseInt(objects[i]['level']) <= level && !circles[objects[i]['id']]){
			if ( objects[i].b && objects[i].k ){
		//		objects[i]['color'] = objects[i]['color'] ? objects[i]['color'] : '#000000';
				var object = {
				
						strokeColor: objects[i]['color'],
						strokeOpacity: 1,
						strokeWeight: 1,
						fillColor: objects[i]['color'],
						fillOpacity: 0.5,
						name: objects[i]['name'],
						fk_type: objects[i]['fk_type'],
						id: objects[i]['id'],
						b: objects[i]['b'],
						k: objects[i]['k'],
						map: map,
						level: objects[i].level,
						radius: 1500000/Math.pow(map.getZoom(),3),
						className_label: "label-name-object",
						icon: 'img/gmap/office-building.png'
						
					}
				circles[objects[i]['id']] = objects[i]['color'] ? add_circle(object) : add_icon(object);
				circles[objects[i]['id']].label_name = GMAP.add_label_name(object);
				circles[objects[i]['id']].data_table = object;
				circles[objects[i]['id']].on('dblclick', function (){GMAP.open_window_object(this);});
				
				$('#list_objects [object_id='+objects[i]['id']+']').removeClass('disabled').attr('onclick','GMAP.set_center_map('+objects[i]['b']+','+objects[i]['k']+')');
			}
		}
		//удаление уровня объектов
		else if (parseInt(objects[i]['level']) > level && circles[objects[i]['id']]) {
			map.removeLayer(circles[objects[i]['id']].label_name);
			map.removeLayer(circles[objects[i]['id']]);
			delete circles[objects[i]['id']];
			$('#list_objects [object_id='+objects[i]['id']+']').addClass('disabled').attr('onclick','');
		}
		//прерывание обработки выполнения цикла построения структуры
/*		else if (parseInt(objects[i]['level']) == level+2){
			break;
		}
*/	}
}
//конец функции

/*	
 * функция добавления круга
 * Vadim GRITSENKO
 * 20141105
 */
function add_circle (options){
	var circle = L.circle([options.b, options.k], options.radius, {
		color: options.strokeColor,
		fillColor: options.fillColor,
		fillOpacity: options.fillOpacity,
		id: options.id,
		b: options.b,
		k: options.k,
		name: options.name,
		level: options.level
	}).addTo(map);
	circle.bindPopup(options['name']);
	return circle;
}
//конец функции

/*
 * функция добавления метки наименований
 * Vadim GRITSENKO
 * 20141105
 */
GMAP.add_label_name = function (options){
	label_name = new L.Label();
	label_name.setContent("<b>"+options.name+"</b>");
	label_name.setLatLng([options.b, options.k]);
	label_name.options.className = options.className_label;
	map.showLabel(label_name);	
	return label_name;
}
//конец функции

/*
 * функция изменения ширины страницы
 * Vadim GRITSENKO
 * 20141105
 */
function onWindowResize() {
	$('#map').height(window.innerHeight - $('#head_panel').height() ); //- $('#sub_panel').height()
	$('#div_data').height($('#map').height());
}
// конец функции

/*
 * функция изменения ширины страницы
 * Vadim GRITSENKO
 * 20141105
 */
function getZoomMap() {
	if ($('#show_objects').prop("checked")) GMAP.update_structure(GMAP.data.data_table);
}
// конец функции

/*
 * функция изменения ширины страницы
 * Vadim GRITSENKO
 * 20141107
 */
GMAP.delete_objects = function() {
	i = 0;
	while(i<circles.length){
		if (circles[i]) {
			$('#list_objects [object_id='+circles[i].options.icon.options.id+']').addClass('disabled');
			map.removeLayer(circles[i].label_name);
			map.removeLayer(circles[i]);
		}
		circles.splice(i,1);
	}
}
// конец функции

/*
 * функция формирования списка объектов
 * Vadim GRITSENKO
 * 20141120
 */
GMAP.add_list_object = function(objects){
	if (!QCValidation.check_data( objects, "array" )){ return; }
	html_text = '';
	for (var i in objects){
		html_text += '<a href="javascript:void(0)" class="list-group-item disabled" object_id='+objects[i]['id']+' onclick="" style="font-size: 13px"><span class="glyphicon glyphicon-stats" aria-hidden="true"></span> '+objects[i]['name'].slice(0,20)+'</a>';
	}
	$('#list_objects').html(html_text);
}
// конец функции

/*
 * функция изменения центрирования карты
 * Vadim GRITSENKO
 * 20141120
 */
GMAP.set_center_map = function ( b, k ){
	if (!QCValidation.check_data( b, "number" )){ return; }
	if (!QCValidation.check_data( k, "number" )){ return; }
	
	end_blind();
	
	map.setView([ b, k ], map.getZoom() );
		var object = {
		
			strokeColor: 'red',
			strokeOpacity: 1,
			strokeWeight: 1,
			fillColor: 'red',
			fillOpacity: 0.1,
			name: "selected object",
			fk_type: null,
			id: null,
			b: b,
			k: k,
			map: map,
			level: 0,
			radius: 200000/map.getZoom(),
			
		}
	selected_object = add_circle(object);
	
	i = 1;
	interval_select = setInterval(start_blind,500);
	
}
// конец функции

/*
 * функция выключения анимации выделения объекта
 * Vadim GRITSENKO
 * 20141203
 */
function end_blind (){
	if (selected_object)
	{
		map.removeLayer(selected_object);
		selected_object = null;
	}
	clearInterval(interval_select);
}
// конец функции

/*
 * функция включения анимации выделения объекта
 * Vadim GRITSENKO
 * 20141203
 */
function start_blind (){
	i++ % 2 == 0 ? selected_object.setRadius(selected_object.getRadius()/2) : selected_object.setRadius(selected_object.getRadius()*2)
	if( i>=10 ){ 
		end_blind();
	}
}
// конец функции

/*
 * функция формирования списка сообщений
 * Vadim GRITSENKO
 * 20141120
 */
GMAP.add_list_message = function(messages){
	if (!QCValidation.check_data( messages, "object" )){ return; }
	html_text = '';
	for (var event in messages){
		html_text += '<a href="javascript:void(0)" class="list-group-item" onclick="GMAP.show_event(\''+event+'\')"><span class="glyphicon glyphicon-file" aria-hidden="true"></span> '+messages[event]['name']+'</a>';
	}
	$('#list_messages').html(html_text);
}
// конец функции

/*
 * функция вывода окна данных сообщения
 * Vadim GRITSENKO
 * 20141121
 */
GMAP.open_window_message = function (event, numb_message){
	window_open = window.open(GMAP.base_url+'index.php/gmap/open_message/'+event+'/'+numb_message,'QuaSy','left=530,width=600,height=300,resizable=yes,location=no,modal=yes');
	window_open.focus();
}
// конец функции

/*
 * функция вывода окна данных объекта
 * Vadim GRITSENKO
 * 20141128
 */
GMAP.open_window_object = function (object){
	if (!QCValidation.check_data( object.data_table, "object" )){ return; }

	window_open = window.open(GMAP.base_url+'index.php/gmap/open_data_object/'+object.data_table.id,'QuaSy','left=530,width=600,height=400,resizable=yes,location=no,modal=yes');
	window_open.focus();
}
// конец функции

/*
 * функция построения и вывода данных о событии
 * Vadim GRITSENKO
 * 20141121
 */
GMAP.show_event = function (event){
	if (!QCValidation.check_data( event, "string" )){ return; }

	delete_subjects();
	delete_route_message();

	if (event!="" && GMAP.data.data_event[event]['message'].length>0){
		messages = GMAP.data.data_event[event]['message'];
		content_message = '<div class="list-group">';
		list_subjects = '<div class="list-group">';
		for (var  i in messages){
			if (!subjects[messages[i]['from']['id']]){
				GMAP.add_subject(messages[i]['from'], event);
				list_subjects += '<a href="javascript:void(0)" class="list-group-item" onclick="GMAP.messages_subject(\''+event+'\','+messages[i]['from']['id']+',\''+messages[i]['from']['name']+'\')"><span class="glyphicon glyphicon-user" aria-hidden="true"></span> '+messages[i]['from']['name']+'</a>';
			}
			if (!subjects[messages[i]['to']['id']]){
				GMAP.add_subject(messages[i]['to'], event);
				list_subjects += '<a href="javascript:void(0)" class="list-group-item" onclick="GMAP.messages_subject(\''+event+'\','+messages[i]['to']['id']+',\''+messages[i]['from']['name']+'\')"><span class="glyphicon glyphicon-user" aria-hidden="true"></span> '+messages[i]['to']['name']+'</a>';
			}
			content_message += '<a href="javascript:void(0)" class="list-group-item" onclick="GMAP.show_data_message(\''+event+'\','+i+')"><span class="glyphicon glyphicon-send" aria-hidden="true"></span> '+messages[i]['message'].slice(0,30)+'...</a>';
		}
		messages +='</div>';
		content_message +='</div>';
		
//		функция скрывания панели вывода данных события
//		hide_show_data();
	}
	else {
		list_subjects = langs.get_term('no_subjects');
		content_message = langs.get_term('no_messages');
	}

	content_message += '<div id="container" style="height: auto; width: auto;"></div>';

	parameters_dialog = JSON.parse(JSON.stringify(default_parameters_dialog));
	parameters_dialog.title = 'Subjects';
	parameters_dialog.position = "right top";
	parameters_dialog.width = 250;
	create_dialog(parameters_dialog, list_subjects, "show_subjects");

	parameters_dialog = JSON.parse(JSON.stringify(default_parameters_dialog));
	parameters_dialog.title = 'Messages';
	parameters_dialog.position = "right";
	parameters_dialog.width = 300;
	create_dialog(parameters_dialog, content_message, "show_messages");

}
// конец функции

/*	
 * функция добавления субъекта
 * Vadim GRITSENKO
 * 20141105
 */
GMAP.add_subject = function (data_object, event){
	if (!QCValidation.check_data( event, "string" )){ return; }

	var options = {
			strokeColor: '#000000',
			strokeOpacity: 1,
			strokeWeight: 1,
			fillColor: '#000000',
			fillOpacity: 0.5,
			name: data_object['name'],
			fk_type: 0,
			id: data_object['id'],
			b: data_object['b'],
			k: data_object['k'],
			event: event,
			map: map,
			radius: 10000,
			icon: 'img/conframe_bi/subject.png',
			className_label: "label-name-subject",
		}
	subjects[data_object['id']] = add_icon(options);
	subjects[data_object['id']].on('click', function(){GMAP.messages_subject(options.event,options.id)})
	subjects[data_object['id']].label_name = GMAP.add_label_name(options);

}
// конец функции

/*	
 * функция добавления иконки
 * Vadim GRITSENKO
 * 20141105
 */
function add_icon (options){
	if (!QCValidation.check_data( options, "object" )){ return; }

	var LeafIcon = L.Icon.extend({
			options: {
//				shadowUrl: 'img/shadow.png',
				iconSize:     [24, 24],
				shadowSize:   [51, 37],
				iconAnchor:   [15, 15],
				shadowAnchor: [16, 37],
				popupAnchor:  [0, 0],
				name: options['name'],
				id: options['id']
			}
		});
	subject_icon = new LeafIcon({iconUrl: GMAP.base_url + options.icon});
	circle = L.marker([options.b, options.k], {icon: subject_icon}).addTo(map);
	circle.label_name = label_name;
	return circle;
}
//конец функции

/*
 * функция удаление субъектов с карты
 * Vadim GRITSENKO
 * 20141121
 */
function delete_subjects() {
	i = 0;
	while( i<subjects.length){
		if (subjects[i]){
			map.removeLayer(subjects[i].label_name);
			map.removeLayer(subjects[i]);
		}
		subjects.splice(i,1);
	}
}
// конец функции

/*
 * функция создания диалогового окна
 * Vadim GRITSENKO
 * 20141121
 */
function create_dialog(parameters,content,id){
	var dialog = CFUtil.dialog.create(id,parameters);
	if ( dialog ){
		$(dialog).html(content);
	}
}
// конец функции

/*	
 * функция добавления круга
 * Vadim GRITSENKO
 * 20141121
 */
GMAP.show_data_message = function (event, numb_message){
	if (!QCValidation.check_data( event, "string" )){ return; }
	if (!QCValidation.check_data( numb_message, "number" )){ return; }

	data={
			out_b: GMAP.data.data_event[event]['message'][numb_message]['from']['b'],
			out_k: GMAP.data.data_event[event]['message'][numb_message]['from']['k'],
			to_b: GMAP.data.data_event[event]['message'][numb_message]['to']['b'],
			to_k: GMAP.data.data_event[event]['message'][numb_message]['to']['k'],
			text: GMAP.data.data_event[event]['message'][numb_message]['message'],
			start_time: GMAP.data.data_event[event]['message'][numb_message]['start_time'],
			end_time: GMAP.data.data_event[event]['message'][numb_message]['end_time'],
		};
		
	popup = L.popup().setLatLng([(data.out_b+data.to_b)/2, (data.out_k+data.to_k)/2]).setContent('<a href="javascript:void(0)" class="list-group-item" onclick="GMAP.open_window_message(\''+event+'\','+numb_message+')"><b>Message</b><br>'+data.text.slice(0,30)+'...</a>').openOn(map);
	popup.className = "label-message";	
		
	route_message = add_polyline(data);
}
//конец функции

/*
 * функция создания диалогового окна
 * Vadim GRITSENKO
 * 20141121
 */
function add_polyline(data){

	polyline = L.polyline([[data.out_b, data.out_k],[(data.out_b+data.to_b)/2, (data.out_k+data.to_k)/2],[data.to_b,data.to_k]],
		{color: '#57a71c',
		weight: 5,
		opacity: 1,
		dashArray:'10,10',
		smoothFactor: 0}).addTo(map);

	decorator = L.polylineDecorator(polyline, {
        patterns: [
            // define a pattern of 10px-wide dashes, repeated every 20px on the line 
            {offset: 0, repeat: '100px', symbol: new L.Symbol.ArrowHead({
				color: 'red',
				pixelSize: 15,
				polygon: false,
				pathOptions: {
					stroke: true
				}
			})}
        ]
    }).addTo(map);
	
	map.fitBounds(polyline.getBounds());

	return polyline;
}
// конец функции

/*
 * функция создания диалогового окна
 * Vadim GRITSENKO
 * 20141121
 */
function delete_route_message(){
	if (route_message) map.removeLayer(route_message);
	if (decorator) map.removeLayer(decorator);
	if (label_message) map.removeLayer(label_message);
	if (popup) popup._close();
}
// конец функции

/*
 * функция создания диалогового окна
 * Vadim GRITSENKO
 * 20141121
 */
GMAP.messages_subject = function (event, id){

	GMAP.set_center_map(subjects[id].getLatLng().lat,subjects[id].getLatLng().lng);
	content = '<div style="width: 200px" class="list-group">';
	messages_subject = GMAP.data.data_event[event]['message'];
	messages = {
			output: 0,
			input: 0,
			name: subjects[id].options.icon.options.name,
		};
		
	for (var i in messages_subject){
		if (messages_subject[i]['to']['id']==id || messages_subject[i]['from']['id']==id){
			content += '<a href="javascript:void(0)" class="list-group-item" onclick="GMAP.open_window_message(\''+event+'\','+i+')"><b style="color:#339966;">'+messages_subject[i]['from']['name']+'</b><br>';
			content += messages_subject[i]['message'].slice(0,30)+'...<br>';
			content += '<b style="color:#d94a39;">'+messages_subject[i]['to']['name']+'</b><br></a>';
			if (messages_subject[i]['to']['id']==id) {messages.input++}
			else {messages.output++}
		}
	}
	content += '</div>';
//	content += '<div id="container" style="height: 250px; "></div>';

	subjects[id].bindPopup("<b>"+subjects[id].options.icon.options.name+"</b><br>"+content).openPopup();
	
//	load_container(messages);

}
// конец функции

/*
 * функция отправки сообщения
 * Vadim GRITSENKO
 * 20141121
 */
GMAP.send_message = function (){
	
	GMAP.show_event('event1');
	generate_message(63, 35.9779,70, 65.0654);

}
//конец функции

/*
function func(){ 
	$('#div_data').fadeOut(100).fadeIn(100);
	setInterval(func,200); 
} 
func()
*/


/*
 * функция очистки карты от субъектов
 * Vadim GRITSENKO
 * 20141121
 */
GMAP.clear_subjects = function (){
	
	delete_route_message();
	delete_subjects();
	$('[role=dialog]').fadeOut(1000);

}
//конец функции

/*
 * функция лдя формиварония и отправления сообщения онлайн
 * Vadim GRITSENKO
 * 20141127
 */
function generate_message(out_b,out_k,to_b,to_k){
	
	delete_route_message();
	
	polyline = L.polyline([[out_b, out_k],[to_b, to_k]],
		{color: 'blue',
		weight: 3,
		opacity: 0.7,
		smoothFactor: 0}).addTo(map);//.showLabel()
	
	GMAP.set_center_map((out_b+to_b)/2,(out_k+to_k)/2);

	var mailIcon = L.icon({
		iconUrl: GMAP.base_url+'img/gmap/send_message2.png',
		iconSize: [50, 50],
		iconAnchor: [12, 39],
		shadowUrl: null
	});	
	
    animatedMarker = L.animatedMarker(polyline.getLatLngs(), {
		icon: mailIcon,
		autoStart: false,
		onEnd: function() {
			map.removeLayer(polyline);
			map.removeLayer(animatedMarker);
		},
		distance: 300000,  // meters
		interval: 1500, // milliseconds
    });

	map.addLayer(animatedMarker);

	$(animatedMarker._icon).hide().fadeIn(500, function(){
      animatedMarker.start();
    });

    return animatedMarker;

}
//конец функции

function load_container(data){
		
		$('#container').highcharts({
			chart: {
				type: 'bar'
			},
			title: {
				text: ['Messages']
			},
			subtitle: {
				text: ''
			},
			xAxis: {
				categories: [''],
				title: {
					text: null
				}
			},
			yAxis: {
				min: 0,
				title: {
					text: 'Count',
					align: 'high'
				},
				labels: {
					overflow: 'justify'
				}
			},
			tooltip: {
				valueSuffix: ' messages'
			},
			plotOptions: {
				bar: {
					dataLabels: {
						enabled: true
					}
				}
			},
			legend: {
				layout: 'vertical',
				align: 'right',
				verticalAlign: 'top',
				x: 10,
				y: 25,
				floating: true,
				borderWidth: 0.5,
				backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
				shadow: true
			},
			credits: {
				enabled: false
			},
			series: [{
				name: 'Input',
				data: [data.input]
			}, {
				name: 'Output',
				data: [data.output]
			}]
		});

}