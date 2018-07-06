<?php
/**
* Created by PhpStorm.
* User: vprikhodko
* Date: 05.07.2018
* Time: 17:16
*/
?>
<!doctype html>
<html>
<?php
include("header.php");
?>

<?php
//$xml_file = base_url()."quasy/apps/qgeovision"; // ФайлD:\Apache24\htdocs\cfbi\quasy\apps\qgeovision\Peter_region.xml
//
//// Получаем данные из него
//
//$sx = simplexml_load_file($xml_file . '/Peter_region.xml');
//foreach ($sx->person as $person) {
//    $firstname_text_value = $person->firstname;
//    $lastname_text_value = $person->lastname;
//    print "$firstname_text_value $lastname_text_value\n";
//}
//
//// Отображаем содержимое
//print_r($mass);
//?>
<body>
    <div class = "content">
        <div id="mapid"></div>
    </div>


    <script>
        var mymap = L.map('mapid').setView([30.269494986991,59.90231956249],17);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mymap);

    </script>
</body>
</html>

