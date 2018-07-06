
var HCModal = { 
    id_modal : "modal_dialog",
    jq_modal : null,
};
/*
title
body
footer

*/
HCModal.run = function(attr){
	if (!attr) return;
	  
	var html='';
	if (!attr.title && !attr.body && !attr.footer) return;
    html+='<div class="modal fade" id="'+HCModal.id_modal+'" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
	    html+='<div class="modal-dialog">';
		    html+='<div class="modal-content">';

		    if (attr.title){
		    	html+=' <div class="modal-header">';
		      		html+='  <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true"><i class="fa fa-times" aria-hidden="true"></i></span><span class="sr-only">Close</span></button>';
			        html+=' <h4 class="modal-title">'+attr.title+'</h4>';
		      	html+='</div>';
		    }

		    if (attr.body){
		    	html+=' <div class="modal-body">';
		     		html+= attr.body;
	     		html+='<div id="error"></div>';
		        html+='</div>';

		    }
		    
		    if (attr.footer){
		      	html+=' <div class="modal-footer">';
			      html+= attr.footer;
		     	html+=' </div>';
		    }
		    
		     
		   html+=' </div>';
	 	html+=' </div>';
	html+='</div>';

$('body').append(html);
	
	HCModal.jq_modal = $('#'+HCModal.id_modal);
	HCModal.jq_modal.modal('show');
	
	HCModal.jq_modal.on('hidden.bs.modal', function (e) {
		HCModal.jq_modal.remove();
		HCModal.jq_modal = null;
	})
}

HCModal.close_modal = function(){
	if (!HCModal.jq_modal) return;
	HCModal.jq_modal.modal("hide");

}

HCModal.set_error = function(get_html){
	if (!HCModal.jq_modal || !get_html) return;
	var html = '';
	
	html+='<p class="bg-danger">';
		html+=get_html;
	html+='</p>';

	$("#error").html(html);

}

