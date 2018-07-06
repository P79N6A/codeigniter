
//  ------------------------------------------------------------------------ //
//                         ConFrame-Electric CTM V3                          //
//                      Copyright (c) 2011-2014 DunRose                      //
//                         <http://www.dunrose.ru/>                          //
//  ------------------------------------------------------------------------ //
//  Author: Mr. Thurairajasingam Senthilruban   TSRuban[AT]dunrose.ru        //
//  Programmer: Mr. Gritsenko Vadim Victorovich VGritsenko[AT]dunrose.ru     //
//  URL: http://www.dunrose.ru						     					 //
// ------------------------------------------------------------------------- //
var QCTemplate = {
	tmpl_down_panel_buttons: '<div style="float:right;"><p><input type="hidden" class="form-control" id="conframe_id" value=""><input type="hidden" class="form-control" id="next" value="$(\'#<%=items["id"] %>\').dialog(\'close\')"><input type="hidden" class="form-control" id="CONTINUE" value=""><br><% _.each(items,function(item,key,list){ %>\
				\<button type="button" class="<%= items[key]["style"] %>" id="<%= items[key]["id"] %>"  onclick="<%= items[key]["onclick"] %>"><%= items[key]["name"] %></button>&nbsp;&nbsp;\
				\<% }) %><div id="error_div"></div></p></div>',
				
	tmpl_main_content: '<form><% _.each(items,function(item,key,list){ %>\
						\<% if(items[key]["type"] != "hidden") { %>\
						<div class="form-group input-group-sm" id = "for_<%= (items[key]["id"]) %>"><label for="<%= (items[key]["id"]) %>"><%= (items[key]["name"]) %></label><br>						\<% if(items[key]["type"] == "text"){ %>\
						\<input id="<%= items[key]["id"] %>" <%= items[key]["propeties"] %> class="form-control input-block-level" value="<%= items[key]["value"] %>"/><br>\
						\<% } %>\
						\<% if(items[key]["type"] == "color") { %>\
						\<input id="<%= items[key]["id"] %>" <%= items[key]["propeties"] %> type= "color" value="<%= items[key]["value"] %>"/><br>\
						\<% } %>\
						\<% if(items[key]["type"] == "button") { %>\
						\<button class="btn btn-default" id="<%= items[key]["id"] %>" <%= items[key]["propeties"] %> type= "button" onclick="<%= items[key]["on_click"] %>"> <%= (items[key]["name"]) %></button><br>\
						\<% } %>\
						\<% if(items[key]["type"] == "textarea") { %>\
						\<textarea class="form-control" id="<%= items[key]["id"] %>" <%= items[key]["propeties"] %> placeholder><%= items[key]["value"] %></textarea><br>\
						\<% } %>\
						\<% if(items[key]["type"] == "select") { %>\
							\<select class="form-control" <%= items[key]["propeties"] %> id = "<%= items[key]["id"] %>">\
							\<option value></options>\
							\<% _.each(items[key]["options"],function(item,key1,list){ %>\
							\<option value = "<%= items[key]["options"][key1]["value"] %>" <% if(items[key]["value"] == items[key]["options"][key1]["value"]) { %> selected=true <% } %>><%= (items[key]["options"][key1]["name"] )%></option><% }) %>\
							\</select><br>\
						\<% } %>\
						\</div>\
						\<% } %>\
						\<% }) %></form>',

	tmpl_panel_output_info: '<table class="table table-condensed"><% _.each(items,function(item,key,list){ %>\
						<tr><td><label><%= (items[key]["name"]) %></label></td>\
						<td><%= (items[key]["value"]) %></td>\
						\<% }) %></table>',						
};