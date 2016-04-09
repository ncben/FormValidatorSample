/*Last Updated: Aug 06, 2013*/
/* jQuery Function Namespace used:

	stylizeDropdown
	chosen
	autoTab
	autotab_magic
	autotab_filter
	charLimit
	charCounter
	wordLimit
	wordCounter
	validateDOB
	placeHolderSupport
	bindPlaceholderKeyDown
	validateForm
	rm
	ac
	validate
	
	JavaScript Function Name used:
	
	postToNext
	jsLoad
	cssLoad
	
	Global Javascript Variable Used:
	
	counterInterval
*/

/*Stylize Dropdowns */

;(function($) {
	
    $.fn['stylizeDropdown'] = function(args) {
		
		 if ( $.type(args) !== 'object' )
            var args = {};

        	var opts = $.extend({}, $.fn[ 'stylizeDropdown' ].defaults(), args);
			
			var form = this;
						
			if(opts.disableAutoStylesheet === false){
				$("head").append('<link href="https://0da60bded15fd7273900-c3b572a873829e347e4db4dadf512257.ssl.cf1.rackcdn.com/ClassObjects/resources/jQueryChosen/chosen.css" type="text/css" rel="stylesheet" />');
			}
		
			$.getScript("https://0da60bded15fd7273900-c3b572a873829e347e4db4dadf512257.ssl.cf1.rackcdn.com/ClassObjects/resources/jQueryChosen/chosen.jquery.js", function(){
								
				 form.each(function(){
					
					if(opts.disableAutoInit === false){
						
						var selects = $(this).find("select");
												
						var selects = selects.filter(function(index) {
						
							return ((!$(this).prop("id")) || ($(this).prop("id") && $.inArray($(this).prop("id"), opts.excludeSelectIDs) === -1));
                        
                    	 });
						 								 
						selects.each(function(){	
					
							$(this).chosen();
						
						 })
					}
				})
				
				if(typeof opts.initialize == 'function')opts.initialize();								
			 })
			 return form;

		}

    var defaults = {
	    disableAutoInit: false,
		disableAutoStylesheet: false,
		excludeSelectIDs: [],
		initialize: function(){}
    };

    $.fn['stylizeDropdown'].defaults = function() {
        return $.extend({}, defaults);
    };

})(jQuery);


/*Auto Tab */

;(function($) {
	
    $.fn['autoTab'] = function(args) {
		
		 if ( $.type(args) !== 'object' )
            var args = {};

        	var opts = $.extend({}, $.fn[ 'autoTab' ].defaults(), args);
			
			var form = this;			
		
			$.getScript("https://0da60bded15fd7273900-c3b572a873829e347e4db4dadf512257.ssl.cf1.rackcdn.com/ClassObjects/resources/form/jquery.autotab-1.1b.js", function(){
				
				if(opts.disableAutoInit === false){
			 
					 form.each(function(){	
		 
						var phoneObj = $(this).find("input").filter(function(index) {
							
							return $.trim($(this).data("validation")) == '/^\\d{4}$/';
                        
                    	});
						
						phoneObj.each(function(){
													
							var parentElem = ($(this).parents('.input_wrapper').length) ? $(this).parents('.input_wrapper').parent() : (($(this).parents('.placeholder-label-p').length) ? $(this).parents('.placeholder-label-p').parent() : $(this).parent());
													
							var phoneFields = parentElem.find("input").filter(function(index) {
						
								return $(this).data("validation").indexOf('/^\\d') !== -1;
                        
                  		 	 });
							 
							 if(phoneFields.length>1)phoneFields.autotab_magic().autotab_filter('numeric');
						})
					 })
				}
				
				if(typeof opts.initialize == 'function')opts.initialize();
			 })
			return form;
		}

    var defaults = {
	    disableAutoInit: false,
		initialize: function(){}
    };

    $.fn['autoTab'].defaults = function() {
        return $.extend({}, defaults);
    };

})(jQuery);
 
 
/*Character Counter*/

