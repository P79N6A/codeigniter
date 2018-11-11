<!doctype html>
<html>
<?php
include("header.php");
?>

<body>
<!--<div class="container">-->
<nav class="navbar qgeovision">
    <a class="navbar-brand col-sm-2 col-md-2 mr-0" href="#">qGeoVision</a>
    <a class="nav-link" href="#">Sign out</a>
</nav>
<div class = "row">
    <div class="legend col-md-2"></div>
    <div class="col-md-10" id="mapid"></div>
</div>
<!--</div>-->
<script>
    //#########################################################################################################
    //CONSTANT,VARIABLE
    //#########################################################################################################
    var CURRENT_ZOOM = 10;
    var MAP_CENTER = [59.9598,30.0641];
    //    Настройки отображения карты
    var displayOptions={mapCenter:[59.9598,30.0641],
        mapZoom:CURRENT_ZOOM,
        fillColorPoligon:'yellow',
        weightPoligon:3,
        colorPpoligon: 'red',
        dashArrayPoligon:'10 10 10 10',
        opacityPoligon:0.7,
        draggableLabel: false,
        zIndexOffsetLabel: 10,
        classNameLabel: 'text-labels'};

    //Указание отдельных опций для слоя карты
    var mapOptions = {
        center:displayOptions['mapCenter'],
        zoom:displayOptions['mapZoom']
    };
    //Данные тайла слоя карты
    var layer = new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors');
    //Опции иконки для маркера
    //    var myIcon = L.icon({
    //        iconUrl: 'https://static.appvn.com/a/uploads/thumbnails/122014/maps-to-sygic_icon.png',
    //        iconRetinaUrl: 'https://static.appvn.com/a/uploads/thumbnails/122014/maps-to-sygic_icon.png',
    //        iconSize: [29, 24],
    //        iconAnchor: [9, 21],
    //        popupAnchor: [0, -14]
    //    });
    //Данные для заголовака Accordion  с названием регион
    var checkbox = "<input class='title form-check-input' type='checkbox' value='"+'title'+"' class='defaultCheck1'>";
    var card_regions = " <div class='form-check list-group'>" +
        "<label class='form-check-label' for='defaultCheck1'>" + "Регион" +"</label><span class='plus'>+</span></div>";

    //Данные заголовок Accordion "Управление"
    var lineBox = "<input class=' linebox form-check-input' type='checkbox'  class='defaultCheck0'>";
    var bodyOptions = '<div class="options_text"><span class=" key_options glyphicon glyphicon-wrench">' +
        '</span>Управление</div>';


    var lineBody = " <div class='form-check list-group'>" +
        "<label class='form-check-label'' for='defaultCheck0'>" + "Line" +"</label><span class='plus'>+</span></div>";
    var substBody = " <div class='form-check list-group'>" +
        "<label class='form-check-label'' for='defaultCheck3'>" + "Substation" +"</label><span class='plus'>+</span></div>";
    var substBox = "<input class='substation form-check-input' type='checkbox' value='"+'title'+"' class='defaultCheck3'>";

    //#########################################################################################################
    //ACCORDION
    //#########################################################################################################
    // конструктор для класса добавления аккордеона
    function Accordion() {
        this.idAccordion = 'accordionVision';
        this.value = 0;
        // Добавление Accordion на страницу
        this.addAccordion = function(place_forAdding)
        {$(place_forAdding).append("<div class='accordion' id='"+ this.idAccordion +"'></div>")};
        // Добавление отдельного  Card
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
    //#########################################################################################################
    //INITILISATION
    //#########################################################################################################

    //Создание нового экземпляра Accordion
    var accordion = new Accordion();
    accordion.addAccordion('.legend');
    //добавление бокового списка отображения для регионов
    accordion.addCard('.accordion','headingZero',bodyOptions,undefined,undefined,'options');
    //добавление заголовока "Управление"
    accordion.addCard('.accordion','headingOne',card_regions,checkbox,'collapseOne');

    //Создание объекта для карты
    var mymap = new L.map('mapid', mapOptions);
    //    var map = L.map('mapid', { drawControl: true }).setView([25, 25], 2);

    //Добавление слоя на карту
    mymap.addLayer(layer);
    //Парсинг json данных полученных из xml файла для регионов
    var json_cords_reg = JSON.parse(<?php echo json_encode($json_region); ?>);
    var regions = Array();

    //Парсинг json данных для подстанций
    var json_cords_sub = JSON.parse(<?php echo json_encode($json_substation); ?>);
    var substation = Array();

    //Парсинг json данных для линий
    var json_cords_line = JSON.parse(<?php echo json_encode($json_line); ?>);
    var line = Array();


    //Инициализация группы кластеров на карту
    var markers = L.markerClusterGroup({
        maxClusterRadius: 10,
        spiderfyOnMaxZoom: false, showCoverageOnHover: false, zoomToBoundsOnClick: false
    });
    //Значение чекбокса установлено
    var check = true;
    //обработчик для заголовка
    $(function() {
        is_zoomend();
        $('.title').click(function(){

            $('.item').prop('checked', false);
            if (!($(this).is(':checked')) && check) {
                is_zoomend(false);
                for(var item in regions){
                    mymap.removeLayer(regions[item]['polygon']);
                    mymap.removeLayer(regions[item]['label']);
                    check = false;
//                is_zoomend();
                }
            }
            else {
                $('.item').prop('checked', true);
                for (var item in regions) {
                    mymap.addLayer(regions[item]['polygon']);
                    mymap.addLayer(regions[item]['label']);
                    check = true;
                    is_zoomend();

                }
            }

        })
    });



    //обработчик для заголовка Line
    // $(function() {
    //   // var check = true;
    //     $('.linebox').click(function(){
    //         if (!($(this).is(':checked'))) {
    //             for(var item in line){
    //                 mymap.removeLayer(line[item]['polyline']);
    //                 // check = false;
    //             }
    //         }
    //         else {
    //             for (var item in line) {
    //                 mymap.addLayer(line[item]['polyline']);
    //                 check = true;
    //
    //             }
    //         }
    //
    //     })
    // });






    //обработчик для чекбокса бокового меню выбора региона
    $(function() {
        var check = true;
//        item_zoom();
        $('.item').click(function(){
            if(!($(this).is(':checked'))&& check){
                //Удаление полигона
                mymap.removeLayer(regions[$(this).val()]['polygon']);
                mymap.removeLayer(regions[$(this).val()]['label']);
                check = false;
//                item_zoom(false);
            }
//            else if(){
//
//            }
            else{
                mymap.addLayer(regions[$(this).val()]['polygon']);
                mymap.addLayer(regions[$(this).val()]['label']);
                check = true;
//                item_zoom(false);
            }
        })

    });

    //обработчик для установки зума региона
    $(function() {
        $('.region_menu').click(function(){
            var coord = +$(this).attr('name');
            mymap.setView(regions[coord]['scale'],12);
        })
    });

    //Отображения надписей региона при зуме большем CURRENT_ZOOM
    var is_zoomend = function(flag = true) {
        mymap.on('zoomend ', function (e) {
            if (mymap.getZoom() < CURRENT_ZOOM && flag) {
                for (var item in regions) {
                    mymap.removeLayer(regions[item]['label']);
                }
            }
            else if(mymap.getZoom()>=CURRENT_ZOOM && flag) {
                for (var item in regions) {
                    mymap.addLayer(regions[item]['label']);
                }
            }
            else{
                for (var item in regions) {
                    mymap.removeLayer(regions[item]['label']);
                };
            }
        });
    };

    //фунция для зумирования текущего элемента
    var item_zoom = function (flag = true){
        mymap.on('zoomend ', function (e){
            if (mymap.getZoom() < CURRENT_ZOOM && flag){
                mymap.removeLayer(regions[$(this).val()]['label']);
            }
            else if(mymap.getZoom()>=CURRENT_ZOOM && flag){
                mymap.addLayer(regions[$(this).val()]['label']);
            }
            else{
                mymap.removeLayer(regions[$(this).val()]['label']);
                alert('Remove');
            }
        });
    }

    //#########################################################################################################
    //RUN
    //#########################################################################################################
    //Цикл рисования полигонов регионов и добавление в DOM списка регионов
    for (var item in json_cords_reg){
        var coord = json_cords_reg[item]['coordinates'];
        var fk_region = json_cords_reg[item]['id_regions'];
        var name = json_cords_reg[item]['name'];
        var label_coordinats = json_cords_reg[item]['label_coordinats'];

        //Создание массива полигонов
        var polygon = L.polygon(coord,{color:displayOptions['colorPpoligon'],weight:displayOptions['weightPoligon'],
            opacity:displayOptions['opacityPoligon'],fillColor:displayOptions['fillColorPoligon'],
            dashArray:displayOptions['dashArrayPoligon']});
        polygon.addTo(mymap).bindPopup(name);
        mymap.addLayer(polygon);

        //##добавление надписи
        var textLatLng = label_coordinats;
        var myTextLabel = L.marker(textLatLng, {
            icon: L.divIcon({
                className: displayOptions['classNameLabel'],   // Set class for CSS styling
                html: name
            }),
            draggable: displayOptions['draggableLabel'], // Allow label dragging...?
            zIndexOffset: displayOptions['zIndexOffsetLabel']// Make appear above other map features
        });
        mymap.addLayer(myTextLabel);
        myTextLabel.addTo(mymap);

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

        //Все чекбоксы активны
        $('body input:checkbox').prop('checked', false);

        regions[item] = {
            'fk_region':fk_region,
            'name':name,
            'polygon':polygon,
            'label':myTextLabel,
            'scale':lalo,
            'messages':[],
            'time_messages':[]
        };
    }
    //Конец цикла
    //###################################################################################################################
    //Цикл добавления маркеров для подстанций
    for (var item in json_cords_sub){
        var marker_coord = json_cords_sub[item]['coordinates'];
        var name = json_cords_sub[item]['name'];

        // добавление названия подстанции
        var textLatLng = marker_coord;
        var myTextLabel = L.marker(textLatLng, {
            icon: L.divIcon({
                className: displayOptions['classNameLabel'],   // Set class for CSS styling
                html: name,
                iconSize:85

            }),
            draggable: displayOptions['draggableLabel'], // Allow label dragging...?
            zIndexOffset: displayOptions['zIndexOffsetLabel']// Make appear above other map features
        });
        mymap.addLayer(myTextLabel);
        myTextLabel.addTo(mymap);

        //добавление маркера
        var myIcon = L.divIcon({className: 'my-div-icon'});
        L.marker(marker_coord, {icon: myIcon}).addTo(mymap);
    //        ##Добавление зума
        var lalo = L.GeoJSON.coordsToLatLng(marker_coord.reverse());
    //     //Добавление элементов в DOM
    //     var list_regions = " <div class='form form-check'><input class='item form-check-input' type='checkbox' value='"+item+"' class='defaultCheck1'>" +
    //         "<label  form-check-label for='defaultCheck1'><a class='region_menu' href='#' name='"+item+"'>" + name +"</a></label></div>";
    //     accordion.addCollapse('.card',list_regions);
    //
    //     //Все чекбоксы активны
    //     $('body input:checkbox').prop('checked', true);

        substation[item] = {
            'name':name,
            'marker_coord':marker_coord,
            'scale':lalo,
        };
    }
    //Цикл рисования Polyline для линий
    for (var item in json_cords_line){
        var line = json_cords_line[item]['coordinates'];
        var name = json_cords_line[item]['name'];
        // var label_coordinats = json_cords_reg[item]['label_coordinats'];

        //Создание  Polyline для соединений подстанций по координатам опор
        var latlngs = line;
        var polyline = L.polyline(latlngs, {color: 'red'}).addTo(mymap);
        // zoom the map to the polyline
        mymap.fitBounds(polyline.getBounds());
        mymap.addLayer(polyline);
        polyline.addTo(mymap);

        //Все чекбоксы активны

        // // добавление названия подстанции
        // var textLatLng = label_coordinats;
        // var myTextLabel = L.marker(textLatLng, {
        //     icon: L.divIcon({
        //         className: displayOptions['classNameLabel'],   // Set class for CSS styling
        //         html: name
        //     }),
        //     draggable: displayOptions['draggableLabel'], // Allow label dragging...?
        //     zIndexOffset: displayOptions['zIndexOffsetLabel']// Make appear above other map features
        // });
        // mymap.addLayer(myTextLabel);
        // myTextLabel.addTo(mymap);

// mymap.removeLayer(line[item]['polyline']);
        line[item] = {
            'name':name,
            'line':line,
            'polyline':polyline
        };
    }
    //Конец цикла
    //###################################################################################################################3







    //создание карточки аккордина линии
    accordion.addCard('.accordion','headingTwo',lineBody,lineBox,'collapseTwo');
    accordion.addCollapse('.card','Line','test1');
    //создание карточки аккордина подстанции
    accordion.addCard('.accordion','headingThree',substBody,substBox,'collapseThree');
    accordion.addCollapse('.card','Substation');
    //Чекбокс для Line по умолчанию всегда установлен
    $('body input.linebox:checkbox').prop('checked', true);
    $('body input.title:checkbox').prop('checked', true);
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
//     setInterval(baloonMaker,10000);
//     baloonMaker();
//
//     //#########################################################################################################
//     //AJAX
//     //#########################################################################################################
//
//     function baloonMaker(){
// //        markers.clearLayers();
// //        Очистка массиыва сообщений для всех регионов
//         for (var i = 0; i <regions.length; i++){
//             regions[i]['messages'] = [];
//         }
//         var arr = [];
//         query=$.ajax({
//             url: 'https://10.0.0.93/cfbi/index.php/api/get_sitiuation/50',
//             type:'POST'
//         });
//         query.done(function (response, textStatus, jqXHRб){
//             var dataJson = JSON.parse(response);
//             console.log(dataJson);
//             for(var j = 0;j<dataJson.length;j++){
//                 var id_region = dataJson[j]['fk_region'];
//                 var region_messeges = dataJson[j]['text'];
//                 var time_messeges = dataJson[j]['date_time'];
//                 for (var i = 0; i < regions.length; i++) {
//                     if (id_region == regions[i]['fk_region']) {
//                         regions[i]['messages'].push(region_messeges);
//                         regions[i]['time_messages'].push(time_messeges);
//                         console.log(regions[i]['messages'])
//                     }
// //            }
//                 }}
//             //Общее количество сообщений для всех регионов
// //        var numberOfMessege =0;
// //        for(var i = 0;i<json_cords_reg.length;i++){
// //            var num_mess = regions[i]['messages'];
// //            regions[i]['amount_mess'] = num_mess.length;
// //            var numberOfMessege =  num_mess.length + numberOfMessege;
// ////        console.log(regions[i]['amount_mess']);
// //        }
// //####################################################################################################
//             var textLatLng = label_coordinats;
//             //Функция для группировки маркеров по количеству сообщений для каждого региона
//             function populate(){
//                 markers.clearLayers();
//                 for (var i = 0; i <regions.length; i++) {
// //                    console.log(regions[i]['messages'].length)
//                     for(var j = 0; j< regions[i]['messages'].length;j++){
//                         var latlng = regions[i]['scale'];
//                         var m = L.marker(L.latLng(latlng));
//                         m['cluster_id'] = i;
//                         markers.addLayer(m);
//
//                         //установка персанилизированной иконки для маркера
// //                    m.setIcon(myIcon);
//                         // markers['region_messeges']=regions[i]['messages];
// //                    markers.refreshClusters(m);
//                     }
//                     markers['region_id'] = i;
//                     mymap.addLayer(markers);
//                 }
//                 return false;
//             }
//             //обработчик для одиночных маркеров
//             markers.on('clusterclick', function (cluster) {
//                 $( function() {
//                     $( "#dialog" ).dialog();
// //                console.log(a);
//                     //Получение всех дочерних элементов текущего кластера
//                     var current_cluster = cluster.layer.getAllChildMarkers()
// //                    console.log(cluster.layer.getAllChildMarkers()[0])
//                     var reg_id =current_cluster[0]['cluster_id'];
//                     var date = regions[reg_id]['time_messages'];
//
//                     var sms = regions[reg_id]['messages'];
//                     $("#dialog>table>tbody").html("");
//
//                     for(var i = 0; i < sms.length;i++){
//                         var numRow ='row'+i;
//                         $("#dialog>table>tbody").append('<tr id ='+numRow+'></tr>');
//                         $("#dialog>table>tbody>tr#"+numRow+"").append('<th scope="row">'+(i+1)+'</th>');
//                         $("#dialog>table>tbody>tr#"+numRow+"").append('<td>'+ date[i]+'</td>');
//                         $("#dialog>table>tbody>tr#"+numRow+"").append('<td>'+ sms[i]+'</td>');
//                     }
//                 } );
//             });
//             //обработчик для одиночных маркеров
//             markers.on('click', function (marker) {
//                 $( function() {
//                     $( "#dialog" ).dialog();
//                     var reg_id =marker.layer['cluster_id'];
//                     var sms = regions[reg_id]['messages'];
//                     var date = regions[reg_id]['time_messages'];
//                     $("#dialog>table>tbody").html("");
//                     $("#dialog>table>tbody").append('<tr></tr>');
//                     $("#dialog>table>tbody>tr").append('<th scope="row">1</th>');
//                     $("#dialog>table>tbody>tr").append('<td>'+ date[0]+'</td>');
//                     $("#dialog>table>tbody>tr").append('<td>'+ sms[0]+'</td>');
//                 } );
//             });
//
//             populate();
        // });}

</script>
<!--
<div id="dialog" title="Сообщения">
    <table class="table table-bordered table-hover table-sm">
        <thead>
        <tr class="table_head">
            <th scope="col">#</th>
            <th scope="col">Date</th>
            <th scope="col">Message</th>
        </tr>
        </thead>
        <tbody>

        </tbody>
    </table>
</div> -->
</body>
</html>

<!---->
<!--//console.log(regions);-->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!---->
<!--//-->
<!--////Добавление или удаление полигонов региона по флагу-->
<!--//    function forAllPoligons(flag=true) {-->
<!--//        for (var item in json_cords_reg) {-->
<!--//            if(flag) {-->
<!--//                var coord = json_cords_reg[item]['coordinates'];-->
<!--//                // var name = json_cords_reg[item]['name'];-->
<!--//                // var label_coordinats = json_cords_reg[item]['label_coordinats'];-->
<!--//                var polygon = L.polygon(coord, {-->
<!--//                    color: displayOptions['colorPpoligon'], weight: displayOptions['weightPoligon'],-->
<!--//                    opacity: displayOptions['opacityPoligon'], fillColor: displayOptions['fillColorPoligon'],-->
<!--//                    dashArray: displayOptions['dashArrayPoligon']-->
<!--//                });-->
<!--//                polygon.addTo(mymap).bindPopup(name);-->
<!--//                mymap.addLayer(polygon);-->
<!--//                regions[item] = {-->
<!--//                    'polygon':polygon-->
<!--//-->
<!--//                };-->
<!--//-->
<!--//            }-->
<!--//            else{-->
<!--//                mymap.removeLayer(regions[item]['polygon']);-->
<!--//            }-->
<!--//        }-->
<!--//    };-->
<!--//    //Добавление или удаление имени региона по флагу-->
<!--//    function forAllLabels(flag=true) {-->
<!--//        for (var item in json_cords_reg) {-->
<!--//            if (flag) {-->
<!--//                var name = json_cords_reg[item]['name'];-->
<!--//                var label_coordinats = json_cords_reg[item]['label_coordinats'];-->
<!--//                var myTextLabel = L.marker(label_coordinats, {-->
<!--//                    icon: L.divIcon({-->
<!--//                        className: displayOptions['classNameLabel'],   // Set class for CSS styling-->
<!--//                        html: name-->
<!--//                    }),-->
<!--//                    draggable: displayOptions['draggableLabel'], // Allow label dragging...?-->
<!--//                    zIndexOffset: displayOptions['zIndexOffsetLabel']// Make appear above other map features-->
<!--//                });-->
<!--//                mymap.addLayer(myTextLabel);-->
<!--//                myTextLabel.addTo(mymap);-->
<!--//                regions[item] = {-->
<!--//                    'name': name,-->
<!--//                    'polygon': polygon,-->
<!--//                    'label': myTextLabel,-->
<!--//                    'scale': lalo};-->
<!--//            }-->
<!--//            else-->
<!--//            {-->
<!--//                mymap.removeLayer(regions[item]['label']);-->
<!--//            }-->
<!--//        }-->
<!--//    };-->
<!--//    forAllPoligons();-->
<!--//    // setTimeout(forAllPoligons(false),40000);-->
<!--//    forAllLabels();-->
