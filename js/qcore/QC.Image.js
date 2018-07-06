//  ------------------------------------------------------------------------------------ //
//                                  ConFrame-Electric CTM V3                             //
//                               Copyright (c) 2011-2014 DunRose                         //
//                                  <http://www.dunrose.ru/>                             //
//  ------------------------------------------------------------------------------------ //
//  Author: Mr. Thurairajasingam Senthilruban           TSRuban[AT]dunrose.ru            //
//  Programmer: Mr. Kharitonov Constantine Igorevich    CKharitonov[AT]dunrose.ru        //
//  URL: http://www.dunrose.ru                                                           //
// ------------------------------------------------------------------------------------- //

var QCImage = {};

QCImage.get_icon = function(device_type){
    if (device_type){
        var icon = '';
        switch (device_type) {
            case 'substation':
                icon = 'drico_subst_16';
                break;
            case 'voltage_level':
                icon = 'drico_vol_lvl_ru_16';
                break;
            case 'switching_equipment':
                icon = 'drico_switch_16';
                break;
            case 'generator':
                icon = 'drico_generator_16';
                break;
            case 'reactor':
                icon = 'drico_reactor_16';
                break;
            case 'line_segment':
                icon = 'drico_line_16';
                break;
            case 'line':
                icon = 'drico_line_16';
                break;
            case 'busbar_section':
                icon = 'drico_busbar_16';
                break;
            case 'current_transformer':
                icon = 'drico_current_transf_16';
                break;
            case 'potential_transformer':
                icon = 'drico_pot_transf_16';
                break;
            case 'terminal':
                icon = 'drico_terminal_16';
                break;
            case 'energy_consumer':
                icon = 'drico_load_16';
                break;
            case 'bay':
                icon = 'drico_bay_16';
                break;
            case 'synchronous_machine':
                icon = 'drico_sync_machine_16';
                break;  
            case 'static_var_compensator':
                icon = 'drico_static_var_comp_16';
                break;
            case 'high_frequency_rejector':
                icon = 'drico_high_fr_rejector_16';
                break;
            case 'ground':
                icon = 'drico_grounding_16';
                break;
            case 'bay_folder':
                icon = 'drico_bay_folder_16';
                break;
            case 'substation_folder':
                icon = 'drico_subst_folder_16';
                break;
            case 'power_transformer_folder':
                icon = 'drico_transf_folder_16';
                break;
            case 'voltage_level_folder':
                icon = 'drico_vol_lvl_folder_ru_16';
                break;
            case 'surge_protector':
                icon = 'drico_surge_protector1_16';
                break;
            case 'power_transformer':
                icon = 'drico_power_transf2_16';
                break;
            case 'DEVICE_NAME':
                icon = 'glyphicon glyphicon-font';
                break;
            case 'energy_source':
                icon = 'glyphicon glyphicon-download';
                break;  
            case 'DEVICE_MEAS':
                icon = 'glyphicon glyphicon-stats';
                break;
            case 'breaker':
                icon = 'drico_switch_16';
                break;
            case 'load_break_switch':
                icon = 'drico_switch_16';
                break;
            case 'disconnector':
                icon = 'drico_switch_16';
                break;
            case 'ground_disconnector':
                icon = 'drico_switch_16';
                break;
            case 'fuse':
                icon = 'drico_switch_16';
                break;
        }
        return icon;
    }
}