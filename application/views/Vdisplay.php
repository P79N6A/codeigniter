<!doctype html>
<html>
<?php
include("header.php");
?>
<?php
include("header2.php");
?>

<body>
<!--<div class="container">-->


<nav class="navbar qgeovision">
    <a class="navbar-brand col-sm-2 col-md-2 mr-0" href="#">qGeoVision</a>
    <a class="nav-link" href="#">Sign out</a>
</nav>
<div class = "row">
    <div class="legend col-md-2"></div>
    <div class="col-md-10" id="mapid" class="leaflet-container leaflet-fade-anim leaflet-grab leaflet-touch-drag"></div>
</div>
<!--</div>-->
<script>


    //    Настройки отображения карты
    var displayOptions={mapCenter:[59.9598,30.0641],
        mapZoom:10,
        fillColorPoligon:'yellow',
        weightPoligon:3,
        colorPpoligon: 'red',
        dashArrayPoligon:'10 10 10 10',
        opacityPoligon:0.5,
        draggableLabel: false,
        zIndexOffsetLabel: 10,
        classNameLabel: 'text-labels'};
    // конструктор для класса добавления аккордеона
    function Accordion() {
        this.idAccordion = 'accordionVision';
        this.value = 0;


        // Добавление Accordion на страницу
        this.addAccordion = function(place_forAdding)
        {$(place_forAdding).append("<div class='accordion' id='"+ this.idAccordion +"'></div>")};

        // Добавление отдельного Collapse для Card для
        this.addCard = function(place_forAdding,
                                idCard,
                                for_click ='#####',
                                env='',
                                data_target,
                                item_card = 'field')

            {this.data_target = data_target;
            this.idCard = idCard;
            $(place_forAdding).append('' +
            '<div class="card">' +
                '<div class="card-header" id="' + idCard +'"> ' +
                    '<h5 class="mb-0 '+item_card+'">'+ env +
                        '<div class=" push btn btn-link collapsed" type="button" data-toggle="collapse" ' +
                        ' name = ".'+data_target +'" data-target=".'+data_target +'" \
                        aria-expanded="false" aria-controls="'+data_target+'">' + for_click +
                        ' </div> ' +
                    '</h5> ' +
                '</div> ' +
            '</div>')};

        // Добавление отдельного Card для Accordion
        this.addCollapse = function(place_forAdding,
                                    body="####",
                                    class_name_formating ='default'){
            $(place_forAdding +':last-child').append(
                '<div class="'+this.data_target+' collapse" aria-labelledby="'+this.idCard+'" '+'data-parent="#'+ this.idAccordion+'">' +
                    '<div class="'+class_name_formating+'">'+ body +'</div>' +
                '</div>')}};

    //Данные для заголовака Accordion  с названием регион
    var checkbox = "<input class='title form-check-input' type='checkbox' value='"+'title'+"' class='defaultCheck1'>";
    var card_regions = " <div class='form-check list-group'>" +
        "<label class='form-check-label' for='defaultCheck1'>" + "Регион" +"</label><span class='plus'>+</span></div>";
    //Создание нового экземпляра Accordion
    var accordion = new Accordion();
    //добавление бокового списка отображения для регионов
    accordion.addAccordion('.legend');
    //заголовок "Настройки"
    var testbox = "<input class=' form-check-input' type='checkbox'  class='defaultCheck0'>";
    var bodyOptions = '<div class="options_text"><span class=" key_options glyphicon glyphicon-wrench">' +
        '</span>Управление</div>';
    accordion.addCard('.accordion','headingZero',bodyOptions,undefined,undefined,'options');
    accordion.addCard('.accordion','headingOne',card_regions,checkbox,'collapseOne');

    //Парсинг json данных полученных из xml файла
    //Making map options
    var mapOptions = {
        center:displayOptions['mapCenter'],
        zoom:displayOptions['mapZoom']
//        keyboardPanDelta:10,
//        drawControl: false
    };

    //creating map object
    var mymap = new L.map('mapid', mapOptions);
    //    var map = L.map('mapid', { drawControl: true }).setView([25, 25], 2);

    //creating the layer object
    var layer = new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors');
    //adding layer to the map
    mymap.addLayer(layer);

    var json_cords = JSON.parse(<?php echo json_encode($json); ?>);
    var regions = Array();






    //Цикл рисования полигонов регионов и добавление в DOM списка регионов
    for (var item in json_cords){
        var coord = json_cords[item]['coordinates'];
        var name = json_cords[item]['name'];
        var label_coordinats = json_cords[item]['label_coordinats'];

        //Создание массива полигонов
        var polygon = L.polygon(coord,{color:displayOptions['colorPpoligon'],weight:displayOptions['weightPoligon'],
            opacity:displayOptions['opacityPoligon'],fillColor:displayOptions['fillColorPoligon'],
            dashArray:displayOptions['dashArrayPoligon']});
        polygon.addTo(mymap).bindPopup(name);
        mymap.addLayer(polygon);

        //добавление marker на карту
        var textLatLng = label_coordinats;
//        var markers = L.markerClusterGroup();
//            var a = textLatLng;
//            var title = name;
//            var marker = L.marker(new L.LatLng(a[0], a[1]), { title: name });
//            marker.bindPopup(title);
//            markers.addLayer(marker);
//        mymap.addLayer(markers);





        //Добавление плагина отображения координат мышки
//        L.control.mousePosition().addTo(mymap);

        //Добавление отображение координат курсора на карте
        // var c = new L.Control.Coordinates();
        // c.addTo(mymap);
        // mymap.on('click', function(e) {
        //     c.setCoordinates(e);
        // });
//        ##Добавление зума
        lalo = L.GeoJSON.coordsToLatLng(label_coordinats.reverse());
        //Добавление элементов в DOM
        var list_regions = " <div class='form form-check'><input class='item form-check-input' type='checkbox' value='"+item+"' class='defaultCheck1'>" +
            "<label  form-check-label for='defaultCheck1'><a class='region_menu' href='#' name='"+item+"'>" + name +"</a></label></div>";
        accordion.addCollapse('.card',list_regions);
//        $('.list-group').append(" <div class='form-check'><input class='item form-check-input' type='checkbox' value='"+item+"' class='defaultCheck1'>" +
//        "<label  form-check-label' for='defaultCheck1'><a class='region_menu' href='#' name='"+item+"'>" + name +"</a></label></div>");
        //Все чекбоксы активны
        $('body input:checkbox').prop('checked', true);

        regions[item] = {
            'name':name,
            'polygon':polygon,
//            'label':myTextLabel,
            'label_coord':label_coordinats,
            'scale':lalo
        };
    }

    //Значение чекбокса установлено
    var check = true;
    var is_zoomend=true;
    //обработчик для заголовка
