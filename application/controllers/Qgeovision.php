<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/*

*/

class Qgeovision extends CI_Controller {

    function __construct(){
        parent::__construct();
//        $this->checkLogin();
        $this->load->helper('url');
        $this->load->helper('file');
//
//        $this->load->library('session');
//        $this->load->library('memcache_lib');
//        $this->config->load('config_quasy');
//        $this->config->load('config_qvocs');
//        $this->config->load('config_edom');
//        $this->load->model('mdatamodel');
//        $this->mdatamodel->set_database($this->config->item("default_db"));
//        $this->current_table='spb_region';
    }
//Функция установки текущей таблицы из БД config'а
Public function import_intergraph(){
      //прописывание путей к файлам для парсинга
       $fline_coordinates= './uploads/tiod/lep_l.mif';
       $fline_name= './uploads/tiod/lep_l.mid';
       $fsubstation_coordinate= './uploads/tiod/substation_t.mif';
       $fsubstation_name= './uploads/tiod/substation_t.mid';

       //Парсинг имени линий
       $line_name_text = array();
       $fh = fopen($fline_name, "r") or die("Can't open file");
           while (($s= fgets($fh)) !== false) {
             $s= rtrim($s);
             if($s){
               $line_name_text[] = $s;
             }
           }
       fclose($fh) or die("Can't close file");
       // echo var_dump($line_name_text);echo '<br><br>';

       //Парсинг имени подстанций
       $substation_name_text = [];
       $fh = fopen($fsubstation_name, "r") or die("Can't open file");
           while (($s= fgets($fh)) !== false) {
             $s= rtrim($s);
             if($s){
               $substation_name_text[]=$s;
             }
           }
       fclose($fh) or die("Can't close file");
       // echo var_dump($substation_name_text);echo '<br><br>';

       //Парсинг координат подстанции
       $substation_coordinate_text = [];
       $fh = fopen($fsubstation_coordinate, "r") or die("Can't open file");
           while (($s= fgets($fh)) !== false) {
             $s= rtrim($s);
             if($s){
               $substation_coordinate_text[]=$s;
             }
           }
         fclose($fh) or die("Can't close file");
       //преобразование к эталонному массиву данных с координатами подстанции
       $substation_coordinate_float =[];
       foreach($substation_coordinate_text as $substation_coord){
           $item_coord = explode(' ',$substation_coord);
           foreach($item_coord as $str ){
             //преобразование строковых значений координат в float
             $str = array_map("floatval",$item_coord);
           }
           $substation_coordinate_float[]=$str;

       }
       // echo var_dump($substation_coordinate_float);echo '<br><br>';
       //привидение координат к коодинатной системе используемой в leaflet
       $substation_coordinate_float = array_map("array_reverse",$substation_coordinate_float);
       //создание ассоциативного массива с координатами подстанциии их имен
       $data_substantion =[];
       for($i = 0;$i<count($substation_name_text);$i++){
         $temp_array = array('name'=>$substation_name_text[$i],'coordinates' => $substation_coordinate_float[$i]);
         $data_substantion[] = $temp_array;
       }
       // echo var_dump($data_substantion);echo '<br><br>';
       $json_data = json_encode($data_substantion);
       $data['json_substation'] = $json_data;
       $this->load->vars($data);
//###############################################################################################################
       //Парсинг координат линии
       $line_coordinates_text = [];
       $fh = fopen($fline_coordinates, "r") or die("Can't open file");;
           while (($s= fgets($fh)) !== false) {
             $s= rtrim($s);
             if($s){
               $line_coordinates_text[]=$s;
             }
           }
           fclose($fh) or die("Can't close file");echo '<br><br>';
       // echo var_dump($line_coordinates_text);
       //объединяем координаты линии в группы
       $line_coordinate_group =[];
       $temp_array = [];
       foreach($line_coordinates_text as $line_coord){
           if($line_coord!='Pline'){
              $arr_coord = explode('	',$line_coord);
              //преобразование строковых значений координат в float
               $substation_coordinate_float = array_map("floatval",$arr_coord);
               $temp_array[] = $substation_coordinate_float;
           }
           else {
               $temp_array =array_map("array_reverse",$temp_array);
               $line_coordinate_group[] = $temp_array;
               $temp_array = [];
           } }
         // echo var_dump($line_coordinate_group);exit();
       $arr_line =[];
       for($i = 0;$i<count($line_coordinate_group);$i++){
           $data_line = array('name'=>$line_name_text[$i],'coordinates' => $line_coordinate_group[$i]);
           $arr_line[] = $data_line;
       }
       // echo var_dump($arr_line);
       $json_data = json_encode($arr_line);
       $data['json_line'] = $json_data;
       $this->load->vars($data);
   }

