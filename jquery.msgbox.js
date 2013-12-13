/**************************************************************************************
 * jQuery MsgBox 0.8.1
 * by composite (ukjinplant@msn.com)
 * http://blog.hazard.kr
 * This project licensed under a MIT License.
 **************************************************************************************/;
(function ($) {
    if(!window.console){
        window.console = {};
        window.console.log = $.noop;
    }
    var fixed = 'fixed', div = 'div', kp = 'keypress', rs = 'resize', mb = 'msgbox-', dmb = '.' + mb, cst = mb + '-style', btn = 'button', clk = 'click', legacy = 'v' == '\v' //IE 8 대응.
        ,isCssDef = function(css){
            return !css || css == 'auto';
        },$$ = function(tag){return $(document.createElement(tag));};

    //첫 메시지박스 실행시 스타일시트 삽입
    var styleGen = function(style, repl){
        if(styleGen.once && !repl) return;
        style = style || {};
        var css = styleGen.style ? styleGen.style : (styleGen.style = $$('style').addClass(cst).attr('type','text/css')), builder = [];

        for(var part in style){
            if(!style[part]){continue;}
            var cs = style[part];

            builder.push(dmb + part);
            builder.push('{');

            for(var name in cs){
                if(legacy){
                    switch(name){
                        case 'opacity':builder.push('filter:alpha(opacity=' + (+(cs[name].substring(0,1) == '.' ? ('0'+cs[name]) : cs[name]) * 100 || 100) + ');');break;
                        default:builder.push(name + ':' + cs[name] + ';');break;
                    }
                }else{
                    builder.push(name + ':' + cs[name] + ';');
                }
            }

            builder.push('}');
        }

        css.each(function(){ // IE 8 때문에 별도의 방법 사용
            var cont = builder.join('');
            if(legacy){ // IE 문제 해결
                this.styleSheet.cssText = cont;
            }else{ // 나머지는 표준대로
                this.innerHTML = cont;
            }
        }).appendTo('head');
        styleGen.once = true;
    }

    //함수 실행부
    $.msgbox = function (msg, options) {
        //옵션 가공
        options = $.extend({}, $.msgbox.options, options);

        //스타일 생성
        if(!$(cst).length){styleGen($.msgbox.css);}

        //변수 및 요소 정의
        var io = {},
            cok = mb + 'ok',
            cno = mb + 'no',
            pw = 'password',
            styles = options.css || {},
            t = !0,
            f = !1,
            p = options.input !== false && options.input != undefined && options.input != null,
            q = !!options.confirm,
			iae = function(e) { //포커스된 요소가 메시지박스 아니면 메시지박스로 강제 포커스 이동
				setTimeout(function(){
					var act=$(document.activeElement),ms=[dmb+'input',dmb+btn];
					if(act.length&&(act.is(ms[0])||act.is(ms[1]))){
                        //console.log('good.');
                    }
					else $C.find(ms+'').eq(0).focus();
				},0);
			},
            $W = $(window),
            //경고창
            $C = $$(div).addClass(mb + 'container').append($$(div).addClass(mb + 'ui').addClass(mb + (p ? 'prompt' : (q ? 'confirm' : 'alert')))).children(),
            //경고창 배경
            $M = $$(div).addClass(mb + 'modal'),
            //경고 내용
            $T = $$(div).addClass(mb + 'msg').html(msg).appendTo($C),
            //입력 모드시 입력창
            $I = p ?
				$("<div><input type='" + (options[pw] ? pw : 'text') + "'/></div>").addClass(mb + 'inbox').children()
					.addClass(mb + 'input').bind('keydown',function(e){//탭의 역순 시 마지막 버튼 포커스
                        var code = e.which;
						if(code == 9 && e.shiftKey){
							e.preventDefault();
							$C.find(dmb+btn).filter(':last').focus();
						}else{
                            switch(code){
                                case 13://엔터는 확인
                                    e.preventDefault();
                                    $C.find(btn + '.' + cok).trigger(clk);
                                    return false;
                                case 27://ESC는 취소
                                    e.preventDefault();
                                    $C.find(btn + '.' + (p || q ? cno : cok)).trigger(clk);
                                    break;
                            }
                        }
					}).bind('blur',iae).end().appendTo($C)
				: null,
            //경고 버튼 나열
            $B = $$(div).addClass(mb + 'buttons').appendTo($C),
            //기본 버튼
            $BT = $$(btn).addClass(mb + btn).bind('keydown',function(e){
				if(this!=document.activeElement) return;
				
                e.stopPropagation();
				var code = e.which,that=$(this),target,shift=e.shiftKey;
				switch (code) {
					case 9://탭키 누르면 다음 버튼 및 입력창 포커스
					case 39://오른쪽키 누르면 다음 버튼으로만 포커스
                        e.preventDefault();
						if(target=that[code==9&&shift?'prev':'next'](btn),target.length) target.focus();
						else if(code==9){
							if(target=$C.find(dmb+'input'),target.length) target.select();
							else if(target=that[shift?'next':'prev'](btn),target.length) target.focus();
						}
						break;
					case 37://왼쪽키는 이전 버튼으로만 포커스
                        e.preventDefault();
						if(target=that.prev(btn),target.length) target.focus();
						break;
					case 27://ESC는 무조건 취소처리
                        e.preventDefault();
						$C.find(btn + '.' + (p || q ? cno : cok)).trigger(clk);
						break;
				}
			}).bind('blur',iae),
            //버튼 원형
            $BS = [
            $BT.clone(t).addClass(cok).text(q ? options.yes : options.ok).appendTo($B), p || q ? $BT.clone(t).addClass(cno).text(options.no).appendTo($B) : null]; //경고 버튼들
		$C.add($M).bind('keydown',function(){});
        $.extend($C[0], {container: $C.parent()[0],modal: $M[0], msg: $T[0], inbox: $I ? $I[0] : null, buttons: $B[0]});
        //입력 모드시 조치사항
        if (p) {
            options.confirm = t; //확인 모드 맞음.
            if (options.input !== true) $I.children().val(options.input);
        }
        //윈도우 리사이징에 대한 메시지박스 반응
        $W.bind(rs,io[rs] = function() {
            if(!io.firstWidth){
                io.firstUnder = true;
                io.firstWidth = $C.outerWidth();
                //console.log(io.firstWidth);
            }
            var isOver = $W.width() - 20 <= io.firstWidth;
            if (!$.isFunction(options.onresize)){
                if($.isFunction($.msgbox.onresize)){
                    $.msgbox.onresize.call($C[0], io);
                }
            }else{
                options.onresize.call($C[0], io);
            }
        });
        //경고창 비활성화 전
        io.before = function (e) {
			e.stopPropagation();
            var code = window.event ? window.event.keyCode : e.which;
			//전역 메시지박스에도 before가 붙으므로 격리.
			if(e.target.type=='text'&&!code){
				$C.find(btn + '.' + (p || q ? cno : cok)).trigger(clk);
				return f;
			}
            switch (code) {
				case 13:
					$C.find(btn + ':focus').trigger('click');
					return f;
				case 27:
					$C.find(btn + '.' + (p || q ? cno : cok)).trigger(clk);
					return f;
			}
        };
        //body에 삽입 후 레이아웃 잡기
        var kt = dmb + 'ui,' + dmb + 'modal',
            $D = $(document.documentElement || document.body).append($M).append($C.parent()).bind(kp, io.before);
        //경고창 비활성화 후
        io.after = function (b, v) {
            var isok = $(b).hasClass(cok);
            switch (t) {
                case p:
                    options.submit.call($C[0], isok ? v : null);
                    break;
                case q:
                    options.submit.call($C[0], isok);
                    break;
                default:
                    options.submit.call($C[0]);
                    break;
            }
            $D.unbind(kp, io.before);
            $W.unbind(rs, io[rs]);
        };
        //공통 경고 클릭 시 조치
        $C.delegate(btn, clk, function (e) {
            var cleanup = function(){
                $C.parent().add($M).remove();
            },onclose = options.onclose || $.msgbox.onclose;
            
            io.after(this, p ? $I.children().val() : null);

            if($.isFunction(onclose)) $.when(onclose.call($C[0], p ? I.children().val() : $(this).hasClass(cok))).always(cleanup);
            else cleanup();
        });
        
        var prepare = function(){
            //레이아웃 자동정렬
            $W.trigger(rs);
            //경고창 포커스
            if (p) $C.find('input:text').select();
            else $C.find(btn + ':eq(0)').focus();
            //onopen 이벤트 발생
            var onopen = options.onopen || $.msgbox.onopen;
            if($.isFunction(onopen)) onopen.call($C[0], options);
        };

        if(legacy){setTimeout(prepare,0);}
        else{prepare();}
        
        return $C;
    };
    $.extend($.msgbox, {
        strings: {
            ok: 'OK',
            yes: 'OK',
            no: 'Cancel'
        },
        css: {
            container: {
                'position': fixed,
                'left': '50%',
                'top': '32%',
                'z-index': '9001'
            },
            ui: {
                'border': '1px solid black',
                'font': '9pt verdana,gulim,sans-serif',
                'background-color': 'white',
                'position': 'relative',
                'left': '-50%',
                'top': '32%',
                'overflow': 'hidden',
                'float': 'right'
            },
            modal: {
                'position': fixed,
                'left': '0',
                'top': '0',
                'right': '0',
                'bottom': '0',
                'background-color': 'black',
                'opacity': '.4',
                'z-index': '9000'
            },
            msg: {
                'padding': '2em 4em',
                'overflow': 'hidden',
                'font-family': 'verdana,gulim,sans-serif',
                //'max-width':(screen.availWidth*0.9)+'px',
                'white-space': 'pre-wrap',
                'word-wrap': 'break-word'
            },
            buttons: {
                'padding': '1em',
                'background-color': '#eee',
                'text-align': 'right',
                'overflow': 'hidden'
            },
            button: {
                'width': '72px',
                'margin': 'auto .25em'
            },
            inbox: {
                'width': '90%',
                'margin': '-1em auto 1em',
                'border': '1px inset #3D7BAD'
            },
            input: {
                'width': '99%',
                'display': 'block',
                'border': '0'
            }
        },
        onresize: function(io){
            var $C = $(this), $P = $C.parent();
            if(!io.firstWidth){
                io.firstUnder = true;
                io.firstWidth = $C.outerWidth();
                //console.log(io.firstWidth);
            }
            var isOver = $(window).width() - 20 <= io.firstWidth;
            if(isOver && !io.isOver){
                //console.log('OVER');
                io.isOver = true;
                $P.css({
                    'left': '10px',
                    'right': '10px',
                    'margin-top': ~~ (-$C.outerHeight() * 0.32) + 'px',
                    'min-width': ''
                });
                $C.css({position:'static'});
            }else if((!isOver && io.isOver) || io.firstUnder){
                //console.log('UNDER');
                io.firstUnder = false;
                io.isOver = false;
                $P.css({
                    'left': '',
                    'right': '',
                    'margin-top': ~~ (-$C.outerHeight() * 0.32) + 'px',
                    'min-width': io.firstWidth + 'px'
                });
                $C.css({position:''});
            }
        }
    });
    $.msgbox.options = {
        submit: function () {},
        confirm: false,
        //input:false,
        //onresize: function(){},
        //onopen: function(){},
        //onclose: function(){},
        ok: $.msgbox.strings.ok,
        yes: $.msgbox.strings.yes,
        no: $.msgbox.strings.no
    };
    $.alert = function (msg, callback) {
        return $.msgbox(msg, {
            submit: callback
        });
    };
    $.confirm = function (msg, callback) {
        return $.msgbox(msg, {
            confirm: true,
            submit: callback
        });
    };
    $.prompt = function (msg, val, callback, pw) {
        var shift = $.isFunction(val);
        return $.msgbox(msg, {
            input: shift ? true : val,
            submit: shift ? val : callback,
            password: shift ? callback : pw
        });
    };
})(jQuery);