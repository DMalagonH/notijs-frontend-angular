(function () {
	angular.module('notijs.controllers', [])

	.controller('NoticeController', ["$scope", "$rootScope", "noticeService", "$http", function ($scope, $rootScope, noticeService, $http) {
		
		// Configuraciones globales
		var config = $rootScope.config;

		// Limite para ultimas notificaciones
		var limit = config.limit_latest;

		// Conexión con socket
		var socket = io.connect(config.socket_url);

		// Variables de scope
		$scope.notices = [];
		$scope.unread = 0;
		$scope.seeAll = false;


		var getNotices = function(l){
			// Si ver todo esta activado asignar límite en null
			l = ($scope.seeAll) ? null : l ;
			// Obtener x últimas notificaciones
			noticeService.getNotices(l).then(function(notices){
				$scope.notices = notices;
			});
		};

		var getUnread = function(){
			// Obtener número de notificaciones sin leer
			noticeService.getUnread().then(function(unread){
				$scope.unread = unread;
			});
		}

		var socketInit = function(){
			socket.emit("connection", {
				"user_id": 	config.user_id		
			});

			socket.on("notice", function(notice){
				addNotice(notice);
			});

			socket.on("flashNotice", function(notice){
			    console.log("flasNotice", notice);
			});
		};

		var addNotice = function(notice){
			var result = noticeService.addNotice(notice);
			$scope.notices = result.notices;
			$scope.unread = result.unread;
			
			// Aplicar cambios a $scope
			$scope.$apply();
		}

		$scope.go = function(notice){			
			noticeService.markAsRead(notice).then(function(unread){
				$scope.unread = unread;
				console.log("Ir a", notice.url);
				//window.location = notice.url;
			});
		}

		$scope.seeAllNotices = function(){
			$scope.seeAll = true;

			// Obtener todas las notificaciones
			getNotices();
		};

		$scope.seeLessNotices = function(){
			$scope.seeAll = false;

			// Obtener últimas notificaciones
			getNotices(limit);
		}

		$scope.markAllAsRead = function(){
			noticeService.markAsRead().then(function(unread){
				$scope.unread = unread;
			});
		};

		$scope.markAsRead = function(notice){
			noticeService.markAsRead(notice).then(function(unread){
				$scope.unread = unread;
			});
		};

		$scope.deleteAll = function(){
			noticeService.delete().then(function(unread){
				$scope.unread = unread;
				$scope.notices = [];
			});
		};

		$scope.delete = function(notice){
			noticeService.delete(notice).then(function(unread){
				$scope.unread = unread;
				// Obtener x últimas notificaciones
				getNotices(limit);
			});
		};

		
		// Obtener últimas notificaciones
		getNotices(limit);

		// Obtener cantidad de notificaciones sin leer
		getUnread();

		// Iniciar conexión con socket
		socketInit();
		
	}]);

})();