
//  ------------------------------------------------------------------------ //
//                         ConFrame-Electric CTM V3                          //
//                      Copyright (c) 2011-2014 DunRose                      //
//                         <http://www.dunrose.ru/>                          //
//  ------------------------------------------------------------------------ //
//  Author: Mr. Thurairajasingam Senthilruban   TSRuban[AT]dunrose.ru        //
//  Programmer: Mr. Gritsenko Vadim Victorovich VGritsenko[AT]dunrose.ru     //
//  URL: http://www.dunrose.ru						     					 //
// ------------------------------------------------------------------------- //

var QCValidation = {
	items: null
};

QCValidation.check_data = function(data, type_data, text_error){
	
	array_type = ['boolean', 'number', 'string', 'object', 'array', 'function', 'array', 'date', 'error', 'regexp', 'null', 'undefined' ]
	if ($.inArray(type_data, array_type) < 0 ) {console.error( "Undefined data type" );}
	if (jQuery.type( data ) !== type_data) {
		console.error( "Input error" );
		return false;
	}
	return true;

/*
	type_data = type_data.split('||');
	for (var i in type_data){
		if (jQuery.type( data ) !== type_data[i]) {
			//console.error("In "+name_function+" data is not "+type_data[i]);
			//console.error(text_error);
			console.error( "Input error" );
			return false;
		}
	}
	return true;
/*	
	jQuery.type( true ) === "boolean"
	jQuery.type( new Boolean() ) === "boolean"
	jQuery.type( 3 ) === "number"
	jQuery.type( new Number(3) ) === "number"
	jQuery.type( "test" ) === "string"
	jQuery.type( new String("test") ) === "string"
	jQuery.type( function(){} ) === "function"
	jQuery.type( [] ) === "array"
	jQuery.type( new Array() ) === "array"
	jQuery.type( new Date() ) === "date"
	jQuery.type( new Error() ) === "error" // as of jQuery 1.9
	jQuery.type( /test/ ) === "regexp"	
	*/
}
//конец функции
