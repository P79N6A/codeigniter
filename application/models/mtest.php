/**
 * Created by PhpStorm.
 * User: Vladimir
 * Date: 01.07.2018
 * Time: 20:37
 */
<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Mtest extends CI_Model {
    function get_data_fromtest()
    {
        $query = $this->db->get('test'); // Выбираем всю информацию из таблицы test
        return $query->result_array();  // возвращаем результат работы нашей функции в виде массива, т.е один
        // гигантский массив во всеми нашими данными.
    }

}