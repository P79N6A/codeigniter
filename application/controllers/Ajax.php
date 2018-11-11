<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/*

*/

class Ajax extends CI_Controller {

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


	public function index(){
        echo lang("E101");
	}
    /*
     * Used for test purposes
     * TSRuban
     */
	public function gen_id_test(){
		for ($i=0;$i<100;++$i){
			array_push($this->arr,$this->cfsecurity->get_unique_id());
		}
		asort($this->arr);
		print_r(array_count_values($this->arr));
	}

    public function test(){
		echo $this->session->userdata("LAN").'<br>';
        echo lang("txt_name");
	}


    /*
     * AJAX data fetching function
     */
    public function load_table_data($app = null, $tbl = null,$filter0=null,$filter1=null){

        $data["table_data"] =$this->include_table_conf($app,$tbl);
        $data["app"] =$app;
        $data["tbl"] =$tbl;

        $this->load->library('Datatables');
        if ($data["table_data"]){
			$data["table_info"]  =$data["table_data"]["DATATABLE_CONFIG"];
        }
         $this->datatables->set_database($data["table_data"]["DB"]);
        $this->datatables->select($data["table_info"]["select"]);
        $this->datatables->from($data["table_info"]["from"]);
        if (isset($data["table_info"]["join"])){
            $this->datatables->join($data["table_info"]["join"][0],$data["table_info"]["join"][1],$data["table_info"]["join"][2]);
        }
        if (isset($data["table_info"]["where"])){
            /*if ($filter0){
                if(isset($data["table_info"]["where"][0])){
                    $this->datatables->where($data["table_info"]["where"][0],$filter0);
                }
            }
            if ($filter1){
                if(isset($data["table_info"]["where"][1])){
                    $this->datatables->where($data["table_info"]["where"][1],$filter1);
                }
            }*/
			if(isset($data["table_info"]["where"][0])){
				$this->datatables->where($data["table_info"]["where"][0],$filter0);
			}
        }

        $group_btn_option ='';
		if (isset($data["table_info"]["add_column"])){
			$add_column = $data["table_info"]["add_column"];
			$this->datatables->add_column($add_column[0], $add_column[1], $add_column[2]);
        }
        if (!empty($data["table_info"]["options"])){
            for ($i=0;$i<count($data["table_info"]["options"]); $i++){
                $group_btn_option.='<a title="'.$data["table_info"]["options"][$i][2].'" class=" btn btn-sm " '.site_url($data["table_info"]["options"][$i][1]).'><span class='.$data["table_info"]["options"][$i][0].'></span></a> ';
            }
        }
		$this->datatables->add_column('view',$group_btn_option,$data["table_info"]["pk"]);
        echo ($this->datatables->generate());
    }

    /*
     *
     */
    public function load_table($app='qconframe',$tbl=null){
		//$this->config->load('config_qobj');
        $data["table_info"] =$this->include_table_conf($app,$tbl);
        $data["app"] =$app;
        $data["tbl"] =$tbl;
        $this->load->library('table');
        $this->load->vars($data);
		$this->load->view("ajax_render_table");
    }

    /*
     * Inculdes table config to display data in datatable library
     *
     * TSRuban
     */
    private function include_table_conf($app='qconframe',$tbl=null){
		if (!isset($tbl)){
			return null;
		}
		if (!file_exists($this->config->item("quasy_folder").'/apps/'.$app.'/tables/'.$tbl.'.php')){
			return null;
		}
		include $this->config->item("quasy_folder").'/apps/'.$app.'/tables/'.$tbl.'.php';

        if(!isset($table)){
            return null;
        }

		return $table;
	}

    /*
     * Private mentod thats runs any post saving pricedures defined in forms.
     * eg: q3\quasy\apps\qobject\forms\acline_segment.php
     * TSRuban
     */
    private function run_post_save_method($form = null, $id = null, $mode = null){
        if (isset($form["POST_SAVE"])){
            if (isset($form["POST_SAVE"]["method"])){

                $args = array();
                if(isset($form["POST_SAVE"]["args"])){
                    $args = $form["POST_SAVE"]["args"];
                }

                Modules::run($form["POST_SAVE"]["method"], $id, $mode, $args);
            }
        }
    }

    /*
     * Private mentod thats runs memcache update procedure
     * eg: q3\quasy\apps\qconframe\forms\project.php
     * $form["MEMCACHE_UPDATE"] = TRUE;
     * TSRuban
     */
    private function run_memcache_update($form=null){
        if(!$form) return;
        if (!isset($form["MEMCACHE_UPDATE"])) return;
        if ( $form["MEMCACHE_UPDATE"]!= ""){
            $this->memcache_lib->delete($form["MEMCACHE_UPDATE"]);
        }
    }
    /*
     * This is the save function will be called when save button clicked in forms
     * app: name of the application "qconframe" its in (Q3\quasy\apps\<qconframe>)
     * frm: name of the form configuration its in (Q3\quasy\apps\<qconframe>\forms\<frm>)
     * TSRuban
     */
	public function save_form($app = 'qconframe',$frm = null){
		if (!$_POST) die -1;

        $network_id = null;

		$form = $this->include_form($app,$frm);
		if (!$form){
			die("Form ".$frm." not found");
		}
		$this->load->helper('form');
		$this->load->library('form_validation');
		if (isset($form["DB"])){
			if ($form["DB"]!=""){
				$this->mdatamodel->set_database($form["DB"]);
			}
		}


		for ($i = 0; $i < count($form["FLD"]); ++$i){ //sets the validation rules
            // Пропуск элементов формы доступных только при Редактировании
            if(intval($this->input->post($form["OBJID"])) <= 0 && isset($form["FLD"][$i]["only_edit"]) &&
                $form["FLD"][$i]["only_edit"] === true){
                continue;
            }

            if (is_array($this->input->post($form["FLD"][$i]["id"]))) {
                foreach ($this->input->post($form["FLD"][$i]["id"]) as $key => $value) {
                    $this->form_validation->set_rules(
                        $form["FLD"][$i]["id"].'['.$key.']',
                        '"'.$form["FLD"][$i]["label"].'"',
                        $form["FLD"][$i]["rules"]
                    );
                }
            }
            else{
                $this->form_validation->set_rules(
                    $form["FLD"][$i]["id"],
                    '"'.$form["FLD"][$i]["label"].'"',
                    $form["FLD"][$i]["rules"]
                );
            }

		}

		$this->form_validation->set_rules($form["OBJID"]); //additional rule for objid

        if( $this->form_validation->run() == FALSE
            && count($this->form_validation->error_array()) > 0
        ){ //runs the validation and sends the error to browser
			$err = array("result"=>-1, "error"=>$this->form_validation->error_array());
			echo json_encode($err);
		}
		else { //if no error continue to saving procedure
            //saving data in asses array.
			$sve_data = array();
            // Массив значений для переодической секции
            $period_section_data = array();
			for ($i = 0; $i < count($form["FLD"]); ++$i){
                if ($form["FLD"][$i]["type"] === "label") continue;
				if ($form["FLD"][$i]["type"] === "password"){
					$sve_data["salt"] = $this->cfsecurity->get_salt();
					$sve_data[$form["FLD"][$i]["id"]] = $this->cfsecurity->get_password_hash($this->input->post($form["FLD"][$i]["id"]),$sve_data["salt"]);
				}
				elseif ($form["FLD"][$i]["type"] === "uuid"){
					if ($this->input->post($form["FLD"][$i]["id"])==""){
						$sve_data[$form["FLD"][$i]["id"]] = $this->cfsecurity->get_uuid(); //mrid
					}
				}
				elseif ($form["FLD"][$i]["type"] === "sql_select"){
					if ($this->sql_check($this->input->post($form["FLD"][$i]["id"])) === FALSE){
						$err = array("result"=>-1,"error"=>array('sql'=>'invalid sql'));
                        echo json_encode($err);
                        exit;
					}
                    else{
                        $sve_data[$form["FLD"][$i]["id"]] = $this->input->post($form["FLD"][$i]["id"]);
                    }
				}
				elseif ($form["FLD"][$i]["type"] === "unique_id"){
					if ($this->input->post($form["FLD"][$i]["id"])==""){
						$sve_data[$form["FLD"][$i]["id"]] = $this->cfsecurity->get_unique_id(); //bigint
					}
				}
				elseif ($form["FLD"][$i]["type"] === "group_checkbox"){

                    if(isset($form["FLD"][$i]["sql"])){
                        //$sve_data[$form["FLD"][$i]["id"]] = $this->input->post($form["FLD"][$i]["option"][$j]);
                    }
                    else{
                        for ($j=0;$j<count($form["FLD"][$i]["option"]);$j++){
                            $sve_data[$form["FLD"][$i]["option"][$j]]=$this->input->post($form["FLD"][$i]["option"][$j]);
                        }
                    }
				}
                elseif ($form["FLD"][$i]["type"] === "file"){
                    $fconfig = $this->config->item('upload');
                    $fconfig["upload_path"] .= 'cfe'.'/';
                    if (!is_dir($fconfig["upload_path"])){
                    	mkdir($fconfig["upload_path"],0755,TRUE);
                    }
                    $this->load->library('upload',$fconfig);
					if (!$this->upload->do_upload()){
                        $err = array("result"=>-1,"error"=>array($this->upload->display_errors()));
                        echo json_encode($err);
                        exit;
                    }
				}
                elseif($form["FLD"][$i]["type"] == 'periodical_section'){
                    $period_section_data[$form["FLD"][$i]["id"]] = $form["FLD"][$i];
                    $period_section_data[$form["FLD"][$i]["id"]]['value'] = array();

                    $post_value = $this->input->post($form["FLD"][$i]["id"]);

                    if (is_array($post_value)){
                        $period_section_data[$form["FLD"][$i]["id"]]['value'] = $post_value;
                    }
                }
				else {
                    if ($this->input->post($form["FLD"][$i]["id"]) === ""){
                        $sve_data[$form["FLD"][$i]["id"]] = NULL;
                    }
                    else {
                        $sve_data[$form["FLD"][$i]["id"]] = $this->input->post($form["FLD"][$i]["id"]);
                    }
				}

                if($form["FLD"][$i]["id"] == "network_id_for_new_object"){
                    $network_id = $this->input->post($form["FLD"][$i]["id"]);
                    continue;
                }
			}

			$id = $this->input->post($form["OBJID"]);

			if ($id > 0){//$table=null,$key_field=null,$id=null,$data UPDATE
				$save_table = $form["BEOM"].'.'.$form["TABLE"];
				$status = $this->mdatamodel->update($save_table, $form["OBJID"], $id, $sve_data);
                if ($status["result"] == 1){
                    // Если в форме есть переодические секции
                    if(count($period_section_data) > 0){
                        // Для каждой секции проводим сохранение
                        foreach($period_section_data as $period_section_item){
                            $this->periodical_section_save($period_section_item, $form, $id);
                        }
                    }

                    //check and run for POST_SAVE methods if any
                    $this->run_post_save_method($form, $status["uuid"], "UPDATE");
                    $this->run_memcache_update($form);
                }
				echo json_encode($status);
			}
			else {
				//$uuid = $this->cfsecurity->get_unique_id();//generate a UUID
				//$sve_data[$form["OBJID"]]=$uuid;
				if (isset($form["TABLE"])){
					$save_table = $form["BEOM"].'.'.$form["TABLE"]; //BEOM table name
				}

				$sts = $this->mdatamodel->create($save_table, $sve_data);
                if ($sts > 0){
					//$this->session->set_flashdata('msg',ucfirst($form["TABLE"]).' Saved');
					if (isset($sve_data[$form["OBJID"]]) && ($sve_data[$form["OBJID"]] > 0)){
						$sus = array("result"=>1, "uuid"=>$sve_data[$form["OBJID"]]);
					}
					else {
						$sus = array("result"=>1, "uuid"=>$sts);
					}

                    // Если в форме есть переодические секции
                    if(count($period_section_data) > 0){
                        // Для каждой секции проводим сохранение
                        foreach($period_section_data as $period_section_item){
                            // Если при создании указаны элементы секции
                            if(count($period_section_item['value']) > 0){
                                $this->periodical_section_save($period_section_item, $form, $sts);
                            }
                        }
                    }

                    //check and run for POST_SAVE methods if any

                    $mode = 'INSERT';
                    if($network_id != null){
                        $mode = $network_id;
                    }

                    $this->run_post_save_method($form, $sus["uuid"], $mode);
					echo json_encode($sus);
				}
				else {
					$sus = array("result"=>-1,"error"=>array('error'=>$sts));
					echo json_encode($sus);
				}
			}
		}//if no error
	}

