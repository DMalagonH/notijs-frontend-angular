(function () {
	angular.module('notijs.controllers', [])

	.controller('NoticeController', ["$scope", "noticeService", "$http", function ($scope, noticeService, $http) {
		var user_id = 1;
		var server = "http://localhost:2100";

		$scope.notices = [];
		$scope.unread = 0;

		// Obtener 5 últimas notificaciones
		noticeService.getNotices(5).then(function(notices){
			$scope.notices = notices;
		});

		// Obtener número de notificaciones sin leer
		noticeService.getUnread().then(function(unread){
			$scope.unread = unread;
		});

		$scope.go = function(notice){
			noticeService.markAsRead(notice).then(function(unread){
				$scope.unread = unread;
				console.log("Ir a", notice.url);
				//window.location = notice.url;
			});
		}

		$scope.seeAllNotices = function(){
			console.log("Ver todas las notificaciones");
		};

		$scope.markAllAsRead = function(){
			noticeService.markAsRead().then(function(unread){
				$scope.unread = unread;
				console.log( "Marcardas todas como leídas");
			});
		};

		$scope.markAsRead = function(notice){
			noticeService.markAsRead(notice).then(function(unread){
				$scope.unread = unread;
				console.log(notice.id, "Marcarda como leída");
			});
		};

		$scope.deleteAll = function(){
			noticeService.delete().then(function(result){
				$scope.unread = result.unread;
				$scope.notices = result.notices;
				console.log("ELiminar todo");
			});
		};

		$scope.delete = function(notice){
			noticeService.delete(notice).then(function(result){
				$scope.unread = result.unread;
				$scope.notices = result.notices;
				console.log("Eliminar", notice.id);
			});
		};
	}]);

})();