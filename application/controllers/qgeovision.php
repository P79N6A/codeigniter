<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/*

*/

class Qgeovision extends CI_Controller {

	function __construct(){
		parent::__construct();
//        $this->checkLogin();
		$this->load->helper('url');
        $this->load->helper('file');
//		$this->load->model("mdatamodel");
        
	}
	
	public function index()
	{
        $this->load->view('vqgeovision');
	}
function parse_xml(){
//    $path_to_xml = base_url()."uploads/tiod/peter_region.xml";
//    echo $path_to_xml;
//    echo file_exists('./uploads/tiod/peter_region.xml');
//    $string = read_file('./uploads/tiod/peter_region.xml');
//    echo $string;
//    //$str_xml = $this->file->read_file($path_to_xml);

    //$xmlfile = dirname(__dir__).'\..\..\..\uploads\tiod\peter_region.xml';
    $xmlfile = '.\uploads\tiod\peter_region.xml';

    //$xmlfile = ".";

//    echo $xmlfile;
    if (file_exists($xmlfile)) {
        $xml = simplexml_load_file($xmlfile);
//        echo var_dump($xml);
        foreach($xml->Item as $item){
            $names_text_value = $item['Name'];
//            $coordinates_text_value = $item['Code'];
//            print "$names_text_value\n";
//            foreach($item->children as $child)
                echo var_dump($item->children());break;

//            echo var_dump($item->children());break;
//            print "$coordinates_text_value\n";
        }







        $json = json_encode($xml);
//        echo var_dump($json);
        $array = json_decode($json, TRUE);

        $data['xml'] = $xml;
        $this->load->vars($data);
        $this->load->view('vqgeovision');

    } else {
        exit('Не удалось открыть файл отсутствует.');
    }

}
}

/* End of file welcome.php */
/* Location: ./application/controllers/welcome.php */