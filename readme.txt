jQuery MsgBox 0.5.0 Beta

MIT License

Basic Usage :

$.alert(message,callback) : normal alert
	message : alert message
	callback : a function that call after user clicked ok button.
		function(){
		    //'this' keyword scopes alert container.
		}

$.confirm(message,callback) : normal confirm
	message : confirm message
	callback : a function that call after user click ok or cancel button
		function(bool){
		    //bool is a boolean value that true if user click ok, false if user click cancel.
		    //'this' keyword scopes alert container.
		}

$.prompt(message,value,callback,ispassword) : normal prompt alert
	message : prompt message
	value : a string value that default prompt value.
	callback : a function that call after user click ok or cacel button
		function(value){
		    //value will provide user prompt value to your callback function.
		    //when user clicked ok, value arg will provide user defined value.
		    //but when user clicked cacel, value arg will provide 'undefined' value. NOT NULL. UNDEFINED.
		    //when user input no word in prompt value and clicked ok, value arg will provide empty string.
		    //'this' keyword scopes alert container.
		}

Advenced Usage : 

$.msgbox(message,options) : A prototype of jQuery msgbox function.
	message : A message of msgbox.
	options : A options.
		submit : callback function. default is null.
		confirm : the msgbox will user confirm box, true. otherwise, false. default is false.
		input : the msgbox will prompt, give true or value string for default input value. If you want not this, you shouldn't define this option.
		css : a jQuery style css json value. default is firefox style defined css. If you want not default styles, set to null or {}.
			ui : msgbox container style
			modal : modal background style
			msg : message area style
			buttons : common button style
			indiv : text input container style
			input : test input style
		ok : a string defined alert ok button. default is $.msgbox.strings.ok
		yes : a string defined confirm or prompt ok button. $.msgbox.strings.yes
		no : a string defined confirm or prompt cancel button. $.msgbox.strings.no

$.msgbox.strings : static member, A default msgbox strings. you can change this globally.
	.ok : a string defined alert ok button. default is 'OK'.
	.yes : a string defined confirm or prompt ok button. default is 'OK'.
	.no : a string defined confirm or prompt cancel button. default is 'Cancel'.

$.msgbox.css : static member, A default msgbox style. If you want manual setting a msgbox style, set to null or {}. same as css property of $.msgbox function. 

Tested Browser :
Internet Explorer 8 or above, Firefox 3 or above, Chrome 9 or above, Safari 3 or above.
	NOT Supported Browser : Internet Explorer 7 or lower due to CSS issue. I'll never see these browsers.
jQuery 1.4 or above. (delegate method used, remove Browser compatibility for support jQuery over 1.8)

Known Issues : 

jQuery MsgBox is NOT awaiting user confirmation while script running. you should give callback function to provide next process.
in IE under 8, will flick Msgbox when showing. It's a known issue but I can't figure out it. but I'll fix it.