;(function($) {
	
    $.fn['charLimit'] = function(limit, counter, direction, func) {
		
			var counter = (counter)?counter:false;
			if(!direction)direction = '';
			var direction = (direction == 'DESC')?'DESC':'ASC';
			var limit = limit;
			var func = func;
		
		 return this.each(function(){	
		 
			var textarea = $(this);
		
			textarea
			.off("focus.limit")
			.off("blur.limit")
			.on("focus.limit", function(){
				window['counterInterval'] = window.setInterval(function(){
					textarea.charCounter({limit: limit, counter: counter, direction: direction, initialize: func});
					},100);
			})
			.on("blur.limit", function(){
				clearInterval(counterInterval);
					textarea.charCounter({limit: limit, counter: counter, direction: direction, initialize: func});

			});
			
		 })
		
	}

    var PLUGIN_NS = 'charCounter';

    $.fn[ PLUGIN_NS ] = function( args ) {

        if ( $.type(args) !== 'object' )
            var args = {};

        var opts = $.extend({}, $.fn[ PLUGIN_NS ].defaults(), args);
		
		        return this.each(function(){
					var obj = $(this);
					obj.data( PLUGIN_NS+'Data' , args );
					
					textarea = $(this);
													
					var length = textarea.val().length;
					if(length > opts.limit){
						textarea.parents('.'+opts.input_wrapper).addClass(opts.errClass);
						textarea.val(textarea.val().substring(0,opts.limit));
						if(opts.counter !== false){
							if(opts.counter.length>0){
								if(opts.direction.toLowerCase() == 'asc'){
									opts.counter.html(opts.limit);
								}else{
									opts.counter.html('0');
								}
							}
						}
					}
					
					if(textarea.val() == ''){
						if(opts.direction.toLowerCase() == 'asc'){
							if(opts.counter !== false)opts.counter.html('0');
							textarea.data('count','0');
						}else{
							if(opts.counter !== false)opts.counter.html(opts.limit);
							textarea.data('count',opts.limit);
						}
					}else{
						
						if(!textarea.data('initalized')){
							textarea.data('initalized','1');
							if(typeof opts.initialize == 'function')opts.initialize();
							}
						
						}
					
					
					var newDisplay = (opts.direction.toLowerCase() == 'asc') ? length : opts.limit-length;
					if(newDisplay<0)newDisplay=0;
						if(textarea.data('count') != newDisplay){
							if($.trim(textarea.val())){
								window.setTimeout(function(){
									textarea.parents('.'+opts.errClass).removeClass(opts.errClass);
									textarea.parents('.'+opts.defaultErrClass).removeClass(opts.defaultErrClass);
								},50);
							}
				
							if(opts.counter !== false){
								if(opts.direction.toLowerCase() == 'asc'){
									var countDisplay = (length<=0)?'0':((length>opts.limit)?opts.limit:length);
									
								}else{
									var countDisplay = (opts.limit-length<=0)?'0':opts.limit-length;
									}
								textarea.data('count',countDisplay);
								opts.counter.html(countDisplay); 
							}
						}
							
        });
		
		
    };


    var defaults = {
	    limit: 255,
		counter: false,
		direction: 'DESC',
		errClass: 'error_container_textarea',
		wrapperClass: 'input_wrapper',
		defaultErrClass: 'error_container',
		initialize: function(){}
    };

    $.fn[ PLUGIN_NS ].defaults = function() {
        return $.extend({}, defaults);
    };

})(jQuery);

/*Word Counter*/

