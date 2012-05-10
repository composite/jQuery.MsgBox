jQuery MsgBox
=============

0.2.6 BETA

What is it?
-----------

Firefox style simplist dialog form.


How to use this?
----------------

It's quiet simple.

```html
<script src="jquery.lastest.js"></script>
<script src="jquery.msgbox.min.js"></script>
```

alert("i'm alert");
-> $.alert("i'm alert");

confirm("Are you sure?");
-> $.confirm("Are you sure?");

prompt("please text me.");
-> $.prompt("please text me.");

Wait! YOU MUST SEE BEFORE USE THIS PLUGIN,
------------------------------------------
this plugin is can't replace as javascript standard function (alert, etc.)
because, this plugin cannot wait user action while showing dialog.
If you want get user's action, put a callback function in next of message param.
when user clicked in a dialog button, such as OK or cancel, msgbox will call your defined function.

OK. so, How to use with callback function?
------------------------------------------

jQuery.MsgBox can add your callback function for provide next action after user clicked.
It's Very simple.

```js
$.alert("click me.",function(){
    $.alert('you clicked');
});
```
```js
$.confirm("press OK or Cancel.",function(bool){
    $.alert('you clicked'+(bool?'OK':'cancel'));
});
```
```js
$.prompt("what's your name?",function(string){
    $.alert('your name is '+string);
});
```

What browser can run with this plugin?
--------------------------------------
first, jQuery 1.4 or later needed.
and, You can run with most popular major browser,
Internet Explorer 8 or above, Firefox 3 or above, Safari 4 or above, Chrome 10 or above, Opera 9 or above.
NOTE : Old school browser, such as IE 7 or lower is have a problem with CSS issue.
that's all. this plugin have NO images or other resources.

Wow! It's simple and cool! can I join with you for make better this plugin?
---------------------------------------------------------------------------

Sure. contributes are welcome! just fork this plugin and get involved to make a better place for you and for me.


License
-------

(The MIT License)

Copyright (c) 2011-2012 ukjin yang <ukjinplant@msn.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.