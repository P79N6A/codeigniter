
//  ------------------------------------------------------------------------ //
//                         ConFrame-Electric CTM V3                          //
//                      Copyright (c) 2011-2014 DunRose                      //
//                         <http://www.dunrose.ru/>                          //
//  ------------------------------------------------------------------------ //
//  Author: Mr. Thurairajasingam Senthilruban   TSRuban[AT]dunrose.ru        //
//  URL: http://www.dunrose.ru                                               //
// ------------------------------------------------------------------------- //
var CFEAlert = function(message){
    this.message = message;
    this.type = ' alert-success ';
    this.show_time = 10000;
    this.style = 'position:absolute;z-index:99999;top:0px;left:50%;padding:10px;';
    this.alert_div = '';

    /*
     * Time in second to show the message
     * TSRuban
     */
    this.set_show_time = function(t){
        this.show_time = t;
    };

    /*
     * set type: alert / warning / info etc..
     * TSRuban
     */
    this.set_type = function(t){
        this.type = t;
    };

    /*
     * Sets the message that to be displayed
     * TSRuban
     */
    this.set_message = function(message){
        this.message = message;
    };

    /*
     * set additional style if needed
     * TSRuban
     */
    this.set_style = function(style){
        this.style = style;
    };

    /*
     * Shows the message in top.
     * TSRuban
     */
    this.show_message = function(){
        that=this;
        $("#cfe_alert_div").remove();
        that.alert_div = '<div id="cfe_alert_div" class="alert '+this.type+'" style="'+this.style+'" >'+this.message+'</div>';
        $("body").append(that.alert_div);
        $("#cfe_alert_div").fadeOut(5000);
    };
}

