
//  ------------------------------------------------------------------------ //
//                         ConFrame-Electric CTM V3                          //
//                      Copyright (c) 2011-2014 DunRose                      //
//                         <http://www.dunrose.ru/>                          //
//  ------------------------------------------------------------------------ //
//  Author: Mr. Thurairajasingam Senthilruban   TSRuban[AT]dunrose.ru        //
//  URL: http://www.dunrose.ru                                               //
// ------------------------------------------------------------------------- //

var CFLang = function(){
    this.langs = new Array();
    
    /*
     * Set all term from language
     * TSRuban
     */
    this.set_language_data = function(data_json){
        this.langs = data_json;
    };
    
    /*
     * Set the text in current language
     * code: id_text
     * txt: text to display
     * TSRuban
     */
    this.set_term = function(code,txt){
        this.langs[code] = txt;
    };
    
    /*
     * get term for the given code
     *  TSRuban
     */
    this.get_term = function(code){
        if (this.langs[code] == undefined){
            return code;
        }
        else {
            return this.langs[code];
        }
    };
};
/**
 * Проверка авторизации пользователя
 */
check_user_login = function(){
    var cookie_name = 'session_login';
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + cookie_name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));

    if(!matches){
        location = 'http://'+document.location.hostname+'/CFBI/index.php/login/logout?path='+self.location;
		clearInterval(timer);
    }
}

// Запуск
var timer = setInterval(check_user_login, 5000);