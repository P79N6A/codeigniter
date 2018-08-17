<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/*

*/

class Qgeovision extends CI_Controller {

    function __construct(){
        parent::__construct();
//        $this->checkLogin();
        $this->load->helper('url');
        $this->load->helper('file');
//        $this->load->model("mdatamodel");

    }

    Public function angular(){
        $this->load->view('vangular');
    }



         Public function parse_intergraph_file($path = '', $file_name = '') {
        //в зависимости  от расширения файла определяется тип содержащихся данных: mif - координаты, mid - наименования
        $path = './uploads/tiod/';
        $file = 'lep';
        $f_coordinates = $path . $file . '.mif';
        $f_name = $path . $file . '.mid';
        if ( !file_exists($f_coordinates) && !file_exists($f_name) ) die('File not exist');
        //Парсинг для наименований объекта
        $name_item = array();
        $fh = fopen($f_name, "r") or die("Can't open file");
        while ( ($s = fgets($fh)) !== false ) {
            $str = mb_convert_encoding($s, "UTF-8", "windows-1252");
            $pattern = '/"(.+)"/';
            preg_match($pattern, $str, $matches);
            if ( $matches ) {
                $name_item[] = $matches[1];
            }
        }
        fclose($fh) or die("Can't close file");
//         echo var_dump($name_item);


        //Парсинг координат объекта
        $coordinate_item = array();
        $fh = fopen($f_coordinates, "r") or die("Can't open file");
        //Проверям данных файла на принадлежность к подстанции либо линии, поиском ключевого слова Pline
        $f_check_type = file_get_contents($f_coordinates);
        if ( stripos($f_check_type, 'Point') ) {
            while ( ($s = fgets($fh)) !== false ) {
                $str = mb_convert_encoding($s, "UTF-8", "windows-1252");
                $pattern = '/Point[\s](.+)[\n]/';
                preg_match($pattern, $str, $matches);
                if ( $matches ) {
                    $coordinate_item[] = $matches[1];
                }
            }
            fclose($fh) or die("Can't close file");


//            $a = explode('    ',$coordinate_item[0]);
//            echo var_dump($a);exit();
            //преобразование к эталонному массиву данных с координатами подстанции
            $coordinate_float = array();
            foreach ( $coordinate_item as $coord ) {
                $item_coord = explode(' ', $coord);
//                echo var_dump($item_coord);exit();
                foreach ( $item_coord as $str ) {
                    //преобразование строковых значений координат в float
                    $str = array_map("floatval", $item_coord);
                }
                $coordinate_float[] = $str;

            }
            // echo var_dump($substation_coordinate_float);echo '<br><br>';
            //привидение координат к коодинатной системе используемой в leaflet
            $coordinate_float = array_map("array_reverse", $coordinate_float);
            //создание ассоциативного массива с координатами подстанциии их имен

            $data_substantion = array();
            for ( $i = 0; $i < count($name_item); $i++ ) {
                $temp_array = array('name' => $name_item[$i], 'coordinates' => $coordinate_float[$i]);
                $data_substantion[] = $temp_array;
            }
//            echo var_dump($data_substantion);
        }

// //###############################################################################################################
        //Парсинг координат линии
        elseif ( stripos($f_check_type, 'Pline') !== false  ) {
//            $arr_check_type = preg_split('/Data[\s]*[0-9]*/',$f_check_type);
//            //убираем данные файла с координатами идущие до строки Polyline
//            array_shift($arr_check_type);
////            echo var_dump($arr_check_type);exit();
//            $str_check_type = preg_split('/   /',$arr_check_type);
//            echo var_dump($str_check_type);exit();
            $item_coordinates_text = array();
            $fh = fopen($f_coordinates, "r") or die("Can't open file");;
            while ( ($s = fgets($fh)) !== false ) {
                $s = rtrim($s);
                if ( $s ) {
                    $item_coordinates_text[] = $s;
                }
            }
            fclose($fh) or die("Can't close file");


            $item_coordinate_group = array();
            $temp_array = array();

            $start_collet = false;
            $pline_points = array();
            $plines = array();
            $amount = count($item_coordinates_text);
            foreach ( $item_coordinates_text as $item_coord ) {
                $item_coord = array_shift($item_coordinates_text);
                if ( stripos($item_coord, 'Pline') !== false ) {
                    //если массив изначально пустой
                    if(count($pline_points) ==0){
                        //флаг  $start_collet = true указывает на наличие в строке Pline
                        $start_collet =true;
                        continue;
                    }
                    else{
                        $plines[] = $pline_points;
                        $pline_points = array();
                    }
                }
                else{
                    if($start_collet||count($item_coordinates_text)!=0){
    //                    $start_collet = true;
                        $arr_coord = explode('	', $item_coord);
    //                   преобразование строковых значений координат в float
                        $item_coordinate_float = array_map("floatval", $arr_coord);
//                        $reverse_coordinate = array_map("array_reverse", $item_coordinate_float);
                        $pline_points[] = $item_coordinate_float;
                    }
                    else{
                        $plines[] = $pline_points;
                    }
                }


        }

    }

        else{
            exit('Неудалось распарсить координаты');
        }
         array_shift($plines);
//                 echo '<pre>';
//           print_r($plines); // TEST
//           echo '</pre>';
//           exit;

            // echo var_dump($line_coordinate_group);exit();
//             $reverse_coordinate = array_map("array_reverse", $plines);
//             print_r($reverse_coordinate); // TEST
//             echo '</pre>';
//             exit;
//            $arr_line = array();
             for ( $i = 0; $i < count($name_item); $i++ ) {
                 // $arr_coord = explode('    ', $pline[$i]);
//               //преобразование строковых значений координат в float
            $reverse_coordinate = array_map("array_reverse", $plines[$i]);
                $data_line = array('name' => $name_item[$i], 'coordinates' => $reverse_coordinate);
                $arr_line[] = $data_line;
            }
                   echo '<pre>';
           print_r($arr_line); // TEST
           echo '</pre>';
           exit;
//         // echo var_dump($arr_line);
//         // $json_data = json_encode($arr_line);
//         // $data['json_line'] = $json_data;
//         // $this->load->vars($data);

// //        $result = [
// //            'substation' => [
//                    [
// //                'name' => 'gfgg',
// //                'coordinates' => [ 'широта', 'долгота' ]
//                    ],
//                    ...
// //            ],
// //           'line' => [
//                    [
// //                'name' => 'gfgg',
// //                'coordinates' => [
//                          [ 'широта', 'долгота' ],
//                          [ 'широта', 'долгота' ],
//                            ...
//                      ]
//                    ],
//                    ...
// //            ]
// //        ];
    }