//    $(function() {
//        if(is_zoomend);
//        $('.title').click(function(){
//
//            $('.item').prop('checked', false);
//            if (!($(this).is(':checked')) && check) {
//                is_zoomend(false);
//                for(var item in regions){
//                    mymap.removeLayer(regions[item]['polygon']);
////                    mymap.removeLayer(regions[item]['label']);
//                    check = false;
////                is_zoomend();
//                }
//            }
//            else {
//                $('.item').prop('checked', true);
//                for (var item in regions) {
//                    mymap.addLayer(regions[item]['polygon']);
////                    mymap.addLayer(regions[item]['label']);
//                    check = true;
//                    is_zoomend();
//
//                }
//            }
//
//        })
//    });
    var check = true;
    //обработчик для чекбокса бокового меню выбора региона
    $(function() {
//        item_zoom();
        $('.item').click(function(){
            if(!($(this).is(':checked'))&& check){
                //Удаление полигона

                mymap.removeLayer(regions[$(this).val()]['polygon']);
//                mymap.removeLayer(regions[$(this).val()]['label']);
                check = false;
//                item_zoom(false);
            }
//            else if(){
//
//            }
            else{

                mymap.addLayer(regions[$(this).val()]['polygon']);
//                mymap.addLayer(regions[$(this).val()]['label']);
                check = true;
//                item_zoom(false);


            }
        })

    });

    //обработчик для элементов бокового меню выбора региона
    $(function() {
        $('.region_menu').click(function(){
            var coord = +$(this).attr('name');
            mymap.setView(regions[coord]['scale'],12);
        })
    });
    //Отображения надписей региона при зуме большем 10