;(function($) {
	
    $.fn['wordLimit'] = function(limit, counter, direction, func) {
		
			var counter = (counter)?counter:false;
			if(!direction)direction = '';
			var direction = (direction.toUpperCase() == 'DESC')?'DESC':'ASC';
			var limit = limit;
			var func = func;
					
		
		 return this.each(function(){	
		 
			var textarea = $(this);
			
			textarea
			.off("focus.limit")
			.off("blur.limit")
			.on("focus.limit", function(){
				window['counterInterval'] = window.setInterval(function(){
					textarea.wordCounter({limit: limit, counter: counter, direction: direction, initialize: func});
					},100);
			})
			.on("blur.limit", function(){
				clearInterval(counterInterval);
					textarea.wordCounter({limit: limit, counter: counter, direction: direction, initialize: func});

			});
		 })
		
	}

    var PLUGIN_NS = 'wordCounter';

    $.fn[ PLUGIN_NS ] = function( args ) {

        if ( $.type(args) !== 'object' )
            var args = {};

        var opts = $.extend({}, $.fn[ PLUGIN_NS ].defaults(), args);
		
		        return this.each(function(){
					var obj = $(this);
					obj.data( PLUGIN_NS+'Data' , args );
					
					textarea = $(this);
								
					var r=0;
					var exceed_limit = false;
					var word_length = 0;
					var EssayLength=0;
					var essay_end = -1;
	
					EssayLength = textarea.val().replace(/\s/g," ").split(" ");
					//.replace(/[^A-Za-z0-9'-]+/gi," ")
					
					if(EssayLength.length>0){
						if(!textarea.data('initalized')){
							textarea.data('initalized','1');
							if(typeof opts.initialize == 'function')opts.initialize();
							}						
						}

					for (z=0; z<EssayLength.length; z++) {
	
						if (EssayLength[z].length > 0){ 
							r++;
							if(r <= opts.limit){
    						 word_length += EssayLength[z].length + 1;
							}
						}else{
							if(r <= opts.limit){
								word_length += 1;
							}
						}
		
					if(z== (EssayLength.length -1) && r > opts.limit){
		
						var essay_val = textarea.val().substring(0, word_length);
	
						textarea.val(essay_val);

						exceed_limit = true;	
						}
	
					}
				EssayLength=r;

				var newDisplay = (opts.direction.toLowerCase() == 'asc') ? EssayLength : opts.limit-EssayLength;
				if(newDisplay < 0)newDisplay = 0;

                if(EssayLength > opts.limit)
                {
                        
                    textarea.parents('.'+opts.wrapperClass).addClass(opts.errClass);
					window.setTimeout(function(){
						textarea.parents('.'+opts.errClass).removeClass(opts.errClass);
						textarea.parents('.'+opts.defaultErrClass).removeClass(opts.defaultErrClass);
					},50);
								

                }else
                {
                    window.setTimeout(function(){
						if($.trim(textarea.val()))textarea.parents('.'+opts.errClass).removeClass(opts.errClass);
						if($.trim(textarea.val()))textarea.parents('.'+opts.defaultErrClass).removeClass(opts.defaultErrClass);
					},50);
                }
				if(opts.counter !== false){
					
					if(opts.counter.length>0){
												
						if(opts.counter.html() != newDisplay){
		
								opts.counter.html(newDisplay);
					
						}
					}
				}
         
				
				if(exceed_limit === true){
					
					textarea.trigger("keyup");
					
					}
							
        });
		
		
    };


    var defaults = {
	    limit: 255,
		counter: false,
		direction: 'DESC',
		errClass: 'error_container_textarea',
		wrapperClass: 'input_wrapper',
		defaultErrClass: 'error_container',
		initialize: function(){}
    };

    $.fn[ PLUGIN_NS ].defaults = function() {
        return $.extend({}, defaults);
    };

})(jQuery);

/*DOB update days in month*/

;(function($) {

    var PLUGIN_NS = 'validateDOB';

    $.fn[ PLUGIN_NS ] = function( args ) {

        if ( $.type(args) !== 'object' )
            var args = {};

        var opts = $.extend({}, $.fn[ PLUGIN_NS ].defaults(), args);
		
		        return this.each(function(){
					var obj = $(this);
					obj.data( PLUGIN_NS+'Data' , args );
								
					if(typeof opts == 'object'){
						var dob_y = opts.y || $(this).find("[data-validation='dob_y']").eq(0);
						var dob_m = opts.m || $(this).find("[data-validation='dob_m']").eq(0);
						var dob_d = opts.d || $(this).find("[data-validation='dob_d']").eq(0);
					}

					dob_m.add(dob_y).off("change.DOB").on("change.DOB", function(){

						if((!dob_y.length||!dob_m.length||!dob_d.length) && !opts.disableWarnings){
							console.log("DOB Plugin initialization failed")
							return;
						}
  						var y = +parseInt(dob_y.val());
						var m = parseInt(dob_m.val(), 10);
						var d = parseInt(dob_d.val(),10);
		
						if(dob_m.val() == '') return;
	
   						if(m == 2){
							if(dob_y.val() == '') return;
       						 var mlength = 28 + (!(y & 3) && ((y % 100) !== 0 || !(y & 15)));
		
							}else{ 
								var mlength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1];
							}			
 					  	 dob_d.find("option:gt(0)").remove();
		
   						 for(var i = 1; i <= mlength; i++){
       						 var opt = $("<option />").attr("value",i).text(i);
        					 if (i == d) opt.prop("selected", true);
        					 dob_d.append(opt);
							}
					})
							
        });
		
		
    };


    var defaults = {
	    disableWarnings: false

    };

    $.fn[ PLUGIN_NS ].defaults = function() {
        return $.extend({}, defaults);
    };

})(jQuery);
/*Placeholder*/

