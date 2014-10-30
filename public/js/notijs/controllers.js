(function () {
	angular.module('notijs.controllers', [])

	// Controlador para notificaciones
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


		/*
		 * Función para obtener listado de notificaciones
		 */
		var getNotices = function(l){
			// Si ver todo esta activado asignar límite en null
			l = ($scope.seeAll) ? null : l ;
			// Obtener x últimas notificaciones
			noticeService.getNotices(l).then(function(notices){
				$scope.notices = notices;
			});
		};

		/*
		 * Función para obtener el número de notificaciones sin leer 
		 */
		var getUnread = function(){
			// Obtener número de notificaciones sin leer
			noticeService.getUnread().then(function(unread){
				$scope.unread = unread;
			});
		}

		/*
		 * Función para iniciar el listener de socket para notificaciones nuevas
		 */
		var socketInit = function(){
			socket.on("notice", function(notice){
				addNotice(notice);
			});
		};

		/*
		 * Función para agregar una notificacion a la lista del scope del controlador
		 */
		var addNotice = function(notice){
			var result = noticeService.addNotice(notice);
			$scope.notices = result.notices;
			$scope.unread = result.unread;
			
			// Aplicar cambios a $scope
			$scope.$apply();
		}

		/*
		 * Handler para el evento click de una notificación
		 */
		$scope.go = function(notice){
			noticeService.markAsRead(notice).then(function(unread){
				$scope.unread = unread;

				if(notice.url){
					window.location = notice.url;
				}
			});
		}

		/*
		 * Handler para el evento click del botón ver todas las notificaciones
		 */
		$scope.seeAllNotices = function(){
			$scope.seeAll = true;

			// Obtener todas las notificaciones
			getNotices();
		};

		/*
		 * Handler para el evento click del botón ver últimas notificaciones
		 */
		$scope.seeLessNotices = function(){
			$scope.seeAll = false;

			// Obtener últimas notificaciones
			getNotices(limit);
		}

		/*
		 * Handler para el evento click del botón marcar todas las notificaciones como leídas
		 */
		$scope.markAllAsRead = function(){
			noticeService.markAsRead().then(function(unread){
				$scope.unread = unread;
			});
		};

		/*
		 * Handler para el evento click del botón marcar como leída de cada notificación
		 */
		$scope.markAsRead = function(notice){
			noticeService.markAsRead(notice).then(function(unread){
				$scope.unread = unread;
			});
		};

		/*
		 * Handler para el evento click del botón eliminar todas las notificaciones
		 */
		$scope.deleteAll = function(){
			noticeService.delete().then(function(unread){
				$scope.unread = unread;
				$scope.notices = [];
			});
		};

		/*
		 * Handler para el evento click del botón eliminar para cada notificación
		 */
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

	// Controlador para notificaciones intantáneas
	.controller('FlashController', ["$scope", "$rootScope", "noticeService", function ($scope, $rootScope, noticeService) {
		
		// Socket
		var socket = $rootScope.socket;

		// Variables de scope
		$scope.notice = false;

		/*
		 * Handler para el evento click del botón para cerrar notificación instantánea
		 */
		$scope.remove = function(){
			$scope.notice = false;
		}

		/*
		 * Función para iniciar el listener de socket para notificaciones instantáneas nuevas
		 */
		var socketInit = function(){
			socket.on("flashNotice", function(notice){
			    addFlashNotice(notice);
			});
		};

		/*
		 * Función para asignar una notificación instantánea nueva al scope del controlador
		 */
		var addFlashNotice = function(notice){
			$scope.notice = notice;
			$scope.$apply();
		};

		// Iniciar listeners de socket
		socketInit();
	}]);
})();