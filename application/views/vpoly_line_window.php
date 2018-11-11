<?php
/**
 * Created by PhpStorm.
 * User: vprikhodko
 * Date: 08.11.2018
 * Time: 10:29
 */
	if ( ! defined('BASEPATH')) exit('No direct script access allowed');
?>
<?php include("header.php");?>

<html>
    <!-- <link type='text/css' rel='stylesheet' href='<?php echo base_url(); ?>css/maps.css'> -->
<div class="panel panel-default">
    <div id="map"></div>
<!--    <div class="tool_bar">-->
<!--        <button type="button" onclick="save_coor()">Сохранить</button>-->
<!--        <button type="button" onclick="clear_line()">Очистить линию</button>-->
<!--    </div>-->
</div>
<!--</body>-->

<script>
    "use strict";
    //Настройка объектов на карте
    const BASE_URL = "<?php echo base_url();?>";
    const ICON_URL =BASE_URL+ "/js/qgeovision/Leaflet.draw/dist/images/";
    const MAP_CENTER = [54.892405720815276,45.7635498046875];
    const LOCAL_MIN_ZOOM = 8;
    const VIEW_ZOOM =13;
    const OPENSTREETMAP_MIN_ZOOM = 5;
    const LOCAL_MAX_ZOOM = 18;
    const OPENSTREETMAP_MAX_ZOOM = 17;
    const LOCAL_ATTRIBUTION ='';
    const DISPLAY_OPTIONS={mapCenter:MAP_CENTER,
        mapZoom:LOCAL_MIN_ZOOM,
        weightPoligon:2,
        color:'teal',
        fillColorPoligon:'teal',
        fillOpacity:10,
        opacity:0.9,
        colorPpoligon: 'red',
        opacityPoligon:0.5,
        draggableLabel: false,
        zIndexOffsetLabel: 10,
        classNameLabel: 'text-labels'};
    const POPUP_ANCHOR_MESSAGES =[0, -30];
    const POPUP_ANCHOR_KCOB =[0, -30];
    const LEAFLET_ICON = L.Icon.extend({
        options: {
            keepInView:true,
            autoClose:false,
            closeOnClick:false,
//            shadowUrl: MESSAGE_SHADOW_ICON,
            iconSize: [35, 35],
//        shadowSize: [25, 25],
            iconAnchor: [16, 37],
            shadowAnchor: [16, 37],
            popupAnchor: POPUP_ANCHOR_MESSAGES
        }
    });

    const OPENSTREETMAP_TILES_SOURCE2 = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const OPENSTREETMAP_ATTRIBUTION = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>,' +
        ' Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>';
    const OPENSTREETMAP_ATTRIBUTION_GEO ='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    //    const LOCAL_TILES_SOURCE = TILES_URL+'{z}/{x}/{y}.png';
    const OPENSTREETMAP_TILES_SOURCE_GEO = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
    const LAYER = new L.TileLayer(OPENSTREETMAP_TILES_SOURCE2, {
        minZoom: OPENSTREETMAP_MIN_ZOOM,
        maxZoom: OPENSTREETMAP_MAX_ZOOM,
        attribution:OPENSTREETMAP_ATTRIBUTION,
        tms: false
    });
    //слойи на карте
    //    let telemetryLayer = L.layerGroup();
    //    let messageLayerCluster = L.markerClusterGroup();
    //    let kcobTelemetryLayer = L.layerGroup();//слой для одиночных маркеров обЪектов КСОБ
    const MAP_OPTIONS = {
        center:DISPLAY_OPTIONS['mapCenter'],
        zoom:DISPLAY_OPTIONS['mapZoom']
    };

    const SIZE_CLUSTER_ICON = L.point(25, 25);
    //    let CLASS_MARKER_CLUSTER_MESSAGES = 'markers-cluster-messages';
    const CLUSTER_RADIUS =10;
    let mapCluster = L.markerClusterGroup( {
        maxClusterRadius: CLUSTER_RADIUS,
        singleMarkerMode: false,
        iconCreateFunction: function (cluster) {
            return L.divIcon({
                html: '<div class="numMarker">'+cluster.getChildCount()+'</div>',
                className:CLASS_MARKER_CLUSTER_MAP , iconSize: SIZE_CLUSTER_ICON});
        },
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: true,
        zoomToBoundsOnClick: true
    });
    let geo = L.tileLayer(OPENSTREETMAP_TILES_SOURCE_GEO, {id: 'MapID', attribution: OPENSTREETMAP_ATTRIBUTION_GEO}),
        online   = L.tileLayer(OPENSTREETMAP_TILES_SOURCE2, {id: 'MapID', attribution: OPENSTREETMAP_ATTRIBUTION});
    //    let overlayMaps = {
    //        "<span class ='control-layer'>Слой телесигналов</span>": telemetryCluster,
    //        "<span class ='control-layer'>Слой сигналов сообщений</span>": messageCluster,
    //        "<span class ='control-layer'>Слой сигналов 'Реального времени'</span>":HRAPCluster
    //    };
    let initMap = ()=>{
        let mymap = new L.map('map', MAP_OPTIONS);
        //Добавление слоя на карту
        mymap.addLayer(LAYER);
        return mymap;
    }
    const  MY_MAP = initMap();
    //отключаем зуммирование по двойному клику
    MY_MAP.doubleClickZoom.disable();
    //параметры настроек слоев в меню слоев
    let baseMaps = {
        "<span class ='control-view'>Спутник</span>": geo,
        "<span class ='control-view'>Карта</span>": online
    };
    L.control.layers(baseMaps).addTo(MY_MAP);

    let editableLayers = new L.FeatureGroup();
    MY_MAP.addLayer(editableLayers);
    let myIcon = L.divIcon({className: 'my-div-icon', iconSize: [35, 35]});
    // you can set .my-div-icon styles in CSS
    // let MyCustomMarker = L.marker([50.505, 30.57], {icon: myIcon});
    // let MyCustomMarker = L.Icon.extend({
    //     options: {
    //         shadowUrl: `${ICON_URL}/marker-shadow.png`,
    //         iconAnchor: [16, 37],
    //         shadowAnchor: [16, 37],
    //         iconSize: [35, 35],
    //         popupAnchor: [0, -30],
    //         icon: myIcon
    //     }
    // });

    let options = {
        position: 'topright',
        draw: {
            polyline: {
                shapeOptions: {
                    color: '#f357a1',
                    weight: 10
                }
            },
            polygon: {
                allowIntersection: false, // Restricts shapes to simple polygons
                drawError: {
                    color: '#e1e100', // Color the shape will turn when intersects
                    message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
                },
                shapeOptions: {
                    color: '#bada55'
                }
            },
            circle: false, // Turns off this drawing tool
            rectangle: {
                shapeOptions: {
                    clickable: false
                }
            },
            marker: {
                icon: myIcon
            }
        },
        edit: {
            featureGroup: editableLayers, //REQUIRED!!
            remove: false
        }
    };

    let drawControl = new L.Control.Draw(options);
    MY_MAP.addControl(drawControl);

    MY_MAP.on(L.Draw.Event.CREATED, function (e) {
        var type = e.layerType,
            layer = e.layer;

        if (type === 'marker') {
            layer.bindPopup('A popup!');
        }

        editableLayers.addLayer(layer);
    });
    let  svg_json = JSON.parse('<?php echo $svg_json; ?>');
		//создание для каждого типа элемента своего массива
		let aclineSegmentArr = [];
		let nodeArr =[];
		let polyLinetArr = [];
		let hasTerminalElArr =[];
		let notTerminalElArr =[];
		//проверка типа элемента или если указан только 1 параметр - получение типа
		let checkTypeElObject =(obj,type=false,property='typical_element_type')=>{
				//если у объекта есть требуемое свойство
			if(obj[property]){
				//проверка свойства на соответсвие заданному типу
				if (type){
					return obj[property]===type;
				}
				//в противном случае получение значения типа данного свойств
				else{
					return obj[property];
				}
			}
      // объект не содержит свойство type
			else{
				return null;
			}
		}
		//Разделение элементов на массивы по типу
		let splitElementsByType = (arr)=>{
			_.each(arr,(item,i)=>{
				if(checkTypeElObject(item,"acline_segment")){
					aclineSegmentArr.push(item);
				}
				else if(checkTypeElObject(item,"NODE")){
					nodeArr.push(item);
				}
				else if(checkTypeElObject(item,"POLY_LINE")){
					polyLinetArr.push(item);
				}
				else{
					if(item.terminals){
						hasTerminalElArr.push(item);
					}
					else{
						notTerminalElArr.push(item);
					}
				}
			});
		}
		splitElementsByType(svg_json);
		//собираем все объекты, имеющие терминалы кроме нодов
		let terminalsObj = _.concat(aclineSegmentArr,hasTerminalElArr);
    console.log('svg_json--->',svg_json);
		console.log('svg_json--->',checkTypeElObject(svg_json[1]));
		//получение массива индентификаторов ввода/вывода для элементов по заданному
		//будет применяться приимущественно к полилинии
		//пример getFromArray(svg_json,'to') или getFromArray(svg_json,'from')
		let getInputArrByType = (arr,input)=>{
			if(arr.length){
				//возращаемый массив очищаем от пустых значений
			return _.compact(_.map(arr,input));
		}
			else{
				//указанный параметр функции не является действительным массивом
				return [];
			}
		};
		console.log(getInputArrByType(svg_json,'from'));
		//получение массива терминальных индентификаторов конкретного объекта
		let getTerminalsArr =(obj)=> _.compact(obj.terminals);
		console.log('getTerminalsArr',getTerminalsArr(aclineSegmentArr[0]))
		//собирает все терминалы сегментов в массив
		let getTerminals = (arr)=>_.map(arr,getTerminalsArr);
		console.log('getTerminals',getTerminals(nodeArr));
		let drawPolylyne = (coordStart =MAP_CENTER,coordStop = [54.892405720815276,46.0035498046875])=>{
			let latlngs = [coordStart,coordStop];
			let polyline = L.polyline(latlngs, {color: 'red'}).addTo(MY_MAP);
		}
		drawPolylyne();
		function rotatePoints(center, points, yaw) {
  let res = []
  let angle = yaw * (Math.PI / 180) // not really sure what this is
  for(let i=0; i<points.length; i++) {
    let p = points[i]
    // translate to center
    let p2 = [ p[0]-center[0], p[1]-center[1] ]
    // rotate using matrix rotation
    let p3 = [ Math.cos(angle)*p2[0] - Math.sin(angle)*p2[1], Math.sin(angle)*p2[0] + Math.cos(angle)*p2[1]]
    // translate back to center
    let p4 = [ p3[0]+center[0], p3[1]+center[1]]
    // done with that point
    res.push(p4)
  }
  return res
}
//проходимся по массиву нодов
let objNodeArr =_.map(nodeArr,(item,i)=>{
	let resultArr = [];
	//находим все объекты полилиний смежных с данным узлом
	let toArr = _.filter(polyLinetArr,{to:getTerminalsArr(item)[0]});
	//находим индентификаторы терминалов являющихся общей точкой на карте
	let fromArr = getInputArrByType(toArr,'from');
	//находим объекты терминалы, которых равны полученным индентификаторам
	let objNode = _.filter(terminalsObj,(item)=>{
		let termItem = getTerminalsArr(item);
		for(let i of termItem){
			if(fromArr.includes(i)){
				return item;
			}
		}
	})
	return objNode;
})
// MY_MAP.panTo(MAP_CENTER);
//    ymaps.ready(init);
//    var myPlacemark;
//    var myPolyline = null;
//    var myMap = null;
//    var clear = null;
//    var from_to = JSON.parse('<?php //echo $from_to ;?>//');
//    function init() {
//        var input_value = opener.$('#<?php //echo $input_val?>//').val();
//        //var points = JSON.parse (jQuery('#<?php //echo $input_val?>//'));
//        var points  = new Array();
//        if (input_value == '')
//        {	// если в базе пустые координаты подстанций from и to
//            ss_from = JSON.parse(from_to.from_ss);
//            if (ss_from ==null)
//            {
//                ss_from = [47.2,39.7];
//            }
//            ss_to = JSON.parse(from_to.to_ss);
//            if (ss_to ==null)
//            {
//                ss_to = [47.2,39.7];
//            }
//            points.push(ss_from);
//            points.push(ss_to);
//        }
//        else{
//            points = JSON.parse(input_value);
//        }
//        myMap = new ymaps.Map('map', {
//            center: points[0],
//            zoom: 9,
//            controls: ['zoomControl', 'typeSelector'],
//        });
//
//        myMap.events.add('boundschange', function (event){
//            var val =  event.get('newZoom');	//изменились границы карты
//            if (val>14)
//            {
//                myMap.setType('yandex#satellite');//включить спутник
//            }
//            else
//            {
//                myMap.setType('yandex#map');
//
//            }
//        });
//
//
//
//        //рисуем подстанции
//
//        drow_substation(from_to);
//
//        // Создаем ломаную с помощью вспомогательного класса Polyline.
//
//        myPolyline = new ymaps.Polyline(points,
//            {}, {
//                // Задаем опции геообъекта.
//                // Цвет с прозрачностью.
//                strokeColor: '<?php //echo $color?>//',
//                // Ширину линии.
//                strokeWidth: 4,
//                // Максимально допустимое количество вершин в ломаной.
//                editorMaxPoints: 150,
//                //drawing: true,
//                // Добавляем в контекстное меню новый пункт, позволяющий удалить ломаную.
//                editorMenuManager: function (items) {
//                    items.push({
//                        title: "Удалить линию",
//                        onClick: function () {
//                            myMap.geoObjects.remove(myPolyline);
//                            myPolyline.geometry.setCoordinates([]);
//                            clear = 1 ;
//                        }
//                    });
//                    return items;
//                }
//            });
//
//        // Добавляем линию на карту.
//        myMap.geoObjects.add(myPolyline);
//        // Включаем режим редактирования.
//        myPolyline.editor.startEditing();
//        myMap.setBounds(myMap.geoObjects.getBounds());
//    }
//    //--------------------------
//    function drow_substation(from_to)
//    {
//        var points_arr = new Array();
//        coords_from = JSON.parse(from_to.from_ss);
//        coords_to = JSON.parse(from_to.to_ss);
//        var placemark_from = new ymaps.Placemark(coords_from);
//        var baloon_from = new ymaps.Placemark(coords_from);
//        baloon_from.properties.set({
//            iconContent: from_to.from_name,
//        });
//        baloon_from.options.set({
//            preset:	'islands#blackStretchyIcon',
//
//        });
//        placemark_from.options.set({
//            preset: 'islands#circleDotIcon',
//            //preset:	'islands#StretchyIcon',
//            //StretchyIcon: true,
//            iconColor :from_to.from_color,
//        });
//        points_arr.push (placemark_from);
//        points_arr.push (baloon_from);
//
//        var placemark_to = new ymaps.Placemark(coords_to);
//        var baloon_to = new ymaps.Placemark(coords_to);
//        baloon_to.properties.set({
//            iconContent: from_to.to_name,
//        });
//        baloon_to.options.set({
//            preset:	'islands#blackStretchyIcon',
//
//        });
//        placemark_to.options.set({
//            preset: 'islands#circleDotIcon',
//            //preset:	'islands#StretchyIcon',
//            //StretchyIcon: true,
//            iconColor :from_to.to_color,
//        });
//        points_arr.push (placemark_to);
//        points_arr.push (baloon_to);
//        objects = ymaps.geoQuery(points_arr).addToMap(myMap);
////   myMap.setBounds(myMap.geoObjects.getBounds());
//    }
//    //----------------------------
//
//    function clear_line()
//    {
//        myMap.geoObjects.remove(myPolyline);
//        myPolyline.geometry.setCoordinates([]);
//        clear = 1 ;
//    }
//    function save_coor()
//    {
//        var coor =JSON.stringify(myPolyline.geometry.getCoordinates());
//        opener.$('[name="coord_input"]').val(coor);
//        self.close();
//    }
</script>
<body>
</html>