    /**
     * Отображение формы
     * @param string $app
     * @param string $form_name
     */
	public function load_form($app = 'qconframe', $form_name = ''){
		// Подключение формы
        $data["form_data"] =$this->include_form($app, $form_name);

		if (isset($data["form_data"]["DB"])){
			if ($data["form_data"]["DB"]!=""){
				$this->mdatamodel->set_database($data["form_data"]["DB"]);
			}
		}

		for ($i=0;$i<count($data["form_data"]['FLD']);$i++){

            switch($data["form_data"]['FLD'][$i]['type']){

                // Table Select
                case 'table_select':
                // Чекбоксы
                case 'group_checkbox':

                    // Если есть SQL
                    if(isset($data["form_data"]['FLD'][$i]['sql'])){
                        // Подключение к БД
                        if(isset($data["form_data"]['FLD'][$i]['db']) && $data["form_data"]['FLD'][$i]['db'] != ''){
                            $this->mdatamodel->set_database($data["form_data"]['FLD'][$i]['db']);
                        }
                        // Получение данных из БД
                        $data['data_select'][$data["form_data"]['FLD'][$i]['id']] = $this->mdatamodel->table_select($data["form_data"]['FLD'][$i]['sql']);

                        if(isset($data["form_data"]['FLD'][$i]['post_function'])){

                            foreach($data['data_select'][$data["form_data"]['FLD'][$i]['id']] as $index => $row_data){
                                $data['data_select'][$data["form_data"]['FLD'][$i]['id']][$index][$data["form_data"]['FLD'][$i]['display']] = $data["form_data"]['FLD'][$i]['post_function']($row_data);
                            }

                        }

                        // Возвращение подключения к БД формы
                        $this->mdatamodel->set_database($data["form_data"]["DB"]);
                    }

                break;

                case 'conf_select':
                    if (isset($data["form_data"]['FLD'][$i]['option']['conf_file'])){
                        $this->config->load($data["form_data"]['FLD'][$i]['option']['conf_file']);
                    }
                break;

                case 'base_voltage':
                    $fk_bay = null;
                    for ($j=0;$j<count($data["form_data"]['FLD']);$j++){
                        if ($data["form_data"]['FLD'][$j]['id'] == 'fk_bay'){
                            $fk_bay = $data["form_data"]['FLD'][$j]['value'];
                        }
                    }
                    $sql = "
                        SELECT voltage_level.fk_base_voltage,
					           base_voltage.name
					    FROM ".$data["form_data"]['BEOM'].".bay AS bay
					    LEFT JOIN ".$data["form_data"]['BEOM'].".voltage_level AS
						    ON bay.fk_voltage_level = voltage_level.id
					    LEFT JOIN ".$data["form_data"]['BEOM'].".base_voltage AS base_voltage
						    ON voltage_level.fk_base_voltage = base_voltage.id
					    WHERE bay.id = ".$fk_bay.";
					";
                    $data["base_voltage"]=$this->mdatamodel->table_select($sql);
                break;

                case 'periodical_section':

                break;
            }
		}

		if (!$data["form_data"]){
			die("Form ".$form_name." not found");
		}

		$this->load->helper('form');
		$data["table"] = $form_name;
		$data["app"] = $app;
        $data["load_type"] = 'create';

		$this->load->vars($data);
		$this->load->view("ajax_render_form");
	}

	public function get_user_info(){

	}

	private function include_form($app='qconframe',$form_name = ''){
		if (!isset($form_name)){
			return null;
		}
		if (!file_exists($this->config->item("quasy_folder").'/apps/'.$app.'/forms/'.$form_name.'.php')){
			return null;
		}
		include $this->config->item("quasy_folder").'/apps/'.$app.'/forms/'.$form_name.'.php';

        if(!isset($form)){
            return null;
        }

		return $form;
	}

