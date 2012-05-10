/**************************************************************************************
 * jQuery MsgBox 0.2.6
 * by composite (ukjinplant@msn.com)
 * http://blog.hazard.kr
 * MIT License
 **************************************************************************************/
;(function($){
	var nofix=$.browser.msie&&~~$.browser.version<8,
		fixed=nofix?'absolute':'fixed';
	$.msgbox=function(msg,options){
		//�ɼ� ����
		options=$.extend({},$.msgbox.options,options);
		//���� �� ��� ���
		var io={},mb='msgbox-',cok=mb+'-ok',cno=mb+'-no',pw='password',styles=options.css||{},t=!0,f=!1,p=('input' in options),q=!!options.confirm,
			$C=$("<div></div>").addClass(mb+'ui').css(styles.ui||{}),//���â
			$M=$("<div>&shy;</div>").addClass(mb+'modal').css(styles.modal||{}),//���â ���
			$T=$("<pre></pre>").addClass(mb+'msg').css(styles.msg||{}).html(msg).appendTo($C),//��� ����
			$I=p?$("<div><input type='"+(options[pw]?pw:'text')+"'/></div>").addClass(mb+'inbox').css(styles.indiv||{})
				.children().addClass(mb+'input').css(styles.input||{}).end().appendTo($C):null,//�Է� ���� �Է�â
			$B=$("<div></div>").addClass(mb+'buttons').css(styles.buttons||{}).appendTo($C),//��� ��ư ����
			$BT=$("<button></button>").addClass(mb+'button').css(styles.button||{}),//��ư ����
			$BS=[
				$BT.clone(t).addClass(cok).text(q?options.yes:options.ok).appendTo($B)
				,p||q?$BT.clone(t).addClass(cno).text(options.no).appendTo($B):null
			];//��� ��ư��
		//�Է� ���� �ġ����
		if(p){
			options.confirm=t;//Ȯ�� ��� ���.
			if(typeof(options.input)=='string') $I.children().val(options.input);
		}
		//���â ��Ȱ��ȭ ��
		io.before=function(e){
			var code=window.event?window.event.keyCode:e.which;
			switch(code){
				case 13:$C.find('button.'+cok).trigger('click');return f;
				case 0:case 27:$C.find('button.'+(p||q?cno:cok)).trigger('click');return f;
			}
		};
		//body�� ���� �� ���̾ƿ� ���
		var kp='keypress',kt='.'+mb+'ui,.'+mb+'modal',$D=$(document.documentElement?document.documentElement:document.body)
			.append($M).append($C).bind(kp,io.before);
		//$C.add($M).keypress(io.before);
		//���â ��Ȱ��ȭ ��
		io.after=function(b,v){
			for(var i=0,cn=b.className.split(' ');i<cn.length;i++)
				switch(cn[i]){
					case cok:
						switch(t){
							case p:options.submit.call($C[0],v);break;
							case q:options.submit.call($C[0],!!t);break;
							default:options.submit.call($C[0]);break;
						}
						break;
					case cno:
						if(p||!(p&&q)){
							options.submit.call($C[0]);
						}else{
							options.submit.call($C[0],f);
						}
						break;
				}
			$D.unbind(kp,io.before);
		};
		//���� ��� Ŭ�� �� �ġ
		$C.delegate('button','click',function(e){
			$C.add($M).remove();
			io.after(this,p?$I.children().val():null);
		}).delegate('input','keypress',io.before);
		//���̾ƿ� �ڵ����
		if(styles.ui)
			$C.css({
				'margin-left':~~(-$C.outerWidth()*0.5)+'px',
				'margin-top':~~(-$C.outerHeight()*0.75)+'px'
			});
		//���â ��Ŀ��
		if(p) $C.find('input:text').select(); else $C.find('button:eq(0)').focus();
		return $C;
	};
	$.extend($.msgbox,{
		strings:{
			ok:'OK',
			yes:'OK',
			no:'Cancel'
		},
		css:{
			ui:{
				'border':'1px solid black','font':'9pt verdana,gulim,sans-serif',
				'background-color':'white',
				'position':fixed,'left':'50%','top':'50%','overflow':'hidden'
			},modal:{
				'position':fixed,'left':'0','top':'0','right':'0','bottom':'0',
				'background-color':'black','opacity':'.5'
			},msg:{
				'padding':'2em 4em','overflow':'hidden','font-family':'verdana,gulim,sans-serif'//,'max-width':(screen.availWidth*0.9)+'px'
			},buttons:{
				'padding':'1em',
				'background-color':'#eee',
				'text-align':'right','overflow':'hidden'
			},button:{
				'width':'72px','margin':'auto .25em'
			},indiv:{
				'width':'90%','margin':'-2em auto 2em','border':'1px inset #3D7BAD'
			},input:{
				'width':'100%','display':'block','border':'0'
			}
		}
	});
	$.msgbox.options={
			submit:function(){},
			confirm:false,//input:false,
			css:$.msgbox.css,
			ok:$.msgbox.strings.ok,
			yes:$.msgbox.strings.yes,
			no:$.msgbox.strings.no
		};
	$.alert=function(msg,callback){
		return $.msgbox(msg,{
			submit:callback
		});
	};
	$.confirm=function(msg,callback){
		return $.msgbox(msg,{
			confirm:true,
			submit:callback
		});
	};
	$.prompt=function(msg,val,callback,pw){
		var shift=$.isFunction(val);
		return $.msgbox(msg,{
			input:shift?true:val,
			submit:shift?val:callback,
			password:shift?callback:pw
		});
	};
})(jQuery);