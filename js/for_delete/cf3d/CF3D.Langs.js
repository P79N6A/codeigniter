/* 

 */

var CF3D_langs = {
		transformControls: null,
		base_url: null,
		default_settings_import: null,
};

CF3D_langs.init = function(){
    var langs = new CFLang();
	langs.set_term("txt_panel_settings","<?php echo lang('txt_panel_settings'); ?>");
	langs.set_term("sm_btn_save","<?php echo lang('sm_btn_save'); ?>");
	langs.set_term("btn_cancel","<?php echo lang('btn_cancel'); ?>");

    langs.set_term("txt_data_object","<?php echo lang('txt_data_object'); ?>");
    langs.set_term("txt_parent","<?php echo lang('txt_parent'); ?>");
    langs.set_term("txt_show_data","<?php echo lang('txt_show_data'); ?>");
    langs.set_term("txt_open_object","<?php echo lang('txt_open_object'); ?>");
    langs.set_term("fld_modify_date","<?php echo lang('fld_modify_date'); ?>");
    langs.set_term("txt_name","<?php echo lang('txt_name'); ?>");
    langs.set_term("txt_show_total_struct","<?php echo lang('txt_show_total_struct'); ?>");
    langs.set_term("sm_btn_show_hide_name","<?php echo lang('sm_btn_show_hide_name'); ?>");
    langs.set_term("sm_btn_show_hide_grid","<?php echo lang('sm_btn_show_hide_grid'); ?>");
    langs.set_term("sm_btn_move_object","<?php echo lang('sm_btn_move_object'); ?>");
    langs.set_term("txt_not_plane","<?php echo lang('txt_not_plane'); ?>");
    langs.set_term("txt_create_connect","<?php echo lang('txt_create_connect'); ?>");
	langs.set_term("txt_line_type","<?php echo lang('txt_line_type'); ?>");
	langs.set_term("I238","<?php echo lang('I238'); ?>");
	langs.set_term("txt_open_import","<?php echo lang('txt_open_import'); ?>");
	langs.set_term("err_obj_is_connec","<?php echo lang('err_obj_is_connec'); ?>");
	langs.set_term("txt_db_name","<?php echo lang('txt_db_name'); ?>");
	langs.set_term("txt_name_scheme","<?php echo lang('txt_name_scheme'); ?>");
	langs.set_term("txt_name_table","<?php echo lang('txt_name_table'); ?>");
	langs.set_term("btn_cancel","<?php echo lang('btn_cancel'); ?>");
	langs.set_term("txt_level","<?php echo lang('txt_level'); ?>");
	langs.set_term("sm_btn_save","<?php echo lang('sm_btn_save'); ?>");
	langs.set_term("txt_color_line","<?php echo lang('txt_color_line'); ?>");
	langs.set_term("txt_color_object","<?php echo lang('txt_color_object'); ?>");	
	langs.set_term("txt_color_name","<?php echo lang('txt_color_name'); ?>");
	langs.set_term("txt_color_object_not_child","<?php echo lang('txt_color_object_not_child'); ?>");	
	langs.set_term("txt_curl","<?php echo lang('txt_curl'); ?>");
	langs.set_term("txt_straight","<?php echo lang('txt_straight'); ?>");
	langs.set_term("txt_color_main_object","<?php echo lang('txt_color_main_object'); ?>");
	langs.set_term("txt_open_3d_conframe","<?php echo lang('txt_open_3d_conframe'); ?>");
	langs.set_term("sm_btn_conframe","<?php echo lang('sm_btn_conframe'); ?>");
	langs.set_term("I200","<?php echo lang('I200'); ?>");
	langs.set_term("txt_color_gridhelper_line","<?php echo lang('txt_color_gridhelper_line'); ?>");	
	langs.set_term("txt_color_gridhelper_centline","<?php echo lang('txt_color_gridhelper_centline'); ?>");	
	langs.set_term("txt_color_gridhelper_plane","<?php echo lang('txt_color_gridhelper_plane'); ?>");
	langs.set_term("txt_opacity_gridhelper_plane","<?php echo lang('txt_opacity_gridhelper_plane'); ?>");	
	langs.set_term("txt_cube","<?php echo lang('txt_cube'); ?>");	
	langs.set_term("txt_conus","<?php echo lang('txt_conus'); ?>");	
	langs.set_term("txt_color_object_child","<?php echo lang('txt_color_object_child'); ?>");	
	langs.set_term("sm_btn_delete_object","<?php echo lang('sm_btn_delete_object'); ?>");	
	langs.set_term("txt_add_object","<?php echo lang('txt_add_object'); ?>");		
	langs.set_term("txt_add_child","<?php echo lang('txt_add_child'); ?>");		
	langs.set_term("txt_panel_settings","<?php echo lang('txt_panel_settings'); ?>");
	langs.set_term("txt_type_element","<?php echo lang('txt_type_element'); ?>");		
	langs.set_term("txt_color_phone","<?php echo lang('txt_color_phone'); ?>");		
	langs.set_term("txt_copy","<?php echo lang('txt_copy'); ?>");		
	langs.set_term("txt_cut","<?php echo lang('txt_cut'); ?>");		
	langs.set_term("txt_paste","<?php echo lang('txt_paste'); ?>");		
	langs.set_term("txt_background_color","<?php echo lang('txt_background_color'); ?>");	
	langs.set_term("txt_save_file","<?php echo lang('txt_save_file'); ?>");
	langs.set_term("ttl_save_conframe","<?php echo lang('ttl_save_conframe'); ?>");
    langs.set_term("sm_btn_export","<?php echo lang('sm_btn_export'); ?>");
	langs.set_term("txt_view_object","<?php echo lang('txt_view_object'); ?>");		
	langs.set_term("sm_btn_move_object_child","<?php echo lang('sm_btn_move_object_child'); ?>");		
	langs.set_term("tm_view","<?php echo lang('tm_view'); ?>");		
	langs.set_term("err_not_root","<?php echo lang('err_not_root'); ?>");		
	langs.set_term("txt_table_forms","<?php echo lang('txt_table_forms'); ?>");		
	langs.set_term("txt_conframe_bi","<?php echo lang('txt_conframe_bi'); ?>");		
	langs.set_term("txt_tsk_ba","<?php echo lang('txt_tsk_ba'); ?>");		
	langs.set_term("txt_sbj_ba","<?php echo lang('txt_sbj_ba'); ?>");		
	langs.set_term("txt_obj_ba","<?php echo lang('txt_obj_ba'); ?>");		
	langs.set_term("txt_task_three_d","<?php echo lang('txt_task_three_d'); ?>");		
	langs.set_term("txt_org_struct","<?php echo lang('txt_org_struct'); ?>");		
	langs.set_term("txt_control_centers","<?php echo lang('txt_control_centers'); ?>");		
	langs.set_term("txt_sample_three","<?php echo lang('txt_sample_three'); ?>");		
	langs.set_term("txt_load","<?php echo lang('txt_load'); ?>");
	langs.set_term("txt_add_color_level","<?php echo lang('txt_add_color_level'); ?>");
	langs.set_term("sm_btn_new","<?php echo lang('sm_btn_new'); ?>");
	langs.set_term("btn_select","<?php echo lang('btn_select'); ?>");

	langs.set_term("sm_btn_open","<?php echo lang('sm_btn_open'); ?>");
	langs.set_term("btn_cancel","<?php echo lang('btn_cancel'); ?>");
	langs.set_term("txt_parent_child","<?php echo lang('txt_parent_child'); ?>");

	langs.set_term("txt_type_object","<?php echo lang('txt_type_object'); ?>");	

	    langs.set_term("txt_child","<?php echo lang('txt_child'); ?>");

			langs.set_term("txt_data_object","<?php echo lang('txt_data_object'); ?>");
			langs.set_term("no_messages","<?php echo lang('no_messages'); ?>");
			langs.set_term("no_subjects","<?php echo lang('no_subjects'); ?>");
	

	
}