    public function current_db_table($table){
        $current_db =  $this->config->item('tiot');
        $current_table = $current_db.".".$table;
        return $current_table;
    }
    //Функция выборки данных из базы данных
    public function load_map(){
        $arr = array();
        //Выборка всех данных из базы данных tiot.spb_region
        $data_from_db = $this->mdatamodel->table_select
        ("SELECT region, coordinates, label_coordinate FROM {$this->current_db_table('spb_region')}");
        //Создание массива с данными для отправки в  view
        foreach($data_from_db as $item){
            $str_poligon = json_decode($item['coordinates']);
            $str_label = json_decode($item['label_coordinate']);
            $data_for_json = array('name'=>$item['region'], 'coordinates' => ($str_poligon),
                'label_coordinats' =>$str_label);
            array_push($arr,$data_for_json );
        }
        $json_data = json_encode($arr);
        $data['json'] = $json_data;
        $this->load->vars($data);
        $this->load->view('vdisplay');
    }

    public function index()
    {
        $this->load_map();
    }

    function test($to = 'World'){
//        print_r(dirname(__dir__));exit();
        echo "Hello {$to}!".PHP_EOL;
//        $php_obj = json_decode('[[2,4],[3,5]]');
//        var_dump($php_obj);

//        print_r(eval('return '.$str));
        $this->load->view('test2');
    }

    function parse_xml(){
//        return;
        //Функция для парсига строки координат
        $label_coordinats_count =0;
        $xmlfile = './uploads/tiod/peter_region.xml';
        if (file_exists($xmlfile)) {
            $xml = simplexml_load_file($xmlfile);
            $arr = array();
            foreach($xml->Item as $item){
                $child = $item->children();
                $parse_coordinats = (string)$child->Attribute[2]["Value"];
                //Замена круглых скобок на квадратные
                $non_reverse_coordinats = str_replace(["(",")"],["[","]"],$parse_coordinats);
                //Выделение полигонов для каждого региона
                $polygons = explode(";",$non_reverse_coordinats);

                //Преобразование строкового значение полигона в массив значений координат
                //Замена местами координат широты и долготы
                $polygon_aaray = array();
                foreach($polygons as $elements_of_polygon){

                    if(is_array($elements_of_polygon)){
                        foreach($elements_of_polygon as $str){
                            $polygon_aaray[] = array_map("array_reverse",json_decode($str));
                        }
                    }
                    else{
                        $polygon_aaray[] = array_map("array_reverse",json_decode($elements_of_polygon));
                    }
                }

                $name = (string)$item['Name'][0];
                //Массив с координатами начала надписи label для каджого региона
                $label_coordinats = array([59.933,30.33907],[59.91717,30.27383],[60.08728,30.22131],[59.8103,30.1293],
                    [59.9428,30.20965],[59.84119,30.39642],[59.83326,30.30543],[59.86654,29.86356],
                    [59.9904,30.3559],[59.73218,30.37306],[59.88032,30.20618],[60.18796,29.75847],
                    [59.97563,30.41907],[59.76677,30.58387],[59.88239,30.4321],[59.99384, 29.69116],
                    [60.01546,30.19177],[59.96807,30.23779]);

                $data_for_json = array('name'=>$name, 'coordinates' => $polygon_aaray,
                    'label_coordinats' =>$label_coordinats[$label_coordinats_count]);
                array_push($arr,$data_for_json );

                $label_coordinats_count += 1;
                //добавление данных в таблицу

//                $data['region']= $data_for_json['name'];
//                $data['coordinates'] =json_encode($data_for_json['coordinates']);
//                $data['label_coordinate'] =json_encode($data_for_json['label_coordinats']);
//                echo $this->config->item("default_db");
//                $this->mdatamodel->set_database($this->config->item("default_db"));
//                $id = $this->mdatamodel->create($this->current_db_table('spb_region'),$data);
                //$data_from_db = $this->mdatamodel->open_id($id,'tiot.spb_region','id');
                //$this->build();
            }
        }
        else {
            exit('Не удалось открыть файл отсутствует.');
        }
//    echo var_dump($arr);
        $this->import_intergraph();
        $json_data = json_encode($arr);
        $data['json_region'] = $json_data;
        $this->load->vars($data);
        $this->load->view('Vqgeovision');
}

public function get_reg(){

      $file = base_url()."/uploads/lt1.txt";
      $text = file_get_contents ($file, true);

      $book = iconv("cp1251","utf-8", $text);
      print_r($book);
      $result = preg_match_all('/\w+/',$book,$arr);
    $data['result']= json_encode($arr[0]);

    $this->load->vars($data);
    $this->load->view('Coollphp');

}




}