	public function edit_form($app = 'qconframe', $form_name = '', $id = null){
        $this->load->helper('form');
        $this->load->library('form_validation');

        if (!$id){
            die("id not found");
        }

		$data["form_data"] = $this->include_form($app, $form_name);
		if (!$data["form_data"]){
			die("Form ".$form_name." not found");
		}

		if (isset($data["form_data"]["DB"]) && $data["form_data"]["DB"]!=""){
		    $this->mdatamodel->set_database($data["form_data"]["DB"]);
		}

		$data["table"] = $form_name;
		$data["obj"] = $this->mdatamodel->open_id(
            $id,
            '"'.$data["form_data"]["BEOM"].'"."'.$data["form_data"]["TABLE"].'"',
            $data["form_data"]["OBJID"]
        );

		if (empty($data["obj"])){
			die("Object empty");
		}

        if(!empty($data["obj"]['mrid']) && !isset($data["obj"]['code_tm'])){

            $this->mdatamodel->set_database($data["form_data"]["DB"]);

            $result_query_sap_id = $this->mdatamodel->open_id(
                $data["obj"]['mrid'],
                $this->config->item('obj').".sap_id",
                'mrid',
                ['code_tm']
            );

            if( is_array($result_query_sap_id)
                && isset($result_query_sap_id['code_tm'])
                && $result_query_sap_id['code_tm'] != ''
            ){
                $data["obj"]['code_tm'] = $result_query_sap_id['code_tm'];
            }

            $this->mdatamodel->set_database($data["form_data"]["DB"]);
        }

		foreach($data["form_data"]['FLD'] as $field){

            if (isset($data["form_data"]["DB"]) && $data["form_data"]["DB"]!=""){
                $this->mdatamodel->set_database($data["form_data"]["DB"]);
            }

			if ($field['type'] == 'table_select'){
				$data['data_select'][$field['id']]=$this->mdatamodel->table_select($field['sql']);


                if(isset($field['post_function'])){

                    foreach($data['data_select'][$field['id']] as $index => $row_data){
                        $data['data_select'][$field['id']][$index][$field['display']] = $field['post_function']($row_data);
                    }

                }


			}
			elseif ($field['type'] == 'table_hierarchy'){
				$sql = '
				    SELECT '.$field['column'].'
					FROM "'.$field['beom'].'".'.$field['table_name'].'
					WHERE id = '.$data["obj"][$field['id']].'
				';
				if ($data["obj"][$field['id']] > 0){
					$data['data_select'][$field['id']] = $this->mdatamodel->row_select($sql);
				}
				else {
					$data['data_select'][$field['id']] = null;
				}
			}
		//vadim
			elseif ($field['type'] == 'conframe'){
				$this->mdatamodel->set_database($this->config->item('default_conframe_db'));
				$sql = '
				    SELECT '.$field['column'].'
					FROM "'.$field['beom'].'".'.$field['table_name'].'
					WHERE conframe_id = '.$data["obj"][$field['id']].';
				';
				if ($data["obj"][$field['id']] > 0){
					$data['data_select'][$field['id']] = $this->mdatamodel->row_select($sql);
				}
				else {
					$data['data_select'][$field['id']] = null;
				}
			}
		//end
            elseif ($field['type'] == 'conframe_lookup'){

                if(isset($field['db'])){
                    $this->mdatamodel->set_database($field['db']);
                }

                $sql = '
				    SELECT '.$field['display'].'
					FROM "'.$field['beom'].'".'.$field['table_name'].'
					WHERE '.$field['option'].' = '.$data["obj"][$field['id']].';
				';
                if ($data["obj"][$field['id']] > 0){
                    $data['data_select'][$field['id']] = $this->mdatamodel->row_select($sql);
                }
                else {
                    $data['data_select'][$field['id']] = null;
                }
            }
			elseif ($field['type'] == 'table_lookup'){
                $sql = '
                    SELECT '.$field['column'].'
				    FROM "'.$field['beom'].'".'.$field['table_name'].'
				    WHERE '.$field['option'].' = \''.$data["obj"][$field['id']].'\';
                ';

				if ($data["obj"][$field['id']] > 0 || $data["obj"][$field['id']] != ''){
					if (isset($field['db_name'])){
						$this->mdatamodel->set_database($this->config->item($field['db_name']));
					}
					$data['data_select'][$field['id']] = $this->mdatamodel->row_select($sql);

				}
				else {
					$data['data_select'][$field['id']] = null;

				}
			}
			if ($field['type'] == 'conf_select'){
				if (isset($field['option']['conf_file'])) $this->config->load($field['option']['conf_file']);
			}
			if ($field['type'] == 'base_voltage'){
				$sql = '
				    SELECT "'.$data["form_data"]['BEOM'].'".base_voltage.id AS fk_base_voltage,
					"'.$data["form_data"]['BEOM'].'".base_voltage.name
					FROM "'.$data["form_data"]['BEOM'].'".base_voltage
					WHERE "'.$data["form_data"]['BEOM'].'".base_voltage.id = '.$data["obj"]['fk_base_voltage'].';
				';
				$data["base_voltage"]=$this->mdatamodel->table_select($sql);
			}

            if ($field['type'] == 'periodical_section'){
                // Создание массива значений секции
                $data['obj'][$field['id']] = array();

                // Соединение с БД для переодической секции
                $this->mdatamodel->set_database($field['db']);
                // Запрос на получение данных секции
                $sql = '
                    SELECT fk_table.'.$field['column_fk'].' AS id,
                           fk_table.'.$field['display'].' AS name
                    FROM '.$field['beom'].'.'.$field['table'].' AS period_section
                    LEFT JOIN '.$field['beom'].'.'.$field['table_fk'].' AS fk_table
                        ON period_section.'.$field['column'].' = fk_table.'.$field['column_fk'].'
                    WHERE period_section.'.$field['id'].' = \''.$data["obj"][$field['item_column']].'\'
                    ORDER BY period_section.id
                ';
                $result_query = $this->mdatamodel->table_select($sql);
                if(is_array($result_query) && count($result_query) > 0){
                    $data['obj'][$field['id']] = $result_query;
                }
            }
		}


		$data["app"] = $app;
        $data["form_name"] = $form_name;
        //$data['object_id'] = $id;
        $data["load_type"] = 'edit';


		$this->load->vars($data);

        if($this->edit_access){
            $this->load->view("ajax_render_form");
        }
        else{
            $this->load->view("ajax_render_form_view");
        }


	}
	/*
     * CKharitonov
     */
	public function table_hierarchy($app=null,$frm=null,$schema=null,$table=null,$i=null,$parent=null){
		$data["app"] = $app;
		$data["form"] = $frm;
        $data["schema"] = $schema;
        $data["table"] = $table;
		$data["count"] = $i;
        $data["parent"] = $parent;
        //if ($parent){
            $data["path"] = Modules::run('qobject/get_path',$schema,$table,$parent);
        //}
        $this->load->vars($data);
		$this->load->view("table_hierarchy_view");
	}
	/*
     * CKharitonov
     */
	public function table_lookup($app=null, $frm=null, $schema=null, $table=null, $i=null, $substn_id=null, $line_link=null, $name_form=null){

		$data["app"] = $app;
		$data["form"] = $frm;
        $data["schema"] = $schema;
        $data["table"] = $table;
		$data["count"] = $i;
		$data["substn_id"] = $substn_id;
		$data["line_link"] = $line_link;
        $data["bay_id"] = $i;
        $data["name_form"] = $name_form;
        //TSR
		if($name_form != null) {
			$form_data = $this->include_form($app, $name_form);
			$data["config_field"] = $form_data['FLD'][$i];
		} else {$data["config_field"] = array();}

        $this->load->vars($data);
		$this->load->view("table_lookup_view");
	}

    public function conframe_lookup($app_name = null, $form_name = null, $object_id = null){

        $data = array(
            'app_name' => $app_name,
            'form_name' => $form_name,
            'object_id' => $object_id
        );

        $this->load->view("conframe_lookup_view", $data);
    }

