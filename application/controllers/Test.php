<?php
/**
 * Created by PhpStorm.
 * User: Vladimir
 * Date: 01.07.2018
 * Time: 21:40
 */
class Test extends CI_Controller {
	$this->load->model('mtest'); // загрузили модель
    public function index(){
        echo "Test is worked!";
    }

    function  mydb()
    {
        // $this->load->model('mtest'); // загрузили модель
        $data['test'] = $this->mtest->get_data_fromtest();
        $this->load->view('vtest',$data);   //загрузили вид
    }
}