;(function($) {

    var PLUGIN_NS = 'placeHolderSupport';
	
	$.fn['bindPlaceholderKeyDown'] = function(){
		
		var obj = $(this);
		
		obj.off('keydown.placeholder').on('keydown.placeholder',function(e){
			var label = $(this).parent().find('label');
					if((e.keyCode == 16) || (e.keyCode == 9)) return; 
				
				if($(this).val() != ""){
					if(label.css("opacity")>0.0){
						label.css("opacity",0).hide();
						};
				}
						
		}).off("keyup.placeholder").on("keyup.placeholder", function(e){
				
						var label = $(this).parent().find('label');
					if((e.keyCode == 16) || (e.keyCode == 9)) return; 
			
				if($(this).val() == ""){
						if(label.css("opacity")>0.0){
							label.css({opacity: 0.0}).show();
						}
						label.stop().animate({ opacity: 0.5 }, 300);
					}else{
						if(label.css("opacity")>0.0){
							label.css("opacity",0).hide();
						};
						}
				
				})
		
		
		};

    $.fn[ PLUGIN_NS ] = function( args ) {

        if ( $.type(args) !== 'object' )
            var args = {};

        var opts = $.extend({}, $.fn[ PLUGIN_NS ].defaults(), args);
		
		        return this.each(function(){
					var obj = $(this);
					obj.data( PLUGIN_NS+'Data' , args );
					
					if(opts.UseNativeWhenSupported && 'placeholder' in document.createElement('input'))return;
			
					$(this).find("[placeholder]").each(function(){
						
						
						
					
						$(this).wrap($('<p class="placeholder-label-p inline-block" style="position:relative;margin: 0;padding:0;line-height: 0; width: '+this.style.width+'"/>')).before('<label for="'+this.id+'" class="placeholder-label" style="line-height: 1em;opacity: 1; display: block;color: #777;margin: '+opts.marginTop+'px 5px 5px 6px;padding: 0;position: absolute;top: 0;left: 0; font-size: '+$(this).css('font-size')+'; '+opts.additionalCSS+'">'+$(this).attr('placeholder')+'</label>'); 
						
						if(opts.usePlaceholderMinWidth){
							
							var label = $(this).siblings('label');
							label.css({"display":"inline","position":"relative"});
							var labelActualWidth = label.width();
							label.css({"display":"block","position":"absolute"});
							
							var input_wrapper = $(this).parents('.input_wrapper');
							
							if(input_wrapper.width() < labelActualWidth+22){
								
								var wrapperParentWidth = input_wrapper.parent().width();
								var newInputWidthPercent = 100*(labelActualWidth+22)/wrapperParentWidth;
								
								input_wrapper.css("width",newInputWidthPercent+"%")
								
								
								}
							
							var newPlaceholderLabelPercent = 100*(labelActualWidth+13)/input_wrapper.width();							
							$(this).parents('.placeholder-label-p').css("width",newPlaceholderLabelPercent+"%");
							
							}
						
						if($(this).parents('.input_wrapper').length==0 && !opts.disableWarnings){
							console.log('placeholderSupport() should be called after validateForm().');
						}
		
		
						$(this).on('focus.placeholder',function(e){
			
							var label = $(this).parent().find('label');
							if(label.css("opacity")>0.0){
								label.stop().animate({ opacity: 0.5 }, 300);
							}
				
						}).on("blur.placeholder change propertychange",function(e){
				
							var label = $(this).parent().find('label');
							if($.trim($(this).val()) == ""){
								label.show().stop().animate({ opacity: 1 }, 300);
							}else{
								label.css("opacity",0);
							}
							$(this).bindPlaceholderKeyDown();
						})
			
						$(this).bindPlaceholderKeyDown();
						
						$(this).css("width","100%");
				
						$(this).removeAttr('placeholder');
				
					})
					
        });
		
		
    };


    var defaults = {
        UseNativeWhenSupported: false,
		 marginTop: 8,
		 disableWarnings: false,
		 additionalCSS: '',
		 usePlaceholderMinWidth: false
    };

    $.fn[ PLUGIN_NS ].defaults = function() {
        return $.extend({}, defaults);
    };

})(jQuery);

/*Validation*/

