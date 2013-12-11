/**************************************************************************************
 * jQuery MsgBox 0.3.7
 * by composite (ukjinplant@msn.com)
 * http://blog.hazard.kr
 * This project licensed under a MIT License.
 **************************************************************************************/;
(function ($) {
    var fixed = 'fixed';
    $.msgbox = function (msg, options) {
        //옵션 가공
        options = $.extend({}, $.msgbox.options, options);
        //변수 및 요소 정의
        var io = {},
            mb = 'msgbox-',
            cok = mb + 'ok',
            cno = mb + 'no',
            pw = 'password',
            styles = options.css || {},
            t = !0,
            f = !1,
            p = ('input' in options),
            q = !! options.confirm,
			iae = function(e) { //포커스된 요소가 메시지박스 아니면 메시지박스로 강제 포커스 이동
				setTimeout(function(){
					var act=$(document.activeElement),ms=['.'+mb+'input','.'+mb+'button'];
					if(act.length&&(act.is(ms[0])||act.is(ms[1]))){console.log('good.');}
					else $C.find(ms+'').eq(0).focus();
				},0);
			},
            $C = $("<div></div>").addClass(mb + 'ui').css(styles.ui || {}),
            //경고창
            $M = $("<div>&shy;</div>").addClass(mb + 'modal').css(styles.modal || {}),
            //경고창 배경
            $T = $("<div></div>").addClass(mb + 'msg').css(styles.msg || {}).html(msg).appendTo($C),
            //경고 내용
            $I = p ?
				$("<div><input type='" + (options[pw] ? pw : 'text') + "'/></div>").addClass(mb + 'inbox').css(styles.indiv || {}).children()
					.addClass(mb + 'input').css(styles.input || {}).bind('keydown',function(e){//탭의 역순 시 마지막 버튼 포커스
						if((window.event ? window.event.keyCode : e.which)==9&&e.shiftKey){
							e.preventDefault();
							$C.find('.'+mb+'button').filter(':last').focus();
						}
					}).bind('blur',iae).end().appendTo($C)
				: null,
            //입력 모드시 입력창
            $B = $("<div></div>").addClass(mb + 'buttons').css(styles.buttons || {}).appendTo($C),
            //경고 버튼 나열
            $BT = $("<button></button>").addClass(mb + 'button').css(styles.button || {}).bind('keydown',function(e){
				if(this!=document.activeElement) return;
				e.stopPropagation();
				var code = window.event ? window.event.keyCode : e.which,that=$(this),target,shift=e.shiftKey;
				switch (code) {
					case 9://탭키 누르면 다음 버튼 및 입력창 포커스
					case 39://오른쪽키 누르면 다음 버튼으로만 포커스
						e.preventDefault();
						if(target=that[code==9&&shift?'prev':'next']('button'),target.length) target.focus();
						else if(code==9){
							if(target=$C.find('.'+mb+'input'),target.length) target.select();
							else if(target=that[shift?'next':'prev']('button'),target.length) target.focus();
						}
						break;
					case 37://왼쪽키는 이전 버튼으로만 포커스
						e.preventDefault();
						if(target=that.prev('button'),target.length) target.focus();
						break;
					case 27://ESC는 무조건 취소처리
						e.preventDefault();
						$C.find('button.' + (p || q ? cno : cok)).trigger('click');
						break;
				}
			}).bind('blur',iae),
            //버튼 원형
            $BS = [
            $BT.clone(t).addClass(cok).text(q ? options.yes : options.ok).appendTo($B), p || q ? $BT.clone(t).addClass(cno).text(options.no).appendTo($B) : null]; //경고 버튼들
		$C.add($M).bind('keydown',function(){});
        //입력 모드시 조치사항
        if (p) {
            options.confirm = t; //확인 모드 맞음.
            if (typeof (options.input) == 'string') $I.children().val(options.input);
        }
        //경고창 비활성화 전
        io.before = function (e) {
			e.stopPropagation();
            var code = window.event ? window.event.keyCode : e.which;
			//전역 메시지박스에도 before가 붙으므로 격리.
			if(e.target.type=='text'&&!code){
				$C.find('button.' + (p || q ? cno : cok)).trigger('click');
				return f;
			}
            switch (code) {
				case 13:
					$C.find('button.' + cok).trigger('click');
					return f;
				case 27:
					$C.find('button.' + (p || q ? cno : cok)).trigger('click');
					return f;
			}
        };
        //body에 삽입 후 레이아웃 잡기
        var kp = 'keypress',
            kt = '.' + mb + 'ui,.' + mb + 'modal',
            $D = $(document.documentElement ? document.documentElement : document.body).append($M).append($C).bind(kp, io.before);
        //경고창 비활성화 후
        io.after = function (b, v) {
            for (var i = 0, cn = b.className.split(' '); i < cn.length; i++)
            switch (cn[i]) {
            case cok:
                switch (t) {
                case p:
                    options.submit.call($C[0], v);
                    break;
                case q:
                    options.submit.call($C[0], !! t);
                    break;
                default:
                    options.submit.call($C[0]);
                    break;
                }
                break;
            case cno:
                if (p || !(p && q)) {
                    options.submit.call($C[0]);
                } else {
                    options.submit.call($C[0], f);
                }
                break;
            }
            $D.unbind(kp, io.before);
        };
        //공통 경고 클릭 시 조치
        $C.delegate('button', 'click', function (e) {
            $C.add($M).remove();
            io.after(this, p ? $I.children().val() : null);
        });
        //레이아웃 자동정렬
        setTimeout(function(){ //setTimeout 으로 pre 속성으로 인한 IE 중앙정렬 문제 수정
            if (styles.ui) $C.css({
                'margin-left': ~~ (-$C.outerWidth() * 0.5) + 'px',
                'margin-top': ~~ (-$C.outerHeight() * 0.32) + 'px'
            });
        },0);
        //경고창 포커스
        if (p) $C.find('input:text').select();
        else $C.find('button:eq(0)').focus();
        return $C;
    };
    $.extend($.msgbox, {
        strings: {
            ok: 'OK',
            yes: 'OK',
            no: 'Cancel'
        },
        css: {
            ui: {
                'border': '1px solid black',
                'font': '9pt verdana,gulim,sans-serif',
                'background-color': 'white',
                'position': fixed,
                'left': '50%',
                'top': '32%',
                'overflow': 'hidden'
            },
            modal: {
                'position': fixed,
                'left': '0',
                'top': '0',
                'right': '0',
                'bottom': '0',
                'background-color': 'black',
                'opacity': '.4'
            },
            msg: {
                'padding': '2em 4em',
                'overflow': 'hidden',
                'font-family': 'verdana,gulim,sans-serif',
                //'max-width':(screen.availWidth*0.9)+'px',
                'white-space': 'pre'
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
            indiv: {
                'width': '90%',
                'margin': '-2em auto 2em',
                'border': '1px inset #3D7BAD'
            },
            input: {
                'width': '99%',
                'display': 'block',
                'border': '0'
            }
        }
    });
    $.msgbox.options = {
        submit: function () {},
        confirm: false,
        //input:false,
        css: $.msgbox.css,
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