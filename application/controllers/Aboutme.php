<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Aboutme extends CI_Controller{
    
     public function about(){
         $data["name"] = "Vladimir";
         $data["secondname"] = 'Prikhodko';
         $data["age"] = 30;
         $this->load->view('about_view', $data);
    }
    
    
    
    
    
}