//    var is_zoomend = function(flag = true) {
//        mymap.on('zoomend ', function (e) {
//            if (mymap.getZoom() < 10 && flag) {
//                for (var item in regions) {
////                    mymap.removeLayer(regions[item]['label']);
//                }
//            }
//            else if(mymap.getZoom()>=10 && flag) {
//                for (var item in regions) {
//                    mymap.addLayer(regions[item]['label']);
//                }
//            }
//            else{
//                for (var item in regions) {
//                    mymap.removeLayer(regions[item]['label']);
//                };
//            }
//        });
//    };
//    //фунция для зумирования текущего элемента
//    var item_zoom = function (flag = true){
//        mymap.on('zoomend ', function (e){
//            if (mymap.getZoom() < 10 && flag){
//                mymap.removeLayer(regions[$(this).val()]['label']);
//            }
//            else if(mymap.getZoom()>=10 && flag){
//                mymap.addLayer(regions[$(this).val()]['label']);
//            }
//            else{
//                mymap.removeLayer(regions[$(this).val()]['label']);
//                alert('Remove');
//            }
//        });
//    }
    var testbody = " <div class='form-check list-group'>" +
        "<label class='form-check-label'' for='defaultCheck2'>" + "#########" +"</label><span class='plus'>+</span></div>";
    var testbody2 = " <div class='form-check list-group'>" +
        "<label class='form-check-label'' for='defaultCheck2'>" + "#########" +"</label><span class='plus'>+</span></div>";

    //создание карточки аккордина с данными для теста корректности отображения
    accordion.addCard('.accordion','headingTwo',testbody,testbox,'collapseTwo');
    accordion.addCollapse('.card','@@@@@@@@@@@@@@','test1');
    //создание карточки аккордина с данными для теста корректности отображения
    accordion.addCard('.accordion','headingThree',testbody,testbox,'collapseThree');
    accordion.addCollapse('.card','Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi architecto beatae ' +
    'dolore facilis fugit ipsa laboriosam, magnam magni natus non nulla, perferendis reprehenderit sint sit ' +
    'voluptatibus. Delectus fugiat ipsum odit!');
    //меняем + на - при раскрытии аккордеона
    // $('.push').click(function () {
    //     var target = $(this).attr('name');
    //     // alert(target);
    //     $(''+target+'').on('hidden.bs.collapse', function (){
    //         // alert(target);
    //     $('.plus').text('-');
    // })
    // });
    // $('.collapseTwo').on('show.bs.collapse', function () {
    //     $('.plus').text('-');
    // });
//    var markers = L.markerClusterGroup({
//        maxClusterRadius: 120,
//        iconCreateFunction: function (cluster) {
//            var markers = cluster.getAllChildMarkers();
//            var n = 0;
//            for (var i = 0; i < markers.length; i++) {
//                n += markers[i].number;
//            }
//            return L.divIcon({ html: n, className: 'mycluster', iconSize: L.point(40, 40) });
//        },
//        //Disable all of the defaults:
//        spiderfyOnMaxZoom: true, showCoverageOnHover: false, zoomToBoundsOnClick: false
//    });
//    mymap.addLayer(markers);
//
//    function populate() {
//        for (var i = 0; i < 100; i++) {
//            var m = L.marker(getRandomLatLng(mymap), { title: i });
//            m.number = i;
//            markers.addLayer(m);
//        }
//        return false;
//    }
//    function populateRandomVector() {
//        for (var i = 0, latlngs = [], len = 20; i < len; i++) {
//            latlngs.push(getRandomLatLng(mymap));
//        }
//        var path = L.polyline(latlngs);
//        mymap.addLayer(path);
//    }
//    function getRandomLatLng(map) {
//        var bounds = map.getBounds(),
//            southWest = bounds.getSouthWest(),
//            northEast = bounds.getNorthEast(),
//            lngSpan = northEast.lng - southWest.lng,
//            latSpan = northEast.lat - southWest.lat;
//
//        return L.latLng(
//            southWest.lat + latSpan * Math.random(),
//            southWest.lng + lngSpan * Math.random());
//    }
//
//    populate();
//
//
//
//
//    var shownLayer, polygon;
//
//    function removePolygon() {
//        if (shownLayer) {
//            shownLayer.setOpacity(1);
//            shownLayer = null;
//        }
//        if (polygon) {
//            mymap.removeLayer(polygon);
//            polygon = null;
//        }
//    };
////
//    markers.on('clustermouseover', function (a) {
//        removePolygon();
//
//        a.layer.setOpacity(0.2);
//        shownLayer = a.layer;
//        polygon = L.polygon(a.layer.getConvexHull());
//        mymap.addLayer(polygon);
//    });
//    markers.on('clustermouseout', removePolygon);
//    mymap.on('zoomend', removePolygon);

    //Добавление надписи одного региона
    function addCurrentLabel(coordRegion) {
        var myTextLabel = L.marker(coordRegion, {
        icon: L.divIcon({
            className: displayOptions['classNameLabel'],   // Set class for CSS styling
            html: name
        }),
            draggable: displayOptions['draggableLabel'], // Allow label dragging...?
            zIndexOffset: displayOptions['zIndexOffsetLabel']// Make appear above other map features
        });
        mymap.addLayer(myTextLabel);
        myTextLabel.addTo(mymap);
        }
    //Добавление надписей всех регионов
    function addAllLabel() {
            for (var item in json_cords){
                var name = json_cords[item]['name'];
                // alert(name);
                var label_coordinats = json_cords[item]['label_coordinats'];
            var myTextLabel = L.marker(label_coordinats, {
                icon: L.divIcon({
                    className: displayOptions['classNameLabel'],   // Set class for CSS styling
                    html: name
                }),
                draggable: displayOptions['draggableLabel'], // Allow label dragging...?
                zIndexOffset: displayOptions['zIndexOffsetLabel']// Make appear above other map features
            });
            mymap.addLayer(myTextLabel);
            myTextLabel.addTo(mymap);
    }};
//    addCurrentLabel(regions['label_coord']);
    addAllLabel();
</script>



</body>
</html>