	//samir
	public function map_window($latitude,$longitude){
	$data["latitude"] = $latitude;
	$data["longitude"] = $longitude;
	$this->load->vars($data);
	$this->load->view("map_window_view");
	}
    //vprikhodko
    public function map_window_new($latitude,$longitude){
        $data["latitude"] = $latitude;
        $data["longitude"] = $longitude;
        $this->load->vars($data);
        $this->load->view("vmap_window");
    }
    //vprikhodko
	public function poly_line_map_window_new($input_text=null,$id_line=null,$base_voltage_level=null){
//		$base_voltage_level = str_replace('_KV',"",$base_voltage_level);
        //по id линии получаем mrid линиии
// 		$this->mdatamodel->set_database($this->config->item("default_db"));
// //		$line_base_voltage = $this->mdatamodel->open_id($base_voltage_level,'obj_ba.base_voltage','base_voltage_value');
//         $line_mrid_arr = $this->mdatamodel->open_id($id_line,'obj_ba.line','id',['name','conframe_id','mrid']);
//         $line_mrid = $line_mrid_arr['mrid'];
//         $this->mdatamodel->set_database($this->config->item("default_conframe_db"));
//         $svg_json_arr = $this->mdatamodel->open_id($line_mrid,'obj_ba.conframe','line_mrid',['svg_json','conframe_type']);
$svg_json_arr = '{
"elements": [{
"typical_element_id": "15091483753095",
"typical_element_type": "breaker",
"GUID": null,
"x": 612,
"y": 136,
"rotation": 0,
"dev_mrid": "0e91eca3-6f51-ca4d-6048-562269c48c03",
"voltage_level": "35",
"zindex": 2,
"path": null,
"terminals": ["", "9531d6a3-b439-e8a0-aaaf-0f8da6952f1c", "637c2221-b68f-4d42-f444-d49283473f86"]
}, {
"typical_element_id": "",
"typical_element_type": "DEVICE_NAME",
"rotation": 0,
"x": 655,
"y": 164.40625,
"dev_mrid": "0e91eca3-6f51-ca4d-6048-562269c48c03",
"voltage_level": null,
"zindex": 3,
"text": "Выключатель",
"align": "LEFT",
"style": "14062603728864",
"events": null
}, {
"typical_element_id": null,
"typical_element_type": "NODE",
"GUID": "c881103a-bc3a-7ce2-d572-ac1ca44e43b3",
"x": 548,
"y": 136,
"rotation": 0,
"dev_mrid": null,
"voltage_level": null,
"zindex": 1000,
"path": null,
"terminals": ["d92f5bd0-7729-3090-7c38-c0e77c05a7db"]
}, {
"typical_element_id": null,
"typical_element_type": "POLY_LINE",
"GUID": "0be80441-a66c-0ef8-3c6d-e1c49e27a6be",
"x": 548,
"y": 136,
"rotation": 0,
"dev_mrid": null,
"voltage_level": null,
"zindex": -1,
"path": null,
"from": "637c2221-b68f-4d42-f444-d49283473f86",
"to": "d92f5bd0-7729-3090-7c38-c0e77c05a7db",
"points": [{
"x": 88,
"y": 12
}, {
"x": 0,
"y": 0
}]
}, {
"typical_element_id": null,
"typical_element_type": "POLY_LINE",
"GUID": "e139ef03-336e-0141-f3d2-e0f1a0a8e3bd",
"x": 460,
"y": 124,
"rotation": 0,
"dev_mrid": null,
"voltage_level": null,
"zindex": -1,
"path": null,
"from": "0dd78c7f-0ac9-0f6b-429a-46443ada0bb9",
"to": "d92f5bd0-7729-3090-7c38-c0e77c05a7db",
"points": [{
"x": -8,
"y": 8
}, {
"x": 88,
"y": 12
}]
}, {
"typical_element_id": null,
"typical_element_type": "NODE",
"GUID": "7903d058-ffd6-4155-9206-724997e94025",
"x": 724,
"y": 196,
"rotation": 0,
"dev_mrid": null,
"voltage_level": null,
"zindex": 1000,
"path": null,
"terminals": ["6117eaef-558c-a3d4-7037-a1531b699974"]
}, {
"typical_element_id": null,
"typical_element_type": "POLY_LINE",
"GUID": "8ef56260-e17d-0776-639b-1f52d2f2e41e",
"x": 724,
"y": 196,
"rotation": 0,
"dev_mrid": null,
"voltage_level": null,
"zindex": -1,
"path": null,
"from": "774ece37-b484-ee0f-56c4-cbcd20a0325e",
"to": "6117eaef-558c-a3d4-7037-a1531b699974",
"points": [{
"x": 100,
"y": -12
}, {
"x": 0,
"y": 0
}]
}, {
"typical_element_id": null,
"typical_element_type": "POLY_LINE",
"GUID": "cdd88f8f-7fe0-865d-5a50-8cd24cda8dac",
"x": 636,
"y": 172,
"rotation": 0,
"dev_mrid": null,
"voltage_level": null,
"zindex": -1,
"path": null,
"from": "9531d6a3-b439-e8a0-aaaf-0f8da6952f1c",
"to": "6117eaef-558c-a3d4-7037-a1531b699974",
"points": [{
"x": 0,
"y": 0
}, {
"x": 88,
"y": 24
}]
}, {
"typical_element_id": null,
"typical_element_type": "NODE",
"GUID": "2abfbe76-57ba-eec7-106c-5e77a8fa20a0",
"x": 960,
"y": 200,
"rotation": 0,
"dev_mrid": null,
"voltage_level": null,
"zindex": 1000,
"path": null,
"terminals": ["a74105d8-e3f8-414b-8d61-26a5a5a56819"]
}, {
"typical_element_id": null,
"typical_element_type": "POLY_LINE",
"GUID": "3b04da5e-6f71-f3d8-a5df-42b9fee4517c",
"x": 968,
"y": 192,
"rotation": 0,
"dev_mrid": null,
"voltage_level": null,
"zindex": -1,
"path": null,
"from": "3294a4a0-778a-9494-5c34-0ce0d9121f02",
"to": "a74105d8-e3f8-414b-8d61-26a5a5a56819",
"points": [{
"x": 136,
"y": -12
}, {
"x": -8,
"y": 8
}]
}, {
"typical_element_id": null,
"typical_element_type": "POLY_LINE",
"GUID": "65faf969-09d8-9cd3-1961-07ec67c3599c",
"x": 860,
"y": 206,
"rotation": 0,
"dev_mrid": null,
"voltage_level": null,
"zindex": -1,
"path": null,
"from": "27a17c50-a920-5e65-b67c-4ea5535f964a",
"to": "a74105d8-e3f8-414b-8d61-26a5a5a56819",
"points": [{
"x": 12,
"y": -22
}, {
"x": 100,
"y": -6
}]
}, {
"typical_element_id": null,
"typical_element_type": "POLY_LINE",
"GUID": "8f7ef54b-0ddb-3c20-ccf3-d44bcf752d77",
"x": 968,
"y": 206,
"rotation": 0,
"dev_mrid": null,
"voltage_level": null,
"zindex": -1,
"path": null,
"from": "687e9f0e-323d-c8ca-3e8f-28b283994255",
"to": "a74105d8-e3f8-414b-8d61-26a5a5a56819",
"points": [{
"x": 32,
"y": 58
}, {
"x": -8,
"y": -6
}]
}, {
"typical_element_id": "16081512981069",
"typical_element_type": "acline_segment",
"GUID": null,
"x": 992,
"y": 256,
"rotation": 0,
"dev_mrid": "32eefb8f-726d-d87d-5439-a3bf53b3c872",
"voltage_level": "35",
"zindex": 6,
"path": null,
"terminals": ["", "e4769633-bdb5-6abf-bcba-e860bb8a028d", "687e9f0e-323d-c8ca-3e8f-28b283994255"]
}, {
"typical_element_id": "16081512981069",
"typical_element_type": "acline_segment",
"GUID": null,
"x": 396,
"y": 124,
"rotation": 0,
"dev_mrid": "80C7CA63-2EA0-A948-CEE3-7C79CF413269",
"voltage_level": "35",
"zindex": 1,
"path": null,
"terminals": [null, "0dd78c7f-0ac9-0f6b-429a-46443ada0bb9", "28969d2c-a288-f14e-c9e2-92885c6de3f8"]
}, {
"typical_element_id": "16081512981069",
"typical_element_type": "acline_segment",
"GUID": null,
"x": 816,
"y": 176,
"rotation": 0,
"dev_mrid": "2900023B-6756-EB33-6FEA-01020C98B090",
"voltage_level": "35",
"zindex": 4,
"path": null,
"terminals": [null, "27a17c50-a920-5e65-b67c-4ea5535f964a", "774ece37-b484-ee0f-56c4-cbcd20a0325e"]
}, {
"typical_element_id": "16081512981069",
"typical_element_type": "acline_segment",
"GUID": null,
"x": 1096,
"y": 172,
"rotation": 0,
"dev_mrid": "6B394FFE-7C0E-3B93-6D7E-49793BBE931A",
"voltage_level": "35",
"zindex": 5,
"path": null,
"terminals": [null, "754c2c70-6d44-9a8b-f551-c8a698534d23", "3294a4a0-778a-9494-5c34-0ce0d9121f02"]
}],
"layers": [],
"static_elements": [],
"busbar_section_json": {},
"ac_tower_json": {}
}';
        $svg_json = json_decode($svg_json_arr);//['svg_json']
        $elements = $svg_json->elements;
       // 
       // echo "<pre>";
       // echo print_r($elements);exit();
//        $array = json_decode(json_encode($xml), true);
//		$data['color'] = $line_base_voltage['color'];
//		$sql = 'SELECT fk_to_substation, fk_from_substation, ss.geo_location AS from_ss, sst.geo_location AS to_ss, ss.name As from_name, sst.name As to_name,
//   		bvf.color AS from_color, bvt.color AS to_color
//		FROM obj_ba.line as line
//		LEFT JOIN "obj_ba".substation AS ss on ss.id = fk_from_substation
//		LEFT JOIN "obj_ba".substation AS sst on sst.id = fk_to_substation
//		LEFT JOIN "obj_ba".base_voltage AS bvf on bvf.id = ss.fk_base_voltage
//		LEFT JOIN "obj_ba".base_voltage AS bvt on bvt.id = sst.fk_base_voltage
//		WHERE line.id ='.$id_line;
//		$from_to= $this->mdatamodel->table_select($sql);
//		$data['from_to']= json_encode($from_to[0]);
		$data['svg_json']= json_encode($elements);
		$this->load->vars($data);
		$this->load->view("vpoly_line_window");
	}
    public function poly_line_map_window($input_text=null,$id_line,$base_voltage_level=null){
        $base_voltage_level = str_replace('_KV',"",$base_voltage_level);
        $this->mdatamodel->set_database($this->config->item("default_db"));
        $line_base_voltage = $this->mdatamodel->open_id($base_voltage_level,'obj_ba.base_voltage','base_voltage_value');
        $data['color'] = $line_base_voltage['color'];
        $sql = 'SELECT fk_to_substation, fk_from_substation, ss.geo_location AS from_ss, sst.geo_location AS to_ss, ss.name As from_name, sst.name As to_name,
   		bvf.color AS from_color, bvt.color AS to_color
		FROM obj_ba.line as line
		LEFT JOIN "obj_ba".substation AS ss on ss.id = fk_from_substation
		LEFT JOIN "obj_ba".substation AS sst on sst.id = fk_to_substation
		LEFT JOIN "obj_ba".base_voltage AS bvf on bvf.id = ss.fk_base_voltage
		LEFT JOIN "obj_ba".base_voltage AS bvt on bvt.id = sst.fk_base_voltage
		WHERE line.id ='.$id_line;
        $from_to= $this->mdatamodel->table_select($sql);
        $data['from_to']= json_encode($from_to[0]);
        $data['input_val']= $input_text;
        $this->load->vars($data);
        $this->load->view("poly_line_window_view");

    }

	//
	//vadim conframe
	public function table_conframe(){
//		Modules::run("qconframe/folder/");
		$data['root']=true;
		$data['folder_path']=Modules::run('qconframe/folder/get_folder_path',Modules::run('qconframe/folder/get_root_id'),'return');
		$data['list']=Modules::run('qconframe/folder/get_folders');
		$data['list_for_js']=json_encode($data['list']);
		$data['folder_id_root']=Modules::run('qconframe/folder/get_root_id');
		$data['trash_id']=Modules::run('qconframe/folder/get_trash_id');
		$data['field_tree_id']='window_select';
		$this->load->view("qconframe/folder/folder_view_config",$data);
	}

    public function table_conframe_lookup($network_mrid = null){

        $data = array(
            'app_name' => 'table_conframe_lookup',
            'form_name' => 'table_conframe_lookup',
            'object_id' => $network_mrid
        );

        $this->load->view("table_conframe_lookup_view", $data);
    }

	/*
     * CKharitonov
     */
    public function table_upload($type=null){
    	$condition = '';
    	if ($type == 'image'){
    		$condition = ' WHERE type IN (\'jpg\',\'png\',\'gif\')';
    	}
    	else if ($type == 'document'){
    		$condition = ' WHERE type IN (\'pdf\',\'doc\',\'vsd\',\'xls\')';
    	}
        $sql='SELECT * FROM "'.$this->config->item('obj').'".upload'.$condition.';';
        $data['upload'] = $this->mdatamodel->table_select($sql);
        $this->load->vars($data);
        $this->load->view("table_upload_view");
    }
    /*
     * CKharitonov
     */
	public function ajax_data_table_hierarchy($app, $form, $schema, $table, $count, $parent_id=null){
		$data["form_data"] = $this->include_form($app,$form);
		$this->load->library('datatables');
		$this->datatables->set_database($this->config->item("default_db"));
		$this->datatables->select('id,'.$data["form_data"]['FLD'][$count]['column'].',parent');
        $this->datatables->from('"'.$schema.'".'.$table.'');

        $this->datatables->where('parent',''.$parent_id.'');
        if($parent_id == 0){
            $this->datatables->or_where('parent',null);
        }

		$group_btn_option  = '<div>';
		$group_btn_option .= '<a href="';
		$group_btn_option .= base_url();
		$group_btn_option .= 'index.php/qcore/ajax/table_hierarchy/'.$app.'/'.$form.'/'.$schema.'/'.$table.'/'.$count.'/$1"><span class=""><i class="fa fa-arrow-circle-right" aria-hidden="true"></i></span></a>';
		$group_btn_option .= '</div>';
		$this->datatables->add_column('view',$group_btn_option,'id');
        echo ($this->datatables->generate());
	}
	/*
     * CKharitonov
     */
	public function ajax_data_table_lookup($app=null, $form=null, $schema=null, $table=null, $count=null, $substn_id=null, $network_id = null, $name_form=null){
        //if(!IS_AJAX) {die('Ограниченный доступ');}
		$this->load->library('datatables');
		//$form_data = $this->include_form($app,$name_form);

		if ($app == 'edom'){
			$this->datatables->set_database($app);
			$this->datatables->select('id,name');
			$this->datatables->from('"'.$schema.'".'.$table.'');
		}
		else if ($form == 'substation' and $table == 'line'){
			$this->datatables->set_database($app);
			$this->datatables->select('id,name');
			$this->datatables->from('"'.$schema.'".'.$table.'');
			$this->datatables->where('fk_from_substation',''.$substn_id.'');
			$this->datatables->or_where('fk_to_substation',''.$substn_id.'');
		}
        else if ($table == 'parameter'){
			$this->datatables->set_database($this->config->item("default_db"));
			$this->datatables->select('id,name');
			$this->datatables->from('"'.$this->config->item('obj').'".parameter');
		}
        else if ($table == 'unit_multiplier'){
			$this->datatables->set_database($this->config->item("default_db"));
			$this->datatables->select('id,literal,description');
			$this->datatables->from('"'.$this->config->item('obj').'".unit_multiplier');
		}
        else if ($table == 'unit_symbol'){
			$this->datatables->set_database($this->config->item("default_db"));
			$this->datatables->select('id,literal,description');
			$this->datatables->from('"'.$this->config->item('obj').'".unit_symbol');
		}
        else if ($table == 'equipment_type'){
			$this->datatables->set_database($this->config->item("default_db"));
			$this->datatables->select('id,name');
			$this->datatables->from('"'.$this->config->item('obj').'".equipment_type');
		}
        else if ($table == 'network'){

            $this->datatables->set_database($this->config->item("default_conframe_db"));
            $this->datatables->select('id,name');

            $this->datatables->from('"'.$schema.'".'.$table.'');
            $this->datatables->where('fk_project',$network_id);
        }
        else if ($form == 'substation' and $table == 'acline_segment'){
            //$table = 'equipment';
            $bay_id = $count;
			$this->datatables->set_database($this->config->item("default_db"));
			$this->datatables->select(''.$schema.'.acline_segment.id as id, '.$schema.'.acline_segment.name as name');
			$this->datatables->from('"'.$schema.'".'.$table.'');
            $this->datatables->join('"'.$schema.'".equipment', $schema.'.equipment.id = '.$schema.'.'.$table.'.fk_equipment', 'left');
            $this->datatables->join('"'.$schema.'".voltage_level', $schema.'.voltage_level.fk_base_voltage = '.$schema.'.equipment.fk_base_voltage', 'left');
            $this->datatables->join('"'.$schema.'".bay', $schema.'.bay.fk_voltage_level = '.$schema.'.voltage_level.id', 'left');
            $this->datatables->where('"'.$schema.'".'.$table.'.type','FAR');
            $this->datatables->where('"'.$schema.'".equipment.fk_substation',NULL);
            $this->datatables->where('"'.$schema.'".bay.id', $bay_id);
		}
        else if ($form == 'acline_segment' and $table == 'line'){
            //$table = 'equipment';
			$this->datatables->set_database($this->config->item("default_db"));
			$this->datatables->select('id,name');
			$this->datatables->from('"'.$schema.'".'.$table.'');
            //$this->datatables->where('type','acline_segment');
		}
        else if ($form == 'bay' and $table == 'bay'){
            //$table = 'equipment';
            $this->datatables->set_database($this->config->item("default_db"));
            $this->datatables->select('id,name');
            $this->datatables->from('"'.$schema.'".'.$table.'');
            $this->datatables->where('fk_voltage_level',$network_id);
        }
        else if($form == 'protection_equipment_items'){
            $this->datatables->set_database($this->config->item("default_db"));

            /*
            $sql = "
                SELECT equipment.mrid, equipment.name
                FROM ".$schema.".equipment AS equipment
                LEFT JOIN ".$schema.".equipment_type AS equipment_type
                    ON equipment_type.id = equipment.fk_equipment_type
                WHERE equipment.fk_substation = ".$substn_id."
                    AND equipment_type.is_protected_switch = TRUE
                    AND equipment.id NOT IN (
                        SELECT equipment.id
                        FROM ".$schema.".protection_equipment_items AS protection_equipment_items
                        LEFT JOIN ".$schema.".equipment AS equipment
                            ON equipment.mrid = protection_equipment_items.fk_mrid_equipment
                        WHERE protection_equipment_items.fk_protection_equipment = ".$count."
                    )
                ORDER BY equipment.name
            ";
            */

            $substation_id = intval($substn_id);
            $protection_equipment_mrid = strval($count);

            $this->datatables->with(
                "equipments",
                "
                SELECT equipment.mrid AS mrid,
                       CASE
                         WHEN equipment.type = 'power_transformer'
                           THEN equipment.name
                         ELSE CONCAT( voltage_level.name, ' / ', bay.name, ' / ', equipment.name )
                       END AS name
                FROM ".$this->config->item("obj").".equipment AS equipment
                LEFT JOIN ".$this->config->item("obj").".bay AS bay
                    ON bay.id = equipment.fk_bay
                LEFT JOIN ".$this->config->item("obj").".voltage_level AS voltage_level
                    ON voltage_level.id = bay.fk_voltage_level
                WHERE equipment.fk_substation = ".$substation_id."
                      AND equipment.mrid IS NOT NULL
                      AND type != 'protection_equipment'
                UNION
                SELECT power_transformer_end.mrid AS mrid,
                       CONCAT( equipment.name, ' / ', power_transformer_end.name ) AS name
                FROM ".$this->config->item("obj").".equipment AS equipment
                LEFT JOIN ".$this->config->item("obj").".power_transformer_end AS power_transformer_end
                    ON power_transformer_end.fk_equipment = equipment.id
                WHERE equipment.fk_substation = ".$substation_id."
                      AND power_transformer_end.mrid IS NOT NULL
                      AND type = 'power_transformer'
                "
            );

            $this->datatables->select([
                'equipments.mrid AS mrid',
                'equipments.name AS name'
            ]);
            $this->datatables->from('equipments');
            $this->datatables->join(
                $this->config->item("obj").'.protection_equipment_items AS protection_equipment_items',
                'equipments.mrid = protection_equipment_items.fk_mrid_equipment',
                'left'
            );
            $this->datatables->where('protection_equipment_items.id IS NULL');
            //$this->datatables->where('protection_equipment_items.fk_mrid_protection_equipment !=', $protection_equipment_mrid);
            $this->datatables->order_by('equipments.name', 'ASC');


            echo ($this->datatables->generate());
            return;
        }
        else if($schema == 'linear_input_for_bay'){
            $line_id              = intval($table);
            $substation_mrids     = [];
            $substation_exception = [];
            $bays_exception       = [];

            $this->mdatamodel->set_database($this->config->item("default_db"));
            $line_data = $this->mdatamodel->open_id(
                $line_id,
                $this->config->item("obj").'.line',
                'id',
                array('mrid', 'fk_base_voltage')
            );

            $sql = '
                SELECT net_substation.fk_substation_mrid AS mrid
                FROM "'.$this->config->item("obj").'".net_line AS net_line
                LEFT JOIN "'.$this->config->item("obj").'".network AS network1
                    ON network1.id = net_line.fk_network
                LEFT JOIN "'.$this->config->item("obj").'".project AS project
                    ON project.id = network1.fk_project
                LEFT JOIN "'.$this->config->item("obj").'".network AS network2
                    ON network2.fk_project = project.id
                LEFT JOIN "'.$this->config->item("obj").'".net_substation AS net_substation
                    ON net_substation.fk_network = network2.id
                WHERE net_line.fk_line_mrid = \''.$line_data['mrid'].'\'
            ';

            $this->mdatamodel->set_database($this->config->item("default_conframe_db"));
            $result_substation_mrids = $this->mdatamodel->table_select($sql);

            if(is_array($result_substation_mrids) && count($result_substation_mrids) > 0){
                foreach($result_substation_mrids as $item){
                    $substation_mrids[] = $item['mrid'];
                }
            }

            /*
            $sql = '
                SELECT DISTINCT(equipment.fk_substation) AS substation_id
                FROM "'.$this->config->item("obj").'".equipment AS equipment
                WHERE equipment.fk_line = '.$line_id.' AND
                      equipment.fk_bay IS NOT NULL
            ';

            $this->mdatamodel->set_database($this->config->item("default_db"));
            $result_substations_id = $this->mdatamodel->table_select($sql);

            if(is_array($result_substations_id) && count($result_substations_id) > 0){
                foreach($result_substations_id as $row){
                    $substation_exception[] = $row['substation_id'];
                }
            }
            */
            $sql = '
                SELECT DISTINCT(equipment.fk_bay) AS bay_id
                FROM "'.$this->config->item("obj").'".equipment AS equipment
                WHERE equipment.fk_line = '.$line_id.' AND
                      equipment.fk_bay IS NOT NULL
            ';

            $this->mdatamodel->set_database($this->config->item("default_db"));
            $result_bays_id = $this->mdatamodel->table_select($sql);

            if(is_array($result_bays_id) && count($result_bays_id) > 0){
                foreach($result_bays_id as $row){
                    $bays_exception[] = $row['bay_id'];
                }
            }

            $this->datatables->set_database($this->config->item("default_db"));

            $this->datatables->select(array(
                'bay.id as id',
                'CONCAT(substation.name, \' / \', bay.name) as name'
            ));
            $this->datatables->from($this->config->item('obj').'.substation AS substation');
            $this->datatables->join(
                $this->config->item('obj').'.voltage_level AS voltage_level',
                'voltage_level.fk_substation = substation.id',
                'left'
            );
            $this->datatables->join(
                $this->config->item('obj').'.bay AS bay',
                'bay.fk_voltage_level = voltage_level.id',
                'left'
            );

            if(count($substation_mrids) > 0){
                $this->datatables->where_in('substation.mrid', $substation_mrids);
            }

            /*
            if(count($substation_exception) > 0){
                $this->datatables->where_not_in('substation.id', $substation_exception);
            }
            */
            if(count($bays_exception) > 0){
                $this->datatables->where_not_in('bay.id', $bays_exception);
            }

            $this->datatables->where('voltage_level.fk_base_voltage', $line_data['fk_base_voltage']);
        }
		else {

			$data["form_data"] = $this->include_form($app, $form);


            // Выбор элементов для переодической секции
            if($data['form_data']['FLD'][$count]['type'] == 'periodical_section'){

                // Массив параметров для Периодической секции
                $field_option = $data['form_data']['FLD'][$count];
                // строка выбранных элементов в форме
                $exists_id_string = $substn_id;
                // ID объекта формы
                $object_id = intval($network_id);

                // Массив выбранных объектов
                $exists_id = array();
                // Если были переданы ID выбранных объектов
                if($exists_id_string != 'null'){
                    // Создаём массив их значений
                    $exists_id = explode('__', $exists_id_string);
                }

                if($app == 'qobject' && $form == 'add_tower') {

                    $lines_mrid_escaped = [];

                    $this->mdatamodel->set_database($this->config->item('default_conframe_db'));
                    $sql = "
                        SELECT DISTINCT net_line.fk_line_mrid AS mrid
                        FROM " . $this->config->item('obj') . ".net_line AS net_line
                        LEFT JOIN " . $this->config->item('obj') . ".network AS network
                            ON network.id = net_line.fk_network
                        WHERE network.fk_project = " . intval($this->session->userdata('IDPROJECT')) . "
                    ";
                    $result_query = $this->mdatamodel->table_select($sql);
                    if ( is_array($result_query) && count($result_query) > 0 ) {
                        foreach ( $result_query as $row ) {
                            $lines_mrid_escaped[] =  "'" . $row['mrid'] . "'";
                        }
                    }
                }


                $schema = $this->config->item('obj');

                $this->datatables->set_database($field_option['db']);
                $this->datatables->select(
                    '"'.$schema.'".'.$field_option['table_fk'].'.'.$field_option['column_fk'].', '.
                    '"'.$schema.'".'.$field_option['table_fk'].'.'.$field_option['display']
                );
                $this->datatables->from('"'.$schema.'".'.$field_option['table_fk']);

                if($app == 'qobject' && $form == 'add_tower'){


                    $this->datatables->with(
                            'towers',
                            "
                                SELECT  tower.mrid                                          AS mrid,
                                        string_agg(line.name, '<br />' ORDER BY line.name)  AS lines_name
                                FROM ".$this->config->item('obj').".tower AS tower
                                LEFT JOIN ".$this->config->item('obj').".equipment_has_tower AS equipment_has_tower
                                    ON equipment_has_tower.fk_tower_mrid = tower.mrid
                                LEFT JOIN ".$this->config->item('obj').".equipment AS equipment_tower
                                    ON equipment_tower.mrid = equipment_has_tower.fk_equipment_mrid
                                LEFT JOIN ".$this->config->item('obj').".line AS line
                                    ON line.id = equipment_tower.fk_line
                                WHERE  line.mrid IN (".implode(',', $lines_mrid_escaped).")
                                GROUP BY tower.mrid
                            "
                    );

                    $this->datatables->select(
                        "towers.lines_name AS lines_name"
                    );


                    $this->datatables->join(
                        'towers',
                        'towers.mrid = '.$schema.'.'.$field_option['table_fk'].'.'.$field_option['column_fk'],
                        'left'
                    );

                }

                if($app == 'qobject' && ($form == 'line' || $form == 'substation')){
                    $this->datatables->where('"'.$schema.'".'.$field_option['table_fk'].'.fk_project', $this->session->userdata('IDPROJECT'));
                }

                if(count($exists_id) > 0){
                    $this->datatables->where_not_in('"'.$schema.'".'.$field_option['table_fk'].'.'.$field_option['column_fk'], $exists_id);
                }



                $result = $this->datatables->generate();
                echo $result;
                return;
            }

            $db_to_connect = $this->config->item("default_db");

            if(isset($data['form_data']['FLD'][$count]['db_name'])){
                $db_to_connect = $data['form_data']['FLD'][$count]['db_name'];
            }
           //исправлено Артем (http://10.0.0.54/q3/index.php/qcore/ajax/table_lookup/project/substation/obj_ba/substation/0/null/46)
            $this->datatables->set_database($db_to_connect);

           // $this->datatables->set_database($this->config->item($db_to_connect));
           // if (gettype($db_to_connect) == 'string')
            //$this->datatables->set_database($this->config->item($db_to_connect));

            if(isset($data["form_data"]['FLD'][$count]['sql']) && $data["form_data"]['FLD'][$count]['sql'] != ''){
                echo ($this->datatables->generate(null, $data["form_data"]['FLD'][$count]['sql']));
                return;
            }

            if( isset($data['form_data']['FLD'][$count]['table_name']) &&
                (($data['form_data']['TABLE'] == 'net_line' && $data['form_data']['FLD'][$count]['table_name'] == 'line') ||
                ($data['form_data']['TABLE'] == 'net_substation' && $data['form_data']['FLD'][$count]['table_name'] == 'substation'))
            ){

                $net_object_mrids = array();
                $result_query = array();

                if($network_id != ''){
                    $network_id = intval($network_id);

                    $sql = '
                        SELECT '.$data["form_data"]['FLD'][$count]['id'].' AS mrid
                        FROM "'.$this->config->item('obj').'".'.$data["form_data"]['TABLE'].'
                        WHERE fk_network = '.$network_id.'
                    ';

                    /*
                        UNION
                        SELECT table_object.'.$data["form_data"]['FLD'][$count]['id'].' AS mrid
                        FROM "'.$this->config->item('obj').'".'.$data["form_data"]['TABLE'].' AS table_object
                        LEFT JOIN "'.$this->config->item('obj').'".network AS network
                            ON network.id = table_object.fk_network
                        LEFT JOIN  "'.$this->config->item('obj').'".project AS project
                            ON project.id = network.fk_project
                        WHERE network.id != '.$network_id.'
                    ';
                    */
                    $this->mdatamodel->set_database($this->config->item("default_conframe_db"));
                    $result_query = $this->mdatamodel->table_select($sql);
                }
                else{

                    $object_mrid = $this->db->escape($substn_id);

                    $sql = '
                        SELECT table1.'.$data["form_data"]['FLD'][$count]['id'].' AS mrid
                        FROM "'.$this->config->item('obj').'".'.$data["form_data"]['TABLE'].' AS table1
                        LEFT JOIN "'.$this->config->item('obj').'".'.$data["form_data"]['TABLE'].' AS table2
                            ON table2.fk_network = table1.fk_network
                        WHERE table2.'.$data["form_data"]['FLD'][$count]['id'].' = '.$object_mrid.'
                    ';
                    $this->mdatamodel->set_database($this->config->item("default_conframe_db"));
                    $result_query = $this->mdatamodel->table_select($sql);
                }

                if(count($result_query) > 0){
                    foreach($result_query as $item){
                        $net_object_mrids[] = $item['mrid'];//$this->db->escape($item['mrid']);
                    }
                }

                $this->datatables->set_database($this->config->item("default_db"));
                $this->datatables->select('mrid, name');
                $this->datatables->from($data["form_data"]['FLD'][$count]['beom'].'.'.$data["form_data"]['FLD'][$count]['table_name']);

                if(count($net_object_mrids) > 0){
                    $this->datatables->where_not_in('mrid', $net_object_mrids);
                }

                echo ($this->datatables->generate());
                return;

            }

            // Выборка центра питания для создания/редактирования Линии
            if($data['form_data']['TABLE'] == 'line' && $data['form_data']['FLD'][$count]['id'] == 'fk_power_substation'){

                $sql = '
                    SELECT DISTINCT(fk_substation_mrid) AS mrid
                    FROM "'.$this->config->item('obj').'".net_substation AS net_substation
                    LEFT JOIN "'.$this->config->item('obj').'".network AS network
                        ON network.id = net_substation.fk_network
                    WHERE network.fk_project = '.$this->session->userdata('IDPROJECT').'
                ';
                $this->mdatamodel->set_database($this->config->item("default_conframe_db"));
                $result_query = $this->mdatamodel->table_select($sql);

                $substations_mrid = array();
                if(is_array($result_query) && count($result_query) > 0 ){
                    foreach($result_query as $item){
                        $substations_mrid[] = $item['mrid'];
                    }
                }

                $schema = $this->config->item('obj');

                $this->datatables->set_database($this->config->item("default_db"));
                $this->datatables->select('"'.$schema.'".substation.id, "'.$schema.'".substation.name');
                $this->datatables->from('"'.$schema.'".substation');
                $this->datatables->join('"'.$schema.'".base_voltage', $schema.'.substation.fk_base_voltage = '.$schema.'.base_voltage.id', 'left');
                $this->datatables->where('"'.$schema.'".base_voltage.base_voltage_value >=', '35');
                $this->datatables->where_in('"'.$schema.'".substation.mrid', $substations_mrid);
                echo ($this->datatables->generate());
                return;
            }


            if( isset($data['form_data']['TABLE']) && $data['form_data']['TABLE'] == 'project_access_role'){

                $exist_roles_id_of_project = array();

                $project_id = intval($substn_id);

                $sql = '
                    SELECT fk_db_role
                    FROM "'.$this->config->item('obj').'".project_access_role
                    WHERE fk_project = '.$project_id.'
                    ';
                $this->mdatamodel->set_database($this->config->item("default_conframe_db"));
                $result_query = $this->mdatamodel->table_select($sql);

                if(is_array($result_query) && count($result_query) > 0){
                    foreach($result_query as $item){
                        $exist_roles_id_of_project[] = $item['fk_db_role'];
                    }
                }

                $this->datatables->set_database($this->config->item("default_db"));
                $this->datatables->select(''.$data["form_data"]['FLD'][$count]['option'].','.$data["form_data"]['FLD'][$count]['column'].'');
                $this->datatables->from('"'.$schema.'".'.$table.'');

                if(count($exist_roles_id_of_project) > 0){
                    $this->datatables->where_not_in('id', $exist_roles_id_of_project);
                }

                echo ($this->datatables->generate());
                return;
            }

            $this->datatables->select(''.$data["form_data"]['FLD'][$count]['option'].','.$data["form_data"]['FLD'][$count]['column'].'');
            $this->datatables->from('"'.$schema.'".'.$table.'');
		}

        echo ($this->datatables->generate());
	}

    public function ajax_data_conframe_lookup($app_name = null, $form_name = null, $object_id = null, $object_type = null){
        $this->load->library('datatables');

        $conframe_subtype = 'MODEL';

        if($app_name == 'table_conframe_lookup' && $form_name == 'table_conframe_lookup'){
            $this->mdatamodel->set_database($this->config->item('default_conframe_db'));
            $object_data = $this->mdatamodel->open_id(
                $object_id,
                $this->config->item('obj') . '.network',
                'mrid',
                array('id')
            );
        }
        else{
            $form_data = $this->include_form($app_name, $form_name);

            $this->mdatamodel->set_database($form_data['DB']);
            $object_data = $this->mdatamodel->open_id(
                $object_id,
                $form_data['BEOM'] . '.' . $form_data['TABLE'],
                $form_data['OBJID'],
                array('mrid')
            );

            if($form_data['TABLE'] == 'network'){
                $conframe_subtype = 'DISPLAY';
            }
        }

		if(in_array($object_type, ['network', 'substation_displays', 'line_displays'])){
			$conframe_subtype = 'DISPLAY';
		}


        $user_table = array();
        $this->mdatamodel->set_database($this->config->item("default_db"));
        $sql = '
            SELECT name,
                   last_name,
                   login
            FROM sbj_ba.physical_persons
            WHERE login IS NOT NULL
        ';
        $result_query = $this->mdatamodel->table_select($sql);
        if(is_array($result_query) && count($result_query) > 0){
            $user_table = array(
                'login' => array(),
                'name' => array(),
                'last_name' => array()
            );
            foreach($result_query as $row){
                foreach($row as $column_name => $column_value){
                    $user_table[$column_name][] = $this->db->escape($column_value);
                }
            }
        }

        $select_columns = array(
            'conframe.conframe_id AS conframe_id',
            'conframe.name AS name'
        );
        if($app_name == 'table_conframe_lookup' && $form_name == 'table_conframe_lookup'){
            $select_columns[] = '
            (
			    CASE
			        WHEN (conframe.conframe_type = \'SUBSTN\')
			            THEN \''.lang('txt_substation').'\'
			        WHEN (conframe.conframe_type = \'LINE\')
			            THEN \''.lang('txt_line').'\'
			        ELSE \''.lang('txt_mapboard_').'\'
			    END
			) AS conframe_type';
        }


        if(count($user_table) > 0){
            $select_columns[] = '(
			    CASE
			        WHEN (create_user.name IS NULL AND create_user.last_name IS NULL)
			            THEN conframe.create_user
			        ELSE CONCAT(create_user.name, \' \', create_user.last_name)
			    END
			) AS author';
            $select_columns[] = '(
			    CASE
			        WHEN (edit_user.name IS NULL AND edit_user.last_name IS NULL)
			            THEN conframe.modify_user
			        ELSE CONCAT(edit_user.name, \' \', edit_user.last_name)
			    END
			) AS modify_user';
        }
        else{
            $select_columns[] = 'conframe.create_user AS author';
            $select_columns[] = 'conframe.modify_user AS modify_user';
        }
        $select_columns[] = 'to_char(conframe.modify_date, \'dd.mm.YYYY hh24:mi:ss\') AS modify_date';

        $this->datatables->set_database($this->config->item("default_conframe_db"));

        if(count($user_table) > 0){
            $this->datatables->with(
                'users_name',
                '
                    SELECT t1.val AS login,
                           t2.val AS name,
                           t3.val AS last_name
                    FROM (
                        SELECT val,row_number() over () AS row_num
                        FROM unnest(array['.implode(',', $user_table['login']).']) AS u(val)
                    ) AS t1
                    JOIN (
                        SELECT val,row_number() over () AS row_num
                        FROM unnest(array['.implode(',', $user_table['name']).']) AS u(val)
                    ) AS t2
                        ON t1.row_num = t2.row_num
                    JOIN (
                        SELECT val,row_number() over () AS row_num
                        FROM unnest(array['.implode(',', $user_table['last_name']).']) AS u(val)
                    ) AS t3
                        ON t1.row_num = t3.row_num
                '
            );
        }

        $this->datatables->select($select_columns);
        $this->datatables->distinct('conframe.conframe_id');
        $this->datatables->from('"'.$this->config->item('obj').'".conframe AS conframe');

        if(count($user_table) > 0){
            $this->datatables->join(
                'users_name AS create_user',
                'create_user.login = conframe.create_user',
                'left'
            );

            $this->datatables->join(
                'users_name AS edit_user',
                'edit_user.login = conframe.author',
                'left'
            );
        }

        if($app_name == 'table_conframe_lookup' && $form_name == 'table_conframe_lookup'){
            $where_network_join = array();

            if( $object_type == 'all_substation_line_models'
                || $object_type == 'substation_models'
                || $object_type == 'substation_displays'
            ){
                $this->datatables->join(
                    $this->config->item('obj').'.net_substation AS net_substation',
                    'net_substation.fk_substation_mrid = conframe.substation_mrid',
                    'left'
                );
                $where_network_join[] = ' network.id = net_substation.fk_network ';
            }

            if( $object_type == 'all_substation_line_models'
                || $object_type == 'line_models'
                || $object_type == 'line_displays'
            ){
                $this->datatables->join(
                    $this->config->item('obj') . '.net_line AS net_line',
                    'net_line.fk_line_mrid = conframe.line_mrid',
                    'left'
                );
                $where_network_join[] = ' network.id = net_line.fk_network ';
            }

            if($object_type == 'network') {
                $where_network_join[] = ' network.mrid = conframe.network_mrid ';
            }

            $this->datatables->join(
                $this->config->item('obj').'.network AS network',
                implode(' OR ', $where_network_join),
                'left'
            );

            $this->datatables->where('network.id', $object_data['id']);

			if ($conframe_subtype == "MODEL"){
				$this->datatables->where('conframe.is_model IS TRUE');
			}
        }
        else{
            $this->datatables->where('conframe.'.$form_data['TABLE'].'_mrid', $object_data['mrid']);
        }

        $this->datatables->where('conframe.conframe_subtype', $conframe_subtype);
        echo ($this->datatables->generate());
    }


    /*
        Artem / DELETE
    */
	public function get_ajax_update($conframe_id = null){
		$data = array();
        if ($conframe_id){
           $data["conframe_data"] = $this->mdatamodel->open_id($conframe_id,'"'.$this->config->item("obj").'".conframe','conframe_id');
        }
        echo $data["conframe_data"]["tag_json"];
    }
/*
	Vadim / check sql
*/
	public function sql_check($str)
	{
		$result = preg_match('/\s?;?'.$this->config->item('danger_sql').'\s/',$str,$found);        // Производим поиск

		if ($result) return FALSE;
		else return TRUE;
	}

    private function periodical_section_save($period_section_data = null, $form = null, $object_id = null){
        if(!$object_id || !is_array($period_section_data) || !is_array($form)){
            return;
        }

        // Значение объекта для переодической секции
        $item_value = $object_id;
        // Если ключ формы не свопадает с ключом для секции
        if($period_section_data['item_column'] != $form['OBJID']){
            $this->mdatamodel->set_database($form["DB"]);
            $object_data = $this->mdatamodel->open_id($object_id, $form['BEOM'] . '.' . $form['TABLE'], $form["OBJID"]);
            $item_value = $object_data[$period_section_data['item_column']];
        }
        // Соединение с БД Переодической Секции
        $this->mdatamodel->set_database($period_section_data["db"]);
        // Удаление устаревших значений в секции
        $delete_old_period_section = $this->mdatamodel->delete(
            $item_value,
            $period_section_data['beom'] . '.' . $period_section_data['table'],
            $period_section_data["id"]
        );
        // Если удаление завершено с ошибкой
        if($delete_old_period_section != 1){
            return $delete_old_period_section;
        }
        // Если значений для секции нет, возвращаем положительный результат
        if(count($period_section_data['value']) == 0){
            return 1;
        }
        // Массив значений для секции
        $period_insert_data = array();
        // Наполнение массива значений для секции
        foreach($period_section_data['value'] AS $period_section_value){
            $period_insert_data[] = array(
                $period_section_data["id"] => $item_value,
                $period_section_data['column'] => $period_section_value
            );
        }

        // Вставка новых значений секции
        $insert_period_data = $this->mdatamodel->insert_batch(
            $period_section_data['beom'] . '.' . $period_section_data['table'],
            $period_insert_data
        );

        return $insert_period_data;
    }

    public function get_data_tree_db(){
        $this->load->model('madmin');
        $db_names = array(
            $this->config->item('default_db'),
            $this->config->item('default_conframe_db')
        );
        $data['backup_tables_db'] = array();
     //   $data['db_names'] = $db_names;
        foreach($db_names as $key => $value) {
            $data['backup_tables_db'][$value] = array();//database name
            $this->mdatamodel->set_database($value);
            $res = $this->madmin->list_tables(); //array  [table_schema][table_name] -> default name query

            foreach ($res as $key_row => $value_row) {
                if (!isset( $data['backup_tables_db'][$value][ $value_row['table_schema'] ] ))
                    $data['backup_tables_db'][$value][ $value_row['table_schema'] ] = array('text' => $value_row['table_schema'],'children'=>array());

                array_push(
                    $data['backup_tables_db'][$value][ $value_row['table_schema'] ]['children'],
                    array(
                        'text'=>$value_row['table_name'],
                        'table_name' => $value_row['table_schema'].'.'.$value_row['table_name']
                    ));
            }
        }
        echo '<pre>';
        print_r($data); // TEST
        echo '</pre>';
        exit;

    }
}
