<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/*

*/

class Qgeovision extends CI_Controller {
	function __construct(){
		parent::__construct();
		$this->load->helper('url');
        $this->load->helper('file');
//		$this->load->model("mdatamodel");
        
	}
	public function index()
	{
        $this->load->view('vqgeovision');
	}
function parse_xml(){
//$xmlfile = dirname(__dir__).'\..\..\..\uploads\tiod\peter_region.xml';
$xmlfile = '.\uploads\tiod\peter_region.xml';
    if (file_exists($xmlfile)) {
        $xml = simplexml_load_file($xmlfile);
//      echo var_dump($xml);
        foreach($xml->Item as $item){
            $names_text_value = $item['Name'];
            echo var_dump($xml);
//            echo $names_text_value;
            $child = array();
            array_push($child,$item);
        //echo var_dump($item->children());break;
        }
//        $json = json_encode($xml);
        //echo var_dump($json);
//        $array = json_decode($json, TRUE);
//        $data['xml'] = $xml;
//        $this->load->vars($data);
//        $this->load->view('vqgeovision');
    } else {
        exit('Не удалось открыть файл отсутствует.');
    }
    $obj = $child[0]->Attribute[2]["Value"];
//    echo(var_dump($obj));

//        echo $obj[0];

}
}
/* End of file welcome.php */
/* Location: ./application/controllers/welcome.php */