    /*
     *
     * $this->load->library('Unzip');
     * // Сохранение ZIP файла
        if(!move_uploaded_file( $file['tmp_name'],  $FCPATH.$this->config->item('cim_import_path') . $zip_file_name)) {
            $this->error_exit('E113');
        }


        mkdir($FCPATH . $this->config->item('cim_import_path') . '\\' . $unique_name);

        // or specify a destination directory
        $this->unzip->extract(
            $FCPATH . $this->config->item('cim_import_path') . $zip_file_name,
            $FCPATH . $this->config->item('cim_import_path') . '\\' . $unique_name
        );

        $zip_files = scandir($FCPATH . $this->config->item('cim_import_path').'\\' . $unique_name);

        foreach($zip_files as $index => $zip_files_name){
            if($zip_files_name == '.' || $zip_files_name == '..'){
                unset($zip_files[$index]);
            }
        }
        $zip_files = array_values($zip_files);

        unlink($FCPATH . $this->config->item('cim_import_path') . $zip_file_name);
     *
     * */




//     function parse_xml(){
// //        echo 'Текущая версия PHP: ' . phpversion();
//         //Функция для парсига строки координат
//         $label_coordinats_count =0;
//         $xmlfile = '.\uploads\tiod\peter_region.xml';
//         if (file_exists($xmlfile)) {
//             $xml = simplexml_load_file($xmlfile);
//             $arr = array();
//             foreach($xml->Item as $item){
//                 $child = $item->children();
//                 $parse_coordinat = $child->Attribute[2]["Value"];
//                 $parse_coordinats = (string)$parse_coordinat;
//                 //Замена круглых скобок на квадратные
//                 $non_reverse_coordinats = str_replace(array('(',')'),array('[',']'),$parse_coordinats);
//                 //Выделение полигонов для каждого региона
//                 $polygons = explode(";",$non_reverse_coordinats);

//                 //Преобразование строкового значение полигона в массив значений координат
//                 //Замена местами координат широты и долготы
//                 $polygon_aaray = array();
//                 foreach($polygons as $elements_of_polygon){

//                     if(is_array($elements_of_polygon)){
//                         foreach($elements_of_polygon as $str){
//                             $polygon_aaray[] = array_map("array_reverse",json_decode($str));
//                         }
//                     }
//                     else{
//                         $polygon_aaray[] = array_map("array_reverse",json_decode($elements_of_polygon));
//                     }
//                 }

//                 $name = (string)$item['Name'][0];
//                 //Массив с координатами начала надписи label для каджого региона
//                 $label_coordinats = array(array(59.933,30.33907),array(59.91717,30.27383),array(60.08728,30.22131),array(59.8103,30.1293),
//                     array(59.9428,30.20965),array(59.84119,30.39642),array(59.83326,30.30543),array(59.86654,29.86356),
//                     array(59.9904,30.3559),array(59.73218,30.37306),array(59.88032,30.20618),array(60.18796,29.75847),
//                     array(59.97563,30.41907),array(59.76677,30.58387),array(59.88239,30.4321),array(59.99384, 29.69116),
//                     array(60.01546,30.19177),array(59.96807,30.23779));



//                 $data_for_json = array('name'=>$name, 'coordinates' => $polygon_aaray,
//                     'label_coordinats' =>$label_coordinats[$label_coordinats_count]);
//                 array_push($arr,$data_for_json );

//                 $label_coordinats_count += 1;
//             }
//         }
//         else {
//             exit('Не удалось открыть файл отсутствует.');
//         }
// //    echo var_dump($arr);
//         $json_data = json_encode($arr);
//         $data['json'] = $json_data;
//         $this->load->vars($data);
//         $this->load->view('vdisplay');
//     }



}

/* End of file welcome.php */
/* Location: ./application/controllers/welcome.php */
