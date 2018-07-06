// Аутентификация
var authentication = function(login_selector, pwd_selector, auth_fire_selector, path, auth_href, error_selector){

    var _self = this;								// Альтерэго
	this.login_selector = login_selector;			// Селектор логина
	this.pwd_selector = pwd_selector;				// Селектор пароля
	this.auth_fire_selector = auth_fire_selector;	// Селектор сабмита
	this.path = path;								// Путь перехода после успешной автрризации
    this.error_selector = error_selector;           // селектор вывода ошибок
    this.auth_href = auth_href || '';               // путь к интерфейсу аутентификации

    /**
     * Первичная авторизация
     */
	this.fire_auth = function(){
		if ( typeof _self.login_selector != 'undefined' && typeof _self.pwd_selector != 'undefined' ){
			
			var session_login = $(_self.login_selector).val();
			var session_pwd = $(_self.pwd_selector).val();

			if ( typeof session_login != 'undefined' && typeof session_pwd != 'undefined' && session_login != '' && session_pwd != '' ){

				$.ajax({
					type: "POST",
				    url: "php/authentication.php?auth=fire",
				    data: {
                        session_login: session_login,
                        session_pwd: session_pwd,
                        session_hash: localStorage['session_hash'] || '',
                        session_num: localStorage['session_num'] || ''
                    }
				})
				.done(function( session ) {

				    // Авторизация вернула хэш
				    if ( session.length > 0 ){

                        var session_result = '';

                        try {

                            session_result = JSON.parse(session);

                            // сохраняем данные сессии в локалсторедже
                            localStorage['session_login'] = session_login;
                            localStorage['session_hash'] = session_result['session_hash'];
                            localStorage['session_num'] = session_result['session_num'];

                            // перенаправляем на страницу приложения
                            document.location.href = _self.path;
                        }
                        catch (e) {

                            session_result = session;

                            // отображаем ошибку авторизации
                            if ( _self.error_selector != '' ){
                                _self.show_auth_error(session_result);
                            }
                            else{
                                alert(session_result);
                            }
                        }
				    }
				});
			}
		}
	}

    /**
     * Отображение ошибки авторизации (можно переопределить)
     *
     * @param error_text
     * @param selector
     */
    this.show_auth_error = function(error_text, selector){

        error_text = error_text || '';
        selector = selector || _self.error_selector;

        $(selector).html(error_text).show();
        setTimeout(function(){ $(selector).fadeOut('slow'); }, 7000);
    }
	
	// Отмена аутентификации
	this.cancel_auth = function(exit_btn_selector, path){

		$(exit_btn_selector).on('click', function(){

            $.ajax({
                type: "POST",
                url: "php/authentication.php?auth=cancel",
                data: {
                    session_login: localStorage['session_login'] || '',
                    session_hash: localStorage['session_hash'] || '',
                    session_num: localStorage['session_num'] || ''
                }
            });

			localStorage.removeItem('session_login');
			localStorage.removeItem('session_hash');
            localStorage.removeItem('session_num');

			document.location.href = path;
		});		
	}

	// Обёртка логина из localstorage
	this.get_local_login = function(){
		if ( typeof localStorage['session_login'] != 'undefined' ) {
            return localStorage['session_login'];
        }
		return 0;
	}

	// Обёртка хэша из localstorage
	this.get_local_hash = function(){

		if ( typeof localStorage['session_hash'] != 'undefined' ) {
            return localStorage['session_hash'];
        }
		return 0;
	}

    /**
     * Пост-аутентификация. В случае её отсутствия - переход по auth_href
     *
     * @param auth_href - ссылка на интерфейс авторизации
     */
	this.if_no_auth_go_to = function(auth_href){

        // проверка переменных в локалсторейдже
        _self.auth_href = auth_href || _self.auth_href;
		if ( typeof localStorage['session_hash'] == 'undefined' || localStorage['session_hash'].length != 32 ){
            document.location.href = _self.auth_href;
        }
	}

	// Конструктор
	this._initialize = function(){

		if ( typeof _self.auth_fire_selector != 'undefined' && typeof _self.pwd_selector != 'undefined' && typeof _self.login_selector != 'undefined' ){

			// Сабмит при клике на кнопку "сабмит"
			$(_self.auth_fire_selector).on('click', _self.fire_auth);
			// Самит при нажатии "enter" на поле ввода пароля
			$(_self.pwd_selector).on('keydown', function(e){
				if ( e.which == 13 ){
					_self.fire_auth();
				}
			});
		}

        // Автоматическая подстановка аутентификационных данных в ajax-запросы
        var storage = {
            session_login : function(){ return localStorage['session_login'] },
            session_hash : function(){ return localStorage['session_hash'] },
            session_num : function(){ return localStorage['session_num'] }
        };

        $.ajaxSetup({
		    data:{
                session_login:storage.session_login || '',
                session_hash:storage.session_hash || '',
                session_num:storage.session_num || ''
		    }
		});

        // прослушка события потери сессии от сервера при успешном аджаксе
        $( document ).ajaxSuccess(function( event, xhr, settings ) {

            if ( typeof xhr.responseText != 'undefined' && xhr.responseText.indexOf('AUTH_SESSION_EXPIRED') != -1 ){
                // выбрасываем пользователя на страницу аутентификации
                document.location.href = _self.auth_href;
            }
        });

        // прослушка события потери сессии при ошибке аджакса
        $( document ).ajaxError(function( event, xhr, settings) {

            if ( typeof xhr.responseText != 'undefined' && xhr.responseText.indexOf('AUTH_SESSION_EXPIRED') != -1 ){
                // выбрасываем пользователя на страницу аутентификации
                document.location.href = _self.auth_href;
            }
        });
	}

	this._initialize();
}