;(function($) {

    var PLUGIN_NS = 'validateForm';
	
	$.fn['rm'] = function(errClass){
		$(this).find('[id^=css_]').removeClass(errClass);
		};
	
	$.fn['ac'] = function(errClass){
		$(this).addClass(errClass);
		};
	
	$.fn['validate'] = function(type, css, ids, errClass, error_msg){
		
				  var regex = /^(?!x)x$/;
                var valid = false;
				if(typeof css == 'string'){
              		   css = css.replace(/\s/g, '')
								.replace(/\#/g, '');
				}
                var id = ids.split(',');
                var id1 = (jQuery.trim(id[0]));
                var id2 = (jQuery.trim(id[1]));
                var id3 = (jQuery.trim(id[2]));
				var index = 0;
				if(id1.indexOf(":eq(")!== -1){
					
					id1 = id1.split(":eq(");
					var index = parseInt(id1[1].replace(")",""));
					id1 = id1[0];
					
					}
				
                var fields = $('[name="'+id1+'"]').eq(index)
                                .val();
                               
                if(type instanceof RegExp)
                {
                                regex = type;
                               
                }else
                {
                                switch (type)
                                {
                                                case 'email':
                                                                regex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
                                                                break;
													 case 'url':
																fields = fields.replace('www.','');	
																regex = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi;

																break;
													 case 'date':
																regex = /^(0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])[\/\-]((\d{4})|(\d{2}))$/;
																break;
													 case 'earlier_date':
																regex = /^(0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])[\/\-]((\d{4})|(\d{2}))$/;
																if(regex.test($("[name='"+id1+"']").eq(index).val())){
																	
																	if(new Date() - new Date($("[name='"+id1+"']").eq(index).val()) < 0){
																		
																		regex = /^(?!x)x$/;
																		
																		}
																	
																	}
																break;
                                                case 'phone':
                                                                if (id3) fields = fields + $("[name='"+id2+"']")
                                                                                .val() + $("[name='"+id3+"']")
                                                                                .val();
                                                                regex = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
                                                                break;
                                                case 'address':
                                                                regex = / +/;
                                                                break;
                                                case 'select':
                                                                if ($("[name="+id1+"] option:selected'")
                                                                                .val() != '') valid = true;
                                                                break;
                                                case 'checkbox':
                                                                if ($("[name="+id1+"]")
                                                                                .is(':checked') == true) valid = true;
                                                                break;
                                                case 'match':
                                                                if ($.trim($("[name="+id1+"]")
                                                                                .val().toLowerCase()) == $.trim($("[name='"+id2+"']")
                                                                                .val().toLowerCase())) valid = true;
                                                                break;
                                                case 'name':
                                                                regex = /^[-'a-zA-ZÀ-ÖØ-öø-ſ ]+$/;
                                                                break;
                                                case 'city':
                                                                regex = /^[-.a-zA-Z ]+$/;
                                                                break;
                                                case 'zip':
                                                                regex = /^\d{5}(-\d{4})?$/;
                                                                break;
                                                case 'zip_ca_only':
                                                                regex = /^([A-Za-z]\d[A-Za-z]\s?\d[A-Za-z]\d)$/;
                                                                break;
                                                case 'zip_with_ca':
                                                                regex = /^((\d{5}-\d{4})|(\d{5})|([A-Za-z]\d[A-Za-z]\s?\d[A-Za-z]\d))$/;
                                                                break;
                                                case 'number':
                                                                regex = /^[0-9]+$/;
                                                                break;
													 case 'numeric':
                                                                regex = /^[\d,]+$/;
                                                                break;
													 case 'alphanumeric':
													 				   regex = /^[0-9a-zA-Z]+$/;
																	   break;
                                                case 'digit':
                                                                regex = new RegExp('^\d{' + digit + '}$');
                                                                break;
                                                default:
                                                                regex = /^(?!\s*$).+/;
                                                                break;
                                }
                }
                if (valid === false)
                {
                                is_valid = regex.test(jQuery.trim(fields));
                                if (!is_valid)
                                {
                                               
                                                if (err == 0) 
                                                {
                                                                $("[name='"+id1+"']").eq(index)
                                                                                .focus();
                                                }
													
												if(typeof css == 'string'){
													  css = css.split(',');
													  
													  for(i=0;i<css.length;i++){
														  
                                            	   		 $("#"+css[i]).ac(errClass);
														  
													  }
												}else if(typeof css == 'object'){
													
													css.each(function(){
														
														$(this).ac(errClass);
														
														})
													
													}
                                                err++;
                                                return false;
                                }
                                else
                                {
                                                return true;
                                }
                }
                else
                {
                                return true;
                }
		
		};
		

    $.fn[ PLUGIN_NS ] = function( args ) {

        if ( $.type(args) !== 'object' )
            var args = {};

        var opts = $.extend({}, $.fn[ PLUGIN_NS ].defaults(), args);
			
		
		
		        return this.each(function(){
					var obj = $(this);
					obj.data( PLUGIN_NS+'Data' , args );
			
					if(opts.trigger.length > 0){
										
						opts.trigger.after('<div style="position:absolute; width:0;height:0; max-width: 0; max-height:0; overflow:hidden; padding:0; margin:0; border: none; background:none; visibility:hidden; position:absolute; opacity:0; -ms-filter: \'progid:DXImageTransform.Microsoft.Alpha(Opacity=0)\'; filter: alpha(opacity=0); -moz-opacity: 0;  -khtml-opacity: 0; "><input type="submit" style="width:0;height:0; max-width: 1px; max-height:1px; overflow:hidden; visibility:hidden; position:absolute; opacity:0; -ms-filter: \'progid:DXImageTransform.Microsoft.Alpha(Opacity=0)\'; filter: alpha(opacity=0); -moz-opacity: 0;  -khtml-opacity: 0; outline: none; border:none;" /></div>');						
						opts.trigger.on("click", function(e){
							
							e.preventDefault();
							
							
							obj.trigger("submit");
							
							})
						
						}
			
					obj.on("submit", function(e){ 
						err = 0;
						$(this).rm('error_container');
						$(this).rm('error_container_textarea');
						window[opts.vFunc](this);
				
						if(err==0){	
												
							var sFunc = opts.sFunc;					
												
							if(!/^function[^{]+\{\s*\}/m.test(sFunc.toString()) && typeof opts.sFunc == 'function'){
								
								e.preventDefault();
								
								var ajaxForm = $(this);
								var ajaxURL = opts.url;
								var ajaxCB = opts.rFunc;
								var ajaxDataType = opts.dataType;
								if(opts.ajax){
									var sFuncSubmit = function(data){
										
										var sFuncData = (typeof data == 'object') ? '&'+$.param(data) : '';
									
										$.post(ajaxURL,ajaxForm.serialize()+'&'+$.param(opts.data)+sFuncData, function(data){
									
											window[ajaxCB](data);
		
										},ajaxDataType)
									
										};
								}else{
									
									var sFuncSubmit = function(){ ajaxForm[0].submit();};
									
									}
										

								opts.sFunc(this, sFuncSubmit);
									
								return;
							}
							
							if(opts.ajax){
 
 								e.preventDefault();
								
								if(opts.hideSubmitOnAjax){
								
									$(document).on("ajaxStart.submit", function() {
 		 								 obj.find("input[type=submit], input[type=image]").hide();
										$(document).off("ajaxStart.submit");
									});
	
									if(opts.trigger.length > 0){
										$(document).on("ajaxStart.submitTrigger", function() {
 		 									opts.trigger.hide();
											$(document).off("ajaxStart.submitTrigger");
										});
									}

									$(document).on("ajaxStop.submit", function() {
 		 			 					obj.find("input[type=submit], input[type=image]").show();
										$(document).off("ajaxStop.submit");
									});	
				
									if(opts.trigger.length > 0){
										$(document).on("ajaxStop.submitTrigger", function() {
 		 									opts.trigger.show();
											$(document).off("ajaxStop.submitTrigger");
										});
									}
								}

								$.post(opts.url,$(this).serialize()+'&'+$.param(opts.data), function(data){
									
										if(typeof data == 'object'){
											
											if(data.success === true){
												
												if(opts.hideSubmitOnSuccess){
													
													obj.find("input[type=submit], input[type=image]").hide();
													
													if(opts.trigger.length > 0){
 		 												opts.trigger.hide();
														}
													
													}
												
												}
											
											}
									
										window[opts.rFunc](data);
		
									},opts.dataType)
								
								}
				
						 }else{ 

 							e.preventDefault();
 				
 						 } 
  					})	
					
					$(this).find("select, input[type!=button][type!=image][type!=submit][type!=hidden], textarea").each(function(index){
	
	
						var width =  $(this).outerWidth();
						var parentWidth = $(this).parent().width();
						
						if(opts.style.useSameLineSiblingLabel){
						
							$(this).parent().append('<div class="whiteSpaceTestDiv" style="position: absolute;visibility: hidden;height: auto;width: auto;">&nbsp;&nbsp;</div>');
						
							var whiteSpaceWidth = ($(this).parent().find(".whiteSpaceTestDiv")[0].clientWidth+1);
							
							$(this).parent().find(".whiteSpaceTestDiv").remove();
							
						}else{
							
							var whiteSpaceWidth  = 0;
							
							}
						
						var percent = 100*width/parentWidth;
						var whiteSpaceWidthPercent = 100*whiteSpaceWidth/parentWidth;
												
						if(isNaN(whiteSpaceWidthPercent))whiteSpaceWidthPercent=0;
						
						percent = (percent>100)?(100-whiteSpaceWidthPercent):(percent-whiteSpaceWidthPercent);
						
						if(opts.style.useSameLineSiblingLabel){
													
							if($(this).siblings('label').is(":visible"))	{
								$(this).siblings('label').css({"width": 100-whiteSpaceWidthPercent-percent+'%', "display":"inline-block", "vertical-align": "middle"});
								}
							
							}
							
						
														
						$(this).wrap($('<div class="input_wrapper" id="css_'+this.name+'_'+index+'" style="width: '+percent+'%; margin-top: '+$(this).css('margin-top')+';margin-right: '+$(this).css('margin-right')+';margin-bottom: '+$(this).css('margin-bottom')+';margin-left: '+$(this).css('margin-left')+'; vertical-align:middle;" />'));
						
						if(opts.style.useWrapperAutoWidth){
							
							$(this).parent().css("width","auto");

							
							}
	
						$(this).css("margin",0);	

						if(!$(this).is("textarea") && !$(this).is("input[type=hidden]")){
							
							$(this).parent().append('<img src="https://fa87bcbdd11ecfc69c9c-2dc64977f17434bd126a05fd8b10abd3.ssl.cf2.rackcdn.com/ClassObjects/resources/images/spacer.gif" width="9" />');
							
							if(!$(this).is(":visible")){
									
									$(this).parents().filter(function() {
											return $(this).css('display') == 'none';
										}).show().addClass('shouldBeHidden');
									
								}
								
								if($(this).css('display') == 'none'){
									
									$(this).show().addClass('shouldBeHidden');
									
									}
		
							if($(this).is("input[type!=radio][type!=checkbox][type!=file][type!=button][type!=submit][type!=image][type!=hidden]")){
								
								if(opts.style.useSameWidth){
									
									$(this).css("width",($(this).width()-9)+'px');
								
								}else if(!opts.style.useInheritWidths){
									
									$(this).css("width","100%");
									
									if($(this).parents('.placeholder-label-p').length > 0){
																				
										$(this).parents('.placeholder-label-p').css("width",(($(this).width()-9+($(this).outerWidth()-$(this).innerWidth()))/$(this).outerWidth(true))*100+'%');
										
										}else{
																						
											$(this).css("width",(($(this).width()-9+($(this).outerWidth()-$(this).innerWidth()))/$(this).outerWidth(true))*100+'%');
										}
									
								}
																	
							}
						}
						
						if($(this).is("select")){
							if(opts.style.useDropdownInheritWidth){
								
								$(this).css("width",($(this).width()-9)+'px');
								
							}else if(!opts.style.useDropdownAutoWidth){
								
								$(this).css("width","100%");
								$(this).css("width",(($(this).width()-9)/$(this).width())*100+'%');
								
								if(opts.style.useDropdownAutoMinWidth){
									
									var autoWidthObj = $(this).clone().css("width","inherit").appendTo("body");
									var autoWidth = autoWidthObj.width();
									autoWidthObj.remove();
									
									if($(this).width() < autoWidth){
										
										var diffPX = autoWidth - $(this).width();
										var parentWidthPercent = parseFloat($(this).parent()[0].style.width)/100.0;
										var parentWidthPX = $(this).parent().width();
										var parentOriginalWidthPX = parentWidthPX/parentWidthPercent;
										var parentAdjustedWidthPercent = ((parentWidthPX+diffPX)/parentOriginalWidthPX)*100;
										
										$(this).parent().css("width",parentAdjustedWidthPercent+'%');
										$(this).css("width","100%");
										$(this).css("width",(($(this).width()-9)/$(this).width())*100+'%');
											
										}
									
									}
									
								}else{
							
									$(this).parent().css("width", "auto");
									$(this).css("width", "inherit");
								
								}
								
								if(opts.style.useDropdownNoMargin !== false){
									
									$(this).parent().css({"margin-left":0, "margin-right":0});
									
									}
							
							}
						
						if(opts.style.useCheckboxAutoWidth !== false){
	
							if($(this).is("input[type=checkbox], input[type=radio]")){
								$(this).parent().css("width", "auto");
							}
						}
						
						if(opts.validateCheckboxOnChange){
							
							if($(this).is("input[type=checkbox], input[type=radio]")){
								
								$(this).on("change.validateCheckboxOnChange", function(e){
									
									if($(this).is(":checked")){
								
										var cbName = this.name;
								
										$("input[type=checkbox], input[type=radio]").filter(function(index) {
                               	    	 return this.name == cbName;
                              		  }).parents('.input_wrapper').removeClass('error_container');
										}
									})
								}
							
							}
						
						
						$('.shouldBeHidden').hide().removeClass('shouldBeHidden');
						
					})
					
			
					if(opts.phone !== false){
						if($(this).find("[data-validation='phone']").length>0 || (opts.phone.callback !== false && /^function[^{]+\{\s*\}/m.test(opts.phone.callback))){
						
							$.getScript('https://fa87bcbdd11ecfc69c9c-2dc64977f17434bd126a05fd8b10abd3.ssl.cf2.rackcdn.com/ClassObjects/resources/js/jquery/plugins/maskinput/js/jquery.maskinput.min.js', function()
	{
							obj.find("[data-validation='phone']").each(function(){
				
								if(typeof opts.phone.exclude == 'object'){
									if($(this).prop('id') && $.inArray($(this).prop('id'),opts.exclude) > -1){
										return;
									}
								}else if(opts.phone.exclude){
									 if($(this).prop('id') == opts.phone.exclude){
										 return;
										 }
									}
								$(this).mask('(999) 999-9999');
				
								})
			
								if(typeof opts.phone.callback == 'function'){
									opts.phone.callback();
									}
				
							})
						
						}
					}
					if(typeof opts.onComplete == 'function'){
						opts.onComplete();			
					}
				})
					
			
			
		
		
    };


    var defaults = {
		 url: '/lib/php/ajax/registration_ajax.php',
		 trigger: new Object(),
		 phone: {
			 callback:false,
			 exclude:false
			 },
		 style: {
			 useWrapperAutoWidth: false,
			 useSameWidth: false,
			 useInheritWidths: false,
			 useSameLineSiblingLabel: false,
			 useDropdownInheritWidth: false,
			 useDropdownAutoWidth: false,
			 useDropdownAutoMinWidth: false,
			 useCheckboxAutoWidth: true,
			 useDropdownNoMargin: false,
			 validateCheckboxOnChange: false
			 },
		 hideSubmitOnAjax: true,
		 hideSubmitOnSuccess: true,
		 debugMode: false, 
		 vFunc: 'validateFunctions',
		 rFunc: function(){},
		 sFunc: function(){},
		 data: {},
		 ajax: true,
		 onComplete: function(){},
		 dataType: 'json'
    };

    $.fn[ PLUGIN_NS ].defaults = function() {
        return $.extend({}, defaults);
    };

})(jQuery);

/*Post to Page*/
function postToNext(path, params, method) {
    method = method || "post"; 
 
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);

    for(var key in params) {
        if(params.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);

            form.appendChild(hiddenField);
         }
    }

    document.body.appendChild(form);
    form.submit();
}

/*Load JS File*/

function jsLoad(fileName)
{
    var js, ref;
    ref      = document.getElementsByTagName('script')[0];
    js       = document.createElement('script');
    js.async = true;
    js.src   = fileName;
    document.getElementsByTagName('head')[0].appendChild(js);
                                       
}

/*Load CSS File*/

function cssLoad(fileName)
{
               
    var fileSrc = document.createElement('link');
   
    fileSrc.setAttribute('rel', 'stylesheet');
    fileSrc.setAttribute('type', 'text/css');
    fileSrc.setAttribute('href', fileName);
   
    if(typeof fileSrc != 'undefined')
    {
        document.getElementsByTagName('head')[0].appendChild(fileSrc);
    }
                                       
}