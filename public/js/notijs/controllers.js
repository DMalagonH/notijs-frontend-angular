(function () {
	angular.module('notijs.controllers', [])

	.controller('NoticeController', ["$scope", "$rootScope", "noticeService", function ($scope, $rootScope, noticeService) {
		
		// Configuraciones globales
		var config = $rootScope.config;

		// Limite para ultimas notificaciones
		var limit = config.limit_latest;

		// Socket
		var socket = $rootScope.socket;

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
			socket.on("notice", function(notice){
				addNotice(notice);
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

		// Iniciar listeners de socket
		socketInit();
		
	}])
	.controller('FlashController', ["$scope", "$rootScope", "noticeService", function ($scope, $rootScope, noticeService) {
		
		// Socket
		var socket = $rootScope.socket;

		// Variables de scope
		$scope.notice = false;

		$scope.remove = function(){
			$scope.notice = false;
		}

		var socketInit = function(){
			socket.on("flashNotice", function(notice){
			    addFlashNotice(notice);
			});
		};

		var addFlashNotice = function(notice){
			$scope.notice = notice;
			$scope.$apply();
		};

		// Iniciar listeners de socket
		socketInit();
	}]);
})();